import moment from 'moment';

export const ERROR_CODES = {
  'SK001': 'Asegurate que el nombre sea correcto.',
  'SK002': 'El nombre solo puede contener letras.',
  'SK003': 'Asegurate que el apellido sea correcto.',
  'SK004': 'El apellido solo puede contener letras.',
  'SK005': 'Ingresá el DNI sin puntos ni espacios.',
  'SK006': 'Asegurate de que el e-mail sea correcto.',
  'SK007': 'Asegurate de que el código de área sea correcto.',
  'SK008': 'Asegurate de que el celular sea correcto.',
  'SK009': 'El celular solo puede contener números.',
  'SK010': 'El DNI solo puede contener números.',
  'SK011': 'El código de área solo puede contener números.',
  'SK012': 'Campo incompleto.',
  'SK013': 'Asegurate de que el campo no esté vacío',
  'SK014': 'Revisa el número de tarjeta',
  'SK015': 'Revisa el código de seguridad',
  'SK016': 'Error en el Email',
  'MP316': 'Ingresa un nombre válido.',
  '001': 'Valor incorrecto',
  '002': 'Código de area incorrecto',
  '003': 'Teléfono incorrecto',
  '004': 'Asegurate que el nombre sea correcto.',
  '005': 'Asegurate que el apellido sea correcto.',
  '013': 'Asegurate de que el campo no esté vacío',
  '324': 'El documento es inválido.',
}

export type ValidationType = { isValid: boolean; errorMessage?: string };

const checkIfNotEmpty = (value = '') => (value !== '');
const checkIfHaveOnlyNumbers = (value = '') => /^[0-9]*$/.test(value);
const checkIfHaveNumber = (value: string):boolean => /\d/.test(value);
const checkMinLength = (value: string, minLength: number): boolean => (value.length < minLength);

export const validateNotEmptyField = (value: string): ValidationType => {
  if(checkMinLength(value, 2)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK013'],
    };
  }

  return {
    isValid: true,
    errorMessage: '',
  };
};

export const validateField = (value: string): ValidationType => {
  return {
    isValid: (value !== '' && !/^[A-Za-z]+$/i.test(value)) && true,
    errorMessage: '',
  };
};

export const validateEmptyField = (value: string): ValidationType => {
  if(new RegExp('^[a-zA-Z0-9\s_-]{1,}$').test(value)) {
    return {
      isValid: true,
      errorMessage: '',
    }
  }
  
  return {
    isValid: false,
    errorMessage: ERROR_CODES['013'],
  };
}

export const validateAmount = (monto = '', otherAmount = ''): boolean => {
  return !(monto === '' || (monto === 'otherAmount' && otherAmount === '')) ;
}

export const validateFirstName = (value = '', minLength = 2): ValidationType => {
  if(value === '') {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK012'],
    };
  } else if(checkMinLength(value, minLength)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK001'],
    };
  } else if (checkIfHaveNumber(value)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK002'],
    }
  }

  return {
    isValid: true,
    errorMessage: '',
  };
}

export const validateLastName = (value = '', minLength = 2): ValidationType => {
  if(value === '') {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK012'],
    };
  } else if(checkMinLength(value, minLength)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK003'],
    };
  } else if (checkIfHaveNumber(value)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK004'],
    }
  }

  return {
    isValid: true,
    errorMessage: '',
  };
}

export const validateAreaCode = (value = '', minLength = 2): ValidationType => {
  if(value === '') {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK012'],
    };
  } else if(checkMinLength(value, minLength)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK007'],
    };
  } else if (!checkIfHaveOnlyNumbers(value)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK011'],
    }
  }

  return {
    isValid: true,
    errorMessage: '',
  };
}

export const validatePhoneNumber = (value = '', minLength = 8): ValidationType => {
  if(value === '') {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK012'],
    };
  } else if(checkMinLength(value, minLength)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK008'],
    };
  } else if (!checkIfHaveOnlyNumbers(value)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK009'],
    }
  }

  return {
    isValid: true,
    errorMessage: '',
  };
}

