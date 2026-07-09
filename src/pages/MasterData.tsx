import { DataTable } from '../components/DataTable';
import { PrintHeader } from '../components/PrintHeader';
import { categories, departments, depreciationMethods, parameters, pics, statusDescriptions, statuses } from '../data/masterData';
import { printReport } from '../utils/exportPrint';
import { numberId, percent, rupiah } from '../utils/formatters';

export function MasterData() {
  const maxRows = Math.max(categories.length, departments.length, statuses.length, depreciationMethods.length, pics.length);
  const rows = Array.from({ length: maxRows }).map((_, idx) => [
    categories[idx] ?? '',
    departments[idx] ?? '',
    statuses[idx] ?? '',
    depreciationMethods[idx] ?? '',
    pics[idx] ?? ''
  ]);

  return (
    <div className="page-stack printable-area">
      <PrintHeader title="Master Data Referensi" />
      <section className="section-heading">
        <div>
          <h2>Master Data Referensi</h2>
          <p>Dropdown, parameter indikator warna, dan daftar referensi untuk workbook depresiasi aset.</p>
        </div>
        <div className="actions no-print">
          <button className="btn primary" onClick={() => printReport('Master Data Referensi')}>Cetak Master Data</button>
        </div>
      </section>

      <DataTable headers={['Kategori Aset', 'Departemen', 'Status Aset', 'Metode Depresiasi', 'Daftar PIC']} rows={rows} />

      <section className="split-section">
        <div>
          <h3>Parameter Indikator</h3>
          <DataTable
            headers={['Parameter', 'Nilai']}
            rows={[
              ['Ambang Aset Bernilai Tinggi', rupiah(parameters.highValueThreshold)],
              ['Rasio Mendekati Habis Umur Ekonomis', percent(parameters.nearingEndRatio)],
              ['Rasio Sehat Maksimum', percent(parameters.healthyMaxRatio)],
              ['Maksimum Bulan Jadwal', numberId(parameters.maxMonthlySchedule)],
              ['Maksimum Tahun Jadwal', numberId(parameters.maxAnnualSchedule)]
            ]}
          />
        </div>
        <div>
          <h3>Format Status Depresiasi</h3>
          <DataTable
            headers={['Status', 'Keterangan']}
            rows={statusDescriptions.map(row => [row.status, row.description])}
          />
        </div>
      </section>
    </div>
  );
}
