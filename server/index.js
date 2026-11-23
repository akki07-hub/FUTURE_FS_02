// Mini CRM API — Express + MongoDB (Mongoose)
//
// Endpoints
//   GET    /api/health              -> { ok: true }
//   GET    /api/leads               -> newest first
//   POST   /api/leads               -> { name, email }      creates a "new" lead
//   PATCH  /api/leads/:id/status    -> { status }           new | contacted | converted
//
// Environment
//   MONGODB_URI       MongoDB Atlas connection string (required)
//   PORT              default 5000 (Render sets this automatically)
//   ALLOWED_ORIGINS   comma-separated sites allowed to call the API

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  "https://akki07-hub.github.io,http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const STATUSES = ["new", "contacted", "converted"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Model ───────────────────────────────────────────────────
const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    status: { type: String, enum: STATUSES, default: "new" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: {
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);
const Lead = mongoose.model("Lead", leadSchema);

const SAMPLE_LEADS = [
  { name: "Priya Sharma", email: "priya@example.com", status: "new" },
  { name: "Rahul Verma", email: "rahul@example.com", status: "contacted" },
  { name: "Ananya Reddy", email: "ananya@example.com", status: "converted" },
  { name: "Karthik Rao", email: "karthik@example.com", status: "new" },
  { name: "Sneha Patel", email: "sneha@example.com", status: "contacted" },
];

// ── App ─────────────────────────────────────────────────────
export function createApp() {
  const app = express();

  app.use(
    cors({
      origin(origin, cb) {
        // Allow same-origin tools (curl, health checks) and listed sites
        if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
        return cb(null, false);
      },
      methods: ["GET", "POST", "PATCH"],
    })
  );
  app.use(express.json({ limit: "10kb" }));

  app.get("/", (_req, res) => res.json({ name: "Mini CRM API", ok: true }));
  app.get("/api/health", (_req, res) =>
    res.json({ ok: true, db: mongoose.connection.readyState === 1 })
  );

  app.get("/api/leads", async (_req, res, next) => {
    try {
      const leads = await Lead.find().sort({ created_at: -1 }).limit(500);
      res.json(leads);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/leads", async (req, res, next) => {
    try {
      const name = String(req.body?.name ?? "").trim();
      const email = String(req.body?.email ?? "").trim();
      if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required." });
      }
      if (!EMAIL_RE.test(email)) {
        return res.status(400).json({ error: "Enter a valid email address." });
      }
      const lead = await Lead.create({ name, email, status: "new" });
      res.status(201).json(lead);
    } catch (err) {
      next(err);
    }
  });

  app.patch("/api/leads/:id/status", async (req, res, next) => {
    try {
      const { id } = req.params;
      const status = String(req.body?.status ?? "");
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid lead id." });
      }
      if (!STATUSES.includes(status)) {
        return res.status(400).json({ error: "Status must be new, contacted or converted." });
      }
      const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
      if (!lead) return res.status(404).json({ error: "Lead not found." });
      res.json(lead);
    } catch (err) {
      next(err);
    }
  });

  app.use((_req, res) => res.status(404).json({ error: "Not found." }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  });

  return app;
}

export async function seedIfEmpty() {
  if ((await Lead.estimatedDocumentCount()) === 0) {
    await Lead.insertMany(SAMPLE_LEADS);
    console.log(`Seeded ${SAMPLE_LEADS.length} sample leads`);
  }
}

// ── Start ───────────────────────────────────────────────────
async function start() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set. Add it in your environment (see .env.example).");
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  console.log("Connected to MongoDB");
  await seedIfEmpty();
  createApp().listen(PORT, () => console.log(`Mini CRM API listening on port ${PORT}`));
}

if (process.env.NODE_ENV !== "test") {
  start().catch((err) => {
    console.error("Failed to start:", err.message);
    process.exit(1);
  });
}
