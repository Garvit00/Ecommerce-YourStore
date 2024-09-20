# MERN stack project of Ecommerce-YourStore web application

Welcome to the MERN Stack E-commerce Project! This application allows users to browse products, manage their carts, place orders, and make payments using the Razorpay payment gateway. It also includes an admin panel for managing products, users, and orders.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [User Functionality](#user-functionality)
- [Admin Functionality](#admin-functionality)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and login
- Browse and view products
- Review products
- Add products to cart
- Place orders
- Payment processing using Razorpay
- Admin functionalities:
  - Create and update products
  - View and edit user accounts
  - View all orders and mark them as delivered
  - Delete products and user accounts

## Technologies Used

- **Frontend**: React.js, Redux, Axios
- **Backend**: Node.js, Express.js, MongoDB
- **Payment Gateway**: Razorpay
- **Others**: Mongoose, Multer (for file uploads), JSON Web Tokens (JWT) for authentication

## Getting Started

To get started with this project, follow the steps below.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Garvit00/Ecommerce-YourStore.git
   cd your-repo
2. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
3. Navigate to the frontend directory and install dependencies:
   ```bash
   cd ../frontend
   npm install
4. Create a .env file in the backend directory with the following variables:
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_SECRET=your_razorpay_secret
   
6. Start the backend server:
   ```bash
   cd ../backend
   npm start

7. Start the frontend application:
   ```bash
   cd ../frontend
   npm start

## Usage
1. Open your browser and navigate to http://localhost:3000 to access the application.
2. Register a new user or log in with existing credentials.
3. Browse products, add them to your cart, and place an order.
4. Complete payment using Razorpay.
5. For admin functionality, log in with admin credentials.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or create an issue for any suggestions or improvements.




