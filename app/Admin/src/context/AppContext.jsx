import { CoreProvider } from "./CoreContext.jsx";
import { AuthProvider } from "./AuthContext";
import { NotificationProvider } from "./NotificationContext";
import { ChatProvider } from "./ChatContext.jsx";

export const AppContextProvider = ({ children }) => {
  return (
    <CoreProvider>
      <AuthProvider>
          <ChatProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </ChatProvider>
      </AuthProvider>
    </CoreProvider>
  );
};
