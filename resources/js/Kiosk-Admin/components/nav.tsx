import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { typography } from '@/Kiosk/utils/typography';
import { useAuthorization } from '@/Kiosk-Admin/hooks/auth/useAuthorization';

interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge: string | null;
  permission?: string | string[];
  adminOnly?: boolean;
  superAdminOnly?: boolean;
}

interface NavSection {
  label: string | null;
  items: NavItem[];
}

interface Props {
  children: React.ReactNode; 
  auth?: {
    user?: { 
      name: string;
      role?: string;
    };
  };
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: null,
    items: [
      { icon: '📦', label: 'Products', href: route('products'), badge: null, permission: 'manage products' },
      { icon: '⊞', label: 'Category', href: route('categories'), badge: null, permission: 'manage categories' },
      { icon: '🏷️', label: 'Sub Category', href: route('sub-categories'), badge: null, permission: 'manage sub categories' },
      { icon: '🔄', label: 'Variations', href: route('variations'), badge: null, permission: 'manage variations' },
    ],
  },
  {
    label: ' 🛠️ Maintenance',
    items: [
      { icon: '🎨', label: 'Logo Settings', href: route('logos'), badge: null, superAdminOnly: true },
      { icon: '🎬', label: 'Ads Management', href: route('ads'), badge: null, permission: 'manage ads' },
      { icon: '🌙', label: 'Timer', href: route('screen-saver'), badge: null, adminOnly: true },
      { icon: '👥', label: 'Users', href: route('users'), badge: null, adminOnly: true },
    ],
  },
  {
    label: 'Reports',
    items: [
      { icon: '📅', label: 'User Log', href: route('activity-log'), badge: null, adminOnly: true },
    ],
  },
];

// const SHORTCUTS = [
//   { icon: '📬', label: 'Gmail' },
//   { icon: '🐙', label: 'GitHub' },
//   { icon: '🤖', label: 'ChatGPT' },
//   { icon: '🍊', label: 'Stack' },
// ];

