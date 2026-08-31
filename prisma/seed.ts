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
    name: "Next.js 15 SaaS Boilerplate",
    priceInCents: 4900,
    description: "Production-ready Next.js starter kit with Supabase Auth, Stripe integration, Tailwind CSS, and TypeScript pre-configured.",
    imagePath: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    filePath: "products/sample-file.zip",
    isAvailableForPurchase: true,
  },
  {
    name: "Modern Minimal Admin Dashboard",
    priceInCents: 2900,
    description: "Clean, accessible React dashboard components built with Shadcn UI, Recharts analytics, and dark mode support out of the box.",
    imagePath: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    filePath: "products/sample-file.zip",
    isAvailableForPurchase: true,
  },
  {
    name: "Tailwind UI Component Kit",
    priceInCents: 1900,
    description: "Over 80+ handcrafted, accessible layout blocks including hero sections, pricing tables, product cards, and footers.",
    imagePath: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    filePath: "products/sample-file.zip",
    isAvailableForPurchase: true,
  },
  {
    name: "E-Commerce Microservice Starter",
    priceInCents: 5900,
    description: "Full-stack e-commerce architecture featuring Prisma ORM, Redis caching layer, Resend email workflows, and Stripe Webhooks.",
    imagePath: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    filePath: "products/sample-file.zip",
    isAvailableForPurchase: true,
  },
  {
    name: "Developer Portfolio Template",
    priceInCents: 1500,
    description: "Sleek, Old Money minimalist developer portfolio with Framer Motion animations, MDX blog support, and SEO optimization.",
    imagePath: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    filePath: "products/sample-file.zip",
    isAvailableForPurchase: true,
  },
  {
    name: "REST & GraphQL API Starter",
    priceInCents: 3500,
    description: "Scalable Node.js backend template featuring Zod validation, JWT authentication, Rate Limiting, and Automated Swagger docs.",
    imagePath: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
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

  console.log("Database successfully seeded!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })