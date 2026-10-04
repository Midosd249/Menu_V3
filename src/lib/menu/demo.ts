import type { PublicMenu } from "./types";

const DEMO_TENANT_ID = "demo-nafas-tenant";
const DEMO_BRANCH_ID = "demo-nafas-branch";
const DEMO_BRANCH_KING_FAHD_ID = "demo-nafas-king-fahd-branch";
const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=76`;

export const DEMO_MENU: PublicMenu = {
  tenant: {
    id: DEMO_TENANT_ID,
    slug: "nafas",
    nameAr: "نَفَس",
    nameEn: "Nafas",
    taglineAr: "قهوة مختصة ومخبوزات يومية",
    taglineEn: "Specialty coffee & daily pastry",
    logoUrl: "/demo/nafas-logo.svg",
    coverUrl: image("photo-1495474472287-4d71bcdd2085"),
    instagramUrl: "https://instagram.com/nafas.demo",
    websiteUrl: "https://menuun.com",
    snapchatUrl: "https://www.snapchat.com/add/nafas.demo",
    facebookUrl: "https://www.facebook.com/nafas.demo",
    tiktokUrl: "https://www.tiktok.com/@nafas.demo",
    whatsapp: "+966550000000",
    whatsappTemplate: "مرحباً، أود الاستفسار عن قائمة نَفَس.",
    primaryColor: "#344331",
    accentColor: "#b78a42",
    themeKey: "essential",
    currency: "SAR",
    city: "Riyadh",
    country: "SA",
  },
  branch: {
    id: DEMO_BRANCH_ID,
    tenantId: DEMO_TENANT_ID,
    slug: "olaya",
    nameAr: "العليا",
    nameEn: "Al Olaya",
    addressAr: "العليا، الرياض",
    addressEn: "Al Olaya, Riyadh",
    mapsUrl: "https://maps.google.com/?q=Al+Olaya+Riyadh",
    phone: "+966500000000",
    isActive: true,
  },
  branches: [
    {
      id: DEMO_BRANCH_ID,
      tenantId: DEMO_TENANT_ID,
      slug: "olaya",
      nameAr: "العليا",
      nameEn: "Al Olaya",
      addressAr: "العليا، الرياض",
      addressEn: "Al Olaya, Riyadh",
      mapsUrl: "https://maps.google.com/?q=Al+Olaya+Riyadh",
      phone: "+966550000000",
      isActive: true,
    },
    {
      id: DEMO_BRANCH_KING_FAHD_ID,
      tenantId: DEMO_TENANT_ID,
      slug: "king-fahd",
      nameAr: "طريق الملك فهد",
      nameEn: "King Fahd Road",
      addressAr: "طريق الملك فهد، الرياض",
      addressEn: "King Fahd Road, Riyadh",
      mapsUrl: "https://maps.google.com/?q=King+Fahd+Road+Riyadh",
      phone: "+966551111111",
      isActive: true,
    },
  ],
  hours: [
    { branchId: DEMO_BRANCH_ID, weekday: 0, opensAt: "07:00", closesAt: "23:30", isClosed: false },
    { branchId: DEMO_BRANCH_ID, weekday: 1, opensAt: "07:00", closesAt: "23:30", isClosed: false },
    { branchId: DEMO_BRANCH_ID, weekday: 2, opensAt: "07:00", closesAt: "23:30", isClosed: false },
    { branchId: DEMO_BRANCH_ID, weekday: 3, opensAt: "07:00", closesAt: "23:30", isClosed: false },
    { branchId: DEMO_BRANCH_ID, weekday: 4, opensAt: "07:00", closesAt: "00:30", isClosed: false },
    { branchId: DEMO_BRANCH_ID, weekday: 5, opensAt: "08:00", closesAt: "00:30", isClosed: false },
    { branchId: DEMO_BRANCH_ID, weekday: 6, opensAt: "08:00", closesAt: "23:30", isClosed: false },
    { branchId: DEMO_BRANCH_KING_FAHD_ID, weekday: 0, opensAt: "07:30", closesAt: "23:00", isClosed: false },
    { branchId: DEMO_BRANCH_KING_FAHD_ID, weekday: 1, opensAt: "07:30", closesAt: "23:00", isClosed: false },
    { branchId: DEMO_BRANCH_KING_FAHD_ID, weekday: 2, opensAt: "07:30", closesAt: "23:00", isClosed: false },
    { branchId: DEMO_BRANCH_KING_FAHD_ID, weekday: 3, opensAt: "07:30", closesAt: "23:00", isClosed: false },
    { branchId: DEMO_BRANCH_KING_FAHD_ID, weekday: 4, opensAt: "07:30", closesAt: "00:00", isClosed: false },
    { branchId: DEMO_BRANCH_KING_FAHD_ID, weekday: 5, opensAt: "08:00", closesAt: "00:00", isClosed: false },
    { branchId: DEMO_BRANCH_KING_FAHD_ID, weekday: 6, opensAt: "08:00", closesAt: "23:00", isClosed: false },
  ],
  categories: [
    { id: "demo-coffee", tenantId: DEMO_TENANT_ID, sortOrder: 1, nameAr: "القهوة", nameEn: "Coffee", isActive: true },
    { id: "demo-signature", tenantId: DEMO_TENANT_ID, sortOrder: 2, nameAr: "التوقيع", nameEn: "Signature", isActive: true },
    { id: "demo-pastry", tenantId: DEMO_TENANT_ID, sortOrder: 3, nameAr: "المخبوزات والحلى", nameEn: "Pastry & Dessert", isActive: true },
    { id: "demo-cold", tenantId: DEMO_TENANT_ID, sortOrder: 4, nameAr: "بارد ومنعش", nameEn: "Cold & Fresh", isActive: true },
    { id: "demo-tea", tenantId: DEMO_TENANT_ID, sortOrder: 5, nameAr: "الشاي والمشروبات", nameEn: "Tea & Refreshments", isActive: true },
  ],
  products: [
    {
      id: "demo-espresso", tenantId: DEMO_TENANT_ID, categoryId: "demo-coffee", sortOrder: 1,
      nameAr: "إسبريسو مزدوج", nameEn: "Double Espresso", descriptionAr: "قهوة مركزة بنهاية شوكولاتية ناعمة.",
      descriptionEn: "A concentrated cup with a soft chocolate finish.", price: 16, currency: "SAR",
      imageUrl: "/homepage/menu-dish.webp", calories: 8, sodiumMg: 4, caffeineMg: 126, caffeineBasis: "per_cup", isAvailable: true, isFeatured: true,
      allergens: "", tags: ["coffee", "hot"], dietaryLabels: [],
    },
    {
      id: "demo-latte", tenantId: DEMO_TENANT_ID, categoryId: "demo-coffee", sortOrder: 2,
      nameAr: "لاتيه نَفَس", nameEn: "Nafas Latte", descriptionAr: "إسبريسو، حليب مبخر ولمسة فانيلا محمصة.",
      descriptionEn: "Espresso, steamed milk and toasted vanilla.", price: 22, currency: "SAR",
      imageUrl: image("photo-1572442388796-11668a67e53d"), calories: 140, sodiumMg: 95, caffeineMg: 96, caffeineBasis: "per_cup", isAvailable: true, isFeatured: true,
      allergens: "milk", tags: ["signature", "coffee"], dietaryLabels: [],
    },
    {
      id: "demo-spanish", tenantId: DEMO_TENANT_ID, categoryId: "demo-signature", sortOrder: 1,
      nameAr: "سبانش لاتيه بالزعفران", nameEn: "Saffron Spanish Latte", descriptionAr: "لاتيه بارد، حليب مكثف ولمسة زعفران عطرية.",
      descriptionEn: "Iced latte with condensed milk and aromatic saffron.", price: 26, currency: "SAR",
      imageUrl: image("photo-1517701604599-bb29b565090c"), calories: 210, sodiumMg: 110, caffeineMg: 90, caffeineBasis: "per_cup", isAvailable: true, isFeatured: true,
      allergens: "milk", tags: ["signature", "cold"], dietaryLabels: [],
    },
    {
      id: "demo-croissant", tenantId: DEMO_TENANT_ID, categoryId: "demo-pastry", sortOrder: 1,
      nameAr: "كرواسون زبدة", nameEn: "Butter Croissant", descriptionAr: "طبقات هشة مخبوزة صباحاً.",
      descriptionEn: "Flaky layers baked fresh each morning.", price: 18, currency: "SAR",
      imageUrl: image("photo-1555507036-ab1f4038808a"), calories: 260, sodiumMg: 410, isAvailable: true, isFeatured: false,
      allergens: "wheat,milk", tags: ["fresh"], dietaryLabels: [],
    },
    {
      id: "demo-cheesecake", tenantId: DEMO_TENANT_ID, categoryId: "demo-pastry", sortOrder: 2,
      nameAr: "تشيزكيك زعفران", nameEn: "Saffron Cheesecake", descriptionAr: "كريمي، خفيف، مع أثر زعفران عطري.",
      descriptionEn: "Creamy, light and finished with aromatic saffron.", price: 28, currency: "SAR",
      imageUrl: image("photo-1565958011703-44f9829ba187"), calories: 390, sodiumMg: 260, isAvailable: true, isFeatured: true,
      allergens: "milk,wheat", tags: ["dessert"], dietaryLabels: [],
    },
    {
      id: "demo-cinnamon", tenantId: DEMO_TENANT_ID, categoryId: "demo-pastry", sortOrder: 3,
      nameAr: "رول قرفة", nameEn: "Cinnamon Roll", descriptionAr: "عجين طري، قرفة دافئة وتغطية كريمية خفيفة.",
      descriptionEn: "Soft pastry, warm cinnamon and a light cream glaze.", price: 19, currency: "SAR",
      imageUrl: image("photo-1509440159596-0249088772ff"), calories: 320, sodiumMg: 290, isAvailable: true, isFeatured: false,
      allergens: "wheat,milk", tags: ["fresh"], dietaryLabels: [],
    },
    {
      id: "demo-coldbrew", tenantId: DEMO_TENANT_ID, categoryId: "demo-cold", sortOrder: 1,
      nameAr: "كولد برو", nameEn: "Cold Brew", descriptionAr: "استخلاص بارد طويل بطعم نظيف ومنعش.",
      descriptionEn: "Long cold extraction with a clean, refreshing finish.", price: 20, currency: "SAR",
      imageUrl: image("photo-1517701604599-bb29b565090c"), calories: 12, sodiumMg: 8, caffeineMg: 155, caffeineBasis: "per_cup", isAvailable: true, isFeatured: false,
      allergens: "", tags: ["cold"], dietaryLabels: [],
    },
    {
      id: "demo-matcha", tenantId: DEMO_TENANT_ID, categoryId: "demo-cold", sortOrder: 2,
      nameAr: "ماتشا لاتيه", nameEn: "Matcha Latte", descriptionAr: "ماتشا ناعمة مع حليب بارد وتوازن نباتي لطيف.",
      descriptionEn: "Smooth matcha with chilled milk and a gentle vegetal finish.", price: 24, currency: "SAR",
      imageUrl: image("photo-1515823064-d6e0c04616a7"), calories: 130, sodiumMg: 80, caffeineMg: 70, caffeineBasis: "per_cup", isAvailable: true, isFeatured: true,
      allergens: "milk", tags: ["cold"], dietaryLabels: [],
    },
    {
      id: "demo-americano", tenantId: DEMO_TENANT_ID, categoryId: "demo-coffee", sortOrder: 2,
      nameAr: "أمريكانو", nameEn: "Americano", descriptionAr: "إسبريسو وماء ساخن بطابع واضح ونظيف.",
      descriptionEn: "Espresso and hot water with a clean, defined finish.", price: 15, currency: "SAR",
      imageUrl: image("photo-1551030173-122aabc4489c"), calories: 6, sodiumMg: 5, caffeineMg: 126, caffeineBasis: "per_cup", isAvailable: true, isFeatured: false,
      allergens: "", tags: ["coffee", "hot"], dietaryLabels: ["بدون حليب", "No milk"],
    },
    {
      id: "demo-flat-white", tenantId: DEMO_TENANT_ID, categoryId: "demo-coffee", sortOrder: 4,
      nameAr: "فلات وايت", nameEn: "Flat White", descriptionAr: "إسبريسو مزدوج مع حليب مخملي وقوام ناعم.",
      descriptionEn: "Double espresso with silky steamed milk and a smooth body.", price: 20, currency: "SAR",
      imageUrl: image("photo-1534778101976-62847782c213"), calories: 120, sodiumMg: 90, caffeineMg: 126, caffeineBasis: "per_cup", isAvailable: true, isFeatured: false,
      allergens: "حليب / Milk", tags: ["coffee", "hot"], dietaryLabels: ["كلاسيكي", "Classic"],
    },
    {
      id: "demo-cappuccino", tenantId: DEMO_TENANT_ID, categoryId: "demo-coffee", sortOrder: 5,
      nameAr: "كابتشينو", nameEn: "Cappuccino", descriptionAr: "إسبريسو مع حليب مبخر ورغوة كثيفة.",
      descriptionEn: "Espresso with steamed milk and a generous layer of foam.", price: 19, currency: "SAR",
      imageUrl: image("photo-1514432324607-a09d9b4aefdd"), calories: 110, sodiumMg: 85, caffeineMg: 96, caffeineBasis: "per_cup", isAvailable: true, isFeatured: false,
      allergens: "حليب / Milk", tags: ["coffee", "hot"], dietaryLabels: ["كلاسيكي", "Classic"],
    },
    {
      id: "demo-pistachio", tenantId: DEMO_TENANT_ID, categoryId: "demo-signature", sortOrder: 2,
      nameAr: "لاتيه الفستق المحمص", nameEn: "Toasted Pistachio Latte", descriptionAr: "إسبريسو، حليب وفستق محمص بنهاية غنية.",
      descriptionEn: "Espresso, milk and toasted pistachio with a rich finish.", price: 27, currency: "SAR",
      imageUrl: image("photo-1509042239860-f550ce710b93"), calories: 230, sodiumMg: 120, caffeineMg: 96, caffeineBasis: "per_cup", isAvailable: true, isFeatured: true,
      allergens: "حليب، فستق / Milk, pistachio", tags: ["signature", "pistachio"], dietaryLabels: ["مميز", "Signature"],
    },
    {
      id: "demo-rose", tenantId: DEMO_TENANT_ID, categoryId: "demo-signature", sortOrder: 3,
      nameAr: "لاتيه الورد والهيل", nameEn: "Rose Cardamom Latte", descriptionAr: "لاتيه ناعم مع الورد والهيل بلمسة عطرية خفيفة.",
      descriptionEn: "Silky latte with rose and cardamom.", price: 24, currency: "SAR",
      imageUrl: image("photo-1495474472287-4d71bcdd2085"), calories: 155, sodiumMg: 95, caffeineMg: 96, caffeineBasis: "per_cup", isAvailable: true, isFeatured: false,
      allergens: "حليب / Milk", tags: ["signature", "floral"], dietaryLabels: ["موسمي", "Seasonal"],
    },
    {
      id: "demo-iced-americano", tenantId: DEMO_TENANT_ID, categoryId: "demo-cold", sortOrder: 2,
      nameAr: "آيس أمريكانو", nameEn: "Iced Americano", descriptionAr: "إسبريسو بارد وماء مع ثلج وانتعاش واضح.",
      descriptionEn: "Espresso, chilled water and ice for a crisp finish.", price: 17, currency: "SAR",
      imageUrl: image("photo-1517701604599-bb29b565090c"), calories: 8, sodiumMg: 6, caffeineMg: 126, caffeineBasis: "per_cup", isAvailable: true, isFeatured: false,
      allergens: "", tags: ["cold", "coffee"], dietaryLabels: ["بدون حليب", "No milk"],
    },
    {
      id: "demo-iced-latte", tenantId: DEMO_TENANT_ID, categoryId: "demo-cold", sortOrder: 3,
      nameAr: "آيس لاتيه", nameEn: "Iced Latte", descriptionAr: "إسبريسو وحليب بارد فوق الثلج.",
      descriptionEn: "Espresso and chilled milk over ice.", price: 21, currency: "SAR",
      imageUrl: image("photo-1461023058943-07fcbe16d735"), calories: 135, sodiumMg: 92, caffeineMg: 96, caffeineBasis: "per_cup", isAvailable: true, isFeatured: false,
      allergens: "حليب / Milk", tags: ["cold", "coffee"], dietaryLabels: ["كلاسيكي", "Classic"],
    },
    {
      id: "demo-strawberry-matcha", tenantId: DEMO_TENANT_ID, categoryId: "demo-cold", sortOrder: 4,
      nameAr: "ستروبيري ماتشا", nameEn: "Strawberry Matcha", descriptionAr: "طبقات فراولة منعشة مع ماتشا وحليب بارد.",
      descriptionEn: "Refreshing strawberry layers with matcha and chilled milk.", price: 28, currency: "SAR",
      imageUrl: image("photo-1515823064-d6e0c04616a7"), calories: 190, sodiumMg: 85, caffeineMg: 65, caffeineBasis: "per_cup", isAvailable: true, isFeatured: true,
      allergens: "حليب / Milk", tags: ["cold", "matcha", "fruit"], dietaryLabels: ["مميز", "Signature"],
    },
    {
      id: "demo-almond-croissant", tenantId: DEMO_TENANT_ID, categoryId: "demo-pastry", sortOrder: 2,
      nameAr: "كرواسون اللوز", nameEn: "Almond Croissant", descriptionAr: "كرواسون زبدة بحشوة اللوز ورشة سكر خفيفة.",
      descriptionEn: "Butter croissant filled with almond cream and a light sugar finish.", price: 22, currency: "SAR",
      imageUrl: image("photo-1555507036-ab1f4038808a"), calories: 330, sodiumMg: 360, isAvailable: true, isFeatured: false,
      allergens: "قمح، حليب، بيض، لوز / Wheat, milk, egg, almond", tags: ["fresh", "almond"], dietaryLabels: ["مميز", "Signature"],
    },
    {
      id: "demo-cookie", tenantId: DEMO_TENANT_ID, categoryId: "demo-pastry", sortOrder: 4,
      nameAr: "كوكيز شوكولاتة", nameEn: "Chocolate Chip Cookie", descriptionAr: "كوكيز طرية بحبيبات شوكولاتة داكنة.",
      descriptionEn: "Soft-baked cookie with dark chocolate chips.", price: 12, currency: "SAR",
      imageUrl: image("photo-1499636136210-6f4ee915583e"), calories: 210, sodiumMg: 170, isAvailable: true, isFeatured: false,
      allergens: "قمح، حليب، بيض / Wheat, milk, egg", tags: ["dessert", "chocolate"], dietaryLabels: ["الأكثر طلبًا", "Best seller"],
    },
    {
      id: "demo-chocolate-cake", tenantId: DEMO_TENANT_ID, categoryId: "demo-pastry", sortOrder: 5,
      nameAr: "كيكة الشوكولاتة", nameEn: "Chocolate Cake", descriptionAr: "كيكة شوكولاتة غنية بطبقة كريمة خفيفة.",
      descriptionEn: "Rich chocolate cake with a light cream finish.", price: 26, currency: "SAR",
      imageUrl: image("photo-1578985545062-69928b1d9587"), calories: 420, sodiumMg: 280, isAvailable: true, isFeatured: true,
      allergens: "قمح، حليب، بيض / Wheat, milk, egg", tags: ["dessert", "chocolate"], dietaryLabels: ["مميز", "Signature"],
    },
    {
      id: "demo-iced-tea", tenantId: DEMO_TENANT_ID, categoryId: "demo-tea", sortOrder: 1,
      nameAr: "شاي خوخ مثلج", nameEn: "Peach Iced Tea", descriptionAr: "شاي أسود بارد بنكهة الخوخ ولمسة حمضية منعشة.",
      descriptionEn: "Chilled black tea with peach and a refreshing citrus lift.", price: 18, currency: "SAR",
      imageUrl: image("photo-1513558161293-cdaf765ed2fd"), calories: 80, sodiumMg: 5, caffeineMg: 35, caffeineBasis: "per_cup", isAvailable: true, isFeatured: false,
      allergens: "", tags: ["tea", "cold"], dietaryLabels: ["بدون حليب", "No milk"],
    },
    {
      id: "demo-mint-tea", tenantId: DEMO_TENANT_ID, categoryId: "demo-tea", sortOrder: 2,
      nameAr: "شاي نعناع", nameEn: "Mint Tea", descriptionAr: "شاي أسود مع نعناع طازج يقدم ساخنًا.",
      descriptionEn: "Black tea with fresh mint, served hot.", price: 12, currency: "SAR",
      imageUrl: image("photo-1513558161293-cdaf765ed2fd"), calories: 5, sodiumMg: 2, caffeineMg: 35, caffeineBasis: "per_cup", isAvailable: true, isFeatured: false,
      allergens: "", tags: ["tea", "hot"], dietaryLabels: ["بدون حليب", "No milk"],
    },
    {
      id: "demo-lemon-mint", tenantId: DEMO_TENANT_ID, categoryId: "demo-tea", sortOrder: 3,
      nameAr: "ليمون ونعناع", nameEn: "Lemon Mint Cooler", descriptionAr: "ليمون طازج، نعناع وثلج لمشروب خفيف ومنعش.",
      descriptionEn: "Fresh lemon, mint and ice for a light, refreshing cooler.", price: 19, currency: "SAR",
      imageUrl: image("photo-1513558161293-cdaf765ed2fd"), calories: 65, sodiumMg: 4, isAvailable: true, isFeatured: false,
      allergens: "", tags: ["refreshment", "cold"], dietaryLabels: ["نباتي", "Vegan"],
    },
  ],
  productOptions: {
    "demo-latte": {
      variants: [
        { id: "demo-latte-small", tenantId: DEMO_TENANT_ID, productId: "demo-latte", nameAr: "صغير", nameEn: "Small", price: 22, sortOrder: 1, isAvailable: true },
        { id: "demo-latte-large", tenantId: DEMO_TENANT_ID, productId: "demo-latte", nameAr: "كبير", nameEn: "Large", price: 26, sortOrder: 2, isAvailable: true },
      ],
      groups: [
        { id: "demo-latte-milk", tenantId: DEMO_TENANT_ID, nameAr: "نوع الحليب", nameEn: "Milk choice", minSelect: 1, maxSelect: 1, sortOrder: 1, isRequired: true, isActive: true },
      ],
      options: [
        { id: "demo-latte-oat", tenantId: DEMO_TENANT_ID, groupId: "demo-latte-milk", nameAr: "حليب الشوفان", nameEn: "Oat milk", priceDelta: 4, sortOrder: 1, isAvailable: true },
        { id: "demo-latte-almond", tenantId: DEMO_TENANT_ID, groupId: "demo-latte-milk", nameAr: "حليب اللوز", nameEn: "Almond milk", priceDelta: 4, sortOrder: 2, isAvailable: true },
      ],
    },
    "demo-spanish": {
      variants: [
        { id: "demo-spanish-regular", tenantId: DEMO_TENANT_ID, productId: "demo-spanish", nameAr: "عادي", nameEn: "Regular", price: 26, sortOrder: 1, isAvailable: true },
        { id: "demo-spanish-large", tenantId: DEMO_TENANT_ID, productId: "demo-spanish", nameAr: "كبير", nameEn: "Large", price: 30, sortOrder: 2, isAvailable: true },
      ],
      groups: [
        { id: "demo-spanish-sweetness", tenantId: DEMO_TENANT_ID, nameAr: "مستوى الحلاوة", nameEn: "Sweetness", minSelect: 1, maxSelect: 1, sortOrder: 1, isRequired: true, isActive: true },
        { id: "demo-spanish-extra", tenantId: DEMO_TENANT_ID, nameAr: "إضافات", nameEn: "Extras", minSelect: 0, maxSelect: 2, sortOrder: 2, isRequired: false, isActive: true },
      ],
      options: [
        { id: "demo-spanish-less", tenantId: DEMO_TENANT_ID, groupId: "demo-spanish-sweetness", nameAr: "أقل حلاوة", nameEn: "Less sweet", priceDelta: 0, sortOrder: 1, isAvailable: true },
        { id: "demo-spanish-regular", tenantId: DEMO_TENANT_ID, groupId: "demo-spanish-sweetness", nameAr: "عادي", nameEn: "Regular", priceDelta: 0, sortOrder: 2, isAvailable: true },
        { id: "demo-spanish-saffron", tenantId: DEMO_TENANT_ID, groupId: "demo-spanish-extra", nameAr: "زعفران إضافي", nameEn: "Extra saffron", priceDelta: 4, sortOrder: 1, isAvailable: true },
        { id: "demo-spanish-foam", tenantId: DEMO_TENANT_ID, groupId: "demo-spanish-extra", nameAr: "رغوة حليب", nameEn: "Milk foam", priceDelta: 2, sortOrder: 2, isAvailable: true },
      ],
    },
    "demo-pistachio": {
      variants: [
        { id: "demo-pistachio-regular", tenantId: DEMO_TENANT_ID, productId: "demo-pistachio", nameAr: "عادي", nameEn: "Regular", price: 27, sortOrder: 1, isAvailable: true },
        { id: "demo-pistachio-large", tenantId: DEMO_TENANT_ID, productId: "demo-pistachio", nameAr: "كبير", nameEn: "Large", price: 31, sortOrder: 2, isAvailable: true },
      ],
      groups: [
        { id: "demo-pistachio-milk", tenantId: DEMO_TENANT_ID, nameAr: "نوع الحليب", nameEn: "Milk choice", minSelect: 1, maxSelect: 1, sortOrder: 1, isRequired: true, isActive: true },
        { id: "demo-pistachio-extra", tenantId: DEMO_TENANT_ID, nameAr: "إضافات", nameEn: "Extras", minSelect: 0, maxSelect: 2, sortOrder: 2, isRequired: false, isActive: true },
      ],
      options: [
        { id: "demo-pistachio-oat", tenantId: DEMO_TENANT_ID, groupId: "demo-pistachio-milk", nameAr: "حليب الشوفان", nameEn: "Oat milk", priceDelta: 4, sortOrder: 1, isAvailable: true },
        { id: "demo-pistachio-almond", tenantId: DEMO_TENANT_ID, groupId: "demo-pistachio-milk", nameAr: "حليب اللوز", nameEn: "Almond milk", priceDelta: 4, sortOrder: 2, isAvailable: true },
        { id: "demo-pistachio-extra", tenantId: DEMO_TENANT_ID, groupId: "demo-pistachio-extra", nameAr: "فستق إضافي", nameEn: "Extra pistachio", priceDelta: 5, sortOrder: 1, isAvailable: true },
        { id: "demo-pistachio-shot", tenantId: DEMO_TENANT_ID, groupId: "demo-pistachio-extra", nameAr: "شوت إسبريسو", nameEn: "Espresso shot", priceDelta: 6, sortOrder: 2, isAvailable: true },
      ],
    },
    "demo-matcha": {
      variants: [
        { id: "demo-matcha-regular", tenantId: DEMO_TENANT_ID, productId: "demo-matcha", nameAr: "عادي", nameEn: "Regular", price: 24, sortOrder: 1, isAvailable: true },
        { id: "demo-matcha-large", tenantId: DEMO_TENANT_ID, productId: "demo-matcha", nameAr: "كبير", nameEn: "Large", price: 28, sortOrder: 2, isAvailable: true },
      ],
      groups: [
        { id: "demo-matcha-milk", tenantId: DEMO_TENANT_ID, nameAr: "نوع الحليب", nameEn: "Milk choice", minSelect: 1, maxSelect: 1, sortOrder: 1, isRequired: true, isActive: true },
        { id: "demo-matcha-sweetness", tenantId: DEMO_TENANT_ID, nameAr: "الحلاوة", nameEn: "Sweetness", minSelect: 1, maxSelect: 1, sortOrder: 2, isRequired: true, isActive: true },
      ],
      options: [
        { id: "demo-matcha-oat", tenantId: DEMO_TENANT_ID, groupId: "demo-matcha-milk", nameAr: "حليب الشوفان", nameEn: "Oat milk", priceDelta: 4, sortOrder: 1, isAvailable: true },
        { id: "demo-matcha-almond", tenantId: DEMO_TENANT_ID, groupId: "demo-matcha-milk", nameAr: "حليب اللوز", nameEn: "Almond milk", priceDelta: 4, sortOrder: 2, isAvailable: true },
        { id: "demo-matcha-less", tenantId: DEMO_TENANT_ID, groupId: "demo-matcha-sweetness", nameAr: "أقل حلاوة", nameEn: "Less sweet", priceDelta: 0, sortOrder: 1, isAvailable: true },
        { id: "demo-matcha-regular", tenantId: DEMO_TENANT_ID, groupId: "demo-matcha-sweetness", nameAr: "عادي", nameEn: "Regular", priceDelta: 0, sortOrder: 2, isAvailable: true },
      ],
    },
    "demo-strawberry-matcha": {
      variants: [
        { id: "demo-strawberry-matcha-regular", tenantId: DEMO_TENANT_ID, productId: "demo-strawberry-matcha", nameAr: "عادي", nameEn: "Regular", price: 28, sortOrder: 1, isAvailable: true },
        { id: "demo-strawberry-matcha-large", tenantId: DEMO_TENANT_ID, productId: "demo-strawberry-matcha", nameAr: "كبير", nameEn: "Large", price: 32, sortOrder: 2, isAvailable: true },
      ],
      groups: [
        { id: "demo-strawberry-matcha-milk", tenantId: DEMO_TENANT_ID, nameAr: "نوع الحليب", nameEn: "Milk choice", minSelect: 1, maxSelect: 1, sortOrder: 1, isRequired: true, isActive: true },
        { id: "demo-strawberry-matcha-extra", tenantId: DEMO_TENANT_ID, nameAr: "إضافات", nameEn: "Extras", minSelect: 0, maxSelect: 2, sortOrder: 2, isRequired: false, isActive: true },
      ],
      options: [
        { id: "demo-strawberry-matcha-oat", tenantId: DEMO_TENANT_ID, groupId: "demo-strawberry-matcha-milk", nameAr: "حليب الشوفان", nameEn: "Oat milk", priceDelta: 4, sortOrder: 1, isAvailable: true },
        { id: "demo-strawberry-matcha-almond", tenantId: DEMO_TENANT_ID, groupId: "demo-strawberry-matcha-milk", nameAr: "حليب اللوز", nameEn: "Almond milk", priceDelta: 4, sortOrder: 2, isAvailable: true },
        { id: "demo-strawberry-matcha-berry", tenantId: DEMO_TENANT_ID, groupId: "demo-strawberry-matcha-extra", nameAr: "صوص توت إضافي", nameEn: "Extra berry sauce", priceDelta: 3, sortOrder: 1, isAvailable: true },
        { id: "demo-strawberry-matcha-matcha", tenantId: DEMO_TENANT_ID, groupId: "demo-strawberry-matcha-extra", nameAr: "ماتشا إضافية", nameEn: "Extra matcha", priceDelta: 4, sortOrder: 2, isAvailable: true },
      ],
    },
    "demo-coldbrew": {
      variants: [
        { id: "demo-coldbrew-regular", tenantId: DEMO_TENANT_ID, productId: "demo-coldbrew", nameAr: "عادي", nameEn: "Regular", price: 20, sortOrder: 1, isAvailable: true },
        { id: "demo-coldbrew-large", tenantId: DEMO_TENANT_ID, productId: "demo-coldbrew", nameAr: "كبير", nameEn: "Large", price: 24, sortOrder: 2, isAvailable: true },
      ],
      groups: [
        { id: "demo-coldbrew-sweetness", tenantId: DEMO_TENANT_ID, nameAr: "التحلية", nameEn: "Sweetness", minSelect: 1, maxSelect: 1, sortOrder: 1, isRequired: true, isActive: true },
        { id: "demo-coldbrew-extra", tenantId: DEMO_TENANT_ID, nameAr: "إضافات", nameEn: "Extras", minSelect: 0, maxSelect: 2, sortOrder: 2, isRequired: false, isActive: true },
      ],
      options: [
        { id: "demo-coldbrew-none", tenantId: DEMO_TENANT_ID, groupId: "demo-coldbrew-sweetness", nameAr: "بدون تحلية", nameEn: "No sweetener", priceDelta: 0, sortOrder: 1, isAvailable: true },
        { id: "demo-coldbrew-vanilla", tenantId: DEMO_TENANT_ID, groupId: "demo-coldbrew-sweetness", nameAr: "فانيلا", nameEn: "Vanilla", priceDelta: 3, sortOrder: 2, isAvailable: true },
        { id: "demo-coldbrew-shot", tenantId: DEMO_TENANT_ID, groupId: "demo-coldbrew-extra", nameAr: "شوت إضافي", nameEn: "Extra shot", priceDelta: 6, sortOrder: 1, isAvailable: true },
        { id: "demo-coldbrew-cream", tenantId: DEMO_TENANT_ID, groupId: "demo-coldbrew-extra", nameAr: "كريمة باردة", nameEn: "Cold foam", priceDelta: 4, sortOrder: 2, isAvailable: true },
      ],
    },
    "demo-croissant": {
      variants: [
        { id: "demo-croissant-single", tenantId: DEMO_TENANT_ID, productId: "demo-croissant", nameAr: "حبة", nameEn: "Single", price: 18, sortOrder: 1, isAvailable: true },
        { id: "demo-croissant-box", tenantId: DEMO_TENANT_ID, productId: "demo-croissant", nameAr: "علبة 4 حبات", nameEn: "Box of 4", price: 64, sortOrder: 2, isAvailable: true },
      ],
      groups: [
        { id: "demo-croissant-serve", tenantId: DEMO_TENANT_ID, nameAr: "التقديم", nameEn: "Serving", minSelect: 1, maxSelect: 1, sortOrder: 1, isRequired: true, isActive: true },
        { id: "demo-croissant-extra", tenantId: DEMO_TENANT_ID, nameAr: "إضافات", nameEn: "Extras", minSelect: 0, maxSelect: 2, sortOrder: 2, isRequired: false, isActive: true },
      ],
      options: [
        { id: "demo-croissant-warm", tenantId: DEMO_TENANT_ID, groupId: "demo-croissant-serve", nameAr: "دافئ", nameEn: "Warm", priceDelta: 0, sortOrder: 1, isAvailable: true },
        { id: "demo-croissant-room", tenantId: DEMO_TENANT_ID, groupId: "demo-croissant-serve", nameAr: "درجة الغرفة", nameEn: "Room temperature", priceDelta: 0, sortOrder: 2, isAvailable: true },
        { id: "demo-croissant-honey", tenantId: DEMO_TENANT_ID, groupId: "demo-croissant-extra", nameAr: "عسل", nameEn: "Honey", priceDelta: 2, sortOrder: 1, isAvailable: true },
        { id: "demo-croissant-cream", tenantId: DEMO_TENANT_ID, groupId: "demo-croissant-extra", nameAr: "كريمة فانيلا", nameEn: "Vanilla cream", priceDelta: 3, sortOrder: 2, isAvailable: true },
      ],
    },
    "demo-cheesecake": {
      variants: [
        { id: "demo-cheesecake-slice", tenantId: DEMO_TENANT_ID, productId: "demo-cheesecake", nameAr: "شريحة", nameEn: "Slice", price: 28, sortOrder: 1, isAvailable: true },
        { id: "demo-cheesecake-sharing", tenantId: DEMO_TENANT_ID, productId: "demo-cheesecake", nameAr: "للمشاركة", nameEn: "Sharing size", price: 48, sortOrder: 2, isAvailable: true },
      ],
      groups: [
        { id: "demo-cheesecake-extra", tenantId: DEMO_TENANT_ID, nameAr: "إضافات", nameEn: "Extras", minSelect: 0, maxSelect: 2, sortOrder: 1, isRequired: false, isActive: true },
      ],
      options: [
        { id: "demo-cheesecake-saffron", tenantId: DEMO_TENANT_ID, groupId: "demo-cheesecake-extra", nameAr: "صوص زعفران", nameEn: "Saffron sauce", priceDelta: 4, sortOrder: 1, isAvailable: true },
        { id: "demo-cheesecake-berries", tenantId: DEMO_TENANT_ID, groupId: "demo-cheesecake-extra", nameAr: "توت مشكل", nameEn: "Mixed berries", priceDelta: 5, sortOrder: 2, isAvailable: true },
      ],
    },
    "demo-iced-tea": {
      variants: [
        { id: "demo-iced-tea-regular", tenantId: DEMO_TENANT_ID, productId: "demo-iced-tea", nameAr: "عادي", nameEn: "Regular", price: 18, sortOrder: 1, isAvailable: true },
        { id: "demo-iced-tea-large", tenantId: DEMO_TENANT_ID, productId: "demo-iced-tea", nameAr: "كبير", nameEn: "Large", price: 22, sortOrder: 2, isAvailable: true },
      ],
      groups: [
        { id: "demo-iced-tea-sweetness", tenantId: DEMO_TENANT_ID, nameAr: "الحلاوة", nameEn: "Sweetness", minSelect: 1, maxSelect: 1, sortOrder: 1, isRequired: true, isActive: true },
        { id: "demo-iced-tea-extra", tenantId: DEMO_TENANT_ID, nameAr: "إضافات", nameEn: "Extras", minSelect: 0, maxSelect: 2, sortOrder: 2, isRequired: false, isActive: true },
      ],
      options: [
        { id: "demo-iced-tea-less", tenantId: DEMO_TENANT_ID, groupId: "demo-iced-tea-sweetness", nameAr: "أقل حلاوة", nameEn: "Less sweet", priceDelta: 0, sortOrder: 1, isAvailable: true },
        { id: "demo-iced-tea-regular", tenantId: DEMO_TENANT_ID, groupId: "demo-iced-tea-sweetness", nameAr: "عادي", nameEn: "Regular", priceDelta: 0, sortOrder: 2, isAvailable: true },
        { id: "demo-iced-tea-lemon", tenantId: DEMO_TENANT_ID, groupId: "demo-iced-tea-extra", nameAr: "ليمون إضافي", nameEn: "Extra lemon", priceDelta: 2, sortOrder: 1, isAvailable: true },
        { id: "demo-iced-tea-peach", tenantId: DEMO_TENANT_ID, groupId: "demo-iced-tea-extra", nameAr: "خوخ إضافي", nameEn: "Extra peach", priceDelta: 3, sortOrder: 2, isAvailable: true },
      ],
    },

  },
  productOffers: {
    "demo-latte": {
      id: "demo-offer-latte", tenantId: DEMO_TENANT_ID, productId: "demo-latte", offerType: "percentage", value: 10,
      labelAr: "عرض الصباح · 10٪", labelEn: "Morning offer · 10% off", startsAt: null, endsAt: null, isActive: true,
    },
    "demo-croissant": {
      id: "demo-offer-croissant", tenantId: DEMO_TENANT_ID, productId: "demo-croissant", offerType: "bogo", value: null,
      labelAr: "اشترِ 1 واحصل على 1", labelEn: "Buy 1 Get 1 Free", startsAt: null, endsAt: null, isActive: true,
    },
    "demo-cheesecake": {
      id: "demo-offer-cheesecake", tenantId: DEMO_TENANT_ID, productId: "demo-cheesecake", offerType: "sale_price", value: 24,
      labelAr: "سعر خاص", labelEn: "Special price", startsAt: null, endsAt: null, isActive: true,
    },
  },
};