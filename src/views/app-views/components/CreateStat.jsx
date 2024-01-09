import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import { Row, Col, Button, Form } from "react-bootstrap";
import { invalidTokenHandler } from "services";
import ReactQuill from "react-quill";

const schema = yup.object().shape({
  cardTitle_en: yup
    .string()
    .max(100, "Must be less than 100 characters long.")
    .required("This field is Required"),
  cardTitle_ar: yup
    .string()
    .max(100, "Must be less than 100 characters long.")
    .required("This field is Required"),
  // cardDesc_en: yup
  //   .string()
  //   .max(250, "Must be less than 250 characters long.")
  //   .required("This field is Required"),
  // cardDesc_ar: yup
  //   .string()
  //   .max(250, "Must be less than 250 characters long.")
  //   .required("This field is Required"),
  cardNumber_en: yup
    .number()
    .positive("Number must be positive")
    .required("This field is Required")
    .min(1, "Incorrect Number"),

});

const CreateStat = (props) => {
  const history = useHistory();
  const location = useLocation();
  const actionType = props.actionType;
  const editable = props.editable;

  const API_URL = process.env.REACT_APP_API_URL;
  const submitHandler = (values) => {
    let formData = {
      cardTitle_en: values.cardTitle_en,
      cardTitle_ar: values.cardTitle_ar,
      cardDesc_en: values.cardDesc_en,
      cardDesc_ar: values.cardDesc_ar,
      cardNumber_en: values.cardNumber_en,
      cardNumber_ar: values.cardNumber_en,
      postFixar: values.postFixar,
      postFix: values.postFix,
      preFix: values.preFix,
      preFixAr: values.preFixAr,
      show_hide: true,
    };

    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };

    axios
      .post(`${API_URL}/api/investmentforum/card`, formData, config)
      .then((res) => {
        props.setOpenCreateModal && props.setOpenCreateModal(false);
        props.setStats &&
          props.setStats([...props.stats, { ...res.data.data }]);
      })
      .catch((error) => {
        console.log(error.response);
        const invalid = error.response.data.error;
        if (invalid === "invalid token") {
          invalidTokenHandler(history, location.pathname);
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
      [{ direction: "rtl" }], // this is rtl support
    ],
  };

  return (
    <>
      <Formik
        validationSchema={schema}
        onSubmit={submitHandler}
        initialValues={{
          cardTitle_en: "",
          cardTitle_ar: "",
          cardDesc_en: "",
          cardDesc_ar: "",
          cardNumber_en: "",
          preFixAr: "",
          preFix: "",
          postFixAr: "",
          postFix: ""
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
                    <label className="form-label" htmlFor="cardTitle_en">
                      Card title (English)
                    </label>
                    <input
                      type="text"
                      name="cardTitle_en"
                      onChange={handleChange}
                      value={values.cardTitle_en}
                      className="form-control"
                      placeholder="Card title (English)"
                    />

                    {errors.cardTitle_en &&
                      touched.cardTitle_en &&
                      !!errors.cardTitle_en && (
                        <div className="mt-2 text-danger">
                          {errors.cardTitle_en}
                        </div>
                      )}
                  </div>
                  <div className="form-group mb-4" dir="rtl">
                    <label className="form-label" htmlFor="cardTitle_ar">
                      Card title (Arabic)
                    </label>
                    <input
                      type="text"
                      name="cardTitle_ar"
                      onChange={handleChange}
                      value={values.cardTitle_ar}
                      className="form-control"
                      placeholder="Card title (Arabic)"
                    />

                    {errors.cardTitle_ar &&
                      touched.cardTitle_ar &&
                      !!errors.cardTitle_ar && (
                        <div className="mt-2 text-danger">
                          {errors.cardTitle_ar}
                        </div>
                      )}
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-label" htmlFor="cardNumber_en">
                      Number (English)
                    </label>
                    <input
                      type="number"
                      name="cardNumber_en"
                      onChange={handleChange}
                      value={values.cardNumber_en}
                      className="form-control"
                      placeholder="Card number (English)"
                    />

                    {errors.cardNumber_en &&
                      touched.cardNumber_en &&
                      !!errors.cardNumber_en && (
                        <div className="mt-2 text-danger">
                          {errors.cardNumber_en}
                        </div>
                      )}
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-label" htmlFor="cardNumber_ar">
                      Number (Arabic)
                    </label>
                    <input
                      type="number"
                      name="cardNumber_ar"
                      onChange={handleChange}
                      value={values.cardNumber_ar}
                      className="form-control"
                      placeholder="Card number (Arabic)"
                    />

                    {errors.cardNumber_ar &&
                      touched.cardNumber_ar &&
                      !!errors.cardNumber_ar && (
                        <div className="mt-2 text-danger">
                          {errors.cardNumber_ar}
                        </div>
                      )}
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-label" htmlFor="cardDesc_en">
                      Card description (English)
                    </label>
                    {/* <ReactQuill
                      style={{ background: "#fff" }}
                      theme="snow"
                      modules={modules}
                      value={values.cardDesc_en}
                      onChange={(value) => {
                        setFieldValue("cardDesc_en", value);
                      }}
                    /> */}
                    <textarea
                      name="cardDesc_en"
                      onChange={handleChange}
                      value={values.cardDesc_en}
                      className="form-control"
                      placeholder="Card description (English)"
                    >
                      {values.cardDesc_en}
                    </textarea>
                    {errors.cardDesc_en &&
                      touched.cardDesc_en &&
                      !!errors.cardDesc_en && (
                        <div className="mt-2 text-danger">
                          {errors.cardDesc_en}
                        </div>
                      )}
                  </div>
                  <div className="form-group mb-4">
                    <label
                      className="form-label"
                      htmlFor="cardDesc_ar"
                      style={{
                        width: "100%",
                        textAlign: "right",
                      }}
                    >
                      Card description(Arabic)
                    </label>
                    {/* <ReactQuill
                      style={{ background: "#fff" }}
                      theme="snow"
                      modules={modules}
                      dir="rtl"
                      value={values.cardDesc_ar}
                      onChange={(value) => {
                        setFieldValue("cardDesc_ar", value);
                      }}
                    /> */}

                    <textarea
                      name="cardDesc_ar"
                      onChange={handleChange}
                      value={values.cardDesc_ar}
                      className="form-control"
                      placeholder="Card description (Arabic)"
                    >
                      {values.cardDesc_ar}
                    </textarea>
                    {errors.cardDesc_ar &&
                      touched.cardDesc_ar &&
                      !!errors.cardDesc_ar && (
                        <div className="mt-2 text-danger">
                          {errors.cardDesc_ar}
                        </div>
                      )}
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-label" htmlFor="preFix">
                      Prefix (English)
                    </label>
                    <input
                      type="text"
                      name="preFix"
                      onChange={handleChange}
                      value={values.preFix}
                      className="form-control"
                      placeholder="Prefix  (English)"
                    />

                    {errors.preFix &&
                      touched.preFix &&
                      !!errors.preFix && (
                        <div className="mt-2 text-danger">
                          {errors.preFix}
                        </div>
                      )}
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-label" htmlFor="preFixAr">
                      Prefix (Arabic)
                    </label>
                    <input
                      type="text"
                      name="preFixAr"
                      onChange={handleChange}
                      value={values.preFixAr}
                      className="form-control"
                      placeholder="Prefix  (Arabic)"
                    />

                    {errors.preFixAr &&
                      touched.preFixAr &&
                      !!errors.preFixAr && (
                        <div className="mt-2 text-danger">
                          {errors.preFixAr}
                        </div>
                      )}
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-label" htmlFor="postFix">
                      Suffix (English)
                    </label>
                    <input
                      type="text"
                      name="postFix"
                      onChange={handleChange}
                      value={values.postFix}
                      className="form-control"
                      placeholder="Suffix  (English)"
                    />

                    {errors.postFix &&
                      touched.postFix &&
                      !!errors.postFix && (
                        <div className="mt-2 text-danger">
                          {errors.postFix}
                        </div>
                      )}
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-label" htmlFor="postFixAr">
                      Suffix (Arabic)
                    </label>
                    <input
                      type="text"
                      name="postFixAr"
                      onChange={handleChange}
                      value={values.postFixAr}
                      className="form-control"
                      placeholder="Suffix  (Arabic)"
                    />

                    {errors.postFixAr &&
                      touched.postFixAr &&
                      !!errors.postFixAr && (
                        <div className="mt-2 text-danger">
                          {errors.postFixAr}
                        </div>
                      )}
                  </div>
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

export default CreateStat;
