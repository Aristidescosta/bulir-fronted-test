/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { bookingService } from '@/services/bookingService';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CancelBookingDialogProps {
    bookingId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CancelBookingDialog({
    bookingId,
    isOpen,
    onClose,
    onSuccess,
}: CancelBookingDialogProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [motivo, setMotivo] = useState('');

    const handleCancel = async () => {
        setError('');

        if (!motivo.trim()) {
            setError('Por favor, informe o motivo do cancelamento');
            return;
        }

        try {
            setLoading(true);
            await bookingService.cancelBooking(bookingId, { motivo });
            toast.success('Reserva cancelada com sucesso');
            onSuccess();
        } catch (err: any) {
            console.error('Erro ao cancelar reserva:', err);
            setError(err.response?.data?.message || 'Erro ao cancelar reserva');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancelar Reserva</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="motivo">
                            Motivo do Cancelamento <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="motivo"
                            placeholder="Explique o motivo do cancelamento..."
                            rows={4}
                            value={motivo}
                            onChange={(e) => {
                                setMotivo(e.target.value);
                                setError('');
                            }}
                            disabled={loading}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Esta informação será compartilhada com a outra parte.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Voltar
                    </Button>
                    <Button variant="destructive" onClick={handleCancel} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cancelando...
                            </>
                        ) : (
                            'Confirmar Cancelamento'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
