import { NextFunction, Request, Response } from "express";
import { HTTPMethod, HttpMethod, Route } from "../../../../main/api/route";
import { StatusCode } from "../../../../main/adapters/http/interfaces/statusCode.enum";
import { CreateCampaignUsecase } from "../../../../usecases/compaign/create/create.usecase";
import { ScheduleMessageUsecase } from "../../../../usecases/message/scheduleMessage/schedule";
import { parseCSV } from "../../../../main/helpers/csvParser";
import { CreateCampaignInputDto } from "../../../../usecases/compaign/create/dto/create.input.dto";
import { CreateCampignOutputDto } from "../../../../usecases/compaign/create/dto/create.output.dto";
import { ScheduleInputDto } from "../../../../usecases/message/scheduleMessage/dto/schedule.input.dto";
import { upload } from "../../../../main/api/config/multer";
import { BadRequestError } from "../../../../usecases/errors/bad.request.error";

export class CreateCampaignRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly createCampaignService: CreateCampaignUsecase,
    private readonly scheduleMessageService: ScheduleMessageUsecase,
    private readonly method: HTTPMethod
  ) {}

  public static create(
    createCampaignService: CreateCampaignUsecase,
    scheduleMessageService: ScheduleMessageUsecase
  ): CreateCampaignRoute {
    return new CreateCampaignRoute(
      "/campaigns",
      createCampaignService,
      scheduleMessageService,
      HttpMethod.POST
    );
  }

  public getHandler() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { delay, schedule, message } = req.body;
        const file = req.file?.path;

        if (!file) {
          throw new BadRequestError("Image path is undefined.");
        }
        const campaignsData = await parseCSV(file);

        const response = [];

        for (const data of campaignsData) {
          const input: CreateCampaignInputDto = {
            name: data.name,
            phone: data.phone,
            delay,
            schedule,
            message,
          };

          const output: CreateCampignOutputDto =
            await this.createCampaignService.execute(input);

          const scheduleInput: ScheduleInputDto = {
            campaignId: output.id,
          };

          await this.scheduleMessageService.execute(scheduleInput);

          response.push(output);
        }
        const presentResponse = response.map((item) => this.present(item));

        res.status(StatusCode.CREATED).json(presentResponse);
      } catch (error) {
        next(error);
      }
    };
  }

  private present(input: CreateCampignOutputDto): CreateCampignOutputDto {
    const response = {
      id: input.id,
    };
    return response;
  }

  public getPath() {
    return this.path;
  }

  public getMethod() {
    return this.method;
  }

  public getMiddlewares() {
    return [upload.single("file")];
  }
}
