import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "../utils/items";
import ItemTable from "../components/ItemsTable";
import Layout from "./Layout";
import { Link } from "react-router-dom";

const App = () => {
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const getItems = async () => {
      try {
        const data = await fetchItems();
        setItems(data);
        // Dispatch an action to store items in the Redux store, if needed
        dispatch({ type: "SET_ITEMS", payload: data });
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    getItems();
  }, [dispatch]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4 text-center">Item List</h1>
      {user && user.role === "admin" && (
        <div className="mb-10">
          <Link to="/items/add/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  w-fit">
            Tambah Part Baru
          </Link>
        </div>
      )}
      <ItemTable items={items} />
    </Layout>
  );
};

export default App;
