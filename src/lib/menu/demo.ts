import type { PublicMenu } from "./types";

const DEMO_TENANT_ID = "demo-nafas";
const DEMO_BRANCH_ID = "demo-nafas-olaya";

export const DEMO_MENU: PublicMenu = {
  tenant: {
    id: DEMO_TENANT_ID,
    slug: "nafas",
    nameAr: "نَفَس",
    nameEn: "Nafas",
    taglineAr: "قهوة مختصة ومخبوزات يومية في العليا",
    taglineEn: "Specialty coffee and daily pastry in Al Olaya",
    // Packaged from the current Studio-selected tenant media so the official demo is deterministic and CI-safe.
    logoUrl: "/demo/nafas-logo.webp",
    coverUrl: "/demo/nafas-cover.webp",
    instagramUrl: "https://instagram.com/nafas",
    whatsapp: "966500000000",
    whatsappTemplate: "السلام عليكم، أريد الاستفسار عن {product} من {restaurant}.",
    primaryColor: "#1c1712",
    accentColor: "#9a5a38",
    themeKey: "heritage",
    currency: "SAR",
    city: "الرياض",
    country: "SA",
  },
  branch: {
    id: DEMO_BRANCH_ID, tenantId: DEMO_TENANT_ID, slug: "olaya",
    nameAr: "فرع العليا", nameEn: "Olaya branch",
    addressAr: "طريق الملك فهد، حي العليا، الرياض",
    addressEn: "King Fahd Road, Al Olaya, Riyadh",
    mapsUrl: "https://maps.google.com/?q=Al+Olaya+Riyadh",
    phone: "0110000000", isActive: true,
  },
  branches: [{
    id: DEMO_BRANCH_ID, tenantId: DEMO_TENANT_ID, slug: "olaya",
    nameAr: "فرع العليا", nameEn: "Olaya branch",
    addressAr: "طريق الملك فهد، حي العليا، الرياض",
    addressEn: "King Fahd Road, Al Olaya, Riyadh",
    mapsUrl: "https://maps.google.com/?q=Al+Olaya+Riyadh",
    phone: "0110000000", isActive: true,
  }],
  hours: [
    { branchId: DEMO_BRANCH_ID, weekday:0, opensAt:"07:00", closesAt:"00:00", isClosed:false },
    { branchId: DEMO_BRANCH_ID, weekday:1, opensAt:"07:00", closesAt:"00:00", isClosed:false },
    { branchId: DEMO_BRANCH_ID, weekday:2, opensAt:"07:00", closesAt:"00:00", isClosed:false },
    { branchId: DEMO_BRANCH_ID, weekday:3, opensAt:"07:00", closesAt:"00:00", isClosed:false },
    { branchId: DEMO_BRANCH_ID, weekday:4, opensAt:"07:00", closesAt:"00:00", isClosed:false },
    { branchId: DEMO_BRANCH_ID, weekday:5, opensAt:"13:00", closesAt:"00:00", isClosed:false },
    { branchId: DEMO_BRANCH_ID, weekday:6, opensAt:"07:00", closesAt:"00:00", isClosed:false },
  ],
  categories: [
    { id:"demo-cat-coffee", tenantId: DEMO_TENANT_ID, sortOrder:1, nameAr:"القهوة", nameEn:"Coffee", isActive:true },
    { id:"demo-cat-bakery", tenantId: DEMO_TENANT_ID, sortOrder:2, nameAr:"المخبوزات", nameEn:"Bakery", isActive:true },
    { id:"demo-cat-kitchen", tenantId: DEMO_TENANT_ID, sortOrder:3, nameAr:"المطبخ", nameEn:"Kitchen", isActive:true },
    { id:"demo-cat-sweet", tenantId: DEMO_TENANT_ID, sortOrder:4, nameAr:"الحلى", nameEn:"Sweets", isActive:true },
    { id:"872f4d2a-2963-44a4-bc2e-ab4528292620", tenantId: DEMO_TENANT_ID, sortOrder:50, nameAr:"الأكثر شراء", nameEn:"Best sale", isActive:true },
  ],
  products: [
    { id:"demo-p-croissant", tenantId: DEMO_TENANT_ID, categoryId:"demo-cat-bakery", sortOrder:10, nameAr:"كرواسون زبدة", nameEn:"Butter croissant", descriptionAr:"طبقات يومية من الزبدة الفرنسية. يُخبز فجراً.", descriptionEn:"Laminated daily with French butter. Baked at dawn.", price:14, currency:"SAR", imageUrl:"https://images.unsplash.com/photo-1725545901708-27d59e5c4226?auto=format&fit=crop&fm=jpg&q=85&w=1200", calories:280, sodiumMg:null, caffeineMg:null, caffeineBasis:null, isAvailable:true, isFeatured:true, allergens:"غلوتين,حليب,بيض", tags:[], dietaryLabels:[] },
    { id:"demo-p-zaatar", tenantId: DEMO_TENANT_ID, categoryId:"demo-cat-bakery", sortOrder:20, nameAr:"مناقيش زعتر", nameEn:"Zaatar manakish", descriptionAr:"عجينة رقيقة، زعتر بلدي، وزيت زيتون الجوف.", descriptionEn:"Thin dough, local zaatar, and Al-Jouf olive oil.", price:15, currency:"SAR", imageUrl:"https://as2.ftcdn.net/jpg/17/59/31/01/1000_F_1759310168_9o8rhRjzgykhzv1fWvnvzpUEDBCGnIX7.jpg", calories:320, sodiumMg:null, caffeineMg:null, caffeineBasis:null, isAvailable:true, isFeatured:false, allergens:"غلوتين", tags:[], dietaryLabels:[] },
    { id:"demo-p-date", tenantId: DEMO_TENANT_ID, categoryId:"demo-cat-bakery", sortOrder:30, nameAr:"سكونز تمر", nameEn:"Date scone", descriptionAr:"تمر سكري مع زبده وسمن بلدي.", descriptionEn:"Sukkari dates with butter and samneh.", price:13, currency:"SAR", imageUrl:"https://as1.ftcdn.net/v2/jpg/21/75/72/02/1000_F_2175720222_1JvMOrm45I7a2f7R0NPWe2U6PhFoUP32.jpg", calories:260, sodiumMg:null, caffeineMg:null, caffeineBasis:null, isAvailable:true, isFeatured:false, allergens:"غلوتين,حليب", tags:[], dietaryLabels:[] },
    { id:"demo-p-v60", tenantId: DEMO_TENANT_ID, categoryId:"demo-cat-coffee", sortOrder:10, nameAr:"في ٦٠", nameEn:"V60", descriptionAr:"تحضير يدوي من محصول موسمي مختار. نكهة نظيفة وحموضة متوازنة.", descriptionEn:"Hand-poured seasonal lot. Clean cup, balanced acidity.", price:22, currency:"SAR", imageUrl:"https://as1.ftcdn.net/v2/jpg/21/77/66/90/1000_F_2177669011_WDRoZx2uS5038Am7NeGoWW2qG4cmmlwd.jpg", calories:5, sodiumMg:null, caffeineMg:null, caffeineBasis:null, isAvailable:true, isFeatured:true, allergens:"", tags:[], dietaryLabels:[] },
    { id:"demo-p-flatwhite", tenantId: DEMO_TENANT_ID, categoryId:"demo-cat-coffee", sortOrder:20, nameAr:"فلات وايت", nameEn:"Flat White", descriptionAr:"شات من الحليب المبخر فوق إسبرسو مزدوج.", descriptionEn:"Steamed milk over a double espresso.", price:18, currency:"SAR", imageUrl:"https://images.unsplash.com/photo-1727080409436-356bdc609899?auto=format&fit=crop&fm=jpg&q=85&w=1200", calories:140, sodiumMg:null, caffeineMg:null, caffeineBasis:null, isAvailable:true, isFeatured:true, allergens:"حليب", tags:[], dietaryLabels:[] },
    { id:"demo-p-arabic", tenantId: DEMO_TENANT_ID, categoryId:"demo-cat-coffee", sortOrder:30, nameAr:"قهوة عربية بالهيل", nameEn:"Arabic coffee with cardamom", descriptionAr:"دلة صغيرة تُقدَّم مع تمر محشي.", descriptionEn:"Small dallah service with stuffed dates.", price:16, currency:"SAR", imageUrl:"https://as2.ftcdn.net/v2/jpg/20/52/12/51/1000_F_2052125172_bYrRSXIrXMk9MSK6jMsJtduqrlmXcFf1.jpg", calories:20, sodiumMg:null, caffeineMg:null, caffeineBasis:null, isAvailable:true, isFeatured:false, allergens:"", tags:[], dietaryLabels:[] },
    { id:"demo-p-spiced", tenantId: DEMO_TENANT_ID, categoryId:"demo-cat-coffee", sortOrder:40, nameAr:"لاتيه هيل", nameEn:"Cardamom latte", descriptionAr:"لاتيه مع هيل مطحون طازج وعسل طلح.", descriptionEn:"Latte with fresh cardamom and Talh honey.", price:21, currency:"SAR", imageUrl:"https://as2.ftcdn.net/v2/jpg/13/32/73/35/1000_F_1332733539_VwFIV259dumIzLwVIAUoqzel9nlkpYQU.jpg", calories:180, sodiumMg:null, caffeineMg:null, caffeineBasis:null, isAvailable:true, isFeatured:false, allergens:"حليب", tags:[], dietaryLabels:[] },
    { id:"demo-p-shakshuka", tenantId: DEMO_TENANT_ID, categoryId:"demo-cat-kitchen", sortOrder:10, nameAr:"شكشوكة الفرن", nameEn:"Oven shakshuka", descriptionAr:"طماطم مطهية، فلفل، بيض، وخبز تنور.", descriptionEn:"Slow tomatoes, peppers, eggs, and tannour bread.", price:32, currency:"SAR", imageUrl:"https://as2.ftcdn.net/v2/jpg/06/52/95/11/1000_F_652951161_otAu5PIQKDqDocAfFtlDYIp1OPJ6PeXI.jpg", calories:410, sodiumMg:null, caffeineMg:null, caffeineBasis:null, isAvailable:true, isFeatured:true, allergens:"بيض,غلوتين", tags:[], dietaryLabels:[] },
    { id:"demo-p-halloumi", tenantId: DEMO_TENANT_ID, categoryId:"demo-cat-kitchen", sortOrder:20, nameAr:"صحن حلومي مشوي", nameEn:"Grilled halloumi plate", descriptionAr:"حلومي، بندورة كرزية، زعتر، وعيش صاج.", descriptionEn:"Halloumi, cherry tomato, zaatar, and saj bread.", price:29, currency:"SAR", imageUrl:"https://as2.ftcdn.net/v2/jpg/21/83/26/39/1000_F_2183263959_h0GlWuVtcbeRNGG6PwEZsXw7F8O5dZwy.jpg", calories:380, sodiumMg:null, caffeineMg:null, caffeineBasis:null, isAvailable:true, isFeatured:false, allergens:"حليب,غلوتين", tags:[], dietaryLabels:[] },
    { id:"demo-p-salad", tenantId: DEMO_TENANT_ID, categoryId:"demo-cat-kitchen", sortOrder:30, nameAr:"سلطة فريكة", nameEn:"Freekeh salad", descriptionAr:"فريكة، رمان، نعناع، ولوز محمص.", descriptionEn:"Freekeh, pomegranate, mint, and toasted almonds.", price:27, currency:"SAR", imageUrl:"https://as2.ftcdn.net/v2/jpg/12/81/35/37/1000_F_1281353739_Kv7PQeqmHU9Afl7VqaPgnHYcJ4PfgROj.jpg", calories:240, sodiumMg:null, caffeineMg:null, caffeineBasis:null, isAvailable:true, isFeatured:false, allergens:"مكسرات", tags:[], dietaryLabels:[] },
    { id:"demo-p-kunafa", tenantId: DEMO_TENANT_ID, categoryId:"demo-cat-sweet", sortOrder:10, nameAr:"كنافة نَفَس", nameEn:"Nafas kunafa", descriptionAr:"كنافة ناعمة بقشطة طازجة، تُحضر عند الطلب.", descriptionEn:"Fine kunafa with fresh cream, made to order.", price:24, currency:"SAR", imageUrl:"https://as1.ftcdn.net/v2/jpg/06/51/24/96/1000_F_651249684_vUgQkQOpFf7VwiXaPaomYY3eHmQJURAs.jpg", calories:450, sodiumMg:null, caffeineMg:null, caffeineBasis:null, isAvailable:true, isFeatured:true, allergens:"حليب,غلوتين", tags:[], dietaryLabels:[] },
    { id:"demo-p-basbousa", tenantId: DEMO_TENANT_ID, categoryId:"demo-cat-sweet", sortOrder:20, nameAr:"بسبوسة هيل", nameEn:"Cardamom basbousa", descriptionAr:"بسبوسة سميد مع قطر خفيف وهيل.", descriptionEn:"Semolina cake with light syrup and cardamom.", price:12, currency:"SAR", imageUrl:"https://as2.ftcdn.net/v2/jpg/14/39/08/75/1000_F_1439087549_MuI1LKsZpOp34hJVXWkm5hHoWARz2wqE.jpg", calories:310, sodiumMg:null, caffeineMg:null, caffeineBasis:null, isAvailable:true, isFeatured:true, allergens:"غلوتين,حليب", tags:[], dietaryLabels:[] },
  ],
  productOptions: {
    "demo-p-v60": {
      variants: [
        { id:"demo-v60-small",tenantId:DEMO_TENANT_ID,productId:"demo-p-v60",nameAr:"صغير",nameEn:"Small",price:22,sortOrder:1,isAvailable:true },
        { id:"demo-v60-large",tenantId:DEMO_TENANT_ID,productId:"demo-p-v60",nameAr:"كبير",nameEn:"Large",price:26,sortOrder:2,isAvailable:true },
      ],
      groups: [
        { id:"demo-v60-brew",tenantId:DEMO_TENANT_ID,nameAr:"طريقة التقديم",nameEn:"Serving",minSelect:1,maxSelect:1,sortOrder:1,isRequired:true,isActive:true },
        { id:"demo-v60-extra",tenantId:DEMO_TENANT_ID,nameAr:"إضافات",nameEn:"Extras",minSelect:0,maxSelect:2,sortOrder:2,isRequired:false,isActive:true },
      ],
      options: [
        { id:"demo-v60-hot",tenantId:DEMO_TENANT_ID,groupId:"demo-v60-brew",nameAr:"ساخن",nameEn:"Hot",priceDelta:0,sortOrder:1,isAvailable:true },
        { id:"demo-v60-iced",tenantId:DEMO_TENANT_ID,groupId:"demo-v60-brew",nameAr:"مثلج",nameEn:"Iced",priceDelta:2,sortOrder:2,isAvailable:true },
        { id:"demo-v60-shot",tenantId:DEMO_TENANT_ID,groupId:"demo-v60-extra",nameAr:"شوت إضافي",nameEn:"Extra shot",priceDelta:6,sortOrder:1,isAvailable:true },
        { id:"demo-v60-milk",tenantId:DEMO_TENANT_ID,groupId:"demo-v60-extra",nameAr:"حليب الشوفان",nameEn:"Oat milk",priceDelta:4,sortOrder:2,isAvailable:true },
      ],
    },
    "demo-p-flatwhite": {
      variants: [
        { id:"demo-flatwhite-regular",tenantId:DEMO_TENANT_ID,productId:"demo-p-flatwhite",nameAr:"عادي",nameEn:"Regular",price:18,sortOrder:1,isAvailable:true },
        { id:"demo-flatwhite-large",tenantId:DEMO_TENANT_ID,productId:"demo-p-flatwhite",nameAr:"كبير",nameEn:"Large",price:22,sortOrder:2,isAvailable:true },
      ],
      groups: [
        { id:"demo-flatwhite-milk",tenantId:DEMO_TENANT_ID,nameAr:"نوع الحليب",nameEn:"Milk choice",minSelect:1,maxSelect:1,sortOrder:1,isRequired:true,isActive:true },
        { id:"demo-flatwhite-extra",tenantId:DEMO_TENANT_ID,nameAr:"إضافات",nameEn:"Extras",minSelect:0,maxSelect:2,sortOrder:2,isRequired:false,isActive:true },
      ],
      options: [
        { id:"demo-flatwhite-oat",tenantId:DEMO_TENANT_ID,groupId:"demo-flatwhite-milk",nameAr:"حليب الشوفان",nameEn:"Oat milk",priceDelta:4,sortOrder:1,isAvailable:true },
        { id:"demo-flatwhite-almond",tenantId:DEMO_TENANT_ID,groupId:"demo-flatwhite-milk",nameAr:"حليب اللوز",nameEn:"Almond milk",priceDelta:4,sortOrder:2,isAvailable:true },
        { id:"demo-flatwhite-shot",tenantId:DEMO_TENANT_ID,groupId:"demo-flatwhite-extra",nameAr:"شوت إضافي",nameEn:"Extra shot",priceDelta:6,sortOrder:1,isAvailable:true },
        { id:"demo-flatwhite-honey",tenantId:DEMO_TENANT_ID,groupId:"demo-flatwhite-extra",nameAr:"عسل",nameEn:"Honey",priceDelta:2,sortOrder:2,isAvailable:true },
      ],
    },
    "demo-p-croissant": {
      variants: [
        { id:"demo-croissant-single",tenantId:DEMO_TENANT_ID,productId:"demo-p-croissant",nameAr:"حبة",nameEn:"Single",price:14,sortOrder:1,isAvailable:true },
        { id:"demo-croissant-box",tenantId:DEMO_TENANT_ID,productId:"demo-p-croissant",nameAr:"علبة 4 حبات",nameEn:"Box of 4",price:50,sortOrder:2,isAvailable:true },
      ],
      groups: [
        { id:"demo-croissant-serve",tenantId:DEMO_TENANT_ID,nameAr:"التقديم",nameEn:"Serving",minSelect:1,maxSelect:1,sortOrder:1,isRequired:true,isActive:true },
        { id:"demo-croissant-extra",tenantId:DEMO_TENANT_ID,nameAr:"إضافات",nameEn:"Extras",minSelect:0,maxSelect:2,sortOrder:2,isRequired:false,isActive:true },
      ],
      options: [
        { id:"demo-croissant-warm",tenantId:DEMO_TENANT_ID,groupId:"demo-croissant-serve",nameAr:"دافئ",nameEn:"Warm",priceDelta:0,sortOrder:1,isAvailable:true },
        { id:"demo-croissant-room",tenantId:DEMO_TENANT_ID,groupId:"demo-croissant-serve",nameAr:"درجة الغرفة",nameEn:"Room temperature",priceDelta:0,sortOrder:2,isAvailable:true },
        { id:"demo-croissant-honey",tenantId:DEMO_TENANT_ID,groupId:"demo-croissant-extra",nameAr:"عسل",nameEn:"Honey",priceDelta:2,sortOrder:1,isAvailable:true },
        { id:"demo-croissant-cream",tenantId:DEMO_TENANT_ID,groupId:"demo-croissant-extra",nameAr:"كريمة فانيلا",nameEn:"Vanilla cream",priceDelta:3,sortOrder:2,isAvailable:true },
      ],
    },
    "demo-p-shakshuka": {
      variants: [{ id:"demo-shakshuka-single",tenantId:DEMO_TENANT_ID,productId:"demo-p-shakshuka",nameAr:"طبق",nameEn:"Plate",price:32,sortOrder:1,isAvailable:true }],
      groups: [
        { id:"demo-shakshuka-egg",tenantId:DEMO_TENANT_ID,nameAr:"البيض",nameEn:"Egg style",minSelect:1,maxSelect:1,sortOrder:1,isRequired:true,isActive:true },
        { id:"demo-shakshuka-extra",tenantId:DEMO_TENANT_ID,nameAr:"إضافات",nameEn:"Extras",minSelect:0,maxSelect:2,sortOrder:2,isRequired:false,isActive:true },
      ],
      options: [
        { id:"demo-shakshuka-fried",tenantId:DEMO_TENANT_ID,groupId:"demo-shakshuka-egg",nameAr:"بيض عيون",nameEn:"Fried eggs",priceDelta:0,sortOrder:1,isAvailable:true },
        { id:"demo-shakshuka-scrambled",tenantId:DEMO_TENANT_ID,groupId:"demo-shakshuka-egg",nameAr:"بيض مخفوق",nameEn:"Scrambled eggs",priceDelta:0,sortOrder:2,isAvailable:true },
        { id:"demo-shakshuka-cheese",tenantId:DEMO_TENANT_ID,groupId:"demo-shakshuka-extra",nameAr:"جبن حلومي",nameEn:"Halloumi",priceDelta:6,sortOrder:1,isAvailable:true },
        { id:"demo-shakshuka-bread",tenantId:DEMO_TENANT_ID,groupId:"demo-shakshuka-extra",nameAr:"خبز إضافي",nameEn:"Extra bread",priceDelta:3,sortOrder:2,isAvailable:true },
      ],
    },
  },
  productOffers: {
    "demo-p-v60": { id:"caebfbfa-fca2-444c-8f69-82904f614d1a",tenantId:DEMO_TENANT_ID,productId:"demo-p-v60",offerType:"percentage",value:50,labelAr:"خصم للنصف",labelEn:"50% off",startsAt:"2026-09-30T03:55:00Z",endsAt:"2026-12-30T03:55:00Z",isActive:true },
  },
};