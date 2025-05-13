"use client";

import BackgroundLayout from '@/components/layout/BackgroundLayout';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BackgroundLayout type="blog">
      {children}
    </BackgroundLayout>
  );
}
