import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap"; // Import Modal từ react-bootstrap
import axios from "axios";
import Swal from 'sweetalert2';
import { Api } from "../../../api/Api";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [validationError, setValidationError] = useState({});
    const [editModalShow, setEditModalShow] = useState(false); // State để hiển thị modal sửa
    const [editCategoryId, setEditCategoryId] = useState(null); // State để lưu ID category đang được sửa
    const [editCategoryName, setEditCategoryName] = useState(""); // State để lưu tên category đang được sửa

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${Api}/product/categories`);
            setCategories(response.data || []);
        } catch (error) {
            console.error('Error fetching categories', error);
            setCategories([]);
        }
    };

    // Hàm mở modal sửa và lấy thông tin category theo ID
    const openEditModal = async (id) => {
        try {
            const response = await axios.get(`${Api}/product/categories/${id}`);
            const category = response.data;
            setEditCategoryId(category.id);
            setEditCategoryName(category.name);
            setEditModalShow(true);
        } catch (error) {
            console.error('Error fetching category for edit', error);
            Swal.fire({
                text: 'Failed to fetch category for edit',
                icon: "error"
            });
        }
    };

    // Hàm đóng modal sửa
    const closeEditModal = () => {
        setEditModalShow(false);
        setEditCategoryId(null);
        setEditCategoryName("");
    };

    // Hàm xử lý sự kiện sửa category
    const handleEditCategory = async () => {
        try {
            const formData = new FormData();
            formData.append('name', editCategoryName);

            const response = await axios.put(`${Api}/product/categories/${editCategoryId}`, formData);
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: response.data.message
            });
            fetchCategories();
            closeEditModal();
        } catch (error) {
            console.error('Error editing category', error);
            Swal.fire({
                text: 'Failed to update category',
                icon: "error"
            });
        }
    };

    return (
        <div className="row">
            <div className="col-5">
                <div className="container-fluid card shadow my-2 mx-2">
                    <div>
                        <h3 className="text-success text-center">Create Category</h3>
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
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mb-2" onClick={Category}>Lưu</button>
                </div>
            </div>
            <div className="col-7">
                <div className="container-fluid">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3 d-flex justify-content-between align-items-center">
                            <h6 className="m-0 font-weight-bold text-primary">All Category</h6>
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
                                                    <Button variant="success me-2" onClick={() => openEditModal(category.id)}>Sửa</Button>
                                                    <Button variant="danger">Xóa</Button>
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
            {/* Modal sửa category */}
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
