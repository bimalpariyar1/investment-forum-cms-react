import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import InvestLogo from "assets/images/forumcolorlogo.png";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";

const schema = yup.object().shape({
  email: yup
    .string()
    .max(100)
    .email("Invalid email")
    .required("This field is Required"),
  password: yup.string().max(25).required("This field is Required"),
});

const Login = () => {
  const history = useHistory();
  const location = useLocation();
  const [errorMessageDispaly, setErrorMessageDisplay] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(false);

  const submitHandler = (values) => {
    setLoading(true);
    const formData = {
      email: values.email,
      password: values.password,
    };

    const config = {
      headers: { "Content-Type": "application/json" },
      validateStatus: function (status) {
        return status >= 200 && status < 400;
      },
    };

    axios
      .post(
        // `${API_URL}/api/kyc/documents?id=${customerId}`,
        `${API_URL}/api/investmentforum/login`,
        formData,
        config
      )
      .then((response) => {
        if (response) {
          localStorage.setItem("logedInDate", Date.now());

          localStorage.setItem(
            "userType",
            response.data.data.isadmin === true ? "Admin" : "Users"
          );
          localStorage.setItem("id", response.data.data.id);
          localStorage.setItem("token", response.data.data.token);

          if (location.state === undefined) {
            history.push("/");
          } else {
            history.push(location.state.from.pathname);
          }
          setLoading(false);
        }
      })
      .catch((error) => {
        // console.log(error.response);
        setErrorMessageDisplay(true);
        setTimeout(() => {
          setErrorMessageDisplay(false);
        }, 3000);
      });
  };

  return (
    <>
      <Formik
        validationSchema={schema}
        onSubmit={submitHandler}
        initialValues={{
          email: "",
          password: "",
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
        }) => (
          <Container>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Row>
                <Col md={12}>
                  <div className="text-center mt-4 mb-4">
                    <img alt="..." src={InvestLogo} />
                  </div>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col sm={8} md={6} lg={4}>
                  <div className="p-4 bg-white rounded">
                    <Row>
                      <Col md={12}>
                        <h4 className="login_head">Login</h4>
                      </Col>
                      <Form.Group className="mb-4">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          isInvalid={
                            errors.email && touched.email && !!errors.email
                          }
                          maxLength={100}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          isInvalid={
                            errors.password &&
                            touched.password &&
                            !!errors.password
                          }
                          maxLength={25}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password && touched.password ? (
                            <div>{errors.password}</div>
                          ) : null}
                        </Form.Control.Feedback>
                      </Form.Group>
                      {errorMessageDispaly && (
                        <>
                          <Col md={12}>
                            <Alert variant="danger">
                              Invalid Password or Email
                            </Alert>
                          </Col>
                        </>
                      )}
                      <Col md={12}>
                        <div className="mb-4">
                          <div>
                            Forgot Password?
                            <br />
                            Please contact admin at
                            <br />
                            Email: investment.startup@qdb.qa
                            <br />
                            Phone: 44300000
                            <br />
                          </div>
                        </div>
                      </Col>

                      <Col md={12} className="text-center">
                        <Button type="submit" disabled={loading ? true : false}>
                          {loading && (
                            <Spinner
                              animation="border"
                              variant="light"
                              size="sm"
                            />
                          )}
                          Login
                        </Button>
                      </Col>
                      <Col md={12}>
                        <div>
                          <br />
                          If you are a Startup looking to be listed within the
                          Investment Forum website, please send your inquiry to
                          this email:
                        </div>
                        <div>
                          <strong>investment.startup@qdb.qa</strong>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <br />
                          إن كنت شركة ناشئة وترغب بإدراج شركتك ضمن موقع منتدى
                          الإستثمار، الرجاء التواصل عبر البريد الإلكتروني:
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <strong>investment.startup@qdb.qa</strong>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Form>
          </Container>
        )}
      </Formik>
    </>
  );
};

export default Login;
