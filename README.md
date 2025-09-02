# Uber

A driver management platform for Uber-like services. This platform includes features like user management, chat functionality, OTP service, Stripe integration, and request validation.

## Template

This project is based on the [express-it](https://github.com/shaishab316/express-it) template.

## Features

- User Management:
  - Sign up
  - Sign in
  - Reset Password
  - Profile Management
- Chat Functionality:
  - Real-time chat
  - File sharing
  - Message deletion
- OTP Service:
  - Generate OTP
  - Verify OTP
- Stripe Integration:
  - Payment processing
  - Payment refund
- Request Validation:
  - Input validation
  - Authentication and Authorization

## Installation

To get started with the application, clone the repository and install the dependencies:

```bash
git clone https://github.com/Joint-Venture-AI/uber.git
cd uber
npm install
```

## Usage

### Development

To start the development server, run:

```bash
npm run dev
```

This will start the server with auto-reloading enabled for development purposes.

### Production

To build and start the application in production mode, use:

```bash
npm run build
npm start
```

## Scripts

- `new-module`: Generate a new module using the builder script.
- `build`: Transpile TypeScript to JavaScript.
- `start`: Start the server.
- `dev`: Start the server in development mode with TypeScript support.
- `stripe`: Listen for Stripe webhook events and forward them to the application.
- `lint`: Run ESLint to check for code quality.
- `prettier`: Format code using Prettier.
- `test`: Run tests (currently not specified).

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Author

- **Shaishab Chandra Shil** - [GitHub](https://github.com/shaishab316)

## Repository

Find the repository on GitHub: [uber](https://github.com/Joint-Venture-AI/uber.git)
