import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import WishlistIcon from "../assets/heart-fill.svg?react";
import { useProductContext } from "../context/ProductContext";
import { useCoreContext } from "../context/CoreContext";

const ProductDetails = () => {
  const { navigate, currency, axios } = useCoreContext();
  const { products, addToCart, updateWishList, wishList } = useProductContext();
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
        const { data } = await axios.get(
          `/api/seller/vendor/${product.vendorId}`
        );
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
      <div className="mt-12">
        <p>
          <Link to={"/"}>Home</Link> /<Link to={"/products"}> Products</Link> /
          <Link to={`/products/${product.category.toLowerCase()}`}>
            {" "}
            {product.category}
          </Link>{" "}
          /<span className="text-primary"> {product.name}</span>
        </p>

        <div className="flex flex-col md:flex-row gap-16 mt-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-3">
              {product.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>

            <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
              <img src={thumbnail} alt="Selected product" />
            </div>
          </div>

          <div className="text-sm w-full md:w-1/2">
            <h1 className="text-3xl font-medium">{product.name}</h1>
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
              <p className="text-sm mt-1 text-gray-600">
                Sold by:{" "}
                <Link
                  to={`/shops/${product.vendorId}`}
                  className="text-primary hover:underline font-medium"
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
                    src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                    alt=""
                    className="md:w-4 w-3.5"
                  />
                ))}
              <p className="text-base ml-2">(4)</p>
            </div>

            <div className="mt-6">
              <p className="text-gray-500/70 line-through">
                MRP: {currency}
                {product.price}
              </p>
              <p className="text-2xl font-medium">
                MRP: {currency}
                {product.offerPrice}
              </p>
              <span className="text-gray-500/70">(inclusive of all taxes)</span>
            </div>

            <p className="text-base font-medium mt-6">About Product</p>
            <ul className="list-disc ml-4 text-gray-500/70">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>

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
              navigate(`/products/${product.category.toLowerCase()}`);
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
              navigate(`/shops/${product.vendorId}`);
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
