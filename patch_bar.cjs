const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');
code = code.replace(/\{\/\* Floating Save Bar \*\/\}\s+<div className="fixed bottom-0 left-0 w-full bg-\[#050505\]\/90 backdrop-blur-md border-t border-white\/5 py-4 px-6 md:px-12 z-\[100\] flex justify-between items-center">\s+<span className="text-xs md:text-\[10px\] uppercase font-light tracking-widest opacity-50">All changes immediately reflect on the live preview upon deployment\.<\/span>\s+<button\s+onClick=\{\(\) => handleSave\(\)\}\s+disabled=\{saving\}\s+className="px-12 py-4 bg-\[#D4AF37\] text-black text-sm md:text-\[11px\] uppercase tracking-\[0\.4em\] font-medium hover:bg-white transition-all disabled:opacity-50"\s+>\s+\{saving \? 'Syncing Base64 to Network\.\.\.' : 'Deploy Database'\}\s+<\/button>\s+<\/div>/, 
`{/* Floating Save Bar */}
      {['global', 'contact_page', 'shop', 'heritage', 'maison', 'brides', 'exchange'].includes(tab) && (
      <div className="fixed bottom-0 left-0 w-full bg-[#050505]/90 backdrop-blur-md border-t border-white/5 py-4 px-6 md:px-12 z-[100] flex justify-between items-center">
        <span className="text-xs md:text-[10px] uppercase font-light tracking-widest opacity-50">All changes immediately reflect on the live preview upon deployment.</span>
        <button 
          onClick={() => handleSave()}
          disabled={saving}
          className="px-12 py-4 bg-[#D4AF37] text-black text-sm md:text-[11px] uppercase tracking-[0.4em] font-medium hover:bg-white transition-all disabled:opacity-50"
        >
          {saving ? 'Syncing Base64 to Network...' : 'Deploy Database'}
        </button>
      </div>
      )}`);
fs.writeFileSync('src/components/AdminView.tsx', code);
