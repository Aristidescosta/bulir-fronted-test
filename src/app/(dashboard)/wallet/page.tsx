// app/wallet/page.tsx
'use client';

import { useWallet } from '@/hooks/useWallet';
import { WalletHeader } from '@/components/custom/wallet/WalletHeader';
import WalletCard from '@/components/custom/wallet/WalletCard';
import { WalletActions } from '@/components/custom/wallet/WalletActions';
import { TransactionsTab } from '@/components/custom/wallet/TransactionsTab';

export default function WalletPage() {
    const {
        transactions,
        filteredTransactions,
        loading,
        activeTab,
        setActiveTab,
        getTransactionIcon,
        getTransactionColor,
        getTipoLabel,
    } = useWallet();

    return (
        <div className="space-y-6">
            <WalletHeader />

            <WalletCard />

            <WalletActions />

            <TransactionsTab
                transactions={transactions}
                filteredTransactions={filteredTransactions}
                loading={loading}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                getTransactionIcon={getTransactionIcon}
                getTransactionColor={getTransactionColor}
                getTipoLabel={getTipoLabel}
            />
        </div>
    );
}