import os from "os";
import Sentry from "@sentry/node";

import { port } from "./config/environment/index.js";
import app from "./app.js";
import connectDB from "./db/index.js";

const start = async () => {
  try {
    await connectDB();
    await new Promise((resolve) => app.listen({ port }, resolve));
    console.log(`🚀  GraphQL server running at port: ${port}`);
  } catch (e) {
    console.log("Not able to run GraphQL server", e);
  }
};

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  release: process.env.DEPLOYMENT_VERSION || "latest",
  environment: process.env.HOSTNAME || os.hostname(),
  initialScope: {
    tags: { component: "batch-service" },
  },
});

await start();