export const validateCitizenId = (value: string, minLength = 8): ValidationType => {
  if(value === '') {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK012'],
    };
  } else if(checkMinLength(value, minLength)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK005'],
    };
  } else if (!checkIfHaveOnlyNumbers(value)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK010'],
    }
  }

  return {
    isValid: true,
    errorMessage: '',
  };
}

export const validateCreditCard = (value: string): ValidationType => {
  const isCreditCard = /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/;
  
  // const isVisa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  // const isMastercard = /^(?:5[1-5][0-9]{14})$/;
  // const isAmex = /^(?:3[47][0-9]{13})$/;
  // const isDiscover = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;

  if (!isCreditCard.test(value) || value === '') {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK014'], 
    };
  }

  // Force to validate the credit card since it's being validated by MercadoPago 
  return {
    isValid: true,
    errorMessage: '',
  };
}

export const validateCvv = (value: string): ValidationType => {
  if(value === '') {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK012'],
    };
  } else if (!(/^[0-9]{3,4}$/.test(value))) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK015'], 
    };
  }

  return {
    isValid: true,
    errorMessage: '',
  };
}

export const validateCardHolderName = (value = '', minLength = 2): ValidationType => {
  if(value === '') {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK012'],
    };
  } else if(checkMinLength(value, minLength)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['MP316'],
    };
  } else if (checkIfHaveNumber(value)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK002'],
    }
  }

  return {
    isValid: true,
    errorMessage: '',
  };
}

export const validateEmail = (value: string): ValidationType => {
  if(value === '') {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK012'],
    };
  } else if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value))) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK016'], 
    };
  }

  return {
    isValid: true,
    errorMessage: '',
  };
}

export const validateBirthDate = (value = ''): ValidationType => {
  return {
    isValid: moment(value, 'DD/MM/YYYY', true).isValid(),
    errorMessage: 'Error la fecha', 
  };
}

export const validateDateWithSlash = (value = ''): ValidationType => {
  return {
    isValid: moment(value, 'MM/YY', true).isValid(),
    errorMessage: 'Error la fecha',
  };
}

export const validateMonth = (value: string): ValidationType => {
  // if(value === '') {
  //   return {
  //     isValid: false,
  //     errorMessage: ERROR_CODES['SK012'],
  //   };
  // } else if (!validateEmptyField(value).isValid || parseInt(value) <= 0 || parseInt(value) >= 13) {    
  //   return {
  //     isValid: false,
  //     errorMessage: 'El mes es inválido.'
  //   }
  // }
  
  // Force to validate the credit card since it's being validated by MercadoPago 
  return {
    isValid: true,
    errorMessage: '',
  };
}

export const validateYear = (value: string): ValidationType => {
  if(value === '') {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK012'],
    };
  } else if (parseInt(value) < new Date().getFullYear()) {
    return {
      isValid: false,
      errorMessage: 'El año es inválido.'
    }
  }
  return {
    isValid: true,
    errorMessage: '', 
  };
}


/* Custom validators */
export const validateNewAmount = (value: string, minValue = 300): ValidationType => {
  if (!checkIfNotEmpty(value)) {
    return {
      isValid: false,
      errorMessage: '',
    };
  } else if (!checkIfHaveOnlyNumbers(value)) {
    return {
      isValid: false,
      errorMessage: 'El monto debe ser un valor númerico',
    }
  } else if(parseInt(value) < minValue){
    return {
      isValid: false,
      errorMessage: `El monto debe ser un mayor a ${minValue}`,
    }
  } else {
    return {
      isValid: true,
      errorMessage: '',
    };
  }
}

export const validateCustomRegExp = (regExp: string, value = '', errorMessage = ERROR_CODES['001']): ValidationType => {
  if(typeof value === 'string' && new RegExp(regExp).test(value.split(' ').length === 2 && value.split(' ')[1] === '' ? value.trim() : value)) {
    return {
      isValid: true,
      errorMessage: '',
    }
  } else if (new RegExp(regExp).test(value)) {
    return {
      isValid: true,
      errorMessage: '',
    }
  }

  return {
    isValid: false,
    errorMessage,
  };
}
