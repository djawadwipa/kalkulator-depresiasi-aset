import type { ReactNode } from 'react';
import type { AppPage } from '../App';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
  pages: { id: AppPage; label: string; icon: string }[];
}

export function AppLayout({ children, activePage, setActivePage, pages }: AppLayoutProps) {
  const current = pages.find(page => page.id === activePage);
  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} setActivePage={setActivePage} pages={pages} />
      <main className="main-content">
        <Header title={current?.label ?? 'Dashboard'} activePage={activePage} setActivePage={setActivePage} />
        {children}
      </main>
      <MobileNav activePage={activePage} setActivePage={setActivePage} pages={pages} />
    </div>
  );
}
