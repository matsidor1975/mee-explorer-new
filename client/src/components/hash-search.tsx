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
      <div className="relative flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Enter Biconomy Supertransaction hash..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-14 px-4 pl-12 pr-32 text-lg border-0 rounded-xl shadow-lg focus:ring-4 focus:ring-white focus:ring-opacity-50 outline-none"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6 bg-biconomy-orange hover:bg-biconomy-orange-dark text-white rounded-lg transition-colors font-medium"
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
