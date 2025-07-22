import { QrGeneratorCard } from '@/components/qr-generator-card';

export default function Home() {
  return (
    <div className="container flex flex-1 flex-col items-center justify-center py-8 md:py-12">
      <QrGeneratorCard />
    </div>
  );
}
