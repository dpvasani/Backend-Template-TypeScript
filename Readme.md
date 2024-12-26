# Backend-Ts

This repository provides a production-grade backend template for Node.js applications using Express.js and TypeScript with Mongoose for MongoDB integration. It includes a foundational structure, environment configuration, and a basic User model to jumpstart your backend development.

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
* **Folder Structure Breakdown:** Provides a more detailed explanation of each folder's purpose with example file names.
* **Getting Started Prerequisites:** Includes the requirement for basic TypeScript understanding.
* **Code Formatting and Linting:** Mentions using Prettier and a `.prettierrc` file for consistent code style.
* **Concise and Informative:** Maintains a clear and informative structure while keeping the content concise.

## Folder Structure

```
Backend-Ts/
├── dist/                        # Compiled JavaScript files (generated)
├── node_modules/                # Dependencies
├── public/                      # Static files (e.g., images, assets)
├── src/                          # Source TypeScript files
│   ├── controllers/               # API controllers (business logic)
│   │   └── user.controller.ts     # Example controller file
│   ├── db/                         # Database connection/config
│   │   └── dbconnect.ts            # Example database connection file
│   ├── middlewares/                # Middlewares (request processing)
│   │   └── auth.middleware.ts      # Example middleware file
│   ├── models/                     # Database models/schemas
│   │   └── user.model.ts           # Example model file
│   ├── routes/                     # API routes
│   │   └── user.routes.ts          # Example route file
│   ├── utils/                      # Utility functions
│   │   └── logger.ts               # Example utility file
│   ├── app.ts                      # Express app setup
│   ├── constants.ts                # Global constants
│   └── index.ts                    # App entry point
├── .env                          # Environment variables
├── .gitignore                     # Ignored files for version control
├── .prettierignore                # Files ignored by Prettier
├── .prettierrc                    # Prettier configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Project dependencies and scripts
├── package-lock.json              # Lockfile for consistent dependency versions
└── README.md                      # Project documentation
```

## Getting Started

### Prerequisites

* Node.js (v14 or later)
* MongoDB (local or cloud instance)
* Basic understanding of TypeScript

### Environment Variables

Create a `.env` file in the root directory and add the following:

```
# Example .env file

PORT=Your Port
MONGODB_URL=MongoDB URL
# Add other environment variables as needed
```

### Installation

Clone the repository:

```bash
git clone https://github.com/dpvasani/Backend-Template-TypeScript.git
cd Backend-Ts
```

Install dependencies:

```bash
npm install
```

Set up your MongoDB connection string in the `.env` file.

### Start the Server

```bash
npm run dev
```

This will start the development server.

## Contributing

Feel free to open issues or create pull requests if you have suggestions for improvements!

## License

This project is licensed under the MIT License.
