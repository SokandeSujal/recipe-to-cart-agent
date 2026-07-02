export function hasSwiggyMcpConfig() {
  return Boolean(
    process.env.SWIGGY_MCP_FOOD_URL &&
      process.env.SWIGGY_MCP_IM_URL &&
      process.env.SWIGGY_MCP_DINEOUT_URL,
  );
}
