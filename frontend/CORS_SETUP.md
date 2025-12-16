# CORS Configuration for GraphQL Server

## Issue

The frontend app runs on `http://localhost:3001` (Next.js dev server) but your GraphQL server is on `http://localhost:3000`. This causes CORS (Cross-Origin Resource Sharing) errors.

## Solution

You need to configure CORS on your GraphQL server to allow requests from `http://localhost:3001`.

### For Express.js with Apollo Server:

```javascript
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");

const app = express();

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3001", // Your Next.js app URL
    credentials: true,
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Your context logic
  },
});

await server.start();
server.applyMiddleware({
  app,
  cors: false, // Disable Apollo's built-in CORS since we're using express cors
});

app.listen(3000, () => {
  console.log("GraphQL server running on http://localhost:3000/graphql");
});
```

### For standalone Apollo Server 4:

```javascript
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 3000 },
  context: async ({ req }) => {
    // Your context logic
  },
  // Add CORS configuration
  cors: {
    origin: "http://localhost:3001",
    credentials: true,
  },
});
```

### For NestJS with GraphQL:

```typescript
// app.module.ts
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      cors: {
        origin: "http://localhost:3001",
        credentials: true,
      },
    }),
  ],
})
export class AppModule {}

// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "http://localhost:3001",
    credentials: true,
  });
  await app.listen(3000);
}
```

## Frontend Changes Already Made

✅ Changed `credentials: "same-origin"` to `credentials: "include"` in Apollo Client
✅ Added `suppressHydrationWarning` to suppress browser extension hydration warnings

## After Server Configuration

Once you've added CORS configuration to your GraphQL server:

1. Restart your GraphQL server
2. Refresh your Next.js app
3. The invoices page should now fetch data successfully
