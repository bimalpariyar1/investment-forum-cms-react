import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import axios from "axios";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { Formik } from "formik";
import { object, string } from "yup";
import { invalidTokenHandler } from "services";
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

const schema = object().shape({
  agendaHeaderText_en: string()
    .max(250, "Must be less than 250 characters long.")
    .required("This field is Required"),
  agendaHeaderText_ar: string()
    .max(250, "Must be less than 250 characters long.")
    .required("This field is Required"),
  agendaTime_en: string()
    .max(250, "Must be less than 250 characters long.")
    .required("This field is Required"),
  agendaTime_ar: string()
    .max(250, "Must be less than 250 characters long.")
    .required("This field is Required"),
});

const AgendaForm = (props) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const history = useHistory();
  const location = useLocation();
  const { mode, params } = props;
  const [currentAgenda, setCurrentAgenda] = useState(null);

  const [state, setState] = useState({
    loading: false,
  });

  const { loading } = state;
  const fetchAgendaData = () => {
    axios
      .get(`${API_URL}/api/investmentforum/agendadetail?id=${params}`)
      .then((res) => {
        // console.log(res.data.data);
        setCurrentAgenda(res.data.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const submitHandler = (values) => {
    setState({
      ...state,
      loading: true,
    });
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };

    axios
      .post(`${API_URL}/api/investmentforum/agendadetail`, values, config)
      .then((res) => {
        // console.log("Edit or add reponse ==>", res.data.data);
        setCurrentAgenda(res.data.data);
        setState({
          ...state,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error.response);
        const invalid = error.response.data.error;

        if (invalid === "invalid token") {
          invalidTokenHandler(history, location.pathname);
        }
      });
  };

  const deleteAgenda = () => {
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };
    axios
      .delete(
        `${API_URL}/api/investmentforum/agendadetail?id=${params}`,
        config
      )
      .then((res) => {
        console.log(res);
        history.push("/agenda");
      })
      .catch((error) => {
        console.log(error.response);
        const invalid = error.response.data.error;

        if (invalid === "invalid token") {
          invalidTokenHandler(history, location.pathname);
        }
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (mode === "EDIT") {
      fetchAgendaData();
    } else {
      setCurrentAgenda({
        agendaHeaderText_en: "",
        agendaHeaderText_ar: "",
        agendaTime_en: "",
        agendaTime_ar: "",
        agendaDesc_en: "",
        agendaDesc_ar: "",
      });
    } // eslint-disable-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="pt-4">
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={6}>
            {currentAgenda !== null ? (
              <Formik
                validationSchema={schema}
                onSubmit={submitHandler}
                initialValues={currentAgenda}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  touched,
                  setFieldValue,
                  errors,
                }) => (
                  <>
                    <Row>
                      <Col md={12} lg={12}>
                        <Card>
                          {mode === "EDIT" && (
                            <Card.Header>
                              <div className="d-flex justify-content-end">
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={deleteAgenda}
                                >
                                  Delete
                                </Button>
                              </div>
                            </Card.Header>
                          )}

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
                                    htmlFor="agendaHeaderText_en"
                                  >
                                    Agenda Header Text (English)
                                  </label>
                                  <input
                                    type="text"
                                    name="agendaHeaderText_en"
                                    onChange={handleChange}
                                    value={values.agendaHeaderText_en}
                                    className="form-control"
                                    placeholder="Agenda Header Text (English)"
                                  />

                                  {errors.agendaHeaderText_en &&
                                    touched.agendaHeaderText_en &&
                                    !!errors.agendaHeaderText_en && (
                                      <div className="mt-2 text-danger">
                                        {errors.agendaHeaderText_en}
                                      </div>
                                    )}
                                </div>
                                <div className="form-group mb-4" dir="rtl">
                                  <label
                                    className="form-label"
                                    htmlFor="agendaHeaderText_ar"
                                  >
                                    Agenda Header Text (Arabic)
                                  </label>
                                  <input
                                    type="text"
                                    name="agendaHeaderText_ar"
                                    onChange={handleChange}
                                    value={values.agendaHeaderText_ar}
                                    className="form-control"
                                    placeholder="Agenda Header Text (Arabic)"
                                  />

                                  {errors.agendaHeaderText_ar &&
                                    touched.agendaHeaderText_ar &&
                                    !!errors.agendaHeaderText_ar && (
                                      <div className="mt-2 text-danger">
                                        {errors.agendaHeaderText_ar}
                                      </div>
                                    )}
                                </div>
                                <div className="form-group mb-4">
                                  <label
                                    className="form-label"
                                    htmlFor="agendaTime_en"
                                  >
                                    Agenda Time (English)
                                  </label>
                                  <input
                                    type="text"
                                    name="agendaTime_en"
                                    onChange={handleChange}
                                    value={values.agendaTime_en}
                                    className="form-control"
                                    placeholder="Agenda Time (English)"
                                  />

                                  {errors.agendaTime_en &&
                                    touched.agendaTime_en &&
                                    !!errors.agendaTime_en && (
                                      <div className="mt-2 text-danger">
                                        {errors.agendaTime_en}
                                      </div>
                                    )}
                                </div>
                                <div className="form-group mb-4" dir="rtl">
                                  <label
                                    className="form-label"
                                    htmlFor="agendaTime_ar"
                                  >
                                    Agenda Time (Arabic)
                                  </label>
                                  <input
                                    type="text"
                                    name="agendaTime_ar"
                                    onChange={handleChange}
                                    value={values.agendaTime_ar}
                                    className="form-control"
                                    placeholder="Agenda Time (Arabic)"
                                  />

                                  {errors.agendaTime_ar &&
                                    touched.agendaTime_ar &&
                                    !!errors.agendaTime_ar && (
                                      <div className="mt-2 text-danger">
                                        {errors.agendaTime_ar}
                                      </div>
                                    )}
                                </div>
                                <div className="form-group mb-4">
                                  <label
                                    className="form-label"
                                    htmlFor="agendaDesc_en"
                                  >
                                    Agenda Description (English)
                                  </label>
                                  <ReactQuill
                                    style={{ background: "#fff" }}
                                    theme="snow"
                                    modules={modules}
                                    value={values.agendaDesc_en}
                                    onChange={(value) => {
                                      setFieldValue("agendaDesc_en", value);
                                    }}
                                  />

                                  {errors.agendaDesc_en &&
                                        touched.agendaDesc_en &&
                                        !!errors.agendaDesc_en && (
                                          <div className="mt-2 text-danger">
                                            {errors.agendaDesc_en}
                                          </div>
                                        )}
                                </div>
                                <div className="form-group mb-4">
                                  <label
                                    className="form-label"
                                    htmlFor="agendaDesc_ar"
                                    style={{
                                      width: "100%",
                                      textAlign: "right",
                                    }}
                                  >
                                    Agenda Description (Arabic)
                                  </label>
                                  <ReactQuill
                                    style={{ background: "#fff" }}
                                    theme="snow"
                                    modules={modules}
                                    dir="rtl"
                                    value={values.agendaDesc_ar}
                                    onChange={(value) => {
                                      setFieldValue("agendaDesc_ar", value);
                                    }}
                                  />

                                  {errors.agendaDesc_ar &&
                                        touched.agendaDesc_ar &&
                                        !!errors.agendaDesc_ar && (
                                          <div className="mt-2 text-danger">
                                            {errors.agendaDesc_ar}
                                          </div>
                                        )}
                                </div>
                                <div className="col-12 text-center">
                                  <Button
                                    disabled={loading ? true : false}
                                    type="submit"
                                  >
                                    {loading ? "Updating" : "Update"}
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
              "loadng"
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AgendaForm;
