export interface IValue {
  name: string;
  id: string;
  $type: string;
  localizedName?: string;
  ordinal: number;
}
export interface IValueExtended extends IValue {
  fieldType: {
    isMultiValue: boolean;
  };
}
export interface IBundle {
  values: IValue[];
  $type: string;
}
export interface IField {
  bundle: IBundle;
  field: IValue | IValueExtended;
  id: string;
  $type: string;
  ordinal: number;
  canBeEmpty: boolean;
  emptyFieldText: string;
  isMultiValue?: boolean;
}
export interface IProjectItem {
  fields: IField[];
  name: string;
  id: string;
  $type: string;
}
export type IProjectList = IProjectItem[];

export interface IProjectListObj {
  [key: string]: IProjectItem;
}

export interface IBundle {
  id: string;
  $type: string;
}

export interface IProjectCustomField {
  bundle: IBundle;
  emptyFieldText: string;
  canBeEmpty: boolean;
  ordinal: number;
  field: IField;
  id: string;
  $type: string;
}

export interface IIssueField {
  projectCustomField: IProjectCustomField;
  value: IValue | IValue[] | null;
  id: string;
  $type: string;
}

export interface IIssue {
  resolved: number;
  created: number;
  summary: string;
  idReadable: string;
  fields: IIssueField[];
  id: string;
  $type: string;
}

export interface IActivityField {
  id: string;
  name: string;
  $type: string;
}

export interface IActivity {
  removed:
    | null
    | {
        name: string;
        id?: string;
        $type: string;
      }[];
  added:
    | null
    | {
        name: string;
        id?: string;
        $type: string;
      }[];
  field: IActivityField;
  timestamp: number;
  $type: string;
}

export interface IIssueWithActivity extends IIssue {
  activitiesGlobalState: IActivity[];
}

export interface IIssueExtendedHours extends IIssueWithActivity {
  hours: Record<string, number>;
}

export interface IDataForGraph {
  [key: string]: {
    countMap: Record<string, number>;
    issueMap: Record<string, IIssueExtendedHours[]>;
  };
}

export interface IClassMappings {
  [key: string]: string | null;
}

export interface IDateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface IDateRangePickerProps {
  minDate: Date | null;
  onDateChange?: (range: IDateRange) => void;
}

export type IGroup = "week" | "month" | "year" | "quarter";
export type IMeasurement = "millmilliseconds" | "seconds" | "minutes" | "hours" | "days";
export type ITypeGraph = "Discovery" | "Delivery";

export interface IFilters {
  fields: Record<string, string[] | null>;
  minDate: Date;
  maxDate: Date;
  group: IGroup;
  sliceData: string;
  measurement: IMeasurement;
  type: ITypeGraph;
}

export interface IWidgetSetup {
  id: string;
  name: string;
}


export interface IConfig {
  idWidget: string;
  project: {
    id: string;
    name: string;
  };
  filters: Omit<IFilters, "minDate" | "maxDate">;
  issueList: {
    list: IIssueExtendedHours[],
    minDateIssues: Date,
    maxDateIssues: Date,
  }
}

export type IDataSets = {
  label: string;
  data: number[];
  backgroundColor: string;
}[];
