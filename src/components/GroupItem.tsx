import React from "react";
import { ListItem, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { GroupResponseItem } from "../models";
import { useHistory } from "react-router";
import styled from "styled-components";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(0),
    margin: "auto",
    width: "100%",
  },
  avatar: {
    width: theme.spacing(2),
  },
  socialStats: {
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(2),
    },
  },
  countIcons: {
    color: theme.palette.grey[400],
  },
  countText: {
    color: theme.palette.grey[400],
    marginTop: 2,
    height: theme.spacing(2),
    width: theme.spacing(2),
  },
}));

type GroupProps = {
  group: GroupResponseItem;
};

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

const TransactionItem: React.FC<GroupProps> = ({ group }) => {
  const currentUser = { username: "omri_zil" }; // need the change
  const classes = useStyles();
  const history = useHistory();

  const showTransactionDetail = (groupId: string) => {
    history.push(`/transaction/${groupId}`);
  };

  return (
    <ListItem
      data-test={`transaction-item-${group.id}`}
      alignItems="flex-start"
      onClick={() => showTransactionDetail(group.id)}
    >
      <Paper className={classes.paper} elevation={0}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm container>
            <Link to={`/groups/${group.id}`}>
              <GroupCard key={group.id}>
                <GroupCardImg src={group.avatar} />
                <GroupCardDetails>
                  <GroupCardTitle>{group.groupName}</GroupCardTitle>
                  <GroupCardMembers>
                    {group.members
                      .map((member) => (member[1] === currentUser?.username ? "You" : member[1]))
                      .join(", ")}
                  </GroupCardMembers>
                </GroupCardDetails>
              </GroupCard>
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </ListItem>
  );
};

export default TransactionItem;
