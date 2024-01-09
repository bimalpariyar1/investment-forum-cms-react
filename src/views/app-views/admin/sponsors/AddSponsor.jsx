import { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { Formik } from "formik";
import { object, string } from "yup";
const FILE_SIZE = 314572.8;

const schema = object().shape({
  link: string()
    .max(250, "Must be less than 250 characters long.")
    .required("This field is Required"),
});

const AddSponsor = (props) => {
  const { mode, selectedSponsor, onSave, sponsorPostLoading } = props;
  const [state, setState] = useState({
    initialValues: {
      logo: "",
      link: "",
      logo_file: "",
    },
    largeFileSize: null,
  });

  const { initialValues } = state;

  const submitHandler = (values) => {
    if (state.largeFileSize) return;
    onSave(values);
  };

  return (
    <div>
      {Object.keys(initialValues).length > 0 && (
        <Formik
          noValidate
          onSubmit={submitHandler}
          validationSchema={schema}
          initialValues={
            mode === "ADD" ? initialValues : { ...selectedSponsor }
          }
        >
          {({
            handleSubmit,
            handleChange,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Row>
                <div className="form-group mb-4">
                  <label className="form-label" htmlFor="file">
                    Sponsor Logo
                  </label>
                  <input
                    accept="image/jpg, image/jpeg, image/gif, image/png"
                    name={`logo_file`}
                    type="file"
                    onChange={(event) => {
                      const file = event.target.files[0];
                      if (file.size > FILE_SIZE) {
                        setState({
                          ...state,
                          largeFileSize: true,
                        });
                      } else {
                        setState({
                          ...state,
                          largeFileSize: false,
                        });
                      }

                      const reader = new FileReader();
                      reader.onload = function (e) {
                        // console.log(reader.result);
                        setFieldValue(`logo_file`, reader.result.split(",")[1]);
                        setFieldValue(`logo`, event.target.files[0].name);
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="form-control"
                  />

                  {state.largeFileSize && (
                    <div className="mt-3 text-danger">
                      File size must be less than or equal to 300Kb .
                    </div>
                  )}

                  {values.logo_file && (
                    <div className="mt-4">
                      <img
                        style={{
                          width: "100px",
                          objectFit: "cover",
                        }}
                        alt=".."
                        src={`data:image/jpeg;base64,${values.logo_file}`}
                      />
                    </div>
                  )}
                </div>

                <div className="form-group mb-4">
                  <label className="form-label" htmlFor={`link`}>
                    Sponsor URL
                  </label>
                  <input
                    type="text"
                    name={`link`}
                    onChange={handleChange}
                    value={values.link}
                    className="form-control"
                    placeholder="Banner link"
                  />

                  {errors &&
                    errors.link &&
                    errors.link &&
                    touched &&
                    touched.link && (
                      <div className="mt-3 text-danger">{errors.link}</div>
                    )}
                </div>

                <Col md={12} className="text-center">
                  <Button
                    type="submit"
                    disabled={sponsorPostLoading ? true : false}
                  >
                    {sponsorPostLoading ? "Saving" : "Save"}
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default AddSponsor;
