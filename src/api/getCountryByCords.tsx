const getCountryByCords = async () => {
  interface Position {
    coords: {
      latitude: number;
      longitude: number;
    };
  }
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'ad9c5d69d5msh2a55a9c6bf459aep1cdf64jsn4262bd5f50e7',
      'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com',
    },
  };
  let result;
  if ('geolocation' in navigator) {
    const position = await new Promise<Position>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    const lon = position.coords.longitude;
    const lat = position.coords.latitude;
    result = await fetch(
      `https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=${lat}&lon=${lon}&accept-language=en&polygon_threshold=0.0`,
      options
    ).then((response) => response.json());
  }
  return result;
};

export default getCountryByCords;
