import { Form } from 'antd';
import get from 'lodash/get';
import { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import { InputTransactionData, useWallet } from '@aptos-labs/wallet-adapter-react';
import dayjs from 'dayjs';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { aptosClient, fromHexString } from 'src/aptos-lab/utils';
import { BackIcon } from 'src/assets/icons';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import ModalComponent from 'src/components/Modals';
import { ToastMessage } from 'src/components/Toast';
import { PURCHASE_STEP, WIDTH_FORM_MODAL_2 } from 'src/constants';
import {
  C1001,
  C1077,
  C40095,
  MSG,
  S4042,
  S_INSUFFICIENT_FEE,
  S_TRANSACTION_DENIED,
} from 'src/constants/errorCode';
import { PATHS } from 'src/constants/paths';
import { RefundModalProvider } from 'src/contexts/modal';
import { getCountyUser } from 'src/helpers';
import { useSocketIo } from 'src/hooks/useSocketIo';
import { SocketEvent } from 'src/socket/events';
import { useAppDispatch, useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import {
  useCheckStatusPaymentMutation,
  useClientClaimTicketMutation,
  useGetEventDetailQuery,
  useGetTicketDetailQuery,
  useLazyGetHoldTicketQuery,
  useLazyGetTicketByIdQuery,
  usePaymentMutation,
  useSubscribedNotificationMutation,
  useVerifyPrivateMutation,
} from 'src/store/slices/app/api';
import { PaymentPayload } from 'src/store/slices/app/types';
import { setDefaultForm, setOpenSignIn } from 'src/store/slices/auth';
import { EUserKycStatus, TypeForm, TypeRole } from 'src/store/slices/user/types';
import { getGeocode } from 'use-places-autocomplete';
import CardEventDetail from './components/CardEventDetail';
import NotificationModal from './components/NotificationModal';
import PasswordEvent from './components/PasswordEvent';
import PaySecurely from './components/PaySecurely';
import ReviewsEvent from './components/ReviewsEvent';
import ReviewTicket from './components/ReviewTicket';
import SelectTicketType from './components/SelectTicketType';
import SkeletonDetail from './components/SkeletonDetail';
import StripeCard from './components/StripeCard';
import VerifyKyc from './components/VerifyKyc';
import ViewMyTicketModal from './components/ViewMyTicketModal';
import ScanTicket from './components/ViewMyTicketModal/ScanTicket';
import UnableToView from './components/ViewMyTicketModal/UnableToView';
import './styles.scss';
import { EPaymentMethod, ETicketStatus, ITicketType } from './types';
import { WalletNames } from 'src/components/WalletListModal';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';

interface RouteParams {
  id: string;
}

interface IPaymentData {
  eventId: string;
  nonce: string;
  deadline: string;
  amount: string;
  proofSignature: string;
  contractAddress: string;
}

export interface IDataPayment {
  clientSecret: string;
  currency: string;
  amount: number | string;
  idTicket: number | string;
  createdAt: string;
}

export enum SupportedToken {
  USDC = 'USDC',
  APT = 'APT',
}

const ContractPaymentModuleAddress = import.meta.env.VITE_PAYMENT_MODULE_ADDRESS;
const ContractPaymentModuleName = import.meta.env.VITE_PAYMENT_MODULE_NAME;

const aptos = aptosClient(import.meta.env.VITE_APTOS_NETWORK);

const EventDetail = () => {
  const [isOpen, setOpen] = useState(false);
  const [isOpenMyTicket, setOpenMyTicket] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState(PURCHASE_STEP.SELECT_TICKET_TYPE);
  const [purchaseTicket, setPurchaseTicket] = useState<ITicketType>();
  const [isByPass, setByPass] = useState(false);
  const [detailEvent, setDetailEvent] = useState<any>(null);
  const [isOpenEmailNotify, setIsOpenEmailNotify] = useState(false);
  const [isOpenTicketPurchased, setIsOpenTicketPurchased] = useState(false);
  const [dataPayment, setDataPayment] = useState<IDataPayment | null>(null);
  const [isLoadingPayCrypto, setIsLoadingPayCrypto] = useState(false);
  const [isLoadingPayCard, setIsLoadingPayCard] = useState(false);
  const [isLoadingPayFree, setIsLoadingPayFree] = useState(false);
  const [isShowAllReview, setIsShowAllReview] = useState(false);
  const [ticketCheckIn, setTicketCheckIn] = useState<any>(null);
  const [isShowCheckIn, setIsShowCheckIn] = useState(false);
  const { signAndSubmitTransaction } = useWallet();
  const { rudderAnalytics } = useRudderStack();

  const { id } = useParams<RouteParams>();
  const location = useLocation();
  const history = useHistory();
  const userInfo: any = useAppSelector(getUserInfo);
  const { t } = useTranslation();

  const [verifyPrivate, { isLoading: loadingPassword }] = useVerifyPrivateMutation();
  const [paymentTicket, { isLoading: isLoadingPayment }] = usePaymentMutation();
  const [holdTicket, { isLoading: isLoadingHoldTicket }] = useLazyGetHoldTicketQuery();
  const [claimTicketMutation] = useClientClaimTicketMutation();

  const { isLoading, data, error } = useGetEventDetailQuery({ id: +id });
  const [pageTitle, setPageTitle] = useState('');
  const [pageDescription, setPageDescription] = useState('');
  const { data: dataTicket, refetch: refetchTicketDetail } = useGetTicketDetailQuery(
    { id: +id },
    { skip: !userInfo },
  );
  const [getTicketCheckIn] = useLazyGetTicketByIdQuery();
  const [subscribedNotification] = useSubscribedNotificationMutation();
  const [checkStatusPayment] = useCheckStatusPaymentMutation();
  const dispatch = useAppDispatch();

  const [formPassword] = Form.useForm();
  const statusTicket = get(dataTicket, 'data[0].status', null);
  const emailBuyTicket = get(dataTicket, 'data[0].email', null);
  const isPaymentPassed = get(dataTicket, 'data[0].isPaymentPassedQuickCheck', false);
  const paymentMethod = get(dataTicket, 'data[0].paymentMethod', null);
  const ticketDetail: any = get(dataTicket, 'data[0]', null);

  const isPast = useMemo(() => {
    return dayjs.unix(detailEvent?.endTime).isBefore(dayjs());
  }, [detailEvent?.endTime]);

  useEffect(() => {
    if (error && 'status' in error && error.status === 404) {
      history.replace(PATHS.notFound);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (data && data.data) {
      const eventData = data.data;
      setPageTitle(eventData.name);
      setPageDescription(eventData.description);
      if (data?.data?.isPasswordRequired) {
        setByPass(data?.data?.isPasswordRequired);
      } else {
        setDetailEvent(data?.data);
      }
    }
  }, [data]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get('redirect_status');

    if (status === 'succeeded') {
      setDataPayment(null);
      refetchTicketDetail();
      window.history.replaceState(null, '', window.location.pathname);
      setIsOpenTicketPurchased(true);
    }
  }, [location]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const idTicket = searchParams.get('id_ticket');
    if (userInfo && idTicket && userInfo?.role === TypeRole.ORGANIZER) {
      getTicketById(+idTicket);
    }
    if (!userInfo && idTicket) {
      dispatch(setDefaultForm(TypeForm.LOGIN));
      dispatch(setOpenSignIn(true));
    }
  }, [location, userInfo]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const idTicket = searchParams.get('id_ticket');
    if (userInfo && idTicket && userInfo?.role === TypeRole.FAN) {
      setOpenMyTicket(true);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [location, userInfo]);

  useEffect(() => {
    if (data && !data?.data?.isPasswordRequired) {
      rudderAnalytics?.track(ERudderStackEvents.EventViewed, {
        eventType: ERudderStackEvents.EventViewed,
        data: {
          userId: userInfo?.id,
          eventId: data?.data?.id,
        },
      });
    }
  }, [data]);

  const getTicketById = async (id: number) => {
    try {
      const res = await getTicketCheckIn({ id }).unwrap();
      setTicketCheckIn(res?.data?.[0]);
      setIsShowCheckIn(true);
    } catch (err: any) {
      if (err?.data?.validator_errors === S4042) {
        setIsShowCheckIn(true);
        return;
      }
      ToastMessage.error(t(MSG[C1001]));
      console.error(error);
    }
  };

  const handleCheckInSuccess = (id: number) => {
    getTicketById(id);
  };

  useSocketIo(
    async (data) => {
      try {
        const res: any = await holdTicket({ id: data?.holdTicketId }).unwrap();
        if (res?.data?.paymentMethod === EPaymentMethod.CRYPTO) {
          await handlePay(res?.data);
          return;
        }
        if (res?.data?.paymentMethod === EPaymentMethod.CARD) {
          setOpen(false);
          setDataPayment({
            clientSecret: res?.data?.stripeClientSecret,
            currency: res?.data?.currency,
            amount: res?.data?.formattedAmount,
            idTicket: res?.data?.id,
            createdAt: res?.data.createdAt || res?.data.actionTime,
          });
          return;
        }
      } catch (err: any) {
        setIsLoadingPayCrypto(false);
        console.error(error);
        ToastMessage.error(t(MSG[C1001]));
      } finally {
        setIsLoadingPayCard(false);
        setIsLoadingPayFree(false);
      }
    },
    SocketEvent.HOLD_SUCCEEDED,
    [userInfo?.address],
  );

  useSocketIo(
    async () => {
      try {
        refetchTicketDetail();
      } catch (err: any) {
        console.error(error);
      }
    },
    SocketEvent.MINT_TICKET_SUCCEEDED,
    [userInfo?.address],
  );

  useSocketIo(
    async (data) => {
      try {
        setIsLoadingPayCrypto(false);
        setIsLoadingPayFree(false);
        onClose();
        refetchTicketDetail();
        // setIsQueue(false);
        if (data?.paymentMethod === EPaymentMethod.CARD) {
          return;
        }
        setIsOpenTicketPurchased(true);
      } catch (err: any) {
        console.error(error);
      }
    },
    SocketEvent.PAID_HOLD_TICKET,
    [userInfo?.address],
  );

  useSocketIo(
    async (data) => {
      try {
        if (data?.status === 'failed') {
          ToastMessage.error(t(MSG[data?.validatorErrors]) || t(MSG[C1001]));
          setIsLoadingPayCrypto(false);
          setIsLoadingPayCard(false);
          // setIsQueue(false);
        }
      } catch (err) {
        console.error(error);
      }
    },
    SocketEvent.HOLD_FAILED,
    [userInfo?.address],
  );

  const handlePayUsdc = async (data: IPaymentData) => {
    const walletName = localStorage.getItem('AptosWalletName');
    const isOkx = [WalletNames.OKX].includes(walletName as WalletNames);
    const transaction: InputTransactionData = {
      data: {
        function: `${ContractPaymentModuleAddress}::${ContractPaymentModuleName}::pay`,
        functionArguments: [
          ContractPaymentModuleAddress,
          data.eventId,
          data.nonce,
          data.deadline,
          data.amount,
          isOkx ? data.proofSignature : fromHexString(data.proofSignature),
        ],
        typeArguments: [data.contractAddress],
      },
    };

    const response = await signAndSubmitTransaction(transaction);
    await aptos.waitForTransaction({ transactionHash: response.hash });
  };

  const handleGetBalanceOf = async () => {
    try {
      return await aptos.getAccountAPTAmount({
        accountAddress: userInfo?.address,
      });
    } catch (error) {
      return 0;
    }
  };

  const handlePay = async (data: any) => {
    if (!userInfo.address) return;
    setIsLoadingPayCrypto(true);
    try {
      const balance = await handleGetBalanceOf();
      const isTestnet = import.meta.env.VITE_APTOS_NETWORK === 'testnet';

      if (balance <= 0 && !isTestnet) {
        ToastMessage.error(t(MSG[S_INSUFFICIENT_FEE]));
        setIsLoadingPayCrypto(false);
        return;
      }

      await handlePayUsdc({
        proofSignature: data?.signature,
        amount: data?.formattedAmount,
        eventId: data.collectionId,
        nonce: data?.nonce,
        deadline: data?.deadline,
        contractAddress: data.currencyAddress,
      });

      rudderAnalytics?.track(ERudderStackEvents.UserSubmittedPayCryptoTransaction, {
        eventType: ERudderStackEvents.UserSubmittedPayCryptoTransaction,
        data: {
          ticketId: purchaseTicket?.id,
          promoCode: purchaseTicket?.promoCode || '',
          email: purchaseTicket?.email,
          currency: purchaseTicket?.currency!,
          eventId: +id,
        },
      });

      await checkStatusPayment({ id: +ticketDetail?.id || +data?.id });
    } catch (err: any) {
      console.error(err);
      setOpen(false);
      refetchTicketDetail();
      setIsLoadingPayCrypto(false);
      if (
        err?.code === 'ACTION_REJECTED' ||
        err?.code === 4001 ||
        err === 'The user rejected the request'
      ) {
        ToastMessage.error(t(MSG[S_TRANSACTION_DENIED]));
        return;
      }
      if (err?.code === 'UNPREDICTABLE_GAS_LIMIT') {
        ToastMessage.error(t(MSG[S_INSUFFICIENT_FEE]));
        return;
      }

      if (err === 'Internal error.') {
        ToastMessage.error(t(MSG[C40095]));
        return;
      }
      ToastMessage.error(err?.reason || t(MSG[C1001]));
    }
  };

  const handleAddToPurchase = (selectedTicketType: ITicketType) => {
    setPurchaseStep(PURCHASE_STEP.REVIEW_TICKET);
    setPurchaseTicket(selectedTicketType);
  };

  async function onCheckKYC() {
    const local = get(detailEvent, 'location', '');
    const [address]: any = await getGeocode({ address: local });

    const country = get(
      address,
      `address_components[${address?.address_components?.length - 1}].short_name`,
      '',
    );

    const countryIp = await getCountyUser();

    if (
      userInfo?.kycStatus === EUserKycStatus.NOT_VERIFIED &&
      (country === import.meta.env.VITE_COUNTRY_CODE_KYC! ||
        countryIp === import.meta.env.VITE_COUNTRY_CODE_KYC!)
    )
      return true;
    return false;
  }

  const handlePurchaseTicket = async (values: any) => {
    const isVerify = await onCheckKYC();

    if (isVerify && Number(purchaseTicket?.price) !== 0 && Number(values?.estimatedBill) !== 0) {
      setPurchaseStep(PURCHASE_STEP.VERIFY);
      return;
    }
    if (Number(purchaseTicket?.price) === 0 || Number(values?.estimatedBill) === 0) {
      handlePayFree(values);
    } else {
      setPurchaseTicket({ ...purchaseTicket, ...values });
      setPurchaseStep(PURCHASE_STEP.PAY_SECURELY);
    }
  };

  const handlePayFree = async (values: any) => {
    try {
      setIsLoadingPayFree(true);

      const params: PaymentPayload = {
        paymentMethod: EPaymentMethod.FREE_NOT_NEED_PAYMENT,
        collectionId: +id,
        ticketOptions: [
          {
            id: Number(purchaseTicket?.id),
            amount: 1,
          },
        ],
        email: values?.email,
        promoName: values?.promoCode || '',
      };
      await paymentTicket(params).unwrap();
    } catch (err: any) {
      console.error(error);
      setIsLoadingPayFree(false);
    }
  };

  const handlePayCrypto = async (token: SupportedToken) => {
    try {
      setIsLoadingPayCrypto(true);
      const params: PaymentPayload = {
        paymentMethod: EPaymentMethod.CRYPTO,
        currency: token === SupportedToken.USDC ? SupportedToken.USDC : SupportedToken.APT,
        collectionId: +id,
        ticketOptions: [
          {
            id: Number(purchaseTicket?.id),
            amount: 1,
          },
        ],
        promoName: purchaseTicket?.promoCode || '',
        email: purchaseTicket?.email,
      };
      rudderAnalytics?.track(ERudderStackEvents.UserStartedPayTicket, {
        eventType: ERudderStackEvents.UserStartedPayTicket,
        data: {
          paymentMethod: EPaymentMethod.CRYPTO,
          ticketId: Number(purchaseTicket?.id),
          promoCode: purchaseTicket?.promoCode || '',
          email: purchaseTicket?.email,
          currency: token === SupportedToken.USDC ? SupportedToken.USDC : SupportedToken.APT,
          eventId: +id,
        },
      });
      await paymentTicket(params).unwrap();
    } catch (err: any) {
      console.error(err);
      setIsLoadingPayCrypto(false);
    }
  };

  const handlePayStripe = async () => {
    try {
      setIsLoadingPayCard(true);

      const createTime = ticketDetail?.createdAt || ticketDetail?.actionTime;
      if (createTime) {
        const timeDiff = dayjs().diff(createTime, 'second');
        if (timeDiff >= Number(import.meta.env.VITE_STRIPE_SESSION_TIME || 60 * 15)) {
          ToastMessage.error(t('message.S40038')); //A ticket is currently on hold
          refetchTicketDetail();
          setIsLoadingPayCard(false);
          return;
        }
      }

      const params: PaymentPayload = {
        paymentMethod: EPaymentMethod.CARD,
        currency: purchaseTicket?.currency!,
        collectionId: +id,
        ticketOptions: [
          {
            id: Number(purchaseTicket?.id),
            amount: 1,
          },
        ],
        promoName: purchaseTicket?.promoCode || '',
        email: purchaseTicket?.email,
      };
      rudderAnalytics?.track(ERudderStackEvents.UserStartedPayTicket, {
        paymentMethod: EPaymentMethod.CARD,
        ticketId: Number(purchaseTicket?.id),
        promoCode: purchaseTicket?.promoCode || '',
        email: purchaseTicket?.email,
        currency: purchaseTicket?.currency!,
        collectionId: +id,
      });
      await paymentTicket(params).unwrap();
    } catch (err: any) {
      console.error(error);
      setIsLoadingPayCard(false);
    }
  };

  const onClose = () => {
    setOpen(false);
    setPurchaseStep(PURCHASE_STEP.SELECT_TICKET_TYPE);
  };

  const renderModalContent = useMemo(() => {
    switch (purchaseStep) {
      case PURCHASE_STEP.SELECT_TICKET_TYPE:
        return <SelectTicketType onAddToPurchase={handleAddToPurchase} id={+id} />;
      case PURCHASE_STEP.REVIEW_TICKET:
        return (
          <ReviewTicket
            purchaseTicket={purchaseTicket}
            onPurchaseTicket={handlePurchaseTicket}
            id={+id}
            onClose={onClose}
            isLoading={isLoadingPayFree}
          />
        );
      case PURCHASE_STEP.PAY_SECURELY:
        return (
          <PaySecurely
            onPayCrypto={handlePayCrypto}
            onPayStripe={handlePayStripe}
            isLoadingStripe={isLoadingPayCard}
            isLoadingCrypto={isLoadingPayCrypto}
          />
        );
      case PURCHASE_STEP.VERIFY:
        return <VerifyKyc setPurchaseStep={setPurchaseStep} />;
      default:
        return;
    }
  }, [
    purchaseStep,
    isLoadingPayCrypto,
    isLoadingPayment,
    isLoadingPayCard,
    isLoadingPayFree,
    isLoadingHoldTicket,
    dataTicket,
    id,
    userInfo?.kycStatus,
  ]);

  const handleCloseMyTicket = () => {
    setOpenMyTicket(false);
  };

  const handlePassword = async ({ password }: { password: string }) => {
    try {
      const res: any = await verifyPrivate({ password: password, id: +id }).unwrap();
      // push data to rudder stack
      rudderAnalytics?.page(ERudderStackEvents.EventViewed, {
        eventType: ERudderStackEvents.EventViewed,
        data: {
          userId: userInfo?.id,
          eventId: data?.data?.id,
        },
      });

      setDetailEvent(res?.data);
      setByPass(false);
      formPassword.resetFields();
    } catch (err) {
      console.error(error);
      formPassword.setFields([
        {
          name: 'password',
          errors: [t(MSG[C1077])],
        },
      ]);
    }
  };
  const handlePurchase = async () => {
    if (ticketDetail && statusTicket === ETicketStatus.INIT && !isPaymentPassed) {
      if (paymentMethod === EPaymentMethod.CARD) {
        setOpen(false);
        const createTime = ticketDetail?.createdAt || ticketDetail?.actionTime;
        if (createTime) {
          const timeDiff = dayjs().diff(createTime, 'second');
          if (timeDiff >= Number(import.meta.env.VITE_STRIPE_SESSION_TIME || 60 * 15)) {
            ToastMessage.error(t('message.S40038')); //A ticket is currently on hold
            refetchTicketDetail();
            setIsLoadingPayCard(false);
            return;
          }
        }

        setDataPayment({
          clientSecret: ticketDetail?.stripeClientSecret,
          currency: ticketDetail?.currency,
          amount: ticketDetail?.formattedAmount,
          idTicket: ticketDetail?.id,
          createdAt: createTime,
        });
        return;
      }
      if (paymentMethod === EPaymentMethod.CRYPTO) {
        const data = {
          collectionId: ticketDetail?.collection?.id,
          formattedAmount: ticketDetail?.formattedAmount,
          currencyAddress: ticketDetail?.currencyAddress,
          nonce: ticketDetail?.nonce,
          deadline: ticketDetail?.deadline,
          signature: ticketDetail?.signature,
        };
        await handlePay(data);
        return;
      }
    } else {
      setOpen(true);
    }
  };

  const handleSubscribedNotification = async () => {
    try {
      await subscribedNotification({ id: +id }).unwrap();
      setIsOpenEmailNotify(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCancelCheckIn = () => {
    setIsShowCheckIn(false);
    setTicketCheckIn(null);
    window.history.replaceState(null, '', window.location.pathname);
  };

  const handleScanAnother = () => {
    handleCancelCheckIn();
    history.push(`${PATHS.dashboard}?rescan=true`);
  };

  const handleStripeTimeout = () => {
    setDataPayment(null);
    setIsLoadingPayCard(false);
    ToastMessage.error(t('purchaseTicket.stripeTimeout'));
  };

  const renderButton = useMemo(() => {
    const isWaitForClaim =
      dataTicket?.data?.[0]?.paymentMethod === EPaymentMethod.GIFTING &&
      dataTicket?.data?.[0]?.status === ETicketStatus.PAID;
    const userTeams = userInfo?.teams || [];
    const eventTeamId = detailEvent?.teamId;
    const isOwnerOfEvent = !!userTeams.find((item: any) => item.teamId === eventTeamId);
    if (isPast) {
      return (
        <ButtonContained className="purchase-btn" buttonType="type1" disabled>
          {t('eventDetail.buttonEventEnded')}
        </ButtonContained>
      );
    }
    if (!userInfo) {
      return (
        <ButtonContained
          className="purchase-btn"
          buttonType="type1"
          onClick={() => dispatch(setOpenSignIn(true))}
        >
          {t('eventDetail.buttonLogInToPurchase')}
        </ButtonContained>
      );
    }
    if (isOwnerOfEvent) {
      return (
        <ButtonContained className="purchase-btn" buttonType="type1" disabled>
          {t('eventDetail.ticketOwnerIsYourTeams')}
        </ButtonContained>
      );
    }

    if (
      statusTicket === ETicketStatus.PAID ||
      statusTicket === ETicketStatus.SUCCESS ||
      statusTicket === ETicketStatus.MINTING_NFT ||
      statusTicket === ETicketStatus.REFUNDING
    ) {
      return (
        <ButtonContained
          className="purchase-btn"
          buttonType="type1"
          onClick={() => {
            if (isWaitForClaim) {
              claimTicketMutation({ collectionId: dataTicket?.data?.[0]?.id });
            } else {
              refetchTicketDetail();
            }
            setOpenMyTicket(true);
            rudderAnalytics?.track(ERudderStackEvents.TicketViewed, {
              eventType: ERudderStackEvents.TicketViewed,
              data: {
                userId: userInfo.id,
                ticketId: ticketDetail?.id,
              },
            });
          }}
        >
          {isWaitForClaim ? t('myEvent.claimTicket') : t('eventDetail.buttonViewTicket')}
        </ButtonContained>
      );
    }

    if (detailEvent?.maxCapacity > 0) {
      return (
        <ButtonContained
          className="purchase-btn"
          buttonType="type1"
          disabled={isPaymentPassed && statusTicket === ETicketStatus.INIT}
          onClick={handlePurchase}
          loading={isLoadingPayCrypto || isLoadingPayCard}
        >
          {t('eventDetail.buttonPurchaseTicket')}
        </ButtonContained>
      );
    } else {
      return (
        <ButtonContained
          className="purchase-btn"
          buttonType="type1"
          onClick={() => setIsOpenEmailNotify(true)}
          disabled={detailEvent?.isSubcribedForNotification}
        >
          {t('eventDetail.buttonNotifyMeWhenTickets')}
        </ButtonContained>
      );
    }
  }, [
    statusTicket,
    detailEvent,
    userInfo?.role,
    isPast,
    isLoadingPayCrypto,
    isLoadingPayCard,
    dataTicket,
  ]);

  if (isByPass) {
    return (
      <div className="flex justify-center h-[100vh]">
        <PasswordEvent
          form={formPassword}
          onHandlePassword={handlePassword}
          isLoading={loadingPassword}
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      <div className="flex justify-center flex-col items-center md:mt-[20px]">
        {isLoading || !detailEvent ? (
          <SkeletonDetail />
        ) : (
          <CardEventDetail
            showCampaign={true}
            event={detailEvent}
            isShowAllReview={isShowAllReview}
            onCampaignChanges={setDetailEvent}
          >
            {renderButton}
          </CardEventDetail>
        )}
        {isPast && (
          <ReviewsEvent
            id={+id}
            buyTicked={!!ticketDetail}
            isReview={detailEvent?.isReview}
            reviewStatus={detailEvent?.reviewStatus}
            onShowAll={() => {
              setIsShowAllReview(true);
            }}
          />
        )}
        <ModalComponent
          open={isOpen}
          onCancel={onClose}
          centered
          width={WIDTH_FORM_MODAL_2}
          destroyOnClose
          isCloseMobile={false}
        >
          <div className="relative">
            {purchaseStep >= 1 && (
              <button
                className="absolute top-[5px]"
                onClick={() => {
                  if (purchaseStep === 1) {
                    setOpen(false);
                  } else if (purchaseStep === 4) {
                    setPurchaseStep((prev) => prev - 2);
                  } else {
                    setPurchaseStep((prev) => prev - 1);
                  }
                }}
              >
                <BackIcon />
              </button>
            )}
            {renderModalContent}
          </div>
        </ModalComponent>
        <RefundModalProvider>
          <ViewMyTicketModal
            isOpenMyTicket={isOpenMyTicket}
            onCloseMyTicket={() => handleCloseMyTicket()}
            viewOnBlockchain={() => setOpenMyTicket(false)}
            data={ticketDetail!}
            refreshCallback={() => refetchTicketDetail()}
          />
        </RefundModalProvider>
        <NotificationModal
          isOpen={isOpenEmailNotify}
          title={t('eventDetail.emailNotification')}
          description={t('eventDetail.youWillReceiveAnEmailNotification')}
          textButton={t('eventDetail.buttonClose')}
          onButton={() => handleSubscribedNotification()}
          onClose={() => handleSubscribedNotification()}
        />
        <NotificationModal
          isOpen={isOpenTicketPurchased}
          title={t('purchaseTicket.ticketPurchased')}
          description={t('purchaseTicket.ticketPurchased', { email: emailBuyTicket })}
          textButton={t('purchaseTicket.buttonViewTickets')}
          onButton={() => {
            setIsOpenTicketPurchased(false);
            setOpenMyTicket(true);
          }}
          onClose={() => setIsOpenTicketPurchased(false)}
        />
        <ModalComponent
          open={isShowCheckIn}
          width={WIDTH_FORM_MODAL_2}
          centered
          className={`[&>.ant-modal-content]:!p-0 ${!ticketCheckIn && 'max-md:h-screen'}`}
          onCancel={handleCancelCheckIn}
        >
          {ticketCheckIn ? (
            <ScanTicket
              data={ticketCheckIn}
              checkInSuccess={handleCheckInSuccess}
              onScanAnother={handleScanAnother}
              onBack={handleScanAnother}
            />
          ) : (
            <UnableToView onClose={handleCancelCheckIn} onScanAnother={handleScanAnother} />
          )}
        </ModalComponent>
        <ModalComponent
          open={!!dataPayment}
          className="top-0 md:top-auto pb-0 md:pb-6 stripe-modal"
          destroyOnClose
          isClose={false}
          width={400}
        >
          <StripeCard
            onSessionTimeOut={handleStripeTimeout}
            purchaseTicket={purchaseTicket}
            dataPayment={dataPayment!}
            id={id}
          />
        </ModalComponent>
      </div>
    </>
  );
};

export default EventDetail;
