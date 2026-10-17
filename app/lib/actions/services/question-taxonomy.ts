import {
  QuestionCategoryType,
  QuestionSubcategoryType,
} from "@/app/lib/definitions";
import { BaseServerAction } from "@/app/lib/core/base-action";
import {
  QuestionCategoryState,
  QuestionSubcategoryState,
} from "@/app/lib/config/stateConfigs";
import {
  CreateQuestionCategory,
  CreateQuestionSubcategory,
  UpdateQuestionCategory,
  UpdateQuestionSubcategory,
} from "@/app/lib/schema";

export class CreateQuestionCategoryAction extends BaseServerAction<
  QuestionCategoryType,
  QuestionCategoryState
> {
  constructor() {
    super({
      endpoint: "/api/questions/categories",
      method: "POST",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/questions"],
    });
    this.setSchema(CreateQuestionCategory);
  }

  async execute(
    prevState: QuestionCategoryState,
    formData: FormData,
  ): Promise<QuestionCategoryState> {
    try {
      await this.fetchAPI(this.validate({ name: formData.get("name") }));
      await this.revalidate();
      return { message: "Categoría creada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class UpdateQuestionCategoryAction extends BaseServerAction<
  QuestionCategoryType,
  QuestionCategoryState
> {
  constructor(id: string) {
    super({
      endpoint: `/api/questions/categories/${id}`,
      method: "PUT",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/questions"],
    });
    this.setSchema(UpdateQuestionCategory);
  }

  async execute(
    prevState: QuestionCategoryState,
    formData: FormData,
  ): Promise<QuestionCategoryState> {
    try {
      const order = formData.get("order");
      await this.fetchAPI(
        this.validate({
          name: formData.get("name") || undefined,
          order: order ? Number(order) : undefined,
        }),
      );
      await this.revalidate();
      return { message: "Categoría actualizada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class DeleteQuestionCategoryAction extends BaseServerAction<
  QuestionCategoryType,
  QuestionCategoryState
> {
  constructor(id: string) {
    super({
      endpoint: `/api/questions/categories/${id}`,
      method: "DELETE",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/questions"],
    });
  }

  async execute(): Promise<QuestionCategoryState> {
    try {
      await this.fetchAPI();
      await this.revalidate();
      return { message: "Categoría eliminada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class CreateQuestionSubcategoryAction extends BaseServerAction<
  QuestionSubcategoryType,
  QuestionSubcategoryState
> {
  constructor() {
    super({
      endpoint: "/api/questions/subcategories",
      method: "POST",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/questions"],
    });
    this.setSchema(CreateQuestionSubcategory);
  }

  async execute(
    prevState: QuestionSubcategoryState,
    formData: FormData,
  ): Promise<QuestionSubcategoryState> {
    try {
      await this.fetchAPI(
        this.validate({
          categoryId: formData.get("categoryId"),
          name: formData.get("name"),
        }),
      );
      await this.revalidate();
      return { message: "Subcategoría creada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class UpdateQuestionSubcategoryAction extends BaseServerAction<
  QuestionSubcategoryType,
  QuestionSubcategoryState
> {
  constructor(id: string) {
    super({
      endpoint: `/api/questions/subcategories/${id}`,
      method: "PUT",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/questions"],
    });
    this.setSchema(UpdateQuestionSubcategory);
  }

  async execute(
    prevState: QuestionSubcategoryState,
    formData: FormData,
  ): Promise<QuestionSubcategoryState> {
    try {
      const order = formData.get("order");
      await this.fetchAPI(
        this.validate({
          categoryId: formData.get("categoryId") || undefined,
          name: formData.get("name") || undefined,
          order: order ? Number(order) : undefined,
        }),
      );
      await this.revalidate();
      return { message: "Subcategoría actualizada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class DeleteQuestionSubcategoryAction extends BaseServerAction<
  QuestionSubcategoryType,
  QuestionSubcategoryState
> {
  constructor(id: string) {
    super({
      endpoint: `/api/questions/subcategories/${id}`,
      method: "DELETE",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/questions"],
    });
  }

  async execute(): Promise<QuestionSubcategoryState> {
    try {
      await this.fetchAPI();
      await this.revalidate();
      return { message: "Subcategoría eliminada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
