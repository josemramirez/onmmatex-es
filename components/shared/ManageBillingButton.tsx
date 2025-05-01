"use client";

import React, { useEffect } from "react";
import SubmitButton from "./SubmitButton";
import { useFormState } from "react-dom";
import { TypeOptions, toast } from "react-toastify";
import { createBillingPoralt } from "@/actions/stripe-actions";

const ManageBillingButton = () => {
  const [state, formAction] = useFormState(createBillingPoralt, undefined);

  useEffect(() => {
    if (state) {
      toast(state.message, { type: state.type as TypeOptions });
    }
  }, [state]);

  return (
    <form action={formAction} className="w-full">
      <SubmitButton className="w-full" title="Administra tú Subscripción" />
    </form>
  );
};

export default ManageBillingButton;
