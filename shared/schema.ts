import { z } from "zod";

export const paymentInfoSchema = z.object({
  sender: z.string(),
  initCode: z.string(),
  nonce: z.string(),
  token: z.string(),
  chainId: z.string(),
  shortEncoding: z.boolean(),
  callGasLimit: z.string(),
  sponsored: z.boolean(),
  sponsorshipUrl: z.string(),
  tokenAmount: z.string(),
  tokenWeiAmount: z.string(),
  tokenValue: z.string(),
  gasFee: z.string(),
  orchestrationFee: z.string(),
});

export const userOpDetailsSchema = z.object({
  sender: z.string(),
  nonce: z.string(),
  initCode: z.string(),
  callData: z.string(),
  accountGasLimits: z.string(),
  gasFees: z.string(),
  paymasterAndData: z.string(),
  preVerificationGas: z.string(),
  signature: z.string(),
});

export const userOpSchema = z.object({
  userOp: userOpDetailsSchema,
  userOpHash: z.string(),
  meeUserOpHash: z.string(),
  lowerBoundTimestamp: z.number(),
  upperBoundTimestamp: z.number(),
  maxGasLimit: z.string(),
  maxFeePerGas: z.string(),
  chainId: z.string(),
  shortEncoding: z.boolean(),
  simulationFinishedAt: z.number(),
  executionStatus: z.string(),
  executionData: z.string(),
  miningTimestamp: z.number(),
  minedTimestamp: z.number(),
  isCleanUpUserOp: z.boolean().optional(),
});

export const hashDetailsSchema = z.object({
  itxHash: z.string(),
  node: z.string(),
  commitment: z.string(),
  paymentInfo: paymentInfoSchema,
  userOps: z.array(userOpSchema),
});

export type PaymentInfo = z.infer<typeof paymentInfoSchema>;
export type UserOpDetails = z.infer<typeof userOpDetailsSchema>;
export type UserOp = z.infer<typeof userOpSchema>;
export type HashDetails = z.infer<typeof hashDetailsSchema>;
