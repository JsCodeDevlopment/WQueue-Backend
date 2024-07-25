import { Channel, Connection, connect } from "amqplib";
import { Campaign } from "../../../domain/campaign/entity/campaign.entity";
import { MessageSchedulerGateway } from "../../../domain/campaign/gateway/schedule.gateway";
import { BadRequestError } from "../../../usecases/errors/bad.request.error";
import { QUEUE_NAME, RABBITMQ_URL } from "../../../main/api/config/rabbitMQ";

export class RabbitMQRepository implements MessageSchedulerGateway {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  public static create(): RabbitMQRepository {
    return new RabbitMQRepository();
  }

  async connect(): Promise<void> {
    this.connection = await connect(RABBITMQ_URL);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(QUEUE_NAME);
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
      if (msg) {
        const campaign: Campaign = JSON.parse(msg.content.toString());
        console.log("Message received:", campaign);
        // Logic to send WhatsApp message using Baileys API
        this.channel!.ack(msg);
      }
    });
  }
}
