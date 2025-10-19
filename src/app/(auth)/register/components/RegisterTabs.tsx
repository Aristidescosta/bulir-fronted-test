'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EUserType } from '@/types/UserType';
import { User, Briefcase } from 'lucide-react';

interface RegisterTabsProps {
    userType: EUserType;
    onChange: (value: EUserType) => void;
}

export function RegisterTabs({ userType, onChange }: RegisterTabsProps) {
    return (
        <Tabs
            value={userType}
            onValueChange={(val) => onChange(val as EUserType)}
            className="mb-6"
        >
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value={EUserType.CUSTOMER} className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Cliente
                </TabsTrigger>
                <TabsTrigger value={EUserType.PROVIDER} className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Provedor
                </TabsTrigger>
            </TabsList>

            <TabsContent value={EUserType.CUSTOMER} className="mt-4">
                <p className="text-sm text-muted-foreground">
                    Como cliente, você poderá buscar e contratar serviços de profissionais qualificados.
                </p>
            </TabsContent>

            <TabsContent value={EUserType.PROVIDER} className="mt-4">
                <p className="text-sm text-muted-foreground">
                    Como provedor, você poderá cadastrar seus serviços e receber reservas de clientes.
                </p>
            </TabsContent>
        </Tabs>
    );
}
