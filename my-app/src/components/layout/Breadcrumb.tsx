import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center space-x-1 md:space-x-2">
        {items.map((item, index) => (
          <li key={item.href}>
            <div className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400 mx-1" aria-hidden="true" />
              )}
              {index === items.length - 1 ? (
                <span className="text-sm font-medium text-gray-500 truncate max-w-[150px] md:max-w-xs">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm font-medium text-amber-600 hover:text-amber-800 truncate max-w-[150px] md:max-w-xs"
                >
                  {item.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
