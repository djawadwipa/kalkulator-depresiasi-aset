import type { AppPage } from '../App';

interface SidebarProps {
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
  pages: { id: AppPage; label: string; icon: string }[];
}

export function Sidebar({ activePage, setActivePage, pages }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="./assets/logo-horizontal.png" alt="Kalkulator Depresiasi Aset Perusahaan" />
      </div>
      <nav>
        {pages.map(page => (
          <button
            key={page.id}
            className={activePage === page.id ? 'active' : ''}
            onClick={() => setActivePage(page.id)}
          >
            <span>{page.icon}</span>
            {page.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <strong>Corporate Finance Tool</strong>
        <span>Offline • PWA • APK</span>
      </div>
    </aside>
  );
}
