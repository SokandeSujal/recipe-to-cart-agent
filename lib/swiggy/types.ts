export type SwiggyMode = "real" | "mock";

export type McpServerStatus = "configured" | "missing_env" | "not_authorized";

export type McpStatus = {
  mode: SwiggyMode;
  mockEnabled: boolean;
  food: McpServerStatus;
  instamart: McpServerStatus;
  dineout: McpServerStatus;
  authorized: boolean;
  user: {
    label: string;
    initials: string;
  } | null;
};
