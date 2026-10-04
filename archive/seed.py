import asyncio
import os
import time
from pathlib import Path

import requests
from dotenv import load_dotenv

import db

load_dotenv(Path(__file__).resolve().parent.parent / "tiger-cloud-faerity-credentials.env")
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

API = "https://edibleplantdb.org/api/v1"
HEADERS = {
    "Authorization": f"Bearer {os.environ['EPDB_KEY']}",
    "User-Agent": "faerity-hackathon/0.1 (student project)",
}

FAMILIES = ["Rosaceae", "Fabaceae", "Solanaceae", "Brassicaceae", "Lamiaceae"]
PER_FAMILY = 60


def api_get(path, **params):
    r = requests.get(f"{API}{path}", headers=HEADERS, params=params)
    if r.status_code in (403, 429):
        raise SystemExit(f"Stopped: HTTP {r.status_code}. {r.text[:200]}")
    r.raise_for_status()
    print("  requests left today:", r.headers.get("X-RateLimit-Remaining"))
    return r.json()


async def main():
    await db.init_schema()
    existing = await db.get_existing_ids()

    for family in FAMILIES:
        listing = api_get("/plants", family=family, limit=PER_FAMILY)
        rows = []
        for item in listing["results"]:
            if item["id"] in existing:
                continue  # already saved, no request spent
            p = api_get(f"/plants/{item['id']}")
            rows.append(tuple(p.get(f) for f in db.FIELDS))
            time.sleep(0.2)
        await db.upsert_plants(rows)
        print(f"{family}: saved {len(rows)} new plants")


asyncio.run(main())