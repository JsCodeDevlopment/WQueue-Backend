export type CreateCampaignInputDto = {
  name: string;
  phone: string;
  schedule: Date;
  delay: 2 | 5 | 7 | 10;
};