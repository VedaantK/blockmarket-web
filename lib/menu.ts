// Placeholder menus and pricing until real ones are wired up. Prices are in cents.

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  /** What the dining location charges, in cents. */
  price: number;
  popular?: boolean;
};

export type MenuSection = { id: string; title: string; items: MenuItem[] };

/** Share taken off the menu price. Placeholder until pricing is decided. */
export const DISCOUNT = 0.4;

/** Flat fee added to every order, in cents. Placeholder. */
export const SERVICE_FEE = 99;

export function ourPrice(menuPrice: number) {
  return Math.round(menuPrice * (1 - DISCOUNT));
}

export function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export const MENUS: Record<string, MenuSection[]> = {
  hunan: [
    {
      id: "plates",
      title: "Plates",
      items: [
        { id: "orange-chicken", name: "Orange Chicken", description: "Crispy chicken in sweet orange glaze, with steamed or fried rice.", price: 1195, popular: true },
        { id: "general-tso", name: "General Tso's Chicken", description: "Spicy-sweet sauce, broccoli, choice of rice.", price: 1195 },
        { id: "beef-broccoli", name: "Beef & Broccoli", description: "Sliced beef and broccoli in brown sauce, with rice.", price: 1295 },
        { id: "mapo-tofu", name: "Mapo Tofu", description: "Silken tofu in chili bean sauce. Vegetarian on request.", price: 1095 },
      ],
    },
    {
      id: "noodles-rice",
      title: "Noodles & rice",
      items: [
        { id: "lo-mein", name: "Chicken Lo Mein", description: "Soft egg noodles with chicken, cabbage and carrots.", price: 1095, popular: true },
        { id: "fried-rice", name: "House Fried Rice", description: "Egg, scallion, peas and your choice of protein.", price: 995 },
      ],
    },
    {
      id: "sides",
      title: "Sides",
      items: [
        { id: "rangoon", name: "Crab Rangoon (4)", description: "Crispy wontons with cream cheese filling.", price: 495, popular: true },
        { id: "egg-roll", name: "Egg Roll (2)", description: "Pork and cabbage, with sweet chili sauce.", price: 395 },
        { id: "hot-sour", name: "Hot & Sour Soup", description: "Tofu, bamboo shoots, egg ribbons.", price: 450 },
      ],
    },
  ],
  "the-edge": [
    {
      id: "pizza",
      title: "Pizza",
      items: [
        { id: "margherita", name: "Margherita", description: "Tomato, fresh mozzarella, basil. 10-inch.", price: 1150, popular: true },
        { id: "pepperoni", name: "Pepperoni", description: "Cup-and-char pepperoni, mozzarella. 10-inch.", price: 1250, popular: true },
        { id: "veggie", name: "Garden Veggie", description: "Peppers, onion, mushroom, olives. 10-inch.", price: 1250 },
        { id: "slice", name: "Cheese Slice", description: "One big slice, ready fast.", price: 450 },
      ],
    },
    {
      id: "pasta",
      title: "Pasta",
      items: [
        { id: "penne-vodka", name: "Penne alla Vodka", description: "Creamy tomato vodka sauce, parmesan.", price: 1095 },
        { id: "chicken-alfredo", name: "Chicken Alfredo", description: "Fettuccine, grilled chicken, garlic cream sauce.", price: 1195 },
      ],
    },
    {
      id: "sides",
      title: "Sides & drinks",
      items: [
        { id: "garlic-knots", name: "Garlic Knots (4)", description: "With marinara for dipping.", price: 495 },
        { id: "caesar", name: "Side Caesar", description: "Romaine, parmesan, croutons.", price: 595 },
        { id: "soda", name: "Fountain Soda", description: "20 oz.", price: 225 },
      ],
    },
  ],
  "au-bon-pain": [
    {
      id: "breakfast",
      title: "Breakfast",
      items: [
        { id: "bec-bagel", name: "Bacon, Egg & Cheese Bagel", description: "On your choice of bagel.", price: 795, popular: true },
        { id: "everything-bagel", name: "Everything Bagel & Cream Cheese", description: "Toasted, plain or veggie cream cheese.", price: 425 },
        { id: "oatmeal", name: "Oatmeal", description: "With brown sugar, raisins and walnuts.", price: 450 },
      ],
    },
    {
      id: "sandwiches",
      title: "Sandwiches",
      items: [
        { id: "turkey-swiss", name: "Turkey & Swiss", description: "On ciabatta with lettuce, tomato and dijon.", price: 1050, popular: true },
        { id: "caprese", name: "Caprese", description: "Mozzarella, tomato, basil pesto on focaccia.", price: 995 },
        { id: "chicken-pesto", name: "Chicken Pesto", description: "Grilled chicken, pesto, mozzarella, roasted peppers.", price: 1095 },
      ],
    },
    {
      id: "drinks",
      title: "Coffee & drinks",
      items: [
        { id: "latte", name: "Latte", description: "Hot or iced. 16 oz.", price: 495 },
        { id: "cold-brew", name: "Cold Brew", description: "16 oz.", price: 425 },
        { id: "oj", name: "Orange Juice", description: "Bottled, 12 oz.", price: 375 },
      ],
    },
  ],
  "k-truck": [
    {
      id: "bowls",
      title: "Rice bowls",
      items: [
        { id: "bulgogi", name: "Beef Bulgogi Bowl", description: "Marinated beef, rice, kimchi, pickled veg, fried egg.", price: 1295, popular: true },
        { id: "spicy-pork", name: "Spicy Pork Bowl", description: "Gochujang pork, rice, scallions, sesame.", price: 1195 },
        { id: "tofu-bibimbap", name: "Tofu Bibimbap", description: "Crispy tofu, veggies, rice and gochujang. Vegetarian.", price: 1095 },
      ],
    },
    {
      id: "street-food",
      title: "Street food",
      items: [
        { id: "kfc-wings", name: "Korean Fried Chicken (6)", description: "Double-fried, soy garlic or spicy.", price: 1095, popular: true },
        { id: "tteokbokki", name: "Tteokbokki", description: "Chewy rice cakes in sweet-spicy sauce.", price: 850 },
        { id: "mandu", name: "Mandu (6)", description: "Pan-fried pork and vegetable dumplings.", price: 695 },
      ],
    },
  ],
};

export function getMenu(vendorId: string) {
  return MENUS[vendorId] ?? [];
}

export function findItem(vendorId: string, itemId: string) {
  for (const section of getMenu(vendorId)) {
    const item = section.items.find((i) => i.id === itemId);
    if (item) return item;
  }
  return undefined;
}
