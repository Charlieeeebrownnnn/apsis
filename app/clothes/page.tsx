import { redirect } from 'next/navigation';

type ClothesRedirectPageProps = {
  searchParams?: Promise<{
    look?: string | string[];
  }>;
};

export default async function ClothesRedirectPage({
  searchParams,
}: ClothesRedirectPageProps) {
  const params = await searchParams;
  const look = Array.isArray(params?.look) ? params.look[0] : params?.look;

  redirect(look ? `/garments?look=${encodeURIComponent(look)}` : '/garments');
}
