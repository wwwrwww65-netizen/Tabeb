import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  RotateCcw, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  X,
  QrCode
} from 'lucide-react';
import { InvoiceRecord } from '../types';
import { INITIAL_INVOICES } from '../data/packagesAndCoupons';

interface Props {
  invoices?: InvoiceRecord[];
}

export const InvoicesTab: React.FC<Props> = ({ invoices = INITIAL_INVOICES }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            سجل الفواتير والمعاملات المالية (فواتيري)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            جميع سندات القبض والفواتير الإلكترونية المشفرة الصادرة من منصة كول مايند
          </p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-teal-400 transition"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-300 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100">{inv.invoiceNumber}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold rounded-full">
                    {inv.status}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">{inv.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                  <span>📅 {inv.date}</span>
                  <span>💳 {inv.paymentMethod}</span>
                  <span className="font-mono">Ref: {inv.transactionRef}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
              <div className="text-right">
                <span className="text-base font-black text-slate-900 dark:text-slate-100">
                  ${inv.amountUSD}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  ({inv.amountYER.toLocaleString()} YER)
                </span>
              </div>

              <button
                onClick={() => setSelectedInvoice(inv)}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>عرض الفاتورة PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PDF Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>فاتورة رسمية معتمدة — CoolMind Clinic</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة / PDF</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 text-xs print:p-0">
              {/* Invoice Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-700 text-white font-black flex items-center justify-center text-sm">
                      CM
                    </div>
                    <span className="text-lg font-black text-slate-900">CoolMind Clinic</span>
                  </div>
                  <p className="text-slate-500">عيادات كول مايند للطب النفسي والرعاية المتكاملة عن بُعد</p>
                  <p className="text-slate-500">الرقم الضريبي / السجل الطبي: #YM-MED-99410</p>
                </div>

                <div className="text-left">
                  <span className="text-xs font-black uppercase text-teal-700 tracking-wider">سند قبض وفاتورة</span>
                  <p className="text-base font-mono font-black text-slate-900 mt-1">{selectedInvoice.invoiceNumber}</p>
                  <p className="text-slate-500">التاريخ: {selectedInvoice.date}</p>
                </div>
              </div>

              {/* Client and Transaction Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-bold block mb-1">المستفيد:</span>
                  <p className="font-bold text-slate-900">{selectedInvoice.clientName}</p>
                  <p className="text-slate-500 font-mono">كود العميل: {selectedInvoice.clientCode}</p>
                </div>
                <div className="text-left">
                  <span className="text-slate-400 font-bold block mb-1">طريقة الدفع والمرجع:</span>
                  <p className="font-bold text-slate-900">{selectedInvoice.paymentMethod}</p>
                  <p className="text-slate-500 font-mono text-[11px]">{selectedInvoice.transactionRef}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-600">
                    <th className="py-2.5 text-right font-black">البيان / الخدمة</th>
                    <th className="py-2.5 text-center font-black">الكمية</th>
                    <th className="py-2.5 text-left font-black">المبلغ (USD)</th>
                    <th className="py-2.5 text-left font-black">المعادل (YER)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 font-bold text-slate-900">
                      {selectedInvoice.description}
                      {selectedInvoice.doctorName && (
                        <span className="block text-[11px] text-teal-700 font-normal">
                          المختص: {selectedInvoice.doctorName}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-center">1</td>
                    <td className="py-3 text-left font-mono font-bold">${selectedInvoice.amountUSD}</td>
                    <td className="py-3 text-left font-mono">{selectedInvoice.amountYER.toLocaleString()} YER</td>
                  </tr>
                </tbody>
              </table>

              {/* Total Calculation */}
              <div className="border-t-2 border-slate-900 pt-4 flex justify-between items-center text-sm font-black">
                <span>الإجمالي المدفوع بالكامل:</span>
                <div className="text-left">
                  <span className="text-xl text-teal-700 font-mono">${selectedInvoice.amountUSD}</span>
                  <span className="text-xs text-slate-500 block font-mono font-normal">
                    ({selectedInvoice.amountYER.toLocaleString()} ريال يمني)
                  </span>
                </div>
              </div>

              {/* Verification Stamp */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[11px]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>فاتورة إلكترونية موثقة ومشفرة رقمياً — خاضعة لسياسة الاسترداد</span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <QrCode className="w-4 h-4" />
                  <span>CM-VERIFIED-2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
