import { Bell, Search, User } from 'lucide-react';

export default function Navbar() {
    return (
        <header className='sticky top-0 z-30 bg-secondary h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-8 text-white shadow-lg'>
            <div className='flex items-center gap-4'>
                <div className='hidden md:flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 w-80'>
                    <Search size={18} className='text-white/60' />
                    <input
                        type='text'
                        placeholder='Buscar tesis, estudiantes...'
                        className='bg-transparent border-none outline-none text-sm text-white placeholder:text-white/50 w-full'
                    />
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <button className='md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors'>
                    <Search size={20} />
                </button>
                <button className='relative p-2 rounded-lg hover:bg-white/10 transition-colors'>
                    <Bell size={20} />
                    <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
                </button>
                <button className='flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors'>
                    <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
                        <User size={18} />
                    </div>
                    <span className='hidden md:block text-sm font-medium'>Admin</span>
                </button>
            </div>
        </header>
    );
}