import classNames from 'classnames';
import Link from 'next/link';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import BLOG from '~/blog.config';
import formatDate from '~/lib/formatDate';
import { Post } from '~/types';

type Props = {
  post: Post;
};

type RenderBlogPostArg = {
  isOuterLink: boolean;
};

export const BlogPost: React.FC<Props> = ({ post }) => {
  const isProject = post?.type?.[0] === 'Project';
  const renderBlogPost = ({ isOuterLink }: RenderBlogPostArg) => {
    return (
      <article
        key={post.id}
        className="mb-6 mt-2 transition-transform ease-out hover:scale-105 hover:opacity-90 md:mb-8"
      >
        <header className="flex flex-col justify-between md:flex-row md:items-baseline">
          <div className="flex">
            <h2 className="mb-2 cursor-pointer text-lg font-bold text-black dark:text-white md:text-xl">
              {post.title}
            </h2>
            {isOuterLink && (
              <ArrowTopRightOnSquareIcon className="ml-1 mr-2 mt-[0.5px] size-5 min-w-[20px] text-blue-700 dark:text-blue-400 sm:mr-0" />
            )}
          </div>
          <time className="shrink-0 text-gray-600 dark:text-gray-400">
            {formatDate(post?.date?.start_date || post.createdTime, BLOG.lang)}
          </time>
        </header>
        {post?.thumbnail_url && (
          <img
            src={post.thumbnail_url}
            alt={post.title}
            decoding="async"
            className="my-3 rounded-md bg-gray-100 drop-shadow-md dark:bg-gray-900"
          />
        )}
        <main>
          <p
            className={classNames('leading-8 text-gray-700 dark:text-gray-300', {
              'hidden md:block': post?.type?.[0] !== 'Project',
            })}
          >
            {post.summary}
          </p>
        </main>
        {isProject && post?.repo_url && (
          <a
            href={post.repo_url}
            target="_blank"
            className="border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-400"
            rel="noreferrer"
          >
            {post.repo_url}
          </a>
        )}
      </article>
    );
  };

  return post?.outer_link ? (
    <a href={post.outer_link} target="_blank" rel="noreferrer noopener" aria-label="outer-link">
      {renderBlogPost({ isOuterLink: true })}
    </a>
  ) : (
    <Link href={`${BLOG.path}/${post.slug}`}>
      <a>{renderBlogPost({ isOuterLink: false })}</a>
    </Link>
  );
};
