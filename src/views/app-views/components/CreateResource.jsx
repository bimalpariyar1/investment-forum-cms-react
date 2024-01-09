import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import { Row, Col, Button, Form } from "react-bootstrap";
import { invalidTokenHandler } from "services";
import ReactQuill from "react-quill";
import { useState } from "react";
const FILE_SIZE = 524288;
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

const CreateResource = (props) => {
  const history = useHistory();
  const location = useLocation();
  const actionType = props.actionType;
  const editable = props.editable;
  const [largeFileSizeENLogo, setLargeFileSizeENLogo] = useState(false);
  const [largeFileSizeARLogo, setLargeFileSizeARLogo] = useState(false);
  const [largeFileSizeENFile, setLargeFileSizeENFile] = useState(false);
  const [largeFileSizeARFile, setLargeFileSizeARFile] = useState(false);
  const [arDescpLength, setArDescpLength] = useState(false);
  const [enDescpLength, setEnDescpLength] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const submitHandler = async (values) => {
    let formData = {
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
      show_hide: false,
    };

    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
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
      requests.push(formData2);
    }
    if (values.publicationLogo_ar && values.publicationLogoFileName_ar) {
      formData3 = { ...formData };
      formData3.publicationLogo_ar = values.publicationLogo_ar;
      formData3.publicationLogoFileName_ar = values.publicationLogoFileName_ar;
      requests.push(formData3);
    }
    if (values.publicationFile_en && values.publicationFileName_en) {
      formData4 = { ...formData };
      formData4.publicationFile_en = values.publicationFile_en;
      formData4.publicationFileName_en = values.publicationFileName_en;
      requests.push(formData4);
    }
    if (values.publicationFile_ar && values.publicationFileName_ar) {
      formData5 = { ...formData };
      formData5.publicationFile_ar = values.publicationFile_ar;
      formData5.publicationFileName_ar = values.publicationFileName_ar;
      requests.push(formData5);
    }

    if (requests.length === 0) {
      axios
        .post(`${API_URL}/api/investmentforum/publication`, formData, config)
        .then((res) => {
          props.setOpenCreateModal && props.setOpenCreateModal(false);
        })
        .catch((err) => {
          console.log(err.response);
        });
    } else {
      var id = null;
      for (let i = 0; i < requests.length; i++) {
        let form = requests[i];
        if (id) {
          form.id = id;
        }
        let resp = await axios.post(
          `${API_URL}/api/investmentforum/publication`,
          form,
          config
        );
        if (resp) {
          id = resp.data.data.id;
          console.log("id", id);
        }
        if (i === requests.length - 1) {
          props.setOpenCreateModal && props.setOpenCreateModal(false);
        }
      }
    }
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
      [{
        color: ["#000"],
      },],
      [{ direction: "rtl" }], // this is rtl support
    ],
  };

  return (
    <>
      <Formik
        validationSchema={schema}
        onSubmit={submitHandler}
        initialValues={{
          publicationName_en: "",
          publicationName_ar: "",
          publicationDescription_en: "",
          publicationDescription_ar: "",
          publicationLogo_en: "",
          publicationLogo_ar: "",
          publicationFile_en: "",
          publicationFile_ar: "",
          publicationFileName_ar: "",
          publicationFileName_en: "",
          publicationLogoFileName_en: "",
          publicationLogoFileName_ar: "",
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
                    <label className="form-label" htmlFor="publicationName_en">
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
                    <label className="form-label" htmlFor="publicationName_ar">
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
                        File size must be less than or equal to 3MB .
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

                    {largeFileSizeARLogo && (
                      <div className="mt-3 text-danger">
                        File size must be less than or equal to 3MB .
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
                            setFieldValue(`publicationFileName_en`, file.name);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="form-control"
                    />

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
                            setFieldValue(`publicationFileName_ar`, file.name);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="form-control"
                    />

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
                        if (value.length > 250) {
                          setEnDescpLength(true);
                        } else {
                          setEnDescpLength(false);
                        }
                        setFieldValue("publicationDescription_en", value);
                      }}
                    />
                    {enDescpLength && (
                      <div className="mt-3 text-danger">
                        Text must be less than 250 .
                      </div>
                    )}
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
                        if (value.length > 250) {
                          setArDescpLength(true);
                        } else {
                          setArDescpLength(false);
                        }
                        setFieldValue("publicationDescription_ar", value);
                      }}
                    />
                    {arDescpLength && (
                      <div className="mt-3 text-danger">
                        Text must be less than 250 .
                      </div>
                    )}
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
    </>
  );
};

export default CreateResource;