import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { APIProvider, Map, AdvancedMarker, Pin, useAdvancedMarkerRef, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';

const API_KEY =
  (typeof process !== 'undefined' && process.env?.GOOGLE_MAPS_PLATFORM_KEY) ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const STORES = [
  {
    id: 'kochi',
    name: 'Kochi Boutique',
    address: 'Palarivattom, Kochi, Kerala',
    location: { lat: 10.006514026736081, lng: 76.31314780185147 },
    phone: '+91 98470 86990',
    hours: '10:00 AM - 8:00 PM (Closed on Sundays)',
    description: 'Our flagship showroom offering bespoke diamond jewellery commissions and GIA/IGI certified bridal sets.'
  },
  {
    id: 'calicut',
    name: 'Calicut Boutique',
    address: 'Puthiyara, Kozhikode, Kerala',
    location: { lat: 11.255769028405163, lng: 75.78914260997904 },
    phone: '+91 98470 86002',
    hours: '10:00 AM - 8:00 PM (Closed on Sundays)',
    description: 'Experience custom bridal diamond collections, expert consultations, and ethical loose solitaires in Calicut.'
  }
];

function MarkerWithInfoWindow({ 
  store,
  isSelected,
  onClick
}: { 
  store: typeof STORES[0];
  isSelected: boolean;
  onClick: () => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker 
        ref={markerRef} 
        position={store.location} 
        onClick={onClick}
        title={store.name}
      >
        <Pin 
          background={isSelected ? "#D4AF37" : "#0A0A0A"} 
          borderColor={isSelected ? "#0A0A0A" : "#D4AF37"}
          glyphColor={isSelected ? "#0A0A0A" : "#D4AF37"} 
        />
      </AdvancedMarker>
      {isSelected && (
        <InfoWindow anchor={marker} onCloseClick={onClick} headerDisabled={true}>
          <div className="p-4 bg-[#0A0A0A] text-[#F5F5F0] font-sans border border-white/10 rounded-lg max-w-[250px]">
            <h4 className="text-sm uppercase tracking-[0.2em] text-[#D4AF37] mb-2">{store.name}</h4>
            <p className="text-xs opacity-70 mb-3">{store.description}</p>
            <div className="space-y-2 text-[10px] tracking-widest opacity-60">
              <p className="flex items-start gap-2"><MapPin size={12} className="shrink-0 mt-0.5" /> <span>{store.address}</span></p>
              <p className="flex items-start gap-2"><Phone size={12} className="shrink-0 mt-0.5" /> <span>{store.phone}</span></p>
              <p className="flex items-start gap-2"><Clock size={12} className="shrink-0 mt-0.5" /> <span>{store.hours}</span></p>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function MapController({ selectedStore }: { selectedStore: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (map && selectedStore) {
      const store = STORES.find(s => s.id === selectedStore);
      if (store) {
        map.panTo(store.location);
        map.setZoom(14);
      }
    } else if (map && !selectedStore) {
       // center between the two stores approximately
       map.panTo({ lat: 10.6328, lng: 76.0427 });
       map.setZoom(8);
    }
  }, [map, selectedStore]);
  return null;
}

export default function StoreLocatorView({ onInquiry }: { onInquiry?: () => void }) {
  const [mapError, setMapError] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  if (!hasValidKey) {
    return (
      <div className="relative w-full h-[100dvh] bg-[#050505] text-[#F5F5F0] pt-24 px-4 sm:px-6 md:px-12 pb-12 flex items-center justify-center">
        <div className="text-center max-w-lg border border-white/10 p-8 md:p-12 bg-[#0A0A0A]">
          <h2 className="text-2xl font-serif italic text-[#D4AF37] mb-4">Google Maps Configuration Required</h2>
          <div className="text-sm font-light opacity-70 space-y-4 text-left">
            <p><strong>Step 1:</strong> Get an API Key from the Google Cloud Console.</p>
            <p><strong>Step 2:</strong> Add your key as a secret in AI Studio:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Open <strong>Settings</strong> (⚙️ gear icon, top-right)</li>
              <li>Select <strong>Secrets</strong></li>
              <li>Type <code>GOOGLE_MAPS_PLATFORM_KEY</code>, press Enter</li>
              <li>Paste your API key, press Enter</li>
            </ul>
            <p className="pt-4 text-xs tracking-widest text-[#D4AF37]">The map will automatically load once configured.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[100dvh] bg-[#050505] text-[#F5F5F0] pt-24 pb-0 flex flex-col md:flex-row z-10">
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 h-1/2 md:h-full overflow-y-auto custom-scrollbar border-r border-white/5 bg-[#050505] flex flex-col">
        <div className="p-6 md:p-10 pb-6 shrink-0">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/60 block mb-4">Location Directory</span>
          <h1 className="text-3xl md:text-4xl font-serif italic">Find a Store</h1>
          <p className="text-xs md:text-sm font-light opacity-60 mt-4 leading-relaxed">
            Discover Kirthi Diamonds boutiques. Experience our bespoke collections and schedule consultation appointments with our diamond specialists.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-10 pb-10 space-y-4">
          {STORES.map((store) => (
            <div 
              key={store.id}
              onClick={() => setSelectedStore(selectedStore === store.id ? null : store.id)}
              className={`p-6 border transition-all cursor-pointer ${selectedStore === store.id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/10 bg-[#0A0A0A] hover:border-white/30'}`}
            >
              <h3 className="text-lg font-serif italic mb-2 text-[#D4AF37]">{store.name}</h3>
              <div className="space-y-3 mt-4 text-xs font-light tracking-wide opacity-70">
                <p className="flex items-start gap-3">
                  <MapPin size={14} className="shrink-0 mt-0.5 text-[#D4AF37]" />
                  <span>{store.address}</span>
                </p>
                <p className="flex items-start gap-3">
                  <Clock size={14} className="shrink-0 mt-0.5 text-[#D4AF37]" />
                  <span>{store.hours}</span>
                </p>
                <p className="flex items-start gap-3">
                  <Phone size={14} className="shrink-0 mt-0.5 text-[#D4AF37]" />
                  <span>{store.phone}</span>
                </p>
              </div>
              
              {selectedStore === store.id && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 pt-6 border-t border-white/10"
                >
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${store.location.lat},${store.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-black transition-all mb-3"
                  >
                    <Navigation size={12} />
                    Get Directions
                  </a>
                  <button 
                    onClick={(e) => {
                       e.stopPropagation();
                       if (onInquiry) onInquiry();
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#D4AF37] text-black text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all"
                  >
                    Book Consultation
                  </button>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Map View */}
      <div className="w-full md:w-2/3 h-1/2 md:h-full relative bg-[#111]">
         
        {mapError ? (
           <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#050505] text-center border border-white/10 m-4 max-w-[90%] mx-auto mt-[10%] max-h-[80%] rounded-sm">
             <MapPin size={24} className="text-[#D4AF37] mb-4" />
             <h3 className="text-xl font-serif italic text-white/90 mb-2">Interactive Map Unavailable</h3>
             <p className="text-sm font-light text-white/50 mb-6 max-w-sm">The interactive map could not be loaded. This may be due to API key restrictions.</p>
           </div>
        ) : (
          <APIProvider apiKey={API_KEY} version="weekly" onError={() => setMapError(true)}>
    
            <Map
              defaultCenter={{ lat: 10.6328, lng: 76.0427 }}
              defaultZoom={8}
              mapId="KIRTHI_STORE_LOCATOR"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
              disableDefaultUI={true}
              zoomControl={true}
            >
               <MapController selectedStore={selectedStore} />
               {STORES.map(store => (
                 <MarkerWithInfoWindow 
                   key={store.id} 
                   store={store} 
                   isSelected={selectedStore === store.id}
                   onClick={() => setSelectedStore(selectedStore === store.id ? null : store.id)}
                 />
               ))}
            </Map>
         </APIProvider>
        )}
      </div>
    </div>
  );
}
