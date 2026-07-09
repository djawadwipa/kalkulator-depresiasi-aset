import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function isNativeApp(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function datedFilename(filename: string): string {
  const dot = filename.lastIndexOf('.');
  const stamp = new Date().toISOString().slice(0, 10);
  if (dot === -1) return `${filename}-${stamp}`;
  return `${filename.slice(0, dot)}-${stamp}${filename.slice(dot)}`;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function textToBase64(text: string): string {
  return bytesToBase64(new TextEncoder().encode(text));
}

function downloadBlob(filename: string, content: BlobPart, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

async function saveBase64File(filename: string, base64Data: string, mimeType: string, title: string): Promise<void> {
  const safeName = sanitizeFilename(filename);

  if (isNativeApp()) {
    try {
      const result = await Filesystem.writeFile({
        path: safeName,
        data: base64Data,
        directory: Directory.Cache,
        recursive: true
      });

      const canShare = await Share.canShare().catch(() => ({ value: false }));
      if (canShare.value) {
        await Share.share({
          title,
          text: `${title} berhasil dibuat: ${safeName}`,
          url: result.uri,
          dialogTitle: `Simpan atau bagikan ${safeName}`
        });
      } else {
        alert(`${title} berhasil dibuat di cache aplikasi: ${safeName}`);
      }
      return;
    } catch (error) {
      console.error('Native save/share failed:', error);
      alert(`Gagal membuat file di APK. Aplikasi akan mencoba mode unduhan browser. Detail: ${String(error)}`);
    }
  }

  if (mimeType.includes('csv') || mimeType.includes('json') || mimeType.includes('text')) {
    const decoded = decodeURIComponent(escape(atob(base64Data)));
    downloadBlob(safeName, decoded, mimeType);
  } else {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i += 1) byteNumbers[i] = byteCharacters.charCodeAt(i);
    downloadBlob(safeName, new Uint8Array(byteNumbers), mimeType);
  }
}

export async function exportToCSV(filename: string, rows: Record<string, unknown>[]): Promise<void> {
  if (!rows.length) {
    alert('Tidak ada data untuk diexport.');
    return;
  }

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map(row =>
      headers
        .map(header => {
          const value = row[header] ?? '';
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(',')
    )
  ].join('\n');

  // BOM membuat file CSV langsung rapi saat dibuka di Excel Indonesia.
  await saveBase64File(datedFilename(filename), textToBase64(`\uFEFF${csv}`), 'text/csv;charset=utf-8;', 'Export CSV');
}

export async function exportToJSON(filename: string, data: unknown): Promise<void> {
  await saveBase64File(datedFilename(filename), textToBase64(JSON.stringify(data, null, 2)), 'application/json;charset=utf-8;', 'Backup JSON');
}

function preparePrintableClone(title: string): HTMLElement {
  const source = document.querySelector('.printable-area') as HTMLElement | null;
  const target = source ?? document.body;
  const clone = target.cloneNode(true) as HTMLElement;

  clone.querySelectorAll('.no-print, .mobile-nav, .modal-backdrop').forEach(element => element.remove());
  clone.querySelectorAll('.print-header').forEach(element => {
    const item = element as HTMLElement;
    item.style.display = 'flex';
    item.style.gap = '14px';
    item.style.alignItems = 'center';
    item.style.marginBottom = '14px';
    item.style.borderBottom = '2px solid #061B3A';
    item.style.paddingBottom = '12px';
  });

  const host = document.createElement('div');
  host.className = 'pdf-export-host';
  host.style.cssText = [
    'position:fixed',
    'left:-12000px',
    'top:0',
    'width:1100px',
    'padding:28px',
    'background:#FFFFFF',
    'color:#0F172A',
    '--navy:#061B3A',
    '--navy-2:#082A5A',
    '--teal:#008D84',
    '--gold:#F5A623',
    '--red:#B91C1C',
    '--slate:#64748B',
    '--bg:#FFFFFF',
    '--card:#FFFFFF',
    '--line:#CBD5E1',
    '--text:#0F172A',
    '--heading:#061B3A'
  ].join(';');

  const reportTitle = document.createElement('div');
  reportTitle.style.cssText = 'font-weight:900;font-size:18px;color:#061B3A;margin-bottom:12px;';
  reportTitle.textContent = title;
  host.appendChild(reportTitle);
  host.appendChild(clone);
  return host;
}

async function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(images.map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise<void>(resolve => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
  }));
}

async function exportPrintableAreaToPDF(title: string): Promise<void> {
  const host = preparePrintableClone(title);
  document.body.appendChild(host);

  try {
    await waitForImages(host);
    const canvas = await html2canvas(host, {
      backgroundColor: '#FFFFFF',
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 1100
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/png');

    let heightLeft = imgHeight;
    let position = margin;
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight - margin * 2;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight - margin * 2;
    }

    const bytes = new Uint8Array(pdf.output('arraybuffer'));
    await saveBase64File(`${sanitizeFilename(title)}.pdf`, bytesToBase64(bytes), 'application/pdf', 'Cetak PDF');
  } finally {
    host.remove();
  }
}

export async function printReport(title: string): Promise<void> {
  const original = document.title;
  document.title = title;

  try {
    if (isNativeApp()) {
      await exportPrintableAreaToPDF(title);
    } else {
      window.print();
    }
  } catch (error) {
    console.error('Print/export PDF failed:', error);
    alert(`Gagal membuat laporan PDF: ${String(error)}`);
  } finally {
    setTimeout(() => {
      document.title = original;
    }, 500);
  }
}
