import { CoreProvider } from "./CoreContext.jsx";
import { AuthProvider } from "./AuthContext";
import { ProductProvider } from "./ProductContext";
import { NotificationProvider } from "./NotificationContext";
import { ChatProvider } from "./ChatContext.jsx";

export const AppContextProvider = ({ children }) => {
  return (
    <CoreProvider>
      <AuthProvider>
        <ProductProvider>
          <ChatProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </ChatProvider>
        </ProductProvider>
      </AuthProvider>
    </CoreProvider>
  );
};
