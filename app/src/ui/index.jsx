import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Icon from './Icon.jsx';

export { Icon };

export function cx(...parts) { return parts.filter(Boolean).join(' '); }

export function Card({ pad = true, className, children, hi = false, ...rest }) {
  return <div className={cx('card', pad && 'card-p', hi && 'card-hi', className)} {...rest}>{children}</div>;
}

export function Button({ variant = 'ghost', size, icon, block, className, children, ...rest }) {
  return (
    <button type="button" className={cx('btn', `btn-${variant}`, size && `btn-${size}`, !children && icon && 'btn-icon', block && 'btn-block', className)} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} stroke={2.25} />}
      {children}
    </button>
  );
}

export function Seg({ value, onChange, options, className }) {
  return (
    <div className={cx('seg', className)} role="tablist">
      {options.map((o) => (
        <button key={o.value} type="button" role="tab" aria-selected={o.value === value} className={o.value === value ? 'on' : ''} onClick={() => onChange(o.value)}>
          {o.icon && <Icon name={o.icon} size={15} />}{o.label}
        </button>
      ))}
    </div>
  );
}

export function Bar({ value, target, color = 'var(--accent)', thin = false }) {
  const pct = target > 0 ? Math.max(0, Math.min(100, (value / target) * 100)) : 0;
  return <div className={cx('bar', thin && 'thin')}><i style={{ width: `${pct}%`, '--c': color }} /></div>;
}

export function Ring({ size = 120, stroke = 10, value, max, color = 'var(--accent)', children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const frac = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${c * frac} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: 'stroke-dasharray 0.3s' }} />
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  );
}

export function Stepper({ value, onChange, min = 1, max = 99, ariaLabel }) {
  return (
    <div className="stepper" aria-label={ariaLabel}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Fewer"><Icon name="minus" size={14} stroke={2.25} /></button>
      <span className="num">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="More"><Icon name="plus" size={14} stroke={2.25} /></button>
    </div>
  );
}

export function Toggle({ on, onChange, disabled, label }) {
  return (
    <button type="button" role="switch" aria-checked={!!on} aria-label={label} disabled={disabled} className={cx('toggle', on && 'on')} onClick={() => onChange(!on)}>
      <i />
    </button>
  );
}

export function SRow({ title, value, onClick, right, indent, children, danger }) {
  const body = (
    <>
      {children}
      <div className="srow-main">
        <div className={cx('srow-title', danger && 'danger')}>{title}</div>
        {value != null && value !== '' && <div className="srow-val">{value}</div>}
      </div>
      {right}
      {onClick && !right && <span className="chev"><Icon name="chevronRight" size={18} /></span>}
    </>
  );
  if (onClick) return <button type="button" className={cx('srow', indent && 'indent')} onClick={onClick}>{body}</button>;
  return <div className={cx('srow', indent && 'indent')}>{body}</div>;
}

export function Chip({ on = true, hi = false, icon, children, onClick, className }) {
  const cls = cx('chip', !on && 'off', hi && 'hi', className);
  if (onClick) return <button type="button" className={cls} onClick={onClick}>{icon && <Icon name={icon} size={13} stroke={2} />}{children}</button>;
  return <span className={cls}>{icon && <Icon name={icon} size={13} stroke={2} />}{children}</span>;
}

export function Tag({ children, style }) { return <span className="tag" style={style}>{children}</span>; }

export function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

export function Search({ value, onChange, placeholder = 'Search', autoFocus }) {
  return (
    <div className="search">
      <Icon name="search" size={18} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} inputMode="search" />
      {value && <button type="button" onClick={() => onChange('')} aria-label="Clear"><Icon name="x" size={16} /></button>}
    </div>
  );
}

export function Empty({ title, children, action }) {
  return (
    <div className="empty">
      {title && <div className="num" style={{ fontSize: 22 }}>{title}</div>}
      {children && <div className="small" style={{ maxWidth: 360, lineHeight: 1.45 }}>{children}</div>}
      {action}
    </div>
  );
}

// Bottom sheet on phones, centered modal on desktop. Closes on backdrop tap and Escape.
export function Sheet({ open, onClose, title, subtitle, children, footer, headRight }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="sheet-root" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}>
        <div className="sheet-grip" />
        {(title || headRight) && (
          <div className="sheet-head">
            <div className="grow">
              {title && <div className="sheet-title">{title}</div>}
              {subtitle && <div className="small muted" style={{ marginTop: 3 }}>{subtitle}</div>}
            </div>
            {headRight}
            <button type="button" className="icon-btn sm muted" onClick={onClose} aria-label="Close"><Icon name="x" size={18} /></button>
          </div>
        )}
        <div className="sheet-body">{children}</div>
        {footer && <div className="sheet-foot">{footer}</div>}
      </div>
    </div>
  );
}

// ---------- toast ----------
const ToastCtx = createContext(() => {});
export function useToast() { return useContext(ToastCtx); }

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const show = useCallback((message, opts = {}) => {
    clearTimeout(timer.current);
    setToast({ message, kind: opts.kind || 'info', id: Date.now() });
    timer.current = setTimeout(() => setToast(null), opts.duration || (opts.kind === 'warn' ? 6000 : 2500));
  }, []);
  const value = useMemo(() => show, [show]);
  return (
    <ToastCtx.Provider value={value}>
      {children}
      {toast && (
        <div className={cx('toast', toast.kind)} role="status">
          {toast.kind === 'warn' && <Icon name="alert" size={18} style={{ color: 'var(--warn)', flex: '0 0 auto' }} />}
          {toast.kind === 'ok' && <Icon name="checkCircle" size={18} style={{ color: 'var(--good)', flex: '0 0 auto' }} />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss" style={{ color: 'var(--muted)', display: 'flex' }}><Icon name="x" size={16} /></button>
        </div>
      )}
    </ToastCtx.Provider>
  );
}

// Simple confirm sheet
export function Confirm({ open, onClose, title, body, confirmLabel = 'Confirm', danger = false, onConfirm }) {
  return (
    <Sheet open={open} onClose={onClose} title={title} footer={
      <>
        <Button block onClick={onClose}>Cancel</Button>
        <Button block variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
      </>
    }>
      {body && <div className="small muted" style={{ lineHeight: 1.45 }}>{body}</div>}
    </Sheet>
  );
}
