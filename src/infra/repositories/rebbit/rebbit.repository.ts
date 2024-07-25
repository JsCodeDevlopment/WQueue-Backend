import amqp from 'amqplib';
import { Campaign } from '../../../domain/campaign/entity/campaign.entity';
import { MessageSchedulerGateway } from '../../../domain/campaign/gateway/schedule.gateway';

export class RabbitMQRepository implements MessageSchedulerGateway {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  public static create(): RabbitMQRepository {
    return new RabbitMQRepository();
  }

  async connect(): Promise<void> {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue('whatsapp_campaign');
  }

  async scheduleMessage(campaign: Campaign): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }
    this.channel.sendToQueue('whatsapp_campaign', Buffer.from(JSON.stringify(campaign)));
  }

  async consumeMessages(): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }
    this.channel.consume('whatsapp_campaign', (msg) => {
      if (msg) {
        const campaign: Campaign = JSON.parse(msg.content.toString());
        console.log('Message received:', campaign);
        // Logic to send WhatsApp message using Baileys API
        this.channel!.ack(msg);
      }
    });
  }
}
