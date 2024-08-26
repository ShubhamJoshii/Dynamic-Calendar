import React from "react";
import HashLoader from "react-spinners/HashLoader";

const Loading = () => {
  return (
    <div className="fixed z-30 w-full h-full flex justify-center items-center bg-white">
      <HashLoader
        color={"rgb(9, 153, 228)"}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
        className="flex m-auto "
      />
    </div>
  );
};

export default Loading;
