const { WebClient } = require('@slack/web-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Slack APIトークンとチャンネルIDを指定
const token = '';  // 自分のSlack Botトークンに置き換え
const channelId = '';  // 送信先チャンネルのID
const imagePath = './output/test-20250302.png';  // 送信するPNG画像のパス

const web = new WebClient(token);

async function uploadImage() {
    try {
        // ファイルサイズを取得
        const fileStats = fs.statSync(imagePath);
        const fileSize = fileStats.size;  // バイト単位

        // MIMEタイプを判定（JPEG/PNG対応）
        const ext = path.extname(imagePath).toLowerCase();
        const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';

        // ステップ1: アップロードURLを取得 (length を追加)
        const uploadUrlResponse = await web.files.getUploadURLExternal({
            filename: path.basename(imagePath),
            length: fileSize  // ファイルサイズを指定channels
        });

        const uploadUrl = uploadUrlResponse.upload_url;
        const fileId = uploadUrlResponse.file_id;
        
        // ステップ2: 画像をアップロード
        const fileStream = fs.createReadStream(imagePath);
        const uploadStatus = await axios.post(uploadUrl, fileStream, {
            headers: {
                'Content-Length': fileSize,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        console.log("アップロードURLにアップロード結果:" + uploadStatus.statusText);

        // ステップ3: アップロード完了を通知 + メッセージ追加
        await web.files.completeUploadExternal({
            files: [{ "id": fileId, "title": path.basename(imagePath) }],  // 修正: 配列の中にオブジェクトとして file_id を指定
            channel_id: channelId,
            initial_comment: "これはテストです"  // ここに表示したいメッセージを設定
        });

        console.log('画像をアップロードしました:', fileId);
    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
}

// 実行
uploadImage();