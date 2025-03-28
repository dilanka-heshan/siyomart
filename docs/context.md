# Siyomart E-Commerce Platform Documentation

[... previous content ...]

## 🔹 Phase 4: Frontend Architecture

### Optimal Folder Structure

```markdown
siyomart/
├── src/
│ ├── app/
│ │ ├── (auth)/
│ │ │ ├── login/
│ │ │ └── register/
│ │ ├── dashboard/
│ │ │ ├── admin/
│ │ │ ├── seller/
│ │ │ └── buyer/
│ │ ├── products/
│ │ │ └── [id]/
│ │ ├── cart/
│ │ ├── orders/
│ │ ├── api/
│ │ │ ├── auth/
│ │ │ ├── products/
│ │ │ └── ... (other API routes)
│ │ └── layout.tsx
│ ├── components/
│ │ ├── auth/
│ │ ├── cart/
│ │ ├── dashboard/
│ │ ├── products/
│ │ ├── ui/
│ │ └── ... (other feature components)
│ ├── lib/
│ │ ├── auth.ts
│ │ ├── db/
│ │ │ ├── connect.ts
│ │ │ └── models/
│ │ ├── services/
│ │ │ ├── productService.ts
│ │ │ └── orderService.ts
│ │ └── utils/
│ ├── types/
│ ├── public/
│ │ ├── images/
│ │ └── assets/
│ └── styles/
├── scripts/
│ ├── seed.ts
│ └── db-indexes.ts
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json

Key Directories:

- app/: Next.js App Router structure
- components/: Reusable UI components organized by feature
- lib/: Business logic and database connections
- services/: Data access layer for MongoDB operations
- public/: Static assets and product images
- scripts/: Database seeding and maintenance
```

### Structure Details

1. **App Router Organization**

```markdown
app/
├── (auth)/ - Authentication routes
├── dashboard/ - Role-based dashboards
├── products/ - Product listing/details pages
├── cart/ - Shopping cart flows
├── orders/ - Order management
└── api/ - API route handlers
```

2. **Component Architecture**

```markdown
components/
├── auth/ - Auth forms and providers
├── products/ - Product cards, filters, galleries
├── cart/ - Cart items, checkout components
├── dashboard/ - Admin/Seller analytics components
└── ui/ - Primitive components (buttons, modals)
```

3. **Backend Services**

```markdown
lib/
├── db/ - MongoDB connection and models
│ └── models/
│ ├── User.ts
│ ├── Product.ts
│ └── ... (all collections)
└── services/ - Business logic
├── ProductService.ts
├── OrderService.ts
└── PaymentService.ts
```

4. \*\*API Route Structure

```markdown
app/api/
├── auth/
│ └── route.ts - Authentication endpoints
├── products/
│ └── route.ts - Product CRUD operations
├── orders/
│ └── route.ts - Order management
└── ... - Other feature endpoints
```

5. \*\*Admin/Seller Specific

```markdown
app/dashboard/
├── admin/
│ ├── analytics/ - Sales/reports
│ └── moderation/ - Content approval
├── seller/
│ ├── products/ - Product management
│ └── orders/ - Order fulfillment
└── buyer/
├── profile/ - User settings
└── history/ - Order history
```

This structure supports:

- Role-based access control
- Scalable API routes
- Reusable component architecture
- Type-safe database operations
- Efficient state management
- Easy feature expansion

### **🔹 8. Sellers Collection (`operator`)**

Stores seller details and performance metrics.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",  // Reference to users
  "Operator Name": "Lak Nuwan",
  "Address": "address",
  "Phone Number" : "Number",
  "Operator Bank Account": " Bank Account",
  "proceed orders": ["orderId1", "orderId2"],
  "rating": 4.5,
  "createdAt": "2025-02-13T10:00:00Z"m
}

