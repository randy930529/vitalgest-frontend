import { Suspense } from "react";
import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { TableSkeleton } from "@/app/ui/components/skeletons";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import QuestionForm from "@/app/ui/dashboard/questions/create/question-form";
import {
  fetchQuestionCategories,
  fetchQuestionSubcategories,
  fetchQuestions,
} from "@/app/lib/data/checklist";
import QuestionTable from "@/app/ui/dashboard/questions/question-table";

export const metadata: Metadata = {
  title: "Gestión de Preguntas",
};

export default async function QuestionPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    display?: string;
    categoryId?: string;
    subcategoryId?: string;
  }>;
}) {
  // (Página) Listado de preguntas - [SSR]

  const { categoryId, subcategoryId } = await searchParams;
  const fetchQuestionsAndCategories = async () =>
    await Promise.all([
      fetchQuestions(categoryId, subcategoryId),
      fetchQuestionCategories(),
      fetchQuestionSubcategories(),
    ]);

  return (
    <section className="vital-shell">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Preguntas", href: "/dashboard/questions", active: true },
        ]}
      />
      <Suspense
        fallback={
          <TableSkeleton
            title="Crear Pregunta"
            modelContent={<QuestionForm categories={[]} subcategories={[]} />}
          />
        }
      >
        <WrapperTable
          fetchData={fetchQuestionsAndCategories}
          WrappedComponent={QuestionTable}
        />
      </Suspense>
    </section>
  );
}
