import styled from "styled-components";

export const StyledFile = styled.div`
  flex-wrap: nowrap;
  display: flex;
  align-items: center;
  font-weight: normal;
  padding-left: ${(p) => p.theme.indent}px;
`;
