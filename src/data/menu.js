// The menu. Emoji are the food art (no image files to host).
export const CATEGORIES = ['Pizza', 'Burgers', 'Asian', 'Indian', 'Mexican', 'Bowls', 'Desserts', 'Drinks'];

export const GRADIENTS = {
  Pizza: ['#ff9a5a', '#ff4d3d'],
  Burgers: ['#ffd35a', '#ff9a3d'],
  Asian: ['#6ee7d0', '#2aa7e0'],
  Indian: ['#ffc06a', '#f0592a'],
  Mexican: ['#b6e35a', '#12b886'],
  Bowls: ['#9be7a8', '#3bb273'],
  Desserts: ['#ff9ad0', '#b86bff'],
  Drinks: ['#7cc8ff', '#a98bff'],
};

export const MENU = [
  { id: 1, name: 'Margherita Pizza', emoji: '🍕', category: 'Pizza', price: 12.99, desc: 'Fresh mozzarella, tomato and basil on a wood-fired crust', rating: 4.8, time: 20, veg: true, spice: 0, popular: true, kcal: 780 },
  { id: 2, name: 'Pepperoni Blaze', emoji: '🍕', category: 'Pizza', price: 14.49, desc: 'Spicy pepperoni, chili honey and double cheese', rating: 4.7, time: 22, veg: false, spice: 2, popular: true, kcal: 920 },
  { id: 3, name: 'Cheese Burger', emoji: '🍔', category: 'Burgers', price: 9.99, desc: 'Beef patty, cheddar, lettuce and house sauce', rating: 4.6, time: 15, veg: false, spice: 0, popular: true, kcal: 690 },
  { id: 4, name: 'Veggie Smash', emoji: '🍔', category: 'Burgers', price: 8.99, desc: 'Crispy veg patty, avocado and tangy slaw', rating: 4.4, time: 15, veg: true, spice: 0, popular: false, kcal: 560 },
  { id: 5, name: 'Crispy Chicken Melt', emoji: '🥪', category: 'Burgers', price: 10.49, desc: 'Fried chicken, pickles and smoky mayo', rating: 4.5, time: 17, veg: false, spice: 1, popular: false, kcal: 740 },
  { id: 6, name: 'Ramen Bowl', emoji: '🍜', category: 'Asian', price: 11.49, desc: 'Rich broth, pork, soft egg and spring onion', rating: 4.9, time: 18, veg: false, spice: 1, popular: true, kcal: 650 },
  { id: 7, name: 'Sushi Platter', emoji: '🍱', category: 'Asian', price: 15.99, desc: 'Assorted fresh rolls with wasabi and ginger', rating: 4.8, time: 25, veg: false, spice: 0, popular: false, kcal: 540 },
  { id: 8, name: 'Pad Thai', emoji: '🥡', category: 'Asian', price: 11.99, desc: 'Rice noodles, peanuts, lime and tamarind sauce', rating: 4.5, time: 18, veg: true, spice: 2, popular: false, kcal: 610 },
  { id: 9, name: 'Pork Dumplings', emoji: '🥟', category: 'Asian', price: 7.99, desc: 'Pan-fried dumplings with chili soy dip', rating: 4.6, time: 14, veg: false, spice: 1, popular: false, kcal: 420 },
  { id: 17, name: 'Butter Chicken', emoji: '🍛', category: 'Indian', price: 12.49, desc: 'Creamy tomato curry, tender chicken and soft naan', rating: 4.9, time: 20, veg: false, spice: 1, popular: true, kcal: 830 },
  { id: 18, name: 'Paneer Tikka', emoji: '🧆', category: 'Indian', price: 10.99, desc: 'Charred paneer, peppers and mint chutney', rating: 4.7, time: 18, veg: true, spice: 2, popular: false, kcal: 520 },
  { id: 19, name: 'Masala Dosa', emoji: '🫓', category: 'Indian', price: 8.49, desc: 'Crisp rice crepe, spiced potato, sambar and chutney', rating: 4.8, time: 15, veg: true, spice: 1, popular: true, kcal: 480 },
  { id: 20, name: 'Hyderabadi Biryani', emoji: '🍚', category: 'Indian', price: 13.49, desc: 'Fragrant basmati, slow-cooked chicken and saffron', rating: 4.9, time: 25, veg: false, spice: 2, popular: true, kcal: 880 },
  { id: 10, name: 'Tacos Supreme', emoji: '🌮', category: 'Mexican', price: 8.99, desc: 'Three soft tacos with beef, salsa and guacamole', rating: 4.7, time: 15, veg: false, spice: 1, popular: true, kcal: 640 },
  { id: 11, name: 'Loaded Nachos', emoji: '🧀', category: 'Mexican', price: 9.49, desc: 'Crisp chips, queso, jalapeño and pico de gallo', rating: 4.4, time: 12, veg: true, spice: 1, popular: false, kcal: 710 },
  { id: 21, name: 'Burrito Bowl', emoji: '🌯', category: 'Mexican', price: 10.29, desc: 'Cilantro rice, black beans, corn, salsa and crema', rating: 4.6, time: 14, veg: true, spice: 1, popular: false, kcal: 690 },
  { id: 22, name: 'Salmon Poke', emoji: '🐟', category: 'Bowls', price: 13.99, desc: 'Salmon, sushi rice, edamame, mango and sesame', rating: 4.7, time: 12, veg: false, spice: 0, popular: false, kcal: 560 },
  { id: 23, name: 'Garden Crunch Salad', emoji: '🥗', category: 'Bowls', price: 8.79, desc: 'Greens, chickpeas, feta, cucumber and lemon dressing', rating: 4.5, time: 8, veg: true, spice: 0, popular: false, kcal: 380 },
  { id: 12, name: 'Chocolate Cake', emoji: '🍰', category: 'Desserts', price: 6.99, desc: 'Rich chocolate sponge with creamy ganache', rating: 4.9, time: 10, veg: true, spice: 0, popular: true, kcal: 520 },
  { id: 13, name: 'Ice Cream Sundae', emoji: '🍨', category: 'Desserts', price: 5.99, desc: 'Vanilla scoops, fudge sauce and sprinkles', rating: 4.5, time: 8, veg: true, spice: 0, popular: false, kcal: 450 },
  { id: 14, name: 'Cinnamon Churros', emoji: '🍩', category: 'Desserts', price: 5.49, desc: 'Warm churros with chocolate dip', rating: 4.6, time: 10, veg: true, spice: 0, popular: false, kcal: 410 },
  { id: 15, name: 'Mango Smoothie', emoji: '🥭', category: 'Drinks', price: 4.99, desc: 'Ripe mango, yogurt and a squeeze of lime', rating: 4.7, time: 6, veg: true, spice: 0, popular: false, kcal: 260 },
  { id: 16, name: 'Brown Sugar Boba', emoji: '🧋', category: 'Drinks', price: 4.49, desc: 'Milk tea, chewy pearls and brown sugar syrup', rating: 4.8, time: 6, veg: true, spice: 0, popular: true, kcal: 340 },
  { id: 24, name: 'Masala Chai', emoji: '☕', category: 'Drinks', price: 2.99, desc: 'Strong tea, milk, ginger and cardamom', rating: 4.8, time: 5, veg: true, spice: 0, popular: false, kcal: 120 },
];

export const SIZES = [
  { name: 'Regular', add: 0 },
  { name: 'Large', add: 2.5 },
  { name: 'XL', add: 5 },
];

export const EXTRAS = [
  { name: 'Extra cheese', add: 1 },
  { name: 'Spicy kick', add: 0.5 },
  { name: 'Side of fries', add: 2.5 },
  { name: 'Extra sauce', add: 0.75 },
];

export const dishById = (id) => MENU.find((m) => m.id === id);
