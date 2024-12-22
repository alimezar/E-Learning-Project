'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to login
    router.push('/auth/login');
  }, [router]);

  return null; // No content is rendered as the page immediately redirects
}
