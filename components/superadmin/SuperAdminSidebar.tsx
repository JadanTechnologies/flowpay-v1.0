





import React, { useState, useMemo } from 'react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    CreditCard, 
    Settings,
    ChevronLeft, 
    ChevronRight,
    Zap,
    Megaphone,
    FileText,
    Users2,
    Clock,
    DollarSign,
    Ban,
    ToggleRight
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

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


const SuperAdminSidebar: React.FC = () => {
    const [expanded, setExpanded] = useState(true);
    const location = useLocation();
    const { session } = useAppContext();

    const navSections = [
        {
            title: 'Core',
            items: [
                { icon: <LayoutDashboard size={20} />, text: 'Dashboard', to: '/admin/dashboard' },
            ]
        },
        {
            title: 'Tenants',
            items: [
                { icon: <Users size={20} />, text: 'Tenants', to: '/admin/tenants' },
                { icon: <CreditCard size={20} />, text: 'Subscriptions', to: '/admin/subscriptions' },
                { icon: <DollarSign size={20} />, text: 'Payments', to: '/admin/payments' },
            ]
        },
        {
            title: 'Communications',
            items: [
                { icon: <Megaphone size={20} />, text: 'Announcements', to: '/admin/announcements' },
                { icon: <FileText size={20} />, text: 'Templates', to: '/admin/templates' },
            ]
        },
        {
            title: 'Platform',
            items: [
                 { icon: <Users2 size={20} />, text: 'Team', to: '/admin/team' },
                 { icon: <ToggleRight size={20} />, text: 'Feature Control', to: '/admin/feature-control' },
                 { icon: <Clock size={20} />, text: 'Cron Jobs', to: '/admin/cron-jobs' },
                 { icon: <Ban size={20} />, text: 'Access Control', to: '/admin/access-control' },
                 { icon: <Settings size={20} />, text: 'System Settings', to: '/admin/system-settings' },
            ]
        }
    ];

    const userName = useMemo(() => session?.user?.name || 'Super Admin', [session]);
    const userEmail = useMemo(() => session?.user?.email || 'owner@flowpay.com', [session]);

    return (
        <aside className="h-screen sticky top-0">
            <nav className="h-full flex flex-col bg-surface border-r border-border shadow-sm">
                <div className={`p-4 pb-2 flex ${expanded ? 'justify-between' : 'justify-center'} items-center`}>
                    <div className={`flex items-center gap-2 overflow-hidden transition-all ${expanded ? 'w-40' : 'w-0'}`}>
                        <Zap className="text-primary" size={28}/>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl text-text-primary">FlowPay</span>
                            <span className="text-xs text-secondary">Admin</span>
                        </div>
                    </div>
                    <button onClick={() => setExpanded(curr => !curr)} className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600">
                        {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>

                <ul className="flex-1 px-3 mt-4">
                    {navSections.map((section, sectionIndex) => (
                        <React.Fragment key={section.title}>
                             {expanded && <li className="text-xs font-bold text-text-secondary uppercase px-3 mt-4 mb-2">{section.title}</li>}
                             {section.items.map((item, index) => (
                                <NavItem key={item.to} {...item} active={location.pathname.startsWith(item.to)} expanded={expanded} />
                            ))}
                        </React.Fragment>
                    ))}
                </ul>

                <div className="border-t border-border flex p-3">
                    <img src="https://picsum.photos/seed/superadmin/100/100" alt="avatar" className="w-10 h-10 rounded-md" />
                    <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? 'w-40 ml-3' : 'w-0'}`}>
                        <div className="leading-4">
                            <h4 className="font-semibold text-text-primary">{userName}</h4>
                            <span className="text-xs text-text-secondary">{userEmail}</span>
                        </div>
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default SuperAdminSidebar;