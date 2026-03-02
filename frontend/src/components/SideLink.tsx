import type { IconType } from "react-icons";
import { Link, useLocation } from "react-router-dom";

interface SideLinkProps {
  name: string;
  link: string;
  Icon: IconType;
  expanded?: boolean;
}

function SideLink({ name, link, Icon, expanded = false }: SideLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === link;

  return (
    <Link
      to={link}
      className={[
        "group flex items-center gap-3 rounded-xl px-3 py-3",
        "transition-colors",
        isActive
          ? "bg-blue-600 text-white dark:bg-slate-800"
          : "text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-slate-700",
      ].join(" ")}
      title={!expanded ? name : undefined}
    >
      <span className="text-xl shrink-0">
        <Icon />
      </span>

      <span
        className={[
          "text-sm font-medium whitespace-nowrap overflow-hidden",
          "hidden md:inline",
          expanded ? "inline" : "hidden",
        ].join(" ")}
      >
        {name}
      </span>
    </Link>
  );
}

export default SideLink;