export type RentalType = "daily" | "weekly" | "monthly";

export type EquipmentStatus = "pending" | "approved" | "rejected";

export type EquipmentCondition = "excellent" | "good" | "fair";

export interface EquipmentOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  category: string;
  rentalPrice: number;
  rentalType: RentalType;
  location: string;
  availableQuantity: number;
  condition: EquipmentCondition;
  brand: string;
  model: string;
  image: string;
  terms: string;
  rating: number;
  createdAt: string;
  status: EquipmentStatus;
  owner: EquipmentOwner;
}



export interface EquipmentItem {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  category: string;
  status: string;
  /** "Daily" | "Weekly" | "Monthly" as stored by the API. */
  rentalType?: string;
  rentalPrice: string | number;
  availableQuantity: number;
  location: string;
  brand?: string;
  model?: string;
  condition?: string;
  terms?: string;
  ownerName?: string;
  ownerEmail?: string;
  createdAt?: string;
  image?: string;
  ownerId?: string;
}

/**
 * Seed data used until the Express + MongoDB backend is connected.
 * The shape mirrors the server's equipment collection so the swap is
 * a fetch call away. Images are stored locally in /public/images.
 */
export const equipmentList: Equipment[] = [
  {
    id: "eq-001",
    name: "Electric Rebar Cutter & Site Power Tools",
    description:
      "Heavy-duty electric rebar cutter with a full site power tool set. Ideal for mid-size construction projects that need clean cuts through 4–16mm rebar. Includes two 5kW generators on request.",
    category: "Construction Equipment",
    rentalPrice: 1500,
    rentalType: "daily",
    location: "Dhaka",
    availableQuantity: 4,
    condition: "excellent",
    brand: "Hilti",
    model: "WSC 255",
    image: "/images/equipment/rebar-tools.jpg",
    terms:
      "Security deposit required. Fuel and on-site operator billed separately. Maximum rental period 30 days.",
    rating: 4.8,
    createdAt: "2026-11-10",
    status: "approved",
    owner: {
      id: "ow-001",
      name: "Rahim Construction Supplies",
      email: "rahim@equiprent.test",
      phone: "+880 1712-345678",
    },
  },
  {
    id: "eq-002",
    name: "Sony α7 III Mirrorless Camera + Lens Kit",
    description:
      "Full-frame mirrorless camera with a 24-70mm f/2.8 and a 50mm prime. Perfect for weddings, product shoots and documentary work. Comes with three batteries, a dual charger and a 64GB card.",
    category: "Photography Equipment",
    rentalPrice: 3200,
    rentalType: "daily",
    location: "Dhaka",
    availableQuantity: 2,
    condition: "excellent",
    brand: "Sony",
    model: "ILCE-7M3",
    image: "/images/equipment/camera-kit.jpg",
    terms:
      "ID copy required. Damage waiver optional at 5% of the rental. Lenses must be returned capped and cleaned.",
    rating: 4.9,
    createdAt: "2026-11-08",
    status: "approved",
    owner: {
      id: "ow-002",
      name: "LensHouse BD",
      email: "lenshouse@equiprent.test",
      phone: "+880 1888-112233",
    },
  },
  {
    id: "eq-003",
    name: "Ford Expedition SUV (7 Seats)",
    description:
      "Full-size 7-seater SUV with chauffeur option for out-of-town trips, film crews and corporate travel. Valid paperwork, insured, and maintained every 5,000 km.",
    category: "Vehicles & Transportation",
    rentalPrice: 4500,
    rentalType: "daily",
    location: "Dhaka",
    availableQuantity: 1,
    condition: "good",
    brand: "Ford",
    model: "Expedition XLT",
    image: "/images/equipment/suv.jpg",
    terms:
      "Driver provided for out-of-district trips. Fuel not included. Overnight parking at customer's cost.",
    rating: 4.6,
    createdAt: "2026-11-06",
    status: "approved",
    owner: {
      id: "ow-003",
      name: "Roadline Rentals",
      email: "roadline@equiprent.test",
      phone: "+880 1934-556677",
    },
  },
  {
    id: "eq-004",
    name: "Field-Marshall Farm Tractor",
    description:
      "Reliable 2WD farm tractor for ploughing, tilling and hauling across large plots. Experienced operator available. Attachments: cultivator, trailer and water pump.",
    category: "Agriculture Equipment",
    rentalPrice: 2600,
    rentalType: "daily",
    location: "Bogura",
    availableQuantity: 3,
    condition: "good",
    brand: "Field-Marshall",
    model: "Series 3A",
    image: "/images/equipment/tractor.jpg",
    terms:
      "Operator included. Diesel billed by usage. Booking at least 3 days ahead during harvest season.",
    rating: 4.7,
    createdAt: "2026-11-04",
    status: "approved",
    owner: {
      id: "ow-004",
      name: "Krishi machinery Ghor",
      email: "krishi@equiprent.test",
      phone: "+880 1555-778899",
    },
  },
  {
    id: "eq-005",
    name: "Pioneer DJ Controller & Mixer Setup",
    description:
      "Club-standard DJ controller with a 4-channel mixer, powered speakers and wired mics. Handles weddings, corporate parties and campus events up to 500 guests.",
    category: "Event Equipment",
    rentalPrice: 2800,
    rentalType: "daily",
    location: "Chattogram",
    availableQuantity: 2,
    condition: "excellent",
    brand: "Pioneer",
    model: "DDJ-1000",
    image: "/images/equipment/dj-controller.jpg",
    terms:
      "Setup and pickup included inside city limits. Power backup (IPS/generator) is the renter's responsibility.",
    rating: 4.8,
    createdAt: "2026-11-02",
    status: "approved",
    owner: {
      id: "ow-005",
      name: "BeatStreet Events",
      email: "beatstreet@equiprent.test",
      phone: "+880 1677-334455",
    },
  },
  {
    id: "eq-006",
    name: "Laptop & Gadget Workstation Bundle",
    description:
      "Five MacBook-class laptops with a USB-C hub, projector and portable router — a ready-made mobile workstation for training sessions, bootcamps and hackathons.",
    category: "Electronics",
    rentalPrice: 5500,
    rentalType: "daily",
    location: "Khulna",
    availableQuantity: 2,
    condition: "good",
    brand: "Apple",
    model: "MacBook Pro 14\"",
    image: "/images/equipment/gadgets.jpg",
    terms:
      "Corporate NDA available. Devices must be returned with original chargers. Late return fee 10% per day.",
    rating: 4.5,
    createdAt: "2026-10-30",
    status: "approved",
    owner: {
      id: "ow-006",
      name: "TechDock Rentals",
      email: "techdock@equiprent.test",
      phone: "+880 1466-990011",
    },
  },
  {
    id: "eq-007",
    name: "Canon EOS DSLR Camera (Beginner Kit)",
    description:
      "A forgiving 50mm prime setup for students and first-time creators. Lightweight, with auto modes and a guided menu. Includes a tripod and a camera bag.",
    category: "Photography Equipment",
    rentalPrice: 1100,
    rentalType: "daily",
    location: "Sylhet",
    availableQuantity: 5,
    condition: "good",
    brand: "Canon",
    model: "EOS Rebel T3i",
    image: "/images/equipment/dslr.jpg",
    terms: "Student ID discount available. SD card included, returned formatted.",
    rating: 4.4,
    createdAt: "2026-10-28",
    status: "approved",
    owner: {
      id: "ow-002",
      name: "LensHouse BD",
      email: "lenshouse@equiprent.test",
      phone: "+880 1888-112233",
    },
  },
  {
    id: "eq-008",
    name: "Luxury Tour Bus (50 Seats)",
    description:
      "Air-conditioned double-decker coach for tours, picnics and conference shuttles. Experienced long-route driver team, with sound system on board.",
    category: "Vehicles & Transportation",
    rentalPrice: 18000,
    rentalType: "daily",
    location: "Dhaka",
    availableQuantity: 1,
    condition: "good",
    brand: "Marcopolo",
    model: "Paradiso 1800 DD",
    image: "/images/equipment/bus.jpg",
    terms:
      "Route permit takes 48 hours — book early. Tolls, ferry and driver accommodation billed to renter.",
    rating: 4.7,
    createdAt: "2026-10-25",
    status: "approved",
    owner: {
      id: "ow-003",
      name: "Roadline Rentals",
      email: "roadline@equiprent.test",
      phone: "+880 1934-556677",
    },
  },
  {
    id: "eq-009",
    name: "Concert Special-Effects & Confetti Package",
    description:
      "Confetti cannons, CO2 jets and stage-safe spark machines for concerts, rallies and award nights. Crew handled setup and cleanup at approved venues.",
    category: "Event Equipment",
    rentalPrice: 9000,
    rentalType: "daily",
    location: "Dhaka",
    availableQuantity: 1,
    condition: "excellent",
    brand: "MagicFX",
    model: "ConfettiMaster Pro",
    image: "/images/equipment/confetti.jpg",
    terms:
      "Venue fire-safety clearance required. Operator crew included. Consumables billed by usage.",
    rating: 4.9,
    createdAt: "2026-10-22",
    status: "approved",
    owner: {
      id: "ow-005",
      name: "BeatStreet Events",
      email: "beatstreet@equiprent.test",
      phone: "+880 1677-334455",
    },
  },
  {
    id: "eq-010",
    name: "Engineer's Site Toolbox & Blueprint Kit",
    description:
      "Complete site-engineer kit: Stanley toolbox, precision calipers, drawing set and cutting mat. Handy for freelance site supervisors and workshop classes.",
    category: "Construction Equipment",
    rentalPrice: 800,
    rentalType: "weekly",
    location: "Rajshahi",
    availableQuantity: 6,
    condition: "good",
    brand: "Stanley",
    model: "STA194046",
    image: "/images/equipment/toolbox.jpg",
    terms: "Tool inventory checked at return. Missing pieces billed at retail price.",
    rating: 4.3,
    createdAt: "2026-10-20",
    status: "approved",
    owner: {
      id: "ow-001",
      name: "Rahim Construction Supplies",
      email: "rahim@equiprent.test",
      phone: "+880 1712-345678",
    },
  },
];

export const formatPrice = (price: number) =>
  `৳${price.toLocaleString("en-US")}`;
