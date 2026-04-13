import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

function isAllowedOrigin(origin: string, configuredCorsOrigins: string[]): boolean {
  if (configuredCorsOrigins.includes(origin)) {
    return true;
  }

  try {
    const { hostname, protocol } = new URL(origin);
    if (!['http:', 'https:'].includes(protocol)) {
      return false;
    }

    return hostname.endsWith('.onrender.com') || hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

function parseCorsOrigins(value?: string): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((origin) => origin.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const defaultCorsOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'https://bible-available-api.vercel.app',
    'https://bible-available-api.onrender.com',
  ];
  const configuredCorsOrigins = [...new Set([...defaultCorsOrigins, ...parseCorsOrigins(process.env.CORS_ORIGINS)])];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin, configuredCorsOrigins)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`), false);
    },
    methods: ['GET', 'HEAD', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Bible API')
    .setDescription('Bible API V1 documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