```

---

### **🔹 9. Categories Collection (`categories`)**

Stores product categories for filtering.

```json
{
  "_id": "ObjectId",
  "name": "Handmade Gifts",
  "description": "Unique handmade gifts from Sri Lanka",
  "createdAt": "2025-02-13T10:00:00Z"
}
```

---

### **🔹 10. Coupons Collection (`coupons`)**

Stores discount coupons for users.

```json
{
  "_id": "ObjectId",
  "code": "NEWYEAR50",
  "discount": 50, // 50% discount
  "Max amount": "2500",
  "validUntil": "2025-12-31T23:59:59Z",
  "createdAt": "2025-02-13T10:00:00Z"
}
```

---

### **🔹 11. Notifications Collection (`notifications`)**

Stores system notifications for users.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "message": "Your order has been shipped!",
  "status": "Unread", // Unread, Read
  "createdAt": "2025-02-13T10:00:00Z"
}
```

---

### **🔹 12. Shipping Collection (`shipping`)**

Stores shipping details for orders.

```json
{
  "_id": "ObjectId",
  "shipping_type": "method", //Priority , Standard , Economy
  "orderId": "ObjectId",
  "trackingNumber": "TRACK12345",
  "carrier": "DHL",
  "estimatedDelivery": "2025-02-20",
  "status": "In Transit",
  "createdAt": "2025-02-13T10:00:00Z"
}
```

---

### **🔹 13. Reports Collection (`reports`)**

