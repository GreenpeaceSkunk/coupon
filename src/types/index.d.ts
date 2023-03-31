import { EventType as GoogleTagManagerEventType } from 'google-tag-manager';

declare global {
  interface Window {
    dataLayer: [{
      event: any,
    }];
    
    dcS: {
      synchro: any;
    };

    dc: {
      track: {
        event: (portalId: string, eventId: string, userEmail: string, callback?: any) => void;
      }
    };
    MercadoPago: any;
    /* To be deprectaded */
    Mercadopago: {
      setPublishableKey: (a: string) => void;
      createToken: (a: any, b: any) => string;
      getInstallments: (a: any, b: any) => any;
      key: string;
      tokenId: string;
    };
    /** */
    MP_DEVICE_SESSION_ID: string;
    
    userAmount: any;
    hj: any;
    _hjSettings: {
      hjid: number;
      hjsv: number;
    }
  };

}

export type CouponType = 'regular' | 'oneoff';

export type ParamsType = {
  couponType?: CouponType;
  amount?: string;
  amounts?: string;
};

export interface CustomHTMLScriptElement extends HTMLScriptElement {
  view?: string;
}

export interface GenericReducerFn<S, A> { 
  (state: S, action: A): S;
}

export type StylesType = {
  [el: string]: React.CSSProperties,
};
  
export type AxiosResquestError = {
  error: boolean,
  errorCode?: number,
  status: number,
  message: string,
};

export type ServiceParams = {
  public_key?: string;
}

export interface IUserData {
  firstName: string;
  lastName: string;
  email: string;
  areaCode: string;
  phoneNumber: string;
  docNumber: string;
  docType: string;
  constituentId?: string;
  citizenId?: string;
  birthDate?: string;
  referredFirstName?: string;
  referredLastName?: string;
  referredEmail?: string;
  referredAreaCode?: string;
  referredPhoneNumber?: string;
  referredDocNumber?: string;
  referredDocType?: string;
}

export interface IHubspotUserData {
  email: string;
}

export interface IPaymentData {
  cardNumber: string;
  cardholderName: string;
  cardType?: string;
  securityCode: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  issuerInput: string;
  transactionAmount: string;
  paymentMethodId: string;
  docNumber: string;
  docType: string;
  amount: string;
  newAmount: string;
}

export interface IData {
  user: IUserData;
  payment: IPaymentData;
}

export type SharedState = {
  submitting?: boolean,
  submitted?: boolean,
  error: string | null,
};

export type SharedActions = 
  | { type: 'SUBMIT' }
  | { type: 'SUBMITTED' }
  | { type: 'CANCEL' }
  | { type: 'FAILURE', error: any }
  
export type OnChangeEvent = MouseEvent<HTMLButtonElement> | ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLSelectElement>;
export type OnClickEvent = MouseEvent<HTMLButtonElement>;
export type FeedbackType = 'positive' | 'negative';

export type {
  GoogleTagManagerEventType,
};
