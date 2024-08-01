import React, { useContext, useEffect, useMemo, useState } from "react"
import useQuery from "../../../../../hooks/useQuery";
import { confirm } from "../../../../../services/transbank";
import { useNavigate, generatePath } from "react-router";
import { CheckoutFormContext } from "../../context"
import Elements from '../../../../Shared/Elements';
import { pixelToRem } from "meema.utils";
import { Loader } from "../../../../Shared";
import { css } from "styled-components";
import { postRecord } from "../../../../../services/greenlab";
import { AppContext } from "../../../../App/context";

const Component: React.FunctionComponent<{}> = () => {
  const { urlSearchParams } = useQuery();
  const { appData } = useContext(AppContext);
  const { params } = useContext(CheckoutFormContext);
  const navigate = useNavigate();
  const [paymentErrorMessage, setPaymentErrorMessage] = useState<string>();
  const [paymentError, setPaymentError] = useState<boolean>(false);
  
  useEffect(() => {
    (async () => {
      const tbkToken = urlSearchParams.get('TBK_TOKEN') || '';
      const urlParams = new URLSearchParams(window.location.search);

      // Get data from local and remove it
      let localData: any = window.localStorage.getItem(`tbk_${tbkToken}`);
      if(typeof localData === 'string') {
        localData = JSON.parse(localData);
      }

      const response = await confirm({ token: tbkToken });

      if(response.error) {
        setPaymentError(true);
        setPaymentErrorMessage(response.message);
        if(response.data.donationRef) {
          console.log(response.data.donationRef)
          urlParams.set('donation', response.data.donationRef);
        }
      } else {
        window.localStorage.removeItem(`tbk_${tbkToken}`);

        if(urlParams.get('TRANSACCION_ID')) {
          urlParams.delete('TRANSACCION_ID');
        }
      }
      
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      /* Backup to Forma. */
      if(appData?.settings?.services?.forma?.form_id) {
        await postRecord(
          {
            address: `${localData.calle} ${localData.numero}`,
            amount: localData.monto,
            appUiVersion: appData.features.use_design_version,
            appName: appData.name,
            areaCode: localData.prefijo,
            birthDate: localData.fechaNacimiento,
            campaignId: appData?.settings?.tracking?.salesforce?.campaign_id,
            cardDocNumber: localData.tarjetaHabienteRut,
            cardDocType: 'RUT',
            cardHolderName: localData.tarjetaHabienteNombre,
            country: localData.pais,
            city: localData.comuna,
            province: localData.provincia,
            region: localData.region,
            couponType: params.couponType ?? 'regular',
            docNumber: localData.rut,
            docType: 'RUT',
            email: localData.email,
            firstName: localData.nombre,
            fromUrl: document.location.href,
            genre: '',
            lastName: localData.apellido,
            mobileNumber: '',
            phoneNumber: localData.telefono,
            recurrenceDay: tomorrow.getDate(),
            urlQueryParams: localData.apiResponseUrlParams,
            userAgent: window.navigator.userAgent.replace(/;/g, '').replace(/,/g, ''),
            utmCampaign: localData.utmCampaign,
            utmMedium: localData.utmMedium,
            utmSource: localData.utmSource,
            utmContent: localData.utmContent,
            utmTerm: localData.utmTerm,
            zipCode: '',
            txnDate: today,
            txnErrorCode: '',
            txnErrorMessage: response.status === 400 ? response.message : '',
            txnStatus: response.status === 400 ? 'pending' : 'done',
            txnType: "transbank",
            tbkToken,
          },
          appData?.settings?.services?.forma?.form_id,
        );
      }

      const timer = setTimeout(() => {
        navigate({
          pathname: generatePath(response.error ? `/:couponType/forms/registration` : '/:couponType/forms/thank-you', {
            couponType: `${params.couponType}`,
          }),
          search: urlParams.toString(),
        }, { replace: true});
      }, response.error ? 5000 : 1000);

      return () => {
        clearTimeout(timer);
      }
    })();
  }, []);

  return useMemo(() => (
    <Elements.Wrapper
      customCss={css`
        padding: ${pixelToRem(40)} ${pixelToRem(20)};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      `}
    >
      <Elements.Img src={`${process.env.PUBLIC_URL + '/images/transbank-webpay.png'}`} width='300px' height='auto' />
      {paymentError ? (
        <Elements.Span
          customCss={css`
            margin: ${pixelToRem(60)} 0;
            text-align: center;
            color: ${({theme}) => theme.color.error.normal};
          `}
        >{paymentErrorMessage}.<br/>Por favor intente nuevamente.</Elements.Span>
      ) : (
        <Elements.Span
          customCss={css`
            margin: ${pixelToRem(60)} 0;
            text-align: center;
          `}
        >Confirmando el pago, aguarde un momento<Loader/></Elements.Span>
      )}
    </Elements.Wrapper>
  ), [
    paymentError,
    paymentErrorMessage,
  ]);
}

Component.displayName = 'TransbankConfirmPayment';
export default Component;
