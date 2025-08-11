import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { useProductContext } from "../context/ProductContext";
import { useCoreContext } from "../context/CoreContext";
import { useAuthContext } from "../context/AuthContext";

const Cart = () => {
  const { user } = useAuthContext();
  const { axios, currency, navigate } = useCoreContext();
  const {
    products,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    getCartAmount,
    setCartItems,
  } = useProductContext();
  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const getCart = () => {
    let tempArray = [];
    for (const productId in cartItems) {
      for (const optionId in cartItems[productId]) {
        const product = products.find((item) => item._id === productId);
        if (product) {
          product.quantity = cartItems[productId][optionId];
          const option = product.options.find(
            (option) => option._id === optionId
          );
          product.option = option;
          tempArray.push(product);
        }
      }
    }

    setCartArray(tempArray);
  };

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchDeliveryFee = async (latitude, longitude, vendorIds) => {
    try {
      const { data } = await axios.post("/api/order/delivery-fee", {
        latitude,
        longitude,
        vendorIds,
      });
      if (data.success) {
        setDeliveryFee(data.totalDeliveryFee);
      } else {
        setDeliveryFee(0);
        toast.error("Failed to fetch delivery fee");
      }
    } catch (error) {
      setDeliveryFee(0);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
      setTotalAmount(getCartAmount());
    }
  }, [products, cartItems]);

  useEffect(() => {
    if (user) {
      getUserAddress();
    }
  }, [user]);

  useEffect(() => {
    if (selectedAddress && cartArray.length > 0) {
      // Extract unique vendor IDs from cartArray
      const vendorIdsSet = new Set();
      cartArray.forEach((product) => {
        if (product.vendorId) {
          vendorIdsSet.add(product.vendorId);
        }
      });
      const vendorIds = Array.from(vendorIdsSet);
      if (vendorIds.length > 0) {
        fetchDeliveryFee(
          selectedAddress.latitude,
          selectedAddress.longitude,
          vendorIds
        );
      } else {
        setDeliveryFee(0);
      }
    }
  }, [selectedAddress, cartArray]);

  useEffect(() => {
    if (!cartArray || cartArray.length === 0) return;
    const totalPrice = getCartAmount() + deliveryFee;
    let serviceFee = 0;
    if (totalPrice < 2500) {
      serviceFee = (1.5 * totalPrice) / 100;
    } else {
      serviceFee = (1.5 * totalPrice) / 100 + 100;
    }
    if (serviceFee > 2000) {
      serviceFee = 2000;
    }
    const roundedServiceFee = Math.ceil(serviceFee / 10) * 10;
    setServiceFee(roundedServiceFee);
    setTotalAmount(totalPrice + roundedServiceFee);
  }, [deliveryFee, cartArray]);

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }

      // Place Order with Paystack
      const { data } = await axios.post("/api/payment/paystack", {
        userId: user._id,
        items: cartArray.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          vendorId: item.vendorId,
          option: item.option,
        })),
        address: selectedAddress._id,
        email: user.email,
      });

      if (data.success) {
        window.location.replace(data.url);
      } else {
        toast.error(data.message);
      }
      /*
      }
      */
    } catch (error) {
      toast.error(error.message);
    }
  };

  return products.length > 0 && cartItems ? (
    <div className="flex flex-col md:flex-row mt-16">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary">{getCartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(
                    `/products/${product.category.toLowerCase()}/${product._id}`
                  );
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.image[0]}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>
                    Weight: <span>{product.weight || "N/A"}</span>
                  </p>
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      onChange={(e) =>
                        updateCartItem(
                          product._id,
                          product.option._id,
                          Number(e.target.value)
                        )
                      }
                      value={product.quantity}
                      className="outline-none"
                    >
                      {Array(product.quantity > 9 ? product.quantity : 9)
                        .fill("")
                        .map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center">
              {currency}
              {product.option.offerPrice * product.quantity}
            </p>
            <button
              onClick={() => removeFromCart(product._id, product.option._id)}
              className="cursor-pointer mx-auto"
            >
              <img
                src={assets.remove_icon}
                alt="remove"
                className="inline-block w-6 h-6"
              />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
        >
          <img
            className="group-hover:-translate-x-1 transition"
            src={assets.arrow_right_icon_colored}
            alt="arrow"
          />
          Continue Shopping
        </button>
      </div>

      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.address}`
                : "No address found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary hover:underline cursor-pointer"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                {addresses.map((address, index) => (
                  <p
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100"
                  >
                    {address.address}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>
          {/* 
          <p className="text-sm font-medium uppercase mt-6">Payment Method</p> */}

          {/*
          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
          */}
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {getCartAmount()}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="text-green-600">
              {deliveryFee ? `${currency}${deliveryFee}` : "Free"}
            </span>
          </p>
          {/* <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {(getCartAmount() * 2) / 100}
            </span>
          </p> */}
          <p className="flex justify-between">
            <span>Service Fee</span>
            <span>{`${currency}${serviceFee}`}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>{`${currency}${totalAmount}`}</span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition"
        >
          {/* {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"} */}
          Proceed to Checkout
        </button>
      </div>
    </div>
  ) : null;
};

export default Cart;
