import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import WishlistIcon from "../assets/heart-fill.svg?react";

const ProductDetails = () => {
  const {
    products,
    navigate,
    currency,
    addToCart,
    makeRequest,
    updateWishList,
    wishList,
  } = useAppContext();
  const { id } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [otherProductsFromVendor, setOtherProductsFromVendor] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [isWishListed, setIsWishListed] = useState(false);

  const product = products.find((item) => item._id === id);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter(
        (item) => product.category === item.category
      );
      setRelatedProducts(productsCopy.slice(0, 5));
      if (!product.vendorId) return;
      let vendorProducts = products.filter(
        (item) => item.vendorId === product.vendorId && item._id !== product._id
      );
      setOtherProductsFromVendor(vendorProducts.slice(0, 5));
    }
    const fetchVendor = async () => {
      if (!product || !product.vendorId) return;
      try {
        const data = await makeRequest({
          method: "GET",
          url: `/api/seller/vendor/${product.vendorId}`,
        });
        if (data.success) {
          setVendor(data.vendor.businessName);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log("Failed to fetch vendor details.");
      }
    };
    fetchVendor();
  }, [products]);

  useEffect(() => {
    setThumbnail(product?.image[0] ? product.image[0] : null);
    setIsWishListed(wishList.includes(product._id));
  }, [product]);

  return (
    product && (
      <div className="mt-8 ">
        {/* Breadcrumbs */}
        <p className="text-xs sm:text-sm text-gray-500">
          <Link to="/">Home</Link> /<Link to="/products"> Products</Link> /
          <Link to={`/products/${product.category.toLowerCase()}`}>
            {" "}
            {product.category}
          </Link>{" "}
          /<span className="text-primary"> {product.name}</span>
        </p>

        {/* Product Content */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-16 mt-4">
          {/* Images */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Main Image */}
            <div className="border border-gray-300 rounded overflow-hidden max-w-full">
              <img
                src={thumbnail}
                alt="Selected product"
                className="object-cover w-full"
              />
            </div>
            {/* Thumbnail List */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
              {product.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className="w-16 h-16 border rounded overflow-hidden flex-shrink-0 cursor-pointer"
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="text-sm w-full">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              {product.name}
            </h1>
            <WishlistIcon
              className={`w-5 h-5 sm:w-6 sm:h-6 ml-auto cursor-pointer hover:scale-110 transition  ${
                isWishListed ? "text-primary" : "text-gray-500"
              }`}
              onClick={() => {
                updateWishList(product._id);
                setIsWishListed(!isWishListed);
              }}
            />

            {vendor && (
              <p className="text-xs sm:text-sm mt-1 text-gray-600">
                Sold by:{" "}
                <Link
                  to={`/shops/${product.vendorId}`}
                  className="text-primary font-medium "
                >
                  {vendor}
                </Link>
              </p>
            )}

            <div className="flex items-center gap-0.5 mt-1">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <img
                    key={i}
                    src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                    alt=""
                    className="w-3.5 sm:w-4"
                  />
                ))}
              <p className="text-xs sm:text-sm ml-2">(4)</p>
            </div>

            {/* Price */}
            <div className="mt-4">
              <p className="text-sm text-gray-500 line-through">
                MRP: {currency}
                {product.price}
              </p>
              <p className="text-xl font-semibold">
                {currency}
                {product.offerPrice}
              </p>
              <span className="text-xs text-gray-400">(incl. taxes)</span>
            </div>

            {/* Description */}
            <p className="text-base font-medium mt-6">About Product</p>
            <ul className="list-disc ml-4 text-gray-600 text-sm">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>

            {/* Buttons */}
            <div className="flex items-center mt-10 gap-4 text-base">
              <button
                onClick={() => addToCart(product._id)}
                className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(product._id);
                  navigate("/cart");
                }}
                className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
        {/* ---------- related products -------------- */}
        <div className="flex flex-col items-center mt-20">
          <div className="flex flex-col items-center w-max">
            <p className="text-3xl font-medium">Related Products</p>
            <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
            {relatedProducts
              .filter((product) => product.inStock)
              .map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
          </div>
          <button
            onClick={() => {
              navigate("/products");
              scrollTo(0, 0);
            }}
            className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
          >
            See more
          </button>
        </div>

        {/* ---------- other products from vendor -------------- */}
        <div className="flex flex-col items-center mt-20">
          <div className="flex flex-col items-center w-full max-w-[90%]">
            <p className="w-full text-3xl font-medium break-words text-center">
              Other Products From Vendor
            </p>

            <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
            {otherProductsFromVendor
              .filter((product) => product.inStock)
              .map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
          </div>
          <button
            onClick={() => {
              navigate("/products");
              scrollTo(0, 0);
            }}
            className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
          >
            See more
          </button>
        </div>
      </div>
    )
  );
};

export default ProductDetails;
