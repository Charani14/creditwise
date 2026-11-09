# CreditWise

CreditWise is a student web application for organizing simulated credit cards and their activity. Users can track card balances, billing statements, repayments, reminders, and spending reports from one dashboard. Administrators can review accounts and contact messages.

> **Simulation only:** CreditWise does not connect to banks or transfer money. Use fictional card details. Never enter a real card number, CVV, PIN, or banking password.

## Project status

The GitHub repository is being assembled through team pull requests. The `feature/person-1-cards-contact` branch contains Person 1’s card and contact work plus the shared project foundation. Persons 2 and 3 still need to add their assigned modules before the GitHub version is complete and can run. Update this note after their pull requests are merged.

## Features

- **Credit card management:** add, view, update, and delete simulated cards.
- **Credit utilization:** compare outstanding balances with card limits.
- **Billing cycles:** generate monthly statements from recorded purchases and refunds.
- **Repayments:** record simulated full or partial payments against statements.
- **Alerts:** view due-date reminders and high-utilization notifications.
- **Reports and analytics:** review spending and card-utilization charts.
- **Administration:** manage account access, review cards, and process contact-message statuses.
- **Contact form:** save enquiries for administrators to review.

Deleting a card permanently removes its transactions, statements, and repayment records. The app asks for confirmation before deletion. Contact replies open the administrator’s email app; CreditWise does not send email itself.

## Technology

| Part | Technology | What it does |
| --- | --- | --- |
| Frontend | React and Vite | Displays pages, forms, and charts in the browser. |
| Routing | React Router | Connects URLs to the correct page. |
| API requests | Axios | Sends requests from React to Express. |
| Backend | Node.js and Express | Handles API routes, validation, and application rules. |
| Database | MySQL and Sequelize | Stores users, cards, statements, transactions, repayments, notifications, and enquiries. |
| Authentication | bcrypt and JWT cookies | Hashes passwords and maintains signed-in sessions. |

This project uses MySQL with Sequelize. It is not a MERN application because MERN uses MongoDB.

## How the application is organized

When a user submits a form, the React page sends the data to an Express API route. A controller checks the request and applies the project rules. Sequelize reads or writes the matching MySQL model, and the API returns a response to React.

```text
React page → Axios request → Express route → Controller → Sequelize model → MySQL
```

The source folders are organized by responsibility:

```text
frontend/src/pages/       Application pages
frontend/src/components/  Shared layouts and interface elements
frontend/src/context/     Signed-in user state
frontend/src/services/    Axios API setup
backend/routes/           API URL definitions and validation
backend/controllers/      API actions and application rules
backend/models/           Database table definitions and relationships
backend/middleware/       Authentication, role, and error handling
backend/jobs/             Scheduled alert work
```

## Pages

### Public pages

| URL | Page |
| --- | --- |
| `/` | Home |
| `/login` | Login |
| `/register` | Registration |
| `/about` | About CreditWise and the team |
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
| `/admin/contacts` | Review, reply to, and update contact messages |

## Run the application

These instructions describe the complete project. The current GitHub Person 1 branch is intentionally missing Persons 2 and 3’s files; finish and merge those modules before trying to start that branch.

### Requirements

- Node.js and npm
- MySQL server
- A MySQL database for CreditWise

### 1. Get the project

After the Person 1 pull request has been merged, clone the repository and update `main`:

```sh
git clone https://github.com/Charani14/creditwise.git
cd creditwise
git pull --ff-only origin main
```

If you are contributing before the pull request is merged, follow the branch instructions in [GIT_WORKFLOW.md](GIT_WORKFLOW.md).

### 2. Configure MySQL and the backend

Create a MySQL database named `creditwise_db` (or choose another name). Copy the example environment file and edit the copy with your own local settings:

```sh
cd backend
cp .env.example .env
```

Set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`. Also set a private `JWT_SECRET`. Keep `backend/.env` private; `.gitignore` excludes it from Git.

To create an administrator account at startup, replace the example `ADMIN_EMAIL` and `ADMIN_PASSWORD` values in `backend/.env` with private credentials. Set `ADMIN_NAME` to the display name. The API creates this account only if that email is not already in the database. Sign in using the configured email and password. Clear both admin variables if you do not want to seed an administrator.

Start the API:

```sh
npm install
npm run dev
```

The API uses port `5001` by default. Check that it is running at [http://localhost:5001/api/health](http://localhost:5001/api/health).

### 3. Start the React frontend

Open a second terminal from the project folder:

```sh
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite forwards requests under `/api` to the backend on port `5001`. If you change the backend port, update the Vite proxy in `frontend/vite.config.mjs` to match.

## API areas

| Base path | Purpose |
| --- | --- |
| `/api/auth` | Register, log in/out, read the current account, and update a profile. |
| `/api/cards` | Add, view, update, and delete cards. |
| `/api/transactions` | Record and manage purchases and refunds. |
| `/api/billing` | List statements and generate a billing cycle. |
| `/api/repayments` | Record and view simulated repayments. |
| `/api/notifications` | View, mark, and delete alerts. |
| `/api/reports` | Get monthly spending, category totals, and utilization data. |
| `/api/contact` | Submit a public contact enquiry. |
| `/api/admin` | Admin-only user, card, statistics, and contact-message actions. |

Most account and card routes require a signed-in user. Admin routes also check the account’s admin role on the backend.

## Data stored

The database uses separate tables for users, cards, transactions, billing statements, repayments, notifications, and contact messages. A user can own multiple cards and related activity records. Each card can have transactions and billing statements; repayments are attached to a statement and card.

The backend uses Sequelize to create or update tables when it starts. Do not point this student project at a production database.

## Security and project limits

- Passwords are hashed with bcrypt. Registration cannot choose an admin role.
- Login uses an HTTP-only JWT cookie; frontend route checks are not a replacement for backend authorization.
- User-owned API requests are scoped to the signed-in account. Admin routes check the admin role.
- Use only fictional card details. The application does not connect to financial institutions or process payments.
- The contact “Reply by email” action opens a local email application. It does not send a message through the CreditWise server.
- Never commit `.env` files, passwords, JWT secrets, `node_modules`, or real financial information.

## Team contributions and GitHub workflow

The current responsibility split is documented in [TEAM_CONTRIBUTIONS.md](TEAM_CONTRIBUTIONS.md). Branch names, pull requests, merge order, and shared-file coordination are documented in [GIT_WORKFLOW.md](GIT_WORKFLOW.md).

The three assignments are:

1. **Person 1:** card management, utilization, About, and Contact.
2. **Person 2:** billing cycles, repayments, and Home.
3. **Person 3:** alerts, reports, Login, and Registration.

Replace the Person 1/2/3 placeholders with the team members’ names before submitting.

## Build and tests

Create a frontend production build with:

```sh
cd frontend
npm run build
```

Automated test suites have not been added yet; the current `npm test` scripts are placeholders.
