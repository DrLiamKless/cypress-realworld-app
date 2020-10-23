///<reference path="types.ts" />

import express from "express";
import { remove, isEmpty, slice, concat } from "lodash/fp";
import {
  getGroupByIdForApi,
  createTransaction,
  updateTransactionById,
  getPublicTransactionsDefaultSort,
  getTransactionsForUserContacts,
  getTransactionsForUserForApi,
  getPublicTransactionsByQuery,
  getGroupsForUserForApi,
  createGroup,
  createGroupMemberInBulk,
  removeGroupById,
  getGroupById,
  removeGroupMemberById,
} from "./database";
import { ensureAuthenticated, validateMiddleware } from "./helpers";
import {
  isGroupValidator,
  sanitizeTransactionStatus,
  sanitizeRequestStatus,
  isTransactionQSValidator,
  isTransactionPayloadValidator,
  shortIdValidation,
  isTransactionPatchValidator,
  isTransactionPublicQSValidator,
  isNewGroupMembersValidator,
} from "./validators";
import { getPaginatedItems } from "../src/utils/transactionUtils";
import {
  GroupMember,
  GroupMemberDetails,
  GroupResponseItem,
  PremissionsLevel,
} from "../src/models";
import { string } from "yup";
import { type } from "os";
const router = express.Router();

// Routes

//GET /groups - scoped user, auth-required
router.get(
  "/user/:userId",
  // ensureAuthenticated,
  // validateMiddleware([
  //   sanitizeTransactionStatus,
  //   sanitizeRequestStatus,
  //   ...isTransactionQSValidator,
  // ]),
  (req, res) => {
    /* istanbul ignore next */
    // const groups = getGroupsForUserForApi(req.user?.id!, req.query); // TODO: change endpoint to work like this with client
    // console.log(req.user?.id!);
    const groups: GroupResponseItem[] = getGroupsForUserForApi(req.params.userId);
    // groups = groups.map(group=>{group.members = getGroupMemberDetailsForGroup(group.members)})

    // const { totalPages, data: paginatedItems } = getPaginatedItems( //TODO: change endpoint & db to work with query filters
    //   req.query.page,
    //   req.query.limit,
    //   transactions
    // );

    res.status(200);
    res.json({
      // pageData: {
      //   page: res.locals.paginate.page,
      //   limit: res.locals.paginate.limit,
      //   hasNextPages: res.locals.paginate.hasNextPages(totalPages),
      //   totalPages,
      // },
      // results: paginatedItems,
      results: groups,
    });
  }
);

//GET /transactions/contacts - scoped user, auth-required
// router.get(
//   "/contacts",
//   ensureAuthenticated,
//   validateMiddleware([
//     sanitizeTransactionStatus,
//     sanitizeRequestStatus,
//     ...isTransactionQSValidator,
//   ]),
//   (req, res) => {
//     /* istanbul ignore next */
//     const transactions = getTransactionsForUserContacts(req.user?.id!, req.query);

//     const { totalPages, data: paginatedItems } = getPaginatedItems(
//       req.query.page,
//       req.query.limit,
//       transactions
//     );

//     res.status(200);
//     res.json({
//       pageData: {
//         page: res.locals.paginate.page,
//         limit: res.locals.paginate.limit,
//         hasNextPages: res.locals.paginate.hasNextPages(totalPages),
//         totalPages,
//       },
//       results: paginatedItems,
//     });
//   }
// );

//GET /transactions/public - auth-required
// router.get(
//   "/public",
//   ensureAuthenticated,
//   validateMiddleware(isTransactionPublicQSValidator),
//   (req, res) => {
//     const isFirstPage = req.query.page === 1;

//     /* istanbul ignore next */
//     let transactions = !isEmpty(req.query)
//       ? getPublicTransactionsByQuery(req.user?.id!, req.query)
//       : /* istanbul ignore next */
//         getPublicTransactionsDefaultSort(req.user?.id!);

//     const { contactsTransactions, publicTransactions } = transactions;

//     let publicTransactionsWithContacts;

//     if (isFirstPage) {
//       const firstFiveContacts = slice(0, 5, contactsTransactions);

