import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Customer } from '../customers/entities/customer.entity';
import { CustomerOrder } from '../customers/entities/customer-order.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Try multiple ways to get DATABASE_URL
        const dbUrl = configService.get<string>('DATABASE_URL') || 
                     configService.get<string>('database_url') ||
                     process.env.DATABASE_URL;
        
        // Debug: Log what we found
        console.log('=== Checking DATABASE_URL ===');
        console.log('DATABASE_URL from configService:', configService.get<string>('DATABASE_URL') ? 'Found' : 'Not found');
        console.log('DATABASE_URL from process.env:', process.env.DATABASE_URL ? 'Found' : 'Not found');
        if (dbUrl) {
          console.log('Using DATABASE_URL (length:', dbUrl.length, ')');
        }
        
        if (dbUrl) {
          try {
            // Parse PostgreSQL URL format: postgresql://user:password@host:port/database
            const url = new URL(dbUrl);
            
            // Extract username and password - handle URL encoding
            let username: string = '';
            let password: string = '';
            
            // Get username and password from URL
            if (url.username) {
              try {
                username = decodeURIComponent(url.username);
              } catch {
                username = url.username;
              }
            }
            
            if (url.password !== undefined && url.password !== null) {
              try {
                password = decodeURIComponent(url.password);
              } catch {
                password = url.password;
              }
            }
            
            // Convert to strings and validate
            username = String(username).trim();
            password = String(password).trim();
            
            // Validate password exists
            if (!password) {
              console.error('DATABASE_URL password is empty!');
              console.error('Full URL:', dbUrl.replace(/:[^:@]+@/, ':****@')); // Hide password in log
              throw new Error('Database password is missing or empty');
            }
            
            // Validate username exists
            if (!username) {
              console.error('DATABASE_URL username is empty!');
              throw new Error('Database username is missing or empty');
            }
            
            // Extract database name
            const database = url.pathname.slice(1).trim();
            if (!database) {
              throw new Error('Database name is missing in DATABASE_URL');
            }
            
            // Check if URL requires SSL (Render.com PostgreSQL requires SSL)
            const requiresSSL = url.hostname.includes('render.com') || 
                               url.searchParams.get('sslmode') === 'require' ||
                               url.searchParams.get('ssl') === 'true';
            
            // For cloud databases (like Render.com), use public schema
            // For local databases, use custom schema
            const isCloudDatabase = url.hostname.includes('render.com') || 
                                   url.hostname.includes('.amazonaws.com') ||
                                   url.hostname.includes('.cloud') ||
                                   url.hostname.includes('heroku.com');
            const schemaName = isCloudDatabase ? 'public' : 'customer';
            
            // Debug logging - IMPORTANT: Log schema selection
            console.log('=== Database Configuration ===');
            console.log('Host:', url.hostname);
            console.log('Is Cloud DB:', isCloudDatabase);
            console.log('Port:', url.port || '5432');
            console.log('Username:', username);
            console.log('Password length:', password.length);
            console.log('Database:', database);
            console.log('Schema:', schemaName, isCloudDatabase ? '(using public for cloud DB)' : '(using custom schema)');
            console.log('SSL Enabled:', requiresSSL ? 'Yes' : 'No');
            console.log('==============================');
            
            // Return configuration with explicit string types
            return {
              type: 'postgres' as const,
              host: String(url.hostname),
              port: parseInt(String(url.port || '5432'), 10),
              username: String(username),
              password: String(password),
              database: String(database),
              schema: schemaName,
              entities: [Customer, CustomerOrder],
              synchronize: true,
              logging: true,
              // SSL configuration for Render.com and other cloud databases
              ssl: requiresSSL ? {
                rejectUnauthorized: false, // Required for Render.com PostgreSQL
              } : false,
            };
          } catch (parseError) {
            console.error('Error parsing DATABASE_URL:', parseError);
            console.error('DATABASE_URL value:', dbUrl ? 'Present' : 'Missing');
            if (dbUrl) {
              console.error('DATABASE_URL preview:', dbUrl.substring(0, 30) + '...');
            }
            throw parseError;
          }
        }
        
        // Fallback to individual config values
        const host = configService.get<string>('DB_HOST') || 'localhost';
        const port = configService.get<number>('DB_PORT') || 5432;
        const username = configService.get<string>('DB_USERNAME');
        const password = configService.get<string>('DB_PASSWORD');
        const database = configService.get<string>('DB_NAME');
        
        // Ensure password is always a string (empty string if undefined/null)
        const dbPassword = password !== undefined && password !== null ? String(password) : '';
        
        // Validate required fields
        if (!username) {
          console.error('DB_USERNAME is missing in environment variables');
          throw new Error('Database username (DB_USERNAME) is required');
        }
        if (!dbPassword) {
          console.error('DB_PASSWORD is missing or empty in environment variables');
          throw new Error('Database password (DB_PASSWORD) is required');
        }
        if (!database) {
          console.error('DB_NAME is missing in environment variables');
          throw new Error('Database name (DB_NAME) is required');
        }
        
        console.log('=== Database Configuration (Individual Vars) ===');
        console.log('Host:', host);
        console.log('Port:', port);
        console.log('Username:', username);
        console.log('Password length:', dbPassword.length);
        console.log('Database:', database);
        console.log('Schema: customer');
        console.log('===============================================');
        
        return {
          type: 'postgres',
          host: String(host),
          port: Number(port),
          username: String(username),
          password: String(dbPassword), // Ensure it's always a string
          database: String(database),
          schema: 'customer',
          entities: [Customer, CustomerOrder],
          synchronize: true,
          logging: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

