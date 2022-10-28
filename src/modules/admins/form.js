import { useEffect, useState } from "react";
import { FormType } from "../../helpers/object.helper";
import AddProblem from "./forms/addProblem";
import CategoryForm from "./forms/category-form";

function Form(props) {
  const [form, setForm] = useState(<></>);
  useEffect(() => {
    const formType = props.type;
    switch (formType) {
      case FormType.PROBLEM: {
        setForm(
          <AddProblem
            closeForm={props.closeForm}
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
