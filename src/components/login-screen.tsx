
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Access the password from environment variables
    const correctPassword = process.env.NEXT_PUBLIC_APP_PASSWORD;

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">GuardiaSwap</CardTitle>
            <CardDescription>
              Introduce la clave para acceder al calendario de guardias.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
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
          <CardFooter>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
