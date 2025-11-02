import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

type Connection = amqp.Connection;
type Channel = amqp.Channel;

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }

  private async connect() {
    try {
      const rabbitUrl = this.configService.get<string>('RABBITMQ_URL');
      const conn = await amqp.connect(rabbitUrl);
      this.connection = conn as unknown as Connection;
      this.channel = await conn.createChannel();

      const exchange = this.configService.get<string>('RABBITMQ_EXCHANGE');
      
      // Declare exchange
      await this.channel.assertExchange(exchange, 'topic', {
        durable: true,
      });

      this.logger.log('Connected to RabbitMQ and exchange declared');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
      throw error;
    }
  }

  async publishOrderCreated(orderData: any) {
    try {
      if (!this.channel) {
        throw new Error('RabbitMQ channel not initialized');
      }

      const exchange = this.configService.get<string>('RABBITMQ_EXCHANGE');
      const routingKey = this.configService.get<string>('RABBITMQ_ROUTING_KEY');

      const message = JSON.stringify(orderData);
      
      const published = this.channel.publish(
        exchange,
        routingKey,
        Buffer.from(message),
        {
          persistent: true,
        },
      );

      if (published) {
        this.logger.log(`Order created event published: Order ID ${orderData.orderId}`);
      } else {
        this.logger.warn('Message returned to queue');
      }
    } catch (error) {
      this.logger.error('Failed to publish order created event', error);
      throw error;
    }
  }

  private async close() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await (this.connection as any).close();
      }
      this.logger.log('RabbitMQ connection closed');
    } catch (error) {
      this.logger.error('Error closing RabbitMQ connection', error);
    }
  }
}

