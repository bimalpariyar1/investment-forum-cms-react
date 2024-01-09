import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Form, Card, Table, Modal } from "react-bootstrap";

import AppHeader from "views/app-views/components/AppHeader";
import SideNav from "views/app-views/components/SideNav";
import CreateStat from "views/app-views/components/CreateStat";
import EditStat from "views/app-views/components/EditStat";
import "react-quill/dist/quill.snow.css";

import { invalidTokenHandler } from "services";
import AppLayout from "layouts/AppLayout";

const API_URL = process.env.REACT_APP_API_URL;

const Statistics = () => {
  const history = useHistory();
  const location = useLocation();
  const [stats, setStats] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editable, setEditable] = useState(null);
  const [disableSwitch, setDisableSwitch] = useState(false);

  const [loading, setLoading] = useState(true);

  //Fetch Users API
  const fetchCards = () => {
    setLoading(true);
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };

    axios
      .get(`${API_URL}/api/investmentforum/cards`)
      .then((res) => {
        setStats(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          const invalid = error.response.data.error;

          if (invalid === "invalid token") {
            invalidTokenHandler(history, location.pathname);
          }
        }
      });
  };

  //Handle user show/hide
  const handleShowHide = (val) => {
    setLoading(true);
    setDisableSwitch(true);
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };

    const formData = {
      ...val,
      show_hide: !val.show_hide,
    };

    axios
      .post(`${API_URL}/api/investmentforum/card`, formData, config)
      .then((res) => {
        const mutedStats = stats.map((stat) => {
          if (stat.id === val.id) {
            return {
              ...stat,
              show_hide: !stat.show_hide,
            };
          }
          return stat;
        });
        setStats(mutedStats);
        setDisableSwitch(false);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  //Handle Popup show/hide
  const handleEditModalClose = () => setOpenEditModal(false);
  const handleEditModalOpen = (val) => {
    setEditable(val);
    setOpenEditModal(true);
  };

  const handleCreateModalClose = () => {
    fetchCards();
    setOpenCreateModal(false);
  };
  const handleCreateModalOpen = () => setOpenCreateModal(true);

  useEffect(() => {
    fetchCards();
  }, []);
  return (
    <AppLayout>
      <AppHeader />
      <SideNav />
      <div className="app-layout">
        <div className="app-content">
          <div className="p-4">
            <Card className="mb-4">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <div>Statistics</div>
                  <div>
                    <Button
                      disabled={disableSwitch}
                      variant="primary"
                      size="sm"
                      onClick={handleCreateModalOpen}
                    >
                      Create stat
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Title EN</th>
                      <th>Title AR</th>
                      {/* <th>Description</th> */}
                      <th>Number</th>
                      {/* <th>Date</th> */}
                      <th>Show/Hide</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && <div>loading...</div>}
                    {stats.length > 0 &&
                      !loading &&
                      stats.map(
                        (stat, i) =>
                          !stat.isAdmin && (
                            <tr key={i}>
                              <td>{stat.cardTitle_en}</td>
                              <td>{stat.cardTitle_ar}</td>
                              <td>{stat.cardNumber_en}</td>
                              <td style={{ cursor: "pointer" }}>
                                <Form.Check
                                  type="switch"
                                  disabled={loading}
                                  checked={stat.show_hide}
                                  id="custom-switch"
                                  size="lg"
                                  onChange={() => handleShowHide(stat)}
                                />
                              </td>
                              <td>
                                <Button
                                  disabled={loading}
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleEditModalOpen(stat)}
                                >
                                  Quick Edit
                                </Button>
                              </td>
                              <td>
                                {/* <Button variant="primary" size="sm">
                              View Details
                            </Button> */}

                                {/* <Link to={`/user-details/${user.id}`}>
                                  View Details
                                </Link> */}
                              </td>
                            </tr>
                          )
                      )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
      <Modal
        show={openEditModal}
        backdrop="static"
        keyboard={false}
        onHide={handleEditModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>EDIT STATISTICS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditStat
            actionType="edit"
            editable={editable}
            setOpenEditModal={setOpenEditModal}
            stats={stats}
            setStats={setStats}
          />
        </Modal.Body>
      </Modal>

      <Modal
        show={openCreateModal}
        backdrop="static"
        keyboard={false}
        onHide={handleCreateModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Statistic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateStat
            actionType="create"
            setOpenCreateModal={setOpenCreateModal}
            stats={stats}
            setStats={setStats}
          />
        </Modal.Body>
      </Modal>
    </AppLayout>
  );
};

export default Statistics;
