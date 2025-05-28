import { IField } from "../../../interfaces";

export function transformBundleValues(response: IField): Record<string, string> {
  return response.bundle?.values.reduce((acc, value) => {
    acc[value.id] = value.localizedName ?? value.name;
    return acc;
  }, {} as Record<string, string>);
}