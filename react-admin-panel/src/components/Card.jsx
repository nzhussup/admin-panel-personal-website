import React from "react";

const Card = ({ title, desc, img, buttontxt, handleFunc }) => {
  return (
    <div className='card'>
      {img && <img src={img} className='card-img-top' alt={title} />}
      <div className='card-body'>
        {title && <h5 className='card-title'>{title}</h5>}
        {desc && <p className='card-text'>{desc}</p>}
        {buttontxt && handleFunc && (
          <button className='btn btn-primary' onClick={handleFunc}>
            {buttontxt}
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
