import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";

import { PencilSquare, Trash } from "react-bootstrap-icons";
import { Row, Col, Button, Card, Modal } from "react-bootstrap";
import AppHeader from "views/app-views/components/AppHeader";
import SideNav from "views/app-views/components/SideNav";
import AddSponsor from "./AddSponsor";
import { toast } from "react-toastify";

import { invalidTokenHandler } from "services";
import AppLayout from "layouts/AppLayout";

const Sponsors = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const history = useHistory();
  const [state, setState] = useState({
    loadings: {
      sponsorPostLoading: false,
    },
    allSponsorsWithBase64: [],
    selectedSponsor: {},
    sponsorModalStatus: false,
    mode: "",
  });

  const {
    allSponsorsWithBase64,
    loadings: { sponsorPostLoading },
    sponsorModalStatus,
    selectedSponsor,
  } = state;

  const handleSave = (values) => {
    setState({
      ...state,
      loadings: {
        sponsorPostLoading: true,
      },
    });

    if (values) {
      const config = {
        headers: {
          token: localStorage.getItem("token"),
        },
      };
      axios
        .post(`${API_URL}/api/investmentforum/sponsor`, [values], config)
        .then((res) => {
          const sponsors = res.data.data.map((item) => {
            const extension = item.logo.split(".");
            return {
              ...item,
              extension: extension[extension.length - 1],
            };
          });

          setState({
            ...state,
            loadings: {
              sponsorPostLoading: false,
            },
            allSponsorsWithBase64: sponsors.reverse(),
            sponsorModalStatus: !state.sponsorModalStatus,
          });
          toast.success("Sponsor Added successfully");
        })

        .catch((error) => {
          // console.log(err.response);
          toast.success("Not Created");
          if (error.response) {
            const invalid = error.response.data.error;

            if (invalid === "invalid token") {
              toast.success("Invalid Token");
              invalidTokenHandler(history, location.pathname);
            }
          }
        });
    }
  };

  const deleteSponsor = (id) => {
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };
    axios
      .delete(`${API_URL}/api/investmentforum/sponsor?id=${id}`, config)
      .then((res) => {
        console.log(res);

        setState({
          ...state,
          allSponsorsWithBase64: state.allSponsorsWithBase64.filter(
            (item) => item.id !== id
          ),
        });
        toast.success("Deleted Successfully");
      })
      .catch((error) => {
        // console.log(err.response);
        if (error.response) {
          const invalid = error.response.data.error;
          toast.error("Not Deleted");
          if (invalid === "invalid token") {
            toast.error("Invalid Token");
            invalidTokenHandler(history, location.pathname);
          }
        }
      });
  };

  const handleModal = (id, mode) => {
    const itemToEdit = allSponsorsWithBase64.find((item) => item.id === id);

    setState({
      ...state,
      sponsorModalStatus: !state.sponsorModalStatus,
      selectedSponsor: itemToEdit,
      mode,
    });
  };

  useEffect(() => {
    let cancle = false;

    const getAllSponsors = () => {
      const API_URL = process.env.REACT_APP_API_URL;
      axios
        .all([
          axios.get(`${API_URL}/api/investmentforum/sponsor`),
          axios.get(`${API_URL}/api/investmentforum/sponsors`),
        ])
        .then(
          axios.spread((...responses) => {
            const sponsors = responses[1].data.data.map((item) => {
              const extension = item.logo.split(".");
              return {
                ...item,
                extension: extension[extension.length - 1],
              };
            });

            if (cancle) return;

            setState({
              ...state,
              allSponsors: responses[0].data.data.reverse(),
              allSponsorsWithBase64: sponsors.reverse(),
              sponsorModalStatus: false,
            });
          })
        )
        .catch((err) => {
          if (err.name === "AbortError") return;
          console.log(err);
        });
    };

    getAllSponsors();

    return () => (cancle = true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppLayout>
      <AppHeader />
      <SideNav />
      <div className="app-layout">
        <div className="app-content">
          <div className="p-4">
            <Row className="justify-content-center">
              <Col lg={8}>
                <Card>
                  <Card.Header>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>Sponsors</div>
                      <div>
                        <Button
                          size="sm"
                          onClick={() => handleModal(null, "ADD")}
                        >
                          Add Sponsor
                        </Button>
                      </div>
                    </div>
                  </Card.Header>

                  <Card.Body>
                    {allSponsorsWithBase64.length > 0
                      ? allSponsorsWithBase64.map((sponsor, idx) => (
                          <Card key={idx} className="mb-4 p-4">
                            <div className="d-flex">
                              <div className="flex-grow-1">
                                {sponsor.logo_file ? (
                                  <img
                                    style={{
                                      width: 100,
                                      height: 100,
                                      objectFit: "cover",
                                    }}
                                    alt="..."
                                    src={`data:image/${sponsor.extension};base64,${sponsor.logo_file}`}
                                  />
                                ) : (
                                  <img
                                    style={{
                                      width: 100,
                                      height: 100,
                                      objectFit: "cover",
                                    }}
                                    alt=".."
                                    src="/images/no-img.jpg"
                                  />
                                )}
                                <div>
                                  <a
                                    href={sponsor.link}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {sponsor.link}
                                  </a>
                                </div>
                              </div>
                              <div>
                                <Button
                                  variant="light"
                                  style={{ marginRight: 10 }}
                                  size="sm"
                                  onClick={() => deleteSponsor(sponsor.id)}
                                >
                                  <Trash size={20} />
                                </Button>
                                <Button
                                  variant="light"
                                  size="sm"
                                  onClick={() =>
                                    handleModal(sponsor.id, "EDIT")
                                  }
                                >
                                  <PencilSquare size={20} />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))
                      : "Data is loading... Or There are no any sponsors to display"}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      <Modal
        show={sponsorModalStatus}
        backdrop="static"
        keyboard={false}
        onHide={handleModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {state.mode === "ADD" ? "Add Sponsor" : "Edit Sponsor"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddSponsor
            mode={state.mode}
            selectedSponsor={selectedSponsor}
            sponsorPostLoading={sponsorPostLoading}
            onSave={(values) => {
              handleSave(values);
            }}
          />
        </Modal.Body>
      </Modal>
    </AppLayout>
  );
};

export default Sponsors;
