import os
from pathlib import Path

import asyncpg
from dotenv import load_dotenv


load_dotenv(Path(__file__).with_name("tiger-cloud-faerity-credentials.env"))

FIELDS = ["id", "scientific_name", "common_names", "family", "edible_portion", "edible_uses", "description", "found_in"]

SCHEMA = """
CREATE TABLE IF NOT EXISTS plants(
    id INTEGER PRIMARY KEY,
    scientific_name TEXT NOT NULL,
    common_names TEXT,
    family TEXT,
    edible_portion TEXT,
    edible_uses TEXT,
    description TEXT,
    found_in TEXT,
    fetched_at TIMESTAMPTZ DEFAULT now()
);
"""

async def get_conn():
    return await asyncpg.connect(
        host=os.environ["PGHOST"],
        port=int(os.getenv("PGPORT", "5432")),
        user=os.environ["PGUSER"],
        password=os.environ["PGPASSWORD"],
        database=os.environ["PGDATABASE"],
        ssl=os.getenv("PGSSLMODE", "require"),
        timeout=10,
    )

async def init_schema():
    conn = await get_conn()
    try:
        await conn.execute(SCHEMA)
    finally:
        await conn.close()

async def upsert_plants(rows):
    """rows: list of tuples in FIELDS order."""
    placeholders = ", ".join(f"${i + 1}" for i in range(len(FIELDS)))
    updates = ", ".join(f"{f} = EXCLUDED.{f}" for f in FIELDS[1:])
    conn = await get_conn()
    try:
        await conn.executemany(
            f"""
            INSERT INTO plants ({", ".join(FIELDS)})
            VALUES ({placeholders})
            ON CONFLICT (id) DO UPDATE SET {updates}, fetched_at = now()
            """,
            rows,
        )
    finally:
        await conn.close()


async def get_plant(plant_id):
    conn = await get_conn()
    try:
        return await conn.fetchrow(
            f"SELECT * FROM plants WHERE id = $1", plant_id
        )
    finally:
        await conn.close()

async def get_existing_ids():
    conn = await get_conn()
    try:
        rows = await conn.fetch("SELECT id FROM plants")
        return {r["id"] for r in rows}
    finally:
        await conn.close()