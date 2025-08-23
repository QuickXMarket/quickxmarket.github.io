
import customerData from "./customer.json" with { type: "json" };
import riderData from "./rider.json" with { type: "json" };
import vendorData from "./vendor.json" with { type: "json" };

const termsData =[
  ...customerData,
  ...riderData,
  ...vendorData,
]

  export default termsData