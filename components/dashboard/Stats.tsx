import React from "react";
import StatCard, { StatTypes } from "./StatCard";
import { getTotalUsers } from "@/prisma/db/users";
import {
  getTotalMonthlyRevenue,
  getTotalSubscribers,
} from "@/prisma/db/subscriptions";

const Stats = async () => {
  // const totalUsers = await getTotalUsers();
  // const totalSubscribers = await getTotalSubscribers();
  // const totalMonthlyRevenue = await getTotalMonthlyRevenue();

  const [totalUsers, totalSubscribers, totalMonthlyRevenue] = await Promise.all(
    [getTotalUsers(), getTotalSubscribers(), getTotalMonthlyRevenue()]
  );

  return (
    <>
      <StatCard
        title="Total Revenue"
        value={`$${totalMonthlyRevenue}`}
        type={StatTypes.REVENUE}
      />
      <StatCard title="Total Users" value={totalUsers} type={StatTypes.USERS} />
      <StatCard
        title="Total Subscribers"
        value={totalSubscribers}
        type={StatTypes.SUBSCRIBERS}
      />
    </>
  );
};

export default Stats;
