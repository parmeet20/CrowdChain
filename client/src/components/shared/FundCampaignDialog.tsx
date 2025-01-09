import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContractContext } from '../../context/contractContext';

interface FundCampaignDialogProps {
  campaignId: number;
}

const FundCampaignDialog: React.FC<FundCampaignDialogProps> = ({ campaignId }) => {
  const [fundAmount, setFundAmount] = useState<string>("");
  const { fundCampaign } = useContractContext();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Fund Campaign</DialogTitle>
        <DialogDescription>
          Enter the amount of ETH you'd like to contribute to this campaign.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <Input
          type="number"
          value={fundAmount}
          onChange={(e) => setFundAmount(e.target.value)}
          placeholder="Amount (ETH)"
        />
      </div>
      <Button onClick={() => fundCampaign(campaignId, fundAmount)}>
        Fund Campaign
      </Button>
    </DialogContent>
  );
};

export default FundCampaignDialog;