Stores reported issues for admin review.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "orderId": "OrderId",
  "reportedUserId": "ObjectId",
  "reason": "Fake product listing",
  "status": "Pending", // Pending, Resolved
  "createdAt": "2025-02-13T10:00:00Z"
}
```

---

## **📌 Summary of Collections**

| Collection      | Purpose                             |
| --------------- | ----------------------------------- |
| `users`         | Stores all user details             |
| `products`      | Stores product listings             |
| `orders`        | Stores order details                |
| `reviews`       | Stores product reviews & ratings    |
| `carts`         | Stores shopping cart items          |
| `payments`      | Stores payment transactions         |
| `messages`      | Stores chatbot interactions         |
| `operators`     | Stores seller details & performance |
| `categories`    | Stores product categories           |
| `coupons`       | Stores discount codes               |
| `notifications` | Stores system notifications         |
| `shipping`      | Stores shipping details             |
| `reports`       | Stores user-reported issues         |

---

### **Collections and Fields**

### **cart**

- `_id` (ObjectId)
- `items` (Array)
- `createdAt` (Date)
- `cartTotal` (Double)
- `lastUpdated` (Date)
- `userId` (ObjectId)
- `itemCount` (Int)

### **order**

- `_id` (ObjectId)
- `applied_coupon` (Object)
- `shipping_method` (String)
- `status` (String)
- `shipping_address` (Object)
- `receiver_details` (Object)
- `totalPrice` (Double)
- `shipping_charges` (Double)
- `updatedAt` (Date)
- `paymentMethod` (String)
- `customer_message` (String)
- `transactionId` (String)
- `userId` (ObjectId)
- `order_summary` (Object)
- `products` (Array)
- `createdAt` (Date)

### **notification**

- `_id` (ObjectId)
- `metadata` (Object)
- `priority` (String)
- `message` (String)
- `status` (String)
- `title` (String)
- `userId` (ObjectId)
- `actionUrl` (String)
- `updatedAt` (Date)
- `type` (String)
- `createdAt` (Date)
- `expiresAt` (Date)
- `readAt` (Null)
- `icon` (String)
- `data` (Object)

### **payment**

- `_id` (ObjectId)
- `paymentDetails` (Object)
- `orderId` (ObjectId)
- `createdAt` (Date)
- `refundStatus` (Null)
- `billingAddress` (Object)
- `refundAmount` (Int)
- `currency` (String)
- `userId` (ObjectId)
- `amount` (Double)
- `paymentMethod` (String)
- `transactionId` (String)
- `updatedAt` (Date)
- `metadata` (Object)
- `status` (String)

### **product**

- `_id` (ObjectId)
- `rating` (Array)
- `shipping_weight` (String)
- `price` (Double)
- `images` (Array)
- `description` (String)
- `reviews` (Array)
- `category` (String)
- `discount` (Int)
- `OperatorId` (ObjectId)
- `categoryId` (ObjectId)
- `updatedAt` (Date)
- `createdAt` (Date)
- `name` (String)
- `stock` (Int)

### **coupons**

- `_id` (ObjectId)
- `minPurchaseAmount` (Int)
- `validUntil` (Date)
- `description` (String)
- `discountType` (String)
- `code` (String)
- `status` (String)
- `terms` (Array)
- `applicableProducts` (Array)
- `discountValue` (Int)
- `metadata` (Object)
- `usageCount` (Int)
- `createdAt` (Date)
- `usageLimit` (Object)
- `excludedProducts` (Array)
- `updatedAt` (Date)
- `maxDiscountAmount` (Int)
- `applicableCategories` (Array)
- `validFrom` (Date)

### **category**

- `_id` (ObjectId)
- `subCategories` (Array)
- `name` (String)
- `description` (String)
- `updatedAt` (Date)
- `slug` (String)
- `parentCategory` (Null)
- `isActive` (Bool)
- `image` (String)
- `metadata` (Object)
- `displayOrder` (Int)
- `productCount` (Int)
- `createdAt` (Date)

### **report**

- `_id` (ObjectId)
- `status` (String)
- `reason` (String)
- `priority` (String)
- `metadata` (Object)
- `relatedData` (Object)
- `statusHistory` (Array)
- `evidence` (Object)
- `reportedUserId` (ObjectId)
- `description` (String)
- `type` (String)
- `updatedAt` (Date)
- `communicationHistory` (Array)
- `userId` (ObjectId)
- `resolution` (Object)
- `createdAt` (Date)
- `adminNotes` (Array)
- `orderId` (ObjectId)

### **users**

- `_id` (ObjectId)
- `password` (String)
- `wishlist` (Array)
- `orderlist` (Array)
- `updatedAt` (Date)
- `address` (Object)
- `profilePicture` (String)
- `name` (String)
- `role` (String)
- `createdAt` (Date)
- `email` (String)
- `mobile_number` (String)
- `favourite` (Array)

### **chat**

- `_id` (ObjectId)
- `createdAt` (Date)
- `updatedAt` (Date)
- `participants` (Array)
- `messages` (Array)
- `relatedData` (Object)
- `chatId` (String)
- `attachments` (Array)
- `metadata` (Object)
- `settings` (Object)
- `userId` (ObjectId)
- `status` (String)

### **operator**

- `_id` (ObjectId)
- `status` (String)
- `createdAt` (Date)
- `updatedAt` (Date)
- `operatorName` (String)
- `bankAccount` (Object)
- `processedOrders` (Array)
- `verificationStatus` (String)
- `totalSales` (Double)
- `rating` (Double)
- `userId` (ObjectId)
- `phoneNumber` (String)
- `address` (Object)

### **shipping**

- `_id` (ObjectId)
- `issues` (Array)
- `carrier` (Object)
- `shippingAddress` (Object)
- `updatedAt` (Date)
- `createdAt` (Date)
- `orderId` (ObjectId)
- `estimatedDelivery` (Date)
- `specialInstructions` (String)
- `signature` (Object)
- `trackingNumber` (String)
- `metadata` (Object)
- `actualDelivery` (Null)
- `status` (String)
- `shippingMethod` (Object)
- `packageDetails` (Object)
- `statusHistory` (Array)

### **review**

- `_id` (ObjectId)
- `updatedAt` (Date)
- `orderId` (ObjectId)
- `productId` (ObjectId)
- `userId` (ObjectId)
- `photos` (Array)
- `verified_purchase` (Bool)
- `rating` (Int)
- `helpful_votes` (Int)
- `comment` (String)
- `createdAt` (Date)

### **admin**

- `_id` (ObjectId)
- `status` (String)
- `createdAt` (Date)
- `updatedAt` (Date)
- `adminName` (String)
- `bankAccount` (Object)
- `processedOrders` (Array)
- `verificationStatus` (String)
- `totalSales` (Double)
- `rating` (Double)
- `userId` (ObjectId)
- `phoneNumber` (String)
- `address` (Object)

````

## 🔹 Phase 3: Backend API Routes

### Core Endpoints

| Method | Route                  | Description            | Access        |
| ------ | ---------------------- | ---------------------- | ------------- |
| POST   | /api/auth/register     | User registration      | Public        |
| POST   | /api/auth/login        | JWT authentication     | Public        |
| GET    | /api/products          | Get paginated products | Public        |
| POST   | /api/products          | Create new product     | Operator      |
| PUT    | /api/orders/:id/status | Update order status    | Admin         |
| POST   | /api/chatbot/ask       | AI chatbot endpoint    | Authenticated |

**Full API Documentation:**

```markdown
## **1. Authentication & User Management (`/api/auth/`)**

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user (Buyer, Seller, Admin) |
| `POST` | `/api/auth/login` | Authenticate user and return JWT token |
| `POST` | `/api/auth/logout` | Logout user and clear session |
| `GET` | `/api/auth/me` | Get logged-in user details |
| `POST` | `/api/auth/reset-password` | Send password reset email |
| `POST` | `/api/auth/change-password` | Change user password |

