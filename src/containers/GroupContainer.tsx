import React, { useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import { Switch, Route } from "react-router";
import { TransactionDateRangePayload, TransactionAmountRangePayload } from "../models";
import TransactionListFilters from "../components/TransactionListFilters";
import TransactionContactsList from "../components/TransactionContactsList";
import { transactionFiltersMachine } from "../machines/transactionFiltersMachine";
import { getDateQueryFields, getAmountQueryFields } from "../utils/transactionUtils";
import TransactionPersonalList from "../components/TransactionPersonalList";
import TransactionPublicList from "../components/TransactionPublicList";
import TransactionItem from "../components/TransactionItem";
import { TransactionResponseItem , TransactionStatus , DefaultPrivacyLevel } from "../models";
import styled from "styled-components";
import Axios from "axios";
import { group } from "console";
import { Translate } from "@material-ui/icons";


const exampleTransactions: TransactionResponseItem[] = [
    {
        receiverName:"Kaylin Homenick",
        senderName:"Arely Kertzmann",
        receiverAvatar:"https://avatars.dicebear.com/api/human/bDjUb4ir5O.svg",
        senderAvatar:"https://avatars.dicebear.com/api/human/qywYp6hS0U.svg",
        likes:[],
        comments:[],
        id:"4AvM8cN1DdS",
        uuid:"078d6677-8ffc-4fb9-8c4a-51eccff25003",
        source:"lWfxENA5ZNy",
        amount:19085,
        description:"Payment: qywYp6hS0U to bDjUb4ir5O",
        privacyLevel:DefaultPrivacyLevel.public,
        receiverId:"bDjUb4ir5O",
        senderId:"qywYp6hS0U",
        balanceAtCompletion:49730,
        status: TransactionStatus.pending,
        requestStatus:"",
        requestResolvedAt:"2020-03-07T03:51:12.083Z",
        createdAt: new Date(),
        modifiedAt: new Date()
    },
    {
        receiverName:"Kaylin Homenick",
        senderName:"Arely Kertzmann",
        receiverAvatar:"https://avatars.dicebear.com/api/human/bDjUb4ir5O.svg",
        senderAvatar:"https://avatars.dicebear.com/api/human/qywYp6hS0U.svg",
        likes:[],
        comments:[],
        id:"4AvM8cN1DdS",
        uuid:"078d6677-8ffc-4fb9-8c4a-51eccff25003",
        source:"lWfxENA5ZNy",
        amount:19085,
        description:"Payment: qywYp6hS0U to bDjUb4ir5O",
        privacyLevel:DefaultPrivacyLevel.public,
        receiverId:"bDjUb4ir5O",
        senderId:"qywYp6hS0U",
        balanceAtCompletion:49730,
        status: TransactionStatus.pending,
        requestStatus:"",
        requestResolvedAt:"2020-03-07T03:51:12.083Z",
        createdAt: new Date(),
        modifiedAt: new Date()
    },
    {
        receiverName:"Kaylin Homenick",
        senderName:"Arely Kertzmann",
        receiverAvatar:"https://avatars.dicebear.com/api/human/bDjUb4ir5O.svg",
        senderAvatar:"https://avatars.dicebear.com/api/human/qywYp6hS0U.svg",
        likes:[],
        comments:[],
        id:"4AvM8cN1DdS",
        uuid:"078d6677-8ffc-4fb9-8c4a-51eccff25003",
        source:"lWfxENA5ZNy",
        amount:19085,
        description:"Payment: qywYp6hS0U to bDjUb4ir5O",
        privacyLevel:DefaultPrivacyLevel.public,
        receiverId:"bDjUb4ir5O",
        senderId:"qywYp6hS0U",
        balanceAtCompletion:49730,
        status: TransactionStatus.pending,
        requestStatus:"",
        requestResolvedAt:"2020-03-07T03:51:12.083Z",
        createdAt: new Date(),
        modifiedAt: new Date()
    }
];

const GroupContainer: React.FC = () => {
    return (
        <div>
            <div>Group</div>
            {
                exampleTransactions.map((exTran) => {
                    return (
                        <TransactionItem transaction={exTran} />
                    )
                })
            }
        </div>
    );
};

export default GroupContainer ;









