import { Suspense } from "react";
import { Metadata } from "next";
import { fetchDelegations } from "@/app/lib/data/delegations";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { WrapperForm } from "@/app/ui/dashboard/wrappers";
import { FormSkeleton } from "@/app/ui/components/skeletons";
import QuestionEditForm from "@/app/ui/dashboard/questions/edit/question-edit-form";
import { fetchQuestionById } from "@/app/lib/data/checklist";

export const metadata: Metadata = {
  title: "Editar Pregunta",
};

export default async function EditQuestionPage(props: {
  params: Promise<{ id: string }>;
}) {
  // (Página) Editar Pregunta - [SSR]
  const params = await props.params;
  const id = params.id;

  const fetchQuestionByIdAndDelegations = async () =>
    await Promise.all([
      fetchQuestionById(id),
      fetchDelegations().then((result) => result.data),
    ]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Preguntas", href: "/dashboard/questions" },
          {
            label: "Editar Pregunta",
            href: `/dashboard/questions/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Suspense fallback={<FormSkeleton goBackUrl="/dashboard/questions" />}>
        <WrapperForm
          fetchData={fetchQuestionByIdAndDelegations}
          WrappedComponent={QuestionEditForm}
        />
      </Suspense>
    </section>
  );
}
