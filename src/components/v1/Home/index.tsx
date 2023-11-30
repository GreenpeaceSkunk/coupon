import React, { useMemo, lazy, Suspense, memo, useRef, useContext, MouseEvent } from 'react';
import Elements from '../../Shared/Elements';
import Shared from '../../Shared';
import styled, { css } from 'styled-components';
import { pixelToRem } from 'meema.utils';
import ErrorBoundary from '../../ErrorBoundary';
import { AppContext } from '../../App/context';
import ModalOpenForm from '../ModalOpenForm';
import { Outlet } from 'react-router';

const Header = lazy(() => import('../Header'));
const Footer = lazy(() => import('../../Footer'));

const Component: React.FunctionComponent<{}> = memo(() => {
  const viewRef = useRef<HTMLElement>(null);
  const { appData, setIsOpen } = useContext(AppContext);

  return useMemo(() => (
    <>
      <Elements.View
        ref={viewRef}
        customCss={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 100vh;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;

          @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
            flex-direction: row;
          }
        `}
      >
        <Elements.Wrapper
          customCss={css`
            position: relative;
            display: flex;
            flex-direction: column;
            width: 100%;
            min-height: 100vh;
            transition: all 250ms ease;

            @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
              min-height: 100vh;
              padding-bottom: 0;
              display: flex;
            }
          `}
        >
          <ErrorBoundary fallback='Header Error.'>
            <Suspense fallback={<Shared.Loader />}>
              <Header />
            </Suspense>
          </ErrorBoundary>

          <Elements.Wrapper
            customCss={css`
              display: flex;
              flex-direction: column;
              width: 100%;
              padding: 0;
            `}
          >
            <Elements.Wrapper
              customCss={css`
                padding: ${pixelToRem(30)} ${pixelToRem(40)};

                > * {
                  margin-bottom: ${pixelToRem(28)};

                  &:last-child {
                    margin-bottom: 0;
                  }
                }

                @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
                  padding-right: ${pixelToRem(70)};
                }
              `}
            >
              <Elements.H1
                customCss={css`
                  color: ${({theme}) => theme.color.secondary.dark};
                  font-size: ${pixelToRem(20)};
                  font-family: ${({theme}) => theme.font.family.primary.bold};
                  line-height: 1.2;
                  
                  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
                    font-size: ${pixelToRem(24)};
                  }
                `}
              >{appData && appData.content && appData.content.home?.title}</Elements.H1>
              <Elements.WrapperHtml
                customCss={css`
                  color: ${({theme}) => theme.color.secondary.dark};
                  font-size: ${pixelToRem(18)};
                  line-height: 140%;
                `}
                dangerouslySetInnerHTML={{__html: appData && appData.content && appData.content.home?.text }}
              />
              <Elements.Span
                customCss={css`
                  font-family: ${({theme}) => theme.font.family.primary.bold};
                  font-size: ${pixelToRem(18)};
                  color: ${({theme}) => theme.color.primary.normal};

                  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
                    font-size: ${pixelToRem(24)};
                  }
                `}
              >{appData && appData.content && appData.content.home?.highlighted_text}</Elements.Span>
              <Elements.Button
                onClick={(evt: MouseEvent<HTMLButtonElement>) => {setIsOpen(true)}}
                customCss={css`
                  width: 100%;
                  box-shadow: 0 ${pixelToRem(4)} ${pixelToRem(14)} rgba(0, 0, 0, .25);
                  margin: ${pixelToRem(20)} 0;

                  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
                    display: none;
                  }
                `}
              >{appData && appData.content && appData.content.home?.button_text}</Elements.Button>
            </Elements.Wrapper>
          </Elements.Wrapper>
        </Elements.Wrapper>
        <Elements.Wrapper
          customCss={css`
            position: relative;
            flex-shrink: 0;
            flex-grow: 0;
            width: 100vw;

            @media (min-width: ${({theme}) => pixelToRem(theme.responsive.screen.medium.minWidth)}) {
              width: 50vw;
            }

            @media (min-width: ${({theme}) => pixelToRem(theme.responsive.screen.extraLarge.minWidth)}) {
              width: ${pixelToRem(600)};
            }
          `}
        >
          <Outlet />
        </Elements.Wrapper>
      </Elements.View>
      <ErrorBoundary fallback='Footer Error.'>
        <Suspense fallback={<Shared.Loader />}>
          <Elements.Wrapper>  
            <Footer />
          </Elements.Wrapper>
        </Suspense>
      </ErrorBoundary>
      <ModalOpenForm />
    </>
  ), [
    viewRef,
    appData,
    setIsOpen,
  ]);
});

Component.displayName = 'Home';
export default Component;
