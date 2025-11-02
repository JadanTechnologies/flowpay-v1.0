

import React, { useState, useEffect, useMemo } from 'react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation, useNavigate } = ReactRouterDOM;
import { 
    LayoutDashboard, 
    ShoppingCart, 
    Package, 
    BarChart2, 
    Truck, 
    Settings, 
    ChevronLeft, 
    ChevronRight,
    ChevronDown,
    Zap,
    Store,
    Users,
    Receipt,
    Handshake,
    History,
    ClipboardList,
    UserSquare,
    Shuffle,
    Repeat,
    LogOut
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppContext } from '../../contexts/AppContext';
import { ModuleId } from '../../types';

interface NavItemProps {
    icon: React.ReactNode;
    text: string;
    to: string;
    active?: boolean;
    expanded: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, to, active, expanded }) => {
    return (
        <Link to={to}>
            <li className={`
                relative flex items-center py-2 px-3 my-1
                font-medium rounded-md cursor-pointer
                transition-colors group
                ${active 
                    ? 'bg-primary/20 text-primary'
                    : 'hover:bg-surface text-text-secondary'
                }
            `}>
                {icon}
                <span className={`overflow-hidden transition-all ${expanded ? 'w-40 ml-3' : 'w-0'}`}>{text}</span>
                {!expanded && (
                    <div className={`
                        absolute left-full rounded-md px-2 py-1 ml-6
                        bg-surface text-text-primary text-sm
                        invisible opacity-20 -translate-x-3 transition-all
                        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                    `}>
                        {text}
                    </div>
                )}
            </li>
        </Link>
    );
};

interface SubNavItemProps {
    text: string;
    to: string;
    active?: boolean;
}

const SubNavItem: React.FC<SubNavItemProps> = ({ text, to, active }) => {
    return (
        <Link to={to}>
            <li className={`
                relative flex items-center py-1.5 px-3 my-1
                text-sm font-medium rounded-md cursor-pointer
                transition-colors group
                ${active 
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-surface/50 text-text-secondary'
                }
            `}>
                 <div className={`
                    w-1.5 h-1.5 mr-3 rounded-full transition-colors
                    ${active ? 'bg-primary' : 'bg-text-secondary/50 group-hover:bg-text-primary'}
                `}></div>
                <span>{text}</span>
            </li>
        </Link>
    );
};

