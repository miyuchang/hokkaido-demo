import React, { useState, useMemo, useEffect } from 'react';
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

  // 當「總金額」或「分帳模式」改變時，重新計算分帳數值
  useEffect(() => {
    const total = Number(amount) || 0;
    if (splitType === 'equal') {
      const { a, b } = calculateSplit(total, 'equal');
      setManualAInput(String(a));
      setManualBInput(String(b));
    } else {
      const currentA = Number(manualAInput) || 0;
      setManualBInput(String(total - currentA));
    }
  }, [amount, splitType]);

  const handleManualAChange = (val: string) => {
    setManualAInput(val);
    const total = Number(amount) || 0;
    const aVal = Number(val) || 0;
    setManualBInput(String(total - aVal));
  };

  const handleManualBChange = (val: string) => {
    setManualBInput(val);
    const total = Number(amount) || 0;
    const bVal = Number(val) || 0;
    setManualAInput(String(total - bVal));
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
    const isTWD = record.amountTwd > 0;
    setCurrency(isTWD ? 'TWD' : 'JPY');
    setAmount(String(isTWD ? record.amountTwd : record.amountJpy));
    setManualAInput(String(isTWD ? record.splitATwd : record.splitAJpy));
    setManualBInput(String(isTWD ? record.splitBTwd : record.splitBJpy));
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
    const aVal = Number(manualAInput) || 0;
    const bVal = total - aVal;

    const payload = {
      action: mode, rowIndex: editingRowIndex, date: date.replace(/-/g, '/'), item: item.trim(), payer,
      amountTwd: currency === 'TWD' ? total : 0, amountJpy: currency === 'JPY' ? total : 0, note: note.trim(), splitType,
      splitATwd: currency === 'TWD' ? aVal : 0, splitAJpy: currency === 'JPY' ? aVal : 0,
      splitBTwd: currency === 'TWD' ? bVal : 0, splitBJpy: currency === 'JPY' ? bVal : 0
    };
    try { await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: JSON.stringify(payload) }); setShowModal(false); onAddSuccess(); }
    catch { console.error("儲存失敗"); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="pb-32 pt-1 animate-in fade-in duration-700">
      <div className="bg-white border border-gray-200 rounded-none overflow-hidden mb-8 shadow-sm">
        <div className="px-5 py-3 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-xl font-noto font-bold text-mag-black">旅費總覽</h2>
          <div className="flex items-center gap-3">
            <a href={GOOGLE_SHEET_URL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-mag-gold flex items-center gap-1.5 p-1">
              <SheetIcon className="w-5 h-5" />
            </a>
            <button onClick={onRefresh} className="text-gray-400 p-1">
              <RefreshIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
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
        {expenses.length === 0 && !isLoading ? (
          <div className="text-center py-10 text-gray-400 font-bold border border-dashed border-gray-200">目前尚無消費紀錄</div>
        ) : (
          expenses.map((record) => (
            <div key={record.rowIndex} className="bg-white p-4 border border-gray-100 flex items-center gap-2 overflow-hidden shadow-soft active:bg-gray-50" onClick={(e) => handleOpenEdit(e, record)}>
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
                   <button onClick={(e) => handleOpenEdit(e, record)} className="p-1 text-gray-300 hover:text-mag-gold"><EditIcon className="w-4 h-4" /></button>
                   <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(record.rowIndex); }} className="p-1 text-gray-300 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showSettlement && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettlement(false)} />
          <div className="bg-white w-full max-w-sm p-8 z-10 border-t-8 border-mag-black animate-in zoom-in-95">
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
          <div className="bg-white w-full max-w-sm p-5 z-10 border-t-4 border-mag-black shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold">{mode === 'edit' ? '編輯消費' : '新增消費'}</h3>
               <button onClick={() => setShowModal(false)} className="text-mag-gray p-1"><XIcon className="w-5 h-5" /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[9px] font-black text-mag-gray block mb-1 uppercase tracking-wider">日期 DATE</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-[#F7F7F7] p-2 font-bold text-sm outline-none border border-transparent focus:border-mag-gold" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] font-black text-mag-gray block mb-1 uppercase tracking-wider">支付者 PAYER</label>
                    <div className="flex border-[1.5px] border-mag-black h-[34px] overflow-hidden">
                        <button type="button" onClick={() => setPayer('小 A')} className={`flex-1 font-bold text-[10px] transition-colors ${payer === '小 A' ? 'bg-[#E91E63] text-white' : 'bg-white text-mag-black'}`}>小 A</button>
                        <button type="button" onClick={() => setPayer('小 B')} className={`flex-1 font-bold text-[10px] transition-colors ${payer === '小 B' ? 'bg-[#2196F3] text-white' : 'bg-white text-mag-black'}`}>小 B</button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black text-mag-gray block mb-1 uppercase tracking-wider">內容 ITEM</label>
                  <input type="text" placeholder="消費明細..." value={item} onChange={e => setItem(e.target.value)} className="w-full bg-[#F7F7F7] p-2.5 font-bold text-sm outline-none border border-transparent focus:border-mag-gold" />
                </div>

                <div>
                  <label className="text-[9px] font-black text-mag-gray block mb-1 uppercase tracking-wider">金額 AMOUNT</label>
                  <div className="relative flex bg-[#F7F7F7] items-center px-3 h-[46px] border border-transparent focus-within:border-mag-gold overflow-hidden">
                      <input 
                        type="number" 
                        placeholder="0" 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)} 
                        className="flex-1 bg-transparent font-bold text-xl outline-none min-w-0" 
                      />
                      <div className="flex bg-white shadow-sm border border-gray-200 h-[28px] shrink-0 ml-2">
                          <button type="button" onClick={() => setCurrency('JPY')} className={`px-2 font-bold text-[9px] transition-colors border-r border-gray-100 ${currency === 'JPY' ? 'bg-mag-black text-white' : 'text-gray-400'}`}>JPY</button>
                          <button type="button" onClick={() => setCurrency('TWD')} className={`px-2 font-bold text-[9px] transition-colors ${currency === 'TWD' ? 'bg-mag-black text-white' : 'text-gray-400'}`}>TWD</button>
                      </div>
                  </div>
                </div>

                <div className="bg-[#F8F8F8] p-3 space-y-3">
                    <div className="flex justify-between items-center mb-0.5">
                      <label className="text-[10px] font-black text-mag-black uppercase tracking-wider">分帳 SPLIT</label>
                      <select 
                        value={splitType} 
                        onChange={e => setSplitType(e.target.value as any)} 
                        className="bg-white border border-mag-black py-0.5 px-1.5 text-[9px] font-bold outline-none"
                      >
                          <option value="equal">平均 (1/2)</option>
                          <option value="manual">自定義</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`text-[8px] font-black mb-1 block uppercase ${splitType === 'manual' ? 'text-[#E91E63]' : 'text-gray-400'}`}>小 A 分擔</label>
                          <input 
                            type="number" 
                            disabled={splitType === 'equal'} 
                            value={manualAInput} 
                            onChange={e => handleManualAChange(e.target.value)} 
                            className={`w-full p-2 text-sm font-mono font-bold border outline-none transition-colors ${
                              splitType === 'equal' ? 'bg-gray-100 text-gray-400 border-gray-100' : 'bg-white text-mag-black border-gray-300 focus:border-[#E91E63]'
                            }`} 
                          />
                        </div>
                        <div>
                          <label className={`text-[8px] font-black mb-1 block uppercase ${splitType === 'manual' ? 'text-[#2196F3]' : 'text-gray-400'}`}>小 B 分擔</label>
                          <input 
                            type="number" 
                            disabled={splitType === 'equal'} 
                            value={manualBInput} 
                            onChange={e => handleManualBChange(e.target.value)} 
                            className={`w-full p-2 text-sm font-mono font-bold border outline-none transition-colors ${
                              splitType === 'equal' ? 'bg-gray-100 text-gray-400 border-gray-100' : 'bg-white text-mag-black border-gray-300 focus:border-[#2196F3]'
                            }`} 
                          />
                        </div>
                    </div>
                </div>

                <div>
                  <label className="text-[9px] font-black text-mag-gray block mb-1 uppercase tracking-wider">備註 NOTE</label>
                  <input type="text" placeholder="選填..." value={note} onChange={e => setNote(e.target.value)} className="w-full bg-[#F7F7F7] p-2 font-bold text-sm outline-none border border-transparent focus:border-mag-gold" />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-mag-black text-white font-bold text-xs tracking-[0.2em] shadow-lg active:scale-[0.98] transition-all disabled:opacity-50">
                  {isSubmitting ? '正在儲存...' : '儲存紀錄 SAVE'}
                </button>
             </form>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
           <div className="bg-white p-8 z-10 w-full max-w-xs text-center border-t-8 border-red-500 shadow-2xl animate-in zoom-in-95">
              <h3 className="text-xl font-bold mb-8">確定要刪除？</h3>
              <div className="flex gap-3">
                 <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-4 bg-gray-100 font-bold text-gray-500">取消</button>
                 <button onClick={handleConfirmDelete} className="flex-1 py-4 bg-red-500 text-white font-bold active:bg-red-600 transition-colors">{isDeleting ? '...' : '確認刪除'}</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};