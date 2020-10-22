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
  createGroupMember
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
    const groups = getGroupsForUserForApi(req.params.userId);

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
      results: groups
    });
  }
);

//POST /groups - scoped-user
router.post(
  "/creatorId/:id",
  // ensureAuthenticated,
  // validateMiddleware(isTransactionPayloadValidator),
  (req, res) => {
    const groupDetails = req.body;

    /* istanbul ignore next */
    // const group = createGroup(req.user?.id!, groupDetails); //TODO: update request to work with req.user?.id!
    const group = createGroup(req.params.id, groupDetails);

    res.status(200);
    res.json({ group });
  }
);

//POST /group-member - scoped-user
router.post(
  "/group/:groupId/groupMember/:userId",
  // ensureAuthenticated,
  // validateMiddleware(isTransactionPayloadValidator),
  (req, res) => {
    const groupMemberDetails = req.body;

    /* istanbul ignore next */
    // const group = createGroup(req.user?.id!, groupDetails); //TODO: update request to work with req.user?.id!
    const groupMember = createGroupMember(req.params.groupId ,req.params.userId, groupMemberDetails);

    res.status(200);
    res.json({ groupMember });
  }
);

//GET /groups/:groupId - scoped user
router.get(
  "/:groupId",
  // ensureAuthenticated,
  // validateMiddleware([shortIdValidation("transactionId")]),
  (req, res) => {
    const { groupId }  = req.params; // TODO: when we create front - update to req.user?.id!

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
