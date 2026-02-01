import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const params = new URLSearchParams();

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
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
