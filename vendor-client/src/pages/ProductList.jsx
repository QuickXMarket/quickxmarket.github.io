import React from "react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useCoreContext } from "../context/CoreContext";
import { assets } from "../assets/assets";
import ConfirmationModal from "../components/ConfirmationModal";
import { useOutletContext } from "react-router-dom";
import PlusIcon from "../assets/plus.svg?react";
import ProductForm from "../components/ProductForm";

const ProductList = () => {
  const { currency, axios } = useCoreContext();
  const { vendor } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formState, setFormState] = useState(null);
  const [formDetails, setFormDetails] = useState({
    name: "",
    description: "",
    category: "",
    files: [],
    options: [{ name: "Default Option", price: "", offerPrice: "" }],
  });

  const handleDelete = async (productId) => {
    try {
      const { data } = await axios.post("/api/product/delete", {
        productId,
        vendorId: vendor._id,
      });
      if (data.success) {
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list/vendor");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleteProduct(null);
    }
  };

  const handleFormClose = () => {
    setFormDetails({
      name: "",
      description: "",
      category: "",
      files: [],
      options: [{ name: "Default Option", price: "", offerPrice: "" }],
    });

    setFormState(null);
    setShowFormModal(false);
  };

  const openProductForm = (product) => {
    if (product) {
      const imageUrls = [];
      const descriptionString = product.description.join("\n");

      for (const url of product.image) {
        imageUrls.push(url);
      }
      setFormDetails({
        id: product._id,
        files: imageUrls,
        name: product.name,
        description: descriptionString,
        category: product.category,
        options: product.options,
      });
    }
    setFormState(product ? "edit" : "add");
    setShowFormModal(true);
    setOpenMenuId(null);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (deleteProduct) setShowConfirmModal(true);
  }, [deleteProduct]);

  return (
    <div className="no-scrollbar flex-1 h-[92vh] overflow-y-scroll flex flex-col justify-between max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">My Products</h2>
        <div
          className={`flex overflow-visible flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white ${
            products.length > 0 ? "border border-gray-500/20" : ""
          }`}
        >
          {/* Desktop Table */}
          {products.length > 0 ? (
            <>
              <table className="w-full hidden sm:table">
                <thead className="text-gray-900 text-sm text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold truncate">
                      Product
                    </th>
                    <th className="px-4 py-3 font-semibold truncate">
                      Category
                    </th>
                    <th className="px-4 py-3 font-semibold truncate">
                      Selling Price
                    </th>
                    <th className="px-4 py-3 font-semibold truncate">
                      In Stock
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-500">
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-t border-gray-500/20"
                    >
                      <td className="px-4 py-3 flex items-center space-x-3 truncate">
                        <div className="border border-gray-300 rounded p-2">
                          <img
                            src={product.image[0]}
                            alt="Product"
                            className="w-16 h-16"
                          />
                        </div>
                        <span className="truncate">{product.name}</span>
                      </td>
                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3">
                        {currency}
                        {product.options[0].offerPrice}
                      </td>
                      <td className="px-4 py-3">
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                          <input
                            onChange={() =>
                              toggleStock(product._id, !product.inStock)
                            }
                            checked={product.inStock}
                            type="checkbox"
                            className="sr-only peer"
                          />
                          <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-primary transition-colors duration-200"></div>
                          <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                        </label>
                      </td>
                      <td className="px-4 py-3 relative">
                        <img
                          src={assets.menu_dot_icon}
                          alt="Menu"
                          className="w-6 h-6 min-w-[1.5rem] min-h-[1.5rem] cursor-pointer shrink-0 "
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === product._id ? null : product._id
                            )
                          }
                        />

                        {openMenuId === product._id && (
                          <div className="absolute z-50 top-15 right-8 w-40 bg-white shadow-md border rounded z-20">
                            <button
                              className="w-full text-left px-4 py-2 text-gray-800 text-sm cursor-pointer hover:bg-gray-100"
                              onClick={() => openProductForm(product)}
                            >
                              Edit
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 text-red-500  text-sm cursor-pointer hover:bg-gray-100"
                              onClick={() => setDeleteProduct(product)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="sm:hidden w-full">
                {products.map((product) => {
                  return (
                    <div
                      className="flex  gap-3 cursor-pointer border-t border-gray-300 px-4 py-4 "
                      key={product._id}
                    >
                      <img
                        src={product.image[0]}
                        alt="Product"
                        className="w-16 h-16 rounded border"
                      />
                      <div className=" flex flex-col ">
                        <div className="text-sm font-medium text-gray-800 truncate">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {product.category}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {currency}
                          {product.options[0].offerPrice}
                        </div>
                      </div>

                      <div className="ml-auto flex flex-col items-end gap-7 relative">
                        <img
                          src={assets.menu_dot_icon}
                          alt="Menu"
                          className="cursor-pointer"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === product._id ? null : product._id
                            )
                          }
                        />

                        {openMenuId === product._id && (
                          <div className="absolute top-4 right-0 w-40 bg-white shadow-md border rounded z-20">
                            <button
                              className="w-full text-left px-4 py-2 text-gray-800 text-sm cursor-pointer hover:bg-gray-100"
                              onClick={() => openProductForm(product)}
                            >
                              Edit
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 text-red-500  text-sm cursor-pointer hover:bg-gray-100"
                              onClick={() => setDeleteProduct(product)}
                            >
                              Delete
                            </button>
                          </div>
                        )}

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            onChange={() =>
                              toggleStock(product._id, !product.inStock)
                            }
                            checked={product.inStock}
                            type="checkbox"
                            className="sr-only peer"
                          />
                          <div className="w-10 h-6 bg-slate-300 rounded-full peer peer-checked:bg-primary transition-colors duration-200"></div>
                          <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-center">
              No uploaded product yet.
            </div>
          )}
          {deleteProduct && showConfirmModal && (
            <ConfirmationModal
              isOpen={showConfirmModal}
              onClose={() => {
                setShowConfirmModal(false);
                setDeleteProduct(null);
              }}
              onConfirm={() => handleDelete(deleteProduct._id)}
              title="Confirm Delete"
              message={`Are you sure you want to delete "${deleteProduct.name}"?`}
            />
          )}
        </div>
        <div className="fixed bottom-36 md:bottom-22 right-6 sm:right-10 lg:right-14 z-50">
          <button
            onClick={() => openProductForm()}
            className="bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
          >
            <PlusIcon className={"w-10 h-10"} />
          </button>
        </div>
        <ProductForm
          formState={formState}
          formDetails={formDetails}
          onClose={handleFormClose}
          setFormDetails={setFormDetails}
          showModal={showFormModal}
          fetchProducts={fetchProducts}
        />
      </div>
    </div>
  );
};

export default ProductList;
