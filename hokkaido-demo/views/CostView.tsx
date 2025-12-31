import React, { useState, useMemo } from 'react';
import { GOOGLE_SCRIPT_URL, GOOGLE_SHEET_URL } from '../constants';
import { SheetIcon, PlusIcon, RefreshIcon, EditIcon, TrashIcon, XIcon } from '../components/Icons';
import { ExpenseRecord } from '../types';
import { calculateSplit } from '../utils';

interface CostViewProps {
  expenses: ExpenseRecord[];
  isLoading: boolean;
  fetchError: string | null;
  onRefresh: () => void;
  onAddSuccess: () => void;
}

export const CostView: React.FC<CostViewProps> = ({ expenses, isLoading, onRefresh, onAddSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'JPY' | 'TWD'>('JPY');
  const [item, setItem] = useState('');
  const [payer, setPayer] = useState<'小 A' | '小 B'>('小 A');
  const [note, setNote] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'manual'>('equal');
  const [manualAInput, setManualAInput] = useState('');
  const [manualBInput, setManualBInput] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSettlement, setShowSettlement] = useState(false);

  const totalTWD = expenses.reduce((sum, r) => sum + r.amountTwd, 0);
  const totalJPY = expenses.reduce((sum, r) => sum + r.amountJpy, 0);

  const settlement = useMemo(() => {
    let aPaidTwd = 0, aPaidJpy = 0, aShouldPayTwd = 0, aShouldPayJpy = 0;
    expenses.forEach(r => {
      if (r.payer === '小 A') { aPaidTwd += r.amountTwd; aPaidJpy += r.amountJpy; }
      aShouldPayTwd += r.splitATwd || 0;
      aShouldPayJpy += r.splitAJpy || 0;
    });
    return { twd: aPaidTwd - aShouldPayTwd, jpy: aPaidJpy - aShouldPayJpy };
  }, [expenses]);

  const handleAmountChange = (val: string) => {
    setAmount(val);
    const total = Number(val) || 0;
    const { a, b } = calculateSplit(total, 'equal');
    setManualAInput(String(a));
    setManualBInput(String(b));
  };

  const handleManualAChange = (val: string) => {
    setManualAInput(val);
    const total = Number(amount) || 0;
    setManualBInput(String(total - (Number(val) || 0)));
  };

  // Defined handleManualBChange to handle manual split input for person B
  const handleManualBChange = (val: string) => {
    setManualBInput(val);
    const total = Number(amount) || 0;
    setManualAInput(String(total - (Number(val) || 0)));
  };

  const handleOpenAdd = () => {
    setMode('add'); setEditingRowIndex(null);
    const today = new Date();
    setDate(today.toISOString().split('T')[0]);
    setAmount(''); setItem(''); setPayer('小 A'); setNote(''); setCurrency('JPY'); setSplitType('equal'); 
    setManualAInput(''); setManualBInput('');
    setShowModal(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, record: ExpenseRecord) => {
    e.stopPropagation(); setMode('edit'); setEditingRowIndex(record.rowIndex);
    setDate(new Date(record.date).toISOString().split('T')[0]);
    setItem(record.item); setPayer(record.payer); setNote(record.note || ''); setSplitType(record.splitType || 'equal');
    const amt = record.amountTwd > 0 ? record.amountTwd : record.amountJpy;
    setAmount(String(amt));
    setCurrency(record.amountTwd > 0 ? 'TWD' : 'JPY');
    setManualAInput(String(record.amountTwd > 0 ? record.splitATwd : record.splitAJpy));
    setManualBInput(String(record.amountTwd > 0 ? record.splitBTwd : record.splitBJpy));
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId === null) return;
    setIsDeleting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: 'delete', rowIndex: deleteConfirmId }) });
      setDeleteConfirmId(null); onAddSuccess();
    } catch { console.error("刪除失敗"); } finally { setIsDeleting(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!amount || !item) return;
    setIsSubmitting(true);
    const total = Number(amount) || 0;
    const { a: aA, b: bA } = calculateSplit(total, splitType, Number(manualAInput));
    const payload = {
      action: mode, rowIndex: editingRowIndex, date: date.replace(/-/g, '/'), item: item.trim(), payer,
      amountTwd: currency === 'TWD' ? total : 0, amountJpy: currency === 'JPY' ? total : 0, note: note.trim(), splitType,
      splitATwd: currency === 'TWD' ? aA : 0, splitAJpy: currency === 'JPY' ? aA : 0,
      splitBTwd: currency === 'TWD' ? bA : 0, splitBJpy: currency === 'JPY' ? bA : 0
    };
    try { await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: JSON.stringify(payload) }); setShowModal(false); onAddSuccess(); }
    catch { console.error("儲存失敗"); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="pb-32 pt-1 animate-in fade-in duration-700">
      <div className="bg-white border border-gray-200 rounded-none overflow-hidden mb-8 shadow-sm">
        <div className="px-5 py-3 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-xl font-noto font-bold text-mag-black">旅費總覽</h2>
          <button onClick={onRefresh} className="text-gray-400"><RefreshIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} /></button>
        </div>
        <div className="grid grid-cols-2 divide-x divide-gray-100">
          <div className="p-3 text-center">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">JPY</div>
            <div className="text-2xl font-bold font-mono">¥{totalJPY.toLocaleString()}</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">TWD</div>
            <div className="text-2xl font-bold font-mono">${totalTWD.toLocaleString()}</div>
          </div>
        </div>
        <button onClick={() => setShowSettlement(true)} className="w-full bg-mag-black text-white py-3.5 font-bold text-sm tracking-[0.2em]">結算精算 SETTLE</button>
      </div>

      <div className="flex justify-between items-end mb-6">
        <h3 className="text-xl font-noto font-bold text-mag-black">支出明細</h3>
        <button onClick={handleOpenAdd} className="bg-mag-black text-white p-2 shadow-md flex items-center justify-center"><PlusIcon className="w-5 h-5" /></button>
      </div>

      <div className="space-y-3">
        {expenses.map((record) => (
          <div key={record.rowIndex} className="bg-white p-4 border border-gray-100 flex items-center gap-2 overflow-hidden" onClick={(e) => handleOpenEdit(e, record)}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`shrink-0 px-2 py-0.5 text-[9px] font-bold text-white ${record.payer === '小 A' ? 'bg-[#E91E63]' : 'bg-[#2196F3]'}`}>{record.payer}</span>
                <span className="text-base font-bold text-mag-black truncate">{record.item}</span>
              </div>
              <div className="text-[10px] font-mono font-bold text-gray-400">{record.date.split('T')[0].replace(/-/g, '/')}</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
               <div className="text-lg font-bold font-mono">{record.amountJpy > 0 ? `¥${record.amountJpy.toLocaleString()}` : `$${record.amountTwd.toLocaleString()}`}</div>
               <div className="flex gap-1 shrink-0">
                 <button onClick={(e) => handleOpenEdit(e, record)} className="p-1 text-gray-300"><EditIcon className="w-4 h-4" /></button>
                 <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(record.rowIndex); }} className="p-1 text-gray-300"><TrashIcon className="w-4 h-4" /></button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {showSettlement && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettlement(false)} />
          <div className="bg-white w-full max-w-sm p-8 z-10 border-t-8 border-mag-black">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">結算面板</h3>
                <button onClick={() => setShowSettlement(false)} className="text-gray-300"><XIcon className="w-6 h-6" /></button>
             </div>
             <div className="space-y-6">
                <div className="bg-gray-50 p-6 flex flex-col items-center">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">台幣 TWD</div>
                  <div className="text-3xl font-mono font-bold">${Math.abs(Math.round(settlement.twd)).toLocaleString()}</div>
                  <div className="text-xs font-bold text-mag-gold mt-2">{settlement.twd > 0 ? '小 B 應給 小 A' : settlement.twd < 0 ? '小 A 應給 小 B' : '已結清'}</div>
                </div>
                <div className="bg-gray-50 p-6 flex flex-col items-center">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">日幣 JPY</div>
                  <div className="text-3xl font-mono font-bold">¥{Math.abs(Math.round(settlement.jpy)).toLocaleString()}</div>
                  <div className="text-xs font-bold text-mag-gold mt-2">{settlement.jpy > 0 ? '小 B 應給 小 A' : settlement.jpy < 0 ? '小 A 應給 小 B' : '已結清'}</div>
                </div>
             </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white w-full max-w-sm p-5 z-10 border-t-4 border-mag-black shadow-2xl">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-xl font-bold">{mode === 'edit' ? '編輯消費' : '新增消費'}</h3>
               <button onClick={() => setShowModal(false)} className="text-mag-gray p-1"><XIcon className="w-6 h-6" /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[9px] font-black text-mag-gray block">日期 DATE</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-[#F7F7F7] p-2 font-bold text-sm outline-none" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] font-black text-mag-gray block">支付者 PAYER</label>
                    <div className="flex border-[1.5px] border-mag-black h-[36px]">
                        <button type="button" onClick={() => setPayer('小 A')} className={`flex-1 font-bold text-xs ${payer === '小 A' ? 'bg-[#E91E63] text-white' : 'bg-white text-mag-black'}`}>小 A</button>
                        <button type="button" onClick={() => setPayer('小 B')} className={`flex-1 font-bold text-xs ${payer === '小 B' ? 'bg-[#2196F3] text-white' : 'bg-white text-mag-black'}`}>小 B</button>
                    </div>
                  </div>
                </div>
                <input type="text" placeholder="內容" value={item} onChange={e => setItem(e.target.value)} className="w-full bg-[#F7F7F7] p-2.5 font-bold text-base outline-none" />
                <div className="flex bg-[#F7F7F7] items-center px-3 h-[50px] gap-2">
                    <input type="number" placeholder="金額" value={amount} onChange={e => handleAmountChange(e.target.value)} className="flex-1 bg-transparent font-bold text-2xl outline-none" />
                    <div className="flex bg-white shadow-sm border border-gray-200 h-[30px]">
                        <button type="button" onClick={() => setCurrency('JPY')} className={`px-2 font-bold text-[10px] ${currency === 'JPY' ? 'bg-mag-black text-white' : 'text-gray-400'}`}>JPY</button>
                        <button type="button" onClick={() => setCurrency('TWD')} className={`px-2 font-bold text-[10px] ${currency === 'TWD' ? 'bg-mag-black text-white' : 'text-gray-400'}`}>TWD</button>
                    </div>
                </div>
                <div className="bg-[#F8F8F8] p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold">分帳模式</label>
                      <select value={splitType} onChange={e => setSplitType(e.target.value as any)} className="bg-white border border-mag-black py-0.5 px-2 text-[10px] font-bold">
                          <option value="equal">平均分攤</option>
                          <option value="manual">自定義金額</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[8px] font-black text-[#E91E63]">小 A 負擔</label>
                          <input type="number" disabled={splitType === 'equal'} value={splitType === 'equal' ? calculateSplit(Number(amount), 'equal').a : manualAInput} onChange={e => handleManualAChange(e.target.value)} className="w-full bg-white p-2 text-base font-mono font-bold border border-gray-200 outline-none" />
                        </div>
                        <div>
                          <label className="text-[8px] font-black text-[#2196F3]">小 B 負擔</label>
                          <input type="number" disabled={splitType === 'equal'} value={splitType === 'equal' ? calculateSplit(Number(amount), 'equal').b : manualBInput} onChange={e => handleManualBChange(e.target.value)} className="w-full bg-white p-2 text-base font-mono font-bold border border-gray-200 outline-none" />
                        </div>
                    </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-mag-black text-white font-bold text-sm">{isSubmitting ? '儲存中...' : '儲存項目'}</button>
             </form>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
           <div className="bg-white p-8 z-10 w-full max-w-xs text-center border-t-8 border-red-500">
              <h3 className="text-xl font-bold mb-8">確定要刪除？</h3>
              <div className="flex gap-3">
                 <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-4 bg-gray-100 font-bold text-gray-500">取消</button>
                 <button onClick={handleConfirmDelete} className="flex-1 py-4 bg-red-500 text-white font-bold">{isDeleting ? '...' : '確認刪除'}</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};