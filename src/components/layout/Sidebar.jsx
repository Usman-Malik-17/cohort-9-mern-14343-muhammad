import { LayoutDashboard, Plus, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="min-h-screen bg-white border-r border-gray-100 w-64">
      <div className="p-6">
        <ul className="flex flex-col gap-1">
          <li>
            <Link
              to="/dashboard"
              className="flex gap-3 items-center px-4 py-2.5 rounded-lg font-medium text-sm bg-blue-50  hover:text-blue-600 transition-colors duration-150"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/notes/new"
              className="flex gap-3 items-center px-4 py-2.5 rounded-lg font-medium text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
            >
              <Plus size={18} />
              Create New Note
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="flex gap-3 items-center px-4 py-2.5 rounded-lg font-medium text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
            >
              <LogOut size={18} />
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
