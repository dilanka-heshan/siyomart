import Link from 'next/link';

interface CategoryBadgeProps {
  name: string;
  slug: string;
  count?: number;
  active?: boolean;
}

export default function CategoryBadge({ name, slug, count, active = false }: CategoryBadgeProps) {
  return (
    <Link 
      href={`/shop?category=${slug}`}
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
        active 
          ? 'bg-amber-100 text-amber-800 border border-amber-300' 
          : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-amber-50'
      } transition-colors`}
    >
      {name}
      {count !== undefined && (
        <span className={`ml-1 text-xs ${active ? 'text-amber-600' : 'text-gray-500'}`}>
          ({count})
        </span>
      )}
    </Link>
  );
}
