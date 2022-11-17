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
            title={"Add Problem"}
            description={
              "Problems in this page is execise that user can resolve it with their way by their code"
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
            title={"Manage categories"}
            description={"Category to group a set of problems with same types"}
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
          title={"Create contest"}
            description={
              "Create new contest, becareful if create many contest, your systems can be crash"
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
