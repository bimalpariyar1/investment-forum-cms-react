import React, { useState, useEffect } from "react";

import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

import { Row, Col, Button, Form } from "react-bootstrap";

const schema = yup.object().shape({
  company_name_en: yup.string().max(100).required("This field is Required"),
  company_name_ar: yup.string().max(100).required("This field is Required"),
  email: yup
    .string()
    .max(100)
    .email("Invalid email")
    .required("This field is Required"),
  password: yup.string().max(25).required("This field is Required"),
});

const EditUser = (props) => {
  const actionType = props.actionType;
  const editableUser = props.editableUser;

  const [currentPopUser, setCurrentPopUser] = useState(null);

  //get url form .env file
  const API_URL = process.env.REACT_APP_API_URL;
  const submitHandler = (values) => {
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };

    let formData = {
      id: editableUser.id,
      email: values.email,
      password: values.password,
      company_name_en: values.company_name_en,
      company_name_ar: values.company_name_ar,
      isadmin: false,
      show_hide: editableUser.show_hide,
    };

    // console.log(formData);

    axios
      .post(`${API_URL}/api/investmentforum/user`, formData, config)
      .then((res) => {
        console.log(res.data.data);
        if (actionType === "edit") {
          props.setUsers &&
            props.setUsers(
              props.users.map((user) => {
                if (user.id === res.data.data.id) {
                  return res.data.data;
                }
                return user;
              })
            );

          props.setOpenUserEditModal && props.setOpenUserEditModal(false);
        } else {
          props.setOpenCreateUserModal && props.setOpenCreateUserModal(false);
          props.setUsers &&
            props.setUsers([...props.users, { ...res.data.data }]);
        }
      })
      .catch((err) => console.log(err.response));
  };

  const getUserById = () => {
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };
    axios
      .get(`${API_URL}/api/investmentforum/user?id=${editableUser.id}`, config)
      .then((res) => {
        setCurrentPopUser(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (actionType === "edit") {
      getUserById();
    }
  }, []);

  return (
    <>
      {currentPopUser !== null && (
        <Formik
          validationSchema={schema}
          onSubmit={submitHandler}
          initialValues={{
            company_name_en: currentPopUser.company_name_en,
            company_name_ar: currentPopUser.company_name_ar,
            email: currentPopUser.email,
            password: currentPopUser.password,
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
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Row className="justify-content-center">
                <div className="p-4 bg-white rounded">
                  <Row>
                    <Form.Group className="mb-4">
                      <Form.Label>Company Name (English)edit</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Company Name (English)"
                        name="company_name_en"
                        value={values.company_name_en}
                        onChange={handleChange}
                        isInvalid={
                          errors.company_name_en &&
                          touched.company_name_en &&
                          !!errors.company_name_en
                        }
                        maxLength={100}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.company_name_en}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label>Company Name (Arabic)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Company Name (Arabic)"
                        name="company_name_ar"
                        value={values.company_name_ar}
                        onChange={handleChange}
                        isInvalid={
                          errors.company_name_ar &&
                          touched.company_name_ar &&
                          !!errors.company_name_ar
                        }
                        maxLength={100}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.company_name_ar}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>User Email</Form.Label>
                      {props.actionType === "create" ? (
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
                      ) : (
                        <Form.Control
                          type="text"
                          placeholder="Email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          isInvalid={
                            errors.email && touched.email && !!errors.email
                          }
                          disabled
                          maxLength={100}
                        />
                      )}

                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="text"
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
                    <Col md={12} className="text-center">
                      <Button type="submit">
                        {editableUser ? "Update" : "Create"}
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

export default EditUser;
