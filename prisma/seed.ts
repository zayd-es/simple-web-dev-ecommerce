import "dotenv/config"
import { PrismaClient } from '../app/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import fs from "node:fs/promises"
import path from "node:path"

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
})
const db = new PrismaClient({ adapter })

const productsData = [
  {
    name: "SaaS Starter Kit Pro",
    priceInCents: 5900,
    description: "Launch your SaaS in days, not months. Includes Next.js 15, Stripe billing, Supabase Auth, role-based access control, and a polished dashboard — fully production-ready.",
    imagePath: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    filePath: "products/sample-file.zip",
    isAvailableForPurchase: true,
  },
  {
    name: "AI Dashboard UI Kit",
    priceInCents: 3900,
    description: "50+ modern AI-themed React components — chat interfaces, token usage meters, model selectors, and analytics panels. Built with Tailwind CSS and Shadcn UI.",
    imagePath: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=800&q=80",
    filePath: "products/sample-file.zip",
    isAvailableForPurchase: true,
  },
  {
    name: "Full Stack Auth Boilerplate",
    priceInCents: 2900,
    description: "Complete authentication system with JWT, refresh tokens, OAuth (Google & GitHub), email verification, and 2FA — ready to plug into any Node.js project.",
    imagePath: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80",
    filePath: "products/sample-file.zip",
    isAvailableForPurchase: true,
  },
  {
    name: "Landing Page UI Kit",
    priceInCents: 1900,
    description: "60+ conversion-optimized sections: hero banners, pricing tables, testimonials, FAQs, and CTAs. Pixel-perfect design, fully responsive and dark-mode ready.",
    imagePath: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80",
    filePath: "products/sample-file.zip",
    isAvailableForPurchase: true,
  },
  {
    name: "Node.js Microservices Template",
    priceInCents: 6900,
    description: "Production-grade microservices architecture with Docker, RabbitMQ message queues, API Gateway, centralized logging, and health monitoring out of the box.",
    imagePath: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    filePath: "products/sample-file.zip",
    isAvailableForPurchase: true,
  },
  {
    name: "Developer Portfolio Pro",
    priceInCents: 1500,
    description: "Stand out with a sleek, animated developer portfolio. Features Framer Motion transitions, MDX blog, project showcase, dark mode, and perfect Lighthouse scores.",
    imagePath: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80",
    filePath: "products/sample-file.zip",
    isAvailableForPurchase: true,
  },
  {
    name: "E-Commerce UI Component Kit",
    priceInCents: 3500,
    description: "Everything you need to build a stunning online store — product grids, cart drawers, checkout forms, wishlist, filters, and order tracking pages. Tailwind CSS.",
    imagePath: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
    filePath: "products/sample-file.zip",
    isAvailableForPurchase: true,
  },
  {
    name: "React Native Mobile Starter",
    priceInCents: 4900,
    description: "Cross-platform mobile boilerplate with Expo Router, NativeWind styling, Zustand state management, and pre-built screens for auth, profile, and settings.",
    imagePath: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80",
    filePath: "products/sample-file.zip",
    isAvailableForPurchase: true,
  },
  {
    name: "DevOps CI/CD Pipeline Kit",
    priceInCents: 4500,
    description: "Ready-to-use GitHub Actions workflows for Next.js, Node.js, and Docker projects. Includes automated testing, staging deployments, and production release pipelines.",
    imagePath: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80",
    filePath: "products/sample-file.zip",
    isAvailableForPurchase: true,
  },
  {
    name: "Prisma + PostgreSQL Pro Kit",
    priceInCents: 2500,
    description: "Advanced Prisma ORM setup with multi-tenancy, soft deletes, audit logs, database seeding strategies, and optimized query patterns for large-scale applications.",
    imagePath: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
    filePath: "products/sample-file.zip",
    isAvailableForPurchase: true,
  },
]

async function main() {
  await db.downloadVerification.deleteMany()
  await db.order.deleteMany()
  await db.product.deleteMany()

  const sampleDir = path.join(process.cwd(), "products")
  await fs.mkdir(sampleDir, { recursive: true })
  await fs.writeFile(path.join(sampleDir, "sample-file.zip"), "Sample Asset Download Content")

  for (const product of productsData) {
    await db.product.create({ data: product })
  }

  console.log("✅ Database successfully seeded with 10 products!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })