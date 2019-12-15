function main() {
  // アクティブシートからデータの取得
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet       = spreadSheet.getActiveSheet();
  var sheetName   = sheet.getName();
  var sheetValue  = sheet.getDataRange().getValues();

  // valueとsheetNameからsheedテキストを作成
  return makeSeedText(sheetName, sheetValue)
}

function makeSeedText(sheetName, sheetValue) {
  // seed1行目の作成
  if (sheetName.indexOf('_') !== -1){
    var spLabel = sheetName.split('_');
    var modelName = spLabel[0][0].toUpperCase() + spLabel[0].slice(1) + spLabel[1][0].toUpperCase() + spLabel[1].slice(1);
  } else {
    var modelName = sheetName[0].toUpperCase() + sheetName.slice(1)
  }

  var firstLine = modelName + '.seed(:id,\n';

  // indentの作成
  var space = Array(firstLine.length - 3).join(' ');
  
  // seedtextの作成
  var result = [];
  result.push(firstLine);
  
  for (var i = 1; i < sheetValue.length; i++) {
    for (var j = 0; j < sheetValue[0].length; j++) {
      var key = sheetValue[0][j];
      var val = isNaN(sheetValue[i][j])? '"' + sheetValue[i][j] + '"' : sheetValue[i][j];

      if (j === 0) {
        var line = space + '{ ' + key + ': ' + val + ',\n';
      } else if (j === sheetValue[0].length - 1){
        var line = space + '  ' + key + ': ' + val + ' },\n';
      } else {
        var line = space + '  ' + key + ': ' + val + ',\n';
      }
      result.push(line);
    }
  }
  
  result.push(space + ')' + '\n');
  
  return result.join('');
}

function seedDownload() {
  var html = HtmlService.createTemplateFromFile('dialog').evaluate();
  SpreadsheetApp.getUi().showModalDialog(html, "ダウンロード中");
}

function getFileName() {
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadSheet.getActiveSheet();
  
  return sheet.getName() + '.rb';
}

function onOpen() {
  // メニューバーにカスタムメニューを追加
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "シートをseedに出力",
    functionName : "seedDownload"
  }];
  spreadsheet.addMenu("SeedMaker", entries);
};