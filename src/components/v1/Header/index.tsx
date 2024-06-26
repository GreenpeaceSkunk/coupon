import React, { FunctionComponent, useContext, useEffect, useMemo, useRef } from 'react';
import Elements from '../../Shared/Elements';
import { pixelToRem, CustomCSSType } from 'meema.utils';
import { css } from 'styled-components';
import { Logo } from '../../Shared';
import { AppContext } from '../../App/context';

const MainHeader: FunctionComponent<{
  customCss?: CustomCSSType;
}> = ({
  customCss,
}) => {
  const { appData } = useContext(AppContext);

  return useMemo(() => (
    <Elements.Header
      customCss={css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: ${pixelToRem(40)};
        width: 100%;
        min-height: ${({theme}) => pixelToRem(theme.header.mobile.height)};
        background-color: ${appData.content.header.banner?.background_color};
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        transition: all 250ms ease;

        ${appData.content.header?.banner ? css`
          ${(appData.content.header?.banner?.type === "image") && `
            background-image: linear-gradient(
              0deg,
              rgba(0, 0, 0, .75) 0%,
              rgba(0, 0, 0, 0) 100%),
              url(${process.env.REACT_APP_GREENLAB_API_IMAGES}/${appData.content.header.banner.url});
          `}

          ${(appData.content.header?.banner?.type === "video") && css`
            padding: ${pixelToRem(0)};ç
          `};
        ` : `
            background-image: linear-gradient(
              0deg,
              rgba(0, 0, 0, .75) 0%,
              rgba(0, 0, 0, 0) 100%),
              url(${process.env.REACT_APP_GREENLAB_API_IMAGES}/${appData.content.header.picture});
        `};
  
        @media (min-width: ${({theme}) => pixelToRem(theme.responsive.tablet.minWidth)}) {
          min-height: ${({theme}) => pixelToRem(theme.header.tablet.height)};
        }
        
        @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
          min-height: ${({theme}) => pixelToRem(theme.header.desktop.height)};
        }

        ${customCss && customCss};
      `}
    >
      <Elements.Wrapper>
        {appData && appData.content && appData.content.header.logo.show !== false && (
          <Logo color={appData.content.header.logo.color}/>
        )}
      </Elements.Wrapper>
      {(appData.content.header?.banner?.type === "video") && (
        <Elements.Wrapper
          customCss={css`
            width: 100%;

            video {
              width: 100%;
            }
          `}
        >
          <video autoPlay={true} muted={true} loop={true} playsInline={true} preload='auto'>
            <source src={`${process.env.REACT_APP_GREENLAB_API_IMAGES}/${appData.content.header.banner.url}`} />
            Your browser does not support MP4 Format videos or HTML5 Video.
          </video>
        </Elements.Wrapper>
      )}
      <Elements.Wrapper
        customCss={css`
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          width: 100%;
        `}
      >
        <Elements.HGroup
          customCss={css`
            @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
              padding-right: ${pixelToRem(10)};
            }
          `}
        >
          {appData.content.header.title && (
            <Elements.H1
              customCss={css`
                color: white;
                font-size: ${pixelToRem(24)};
                font-family: ${({theme}) => theme.font.family.primary.bold};
                letter-spacing: ${pixelToRem(0)};
                
                @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
                  font-size: ${pixelToRem(30)};
                }
              `}
            >{appData.content.header.title}</Elements.H1>
          )} 
        </Elements.HGroup>
      </Elements.Wrapper>
    </Elements.Header>
  ), [
    customCss,
    appData,
  ])
};

export default MainHeader;
