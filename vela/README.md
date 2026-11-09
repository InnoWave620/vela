# Vela — Clean Architecture Monorepo

This repository is organized into a clean, decoupled architecture separating the **Frontend** (Expo / React Native), **Backend** (Node.js / Express / TypeScript), and **Shared Contracts** (`@vela/shared`).

---

## 🏛 Architecture Overview

```
vela/
├── shared/                     # Shared TypeScript models, contracts & validation
│   ├── src/
│   │   ├── models/             # Shared entities (IUser, UserRole)
│   │   ├── contracts/          # DTOs (RegisterRequestDto, LoginRequestDto, ApiResponse<T>)
│   │   └── validation/         # Pure validation functions (validateEmail, validatePassword, etc.)
│   └── package.json            # @vela/shared
│
├── backend/                    # Backend API Service (Clean / Hexagonal Architecture)
│   ├── src/
│   │   ├── domain/             # Enterprise Business Rules
│   │   │   ├── entities/       # User entity with invariants & methods
│   │   │   ├── repositories/   # IUserRepository interface
│   │   │   └── errors/         # DomainError, UserAlreadyExistsError, InvalidCredentialsError
│   │   ├── application/        # Application Business Rules
│   │   │   ├── ports/          # IPasswordHasher, ITokenService interfaces
│   │   │   └── use-cases/      # RegisterUserUseCase, LoginUserUseCase, GetUserProfileUseCase
│   │   ├── infrastructure/     # Frameworks & External Drivers
│   │   │   ├── persistence/    # InMemoryUserRepository (swappable with PostgreSQL/Prisma/Mongo)
│   │   │   ├── security/       # BcryptPasswordHasher, JwtTokenService
│   │   │   └── config/         # Environment variables & runtime settings
│   │   ├── presentation/       # Interface Adapters
│   │   │   ├── http/
│   │   │   │   ├── controllers/  # AuthController, UserController
│   │   │   │   ├── middlewares/  # authMiddleware, errorHandlerMiddleware
│   │   │   │   └── routes/       # authRoutes, userRoutes, healthRoutes, apiRouter
│   │   ├── container.ts        # Dependency Injection / Composition Root
│   │   ├── app.ts              # Express application setup
│   │   └── index.ts            # Entrypoint starting HTTP server
│   └── package.json            # @vela/backend
│
├── frontend/                   # Frontend Mobile App (Expo SDK 58 / React Native / Expo Router)
│   ├── src/
│   │   ├── domain/             # Client Domain Layer
│   │   │   ├── models/         # User, AuthSession models
│   │   │   ├── repositories/   # IAuthRepository interface
│   │   │   └── use-cases/      # LoginUseCase, RegisterUseCase, GetCurrentUserUseCase, LogoutUseCase
│   │   ├── data/               # Data & Infrastructure Layer
│   │   │   ├── api/            # ApiClient with token injection & base URL handling
│   │   │   ├── storage/        # MemoryTokenStorage / persistent token storage
│   │   │   └── repositories/   # AuthRepositoryImpl implementing IAuthRepository
│   │   ├── presentation/       # Presentation Layer
│   │   │   ├── di/             # Frontend container / Composition root
│   │   │   ├── state/          # AuthContext (React Context providing reactive auth state)
│   │   │   └── hooks/          # useAuth hook
│   │   └── app/                # Expo Router Screen Views
│   │       ├── _layout.tsx     # Root provider setup
│   │       ├── index.tsx       # Live status & Auth Card
│   │       └── explore.tsx     # Architecture explorer
│   └── package.json            # @vela/frontend
│
└── package.json                # Root workspaces orchestrator
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (>= 18)
- npm (>= 9)

### 2. Install Dependencies
Run from the root directory:
```bash
npm install
```

### 3. Build Shared Library & Backend
```bash
npm run build
```

### 4. Run the Backend API
```bash
npm run dev:backend
```
The backend starts on `http://localhost:5000`.
- Health check: `http://localhost:5000/api/health`

### 5. Run the Frontend (Expo)
In a separate terminal:
```bash
npm run dev:frontend
```
- Press `w` to open web in browser
- Press `a` for Android emulator
- Press `i` for iOS simulator

---

## 📡 Backend API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Service health & uptime |
| `POST` | `/api/auth/register` | Public | Register new user (returns user & JWT tokens) |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials (returns JWT tokens) |
| `POST` | `/api/auth/refresh` | Public | Refresh expired access token |
| `GET` | `/api/users/me` | Bearer | Get authenticated user profile |
| `GET` | `/api/users` | Bearer | List users (admin / overview) |

---

## 🛡️ Clean Architecture Principles Applied

1. **Independent of Frameworks**: Business logic in `domain/` and `application/` has zero dependencies on Express, React Native, or Expo.
2. **Testable**: Use cases can be unit-tested without databases, web servers, or UI elements.
3. **Independent of UI**: The frontend UI in `app/` is just a view layer consuming use cases via `useAuth()`.
4. **Independent of Database**: `IUserRepository` decouples storage. Swap `InMemoryUserRepository` with Prisma, TypeORM, or Drizzle in one line in `container.ts`.
5. **Contract Sharing**: `@vela/shared` eliminates drift between client and server DTOs and validations.
