export type CampaignProps = {
  id: string;
  name: string;
  phone: string;
  schedule: Date;
  delay: 2 | 5 | 7 | 10;
  status: "pending" | "completed" | "failed";
  message: string;
};
