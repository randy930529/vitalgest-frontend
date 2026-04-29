import { ShiftType } from "@/app/lib/definitions";
import { DataFetch } from "@/app/lib/core/base-data";

export async function fetchShiftsByGuardId(id: string): Promise<ShiftType[]> {
  try {
    const endPoint = `/api/shifts/guard/${id}`;

    const dataFetching = new DataFetch<ShiftType>(endPoint);
    const { data: shifts } = await dataFetching.getAll();

    return shifts;
  } catch (err) {
    console.log("API Error[GET SHIFTS]:", err);
    return [];
  }
}

export async function fetchShiftById(
  id: string,
): Promise<ShiftType | undefined> {
  try {
    const endPoint = `/api/shifts/one/${id}`;

    const dataFetching = new DataFetch<ShiftType>(endPoint);
    const shift = await dataFetching.getOne();

    return shift;
  } catch (error) {
    console.log("Database Error[GET SHIFT]:", error);
    return;
  }
}
