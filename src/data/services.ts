import type { Service } from "@/types";
import { moreServices } from "./more-services";

const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`;

const baseServices: Service[] = [
  {
    slug: "logo-design",
    name: "Logo Design",
    category: "digital",
    description:
      "A custom logo crafted around your brand personality, delivered in every format you need.",
    basePrice: 120,
    discountPercent: 15,
    images: [img("logo-1"), img("logo-2"), img("logo-3")],
    included: [
      "3 initial concepts",
      "2 revision rounds",
      "Vector source files",
      "Brand colour palette",
    ],
    turnaround: "3-5 days",
    turnaroundDays: 5,
    popularity: 95,
    useCase: "business",
    industry: "general",
    optionGroups: [
      {
        id: "package",
        label: "Package",
        options: [
          { id: "basic", label: "Basic", priceModifier: 0 },
          { id: "standard", label: "Standard", priceModifier: 60 },
          { id: "premium", label: "Premium", priceModifier: 150 },
        ],
      },
    ],
    relatedSlugs: ["business-cards", "brand-identity-kit", "branded-mugs"],
  },
  {
    slug: "business-cards",
    name: "Business Cards",
    category: "prints",
    description: "Premium printed business cards on your choice of stock.",
    basePrice: 25,
    images: [img("cards-1"), img("cards-2")],
    included: [
      "Double-sided print",
      "Matte or gloss finish",
      "Free design proof",
    ],
    turnaround: "2-3 days",
    turnaroundDays: 3,
    popularity: 88,
    useCase: "business",
    industry: "general",
    optionGroups: [
      {
        id: "quantity",
        label: "Quantity tier",
        options: [
          { id: "100", label: "100 cards", priceModifier: 0 },
          { id: "250", label: "250 cards", priceModifier: 15 },
          { id: "500", label: "500 cards", priceModifier: 30 },
        ],
      },
    ],
    relatedSlugs: ["logo-design", "branded-mugs", "brand-identity-kit"],
  },
  {
    slug: "branded-mugs",
    name: "Branded Mugs",
    category: "gifts",
    description:
      "Ceramic mugs printed with your logo, ideal for staff and client gifts.",
    basePrice: 12,
    discountPercent: 10,
    images: [img("mug-1"), img("mug-2")],
    included: [
      "Full-colour print",
      "Dishwasher-safe finish",
      "Gift box option",
    ],
    turnaround: "5-7 days",
    turnaroundDays: 7,
    popularity: 80,
    useCase: "gifting",
    industry: "general",
    optionGroups: [
      {
        id: "material",
        label: "Material",
        options: [
          { id: "ceramic", label: "Ceramic", priceModifier: 0 },
          { id: "enamel", label: "Enamel", priceModifier: 4 },
        ],
      },
    ],
    relatedSlugs: ["branded-tote-bags", "logo-design", "business-cards"],
  },
  {
    slug: "event-backdrops",
    name: "Event Backdrops",
    category: "studio",
    description:
      "Large-format backdrops for launches, weddings and corporate events.",
    basePrice: 90,
    images: [img("backdrop-1"), img("backdrop-2")],
    included: ["Custom design", "High-resolution print", "Carry bag"],
    turnaround: "4-6 days",
    turnaroundDays: 6,
    popularity: 70,
    useCase: "events",
    industry: "general",
    optionGroups: [
      {
        id: "size",
        label: "Size",
        options: [
          { id: "6x8", label: "6 x 8 ft", priceModifier: 0 },
          { id: "8x10", label: "8 x 10 ft", priceModifier: 40 },
        ],
      },
    ],
    relatedSlugs: ["social-media-kit", "logo-design", "branded-tote-bags"],
  },
  {
    slug: "brand-identity-kit",
    name: "Brand Identity Kit",
    category: "create",
    description:
      "A complete visual identity: logo, colours, typography and usage guide.",
    basePrice: 300,
    discountPercent: 20,
    images: [img("identity-1"), img("identity-2")],
    included: ["Logo suite", "Colour and type system", "Brand guidelines PDF"],
    turnaround: "7-10 days",
    turnaroundDays: 10,
    popularity: 85,
    useCase: "business",
    industry: "tech",
    optionGroups: [],
    relatedSlugs: ["logo-design", "business-cards", "social-media-kit"],
  },
  {
    slug: "branded-tote-bags",
    name: "Branded Tote Bags",
    category: "gifts",
    description: "Durable cotton tote bags printed with your brand.",
    basePrice: 9,
    images: [img("tote-1"), img("tote-2")],
    included: ["1-colour print", "Reinforced handles"],
    turnaround: "5-7 days",
    turnaroundDays: 7,
    popularity: 65,
    useCase: "events",
    industry: "retail",
    optionGroups: [
      {
        id: "quantity",
        label: "Quantity tier",
        options: [
          { id: "25", label: "25 bags", priceModifier: 0 },
          { id: "50", label: "50 bags", priceModifier: 80 },
        ],
      },
    ],
    relatedSlugs: ["branded-mugs", "event-backdrops", "logo-design"],
  },
];

export const services: Service[] = [...baseServices, ...moreServices];
