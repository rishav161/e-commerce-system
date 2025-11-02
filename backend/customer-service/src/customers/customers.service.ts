import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerOrder } from './entities/customer-order.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(CustomerOrder)
    private customerOrderRepository: Repository<CustomerOrder>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async getCustomerOrders(customerId: number): Promise<CustomerOrder[]> {
    await this.findOne(customerId); // Validate customer exists
    return this.customerOrderRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
  }

  async createOrderFromEvent(orderData: any): Promise<CustomerOrder> {
    // Check if customer exists
    const customer = await this.findOne(orderData.customerId);
    
    const customerOrder = this.customerOrderRepository.create({
      customerId: orderData.customerId,
      orderId: orderData.orderId,
      totalAmount: orderData.totalAmount,
      shippingAddress: orderData.shippingAddress,
    });

    return this.customerOrderRepository.save(customerOrder);
  }
}

