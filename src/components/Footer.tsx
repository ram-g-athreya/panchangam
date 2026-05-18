import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import "../styles/Footer.css";

const LINKS = [
  { icon: faMessage, href: "https://forms.gle/p5isyKzeZi2XihNC6", label: "Feedback" },
  { icon: faGithub, href: "https://github.com/ram-g-athreya/panchangam", label: "GitHub" },
  { icon: faXTwitter, href: "https://x.com/TheButterThief", label: "X / Twitter" },
] as const;

export function Footer() {
  return (
    <footer className="footer">
      {LINKS.map(({ icon, href, label }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="footer__link"
          aria-label={label}
        >
          <FontAwesomeIcon icon={icon} />
        </a>
      ))}
    </footer>
  );
}
