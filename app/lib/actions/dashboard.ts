"use server";

import { fetchDelegations } from "@/app/lib/data/delegations";
import { fetchAmbulances } from "@/app/lib/data/ambulances";
import { fetchGuards } from "@/app/lib/data/guards";
import {
  buildChartDataForRange,
  type DashboardRange,
} from "@/app/lib/dashboard-analytics";

export async function fetchChartDataByRange(range: DashboardRange) {
  try {
    const [guardsResult, ambulancesResult, delegationsResult] =
      await Promise.all([fetchGuards(), fetchAmbulances(), fetchDelegations()]);
    const guards = guardsResult.data;
    const ambulances = ambulancesResult.data;
    const delegations = delegationsResult.data;
    const { trendData, delegationData } = buildChartDataForRange({
      range,
      guards,
      ambulances,
      delegations,
    });

    return {
      success: true,
      data: {
        trendData,
        delegationData,
      },
    };
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return {
      success: false,
      data: {
        trendData: [],
        delegationData: [],
      },
    };
  }
}
