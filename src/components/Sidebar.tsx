import { library, findIconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faHouse, faHandsPraying } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

library.add(faHouse, faHandsPraying);

const houseIcon = findIconDefinition({ prefix: "fas", iconName: "house" });
const handsPrayingIcon = findIconDefinition({ prefix: "fas", iconName: "hands-praying" });

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navClass = ({ isActive }: { isActive: boolean }): string =>
    `sidebar__nav-link${isActive ? " sidebar__nav-link--active" : ""}`;

  return (
    <div className={`sidebar-overlay${isOpen ? " sidebar-overlay--open" : ""}`} onClick={onClose}>
      <aside
        className={`sidebar${isOpen ? " sidebar--open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="sidebar__nav">
          <NavLink to="/" end className={navClass} onClick={onClose}>
            <FontAwesomeIcon icon={houseIcon} className="sidebar__nav-icon" />
            Home
          </NavLink>
          <NavLink to="/sankalpam" className={navClass} onClick={onClose}>
            <FontAwesomeIcon icon={handsPrayingIcon} className="sidebar__nav-icon" />
            Sankalpam
          </NavLink>
        </nav>
      </aside>
    </div>
  );
}
