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
    if(shared.cities && shared.cities.length && appData.settings.general.form_fields.registration.location.city?.default) {
      dispatch({
        type: 'UPDATE_FIELD',
        payload: { ['city']: appData.settings.general.form_fields.registration.location.city.default }
      });
    }
  }, [shared.cities])

  useEffect(() => {
    if(data.user.province !== '') {
      const region = shared.regions?.find((region: RegionType) => region.provinces.find((prv: ProvinceType) => {
        if(data.user.province === prv.code) {
          return prv.code;
        }
      }));
      const province = shared.provinces?.find((province: ProvinceType) => province.code === data.user.province);

      dispatch({
        type: 'UPDATE_USER_DATA',
        payload: { 
          region: region?.code || '',
          city: '',
        },
      });

      dispatch({
        type: 'SET_SHARED_FORM_FIELDS',
        payload: {
          cities: province ? province.cities : [],
        },
      });
    }
  }, [ data.user.province ])

  useEffect(() => {
    (async () => {
      if(appData && data.user.country !== '') {
        const countryData = (await (await fetch(`${process.env.REACT_APP_GREENLAB_API_URL}/location/world/countries/${data.user.country}`)).json());

        if(countryData.regions) {
          dispatch({
            type: 'SET_SHARED_FORM_FIELDS',
            payload: {
              regions: countryData.regions,
              provinces: countryData.regions.map((region: RegionType) => region.provinces).flatMap((province: ProvinceType) => province),
            },
          });

          // Set default fields
          if(appData.settings.general.form_fields.registration.location.province?.default) {
            dispatch({
              type: 'UPDATE_FIELD',
              payload: { ['province']: appData.settings.general.form_fields.registration.location.province.default }
            });
          }
        }

        if(appData.settings.general.form_fields.registration.area_code?.default) {
          dispatch({
            type: 'UPDATE_FIELD',
            payload: { ['areaCode']: appData.settings.general.form_fields.registration.area_code.default }
          });
        }
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
