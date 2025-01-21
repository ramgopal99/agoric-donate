import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiNextjsLine, RiTailwindCssFill } from "react-icons/ri";
import { FaReact } from "react-icons/fa";
import { siteConfig } from "@/config/site";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { BiLogoTypescript } from "react-icons/bi";
import { SiPrisma, SiStripe } from "react-icons/si";

const techStack = [
  {
    name: "Next.js 14",
    description: "React Framework",
    icon: <RiNextjsLine />,
  },
  {
    name: "React",
    description: "UI Library",
    icon: <FaReact />,
  },
  {
    name: "TypeScript",
    description: "Type Safety",
    icon: <BiLogoTypescript />,
  },
  {
    name: "Tailwind CSS",
    description: "Styling Framework",
    icon: <RiTailwindCssFill />,
  },
  {
    name: "Prisma",
    description: "Database ORM",
    icon: <SiPrisma />,
  },
  {
    name: "Stripe",
    description: "Payment Processing",
    icon: <SiStripe />,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for side projects",
    price: 9,
    priceId: "price_starter_id",
    features: [
      "Up to 5 projects",
      "Basic analytics",
      "24/7 support",
      "API access",
    ],
  },
  {
    name: "Pro",
    description: "For growing businesses",
    price: 29,
    priceId: "price_pro_id",
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "API access",
      "Custom domain",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large teams",
    price: 99,
    priceId: "price_enterprise_id",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated support",
      "SLA",
      "Advanced security",
    ],
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 mx-0 max-w-none overflow-hidden">
          <div className="absolute left-1/2 top-0 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#36b49f] to-[#DBFF75] opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-[#36b49f]/30 dark:to-[#DBFF75]/30 dark:opacity-100">
              <svg
                aria-hidden="true"
                className="absolute inset-x-0 inset-y-[-50%] h-[200%] w-full skew-y-[-18deg] fill-black/40 stroke-black/50 mix-blend-overlay dark:fill-white/2.5 dark:stroke-white/5"
              >
                <defs>
                  <pattern
                    id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                    width="72"
                    height="56"
                    patternUnits="userSpaceOnUse"
                    x="-12"
                    y="4"
                  >
                    <path d="M.5 56V.5H72" fill="none" />
                  </pattern>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  strokeWidth="0"
                  fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="container mx-auto px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-6 animate-fade-in">
              <span className="font-semibold">New Release</span> - v1.0.0 is
              here
            </Badge>
            <h1 className="mb-10 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-6xl font-bold tracking-tight text-transparent dark:from-gray-100 dark:to-gray-800 sm:text-7xl">
              Launch your SaaS faster than ever
            </h1>
            <p className="mb-10 text-xl text-muted-foreground">
              {siteConfig.description} Built with Next.js 14, React, Prisma, and
              Stripe.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/login">
                <RainbowButton>
                  Let's Start Building 🚀
                  {/* <ArrowRight className="ml-2 h-4 w-4" /> */}
                </RainbowButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
