// import { MessageSchedulerGateway } from "../../../domain/campaign/gateway/schedule.gateway";
import { CampaignRepository } from "../../../infra/repositories/campaign/campaign.repository";
import { RabbitMQRepository } from "../../../infra/repositories/rebbit/rebbit.repository";
import { Usecase } from "../../usecase";
import { ScheduleInputDto } from "./dto/schedule.input.dto";

export class ScheduleMessageUsecase
  implements Usecase<ScheduleInputDto, void>
{
  private constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly messageScheduler: RabbitMQRepository
  ) {}

  public static create(
    campaignRepository: CampaignRepository,
    messageSchedule: RabbitMQRepository
  ) {
    return new ScheduleMessageUsecase(campaignRepository, messageSchedule);
  }

  public async execute({
    campaignId: payload,
  }: ScheduleInputDto): Promise<void> {
    const campaign = await this.campaignRepository.listById(payload);
    
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    await this.messageScheduler.scheduleMessage(campaign);
    campaign.status = 'completed';
    await this.campaignRepository.update(campaign);
  
  }
}
