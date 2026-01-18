import classNames from 'classnames';
import 'gitalk/dist/gitalk.css';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type { ExtendedRecordMap } from 'notion-types';
import { NotionRenderer } from 'react-notion-x';
import BLOG from '~/blog.config';

// Dynamic imports for react-notion-x components
const Code = dynamic(() => import('react-notion-x/build/third-party/code').then((m) => m.Code), { ssr: false });
const Collection = dynamic(() => import('react-notion-x/build/third-party/collection').then((m) => m.Collection), {
  ssr: false,
});
const Equation = dynamic(() => import('react-notion-x/build/third-party/equation').then((m) => m.Equation), {
  ssr: false,
});
import { Container } from '~/components';
import { Comments } from '~/components/Comment';
import { TagItem } from '~/components/Tag';
import formatDate from '~/lib/formatDate';
import { useLocale } from '~/lib/i18n/locale';
import { Post } from '~/types';
import { useEffect, useRef, useState } from 'react';

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
  slug?: string | null;
};

export const Layout: React.FC<Props> = ({
  blockMap,
  post,
  emailHash,
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
        <nav className="mb-4 mt-7 flex items-start text-gray-500 dark:text-gray-300">
          <div className="mb-4 flex">
            <a href={BLOG.socialLink || '#'} className="flex">
              <Image
                alt={BLOG.author}
                width={24}
                height={24}
                src={`https://gravatar.com/avatar/${emailHash}?s=80`}
                className="rounded-full"
              />
              <p className="ml-2 md:block">{BLOG.author}</p>
            </a>
            <span className="block">&nbsp;/&nbsp;</span>
          </div>
          <div className="mb-4 mr-2 md:ml-0">{formatDate(post?.date?.start_date || post.createdTime, BLOG.lang)}</div>
          {post.tags && (
            <div className="article-tags flex max-w-full flex-nowrap overflow-x-auto">
              {post.tags.map((tag) => (
                <TagItem key={tag} tag={tag} />
              ))}
            </div>
          )}
        </nav>
      )}
      {blockMap && (
        <div className="notion-ignore-padding-x -mt-4 mb-4">
          <NotionRenderer
            recordMap={blockMap}
            components={{
              Code,
              Collection,
              Equation,
            }}
            mapPageUrl={mapPageUrl}
            darkMode={theme !== 'light'}
          />
        </div>
      )}
    </article>
  );

  const articleRef = useRef();
  const [toc, setToc] = useState<
    { links: { id: string; title: string; level: number; active: boolean }[]; minLevel: number } | undefined
  >(undefined);

  useEffect(() => {
    const elements = document.querySelectorAll('.notion-h');
    const linksArr = Array.from(elements)
      .map((element) => ({
        id: (element as HTMLElement).dataset.id,
        title: element.textContent || '',
        level: parseInt(element.localName?.substring(1) || '2', 10),
        active: false,
      }))
      .filter((link): link is { id: string; title: string; level: number; active: boolean } => link.id !== undefined);

    const minLevel = linksArr.length > 0 ? Math.min(...linksArr.map((l) => l.level)) : 2;
    setToc({ links: linksArr, minLevel });
  }, []);

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
      toc={toc}
    >
      {renderContents()}
      <div
        className={classNames('flex justify-between font-medium text-gray-500 dark:text-gray-400', {
          'mb-4': enableCommentArea,
        })}
      >
        <button
          onClick={() => router.push(BLOG.path || '/')}
          className="mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100"
        >
          ← {locale?.POST.BACK}
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100"
        >
          ↑ {locale?.POST.TOP}
        </button>
      </div>
      <Comments post={post} />
    </Container>
  );
};
