import React, { useEffect } from 'react';
import { SiteContent } from '../contexts/ContentContext';
import { Section, SECTIONS } from '../constants';

interface AdminSEOProps {
  formData: SiteContent;
  setFormData: (data: SiteContent) => void;
}

export default function AdminSEO({ formData, setFormData }: AdminSEOProps) {
  // Merge current sections with default SECTIONS to guarantee all exist
  const rawSections = formData.sections || [];
  
  // Find any sections from SECTIONS that are missing in formData.sections
  const missingSections = SECTIONS.filter(
    (defaultSec) => !rawSections.some((s) => s.id === defaultSec.id)
  );

  const sections = [...rawSections, ...missingSections];

  // If there are missing sections, update the parent state so they get saved
  useEffect(() => {
    const raw = formData.sections || [];
    const missing = SECTIONS.filter(
      (defaultSec) => !raw.some((s) => s.id === defaultSec.id)
    );
    if (missing.length > 0) {
      setFormData({
        ...formData,
        sections: [...raw, ...missing],
      });
    }
  }, [formData, setFormData]);

  const handleUpdateSectionSEO = (index: number, key: keyof Section, value: string) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], [key]: value };
    setFormData({ ...formData, sections: updatedSections });
  };

  return (
    <div className="space-y-12">
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-serif italic text-white/90">SEO Management</h2>
        <p className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-40">Manage Page Titles and Meta Descriptions</p>
      </div>

      <div className="space-y-8">
        {sections.map((section, index) => (
          <div key={section.id} className="bg-white/5 border border-white/10 p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-lg font-serif italic text-[#D4AF37]">{section.title} Section</h3>
              <span className="text-[10px] uppercase tracking-widest opacity-50">ID: {section.id}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] uppercase tracking-[0.2em] opacity-60">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={section.seoTitle || ''}
                  onChange={(e) => handleUpdateSectionSEO(index, 'seoTitle', e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 py-2 text-sm focus:border-[#D4AF37] outline-none transition-all"
                  placeholder={`Default: ${section.title} | Kirthi Diamonds`}
                />
                <p className="text-[9px] opacity-40 mt-1">Leave blank to use default. Recommended: under 60 characters.</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] uppercase tracking-[0.2em] opacity-60">
                  SEO Meta Description
                </label>
                <textarea
                  value={section.seoDescription || ''}
                  onChange={(e) => handleUpdateSectionSEO(index, 'seoDescription', e.target.value)}
                  rows={3}
                  className="w-full bg-white/5 border border-white/20 p-4 text-sm focus:border-[#D4AF37] outline-none transition-all resize-y custom-scrollbar"
                  placeholder={`Default: ${section.description}`}
                />
                <p className="text-[9px] opacity-40 mt-1">Leave blank to use the section description. Recommended: 150-160 characters.</p>
                {section.seoDescription && section.seoDescription.length > 160 && (
                  <p className="text-[9px] text-yellow-500 mt-1">Warning: Description is longer than 160 characters and may be truncated in search results ({section.seoDescription.length} chars).</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
