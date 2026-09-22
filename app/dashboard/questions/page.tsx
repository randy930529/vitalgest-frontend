import { Suspense } from "react";
import { Metadata } from "next";
import { fetchDelegations } from "@/app/lib/data/delegations";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { TableSkeleton } from "@/app/ui/components/skeletons";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import QuestionForm from "@/app/ui/dashboard/questions/create/question-form";
// import { getPaginationParams } from "@/app/lib/utils";
import { fetchChecklistQuestions } from "@/app/lib/data/checklist";
import QuestionTable from "@/app/ui/dashboard/questions/question-table";

export const metadata: Metadata = {
  title: "Gestión de Preguntas",
};

export default async function QuestionPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; display?: string; category?: number }>;
}) {
  // (Página) Listado de preguntas - [SSR]

  const { page, display, category } = await searchParams;
  const fetchQuestionsAndDelegations = async () =>
    await Promise.all([
      fetchChecklistQuestions(category),
      fetchDelegations().then((result) => result.data),
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
            modelContent={<QuestionForm />}
          />
        }
      >
        <WrapperTable
          fetchData={fetchQuestionsAndDelegations}
          WrappedComponent={QuestionTable}
        />
      </Suspense>
    </section>
  );
}
