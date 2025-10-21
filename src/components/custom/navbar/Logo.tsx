import Link from 'next/link';

interface LogoProps {
    href?: string;
    text?: string;
    className?: string;
}

export function Logo({
    href = "/dashboard",
    text = "ServiçosApp",
    className = "text-2xl font-bold text-blue-600"
}: LogoProps) {
    return (
        <Link href={href} className={className}>
            {text}
        </Link>
    );
}