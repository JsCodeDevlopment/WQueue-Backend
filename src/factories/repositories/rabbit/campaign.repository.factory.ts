import { RabbitMQRepository } from "../../../infra/repositories/rebbit/rebbit.repository";
import { WWebJs } from "../../../main/api/config/WWebJs";

export async function createRabbitRepository(wwebjs: WWebJs) {
  const rabbitRepository = RabbitMQRepository.create(wwebjs);
  await rabbitRepository.connect();
  return rabbitRepository;
}
