import { billingReturnUrl, checkoutUrls } from "@/config/stripe-config";
import { updateUser } from "@/prisma/db/users";
import { User } from "@prisma/client";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

const createStripeCustomer = async (userId: string, email: string) => {
  const newCustomer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  if (!newCustomer) {
    throw new Error("Stripe customer creation failed.");
  }

  return newCustomer.id;
};

export const generateCheckoutLink = async (
  user: User,
  priceId: string,
  mode: "payment" | "subscription"
) => {
  // Get or create Stripe customer for the current user
  let customerId;
  if (user.customerId) {
    customerId = user.customerId;
  } else {
    customerId = await createStripeCustomer(user.id, user.email);
    await updateUser(user.id, { customerId });
  }

  const checkSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    client_reference_id: user.id,
    success_url: checkoutUrls.success_url,
    cancel_url: checkoutUrls.cancel_url,
  });

  return checkSession.url;
};

export const generateBillingPortalLink = async (user: User) => {
  if (!user?.customerId) return;

  const { url } = await stripe.billingPortal.sessions.create({
    customer: user.customerId,
    return_url: billingReturnUrl,
  });

  return url;
};

export const cancelStripeSubscription = async (subscriptionId: string) => {
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
};
