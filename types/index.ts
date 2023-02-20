export interface typePages {
  link: string;
  title: string;
  key: string;
}

export interface typeProduct {
  brand: string;
  category: string;
  description: string;
  discountPercentage: number;
  id: number;
  images: string[];
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  title: string;
  key: number;
}

export interface responseProduct {
  limit: number;
  skip: number;
  total: number;
  products: typeProduct[];
}

export interface typeProductCart {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedPrice: number;
}

export interface typeCart {
  id: number;
  products: typeProductCart[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
  key: number;
  name: string;
}

export interface responseCart {
  limit: number;
  skip: number;
  total: number;
  carts: typeCart[];
}

export interface typeMeta {
  limit: number;
  page: number;
  skip: number;
  total: number;
}

export const names = [
  { name: "James", id: 97 },
  { name: "Robert", id: 30 },
  { name: "John", id: 83 },
  { name: "Michael", id: 58 },
  { name: "David", id: 26 },
  { name: "William", id: 56 },
  { name: "Richard", id: 1 },
  { name: "Joseph", id: 91 },
  { name: "Thomas", id: 13 },
  { name: "Charles", id: 66 },
  { name: "Christopher", id: 52 },
  { name: "Daniel", id: 79 },
  { name: "Matthew", id: 76 },
  { name: "Anthony", id: 47 },
  { name: "Mark", id: 15 },
  { name: "Donald", id: 56 },
  { name: "Steven", id: 42 },
  { name: "Paul", id: 5 },
  { name: "Andrew", id: 75 },
  { name: "Joshua", id: 63 },
  { name: "Kenneth", id: 21 },
];
