import React, { useState, useEffect } from 'react';
import { ITINERARY } from '../constants';
import { ItineraryEvent } from '../types';
import { BedIcon, MapIcon, ChevronRightIcon } from '../components/Icons';

interface ItineraryViewProps {
  onNavigateToDetail: (id: string) => void;
  selectedDateIdx: number;
}

const TimelineEvent: React.FC<{ event: ItineraryEvent; isLast: boolean; onLocationClick: (id: string) => void }> = ({ event, isLast, onLocationClick }) => {
  return (
    <div className="flex relative group">
      <div className="w-14 pt-1 flex-shrink-0 text-right pr-4">
        <span className="text-sm font-bold text-mag-black font-mono">{event.time}</span>
      </div>
      <div className="flex flex-col items-center mr-4 relative">
        <div className={`w-3 h-3 rounded-full border-2 z-10 bg-mag-paper ${event.isHighlight ? 'border-mag-red' : 'border-gray-300'}`}></div>
        {!isLast && <div className="w-[1.5px] bg-gray-200 flex-grow my-1"></div>}
      </div>
      <div className="flex-1 pb-6">
        <div 
          onClick={() => event.locationId && onLocationClick(event.locationId)}
          className={`relative p-5 rounded-none transition-all ${
            event.isHighlight 
              ? 'bg-mag-gold-light border border-mag-gold/20' 
              : 'bg-white border-gray-100 shadow-soft'
          } ${event.locationId ? 'cursor-pointer active:bg-gray-50' : ''}`}
        >
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className={`text-base leading-snug ${event.isHighlight ? 'text-mag-black font-black' : 'text-mag-black font-bold'}`}>
                {event.description}
              </p>
              {event.note && <p className="text-sm text-mag-gray mt-1.5 font-medium">{event.note}</p>}
            </div>
            {event.locationId && (
              <div className="text-mag-gold mt-0.5">
                <ChevronRightIcon className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ItineraryView: React.FC<ItineraryViewProps> = ({ onNavigateToDetail, selectedDateIdx }) => {
  const currentDay = ITINERARY[selectedDateIdx];
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="animate-in fade-in duration-700">
      <div className="pb-32">
        <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-mag-gold mb-3 pt-6">
          Daily Journey Log
        </p>

        <div className="mb-8 relative">
          <div className="pr-14">
             <h2 className="text-[18px] font-serif font-black text-mag-black mb-1.5 tracking-tight leading-tight">{currentDay.title}</h2>
             {currentDay.accommodation && (
               <div className="flex items-center gap-2 mt-2.5">
                 <BedIcon className="w-4 h-4 text-mag-gold" />
                 {currentDay.accommodationMapUrl ? (
                   <a href={currentDay.accommodationMapUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-black text-mag-gray active:text-mag-red">
                     {currentDay.accommodation}
                   </a>
                 ) : (
                   <span className="text-sm font-black text-mag-gray">{currentDay.accommodation}</span>
                 )}
               </div>
             )}
          </div>
          {currentDay.mapUrl && (
             <a href={currentDay.mapUrl} target="_blank" rel="noopener noreferrer" className="absolute right-0 top-1 p-3 bg-white rounded-none border border-gray-100 shadow-float text-mag-gold active:scale-90 transition-transform">
                <MapIcon className="w-5 h-5" />
             </a>
          )}
        </div>

        <div className="relative">
          {currentDay.events.map((event, idx) => (
            <TimelineEvent key={idx} event={event} isLast={idx === currentDay.events.length - 1} onLocationClick={onNavigateToDetail} />
          ))}
        </div>
      </div>

      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-10 right-6 z-40 p-2.5 bg-mag-black text-white rounded-none shadow-2xl transition-all duration-300 active:scale-90 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
      </button>
    </div>
  );
};