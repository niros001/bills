import React, {useCallback, useMemo, useState} from 'react';
import { Table, InputNumber } from 'antd';
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
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [amount, setAmount] = useState(0);
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
        <InputNumber
          value={text}
          onChange={(value) => {
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
        <InputNumber
          value={text}
          onChange={(value) => {
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
    let tenantCount = tenant;
    let landlordCount = landlord;

    let tempUsed = 0;
    let tempAdditionalUsed = 0;
    let reduceSameLvl = 0;

    prices.forEach((item, index) => {
      const tenantCalcValue = ((index + 1) === prices.length) ? tenantCount : Math.min(tenantCount, item.count);
      if (tenantCalcValue > 0) {
        tempUsed += (tenantCalcValue * item.price);
        tenantCount -= tenantCalcValue;
      }
      if ((landlordCount > 0)) {
        if (!!tenantCalcValue) { // Same lvl
          const landlordCalcValue = ((index + 1) === prices.length) ?
            landlordCount :
            Math.min(landlordCount, Number((item.count - tenantCalcValue).toFixed(2)));
          landlordCount -= landlordCalcValue;
          reduceSameLvl = landlordCalcValue;
        } else { // New lvl
          const landlordCalcValue = ((index + 1) === prices.length) ?
            landlordCount :
            Math.min(landlordCount, item.count);
          landlordCount -= (landlordCalcValue);
          tempAdditionalUsed += (landlordCalcValue * item.price);
        }
      }
    });

    let avgPriceOfUsed = tempUsed / tenant;
    const landlordRelevantCount = landlord - reduceSameLvl;
    let avgPriceOfAdditional = landlordRelevantCount ? (tempAdditionalUsed / landlordRelevantCount) : 0;
    const tempAdditional = avgPriceOfAdditional > avgPriceOfUsed ?
      ((avgPriceOfAdditional - avgPriceOfUsed) * landlordRelevantCount * (tenant / Number(amount))) : 0;

    setUsed(tempUsed);
    setAdditional(tempAdditional);
    setTotal(tempUsed + tempAdditional);
    setTotalIncludeTax((tempUsed + tempAdditional) * 1.17);
    }, [end, start, amount, prices]);

  return (
    <Container>
      <StyledInput
        addonBefore="שעון התחלה"
        placeholder="הכנס מספר שעון"
        onChange={setStart}
      />
      <StyledInput
        addonBefore="שעון סיום"
        placeholder="הכנס מספר שעון"
        onChange={setEnd}
      />
      <StyledInput
        addonBefore="סה״כ צריכה לחיוב (משותף)"
        placeholder="הכנס צריכה"
        onChange={setAmount}
      />
      <Table size="small" columns={columns} dataSource={data} bordered pagination={false} />
      <Row>
        <span>מחיר שימוש: </span>
        {!!used && <Result>{`${used.toLocaleString()}₪`}</Result>}
      </Row>
      <Row>
        <span>תוספת יחסית לתעריף גבוה: </span>
        {!!total && <Result>{`${additional.toLocaleString()}₪`}</Result>}
      </Row>
      <Row>
        <span>סה״כ: </span>
        {!!total && <Result>{`${total.toLocaleString()}₪`}</Result>}
      </Row>
      <Row>
        <span>סה״כ כולל מע״מ: </span>
        {!!totalIncludeTax && <Result className="final">{`${totalIncludeTax.toLocaleString()}₪`}</Result>}
      </Row>
      <StyledButton type="primary" onClick={onCalculate} disabled={disabled}>חשב</StyledButton>
    </Container>
  )
};

export default WaterTab;
