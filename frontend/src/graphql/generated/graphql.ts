import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client/react';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AcceptRejectRequestInput = {
  action: Scalars['String']['input'];
  request_id: Scalars['String']['input'];
};

export type AnomalyDetectionResult = {
  __typename?: 'AnomalyDetectionResult';
  anomalyScore: Scalars['Float']['output'];
  anomalyType: Scalars['String']['output'];
  description: Scalars['String']['output'];
  detectedAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  productId: Scalars['ID']['output'];
  productName: Scalars['String']['output'];
};

export type ChatMessageType = {
  __typename?: 'ChatMessageType';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  receiverId?: Maybe<Scalars['String']['output']>;
  roomId: Scalars['String']['output'];
  senderId: Scalars['String']['output'];
};

export type ChatRoomType = {
  __typename?: 'ChatRoomType';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  participantIds: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ConsumerResponse = {
  __typename?: 'ConsumerResponse';
  company_name?: Maybe<Scalars['String']['output']>;
  consumer_public_id: Scalars['String']['output'];
  contact_person: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  location?: Maybe<Scalars['String']['output']>;
  phone_no: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type CreateCustomerInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type CreateInventoryInput = {
  description: Scalars['String']['input'];
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  sku?: InputMaybe<Scalars['String']['input']>;
  unit_price: Scalars['Float']['input'];
};

export type CreateInvoiceInput = {
  bill_to_email?: InputMaybe<Scalars['String']['input']>;
  bill_to_phone?: InputMaybe<Scalars['String']['input']>;
  bill_to_public_id?: InputMaybe<Scalars['String']['input']>;
  items: Array<InvoiceItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type CreateRoomInput = {
  name: Scalars['String']['input'];
  participantIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CsvUploadResult = {
  __typename?: 'CsvUploadResult';
  errors: Array<Scalars['String']['output']>;
  failedRows: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  successfulRows: Scalars['Int']['output'];
  totalRows: Scalars['Int']['output'];
};

export type Customer = {
  __typename?: 'Customer';
  address?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owner_public_id: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
};

export type DashboardStatsType = {
  __typename?: 'DashboardStatsType';
  activeUsers: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  pendingInvoices: Scalars['Int']['output'];
  timestamp: Scalars['DateTime']['output'];
  totalCustomers: Scalars['Int']['output'];
  totalInvoices: Scalars['Int']['output'];
  totalProducts: Scalars['Int']['output'];
  totalRevenue: Scalars['Float']['output'];
};

export type DataExportInput = {
  dataType: Scalars['String']['input'];
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  fields?: InputMaybe<Array<Scalars['String']['input']>>;
  format: Scalars['String']['input'];
};

export type DataExportResult = {
  __typename?: 'DataExportResult';
  fileName: Scalars['String']['output'];
  fileUrl: Scalars['String']['output'];
  format: Scalars['String']['output'];
  recordCount: Scalars['Int']['output'];
};

export type FinanceCharts = {
  __typename?: 'FinanceCharts';
  monthly_sales: Array<MonthlySales>;
  monthly_sales_count: Array<MonthlySalesCount>;
  sales_by_item: Array<SalesByItem>;
  weekly_sales: Array<WeeklySales>;
};

export type FinanceDashboard = {
  __typename?: 'FinanceDashboard';
  balance: Scalars['Float']['output'];
  charts: FinanceCharts;
  total_expense: Scalars['Float']['output'];
  total_income: Scalars['Float']['output'];
  transactions: Array<TransactionItem>;
};

export type FinanceOverview = {
  __typename?: 'FinanceOverview';
  balance: Scalars['Float']['output'];
  pending_expense: Scalars['Float']['output'];
  pending_income: Scalars['Float']['output'];
  total_expense: Scalars['Float']['output'];
  total_income: Scalars['Float']['output'];
};

export type ForgotPasswordInput = {
  email: Scalars['String']['input'];
};

export type GenerateSummaryInput = {
  productId: Scalars['String']['input'];
};

export type InventoryMaster = {
  __typename?: 'InventoryMaster';
  created_at: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  images?: Maybe<Array<Scalars['String']['output']>>;
  inventory_id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  owner_public_id: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  quantity: Scalars['Int']['output'];
  sku?: Maybe<Scalars['String']['output']>;
  unit_price: Scalars['Float']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type InvoiceChartData = {
  __typename?: 'InvoiceChartData';
  last7Days: Array<InvoiceDailyStat>;
};

export type InvoiceDailyStat = {
  __typename?: 'InvoiceDailyStat';
  count: Scalars['Int']['output'];
  date: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
};

export type InvoiceItem = {
  __typename?: 'InvoiceItem';
  discount_percentage: Scalars['Float']['output'];
  id: Scalars['Int']['output'];
  inventory_id: Scalars['String']['output'];
  invoice_id: Scalars['Int']['output'];
  qty: Scalars['Float']['output'];
  rate: Scalars['Float']['output'];
  total_price: Scalars['Float']['output'];
};

export type InvoiceItemInput = {
  discount_percentage?: InputMaybe<Scalars['Float']['input']>;
  inventory_id: Scalars['String']['input'];
  qty: Scalars['Float']['input'];
  rate: Scalars['Float']['input'];
};

export type InvoiceItemType = {
  __typename?: 'InvoiceItemType';
  discount_percentage: Scalars['Float']['output'];
  id: Scalars['Int']['output'];
  inventory_id: Scalars['String']['output'];
  invoice_id: Scalars['Int']['output'];
  qty: Scalars['Float']['output'];
  rate: Scalars['Float']['output'];
  total_price: Scalars['Float']['output'];
};

export type InvoiceType = {
  __typename?: 'InvoiceType';
  bill_from_address?: Maybe<Scalars['String']['output']>;
  bill_from_email?: Maybe<Scalars['String']['output']>;
  bill_from_name?: Maybe<Scalars['String']['output']>;
  bill_from_phone?: Maybe<Scalars['String']['output']>;
  bill_from_public_id: Scalars['String']['output'];
  bill_from_status: Scalars['String']['output'];
  bill_to_address?: Maybe<Scalars['String']['output']>;
  bill_to_email?: Maybe<Scalars['String']['output']>;
  bill_to_name?: Maybe<Scalars['String']['output']>;
  bill_to_phone?: Maybe<Scalars['String']['output']>;
  bill_to_public_id: Scalars['String']['output'];
  bill_to_status: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  invoice_date: Scalars['DateTime']['output'];
  invoice_number: Scalars['String']['output'];
  invoice_type: Scalars['String']['output'];
  items?: Maybe<Array<InvoiceItemType>>;
  status: Scalars['String']['output'];
  total_amount: Scalars['Float']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type JoinRoomInput = {
  roomId: Scalars['String']['input'];
};

export type LoginInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  phone_no?: InputMaybe<Scalars['String']['input']>;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  address?: Maybe<Scalars['String']['output']>;
  company_name: Scalars['String']['output'];
  contact_person: Scalars['String']['output'];
  email: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  phone_no: Scalars['String']['output'];
  private_id: Scalars['String']['output'];
  public_id: Scalars['String']['output'];
  role: Scalars['String']['output'];
  status: Scalars['String']['output'];
  token: Scalars['String']['output'];
  type_of_business?: Maybe<Scalars['String']['output']>;
};

export type LogoutResponse = {
  __typename?: 'LogoutResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type MessageResponse = {
  __typename?: 'MessageResponse';
  message: Scalars['String']['output'];
};

export type MonthlySales = {
  __typename?: 'MonthlySales';
  month: Scalars['String']['output'];
  total_amount: Scalars['Float']['output'];
};

export type MonthlySalesCount = {
  __typename?: 'MonthlySalesCount';
  count: Scalars['Int']['output'];
  month: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptRejectRequest: RelationshipRequest;
  createChatRoom: ChatRoomType;
  createCustomer: Customer;
  createInventory: InventoryMaster;
  createInvoice: InvoiceType;
  deleteCustomer: Scalars['Boolean']['output'];
  deleteInventory: MessageResponse;
  deleteInvoice: InvoiceType;
  /** Request password reset OTP */
  forgotPassword: OtpResponse;
  /** Generate AI-powered summaries for all products missing descriptions. */
  generateMissingSummaries: CsvUploadResult;
  /** Generate AI-powered summary for a product. */
  generateProductSummary: ProductSummary;
  getOrCreatePrivateChatRoom: ChatRoomType;
  /** Index all products for semantic search. Run after adding new products. */
  indexAllProducts: Scalars['Boolean']['output'];
  joinChatRoom: ChatRoomType;
  /** Login with email or phone number and password */
  login: LoginResponse;
  /** Logout and invalidate token */
  logout: LogoutResponse;
  removeRelationship: MessageResponse;
  /** Resend OTP for signup or password reset */
  resendOtp: OtpResponse;
  /** Reset password with OTP */
  resetPassword: OtpResponse;
  sendChatMessage: ChatMessageType;
  sendRelationshipRequest: RelationshipRequest;
  /** Register a new user and send OTP for verification */
  signup: SignupResponse;
  updateCustomer: Customer;
  updateInventory: InventoryMaster;
  updateInvoice: InvoiceType;
  updateInvoiceStatus: InvoiceType;
  /** Update user profile */
  updateProfile: UserMain;
  /** Verify OTP for signup or password reset */
  verifyOtp: OtpResponse;
};


export type MutationAcceptRejectRequestArgs = {
  input: AcceptRejectRequestInput;
};


export type MutationCreateChatRoomArgs = {
  input: CreateRoomInput;
};


export type MutationCreateCustomerArgs = {
  input: CreateCustomerInput;
};


export type MutationCreateInventoryArgs = {
  input: CreateInventoryInput;
};


export type MutationCreateInvoiceArgs = {
  input: CreateInvoiceInput;
};


export type MutationDeleteCustomerArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteInventoryArgs = {
  inventory_id: Scalars['String']['input'];
};


export type MutationDeleteInvoiceArgs = {
  invoice_number: Scalars['String']['input'];
};


export type MutationForgotPasswordArgs = {
  input: ForgotPasswordInput;
};


export type MutationGenerateProductSummaryArgs = {
  input: GenerateSummaryInput;
};


export type MutationGetOrCreatePrivateChatRoomArgs = {
  receiverId: Scalars['String']['input'];
};


export type MutationJoinChatRoomArgs = {
  input: JoinRoomInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRemoveRelationshipArgs = {
  request_id: Scalars['String']['input'];
};


export type MutationResendOtpArgs = {
  input: ResendOtpInput;
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationSendChatMessageArgs = {
  input: SendMessageInput;
};


export type MutationSendRelationshipRequestArgs = {
  input: SendRelationshipRequestInput;
};


export type MutationSignupArgs = {
  input: SignupInput;
};


export type MutationUpdateCustomerArgs = {
  id: Scalars['String']['input'];
  input: UpdateCustomerInput;
};


export type MutationUpdateInventoryArgs = {
  input: UpdateInventoryInput;
  inventory_id: Scalars['String']['input'];
};


export type MutationUpdateInvoiceArgs = {
  input: UpdateInvoiceInput;
  invoice_number: Scalars['String']['input'];
};


export type MutationUpdateInvoiceStatusArgs = {
  input: UpdateInvoiceStatusInput;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationVerifyOtpArgs = {
  input: VerifyOtpInput;
};

export type OtpResponse = {
  __typename?: 'OtpResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type ProductRecommendation = {
  __typename?: 'ProductRecommendation';
  confidence: Scalars['Float']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  reason: Scalars['String']['output'];
  stock: Scalars['Int']['output'];
};

export type ProductSummary = {
  __typename?: 'ProductSummary';
  keyFeatures: Array<Scalars['String']['output']>;
  productId: Scalars['ID']['output'];
  summary: Scalars['String']['output'];
  targetAudience: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  chatRoomMessages: Array<ChatMessageType>;
  customer: Customer;
  customers: Array<Customer>;
  dashboardStats: DashboardStatsType;
  /** Detect anomalies in sales patterns, revenue, and order quantities. */
  detectAnomalies: Array<AnomalyDetectionResult>;
  /** Export data to CSV or Excel format with optional filters. */
  exportData: DataExportResult;
  getConsumers: Array<ConsumerResponse>;
  getFinanceDashboard: FinanceOverview;
  getInventory: Array<InventoryMaster>;
  getInventoryById: InventoryMaster;
  getInvoiceByNumber: InvoiceType;
  getInvoices: Array<InvoiceType>;
  getMyRelationshipRequests: Array<RelationshipRequest>;
  getPendingRequests: Array<RelationshipRequest>;
  /** Get summary of available data for RAG queries. */
  getRagDataSummary: Scalars['String']['output'];
  /** Get personalized product recommendations based on purchase history. */
  getRecommendations: Array<ProductRecommendation>;
  getSentRequests: Array<RelationshipRequest>;
  getSuppliers: Array<SupplierResponse>;
  /** Get user by public ID */
  getUserByPublicId: UserMain;
  invoice: InvoiceType;
  invoiceCharts: InvoiceChartData;
  invoices: Array<InvoiceType>;
  /** Get current user profile */
  me: UserMain;
  /** Ask questions about your database using natural language. AI will query the database and provide answers. */
  queryWithRag: RagResponse;
  searchUser: UserMain;
  /** Search products using natural language. Returns products ranked by relevance. */
  semanticSearch: Array<SemanticSearchResult>;
  userChatRooms: Array<ChatRoomType>;
};


export type QueryChatRoomMessagesArgs = {
  roomId: Scalars['String']['input'];
};


export type QueryCustomerArgs = {
  id: Scalars['String']['input'];
};


export type QueryExportDataArgs = {
  input: DataExportInput;
};


export type QueryGetInventoryByIdArgs = {
  inventory_id: Scalars['String']['input'];
};


export type QueryGetInvoiceByNumberArgs = {
  invoice_number: Scalars['String']['input'];
};


export type QueryGetRecommendationsArgs = {
  input: RecommendationInput;
};


export type QueryGetUserByPublicIdArgs = {
  public_id: Scalars['String']['input'];
};


export type QueryInvoiceArgs = {
  id: Scalars['Int']['input'];
};


export type QueryQueryWithRagArgs = {
  input: RagQueryInput;
};


export type QuerySearchUserArgs = {
  input: SearchUserInput;
};


export type QuerySemanticSearchArgs = {
  input: SemanticSearchInput;
};

export type RagQueryInput = {
  context?: InputMaybe<Scalars['String']['input']>;
  query: Scalars['String']['input'];
};

export type RagResponse = {
  __typename?: 'RagResponse';
  answer: Scalars['String']['output'];
  confidenceScore: Scalars['Int']['output'];
  followUpSuggestions?: Maybe<Array<Scalars['String']['output']>>;
  sources: Array<Scalars['String']['output']>;
};

export type RecommendationInput = {
  limit?: Scalars['Int']['input'];
  userId: Scalars['String']['input'];
};

export type RelationshipRequest = {
  __typename?: 'RelationshipRequest';
  created_at: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  relationship_type: Scalars['String']['output'];
  requested_public_id: Scalars['String']['output'];
  requester_public_id: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type ResendOtpInput = {
  email: Scalars['String']['input'];
  purpose: Scalars['String']['input'];
};

export type ResetPasswordInput = {
  email: Scalars['String']['input'];
  new_password: Scalars['String']['input'];
  otp: Scalars['String']['input'];
};

export type SalesByItem = {
  __typename?: 'SalesByItem';
  item_name: Scalars['String']['output'];
  total_amount: Scalars['Float']['output'];
};

export type SearchUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  phone_no?: InputMaybe<Scalars['String']['input']>;
  public_id?: InputMaybe<Scalars['String']['input']>;
};

export type SemanticSearchInput = {
  limit?: Scalars['Int']['input'];
  query: Scalars['String']['input'];
};

export type SemanticSearchResult = {
  __typename?: 'SemanticSearchResult';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  similarityScore: Scalars['Float']['output'];
  stock: Scalars['Int']['output'];
};

export type SendMessageInput = {
  message: Scalars['String']['input'];
  receiverId?: InputMaybe<Scalars['String']['input']>;
  roomId: Scalars['String']['input'];
};

export type SendRelationshipRequestInput = {
  relationship_type: Scalars['String']['input'];
  requested_public_id: Scalars['String']['input'];
};

export type SignupInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  company_name?: InputMaybe<Scalars['String']['input']>;
  contact_person: Scalars['String']['input'];
  email: Scalars['String']['input'];
  gender?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  phone_no: Scalars['String']['input'];
  role: Scalars['String']['input'];
  type_of_business?: InputMaybe<Scalars['String']['input']>;
};

export type SignupResponse = {
  __typename?: 'SignupResponse';
  email: Scalars['String']['output'];
  message: Scalars['String']['output'];
  user?: Maybe<UserMain>;
};

export type Subscription = {
  __typename?: 'Subscription';
  dashboardStatsUpdated: DashboardStatsType;
  financeDashboardUpdated: FinanceDashboard;
  invoiceReceived: InvoiceType;
  messageReceived: ChatMessageType;
  userJoinedRoom: UserJoinedRoomType;
};


export type SubscriptionMessageReceivedArgs = {
  roomId: Scalars['String']['input'];
};

export type SupplierResponse = {
  __typename?: 'SupplierResponse';
  company_name?: Maybe<Scalars['String']['output']>;
  contact_person: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  location?: Maybe<Scalars['String']['output']>;
  phone_no: Scalars['String']['output'];
  status: Scalars['String']['output'];
  supplier_public_id: Scalars['String']['output'];
};

export type TransactionItem = {
  __typename?: 'TransactionItem';
  amount: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  invoice_number: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type UpdateCustomerInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateInventoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  unit_price?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateInvoiceInput = {
  items?: InputMaybe<Array<InvoiceItemInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateInvoiceStatusInput = {
  invoice_number: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type UpdateProfileInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  company_name?: InputMaybe<Scalars['String']['input']>;
  contact_person?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  phone_no?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  type_of_business?: InputMaybe<Scalars['String']['input']>;
};

export type UserJoinedRoomType = {
  __typename?: 'UserJoinedRoomType';
  roomId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type UserMain = {
  __typename?: 'UserMain';
  address?: Maybe<Scalars['String']['output']>;
  company_name?: Maybe<Scalars['String']['output']>;
  contact_person: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  is_verified: Scalars['Boolean']['output'];
  phone_no: Scalars['String']['output'];
  private_id: Scalars['String']['output'];
  public_id: Scalars['String']['output'];
  role: Scalars['String']['output'];
  status: Scalars['String']['output'];
  type_of_business?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
};

export type VerifyOtpInput = {
  email: Scalars['String']['input'];
  otp: Scalars['String']['input'];
  purpose: Scalars['String']['input'];
};

export type WeeklySales = {
  __typename?: 'WeeklySales';
  day: Scalars['String']['output'];
  total_amount: Scalars['Float']['output'];
};

export type SignupMutationVariables = Exact<{
  input: SignupInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'SignupResponse', message: string, email: string } };

export type VerifyOtpMutationVariables = Exact<{
  input: VerifyOtpInput;
}>;


export type VerifyOtpMutation = { __typename?: 'Mutation', verifyOtp: { __typename?: 'OtpResponse', success: boolean, message: string } };

export type ResendOtpMutationVariables = Exact<{
  input: ResendOtpInput;
}>;


export type ResendOtpMutation = { __typename?: 'Mutation', resendOtp: { __typename?: 'OtpResponse', message: string, success: boolean } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', token: string, company_name: string, public_id: string, private_id: string, contact_person: string, email: string, phone_no: string, address?: string | null, status: string, gender?: string | null, type_of_business?: string | null, role: string } };

export type ForgotPasswordMutationVariables = Exact<{
  input: ForgotPasswordInput;
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: { __typename?: 'OtpResponse', success: boolean, message: string } };

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'OtpResponse', success: boolean, message: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutResponse', success: boolean, message: string } };

export type CreateChatRoomMutationVariables = Exact<{
  input: CreateRoomInput;
}>;


export type CreateChatRoomMutation = { __typename?: 'Mutation', createChatRoom: { __typename?: 'ChatRoomType', id: string, name: string, participantIds: Array<string>, createdAt: any } };

export type SendChatMessageMutationVariables = Exact<{
  input: SendMessageInput;
}>;


export type SendChatMessageMutation = { __typename?: 'Mutation', sendChatMessage: { __typename?: 'ChatMessageType', id: string, roomId: string, senderId: string, receiverId?: string | null, message: string, createdAt: any } };

export type JoinChatRoomMutationVariables = Exact<{
  input: JoinRoomInput;
}>;


export type JoinChatRoomMutation = { __typename?: 'Mutation', joinChatRoom: { __typename?: 'ChatRoomType', id: string, name: string, participantIds: Array<string> } };

export type GetOrCreatePrivateChatRoomMutationVariables = Exact<{
  receiverId: Scalars['String']['input'];
}>;


export type GetOrCreatePrivateChatRoomMutation = { __typename?: 'Mutation', getOrCreatePrivateChatRoom: { __typename?: 'ChatRoomType', id: string, name: string, participantIds: Array<string>, createdAt: any } };

export type CreateCustomerMutationVariables = Exact<{
  input: CreateCustomerInput;
}>;


export type CreateCustomerMutation = { __typename?: 'Mutation', createCustomer: { __typename?: 'Customer', id: string, name: string, email?: string | null, phone?: string | null, address?: string | null, createdAt: any } };

export type UpdateCustomerMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateCustomerInput;
}>;


export type UpdateCustomerMutation = { __typename?: 'Mutation', updateCustomer: { __typename?: 'Customer', id: string, name: string, email?: string | null, phone?: string | null, address?: string | null, createdAt: any } };

export type DeleteCustomerMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteCustomerMutation = { __typename?: 'Mutation', deleteCustomer: boolean };

export type CreateInventoryMutationVariables = Exact<{
  input: CreateInventoryInput;
}>;


export type CreateInventoryMutation = { __typename?: 'Mutation', createInventory: { __typename?: 'InventoryMaster', id: number, inventory_id: string, description: string, price: number, quantity: number, sku?: string | null, images?: Array<string> | null, created_at: any } };

export type UpdateInventoryMutationVariables = Exact<{
  inventory_id: Scalars['String']['input'];
  input: UpdateInventoryInput;
}>;


export type UpdateInventoryMutation = { __typename?: 'Mutation', updateInventory: { __typename?: 'InventoryMaster', inventory_id: string, description: string, price: number, quantity: number, updated_at: any } };

export type DeleteInventoryMutationVariables = Exact<{
  inventory_id: Scalars['String']['input'];
}>;


export type DeleteInventoryMutation = { __typename?: 'Mutation', deleteInventory: { __typename?: 'MessageResponse', message: string } };

export type IndexAllProductsMutationVariables = Exact<{ [key: string]: never; }>;


export type IndexAllProductsMutation = { __typename?: 'Mutation', indexAllProducts: boolean };

export type GenerateMissingSummariesMutationVariables = Exact<{ [key: string]: never; }>;


export type GenerateMissingSummariesMutation = { __typename?: 'Mutation', generateMissingSummaries: { __typename?: 'CsvUploadResult', totalRows: number, successfulRows: number, failedRows: number, errors: Array<string>, message: string } };

export type GenerateProductSummaryMutationVariables = Exact<{
  input: GenerateSummaryInput;
}>;


export type GenerateProductSummaryMutation = { __typename?: 'Mutation', generateProductSummary: { __typename?: 'ProductSummary', productId: string, summary: string, keyFeatures: Array<string>, targetAudience: string } };

export type CreateInvoiceMutationVariables = Exact<{
  input: CreateInvoiceInput;
}>;


export type CreateInvoiceMutation = { __typename?: 'Mutation', createInvoice: { __typename?: 'InvoiceType', id: number, invoice_number: string, invoice_type: string, status: string, bill_from_public_id: string, bill_to_public_id: string, bill_from_status: string, bill_to_status: string, invoice_date: any, total_amount: number, created_at: any, items?: Array<{ __typename?: 'InvoiceItemType', id: number, inventory_id: string, qty: number, rate: number, discount_percentage: number, total_price: number }> | null } };

export type UpdateInvoiceMutationVariables = Exact<{
  invoice_number: Scalars['String']['input'];
  input: UpdateInvoiceInput;
}>;


export type UpdateInvoiceMutation = { __typename?: 'Mutation', updateInvoice: { __typename?: 'InvoiceType', id: number, invoice_number: string, invoice_type: string, status: string, bill_from_public_id: string, bill_to_public_id: string, total_amount: number, invoice_date: any, created_at: any, updated_at: any, items?: Array<{ __typename?: 'InvoiceItemType', id: number, inventory_id: string, qty: number, rate: number, discount_percentage: number, total_price: number }> | null } };

export type DeleteInvoiceMutationVariables = Exact<{
  invoice_number: Scalars['String']['input'];
}>;


export type DeleteInvoiceMutation = { __typename?: 'Mutation', deleteInvoice: { __typename?: 'InvoiceType', invoice_number: string, status: string, total_amount: number } };

export type UpdateInvoiceStatusMutationVariables = Exact<{
  input: UpdateInvoiceStatusInput;
}>;


export type UpdateInvoiceStatusMutation = { __typename?: 'Mutation', updateInvoiceStatus: { __typename?: 'InvoiceType', id: number, invoice_number: string, status: string, bill_from_status: string, bill_to_status: string, updated_at: any } };

export type UpdateMyProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateMyProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'UserMain', id: number, company_name?: string | null, contact_person: string, phone_no: string, address?: string | null, updated_at: any } };

export type SendSupplierRequestMutationVariables = Exact<{
  input: SendRelationshipRequestInput;
}>;


export type SendSupplierRequestMutation = { __typename?: 'Mutation', sendRelationshipRequest: { __typename?: 'RelationshipRequest', id: number, requester_public_id: string, requested_public_id: string, relationship_type: string, status: string, created_at: any } };

export type AcceptRequestMutationVariables = Exact<{
  input: AcceptRejectRequestInput;
}>;


export type AcceptRequestMutation = { __typename?: 'Mutation', acceptRejectRequest: { __typename?: 'RelationshipRequest', id: number, status: string, updated_at: any } };

export type VerifySignupOtpMutationVariables = Exact<{
  email: Scalars['String']['input'];
  otp: Scalars['String']['input'];
  purpose: Scalars['String']['input'];
}>;


export type VerifySignupOtpMutation = { __typename?: 'Mutation', verifyOtp: { __typename?: 'OtpResponse', success: boolean, message: string } };

export type LoginWithEmailMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginWithEmailMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', token: string, company_name: string, public_id: string, private_id: string, contact_person: string, email: string, phone_no: string, address?: string | null, status: string, gender?: string | null, type_of_business?: string | null, role: string } };

export type LoginWithPhoneMutationVariables = Exact<{
  phone_no: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginWithPhoneMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', token: string, company_name: string, public_id: string, private_id: string, contact_person: string, email: string, phone_no: string, role: string } };

export type GetRoomMessagesQueryVariables = Exact<{
  roomId: Scalars['String']['input'];
}>;


export type GetRoomMessagesQuery = { __typename?: 'Query', chatRoomMessages: Array<{ __typename?: 'ChatMessageType', id: string, senderId: string, receiverId?: string | null, message: string, createdAt: any }> };

export type GetUserChatRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserChatRoomsQuery = { __typename?: 'Query', userChatRooms: Array<{ __typename?: 'ChatRoomType', id: string, name: string, participantIds: Array<string>, createdAt: any }> };

export type GetRagDataSummaryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRagDataSummaryQuery = { __typename?: 'Query', getRagDataSummary: string };

export type QueryWithRagQueryVariables = Exact<{
  query: Scalars['String']['input'];
}>;


export type QueryWithRagQuery = { __typename?: 'Query', queryWithRag: { __typename?: 'RagResponse', answer: string, sources: Array<string>, confidenceScore: number, followUpSuggestions?: Array<string> | null } };

export type GetAllCustomersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCustomersQuery = { __typename?: 'Query', customers: Array<{ __typename?: 'Customer', id: string, name: string, email?: string | null, phone?: string | null, address?: string | null, createdAt: any }> };

export type GetCustomerQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCustomerQuery = { __typename?: 'Query', customer: { __typename?: 'Customer', id: string, name: string, email?: string | null, phone?: string | null, address?: string | null, createdAt: any } };

export type GetDashboardStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDashboardStatsQuery = { __typename?: 'Query', dashboardStats: { __typename?: 'DashboardStatsType', id: string, totalCustomers: number, totalProducts: number, totalInvoices: number, totalRevenue: number, activeUsers: number, pendingInvoices: number, timestamp: any } };

export type ExportProductsCsvQueryVariables = Exact<{ [key: string]: never; }>;


export type ExportProductsCsvQuery = { __typename?: 'Query', exportData: { __typename?: 'DataExportResult', format: string, fileName: string, fileUrl: string, recordCount: number } };

export type ExportProductsExcelQueryVariables = Exact<{ [key: string]: never; }>;


export type ExportProductsExcelQuery = { __typename?: 'Query', exportData: { __typename?: 'DataExportResult', format: string, fileName: string, fileUrl: string, recordCount: number } };

export type ExportCustomersCsvQueryVariables = Exact<{ [key: string]: never; }>;


export type ExportCustomersCsvQuery = { __typename?: 'Query', exportData: { __typename?: 'DataExportResult', format: string, fileName: string, fileUrl: string, recordCount: number } };

export type ExportCustomersExcelQueryVariables = Exact<{ [key: string]: never; }>;


export type ExportCustomersExcelQuery = { __typename?: 'Query', exportData: { __typename?: 'DataExportResult', format: string, fileName: string, fileUrl: string, recordCount: number } };

export type ExportInvoicesCsvQueryVariables = Exact<{ [key: string]: never; }>;


export type ExportInvoicesCsvQuery = { __typename?: 'Query', exportData: { __typename?: 'DataExportResult', format: string, fileName: string, fileUrl: string, recordCount: number } };

export type ExportInvoicesExcelQueryVariables = Exact<{ [key: string]: never; }>;


export type ExportInvoicesExcelQuery = { __typename?: 'Query', exportData: { __typename?: 'DataExportResult', format: string, fileName: string, fileUrl: string, recordCount: number } };

export type GetFinanceDashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFinanceDashboardQuery = { __typename?: 'Query', getFinanceDashboard: { __typename?: 'FinanceOverview', total_income: number, total_expense: number, balance: number, pending_income: number, pending_expense: number } };

export type GetMyInventoryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyInventoryQuery = { __typename?: 'Query', getInventory: Array<{ __typename?: 'InventoryMaster', id: number, inventory_id: string, name: string, description: string, price: number, quantity: number, unit_price: number, sku?: string | null, images?: Array<string> | null, created_at: any, updated_at: any }> };

export type GetInventoryItemQueryVariables = Exact<{
  inventory_id: Scalars['String']['input'];
}>;


export type GetInventoryItemQuery = { __typename?: 'Query', getInventoryById: { __typename?: 'InventoryMaster', id: number, inventory_id: string, name: string, description: string, price: number, quantity: number, unit_price: number, sku?: string | null, images?: Array<string> | null } };

export type GetInvoiceChartsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInvoiceChartsQuery = { __typename?: 'Query', invoiceCharts: { __typename?: 'InvoiceChartData', last7Days: Array<{ __typename?: 'InvoiceDailyStat', date: string, count: number, totalAmount: number }> } };

export type GetMyInvoicesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyInvoicesQuery = { __typename?: 'Query', getInvoices: Array<{ __typename?: 'InvoiceType', id: number, invoice_number: string, invoice_type: string, status: string, bill_from_public_id: string, bill_to_public_id: string, bill_from_status: string, bill_to_status: string, invoice_date: any, total_amount: number, bill_from_name?: string | null, bill_to_name?: string | null, created_at: any, items?: Array<{ __typename?: 'InvoiceItemType', inventory_id: string, qty: number, rate: number, discount_percentage: number, total_price: number }> | null }> };

export type GetInvoiceQueryVariables = Exact<{
  invoice_number: Scalars['String']['input'];
}>;


export type GetInvoiceQuery = { __typename?: 'Query', getInvoiceByNumber: { __typename?: 'InvoiceType', id: number, invoice_number: string, invoice_type: string, status: string, bill_from_public_id: string, bill_to_public_id: string, bill_from_status: string, bill_to_status: string, invoice_date: any, total_amount: number, bill_from_name?: string | null, bill_from_email?: string | null, bill_from_phone?: string | null, bill_from_address?: string | null, bill_to_name?: string | null, bill_to_email?: string | null, bill_to_phone?: string | null, bill_to_address?: string | null, created_at: any, updated_at: any, items?: Array<{ __typename?: 'InvoiceItemType', id: number, inventory_id: string, qty: number, rate: number, discount_percentage: number, total_price: number }> | null } };

export type GetInvoicesForChartsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInvoicesForChartsQuery = { __typename?: 'Query', invoices: Array<{ __typename?: 'InvoiceType', id: number, created_at: any, total_amount: number }> };

export type GetMyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyProfileQuery = { __typename?: 'Query', me: { __typename?: 'UserMain', id: number, public_id: string, private_id: string, company_name?: string | null, contact_person: string, email: string, phone_no: string, address?: string | null, status: string, gender?: string | null, type_of_business?: string | null, role: string, is_verified: boolean, created_at: any, updated_at: any } };

export type GetUserByPublicIdQueryVariables = Exact<{
  public_id: Scalars['String']['input'];
}>;


export type GetUserByPublicIdQuery = { __typename?: 'Query', getUserByPublicId: { __typename?: 'UserMain', public_id: string, company_name?: string | null, contact_person: string, email: string, phone_no: string, role: string } };

export type SemanticSearchGamingQueryVariables = Exact<{
  input: SemanticSearchInput;
}>;


export type SemanticSearchGamingQuery = { __typename?: 'Query', semanticSearch: Array<{ __typename?: 'SemanticSearchResult', id: string, name: string, description?: string | null, price: number, stock: number, similarityScore: number }> };

export type GetRecommendationsQueryVariables = Exact<{
  input: RecommendationInput;
}>;


export type GetRecommendationsQuery = { __typename?: 'Query', getRecommendations: Array<{ __typename?: 'ProductRecommendation', id: string, name: string, description?: string | null, price: number, stock: number, confidence: number, reason: string }> };

export type SemanticSearchQueryVariables = Exact<{
  input: SemanticSearchInput;
}>;


export type SemanticSearchQuery = { __typename?: 'Query', semanticSearch: Array<{ __typename?: 'SemanticSearchResult', id: string, name: string, description?: string | null, price: number, stock: number, similarityScore: number }> };

export type GetMyRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyRequestsQuery = { __typename?: 'Query', getMyRelationshipRequests: Array<{ __typename?: 'RelationshipRequest', id: number, requester_public_id: string, requested_public_id: string, relationship_type: string, status: string, created_at: any }> };

export type GetMySuppliersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMySuppliersQuery = { __typename?: 'Query', getSuppliers: Array<{ __typename?: 'SupplierResponse', id: number, supplier_public_id: string, company_name?: string | null, contact_person: string, email: string, phone_no: string, location?: string | null, status: string, created_at: any }> };

export type SearchUserQueryVariables = Exact<{
  input: SearchUserInput;
}>;


export type SearchUserQuery = { __typename?: 'Query', searchUser: { __typename?: 'UserMain', public_id: string, company_name?: string | null, contact_person: string, email: string, phone_no: string, role: string } };

export type MessageReceivedSubscriptionVariables = Exact<{
  roomId: Scalars['String']['input'];
}>;


export type MessageReceivedSubscription = { __typename?: 'Subscription', messageReceived: { __typename?: 'ChatMessageType', id: string, roomId: string, senderId: string, receiverId?: string | null, message: string, createdAt: any } };

export type DashboardLiveStatsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type DashboardLiveStatsSubscription = { __typename?: 'Subscription', dashboardStatsUpdated: { __typename?: 'DashboardStatsType', id: string, totalCustomers: number, totalProducts: number, totalInvoices: number, totalRevenue: number, activeUsers: number, pendingInvoices: number, timestamp: any } };

export type FinanceDashboardUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type FinanceDashboardUpdatesSubscription = { __typename?: 'Subscription', financeDashboardUpdated: { __typename?: 'FinanceDashboard', total_income: number, total_expense: number, balance: number, transactions: Array<{ __typename?: 'TransactionItem', date: any, invoice_number: string, description: string, category: string, amount: number, type: string }>, charts: { __typename?: 'FinanceCharts', sales_by_item: Array<{ __typename?: 'SalesByItem', item_name: string, total_amount: number }>, monthly_sales: Array<{ __typename?: 'MonthlySales', month: string, total_amount: number }>, weekly_sales: Array<{ __typename?: 'WeeklySales', day: string, total_amount: number }>, monthly_sales_count: Array<{ __typename?: 'MonthlySalesCount', month: string, count: number }> } } };

export type InvoiceReceivedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type InvoiceReceivedSubscription = { __typename?: 'Subscription', invoiceReceived: { __typename?: 'InvoiceType', invoice_number: string, invoice_type: string, total_amount: number, status: string, invoice_date: any, bill_from_name?: string | null, bill_to_name?: string | null } };


export const SignupDocument = gql`
    mutation Signup($input: SignupInput!) {
  signup(input: $input) {
    message
    email
  }
}
    `;
export type SignupMutationFn = ApolloReactCommon.MutationFunction<SignupMutation, SignupMutationVariables>;
export function useSignupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SignupMutation, SignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument, options);
      }
export type SignupMutationHookResult = ReturnType<typeof useSignupMutation>;
export type SignupMutationResult = ApolloReactCommon.MutationResult<SignupMutation>;
export type SignupMutationOptions = ApolloReactCommon.BaseMutationOptions<SignupMutation, SignupMutationVariables>;
export const VerifyOtpDocument = gql`
    mutation VerifyOtp($input: VerifyOtpInput!) {
  verifyOtp(input: $input) {
    success
    message
  }
}
    `;
export type VerifyOtpMutationFn = ApolloReactCommon.MutationFunction<VerifyOtpMutation, VerifyOtpMutationVariables>;
export function useVerifyOtpMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<VerifyOtpMutation, VerifyOtpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<VerifyOtpMutation, VerifyOtpMutationVariables>(VerifyOtpDocument, options);
      }
export type VerifyOtpMutationHookResult = ReturnType<typeof useVerifyOtpMutation>;
export type VerifyOtpMutationResult = ApolloReactCommon.MutationResult<VerifyOtpMutation>;
export type VerifyOtpMutationOptions = ApolloReactCommon.BaseMutationOptions<VerifyOtpMutation, VerifyOtpMutationVariables>;
export const ResendOtpDocument = gql`
    mutation ResendOtp($input: ResendOtpInput!) {
  resendOtp(input: $input) {
    message
    success
  }
}
    `;
export type ResendOtpMutationFn = ApolloReactCommon.MutationFunction<ResendOtpMutation, ResendOtpMutationVariables>;
export function useResendOtpMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ResendOtpMutation, ResendOtpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ResendOtpMutation, ResendOtpMutationVariables>(ResendOtpDocument, options);
      }
export type ResendOtpMutationHookResult = ReturnType<typeof useResendOtpMutation>;
export type ResendOtpMutationResult = ApolloReactCommon.MutationResult<ResendOtpMutation>;
export type ResendOtpMutationOptions = ApolloReactCommon.BaseMutationOptions<ResendOtpMutation, ResendOtpMutationVariables>;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    company_name
    public_id
    private_id
    contact_person
    email
    phone_no
    address
    status
    gender
    type_of_business
    role
  }
}
    `;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;
export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($input: ForgotPasswordInput!) {
  forgotPassword(input: $input) {
    success
    message
  }
}
    `;
export type ForgotPasswordMutationFn = ApolloReactCommon.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export function useForgotPasswordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = ApolloReactCommon.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = ApolloReactCommon.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($input: ResetPasswordInput!) {
  resetPassword(input: $input) {
    success
    message
  }
}
    `;
export type ResetPasswordMutationFn = ApolloReactCommon.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;
export function useResetPasswordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = ApolloReactCommon.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = ApolloReactCommon.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout {
    success
    message
  }
}
    `;
export type LogoutMutationFn = ApolloReactCommon.MutationFunction<LogoutMutation, LogoutMutationVariables>;
export function useLogoutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReactCommon.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = ApolloReactCommon.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const CreateChatRoomDocument = gql`
    mutation CreateChatRoom($input: CreateRoomInput!) {
  createChatRoom(input: $input) {
    id
    name
    participantIds
    createdAt
  }
}
    `;
export type CreateChatRoomMutationFn = ApolloReactCommon.MutationFunction<CreateChatRoomMutation, CreateChatRoomMutationVariables>;
export function useCreateChatRoomMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateChatRoomMutation, CreateChatRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateChatRoomMutation, CreateChatRoomMutationVariables>(CreateChatRoomDocument, options);
      }
export type CreateChatRoomMutationHookResult = ReturnType<typeof useCreateChatRoomMutation>;
export type CreateChatRoomMutationResult = ApolloReactCommon.MutationResult<CreateChatRoomMutation>;
export type CreateChatRoomMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateChatRoomMutation, CreateChatRoomMutationVariables>;
export const SendChatMessageDocument = gql`
    mutation SendChatMessage($input: SendMessageInput!) {
  sendChatMessage(input: $input) {
    id
    roomId
    senderId
    receiverId
    message
    createdAt
  }
}
    `;
export type SendChatMessageMutationFn = ApolloReactCommon.MutationFunction<SendChatMessageMutation, SendChatMessageMutationVariables>;
export function useSendChatMessageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SendChatMessageMutation, SendChatMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SendChatMessageMutation, SendChatMessageMutationVariables>(SendChatMessageDocument, options);
      }
