import { IProjectItem, IProjectList, IProjectListObj } from "../../interfaces";

export function arrayToObject(data: IProjectList): IProjectListObj {
  return data.reduce((acc: IProjectListObj, item: IProjectItem) => {
    acc[item.id] = item;
    return acc;
  }, {});
}