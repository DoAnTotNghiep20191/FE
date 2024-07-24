import { useEffect, useMemo, useState } from 'react';
import { RefundType } from 'src/constants';
import { createSafeContext } from '../safe-context/createSafeContext';
import { IRefundReject, IRefundRequest, IRefundsApprove } from 'src/interfaces/refund.payload';

interface IModalContextProps {
  children?: React.ReactNode;
}

interface IModalContextValue {
  setModalSelected: <T>(args?: T | any) => void;
  modalSelected: keyof typeof RefundType | undefined;
  close?: () => void;
  setUseBackButton?: (isUse: boolean) => void;
  useBackButton?: boolean;
  contentParams?: Record<string, string>;
  setContentParams?: <T>({ ...args }: T | any) => void;
  payload?: IRefundRequest | IRefundsApprove | IRefundReject | number;
  setPayload?: <T>(args?: T | any) => void;
}

export const [ModalProvider, useModalContext] = createSafeContext<IModalContextValue>();

export const RefundModalProvider = ({ children }: IModalContextProps) => {
  const [modalSelected, setModalSelected] = useState<keyof typeof RefundType | undefined>();
  const [useBackButton, setUseBackButton] = useState<boolean>(false);
  const [contentParams, setContentParams] = useState<Record<string, string> | undefined>({});
  const [payload, setPayload] = useState<
    IRefundRequest | IRefundsApprove | IRefundReject | number | undefined
  >(undefined);

  const close = () => {
    setModalSelected(undefined);
  };

  const valuesMemoized = useMemo(
    () => ({
      setModalSelected,
      modalSelected,
      close,
      setUseBackButton,
      useBackButton,
      setContentParams,
      contentParams,
      payload,
      setPayload,
    }),
    [modalSelected, useBackButton],
  );
  return <ModalProvider value={valuesMemoized}>{children}</ModalProvider>;
};
