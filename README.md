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

### 5. Set up and test Gemini (Google Cloud ADC)

The organization policy shown in the console disallows API keys, so use Application Default Credentials (ADC) instead. No Gemini API key is needed. Your Google Cloud project must have billing enabled, the Vertex AI API enabled, and your account granted the **Vertex AI User** role (`roles/aiplatform.user`). Ask your Google Cloud administrator to enable/grant these if you do not have permission.

1. Install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) for Windows, then open a **new** terminal.
2. Sign in to the CLI and choose the Google Cloud project to use:

	```powershell
	gcloud init
	```

3. Create local ADC credentials for the Python client (this opens a Google sign-in page):

	```powershell
	gcloud auth application-default login
	```

	`gcloud init` alone is not enough; Python client libraries use the separate ADC login above.

4. In the project-root `.env` file, set your Google Cloud **project ID** (not its display name) and the location approved for your model. The default in this script is `global`:

	```dotenv
	GOOGLE_CLOUD_PROJECT=your-google-cloud-project-id
	GOOGLE_CLOUD_LOCATION=global
	```

	The `.env` file is ignored by Git. Do not put credentials in it or commit it. Remove the old `GEMINI_KEY` entry; API-key authentication is not used by this script.

5. With `.venv` active, test it from the project folder:

	```powershell
	python gemini.py
	```

	Or without activating the environment:

	```powershell
	.\.venv\Scripts\python.exe gemini.py
	```

The script should print Gemini's response. Requests go through the selected Google Cloud project and may incur charges. For teammates, each person should install the CLI and run the ADC login with their own Google account; do not share ADC credential files. See Google's [ADC setup](https://docs.cloud.google.com/docs/authentication/provide-credentials-adc) and [Agent Platform quickstart](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/start) for details.

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
