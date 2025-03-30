import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import Datatable from "react-data-table-component";
import axios from "axios";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/router";

const DeleteProduct = () => {
  const [products, setProducts] = useState([]);
  const editRef = useRef(null);
  const AddRef = useRef(null);
  const deleteRef = useRef(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: { amount: "", unit: "" },
    purchasePrice: "",
    sellingPrice: "",
    stockAvailable: "",
    expiryDate: "",
    dateOfPurchase: "",
    dateOfSale: "",
    supplierName: "",
    customerName: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setForm((prev) => {
      if (name.startsWith("quantity.")) {
        const key = name.split(".")[1];
        return {
          ...prev,
          quantity: {
            ...prev.quantity,
            [key]: type === "number" ? Number(value) : value,
          },
        };
      }
      return { ...prev, [name]: type === "number" ? Number(value) : value };
    });
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/products?search=${searchTerm}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`/api/products?id=${deleteId}`);
      setProducts((prev) => prev.filter((product) => product._id !== deleteId));
      fetchProducts();
      closeDeleteDialog();
    } catch (err) {
      console.error(
        "Error deleting product:",
        err.response?.data || err.message
      );
      alert(
        `Error deleting product: ${err.response?.data?.error || err.message}`
      );
    }
  };

  const showDeleteDialog = (id) => {
    setDeleteId(id);
    deleteRef.current?.showModal();
  };

  const closeDeleteDialog = () => {
    setDeleteId(null);
    deleteRef.current?.close();
  };

  const columns = [
    {
      name: "Product Name",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Supplier Name",
      selector: (row) => row.supplierName,
      sortable: true,
      wrap: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
      wrap: true,
    },
    {
      name: "Quantity",
      selector: (row) => `${row.quantity.amount} ${row.quantity.unit}`,
      sortable: true,
      wrap: true,
    },
    {
      name: "Purchase Price",
      selector: (row) => row.purchasePrice,
      sortable: true,
      wrap: true,
    },
    {
      name: "Selling Price",
      selector: (row) => row.sellingPrice,
      sortable: true,
      wrap: true,
    },
    {
      name: "Stock Available",
      selector: (row) => row.stockAvailable,
      sortable: true,
      wrap: true,
    },
    {
      name: "Expiry Date",
      selector: (row) =>
        row.expiryDate ? moment(row.expiryDate).format("DD-MM-YYYY") : "N/A",
      sortable: true,
      wrap: true,
    },
    {
      name: "Actions",
      sortable: true,
      wrap: true,
      selector: (row) => row._id,
      cell: (row) => (
        <div className="flex flex-col sm:flex-row gap-2 text-xs">
          <button onClick={() => showDeleteDialog(row._id)}>
            <TrashIcon className="text-red-500 h-8 w-8" />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className="">
      <div className="w-full justify-between flex mt-10 text-blue-900">
        <h1 className="font-extrabold text-2xl  ">Product Detail...</h1>
        <div className="flex gap-4">
          <div className="flex">
            <input
              type="text"
              placeholder="Search by product name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded p-2 w-[200px] ocus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleClick}
            className="bg-blue-800 text-center  hover:bg-blue-800 text-white text-sm px-4  py-2 rounded-lg"
          >
            Add Product
          </button>
        </div>
      </div>

      <Datatable
        columns={columns}
        data={products}
        pagination
        responsive
        highlightOnHover
        progressPending={IsProductLoading}
      />

      <div className="flex  justify-center items-center h-screen w-full">
        <dialog
          ref={editRef}
          className="rounded-lg shadow-lg bg-white p-6 w-[500px] fixed inset-0 m-auto max-w-full max-h-full overflow-auto"
        >
          <div className="flex justify-between items-center gap-x-10  ">
            <h1 className="font-bold leading-6 text-gray-500">Edit Product </h1>
            <button
              onClick={closeEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircleIcon
                className="h-8 w-8 text-red-500"
                aria-hidden="true"
              />
            </button>
          </div>
          {editData && (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Name:</label>
                <input
                  type="text"
                  value={editData.name || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="border p-2 w-full"
                />
              </div>

              <div>
                <label className="block mb-2">Category:</label>
                <input
                  type="text"
                  value={editData.category || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, category: e.target.value })
                  }
                  className="border p-2 w-full"
                />
              </div>

              <div>
                <label className="block mb-2">Quantity:</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={editData.quantity?.amount || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        quantity: {
                          ...editData.quantity,
                          amount: Number(e.target.value),
                        },
                      })
                    }
                    className="border p-2 w-full"
                  />
                  <input
                    type="text"
                    value={editData.quantity?.unit || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        quantity: {
                          ...editData.quantity,
                          unit: e.target.value,
                        },
                      })
                    }
                    className="border p-2 w-full"
                  />
                </div>
              </div>
            </form>
          )}
        </dialog>
      </div>
    </div>
  );
};

export default DeleteProduct;
