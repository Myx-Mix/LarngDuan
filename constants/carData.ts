export type CarSize = 'S' | 'M' | 'XL' | 'XXL' | 'XXX';

export interface CarModel {
  name: string;
  size: CarSize;
  image: string;
}

export interface CarBrand {
  name: string;
  logo: string;
  models: CarModel[];
}

// Representative Real Car Images (Transparent Backgrounds)
const IMG_S = 'https://purepng.com/public/uploads/large/purepng.com-red-mazda-2-carcarvehicletransportmazda-961524660424s7e0l.png'; // Mazda 2 Hatch
const IMG_M = 'https://purepng.com/public/uploads/large/purepng.com-honda-city-carcarvehicletransporthonda-961524650567a1w8q.png'; // Honda City/Sedan
const IMG_XL = 'https://purepng.com/public/uploads/large/purepng.com-white-toyota-fortuner-suv-carcarvehicletransporttoyota-961524666579j0x1p.png'; // Fortuner SUV
const IMG_XXL = 'https://purepng.com/public/uploads/large/purepng.com-toyota-alphard-carcarvehicletransporttoyota-961524668276f8j7a.png'; // Alphard
const IMG_XXX = 'https://purepng.com/public/uploads/large/purepng.com-white-toyota-hiace-van-carcarvehicletransporttoyota-961524669279h6q2j.png'; // Hiace Commuter

