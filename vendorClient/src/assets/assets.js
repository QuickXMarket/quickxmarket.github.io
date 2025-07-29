import logo from "./logo.svg";
import search_icon from "./search_icon.svg";
import remove_icon from "./remove_icon.svg";
import arrow_right_icon_colored from "./arrow_right_icon_colored.svg";
import star_icon from "./star_icon.svg";
import star_dull_icon from "./star_dull_icon.svg";
import cart_icon from "./cart_icon.svg";
import nav_cart_icon from "./nav_cart_icon.svg";
import add_icon from "./add_icon.svg";
import refresh_icon from "./refresh_icon.svg";
import product_list_icon from "./product_list_icon.svg";
import order_icon from "./order_icon.svg";
import upload_area from "./upload_area.png";
import profile_icon from "./profile_icon.png";
import menu_icon from "./menu_icon.svg";
import delivery_truck_icon from "./delivery_truck_icon.svg";
import leaf_icon from "./leaf_icon.svg";
import coin_icon from "./coin_icon.svg";
import box_icon from "./box_icon.svg";
import trust_icon from "./trust_icon.svg";
import black_arrow_icon from "./black_arrow_icon.svg";
import white_arrow_icon from "./white_arrow_icon.svg";
import main_banner_bg from "./main_banner_bg.png";
import main_banner_bg_sm from "./main_banner_bg_sm.png";
import bottom_banner_image from "./bottom_banner_image.png";
import bottom_banner_image_sm from "./bottom_banner_image_sm.png";
import add_address_iamge from "./add_address_image.svg";
import clothing_image from "./clothing_image.jpg";
import phone_accessories_image from "./phone_accessories_image.jpg";
import shoes_image from "./shoes_image.jpg";
import cosmetics_image from "./cosmetics_image.jpg";
import food_image from "./food_image.jpg";
import hair_accessories_image from "./hair_accessories_image.jpg";
import first_banner_image from "./1st_banner_image.jpg";
import second_banner_image from "./2nd_banner_image.jpg";
import QuickXMarket_Logo_Transparent from "./QuickXMarket_Logo_Transparent.png";
import Favicon_rounded from "./Favicon2-rounded.png";
import home_outline from "./house_outline.svg";
import profile_outline from "./person_outline.svg";
import Slideshow_1 from "./Slideshow_1.jpg";
import Slideshow_2 from "./Slideshow_2.jpg";
import Slideshow_3 from "./Slideshow_3.jpg";
import Slideshow_4 from "./Slideshow_4.jpg";
import wallet_icon from "./wallet_icon.svg";
import wallet_outline from "./wallet_outline.svg";

export const assets = {
  logo,
  search_icon,
  remove_icon,
  arrow_right_icon_colored,
  star_icon,
  star_dull_icon,
  cart_icon,
  nav_cart_icon,
  add_icon,
  refresh_icon,
  product_list_icon,
  order_icon,
  upload_area,
  profile_icon,
  menu_icon,
  delivery_truck_icon,
  leaf_icon,
  coin_icon,
  trust_icon,
  black_arrow_icon,
  white_arrow_icon,
  main_banner_bg,
  main_banner_bg_sm,
  bottom_banner_image,
  bottom_banner_image_sm,
  add_address_iamge,
  box_icon,
  Favicon_rounded,
  first_banner_image,
  second_banner_image,
  wallet_icon,
  wallet_outline,
  home_outline,
  profile_outline,
  QuickXMarket_Logo_Transparent,
  Slideshow_1,
  Slideshow_2,
  Slideshow_3,
  Slideshow_4,
};

export const categories = [
  {
    text: "Phone Accessories",
    path: "PhoneAccessories",
    image: phone_accessories_image,
    bgColor: "#E0F7FA",
  },
  {
    text: "Hair Accessories",
    path: "HairAccessories",
    image: hair_accessories_image,
    bgColor: "#F1F8E9",
  },
  {
    text: "Fashion and Accessories",
    path: "Fashion&Accessories",
    image: clothing_image,
    bgColor: "#FCE4EC",
  },
  {
    text: "Shoes",
    path: "Shoes",
    image: shoes_image,
    bgColor: "#FFF3E0",
  },
  {
    text: "Cosmetics",
    path: "Cosmetics",
    image: cosmetics_image,
    bgColor: "#F3E5F5",
  },
  {
    text: "Food",
    path: "Food",
    image: food_image,
    bgColor: "#E8F5E9",
  },
];

export const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { text: "Home", url: "/" },
      // { text: "Best Sellers", url: "#" },
      // { text: "Offers & Deals", url: "#" },
      { text: "Contact Us", url: "/contact" },
      // { text: "FAQs", url: "#" },
    ],
  },
  {
    title: "Need help?",
    links: [
      // { text: "Delivery Information", url: "#" },
      // { text: "Return & Refund Policy", url: "#" },
      // { text: "Payment Methods", url: "#" },
      { text: "Track your Order", url: "/my-orders" },
      { text: "Contact Us", url: "/contact" },
    ],
  },
  // {
  //   title: "Follow Us",
  //   links: [
  //     { text: "Instagram", url: "#" },
  //     { text: "Twitter", url: "#" },
  //     { text: "Facebook", url: "#" },
  //     { text: "YouTube", url: "#" },
  //   ],
  // },
];

export const features = [
  {
    icon: delivery_truck_icon,
    title: "Fastest Delivery",
    description: "Groceries delivered in under 30 minutes.",
  },
  {
    icon: leaf_icon,
    title: "Freshness Guaranteed",
    description: "Fresh produce straight from the source.",
  },
  {
    icon: coin_icon,
    title: "Affordable Prices",
    description: "Quality groceries at unbeatable prices.",
  },
  {
    icon: trust_icon,
    title: "Trusted by Thousands",
    description: "Loved by 10,000+ happy customers.",
  },
];
