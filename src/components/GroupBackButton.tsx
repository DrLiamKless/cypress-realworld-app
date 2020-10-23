import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const BackButton = styled.div`
  width: 5vw;
  padding: 2vh;
  background-color: rgb(63, 81, 181);
  box-shadow: -1px 1px 3px 0px rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
  transition: 0.25s;

  :hover {
    box-shadow: -4px 4px 6px 1px rgba(0, 0, 0, 0.5);
    transform: translate(-1px, -2px);
  }
`;

const GroupBackButton: React.FC = () => {
  return (
    <Link to="/groups">
      <BackButton>Back</BackButton>
    </Link>
  );
};

export default GroupBackButton;
