
import React, { useState, useRef, useEffect } from 'react';
import { ShoppingItem } from '../types';
import { PlusIcon, TrashIcon, EditIcon, XIcon, ShoppingIcon } from '../components/Icons';

interface ShoppingViewProps {
  items: ShoppingItem[];
  setItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
}

export const ShoppingView: React.FC<ShoppingViewProps> = ({ items, setItems }) => {
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

  const handleOpenEdit = (item: ShoppingItem) => {
    setModalMode('edit');
    setModalText(item.text);
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleModalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault(); 
    if (!modalText.trim()) return;

    if (modalMode === 'add') {
      const newItem: ShoppingItem = { id: Date.now().toString(), text: modalText.trim(), isCompleted: false };
      setItems(prev => [newItem, ...prev]); 
    } else if (modalMode === 'edit' && editingId) {
      setItems(prev => prev.map(item => item.id === editingId ? { ...item, text: modalText.trim() } : item));
    }

    setModalText('');
    setShowModal(false);
  };

  const handleToggle = (id: string) => { 
    setItems(prev => prev.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item)); 
  };

  const confirmDelete = () => {
    if (deleteId) {
      setItems(prev => prev.filter(item => item.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="pb-32 pt-0 animate-in fade-in duration-700">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-xs font-black tracking-[0.2em] text-mag-gray uppercase mb-1">SHOPPING</h2>
          <h3 className="text-[20px] font-serif font-black text-mag-black">購物清單</h3>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="mb-1 p-2 bg-mag-black text-white shadow-md active:scale-95 transition-transform"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 && !showModal ? (
          <div className="text-center py-12 bg-white border border-dashed border-gray-200 rounded-none">
             <ShoppingIcon className="w-12 h-12 mx-auto text-gray-200 mb-2" />
             <p className="text-sm font-black text-gray-400">目前清單為空</p>
          </div>
        ) : (
          items.map(item => {
            return (
              <div key={item.id} className={`group bg-white rounded-none border p-5 flex items-center gap-4 transition-all ${item.isCompleted ? 'border-gray-100 opacity-60 bg-gray-50' : 'border-gray-200 shadow-soft'}`}>
                <button onClick={() => handleToggle(item.id)} className={`shrink-0 w-6 h-6 rounded-none border-2 flex items-center justify-center ${item.isCompleted ? 'bg-mag-gold border-mag-gold' : 'bg-white border-gray-300'}`}>
                  {item.isCompleted && <XIcon className="w-4 h-4 text-white" />}
                </button>
                <span className={`flex-1 text-base font-black ${item.isCompleted ? 'text-gray-400 line-through' : 'text-mag-black'}`}>
                  {item.text}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenEdit(item)} className="text-gray-300 hover:text-mag-gold active:text-mag-gold">
                    <EditIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="text-gray-300 hover:text-red-500 active:text-red-500">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Unified Modal for Add & Edit */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 border-t-4 border-mag-black">
            <h3 className="text-lg font-bold mb-4 text-mag-black">
              {modalMode === 'add' ? '新增購物項目' : '編輯購物項目'}
            </h3>
            <input 
              ref={modalInputRef}
              type="text" 
              value={modalText} 
              onChange={(e) => setModalText(e.target.value)} 
              placeholder="想要買什麼..." 
              className="w-full bg-gray-50 border border-gray-200 p-3 mb-6 outline-none font-bold focus:border-mag-gold text-lg"
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
            <h3 className="text-xl font-bold mb-8 text-mag-black">確定要刪除此購物項目？</h3>
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
