import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // permite requisições de outros domínios (como seu app)

  await app.listen(process.env.PORT ?? 3333);
}
void bootstrap();
