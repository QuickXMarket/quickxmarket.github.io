import { CoreContextProvider } from "./CoreContext.jsx";
import { AuthContextProvider } from "./AuthContext.jsx";
import { ProductContextProvider } from "./ProductContext.jsx";
import { ChatProvider } from "./ChatContext.jsx";
import { MapContextProvider } from "./MapContext.jsx";

export const AppContextProvider = ({ children }) => {
  return (
    <CoreContextProvider>
      <AuthContextProvider>
        <ProductContextProvider>
          <MapContextProvider>
            <ChatProvider>{children}</ChatProvider>
          </MapContextProvider>
        </ProductContextProvider>
      </AuthContextProvider>
    </CoreContextProvider>
  );
};
