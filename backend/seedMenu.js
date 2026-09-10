const dns = require("dns");

dns.setServers([
  "1.1.1.1",
  "8.8.8.8"
]);

const mongoose = require("mongoose");
const MenuItem = require("./model/menu.model");

require("dotenv").config();

const menuItems = [
  // =========================
  // STARTERS
  // =========================

  {
    name: "Chicken Tikka",
    description:
      "Tender pieces of chicken marinated in aromatic spices and grilled to perfection.",
    category: "Starter",
    price: 280,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/chicken-tikka"
  },

  {
    name: "Paneer Tikka",
    description:
      "Soft paneer cubes marinated with Indian spices and grilled with vegetables.",
    category: "Starter",
    price: 240,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/paneer-tikka"
  },

  {
    name: "Chicken Wings",
    description:
      "Juicy chicken wings seasoned with flavorful spices and cooked until crispy.",
    category: "Starter",
    price: 260,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/chicken-wings"
  },

  {
    name: "Veg Spring Rolls",
    description:
      "Crispy spring rolls filled with fresh vegetables and served with dipping sauce.",
    category: "Starter",
    price: 160,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/vegetable-spring-roll"
  },

  {
    name: "Crispy Corn",
    description:
      "Crunchy sweet corn tossed with herbs, spices and a light seasoning.",
    category: "Starter",
    price: 150,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/crispy-corn"
  },

  // =========================
  // MAIN COURSE
  // =========================

  {
    name: "Chicken Biryani",
    description:
      "Fragrant basmati rice cooked with tender chicken, saffron and aromatic spices.",
    category: "Main Course",
    price: 250,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/chicken-biryani"
  },

  {
    name: "Mutton Biryani",
    description:
      "Aromatic basmati rice cooked with tender mutton and traditional biryani spices.",
    category: "Main Course",
    price: 320,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/mutton-biryani"
  },

  {
    name: "Paneer Butter Masala",
    description:
      "Soft paneer cooked in a creamy tomato and butter based Indian gravy.",
    category: "Main Course",
    price: 230,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/paneer-butter-masala"
  },

  {
    name: "Butter Chicken",
    description:
      "Tender chicken cooked in a rich, creamy tomato and butter gravy.",
    category: "Main Course",
    price: 290,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/butter-chicken"
  },

  {
    name: "Chicken Fried Rice",
    description:
      "Fluffy rice stir-fried with chicken, vegetables and flavorful Asian seasonings.",
    category: "Main Course",
    price: 220,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/chicken-fried-rice"
  },

  {
    name: "Veg Fried Rice",
    description:
      "Fragrant rice stir-fried with fresh vegetables and aromatic seasonings.",
    category: "Main Course",
    price: 180,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/vegetable-fried-rice"
  },

  {
    name: "Chicken Noodles",
    description:
      "Stir-fried noodles tossed with chicken, vegetables and delicious sauces.",
    category: "Main Course",
    price: 210,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/chicken-noodles"
  },

  {
    name: "Paneer Kadai",
    description:
      "Paneer cooked with capsicum, onion and aromatic kadai spices.",
    category: "Main Course",
    price: 240,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/paneer-curry"
  },

  {
    name: "Chicken Roll",
    description:
      "Soft flatbread filled with spicy chicken, onions and flavorful sauces.",
    category: "Main Course",
    price: 140,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/chicken-roll"
  },

  {
    name: "Egg Chicken Roll",
    description:
      "A delicious roll filled with egg, chicken, onions and special sauces.",
    category: "Main Course",
    price: 160,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/egg-chicken-roll"
  },

  // =========================
  // DESSERTS
  // =========================

  {
    name: "Gulab Jamun",
    description:
      "Soft milk-solid dumplings soaked in warm and sweet sugar syrup.",
    category: "Dessert",
    price: 100,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/gulab-jamun"
  },

  {
    name: "Chocolate Brownie",
    description:
      "Rich and moist chocolate brownie with an indulgent chocolate flavor.",
    category: "Dessert",
    price: 140,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/chocolate-brownie"
  },

  {
    name: "Vanilla Ice Cream",
    description:
      "Creamy and refreshing classic vanilla ice cream.",
    category: "Dessert",
    price: 100,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/vanilla-ice-cream"
  },

  {
    name: "Rasmalai",
    description:
      "Soft cottage cheese dumplings served in sweet and creamy saffron milk.",
    category: "Dessert",
    price: 130,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/rasmalai"
  },

  // =========================
  // BEVERAGES
  // =========================

  {
    name: "Cold Coffee",
    description:
      "Chilled creamy coffee blended with milk and a touch of sweetness.",
    category: "Beverage",
    price: 120,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/iced-coffee"
  },

  {
    name: "Mango Shake",
    description:
      "Refreshing milkshake made with ripe mangoes and creamy milk.",
    category: "Beverage",
    price: 130,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/mango-shake"
  },

  {
    name: "Chocolate Milkshake",
    description:
      "Rich and creamy chocolate milkshake topped with a delicious chocolate flavor.",
    category: "Beverage",
    price: 150,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/chocolate-milkshake"
  },

  {
    name: "Fresh Lime Soda",
    description:
      "Refreshing lime soda prepared with fresh lime juice and sparkling water.",
    category: "Beverage",
    price: 90,
    availability: "In Stock",
    image:
      "https://loremflickr.com/800/600/lime-soda"
  }
];

const seedMenu = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    // Remove existing menu items
    await MenuItem.deleteMany({});

    console.log("Existing menu items removed.");

    // Insert new menu items
    const insertedItems = await MenuItem.insertMany(menuItems);

    console.log(
      `${insertedItems.length} menu items inserted successfully.`
    );

    await mongoose.connection.close();

    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding menu:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedMenu();