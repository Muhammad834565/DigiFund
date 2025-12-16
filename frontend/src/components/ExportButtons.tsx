"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet } from "lucide-react";
import { exportData } from "@/app/actions/export";
import { toast } from "sonner";

interface ExportButtonsProps {
  dataType: "products" | "customers" | "invoices";
}

export default function ExportButtons({ dataType }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState<{
    csv: boolean;
    excel: boolean;
  }>({
    csv: false,
    excel: false,
  });

  const handleExport = async (format: "csv" | "excel") => {
    setIsExporting((prev) => ({ ...prev, [format]: true }));

    try {
      const result = await exportData(dataType, format);

      if (result.success && result.data) {
        // Create a download link for the base64 data
        const link = document.createElement("a");
        link.href = result.data.fileUrl;
        link.download = result.data.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(
          `${dataType} exported successfully as ${format.toUpperCase()}`,
          {
            description: `Downloaded ${result.data.recordCount} records`,
          }
        );
      } else {
        toast.error("Export failed", {
          description: result.error || "Unknown error occurred",
        });
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsExporting((prev) => ({ ...prev, [format]: false }));
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport("csv")}
        disabled={isExporting.csv}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        {isExporting.csv ? "Exporting..." : "Export CSV"}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport("excel")}
        disabled={isExporting.excel}
        className="flex items-center gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        {isExporting.excel ? "Exporting..." : "Export Excel"}
      </Button>
    </div>
  );
}
