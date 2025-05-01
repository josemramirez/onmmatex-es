"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import Spinner from "./Spinner";

type ButtonProps = {
  title: string;
  className?: string;
};

const SubmitButton = ({ title, className }: ButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button className={className} type="submit" disabled={pending}>
      {pending ? <Spinner /> : `${title}`}
    </Button>
  );
};

export default SubmitButton;
