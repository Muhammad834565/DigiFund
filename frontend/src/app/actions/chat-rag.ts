"use server";

import { fetchGraphQL } from "@/lib/graphql";

export async function getRagDataSummary() {
  const query = `
    query GetRagDataSummary {
      getRagDataSummary
    }
  `;

  try {
    const result = await fetchGraphQL(query);
    return { success: true, data: result.getRagDataSummary };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get RAG data summary";
    return { success: false, error: errorMessage };
  }
}

export async function queryWithRag(query: string) {
  const mutation = `
    query QueryWithRag($query: String!) {
      queryWithRag(input: { query: $query }) {
        answer
        sources
        confidenceScore
        followUpSuggestions
      }
    }
  `;

  try {
    const result = await fetchGraphQL(mutation, { query });
    return { success: true, data: result.queryWithRag };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to query with RAG";
    return { success: false, error: errorMessage };
  }
}
