import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@/domains/auth/auth.service';
import { UsersService } from '@/domains/users/users.service';
import { DatabaseService } from '@/database/database.service';
import { UserRepository } from '@/domains/users/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@/common/enums/user.enum';
import { LoggerService } from '@/common/services/logger.service';
import { RegisterDto } from '@/domains/auth/dto/register.dto';
import { LoginDto } from '@/domains/auth/dto/login.dto';
import { CreateUserDto } from '@/domains/users/dto/create-user.dto';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

describe('Auth Services Test', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let databaseService: DatabaseService;
  let moduleFixture: TestingModule;

  // Store created user IDs for cleanup
  let createdUserIds: string[] = [];

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        UserRepository,
        DatabaseService,
        {
          provide: JwtService,
          useValue: {
            sign: (payload: any) => `mock-jwt-token-${payload.sub}`,
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'JWT_SECRET':
                  return 'test-jwt-secret';
                case 'JWT_EXPIRATION':
                  return '1h';
                default:
                  return null;
              }
            }),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
            logSuccess: jest.fn(),
            logError: jest.fn(),
            logInfo: jest.fn(),
            logWarning: jest.fn(),
            logDebug: jest.fn(),
            logSystemError: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = moduleFixture.get<AuthService>(AuthService);
    usersService = moduleFixture.get<UsersService>(UsersService);
    databaseService = moduleFixture.get<DatabaseService>(DatabaseService);

    console.log('✅ Test module compiled successfully');
  });

  afterAll(async () => {
    // Cleanup: Delete all created test users
    for (const userId of createdUserIds) {
      try {
        if (userId) { // Only delete if userId is defined
          await databaseService.user.delete({ where: { id: userId } });
          console.log(`✅ Cleaned up user: ${userId}`);
        }
      } catch (error) {
        console.log(`Failed to delete user ${userId}:`, error.message);
      }
    }
    
    await moduleFixture.close();
  });

  describe('AuthService Registration Tests', () => {
    it('should register a new customer using AuthService', async () => {
      console.log('🧪 Testing Customer Registration via AuthService...');

      const registerDto: RegisterDto = {
        name: 'Test Customer',
        email: `customer-service-${Date.now()}@test.com`,
        password: 'CustomerPassword123!',
        phone: `+201${Math.floor(Math.random() * 100000000)}`,
        address: '123 Customer Street, Cairo',
        lat: 30.0444,
        lng: 31.2357,
        role: UserRole.CUSTOMER,
      };

      const result = await authService.register(registerDto);

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.access_token).toBeDefined();
      expect(result.user.name).toBe(registerDto.name);
      expect(result.user.email).toBe(registerDto.email);
      expect(result.user.role).toBe(UserRole.CUSTOMER);
      expect(result.user.phone).toBe(registerDto.phone);
      expect(result.user).not.toHaveProperty('password'); // Should not expose password

      // Extract user ID for cleanup
      createdUserIds.push(result.user.id!);

      console.log('✅ Customer registration via AuthService successful');
      console.log(`   User ID: ${result.user.id}`);
      console.log(`   Name: ${result.user.name}`);
      console.log(`   Email: ${result.user.email}`);
      console.log(`   Role: ${result.user.role}`);
      console.log(`   Token: ${result.access_token}`);
    });

    it('should register a new washer using AuthService', async () => {
      console.log('🧪 Testing Washer Registration via AuthService...');

      const registerDto: RegisterDto = {
        name: 'Test Washer',
        email: `washer-service-${Date.now()}@test.com`,
        password: 'WasherPassword123!',
        phone: `+202${Math.floor(Math.random() * 100000000)}`,
        address: '456 Washer Avenue, Giza',
        lat: 30.0131,
        lng: 31.2089,
        role: UserRole.WASHER,
      };

      const result = await authService.register(registerDto);

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.access_token).toBeDefined();
      expect(result.user.name).toBe(registerDto.name);
      expect(result.user.email).toBe(registerDto.email);
      expect(result.user.role).toBe(UserRole.WASHER);
      expect(result.user.phone).toBe(registerDto.phone);

      // Extract user ID for cleanup
      createdUserIds.push(result.user.id!);

      console.log('✅ Washer registration via AuthService successful');
      console.log(`   User ID: ${result.user.id}`);
      console.log(`   Name: ${result.user.name}`);
      console.log(`   Email: ${result.user.email}`);
      console.log(`   Role: ${result.user.role}`);
    });

    it('should prevent duplicate email registration via AuthService', async () => {
      console.log('🧪 Testing Duplicate Email Prevention via AuthService...');

      const email = `duplicate-service-${Date.now()}@test.com`;

      const firstRegisterDto: RegisterDto = {
        name: 'First User',
        email: email,
        password: 'FirstPassword123!',
        phone: `+203${Math.floor(Math.random() * 100000000)}`,
        address: '123 First Street',
        role: UserRole.CUSTOMER,
      };

      // Register first user
      const firstResult = await authService.register(firstRegisterDto);
      createdUserIds.push(firstResult.user.id!);

      // Try to register second user with same email
      const secondRegisterDto: RegisterDto = {
        name: 'Second User',
        email: email,
        password: 'SecondPassword123!',
        phone: `+204${Math.floor(Math.random() * 100000000)}`,
        address: '456 Second Street',
        role: UserRole.WASHER,
      };

      await expect(authService.register(secondRegisterDto))
        .rejects
        .toThrow();

      console.log('✅ Duplicate email prevention via AuthService working');
    });
  });

  describe('AuthService Login Tests', () => {
    let testUserEmail: string;
    let testUserPassword: string;

    beforeAll(async () => {
      // Create a test user for login tests
      testUserEmail = `login-test-${Date.now()}@test.com`;
      testUserPassword = 'LoginTestPassword123!';

      const registerDto: RegisterDto = {
        name: 'Login Test User',
        email: testUserEmail,
        password: testUserPassword,
        phone: `+205${Math.floor(Math.random() * 100000000)}`,
        address: 'Login Test Address',
        role: UserRole.CUSTOMER,
      };

      const result = await authService.register(registerDto);
      createdUserIds.push(result.user.id!);

      console.log('✅ Test user created for login tests');
    });

    it('should login with valid credentials via AuthService', async () => {
      console.log('🧪 Testing Valid Login via AuthService...');

      const loginDto: LoginDto = {
        email: testUserEmail,
        password: testUserPassword,
      };

      const result = await authService.login(loginDto);

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.access_token).toBeDefined();
      expect(result.user.email).toBe(testUserEmail);
      expect(result.user.name).toBe('Login Test User');
      expect(result.user.role).toBe(UserRole.CUSTOMER);
      expect(result.user).not.toHaveProperty('password');

      console.log('✅ Valid login via AuthService successful');
      console.log(`   User: ${result.user.name}`);
      console.log(`   Email: ${result.user.email}`);
      console.log(`   Token: ${result.access_token}`);
    });

    it('should reject login with invalid password via AuthService', async () => {
      console.log('🧪 Testing Invalid Password Login via AuthService...');

      const loginDto: LoginDto = {
        email: testUserEmail,
        password: 'WrongPassword123!',
      };

      await expect(authService.login(loginDto))
        .rejects
        .toThrow(UnauthorizedException);

      console.log('✅ Invalid password correctly rejected by AuthService');
    });

    it('should reject login with non-existent email via AuthService', async () => {
      console.log('🧪 Testing Non-existent Email Login via AuthService...');

      const loginDto: LoginDto = {
        email: 'nonexistent@test.com',
        password: 'AnyPassword123!',
      };

      await expect(authService.login(loginDto))
        .rejects
        .toThrow(UnauthorizedException);

      console.log('✅ Non-existent email correctly rejected by AuthService');
    });
  });

  describe('UsersService Tests', () => {
    it('should create user via UsersService', async () => {
      console.log('🧪 Testing User Creation via UsersService...');

      const createUserDto: CreateUserDto = {
        name: 'UsersService Test User',
        email: `users-service-${Date.now()}@test.com`,
        password: 'UsersServicePassword123!',
        phone: `+206${Math.floor(Math.random() * 100000000)}`,
        address: 'UsersService Test Address',
      };

      const result = await usersService.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(createUserDto.name);
      expect(result.email).toBe(createUserDto.email);
      expect(result.role).toBeDefined();
      expect(result.phone).toBe(createUserDto.phone);
      expect(result.password).toBeDefined(); // UsersService may return hashed password

      createdUserIds.push(result.id);

      console.log('✅ User creation via UsersService successful');
      console.log(`   User ID: ${result.id}`);
      console.log(`   Name: ${result.name}`);
      console.log(`   Email: ${result.email}`);
    });

    it('should find user by email via UsersService', async () => {
      console.log('🧪 Testing Find User by Email via UsersService...');

      // Create a user first
      const createUserDto: CreateUserDto = {
        name: 'Find Test User',
        email: `find-test-${Date.now()}@test.com`,
        password: 'FindTestPassword123!',
        phone: `+207${Math.floor(Math.random() * 100000000)}`,
      };

      const createdUser = await usersService.create(createUserDto);
      createdUserIds.push(createdUser.id);

      // Find the user by email
      const foundUser = await usersService.findByEmail(createUserDto.email);

      expect(foundUser).toBeDefined();
      expect(foundUser!.id).toBe(createdUser.id);
      expect(foundUser!.email).toBe(createUserDto.email);
      expect(foundUser!.name).toBe(createUserDto.name);
      expect(foundUser!.role).toBeDefined();

      console.log('✅ Find user by email via UsersService successful');
      console.log(`   Found user: ${foundUser!.name}`);
      console.log(`   Email: ${foundUser!.email}`);
    });

    it('should return null for non-existent email via UsersService', async () => {
      console.log('🧪 Testing Non-existent Email via UsersService...');

      const nonExistentUser = await usersService.findByEmail('nonexistent@test.com');

      expect(nonExistentUser).toBeNull();

      console.log('✅ Non-existent email correctly returns null via UsersService');
    });

    it('should get all users via UsersService', async () => {
      console.log('🧪 Testing Get All Users via UsersService...');

      const users = await usersService.findAll();

      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);

      console.log('✅ Get all users via UsersService successful');
      console.log(`   Returned users: ${users.length}`);
    });

    it('should filter users by role via UsersService with pagination', async () => {
      console.log('🧪 Testing Filter Users by Role via UsersService...');

      // Get customers with pagination
      const customers = await usersService.findAllWithPagination({ 
        page: 1, 
        limit: 10, 
        role: UserRole.CUSTOMER 
      });
      
      // Get washers with pagination
      const washers = await usersService.findAllWithPagination({ 
        page: 1, 
        limit: 10, 
        role: UserRole.WASHER 
      });

      expect(customers).toBeDefined();
      expect(washers).toBeDefined();
      expect(customers.data.every(user => user.role === UserRole.CUSTOMER)).toBe(true);
      expect(washers.data.every(user => user.role === UserRole.WASHER)).toBe(true);

      console.log('✅ Filter users by role via UsersService successful');
      console.log(`   Customers: ${customers.total}`);
      console.log(`   Washers: ${washers.total}`);
    });
  });

  describe('Service Integration Tests', () => {
    it('should test complete registration and login flow via services', async () => {
      console.log('🧪 Testing Complete Registration + Login Flow via Services...');

      const email = `integration-test-${Date.now()}@test.com`;
      const password = 'IntegrationPassword123!';

      // Step 1: Register via AuthService
      const registerDto: RegisterDto = {
        name: 'Integration Test User',
        email: email,
        password: password,
        phone: `+208${Math.floor(Math.random() * 100000000)}`,
        address: 'Integration Test Address',
        role: UserRole.CUSTOMER,
      };

      const registerResult = await authService.register(registerDto);
      createdUserIds.push(registerResult.user.id!);

      expect(registerResult).toBeDefined();
      expect(registerResult.user.email).toBe(email);

      // Step 2: Login via AuthService
      const loginDto: LoginDto = {
        email: email,
        password: password,
      };

      const loginResult = await authService.login(loginDto);

      expect(loginResult).toBeDefined();
      expect(loginResult.user.email).toBe(email);
      expect(loginResult.user.name).toBe(registerResult.user.name);
      expect(loginResult.access_token).toBeDefined();

      // Step 3: Verify user exists via UsersService
      const foundUser = await usersService.findByEmail(email);

      expect(foundUser).toBeDefined();
      expect(foundUser!.email).toBe(email);
      expect(foundUser!.name).toBe(registerResult.user.name);
      
      // Verify role consistency across all services
      expect(registerResult.user.role).toBe(UserRole.CUSTOMER);
      expect(loginResult.user.role).toBe(UserRole.CUSTOMER);
      expect(foundUser!.role).toBe(UserRole.CUSTOMER);

      console.log('✅ Complete registration + login flow via services successful');
      console.log(`   Registration: ${registerResult.user.name} (${registerResult.user.email})`);
      console.log(`   Login: ${loginResult.user.name} (${loginResult.user.email})`);
      console.log(`   UsersService: ${foundUser!.name} (${foundUser!.email})`);
      console.log(`   All services maintain role: ${foundUser!.role}`);
    });

    it('should test user role consistency across services', async () => {
      console.log('🧪 Testing User Role Consistency Across Services...');

      const washerEmail = `role-test-${Date.now()}@test.com`;

      // Register as WASHER via AuthService
      const registerDto: RegisterDto = {
        name: 'Role Test Washer',
        email: washerEmail,
        password: 'RoleTestPassword123!',
        phone: `+209${Math.floor(Math.random() * 100000000)}`,
        role: UserRole.WASHER,
      };

      const registerResult = await authService.register(registerDto);
      createdUserIds.push(registerResult.user.id!);

      // Verify role via AuthService
      expect(registerResult.user.role).toBe(UserRole.WASHER);

      // Login and verify role persists
      const loginResult = await authService.login({
        email: washerEmail,
        password: 'RoleTestPassword123!',
      });

      expect(loginResult.user.role).toBe(UserRole.WASHER);

      // Verify role via UsersService
      const foundUser = await usersService.findByEmail(washerEmail);
      expect(foundUser!.role).toBe(UserRole.WASHER);

      console.log('✅ User role consistency across services verified');
      console.log(`   Registration role: ${registerResult.user.role}`);
      console.log(`   Login role: ${loginResult.user.role}`);
      console.log(`   UsersService role: ${foundUser!.role}`);
    });
  });
});