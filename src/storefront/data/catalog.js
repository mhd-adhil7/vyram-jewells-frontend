export const defaultProductImage = '/assets/vyram-cover.jpg';

export const products = [
  { id: 'kundan-choker', name: 'Kundan Choker', price: 1250, category: 'necklaces', image: defaultProductImage },
  { id: 'temple-work-drops', name: 'Temple Work Drops', price: 450, category: 'earrings', image: defaultProductImage },
  {
    id: 'classic-gold-bangles',
    name: 'Classic Gold Bangles',
    price: 1800,
    category: 'bangles',
    image: defaultProductImage
  },
  { id: 'polki-necklace-set', name: 'Polki Necklace Set', price: 2100, category: 'bridal', image: defaultProductImage },
  {
    id: 'diamond-solitaire-ring',
    name: 'Diamond Solitaire Ring',
    price: 3500,
    category: 'rings',
    image: defaultProductImage
  },
  { id: 'kemp-stone-earrings', name: 'Kemp Stone Earrings', price: 320, category: 'earrings', image: defaultProductImage },
  {
    id: 'elegance-gold-chain',
    name: 'Elegance Gold Chain',
    price: 850,
    category: 'necklaces',
    image: defaultProductImage
  },
  { id: 'meenakari-jhumkas', name: 'Meenakari Jhumkas', price: 280, category: 'earrings', image: defaultProductImage },
  {
    id: 'antique-gold-choker',
    name: 'Antique Gold Choker',
    price: 3250,
    category: 'bridal',
    image: defaultProductImage
  },
  { id: 'diamond-wedding-set', name: 'Diamond Wedding Set', price: 8450, category: 'bridal', image: defaultProductImage },
  { id: 'kundan-bridal-haar', name: 'Kundan Bridal Haar', price: 4800, category: 'bridal', image: defaultProductImage },
  {
    id: 'polki-heavy-mathapatti',
    name: 'Polki Heavy Mathapatti',
    price: 1100,
    category: 'bridal',
    image: defaultProductImage
  },
  {
    id: 'ruby-temple-necklace',
    name: 'Ruby Temple Necklace',
    price: 2500,
    category: 'temple',
    image: defaultProductImage
  },
  {
    id: 'heavy-bridal-bangles',
    name: 'Heavy Bridal Bangles',
    price: 3900,
    category: 'bridal',
    image: defaultProductImage
  },
  {
    id: 'emerald-drop-earrings',
    name: 'Emerald Drop Earrings',
    price: 850,
    category: 'earrings',
    image: defaultProductImage
  },
  {
    id: 'diamond-drop-earrings',
    name: 'Diamond Drop Earrings',
    price: 1850,
    category: 'earrings',
    image: defaultProductImage
  },
  { id: 'classic-gold-choker', name: 'Classic Gold Choker', price: 2400, category: 'necklaces', image: defaultProductImage },
  {
    id: 'antique-temple-bangles',
    name: 'Antique Temple Bangles',
    price: 3100,
    category: 'temple',
    image: defaultProductImage
  },
  { id: 'pearl-statement-ring', name: 'Pearl Statement Ring', price: 650, category: 'rings', image: defaultProductImage },
  { id: 'rose-gold-bracelet', name: 'Rose Gold Bracelet', price: 890, category: 'bangles', image: defaultProductImage },
  {
    id: 'diamond-tennis-necklace',
    name: 'Diamond Tennis Necklace',
    price: 4200,
    category: 'necklaces',
    image: defaultProductImage
  },
  {
    id: 'kundan-bridal-set-mathapatti',
    name: 'Kundan Bridal Set Mathapatti',
    price: 1350,
    category: 'bridal',
    image: defaultProductImage
  },
  { id: 'palakka-mala', name: 'Palakka Mala', price: 1450, category: 'bridal', image: defaultProductImage },
  {
    id: 'kasavu-inspired-bangles',
    name: 'Kasavu Inspired Bangles',
    price: 850,
    category: 'bangles',
    image: defaultProductImage
  },
  { id: 'nagapada-thali', name: 'Nagapada Thali', price: 2100, category: 'bridal', image: defaultProductImage },
  { id: 'manga-mala-set', name: 'Manga Mala Set', price: 2800, category: 'bridal', image: defaultProductImage },
  {
    id: 'lakshmi-motif-choker',
    name: 'Lakshmi Motif Choker',
    price: 2250,
    category: 'temple',
    image: defaultProductImage
  },
  {
    id: 'intricate-temple-bangles',
    name: 'Intricate Temple Bangles',
    price: 1350,
    category: 'temple',
    image: defaultProductImage
  },
  { id: 'peacock-design-vanki', name: 'Peacock Design Vanki', price: 4100, category: 'temple', image: defaultProductImage },
  { id: 'divine-jhumkas', name: 'Divine Jhumkas', price: 950, category: 'earrings', image: defaultProductImage },
  {
    id: 'heritage-gold-choker',
    name: 'Heritage Gold Choker',
    price: 3400,
    category: 'bridal',
    image: defaultProductImage
  },
  { id: 'heavy-antique-haar', name: 'Heavy Antique Haar', price: 5100, category: 'bridal', image: defaultProductImage },
  { id: 'bridal-maang-tikka', name: 'Bridal Maang Tikka', price: 850, category: 'bridal', image: defaultProductImage },
  { id: 'statement-gold-kada', name: 'Statement Gold Kada', price: 2300, category: 'bangles', image: defaultProductImage },
  {
    id: 'diamond-solitaire-set',
    name: 'Diamond Solitaire Set',
    price: 12500,
    category: 'bridal',
    image: defaultProductImage
  },
  {
    id: 'eternity-diamond-bangles',
    name: 'Eternity Diamond Bangles',
    price: 8200,
    category: 'bangles',
    image: defaultProductImage
  },
  { id: 'brilliant-cut-drops', name: 'Brilliant Cut Drops', price: 3800, category: 'earrings', image: defaultProductImage },
  {
    id: 'platinum-diamond-ring',
    name: 'Platinum & Diamond Ring',
    price: 5400,
    category: 'rings',
    image: defaultProductImage
  }
];

