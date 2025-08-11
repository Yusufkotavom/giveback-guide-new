import { Directus } from '@directus/sdk';

function getEnv(name: string): string | undefined {
  try {
    // @ts-ignore
    return (import.meta as any).env?.[name] ?? process?.env?.[name];
  } catch {
    // @ts-ignore
    return process?.env?.[name];
  }
}

export function isDirectusEnabled(): boolean {
  const url = getEnv('DIRECTUS_URL');
  const token = getEnv('DIRECTUS_TOKEN');
  return Boolean(url && token);
}

export function getDirectus() {
  const url = getEnv('DIRECTUS_URL');
  const token = getEnv('DIRECTUS_TOKEN');
  if (!url || !token) throw new Error('Directus not configured');
  return new Directus(url as string, { auth: { staticToken: token as string } });
}