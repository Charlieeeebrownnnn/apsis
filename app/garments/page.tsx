import { Suspense } from 'react';
import type { Metadata } from 'next';
import ClothesSalesShowcase from '@/components/ClothesSalesShowcase';

export const metadata: Metadata = {
  title: 'APSIS Garment System',
  description: 'Runway and garment detail sales interface by APSIS.',
};

function GarmentsShowcaseFallback() {
  return <div className="fixed inset-0 bg-[#f4f1ea]" />;
}

export default function GarmentsPage() {
  return (
    <Suspense fallback={<GarmentsShowcaseFallback />}>
      <ClothesSalesShowcase />
    </Suspense>
  );
}
