interface RechargeHeaderProps {
    title?: string;
    description?: string;
}

export function RechargeHeader({
    title = "Adicionar Crédito",
    description = "Recarregue sua carteira para contratar serviços ou receber pagamentos."
}: RechargeHeaderProps) {
    return (
        <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}