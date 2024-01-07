import classNames from 'classnames';
import 'gitalk/dist/gitalk.css';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ExtendedRecordMap } from 'notion-types/build/esm/maps';
import { NotionRenderer, Equation, Code, CollectionRow, Collection } from 'react-notion-x';
import type { Tweet } from 'react-static-tweets';
import BLOG from '~/blog.config';
import { Container } from '~/components';
import { Comments } from '~/components/Comment';
import { TagItem } from '~/components/Tag';
import formatDate from '~/lib/formatDate';
import { useLocale } from '~/lib/i18n/locale';
import { Post } from '~/types';
//
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
  const activeId = getActiveLinkID();
  setActiveLink(activeId !== undefined ? activeId : null); // 使用三元運算符來確保傳遞 string | null 而非 undefined
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
//
const enableCommentArea = BLOG.comment.provider !== '';

const mapPageUrl = (id: string) => {
  return 'https://www.notion.so/' + id.replace(/-/g, '');
};

type Props = {
  blockMap: ExtendedRecordMap;
  post: Post;
  emailHash: string;
  fullWidth?: boolean;
  onlyContents?: boolean;
  tweet?: typeof Tweet;
  slug?: string | null;
};

export const Layout: React.VFC<Props> = ({
  blockMap,
  post,
  emailHash,
  tweet,
  slug,
  fullWidth = false,
  onlyContents = false,
}) => {
  const locale = useLocale();
  const router = useRouter();
  const { theme } = useTheme();

  const renderContents = () => (
    <article>
      <h1 className="text-3xl font-bold text-black dark:text-white">{post.title}</h1>
      {post?.type?.[0] !== 'Page' && (
        <nav className="flex items-start mt-7 mb-4 text-gray-500 dark:text-gray-300">
          <div className="flex mb-4">
            <a href={BLOG.socialLink || '#'} className="flex">
              <Image
                alt={BLOG.author}
                width={24}
                height={24}
                src={`https://gravatar.com/avatar/${emailHash}`}
                className="rounded-full"
              />
              <p className="md:block ml-2">{BLOG.author}</p>
            </a>
            <span className="block">&nbsp;/&nbsp;</span>
          </div>
          <div className="mr-2 mb-4 md:ml-0">{formatDate(post?.date?.start_date || post.createdTime, BLOG.lang)}</div>
          {post.tags && (
            <div className="flex overflow-x-auto flex-nowrap max-w-full article-tags">
              {post.tags.map((tag) => (
                <TagItem key={tag} tag={tag} />
              ))}
            </div>
          )}
        </nav>
      )}
      {blockMap && (
        <div className="-mt-4 mb-4 notion-ignore-padding-x">
          <NotionRenderer
            recordMap={blockMap}
            components={{
              equation: Equation,
              code: Code,
              collection: Collection,
              collectionRow: CollectionRow,
              tweet: tweet,
            }}
            mapPageUrl={mapPageUrl}
            darkMode={theme !== 'light'}
          />
        </div>
      )}
    </article>
  );
  return onlyContents ? (
    renderContents()
  ) : (
    <Container
      layout="blog"
      title={post.title}
      description={post.summary}
      date={new Date(post.createdTime).toISOString()}
      type="article"
      fullWidth={fullWidth}
      slug={slug}
    >
      {renderContents()}
      <div
        className={classNames('flex justify-between font-medium text-gray-500 dark:text-gray-400', {
          'mb-4': enableCommentArea,
        })}
      >
        <button
          onClick={() => router.push(BLOG.path || '/')}
          className="mt-2 hover:text-black dark:hover:text-gray-100 cursor-pointer"
        >
          ← {locale?.POST.BACK}
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-2 hover:text-black dark:hover:text-gray-100 cursor-pointer"
        >
          ↑ {locale?.POST.TOP}
        </button>
      </div>
      <Comments post={post} />
    </Container>
  );
};
