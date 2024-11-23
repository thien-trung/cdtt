import React, { Component } from "react";
import Axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-js-pagination";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { Api } from "../../api/Api";
import { Link } from "react-router-dom";

class ListProduct extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      currentPage: 1,
      perPage: 6, 
      total: 0,
      products: [],
      deletingProductId: null,
    };
  }

  componentDidMount() {
    this.getProducts();
  }

  async getProducts(pageNumber = 1) {
    try {
      const result = await Axios.get(`${Api}/products?page=${pageNumber}`);
      const data = result.data;
      if (data && Array.isArray(data.data)) {
        this.setState({
          currentPage: data.current_page,
          perPage: data.per_page,
          total: data.total,
          products: [...data.data],
          loading: false,
        });
      }
    } catch (error) {
      this.setState({ loading: false });
      Swal.fire("Failed to fetch products", error.message, "error");
    }
  }

  handleDelete(productId) {
    this.setState({ deletingProductId: productId });
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        Axios.delete(`${Api}/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((response) => {
            Swal.fire("Deleted!", response.data.message, "success").then(() => {
              this.getProducts(this.state.currentPage);
            });
          })
          .catch((error) => {
            Swal.fire("Error!", "Could not delete the product.", "error");
          })
          .finally(() => {
            this.setState({ deletingProductId: null });
          });
      }
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="card shadow mb-4">
          <div className="card-header py-3 d-flex justify-content-between align-items-center">
            <h6 className="m-0 font-weight-bold text-dark">Tất cả sản phẩm</h6>
            <Link to="/admin/product/create" className="btn btn-primary">Add Product</Link>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Brand</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.loading ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        <Spinner animation="border" />
                      </td>
                    </tr>
                  ) : (
                    this.state.products.map((product) => (
                      <tr key={product.id}>
                        <td style={{ textAlign: "center" }}>
                          <img height="70px" width="70px" src={`/img/${product.photo}`} alt={product.name} />
                        </td>
                        <td>{product.brand}</td>
                        <td>{product.name}</td>
                        <td>{product.category?.name || "No category"}</td>
                        <td>${product.price}</td>
                        <td>
                          <Link to={`/admin/products/edit/${product.id}`} className="btn btn-dark me-2">Edit</Link>
                          <Button
                            variant="danger"
                            onClick={() => this.handleDelete(product.id)}
                            disabled={this.state.deletingProductId === product.id}
                          >
                            {this.state.deletingProductId === product.id ? "Deleting..." : "Delete"}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {this.state.total > this.state.perPage && (
              <Pagination
                activePage={this.state.currentPage}
                itemsCountPerPage={this.state.perPage}
                totalItemsCount={this.state.total}
                pageRangeDisplayed={4}
                onChange={(pageNumber) => this.getProducts(pageNumber)}
                linkClass="page-link"
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ListProduct;
