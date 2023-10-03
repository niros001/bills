import React, {useCallback, useMemo, useState} from 'react';
import { Table, Input } from 'antd';
import {Container, Row, StyledInput, StyledButton, Result} from './shared';

const defaultPrices = [
  {count: 2.07, price: 6.548},
  {count: 13.12, price: 6.749},
  {count: 2.07, price: 6.548},
  {count: 13.12, price: 6.749},
  {count: 0.64, price: 12.018},
  {count: 4.07, price: 13.387},
];

const WaterTab = () => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [amount, setAmount] = useState('');
  const [prices, setPrices] = useState(defaultPrices);
  const [used, setUsed] = useState(0);
  const [additional, setAdditional] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalIncludeTax, setTotalIncludeTax] = useState(0);

  const disabled = useMemo(() => Number(start) >= Number(end), [end, start]);

  const columns = useMemo(() => ([
    {
      title: '',
      dataIndex: 'key',
      rowScope: 'row',
    },
    {
      title: 'כמות',
      dataIndex: 'count',
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={({target: {value}}) => {
            const newPrices = [...prices];
            newPrices[index].count = Number(value);
            setPrices(newPrices);
          }}
        />
      ),
    },
    {
      title: 'מחיר ללא מע״מ',
      dataIndex: 'price',
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={({target: {value}}) => {
            const newPrices = [...prices];
            newPrices[index].price = Number(value);
            setPrices(newPrices);
          }}
        />
      ),
    },
  ]), [prices]);

  const data = useMemo(() => prices.map((item, index) => ({...item, key: `תעריף ${index + 1}`})), [prices]);

  const onCalculate = useCallback(() => {
    // Usage
    const tenant = Number((Number(end) - Number(start)).toFixed(2));
    const landlord = Number((Number(amount) - tenant).toFixed(2));

    // Counters
    let tempTenantCount = tenant;
    let tempLandLordCount = landlord;

    let tempUsed = 0;
    let tempAdditionalUsed = 0;
    let reduceSameLvl = 0;

    prices.forEach((item, index) => {
      const tenantCalcValue = ((index + 1) === prices.length) ? tempTenantCount : Math.min(tempTenantCount, item.count);
      if (tenantCalcValue > 0) {
        tempUsed += (tenantCalcValue * item.price);
        tempTenantCount -= tenantCalcValue;
      }
      if ((tempLandLordCount > 0)) {
        if (!!tenantCalcValue) { // Same lvl
          const landLordCalcValue = ((index + 1) === prices.length) ?
            tempLandLordCount :
            Math.min(tempLandLordCount, Number((item.count - tenantCalcValue).toFixed(2)));
          tempLandLordCount -= landLordCalcValue;
          reduceSameLvl = landLordCalcValue;
        } else { // New lvl
          const landLordCalcValue = ((index + 1) === prices.length) ?
            tempLandLordCount :
            Math.min(tempLandLordCount, item.count);
          tempLandLordCount -= (landLordCalcValue);
          tempAdditionalUsed += (landLordCalcValue * item.price);
        }
      }
    });

    let avgPriceOfUsed = tempUsed / tenant;
    let avgPriceOfAdditional = (landlord - reduceSameLvl) ? (tempAdditionalUsed / (landlord - reduceSameLvl)) : 0;
    const tempAdditional = avgPriceOfAdditional > avgPriceOfUsed ?
      ((avgPriceOfAdditional - avgPriceOfUsed) * (tenant / Number(amount))) : 0;

    setUsed(tempUsed);
    setAdditional(tempAdditional);
    setTotal(tempUsed + tempAdditional);
    setTotalIncludeTax((tempUsed + tempAdditional) * 1.17);
    }, [end, start, amount, prices]);

  return (
    <Container>
      <StyledInput
        type="number"
        addonBefore="שעון התחלה"
        placeholder="הכנס מספר שעון"
        onChange={({target: {value}}) => setStart(value)}
      />
      <StyledInput
        type="number"
        addonBefore="שעון סיום"
        placeholder="הכנס מספר שעון"
        onChange={({target: {value}}) => setEnd(value)}
      />
      <StyledInput
        type="number"
        addonBefore="סה״כ צריכה לחיוב (משותף)"
        placeholder="הכנס צריכה"
        onChange={({target: {value}}) => setAmount(value)}
      />
      <Table size="small" columns={columns} dataSource={data} bordered pagination={false} />
      <Row>
        <span>מחיר שימוש: </span>
        {!!used && <Result>{`${used.toFixed(2)}₪`}</Result>}
      </Row>
      <Row>
        <span>תוספת יחסית לתעריף גבוה: </span>
        {!!total && <Result>{`${additional.toFixed(2)}₪`}</Result>}
      </Row>
      <Row>
        <span>סה״כ: </span>
        {!!total && <Result>{`${total.toFixed(2)}₪`}</Result>}
      </Row>
      <Row>
        <span>סה״כ כולל מע״מ: </span>
        {!!totalIncludeTax && <Result className="final">{`${totalIncludeTax.toFixed(2)}₪`}</Result>}
      </Row>
      <StyledButton type="primary" onClick={onCalculate} disabled={disabled}>חשב</StyledButton>
    </Container>
  )
};

export default WaterTab;
