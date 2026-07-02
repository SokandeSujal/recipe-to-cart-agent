"use client";

import { createContext } from "react";

export type RecipeSessionContextValue = {
  servingCount: number;
};

export const RecipeSessionContext = createContext<RecipeSessionContextValue>({
  servingCount: 2,
});
