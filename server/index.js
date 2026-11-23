// Local development server: `npm run dev` (needs MONGODB_URI in server/.env or the environment).
// On Vercel the same app runs as a serverless function from api/index.js instead.
import { createApp, connectDB } from "./app.js";

const PORT = process.env.PORT || 5000;

try {
  process.loadEnvFile?.(".env");
} catch {
  /* no .env file: use the real environment */
}

try {
  await connectDB();
  console.log("Connected to MongoDB");
} catch (err) {
  console.error("Failed to connect to MongoDB:", err.message);
  process.exit(1);
}

createApp().listen(PORT, () => console.log(`Mini CRM API listening on port ${PORT}`));
