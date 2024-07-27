import { Campaign } from "../../../domain/campaign/entity/campaign.entity";
import { CampaignGateway } from "../../../domain/campaign/gateway/campaign.gateway";
import { BadRequestError } from "../../errors/bad.request.error";
import { Usecase } from "../../usecase";
import { CreateCampaignInputDto } from "./dto/create.input.dto";
import { CreateCampignOutputDto } from "./dto/create.output.dto";

export class CreateCampaignUsecase
  implements Usecase<CreateCampaignInputDto, CreateCampignOutputDto>
{
  private constructor(private readonly productGateway: CampaignGateway) {}

  public static create(productGateway: CampaignGateway) {
    return new CreateCampaignUsecase(productGateway);
  }

  public async execute({
    name,
    phone,
    schedule,
    delay,
    message
  }: CreateCampaignInputDto): Promise<CreateCampignOutputDto> {
    console.log("message", message);
    if (!name || !phone || !schedule || !delay || !message)
      throw new BadRequestError(
        "Some of the information was no longer received."
      );

    const aCampaign = Campaign.create(name, phone, schedule, delay, "pending", message);

    await this.productGateway.create(aCampaign);

    const output = this.presentOutput(aCampaign);

    return output;
  }

  private presentOutput(campaign: Campaign): CreateCampignOutputDto {
    const output: CreateCampignOutputDto = {
      id: campaign.id,
    };

    return output;
  }
}
