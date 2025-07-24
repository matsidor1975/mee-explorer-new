import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Since we're making direct API calls from the frontend to Biconomy Network,
  // we don't need backend API routes for this explorer.
  // All hash data is fetched directly from the Biconomy API.

  const httpServer = createServer(app);

  return httpServer;
}
