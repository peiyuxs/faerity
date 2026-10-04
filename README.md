This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Archived scripts

The legacy Python database/seed scripts, their Python requirements, unused
dummy Gemini endpoint, and unreferenced older `Card` component are in
[`archive/`](archive/). The Next.js app does not need them to run: PostgreSQL
access is implemented in `lib/db.ts`, and plant search is handled by
`/api/plants/search`. These files are retained only for reference and one-off
legacy data work.

## Plant sections and click tracking

The homepage loads plants from the PostgreSQL `plants` table. The featured plant
is selected deterministically from a hash of the current UTC hour, so every
visitor sees the same plant during an hour and the selection changes hourly
(daily rotation can be restored by changing the bucket to a UTC day). Popular
plants are sorted by `click_count` descending, `last_clicked_at` descending with
null timestamps last, then common name alphabetically (scientific name when the
common name is empty).

The first setup against an existing database must apply
[`database/migrations/001_plant_click_tracking.sql`](database/migrations/001_plant_click_tracking.sql)
once. It adds `click_count` and `last_clicked_at` and creates the ranking index.
The local Next.js server loads connection settings from the ignored
`tiger-cloud-faerity-credentials.env` file; deployed environments should provide
the equivalent `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, and
`PGSSLMODE` environment variables (or `TIMESCALE_SERVICE_URL`).

The PostgreSQL client honors `PGSSLMODE`. `require` encrypts traffic but does not
verify the server certificate unless the connection string also provides a
trusted root certificate. For certificate and hostname verification, use
`PGSSLMODE=verify-full` and configure the database provider's trusted CA.

## Gemini setup

Plant search uses the `gemini-3.5-flash-lite` model through the Gemini API.
Set `GEMINI_KEY` in the ignored project-root `.env` file. Never commit or
share the key. Requests may incur charges.

The `/ask` search makes one Gemini request per search to plan its three result
groups. Set `USE_GEMINI_SEARCH` to `false` in `lib/geminiPlantSearch.ts` to
skip Gemini; direct database search still works, but related and in-season
suggestions are omitted.

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
