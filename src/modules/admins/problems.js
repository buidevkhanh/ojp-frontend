import { useState } from "react";
import { FormType } from "../../helpers/object.helper";
import Form from "./form";

function Problem() {
  const [form, setForm] = useState(<></>);
  function addProblem() {
    setForm(<Form type={FormType.PROBLEM} closeForm={closeForm}></Form>);
  }
  function closeForm() {
    setForm(<></>);
  }
  return (
    <>
      {form}
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Manage problems</h4>
            <div class="d-flex justify-content-between">
              <p class="card-description">
                Manage problems witch showing in main's student page
              </p>
              <button
                onClick={() => addProblem()}
                type="button"
                class="btn btn-primary btn-icon-text"
              >
                <i class="ti-plus btn-icon-prepend"></i>
                Add problem
              </button>
            </div>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Product</th>
                    <th>Sale</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Jacob</td>
                    <td>Photoshop</td>
                    <td class="text-danger">
                      {" "}
                      28.76% <i class="ti-arrow-down"></i>
                    </td>
                    <td>
                      <label class="badge badge-danger">Pending</label>
                    </td>
                  </tr>
                  <tr>
                    <td>Messsy</td>
                    <td>Flash</td>
                    <td class="text-danger">
                      {" "}
                      21.06% <i class="ti-arrow-down"></i>
                    </td>
                    <td>
                      <label class="badge badge-warning">In progress</label>
                    </td>
                  </tr>
                  <tr>
                    <td>John</td>
                    <td>Premier</td>
                    <td class="text-danger">
                      {" "}
                      35.00% <i class="ti-arrow-down"></i>
                    </td>
                    <td>
                      <label class="badge badge-info">Fixed</label>
                    </td>
                  </tr>
                  <tr>
                    <td>Peter</td>
                    <td>After effects</td>
                    <td class="text-success">
                      {" "}
                      82.00% <i class="ti-arrow-up"></i>
                    </td>
                    <td>
                      <label class="badge badge-success">Completed</label>
                    </td>
                  </tr>
                  <tr>
                    <td>Dave</td>
                    <td>53275535</td>
                    <td class="text-success">
                      {" "}
                      98.05% <i class="ti-arrow-up"></i>
                    </td>
                    <td>
                      <label class="badge badge-warning">In progress</label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Problem;
