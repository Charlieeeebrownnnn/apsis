import { Suspense } from 'react';
import type { Metadata } from 'next';
import ClothesSalesShowcase from '@/components/ClothesSalesShowcase';
import type { ClothingLook } from '@/components/ClothesSalesShowcase';
import { client } from '@/sanity/client';
import { CLOTHING_LOOKS_QUERY } from '@/sanity/queries';

export const metadata: Metadata = {
  title: 'APSIS Garment System',
  description: 'Runway and garment detail sales interface by APSIS.',
};

function GarmentsShowcaseFallback() {
  return <div className="fixed inset-0 bg-[#f4f1ea]" />;
}

export default async function GarmentsPage() {
  const looks = await client.fetch<ClothingLook[]>(
    CLOTHING_LOOKS_QUERY,
    {},
    { next: { revalidate: 30 } },
  );

  return (
    <Suspense fallback={<GarmentsShowcaseFallback />}>
      <ClothesSalesShowcase looks={looks} />
    </Suspense>
  );
}
