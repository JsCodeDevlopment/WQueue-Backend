import { Api } from "./interfaces/api.start";
import express, { Express, RequestHandler } from "express";
import { Route } from "./route";
import cors, { CorsOptions } from "cors";
import { errorHandlerMiddleware } from "../middlewares/error.handler.middlewares";
import { setupSwagger } from "../docs/swagger/config/swagger.config";
import { resolve } from "path";
import { RabbitMQRepository } from "../../infra/repositories/rebbit/rebbit.repository";
import { WWebJs } from "./config/WWebJs";

export class ApiExpress implements Api {
  private app: Express;

  private constructor(
    routes: Route[],
    corsOptions: CorsOptions,
    middlewares: RequestHandler[] = []
  ) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.static(resolve(__dirname, "../../..", "public")));
    this.app.use(
      "/uploads",
      express.static(resolve(__dirname, "../../..", "uploads"))
    );
    this.app.use(cors(corsOptions));

    middlewares.forEach((middleware) => this.app.use(middleware));
    setupSwagger(this.app);

    this.addRoutes(routes);
    this.app.use(errorHandlerMiddleware);
  }

  public static create(
    routes: Route[],
    corsOptions: CorsOptions,
    middlewares: RequestHandler[] = []
  ): ApiExpress {
    return new ApiExpress(routes, corsOptions, middlewares);
  }

  private addRoutes(routes: Route[]): void {
    routes.forEach((route) => {
      const path = route.getPath();
      const method = route.getMethod();
      const handler = route.getHandler();
      const middlewares = route.getMiddlewares();

      this.app[method](path, ...middlewares, handler);
    });
  }

  public async start(port: number): Promise<void> {
    const wwebjs = WWebJs.create();
    await RabbitMQRepository.create(wwebjs).connect();
    
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`http://localhost:${port}\n`);
      this.listRoutes();
    });
  }

  private listRoutes(): void {
    const routes = this.app._router.stack
      .filter((route: any) => route.route)
      .map((route: any) => {
        return {
          path: route.route.path,
          method: route.route.stack[0].method,
        };
      });

    console.log("Routes: ", routes);
  }
}
