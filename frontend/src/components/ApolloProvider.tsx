"use client";

import { ApolloProvider as ClientApolloProvider } from "@apollo/client/react";
import { apolloClient } from "@/lib/apollo-client";

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  // Use the installed client to provide the GraphQL context
  return (
    <ClientApolloProvider client={apolloClient}>
      {children}
    </ClientApolloProvider>
  );
}
