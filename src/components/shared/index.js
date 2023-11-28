import styled from 'styled-components';
import {Button, InputNumber} from 'antd';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledInput = styled(InputNumber)`
  margin-bottom: 22px;
`;

export const StyledButton = styled(Button)`
  margin: 22px 0;
`;

export const Result = styled.b`
  margin-right: 5px;
  &.final {
    border: 4px solid lightgreen;
    border-radius: 40%;
    padding: 4px;
  }
`;
