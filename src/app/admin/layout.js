"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Truck, 
  Mail, 
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Search,
  User,
  Tag,
  Ticket
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Productos', icon: Package, href: '/admin/productos' },
    { name: 'Categorías', icon: Tag, href: '/admin/categorias' },
    { name: 'Ventas', icon: ShoppingCart, href: '/admin/ventas' },
    { name: 'Cupones', icon: Ticket, href: '/admin/cupones' },
    { name: 'Logística', icon: Truck, href: '/admin/logistica' },
    { name: 'Marketing', icon: Mail, href: '/admin/marketing' },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          {isSidebarOpen ? (
            <div className="logo-area">
              <div className="logo-icon">M</div>
              <span className="logo-text">M•flower <small>Admin</small></span>
            </div>
          ) : (
            <div className="logo-icon mini">M</div>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`}>
                <item.icon size={20} className="nav-icon" />
                {isSidebarOpen && <span className="nav-text">{item.name}</span>}
                {isActive && isSidebarOpen && <div className="active-indicator" />}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
           <button className="logout-btn">
              <LogOut size={20} />
              {isSidebarOpen && <span>Salir</span>}
           </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="main-wrapper" style={{ marginLeft: isSidebarOpen ? '280px' : '80px' }}>
        {/* Top Header */}
        <header className="admin-header">
          <div className="header-left">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="toggle-btn">
              {isSidebarOpen ? <Menu size={20} /> : <Menu size={20} />}
            </button>
            <div className="breadcrumb">
              <span className="bc-parent">Admin</span>
              <ChevronRight size={14} />
              <span className="bc-current">{menuItems.find(i => i.href === pathname)?.name || 'Panel'}</span>
            </div>
          </div>
          
          <div className="header-right">
            <div className="header-search">
              <Search size={18} />
              <input type="text" placeholder="Buscar..." />
            </div>
            <button className="icon-btn">
              <Bell size={20} />
              <span className="notification-dot" />
            </button>
            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">Flor Maria</span>
                <span className="user-role">Administradora</span>
              </div>
              <div className="user-avatar">F</div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
            <div className="content-container">
                {children}
            </div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --sidebar-w: 280px;
          --sidebar-collapsed-w: 80px;
          --header-h: 80px;
          --rose-primary: #D47792;
          --bg-soft: #F9FAFB;
          --text-main: #111827;
          --text-muted: #6B7280;
        }

        .admin-container {
          min-height: 100vh;
          background-color: var(--bg-soft);
          display: flex;
        }

        /* Sidebar Styles */
        .admin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          background: white;
          border-right: 1px solid #E5E7EB;
          z-index: 100;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .admin-sidebar.open { width: var(--sidebar-w); }
        .admin-sidebar.collapsed { width: var(--sidebar-collapsed-w); }

        .sidebar-header {
          height: var(--header-h);
          display: flex;
          align-items: center;
          padding: 0 24px;
          border-bottom: 1px solid #F3F4F6;
        }
        .logo-area { display: flex; align-items: center; gap: 12px; }
        .logo-icon {
          width: 36px;
          height: 36px;
          background: var(--rose-primary);
          border-radius: 10px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
        }
        .logo-icon.mini { margin: 0 auto; }
        .logo-text { font-weight: 900; font-size: 1.1rem; color: var(--text-main); letter-spacing: -0.5px; }
        .logo-text small { color: var(--rose-primary); font-size: 0.7rem; text-transform: uppercase; margin-left: 4px; }

        .sidebar-nav { padding: 24px 12px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 12px;
          color: var(--text-muted);
          text-decoration: none;
          transition: all 0.2s;
          position: relative;
        }
        .nav-item:hover { background: #FFF1F2; color: var(--rose-primary); }
        .nav-item.active { background: #111827; color: white; }
        .nav-icon { min-width: 20px; }
        .nav-text { margin-left: 14px; font-weight: 600; font-size: 0.95rem; white-space: nowrap; }
        .active-indicator {
          position: absolute;
          right: 12px;
          width: 6px;
          height: 6px;
          background: var(--rose-primary);
          border-radius: 50%;
        }

        .sidebar-footer { padding: 24px; border-top: 1px solid #F3F4F6; }
        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: none;
          border: none;
          color: #9CA3AF;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
        }
        .logout-btn:hover { color: #EF4444; }

        /* Main Wrapper Styles */
        .main-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .admin-header {
          height: var(--header-h);
          background: white;
          border-bottom: 1px solid #E5E7EB;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .header-left { display: flex; align-items: center; gap: 24px; }
        .toggle-btn {
          background: #F3F4F6;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-muted);
        }
        .breadcrumb { display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 0.85rem; font-weight: 600; }
        .bc-current { color: var(--text-main); font-weight: 700; }

        .header-right { display: flex; align-items: center; gap: 24px; }
        .header-search {
          background: #F9FAFB;
          border: 1px solid #F3F4F6;
          padding: 8px 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 240px;
        }
        .header-search input { background: none; border: none; outline: none; font-size: 0.9rem; width: 100%; }
        .icon-btn {
          position: relative;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
        .notification-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background: var(--rose-primary);
          border: 2px solid white;
          border-radius: 50%;
        }

        .user-profile { display: flex; align-items: center; gap: 12px; }
        .user-info { text-align: right; display: flex; flex-direction: column; }
        .user-name { font-weight: 700; font-size: 0.9rem; color: var(--text-main); }
        .user-role { font-size: 0.75rem; color: var(--rose-primary); font-weight: 600; }
        .user-avatar {
          width: 40px;
          height: 40px;
          background: #FFE4E6;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--rose-primary);
          font-weight: 900;
        }

        .page-content { padding: 40px; flex: 1; }
        .content-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Global table responsive */
        table { width: 100%; border-collapse: collapse; }
        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; }

        @media (max-width: 1024px) {
           .main-wrapper { margin-left: 80px !important; }
           .header-search { display: none; }
        }
        
        @media (max-width: 768px) {
           .main-wrapper { margin-left: 0 !important; }
           .admin-sidebar { 
               width: var(--sidebar-w) !important; 
               transform: translateX(-100%);
               box-shadow: 4px 0 10px rgba(0,0,0,0.1);
           }
           .admin-sidebar.open { transform: translateX(0); }
           .admin-header { padding: 0 20px; }
           .page-content { padding: 15px; }
           .logo-area { display: flex !important; } /* Force logo to show on mobile when open */
           
           /* Fix for table overflowing in mobile */
           .content-container > div { overflow-x: auto; }
        }
      `}</style>
    </div>
  );
}
