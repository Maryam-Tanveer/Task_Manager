const User = require('../models/User');
const Product = require('../models/Product');
const logger = require('../utils/logger');

/**
 * Sample data for seeding the database
 */
const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1234567890',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'john123',
    role: 'user',
    phone: '+1987654321',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'jane123',
    role: 'user',
    phone: '+1555555555',
  },
];

const seedProducts = [
  {
    name: 'Fjallraven - Foldsack No. 1 Backpack',
    description:
      'Your perfect pack for everyday adventures. Sleek and durable with just the right amount of space to store your everyday essentials. Comfortable back panel.',
    price: 109.95,
    category: 'electronics',
    stock: 100,
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    rating: 4.5,
    reviewCount: 120,
  },
  {
    name: 'Mens Casual Premium Slim Fit T-Shirts',
    description:
      'Slim-fitting style, contrast raglan long sleeve and shoulder stripe sleeves. With the Quality print and follow the latest trends.',
    price: 22.3,
    category: 'clothing',
    stock: 150,
    image: 'https://fakestoreapi.com/img/71-yCoNuJL._AC_UY879_.jpg',
    rating: 4.1,
    reviewCount: 259,
  },
  {
    name: 'Mens Cotton Jacket',
    description:
      'Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors.',
    price: 55.99,
    category: 'clothing',
    stock: 80,
    image: 'https://fakestoreapi.com/img/71YDEBT7WLL._AC_UY879_.jpg',
    rating: 4.7,
    reviewCount: 500,
  },
  {
    name: 'SAMSUNG 49-Inch CHG90 144Hz Ultra Wide Gaming Monitor',
    description:
      '49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with 144Hz refresh rate, response time 1ms, 3440 x 1440 resolution. With AMD FREESYNC. 3 YEARS AGE WARRANTY + 1 YEAR DAMAGE.',
    price: 999.99,
    category: 'electronics',
    stock: 15,
    image: 'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg',
    rating: 2.2,
    reviewCount: 140,
  },
  {
    name: 'BIYLACLESEN Womens Windbreaker Ski Jacket',
    description:
      'Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Lining Fabric is (92% Polyester and 8% Spandex) Lightweight',
    price: 56.99,
    category: 'clothing',
    stock: 65,
    image: 'https://fakestoreapi.com/img/51Y5NQrHPvL._AC_UY879_.jpg',
    rating: 2.6,
    reviewCount: 235,
  },
  {
    name: 'White Gold Plated Princess',
    description:
      'Classic Created Wedding Engagement Solitaire Diamond Promise Ring in 14K White Gold Fn. Classy Diamonds. Free shipping, 30-Day returns.',
    price: 9.99,
    category: 'jewelry',
    stock: 200,
    image: 'https://fakestoreapi.com/img/71YPMQYLRL._AC_UL640_QL65_ML3_.jpg',
    rating: 3.5,
    reviewCount: 44,
  },
  {
    name: 'Sony VAIO E Series Intel Core i5 Laptop',
    description:
      'Sony VAIO, which means Visual Audio Intelligent Organizer, is as reliant as any of the VAIO series of computers. The VAIO laptops are manufactured by Sony and are known for quality, style, and features for consumers seeking a pro-style laptop.',
    price: 440.0,
    category: 'electronics',
    stock: 30,
    image: 'https://fakestoreapi.com/img/71JEUOB-PEL._AC_UY879_.jpg',
    rating: 3.3,
    reviewCount: 203,
  },
  {
    name: 'A Truly Iconic Pair of Sunglasses',
    description:
      'From one of my favorite brands on the internet. Yes, they have a great look and they have a great price point as well. They are a great buy for anyone that loves the latest fashion trends.',
    price: 168.99,
    category: 'electronics',
    stock: 45,
    image: 'https://fakestoreapi.com/img/51__02G-+WK.SL_.jpg',
    rating: 3.8,
    reviewCount: 88,
  },
  {
    name: 'YZF-R1 Red Handle Bar Cover',
    description:
      'Yamaha YZF-R1 Red Handle Bar Cover & Grips, made with the high quality rubber material. perfect fit for aftermarket chairs for a guniversal tight fit motorcycle and maxscooter sport with motocycle.'
  ,
    price: 25.99,
    category: 'clothing',
    stock: 120,
    image: 'https://fakestoreapi.com/img/61t8qIElQOL._AC_UX679_.jpg',
    rating: 4.2,
    reviewCount: 92,
  },
  {
    name: 'Samsung 870 QVO SATA III SSD 1TB',
    description:
      'Samsung makes reliable SSDs. Based on our tests, these are the best drives for the consumer market. This drive works great if you want a nice balance of speed and cost.',
    price: 89.99,
    category: 'electronics',
    stock: 50,
    image: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
    rating: 4.4,
    reviewCount: 156,
  },
  {
    name: 'Rain Jacket Women Windbreaker Striped Climbing Raincoats',
    description:
      'Lightweight perfect for trip or casual wear --- waterproof with breathable fabric make its perfect also for camping, hiking, climbing, cycling or travel.',
    price: 39.99,
    category: 'clothing',
    stock: 95,
    image: 'https://fakestoreapi.com/img/71YDEBT7WLL._AC_UY879_.jpg',
    rating: 4.3,
    reviewCount: 175,
  },
  {
    name: 'MBJ Womens Solid Short Sleeve Boat Neck T-Shirt',
    description:
      'Why you should wear boat-necks if you are a woman in this 2022 season. This shirt is made from lightweight fabric and has a elegant look to it.',
    price: 9.85,
    category: 'clothing',
    stock: 250,
    image: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg',
    rating: 4.0,
    reviewCount: 130,
  },
];

/**
 * Seed database with sample data
 */
const seedDatabase = async () => {
  try {
    logger.info('🌱 Starting database seeding...');

    // Check if data already exists
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();

    if (userCount === 0) {
      await User.insertMany(seedUsers);
      logger.info(`✅ Created ${seedUsers.length} sample users`);
    } else {
      logger.info(`⏭️  Users already exist (${userCount} found), skipping...`);
    }

    if (productCount === 0) {
      await Product.insertMany(seedProducts);
      logger.info(`✅ Created ${seedProducts.length} sample products`);
    } else {
      logger.info(`⏭️  Products already exist (${productCount} found), skipping...`);
    }

    logger.info('✅ Database seeding completed successfully');
  } catch (error) {
    logger.error(`❌ Error seeding database: ${error.message}`);
    throw error;
  }
};

module.exports = seedDatabase;
