import { ApolloProvider } from "@/components/ApolloProvider";
import { DashboardShell } from "@/components/DashboardShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApolloProvider>
      <DashboardShell>
        {children}
      </DashboardShell>
    </ApolloProvider>
  );
}
