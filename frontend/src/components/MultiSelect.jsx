import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * MultiSelect (uncontrolled popover, controlled selection)
 * @component
 * Accessible multi-select dropdown with:
 *  - Keyboard nav (arrows, home/end, enter/space, escape)
 *  - Search / typeahead filter
 *  - Tag chips with inline removal
 *  - Select all / Clear buttons
 *  - Virtual friendly (no portal) simple popover
 *
 * Props:
 *  label: string                 Visible label above control (also ARIA label)
 *  options: string[]             List of option values (must be unique)
 *  values: string[]              Controlled selected values
 *  onChange: (string[]) => void  Callback with new selection array
 *  placeholder?: string          Shown when empty
 *  maxTagCount?: number          Collapse to +N after this many tags
 *  allowSelectAll?: boolean      Toggle select all entry
 *  className?: string            Additional wrapper class
 */
export default function MultiSelect({
  label,
  options = [],
  values = [],
  onChange,
  placeholder = 'Select...',
  maxTagCount = 3,
  allowSelectAll = true,
  className = ''
}) {
  // open state for popover
  const [open, setOpen] = useState(false);
  // search query
  const [query, setQuery] = useState('');
  // which option index currently keyboard focused (within filtered list)
  const [focusIndex, setFocusIndex] = useState(-1);

  const containerRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  // Optimize lookups by lowercasing query once
  const lowerQuery = query.trim().toLowerCase();
  const filtered = lowerQuery
    ? options.filter(o => o.toLowerCase().includes(lowerQuery))
    : options;

  const toggleOpen = () => setOpen(o => !o);

  // Ensure uniqueness & propagate controlled change
  const update = useCallback((next) => {
    const unique = Array.from(new Set(next));
    onChange(unique);
  }, [onChange]);

  const toggleValue = (val) => {
    if (values.includes(val)) {
      update(values.filter(v => v !== val));
    } else {
      update([...values, val]);
    }
  };

  const selectAll = () => update(options);
  const clearAll = () => update([]);

  // Close popover on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setOpen(false);
        setFocusIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard navigation bindings only when open
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (['ArrowDown','ArrowUp','Home','End','Enter',' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'Escape') { setOpen(false); setFocusIndex(-1); inputRef.current?.focus(); }
      if (e.key === 'ArrowDown') setFocusIndex(i => Math.min(filtered.length - 1, i + 1));
      if (e.key === 'ArrowUp') setFocusIndex(i => Math.max(0, i - 1));
      if (e.key === 'Home') setFocusIndex(0);
      if (e.key === 'End') setFocusIndex(filtered.length - 1);
      if (e.key === 'Enter' || e.key === ' ') {
        if (focusIndex >= 0 && focusIndex < filtered.length) toggleValue(filtered[focusIndex]);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, filtered, focusIndex, values]);

  // Ensure focused item visible during keyboard nav
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector(`[data-index="${focusIndex}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [focusIndex, open]);

  const hiddenLabelId = `${label.replace(/\s+/g,'-').toLowerCase()}-multiselect-label`;

  const tagValues = values.slice(0, maxTagCount);
  const overflow = values.length - tagValues.length;

  return (
    <div ref={containerRef} className={`ms-container ${open ? 'open' : ''} ${className}`}>
      <div className="ms-label" id={hiddenLabelId}>{label}</div>
      <button
        type="button"
        className="ms-control"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={hiddenLabelId}
        onClick={() => { toggleOpen(); if (!open) setTimeout(()=>inputRef.current?.focus(), 0); }}
      >
        <div className="ms-values">
          {values.length === 0 && <span className="ms-placeholder">{placeholder}</span>}
          {values.length > 0 && (
            <div className="ms-tags" aria-label={`${values.length} selected`}>
              {tagValues.map(v => (
                <span key={v} className="ms-tag" onClick={(e)=>{e.stopPropagation(); toggleValue(v);}}>
                  {v}<span className="ms-remove" aria-hidden>&times;</span>
                </span>
              ))}
              {overflow > 0 && <span className="ms-tag more">+{overflow}</span>}
            </div>
          )}
        </div>
        <span className="ms-arrow" aria-hidden>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="ms-popover">
          <div className="ms-search-row">
            <input
              ref={inputRef}
              className="ms-search"
              type="text"
              placeholder="Search..."
              value={query}
              onChange={e=>{setQuery(e.target.value); setFocusIndex(0);}}
            />
            {values.length > 0 && <button className="ms-clear-btn" type="button" onClick={clearAll} aria-label="Clear selection">✕</button>}
          </div>
          <ul className="ms-list" role="listbox" ref={listRef} aria-multiselectable="true">
            {filtered.length === 0 && <li className="ms-empty">No results</li>}
            {allowSelectAll && options.length > 0 && (
              <li
                className="ms-option select-all"
                onClick={selectAll}
                role="option"
                aria-selected={values.length === options.length}
                data-index={-1}
              >
                <input type="checkbox" readOnly checked={values.length === options.length} /> Select all
              </li>
            )}
            {filtered.map((opt, i) => {
              const selected = values.includes(opt);
              return (
                <li
                  key={opt}
                  data-index={i}
                  className={`ms-option ${selected ? 'selected' : ''} ${focusIndex===i?'focused':''}`}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={()=>setFocusIndex(i)}
                  onClick={()=>toggleValue(opt)}
                >
                  <input type="checkbox" readOnly tabIndex={-1} checked={selected} /> {opt}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
