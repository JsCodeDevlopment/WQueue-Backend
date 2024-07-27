import { StatusCode } from "../../../../adapters/http/interfaces/statusCode.enum";
import { internalServerErrorResponse } from "../../responses/server.error.response";

export const campaignSwaggerDefinitions = {
  "/campaigns": {
    post: {
      summary: "Permite a criação de uma campanha para whatsapp. Mande um csv com todos os contatos a quem deseja enviar a mensagem.",
      tags: ["Campaigns"],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/CampaignInput",
            },
          },
        },
      },
      responses: {
        [StatusCode.OK]: {
          description: "Campanha criada com sucesso.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CampaignOutput",
              },
            },
          },
        },
        [StatusCode.INTERNAL_SERVER_ERROR]: internalServerErrorResponse(),
      },
    },
  },
};
