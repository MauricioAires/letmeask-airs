import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import cx from 'classnames';
import { useHistory } from 'react-router-dom';

import { useRoom } from '../../hooks/useRoom';

import logoImg from '../../assets/images/logo.svg';

import './styles.scss';
import { useAuth } from '../../hooks/useAuth';

type RoomParams = {
  id: string;
};

const AsideMenu = () => {
  const params = useParams<RoomParams>();
  const [adminRoute, setAdminRoute] = useState(false);
  const roomId = params.id;
  const { author } = useRoom(roomId);
  const { user } = useAuth();
  const history = useHistory();
  const currentYear = new Date().getFullYear();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && author) {
      if (user.id === author.id) {
        setIsAdmin(true);

        return;
      }
    }

    setIsAdmin(false);
  }, [user, author]);

  useEffect(() => {
    setAdminRoute(/admin/.test(history?.location.pathname));
  }, [history]);

  return (
    <aside className="aside-menu">
      <Link to="/">
        <img src={logoImg} alt="Letmeask airs logo" />
      </Link>
      <div className="wrapper-routes">
        <div className={cx({ active: !adminRoute })}>
          <Link to={`/rooms/${roomId}`}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path d="M7.2735 20L1.3335 24.6666V3.99996C1.3335 3.64634 1.47397 3.3072 1.72402 3.05715C1.97407 2.8071 2.31321 2.66663 2.66683 2.66663H22.6668C23.0205 2.66663 23.3596 2.8071 23.6096 3.05715C23.8597 3.3072 24.0002 3.64634 24.0002 3.99996V20H7.2735ZM6.35083 17.3333H21.3335V5.33329H4.00016V19.18L6.35083 17.3333ZM10.6668 22.6666H24.3162L26.6668 24.5133V10.6666H28.0002C28.3538 10.6666 28.6929 10.8071 28.943 11.0572C29.193 11.3072 29.3335 11.6463 29.3335 12V30L23.3935 25.3333H12.0002C11.6465 25.3333 11.3074 25.1928 11.0574 24.9428C10.8073 24.6927 10.6668 24.3536 10.6668 24V22.6666Z" />
              </g>
            </svg>
          </Link>
        </div>
        {isAdmin && (
          <div className={cx({ active: adminRoute })}>
            <Link to={`/admin/rooms/${roomId}`}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path d="M14.6667 13.0666V14.2666L16.9333 14.5333C20.4 15.0666 22.9333 16.4 24.8 18.1333C22.5333 17.4666 20.1333 17.0666 17.3333 17.0666H14.6667V18.8L11.7333 16L14.6667 13.0666ZM17.3333 6.66663L8 16L17.3333 25.3333V19.8666C24 19.8666 28.6667 22 32 26.6666C30.6667 20 26.6667 13.3333 17.3333 12V6.66663ZM9.33333 10.6666V6.66663L0 16L9.33333 25.3333V21.3333L4 16" />
                </g>
              </svg>
            </Link>
          </div>
        )}
      </div>
      <footer>
        <p> AIRS ©{currentYear}</p>
      </footer>
    </aside>
  );
};

export default AsideMenu;
