import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";

import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import { Formik } from "formik";

import { object, string } from "yup";
import AppHeader from "views/app-views/components/AppHeader";
import SideNav from "views/app-views/components/SideNav";

import NoProfile from "assets/images/no-profile.jpg";
import { invalidTokenHandler } from "services";
import AppLayout from "layouts/AppLayout";
const PanelDiscussion = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const history = useHistory();
  const [state, setState] = useState({
    loadings: {
      panelDataPostLoading: false,
    },
    panelDisDataAPI: null,
    speakersDataAPI: [],
  });

  const {
    panelDisDataAPI,
    loadings: { panelDataPostLoading },
  } = state;

  const fetchPanelDisscissionData = (signal) => {
    axios
      .all([
        axios.get(`${API_URL}/api/investmentforum/paneldiscussions`),
        axios.get(`${API_URL}/api/investmentforum/speakers`),
        signal,
      ])
      .then(
        axios.spread((...responses) => {
          const panelDiscussionData =
            Object.keys(responses[0].data.data).length <= 0
              ? {
                panel_title_en: "",
                panel_title_ar: "",
                panel_discussion_title_en: "",
                panel_discussion_title_ar: "",
                panel_discussion_overview_en: "",
                panel_discussion_overview_ar: "",
                meeting_url: "",
              }
              : responses[0].data.data;

          const spearkersData = responses[1].data.data;

          setState({
            ...state,
            panelDisDataAPI: panelDiscussionData,
            speakersDataAPI: spearkersData,
          });

          // console.log(panelDiscussionData, spearkersData);
        })
      )
      .catch((errors) => {
        // react on errors.

        if (errors.name === "AbortError") return;
        console.error(errors);
      });
  };

  const submitHandler = (values) => {
    // console.log(values);

    setState({
      ...state,
      loadings: {
        ...state.loadings,
        panelDataPostLoading: true,
      },
    });

    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };
    axios
      .post(`${API_URL}/api/investmentforum/paneldiscussion`, values, config)
      .then((res) => {
        console.log(res);

        setState({
          ...state,
          loadings: {
            ...state.loadings,
            panelDataPostLoading: false,
          },
        });
      })
      .catch((error) => {
        // console.log(err.response);
        if (error.response) {
          const invalid = error.response.data.error;

          if (invalid === "invalid token") {
            invalidTokenHandler(history, location.pathname);
          }
        }
      });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["image", "code-block"],
      [
        {
          color: ["#000"],
        },
      ],
      [{ direction: "rtl" }],
    ],
  };

  useEffect(() => {
    const abortCont = new AbortController();
    const signal = { signal: abortCont.signal };
    fetchPanelDisscissionData(signal);
    return () => abortCont.abort(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const schema = object().shape({
    panel_title_en: string()
      .max(250, "Must be less than 250 characters long.")
      .required("This field is Required"),
    panel_title_ar: string()
      .max(250, "Must be less than 250 characters long.")
      .required("This field is Required"),
    panel_discussion_title_en: string()
      .max(250, "Must be less than 250 characters long.")
      .required("This field is Required"),
    panel_discussion_title_ar: string()
      .max(250, "Must be less than 250 characters long.")
      .required("This field is Required"),
    panel_discussion_overview_en: string()
      .max(600, "Must be less than 600 characters long.")
      .required("This field is Required"),
    panel_discussion_overview_ar: string()
      .max(600, "Must be less than 600 characters long.")
      .required("This field is Required"),
    meeting_url: string()
      .max(250, "Must be less than 250 characters logn.")
      .required("This field is Required"),
  });
  return (
    <AppLayout>
      <AppHeader />
      <SideNav />
      <div className="app-layout">
        <div className="app-content">
          <div className="p-4">
            <div className="mb-4">
              {panelDisDataAPI !== null ? (
                <Formik
                  validationSchema={schema}
                  onSubmit={submitHandler}
                  initialValues={panelDisDataAPI}
                >
                  {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                    touched,
                    setFieldValue,
                    isValid,
                    errors,
                  }) => (
                    <>
                      <Row>
                        <Col md={12} lg={12}>
                          <Card>
                            <Card.Header>
                              <div className="d-flex justify-content-between align-items-center">
                                <div>Panel Discussion</div>
                              </div>
                            </Card.Header>
                            <Card.Body>
                              <Form
                                noValidate
                                autoComplete="off"
                                onSubmit={handleSubmit}
                              >
                                <div className="row">
                                  <div className="form-group mb-4">
                                    <label
                                      className="form-label"
                                      htmlFor="panel_title_en"
                                    >
                                      Page Title Text (English)
                                    </label>
                                    <input
                                      type="text"
                                      name="panel_title_en"
                                      onChange={handleChange}
                                      value={values.panel_title_en}
                                      className="form-control"
                                      placeholder="Page Title Text (English)"
                                    />

                                    {errors.panel_title_en &&
                                      touched.panel_title_en &&
                                      !!errors.panel_title_en && (
                                        <div className="mt-2 text-danger">
                                          {errors.panel_title_en}
                                        </div>
                                      )}
                                  </div>
                                  <div className="form-group mb-4" dir="rtl">
                                    <label
                                      className="form-label"
                                      htmlFor="panel_title_ar"
                                    >
                                      Page Title Text (Arabic)
                                    </label>
                                    <input
                                      type="text"
                                      name="panel_title_ar"
                                      onChange={handleChange}
                                      value={values.panel_title_ar}
                                      className="form-control"
                                      placeholder="Agenda Title Text (Arabic)"
                                    />

                                    {errors.panel_title_ar &&
                                      touched.panel_title_ar &&
                                      !!errors.panel_title_ar && (
                                        <div className="mt-2 text-danger">
                                          {errors.panel_title_ar}
                                        </div>
                                      )}
                                  </div>
                                  <div className="form-group mb-4">
                                    <label
                                      className="form-label"
                                      htmlFor="panel_discussion_title_en"
                                    >
                                      Panel Discussion Title (English)
                                    </label>
                                    <input
                                      type="text"
                                      name="panel_discussion_title_en"
                                      onChange={handleChange}
                                      value={values.panel_discussion_title_en}
                                      className="form-control"
                                      placeholder="Panel Discussion Title (English)"
                                    />

                                    {errors.panel_discussion_title_en &&
                                      touched.panel_discussion_title_en &&
                                      !!errors.panel_discussion_title_en && (
                                        <div className="mt-2 text-danger">
                                          {errors.panel_discussion_title_en}
                                        </div>
                                      )}
                                  </div>
                                  <div className="form-group mb-4" dir="rtl">
                                    <label
                                      className="form-label"
                                      htmlFor="panel_discussion_title_ar"
                                    >
                                      Panel Discussion Title (Arabic)
                                    </label>
                                    <input
                                      type="text"
                                      name="panel_discussion_title_ar"
                                      onChange={handleChange}
                                      value={values.panel_discussion_title_ar}
                                      className="form-control"
                                      placeholder="Panel Discussion Title (Arabic)"
                                    />

                                    {errors.panel_discussion_title_ar &&
                                      touched.panel_discussion_title_ar &&
                                      !!errors.panel_discussion_title_ar && (
                                        <div className="mt-2 text-danger">
                                          {errors.panel_discussion_title_ar}
                                        </div>
                                      )}
                                  </div>
                                  <div className="form-group mb-4" >
                                    <label
                                      className="form-label"
                                      htmlFor="panel_discussion_overview_en"
                                    >
                                      Panel Discussion Overview (English)
                                    </label>
                                    <textarea
                                      style={{ minHeight: "150px" }}
                                      onChange={handleChange}
                                      name="panel_discussion_overview_en"
                                      className="form-control"
                                      value={values.panel_discussion_overview_en}
                                      placeholder="Panel Discussion Overview (English)"
                                    ></textarea>

                                    {errors.panel_discussion_overview_en &&
                                      touched.panel_discussion_overview_en &&
                                      !!errors.panel_discussion_overview_en && (
                                        <div className="mt-2 text-danger">
                                          {errors.panel_discussion_overview_en}
                                        </div>
                                      )}
                                  </div>

                                  {/* <div className="form-group mb-4">
                                    <label
                                      className="form-label"
                                      htmlFor="panel_discussion_overview_en"
                                    >
                                      Panel Discussion Overview (English)
                                    </label>

                                    <ReactQuill
                                      style={{ background: "#fff" }}
                                      theme="snow"
                                      modules={modules}
                                      value={
                                        values.panel_discussion_overview_en
                                      }
                                      onChange={(value) => {
                                        console.log();
                                        if (value.length >= 1600) {
                                          return;
                                        } else {
                                          setFieldValue(
                                            "panel_discussion_overview_en",
                                            value
                                          );
                                        }
                                      }}
                                    />
                                 
                                  </div> */}
                                  <div className="form-group mb-4" dir="rtl">
                                    <label
                                      className="form-label"
                                      htmlFor="panel_discussion_overview_ar"
                                    >
                                      Panel Discussion Overview (Arabic)
                                    </label>
                                    <textarea
                                      style={{ minHeight: "150px" }}
                                      onChange={handleChange}
                                      name="panel_discussion_overview_ar"
                                      className="form-control"
                                      value={values.panel_discussion_overview_ar}
                                      placeholder="Panel Discussion Overview (Arabic)"
                                    ></textarea>

                                    {errors.panel_discussion_overview_ar &&
                                      touched.panel_discussion_overview_ar &&
                                      !!errors.panel_discussion_overview_ar && (
                                        <div className="mt-2 text-danger">
                                          {errors.panel_discussion_overview_ar}
                                        </div>
                                      )}
                                  </div>

                                  {/* <div className="form-group mb-4" dir="rtl">
                                    <label
                                      className="form-label"
                                      htmlFor="panel_discussion_overview_ar"
                                    >
                                      Panel Discussion Overview (Arabic)
                                    </label>


                                    <ReactQuill
                                      style={{ background: "#fff" }}
                                      theme="snow"
                                      modules={modules}
                                      value={
                                        values.panel_discussion_overview_ar
                                      }
                                      onChange={(value) => {
                                        setFieldValue(
                                          "panel_discussion_overview_ar",
                                          value
                                        );
                                      }}
                                    />

                                    {errors.panel_discussion_overview_ar &&
                                      touched.panel_discussion_overview_ar &&
                                      !!errors.panel_discussion_overview_ar && (
                                        <div className="mt-2 text-danger">
                                          {errors.panel_discussion_overview_ar}
                                        </div>
                                      )}
                                  </div> */}
                                  <div className="form-group mb-4">
                                    <label
                                      className="form-label"
                                      htmlFor="founder_name_ar"
                                    >
                                      Meeting URL
                                    </label>
                                    <input
                                      type="text"
                                      name="meeting_url"
                                      onChange={handleChange}
                                      value={values.meeting_url}
                                      className="form-control"
                                      placeholder="Agenda Introduction Text (Arabic)"
                                    />

                                    {errors.meeting_url &&
                                      touched.meeting_url &&
                                      !!errors.meeting_url && (
                                        <div className="mt-2 text-danger">
                                          {errors.meeting_url}
                                        </div>
                                      )}
                                  </div>
                                  <div className="col-12 text-center">
                                    <Button
                                      disabled={
                                        panelDataPostLoading ? true : false
                                      }
                                      type="submit"
                                    >
                                      {panelDataPostLoading
                                        ? "Updating"
                                        : "Update"}
                                    </Button>
                                  </div>
                                </div>
                              </Form>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </>
                  )}
                </Formik>
              ) : (
                "loading"
              )}

              <div>
                <div className="mt-4 text-center"></div>

                <Card>
                  <Card.Header>List of Speaker</Card.Header>
                  <Card.Body>
                    {state.speakersDataAPI.length > 0 &&
                      state.speakersDataAPI.map((item, idx) => (
                        <div
                          key={item.id}
                          className={`d-flex justify-content-between border p-4 ${idx <= state.speakersDataAPI.length - 1 && "mb-4"
                            }`}
                        >
                          <div className="d-flex align-items-center speaker-list">
                            {item.speaker_img ? (
                              <img
                                alt={item.speaker_name_en}
                                src={item.speaker_img}
                              />
                            ) : (
                              <img alt="..." src={NoProfile} />
                            )}
                            <div>{item.speaker_name_en}</div>
                          </div>
                          <Link
                            className="btn btn-primary"
                            to={{
                              pathname: `/edit-speaker/${item.id}`,
                            }}
                          >
                            Edit
                          </Link>
                        </div>
                      ))}

                    <div className="mt-4 text-center">
                      <Link className="btn btn-primary" to="/add-speaker">
                        Add Speaker
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PanelDiscussion;
