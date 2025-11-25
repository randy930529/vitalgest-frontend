import { ChecklistQuestionsType, StepItemType } from "@/app/lib/definitions";
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
    console.log(steps);

    return [steps, steps.length];
  } catch (err) {
    console.log("API Error[GET STEPS]:", err);
    return [[], 0];
  }
}
