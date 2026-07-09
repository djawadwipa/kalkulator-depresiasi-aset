import type { AppPage, ThemeMode } from '../App';

interface HeaderProps {
  title: string;
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
}

export function Header({ title, setActivePage, theme, toggleTheme }: HeaderProps) {
  return (
    <header className="app-header">
      <button className="logo-button" onClick={() => setActivePage('dashboard')} aria-label="Kembali ke dashboard">
        <img src="./assets/icon-square.png" alt="Ikon aplikasi" />
      </button>
      <div className="header-title">
        <p>Kalkulator Depresiasi Aset Perusahaan</p>
        <h1>{title}</h1>
      </div>
      <button className="theme-toggle no-print" onClick={toggleTheme} aria-label="Ubah dark mode">
        <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
        <b>{theme === 'dark' ? 'Light' : 'Dark'}</b>
      </button>
    </header>
  );
}
