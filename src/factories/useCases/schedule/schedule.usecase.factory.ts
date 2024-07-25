// import { MessageSchedulerGateway } from "../../../domain/campaign/gateway/schedule.gateway";
import { CampaignRepository } from "../../../infra/repositories/campaign/campaign.repository";
import { RabbitMQRepository } from "../../../infra/repositories/rebbit/rebbit.repository";
import { ScheduleMessageUsecase } from "../../../usecases/message/scheduleMessage/schedule";

export function createScheduleUseCases(
  repository: CampaignRepository,
  messageScheduler: RabbitMQRepository
) {
  return {
    scheduleMessageUsecase: ScheduleMessageUsecase.create(
      repository,
      messageScheduler
    ),
  };
}
