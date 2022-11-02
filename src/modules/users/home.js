import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { callGetCategory, userGetCategory } from "../../api/category.api";
import { userGetProblem } from "../../api/problem.api";
import Footer from "../commons/footer";
import NavigationBar from "../commons/navigation";
import Activities from "./activity";

function UserHome() {
  const [categoryList, setCategoryList] = useState([]);
  const [problemList, setProblemList] = useState([]);
  useEffect(() => {
    userGetCategory().then((data) => {
      setCategoryList(data.data.data);
    });
    userGetProblem(1, 3, "createdAt:-1").then((data) => {
      setProblemList(data.data.data);
    });
  }, []);

  const renderCategory = categoryList
    ? categoryList.map((item, index) => {
        return (
          <li
            key={index}
            class="category__item d-inline-block"
            style={{
              borderRadius: "2px",
              width: "200px",
              height: "100px",
              boxShadow: "0 0 1px rgba(0,0,0,0.5)",
            }}
          >
            <div
              class="d-flex flex-column justify-content-center align-items-center w-100"
              style={{ height: "100%" }}
            >
              <div
                class="category__logo"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "1px solid gray",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url('${item.categoryLogo}')`,
                    backgroundSize: "auto",
                  }}
                ></div>
              </div>
              <p class="text-dark m-0 mt-2">{item.categoryName}</p>
            </div>
          </li>
        );
      })
    : null;
  const renderProblemList = problemList
    ? problemList.map((item, index) => {
        return (
          <li
            key={index}
            class="problem__item"
            style={{
              width: "350px",
              backgroundColor: "#f6f7f8",
              boxShadow: "2px 3px 2px rgba(0,0,0,0.25)",
              padding: "10px 10px",
              margin: "0px 10px",
            }}
          >
            <div class="problem__info d-flex flex-column w-100">
              <div class="problem__statistic d-flex justify-content-between text-secondary">
                <div class="try__number">
                  <i class="fa fa-users" aria-hidden="true"></i> N/A
                </div>
                <div class="comment__number">
                  <i class="fa fa-comment-o" aria-hidden="true"></i> N/A
                </div>
              </div>
              <hr class="m-0 p-0"></hr>
              <div class="problem__info">
                <div
                  class="problem__name mt-1 mb-0 pb-0"
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {item.problemName}
                </div>
                <div class="problem__category text-secondary text-center">
                  {item.problemCategory.categoryName}
                </div>
                {item.problemLevel === "medium" ? (
                  <div class="problem__level d-flex justify-content-center my-3">
                    <div
                      class="problem__level__bound d-flex justify-content-center align-items-center"
                      style={{
                        borderRadius: "50%",
                        width: "64px",
                        height: "64px",
                        border: "1px solid red",
                      }}
                    >
                      <div
                        class="problem__level__small d-flex justify-content-center align-items-center"
                        style={{
                          borderRadius: "50%",
                          width: "60px",
                          height: "60px",
                          border: "1px solid red",
                        }}
                      >
                        <div
                          class="level text-danger"
                          style={{ rotate: "-30deg" }}
                        >
                          Medium
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div class="problem__level d-flex justify-content-center my-3">
                    <div
                      class="problem__level__bound d-flex justify-content-center align-items-center"
                      style={{
                        borderRadius: "50%",
                        width: "64px",
                        height: "64px",
                        border: "1px solid green",
                      }}
                    >
                      <div
                        class="problem__level__small d-flex justify-content-center align-items-center"
                        style={{
                          borderRadius: "50%",
                          width: "60px",
                          height: "60px",
                          border: "1px solid green",
                        }}
                      >
                        <div
                          class="level text-success"
                          style={{ rotate: "-30deg" }}
                        >
                          Easy
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div class="resolve__button text-white btn btn-primary">
                Resolve
              </div>
            </div>
          </li>
        );
      })
    : null;
  return (
    <>
      <NavigationBar />
      <div class="container mb-5">
        <h3 class="bold mt-4 text-secondary" style={{ fontWeight: "bold" }}>
          Categories
        </h3>
        <ul class="category__list d-block px-5 my-5">{renderCategory}</ul>
        <h3 class="bold mt-4 text-secondary" style={{ fontWeight: "bold" }}>
          Problems
        </h3>
        <ul
          class="problem__list d-flex justify-content-center px-5 my-5"
          style={{ listStyle: "none" }}
        >
          {renderProblemList}
        </ul>
        <p class="text-primary text-end cursor">View all &gt;&gt;</p>
        <h3 class="bold mt-4 text-secondary" style={{ fontWeight: "bold" }}>
          Activities
        </h3>
        <div class="activity d-flex justify-content-center align-items-center">
          <div class="row w-100">
            <div class="col-md-4 text-center d-flex justify-content-center align-items-center flex-column">
              <img
                src="https://www.red-gate.com/simple-talk/wp-content/uploads/imported/873-knuth_don.jpg"
                alt="somepicture"
              ></img>
              <div class="text-center text-secondary">
                Donald Knuth, the “father of the analysis of algorithms”
              </div>
            </div>
            <div class="col-md-8 text-center py-4">
              <Activities />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
export default UserHome;
