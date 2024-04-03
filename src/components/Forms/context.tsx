import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { ContextActionType, FormSharedType, initialState, reducer } from './reducer';
import { IData, ParamsType, ProvinceType } from 'greenpeace';
import { useParams } from 'react-router-dom';
import { AppContext } from '../App/context';
import { RegionType } from '../../types';

export interface IContext {
  data: IData;
  shared: FormSharedType;
  params: ParamsType;
  allowNext: boolean;
  submitted: boolean;
  submitting: boolean;
  error: string | null;
  dispatch: (action: ContextActionType) => void;
}

interface IProps {
  children: React.ReactNode | HTMLAllCollection;
}

const Context = createContext({} as IContext);
Context.displayName = 'FormContext';
const { Provider, Consumer } = Context;

const ContextProvider: React.FunctionComponent<IProps> = ({ children }) => {
  const [{ data, shared, allowNext, error, submitted, submitting }, dispatch] = useReducer(reducer, initialState);
  const {appData} = useContext(AppContext);
  const params = useParams<ParamsType>();

  useEffect(() => {
    (async () => {
      if(appData.settings.general.form_fields.registration.location.country.show) {
        dispatch({
          type: 'SET_SHARED_FORM_FIELDS',
          payload: {
            countries: (await (await fetch(`${process.env.REACT_APP_GREENLAB_API_URL}/location/world/countries`)).json()),
          },
        });
      }
    })()
  }, [appData]);

  useEffect(() => {
    if(data.user.province) {
      const province = shared.provinces?.find((province: ProvinceType) => province.code === data.user.province);
      const region = shared.regions?.find((region: RegionType) => region.provinces.find((prv: ProvinceType) => {
        if(data.user.province === prv.code) {
          return prv.code;
        }
      }));
      
      dispatch({
        type: 'SET_SHARED_FORM_FIELDS',
        payload: {
          cities: province ? province.cities : [],
        },
      });

      dispatch({
        type: 'UPDATE_USER_DATA',
        payload: { 
          region: region?.code || '',
          city: '',
        },
      });
    }
  }, [ data.user.province ])

  useEffect(() => {
    (async () => {
      if(data.user.country && appData.settings.general.form_fields.registration.location.province.show) {
        const countryData = (await (await fetch(`${process.env.REACT_APP_GREENLAB_API_URL}/location/world/countries/${data.user.country}`)).json());
        dispatch({
          type: 'SET_SHARED_FORM_FIELDS',
          payload: {
            regions: countryData.regions,
            provinces: countryData.regions.map((region: RegionType) => region.provinces).flatMap((province: ProvinceType) => province),
          },
        });
      }
    })();
  }, [appData, data.user.country]);

  return useMemo(() => (
    <Provider
      value={{
        data,
        shared,
        params,
        allowNext,
        submitted,
        submitting,
        error,
        dispatch,
      }}>
        {children}
      </Provider>
  ), [
    appData,
    data,
    shared,
    params,
    allowNext,
    submitted,
    submitting,
    error,
    children,
    dispatch,
  ]);
};

export {
  ContextProvider as FormProvider,
  Consumer as FormConsumer,
  Context as FormContext,
}
