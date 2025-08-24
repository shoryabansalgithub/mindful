import React, { useState } from "react";
import {
  Home,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Plus,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Folder,
  FileText,
  Star,
  Archive,
  Trash2,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "../utils/utils.js";

// Professional Navigation Item Component
const NavItem = ({
  icon: Icon,
  label,
  isActive = false,
  badge = null,
  children = null,
  onClick,
  className = "",
  collapsed = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = children && children.length > 0;

  const handleClick = () => {
    if (hasChildren && !collapsed) {
      setIsExpanded(!isExpanded);
    }
    onClick?.();
  };

  return (
    <div className={cn("group", className)}>
      <button
        onClick={handleClick}
        aria-label={label}
        className={cn(
          "w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          "hover:bg-slate-100 active:scale-[0.98]",
          isActive
            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm"
            : "text-slate-600 hover:text-slate-900",
          collapsed ? "justify-center" : "gap-3"
        )}
        title={collapsed ? label : undefined}
      >
        <Icon className={cn(
          "size-5 shrink-0 transition-colors duration-200",
          isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"
        )} />
        
        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">{label}</span>
            
            {badge && (
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-semibold",
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
              )}>
                {badge}
              </span>
            )}
            
            {hasChildren && (
              <span className="text-slate-400 group-hover:text-slate-600">
                {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
              </span>
            )}
          </>
        )}
      </button>

      {/* Submenu */}
      {hasChildren && isExpanded && !collapsed && (
        <div className="mt-1 ml-8 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {children.map((child, index) => (
            <button
              key={index}
              onClick={child.onClick}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200",
                "hover:bg-slate-100 text-slate-600 hover:text-slate-900",
                child.isActive && "bg-blue-50 text-blue-700"
              )}
            >
              {child.icon && <child.icon className="size-4" />}
              <span>{child.label}</span>
              {child.badge && (
                <span className="ml-auto px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                  {child.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Professional User Profile Section
const UserProfile = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-200 group"
      >
        <div className="relative">
          <div className="size-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">
            {user?.name || 'User Name'}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {user?.email || 'user@example.com'}
          </p>
        </div>
        
        <ChevronDown className={cn(
          "size-4 text-slate-400 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl border border-slate-200 py-2 animate-in slide-in-from-bottom-2 duration-200">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <User className="size-4" />
            Profile Settings
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Settings className="size-4" />
            Preferences
          </button>
          <div className="border-t border-slate-100 my-2"></div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

// Main Professional Sidebar Component
const Sidebar = ({ 
  isOpen = false, 
  onClose,
  user = { name: 'John Doe', email: 'john@company.com' }
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('conversations');

  const navigationItems = [
    {
      id: 'conversations',
      icon: MessageSquare,
      label: 'Conversations',
      badge: '12',
      isActive: activeItem === 'conversations'
    },
    {
      id: 'projects',
      icon: Folder,
      label: 'Projects',
      isActive: activeItem === 'projects',
      children: [
        { label: 'Active Projects', badge: '8', isActive: false },
        { label: 'Completed', badge: '24', isActive: false },
        { label: 'Archived', icon: Archive, isActive: false }
      ]
    },
    {
      id: 'team',
      icon: Users,
      label: 'Team',
      isActive: activeItem === 'team'
    },
    {
      id: 'analytics',
      icon: BarChart3,
      label: 'Analytics',
      isActive: activeItem === 'analytics'
    }
  ];

  const bottomItems = [
    {
      id: 'help',
      icon: HelpCircle,
      label: 'Help & Support',
      isActive: activeItem === 'help'
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings',
      isActive: activeItem === 'settings'
    }
  ];

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-slate-900">AI Assistant</h1>
              <p className="text-xs text-slate-500">Chat Interface</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:inline-flex p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="size-4 text-slate-500" />
            ) : (
              <ChevronLeft className="size-4 text-slate-500" />
            )}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="size-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200"
            />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="px-4 mb-4">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="size-4" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className={cn("flex-1 space-y-1 overflow-y-auto professional-scrollbar", isCollapsed ? "px-2" : "px-4")}>
        {navigationItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={item.isActive}
            badge={item.badge}
            children={item.children}
            collapsed={isCollapsed}
            onClick={() => {
              setActiveItem(item.id);
              console.log(`Navigate to ${item.id}`);
            }}
          />
        ))}

        {/* Divider */}
        <div className="border-t border-slate-200 my-4"></div>

        {/* Recent Files */}
        {!isCollapsed && (
          <div className="pb-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
              Recent Chats
            </h3>
            <div className="space-y-1">
              {['Project Discussion', 'Meeting Notes', 'Code Review'].map((file, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <MessageSquare className="size-4 text-slate-400" />
                  <span className="truncate">{file}</span>
                  <Star className="size-3 text-slate-300 ml-auto hover:text-yellow-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-slate-200 p-4 space-y-1">
        {bottomItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={item.isActive}
            collapsed={isCollapsed}
            onClick={() => {
              setActiveItem(item.id);
              console.log(`Navigate to ${item.id}`);
            }}
          />
        ))}
        
        {/* Notifications */}
        {!isCollapsed && (
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200">
            <div className="relative">
              <Bell className="size-5" />
              <div className="absolute -top-1 -right-1 size-2 bg-red-500 rounded-full"></div>
            </div>
            <span>Notifications</span>
            <span className="ml-auto px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-semibold">3</span>
          </button>
        )}
      </div>

      {/* User Profile */}
      <div className="border-t border-slate-200 p-4">
        <UserProfile 
          user={user} 
          onLogout={() => console.log('Logout clicked')}
        />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:relative left-0 top-0 bottom-0 z-50 flex flex-col w-72 lg:w-72 overflow-hidden border-r border-slate-200/60 shadow-2xl glass-panel-strong transform transition-all duration-300 ease-out rounded-r-2xl lg:rounded-none",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isCollapsed && "lg:w-20"
      )}>
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
export { NavItem, UserProfile };