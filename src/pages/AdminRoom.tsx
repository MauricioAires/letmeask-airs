import { useCallback, useEffect, useRef, useState } from 'react';

import { database } from '../services/firebase';
import { useParams, Link, useHistory } from 'react-router-dom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Questions';
import AsideMenu from '../components/AsideMenu';

import ConfirmationModal, {
  ModalHandles
} from '../components/ConfirmationModal';

import { useRoom } from '../hooks/useRoom';
import { useToast } from '../hooks/useToast';
import { useDistanceInWords } from '../hooks/useDistanceInWords';
import { useAuth } from '../hooks/useAuth';

import roomEmptyQuestions from '../assets/images/empty-questions.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import logoImg from '../assets/images/logo.svg';
import roomClosedImg from '../assets/images/room-closed.svg';
import closeRoomImg from '../assets/images/close-room.svg';

import '../styles/room.scss';

type RoomParams = {
  id: string;
};

type OrderType = 'OLDER' | 'LAST';

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
    id: string;
  };
  createdAt: number;
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

export function AdminRoom() {
  const modalRef = useRef<ModalHandles>(null);
  const params = useParams<RoomParams>();
  const history = useHistory();
  const { showToast, Toaster } = useToast();
  const { user } = useAuth();
  const roomId = params.id;

  const [order, setOrder] = useState<OrderType>('OLDER');

  const [sortedQuestions, setSortedQuestions] = useState<QuestionType[]>([]);

  const distanceInWords = useDistanceInWords();

  const { title, questions, author, createdAt, endedAt } = useRoom(roomId);

  async function handleCheckQuestionAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    });
  }

  async function handleHighlighQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    });
  }

  const handleSortQuestion = useCallback(
    event => {
      let orderNew = event.target.value;
      setOrder(orderNew);

      let newOrder = sortedQuestions.sort((a, b) =>
        order === 'OLDER'
          ? b.createdAt - a.createdAt
          : a.createdAt - b.createdAt
      );
      setSortedQuestions(newOrder);
    },
    [sortedQuestions, order]
  );

  useEffect(() => {
    let newOrder = questions.sort((a, b) =>
      order === 'LAST' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
    );
    setSortedQuestions(newOrder);
  }, [questions, order]);

  const handleOpenModal = useCallback((id: string) => {
    modalRef.current?.openModal('DELETE_QUESTION', id);
  }, []);

  const handleCloseRoom = useCallback((id: string) => {
    modalRef.current?.openModal('DELETE_ROOM', id);
  }, []);

  useEffect(() => {
    if (!user) {
      history.push(`/rooms/${roomId}`);
      showToast('👀', `Opss você precisa está logado para acessar essa pagina`);
    }
    if (user && author) {
      if (user.id !== author.id) {
        history.push(`/rooms/${roomId}`);
        showToast('👀', `Opss somente admin pode acessar essa página`);
      }
    }
  });

  return (
    <div id="page-room">
      <ConfirmationModal ref={modalRef} />
      <Toaster />

      <AsideMenu />
      <div className="page-body">
        <header>
          <div className="content">
            <Link to="/">
              <img src={logoImg} alt="Letmeask airs logo" />
            </Link>
            <div className="">
              <RoomCode code={roomId} />

              {!endedAt && (
                <div className="end-room">
                  <Button onClick={() => handleCloseRoom(roomId)} isOutlined>
                    <img src={closeRoomImg} alt=" Encerrar sala" />
                    <span>Encerrar sala</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main>
          <div className="room-header">
            <div className="room-title">
              <div>
                <h1>Sala {title}</h1>
                {questions.length > 0 && (
                  <span> {questions.length} Pergunta(s)</span>
                )}
              </div>

              <span>Iniciada há {distanceInWords(createdAt)}</span>
            </div>
            <div className="room-author">
              <img src={author?.avatar} alt={author?.name} />
              <div>
                <span>@{author?.name} ✔</span>
                <span>Proprietário</span>
              </div>
            </div>
          </div>

          {endedAt && (
            <div className="room-closed">
              <img src={roomClosedImg} alt="Sala encerrada" />
              <p>Sala encerrada</p>
              <span>
                O bate pato dessa sala chegou ao fim,veja a baixo o que rolou
              </span>
            </div>
          )}

          <div className="wrapper-filters">
            <p>
              ver primeiro
              <select
                defaultValue={order}
                onChange={e => handleSortQuestion(e)}
              >
                <option value="LAST">mais recentes</option>
                <option value="OLDER">mais antigos</option>
              </select>
            </p>
          </div>

          {questions.length < 1 && !endedAt && (
            <div className="room-empty-questions">
              <img src={roomEmptyQuestions} alt="Nenhuma pergunta cadastrada" />
              <p>Nenhuma pergunta por aqui...</p>
              <span>
                Envie o código desta sala para seus amigos e comece a responder
                perguntas!
              </span>
            </div>
          )}

          <div className="questions-list">
            {sortedQuestions.map(question => (
              <Question
                createdAt={question.createdAt}
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Remover pergunta" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlighQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Remover pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleOpenModal(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>

                <button
                  disabled
                  className="like-button"
                  type="button"
                  aria-label="Marcar como gostei"
                >
                  {question.likeCount > 0 && <span>{question.likeCount}</span>}

                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                      stroke="#737380"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </Question>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
