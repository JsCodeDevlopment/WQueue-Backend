import { RabbitMQRepository } from "../../../infra/repositories/rebbit/rebbit.repository";

export function createRabbitRepository() {
  return RabbitMQRepository.create();
}
