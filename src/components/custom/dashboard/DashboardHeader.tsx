interface DashboardHeaderProps {
    userName?: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
    return (
        <div>
            <h1 className="text-3xl font-bold">Olá, {userName?.split(' ')[0]}! 👋</h1>
            <p className="text-muted-foreground">Bem-vindo ao seu dashboard</p>
        </div>
    );
}