---

## **🔹 2. User Routes (`/api/users/`)**

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/users` | Get all users (Admin only) |
| `GET` | `/api/users/:id` | Get user details by ID |
| `PUT` | `/api/users/:id` | Update user profile |
| `DELETE` | `/api/users/:id` | Delete a user (Admin only) |

---

## **🔹 3. Product Routes (`/api/products/`)**

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products/:id` | Get product details by ID |
| `POST` | `/api/products` | Add a new product (Seller only) |
| `PUT` | `/api/products/:id` | Update a product (Seller/Admin only) |
| `DELETE` | `/api/products/:id` | Delete a product (Seller/Admin only) |

---

## **🔹 4. Category Routes (`/api/categories/`)**

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/categories` | Get all categories |
| `POST` | `/api/categories` | Add a new category (Admin only) |
| `PUT` | `/api/categories/:id` | Update category details (Admin only) |
| `DELETE` | `/api/categories/:id` | Delete a category (Admin only) |

---

## **🔹 5. Cart Routes (`/api/cart/`)**

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/cart` | Get current user's cart |
| `POST` | `/api/cart/add` | Add a product to the cart |
| `PUT` | `/api/cart/update` | Update cart item quantity |
| `DELETE` | `/api/cart/remove/:id` | Remove a product from the cart |

---

## **🔹 6. Order Routes (`/api/orders/`)**

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/orders` | Get all orders (Admin/Seller only) |
| `GET` | `/api/orders/:id` | Get order details by ID |
| `POST` | `/api/orders` | Place a new order |
| `PUT` | `/api/orders/:id/status` | Update order status (Admin/Seller only) |

---

## **🔹 7. Payment Routes (`/api/payments/`)**

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/payments/checkout` | Process a payment (Stripe, PayPal, etc.) |
| `GET` | `/api/payments/status/:id` | Get payment status |

---

## **🔹 8. Wishlist Routes (`/api/wishlist/`)**

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/wishlist` | Get user's wishlist |
| `POST` | `/api/wishlist/add` | Add a product to wishlist |
| `DELETE` | `/api/wishlist/remove/:id` | Remove product from wishlist |

---

## **🔹 9. Reviews & Ratings (`/api/reviews/`)**

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/reviews/:productId` | Get all reviews for a product |
| `POST` | `/api/reviews/:productId` | Add a review (Logged-in users only) |
| `DELETE` | `/api/reviews/:id` | Delete a review (Admin only) |

---

## **🔹 10. Seller Routes (`/api/sellers/`)**

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/sellers` | Get all sellers |
| `GET` | `/api/sellers/:id` | Get seller details |
| `GET` | `/api/sellers/:id/products` | Get products by a specific seller |

---

## **🔹 11. Chatbot Routes (`/api/chatbot/`)**

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/chatbot/ask` | Send a question to chatbot |
| `GET` | `/api/chatbot/history` | Get past chatbot conversations |

