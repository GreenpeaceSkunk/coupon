import { AxiosResquestError } from 'greenpeace';
import { ApiCall } from '../utils/apiCall';
import { getApiUrl } from '../utils';

type PayUSuscribeResponse = {OK: boolean};

export const suscribe = async (data: any): Promise<any | AxiosResquestError> => {
  const response: any = await ApiCall({
    baseURL: `${process.env.REACT_APP_GREENPEACE_PAYU_API_URL}/inscripcion`,
    method: 'POST',
    data,
  });

  if(response.error) {
    return {
      error: true,
      message: (response.data.messages.length && response.data.validationErrors)
        ? Object.values(response.data.validationErrors).map((e: any) => `<strong>${e[0]}</strong>`)
        : response.data.messages[0],
      status: response.status,
    } as AxiosResquestError;
  }
  
  return {
    OK: true,
    status: 201,
  } as PayUSuscribeResponse;
};
