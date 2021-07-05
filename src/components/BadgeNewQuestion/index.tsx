import moment from 'moment';
import { useEffect, useState } from 'react';
import { useInterval } from '../../hooks/useInterval';

import './styles.scss';

type BadgeNewQuestionProps = {
  createdAt: number;
};

export function BadgeNewQuestion({ createdAt }: BadgeNewQuestionProps) {
  const { seconds, stopInterval } = useInterval();
  const [isNewQuestion, setIsNewQuestion] = useState(false);

  useEffect(() => {
    if (moment(createdAt).add(10, 'seconds') > moment(new Date())) {
      setIsNewQuestion(true);
    } else {
      setIsNewQuestion(false);
      stopInterval();
    }

    if (seconds > 4) {
      setIsNewQuestion(false);
      stopInterval();
    }
  }, [seconds, stopInterval, createdAt]);

  return <>{isNewQuestion && <div className="badge-new-question">Nova</div>}</>;
}
