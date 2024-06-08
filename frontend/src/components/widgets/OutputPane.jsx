import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './react-tabs.css';
import TerminalComponent from "../widgets/Terminal";
import { devUrlAtom } from "../../recoil/atoms/devUrlAtom";

import { useRecoilValue } from "recoil";


const OutputPane = ({ socket }) => {
    const devUrl = useRecoilValue(devUrlAtom);

    return <Tabs onSelect={() => console.log('selected')}>
        <TabList>
            <Tab>Terminal</Tab>
        </TabList>

        <TabPanel>
            <div className="px-4">
                <TerminalComponent socket={socket} />
            </div>
        </TabPanel>
    </Tabs>
};

export default OutputPane;