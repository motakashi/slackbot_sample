const { WebClient } = require('@slack/web-api');

// Slack APIトークンとチャンネルIDを指定
const token = '';  // 自分のSlack Botトークンに置き換え
const channelId = '';  // 送信先チャンネルのID

const web = new WebClient(token);

async function postMessage() {
    try {
        const text = "これはテストです";
        const response = await web.chat.postMessage({ channel: channelId, text });
      
        // 投稿に成功すると ok フィールドに true が入る。
        console.log(response.ok);
        // => true
    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
}

// 実行
postMessage();