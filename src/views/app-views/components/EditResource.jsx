import React, { useState, useEffect } from "react";

import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

import { Row, Col, Button, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
const FILE_SIZE = 314572.8;
const FILE_SIZE_RES = 3145728;
const schema = yup.object().shape({
  publicationName_en: yup
    .string()
    .max(100, "Must be less than 100 characters long.")
    .required("This field is Required"),
  publicationName_ar: yup
    .string()
    .max(100, "Must be less than 100 characters long.")
    .required("This field is Required"),
  publicationDescription_en: yup
    .string()
    .required("This field is Required"),
  publicationDescription_ar: yup
    .string()
    .required("This field is Required"),
});

const EditResource = (props) => {
  const actionType = props.actionType;
  const editable = props.editable;

  const [currentPop, setCurrentPop] = useState(null);
  const [largeFileSizeENLogo, setLargeFileSizeENLogo] = useState(false);
  const [largeFileSizeARLogo, setLargeFileSizeARLogo] = useState(false);
  const [largeFileSizeENFile, setLargeFileSizeENFile] = useState(false);
  const [largeFileSizeARFile, setLargeFileSizeARFile] = useState(false);

  //get url form .env file
  const API_URL = process.env.REACT_APP_API_URL;
  const submitHandler = (values) => {
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };

    let formData = {
      id: editable.id,
      publicationName_en: values.publicationName_en,
      publicationName_ar: values.publicationName_ar,
      publicationDate_en: new Date().toUTCString(),
      publicationDate_ar: new Intl.DateTimeFormat("ar-TN-u-ca-islamic", {
        day: "numeric",
        month: "long",
        weekday: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(Date.now()),
      publicationDescription_en: values.publicationDescription_en,
      publicationDescription_ar: values.publicationDescription_ar,
      show_hide: editable.show_hide,
    };
    let requests = [];
    let formData2;
    let formData3;
    let formData4;
    let formData5;
    if (values.publicationLogo_en && values.publicationLogoFileName_en) {
      formData2 = { ...formData };
      formData2.publicationLogo_en = values.publicationLogo_en;
      formData2.publicationLogoFileName_en = values.publicationLogoFileName_en;
      requests.push(
        axios.post(
          `${API_URL}/api/investmentforum/publication`,
          formData2,
          config
        )
      );
    }
    if (values.publicationLogo_ar && values.publicationLogoFileName_ar) {
      formData3 = { ...formData };
      formData3.publicationLogo_ar = values.publicationLogo_ar;
      formData3.publicationLogoFileName_ar = values.publicationLogoFileName_ar;
      requests.push(
        axios.post(
          `${API_URL}/api/investmentforum/publication`,
          formData3,
          config
        )
      );
    }
    if (values.publicationFile_en && values.publicationFileName_en) {
      formData4 = { ...formData };
      formData4.publicationFile_en = values.publicationFile_en;
      formData4.publicationFileName_en = values.publicationFileName_en;
      requests.push(
        axios.post(
          `${API_URL}/api/investmentforum/publication`,
          formData4,
          config
        )
      );
    }
    if (values.publicationFile_ar && values.publicationFileName_ar) {
      formData5 = { ...formData };
      formData5.publicationFile_ar = values.publicationFile_ar;
      formData5.publicationFileName_ar = values.publicationFileName_ar;
      requests.push(
        axios.post(
          `${API_URL}/api/investmentforum/publication`,
          formData5,
          config
        )
      );
    }

    if (requests.length === 0) {
      requests.push(
        axios.post(
          `${API_URL}/api/investmentforum/publication`,
          formData,
          config
        )
      );
    }

    axios
      .all(requests)
      .then(
        axios.spread((...responses) => {
          /* props.setPubs &&
            props.setPubs(
              props.pubs.map((pub) => {
                if (pub.id === res.data.data.id) {
                  return res.data.data;
                }
                return pub;
              })
            );
 */
          props.setOpenEditModal && props.setOpenEditModal(false);
          // use/access the results
        })
      )
      .catch((errors) => {
        console.log(errors.response);
      });
  };

  useEffect(() => {
    if (actionType === "edit" && editable) {
      setCurrentPop(editable);
    }
  }, [editable]);

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

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  return (
    <>
      {currentPop !== null && (
        <Formik
          validationSchema={schema}
          onSubmit={submitHandler}
          initialValues={{
            publicationName_en: currentPop.publicationName_en,
            publicationName_ar: currentPop.publicationName_ar,
            publicationDescription_en: currentPop.publicationDescription_en,
            publicationDescription_ar: currentPop.publicationDescription_ar,
            publicationLogo_en: currentPop.publicationLogo_en,
            publicationLogo_ar: currentPop.publicationLogo_ar,
            publicationFile_en: currentPop.publicationFile_en,
            publicationFile_ar: currentPop.publicationFile_ar,
            publicationFileName_ar: currentPop.publicationFileName_ar,
            publicationFileName_en: currentPop.publicationFileName_en,
            publicationLogoFileName_en: currentPop.publicationLogoFileName_en,
            publicationLogoFileName_ar: currentPop.publicationLogoFileName_ar,
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
            setFieldValue,
          }) => (
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Row className="justify-content-center">
                <div className="p-4 bg-white rounded">
                  <Row>
                    <div className="form-group mb-4">
                      <label
                        className="form-label"
                        htmlFor="publicationName_en"
                      >
                        Resource Name (English)
                      </label>
                      <input
                        type="text"
                        name="publicationName_en"
                        onChange={handleChange}
                        value={values.publicationName_en}
                        className="form-control"
                        placeholder="Resource Name (English)"
                      />

                      {errors.publicationName_en &&
                        touched.publicationName_en &&
                        !!errors.publicationName_en && (
                          <div className="mt-2 text-danger">
                            {errors.publicationName_en}
                          </div>
                        )}
                    </div>
                    <div className="form-group mb-4" dir="rtl">
                      <label
                        className="form-label"
                        htmlFor="publicationName_ar"
                      >
                        Resource Name (Arabic)
                      </label>
                      <input
                        type="text"
                        name="publicationName_ar"
                        onChange={handleChange}
                        value={values.publicationName_ar}
                        className="form-control"
                        placeholder="Resource Name (Arabic)"
                      />

                      {errors.publicationName_ar &&
                        touched.publicationName_ar &&
                        !!errors.publicationName_ar && (
                          <div className="mt-2 text-danger">
                            {errors.publicationName_ar}
                          </div>
                        )}
                    </div>
                    <div className="form-group mb-4">
                      <label className="form-label" htmlFor="file">
                        Resource Logo (English)
                      </label>
                      <input
                        accept="image/jpg, image/jpeg, image/gif, image/png"
                        name={`publicationLogo_en`}
                        type="file"
                        onChange={(event) => {
                          const file = event.target.files[0];
                          if (file.size > FILE_SIZE) {
                            setLargeFileSizeENLogo(true);
                          } else {
                            setLargeFileSizeENLogo(false);
                            const reader = new FileReader();
                            reader.onload = function (e) {
                              setFieldValue(
                                `publicationLogo_en`,
                                reader.result.split(",")[1]
                              );
                              setFieldValue(
                                `publicationLogoFileName_en`,
                                file.name
                              );
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="form-control"
                      />

                      {largeFileSizeENLogo && (
                        <div className="mt-3 text-danger">
                          File size must be less than or equal to 300Kb .
                        </div>
                      )}
                      {currentPop.publicationLogo_en && (
                        <div className="mt-3">
                          <a
                            className="c-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              openInNewTab(currentPop.publicationLogo_en);
                            }}
                          >
                            Logo_en file
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-4">
                      <label className="form-label" htmlFor="file">
                        Resource Logo (Arabic)
                      </label>
                      <input
                        accept="image/jpg, image/jpeg, image/gif, image/png"
                        name={`publicationLogo_ar`}
                        type="file"
                        onChange={(event) => {
                          const file = event.target.files[0];
                          if (file.size > FILE_SIZE) {
                            setLargeFileSizeARLogo(true);
                          } else {
                            setLargeFileSizeARLogo(false);
                            const reader = new FileReader();
                            reader.onload = function (e) {
                              setFieldValue(
                                `publicationLogo_ar`,
                                reader.result.split(",")[1]
                              );
                              setFieldValue(
                                `publicationLogoFileName_ar`,
                                file.name
                              );
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="form-control"
                      />
                      {currentPop.publicationLogo_ar && (
                        <div className="mt-3">
                          <a
                            className="c-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              openInNewTab(currentPop.publicationLogo_ar);
                            }}
                          >
                            Logo_ar file
                          </a>
                        </div>
                      )}
                      {largeFileSizeARLogo && (
                        <div className="mt-3 text-danger">
                          File size must be less than or equal to 300kb .
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-4">
                      <label className="form-label" htmlFor="file">
                        Resource File (English)
                      </label>
                      <input
                        name={`publicationFile_en`}
                        type="file"
                        onChange={(event) => {
                          const file = event.target.files[0];
                          if (file.size > FILE_SIZE_RES) {
                            setLargeFileSizeENFile(true);
                          } else {
                            setLargeFileSizeENFile(false);
                            const reader = new FileReader();
                            reader.onload = function (e) {
                              setFieldValue(
                                `publicationFile_en`,
                                reader.result.split(",")[1]
                              );
                              setFieldValue(
                                `publicationFileName_en`,
                                file.name
                              );
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="form-control"
                      />
                      {currentPop.publicationFile_en && (
                        <div className="mt-3">
                          <a
                            className="c-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              openInNewTab(currentPop.publicationFile_en);
                            }}
                          >
                            File_en
                          </a>
                        </div>
                      )}
                      {largeFileSizeENFile && (
                        <div className="mt-3 text-danger">
                          File size must be less than or equal to 3MB .
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-4">
                      <label className="form-label" htmlFor="file">
                        Resource File (Arabic)
                      </label>
                      <input
                        name={`publicationFile_ar`}
                        type="file"
                        onChange={(event) => {
                          const file = event.target.files[0];
                          if (file.size > FILE_SIZE_RES) {
                            setLargeFileSizeARFile(true);
                          } else {
                            setLargeFileSizeARFile(false);
                            const reader = new FileReader();
                            reader.onload = function (e) {
                              setFieldValue(
                                `publicationFile_ar`,
                                reader.result.split(",")[1]
                              );
                              setFieldValue(
                                `publicationFileName_ar`,
                                file.name
                              );
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="form-control"
                      />
                      {currentPop.publicationFile_ar && (
                        <div className="mt-3">
                          <a
                            className="c-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              openInNewTab(currentPop.publicationFile_ar);
                            }}
                          >
                            File_ar
                          </a>
                        </div>
                      )}
                      {largeFileSizeARFile && (
                        <div className="mt-3 text-danger">
                          File size must be less than or equal to 3MB .
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-4">
                    <label
                      className="form-label"
                      htmlFor="publicationDescription_en"
                    >
                      Resource description (English)
                    </label>
                    <textarea
                      style={{ minHeight: "150px" }}
                      onChange={handleChange}
                      name="publicationDescription_en"
                      className="form-control"
                      value={values.publicationDescription_en}
                      placeholder="Resource description (English)"
                    ></textarea>

                    {errors.publicationDescription_en &&
                      touched.publicationDescription_en &&
                      !!errors.publicationDescription_en && (
                        <div className="mt-2 text-danger">
                          {errors.publicationDescription_en}
                        </div>
                      )}
                  </div>
                  <div className="form-group mb-4">
                    <label
                      className="form-label"
                      htmlFor="publicationDescription_ar"
                    >
                      Resource description (Arabic)
                    </label>
                    <textarea
                      style={{ minHeight: "150px" }}
                      onChange={handleChange}
                      name="publicationDescription_ar"
                      className="form-control"
                      value={values.publicationDescription_ar}
                      placeholder="Resource description (Arabic)"
                    ></textarea>

                    {errors.publicationDescription_ar &&
                      touched.publicationDescription_ar &&
                      !!errors.publicationDescription_ar && (
                        <div className="mt-2 text-danger">
                          {errors.publicationDescription_ar}
                        </div>
                      )}
                  </div>
                    {/* <div className="form-group mb-4">
                      <label
                        className="form-label"
                        htmlFor="publicationDescription_en"
                        style={{
                          width: "100%",
                          textAlign: "right",
                        }}
                      >
                        Resource description (English)
                      </label>
                      <ReactQuill
                        style={{ background: "#fff" }}
                        theme="snow"
                        modules={modules}
                        dir="rtl"
                        value={values.publicationDescription_en}
                        onChange={(value) => {
                          setFieldValue("publicationDescription_en", value);
                        }}
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label
                        className="form-label"
                        htmlFor="publicationDescription_ar"
                        style={{
                          width: "100%",
                          textAlign: "right",
                        }}
                      >
                        Resource description (Arabic)
                      </label>
                      <ReactQuill
                        style={{ background: "#fff" }}
                        theme="snow"
                        modules={modules}
                        dir="rtl"
                        value={values.publicationDescription_ar}
                        onChange={(value) => {
                          setFieldValue("publicationDescription_ar", value);
                        }}
                      />
                    </div> */}
                    <Col md={12} className="text-center">
                      <Button type="submit">
                        {editable ? "Update" : "Create"}
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Row>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default EditResource;
