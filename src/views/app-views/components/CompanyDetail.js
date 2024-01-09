import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import React, { useState } from "react";

import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";

const schema = yup.object().shape({

    content_en: yup.string().max(600).required("This field is Required"),
});

const CompanyDetail = () => {
    //use for showing error message
    const [erroMessageState, setErroMessageState] = useState({});
    //get url form .env file
    const API_URL = process.env.REACT_APP_API_URL;
    console.log(API_URL)
    const submitHandler = (values) => {

        console.log(values);
        const formData = {
            "content_en": values.content_en,
            "content_ar": values.content_ar

        }
        console.log(formData)

        // const resp = axios.post(
        //     // `${API_URL}/api/kyc/documents?id=${customerId}`,
        //     `${API_URL}/api/investmentforum/user`,
        //     formData
        // ).then(res => {
        //     if (res.status !== 200) {
        //         console.log('success');
        //     }
        // })
        //     .catch(err => console.log(err));

    };

    return (
        <>
            <Formik
                validationSchema={schema}
                onSubmit={submitHandler}
                initialValues={{
                    content_en: "",
                    content_ar: "",

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

                            <Row className="justify-content-center">
                                <Col sm={8} md={6} lg={4}>
                                    <div className="p-4 bg-white rounded">
                                        <Row>
                                            <Form.Group className="mb-4">
                                                <Form.Label>Company Overview</Form.Label>
                                                <textarea
                                                    placeholder="Company Overview (English) (Arabic)"
                                                    name="content_en"
                                                    value={values.content_en}
                                                    onChange={handleChange}
                                                    isInvalid={
                                                        errors.content_en && touched.content_en && !!errors.content_en
                                                    }
                                                    maxLength={600} />

                                                <Form.Control.Feedback type="invalid">
                                                    {errors.content_en}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group className="mb-4">
                                                <Form.Label>Company Overview (Arabic)</Form.Label>
                                                <textarea
                                                    placeholder="Company Overview (Arabic)"
                                                    name="content_ar"
                                                    value={values.content_ar}
                                                    onChange={handleChange}
                                                    isInvalid={
                                                        errors.content_ar && touched.content_ar && !!errors.content_ar
                                                    }
                                                    maxLength={600} />

                                                <Form.Control.Feedback type="invalid">
                                                    {errors.content_ar}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Col md={12} className="text-center">
                                                <Button type="submit">Create</Button>
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

export default CompanyDetail;
