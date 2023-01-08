import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { adminGetSubmit, adminRemoveSubmit } from "../../api/submission.api";
import { Loading } from "./loading";

function Submission() {
    const [submit, setSubmit] = useState([]);
    const [loading, setLoading] = useState();
    useEffect(()=> {
        setLoading(<Loading/>);
        adminGetSubmit().then((data) => {
            setSubmit(data.data.data);
            setLoading();
        }).catch(() => {
            window.location.assign('/admin/sign-in');
        })
    },[]);
    function removeSubmit(id) {
        confirmAlert({
            title: "Xóa submit",
            message: "Bạn không thể hoàn tác hành động này",
            buttons: [
              {
                label: "Đồng ý",
                onClick: () => {
                  adminRemoveSubmit(id).then(()=>{
                    adminGetSubmit().then((data) => {
                        setSubmit(data.data.data);
                    }).catch(() => {
                        window.location.assign('/admin/sign-in');
                    })
                  })
                },
              },
              {
                label: "Không",
              },
            ],
          });
    }
    const renderSubmit = submit ? submit.map((item,index) => {
        return (
            <tr key={index} className="text-center">
                <td style={{ width: "10" }}>{item._id}</td>
                <td style={{ width: "25%" }}>{item.problem.problemName}</td>
                <td style={{ width: "10%" }}>{item.user.displayName}</td>
                <td style={{ width: "10%" }} class={item.status === 'Accepted' ? 'text-success' : 'text-danger'}>{item.status}</td>
                <td style={{ width: "5%"}}>{item.language}</td>
                <td style={{ width: "5%"}}>{item.executeTime}</td>
                <td style={{ width: "10%" }}>{item.createdAt}</td>
                <td style={{ width: "10%" }}>{item.updatedAt}</td>
                <td>
                <div className="btn btn-secondary text-danger"onClick={() => removeSubmit(item._id)}>
                    <i className="fa fa-trash" aria-hidden="true"></i>
                </div>
                </td>
            </tr>
        )
    }) : null;
    return (
    <>
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Quản lý lịch sử submit</h4>
            <div className="d-flex justify-content-between">
              <p className="card-description">
                Thông tin những submit của người dùng được hiển thị ở đây
              </p>
            </div>
            <div className="table-responsive" style={{maxHeight: '600px', overflowY: 'scroll'}}>
              <table className="table table-hover">
                <thead>
                  <tr className="text-center">
                    <th style={{ width: "10" }}>ID</th>
                    <th style={{ width: "25%" }}>Bài toán</th>
                    <th style={{ width: "10%" }}>Tài khoản</th>
                    <th style={{ width: "10%" }}>Trạng thái</th>
                    <th style={{ width: "5%"}}>Ngôn ngữ</th>
                    <th style={{ width: "5%"}}>Thời gian chạy</th>
                    <th style={{ width: "10%" }}>Thời gian tạo</th>
                    <th style={{ width: "10%" }}>Thời gian câp nhật</th>
                    <th>Tính năng</th>
                  </tr>
                </thead>
                <tbody>{renderSubmit}{loading}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Submission;
