// Inline SVG icon set (24 viewBox, stroked with currentColor). Never emoji.
const PATHS = {
  today: <><circle cx="12" cy="12" r="9" /><path d="M12 12l4-4" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /></>,
  fuel: <><path d="M4 11h16a8 8 0 0 1-16 0z" /><path d="M9 7l1-3M14 7l1-3" /></>,
  train: <path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12" />,
  body: <><path d="M3 17l5-5 4 4 8-8" /><path d="M14 8h6v6" /></>,
  more: <g fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></g>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></>,
  check: <path d="M5 12l4 4L19 7" />,
  checkCircle: <><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></>,
  swap: <><path d="M7 16V4M7 4L3 8M7 4l4 4" /><path d="M17 8v12M17 20l4-4M17 20l-4-4" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  chevronLeft: <path d="M15 6l-6 6 6 6" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  chevronUp: <path d="M6 15l6-6 6 6" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  monitor: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>,
  pot: <><path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" /><path d="M2 10h20M9 6l1-2M14 6l1-2" /></>,
  timer: <><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2M9 2h6" /></>,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  star: <path d="M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.8 6.1 21l1.2-6.5L2.5 9.9 9.1 9z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  download: <path d="M12 4v12M12 16l-4-4M12 16l4-4M4 20h16" />,
  upload: <path d="M12 16V4M12 4L8 8M12 4l4 4M4 20h16" />,
  copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></>,
  refresh: <path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6" />,
  calendar: <><rect x="3" y="4" width="18" height="17" rx="3" /><path d="M3 9h18M8 2v4M16 2v4" /></>,
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  book: <path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z" />,
  clipboard: <><rect x="5" y="5" width="14" height="16" rx="2" /><path d="M9 3h6v4H9zM9 12h6M9 16h4" /></>,
  heart: <path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z" />,
  bell: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4" />,
  shake: <path d="M9 2h6v3h1v4l-1 2v10H9V11L8 9V5h1z" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M12 11v5" /></>,
  alert: <path d="M12 3l10 18H2zM12 10v4M12 17h.01" />,
  edit: <path d="M4 20h4l10-10-4-4L4 16zM13 6l4 4" />,
  cart: <><path d="M3 4h2l2.5 11h11L21 7H6" /><circle cx="9" cy="19" r="1.5" /><circle cx="17" cy="19" r="1.5" /></>,
  scale: <><path d="M12 3v18M5 7h14" /><path d="M3 13l3-6 3 6a3 3 0 0 1-6 0zM15 13l3-6 3 6a3 3 0 0 1-6 0z" /></>,
  bookmark: <path d="M6 3h12v18l-6-4-6 4z" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />,
  flame: <path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z" />,
  sleep: <path d="M4 10h5l-5 6h5M13 4h4l-4 5h4M16 14a5 5 0 1 0 5 5" />,
  steps: <path d="M8 3c2 0 3 2 3 5s-1 4-3 4-3-1-3-4 1-5 3-5zM8 14c2 0 3 1 3 3s-1 4-3 4-3-2-3-4 1-3 3-3M16 6c2 0 3 2 3 5s-1 4-3 4-3-1-3-4 1-5 3-5z" />,
};

export default function Icon({ name, size = 22, stroke = 1.75, className, style, fill = false }) {
  const body = PATHS[name];
  if (!body) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      {body}
    </svg>
  );
}
