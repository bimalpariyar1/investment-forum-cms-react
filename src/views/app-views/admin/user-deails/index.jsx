import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import SideNav from "views/app-views/components/SideNav";
import { useHistory } from "react-router-dom";
import AppHeader from "views/app-views/components/AppHeader";

import PdfIcon from "assets/images/pdficon.png";
import AppLayout from "layouts/AppLayout";
import { toast } from "react-toastify";
const FILE_SIZE_FOR_PDF = 3145728;
const FILE_SIZE_RES = 314572.8;

const schema = yup.object().shape({
  content_en: yup.string().max(600, "Must be less than 600 characters long.").required("This field is Required"),
  content_ar: yup.string().max(600, "Must be less than 600 characters long.").required("This field is Required"),
  founder_name_en: yup.string().required("This field is Required"),
  founder_name_ar: yup.string().required("This field is Required"),
  company_website_url: yup.string().required("This field is Required"),
  raiseAmount_en: yup.string().required("This field is Required"),
  raiseAmount_ar: yup.string().required("This field is Required"),
  meeting_url: yup.string().required("This field is Required"),
});

const UserDetails = () => {
  const history = useHistory();
  const params = useParams();
  const [userDetailData, setUserDetailDetailData] = useState({});
  const [userError, setUserError] = useState(false);
  const [largeFileSizeFile, setLargeFileSizeFile] = useState(false);

  const [state, setState] = useState({
    isSummaryDocLarger: false,
    isInvestDecDocLarger: false,
  });

  const API_URL = process.env.REACT_APP_API_URL;
  //logo upload state
  const [currentID, setCurrentID] = useState(null);

  const [loadings, setLoadings] = useState({
    usersDataLoading: false,
    postUserLoading: false,
  });

  const { usersDataLoading, postUserLoading } = loadings;

  //called on click of update button
  const submitHandler = async (values) => {
    if (state.isSummaryDocLarger || state.isInvestDecDocLarger) return;

    const isAdmin = localStorage.getItem("userType") === "Admin" ? true : false;
    const formData = {
      id: currentID,
      company_website_url: values.company_website_url,
      content_ar: values.content_ar,
      content_ar: values.content_ar,
      content_en: values.content_en,
      founder_name_ar: values.founder_name_ar,
      founder_name_en: values.founder_name_en,
      meeting_url: values.meeting_url,
      raiseAmount_ar: values.raiseAmount_ar,
      raiseAmount_en: values.raiseAmount_en,
      user_id: values.user_id,
    };

    // console.log(formData);

    setLoadings({
      ...loadings,
      postUserLoading: true,
    });

    setLoadings({
      ...loadings,
      usersDataLoading: true,
    });

    let requests = [];
    let formData2;
    let formData3;
    let formData4;

    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };

    if (values.investmentDeckDoc && values.investmentDeckDoc_file) {
      formData2 = { ...formData };
      formData2.investmentDeckDoc = values.investmentDeckDoc;
      formData2.investmentDeckDoc_file = values.investmentDeckDoc_file;
      requests.push(formData2);
    }
    if (values.investmentSummaryDoc && values.investmentSummaryDoc_file) {
      formData3 = { ...formData };
      formData3.investmentSummaryDoc = values.investmentSummaryDoc;
      formData3.investmentSummaryDoc_file = values.investmentSummaryDoc_file;
      requests.push(formData3);
    }
    if (values.logo && values.logo_file) {
      formData4 = { ...formData };
      formData4.logo = values.logo;
      formData4.logo_file = values.logo_file;
      requests.push(formData4);
    }

    if (requests.length === 0) {
      axios
        .post(
          `${API_URL}/api/investmentforum/userdetail?userid=${params.id}&isadmin=${isAdmin}`,
          formData,
          config
        )
        .then((res) => {
          getUSerDetail();
          toast.success("Successfully updated");
        })
        .catch((err) => {
          console.log(err.response);
          toast.error("Not updated");
        });
    } else {
      for (let i = 0; i < requests.length; i++) {
        const form = requests[i];
        const resp = await axios.post(
          `${API_URL}/api/investmentforum/userdetail?userid=${params.id}&isadmin=${isAdmin}`,
          form,
          config
        );
        if (i === requests.length - 1) {
          getUSerDetail();
        }
      }
    }
  };

  //call function getUserDetail start
  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      getUSerDetail();
    }
    return () => {
      isMounted = false;
    };
  }, []);
  //call function getUserDetail end

  /**
    API request is sent start
  **/
  const getUSerDetail = () => {
    setLoadings({
      ...loadings,
      usersDataLoading: true,
    });
    /*
    get id from parameter
    */

    //get the token from loacl storage
    const tokens = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("userType") === "Admin" ? true : false;
    const config = {
      headers: { token: tokens },
    };

    axios
      .get(
        `${API_URL}/api/investmentforum/userdetailbyuser?userid=${params.id}&isadmin=${isAdmin}`,
        config
      )
      .then((response) => {
        if (response.status === 200) {
          const {
            company_website_url,
            content_ar,
            content_en,
            founder_name_ar,
            founder_name_en,
            investmentDeckDoc,
            investmentDeckDoc_file,
            investmentSummaryDoc,
            investmentSummaryDoc_file,
            logo,
            logo_file,
            meeting_url,
            raiseAmount_ar,
            raiseAmount_en,
          } = response.data.data;
          const userData = {
            ...response.data.data,
            company_website_url:
              company_website_url === null ? "" : company_website_url,
            content_ar: content_ar === null ? "" : content_ar,
            content_en: content_en === null ? "" : content_en,
            founder_name_ar: founder_name_ar === null ? "" : founder_name_ar,
            founder_name_en: founder_name_en === null ? "" : founder_name_en,
            investmentDeckDoc:
              investmentDeckDoc === null ? "" : investmentDeckDoc,
            investmentDeckDoc_file:
              investmentDeckDoc_file === null ? "" : investmentDeckDoc_file,
            investmentSummaryDoc:
              investmentSummaryDoc === null ? "" : investmentSummaryDoc,
            investmentSummaryDoc_file:
              investmentSummaryDoc_file === null
                ? ""
                : investmentSummaryDoc_file,
            logo: logo === null ? "" : logo,
            logo_file: logo_file === null ? "" : logo_file,
            meeting_url: meeting_url === null ? "" : meeting_url,
            raiseAmount_ar: raiseAmount_ar === null ? "" : raiseAmount_ar,
            raiseAmount_en: raiseAmount_en === null ? "" : raiseAmount_en,
            user_id: params.id,
          };
          // console.log("user data ===>", response.data.data);

          setUserDetailDetailData(userData);

          setLoadings({
            ...loadings,
            usersDataLoading: false,
          });

          setCurrentID(response.data.data.id);
        }
      })
      .catch((error) => {
        // console.log("get user", error.response.data);
        setLoadings({
          ...loadings,
          usersDataLoading: false,
        });

        setUserError(true);
      });
  };
  //API request is sent end

  /*
    Delete Record start
  */
  const deleteRecord = () => {
    const tokens = localStorage.getItem("token");
    const config = {
      headers: { token: tokens },
    };
    axios
      .delete(
        `${API_URL}/api/investmentforum/userdetail?id=${params.id}`,
        config
      )
      .then((response) => {
        // console.log(response);
        getUSerDetail();
        history.push("/");
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const initialValues = {
    content_en: "asd",
    content_ar: "",
    founder_name_en: "",
    founder_name_ar: "",
    company_website_url: "",
    raiseAmount_en: "",
    raiseAmount_ar: "",
    meeting_url: "",
  };
  /*
    Initial value of form  end
  */

  return (
    <AppLayout>
      <AppHeader />
      <SideNav />

      <div className="app-layout">
        <div className="app-content">
          <div className="p-4">
            {usersDataLoading
              ? "loading"
              : userError
                ? "User Not found"
                : Object.keys(userDetailData).length > 0 && (
                  <Formik
                    validationSchema={schema}
                    onSubmit={submitHandler}
                    initialValues={userDetailData || initialValues}
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
                              <Card.Header>
                                <div className="d-flex justify-content-between">
                                  <div>Company</div>
                                  <div>
                                    <Button
                                      size="sm"
                                      variant="danger"
                                      onClick={deleteRecord}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </Card.Header>
                              <Card.Body>
                                <Form
                                  noValidate
                                  autoComplete="off"
                                  onSubmit={handleSubmit}
                                >
                                  <div className="bg-white rounded">
                                    <Row>
                                      {/* logo Upload  start*/}
                                      <div className="form-group mb-4">
                                        <label
                                          className="form-label"
                                          htmlFor="logo_file"
                                        >
                                          Company Logo
                                        </label>

                                        <input
                                          accept="image/jpg, image/jpeg, image/gif, image/png"
                                          name="logo_file"
                                          type="file"
                                         

                                          onChange={(event) => {
                                            setFieldValue(
                                              "logo",
                                              event.target.files[0].name
                                            );
                                            const file = event.target.files[0];

                                            if (file) {
                                              if (file.size > FILE_SIZE_RES) {
                                                setLargeFileSizeFile(true);
                                              } else {
                                                setLargeFileSizeFile(false);
                                                const reader = new FileReader();

                                                reader.onload = function (e) {

                                                  setFieldValue(
                                                    "logo_file",
                                                    reader.result.split(",")[1]
                                                  );
                                                };
                                                reader.readAsDataURL(file);
                                              }
                                            }
                                          }}
                                          className="form-control"
                                        />
                                        {largeFileSizeFile && (
                                          <div className="mt-3 text-danger">
                                            File size must be less than or equal to 500KB .
                                          </div>
                                        )}
                                        {errors &&
                                          errors.logo_file &&
                                          values.logo === "" &&
                                          touched.logo_file && (
                                            <div className="mt-2 text-danger">
                                              {errors.logo_file}
                                            </div>
                                          )}
                                        {values.logo_file === "" ? (
                                          <div className="my-4 logo_preview">
                                            <img
                                              style={{ width: "100px" }}
                                              alt="..."
                                              src={values.logo}
                                            />
                                          </div>
                                        ) : (
                                          <div>
                                            <div className="my-4 logo_preview">
                                              <img
                                                style={{ width: "100px" }}
                                                alt="..."
                                                src={
                                                  values.logo.split(".")[
                                                    values.logo.length - 1
                                                  ] === "jpg"
                                                    ? `data:image/jpeg;base64,${values.logo_file}`
                                                    : values.logo.split(".")[
                                                      values.logo.length - 1
                                                    ] === "png"
                                                      ? `data:image/png;base64,${values.logo_file}`
                                                      : values.logo.split(".")[
                                                        values.logo.length - 1
                                                      ] === "jpeg"
                                                        ? `data:image/jpeg;base64,${values.logo_file}`
                                                        : `data:image/gif;base64,${values.logo_file}`
                                                }
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      {/* logo Upload  end*/}
                                      {/* ------------------------------- */}

                                      {/* ------------------------------- */}
                                      {/* company overvview start*/}
                                      <div className="form-group mb-4">
                                        <label
                                          className="form-label"
                                          htmlFor="content_en"
                                        >
                                          Company Overview (English)
                                        </label>
                                        <textarea
                                          style={{ minHeight: "150px" }}
                                          onChange={handleChange}
                                          name="content_en"
                                          className="form-control"
                                          value={values.content_en}
                                          placeholder="Company Overview (English)"
                                        ></textarea>

                                        {errors.content_en &&
                                          touched.content_en &&
                                          !!errors.content_en && (
                                            <div className="mt-2 text-danger">
                                              {errors.content_en}
                                            </div>
                                          )}
                                      </div>
                                      <div
                                        className="form-group mb-4"
                                        dir="rtl"
                                      >
                                        <label
                                          className="form-label"
                                          htmlFor="content_ar"
                                        >
                                          Company Overview (Arabic)
                                        </label>
                                        <textarea
                                          style={{ minHeight: "150px" }}
                                          onChange={handleChange}
                                          name="content_ar"
                                          value={values.content_ar}
                                          placeholder="Company Overview (Arabic)"
                                          className="form-control"
                                        ></textarea>

                                        {errors.content_ar &&
                                          touched.content_ar &&
                                          !!errors.content_ar && (
                                            <div className="mt-2 text-danger">
                                              {errors.content_ar}
                                            </div>
                                          )}
                                      </div>
                                      {/* company overvview end*/}
                                      {/* ------------------------------- */}

                                      {/* name of founder start*/}
                                      <div className="form-group mb-4">
                                        <label
                                          className="form-label"
                                          htmlFor="founder_name_en"
                                        >
                                          Name of the Founder (English)
                                        </label>
                                        <input
                                          type="text"
                                          name="founder_name_en"
                                          onChange={handleChange}
                                          value={values.founder_name_en}
                                          className="form-control"
                                          placeholder="Name of the Founder (English)"
                                        />

                                        {errors.founder_name_en &&
                                          touched.founder_name_en &&
                                          !!errors.founder_name_en && (
                                            <div className="mt-2 text-danger">
                                              {errors.founder_name_en}
                                            </div>
                                          )}
                                      </div>
                                      <div
                                        className="form-group mb-4"
                                        dir="rtl"
                                      >
                                        <label
                                          className="form-label"
                                          htmlFor="founder_name_ar"
                                        >
                                          Name of the Founder (Arabic)
                                        </label>
                                        <input
                                          type="text"
                                          name="founder_name_ar"
                                          onChange={handleChange}
                                          value={values.founder_name_ar}
                                          className="form-control"
                                          placeholder="Name of the Founder (Arabic)"
                                        />

                                        {errors.founder_name_ar &&
                                          touched.founder_name_ar &&
                                          !!errors.founder_name_ar && (
                                            <div className="mt-2 text-danger">
                                              {errors.founder_name_ar}
                                            </div>
                                          )}
                                      </div>
                                      {/* name of founder end*/}
                                      {/* ------------------------------- */}

                                      {/* company website start*/}
                                      <div className="form-group mb-4">
                                        <label
                                          className="form-label"
                                          htmlFor="company_website_url"
                                        >
                                          Company Website URL
                                        </label>
                                        <input
                                          type="text"
                                          name="company_website_url"
                                          onChange={handleChange}
                                          value={values.company_website_url}
                                          className="form-control"
                                          placeholder="Company Website URL"
                                        />

                                        {errors.company_website_url &&
                                          touched.company_website_url &&
                                          !!errors.company_website_url && (
                                            <div className="mt-2 text-danger">
                                              {errors.company_website_url}
                                            </div>
                                          )}
                                      </div>
                                      {/* company website end*/}
                                      {/* ------------------------------- */}

                                      {/* raise amount start*/}
                                      <div className="form-group mb-4">
                                        <label
                                          className="form-label"
                                          htmlFor="raiseAmount_en"
                                        >
                                          Raise amount (English)
                                        </label>
                                        <input
                                          type="text"
                                          name="raiseAmount_en"
                                          onChange={handleChange}
                                          value={values.raiseAmount_en}
                                          className="form-control"
                                          placeholder="Raise amount (English)"
                                        />
                                        {errors.raiseAmount_en &&
                                          touched.raiseAmount_en &&
                                          !!errors.raiseAmount_en && (
                                            <div className="mt-2 text-danger">
                                              {errors.raiseAmount_en}
                                            </div>
                                          )}
                                      </div>
                                      <div
                                        className="form-group mb-4"
                                        dir="rtl"
                                      >
                                        <label
                                          className="form-label"
                                          htmlFor="raiseAmount_ar"
                                        >
                                          Raise amount (Arabic)
                                        </label>
                                        <input
                                          type="text"
                                          name="raiseAmount_ar"
                                          onChange={handleChange}
                                          value={values.raiseAmount_ar}
                                          className="form-control"
                                          placeholder="Raise amount (Arabic)"
                                        />

                                        {errors.raiseAmount_ar &&
                                          touched.raiseAmount_ar &&
                                          !!errors.raiseAmount_ar && (
                                            <div className="mt-2 text-danger">
                                              {errors.raiseAmount_ar}
                                            </div>
                                          )}
                                      </div>
                                      {/* raise amount end*/}
                                      {/* ------------------------------- */}

                                      {/* investment summary start*/}
                                      <div className="form-group mb-4">
                                        <label
                                          className="form-label"
                                          htmlFor="investmentSummaryDoc_file"
                                        >
                                          Investment Summary
                                        </label>
                                        <input
                                          accept="application/pdf"
                                          name="investmentSummaryDoc_file"
                                          type="file"
                                          onChange={(event) => {
                                            setFieldValue(
                                              "investmentSummaryDoc",
                                              event.target.files[0].name
                                            );

                                            const file = event.target.files[0];
                                            const fileSize = file.size;
                                            if (fileSize > FILE_SIZE_FOR_PDF) {
                                              setState({
                                                ...state,
                                                isSummaryDocLarger: true,
                                              });
                                            } else {
                                              setState({
                                                ...state,
                                                isSummaryDocLarger: false,
                                              });
                                            }

                                            const reader = new FileReader();
                                            reader.onload = function (e) {
                                              setFieldValue(
                                                "investmentSummaryDoc_file",
                                                reader.result.split(",")[1]
                                              );
                                            };
                                            reader.readAsDataURL(file);
                                          }}
                                          className="form-control"
                                        />

                                        {state.isSummaryDocLarger && (
                                          <div className="mt-2 text-danger">
                                            File size must be less than
                                            3MB.
                                          </div>
                                        )}

                                        {errors &&
                                          errors.investmentSummaryDoc_file &&
                                          touched.investmentSummaryDoc_file &&
                                          values.investmentSummaryDoc_file !==
                                          "" && (
                                            <div className="mt-2 text-danger">
                                              {errors.investmentSummaryDoc_file}
                                            </div>
                                          )}

                                        {values.investmentSummaryDoc !== "" && (
                                          <div className="doc_download_holder mt-4">
                                            <a
                                              href={values.investmentSummaryDoc}
                                              title="Download pdf document"
                                            >
                                              <img alt="..." src={PdfIcon} />
                                              Investment Summary Doc
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                      {/* investment summary end*/}
                                      {/* ------------------------------- */}

                                      {/* investment deck start*/}
                                      <div className="form-group mb-4">
                                        <label
                                          className="form-label"
                                          htmlFor="investmentDeckDoc_file"
                                        >
                                          Investment Deck
                                        </label>
                                        <input
                                          accept="application/pdf"
                                          name="investmentDeckDoc_file"
                                          type="file"
                                          onChange={(event) => {
                                            setFieldValue(
                                              "investmentDeckDoc",
                                              event.target.files[0].name
                                            );

                                            const file = event.target.files[0];
                                            const fileSize = file.size;

                                            if (fileSize > FILE_SIZE_FOR_PDF) {
                                              setState({
                                                ...state,
                                                isInvestDecDocLarger: true,
                                              });
                                            } else {
                                              setState({
                                                ...state,
                                                isInvestDecDocLarger: false,
                                              });
                                            }

                                            const reader = new FileReader();
                                            reader.onload = function (e) {
                                              setFieldValue(
                                                "investmentDeckDoc_file",
                                                reader.result.split(",")[1]
                                              );
                                            };
                                            reader.readAsDataURL(file);
                                          }}
                                          className="form-control"
                                        />

                                        {state.isInvestDecDocLarger && (
                                          <div className="mt-2 text-danger">
                                            File size must be less than
                                            3MB.
                                          </div>
                                        )}

                                        {errors &&
                                          errors.investmentDeckDoc_file &&
                                          touched.investmentDeckDoc_file &&
                                          values.investmentDeckDoc_file ===
                                          "" && (
                                            <div className="mt-2 text-danger">
                                              {errors.investmentDeckDoc_file}
                                            </div>
                                          )}

                                        {values.investmentDeckDoc !== "" && (
                                          <div className="doc_download_holder mt-4">
                                            <a
                                              href={values.investmentDeckDoc}
                                              title="Download pdf document"
                                            >
                                              <img alt="..." src={PdfIcon} />
                                              Investment Deck Doc
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                      {/* investment deck  end*/}
                                      {/* ------------------------------- */}
                                      <div className="form-group mb-4">
                                        <label
                                          className="form-label"
                                          htmlFor="meeting_url"
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

                                        {errors.meeting_url &&
                                          touched.meeting_url &&
                                          !!errors.meeting_url && (
                                            <div className="mt-2 text-danger">
                                              {errors.meeting_url}
                                            </div>
                                          )}
                                      </div>

                                      <Col md={12}>
                                        <Row>
                                          <Col md={12} align="center">
                                            <Button
                                              type="submit"
                                              disabled={
                                                postUserLoading ? true : false
                                              }
                                            >
                                              {postUserLoading
                                                ? "Updating"
                                                : "Update"}
                                            </Button>
                                          </Col>
                                        </Row>
                                      </Col>
                                    </Row>
                                  </div>
                                </Form>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Formik>
                )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default UserDetails;