export interface Member {
    id: string,
    fullName: string,
    email: string;
    password: string;
    role: EnumRole;
}

export interface Admin {
  id: string;
    memberId: string;
    fullName: string;
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
  
  export enum EnumGender {
    Male = "Male",
    Female = "Female",
  }
  
  export enum EnumRole {
    Admin = 0,
    Traveler = 1,
    Agency = 2,
    Owner = 3,
  }

  export enum EnumStatus {
    Pending = 0,
    Approved = 1,
    Cancelled = 2,
  }

  export interface Place {
    id: string;
    ownerId: string;
    businessName: string;
    categoryId: string;
    categoryName: string;
    name: string;
    description?: string;
    country: string;
    city?: string;
    imageUrl?: string;
    visitDuration?: string;
    entryPrice?: number;
    capacity?: number;
    status: EnumStatus;
    latitude: number;
    longitude: number;
    approvedById: string | null;
  }
  
  export interface Tour {
    id: string;
    agencyId: string;
    companyName: string,
    name: string;
    price: number;
    description?: string;
    capacity?: number;
    startDate: string;
    endDate: string;
    imageUrl?: string;
    webSiteUrl: string,
    status: EnumStatus;
    approvedById: string;
  }

  export interface Category {
    id: string;
    name: string;
  }

  export interface FavoritePlace {
    id?: string;
    placeid: string;
    travelerid: string;
    isFavorite: boolean;
  }

  export interface MyTravel {
    id: string;
    travelerid: string;
    name: string;
    country: string;
    city?: string,
    startDate: string;
    endDate: string;
  }

  export interface MyTravelPlan {
    id?: string;
    myTravelId: string;
    placeId: string;
    city?: string;
    date: string;
  }

  export interface TourRoute {
    id?: string;
    tourId: string;
    location: string;
    order: number;
    date: string;
    description?: string;
    imageUrl?: string;
  }