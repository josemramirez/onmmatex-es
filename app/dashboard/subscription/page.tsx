import ManageBillingButton from "@/components/shared/ManageBillingButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime, getPlanPrice } from "@/lib/utils";
import { getSubscriptionByUser } from "@/prisma/db/subscriptions";
import { auth } from "@/services/auth";
import Link from "next/link";

const Subscription = async () => {
  const session = await auth();
  console.log("Session:", session); // Log para depurar
  if (!session?.user?.id) {
    console.log("No user ID found");
    return null;
  }

  const currentSubscription = await getSubscriptionByUser(session.user.id);
  //console.log("Current Subscription:", currentSubscription); // Log para depurar

  return (
    <>
      {currentSubscription ? (
        <div className="grid gap-4 grid-cols-2">
          <Card x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>Subscripciones</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Maneja tú plan & pagos. Actualiza en cualquier momento.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <ManageBillingButton />
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardDescription>Plan Actual</CardDescription>
                <Badge
                  className="capitalize"
                  variant={
                    currentSubscription.status === "canceled"
                      ? "destructive"
                      : "default"
                  }
                >
                  {currentSubscription.status}
                </Badge>
              </div>
              <CardTitle className="text-4xl">
                {`$${getPlanPrice(currentSubscription.priceId!)}/mo`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {currentSubscription.status === "active"
                  ? "Renew at: "
                  : "Expire at: "}
                <span className="text-md text-white">
                  {formatDateTime(currentSubscription.expiredAt!)}
                </span>
              </div>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4">
          <Card x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>Actualiza a Pro</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Desbloquea todas las funciones y obtén acceso ilimitado a los servicios.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href="/#pricing">Actualiza ahora</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default Subscription;