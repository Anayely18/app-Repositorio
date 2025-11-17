import React from 'react';
import Logo from '../Logo';
import LinkSidebar from './LinkSidebar';
import CollapsibleLink from './CollapsibleLink';
import { ROUTES, isRouteGroup, isRouteLink } from '@/utils/routes';
import { Separator } from '@/components/ui/separator';
import { useSidebarStore } from '@/services/sidebarService';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar() {
    const { isOpen, toggle } = useSidebarStore();

    return (
        <aside
            className={`
                relative h-screen bg-secondary border-r border-white/10
                flex flex-col transition-all duration-300 ease-in-out
                ${isOpen ? 'w-[280px]' : 'w-[72px]'}
            `}
        >
            <div className='flex items-center justify-center h-16 border-b border-white/10 px-4'>
                {isOpen && <Logo />}
            </div>
            <button
                onClick={toggle}
                className='absolute -right-3 top-5 z-50 w-6 h-6 rounded-full bg-secondary border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-all duration-200 shadow-lg cursor-pointer'
                title={isOpen ? 'Colapsar sidebar' : 'Expandir sidebar'}
            >
                {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
            <nav className='flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent'>
                <ul className='space-y-1'>
                    {ROUTES.map((section, i) => (
                        <React.Fragment key={i}>
                            {i > 0 && <Separator className='my-4 bg-white/10' />}
                            {isOpen && (
                                <span className='block text-white/50 text-xs px-4 py-2 font-semibold uppercase tracking-wider'>
                                    {section.separator}
                                </span>
                            )}
                            {section.items.map((item, j) => (
                                <React.Fragment key={j}>
                                    {isRouteGroup(item) ? (
                                        <CollapsibleLink
                                            title={item.title}
                                            icon={item.icon}
                                            children={item.children}
                                            isCollapsed={!isOpen}
                                        />
                                    ) : isRouteLink(item) ? (
                                        <LinkSidebar
                                            title={item.title}
                                            path={item.path}
                                            icon={item.icon}
                                            isCollapsed={!isOpen}
                                        />
                                    ) : null}
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                </ul>
            </nav>
            {isOpen && (
                <div className='p-4 border-t border-white/10'>
                    <div className='text-xs text-white/50 text-center'>
                        © 2025 Sistema de Tesis
                    </div>
                </div>
            )}
        </aside>
    );
}