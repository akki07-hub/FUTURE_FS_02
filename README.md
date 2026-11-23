# Mini CRM

A lead-management CRM for small teams. Add leads, move each one through
**New → Contacted → Converted**, and track the pipeline on a dashboard with live
counts and a pie chart.

**Live demo:** https://akki07-hub.github.io/FUTURE_FS_02/
(The free API server sleeps when idle, so the first load can take up to a minute.)

## Tech stack

| Part | Technology |
|---|---|
| Frontend | React 19, Vite, Recharts — hosted on GitHub Pages |
| Backend | Node.js, Express 5 — hosted on Render |
| Database | MongoDB Atlas with Mongoose |

## API

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/api/health` | – | Server and database status |
| GET | `/api/leads` | – | All leads, newest first |
| POST | `/api/leads` | `{ name, email }` | Create a lead (status `new`) |
| PATCH | `/api/leads/:id/status` | `{ status }` | `new`, `contacted` or `converted` |

Inputs are validated on the server, and CORS only allows this site and local development.
An empty database is seeded with 5 sample leads on first start.

## Run locally

```bash
# 1. API
cd server
cp .env.example .env        # then put your MongoDB connection string in .env
npm install
npm run dev                  # http://localhost:5000

# 2. Frontend (in another terminal, from the project root)
cp .env.example .env         # VITE_API_URL=http://localhost:5000
npm install
npm run dev                  # http://localhost:5173/FUTURE_FS_02/
```

## Deploy

- **API:** create a Render web service from this repo using `render.yaml`
  (root directory `server`) and set `MONGODB_URI`.
- **Frontend:** build with `VITE_API_URL=<your Render URL> npm run build`
  and publish `dist/` to the `gh-pages` branch.

Built during the Future Interns Full Stack Web Development internship.
