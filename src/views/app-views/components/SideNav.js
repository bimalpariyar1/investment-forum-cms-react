import React from "react";

import { Link } from "react-router-dom";

const sideNavRoutes = [
  {
    path: "",
    routeName: "",
    pathName: "Users",
  },
  {
    path: "/homepage",
    routeName: "homepage",
    pathName: "Homepage Banner",
  },
  {
    path: "/agenda",
    routeName: "agenda",
    pathName: "Agenda",
  },
  {
    path: "/about",
    routeName: "about",
    pathName: "About Page",
  },
  {
    path: "/panel-discussion",
    routeName: "panel-discussion",
    pathName: "Panel Discussion",
  },
  {
    path: "/sponsors",
    routeName: "sponsors",
    pathName: "Sponsors",
  },
  {
    path: "/resources",
    routeName: "resources",
    pathName: "Resources",
  },
  {
    path: "/statistics",
    routeName: "statistics",
    pathName: "Statistics",
  },
  {
    path: "/nav",
    routeName: "nav",
    pathName: "Navigation",
  },
];

const UsersideNavRoutes = [];

const SideNav = () => {
  const windowLocation = window.location.pathname;
  const currentPath = windowLocation.split("/");
  const currentRoute = currentPath[currentPath.length - 1];
  const userType = localStorage.getItem("userType");
  return (
    <div className="side-nav bg-white">
      <ul>
        {userType === "Admin" ? (
          <>
            {sideNavRoutes.length > 0 &&
              sideNavRoutes.map((route) => (
                <li
                  key={route.path}
                  className={currentRoute === route.routeName ? "active" : ""}
                >
                  <Link to={route.path}>{route.pathName}</Link>
                </li>
              ))}
          </>
        ) : (
          <>
            {UsersideNavRoutes.length > 0 &&
              sideNavRoutes.map((route) => (
                <li
                  key={route.path}
                  className={currentRoute === route.routeName ? "active" : ""}
                >
                  <Link to={route.path}>{route.pathName}</Link>
                </li>
              ))}
          </>
        )}
      </ul>
    </div>
  );
};

export default SideNav;
