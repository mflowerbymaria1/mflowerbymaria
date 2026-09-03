import { supabase } from '@/lib/supabase';

export default async function sitemap() {
  const baseUrl = 'https://www.mflower.store';

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/mayorista`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    const { data: products } = await supabase.from('products').select('id, updated_at');
    const productRoutes = (products || []).map((p) => ({
      url: `${baseUrl}/producto/${p.id}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch (e) {
    return staticRoutes;
  }
}
