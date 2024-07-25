import { Campaign } from "../../../domain/campaign/entity/campaign.entity";
import { CampaignGateway } from "../../../domain/campaign/gateway/campaign.gateway";

export class CampaignRepository implements CampaignGateway {
  private campaigns: Campaign[] = [];

  public static create(): CampaignRepository {
    return new CampaignRepository();
  }

  public async create(compaign: Campaign): Promise<void> {
    const data = {
      id: compaign.id,
      name: compaign.name,
      phone: compaign.phone,
      schedule: compaign.schedule,
      delay: compaign.delay,
      status: compaign.status,
    };

    this.campaigns.push(Campaign.with(data));
  }

  public async list(): Promise<Campaign[]> {
    const campigns = this.campaigns;

    return campigns.map((c) =>
      Campaign.with({
        id: c.id,
        name: c.name,
        phone: c.phone,
        schedule: c.schedule,
        delay: c.delay,
        status: c.status,
      })
    );
  }

  public async listById(id: string): Promise<Campaign> {
    const campign = this.campaigns.find((c) => c.id === id);

    if (!campign) {
      throw new Error("Campign not found");
    }

    return Campaign.with({
      id: campign.id,
      name: campign.name,
      phone: campign.phone,
      schedule: campign.schedule,
      delay: campign.delay,
      status: campign.status,
    });
  }

  public async update(campign: Campaign): Promise<void> {
    const data = {
      id: campign.id,
      name: campign.name,
      phone: campign.phone,
      schedule: campign.schedule,
      delay: campign.delay,
      status: campign.status,
    };

    const campignIndex = this.campaigns.findIndex((c) => c.id === campign.id);
    if (campignIndex !== -1) {
      this.campaigns[campignIndex] = Campaign.with(data);
    }
  }
}
