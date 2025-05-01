import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLatestSubscribers } from "@/prisma/db/subscriptions";
import { CircleUser } from "lucide-react";

import { formatDistanceToNow } from "date-fns";

const RecentSubscribers = async () => {
  const recentSubscribers = await getLatestSubscribers(5);

  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle>Recent Subscribers</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {recentSubscribers.map((subscriber, i) => (
          <div key={i} className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage src={subscriber.image!} alt="Avatar" />
              <AvatarFallback>
                <CircleUser className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {subscriber.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(subscriber.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="ml-auto font-medium">{`$${subscriber.price}`}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentSubscribers;
