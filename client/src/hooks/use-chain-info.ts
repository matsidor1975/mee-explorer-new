import { useQuery } from "@tanstack/react-query";
import { getBiconomyInfo, BiconomyInfo } from "@/lib/api";
import { setChainsCache } from "@/lib/format";
import { useEffect } from "react";

export const useChainInfo = () => {
  const { data: biconomyInfo, isLoading, error } = useQuery<BiconomyInfo>({
    queryKey: ['biconomy-info'],
    queryFn: getBiconomyInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Update chain cache when data is available
  useEffect(() => {
    if (biconomyInfo?.supportedChains) {
      const chainMap = biconomyInfo.supportedChains.reduce((acc, chain) => {
        acc[chain.chainId] = chain.name;
        return acc;
      }, {} as Record<string, string>);
      
      setChainsCache(chainMap);
    }
  }, [biconomyInfo]);

  return {
    chains: biconomyInfo?.supportedChains || [],
    isLoading,
    error,
    version: biconomyInfo?.version,
    node: biconomyInfo?.node,
  };
};