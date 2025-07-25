import { CoreContextProvider } from "./CoreContext.jsx";
import { AuthContextProvider } from "./AuthContext";
import { ProductContextProvider } from "./ProductContext";
import { ChatProvider } from "./ChatContext.jsx";

export const AppContextProvider = ({ children }) => {
  return (
    <CoreContextProvider>
      <AuthContextProvider>
        <ProductContextProvider>
          <ChatProvider>{children}</ChatProvider>
        </ProductContextProvider>
      </AuthContextProvider>
    </CoreContextProvider>
  );
};
