'use client';
import { forwardRef, memo } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface ReCaptchaProps {
  className?: string;
  disabled?: boolean;
  onChange?: (token: string | null) => void;
  onLoaded?: () => void;
}

const ReCaptcha = forwardRef<ReCAPTCHA, ReCaptchaProps>(
  ({ className: _, disabled: _disable, onChange, onLoaded }: ReCaptchaProps, ref) => {
    return (
      <ReCAPTCHA
        ref={ref}
        style={{ display: 'inline-block' }}
        theme="light"
        sitekey={import.meta.env.VITE_KEY_RE_CAPTCHA!}
        onChange={onChange}
        asyncScriptOnLoad={onLoaded}
      />
    );
  },
);

ReCaptcha.displayName = 'ReCaptcha';

export default memo(ReCaptcha);
