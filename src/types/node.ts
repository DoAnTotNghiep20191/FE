/**
 * Networks user can launch new Node
 */
export enum NodeNetwork {
  BTC = 'btc',
  Ethereum = 'eth',
  BSC = 'bsc',
  Solana = 'sol',
}

export enum NodeNetworkLabel {
  BTC = 'Bitcoin',
  Ethereum = 'Ethereum',
  BSC = 'BSC',
  Solana = 'Solana',
}

/**
 * Network types of Node
 */
export enum NetworkType {
  Mainnet = 'mainnet',
}

/**
 * Cloud providers of Node
 */
export enum CloudProvider {
  AWS = 'aws',
}

/**
 * Node types
 */
export enum NodeType {
  FullArchive = 'full-archive',
  Archive = 'archive',
  Full = 'full',
}

/**
 * Regions of a node
 */
export enum NodeRegion {
  Asia = 'ap-southeast-1',
  EU = 'eu-west-1',
  US = 'us-east-1',
}

export enum RegionName {
  Asia = 'Asia',
  EU = 'EU',
  US = 'US',
}

export enum NodeStatus {
  PAYMENT_WAITING = 'paymentWaiting', // Payment Waiting
  DEPLOY_WAITING = 'deployWaiting', // Launching
  LAUNCHING = 'launching', // Launching
  SYNCING = 'syncing', // Syncing
  HEALTHY = 'healthy', // Live
  DELETED = 'deleted', // Supspended
}

/**
 * BE paid plans
 */
export enum NodePaidPlan {
  Protocol = 'protocol',
  Enterprise = 'enterprise',
}

/**
 * Node type
 */
export type Node = {
  nodeId: number;
  nodeName: string;
  nodeStatus: NodeStatus;
  paidPlan: NodePaidPlan;
  region: NodeRegion;
  cloudProvider: CloudProvider;
  nodeType: NodeType;
  networkType: NetworkType;
  network: NodeNetwork;
  userNodeId: number;
  currentBlock: number;
  domain: string;
  expiredAt: number;
  isCancelled: number;
  nodeLastUpdate: number;
  nodeVersion: string;
  peers: number;
  weight: number;
};
