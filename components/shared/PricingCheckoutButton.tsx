"use client";

import SubmitButton from "../shared/SubmitButton";
import { useFormState } from "react-dom";
import { createCheckout } from "@/actions/stripe-actions";
import { useEffect } from "react";
import { type TypeOptions, toast } from "react-toastify";
import { useSession, signIn } from "next-auth/react";

type PricingProps = {
  title: string;
  priceId: string;
};

const PricingCheckoutButton = ({ title, priceId }: PricingProps) => {
  const [state, formAction] = useFormState(createCheckout, undefined);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (state) {
      toast(state.message, { type: state.type as TypeOptions });
    }
  }, [state]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevenir el envío por defecto del formulario

    if (status === "loading") {
      // No hacer nada mientras la sesión está cargando
      return;
    }

    if (!session) {
      // Redirigir al login si no está autenticado
      signIn(null, { callbackUrl: `/checkout?priceId=${priceId}` });
    } else {
      // Si está autenticado, enviar el formulario
      const form = e.currentTarget.closest("form");
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <form action={formAction.bind(null, priceId)} className="w-full">
      <SubmitButton
        className="w-full"
        title={title}
        onClick={handleClick}
      />
    </form>
  );
};

export default PricingCheckoutButton;