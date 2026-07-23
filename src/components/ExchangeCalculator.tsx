import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useContent } from "../contexts/ContentContext";

export default function ExchangeCalculator() {
  const { content } = useContent();
  const [goldRate, setGoldRate] = useState<number>(6500); // Default assumed 18KT rate
  const [goldWeight, setGoldWeight] = useState<number>(0);
  
  const [diamondCarat, setDiamondCarat] = useState<number>(0);
  const [diamondRate, setDiamondRate] = useState<number>(content?.baseDiamondRate || 80000);
  
  const [polkiCarat, setPolkiCarat] = useState<number>(0);
  const [polkiRate, setPolkiRate] = useState<number>(content?.basePolkiRate || 30000);

  const [colorstoneCarat, setColorstoneCarat] = useState<number>(0);
  const [colorstoneRate, setColorstoneRate] = useState<number>(content?.baseColorstoneRate || 1000);

  const [showAdminRates, setShowAdminRates] = useState<boolean>(false);
  const [showAdminPinInput, setShowAdminPinInput] = useState<boolean>(false);
  const [adminPin, setAdminPin] = useState<string>("");
  const [goldPurity, setGoldPurity] = useState<"18KT" | "22KT">("18KT");
  const [liveRates, setLiveRates] = useState<{ "18KT": number, "22KT": number } | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false);

  const handlePinSubmit = () => {
    if (adminPin === "1975" || adminPin === "admin") {
      setShowAdminRates(true);
      setShowAdminPinInput(false);
      setAdminPin("");
    } else {
      setShowAdminPinInput(false);
      setAdminPin("");
    }
  };

  const fetchGoldRates = async () => {
    setIsLoadingRates(true);
    try {
      const response = await fetch('/api/gold-rate');
      if (!response.ok) {
         console.warn(`Gold rate API returned ${response.status}`);
         if (!liveRates) setLiveRates({ "18KT": 5900, "22KT": 7200 });
         return;
      }
      const data = await response.json();
      
      if (data.success) {
        setLiveRates({ "18KT": data["18KT"], "22KT": data["22KT"] });
      } else {
        if (!liveRates) setLiveRates({ "18KT": 5900, "22KT": 7200 });
      }
    } catch (err) {
      console.warn("Could not reach gold rates API, using fallbacks.");
      if (!liveRates) {
        setLiveRates({ "18KT": 5900, "22KT": 7200 }); // fallback
      }
    } finally {
      setIsLoadingRates(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (content?.baseDiamondRate) setDiamondRate(content.baseDiamondRate);
    if (content?.basePolkiRate) setPolkiRate(content.basePolkiRate);
    if (content?.baseColorstoneRate) setColorstoneRate(content.baseColorstoneRate);
  }, [content?.baseDiamondRate, content?.basePolkiRate, content?.baseColorstoneRate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGoldRates();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (liveRates) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGoldRate(liveRates[goldPurity]);
    }
  }, [goldPurity, liveRates]);

  const goldTotal = goldRate * goldWeight;
  const diamondTotalValue = diamondCarat * diamondRate;
  const polkiTotalValue = polkiCarat * polkiRate;
  const colorstoneTotalValue = colorstoneCarat * colorstoneRate;

  // Diamond: 100% exchange, 75% cashback
  const diamondExchange = diamondTotalValue * 1.0;
  const diamondBuyback = diamondTotalValue * 0.75;

  // Polki: 90% exchange, 70% cashback
  const polkiExchange = polkiTotalValue * 0.9;
  const polkiBuyback = polkiTotalValue * 0.7;

  // Colorstone: 80% exchange, 65% cashback
  const colorstoneExchange = colorstoneTotalValue * 0.8;
  const colorstoneBuyback = colorstoneTotalValue * 0.65;

  const totalExchange = goldTotal + diamondExchange + polkiExchange + colorstoneExchange;
  const totalBuyback = goldTotal + diamondBuyback + polkiBuyback + colorstoneBuyback;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="mt-24 p-8 md:p-12 border border-white/10 bg-[#111] rounded-sm w-full max-w-4xl mx-auto"
    >
      <div className="mb-10 text-center">
        <h3 className="text-2xl md:text-3xl font-serif italic text-white mb-4">Value Estimation Engine</h3>
        <p className="text-sm font-light text-white/60">
          Enter your original item details to estimate current exchange and buyback values. 
          <br className="hidden md:block"/>
          <span className="italic text-[#D4AF37]">Actual valuation requires physical inspection at our boutiques.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-serif italic text-lg">Item Details</h4>
            <div className="flex items-center space-x-2">
              {showAdminPinInput ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="password"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="PIN"
                    className="w-20 bg-black/50 border border-white/20 p-1 px-2 text-[10px] text-center text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handlePinSubmit();
                      if (e.key === 'Escape') {
                        setShowAdminPinInput(false);
                        setAdminPin("");
                      }
                    }}
                    autoFocus
                  />
                  <button 
                    onClick={handlePinSubmit}
                    className="text-[10px] uppercase tracking-widest text-[#D4AF37] opacity-60 hover:opacity-100 transition-opacity"
                  >
                    Unlock
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => showAdminRates ? setShowAdminRates(false) : setShowAdminPinInput(true)} 
                  className="text-[10px] uppercase tracking-widest text-[#D4AF37] opacity-20 hover:opacity-80 transition-opacity"
                >
                  {showAdminRates ? "Lock Rates" : "Admin"}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4 mb-4">
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="goldPurity"
                  value="18KT"
                  checked={goldPurity === "18KT"}
                  onChange={() => setGoldPurity("18KT")}
                  className="accent-[#D4AF37] w-4 h-4 bg-black border border-white/20 checked:border-[#D4AF37]"
                />
                <span className={`text-sm tracking-wide ${goldPurity === "18KT" ? "text-white" : "text-white/50 group-hover:text-white/80"} transition-colors`}>18KT Gold</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="goldPurity"
                  value="22KT"
                  checked={goldPurity === "22KT"}
                  onChange={() => setGoldPurity("22KT")}
                  className="accent-[#D4AF37] w-4 h-4 bg-black border border-white/20 checked:border-[#D4AF37]"
                />
                <span className={`text-sm tracking-wide ${goldPurity === "22KT" ? "text-white" : "text-white/50 group-hover:text-white/80"} transition-colors`}>22KT Gold</span>
              </label>
            </div>
            <div className="flex items-center space-x-4">
              {isLoadingRates ? (
                <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] opacity-50 animate-pulse">Syncing live rates via AKGSMA...</p>
              ) : (liveRates && (
                <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] opacity-80">
                  Live {goldPurity} Rate: ₹{liveRates[goldPurity]}/g
                </p>
              ))}
              <button 
                onClick={fetchGoldRates}
                disabled={isLoadingRates}
                className="text-[10px] uppercase tracking-widest text-white/50 hover:text-[#D4AF37] transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/80">Gold Weight (Grams)</label>
            <input 
              type="number" 
              value={goldWeight || ""}
              onChange={(e) => setGoldWeight(Number(e.target.value))}
              placeholder="e.g. 15"
              className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/80">Diamond Weight (Carats)</label>
            <input 
              type="number" 
              value={diamondCarat || ""}
              onChange={(e) => setDiamondCarat(Number(e.target.value))}
              placeholder="e.g. 1.5"
              step="0.01"
              className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white transition-colors"
            />
          </div>

          {showAdminRates && (
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/80">Diamond Rate (₹/Carat)</label>
              <input 
                type="number" 
                value={diamondRate || ""}
                onChange={(e) => setDiamondRate(Number(e.target.value))}
                className="w-full bg-black/50 border border-[#D4AF37]/30 p-3 text-sm focus:border-[#D4AF37] outline-none text-white transition-colors"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/80">Polki Weight (Carats)</label>
            <input 
              type="number" 
              value={polkiCarat || ""}
              onChange={(e) => setPolkiCarat(Number(e.target.value))}
              placeholder="e.g. 2.0"
              step="0.01"
              className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white transition-colors"
            />
          </div>

          {showAdminRates && (
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/80">Polki Rate (₹/Carat)</label>
              <input 
                type="number" 
                value={polkiRate || ""}
                onChange={(e) => setPolkiRate(Number(e.target.value))}
                className="w-full bg-black/50 border border-[#D4AF37]/30 p-3 text-sm focus:border-[#D4AF37] outline-none text-white transition-colors"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/80">Colourstone Weight (Carats)</label>
            <input 
              type="number" 
              value={colorstoneCarat || ""}
              onChange={(e) => setColorstoneCarat(Number(e.target.value))}
              placeholder="e.g. 5.0"
              step="0.01"
              className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white transition-colors"
            />
          </div>

          {showAdminRates && (
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/80">Colourstone Rate (₹/Carat)</label>
              <input 
                type="number" 
                value={colorstoneRate || ""}
                onChange={(e) => setColorstoneRate(Number(e.target.value))}
                className="w-full bg-black/50 border border-[#D4AF37]/30 p-3 text-sm focus:border-[#D4AF37] outline-none text-white transition-colors"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center space-y-8 bg-black/40 p-8 border border-white/5 relative overflow-hidden">
          {/* Background decorative element */}
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z"></path>
            </svg>
          </div>

          <div className="relative z-10">
            <h4 className="text-xs uppercase tracking-[0.3em] font-light opacity-50 mb-2">Estimated Exchange Value</h4>
            <div className="text-4xl md:text-5xl font-serif italic text-white mb-2">{formatCurrency(totalExchange)}</div>
            <p className="text-xs font-light text-[#D4AF37]/70">Full credit applied towards new Kirthi piece</p>
          </div>

          <div className="w-full h-px bg-white/10"></div>

          <div className="relative z-10">
            <h4 className="text-xs uppercase tracking-[0.3em] font-light opacity-50 mb-2">Estimated Cash Buyback</h4>
            <div className="text-3xl md:text-4xl font-serif italic text-white/90 mb-2">{formatCurrency(totalBuyback)}</div>
            <p className="text-xs font-light text-white/40">Direct cash valuation paid on the spot</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
