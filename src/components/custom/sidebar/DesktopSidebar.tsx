import { SidebarLink } from './SidebarLink';
import { SidebarLink as SidebarLinkType } from '@/hooks/useSidebar';

interface DesktopSidebarProps {
    links: SidebarLinkType[];
    pathname: string;
}

export function DesktopSidebar({ links, pathname }: DesktopSidebarProps) {
    return (
        <aside className="hidden lg:block w-64 bg-white border-r min-h-[calc(100vh-73px)] sticky top-[73px]">
            <nav className="p-4 space-y-2">
                {links.map(({ href, label, icon }) => (
                    <SidebarLink
                        key={href}
                        href={href}
                        label={label}
                        icon={icon}
                        isActive={pathname === href}
                        variant="desktop"
                    />
                ))}
            </nav>
        </aside>
    );
}