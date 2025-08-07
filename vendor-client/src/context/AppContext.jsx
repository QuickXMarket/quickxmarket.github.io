import { CoreContextProvider } from "./CoreContext.jsx";
import { AuthContextProvider } from "./AuthContext.jsx";
import { ChatProvider } from "./ChatContext.jsx";
import { VendorContextProvider } from "./VendorContext.jsx";

export const AppContextProvider = ({ children }) => {
  return (
    <CoreContextProvider>
      <AuthContextProvider>
        <VendorContextProvider>
          <ChatProvider>{children}</ChatProvider>
        </VendorContextProvider>
      </AuthContextProvider>
    </CoreContextProvider>
  );
};
