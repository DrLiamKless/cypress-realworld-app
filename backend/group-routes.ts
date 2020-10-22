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
  // createGroup,
  // createGroupMember,
} from "./database";
import { ensureAuthenticated, validateMiddleware } from "./helpers";
import {
  sanitizeTransactionStatus,
  sanitizeRequestStatus,
  isTransactionQSValidator,
  isTransactionPayloadValidator,
  shortIdValidation,
  isTransactionPatchValidator,
  isTransactionPublicQSValidator,
} from "./validators";
import { getPaginatedItems } from "../src/utils/transactionUtils";
import { GroupResponseItem } from "models";
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
    console.log(req.params.id);
    let groups: GroupResponseItem[] = getGroupsForUserForApi(req.params.userId);
    console.log(groups);
    // console.log(groups);
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
router.get(
  "/contacts",
  ensureAuthenticated,
  validateMiddleware([
    sanitizeTransactionStatus,
    sanitizeRequestStatus,
    ...isTransactionQSValidator,
  ]),
  (req, res) => {
    /* istanbul ignore next */
    const transactions = getTransactionsForUserContacts(req.user?.id!, req.query);

    const { totalPages, data: paginatedItems } = getPaginatedItems(
      req.query.page,
      req.query.limit,
      transactions
    );

    res.status(200);
    res.json({
      pageData: {
        page: res.locals.paginate.page,
        limit: res.locals.paginate.limit,
        hasNextPages: res.locals.paginate.hasNextPages(totalPages),
        totalPages,
      },
      results: paginatedItems,
    });
  }
);

//GET /transactions/public - auth-required
router.get(
  "/public",
  ensureAuthenticated,
  validateMiddleware(isTransactionPublicQSValidator),
  (req, res) => {
    const isFirstPage = req.query.page === 1;

    /* istanbul ignore next */
    let transactions = !isEmpty(req.query)
      ? getPublicTransactionsByQuery(req.user?.id!, req.query)
      : /* istanbul ignore next */
        getPublicTransactionsDefaultSort(req.user?.id!);

    const { contactsTransactions, publicTransactions } = transactions;

    let publicTransactionsWithContacts;

    if (isFirstPage) {
      const firstFiveContacts = slice(0, 5, contactsTransactions);

      publicTransactionsWithContacts = concat(firstFiveContacts, publicTransactions);
    }

    const { totalPages, data: paginatedItems } = getPaginatedItems(
      req.query.page,
      req.query.limit,
      isFirstPage ? publicTransactionsWithContacts : publicTransactions
    );

    res.status(200);
    res.json({
      pageData: {
        page: res.locals.paginate.page,
        limit: res.locals.paginate.limit,
        hasNextPages: res.locals.paginate.hasNextPages(totalPages),
        totalPages,
      },
      results: paginatedItems,
    });
  }
);

//POST /transactions - scoped-user
router.post(
  "/",
  ensureAuthenticated,
  validateMiddleware(isTransactionPayloadValidator),
  (req, res) => {
    const transactionPayload = req.body;
    const transactionType = transactionPayload.transactionType;

    remove("transactionType", transactionPayload);

    /* istanbul ignore next */
    // const group = createGroup(req.user?.id!, groupDetails); //TODO: update request to work with req.user?.id!
    //   const groupMember = createGroupMember(
    //     req.params.groupId,
    //     req.params.userId,
    //     groupMemberDetails
    //   );

    //   res.status(200);
    //   res.json({ transaction });
  }
);

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

//PATCH /transactions/:transactionId - scoped-user
router.patch(
  "/:transactionId",
  ensureAuthenticated,
  validateMiddleware([shortIdValidation("transactionId"), ...isTransactionPatchValidator]),
  (req, res) => {
    const { transactionId } = req.params;

    /* istanbul ignore next */
    updateTransactionById(transactionId, req.body);

    res.sendStatus(204);
  }
);

export default router;
