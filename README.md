# Mini CRM

A lead-management CRM for small teams. Add leads, move each one through
**New → Contacted → Converted**, and track the pipeline on a dashboard with live
counts and a pie chart.

**Live demo:** https://akki07-hub.github.io/FUTURE_FS_02/

## How data is stored

Leads are saved in the browser with **localStorage**, so the demo works with no
server, database or sign-up. Each visitor gets their own copy, starting with 5
sample leads, and it stays after reloading. **Reset Demo** restores the samples.

All storage goes through `src/api.js` (async functions), so the app can be
connected to a real backend later without changing the UI.

## Tech stack

React 19 · Vite · Recharts · localStorage · GitHub Pages

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173/FUTURE_FS_02/
```

## Deploy

```bash
npm run build    # outputs dist/
```
Publish the `dist/` folder to the `gh-pages` branch.

Built during the Future Interns Full Stack Web Development internship.
