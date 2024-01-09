import React, { Component } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { Formik } from "formik";
import { object, string } from "yup";

class AddBanner extends Component {
  state = {
    initialValues: {},
    isLargeFileEn: false,
    isLargeFileAr: false,
  };

  submitHandler = (values) => {
    const { onSave } = this.props;
    
    if (this.state.isLargeFileAr || this.state.isLargeFileEn) return;

    onSave(values);
  };

  componentDidMount() {
    const { mode, selectedBanner } = this.props;

    if (mode === "EDIT") {
      this.setState({
        ...this.state,
        initialValues: { ...selectedBanner },
      });
    } else {
      this.setState({
        ...this.state,
        initialValues: {
          image_en_file: "",
          image_en: "",
          image_ar_file: "",
          image_ar: "",
          title_en: "",
          title_ar: "",
        },
      });
    }
  }
  render() {
    const { bannerPostLoading } = this.props;
    const { initialValues, isLargeFileEn, isLargeFileAr } = this.state;

    const FILE_SIZE = 524288;

    const schema = object().shape({
      image_en_file: string().required("This field is Required"),
      image_ar_file: string().required("This field is Required"),
      title_en: string()
        .max(250, "Must be less than 250 characters long.")
        .required("This field is Required"),
      title_ar: string()
        .max(250, "Must be less than 250 characters long.")
        .required("This field is Required"),
    });
    return (
      <>
        {Object.keys(initialValues).length > 0 ? (
          <Formik
            validationSchema={schema}
            onSubmit={this.submitHandler}
            initialValues={initialValues}
          >
            {({
              handleSubmit,
              handleChange,
              setFieldValue,
              setFieldError,
              values,
              touched,
              errors,
            }) => (
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Row>
                  <Col md={12} lg={12}>
                    <React.Fragment>
                      <div className="mb-4">
                        <div className="form-group mb-4">
                          <label className="form-label" htmlFor="file">
                            Banner image (English)
                          </label>
                          <input
                            accept="image/jpg, image/jpeg, image/gif, image/png"
                            name={`image_en_file`}
                            type="file"
                            onChange={(event) => {
                              const file = event.target.files[0];
                              const fileSize = event.target.files[0].size;
                              // alert(fileSize+"=="+FILE_SIZE);
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                const extension = file.name.split(".");
                                if (fileSize > FILE_SIZE) {
                                  this.setState({
                                    ...this.state,
                                    isLargeFileEn: true,
                                  });
                                } else {
                                  this.setState({
                                    ...this.state,
                                    isLargeFileEn: false,
                                  });
                                }
                                setFieldValue(
                                  `image_en`,
                                  event.target.files[0].name
                                );
                                // console.log(reader.result);
                                setFieldValue(
                                  `image_en_file`,
                                  reader.result.split(",")[1]
                                );

                                setFieldValue(
                                  `enExtension`,
                                  extension[extension.length - 1]
                                );
                                setFieldError("banner_en", "");
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="form-control"
                          />

                          {isLargeFileEn && (
                            <div className="mt-2 text-danger">
                              File size must be less or equal to 500kb.
                            </div>
                          )}

                          {errors &&
                            errors.image_en_file &&
                            touched &&
                            touched.image_en_file && (
                              <div className="mt-2 text-danger">
                                {errors.image_en_file}
                              </div>
                            )}
                          {values.image_en_file !== "" && (
                            <div className="mt-4">
                              <img
                                alt="..."
                                style={{
                                  width: "100%",
                                  height: 200,
                                  objectFit: "cover",
                                }}
                                src={`data:image/${values.enExtension};base64,${values.image_en_file}`}
                              />
                            </div>
                          )}
                        </div>
                        <div className="form-group mb-4">
                          <label className="form-label" htmlFor="file">
                            Banner image (Arabic)
                          </label>
                          <input
                            accept="image/jpg, image/jpeg, image/gif, image/png"
                            name={`image_ar_file`}
                            type="file"
                            onChange={(event) => {
                              const file = event.target.files[0];
                              const fileSize = event.target.files[0].size;
                              // alert(fileSize+"--"+FILE_SIZE);
                              if (fileSize > FILE_SIZE) {
                                this.setState({
                                  ...this.state,
                                  isLargeFileAr: true,
                                });
                              } else {
                                this.setState({
                                  ...this.state,
                                  isLargeFileAr: false,
                                });
                              }

                              if (file) {
                                const reader = new FileReader();
                                reader.onload = function (e) {
                                  const extension = file.name.split(".");
                                  setFieldValue(
                                    `image_ar`,
                                    event.target.files[0].name
                                  );

                                  setFieldValue(
                                    `image_ar_file`,
                                    reader.result.split(",")[1]
                                  );
                                  setFieldValue(
                                    `enExtension`,
                                    extension[extension.length - 1]
                                  );
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="form-control"
                          />

                          {isLargeFileAr && (
                            <div className="mt-2 text-danger">
                              File size must be less or equals to 500Kb.
                            </div>
                          )}

                          {errors &&
                            errors.image_ar_file &&
                            touched &&
                            touched.image_ar_file && (
                              <div className="mt-2 text-danger">
                                {errors.image_ar_file}
                              </div>
                            )}

                          {values.image_ar_file !== "" && (
                            <div className="mt-4">
                              <img
                                alt="..."
                                style={{
                                  width: "100%",
                                  height: 200,
                                  objectFit: "cover",
                                }}
                                src={`data:image/${values.arExtension};base64,${values.image_ar_file}`}
                              />
                            </div>
                          )}
                        </div>
                        <div className="form-group mb-4">
                          <label className="form-label" htmlFor={`title_en`}>
                            Banner Title (English)
                          </label>
                          <input
                            type="text"
                            name={`title_en`}
                            onChange={handleChange}
                            value={values.title_en}
                            className="form-control"
                            placeholder="Banner Title"
                          />
                          {errors &&
                            errors.title_en &&
                            touched &&
                            touched.title_en && (
                              <div className="mt-2 text-danger">
                                {errors.title_en}
                              </div>
                            )}
                        </div>
                        <div className="form-group mb-4" dir="rtl">
                          <label className="form-label" htmlFor={`title_ar`}>
                            Banner Title (Arabic)
                          </label>
                          <input
                            type="text"
                            name={`title_ar`}
                            onChange={handleChange}
                            value={values.title_ar}
                            className="form-control"
                            placeholder="Banner Title"
                          />
                          {errors &&
                            errors.title_ar &&
                            touched &&
                            touched.title_ar && (
                              <div className="mt-2 text-danger">
                                {errors.title_ar}
                              </div>
                            )}
                        </div>
                      </div>
                    </React.Fragment>

                    <Col md={12} className="text-center">
                      <Button disabled={bannerPostLoading} type="submit">
                        {bannerPostLoading ? "Saving" : "Save"}
                      </Button>
                    </Col>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        ) : (
          "loading"
        )}
      </>
    );
  }
}

export default AddBanner;
