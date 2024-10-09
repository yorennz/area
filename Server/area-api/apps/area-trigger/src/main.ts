import { NestFactory } from '@nestjs/core';
import { TriggerModule } from "./trigger.module";

async function bootstrap() {
  const app = await NestFactory.create(TriggerModule);
  await app.listen(8000);
}
bootstrap();
