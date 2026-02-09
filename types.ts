
export enum UserRole {
  ADMIN = 'ADMIN',
  PVCS_USER = 'PVCS_USER',
  UNION_USER = 'UNION_USER',
  DEPT_OFFICIAL = 'DEPT_OFFICIAL',
  FARMER = 'FARMER'
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  location?: string;
  organization?: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  mobile: string;
  type: 'Wholesaler' | 'Retailer' | 'Exporter' | 'Institutional';
  location: string;
}

export interface DailyPrice {
  vegetable: string;
  price: number;
  lastUpdated: string;
  updatedBy: string;
}

export interface ProcurementEntry {
  id: string;
  farmerName: string;
  vendorId?: string; 
  // Fix: Added 'Union' to the union type to support district union transactions in the ERP workflow
  sourceType: 'Farmer' | 'Vendor' | 'Aggregator' | 'Union';
  location: string;
  vegetable: string;
  quantity: number;
  unit: 'Kg' | 'Quintal';
  grade: 'A' | 'B' | 'C' | 'D';
  pricePerUnit: number;
  totalAmount: number;
  timestamp: string;
  status: 'Draft' | 'Approved' | 'Locked';
  procurementDate: string;
}

export interface FarmerRegistration {
  id?: string;
  dbtNumber: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  aadhaar: string;
  mobile: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  crops: string[];
  landArea: number;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Deactivated';
  applicationDate: string;
  documents?: {
    type: string;
    status: 'Pending' | 'Verified' | 'Rejected';
    url?: string;
  }[];
}

export interface FeedbackEntry {
  id: number;
  name: string;
  mobile: string;
  category: 'Technical' | 'Pricing' | 'Membership' | 'Scheme' | 'Other';
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export interface LandPlot {
  id: string;
  farmerId: string;
  khataNumber: string;
  khesraNumber: string;
  areaAcres: number;
  coordinates: { lat: number; lng: number };
  currentCrop: string;
  soilType: string;
  irrigationSource: string;
}

export interface QualityParameter {
  name: string;
  unit: string;
  standard: string;
  value?: string | number;
  status?: 'Pass' | 'Warning' | 'Fail';
}

export interface Scheme {
  id: string;
  name: string;
  code: string;
  budget: number;
  utilized: number;
  status: 'Active' | 'Planned' | 'Closed';
}
