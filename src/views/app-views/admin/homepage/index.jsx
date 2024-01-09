import React, { useEffect, useState } from "react";
import axios from "axios";

import { Row, Col, Button, Card, Modal } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import AppHeader from "views/app-views/components/AppHeader";
import SideNav from "views/app-views/components/SideNav";
import { useHistory, useLocation } from "react-router-dom";
import { invalidTokenHandler } from "services";
import AddBanner from "./AddBanner";
import AppLayout from "layouts/AppLayout";

const HomePage = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const history = useHistory();
  const location = useLocation();
  const [state, setState] = useState({
    loadings: {
      bannersLoading: false,
      bannerPostLoading: false,
    },
    allBanners: [],
    selectedBanner: {},
    bannerModalStatus: false,
    mode: "",
  });

  const { allBanners, bannerModalStatus, selectedBanner, mode } = state;

  const submitHandler = (values) => {

    setState({
      ...state,
      loadings: {
        bannerPostLoading: true,
      },
    });
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };
    const formData = {
      image_en_file: values.image_en_file,
      image_en: values.image_en,
      image_ar_file: values.image_ar_file,
      image_ar: values.image_ar,
      title_en: values.title_en,
      title_ar: values.title_ar,
      id: values.id,
    };
    axios
      .post(`${API_URL}/api/investmentforum/banner`, formData, config)
      .then((res) => {
        // console.log(res);
        setState({
          ...state,
          loadings: {
            bannerPostLoading: false,
          },
          bannerModalStatus: false,
          allBanners: res.data.data,
        });
      })
      .catch((error) => {
        // console.log(error.response);
        if (error.response) {
          const invalid = error.response.data.error;

          if (invalid === "invalid token") {
            invalidTokenHandler(history, location.pathname);
          }
        }
      });
  };

  const getAllBanners = () => {
    setState({
      ...state,
      loadings: {
        bannersLoading: true,
      },
    });
    axios
      .get(`${API_URL}/api/investmentforum/banners`)
      .then((response) => {
        // console.log("response data ===>", response.data.data);

        const banners = response.data.data.map((item) => {
          const arExtension = item.image_ar.split(".");
          const enExtension = item.image_en.split(".");
          return {
            ...item,
            arExtension: arExtension[arExtension.length - 1],
            enExtension: enExtension[enExtension.length - 1],
          };
        });
        // console.log(banners);
        setState((state) => {
          return {
            ...state,
            loadings: {
              bannersLoading: false,
            },
            allBanners: banners,
          };
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const deleteBanner = (id) => {
    // console.log(id);

    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };

    axios
      .delete(`${API_URL}/api/investmentforum/banner?id=${id}`, config)
      .then((res) => {
        // console.log(res);

        setState({
          ...state,
          allBanners: state.allBanners.filter((item) => item.id !== id),
        });
      })
      .catch((error) => {
        // console.log(error);
        if (error.response) {
          const invalid = error.response.data.error;

          if (invalid === "invalid token") {
            invalidTokenHandler(history, location.pathname);
          }
        }
      });
  };

  const handleModal = (id, mode) => {
    const itemToEdit = allBanners.find((item) => item.id === id);

    setState({
      ...state,
      bannerModalStatus: !state.bannerModalStatus,
      selectedBanner: itemToEdit,
      mode,
    });
  };

  useEffect(() => {
    getAllBanners(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
     <div>Banner</div>
    <AppLayout>
      <AppHeader />
      <SideNav />
      <div className="app-layout">
        <div className="app-content">
          <div className="p-4">
            {/* {allBanners.length > 0 ? (
              
            ) : (
              "loading"
            )} */}
            <Card>
                <Card.Header>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>Home Page Banners</div>
                    <div>
                      <Button
                        size="sm"
                        onClick={() => handleModal(null, "ADD")}
                      >
                        Add Banner
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  {allBanners.length > 0 && allBanners.map((banner, idx) => (
                    <Card key={idx}>
                      <Card.Header>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>Banner {idx + 1}</div>

                          <div>
                            {idx > 0 && (
                              <Button
                                style={{
                                  background: "none",
                                  marginRight: 10,
                                }}
                                variant="light"
                                size="sm"
                                onClick={() => deleteBanner(banner.id)}
                              >
                                <Trash size={20} />
                              </Button>
                            )}

                            <Button
                              style={{
                                background: "none",
                              }}
                              size="sm"
                              variant="light"
                              onClick={() => handleModal(banner.id, "EDIT")}
                            >
                              <PencilSquare size={20} />
                            </Button>
                          </div>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={6}>
                            <div
                              className="p-3 mb-3"
                              style={{ background: "#f1f1f1" }}
                            >
                              <div className="m-0">
                                <h5>Banner Title English</h5>
                                {banner.title_en}
                              </div>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div
                              className="p-3 mb-3"
                              style={{ background: "#f1f1f1" }}
                            >
                              <div className="m-0">
                                <h5>Banner Title Arabic</h5>
                                {banner.title_ar}
                              </div>
                            </div>
                          </Col>
                          <Col md={6} className="mb-4">
                            <h5>Banner Image English</h5>
                            <div>
                              <img
                                alt="..."
                                src={banner.image_en}
                                style={{
                                  width: "100%",
                                  maxHeight: "330px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          </Col>
                          <Col md={6} className="mb-4">
                            <h5>Banner Image Arabic</h5>
                            <div>
                              <img
                                alt="..."
                                src={banner.image_ar}
                                style={{
                                  width: "100%",
                                  maxHeight: "330px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </Card.Body>
              </Card>
          </div>
        </div>
      </div>
      <Modal
        show={bannerModalStatus}
        backdrop="static"
        keyboard={false}
        onHide={handleModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {mode === "ADD" ? "Add Banner" : "Edit Banner"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddBanner
            mode={mode}
            selectedBanner={selectedBanner}
            bannerPostLoading={state.loadings.bannerPostLoading}
            onSave={(values) => submitHandler(values)}
          />
        </Modal.Body>
      </Modal>
    </AppLayout>
    </>
  );
};

export default HomePage;
