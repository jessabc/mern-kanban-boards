import React, { useContext } from "react";
import { Context } from "../Context";

export function useStatusOptions() {
  const { currentBoardData } = useContext(Context);

  const statusOptionElements = currentBoardData?.columns?.map(
    (option, index) => (
      <option key={index} value={option.columnName}>
        {option.columnName}{" "}
      </option>
    )
  );

  return [statusOptionElements];
}
