import { z } from "zod";

export const paymentInfoSchema = z.object({
  chainId: z.string(),
  masterWallet: z.string(),
  salt: z.string(),
  token: z.string(),
  tokenAmount: z.string(),
  tokenValue: z.string(),
  orchestrationFee: z.string(),
  gasFee: z.string(),
});

export const userOpDetailsSchema = z.object({
  sender: z.string(),
  nonce: z.string(),
  initCode: z.string(),
  callData: z.string(),
  callGasLimit: z.string(),
  verificationGasLimit: z.string(),
  preVerificationGas: z.string(),
  maxFeePerGas: z.string(),
  maxPriorityFeePerGas: z.string(),
  paymasterAndData: z.string(),
});

export const userOpSchema = z.object({
  userOp: userOpDetailsSchema,
  userOpHash: z.string(),
  lowerBoundTimestamp: z.string(),
  upperBoundTimestamp: z.string(),
  maxGasLimit: z.string(),
  chainId: z.string(),
  executionStatus: z.string(),
  executionData: z.string(),
});

export const hashDetailsSchema = z.object({
  hash: z.string(),
  node: z.string(),
  commitment: z.string(),
  paymentInfo: paymentInfoSchema,
  userOps: z.array(userOpSchema),
});

export type PaymentInfo = z.infer<typeof paymentInfoSchema>;
export type UserOpDetails = z.infer<typeof userOpDetailsSchema>;
export type UserOp = z.infer<typeof userOpSchema>;
export type HashDetails = z.infer<typeof hashDetailsSchema>;
