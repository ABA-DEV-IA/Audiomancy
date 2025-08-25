import { Button } from '@/components/ui/button';

export function MagicButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary px-12 py-4 text-lg font-bold transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    >
      {children}
    </Button>
  );
}
