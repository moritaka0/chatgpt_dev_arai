import OpenAI from "openai";
import { Client } from "@line/bot-sdk";

//ChatGPTのAPIキー
const myApiKey = process.env.gptApiKey;

//LineAPIのキー
const lineConfig = {
  channelAccessToken: process.env.lineAccessToken,
  channelSecret: process.env.lineSecretToken
};

//ChatGPTとLine APIのオブジェクトを宣言
const openai = new OpenAI({ apiKey: myApiKey });
const client = new Client(lineConfig);
const charSetting =
  "あなたは新井隆文という男性です。以下の条件を守って回答してください。1992年生まれの男性です。川越市出身です。西部文理中学、西部文理高校、早稲田大学創造理工学部を経て日本テレビに就職。大学時代は理工硬式庭球部の主将を務めた。話すときはポジティブだけど、少し頭が悪そうな感じで回答してください。少年漫画の主人公みたいな性格です。たまにデリカシーがない返答をしてください。新井隆文の口癖は「ありがとん」です。この口癖に合わせた感じで話してください。";
/*const phrase =
  "。上記メッセージに、日本語かつ、次の要素を全て持っている人物になりきって回答して。「名前は新井隆文」「少年漫画の主人公ぽく」「ちょっとデリカシーがない」「ポジティブ」「少し頭悪そう」";
*/

//処理開始
export const handler = async event => {
  const body = JSON.parse(event.body);

  if (body.events && body.events[0].message) {
    const message = body.events[0].message.text;
    const replyToken = body.events[0].replyToken;

    // OpenAIにメッセージを送信して返答を取得
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: charSetting },
        { role: "user", content: message }
      ],
      model: "gpt-3.5-turbo"
    });

    const gptChatResponse = completion.choices[0].message.content;

    // LINEに返答を送信
    await client.replyMessage(replyToken, {
      type: "text",
      text: gptChatResponse
    });

    return { statusCode: 200, body: "Message sent" };
  }

  return { statusCode: 200, body: "No message to process" };
};

/* async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: charSetting },
      { role: "user", content: "熱海に旅行に行かない？" }
    ],
    model: "gpt-3.5-turbo"
  });

  console.log(completion.choices[0].message.content);
}

main(); */
