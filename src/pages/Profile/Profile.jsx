import api from "../../api/axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Plus, LogOut, Menu } from "lucide-react";

function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [displaySidebar, setDisplaySidebar] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      try {
        const userResponse = await api.post("/auth/current-user");
        setCurrentUser(userResponse.data.data);
      } catch (error) {
        console.error(error);
        navigate("/");
        return;
      }
      setPageLoading(false);
    }
    loadProfile();
  }, []);

  if (!currentUser || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <nav className="w-full relative py-[1.5rem] px-[1rem]">
        <div className="flex max-w-11/12 items-center justify-between mx-auto hidden md:flex">
          <div className="hover:text-blue-600 transition-colors duration-150">
            <Link to="/dashboard" className="flex gap-2 items-center">
              <LayoutDashboard></LayoutDashboard>Dashboard
            </Link>
          </div>
          <div className="hover:text-blue-600 transition-colors duration-150">
            <Link to="/notes/new" className="flex gap-2 items-center">
              <Plus />
              Create New Note
            </Link>
          </div>
          <div className="hover:text-blue-600 transition-colors duration-150">
            <Link to="/logout" className="flex gap-2 items-center">
              <LogOut />
              Logout
            </Link>
          </div>
        </div>
        <div className="absolute w-full h-0.5 left-0 right-0 bottom-0 bg-black opacity-20"></div>
        <button
          aria-label="Toggle navigation menu"
          aria-expanded={displaySidebar}
          type="button"
          className="block md:hidden"
          onClick={() => {
            setDisplaySidebar((prev) => !prev);
          }}
        >
          <Menu size={18} />
        </button>
      </nav>
      <div
        className={`fixed min-h-screen bg-white border-r border-gray-100 w-64
    transition-transform duration-300 ease-in-out
    md:hidden
    ${displaySidebar ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6">
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                to="/dashboard"
                className="flex gap-3 items-center px-4 py-2.5 rounded-lg font-medium text-sm text-gray-600 hover:text-blue-600 transition-colors duration-150"
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
                to="/logout"
                className="flex gap-3 items-center px-4 py-2.5 rounded-lg font-medium text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
              >
                <LogOut size={18} />
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <section className="w-11/12 max-w-[900px] mx-auto realtive">
        <div className="pt-[4rem]">
          <div className="flex flex-col md:flex-row md:items-center text-xl text-gray-900 py-[1.5rem] justify-between xl:justify-normal">
            <h3 className="font-medium xl:w-[32rem] pr-[1.5rem]">Full name</h3>
            <p className="font-normal mt-[0.25rem] md:mt-0">
              {currentUser.fullName}
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center text-xl text-gray-900 py-[1.5rem] justify-between xl:justify-normal">
            <h3 className="font-medium xl:w-[32rem] pr-[1.5rem]">
              Email address
            </h3>
            <p className="font-normal mt-[0.25rem] md:mt-0">
              {currentUser.email}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
