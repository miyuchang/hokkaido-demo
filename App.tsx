import React, { useState, useEffect } from 'react';
import { Tab, ShoppingItem, ExpenseRecord, ChecklistItem } from './types';
import { LOCATION_DETAILS, GOOGLE_SCRIPT_URL, ITINERARY, TODO_LIST, PACKING_CARRY_ON, PACKING_CHECKED } from './constants';
import { parseCurrency } from './utils';
import { ItineraryView } from './views/ItineraryView';
import { PrepView } from './views/PrepView';
import { PackingView } from './views/PackingView';
import { DetailView } from './views/DetailView';
import { InfoView } from './views/InfoView';
import { ShoppingView } from './views/ShoppingView';
import { CostView } from './views/CostView';
import { SunIcon, CloudIcon, RainIcon, SnowIcon } from './components/Icons';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.ITINERARY);
  
  // 狀態初始化
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('checked_items');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const [todoList, setTodoList] = useState<ChecklistItem[]>(() => JSON.parse(localStorage.getItem('dynamic_todo_list') || JSON.stringify(TODO_LIST)));
  const [carryOnList, setCarryOnList] = useState<ChecklistItem[]>(() => JSON.parse(localStorage.getItem('dynamic_carryon_list') || JSON.stringify(PACKING_CARRY_ON)));
  const [checkedBagList, setCheckedBagList] = useState<ChecklistItem[]>(() => JSON.parse(localStorage.getItem('dynamic_checkedbag_list') || JSON.stringify(PACKING_CHECKED)));
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => JSON.parse(localStorage.getItem('shopping_list') || '[]'));

  // 整合同步機制
  useEffect(() => {
    localStorage.setItem('checked_items', JSON.stringify(Array.from(checkedItems)));
    localStorage.setItem('dynamic_todo_list', JSON.stringify(todoList));
    localStorage.setItem('dynamic_carryon_list', JSON.stringify(carryOnList));
    localStorage.setItem('dynamic_checkedbag_list', JSON.stringify(checkedBagList));
    localStorage.setItem('shopping_list', JSON.stringify(shoppingList));
  }, [checkedItems, todoList, carryOnList, checkedBagList, shoppingList]);

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedDateIdx, setSelectedDateIdx] = useState<number>(0);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [isExpensesLoading, setIsExpensesLoading] = useState(false);
  const [expensesError, setExpensesError] = useState<string | null>(null);
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [activeTab, selectedDateIdx]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.0611&longitude=141.3564&current=temperature_2m,weather_code&timezone=Asia%2FTokyo');
        const data = await res.json();
        if (data.current) setWeather({ temp: Math.round(data.current.temperature_2m), code: data.current.weather_code });
      } catch (e) { console.error("Weather fetch failed", e); }
    };
    fetchWeather();
  }, []);

  const fetchExpenses = async () => {
    if (!GOOGLE_SCRIPT_URL) return;
    setIsExpensesLoading(true);
    setExpensesError(null);
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?t=${Date.now()}`);
      const json = await response.json();
      if (json.status === 'error' || json.result === 'error') throw new Error(json.message);
      
      const parsedData: ExpenseRecord[] = (json.data || [])
        .filter((row: any) => row.rowIndex >= 3 && !row.date.includes('日期'))
        .map((row: any): ExpenseRecord => {
          const sATwd = parseCurrency(row.splitATwd);
          const sBTwd = parseCurrency(row.splitBTwd);
          const sAJpy = parseCurrency(row.splitAJpy);
          const sBJpy = parseCurrency(row.splitBJpy);
          const twd = parseCurrency(row.twd);
          const jpy = parseCurrency(row.jpy);
          
          const isManual = (twd > 0 && Math.abs(sATwd - sBTwd) > 1) || (jpy > 0 && Math.abs(sAJpy - sBJpy) > 1);

          return {
            rowIndex: Number(row.rowIndex),
            date: row.date,
            item: row.item,
            payer: row.payer === '小 A' ? '小 A' : '小 B',
            amountTwd: twd,
            amountJpy: jpy,
            note: row.note,
            splitType: isManual ? 'manual' : 'equal',
            splitATwd: sATwd,
            splitAJpy: sAJpy,
            splitBTwd: sBTwd,
            splitBJpy: sBJpy
          };
        })
        .sort((a: ExpenseRecord, b: ExpenseRecord) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.rowIndex - a.rowIndex);

      setExpenses(parsedData);
    } catch (err: any) { setExpensesError(err.message || "讀取失敗"); }
    finally { setIsExpensesLoading(false); }
  };

  useEffect(() => { if (activeTab === Tab.COST && expenses.length === 0) fetchExpenses(); }, [activeTab]);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const getWeatherIcon = (code: number) => {
    const ic = "w-9 h-9"; 
    if (code === 0) return <SunIcon className={`${ic} text-mag-gold`} />;
    if (code >= 1 && code <= 3) return <CloudIcon className={`${ic} text-gray-400`} />;
    if ((code >= 45 && code <= 48) || (code >= 51 && code <= 55)) return <CloudIcon className={`${ic} text-gray-300`} />;
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return <RainIcon className={`${ic} text-blue-400`} />;
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return <SnowIcon className={`${ic} text-blue-200`} />;
    return <SunIcon className={`${ic} text-mag-gold`} />;
  };

  return (
    <div className="relative min-h-screen font-sans text-mag-black bg-mag-paper">
      {selectedLocationId && LOCATION_DETAILS[selectedLocationId] && (
        <DetailView location={LOCATION_DETAILS[selectedLocationId]} onBack={() => setSelectedLocationId(null)} />
      )}

      <header className="fixed top-0 left-0 right-0 z-30 pt-safe-top bg-white">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between items-center py-5 px-6">
             <div className="text-left">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="bg-mag-black text-white text-[10px] px-1.5 py-0.5 font-black tracking-normal leading-none">2025</span>
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-mag-gold">Hokkaido Trip</span>
                </div>
                <h1 className="font-noto font-medium text-[20px] leading-none">北海道冬日之旅</h1>
             </div>
             {weather && (
               <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-mono font-black text-mag-black leading-none mb-1">{weather.temp}°C</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase leading-none tracking-tighter">SAPPORO</div>
                  </div>
                  {getWeatherIcon(weather.code)}
               </div>
             )}
          </div>

          <nav className="flex w-full bg-white">
            {Object.values(Tab).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 pt-0 pb-3 text-[13px] font-noto transition-all border-b-[4px] text-center ${
                  activeTab === tab ? 'border-mag-gold text-mag-black font-bold' : 'border-transparent text-gray-400'
                }`}
              >
                {tab === Tab.ITINERARY ? '行程' : tab === Tab.PREP ? '準備' : tab === Tab.COST ? '記帳' : tab === Tab.PACKING ? '行李' : tab === Tab.SHOPPING ? '購物' : '資訊'}
              </button>
            ))}
          </nav>

          {activeTab === Tab.ITINERARY && (
            <div className="flex w-full border-t border-gray-50 bg-white px-2">
              {ITINERARY.map((day, idx) => (
                <button key={idx} onClick={() => setSelectedDateIdx(idx)} className="flex-1 flex flex-col items-center justify-center py-3">
                  <div className={`flex flex-col items-center justify-center w-11 h-11 transition-all ${selectedDateIdx === idx ? 'bg-mag-black text-white' : ''}`}>
                    <div className={`text-[9px] font-bold mb-1 leading-none ${selectedDateIdx === idx ? 'text-gray-300' : 'text-mag-gray'}`}>{day.weekday[2]}</div>
                    <div className={`text-[11px] font-mono font-black leading-none`}>{day.date}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className={`max-w-xl mx-auto px-6 ${activeTab === Tab.ITINERARY ? 'pt-[190px]' : 'pt-[120px]'} min-h-screen`}>
        {activeTab === Tab.ITINERARY && <ItineraryView onNavigateToDetail={setSelectedLocationId} selectedDateIdx={selectedDateIdx} />}
        {activeTab === Tab.PREP && <PrepView checkedItems={checkedItems} toggleItem={toggleItem} list={todoList} setList={setTodoList} />}
        {activeTab === Tab.PACKING && <PackingView checkedItems={checkedItems} toggleItem={toggleItem} carryOnList={carryOnList} setCarryOnList={setCarryOnList} checkedBagList={checkedBagList} setCheckedBagList={setCheckedBagList} />}
        {activeTab === Tab.SHOPPING && <ShoppingView items={shoppingList} setItems={setShoppingList} />}
        {activeTab === Tab.COST && <CostView expenses={expenses} isLoading={isExpensesLoading} fetchError={expensesError} onRefresh={fetchExpenses} onAddSuccess={fetchExpenses} />}
        {activeTab === Tab.INFO && <InfoView />}
      </main>
    </div>
  );
};

export default App;
