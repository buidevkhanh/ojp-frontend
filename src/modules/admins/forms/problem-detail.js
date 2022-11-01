function ProblemDetail(props) {
  return (
    <>
      <div class="col-md-8 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div style={{ height: "320px", overflowY: "scroll" }}>
              <h4 class="card-title">Name: {props.info.problemName}</h4>
              <p class="card-description">Code: {props.info.problemCode}</p>
              <p class="card-description">
                Category ID: {props.info.problemCategory}
              </p>
              <p class="card-description">Status: {props.info.status}</p>
              <p class="card-description">
                Visible scope: {props.info.problemScope}
              </p>
              <p class="card-description">
                Belong to class: {props.info.problemClass || "N/A"}
              </p>
              <p class="card-description">
                Create time: {props.info.createdAt}
              </p>
              <p class="card-description">
                Update time: {props.info.updatedAt}
              </p>
              <div class="btn btn-infor" onClick={() => props.closeForm()}>
                Cancel
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProblemDetail;
