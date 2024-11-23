import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { connect } from 'react-redux';
import { Api } from './../api/Api';

function Register(props) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errorKeys, setErrorKeys] = useState([]);
    const [error, setError] = useState({}); // Changed to object
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = (e) => {

        e.preventDefault();
        setLoading(true);
        axios.post(`${Api}/register`, {
            name: name,
            email: email,
            password: password,
            password_confirmation: passwordConfirm
        })
            .then((result) => {
                localStorage.setItem('token', result.data.token);
                props.addUser(result.data.user);
                setShow(false);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                if (err.response && err.response.data) {
                    try {
                        const parsedError = JSON.parse(err.response.data);
                        setErrorKeys(Object.keys(parsedError));
                        setError(parsedError);
                    } catch (parseError) {
                        setErrorKeys(['non_field_errors']);
                        setError({ non_field_errors: 'An unexpected error occurred. Please try again later.' });
                    }
                } else {
                    setErrorKeys(['general']);
                    setError({ general: 'An error occurred. Please try again later.' });
                }
            });
    };

    const handleChange = ({ target }) => {
        const { name, value } = target;
        if (name === 'name') setName(value);
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
        if (name === 'password_confirmation') setPasswordConfirm(value);
    };

    return (
        <React.Fragment>
            <Button onClick={handleShow} bsPrefix="auth">
                <i className="fa fa-user-o"></i> Register
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="auth-title">User Registration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="auth" onSubmit={handleSubmit}>
                        {errorKeys.length > 0 && errorKeys.map((key) => (
                            <div className="form-alert" key={key}>
                                <Alert variant='danger'>
                                    <i className="fa fa-exclamation-triangle"></i> {error[key]}
                                </Alert>
                            </div>
                        ))}
                        <div className="form-group">
                            <input type="text" name="name" required className="form-control auth-input" placeholder="Enter Name" onChange={handleChange} />
                            <i className="fa fa-user"></i>
                        </div>
                        <div className="form-group">
                            <input type="email" name="email" required className="form-control auth-input" placeholder="Enter Email" onChange={handleChange} />
                            <i className="fa fa-envelope"></i>
                        </div>
                        <div className="form-group">
                            <input type="password" name="password" required className="form-control auth-input" placeholder="Enter Password" onChange={handleChange} />
                            <i className="fa fa-lock"></i>
                        </div>
                        <div className="form-group">
                            <input type="password" name="password_confirmation" required className="form-control auth-input" placeholder="Enter Password Again" onChange={handleChange} />
                            <i className="fa fa-lock"></i>
                        </div>
                        <button type="submit" className="submit btn btn-danger">
                            {loading ? (
                                <div className="align-middle">
                                    <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                                    <span>Registering...</span>
                                </div>
                            ) : (
                                <span>Register</span>
                            )}
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        addUser: (user) => dispatch({ type: 'USER', value: user })
    };
};

export default connect(null, mapDispatchToProps)(Register);