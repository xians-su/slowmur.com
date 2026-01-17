import { TagObj } from '~/types';
import { TagTabItem } from './TagTabItem';

type Props = {
  tags: TagObj;
  currentTag?: string;
};

export const Tags: React.FC<Props> = ({ tags, currentTag }: Props) => {
  if (!tags) return null;
  return (
    <div className="tag-container flex items-center">
      <ul className="flex max-w-full overflow-x-auto py-2">
        <TagTabItem tagKey="all" selected={!currentTag} root />
        {Object.keys(tags).map((key) => {
          return <TagTabItem key={key} tagKey={key} selected={key === currentTag} count={tags[key]} />;
        })}
      </ul>
    </div>
  );
};