export type SendChatMessageMutationHookResult = ReturnType<typeof useSendChatMessageMutation>;
export type SendChatMessageMutationResult = ApolloReactCommon.MutationResult<SendChatMessageMutation>;
export type SendChatMessageMutationOptions = ApolloReactCommon.BaseMutationOptions<SendChatMessageMutation, SendChatMessageMutationVariables>;
export const JoinChatRoomDocument = gql`
    mutation JoinChatRoom($input: JoinRoomInput!) {
  joinChatRoom(input: $input) {
    id
    name
    participantIds
  }
}
    `;
export type JoinChatRoomMutationFn = ApolloReactCommon.MutationFunction<JoinChatRoomMutation, JoinChatRoomMutationVariables>;
export function useJoinChatRoomMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<JoinChatRoomMutation, JoinChatRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<JoinChatRoomMutation, JoinChatRoomMutationVariables>(JoinChatRoomDocument, options);
      }
export type JoinChatRoomMutationHookResult = ReturnType<typeof useJoinChatRoomMutation>;
export type JoinChatRoomMutationResult = ApolloReactCommon.MutationResult<JoinChatRoomMutation>;
export type JoinChatRoomMutationOptions = ApolloReactCommon.BaseMutationOptions<JoinChatRoomMutation, JoinChatRoomMutationVariables>;
export const GetOrCreatePrivateChatRoomDocument = gql`
    mutation GetOrCreatePrivateChatRoom($receiverId: String!) {
  getOrCreatePrivateChatRoom(receiverId: $receiverId) {
    id
    name
    participantIds
    createdAt
  }
}
    `;
