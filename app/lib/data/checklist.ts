import {
  AmbulanceAreaType,
  ChecklistQuestionsType,
  StepItemType,
  SupplyAmbulanceType,
} from "@/app/lib/definitions";
import { DataFetch } from "@/app/lib/data/data";

export async function fetchChecklistQuestions(
  category?: number
): Promise<ChecklistQuestionsType[]> {
  try {
    const categoryParam = category ? `?category=${category}` : "";
    const endPoint = `/api/checklists/ambulance/questions${categoryParam}`;

    const dataFetching = new DataFetch<ChecklistQuestionsType>(endPoint);
    const checklistQuestions = await dataFetching.getAll();

    return checklistQuestions;
  } catch (err) {
    console.log("API Error[GET QUESTIONS]:", err);
    return [];
  }
}

export async function fetchChecklistSteps(): Promise<[StepItemType[], number]> {
  try {
    const endPoint = "/api/checklists/ambulance/questions";

    const dataFetching = new DataFetch<ChecklistQuestionsType>(endPoint);
    const checklistQuestions = await dataFetching.getAll();

    if (!checklistQuestions.length) return [[], 0];

    //TODO: Extrar esta logica como utilidad------------------
    const steps = Array.from(
      new Map(
        checklistQuestions.map<[string, StepItemType]>(
          ({ order_category, name_category }) => [
            `${order_category}-${name_category}`,
            { id: order_category, label: name_category },
          ]
        )
      ).values()
    );
    steps.sort((a, b) => a.id - b.id);
    // -------------------------------------------------------

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
    const checklistAreas = await dataFetching.getAll();

    if (!checklistAreas.length) return [[], 0];

    //TODO: Extrar esta logica como utilidad------------------
    const steps = Array.from(
      new Map(
        checklistAreas.map<[string, StepAreaItemType]>(
          ({ id, order, name }) => [
            `${id}-${name}`,
            { id: Number(id), label: name, order },
          ]
        )
      ).values()
    );
    steps.sort((a, b) => a.order - b.order);
    // -------------------------------------------------------

    return [steps, steps.length];
  } catch (err) {
    console.log("API Error[GET STEPS]:", err);
    return [[], 0];
  }
}

export async function fetchChecklistSuppliesQuestions(
  ambulanceId: string,
  areaId: number
): Promise<SupplyAmbulanceType[]> {
  try {
    const endPoint = `/api/ambulances/supplies/${ambulanceId}`;

    const dataFetching = new DataFetch<SupplyAmbulanceType>(endPoint);
    const suppliesAmbulance = await dataFetching.getAll();

    const SupplyAmbulanceByAreaId = suppliesAmbulance.filter(
      ({ area_id }) => area_id === areaId
    );

    return SupplyAmbulanceByAreaId;
  } catch (err) {
    console.log("API Error[GET SUPPLIES AMBULANCE]:", err);
    return [];
  }
}
