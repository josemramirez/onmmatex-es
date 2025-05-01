import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, CreditCard, 
  FileType2, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge"


export enum StatTypes {
  REVENUE = "revenue",
  USERS = "users",
  SUBSCRIBERS = "subscribers",
}

const icons = {
  revenue: DollarSign,
  users: Hash,
  subscribers: FileType2,
};

type StatCardProps = {
  title: string;
  value: number | string;
  type: StatTypes.REVENUE | StatTypes.USERS | StatTypes.SUBSCRIBERS;
};

const StatCard = ({ title, value, type }: StatCardProps) => {
  const Icon = icons[type];

  return (
          <Badge
          variant="outline">{title}: {value} 
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          </Badge>
  );
};

export default StatCard;