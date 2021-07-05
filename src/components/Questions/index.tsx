import { ReactNode } from 'react';
import cx from 'classnames';

import { BadgeNewQuestion } from '../BadgeNewQuestion';

import './styles.scss';

import { useDistanceInWords } from '../../hooks/useDistanceInWords';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: number;
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
};

export function Question({
  author,
  children,
  isHighlighted = false,
  isAnswered = false,
  content,
  createdAt
}: QuestionProps) {
  const distanceInWords = useDistanceInWords();
  return (
    <div
      className={cx(
        'question',
        { answered: isAnswered },
        { highlighted: isHighlighted && !isAnswered }
      )}
    >
      <header>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>@{author.name} •</span>
          <span>há {distanceInWords(createdAt)}</span>
        </div>

        <BadgeNewQuestion createdAt={createdAt} />
      </header>

      <p className="content">{content} </p>
      <footer>
        <div>{children}</div>
        <div></div>
      </footer>
    </div>
  );
}
