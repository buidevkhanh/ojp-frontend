import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Toaster(props) {
  toast[props.type](props.message, {
    position: "top-right",
    autoClose: 5000,
    theme: "dark",
    className: "toast-font",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
  });
  return <ToastContainer />;
}
