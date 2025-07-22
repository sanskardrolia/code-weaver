import { QrGeneratorCard } from '@/components/qr-generator-card';

export default function Home() {
  return (
    <div className="container flex flex-1 flex-col items-center justify-center py-8 md:py-12">
      <QrGeneratorCard />
      <p className="mt-8 text-center text-sm text-muted-foreground">
        made with ❤️ for you guys by{' '}
        <a
          href="https://www.linkedin.com/in/sanskardrolia"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-4"
        >
          Sanskar
        </a>
      </p>
    </div>
  );
}
