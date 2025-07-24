import axios from "axios";
import { toHex, type Address, type Hex } from "viem";

const TENDERLY_ACCESS_KEY = import.meta.env.VITE_TENDERLY_ACCESS_KEY;
const TENDERLY_ACCOUNT_SLUG = "mislav";
const TENDERLY_PROJECT_SLUG = "biconomy-explorer";

const TENDERLY_BASE_URL = "https://api.tenderly.co/api";
const TENDERLY_SHARED_SIMULATION_BASE_URL = "https://www.tdly.co/shared/simulation";

export type SimulationTransactionData = {
  from: Address;
  to: Address;
  data: Hex;
  value: bigint;
  timestamp: number;
  blockNumber: bigint;
};

export const simulateTransaction = async (
  simulationTransactionData: SimulationTransactionData,
  timestampToOverride: number,
  chainId: string
): Promise<string> => {
  if (!TENDERLY_ACCESS_KEY) {
    throw new Error("Tenderly access key not configured");
  }

  const { from, to, value, data, blockNumber } = simulationTransactionData;

  // Trigger a simulation for known calldata
  const simulationResponse = await axios.post(
    `${TENDERLY_BASE_URL}/v1/account/${TENDERLY_ACCOUNT_SLUG}/project/${TENDERLY_PROJECT_SLUG}/simulate`,
    {
      network_id: chainId,
      block_number: Number(blockNumber),
      from,
      to,
      gas: 8000000, // Default gas applied for every transaction
      block_header: {
        timestamp: toHex(timestampToOverride),
      },
      value: String(value),
      source: "meescan",
      input: data,
      simulation_type: "full",
      save: true, // Save the simulations in your account which is persistent
      save_if_fails: true, // Save the simulations in your account which is persistent even if it fails
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Access-Key": TENDERLY_ACCESS_KEY,
      },
    }
  );

  if (!simulationResponse) {
    throw new Error("Failed to create simulation, try again");
  }

  const simulationId = simulationResponse.data.simulation.id;

  // Convert the simulation into a public simulation which can be shared with anyone for debugging
  await axios.post(
    `${TENDERLY_BASE_URL}/v1/account/${TENDERLY_ACCOUNT_SLUG}/project/${TENDERLY_PROJECT_SLUG}/simulations/${simulationId}/share`,
    undefined,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Access-Key": TENDERLY_ACCESS_KEY,
      },
    }
  );

  // Return the simulation URL
  return `${TENDERLY_SHARED_SIMULATION_BASE_URL}/${simulationId}`;
};

export const simulateUserOperation = async (userOp: any): Promise<string> => {
  if (!userOp.simulationTransactionData) {
    throw new Error("No simulation data available for this operation");
  }

  const simulationUrl = await simulateTransaction(
    userOp.simulationTransactionData,
    userOp.upperBoundTimestamp - 5,
    userOp.chainId
  );

  return simulationUrl;
};