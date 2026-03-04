import { useEffect, useRef, useState } from "react";
import Avatar from '../assets/avatar.avif'
import { LuLayoutDashboard, LuFileStack, LuPhoneCall, LuMessageCircleMore, LuUsers, LuSettings } from "react-icons/lu";
import { IoAnalyticsOutline } from "react-icons/io5";
import SideLink from './SideLink';
import { Link } from 'react-router-dom';
import { useProtectedRoutes } from "../hooks/useProtectedRoutes";

function Sidebar() {
    const [expanded, setExpanded] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [me, ] = useProtectedRoutes()
    const username = me?.name ?? "User"

    useEffect(() => {
        const onDown = (e: PointerEvent) => {
            if (!expanded) return;
            const el = rootRef.current;
            if (el && !el.contains(e.target as Node)) setExpanded(false);
        };
        window.addEventListener("pointerdown", onDown);
        return () => window.removeEventListener("pointerdown", onDown);
    }, [expanded]);

    const handlePointerEnter = () => {
        if (window.matchMedia("(hover: hover)").matches) setExpanded(true);
    };
    const handlePointerLeave = () => {
        if (window.matchMedia("(hover: hover)").matches) setExpanded(false);
    };
    const handlePointerDown = () => {
        if (window.matchMedia("(hover: none)").matches) setExpanded((v) => !v);
    };

    const collapsedW = "w-16";
    const expandedW = "w-64";

    return (
        <div
            ref={rootRef}
            className={[
                "fixed left-0 top-0 z-40 h-screen",
                "border-r border-slate-200 dark:border-slate-200/25 dark:bg-slate-950 bg-white",
                "transition-all duration-200 ease-out",
                "md:w-64",
                "w-16",
                expanded ? expandedW : collapsedW,
            ].join(" ")}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onPointerDown={handlePointerDown}
            aria-expanded={expanded}
        >
            <div className="flex h-full flex-col p-3">
                <Link to="/" className="flex items-center gap-2 px-2 py-2">
                    <div className="h-9 w-9 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 grid place-items-center overflow-hidden">
                        <h1 className="text-zinc-950 dark:text-zinc-200">RC</h1>
                    </div>
                    <div
                        className={[
                            "min-w-0 overflow-hidden transition-all duration-200",
                            "hidden md:block",
                            expanded ? "block" : "hidden",
                        ].join(" ")}
                    >
                        <h1 className="text-zinc-950 dark:text-zinc-200">RoommateChat</h1>
                    </div>
                </Link>

                <nav className="mt-8 flex-1 space-y-1">
                    <SideLink expanded={expanded} name="Dashboard" link="/dashboard" Icon={LuLayoutDashboard} />
                    <SideLink expanded={expanded} name="Analytics" link="/analytics" Icon={IoAnalyticsOutline} />
                    <SideLink expanded={expanded} name="Files" link="/files" Icon={LuFileStack} />
                    <SideLink expanded={expanded} name="Calls" link="/calls" Icon={LuPhoneCall} />
                    <SideLink expanded={expanded} name="Messages" link="/chat" Icon={LuMessageCircleMore} />
                    <SideLink expanded={expanded} name="Community" link="/community" Icon={LuUsers} />
                    <SideLink expanded={expanded} name="Settings" link="/settings" Icon={LuSettings} />
                </nav>

                <div className="mt-3 flex items-center gap-3 px-2 py-2">
                    <img
                        src={Avatar}
                        alt=""
                        className={[
                            "rounded-full object-cover transition-all duration-300",
                            "md:h-10 md:w-10",
                            expanded ? "h-10 w-10" : "h-6 w-6"
                        ].join(" ")}
                    />

                    <div
                        className={[
                            "min-w-0 overflow-hidden transition-all duration-300",
                            "md:block",
                            expanded ? "block" : "hidden",
                        ].join(" ")}
                    >
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{username}</p>
                        <Link to="/logout" className="text-xs text-slate-400 hover:text-slate-500">
                            Log out
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;