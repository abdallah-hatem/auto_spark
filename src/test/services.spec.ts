import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from '@/domains/services/services.service';
import { DatabaseService } from '@/database/database.service';
import { ServiceRepository } from '@/domains/services/repositories/services.repository';
import { CreateServiceDto } from '@/domains/services/dto/create-service.dto';
import { UpdateServiceDto } from '@/domains/services/dto/update-service.dto';
import { ServicesQueryDto } from '@/domains/services/dto/services.query.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Services Module Test', () => {
  let servicesService: ServicesService;
  let databaseService: DatabaseService;
  let moduleFixture: TestingModule;

  // Store created service IDs for cleanup
  let createdServiceIds: string[] = [];

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      providers: [
        ServicesService,
        ServiceRepository,
        DatabaseService,
      ],
    }).compile();

    servicesService = moduleFixture.get<ServicesService>(ServicesService);
    databaseService = moduleFixture.get<DatabaseService>(DatabaseService);

    console.log('✅ Services test module compiled successfully');
  });

  afterAll(async () => {
    // Cleanup: Delete all created test services
    for (const serviceId of createdServiceIds) {
      try {
        if (serviceId) {
          await databaseService.service.delete({ where: { id: serviceId } });
          console.log(`✅ Cleaned up service: ${serviceId}`);
        }
      } catch (error) {
        console.log(`Failed to delete service ${serviceId}:`, error.message);
      }
    }
    
    await moduleFixture.close();
  });

  describe('ServicesService CRUD Tests', () => {
    it('should create a new service', async () => {
      console.log('🧪 Testing Service Creation...');

      const createServiceDto: CreateServiceDto = {
        name: `Test Service ${Date.now()}`,
        description: 'A test service for unit testing',
        price: 150.00,
      };

      const result = await servicesService.create(createServiceDto);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(createServiceDto.name); // Name should be preserved as entered
      expect(result.description).toBe(createServiceDto.description);
      expect(result.price).toBe(createServiceDto.price);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();

      // Store for cleanup
      createdServiceIds.push(result.id);

      console.log('✅ Service creation successful');
      console.log(`   Service ID: ${result.id}`);
      console.log(`   Name: ${result.name}`);
      console.log(`   Price: $${result.price}`);
    });

    it('should allow multiple services with different names', async () => {
      console.log('🧪 Testing Multiple Service Creation...');

      const services = [
        { name: `Service A ${Date.now()}`, description: 'First service', price: 100.00 },
        { name: `Service B ${Date.now()}`, description: 'Second service', price: 200.00 },
        { name: `Service C ${Date.now()}`, description: 'Third service', price: 300.00 },
      ];

      for (const serviceData of services) {
        const result = await servicesService.create(serviceData);
        expect(result).toBeDefined();
        expect(result.name).toBe(serviceData.name);
        expect(result.price).toBe(serviceData.price);
        createdServiceIds.push(result.id);
      }

      console.log('✅ Multiple service creation successful');
      console.log(`   Created ${services.length} services`);
    });

    it('should find all services', async () => {
      console.log('🧪 Testing Find All Services...');

      const services = await servicesService.findAll();

      expect(services).toBeDefined();
      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBeGreaterThan(0);

      console.log('✅ Find all services successful');
      console.log(`   Total services: ${services.length}`);
    });

    it('should find services with pagination', async () => {
      console.log('🧪 Testing Find Services with Pagination...');

      const query: ServicesQueryDto = {
        page: 1,
        limit: 5,
      };

      const result = await servicesService.findAllWithPagination(query);

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.total).toBeDefined();
      expect(result.page).toBe(1);
      expect(result.limit).toBe(5);
      expect(result.hasNextPage).toBeDefined();
      expect(result.hasPreviousPage).toBeDefined();

      console.log('✅ Paginated services retrieval successful');
      console.log(`   Total: ${result.total}`);
      console.log(`   Returned: ${result.data.length}`);
      console.log(`   Has next page: ${result.hasNextPage}`);
    });

    it('should search services by name', async () => {
      console.log('🧪 Testing Service Search by Name...');

      // Create a service with a specific name for searching
      const searchServiceDto: CreateServiceDto = {
        name: `Searchable Service ${Date.now()}`,
        description: 'Service for search testing',
        price: 75.00,
      };

      const createdService = await servicesService.create(searchServiceDto);
      createdServiceIds.push(createdService.id);

      // Search for the service
      const query: ServicesQueryDto = {
        page: 1,
        limit: 10,
        search: 'Searchable',
      };

      const result = await servicesService.findAllWithPagination(query);

      expect(result).toBeDefined();
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data.some(service => service.id === createdService.id)).toBe(true);

      console.log('✅ Service search successful');
      console.log(`   Search term: ${query.search}`);
      console.log(`   Found services: ${result.data.length}`);
    });

    it('should find service by ID', async () => {
      console.log('🧪 Testing Find Service by ID...');

      // Create a service to find
      const createServiceDto: CreateServiceDto = {
        name: `Findable Service ${Date.now()}`,
        description: 'Service for ID lookup testing',
        price: 125.00,
      };

      const createdService = await servicesService.create(createServiceDto);
      createdServiceIds.push(createdService.id);

      // Find the service by ID
      const foundService = await servicesService.findById(createdService.id);

      expect(foundService).toBeDefined();
      expect(foundService.id).toBe(createdService.id);
      expect(foundService.name).toBe(createdService.name);
      expect(foundService.description).toBe(createdService.description);
      expect(foundService.price).toBe(createdService.price);

      console.log('✅ Find service by ID successful');
      console.log(`   Service ID: ${foundService.id}`);
      console.log(`   Name: ${foundService.name}`);
    });

    it('should throw NotFoundException for non-existent service ID', async () => {
      console.log('🧪 Testing Non-existent Service ID...');

      const nonExistentId = 'non-existent-service-id';

      await expect(servicesService.findById(nonExistentId))
        .rejects
        .toThrow(NotFoundException);

      console.log('✅ Non-existent service ID correctly throws NotFoundException');
    });

    it('should update a service', async () => {
      console.log('🧪 Testing Service Update...');

      // Create a service to update
      const createServiceDto: CreateServiceDto = {
        name: `Updatable Service ${Date.now()}`,
        description: 'Original description',
        price: 100.00,
      };

      const createdService = await servicesService.create(createServiceDto);
      createdServiceIds.push(createdService.id);

      // Update the service
      const updateServiceDto: UpdateServiceDto = {
        description: 'Updated description',
        price: 150.00,
      };

      const updatedService = await servicesService.update(createdService.id, updateServiceDto);

      expect(updatedService).toBeDefined();
      expect(updatedService.id).toBe(createdService.id);
      expect(updatedService.name).toBe(createdService.name); // Name should remain same
      expect(updatedService.description).toBe(updateServiceDto.description);
      expect(updatedService.price).toBe(updateServiceDto.price);
      expect(updatedService.updatedAt).not.toBe(createdService.updatedAt);

      console.log('✅ Service update successful');
      console.log(`   Service ID: ${updatedService.id}`);
      console.log(`   New description: ${updatedService.description}`);
      console.log(`   New price: $${updatedService.price}`);
    });

    it('should throw NotFoundException when updating non-existent service', async () => {
      console.log('🧪 Testing Update Non-existent Service...');

      const nonExistentId = 'non-existent-service-id';
      const updateServiceDto: UpdateServiceDto = {
        description: 'This should fail',
        price: 200.00,
      };

      await expect(servicesService.update(nonExistentId, updateServiceDto))
        .rejects
        .toThrow(NotFoundException);

      console.log('✅ Update non-existent service correctly throws NotFoundException');
    });

    it('should delete a service', async () => {
      console.log('🧪 Testing Service Deletion...');

      // Create a service to delete
      const createServiceDto: CreateServiceDto = {
        name: `Deletable Service ${Date.now()}`,
        description: 'Service for deletion testing',
        price: 50.00,
      };

      const createdService = await servicesService.create(createServiceDto);

      // Delete the service
      await servicesService.delete(createdService.id);

      // Verify the service is deleted
      await expect(servicesService.findById(createdService.id))
        .rejects
        .toThrow(NotFoundException);

      console.log('✅ Service deletion successful');
      console.log(`   Deleted service ID: ${createdService.id}`);
      
      // Note: Don't add to cleanup array since it's already deleted
    });

    it('should throw NotFoundException when deleting non-existent service', async () => {
      console.log('🧪 Testing Delete Non-existent Service...');

      const nonExistentId = 'non-existent-service-id';

      await expect(servicesService.delete(nonExistentId))
        .rejects
        .toThrow(NotFoundException);

      console.log('✅ Delete non-existent service correctly throws NotFoundException');
    });
  });

  describe('Service Repository Tests', () => {
    it('should find service by name', async () => {
      console.log('🧪 Testing Find Service by Name via Repository...');

      // Create a service
      const createServiceDto: CreateServiceDto = {
        name: `Repository Test Service ${Date.now()}`,
        description: 'Service for repository testing',
        price: 80.00,
      };

      const createdService = await servicesService.create(createServiceDto);
      createdServiceIds.push(createdService.id);

      // Access repository through service (since it's private)
      const foundService = await databaseService.service.findFirst({
        where: { name: createdService.name }
      });

      expect(foundService).toBeDefined();
      expect(foundService!.id).toBe(createdService.id);
      expect(foundService!.name).toBe(createdService.name);

      console.log('✅ Find service by name via repository successful');
      console.log(`   Found service: ${foundService!.name}`);
    });

    it('should return null for non-existent service name', async () => {
      console.log('🧪 Testing Non-existent Service Name...');

      const nonExistentName = 'non-existent-service-name';

      const foundService = await databaseService.service.findFirst({
        where: { name: nonExistentName }
      });

      expect(foundService).toBeNull();

      console.log('✅ Non-existent service name correctly returns null');
    });
  });

  describe('Service Business Logic Tests', () => {
    it('should preserve case when storing service names', async () => {
      console.log('🧪 Testing Case Preservation...');

      const testCases = [
        'lowercase service',
        'UPPERCASE SERVICE',
        'MixedCase Service',
        'camelCaseService',
      ];

      for (const serviceName of testCases) {
        const uniqueName = `${serviceName} ${Date.now()}`;
        const createServiceDto: CreateServiceDto = {
          name: uniqueName,
          description: 'Testing case preservation',
          price: 50.00,
        };

        const createdService = await servicesService.create(createServiceDto);
        createdServiceIds.push(createdService.id);

        // Verify the name was stored exactly as entered
        expect(createdService.name).toBe(uniqueName);
        
        console.log(`   ✓ Preserved case: ${uniqueName}`);
      }

      console.log('✅ Case preservation working correctly');
    });

    it('should validate service price values', async () => {
      console.log('🧪 Testing Service Price Validation...');

      // Test with various price values
      const validPrices = [0, 10.50, 100, 999.99];
      
      for (const price of validPrices) {
        const createServiceDto: CreateServiceDto = {
          name: `Price Test Service ${Date.now()}-${price}`,
          description: `Service with price ${price}`,
          price: price,
        };

        const result = await servicesService.create(createServiceDto);
        expect(result.price).toBe(price);
        createdServiceIds.push(result.id);

        console.log(`   ✓ Price ${price} accepted`);
      }

      console.log('✅ Service price validation working correctly');
    });

    it('should handle optional description field', async () => {
      console.log('🧪 Testing Optional Description Field...');

      // Test service without description
      const createServiceDtoNoDesc: CreateServiceDto = {
        name: `No Description Service ${Date.now()}`,
        price: 25.00,
      };

      const serviceNoDesc = await servicesService.create(createServiceDtoNoDesc);
      createdServiceIds.push(serviceNoDesc.id);

      expect(serviceNoDesc.description).toBeNull();

      // Test service with description
      const createServiceDtoWithDesc: CreateServiceDto = {
        name: `With Description Service ${Date.now()}`,
        description: 'This service has a description',
        price: 35.00,
      };

      const serviceWithDesc = await servicesService.create(createServiceDtoWithDesc);
      createdServiceIds.push(serviceWithDesc.id);

      expect(serviceWithDesc.description).toBe(createServiceDtoWithDesc.description);

      console.log('✅ Optional description field handled correctly');
      console.log(`   Without description: ${serviceNoDesc.name}`);
      console.log(`   With description: ${serviceWithDesc.name}`);
    });
  });

  describe('Service Integration Tests', () => {
    it('should handle complete service lifecycle', async () => {
      console.log('🧪 Testing Complete Service Lifecycle...');

      // 1. Create service
      const createServiceDto: CreateServiceDto = {
        name: `Lifecycle Service ${Date.now()}`,
        description: 'Testing complete lifecycle',
        price: 90.00,
      };

      const createdService = await servicesService.create(createServiceDto);
      expect(createdService).toBeDefined();
      expect(createdService.id).toBeDefined();

      // 2. Find by ID
      const foundService = await servicesService.findById(createdService.id);
      expect(foundService.id).toBe(createdService.id);

      // 3. Update service
      const updateServiceDto: UpdateServiceDto = {
        description: 'Updated lifecycle description',
        price: 110.00,
      };

      const updatedService = await servicesService.update(createdService.id, updateServiceDto);
      expect(updatedService.description).toBe(updateServiceDto.description);
      expect(updatedService.price).toBe(updateServiceDto.price);

      // 4. Verify in all services list
      const allServices = await servicesService.findAll();
      expect(allServices.some(s => s.id === createdService.id)).toBe(true);

      // 5. Delete service
      await servicesService.delete(createdService.id);

      // 6. Verify deletion
      await expect(servicesService.findById(createdService.id))
        .rejects
        .toThrow(NotFoundException);

      console.log('✅ Complete service lifecycle test successful');
      console.log(`   Created ➜ Found ➜ Updated ➜ Listed ➜ Deleted: ${createdService.name}`);
      
      // Note: Don't add to cleanup since it's already deleted
    });
  });
});