export interface TradeOrder {
  id: string;
  orderId: string;
  clientName: string;
  idNumber: string;
  csdAccountNumber: string;
  symbol: string;
  side: string;
  type: string;
  limitPrice: string;
  stopPrice: string;
  quantity: string;
  timeInForce: string;
  goodTillDate: string;
  clientSignature: string;
  clientSignatureDate: string;
  receivedVia: string;
  status: "Pending" | "Accepted" | "Rejected";
  rejectionReason: string;
  traderSignature: string;
  receivedBy: string;
  dateReceived: string;
  timeReceived: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  data: TradeOrder[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface OrderStatusResponse {
  success: boolean;
  order: TradeOrder;
}
