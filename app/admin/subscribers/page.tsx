import Image from "next/image";

import { MoreHorizontal } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getValidSubscribers } from "@/prisma/db/subscriptions";
import SubscriberMenu from "./components/SubscriberMenu";

const Subscribers = async () => {
  const validSubscribers = await getValidSubscribers();

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>Subscribers</CardTitle>
        <CardDescription>
          Manage your subscribers and view their details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {validSubscribers.map((subscriber, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{subscriber.name}</TableCell>
                <TableCell>
                  <Badge
                    className="capitalize"
                    variant={
                      subscriber.status === "canceled"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {subscriber.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{`$${subscriber.price}`}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(subscriber.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <SubscriberMenu
                    subscriptionId={subscriber.subscriptionId}
                    status={subscriber.status}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Subscribers;
