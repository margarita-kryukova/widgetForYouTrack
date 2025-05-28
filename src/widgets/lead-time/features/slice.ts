import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IField,
  IFilters,
  IGroup,
  IIssueExtendedHours,
  IMeasurement,
  IProjectList,
  IProjectListObj,
  ITypeGraph,
} from "../interfaces";
import {
  appendIsMultiValue,
  fetchCustomField,
  fetchIssues,
  fetchProjects,
  mapFieldsToMultiValueStatus,
} from "./functions";
import { RootState } from "../store";
import { arrayToObject } from "./helpers/arrayToObject";
import { removeDuplicatesById } from "./helpers/removeDuplicatesById";

interface IInitialState {
  projects: IProjectListObj;
  projectCustomFieldsRequested: boolean;
  isLoading: boolean;
  activeRequests: number; // Счетчик активных запросов
  filters: IFilters;
  issues: IIssueExtendedHours[];
  filteredIssues: IIssueExtendedHours[];
}

const initialState: IInitialState = {
  projects: {},
  issues: [],
  filteredIssues: [],
  projectCustomFieldsRequested: false,
  isLoading: false,
  activeRequests: 0, // Начальное значение счетчика
  filters: {
    fields: {},
    minDate: null,
    maxDate: new Date(),
    group: "week",
    sliceData: "",
    measurement: "hours",
    type: "Discovery",  
  },
};

export const getProjects = createAsyncThunk("graph/getProjects", fetchProjects);

export const getCustomField = createAsyncThunk(
  "graph/getCustomField",
  fetchCustomField
);

export const getIssues = createAsyncThunk("graph/getIssues", fetchIssues);

const slice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    updateMinDate: (state, action: PayloadAction<IFilters["minDate"]>) => {
      state.filters.minDate = action.payload;
    },
    updateFilteredIssues: (
      state,
      action: PayloadAction<IIssueExtendedHours[]>
    ) => {
      state.filteredIssues = action.payload;
    },
    updateIssues: (
      state,
      action: PayloadAction<IIssueExtendedHours[]>
    ) => {
      state.issues = action.payload;
    },
    updateTypeGraph: (state, action: PayloadAction<ITypeGraph>) => {
      state.filters.type = action.payload;
    },
    updateGroup: (state, action: PayloadAction<IGroup>) => {
      state.filters.group = action.payload;
    },
    updateMeasurement: (state, action: PayloadAction<IMeasurement>) => {
      state.filters.measurement = action.payload;
    },
    updateSliceData: (state, action: PayloadAction<string>) => {
      state.filters.sliceData = action.payload;
    },
    updateFilters: (state, action: PayloadAction<IFilters>) => {
      state.filters = action.payload;
    },
    updateFiltersFields: (state, action: PayloadAction<IFilters["fields"]>) => {
      state.filters.fields = action.payload;
    },
    updateData: (state) => {
      state.issues = []
    },
    resetLoadingState: (state) => {
      state.activeRequests = 0;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    // Общие обработчики для всех запросов
    const handlePending = (state: IInitialState) => {
      state.activeRequests += 1;
      state.isLoading = true;
    };
    
    const handleFulfilled = (state: IInitialState) => {
      state.activeRequests -= 1;
      state.isLoading = state.activeRequests > 0;
    };
    
    const handleRejected = (state: IInitialState) => {
      state.activeRequests -= 1;
      state.isLoading = state.activeRequests > 0;
    };
    
    // getProjects
    builder.addCase(getProjects.pending, handlePending);
    builder.addCase(getProjects.fulfilled, (state, action) => {
      state.projects = arrayToObject(
        (action.payload as IProjectList).filter((project) => {
          if (!project.fields) {
            return false;
          }

          const fieldIds = project.fields
            .map((field) => field.field?.id)
            .filter((id) => id != null);

          return fieldIds.includes("77-111") && fieldIds.includes("77-116");
        })
      );
      handleFulfilled(state);
    });
    builder.addCase(getProjects.rejected, handleRejected);
    
    // getCustomField
    builder.addCase(getCustomField.pending, handlePending);
    builder.addCase(getCustomField.fulfilled, (state, action) => {
      // Сортировка кастомных фильтров по ординалу
      state.projects[action.meta.arg.id]?.fields.sort(
        (a, b) => a.ordinal - b.ordinal
      );

      // Сортировка значений кастомных фильтров по ординалу
      state.projects[action.meta.arg.id]?.fields.forEach((field) =>
        field.bundle?.values.sort((a, b) => a.ordinal - b.ordinal)
      );

      const customFieldsObj: Record<string, boolean> =
        mapFieldsToMultiValueStatus(action.payload as IField[]);
      state.projects = appendIsMultiValue(
        action.meta.arg.id,
        state.projects,
        customFieldsObj
      );
      state.projectCustomFieldsRequested = true;
      handleFulfilled(state);
    });
    builder.addCase(getCustomField.rejected, handleRejected);

    // getIssues
    builder.addCase(getIssues.pending, handlePending);
    builder.addCase(getIssues.fulfilled, (state, action) => {
      state.issues = removeDuplicatesById([
        ...state.issues,
        ...(action.payload as IIssueExtendedHours[]),
      ]);
      handleFulfilled(state);
    });
    builder.addCase(getIssues.rejected, handleRejected);
  },
});

export default slice.reducer;
export const selectGraphData = (state: RootState) => state.data;
export const {
  updateMinDate,
  updateFilteredIssues,
  updateIssues,
  updateTypeGraph,
  updateGroup,
  updateMeasurement,
  updateSliceData,
  updateFilters,
  updateFiltersFields,
  updateData,
  resetLoadingState
} = slice.actions;
