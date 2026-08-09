import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams();

  if (resolvedSearchParams) {
    Object.entries(resolvedSearchParams).forEach(([key, value]) => {
      if (typeof value === 'string') {
        params.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      }
    });
  }

  const queryString = params.toString();

  if (queryString) {
    redirect(`/report?${queryString}`);
  } else {
    redirect('/report');
  }
}
