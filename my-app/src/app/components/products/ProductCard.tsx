import { WishlistButton } from '@/app/components/ui/WishlistButton';

interface ProductCardProps {
  product: {
    _id: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="absolute top-2 right-2 z-10">
        <WishlistButton productId={product._id} />
      </div>
    </div>
  );
}