//       publicTransactionsWithContacts = concat(firstFiveContacts, publicTransactions);
//     }

//     const { totalPages, data: paginatedItems } = getPaginatedItems(
//       req.query.page,
//       req.query.limit,
//       isFirstPage ? publicTransactionsWithContacts : publicTransactions
//     );

//     res.status(200);
//     res.json({
//       pageData: {
//         page: res.locals.paginate.page,
//         limit: res.locals.paginate.limit,
//         hasNextPages: res.locals.paginate.hasNextPages(totalPages),
//         totalPages,
//       },
//       results: paginatedItems,
//     });
//   }
// );

//GET /groups/:groupId - scoped user
router.get(
  "/:groupId",
  // ensureAuthenticated,
  // validateMiddleware([shortIdValidation("transactionId")]),
  (req, res) => {
    const { groupId } = req.params; // TODO: when we create front - update to req.user?.id!

    const group = getGroupByIdForApi(groupId);

    res.status(200);
    res.json({ group });
  }
);

//POST /groups - scoped-user
router.post(
  "/",
  // ensureAuthenticated,
  // groupBodyValidator,
  validateMiddleware(isGroupValidator),
  (req, res) => {
    const groupDetails = req.body;
    const { groupMembersIds } = groupDetails;
    // const groupCreatorId = req.user?.id!;
    const groupCreatorId = req.user?.id!;
    if (!groupCreatorId) return res.status(400).json({ msg: "Bad request. No user given" });
    /* istanbul ignore next */
    // const group = createGroup(req.user?.id!, groupDetails); //TODO: update request to work with req.user?.id!
    const group = createGroup(groupCreatorId, groupDetails, groupMembersIds);

    res.status(200);
    res.json({ group });
  }
);

//Delete /groups
router.delete(
  "/:groupId",
  // validateMiddleware([shortIdValidation("groupId")]),
  (req, res) => {
    const { groupId } = req.params;
    const userId = "t45AiwidW";

    //check requesting user is the admin
    if (getGroupById(groupId).creatorId !== userId) return res.status(401);
    //delete group
    removeGroupById(groupId);

    res.status(204).end();
  }
);

//POST /group-member - scoped-user
router.post(
  "/:groupId/members",
  // ensureAuthenticated,
  validateMiddleware(isNewGroupMembersValidator),
  (req, res) => {
    const { newGroupMembersIds } = req.body;

    /* istanbul ignore next */
    // const group = createGroup(req.user?.id!, groupDetails); //TODO: update request to work with req.user?.id!
    const newGroupMembers = createGroupMemberInBulk(
      req.params.groupId,
      newGroupMembersIds.map(
        (id: string): GroupMemberDetails => {
          return { userId: id, premmisions: PremissionsLevel.member };
        }
      )
    );

    res.status(200);
    res.json({ newGroupMembers });
  }
);

// DELETE /groups/:groupId/member/kick
//kick group members (admins only)
router.delete(
  "/:groupId/kick/:groupMemberId",
  // validateMiddleware([shortIdValidation("groupId")]),
  (req, res) => {
    const userId = "t45AiwidW";
    const { groupId, groupMemberId } = req.params;

    //check requesting user is the admin
    if (getGroupById(groupId).creatorId !== userId) return res.status(401);
    //delete group
    console.log(groupMemberId, groupId);
    removeGroupMemberById(groupMemberId, groupId);

    res.status(204).end();
  }
);

// DELETE /groups/:groupId/member/leave
//leave group
router.delete("/:groupId/leave", validateMiddleware([shortIdValidation("groupId")]), (req, res) => {
  const userId = req.user?.id!;
  const { groupId } = req.params;

  //delete group
  removeGroupMemberById(userId, groupId);

  res.status(204).end();
});

//PATCH /transactions/:transactionId - scoped-user
// router.patch(
//   "/:transactionId",
//   ensureAuthenticated,
//   validateMiddleware([shortIdValidation("transactionId"), ...isTransactionPatchValidator]),
//   (req, res) => {
//     const { transactionId } = req.params;

//     /* istanbul ignore next */
//     updateTransactionById(transactionId, req.body);

//     res.sendStatus(204);
//   }
// );

export default router;
