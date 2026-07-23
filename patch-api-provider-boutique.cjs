const fs = require('fs');
const file = 'src/components/BoutiqueView.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('const [mapError, setMapError] = useState(false);')) {
  code = code.replace(
    'export default function BoutiqueView({ boutiqueId, onInquiry }: BoutiqueViewProps) {',
    'export default function BoutiqueView({ boutiqueId, onInquiry }: BoutiqueViewProps) {\n  const [mapError, setMapError] = useState(false);'
  );
  // Need to import useState if not imported
  if (!code.includes('useState')) {
    code = code.replace('import React from', 'import React, { useState } from');
  }

  const apiProviderStart = `<APIProvider apiKey={GOOGLE_MAPS_API_KEY} version="weekly">`;
  const apiProviderReplacement = `
                {mapError ? (
                  <iframe 
                    src={isKochi ? 
                      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.351052601705!2d76.31085181467406!3d10.00651939284705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080c4f8ab4fce5%3A0x6b45a0b9432e3a1!2sKirthi%20Diamonds!5e0!3m2!1sen!2sin!4v1718012345678!5m2!1sen!2sin" : 
                      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.064560946252!2d75.7866535146864!3d11.255732291997327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6593929424d15%3A0xc34b3e6488d74549!2sKirthi%20Diamonds!5e0!3m2!1sen!2sin!4v1718012345678!5m2!1sen!2sin"
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
  `;
  
  code = code.replace(apiProviderStart, apiProviderReplacement);
  code = code.replace(`                </APIProvider>`, `                </APIProvider>\n                )}`);
  
  fs.writeFileSync(file, code);
}
