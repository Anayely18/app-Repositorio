import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className='min-h-svh flex overflow-hidden'>
            <Sidebar />
            <div className='flex flex-col flex-1 h-svh'>
                <Navbar />
                <main className='flex-1 p-4 overflow-y-auto'>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    )
}
