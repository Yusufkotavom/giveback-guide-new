# Environment Setup Guide

## Notion configuration
- Create Notion integrations and copy tokens for: Blog, Projects, Stays, Products
- Share each database with the corresponding integration
- Add these env vars to your `.env` file (see `.env.example`):
  - `BLOG_NOTION_TOKEN`, `BLOG_NOTION_DATABASE_ID`
  - `PROJECTS_NOTION_TOKEN`, `PROJECTS_NOTION_DATABASE_ID`
  - `STAYS_NOTION_TOKEN`, `STAYS_NOTION_DATABASE_ID`
  - `PRODUCTS_NOTION_TOKEN`, `PRODUCTS_NOTION_DATABASE_ID`

## Products database changes
- Add a `pPrice` property (Rich Text) to the Products database
- Keep marketplace URL fields (optional): `pTokopediaURL`, `pShopeeURL`, `pBlibliURL`, `pBukalapakURL`, `pLazadaURL`

## Local development
This project fetches content from Notion at build/dev. If Notion access is not available, you won’t be able to build locally. Configure env vars and database sharing first.