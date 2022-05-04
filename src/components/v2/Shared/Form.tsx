import React, { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { pixelToRem, CustomCSSType } from 'meema.utils';
import { OnChangeEvent, OnClickEvent } from 'greenpeace';
import { ValidationType } from '../../../utils/validators';
import Icons from '../../../images/icons';
import Elements from '../../Shared/Elements';

/**
 * Defines margin right and left. Also resets margins at first and last child.
 * @param marginRight Margin Right
 * @param marginLeft Margin Right
 * @returns 
 */
 const innerMargin = (marginRight: number, marginLeft: number) => css`
 margin-right: ${pixelToRem(marginRight)};
 
 &:last-child {
   margin-right: 0;
 }
`;

const Main = styled(Elements.Form)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-shrink: 0;
  flex-basis: 100%;
  width: 100%;
  height: 100vh;
  overflow-y: scroll;

  @media (min-width: ${({ theme }) => pixelToRem(theme.responsive.tablet.minWidth)}) {
    padding-bottom: 0; 
  }

  ${({customCss}) => (customCss) && customCss};
`;

const Content = styled(Elements.Wrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Header = styled(Elements.Header)`
  margin-bottom: ${pixelToRem(14)};
`;

const Nav: React.FunctionComponent<{
  children?: React.ReactNode | HTMLAllCollection;
  customCss?: CustomCSSType;
  formIndex?: number;
}> = ({
  children,
  customCss,
  formIndex = 0,
}) => {
  return useMemo(() => (
    <Elements.Nav
      customCss={css`
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        align-self: flex-end;
        justify-self: flex-end;
        width: 100%;
        
        ${customCss && customCss};
      `}
    >
      {children}
    </Elements.Nav>
  ), [
    children,
    customCss,
    formIndex,
  ]);
}

const Title = styled(Elements.H2)`
  color: ${({theme}) => theme.color.secondary.dark};
  font-size: ${pixelToRem(24)};
  font-family: ${({theme}) => theme.font.family.primary.bold};
  line-height: 1.2;

  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.tablet.minWidth)}) {
    font-size: ${pixelToRem(36)};
  }
  
  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
    font-size: ${pixelToRem(48)};
  }
`;

const TextArea = styled(Elements.TextArea)`
  border: none;
  overflow: auto;
  outline: none;
  resize: none; 
  height: ${pixelToRem(100)};
  padding: ${pixelToRem(10)};
  background-color: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, .05);
  font-family: ${({theme}) => theme.font.family.primary.normal};
  border-radius: ${pixelToRem(5)};

  &:disabled {
    opacity: .5;
  }