---

## **🔹 12. Notification Routes (`/api/notifications/`)**

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/notifications` | Get all notifications for the user |
| `PUT` | `/api/notifications/:id/read` | Mark a notification as read |

---

## **🔹 13. Shipping Routes (`/api/shipping/`)**

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/shipping/:orderId` | Get shipping details for an order |
| `POST` | `/api/shipping` | Create a shipping entry (Admin only) |

---

## **🔹 14. Coupon Routes (`/api/coupons/`)**

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/coupons` | Get available discount codes |
| `POST` | `/api/coupons` | Create a new coupon (Admin only) |
| `DELETE` | `/api/coupons/:id` | Delete a coupon (Admin only) |

---

## **🔹 15. Reports & Moderation (`/api/reports/`)**

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/reports` | Get all reported issues (Admin only) |
| `POST` | `/api/reports` | Report a user or product |
| `PUT` | `/api/reports/:id/resolve` | Mark a report as resolved (Admin only) |

---

### **📌 Summary of API Endpoints**

| Section | Routes |
| --- | --- |
| **Authentication** | `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` |
| **Users** | `/api/users`, `/api/users/:id` |
| **Products** | `/api/products`, `/api/products/:id` |
| **Categories** | `/api/categories`, `/api/categories/:id` |
| **Cart** | `/api/cart`, `/api/cart/add`, `/api/cart/update`, `/api/cart/remove/:id` |
| **Orders** | `/api/orders`, `/api/orders/:id`, `/api/orders/:id/status` |
| **Payments** | `/api/payments/checkout`, `/api/payments/status/:id` |
| **Wishlist** | `/api/wishlist`, `/api/wishlist/add`, `/api/wishlist/remove/:id` |
| **Reviews** | `/api/reviews/:productId`, `/api/reviews/:id` |
| **Sellers** | `/api/sellers`, `/api/sellers/:id`, `/api/sellers/:id/products` |
| **Chatbot** | `/api/chatbot/ask`, `/api/chatbot/history` |
| **Notifications** | `/api/notifications`, `/api/notifications/:id/read` |
| **Shipping** | `/api/shipping/:orderId`, `/api/shipping` |
| **Coupons** | `/api/coupons`, `/api/coupons/:id` |
| **Reports** | `/api/reports`, `/api/reports/:id/resolve` |

---


````

## 🔹 Phase 4: Frontend Architecture

### Component Structure

## **🔹 1. Layout Components (`/components/layout/`)**

These are the global layout components used throughout the website.

| Component        | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `Navbar.tsx`     | Top navigation bar with search, cart, and profile options.  |
| `Footer.tsx`     | Website footer with links, contact info, and social media.  |
| `Sidebar.tsx`    | Sidebar for categories, filters, and dashboard navigation.  |
| `Container.tsx`  | A wrapper component to maintain consistent page width.      |
| `Breadcrumb.tsx` | Displays navigation path (e.g., Home > Category > Product). |
| `Loader.tsx`     | A loading spinner for async operations.                     |

---

## **🔹 2. Authentication Components (`/components/auth/`)**

Used for user authentication (login, register, password reset).

| Component                | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| `LoginForm.tsx`          | Login form with email and password fields.           |
| `RegisterForm.tsx`       | Signup form for buyers and sellers.                  |
| `ForgotPasswordForm.tsx` | Form for requesting password reset.                  |
| `ResetPasswordForm.tsx`  | Form to set a new password.                          |
| `AuthProvider.tsx`       | Handles authentication logic and session management. |

---

## **🔹 3. Home Page Components (`/components/home/`)**

The main components of the homepage.

| Component              | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `HeroSection.tsx`      | Large banner with featured products or offers. |
| `CategoryGrid.tsx`     | Grid layout of product categories.             |
| `FeaturedProducts.tsx` | Carousel of featured products.                 |
| `BestSelling.tsx`      | List of best-selling products.                 |
| `LatestArrivals.tsx`   | Section displaying newly added products.       |
| `Testimonials.tsx`     | Customer feedback section.                     |

