import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronRight, X, ChevronLeft, Plus, Minus, CheckCircle, Search, Camera, ArrowRight, Heart, User, MapPin, Phone, Mail, Info, Upload, Image as ImageIcon, Loader2, ShieldCheck, FileCheck, TrendingUp } from 'lucide-react';
import { Product, PRODUCTS } from '../constants';
import { useContent } from '../contexts/ContentContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import OrderStatus from './OrderStatus';
import { FastImage } from './FastImage';
import FilterModal from './FilterModal';
import { useAppStore } from '../store';
import { SharedFooter } from './SharedFooter';

export interface ShippingDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CartItem extends Product {
  cartItemId: string;
  selectedMetal?: string;
  selectedSize?: string;
  bespokeInstructions?: string;
  bespokeImage?: string;
  quantity: number;
}

const METAL_OPTIONS = ['18kt Yellow Gold', '18kt Rose Gold', '18kt White Gold'];
const RING_SIZES = Array.from({length: 25}, (_, i) => (i + 6).toString());
const BANGLE_SIZES = ['2-2', '2-4', '2-6', '2-8', '2-10', '2-12'];

// --- Product Detail Component ---
// --- Helper to aggregate specs ---
const formatWeight3Decimals = (weightStr?: string) => {
  if (!weightStr) return '';
  return weightStr.trim().replace(/(\d+(\.\d+)?)/g, (match) => {
    const num = parseFloat(match);
    return isNaN(num) ? match : num.toFixed(3);
  });
};

const getCombinedSpecs = (p: Product) => {
  const specs: string[] = [];
  if (p.metalWeight && String(p.metalWeight).trim()) specs.push(`Total Weight (Jewellery) : ${formatWeight3Decimals(String(p.metalWeight))}`);
  if (p.diamondWeight && String(p.diamondWeight).trim()) specs.push(`Total Diamond Weight : ${formatWeight3Decimals(String(p.diamondWeight))}`);
  if (p.metalQuality?.trim()) specs.push(`Metal Quality : ${p.metalQuality.trim()}`);
  if (p.diamondQuality?.trim()) specs.push(`Diamond Quality : ${p.diamondQuality.trim()}`);
  if (p.colourStoneWeight && String(p.colourStoneWeight).trim()) specs.push(`Colour Stone Weight : ${formatWeight3Decimals(String(p.colourStoneWeight))}`);
  
  if (p.details && Array.isArray(p.details)) {
     p.details.forEach(d => {
       if (d?.trim()) specs.push(d.trim());
     });
  }
  return specs;
};

