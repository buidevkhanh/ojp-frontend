import { useEffect, useState } from "react";
import { FormType } from "../../helpers/object.helper";
import AddProblem from "./forms/addProblem";
import CategoryForm from "./forms/category-form";
import ContestForm from "./forms/contest-form";
import ProblemDetail from "./forms/problem-detail";

function Form(props) {
  const [form, setForm] = useState(<></>);
  useEffect(() => {
    const formType = props.type;
    switch (formType) {
      case FormType.PROBLEM: {
        setForm(
          <AddProblem
            closeForm={props.closeForm}
            action={props.action}
            id={props.id}
            title={"Thêm bài toán"}
            description={
              "Bài toán là vấn đề đặt ra cần được giải quyết bằng việc lập trình"
            }
          />
        );
        break;
      }
      case FormType.CATEGORY: {
        setForm(
          <CategoryForm
            id={props.id}
            action={props.action}
            closeForm={props.closeForm}
            title={"Quản lý danh mục"}
            description={"Danh mục dùng để nhóm những tập hợp bài toán có cùng thể loại"}
          ></CategoryForm>
        );
        break;
      }
      case FormType.PROBLEM_DETAIL: {
        setForm(
          <ProblemDetail info={props.info} closeForm={props.closeForm} />
        );
        break;
      }
      case FormType.CONTEST: {
        setForm(
          <ContestForm 
          title={"Tạo bài thi"}
            description={
              "Tạo mới bài thi. Để nhiều người cùng tham gia giải quyết cùng những bài toán cụ thể"
            }
          closeForm={props.closeForm} />
        )
        break;
      }
      default:
        break;
    }
  }, []);

  return (
    <>
      <div className="override-screen">{form}</div>
    </>
  );
}

export default Form;
