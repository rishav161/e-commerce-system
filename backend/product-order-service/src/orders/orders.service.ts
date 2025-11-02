import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private productsService: ProductsService,
    private rabbitMQService: RabbitMQService,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findByCustomer(customerId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customerId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Validate products exist and calculate total
    const productIds = createOrderDto.items.map((item) => item.productId);
    const products = await this.productsService.getProductsByIds(productIds);

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    let totalAmount = 0;
    const orderItems: Partial<OrderItem>[] = [];

    // Calculate total and validate stock
    for (const item of createOrderDto.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        );
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order
    const order = this.orderRepository.create({
      customerId: createOrderDto.customerId,
      totalAmount,
      shippingAddress: createOrderDto.shippingAddress,
      items: orderItems as OrderItem[],
    });

    const savedOrder = await this.orderRepository.save(order);

    // Decrease stock for all products
    for (const item of createOrderDto.items) {
      await this.productsService.updateStock(item.productId, item.quantity);
    }

    // Publish order_created event to RabbitMQ
    await this.rabbitMQService.publishOrderCreated({
      orderId: savedOrder.id,
      customerId: savedOrder.customerId,
      totalAmount: savedOrder.totalAmount,
      items: savedOrder.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: parseFloat(item.price.toString()),
      })),
      shippingAddress: savedOrder.shippingAddress,
      createdAt: savedOrder.createdAt,
    });

    return this.findOne(savedOrder.id);
  }
}

