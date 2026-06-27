import type { Metadata } from 'next';
import ChairSalesShowcase from '@/components/ChairSalesShowcase';

export const metadata: Metadata = {
  title: 'APSIS Chair Orbit',
  description: 'A private chair object carousel by APSIS.',
};

export default function ChairsPage() {
  return <ChairSalesShowcase />;
}
