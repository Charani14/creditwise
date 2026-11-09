# CreditWise: beginner team guide

This guide splits the project into the three areas from the project plan. The labels “Person 1”, “Person 2”, and “Person 3” are placeholders; replace them with your team members’ real names before submitting.

For Git branches, pull requests, and shared-file coordination, follow [GIT_WORKFLOW.md](GIT_WORKFLOW.md).

## Person 1: cards, utilization, About, and Contact

**Assigned modules:**

1. Credit Card Management
2. Credit Utilization Tracking

**Assigned pages:** About Us and Contact Us.

**Main files:**

- `frontend/src/pages/CardsPage.jsx` — add, edit, and delete a simulated card.
- `frontend/src/pages/About.jsx` and `frontend/src/pages/Contact.jsx` — project information and the contact form.
- `backend/routes/cardRoutes.js` and `backend/controllers/cardController.js` — card API endpoints and their actions.
- `backend/models/Card.js` and `backend/utils/calculations.js` — card fields and credit calculations.
- `backend/routes/contactRoutes.js` and `backend/controllers/contactController.js` — save a contact enquiry.
- `backend/models/ContactMessage.js` — fields stored for an enquiry.

## Person 2: billing, repayments, and Home

**Assigned modules:**

3. Billing Cycle Management
4. Repayment Management

**Assigned page:** Home.

**Main files:**

- `frontend/src/pages/Home.jsx` — public introduction and links to sign in or register.
- `frontend/src/pages/TransactionsPage.jsx` — record purchases and refunds used to calculate a bill.
- `frontend/src/pages/BillingPage.jsx` — generate and view monthly statements.
- `frontend/src/pages/RepaymentsPage.jsx` — record and review simulated repayments.
- `backend/routes/transactionRoutes.js` and `backend/controllers/transactionController.js` — transaction API.
- `backend/routes/billingRoutes.js` and `backend/controllers/billingController.js` — statement API and billing calculations.
- `backend/routes/repaymentRoutes.js` and `backend/controllers/repaymentController.js` — repayment API and balance updates.
- `backend/models/Transaction.js`, `backend/models/BillingStatement.js`, and `backend/models/Repayment.js` — saved records for these workflows.

## Person 3: alerts, reports, and account pages

**Assigned modules:**

5. Alert & Notification System
6. Reports & Analytics

**Assigned pages:** Login and Registration.

**Main files:**

- `frontend/src/pages/NotificationsPage.jsx` and `frontend/src/pages/ReportsPage.jsx` — show alerts and charts.
- `frontend/src/pages/Login.jsx` and `frontend/src/pages/Register.jsx` — sign-in and account creation forms.
- `frontend/src/pages/ProfilePage.jsx` — supporting account settings page.
- `frontend/src/pages/AdminPages.jsx` — administrator pages, including contact message review.
- `backend/routes/notificationRoutes.js` and `backend/controllers/notificationController.js` — notification API.
- `backend/jobs/alertJob.js` — scheduled alert work.
- `backend/routes/reportRoutes.js` and `backend/controllers/reportController.js` — report data for the charts.
- `backend/routes/authRoutes.js` and `backend/controllers/authController.js` — registration and login support.
- `backend/models/Notification.js` and `backend/models/User.js` — saved alerts and user accounts.

## Files to coordinate together

These files connect the features. Agree on changes before editing them so one contributor does not accidentally break another contributor’s pages.

- `frontend/src/App.jsx` connects pages to browser URLs.
- `frontend/src/pages/Dashboard.jsx` combines cards, activity, bills, and alerts, so all three contributors should coordinate changes to it.
- `frontend/src/components/AppShell.jsx`, `Sidebar.jsx`, and `ui.jsx` provide shared layouts and controls.
- `frontend/src/context/AuthContext.jsx` shares the signed-in user across React pages.
- `frontend/src/services/api.js` configures browser requests to the API.
- `frontend/src/pages/userPageHelpers.jsx` contains shared card display, form buttons, and list-loading code.
- `backend/server.js` connects API routes and starts Express.
- `backend/config/db.js` connects Sequelize to MySQL.
- `backend/models/index.js` connects database models to each other.
- `backend/middleware/` contains shared login and role checks.

The pages are separate files now. `frontend/src/pages/UserPages.jsx` is only a small compatibility file that re-exports those pages; make feature changes in the matching page file above.

## How one feature request moves through the project

For example, when a user adds a card:

1. The card form in `CardsPage.jsx` reads what the user typed.
2. The form sends the values through `services/api.js` to `POST /api/cards`.
3. `cardRoutes.js` checks the request and sends it to `cardController.js`.
4. The controller creates a `Card` record using the Sequelize model.
5. Sequelize saves the record in MySQL and Express sends a response back.
6. The React page reloads the card list and shows the new card.

The other features follow the same pattern: a React page calls an API route, an Express controller applies the rules, and a Sequelize model reads or writes MySQL data.

## A simple way to work as a team

1. Each person starts with the files listed in their section.
2. Before editing a shared file, agree on the change and choose one person to make it.
3. Keep API names and database field names consistent with the existing routes and models.
4. When a feature is ready, explain its form, API route, controller, and database model to the other two people.
5. Replace the placeholder person labels on the About page with the actual names.

Use clear variable names and short comments to explain why a step is needed. Keep the existing validation and access checks when changing a feature. Do not enter real bank or card information in this simulation.