export const productsById = Object.fromEntries(products.map((product) => [product.id, product]));

export const categoryLabels = {
  all: 'All',
  necklaces: 'Necklaces',
  earrings: 'Earrings',
  bangles: 'Bangles',
  rings: 'Rings',
  temple: 'Temple Jewellery',
  bridal: 'Bridal Sets'
};

export const collectionFilters = Object.keys(categoryLabels);

export const homeCollectionItems = ['Playfair Display', 'Necklaces', 'Bangles', 'Temple', 'Earrings'];

export const homeNewArrivalIds = ['kundan-choker', 'temple-work-drops', 'classic-gold-bangles', 'polki-necklace-set'];

export const collectionsPageProductIds = [
  'kundan-choker',
  'temple-work-drops',
  'classic-gold-bangles',
  'polki-necklace-set',
  'diamond-solitaire-ring',
  'kemp-stone-earrings',
  'elegance-gold-chain',
  'meenakari-jhumkas'
];

export const bridalFavoriteIds = [
  'antique-gold-choker',
  'diamond-wedding-set',
  'kundan-bridal-haar',
  'polki-heavy-mathapatti',
  'ruby-temple-necklace',
  'heavy-bridal-bangles'
];

export const bridalCollections = [
  {
    slug: 'kerala',
    title: 'Kerala Bridal Edit',
    description: "Embody the rich heritage of God's Own Country with our exclusive Kerala-style bridal pieces.",
    productIds: ['palakka-mala', 'kasavu-inspired-bangles', 'nagapada-thali', 'manga-mala-set']
  },
  {
    slug: 'royal-temple',
    title: 'Royal Temple Collection',
    description: 'Divine craftsmanship adorned with intricate motifs, perfect for a majestic wedding look.',
    productIds: ['lakshmi-motif-choker', 'intricate-temple-bangles', 'peacock-design-vanki', 'divine-jhumkas']
  },
  {
    slug: 'classic-gold',
    title: 'Classic Gold Bridal',
    description: 'Timeless gold pieces honoring tradition, crafted for the contemporary bride.',
    productIds: ['heritage-gold-choker', 'heavy-antique-haar', 'bridal-maang-tikka', 'statement-gold-kada']
  },
  {
    slug: 'diamond',
    title: 'Diamond Wedding Collection',
    description: 'Sparkle eternally with brilliant, conflict-free diamond masterpieces.',
    productIds: ['diamond-solitaire-set', 'eternity-diamond-bangles', 'brilliant-cut-drops', 'platinum-diamond-ring']
  }
];

export const cartRecommendedIds = [
  'classic-gold-bangles',
  'polki-necklace-set',
  'emerald-drop-earrings',
  'kundan-bridal-set-mathapatti'
];

export const wishlistDefaultIds = ['diamond-drop-earrings', 'classic-gold-choker', 'antique-temple-bangles'];

export const wishlistRecommendedIds = [
  'pearl-statement-ring',
  'rose-gold-bracelet',
  'diamond-tennis-necklace',
  'kundan-bridal-set-mathapatti'
];

export const formatPrice = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
