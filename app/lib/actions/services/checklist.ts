import {
  CheckListAmbulanceType,
  ChecklistAnswersType,
  ChecklistSuppliesType,
  AnswersChecklistSupplyType,
} from "@/app/lib/definitions";
import { BaseServerAction } from "@/app/lib/core/base-action";
import {
  ChecklistAnswersState,
  ChecklistState,
  ChecklistSuppliesState,
} from "@/app/lib/config/stateConfigs";
import {
  CreateChecklist,
  CreateChecklistSupplies,
  SignChecklist,
} from "@/app/lib/schema";

export class CreateChecklistAmbulanceAction extends BaseServerAction<
  CheckListAmbulanceType,
  ChecklistState
> {
  constructor() {
    super({
      endpoint: "/api/checklists/ambulance/create",
      method: "POST",
      adminOnly: false,
    });
    this.setSchema(CreateChecklist);
  }

  async execute(
    prevState: ChecklistState,
    formData: FormData,
  ): Promise<ChecklistState> {
    try {
      const data = this.validate({
        ambulanceId: formData.get("ambulance"),
        shiftId: formData.get("shift"),
        km: Number(formData.get("km")),
        notes: formData.get("notes"),
        gasFile: formData.get("gasFile"),
      });

      const { ambulanceId, shiftId, km } = data;
      const bodyFormData = new FormData();
      bodyFormData.append("ambulanceId", ambulanceId);
      bodyFormData.append("shiftId", shiftId);
      bodyFormData.append("km", String(km));
      bodyFormData.append("notes", "");
      bodyFormData.append("gasFile", formData.get("gasFile") as File);

      const checklist = await this.fetchAPIWithFormData(bodyFormData);

      return {
        message: "Checklist creado exitosamente.",
        checklist: checklist,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class UpdateAnswersCheckListAmbulanceAction extends BaseServerAction<
  ChecklistAnswersType,
  ChecklistAnswersState
> {
  private answers: ChecklistAnswersType[];
  constructor(id: string, answers: ChecklistAnswersType[]) {
    super({
      endpoint: `/api/checklists/ambulance/answers/${id}`,
      method: "PUT",
      adminOnly: false,
    });
    this.answers = answers;
  }

  async execute(
    prevState: ChecklistAnswersState,
  ): Promise<ChecklistAnswersState> {
    try {
      if (!this.answers.length) {
        return {
          errors: {
            answers: ["No hay respuestas para enviar."],
          },
        };
      }

      await this.fetchAPI({ answers: this.answers });

      return { message: "Checklist actualizado exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class SignCheckListAction extends BaseServerAction<
  ChecklistAnswersType[],
  ChecklistState
> {
  constructor(id: string, endpoint: string) {
    super({
      endpoint,
      method: "PUT",
      adminOnly: false,
    });
    this.setSchema(SignChecklist);
  }

  async execute(
    prevState: ChecklistState,
    formData: FormData,
  ): Promise<ChecklistState> {
    try {
      const data = this.validate({
        recipientId: formData.get("write-in-signature"),
        notes: formData.get("notes"),
        signOperatorFile: formData.get("sign-write-out-signature"),
        signRecipientFile: formData.get("sign-write-in-signature"),
      });

      const bodyFormData = new FormData();

      bodyFormData.append("recipientId", data.recipientId as string);
      bodyFormData.append("notes", data.notes as string);
      // bodyFormData.append(
      //   "signOperatorFile",
      //   formData.get("sign-write-out-signature") as File
      // );
      // bodyFormData.append(
      //   "signRecipientFile",
      //   formData.get("sign-write-in-signature") as File
      // );

      await this.fetchAPIWithFormData(bodyFormData);

      return { message: "Checklist aprobado exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class CreateChecklistSuppliesAction extends BaseServerAction<
  ChecklistSuppliesType,
  ChecklistSuppliesState
> {
  constructor() {
    super({
      endpoint: "/api/checklists/supply/create",
      method: "POST",
      adminOnly: false,
    });
    this.setSchema(CreateChecklistSupplies);
  }

  async execute(
    prevState: ChecklistSuppliesState,
    formData: FormData,
  ): Promise<ChecklistSuppliesState> {
    try {
      const data = this.validate({
        shiftId: formData.get("shift"),
      });

      const checklist = await this.fetchAPI(data);

      return {
        message: "Checklist creado exitosamente.",
        checklist: checklist,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class UpdateCheckListSupplyAnswersAction extends BaseServerAction<
  AnswersChecklistSupplyType[],
  ChecklistAnswersState
> {
  private answers: AnswersChecklistSupplyType[];
  constructor(id: string, answers: AnswersChecklistSupplyType[]) {
    super({
      endpoint: `/api/checklists/supply/answers/${id}`,
      method: "PUT",
      adminOnly: false,
    });
    this.answers = answers;
  }

  async execute(
    prevState: ChecklistAnswersState,
  ): Promise<ChecklistAnswersState> {
    try {
      if (!this.answers.length) {
        return {
          errors: {
            answers: ["No hay respuestas para enviar."],
          },
        };
      }

      await this.fetchAPI({ answers: this.answers });

      return { message: "Checklist actualizado exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