export type GetOrCreatePrivateChatRoomMutationFn = ApolloReactCommon.MutationFunction<GetOrCreatePrivateChatRoomMutation, GetOrCreatePrivateChatRoomMutationVariables>;
export function useGetOrCreatePrivateChatRoomMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<GetOrCreatePrivateChatRoomMutation, GetOrCreatePrivateChatRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<GetOrCreatePrivateChatRoomMutation, GetOrCreatePrivateChatRoomMutationVariables>(GetOrCreatePrivateChatRoomDocument, options);
      }
export type GetOrCreatePrivateChatRoomMutationHookResult = ReturnType<typeof useGetOrCreatePrivateChatRoomMutation>;
export type GetOrCreatePrivateChatRoomMutationResult = ApolloReactCommon.MutationResult<GetOrCreatePrivateChatRoomMutation>;
export type GetOrCreatePrivateChatRoomMutationOptions = ApolloReactCommon.BaseMutationOptions<GetOrCreatePrivateChatRoomMutation, GetOrCreatePrivateChatRoomMutationVariables>;
export const CreateCustomerDocument = gql`
    mutation CreateCustomer($input: CreateCustomerInput!) {
  createCustomer(input: $input) {
    id
    name
    email
    phone
    address
    createdAt
  }
}
    `;
