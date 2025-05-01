"use server";

import { authRedirectTo, signOutRedirectTo } from "@/config/auth-config";
import { signIn, signOut } from "@/services/auth";

export const onLogut = async () => {
  await signOut({ redirectTo: signOutRedirectTo });
};

export const onSignIn = async () => {
  await signIn("github", { redirectTo: authRedirectTo });
};

export const onSignInWithLink = async (formData: FormData) => {
  await signIn("resend", formData);
};
