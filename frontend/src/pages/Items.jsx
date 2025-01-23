import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItems } from "../utils/items";
import ItemTable from "../components/ItemsTable";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import Title from "../element/Title";

const App = () => {
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems();
        setItems(data);
        // Dispatch an action to store items in the Redux store, if needed
        dispatch({ type: "SET_ITEMS", payload: data });
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, [dispatch]);

  return (
    <Layout>
      <Title className="text-2xl font-bold mb-4 text-center">Part List</Title>
      {/* {user && user.role === "admin" && ( */}
      <div className="mb-10">
        <Link to="/items/add/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  w-fit">
          Tambah Part Baru
        </Link>
      </div>
      {/* )} */}
      <ItemTable items={items} />
    </Layout>
  );
};

export default App;
