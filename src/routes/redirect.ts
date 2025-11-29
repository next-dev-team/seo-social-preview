import express from 'express';
import fs from 'fs';
import path from 'path';
import { getLinkByShortCode, trackClick } from '../services/link.service';
import { isSocialBot } from '../services/userAgent.service';

const router = express.Router();
const templatePath = path.join(__dirname, '../templates/preview.html');

router.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  const userAgent = req.headers['user-agent'] || '';
  
  try {
    const link = await getLinkByShortCode(shortCode);
    
    if (!link) {
      return res.status(404).send('Link not found');
    }
    
    // Track click/view
    // Ideally we track differently for bots vs humans, but track all for now
    await trackClick(link.id, userAgent, req.ip || 'unknown');

    if (isSocialBot(userAgent)) {
      // Serve Preview
      let template = fs.readFileSync(templatePath, 'utf-8');
      
      // Replace placeholders
      // Ensure we have absolute URLs for images if possible, but stored imageUrl might be relative or absolute.
      // PRD says "Support HTTPS", "Recommended size".
      // We assume imageUrl stored is usable.
      
      const html = template
        .replace(/{{title}}/g, link.title || '')
        .replace(/{{description}}/g, link.description || '')
        .replace(/{{imageUrl}}/g, link.imageUrl || '')
        .replace(/{{url}}/g, link.originalUrl);
        
      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    } else {
      // Redirect Human
      return res.redirect(302, link.originalUrl);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

export default router;
