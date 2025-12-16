// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";
import { onError } from "@apollo/client/link/error";

// Define your endpoints
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3000/graphql",
  credentials: "include",
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }: any) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }: any) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );

      // Check for authentication errors
      if (
        message?.toLowerCase().includes("unauthorized") ||
        message?.toLowerCase().includes("unauthenticated") ||
        message?.toLowerCase().includes("not authenticated") ||
        extensions?.code === "UNAUTHENTICATED" ||
        extensions?.code === "UNAUTHORIZED"
      ) {
        // Clear invalid tokens
        if (typeof window !== "undefined") {
          Cookies.remove("token");
          Cookies.remove("access_token");
          Cookies.remove("client_token"); // Clear client-accessible token
          Cookies.remove("public_id");
          Cookies.remove("private_id");
          Cookies.remove("user_id");
          Cookies.remove("user_role");

          // Redirect to login
          window.location.href = "/login";
        }
      }
    });
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);

    // Check for 401 status code
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      if (typeof window !== "undefined") {
        Cookies.remove("token");
        Cookies.remove("access_token");
        Cookies.remove("client_token"); // Clear client-accessible token
        Cookies.remove("public_id");
        Cookies.remove("private_id");
        Cookies.remove("user_id");
        Cookies.remove("user_role");

        window.location.href = "/login";
      }
    }
  }
});

// 1. WebSocket Link (for Subscriptions) - only in browser
let wsLink: GraphQLWsLink | null = null;
if (typeof window !== "undefined") {
  try {
    wsLink = new GraphQLWsLink(
      createClient({
        url:
          process.env.NEXT_PUBLIC_GRAPHQL_WS_URL ||
          "ws://localhost:3000/graphql",
        connectionParams: () => {
          return {
            authToken: Cookies.get("token"),
          };
        },
        retryAttempts: 3,
        shouldRetry: () => true,
        on: {
          error: (error) => {
            console.warn("WebSocket error:", error);
          },
        },
      })
    );
  } catch (error) {
    console.warn("Failed to create WebSocket link:", error);
  }
}

// 2. Auth Link (for HTTP Queries/Mutations)
const authLink = setContext((_, { headers }) => {
  // Read from client-accessible cookie (non-httpOnly)
  const token = Cookies.get("client_token");

  if (token) {
    console.log("🔐 Apollo Client: Token found, adding Authorization header");
  } else {
    console.warn("⚠️ Apollo Client: No token found in cookies");
  }

  return {
    headers: {
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
});

// 3. Split Link - only use WebSocket if available
const link = wsLink
  ? split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    authLink.concat(httpLink)
  )
  : authLink.concat(httpLink);

// 4. Initialize Apollo Client
export const apolloClient = new ApolloClient({
  link: errorLink.concat(link),
  cache: new InMemoryCache(),
  ssrMode: typeof window === "undefined",
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
  },
});
