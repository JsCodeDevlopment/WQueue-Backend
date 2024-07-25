import { Campaign } from "../entity/campaign.entity";

export interface CampaignGateway {
  create(campaign: Campaign): Promise<void>;
  listById(id: string): Promise<Campaign>;
  list(): Promise<Campaign[]>;
  update(product: Campaign): Promise<void>;
}
