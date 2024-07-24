import Icon from '@ant-design/icons';
import { Modal, ModalProps } from 'antd';
import { CloseIcon } from 'src/assets/icons';
import { DEFAULT_MODAL_WIDTH } from 'src/constants';
import { useMobile } from 'src/hooks/useMobile';
import './styles/index.scss';

export interface IVoteeModalProps extends ModalProps {
  isClose?: boolean;
  isCloseMobile?: boolean;
}

const ModalComponent = ({
  children,
  footer,
  width,
  className,
  isClose = true,
  ...props
}: IVoteeModalProps) => {
  const isMobile = useMobile();
  return (
    <>
      {isMobile ? (
        <Modal
          width={'100%'}
          destroyOnClose={true}
          maskClosable={false}
          centered={false}
          footer={false}
          closeIcon={isClose ? <Icon className="close-modal-icon" component={CloseIcon} /> : null}
          className={`modal-container-mobile ${className ? className : ''} `}
          {...props}
        >
          {children}
        </Modal>
      ) : (
        <Modal
          closeIcon={isClose ? <Icon className="close-modal-icon" component={CloseIcon} /> : null}
          width={width ? width : DEFAULT_MODAL_WIDTH}
          footer={footer ? footer : null}
          destroyOnClose={true}
          maskClosable={false}
          className={`modal-container ${className ? className : ''} `}
          {...props}
        >
          {children}
        </Modal>
      )}
    </>
  );
};

export default ModalComponent;
