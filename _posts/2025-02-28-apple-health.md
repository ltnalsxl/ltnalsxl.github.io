---
layout: post
title: "기록에 진심이라면? Apple Health 데이터 제대로 활용하는 법!"
author: ltnalsxl
categories: [Technology, Data, HealthTech]
tags: [Apple Health, Google Sheets, Google Cloud, Data Automation, Health Analytics]
image: 
description: "Apple Health 데이터를 Google Sheets 및 Google Cloud로 연동하여 자동화하는 방법을 소개합니다. 건강 데이터를 더욱 스마트하게 활용해 봅시다!💪"
---

## 워치와 한몸이 되어버린 사람 ⌚ 
나는 운동하러 나갈 때 가장 어려운 '집 밖으로 한 발짝 내딛기'를 성공한 후에도,  워치를 깜빡했다면 다시 집으로 돌아갈 정도로 워치 없이 운동하는 건 상상도 할 수 없는 사람이다. 운동 기록, 심박수, 걸음 수, 수면 기록까지 Apple Health 앱을 하루에도 몇 번씩 들여다보는 게 일상이 되었다. 

이렇게 쌓이는 '나'에 대한 데이터를, 그냥 쌓아두기만 하기엔 너무 아깝다는 생각이 들었다!

그래서 개인적으로 좋아하는 **Google Apps Script**를 활용해 Apple Health 데이터를 자동화해보기로 했다. Google Sheets로 import, Google Cloud(BigQuery)에서도 활용할 수 있는 환경을 만들어보았다. 기록에 진심인 사람이라면 분명 도움이 될 내용이라 생각되어 공유해본다. 

---

## Apple Health 데이터

Apple Health 앱은 데이터를 많이 저장하지만, 정작 한눈에 보기 어렵고, 가공해서 활용하기 쉽지 않다. 데이터를 Google Sheets로 옮기고, BigQuery에서 분석하면 트렌드 분석, 건강 패턴 예측 등 여러 재미있는 일들이 이 가능해진다.  

### ✅ 활용할 기술 스택:  
1. **Apple Health 데이터 내보내기 (XML)**  
2. **Google Sheets + Google Apps Script**  
3. **Google Cloud**

이제 각 단계를 차근차근 살펴보겠다.  

---

## Step 1: Apple Health 데이터 내보내기  

1. **iPhone에서 건강 데이터 내보내기**  
   - [건강 앱] → [프로필] → [건강 데이터 내보내기] → `.zip` 파일 다운로드  
   - 압축을 해제하면 `export.xml` 파일이 생성됨  

2. **Google Drive에 업로드**  
   - `export.xml` 파일을 **Google Drive에 업로드**한다.  

---

## Step 2: Google Sheets에 데이터 불러오기  

Google Apps Script를 활용하여 XML 데이터를 파싱한 후 Google Sheets에 자동으로 저장할 수 있다.  

1. **Google Sheets 생성**  
   - 새로운 Google Sheets 문서를 만든다.  
   - 메뉴에서 `Extensions → Apps Script`를 선택하여 Google Apps Script 편집기를 연다.  

2. **Apps Script 코드 추가**  
   - 아래 코드를 추가하여 Google Drive에 업로드한 XML 파일을 읽고 Google Sheets에 자동으로 데이터를 입력한다.  

```javascript
function importAppleHealthData() {
  var fileId = 'GOOGLE_DRIVE_FILE_ID'; // Google Drive에 업로드한 XML 파일의 ID
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var file = DriveApp.getFileById(fileId);
  var xml = file.getBlob().getDataAsString();
  var document = XmlService.parse(xml);
  var root = document.getRootElement();
  
  var records = root.getChildren('Record');
  sheet.clear();
  sheet.appendRow(['Type', 'Value', 'Unit', 'Date']);
  
  records.forEach(function(record) {
    var type = record.getAttribute('type').getValue();
    var value = record.getAttribute('value').getValue();
    var unit = record.getAttribute('unit').getValue();
    var date = record.getAttribute('startDate').getValue();
    
    sheet.appendRow([type, value, unit, date]);
  });
}
```

3. **스크립트 실행**  
   - `importAppleHealthData()` 함수를 실행하면 **Apple Health 데이터가 자동으로 Google Sheets에 입력된다!**  

---

## Step 3: Google Cloud로 데이터 보내기  

Google Sheets에 저장된 데이터를 Google Cloud(BigQuery)로 보내 분석할 수 있다.  

1. **Google Cloud에서 BigQuery 활성화**  
   - Google Cloud 콘솔에서 **BigQuery API를 활성화**한다.  
   - 새 데이터셋을 만들고 Google Sheets를 데이터 소스로 연결한다.  

2. **Google Apps Script를 활용한 자동 업데이트**  
   - 아래 코드를 Google Apps Script에 추가하여 데이터를 자동으로 BigQuery로 보낼 수 있다.  

```javascript
function sendToBigQuery() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var tableId = 'your_project_id.your_dataset.your_table';
  
  var bigqueryData = [];
  
  for (var i = 1; i < data.length; i++) {
    bigqueryData.push({
      type: data[i][0],
      value: data[i][1],
      unit: data[i][2],
      date: data[i][3]
    });
  }
  
  var query = 'INSERT INTO `' + tableId + '` (type, value, unit, date) VALUES ';
  bigqueryData.forEach((row, index) => {
    query += `("${row.type}", "${row.value}", "${row.unit}", "${row.date}")`;
    if (index < bigqueryData.length - 1) query += ',';
  });
  
  var request = {
    query: query,
    useLegacySql: false
  };
  
  var response = BigQuery.Jobs.query(request, 'your_project_id');
  Logger.log(response);
}
```

3. **자동화 트리거 설정**  
   - Google Apps Script에서 `트리거`를 설정하여 **매일 자동으로 Apple Health 데이터를 Google Cloud로 업로드**하도록 설정할 수 있다.  

---

## 📌 앞으로 어떻게 활용할 것인가?

이제 데이터 자동화 환경을 구축했으니, 앞으로 더 흥미로운 활용 방안을 고민하고 있다. 단순한 데이터 기록을 넘어서, 예측 모델 구축 등 다양하게 활용해보고 싶다!

또 어렵긴 하겠지만 식단 데이터도 쌓아서 활용해보고 싶다. 

✅ 건강 데이터 기반 예측 모델 구축
- 심박수, 운동 패턴, 수면 데이터를 기반으로 피로도 예측 모델 개발
-일정 기간 데이터를 학습하여 운동 성과 및 회복 시간 최적화
- AI 모델을 활용해보기!

✅ 개인 맞춤형 건강 인사이트 제공
- 나의 운동 루틴과 수면 패턴을 분석하여 최적의 운동 시간 추천
- 영양 및 식단 패턴과 연계하여 운동 후 섭취해야 할 영양소 제안
- 운동 및 활동량 변화에 따른 소모 칼로리 분석 및 피드백 제공

✅ 데이터 시각화 및 공유 시스템 개발
- 대시보드를 더욱 만들어 장기적인 건강 트렌드 분석
- Google Cloud Functions와 연계하여 실시간 알림 기능 추가

앞으로는 단순한 기록이 아니라, 내 건강을 예측하고 최적의 루틴을 찾는 자동화된 시스템을 만드는 것이 목표다!
