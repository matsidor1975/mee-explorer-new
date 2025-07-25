import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { isValidSupertransactionHash } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface HashSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (hash: string) => void;
  isLoading?: boolean;
}

export default function HashSearch({ value, onChange, onSearch, isLoading }: HashSearchProps) {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = value.trim();
    
    if (!trimmedValue) {
      toast({
        title: "Empty search",
        description: "Please enter a Supertransaction hash to search.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidSupertransactionHash(trimmedValue)) {
      toast({
        title: "Invalid Supertransaction hash",
        description: "Please enter a valid Biconomy Supertransaction hash (0x followed by 64 hexadecimal characters).",
        variant: "destructive",
      });
      return;
    }

    onSearch(trimmedValue);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Enter Biconomy Supertransaction hash..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-12 sm:h-14 px-3 sm:px-4 pl-10 sm:pl-12 pr-4 sm:pr-32 text-base sm:text-lg border-0 rounded-xl sm:rounded-xl shadow-lg focus:ring-4 focus:ring-white focus:ring-opacity-50 outline-none"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="sm:absolute sm:right-2 sm:top-1/2 sm:transform sm:-translate-y-1/2 h-10 sm:h-10 px-4 sm:px-6 bg-biconomy-orange hover:bg-biconomy-orange-dark text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            "Search"
          )}
        </Button>
      </div>
    </form>
  );
}
