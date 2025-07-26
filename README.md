# NestJS MongoDB Prisma Backend

A modern backend application built with NestJS, Prisma, and MongoDB. This project provides a solid foundation for building scalable server-side applications.

## 🚀 Features

- **NestJS Framework**: Progressive Node.js framework for building efficient and scalable server-side applications
- **Prisma ORM**: Type-safe database client and migration tool
- **MongoDB**: NoSQL database for flexible data storage
- **Docker Support**: Containerized MongoDB setup for easy development
- **TypeScript**: Full TypeScript support for type safety
- **Hot Reload**: Development server with automatic reloading

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) and Docker Compose
- [Git](https://git-scm.com/)

## 🛠️ Getting Started

### 1. Clone and Setup

```bash
# If you haven't cloned yet, clone the repository
git clone <your-repo-url>
cd backend

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory and copy the contents from `environment.example`:

```bash
# Create .env file
cp environment.example .env
```

The `.env` file should contain:
```env
# For local development with Docker
DATABASE_URL="mongodb://nestjs_user:nestjs_password@localhost:27017/nestjs_app?authSource=nestjs_app"

# Application
NODE_ENV=development
PORT=3000
```

### 3. Choose Your Database Setup

#### Option A: MongoDB Atlas (Recommended)

MongoDB Atlas is the **recommended approach** because it:
- ✅ Fully managed cloud database
- ✅ Free tier available for development
- ✅ Built-in security and backups
- ✅ Global availability and scaling

**Quick Setup:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create free account
2. Create a new cluster (choose M0 Free tier)
3. Create database user and whitelist your IP
4. Get connection string and update `.env` file

For detailed setup instructions, see: **[ATLAS_SETUP.md](./ATLAS_SETUP.md)**

#### Option B: Local Docker Setup (Alternative)

```bash
# Start MongoDB and Mongo Express
docker-compose up -d

# Verify containers are running
docker-compose ps
```

This will start:
- **MongoDB** on port `27017`
- **Mongo Express** (Web UI) on port `8081` at http://localhost:8081

### 4. Generate Prisma Client and Push Schema

```bash
# Generate Prisma client
npx prisma generate

# Push the schema to MongoDB (creates collections)
npx prisma db push
```

### 5. Start the Application

```bash
# Development mode with hot reload
npm run start:dev

# Or standard development mode
npm run start

# Production mode
npm run start:prod
```

The application will be available at http://localhost:3000

## 🗄️ Database Management

### Using Mongo Express (Web UI)
- Open http://localhost:8081 in your browser
- Browse collections, documents, and execute queries
- No authentication required in development mode

### Using Prisma Studio
```bash
# Open Prisma Studio (alternative database browser)
npx prisma studio
```

### Database Operations
```bash
# Reset database (clears all data)
npx prisma db push --force-reset

# View database schema
npx prisma db pull
```

## 📝 API Endpoints

The application starts with basic endpoints:

- `GET /` - Health check endpoint
- Additional endpoints can be added in controllers

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── app.controller.ts      # Main application controller
│   ├── app.module.ts          # Root application module
│   ├── app.service.ts         # Main application service
│   ├── main.ts               # Application entry point
│   └── prisma.service.ts     # Prisma database service
├── prisma/
│   └── schema.prisma         # Database schema definition
├── docker-compose.yml        # MongoDB Docker setup
├── mongo-init.js            # MongoDB initialization script
├── environment.example      # Environment variables template
└── README.md               # This file
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode for tests
npm run test:watch
```

## 📊 Database Schema

The project includes sample models:

### User Model
- `id`: ObjectId (primary key)
- `email`: String (unique)
- `name`: String (optional)
- `posts`: Relation to Post model
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Post Model
- `id`: ObjectId (primary key)
- `title`: String
- `content`: String (optional)
- `published`: Boolean
- `authorId`: ObjectId (foreign key)
- `author`: Relation to User model
- `createdAt`: DateTime
- `updatedAt`: DateTime

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs

# Restart services
docker-compose restart

# Remove all data (clean start)
docker-compose down -v
```

## 🔧 Development Tips

1. **Environment Setup**: Always use the Docker setup for consistency
2. **Schema Changes**: After modifying `schema.prisma`, run `npx prisma generate` and `npx prisma db push`
3. **Hot Reload**: Use `npm run start:dev` for automatic server restart on file changes
4. **Database Browsing**: Use Mongo Express at http://localhost:8081 for easy database exploration
5. **Type Safety**: Leverage Prisma's generated types for full TypeScript support

## 🚀 Production Deployment

For production deployment:

1. **Environment Variables**: Update `.env` with production MongoDB connection string
2. **Build**: Run `npm run build`
3. **Start**: Use `npm run start:prod`
4. **Database**: Use MongoDB Atlas or a production MongoDB instance

```bash
# Production build
npm run build

# Start production server
npm run start:prod
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Docker Documentation](https://docs.docker.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is [MIT licensed](LICENSE).
