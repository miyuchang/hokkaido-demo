
import React, { useState, useRef, useEffect } from 'react';
import { ChecklistItem } from '../types';
import { CheckIcon, TrashIcon, EditIcon, PlusIcon, XIcon } from '../components/Icons';

interface PackingViewProps {
  checkedItems: Set<string>;
  toggleItem: (id: string) => void;
  carryOnList: ChecklistItem[];
  setCarryOnList: (list: ChecklistItem[]) => void;
  checkedBagList: ChecklistItem[];
  setCheckedBagList: (list: ChecklistItem[]) => void;
}

export const PackingView: React.FC<PackingViewProps> = ({ 
  checkedItems, 
  toggleItem, 
  carryOnList, 
  setCarryOnList, 
  checkedBagList, 
  setCheckedBagList 
}) => {
  const [activeSegment, setActiveSegment] = useState<'carry-on' | 'checked'>('carry-on');
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

  const activeList = activeSegment === 'carry-on' ? carryOnList : checkedBagList;
  const setList = activeSegment === 'carry-on' ? setCarryOnList : setCheckedBagList;

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
      const newItem: ChecklistItem = { id: `pack_${Date.now()}`, text: modalText.trim() };
      setList([...activeList, newItem]);
    } else if (modalMode === 'edit' && editingId) {
      setList(activeList.map(i => i.id === editingId ? { ...i, text: modalText.trim() } : i));
    }

    setModalText('');
    setShowModal(false);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setList(activeList.filter(i => i.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="pb-32 pt-0 animate-in fade-in duration-700">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-xs font-black tracking-[0.2em] text-mag-gray uppercase mb-1">PACKING</h2>
          <h3 className="text-[20px] font-serif font-black text-mag-black">行李清單</h3>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="mb-1 p-2 bg-mag-black text-white shadow-md active:scale-95 transition-transform"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex mb-3 bg-gray-200/50 p-1 rounded-none">
        <button
          onClick={() => setActiveSegment('carry-on')}
          className={`flex-1 py-2.5 text-sm font-black rounded-none transition-all duration-200 ${
            activeSegment === 'carry-on' 
              ? 'bg-white text-mag-black shadow-none' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          隨身行李
        </button>
        <button
          onClick={() => setActiveSegment('checked')}
          className={`flex-1 py-2.5 text-sm font-black rounded-none transition-all duration-200 ${
            activeSegment === 'checked' 
              ? 'bg-white text-mag-black shadow-none' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          托運行李
        </button>
      </div>

      <div className={`mb-3 bg-mag-gold-light border-l-4 border-mag-gold px-4 py-3 rounded-none flex items-center`}>
          <span className="text-mag-black text-[13px] font-bold leading-tight">
            {activeSegment === 'carry-on' 
              ? '⚠️ 液體容器限 100ml 以內，且需裝入透明夾鏈袋' 
              : '🚫 嚴禁攜帶行動電源、鋰電池於托運行李'}
          </span>
      </div>

      <div className="bg-mag-white rounded-none shadow-soft border border-gray-100 overflow-hidden divide-y divide-gray-50">
        {activeList.map((item) => {
          const isChecked = checkedItems.has(item.id);

          return (
            <div key={item.id} className="group flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
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
                className={`flex-1 text-base leading-snug cursor-pointer select-none ${
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

      {/* Unified Modal for Add & Edit */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 border-t-4 border-mag-black">
            <h3 className="text-lg font-bold mb-4 text-mag-black">
              {modalMode === 'add' ? `新增${activeSegment === 'carry-on' ? '隨身' : '托運'}項目` : '編輯行李項目'}
            </h3>
            <input 
              ref={modalInputRef}
              type="text" 
              value={modalText} 
              onChange={(e) => setModalText(e.target.value)} 
              placeholder="輸入項目內容..." 
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
