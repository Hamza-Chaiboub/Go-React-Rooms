import LogoMaster from '../assets/logo-master.png'
import Avatar from '../assets/avatar.avif'
import { LuLayoutDashboard, LuFileStack, LuPhoneCall, LuMessageCircleMore, LuUsers, LuSettings } from "react-icons/lu";
import { IoAnalyticsOutline } from "react-icons/io5";
import SideLink from './SideLink';
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div className="flex flex-col h-screen p-4 w-64 border-r border-r-slate-200 dark:border-r-slate-200/50 fixed dark:bg-slate-950">
            <a href='/' className="flex-none pl-2">
                <img src={LogoMaster} alt="" className='w-64 object-fill' />
            </a>
            <div className="flex flex-col justify-start pt-12 grow">
                <SideLink name='Dashboard' link='/dashboard' Icon={LuLayoutDashboard} />
                <SideLink name='Analytics' link='/analytics' Icon={IoAnalyticsOutline} />
                <SideLink name='Files' link='/files' Icon={LuFileStack} />
                <SideLink name='Calls' link='/calls' Icon={LuPhoneCall} />
                <SideLink name='Messages' link='/chat' Icon={LuMessageCircleMore} />
                <SideLink name='Community' link='/community' Icon={LuUsers} />
                <SideLink name='Settings' link='/settings' Icon={LuSettings} />
            </div>
            <div className="flex items-center flex-none pl-2">
                <img src={Avatar} alt="" className='rounded-full w-12 h-12 object-cover mr-4' />
                <div>
                    <p className='text-md dark:text-white'>Hamza</p>
                    <Link to='/logout' className='text-xs text-slate-400'>Log out</Link>
                </div>
            </div>
        </div>
    )
}

export default Sidebar