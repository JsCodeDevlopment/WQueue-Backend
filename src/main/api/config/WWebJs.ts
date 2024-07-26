import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

export class WWebJs {
  private static instance: WWebJs | null = null;
  private client: any | null = null;

  private constructor() {}

  public static create(): WWebJs {
    if (!WWebJs.instance) {
      WWebJs.instance = new WWebJs();
    }
    return WWebJs.instance;
  }

  async connect(): Promise<void> {
    this.client = new Client({
      authStrategy: new LocalAuth(),
    });
    this.client.initialize();

    this.client.on("qr", (qr: any) => {
      qrcode.generate(qr, { small: true });
    });

    this.client.on("ready", async () => {
      console.log("Client is ready!");
    });
  }
  
  async sendMessage(number: string, message: string): Promise<void> {
    await this.client.sendMessage(`55${number}@c.us`, message);
  }
}
