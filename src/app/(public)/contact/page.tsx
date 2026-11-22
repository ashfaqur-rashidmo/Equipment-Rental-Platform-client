import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock, Send, HelpCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Have questions about renting or listing equipment? Get in touch with the EquipRent support team.",
};

const businessHours = [
  { day: "Monday - Friday", hours: "9:00 AM – 6:00 PM" },
  { day: "Saturday", hours: "10:00 AM – 4:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

const faqs = [
  {
    question: "How do I rent equipment?",
    answer:
      "Browse the equipment listings, select the item and dates you need, then book and pay online through Stripe. The owner will confirm your rental and arrange pickup or delivery.",
  },
  {
    question: "How do I list my equipment?",
    answer:
      "Register as an Owner, go to your dashboard and click “Add Equipment”. Fill in the details, upload photos and set your price. Your listing will be live after review.",
  },
  {
    question: "Is payment secure?",
    answer:
      "Yes. All payments are processed securely through Stripe. Funds are held safely and released to the owner after the rental period is completed.",
  },
  {
    question: "Can I cancel a booking?",
    answer:
      "Yes. You can cancel a booking from your dashboard before the owner accepts it. After acceptance, please contact the owner directly or reach out to our support team.",
  },
  {
    question: "What if equipment is damaged?",
    answer:
      "Report any issues through your rental dashboard immediately. Our support team will mediate between you and the owner to resolve the matter fairly.",
  },
];

async function submitContact(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    return;
  }

  // Simulate API call. Replace with your actual contact endpoint.
  await new Promise((resolve) => setTimeout(resolve, 1200));
}

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-base-content sm:text-5xl mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          Questions about renting, listing equipment or your bookings? Reach us
          any time and we will respond as soon as possible.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact form */}
        <div className="space-y-6">
          <form action={submitContact} className="space-y-4">
            <div className="card bg-base-100 border border-base-300 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-base-content mb-6">
                Send us a message
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email address</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Subject</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Booking question"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Message</span>
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us how we can help..."
                  className="textarea textarea-bordered w-full"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full"
              >
                <Send className="h-4 w-4 mr-2" aria-hidden /> Send message
              </button>
            </div>
          </form>

          {/* Business hours */}
          <div className="card bg-base-100 border border-base-300 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" aria-hidden />
              Business hours
            </h2>
            <div className="space-y-3">
              {businessHours.map((hour) => (
                <div
                  key={hour.day}
                  className="flex justify-between text-sm"
                >
                  <span className="text-base-content/70">{hour.day}</span>
                  <span className="font-medium text-base-content">
                    {hour.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-6">
          {[{
            icon: MapPin,
            label: "Address",
            value: siteConfig.contact.address,
          }, {
            icon: Phone,
            label: "Phone",
            value: siteConfig.contact.phone,
          }, {
            icon: Mail,
            label: "Email",
            value: siteConfig.contact.email,
          }].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="card bg-base-100 border border-base-300 p-6 shadow-sm flex gap-4 items-start"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h3 className="text-base font-bold text-base-content">
                  {label}
                </h3>
                <p className="text-sm text-base-content/70 break-words">
                  {value}
                </p>
              </div>
            </div>
          ))}

          {/* FAQ */}
          <div className="card bg-base-100 border border-base-300 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-base-content mb-6 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" aria-hidden />
              Frequently asked questions
            </h2>
            <div className="accordion accordion-flush w-full">
              {faqs.map((faq) => (
                <div key={faq.question} className="accordion-item border-base-300">
                  <button className="accordion-button text-base-content font-medium">
                    {faq.question}
                  </button>
                  <div className="accordion-content">
                    <p className="text-sm text-base-content/70 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
