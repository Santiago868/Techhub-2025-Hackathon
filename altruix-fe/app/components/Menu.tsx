import { Link } from 'react-router';


export default function Menu() {
  return (
    <nav className="menu bg-[#5D8D55] text-white p-4">
      <div className="container mx-auto">
        <ul className="flex space-x-6 items-center">
          <li>
            <Link to="/" className="hover:text-gray-300 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link to="/admin" className="hover:text-gray-300 transition-colors">
              Admin
            </Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-gray-300 transition-colors">
              Login
            </Link>
          </li>
             <li className="ml-auto">
            <Link to="/logout" className="hover:text-gray-300 transition-colors">
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

