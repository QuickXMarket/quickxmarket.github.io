import React, { useState } from "react";
import { assets, categories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  const { makeRequest, fileToBase64 } = useAppContext();

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();

      const productData = {
        name,
        description: description.split("\n"),
        category,
        price,
        offerPrice,
      };

      const imagesBase64 = [];
      for (let i = 0; i < files.length; i++) {
        if (files[i]) {
          const base64 = await fileToBase64(files[i]);
          imagesBase64.push(base64);
        }
      }

      const data = {
        productData,
        images: imagesBase64,
      };

      const response = await makeRequest({
        method: "POST",
        url: "/api/product/add",
        data,
      });

      if (response.success) {
        toast.success(response.message);
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setFiles([]);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <form
        onSubmit={onSubmitHandler}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <img
                    className="max-w-24 cursor-pointer"
                    src={
                      files[index]
                        ? URL.createObjectURL(files[index])
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
        {/* Product Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none py-2 px-3 rounded border border-gray-300 text-sm"
            required
          />
        </div>
        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="product-description">
            Product Description
          </label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            id="product-description"
            rows={4}
            placeholder="Type here"
            className="outline-none py-2 px-3 rounded border border-gray-300 text-sm resize-none"
          ></textarea>
        </div>
        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="category">
            Category
          </label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            id="category"
            className="outline-none py-2 px-3 rounded border border-gray-300 text-sm"
          >
            <option value="">Select Category</option>
            {categories.map((item, index) => (
              <option key={index} value={item.path}>
                {item.path}
              </option>
            ))}
          </select>
        </div>
        {/* Price + Offer Price */}
        <div className="flex items-end gap-3">
          <div className="w-1/2 flex flex-col gap-1">
            <label className="text-sm font-medium" htmlFor="product-price">
              Price
            </label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none py-2 px-3 rounded border border-gray-300 text-sm w-full"
              required
            />
          </div>
          <div className="w-1/2 flex flex-col gap-1">
            <label className="text-sm font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none py-2 px-3 rounded border border-gray-300 text-sm w-full"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-primary text-white text-sm font-medium rounded-md"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
