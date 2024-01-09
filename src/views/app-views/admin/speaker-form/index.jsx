import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { Formik } from "formik";
import { object, string } from "yup";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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

const SpeakerForm = (props) => {
  const FILE_SIZE = 314572.8;
  const API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const history = useHistory();
  const { mode, params } = props;
  const [state, setState] = useState({
    currentSpeaker: null,
    loading: false,
    isLargeFile: false,
  });

  const { currentSpeaker, loading } = state;

  const fetchSpeakers = () => {
    axios
      .get(`${API_URL}/api/investmentforum/speaker?id=${params}`)
      .then((res) => {
        // console.log(res.data.data);

        setState({
          ...state,
          currentSpeaker: res.data.data,
        });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const submitHandler = (values) => {
    // console.log(values);

    if (state.isLargeFile) return;

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
      .post(`${API_URL}/api/investmentforum/speaker`, values, config)
      .then((res) => {
        console.log(res);

        setState({
          ...state,
          loading: false,
        });

        // if (mode === "ADD") {
        //   history.push("/panel-discussion");
        // }
      })
      .catch((err) => {
        console.log(err.response);
        const invalid = err.response.data.error;

        if (invalid === "invalid token") {
          invalidTokenHandler(history, location.pathname);
        }
      });
  };

  const deleteSpeaker = () => {
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };
    axios
      .delete(`${API_URL}/api/investmentforum/speaker?id=${params}`, config)
      .then((res) => {
        console.log(res);
        history.push("/panel-discussion");
      })
      .catch((err) => {
        console.log(err.response);
        invalidTokenHandler(history, location.pathname);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (mode === "EDIT") {
      fetchSpeakers();
    } else {
      setState({
        ...state,
        currentSpeaker: {
          speaker_name_en: "",
          speaker_name_ar: "",
          speaker_designation_en: "",
          speaker_designation_ar: "",
          sperker_organization_en: "",
          sperker_organization_ar: "",
          speaker_details_en: "",
          speaker_details_ar: "",
          speaker_img: "",
          speaker_img_file: "",
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const schema = object().shape({
    speaker_name_en: string()
      .max(250, "Must be less than 250 characters long.")
      .required("This field is Required"),
    speaker_name_ar: string()
      .max(250, "Must be less than 250 characters long.")
      .required("This field is Required"),
    speaker_designation_en: string()
      .max(250, "Must be less than 250 characters long.")
      .required("This field is Required"),
    speaker_designation_ar: string()
      .max(250, "Must be less than 250 characters long.")
      .required("This field is Required"),
    sperker_organization_en: string()
      .max(250, "Must be less than 250 characters long.")
      .required("This field is Required"),
    sperker_organization_ar: string()
      .max(250, "Must be less than 250 characters long.")
      .required("This field is Required"),
  });

  return (
    <section className="pt-4">
      <Container fluid>
        <Row className="justify-content-center">
          <div className="col-md-12 col-lg-8 col-xl-8 col-xxl-6">
            {currentSpeaker !== null ? (
              <Formik
                validationSchema={schema}
                onSubmit={submitHandler}
                initialValues={currentSpeaker}
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
                          {mode === "EDIT" && (
                            <Card.Header>
                              <div className="d-flex justify-content-end">
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={deleteSpeaker}
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
                                    htmlFor="speaker_img_file"
                                  >
                                    Speaker Image (400px X 400px)
                                  </label>
                                  <input
                                    accept="image/jpg, image/jpeg, image/gif, image/png"
                                    name={`speaker_img_file`}
                                    type="file"
                                    onChange={(event) => {
                                      const file = event.target.files[0];
                                      if (file.size > FILE_SIZE) {
                                        setState({
                                          ...state,
                                          isLargeFile: true,
                                        });
                                      } else {
                                        setState({
                                          ...state,
                                          isLargeFile: false,
                                        });
                                      }

                                      const reader = new FileReader();
                                      reader.onload = function (e) {
                                        // console.log(reader.result);
                                        setFieldValue(
                                          `speaker_img_file`,
                                          reader.result.split(",")[1]
                                        );
                                        setFieldValue(
                                          `speaker_img`,
                                          event.target.files[0].name
                                        );
                                      };
                                      reader.readAsDataURL(file);
                                    }}
                                    className="form-control"
                                  />

                                  {state.isLargeFile && (
                                    <div className="mt-3 text-danger">
                                      File size must be less than or equal to
                                      300kb .
                                    </div>
                                  )}

                                  {values.speaker_img !== "" && (
                                    <div className="mt-4">
                                      <img
                                        alt="..."
                                        style={{
                                          width: "100px",
                                          objectFit: "cover",
                                        }}
                                        src={
                                          values.speaker_img &&
                                          values.speaker_img.split(".")[
                                            values.speaker_img.length - 1
                                          ] === "jpg"
                                            ? `data:image/jpeg;base64,${values.speaker_img_file}`
                                            : values.speaker_img &&
                                              values.speaker_img.split(".")[
                                                values.speaker_img.length - 1
                                              ] === "png"
                                            ? `data:image/png;base64,${values.speaker_img_file}`
                                            : values.speaker_img &&
                                              values.speaker_img.split(".")[
                                                values.speaker_img.length - 1
                                              ] === "jpeg"
                                            ? `data:image/jpeg;base64,${values.speaker_img_file}`
                                            : `data:image/gif;base64,${values.speaker_img_file}`
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                                <div className="form-group mb-4">
                                  <label
                                    className="form-label"
                                    htmlFor="speaker_name_en"
                                  >
                                    Speaker Name (English)
                                  </label>
                                  <input
                                    type="text"
                                    name="speaker_name_en"
                                    onChange={handleChange}
                                    value={values.speaker_name_en}
                                    className="form-control"
                                    placeholder="Speaker Name (English)"
                                  />

                                  {errors.speaker_name_en &&
                                    touched.speaker_name_en &&
                                    !!errors.speaker_name_en && (
                                      <div className="mt-2 text-danger">
                                        {errors.speaker_name_en}
                                      </div>
                                    )}
                                </div>
                                <div className="form-group mb-4" dir="rtl">
                                  <label
                                    className="form-label"
                                    htmlFor="speaker_name_ar"
                                  >
                                    Speaker Name (Arabic)
                                  </label>
                                  <input
                                    type="text"
                                    name="speaker_name_ar"
                                    onChange={handleChange}
                                    value={values.speaker_name_ar}
                                    className="form-control"
                                    placeholder="Speaker Name (Arabic)"
                                  />

                                  {errors.speaker_name_ar &&
                                    touched.speaker_name_ar &&
                                    !!errors.speaker_name_ar && (
                                      <div className="mt-2 text-danger">
                                        {errors.speaker_name_ar}
                                      </div>
                                    )}
                                </div>
                                <div className="form-group mb-4">
                                  <label
                                    className="form-label"
                                    htmlFor="speaker_designation_en"
                                  >
                                    Speaker Designation (English)
                                  </label>
                                  <input
                                    type="text"
                                    name="speaker_designation_en"
                                    onChange={handleChange}
                                    value={values.speaker_designation_en}
                                    className="form-control"
                                    placeholder="Speaker Designation (English)"
                                  />

                                  {errors.speaker_designation_en &&
                                    touched.speaker_designation_en &&
                                    !!errors.speaker_designation_en && (
                                      <div className="mt-2 text-danger">
                                        {errors.speaker_designation_en}
                                      </div>
                                    )}
                                </div>
                                <div className="form-group mb-4" dir="rtl">
                                  <label
                                    className="form-label"
                                    htmlFor="speaker_designation_ar"
                                  >
                                    Speaker Designation (Arabic)
                                  </label>
                                  <input
                                    type="text"
                                    name="speaker_designation_ar"
                                    onChange={handleChange}
                                    value={values.speaker_designation_ar}
                                    className="form-control"
                                    placeholder="Speaker Designation (Arabic)"
                                  />

                                  {errors.speaker_designation_ar &&
                                    touched.speaker_designation_ar &&
                                    !!errors.speaker_designation_ar && (
                                      <div className="mt-2 text-danger">
                                        {errors.speaker_designation_ar}
                                      </div>
                                    )}
                                </div>
                                <div className="form-group mb-4">
                                  <label
                                    className="form-label"
                                    htmlFor="sperker_organization_en"
                                  >
                                    Speaker Organization (English)
                                  </label>
                                  <input
                                    type="text"
                                    name="sperker_organization_en"
                                    onChange={handleChange}
                                    value={values.sperker_organization_en}
                                    className="form-control"
                                    placeholder="Speaker Organization (English)"
                                  />

                                  {errors.sperker_organization_en &&
                                    touched.sperker_organization_en &&
                                    !!errors.sperker_organization_en && (
                                      <div className="mt-2 text-danger">
                                        {errors.sperker_organization_en}
                                      </div>
                                    )}
                                </div>
                                <div className="form-group mb-4" dir="rtl">
                                  <label
                                    className="form-label"
                                    htmlFor="sperker_organization_ar"
                                  >
                                    Speaker Organization (Arabic)
                                  </label>
                                  <input
                                    type="text"
                                    name="sperker_organization_ar"
                                    onChange={handleChange}
                                    value={values.sperker_organization_ar}
                                    className="form-control"
                                    placeholder="Speaker Organization (English)"
                                  />

                                  {errors.sperker_organization_ar &&
                                    touched.sperker_organization_ar &&
                                    !!errors.sperker_organization_ar && (
                                      <div className="mt-2 text-danger">
                                        {errors.sperker_organization_ar}
                                      </div>
                                    )}
                                </div>
                                <div className="form-group mb-4">
                                  <label
                                    className="form-label"
                                    htmlFor="speaker_details_en"
                                  >
                                    Speaker Details (English)
                                  </label>
                                  <ReactQuill
                                    style={{ background: "#fff" }}
                                    theme="snow"
                                    modules={modules}
                                    value={values.speaker_details_en}
                                    onChange={(value) => {
                                      setFieldValue(
                                        "speaker_details_en",
                                        value
                                      );
                                    }}
                                  />

                                  {/* {errors.speaker_details_en &&
                          touched.speaker_details_en &&
                          !!errors.speaker_details_en && (
                            <div className="mt-2 text-danger">
                              {errors.speaker_details_en}
                            </div>
                          )} */}
                                </div>
                                <div className="form-group mb-4">
                                  <label
                                    className="form-label"
                                    htmlFor="speaker_details_ar"
                                    style={{
                                      width: "100%",
                                      textAlign: "right",
                                    }}
                                  >
                                    Speaker Details (Arabic)
                                  </label>
                                  <ReactQuill
                                    style={{ background: "#fff" }}
                                    theme="snow"
                                    modules={modules}
                                    dir="rtl"
                                    value={values.speaker_details_ar}
                                    onChange={(value) => {
                                      setFieldValue(
                                        "speaker_details_ar",
                                        value
                                      );
                                    }}
                                  />

                                  {/* {errors.speaker_details_ar &&
                          touched.speaker_details_ar &&
                          !!errors.speaker_details_ar && (
                            <div className="mt-2 text-danger">
                              {errors.speaker_details_ar}
                            </div>
                          )} */}
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
              "Loading"
            )}
          </div>
        </Row>
      </Container>
    </section>
  );
};

export default SpeakerForm;
