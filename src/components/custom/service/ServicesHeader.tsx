interface ServicesHeaderProps {
    title?: string;
    description?: string;
}

export function ServicesHeader({
    title = "Explorar Serviços",
    description = "Encontre o serviço perfeito para você"
}: ServicesHeaderProps) {
    return (
        <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}