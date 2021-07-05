import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';

import '../styles/auth.scss';
import { database } from '../services/firebase';
import { useToast } from '../hooks/useToast';
export function NewRoom() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState('');

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
      endedAt: null,
      createdAt: new Date().getTime(),
      author: {
        name: user?.name,
        avatar: user?.avatar,
        id: user?.id
      }
    });

    showToast('✅', `Sala ${newRoom} criada com sucesso!`);

    history.push(`/admin/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth">
      <Toaster />
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas é respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>{' '}
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask Airs" />
          <h2> Criar uma nova sala</h2>{' '}
          <form onSubmit={handleCreateRoom}>
            <input
              onChange={event => setNewRoom(event.target.value)}
              type="text"
              value={newRoom}
              placeholder="Nome da sala"
            />

            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
