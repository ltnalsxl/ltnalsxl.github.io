---
layout: post
title: "엑셀에서는 멀쩡한데 Hive에서 깨진다? CSV 데이터 적재 문제 완벽 해결 가이드 🛠️"
author: ltnalsxl
categories: [ Tech, Data Engineering, ETL, Troubleshooting ]
tags: [ Hive, CSV, Data Pipeline, Excel, 데이터엔지니어링 ]
image:
description: "엑셀에서 확인하면 완벽한데, Hive에 올리면 깨져버리는 데이터... 🤔 컬럼이 밀리고 데이터가 깨지는 문제의 진짜 원인과 해결 방법을 공개합니다!"
featured: true
---

> *"아니, 분명 엑셀에서는 멀쩡했는데..."*

데이터 엔지니어라면 한 번쯤 겪어봤을 익숙한 악몽이다.
비즈니스 팀에서 받은 엑셀 파일을 Hive에 적재했는데, 컬럼이 밀리고 데이터가 뒤틀려 완전히 엉망이 되어버린 경험... 🤯

처음에는 CSV 파일을 Hive 테이블에 넣는 일이 간단할 거라 생각했다. 하지만 막상 적재해 보니 예상치 못한 문제가 연달아 발생했다.

- 엑셀에서 보던 데이터와 완전히 다른 형태가 된 테이블
- 첫 몇 줄까지는 멀쩡하다가 특정 행부터 컬럼이 밀려버리는 현상

*대체 뭐가 문제였을까?*

**💡 Hive에서 CSV 데이터를 다룰 때 흔히 발생하는 오류들과 그 원인, 그리고 이를 깔끔하게 해결하는 방법을 정리해보았다.**

## 1. 평화로운(?) 엑셀 vs 까다로운 Hive 💭

#### 엑셀에서는 이렇게 썼는데...
- 보기 좋으라고 쉼표로 구분해서 넣기 ✨
- 긴 설명은 Alt+Enter로 줄바꿈 넣기 📝
- 값이 없으면 그냥 비워두기
- 이것저것 특수문자도 마음대로 쓰기

#### Hive는 이렇게 읽어버립니다
- "어? 쉼표가 있네? 여기서 컬럼을 나눠야겠다!"
- "줄바꿈이 있으니 새로운 행이구나!"
- "빈 값이라고? NULL인가? 빈 문자열인가? \\N인가? 🤔"

## 2. 실제 데이터로 보는 문제 사례 📊

<h3>문제 1: 쉼표로 인한 컬럼 밀림</h3>

<p><strong>엑셀 데이터:</strong></p>

<table>
  <thead>
    <tr>
      <th>상품ID</th>
      <th>상품분류</th>
      <th>등록일자</th>
      <th>상품상태</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>A001</td>
      <td>가전, 디지털, 컴퓨터</td>
      <td>2024-01-01</td>
      <td>판매중</td>
    </tr>
    <tr>
      <td>B002</td>
      <td>패션의류, 잡화</td>
      <td>2024-01-02</td>
      <td>판매중</td>
    </tr>
    <tr>
      <td>C003</td>
      <td>식품</td>
      <td>2024-01-03</td>
      <td>품절</td>
    </tr>
  </tbody>
</table>

<p><strong>Hive에서 보면:</strong></p>

<table>
  <thead>
    <tr>
      <th>상품ID</th>
      <th>상품분류</th>
      <th>컬럼1</th>
      <th>컬럼2</th>
      <th>등록일자</th>
      <th>상품상태</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>A001</td>
      <td>가전</td>
      <td>디지털</td>
      <td>컴퓨터</td>
      <td>2024-01-01</td>
      <td>판매중</td>
    </tr>
    <tr>
      <td>B002</td>
      <td>패션의류</td>
      <td>잡화</td>
      <td>2024-01-02</td>
      <td>판매중</td>
      <td>C003</td>
    </tr>
    <tr>
      <td>식품</td>
      <td>2024-01-03</td>
      <td>품절</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
  </tbody>
</table>

<h3>문제 2: 줄바꿈으로 인한 행 분리</h3>

<p><strong>엑셀에서:</strong></p>

<table>
  <thead>
    <tr>
      <th>상품ID</th>
      <th>상세설명</th>
      <th>등록일자</th>
      <th>담당자</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>001</td>
      <td>2024 신상품 출시!<br>프리미엄 한정판입니다.</td>
      <td>2024-01-10</td>
      <td>김철수</td>
    </tr>
    <tr>
      <td>002</td>
      <td>기본 모델입니다.</td>
      <td>2024-01-11</td>
      <td>이영희</td>
    </tr>
  </tbody>
</table>

<p><strong>Hive에 적재하면:</strong></p>

