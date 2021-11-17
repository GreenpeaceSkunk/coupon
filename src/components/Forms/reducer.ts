import { SharedState, SharedActions, GenericReducerFn, IData, IUserData, IPaymentData, } from 'greenpeace';

export type FieldErrorType = { [fieldName: string]:boolean } | null;
export type ErrorsType = { [index: string]: FieldErrorType } | null;

type PayloadType = { [x: string]: string | number };

const autofill = process.env.REACT_APP_AUTOFILL_VALUES ? (process.env.REACT_APP_AUTOFILL_VALUES === 'true') ? true : false : false;

export type ContextStateType = {
  data: {
    user: IUserData;
    payment: IPaymentData;
  };
  errors: ErrorsType;
  isEdited: boolean;
} & SharedState;

export type ContextActionType = 
| { type: 'UPDATE_USER_DATA', payload: PayloadType }
| { type: 'UPDATE_PAYMENT_DATA', payload: PayloadType }
| { type: 'SET_ERROR', error: string | null }
| { type: 'UPDATE_FORM_STATUS' }
| { type: 'RESET' }
| SharedActions;

export const initialState: ContextStateType = {
  data: {
    user: {
      firstName: '',
      lastName: '',
      birthDate: '',
      email: '',
      genre: '',
      phoneNumber: '',
      areaCode: '',
      ...(autofill ? {
        firstName: 'Doe',
        lastName: 'Deer',
        birthDate: '20/03/1985',
        email: 'doe.deer@email.com',
        genre: '',
        phoneNumber: '44440000',
        areaCode: '11',
      } : {}),
    } as IUserData,
    payment: {
      cardNumber: '', 
      cardholderName: '',
      securityCode: '',
      cardExpirationMonth: '',
      cardExpirationYear: '',
      docNumber: '',
      docType: 'DNI',
      amount: '500',
      newAmount: '',
      ...(autofill ? {
        cardNumber: '4509953566233704', // Visa
        // cardNumber: '5031755734530604', // Mastercard
        // cardNumber: '371180303257522', // AMEX
        securityCode: '123',
        // securityCode: '1234',
        cardholderName: 'APRO',
        cardExpirationMonth: '11',
        cardExpirationYear: '2025',
        docNumber: '31533422',
        docType: 'DNI',
        amount: '700',
        newAmount: '',
      } : {})
    } as IPaymentData,
  } as IData,
  submitting: false,
  submitted: false,
  isEdited: false,
  error: null,
  errors: null,
}

export const reducer: GenericReducerFn<ContextStateType, ContextActionType> = (state: ContextStateType, action: ContextActionType) => {
  switch (action.type) {
    case 'UPDATE_USER_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          user: {
            ...state.data.user,
            ...action.payload,
          },
        },
      }
    case 'UPDATE_PAYMENT_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          payment: {
            ...state.data.payment,
            ...action.payload['amount']
              ? {
                  amount: action.payload['amount'],
                  newAmount: '',
                }
              : action.payload,
          },
        },
      }
    // case 'UPDATE_FIELD_ERRORS':
    //   console.log('Entra??')
    //   let tmpErrors = (state.errors) ? {...state.errors} : {};
    //   console.log(tmpErrors, action.payload);

    //   if(action.payload.isValid) {
    //     if(tmpErrors[`${action.payload.indexForm}`]) {
    //       const tmpFormIndex = {...tmpErrors[`${action.payload.indexForm}`]};
    //       delete tmpFormIndex[`${action.payload.fieldName}`];
    //       tmpErrors[`${action.payload.indexForm}`] = {...tmpFormIndex};
    //     }
    //   } else {
    //     tmpErrors[`${action.payload.indexForm}`] = {
    //       ...tmpErrors[`${action.payload.indexForm}`],
    //       [`${action.payload.fieldName}`]: !!action.payload.isValid,
    //     };
    //   }
      
    //   return {
    //     ...state,
    //     allowNext: Object.values(tmpErrors).length,
    //     errors: tmpErrors,
    //   }
    // case 'RESET_FIELD_ERRORS': {
    //   return {
    //     ...state,
    //     errors: null,
    //     isEdited: false,
    //   }
    // }
    // case 'UPDATE_FORM_STATUS': {
    //   return {
    //     ...state,
    //     isEdited: true,
    //   };
    // }
    case 'RESET': {
      return {
        ...state,
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
