'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import DarkDecodingContainer from '@/components/chat/DarkDecodingContainer';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DarkDecodingPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
        } else {
          setUserId(session.user.id);
        }
      } catch (err) {
        console.error("Session check error in DarkDecodingPage:", err);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#05070a] flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  if (!userId) {
    return null; // Redirecting...
  }

  return (
    <div className="w-full min-h-screen bg-[#05070a] text-white">
      <DarkDecodingContainer userId={userId} />
    </div>
  );
}
