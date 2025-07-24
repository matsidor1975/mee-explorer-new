export interface PaymentInfo {
  sender: string;
  initCode: string;
  nonce: string;
  token: string;
  chainId: string;
  shortEncoding: boolean;
  callGasLimit: string;
  sponsored: boolean;
  sponsorshipUrl: string;
  tokenAmount: string;
  tokenWeiAmount: string;
  tokenValue: string;
  gasFee: string;
  orchestrationFee: string;
}

export interface UserOpDetails {
  sender: string;
  nonce: string;
  initCode: string;
  callData: string;
  accountGasLimits: string;
  gasFees: string;
  paymasterAndData: string;
  preVerificationGas: string;
  signature: string;
}

export interface UserOp {
  userOp: UserOpDetails;
  userOpHash: string;
  meeUserOpHash: string;
  lowerBoundTimestamp: number;
  upperBoundTimestamp: number;
  maxGasLimit: string;
  maxFeePerGas: string;
  chainId: string;
  shortEncoding: boolean;
  simulationFinishedAt: number;
  executionStatus: string;
  executionData: string;
  miningTimestamp: number;
  minedTimestamp: number;
  isCleanUpUserOp?: boolean;
}

export interface HashDetails {
  itxHash: string;
  node: string;
  commitment: string;
  paymentInfo: PaymentInfo;
  userOps: UserOp[];
}
