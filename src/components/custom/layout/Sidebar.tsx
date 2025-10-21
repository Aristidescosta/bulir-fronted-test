'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { DesktopSidebar } from '../sidebar/DesktopSidebar';
import { MobileSidebar } from '../sidebar/MobileSidebar';
import { MobileBottomBar } from '../sidebar/MobileBottomBar';

export default function Sidebar() {
    const { links, pathname, isMobileOpen, setIsMobileOpen } = useSidebar();

    return (
        <>
            <DesktopSidebar links={links} pathname={pathname} />

            <MobileSidebar
                links={links}
                pathname={pathname}
                isOpen={isMobileOpen}
                onOpenChange={setIsMobileOpen}
            />

            <MobileBottomBar />
        </>
    );
}