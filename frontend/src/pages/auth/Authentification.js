import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Login from "./Login";
import Register from "./Register";
import { Api } from "../api/Api";

class Authentification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      redirect: "",
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem("token"))
      this.getAuth(localStorage.getItem("token"));
  }

  componentDidUpdate(prevProps) {
    if (this.props.user && this.props.user.name !== this.state.user.name) {
      this.setState({ user: this.props.user });
    }
  }

  getAuth(token) {
    axios
      .get(`${Api}/auth`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        this.setState({
          user: result.data.user,
        });
      })
      .catch((error) => {
        this.logout();
      });
  }

  logout() {
    localStorage.removeItem("token");
    this.setState({
      user: "",
    });
    this.props.removeUser();
  }
  handleClick(e) {
    switch (e.target.id) {
      case "0":
        this.setState({ redirect: "admin" });
        break;
      case "1":
        this.setState({ redirect: "my-account" });
        window.location.href = "/my-account"; 
        break;
      case "2":
        window.location.href = "/oder"; 
        break;
      case "3":
        this.logout();
        break;
      default:
        break;
    }
  }
  

  render() {
    const { redirect } = this.state;

    if (redirect) {
      return <Navigate to={`/${redirect}`} replace />;
    }

    return this.props.user !== "guest" && localStorage.getItem("token") ? (
      <li>
        <Dropdown>
          <Dropdown.Toggle variant="toggle" id="dropdown-basic">
            <i className="fa fa-user-o"></i>
            <span>{this.state.user.name}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu onClick={this.handleClick}>
            {this.state.user.role_id !== null && (
              <Dropdown.Item id="0">Dashboard</Dropdown.Item>
            )}
            <Dropdown.Item id="1">My Account</Dropdown.Item>

            <Dropdown.Item id="2">Track My Order</Dropdown.Item>
            
            <Dropdown.Divider />
            <Dropdown.Item id="3">
              <i id="3" className="fa fa-sign-out" aria-hidden="true"></i>
              Log Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </li>
    ) : (
      <React.Fragment>
        <li>
          <Login />
        </li>
        <li>
          <Register />
        </li>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user_data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeUser: () => dispatch({ type: "USER", value: "guest" }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Authentification);
