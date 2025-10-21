'use client';

import { useNavbar } from '@/hooks/useNavbar';
import { Logo } from '../navbar/Logo';
import { NotificationsButton } from '../navbar/NotificationsButton';
import { UserDropdown } from '../navbar/UserDropdown';
import { MobileMenu } from '../navbar/MobileMenu';


export default function Navbar() {
  const { user, logout, getInitials } = useNavbar();

  if (!user) {
    return null;
  }

  const initials = getInitials(user.nome);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-4">
          <Logo />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block">
            <NotificationsButton />
          </div>

          <div className="hidden md:block">
            <UserDropdown
              user={user}
              initials={initials}
              onLogout={logout}
            />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <NotificationsButton />
            <MobileMenu
              user={user}
              initials={initials}
              onLogout={logout}
            />
          </div>
        </div>
      </div>
    </header>
  );
}