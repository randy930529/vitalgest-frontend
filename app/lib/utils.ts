import { ReadonlyURLSearchParams } from "next/navigation";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {
  ChecklistAnswersType,
  ChecklistQuestionsType,
  ChecklistSupplyType,
  CustomMxState,
  DelegationType,
  StepItemType,
} from "@/app/lib/definitions";

export const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

/**
 * Crea una URL de navegación para la ruta de checklist con la actualización del parámetro "step".
 * @param pageNumber - Número o identificador de la página/step que se quiere establecer en la URL.
 * @param searchParams - Parámetros de búsqueda actuales que se usarán como base.
 * @param pathname - Ruta base (por ejemplo "/app/list") sobre la que se construye la URL final.
 * @returns Cadena con la URL completa que incluye los parámetros actualizados.
 */
export const createPageURL = (
  pageNumber: number | string,
  searchParams: ReadonlyURLSearchParams,
  pathname: string,
): string => {
  const params = new URLSearchParams(searchParams);
  params.delete("notes");
  params.set("step", pageNumber.toString());
  return `${pathname}?${params.toString()}`;
};

/**
 * Obtiene los municipios a partir del Id de un estado
 * o una lista vacia si no existe un estado con ese Id.
 * @param stateId Id del estado de un pais.
 * @param STATES_WITH_MUNICIPALITIES Lista de estados del pais con sus respectivos municipios de cada estado.
 * @returns Retorna una lista de los municipios que pertenecen al estado.
 */
export const getMunicipalitiesOfState = (
  stateId: string | number,
  STATES_WITH_MUNICIPALITIES: CustomMxState[],
): CustomMxState[] => {
  return (
    STATES_WITH_MUNICIPALITIES.find(({ value }) => value === stateId)
      ?.municipalities || []
  );
};

export const getStatusIcon = (status?: StepItemType["status"]) => {
  const customStepItem = {
    completed: { icon: CheckCircleIcon, color: "text-green-500" },
    pending: { icon: ClockIcon, color: "text-yellow-500" },
    error: { icon: XCircleIcon, color: "text-red-500" },
    default: { icon: ClockIcon, color: "text-gray-400" },
  };

  return customStepItem[status || "default"];
};

/**
 * Convierte una cadena de fecha en formato DD/MM/YYYY
 * @param dateString Cadena de fecha (Ej: "2024-01-15T00:00:00.000Z")
 * @returns Retorna la fecha formateada como string (Ej: "15/01/2024")
 */
export const formatDateToDDMMYYYY = (dateString: string): string => {
  const date = new Date(dateString);

  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Construye un objeto de respuesta para una pregunta de checklist
 * a partir de su id, tipo de respuesta y el valor enviado.
 * @param questionId - Identificador único de la pregunta.
 * @param type - Tipo de respuesta esperado (p. ej. "bool", "option", "text" o combinaciones).
 * @param answer - Valor recibido desde el formulario.
 * @returns Objeto de la respuesta con la(s) propiedad(es) adecuada(s).
 */
export const createAnswer = (
  questionId: string,
  type: ChecklistQuestionsType["type_response"],
  answer: string,
): ChecklistAnswersType => {
  return {
    questionId,
    type,
    valueBool: type.includes("bool") && answer === "on" ? true : undefined,
    valueOption:
      type.includes("option") && ["bueno", "regular", "malo"].includes(answer)
        ? answer
        : undefined,
    valueText:
      type.includes("text") &&
      !["on", "bueno", "regular", "malo"].includes(answer)
        ? answer
        : undefined,
  };
};

export const createStepAnswers = (
  formData: FormData,
  checklistQuestions: ChecklistQuestionsType[],
) => {
  const answers: ChecklistAnswersType[] = [];

  formData.keys().forEach((key) => {
    const cleanKey = key.includes("~") ? key.split("~")[1] : key;
    const question = checklistQuestions.find((q) => q.id === cleanKey);

    if (!question) return;

    const value = formData.get(key);

    if (value === null) return;

    const answer = createAnswer(
      cleanKey,
      question.type_response,
      value.toString(),
    );
    answers.push(answer);
  });
  return answers;
};

export const createSupplyAnswer = (
  questionId: string,
  answer: string,
): ChecklistSupplyType => {
  return {
    supplyId: questionId,
    requiredQuantity: Number(answer),
  };
};

export const createStepSupplyAnswers = (formData: FormData) => {
  const answers: ChecklistSupplyType[] = [];

  formData.keys().forEach((key) => {
    const [field, id] = key.split("~");

    if (field === "details") return;

    const value = formData.get(key);

    if (value === null) return;

    const answer = createSupplyAnswer(id, value.toString());
    answers.push(answer);
  });
  return answers;
};

/**
 * Calcular y mostrar un mensaje alternativo al trancurrir sierto
 * tiempo entre dos fechas.
 * @param dateStart Fecha inicio.
 * @param dateEnd Fecha final.
 * @returns Mensaje alternativo en formato Ej. 'Hace 1h' o 'Hace 2min'.
 */
export const getElapsedMessage = (dateStart: Date, dateEnd: Date): string => {
  const diffMs = Math.abs(dateEnd.getTime() - dateStart.getTime());
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours >= 1) {
    return `Hace ${diffHours}h`;
  } else {
    return `Hace ${diffMinutes}min`;
  }
};

/**
 *
 */
