import type { IconType } from "react-icons";
import { Link, useLocation } from "react-router-dom";

interface SideLinkProps {
    name: string;
    link: string;
    Icon: IconType;
}

function SideLink({name, link, Icon} : SideLinkProps) {
    const location = useLocation()
    const active = location.pathname === link ? "bg-blue-600 dark:bg-slate-800 text-white" : "text-black"
    return (
        <>
            <Link to={link} className={`w-full pl-2 pt-3 pb-3 mb-1 flex items-center ${active} dark:text-amber-50 hover:bg-blue-600 dark:hover:bg-slate-600 hover:text-white rounded-xl`}>
                <Icon />
                <p className='pl-6'>{name}</p>
            </Link>
        </>
    )
}

export default SideLink