const Sentry = require("@sentry/node");

Sentry.init({
    dsn: process.env.SENTRY_DSN, // usa la variable de entorno mejor
    tracesSampleRate: 1.0,       // puedes bajarlo a 0.1 en producción si quieres
});
