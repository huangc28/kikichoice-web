import { json, type LoaderFunctionArgs } from '@vercel/remix';
import { fetchProductVariants } from '@/routes/shop/api.server';

export async function loader({ params }: LoaderFunctionArgs) {
  const { uuid } = params;

  if (!uuid) {
    return json(
      { variants: [], error: 'Product UUID is required' },
      { status: 400 }
    );
  }

  try {
    const variants = await fetchProductVariants(uuid);
    return json({ variants, error: null });
  } catch (error) {
    console.error('Failed to fetch product variants:', error);
    return json(
      { variants: [], error: 'Failed to load product variants' },
      { status: 500 }
    );
  }
}