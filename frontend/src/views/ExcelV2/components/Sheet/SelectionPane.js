import React from "react";

const SelectionPane = () => {
  const DEFAULT_SELECTION = { top: 1, left: 1, bottom: 1, right: 1 };
  const [ selection, setSelection ] = useState(DEFAULT_SELECTION);

  
  /**
   * Check anchor point if it's in header. If it's in header, non-header elements belonging to the header is selected
   * Only one of the following is considered: [ row, column ]
   * Scope is only one of the following above, not a "small rectangular" scope.
   */

  return (
    <div className="">

    </div>
  );
};

export default SelectionPane;