const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require("readline");
const genAI = new GoogleGenerativeAI("AIzaSyDWt62Ca_C-BvQBfz4E1UFOdhfXu-dLVDM");

async function generateOutfitRecommendation(context) {
 const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
 const result = await model.generateContent(
  `상황: ${context.age}살 ${context.gender} ${context.height}cm ${context.weight}kg ${context.visitLocationSituation}에 ${context.destinationRegion} 여행 가는 옷 추천해줘`
 );
 const response = await result.response;
 const text = await response.text();
 console.log(text);
}

const rl = readline.createInterface({
 input: process.stdin,
 output: process.stdout,
});

rl.question("나이를 입력하세요: ", (age) => {
 rl.question("성별을 입력하세요 (남/여): ", (gender) => {
  rl.question("키를 입력하세요 (cm): ", (height) => {
   rl.question("몸무게를 입력하세요 (kg): ", (weight) => {
    rl.question("방문 장소의 상황을 입력하세요: ", (visitLocationSituation) => {
     rl.question("가는 지역을 입력하세요: ", (destinationRegion) => {
      const context = {
       age: age,
       gender: gender,
       height: height,
       weight: weight,
       visitLocationSituation: visitLocationSituation,
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