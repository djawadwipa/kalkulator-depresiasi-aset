import type { AppPage } from '../App';

interface HeaderProps {
  title: string;
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
}

export function Header({ title, setActivePage }: HeaderProps) {
  return (
    <header className="app-header">
      <button className="logo-button" onClick={() => setActivePage('dashboard')} aria-label="Kembali ke dashboard">
        <img src="./assets/icon-square.png" alt="Ikon aplikasi" />
      </button>
      <div>
        <p>Kalkulator Depresiasi Aset Perusahaan</p>
        <h1>{title}</h1>
      </div>
    </header>
  );
}
