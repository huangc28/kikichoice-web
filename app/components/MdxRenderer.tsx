import { useState, useEffect } from 'react';
import { mdxToReact } from '@/lib/mdx-to-react';

interface MdxRendererProps {
  mdxContent: string;
}

export function MdxRenderer({ mdxContent }: MdxRendererProps) {
  const [reactElement, setReactElement] = useState<React.ReactElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processeMdx = async () => {
      if (!mdxContent) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const element = await mdxToReact(mdxContent);
        setReactElement(element);
      } catch (err) {
        console.error('Error processing MDX:', err);
        setError('Failed to process product description');
      } finally {
        setIsLoading(false);
      }
    };

    processeMdx();
  }, [mdxContent]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!reactElement) {
    return null;
  }

  return <div className="space-y-6 text-gray-700 leading-relaxed">{reactElement}</div>;
}