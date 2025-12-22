function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('題目');
  const data = sheet.getDataRange().getValues();
  // id, question, A, B, C, D, Answer
  // row index: 0, 1, 2, 3, 4, 5, 6
  
  // 隨機選取 N 題
  const n = (e && e.parameter && parseInt(e.parameter.count)) || 5;
  
  const headers = data[0]; // 假設第一列是標題
  const rows = data.slice(1);
  
  const shuffled = rows.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, n);
  
  const questions = selected.map(row => {
    return {
      id: row[0],
      q: row[1],
      options: {
        A: row[2],
        B: row[3],
        C: row[4],
        D: row[5]
      },
      // 注意：不回傳解答 row[6]
    };
  });
  
  return ContentService.createTextOutput(JSON.stringify(questions))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const id = params.id;
    const answers = params.answers; // { questionId: 'A', ... }
    
    // 計算分數
    const qSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('題目');
    const qData = qSheet.getDataRange().getValues();
    // 建立解答 Map: id -> answer
    const answerKey = {};
    qData.slice(1).forEach(row => {
      answerKey[row[0]] = String(row[6]); // 假設解答在 G 欄 (index 6)
    });
    
    let correctCount = 0;
    let totalQuestions = Object.keys(answers).length;
    
    for (const [qId, ans] of Object.entries(answers)) {
      if (answerKey[qId] === ans) {
        correctCount++;
      }
    }
    
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    // 記錄結果
    const ansSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('回答');
    const ansData = ansSheet.getDataRange().getValues();
    let userRowIndex = -1;
    
    // 尋找使用者 (假設第一欄是 ID)
    for (let i = 1; i < ansData.length; i++) {
        // 使用 loose equality 以防 ID 是數字/字串混用
      if (ansData[i][0] == id) {
        userRowIndex = i + 1; // 1-based index for getRange
        break;
      }
    }
    
    const now = new Date();
    
    if (userRowIndex === -1) {
      // 新使用者
      // 欄位：ID、闖關次數、總分、最高分、第一次通關分數、花了幾次通關、最近遊玩時間
      ansSheet.appendRow([
        id, 
        1, // 闖關次數
        score, // 總分 (暫記本次)
        score, // 最高分
        score, // 第一次通關分數
        1, // 花了幾次通關
        now
      ]);
    } else {
      // 舊使用者
      const rowRange = ansSheet.getRange(userRowIndex, 1, 1, 7);
      const values = rowRange.getValues()[0];
      
      let playCount = (values[1] || 0) + 1;
      let maxScore = Math.max(values[3] || 0, score);
      
      // 更新
      // Column 2: 闖關次數
      // Column 4: 最高分
      // Column 7: 最近遊玩時間
      
      ansSheet.getRange(userRowIndex, 2).setValue(playCount);
      ansSheet.getRange(userRowIndex, 4).setValue(maxScore);
      ansSheet.getRange(userRowIndex, 7).setValue(now);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      score: score, 
      correct: correctCount,
      total: totalQuestions 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(err) {
     return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
