import { useHistory } from 'react-router';
import { useStore } from '../store';

export const ProtectedRoute: React.FC = ({ children }) => {
  const token = useStore((state) => state.token);
  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);
  const history = useHistory();

  if (!Boolean(token)) history.push('/');

  if ((currentUser?.exp ?? 0) * 1000 < Date.now()) {
    logout();
    history.push('/');
  }

  return <>{children}</>;
};
