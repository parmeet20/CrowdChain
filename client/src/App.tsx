import React from 'react';
import { useContractContext } from './context/contractContext';
import Navbar from './components/shared/Navbar';
import CampaignCard from './components/shared/CampaignCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const App: React.FC = () => {
  const { campaigns } = useContractContext();

  const openCampaigns = campaigns.filter((campaign) => !campaign.isClosed);
  const closedCampaigns = campaigns.filter((campaign) => campaign.isClosed);

  return (
    <div>
      <Navbar />
      <div className="pt-24 px-4">
        <h2 className="text-2xl text-white font-semibold mb-4">All Campaigns</h2>

        <Tabs defaultValue="open" className="w-full">
          <TabsList className="flex space-x-4  max-w-[300px]">
            <TabsTrigger value="open">Open Campaigns</TabsTrigger>
            <TabsTrigger value="closed">Closed Campaigns</TabsTrigger>
          </TabsList>

          <TabsContent value="open">
            {openCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {openCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            ) : (
              <p className="text-white">No open campaigns yet.</p>
            )}
          </TabsContent>

          <TabsContent value="closed">
            {closedCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {closedCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            ) : (
              <p className="text-white">No closed campaigns yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default App;