---

## **🔹 4. Product Components (`/components/products/`)**

Handles product display, filtering, and searching.

| Component             | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `ProductCard.tsx`     | Displays a product with image, title, price, and rating. |
| `ProductList.tsx`     | A grid or list of products.                              |
| `ProductDetails.tsx`  | Detailed page for a specific product.                    |
| `ProductGallery.tsx`  | Image slider for multiple product images.                |
| `AddToCartButton.tsx` | Button to add a product to the cart.                     |
| `ProductReviews.tsx`  | Displays user reviews and ratings.                       |
| `ReviewForm.tsx`      | Form for submitting a review.                            |

---

## **🔹 5. Category & Filter Components (`/components/categories/`)**

Used to display categories and filter products.

| Component              | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| `CategoryCard.tsx`     | Displays a category with an image.                      |
| `CategoryList.tsx`     | List of all product categories.                         |
| `Filters.tsx`          | Allows filtering products by price, brand, rating, etc. |
| `PriceRangeSlider.tsx` | UI component for filtering by price range.              |

---

## **🔹 6. Cart & Checkout Components (`/components/cart/`)**

Handles cart and checkout functionality.

| Component            | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `CartItem.tsx`       | Displays an item in the cart.                        |
| `CartSummary.tsx`    | Displays subtotal, tax, and total amount.            |
| `CartPage.tsx`       | Full cart page with all items.                       |
| `CheckoutForm.tsx`   | Form to enter shipping details.                      |
| `PaymentMethods.tsx` | Displays available payment options (Stripe, PayPal). |

---

## **🔹 7. Orders & Payments (`/components/orders/`)**

Handles order history and payment status.

| Component            | Description                                |
| -------------------- | ------------------------------------------ |
| `OrderCard.tsx`      | Displays a single order summary.           |
| `OrderList.tsx`      | List of all user orders.                   |
| `OrderDetails.tsx`   | Full details of a specific order.          |
| `PaymentSuccess.tsx` | Page displayed after a successful payment. |
| `PaymentFailed.tsx`  | Page displayed when payment fails.         |

---

## **🔹 8. Wishlist Components (`/components/wishlist/`)**

Manages the wishlist functionality.

| Component          | Description                             |
| ------------------ | --------------------------------------- |
| `WishlistItem.tsx` | Displays a single item in the wishlist. |
| `WishlistPage.tsx` | Full wishlist page.                     |

---

## **🔹 9. User Profile & Dashboard (`/components/user/`)**

User account management and dashboard.

| Component                | Description                        |
| ------------------------ | ---------------------------------- |
| `ProfileCard.tsx`        | Displays user profile info.        |
| `EditProfileForm.tsx`    | Form for updating profile details. |
| `AddressBook.tsx`        | Manages saved addresses.           |
| `OrderHistory.tsx`       | Displays past orders.              |
| `ChangePasswordForm.tsx` | Allows users to update passwords.  |

---

## **🔹 10. Seller Dashboard (`/components/seller/`)**

Seller-specific UI components.

| Component            | Description                                   |
| -------------------- | --------------------------------------------- |
| `SellerStats.tsx`    | Displays revenue, orders, and sales stats.    |
| `ProductManager.tsx` | Allows sellers to add/edit/delete products.   |
| `OrderManager.tsx`   | Displays all received orders.                 |
| `EarningsReport.tsx` | Shows seller earnings and withdrawal options. |

---

## **🔹 11. Admin Dashboard (`/components/admin/`)**

Admin panel for managing users, products, and orders.

| Component             | Description                                 |
| --------------------- | ------------------------------------------- |
| `UserManagement.tsx`  | Manage all users (ban, delete, edit roles). |
| `ProductApproval.tsx` | Review and approve seller products.         |
| `OrderTracking.tsx`   | View and manage all orders.                 |
| `Reports.tsx`         | View sales, revenue, and user reports.      |

