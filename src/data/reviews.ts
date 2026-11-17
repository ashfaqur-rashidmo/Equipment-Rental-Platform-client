export interface Review {
  name: string;
  role: string;
  rating: number;
  comment: string;
}

/** Static reviews shown on the home page until reviews come from the API. */
export const reviews: Review[] = [
  {
    name: "Rafiq Ahmed",
    role: "Construction contractor · Dhaka",
    rating: 5,
    comment:
      "I rented a rebar cutter and generator set for a three-week project. The owner delivered to the site on time and the condition was exactly as listed. EquipRent removed the middleman completely for me.",
  },
  {
    name: "Nusrat Jahan",
    role: "Wedding photographer · Chattogram",
    rating: 5,
    comment:
      "Buying a second full-frame body made no sense for my shooting volume. I booked the Sony kit for four days, paid through Stripe, and everything was ready when I arrived. Flawless experience.",
  },
  {
    name: "Tanvir Hasan",
    role: "Event organizer · Sylhet",
    rating: 4,
    comment:
      "The DJ setup and lighting package made our campus festival. Booking took minutes and the support crew helped with setup. Would like more availability during peak season, but great overall.",
  },
  {
    name: "Mizanur Rahman",
    role: "Agri-entrepreneur · Bogura",
    rating: 5,
    comment:
      "During harvest I need extra tractor hours, not extra debt. Renting by the day with a verified operator is transparent and fair — and the terms are written clearly before I pay anything.",
  },
];
