export interface Company {
    company_id?: number;
    company_name: string;
    tax_id : string;
    address?: string;
    phone?: string;
    email?: string;
    created_date?: Date;
    updatedDate?: Date;
    is_active: boolean;
    is_deleted: boolean;
  }