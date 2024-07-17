const readline = require("readline");
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function start() {
  const fetch = await import("node-fetch").then(mod => mod.default);

  const weatherApiKey = "db928b98cbaf6c237b58dae8e3a905ee";
  const geminiApiKey = "AIzaSyBNKCDOXaLw_P5dOWHRNqhu0FxMiyYdFJ4";

  const genAI = new GoogleGenerativeAI(geminiApiKey);

  async function getWeather(destinationRegion) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(destinationRegion)}&appid=${weatherApiKey}&units=metric&lang=kr`;

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

  async function getOutfitRecommendation(context) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        나이: ${context.age}, 성별: ${context.gender}, 키: ${context.height}cm, 몸무게: ${context.weight}kg
        상황: ${context.place}인 ${context.destinationRegion} 지역의 날씨에 적합한 옷을 간단하고 구체적으로 추천해주세요. 예: 파란색 셔츠, 청바지
      `;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = await response.text();
      text = text.replace(/\*\*/g, '');
      text = text.replace(/^[^\d]*\d+\./, '');
      text = text.replace(/추가적으로:.*/, '');

      return text.trim();
    } catch (error) {
      console.error("Error generating outfit recommendation:", error);
      throw error;
    }
  }

  async function generateOutfitRecommendation(context) {
    try {
      const weather = await getWeather(context.destinationRegion);
      console.log(`입력한 지역 ${context.destinationRegion}의 현재 날씨는: ${weather}`);
      
      const outfitRecommendations = await getOutfitRecommendation(context);
      console.log(`나이: ${context.age}, 성별: ${context.gender}, 키: ${context.height}cm, 몸무게: ${context.weight}kg, 장소: ${context.place}에 따른 옷 추천:`);
      console.log(outfitRecommendations);
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
          rl.question("어디에 갈건지 입력하세요 (예: 해변, 산, 도시): ", (place) => {
            rl.question("가는 지역을 입력하세요: ", (destinationRegion) => {
              const context = {
                age: age,
                gender: gender,
                height: height,
                weight: weight,
                place: place,
                destinationRegion: destinationRegion,
              };
              generateOutfitRecommendation(context);
              rl.close();
            });
          });
        });
      });
    });
  });
}

start();
