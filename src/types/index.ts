export interface Member {
    id: string,
    fullName: string,
    email: string;
    password: string;
    role: EnumRole;
}

export interface Traveler {
    id: string;
    memberId: string;
    fullName: string;
    email: string;
    password: string;
    role: EnumRole;
    gender: EnumGender;
    age?: number;
    phoneNumber?: string;
  }

  export interface Agency {
    id: string;
    memberId: string;
    fullName: string;
    email: string;
    password: string;
    role: EnumRole;
    companyName: string,
    address: string,
    phoneNumber?: string,
    webSiteUrl: string,
    taxNumber: string,
    licenseNumber: string;
  }

  export interface Owner {
    id: string;
    memberId: string;
    fullName: string;
    email: string;
    password: string;
    role: EnumRole;
    businessName: string,
    address: string,
    phoneNumber?: string,
    licenseNumber: string;
  }
  
  // Cinsiyet ve Rol Enums
  export enum EnumGender {
    Male = "Male",
    Female = "Female",
    Unknown = "Unknown",
  }
  
  export enum EnumRole {
    Admin = 0,
    Traveler = 1,
    Agency = 2,
    Owner = 3,
  }
  