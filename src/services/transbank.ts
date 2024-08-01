import { AxiosResquestError } from 'greenpeace';
import { ApiCall } from '../utils/apiCall';
import { getApiUrl } from '../utils';

type TransbankSuscribeResponse = {token: string; url_webpay: string};

export const suscribe = async (data: any): Promise<any | AxiosResquestError> => {
  const response: any = await ApiCall({
    baseURL: `${getApiUrl()}/payment-gateway/transbank/create`,
    method: 'POST',
    data,
  });
  console.log(response)

  if(response.error) {
    return {
      error: true,
      message: response.message ? response.message : 'Undefined error',
      status: response.status,
    } as AxiosResquestError;
  }

  return {
    token: response.token,
    url_webpay: response.url_webpay,
  } as TransbankSuscribeResponse;
};

export const confirm = async (data: {token: string}): Promise<any | AxiosResquestError> => {
  const response: any = await ApiCall({
    baseURL: `${getApiUrl()}/payment-gateway/transbank/confirm?token=${data.token}`,
    method: 'POST',
    data: {},
  });

  if(response.error) {
    return {
      message: response.data.errorMessage,
      status: response.status,
      error: response.error,
      data: response.data.data,
    } as AxiosResquestError;
  }

  return {
    status: 200,
    OK: true,
  };
};
