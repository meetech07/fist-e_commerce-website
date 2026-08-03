export const SITE = {
  name: "Paras Enterprises",
  legalName: "Paras Enterprises",
  tagline: "False Ceiling & PVC Material Supplier",
  description:
    "Paras Enterprises — trusted supplier of false ceiling materials, PVC ceiling panels, WPC wall panels, gypsum boards, ceiling channels, louvers and interior decorative hardware. B2B & B2C, serving Dehri, Rohtas (Bihar) and pan-India.",
  url: "https://parasenterprises.in",
  phone: "+91 88639 82250",
  phoneRaw: "+918863982250",
  whatsapp: "918863982250",
  email: "sales@parasenterprises.in",
  address: {
    line1: "Gali No. 3, Behind Rohtas Petrol Pump",
    line2: "New Dillian, Dehri, Rohtas",
    city: "Dehri",
    state: "Bihar",
    pincode: "821307",
    country: "India",
  },
  mapEmbed:
    "https://www.google.com/maps?q=New+Dillian,+Dehri,+Rohtas,+Bihar+821307,+India&output=embed",
  gstin: "10ABCDE1234F1Z5",
  hours: "Mon – Sun, 09:00 AM – 05:00 PM",
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
    twitter: "https://x.com",
    pinterest: "https://pinterest.com",
  },
} as const;

export const WHATSAPP_MESSAGE = "Hello Paras Enterprises! I want to enquire about your ceiling & interior products.";

export const categoriesData: Array<{
  slug: string;
  name: string;
  description: string;
  icon: string;
  image: string;
}> = [
  {
    slug: "pvc-ceiling-panels",
    name: "PVC Ceiling Panels",
    description: "Moisture-proof, termite-proof ceiling planks",
    icon: "PanelTop",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
  },
  {
    slug: "false-ceiling",
    name: "False Ceiling",
    description: "Designer gypsum & POP false ceiling solutions",
    icon: "Layers",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
  },
  {
    slug: "gypsum-boards",
    name: "Gypsum Boards",
    description: "Fire-rated & moisture-resistant boards",
    icon: "Square",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789",
  },
  {
    slug: "ceiling-channels",
    name: "Ceiling Channels",
    description: "GI channels, sections & suspension systems",
    icon: "Trello",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
  },
  {
    slug: "wpc-wall-panels",
    name: "WPC Wall Panels",
    description: "Wood-polymer cladding, waterproof & durable",
    icon: "LayoutPanelLeft",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
  },
  {
    slug: "3d-wall-panels",
    name: "3D Wall Panels",
    description: "Textured panels that add depth & drama",
    icon: "Boxes",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
  },
  {
    slug: "pvc-louvers",
    name: "PVC Louvers",
    description: "Modern louvered screens & partitions",
    icon: "AlignVerticalSpaceAround",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  },
  {
    slug: "wall-mouldings",
    name: "Wall Mouldings",
    description: "Decorative cornices, coving & false beams",
    icon: "Frame",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f",
  },
  {
    slug: "decorative-panels",
    name: "Decorative Panels",
    description: "WPC, acrylic & metal laminates",
    icon: "PanelsTopLeft",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "Trims, edgings, brackets & fittings",
    icon: "Puzzle",
    image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc",
  },
  {
    slug: "hardware",
    name: "Hardware",
    description: "Screws, anchors, hangers & tools",
    icon: "Wrench",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c",
  },
  {
    slug: "adhesives",
    name: "Adhesives",
    description: "Gum, sealants & bonding compounds",
    icon: "Droplets",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f",
  },
  {
    slug: "interior-materials",
    name: "Interior Materials",
    description: "Complete range of decorative interiors",
    icon: "Gem",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37",
  },
];

export const brandsData = [
  "Saini",
  "Color Plus",
  "Gravia",
  "Gipla",
  "Armstrong",
  "Everest",
  "Saint-Gobain",
  "CenturyPly",
  "Greenply",
  "Vecta",
  "Kirei",
  "Alstone",
  "Giaco",
  "Laybond",
  "Asian",
  "Merryplast",
];

export const TESTIMONIALS = [
  {
    name: "Rajesh Khanna",
    role: "Interior Designer",
    company: "Studio RK Interiors",
    content:
      "Paras Enterprises has been our go-to supplier for false ceiling & WPC panels for 6 years. Unmatched quality, honest pricing and same-week delivery every single time.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Homeowner",
    company: "Wadala, Mumbai",
    content:
      "Got my entire living room done with their designer PVC ceilings. The material finish is premium and their installation team was spotless. Highly recommended!",
    rating: 5,
  },
  {
    name: "Amit Verma",
    role: "Contractor",
    company: "Verma Constructions",
    content:
      "Bulk gypsum, channels and accessories at trade prices with proper GST invoices. Their B2B portal makes reordering effortless. A true business partner.",
    rating: 5,
  },
  {
    name: "Neha Gupta",
    role: "Architect",
    company: "NG Designs",
    content:
      "The 3D wall panel range is stunning and priced far better than market. My clients love the finished spaces. Excellent technical support from the team.",
    rating: 5,
  },
  {
    name: "Suresh Nair",
    role: "Shop Owner",
    company: "Nair Trading Co.",
    content:
      "We resell their PVC louvers and mouldings in our hardware store. Consistent quality and fast restock. Payments and billing are fully transparent.",
    rating: 4,
  },
];

export const FAQS = [
  {
    question: "Do you supply products pan-India?",
    answer:
      "Yes. We deliver across India through our logistics partners. Bulk B2B orders are dispatched within 24–48 hours from our Nagpur warehouse.",
  },
  {
    question: "What is the minimum order quantity?",
    answer:
      "There is no MOQ for retail customers. For trade/B2B pricing on bulk orders, contact us or request a quotation and our team will respond within a few hours.",
  },
  {
    question: "Do you provide installation services?",
    answer:
      "Yes. We offer professional installation for false ceilings, PVC/WPC panels and decorative interiors in and around Nagpur. Site visits are free.",
  },
  {
    question: "Can I get a sample before ordering?",
    answer:
      "Absolutely. Physical samples are available at our showroom, or you can request a sample kit by courier for a nominal charge which is adjusted against your order.",
  },
  {
    question: "Do you provide GST invoices?",
    answer:
      "Every order — retail or bulk — ships with a GST-compliant tax invoice. GST invoices are generated automatically for all orders.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Cash on Delivery, UPI, all major cards, net banking and Razorpay-powered online payments. Corporate customers can also pay via NEFT/RTGS.",
  },
];

export const GALLERY = [
  {
    title: "Designer Living Room Ceiling",
    category: "False Ceiling",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
  },
  {
    title: "PVC Panel Modular Kitchen",
    category: "PVC Panels",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
  },
  {
    title: "WPC Accent Wall",
    category: "WPC Wall Panels",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
  },
  {
    title: "Luxury Hotel Lobby Ceiling",
    category: "False Ceiling",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
  },
  {
    title: "3D Panel Feature Wall",
    category: "3D Panels",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f",
  },
  {
    title: "Office Partition & Louvers",
    category: "Louvers",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Blog", href: "/blog" },
  { label: "Installation", href: "/installation" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
