import type React from 'react';

interface WelcomeHeaderProps {
  userName: string;
}

export function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  return (
    <header className="py-8 text-center">
      <h1 className="text-3xl font-bold text-primary sm:text-4xl">
        ¡Bienvenido, {userName}!
      </h1>
      <p className="text-md text-muted-foreground mt-2">
        Aquí puedes gestionar tus operaciones.
      </p>
    </header>
  );
}
