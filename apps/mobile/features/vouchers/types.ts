export interface VoucherItem {
  id: string
  voucherNo: string
  date: string
  from: string
  status: 'Active' | 'Redeemed' | 'Expired'
  pdfUrl?: string
  fileName: string
  amount?: number
}

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}
