import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface NavLinkItem {
  to: string;
  label: string;
}

interface NavDropdownProps {
  label: string;
  links: NavLinkItem[];
}

export default function NavDropdown({ label, links }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  const groupActive = links.some(
    (l) => pathname === l.to || pathname.startsWith(`${l.to}/`)
  );

  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${
          groupActive
            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'text-gray-600 hover:bg-gray-50 hover:text-green-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-green-400'
        }`}
      >
        {label}
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`text-gray-400 motion-safe:transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 z-50 mt-1 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm transition-colors focus-visible:bg-gray-50 focus-visible:outline-none dark:focus-visible:bg-gray-700/50 ${
                  isActive
                    ? 'bg-green-50 font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50'
                }`
              }
            >
              {({ isActive }) => (
                <span aria-current={isActive ? 'page' : undefined}>
                  {l.label}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
