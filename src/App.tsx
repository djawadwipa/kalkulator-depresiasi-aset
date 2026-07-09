import { AppLayout } from './components/AppLayout';
import { useAssetStore } from './store/assetStore';
import { AnalisisNilaiBuku } from './pages/AnalisisNilaiBuku';
import { Dashboard } from './pages/Dashboard';
import { InputDataAset } from './pages/InputDataAset';
import { JadwalBulanan } from './pages/JadwalBulanan';
import { JadwalTahunan } from './pages/JadwalTahunan';
import { KalkulatorDepresiasi } from './pages/KalkulatorDepresiasi';
import { MasterData } from './pages/MasterData';
import { PanduanPenggunaan } from './pages/PanduanPenggunaan';
import { RegisterAset } from './pages/RegisterAset';
import { useState } from 'react';

export type AppPage =
  | 'dashboard'
  | 'input'
  | 'calculator'
  | 'monthly'
  | 'annual'
  | 'register'
  | 'analysis'
  | 'master'
  | 'guide';

export const pages: { id: AppPage; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'input', label: 'Input Data Aset', icon: '📝' },
  { id: 'calculator', label: 'Kalkulator Depresiasi', icon: '🧮' },
  { id: 'monthly', label: 'Jadwal Bulanan', icon: '📅' },
  { id: 'annual', label: 'Jadwal Tahunan', icon: '📈' },
  { id: 'register', label: 'Register Aset', icon: '🏷️' },
  { id: 'analysis', label: 'Analisis Nilai Buku', icon: '🔎' },
  { id: 'master', label: 'Master Data', icon: '⚙️' },
  { id: 'guide', label: 'Panduan Penggunaan', icon: '📘' }
];

export default function App() {
  const [activePage, setActivePage] = useState<AppPage>('dashboard');
  const store = useAssetStore();

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard assets={store.assets} />;
      case 'input': return <InputDataAset {...store} />;
      case 'calculator': return <KalkulatorDepresiasi assets={store.assets} />;
      case 'monthly': return <JadwalBulanan assets={store.assets} />;
      case 'annual': return <JadwalTahunan assets={store.assets} />;
      case 'register': return <RegisterAset assets={store.assets} />;
      case 'analysis': return <AnalisisNilaiBuku assets={store.assets} />;
      case 'master': return <MasterData />;
      case 'guide': return <PanduanPenggunaan />;
      default: return <Dashboard assets={store.assets} />;
    }
  };

  return (
    <AppLayout activePage={activePage} setActivePage={setActivePage} pages={pages}>
      {renderPage()}
    </AppLayout>
  );
}
