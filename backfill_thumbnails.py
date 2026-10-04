import asyncio
import os
from pathlib import Path

import requests
from dotenv import load_dotenv

import db

load_dotenv(Path(__file__).with_name("tiger-cloud-faerity-credentials.env"))
load_dotenv(Path(__file__).with_name(".env"))

API = "https://edibleplantdb.org/api/v1"
HEADERS = {
    "Authorization": f"Bearer {os.environ['EPDB_KEY']}",
    "User-Agent": "faerity-hackathon/0.1 (student project)",
}
MAX_PAGES = 5  # per family, to cap requests


def api_get(path, **params):
    r = requests.get(f"{API}{path}", headers=HEADERS, params=params)
    if r.status_code in (403, 429):
        raise SystemExit(f"Stopped: HTTP {r.status_code}. {r.text[:200]}")
    r.raise_for_status()
    print("  requests left today:", r.headers.get("X-RateLimit-Remaining"))
    return r.json()


async def main():
    conn = await db.get_conn()
    try:
        rows = await conn.fetch(
            "SELECT id, family FROM plants WHERE thumbnail IS NULL AND family IS NOT NULL"
        )
        by_family = {}
        for r in rows:
            by_family.setdefault(r["family"], set()).add(r["id"])

        for family, missing in by_family.items():
            offset, pages = 0, 0
            while missing and pages < MAX_PAGES:
                data = api_get("/plants", family=family, limit=100, offset=offset)
                results = data["results"]
                if not results:
                    break
                for item in results:
                    if item["id"] in missing and item.get("thumbnail"):
                        await conn.execute(
                            "UPDATE plants SET thumbnail = $1 WHERE id = $2",
                            item["thumbnail"], item["id"],
                        )
                        missing.discard(item["id"])
                offset += len(results)
                pages += 1
                if offset >= data["total"]:
                    break
            print(f"{family}: {len(missing)} still without a thumbnail")
    finally:
        await conn.close()


asyncio.run(main())