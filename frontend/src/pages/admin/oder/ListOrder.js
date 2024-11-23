import React, { Component } from "react";
import Axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-js-pagination";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { Api } from "../../api/Api";
import { Link } from "react-router-dom";

class ListOrder extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      currentPage: 1,
      perPage: 0,
      total: 0,
      orders: [],
      deletingOrderId: null,
    };

    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.getOrders();
  }

  getOrders(pageNumber = 1) {
    Axios.get(`${Api}/orders?page=${pageNumber}`).then((result) => {
      this.setState({
        currentPage: result.data.current_page,
        perPage: result.data.per_page,
        total: result.data.total,
        orders: [...result.data.data],
        loading: false,
      });
    });
  }

  handleDelete(orderId) {
    this.setState({ deletingOrderId: orderId });

    Swal.fire({
      title: "Bạn có chắc không?",
      text: "Bạn sẽ không thể khôi phục dữ liệu sau khi xóa!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");

        Axios.delete(`${Api}/orders/${orderId}`, {
          headers: {  
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "Đã xóa!",
              text: response.data.message,
            }).then(() => {
              this.getOrders(this.state.currentPage);
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
            this.setState({ deletingOrderId: null });
          });
      } else {
        this.setState({ deletingOrderId: null });
      }
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="card shadow mb-4">
          <div className="card-header py-3 d-flex justify-content-between align-items-center">
            <h6 className="m-0 font-weight-bold text-dark">Danh Sách Đơn Hàng</h6>
            <Link to={'/admin/order/create'} className="btn btn-primary my-2 me-2">Thêm đơn hàng</Link>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table
                className="table table-bordered"
                id="dataTable"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Stock ID</th>
                    <th>Số lượng</th>
                    <th>Ghi chú</th>
                    <th>Trạng thái</th>
                    <th>Chức Năng</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.loading ? (
                    <tr>
                      <td colSpan="7">
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                          <Spinner animation="border" />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    this.state.orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.user_id}</td>
                        <td>{order.stock_id}</td>
                        <td>{order.quantity}</td>
                        <td>{order.note}</td>
                        <td>{order.status}</td>
                        <td>
                        <Link to={`/admin/order/edit/${order.id}`} className="btn btn-dark my-2 me-2">Sửa</Link>
                        <Button
                            variant="danger"
                            onClick={() => this.handleDelete(order.id)}
                          >
                            Xóa
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ float: "center", color: "black" }}>
              {this.state.orders.length > 0 && this.state.total > this.state.perPage && (
                <div className="pagination-container">
                  <Pagination
                    activePage={this.state.currentPage}
                    itemsCountPerPage={this.state.perPage}
                    totalItemsCount={this.state.total}
                    pageRangeDisplayed={4}
                    onChange={(pageNumber) => this.getOrders(pageNumber)}
                    linkClass="page-link"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ListOrder;
