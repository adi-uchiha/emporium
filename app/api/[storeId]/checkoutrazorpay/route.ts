import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import Razorpay from "razorpay"
import { nanoid } from "nanoid";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'INR',
        product_data: {
          name: product.name,
        },
        unit_amount: Math.round(product.price.toNumber() * 100)
      }
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId
            }
          }
        }))
      }
    }
  });

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY as string,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  const payment_capture = 1;
    const amount = 499;
    const currency = "INR";
    const options = {
      amount: 75000,
      currency,
      receipt: nanoid(),
      payment_capture,
    };

    try {
      const response = await razorpay.orders.create(options);
      return NextResponse.json({ 
        id: response.id,
        currency: response.currency,
        amount: response.amount 
      }, {
        headers: corsHeaders
      })
    } catch (err) {
      console.log(err)
    }
};