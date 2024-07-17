const readline = require("readline");

async function start() {
  const fetch = await import("node-fetch").then(mod => mod.default);

  const apiKey = "db928b98cbaf6c237b58dae8e3a905ee";

  async function getWeather(destinationRegion) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(destinationRegion)}&appid=${apiKey}&units=metric&lang=kr`;

    try {
      const response = await fetch(weatherUrl);
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`날씨 데이터를 가져오는데 실패했습니다: ${errorDetails.message}`);
      }
      const weatherData = await response.json();
      const temperature = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      return `현재 온도는 ${temperature}도이고, 날씨는 ${weatherDescription}입니다.`;
    } catch (error) {
      console.error(`Failed to fetch weather data: ${error.message}`);
      throw error;
    }
  }

  async function generateOutfitRecommendation(context) {
    try {
      const weather = await getWeather(context.destinationRegion);
      console.log(`입력한 지역 ${context.destinationRegion}의 현재 날씨는: ${weather}`);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("나이를 입력하세요: ", (age) => {
    rl.question("성별을 입력하세요 (남/여): ", (gender) => {
      rl.question("키를 입력하세요 (cm): ", (height) => {
        rl.question("몸무게를 입력하세요 (kg): ", (weight) => {
          rl.question("가는 지역을 입력하세요: ", (destinationRegion) => {
            const context = {
              age: age,
              gender: gender,
              height: height,
              weight: weight,
              destinationRegion: destinationRegion,
            };
            generateOutfitRecommendation(context);
            rl.close();
          });
        });
      });
    });
  });
}

start();
