This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Python / Tiger Cloud Setup

The Python script connects to Tiger Cloud using `asyncpg`. Use Python 3.10 or newer. Run these commands from the project folder (the folder containing `requirements.txt`).

### 1. Create the virtual environment

Create it once per checkout. On Windows, use PowerShell:

```powershell
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
```

On macOS/Linux, use a terminal:

```sh
python3 -m venv .venv
source .venv/bin/activate
```

In Git Bash on Windows, activate it with `source .venv/Scripts/activate`.

### 2. Install Python packages

With the environment activated, install the dependencies:

```sh
python -m pip install -r requirements.txt
```

The environment name `(.venv)` should appear at the start of the terminal prompt. To leave it later, run `deactivate`.

### 3. Add Tiger Cloud credentials

Get the database credentials from the team’s approved secure channel. Copy [tiger-cloud-faerity-credentials.example.env](tiger-cloud-faerity-credentials.example.env) to `tiger-cloud-faerity-credentials.env`, then replace the example values with the real `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, and `PGSSLMODE` values. Keep the real credentials file private; it is excluded from Git.

Copy command in PowerShell:

```powershell
Copy-Item tiger-cloud-faerity-credentials.example.env tiger-cloud-faerity-credentials.env
```

Copy command in macOS/Linux/Git Bash:

```sh
cp tiger-cloud-faerity-credentials.example.env tiger-cloud-faerity-credentials.env
```

### 4. Test the connection

With `.venv` active and the credentials file filled in, run:

```sh
python main.py
```

A successful connection prints a success message and the PostgreSQL server version. If Python cannot find a package, confirm `.venv` is active and repeat the install command. In VS Code, select `.venv/Scripts/python.exe` on Windows or `.venv/bin/python` on macOS/Linux using **Python: Select Interpreter**.

Activation is optional if you invoke the environment's Python directly: on Windows run `.venv/Scripts/python.exe main.py`; on macOS/Linux run `.venv/bin/python main.py`.

### 5. Set up and test Gemini

Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey). Copy [gemini.env.example](gemini.env.example) to `.env`, then replace the placeholder for `GEMINI_KEY` with your own key. `.env` is ignored by Git; do not commit it or share the key. Each teammate should use their own authorized key.

Copy in PowerShell:

```powershell
Copy-Item gemini.env.example .env
```

Copy in macOS/Linux/Git Bash:

```sh
cp gemini.env.example .env
```

With `.venv` active, run `python gemini.py` (or `.venv/Scripts/python.exe gemini.py` on Windows without activating). The script sends a short prompt to Gemini and prints the response; API access and usage limits may apply. If it reports `Missing GEMINI_KEY`, check that `.env` exists in the project folder and that the key value is filled in.

### 6. Import plants from the offline Edible Plant Database archive

Place the complete `edibleplantdb.zim` archive in the project folder. Run `python seed.py` first to parse and validate the archive locally; this default dry run does not connect to Tiger Cloud. To insert a small test batch, run `python seed.py --apply --limit 5`. To import all records, run `python seed.py --apply`. Existing plant IDs are skipped and never overwritten. The importer reads text only and does not import archive images.

The archive's licensing page states that core plant data is provided for educational/non-commercial use and attributes it to Food Plants International / Bruce French. Check the source terms before using this data commercially, and retain that attribution when redistributing it.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
