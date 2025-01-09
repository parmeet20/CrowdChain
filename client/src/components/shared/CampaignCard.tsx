import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FundCampaignDialog from "./FundCampaignDialog";
import { Badge } from "@/components/ui/badge";
import { RadialBarChart, PolarRadiusAxis, RadialBar } from "recharts";
import { useContractContext } from "@/context/contractContext";

interface CampaignCardProps {
  campaign: {
    id: number;
    name: string;
    description: string;
    goal: number;
    fundRaised: number;
    isClosed: boolean;
    owner: string;
  };
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const { withdrawFunds, account } = useContractContext();

  const progressPercentage =
    (Number(ethers.formatEther(campaign.fundRaised)) /
      Number(ethers.formatEther(campaign.goal))) *
    100;
  console.log(progressPercentage);
  // Show only green if the campaign is not closed
  const chartData = [
    { value: progressPercentage, fill: "#FF4C4C" }, // Grey remaining portion
    { value: 100-progressPercentage, fill: "#4caf50" }, // Green progress portion
  ];
  

  const shortDescription = campaign.description.slice(0, 100) + "...";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          key={campaign.id}
          className="w-full max-w-md mx-auto bg-white space-y-6 rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all hover:bg-gray-100 hover:shadow-2xl"
        >
          <CardHeader className="p-4 flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-gray-800">
              {campaign.name}
            </CardTitle>
            <Badge variant={`${campaign.isClosed ? "destructive" : "success"}`}>
              {campaign.isClosed ? "Closed" : "Open"}
            </Badge>
          </CardHeader>

          <CardContent className="px-4 py-4 space-y-4">
            <CardDescription className="text-gray-600 text-sm">
              {shortDescription}
            </CardDescription>

            <div className="flex space-x-4 text-sm text-gray-500">
              <Button variant="outline" className="flex-1">
                Goal: {ethers.formatEther(campaign.goal)} ETH
              </Button>
              <Button variant="outline" className="flex-1">
                Fund Raised: {ethers.formatEther(campaign.fundRaised)} ETH
              </Button>
            </div>

            <Button
              variant={campaign.isClosed ? "outline" : "success"}
              disabled={campaign.isClosed}
              className="w-full mt-4"
            >
              {campaign.isClosed ? "Goal Met" : "Fund Campaign"}
            </Button>
          </CardContent>

          <CardFooter className="px-4 py-4 flex flex-col justify-between items-center rounded-b-lg">
            <p className="text-gray-500 py-2 text-sm">
              <strong>Owner:</strong> {campaign.owner}
            </p>
            {campaign.owner.toLowerCase() === account!.toLowerCase() && (
              <Button
                className="w-full my-2"
                onClick={() => withdrawFunds(Number(campaign.id))}
                disabled={
                  Number(ethers.formatEther(campaign.fundRaised)) <
                  Number(ethers.formatEther(campaign.goal))
                }
              >
                Withdraw Funds
              </Button>
            )}
          </CardFooter>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-2xl h-[600px] mx-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            {campaign.name}
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-gray-600 mb-6">
          <p>{campaign.description}</p>
        </DialogDescription>

        <div className="flex justify-center mb-6">
          <RadialBarChart
            width={180}
            height={180}
            innerRadius={50}
            outerRadius={70}
            data={chartData}
            startAngle={90}
            endAngle={450}
          >
            <RadialBar dataKey="value" cornerRadius="50%" />
            <PolarRadiusAxis tick={false} axisLine={false} />
            <g>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-bold text-xl fill-foreground"
              >
                {Math.round(progressPercentage)}%
              </text>
              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                className="fill-muted-foreground"
              >
                Raised
              </text>
            </g>
          </RadialBarChart>
        </div>

        <div className="flex space-x-4 text-sm text-gray-500 mb-4">
          <Button variant="outline" className="flex-1">
            Goal: {ethers.formatEther(campaign.goal)} ETH
          </Button>
          <Button variant="outline" className="flex-1">
            Fund Raised: {ethers.formatEther(campaign.fundRaised)} ETH
          </Button>
        </div>

        {campaign.owner.toLowerCase() === account!.toLowerCase() && (
          <Button
            className="w-full"
            onClick={() => withdrawFunds(Number(campaign.id))}
            disabled={
              Number(ethers.formatEther(campaign.fundRaised)) <
              Number(ethers.formatEther(campaign.goal))
            }
          >
            Withdraw Funds
          </Button>
        )}

        <Dialog>
          <DialogTrigger asChild>
            {!campaign.isClosed && (
              <Button
                variant={"success"}
                disabled={campaign.isClosed}
                className="w-full mt-4"
              >
                Fund Campaign
              </Button>
            )}
          </DialogTrigger>
          <FundCampaignDialog campaignId={campaign.id} />
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignCard;
