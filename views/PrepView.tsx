import React, { useState, useRef, useEffect } from 'react';
import { PRE_TRIP_NOTES } from '../constants';
import { ChecklistItem } from '../types';
import { CheckIcon, TrashIcon, EditIcon, PlusIcon, XIcon } from '../components/Icons';

interface PrepViewProps {
  checkedItems: Set<string>;
  toggleItem: (id: string) => void;
  list: ChecklistItem[];
  setList: (list: ChecklistItem[]) => void;
}

export const PrepView: React.FC<PrepViewProps> = ({ checkedItems, toggleItem, list, setList }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalText, setModalText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const modalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showModal && modalInputRef.current) {
      modalInputRef.current.focus();
    }
  }, [showModal]);

  const handleOpenAdd = () => {
    setModalMode('add');
    setModalText('');
    setEditingId(null);
    setShowModal(true);
  };

  const handleOpenEdit = (item: ChecklistItem) => {
    setModalMode('edit');
    setModalText(item.text);
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleModalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!modalText.trim()) return;

    if (modalMode === 'add') {
      const newItem: ChecklistItem = { id: `todo_${Date.now()}`, text: modalText.trim() };
      setList([...list, newItem]);
    } else if (modalMode === 'edit' && editingId) {
      setList(list.map(i => i.id === editingId ? { ...i, text: modalText.trim() } : i));
    }

    setModalText('');
    setShowModal(false);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setList(list.filter(i => i.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="pb-32 pt-2 animate-in fade-in duration-500">
      
      {/* Travel Notes Section - Matched font size to Checklist (text-sm) */}
      <div className="mb-8 bg-white border border-gray-100 shadow-soft p-5 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
           <div className="w-1 h-4 bg-mag-gold"></div>
           <h3 className="text-lg font-noto font-bold text-mag-black leading-none">旅途叮嚀</h3>
        </div>

        <div className="space-y-4">
          {PRE_TRIP_NOTES.map((note, idx) => (
            <div key={idx} className="flex gap-3 items-baseline">
               <span className="text-[12px] font-mono font-black text-mag-gold shrink-0 leading-none">
                 {(idx + 1).toString().padStart(2, '0')}
               </span>
               <div className="flex-1">
                  <p className="text-sm font-medium text-mag-black leading-relaxed tracking-tight">
                    {note}
                  </p>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Checklist - Renamed Title to 待辦事項 */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-[10px] font-black tracking-[0.2em] text-mag-gray uppercase">待辦事項</h2>
          <button 
            onClick={handleOpenAdd}
            className="p-2 bg-mag-black text-white shadow-md active:scale-95 transition-transform"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-none shadow-soft border border-gray-100 overflow-hidden divide-y divide-gray-50">
          {list.map((item) => {
            const isChecked = checkedItems.has(item.id);

            return (
              <div key={item.id} className="group flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <div 
                  onClick={() => toggleItem(item.id)}
                  className={`flex-shrink-0 w-5 h-5 border-2 flex items-center justify-center transition-all cursor-pointer ${
                    isChecked ? 'bg-mag-gold border-mag-gold' : 'bg-white border-gray-300'
                  }`}
                >
                  {isChecked && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                </div>
                <span 
                  onClick={() => toggleItem(item.id)}
                  className={`flex-1 text-sm leading-snug cursor-pointer select-none ${
                    isChecked ? 'text-gray-400 line-through' : 'text-mag-black font-black'
                  }`}
                >
                  {item.text}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-gray-300 hover:text-mag-gold active:text-mag-gold">
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-gray-300 hover:text-red-500 active:text-red-500">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unified Modal for Add & Edit */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 border-t-4 border-mag-black">
            <h3 className="text-lg font-bold mb-4 text-mag-black">
              {modalMode === 'add' ? '新增待辦事項' : '編輯待辦事項'}
            </h3>
            <input 
              ref={modalInputRef}
              type="text" 
              value={modalText} 
              onChange={(e) => setModalText(e.target.value)} 
              placeholder="輸入內容..." 
              className="w-full bg-gray-50 border border-gray-200 p-3 mb-6 outline-none font-bold focus:border-mag-gold"
              onKeyDown={(e) => e.key === 'Enter' && handleModalSubmit()}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 font-bold text-sm text-gray-500">取消</button>
              <button onClick={() => handleModalSubmit()} className="flex-1 py-3 bg-mag-black text-white font-bold text-sm">
                {modalMode === 'add' ? '確認新增' : '儲存修改'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white w-full max-w-xs p-8 shadow-2xl animate-in zoom-in-95 border-t-8 border-red-500 text-center">
            <h3 className="text-xl font-bold mb-8 text-mag-black">確定要刪除此項目？</h3>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-4 bg-gray-100 font-bold text-sm text-gray-500">取消</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-red-500 text-white font-bold text-sm active:bg-red-600">確認刪除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};