---

## **🔹 12. Chatbot & Support (`/components/chatbot/`)**

Handles customer support chatbot.

| Component         | Description                      |
| ----------------- | -------------------------------- |
| `Chatbot.tsx`     | AI chatbot for customer support. |
| `ChatInput.tsx`   | Input field for typing messages. |
| `ChatMessage.tsx` | Displays chatbot responses.      |

---

## **🔹 13. Notifications (`/components/notifications/`)**

Handles notifications for users.

| Component              | Description                     |
| ---------------------- | ------------------------------- |
| `NotificationItem.tsx` | Displays a single notification. |
| `NotificationList.tsx` | Shows all notifications.        |

---

## **🔹 14. Utility Components (`/components/ui/`)**

Reusable UI elements across the app.

| Component            | Description                           |
| -------------------- | ------------------------------------- |
| `Button.tsx`         | Generic button with Tailwind styling. |
| `Modal.tsx`          | Reusable modal popup component.       |
| `Toast.tsx`          | Notification pop-ups.                 |
| `Pagination.tsx`     | Pagination controls for long lists.   |
| `Accordion.tsx`      | Expandable/collapsible sections.      |
| `SkeletonLoader.tsx` | Placeholder for loading states.       |

---

## **🔹 15. Pages (`/app/`)**

These are your Next.js pages that use the components above.

