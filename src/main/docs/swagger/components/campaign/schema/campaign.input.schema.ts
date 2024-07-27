export const campaignInputSchemas = {
  CampaignInput: {
    type: "object",
    properties: {
      file: {
        type: "binary",
      },
      schedule: {
        type: "date",
      },
      delay: {
        type: "number",
      },
      message: {
        type: "string",
      },
    },
    required: ["file", "schedule", "delay", "message"],
  },
};
