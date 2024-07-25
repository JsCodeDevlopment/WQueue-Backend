import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { ApiExpress } from "./main/api/api.express";
import { corsOptions } from "./main/api/config/cors";
import { generateFolderStructure } from "./main/docs/make.structure";
import { createCampaignRepository } from "./factories/repositories/campaign/campaign.repository.factory";
import { createCampaignUseCases } from "./factories/useCases/campaign/campaign.usecase.factory";
import { createCampaignRoutes } from "./factories/routes/campaign/campaign.routes.factory";
import { createScheduleUseCases } from "./factories/useCases/schedule/schedule.usecase.factory";
import { createRabbitRepository } from "./factories/repositories/rabbit/rabbit.repository.factory";

function server() {
  const campaignRepository = createCampaignRepository();
  const rabbitRepository = createRabbitRepository();
  const campaignUseCases = createCampaignUseCases(campaignRepository);
  const scheduleMessageUsecase = createScheduleUseCases(
    campaignRepository,
    rabbitRepository
  );

  const useCases = { campaignUseCases, scheduleMessageUsecase };

  const campaignRoutes = createCampaignRoutes({
    createCampaignUsecase: useCases.campaignUseCases.createCampaignUsecase,
    scheduleMessageUsecase: useCases.scheduleMessageUsecase.scheduleMessageUsecase
  });

  const globalMiddlawares = [];

  const api = ApiExpress.create([...campaignRoutes], corsOptions);
  const port = 8000;
  generateFolderStructure("./src");
  api.start(port);
}

server();
