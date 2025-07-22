import { Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40">
      <div className="container flex h-16 items-center justify-center">
        <p className="text-center text-sm text-muted-foreground">
          Looking for the code base of this project? Reach out on{' '}
          <a
            href="https://www.linkedin.com/in/sanskardrolia"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 inline-flex items-center gap-1.5 transition-colors hover:text-primary"
          >
            LinkedIn <Linkedin className="h-4 w-4" />
          </a>
        </p>
      </div>
    </footer>
  );
}
