import { CheckCircle, Truck, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Services = () => {
  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Services</p>
      <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Dispatch Service */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={assets.dispatch_banner}
                alt="Courier delivering a package"
                className="rounded-t-xl w-full object-cover max-h-[300px]"
              />
              <div className="absolute top-4 left-4 bg-white rounded-full px-4 py-2 shadow-md">
                <span className="text-sm font-semibold text-gray-800">
                  🚀 Same-day Delivery
                </span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Dispatch Delivery
              </h2>
              <p className="mt-3 text-gray-600">
                Need to send a package, document, or surprise gift? Our dispatch
                service gets it to your recipient quickly and safely, with
                real-time tracking and affordable rates.
              </p>

              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Same-day delivery within the city
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Affordable and transparent pricing
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Real-time package tracking
                </li>
              </ul>

              <div className="mt-6">
                <Link
                  to="/dispatch"
                  className="inline-flex items-center px-5 py-2 bg-primary text-white rounded-full shadow hover:bg-primary-dull transition"
                >
                  <Truck className="w-5 h-5 mr-2" />
                  Send a Parcel
                </Link>
              </div>
            </div>
          </div>

          {/* Errand Service */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={assets.errand_banner}
                alt="Person running errands"
                className="rounded-t-xl w-full object-cover max-h-[300px]"
              />
              <div className="absolute top-4 left-4 bg-white rounded-full px-4 py-2 shadow-md">
                <span className="text-sm font-semibold text-gray-800">
                  🛒 Personal Errands
                </span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Errand Service
              </h2>
              <p className="mt-3 text-gray-600">
                Too busy to step out? Let us handle your errands. From groceries
                to store pickups, our reliable riders save you time and effort.
              </p>

              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Buy and deliver groceries or meals
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Store-to-door pickups
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Save time with trusted riders
                </li>
              </ul>

              <div className="mt-6">
                <Link
                  to="/errand"
                  className="inline-flex items-center px-5 py-2 bg-primary text-white rounded-full shadow hover:bg-primary-dull transition"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Request an Errand
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
