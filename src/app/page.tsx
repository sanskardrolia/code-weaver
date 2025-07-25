
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, Gem, ImageIcon, Sparkles, Move3d } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <Palette className="h-8 w-8 text-primary" />,
    title: 'Color Your Code',
    description: 'Customize foreground and background colors with a picker or precise hex codes.',
  },
  {
    icon: <Gem className="h-8 w-8 text-primary" />,
    title: 'Style Everything',
    description: 'Choose from various dot and corner styles to match your brand aesthetic.',
  },
  {
    icon: <ImageIcon className="h-8 w-8 text-primary" />,
    title: 'Add Your Logo',
    description: 'Easily upload your own logo to be displayed in the center of the QR code.',
  },
  {
    icon: <Move3d className="h-8 w-8 text-primary" />,
    title: 'Interactive 3D Preview',
    description: 'An interactive 3D perspective effect that responds to your mouse movement.',
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: 'Instant Generation',
    description: 'See your QR code update in real-time as you type and customize.',
  },
  {
    icon: <Button variant="default">Download PNG</Button>,
    title: 'High-Quality Download',
    description: 'Download your final QR code as a high-quality PNG file, ready for print.',
  },
];


export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto grid grid-cols-1 items-center gap-12 px-8 py-16 lg:py-24">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
            Create Stunning QR Codes in Seconds
          </h1>
          <p className="mb-8 text-lg text-muted-foreground max-w-2xl">
            Weave your brand into a custom QR code. Free, deeply customizable, and ready to download instantly. No sign-up required.
          </p>
          <Button asChild size="lg">
            <Link href="/generator">Create Your QR Code Now</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16 lg:py-24">
        <div className="container mx-auto px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Why You'll Love Code Weaver</h2>
            <p className="mt-2 text-muted-foreground">
              All the features you need to make your QR code stand out.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="flex flex-col items-center text-center">
                <CardContent className="flex flex-col items-center gap-4 p-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
