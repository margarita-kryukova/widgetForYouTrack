import { useEffect } from "react";
import { saveIssueConfig } from "../helpers/saveConfig";
import { EmbeddableWidgetAPI } from "../../../../@types/globals";
import { IIssueExtendedHours } from "../interfaces";

export function useSaveIssuesConfigOnChange(
  host: EmbeddableWidgetAPI,
  issues: IIssueExtendedHours[]
) {
  useEffect(() => {
    if (issues.length) {
      saveIssueConfig(host, issues);
    }
  }, [issues.length, host]);
}