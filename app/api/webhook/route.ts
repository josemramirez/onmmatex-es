// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { stripe } from "@/services/stripe";
import { getUserByCustomerId } from "@/prisma/db/users";
import { upsertSubscription } from "@/prisma/db/subscriptions";
import { prisma } from "@/prisma/connect";
import { Prisma } from "@prisma/client"; // Importar Prisma para Decimal

const PRICE_VALUES: Record<string, number> = {
  'price_1RABXWBO3RpV9ttzA5goILPK': 5.0,
  'price_1RABYQBO3RpV9ttzbQmA1O2c': 29.0,
};

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Missing Stripe signature or webhook secret");
    }
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log(`Received Stripe event: ${event.type}, ID: ${event.id}`);
  } catch (error: any) {
    console.error(`Webhook verification failed: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Checkout session completed: ${session.id}, Mode: ${session.mode}`);
        if (session.mode === "subscription") {
          console.log("Subscription mode checkout completed");
        } else if (session.mode === "payment") {
          console.log("One-off payment mode checkout completed");
        }
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Subscription: ${subscription.id}, Status: ${subscription.status}, Customer: ${subscription.customer}`);

        const priceId = subscription.items?.data?.[0]?.price?.id || "unknown_price";
        const expiredAt = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        console.log(`PriceId: ${priceId}, ExpiredAt: ${expiredAt}`);

        const user = await getUserByCustomerId(subscription.customer as string);

        if (!user) {
          console.error(`User not found for customerId: ${subscription.customer}`);
          console.log("Continuing without updating subscription due to missing user");
          break;
        }

        const status =
          subscription.status === "active"
            ? subscription.cancel_at_period_end
              ? "canceled"
              : "active"
            : subscription.status === "canceled"
            ? "canceled"
            : subscription.status === "past_due" || subscription.status === "unpaid"
            ? "inactive"
            : subscription.status;

        console.log(`Computed status: ${status}`);

        // Incrementar el saldo según el priceId
        const saldoIncrease = PRICE_VALUES[priceId] || 0;
        if (saldoIncrease > 0 && status === "active") {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              totalSaldo: {
                increment: new Prisma.Decimal(saldoIncrease), // Convertir a Decimal
              },
            },
          });
          console.log(`Increased totalSaldo by $${saldoIncrease} for user ${user.id}`);
        }

        await upsertSubscription(subscription.id, user.id, status, {
          priceId: priceId,
          expiredAt: expiredAt,
        });

        console.log(`Updated subscription for user ${user.id}: ${subscription.id}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Subscription: ${subscription.id}, Status: ${subscription.status}, Customer: ${subscription.customer}`);

        const priceId = subscription.items?.data?.[0]?.price?.id || "unknown_price";
        const expiredAt = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        console.log(`PriceId: ${priceId}, ExpiredAt: ${expiredAt}`);

        const user = await getUserByCustomerId(subscription.customer as string);

        if (!user) {
          console.error(`User not found for customerId: ${subscription.customer}`);
          console.log("Continuing without updating subscription due to missing user");
          break;
        }

        const status =
          subscription.status === "active"
            ? subscription.cancel_at_period_end
              ? "canceled"
              : "active"
            : subscription.status === "canceled"
            ? "canceled"
            : subscription.status === "past_due" || subscription.status === "unpaid"
            ? "inactive"
            : subscription.status;

        console.log(`Computed status: ${status}`);

        await upsertSubscription(subscription.id, user.id, status, {
          priceId: priceId,
          expiredAt: expiredAt,
        });

        console.log(`Updated subscription for user ${user.id}: ${subscription.id}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Subscription deleted: ${subscription.id}, Customer: ${subscription.customer}`);

        const user = await getUserByCustomerId(subscription.customer as string);

        if (!user) {
          console.error(`User not found for customerId: ${subscription.customer}`);
          console.log("Continuing without updating subscription due to missing user");
          break;
        }

        await upsertSubscription(subscription.id, user.id, "canceled", {
          priceId: subscription.items?.data?.[0]?.price?.id || "unknown_price",
          expiredAt: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : new Date(),
        });

        console.log(`Canceled subscription for user ${user.id}: ${subscription.id}`);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Invoice paid: ${invoice.id}, Subscription: ${invoice.subscription}`);

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          const user = await getUserByCustomerId(subscription.customer as string);

          if (!user) {
            console.error(`User not found for customerId: ${subscription.customer}`);
            console.log("Continuing without updating subscription due to missing user");
            break;
          }

          const priceId = subscription.items?.data?.[0]?.price?.id || "unknown_price";
          const expiredAt = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

          const status =
            subscription.status === "active"
              ? subscription.cancel_at_period_end
                ? "canceled"
                : "active"
              : subscription.status === "canceled"
              ? "canceled"
              : subscription.status === "past_due" || subscription.status === "unpaid"
              ? "inactive"
              : subscription.status;

          // Incrementar el saldo según el priceId
          const saldoIncrease = PRICE_VALUES[priceId] || 0;
          if (saldoIncrease > 0 && status === "active") {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                totalSaldo: {
                  increment: new Prisma.Decimal(saldoIncrease), // Convertir a Decimal
                },
              },
            });
            console.log(`Increased totalSaldo by $${saldoIncrease} for user ${user.id} after invoice paid`);
          }

          await upsertSubscription(subscription.id, user.id, status, {
            priceId: priceId,
            expiredAt: expiredAt,
          });

          console.log(`Updated subscription for user ${user.id}: ${subscription.id} after invoice paid`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error: any) {
    console.error(`Error processing event ${event.type}: ${error.message}`);
  }

  return new NextResponse(null, { status: 200 });
}