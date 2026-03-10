import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Check authentication
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // If not logged in, redirect to login page
  if (!session) {
    redirect('/login');
  }

  // If logged in, redirect to report with query params
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
