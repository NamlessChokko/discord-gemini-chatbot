const Sentry = require("@sentry/node");

// Ensure to call this before requiring any other modules!
Sentry.init({
    dsn: "https://b4f7e39e525cdc61e74146d36e62f5f6@o4509181755260928.ingest.us.sentry.io/4509181755523072",
    integrations: [Sentry.browserTracingIntegration()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});