| Page                | Description            |
| ------------------- | ---------------------- |
| `/`                 | Home Page              |
| `/login`            | User Login Page        |
| `/register`         | User Registration Page |
| `/products`         | All Products Page      |
| `/product/:id`      | Single Product Page    |
| `/cart`             | Cart Page              |
| `/checkout`         | Checkout Page          |
| `/orders`           | Order History Page     |
| `/wishlist`         | Wishlist Page          |
| `/profile`          | User Profile Page      |
| `/dashboard/seller` | Seller Dashboard       |
| `/dashboard/admin`  | Admin Dashboard        |

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   │   ├── seller/
│   │   └── admin/
│   └── products/
│       └── [id]/
├── components/
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   └── ProductFilters.tsx
│   ├── cart/
│   │   ├── CartSummary.tsx
│   │   └── CheckoutStepper.tsx
│   └── admin/
│       ├── UserManagement.tsx
│       └── SalesReports.tsx
```

## 🔹 Phase 5: User Flows

### **📌 Siyomart: Complete User Flow Guide**

This guide breaks down the **full user journey** through the Siyomart e-commerce platform. Each user type (Guest, Buyer, Seller, and Admin) has specific actions they can take.

---

## **🛍️ 1. Guest User Flow (Not Logged In)**

🔹 **1.1 Landing on the Home Page**

- Views featured products, categories, and offers.
- Can browse product listings.

🔹 **1.2 Searching for a Product**

- Uses the search bar to find products.
- Applies filters (price, category, ratings, etc.).
- Clicks on a product to view details.

🔹 **1.3 Viewing Product Details**

- Sees product images, descriptions, price, and reviews.
- Can check seller information.
- Cannot add to cart or purchase (prompted to log in).

🔹 **1.4 Registering or Logging In**

- Chooses between "Sign Up" or "Login".
- Registers as a **buyer** or **seller** (email, password, OTP verification).
- Redirected to the **dashboard** after successful login.

---

## **🛒 2. Buyer Flow (Logged In Customer)**

🔹 **2.1 Browsing & Adding Products to Cart**

- Searches for a product.
- Clicks **"Add to Cart"**.
- Can adjust quantity from the **Cart Page**.

🔹 **2.2 Wishlist Management**

- Clicks **"Add to Wishlist"** on a product.
- Goes to **Wishlist Page** to view saved items.
- Can remove items from the wishlist.

🔹 **2.3 Proceeding to Checkout**

- Goes to **Cart Page**.
- Clicks **"Proceed to Checkout"**.
- Enters shipping details.
- Selects a **payment method (Card, PayPal, Cash on Delivery, etc.)**.
- Completes the payment.

🔹 **2.4 Order Confirmation & Tracking**

- Receives an order confirmation email.
- Views **Order Details Page** to track status.
- If shipped, can check the **tracking number**.

🔹 **2.5 Writing a Review**

- After delivery, visits **Order History**.
- Clicks **"Write a Review"** on a completed order.
- Submits a review with a rating.

🔹 **2.6 Managing Profile & Addresses**

- Updates **profile details** (name, email, phone).
- Adds/removes **shipping addresses**.
- Changes **password**.

🔹 **2.7 Contacting Support & Using Chatbot**

- Opens the **Chatbot** for FAQs and automated support.
- If needed, submits a **support ticket** for issues.

---

## **🛍️ 3. Seller Flow (Logged In Vendor)**

🔹 **3.1 Registering as a Seller**

- Registers with seller details (store name, business info).
- Waits for **admin approval** before listing products.

🔹 **3.2 Managing Products**

- Goes to **Seller Dashboard**.
- Clicks **"Add Product"** and fills product details (title, description, price, images).
- Submits for **admin approval**.
- Can **edit or delete** existing products.

🔹 **3.3 Managing Orders**

- Receives order notifications.
- Views **pending orders** in **Seller Dashboard**.
- Marks order as **shipped** and adds tracking details.

🔹 **3.4 Viewing Sales & Earnings**

- Checks **total revenue and completed orders**.
- Requests payout (withdraw earnings).

🔹 **3.5 Handling Customer Queries**

- Responds to customer messages.
- Uses chatbot for quick replies.

---

## **🔧 4. Admin Flow (Platform Manager)**

🔹 **4.1 Approving Sellers & Products**

- Reviews new seller registrations.
- Approves or rejects **new product submissions**.

🔹 **4.2 Managing Users & Orders**

- Views all **users (buyers & sellers)**.
- Can **ban or delete** users if needed.
- Tracks **all orders and refunds**.

🔹 **4.3 Handling Payments & Disputes**

- Approves **seller payouts**.
- Reviews **refund requests** and resolves disputes.

🔹 **4.4 Managing Website Content**

- Updates homepage banners and featured products.
- Sends promotional emails to users.

🔹 **4.5 Monitoring Reports & Analytics**

- Views **sales reports, traffic analytics, and revenue insights**.

---

### **📌 Summary of Key User Flows**

| **User Type** | **Actions**                                                                    |
| ------------- | ------------------------------------------------------------------------------ |
| **Guest**     | Browse, search, view products, register/login.                                 |
| **Buyer**     | Add to cart, checkout, track orders, leave reviews, manage profile.            |
| **Seller**    | List products, manage orders, check earnings, respond to customers.            |
| **Admin**     | Approve sellers, manage products, handle disputes, oversee website operations. |

### Buyer Journey

1. **Product Discovery**

   - Search with filters (price, category, ratings)
   - View product details with 360° images
   - Add to cart/wishlist

2. **Checkout Process**

   - Guest checkout option
   - Multiple payment methods
   - Real-time order tracking

3. **Post-Purchase**
   - Review products with photo uploads
   - Track shipments via integrated logistics
   - Manage returns/refunds

### Operator Flow

1. Product Listing Management
2. Order Fulfillment Tracking
3. Sales Performance Analytics

### Admin Flow

1. User Role Management
2. Financial Reporting
3. System Health Monitoring

## 🔹 Phase 6: Deployment & Security

### Infrastructure

- **Vercel**: SSR frontend + API routes
- **MongoDB Atlas**: Automated backups & scaling
- **Cloudflare**: DDoS protection + CDN

### Security Measures

```markdown
- JWT Authentication with refresh tokens
- Role-based access control (RBAC)
- Stripe PCI-DSS compliant payments
- Regular penetration testing
- HTTPS everywhere enforcement
```

### Monitoring

- Real-time error tracking (Sentry)
- Performance metrics (New Relic)
- Audit logs for admin actions
