import { CoreContextProvider } from "./CoreContext.jsx";
import { AuthContextProvider } from "./AuthContext.jsx";
import { ProductContextProvider } from "./ProductContext.jsx";
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
