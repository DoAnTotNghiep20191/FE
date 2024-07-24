import { ContractInterface } from 'ethers';

export default class OrderContract {
  instance: any;

  constructor(instance: ContractInterface) {
    this.instance = instance;
  }

  createLimitOrder = async (order: any, signature: Array<string | number>): Promise<any> => {
    return this.instance.createLimitOrder(order, signature);
  };

  cancelOrder = async (orderHash: string, tokenAddress: string, maker: string): Promise<any> => {
    return this.instance.cancelLimitOrderWithHash(orderHash, tokenAddress, maker);
  };
}
