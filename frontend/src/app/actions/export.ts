"use server";

import { fetchGraphQL } from "@/lib/graphql";

export async function exportData(dataType: string, format: string) {
  const query = `
    query ExportData($input: DataExportInput!) {
      exportData(input: $input) {
        format
        fileName
        fileUrl
        recordCount
      }
    }
  `;

  try {
    const result = await fetchGraphQL(query, {
      input: { dataType, format },
    });

    return { success: true, data: result.exportData };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to export data";
    return { success: false, error: errorMessage };
  }
}
