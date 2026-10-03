import asyncio
import db

asyncio.run(db.init_schema())
print("Table created")