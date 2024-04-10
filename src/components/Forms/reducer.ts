import { SharedState, SharedActions, GenericReducerFn, IData, IUserData, IPaymentData, RegionType, ProvinceType, CityType, FieldType, FieldErrorType } from 'greenpeace';

export type FormSharedType = {
  countries?: Array<{code: string; label: string; phone: string}>; // { code: "AD", label: "Andorra", phone: "376" } 
  regions?: Array<RegionType>;
  provinces?: Array<ProvinceType>;
  cities?: Array<CityType>;
}

export type ContextStateType = {
  data: {
    user: IUserData;
    payment: IPaymentData;
  };
  shared: FormSharedType
  errors: FieldErrorType;
  isEdited: boolean;
  allowNext: boolean;
  submitted: boolean;
  submitting: boolean;
} & SharedState;

export type ContextActionType = 
| { type: 'UPDATE_FIELD', payload: FieldType }
| { type: 'UPDATE_FIELD_ERRORS', payload: { fieldName: string; isValid: boolean; } }
| { type: 'UPDATE_USER_DATA', payload: FieldType }
| { type: 'UPDATE_PAYMENT_DATA', payload: FieldType }
| { type: 'UPDATE_FORM_STATUS' }
| { type: 'SET_SHARED_FORM_FIELDS', payload: FormSharedType }
| { type: 'SET_ERROR', error: string | null }
| { type: 'RESET' }
| SharedActions;

const autofill = process.env.REACT_APP_AUTOFILL_VALUES ? (process.env.REACT_APP_AUTOFILL_VALUES === 'true') ? true : false : false;

const defaultData = {
  user: {
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    genre: '',
    phoneNumber: '',
    areaCode: '',
    docNumber: '',
    docType: '',
    citizenId: '',
    country: '',
    province: '',
    city: '',
    address: '',
    addressNumber: '',
    constituentId: '',
    referredAreaCode: '',
    referredDocNumber: '',
    referredDocType: '',
    referredEmail: '',
    referredFirstName: '',
    referredLastName: '',
    referredPhoneNumber: '',
  } as IUserData,
  payment: {
    cardNumber: '',
    cardHolderName: '',
    securityCode: '',
    cardExpirationMonth: '',
    cardExpirationYear: '',
    cardExpiration: '',
    docNumber: '',
    docType: '',
    newAmount: '',
    isCardHolder: false,
    paymentType: 'credit_card',
    bankName: '',
    bankAccountType: '',
    bankAccountNumber: '',
  } as IPaymentData,
} as IData;

export const initialState: ContextStateType = {
  data: {
    ...defaultData,
    user: {
      ...defaultData.user,
      ...(autofill ? {
        firstName: 'Doe',
        lastName: 'Deer',
        birthDate: '20/03/1985',
        email: 'doe.deer@email.com',
        genre: 'No binario',
        phoneNumber: '44440000',
        areaCode: '012',
        docNumber: '11111111',
        // docType: 'DNI',
        docType: 'PP',
        // address: 'Av. Libertador',
        address: 'Calle 1000',
        addressNumber: '8734',
        citizenId: '',
        constituentId: '',
        referredAreaCode: '351',
        referredDocNumber: '19283475',
        referredDocType: 'LC',
        referredEmail: 'jhon.doe@email.com',
        referredFirstName: 'Jhon',
        referredLastName: 'Doe',
        referredPhoneNumber: '98765432',
        zipCode: 'CP1429',
        province: '003',
        city: 'Amalfi',
      } : {}),
    } as IUserData,
    payment: {
      ...defaultData.payment,
      ...(autofill ? {
        // cardType: '2',
        // cardNumber: '4509953566233704',
        // cardNumber: '4509953566233704', // Visa
        cardNumber: '5031755734530604', // Mastercard
        // cardNumber: '371180303257522', // AMEX
        // securityCode: '',
        securityCode: '123',
        cardHolderName: 'Jhon Doe',
        // cardHolderName: 'APRO',
        // cardExpirationMonth: '11',
        // cardExpirationYear: '2025',
        docType: 'CC',
        docNumber: '22222222',
        cardExpiration: '11/27',
        // bankName: 'bank_2',
        // bankAccountType: 'AHORROS',
        // bankAccountNumber: '555555',
        // docType: 'DNI',
      } : {})
    } as IPaymentData,
  } as IData,
  shared: {
    cities: [],
    regions: [],
    countries: [],
    provinces: [],
  },
  submitting: false,
  submitted: false,
  isEdited: false,
  allowNext: false,
  error: null,
  errors: null,
};

export const reducer: GenericReducerFn<ContextStateType, ContextActionType> = (state: ContextStateType, action: ContextActionType) => {
  let isCardHolder = state.data.payment.isCardHolder;

  if(action.type === 'UPDATE_USER_DATA' || action.type === 'UPDATE_PAYMENT_DATA') {
    isCardHolder = (+(action.payload.hasOwnProperty('isCardHolder') ? action.payload['isCardHolder'] : isCardHolder) === 0 ? false : true)
  }

  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        data: {
          ...state.data,
          user: {
            ...state.data.user,
            ...action.payload,
            ...(action.payload.province === '') ? {
              city: '',
            } : null,
          },
        },
      }
    case 'UPDATE_USER_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          user: {
            ...state.data.user,
            ...action.payload,
          },
          payment: {
            ...state.data.payment,
            ...(isCardHolder && (action.payload['docType'] || action.payload['docNumber'])) ? action.payload : null,
          }
        },
      }
    case 'UPDATE_PAYMENT_DATA':
      return {
        ...state,
        data: {
          isCardHolder,
          ...state.data,
          payment: {
            ...state.data.payment,
            ...isCardHolder ? {
              docType: state.data.user.docType,
              docNumber: state.data.user.docNumber,
            } : null,
            ...action.payload['amount']
              ? {
                  amount: action.payload['amount'],
                  newAmount: (action.payload['amount'] === 'otherAmount') ? action.payload['newAmount'] : '',
                }
              : action.payload,
          },
        },
      }
    case 'UPDATE_FIELD_ERRORS':
      let tmpErrors = (state.errors) ? {...state.errors} : {};
      
      if(action.payload.isValid) {
        delete tmpErrors[`${action.payload.fieldName}`];
      } else {
        tmpErrors[`${action.payload.fieldName}`] = false;
      }
      
      // Remove the newAMount field only if the amount is valid
      if(action.payload.fieldName === 'amount' && action.payload.isValid && !tmpErrors['newAmount']) {
        delete tmpErrors['newAmount'];
      }
      
      return {
        ...state,
        errors: tmpErrors,
        allowNext: Object.values(tmpErrors).length ? false : true,
      }
    case 'SET_SHARED_FORM_FIELDS': {
      return {
        ...state,
        shared: {
          ...state.shared,
          ...action.payload,
        },
      }
    }
    case 'SET_ERROR': {
      return {
        ...state,
        submitting: false,
        submitted: false,
        error: action.error,
      }
    }
    case 'RESET': {
      return {
        ...state,
        data: {...defaultData},
        errors: null,
        submitting: false,
        submitted: false,
      };
    }
    case 'SUBMIT': {
      return {
        ...state,
        submitting: true,
        submitted: false,
        isEdited: false,
      };
    }
    case 'SUBMITTED': {
      return {
        ...state,
        submitting: false,
        submitted: true,
        isEdited: false,
      };
    }
    default: {
      throw new Error('Context Error');
    }
  }
}

const _ = {
  initialState,
  reducer,
};

export default _;
