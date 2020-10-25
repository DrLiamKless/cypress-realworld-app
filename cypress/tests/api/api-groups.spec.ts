import { User , Group } from "../../../src/models";

const apiGroups = `${Cypress.env("apiUrl")}/groups`;

type TestGroupCtx = {
    authenticatedUser?: User;
    group?: Group;
};
describe("Groups API",function () {
    let ctx: TestGroupCtx = {};

    beforeEach(function () {
        cy.task("db:seed");
    
        cy.database("filter", "users").then((users: User[]) => {
          ctx.authenticatedUser = users[0];
          
          return cy.loginByApi(ctx.authenticatedUser.username);
        });
    
        // TODO: tests are not using database --> need to be fix

        /* cy.database("find", "groups").then((group: Group) => {  
          ctx.group = group;
        });
        */
    });

    context("GET /groups/:groupId",function () {
    it("get group by id",function () {
        const id = 'GroupNum001' ; // ctx.group!.id
        cy.request("GET", `${apiGroups}/${id}`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.group.id).to.eq(id);
          // expect(response.body.creatorId).to.eq(ctx.group!.creatorId);
        });
      });
    });

    context("POST /groups",function () { 
    it("creates a new group",function () {
        const { id: userId } = ctx.authenticatedUser!;

        cy.request("POST", `${apiGroups}`, {
          creatorId: userId,
          groupName: 'The Group',
          avatar: "data:image/png;base64,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",
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.group.creatorId).to.eq(userId);
          expect(response.body.group.groupName).to.eq('The Group');

        });
      });

    it("add members to group",function () {
        const id = 'GroupNum001' ; // ctx.group!.id

        cy.request("POST", `${apiGroups}/${id}/members`, {
          newGroupMembersIds: [
            't45AiwidW',
            'BabilaTom1',
            'LiamKless1',
            'AlonTzuk12',
            'NitzList09'
          ]
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.newGroupMembers.length).to.eq(5);
        });
      });
    });

    context("DELETE /groups/:groupId",function () {
      it("deletes a group",function () {
        const id = 'GroupNum001' ; // ctx.group!.id
        cy.request("DELETE", `${apiGroups}/${id}`).then((response) => {
          expect(response.status).to.eq(204);
        });
      });

      it("can kick a memeber from group",function () {
        const id = 'GroupNum001' ; // ctx.group!.id
        const groupMemberId = 'AlonTzuk12' ;
        cy.request("DELETE", `${apiGroups}/${id}/kick/${groupMemberId}`).then((response) => {
          expect(response.status).to.eq(204);
        });
        
        it("can member leave a group",function () {
          const id = 'GroupNum001' ; // ctx.group!.id
          cy.request("DELETE", `${apiGroups}/${id}/leave`).then((response) => {
            expect(response.status).to.eq(204);
          });
        });
      })
    });
});