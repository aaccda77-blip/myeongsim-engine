import { redirect } from 'next/navigation';

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const queryString = new URLSearchParams(searchParams as any).toString();
  if (queryString) {
    redirect(`/report?${queryString}`);
  } else {
    redirect('/report');
  }
}
