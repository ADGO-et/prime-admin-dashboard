import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen, LayoutDashboard, FileText, ShoppingCart, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/applications", label: "Applications", Icon: FileText },
  { to: "/orders", label: "Orders", Icon: ShoppingCart },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="h-screen flex overflow-hidden">
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen glass-sidebar flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-[4.5rem]"
        )}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="absolute -right-3 top-16 -translate-y-1/2 z-[60] h-7 w-7 rounded-full border-slate-200 bg-white shadow-md"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-3.5 w-3.5 text-slate-500" />
          ) : (
            <PanelLeftOpen className="h-3.5 w-3.5 text-slate-500" />
          )}
        </Button>

        <div className="h-full flex flex-col shrink-0">
          <div className={cn("h-16 border-b border-white/40 bg-gradient-to-br from-brand-dark/95 via-brand-mid/90 to-brand-light/85 backdrop-blur-xl flex items-center", sidebarOpen ? "px-4" : "px-0 justify-center")}>
            {sidebarOpen ? (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-black text-sm shadow-lg border border-white/30 shrink-0">
                  PC
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm font-bold text-white leading-tight truncate">Prime Capital</h1>
                  <p className="text-[10px] text-blue-100 uppercase tracking-wider">Admin Portal</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-black text-sm shadow-lg border border-white/30">
                PC
              </div>
            )}
          </div>

          <nav className={cn("flex-1 overflow-y-auto space-y-1", sidebarOpen ? "p-3" : "p-2")}>
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg text-sm font-medium transition-colors",
                    sidebarOpen ? "px-3 py-2.5" : "justify-center px-0 py-2.5",
                    isActive
                      ? "bg-gradient-to-br from-brand-dark via-brand-mid to-brand-light text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-brand-dark"
                  )
                }
                title={label}
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                {sidebarOpen && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>

          <div className={cn("border-t border-slate-200/60 space-y-2", sidebarOpen ? "p-3" : "p-2")}>
            <div className={cn("rounded-lg border border-slate-200 bg-slate-50/80 flex items-center", sidebarOpen ? "p-3 gap-3" : "p-2 justify-center")}>
              <div className="w-8 h-8 rounded-full bg-brand-dark/10 flex items-center justify-center text-brand-dark text-xs font-bold shrink-0">
                {user?.name?.charAt(0) ?? "C"}
              </div>
              {sidebarOpen && (
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-800 truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLogoutConfirm(true)}
              className={cn("w-full text-slate-500", sidebarOpen ? "justify-start" : "justify-center px-0")}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              {sidebarOpen && "Sign Out"}
            </Button>
          </div>
        </div>
      </aside>

      <main
        className={cn(
          "flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden transition-[margin] duration-300 ease-in-out",
          sidebarOpen ? "ml-64" : "ml-[4.5rem]"
        )}
      >
        <header className="shrink-0 z-10 glass-topbar h-16 px-4 sm:px-8 flex items-center">
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-2 min-w-0">
              <div className="min-w-0">
                <h6 className="text-lg font-semibold text-brand-dark truncate">KYC Compliance Dashboard</h6>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs text-slate-600 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Connected
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </div>
      </main>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Sign out?"
        message="You will need to sign in again to access the compliance dashboard."
        confirmLabel="Sign Out"
        cancelLabel="Stay"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
