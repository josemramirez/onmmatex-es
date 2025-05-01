"use client";

import { cancelSubscription } from "@/actions/stripe-actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubscriptionStatus } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { TypeOptions, toast } from "react-toastify";

type MenuProps = {
  subscriptionId: string;
  status: SubscriptionStatus;
};

const SubscriberMenu = ({ subscriptionId, status }: MenuProps) => {
  const [state, formAction] = useFormState(
    cancelSubscription.bind(null, subscriptionId),
    undefined
  );

  useEffect(() => {
    if (state) {
      toast(state.message, { type: state.type as TypeOptions });
    }
  }, [state]);

  if (status !== SubscriptionStatus.active) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <form action={formAction}>
            <button type="submit" className="w-full text-left">
              Cancel
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SubscriberMenu;
