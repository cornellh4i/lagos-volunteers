import React from 'react';
import { useState } from "react"; 

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNav = () => {
    setMenuOpen(!menuOpen); 
  }
  return (
    <>

    <div className = "grid grid-cols-12">
      <div className = "col-span-11 justify-between items-center px-8 py-6 col-span-1 bg-gray-300 font-mono text-4xl">LFBI
      </div>
      <div className = "space-y-2 bg-gray-300 object-center py-8 px-10">
        <div className = "w-8 h-0.5 bg-black animate-pulse"></div>
        <div className = "w-8 h-0.5 bg-black animate-pulse"></div>
        <div className = "w-8 h-0.5 bg-black animate-pulse"></div>
      </div>
    </div>

    {/* <button className = "bg-gray-300 hover:bg-gray-700 text-white font-bold py-4 px-4 rounded">LFB</button> */}
    
    </>
  );
};

export default NavBar;

// import React from 'react';
// import { useState } from "react"; 

// const NavBar = () => {
//   const [menuOpen, setMenuOpen] = useState(false)

//   const handleNav = () => {
//     setMenuOpen(!menuOpen); 
//   }
//   return (
//     <>
//     <nav className="fixed w-full h-24 shadow-x1 bg-gray">
//       <div className = "flex justify-between items-center h-full w-full px-4 2x1:px-16">
//           <div> LFB</div>
//           <div> Menu</div>
//         </div>  
//         <div onClick = {handleNav} className = "sm:hidden cursor-pointer pl-24"/>

//         <div className ={
//           menuOpen
//           ? "fixed left-0 top-0 w-[65%] sm:hidden h-screen bg-[#ecf0f3] p-10 ease-in duration-500"
//           : "fixed left-[- 100%] top-0 p-10 ease-in duration-500"
//         }>
//         </div>
//     </nav>
//     </>
//   );
// };

// export default NavBar;
