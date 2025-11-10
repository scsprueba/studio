
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Download } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showIosInstallMessage, setShowIosInstallMessage] = useState(false);
  const [isIos, setIsIos] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    // This code now runs only on the client
    setIsIos(/iPhone|iPad|iPod/.test(navigator.userAgent));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Forcing the password here to bypass dev environment issues.
    const correctPassword = "nurse00";

    if (password === correctPassword) {
      onLoginSuccess();
    } else {
      setError('La contraseña es incorrecta. Inténtalo de nuevo.');
      toast({
        variant: 'destructive',
        title: 'Acceso denegado',
        description: 'La contraseña introducida no es válida.',
      });
      setPassword('');
    }
  };

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setInstallPrompt(null);
      });
    } else if (isIos) {
      setShowIosInstallMessage(true);
    } else {
      // Fallback for other browsers or if prompt is not available
      alert('Para instalar la app, busca la opción "Añadir a pantalla de inicio" en el menú de tu navegador.');
    }
  };
  
  const canInstall = installPrompt || isIos;

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <form onSubmit={handleSubmit}>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">GuardiaSwap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="**********"
                    required
                    className="pr-10 text-center text-lg tracking-widest"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 right-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                    <span className="sr-only">{showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}</span>
                  </Button>
                </div>
              </div>
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full">
                Entrar
              </Button>
              {canInstall && (
                 <Button type="button" variant="outline" className="w-full" onClick={handleInstallClick}>
                   <Download className="mr-2 h-4 w-4" />
                   Instalar App
                 </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
      <AlertDialog open={showIosInstallMessage} onOpenChange={setShowIosInstallMessage}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Instalar en iPhone o iPad</AlertDialogTitle>
            <AlertDialogDescription className="inline-flex items-center gap-1">
              Para instalar GuardiaSwap, pulsa el icono de compartir (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block w-5 h-5"><path d="M12 20v-8"/><path d="m7 16 5-5 5 5"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7"/><path d="M12 3v1"/></svg>
              ) y elige "Añadir a pantalla de inicio".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowIosInstallMessage(false)}>Entendido</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
