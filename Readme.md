# Backend Template TypeScript

This repository provides a production-grade backend template for Node.js applications using Express.js and TypeScript, with Mongoose for MongoDB integration. It includes a foundational structure, environment configuration, and a basic User model to jump start your backend development.

## Features

* **Production-Grade Setup:** Configured for scalability, security, and performance.
* **Express.js:** Minimalist web framework for routing and middleware.
* **TypeScript:** Enforced type safety for improved code maintainability and reduced runtime errors.
* **Mongoose:** Object Data Modeling (ODM) for seamless interaction with MongoDB.
* **User Model:** Pre-configured with basic fields like name, email, and password (extendable).
* **Prettier:** Code formatting with custom rules for consistent code style.
* **Environment Configuration:** `.env` file for secure storage of sensitive data (e.g., database credentials, API keys).
* **Git Best Practices:** `.gitignore` for keeping sensitive files out of version control.
* **TypeScript Integration:** Highlights the use of TypeScript for type safety.
* **Folder Structure Breakdown:** A detailed explanation of the folder structure with example file names.
* **Getting Started Prerequisites:** Basic understanding of TypeScript is required.
* **Code Formatting and Linting:** Configured with Prettier and `.prettierrc` for consistent code style.
* **Concise and Informative:** Clear and structured content for easy understanding.

## Folder Structure

```
Backend Template TypeScript/
├── node_modules/             # Dependencies
├── public/                   # Static assets
├── src/                      # Main source code
│   ├── index.ts              # Entry point
│   ├── app.ts                # Express app setup
│   ├── constant.ts           # Constants file
│   ├── controllers/          # Controller files
│   │   └── user.controller.ts
│   ├── db/                   # Database connection setup
│   │   └── database.ts
│   ├── middlewares/          # Middleware functions
│   │   ├── auth.middleware.ts
│   │   └── multer.middleware.ts
│   ├── models/               # Data models
│   │   └── user.model.ts
│   ├── routes/               # Route handlers
│   │   └── user.routes.ts
│   └── utils/                # Utility functions
│       ├── ApiError.ts
│       ├── ApiResponse.ts
│       ├── asyncHandler.ts
│       └── cloudinary.ts
├── .env                      # Environment variables
├── .env.example              # Example .env file
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git ignore file
├── package-lock.json         # Locked dependencies
├── package.json              # Project dependencies and scripts
├── Readme.md                 # Project documentation
└── tsconfig.json             # TypeScript configuration
```

## Getting Started

### Prerequisites

* **Node.js** (v14 or later)
* **MongoDB** (local or cloud instance)
* **Basic understanding of TypeScript**

### Environment Variables

Create a `.env` file in the root directory and add the following:

```
# Example .env file

PORT=4000
MONGODB_URL=YourMongoDBURL
CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=Darshan
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=Dpvasani
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=YourCloudName
CLOUDINARY_API_KEY=YourApiKey
CLOUDINARY_API_SECRET=YourApiSecret
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/dpvasani/Backend-Template-TypeScript
cd Backend-Template-TypeScript
```

2. Install dependencies:

```bash
npm install
```

3. Set up your MongoDB connection string and other environment variables in the `.env` file.

### Start the Server

To run the development server:

```bash
npm run dev
```

This will start the development server.

## Contributing

Feel free to open issues or create pull requests if you have suggestions for improvements!

## License

This project is licensed under the MIT License.
