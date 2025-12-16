import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3000/graphql";

export async function fetchGraphQL(query: string, variables = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store", // Ensure fresh data for this demo
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("GraphQL Error:", { status: res.status, body: text });
    throw new Error(
      `GraphQL server error: ${res.status}. Make sure your GraphQL backend is running.`
    );
  }

  const json = await res.json();

  if (json.errors) {
    console.error("GraphQL Errors:", json.errors);
    throw new Error(json.errors[0].message);
  }

  return json.data;
}
