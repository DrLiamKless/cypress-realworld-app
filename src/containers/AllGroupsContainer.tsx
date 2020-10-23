import React, { useEffect, useState } from "react";
import { useMachine, useService } from "@xstate/react";
import { Link } from "react-router-dom";
import { GroupResponseItem } from "../models";
import { transactionFiltersMachine } from "../machines/transactionFiltersMachine";
import GroupContainer from "../containers/GroupContainer";
import styled from "styled-components";
import axios from "axios";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const exampleGroups = [
  {
    id: "ncHDJ74vbKL1",
    uuid: "863246b4-42de-4001-a578-33e316a486c5",
    name: "Just Us Bro's",
    members: ["Alon", "Liam", "Tomer", "Nitzan"],
    creatorId: "t45AiwidW",
    avatar:
      "data:image/png;base64,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",
    createdAt: "2019-10-10T05:09:20.517Z",
    modifiedAt: "2020-05-21T12:24:00.749Z",
  },
  {
    id: "ncHDJ74vbKL1",
    uuid: "863246b4-42de-4001-a578-33e316a486c5",
    name: "Just Us Bro's",
    members: ["Alon", "Liam", "Tomer", "Nitzan"],
    creatorId: "t45AiwidW",
    avatar:
      "data:image/png;base64,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",
    createdAt: "2019-10-10T05:09:20.517Z",
    modifiedAt: "2020-05-21T12:24:00.749Z",
  },
  {
    id: "ncHDJ74vbKL1",
    uuid: "863246b4-42de-4001-a578-33e316a486c5",
    name: "Just Us Bro's",
    members: ["Alon", "Liam", "Tomer", "Nitzan"],
    creatorId: "t45AiwidW",
    avatar:
      "data:image/png;base64,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",
    createdAt: "2019-10-10T05:09:20.517Z",
    modifiedAt: "2020-05-21T12:24:00.749Z",
  },
];

//styled components
const GroupCard = styled.div`
  display: flex;
  background-color: rgba(250, 250, 255, 0.95);
  height: 20vh;
  margin-bottom: 3vh;
  box-shadow: -1px 1px 3px 0px rgba(0, 0, 0, 0.5);
  transition: 0.2s;
  cursor: pointer;

  :hover {
    transform: translate(1px, 3px);
    background-color: rgba(230, 230, 235, 0.95);
    box-shadow: -4px 4px 6px 1px rgba(0, 0, 0, 0.5);
  }
`;

const GroupCardImg = styled.img`
  width: auto;
  height: 100%;
`;
const GroupCardDetails = styled.div`
  width: 85%;
  padding: 0 15px;
`;
const GroupCardTitle = styled.div`
  font-size: 1.5rem;
  margin: 10px 0 6px;
`;

const GroupCardMembers = styled.div`
  font-size: 0.9rem;
`;

const NewGroupButton = styled.div`
  width: 8vw;
  padding: 2vh;
  background-color: rgb(55, 182, 81);
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

const AllGroupsContainer: React.FC<Props> = ({ authService }) => {
  const [authState] = useService(authService);

  const [currentFilters, sendFilterEvent] = useMachine(transactionFiltersMachine);
  const [allGroups, setAllGroups] = useState([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [bool, setBool] = useState(false);

  const currentUser = authState?.context?.user;

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups: () => Promise<void> = async () => {
    const { data } = await axios({
      method: "get",
      url: `http://localhost:3001/groups/user/${currentUser?.id}`,
      // data: {user: currentUser}
    });
    const groups = data.results;
    setAllGroups(groups);
  };

  const handleGroupCardClick = () => {
    // console.log(groupId);
    setBool(!bool);
  };

  const openNewGroupModal: () => void = () => {
    setModalOpen(true);
  };
  const closeNewGroupModal: () => void = () => {
    setModalOpen(false);
  };

  //   const hasDateRangeFilter = currentFilters.matches({ dateRange: "filter" });
  //   const hasAmountRangeFilter = currentFilters.matches({
  //     amountRange: "filter",
  //   });

  //   const dateRangeFilters = hasDateRangeFilter && getDateQueryFields(currentFilters.context);
  //   const amountRangeFilters = hasAmountRangeFilter && getAmountQueryFields(currentFilters.context);

  //   const Filters = (
  //     <TransactionListFilters
  //       dateRangeFilters={dateRangeFilters as TransactionDateRangePayload}
  //       amountRangeFilters={amountRangeFilters as TransactionAmountRangePayload}
  //       sendFilterEvent={sendFilterEvent}
  //     />
  //   );

  return (
    // <Switch>
    //   <Route exact path="/contacts">
    //     <TransactionContactsList
    //       filterComponent={Filters}
    //       dateRangeFilters={dateRangeFilters as TransactionDateRangePayload}
    //       amountRangeFilters={amountRangeFilters as TransactionAmountRangePayload}
    //     />
    //   </Route>
    //   <Route exact path="/personal">
    //     <TransactionPersonalList
    //       filterComponent={Filters}
    //       dateRangeFilters={dateRangeFilters as TransactionDateRangePayload}
    //       amountRangeFilters={amountRangeFilters as TransactionAmountRangePayload}
    //     />
    //   </Route>
    //   <Route exact path="/(public)?">
    //     <TransactionPublicList
    //       filterComponent={Filters}
    //       dateRangeFilters={dateRangeFilters as TransactionDateRangePayload}
    //       amountRangeFilters={amountRangeFilters as TransactionAmountRangePayload}
    //     />
    //   </Route>
    // </Switch>
    <>
      {modalOpen ? alert("open") : null}
      <NewGroupButton onClick={openNewGroupModal}>New Group</NewGroupButton>
      <h1>Groups</h1>
      {bool && <GroupContainer />}
      {!bool &&
        allGroups.map((group: GroupResponseItem, i: number) => {
          return (
            <Link to={`/groups/${group.id}`}>
              <GroupCard
                onClick={() => {
                  handleGroupCardClick();
                }}
                key={i}
              >
                <GroupCardImg src={group.avatar} />
                <GroupCardDetails>
                  <GroupCardTitle>{group.groupName}</GroupCardTitle>
                  <GroupCardMembers>
                    {group.members.map((member) => member[1]).join(", ")}
                  </GroupCardMembers>
                </GroupCardDetails>
              </GroupCard>
            </Link>
          );
        })}
    </>
  );
};

export default AllGroupsContainer;
