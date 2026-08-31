import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components"
import { OrderInformation } from "./components/OrderInformation"
import React from "react"

type OrderHistoryEmailProps = {
  orders: {
    id: string
    pricePaidInCents: number
    createdAt: Date | string
    downloadVerificationId: string
    product: {
      name: string
      imagePath: string
      description: string
    }
  }[]
}

OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      id: "1",
      createdAt: "2026-08-31T00:00:00.000Z",
      pricePaidInCents: 10000,
      downloadVerificationId: "verif-123-abc",
      product: {
        name: "Product name 1",
        description: "Some description for the first product",
        imagePath:
          "/products/5aba7442-e4a5-4d2e-bfa7-5bd358cdad64-02 - What Is Next.js.jpg",
      },
    },
    {
      id: "2",
      createdAt: "2026-08-30T00:00:00.000Z",
      pricePaidInCents: 2000,
      downloadVerificationId: "verif-456-def",
      product: {
        name: "Product name 2",
        description: "Some other description for the second product",
        imagePath:
          "/products/db3035a5-e762-41b0-996f-d54ec730bc9c-01 - Course Introduction.jpg",
      },
    },
  ],
} satisfies OrderHistoryEmailProps

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
  return (
    <Html>
      <Preview>Order History & Downloads</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Order History</Heading>
            {orders.map((order, index) => (
              <React.Fragment key={order.id}>
                <OrderInformation
                  order={order}
                  product={order.product}
                  downloadVerificationId={order.downloadVerificationId}
                />
                {index < orders.length - 1 && <Hr />}
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}