import React from 'react';
import { Tabs } from 'antd';
import styled from 'styled-components';
import {WaterTab, ElectricityTab} from './components';

const Container = styled.div`
  padding: 12px;
  direction: rtl;
`;

const items = [
  {
    key: '1',
    label: 'חשבון מיים',
    children: <WaterTab />,
  },
  {
    key: '2',
    label: 'חשבון חשמל',
    children: <ElectricityTab />,
  },
];

const App = () => (
  <Container>
    <Tabs defaultActiveKey="1" items={items} />
  </Container>
);

export default App;
