import React from "react";
import BackArrow from "./BackArrow";
import SortButton from "./SortButton";

const PageSubHeader = ({ toggleSort }) => {
  return (
    <div className='d-flex justify-content-between align-items-center'>
      <div className='me-auto'>
        <BackArrow />
      </div>
      <div className='ms-auto'>
        <SortButton onSort={toggleSort} />
      </div>
    </div>
  );
};

export default PageSubHeader;
