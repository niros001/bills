import styled from 'styled-components';
import {Button, Input} from 'antd';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledInput = styled(Input)`
  margin-bottom: 22px;
`;

export const StyledButton = styled(Button)`
  margin-top: 22px;
`;

export const Result = styled.b`
  margin-right: 5px;
  &.final {
    border: 4px solid lightgreen;
    border-radius: 40%;
    padding: 4px;
  }
`;