export type CreateCustomerMutationFn = ApolloReactCommon.MutationFunction<CreateCustomerMutation, CreateCustomerMutationVariables>;
export function useCreateCustomerMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateCustomerMutation, CreateCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateCustomerMutation, CreateCustomerMutationVariables>(CreateCustomerDocument, options);
      }
export type CreateCustomerMutationHookResult = ReturnType<typeof useCreateCustomerMutation>;
export type CreateCustomerMutationResult = ApolloReactCommon.MutationResult<CreateCustomerMutation>;
export type CreateCustomerMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateCustomerMutation, CreateCustomerMutationVariables>;
export const UpdateCustomerDocument = gql`
    mutation UpdateCustomer($id: String!, $input: UpdateCustomerInput!) {
  updateCustomer(id: $id, input: $input) {
    id
    name
    email
    phone
    address
    createdAt
  }
}
    `;
export type UpdateCustomerMutationFn = ApolloReactCommon.MutationFunction<UpdateCustomerMutation, UpdateCustomerMutationVariables>;
export function useUpdateCustomerMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateCustomerMutation, UpdateCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateCustomerMutation, UpdateCustomerMutationVariables>(UpdateCustomerDocument, options);
      }
export type UpdateCustomerMutationHookResult = ReturnType<typeof useUpdateCustomerMutation>;
export type UpdateCustomerMutationResult = ApolloReactCommon.MutationResult<UpdateCustomerMutation>;
export type UpdateCustomerMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateCustomerMutation, UpdateCustomerMutationVariables>;
export const DeleteCustomerDocument = gql`
    mutation DeleteCustomer($id: String!) {
  deleteCustomer(id: $id)
}
    `;
export type DeleteCustomerMutationFn = ApolloReactCommon.MutationFunction<DeleteCustomerMutation, DeleteCustomerMutationVariables>;
export function useDeleteCustomerMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteCustomerMutation, DeleteCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteCustomerMutation, DeleteCustomerMutationVariables>(DeleteCustomerDocument, options);
      }
export type DeleteCustomerMutationHookResult = ReturnType<typeof useDeleteCustomerMutation>;
export type DeleteCustomerMutationResult = ApolloReactCommon.MutationResult<DeleteCustomerMutation>;
export type DeleteCustomerMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteCustomerMutation, DeleteCustomerMutationVariables>;
export const CreateInventoryDocument = gql`
    mutation CreateInventory($input: CreateInventoryInput!) {
  createInventory(input: $input) {
    id
    inventory_id
    description
    price
    quantity
    sku
    images
    created_at
  }
}
    `;
export type CreateInventoryMutationFn = ApolloReactCommon.MutationFunction<CreateInventoryMutation, CreateInventoryMutationVariables>;
export function useCreateInventoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateInventoryMutation, CreateInventoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateInventoryMutation, CreateInventoryMutationVariables>(CreateInventoryDocument, options);
      }
export type CreateInventoryMutationHookResult = ReturnType<typeof useCreateInventoryMutation>;
export type CreateInventoryMutationResult = ApolloReactCommon.MutationResult<CreateInventoryMutation>;
export type CreateInventoryMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateInventoryMutation, CreateInventoryMutationVariables>;
export const UpdateInventoryDocument = gql`
    mutation UpdateInventory($inventory_id: String!, $input: UpdateInventoryInput!) {
  updateInventory(inventory_id: $inventory_id, input: $input) {
    inventory_id
    description
    price
    quantity
    updated_at
  }
}
    `;
export type UpdateInventoryMutationFn = ApolloReactCommon.MutationFunction<UpdateInventoryMutation, UpdateInventoryMutationVariables>;
export function useUpdateInventoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateInventoryMutation, UpdateInventoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateInventoryMutation, UpdateInventoryMutationVariables>(UpdateInventoryDocument, options);
      }
export type UpdateInventoryMutationHookResult = ReturnType<typeof useUpdateInventoryMutation>;
export type UpdateInventoryMutationResult = ApolloReactCommon.MutationResult<UpdateInventoryMutation>;
export type UpdateInventoryMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateInventoryMutation, UpdateInventoryMutationVariables>;
export const DeleteInventoryDocument = gql`
    mutation DeleteInventory($inventory_id: String!) {
  deleteInventory(inventory_id: $inventory_id) {
    message
  }
}
    `;
export type DeleteInventoryMutationFn = ApolloReactCommon.MutationFunction<DeleteInventoryMutation, DeleteInventoryMutationVariables>;
export function useDeleteInventoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteInventoryMutation, DeleteInventoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteInventoryMutation, DeleteInventoryMutationVariables>(DeleteInventoryDocument, options);
      }
export type DeleteInventoryMutationHookResult = ReturnType<typeof useDeleteInventoryMutation>;
export type DeleteInventoryMutationResult = ApolloReactCommon.MutationResult<DeleteInventoryMutation>;
export type DeleteInventoryMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteInventoryMutation, DeleteInventoryMutationVariables>;
export const IndexAllProductsDocument = gql`
    mutation IndexAllProducts {
  indexAllProducts
}
    `;
export type IndexAllProductsMutationFn = ApolloReactCommon.MutationFunction<IndexAllProductsMutation, IndexAllProductsMutationVariables>;
export function useIndexAllProductsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<IndexAllProductsMutation, IndexAllProductsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<IndexAllProductsMutation, IndexAllProductsMutationVariables>(IndexAllProductsDocument, options);
      }
export type IndexAllProductsMutationHookResult = ReturnType<typeof useIndexAllProductsMutation>;
export type IndexAllProductsMutationResult = ApolloReactCommon.MutationResult<IndexAllProductsMutation>;
export type IndexAllProductsMutationOptions = ApolloReactCommon.BaseMutationOptions<IndexAllProductsMutation, IndexAllProductsMutationVariables>;
export const GenerateMissingSummariesDocument = gql`
    mutation GenerateMissingSummaries {
  generateMissingSummaries {
    totalRows
    successfulRows
    failedRows
    errors
    message
  }
}
    `;
export type GenerateMissingSummariesMutationFn = ApolloReactCommon.MutationFunction<GenerateMissingSummariesMutation, GenerateMissingSummariesMutationVariables>;
export function useGenerateMissingSummariesMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<GenerateMissingSummariesMutation, GenerateMissingSummariesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<GenerateMissingSummariesMutation, GenerateMissingSummariesMutationVariables>(GenerateMissingSummariesDocument, options);
      }
export type GenerateMissingSummariesMutationHookResult = ReturnType<typeof useGenerateMissingSummariesMutation>;
export type GenerateMissingSummariesMutationResult = ApolloReactCommon.MutationResult<GenerateMissingSummariesMutation>;
export type GenerateMissingSummariesMutationOptions = ApolloReactCommon.BaseMutationOptions<GenerateMissingSummariesMutation, GenerateMissingSummariesMutationVariables>;
export const GenerateProductSummaryDocument = gql`
    mutation GenerateProductSummary($input: GenerateSummaryInput!) {
  generateProductSummary(input: $input) {
    productId
    summary
    keyFeatures
    targetAudience
  }
}
    `;
