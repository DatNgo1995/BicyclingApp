import React, { useState, useEffect } from "react";
import Pagination from "react-js-pagination";

const StationDisplay = ({ station = [], chooseMainStation }) => {
  const [activePage, setActivePage] = useState(1);
  const [stationRender, setStationRender] = useState(station);

  useEffect(() => {
    setStationRender(station);
  }, [station, chooseMainStation]);
  const paginationOnChange = pageNumber => {
    if (pageNumber !== activePage) setActivePage(pageNumber);
  };

  return (
    <>
      <div className="row my-2">
        {stationRender &&
          stationRender.map((station, key) =>
            Math.floor(key / 5 + 1) === activePage ? (
              <div key={key} className="col-12 col-md-6 my-2">
                <h2>{station.name}</h2>
                <p> ID: {station.stationId}</p>
                <p> bikes Available: {station.bikesAvailable}</p>
                <p> spaces Available: {station.spacesAvailable}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => chooseMainStation(station.name)}
                >
                  Choose as main station
                </button>
              </div>
            ) : null
          )}
      </div>

      <Pagination
        itemClass="page-item"
        linkClass="page-link"
        activePage={activePage}
        onChange={page => paginationOnChange(page)}
        itemsCountPerPage={5}
        totalItemsCount={station.length - 1}
      />
    </>
  );
};

export default React.memo(StationDisplay);
