// Vercel serverless entry point: every request is routed here (see ../vercel.json)
// and handled by the same Express app used for local development.
import { createApp } from "../app.js";

export default createApp();
