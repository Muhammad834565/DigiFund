"use server";

import { fetchGraphQL } from "@/lib/graphql";
import { cookies } from "next/headers";

export async function getRecommendations(userId?: string) {
  const query = `
    query GetRecommendations($input: RecommendationInput!) {
      getRecommendations(input: $input) {
        id
        name
        description
        price
        stock
        confidence
        reason
      }
    }
  `;

  try {
    let userIdToUse = userId;

    if (!userIdToUse) {
      const cookieStore = await cookies();
      userIdToUse =
        cookieStore.get("userId")?.value ||
        "f790e581-d83f-405f-9b86-59e43a0ceffa";
    }

    const result = await fetchGraphQL(query, {
      input: { userId: userIdToUse, limit: 10 },
    });

    return { success: true, data: result.getRecommendations };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get recommendations";
    return { success: false, error: errorMessage };
  }
}

export async function semanticSearch(searchQuery: string) {
  const query = `
    query SemanticSearch($input: SemanticSearchInput!) {
      semanticSearch(input: $input) {
        id
        name
        description
        price
        stock
        similarityScore
      }
    }
  `;

  try {
    const result = await fetchGraphQL(query, {
      input: { query: searchQuery, limit: 5 },
    });

    return { success: true, data: result.semanticSearch };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to perform semantic search";
    return { success: false, error: errorMessage };
  }
}
