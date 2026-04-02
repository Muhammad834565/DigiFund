import { ApolloProvider } from '@/components/ApolloProvider';

export default function ShoppingLayout({ children }: { children: import('react').ReactNode }) {
  return <ApolloProvider>{children}</ApolloProvider>;
}