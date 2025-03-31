import { redirect } from 'next/navigation';

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q;
  
  // If no search query is provided, redirect to the shop page
  if (!query) {
    redirect('/shop');
  }
  
  // Otherwise, redirect to the shop page with the search parameter
  redirect(`/shop?search=${encodeURIComponent(query)}`);
}
