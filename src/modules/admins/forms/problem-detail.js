function ProblemDetail(props) {
  return (
    <>
      <div className="col-md-8 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div style={{ height: "320px", overflowY: "scroll" }}>
              <h4 className="card-title">Name: {props.info.problemName}</h4>
              <p className="card-description">Code: {props.info.problemCode}</p>
              <p className="card-description">
                Category ID: {props.info.problemCategory}
              </p>
              <p className="card-description">Status: {props.info.status}</p>
              <p className="card-description">
                Visible scope: {props.info.problemScope}
              </p>
              <p className="card-description">
                Belong to class: {props.info.problemClass || "N/A"}
              </p>
              <p className="card-description">
                Create time: {props.info.createdAt}
              </p>
              <p className="card-description">
                Update time: {props.info.updatedAt}
              </p>
              <div className="btn btn-infor" onClick={() => props.closeForm()}>
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
