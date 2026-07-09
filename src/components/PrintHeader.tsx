interface PrintHeaderProps {
  title: string;
}

export function PrintHeader({ title }: PrintHeaderProps) {
  return (
    <div className="print-header">
      <img src="./assets/logo-horizontal.png" alt="Kalkulator Depresiasi Aset Perusahaan" />
      <div>
        <h2>{title}</h2>
        <p>Dicetak pada {new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(new Date())}</p>
      </div>
    </div>
  );
}
