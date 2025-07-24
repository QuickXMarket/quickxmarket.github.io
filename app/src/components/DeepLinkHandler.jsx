import { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DeepLinkHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    CapacitorApp.addListener("appUrlOpen", (event) => {
      console.log(event);
      toast("work");
      if (!event?.url) return;

      const url = new URL(event.url);
      if (url.href.startsWith("quickxmarket://")) {
        const route = url.href.replace("quickxmarket://", "");
        navigate("/" + route);
      }
    });
  }, []);

  return null;
};

export default DeepLinkHandler;
