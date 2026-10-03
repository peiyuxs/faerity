"""Import text fields from the Edible Plant Database offline ZIM archive.

The archive includes third-party material. Per the source's licensing page,
the core plant data is provided for educational/non-commercial use; preserve
attribution to Food Plants International / Bruce French. This importer skips
images and never overwrites existing rows. Run without --apply to dry-run.
"""

import argparse
import asyncio
import re
from pathlib import Path

from bs4 import BeautifulSoup
from libzim.reader import Archive
from libzim.search import Query, Searcher

import db

ARCHIVE_PATH = Path(__file__).with_name("edibleplantdb.zim")
PLANT_PATH = re.compile(r"^plants/(\d+)/")


def _section(main, heading_text):
    heading = next(
        (h for h in main.find_all("h2") if h.get_text(" ", strip=True) == heading_text),
        None,
    )
    return heading.parent if heading else None


def _paragraphs(section):
    if section is None:
        return []
    return [p.get_text(" ", strip=True) for p in section.find_all("p") if p.get_text(" ", strip=True)]


def parse_plant(article_path, archive):
    """Extract a plant page into the existing db.FIELDS order."""
    entry = archive.get_entry_by_path(article_path)
    html = bytes(entry.get_item().content)
    soup = BeautifulSoup(html, "html.parser")
    main = soup.find("main")
    match = PLANT_PATH.match(article_path)
    if main is None or match is None:
        raise ValueError(f"Unexpected plant article path or markup: {article_path}")

    scientific_name = main.find("h1")
    if scientific_name is None:
        raise ValueError(f"Plant article has no scientific name: {article_path}")
    scientific_name = scientific_name.get_text(" ", strip=True)

    header = main.find("header")
    header_paragraphs = header.find_all("p") if header else []
    common_names = header_paragraphs[-1].get_text(" ", strip=True) if len(header_paragraphs) > 1 else None
    family_link = header.select_one("a.badge[href*='/families/']") if header else None
    family = family_link.get_text(" ", strip=True) if family_link else None

    edible_paragraphs = _paragraphs(_section(main, "What to Eat"))
    edible_portion = None
    if edible_paragraphs and edible_paragraphs[0].lower().startswith("edible parts:"):
        edible_portion = edible_paragraphs.pop(0).split(":", 1)[1].strip() or None
    edible_uses = "\n\n".join(edible_paragraphs) or None

    description = "\n\n".join(_paragraphs(_section(main, "How to Identify"))) or None
    found_in = "\n\n".join(_paragraphs(_section(main, "Where to Find It"))) or None

    return (
        int(match.group(1)),
        scientific_name,
        common_names,
        family,
        edible_portion,
        edible_uses,
        description,
        found_in,
    )


def read_plants(archive_path=ARCHIVE_PATH, limit=None):
    """Read indexed plant detail pages from the local ZIM; makes no network calls."""
    archive = Archive(str(archive_path))
    search = Searcher(archive).search(Query().set_query("edible"))
    paths = search.getResults(0, search.getEstimatedMatches())

    rows = []
    seen_ids = set()
    duplicate_ids = []
    for path in paths:
        if not PLANT_PATH.match(path):
            continue
        row = parse_plant(path, archive)
        if row[0] in seen_ids:
            duplicate_ids.append(row[0])
            continue
        seen_ids.add(row[0])
        rows.append(row)
        if limit is not None and len(rows) >= limit:
            break
    return rows, duplicate_ids


async def main():
    parser = argparse.ArgumentParser(description="Import plant text from edibleplantdb.zim")
    parser.add_argument(
        "--apply",
        action="store_true",
        help="write missing plant rows to Tiger Cloud (existing IDs are never overwritten)",
    )
    parser.add_argument("--limit", type=int, help="only inspect/import the first N unique plants")
    parser.add_argument("--archive", type=Path, default=ARCHIVE_PATH, help="path to a ZIM archive")
    args = parser.parse_args()

    if args.limit is not None and args.limit < 1:
        parser.error("--limit must be a positive integer")

    if not args.archive.is_file():
        raise SystemExit(f"ZIM archive not found: {args.archive}")

    print(f"Reading local archive: {args.archive} ({args.archive.stat().st_size:,} bytes)")
    rows, duplicate_ids = read_plants(args.archive, args.limit)
    print(f"Plant records parsed: {len(rows):,}")
    print(f"Duplicate IDs skipped: {len(duplicate_ids):,}")
    print("Sample records (ID, scientific name, common name):")
    for row in rows[:5]:
        print(f"  {row[0]} | {row[1]} | {row[2] or '(no common name)'}")

    invalid = [row for row in rows if not row[0] or not row[1]]
    if invalid:
        raise SystemExit(f"Validation failed: {len(invalid)} row(s) lack required ID/name; no database writes made.")

    if not args.apply:
        print("Dry run only; Tiger Cloud was not contacted. Add --apply to insert missing rows.")
        return

    await db.init_schema()
    inserted = await db.insert_plants_if_missing(rows)
    print(f"Inserted {inserted:,} new rows; existing plant IDs were left unchanged.")


if __name__ == "__main__":
    asyncio.run(main())