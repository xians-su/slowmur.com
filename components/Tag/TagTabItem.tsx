import classNames from 'classnames';
import Link from 'next/link';
import { useMemo } from 'react';
import { getTagData } from '~/lib/tags';

type Props =
  | {
      tagKey: string;
      selected: boolean;
      count: number;
    }
  | {
      tagKey: string;
      selected: boolean;
      root: boolean;
    };

export const TagTabItem: React.FC<Props> = ({ tagKey, selected, ...rest }) => {
  const linkUrl = useMemo(() => {
    if (selected || !('count' in rest)) {
      return '/';
    } else {
      return `/tag/${encodeURIComponent(tagKey)}`;
    }
  }, [rest, selected, tagKey]);

  const tagData = getTagData(tagKey);
  return (
    <li
      className={classNames('mr-3 font-bold whitespace-nowrap rounded-lg min-w-max block', {
        'text-gray-400 border-gray-100 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 hover:bg-gray-100':
          !selected,
        'bg-gray-200 text-gray-700 dark:text-night': selected,
      })}
    >
      <Link href={linkUrl} scroll={false}>
        <a className="flex items-center px-4 py-2">
          {tagData?.emoji && <span className="mr-1">{tagData.emoji}</span>}
          <span>{'count' in rest ? `${tagData?.name ?? tagKey} (${rest.count})` : `${tagData?.name ?? tagKey}`}</span>
        </a>
      </Link>
    </li>
  );
};
