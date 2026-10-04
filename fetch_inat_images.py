import asyncio
import time

import requests

import db

INAT = "https://api.inaturalist.org/v1/taxa"
session = requests.Session()
session.headers.update({"User-Agent": "faerity-hackathon/0.1 (student project)"})


def inat_get(params):
    """GET with retries. Returns parsed JSON, or None if it keeps failing."""
    for attempt in range(1, 4):
        try:
            r = session.get(INAT, params=params, timeout=20)
            if r.status_code == 429:
                print("  rate limited, waiting 30s...")
                time.sleep(30)
                continue
            r.raise_for_status()
            return r.json()
        except requests.exceptions.RequestException as e:
            print(f"  network error (attempt {attempt}/3): {type(e).__name__}")
            time.sleep(5 * attempt)
    return None


def pick_photo(taxon):
    candidates = []
    if taxon.get("default_photo"):
        candidates.append(taxon["default_photo"])
    for tp in taxon.get("taxon_photos") or []:
        if tp.get("photo"):
            candidates.append(tp["photo"])
    for p in candidates:
        if p.get("medium_url") and p.get("license_code"):
            return p["medium_url"], p.get("attribution"), p["license_code"]
    return None


def find_photo(name):
    """Returns (status, photo): ok / no_taxon / no_photo / error."""
    names = [name]
    base = " ".join(name.split()[:2])  # species name for varieties and subspecies
    if base.lower() != name.lower():
        names.append(base)

    matched_taxon = False
    for n in names:
        data = inat_get({"q": n, "per_page": 5})
        if data is None:
            return "error", None
        for t in data.get("results", []):
            if t.get("name", "").lower() == n.lower():
                matched_taxon = True
                photo = pick_photo(t)
                if photo:
                    return "ok", photo
                break
    return ("no_photo" if matched_taxon else "no_taxon"), None


async def main():
    conn = await db.get_conn()
    try:
        rows = await conn.fetch(
            "SELECT id, scientific_name FROM plants "
            "WHERE thumbnail IS NULL OR thumbnail LIKE 'https://edibleplantdb.org/%' "
            "ORDER BY id"
        )
        ok = cleared = errors = 0
        for row in rows:
            name = row["scientific_name"]
            status, photo = find_photo(name)
            if status == "ok":
                url, attribution, license_code = photo
                await conn.execute(
                    "UPDATE plants SET thumbnail = $1, image_attribution = $2, "
                    "image_license = $3 WHERE id = $4",
                    url, attribution, license_code, row["id"],
                )
                ok += 1
            elif status == "error":
                errors += 1
                print("skipped (network problem, will retry next run):", name)
            else:
                await conn.execute(
                    "UPDATE plants SET thumbnail = NULL, image_attribution = NULL, "
                    "image_license = NULL WHERE id = $1",
                    row["id"],
                )
                cleared += 1
                print(f"no photo ({status}):", name)
            time.sleep(1.5)
        print(f"Done. photos: {ok}, no photo: {cleared}, network errors: {errors}")
    finally:
        await conn.close()


asyncio.run(main())