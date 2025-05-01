import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import { packages } from "@/config/landing-page-config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(value?: string | Date) {
  return dayjs(value).format("MMM DD, YYYY");
}

export function getPlanPrice(priceId: string): number | null {
  const plan = packages.find((pkg) => pkg.priceId === priceId);
  if (plan) {
    return plan.price;
  }

  return null;
}

export function getSubscriptionPrice(priceId: string): number {
  const plan = packages.find((pkg) => pkg.priceId === priceId);
  return plan ? plan.price : 0;
}
