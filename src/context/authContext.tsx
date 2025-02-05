import React, { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../services/authService";
import memberService from "../services/memberService";

interface User {
  id: string;
  email: string;
  role: number;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(AuthService.getToken());
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          // 1. Backend'e token göndererek kullanıcı bilgilerini al
          const { id, email, role } = await AuthService.decodeToken(token);

          // 2. Kullanıcının rolüne göre detaylı bilgileri çek
          let roleData = null;
          if (role) {
            roleData = await memberService.GetMemberById(id);
          }

          // 3. Kullanıcı state'ini güncelle
          setUser({ id, email, role });

        } catch (error) {
          console.error("Kullanıcı bilgileri alınamadı:", error);
          setUser(null);
        }
      }
    };

    fetchUserData();
  }, [token]);

  const logout = () => {
    AuthService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
