import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import { Formik } from "formik";
import { object, string } from "yup";
import { useHistory, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import SideNav from "views/app-views/components/SideNav";
import AppHeader from "views/app-views/components/AppHeader";
import { invalidTokenHandler } from "services";
import AppLayout from "layouts/AppLayout";

const schema = object().shape({
  agenda_title_en: string()
    .max(250, "Must be less than 250 characters long.")
    .required("This field is Required"),
  agenda_title_ar: string()
    .max(250, "Must be less than 250 characters long.")
    .required("This field is Required"),
  meeting_url: string()
    .max(250, "Must be less than 250 characters long.")
    .required("This field is Required"),
  agendaIntro_en: string()
    .max(255, "Must be less than 255 characters long.")
    .required("This field is Required"),
  agendaIntro_en: string()
    .max(255, "Must be less than 255 characters long.")
    .required("This field is Required"),
});

const Agenda = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const history = useHistory();
  const location = useLocation();
  const [state, setState] = useState({
    loadings: {
      agendaDataAPILoading: false,
      agendaDataPOSTLoading: false,
    },
    agendaDataAPI: {},
    agendaShowHideStatus: false,
    agendaListAPI: [],
  });

  const handleSwitchChange = (e) => {
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };
    // console.log(e.target.value);

    setState({
      ...state,
      agendaShowHideStatus: true,
      agendaDataAPI: {
        ...state.agendaDataAPI,
        show_hide: !state.agendaDataAPI.show_hide,
      },
    });

    const formData = {
      ...state.agendaDataAPI,
      show_hide: !state.agendaDataAPI.show_hide,
    };

    axios
      .post(`${API_URL}/api/investmentforum/agenda`, formData, config)
      .then((res) => {
        console.log("From show hide", res.data.data);
        setState({
          ...state,
          agendaDataAPI: res.data.data,
          agendaShowHideStatus: false,
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

  const submitHandler = (values) => {
    // console.log(values);
    setState({
      ...state,
      loadings: {
        ...state.loadings,
        agendaDataPOSTLoading: true,
      },
    });
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };
    axios
      .post(`${API_URL}/api/investmentforum/agenda`, values, config)
      .then((res) => {
        // console.log(res.data.data);
        setState({
          ...state,
          loadings: {
            ...state.loadings,
            agendaDataPOSTLoading: false,
          },
        });
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

  useEffect(() => {
    let cancel = false;
    const getAgendaPageData = () => {
      setState({
        ...state,
        loadings: {
          ...state.loadings,
          agendaDataAPILoading: true,
        },
      });

      const API_URL = process.env.REACT_APP_API_URL;

      axios
        .all([
          axios.get(`${API_URL}/api/investmentforum/agendas`),
          axios.get(`${API_URL}/api/investmentforum/agendadetails`),
        ])
        .then(
          axios.spread((...responses) => {
            const responseOne =
              Object.keys(responses[0].data.data).length > 0
                ? responses[0].data.data
                : {
                  agendaIntro_en: "",
                  agendaIntro_ar: "",
                  agenda_title_en: "",
                  agenda_title_ar: "",
                  meeting_url: "",
                  show_hide: false,
                };
            const responseTwo = responses[1].data.data;

            if (cancel) return;

            setState({
              ...state,
              agendaDataAPI: responseOne,
              agendaListAPI: responseTwo,
              loadings: {
                ...state.loadings,
                agendaDataAPILoading: false,
              },
            });

            // use/access the results
            // console.log(responseOne, responseTwo);
          })
        )
        .catch((errors) => {
          // react on errors.
          console.error(errors);
        });
    };
    getAgendaPageData();

    return () => {
      cancel = true;
    }; // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

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
      [{ direction: "rtl" }], // this is rtl support
    ],
  };

  return (
    <AppLayout>
      <AppHeader />
      <SideNav />
      <div className="app-layout">
        <div className="app-content">
          <div className="p-4">
            {Object.keys(state.agendaDataAPI).length > 0 ? (
              <>
                <div className="mb-4">
                  <Formik
                    validationSchema={schema}
                    onSubmit={submitHandler}
                    initialValues={state.agendaDataAPI}
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
                                  <div>Agenda Page Content</div>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div style={{ marginRight: "15px" }}>
                                      Show/Hide
                                    </div>
                                    <Form.Check
                                      type="switch"
                                      disabled={state.agendaShowHideStatus}
                                      checked={state.agendaDataAPI.show_hide}
                                      id="custom-switch"
                                      size="lg"
                                      onChange={handleSwitchChange}
                                    />
                                  </div>
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
                                        htmlFor="agenda_title_en"
                                      >
                                        Agenda Title Text (English)
                                      </label>
                                      <input
                                        type="text"
                                        name="agenda_title_en"
                                        onChange={handleChange}
                                        value={values.agenda_title_en}
                                        className="form-control"
                                        placeholder="Agenda Title Text (English)"
                                      />

                                      {errors.agenda_title_en &&
                                        touched.agenda_title_en &&
                                        !!errors.agenda_title_en && (
                                          <div className="mt-2 text-danger">
                                            {errors.agenda_title_en}
                                          </div>
                                        )}
                                    </div>
                                    <div className="form-group mb-4" dir="rtl">
                                      <label
                                        className="form-label"
                                        htmlFor="agenda_title_ar"
                                      >
                                        Agenda Title Text (Arabic)
                                      </label>
                                      <input
                                        type="text"
                                        name="agenda_title_ar"
                                        onChange={handleChange}
                                        value={values.agenda_title_ar}
                                        className="form-control"
                                        placeholder="Agenda Title Text (Arabic)"
                                      />

                                      {errors.agenda_title_ar &&
                                        touched.agenda_title_ar &&
                                        !!errors.agenda_title_ar && (
                                          <div className="mt-2 text-danger">
                                            {errors.agenda_title_ar}
                                          </div>
                                        )}
                                    </div>
                                    <div className="form-group mb-4">
                                      <label
                                        className="form-label"
                                        htmlFor="agendaIntro_en"
                                      >
                                        Agenda Introduction Text (English)
                                      </label>

                                      <ReactQuill
                                        style={{ background: "#fff" }}
                                        theme="snow"
                                        modules={modules}
                                        value={values.agendaIntro_en}
                                        onChange={(value) => {
                                          setFieldValue(
                                            "agendaIntro_en",
                                            value
                                          );
                                        }}
                                      />

                                      {errors.agendaIntro_en &&
                                        touched.agendaIntro_en &&
                                        !!errors.agendaIntro_en && (
                                          <div className="mt-2 text-danger">
                                            {errors.agendaIntro_en}
                                          </div>
                                        )}
                                    </div>
                                    <div className="form-group mb-4" dir="rtl">
                                      <label
                                        className="form-label"
                                        htmlFor="founder_name_ar"
                                      >
                                        Agenda Introduction Text (Arabic)
                                      </label>

                                      <ReactQuill
                                        style={{ background: "#fff" }}
                                        theme="snow"
                                        modules={modules}
                                        value={values.agendaIntro_ar}
                                        onChange={(value) => {
                                          setFieldValue(
                                            "agendaIntro_ar",
                                            value
                                          );
                                        }}
                                      />

                                      {/* {errors.agendaIntro_ar &&
                                      touched.agendaIntro_ar &&
                                      !!errors.agendaIntro_ar && (
                                        <div className="mt-2 text-danger">
                                          {errors.agendaIntro_ar}
                                        </div>
                                      )} */}
                                    </div>
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
                                        placeholder="Meeting URL"
                                      />

                                      {/* {errors.meeting_url &&
                                      touched.meeting_url &&
                                      !!errors.meeting_url && (
                                        <div className="mt-2 text-danger">
                                          {errors.meeting_url}
                                        </div>
                                      )} */}
                                    </div>
                                    <div className="col-12 text-center">
                                      <Button
                                        disabled={
                                          state.loadings.agendaDataPOSTLoading
                                            ? true
                                            : false
                                        }
                                        type="submit"
                                      >
                                        {state.loadings.agendaDataPOSTLoading
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
                </div>
              </>
            ) : (
              "loading"
            )}
            <Card>
              <Card.Header>List of Agenda</Card.Header>
              <Card.Body>
                {state.agendaListAPI.length > 0 &&
                  state.agendaListAPI.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`d-flex justify-content-between border p-4 ${idx <= state.agendaListAPI.length - 1 && "mb-4"
                        }`}
                    >
                      <div>{item.agendaHeaderText_en}</div>
                      <Link
                        to={{
                          pathname: `/edit-agenda/${item.id}`,
                        }}
                      >
                        Edit
                      </Link>
                    </div>
                  ))}

                <div className="mt-4 text-center">
                  <Link className="btn btn-primary" to="/add-agenda">
                    Add Agenda
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Agenda;
