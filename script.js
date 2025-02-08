// 入力欄の折りたたみ/展開機能
const toggleInputBtn = document.getElementById("toggle-input-btn");
const inputSection = document.getElementById("input-section");
const chatWindow = document.getElementById("chat-window");

// 状態変数：入力欄が展開されているかどうかを追跡
let isInputSectionVisible = true;

const adjustChatWindowHeight = () => {
  if (isInputSectionVisible) {
    chatWindow.style.height = "calc(100vh - 350px)"; // 入力欄が展開されているときのチャットウィンドウの高さ
  } else {
    chatWindow.style.height = "calc(100vh - 50px)"; // 入力欄が折りたたまれているときのチャットウィンドウの高さ
  }
};

toggleInputBtn.addEventListener("click", () => {
  if (isInputSectionVisible) {
    inputSection.style.maxHeight = "0"; // 最大高さを0に設定し、アニメーションをトリガー
    inputSection.style.padding = "0"; // 内側の余白を削除
    toggleInputBtn.textContent = "+"; // ボタンのテキストを変更
  } else {
    inputSection.style.maxHeight = "350px"; // 高さを元に戻す
    inputSection.style.padding = "15px"; // 内側の余白を戻す
    toggleInputBtn.textContent = "-"; // ボタンのテキストを変更
  }

  isInputSectionVisible = !isInputSectionVisible; // 状態を切り替え
  adjustChatWindowHeight(); // チャットウィンドウの高さを動的に調整
});

// チャットウィンドウの高さを初期化
adjustChatWindowHeight();

// 会話生成機能
document.getElementById("generate-btn").addEventListener("click", async () => {
  const character1 = document.getElementById("character1").value || "レイド";
  const personality1 = document.getElementById("personality1").value || "忍耐強く、攻撃的だが実は自信がない男性狼男";
  const character2 = document.getElementById("character2").value || "ポル";
  const personality2 = document.getElementById("personality2").value || "冷静で優しい女性魔法使い";
  const scene = document.getElementById("scene").value || "二人の関係は、魔法使いの名家の令嬢ポルの家族がレイドを養子として迎え入れ、一緒に育った。レイドはポルより年上で、レイドはポルに密かに恋心を抱いているが、自分の立場に自信がない。しかし、ポルはレイドをただの子犬のように扱い、彼のふわふわの尻尾や耳を触るのが好き。会話は自由に展開。";

  const payload = {
    character1,
    personality1,
    character2,
    personality2,
    scene
  };

  try {
    const response = await fetch("https://chat-api-mvg2.onrender.com/generate_dialogue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Response JSON:", data);
      const dialogue = data.dialogue.trim();
      chatWindow.innerHTML = "";

      // 会話内容を分割（改行ごとに分割）
      const paragraphs = dialogue.split(/\n/).filter(p => p.trim() !== "");
      console.log("Paragraphs:", paragraphs);

      let i = 0;

      const displayMessage = () => {
        if (i < paragraphs.length) {
          const paragraph = paragraphs[i];

          // 改良した正規表現マッチング
          const match = paragraph.match(/^(.*?)[:：]\s*(.*)$/); // 日本語のコロンにも対応
          console.log("Paragraph:", paragraph, "Match:", match);

          if (match) {
            const speaker = match[1].trim(); // キャラクター名
            const message = match[2].trim(); // 会話内容

            const messageContainer = document.createElement("div");
            messageContainer.style.marginBottom = "20px";
            messageContainer.style.display = "flex";
            messageContainer.style.flexDirection = "column";
            messageContainer.style.alignItems =
              speaker === character1 ? "flex-start" : "flex-end";

            const name = document.createElement("div");
            name.textContent = speaker;
            name.style.fontSize = "14px";
            name.style.fontWeight = "bold";
            name.style.color = "#555";
            name.style.marginBottom = "5px";

            const chatMessage = document.createElement("div");
            chatMessage.textContent = message;
            chatMessage.style.backgroundColor =
              speaker === character1 ? "#ffffff" : "#d4f8c6";
            chatMessage.style.color = "#000";
            chatMessage.style.padding = "10px 15px";
            chatMessage.style.borderRadius = "10px";
            chatMessage.style.maxWidth = "60%";
            chatMessage.style.boxShadow = "0px 1px 3px rgba(0,0,0,0.1)";
            chatMessage.style.textAlign = "left";

            messageContainer.appendChild(name);
            messageContainer.appendChild(chatMessage);
            chatWindow.appendChild(messageContainer);

            // 自動的にスクロール
            chatWindow.scrollTop = chatWindow.scrollHeight;
          } else {
            console.error("無効なパラグラフのフォーマット:", paragraph);
          }

          i += 1;
          setTimeout(displayMessage, 1000);
        }
      };

      displayMessage();
    } else {
      alert("会話の生成に失敗しました。しばらくしてから再試行してください！");
    }
  } catch (error) {
    console.error("エラー:", error);
    alert("エラーが発生しました。ネットワーク接続を確認してください！");
  }
});
