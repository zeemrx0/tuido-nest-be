import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS if needed
  app.enableCors();

  const port = process.env.APP_PORT || 3000;
  await app.listen(port);

  console.log(`Server is running at http://localhost:${port}`);
}
bootstrap();
