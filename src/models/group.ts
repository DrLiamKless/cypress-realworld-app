//a group model we created
export interface Group {
  id: string;
  uuid: string;
  groupName: string;
  creatorId: string;
  avatar: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface GroupResponseItem extends Group {
  members: string[][]; //get array of string arrays [["id","username"],["id","username"]]
  creatorName: string;
}

export type GroupDetails = Omit<Group, "id" | "creatorId" | "uuid" | "createdAt" | "modifiedAt">;
// *to-add - total amount,
