import { ThemeToggle } from '@/components/theme-toggle';

const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-primary"
    aria-hidden="true"
  >
    <path d="M4 4h4v4H4z" />
    <path d="M4 16h4v4H4z" />
    <path d="M16 4h4v4h-4z" />
    <path d="M14 14h2v2h-2z" />
    <path d="M14 4h-2v2h2z" />
    <path d="M4 10h2v2H4z" />
    <path d="M10 4v2h2V4z" />
    <path d="M16 16h4v4h-4z" />
    <path d="M10 16v-2h2v2z" />
    <path d="M16 10h2v2h-2z" />
  </svg>
);

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex-1 flex items-center justify-start">
          <div className="mr-4 flex items-center">
            <Logo />
            <span className="ml-2 font-bold font-headline">Code Weaver</span>
          </div>
        </div>
        <div className="hidden md:flex flex-1 items-center justify-center">
          <p className="text-center text-sm text-muted-foreground">
            made with ❤️ by{' '}
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
        <div className="flex-1 flex items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
