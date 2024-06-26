import React, { useContext, useState, useRef, useMemo, useEffect } from 'react';
import { css } from 'styled-components';
import Form from '../../../v1/Shared/Form';
import Elements from '../../../Shared/Elements';
import { Loader } from '../../../Shared';
import { AppContext } from '../../../App/context';
import { useNavigate } from 'react-router';
import { CheckoutFormContext } from '../context';
import { CouponType } from 'greenpeace';
import useQuery from '../../../../hooks/useQuery';
import { generatePath } from 'react-router';
import { suscribe } from '../../../../services/transbank';
import { Img } from '@bit/meema.ui-components.elements';
import { FormContext } from '../../context';
import { pixelToRem } from 'meema.utils';
import moment from 'moment';
import { Link } from 'react-router-dom';

const Component: React.FunctionComponent<{}> = () => {
  const checkoutFormRef = useRef<HTMLFormElement | any>();
  const { searchParams, urlSearchParams } = useQuery();
  const { appData } = useContext(AppContext);
  const [token, setToken] = useState<string>();
  const navigate = useNavigate();
  const {payment, user, params, dispatch } = useContext(CheckoutFormContext);
  const {error} = useContext(FormContext);

  useEffect(() => {
    (async () => {
      if(appData.features.payment_gateway.enabled && appData.features.payment_gateway.third_party) {
        const data = {
          nombre: user.firstName,
          apellido: user.lastName,
          rut: user.docNumber,
          email: user.email,
          prefijo: `${user.areaCode}`,
          telefono: user.phoneNumber,
          fechaNacimiento: moment(user.birthDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          pais: user.country,
          region: user.region,
          provincia: user.province,
          comuna: user.city,
          calle: user.address,
          numero: user.addressNumber,
          monto: payment.amount === 'otherAmount' ? payment.newAmount : payment.amount,
          utmCampaign: urlSearchParams.get('utm_campaign') || 'undefined',
          utmMedium: urlSearchParams.get('utm_medium') || 'undefined',
          utmSource: urlSearchParams.get('utm_source') || 'undefined',
          utmContent: urlSearchParams.get('utm_content') || 'undefined',
          utmTerm: urlSearchParams.get('utm_term') || 'undefined',
          tipoDonacion: params.couponType,
          titular: Boolean((+payment.isCardHolder)),
          tarjetaHabienteRut: payment.isCardHolder ? user.docNumber : payment.docNumber,
          tarjetaHabienteNombre: payment.isCardHolder ? `${user.firstName} ${user.lastName}` : payment.cardHolderName,
          response_url: window.location.origin + generatePath(`/coupon/:couponType/forms/checkout/transbank/confirm`, {
            couponType: params.couponType as CouponType,
          }),
          apiResponseUrlParams: searchParams || '',
        };

        const response = await suscribe(data);

        if(response.token && response.url_webpay) {
          // Save locally
          window.localStorage.setItem(`tbk_${response.token}`, JSON.stringify(data));

          setToken(response.token);

          if(checkoutFormRef.current) {
            const input = document.createElement('input');
            input.name = 'TBK_TOKEN';
            input.type = 'hidden';
            input.value = response.token;
            checkoutFormRef.current.append(input);
            checkoutFormRef.current.action = response.url_webpay;

            const timeout = setTimeout(() => {
              checkoutFormRef.current.submit();
            }, 1000);

            return () => {
              clearTimeout(timeout);
            }
          } 
        } else {
          dispatch({type: 'SET_ERROR', error: response.data});
        }
      } else {
        navigate({
          pathname: '/',
          search: `${searchParams}`,
        });
      }
    })();
  }, [ user, payment ]);

  return useMemo(() => (
    <Elements.Wrapper
      customCss={css`
        padding: ${pixelToRem(40)} ${pixelToRem(20)};
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <Img src={`${process.env.PUBLIC_URL + '/images/transbank-webpay.png'}`} width='300px' height='auto' />
      {!error ? (
        <>
          <Elements.Span
            customCss={css`
              margin: ${pixelToRem(60)} 0;
            `}
          >{token ? 'Redireccionando' : 'Obteniendo información de Transbank'}<Loader/></Elements.Span>
        </>
      ) : (
        <>
          <Elements.Span
            customCss={css`
              margin: ${pixelToRem(60)} 0;
              text-align: center;
            `}
          >No se pudo generar el token<br/>Por favor revisa los siguientes errores:</Elements.Span>
            {Object.keys(error).map((err: string, idx: number) =>
              <Elements.Span
                key={idx}
                customCss={css`
                  color: ${({theme}) => theme.color.error.normal};
                  font-size: ${pixelToRem(14)};
                  text-align: center;
                  margin-bottom: ${pixelToRem(14)};
                `}
              >{err}</Elements.Span>
            )}
          <Link to={generatePath(`/:couponType/forms/registration`, {
            couponType: params.couponType as CouponType,
          }) + searchParams}>Volver</Link>
        </>
      )}
      <Form.Main ref={checkoutFormRef} method="POST" />
    </Elements.Wrapper>
  ), [
    checkoutFormRef,
    appData,
    token,
    payment,
    user,
    error,
  ]);
}

Component.displayName = 'TransbankCheckoutForm';
export default Component;
