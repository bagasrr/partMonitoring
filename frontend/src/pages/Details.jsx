import React from "react";
import Layout from "./layout";
import { useParams } from "react-router-dom";
import BackPrev from "../element/BackPrev";

const Details = () => {
  const { uuid } = useParams();

  return (
    <Layout>
      <BackPrev url="/parts" />
      Details : {uuid}
    </Layout>
  );
};

export default Details;
