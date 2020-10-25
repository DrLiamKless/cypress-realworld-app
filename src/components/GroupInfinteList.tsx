import React from "react";
import { get } from "lodash/fp";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { InfiniteLoader, List, Index } from "react-virtualized";
import "react-virtualized/styles.css"; // only needs to be imported once

import GroupItem from "./GroupItem";
import { GroupResponseItem, GroupPagination } from "../models";
import { useMediaQuery, Divider } from "@material-ui/core";

export interface GroupListProps {
  groups: GroupResponseItem[];
  loadNextPage: Function;
  pagination: GroupPagination;
}

const useStyles = makeStyles((theme) => ({
  transactionList: {
    width: "100%",
    minHeight: "80vh",
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

const GroupInfiniteList: React.FC<GroupListProps> = ({ groups, loadNextPage, pagination }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isXsBreakpoint = useMediaQuery(theme.breakpoints.down("xs"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const itemCount = pagination.hasNextPages ? groups.length + 1 : groups.length;

  const loadMoreItems = () => {
    return new Promise((resolve) => {
      return resolve(pagination.hasNextPages && loadNextPage(pagination.page + 1));
    });
  };

  const isRowLoaded = (params: Index) => !pagination.hasNextPages || params.index < groups.length;

  // @ts-ignore
  function rowRenderer({ key, index, style }) {
    const group = get(index, groups);

    if (index < groups.length) {
      return (
        <div key={key} style={style}>
          <GroupItem group={group} />
          <Divider variant={isMobile ? "fullWidth" : "inset"} />
        </div>
      );
    }
  }

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreItems}
      rowCount={itemCount}
      threshold={2}
    >
      {({ onRowsRendered, registerChild }) => (
        <div data-test="transaction-list" className={classes.transactionList}>
          <List
            rowCount={itemCount}
            ref={registerChild}
            onRowsRendered={onRowsRendered}
            height={isXsBreakpoint ? theme.spacing(74) : theme.spacing(88)}
            width={isXsBreakpoint ? theme.spacing(38) : theme.spacing(110)}
            rowHeight={isXsBreakpoint ? theme.spacing(28) : theme.spacing(16)}
            rowRenderer={rowRenderer}
          />
        </div>
      )}
    </InfiniteLoader>
  );
};

export default GroupInfiniteList;
