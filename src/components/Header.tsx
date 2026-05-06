import { library, findIconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { CitySearch } from "./CitySearch";
import "../styles/Header.css";

library.add(faBars);

const barsIcon = findIconDefinition({ prefix: "fas", iconName: "bars" });

interface HeaderProps {
  onOpenSidebar: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__top">
        <button className="header__hamburger" onClick={onOpenSidebar} aria-label="Open navigation">
          <FontAwesomeIcon icon={barsIcon} />
        </button>
        <Link to="/" className="header__title">
          Panchangam
        </Link>
        <CitySearch />
      </div>
    </header>
  );
}
