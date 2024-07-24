import { createContext, useContext, useState } from 'react';
import { ToastMessage } from 'src/components/Toast';
import { useFanVerifyChallengeMutation } from 'src/store/slices/campaign/api';
import { CampaignItemRes, ChallengeItemRes } from 'src/store/slices/campaign/types';
import PublicPostModal from './PublicPostModal';

interface SelectedChallenge {
  campaign: CampaignItemRes;
  challenge: ChallengeItemRes;
  hashTag?: string;
}

export interface States {
  isOpenModal: boolean;
  selectedChallenge: SelectedChallenge | null;
  loading: boolean;
  setOpenModal(open: boolean): void;
  setLoading(loading: boolean): void;
  setSelectedChallenge: (data: SelectedChallenge | null) => void;
}

export const ModalContext = createContext<States>({
  isOpenModal: false,
  setOpenModal: () => {},
  selectedChallenge: null,
  setSelectedChallenge: () => {},
  setLoading: () => {},
  loading: false,
});

export function usePublicPostVerifyModal(): States {
  return useContext(ModalContext);
}
interface Props {
  children: React.ReactNode;
}

const PublicPostModalProvider = ({ children }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<SelectedChallenge | null>(null);
  const [fanVerifyChallenge] = useFanVerifyChallengeMutation();
  const [loading, setLoading] = useState(false);

  const handleVerifyTask = async (url: string) => {
    if (selectedChallenge) {
      try {
        setLoading(true);
        await fanVerifyChallenge({
          campaignId: selectedChallenge.campaign.id,
          challengeId: selectedChallenge.challenge.id,
          submittedData: url,
        }).unwrap();
      } catch (error) {
        ToastMessage.error('Verify challenge failed');
      }
    }
  };

  return (
    <ModalContext.Provider
      value={{
        isOpenModal: isOpen,
        selectedChallenge,
        setOpenModal: setOpen,
        setSelectedChallenge,
        setLoading,
        loading,
      }}
    >
      {children}
      <PublicPostModal
        hashTag={selectedChallenge?.hashTag}
        loading={loading}
        onSubmit={handleVerifyTask}
        open={isOpen}
        onCancel={() => setOpen(false)}
      />
    </ModalContext.Provider>
  );
};

export default PublicPostModalProvider;
