export interface Customer {
    id?: number;
    companyId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    isActive: boolean;
  }