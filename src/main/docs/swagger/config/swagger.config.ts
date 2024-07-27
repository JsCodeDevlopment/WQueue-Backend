import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { campaignSchemas } from '../components/campaign/schema/campaign.schema';
import { campaignSwaggerDefinitions } from '../components/campaign/campaign.definition';
import { errorSchema } from '../schemas/error.schema';
import { campaignInputSchemas } from '../components/campaign/schema/campaign.input.schema';
import { campaignOutputSchemas } from '../components/campaign/schema/campaign.output.schema';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'WQueue microservice API',
    version: '1.0.0',
    description: 'Documentação do microsserviço de campanha para whatsapp em fila usando RabbitMQ.',
  },
  servers: [
    {
      url: 'http://localhost:8000/',
      description: 'Servidor de Desenvolvimento',
    },
  ],
  components: {
    schemas: {
      ...errorSchema,
      ...campaignSchemas,
      ...campaignInputSchemas,
      ...campaignOutputSchemas,
    },
  },
  paths: {
    ...campaignSwaggerDefinitions,
  },
};

const options = {
  swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
