'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function QrGeneratorCard() {
  const [inputValue, setInputValue] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!inputValue.trim()) {
      toast({
        title: 'Input required',
        description: 'Please enter text or a URL to generate a QR code.',
        variant: 'destructive',
      });
      return;
    }
    setIsGenerating(true);
    setQrCodeUrl(''); // Clear previous QR code
    // Using timeout to give feedback to the user on click
    setTimeout(() => {
      const encodedValue = encodeURIComponent(inputValue);
      setQrCodeUrl(
        `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodedValue}&qzone=1`
      );
      setIsGenerating(false);
    }, 500);
  };

  const handleDownload = async () => {
    if (!qrCodeUrl) return;
    setIsDownloading(true);

    try {
      const highResUrl = qrCodeUrl.replace('size=256x256', 'size=1024x1024');
      const response = await fetch(highResUrl);
      if (!response.ok) throw new Error('Failed to fetch QR code image.');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Could not download the QR code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleImageLoad = () => {
    // You could add logic here if needed when the image successfully loads
  };

  const handleImageError = () => {
    setIsGenerating(false);
    toast({
        title: 'Error',
        description: 'Failed to generate QR code. The API might be down.',
        variant: 'destructive',
    });
  }

  return (
    <Card className="w-full max-w-md shadow-2xl shadow-primary/10">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">QR Code Weaver</CardTitle>
        <CardDescription>
          Enter text or a URL below to weave your digital code.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="qr-input">Text or URL</Label>
          <div className="flex gap-2">
            <Input
              id="qr-input"
              placeholder="e.g., https://example.com"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              disabled={isGenerating}
            />
            <Button onClick={handleGenerate} disabled={isGenerating || !inputValue}>
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Weave'
              )}
            </Button>
          </div>
        </div>

        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed bg-muted/50 p-4">
          {qrCodeUrl && !isGenerating && (
            <div className="rounded-md bg-white p-2 shadow-sm">
                <Image
                src={qrCodeUrl}
                alt="Generated QR Code"
                width={220}
                height={220}
                className="transition-opacity duration-300 opacity-0"
                onLoadingComplete={(image) => image.classList.remove('opacity-0')}
                onLoad={handleImageLoad}
                onError={handleImageError}
                />
            </div>
          )}
          {isGenerating && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
          {!qrCodeUrl && !isGenerating && (
            <div className="text-center text-sm text-muted-foreground">
              Your QR code will appear here.
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleDownload}
          variant="outline"
          className="w-full"
          disabled={!qrCodeUrl || isGenerating || isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Download PNG
        </Button>
      </CardFooter>
    </Card>
  );
}
