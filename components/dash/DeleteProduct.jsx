import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import Datatable from "react-data-table-component";
import axios from "axios";
import { PencilIcon, TrashIcon, XCircleIcon } from "lucide-react";
import { useRouter } from "next/router";

const DeleteProduct = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const editRef = useRef(null);
  const [message, setMessage] = useState("");

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

  async function handleClick() {
    showAddDialog();
  }

  const getEditDataById = async (id) => {
    try {
      const productRes = await fetch(`/api/products/${id}`);
      if (!productRes.ok) throw new Error("Failed to fetch product data.");

      const editData = await productRes.json();
      setEditData(editData);
    } catch (error) {
      console.error("Error fetching product data:", error);
      alert("Error fetching product details.");
    }
  };

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
    }
  };

  const showEditDialog = () => {
    editRef.current?.showModal();
  };

  const showAddDialog = () => {
    AddRef.current?.showModal();
  };

  const showDeleteDialog = (id) => {
    setDeleteId(id);
    deleteRef.current?.showModal();
  };

  const closeDeleteDialog = () => {
    setDeleteId(null);
    deleteRef.current?.close();
  };

  const closeEditt = () => {
    AddRef.current?.close();
  };

  async function handleRowClickk(id) {
    showDeleteDialog(id);
  }
  const handleSelectChange = (e) => {
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      quantity: { ...prev.quantity, unit: value },
    }));
  };
  async function handleEditClick(id) {
    // setIsUpdate(true);
    showEditDialog();
    getEditDataById(id);
  }

  const handleSubmit = async (e) => {
    console.log("submittning");
    e.preventDefault();

    setLoading(true);
    setMessage("");
    // setError("");

    try {
      const productRes = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          supplierName: form.supplierName,
          category: form.category,
          quantity: {
            amount: Number(form.quantity.amount), // Ensure it's a number
            unit: form.quantity.unit,
          },
          purchasePrice: Number(form.purchasePrice),
          sellingPrice: Number(form.sellingPrice),
          stockAvailable: Number(form.stockAvailable),
          expiryDate: form.expiryDate || null,
          dateOfPurchase: form.dateOfPurchase || null,
          dateOfSale: form.dateOfSale || null,
        }),
      });

      if (!productRes.ok) throw new Error("Failed to add movie.");
      // const productData = await productRes.json();
      setMessage("Data added successfully!");
      window.location.reload();
    } catch (error) {
      console.log(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
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
          <button
            className="flex-1 sm:flex-auto min-w-[40px] px-2 py-1 bg-white text-gray-800 rounded-md border border-gray-300
                               hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900
                               transition-colors duration-200 flex items-center justify-center"
            onClick={() => handleEditClick(row._id)}
          >
            <PencilIcon className="mr-1 text-green-500 h-7 w-8" />
          </button>

          <button
            className="flex-1 sm:flex-auto min-w-[40px] px-2 py-1 bg-white text-gray-800 rounded-md border border-gray-300
                               hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900
                               transition-colors duration-200 flex items-center justify-center"
            onClick={() => handleRowClickk(row._id)}
          >
            <TrashIcon className="mr-1 text-red-500 h-8 w-8" />
          </button>
        </div>
      ),
    },
  ];

  const closeEdit = () => {
    setEditData(null);
    editRef.current?.close();
  };

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
        // progressPending={IsProductLoading}
      />

      <div className="flex  justify-center items-center h-screen w-full">
        {/* edit ref */}
        <dialog
          ref={editRef}
          className="rounded-lg shadow-lg bg-white p-6 w-[500px] fixed inset-0 m-auto max-w-full max-h-full overflow-auto"
        >
          <div className="flex justify-between items-center gap-x-10">
            <h1 className="font-bold leading-6 text-gray-500">Edit Product</h1>
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

              {/* Additional Fields from form */}
              <div>
                <label className="block mb-2">Purchase Price:</label>
                <input
                  type="number"
                  value={editData.purchasePrice || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      purchasePrice: Number(e.target.value),
                    })
                  }
                  className="border p-2 w-full"
                />
              </div>

              <div>
                <label className="block mb-2">Selling Price:</label>
                <input
                  type="number"
                  value={editData.sellingPrice || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      sellingPrice: Number(e.target.value),
                    })
                  }
                  className="border p-2 w-full"
                />
              </div>

              <div>
                <label className="block mb-2">Stock Available:</label>
                <input
                  type="number"
                  value={editData.stockAvailable || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      stockAvailable: Number(e.target.value),
                    })
                  }
                  className="border p-2 w-full"
                />
              </div>

              <div>
                <label className="block mb-2">Expiry Date:</label>
                <input
                  type="date"
                  value={
                    editData.expiryDate ? editData.expiryDate.split("T")[0] : ""
                  }
                  onChange={(e) =>
                    setEditData({ ...editData, expiryDate: e.target.value })
                  }
                  className="border p-2 w-full"
                />
              </div>

              {/* <div>
                <label className="block mb-2">Date of Purchase:</label>
                <input
                  type="date"
                  value={editData.dateOfPurchase || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, dateOfPurchase: e.target.value })
                  }
                  className="border p-2 w-full"
                />
              </div>

              <div>
                <label className="block mb-2">Date of Sale:</label>
                <input
                  type="date"
                  value={editData.dateOfSale || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, dateOfSale: e.target.value })
                  }
                  className="border p-2 w-full"
                />
              </div> */}

              <div>
                <label className="block mb-2">Supplier Name:</label>
                <input
                  type="text"
                  value={editData.supplierName || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, supplierName: e.target.value })
                  }
                  className="border p-2 w-full"
                />
              </div>

              {/* Add any other fields as necessary */}
            </form>
          )}
        </dialog>

        {/* delete ref */}
        <dialog
          ref={deleteRef}
          className="rounded-lg shadow-lg bg-white p-6 w-[500px] fixed inset-0 m-auto max-w-full max-h-full overflow-auto"
        >
          <div className="flex justify-between items-center gap-x-10">
            <h1 className="font-bold leading-6 text-gray-500">
              Delete Confirmation
            </h1>
            <button
              onClick={closeDeleteDialog}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircleIcon
                className="h-8 w-8 text-red-500"
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="p-4 max-w-lg bg-white">
            <h2 className="text-lg mb-4">
              Do you really want to delete this product?
            </h2>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={closeDeleteDialog}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                OK
              </button>
            </div>
          </div>
        </dialog>

        {/* add ref */}
        <dialog
          ref={AddRef}
          className="rounded-lg shadow-lg bg-white p-6 w-[500px] fixed inset-0 m-auto max-w-full max-h-full overflow-auto"
        >
          <div className="flex justify-between items-center gap-x-10">
            <h1 className="font-bold leading-6 text-gray-500">Add Product</h1>
            <button
              onClick={closeEditt}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircleIcon
                className="h-8 w-8 text-red-500"
                aria-hidden="true"
              />
            </button>
          </div>
          <div className="p-4 max-w-lg bg-white">
            <h1 className="text-2xl font-bold mb-4">Add Products</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="border p-2 w-full"
                required
              />
              <input
                name="supplierName"
                value={form.supplierName}
                onChange={handleChange}
                placeholder="Supplier Name"
                className="border p-2 w-full"
                required
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="Spices">Spices</option>
                <option value="Grains">Grains</option>
                <option value="Electrical">Electrical</option>
                <option value="Toys">Toys</option>
                <option value="Snacks">Snacks</option>
              </select>

              <select
                name="quantity.unit"
                value={form.quantity.unit}
                onChange={handleSelectChange}
                className="border p-2 w-full"
                required
              >
                <option value="" disabled>
                  Select Unit
                </option>
                <option value="Kg">Kg</option>
                <option value="Liters">Liters</option>
                <option value="Packets">Packets</option>
                <option value="Pieces">Pieces</option>
              </select>

              <input
                type="number"
                name="quantity.amount"
                value={form.quantity.amount}
                onChange={handleChange}
                placeholder="Quantity"
                className="border p-2 w-full"
                required
              />
              <input
                type="number"
                name="stockAvailable"
                value={form.stockAvailable}
                onChange={handleChange}
                placeholder="Stock Available"
                className="border p-2 w-full"
                required
              />

              <input
                type="number"
                name="purchasePrice"
                value={form.purchasePrice}
                onChange={handleChange}
                placeholder="Purchase Price (CP)"
                className="border p-2 w-full"
                required
              />
              <input
                type="number"
                name="sellingPrice"
                value={form.sellingPrice}
                onChange={handleChange}
                placeholder="Selling Price (SP)"
                className="border p-2 w-full"
                required
              />

              <div className="flex flex-col w-full">
                <label id="expiryDate" className="mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>

              <div className="flex flex-col w-full">
                <label id="purchaseDate" className="mb-1">
                  Date of Purchase
                </label>
                <input
                  type="date"
                  name="dateOfPurchase"
                  value={form.dateOfPurchase}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>

              <div className="flex flex-col w-full">
                <label id="sellingDate" className="mb-1">
                  Date of Sale
                </label>
                <input
                  type="date"
                  name="dateOfSale"
                  value={form.dateOfSale}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>

              <div className="col-span-2">
                <button
                  type="submit"
                  className="bg-blue-600 py-3 text-white p-2 w-full"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>

            {message && (
              <p className="mt-3 text-center text-green-500">{message}</p>
            )}
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default DeleteProduct;
