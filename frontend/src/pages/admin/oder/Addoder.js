import React, { useState } from "react";
import Axios from "axios";
import { Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { Api } from "../../api/Api";
import { useNavigate } from "react-router-dom";

const AddOrder = () => {
  const [user_id, setUserId] = useState('');
  const [stock_id, setStockId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    Axios.post(`${Api}/orders`, { user_id, stock_id, quantity, note, status }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: response.data.message,
        }).then(() => {
          navigate("/admin/orders"); // Chuyển hướng về danh sách đơn hàng
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data?.message || "Có lỗi xảy ra!",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container">
      <h2>Thêm Đơn Hàng</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUserId">
          <Form.Label>User ID</Form.Label>
          <Form.Control
            type="number"
            value={user_id}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formStockId">
          <Form.Label>Stock ID</Form.Label>
          <Form.Control
            type="number"
            value={stock_id}
            onChange={(e) => setStockId(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formQuantity">
          <Form.Label>Số Lượng</Form.Label>
          <Form.Control
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formNote">
          <Form.Label>Ghi Chú</Form.Label>
          <Form.Control
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formStatus">
          <Form.Label>Trạng Thái</Form.Label>
          <Form.Control
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Đang thêm..." : "Thêm Đơn Hàng"}
        </Button>
      </Form>
    </div>
  );
};

export default AddOrder;
