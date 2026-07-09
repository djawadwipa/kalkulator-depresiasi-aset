import type { AppPage } from '../App';

interface MobileNavProps {
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
  pages: { id: AppPage; label: string; icon: string }[];
}

const mobilePages: AppPage[] = ['dashboard', 'input', 'calculator', 'register', 'analysis'];

export function MobileNav({ activePage, setActivePage, pages }: MobileNavProps) {
  return (
    <nav className="mobile-nav">
      {pages.filter(page => mobilePages.includes(page.id)).map(page => (
        <button key={page.id} className={activePage === page.id ? 'active' : ''} onClick={() => setActivePage(page.id)}>
          <span>{page.icon}</span>
          <small>{page.label.split(' ')[0]}</small>
        </button>
      ))}
    </nav>
  );
}
