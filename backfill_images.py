import asyncio
import os
import time
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


def api_get(path):
    r = requests.get(f"{API}{path}", headers=HEADERS)
    if r.status_code in (403, 429):
        raise SystemExit(f"Stopped: HTTP {r.status_code}. {r.text[:200]}")
    r.raise_for_status()
    print("  requests left today:", r.headers.get("X-RateLimit-Remaining"))
    return r.json()


async def main():
    conn = await db.get_conn()
    try:
        rows = await conn.fetch(
            "SELECT id FROM plants WHERE image_attribution IS NULL ORDER BY id"
        )
        updated = 0
        for row in rows:
            p = api_get(f"/plants/{row['id']}")
            images = p.get("images") or []
            if images:
                img = images[0]
                await conn.execute(
                    "UPDATE plants SET thumbnail = $1, image_attribution = $2, "
                    "image_license = $3 WHERE id = $4",
                    img.get("url"), img.get("attribution"), img.get("license"), row["id"],
                )
                updated += 1
            else:
                print("no images for plant", row["id"])
            time.sleep(0.2)
        print(f"Updated {updated} of {len(rows)} plants")
    finally:
        await conn.close()


asyncio.run(main())