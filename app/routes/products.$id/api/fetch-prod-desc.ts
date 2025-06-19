import { getClientEnv } from '@/lib/env.server';

export async function fetchGithubMdx(sku: string): Promise<string> {
  const env = getClientEnv();
  const url = `${env.GITHUB_RAW_CONTENT_URL}/${sku}.mdx`;
  const res = await fetch(url, {
    // headers: {
    //   Authorization: `token ${process.env.GITHUB_PAT ?? ''}`,
    // },
  });

  if (!res.ok) throw new Error(`GitHub fetch failed: ${res.status}`);
  return res.text();
}
