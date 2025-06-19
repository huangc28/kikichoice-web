import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkRehype from 'remark-rehype';
import rehypeReact from 'rehype-react';
import { createElement } from 'react';
import DosageCard from '@/components/DosageCard';

export async function mdxToReact(source: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkRehype)
    .use(rehypeReact, {
      createElement: createElement as any,
      components: { DosageCard },
    })
    .process(source);

  return file.result as React.ReactElement;
}
