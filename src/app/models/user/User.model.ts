export interface UserResponse {
    userId: string
    token: string
    expiration: string
    firstName: string
    lastName: string
    email: string
    phoneNumberCountryCode: string
    phoneNumber: string
    avtar: string
    gametag: string
    isXboxUser: boolean
    referralCode: string
    isNewUser: boolean
    isRegisterByReferral: boolean
    referralUserCount: number
    userPlans: UserPlan[]
  }
  
  export interface UserPlan {
    id: string
    userId: string
    planId: string
    activeSinceDate: string
    expireDate: string
    planStatus: string
    description: string
    plan: Plan
  }
  
  export interface Plan {
    id: string
    title: string
    description: string
    type: string
    pricetier: number
    currency: string
    storageLimits: number
    storageUnits: string
    isDefault: boolean
  }
  