export type GenerateProductSummaryMutationFn = ApolloReactCommon.MutationFunction<GenerateProductSummaryMutation, GenerateProductSummaryMutationVariables>;
export function useGenerateProductSummaryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<GenerateProductSummaryMutation, GenerateProductSummaryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<GenerateProductSummaryMutation, GenerateProductSummaryMutationVariables>(GenerateProductSummaryDocument, options);
      }
export type GenerateProductSummaryMutationHookResult = ReturnType<typeof useGenerateProductSummaryMutation>;
export type GenerateProductSummaryMutationResult = ApolloReactCommon.MutationResult<GenerateProductSummaryMutation>;
export type GenerateProductSummaryMutationOptions = ApolloReactCommon.BaseMutationOptions<GenerateProductSummaryMutation, GenerateProductSummaryMutationVariables>;
export const CreateInvoiceDocument = gql`
    mutation CreateInvoice($input: CreateInvoiceInput!) {
  createInvoice(input: $input) {
    id
    invoice_number
    invoice_type
    status
    bill_from_public_id
    bill_to_public_id
    bill_from_status
    bill_to_status
    invoice_date
    total_amount
    items {
      id
      inventory_id
      qty
      rate
      discount_percentage
      total_price
    }
    created_at
  }
}
    `;
export type CreateInvoiceMutationFn = ApolloReactCommon.MutationFunction<CreateInvoiceMutation, CreateInvoiceMutationVariables>;
export function useCreateInvoiceMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateInvoiceMutation, CreateInvoiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateInvoiceMutation, CreateInvoiceMutationVariables>(CreateInvoiceDocument, options);
      }
export type CreateInvoiceMutationHookResult = ReturnType<typeof useCreateInvoiceMutation>;
export type CreateInvoiceMutationResult = ApolloReactCommon.MutationResult<CreateInvoiceMutation>;
export type CreateInvoiceMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateInvoiceMutation, CreateInvoiceMutationVariables>;
export const UpdateInvoiceDocument = gql`
    mutation UpdateInvoice($invoice_number: String!, $input: UpdateInvoiceInput!) {
  updateInvoice(invoice_number: $invoice_number, input: $input) {
    id
    invoice_number
    invoice_type
    status
    bill_from_public_id
    bill_to_public_id
    total_amount
    invoice_date
    items {
      id
      inventory_id
      qty
      rate
      discount_percentage
      total_price
    }
    created_at
    updated_at
  }
}
    `;
export type UpdateInvoiceMutationFn = ApolloReactCommon.MutationFunction<UpdateInvoiceMutation, UpdateInvoiceMutationVariables>;
export function useUpdateInvoiceMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateInvoiceMutation, UpdateInvoiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateInvoiceMutation, UpdateInvoiceMutationVariables>(UpdateInvoiceDocument, options);
      }
export type UpdateInvoiceMutationHookResult = ReturnType<typeof useUpdateInvoiceMutation>;
export type UpdateInvoiceMutationResult = ApolloReactCommon.MutationResult<UpdateInvoiceMutation>;
export type UpdateInvoiceMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateInvoiceMutation, UpdateInvoiceMutationVariables>;
export const DeleteInvoiceDocument = gql`
    mutation DeleteInvoice($invoice_number: String!) {
  deleteInvoice(invoice_number: $invoice_number) {
    invoice_number
    status
    total_amount
  }
}
    `;
export type DeleteInvoiceMutationFn = ApolloReactCommon.MutationFunction<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>;
export function useDeleteInvoiceMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>(DeleteInvoiceDocument, options);
      }
export type DeleteInvoiceMutationHookResult = ReturnType<typeof useDeleteInvoiceMutation>;
export type DeleteInvoiceMutationResult = ApolloReactCommon.MutationResult<DeleteInvoiceMutation>;
export type DeleteInvoiceMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>;
export const UpdateInvoiceStatusDocument = gql`
    mutation UpdateInvoiceStatus($input: UpdateInvoiceStatusInput!) {
  updateInvoiceStatus(input: $input) {
    id
    invoice_number
    status
    bill_from_status
    bill_to_status
    updated_at
  }
}
    `;
export type UpdateInvoiceStatusMutationFn = ApolloReactCommon.MutationFunction<UpdateInvoiceStatusMutation, UpdateInvoiceStatusMutationVariables>;
export function useUpdateInvoiceStatusMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateInvoiceStatusMutation, UpdateInvoiceStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateInvoiceStatusMutation, UpdateInvoiceStatusMutationVariables>(UpdateInvoiceStatusDocument, options);
      }
export type UpdateInvoiceStatusMutationHookResult = ReturnType<typeof useUpdateInvoiceStatusMutation>;
export type UpdateInvoiceStatusMutationResult = ApolloReactCommon.MutationResult<UpdateInvoiceStatusMutation>;
export type UpdateInvoiceStatusMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateInvoiceStatusMutation, UpdateInvoiceStatusMutationVariables>;
export const UpdateMyProfileDocument = gql`
    mutation UpdateMyProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    id
    company_name
    contact_person
    phone_no
    address
    updated_at
  }
}
    `;
export type UpdateMyProfileMutationFn = ApolloReactCommon.MutationFunction<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>;
export function useUpdateMyProfileMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>(UpdateMyProfileDocument, options);
      }
export type UpdateMyProfileMutationHookResult = ReturnType<typeof useUpdateMyProfileMutation>;
export type UpdateMyProfileMutationResult = ApolloReactCommon.MutationResult<UpdateMyProfileMutation>;
export type UpdateMyProfileMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>;
export const SendSupplierRequestDocument = gql`
    mutation SendSupplierRequest($input: SendRelationshipRequestInput!) {
  sendRelationshipRequest(input: $input) {
    id
    requester_public_id
    requested_public_id
    relationship_type
    status
    created_at
  }
}
    `;
export type SendSupplierRequestMutationFn = ApolloReactCommon.MutationFunction<SendSupplierRequestMutation, SendSupplierRequestMutationVariables>;
export function useSendSupplierRequestMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SendSupplierRequestMutation, SendSupplierRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SendSupplierRequestMutation, SendSupplierRequestMutationVariables>(SendSupplierRequestDocument, options);
      }
export type SendSupplierRequestMutationHookResult = ReturnType<typeof useSendSupplierRequestMutation>;
export type SendSupplierRequestMutationResult = ApolloReactCommon.MutationResult<SendSupplierRequestMutation>;
export type SendSupplierRequestMutationOptions = ApolloReactCommon.BaseMutationOptions<SendSupplierRequestMutation, SendSupplierRequestMutationVariables>;
export const AcceptRequestDocument = gql`
    mutation AcceptRequest($input: AcceptRejectRequestInput!) {
  acceptRejectRequest(input: $input) {
    id
    status
    updated_at
  }
}
    `;
export type AcceptRequestMutationFn = ApolloReactCommon.MutationFunction<AcceptRequestMutation, AcceptRequestMutationVariables>;
export function useAcceptRequestMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AcceptRequestMutation, AcceptRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AcceptRequestMutation, AcceptRequestMutationVariables>(AcceptRequestDocument, options);
      }
export type AcceptRequestMutationHookResult = ReturnType<typeof useAcceptRequestMutation>;
export type AcceptRequestMutationResult = ApolloReactCommon.MutationResult<AcceptRequestMutation>;
export type AcceptRequestMutationOptions = ApolloReactCommon.BaseMutationOptions<AcceptRequestMutation, AcceptRequestMutationVariables>;
export const VerifySignupOtpDocument = gql`
    mutation VerifySignupOtp($email: String!, $otp: String!, $purpose: String!) {
  verifyOtp(input: {email: $email, otp: $otp, purpose: $purpose}) {
    success
    message
  }
}
    `;
export type VerifySignupOtpMutationFn = ApolloReactCommon.MutationFunction<VerifySignupOtpMutation, VerifySignupOtpMutationVariables>;
export function useVerifySignupOtpMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<VerifySignupOtpMutation, VerifySignupOtpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<VerifySignupOtpMutation, VerifySignupOtpMutationVariables>(VerifySignupOtpDocument, options);
      }
export type VerifySignupOtpMutationHookResult = ReturnType<typeof useVerifySignupOtpMutation>;
export type VerifySignupOtpMutationResult = ApolloReactCommon.MutationResult<VerifySignupOtpMutation>;
export type VerifySignupOtpMutationOptions = ApolloReactCommon.BaseMutationOptions<VerifySignupOtpMutation, VerifySignupOtpMutationVariables>;
export const LoginWithEmailDocument = gql`
    mutation LoginWithEmail($email: String!, $password: String!) {
  login(input: {email: $email, password: $password}) {
    token
    company_name
    public_id
    private_id
    contact_person
    email
    phone_no
    address
    status
    gender
    type_of_business
    role
  }
}
    `;
export type LoginWithEmailMutationFn = ApolloReactCommon.MutationFunction<LoginWithEmailMutation, LoginWithEmailMutationVariables>;
export function useLoginWithEmailMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginWithEmailMutation, LoginWithEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LoginWithEmailMutation, LoginWithEmailMutationVariables>(LoginWithEmailDocument, options);
      }
export type LoginWithEmailMutationHookResult = ReturnType<typeof useLoginWithEmailMutation>;
export type LoginWithEmailMutationResult = ApolloReactCommon.MutationResult<LoginWithEmailMutation>;
export type LoginWithEmailMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginWithEmailMutation, LoginWithEmailMutationVariables>;
export const LoginWithPhoneDocument = gql`
    mutation LoginWithPhone($phone_no: String!, $password: String!) {
  login(input: {phone_no: $phone_no, password: $password}) {
    token
    company_name
    public_id
    private_id
    contact_person
    email
    phone_no
    role
  }
}
    `;
export type LoginWithPhoneMutationFn = ApolloReactCommon.MutationFunction<LoginWithPhoneMutation, LoginWithPhoneMutationVariables>;
export function useLoginWithPhoneMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginWithPhoneMutation, LoginWithPhoneMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LoginWithPhoneMutation, LoginWithPhoneMutationVariables>(LoginWithPhoneDocument, options);
      }
export type LoginWithPhoneMutationHookResult = ReturnType<typeof useLoginWithPhoneMutation>;
export type LoginWithPhoneMutationResult = ApolloReactCommon.MutationResult<LoginWithPhoneMutation>;
export type LoginWithPhoneMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginWithPhoneMutation, LoginWithPhoneMutationVariables>;
export const GetRoomMessagesDocument = gql`
    query GetRoomMessages($roomId: String!) {
  chatRoomMessages(roomId: $roomId) {
    id
    senderId
    receiverId
    message
    createdAt
  }
}
    `;
export function useGetRoomMessagesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetRoomMessagesQuery, GetRoomMessagesQueryVariables> & ({ variables: GetRoomMessagesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRoomMessagesQuery, GetRoomMessagesQueryVariables>(GetRoomMessagesDocument, options);
      }
export function useGetRoomMessagesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRoomMessagesQuery, GetRoomMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRoomMessagesQuery, GetRoomMessagesQueryVariables>(GetRoomMessagesDocument, options);
        }
export function useGetRoomMessagesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetRoomMessagesQuery, GetRoomMessagesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetRoomMessagesQuery, GetRoomMessagesQueryVariables>(GetRoomMessagesDocument, options);
        }
export type GetRoomMessagesQueryHookResult = ReturnType<typeof useGetRoomMessagesQuery>;
export type GetRoomMessagesLazyQueryHookResult = ReturnType<typeof useGetRoomMessagesLazyQuery>;
export type GetRoomMessagesSuspenseQueryHookResult = ReturnType<typeof useGetRoomMessagesSuspenseQuery>;
export type GetRoomMessagesQueryResult = ApolloReactCommon.QueryResult<GetRoomMessagesQuery, GetRoomMessagesQueryVariables>;
export const GetUserChatRoomsDocument = gql`
    query GetUserChatRooms {
  userChatRooms {
    id
    name
    participantIds
    createdAt
  }
}
    `;
export function useGetUserChatRoomsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetUserChatRoomsQuery, GetUserChatRoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserChatRoomsQuery, GetUserChatRoomsQueryVariables>(GetUserChatRoomsDocument, options);
      }
export function useGetUserChatRoomsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserChatRoomsQuery, GetUserChatRoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserChatRoomsQuery, GetUserChatRoomsQueryVariables>(GetUserChatRoomsDocument, options);
        }
export function useGetUserChatRoomsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserChatRoomsQuery, GetUserChatRoomsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUserChatRoomsQuery, GetUserChatRoomsQueryVariables>(GetUserChatRoomsDocument, options);
        }
