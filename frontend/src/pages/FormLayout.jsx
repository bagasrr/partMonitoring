import { adminArea } from "../utils/adminArea";
import Layout from "./layout";
import { Button } from "../element/Input";
import Title from "../element/Title";

const FormLayout = ({ onSubmit, formTitle, children, buttonText = "Tambahkan" }) => {
  adminArea();

  return (
    <>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <Title>{formTitle}</Title>
        <form onSubmit={onSubmit}>
          {children}
          <Button type="submit">{buttonText}</Button>
        </form>
      </div>
    </>
  );
};

export default FormLayout;
