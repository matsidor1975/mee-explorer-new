import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Globe, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRESET_NETWORKS = {
  production: {
    name: "Production",
    url: "https://network.biconomy.io",
    description: "Main Biconomy network"
  },
  staging: {
    name: "Staging",
    url: "https://mee-node-staging.biconomy.io",
    description: "Staging environment for testing"
  },
  custom: {
    name: "Custom",
    url: "",
    description: "Enter your own network URL"
  }
};

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [selectedNetwork, setSelectedNetwork] = useState(() => {
    const stored = localStorage.getItem('biconomy-network-url');
    if (!stored || stored === 'https://network.biconomy.io') return 'production';
    if (stored === 'https://mee-node-staging.biconomy.io') return 'staging';
    return 'custom';
  });

  const [customUrl, setCustomUrl] = useState(() => {
    const stored = localStorage.getItem('biconomy-network-url');
    if (stored && !Object.values(PRESET_NETWORKS).some(network => network.url === stored)) {
      return stored;
    }
    return '';
  });

  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('biconomy-api-key') || '';
  });

  const currentUrl = selectedNetwork === 'custom' ? customUrl : PRESET_NETWORKS[selectedNetwork as keyof typeof PRESET_NETWORKS]?.url || '';

  const handleSave = () => {
    // Save network URL
    if (selectedNetwork === 'custom' && customUrl) {
      localStorage.setItem('biconomy-network-url', customUrl);
    } else if (selectedNetwork !== 'custom') {
      const networkUrl = PRESET_NETWORKS[selectedNetwork as keyof typeof PRESET_NETWORKS]?.url;
      if (networkUrl) {
        localStorage.setItem('biconomy-network-url', networkUrl);
      }
    }

    // Save API key
    if (apiKey.trim()) {
      localStorage.setItem('biconomy-api-key', apiKey.trim());
    }

    // Reload page to apply changes
    window.location.reload();
  };

  const handleReset = () => {
    localStorage.removeItem('biconomy-network-url');
    localStorage.removeItem('biconomy-api-key');
    setSelectedNetwork('production');
    setCustomUrl('');
    setApiKey('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Network Settings</span>
          </DialogTitle>
          <DialogDescription>
            Configure the Biconomy network endpoint and API credentials for this explorer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Network Selection */}
          <div className="space-y-3">
            <Label htmlFor="network">Network Environment</Label>
            <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
              <SelectTrigger>
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PRESET_NETWORKS).map(([key, network]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{network.name}</div>
                        {network.url && (
                          <div className="text-xs text-muted-foreground">{network.url}</div>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedNetwork !== 'custom' && (
              <p className="text-sm text-muted-foreground">
                {PRESET_NETWORKS[selectedNetwork as keyof typeof PRESET_NETWORKS]?.description}
              </p>
            )}
          </div>

          {/* Custom URL Input */}
          {selectedNetwork === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="custom-url">Custom Network URL</Label>
              <Input
                id="custom-url"
                placeholder="https://your-network.biconomy.io"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Enter the base URL for your custom Biconomy network endpoint.
              </p>
            </div>
          )}

          {/* API Key */}
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key (Optional)</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Biconomy API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Custom API key for enhanced rate limits and access to restricted endpoints.
            </p>
          </div>

          {/* Current Configuration */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Current Network:</strong> {currentUrl || 'https://network.biconomy.io'}
              <br />
              Changes will reload the page to apply new settings.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={selectedNetwork === 'custom' && !customUrl.trim()}>
              Save & Reload
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SettingsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-slate-600 hover:text-slate-900"
      >
        <Settings className="h-4 w-4" />
      </Button>
      <SettingsDialog open={open} onOpenChange={setOpen} />
    </>
  );
}