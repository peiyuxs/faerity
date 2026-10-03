import asyncio, os, time, requests
import db

API = "https://edibleplantdb.org/api/v1"
HEADERS = {"Authorization": f"Bearer {os.environ['EPDB_API_KEY']}"}
MAX_PLANTS = 200

def api_get(path, **params):
    r = requests.get(f"{API}{path}", headers=HEADERS, params=params)
    if r.status_code == 429:
        raise SystemExit("Rate limit hit; try again after midnight UTC")
    r.raise_for_status()
    print("Requests left today:", r.headers.get("X-RateLimit-Remaining"))
    return r.json()

FAMILIES = ["Rosaceae", "Fabaceae", "Solanaceae", "Brassicaceae", "Lamiaceae"]
PER_FAMILY = 60

async def main():
    await db.init_schema()
    existing = await db.get_existing_ids()  # new helper, below

    for family in FAMILIES:
        listing = api_get("/plants", family=family, limit=PER_FAMILY)
        items = listing["data"] if isinstance(listing, dict) and "data" in listing else listing
        rows = []
        for item in items:
            if item["id"] in existing:
                continue  # already have it, no request spent
            p = api_get(f"/plants/{item['id']}")
            rows.append(tuple(p.get(f) for f in db.FIELDS))
            time.sleep(0.2)
        await db.upsert_plants(rows)
        print(f"{family}: inserted {len(rows)}")

asyncio.run(main())