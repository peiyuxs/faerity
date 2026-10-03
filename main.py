import asyncio
import os
from pathlib import Path

import asyncpg
from dotenv import load_dotenv


load_dotenv(Path(__file__).with_name("tiger-cloud-faerity-credentials.env"))


async def main():
    conn = await asyncpg.connect(
        host=os.environ["PGHOST"],
        port=int(os.getenv("PGPORT", "5432")),
        user=os.environ["PGUSER"],
        password=os.environ["PGPASSWORD"],
        database=os.environ["PGDATABASE"],
        ssl=os.getenv("PGSSLMODE", "require"),
        timeout=10,
    )
    try:
        version = await conn.fetchval("SELECT version()")
        print("Connected to Tiger Cloud successfully.")
        print(version)
    finally:
        await conn.close()

asyncio.run(main())