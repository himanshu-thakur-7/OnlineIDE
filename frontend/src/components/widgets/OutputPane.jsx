import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './react-tabs.css';
import TerminalComponent from "../widgets/Terminal";
const OutputPane = ({ socket }) => (
    <Tabs>
        <TabList>
            <Tab>Terminal</Tab>
            <Tab>Output</Tab>
        </TabList>

        <TabPanel>
            <div className="px-4">
                <TerminalComponent socket={socket} />
            </div>
        </TabPanel>
        <TabPanel>
            <h2>Output Window</h2>
        </TabPanel>
    </Tabs>
);

export default OutputPane;