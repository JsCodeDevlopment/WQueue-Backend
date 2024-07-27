import { Campaign } from "../../../domain/campaign/entity/campaign.entity";
import { CampaignGateway } from "../../../domain/campaign/gateway/campaign.gateway";
import { NotFoundError } from "../../errors/not.found.request.error";
import { Usecase } from "../../usecase";
import { ListCampaignByIdInputDto } from "./dto/listById.input.dto";
import { ListCampaignByIdOutputDto } from "./dto/listById.output";

export class ListCampaignByIdUsecase
  implements Usecase<ListCampaignByIdInputDto, ListCampaignByIdOutputDto>
{
  private constructor(private readonly campaignGateway: CampaignGateway) {}

  public static create(campaignGateway: CampaignGateway) {
    return new ListCampaignByIdUsecase(campaignGateway);
  }

  public async execute(
    input: ListCampaignByIdInputDto
  ): Promise<ListCampaignByIdOutputDto> {
    const aCampaign = await this.campaignGateway.listById(input.id);

    if (!aCampaign) throw new NotFoundError("Campaign not found");

    const output = this.presentOutput(aCampaign);

    return output;
  }

  private presentOutput(campaign: Campaign): ListCampaignByIdOutputDto {
    const output: ListCampaignByIdOutputDto = {
      campaign: {
        id: campaign.id,
        name: campaign.name,
        phone: campaign.phone,
        delay: campaign.delay,
        schedule: campaign.schedule,
        status: campaign.status,
        message: campaign.message,
      },
    };

    return output;
  }
}
