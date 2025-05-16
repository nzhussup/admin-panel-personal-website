import React from "react";
import BackArrow from "./BackArrow";
import SortButton from "./SortButton";

const PageSubHeader = ({ toggleSort, children }) => {
  return (
    <div className='d-flex justify-content-between align-items-center flex-nowrap w-100'>
      <div className='me-2'>
        <BackArrow />
      </div>

      <div className='flex-grow-1 d-flex justify-content-center'>
        {children}
      </div>

      <div className='ms-2'>
        <SortButton onSort={toggleSort} />
      </div>
    </div>
  );
};

export default PageSubHeader;
