import json
import os
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).with_name(".env"))

headers = {
    "Authorization": f"Bearer {os.environ['EPDB_KEY']}",
    "User-Agent": "faerity-hackathon/0.1 (student project)",
}
r = requests.get("https://edibleplantdb.org/api/v1/plants/8727", headers=headers)
print(r.status_code)
print(json.dumps(r.json().get("images"), indent=2)[:1500])