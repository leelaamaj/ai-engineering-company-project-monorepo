# TrackFlow Talent Pipeline Tracker

TrackFlow’s People & Talent team uses this app to manage the Executive Assistant recruitment campaign at its Zaragoza headquarters. The list supports filtering by status and stage, name or email search, and pagination. Open a candidate to update the pipeline, edit contact details, or manage internal notes.

## Run locally

Use Node.js 22.18 or later. From this directory, run:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open [localhost:3000](http://localhost:3000). `NEXT_PUBLIC_API_URL` points to the [4Geeks tracker API](https://playground.4geeks.com/tracker/api/v1/docs). The course API is shared, so use the local fixture for practice writes.

## Verify

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

To exercise the workflows with synthetic data, start `node tests/fixture.mjs` in one terminal. In another terminal run `NEXT_PUBLIC_API_URL=http://127.0.0.1:4311 npm run dev -- --port 4310`, then open [localhost:4310](http://localhost:4310). The fixture resets when restarted. Search for `retry once` to trigger a recoverable list error, or use `rejected@example.test` during registration to test submission feedback.

The [rubric verification](verification.md) maps the 36 course items to the implementation and checks.
