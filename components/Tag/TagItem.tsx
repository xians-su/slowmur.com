import Link from 'next/link';
import { getTagData } from '~/lib/tags';

type Props = {
  tag: string;
};

export const TagItem: React.FC<Props> = ({ tag }) => {
  const tagData = getTagData(tag);
  return (
    <Link href={`/tag/${encodeURIComponent(tag)}`}>
      <a>
        <div className="mr-1 flex items-center rounded-full border px-2 py-1 text-sm leading-none dark:border-gray-600">
          {tagData?.emoji && <span className="mr-1">{tagData.emoji}</span>}
          <p>{tagData?.name ?? tag}</p>
        </div>
      </a>
    </Link>
  );
};
