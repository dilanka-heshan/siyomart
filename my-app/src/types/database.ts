export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'operator' | 'admin';
  profilePicture?: string;
  mobile_number?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  wishlist: string[];
  orderlist: string[];
  favourite: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  OperatorId: string;
  stock: number;
  shipping_weight?: string;
  discount: number;
  rating: Array<{
    userId: string;
    value: number;
  }>;
  reviews: Array<{
    userId: string;
    comment: string;
    rating: number;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentCategory?: string | null;
  subCategories?: string[];
  productCount?: number;
  isActive?: boolean;
  metadata?: any;
  displayOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}