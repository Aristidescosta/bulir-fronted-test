interface WalletHeaderProps {
    title?: string;
    description?: string;
}

export function WalletHeader({
    title = "Carteira",
    description = "Gerencie seu saldo e transações"
}: WalletHeaderProps) {
    return (
        <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}