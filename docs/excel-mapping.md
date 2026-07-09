# Mapping Excel ke Aplikasi

Workbook sumber: **Kalkulator Depresiasi Aset Perusahaan.xlsx**

Sheet yang dipetakan ke aplikasi:

1. Dashboard → `src/pages/Dashboard.tsx`
2. Input Data Aset → `src/pages/InputDataAset.tsx`
3. Kalkulator Depresiasi → `src/pages/KalkulatorDepresiasi.tsx`
4. Jadwal Depresiasi Bulanan → `src/pages/JadwalBulanan.tsx`
5. Jadwal Depresiasi Tahunan → `src/pages/JadwalTahunan.tsx`
6. Register Aset → `src/pages/RegisterAset.tsx`
7. Analisis Nilai Buku → `src/pages/AnalisisNilaiBuku.tsx`
8. Master Data → `src/pages/MasterData.tsx`
9. Panduan Penggunaan → `src/pages/PanduanPenggunaan.tsx`

Rumus utama berada di:

```text
src/utils/depreciation.ts
```

Data contoh dari Excel berada di:

```text
src/data/sampleAssets.ts
```

Master data dari Excel berada di:

```text
src/data/masterData.ts
```
