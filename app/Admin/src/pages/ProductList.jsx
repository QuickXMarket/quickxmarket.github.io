import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "../context/CoreContext";

const ProductList = () => {
  const { currency, makeRequest } = useCoreContext();
  const [products, setProducts] = useState([]);
  const [openProductId, setOpenProductId] = useState(null);

  const toggleAccordion = (productId) => {
    setOpenProductId(openProductId === productId ? null : productId);
  };

  const fetchProducts = async () => {
    try {
      const data = await makeRequest({
        url: "/api/product/list/vendor",
        method: "GET",
      });
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
      const data = await makeRequest({
        url: "/api/product/stock",
        data: { id, inStock },
        method: "POST",
      });
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">My Products</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-card border border-gray-500/20">
          {/* Desktop Table */}
          <table className="w-full hidden sm:table">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Product</th>
                <th className="px-4 py-3 font-semibold truncate">Category</th>
                <th className="px-4 py-3 font-semibold truncate">
                  Selling Price
                </th>
                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.map((product) => (
                <tr key={product._id} className="border-t border-gray-500/20">
                  <td className="px-4 py-3 flex items-center space-x-3 truncate">
                    <div className="border border-gray-300 rounded p-2">
                      <img
                        src={product.image[0]}
                        alt="Product"
                        className="w-16"
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
                    <label className="relative inline-flex items-center cursor-pointer text-grey-900 gap-3">
                      <input
                        onChange={() =>
                          toggleStock(product._id, !product.inStock)
                        }
                        checked={product.inStock}
                        type="checkbox"
                        className="sr-only peer "
                      />
                      <div
                        className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-primary-600 
      peer-not-checked:bg-red-500 
 transition-colors duration-200"
                      ></div>
                      <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="sm:hidden w-full">
            {products.map((product) => {
              const isOpen = openProductId === product._id;

              return (
                <div
                  key={product._id}
                  className="border-t border-gray-300 px-4 py-4 mb-4"
                >
                  {/* Accordion Header */}
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => toggleAccordion(product._id)}
                  >
                    <img
                      src={product.image[0]}
                      alt="Product"
                      className="w-16 h-16 rounded border"
                    />
                    <div className="font-semibold text-gray-800">
                      {product.name}
                    </div>
                    <div className="ml-auto">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          onChange={() =>
                            toggleStock(product._id, !product.inStock)
                          }
                          checked={product.inStock}
                          type="checkbox"
                          className="sr-only peer"
                        />
                        <div className="w-10 h-6 bg-slate-300 rounded-full peer peer-checked:bg-primary peer-not-checked:bg-red-500 transition-colors duration-200"></div>
                        <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                      </label>
                    </div>
                  </div>

                  {/* Accordion Content */}
                  {isOpen && (
                    <div className="mt-3 flex flex-col gap-2">
                      <div className="text-sm text-gray-600">
                        Category: {product.category}
                      </div>
                      <div className="text-sm text-gray-600">
                        Price: {currency}
                        {product.options[0].offerPrice}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
