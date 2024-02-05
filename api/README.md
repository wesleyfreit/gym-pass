## 💻 Project

### 📖 Title
**@gym-pass/api**

### 📝 Description
**The Gym Pass App API**

## 🚀 Quick Start

**Requirements: Node >=18, Docker**

---

**1. Install the project dependencies.**

**2. Set environment variables based on .env.example.**

**3. Run the server based on commands section.**

## ⌨️ Commands

**Run the install dependencies command:**

```bash
pnpm i
```

**Run the docker command that creates the postgresql container:**

```bash
docker compose up -d
```

**Run the development server command:**

```bash
pnpm run dev
```

**Run the test command:**

```bash
pnpm test
```

**Run the build command:**

```bash
pnpm run build
```

**Run the builded server command:**

```bash
pnpm start
```

**Run the linter code command:**

```bash
pnpm run lint
```

**Other docker compose commands:**

```bash
docker compose stop # stop the containers
docker compose down # delete the containers
```

## 📝 Requirements

### 🛠️ Functional Requirements

- ▶️ It must be possible to register a user

- ▶️ It must be possible to authenticate a user

- ▶️ It must be possible to obtain the authenticated user profile

- ▶️ It must be possible to obtain the number of check-ins performed by the authenticated user

- ▶️ It must be possible to for the authenticated user to obtain check-in history

- ▶️ It must be possible to for the authenticated user to search for nearby gyms

- ▶️ It must be possible to for the authenticated user to search for gyms by name 

- ▶️ It must be possible to for the authenticated user to check-in to a gym 

- ▶️ It must be possible to validate a user's check-in

- ▶️ It must be possible to register a gym

### 📚 Business Rules

- ▶️ The user cannot register with a duplicate email

- ▶️ The user cannot check-in twice on the same day

- ▶️ The user will not be able to check-in if they are'nt close to the gym (100m)

- ▶️ The check-in can only be validated up to 20 minutes after it is created

- ▶️ The check-in can only be validated by admins

- ▶️ The gym can only registred by admins

### 🛠️ Non-Functional Requirements

- ▶️ The user password must be encrypted

- ▶️ The application data must be persisted in a PostgreSQL database

- ▶️ Every data list must be paginated with 20 items per page

- ▶️ The user must be identified by a JWT (JSON Web Token)