import {
  AmbulanceAreaType,
  ChecklistQuestionsType,
  PaginatedResult,
  StepItemType,
  SupplyAmbulanceType,
} from "@/app/lib/definitions";
import { DataFetch } from "@/app/lib/core/base-data";
import { extractUniqueSteps } from "@/app/lib/utils";

export async function fetchChecklistQuestions(
  category?: number,
): Promise<PaginatedResult<ChecklistQuestionsType>> {
  try {
    const endPoint = `/api/checklists/ambulance/questions`;

    const dataFetching = new DataFetch<ChecklistQuestionsType>(endPoint);
    const checklistQuestions = category
      ? (await dataFetching.getAll({ category })) || {
          data: [],
          totalRecords: 0,
        }
      : await dataFetching.getAll();

    return checklistQuestions;
  } catch (err) {
    console.log("API Error[GET QUESTIONS]:", err);
    return { data: [], totalRecords: 0 };
  }
}

export async function fetchChecklistSteps(): Promise<[StepItemType[], number]> {
  try {
    const endPoint = "/api/checklists/ambulance/questions";

    const dataFetching = new DataFetch<ChecklistQuestionsType>(endPoint);
    const { data: checklistQuestions } = await dataFetching.getAll();

    if (!checklistQuestions.length) return [[], 0];

    const steps = extractUniqueSteps(
      checklistQuestions,
      ({ order_category, name_category }) =>
        `${order_category}-${name_category}`,
      ({ order_category, name_category }) => ({
        id: order_category,
        label: name_category,
      }),
      (a, b) => a.id - b.id,
    );

    return [steps, steps.length];
  } catch (err) {
    console.log("API Error[GET STEPS]:", err);
    return [[], 0];
  }
}

type StepAreaItemType = StepItemType & { order: number };
export async function fetchAmbulanceAreasSteps(): Promise<
  [StepAreaItemType[], number]
> {
  try {
    const endPoint = "/api/ambulances/areas";

    const dataFetching = new DataFetch<AmbulanceAreaType>(endPoint);
    const { data: checklistAreas } = await dataFetching.getAll();

    if (!checklistAreas.length) return [[], 0];

    const steps = extractUniqueSteps<
      (typeof checklistAreas)[0],
      StepAreaItemType
    >(
      checklistAreas,
      ({ id, name }) => `${id}-${name}`,
      ({ id, order, name }) => ({ id: Number(id), label: name, order }),
      (a, b) => a.order - b.order,
    );

    return [steps, steps.length];
  } catch (err) {
    console.log("API Error[GET STEPS]:", err);
    return [[], 0];
  }
}

export async function fetchChecklistSuppliesQuestions(
  ambulanceId: string,
  areaId: number,
): Promise<SupplyAmbulanceType[]> {
  try {
    const endPoint = `/api/ambulances/supplies/${ambulanceId}`;

    const dataFetching = new DataFetch<SupplyAmbulanceType>(endPoint);
    const { data: suppliesAmbulance } = await dataFetching.getAll();

    const SupplyAmbulanceByAreaId = suppliesAmbulance.filter(
      ({ area_id }) => area_id === areaId,
    );

    return SupplyAmbulanceByAreaId;
  } catch (err) {
    console.log("API Error[GET SUPPLIES AMBULANCE]:", err);
    return [];
  }
}
