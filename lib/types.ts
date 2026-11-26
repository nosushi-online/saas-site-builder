export interface CanvasField {
  name: string;
  type: 'text' | 'textarea' | 'image' | 'color' | 'url';
  label: string;
  required?: boolean;
}

export interface CanvasSectionDefinition {
  type: string;
  label: string;
  fields: CanvasField[];
}

export interface Canvas {
  id: string;
  name: string;
  description: string;
  previewImage?: string;
  sections: CanvasSectionDefinition[];
  defaultStyles: {
    primaryColor: string;
    fontFamily: string;
    backgroundColor?: string;
  };
  createdByAdmin: boolean;
  isActive: boolean;
}

export interface UserSite {
  id: string;
  userId: string;
  subdomain: string;
  canvasId: string;
  content: Record<string, Record<string, any>>; // sectionType -> field values
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  plan: string;
}
