# Inventory & Order Management System API

A RESTful API built with **Node.js**, **Express**, and **Sequelize (MySQL)** to manage product inventory, handle orders, apply discount rules, and ensure data integrity using database transactions.

## 🚀 Key Features

### 🛒 Product CRUD
- Create, Read, Update, Delete inventory items.

### 📦 Order Processing
- Place new orders  
- Stock availability check  
- Automatic stock reduction after successful order

### 🔒 Transactional Integrity
- Order creation + stock update executed in a **MySQL transaction** to ensure atomicity.

### 💸 Advanced Discount Logic
- Rule-based discount system  
- Automatically applies **only the highest applicable discount**  
  - **10%** → If unique items ≥ 3  
  - **15%** → If total value > $500

### 🌐 Client Interface
- Includes **interactive HTML (Axios-based)** frontend for testing CRUD + order operations without page reloads.

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express.js |
| ORM | Sequelize |
| Database | MySQL |
| Validation | express-validator |
| Frontend Demo | HTML + JavaScript + Axios |

## ⚙️ Project Setup

### 1. Prerequisites
- Node.js (v18+)  
- MySQL Server (Default port: 3306)

### 2. Database Configuration

Create MySQL database:

```
CREATE DATABASE rahul;
```

Update credentials in `models/index.js`:

```js
const sequelize = new Sequelize('rahul', 'root', '1234');
```

### 3. Installation

```
npm install express sequelize mysql2 express-validator axios ejs
```

### 4. Start Server

```
node index.js
```

Server runs at:

```
http://localhost:3000
```

## 🎯 API Endpoints

Base URL: **http://localhost:3000/api**

### 1. Product Management

| Method | Route | Description | Validation |
|--------|--------|-------------|------------|
| GET | /products | Get all products | No |
| GET | /products/:id | Get a product | No |
| POST | /products | Create product | Yes |
| PUT | /products/:id | Update product | Yes |
| DELETE | /products/:id | Delete product | No |

### 2. Order Processing

| Method | Route | Description |
|--------|--------|-------------|
| POST | /orders | Place new order (with discount + stock transaction) |

#### Example Order Body

```json
{
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1 }
  ]
}
```

## 💰 Discount Rules

| Condition | Discount |
|-----------|-----------|
| If unique items ≥ 3 | **10%** |
| If total value > $500 | **15%** |

> Only the **highest** discount is applied.

## 🖥️ Frontend Interface

Open `interactive_order_form.html` in browser to test full CRUD + ordering using Axios.

