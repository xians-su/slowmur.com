import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

// 定義 Link 物件的接口
interface Link {
  id: string;
  title: string;
  level: number;
  active?: boolean;
}

// 定義組件 props 的接口
interface SideTOCProps {
  links: Link[];
  posRef: React.RefObject<HTMLElement>;
  anchorName: string;
  minLevel: number;
  visibleHeight?: number;
  pause: boolean;
}

const SideTOC: React.FC<SideTOCProps> = ({
  links: _links,
  posRef,
  anchorName,
  minLevel,
  visibleHeight = 48,
  pause,
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [anchor, setAnchor] = useState<number>(0);
  const [links, setLinks] = useState<Link[]>(_links);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const tocRef = useRef<HTMLElement | null>(null);

  const getActiveLinkID = (): string | undefined => {
    return Array.from(document.querySelectorAll(`.${anchorName}`))
      .map((anchor) => ({
        top: anchor.getBoundingClientRect().top,
        id: anchor.id,
      }))
      .filter((item) => item.top <= 10)
      .sort((a, b) => b.top - a.top)[0]?.id;
  };

  useEffect(() => {
    if (pause) return;

    setLinks(
      _links.reduce((prev: Link[], curr: Link) => {
        if (curr.id === activeLink) {
          prev.push({ ...curr, active: true });
        } else prev.push({ ...curr, active: false });
        return prev;
      }, [])
    );

    const active = document.getElementById(`link-${activeLink}`)?.offsetTop || 0;

    tocRef.current?.scrollTo({ top: active - 100, behavior: "smooth" });
  }, [activeLink, pause, _links]);

  const handleScrollDirection = () => {
    setActiveLink(getActiveLinkID());
    if (window.scrollY < visibleHeight) {
      setShow(false);
    } else {
      setShow(true);
    }
  };

  const handleResize = () => {
    setAnchor(posRef.current?.getBoundingClientRect().right || 0);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("scroll", handleScrollDirection);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScrollDirection);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (links.length === 0) return null;

  return ReactDOM.createPortal(
    <nav
      ref={tocRef}
      className={`toc fixed top-24 bottom-8 w-[100%] origin-[0_0] overflow-y-auto border-gray-300 dark:border-gray-700 opacity-0 scale-0 lg:opacity-100 lg:scale-100 ${
        show ? "scale-100" : "lg:scale-0 lg:opacity-0"
      }`}
      style={{
        left: `${anchor + 40}px`,
      }}
    >
      <ul className="border-gray-300 dark:border-gray-700 border-l-[1px]">
        {links.map(({ id, title, level, active }) => (
          <li
            key={id}
            id={`link-${id}`}
            className={active ? "active-anchor-link" : ""}
            style={{ marginLeft: `${level - minLevel}rem` }}
          >
            <a href={`#${id}`}>{title}</a>
          </li>
        ))}
      </ul>
    </nav>,
    document.body
  );
};

export default React.memo(SideTOC);
