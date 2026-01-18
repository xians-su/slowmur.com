import classNames from 'classnames';
import 'gitalk/dist/gitalk.css';
import { useTheme } from 'next-themes';
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
    <article className="mb-8 mt-4 md:mt-0">
      <h1 className="text-2xl font-bold text-black dark:text-white md:text-3xl">{post.title}</h1>
      {post?.type?.[0] !== 'Page' && (
        <nav className="mb-4 mt-5 flex items-center text-gray-500 dark:text-gray-300">
          <div className="mt-2 flex">
            <div className="mr-2 md:ml-0">{formatDate(post?.date?.start_date || post.createdTime, BLOG.lang)}</div>
          </div>
          {post.tags && (
            <div className="article-tags mb-1 mt-2 flex max-w-full flex-nowrap overflow-x-auto">
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

  const articleRef = useRef();
  const [toc, setToc] = useState<
    { links: { id: string | undefined; title: string; level: string }[]; minLevel: number } | undefined
  >(undefined);

  useEffect(() => {
    const links = document.querySelectorAll('.notion-h');
    const linksArr: { id: string | undefined; title: string; level: string }[] = Array.from(links).map((element) => ({
      id: (element as HTMLElement).dataset.id,
      title: element.textContent || '',
      level: element.localName?.substring(1) || '',
    }));

    const level = [...linksArr].sort((a, b) => (parseInt(a.level) || 0) - (parseInt(b.level) || 0))[0]?.level ?? '2';
    setToc({ links: linksArr, minLevel: parseInt(level) });
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
