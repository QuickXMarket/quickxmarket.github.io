import React, { useState } from "react";
import { assets, categories } from "../assets/assets";
import toast from "react-hot-toast";
import { useCoreContext } from "../context/CoreContext";
import { useOutletContext } from "react-router-dom";

const ProductForm = ({
  showModal,
  onClose,
  formDetails,
  setFormDetails,
  formState,
  fetchProducts,
}) => {
  const { axios } = useCoreContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { vendor } = useOutletContext();

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      setIsSubmitting(true);

      if (!formDetails.files.some((f) => f)) {
        return toast.error("At least one image is required.");
      }
      const productData = {
        name: formDetails.name,
        description: formDetails.description.split("\n"),
        category: formDetails.category,
        price: formDetails.price,
        offerPrice: formDetails.offerPrice,
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));
      if (formState === "edit") {
        formData.append("vendorId", vendor._id);
        formData.append("productId", formDetails.id);
      }
      for (let i = 0; i < formDetails.files.length; i++) {
        formData.append("images", formDetails.files[i]);
      }

      const { data } = await axios.post(`/api/product/${formState}`, formData);

      if (data.success) {
        toast.success(data.message);
        fetchProducts();
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 sm:px-0"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <div
            className="relative bg-white rounded-xl max-h-[95vh] w-full sm:w-[90%] md:w-[600px] overflow-y-auto no-scrollbar p-4 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
            >
              ✕
            </button>

            {/* Form */}
            <form onSubmit={onSubmitHandler} className="space-y-5">
              <div>
                <p className="text-sm font-medium">Product Image</p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <label key={index} htmlFor={`image${index}`}>
                      <input
                        onChange={(e) => {
                          const updatedFiles = [...formDetails.files];
                          updatedFiles[index] = e.target.files[0];
                          setFormDetails({
                            ...formDetails,
                            files: updatedFiles,
                          });
                        }}
                        type="file"
                        accept="image/*"
                        id={`image${index}`}
                        hidden
                        disabled={isSubmitting}
                      />
                      <img
                        className="max-w-24 cursor-pointer"
                        src={
                          formDetails.files[index]
                            ? typeof formDetails.files[index] === "string"
                              ? formDetails.files[index]
                              : URL.createObjectURL(formDetails.files[index])
                            : assets.upload_area
                        }
                        alt="uploadArea"
                        width={100}
                        height={100}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium" htmlFor="product-name">
                  Product Name
                </label>
                <input
                  onChange={(e) =>
                    setFormDetails({
                      ...formDetails,
                      name: e.target.value,
                    })
                  }
                  value={formDetails.name}
                  id="product-name"
                  type="text"
                  placeholder="Type here"
                  className="outline-none py-2 px-3 rounded border border-gray-500/40 text-sm"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  className="text-sm font-medium"
                  htmlFor="product-description"
                >
                  Product Description
                </label>
                <textarea
                  onChange={(e) =>
                    setFormDetails({
                      ...formDetails,
                      description: e.target.value,
                    })
                  }
                  value={formDetails.description}
                  id="product-description"
                  rows={4}
                  className="outline-none py-2 px-3 rounded border border-gray-500/40 resize-none text-sm"
                  placeholder="Type here"
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium" htmlFor="category">
                  Category
                </label>
                <select
                  onChange={(e) =>
                    setFormDetails({
                      ...formDetails,
                      category: e.target.value,
                    })
                  }
                  value={formDetails.category}
                  id="category"
                  className="outline-none py-2 px-3 rounded border border-gray-500/40 text-sm"
                  disabled={isSubmitting}
                >
                  <option value="">Select Category</option>
                  {categories.map((item, index) => (
                    <option key={index} value={item.path}>
                      {item.path}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex-1 flex flex-col gap-1 min-w-[120px]">
                  <label
                    className="text-sm font-medium"
                    htmlFor="product-price"
                  >
                    Product Price
                  </label>
                  <input
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        price: e.target.value,
                      })
                    }
                    value={formDetails.price}
                    id="product-price"
                    type="number"
                    placeholder="0"
                    className="outline-none py-2 px-3 rounded border border-gray-500/40 text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex-1 flex flex-col gap-1 min-w-[120px]">
                  <label className="text-sm font-medium" htmlFor="offer-price">
                    Offer Price
                  </label>
                  <input
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        offerPrice: e.target.value,
                      })
                    }
                    value={formDetails.offerPrice}
                    id="offer-price"
                    type="number"
                    placeholder="0"
                    className="outline-none py-2 px-3 rounded border border-gray-500/40 text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-white font-medium text-sm rounded cursor-pointer"
                disabled={isSubmitting}
              >
                {formState === "add" ? "ADD" : "SAVE EDIT"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductForm;