// --- Lightbox Modal Component ---
function LightboxModal({
  images,
  initialIndex,
  onClose
}: {
  images: (string | null)[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoom) return;
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setMousePos({ x, y });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex((prev) => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft') setIndex((prev) => (prev - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/95 backdrop-blur-3xl"
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-4 text-white/50 hover:text-white transition-all z-[610]"
      >
        <X size={24} />
      </button>

      {images.length > 1 && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-8 z-[610] pointer-events-none">
          <button 
            onClick={(e) => { e.stopPropagation(); setIndex((prev) => (prev - 1 + images.length) % images.length); setZoom(false); }}
            className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black hover:border-transparent transition-all pointer-events-auto"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIndex((prev) => (prev + 1) % images.length); setZoom(false); }}
            className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black hover:border-transparent transition-all pointer-events-auto"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      <div 
        className={`relative w-full h-full flex items-center justify-center p-4 md:p-12 ${zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
        onClick={() => setZoom(!zoom)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoom(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            <FastImage 
              src={images[index] || undefined} 
              alt="Expanded view" 
              className="max-w-full max-h-[85vh] object-contain filter drop-shadow-[0_0_100px_rgba(255,255,255,0.05)] select-none"
              animate={{ scale: zoom ? 2.5 : 1 }}
              style={{ transformOrigin: `${mousePos.x}% ${mousePos.y}%` }}
              transition={{ type: "tween", ease: "linear", duration: 0 }}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-3 z-[610]">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => { setIndex(idx); setZoom(false); }}
              className={`w-16 h-16 md:w-20 md:h-20 border transition-all duration-300 overflow-hidden bg-[#0A0A0A] ${idx === index ? 'border-[#D4AF37] scale-110' : 'border-white/10 opacity-30 hover:opacity-100'}`}
            >
              <FastImage src={img || undefined} className="w-full h-full object-cover p-1" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// --- Product Detail Component ---
function ProductDetail({ 
  product, 
  allProducts,
  onBack, 
  onAddToCart,
  onProductSelect,
  wishlist,
  toggleWishlist
}: { 
  product: Product, 
  allProducts: Product[],
  onBack: () => void, 
  onAddToCart: (p: Product, metal?: string, size?: string, bespokeInstructions?: string, bespokeImage?: string, quantity?: number) => void,
  onProductSelect: (p: Product) => void,
  wishlist: string[],
  toggleWishlist: (id: string, e?: React.MouseEvent) => void
}) {
  const [angleIndex, setAngleIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);
  const { content } = useContent();
  const diamondBuybackPercentage = content?.diamondBuybackPercentage ?? 85;
  const diamondExchangePercentage = content?.diamondExchangePercentage ?? 100;
  const polkiBuybackPercentage = content?.polkiBuybackPercentage ?? 80;
  const polkiExchangePercentage = content?.polkiExchangePercentage ?? 100;
  const colourstoneBuybackPercentage = content?.colourstoneBuybackPercentage ?? 70;
  const colourstoneExchangePercentage = content?.colourstoneExchangePercentage ?? 80;

  const productMetals = product.availableMetals?.length ? product.availableMetals : METAL_OPTIONS;
  const [selectedMetal, setSelectedMetal] = useState(productMetals[0]);
  const isRing = product.category.toLowerCase().includes('ring');
  const isBangle = product.category.toLowerCase().includes('bangle');
  const hasVariants = product.availableSizes && product.availableSizes.length > 0;
  const needsSize = isRing || isBangle || hasVariants;
  const sizeOptions = hasVariants ? product.availableSizes! : isRing ? RING_SIZES : isBangle ? BANGLE_SIZES : [];
  const [selectedSize, setSelectedSize] = useState(sizeOptions.length > 0 ? sizeOptions[0] : undefined);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [isBespokeMode, setIsBespokeMode] = useState(false);
  const [bespokeInstructions, setBespokeInstructions] = useState('');
  const [bespokeImage, setBespokeImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [acquireState, setAcquireState] = useState<'idle' | 'acquiring' | 'success'>('idle');
  const [quantity, setQuantity] = useState(1);

  const handleAcquire = async () => {
    if (acquireState !== 'idle') return;
    setAcquireState('acquiring');
    await new Promise(resolve => setTimeout(resolve, 800));
    onAddToCart(product, selectedMetal, selectedSize, undefined, undefined, quantity);
    setAcquireState('success');
    setTimeout(() => {
      setAcquireState('idle');
    }, 2000);
  };

  const handleBespokeAcquire = async () => {
    setAcquireState('acquiring');
    await new Promise(resolve => setTimeout(resolve, 800));
    onAddToCart(product, selectedMetal, selectedSize, bespokeInstructions, bespokeImage || undefined, quantity);
    setAcquireState('success');
    setTimeout(() => {
      setAcquireState('idle');
      setIsBespokeMode(false);
      setBespokeInstructions('');
      setBespokeImage(null);
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBespokeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (detailRef.current) {
      detailRef.current.scrollTop = 0;
    }
  }, [product]);

  const anglesList = product.angles || (product.image ? [product.image] : []);

  const nextImage = () => {
    setAngleIndex((prev) => (prev + 1) % anglesList.length);
  };

  const prevImage = () => {
    setAngleIndex((prev) => (prev - 1 + anglesList.length) % anglesList.length);
  };

  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 2);

  return (
    <div ref={detailRef} className="w-full h-full overflow-y-auto bg-[#050505] relative custom-scrollbar scroll-smooth">
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "image": product.image || "/logo.png",
          "description": product.description || product.name,
          "sku": `KD-${product.id}`,
          "mpn": `KD-${product.id}`,
          "brand": {
            "@type": "Brand",
            "name": "Kirthi Diamonds"
          },
          "offers": {
            "@type": "Offer",
            "url": `https://kirthidiamonds.com/shop?product=${product.id}`,
            "priceCurrency": "INR",
            "price": product.price,
            "priceValidUntil": "2027-12-31",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
          },
          
        })}} 
      />
      <AnimatePresence>
        {showSizeChart && <SizingChartModal onClose={() => setShowSizeChart(false)} type={isRing ? 'Ring' : 'Bangle'} />}
        {lightboxOpen && (
          <LightboxModal 
            images={anglesList} 
            initialIndex={angleIndex} 
            onClose={() => setLightboxOpen(false)} 
          />
        )}
      </AnimatePresence>

      <div className="w-full pb-24 md:pb-32">
        {/* Hero Section */}
        <section className="min-h-screen md:min-h-0 md:h-screen flex flex-col md:flex-row border-b border-white/5">
          {/* Visual Showcase */}
          <div className="w-full md:w-7/12 h-[70vh] md:h-full relative flex items-center justify-center overflow-hidden bg-[#080808] border-r border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.04),transparent)]" />
            
            <div className="relative w-full h-full flex items-center justify-center p-8 md:p-32">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div 
                  key={angleIndex}
                  initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full flex items-center justify-center cursor-zoom-in"
                  onClick={() => setLightboxOpen(true)}
                >
                  <FastImage 
                    src={anglesList[angleIndex] || undefined} 
                    alt={product.name} 
                    className="max-h-full object-contain filter drop-shadow-[0_0_120px_rgba(255,255,255,0.1)] select-none transition-transform hover:scale-105 duration-700"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-8 md:px-28 pointer-events-none z-30">
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="w-14 h-14 rounded-full border border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-center pointer-events-auto hover:bg-[#D4AF37] hover:text-black transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="w-14 h-14 rounded-full border border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-center pointer-events-auto hover:bg-[#D4AF37] hover:text-black transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Angle selector */}
              {anglesList.length > 1 && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-4 md:space-x-6 z-40">
                   {anglesList.map((img, idx) => (
                     <button 
                      key={idx}
                      onClick={() => setAngleIndex(idx)}
                      className={`w-12 h-12 border transition-all duration-700 overflow-hidden bg-[#0A0A0A] ${idx === angleIndex ? 'border-[#D4AF37]' : 'border-white/10 opacity-40 hover:opacity-100'}`}
                     >
                       <FastImage src={img || undefined} className="w-full h-full object-cover p-1" />
                     </button>
                   ))}
                </div>
              )}
            </div>
          </div>

          {/* Core Info */}
          <div className="w-full md:w-5/12 bg-black overflow-y-auto custom-scrollbar px-6 pt-[120px] pb-48 md:px-24 md:pt-[180px] md:pb-32">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="space-y-12 md:space-y-16 h-max pb-32 md:pb-0"
            >
              <button 
                onClick={onBack}
                className="flex items-center space-x-3 text-xs md:text-[10px] uppercase tracking-widest text-[#D4AF37] hover:text-white transition-all w-max px-6 py-3 border border-white/10 hover:bg-white/5 mb-8"
              >
                <span>←</span>
                <span>Return to Boutique</span>
              </button>

              <div className="space-y-8">
                <div className="flex items-center space-x-6">
                   <span className="text-xs md:text-[10px] uppercase tracking-[0.6em] text-[#D4AF37]">Reference Anthology</span>
                   <div className="flex-1 h-px bg-white/10"></div>
                </div>
                <h2 className="text-4xl md:text-6xl lg:text-[80px] font-serif italic leading-[0.9]">{product.name}</h2>
                <div className="flex items-baseline space-x-8">
                  <p className="text-3xl md:text-4xl lg:text-5xl font-light tracking-widest text-[#D4AF37]">₹{product.price.toLocaleString('en-IN')}</p>
                  <span className="text-xs md:text-[10px] uppercase tracking-widest opacity-20">Private VAT Included</span>
                </div>
              </div>

              <div className="space-y-8 border-t border-white/5 pt-12">
                 <p className="text-xl md:text-2xl font-light leading-relaxed opacity-60 italic">
                   {product.longDescription}
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8 border-t border-white/5 pt-12">
                {getCombinedSpecs(product).map((detail, idx) => {
                  let label = `Spec ${idx + 1}`;
                  let value = detail;
                  
                  if (detail.includes(':')) {
                    const parts = detail.split(':');
                    label = parts[0].trim();
                    value = parts.slice(1).join(':').trim();
                  } else {
                    const lastSpaceIdx = detail.lastIndexOf(' ');
                    if (lastSpaceIdx > 0) {
                      label = detail.substring(0, lastSpaceIdx).trim();
                      value = detail.substring(lastSpaceIdx + 1).trim();
                    }
                  }
                  
                  const getTooltip = (l: string) => {
                    const lower = l.toLowerCase();
                    if (lower.includes('clarity')) return "A measure of internal defects (inclusions) and blemishes. Kirthi diamonds are typically IF-VVS.";
                    if (lower.includes('color')) return "Grades from D (colorless) to Z (light). We strictly use exceptional D-F grades.";
                    if (lower.includes('cut')) return "Cut determines how a diamond interacts with light: its brightness, fire, and scintillation.";
                    if (lower.includes('carat')) return "The standard unit of weight for diamonds and other gemstones.";
                    if (lower.includes('diamond weight')) return "The total weight of the diamonds in the piece, not the total weight of the jewellery.";
                    if (lower.includes('metal weight')) return "The total weight of the jewellery piece.";
                    if (lower.includes('weight') && !lower.includes('diamond') && !lower.includes('metal')) return "The total weight of the jewellery piece.";
                    if (lower.includes('metal')) return "The precious metal used for the setting, such as 18K gold or platinum.";
                    if (lower.includes('setting')) return "The style in which the gemstones are mounted (e.g., prong, bezel, pavé).";
                    return null;
                  };
                  const tooltip = getTooltip(label);

                  return (
                    <div key={idx} className="space-y-2 relative group">
                      <div className="flex items-center gap-4 md:gap-2 relative">
                        <span className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-30 italic block">{label}</span>
                        {tooltip && <Info size={11} className="opacity-40 hover:opacity-100 cursor-help transition-opacity" />}
                        {tooltip && (
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-3 bg-black border border-white/10 text-xs md:text-[10px] normal-case tracking-normal italic leading-relaxed text-white/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                            {tooltip}
                          </div>
                        )}
                      </div>
                      <span className="text-sm tracking-[0.1em] font-light text-white/80 block">{value}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-12 space-y-6">
                <div className="space-y-6 md:space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs md:text-[10px] uppercase tracking-widest opacity-40">Metal Choice</label>
                    <select 
                      value={selectedMetal}
                      onChange={(e) => setSelectedMetal(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 p-4 text-sm text-white/80 outline-none focus:border-[#D4AF37]"
                    >
                      {productMetals.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  {needsSize && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <label className="text-xs md:text-[10px] uppercase tracking-widest opacity-40">Select Size</label>
                        <button onClick={() => setShowSizeChart(true)} className="text-xs md:text-[10px] uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors underline offset-4">Size Chart</button>
                      </div>
                      <select 
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 p-4 text-sm text-white/80 outline-none focus:border-[#D4AF37]"
                      >
                        {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-widest opacity-40">Quantity</label>
                  <div className="flex items-center border border-white/10 w-max">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-6 py-4 md:px-4 md:py-3 hover:bg-white/5 transition-colors text-white/50 hover:text-white"
                    >-</button>
                    <span className="w-12 text-center text-sm font-light">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-6 py-4 md:px-4 md:py-3 hover:bg-white/5 transition-colors text-white/50 hover:text-white"
                    >+</button>
                  </div>
                </div>

                <button 
                  onClick={handleAcquire}
                  disabled={acquireState !== 'idle'}
                  className={`w-full py-5 border border-[#D4AF37] ${acquireState === 'success' ? 'bg-white text-black' : 'bg-[#D4AF37] text-black'} text-sm md:text-[11px] md:text-[13px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-medium hover:bg-transparent hover:text-[#D4AF37] transition-all duration-500 shadow-[0_20px_60px_rgba(212,175,55,0.1)] group flex justify-center items-center gap-4 md:gap-3 disabled:opacity-80 disabled:cursor-not-allowed`}
                >
                  {acquireState === 'acquiring' ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : acquireState === 'success' ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <ShoppingBag size={16} className="group-hover:scale-110 transition-transform duration-500" />
                  )}
                  <span>{acquireState === 'acquiring' ? 'Processing...' : acquireState === 'success' ? 'Added to Cart' : 'Acquire Masterpiece'}</span>
                </button>
                <div className="flex justify-center pt-2">
                  <button 
                    onClick={(e) => toggleWishlist(product.id, e)}
                    className={`flex items-center space-x-3 text-xs md:text-[10px] uppercase tracking-[0.3em] transition-all ${wishlist.includes(product.id) ? 'text-[#D4AF37]' : 'opacity-40 hover:opacity-100 hover:text-white'}`}
                  >
                    <Heart size={14} className={wishlist.includes(product.id) ? 'fill-current' : ''} />
                    <span>{wishlist.includes(product.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Certification Badges */}
        <section className="py-3 md:py-12 border-b border-white/5 bg-[#080808]">
           <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-12 md:gap-4 md:gap-24 px-4 sm:px-6">
             <a href="https://www.gia.edu/report-check-landing" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center space-y-6 md:space-y-4 group cursor-pointer">
               <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/30 transition-all">
                 <FileCheck size={28} className="text-white/60 group-hover:text-[#D4AF37] transition-colors" />
               </div>
               <div className="text-center">
                 <span className="block text-xs md:text-[10px] uppercase tracking-widest text-white/80 font-medium mb-1">GIA Certified</span>
                 <span className="block text-[8px] uppercase tracking-widest opacity-40 group-hover:underline underline-offset-4 pointer-events-auto">Verify Report Online</span>
               </div>
             </a>
             
             <a href="https://www.igi.org/verify-your-report/en" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center space-y-6 md:space-y-4 group cursor-pointer">
               <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/30 transition-all">
                 <FileCheck size={28} className="text-white/60 group-hover:text-[#D4AF37] transition-colors" />
               </div>
               <div className="text-center">
                 <span className="block text-xs md:text-[10px] uppercase tracking-widest text-white/80 font-medium mb-1">IGI Certified</span>
                 <span className="block text-[8px] uppercase tracking-widest opacity-40 group-hover:underline underline-offset-4 pointer-events-auto">Verify Report Online</span>
               </div>
             </a>

             <a href="https://www.bis.gov.in/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center space-y-6 md:space-y-4 group cursor-pointer">
               <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/30 transition-all">
                 <ShieldCheck size={28} className="text-white/60 group-hover:text-[#D4AF37] transition-colors" />
               </div>
               <div className="text-center">
                 <span className="block text-xs md:text-[10px] uppercase tracking-widest text-white/80 font-medium mb-1">BIS Hallmark</span>
                 <span className="block text-[8px] uppercase tracking-widest opacity-40 group-hover:underline underline-offset-4 pointer-events-auto">18K / 22K Purity Verified</span>
               </div>
             </a>
           </div>
        </section>

        {/* Deep Dive Section */}
        <section className="py-32 md:py-64 px-4 sm:px-6 md:px-24 lg:px-48 border-b border-white/5">
           <div className="max-w-4xl mx-auto space-y-32">
              <div className="space-y-12 text-center">
                 <h4 className="text-sm md:text-[11px] uppercase tracking-[0.8em] text-[#D4AF37]">Artisanal Integrity</h4>
                 <h2 className="text-4xl md:text-7xl font-serif italic leading-tight">Crafted for the<br />perpetual legacy</h2>
                 <p className="text-lg md:text-2xl font-light italic opacity-50 leading-relaxed">
                    Like every creation from Kirthi Diamond Jewellery, this piece is meticulously designed and expertly crafted with the finest detail—all to ensure it brings a smile to your face.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-24 items-center">
                 <div className="aspect-[4/5] bg-white/[0.02] border border-white/5 p-8 flex items-center justify-center">
                    <motion.div
                        initial={{ filter: "grayscale(100%)" }}
                        whileInView={{ filter: "grayscale(0%)" }}
                        viewport={{ amount: 0.5, once: false }}
                        transition={{ duration: 1.5 }}
                        className="w-full h-full flex items-center justify-center"
                    >
                      <FastImage 
                          src={anglesList[2] || anglesList[0] || undefined}
                          className="w-full h-full object-contain"
                          alt="Craft Detail"
                      />
                    </motion.div>
                 </div>
                 <div className="space-y-12">
                    <div className="space-y-6">
                       <h3 className="text-3xl font-serif italic">Structural Anthology</h3>
                       <p className="text-sm font-light opacity-50 leading-relaxed">
                          Set in 18K gold, this piece is cold-worked to ensure exceptional structural integrity without compromising its elegant silhouette—a signature hallmark of the Kirthi production process.
                       </p>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                       {getCombinedSpecs(product).map((detail, i) => {
                         let label = `Spec 0${i + 1}`;
                         let value = detail;
                         
                         if (detail.includes(':')) {
                           const parts = detail.split(':');
                           label = parts[0].trim();
                           value = parts.slice(1).join(':').trim();
                         } else {
                           const lastSpaceIdx = detail.lastIndexOf(' ');
                           if (lastSpaceIdx > 0) {
                             label = detail.substring(0, lastSpaceIdx).trim();
                             value = detail.substring(lastSpaceIdx + 1).trim();
                           }
                         }
                         
                         const getTooltip = (l: string) => {
                            const lower = l.toLowerCase();
                            if (lower.includes('clarity')) return "A measure of internal defects (inclusions) and blemishes. Kirthi diamonds are typically IF-VVS.";
                            if (lower.includes('color')) return "Grades from D (colorless) to Z (light). We strictly use exceptional D-F grades.";
                            if (lower.includes('cut')) return "Cut determines how a diamond interacts with light: its brightness, fire, and scintillation.";
                            if (lower.includes('carat')) return "The standard unit of weight for diamonds and other gemstones.";
                            if (lower.includes('diamond weight')) return "The total weight of the diamonds in the piece, not the total weight of the jewellery.";
                            if (lower.includes('metal weight')) return "The total weight of the jewellery piece.";
                            if (lower.includes('weight') && !lower.includes('diamond') && !lower.includes('metal')) return "The total weight of the jewellery piece.";
                            if (lower.includes('metal')) return "The precious metal used for the setting, such as 18K gold or platinum.";
                            if (lower.includes('setting')) return "The style in which the gemstones are mounted (e.g., prong, bezel, pavé).";
                            return null;
                         };
                         const tooltip = getTooltip(label);

                         return (
                           <li key={i} className="flex flex-col space-y-2 border-b border-white/5 pb-4 relative group">
                             <div className="flex items-center gap-4 md:gap-2">
                               <span className="text-xs md:text-[10px] uppercase tracking-[0.4em] opacity-30 shrink-0">{label}</span>
                               {tooltip && <Info size={11} className="opacity-40 hover:opacity-100 cursor-help transition-opacity" />}
                             </div>
                             {tooltip && (
                               <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-3 bg-black border border-white/10 text-xs md:text-[10px] normal-case tracking-normal italic leading-relaxed text-white/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                                 {tooltip}
                               </div>
                             )}
                             <span className="text-sm font-light italic text-white/90">{value}</span>
                           </li>
                         );
                       })}
                    </ul>
                 </div>
              </div>
           </div>
        </section>

        {/* Share Section to encourage Backlinks */}
        <section className="py-16 md:py-24 px-4 sm:px-6 md:px-24 lg:px-48 border-b border-white/5 bg-[#0A0A0A]">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h3 className="text-xl font-serif italic text-white mb-6 text-center">Share This Masterpiece</h3>
            <div className="flex justify-center space-x-6 flex-wrap gap-y-4">
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.name} at Kirthi Diamonds`)}&url=${encodeURIComponent(`https://kirthidiamonds.com/shop`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] opacity-70 hover:opacity-100 transition-opacity flex items-center space-x-2"
              >
                <span>X (Twitter)</span>
              </a>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://kirthidiamonds.com/shop`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] opacity-70 hover:opacity-100 transition-opacity flex items-center space-x-2"
              >
                <span>LinkedIn</span>
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://kirthidiamonds.com/shop`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] opacity-70 hover:opacity-100 transition-opacity flex items-center space-x-2"
              >
                <span>Facebook</span>
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(`https://kirthidiamonds.com/shop`);
                  alert('Link copied to clipboard');
                }}
                className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] opacity-70 hover:opacity-100 transition-opacity flex items-center space-x-2 cursor-pointer"
              >
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </section>

        {/* Policies Accordion */}
        <section className="py-3 md:py-16 md:py-24 px-4 sm:px-6 md:px-24 lg:px-48 border-b border-white/5 bg-[#0A0A0A]">
           <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="text-xs md:text-[10px] uppercase tracking-[0.4em] opacity-40 mb-8 border-b border-white/10 pb-4">Essential Information</h3>
              
              <details className="group border border-white/10 bg-black/40 p-6 cursor-pointer open:bg-black/60 transition-colors">
                <summary className="flex justify-between items-center outline-none list-none uppercase tracking-[0.3em] text-sm md:text-[11px] text-white/80 hover:text-[#D4AF37] transition-colors [&::-webkit-details-marker]:hidden">
                  <span>Shipping & Delivery</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="16"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-white/60 text-xs md:text-sm font-light mt-6 leading-relaxed space-y-6 md:space-y-4 italic">
                  <p>Every Kirthi masterpiece is meticulously made-to-order, ensuring unprecedented quality and minimal ecological impact.</p>
                  <p>Please expect a creation period of <strong className="text-white">7 to 14 business days</strong> prior to dispatch. All domestic shipments are fully insured and handled exclusively via <strong className="text-[#D4AF37]">Sequel Logistics</strong>.</p>
                </div>
              </details>

              <details className="group border border-white/10 bg-black/40 p-6 cursor-pointer open:bg-black/60 transition-colors">
                <summary className="flex justify-between items-center outline-none list-none uppercase tracking-[0.3em] text-sm md:text-[11px] text-white/80 hover:text-[#D4AF37] transition-colors [&::-webkit-details-marker]:hidden">
                  <span>Exchanges & Returns</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="16"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-white/60 text-xs md:text-sm font-light mt-6 leading-relaxed space-y-6 md:space-y-4 italic">
                  <p>We maintain a strict quality control protocol. Should you require an exchange, we must be notified within 48 hours of delivery.</p>
                  <p>Returns for bespoke or custom-engraved pieces are strictly inaccessible. The piece must remain in its original, unworn condition with the authentic certification seal intact.</p>
                </div>
              </details>

              <details className="group border border-white/10 bg-black/40 p-6 cursor-pointer open:bg-black/60 transition-colors">
                <summary className="flex justify-between items-center outline-none list-none uppercase tracking-[0.3em] text-sm md:text-[11px] text-white/80 hover:text-[#D4AF37] transition-colors [&::-webkit-details-marker]:hidden">
                  <span>Diamond Specialist Support</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="16"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-white/60 text-xs md:text-sm font-light mt-6 leading-relaxed space-y-6 md:space-y-4 italic">
                  <p>Our private jewellers are available for immediate consultation regarding dimensions, pairing recommendations, or bespoke inquiries.</p>
                  <p>Contact our Kochi Boutique at <a href="tel:+919847086990" className="text-[#D4AF37] hover:underline underline-offset-4 pointer-events-auto cursor-pointer">+91 98470 86990</a> or our Calicut Boutique at <a href="tel:+919847086002" className="text-[#D4AF37] hover:underline underline-offset-4 pointer-events-auto cursor-pointer">+91 98470 86002</a>.</p>
                </div>
              </details>

              <details className="group border border-white/10 bg-black/40 p-6 cursor-pointer open:bg-black/60 transition-colors">
                <summary className="flex justify-between items-center outline-none list-none uppercase tracking-[0.3em] text-sm md:text-[11px] text-white/80 hover:text-[#D4AF37] transition-colors [&::-webkit-details-marker]:hidden">
                  <span>Lifetime Buyback & Exchange</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="16"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-white/60 text-xs md:text-sm font-light mt-6 leading-relaxed space-y-6 md:space-y-4 italic">
                  <p>We honor the value of your Kirthi piece indefinitely. Enjoy a {diamondExchangePercentage}% exchange on diamond value for upgrades and {diamondBuybackPercentage}% on cash buybacks. For Polki, we offer {polkiExchangePercentage}% exchange and {polkiBuybackPercentage}% cash buyback. For Colourstones, we offer {colourstoneExchangePercentage}% exchange and {colourstoneBuybackPercentage}% cash buyback, subject to contemporary valuation standards.</p>
                  <p>Gold is evaluated strictly by net weight at prevailing market rates minus nominal refining deductions.</p>
                </div>
              </details>

              <details className="group border border-white/10 bg-black/40 p-6 cursor-pointer open:bg-black/60 transition-colors">
                <summary className="flex justify-between items-center outline-none list-none uppercase tracking-[0.3em] text-sm md:text-[11px] text-white/80 hover:text-[#D4AF37] transition-colors [&::-webkit-details-marker]:hidden">
                  <span>Transparent Pricing & Making Charges</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="16"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-white/60 text-xs md:text-sm font-light mt-6 leading-relaxed space-y-6 md:space-y-4 italic">
                  <p>We pride ourselves on 100% price transparency. Making charges vary from 8% to 25% based on the intricate artisanship and technical complexity required.</p>
                  <p>A detailed invoice segregating gold value, diamond worth, and crafting charges will accompany every acquisition.</p>
                </div>
              </details>

              <details className="group border border-white/10 bg-black/40 p-6 cursor-pointer open:bg-black/60 transition-colors">
                <summary className="flex justify-between items-center outline-none list-none uppercase tracking-[0.3em] text-sm md:text-[11px] text-white/80 hover:text-[#D4AF37] transition-colors [&::-webkit-details-marker]:hidden">
                  <span>Flexible EMI Privileges</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="16"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-white/60 text-xs md:text-sm font-light mt-6 leading-relaxed space-y-6 md:space-y-4 italic">
                  <p>Selected acquisitions qualify for tailored, zero-interest EMI financing spanning 3 to 12 months through our affiliated financial partners.</p>
                  <p>Reach out to the Diamond Specialist to configure an individualized payment plan structured entirely for your convenience.</p>
                </div>
              </details>
           </div>
        </section>

        {/* Related Acquisitions */}
        <section className="py-32 md:py-64 px-4 sm:px-6 md:px-24 lg:px-48 bg-[#080808]">
           <div className="flex justify-between items-end mb-24">
              <div className="space-y-6 md:space-y-4">
                 <span className="text-xs md:text-[10px] uppercase tracking-[0.6em] text-[#D4AF37]">Curated Pairings</span>
                 <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif italic">Exhibition Anthology</h2>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-24">
              {relatedProducts.map((p, idx) => (
                <div 
                  key={`${p.id}-${idx}`}
                  onClick={() => onProductSelect(p)}
                  className="group cursor-pointer space-y-10"
                >
                   <div className="aspect-[16/9] bg-white/[0.01] border border-white/5 flex items-center justify-center overflow-hidden p-12">
                      <FastImage src={p.image || (p.angles && p.angles.length > 0 ? p.angles[0] : undefined)} className="w-3/5 h-3/5 object-contain group-hover:scale-110 transition-transform duration-1000" />
                   </div>
                   <div className="flex justify-between items-start">
                      <div className="space-y-2">
                         <h4 className="text-sm md:text-[12px] uppercase tracking-[0.3em] font-light">{p.name}</h4>
                         <span className="text-xs md:text-[10px] uppercase tracking-widest opacity-30 italic">{p.category}</span>
                      </div>
                      <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Footer Boutique CTA */}
        <section className="py-32 md:py-48 flex flex-col items-center text-center space-y-12 w-full max-w-2xl mx-auto px-6">
           <div className="w-16 h-px bg-[#D4AF37]"></div>
           <div className="space-y-6 md:space-y-4">
              <h3 className="text-3xl font-serif italic">Bespoke Inquiry</h3>
              <p className="max-w-md mx-auto text-xs md:text-[10px] uppercase tracking-[0.4em] opacity-30 leading-relaxed">
                 Should you require a customized configuration of this anthology piece, our digital Diamond Specialist is available for private consultation.
              </p>
           </div>
           
           {!isBespokeMode ? (
             <button 
              onClick={() => setIsBespokeMode(true)}
              className="px-8 md:px-16 py-6 border border-white/10 text-xs md:text-[10px] uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all text-center w-full md:w-auto"
             >
               Configure Bespoke
             </button>
           ) : (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="w-full space-y-8 bg-white/[0.02] p-8 border border-white/10 text-left"
             >
                <div className="space-y-6 md:space-y-4">
                  <label className="text-xs md:text-[10px] uppercase tracking-widest opacity-50 block">Reference Image (Optional)</label>
                  <div className="flex items-center space-x-4 md:space-x-6">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 border border-dashed border-white/20 flex flex-col items-center justify-center space-y-2 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all group cursor-pointer"
                    >
                      {bespokeImage ? (
                        <div className="relative w-full h-full p-2">
                          <img loading="lazy" src={bespokeImage} width={96} height={96} alt="Reference" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <>
                          <Upload size={16} className="opacity-50 group-hover:opacity-100" />
                          <span className="text-[8px] uppercase tracking-widest opacity-50 shadow-none">Upload</span>
                        </>
                      )}
                    </button>
                    {bespokeImage && (
                      <button 
                        onClick={() => setBespokeImage(null)}
                        className="text-xs md:text-[10px] uppercase tracking-widest text-red-400 opacity-80 hover:opacity-100"
                      >
                        Remove
                      </button>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleImageUpload} 
                    />
                  </div>
                </div>

                <div className="space-y-6 md:space-y-4">
                  <label className="text-xs md:text-[10px] uppercase tracking-widest opacity-50 block">Customization Instructions</label>
                  <textarea 
                    value={bespokeInstructions}
                    onChange={(e) => setBespokeInstructions(e.target.value)}
                    placeholder="E.g., I would like the center stone to be a sapphire, and the band to feature micro-pave detailing..."
                    className="w-full h-32 bg-transparent border border-white/20 p-4 text-sm font-light text-white outline-none focus:border-[#D4AF37] resize-none transition-colors"
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-4">
                  <button 
                    onClick={() => {
                      onAddToCart(product, selectedMetal, selectedSize, bespokeInstructions, bespokeImage || undefined);
                      setIsBespokeMode(false);
                      setBespokeInstructions('');
                      setBespokeImage(null);
                    }}
                    disabled={!bespokeInstructions.trim() && !bespokeImage}
                    className="flex-1 py-4 bg-[#D4AF37] text-black text-xs md:text-[10px] uppercase tracking-[0.4em] font-medium disabled:opacity-50 hover:bg-white transition-all disabled:hover:bg-[#D4AF37]"
                  >
                    Add Bespoke Request
                  </button>
                  <button 
                    onClick={() => setIsBespokeMode(false)}
                    className="flex-1 py-4 border border-white/20 text-white text-xs md:text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
             </motion.div>
           )}
        </section>
      </div>

      {/* Persistent Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-[#050505]/95 backdrop-blur-xl border-t border-white/5 py-4 px-6 md:px-24 flex items-center justify-between z-[60] shadow-[0_-20px_40px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col space-y-2">
          <span className="text-xs md:text-[10px] md:text-sm md:text-[12px] uppercase tracking-[0.4em] text-white/50 truncate max-w-[150px] md:max-w-none">{product.name}</span>
          <span className="text-sm md:text-xl font-light tracking-widest text-[#D4AF37]">₹{product.price.toLocaleString('en-IN')}</span>
        </div>
        <button 
           onClick={handleAcquire}
           disabled={acquireState !== 'idle'}
           className={`px-6 md:px-12 py-4 border border-[#D4AF37] ${acquireState === 'success' ? 'bg-white text-black' : 'bg-[#D4AF37] text-black'} text-xs md:text-[10px] md:text-sm md:text-[11px] uppercase tracking-[0.3em] font-medium hover:bg-transparent hover:text-[#D4AF37] transition-all flex items-center gap-4 md:gap-3 group disabled:opacity-80 disabled:cursor-not-allowed`}
        >
          {acquireState === 'acquiring' ? (
            <Loader2 size={14} className="animate-spin hidden md:block" />
          ) : acquireState === 'success' ? (
            <CheckCircle size={14} className="text-green-600 hidden md:block" />
          ) : (
            <ShoppingBag size={14} className="group-hover:scale-110 transition-transform hidden md:block" />
          )}
          <span>{acquireState === 'acquiring' ? 'Processing...' : acquireState === 'success' ? 'Added' : 'Acquire Masterpiece'}</span>
        </button>
      </div>
    </div>
  );
}

// --- Cart Component ---
function CartView({ 
  items, 
  onClose, 
  onRemove, 
  onUpdateQuantity,
  onCheckout,
  isCheckoutLoading
}: { 
  items: CartItem[], 
  onClose: () => void, 
  onRemove: (id: string) => void,
  onUpdateQuantity: (id: string, newQuantity: number) => void,
  onCheckout: (details: ShippingDetails) => void,
  isCheckoutLoading?: boolean,
  key?: React.Key
}) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [step, setStep] = useState<'cart' | 'shipping'>('cart');
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [shippingErrors, setShippingErrors] = useState<Partial<ShippingDetails>>({});
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const handleRemoveWithConfirmation = (id: string) => {
    setRemovingIds(prev => new Set(prev).add(id));
    setTimeout(() => {
      onRemove(id);
      setRemovingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 600);
  };

  const isShippingValid = () => {
    const errors: Partial<ShippingDetails> = {};
    if (!shippingDetails.name.trim()) errors.name = 'Name is required';
    if (!shippingDetails.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingDetails.email)) errors.email = 'Invalid email structure';
    if (!shippingDetails.phone.trim()) errors.phone = 'Phone number is required';
    if (!shippingDetails.address.trim()) errors.address = 'Full delivery address is required';
    
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceed = () => {
    if (step === 'cart') {
      setStep('shipping');
    } else {
      if (isShippingValid()) {
        onCheckout(shippingDetails);
      }
    }
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: "spring", stiffness: 300, damping: 35 }}
      className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-[#0A0A0A] z-[150] shadow-[-100px_0_100px_rgba(0,0,0,0.8)] border-l border-white/5 p-6 md:p-16 flex flex-col"
    >
      <div className="flex justify-between items-start mb-12 mt-16 md:mt-0">
        <div className="space-y-6 md:space-y-4">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-px bg-[#D4AF37]/40"></div>
             <span className="text-xs md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]">{step === 'cart' ? 'Personal Vault' : 'Acquisition Details'}</span>
          </div>
          <h3 className="text-2xl md:text-4xl lg:text-5xl font-serif italic">{step === 'cart' ? 'Your Selection' : 'Shipping'}</h3>
        </div>
        <button onClick={onClose} className="p-4 -mt-2 -mr-2 opacity-30 hover:opacity-100 transition-all">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-12 pr-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.length === 0 ? (
            <motion.div 
              key="empty-cart"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="h-full flex flex-col justify-center items-center text-center space-y-8 min-h-[300px]"
            >
              <div className="relative w-32 h-32 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.01]">
                <div className="absolute inset-0 border border-[#D4AF37]/10 rounded-full animate-pulse" />
                <ShoppingBag size={40} className="text-[#D4AF37]/40" strokeWidth={1} />
              </div>
              <div className="space-y-6 md:space-y-4">
                 <h4 className="text-xl font-serif italic text-white/80">Your Vault is Empty</h4>
                 <p className="text-xs md:text-[10px] uppercase tracking-[0.4em] opacity-40 italic max-w-[200px] leading-relaxed mx-auto">
                   Discover our latest masterpieces to begin your collection.
                 </p>
              </div>
              <button 
                onClick={onClose}
                className="group relative flex items-center space-x-4 md:space-x-6 text-xs md:text-[10px] uppercase tracking-[0.4em] py-4 px-4 sm:px-6 border border-white/10 hover:border-[#D4AF37]/50 transition-all overflow-hidden mt-4"
              >
                 <div className="absolute inset-0 bg-[#D4AF37]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                 <span className="relative z-10 font-medium">Return to Boutique</span>
              </button>
            </motion.div>
          ) : step === 'shipping' ? (
            <motion.div 
              key="shipping-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-6 md:space-y-4">
                <div className="flex justify-between items-center text-xs md:text-[10px] uppercase tracking-widest opacity-50">
                  <label className="flex items-center gap-4 md:gap-2"><User size={12}/> Full Name</label>
                  {shippingErrors.name && <span className="text-red-400 normal-case tracking-normal">{shippingErrors.name}</span>}
                </div>
                <input 
                  type="text" 
                  value={shippingDetails.name}
                  onChange={(e) => setShippingDetails({...shippingDetails, name: e.target.value})}
                  className={`w-full bg-white/[0.02] border p-4 font-light text-white outline-none transition-colors ${shippingErrors.name ? 'border-red-500' : 'border-white/10 focus:border-[#D4AF37]'}`}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-6 md:space-y-4">
                <div className="flex justify-between items-center text-xs md:text-[10px] uppercase tracking-widest opacity-50">
                  <label className="flex items-center gap-4 md:gap-2"><Mail size={12}/> Email Address</label>
                  {shippingErrors.email && <span className="text-red-400 normal-case tracking-normal">{shippingErrors.email}</span>}
                </div>
                <input 
                  type="email" 
                  value={shippingDetails.email}
                  onChange={(e) => setShippingDetails({...shippingDetails, email: e.target.value})}
                  className={`w-full bg-white/[0.02] border p-4 font-light text-white outline-none transition-colors ${shippingErrors.email ? 'border-red-500' : 'border-white/10 focus:border-[#D4AF37]'}`}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-6 md:space-y-4">
                <div className="flex justify-between items-center text-xs md:text-[10px] uppercase tracking-widest opacity-50">
                  <label className="flex items-center gap-4 md:gap-2"><Phone size={12}/> Phone Number</label>
                  {shippingErrors.phone && <span className="text-red-400 normal-case tracking-normal">{shippingErrors.phone}</span>}
                </div>
                <input 
                  type="tel" 
                  value={shippingDetails.phone}
                  onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})}
                  className={`w-full bg-white/[0.02] border p-4 font-light text-white outline-none transition-colors ${shippingErrors.phone ? 'border-red-500' : 'border-white/10 focus:border-[#D4AF37]'}`}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="space-y-6 md:space-y-4">
                <div className="flex justify-between items-center text-xs md:text-[10px] uppercase tracking-widest opacity-50">
                  <label className="flex items-center gap-4 md:gap-2"><MapPin size={12}/> Full Delivery Address</label>
                  {shippingErrors.address && <span className="text-red-400 normal-case tracking-normal">{shippingErrors.address}</span>}
                </div>
                <textarea 
                  value={shippingDetails.address}
                  onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                  className={`w-full bg-white/[0.02] border p-4 font-light text-white outline-none transition-colors min-h-[100px] resize-none ${shippingErrors.address ? 'border-red-500' : 'border-white/10 focus:border-[#D4AF37]'}`}
                  placeholder="123 Luxury Avenue, Diamond District..."
                />
              </div>
            </motion.div>
          ) : (
            items.map((item) => {
              const isRemoving = removingIds.has(item.cartItemId);
              return (
              <motion.div 
                key={item.cartItemId}
                layout
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ 
                  opacity: isRemoving ? 0.5 : 1, 
                  x: isRemoving ? 50 : 0, 
                  scale: isRemoving ? 0.9 : 1,
                  backgroundColor: isRemoving ? 'rgba(239,68,68,0.1)' : 'transparent' 
                }}
                exit={{ opacity: 0, x: -50, scale: 0.8 }}
                transition={{ 
                  opacity: { duration: 0.2 },
                  layout: { type: "spring", bounce: 0.4, duration: 0.6 },
                  scale: { type: "spring", bounce: 0.4 }
                }}
                className="flex space-x-8 items-center group relative pb-6 mb-6 border-b border-white/[0.03]"
              >
                <div className="w-24 h-24 bg-white/[0.02] border border-white/5 overflow-hidden flex items-center justify-center p-4 relative">
                  {isRemoving && (
                     <div className="absolute inset-0 bg-red-500/20 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
                        <X className="text-red-400 mb-1" size={24} />
                        <span className="text-[8px] uppercase tracking-widest text-red-400">Removed</span>
                     </div>
                  )}
                  <FastImage src={item.image || (item.angles && item.angles.length > 0 ? item.angles[0] : undefined)} alt={item.name} className={`w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-transform duration-700 ${isRemoving ? 'grayscale opacity-50' : 'group-hover:scale-110'}`} />
                </div>
                <div className={`flex-1 space-y-2 transition-opacity ${isRemoving ? 'opacity-30' : 'opacity-100'}`}>
                  <div className="flex items-center space-x-2">
                     <span className="text-[8px] uppercase tracking-widest opacity-30 italic">{item.category}</span>
                  </div>
                  <h4 className={`text-[14px] tracking-[0.1em] uppercase font-light leading-tight ${isRemoving ? 'line-through' : ''}`}>{item.name}</h4>
                  <p className="text-[#D4AF37] text-sm md:text-[12px] tracking-widest font-light">₹{item.price.toLocaleString('en-IN')}</p>
                  
                  <div className="flex items-center space-x-4 md:space-x-6 mt-2">
                     <div className={`flex items-center border rounded-sm ${isRemoving ? 'border-red-500/30' : 'border-white/10'}`}>
                       <button disabled={isRemoving} onClick={() => onUpdateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))} className="px-4 py-4 md:px-3 md:py-2 text-white/50 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-20"><Minus size={12} /></button>
                       <span className="text-xs md:text-[10px] w-6 text-center">{item.quantity}</span>
                       <button disabled={isRemoving} onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)} className="px-4 py-4 md:px-3 md:py-2 text-white/50 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-20"><Plus size={12} /></button>
                     </div>
                     <button 
                       disabled={isRemoving}
                       onClick={() => handleRemoveWithConfirmation(item.cartItemId)}
                       className={`text-xs md:text-[10px] uppercase tracking-[0.3em] transition-all flex items-center space-x-1 py-3 px-2 -mx-2 ${isRemoving ? 'text-red-500 opacity-100' : 'opacity-30 hover:text-red-400 hover:opacity-100'}`}
                     >
                       <X size={10} />
                       <span>{isRemoving ? 'Removing' : 'Remove'}</span>
                     </button>
                  </div>

                  <div className="flex flex-col space-y-1 mt-2">
                    {item.selectedMetal && <span className="text-xs md:text-[10px] uppercase tracking-widest opacity-40">Metal: {item.selectedMetal}</span>}
                    {item.selectedSize && <span className="text-xs md:text-[10px] uppercase tracking-widest opacity-40">Size: {item.selectedSize}</span>}
                    {item.bespokeInstructions && (
                      <div className="pt-2">
                        <span className="text-xs md:text-[10px] uppercase tracking-widest opacity-40 block mb-1 text-[#D4AF37]">Bespoke Request:</span>
                        <p className="text-xs md:text-[10px] font-light italic opacity-60 leading-relaxed max-w-[200px] line-clamp-3" title={item.bespokeInstructions}>
                          "{item.bespokeInstructions}"
                        </p>
                      </div>
                    )}
                    {item.bespokeImage && (
                       <div className="mt-2 w-12 h-12 border border-white/10 p-1">
                         <img loading="lazy" src={item.bespokeImage} width={48} height={48} className="w-full h-full object-cover" alt="Bespoke Reference" />
                       </div>
                    )}
                  </div>
                </div>
              </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 space-y-8">
        <div className="space-y-6">
           <div className="flex justify-between items-center text-xs md:text-[10px] uppercase tracking-[0.4em]">
              <span className="opacity-30 italic">Subtotal Selection</span>
        <AnimatePresence mode="popLayout">
           <motion.div 
             key={total}
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: 10, position: 'absolute' }}
             className="font-light text-lg"
           >
             ₹{total.toLocaleString('en-IN')}
           </motion.div>
        </AnimatePresence>
           </div>
           <div className="flex justify-between items-center text-[8px] uppercase tracking-[0.2em] opacity-20">
              <span>Security & Insurance</span>
              <span>Complimentary</span>
           </div>
        </div>

        <div className="space-y-6">
          <motion.button 
            disabled={items.length === 0 || isCheckoutLoading || (step === 'shipping' && !isShippingValid)}
            onClick={handleProceed}
            whileHover={{ scale: (items.length === 0 || isCheckoutLoading) ? 1 : 1.02 }}
            whileTap={{ scale: (items.length === 0 || isCheckoutLoading) ? 1 : 0.98 }}
            className="w-full py-6 bg-[#D4AF37] text-black text-sm md:text-[12px] uppercase tracking-[0.5em] font-medium hover:bg-white transition-all disabled:opacity-50 disabled:grayscale shadow-[0_20px_50px_rgba(212,175,55,0.1)] relative group overflow-hidden"
          >
             <span className="relative z-10">
               {isCheckoutLoading ? 'Securely Initializing...' : step === 'cart' ? 'Proceed to Details' : 'Proceed to Payment'}
             </span>
             {!isCheckoutLoading && <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500" />}
          </motion.button>
          
          <div className="flex justify-center items-center space-x-4 md:space-x-6 opacity-20">
             <div className="w-8 h-px bg-white"></div>
             <p className="text-[8px] uppercase tracking-widest italic">Secure Global Portability</p>
             <div className="w-8 h-px bg-white"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Quick View Modal Component ---
function QuickViewModal({ 
  product, 
  onClose, 
  onAddToCart,
  onFullDetails,
  wishlist,
  toggleWishlist
}: { 
  product: Product, 
  onClose: () => void, 
  onAddToCart: (p: Product, metal?: string, size?: string, bespokeInstructions?: string, bespokeImage?: string, quantity?: number) => void,
  onFullDetails: (p: Product) => void,
  wishlist: string[],
  toggleWishlist: (id: string, e?: React.MouseEvent) => void,
  key?: React.Key
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [angleIndex, setAngleIndex] = useState(0);
  
  const anglesList = product.angles || (product.image ? [product.image] : []);

  const nextImage = () => {
    setAngleIndex((prev) => (prev + 1) % anglesList.length);
  };

  const prevImage = () => {
    setAngleIndex((prev) => (prev - 1 + anglesList.length) % anglesList.length);
  };

  const productMetals = product.availableMetals?.length ? product.availableMetals : METAL_OPTIONS;
  const [selectedMetal, setSelectedMetal] = useState(productMetals[0]);
  const isRing = product.category.toLowerCase().includes('ring');
  const isBangle = product.category.toLowerCase().includes('bangle');
  const hasVariants = product.availableSizes && product.availableSizes.length > 0;
  const needsSize = isRing || isBangle || hasVariants;
  const sizeOptions = hasVariants ? product.availableSizes! : isRing ? RING_SIZES : isBangle ? BANGLE_SIZES : [];
  const [selectedSize, setSelectedSize] = useState(sizeOptions.length > 0 ? sizeOptions[0] : undefined);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [acquireState, setAcquireState] = useState<'idle' | 'acquiring' | 'success'>('idle');

  const handleAcquire = async () => {
    if (acquireState !== 'idle') return;
    setAcquireState('acquiring');
    await new Promise(resolve => setTimeout(resolve, 800));
    onAddToCart(product, selectedMetal, selectedSize, undefined, undefined, quantity);
    setAcquireState('success');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center pt-24 p-4 md:p-12 md:pt-12"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      {showSizeChart && <SizingChartModal onClose={() => setShowSizeChart(false)} type={isRing ? 'Ring' : 'Bangle'} />}
      
      {lightboxOpen && (
        <LightboxModal 
          images={anglesList} 
          initialIndex={angleIndex} 
          onClose={() => setLightboxOpen(false)} 
        />
      )}

      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-5xl bg-[#0A0A0A] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row h-auto max-h-[85vh] md:h-[600px] z-[210]"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 text-white/40 hover:text-white transition-all z-[300]"
        >
          <X size={20} />
        </button>

        <div className="w-full h-[40vh] md:h-full md:w-3/5 bg-[#080808] flex flex-col relative border-b md:border-b-0 md:border-r border-white/5 overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent)] pointer-events-none" />
          
          <AnimatePresence mode="wait" initial={false}>
            <motion.div 
              key={angleIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex items-center justify-center cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
            >
              <FastImage 
                src={anglesList.length > 0 ? anglesList[angleIndex] : undefined} 
                alt={product.name} 
                className="w-4/5 h-4/5 object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none transition-transform hover:scale-105 duration-500"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          {anglesList.length > 1 && (
            <>
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none z-30">
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="w-12 h-12 md:w-10 md:h-10 rounded-full border border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-center pointer-events-auto hover:bg-[#D4AF37] hover:text-black transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="w-12 h-12 md:w-10 md:h-10 rounded-full border border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-center pointer-events-auto hover:bg-[#D4AF37] hover:text-black transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Angle selector */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-40">
                 {anglesList.map((img, idx) => (
                   <button 
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setAngleIndex(idx); }}
                    className={`w-12 h-12 md:w-10 md:h-10 border transition-all duration-500 overflow-hidden bg-[#0A0A0A] ${idx === angleIndex ? 'border-[#D4AF37]' : 'border-white/10 opacity-40 hover:opacity-100'}`}
                   >
                     <img loading="lazy" src={img || undefined} width={48} height={48} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                   </button>
                 ))}
              </div>
            </>
          )}
        </div>

        <div className="w-full md:w-2/5 px-6 pt-8 pb-16 md:p-12 overflow-y-auto custom-scrollbar">
          <div className="space-y-8 h-max">
            <div className="space-y-6 md:space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-xs md:text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">{product.category}</span>
              <div className="w-8 h-px bg-[#D4AF37]/30"></div>
            </div>
            <h3 className="text-3xl md:text-4xl font-serif italic">{product.name}</h3>
            <p className="text-xl font-light tracking-widest text-[#D4AF37]">₹{product.price.toLocaleString('en-IN')}</p>
          </div>

          <p className="text-sm font-light leading-relaxed opacity-50 italic line-clamp-3">
            {product.longDescription}
          </p>

          <div className="space-y-6 md:space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs md:text-[10px] uppercase tracking-widest opacity-40">Metal Choice</label>
              <select 
                value={selectedMetal}
                onChange={(e) => setSelectedMetal(e.target.value)}
                className="w-full bg-[#111] border border-white/10 p-3 text-sm text-white/80 outline-none focus:border-[#D4AF37]"
              >
                {productMetals.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            {needsSize && (
               <div className="space-y-2">
                 <div className="flex justify-between items-end">
                   <label className="text-xs md:text-[10px] uppercase tracking-widest opacity-40">Select Size</label>
                   <button onClick={() => setShowSizeChart(true)} className="text-xs md:text-[10px] uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors underline offset-4">Size Chart</button>
                 </div>
                 <select 
                   value={selectedSize}
                   onChange={(e) => setSelectedSize(e.target.value)}
                   className="w-full bg-[#111] border border-white/10 p-3 text-sm text-white/80 outline-none focus:border-[#D4AF37]"
                 >
                   {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
               </div>
            )}
            <div className="space-y-2">
              <label className="text-xs md:text-[10px] uppercase tracking-widest opacity-40">Quantity</label>
              <div className="flex items-center border border-white/10 w-max">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-4 md:px-3 md:py-2 hover:bg-white/5 transition-colors text-white/50 hover:text-white"
                >-</button>
                <span className="w-10 text-center flex-1">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-4 md:px-3 md:py-2 hover:bg-white/5 transition-colors text-white/50 hover:text-white"
                >+</button>
              </div>
            </div>
          </div>

          <div className="space-y-6 md:space-y-4 pt-4">
            <button 
              onClick={handleAcquire}
              disabled={acquireState !== 'idle'}
              className={`w-full py-4 ${acquireState === 'success' ? 'bg-white text-black' : 'bg-[#D4AF37] text-black'} text-sm md:text-[11px] uppercase tracking-[0.4em] font-medium hover:bg-white transition-all shadow-xl disabled:opacity-80 flex justify-center items-center gap-4 md:gap-2`}
            >
              {acquireState === 'acquiring' ? <Loader2 size={14} className="animate-spin" /> : acquireState === 'success' ? <CheckCircle size={14} className="text-green-600" /> : null}
              <span>{acquireState === 'acquiring' ? 'Processing...' : acquireState === 'success' ? 'Added' : 'Acquire Now'}</span>
            </button>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onFullDetails(product)}
                className="w-full py-4 border border-white/10 text-xs md:text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
              >
                Full Anthology
              </button>
              <button 
                onClick={(e) => toggleWishlist(product.id, e)}
                className={`w-full py-4 border text-xs md:text-[10px] uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-4 md:gap-2 ${wishlist.includes(product.id) ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-white/10 hover:bg-white hover:text-black'}`}
              >
                {wishlist.includes(product.id) ? (
                  <>
                    <Heart size={12} className="fill-current" />
                    Wishlisted
                  </>
                ) : (
                  <>
                    <Heart size={12} />
                    Wishlist
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 opacity-20 pt-4 pb-8">
             <div className="w-4 h-px bg-white"></div>
             <span className="text-[8px] uppercase tracking-widest">Certified Masterpiece</span>
             <div className="w-4 h-px bg-white"></div>
          </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SizingChartModal({ onClose, type }: { onClose: () => void, type: 'Ring' | 'Bangle' }) {
  const [method, setMethod] = useState<'diameter' | 'circumference'>('diameter');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] flex items-center justify-center pt-24 p-4 md:p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="bg-[#0A0A0A] border border-[#D4AF37]/30 max-w-2xl w-full p-6 md:p-12 relative shadow-[0_0_50px_rgba(212,175,55,0.1)] custom-scrollbar overflow-y-auto max-h-[85vh]">
        <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 z-[410] text-white/40 hover:text-white transition-colors">
          <X size={20} />
        </button>
        <div className="text-center mb-8">
          <h4 className="text-xs md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] mb-4">Measurement Guide</h4>
          <h3 className="text-3xl font-serif italic mb-6">Indian {type} Sizing</h3>
          
          <div className="inline-flex border border-white/10 rounded-full p-1 bg-[#111]">
            <button 
              onClick={() => setMethod('diameter')}
              className={`px-6 py-3 md:py-2 rounded-full text-xs md:text-[10px] uppercase tracking-widest transition-all ${method === 'diameter' ? 'bg-[#D4AF37] text-black font-medium' : 'text-white/60 hover:text-white'}`}
            >
              Diameter
            </button>
            <button 
              onClick={() => setMethod('circumference')}
              className={`px-6 py-3 md:py-2 rounded-full text-xs md:text-[10px] uppercase tracking-widest transition-all ${method === 'circumference' ? 'bg-[#D4AF37] text-black font-medium' : 'text-white/60 hover:text-white'}`}
            >
              Circumference
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-center mb-10">
          <div className="w-full md:w-1/2 flex flex-col items-center">
            {/* Visual Diagram */}
            <div className="w-48 h-48 border border-white/5 bg-[#111] flex items-center justify-center rounded-full relative mb-6">
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#D4AF37]/40" />
              <div className="absolute inset-6 rounded-full border-4 border-white/10" />
              
              {method === 'diameter' ? (
                <>
                  <div className="absolute top-1/2 left-2 right-2 h-px bg-[#D4AF37] flex items-center justify-center">
                    <span className="bg-[#111] px-2 text-xs md:text-[10px] text-[#D4AF37] uppercase tracking-widest absolute -translate-y-1/2">Inside Diameter</span>
                  </div>
                  <div className="absolute top-1/2 left-2 w-2 h-4 border-l-2 border-[#D4AF37] -translate-y-1/2" />
                  <div className="absolute top-1/2 right-2 w-2 h-4 border-r-2 border-[#D4AF37] -translate-y-1/2" />
                </>
              ) : (
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="47" 
                    fill="none" 
                    stroke="#D4AF37" 
                    strokeWidth="2" 
                    strokeDasharray="4 4"
                    className="opacity-80"
                  />
                  <path
                    d="M 50 3 A 47 47 0 0 1 97 50"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="3"
                  />
                  <text x="75" y="25" fill="#D4AF37" fontSize="8" className="uppercase tracking-widest" transform="rotate(45 75 25)">Circumference</text>
                </svg>
              )}
            </div>
            <p className="text-sm md:text-[11px] font-light leading-relaxed text-white/60 text-center max-w-[250px]">
              {method === 'diameter' ? (
                type === 'Ring' 
                  ? "Place a well-fitting ring over a ruler or tape measure. Measure the inside diameter in millimeters." 
                  : "Measure the inside diameter of a bangle that fits you perfectly. Do not measure the outside edges."
              ) : (
                type === 'Ring'
                  ? "Wrap a piece of string or paper around your finger. Mark where it overlaps and measure the length in millimeters."
                  : "Wrap a string or measuring tape tightly around the widest part of your hand (knuckles) to find your circumference."
              )}
            </p>
          </div>

          <div className="w-full md:w-1/2">
            <h4 className="text-xs md:text-[10px] uppercase tracking-widest text-[#D4AF37] mb-6 border-b border-white/10 pb-4">Standard Dimensions</h4>
            {type === 'Ring' ? (
              <div className="space-y-6 md:space-y-4 text-xs font-light text-white/80">
                <div className="flex justify-between items-center group hover:text-[#D4AF37] transition-colors"><span className="uppercase tracking-widest text-xs md:text-[10px]">Size 6</span><span className="font-serif italic text-sm text-white/50 group-hover:text-[#D4AF37]">{method === 'diameter' ? '14.6 mm' : '45.9 mm'}</span></div>
                <div className="flex justify-between items-center group hover:text-[#D4AF37] transition-colors"><span className="uppercase tracking-widest text-xs md:text-[10px]">Size 8</span><span className="font-serif italic text-sm text-white/50 group-hover:text-[#D4AF37]">{method === 'diameter' ? '15.3 mm' : '48.1 mm'}</span></div>
                <div className="flex justify-between items-center group hover:text-[#D4AF37] transition-colors"><span className="uppercase tracking-widest text-xs md:text-[10px]">Size 10</span><span className="font-serif italic text-sm text-white/50 group-hover:text-[#D4AF37]">{method === 'diameter' ? '15.9 mm' : '49.9 mm'}</span></div>
                <div className="flex justify-between items-center group hover:text-[#D4AF37] transition-colors"><span className="uppercase tracking-widest text-xs md:text-[10px]">Size 12</span><span className="font-serif italic text-sm text-white/50 group-hover:text-[#D4AF37]">{method === 'diameter' ? '16.5 mm' : '51.8 mm'}</span></div>
                <div className="flex justify-between items-center group hover:text-[#D4AF37] transition-colors"><span className="uppercase tracking-widest text-xs md:text-[10px]">Size 14</span><span className="font-serif italic text-sm text-white/50 group-hover:text-[#D4AF37]">{method === 'diameter' ? '17.1 mm' : '53.7 mm'}</span></div>
              </div>
            ) : (
              <div className="space-y-6 md:space-y-4 text-xs font-light text-white/80">
                <div className="flex justify-between items-center group hover:text-[#D4AF37] transition-colors"><span className="uppercase tracking-widest text-xs md:text-[10px]">2-2</span><span className="font-serif italic text-sm text-white/50 group-hover:text-[#D4AF37]">{method === 'diameter' ? '54.0 mm' : '169.6 mm'}</span></div>
                <div className="flex justify-between items-center group hover:text-[#D4AF37] transition-colors"><span className="uppercase tracking-widest text-xs md:text-[10px]">2-4</span><span className="font-serif italic text-sm text-white/50 group-hover:text-[#D4AF37]">{method === 'diameter' ? '57.2 mm' : '179.6 mm'}</span></div>
                <div className="flex justify-between items-center group hover:text-[#D4AF37] transition-colors"><span className="uppercase tracking-widest text-xs md:text-[10px]">2-6</span><span className="font-serif italic text-sm text-white/50 group-hover:text-[#D4AF37]">{method === 'diameter' ? '60.3 mm' : '189.5 mm'}</span></div>
                <div className="flex justify-between items-center group hover:text-[#D4AF37] transition-colors"><span className="uppercase tracking-widest text-xs md:text-[10px]">2-8</span><span className="font-serif italic text-sm text-white/50 group-hover:text-[#D4AF37]">{method === 'diameter' ? '63.5 mm' : '199.5 mm'}</span></div>
                <div className="flex justify-between items-center group hover:text-[#D4AF37] transition-colors"><span className="uppercase tracking-widest text-xs md:text-[10px]">2-10</span><span className="font-serif italic text-sm text-white/50 group-hover:text-[#D4AF37]">{method === 'diameter' ? '66.7 mm' : '209.5 mm'}</span></div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-6 text-center">
           <p className="text-xs md:text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] mb-2 font-medium">Require Assistance?</p>
           <p className="text-xs font-light text-white/60 italic">Our Diamond Specialist is available to guide you through precise measurements. <a href="mailto:Diamond Specialist@kirthi.com" className="text-[#D4AF37] underline underline-offset-4 hover:text-white transition-colors">Contact us</a>.</p>
        </div>
      </div>
    </motion.div>
  );
}

// --- Main Shop Experience ---
export default function ShopExperience({ onInquiry, onGoHome }: { onInquiry?: () => void, onGoHome?: () => void }) {
  const { content } = useContent();
  const { cart, addToCart, removeFromCart, updateCartItemQuantity, clearCart } = useAppStore();
  const [view, setView] = useState<'grid' | 'product' | 'success' | 'status'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const liveProducts = (content.shopProducts && content.shopProducts.length > 0) ? content.shopProducts : PRODUCTS;
  const [isLoading, setIsLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const [liveGoldRates, setLiveGoldRates] = useState<{ "18KT": number, "22KT": number } | null>(null);

  useEffect(() => {
    const fetchGoldRates = async () => {
      try {
        const response = await fetch('/api/gold-rate');
        if (!response.ok) {
           console.warn(`Gold rate API returned ${response.status}`);
           setLiveGoldRates({ "18KT": 5900, "22KT": 7200 });
           return;
        }
        const data = await response.json();
        if (data.success) {
          setLiveGoldRates({ "18KT": data["18KT"], "22KT": data["22KT"] });
        } else {
          setLiveGoldRates({ "18KT": 5900, "22KT": 7200 });
        }
      } catch (err) {
        console.warn("Could not reach gold rates API, using fallbacks.");
        setLiveGoldRates({ "18KT": 5900, "22KT": 7200 });
      }
    };
    fetchGoldRates();
  }, []);

  useEffect(() => {
    const checkParamsForProduct = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const productId = searchParams.get('product');
      if (productId) {
        const product = liveProducts.find((p: any) => p.id === productId);
        if (product) {
          setSelectedProduct(product);
          setView(currentView => (currentView === 'grid' || currentView === 'product') ? 'product' : currentView);
        }
      } else {
        setView(currentView => currentView === 'product' ? 'grid' : currentView);
        setSelectedProduct(null);
      }
    };
    checkParamsForProduct();
    window.addEventListener("popstate", checkParamsForProduct);
    return () => window.removeEventListener("popstate", checkParamsForProduct);
  }, [liveProducts]);

  const toggleWishlist = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const categories = Array.from(new Set(['All', ...liveProducts.map(p => p.category)]));
  let filteredProducts = activeCategory === 'All' ? liveProducts : liveProducts.filter(p => p.category === activeCategory);
  
  if (sortBy === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setQuickViewProduct(null);
    setView('product');
    window.history.pushState({}, '', `/shop?product=${product.id}`);
  };

  const handleAddToCart = (product: Product, metal?: string, size?: string, bespokeInstructions?: string, bespokeImage?: string, quantity: number = 1) => {
    addToCart({ 
      ...product, 
      id: product.id,
      selectedMetal: metal,
      selectedSize: size,
      bespokeInstructions,
      bespokeImage,
      quantity: quantity
    } as any);
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    removeFromCart('', cartItemId);
  };

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutOrderId, setCheckoutOrderId] = useState<string | null>(null);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.crossOrigin = "anonymous";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (shippingDetails: ShippingDetails) => {
    if (cart.length === 0) return;
    
    setIsCheckoutLoading(true);
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert("Payment gateway failed to load. Please check your connection.");
        setIsCheckoutLoading(false);
        return;
      }
      
      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Create order by calling our backend
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, currency: "INR" })
      });
      
      const order = await response.json();
      
      if (!order || order.error) {
        throw new Error(order.error || "Failed to create secure transaction");
      }
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_dummykey", // Fallback for testing environments
        amount: order.amount,
        currency: order.currency,
        name: "Kirthi Diamonds",
        description: "Bespoke Jewellery Acquisition",
        order_id: order.id,
        handler: async function (res: any) {
          // Payment Successful
          try {
            await setDoc(doc(db, "orders", res.razorpay_order_id), {
              orderId: res.razorpay_order_id,
              customerName: shippingDetails.name,
              email: shippingDetails.email,
              phone: shippingDetails.phone,
              address: shippingDetails.address,
              items: cart,
              totalAmount: totalAmount,
              status: 'pending',
              createdAt: Date.now()
            });

           // Send Email via Backend
            await fetch('/api/send-order-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: res.razorpay_order_id,
                paymentId: res.razorpay_payment_id,
                shippingDetails,
                items: cart
              })
            }).then(() => {
              console.log("Emails requested successfully");
            }).catch(e => console.error("Email API failed:", e));

          } catch(e) {
            console.error("Failed to save order to digital vault", e);
          }

          setCheckoutOrderId(res.razorpay_order_id);
          setView('status');
          clearCart();
          setIsCartOpen(false);
          setIsCheckoutLoading(false);
        },
        prefill: {
          name: shippingDetails.name,
          email: shippingDetails.email,
          contact: shippingDetails.phone
        },
        theme: {
          color: "#050505"
        }
      };
      
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (res: any) {
        alert("Transaction failed or was cancelled. Please try again.");
      });
      paymentObject.open();

    } catch (err) {
      console.error(err);
      alert("A secure connection could not be established. Please refer to your Diamond Specialist for assistance.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  useEffect(() => {
    // SEO for Shop
    let sTitle = "High-Jewellery Shop | Kirthi Diamonds";
    let sDesc = "Explore Kirthi Diamonds' curated collection of bespoke diamond jewellery, engagement rings, and high-jewellery pieces.";
    let sUrl = "https://kirthidiamonds.com/shop";
    let sImage = content?.logoUrl || "";

    if (view === 'product' && selectedProduct) {
      sTitle = `${selectedProduct.name} | Kirthi Diamonds`;
      const descRaw = selectedProduct.description || sDesc;
      if (descRaw.length > 155) {
        let trimmed = descRaw.substring(0, 153);
        trimmed = trimmed.substring(0, Math.min(trimmed.length, trimmed.lastIndexOf(" "))) + "...";
        sDesc = trimmed;
      } else {
        sDesc = descRaw;
      }
      sUrl = `https://kirthidiamonds.com/shop`;
      if (selectedProduct.image) {
        sImage = selectedProduct.image;
      }
    }

    

    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute("content", sDesc);
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", sDesc);
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute("content", sDesc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", sTitle);

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && sImage) ogImage.setAttribute("content", sImage);

    // Canonical link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', sUrl);
  }, [view, selectedProduct, content?.logoUrl]);

  return (
    <div className="w-full h-full relative flex items-center justify-start">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": "https://kirthidiamonds.com/shop#catalogue",
        "name": "Kirthi Diamonds - The Boutique Collection",
        "description": "Explore the full range of GIA and IGI certified diamond jewellery and BIS hallmarked gold collections at Kirthi Diamonds. Bridal jewellery, engagement rings, wedding bands, and bespoke masterpieces.",
        "url": "https://kirthidiamonds.com/shop",
        "numberOfItems": liveProducts.length,
        "itemListElement": liveProducts.map((p, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": p.name,
          "url": `https://kirthidiamonds.com/shop?product=${p.id}`
        })),
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://kirthidiamonds.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "The Boutique",
              "item": "https://kirthidiamonds.com/shop"
            }
          ]
        }
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What custom jewellery services does Kirthi Diamonds offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Kirthi Diamonds offers fully bespoke custom jewellery design, from small modifications to entirely original commissions. Their expert designers and artisans work closely with customers to co-create pieces inspired by tradition, modern aesthetics, or meaningful personal moments, using ethically sourced diamonds and premium materials."
            }
          },
          {
            "@type": "Question",
            "name": "How does the custom jewellery process work at Kirthi Diamonds?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The custom jewellery process at Kirthi Diamonds includes a free design consultation, diamond selection from GIA or IGI certified inventory, 3D preview or design sketches for approval, crafting by in-house artisans over 2 to 4 weeks, and final delivery with full certification documentation."
            }
          },
          {
            "@type": "Question",
            "name": "What collections does Kirthi Diamonds offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Kirthi Diamonds offers bridal diamond jewellery, engagement rings and wedding bands, custom masterpieces and bespoke designs, GIA and IGI certified diamonds, and BIS hallmarked gold. Collections range from everyday elegance to high-jewellery bridal pieces and heirloom commissions."
            }
          },
          {
            "@type": "Question",
            "name": "Are Kirthi Diamonds pieces handcrafted?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Every Kirthi Diamonds piece is handcrafted in-house by master artisans using ethically sourced diamonds and the finest materials. The brand blends time-honoured techniques with avant-garde precision, from conceptual sketches through to the final polish."
            }
          },
          {
            "@type": "Question",
            "name": "Does Kirthi Diamonds offer jewellery for occasions other than weddings?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Kirthi Diamonds offers jewellery for weddings, festive occasions, heirloom gifting, and everyday luxury. Collections include diamond solitaires, gold pieces, and bespoke commissions tailored to any occasion or personal style."
            }
          },
          {
            "@type": "Question",
            "name": "Can I verify the authenticity of diamonds purchased from Kirthi Diamonds?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. All diamonds above 0.30 carats come with GIA or IGI certificates that can be verified online. GIA certificates can be checked at GIA.edu/report-check and IGI certificates at IGI.org/verify-your-report. Certified diamonds also carry a microscopic laser inscription on the girdle matching the certificate number."
            }
          },
          {
            "@type": "Question",
            "name": "What is Kirthi Diamonds' policy on jewellery exchange and buyback?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Kirthi Diamonds offers a lifetime buyback and exchange policy on all Kirthi creations. The policy is transparent and honours the full value of every piece. All exchange and buyback terms are documented on the invoice at the time of purchase."
            }
          }
        ]
      }) }} />
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <AnimatePresence>
        {isCartOpen && (
          <motion.div 
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[140] bg-black/60 backdrop-blur-md" 
            onClick={() => setIsCartOpen(false)} 
          />
        )}
        {isCartOpen && (
          <CartView 
            key="cart-drawer"
            items={cart as any} 
            onClose={() => setIsCartOpen(false)} 
            onRemove={handleRemoveFromCart}
            onUpdateQuantity={(id, qty) => {
              updateCartItemQuantity(id, qty);
            }}
            onCheckout={handleCheckout}
            isCheckoutLoading={isCheckoutLoading}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal 
            key="quickview-modal"
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={handleAddToCart}
            onFullDetails={handleProductSelect}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
          />
        )}
      </AnimatePresence>

      <div className="w-full h-full overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {isLoading && view === 'grid' ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center min-h-[50vh]"
            >
              <div className="w-12 h-12 border rounded-full border-[#D4AF37]/30 border-t-[#D4AF37] border-l-[#D4AF37] animate-spin"></div>
            </motion.div>
          ) : view === 'grid' && (
            <motion.div 
              key="shop-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col justify-start items-center px-4 sm:px-6 md:px-16 lg:px-28 py-24 md:py-40"
            >
               <div className="max-w-7xl w-full relative">
                  {/* Mobile sticky header for cart */}
                  <div className="md:hidden sticky top-8 z-[60] w-full flex justify-end pb-4 pointer-events-none">
                     <button 
                       onClick={() => setIsCartOpen(true)}
                       className="flex items-center space-x-3 group bg-[#111] backdrop-blur-md p-2 pl-4 rounded-full border border-[#D4AF37]/20 pointer-events-auto shadow-2xl"
                     >
                       <div className="text-right">
                         <span className="block text-[8px] uppercase tracking-[0.2em] opacity-50">Cart</span>
                         <span className="block text-xs md:text-[10px] tracking-widest text-[#D4AF37]">{cart.length}</span>
                       </div>
                       <div className="w-10 h-10 rounded-full border border-[#D4AF37]/10 flex justify-center items-center bg-[#D4AF37]/5 group-hover:bg-[#D4AF37]/20 transition-all relative">
                         <ShoppingBag size={14} className="text-[#D4AF37] transition-colors" />
                         {cart.length > 0 && (
                           <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] rounded-full flex items-center justify-center text-black text-xs md:text-[10px] font-bold shadow">
                             {cart.length}
                           </div>
                         )}
                       </div>
                     </button>
                  </div>
                  
                  {/* Boutique Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-12">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 md:space-x-6">
                        <div className="w-12 h-px bg-[#D4AF37] opacity-40"></div>
                        <h4 className="text-xs md:text-[10px] uppercase tracking-[0.6em] text-[#D4AF37]">The Boutique</h4>
                      </div>
                      <h2 className="text-4xl md:text-6xl lg:text-[80px] font-serif italic leading-none mt-4 md:mt-0">The seasonal<br />selection</h2>
                      
                      <AnimatePresence>
                        {liveGoldRates && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex items-center space-x-6 pt-6"
                          >
                            <div className="flex flex-col border-l border-[#D4AF37]/30 pl-4 py-1">
                              <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]/60 mb-1">Live 22KT Rate</span>
                              <span className="text-xs md:text-sm font-light text-white flex items-center gap-2">
                                ₹{liveGoldRates["22KT"]}/g <TrendingUp size={12} className="text-[#D4AF37]" />
                              </span>
                            </div>
                            <div className="flex flex-col border-l border-[#D4AF37]/30 pl-4 py-1">
                              <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]/60 mb-1">Live 18KT Rate</span>
                              <span className="text-xs md:text-sm font-light text-white flex items-center gap-2">
                                ₹{liveGoldRates["18KT"]}/g <TrendingUp size={12} className="text-[#D4AF37]" />
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className="flex flex-col md:items-end space-y-8 w-full md:w-auto">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0 text-xs md:text-[10px] uppercase tracking-[0.3em] w-full pb-4 md:pb-0 gap-6">
                        
                        {/* Mobile Filter Button */}
                        <div className="md:hidden w-full flex justify-between gap-4 pointer-events-auto">
                           <button
                             onClick={() => setIsFilterModalOpen(true)}
                             className="flex-1 py-3 border border-white/20 text-center uppercase tracking-widest cursor-pointer"
                           >
                             Filters & Sort
                           </button>
                           <button 
                              onClick={() => setView('status')}
                              className="flex-[0.5] py-3 border border-white/20 text-center uppercase tracking-widest cursor-pointer text-[#D4AF37]"
                           >
                             Status
                           </button>
                        </div>
                        
                        {/* Desktop Categories */}
                        <div className="hidden md:flex space-x-6 overflow-x-auto w-full scrollbar-hide pb-2 border-b border-white/5">
                          {categories.map(cat => (
                            <button 
                              key={cat}
                              onClick={() => setActiveCategory(cat)}
                              className={`whitespace-nowrap transition-all duration-500 pb-2 border-b-2 cursor-pointer pointer-events-auto ${activeCategory === cat ? 'text-[#D4AF37] border-[#D4AF37]' : 'opacity-30 border-transparent hover:opacity-60'}`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                        
                        {/* Desktop Sort */}
                        <div className="hidden md:flex flex-wrap items-center gap-6 shrink-0 relative z-50 w-full lg:w-auto justify-start lg:justify-end">
                          <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-[#050505] border border-white/10 hover:border-[#D4AF37] px-4 py-3 text-[#D4AF37] outline-none cursor-pointer uppercase tracking-[0.2em] transition-colors pointer-events-auto"
                          >
                            <option value="featured" className="bg-[#050505] text-white">Featured</option>
                            <option value="price-asc" className="bg-[#050505] text-white">Price: Low - High</option>
                            <option value="price-desc" className="bg-[#050505] text-white">Price: High - Low</option>
                          </select>
                          <button 
                              onClick={() => setView('status')}
                              className="whitespace-nowrap transition-all duration-500 pb-1 border-b opacity-40 border-white/30 hover:opacity-100 hover:text-[#D4AF37] hover:border-[#D4AF37] relative z-50 pointer-events-auto cursor-pointer"
                          >
                            Track Selection
                          </button>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setIsCartOpen(true)}
                        className="flex items-center space-x-6 group self-start md:self-auto"
                      >
                        <div className="text-right">
                          <span className="block text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-30">Selection</span>
                          <span className="block text-sm md:text-[11px] tracking-widest">{cart.length} Pieces</span>
                        </div>
                        <div className="w-14 h-14 rounded-full border border-white/5 flex justify-center items-center group-hover:bg-[#D4AF37] transition-all duration-500 shadow-2xl">
                          <ShoppingBag size={20} className="group-hover:text-black transition-colors" />
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Editorial Grid */}
                  {filteredProducts.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="w-full py-32 flex flex-col items-center justify-center text-center space-y-12 min-h-[50vh]"
                    >
                      <div className="relative">
                        <div className="w-24 h-24 border border-[#D4AF37]/20 rounded-full animate-pulse flex items-center justify-center">
                          <div className="w-12 h-12 rotate-45 border border-[#D4AF37]/40" />
                        </div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent)] blur-xl" />
                      </div>
                      
                      <div className="space-y-6 max-w-3xl px-6">
                        <h3 className="text-2xl md:text-4xl lg:text-5xl font-serif italic text-white/90">Curating the Extraordinary</h3>
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mx-auto" />
                        <p className="text-sm md:text-[11px] md:text-[13px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/40 leading-loose mx-auto">
                          Our digital atelier is currently preparing its next selection of masterpieces.
                          <br /><br />
                          We will soon unveil our online exclusive collection—a series of uncompromising designs marked by exceptional craftsmanship and timeless elegance. We cordially invite you to return shortly to acquire these limited-edition pieces.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 md:gap-12 lg:gap-4 md:gap-20 pb-8">
                      {filteredProducts.map((product, idx) => {
                        // Custom grid spans for editorial feel only on large desktops
                        const isLarge = idx % 5 === 0;
                        const spanClasses = isLarge ? 'col-span-1 lg:col-span-8' : 'col-span-1 lg:col-span-4';
                        const aspectClasses = isLarge ? 'aspect-[4/5] lg:aspect-[16/9]' : 'aspect-[4/5]';
                         return (
                          <motion.div 
                            key={`${product.id}-${idx}`}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (idx % 3) * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className={`w-full md:w-auto overflow-hidden group relative flex flex-col ${spanClasses} ${idx % 2 === 1 ? 'md:mt-24' : ''}`}
                          >
                             <script 
                               type="application/ld+json" 
                               dangerouslySetInnerHTML={{ __html: JSON.stringify({
                                 "@context": "https://schema.org",
                                 "@type": "Product",
                                 "name": product.name,
                                 "image": product.image || "/logo.png",
                                 "description": product.description || product.name,
                                 "sku": `KD-${product.id}`,
                                 "mpn": `KD-${product.id}`,
                                 "brand": {
                                   "@type": "Brand",
                                   "name": "Kirthi Diamonds"
                                 },
                                 "offers": {
                                   "@type": "Offer",
                                   "url": `https://kirthidiamonds.com/shop?product=${product.id}`,
                                   "priceCurrency": "INR",
                                   "price": product.price,
                                   "priceValidUntil": "2027-12-31",
                                   "availability": "https://schema.org/InStock",
                                   "itemCondition": "https://schema.org/NewCondition"
                                 },
                                 
                               })}} 
                             />
                             <a 
                               href={`/shop?product=${product.id}`}
                               onClick={(e) => { e.preventDefault(); handleProductSelect(product); }}
                             className={`relative ${aspectClasses} bg-white/[0.01] border border-white/5 flex justify-center items-center cursor-pointer group-hover:bg-white/[0.03] transition-all duration-1000 overflow-hidden shadow-2xl block`}
                           >
                              {/* Background number for editorial hint */}
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-serif italic text-white/[0.02] select-none pointer-events-none">
                                0{idx + 1}
                              </div>

                             <FastImage 
                               src={product.image || undefined} 
                               alt={product.name} 
                               fetchPriority={idx < 4 ? "high" : "auto"}
                               className={`${isLarge ? 'w-4/5 lg:w-1/2' : 'w-4/5'} h-4/5 object-contain transition-transform duration-1000 z-10 filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:scale-110`}
                             />
                             
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
                             
                             <div className="absolute bottom-10 left-10 md:bottom-12 md:left-12 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 z-20 flex flex-col items-start gap-4">
                                <div className="space-y-1">
                                   <span className="text-xs md:text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] block">Exhibition Piece</span>
                                   <h3 className="text-xl md:text-2xl font-serif italic text-white leading-tight">Full Anthology</h3>
                                </div>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); setQuickViewProduct(product); }}
                                  className="px-6 py-3 md:py-2 bg-white text-black text-xs md:text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-[#D4AF37] transition-all"
                                >
                                   Quick Preview
                                </button>
                             </div>

                              <div className="absolute top-10 right-10 md:top-12 md:right-12 opacity-0 group-hover:opacity-100 transition-all duration-700 z-20 flex flex-col gap-4 md:gap-3">
                                <div 
                                  onClick={(e) => { e.preventDefault(); toggleWishlist(product.id, e); }}
                                  className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all ${wishlist.includes(product.id) ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black'}`}
                                >
                                   <Heart size={18} className={wishlist.includes(product.id) ? 'fill-current' : ''} />
                                </div>
                                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black transition-all">
                                   <Plus size={18} />
                                </div>
                              </div>
                           </a>

                           <div className="mt-10 flex justify-between items-start px-2">
                             <div className="space-y-2">
                               <div className="flex items-center space-x-3">
                                 <span className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-30 italic">{product.category}</span>
                                 <div className="w-4 h-px bg-white/10"></div>
                               </div>
                               <h3 className="text-[15px] tracking-[0.15em] uppercase font-light group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
                             </div>
                             <div className="text-right">
                               <p className="text-[14px] tracking-widest text-[#D4AF37] font-light">₹{product.price.toLocaleString('en-IN')}</p>
                               <span className="text-[8px] uppercase tracking-widest opacity-20 block mt-1">Insured Shipping</span>
                             </div>
                           </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  )}

                  {/* Footer Boutique Note & Newsletter */}
                  <div className="mt-48 border-t border-white/5 pt-32 pb-32 flex flex-col items-center text-center space-y-24 mb-32">
                    
                    {/* Newsletter */}
                    <div className="max-w-md w-full space-y-8 bg-white/[0.01] p-12 border border-white/5 shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05),transparent_50%)]" />
                      <div className="relative space-y-6">
                        <Mail className="mx-auto text-[#D4AF37] opacity-60" size={24} />
                        <h3 className="text-xl font-serif italic text-white/90">Kirthi Journal</h3>
                        <p className="text-xs md:text-[10px] uppercase tracking-[0.3em] opacity-40 leading-relaxed font-light px-4">
                          Subscribe to receive exclusive access to new high-jewellery collections and private exhibitions.
                        </p>
                        {!newsletterSubscribed ? (
                          <form onSubmit={(e) => { e.preventDefault(); setNewsletterSubscribed(true); }} className="space-y-6 md:space-y-4 pt-4">
                            <input 
                              type="email" 
                              required
                              value={newsletterEmail}
                              onChange={(e) => setNewsletterEmail(e.target.value)}
                              placeholder="EMAIL ADDRESS" 
                              className="w-full bg-transparent border-b border-white/20 px-4 py-3 text-xs md:text-[10px] tracking-[0.3em] text-center font-light text-white outline-none focus:border-[#D4AF37] transition-colors placeholder:text-white/20 uppercase"
                            />
                            <button type="submit" className="w-full py-4 text-xs md:text-[10px] uppercase tracking-[0.4em] bg-white/5 hover:bg-[#D4AF37] hover:text-black transition-all border border-white/10 hover:border-[#D4AF37]">
                              Subscribe
                            </button>
                          </form>
                        ) : (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-6 space-y-6 md:space-y-4">
                            <CheckCircle className="mx-auto text-[#D4AF37]" size={20} />
                            <p className="text-xs md:text-[10px] uppercase tracking-[0.3em] font-light text-[#D4AF37]">Welcome to the Inner Circle</p>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-10 flex flex-col items-center">
                      <div className="w-12 h-px bg-[#D4AF37]"></div>
                      <div className="space-y-6 md:space-y-4">
                        <h3 className="text-2xl font-serif italic opacity-60">Global Diamond Specialist</h3>
                        <p className="max-w-xl mx-auto text-sm md:text-[11px] uppercase tracking-[0.3em] opacity-30 leading-relaxed font-light">
                          Our collections are curated for individual collectors. If you seek a specific gemstone or a bespoke configuration, please contact our bespoke consultation team.
                        </p>
                      </div>
                      <button 
                        onClick={onInquiry}
                        className="px-6 md:px-12 py-5 border border-white/10 text-xs md:text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all"
                      >
                        Private Commission
                      </button>
                    </div>
                  </div>
                </div>
                <SharedFooter />
            </motion.div>
          )}

          {view === 'status' && (
            <motion.div 
              key="status-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <OrderStatus onBack={() => { setView('grid'); setCheckoutOrderId(null); window.history.pushState({}, '', '/shop'); }} initialOrderId={checkoutOrderId || ''} />
            </motion.div>
          )}

          {view === 'product' && selectedProduct && (
            <motion.div 
              key={`product-detail-${selectedProduct.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <ProductDetail 
                product={selectedProduct} 
                allProducts={liveProducts}
                onBack={() => { setView('grid'); window.history.pushState({}, '', '/shop'); }} 
                onAddToCart={handleAddToCart}
                onProductSelect={(p) => {
                  setSelectedProduct(p);
                }}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            </motion.div>
          )}

          {view === 'success' && (
            <motion.div 
              key="success-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col justify-center items-center text-center px-12 py-32 bg-[#050505]"
            >
              <div className="relative mb-16">
                 <motion.div 
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ duration: 1 }}
                   className="w-40 h-40 border border-[#D4AF37]/20 rounded-full flex items-center justify-center"
                 >
                    <CheckCircle size={64} strokeWidth={1} className="text-[#D4AF37]" />
                 </motion.div>
                 <motion.div 
                   animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                   transition={{ duration: 3, repeat: Infinity }}
                   className="absolute inset-0 border border-[#D4AF37] rounded-full scale-125" 
                 />
              </div>

              <div className="space-y-6 max-w-2xl">
                <h4 className="text-xs md:text-[10px] uppercase tracking-[0.8em] text-[#D4AF37]">Confirmation</h4>
                <h2 className="text-4xl md:text-6xl lg:text-[80px] font-serif italic leading-none">The selection<br />is documented</h2>
                <p className="text-sm md:text-lg font-light leading-relaxed italic opacity-40 max-w-md mx-auto pt-8">
                  Your interest in these masterpieces has been registered with our digital atelier. A dedicated Maison Diamond Specialist will contact you within the hour to facilitate the secure transfer of ownership.
                </p>
              </div>

              <div className="mt-20 flex flex-col md:flex-row items-center gap-8">
                <a 
                  href="/shop"
                  onClick={(e) => { e.preventDefault(); setView('grid'); window.history.pushState({}, '', '/shop'); }}
                  className="px-8 md:px-16 py-5 bg-[#D4AF37] text-black text-sm md:text-[11px] uppercase tracking-[0.4em] font-medium hover:bg-white transition-all shadow-2xl text-center w-full md:w-auto block"
                >
                  Return to Boutique
                </a>
                <button 
                  onClick={() => setView('status')}
                  className="px-6 md:px-12 py-5 border border-white/10 text-xs md:text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all text-center w-full md:w-auto"
                >
                  Track Acquisition
                </button>
                <button 
                  onClick={onInquiry}
                  className="px-6 md:px-12 py-5 border border-white/10 text-xs md:text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all text-center w-full md:w-auto"
                >
                  Priority Diamond Specialist
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
