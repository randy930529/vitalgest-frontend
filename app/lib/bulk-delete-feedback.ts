type DeleteActionResponse = {
  message?: string | null;
  errors?: {
    success?: string[];
  };
};

type BulkDeleteOptions = {
  ids: string[];
  deleteAction: (id: string) => Promise<unknown>;
  setFailedSelection: (ids: string[]) => void;
  pluralLabel: string;
  singularLabel: string;
};

function extractServerErrors(response: unknown): string[] {
  if (!response || typeof response !== "object") return [];
  const maybeErrors = (response as DeleteActionResponse).errors;
  if (!maybeErrors?.success || !Array.isArray(maybeErrors.success)) return [];
  return maybeErrors.success;
}

export async function runBulkDeleteWithFeedback({
  ids,
  deleteAction,
  setFailedSelection,
  pluralLabel,
  singularLabel,
}: BulkDeleteOptions): Promise<DeleteActionResponse> {
  const results = await Promise.allSettled(ids.map((id) => deleteAction(id)));

  const failedIds: string[] = [];
  const errorMessages: string[] = [];

  results.forEach((result, index) => {
    const currentId = ids[index];

    if (result.status === "rejected") {
      failedIds.push(currentId);
      errorMessages.push(`No se pudo eliminar ${singularLabel} ${currentId}.`);
      return;
    }

    const serverErrors = extractServerErrors(result.value);
    if (serverErrors.length) {
      failedIds.push(currentId);
      errorMessages.push(...serverErrors);
    }
  });

  setFailedSelection(failedIds);

  if (failedIds.length > 0) {
    return {
      errors: {
        success: [
          `No se pudieron eliminar ${failedIds.length} ${pluralLabel}.`,
          ...errorMessages.slice(0, 2),
        ],
      },
    };
  }

  return { message: `${ids.length} ${pluralLabel} eliminado(s) exitosamente.` };
}
