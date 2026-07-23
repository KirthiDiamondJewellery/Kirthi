import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, Phone, Mail, Navigation, ExternalLink } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { SharedFooter } from './SharedFooter';

const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(GOOGLE_MAPS_API_KEY) && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY';

interface BoutiqueViewProps {
  boutiqueId: 'kochi' | 'calicut';
  onInquiry?: () => void;
}

export default function BoutiqueView({ boutiqueId, onInquiry }: BoutiqueViewProps) {
  const [mapError, setMapError] = useState(false);
  const { content } = useContent();

  const isKochi = boutiqueId === 'kochi';
  const name = isKochi ? "Kochi Flagship Boutique" : "Calicut Showroom";
  const address = isKochi 
    ? "34/572, By Pass Road, Palarivattom\nKochi, Kerala 682025" 
    : "61/11508A, Opposite Federal Bank, Puthiyara\nKozhikode, Kerala 673004";
  const hours = isKochi ? "Mon – Sat: 10:00am – 7:30pm\nClosed on Sundays" : "Mon – Sat: 10:00am – 7:30pm\nClosed on Sundays";
  const mapsLink = isKochi 
    ? "https://maps.google.com/?q=Kirthi+Diamonds+Kochi" 
    : "https://maps.google.com/?q=Kirthi+Diamonds+Calicut";
  
  const phone = "+91 98470 86990";
  const email = "info@kirthidiamonds.com";

  const schemaOpens = "10:00";
  const schemaCloses = "19:00";
  const SCHEMA_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const description = isKochi 
    ? "Our flagship boutique in Palarivattom represents the heart of Kirthi Diamonds' design philosophy. Situated in Ernakulam’s premier commercial district, this showroom offers our most extensive collection of GIA and IGI certified loose diamonds, alongside an exclusive bridal suite for one-on-one consultation. The Kochi atelier also houses our master craftsmen, allowing clients commissioning bespoke heirlooms to witness the precision of diamond setting and gold forging firsthand."
    : "Located in the historic trading hub of Kozhikode, our Puthiyara boutique brings Kirthi Diamonds' legacy of uncompromising quality to Malabar. This showroom features a curated selection of our finest solitaire engagement rings and high-jewellery collections, all set in BIS-hallmarked 18kt and 22kt gold. We offer dedicated one-on-one consultations for bridal clients, ensuring the same rigorous standards of diamond selection and artisanal craftsmanship that define our Maison.";

  return (
    <div id={`boutique-${boutiqueId}`} className="w-full h-full flex flex-col items-center justify-start px-4 sm:px-6 md:px-28 overflow-y-auto custom-scrollbar bg-[#050505]">
      <div className="max-w-6xl w-full pt-[120px] md:pt-[160px] pb-32 md:pb-48">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8 mb-16 text-center"
        >
          <div className="space-y-4">
            <h4 className="text-xs md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]">Our Showrooms</h4>
            <h1 className="text-4xl md:text-7xl font-serif italic mb-6">{name}</h1>
          </div>
          <div className="w-20 h-px bg-[#D4AF37] mx-auto"></div>
          <p className="max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed opacity-70 italic whitespace-pre-wrap">
            {isKochi 
              ? "Experience masterfully crafted high jewellery in the heart of Kerala's commercial capital. Discover an array of certified GIA & IGI diamonds and custom bridal suites."
              : "Discover extraordinary diamond bridal artistry in our Puthiyara boutique. Home to fine bespoke bridal collections and exquisite diamond heritage pieces."
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Boutique Details Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="p-8 border border-white/5 bg-black/40 backdrop-blur-xl rounded-sm space-y-8">
              <h2 className="text-xl font-serif italic border-b border-white/5 pb-4 text-[#D4AF37]">Boutique Information</h2>
              
              <div className="flex items-start space-x-4">
                <MapPin className="text-[#D4AF37] shrink-0 mt-1 opacity-80" size={20} />
                <div className="space-y-1">
                  <h3 className="text-xs uppercase tracking-widest text-white/50">Address</h3>
                  <p className="text-sm font-light leading-relaxed whitespace-pre-wrap opacity-90">{address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="text-[#D4AF37] shrink-0 mt-1 opacity-80" size={20} />
                <div className="space-y-1">
                  <h3 className="text-xs uppercase tracking-widest text-white/50">Opening Hours</h3>
                  <p className="text-sm font-light opacity-90">
                    <time itemProp="openingHours" dateTime={`${SCHEMA_DAYS.map(d => d.substring(0, 2)).join(',') } ${schemaOpens}-${schemaCloses}`}>
                      {hours}
                    </time>
                  </p>
                  <p className="text-xs text-white/40 italic font-light pt-1">Sundays: Closed for private design workshops</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="text-[#D4AF37] shrink-0 mt-1 opacity-80" size={20} />
                <div className="space-y-1">
                  <h3 className="text-xs uppercase tracking-widest text-white/50">Telephone</h3>
                  <p className="text-sm font-light opacity-90">
                    <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-[#D4AF37] transition-colors">{phone}</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="text-[#D4AF37] shrink-0 mt-1 opacity-80" size={20} />
                <div className="space-y-1">
                  <h3 className="text-xs uppercase tracking-widest text-white/50">Inquiries</h3>
                  <p className="text-sm font-light opacity-90">
                    <a href={`mailto:${email}`} className="hover:text-[#D4AF37] transition-colors">{email}</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onInquiry}
                className="flex-1 py-4 px-6 border border-[#D4AF37]/50 text-[#D4AF37] text-xs uppercase tracking-[0.2em] font-light hover:bg-[#D4AF37] hover:text-black transition-all duration-300 text-center rounded-sm"
              >
                Book Consultation
              </button>
              <a 
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 px-6 bg-white/5 border border-white/10 hover:border-white/25 text-white text-xs uppercase tracking-[0.2em] font-light transition-all duration-300 text-center flex items-center justify-center space-x-2 rounded-sm"
              >
                <span>Navigate</span>
                <Navigation size={14} className="opacity-80" />
              </a>
            </div>
          </motion.div>

          {/* Interactive Map Embed Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="relative aspect-[16/9] w-full border border-white/10 rounded-sm overflow-hidden bg-black/60 group hover:border-[#D4AF37]/30 transition-all">
               <img 
                 src={isKochi ? "/image.png" : "/calicut.png"} 
                 onError={(e) => { e.currentTarget.src = "/logo.png" }}
                 alt={`Kirthi Diamonds ${name}`}
                 className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
               />
            </div>
            <div className="relative aspect-[16/10] w-full border border-white/10 rounded-sm overflow-hidden bg-black/60 group hover:border-[#D4AF37]/30 transition-all">
              {hasValidKey ? (
                mapError ? (
                  <iframe 
                    src={isKochi ? 
                      "https://maps.google.com/maps?q=Kirthi%20Diamonds,%20Kochi&t=&z=15&ie=UTF8&iwloc=&output=embed" : 
                      "https://maps.google.com/maps?q=Kirthi%20Diamonds,%20Calicut&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    }
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '300px' }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <APIProvider apiKey={GOOGLE_MAPS_API_KEY} version="weekly" onError={() => setMapError(true)}>
  
                  <div className="w-full h-full min-h-[300px]">
                    <Map
                      defaultCenter={{ 
                        lat: isKochi ? Number(content.kochiLat ?? 10.006514026736081) : Number(content.calicutLat ?? 11.255769028405163), 
                        lng: isKochi ? Number(content.kochiLng ?? 76.313041) : Number(content.calicutLng ?? 75.789228) 
                      }}
                      defaultZoom={15}
                      mapId="DEMO_MAP_ID"
                      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      style={{ width: '100%', height: '100%' }}
                      gestureHandling="cooperative"
                    >
                      <AdvancedMarker 
                        position={{ 
                          lat: isKochi ? Number(content.kochiLat ?? 10.006514026736081) : Number(content.calicutLat ?? 11.255769028405163), 
                          lng: isKochi ? Number(content.kochiLng ?? 76.313041) : Number(content.calicutLng ?? 75.789228) 
                        }} 
                        title={name} 
                        onClick={() => window.open(mapsLink, '_blank')}
                      >
                        <Pin background="#D4AF37" glyphColor="#000000" borderColor="#D4AF37" />
                      </AdvancedMarker>
                    </Map>
                  </div>
                </APIProvider>
                )
              ) : (
                <iframe
                  title={`Kirthi Diamonds ${name} Map`}
                  src={`https://maps.google.com/maps?q=Kirthi%20Diamonds%20${isKochi ? 'Kochi' : 'Calicut'}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0 filter invert-[90%] hue-rotate-[180deg] opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
              <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-2 border border-white/10 rounded-sm flex items-center space-x-2 z-[10]">
                <span className="text-[10px] uppercase tracking-widest text-white/50 font-light">
                  {hasValidKey ? "Interactive Google Map" : "Standard Map Preview"}
                </span>
                <ExternalLink size={10} className="text-[#D4AF37]" />
              </div>
            </div>

            <div className="p-6 border border-white/5 bg-black/20 rounded-sm">
              <h3 className="text-sm font-serif italic text-[#D4AF37] mb-2">Visitor Guidance</h3>
              <p className="text-xs leading-relaxed text-white/60 font-light">
                To guarantee dedicated guidance from our Master Jewellers, we recommend scheduling an appointment. Valet parking is available at both locations. Walk-ins are accommodated based on diamond host availability.
              </p>
            </div>
          </motion.div>

        </div>

      </div>
      <SharedFooter />
    </div>
  );
}
