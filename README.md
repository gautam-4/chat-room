# Real-time chat room

A real-time chat application built with Socket.IO, PostgreSQL, Next.js and Prisma

## Tech Stack
- Next.js
- Socket.IO
- Prisma
- Turborepo
- PostgreSQL

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/gautam-4/chat-room.git
cd chat-room
```

2. Install dependencies
```bash
yarn install
```

3. Add environment variables
```bash
# In packages/database/.env
DATABASE_URL="postgresql://[user]:[password]@localhost:5432/[dbname]"
```
```bash
# In apps/server/.env
DATABASE_URL="postgresql://[user]:[password]@localhost:5432/[dbname]"
PORT=8000
```
```bash
# In apps/web/.env,local
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000
```

4. Push database schema
```bash
cd packages/database
yarn db:push
```

5. Start development server
```bash
yarn dev
```