`;

const SelectableButton: React.FunctionComponent<{
  name: string;
  value: string;
  text: string;
  checkedValue: string;
  customCss?: CustomCSSType;
  onClickHandler: (evt: OnClickEvent) => void;
}> = ({
  name,
  value,
  text,
  checkedValue,
  customCss,
  onClickHandler,
}) => {
  return useMemo(() => (
    <>
    <Elements.Button
      name={name}
      onClick={onClickHandler}
      value={value}
      customCss={css`
        background: white;
        color: ${({theme}) => theme.text.color.primary.normal};
        border-color: ${({theme}) => theme.color.secondary.normal};
        border-width: ${pixelToRem(1)} !important;
        width: fit-content;
        font-size: ${pixelToRem(14)};

        &:hover {
          background: white;
          border-color: ${({theme}) => theme.color.primary.normal};
        }

        &:not(last-child) {
          margin-right: ${pixelToRem(10)};
        }

        ${(checkedValue === value) && css`
          background: ${({theme}) => theme.color.primary.normal} !important;
          border-color: ${({theme}) => theme.color.primary.normal};
          color: white !important;
        `}
      `}
    >
      {text}
    </Elements.Button>
    {/* <Elements.Label
      customCss={css`
        display: inline-flex;
        align-items: center;
        width: fit-content;
        cursor: pointer;
        margin-bottom: ${pixelToRem(10)};
        user-select: none;
        text-align: left;
        font-family: ${({theme}) => theme.font.family.primary.regular};
        font-size: ${pixelToRem(15)};
        
        ${(customCss) && customCss};
      `}
    >
      <Elements.Input
        type='radio'
        name={name}
        value={value}
        checked={(checkedValue === value)}
        data-text={text}
        onChange={onChangeHandler}
        customCss={css`
          position: absolute;
          width: ${pixelToRem(20)};
          opacity: 0;
          cursor: pointer;
          z-index: 1;
        `}
      />
      <Elements.Wrapper
        customCss={css`
          flex: 0 0 ${pixelToRem(20)};
          width: ${pixelToRem(20)};
          height: ${pixelToRem(20)};
          border-radius: ${pixelToRem(2)};
          background-color: white;
          border: solid ${pixelToRem(1)} ${({theme}) => theme.color.secondary.normal};
          margin-right: ${pixelToRem(10)};

          ${(checkedValue === value) && css`
            border-color: ${({theme}) => theme.color.primary.normal};
            background-color: ${({theme}) => theme.color.primary.normal};
            border-width: ${pixelToRem(4)};

            &:after {
              flex: 0 0 auto;
              width: ${pixelToRem(12)};
              height: ${pixelToRem(12)};
              background-size: ${pixelToRem(12)} ${pixelToRem(12)};
              background-position: center center;
              background-repeat: no-repeat;
              transform-origin: center;
              background-image: url(${Icons.TickIcon});
              position: absolute;
              content: "";
            }
          `}
        `}
      />
      {text}
    </Elements.Label> */}
    </>
  ), [
    name,
    value,
    text,
    checkedValue,
    customCss,
    onClickHandler,
  ]);
};

const RadioButton: React.FunctionComponent<{
  name: string;
  value: string;
  text: string;
  checkedValue: string;
  customCss?: CustomCSSType;
  onChangeHandler: (evt: OnChangeEvent) => void;
}> = ({
  name,
  value,
  text,
  checkedValue,
  customCss,
  onChangeHandler,
}) => {
  return useMemo(() => (
    <Elements.Label
      customCss={css`
        display: inline-flex;
        align-items: center;
        width: fit-content;
        cursor: pointer;
        margin-bottom: ${pixelToRem(10)};
        user-select: none;
        text-align: left;
        font-family: ${({theme}) => theme.font.family.primary.regular};
        font-size: ${pixelToRem(15)};
        
        ${(customCss) && customCss};
      `}
    >
      <Elements.Input
        type='radio'
        name={name}
        value={value}
        checked={(checkedValue === value)}
        data-text={text}
        onChange={onChangeHandler}
        customCss={css`
          position: absolute;
          width: ${pixelToRem(20)};
          opacity: 0;
          cursor: pointer;
          z-index: 1;
        `}
      />
      <Elements.Wrapper
        customCss={css`
          flex: 0 0 ${pixelToRem(20)};
          width: ${pixelToRem(20)};
          height: ${pixelToRem(20)};
          border-radius: ${pixelToRem(2)};
          background-color: white;
          border: solid ${pixelToRem(1)} ${({theme}) => theme.color.secondary.normal};
          margin-right: ${pixelToRem(10)};

          ${(checkedValue === value) && css`
            border-color: ${({theme}) => theme.color.primary.normal};
            background-color: ${({theme}) => theme.color.primary.normal};
            border-width: ${pixelToRem(4)};

            &:after {
              flex: 0 0 auto;
              width: ${pixelToRem(12)};
              height: ${pixelToRem(12)};
              background-size: ${pixelToRem(12)} ${pixelToRem(12)};
              background-position: center center;
              background-repeat: no-repeat;
              transform-origin: center;
              background-image: url(${Icons.TickIcon});
              position: absolute;
              content: "";
            }
          `}
        `}
      />
      {text}
    </Elements.Label>
  ), [
    name,
    value,
    text,
    checkedValue,
    customCss,
    onChangeHandler,
  ]);
};

const Row = styled(Elements.Wrapper)`
  display: flex;
  flex-direction: column;

  @media (min-width: ${({ theme }) => pixelToRem(theme.responsive.tablet.minWidth)}) {
    flex-direction: row;
  }

  > * {
    width: 100%;
    margin-bottom: ${pixelToRem(10)};
  }
