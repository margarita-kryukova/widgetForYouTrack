import { EmbeddableWidgetAPI } from "../../../../@types/globals";
import { IConfig } from "../interfaces";

export const readConfigFromHost: (
  host: EmbeddableWidgetAPI
) => Promise<Partial<IConfig>> = async (host) => {
  const config = (await host.readConfig()) as IConfig;
  const cache = (await host.readCache()) as IConfig;
  return cache || config;
};
