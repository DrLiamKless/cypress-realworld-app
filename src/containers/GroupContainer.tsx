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
import { useService } from "@xstate/react";
import { authService } from "machines/authMachine";

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

const GroupContainer: React.FC = () => {
  const [authState] = useService(authService);
  const [groupDetails, setGroupDetails] = useState<GroupResponseItem>();
  const [allTransactions, setAllTransactions] = useState<TransactionResponseItem[]>();
  const [index, setIndex] = useState(0);
  const params: { groupId: string } = useParams();
  const groupId = params.groupId;

  const currentUser = authState?.context?.user;

  useEffect(() => {
    fetchGroupDetails();
    fetchTransactions(index);
  }, []);

  const fetchTransactions: (index: number) => Promise<void> = async (index: number) => {
    const { data } = await axios({
      method: "get",
      url: `http://localhost:3001/transactions/groups/${groupId}/${index}`,
      // data: {user: currentUser}
    });
    const transactions: TransactionResponseItem[] = data.transactions;
    // const transactions3 = transactions.slice(0, 3); // to make it easier for the server we sliced the r esponse
    transactions.forEach((transaction) => {
      transaction.likes = [];
      transaction.comments = [];
    });
    if (transactions.length > 0) {
      setIndex(index);
    }
    setAllTransactions(transactions);
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
      <h3>
        Members:{" "}
        {groupDetails?.members
          .map((member) => (member[1] === currentUser?.username ? "You" : member[1]))
          .join(", ")}
      </h3>
      {allTransactions &&
        allTransactions.map((transaction, i) => {
          return <TransactionItem key={i} transaction={transaction} />;
        })}
      <button onClick={() => (index !== 0 ? fetchTransactions(index - 1) : "")}>back</button>
      <button onClick={() => fetchTransactions(index + 1)}>next</button>
    </div>
  );
};

export default GroupContainer;
