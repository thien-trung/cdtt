import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {Api} from "../../api/Api";
const CreateProduct = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState([]);
  const [validationError, setValidationError] = useState({});
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [brand, setBrand] = useState("");
  const [details, setDetails] = useState("");
  const [stocks, setStocks] = useState([{ size: "", color: "", quantity: "" }]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${Api}/product/categories`);
      setCategories(response.data);
      setLoadingCategories(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoadingCategories(false);
    }
  };

  const changeHandler = (event) => {
    const { name, value, files } = event.target;

    if (name === "photos") {
      setPhoto(files);
    } else if (name.startsWith("stocks")) {
      const [_, field, index] = name.split("-");
      const newStocks = [...stocks];
      newStocks[index][field] = value;
      setStocks(newStocks);
    } else {
      switch (name) {
        case "name":
          setName(value);
          break;
        case "description":
          setDescription(value);
          break;
        case "price":
          setPrice(value);
          break;
        case "category_id":
          setCategoryId(value);
          break;
        case "brand":
          setBrand(value);
          break;
        case "details":
          setDetails(value);
          break;
        default:
          break;
      }
    }
  };

  const addStock = () => {
    setStocks([...stocks, { size: "", color: "", quantity: "" }]);
  };

  const createProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category_id', categoryId);
    formData.append('brand', brand);  
    formData.append('details', details);
  
    for (let i = 0; i < photo.length; i++) {
      formData.append('photos[]', photo[i]);
    }
  
    stocks.forEach((stock, index) => {
      formData.append(`stocks[${index}][size]`, stock.size);
      formData.append(`stocks[${index}][color]`, stock.color);
      formData.append(`stocks[${index}][quantity]`, stock.quantity);
    });
  
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
  
    try {
      const response = await axios.post(`${Api}/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
  
      // Xử lý thành công: hiển thị thông báo và điều hướng đến trang chủ
      Swal.fire({
        icon: "success",
        text: response.data.message
      });
  
      // Điều hướng đến trang chủ
      navigate("/");
    } catch (error) {
      // Xử lý lỗi
      if (error.response) {
        // Xử lý lỗi từ phản hồi của server
        console.error('Phản hồi lỗi:', error.response);
        if (error.response.status === 422) {
          setValidationError(error.response.data.errors);
        } else {
          Swal.fire({
            icon: "error",
            text: `Đã xảy ra lỗi: ${error.response.data.message || 'Vui lòng thử lại sau.'}`,
          });
        }
      } else if (error.request) {
        // Xử lý lỗi khi không có phản hồi từ server
        console.error('Yêu cầu lỗi:', error.request);
        Swal.fire({
          icon: "error",
          text: "Không nhận được phản hồi từ máy chủ. Vui lòng thử lại sau.",
        });
      } else {
        // Xử lý lỗi trong quá trình thiết lập yêu cầu
        console.error('Thông báo lỗi:', error.message);
        Swal.fire({
          icon: "error",
          text: `Đã xảy ra lỗi: ${error.message}. Vui lòng thử lại sau.`,
        });
      }
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(e);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  if (loadingCategories) {
    return <div className="container mt-4">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Thêm sản phẩm mới</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Tên sản phẩm</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={name}
            onChange={changeHandler}
            isInvalid={validationError && validationError.name}
          />
          <Form.Control.Feedback type="invalid">
            {validationError && validationError.name && validationError.name[0]}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Mô tả sản phẩm</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={description}
            onChange={changeHandler}
            isInvalid={validationError && validationError.description}
          />
          <Form.Control.Feedback type="invalid">
            {validationError && validationError.description && validationError.description[0]}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="price">
          <Form.Label>Giá sản phẩm</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="price"
            value={price}
            onChange={changeHandler}
            isInvalid={validationError && validationError.price}
          />
          <Form.Control.Feedback type="invalid">
            {validationError && validationError.price && validationError.price[0]}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="photos">
          <Form.Label>Hình ảnh sản phẩm</Form.Label>
          <Form.Control
            type="file"
            name="photos"
            multiple
            onChange={changeHandler}
            isInvalid={validationError && validationError.photos}
          />
          <Form.Control.Feedback type="invalid">
            {validationError && validationError.photos && validationError.photos[0]}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="category_id">
          <Form.Label>Danh mục sản phẩm</Form.Label>
          <Form.Control
            as="select"
            name="category_id"
            value={categoryId}
            onChange={changeHandler}
            isInvalid={validationError && validationError.category_id}
          >
            <option value="">Chọn danh mục</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {validationError && validationError.category_id && validationError.category_id[0]}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="brand">
          <Form.Label>Thương hiệu sản phẩm</Form.Label>
          <Form.Control
            type="text"
            name="brand"
            value={brand}
            onChange={changeHandler}
            isInvalid={validationError && validationError.brand}
          />
          <Form.Control.Feedback type="invalid">
            {validationError && validationError.brand && validationError.brand[0]}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="details">
          <Form.Label>Chi tiết sản phẩm</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="details"
            value={details}
            onChange={changeHandler}
            isInvalid={validationError && validationError.details}
          />
          <Form.Control.Feedback type="invalid">
            {validationError && validationError.details && validationError.details[0]}
          </Form.Control.Feedback>
        </Form.Group>

        <fieldset>
          <Form.Group>
            <Form.Label>Thông tin kho hàng</Form.Label>
            {stocks.map((stock, index) => (
              <Row key={index} className="mb-2">
                <Col>
                  <Form.Control
                    type="text"
                    name={`stocks-size-${index}`}
                    value={stock.size}
                    placeholder="Kích cỡ"
                    onChange={changeHandler}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    name={`stocks-color-${index}`}
                    value={stock.color}
                    placeholder="Màu sắc"
                    onChange={changeHandler}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    name={`stocks-quantity-${index}`}
                    value={stock.quantity}
                    placeholder="Số lượng"
                    onChange={changeHandler}
                  />
                </Col>
              </Row>
            ))}
          </Form.Group>
          <Button variant="outline-primary" onClick={addStock}>
            Thêm kho hàng
          </Button>
        </fieldset>

        <Button variant="primary" type="submit" className="mt-3">
          Tạo sản phẩm
        </Button>
      </Form>
    </div>
  );
};

export default CreateProduct;
