import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Api } from "../../api/Api";
import Swal from "sweetalert2";

const Category = () => {  
    const { id } = useParams();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const [editModalShow, setEditModalShow] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState("");
    const [success, setSuccess] = useState(false);

    const changeHandler = (event) => {
        const { name, value } = event.target;
        if (name === "name") setName(value);
    };

    const submitCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${Api}/product/categories`, { name });
            Swal.fire({
                icon: "success",
                text: response.data.message,
            }).then(() => {
                fetchCategories();
                setName("");
            });
        } catch (error) {
            if (error.response.status === 422) {
                Swal.fire({
                    text: error.response.data.message,
                    icon: "error",
                });
            } else {
                console.error("Error creating category", error);
            }
        }
    };

    const deleteCategory = async (id) => {
        const isConfirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });
        
        if (!isConfirm.isConfirmed) {
            return;
        }

        try {
            await axios.delete(`${Api}/product/categories/${id}`);
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Category has been deleted successfully.",
            }).then(() => {
                fetchCategories();
            });
        } catch (error) {
            console.error("Failed to delete category", error);
            Swal.fire({
                text: "Failed to delete category",
                icon: "error",
            });
        }
    };

    const openEditModal = async (id) => {
        try {
            const response = await axios.get(`${Api}/product/categories/${id}`);
            const category = response.data;
            setEditCategoryId(category.id);
            setEditCategoryName(category.name);
            setEditModalShow(true);
        } catch (error) {
            console.error("Error fetching category for edit", error);
            Swal.fire({
                text: "Failed to fetch category for edit",
                icon: "error",
            });
        }
    };

    const closeEditModal = () => {
        setEditModalShow(false);
        setEditCategoryId(null);
        setEditCategoryName("");
    };

    const handleEditCategory = async () => {
        try {
            const response = await axios.put(`${Api}/product/categories/${editCategoryId}`, { name: editCategoryName });
            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: response.data.message,
            });
            fetchCategories();
            setEditModalShow(false);
        } catch (error) {
            console.error("Failed to update category", error);
            Swal.fire({
                text: "Failed to update category",
                icon: "error",
            });
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${Api}/product/categories`);
            setCategories(response.data || []);
        } catch (error) {
            console.error("Error fetching categories", error);
            setCategories([]);
        }
    };

    return (
        <div className="row">
            <div className="col-5">
                <form onSubmit={submitCategory}>
                    <div className="container-fluid card shadow my-2 mx-2">
                        <div>
                            <h3 className="text-dark text-center">Create Category</h3>
                        </div>
                        <div className="mb-3 mt-3">
                            <label htmlFor="name" className="form-label">Thương hiệu</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                placeholder="Nhập tên thương hiệu"
                                value={name}
                                onChange={changeHandler}
                            />
                        </div>
                        <button type="submit" className="btn btn-success mb-2">Lưu</button>
                    </div>
                </form>
            </div>
            <div className="col-7">
                <div className="container-fluid">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3 d-flex justify-content-between align-items-center">
                            <h6 className="m-0 font-weight-bold text-dark">All Category</h6>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered" id="dataTable" cellSpacing="0" style={{ width: "700px" }}>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Name</th>
                                            <th style={{ width: "150px" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((category) => (
                                            <tr key={category.id}>
                                                <td>{category.id}</td>
                                                <td>{category.name}</td>
                                                <td>
                                                    <Button variant="dark me-2" onClick={() => openEditModal(category.id)}>Sửa</Button>
                                                    <Button variant="danger" onClick={() => deleteCategory(category.id)}>Xóa</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={editModalShow} onHide={closeEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="editName" className="form-label">Tên thương hiệu</label>
                        <input
                            type="text"
                            className="form-control"
                            id="editName"
                            name="editName"
                            value={editCategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeEditModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleEditCategory}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Category;
