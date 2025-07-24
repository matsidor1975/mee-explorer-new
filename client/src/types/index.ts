export interface PaymentInfo {
  chainId: string;
  masterWallet: string;
  salt: string;
  token: string;
  tokenAmount: string;
  tokenValue: string;
  orchestrationFee: string;
  gasFee: string;
}

export interface UserOpDetails {
  sender: string;
  nonce: string;
  initCode: string;
  callData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymasterAndData: string;
}

export interface UserOp {
  userOp: UserOpDetails;
  userOpHash: string;
  lowerBoundTimestamp: string;
  upperBoundTimestamp: string;
  maxGasLimit: string;
  chainId: string;
  executionStatus: string;
  executionData: string;
}

export interface HashDetails {
  hash: string;
  node: string;
  commitment: string;
  paymentInfo: PaymentInfo;
  userOps: UserOp[];
}
