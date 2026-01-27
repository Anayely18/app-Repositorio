import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface LinkProps {
    title: string;
    icon: LucideIcon;
    path: string;
    isCollapsed: boolean;
}

export default function LinkSidebar({
    title,
    icon: Icon,
    path,
    isCollapsed
}: LinkProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const linkRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        if (isHovered && linkRef.current && isCollapsed) {
            const rect = linkRef.current.getBoundingClientRect();
            setPosition({
                top: rect.top,
                left: rect.right + 8
            });
        }
    }, [isHovered, isCollapsed]);

    return (
        <>
            <li
                ref={linkRef}
                className='relative'
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <NavLink
                    to={path}
                    className={({ isActive }) =>
                        `
                        flex items-center gap-x-3 rounded-lg transition-all duration-200
                        ${isCollapsed ? 'px-3 py-2.5 justify-center' : 'px-4 py-2.5'}
                        ${isActive
                            ? "bg-white text-secondary font-medium shadow-sm"
                            : "text-white hover:bg-white/10"
                        }
                        `
                    }
                >
                    <Icon size={18} className='shrink-0' />
                    {!isCollapsed && (
                        <span className='text-sm font-medium'>{title}</span>
                    )}
                </NavLink>
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
                            className='pointer-events-none'
                        >
                            <div className='bg-secondary border border-white/10 rounded-lg px-4 py-2 shadow-xl whitespace-nowrap'>
                                <span className='text-sm font-medium text-white'>{title}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}