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

await start();
