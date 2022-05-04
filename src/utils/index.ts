export const parseAmount = (value1?: string, value2?: string) => {
  return (value1 === 'otherAmount') ? value2 : value1;
}

export const addOrRemoveSlashToDate = (value: string):string => {
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
      return (value.length > 10) ? value.slice(0, 10) : value;
    }
  }
};

export const getAppName = (pathname: string) => {
  const paths = pathname.split('/').filter((a: string) => a !== "" );
  console.log(paths, paths.length ? paths[0].replaceAll('/', '') : 'default')
  return paths.length ? paths[0].replaceAll('/', '') : 'default';
} 

export const getDesignVersion = () => {
  // return (window.sessionStorage.greenlab_app_design_version !== "undefined")
  //   ? window.sessionStorage.greenlab_app_design_version
  //   : 2;
  return 1;
};
