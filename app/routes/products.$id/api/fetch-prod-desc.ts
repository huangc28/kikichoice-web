export async function fetchGithubMdx(sku: string): Promise<string> {
  const url = `https://raw.githubusercontent.com/huangc28/kikichoice-mdx/main/${sku}.mdx`;
  const res = await fetch(url, {
    // headers: {
    //   // optional but recommended for higher rate-limit
    //   Authorization: `token ${process.env.GITHUB_PAT ?? ''}`,
    // },
  });

  if (!res.ok) throw new Error(`GitHub fetch failed: ${res.status}`);
  return res.text();
}
