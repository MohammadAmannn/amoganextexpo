import type { VoucherItem } from '../types'

export const initialVouchers: VoucherItem[] = [
  {
    id: 'voucher-1',
    voucherNo: 'VCH-2026-001',
    date: 'Aug 7, 2026 at 10:00 AM',
    from: 'Acme Cloud Services',
    status: 'Active',
    fileName: 'invoice-acme-aug26.pdf',
    amount: 1450.0,
  },
  {
    id: 'voucher-2',
    voucherNo: 'VCH-2026-002',
    date: 'Aug 5, 2026 at 02:30 PM',
    from: 'Global Tech Hardware',
    status: 'Redeemed',
    fileName: 'receipt-hardware-aug26.pdf',
    amount: 3200.5,
  },
  {
    id: 'voucher-3',
    voucherNo: 'VCH-2026-003',
    date: 'Jul 28, 2026 at 11:15 AM',
    from: 'Design Systems Pro LLC',
    status: 'Expired',
    fileName: 'consulting-voucher-jul26.pdf',
    amount: 750.0,
  },
  {
    id: 'voucher-4',
    voucherNo: 'VCH-2026-004',
    date: 'Jul 20, 2026 at 04:00 PM',
    from: 'Supabase Enterprise Services',
    status: 'Active',
    fileName: 'supabase-dedicated-jul26.pdf',
    amount: 980.0,
  },
]
