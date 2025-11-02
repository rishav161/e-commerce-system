import { Module, forwardRef } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [forwardRef(() => CustomersModule)],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}

