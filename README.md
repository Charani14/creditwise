# CreditWise

CreditWise is a simulated credit card and billing manager for a Web Programming Technologies project. Users can manage simulated cards, record purchases and refunds, generate billing statements, record repayments, receive due date and utilization alerts, and view spending reports. Administrators can monitor accounts, cards, and contact messages.

> **Simulation only:** CreditWise does not connect to a bank, process payments, or need real card details. Use fictional last four digits. Never enter a real card number, CVV, PIN, or banking password.

> **Team handoff:** The repository is being assembled in person-wise pull requests. The Person 1 branch contains Person 1’s files and the shared foundation only; the app will remain incomplete until Persons 2 and 3 add their assigned modules.

## Technology

- **Frontend:** React, Vite, React Router, Axios, Recharts
- **Backend:** Node.js, Express, express-validator
- **Database:** MySQL with Sequelize models and associations
- **Authentication:** bcrypt password hashing and JWT in an HTTP-only cookie

The original brief mentions both MongoDB and MySQL. This folder is set up with MySQL and Sequelize, so the finished project uses that relational database. The stack is React + Express + MySQL; it is not technically MERN because MERN uses MongoDB.

## Run locally

### 1. Prepare MySQL and backend configuration

Create a MySQL database, for example `creditwise_db`. Copy `backend/.env.example` to `backend/.env` and fill in the local database credentials and a private JWT secret. Set `DB_PORT` if MySQL is listening on a port other than `3306`. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` if you want the server to create an administrator account at startup. The admin credentials have no built-in default.

### 2. Start the API

```sh
cd backend
npm install
npm run dev
```

The API starts on `http://localhost:5001`, creates or updates its tables with Sequelize, and exposes `GET /api/health` as a health check.

### 3. Start the React app

In a second terminal:

```sh
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` requests to the Express server on port `5001`. Register a user account to use the normal workspace. Sign in with the configured administrator credentials to use the admin workspace.

## Main workflows

1. Register and sign in.
2. Add one or more simulated cards with a limit and billing dates.
3. Record purchases or refunds. Completed transactions update the card balance.
4. Generate a statement for a card and billing month. CreditWise totals completed purchases and refunds in that cycle.
5. Record a full or partial simulated repayment. The statement, remaining amount, and card balance update together.
6. Review reminders, utilization signals, and reports.
7. As an administrator, review users, platform card summaries, and contact enquiries.

Deleting a card also permanently deletes its transactions, statements, and repayments. The confirmation dialog explains this before the request is sent. Repayment amounts and records are retained while the card exists; a note can be corrected.

## Team contribution plan

The React pages are separated by feature so three contributors can work in different files. See [TEAM_CONTRIBUTIONS.md](TEAM_CONTRIBUTIONS.md) for the page and backend file assignments, and [GIT_WORKFLOW.md](GIT_WORKFLOW.md) for the branch, pull request, and shared-file workflow.

## Data model

| Table | Purpose | Relationships |
| --- | --- | --- |
| `users` | User and administrator accounts | One user has many cards, transactions, statements, repayments, and notifications |
| `cards` | Simulated card name, limit, billing days, and outstanding balance | Belongs to a user; has many transactions and statements |
| `transactions` | Purchases and refunds | Belongs to a user and a card |
| `billing_statements` | Monthly amount due, statement date, due date, and remaining balance | Belongs to a user and card; unique per card and billing cycle |
| `repayments` | Simulated repayments against a statement | Belongs to a user, card, and statement |
| `notifications` | Due date and utilization alerts | Belongs to a user and optionally a card |
| `contact_messages` | Public contact form enquiries | Managed by administrators |

Sequelize foreign keys and model validation enforce the core relationships and field rules. Separate tables keep repeating account and card data in one place. A few models also carry `userId` alongside a parent ID so every user-owned query can check ownership directly.

## Security and access control

- Passwords are hashed with bcrypt; registration never accepts a role from the client.
- Login state is maintained by a signed JWT in an HTTP-only cookie. The browser does not persist the token in local storage.
- Express authentication middleware loads the current account and rejects inactive accounts.
- Admin API routes require both authentication and the `admin` role. Frontend route checks only control navigation; backend middleware is the access boundary.
- Card, transaction, statement, repayment, and notification queries are scoped to the current user. Repayment creation also verifies the selected statement/card relationship.
- Input validation is applied in React forms, Express routes, and Sequelize models.

## API areas

- `/api/auth` — register, login, logout, current user, profile
- `/api/cards` — card CRUD
- `/api/transactions` — transaction CRUD
- `/api/billing` — list statements and generate a billing cycle
- `/api/repayments` — record a repayment, view history, correct its note
- `/api/notifications` — list, mark read, and delete alerts; refreshes alerts on load
- `/api/reports` — monthly spending, category totals, and card utilization
- `/api/contact` — public contact form
- `/api/admin` — admin-only stats, users, cards, and contact message management

## Project explanation / demonstration outline

Use this as a speaking outline when recording the required individual project video:

1. Introduce the problem CreditWise solves and explain that all card and payment data is simulated.
2. Show the React routes and the shared user/admin workspace layout.
3. Explain the Express REST API, JWT cookie authentication, bcrypt hashing, and role middleware.
4. Show the MySQL tables and describe the one-to-many relationships and ownership checks.
5. Register/sign in, add a card, record a purchase, generate a statement, record a partial repayment, and show the updated balance and report.
6. Show a due date or utilization alert, then demonstrate an admin account list and contact message status update.
7. Explain that card utilization is outstanding divided by credit limit, and that a repayment reduces the statement balance and simulated card outstanding.

Add your own name/team details and record the video individually as required by your evaluator.