export const CAR_DATABASE: CarBrand[] = [
  {
    name: 'Toyota',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Toyota_Eu.svg/1200px-Toyota_Eu.svg.png',
    models: [
      { name: 'Yaris', size: 'S', image: IMG_S },
      { name: 'Yaris Ativ', size: 'M', image: IMG_M },
      { name: 'Vios', size: 'S', image: IMG_S },
      { name: 'Sienta', size: 'S', image: IMG_S },
      { name: 'Altis', size: 'M', image: IMG_M },
      { name: 'Camry', size: 'M', image: IMG_M },
      { name: 'Corolla Cross', size: 'M', image: IMG_M },
      { name: 'C-HR', size: 'M', image: IMG_M },
      { name: 'Innova', size: 'M', image: IMG_M },
      { name: 'Veloz', size: 'M', image: IMG_M },
      { name: 'Avanza', size: 'M', image: IMG_M },
      { name: 'Hilux Revo', size: 'XL', image: IMG_XL },
      { name: 'Hilux Vigo', size: 'XL', image: IMG_XL },
      { name: 'Fortuner', size: 'XL', image: IMG_XL },
      { name: 'Hilux Champ', size: 'XL', image: IMG_XL },
      { name: 'Alphard', size: 'XXL', image: IMG_XXL },
      { name: 'Vellfire', size: 'XXL', image: IMG_XXL },
      { name: 'Majesty', size: 'XXL', image: IMG_XXL },
      { name: 'Hiace', size: 'XXL', image: IMG_XXL },
      { name: 'Commuter', size: 'XXX', image: IMG_XXX },
    ]
  },
  {
    name: 'Honda',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/2560px-Honda.svg.png',
    models: [
      { name: 'Brio', size: 'S', image: IMG_S },
      { name: 'Jazz', size: 'S', image: IMG_S },
      { name: 'City', size: 'S', image: IMG_S },
      { name: 'WR-V', size: 'S', image: IMG_S },
      { name: 'Civic', size: 'M', image: IMG_M },
      { name: 'Accord', size: 'M', image: IMG_M },
      { name: 'HR-V', size: 'M', image: IMG_M },
      { name: 'CR-V', size: 'M', image: IMG_M },
      { name: 'BR-V', size: 'M', image: IMG_M },
      { name: 'Mobilio', size: 'M', image: IMG_M },
      { name: 'Freed', size: 'M', image: IMG_M },
      { name: 'Step Wagon', size: 'XL', image: IMG_XL },
    ]
  },
  {
    name: 'Isuzu',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Isuzu.svg/2560px-Isuzu.svg.png',
    models: [
      { name: 'D-Max', size: 'XL', image: IMG_XL },
      { name: 'V-Cross', size: 'XL', image: IMG_XL },
      { name: 'Mu-X', size: 'XL', image: IMG_XL },
      { name: 'Mu-7', size: 'XL', image: IMG_XL },
    ]
  },
  {
    name: 'Mitsubishi',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Mitsubishi_logo.svg/2000px-Mitsubishi_logo.svg.png',
    models: [
      { name: 'Mirage', size: 'S', image: IMG_S },
      { name: 'Attrage', size: 'S', image: IMG_S },
      { name: 'Xpander', size: 'M', image: IMG_M },
      { name: 'Lancer', size: 'M', image: IMG_M },
      { name: 'Space Wagon', size: 'M', image: IMG_M },
      { name: 'Triton', size: 'XL', image: IMG_XL },
      { name: 'Pajero Sport', size: 'XL', image: IMG_XL },
    ]
  },
  {
    name: 'Suzuki',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Suzuki_logo_2.svg/2560px-Suzuki_logo_2.svg.png',
    models: [
      { name: 'Swift', size: 'S', image: IMG_S },
      { name: 'Celerio', size: 'S', image: IMG_S },
      { name: 'Ciaz', size: 'M', image: IMG_M },
      { name: 'Ertiga', size: 'M', image: IMG_M },
      { name: 'XL7', size: 'M', image: IMG_M },
      { name: 'Jimny', size: 'M', image: IMG_M },
    ]
  },
  {
    name: 'Mazda',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Mazda_Logo.svg/2560px-Mazda_Logo.svg.png',
    models: [
      { name: 'Mazda 2', size: 'S', image: IMG_S },
      { name: 'MX-5', size: 'S', image: IMG_S },
      { name: 'CX-3', size: 'S', image: IMG_S },
      { name: 'Mazda 3', size: 'M', image: IMG_M },
      { name: 'CX-30', size: 'M', image: IMG_M },
      { name: 'CX-5', size: 'M', image: IMG_M },
      { name: 'CX-8', size: 'M', image: IMG_M },
      { name: 'BT-50', size: 'XL', image: IMG_XL },
    ]
  },
  {
    name: 'Nissan',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Nissan_2020_logo.svg/1200px-Nissan_2020_logo.svg.png',
    models: [
      { name: 'March', size: 'S', image: IMG_S },
      { name: 'Note', size: 'S', image: IMG_S },
      { name: 'Almera', size: 'M', image: IMG_M },
      { name: 'Kicks', size: 'M', image: IMG_M },
      { name: 'Leaf', size: 'M', image: IMG_M },
      { name: 'Sylphy', size: 'M', image: IMG_M },
      { name: 'Teana', size: 'M', image: IMG_M },
      { name: 'Terra', size: 'XL', image: IMG_XL },
      { name: 'Navara', size: 'XL', image: IMG_XL },
      { name: 'Urvan', size: 'XXX', image: IMG_XXX },
    ]
  },
  {
    name: 'Ford',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/2560px-Ford_logo_flat.svg.png',
    models: [
      { name: 'Focus', size: 'S', image: IMG_S },
      { name: 'Fiesta', size: 'M', image: IMG_M },
      { name: 'EcoSport', size: 'M', image: IMG_M },
      { name: 'Mustang', size: 'M', image: IMG_M },
      { name: 'Ranger', size: 'XL', image: IMG_XL },
      { name: 'Raptor', size: 'XL', image: IMG_XL },
      { name: 'Everest', size: 'XL', image: IMG_XL },
    ]
  },
  {
    name: 'MG',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/MG_Cars_logo.svg/2048px-MG_Cars_logo.svg.png',
    models: [
      { name: 'MG3', size: 'S', image: IMG_S },
      { name: 'MG4', size: 'S', image: IMG_S },
      { name: 'MG5', size: 'M', image: IMG_M },
      { name: 'MG ZS', size: 'M', image: IMG_M },
      { name: 'MG HS', size: 'M', image: IMG_M },
      { name: 'MG EP', size: 'M', image: IMG_M },
      { name: 'Cyberster', size: 'M', image: IMG_M },
      { name: 'Extender', size: 'XL', image: IMG_XL },
      { name: 'Maxus 9', size: 'XXL', image: IMG_XXL },
      { name: 'V80', size: 'XXL', image: IMG_XXL },
    ]
  },
  {
    name: 'BYD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/BYD_Auto_2022_logo.svg/2560px-BYD_Auto_2022_logo.svg.png',
    models: [
      { name: 'Dolphin', size: 'S', image: IMG_S },
      { name: 'Atto 3', size: 'M', image: IMG_M },
      { name: 'Seal', size: 'M', image: IMG_M },
      { name: 'M6', size: 'M', image: IMG_M },
    ]
  },
  {
    name: 'Tesla',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png',
    models: [
      { name: 'Model 3', size: 'M', image: IMG_M },
      { name: 'Model Y', size: 'M', image: IMG_M },
      { name: 'Model S', size: 'M', image: IMG_M },
      { name: 'Model X', size: 'M', image: IMG_M },
    ]
  },
  {
    name: 'GWM',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/GWM_logo_2020.svg/2560px-GWM_logo_2020.svg.png',
    models: [
      { name: 'Ora Good Cat', size: 'S', image: IMG_S },
      { name: 'Ora 07', size: 'M', image: IMG_M },
      { name: 'Haval Jolion', size: 'M', image: IMG_M },
      { name: 'Haval H6', size: 'M', image: IMG_M },
      { name: 'Tank 300', size: 'XL', image: IMG_XL },
      { name: 'Tank 500', size: 'XL', image: IMG_XL },
    ]
  },
  {
    name: 'Hyundai',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Hyundai_Motor_Company_logo.svg/2560px-Hyundai_Motor_Company_logo.svg.png',
    models: [
      { name: 'Creta', size: 'M', image: IMG_M },
      { name: 'Stargazer', size: 'M', image: IMG_M },
      { name: 'Ioniq 5', size: 'M', image: IMG_M },
      { name: 'H1', size: 'XXL', image: IMG_XXL },
      { name: 'Staria', size: 'XXL', image: IMG_XXL },
    ]
  },
  {
    name: 'Mercedes-Benz',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Benz_logo.svg/2048px-Mercedes-Benz_logo.svg.png',
    models: [
      { name: 'A-Class', size: 'M', image: IMG_M },
      { name: 'C-Class', size: 'M', image: IMG_M },
      { name: 'E-Class', size: 'M', image: IMG_M },
      { name: 'S-Class', size: 'M', image: IMG_M },
      { name: 'GLA', size: 'M', image: IMG_M },
      { name: 'GLC', size: 'M', image: IMG_M },
      { name: 'GLE', size: 'M', image: IMG_M },
      { name: 'G-Wagon', size: 'XL', image: IMG_XL },
      { name: 'Vito', size: 'XL', image: IMG_XXL },
    ]
  },
  {
    name: 'BMW',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/2048px-BMW.svg.png',
    models: [
      { name: 'Series 3', size: 'M', image: IMG_M },
      { name: 'Series 5', size: 'M', image: IMG_M },
      { name: 'Series 7', size: 'M', image: IMG_M },
      { name: 'X1', size: 'M', image: IMG_M },
      { name: 'X3', size: 'M', image: IMG_M },
      { name: 'X5', size: 'M', image: IMG_M },
      { name: 'X7', size: 'M', image: IMG_M },
    ]
  },
];
