import { useEffect, useState } from "react";
import AppLayout from "layouts/AppLayout";
import { Card, Col, Row, Button, Form } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import AppHeader from "views/app-views/components/AppHeader";
import SideNav from "views/app-views/components/SideNav";

import axios from "axios";

import { Formik } from "formik";
import { object, string } from "yup";
import { useLocation, useHistory } from "react-router-dom";
import { invalidTokenHandler } from "services";

const API_URL = process.env.REACT_APP_API_URL;
const NavItem = (props) => {
  const { item, onNav, editable } = props;

  const [state, setState] = useState({
    showHide: item.showhide,
  });

  return (
    <Card className="p-3 mb-3">
      <div className="d-flex justify-content-between">
        {item.title} ({item.title_ar})
        <div className="d-flex align-items-center">
          {item.slug !== "/" && (
            <>
              <label
                htmlFor="custom-switch"
                style={{
                  marginRight: 10,
                }}
              >
                Show/Hide
              </label>
              <Form.Check
                // disabled={!state.showHide}
                type="switch"
                id="custom-switch"
                size="lg"
                checked={state.showHide}
                onChange={() => {
                  setState({
                    ...state,
                    showHide: !state.showHide,
                  });
                  onNav.onToggle(!state.showHide);
                }}
              />
            </>
          )}

          {editable && (
            <>
              <Button
                variant="light"
                style={{ marginRight: 10 }}
                size="sm"
                onClick={() => onNav.onDelete(item.id)}
              >
                <Trash size={20} />
              </Button>
              <Button
                variant="light"
                size="sm"
                onClick={() => onNav.onEdit(item.id)}
              >
                <PencilSquare size={20} />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

const ItemForm = (props) => {
  const { onSave, currentItem } = props;

  const [state] = useState({
    initialValues: { title: "", title_ar: "", slug: "" },
  });

  const { initialValues } = state;

  const schema = object().shape({
    title: string()
      .max(250, "Must be less than 250 characters long.")
      .required("This field is Required"),
    slug: string()
      .max(250, "Must be less than 250 characters long.")
      .required("This field is Required"),
  });

  const submitHandler = (values, actions) => {
    actions.resetForm({
      values: {
        title: "",
        title_ar: "",
        slug: "",
      },
    });

    onSave(values);
  };

  return (
    <>
      <Formik
        enableReinitialize
        noValidate
        validationSchema={schema}
        onSubmit={submitHandler}
        initialValues={
          currentItem !== null
            ? { ...currentItem }
            : {
                ...initialValues,
              }
        }
      >
        {({ handleSubmit, handleChange, values, errors, touched }) => (
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Row>
              <div className="form-group mb-4">
                <label className="form-label" htmlFor={`title`}>
                  Page Title English
                </label>
                <input
                  type="text"
                  name={`title`}
                  onChange={handleChange}
                  value={values.title}
                  className="form-control"
                  placeholder="Title"
                />

                {errors &&
                  errors.title &&
                  errors.title &&
                  touched &&
                  touched.title && (
                    <div className="mt-3 text-danger">{errors.title}</div>
                  )}
              </div>
              <div className="form-group mb-4">
                <label className="form-label" htmlFor={`title_ar`}>
                  Page Title Arabic
                </label>
                <input
                  type="text"
                  name={`title_ar`}
                  onChange={handleChange}
                  value={values.title_ar}
                  className="form-control"
                  placeholder="Title"
                />

                {errors &&
                  errors.title_ar &&
                  errors.title_ar &&
                  touched &&
                  touched.title_ar && (
                    <div className="mt-3 text-danger">{errors.title_ar}</div>
                  )}
              </div>
              <div className="form-group mb-4">
                <label className="form-label" htmlFor={`slug`}>
                  Page Slug
                </label>
                <input
                  type="text"
                  name={`slug`}
                  onChange={handleChange}
                  value={values.slug}
                  className="form-control"
                  placeholder="Slug"
                />

                {errors &&
                  errors.slug &&
                  errors.slug &&
                  touched &&
                  touched.slug && (
                    <div className="mt-3 text-danger">{errors.slug}</div>
                  )}
              </div>

              <Col md={12} className="text-center">
                <Button type="submit">Save</Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
};

const Navigations = () => {
  const location = useLocation();
  const history = useHistory();
  const [state, setState] = useState({
    loading: false,
    menuData: [],
    mode: "ADD",
    currentItem: null,
    editable: false,
  });

  const fetchMenuData = (cancel) => {
    const API_URL = process.env.REACT_APP_API_URL;
    if (cancel) return;
    axios
      .get(`${API_URL}/api/investmentforum/menus`)
      .then((res) => {
        setState({
          ...state,
          menuData: res.data.data,
        });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const onSave = (values) => {
    if (state.mode === "ADD") {
      const config = {
        headers: {
          token: localStorage.getItem("token"),
        },
      };

      axios
        .post(
          `${API_URL}/api/investmentforum/menu`,
          { ...values, showHide: false },
          config
        )
        .then((res) => {
          setState({
            ...state,
            menuData: [...state.menuData, res.data.data],
          });
        })
        .catch((error) => {
          // console.log(error.response);
          if (error.response) {
            const invalid = error.response.data.error;

            if (invalid === "invalid token") {
              invalidTokenHandler(history, location.pathname);
            }
          }
        });
    } else {
      const config = {
        headers: {
          token: localStorage.getItem("token"),
        },
      };

      axios
        .post(
          `${API_URL}/api/investmentforum/menu?id=${values.id}`,
          { ...values },
          config
        )
        .then((res) => {
          const editedItem = {
            ...res.data.data,
          };
          setState({
            ...state,
            mode: "ADD",
            menuData: state.menuData.map((x) => {
              if (x.id === editedItem.id) {
                return {
                  ...editedItem,
                };
              } else {
                return x;
              }
            }),
            currentItem: null,
          });
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  const deleteMenuItem = (id) => {
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };
    axios
      .delete(`${API_URL}/api/investmentforum/menu?id=${id}`, config)
      .then((res) => {
        setState({
          ...state,
          menuData: state.menuData.filter((x) => x.id !== res.data.data),
        });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const onToggle = (status, item) => {
    // console.log(status, item.id);
    const config = {
      headers: {
        token: localStorage.getItem("token"),
      },
    };
    axios
      .post(
        `${API_URL}/api/investmentforum/menu?id=${item.id}`,
        { ...item, showhide: status },
        config
      )
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  useEffect(() => {
    let cancel = false;
    fetchMenuData(cancel);
    return () => (cancel = true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppLayout>
      <AppHeader />
      <SideNav />
      <div className="app-layout">
        <div className="app-content">
          <div className="p-4">
            <Row className="justify-content-center">
              <Col md={8}>
                <Card>
                  <Card.Header>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>Navigation Items</div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-4">
                      {state.editable && (
                        <ItemForm
                          currentItem={state.currentItem}
                          onSave={(values) => {
                            setState({
                              ...state,
                              mode: "ADD",
                            });

                            onSave(values);
                          }}
                        />
                      )}
                    </div>
                    {state.menuData.length > 0
                      ? state.menuData.map((item) => (
                          <NavItem
                            key={item.id}
                            item={item}
                            editable={state.editable}
                            onNav={{
                              onEdit: (id) => {
                                const selectedItem = state.menuData.find(
                                  (x) => x.id === id
                                );
                                if (selectedItem) {
                                  setState({
                                    ...state,
                                    mode: "EDIT",
                                    currentItem: { ...selectedItem },
                                  });
                                }
                                window.scrollTo(0, 0);
                              },
                              onDelete: (id) => deleteMenuItem(id),

                              onToggle: (status) => onToggle(status, item),
                            }}
                          />
                        ))
                      : null}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Navigations;