const Sidebar: React.FC = () => {
    const [expanded, setExpanded] = useState(true);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const location = useLocation();
    const { t } = useTranslation();
    const { logout, userSubscription, subscriptionPlans } = useAppContext();
    const navigate = useNavigate();

    const enabledModules = useMemo(() => {
        if (!userSubscription || !subscriptionPlans) return new Set<ModuleId>();
        const currentPlan = subscriptionPlans.find(p => p.name.toLowerCase() === userSubscription.planId);
        return new Set(currentPlan?.enabledModules || []);
    }, [userSubscription, subscriptionPlans]);

    const handleSignOut = async () => {
        if (window.confirm('Are you sure you want to sign out?')) {
            await logout();
            navigate('/login');
        }
    };

    const isActive = (path: string) => location.pathname.startsWith(path);
    const isSubNavItemActive = (path: string) => location.pathname === path;

    const allNavItems = [
        { id: 'dashboard', icon: <LayoutDashboard size={20} />, text: t('dashboard'), to: '/app/dashboard' },
        { id: 'pos', icon: <ShoppingCart size={20} />, text: t('pos'), to: '/app/pos' },
        { 
            id: 'inventory',
            icon: <Package size={20} />, 
            text: t('inventory'), 
            basePath: '/app/inventory',
            children: [
                { text: t('products'), to: '/app/inventory' },
                { text: t('purchaseOrders'), to: '/app/inventory/purchase-orders' },
                { text: t('stockTransfers'), to: '/app/inventory/stock-transfers' },
                { text: t('stockCounts'), to: '/app/inventory/stock-counts' },
                { text: t('suppliers'), to: '/app/inventory/suppliers' },
                { text: t('history'), to: '/app/inventory/history' },
            ]
        },
        { id: 'reports', icon: <BarChart2 size={20} />, text: t('reports'), to: '/app/accounting' },
        { 
            id: 'logistics',
            icon: <Truck size={20} />, 
            text: t('logistics'), 
            basePath: '/app/logistics',
            children: [
                { text: 'Dashboard', to: '/app/logistics' },
                { text: 'Consignments', to: '/app/logistics/consignments' },
                { text: 'Fleet Management', to: '/app/logistics/fleet' },
            ]
        },
        { id: 'branches', icon: <Store size={20} />, text: t('branches'), to: '/app/branches' },
        { id: 'staff', icon: <Users size={20} />, text: t('staff'), to: '/app/staff' },
        { id: 'automations', icon: <Repeat size={20} />, text: t('automations'), to: '/app/automations' },
        { id: 'invoicing', icon: <Receipt size={20} />, text: t('invoicing'), to: '/app/invoicing' },
        { id: 'credit_management', icon: <Handshake size={20} />, text: t('creditManagement'), to: '/app/credit-management' },
        { id: 'activityLog', icon: <History size={20} />, text: t('activityLog'), to: '/app/activity' },
    ];
    
    const navItems = useMemo(() => allNavItems.filter(item => enabledModules.has(item.id as ModuleId)), [enabledModules]);

    const bottomNavItems = [
        { icon: <Settings size={20} />, text: t('settings'), to: '/app/settings' },
    ];
    
    useEffect(() => {
        let isSubmenuActive = false;
        for (const item of navItems) {
            if (item.children && item.basePath && isActive(item.basePath)) {
                setOpenSubMenu(item.text);
                isSubmenuActive = true;
                break; 
            }
        }
    }, [location.pathname, navItems]);

    const handleSubMenuToggle = (text: string) => {
        setOpenSubMenu(openSubMenu === text ? null : text);
    };


    return (
        <aside className="h-screen sticky top-0">
            <nav className="h-full flex flex-col bg-surface border-r border-border shadow-sm">
                <div className={`p-4 pb-2 flex ${expanded ? 'justify-between' : 'justify-center'} items-center`}>
                    <div className={`flex items-center gap-2 overflow-hidden transition-all ${expanded ? 'w-32' : 'w-0'}`}>
                        <Zap className="text-primary" size={28}/>
                        <span className="font-bold text-xl text-text-primary">FlowPay</span>
                    </div>
                    <button onClick={() => setExpanded(curr => !curr)} className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600">
                        {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>

                <ul className="flex-1 px-3">
                    {navItems.map((item, index) => (
                        item.children ? (
                            <li key={index}>
                                <div
                                    onClick={() => handleSubMenuToggle(item.text)}
                                    className={`
                                        relative flex items-center justify-between py-2 px-3 my-1
                                        font-medium rounded-md cursor-pointer
                                        transition-colors group
                                        ${item.basePath && isActive(item.basePath)
                                            ? 'bg-primary/20 text-primary'
                                            : 'hover:bg-surface text-text-secondary'
                                        }
                                    `}
                                >
                                    <div className="flex items-center">
                                        {item.icon}
                                        <span className={`overflow-hidden transition-all ${expanded ? 'w-36 ml-3' : 'w-0'}`}>{item.text}</span>
                                    </div>
                                    {expanded && <ChevronDown size={16} className={`transition-transform ${openSubMenu === item.text ? 'rotate-180' : ''}`} />}
                                </div>
                                <div className={`overflow-hidden transition-all duration-300 ${openSubMenu === item.text && expanded ? 'max-h-60' : 'max-h-0'}`}>
                                    <ul className="pl-6 pt-1">
                                        {item.children.map(child => (
                                            <SubNavItem key={child.to} {...child} active={isSubNavItemActive(child.to)} />
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        ) : (
                            // @ts-ignore
                            <NavItem key={index} {...item} active={isActive(item.to)} expanded={expanded} />
                        )
                    ))}
                </ul>


                <ul className="px-3">
                     {bottomNavItems.map((item, index) => (
                        <NavItem key={index} {...item} active={isActive(item.to)} expanded={expanded} />
                    ))}
                </ul>

                <div className="px-3 py-2">
                    <button onClick={handleSignOut} className="w-full">
                         <div className={`
                            relative flex items-center py-2 px-3
                            font-medium rounded-md cursor-pointer
                            transition-colors group text-red-400 hover:bg-red-900/50
                        `}>
                            <LogOut size={20} />
                            <span className={`overflow-hidden transition-all ${expanded ? 'w-40 ml-3' : 'w-0'}`}>Sign Out</span>
                        </div>
                    </button>
                </div>

                <div className="border-t border-border flex p-3">
                    <img src="https://picsum.photos/seed/user/100/100" alt="avatar" className="w-10 h-10 rounded-md" />
                    <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? 'w-40 ml-3' : 'w-0'}`}>
                        <div className="leading-4">
                            <h4 className="font-semibold text-text-primary">Admin User</h4>
                            <span className="text-xs text-text-secondary">admin@flowpay.com</span>
                        </div>
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
