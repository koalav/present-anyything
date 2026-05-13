# 대본 -> 정적 HTML 발표자료 변환 프롬프트

아래 대본을 GitHub Pages용 슬라이드 HTML 조각으로 변환해 주세요.
결과는 `docs/<deck-name>/index.html`의 `<main class="slides" id="slides">` 안에 붙여 넣을 수 있어야 합니다.

스타일:
- 레퍼런스처럼 어두운 배경의 세미나 발표 느낌
- 슬라이드는 많이 쪼갬
- 한 장에는 하나의 메시지
- 제목은 크고 결론형
- 본문은 0~3개 항목
- 섹션 구분 슬라이드는 `section` 클래스를 사용
- 강조색은 `accent-blue`, `accent-rose`, `accent-teal`, `accent-amber` 중 선택
- 청중이 화면만 봐도 흐름을 이해할 수 있게 작성

출력 형식:
```html
<section class="slide section accent-blue" data-part="Section 01 · 섹션명">
  <p class="meta">SECTION 01</p>
  <h1>섹션 제목</h1>
  <p class="sub">섹션을 여는 한 문장</p>
</section>

<section class="slide surface accent-blue">
  <h3>Sub topic</h3>
  <h2>결론형 제목</h2>
  <ul class="list">
    <li>짧은 근거</li>
    <li>짧은 근거</li>
  </ul>
</section>
```

대본:
```
여기에 대본 붙여넣기
```
