# CreditWise

CreditWise is a web application for organizing simulated credit cards and their activity. Users can manage cards, track balances and billing statements, record repayments, receive reminders, and review spending reports. Administrators can review accounts and contact messages.

> **Simulation only:** CreditWise does not connect to banks or transfer money. Use fictional card details. Never enter a real card number, CVV, PIN, or banking password.

## Features

- **Credit card management:** add, view, update, and delete simulated cards.
- **Credit utilization:** compare outstanding balances with card limits.
- **Billing cycles:** generate monthly statements from recorded purchases and refunds.
- **Repayments:** record simulated full or partial payments against statements.
- **Alerts:** view due-date reminders and high-utilization notifications.
- **Reports and analytics:** review spending and card-utilization charts.
- **Administration:** manage account access, review cards, and update contact-message statuses.
- **Contact form:** save enquiries for administrators to review.

Deleting a card permanently removes its transactions, statements, and repayment records. The app asks for confirmation before deletion. The contact “Reply by email” action opens the administrator’s email app; CreditWise does not send email itself.

## Technology

| Part | Technology | Purpose |
| --- | --- | --- |
| Frontend | React and Vite | Displays pages, forms, and charts in the browser. |
| Routing | React Router | Connects URLs to the correct page. |
| API requests | Axios | Sends requests from React to Express. |
| Backend | Node.js and Express | Handles API routes, validation, and application rules. |
| Database | MySQL and Sequelize | Stores accounts, cards, activity, and contact enquiries. |
| Authentication | bcrypt and JWT cookies | Hashes passwords and maintains signed-in sessions. |

This project uses MySQL with Sequelize. It is not a MERN application because MERN uses MongoDB.

## How the application works

When a user submits a form, the React page sends the data to an Express API route. A controller checks the request and applies the project rules. Sequelize reads or writes the matching MySQL model, and the API returns a response to React.

```text
React page → Axios request → Express route → Controller → Sequelize model → MySQL
```

## Project structure

```text
frontend/
  src/
    components/  Shared layouts and interface elements
    context/     Signed-in user state
    pages/       Application pages
    services/    Axios API setup

backend/
  config/        Database connection
  controllers/   API actions and application rules
  jobs/          Scheduled alert work
  middleware/    Authentication, role, and error handling
  models/        Database table definitions and relationships
  routes/        API URL definitions and validation
  utils/         Shared calculations
```

## Pages

### Public pages

| URL | Page |
| --- | --- |
| `/` | Home |
| `/login` | Login |
| `/register` | Registration |
| `/about` | About CreditWise |
| `/contact` | Contact form |

### User pages

| URL | Page |
| --- | --- |
| `/dashboard` | Balance and activity overview |
| `/cards` | Card management |
| `/transactions` | Purchases and refunds |
| `/billing` | Billing statements |
| `/repayments` | Repayment records |
| `/notifications` | Alerts and reminders |
| `/reports` | Spending and utilization charts |
| `/profile` | Account details |

### Admin pages

| URL | Page |
| --- | --- |
| `/admin` | Application overview |
| `/admin/users` | Manage user access |
| `/admin/cards` | View cards across accounts |
| `/admin/contacts` | Review and update contact messages |

## Run the application

Some modules may still be under team integration. Start the application after the latest integrated branch includes all required frontend pages and backend routes.

### Requirements

- Node.js and npm
- MySQL server
- A MySQL database for CreditWise

### 1. Get the project

Clone the repository and update the integrated `main` branch:

```sh
git clone https://github.com/Charani14/creditwise.git
cd creditwise
git switch main
git pull --ff-only origin main
```

### 2. Configure MySQL and the backend

Create a MySQL database named `creditwise_db`, or choose another name. Copy the example environment file and edit the copy with your local settings:

```sh
cd backend
cp .env.example .env
```

Set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in `backend/.env`. Also set a private `JWT_SECRET`. Do not commit this file; `.gitignore` excludes it from Git.

To create an administrator account at startup, replace the example `ADMIN_EMAIL` and `ADMIN_PASSWORD` values with private credentials. `ADMIN_NAME` is the display name. The API creates the account only if that email is not already in the database. Sign in using the configured email and password. Clear both admin variables if you do not want the API to seed an administrator.

Start the backend:

```sh
npm install
npm run dev
```

The API uses port `5001` by default. Check that it is running at:

```text
http://localhost:5001/api/health
```

### 3. Start the React frontend

Open a second terminal from the project folder:

```sh
cd frontend
npm install
npm run dev
```

Open the application at:

```text
http://localhost:5173
```

Vite forwards requests under `/api` to the backend on port `5001`. If you change the backend port, update the proxy target in `frontend/vite.config.mjs` to match.

## API areas

| Base path | Purpose |
| --- | --- |
| `/api/auth` | Register, log in or out, read the current account, and update a profile. |
| `/api/cards` | Add, view, update, and delete cards. |
| `/api/transactions` | Record and manage purchases and refunds. |
| `/api/billing` | List statements and generate billing cycles. |
| `/api/repayments` | Record and view simulated repayments. |
| `/api/notifications` | View, mark, and delete alerts. |
| `/api/reports` | Get monthly spending, category totals, and utilization data. |
| `/api/contact` | Submit a public contact enquiry. |
| `/api/admin` | Admin-only account, card, statistics, and contact-message actions. |

Most account and card routes require a signed-in user. Admin routes also check the account’s admin role on the backend.

## Data stored

The database uses separate tables for users, cards, transactions, billing statements, repayments, notifications, and contact messages. A user can own multiple cards and related activity. Each card can have transactions and billing statements; repayments are connected to a statement and card.

Sequelize creates or updates the database tables when the backend starts. Do not point this student project at a production database.

## Security and project limits

- Passwords are hashed with bcrypt. Registration cannot choose an admin role.
- Login uses an HTTP-only JWT cookie.
- Backend middleware checks authentication and account roles; frontend route checks alone are not the security boundary.
- User-owned API requests are scoped to the signed-in account.
- The application does not connect to financial institutions or process payments.
- Contact replies open a local email application; the server does not send email.
- Never commit `.env` files, passwords, JWT secrets, `node_modules`, or real financial information.



## Build and tests

Create a frontend production build with:

```sh
cd frontend
npm run build
```

Automated test suites have not been added yet; the current `npm test` scripts are placeholders.
