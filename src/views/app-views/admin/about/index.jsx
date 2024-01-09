import { useState, useEffect } from "react";
import AppHeader from "views/app-views/components/AppHeader";
import SideNav from "views/app-views/components/SideNav";

import { Row, Col, Button, Card, Form } from "react-bootstrap";
import { Formik } from "formik";

import { object, string } from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import { invalidTokenHandler } from "services";
import AppLayout from "layouts/AppLayout";

const FILE_SIZE = 524288;
const About = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const history = useHistory();
  const [state, setState] = useState({
    loading: {
      aboutDataPostLoading: false,
    },
    isLargeFileSizeEn: false,
    isLargeFileSizeAr: false,
  });
  const [aboutDataAPI, setAboutDataAPI] = useState(null);

  const {
    loading: { aboutDataPostLoading },
  } = state;

  const submitHandler = (values) => {
    if (state.isLargeFileSizeAr || state.isLargeFileSizeEn) return;

    setState({
      ...state,
      loading: {
        ...state.loading,
        aboutDataPostLoading: true,
      },
    });
    const tokens = localStorage.getItem("token");
    const config = {
      headers: {
        token: tokens,
      },
    };
    const formData = {
      ...values,
    };

    // console.log(formData);

    axios
      .post(`${API_URL}/api/investmentforum/about`, formData, config)
      .then((res) => {
        setState({
          ...state,
          loading: {
            ...state.loading,
            aboutDataPostLoading: false,
          },
        });
        // console.log(res);
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

  const handleShowHide = (e) => {
    // console.log(e.target.checked);
    setState({
      ...state,
      loading: {
        ...state.loading,
        aboutDataPostLoading: true,
      },
    });
    const tokens = localStorage.getItem("token");
    const config = {
      headers: {
        token: tokens,
      },
    };

    const formData = {
      ...aboutDataAPI,
      show_hide_status: e.target.checked,
    };
    axios
      .post(`${API_URL}/api/investmentforum/about`, formData, config)
      .then((res) => {
        setState({
          ...state,
          loading: {
            ...state.loading,
            aboutDataPostLoading: false,
          },
        });
        console.log(res);
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
    const fetchAboutData = () => {
      const API_URL = process.env.REACT_APP_API_URL;
      axios
        .get(`${API_URL}/api/investmentforum/abouts`)
        .then((res) => {
          const data = res.data.data;
          if (Object.keys(data).length <= 0) {
            setAboutDataAPI({
              banner_image_en_file: "",
              banner_image_ar_file: "",
              banner_image_en: "",
              banner_image_ar: "",
              aboutBanner_en: "",
              aboutBanner_ar: "",
              about_title_en: "",
              about_title_ar: "",
              aboutText_en: "",
              aboutText_ar: "",
              show_hide_status: false,
              youtubeLink: "",
            });
          } else {
            if (cancel) return;
            setAboutDataAPI(data);
          }
        })
        .catch((error) => {
          // console.log(error);
        });
    };

    fetchAboutData();

    return () => {
      cancel = true;
    };
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

  const schema = object().shape({
    aboutBanner_en: string()
      .max(250, "Must be less than 250 characters long.")
      .required("This field is Required"),
    aboutBanner_ar: string()
      .max(250, "Must be less than 250 characters long.")
      .required("This field is Required"),
    about_title_en: string()
      .max(250, "Must be less than 250 characters long.")
      .required("This field is Required"),
    about_title_ar: string()
      .max(250, "Must be less than 250 characters long.")
      .required("This field is Required"),
    youtubeLink: string()
      .max(250, "Must be less than 250 characters long.")
      .required("This field is Required"),
  });

  return (
    <AppLayout>
      <AppHeader />
      <SideNav />
      <div className="app-layout">
        <div className="app-content">
          <div className="p-4">
            {aboutDataAPI ? (
              <Formik
                validationSchema={schema}
                onSubmit={submitHandler}
                initialValues={aboutDataAPI}
              >
                {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  setFieldValue,
                  values,
                  touched,
                  isValid,
                  errors,
                }) => (
                  <>
                    <Row>
                      <Col md={12} lg={12}>
                        <Form
                          noValidate
                          autoComplete="off"
                          onSubmit={handleSubmit}
                        >
                          <div className="p-4 bg-white rounded">
                            <Row>
                              <Col md={12}>
                                <Card>
                                  <Card.Header>About</Card.Header>
                                  <Card.Body>
                                    <div className="form-group mb-4">
                                      <label
                                        className="form-label"
                                        htmlFor="banner_image_en_file"
                                      >
                                        Banner image (English)
                                      </label>
                                      <input
                                        accept="image/jpg, image/jpeg, image/gif, image/png"
                                        name="banner_image_en_file"
                                        type="file"
                                        onChange={(event) => {
                                          const file = event.target.files[0];

                                          if (file.size > FILE_SIZE) {
                                            setState({
                                              ...state,
                                              isLargeFileSizeEn: true,
                                            });
                                          } else {
                                            setState({
                                              ...state,
                                              isLargeFileSizeEn: false,
                                            });
                                          }

                                          const reader = new FileReader();
                                          reader.onload = function (e) {
                                            setFieldValue(
                                              `banner_image_en_file`,
                                              reader.result.split(",")[1]
                                            );
                                            setFieldValue(
                                              `banner_image_en`,
                                              file.name
                                            );

                                            // console.log(
                                            //   reader.result.split(",")[1]
                                            // );
                                          };
                                          reader.readAsDataURL(file);
                                        }}
                                        className="form-control"
                                      />
                                      {state.isLargeFileSizeEn && (
                                        <div className="mt-2 text-danger">
                                          File size must be less or equals to 500Kb.
                                        </div>
                                      )}
                                      {values.banner_image_en === "" ? null : (
                                        <div className="mt-4">
                                          <div className="mb-4 banner-preview">
                                            <img
                                              style={{
                                                width: "100%",
                                                height: "250px",
                                                objectFit: "cover",
                                              }}
                                              alt="..."
                                              src={
                                                values.banner_image_en &&
                                                  values.banner_image_en.split(
                                                    "."
                                                  )[
                                                  values.banner_image_en
                                                    .length - 1
                                                  ] === "jpg"
                                                  ? `data:image/jpeg;base64,${values.banner_image_en_file}`
                                                  : values.banner_image_en &&
                                                    values.banner_image_en.split(
                                                      "."
                                                    )[
                                                    values.banner_image_en
                                                      .length - 1
                                                    ] === "png"
                                                    ? `data:image/png;base64,${values.banner_image_en_file}`
                                                    : values.banner_image_en &&
                                                      values.banner_image_en.split(
                                                        "."
                                                      )[
                                                      values.banner_image_en
                                                        .length - 1
                                                      ] === "jpeg"
                                                      ? `data:image/jpeg;base64,${values.banner_image_en_file}`
                                                      : `data:image/gif;base64,${values.banner_image_en_file}`
                                              }
                                            />
                                            <Button
                                              variant="danger"
                                              size="md"
                                              onClick={() => {
                                                setFieldValue(
                                                  "banner_image_en_file",
                                                  ""
                                                );
                                                setFieldValue(
                                                  "banner_image_en",
                                                  ""
                                                );
                                              }}
                                            >
                                              x
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="form-group mb-4">
                                      <label
                                        className="form-label"
                                        htmlFor="banner_image_ar_file"
                                      >
                                        Banner image (Arabic)
                                      </label>
                                      <input
                                        accept="image/jpg, image/jpeg, image/gif, image/png"
                                        name="banner_image_ar_file"
                                        type="file"
                                        onChange={(event) => {
                                          const file = event.target.files[0];
                                          if (file.size > FILE_SIZE) {
                                            setState({
                                              ...state,
                                              isLargeFileSizeAr: true,
                                            });
                                          } else {
                                            setState({
                                              ...state,
                                              isLargeFileSizeAr: false,
                                            });
                                          }
                                          const reader = new FileReader();
                                          reader.onload = function (e) {
                                            setFieldValue(
                                              `banner_image_ar_file`,
                                              reader.result.split(",")[1]
                                            );
                                            setFieldValue(
                                              `banner_image_ar`,
                                              file.name
                                            );
                                          };
                                          reader.readAsDataURL(file);
                                        }}
                                        className="form-control"
                                      />
                                      {state.isLargeFileSizeAr && (
                                        <div className="mt-2 text-danger">
                                          File size must be less or equals to 500Kb.
                                        </div>
                                      )}
                                      {values.banner_image_ar === "" || values.banner_image_ar === null ? null : (
                                        <div className="mt-4">
                                          <div className="mb-4 banner-preview">
                                            <img
                                              style={{
                                                width: "100%",
                                                height: "250px",
                                                objectFit: "cover",
                                              }}
                                              alt="..."
                                              src={
                                                values.banner_image_ar.split(
                                                  "."
                                                )[
                                                  values.banner_image_ar &&
                                                  values.banner_image_ar
                                                    .length - 1
                                                ] === "jpg"
                                                  ? `data:image/jpeg;base64,${values.banner_image_ar_file}`
                                                  : values.banner_image_ar &&
                                                    values.banner_image_ar.split(
                                                      "."
                                                    )[
                                                    values.banner_image_ar
                                                      .length - 1
                                                    ] === "png"
                                                    ? `data:image/png;base64,${values.banner_image_ar_file}`
                                                    : values.banner_image_ar &&
                                                      values.banner_image_ar.split(
                                                        "."
                                                      )[
                                                      values.banner_image_ar
                                                        .length - 1
                                                      ] === "jpeg"
                                                      ? `data:image/jpeg;base64,${values.banner_image_ar_file}`
                                                      : `data:image/gif;base64,${values.banner_image_ar_file}`
                                              }
                                            />
                                            <Button
                                              variant="danger"
                                              size="md"
                                              onClick={() => {
                                                setFieldValue(
                                                  "banner_image_ar_file",
                                                  ""
                                                );
                                                setFieldValue(
                                                  "banner_image_ar",
                                                  ""
                                                );
                                              }}
                                            >
                                              x
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    <div className="form-group mb-4">
                                      <label
                                        className="form-label"
                                        htmlFor="aboutBanner_en"
                                      >
                                        Banner Text (English)
                                      </label>
                                      <input
                                        type="text"
                                        name="aboutBanner_en"
                                        onChange={handleChange}
                                        value={values.aboutBanner_en}
                                        className="form-control"
                                        placeholder="Name of the Founder (English)"
                                      />

                                      {errors.aboutBanner_en &&
                                        touched.aboutBanner_en &&
                                        !!errors.aboutBanner_en && (
                                          <div className="mt-2 text-danger">
                                            {errors.aboutBanner_en}
                                          </div>
                                        )}
                                    </div>
                                    <div className="form-group mb-4" dir="rtl">
                                      <label
                                        className="form-label"
                                        htmlFor="aboutBanner_ar"
                                      >
                                        Banner Text (Arabic)
                                      </label>
                                      <input
                                        type="text"
                                        name="aboutBanner_ar"
                                        onChange={handleChange}
                                        value={values.aboutBanner_ar}
                                        className="form-control"
                                        placeholder="Name of the Founder (English)"
                                      />

                                      {errors.aboutBanner_ar &&
                                        touched.aboutBanner_ar &&
                                        !!errors.aboutBanner_ar && (
                                          <div className="mt-2 text-danger">
                                            {errors.aboutBanner_ar}
                                          </div>
                                        )}
                                    </div>
                                    <div className="form-group mb-4">
                                      <label
                                        className="form-label"
                                        htmlFor="about_title_en"
                                      >
                                        About Title Text (English)
                                      </label>
                                      <input
                                        type="text"
                                        name="about_title_en"
                                        onChange={handleChange}
                                        value={values.about_title_en}
                                        className="form-control"
                                        placeholder="About Title Text (English)"
                                      />

                                      {errors.about_title_en &&
                                        touched.about_title_en &&
                                        !!errors.about_title_en && (
                                          <div className="mt-2 text-danger">
                                            {errors.about_title_en}
                                          </div>
                                        )}
                                    </div>
                                    <div className="form-group mb-4" dir="rtl">
                                      <label
                                        className="form-label"
                                        htmlFor="about_title_ar"
                                      >
                                        About Title Text (Arabic)
                                      </label>
                                      <input
                                        type="text"
                                        name="about_title_ar"
                                        onChange={handleChange}
                                        value={values.about_title_ar}
                                        className="form-control"
                                        placeholder="About Title Text (Arabic)"
                                      />

                                      {errors.about_title_ar &&
                                        touched.about_title_ar &&
                                        !!errors.about_title_ar && (
                                          <div className="mt-2 text-danger">
                                            {errors.about_title_ar}
                                          </div>
                                        )}
                                    </div>
                                    <div className="form-group mb-4">
                                      <label
                                        className="form-label"
                                        htmlFor="aboutText_en"
                                      >
                                        About Text (English)
                                      </label>
                                      <ReactQuill
                                        style={{ background: "#fff" }}
                                        theme="snow"
                                        modules={modules}
                                        value={values.aboutText_en}
                                        onChange={(value) => {
                                          setFieldValue("aboutText_en", value);
                                        }}
                                      />
                                    </div>
                                    <div className="form-group mb-4">
                                      <label
                                        className="form-label"
                                        htmlFor="aboutText_ar"
                                        style={{
                                          width: "100%",
                                          textAlign: "right",
                                        }}
                                      >
                                        About Text (Arabic)
                                      </label>
                                      <ReactQuill
                                        style={{ background: "#fff" }}
                                        theme="snow"
                                        modules={modules}
                                        dir="rtl"
                                        value={values.aboutText_ar}
                                        onChange={(value) => {
                                          setFieldValue("aboutText_ar", value);
                                        }}
                                      />

                                      {/* {errors.aboutText_ar &&
                                        touched.aboutText_ar &&
                                        !!errors.aboutText_ar && (
                                          <div className="mt-2 text-danger">
                                            {errors.aboutText_ar}
                                          </div>
                                        )} */}
                                    </div>
                                  </Card.Body>

                                  <Card>
                                    <Card.Header>
                                      <div className="d-flex justify-content-between align-items-center">
                                        <div>Forum Video</div>
                                        <div className="d-flex justify-content-between align-items-center">
                                          <div style={{ marginRight: "15px" }}>
                                            Show/Hide
                                          </div>
                                          <Form.Check
                                            disabled={
                                              aboutDataPostLoading
                                                ? true
                                                : false
                                            }
                                            type="switch"
                                            id="custom-switch"
                                            size="lg"
                                            checked={values.show_hide_status}
                                            onChange={(e) => {
                                              setFieldValue(
                                                "show_hide_status",
                                                e.target.checked
                                              );

                                              handleShowHide(e);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </Card.Header>
                                    <Card.Body>
                                      <div className="form-group">
                                        <label
                                          className="form-label"
                                          htmlFor="youtubeLink"
                                        >
                                          Forum Video (Youtube Link)
                                        </label>
                                        <input
                                          type="text"
                                          name="youtubeLink"
                                          onChange={handleChange}
                                          value={values.youtubeLink}
                                          className="form-control"
                                          placeholder="Forum Video (Youtube Link)"
                                        />

                                        {errors.youtubeLink &&
                                          touched.youtubeLink &&
                                          !!errors.youtubeLink && (
                                            <div className="mt-2 text-danger">
                                              {errors.youtubeLink}
                                            </div>
                                          )}
                                      </div>
                                    </Card.Body>
                                  </Card>
                                </Card>

                                <Row className="mt-4">
                                  <Col md={6} align="right">
                                    <Button
                                      disabled={
                                        aboutDataPostLoading ? true : false
                                      }
                                      type="submit"
                                    >
                                      {aboutDataPostLoading
                                        ? "Updating"
                                        : "Update"}
                                    </Button>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </div>
                        </Form>
                      </Col>
                    </Row>
                  </>
                )}
              </Formik>
            ) : (
              "loading"
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default About;
