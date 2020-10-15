import Link from "next/link";
import LinkedIn from "../assets/svg/linkedin.svg";
import GitHub from "../assets/svg/github.svg";
import Instagram from "../assets/svg/instagram.svg";

const links = [
  { href: "https://github.com/PompolutZ", label: "GitHub", icon: <GitHub /> },
  {
    href: "https://www.linkedin.com/in/olehlutsenko/",
    label: "LinkedIn",
    icon: <LinkedIn />,
  },
  {
    href: "https://www.instagram.com/amateurlunchpainter/",
    label: "Instagram",
    icon: <Instagram />,
  },
];

export default function Nav() {
  return (
    <nav>
      <ul className="flex justify-evenly w-48 p-4">
        {links.map((link) => (
          <Link key={link.label} href={link.href}>
            <li className="cursor-pointer hover:text-purple-500">
              {link.icon}
            </li>
          </Link>
        ))}
      </ul>
    </nav>
  );
}