export type GetUserChatRoomsQueryHookResult = ReturnType<typeof useGetUserChatRoomsQuery>;
export type GetUserChatRoomsLazyQueryHookResult = ReturnType<typeof useGetUserChatRoomsLazyQuery>;
export type GetUserChatRoomsSuspenseQueryHookResult = ReturnType<typeof useGetUserChatRoomsSuspenseQuery>;
export type GetUserChatRoomsQueryResult = ApolloReactCommon.QueryResult<GetUserChatRoomsQuery, GetUserChatRoomsQueryVariables>;
export const GetRagDataSummaryDocument = gql`
    query GetRagDataSummary {
  getRagDataSummary
}
    `;
export function useGetRagDataSummaryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRagDataSummaryQuery, GetRagDataSummaryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRagDataSummaryQuery, GetRagDataSummaryQueryVariables>(GetRagDataSummaryDocument, options);
      }
export function useGetRagDataSummaryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRagDataSummaryQuery, GetRagDataSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRagDataSummaryQuery, GetRagDataSummaryQueryVariables>(GetRagDataSummaryDocument, options);
        }
export function useGetRagDataSummarySuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetRagDataSummaryQuery, GetRagDataSummaryQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetRagDataSummaryQuery, GetRagDataSummaryQueryVariables>(GetRagDataSummaryDocument, options);
        }
export type GetRagDataSummaryQueryHookResult = ReturnType<typeof useGetRagDataSummaryQuery>;
export type GetRagDataSummaryLazyQueryHookResult = ReturnType<typeof useGetRagDataSummaryLazyQuery>;
export type GetRagDataSummarySuspenseQueryHookResult = ReturnType<typeof useGetRagDataSummarySuspenseQuery>;
export type GetRagDataSummaryQueryResult = ApolloReactCommon.QueryResult<GetRagDataSummaryQuery, GetRagDataSummaryQueryVariables>;
export const QueryWithRagDocument = gql`
    query QueryWithRag($query: String!) {
  queryWithRag(input: {query: $query}) {
    answer
    sources
    confidenceScore
    followUpSuggestions
  }
}
    `;
export function useQueryWithRagQuery(baseOptions: ApolloReactHooks.QueryHookOptions<QueryWithRagQuery, QueryWithRagQueryVariables> & ({ variables: QueryWithRagQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<QueryWithRagQuery, QueryWithRagQueryVariables>(QueryWithRagDocument, options);
      }
export function useQueryWithRagLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<QueryWithRagQuery, QueryWithRagQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<QueryWithRagQuery, QueryWithRagQueryVariables>(QueryWithRagDocument, options);
        }
export function useQueryWithRagSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<QueryWithRagQuery, QueryWithRagQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<QueryWithRagQuery, QueryWithRagQueryVariables>(QueryWithRagDocument, options);
        }
export type QueryWithRagQueryHookResult = ReturnType<typeof useQueryWithRagQuery>;
export type QueryWithRagLazyQueryHookResult = ReturnType<typeof useQueryWithRagLazyQuery>;
export type QueryWithRagSuspenseQueryHookResult = ReturnType<typeof useQueryWithRagSuspenseQuery>;
export type QueryWithRagQueryResult = ApolloReactCommon.QueryResult<QueryWithRagQuery, QueryWithRagQueryVariables>;
export const GetAllCustomersDocument = gql`
    query GetAllCustomers {
  customers {
    id
    name
    email
    phone
    address
    createdAt
  }
}
    `;
export function useGetAllCustomersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAllCustomersQuery, GetAllCustomersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetAllCustomersQuery, GetAllCustomersQueryVariables>(GetAllCustomersDocument, options);
      }
export function useGetAllCustomersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAllCustomersQuery, GetAllCustomersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetAllCustomersQuery, GetAllCustomersQueryVariables>(GetAllCustomersDocument, options);
        }
export function useGetAllCustomersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAllCustomersQuery, GetAllCustomersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetAllCustomersQuery, GetAllCustomersQueryVariables>(GetAllCustomersDocument, options);
        }
export type GetAllCustomersQueryHookResult = ReturnType<typeof useGetAllCustomersQuery>;
export type GetAllCustomersLazyQueryHookResult = ReturnType<typeof useGetAllCustomersLazyQuery>;
export type GetAllCustomersSuspenseQueryHookResult = ReturnType<typeof useGetAllCustomersSuspenseQuery>;
export type GetAllCustomersQueryResult = ApolloReactCommon.QueryResult<GetAllCustomersQuery, GetAllCustomersQueryVariables>;
export const GetCustomerDocument = gql`
    query GetCustomer($id: String!) {
  customer(id: $id) {
    id
    name
    email
    phone
    address
    createdAt
  }
}
    `;
export function useGetCustomerQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetCustomerQuery, GetCustomerQueryVariables> & ({ variables: GetCustomerQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetCustomerQuery, GetCustomerQueryVariables>(GetCustomerDocument, options);
      }
export function useGetCustomerLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCustomerQuery, GetCustomerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetCustomerQuery, GetCustomerQueryVariables>(GetCustomerDocument, options);
        }
export function useGetCustomerSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetCustomerQuery, GetCustomerQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetCustomerQuery, GetCustomerQueryVariables>(GetCustomerDocument, options);
        }
export type GetCustomerQueryHookResult = ReturnType<typeof useGetCustomerQuery>;
export type GetCustomerLazyQueryHookResult = ReturnType<typeof useGetCustomerLazyQuery>;
export type GetCustomerSuspenseQueryHookResult = ReturnType<typeof useGetCustomerSuspenseQuery>;
export type GetCustomerQueryResult = ApolloReactCommon.QueryResult<GetCustomerQuery, GetCustomerQueryVariables>;
export const GetDashboardStatsDocument = gql`
    query GetDashboardStats {
  dashboardStats {
    id
    totalCustomers
    totalProducts
    totalInvoices
    totalRevenue
    activeUsers
    pendingInvoices
    timestamp
  }
}
    `;
export function useGetDashboardStatsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>(GetDashboardStatsDocument, options);
      }
export function useGetDashboardStatsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>(GetDashboardStatsDocument, options);
        }
export function useGetDashboardStatsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>(GetDashboardStatsDocument, options);
        }
export type GetDashboardStatsQueryHookResult = ReturnType<typeof useGetDashboardStatsQuery>;
export type GetDashboardStatsLazyQueryHookResult = ReturnType<typeof useGetDashboardStatsLazyQuery>;
export type GetDashboardStatsSuspenseQueryHookResult = ReturnType<typeof useGetDashboardStatsSuspenseQuery>;
export type GetDashboardStatsQueryResult = ApolloReactCommon.QueryResult<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>;
export const ExportProductsCsvDocument = gql`
    query ExportProductsCSV {
  exportData(input: {dataType: "products", format: "csv"}) {
    format
    fileName
    fileUrl
    recordCount
  }
}
    `;
export function useExportProductsCsvQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ExportProductsCsvQuery, ExportProductsCsvQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ExportProductsCsvQuery, ExportProductsCsvQueryVariables>(ExportProductsCsvDocument, options);
      }
export function useExportProductsCsvLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ExportProductsCsvQuery, ExportProductsCsvQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ExportProductsCsvQuery, ExportProductsCsvQueryVariables>(ExportProductsCsvDocument, options);
        }
export function useExportProductsCsvSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ExportProductsCsvQuery, ExportProductsCsvQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ExportProductsCsvQuery, ExportProductsCsvQueryVariables>(ExportProductsCsvDocument, options);
        }
export type ExportProductsCsvQueryHookResult = ReturnType<typeof useExportProductsCsvQuery>;
export type ExportProductsCsvLazyQueryHookResult = ReturnType<typeof useExportProductsCsvLazyQuery>;
export type ExportProductsCsvSuspenseQueryHookResult = ReturnType<typeof useExportProductsCsvSuspenseQuery>;
export type ExportProductsCsvQueryResult = ApolloReactCommon.QueryResult<ExportProductsCsvQuery, ExportProductsCsvQueryVariables>;
export const ExportProductsExcelDocument = gql`
    query ExportProductsExcel {
  exportData(input: {dataType: "products", format: "excel"}) {
    format
    fileName
    fileUrl
    recordCount
  }
}
    `;
export function useExportProductsExcelQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ExportProductsExcelQuery, ExportProductsExcelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ExportProductsExcelQuery, ExportProductsExcelQueryVariables>(ExportProductsExcelDocument, options);
      }
export function useExportProductsExcelLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ExportProductsExcelQuery, ExportProductsExcelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ExportProductsExcelQuery, ExportProductsExcelQueryVariables>(ExportProductsExcelDocument, options);
        }
export function useExportProductsExcelSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ExportProductsExcelQuery, ExportProductsExcelQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ExportProductsExcelQuery, ExportProductsExcelQueryVariables>(ExportProductsExcelDocument, options);
        }
export type ExportProductsExcelQueryHookResult = ReturnType<typeof useExportProductsExcelQuery>;
export type ExportProductsExcelLazyQueryHookResult = ReturnType<typeof useExportProductsExcelLazyQuery>;
export type ExportProductsExcelSuspenseQueryHookResult = ReturnType<typeof useExportProductsExcelSuspenseQuery>;
export type ExportProductsExcelQueryResult = ApolloReactCommon.QueryResult<ExportProductsExcelQuery, ExportProductsExcelQueryVariables>;
export const ExportCustomersCsvDocument = gql`
    query ExportCustomersCSV {
  exportData(input: {dataType: "customers", format: "csv"}) {
    format
    fileName
    fileUrl
    recordCount
  }
}
    `;
export function useExportCustomersCsvQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ExportCustomersCsvQuery, ExportCustomersCsvQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ExportCustomersCsvQuery, ExportCustomersCsvQueryVariables>(ExportCustomersCsvDocument, options);
      }
export function useExportCustomersCsvLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ExportCustomersCsvQuery, ExportCustomersCsvQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ExportCustomersCsvQuery, ExportCustomersCsvQueryVariables>(ExportCustomersCsvDocument, options);
        }
export function useExportCustomersCsvSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ExportCustomersCsvQuery, ExportCustomersCsvQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ExportCustomersCsvQuery, ExportCustomersCsvQueryVariables>(ExportCustomersCsvDocument, options);
        }
export type ExportCustomersCsvQueryHookResult = ReturnType<typeof useExportCustomersCsvQuery>;
export type ExportCustomersCsvLazyQueryHookResult = ReturnType<typeof useExportCustomersCsvLazyQuery>;
export type ExportCustomersCsvSuspenseQueryHookResult = ReturnType<typeof useExportCustomersCsvSuspenseQuery>;
export type ExportCustomersCsvQueryResult = ApolloReactCommon.QueryResult<ExportCustomersCsvQuery, ExportCustomersCsvQueryVariables>;
export const ExportCustomersExcelDocument = gql`
    query ExportCustomersExcel {
  exportData(input: {dataType: "customers", format: "excel"}) {
    format
    fileName
    fileUrl
    recordCount
  }
}
    `;
export function useExportCustomersExcelQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ExportCustomersExcelQuery, ExportCustomersExcelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ExportCustomersExcelQuery, ExportCustomersExcelQueryVariables>(ExportCustomersExcelDocument, options);
      }
export function useExportCustomersExcelLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ExportCustomersExcelQuery, ExportCustomersExcelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ExportCustomersExcelQuery, ExportCustomersExcelQueryVariables>(ExportCustomersExcelDocument, options);
        }
export function useExportCustomersExcelSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ExportCustomersExcelQuery, ExportCustomersExcelQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ExportCustomersExcelQuery, ExportCustomersExcelQueryVariables>(ExportCustomersExcelDocument, options);
        }
export type ExportCustomersExcelQueryHookResult = ReturnType<typeof useExportCustomersExcelQuery>;
export type ExportCustomersExcelLazyQueryHookResult = ReturnType<typeof useExportCustomersExcelLazyQuery>;
export type ExportCustomersExcelSuspenseQueryHookResult = ReturnType<typeof useExportCustomersExcelSuspenseQuery>;
export type ExportCustomersExcelQueryResult = ApolloReactCommon.QueryResult<ExportCustomersExcelQuery, ExportCustomersExcelQueryVariables>;
export const ExportInvoicesCsvDocument = gql`
    query ExportInvoicesCSV {
  exportData(input: {dataType: "invoices", format: "csv"}) {
    format
    fileName
    fileUrl
    recordCount
  }
}
    `;
export function useExportInvoicesCsvQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ExportInvoicesCsvQuery, ExportInvoicesCsvQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ExportInvoicesCsvQuery, ExportInvoicesCsvQueryVariables>(ExportInvoicesCsvDocument, options);
      }
export function useExportInvoicesCsvLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ExportInvoicesCsvQuery, ExportInvoicesCsvQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ExportInvoicesCsvQuery, ExportInvoicesCsvQueryVariables>(ExportInvoicesCsvDocument, options);
        }
