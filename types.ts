
export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
}

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  price: number;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  date: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
}

export type FontFamily = 'modern' | 'elegant' | 'tech' | 'mono';
export type ButtonRadius = 'none' | 'md' | 'xl' | 'full';

export interface SiteSettings {
  shopName: string;
  heroTitle: string;
  heroSubtitle: string;
  logoUrl: string;
  backgroundColor: string;
  backgroundImage: string;
  backgroundOverlayOpacity: number;
  accentColor: string;
  textColor: string;
  useImageBackground: boolean;
  fontFamily: FontFamily;
  buttonRadius: ButtonRadius;
  footerText: string;
  showChatbot: boolean;
  socialLinks: SocialLinks;
}

export interface User {
  username: string;
  email: string;
}

export type ViewMode = 'customer' | 'admin';