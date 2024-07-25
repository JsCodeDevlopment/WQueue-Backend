import { CreateCampaignUsecase } from "../../../usecases/compaign/create/create.usecase";
import { ScheduleMessageUsecase } from "../../../usecases/message/scheduleMessage/schedule";

import { CreateCampaignRoute } from "../../../infra/routes/campaign/create/create.route";

export function createCampaignRoutes(useCases: {
  createCampaignUsecase: CreateCampaignUsecase;
  scheduleMessageUsecase: ScheduleMessageUsecase;
}) {
  return [
    CreateCampaignRoute.create(
      useCases.createCampaignUsecase,
      useCases.scheduleMessageUsecase
    ),
  ];
}
