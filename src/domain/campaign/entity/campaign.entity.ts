import { CampaignProps } from "../interfaces/campaign.props";

export class Campaign {
  private constructor(private readonly props: CampaignProps) {
    this.validate();
  }

  public static create(
    name: string,
    phone: string,
    schedule: Date,
    delay: 2 | 5 | 7 | 10,
    status: "pending" | "completed" | "failed",
    message: string
  ): Campaign {
    return new Campaign({
      id: crypto.randomUUID().toString(),
      name,
      phone,
      schedule,
      delay,
      status,
      message,
    });
  }

  public static with(props: CampaignProps) {
    return new Campaign(props);
  }

  private validate() {
    if (
      this.props.name === "" ||
      this.props.phone === "" ||
      this.props.schedule === null ||
      this.props.delay === null ||
      this.props.message === ""
    ) {
      throw new Error(
        "Invalid campaign. Some fields are empty. Please check the name, phone, schedule and delay."
      );
    }
  }

  public get id() {
    return this.props.id;
  }

  public get name() {
    return this.props.name;
  }

  public get phone() {
    return this.props.phone;
  }

  public get schedule() {
    return this.props.schedule;
  }

  public get delay() {
    return this.props.delay;
  }

  public get status() {
    return this.props.status;
  }

  public get message() {
    return this.props.message;
  }

  public set status(value: "pending" | "completed" | "failed") {
    this.props.status = value;
  }
}
