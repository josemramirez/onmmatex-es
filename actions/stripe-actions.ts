"use server";

import { authRedirectTo } from "@/config/auth-config";
import { getSubscription, updateSubscription } from "@/prisma/db/subscriptions";
import { getUser } from "@/prisma/db/users";
import { auth } from "@/services/auth";
import {
  cancelStripeSubscription,
  generateBillingPortalLink,
  generateCheckoutLink,
} from "@/services/stripe";
import { SubscriptionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createCheckout = async (prevState: any, priceId: string) => {
  // Authenticate user
  const session = await auth();
  const sessionUser = session?.user;

  // Si no hay usuario autenticado, redirigir al login
  if (!sessionUser) {
    redirect("/auth/login"); // Ajusta esta ruta según tu app
  }

  // Free package
  if (priceId === "") {
    redirect(authRedirectTo);
  }

  // Get user in the database
  const dbUser = await getUser(sessionUser.id);
  if (!dbUser) {
    return {
      type: "error",
      message: "No user found",
    };
  }

  const mode = "subscription";
  const stripeSessionUrl = await generateCheckoutLink(dbUser, priceId, mode);

  if (stripeSessionUrl) {
    redirect(stripeSessionUrl);
  }
};

export const createBillingPoralt = async () => {
  // Authenticate user
  const session = await auth();
  const sessionUser = session?.user;

  // Si no hay usuario autenticado, redirigir al login
  if (!sessionUser) {
    redirect("/auth/login"); // Ajusta esta ruta según tu app
  }

  // Get user in the database
  const dbUser = await getUser(sessionUser.id);
  if (!dbUser) {
    return {
      type: "error",
      message: "No user found",
    };
  }

  const url = await generateBillingPortalLink(dbUser);
  if (url) {
    redirect(url);
  }
};

export const cancelSubscription = async (subscriptionId: string) => {
  try {
    // Check if this is an active subscription
    const subscription = await getSubscription(subscriptionId);
    if (!subscription || subscription.status !== SubscriptionStatus.active) {
      throw new Error();
    }

    // Cancel this subscription on Stripe
    await cancelStripeSubscription(subscriptionId);

    // Cancel this subscription in the database (No need to wait for the webhook)
    await updateSubscription(subscriptionId, {
      status: SubscriptionStatus.canceled,
    });

    revalidatePath("/admin/subscribers");

    return {
      type: "success",
      message: "Subscription canceled successfully",
    };
  } catch (error) {
    return {
      type: "error",
      message: "Cannot cancel this subscription",
    };
  }
};