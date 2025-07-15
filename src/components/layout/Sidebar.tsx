import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaUser, FaUsers, FaBroadcastTower, FaSignOutAlt, FaBrain, FaPlus } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useModalStore } from '@/store/modalStore';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isSidebarOpen, closeSidebar } = useUIStore();
  const { openCreateEchoModal } = useModalStore();
  const location = useLocation();

  const navItems = [
    { name: 'Feed', icon: FaHome, path: '/feed' },
    { name: 'Profile', icon: FaUser, path: `/profile/${user?.id || 'me'}` },
    { name: 'Communities', icon: FaUsers, path: '/communities' },
    { name: 'Tune In', icon: FaBroadcastTower, path: '/tune-in' },
  ];

  const sidebarVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: '0%', opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
  };

  const handleCreateEcho = () => {
    openCreateEchoModal();
    closeSidebar(); // Close sidebar on mobile after action
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSidebar}
        />
      )}

      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border p-6 flex flex-col",
          "lg:relative lg:translate-x-0 lg:opacity-100 lg:flex lg:min-w-[256px]",
          {
            "translate-x-0 opacity-100": isSidebarOpen,
            "-translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100": !isSidebarOpen,
          }
        )}
        initial={false}
        animate={isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024) ? "visible" : "hidden"}
        variants={sidebarVariants}
      >
        <div className="flex items-center space-x-3 mb-8">
          <FaBrain className="text-primary" size={32} />
          <h2 className="text-2xl font-bold text-text">Glitchary</h2>
        </div>

        {/* Create Echo Button */}
        <div className="mb-6">
          <Button 
            variant="primary" 
            className="w-full flex items-center justify-center space-x-2"
            onClick={handleCreateEcho}
          >
            <FaPlus size={18} />
            <span>Create Echo</span>
          </Button>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={closeSidebar}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200",
                "hover:bg-border hover:text-primary",
                location.pathname === item.path ? 'bg-primary text-white' : 'text-textSecondary'
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={user?.avatarUrl || 'https://images.pexels.com/photos/1542083/pexels-photo-1542083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
              alt={user?.name || 'User Avatar'}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary"
            />
            <div>
              <p className="text-text font-semibold">{user?.name || 'Guest User'}</p>
              <p className="text-textSecondary text-sm">{user?.email || 'demo@example.com'}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="w-full flex items-center justify-center space-x-2"
            onClick={() => {
              logout();
              closeSidebar();
            }}
          >
            <FaSignOutAlt size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;