const fs = require('fs');
let content = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

// The injected code starts with `const ImageUpload =` and ends with `};` for PaginatedArrayEditor.
// Actually, it was injected exactly at the `\n` of `Philosophy Subtitle (use \n for line breaks)`.
// Let's replace the chunk.

const badChunk = `\\nconst ImageUpload = ({ value, onChange, label }: { value: string, onChange: (val: string) => void, label?: string }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-xs uppercase tracking-widest text-[#D4AF37]">{label}</label>}
      <div className="flex items-center gap-4">
        {value && <img src={value} alt="Upload preview" className="w-16 h-16 object-cover border border-white/20" />}
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL..."
          className="flex-1 bg-black border border-white/20 p-2 text-sm text-white"
        />
        {/* Placeholder for actual upload logic */}
      </div>
    </div>
  );
};

const FaviconUpload = ({ value, onChange, label }: { value: string, onChange: (val: string) => void, label?: string }) => {
  return <ImageUpload value={value} onChange={onChange} label={label} />;
};

const ArrayEditor = ({ value, onChange, label }: { value: string[], onChange: (val: string[]) => void, label?: string }) => {
  const textValue = value ? value.join('\\n') : '';
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value.split('\\n').filter(Boolean));
  };
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-xs uppercase tracking-widest text-[#D4AF37]">{label}</label>}
      <textarea 
        value={textValue} 
        onChange={handleChange}
        placeholder="One item per line"
        className="w-full h-32 bg-black border border-white/20 p-2 text-sm text-white"
      />
    </div>
  );
};

const PaginatedArrayEditor = ({ value, onChange, label }: { value: string[], onChange: (val: string[]) => void, label?: string }) => {
  return <ArrayEditor value={value} onChange={onChange} label={label} />;
};
\\n`;

if (content.includes(badChunk)) {
  content = content.replace(badChunk, "\\n");
} else {
  // Try fallback logic
  const startIdx = content.indexOf('const ImageUpload =');
  const endIdx = content.indexOf('return <ArrayEditor value={value} onChange={onChange} label={label} />;\n};');
  if (startIdx !== -1 && endIdx !== -1) {
     content = content.substring(0, startIdx) + content.substring(endIdx + 'return <ArrayEditor value={value} onChange={onChange} label={label} />;\n};'.length);
  }
}

// Now inject at the top right after the last import.
const lines = content.split('\\n');
const importEnd = lines.findLastIndex(l => l.trim().startsWith('import '));
lines.splice(importEnd + 1, 0, badChunk.replace(/^\\n|\\n$/g, ''));
fs.writeFileSync('src/components/AdminView.tsx', lines.join('\\n'));
console.log("Fixed AdminView.tsx");
