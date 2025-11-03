import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const customer = await this.customersService.findOne(+id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  @Get(':id/orders')
  async getCustomerOrders(@Param('id') id: string) {
    return this.customersService.getCustomerOrders(+id);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    const customer = await this.customersService.findByEmail(email);
    if (!customer) {
      throw new NotFoundException(`Customer with email ${email} not found`);
    }
    return customer;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }
}

