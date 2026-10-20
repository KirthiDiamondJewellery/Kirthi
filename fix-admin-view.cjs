const fs = require('fs');
let content = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

// I will insert these components at the top of AdminView.tsx if they don't exist
const components = `
const ImageUpload = ({ value, onChange, label }: { value: string, onChange: (val: string) => void, label?: string }) => {
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
`;

if (!content.includes('const ImageUpload =')) {
  // insert after imports
  const lines = content.split('\\n');
  const importEnd = lines.findLastIndex(l => l.startsWith('import '));
  lines.splice(importEnd + 1, 0, components);
  fs.writeFileSync('src/components/AdminView.tsx', lines.join('\\n'));
}
