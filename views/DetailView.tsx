import React, { useEffect, useState } from 'react';
import { LocationDetail } from '../types';
import { MapIcon, CopyIcon, BusIcon, WalkIcon, XIcon } from '../components/Icons';
import { sanitizeUrl } from '../utils';

interface DetailViewProps {
  location: LocationDetail;
  onBack: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ location, onBack }) => {
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = 'unset'; }; }, []);
  const handleCopy = (text?: string) => { if (text) { navigator.clipboard.writeText(text); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); } };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={onBack}></div>
      <div className="relative z-10 w-full max-w-lg bg-mag-paper rounded-none shadow-2xl overflow-hidden max-h-[88vh] flex flex-col animate-in slide-in-from-bottom-full duration-300">
        
        {/* Header Area */}
        <div className="sticky top-0 left-0 right-0 bg-mag-paper z-20 px-6 pt-10 pb-2 shrink-0 border-b border-gray-100">
           <div className="flex justify-between items-start">
             <h1 className="text-[20px] font-noto font-bold text-mag-black leading-tight pr-4">{location.title}</h1>
             <button onClick={onBack} className="shrink-0 p-2 text-mag-gray"><XIcon className="w-6 h-6" /></button>
           </div>
        </div>

        <div className="overflow-y-auto px-6 pb-12 pt-6 no-scrollbar">
            <div className="w-12 h-1 bg-mag-gold mb-6"></div>
            
            {/* Standard Description */}
            {!location.transitLegs && location.description && (
              <p className="text-mag-black leading-relaxed text-sm font-bold whitespace-pre-line mb-8">{location.description}</p>
            )}

            {/* Transit Summary Card */}
            {location.transitLegs && location.description && (
              <div className="mb-6 bg-mag-gold-light border-l-4 border-mag-gold p-5">
                <div className="text-[10px] font-black text-mag-gold uppercase tracking-[0.2em] mb-2">TRANSIT OVERVIEW / 概覽</div>
                <p className="text-mag-black font-bold text-sm leading-relaxed whitespace-pre-line">
                  {location.description}
                </p>
              </div>
            )}

            {/* Structured Reservation Voucher */}
            {location.reservation && (
              <div className="mb-8 overflow-hidden rounded-none border border-gray-100 shadow-sm">
                <div className="bg-mag-black text-white p-6 rounded-none relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-[9px] font-black uppercase text-mag-gold tracking-[0.2em]">Travel Document / 2026</div>
                    <div className="flex gap-[2px] opacity-40">
                      {[2, 4, 1, 3, 2, 5, 2, 1, 4, 2].map((h, i) => (
                        <div key={i} className="bg-white" style={{ width: '2px', height: `${h * 3}px` }}></div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 mb-0.5 tracking-wider">BOOKING REFERENCE</div>
                      <div className="text-2xl font-mono font-bold text-white tracking-tight leading-none">{location.reservation?.id}</div>
                    </div>
                    <button onClick={() => handleCopy(location.reservation?.id)} className="bg-white/10 hover:bg-white/20 p-2.5 transition-colors">
                      <CopyIcon className="w-4 h-4 text-mag-gold"/>
                    </button>
                  </div>
                  
                  <div className="absolute -bottom-[1px] left-0 right-0 flex justify-center overflow-hidden">
                    <div className="w-full border-b-2 border-dashed border-mag-paper opacity-30"></div>
                  </div>
                </div>

                <div className="bg-white p-6 space-y-7">
                  {location.reservation?.sections.map((s, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-1.5 bg-mag-gold rotate-45"></div>
                        <h3 className="text-[10px] font-black text-mag-gray uppercase tracking-[0.2em]">{s.title}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                        {s.items.map((it, idx) => (
                          <div key={idx} className={`${it.isFullWidth ? 'col-span-2' : 'col-span-1'}`}>
                            <div className="text-[9px] font-bold text-gray-300 uppercase mb-1 tracking-wider">{it.label}</div>
                            <div className="text-[14px] font-noto font-bold text-mag-black leading-snug">{it.value}</div>
                          </div>
                        ))}
                      </div>
                      {location.reservation && i < location.reservation.sections.length - 1 && <div className="mt-6 border-b border-gray-50"></div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Auxiliary Info */}
            {(location.carNaviPhone || location.address) && (
              <div className="space-y-3 mb-10">
                 {location.carNaviPhone && (
                   <div className="bg-mag-gold-light p-5 border border-mag-gold/10 flex justify-between items-center">
                      <div>
                        <div className="text-[9px] font-black text-mag-gold uppercase tracking-widest mb-1.5">Car GPS / 電話導航</div>
                        <div className="text-lg font-mono font-bold text-mag-black leading-none">{location.carNaviPhone}</div>
                      </div>
                      <button onClick={() => handleCopy(location.carNaviPhone)} className="p-2.5 bg-white text-mag-gold shadow-sm active:scale-90 transition-transform">
                        <CopyIcon className="w-5 h-5"/>
                      </button>
                   </div>
                 )}
                 {location.address && (
                   <div className="text-[11px] font-bold text-mag-gray px-1 leading-relaxed">
                     <span className="text-mag-gold mr-2 font-black">地址:</span>{location.address}
                   </div>
                 )}
              </div>
            )}

            {/* Transit Details - Optimized Spacing */}
            {location.transitLegs && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-1.5 bg-mag-gold"></div>
                  <h3 className="text-sm font-black text-mag-black tracking-[0.2em] uppercase">Route Details / 路線細節</h3>
                </div>
                
                <div className="space-y-8">
                  {location.transitLegs.map((leg, idx) => (
                    <div key={idx} className="relative pl-12 last:pb-0">
                      {/* Line Connector */}
                      {location.transitLegs && idx < location.transitLegs.length - 1 && (
                        <div className="absolute left-[15px] top-8 bottom-[-32px] w-[3px] bg-gray-100"></div>
                      )}
                      
                      {/* Icon Circle */}
                      <div className={`absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center z-10 shadow-sm ${
                        leg.type === 'bus' ? 'border-blue-500' : 'border-gray-200'
                      }`}>
                        {leg.type === 'bus' && <BusIcon className="w-4 h-4 text-blue-500" />}
                        {leg.type === 'walk' && <WalkIcon className="w-4 h-4 text-gray-400" />}
                        {leg.type === 'train' && <div className="text-[10px] font-black">JR</div>}
                      </div>

                      <div className="space-y-2">
                        {/* Transport Method & Time */}
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span className="text-base font-black text-mag-black leading-tight">{leg.transport}</span>
                            <span className="text-[11px] font-mono font-black text-white bg-mag-black px-2 py-0.5 shrink-0">
                              {leg.depTime} ➔ {leg.arrTime}
                            </span>
                          </div>
                        </div>

                        {/* Station Path - More Compact */}
                        <div className="bg-white border border-gray-100 p-3 rounded-none shadow-sm flex flex-col gap-1">
                           <div className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                              <span className="text-xs font-bold text-mag-gray uppercase tracking-tight w-10">From:</span>
                              <span className="text-sm font-black text-mag-black">{leg.depStop}</span>
                           </div>
                           <div className="ml-0.5 w-[1px] h-2 border-l border-dashed border-gray-300"></div>
                           <div className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-mag-gold"></div>
                              <span className="text-xs font-bold text-mag-gray uppercase tracking-tight w-10">To:</span>
                              <span className="text-sm font-black text-mag-black">{leg.arrStop}</span>
                           </div>
                        </div>

                        {/* Additional Details */}
                        <div className="space-y-1 pl-1">
                          {leg.details.map((d, di) => (
                            <div key={di} className="text-[11px] text-mag-gray font-bold flex items-center gap-2">
                              <span className="w-1 h-1 bg-mag-gold/30 rounded-full"></span>
                              {d}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-4">
              {location.mapUrl && (
                <a 
                  href={sanitizeUrl(location.mapUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-4 bg-mag-black text-white text-sm font-bold tracking-[0.25em] rounded-none shadow-lg active:scale-[0.98] transition-all"
                >
                  GOOGLE MAPS
                </a>
              )}
              {location.websiteUrl && (
                <a 
                  href={sanitizeUrl(location.websiteUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-4 bg-white text-mag-black border-2 border-mag-black text-sm font-bold tracking-[0.25em] rounded-none active:bg-gray-50 transition-all"
                >
                   OFFICIAL SITE
                </a>
              )}
            </div>
        </div>
      </div>

      {/* Copy Feedback Toast */}
      {isCopied && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-mag-black text-white px-5 py-3 text-xs font-black rounded-none shadow-2xl animate-in fade-in slide-in-from-bottom-2 tracking-widest">
          COPIED TO CLIPBOARD
        </div>
      )}
    </div>
  );
};
