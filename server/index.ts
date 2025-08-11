import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { getHashDetails, generateMetaTags, generateDynamicHTML } from "./meta-generator";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Allow iframe embedding by removing X-Frame-Options restrictions
app.use((req: Request, res: Response, next: NextFunction) => {
  // Remove X-Frame-Options to allow iframe embedding
  res.removeHeader('X-Frame-Options');
  
  // Set CSP to allow iframe embedding from any origin
  res.setHeader('Content-Security-Policy', "frame-ancestors *;");
  
  // Alternatively, you can set X-Frame-Options to ALLOWALL (non-standard but widely supported)
  // res.setHeader('X-Frame-Options', 'ALLOWALL');
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Add dynamic meta tag route for supertransaction details
  app.get('/supertransaction/:hash', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { hash } = req.params;
      
      // Validate hash format
      const hashRegex = /^0x[a-fA-F0-9]{64}$/;
      if (!hashRegex.test(hash)) {
        return next(); // Let client handle invalid hashes
      }
      
      // Check if this is a bot/crawler requesting the page
      const userAgent = req.get('User-Agent') || '';
      const isBotOrCrawler = /bot|crawler|spider|crawling|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|slackbot|discordbot/i.test(userAgent);
      
      // Also check for specific crawler headers
      const isOpenGraphRequest = req.get('Accept')?.includes('text/html') && 
                                 (isBotOrCrawler || req.get('X-Purpose') === 'preview');
      
      if (isBotOrCrawler || isOpenGraphRequest) {
        try {
          const hashDetails = await getHashDetails(hash);
          const metaTags = generateMetaTags(hashDetails, hash);
          const html = generateDynamicHTML(metaTags);
          
          res.setHeader('Content-Type', 'text/html');
          return res.send(html);
        } catch (error) {
          console.error('Error generating meta tags:', error);
          // Fall through to serve normal client app
        }
      }
      
      // For regular browsers, serve the normal client app
      next();
    } catch (error) {
      console.error('Error in supertransaction route:', error);
      next();
    }
  });

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
