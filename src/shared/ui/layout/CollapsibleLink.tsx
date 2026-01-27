import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon, ChevronDown } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ChildRoute {
    title: string;
    path: string;
    icon: LucideIcon;
}

interface CollapsibleLinkProps {
    title: string;
    icon: LucideIcon;
    children: ChildRoute[];
    isCollapsed: boolean;
}

export default function CollapsibleLink({
    title,
    icon: Icon,
    children,
    isCollapsed
}: CollapsibleLinkProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLLIElement>(null);
    const location = useLocation();

    const isChildActive = children.some(child =>
        location.pathname.includes(child.path)
    );

    useEffect(() => {
        if (isHovered && buttonRef.current && isCollapsed) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.top,
                left: rect.right + 8
            });
        }
    }, [isHovered, isCollapsed]);

    return (
        <>
            <li
                ref={buttonRef}
                className='relative'
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        w-full flex items-center rounded-lg cursor-pointer transition-all duration-200
                        ${isCollapsed ? 'px-3 py-2.5 justify-center' : 'px-4 py-2.5 justify-between'}
                        ${isChildActive
                            ? "bg-white text-secondary"
                            : "text-white hover:bg-white/10"
                        }
                    `}
                >
                    <div className='flex items-center gap-x-3'>
                        <Icon size={18} className='shrink-0' />
                        {!isCollapsed && (
                            <span className='text-sm font-medium'>{title}</span>
                        )}
                    </div>
                    {!isCollapsed && (
                        <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                    )}
                </button>
                <AnimatePresence>
                    {isOpen && !isCollapsed && (
                        <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className='overflow-hidden ml-4 mt-1 space-y-1'
                        >
                            {children.map((child, index) => (
                                <li key={index}>
                                    <NavLink
                                        to={child.path}
                                        className={({ isActive }) =>
                                            `
                                            flex items-center gap-x-3 px-4 py-2 rounded-lg text-sm transition-all duration-200
                                            ${isActive
                                                ? "bg-white text-secondary font-medium"
                                                : "text-white/80 hover:bg-white/10 hover:text-white"
                                            }
                                            `
                                        }
                                    >
                                        <child.icon size={16} className='shrink-0' />
                                        <span>{child.title}</span>
                                    </NavLink>
                                </li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </li>
            {isCollapsed && createPortal(
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            style={{
                                position: 'fixed',
                                top: `${position.top}px`,
                                left: `${position.left}px`,
                                zIndex: 9999
                            }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <div className='bg-secondary border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-[200px]'>
                                <div className='px-4 py-2 border-b border-white/10'>
                                    <span className='text-sm font-semibold text-white'>{title}</span>
                                </div>
                                <ul className='py-2'>
                                    {children.map((child, index) => (
                                        <li key={index}>
                                            <NavLink
                                                to={child.path}
                                                className={({ isActive }) =>
                                                    `
                                                    flex items-center gap-x-3 px-4 py-2 text-sm transition-all duration-200
                                                    ${isActive
                                                        ? "bg-white text-secondary font-medium"
                                                        : "text-white/80 hover:bg-white/10 hover:text-white"
                                                    }
                                                    `
                                                }
                                            >
                                                <child.icon size={16} className='shrink-0' />
                                                <span>{child.title}</span>
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}