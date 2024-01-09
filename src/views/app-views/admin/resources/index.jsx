import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Form, Card, Table, Modal } from "react-bootstrap";

import AppHeader from "views/app-views/components/AppHeader";
import SideNav from "views/app-views/components/SideNav";
import CreateResource from "views/app-views/components/CreateResource";
import EditResource from "views/app-views/components/EditResource";
import "react-quill/dist/quill.snow.css";

import { invalidTokenHandler } from "services";
import AppLayout from "layouts/AppLayout";

const API_URL = process.env.REACT_APP_API_URL;

const Resources = () => {
  const history = useHistory();
  const location = useLocation();
  const [pubs, setPubs] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editable, setEditable] = useState(null);
  const [disableSwitch, setDisableSwitch] = useState(false);

  const [loading, setLoading] = useState(true);

  //Fetch Users API
  const fetchPubs = () => {
    console.log("fetch PUBS");
    setLoading(true);
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };

    axios
      .get(`${API_URL}/api/investmentforum/publications`)
      .then((res) => {
        setPubs(res.data.data);
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

    let formData = {
      ...val,
      show_hide: !val.show_hide,
    };

    delete formData["publicationFile_ar"];
    delete formData["publicationFile_en"];
    delete formData["publicationLogoFileName_ar"];
    delete formData["publicationLogoFileName_en"];
    delete formData["publicationLogo_ar"];
    delete formData["publicationLogo_en"];
    delete formData["publicationFileName_ar"];
    delete formData["publicationFileName_en"];

    axios
      .post(`${API_URL}/api/investmentforum/publication`, formData, config)
      .then((res) => {
        const mutedpubs = pubs.map((pub) => {
          if (pub.id === val.id) {
            return {
              ...pub,
              show_hide: !pub.show_hide,
            };
          }
          return pub;
        });
        setPubs(mutedpubs);
        setDisableSwitch(false);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  //Handle Popup show/hide
  const handleEditModalClose = () => {
    fetchPubs();
    setOpenEditModal(false);
  };
  const handleEditModalOpen = (val) => {
    setEditable(val);
    setOpenEditModal(true);
  };

  const handleCreateModalClose = () => {
    fetchPubs();
    setOpenCreateModal(false);
  };
  const handleCreateModalOpen = () => {
    setOpenCreateModal(true);
  };

  useEffect(() => {
    if (openCreateModal === false || openEditModal === false) fetchPubs();
  }, [openCreateModal, openEditModal]);

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
                  <div>Resources</div>
                  <div>
                    <Button
                      disabled={disableSwitch}
                      variant="primary"
                      size="sm"
                      onClick={handleCreateModalOpen}
                    >
                      Create resource
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Name EN</th>
                      <th>Name AR</th>
                      <th>Date</th>
                      <th>Show/Hide</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && <div>loading...</div>}
                    {pubs.length > 0 &&
                      !loading &&
                      pubs.map(
                        (pub, i) =>
                          !pub.isAdmin && (
                            <tr key={i}>
                              <td>{pub.publicationName_en}</td>
                              <td>{pub.publicationName_ar}</td>
                              <td>{pub.publicationDate_en}</td>
                              <td>
                                <Form.Check
                                  type="switch"
                                  disabled={loading}
                                  checked={pub.show_hide}
                                  id="custom-switch"
                                  size="lg"
                                  onChange={() => handleShowHide(pub)}
                                />
                              </td>
                              <td>
                                <Button
                                  disabled={loading}
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleEditModalOpen(pub)}
                                >
                                  Quick Edit
                                </Button>
                              </td>
                              <td></td>
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
          <Modal.Title>Edit resource</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditResource
            actionType="edit"
            editable={editable}
            setOpenEditModal={setOpenEditModal}
            pubs={pubs}
            setPubs={setPubs}
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
          <Modal.Title>Create resource</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateResource
            actionType="create"
            setOpenCreateModal={setOpenCreateModal}
            pubs={pubs}
            setPubs={setPubs}
          />
        </Modal.Body>
      </Modal>
    </AppLayout>
  );
};

export default Resources;
