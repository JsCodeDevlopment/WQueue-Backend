import { CampaignRepository } from "../../../infra/repositories/campaign/campaign.repository";
import { CreateCampaignUsecase } from "../../../usecases/compaign/create/create.usecase";
import { ListCampaignByIdUsecase } from "../../../usecases/compaign/listById/listById.usecase";


export function createCampaignUseCases(repository: CampaignRepository) {
  return {
    createCampaignUsecase: CreateCampaignUsecase.create(repository),
    listCampaignByIdUsecase: ListCampaignByIdUsecase.create(repository),
  };
}
