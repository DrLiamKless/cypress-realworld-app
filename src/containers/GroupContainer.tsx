import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TransactionItem from "../components/TransactionItem";
import {
  TransactionResponseItem,
  TransactionStatus,
  DefaultPrivacyLevel,
  GroupResponseItem,
} from "../models";
import axios from "axios";
import styled from "styled-components";
import GroupBackButton from "components/GroupBackButton";

const exampleTransactions: TransactionResponseItem[] = [
  {
    receiverName: "Kaylin Homenick",
    senderName: "Arely Kertzmann",
    receiverAvatar: "https://avatars.dicebear.com/api/human/bDjUb4ir5O.svg",
    senderAvatar: "https://avatars.dicebear.com/api/human/qywYp6hS0U.svg",
    likes: [],
    comments: [],
    id: "4AvM8cN1DdS",
    uuid: "078d6677-8ffc-4fb9-8c4a-51eccff25003",
    source: "lWfxENA5ZNy",
    amount: 19085,
    description: "Payment: qywYp6hS0U to bDjUb4ir5O",
    privacyLevel: DefaultPrivacyLevel.public,
    receiverId: "bDjUb4ir5O",
    senderId: "qywYp6hS0U",
    balanceAtCompletion: 49730,
    status: TransactionStatus.pending,
    requestStatus: "",
    requestResolvedAt: "2020-03-07T03:51:12.083Z",
    createdAt: new Date(),
    modifiedAt: new Date(),
  },
  {
    receiverName: "Kaylin Homenick",
    senderName: "Arely Kertzmann",
    receiverAvatar: "https://avatars.dicebear.com/api/human/bDjUb4ir5O.svg",
    senderAvatar: "https://avatars.dicebear.com/api/human/qywYp6hS0U.svg",
    likes: [],
    comments: [],
    id: "4AvM8cN1DdS",
    uuid: "078d6677-8ffc-4fb9-8c4a-51eccff25003",
    source: "lWfxENA5ZNy",
    amount: 19085,
    description: "Payment: qywYp6hS0U to bDjUb4ir5O",
    privacyLevel: DefaultPrivacyLevel.public,
    receiverId: "bDjUb4ir5O",
    senderId: "qywYp6hS0U",
    balanceAtCompletion: 49730,
    status: TransactionStatus.pending,
    requestStatus: "",
    requestResolvedAt: "2020-03-07T03:51:12.083Z",
    createdAt: new Date(),
    modifiedAt: new Date(),
  },
  {
    receiverName: "Kaylin Homenick",
    senderName: "Arely Kertzmann",
    receiverAvatar: "https://avatars.dicebear.com/api/human/bDjUb4ir5O.svg",
    senderAvatar: "https://avatars.dicebear.com/api/human/qywYp6hS0U.svg",
    likes: [],
    comments: [],
    id: "4AvM8cN1DdS",
    uuid: "078d6677-8ffc-4fb9-8c4a-51eccff25003",
    source: "lWfxENA5ZNy",
    amount: 19085,
    description: "Payment: qywYp6hS0U to bDjUb4ir5O",
    privacyLevel: DefaultPrivacyLevel.public,
    receiverId: "bDjUb4ir5O",
    senderId: "qywYp6hS0U",
    balanceAtCompletion: 49730,
    status: TransactionStatus.pending,
    requestStatus: "",
    requestResolvedAt: "2020-03-07T03:51:12.083Z",
    createdAt: new Date(),
    modifiedAt: new Date(),
  },
];

// const InformationBar = styled.div`
//   width: 100%;
//   height: 15vh;
//   background-color: red;
// `;

const GroupContainer: React.FC = () => {
  const [groupDetails, setGroupDetails] = useState<GroupResponseItem>();
  const [allTransactions, setAllTransactions] = useState<TransactionResponseItem[]>();
  const params: { groupId: string } = useParams();
  const groupId = params.groupId;

  useEffect(() => {
    fetchGroupDetails();
    fetchTransactions();
  }, []);

  const fetchTransactions: () => Promise<void> = async () => {
    const { data } = await axios({
      method: "get",
      url: `http://localhost:3001/transactions/groups/${groupId}`,
      // data: {user: currentUser}
    });
    const transactions: TransactionResponseItem[] = data.transactions;
    const transactions3 = transactions.slice(0, 3); // to make it easier for the server we sliced the r esponse
    transactions3.forEach((transaction) => {
      transaction.likes = [];
      transaction.comments = [];
    });
    setAllTransactions(transactions3);
  };

  const fetchGroupDetails: () => Promise<void> = async () => {
    const { data } = await axios({
      method: "GET",
      url: `http://localhost:3001/groups/${groupId}`,
    });
    setGroupDetails(data.group);
  };

  console.log(groupDetails);
  return (
    <div>
      {/* <InformationBar>
        <div id="header">{groupDetails?.groupName}</div>
        <div id="members">{groupDetails?.members.map((member) => member[1]).join(", ")}</div>
      </InformationBar> */}
      <GroupBackButton />
      <h1>{groupDetails?.groupName}</h1>
      {allTransactions &&
        allTransactions.map((transaction, i) => {
          return <TransactionItem key={i} transaction={transaction} />;
        })}
    </div>
  );
};

export default GroupContainer;
