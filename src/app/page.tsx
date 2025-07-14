
'use client';

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

import { useRouter } from 'next/navigation';


const HomePage = () => {
  const router = useRouter();

 return (
 <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4">
 <div className="w-full max-w-md space-y-6">
        {/* Welcome Section */}
 <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
 <h2 className="text-xl font-semibold">Bienvenido, Usuario</h2>
 <p className="text-sm text-muted-foreground mt-1">Aquí están tus tareas recientes.</p>
 <Button className="mt-4 w-full"
        onClick={() => router.push('/scheduled-audits')} // Navigate to the new page
        >Iniciar Auditoria</Button>
 </div>
      

        {/* Recent Audits Section */}
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Auditorías Recientes</h2>
          <div className="mt-4 space-y-4">
            {/* Placeholder for Recent Audits */}
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">Constructora Delta</h4>
                <p className="text-sm text-muted-foreground">15 de Julio, 2024</p>
              </div>
              <span className="text-sm text-green-600">Completado</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">Oficinas Epsilon</h4>
                <p className="text-sm text-muted-foreground">20 de Julio, 2024</p>
              </div>
              <span className="text-sm text-yellow-600">En Progreso</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">Almacén Zeta</h4>
                <p className="text-sm text-muted-foreground">25 de Julio, 2024</p>
              </div>
              <span className="text-sm text-blue-600">Pendiente</span>
            </div>
          </div>
        </div>

        {/* More Options Section */}
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Más</h2>
          <div className="mt-4 space-y-4">
            <Link href="/view-plans" className="flex justify-between items-center text-muted-foreground hover:text-foreground">
              <span>Planes Asignados</span>
              <span>&gt;</span>
            </Link>
            <Separator />
            <Link href="/inventory" className="flex justify-between items-center text-muted-foreground hover:text-foreground">
              <span>Inventario</span>
              <span>&gt;</span>
            </Link>
            <Separator />
            <Link href="/create-plan" className="flex justify-between items-center text-muted-foreground hover:text-foreground">
              <span>Crear Nuevo Plan</span>
              <span>&gt;</span>
            </Link>
          </div>
          </div>
      </div>
    </div>
  );
};

export default HomePage;