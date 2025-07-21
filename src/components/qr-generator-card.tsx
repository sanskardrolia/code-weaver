'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type QRCodeStyling from 'qr-code-styling';
import type { DotType, CornerSquareType } from 'qr-code-styling';

// Dynamically import QRCodeStyling only on the client side
const QRCodeStylingClient =
  typeof window !== 'undefined' ? require('qr-code-styling') : null;

const colorOptions = [
  { name: 'Black', value: '#000000' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Crimson', value: '#dc2626' },
  { name: 'Amber', value: '#f59e0b' },
];

const dotStyleOptions: {name: string, value: DotType}[] = [
    { name: 'Square', value: 'square'},
    { name: 'Dots', value: 'dots'},
    { name: 'Rounded', value: 'rounded'},
    { name: 'Extra Rounded', value: 'extra-rounded'},
    { name: 'Classy', value: 'classy'},
    { name: 'Classy Rounded', value: 'classy-rounded'},
];

const cornerStyleOptions: {name: string, value: CornerSquareType}[] = [
    { name: 'Square', value: 'square'},
    { name: 'Dot', value: 'dot'},
    { name: 'Extra Rounded', value: 'extra-rounded'},
];

export function QrGeneratorCard() {
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Styling options
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [logo, setLogo] = useState<string | null>(null);
  const [dotStyle, setDotStyle] = useState<DotType>('square');
  const [cornerStyle, setCornerStyle] = useState<CornerSquareType>('square');

  const { toast } = useToast();
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (QRCodeStylingClient && qrRef.current) {
        qrCodeInstance.current = new QRCodeStylingClient({
            width: 256,
            height: 256,
            data: 'https://www.firebasestudio.ai',
            image: '',
            dotsOptions: {
                color: '#000000',
                type: 'square'
            },
            cornersSquareOptions: {
                type: 'square'
            },
            backgroundOptions: {
                color: '#ffffff',
            },
            imageOptions: {
                crossOrigin: 'anonymous',
                margin: 10
            }
        });
        qrCodeInstance.current.append(qrRef.current);
    }
  }, []);

  const updateQrCode = () => {
    if (!qrCodeInstance.current || !inputValue.trim()) return;

    setIsGenerating(true);
    qrCodeInstance.current.update({
        data: inputValue,
        dotsOptions: {
            color: selectedColor,
            type: dotStyle
        },
        cornersSquareOptions: {
            type: cornerStyle
        },
        image: logo || ''
    });
    // Give it a moment to re-render
    setTimeout(() => setIsGenerating(false), 500);
  };

  useEffect(() => {
    // Debounce QR code update
    const handler = setTimeout(() => {
      if (inputValue) {
        updateQrCode();
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, selectedColor, dotStyle, cornerStyle, logo]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!qrCodeInstance.current || !inputValue) return;
    setIsDownloading(true);

    try {
      await qrCodeInstance.current.download({
        name: 'qrcode',
        extension: 'png'
      });
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
          Customize your QR code with styles and an optional logo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="qr-input">Text or URL</Label>
          <Input
            id="qr-input"
            placeholder="e.g., https://example.com"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isGenerating}
          />
        </div>

        <Tabs defaultValue="style" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="style">Color</TabsTrigger>
                <TabsTrigger value="dots">Dots</TabsTrigger>
                <TabsTrigger value="corners">Corners</TabsTrigger>
            </TabsList>
            <TabsContent value="style" className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                        <Button
                            key={color.value}
                            variant="outline"
                            size="icon"
                            className={cn(
                            'h-8 w-8 rounded-full',
                            selectedColor === color.value && 'ring-2 ring-primary ring-offset-2'
                            )}
                            onClick={() => setSelectedColor(color.value)}
                            style={{ backgroundColor: color.value }}
                            aria-label={`Select color ${color.name}`}
                        >
                            {selectedColor === color.value && <div className="h-4 w-4 rounded-full border-2 border-background" />}
                        </Button>
                        ))}
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="flex items-center gap-4">
                        <Button asChild variant="outline">
                           <label htmlFor="logo-upload" className="cursor-pointer">
                            <Upload className="mr-2" />
                            Upload Logo
                            <input id="logo-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} />
                           </label>
                        </Button>
                        {logo && (
                            <div className="relative">
                                <img src={logo} alt="Logo Preview" className="h-10 w-10 rounded-md object-cover" />
                                <button
                                    onClick={() => setLogo(null)}
                                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center"
                                    aria-label="Remove logo"
                                >
                                    &times;
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="dots" className="pt-4">
                <div className="grid grid-cols-3 gap-2">
                    {dotStyleOptions.map((option) => (
                        <Button key={option.value} variant={dotStyle === option.value ? 'default' : 'outline'} onClick={() => setDotStyle(option.value)}>
                            {option.name}
                        </Button>
                    ))}
                </div>
            </TabsContent>
            <TabsContent value="corners" className="pt-4">
                <div className="grid grid-cols-3 gap-2">
                    {cornerStyleOptions.map((option) => (
                        <Button key={option.value} variant={cornerStyle === option.value ? 'default' : 'outline'} onClick={() => setCornerStyle(option.value)}>
                            {option.name}
                        </Button>
                    ))}
                </div>
            </TabsContent>
        </Tabs>
        
        <div className="flex h-72 items-center justify-center rounded-lg border border-dashed bg-muted/50 p-4">
            <div ref={qrRef} className={cn(isGenerating && 'opacity-50 transition-opacity')} />
            {!inputValue && (
                 <div className="absolute text-center text-sm text-muted-foreground">
                    Enter a URL to see your QR code.
                 </div>
            )}
        </div>

      </CardContent>
      <CardFooter>
        <Button
          onClick={handleDownload}
          className="w-full"
          disabled={!inputValue || isDownloading}
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
