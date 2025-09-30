import React from "react";
import { useParams } from "react-router-dom";
import BackPrev from "../element/BackPrev";

const Details = () => {
  const { uuid } = useParams();

  return (
    <>
      <BackPrev url="/parts" />
      Details : {uuid}
    </>
  );
};

export default Details;
