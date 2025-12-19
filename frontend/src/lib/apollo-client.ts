// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink, split, ApolloLink, Operation, FetchResult, Observable } from "@apollo/client";
// import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
// import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";
import { onError } from "@apollo/client/link/error";
import { SubscriptionClient } from "subscriptions-transport-ws";

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

// Adapter for Legacy Subscriptions (subscriptions-transport-ws) in Apollo Client v4
class LegacyWebSocketLink extends ApolloLink {
  private client: SubscriptionClient;

  constructor(client: SubscriptionClient) {
    super();
    this.client = client;
  }

  public request(operation: Operation): Observable<FetchResult> | null {
    return new Observable<FetchResult>((sink: any) => {
      const source = this.client.request(operation as any);
      const sub = source.subscribe(sink);
      return () => sub.unsubscribe();
    });
  }
}

// 1. WebSocket Link (for Subscriptions) - only in browser
let wsLink: ApolloLink | null = null;

if (typeof window !== "undefined") {
  try {
    // START: Legacy Protocol (subscriptions-transport-ws)
    const legacyClient = new SubscriptionClient(
      process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || "ws://localhost:3000/graphql",
      {
        reconnect: true,
        timeout: 30000,
        connectionParams: () => {
          const token = Cookies.get("client_token");
          console.log("🔌 Legacy WS (subscriptions-transport-ws) Connecting. Token present:", !!token);
          return {
            authToken: token,
            Authorization: token ? `Bearer ${token}` : undefined,
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          };
        },
        connectionCallback: (error) => {
          if (error) {
            console.warn("⚠️ Legacy WS Connection Error:", error);
          } else {
            console.log("✅ Legacy WS Connected!");
          }
        }
      }
    );
    wsLink = new LegacyWebSocketLink(legacyClient);
    // END: Legacy Protocol

    /* 
    // START: Modern Protocol (graphql-ws) - Commented out
    wsLink = new GraphQLWsLink(
      createClient({
        url: process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || "ws://localhost:3000/graphql",
        connectionParams: () => {
          const token = Cookies.get("client_token");
          console.log("🔌 Modern WS Connecting. Token present:", !!token);
          return {
            authToken: token,
            Authorization: token ? `Bearer ${token}` : undefined,
            headers: { Authorization: token ? `Bearer ${token}` : undefined },
          };
        },
        retryAttempts: 5,
        shouldRetry: () => true,
        on: {
          connected: () => console.log("✅ Modern WS Connected"),
          closed: (e) => console.log("❌ Modern WS Closed", e),
          error: (error) => console.warn("⚠️ Modern WS Error:", error),
        },
      })
    );
    // END: Modern Protocol
    */

  } catch (error) {
    console.warn("Failed to create WebSocket link:", error);
  }
}

// 2. Auth Link (for HTTP Queries/Mutations)
const authLink = setContext((_, { headers }) => {
  // Read from client-accessible cookie (non-httpOnly)
  const token = Cookies.get("client_token");

  if (token) {
    // console.log("🔐 Apollo Client: Token found, adding Authorization header");
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
