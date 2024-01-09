import { useLocation, useHistory } from "react-router-dom";
import { invalidTokenHandler } from "services";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AppLayout = ({ children }) => {
  const location = useLocation();
  const history = useHistory();
  const logedInDate = localStorage.getItem("logedInDate");
  const diff = Date.now() - logedInDate;

  if (diff >= 86400000) {
    invalidTokenHandler(history, location.pathname);
  }

  return(
     <>
       <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />
     {children}</>
     );
};

export default AppLayout;
