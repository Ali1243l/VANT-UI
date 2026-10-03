import type { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'vant-01',
    title: 'Double-Breasted Structured Wool Blazer',
    title_ar: 'بليزر صوف مزدوج الأزرار بتفصيل هندسي',
    price: 165000,
    category: 'Tailoring',
    category_ar: 'الأزياء الرسمية',
    sizes: ['S', 'M', 'L', 'XL'],
    width: 800,
    height: 1067,
    availability: 'in_stock',
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Precision-tailored from Italian virgin wool with sharp drop shoulders and mother-of-pearl internal closures.',
    description_ar: 'مُصمم بحرفية استثنائية من الصوف الإيطالي البكر مع أكتاف منسدلة وأزرار داخلية من عرق اللؤلؤ الطبيعي.',
    tags: ['wool', 'blazer', 'tailoring', 'jacket', 'black', 'صوف', 'بليزر', 'جاكيت', 'رسمي', 'اسود']
  },
  {
    id: 'vant-02',
    title: 'Raw Edge Cashmere Overcoat in Camel',
    title_ar: 'معطف كشمير جملي بحواف حرة',
    price: 295000,
    category: 'Outerwear',
    category_ar: 'المعاطف والسترات',
    sizes: ['M', 'L'],
    width: 800,
    height: 1200,
    availability: 'limited',
    image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Substantial 650gsm unlined double-face Mongolian cashmere with hand-finished edges and concealed placket.',
    description_ar: 'كشمير منغولي مزدوج الوجه بوزن 650 جرام مع حواف مُحاكة يدوياً وتصميم انسيابي خفي.',
    tags: ['cashmere', 'coat', 'camel', 'winter', 'outerwear', 'كشمير', 'معطف', 'جملي', 'شتوي', 'سترة']
  },
  {
    id: 'vant-03',
    title: 'Architectural Heavy Rib Mock-Neck',
    title_ar: 'كنزة صوف مضلعة بياقة معمارية',
    price: 95000,
    category: 'Knitwear',
    category_ar: 'التريكو والصوف',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    width: 800,
    height: 960,
    availability: 'in_stock',
    image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Chunky 7-gauge carded merino wool with sculptural drop shoulder seams and reinforced ribbed cuff tension.',
    description_ar: 'صوف ميرينو سميك عيار 7 بحياكة هندسية وأكتاف مسترخية مع أساور متماسكة مقاومة للتمدد.',
    tags: ['merino', 'wool', 'knitwear', 'sweater', 'mockneck', 'ميرينو', 'صوف', 'تريكو', 'كنزة', 'بلوزة']
  },
  {
    id: 'vant-04',
    title: 'Minimal Calfskin Square-Toe Loafer',
    title_ar: 'حذاء لوفر جلد عجل بمقدمة مربعة',
    price: 145000,
    category: 'Footwear',
    category_ar: 'الأحذية',
    sizes: ['S', 'M', 'L', 'XL'],
    width: 800,
    height: 1000,
    availability: 'sold_out',
    image_url: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Hand-waxed vegetable-tanned French calfskin on stacked leather soles with bevelled waist detail.',
    description_ar: 'جلد عجل فرنسي مدبوغ بمواد نباتية ومُلمع يدوياً بنعل جلدي مكدس مع لمسات كلاسيكية مصقولة.',
    tags: ['leather', 'loafer', 'shoes', 'footwear', 'calfskin', 'جلد', 'لوفر', 'حذاء', 'احذية', 'كلاسيك']
  },
  {
    id: 'vant-05',
    title: 'Monolithic Structured Leather Tote',
    title_ar: 'حقيبة يد جلدية بتصميم نحتي',
    price: 210000,
    category: 'Accessories',
    category_ar: 'الإكسسوارات',
    sizes: ['M'],
    width: 800,
    height: 1100,
    availability: 'coming_soon',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Full-grain box calf leather with unlined suede interior, solid palladium-plated hardware, and dual handles.',
    description_ar: 'جلد عجل فاخر بحبوب كاملة مع بطانة داخلية من الشامواه السويدي وقطع معدنية مطلية بالبلاديوم النقي.',
    tags: ['leather', 'bag', 'tote', 'accessories', 'luxury', 'جلد', 'حقيبة', 'شنطة', 'اكسسوارات', 'توت']
  },
  {
    id: 'vant-06',
    title: 'Pleated Wide-Leg Tropical Wool Trouser',
    title_ar: 'بنطال صوف استوائي بقصّة عريضة وطيات',
    price: 110000,
    category: 'Tailoring',
    category_ar: 'الأزياء الرسمية',
    sizes: ['XS', 'S', 'M', 'L'],
    width: 800,
    height: 1150,
    availability: 'in_stock',
    image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'High-waisted silhouette with deep forward pleats, side adjusters, and an extended tab waistband closure.',
    description_ar: 'قصّة مرتفعة الخصر مع طيات أمامية عميقة وأحزمة جانبية قابلة للتعديل لمظهر عصري راقٍ.',
    tags: ['trouser', 'pants', 'wool', 'pleated', 'tailoring', 'بنطال', 'بنطلون', 'صوف', 'طيات', 'رسمي']
  },
  {
    id: 'vant-07',
    title: 'Brushed Alpaca Oversized Cardigan',
    title_ar: 'كارديجان ألبكا ممشوق بقصّة واسعة',
    price: 135000,
    category: 'Knitwear',
    category_ar: 'التريكو والصوف',
    sizes: ['S', 'M', 'L'],
    width: 800,
    height: 1050,
    availability: 'sold_out',
    image_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Hairy Peruvian baby alpaca blend knit in deep forest peat with custom horn buttons.',
    description_ar: 'مزيج فاخر من صوف بيبي ألبكا البيروفي الناعم مع أزرار طبيعية من القرون المصقولة.',
    tags: ['alpaca', 'cardigan', 'knitwear', 'warm', 'wool', 'ألبكا', 'كارديجان', 'تريكو', 'صوف', 'شتوي']
  },
  {
    id: 'vant-08',
    title: 'Water-Repellent Technical Trench',
    title_ar: 'معطف ترنش تقني مقاوم للماء',
    price: 240000,
    category: 'Outerwear',
    category_ar: 'المعاطف والسترات',
    sizes: ['M', 'L', 'XL'],
    width: 800,
    height: 1200,
    availability: 'limited',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Bonded Japanese high-density cotton membrane with magnetic storm flap and removable throat latch.',
    description_ar: 'نسيج قطني ياباني مدمج عالي الكثافة مع درع عاصفة مغناطيسي وياقة محكمة قابلة للفك.',
    tags: ['trench', 'coat', 'waterproof', 'rain', 'outerwear', 'ترنش', 'معطف', 'مقاوم للماء', 'مطر', 'سترة']
  },
  {
    id: 'vant-09',
    title: 'Sculpted Titanium & Horn Sunglasses',
    title_ar: 'نظارة شمسية من التيتانيوم المنحوت وقرن الجاموس',
    price: 95000,
    category: 'Accessories',
    category_ar: 'الإكسسوارات',
    sizes: ['M'],
    width: 800,
    height: 950,
    availability: 'in_stock',
    image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Japanese beta-titanium temples with natural ethically-sourced water buffalo horn browline and Zeiss optics.',
    description_ar: 'أذرع من بيتا-تيتانيوم ياباني فائق الخفة مع حافة من القرن الطبيعي وعدسات زايس بحماية قصوى.',
    tags: ['sunglasses', 'titanium', 'eyewear', 'accessories', 'نظارات', 'شمسية', 'تيتانيوم', 'اكسسوارات']
  },
  {
    id: 'vant-10',
    title: 'Deconstructed Silk & Linen Camp Shirt',
    title_ar: 'قميص حرير وكتان بتصميم كامب كولار',
    price: 85000,
    category: 'Tailoring',
    category_ar: 'الأزياء الرسمية',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    width: 800,
    height: 1080,
    availability: 'coming_soon',
    image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Breathable 60% mulberry silk and 40% organic French linen with relaxed Cuban collar and vented hem.',
    description_ar: 'نسيج خفيف من حرير التوت الطبيعي والكتان الفرنسي العضوي مع ياقة كوبية مسترخية.',
    tags: ['silk', 'linen', 'shirt', 'summer', 'tailoring', 'حرير', 'كتان', 'قميص', 'صيفي', 'رسمي']
  }
];
