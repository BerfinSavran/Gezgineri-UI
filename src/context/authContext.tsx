import React, { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../services/authService";
import memberService from "../services/memberService";
import ownerService from "../services/ownerService";
import { EnumRole } from "../types";
import travelerService from "../services/travelerService";
import agencyService from "../services/agencyService";

interface User {
  id: string;
  email: string;
  role: number;
  ownerId: string;
  travelerId: string;
  agencyId: string;
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
          let memberData = null;
          let ownerId = null;
          let travelerId = null;
          let agencyId = null;

          if (role == EnumRole.Owner) {
            memberData = await memberService.GetMemberById(id);
            const owner = await ownerService.GetOwnerByMemberId(id);
            ownerId = owner?.id;
          }
          else if(role == EnumRole.Traveler){
            memberData = await memberService.GetMemberById(id);
            const traveler = await travelerService.GetTravelerByMemberId(id);
            travelerId = traveler?.id;
          }
          else if (role == EnumRole.Agency){
            memberData = await memberService.GetMemberById(id);
            const agency = await agencyService.GetAgencyByMemberId(id);
            agencyId = agency?.id;
          }

          // 3. Kullanıcı state'ini güncelle
          setUser({ id, email, role, ownerId, travelerId, agencyId});

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
