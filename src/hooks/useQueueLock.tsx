import { Mutex } from 'async-mutex';

const mutexMap = new Map();

function getOrCreateMutex(id: string) {
  if (!mutexMap.has(id)) {
    mutexMap.set(id, new Mutex());
  }
  return mutexMap.get(id);
}

interface Params {
  id: string;
}

const useQueueLock = ({ id }: Params) => {
  const handleAddQueue = async (callback: any) => {
    const mutex: Mutex = getOrCreateMutex(id);
    await mutex.runExclusive(callback);
  };

  const handleLockQueue = async () => {
    const mutex: Mutex = getOrCreateMutex(id);
    const release = await mutex.acquire();
    return release;
  };

  const handleUnlockQueue = () => {
    const mutex: Mutex = getOrCreateMutex(id);
    mutex.release();
  };
  return {
    handleAddQueue,
    handleLockQueue,
    handleUnlockQueue,
  };
};

export default useQueueLock;
