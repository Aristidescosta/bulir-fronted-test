'use client';

import { useAuth } from '@/context/AuthContext';
import ProviderDashboard from './ProviderDashboard';
import { DashboardSkeleton } from '@/components/custom/dashboard/DashboardSkeleton';

import { DashboardHeader } from '@/components/custom/dashboard/DashboardHeader';
import { StatsGrid } from '@/components/custom/dashboard/StatsGrid';
import { RecentBookingsCard } from '@/components/custom/dashboard/RecentBookingsCard';
import { QuickActionsCard } from '@/components/custom/dashboard/QuickActionsCard';

import { useDashboard } from '@/hooks/useDashboard';

export default function DashboardPage() {
    const { user, isProvider } = useAuth();
    const { stats, recentBookings, loading } = useDashboard();

    if (isProvider()) {
        return <ProviderDashboard />;
    }

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-6">
            <DashboardHeader userName={user?.name} />

            <StatsGrid stats={stats} />

            <RecentBookingsCard recentBookings={recentBookings} />

            <QuickActionsCard />
        </div>
    );
}