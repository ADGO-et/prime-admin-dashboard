export interface ApplicationSummary {
  id: string;
  referenceId: string;
  status: string;
  firstName: string;
  fatherName: string;
  grandfatherName: string;
  email: string;
  phone: string;
  investorType: string;
  submittedAt: string;
  updatedAt: string;
  reviewedAt: string | null;
}

export interface ApplicationsResponse {
  data: ApplicationSummary[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface KycApplication extends ApplicationSummary {
  reviewNotes: string;
  reviewedBy: string | null;
  dob: string;
  age: string;
  placeOfBirth: string;
  nationality: string;
  countryOfResidence: string;
  tinNumber: string;
  cityAdministration: string;
  zone: string;
  subCity: string;
  woredaKebele: string;
  houseNumber: string;
  preferredContact: string;
  marketingCommunications: boolean;
  employmentStatus: string;
  hasBeneficiary: boolean;
  beneficiaryName: string;
  beneficiaryRelationship: string;
  bankName: string;
  bankBranch: string;
  accountNumber: string;
  bankChangeAck: boolean;
  settlementOptions: string[];
  faydaNumber: string;
  faydaIssueDate: string;
  faydaExpiryDate: string;
  documents: {
    faydaFront: string | null;
    faydaBack: string | null;
    kebeleId: string | null;
    drivingLicense: string | null;
  };
  publiclyTradedOwner: string;
  publiclyTradedDetails: string;
  brokerageEmployee: string;
  brokerageEmployeeDetails: string;
  sourceOfFunds: string;
  sourceOfIncomeDetails: string;
  annualNetIncome: string;
  netWorth: string;
  pepStatus: string;
  pepDetails: string;
  bankruptcyDisclosure: string;
  bankruptcyDetails: string;
  criminalRecord: string;
  criminalRecordDetails: string;
  riskTolerance: string;
  stockExperience: string;
  bondExperience: string;
  stockMonthlyValue: string;
  fixedIncomeMonthlyValue: string;
  investmentObjective: string[];
  applicantName: string;
  dateOfApplication: string;
  submitConsent: boolean;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  referenceId?: string;
  applicant?: string;
  email?: string;
  previousStatus?: string;
  newStatus?: string;
  reviewedBy?: string;
  notes?: string;
}
