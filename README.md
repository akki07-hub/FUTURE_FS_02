# Mini CRM

A lead-management CRM for small teams. Add leads, move each one through
**New → Contacted → Converted**, and track the pipeline on a dashboard with live
counts and a pie chart.

**Live demo:** https://akki07-hub.github.io/FUTURE_FS_02/

## Tech stack

| Part | Technology |
|---|---|
| Frontend | React 19, Vite, Recharts — hosted on GitHub Pages |
| Backend | Node.js, Express 5 — Vercel serverless function |
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

**API (Vercel)**
1. Import this repo in Vercel and set **Root Directory** to `server`.
2. Add the environment variable `MONGODB_URI` (your MongoDB Atlas connection string).
3. Deploy. `server/vercel.json` routes every request to `server/api/index.js`.

**Frontend (GitHub Pages)**
Build with `VITE_API_URL=<your Vercel URL> npm run build` and publish `dist/` to the `gh-pages` branch.

Built during the Future Interns Full Stack Web Development internship.
