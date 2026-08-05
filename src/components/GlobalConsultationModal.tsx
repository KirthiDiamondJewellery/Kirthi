import React, { useState, useEffect } from 'react';
import ConsultationModal from './ConsultationModal';

export default function GlobalConsultationModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-consultation', handleOpen);
    return () => window.removeEventListener('open-consultation', handleOpen);
  }, []);

  return <ConsultationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}
