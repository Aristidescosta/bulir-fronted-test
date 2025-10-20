'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { serviceService } from '@/services/serviceService';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import { EServiceStatus, IService } from '@/types/service';


interface DeleteDialogState {
  open: boolean;
  serviceId: string | null;
}

export default function MyServicesPage() {
  const { isProvider } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    serviceId: null,
  });

  useEffect(() => {
    if (!isProvider()) {
      router.push('/dashboard');
      return;
    }
    void loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await serviceService.getMyServices();
      setServices(data.data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      toast.error('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await serviceService.toggleServiceStatus(id);
      toast.success('Status atualizado com sucesso');
      await loadServices();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status do serviço');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.serviceId) return;
    try {
      await serviceService.deleteService(deleteDialog.serviceId);
      toast.success('Serviço excluído com sucesso');
      setDeleteDialog({ open: false, serviceId: null });
      await loadServices();
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      toast.error('Erro ao excluir serviço');
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meus Serviços</h1>
          <p className="text-muted-foreground">
            Gerencie seus serviços cadastrados
          </p>
        </div>
        <Button asChild>
          <Link href="/my-services/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Serviço
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Serviços</CardDescription>
            <CardTitle className="text-3xl">{services.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Serviços Ativos</CardDescription>
            <CardTitle className="text-3xl">
              {services.filter((s) => s.status === EServiceStatus.ACTIVE).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Serviços Inativos</CardDescription>
            <CardTitle className="text-3xl">
              {services.filter((s) => s.status === EServiceStatus.INACTIVE).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">
              Nenhum serviço cadastrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Comece cadastrando seu primeiro serviço
            </p>
            <Button asChild>
              <Link href="/my-services/new">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Serviço
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge>{service.category}</Badge>
                  <Badge
                    variant={
                      service.status === EServiceStatus.ACTIVE ? 'default' : 'secondary'
                    }
                  >
                    {service.status}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-1">{service.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-blue-600">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatCurrency(service.price)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleToggleStatus(service.id)}
                >
                  {service.status === EServiceStatus.ACTIVE ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Desativar
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Ativar
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/my-services/${service.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setDeleteDialog({ open: true, serviceId: service.id })
                  }
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O serviço será permanentemente
              excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
