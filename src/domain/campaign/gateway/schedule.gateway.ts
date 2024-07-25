import { Campaign } from "../entity/campaign.entity";

export interface MessageSchedulerGateway {
  scheduleMessage(campaign: Campaign): Promise<void>;
}