"use client";

import React, { useState } from 'react';

export default function Reader({ images }: { images: string[] }) {
  const [direction, setDirection] = useState<'vertical' | 'horizontal'>('vertical');

  return (
    <div className="reader-container animate-fade-in" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', background: 'rgba(0,0,0,0.5)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--surface-border)' }}>
      <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-color)', backdropFilter: 'blur(8px)', position: 'sticky', top: '70px', zIndex: 10 }}>
        <span style={{ fontWeight: 600 }}>Reading Focus Mode</span>
        <button 
           className="btn" 
           onClick={() => setDirection(d => d === 'vertical' ? 'horizontal' : 'vertical')}
           style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
          Switch to {direction === 'vertical' ? 'Horizontal' : 'Vertical'} View
        </button>
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        overflowX: direction === 'horizontal' ? 'auto' : 'hidden',
        scrollSnapType: direction === 'horizontal' ? 'x mandatory' : 'y none',
        padding: '1rem',
        gap: '1rem'
      }}>
        {images.map((src, idx) => (
          <img 
            key={idx} 
            src={src} 
            alt={`Page ${idx + 1}`} 
            loading="lazy"
            style={{ 
              width: '100%', 
              height: direction === 'horizontal' ? '80vh' : 'auto', 
              objectFit: 'contain',
              scrollSnapAlign: 'start',
              borderRadius: '8px',
              border: '1px solid #333'
            }} 
          />
        ))}
      </div>
    </div>
  );
}