`;

const Column: React.FunctionComponent<{
  children?: React.ReactNode | HTMLAllCollection;
  bottomText?: string;
  customCss?: CustomCSSType;
}> = ({
  children,
  bottomText,
  customCss,
}) => (
  <Elements.Wrapper customCss={css`
    &:not(:last-child) {
      margin-right: ${pixelToRem(20)};
    }
  `}>
    <Elements.Wrapper
      customCss={css`
      display: flex;
      width: 100%;
    
      @media (min-width: ${({ theme }) => pixelToRem(theme.responsive.tablet.minWidth)}) {
        flex-direction: row;
      }

      ${customCss && customCss};
    `}
    >
      {children}
    </Elements.Wrapper>
    {(bottomText) && (
      <Elements.Span
        customCss={css`
          font-size: ${pixelToRem(15)};
        `}
      >{bottomText}</Elements.Span>
    )}
  </Elements.Wrapper>
);

const Group: React.FunctionComponent<{
  children?: React.ReactNode | HTMLAllCollection;
  fieldName: string;
  labelText?: string;
  labelBottomText?: string;
  value?: string|number;
  showErrorMessage?: boolean;
  isRequired?: boolean;
  customCss?: CustomCSSType;
  maxLength?: number;
  validateFn?: (value: any, maxLength?: number) => ValidationType;
  onUpdateHandler?: (fieldName: string, isValid: boolean, value?: string|number) => void;
}> = ({
  children,
  fieldName,
  labelText,
  labelBottomText,
  showErrorMessage = false,
  isRequired = false,
  value = '',
  customCss,
  maxLength,
  validateFn,
  onUpdateHandler,
}) => {
  const [ isValid, setIsValid ] = useState<boolean>(false);
  const [ errorMessage, setErrorMessage ] = useState<string>('');

  useEffect(() => {
    if(validateFn) {
      let validator: ValidationType;  
      if(maxLength) {
        validator = validateFn(value, maxLength);
      } else {
        validator = validateFn(value);
      }

      if(validator) {
        setIsValid(validator.isValid);
        setErrorMessage(validator.errorMessage ? validator.errorMessage : '');
        
        if(onUpdateHandler && fieldName) {
          onUpdateHandler(fieldName, validator.isValid, value);
        }
      }
    }
  }, [
    maxLength,
    showErrorMessage,
    fieldName,
    value,
    isValid,
    validateFn,
    onUpdateHandler,
  ]);

  return useMemo(() => (
    <Elements.Wrapper
      className='group-block'
      customCss={css`
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 100%;

        &:not(:last-child) {
          margin-right: ${pixelToRem(10)};
        }
        
        &:after {
          width: 100%;
          margin-top: ${pixelToRem(10)};
          font-size: ${pixelToRem(15)};
          font-family: ${({theme}) => theme.font.family.primary.regular};
          color: ${({theme}) => theme.color.error.normal};
          text-align: left;
          content: "${(!isValid && showErrorMessage && errorMessage) ? errorMessage : ""}";
        }
  
        input[type="text"], input[type="email"], textarea, select {
          width: 100%;
  
          ${(value === '') && css`
            border-color: ${({theme}) => theme.color.secondary.normal};
          `}
          
          ${(showErrorMessage && !isValid) && css`
            border-color: ${({theme}) => theme.color.error.normal};
          `}
        }

        ${(customCss) && customCss};
      `}
    >
      {labelText && (
        <Elements.Label
          htmlFor={fieldName}
          customCss={css`
            text-align: left;
            font-family: ${({theme}) => theme.font.family.primary.regular};
            margin-bottom: ${pixelToRem(6)};

            ${isRequired && css`
              &:after {
                content: "*";
                color: ${({theme}) => theme.color.error.normal};
              }
            `}
          `}
        >{labelText}</Elements.Label>
      )}
      {children}
      {(labelBottomText) ? (
        <Elements.Label
          customCss={css`
            font-size: ${pixelToRem(14)};
            margin-top: ${pixelToRem(4)};
            text-align: left;
            font-family: ${({theme}) => theme.font.family.primary.regular};
          `}
        >{labelBottomText}</Elements.Label>
      ) : null}
    </Elements.Wrapper>
  ), [
    errorMessage,
    children,
    fieldName,
    labelText,
    labelBottomText,
    showErrorMessage,
    value,
    customCss,
    isValid,
  ]);
};

const Label = styled(Elements.Label)`
  position: relative;
  width: 100%;
`;


const ErrorMessage = styled(Elements.Wrapper)`
  display: flex;
  align-items: center;
  padding: ${pixelToRem(12)};
  border-radius: ${pixelToRem(5)};
  background-color: ${({theme}) => theme.color.error.normal};
  color: white;
  margin-top: ${pixelToRem(18)};
  font-family: ${({theme}) => theme.font.family.primary.regular};

  &:before {
    flex: 0 0 auto;
    width: ${pixelToRem(20)};
    height: ${pixelToRem(20)};
    background-size: ${pixelToRem(20)} ${pixelToRem(20)};
    background-position: center center;
    background-repeat: no-repeat;
    transform-origin: center;
    background-image: url(${Icons.WarningIcon});
    content: "";

    @media (min-width: ${({ theme }) => pixelToRem(theme.responsive.tablet.minWidth)}) {
      margin-right: ${pixelToRem(12)};
    }
  }
`;

const defaults = {
  Content,
  Row,
  Column,
  Group,
  Header,
  Label,
  Main,
  Nav,
  SelectableButton,
  RadioButton,
  TextArea,
  Title,
  ErrorMessage,
};

export default defaults;
