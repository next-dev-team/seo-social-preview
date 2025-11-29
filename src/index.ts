import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import linksRouter from './routes/links';
import redirectRouter from './routes/redirect';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: false // Disable CSP for simplicity with inline scripts/styles in dev
}));
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/links', linksRouter);

// Redirect Route (Catch-all for short codes)
// Note: This must be after static files so we don't intercept index.html etc.
app.use('/', redirectRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
