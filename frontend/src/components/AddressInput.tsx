import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Loader } from 'lucide-react';

interface Suggestion { display_name: string; lat: string; lon: string; }

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: 'pickup' | 'destination';
}

const AddressInput: React.FC<AddressInputProps> = ({ value, onChange, placeholder, icon = 'pickup' }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const search = (query: string) => {
    if (query.length < 3) { setSuggestions([]); setOpen(false); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=za`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  };

  const IconComponent = icon === 'pickup' ? MapPin : Navigation;
  const iconColor = icon === 'pickup' ? 'var(--accent)' : '#000';

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        {loading
          ? <Loader size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: iconColor, animation: 'spin 1s linear infinite' }} />
          : <IconComponent size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: iconColor }} />
        }
        <input
          value={value}
          onChange={(e) => { onChange(e.target.value); search(e.target.value); }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          style={{ width: '100%', padding: '12px 12px 12px 36px', border: '1px solid #eee', borderRadius: '10px', fontSize: '15px', fontFamily: 'inherit', backgroundColor: '#f9f9f9', outline: 'none' }}
        />
      </div>

      {open && suggestions.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 999, overflow: 'hidden', marginTop: '4px', border: '1px solid #eee' }}>
          {suggestions.map((s, i) => (
            <div key={i}
              onMouseDown={(e) => { e.preventDefault(); onChange(s.display_name.split(',').slice(0, 3).join(',')); setOpen(false); setSuggestions([]); }}
              style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '13px', borderBottom: i < suggestions.length - 1 ? '1px solid #f5f5f5' : 'none', display: 'flex', gap: '10px', alignItems: 'flex-start', backgroundColor: '#fff' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9f5ff')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
            >
              <MapPin size={14} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ lineHeight: 1.4 }}>{s.display_name.split(',').slice(0, 4).join(', ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressInput;