export default function SideNavDrawer({ children, auth }: Props) {
  const [open, setOpen] = useState(true);
  const { canAccess } = useAuthorization();
  const { url, props } = usePage<any>();
  const appLogo = props?.app?.logo ?? null;

  const userName = auth?.user?.name ?? 'User';
  const userRole = auth?.user?.role ?? 'Admin';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const isActive = (href: string) =>
    href === '/dashboard' ? url === href : url.startsWith(href);

  const handleLogout = () => {
    router.post(route('logout'));
  };

  const filteredSections = NAV_SECTIONS
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        canAccess({
          permission: item.permission,
          adminOnly: item.adminOnly,
          superAdminOnly: item.superAdminOnly,
        }),
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: '#0d0d0f',
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        overflow: 'hidden',
      }}
    >
      <aside
        style={{
          width: open ? 260 : 64,
          minWidth: open ? 260 : 64,
          background: '#111114',
          borderRight: '1px solid #1e1e24',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.32s cubic-bezier(0.4,0,0.2,1), min-width 0.32s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'visible',
          position: 'relative',
          zIndex: 20,
        }}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          title={open ? 'Collapse' : 'Expand'}
          style={{
            position: 'absolute',
            top: 18,
            right: -14,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#1e1e2e',
            border: '1px solid #2e2e3e',
            color: '#aaa',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            zIndex: 30,
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
            transition: 'background 0.15s, color 0.15s, transform 0.32s cubic-bezier(0.4,0,0.2,1)',
            transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#6c63ff';
            (e.currentTarget as HTMLButtonElement).style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#1e1e2e';
            (e.currentTarget as HTMLButtonElement).style.color = '#aaa';
          }}
        >
          ◀
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '18px 14px 14px',
            borderBottom: '1px solid #1e1e24',
            minHeight: 60,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: appLogo ? 'transparent' : 'linear-gradient(135deg, #5d56ddff, #dadedfff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              flexShrink: 0,
              overflow: 'hidden',
              boxShadow: '0 0 12px rgba(108,99,255,0.35)',
            }}
          >
            {appLogo ? (
              <img
                src={appLogo}
                alt="App Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              '📦'
            )}
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: '#f0f0f5',
              letterSpacing: '-0.3px',
              opacity: open ? 1 : 0,
              transform: open ? 'translateX(0)' : 'translateX(-8px)',
              transition: 'opacity 0.22s, transform 0.22s',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            ALTURAS
          </span>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'clip', padding: '6px 0' }}>
          {filteredSections.map((section, si) => (
            <div key={si} style={{ marginBottom: 4 }}>
              {section.label && open && (
                <div
                  style={{
                    ...typography.navigationBarLabel,
                    padding: '10px 18px 4px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {section.label}
                </div>
              )}
              {!section.label && si > 0 && (
                <div style={{ height: 1, background: '#1e1e24', margin: '6px 10px' }} />
              )}

              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    title={!open ? item.label : undefined}
                    onClick={() => {
                      if (isActive(item.href)) {
                        router.reload();
                      }
                    }}
                    style={{
                      ...typography.navigationBartext,
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: open ? '9px 14px' : '9px 0',
                      justifyContent: open ? 'flex-start' : 'center',
                      background: active
                        ? 'linear-gradient(90deg, #6c63ff18, #3ec6e010)'
                        : 'transparent',
                      borderLeft: active ? '2px solid #6c63ff' : '2px solid transparent',
                      borderRight: 'none',
                      borderTop: 'none',
                      borderBottom: 'none',
                      borderRadius: '0 8px 8px 0',
                      color:   '#f1f1f1ff',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      textDecoration: 'none',
                      transition: 'all 0.15s',
                      boxSizing: 'border-box',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.background = '#18181e';
                        (e.currentTarget as HTMLAnchorElement).style.color = '#f5f5f5ff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                        (e.currentTarget as HTMLAnchorElement).style.color = '#ccccccff';
                      }
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        flexShrink: 0,
                        filter: active ? 'none' : 'grayscale(40%)',
                        transition: 'filter 0.15s',
                      }}
                    >
                      {item.icon}
                    </span>
                    <span
                      style={{
                        opacity: open ? 1 : 0,
                        maxWidth: open ? 160 : 0,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        transition: 'opacity 0.2s, max-width 0.28s',
                        flex: 1,
                        textAlign: 'left',
                      }}
                    >
                      {item.label}
                    </span>
                    {item.badge && open && (
                      <span
                        style={{
                          background: active ? '#6c63ff' : '#2a2a35',
                          color: active ? '#fff' : '#888',
                          fontSize: 10,
                          fontWeight: 700,
                          borderRadius: 20,
                          padding: '1px 7px',
                          flexShrink: 0,
                          transition: 'background 0.15s',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* {open && (
          <div style={{ borderTop: '1px solid #1e1e24', padding: '14px 14px 10px' }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#444',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              Quick Access
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SHORTCUTS.map((s) => (
                <button
                  key={s.label}
                  title={s.label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: '#1a1a22',
                    border: '1px solid #2a2a35',
                    cursor: 'pointer',
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#252535';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#6c63ff55';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#1a1a22';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a35';
                  }}
                >
                  {s.icon}
                </button>
              ))}
              <button
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#1a1a22',
                  border: '1px dashed #2a2a35',
                  cursor: 'pointer',
                  fontSize: 18,
                  color: '#444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#252535';
                  (e.currentTarget as HTMLButtonElement).style.color = '#888';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#1a1a22';
                  (e.currentTarget as HTMLButtonElement).style.color = '#444';
                }}
              >
                +
              </button>
            </div>
          </div>
        )} */}

        <div
          style={{
            borderTop: '1px solid #1e1e24',
            padding: '12px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6c63ff, #3ec6e0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              flexShrink: 0,
              color: '#fff',
              fontWeight: 700,
            }}
          >
            {initials}
          </div>
          <div
            style={{
              opacity: open ? 1 : 0,
              maxWidth: open ? 160 : 0,
              overflow: 'hidden',
              transition: 'opacity 0.2s, max-width 0.28s',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: '#ddd' }}>{userName}</div>
            <div style={{ fontSize: 11, color: '#555' }}>{userRole}</div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            style={{
              border: '1px solid #2a2a35',
              background: '#1a1a22',
              color: '#ddd',
              borderRadius: 8,
              padding: open ? '8px 12px' : '8px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: open ? 88 : 36,
              flexShrink: 0,
              transition: 'background 0.15s, border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#252535';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#6c63ff55';
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#1a1a22';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a35';
              (e.currentTarget as HTMLButtonElement).style.color = '#ddd';
            }}
          >
            {open ? 'Log Out' : '↪'}
          </button>
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          background: '#0d0d0f',
        }}
      >
        {children}
      </main>
    </div>
  );
}
