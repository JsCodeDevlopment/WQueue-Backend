import { Channel, Connection, connect } from "amqplib";
import { Campaign } from "../../../domain/campaign/entity/campaign.entity";
import { MessageSchedulerGateway } from "../../../domain/campaign/gateway/schedule.gateway";
import { BadRequestError } from "../../../usecases/errors/bad.request.error";
import { QUEUE_NAME, RABBITMQ_URL } from "../../../main/api/config/rabbitMQ";
import { WWebJs } from "../../../main/api/config/WWebJs";

export class RabbitMQRepository implements MessageSchedulerGateway {
  private static instance: RabbitMQRepository | null = null;
  private static isConnected: boolean = false;
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  private constructor(
    private readonly wwebjs: WWebJs,
  ) {}

  public static create(wwebjs: WWebJs): RabbitMQRepository {
    if (!RabbitMQRepository.instance) {
      RabbitMQRepository.instance = new RabbitMQRepository(wwebjs);
    }
    return new RabbitMQRepository(wwebjs);
  }

  async connect(): Promise<void> {
    if (RabbitMQRepository.isConnected) {
      return;
    }
    this.connection = await connect(RABBITMQ_URL);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(QUEUE_NAME);
    RabbitMQRepository.isConnected = true;
  }

  async scheduleMessage(campaign: Campaign): Promise<void> {
    if (!this.channel) {
      throw new BadRequestError("Channel is not initialized");
    }
    this.channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(campaign)));
  }

  async consumeMessages(): Promise<void> {
    if (!this.channel) {
      throw new BadRequestError(
        "Channel is not initialized to consume messages"
      );
    }
    this.channel.consume(QUEUE_NAME, (msg) => {
      // console.log("Message received:", msg);
      if (msg) {
        const campaign: Campaign = JSON.parse(msg.content.toString()).props;
        // console.log("Message received:", campaign.phone);
        this.wwebjs.sendMessage(campaign.phone, "Hello, this is a test message.");

        // console.log("Message received:", campaign);
        // Logic to send WhatsApp message using Baileys API
        this.channel!.ack(msg);
      }
    });
  }
}
