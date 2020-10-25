import React, { useEffect, useState } from "react";
import { useMachine, useService } from "@xstate/react";
import { Link } from "react-router-dom";
import { Group, GroupResponseItem, User } from "../models";
import { transactionFiltersMachine } from "../machines/transactionFiltersMachine";
import GroupContainer from "../containers/GroupContainer";
import styled from "styled-components";
import axios from "axios";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  Input,
  Chip,
  MenuItem,
} from "@material-ui/core";
import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

type GroupDetailsForNewGroup = {
  groupName: string;
  avatar: string;
  groupMembersIds: string;
};

//material-UI:
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  })
);

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

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const AllGroupsContainer: React.FC<Props> = ({ authService }) => {
  const classes = useStyles();
  const theme = useTheme();

  const [authState] = useService(authService);
  const [personName, setPersonName] = useState<string[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [allGroups, setAllGroups] = useState<GroupResponseItem[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { register, handleSubmit, errors } = useForm<GroupDetailsForNewGroup>();

  const currentUser = authState?.context?.user;

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPersonName(event.target.value as string[]);  
  };

  useEffect(() => {
    fetchGroups();
    fetchAllUsers();
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

  const fetchAllUsers: () => Promise<void> = async () => {
    const { data } = await axios({
      method: "GET",
      url: `http://localhost:3001/users/friends/${currentUser?.id}`,
    });
    const allUsers = data.results;
    setFriends(allUsers);
  };

  const onSubmit = (data: GroupDetailsForNewGroup) => {
    // data.groupMembersIds = data.groupMembersIds.split(',') ;
    axios.post("http://localhost:3001/groups", data);
    closeNewGroupModal();
    setPersonName([]);
  };

  const openNewGroupModal: () => void = () => {
    setModalOpen(true);
  };
  const closeNewGroupModal: () => void = () => {
    setModalOpen(false);
  };

  return (
    <>
      {/* {modalOpen ? alert("open") : null} */}
      <Dialog open={modalOpen} onClose={closeNewGroupModal}>
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create new group, please enter your group name and image.
          </DialogContentText>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="groupName">Group name:</label>
            <TextField
              autoFocus
              margin="dense"
              label="group name"
              type="name"
              fullWidth
              name="groupName"
              inputRef={register({ required: true })}
              id="groupName"
            />
            {errors.groupName && errors.groupName.type === "required" && (
              <div>You must enter a group name</div>
            )}
            <label htmlFor="avatar">Group's Avatar (url):</label>
            <TextField
              margin="dense"
              label="group image"
              type="url"
              name="avatar"
              fullWidth
              id="groupAvatarUrl"
              inputRef={register({ required: true })}
            />
            <TextField style={{display:"none"}} name="groupMembersIds" value={personName} inputRef={register({required:true})}/>
            {errors.avatar && errors.avatar.type === "required" && (
              <div>You must enter an avatr</div>
            )}
            <label htmlFor="groupMembersIdss">Choose group members:</label>
          <Select
              fullWidth
              labelId="demo-mutiple-chip-label"
              id="contacts"
              type="text"
              name="groupMembersIdss"
              multiple
              value={personName}
              onChange={handleChange}
              input={<Input type="text" id="select-multiple-chip"></Input>}
              MenuProps={MenuProps}
              inputRef={register({ required: true })}
              renderValue={(selected) => (
                <div className={classes.chips} > 
                  {(selected as User[]).map((value) => (
                    <Chip key={value.id} label={value.firstName} className={classes.chip} />
                  ))}
                </div>
              )}
            >
              {friends?.map((friend) => (
                <MenuItem key={friend.id} ref={register} 
                  value={friend.id} style={getStyles(friend.firstName, personName, theme)}
                >
                  {`${friend.firstName} ${friend.lastName}`}
                </MenuItem>
              ))}
          </Select>
            
            {errors.groupMembersIds && errors.groupMembersIds.type === "required" && (
              <div>You must choose at least one group member</div>
            )}
            <Button type="submit" name="submit">
              Create
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <NewGroupButton onClick={openNewGroupModal}>New Group</NewGroupButton>
      <h1>Groups</h1>
      {allGroups.map((group: GroupResponseItem, i: number) => {
        return (
          <Link to={`/groups/${group.id}`}>
            <GroupCard key={i}>
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
