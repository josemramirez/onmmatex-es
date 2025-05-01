import Stats from "@/components/dashboard/Stats";
import RecentSubscribers from "@/components/dashboard/RecentSubscribers";
//import Chart from "@/components/dashboard/Chart";
import { getSubscriptionChartData } from "@/prisma/db/subscriptions";
import { Suspense } from "react";
import { Loader } from "@/components/shared/Spinner";

const Dashboard = async () => {
  const chartData = await getSubscriptionChartData();

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Suspense fallback={<Loader />}>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <Stats />
          </div>
        </Suspense>
        <div className="grid gap-4 md:gap-8 xl:grid-cols-2">
          {/*<Chart chartData={chartData} />*/}

          <Suspense fallback={<Loader />}>
            <RecentSubscribers />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
