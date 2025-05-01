"use client";

import SubmitButton from "@/components/shared/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";
import { onUpdateProfile } from "../actions";
import { useEffect, useRef, useState } from "react"; // Agregamos useState
import { type TypeOptions, toast } from "react-toastify";

const ProfileForm = () => {
  const { data: session, update } = useSession();
  const user = session?.user;

  // Estado inicial explícito para useFormState
  const initialState = undefined;
  const [state, formAction] = useFormState(onUpdateProfile, initialState);

  // Usamos un ref para rastrear si ya procesamos el estado actual
  const hasProcessedState = useRef(false);

  // Usamos un estado local para controlar cuándo mostrar el toast
  const [lastProcessedState, setLastProcessedState] = useState(null);

  useEffect(() => {
    // Si no hay state o ya procesamos este estado, no hacemos nada
    if (!state || hasProcessedState.current || state === lastProcessedState) return;

    // Marcamos el estado como procesado
    hasProcessedState.current = true;

    // Mostramos el toast
    toast(state.message, { type: state.type as TypeOptions });

    // Si es éxito, actualizamos la sesión
    if (state.type === "success") {
      update(state.user);
    }

    // Guardamos el estado procesado para compararlo en el futuro
    setLastProcessedState(state);

    // Limpiamos el flag después de un pequeño retraso
    setTimeout(() => {
      hasProcessedState.current = false;
    }, 100);

  }, [state, update]);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="mx-auto max-w-md p-6">
        <div className="flex flex-col space-y-1.5 mb-8">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Nombre de Perfil
          </h3>
          <p className="text-sm text-muted-foreground">
            Actualiza tu nombre de perfil
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input value={user?.email || ""} disabled />
          </div>
          <div class="grid gap-2">
            <Label>Nombre</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user?.name || ""}
              required
            />
          </div>
          <SubmitButton title="Actualiza" />
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;