import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Plus, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function WalletActions() {
    const { isProvider } = useAuth();

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <ActionCard
                href="/wallet/recharge"
                icon={<Plus className="h-5 w-5 text-green-600" />}
                title="Adicionar Crédito"
                description="Recarregue sua carteira para contratar serviços"
                bgColor="bg-green-100"
            />

            {isProvider() && (
                <ActionCard
                    href="/wallet/withdraw"
                    icon={<ArrowUpRight className="h-5 w-5 text-blue-600" />}
                    title="Solicitar Saque"
                    description="Transfira seu saldo para sua conta bancária"
                    bgColor="bg-blue-100"
                />
            )}
        </div>
    );
}

interface ActionCardProps {
    href: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    bgColor: string;
}

function ActionCard({ href, icon, title, description, bgColor }: ActionCardProps) {
    return (
        <Link href={href} className="cursor-pointer hover:shadow-md transition-shadow">
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 ${bgColor} rounded-lg`}>
                            {icon}
                        </div>
                        <CardTitle>{title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <CardDescription>{description}</CardDescription>
                </CardContent>
            </Card>
        </Link>
    );
}