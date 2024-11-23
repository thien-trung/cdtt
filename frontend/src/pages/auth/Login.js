import React, { useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { connect } from "react-redux";
import { Api } from "../api/Api";
import FacebookLogin from "react-facebook-login";

function Login(props) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleClose = () => {
    setShow(false);
    props.hideLogin();
  };

  const handleShow = () => {
    setShow(true);
  };

  const refreshPage = () => {
    window.location.reload(); // Làm mới trang
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`${Api}/login`, { email, password })
      .then((result) => {
        localStorage.setItem("token", result.data.token);
        props.addUser(result.data.user);
        setShow(false);
        setLoading(false);
        refreshPage(); // Gọi hàm làm mới trang sau khi đăng nhập thành công
      })
      .catch((error) => {
        setError(true);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const responseFacebook = (response) => {
    if (response.accessToken) {
      setLoading(true);
      axios
        .post(`${Api}/login/facebook`, { accessToken: response.accessToken })
        .then((result) => {
          localStorage.setItem("token", result.data.token);
          props.addUser(result.data.user);
          setShow(false);
          setLoading(false);
          refreshPage(); // Làm mới trang sau khi đăng nhập thành công
        })
        .catch((error) => {
          console.error("Đã xảy ra lỗi khi đăng nhập bằng Facebook:", error);
          setError(true); // Hiển thị thông báo lỗi cho người dùng
          setLoading(false); // Dừng hiển thị trạng thái loading
        });
    } else {
      console.error("Không nhận được mã truy cập từ Facebook.");
    }
  };

  return (
    <React.Fragment>
      <Button onClick={handleShow} bsPrefix="auth">
        <i className="fa fa-sign-in"></i>Login
      </Button>
      <Modal show={show || props.showLogin} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="auth-title">User Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="auth" onSubmit={handleSubmit}>
            {error && (
              <div className="form-alert">
                <Alert variant="danger">
                  Invalid credentials!
                  <i className="fa fa-exclamation-triangle"></i>
                </Alert>
              </div>
            )}
            <div className="form-group">
              <input
                type="email"
                required
                className="form-control auth-input"
                name="email"
                placeholder="Enter Email"
                onChange={handleChange}
              />
              <i className="fa fa-user"></i>
            </div>
            <div className="form-group">
              <input
                type="password"
                required
                className="form-control auth-input"
                name="password"
                placeholder="Enter Password"
                onChange={handleChange}
              />
              <i className="fa fa-lock"></i>
            </div>
            <button type="submit" className="submit btn btn-danger">
              {loading ? (
                <div className="align-middle">
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span>Logging in...</span>
                </div>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>
          <div className="social-login">
            <FacebookLogin
              appId="1012363710509853" // Thay bằng App ID của bạn
              autoLoad={false}
              fields="name,email,picture"
              callback={responseFacebook}
              icon="fa-facebook"
              textButton="&nbsp;&nbsp;Login with Facebook"
              cssClass="btn btn-primary btn-block"
            />
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return { showLogin: state.show_login };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addUser: (user) => dispatch({ type: "USER", value: user }),
    hideLogin: () => dispatch({ type: "LOGIN_CONTROL", value: false }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
