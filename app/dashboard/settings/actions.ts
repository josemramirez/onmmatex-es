"use server";

import { updateUser } from "@/prisma/db/users";
import { auth } from "@/services/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileFormSchema = z.object({
  name: z.string().min(5, { message: "Name must be at least 5 characters." }),
});

export const onUpdateProfile = async (prevState: any, formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return;

  const name = formData.get("name");
  const validatedFields = profileFormSchema.safeParse({ name });

  if (!validatedFields.success) {
    return {
      type: "error",
      message: Object.values(
        validatedFields.error.flatten().fieldErrors
      ).flat()[0],
    };
  }

  const updatedUser = await updateUser(session.user.id, {
    name: name as string,
  });

  // Convertir Decimal a un tipo serializable (ejemplo: string o number)
  const serializedUser = {
    ...updatedUser,
    totalSaldo: updatedUser.totalSaldo?.toString(), // Convertir Decimal a string
    // Otros campos Decimal que tengas también deben convertirse
  };

  revalidatePath("/dashboard/settings");

  return {
    type: "success",
    message: "Your profile has been updated",
    user: serializedUser, // Devolver el objeto serializable
  };
};