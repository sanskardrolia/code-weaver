'use client';

import { useState, useEffect } from 'react';
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
import { cn } from '@/lib/utils';

const QrCodeAnimation = ({ onAnimationComplete }: { onAnimationComplete: () => void }) => {
    const [grid, setGrid] = useState<boolean[][]>([]);
  
    useEffect(() => {
      const size = 11; // Creates an 11x11 grid
      const newGrid = Array(size)
        .fill(null)
        .map(() => Array(size).fill(false));
      setGrid(newGrid);
  
      const shuffledIndices: { row: number; col: number }[] = [];
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          shuffledIndices.push({ row: i, col: j });
        }
      }
  
      for (let i = shuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
      }
  
      let index = 0;
      const interval = setInterval(() => {
        if (index < shuffledIndices.length) {
          const { row, col } = shuffledIndices[index];
          setGrid((prevGrid) => {
            const nextGrid = prevGrid.map(r => [...r]);
            nextGrid[row][col] = Math.random() > 0.4;
            return nextGrid;
          });
          index++;
        } else {
          clearInterval(interval);
          onAnimationComplete();
        }
      }, 10);
  
      return () => clearInterval(interval);
    }, [onAnimationComplete]);
  
    return (
      <div className="grid grid-cols-11 gap-[2px] w-[220px] h-[220px] bg-muted/50 p-2">
        {grid.flat().map((isFilled, i) => (
          <div
            key={i}
            className={cn(
              'w-full h-full transition-colors duration-200',
              isFilled ? 'bg-primary' : 'bg-muted/60'
            )}
          />
        ))}
      </div>
    );
  };
  

export function QrGeneratorCard() {
  const [inputValue, setInputValue] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showQrImage, setShowQrImage] = useState(false);
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
    setShowAnimation(true);
    setShowQrImage(false);
    setQrCodeUrl(''); // Clear previous QR code

    const encodedValue = encodeURIComponent(inputValue);
    // Pre-fetch the image but don't show it yet
    const highResUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodedValue}&qzone=1`;
    const img = new window.Image();
    img.src = highResUrl;
    img.onload = () => {
        setQrCodeUrl(highResUrl);
    };
    img.onerror = () => {
        setIsGenerating(false);
        setShowAnimation(false);
        toast({
            title: 'Error',
            description: 'Failed to generate QR code. The API might be down.',
            variant: 'destructive',
        });
    }
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    if(qrCodeUrl) {
        setShowQrImage(true);
        setIsGenerating(false);
    }
  }

  const handleDownload = async () => {
    if (!qrCodeUrl) return;
    setIsDownloading(true);

    try {
      const highResDownloadUrl = qrCodeUrl.replace('size=256x256', 'size=1024x1024');
      const response = await fetch(highResDownloadUrl);
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
          {showAnimation && <QrCodeAnimation onAnimationComplete={handleAnimationComplete} />}

          {showQrImage && qrCodeUrl && (
            <div className="rounded-md bg-white p-2 shadow-sm">
                <Image
                src={qrCodeUrl}
                alt="Generated QR Code"
                width={220}
                height={220}
                className="transition-opacity duration-300 opacity-0"
                onLoadingComplete={(image) => {
                    image.classList.remove('opacity-0');
                    setIsGenerating(false);
                }}
                />
            </div>
          )}

          {!isGenerating && !showAnimation && !showQrImage && (
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
