import React, { useEffect, useState } from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import  ProfileDropDown  from "../core/Auth/ProfileDropDown";
import { categories } from "../../services/apis";
import { apiConnector } from "../../services/apiconnector";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import logo from "../../assets/logo.png";

const data = [
  { title: "Home", path: "/" },
  { title: "Catalog" }, // Catalog will have sublinks
  { title: "About", path: "/about" },
  { title: "Contact Us", path: "/contact" },
];

const matchRoute = (route, pathname) => matchPath({ path: route }, pathname);

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [subLinks, setSubLinks] = useState([]);
  const location = useLocation();

  const fetchSublinks = async () => {
    try {
      setLoading(true);
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      // console.log(result.data.data)
      setSubLinks(result.data.data);
    } catch (error) {
      console.error("Could not fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("token:", token);
    fetchSublinks();
  }, []);

  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
      <div className="flex w-9/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} width={160} height={42} loading="lazy" alt="logo" />
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {data.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div
                    className={`group relative flex cursor-pointer items-center gap-1 ${
                      matchRoute("/catalog/:catalogName", location.pathname)
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    <p>{link.title}</p>
                    <IoIosArrowDropdownCircle />
                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                      <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                      {loading ? (
                        <p className="text-center">Loading...</p>
                      ) : subLinks.length > 0 ? (
                        subLinks
                           .map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50 text-black"
                              key={i}
                            >
                              <p className='text-black'>{subLink.name}</p>
                            </Link>
                          ))
                      ) : (
                        <p className="text-center text-black">No Courses Found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path, location.pathname)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Login/Signup/Dashboard */}
        <div className="flex gap-x-4 items-center">
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart />
              {totalItems > 0 && (
                <span className="absolute top-[-8px] right-[-8px] bg-yellow-500 text-white text-xs rounded-full px-1">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null ? (
            <>
              <Link
                to="/login"
                className="border border-richblack-700 bg-richblack-800 py-[8px] px-[9px] text-richblack-100 rounded-md"
              >
                <button>Login</button>
              </Link>
              <Link
                to="/signup"
                className="border border-richblack-700 bg-richblack-800 py-[8px] px-[9px] text-richblack-100 rounded-md"
              >
                <button>Signup</button>
              </Link>
            </>
          ) : (
            <ProfileDropDown />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
