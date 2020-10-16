import LinkedIn from "../assets/svg/linkedin.svg";
import GitHub from "../assets/svg/github.svg";
import Instagram from "../assets/svg/instagram.svg";

const links = [
  {
    href: "https://github.com/PompolutZ/personal-website",
    label: "GitHub",
    icon: <GitHub />,
  },
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
          <li>
            <a
              className="cursor-pointer outline-none hover:text-purple-500 focus:text-purple-300"
              href={link.href}
            >
              {link.icon}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
