import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';
import { SidebarLink } from './SidebarLink';
import { SidebarLink as SidebarLinkType } from '@/hooks/useSidebar';

interface MobileSidebarProps {
    links: SidebarLinkType[];
    pathname: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ links, pathname, isOpen, onOpenChange }: MobileSidebarProps) {
    const handleLinkClick = () => {
        onOpenChange(false);
    };

    return (
        <>
            {/* Mobile Trigger Button */}
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => onOpenChange(true)}
            >
                <Menu className="h-6 w-6" />
            </Button>

            {/* Mobile Sidebar Sheet */}
            <Sheet open={isOpen} onOpenChange={onOpenChange}>
                <SheetContent side="left" className="w-80 p-0">
                    <SheetHeader className="p-6 border-b">
                        <div className="flex items-center justify-between">
                            <SheetTitle className="text-xl font-bold text-blue-600">
                                Menu
                            </SheetTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onOpenChange(false)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </SheetHeader>

                    <nav className="p-4 space-y-2">
                        {links.map(({ href, label, icon }) => (
                            <SidebarLink
                                key={href}
                                href={href}
                                label={label}
                                icon={icon}
                                isActive={pathname === href}
                                variant="mobile"
                                onClick={handleLinkClick}
                            />
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </>
    );
}