export const purgeDuplicateAnswers = (
  answers: Record<string, ChecklistAnswersType[]>,
): ChecklistAnswersType[] => {
  const answersMap = new Map<string, ChecklistAnswersType>();

  const allAnswers: ChecklistAnswersType[] = [];
  Object.values(answers).forEach((stepAnswers) => {
    allAnswers.push(...stepAnswers);
  });

  allAnswers.forEach((answers) => {
    const existingAnswer = answersMap.get(answers.questionId);
    if (existingAnswer) {
      answersMap.set(answers.questionId, {
        questionId: answers.questionId,
        type: answers.type,
        valueBool: existingAnswer.valueBool || answers.valueBool,
        valueOption: existingAnswer.valueOption || answers.valueOption,
        valueText: existingAnswer.valueText || answers.valueText,
      });
    } else {
      answersMap.set(answers.questionId, answers);
    }
  });

  return Array.from(answersMap.values());
};

/**
 * Extrae pasos únicos de un array utilizando una clave y una función de mapeo,
 * y opcionalmente los ordena usando una función de comparación.
 *
 * @template T Tipo de los elementos de entrada
 * @param {T[]} items Array de elementos fuente
 * @param {(item: T) => string} keyFn Función que produce una clave única por elemento
 * @param {(item: T) => StepItemType} mapFn Función que transforma un elemento en un StepItemType
 * @param {(a: StepItemType, b: StepItemType) => number} [sortFn] Función opcional para ordenar los pasos
 * @returns {StepItemType[]} Lista de pasos únicos y ordenados según `sortFn` si se proporciona
 */
export const extractUniqueSteps = <T, U extends StepItemType = StepItemType>(
  items: T[],
  keyFn: (item: T) => string,
  mapFn: (item: T) => U,
  sortFn?: (a: U, b: U) => number,
): U[] => {
  if (!items || items.length === 0) return [];

  const steps = Array.from(
    new Map(items.map<[string, U]>((it) => [keyFn(it), mapFn(it)])).values(),
  );

  if (sortFn) steps.sort(sortFn);
  return steps;
};

/**
 * Transforma un array de delegaciones en un array de objetos con propiedades
 * id, label y value para uso en componentes de selección o dropdowns.
 * @param delegations - Array de delegaciones a transformar. Si no se proporciona o es undefined, retorna un array vacío.
 * @returns Array de objetos con propiedades id, label y value mapeadas desde las delegaciones originales.
 */
export const getCustomDelegations = (delegations?: DelegationType[]) => {
  if (!delegations) return [];

  return delegations.map((delegation) => ({
    id: delegation.id,
    label: delegation.name,
    value: delegation.id,
  }));
};

export const formatUserStatusLabel = (
  status?: boolean | string | null,
): "Activo" | "Inactivo" => {
  if (typeof status === "string") {
    return status.trim().toLowerCase() === "true" ? "Activo" : "Inactivo";
  }

  return status ? "Activo" : "Inactivo";
};

/**
 * Sanitiza cadenas de texto de formularios para evitar etiquetas y caracteres peligrosos.
 * @param value Texto de entrada del usuario.
 * @param maxLength Limite maximo del texto permitido.
 * @returns Cadena limpia y recortada.
 */
export const sanitizeTextInput = (value: string, maxLength = 255): string => {
  return value
    .replace(/[<>"'`]/g, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, maxLength)
    .trimStart();
};

/**
 * Calcula el offset a partir del número de página.
 * @param pageNumber Número de página (comienza en 1)
 * @param limit Cantidad de items por página
 * @returns Offset para usar en la solicitud a la API
 */
export const calculateOffset = (
  pageNumber: number = 1,
  limit: number = 10,
): number => {
  return (Math.max(1, pageNumber) - 1) * limit;
};

export const getPaginationParams = (
  pageNumber?: number,
  itemsPerPage?: number,
  defaultItemsPerPage = 6,
) => {
  const limit = itemsPerPage ?? defaultItemsPerPage;
  const offset = calculateOffset(pageNumber, limit);

  return { offset, limit };
};

/**
 * Calcula el número de página a partir del offset.
 * @param offset Offset desde la API
 * @param limit Cantidad de items por página
 * @returns Número de página (comienza en 1)
 */
export const calculatePageFromOffset = (
  offset: number = 0,
  limit: number = 10,
): number => {
  return Math.floor(offset / limit) + 1;
};

/**
 * Crea una URL de paginación usando offset y limit
 * @param offset Offset a usar
 * @param limit Límite de items por página
 * @param searchParams Parámetros de búsqueda actuales
 * @param pathname Ruta base
 * @returns URL completa con los parámetros de paginación
 */
export const createPaginationURL = (
  offset: number,
  limit: number,
  searchParams: ReadonlyURLSearchParams,
  pathname: string,
): string => {
  const params = new URLSearchParams(searchParams);
  params.set("offset", offset.toString());
  params.set("limit", limit.toString());
  return `${pathname}?${params.toString()}`;
};

/**
 * Genera array de offsets para paginación
 * @param currentOffset Offset actual
 * @param totalItems Total de items
 * @param itemsPerPage Items por página
 * @returns Array de offsets/páginas para mostrar
 */
export const generatePaginationOffsets = (
  currentOffset: number,
  totalItems: number,
  itemsPerPage: number = 10,
) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = calculatePageFromOffset(currentOffset, itemsPerPage);

  return generatePagination(currentPage, totalPages).map((page) => {
    if (page === "...") return "...";
    return calculateOffset(page as number, itemsPerPage);
  });
};
