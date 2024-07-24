import { useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { IDataPayment } from '..';
import { STRIPE_SECRET_KEY } from 'src/constants/env';
import { useCheckStatusPaymentMutation } from 'src/store/slices/app/api';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
import { ITicketType } from '../types';
import AlarmIcon from 'src/assets/icons/common/alarm-ic.svg?react';
import dayjs from 'dayjs';
import { useCountdown } from 'src/hooks/useCountdown';

const CheckoutForm = ({
  clientSecret,
  id,
  idTicket,
  purchaseTicket,
  onSessionTimeOut,
  createdTime,
  timeLeft,
}: {
  clientSecret: string;
  id: string;
  idTicket: string | number;
  purchaseTicket?: ITicketType;
  onSessionTimeOut: () => void;
  createdTime: string;
  timeLeft: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setIsLoading] = useState(false);

  const [checkStatusPayment] = useCheckStatusPaymentMutation();
  const { rudderAnalytics } = useRudderStack();

  const disableBtn = useMemo(() => {
    return !stripe || !elements || loading;
  }, [stripe, elements, loading]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const timeDiff = dayjs().diff(createdTime, 'second');
    if (timeDiff >= Number(import.meta.env.VITE_STRIPE_SESSION_TIME || 60 * 15)) {
      onSessionTimeOut?.();
      return;
    }
    if (elements == null) {
      return;
    }
    setIsLoading(true);
    const { error: submitError } = (await elements.submit()) as any;
    if (submitError) {
      setErrorMessage(submitError.message);
      setIsLoading(false);
      return;
    }

    rudderAnalytics?.track(ERudderStackEvents.UserSubmittedPayFiatTransaction, {
      eventType: ERudderStackEvents.UserSubmittedPayFiatTransaction,
      data: {
        ticketId: purchaseTicket?.id,
        promoCode: purchaseTicket?.promoCode || '',
        email: purchaseTicket?.email,
        currency: purchaseTicket?.currency!,
        eventId: +id,
      },
    });
    const { error } = (await stripe?.confirmPayment({
      elements,
      clientSecret: clientSecret,
      confirmParams: {
        return_url: `${import.meta.env.VITE_SITE_URI}/events/${id}`,
      },
    })) as any;
    if (!error) {
      await checkStatusPayment({ id: +idTicket });
    } else {
      setErrorMessage(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-[300px]">
        <div className="flex items-center gap-[10px] text-primary mb-[20px]">
          <AlarmIcon />
          <span className="text-[14px]">
            <span className="text-[20px]">{timeLeft}</span> Time left
          </span>
        </div>
        <PaymentElement />
      </div>
      <div className="flex flex-col items-center gap-4">
        <button
          type="submit"
          disabled={disableBtn}
          className={`${
            disableBtn ? 'bg-gray2 cursor-not-allowed' : 'bg-[#3772ff] cursor-pointer'
          } p-[10px] mt-[20px] w-[200px] rounded-xl text-white font-bold`}
        >
          Pay
        </button>
        {errorMessage && <p className="text-red text-[12px]">{errorMessage}</p>}
      </div>
    </form>
  );
};

const StripeCard = ({
  dataPayment,
  id,
  purchaseTicket,
  onSessionTimeOut,
}: {
  dataPayment: IDataPayment;
  id: string;
  purchaseTicket?: ITicketType;
  onSessionTimeOut: () => void;
}) => {
  const stripePromise = loadStripe(STRIPE_SECRET_KEY!);
  const [days, hours, minutes, seconds] = useCountdown(
    dayjs(dataPayment.createdAt)
      .add(Number(import.meta.env.VITE_STRIPE_SESSION_TIME || 60 * 15), 'seconds')
      .toISOString(),
  );

  const options: any = {
    mode: 'payment',
    amount: Number(dataPayment?.amount) * 100,
    currency: dataPayment?.currency.toLocaleLowerCase(),
    appearance: {},
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        purchaseTicket={purchaseTicket}
        createdTime={dataPayment.createdAt}
        onSessionTimeOut={onSessionTimeOut}
        clientSecret={dataPayment?.clientSecret}
        id={id}
        idTicket={dataPayment?.idTicket}
        timeLeft={`${minutes > 0 ? minutes : '00'}:${seconds > 0 ? seconds : '00'}`}
      />
    </Elements>
  );
};

export default StripeCard;
