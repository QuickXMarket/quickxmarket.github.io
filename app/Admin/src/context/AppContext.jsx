import { CoreProvider } from "./CoreContext.jsx";
import { AuthProvider } from "./AuthContext";
import { NotificationProvider } from "./NotificationContext";
import { ChatProvider } from "./ChatContext.jsx";
import { AdminProvider } from "./AdminContext.jsx";

export const AppContextProvider = ({ children }) => {
  return (
    <CoreProvider>
      <AuthProvider>
        <AdminProvider>
          <ChatProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </ChatProvider>
        </AdminProvider>
      </AuthProvider>
    </CoreProvider>
  );
};
