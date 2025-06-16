import { Link } from "react-router-dom";
import { Rocket, IdCard , Braces } from "lucide-react";

function Navbar() {
  return (
    <nav className=" bg-white px-6 py-4">
      <div className="w-full px-6 py-4 flex items-center justify-between border-y-2">
        <div className="flex items-center gap-2">
          <Braces className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-bold font-heading1 text-indigo-700">HackZen</h1>
        </div>

        <div className="flex gap-6">
          <Link
            to="/"
            className="text-gray-800 hover:text-indigo-600 font-medium"
          >
            Home
          </Link>
          <Link
            to="/hackathons"
            className="text-gray-800 hover:text-indigo-600 font-medium"
          >
            Hackathons
          </Link>
          <Link
            to="/more"
            className="text-gray-800 hover:text-indigo-600 font-medium"
          >
          More
          </Link>
          <Link
            to="/about"
            className="text-gray-800 hover:text-indigo-600 font-medium"
          >
            About
          </Link>
        </div>
        <div>
          <IdCard className="w-6 h-6 text-indigo-600" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
