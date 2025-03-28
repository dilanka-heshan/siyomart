import Image from 'next/image';
import Link from 'next/link';

type ProductCardProps = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  rating?: {
    value: number;
  };
};

export default function ProductCard({ _id, name, price, images, rating }: ProductCardProps) {
  return (
    <Link href={`/products/${_id}`} className="group">
      <div className="h-80 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
        <div className="relative h-48">
          <Image
            src={images[0] || '/placeholder.jpg'}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg truncate">{name}</h3>
          <div className="flex justify-between items-center mt-2">
            <p className="text-amber-600 font-bold">Rs. {price.toLocaleString()}</p>
            {rating && (
              <div className="flex items-center">
                <span className="text-amber-500">★</span>
                <span className="ml-1">{rating.value.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
