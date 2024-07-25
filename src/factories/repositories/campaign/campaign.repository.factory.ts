import { CampaignRepository } from "../../../infra/repositories/campaign/campaign.repository";

export function createCampaignRepository() {
  return CampaignRepository.create();
}
