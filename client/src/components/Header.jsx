import React from 'react';
import { Typewriter } from 'react-simple-typewriter';

const Header = () => {
  return (
    <div className='bg-black text-center  h-6 text-orange-500 '>
      <h1 className="text-lg md:text-xl lg:text-1xl">
        <Typewriter
          words={[
            "Shop Now & Enjoy Exclusive Discounts!",
            "Offer Valid Daily from 2pm to 10pm",
            "Buy 2 dresses and save additional 250 Rs",
            "Buy 3 dresses and save additional 350 Rs",
          ]}
          loop={true}
          cursor
          cursorStyle="_"
          typeSpeed={60}
          deleteSpeed={40}
          delaySpeed={3000}
        />
      </h1>
    </div>
  );
};

export default Header;
