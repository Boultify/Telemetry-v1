<<<<<<< HEAD
import { useAuth } from '../context/AuthContext';

// Inside your component
const { user, logout } = useAuth();

=======
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
export default function Sidebar() {
  return (
    <div className="top-bar">
      <h1>Sidebar</h1>
<<<<<<< HEAD
      // Add logout button
<button onClick={logout} className="...">
  <span className="material-symbols-outlined">logout</span>
  Logout
</button>
=======
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
    </div>
  )
}