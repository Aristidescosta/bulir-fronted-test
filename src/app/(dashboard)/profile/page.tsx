// app/profile/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { ProfileHeader } from '@/components/custom/profile/ProfileHeader';
import { PersonalInfoTab } from '@/components/custom/profile/PersonalInfoTab';
import { AccountDetailsCard } from '@/components/custom/profile/AccountDetailsCard';
import { SecurityTab } from '@/components/custom/profile/SecurityTab';
import { ActivityTab } from '@/components/custom/profile/ActivityTab';

export default function ProfilePage() {
    const { isProvider } = useAuth();
    const {
        profileData,
        formData,
        editMode,
        loading,
        error,
        setEditMode,
        setFormData,
        handleSubmit,
        handleCancel,
    } = useProfile();

    if (!profileData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const handleFormDataChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold">Meu Perfil</h1>
                <p className="text-muted-foreground">Gerencie suas informações pessoais e configurações</p>
            </div>

            <ProfileHeader
                profileData={profileData}
                editMode={editMode}
                onEdit={() => setEditMode(true)}
            />

            <Tabs defaultValue="info" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info">Informações</TabsTrigger>
                    <TabsTrigger value="security">Segurança</TabsTrigger>
                    <TabsTrigger value="activity">Atividade</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                    <PersonalInfoTab
                        profileData={profileData}
                        formData={formData}
                        editMode={editMode}
                        loading={loading}
                        error={error}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        onFormDataChange={handleFormDataChange}
                    />
                    <AccountDetailsCard profileData={profileData} />
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <SecurityTab />
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                    <ActivityTab userId={profileData.id} isProvider={isProvider()} />
                </TabsContent>
            </Tabs>
        </div>
    );
}