import { Directus } from '@directus/sdk';

export function getDirectusClient() {
  const url = process.env.DIRECTUS_URL;
  const token = process.env.DIRECTUS_TOKEN;
  if (!url || !token) {
    console.error('Missing DIRECTUS_URL or DIRECTUS_TOKEN');
    process.exit(1);
  }
  return new Directus(url, { auth: { staticToken: token } });
}