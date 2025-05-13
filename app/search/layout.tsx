import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Results',
  description: 'Search across blog posts and projects',
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
