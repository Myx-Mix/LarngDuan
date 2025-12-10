import { Product } from './types';

export const TAX_RATE = 0; // No VAT

// Realistic Car Images (Transparent PNGs)
const IMG_S = 'https://purepng.com/public/uploads/large/purepng.com-red-mazda-2-carcarvehicletransportmazda-961524660424s7e0l.png';
const IMG_M = 'https://purepng.com/public/uploads/large/purepng.com-honda-city-carcarvehicletransporthonda-961524650567a1w8q.png';
const IMG_XL = 'https://purepng.com/public/uploads/large/purepng.com-white-toyota-fortuner-suv-carcarvehicletransporttoyota-961524666579j0x1p.png';
const IMG_XXL = 'https://purepng.com/public/uploads/large/purepng.com-toyota-alphard-carcarvehicletransporttoyota-961524668276f8j7a.png';
const IMG_XXX = 'https://purepng.com/public/uploads/large/purepng.com-white-toyota-hiace-van-carcarvehicletransporttoyota-961524669279h6q2j.png';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'w-s',
    name: 'Size S (Eco/Compact)',
    price: 89.00,
    category: 'Wash',
    image: IMG_S,
  },
  {
    id: 'w-m',
    name: 'Size M/L (Sedan/SUV)',
    price: 99.00,
    category: 'Wash',
    image: IMG_M,
  },
  {
    id: 'w-xl',
    name: 'Size XL (Large SUV/Truck)',
    price: 119.00,
    category: 'Wash',
    image: IMG_XL,
  },
  {
    id: 'w-xxl',
    name: 'Size XXL (Van)',
    price: 139.00,
    category: 'Wash',
    image: IMG_XXL,
  },
  {
    id: 'w-xxx',
    name: 'Size XXX (Super Size)',
    price: 159.00,
    category: 'Wash',
    image: IMG_XXX,
  },
];
