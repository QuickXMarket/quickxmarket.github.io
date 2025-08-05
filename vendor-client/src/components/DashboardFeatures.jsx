import { BoxIcon, TruckIcon, BanknoteIcon, SettingsIcon } from "lucide-react";

const features = [
  {
    title: "Product Management",
    icon: <BoxIcon className="w-10 h-10 text-green-600" />,
    description: (
      <>
        Upload, edit, or delete products.
        <br />
        Set product variants, pricing, and stock.
      </>
    ),
  },
  {
    title: "Real-Time Order Tracking",
    icon: <TruckIcon className="w-10 h-10 text-green-600" />,
    description: (
      <>
        View and manage incoming orders.
        <br />
        Update order statuses (pending, processing, shipped, delivered).
        <br />
        Filter orders by date or status.
      </>
    ),
  },
  {
    title: "Secure Payout System",
    icon: <BanknoteIcon className="w-10 h-10 text-green-600" />,
    description: (
      <>
        Link bank account.
        <br />
        Track withdrawals and payout history.
      </>
    ),
  },
  {
    title: "Vendor Profile & Settings",
    icon: <SettingsIcon className="w-10 h-10 text-green-600" />,
    description: (
      <>
        Manage business info (name, address, hours).
        <br />
        Upload business logo.
        <br />
        Set open/close status.
      </>
    ),
  },
];

const DashboardFeatures = () => {
  return (
    <div className="container mx-auto px-4 py-10 mt-16">
      <div className="flex flex-col lg:flex-row gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex-1 border rounded-lg p-6 shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardFeatures;
