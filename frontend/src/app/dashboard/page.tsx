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
import { useMemo, useEffect } from "react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/LoadingSpinner";
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
  const { data: subscriptionData, error: subError } = useDashboardLiveStatsSubscription();

  useEffect(() => {
    if (subError) {
      console.error("❌ Subscription Failure:", subError);
    }
    if (subscriptionData) {
      console.log("✅ Subscription Data Received:", subscriptionData);
    }
  }, [subError, subscriptionData]);

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
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Loading Indicator */}
      {(loading || chartsLoading) && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse">
            <div className="h-full bg-white/30 animate-[shimmer_1s_infinite]"></div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of your financial performance
          </p>
        </div>

        {stats?.timestamp && (
          <div className="flex items-center gap-3 text-sm px-4 py-2 rounded-full glass bg-white/40 dark:bg-black/20">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Updated: {formatTimestamp(stats.timestamp)}</span>
            {subscriptionData && (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Live
              </span>
            )}
          </div>
        )}
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="group relative p-6 rounded-2xl glass-card hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-white/20 dark:border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.totalRevenue ? formatCurrency(stats.totalRevenue) : "$0.00"}
              </p>
            </div>
            <div className="p-3.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <Link
          href="/dashboard/customers"
          className="group relative p-6 rounded-2xl glass-card hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer border border-white/20 dark:border-white/10 block"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.totalCustomers || 0}
              </p>
            </div>
            <div className="p-3.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Link>

        {/* Total Invoices */}
        <Link
          href="/dashboard/invoices"
          className="group relative p-6 rounded-2xl glass-card hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer border border-white/20 dark:border-white/10 block"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Invoices</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.totalInvoices || 0}
              </p>
            </div>
            <div className="p-3.5 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </Link>

        {/* Total inventory */}
        <Link
          href="/dashboard/inventory"
          className="group relative p-6 rounded-2xl glass-card hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer border border-white/20 dark:border-white/10 block"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Inventory</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.totalProducts || 0}
              </p>
            </div>
            <div className="p-3.5 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Detailed Stats Row 2 */}
        <div className="p-6 rounded-2xl glass-card border border-white/20 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-100/50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.activeUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-white/20 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-yellow-100/50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.pendingInvoices || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/customers"
            className="group relative p-6 rounded-2xl glass-card hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer border border-white/20 dark:border-white/10 overflow-hidden block"
          >
            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-all" />

            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                Manage Customers
              </h3>
              <p className="text-muted-foreground text-sm">
                View and edit customer details
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-blue-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                Open Action →
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/invoices/create"
            className="group relative p-6 rounded-2xl glass-card hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer border border-white/20 dark:border-white/10 overflow-hidden block"
          >
            <div className="absolute top-0 right-0 p-32 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-green-500/10 transition-all" />

            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-500 transition-colors">
                Create Invoices
              </h3>
              <p className="text-muted-foreground text-sm">
                Generate new invoices
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-green-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                Open Action →
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/inventory"
            className="group relative p-6 rounded-2xl glass-card hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer border border-white/20 dark:border-white/10 overflow-hidden block"
          >
            <div className="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/10 transition-all" />

            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-500 transition-colors">
                View Inventory
              </h3>
              <p className="text-muted-foreground text-sm">
                Manage inventory items
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-purple-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                Open Action →
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Charts Section */}
      <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/20 dark:border-white/10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold dark:text-white">
              Analytics Overview
            </h2>
            <p className="text-muted-foreground text-sm">Performance metrics for the last 7 days</p>
          </div>
        </div>

        {chartsLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        ) : chartsError ? (
          <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 text-center">Failed to load chart data</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">No data available</p>
            <p className="text-gray-500">Create some invoices to see analytics here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Invoice Count Chart */}
            <div className="p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                Daily Volume
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.6 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.6 }}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="url(#colorCount)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Invoice Amount Chart */}
            <div className="p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                Revenue Trend
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.6 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.6 }}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalAmount"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: '#10B981', r: 4, stroke: 'var(--background)', strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
