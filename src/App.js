import React, { useReducer, useEffect, useCallback } from "react";
import StationDisplay from "./StationDisplay";
// eslint-disable-next-line
import Bootstrap from "bootstrap/dist/css/bootstrap.css";
const fetchData = async body => {
  let url = "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql";
  let opt = {
    method: "POST",
    headers: { "Content-Type": "application/graphql" },
    body: ` ${body}`
  };
  try {
    const data = await fetch(url, opt);
    return data.json();
  } catch (e) {
    return new Error("failed to fetch");
  }
};
function App() {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      totalBike: [],
      onSearch: false,
      searchResult: null,
      mainStation: localStorage.getItem("main station") || null
    }
  );
  useEffect(() => {
    const totalStationQuery = `{
      bikeRentalStations {
        name
        stationId
        bikesAvailable
        spacesAvailable
        lat
        lon
        allowDropoff
      }
    }`;
    (async () => {
      const result = await fetchData(totalStationQuery);

      if (!(result instanceof Error))
        setState({ totalBike: result.data.bikeRentalStations });
    })();
  }, []);
  const handleSearch = e => {
    if (e.target.value) {
      if (!state.onSearch) setState({ onSearch: true });
      setState({
        searchResult: state.totalBike.filter(
          station =>
            station.name.toLowerCase().indexOf(e.target.value.toLowerCase()) >
            -1
        )
      });
    } else setState({ onSearch: false });
  };
  const chooseMainStation = station => {
    window.localStorage.setItem("main station", station);
    setState({
      mainStation: station
    });
  };
  const memoizedChooseMainStation = useCallback(chooseMainStation, []);
  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between">
        {state.mainStation ? (
          <p>
            Your main station is <strong>{state.mainStation}</strong>
          </p>
        ) : (
          <p> No current main Station</p>
        )}
        <input
          className="search-box form-control input-sm  w-25"
          type="text"
          onChange={e => handleSearch(e)}
          placeholder="search..."
        />
      </div>

      {state.onSearch ? (
        <StationDisplay
          station={state.searchResult}
          chooseMainStation={chooseMainStation}
        />
      ) : (
        <StationDisplay
          station={state.totalBike}
          chooseMainStation={memoizedChooseMainStation}
        />
      )}
    </div>
  );
}

export default App;
