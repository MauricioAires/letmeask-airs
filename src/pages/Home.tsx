import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';
import { useHistory } from 'react-router-dom';

import illustrationImg from '../assets/images/illustration.svg';

import googleIconImg from '../assets/images/google-icon.svg';
import userIconImg from '../assets/images/user-icon.svg';

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

import '../styles/auth.scss';

export function Home() {
  const history = useHistory();
  const { showToast, Toaster } = useToast();
  const [roomCode, setRoomCode] = useState('');
  const { signInWithGoogle, user, signOut } = useAuth();
  var logoImg = require(`../assets/images/logo_animated.svg`);

  async function handleSignOut() {
    await signOut();
  }
  async function handleCreateRoom() {
    await signInWithGoogle();

    history.push('/rooms/new');
  }

  function handleToContinueWith() {
    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      showToast('⚠️', 'Sala não encontrada');
      return;
    }
    /**
     * Funcionamento padrão de não acessar salas já fechadas
     */

    // if (roomRef.val().closedAt) {
    //   alert('Room already closed.');
    //   return;
    // }

    history.push(`/rooms/${roomCode}`);
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
      </aside>

      <main>
        <div className="main-content">
          <img loading="lazy" src={logoImg?.default} alt="Letmeask Airs" />

          {user ? (
            <>
              <button onClick={handleToContinueWith} className="btn-continue">
                <img src={user.avatar} alt={user.name} />
                <div>
                  <p>{user.name}</p>
                  <small>{user.email}</small>
                </div>
              </button>

              <button
                onClick={handleSignOut}
                className="btn-continue btn-continue--another"
              >
                <img src={userIconImg} alt="Icone usuário" />
                <div>
                  <p>Usar outra conta</p>
                </div>
              </button>
            </>
          ) : (
            <button onClick={handleCreateRoom} className="create-room">
              <img src={googleIconImg} alt="Logo do google" />
              Crie sua sala com o Google
            </button>
          )}

          <div className="separator">ou entre em uma sala</div>

          <form onSubmit={handleJoinRoom}>
            <input
              onChange={event => setRoomCode(event.target.value)}
              type="text"
              value={roomCode}
              placeholder="Digite o código da sala"
            />

            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
