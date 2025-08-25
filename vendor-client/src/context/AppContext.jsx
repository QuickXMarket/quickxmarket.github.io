import { CoreContextProvider } from "./CoreContext.jsx";
import { AuthContextProvider } from "./AuthContext.jsx";
import { ChatProvider } from "./ChatContext.jsx";
import { VendorContextProvider } from "./VendorContext.jsx";
import { MapContextProvider } from "./MapContext.jsx";

export const AppContextProvider = ({ children }) => {
  return (
    <CoreContextProvider>
      <AuthContextProvider>
        <VendorContextProvider>
          <MapContextProvider>
            <ChatProvider>{children}</ChatProvider>
          </MapContextProvider>
        </VendorContextProvider>
      </AuthContextProvider>
    </CoreContextProvider>
  );
};
