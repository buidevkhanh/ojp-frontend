import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { adminGetSubmit, adminRemoveSubmit } from "../../api/submission.api";
import { AppObject } from "../../configs/app.object";

function Submission() {
    const [submit, setSubmit] = useState([]);
    useEffect(()=> {
        adminGetSubmit().then((data) => {
            setSubmit(data.data.data);
            console.log(data.data.data);
        }).catch(() => {
            window.location.assign('/admin/sign-in');
        })
    },[]);
    function removeSubmit(id) {
        confirmAlert({
            title: "Remove a submit",
            message: "Are you sure to do this ! This action can't be undo",
            buttons: [
              {
                label: "Yes",
                onClick: () => {
                  adminRemoveSubmit(id).then(()=>{
                    adminGetSubmit().then((data) => {
                        setSubmit(data.data.data);
                        console.log(data.data.data);
                    }).catch(() => {
                        window.location.assign('/admin/sign-in');
                    })
                  })
                },
              },
              {
                label: "No",
              },
            ],
          });
    }
    const renderSubmit = submit ? submit.map((item,index) => {
        return (
            <tr key={index} class="text-center">
                <td style={{ width: "10" }}>{item._id}</td>
                <td style={{ width: "25%" }}>{item.problem.problemName}</td>
                <td style={{ width: "10%" }}>{item.user.displayName}</td>
                <td style={{ width: "10%" }} class={item.status === 'Accepted' ? 'text-success' : 'text-danger'}>{item.status}</td>
                <td style={{ width: "5%"}}>{item.executeTime}</td>
                <td style={{ width: "5%"}}>{item.memory}</td>
                <td style={{ width: "10%" }}>{item.createdAt}</td>
                <td style={{ width: "10%" }}>{item.updatedAt}</td>
                <td>
                <div class="btn btn-secondary text-danger"onClick={() => removeSubmit(item._id)}>
                    <i class="fa fa-trash" aria-hidden="true"></i>
                </div>
                </td>
            </tr>
        )
    }) : null;
    return (
    <>
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Manage submissions</h4>
            <div class="d-flex justify-content-between">
              <p class="card-description">
                Information about submissions that user submit their code
              </p>
            </div>
            <div class="table-responsive" style={{maxHeight: '600px', overflowY: 'scroll'}}>
              <table class="table table-hover">
                <thead>
                  <tr class="text-center">
                    <th style={{ width: "10" }}>ID</th>
                    <th style={{ width: "25%" }}>Problem</th>
                    <th style={{ width: "10%" }}>User</th>
                    <th style={{ width: "10%" }}>Status</th>
                    <th style={{ width: "5%"}}>Time</th>
                    <th style={{ width: "5%"}}>Memory</th>
                    <th style={{ width: "10%" }}>Created Time</th>
                    <th style={{ width: "10%" }}>Updated Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>{renderSubmit}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Submission;
