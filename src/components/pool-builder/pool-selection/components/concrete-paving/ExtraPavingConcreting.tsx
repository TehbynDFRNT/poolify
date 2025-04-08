
import React, { useState } from "react";
import { ExtraPavingConcrete } from "./ExtraPavingConcrete";
import { PavingOnExistingConcrete } from "./PavingOnExistingConcrete";
import { ExtraConcreting } from "./ExtraConcreting";
import { ConcretePumpSelector } from "./ConcretePumpSelector";
import { UnderFenceConcreteStrips } from "./UnderFenceConcreteStrips";
import { ConcreteCuts } from "./ConcreteCuts";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Pool } from "@/types/pool";

interface ExtraPavingConcretingProps {
  pool: Pool;
  customerId: string;
}

export const ExtraPavingConcreting: React.FC<ExtraPavingConcretingProps> = ({ pool, customerId }) => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className="space-y-6">
      <Tabs
        selectedIndex={tabIndex}
        onSelect={(index) => setTabIndex(index)}
        className="border rounded-lg shadow-sm bg-white"
      >
        <TabList className="flex border-b">
          <Tab className="py-3 px-4 cursor-pointer font-medium hover:bg-slate-50 border-b-2 border-transparent data-[selected]:border-primary data-[selected]:text-primary">
            Extra Paving
          </Tab>
          <Tab className="py-3 px-4 cursor-pointer font-medium hover:bg-slate-50 border-b-2 border-transparent data-[selected]:border-primary data-[selected]:text-primary">
            Existing Concrete
          </Tab>
          <Tab className="py-3 px-4 cursor-pointer font-medium hover:bg-slate-50 border-b-2 border-transparent data-[selected]:border-primary data-[selected]:text-primary">
            Extra Concreting
          </Tab>
          <Tab className="py-3 px-4 cursor-pointer font-medium hover:bg-slate-50 border-b-2 border-transparent data-[selected]:border-primary data-[selected]:text-primary">
            Concrete Pump
          </Tab>
          <Tab className="py-3 px-4 cursor-pointer font-medium hover:bg-slate-50 border-b-2 border-transparent data-[selected]:border-primary data-[selected]:text-primary">
            Fence Strips
          </Tab>
          <Tab className="py-3 px-4 cursor-pointer font-medium hover:bg-slate-50 border-b-2 border-transparent data-[selected]:border-primary data-[selected]:text-primary">
            Concrete Cuts
          </Tab>
        </TabList>

        <div className="p-4">
          <TabPanel>
            <ExtraPavingConcrete pool={pool} customerId={customerId} />
          </TabPanel>
          <TabPanel>
            <PavingOnExistingConcrete pool={pool} customerId={customerId} />
          </TabPanel>
          <TabPanel>
            <ExtraConcreting pool={pool} customerId={customerId} />
          </TabPanel>
          <TabPanel>
            <ConcretePumpSelector pool={pool} customerId={customerId} />
          </TabPanel>
          <TabPanel>
            <UnderFenceConcreteStrips pool={pool} customerId={customerId} />
          </TabPanel>
          <TabPanel>
            <ConcreteCuts pool={pool} customerId={customerId} />
          </TabPanel>
        </div>
      </Tabs>
    </div>
  );
};
