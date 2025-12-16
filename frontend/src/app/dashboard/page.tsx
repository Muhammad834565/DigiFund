"use client";

import {
  Users,
  FileText,
  ShoppingCart,
  DollarSign,
  UserCheck,
  Clock,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LoadingOverlay, LoadingSpinner } from "@/components/LoadingSpinner";
import {
  useGetDashboardStatsQuery,
  useDashboardLiveStatsSubscription,
  useGetInvoicesForChartsQuery,
} from "@/graphql/generated/graphql";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [isPending, startTransition] = useTransition();
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const router = useRouter();

  // Fetch initial dashboard stats
  const { data, loading, error } = useGetDashboardStatsQuery({
    fetchPolicy: "cache-and-network",
  });

  // Fetch invoices for charts
  const {
    data: invoicesData,
    loading: chartsLoading,
    error: chartsError,
  } = useGetInvoicesForChartsQuery({
    fetchPolicy: "cache-and-network",
  });

  // Subscribe to real-time updates
  const { data: subscriptionData } = useDashboardLiveStatsSubscription();

  // Use subscription data if available, otherwise use query data
  const stats = subscriptionData?.dashboardStatsUpdated || data?.dashboardStats;

  // Process invoice data to create last 7 days chart data
  const chartData = useMemo(() => {
    if (!invoicesData?.invoices) return [];

    // Get last 7 days
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    // Group invoices by date for last 7 days
    const dailyStats = last7Days.map((dateStr) => {
      const dayInvoices = (invoicesData.invoices || []).filter((invoice: any) => {
        if (!invoice.created_at) return false;
        try {
          const invoiceDate = new Date(invoice.created_at).toISOString().split("T")[0];
          return invoiceDate === dateStr;
        } catch (e) {
          return false;
        }
      });

      const count = dayInvoices.length;
      const totalAmount = dayInvoices.reduce(
        (sum: number, inv: any) => sum + (inv.total_amount || 0),
        0
      );

      // Format date for display (e.g., "Tue 12/15")
      const dateObj = new Date(dateStr);
      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
      const monthDay = dateObj.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
      });

      return {
        date: `${dayName} ${monthDay}`,
        count,
        totalAmount,
      };
    });

    return dailyStats;
  }, [invoicesData]);

  const handleNavigation = (path: string, cardName: string) => {
    setActiveCard(cardName);
    startTransition(() => {
      router.push(path);
    });
  };

  const setDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(timestamp));
  };

  if (loading && !stats) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getErrorMessage = (err: any) => {
    if (err?.networkError) {
      return {
        title: "Network Connection Error",
        message:
          "Unable to connect to the server. Please check your internet connection and try again.",
        details: err.networkError.message,
      };
    }
    if (err?.graphQLErrors?.length > 0) {
      const gqlError = err.graphQLErrors[0];
      return {
        title: "Server Error",
        message:
          gqlError.message ||
          "An error occurred while fetching data from the server.",
        details: gqlError.extensions?.code || "GRAPHQL_ERROR",
      };
    }
    return {
      title: "Unexpected Error",
      message:
        err?.message ||
        "An unexpected error occurred. Please try refreshing the page.",
      details: "UNKNOWN_ERROR",
    };
  };

  if (error) {
    const errorInfo = getErrorMessage(error);
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  {errorInfo.title}
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-3">
                  {errorInfo.message}
                </p>
                <details className="text-sm">
                  <summary className="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
                    Technical Details
                  </summary>
                  <pre className="mt-2 p-3 bg-red-100 dark:bg-red-950/50 rounded text-xs overflow-x-auto">
                    {errorInfo.details}
                  </pre>
                </details>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Top Loading Indicator */}
      {(loading || chartsLoading) && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-blue-600 dark:bg-blue-500 animate-pulse">
            <div className="h-full bg-blue-400 dark:bg-blue-300 animate-[shimmer_1s_infinite]"></div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-4 py-2">
            <div className="flex items-center justify-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <LoadingSpinner size="sm" />
              <span>Loading data...</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Dashboard</h1>
        {stats?.timestamp && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Last updated: {formatTimestamp(stats.timestamp)}</span>
            {subscriptionData && (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live
              </span>
            )}
          </div>
        )}
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats?.totalRevenue
                  ? formatCurrency(stats.totalRevenue)
                  : "$0.00"}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div
          onClick={() => handleNavigation("/dashboard/customers", "customers")}
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all cursor-pointer hover:scale-105 relative"
        >
          {isPending && activeCard === "customers" && (
            <LoadingOverlay className="bg-blue-50/80 dark:bg-blue-900/40" />
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Customers
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats?.totalCustomers || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div
          onClick={() => handleNavigation("/dashboard/invoices", "invoices")}
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all cursor-pointer hover:scale-105 relative"
        >
          {isPending && activeCard === "invoices" && (
            <LoadingOverlay className="bg-purple-50/80 dark:bg-purple-900/40" />
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Invoices
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats?.totalInvoices || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div
          onClick={() => handleNavigation("/dashboard/products", "products")}
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all cursor-pointer hover:scale-105 relative"
        >
          {isPending && activeCard === "products" && (
            <LoadingOverlay className="bg-orange-50/80 dark:bg-orange-900/40" />
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Products
              </p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats?.totalProducts || 0}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <ShoppingCart className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Active Users
              </p>
              <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                {stats?.activeUsers || 0}
              </p>
            </div>
            <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
              <UserCheck className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Pending Invoices
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats?.pendingInvoices || 0}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          onClick={() => handleNavigation("/dashboard/customers", "customers")}
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-all duration-300 cursor-pointer group block hover:scale-105 hover:bg-blue-50 dark:hover:bg-blue-900/20 relative"
        >
          {isPending && activeCard === "customers" && (
            <LoadingOverlay className="bg-blue-50/80 dark:bg-blue-900/40" />
          )}
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400 transition-colors">
              Customers
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your customers
          </p>
        </div>

        <div
          onClick={() => handleNavigation("/dashboard/invoices", "invoices")}
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-all duration-300 cursor-pointer group block hover:scale-105 hover:bg-green-50 dark:hover:bg-green-900/20 relative"
        >
          {isPending && activeCard === "invoices" && (
            <LoadingOverlay className="bg-green-50/80 dark:bg-green-900/40" />
          )}
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400 transition-colors">
              Invoices
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            View and create invoices
          </p>
        </div>

        <div
          onClick={() => handleNavigation("/dashboard/products", "products")}
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-all duration-300 cursor-pointer group block hover:scale-105 hover:bg-purple-50 dark:hover:bg-purple-900/20 relative"
        >
          {isPending && activeCard === "products" && (
            <LoadingOverlay className="bg-purple-50/80 dark:bg-purple-900/40" />
          )}
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors">
              <ShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold group-hover:text-purple-700 dark:text-white dark:group-hover:text-purple-400 transition-colors">
              Products
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your products
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          <h2 className="text-2xl font-bold dark:text-white">
            Invoice Analytics (Last 7 Days)
          </h2>
        </div>

        {chartsLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <LoadingSpinner size="lg" />
          </div>
        ) : chartsError ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                  Unable to Load Chart Data
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-3">
                  {chartsError?.message ||
                    "Failed to fetch invoice data for charts. Please try again."}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-3 py-1.5 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center">
            <svg
              className="w-16 h-16 text-blue-400 dark:text-blue-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              No Invoice Data Available
            </h3>
            <p className="text-blue-600 dark:text-blue-300 text-sm mb-4">
              There are no invoices in the selected date range. Try selecting a
              different date range or create some invoices to see analytics.
            </p>
            <button
              onClick={() =>
                handleNavigation("/dashboard/invoices/create", "invoices")
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Create Invoice
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Invoice Count Chart */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Daily Invoice Count
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#6B7280" }}
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    tick={{ fill: "#6B7280" }}
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#8B5CF6"
                    name="Number of Invoices"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Invoice Amount Chart */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Daily Invoice Amount
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#6B7280" }}
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    tick={{ fill: "#6B7280" }}
                    style={{ fontSize: "12px" }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    formatter={(value: number) =>
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(value)
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalAmount"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="Total Amount"
                    dot={{ fill: "#10B981", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
