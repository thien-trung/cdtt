// ContactForm.js
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Swal from 'sweetalert2';


const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can implement logic to handle form submission, like sending an email or storing data
        // For demonstration, let's just show an alert with the form data
        Swal.fire({
            icon: 'success',
            title: 'Message Sent!',
            text: `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`
        });
        // Clear form fields after submission
        setFormData({
            name: '',
            email: '',
            message: ''
        });
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group as={Row} controlId="formName">
                            <Form.Label column sm="3">Name</Form.Label>
                            <Col sm="9">
                                <Form.Control 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    placeholder="Enter your name" 
                                    required 
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formEmail">
                            <Form.Label column sm="3">Email</Form.Label>
                            <Col sm="9">
                                <Form.Control 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    placeholder="Enter your email" 
                                    required 
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formMessage">
                            <Form.Label column sm="3">Message</Form.Label>
                            <Col sm="9">
                                <Form.Control 
                                    as="textarea" 
                                    rows={5} 
                                    name="message" 
                                    value={formData.message} 
                                    onChange={handleChange} 
                                    placeholder="Enter your message" 
                                    required 
                                />
                            </Col>
                        </Form.Group>

                        <Button variant="primary" type="submit">Submit</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
