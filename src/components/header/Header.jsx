import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export default function Header() {
  const { logOut, isAuthenticated } = useContext(AuthContext);

  const handleLogOutButtonClick = async () => {
    await logOut();
  };

  return (
    <header className="container">
      {isAuthenticated && (
        <button className="ml-auto" onClick={handleLogOutButtonClick}>
          Log out
        </button>
      )}
    </header>
  );
}