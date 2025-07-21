import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    navigate,
    getCartAmount,
    makeRequest,
    user,
    Browser,
  } = useAppContext();
  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  // const [paymentOption, setPaymentOption] = useState("COD");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      product.quantity = cartItems[key];
      tempArray.push(product);
    }
    setCartArray(tempArray);
  };

  const getUserAddress = async () => {
    try {
      const data = await makeRequest({
        method: "GET",
        url: "/api/address/get",
      });
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
      const data = await makeRequest({
        method: "POST",
        url: "/api/order/delivery-fee",
        data: {
          latitude,
          longitude,
          vendorIds,
        },
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

      // Place Order with COD
      /*
      if (paymentOption === "COD") {
        const data = await makeRequest({
          method: "POST",
          url: "/api/order/cod",
          data: {
            userId: user._id,
            items: cartArray.map((item) => ({
              product: item._id,
              quantity: item.quantity,
            })),
            address: selectedAddress._id,
          },
        });

        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      } else {
      */
      // Place Order with Paystack
      const isNativeApp = Capacitor.isNativePlatform();
      const data = await makeRequest({
        method: "POST",
        url: "/api/payment/paystack",
        data: {
          userId: user._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
          email: user.email,
          amount: totalAmount,
          isNativeApp,
        },
      });

      if (data.success) {
        if (Capacitor.isNativePlatform()) {
          await Browser.open({ url: data.url });
        } else {
          window.location.replace(data.url);
        }
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
    <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 md:px-8 py-6">
      {/* Cart Section */}
      <div className="flex-1">
        <h1 className="text-xl font-semibold mb-4">
          Shopping Cart
          <span className="text-sm text-primary ml-2">
            ({getCartCount()} Items)
          </span>
        </h1>

        {cartArray.map((product, index) => (
          <div key={index} className="flex gap-4 mb-4 border-b pb-4">
            <div
              onClick={() => {
                navigate(
                  `/products/${product.category.toLowerCase()}/${product._id}`
                );
                scrollTo(0, 0);
              }}
              className="cursor-pointer min-w-[80px] max-w-[80px] h-[80px] border border-gray-300 rounded flex items-center justify-center"
            >
              <img
                className="max-w-full h-full object-cover"
                src={product.image[0]}
                alt={product.name}
              />
            </div>
            <div className="flex flex-col justify-between flex-grow">
              <div>
                <p className="text-base font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">
                  Weight: {product.weight || "N/A"}
                </p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-1 text-sm">
                  <span>Qty:</span>
                  <select
                    value={product.quantity}
                    onChange={(e) =>
                      updateCartItem(product._id, Number(e.target.value))
                    }
                    className="border border-gray-300 px-2 py-1 rounded"
                  >
                    {Array(Math.max(product.quantity, 9))
                      .fill("")
                      .map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                  </select>
                </div>
                <p className="text-sm font-medium">
                  {currency}
                  {product.offerPrice * product.quantity}
                </p>
                <button onClick={() => removeFromCart(product._id)}>
                  <img
                    src={assets.remove_icon}
                    alt="remove"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="text-primary mt-4 font-medium flex items-center gap-1"
        >
          <img
            src={assets.arrow_right_icon_colored}
            alt="arrow"
            className="w-4 h-4 transform rotate-180"
          />
          Continue Shopping
        </button>
      </div>

      {/* Summary Section */}
      <div className="bg-gray-100/50 p-4 border border-gray-300 rounded w-full lg:max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

        <div className="mb-4">
          <p className="text-xs font-medium uppercase text-gray-600 mb-1">
            Delivery Address
          </p>
          <div className="relative">
            <div className="flex justify-between text-sm text-gray-600">
              <p className="max-w-[200px] truncate">
                {selectedAddress ? selectedAddress.address : "No address found"}
              </p>
              <button
                onClick={() => setShowAddress(!showAddress)}
                className="text-primary text-xs hover:underline"
              >
                Change
              </button>
            </div>
            {showAddress && (
              <div className="absolute top-10 z-10 bg-white border border-gray-300 rounded shadow text-sm w-full mt-2">
                {addresses.map((address, idx) => (
                  <p
                    key={idx}
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {address.address}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="text-center text-primary p-2 hover:bg-primary/10 cursor-pointer"
                >
                  Add address
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {getCartAmount()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="text-green-600">
              {deliveryFee ? `${currency}${deliveryFee}` : "Free"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Service Fee</span>
            <span>{`${currency}${serviceFee}`}</span>
          </div>
          <div className="flex justify-between font-medium text-base pt-2">
            <span>Total</span>
            <span>{`${currency}${totalAmount}`}</span>
          </div>
        </div>

        <button
          onClick={placeOrder}
          className="w-full mt-6 py-3 bg-primary text-white rounded font-medium hover:bg-primary-dull"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  ) : null;
};

export default Cart;
