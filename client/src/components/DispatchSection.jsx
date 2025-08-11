import { CheckCircle, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const DispatchSection = () => {
  return (
    <div className="mt-16">
      <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image / Illustration */}
          <div className="relative">
            <img
              src={assets.dispatch_banner}
              alt="Courier delivering a package"
              className="rounded-lg shadow-lg w-full object-cover max-h-[600px] sm:500px"
            />
            {/* Decorative badge */}
            <div className="absolute top-4 left-4 bg-white rounded-full px-4 py-2 shadow-md">
              <span className="text-sm font-semibold text-gray-800">
                🚀 Same-day Delivery
              </span>
            </div>
          </div>

          {/* Text Content */}
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Send Anything, Anytime, Anywhere
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Need to send a package, document, or surprise gift? Our dispatch
              delivery service gets it to your recipient quickly and safely,
              with real-time tracking and affordable rates.
            </p>

            {/* Benefits */}
            <ul className="mt-6 space-y-3">
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

            {/* CTA Button */}
            <div className="mt-8">
              <Link
                to="/dispatch"
                className="inline-flex items-center px-6 py-3 bg-primary text-white text-lg font-semibold rounded-full shadow hover:bg-primary-dull transition"
              >
                <Truck className="w-5 h-5 mr-2" />
                Send a Parcel
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default DispatchSection;
