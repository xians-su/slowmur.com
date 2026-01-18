import classNames from 'classnames';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { SunIcon } from '@heroicons/react/24/solid';
import { MoonIcon } from '@heroicons/react/24/solid';
import BLOG from '~/blog.config';
import { fetchLocaleLang } from '~/lib/i18n/lang';
import { Twemoji } from './Twemoji';

const locale = fetchLocaleLang();
const links = [
  { id: 1, name: locale.NAV.INDEX, to: BLOG.path || '/', show: true },
  { id: 2, name: locale.NAV.ABOUT, to: '/about', show: BLOG.showAbout },
  { id: 3, name: locale.NAV.RSS, to: '/feed', show: true },
];

const NavBar: React.FC = () => {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  const activeNav = useMemo(() => {
    if (router.asPath === links[0].to) return links[0].to;
    if (router.asPath === links[1].to) return links[1].to;
    return links[0].to;
  }, [router]);

  // Use resolvedTheme if available, otherwise fall back to default appearance
  // This prevents showing wrong icon when resolvedTheme is still undefined
  const isDark = resolvedTheme !== undefined ? resolvedTheme === 'dark' : BLOG.appearance === 'dark';

  return (
    <div className="shrink-0">
      <ul className="flex flex-row items-center">
        {links.map(
          (link) =>
            link.show && (
              <li
                key={link.id}
                className={classNames('block ml-4 text-black dark:text-gray-50 nav', {
                  'border-b-2 border-blue-700 dark:border-blue-400': link.to === activeNav,
                })}
              >
                <Link href={link.to}>{link.name}</Link>
              </li>
            ),
        )}
        <li className="ml-4">
          <button
            className="group block rounded-full bg-night p-1 transition-all duration-300 hover:bg-day dark:bg-day dark:hover:bg-night"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label="toggle Dark Mode"
          >
            <div className="relative size-5">
              <MoonIcon className="absolute inset-0 text-day opacity-100 transition-opacity duration-300 dark:opacity-0" />
              <SunIcon className="absolute inset-0 text-night opacity-0 transition-opacity duration-300 dark:opacity-100" />
            </div>
          </button>
        </li>
      </ul>
    </div>
  );
};

type HeaderProps = {
  navBarTitle: string | null;
  fullWidth?: boolean;
};

export const Header: React.FC<HeaderProps> = ({ navBarTitle, fullWidth }) => {
  const navRef = useRef<HTMLDivElement>(null);
  const sentinalRef = useRef<HTMLDivElement>(null);
  const handler = useCallback(([entry]: IntersectionObserverEntry[]) => {
    if (navRef && navRef.current && !BLOG.autoCollapsedNavBar) {
      if (!entry.isIntersecting && entry !== undefined) {
        navRef.current.classList.add('sticky-nav-full');
      } else {
        navRef.current.classList.remove('sticky-nav-full');
      }
    } else {
      navRef?.current?.classList.add('remove-sticky');
    }
  }, []);
  useEffect(() => {
    const observer = new window.IntersectionObserver(handler);
    const currentSentinel = sentinalRef.current;
    if (currentSentinel) observer.observe(currentSentinel);
    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [handler]);
  return (
    <>
      <div className="h-4 md:h-12" ref={sentinalRef}></div>
      <div
        className={classNames(
          'sticky-nav m-auto w-full h-6 flex flex-row justify-between items-center mb-2 md:mb-12 py-8 bg-opacity-60',
          {
            'px-4 md:px-24': fullWidth,
            'max-w-2xl px-4': !fullWidth,
          },
        )}
        id="sticky-nav"
        ref={navRef}
      >
        <div className="flex items-center">
          <Link href="/" aria-label={BLOG.title}>
            <div className="min-w-max">
              <Twemoji emoji={'💬'} size={28} />
            </div>
          </Link>
          {navBarTitle ? (
            <p className="header-name ml-2 font-medium text-day dark:text-night">{navBarTitle}</p>
          ) : (
            <p className="header-name ml-2 font-medium text-day dark:text-night">
              {BLOG.title} -<span className="font-normal">{BLOG.description}</span>
            </p>
          )}
        </div>
        <NavBar />
      </div>
    </>
  );
};
