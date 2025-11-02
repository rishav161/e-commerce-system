import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { CustomersService } from '../customers/customers.service';

type Connection = amqp.Connection;
type Channel = amqp.Channel;

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => CustomersService))
    private customersService: CustomersService,
  ) {}

  async onModuleInit() {
    await this.connect();
    await this.setupConsumer();
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

  private async setupConsumer() {
    try {
      if (!this.channel) {
        throw new Error('RabbitMQ channel not initialized');
      }

      const exchange = this.configService.get<string>('RABBITMQ_EXCHANGE');
      const routingKey = this.configService.get<string>('RABBITMQ_ROUTING_KEY');
      const queue = this.configService.get<string>('RABBITMQ_QUEUE');

      // Assert queue
      await this.channel.assertQueue(queue, {
        durable: true,
      });

      // Bind queue to exchange with routing key
      await this.channel.bindQueue(queue, exchange, routingKey);

      // Consume messages
      await this.channel.consume(
        queue,
        async (msg) => {
          if (msg && this.channel) {
            try {
              const orderData = JSON.parse(msg.content.toString());
              this.logger.log(`Received order_created event: Order ID ${orderData.orderId}`);

              // Process order in customer service
              await this.customersService.createOrderFromEvent(orderData);

              // Acknowledge message
              this.channel.ack(msg);
              this.logger.log(`Order processed successfully: Order ID ${orderData.orderId}`);
            } catch (error) {
              this.logger.error('Error processing order event', error);
              // Negative acknowledge - message will be requeued
              if (this.channel) {
                this.channel.nack(msg, false, true);
              }
            }
          }
        },
        {
          noAck: false, // Manual acknowledgment
        },
      );

      this.logger.log(`Consumer set up for queue: ${queue}`);
    } catch (error) {
      this.logger.error('Failed to set up consumer', error);
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