export function useExportInvoicesCsvSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ExportInvoicesCsvQuery, ExportInvoicesCsvQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ExportInvoicesCsvQuery, ExportInvoicesCsvQueryVariables>(ExportInvoicesCsvDocument, options);
        }
export type ExportInvoicesCsvQueryHookResult = ReturnType<typeof useExportInvoicesCsvQuery>;
export type ExportInvoicesCsvLazyQueryHookResult = ReturnType<typeof useExportInvoicesCsvLazyQuery>;
export type ExportInvoicesCsvSuspenseQueryHookResult = ReturnType<typeof useExportInvoicesCsvSuspenseQuery>;
export type ExportInvoicesCsvQueryResult = ApolloReactCommon.QueryResult<ExportInvoicesCsvQuery, ExportInvoicesCsvQueryVariables>;
export const ExportInvoicesExcelDocument = gql`
    query ExportInvoicesExcel {
  exportData(input: {dataType: "invoices", format: "excel"}) {
    format
    fileName
    fileUrl
    recordCount
  }
}
    `;
export function useExportInvoicesExcelQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ExportInvoicesExcelQuery, ExportInvoicesExcelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ExportInvoicesExcelQuery, ExportInvoicesExcelQueryVariables>(ExportInvoicesExcelDocument, options);
      }
export function useExportInvoicesExcelLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ExportInvoicesExcelQuery, ExportInvoicesExcelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ExportInvoicesExcelQuery, ExportInvoicesExcelQueryVariables>(ExportInvoicesExcelDocument, options);
        }
export function useExportInvoicesExcelSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ExportInvoicesExcelQuery, ExportInvoicesExcelQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ExportInvoicesExcelQuery, ExportInvoicesExcelQueryVariables>(ExportInvoicesExcelDocument, options);
        }
export type ExportInvoicesExcelQueryHookResult = ReturnType<typeof useExportInvoicesExcelQuery>;
export type ExportInvoicesExcelLazyQueryHookResult = ReturnType<typeof useExportInvoicesExcelLazyQuery>;
export type ExportInvoicesExcelSuspenseQueryHookResult = ReturnType<typeof useExportInvoicesExcelSuspenseQuery>;
export type ExportInvoicesExcelQueryResult = ApolloReactCommon.QueryResult<ExportInvoicesExcelQuery, ExportInvoicesExcelQueryVariables>;
export const GetFinanceDashboardDocument = gql`
    query GetFinanceDashboard {
  getFinanceDashboard {
    total_income
    total_expense
    balance
    pending_income
    pending_expense
  }
}
    `;
export function useGetFinanceDashboardQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetFinanceDashboardQuery, GetFinanceDashboardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetFinanceDashboardQuery, GetFinanceDashboardQueryVariables>(GetFinanceDashboardDocument, options);
      }
export function useGetFinanceDashboardLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetFinanceDashboardQuery, GetFinanceDashboardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetFinanceDashboardQuery, GetFinanceDashboardQueryVariables>(GetFinanceDashboardDocument, options);
        }
export function useGetFinanceDashboardSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetFinanceDashboardQuery, GetFinanceDashboardQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetFinanceDashboardQuery, GetFinanceDashboardQueryVariables>(GetFinanceDashboardDocument, options);
        }
export type GetFinanceDashboardQueryHookResult = ReturnType<typeof useGetFinanceDashboardQuery>;
export type GetFinanceDashboardLazyQueryHookResult = ReturnType<typeof useGetFinanceDashboardLazyQuery>;
export type GetFinanceDashboardSuspenseQueryHookResult = ReturnType<typeof useGetFinanceDashboardSuspenseQuery>;
export type GetFinanceDashboardQueryResult = ApolloReactCommon.QueryResult<GetFinanceDashboardQuery, GetFinanceDashboardQueryVariables>;
export const GetMyInventoryDocument = gql`
    query GetMyInventory {
  getInventory {
    id
    inventory_id
    name
    description
    price
    quantity
    unit_price
    sku
    images
    created_at
    updated_at
  }
}
    `;
export function useGetMyInventoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetMyInventoryQuery, GetMyInventoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetMyInventoryQuery, GetMyInventoryQueryVariables>(GetMyInventoryDocument, options);
      }
export function useGetMyInventoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMyInventoryQuery, GetMyInventoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetMyInventoryQuery, GetMyInventoryQueryVariables>(GetMyInventoryDocument, options);
        }
export function useGetMyInventorySuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetMyInventoryQuery, GetMyInventoryQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetMyInventoryQuery, GetMyInventoryQueryVariables>(GetMyInventoryDocument, options);
        }
export type GetMyInventoryQueryHookResult = ReturnType<typeof useGetMyInventoryQuery>;
export type GetMyInventoryLazyQueryHookResult = ReturnType<typeof useGetMyInventoryLazyQuery>;
export type GetMyInventorySuspenseQueryHookResult = ReturnType<typeof useGetMyInventorySuspenseQuery>;
export type GetMyInventoryQueryResult = ApolloReactCommon.QueryResult<GetMyInventoryQuery, GetMyInventoryQueryVariables>;
export const GetInventoryItemDocument = gql`
    query GetInventoryItem($inventory_id: String!) {
  getInventoryById(inventory_id: $inventory_id) {
    id
    inventory_id
    name
    description
    price
    quantity
    unit_price
    sku
    images
  }
}
    `;
export function useGetInventoryItemQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetInventoryItemQuery, GetInventoryItemQueryVariables> & ({ variables: GetInventoryItemQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetInventoryItemQuery, GetInventoryItemQueryVariables>(GetInventoryItemDocument, options);
      }
export function useGetInventoryItemLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetInventoryItemQuery, GetInventoryItemQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetInventoryItemQuery, GetInventoryItemQueryVariables>(GetInventoryItemDocument, options);
        }
export function useGetInventoryItemSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetInventoryItemQuery, GetInventoryItemQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetInventoryItemQuery, GetInventoryItemQueryVariables>(GetInventoryItemDocument, options);
        }
export type GetInventoryItemQueryHookResult = ReturnType<typeof useGetInventoryItemQuery>;
export type GetInventoryItemLazyQueryHookResult = ReturnType<typeof useGetInventoryItemLazyQuery>;
export type GetInventoryItemSuspenseQueryHookResult = ReturnType<typeof useGetInventoryItemSuspenseQuery>;
export type GetInventoryItemQueryResult = ApolloReactCommon.QueryResult<GetInventoryItemQuery, GetInventoryItemQueryVariables>;
export const GetInvoiceChartsDocument = gql`
    query GetInvoiceCharts {
  invoiceCharts {
    last7Days {
      date
      count
      totalAmount
    }
  }
}
    `;
export function useGetInvoiceChartsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetInvoiceChartsQuery, GetInvoiceChartsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetInvoiceChartsQuery, GetInvoiceChartsQueryVariables>(GetInvoiceChartsDocument, options);
      }
export function useGetInvoiceChartsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetInvoiceChartsQuery, GetInvoiceChartsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetInvoiceChartsQuery, GetInvoiceChartsQueryVariables>(GetInvoiceChartsDocument, options);
        }
export function useGetInvoiceChartsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetInvoiceChartsQuery, GetInvoiceChartsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetInvoiceChartsQuery, GetInvoiceChartsQueryVariables>(GetInvoiceChartsDocument, options);
        }
export type GetInvoiceChartsQueryHookResult = ReturnType<typeof useGetInvoiceChartsQuery>;
export type GetInvoiceChartsLazyQueryHookResult = ReturnType<typeof useGetInvoiceChartsLazyQuery>;
export type GetInvoiceChartsSuspenseQueryHookResult = ReturnType<typeof useGetInvoiceChartsSuspenseQuery>;
export type GetInvoiceChartsQueryResult = ApolloReactCommon.QueryResult<GetInvoiceChartsQuery, GetInvoiceChartsQueryVariables>;
export const GetMyInvoicesDocument = gql`
    query GetMyInvoices {
  getInvoices {
    id
    invoice_number
    invoice_type
    status
    bill_from_public_id
    bill_to_public_id
    bill_from_status
    bill_to_status
    invoice_date
    total_amount
    bill_from_name
    bill_to_name
    created_at
    items {
      inventory_id
      qty
      rate
      discount_percentage
      total_price
    }
  }
}
    `;
export function useGetMyInvoicesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetMyInvoicesQuery, GetMyInvoicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetMyInvoicesQuery, GetMyInvoicesQueryVariables>(GetMyInvoicesDocument, options);
      }
export function useGetMyInvoicesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMyInvoicesQuery, GetMyInvoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetMyInvoicesQuery, GetMyInvoicesQueryVariables>(GetMyInvoicesDocument, options);
        }
export function useGetMyInvoicesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetMyInvoicesQuery, GetMyInvoicesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetMyInvoicesQuery, GetMyInvoicesQueryVariables>(GetMyInvoicesDocument, options);
        }
export type GetMyInvoicesQueryHookResult = ReturnType<typeof useGetMyInvoicesQuery>;
export type GetMyInvoicesLazyQueryHookResult = ReturnType<typeof useGetMyInvoicesLazyQuery>;
export type GetMyInvoicesSuspenseQueryHookResult = ReturnType<typeof useGetMyInvoicesSuspenseQuery>;
export type GetMyInvoicesQueryResult = ApolloReactCommon.QueryResult<GetMyInvoicesQuery, GetMyInvoicesQueryVariables>;
export const GetInvoiceDocument = gql`
    query GetInvoice($invoice_number: String!) {
  getInvoiceByNumber(invoice_number: $invoice_number) {
    id
    invoice_number
    invoice_type
    status
    bill_from_public_id
    bill_to_public_id
    bill_from_status
    bill_to_status
    invoice_date
    total_amount
    bill_from_name
    bill_from_email
    bill_from_phone
    bill_from_address
    bill_to_name
    bill_to_email
    bill_to_phone
    bill_to_address
    items {
      id
      inventory_id
      qty
      rate
      discount_percentage
      total_price
    }
    created_at
    updated_at
  }
}
    `;
export function useGetInvoiceQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetInvoiceQuery, GetInvoiceQueryVariables> & ({ variables: GetInvoiceQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetInvoiceQuery, GetInvoiceQueryVariables>(GetInvoiceDocument, options);
      }
export function useGetInvoiceLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetInvoiceQuery, GetInvoiceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetInvoiceQuery, GetInvoiceQueryVariables>(GetInvoiceDocument, options);
        }
export function useGetInvoiceSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetInvoiceQuery, GetInvoiceQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetInvoiceQuery, GetInvoiceQueryVariables>(GetInvoiceDocument, options);
        }
export type GetInvoiceQueryHookResult = ReturnType<typeof useGetInvoiceQuery>;
export type GetInvoiceLazyQueryHookResult = ReturnType<typeof useGetInvoiceLazyQuery>;
export type GetInvoiceSuspenseQueryHookResult = ReturnType<typeof useGetInvoiceSuspenseQuery>;
export type GetInvoiceQueryResult = ApolloReactCommon.QueryResult<GetInvoiceQuery, GetInvoiceQueryVariables>;
export const GetInvoicesForChartsDocument = gql`
    query GetInvoicesForCharts {
  invoices: getInvoices {
    id
    created_at
    total_amount
  }
}
    `;
export function useGetInvoicesForChartsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetInvoicesForChartsQuery, GetInvoicesForChartsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetInvoicesForChartsQuery, GetInvoicesForChartsQueryVariables>(GetInvoicesForChartsDocument, options);
      }
export function useGetInvoicesForChartsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetInvoicesForChartsQuery, GetInvoicesForChartsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetInvoicesForChartsQuery, GetInvoicesForChartsQueryVariables>(GetInvoicesForChartsDocument, options);
        }
export function useGetInvoicesForChartsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetInvoicesForChartsQuery, GetInvoicesForChartsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetInvoicesForChartsQuery, GetInvoicesForChartsQueryVariables>(GetInvoicesForChartsDocument, options);
        }
export type GetInvoicesForChartsQueryHookResult = ReturnType<typeof useGetInvoicesForChartsQuery>;
export type GetInvoicesForChartsLazyQueryHookResult = ReturnType<typeof useGetInvoicesForChartsLazyQuery>;
export type GetInvoicesForChartsSuspenseQueryHookResult = ReturnType<typeof useGetInvoicesForChartsSuspenseQuery>;
export type GetInvoicesForChartsQueryResult = ApolloReactCommon.QueryResult<GetInvoicesForChartsQuery, GetInvoicesForChartsQueryVariables>;
export const GetMyProfileDocument = gql`
    query GetMyProfile {
  me {
    id
    public_id
    private_id
    company_name
    contact_person
    email
    phone_no
    address
    status
    gender
    type_of_business
    role
    is_verified
    created_at
    updated_at
  }
}
    `;
export function useGetMyProfileQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetMyProfileQuery, GetMyProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetMyProfileQuery, GetMyProfileQueryVariables>(GetMyProfileDocument, options);
      }
export function useGetMyProfileLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMyProfileQuery, GetMyProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetMyProfileQuery, GetMyProfileQueryVariables>(GetMyProfileDocument, options);
        }
