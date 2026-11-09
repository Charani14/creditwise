# CreditWise Git and pull request guide

This guide explains how three people can work on CreditWise using GitHub branches and pull requests. The names Person 1, Person 2, and Person 3 match `TEAM_CONTRIBUTIONS.md`; replace them with your team members’ names when you know them.

## How the team will work

- `main` is the shared, working version of the project. Do not commit directly to it.
- Each person works on their own branch and pushes that branch to GitHub.
- Each person opens a pull request (PR) from their branch into `main`.
- Person 1 is the suggested GitHub repository owner and integration person. They review and merge the PRs, and coordinate changes to shared files. The team can choose another person, but choose one integration owner.
- After a PR is merged, **all three people** update their local `main` with `git pull`. The integration person is the one who reviews and merges PRs; they are not the only person who pulls updates.

## Current repository setup

The GitHub repository is [Charani14/creditwise](https://github.com/Charani14/creditwise). Its first `main` commit contains the shared project documents and `.gitignore`. The Person 1 branch contains Person 1’s features and the shared source foundation. It is intentionally incomplete until Persons 2 and 3 add their modules.

Person 1 is the suggested integration owner. Invite Person 2 and Person 3 as collaborators in GitHub’s **Settings → Collaborators** page so they can push branches and open PRs.

The other two people should clone the repository into their own computers:

```sh
git clone https://github.com/Charani14/creditwise.git
cd creditwise
```

Each person should work from their own clone, not edit one shared working folder. Set your Git commit name and email once on your computer so GitHub can identify your commits:

```sh
git config --global user.name "Your Name"
git config --global user.email "email-used-with-github@example.com"
```

## Branch assignments

Create one branch per person. Use the current contribution map in `TEAM_CONTRIBUTIONS.md`.

| Person | Suggested branch | Main contribution files |
| --- | --- | --- |
| Person 1 | `feature/person-1-cards-contact` | `CardsPage.jsx`, `About.jsx`, `Contact.jsx`; card and contact routes, controllers, models, and calculations |
| Person 2 | `feature/person-2-billing-repayments` | `Home.jsx`, `TransactionsPage.jsx`, `BillingPage.jsx`, `RepaymentsPage.jsx`; transaction, billing, and repayment routes, controllers, and models |
| Person 3 | `feature/person-3-alerts-reports-auth` | `NotificationsPage.jsx`, `ReportsPage.jsx`, `Login.jsx`, `Register.jsx`, `ProfilePage.jsx`, `AdminPages.jsx`; notification, report, authentication, and admin routes/controllers/models, plus `alertJob.js` |

Start a branch from the latest `main` like this (use your own branch name):

```sh
git switch main
git pull --ff-only origin main
git switch -c feature/person-1-cards-contact
```

Only edit your assigned feature files without coordinating first. If your feature needs a shared-file change, tell the integration owner and agree on who will make that change.

## Commit and push your work

After making a small, complete change, check which files changed:

```sh
git status
git diff
```

Stage only your work, then commit and push your branch. For example:

```sh
git add frontend/src/pages/CardsPage.jsx backend/controllers/cardController.js
git commit -m "feat: improve card management"
git push -u origin feature/person-1-cards-contact
```

Use a short commit message that says what changed. Make more than one commit if that makes your work easier to review.

## Open a pull request on GitHub

After pushing your branch:

1. Open the repository on GitHub.
2. Choose **Compare & pull request** (or **New pull request**).
3. Set the base branch to `main` and compare it with your feature branch.
4. Give the PR a clear title, such as `Person 1: card management and contact pages`.
5. In the description, summarize what changed, list the main files, and say how the reviewer can view the feature.
6. Assign another team member to review it. Person 1, as integration owner, handles the final review and clicks **Merge pull request** after any requested changes are addressed.

Do not merge a PR that has unresolved conflicts or includes another person’s unfinished work. Person 1 should merge one PR at a time and check the result before merging the next.

## Recommended merge order

Merge in this order because later work uses earlier features:

1. **Person 1:** cards and utilization, plus About and Contact pages.
2. **Person 2:** transactions, billing statements, and repayments.
3. **Person 3:** alerts, reports, authentication, and admin pages.

Before opening a PR, bring the latest `main` into your feature branch. For beginners, merging is the simpler option:

```sh
git switch feature/person-2-billing-repayments
git fetch origin
git merge origin/main
```

If Git reports a conflict, stop and coordinate with Person 1. Open the files with conflict markers (`<<<<<<<`, `=======`, and `>>>>>>>`), agree which changes to keep, remove the markers, then save and commit the resolved files. Push the branch again so the PR updates.

## Shared files: one person coordinates each change

These files connect several features and should not be edited independently by multiple people at the same time. Tell the integration owner before changing them; Person 1 can make the agreed shared-file change and include it in the related PR.

- `frontend/src/App.jsx` — connects pages to routes.
- `frontend/src/pages/Dashboard.jsx` — combines cards, transactions, billing, and alerts.
- `frontend/src/pages/userPageHelpers.jsx` — shared card display, form buttons, and list loading.
- `frontend/src/components/AppShell.jsx`, `Sidebar.jsx`, and `ui.jsx` — shared layout and interface components.
- `frontend/src/context/AuthContext.jsx` and `frontend/src/services/api.js` — shared login state and API setup.
- `backend/server.js` — registers API routes and starts Express.
- `backend/config/db.js` and `backend/models/index.js` — MySQL connection and model relationships.
- `backend/middleware/` — authentication and role checks used by multiple routes.
- Root or frontend/backend `package.json` and lock files — coordinate before adding or updating dependencies.
- `.gitignore`, `.env.example`, and `vite.config.mjs` — shared setup files.

The route and model files for one feature belong to that feature’s person. Changes that register a route in `server.js` or connect models in `models/index.js` are shared integration changes.

## Pull the merged work

After a PR is merged, everyone updates their local `main`:

```sh
git switch main
git pull --ff-only origin main
```

If you are still working on a feature branch, bring in the latest `main` before continuing:

```sh
git switch feature/your-branch-name
git fetch origin
git merge origin/main
```

When finished with a merged branch, it can be deleted locally and on GitHub. Do not use `git push --force` on the shared branches.

## Keep private files out of GitHub

Never commit `backend/.env`, database passwords, JWT secrets, real card information, or `node_modules`. Commit `.env.example` only when it contains placeholder values. If a secret is accidentally pushed, removing the file is not enough: change that secret and tell the integration owner immediately.
