import styled from "styled-components";

export const LoginButton = styled.button`
  background-color: rgb(255, 255, 255);
  border: 0;
  text-decoration: underline;
  font-size: 0.7rem;
  &:hover {
    color: #ffa600;
    cursor: pointer;
  }
`;

export const ButtonWrapper = styled.div`
  width: 80%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: right;
  padding-top: 5px;
  padding-bottom: 5px;
`;