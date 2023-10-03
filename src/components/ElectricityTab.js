import React, {useCallback, useMemo, useState} from 'react';
import {Container, Row, StyledInput, StyledButton, Result} from './shared';

const ElectricityTab = () => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [price, setPrice] = useState('51.34');
  const [total, setTotal] = useState(0);
  const [totalIncludeTax, setTotalIncludeTax] = useState(0);

  const disabled = useMemo(() => Number(start) >= Number(end), [end, start]);

  const onCalculate = useCallback(() => {
    const diff = Number(end) - Number(start);
    setTotal(diff * (price / 100));
    setTotalIncludeTax(diff * (price / 100) * 1.17);
  }, [end, start, price]);

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
        addonBefore="מחיר לקוט״ש באגורות"
        placeholder="הכנס מחיר"
        value={price}
        onChange={({target: {value}}) => setPrice(value)}
      />
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

export default ElectricityTab;
