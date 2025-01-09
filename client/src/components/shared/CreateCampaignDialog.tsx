import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContractContext } from '../../context/contractContext';
import { Textarea } from "@/components/ui/textarea"

const CreateCampaignDialog: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [goal, setGoal] = useState<number>(5);
  const { createCampaign } = useContractContext();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Campaign</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Campaign</DialogTitle>
          <DialogDescription>
            Enter the details for your new campaign below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            onChange={(e) => setName(e.target.value)}
            placeholder="Campaign Name"
          />
          <Textarea
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Campaign Description"
          />
          <Input
            type="number"
            onChange={(e) => setGoal(Number(e.target.value))}
            placeholder="Campaign Goal (in ETH)"
          />
        </div>
        <Button onClick={() => createCampaign(name, description, goal.toString())}>
          Create Campaign
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaignDialog;
