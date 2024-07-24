import VerificationInput from 'react-verification-input';
import './styles.scss';
import { C1007, MSG } from 'src/constants/errorCode';
import { useTranslation } from 'react-i18next';

interface IVerification {
  onComplete?: (value: string) => void;
  onChange?: (value: string) => void;
  className?: string;
  isError?: boolean;
  length?: number;
  validChars?: string;
}

const Verification = ({
  onChange,
  onComplete,
  className,
  isError,
  length = 6,
  validChars = '0-9',
}: IVerification) => {
  const { t } = useTranslation();
  return (
    <div className={`verification ${className}`}>
      <VerificationInput
        onComplete={onComplete}
        length={length}
        autoFocus
        onChange={onChange}
        placeholder=""
        validChars={validChars}
        classNames={{
          container: 'container justify-around',
          character: `character ${isError ? 'character-error' : ''}`,
          characterInactive: 'character--inactive',
          characterSelected: 'character--selected',
          characterFilled: 'character--filled',
        }}
      />
      {isError && <p className="error">{t(MSG[C1007])}</p>}
    </div>
  );
};

export default Verification;
