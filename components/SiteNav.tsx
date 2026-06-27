import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/chairs', label: 'Chairs' },
  { href: '/garments', label: 'Garments' },
];

export default function SiteNav() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-[120] flex items-center justify-between px-5 py-5 text-[10px] uppercase tracking-[0.36em] text-[#f7f5ef] mix-blend-difference md:px-8">
      <Link
        href="/"
        className="font-semibold tracking-[0.26em] transition-opacity duration-500 hover:opacity-55"
      >
        APSIS
      </Link>

      <div className="flex items-center gap-5 md:gap-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="transition-opacity duration-500 hover:opacity-55"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
