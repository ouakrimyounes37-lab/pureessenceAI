
import React, { useEffect } from 'react';
import { MODULES_CONFIG, MODULE_ACCESS } from '../constants';
import { ModuleType, User, AppNotification } from '../types';
import { Menu, Bell, Search, User as UserIcon, LogOut, ShieldCheck, Check, Info, XCircle, X } from 'lucide-react';

interface LayoutProps {
  currentModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
  children: React.ReactNode;
  currentUser: User;
  onLogout: () => void;
  notifications?: AppNotification[];
  onMarkAllRead?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  currentModule, 
  onModuleChange, 
  children, 
  currentUser, 
  onLogout,
  notifications = [],
  onMarkAllRead = () => {}
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);

  // Handle responsive resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setIsSidebarOpen(false); // Default closed on mobile
      } else {
        setIsMobile(false);
        setIsSidebarOpen(true); // Default open on desktop
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter modules based on user role permissions
  const allowedModules = MODULE_ACCESS[currentUser.role] || [];
  const accessibleModules = MODULES_CONFIG.filter(m => allowedModules.includes(m.id as ModuleType));

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-40
          bg-slate-900 text-white transition-all duration-300 flex flex-col shadow-xl
          ${isSidebarOpen ? 'w-64 translate-x-0' : isMobile ? '-translate-x-full w-64' : 'w-20 translate-x-0'}
        `}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-700 h-16">
          {(isSidebarOpen || isMobile) && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white">PE</span>
              </div>
              <span className="font-bold text-lg tracking-tight truncate">Pure Essence</span>
            </div>
          )}
          {/* Toggle Button (Desktop only inside sidebar, mobile uses header button) */}
          {!isMobile && (
            <button onClick={toggleSidebar} className="p-1 hover:bg-slate-800 rounded mx-auto md:mx-0">
              <Menu size={20} />
            </button>
          )}
           {isMobile && (
            <button onClick={toggleSidebar} className="p-1 hover:bg-slate-800 rounded">
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <div className="px-4 mb-4">
              {(isSidebarOpen || isMobile) && <span className="text-xs font-bold text-slate-500 uppercase">Modules</span>}
          </div>
          <ul className="space-y-1 px-2">
            {accessibleModules.map((module) => {
              const Icon = module.icon;
              const isActive = currentModule === module.id;
              return (
                <li key={module.id}>
                  <button
                    onClick={() => {
                      onModuleChange(module.id as ModuleType);
                      if (isMobile) setIsSidebarOpen(false); // Close on selection for mobile
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon size={22} className="shrink-0" />
                    {(isSidebarOpen || isMobile) && <span className="text-sm font-medium truncate">{module.name}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700">
           <button 
             onClick={onLogout}
             className="w-full flex items-center space-x-3 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
           >
            <LogOut size={20} className="shrink-0" />
             {(isSidebarOpen || isMobile) && <span className="text-sm">Déconnexion</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
             {/* Mobile Menu Button */}
             {isMobile && (
              <button onClick={toggleSidebar} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md">
                <Menu size={24} />
              </button>
            )}

            <div className="hidden md:flex items-center text-slate-500 bg-slate-100 rounded-md px-3 py-2 w-64 lg:w-96">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="bg-transparent border-none outline-none ml-2 w-full text-sm text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative">
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                  )}
                </button>
                
                {isNotifOpen && (
                  <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                  <div className="absolute right-0 top-12 w-80 max-w-[90vw] bg-white shadow-xl rounded-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-slate-50 flex justify-between items-center bg-slate-50">
                      <h4 className="font-bold text-slate-700 text-sm">Notifications</h4>
                      {unreadCount > 0 && (
                        <button onClick={onMarkAllRead} className="text-xs text-blue-600 hover:underline">
                          Tout lire
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">Aucune notification</div>
                      ) : (
                        notifications.map(notif => (
                          <div key={notif.id} className={`p-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                             <div className="flex gap-3">
                                <div className={`mt-0.5 ${
                                  notif.type === 'success' ? 'text-emerald-500' :
                                  notif.type === 'error' ? 'text-red-500' : 'text-blue-500'
                                }`}>
                                   {notif.type === 'success' ? <Check size={16} /> : notif.type === 'error' ? <XCircle size={16} /> : <Info size={16} />}
                                </div>
                                <div>
                                  <p className="text-sm text-slate-800 break-words">{notif.message}</p>
                                  <p className="text-xs text-slate-400 mt-1">{new Date(notif.timestamp).toLocaleTimeString()}</p>
                                </div>
                             </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  </>
                )}
            </div>
            <div className="flex items-center space-x-3 pl-2 md:pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-800">{currentUser.name}</p>
                <div className="flex items-center justify-end gap-1 text-xs text-slate-500">
                   {currentUser.role === 'iso_auditor' && <ShieldCheck size={12} className="text-emerald-600" />}
                   <span className="capitalize truncate max-w-[100px]">{currentUser.role.replace('_', ' ')}</span>
                </div>
              </div>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-sm shrink-0 ${currentUser.role === 'administrator' ? 'bg-purple-600' : 'bg-slate-400'}`}>
                <UserIcon size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 relative custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
