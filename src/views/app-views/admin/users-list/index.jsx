import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useHistory, useLocation } from "react-router-dom";
import { Row, Col, Button, Form, Card, Table, Modal } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";

import AppHeader from "views/app-views/components/AppHeader";
import SideNav from "views/app-views/components/SideNav";
import CreateUser from "views/app-views/components/CreateUser";
import EditUser from "views/app-views/components/EditUser";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { invalidTokenHandler } from "services";
import AppLayout from "layouts/AppLayout";

const API_URL = process.env.REACT_APP_API_URL;

const pitchingSchema = yup.object().shape({
  pageTitle_en: yup
    .string()
    .max(250, "Must be less than 250 characters long.")
    .required("This field is Required"),
  pageTitle_ar: yup
    .string()
    .max(250, "Must be less than 250 characters long.")
    .required("This field is Required"),
  pitchingCompaniesDesc_en: yup.string().max(600, "Must be less than 600 characters long.").required("This field is Required"),
  pitchingCompaniesDesc_ar: yup.string().max(600, "Must be less than 600 characters long.").required("This field is Required"),
});

const UsersList = () => {
  const history = useHistory();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [openUserEditModal, setOpenUserEditModal] = useState(false);
  const [openCreateUserModal, setOpenCreateUserModal] = useState(false);
  const [editableUser, setEditableUser] = useState(null);
  const [disableSwitch, setDisableSwitch] = useState(false);

  const [pitchingInitialValues, setPitchingInitialValues] = useState("");
  const [loadings, setLoadings] = useState({
    pitchingDataLoading: false,
    userLoading: false,
  });

  const { pitchingDataLoading, userLoading } = loadings;

  //Fetch Pitiching Companies data
  const fetchPitichingCompaniesData = () => {
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };

    axios
      .get(`${API_URL}/api/investmentforum/pitching_company`, config)
      .then((res) => {
        setPitchingInitialValues(res.data.data);
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

  //Pitching Form Submit handler
  const submitHandler = (values) => {
    setLoadings({
      ...loadings,
      pitchingDataLoading: true,
    });
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };

    axios
      .post(
        `${API_URL}/api/investmentforum/pitching_company`,
        { ...values },
        config
      )
      .then((res) => {
        // console.log("response=>", res);
        setLoadings({ ...loadings, pitchingDataLoading: false });
        toast.success("Successfully updated");
      })
      .catch((error) => {
        if (error.response) {
          const invalid = error.response.data.error;
          toast.error("Error Found.Not able to saved");
          if (invalid === "invalid token") {
            toast.error("Invalid Token");
            invalidTokenHandler(history, location.pathname);
          }
        }
      });
  };

  //Fetch Users API
  const fetchUsers = () => {
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };

    axios
      .get(`${API_URL}/api/investmentforum/usersdata`, config)
      .then((res) => {
        setUsers(res.data.data);
        // console.log(res.data.data);
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

  //Handle user show/hide
  const handleShowHide = (selectedUser) => {
    setLoadings({ ...loadings, userLoading: true });
    setDisableSwitch(true);
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };

    const mutedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          show_hide: !user.show_hide,
        };
      }
      return user;
    });
    setUsers(mutedUsers);

    const formData = {
      ...selectedUser,
      show_hide: !selectedUser.show_hide,
    };

    axios
      .post(`${API_URL}/api/investmentforum/user`, formData, config)
      .then((res) => {
        setDisableSwitch(false);
        setLoadings({ ...loadings, userLoading: false });
      })
      .catch((err) => {
        // console.log("error form here 1 ==>", err.response);
      });
  };

  //Handle Popup show/hide
  const handleUserEditModalClose = () => setOpenUserEditModal(false);
  const handleUserEditModalOpen = (user) => {
    setEditableUser(user);
    setOpenUserEditModal(true);
  };
  // if (editableUser) {
  //   console.log(editableUser);
  // }

  const handleCreateUserModalClose = () => setOpenCreateUserModal(false);
  const handleCreateUserModalOpen = () => setOpenCreateUserModal(true);
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

  useEffect(() => {
    fetchUsers();
    fetchPitichingCompaniesData();
  }, []);
  return (
    <AppLayout>
      <AppHeader />
      <SideNav />
      <div className="app-layout">
        <div className="app-content">
          <div className="p-4">
            <Card className="mb-4">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <div>Users</div>
                  <div>
                    <Button
                      disabled={disableSwitch}
                      variant="primary"
                      size="sm"
                      onClick={handleCreateUserModalOpen}
                    >
                      Create User
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Company Name</th>
                      <th>Email</th>
                      <th>Show/Hide</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 &&
                      users.map(
                        (user, i) =>
                          !user.isAdmin && (
                            <tr key={i}>
                              <td>{user.company_name_en}</td>
                              <td>{user.email}</td>
                              <td>
                                <Form.Check
                                  type="switch"
                                  disabled={userLoading}
                                  checked={user.show_hide}
                                  id="custom-switch"
                                  size="lg"
                                  onChange={() => handleShowHide(user)}
                                />
                              </td>
                              <td>
                                <Button
                                  disabled={userLoading}
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleUserEditModalOpen(user)}
                                >
                                  Quick Edit
                                </Button>
                              </td>
                              <td>
                                {/* <Button variant="primary" size="sm">
                              View Details
                            </Button> */}

                                <Link to={`/user-details/${user.id}`}>
                                  View Details
                                </Link>
                              </td>
                            </tr>
                          )
                      )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>Pitching Page Cotent</Card.Header>
              <Card.Body>
                {pitchingInitialValues === "" ? (
                  "loading"
                ) : (
                  <Formik
                    validationSchema={pitchingSchema}
                    onSubmit={submitHandler}
                    initialValues={
                      pitchingInitialValues === ""
                        ? {
                            pageTitle_en: "",
                            pageTitle_ar: "",
                            pitchingCompaniesDesc_en: "",
                            pitchingCompaniesDesc_ar: "",
                          }
                        : pitchingInitialValues
                    }
                  >
                    {({
                      handleSubmit,
                      handleChange,
                      setFieldValue,
                      values,
                      touched,
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
                                  <Form.Group className="mb-4">
                                    <Form.Label>
                                      Page Title Text (English)
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Page Title Text (English)"
                                      name="pageTitle_en"
                                      value={values.pageTitle_en}
                                      onChange={handleChange}
                                      isInvalid={
                                        errors.pageTitle_en &&
                                        touched.pageTitle_en &&
                                        !!errors.pageTitle_en
                                      }
                                      maxLength={100}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.pageTitle_en}
                                    </Form.Control.Feedback>
                                  </Form.Group>

                                  <Form.Group className="mb-4" dir="rtl">
                                    <Form.Label>
                                      Page Title Text (Arabic)
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Page Title Text"
                                      name="pageTitle_ar"
                                      value={values.pageTitle_ar}
                                      onChange={handleChange}
                                      isInvalid={
                                        errors.pageTitle_ar &&
                                        touched.pageTitle_ar &&
                                        !!errors.pageTitle_ar
                                      }
                                      maxLength={100}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.pageTitle_ar}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                  <Form.Group className="mb-4">
                                    <Form.Label>
                                      Page Header Text (English)
                                    </Form.Label>

                                    <ReactQuill
                                      style={{ background: "#fff" }}
                                      theme="snow"
                                      modules={modules}
                                      value={values.pitchingCompaniesDesc_en}
                                      onChange={(value) => {
                                        setFieldValue(
                                          "pitchingCompaniesDesc_en",
                                          value
                                        );
                                      }}
                                    />
                                    {/* <Form.Control
                                      type="text"
                                      placeholder="Page Header Text (English)"
                                      name="pitchingCompaniesDesc_en"
                                      value={values.pitchingCompaniesDesc_en}
                                      onChange={handleChange}
                                      isInvalid={
                                        errors.pitchingCompaniesDesc_en &&
                                        touched.pitchingCompaniesDesc_en &&
                                        !!errors.pitchingCompaniesDesc_en
                                      }
                                    /> */}
                                    {/* <Form.Control.Feedback type="invalid">
                                      {errors.pitchingCompaniesDesc_en}
                                    </Form.Control.Feedback> */}
                                    {errors.pitchingCompaniesDesc_en &&
                                          touched.pitchingCompaniesDesc_en &&
                                          !!errors.pitchingCompaniesDesc_en && (
                                            <div className="mt-2 text-danger">
                                              {errors.pitchingCompaniesDesc_en}
                                            </div>
                                          )}
                                  </Form.Group>

                                  <Form.Group className="mb-4" dir="rtl">
                                    <Form.Label>
                                      Page Header Text (Arabic)
                                    </Form.Label>
                                    <ReactQuill
                                      style={{ background: "#fff" }}
                                      theme="snow"
                                      modules={modules}
                                      value={values.pitchingCompaniesDesc_ar}
                                      onChange={(value) => {
                                        setFieldValue(
                                          "pitchingCompaniesDesc_ar",
                                          value
                                        );
                                      }}
                                    />
                                    {/* <Form.Control
                                      type="text"
                                      placeholder="Page Header Text"
                                      name="pitchingCompaniesDesc_ar"
                                      value={values.pitchingCompaniesDesc_ar}
                                      onChange={handleChange}
                                      isInvalid={
                                        errors.pitchingCompaniesDesc_ar &&
                                        touched.pitchingCompaniesDesc_ar &&
                                        !!errors.pitchingCompaniesDesc_ar
                                      }
                                    /> */}
                                    {/* <Form.Control.Feedback type="invalid">
                                      {errors.pitchingCompaniesDesc_ar}
                                    </Form.Control.Feedback> */}
                                    {errors.pitchingCompaniesDesc_ar &&
                                          touched.pitchingCompaniesDesc_ar &&
                                          !!errors.pitchingCompaniesDesc_ar && (
                                            <div className="mt-2 text-danger">
                                              {errors.pitchingCompaniesDesc_ar}
                                            </div>
                                          )}

                                  </Form.Group>
                                  
                                  <Col md={12}>
                                    <Row>
                                      <Col md={6} align="right">
                                        <Button
                                          disabled={pitchingDataLoading}
                                          type="submit"
                                        >
                                          {pitchingDataLoading
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
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
      <Modal
        show={openUserEditModal}
        backdrop="static"
        keyboard={false}
        onHide={handleUserEditModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditUser
            actionType="edit"
            editableUser={editableUser}
            setOpenUserEditModal={setOpenUserEditModal}
            users={users}
            setUsers={setUsers}
          />
        </Modal.Body>
      </Modal>

      <Modal
        show={openCreateUserModal}
        backdrop="static"
        keyboard={false}
        onHide={handleCreateUserModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateUser
            actionType="create"
            setOpenCreateUserModal={setOpenCreateUserModal}
            users={users}
            setUsers={setUsers}
          />
        </Modal.Body>
      </Modal>
    </AppLayout>
  );
};

export default UsersList;
