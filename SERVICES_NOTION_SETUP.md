# Services Notion Setup

## 1) Create Notion Integration
- Create a new Internal Integration (Notion → Settings → Integrations)
- Copy the secret token → use as `SERVICES_NOTION_TOKEN`

## 2) Create Services Database
Create a database named "Services" with these properties:
- svTitle: Title (required)
- svCategory: Multi-Select (required; used for filtering)
- svSlug: Rich Text (required; lowercase, dash)
- svImageURL1: URL (required)
- svPublished: Date (required)
- svWilayah: Multi-Select (optional)
- svProvider: Rich Text (optional)
- svType: Multi-Select (optional)
- svPrice: Rich Text (optional; numeric or formatted)
- svURL: URL (optional)
- svWhatsAppURL: URL (optional)
- svMapsURL: URL (optional)
- svVerify: Select (optional)
- svImageURL2: URL (optional)
- svImageURL3: URL (optional)
- svReview: Rich Text (optional)

Share the database with the integration (Share → select integration → Can read).

## 3) Env Vars
Create `.env` from `.env.example` and add:
```
SERVICES_NOTION_TOKEN=your_services_integration_token
SERVICES_NOTION_DATABASE_ID=your_services_database_id
```

## 4) Sample CSV
See `sample_services.csv`. Import into Notion and map columns to the properties above.

## 5) Usage in the site
- Homepage: `LatestServices` section
- Services Index: `/services` with category filter via `?category=...`
- Service Detail: `/services/[...slug]` with WhatsApp CTA under the title

Tip: If you prefer a global default WhatsApp number, omit `svWhatsAppURL`. The app will default to `085799520350`.