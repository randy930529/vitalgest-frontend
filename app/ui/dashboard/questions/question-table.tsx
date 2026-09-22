"use client";

import { useState } from "react";
import { Tooltip } from "react-tooltip";
import {
  ChecklistQuestionsType,
  DelegationType,
  PaginatedResult,
} from "@/app/lib/definitions";
import ModalTrigger from "@/app/ui/button-modal";
import Filters from "@/app/ui/dashboard/table-filters";
import TablePagination from "@/app/ui/components/pagination";
import TableActions from "@/app/ui/dashboard/tabla-actions";
import TableActionEdit from "@/app/ui/dashboard/botton-edit";
import TableActionDelete from "@/app/ui/dashboard/button-delete";
import TableActionDeleteAllSelected from "@/app/ui/dashboard/button-delete-all";
import { modalComponents } from "@/app/lib/config/modalConfig";
import { runBulkDeleteWithFeedback } from "@/app/lib/bulk-delete-feedback";
import { CHECKLIST_RESPONSE_TYPES } from "@/app/lib/config/constants";
import { deleteQuestion } from "@/app/lib/actions/question";

const ModalComponent = modalComponents.questionForm;
const customHeaders = [
  { id: 0, label: "Pregunta" },
  { id: 1, label: "Categoría" },
  { id: 2, label: "Subcategoría" },
  { id: 3, label: "Tipo de Respuesta" },
];

export default function QuestionTable({
  data,
}: {
  data: [PaginatedResult<ChecklistQuestionsType>, DelegationType[]];
}) {
  // (Component) Tabla interactiva de preguntas - [CSR]

  const [{ data: questions, totalRecords }, delegations] = data;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const allSelected =
    questions.length > 0 && selectedIds.length === questions.length;

  function handleCheckboxChange(checkedId: string, checked: boolean) {
    if (checked) {
      setSelectedIds([...selectedIds, checkedId]);
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== checkedId));
    }
  }

  function handleSelectAllChange(checked: boolean) {
    const questionsIds = questions.map(({ id }) => id);
    setSelectedIds(checked ? questionsIds : []);
  }

  return (
    <main className="relative mt-7 overflow-hidden rounded-[26px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm">
      <Filters>
        {selectedIds.length > 0 && (
          <TableActionDeleteAllSelected
            selectedIds={selectedIds}
            actionDelete={async (ids: string[]) => {
              return runBulkDeleteWithFeedback({
                ids,
                deleteAction: deleteQuestion,
                setFailedSelection: setSelectedIds,
                pluralLabel: "pregunta(s)",
                singularLabel: "la pregunta",
              });
            }}
          />
        )}
        <ModalTrigger
          title="Crear Pregunta"
          modelContent={<ModalComponent delegations={delegations} />}
        />
      </Filters>
      <p className="px-4 py-2 text-xs text-slate-500" aria-live="polite">
        {selectedIds.length > 0
          ? `${selectedIds.length} pregunta(s) seleccionada(s)`
          : "Selecciona preguntas para acciones masivas"}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <caption className="sr-only">
            Tabla de preguntas con selección y acciones de edición o
            eliminación.
          </caption>
          <thead className="bg-slate-100/80 text-xs uppercase tracking-[0.08em] text-slate-600">
            <tr>
              <th scope="col" className="px-4 py-3">
                <div className="flex items-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    className="h-4 w-4 rounded-sm border-slate-300 bg-white text-rose-600 focus:ring-2 focus:ring-rose-300"
                    data-tooltip-id="checkbox-all-tooltip"
                    checked={allSelected}
                    aria-label="Seleccionar todas las preguntas"
                    onChange={(event) => {
                      handleSelectAllChange(event.target.checked);
                    }}
                  />
                  <Tooltip
                    id="checkbox-all-tooltip"
                    content="Seleccionar Todos"
                    className="font-normal capitalize"
                  />
                  <label htmlFor="checkbox-all" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              {customHeaders.map((header) => (
                <th key={header.id} scope="col" className="px-4 py-3">
                  {header.label}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {questions?.map((question) => (
              <tr
                key={question.id}
                className="border-b border-slate-200 transition-colors hover:bg-slate-50/70"
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-${question.id}`}
                      type="checkbox"
                      className="h-4 w-4 rounded-sm border-slate-300 bg-white text-rose-600 focus:ring-2 focus:ring-rose-300"
                      value={question.id}
                      checked={selectedIds.includes(question.id)}
                      aria-label={`Seleccionar pregunta ${question.question}`}
                      onChange={(event) => {
                        handleCheckboxChange(question.id, event.target.checked);
                      }}
                    />
                    <label
                      htmlFor={`checkbox-table-${question.id}`}
                      className="sr-only"
                    >
                      checkbox
                    </label>
                  </div>
                </td>
                <th
                  scope="row"
                  className="whitespace-nowrap px-4 py-3.5 font-medium text-slate-900"
                >
                  {question.question}
                </th>
                <td className="px-4 py-3.5">{question.name_category}</td>
                <td className="px-4 py-3.5">{question.name_subcategory}</td>
                <td className="px-4 py-3.5">
                  {CHECKLIST_RESPONSE_TYPES[question.type_response]}
                </td>
                <TableActions>
                  <TableActionEdit
                    editLink={`/dashboard/questions/${question.id}/edit`}
                  />
                  <TableActionDelete
                    id={question.id}
                    title="Eliminar Pregunta"
                    question={`¿Está seguro que desea eliminar la pregunta: ${question.question}?`}
                    actionDelete={deleteQuestion}
                  />
                </TableActions>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination totalItems={totalRecords} />
    </main>
  );
}
