import React from "react";
import { Container, Button } from "react-bootstrap";

import { Link, useHistory } from "react-router-dom";

import Logo from "assets/images/qdb-logo.png";

const AppHeader = () => {
  const history = useHistory();
  const handleLogout = () => {
    localStorage.clear();
    history.push("/");
  };

  return (
    <header className="app-header d-flex align-items-center">
      <Container fluid>
        <div className="header-content">
          <div>
            <Link to="/">
              <img alt="..." style={{ width: "100px" }} src={Logo} />
            </Link>
          </div>
          <div className="logout">
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default AppHeader;