export function useGetMyProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetMyProfileQuery, GetMyProfileQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetMyProfileQuery, GetMyProfileQueryVariables>(GetMyProfileDocument, options);
        }
export type GetMyProfileQueryHookResult = ReturnType<typeof useGetMyProfileQuery>;
export type GetMyProfileLazyQueryHookResult = ReturnType<typeof useGetMyProfileLazyQuery>;
export type GetMyProfileSuspenseQueryHookResult = ReturnType<typeof useGetMyProfileSuspenseQuery>;
export type GetMyProfileQueryResult = ApolloReactCommon.QueryResult<GetMyProfileQuery, GetMyProfileQueryVariables>;
export const GetUserByPublicIdDocument = gql`
    query GetUserByPublicId($public_id: String!) {
  getUserByPublicId(public_id: $public_id) {
    public_id
    company_name
    contact_person
    email
    phone_no
    role
  }
}
    `;
export function useGetUserByPublicIdQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserByPublicIdQuery, GetUserByPublicIdQueryVariables> & ({ variables: GetUserByPublicIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserByPublicIdQuery, GetUserByPublicIdQueryVariables>(GetUserByPublicIdDocument, options);
      }
export function useGetUserByPublicIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserByPublicIdQuery, GetUserByPublicIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserByPublicIdQuery, GetUserByPublicIdQueryVariables>(GetUserByPublicIdDocument, options);
        }
export function useGetUserByPublicIdSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserByPublicIdQuery, GetUserByPublicIdQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUserByPublicIdQuery, GetUserByPublicIdQueryVariables>(GetUserByPublicIdDocument, options);
        }
export type GetUserByPublicIdQueryHookResult = ReturnType<typeof useGetUserByPublicIdQuery>;
export type GetUserByPublicIdLazyQueryHookResult = ReturnType<typeof useGetUserByPublicIdLazyQuery>;
export type GetUserByPublicIdSuspenseQueryHookResult = ReturnType<typeof useGetUserByPublicIdSuspenseQuery>;
export type GetUserByPublicIdQueryResult = ApolloReactCommon.QueryResult<GetUserByPublicIdQuery, GetUserByPublicIdQueryVariables>;
export const SemanticSearchGamingDocument = gql`
    query SemanticSearchGaming($input: SemanticSearchInput!) {
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
export function useSemanticSearchGamingQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SemanticSearchGamingQuery, SemanticSearchGamingQueryVariables> & ({ variables: SemanticSearchGamingQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SemanticSearchGamingQuery, SemanticSearchGamingQueryVariables>(SemanticSearchGamingDocument, options);
      }
export function useSemanticSearchGamingLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SemanticSearchGamingQuery, SemanticSearchGamingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SemanticSearchGamingQuery, SemanticSearchGamingQueryVariables>(SemanticSearchGamingDocument, options);
        }
export function useSemanticSearchGamingSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SemanticSearchGamingQuery, SemanticSearchGamingQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<SemanticSearchGamingQuery, SemanticSearchGamingQueryVariables>(SemanticSearchGamingDocument, options);
        }
export type SemanticSearchGamingQueryHookResult = ReturnType<typeof useSemanticSearchGamingQuery>;
export type SemanticSearchGamingLazyQueryHookResult = ReturnType<typeof useSemanticSearchGamingLazyQuery>;
export type SemanticSearchGamingSuspenseQueryHookResult = ReturnType<typeof useSemanticSearchGamingSuspenseQuery>;
export type SemanticSearchGamingQueryResult = ApolloReactCommon.QueryResult<SemanticSearchGamingQuery, SemanticSearchGamingQueryVariables>;
export const GetRecommendationsDocument = gql`
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
export function useGetRecommendationsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetRecommendationsQuery, GetRecommendationsQueryVariables> & ({ variables: GetRecommendationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRecommendationsQuery, GetRecommendationsQueryVariables>(GetRecommendationsDocument, options);
      }
export function useGetRecommendationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRecommendationsQuery, GetRecommendationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRecommendationsQuery, GetRecommendationsQueryVariables>(GetRecommendationsDocument, options);
        }
export function useGetRecommendationsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetRecommendationsQuery, GetRecommendationsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetRecommendationsQuery, GetRecommendationsQueryVariables>(GetRecommendationsDocument, options);
        }
export type GetRecommendationsQueryHookResult = ReturnType<typeof useGetRecommendationsQuery>;
export type GetRecommendationsLazyQueryHookResult = ReturnType<typeof useGetRecommendationsLazyQuery>;
export type GetRecommendationsSuspenseQueryHookResult = ReturnType<typeof useGetRecommendationsSuspenseQuery>;
export type GetRecommendationsQueryResult = ApolloReactCommon.QueryResult<GetRecommendationsQuery, GetRecommendationsQueryVariables>;
export const SemanticSearchDocument = gql`
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
export function useSemanticSearchQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SemanticSearchQuery, SemanticSearchQueryVariables> & ({ variables: SemanticSearchQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SemanticSearchQuery, SemanticSearchQueryVariables>(SemanticSearchDocument, options);
      }
export function useSemanticSearchLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SemanticSearchQuery, SemanticSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SemanticSearchQuery, SemanticSearchQueryVariables>(SemanticSearchDocument, options);
        }
export function useSemanticSearchSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SemanticSearchQuery, SemanticSearchQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<SemanticSearchQuery, SemanticSearchQueryVariables>(SemanticSearchDocument, options);
        }
export type SemanticSearchQueryHookResult = ReturnType<typeof useSemanticSearchQuery>;
export type SemanticSearchLazyQueryHookResult = ReturnType<typeof useSemanticSearchLazyQuery>;
export type SemanticSearchSuspenseQueryHookResult = ReturnType<typeof useSemanticSearchSuspenseQuery>;
export type SemanticSearchQueryResult = ApolloReactCommon.QueryResult<SemanticSearchQuery, SemanticSearchQueryVariables>;
export const GetMyRequestsDocument = gql`
    query GetMyRequests {
  getMyRelationshipRequests {
    id
    requester_public_id
    requested_public_id
    relationship_type
    status
    created_at
  }
}
    `;
export function useGetMyRequestsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetMyRequestsQuery, GetMyRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetMyRequestsQuery, GetMyRequestsQueryVariables>(GetMyRequestsDocument, options);
      }
export function useGetMyRequestsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMyRequestsQuery, GetMyRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetMyRequestsQuery, GetMyRequestsQueryVariables>(GetMyRequestsDocument, options);
        }
export function useGetMyRequestsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetMyRequestsQuery, GetMyRequestsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetMyRequestsQuery, GetMyRequestsQueryVariables>(GetMyRequestsDocument, options);
        }
export type GetMyRequestsQueryHookResult = ReturnType<typeof useGetMyRequestsQuery>;
export type GetMyRequestsLazyQueryHookResult = ReturnType<typeof useGetMyRequestsLazyQuery>;
export type GetMyRequestsSuspenseQueryHookResult = ReturnType<typeof useGetMyRequestsSuspenseQuery>;
export type GetMyRequestsQueryResult = ApolloReactCommon.QueryResult<GetMyRequestsQuery, GetMyRequestsQueryVariables>;
export const GetMySuppliersDocument = gql`
    query GetMySuppliers {
  getSuppliers {
    id
    supplier_public_id
    company_name
    contact_person
    email
    phone_no
    location
    status
    created_at
  }
}
    `;
export function useGetMySuppliersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetMySuppliersQuery, GetMySuppliersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetMySuppliersQuery, GetMySuppliersQueryVariables>(GetMySuppliersDocument, options);
      }
export function useGetMySuppliersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMySuppliersQuery, GetMySuppliersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetMySuppliersQuery, GetMySuppliersQueryVariables>(GetMySuppliersDocument, options);
        }
export function useGetMySuppliersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetMySuppliersQuery, GetMySuppliersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetMySuppliersQuery, GetMySuppliersQueryVariables>(GetMySuppliersDocument, options);
        }
export type GetMySuppliersQueryHookResult = ReturnType<typeof useGetMySuppliersQuery>;
export type GetMySuppliersLazyQueryHookResult = ReturnType<typeof useGetMySuppliersLazyQuery>;
export type GetMySuppliersSuspenseQueryHookResult = ReturnType<typeof useGetMySuppliersSuspenseQuery>;
export type GetMySuppliersQueryResult = ApolloReactCommon.QueryResult<GetMySuppliersQuery, GetMySuppliersQueryVariables>;
export const SearchUserDocument = gql`
    query SearchUser($input: SearchUserInput!) {
  searchUser(input: $input) {
    public_id
    company_name
    contact_person
    email
    phone_no
    role
  }
}
    `;
export function useSearchUserQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchUserQuery, SearchUserQueryVariables> & ({ variables: SearchUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchUserQuery, SearchUserQueryVariables>(SearchUserDocument, options);
      }
export function useSearchUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchUserQuery, SearchUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchUserQuery, SearchUserQueryVariables>(SearchUserDocument, options);
        }
export function useSearchUserSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchUserQuery, SearchUserQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<SearchUserQuery, SearchUserQueryVariables>(SearchUserDocument, options);
        }
export type SearchUserQueryHookResult = ReturnType<typeof useSearchUserQuery>;
export type SearchUserLazyQueryHookResult = ReturnType<typeof useSearchUserLazyQuery>;
export type SearchUserSuspenseQueryHookResult = ReturnType<typeof useSearchUserSuspenseQuery>;
export type SearchUserQueryResult = ApolloReactCommon.QueryResult<SearchUserQuery, SearchUserQueryVariables>;
export const MessageReceivedDocument = gql`
    subscription MessageReceived($roomId: String!) {
  messageReceived(roomId: $roomId) {
    id
    roomId
    senderId
    receiverId
    message
    createdAt
  }
}
    `;
export function useMessageReceivedSubscription(baseOptions: ApolloReactHooks.SubscriptionHookOptions<MessageReceivedSubscription, MessageReceivedSubscriptionVariables> & ({ variables: MessageReceivedSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<MessageReceivedSubscription, MessageReceivedSubscriptionVariables>(MessageReceivedDocument, options);
      }
export type MessageReceivedSubscriptionHookResult = ReturnType<typeof useMessageReceivedSubscription>;
export type MessageReceivedSubscriptionResult = ApolloReactCommon.SubscriptionResult<MessageReceivedSubscription>;
export const DashboardLiveStatsDocument = gql`
    subscription DashboardLiveStats {
  dashboardStatsUpdated {
    id
    totalCustomers
    totalProducts
    totalInvoices
    totalRevenue
    activeUsers
    pendingInvoices
    timestamp
  }
}
    `;
export function useDashboardLiveStatsSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<DashboardLiveStatsSubscription, DashboardLiveStatsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<DashboardLiveStatsSubscription, DashboardLiveStatsSubscriptionVariables>(DashboardLiveStatsDocument, options);
      }
export type DashboardLiveStatsSubscriptionHookResult = ReturnType<typeof useDashboardLiveStatsSubscription>;
export type DashboardLiveStatsSubscriptionResult = ApolloReactCommon.SubscriptionResult<DashboardLiveStatsSubscription>;
export const FinanceDashboardUpdatesDocument = gql`
    subscription FinanceDashboardUpdates {
  financeDashboardUpdated {
    total_income
    total_expense
    balance
    transactions {
      date
      invoice_number
      description
      category
      amount
      type
    }
    charts {
      sales_by_item {
        item_name
        total_amount
      }
      monthly_sales {
        month
        total_amount
      }
      weekly_sales {
        day
        total_amount
      }
      monthly_sales_count {
        month
        count
      }
    }
  }
}
    `;
export function useFinanceDashboardUpdatesSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<FinanceDashboardUpdatesSubscription, FinanceDashboardUpdatesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<FinanceDashboardUpdatesSubscription, FinanceDashboardUpdatesSubscriptionVariables>(FinanceDashboardUpdatesDocument, options);
      }
export type FinanceDashboardUpdatesSubscriptionHookResult = ReturnType<typeof useFinanceDashboardUpdatesSubscription>;
export type FinanceDashboardUpdatesSubscriptionResult = ApolloReactCommon.SubscriptionResult<FinanceDashboardUpdatesSubscription>;
export const InvoiceReceivedDocument = gql`
    subscription InvoiceReceived {
  invoiceReceived {
    invoice_number
    invoice_type
    total_amount
    status
    invoice_date
    bill_from_name
    bill_to_name
  }
}
    `;
export function useInvoiceReceivedSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<InvoiceReceivedSubscription, InvoiceReceivedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<InvoiceReceivedSubscription, InvoiceReceivedSubscriptionVariables>(InvoiceReceivedDocument, options);
      }
export type InvoiceReceivedSubscriptionHookResult = ReturnType<typeof useInvoiceReceivedSubscription>;
export type InvoiceReceivedSubscriptionResult = ApolloReactCommon.SubscriptionResult<InvoiceReceivedSubscription>;