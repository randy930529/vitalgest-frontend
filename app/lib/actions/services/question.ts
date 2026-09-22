import { ChecklistQuestionsType } from "@/app/lib/definitions";
import { BaseServerAction } from "@/app/lib/core/base-action";
import { QuestionState } from "@/app/lib/config/stateConfigs";
import { CreateQuestion, UpdateQuestion } from "@/app/lib/schema";

export class CreateQuestionAction extends BaseServerAction<
  ChecklistQuestionsType,
  QuestionState
> {
  constructor() {
    super({
      endpoint: "/api/questions/create",
      method: "POST",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/questions"],
    });
    this.setSchema(CreateQuestion);
  }

  async execute(
    prevState: QuestionState,
    formData: FormData,
  ): Promise<QuestionState> {
    try {
      const data = this.validate({
        question: formData.get("question"),
        name_category: formData.get("name_category"),
        order_category: formData.get("order_category"),
        order_question_category: formData.get("order_question_category"),
        name_subcategory: formData.get("name_subcategory"),
        order_subcategory: formData.get("order_subcategory"),
        type_response: formData.get("type_response"),
        delegationId: formData.get("delegation"),
      });

      await this.fetchAPI(data);
      await this.revalidate();

      return { message: "Pregunta creada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class UpdateQuestionAction extends BaseServerAction<
  ChecklistQuestionsType,
  QuestionState
> {
  constructor(id: string) {
    super({
      endpoint: `/api/questions/edit/${id}`,
      method: "PUT",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/questions"],
    });
    this.setSchema(UpdateQuestion);
  }

  async execute(
    prevState: QuestionState,
    formData: FormData,
  ): Promise<QuestionState> {
    try {
      const data = this.validate({
        question: formData.get("question"),
        name_category: formData.get("name_category"),
        order_category: formData.get("order_category"),
        order_question_category: formData.get("order_question_category"),
        name_subcategory: formData.get("name_subcategory"),
        order_subcategory: formData.get("order_subcategory"),
        type_response: formData.get("type_response"),
        delegationId: formData.get("delegation"),
      });

      await this.fetchAPI(data);
      await this.revalidate();

      return { message: "Pregunta actualizada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class DeleteQuestionAction extends BaseServerAction<
  ChecklistQuestionsType,
  QuestionState
> {
  constructor(id: string) {
    super({
      endpoint: `/api/questions/delete/${id}`,
      method: "DELETE",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/questions"],
    });
  }

  async execute(): Promise<QuestionState> {
    try {
      await this.fetchAPI();
      await this.revalidate();

      return { message: "Pregunta eliminada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