<table>
  <thead>
    <tr>
      <th>상품ID</th>
      <th>상세설명</th>
      <th>등록일자</th>
      <th>담당자</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>001</td>
      <td>2024 신상품 출시!</td>
      <td>2024-01-10</td>
      <td>김철수</td>
    </tr>
    <tr>
      <td>프리미엄</td>
      <td>한정판입니다.</td>
      <td>null</td>
      <td>null</td>
    </tr>
    <tr>
      <td>002</td>
      <td>기본 모델입니다.</td>
      <td>2024-01-11</td>
      <td>이영희</td>
    </tr>
  </tbody>
</table>


## 3. OpenCSVSerde를 써도 해결되지 않는 이유 🔍

#### 기대했던 것
- OpenCSVSerde가 쉼표 포함된 데이터를 자동으로 처리
- 큰따옴표로 감싸진 데이터를 하나의 필드로 인식
- UTF-8 인코딩 문제 해결

#### 실제 발생한 문제
1. 큰따옴표 없이 저장된 CSV
   - OpenCSVSerde는 쉼표 포함 데이터가 큰따옴표로 감싸져 있다고 가정
   - 큰따옴표 없으면 여전히 쉼표를 구분자로 인식

2. 인코딩 문제
   - UTF-8과 UTF-8-BOM의 차이
   - 특히 Windows에서 생성된 CSV 파일에서 자주 발생

3. NULL 처리 설정
   - `serialization.null.format` 설정에 따라 데이터 해석이 달라짐

## 4. 해결 방법: 단계별 접근 🎯

#### Step 1: Python으로 데이터 전처리하기

```python
import pandas as pd
import csv

def prepare_csv_for_hive(input_file, output_file):
    print("데이터 전처리를 시작합니다 🔍")
    
    # 1. CSV 파일 읽기
    df = pd.read_csv(input_file, dtype=str)
    
    # 2. 쉼표를 파이프로 변환 (임시 구분자)
    df = df.apply(lambda x: x.str.replace(",", "|||", regex=True))
    
    # 3. 모든 필드를 큰따옴표로 감싸서 저장
    df.to_csv(output_file,
              index=False,
              encoding="utf-8",
              sep=",",
              quoting=csv.QUOTE_ALL)
    
    print("전처리 완료! ✨")
```

#### Step 2: Hive 테이블 설정하기

```sql
-- 임시 테이블 생성
CREATE TABLE stage_table (
    col1 STRING,
    col2 STRING
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.OpenCSVSerde'
WITH SERDEPROPERTIES (
    "separatorChar" = ",",
    "quoteChar"     = "\"",
    "escapeChar"    = "\\"
)
STORED AS TEXTFILE;

-- 최종 테이블 생성
CREATE TABLE final_table (
    col1 STRING,
    col2 STRING
)
STORED AS ORC;
```

#### Step 3: 데이터 정제 및 이관

```sql
-- 임시 구분자를 쉼표로 복원하며 최종 테이블에 적재
INSERT INTO final_table
SELECT 
    col1,
    regexp_replace(col2, '\\|\\|\\|', ',')
FROM stage_table;
```

## 5. 다른 대안들 💡

#### LazySimpleSerDe 사용하기
```sql
CREATE TABLE my_table (
    col1 STRING,
    col2 STRING
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe'
ROW FORMAT DELIMITED
FIELDS TERMINATED BY '\t'
STORED AS TEXTFILE;
```

#### 탭 구분자 사용하기
```python
# Python에서 탭 구분자로 저장
df.to_csv("output.csv", sep='\t', encoding='utf-8')
```

## 6. 실전 체크리스트 ✅

#### 데이터 준비 단계
- CSV 파일의 인코딩 확인 (UTF-8 권장)
- 데이터에 쉼표나 줄바꿈이 있는지 확인
- 샘플 데이터로 테스트 수행

#### 적재 단계
- SerDe 설정 확인
- NULL 값 처리 방식 통일
- 단계별 데이터 검증

#### 운영 단계
- 적재 후 데이터 정합성 체크
- 컬럼 수와 데이터 타입 확인
- 오류 데이터 로깅 및 처리

## 핵심 포인트 정리 🎯

1. 데이터 특성 파악이 중요
   - 쉼표 포함 여부
   - 줄바꿈 사용 여부
   - 특수문자 사용 패턴

2. 단계별 처리가 안전
   - 임시 테이블 활용
   - 데이터 정제 후 이관
   - 검증 절차 포함

3. 자동화된 처리가 필요
   - 전처리 스크립트 재사용
   - 검증 프로세스 자동화
   - 오류 처리 루틴 구축

이러한 문제들은 Hive뿐만 아니라 AWS Athena, BigQuery, Databricks 등 다양한 환경에서도 발생할 수 있다. 위의 해결 방법들을 활용하면 안정적인 데이터 적재가 가능하다!

비슷한 문제를 겪는 분들께 도움이 되길 바랍니다! 💪