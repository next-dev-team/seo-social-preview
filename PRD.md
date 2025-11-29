Social SEO Preview Service - Agent Prompt
Core Objective
Build a link shortening service that generates rich social media previews (Open Graph/Twitter Card) for any URL, similar to Firebase Dynamic Links' preview functionality, but without actual deep linking - purely focused on beautiful, consistent social sharing previews across all platforms.
System Architecture

1. Link Shortening Layer

Generate short, memorable URLs (e.g., yourdomain.com/abc123)
Store mapping: short URL → original destination URL
Track click analytics (optional but recommended)
Support custom slugs for branded links

2. Dynamic Preview Generation
When a social media bot (Facebook, Twitter, LinkedIn, etc.) requests your short URL:
Detection Logic:

Identify user agent (social media crawlers vs regular users)
Social bots: facebookexternalhit, Twitterbot, LinkedInBot, WhatsApp, etc.
Regular users: Redirect immediately to destination

For Social Media Bots:
Serve a dynamic HTML page with rich meta tags:
Required Meta Tags Structure:

- Open Graph tags (og:title, og:description, og:image, og:url, og:type)
- Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
- Basic HTML meta (title, description)
- Canonical URL pointing to original destination
For Regular Users:

Immediate 302/307 redirect to the actual destination URL
No delay, seamless experience

3. Metadata Extraction Service
When user creates a short link, automatically extract preview data from the target URL:
Scraping Strategy:

Fetch the target URL's HTML
Parse existing Open Graph tags if present
Extract title from <title> tag
Extract description from meta description or first paragraph
Find suitable image from og:image or largest image on page
Store this metadata in your database

Fallback Handling:

If target has no meta tags, generate sensible defaults
Use domain name as title if no title found
Create generic description
Provide default placeholder image

4. Image Handling
Critical for previews to work consistently:
Requirements:

All preview images must be publicly accessible (no auth required)
Recommended size: 1200x630px for Facebook/LinkedIn, works for all platforms
Support HTTPS (required by most platforms)
Fast CDN delivery

Options:

Proxy and cache images from target URLs
Generate custom preview images with title/description overlay
Allow users to upload custom preview images

5. Platform-Specific Optimization
Facebook/LinkedIn:

Minimum image size: 600x315px
Prefer 1200x630px
Support og:type for rich cards
Use og:site_name for branding

Twitter:

Support both summary and summary_large_image cards
twitter:site for attribution
Image aspect ratio 2:1 recommended

WhatsApp:

Uses Open Graph tags
Prefers square images (300x300px minimum)
Cache aggressively, hard to refresh

iMessage/Slack:

Use Open Graph tags
Support oEmbed for richer embeds (optional)

Implementation Flow
User Creates Short Link:

User submits destination URL
System generates unique short code
Background job fetches and extracts metadata from destination
Store: short_code → {destination_url, title, description, image_url, custom_overrides}
Return short URL to user

Social Platform Requests Short Link:

Detect user agent is a social crawler
Look up metadata for this short code
Generate HTML page with all required meta tags
Serve with appropriate cache headers
Include JavaScript redirect as fallback (won't execute for bots)

Regular User Clicks Short Link:

Detect user agent is regular browser
Immediate redirect to destination URL
Log analytics if needed

Key Features to Include
Admin/User Interface:

Link creation form with destination URL input
Preview editor (override title, description, image)
Live preview showing how link appears on different platforms
Analytics dashboard (clicks, platforms, geographic data)
Bulk link creation
Link expiration options

API Endpoints:

POST /api/links - Create new short link
GET /api/links/:id - Get link details and analytics
PATCH /api/links/:id - Update preview metadata
DELETE /api/links/:id - Delete/disable link
GET /:short_code - The actual short link (handles redirects/previews)

Preview Customization:

Allow manual override of auto-extracted metadata
Custom image upload
Template system for branded previews
Dynamic image generation with text overlay

Technical Considerations
Performance:

Cache rendered HTML for each short link
Use CDN for serving short links globally
Lazy metadata extraction (async after link creation)
Image optimization and caching

Reliability:

Handle target URLs that timeout or fail
Graceful degradation when metadata unavailable
Support for password-protected or auth-required destinations (with manual metadata entry)

Security:

Validate destination URLs (no malicious sites)
Rate limiting on link creation
Spam detection
HTTPS enforcement

Testing:

Use platform-specific preview tools:

Facebook Sharing Debugger
Twitter Card Validator
LinkedIn Post Inspector

Test with different user agents
Monitor which platforms successfully cache previews

Tech Stack ✅
Backend

Node.js + Express + TypeScript
PostgreSQL (database)
Prisma ORM (database access)
Additional libraries needed:

express - Web framework
cheerio - HTML parsing for metadata extraction
axios - HTTP requests
nanoid - Short code generation
express-rate-limit - Rate limiting
helmet - Security headers

Frontend

HTML + Tailwind CSS 4 (CDN)
Vanilla JavaScript (no framework needed for simplicity)
Fetch API for backend communication

Priority Social Platforms

Telegram - Uses Open Graph tags
Facebook - Open Graph protocol
Facebook Messenger - Same as Facebook
Instagram - Uses Open Graph tags

Project Structure
social-seo-preview/
├── src/
│   ├── index.ts                 # Express app entry
│   ├── routes/
│   │   ├── links.ts            # API routes for link management
│   │   └── redirect.ts         # Short link redirect handler
│   ├── services/
│   │   ├── metadata.service.ts # Metadata extraction
│   │   ├── link.service.ts     # Link CRUD operations
│   │   └── userAgent.service.ts # Bot detection
│   ├── utils/
│   │   ├── generateShortCode.ts
│   │   └── validators.ts
│   └── templates/
│       └── preview.html        # Social preview template
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/
├── public/
│   ├── index.html              # Main dashboard UI
│   ├── create.html             # Link creation page
│   └── analytics.html          # Analytics view
├── .env
├── package.json
└── tsconfig.json

Debug and Monitoring
What to Log:

Failed metadata extractions
Social bot requests vs regular redirects
Preview cache hit/miss rates
Slow metadata fetches from target sites

What to Monitor:

Redirect latency
Metadata extraction success rate
Different platform crawler behaviors
Image loading failures

Platform-Specific Quirks to Handle
Facebook:

Aggressive caching (use Sharing Debugger to force refresh)
Requires absolute URLs for images
Validates image dimensions strictly

WhatsApp:

Very aggressive caching, nearly impossible to refresh
Get preview right the first time
Prefers square images

Twitter:

Respects robots.txt
Requires twitter:card to be set
Validates images asynchronously

LinkedIn:

Slower crawler, patient timeout needed
Prefers professional-looking images
Good at extracting content

Success Metrics

Preview render rate across platforms (aim for 95%+)
Time to create link (<2 seconds)
Redirect latency (<200ms)
Metadata extraction success rate (>90%)
User satisfaction with preview accuracy

This architecture gives you a production-ready social SEO preview service that makes any link share beautifully across all major platforms without requiring deep linking infrastructure.
