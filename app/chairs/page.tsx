import { Suspense } from 'react';
import type { Metadata } from 'next';
import ChairSalesShowcase from '@/components/ChairSalesShowcase';
import type { ChairProduct } from '@/components/ChairSalesShowcase';
import { client } from '@/sanity/client';
import { CHAIR_PRODUCTS_QUERY } from '@/sanity/queries';

export const metadata: Metadata = {
  title: 'APSIS Chair Orbit',
  description: 'A private chair object carousel by APSIS.',
};

function ChairsShowcaseFallback() {
  return <div className="fixed inset-0 bg-[#efeee9]" />;
}

export default async function ChairsPage() {
  const products = await client.fetch<ChairProduct[]>(
    CHAIR_PRODUCTS_QUERY,
    {},
    { next: { revalidate: 30 } },
  );

  return (
    <Suspense fallback={<ChairsShowcaseFallback />}>
      <ChairSalesShowcase products={products} />
    </Suspense>
  );
}
