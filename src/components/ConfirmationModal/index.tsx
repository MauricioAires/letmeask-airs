import React, {
  forwardRef,
  useCallback,
  useState,
  useImperativeHandle
} from 'react';
import ReactModal from 'react-modal';
import { useParams } from 'react-router-dom';

import { database } from '../../services/firebase';
import { useToast } from '../../hooks/useToast';

import deleteRoomImg from '../../assets/images/delete-room.svg';
import deleteQuestionImg from '../../assets/images/delete-question.svg';

import './styles.scss';

type ModalPropsType = {
  title: string;
  subtitle: string;
  icon?: string;
};
type ModalModelType = 'DELETE_QUESTION' | 'DELETE_ROOM';

type RoomParams = {
  id: string;
};

export interface ModalHandles {
  openModal: (type: ModalModelType, id: string) => void;
}

ReactModal.setAppElement('#root');

const ConfirmationModal: React.RefForwardingComponent<ModalHandles> = (
  props,
  ref
) => {
  const { showToast } = useToast();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const [showModal, setShowModal] = useState(false);
  const [paramId, setParamId] = useState<string>(null);
  const [modalModel, setModalModel] = useState<ModalModelType>(null);

  const [modalProps, setModalProps] = useState<ModalPropsType>({
    icon: null,
    title: 'Excluir pergunta',
    subtitle: 'Tem certeza que você deseja excluir esta pergunta?'
  });

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const openModal = useCallback((type: ModalModelType, id: string) => {
    setParamId(id);
    setModalModel(type);

    if (type === 'DELETE_QUESTION') {
      setModalProps({
        icon: deleteQuestionImg,
        title: 'Excluir pergunta',
        subtitle: 'Tem certeza que você deseja excluir esta pergunta?'
      });
    }

    if (type === 'DELETE_ROOM') {
      setModalProps({
        icon: deleteRoomImg,
        title: 'Encerrar sala',
        subtitle: 'Tem certeza que você deseja encerrar esta sala?'
      });
    }

    setShowModal(true);
  }, []);

  useImperativeHandle(ref, () => {
    return {
      openModal
    };
  });

  const handleDeleteQuestion = useCallback(() => {
    database.ref(`rooms/${roomId}/questions/${paramId}`).remove();

    showToast('🎉', `Pergunta excluída com sucesso!`);

    handleCloseModal();
  }, [roomId, showToast, paramId, handleCloseModal]);

  const handleCloseRoom = useCallback(() => {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date().getTime()
    });
    showToast('✅', `Sala encerrada!`);

    handleCloseModal();
  }, [roomId, showToast, handleCloseModal]);

  const handleConfirmAction = useCallback(() => {
    if (modalModel === 'DELETE_QUESTION') {
      handleDeleteQuestion();
    }

    if (modalModel === 'DELETE_ROOM') {
      handleCloseRoom();
    }
  }, [modalModel, handleCloseRoom, handleDeleteQuestion]);

  return (
    <ReactModal
      isOpen={showModal}
      contentLabel="onRequestClose Example"
      onRequestClose={handleCloseModal}
      className="wrapper-modal"
      overlayClassName="wrapper-overlay"
    >
      <img src={modalProps?.icon} alt="Excluir pergunta" />
      <h2>{modalProps.title}</h2>
      <p>{modalProps.subtitle}</p>

      <div>
        <button onClick={() => handleCloseModal()} className="btn-cancel">
          Cancelar
        </button>
        <button onClick={() => handleConfirmAction()} className="btn-confirm">
          Sim, encerrar
        </button>
      </div>
    </ReactModal>
  );
};

export default forwardRef(ConfirmationModal);
