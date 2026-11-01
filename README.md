# Amanah

Amanah is an association management website under active development. It brings together a React interface, a Node.js API, Firebase Authentication and MongoDB member records. The long-term goal is to support membership, contribution tracking, payment confirmation and financial reporting.

## Status

Personal portfolio project — in development.

The supplied backend code confirms MongoDB connectivity, Firebase Admin configuration, member-context retrieval and an administrator bootstrap script. The repository also contains membership, authentication and dashboard interfaces. Their complete end-to-end behaviour has not been verified for this README. Contribution accounting, payment verification, reporting and automated tests remain work to complete or verify; interface presence does not establish backend functionality.

## Technology

| Area | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Tailwind CSS, DaisyUI |
| Interface utilities | Lucide React, SweetAlert2 |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Identity | Firebase client SDK, Firebase Admin SDK |
| Configured middleware | Helmet, CORS, JSON request body limit |

The backend package also lists bcrypt, cookie-parser, express-rate-limit and jsonwebtoken. Installed packages alone do not establish that their corresponding features are enabled. The supplied server uses Helmet, a configured client origin and a 20 KB JSON body limit. Firebase client SDK is currently declared in the root package.json; install root dependencies as well as frontend and backend dependencies.

Tableau has been used for data visualisation separately. It is not a JavaScript dependency, and an embedded Tableau dashboard has not been verified in this application.

## Structure

- backend/config: Firebase Admin configuration.
- backend/middleware: Firebase and member access middleware.
- backend/models: Mongoose data models.
- backend/routes: Membership API routes.
- backend/scripts: Administrator bootstrap.
- frontend/src: Pages, layouts, authentication and dashboard interfaces.
- backend/.env.example: Local configuration template without secrets.

## Local setup

Use Node.js and npm versions compatible with the installed Vite and Mongoose versions and the package lockfiles. MongoDB and a Firebase project are required. A supported Node.js version must also support node --watch.

### Install dependencies

```powershell
git clone https://github.com/HeymatUddin/amanah.git
cd amanah
npm ci
cd backend
npm ci
cd ..\frontend
npm ci
cd ..
```

These commands assume the committed package-lock.json files match their package.json files.

### Configure MongoDB

Use a local MongoDB instance or an Atlas development cluster. For Atlas, configure a database user and network access for your development machine. Keep its connection string private.

From the repository root:

```powershell
Copy-Item backend/.env.example backend/.env
```

Edit backend/.env with your own MONGODB_URI. The supplied server and admin script explicitly use the database name amanah, regardless of the database path in the URI. Mongoose initialises the User model indexes through User.init(). No SQL import is needed. Run commands from backend so the server loads backend/.env as intended.

| Variable | Used for |
|---|---|
| MONGODB_URI | Required MongoDB connection string |
| PORT | API port; default 5000 |
| CLIENT_ORIGIN | Allowed frontend origin; default http://localhost:5173 |
| ADMIN_FIREBASE_UID | Firebase user UID for the bootstrap script |
| ADMIN_FIRST_NAME | Administrator first name for bootstrap |
| ADMIN_LAST_NAME | Administrator last name for bootstrap |

### Configure Firebase

Create a Firebase project for development and register a web application. Configure the Authentication sign-in providers used by the frontend; the supplied configuration file alone does not identify which providers the login implementation needs.

Copy your own web-app configuration values into frontend/src/lib/firebase.js using valid JavaScript strings. The fields are apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId and measurementId if used. The redacted example shared during documentation is not valid runnable JavaScript until values are supplied.

Place the private Firebase Admin service-account credentials for the same project at:

```text
backend/firebase-service-account.json
```

The backend currently requires this exact local filename through config/firebase.js. Do not commit the service-account file, backend/.env, database exports or private member records. Firebase web configuration is separate from private Admin credentials and must never contain the service-account private key.

### Create the first administrator

First create an enabled user in Firebase Authentication, with an email and an appropriate configured sign-in method. Copy its Firebase UID into ADMIN_FIREBASE_UID in backend/.env and set the administrator name fields.

Then, from the repository root:

```powershell
cd backend
node scripts/create-admin.js
```

The script fetches the Firebase user and creates an active MongoDB member with role admin, membership type core and one share. It does not create a Firebase login or assign a password. It stops without changing the account if that UID already exists in MongoDB or another administrator exists. Duplicate email or UID records also prevent creation.

### Start locally

Terminal 1, from the backend directory:

```powershell
npm run dev
```

The backend connects to MongoDB before listening, and binds to 127.0.0.1. Its default URL is http://localhost:5000.

Terminal 2, from the repository root:

```powershell
cd frontend
npm run dev
```

Open the frontend URL printed by Vite. If it differs from http://localhost:5173, update CLIENT_ORIGIN and restart the backend. Confirm that frontend API requests or its Vite proxy point to the correct backend; this configuration was not supplied for verification.

## Verified API entry points

| Path | Behaviour in supplied server |
|---|---|
| GET /api/health | Returns 200 when MongoDB is connected, 503 when disconnected |
| GET /api/auth/me | Uses requireMember and returns selected member fields with Cache-Control: no-store |
| /api/membership | Mounted membership router; inspect routes/membership.js for exact methods and permissions |

The backend exits on an initial database connection failure. It must be running before the health endpoint can be queried.

## Checks

From frontend:

```powershell
npm run lint
npm run build
```

The current backend npm test script is a placeholder that deliberately exits with an error. There is no verified automated test suite yet. No installation, build or live Firebase/MongoDB test was run as part of preparing this documentation.

Suggested manual checks use a separate development database and sample accounts: database health, first admin setup, login, authenticated member lookup, unauthenticated requests, non-member access, membership application validation and admin application review. Check actual outcomes before marking them complete.

## Roadmap

- Complete and verify membership application and approval workflows.
- Implement and test contribution rules, due calculations and payment confirmation review.
- Add financial summaries and data visualisation with an explicit definition for each metric.
- Add automated tests for permissions, validation and contribution calculations.
- Add screenshots and sample-data demonstrations.
- Prepare deployment configuration and review production readiness.

Payment confirmation is distinct from a live payment gateway. A submitted reference must not count as received money until the appropriate verification workflow completes. Public demos and screenshots should use sample data rather than real association member and payment records.

## Author

Muhammad Hamaet Uddin

- GitHub: https://github.com/HeymatUddin
- LinkedIn: https://www.linkedin.com/in/muhammad-hamaet-uddin/
