export type SeatType = "FRONT" | "MIDDLE" | "BACK";
export type OrderType = "PASSENGER" | "PARCEL";
export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface HeroSlide {
  id: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  image: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export interface Route {
  id: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  image: string;
  frontSeatPrice: number;
  middleSeatPrice: number;
  backSeatPrice: number;
  parcelPrice: number;
  isActive: boolean;
  createdAt: string;
}

export interface Driver {
  id: string;
  fullName: string;
  photo: string;
  carName: string;
  experience: number;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export interface DriverApplication {
  id: string;
  fullName: string;
  carPhotos: string[];
  carName: string;
  experience: number;
  phone: string;
  receiptImage: string | null;
  receiptPdf: string | null;
  status: ApplicationStatus;
  createdAt: string;
}

export interface Promotion {
  id: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  image: string;
  isActive: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  isRead: boolean;
  createdAt: string;
}

export interface Stats {
  totalRoutes: number;
  totalDrivers: number;
  totalOrders: number;
  totalApplications: number;
  totalPromotions: number;
  pendingApplications: number;
  totalHeroSlides: number;
}
