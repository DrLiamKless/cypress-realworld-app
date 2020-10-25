import { User } from "models";

type NewGroupTestCtx = {
  freinds?: User[];
  loggedUser?: User;
  groupMembers?: User[];
};

describe("New group", () => {
  const ctx: NewGroupTestCtx = {};

  beforeEach(function () {
    cy.task("db:seed"); //seed database

    cy.server(); //init a dummy server
    cy.route("POST", "/groups").as("createNewGroup");

    cy.route("GET", "/users/friends/t45AiwidW").as("friends"); //get friends
    cy.route("GET", "/groups/user/t45AiwidW").as("allGroups"); //get groups

    //get dummy data
    cy.database("filter", "users").then((users: User[]) => {
      ctx.freinds = users;
      ctx.loggedUser = users[0];
      ctx.groupMembers = [users[5], users[6]];

      //fake login
      return cy.loginByXstate(ctx.loggedUser.username);
    });
  });

  it("Can open the new group modal, enter the requested details, submit and create a new group", function () {
    const groupDetails = {
      name: "test",
      avatar: "https://i.pinimg.com/originals/a4/4a/f3/a44af3bb5f074e3cdb4be8a56232c996.jpg",
    };

    cy.get("[data-test=nav-groups-tab]").click();
    cy.get("#new-group-button").click({ force: true });
    cy.wait("@friends");

    cy.get("#groupName").type(groupDetails.name);
    cy.get("#groupAvatarUrl").type(groupDetails.avatar);

    cy.get("#contacts").click(); //Open selector
    cy.get('[data-value="NitzList09"]').click(); //click member 1
    cy.get('[data-value="LiamKless1"]').click(); //click member 2
    cy.get("form").click({ force: true }); //Close select

    cy.get("form > .MuiButtonBase-root > .MuiButton-label").click({ force: true }); //click create group button
    cy.visit("http://localhost:3000");
    cy.get("[data-test=nav-groups-tab]").click(); //refresh page

    cy.get("#all-groups-container").children().should("have.length", 4);
    cy.get("#all-groups-container").children().eq(0).click({ force: true });
    cy.get(".MuiGrid-spacing-xs-3 > :nth-child(1) > :nth-child(1) > h1").should(
      "contain",
      groupDetails.name
    );
    cy.get("h3").should(
      "contain",
      //@ts-ignore
      `Members: You, ${ctx?.groupMembers[0].username}, ${ctx.groupMembers[1].username}`
    );
  });

  it("Can not submit empty form and get error messages", () => {
    cy.get("[data-test=nav-groups-tab]").click();
    cy.get("#new-group-button").click({ force: true });
    cy.wait("@friends");

    cy.get("form > .MuiButtonBase-root > .MuiButton-label").click({ force: true }); //click create group button
    //Dialog sjould not dissappear, 3 errors should exist
    cy.get(".MuiDialog-container").should("exist");
    cy.get("form > :nth-child(3)").should("contain", "You must enter a group name");
    cy.get("form > :nth-child(7)").should("contain", "You must enter an avatar");
    cy.get("form > :nth-child(10)").should("contain", "You must choose at least one group member");
  });
});
