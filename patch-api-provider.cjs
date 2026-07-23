const fs = require('fs');

function patch(file) {
  let code = fs.readFileSync(file, 'utf8');
  if (code.includes('const [mapError, setMapError] = useState(false);')) return;

  // For StoreLocatorView
  if (file.includes('StoreLocatorView.tsx')) {
    code = code.replace(
      'export default function StoreLocatorView({ onInquiry }: { onInquiry?: () => void }) {',
      'export default function StoreLocatorView({ onInquiry }: { onInquiry?: () => void }) {\n  const [mapError, setMapError] = useState(false);'
    );
    
    const apiProviderStart = `<APIProvider apiKey={API_KEY} version="weekly">`;
    const apiProviderReplacement = `
        {mapError ? (
           <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#050505] text-center border border-white/10 m-4 max-w-[90%] mx-auto mt-[10%] max-h-[80%] rounded-sm">
             <MapPin size={24} className="text-[#D4AF37] mb-4" />
             <h3 className="text-xl font-serif italic text-white/90 mb-2">Interactive Map Unavailable</h3>
             <p className="text-sm font-light text-white/50 mb-6 max-w-sm">The interactive map could not be loaded. This may be due to API key restrictions.</p>
           </div>
        ) : (
          <APIProvider apiKey={API_KEY} version="weekly" onError={() => setMapError(true)}>
    `;
    
    code = code.replace(apiProviderStart, apiProviderReplacement);
    code = code.replace(`         </APIProvider>`, `         </APIProvider>\n        )}`);
  }
  
  fs.writeFileSync(file, code);
}

patch('src/components/StoreLocatorView.tsx');
