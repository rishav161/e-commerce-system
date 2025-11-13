import * as dotenv from 'dotenv';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// Load .env file from the service root directory (one level up from dist/src)
const envPath = path.resolve(__dirname, '..', '..', '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn('Warning: Could not load .env file from:', envPath);
  console.warn('Error:', result.error.message);
} else {
  console.log('✓ Loaded .env file from:', envPath);
  console.log('✓ DATABASE_URL loaded:', process.env.DATABASE_URL ? 'Yes (length: ' + process.env.DATABASE_URL.length + ')' : 'No');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:3001',
      'https://e-commerce-system-9tx1.vercel.app',
      'https://e-commerce-system-product.onrender.com',
      'https://e-commerce-customer-s1fh.onrender.com'
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Product & Order Service is running on: http://localhost:${port}`);
}

bootstrap();

