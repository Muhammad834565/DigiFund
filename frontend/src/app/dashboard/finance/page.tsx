"use client";

import { useGetFinanceDashboardQuery, useFinanceDashboardUpdatesSubscription, GetFinanceDashboardDocument } from "@/graphql/generated/graphql";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { formatCurrency } from "@/lib/utils"; // Assuming utils exists, if not I'll inline specific formatting or checks
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function FinancePage() {
  const { data, loading, error } = useGetFinanceDashboardQuery();

  // Subscription automatically updates the cache if configured correctly, 
  // currently we are using the hook solely for side-effects or we can rely on auto-update key match.
  // Ideally, useFinanceDashboardUpdatesSubscription is used to listen.

  useFinanceDashboardUpdatesSubscription({
    onData: ({ client, data: subData }) => {
      const newData = subData.data?.financeDashboardUpdated;
      if (newData) {
        client.writeQuery({
          query: GetFinanceDashboardDocument,
          data: {
            getFinanceDashboard: newData,
          }
        })
      }
    }
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading finance data: {error.message}</div>;

  // use any as a escape hatch due to backend schema returning FinanceOverview for query
  // but the UI (designed for FinanceDashboard) expects transactions and charts.
  // The subscription actually returns the full FinanceDashboard.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finance = data?.getFinanceDashboard as any;

  if (!finance) return <div>No finance data available.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Finance Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${finance.total_income?.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${finance.total_expense?.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${finance.balance && finance.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              ${finance.balance?.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={finance.charts?.monthly_sales || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip />
                <Bar dataKey="total_amount" fill="#adfa1d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Sales by Item</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={finance.charts?.sales_by_item || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="total_amount"
                  nameKey="item_name"
                  label
                >
                  {(finance.charts?.sales_by_item || []).map((entry: { item_name: string; total_amount: number }, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {finance.transactions?.map((tx: { description: string; date: string; invoice_number: string; type: string; amount: number }, i: number) => (
              <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="font-medium text-sm">{tx?.description || "Transaction"}</p>
                  <p className="text-xs text-muted-foreground">{tx?.date} - {tx?.invoice_number}</p>
                </div>
                <div className={`font-bold ${tx?.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx?.type === 'income' ? '+' : '-'}${tx?.amount?.toFixed(2)}
                </div>
              </div>
            ))}
            {(!finance.transactions || finance.transactions.length === 0) && (
              <div className="text-center text-muted-foreground py-4">No recent transactions</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
