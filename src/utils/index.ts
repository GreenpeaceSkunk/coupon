export const getApiUrl = (): string => {
  return (`${process.env.REACT_APP_ENVIRONMENT}` === 'development')
    ? `${process.env.REACT_APP_GREENLAB_API_URL}`
    : `${window.location.origin}${process.env.REACT_APP_GREENLAB_API_URL}`;
}

export const getApiImagesUrl = (): string => {
  return (`${process.env.REACT_APP_ENVIRONMENT}` === 'development')
    ? `${process.env.REACT_APP_GREENLAB_API_IMAGES}`
    : `${window.location.origin}${process.env.REACT_APP_GREENLAB_API_IMAGES}`;
}
 
export const parseAmount = (value1?: string, value2?: string) => {
  return (value1 === 'otherAmount') ? value2 : value1;
}

export const addOrRemoveSlashToDate = (value: string, maxLength = 10):string => {
  if(value.length >= maxLength) {
    return value;
  }

  const lastChart = value.charAt(value.length - 1);
  
  switch(value.length) {
    case 2: {
      return `${value}/`;
    }
    case 3: {
      if(lastChart === '/') {
        return `${value.slice(0, 2)}`;
      } else {
        return `${value.slice(0, 2)}/${value.charAt(2)}`;
      }
    }
    case 5: {
      if(lastChart !== '/') {
        return `${value.slice(0, 6)}/${value.charAt(5)}`;
      }
      return value;
    }
    case 6: {
      if(lastChart === '/') {
        return `${value.slice(0, 5)}`;
      } else {
        return `${value.slice(0, 5)}/${value.charAt(5)}`;
      }
    }

    default: {
      return (value.length > maxLength) ? value.slice(0, maxLength) : value;
    }
  }
};

export const getAppName = (pathname: string) => {
  const paths = pathname.split('/').filter((a: string) => a !== "" );
  return paths.length ? paths[0].replaceAll('/', '') : 'default';
} 

export const getDesignVersion = (version?: number) => {
  const designVersion = (`${window.sessionStorage.greenlab_app_design_version}` !== "undefined")
  ? window.sessionStorage.greenlab_app_design_version
  : 1;
  return `${designVersion}`;
};

/**
 * Take the coupon name as a parameter.
 * If not coupon has been set, then return the base url.
 * @returns string
 */
export const getCouponUrl = ():string => {
  if(/app=/.test(document.location.search)) {
    return `${document.location.origin}${document.location.pathname}?${document.location.search.slice(document.location.search.indexOf("app=")).split("&")[0]}`;
  }

  return `${document.location.origin}${document.location.pathname}`;
}
