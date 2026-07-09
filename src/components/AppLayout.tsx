import type { ReactNode } from 'react';
import type { AppPage, ThemeMode } from '../App';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
  pages: { id: AppPage; label: string; icon: string }[];
  theme: ThemeMode;
  toggleTheme: () => void;
}

export function AppLayout({ children, activePage, setActivePage, pages, theme, toggleTheme }: AppLayoutProps) {
  const current = pages.find(page => page.id === activePage);
  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} setActivePage={setActivePage} pages={pages} theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content">
        <Header title={current?.label ?? 'Dashboard'} activePage={activePage} setActivePage={setActivePage} theme={theme} toggleTheme={toggleTheme} />
        {children}
      </main>
      <MobileNav activePage={activePage} setActivePage={setActivePage} pages={pages} />
    </div>
  );
}
