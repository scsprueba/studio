
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
  
  const { toast } = useToast();

  useEffect(() => {
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
    const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent);

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
  
  const canInstall = installPrompt || /iPhone|iPad|iPod/.test(navigator.userAgent);

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
            <AlertDialogDescription>
              Para instalar GuardiaSwap, abre el menú de Safari (el icono de compartir <span className="inline-block align-middle w-4 h-4 bg-center bg-no-repeat" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' width='50px' height='50px'%3E%3Cpath d='M 25 2 C 23.355469 2 22 3.355469 22 5 L 22 21.125 C 20.03125 21.566406 18.285156 22.585938 16.96875 24 C 14.476563 26.292969 13.972656 29.84375 16 32.5 L 11.28125 38.34375 C 10.925781 38.8125 11.03125 39.46875 11.4375 39.875 C 11.84375 40.28125 12.5 40.386719 12.96875 40.03125 L 17.65625 34.21875 C 20.15625 35.347656 23.003906 35.644531 25.75 35.03125 L 25.75 45 C 25.75 46.644531 27.105469 48 28.75 48 C 30.394531 48 31.75 46.644531 31.75 45 L 31.75 35.03125 C 34.496094 35.644531 37.34375 35.347656 39.84375 34.21875 L 44.53125 40.03125 C 45 40.386719 45.65625 40.28125 46.0625 39.875 C 46.46875 39.46875 46.574219 38.8125 46.21875 38.34375 L 41.5 32.5 C 43.527344 29.84375 43.023438 26.292969 40.53125 24 C 39.214844 22.585938 37.46875 21.566406 35.5 21.125 L 35.5 5 C 35.5 3.355469 34.144531 2 32.5 2 Z M 25 4 L 32.5 4 C 32.785156 4 33 4.214844 33 4.5 L 33 5 L 24.5 5 L 24.5 4.5 C 24.5 4.214844 24.714844 4 25 4 Z M 28.75 6 L 31.75 6 L 31.75 20.5 C 30.828125 20.667969 29.828125 20.898438 28.75 21.21875 Z M 25.75 6 L 25.75 21.21875 C 24.671875 20.898438 23.671875 20.667969 22.75 20.5 L 22.75 6 Z M 19.03125 25 C 20.441406 25 21.734375 25.441406 22.75 26.15625 L 22.75 32.3125 C 21.515625 32.613281 20.242188 32.75 19 32.75 C 17.558594 32.75 16.195313 32.300781 15 31.53125 C 14.710938 31.386719 14.453125 31.210938 14.21875 31.03125 C 12.875 29.867188 13.433594 27.675781 15.34375 26.21875 C 16.328125 25.492188 17.585938 25 19.03125 25 Z M 28.75 26.15625 C 29.765625 25.441406 31.058594 25 32.46875 25 C 33.914063 25 35.171875 25.492188 36.15625 26.21875 C 38.066406 27.675781 38.625 29.867188 37.28125 31.03125 C 37.046875 31.210938 36.789063 31.386719 36.5 31.53125 C 35.304688 32.300781 33.941406 32.75 32.5 32.75 C 31.257813 32.75 29.984375 32.613281 28.75 32.3125 Z'/%3E%3C/svg%3E\")"
              }}></span>) y elige "Añadir a pantalla de inicio".
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

    