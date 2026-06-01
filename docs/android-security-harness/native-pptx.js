(function () {
  const C = {
    navy: '17365D',
    blue: '2F75B5',
    lightBlue: 'DDEBF7',
    paleBlue: 'EFF6FC',
    grayText: '4B5563',
    darkText: '111827',
    line: 'CBD5E1',
    lightLine: 'E5E7EB',
    bg: 'F7F9FC',
    white: 'FFFFFF',
    muted: '6B7280',
  };

  const FONT = 'Malgun Gothic';
  const W = 13.333333;
  const H = 7.5;
  const TOTAL_SLIDES = 17;

  function shapeTypes(pptx) {
    return pptx.ShapeType || {
      rect: 'rect',
      roundRect: 'roundRect',
      ellipse: 'ellipse',
      line: 'line',
      chevron: 'chevron',
    };
  }

  function addText(slide, text, x, y, w, h, options = {}) {
    slide.addText(text, {
      x, y, w, h,
      fontFace: FONT,
      fontSize: options.size || 12,
      color: options.color || C.darkText,
      bold: Boolean(options.bold),
      align: options.align || 'left',
      valign: options.valign || 'mid',
      margin: options.margin ?? 0.06,
      breakLine: false,
      fit: 'shrink',
    });
  }

  function addBox(slide, pptx, x, y, w, h, options = {}) {
    const st = shapeTypes(pptx);
    slide.addShape(options.round ? st.roundRect : st.rect, {
      x, y, w, h,
      rectRadius: options.round ? 0.06 : undefined,
      fill: { color: options.fill || C.white },
      line: { color: options.line || C.line, width: options.lineWidth || 1 },
    });
  }

  function addHeader(slide, pptx, index, title, message, section) {
    const st = shapeTypes(pptx);
    slide.background = { color: C.bg };
    slide.addShape(st.rect, { x: 0, y: 0, w: W, h: 0.12, fill: { color: C.navy }, line: { color: C.navy } });
    addText(slide, section || 'AI 기반 Android 보안 분석 및 검증 Harness', 0.65, 0.25, 5.5, 0.28, { size: 8.5, color: C.muted, bold: true });
    addText(slide, title, 0.65, 0.58, 8.6, 0.44, { size: 24, color: C.navy, bold: true });
    if (message) addText(slide, message, 0.65, 1.05, 9.6, 0.34, { size: 11.2, color: C.grayText });
    slide.addShape(st.line, { x: 0.65, y: 1.46, w: 12.05, h: 0, line: { color: C.line, width: 0.8 } });
    addText(slide, `${index} / ${TOTAL_SLIDES}`, 11.9, 7.05, 0.8, 0.18, { size: 8.5, color: C.muted, align: 'right' });
  }

  async function loadImageData(relativePath) {
    if (typeof window.__loadImageData === 'function') {
      return window.__loadImageData(relativePath);
    }
    const url = new URL(relativePath, window.location.href);
    const response = await fetch(url.href);
    if (!response.ok) throw new Error(`Failed to load image: ${relativePath}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  function addImageContain(slide, pptx, data, imageW, imageH, x, y, w, h) {
    addBox(slide, pptx, x, y, w, h, { fill: C.white, line: C.line, round: true });
    const ratio = imageW / imageH;
    let drawW = w - 0.12;
    let drawH = drawW / ratio;
    if (drawH > h - 0.12) {
      drawH = h - 0.12;
      drawW = drawH * ratio;
    }
    slide.addImage({
      data,
      x: x + (w - drawW) / 2,
      y: y + (h - drawH) / 2,
      w: drawW,
      h: drawH,
    });
  }

  function addCover(slide, pptx) {
    const st = shapeTypes(pptx);
    slide.background = { color: C.white };
    slide.addShape(st.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.white }, line: { color: C.white } });
    slide.addShape(st.rect, { x: 0, y: 0, w: 0.34, h: H, fill: { color: C.navy }, line: { color: C.navy } });
    slide.addShape(st.rect, { x: 0.34, y: 0, w: 0.08, h: H, fill: { color: C.blue }, line: { color: C.blue } });
    addText(slide, 'AI 기반 Android\n보안 분석 및 검증 Harness', 0.9, 2.1, 7.8, 1.2, { size: 30, color: C.navy, bold: true, valign: 'mid' });
    addText(slide, 'AI 후보 분석과 단말 기반 검증 루프를 결합한 Android 보안 점검 체계', 0.94, 3.55, 8.3, 0.36, { size: 13, color: C.grayText });
    addBox(slide, pptx, 9.35, 2.22, 2.7, 1.34, { fill: C.paleBlue, line: C.lightBlue, round: true });
    addText(slide, '16:9 Wide\nEditable PPTX', 9.62, 2.48, 2.15, 0.76, { size: 17, color: C.navy, bold: true, align: 'center' });
    addText(slide, '보고서형 프레젠테이션', 0.95, 6.8, 3.2, 0.24, { size: 9.5, color: C.muted });
  }

  function addTable(slide, pptx, x, y, w, rowH, headers, rows, widths) {
    const st = shapeTypes(pptx);
    const colW = widths || headers.map(() => w / headers.length);
    let cx = x;
    headers.forEach((head, i) => {
      slide.addShape(st.rect, { x: cx, y, w: colW[i], h: rowH, fill: { color: C.navy }, line: { color: C.navy, width: 0.8 } });
      addText(slide, head, cx + 0.05, y + 0.04, colW[i] - 0.1, rowH - 0.08, { size: 10.5, color: C.white, bold: true, align: 'center' });
      cx += colW[i];
    });
    rows.forEach((row, r) => {
      cx = x;
      row.forEach((cell, i) => {
        slide.addShape(st.rect, { x: cx, y: y + rowH * (r + 1), w: colW[i], h: rowH, fill: { color: r % 2 ? C.white : 'F8FAFC' }, line: { color: C.line, width: 0.6 } });
        addText(slide, cell, cx + 0.08, y + rowH * (r + 1) + 0.05, colW[i] - 0.16, rowH - 0.1, { size: 9.4, color: C.darkText });
        cx += colW[i];
      });
    });
  }

  function addCard(slide, pptx, x, y, w, h, title, body, options = {}) {
    addBox(slide, pptx, x, y, w, h, { fill: options.fill || C.white, line: options.line || C.line, round: true });
    addText(slide, title, x + 0.16, y + 0.12, w - 0.32, 0.26, { size: options.titleSize || 12.2, color: options.titleColor || C.navy, bold: true });
    addText(slide, body, x + 0.16, y + 0.48, w - 0.32, h - 0.58, { size: options.bodySize || 9.5, color: C.grayText, valign: 'top' });
  }

  function addProcess(slide, pptx, y, steps) {
    const st = shapeTypes(pptx);
    const gap = 0.24;
    const w = (11.8 - gap * (steps.length - 1)) / steps.length;
    let x = 0.75;
    steps.forEach((step, i) => {
      addBox(slide, pptx, x, y, w, 1.08, { fill: step.fill || C.white, line: step.line || C.blue, round: true });
      addText(slide, step.no, x + 0.14, y + 0.11, 0.34, 0.22, { size: 9.2, color: C.blue, bold: true });
      addText(slide, step.title, x + 0.5, y + 0.1, w - 0.64, 0.28, { size: 11.4, color: C.navy, bold: true });
      addText(slide, step.body, x + 0.2, y + 0.5, w - 0.4, 0.42, { size: 9.2, color: C.grayText, align: 'center' });
      if (i < steps.length - 1) {
        addText(slide, '→', x + w + 0.03, y + 0.41, gap - 0.04, 0.24, { size: 16, color: C.blue, bold: true, align: 'center' });
      }
      x += w + gap;
    });
  }

  function addResearchSlide(slide, pptx, index, title, message, source, points) {
    addHeader(slide, pptx, index, title, message, '관련연구 및 벤치마킹 조사');
    addCard(slide, pptx, 0.8, 1.82, 3.4, 3.95, source.title, source.body, { fill: C.paleBlue, line: C.lightBlue, titleSize: 13.2 });
    points.forEach((p, i) => {
      addCard(slide, pptx, 4.55, 1.82 + i * 1.31, 7.85, 1.08, `${String(i + 1).padStart(2, '0')}  ${p.title}`, p.body, { fill: C.white, titleSize: 11.4, bodySize: 9.2 });
    });
    addText(slide, source.note, 0.88, 6.0, 10.9, 0.25, { size: 8.4, color: C.muted });
  }

  function addBenchmarkFitTable(slide, pptx, x, y, w) {
    const st = shapeTypes(pptx);
    const headers = ['조사 대상', '간단 설명', '적합성', '한계', '차용 포인트'];
    const widths = [1.35, 2.35, 1.3, 4.05, 2.45];
    const rows = [
      ['COVA', '정적 taint-analysis 경로 조건을 계산/검증하는 연구', '직접 사용 어려움', 'path constraint 계산/검증용 micro-benchmark로 단말 조작 -> 취약점 트리거 -> evidence/oracle 판정 목적과 다름', '정적 분석 단계의 조건 추출 아이디어'],
      ['AndroidWorld', '실제 Android emulator에서 앱 task를 수행하는 모바일 GUI agent benchmark', '부분 사용 가능', '모바일 GUI agent benchmark이나 보안 취약점, root 조건, system UID, exploit oracle 부재', 'Harness AI의 UI 조작 능력 평가'],
      ['Ghera', '취약 앱, 공격 앱, 수정 앱을 묶은 Android 취약점 benchmark', '부분 사용 가능', '취약/정상/공격 앱 구성이 있으나 2017년대의 작고 lean한 예제 중심', '취약/정상/공격 앱 seed corpus'],
      ['DroidBench', 'Android 정보흐름 분석 도구의 정확도 평가용 micro-benchmark', '부분 사용 가능', '정보 흐름 검출 중심이며 실제 APK의 component/provider/webview/storage 조합형 검증에는 약함', '정적 data-flow ground truth 비교'],
      ['MobSF', '모바일 앱 정적/동적 보안 분석 자동화 framework', '평가 벤치마크 아님', 'mobile app automated security assessment framework이나 AI 분석 기능 및 본 과제용 exploit oracle 제공 없음', '정적/동적 분석 수집 baseline'],
    ];
    const headerH = 0.42;
    const rowH = 0.83;
    let cx = x;
    headers.forEach((head, i) => {
      slide.addShape(st.rect, { x: cx, y, w: widths[i], h: headerH, fill: { color: C.navy }, line: { color: C.navy, width: 0.7 } });
      addText(slide, head, cx + 0.04, y + 0.08, widths[i] - 0.08, 0.14, { size: 7.8, color: C.white, bold: true, align: 'center' });
      cx += widths[i];
    });
    rows.forEach((row, r) => {
      cx = x;
      row.forEach((cell, i) => {
        slide.addShape(st.rect, { x: cx, y: y + headerH + rowH * r, w: widths[i], h: rowH, fill: { color: r % 2 ? C.white : 'F8FAFC' }, line: { color: C.line, width: 0.55 } });
        addText(slide, cell, cx + 0.06, y + headerH + rowH * r + 0.07, widths[i] - 0.12, rowH - 0.14, {
          size: i === 0 ? 7.7 : i === 2 ? 7.3 : 6.5,
          color: i === 2 ? C.navy : C.darkText,
          bold: i === 0 || i === 2,
          align: i === 0 || i === 2 ? 'center' : 'left',
          valign: 'top',
        });
        cx += widths[i];
      });
    });
  }

  function addModelTrainingPlan(slide, pptx) {
    addCard(slide, pptx, 0.85, 1.72, 3.15, 1.34, '대상 모델', 'Qwen3.5 - 9B\n저B 모델 특화 학습', { fill: C.paleBlue, line: C.lightBlue, titleSize: 11.0, bodySize: 10.2 });
    addCard(slide, pptx, 4.25, 1.72, 3.15, 1.34, '도입 목적', '토큰 비용 절감\n운영 유연성 확보\n반복 실행 비용 통제', { fill: C.white, line: C.blue, titleSize: 11.0, bodySize: 8.8 });
    addCard(slide, pptx, 7.65, 1.72, 4.65, 1.34, '학습 가능성 판단', 'Harness AI는 고난도 추론보다 typed action 선택, 복구, 관찰, 도구 사용 패턴과 특수 도메인 지식이 중요하므로 학습으로 충족 가능하다고 판단', { fill: C.white, line: C.line, titleSize: 10.4, bodySize: 7.7 });

    addTable(slide, pptx, 0.92, 3.48, 5.45, 0.48, ['구분', '내용'], [
      ['모델 선정 기준', '9B급 이하 비용 효율, 도구 호출 패턴 학습 적합성, Android/ADB 도메인 적응성, 운영 배포 용이성'],
      ['학습 목표', '허용된 typed action 선택, 실패 복구, 상태 관찰, 증거 수집, 과장 없는 판정 지원'],
      ['비교 기준', 'Base model 대비 fine-tuned model의 성공률, 복구율, 증거 수집 품질 개선'],
    ], [1.55, 3.9]);

    addTable(slide, pptx, 6.68, 3.48, 5.45, 0.48, ['학습 데이터', '구성 방향'], [
      ['ToolBench', '도구 사용 및 multi-step tool calling 패턴 차용'],
      ['Android in the Wild', '실제 Android 작업 흐름과 UI/앱 상태 변화 데이터 활용'],
      ['자체 실행 trace', '실제 ADB와 개발한 분석 도구를 이용해 대형 모델로 생성한 실행 데이터를 조합'],
    ], [1.55, 3.9]);

    addCard(slide, pptx, 1.1, 6.36, 10.9, 0.5, '학습 방향', '범용 보안 추론 모델이 아니라 Android 검증 Harness의 action 선택, 상태 복구, evidence 수집에 특화된 운영 모델로 구성', { fill: C.paleBlue, line: C.lightBlue, titleSize: 8.7, bodySize: 7.4 });
  }

  function addBenchmarkPlan(slide, pptx) {
    addCard(slide, pptx, 0.85, 1.72, 3.0, 1.35, '자체 벤치마크 목적', 'Android 취약점 검증 자동화\n정적 후보 -> 동적 증거 확인\nAI Harness 성능 정량 평가', { fill: C.paleBlue, line: C.lightBlue, titleSize: 10.4, bodySize: 8.2 });
    addCard(slide, pptx, 4.12, 1.72, 3.0, 1.35, '기존 방식의 한계', 'Static finding 중심\n실제 exploitability 불명확\nFP / Refutation 평가 부족\n단말 조작 능력 미평가', { fill: C.white, line: C.line, titleSize: 10.4, bodySize: 8.0 });
    addCard(slide, pptx, 7.39, 1.72, 4.75, 1.35, 'Harness AI 평가 방식', 'typed action 선택 · 실패 시 복구 · 상태 관찰 · 증거 수집 · 과장 없는 판정 지원\nraw adb/shell 직접 실행 없이 제한된 action만 선택', { fill: C.white, line: C.blue, titleSize: 10.4, bodySize: 7.8 });

    addTable(slide, pptx, 0.92, 3.42, 5.25, 0.42, ['평가 케이스', '구성'], [
      ['Synthetic set', 'vulnerable app / secure variant / attacker app'],
      ['전제조건 검증', 'forced-precondition case 분리'],
      ['실제 앱 평가', 'Real app 10종 E2E'],
      ['취약점 커버리지', 'exported component, deep link/WebView, provider, sandbox file trust, UI input to sink, service/broadcast trigger'],
    ], [1.65, 3.6]);

    addTable(slide, pptx, 6.45, 3.42, 5.55, 0.42, ['항목', '계획'], [
      ['비교 평가', 'Qwen3.5 - 9B base vs fine-tuned 개선 효과 측정'],
      ['판정 라벨', 'confirmed / refuted / inconclusive / forced-precondition'],
      ['최종 산출물', 'CaseSpec, Typed Action Catalog, HarnessRunReport, Evidence Ledger, Score Report'],
    ], [1.35, 4.2]);

    addCard(slide, pptx, 1.1, 6.35, 10.9, 0.54, '운영 원칙', '전제조건을 강제로 만든 case는 full-chain exploit으로 과장하지 않고 downstream 동작 검증으로 분리 기록', { fill: C.paleBlue, line: C.lightBlue, titleSize: 8.8, bodySize: 7.5 });
  }

  function addFuturePlanOverview(slide, pptx) {
    const items = [
      {
        no: '01',
        title: '단일 AI 구조 -> 역할 분리',
        body: 'AI 결과를 바로 확정하지 않고 분석, 실행, 판정을 분리한 evidence 기반 검증 흐름으로 전환',
        points: ['Security AI: 검증 목표 정의', 'Harness AI: 허용 action 실행', 'Oracle: evidence 기준 판정'],
      },
      {
        no: '02',
        title: 'Harness AI 모델 선정·학습·벤치마크',
        body: '저B 모델 후보를 선정하고 Android/ADB 실행 데이터로 학습한 뒤 자체 벤치마크로 운영 가능성 검증',
        points: ['대상 모델 선정', '도구 사용·복구 패턴 학습', 'Base vs Fine-tuned 비교'],
      },
      {
        no: '03',
        title: '평가 metric 추출 및 결론 도출',
        body: '실행 성공률, 실패 복구율, 증거 품질, 판정 정확도를 metric으로 추출해 도입 효과와 한계 정리',
        points: ['Action success / recovery rate', 'Evidence completeness', 'FP 감소 및 운영 결론'],
      },
    ];

    items.forEach((item, i) => {
      const x = 0.82 + i * 4.05;
      addBox(slide, pptx, x, 1.82, 3.72, 4.22, { fill: i === 1 ? C.paleBlue : C.white, line: i === 1 ? C.blue : C.lightBlue, round: true });
      addBox(slide, pptx, x + 0.22, 2.08, 0.52, 0.52, { fill: C.paleBlue, line: C.lightBlue, round: true });
      addText(slide, item.no, x + 0.28, 2.24, 0.4, 0.14, { size: 9.5, color: C.blue, bold: true, align: 'center' });
      addText(slide, item.title, x + 0.22, 2.86, 3.28, 0.48, { size: 13.2, color: C.navy, bold: true, valign: 'top' });
      addText(slide, item.body, x + 0.22, 3.48, 3.28, 0.72, { size: 8.3, color: C.grayText, valign: 'top' });
      item.points.forEach((point, j) => {
        const py = 4.38 + j * 0.43;
        addBox(slide, pptx, x + 0.24, py, 3.24, 0.3, { fill: 'F8FAFC', line: C.line, round: true, lineWidth: 0.7 });
        addText(slide, point, x + 0.34, py + 0.06, 3.04, 0.13, { size: 7.3, color: C.navy, bold: true });
      });
    });

    addBox(slide, pptx, 1.1, 6.38, 10.9, 0.48, { fill: C.paleBlue, line: C.lightBlue, round: true });
    addText(slide, '진행 순서', 1.28, 6.53, 1.0, 0.14, { size: 8.5, color: C.navy, bold: true });
    addText(slide, '구조 전환 -> 모델/데이터 확보 -> 벤치마크 실행 -> metric 기반 도입 결론 도출', 2.22, 6.53, 9.25, 0.14, { size: 7.6, color: C.grayText });
  }

  function addScreenshotCard(slide, pptx, imageData, x, y, w, h, title, caption) {
    addBox(slide, pptx, x, y, w, h, { fill: C.white, line: C.line, round: true, lineWidth: 0.8 });
    addText(slide, title, x + 0.14, y + 0.11, w - 0.28, 0.2, { size: 9.2, color: C.navy, bold: true });
    slide.addImage({ data: imageData, x: x + 0.14, y: y + 0.42, w: w - 0.28, h: h - 0.76 });
    addText(slide, caption, x + 0.14, y + h - 0.25, w - 0.28, 0.14, { size: 6.9, color: C.grayText });
  }

  function addMetricCard(slide, pptx, x, y, w, h, label, value, detail, color) {
    addBox(slide, pptx, x, y, w, h, { fill: C.white, line: color, round: true, lineWidth: 1 });
    addText(slide, label, x + 0.22, y + 0.16, w - 0.44, 0.2, { size: 9.6, color: C.grayText, bold: true });
    addText(slide, value, x + 0.22, y + 0.48, w - 0.44, 0.42, { size: 24, color, bold: true });
    addText(slide, detail, x + 0.24, y + 1.0, w - 0.48, 0.26, { size: 8.6, color: C.muted });
  }

  function addIconCircle(slide, pptx, x, y, size, label, color) {
    const st = shapeTypes(pptx);
    slide.addShape(st.ellipse, {
      x, y, w: size, h: size,
      fill: { color },
      line: { color, width: 0.8 },
    });
    addText(slide, label, x, y + size * 0.22, size, size * 0.38, { size: size > 0.5 ? 14 : 9, color: C.white, bold: true, align: 'center' });
  }

  function addToolRow(slide, pptx, x, y, w, title, body, accent, token) {
    addBox(slide, pptx, x, y, w, 0.46, { fill: C.white, line: accent, round: true, lineWidth: 0.65 });
    addIconCircle(slide, pptx, x + 0.1, y + 0.09, 0.28, token, accent);
    addText(slide, title, x + 0.48, y + 0.08, 1.2, 0.14, { size: 8.4, color: C.darkText, bold: true });
    addText(slide, body, x + 0.48, y + 0.25, w - 0.58, 0.12, { size: 7.1, color: C.navy });
  }

  function addToolGroup(slide, pptx, x, y, w, h, title, accent, token, rows) {
    addBox(slide, pptx, x, y, w, h, { fill: 'FBFDFF', line: accent, round: true, lineWidth: 0.9 });
    addIconCircle(slide, pptx, x + 0.18, y + 0.18, 0.46, token, accent);
    addText(slide, title, x + 0.74, y + 0.26, w - 0.9, 0.22, { size: 12.4, color: accent, bold: true });
    rows.forEach((row, i) => addToolRow(slide, pptx, x + 0.22, y + 0.78 + i * 0.53, w - 0.44, row[0], row[1], accent, row[2]));
  }

  function addSmallOutput(slide, pptx, x, y, w, title, body, accent, token) {
    addBox(slide, pptx, x, y, w, 0.78, { fill: C.white, line: accent, round: true, lineWidth: 0.9 });
    addIconCircle(slide, pptx, x + 0.18, y + 0.16, 0.42, token, accent);
    addText(slide, title, x + 0.72, y + 0.17, w - 0.86, 0.18, { size: 9.2, color: accent, bold: true });
    addText(slide, body, x + 0.72, y + 0.42, w - 0.86, 0.2, { size: 7.2, color: C.navy });
  }

  function addHarnessOverview(slide, pptx) {
    const st = shapeTypes(pptx);
    const green = '16A34A';
    const purple = '7E57C2';
    const blue = '0B74DE';
    const orange = 'F59E0B';

    addToolGroup(slide, pptx, 0.86, 1.72, 3.05, 2.18, 'Static', green, 'S', [
      ['jadx', '디컴파일 & 코드 분석', 'J'],
      ['apktool', '리소스 디컴파일', 'A'],
      ['aapt', '패키지 정보 & 리소스 덤프', 'P'],
      ['Semgrep', '패턴 기반 코드 스캔', 'R'],
    ]);
    addToolGroup(slide, pptx, 0.86, 4.16, 3.05, 1.42, 'Native', purple, 'N', [
      ['Ghidra', '네이티브 코드 분석', 'G'],
      ['IDA Pro', '바이너리 분석', 'I'],
    ]);
    addToolGroup(slide, pptx, 9.34, 1.72, 3.05, 2.18, 'Dynamic', blue, 'D', [
      ['adb', '디바이스 제어', 'A'],
      ['Frida', '런타임 후킹', 'F'],
      ['objection', '런타임 탐색 & 조작', 'O'],
      ['logcat', '시스템 로그 수집', 'L'],
    ]);
    addToolGroup(slide, pptx, 9.34, 4.16, 3.05, 1.6, 'Reference', orange, 'R', [
      ['Android permissions', '권한 목록 및 위험도', 'P'],
      ['protected broadcasts', '보호된 브로드캐스트 목록', 'B'],
      ['internal policy', '내부 보안 정책 및 기준', 'I'],
    ]);

    slide.addShape(st.ellipse, {
      x: 4.88, y: 2.34, w: 3.05, h: 2.45,
      fill: { color: C.white },
      line: { color: blue, width: 1.4 },
    });
    addIconCircle(slide, pptx, 6.08, 2.62, 0.56, '✓', blue);
    addText(slide, 'Mobile Audit\nHarness', 5.32, 3.26, 2.15, 0.5, { size: 18, color: C.navy, bold: true, align: 'center' });
    addText(slide, 'Orchestrate · Control · Correlate', 5.42, 3.85, 1.95, 0.17, { size: 8.6, color: blue, bold: true, align: 'center' });
    ['실행 관리', '결과 분석', '정책 기반'].forEach((label, i) => {
      addText(slide, label, 5.2 + i * 0.75, 4.29, 0.62, 0.13, { size: 6.8, color: C.navy, bold: true, align: 'center' });
    });

    [
      [3.9, 2.58, 1.0, 0.45, green],
      [3.9, 4.64, 1.0, -0.55, purple],
      [7.92, 2.58, 1.43, -0.42, blue],
      [7.92, 4.08, 1.43, 0.7, orange],
    ].forEach(([x, y, w, h, color]) => {
      slide.addShape(st.line, { x, y, w, h, line: { color, width: 1.3, dash: 'dash' } });
    });

    addSmallOutput(slide, pptx, 0.9, 5.96, 3.1, 'structured facts', '구조화 정보\n코드 · 리소스 · 권한 · 설정', green, 'DB');
    addSmallOutput(slide, pptx, 4.9, 5.96, 3.1, 'runtime evidence', '실행 증거 수집\nAPI 호출 · IPC · Intent · 로그', blue, 'E');
    addSmallOutput(slide, pptx, 8.9, 5.96, 3.1, 'candidate findings', '후보 이슈 도출\n정책/권한/동작 기반 매칭', orange, '!');
    addText(slide, '→', 4.17, 6.2, 0.36, 0.22, { size: 17, color: green, bold: true, align: 'center' });
    addText(slide, '→', 8.17, 6.2, 0.36, 0.22, { size: 17, color: blue, bold: true, align: 'center' });
    slide.addShape(st.line, { x: 6.4, y: 4.8, w: 0, h: 0.86, line: { color: blue, width: 1.2 } });
    addText(slide, '↓', 6.29, 5.28, 0.22, 0.24, { size: 18, color: blue, bold: true, align: 'center' });

    addBox(slide, pptx, 2.95, 6.88, 7.42, 0.42, { fill: C.white, line: C.lightBlue, round: true });
    addIconCircle(slide, pptx, 4.08, 6.93, 0.3, '✓', blue);
    addText(slide, '도구는 역할에 맞게 제한, Harness가 일관되게 관리', 4.48, 6.96, 4.95, 0.16, { size: 9.6, color: C.navy, bold: true, align: 'center' });
  }

  function addLaneStep(slide, pptx, x, y, w, h, title, body, accent, token) {
    addBox(slide, pptx, x, y, w, h, { fill: C.white, line: accent, round: true, lineWidth: 0.75 });
    addIconCircle(slide, pptx, x + 0.16, y + 0.15, 0.36, token, accent);
    addText(slide, title, x + 0.62, y + 0.17, w - 0.78, 0.18, { size: 9.7, color: C.navy, bold: true });
    addText(slide, body, x + 0.62, y + 0.43, w - 0.78, 0.2, { size: 7.3, color: C.darkText });
  }

  function addDeterministicComparison(slide, pptx) {
    const st = shapeTypes(pptx);
    const red = 'DC2626';
    const green = '15803D';
    const blue = '0B74DE';
    const orange = 'F59E0B';
    const purple = '7E57C2';

    addBox(slide, pptx, 0.72, 1.72, 5.66, 4.95, { fill: 'FFF7F7', line: 'FCA5A5', round: true, lineWidth: 0.9 });
    addText(slide, 'free search', 0.92, 1.93, 5.25, 0.32, { size: 17.5, color: red, bold: true, align: 'center' });
    addBox(slide, pptx, 1.05, 2.52, 5.0, 0.58, { fill: C.white, line: 'FCA5A5', round: true, lineWidth: 0.75 });
    addIconCircle(slide, pptx, 1.38, 2.64, 0.34, 'U', red);
    addText(slide, '정적 분석에서 문제 탐색', 2.1, 2.7, 2.9, 0.16, { size: 10.5, color: C.darkText, bold: true, align: 'center' });
    addText(slide, '↓', 3.46, 3.12, 0.2, 0.18, { size: 12, color: C.navy, bold: true, align: 'center' });
    addBox(slide, pptx, 1.05, 3.36, 5.0, 0.58, { fill: 'FAFAFF', line: 'B8B2D9', round: true, lineWidth: 0.75 });
    addIconCircle(slide, pptx, 1.38, 3.48, 0.34, 'AI', C.navy);
    addText(slide, 'AI가 임의로 keyword 선택', 2.1, 3.51, 2.9, 0.16, { size: 10.5, color: C.darkText, bold: true, align: 'center' });
    addText(slide, '(경험/추측 기반)', 2.7, 3.72, 1.7, 0.13, { size: 7.5, color: C.darkText, align: 'center' });
    ['rg 검색\n키워드 기반', 'jadx 분석\n역컴파일 탐색', 'Manifest 분석\n컴포넌트 확인'].forEach((label, i) => {
      addBox(slide, pptx, 1.0 + i * 1.65, 4.5, 1.38, 0.58, { fill: C.white, line: 'B8B2D9', round: true, lineWidth: 0.75 });
      addText(slide, label, 1.08 + i * 1.65, 4.62, 1.22, 0.26, { size: 7.2, color: C.navy, bold: true, align: 'center' });
    });
    ['다른 단서 A', '다른 단서 B', '다른 단서 C', '...'].forEach((label, i) => {
      addBox(slide, pptx, 1.0 + i * 1.25, 5.6, 0.98, 0.38, { fill: C.white, line: 'B8B2D9', round: true, lineWidth: 0.65 });
      addText(slide, label, 1.07 + i * 1.25, 5.72, 0.84, 0.1, { size: 6.8, color: C.navy, align: 'center' });
    });
    addBox(slide, pptx, 0.98, 6.12, 4.95, 0.42, { fill: 'FFF1F2', line: 'FCA5A5', round: true, lineWidth: 0.75 });
    addText(slide, '!  토큰 사용량 증가  /  누락 가능성 높음  /  결과 일관성 낮음', 1.12, 6.25, 4.65, 0.1, { size: 7.8, color: red, bold: true, align: 'center' });
    [
      [3.55, 3.95, -2.0, 0.5],
      [3.55, 3.95, 0, 0.5],
      [3.55, 3.95, 2.0, 0.5],
      [1.68, 5.08, 0, 0.46],
      [3.34, 5.08, 0, 0.46],
      [4.98, 5.08, 0, 0.46],
    ].forEach(([x, y, w, h]) => slide.addShape(st.line, { x, y, w, h, line: { color: C.muted, width: 0.7, dash: 'dash' } }));

    addBox(slide, pptx, 6.74, 1.72, 5.9, 4.95, { fill: 'F6FEFA', line: '86EFAC', round: true, lineWidth: 0.9 });
    addText(slide, 'deterministic + AI', 6.95, 1.93, 5.45, 0.32, { size: 17.5, color: green, bold: true, align: 'center' });
    addBox(slide, pptx, 7.04, 2.52, 5.3, 2.88, { fill: C.white, line: C.lightBlue, round: true, lineWidth: 0.75 });
    addText(slide, '1단계: Deterministic Block  (결정적 파이프라인)', 7.48, 2.75, 4.3, 0.2, { size: 11.5, color: blue, bold: true });
    addLaneStep(slide, pptx, 7.28, 3.16, 4.8, 0.48, 'manifest_extract', 'AndroidManifest.xml 파싱 / 컴포넌트, 권한, Intent-Filter 추출', blue, 'M');
    addText(slide, '↓', 9.55, 3.65, 0.2, 0.16, { size: 11, color: blue, bold: true, align: 'center' });
    addLaneStep(slide, pptx, 7.28, 3.84, 4.8, 0.48, 'aapt cross-check', 'aapt dump badging 분석 / 패키지·권한·컴포넌트 교차 검증', '0F9F8D', 'P');
    addText(slide, '↓', 9.55, 4.34, 0.2, 0.16, { size: 11, color: blue, bold: true, align: 'center' });
    addLaneStep(slide, pptx, 7.28, 4.52, 4.8, 0.48, 'jadx evidence index', '정적 분석 및 증거 인덱싱 / 위험 API, Sink, 권한 사용 추출', orange, 'J');
    addText(slide, '↓', 9.55, 5.02, 0.2, 0.16, { size: 11, color: blue, bold: true, align: 'center' });
    addLaneStep(slide, pptx, 7.28, 5.2, 4.8, 0.48, '출력 (구조화 데이터)', 'component-facts.json / source-evidence.json', purple, 'DB');

    addText(slide, '↓', 9.55, 5.74, 0.2, 0.18, { size: 12, color: C.navy, bold: true, align: 'center' });
    addBox(slide, pptx, 7.04, 5.94, 5.3, 0.58, { fill: C.white, line: 'BBF7D0', round: true, lineWidth: 0.75 });
    addText(slide, '2단계: AI Judgment  (AI 판단)', 7.48, 6.13, 4.15, 0.18, { size: 11.5, color: green, bold: true });
    addBox(slide, pptx, 7.4, 6.48, 3.32, 0.48, { fill: 'F7FFFB', line: 'BBF7D0', round: true, lineWidth: 0.75 });
    addIconCircle(slide, pptx, 7.6, 6.55, 0.34, 'AI', green);
    addText(slide, 'AI가 구조화된 증거를 바탕으로 판단', 8.02, 6.6, 2.25, 0.12, { size: 7.5, color: green, bold: true });
    addText(slide, '✓ 위험도 분류   ✓ 근거 기반 설명   ✓ 일관된 결과 출력', 8.0, 6.78, 2.48, 0.1, { size: 6.6, color: C.darkText });
    addBox(slide, pptx, 10.95, 6.48, 1.1, 0.48, { fill: C.white, line: C.lightBlue, round: true, lineWidth: 0.75 });
    addText(slide, 'evidence-backed\noutput', 11.08, 6.6, 0.84, 0.16, { size: 6.8, color: C.navy, bold: true, align: 'center' });
  }

  async function buildDeck({ pptx, fileName }) {
    const pocScreenshots = await Promise.all([
      loadImageData('../assets/images/android-security-harness/poc-01-select.png'),
      loadImageData('../assets/images/android-security-harness/poc-02-running.png'),
      loadImageData('../assets/images/android-security-harness/poc-03-findings.png'),
      loadImageData('../assets/images/android-security-harness/poc-04-report.png'),
    ]);

    pptx.lang = 'ko-KR';
    pptx.company = 'present-anything';
    pptx.subject = 'AI 기반 Android 보안 분석 및 검증 Harness';
    pptx.title = 'AI 기반 Android 보안 분석 및 검증 Harness';
    pptx.theme = {
      headFontFace: FONT,
      bodyFontFace: FONT,
      lang: 'ko-KR',
    };

    let slide = pptx.addSlide();
    addCover(slide, pptx);

    slide = pptx.addSlide();
    addHeader(slide, pptx, 2, '추진 배경 - 보안검토 업무량 증가', '보안검토, APK 서명 리뷰, Spot 이슈 분석과 PLM 대응을 빠르게 처리해야 하는 운영 부담 확대', '추진 배경');
    addMetricCard(slide, pptx, 0.9, 1.82, 5.45, 1.42, '2025년 보안검토 요청 건수', '1,045건', '연간 누적 검토 요청 기준', C.navy);
    addMetricCard(slide, pptx, 6.95, 1.82, 5.45, 1.42, 'APK 서명을 위한 리뷰 건수', '일 평균 약 150건', '매일 처리되는 서명 전 검토 기준', C.blue);
    addTable(slide, pptx, 0.9, 3.72, 11.5, 0.58, ['구분', '현재 상황', '운영상 영향'], [
      ['다량 분석 대응', 'Spot성 이슈 분석, PLM 등 다량의 분석을 빠르게 수행해야 함', '분석 처리 속도와 우선순위 판단 부담 증가'],
      ['수작업 의존', '후보 선별, 검증 계획 수립, 재현, 보고까지 담당자 판단에 의존', '검토자별 결과 편차 발생 가능'],
      ['운영 리스크', '분석 절차와 증거 기준이 매번 수동으로 정리됨', '일관성과 재현성 저하'],
    ], [1.55, 6.05, 3.9]);
    addCard(slide, pptx, 1.15, 6.24, 10.95, 0.56, '핵심 문제', '업무량 증가 상황에서 수작업 중심 검토를 유지하면 후보 선별, 검증, 보고 품질의 일관성과 재현성이 낮아질 수 있음', { fill: C.paleBlue, line: C.lightBlue, titleSize: 9, bodySize: 8 });

    slide = pptx.addSlide();
    addHeader(slide, pptx, 3, '추진 배경 - AI 분석 적용 시 문제점', 'AI는 분석 속도를 높일 수 있으나 보정, 검증, 결과 일관성 측면의 통제가 필요', '추진 배경');
    addTable(slide, pptx, 0.9, 1.82, 11.5, 0.68, ['구분', '주요 현상', '보안 점검 영향'], [
      ['수작업 보정 필요', '사람이 AI 분석 결과를 재확인하고 수정해야 하는 경우가 많음', '자동화 효과 제한 및 검토자 부담 지속'],
      ['검증 없는 이슈 확정', '재현 검증 없이 이슈를 확정하는 경우가 많음', 'False Positive 증가'],
      ['결과 변동성', '동일 입력임에도 AI 분석 결과가 다르게 나오는 경우가 많음', '점검 결과 신뢰성 저하'],
    ], [2.2, 5.9, 3.4]);
    addCard(slide, pptx, 1.15, 5.1, 10.95, 0.86, '관리 방향', 'AI 분석 결과는 확정 finding이 아니라 검증 대상 후보로 관리하고, 단말 재현과 evidence 기준을 거쳐 최종 채택해야 함', { fill: C.white, line: C.blue, titleSize: 10.8, bodySize: 9 });
    addCard(slide, pptx, 1.15, 6.22, 10.95, 0.56, '핵심 문제', '근거 보정과 재현 검증 없이 AI 결과를 그대로 채택하면 오탐이 늘고 결과 신뢰성이 낮아짐', { fill: C.paleBlue, line: C.lightBlue, titleSize: 9, bodySize: 8 });

    slide = pptx.addSlide();
    addHeader(slide, pptx, 4, '과제 목표', 'AI 기반 빠른 분석과 실단말 검증을 결합해 재현 가능한 보안 점검 체계 구축', '과제 목표');
    addProcess(slide, pptx, 2.05, [
      { no: '01', title: '빠른 취약점 분석', body: 'AI를 사용해 보안 취약점 후보와 관련 근거를 신속하게 분석' },
      { no: '02', title: '기존 Pain Point 해결', body: '낮은 재현성, 과도한 수작업, 높은 False Positive 개선' },
      { no: '03', title: '재현 가능한 보고', body: '실단말 검증 Harness로 검증자가 쉽게 재현 가능한 보고서 작성' },
    ]);
    addCard(slide, pptx, 1.1, 4.15, 10.9, 1.08, '목표 상태', 'AI 분석 결과를 빠르게 후보화하고, 실단말 재현 검증과 evidence를 포함한 보고서로 전환하여 검증자의 재현 부담을 낮춤', { fill: C.white, line: C.blue });

    slide = pptx.addSlide();
    addHeader(slide, pptx, 5, 'Mobile Audit Harness 구성', '도구 역할을 분리하고 Harness가 실행, 수집, 상관분석을 일관되게 관리', '과제 목표');
    addHarnessOverview(slide, pptx);

    slide = pptx.addSlide();
    addHeader(slide, pptx, 6, '관련 조사 및 벤치마킹 검토', '기존 자료는 일부 요소만 차용 가능하며, 본 과제 평가 기준으로는 직접 사용하기 어려움', '관련연구 및 벤치마킹 조사');
    addBenchmarkFitTable(slide, pptx, 0.82, 1.68, 11.5);
    addBox(slide, pptx, 1.1, 6.38, 11.05, 0.48, { fill: C.paleBlue, line: C.lightBlue, round: true });
    addText(slide, '검토 결론', 1.26, 6.53, 1.0, 0.14, { size: 8.5, color: C.navy, bold: true });
    addText(slide, '단말 조작 -> 취약점 트리거 -> evidence/oracle 판정까지 평가하려면 별도 보안 검증 벤치마크와 실제 앱 기반 E2E 케이스 구성이 필요', 2.2, 6.53, 9.65, 0.14, { size: 7.4, color: C.grayText });

    slide = pptx.addSlide();
    addHeader(slide, pptx, 7, '추진 방식', '결정적 분석 틀을 먼저 고정하고 AI는 후보 생성과 검증 조정에 제한적으로 활용', '과제 추진 사항');
    addDeterministicComparison(slide, pptx);
    addCard(slide, pptx, 2.05, 6.88, 9.2, 0.34, '핵심 기준', 'AI에게 임의 탐색을 맡기기 전에 결정적 분석 틀과 구조화된 evidence를 먼저 제공', { fill: C.paleBlue, line: C.lightBlue, titleSize: 7.5, bodySize: 6.8 });

    slide = pptx.addSlide();
    addHeader(slide, pptx, 8, 'PoC 스크린샷', '대상 선택, 분석 단계 진행, findings 확인, 보고서 검토까지의 end-to-end 화면 예시', '과제 추진 사항');
    addScreenshotCard(slide, pptx, pocScreenshots[0], 0.78, 1.72, 5.85, 2.32, '01. 대상 패키지 선택', '분석 job queue에서 대상 APK와 우선 검토 대상을 선택');
    addScreenshotCard(slide, pptx, pocScreenshots[1], 6.72, 1.72, 5.85, 2.32, '02. 분석 구동 상태 확인', 'ingest, decompile, manifest, semgrep 등 stage 진행 상태 확인');
    addScreenshotCard(slide, pptx, pocScreenshots[2], 0.78, 4.34, 5.85, 2.32, '03. Findings 상세 검토', 'severity, evidence, location, LLM analysis 및 stored output 확인');
    addScreenshotCard(slide, pptx, pocScreenshots[3], 6.72, 4.34, 5.85, 2.32, '04. 분석 완료 보고서', 'summary, validation, metadata, permissions, report artifact 확인');

    slide = pptx.addSlide();
    addHeader(slide, pptx, 9, '기대 효과', '분석 자동화와 단말 검증을 결합하여 finding 신뢰도와 운영 재현성 개선', '기대 효과');
    addTable(slide, pptx, 0.8, 1.82, 11.75, 0.65, ['영역', '기대 효과', '확인 기준'], [
      ['자동화', '정적 검출 후보와 반복 증거 수집을 표준 루프로 구성', '검증 목표 및 observation 생성 여부'],
      ['재현성', '에뮬레이터 또는 테스트 단말 상태 기준으로 결과 보존', '실행 trace 및 artifact 보존 여부'],
      ['오탐 관리', '사전 조건 부족과 증거 부족을 finding 채택 전 분리', 'Inconclusive 판정 운영 여부'],
      ['확장성', '단일 rule hit가 아닌 chain, precondition, observation 동시 판단', '복합 시나리오 추가 가능성'],
    ], [1.6, 6.1, 4.05]);

    slide = pptx.addSlide();
    addHeader(slide, pptx, 10, '향후 계획 개요', '역할 분리, Harness AI 학습·벤치마크, 평가 metric 기반 결론 도출로 다음 단계를 구분', '향후 계획');
    addFuturePlanOverview(slide, pptx);

    slide = pptx.addSlide();
    addHeader(slide, pptx, 11, '단일 AI 구조의 한계', '분석, 실행, 판정의 책임 경계가 다르므로 역할 분리 기반 통제 필요', '향후 계획');
    addTable(slide, pptx, 0.9, 1.85, 11.55, 0.64, ['구분', '단일 AI 흐름', '역할 분리 흐름'], [
      ['목표 설정', '분석과 실행 목표가 혼재될 가능성', 'Security AI가 검증 목표만 정의'],
      ['실행 통제', '위험한 단말 동작 선택 가능성', 'Harness AI가 allowlisted action만 선택'],
      ['증거 판단', '증거 부족 상태에서도 결론 생성 가능성', 'Oracle이 evidence 기준으로만 판정'],
      ['추적성', '실패 원인과 재현 경로 추적 어려움', 'Trace, artifact, proof state 보존'],
    ], [1.45, 5.05, 5.05]);

    slide = pptx.addSlide();
    addHeader(slide, pptx, 12, '역할 분리 기반 검증 구조', 'Harness AI 내부 검증 루프와 Oracle 분기를 분리해 검증 상태를 갱신', '향후 계획');
    addCard(slide, pptx, 0.8, 1.75, 1.75, 0.92, 'Input', 'Fact Graph\nCode / Manifest', { fill: C.white, line: C.blue, titleSize: 11, bodySize: 8.8 });
    addText(slide, '→', 2.58, 2.08, 0.28, 0.22, { size: 15, color: C.blue, bold: true, align: 'center' });
    addCard(slide, pptx, 2.9, 1.75, 1.85, 0.92, 'Security AI', '검증 목표\n조건 정의', { fill: C.white, line: C.blue, titleSize: 11, bodySize: 8.8 });
    addText(slide, '→', 4.78, 2.08, 0.28, 0.22, { size: 15, color: C.blue, bold: true, align: 'center' });
    addBox(slide, pptx, 5.1, 1.42, 3.35, 1.56, { fill: C.paleBlue, line: C.blue, round: true });
    addText(slide, 'Harness AI', 5.32, 1.55, 2.9, 0.22, { size: 11.5, color: C.navy, bold: true, align: 'center' });
    addText(slide, '실행 · 관찰 수집', 5.42, 1.8, 2.72, 0.18, { size: 8.8, color: C.grayText, align: 'center' });
    addCard(slide, pptx, 5.34, 2.1, 0.86, 0.42, 'Action', '선택', { fill: C.white, line: C.line, titleSize: 7.6, bodySize: 6.8 });
    addText(slide, '→', 6.2, 2.23, 0.18, 0.16, { size: 9, color: C.blue, bold: true, align: 'center' });
    addCard(slide, pptx, 6.42, 2.1, 0.86, 0.42, '단말', '실행', { fill: C.white, line: C.line, titleSize: 7.6, bodySize: 6.8 });
    addText(slide, '→', 7.28, 2.23, 0.18, 0.16, { size: 9, color: C.blue, bold: true, align: 'center' });
    addCard(slide, pptx, 7.5, 2.1, 0.72, 0.42, '증거', '확인', { fill: C.white, line: C.line, titleSize: 7.6, bodySize: 6.8 });
    addText(slide, '부족 시 내부 재시도', 5.72, 2.62, 2.14, 0.2, { size: 8.2, color: C.blue, bold: true, align: 'center' });
    addText(slide, '→', 8.48, 2.08, 0.28, 0.22, { size: 15, color: C.blue, bold: true, align: 'center' });
    addCard(slide, pptx, 8.8, 1.75, 1.65, 0.92, 'Oracle', 'Evidence 기준\n분기', { fill: C.white, line: C.blue, titleSize: 11, bodySize: 8.8 });
    ['Confirmed', 'Refuted', 'Inconclusive', '추가 검증 필요'].forEach((label, i) => {
      const y = 1.36 + i * 0.43;
      addBox(slide, pptx, 10.85, y, 1.55, 0.28, { fill: i === 3 ? C.paleBlue : C.white, line: i === 3 ? C.blue : C.line, round: true });
      addText(slide, label, 10.9, y + 0.03, 1.45, 0.16, { size: 7.8, color: C.navy, bold: true, align: 'center' });
    });
    addText(slide, '추가 검증 필요 → Security AI로 재진입', 3.8, 3.28, 5.7, 0.32, { size: 10.5, color: C.blue, bold: true, align: 'center' });
    addCard(slide, pptx, 0.9, 4.35, 3.55, 0.86, '책임 경계 명확화', '목표 설정, 실행, 판정을 별도 책임으로 분리', { fill: C.white, line: C.line, titleSize: 10.4, bodySize: 8.5 });
    addCard(slide, pptx, 4.88, 4.35, 3.55, 0.86, '실행 권한 통제', 'Harness AI는 allowlisted action 범위에서만 실행', { fill: C.white, line: C.line, titleSize: 10.4, bodySize: 8.5 });
    addCard(slide, pptx, 8.86, 4.35, 3.55, 0.86, '증거 기반 판정', 'Oracle은 저장된 evidence와 rule 기준으로만 판정', { fill: C.white, line: C.line, titleSize: 10.4, bodySize: 8.5 });

    slide = pptx.addSlide();
    addHeader(slide, pptx, 13, '학습 계획', 'Qwen3.5 - 9B 기반 Harness AI 특화 학습으로 비용 효율과 운영 유연성 확보', '향후 계획');
    addModelTrainingPlan(slide, pptx);

    slide = pptx.addSlide();
    addHeader(slide, pptx, 14, '벤치마크 계획', 'Harness AI의 단말 조작, 복구, 증거 수집 능력을 자체 벤치마크로 정량 평가', '향후 계획');
    addBenchmarkPlan(slide, pptx);

    slide = pptx.addSlide();
    addHeader(slide, pptx, 15, 'Harness AI', '허용된 action 안에서 단말 실행과 observation 수집을 조정', '향후 계획');
    addProcess(slide, pptx, 1.95, [
      { no: '01', title: '검증 목표 수신', body: '검증 조건과 현재 Proof State 확인' },
      { no: '02', title: 'Typed Action 선택', body: 'write_artifact, collect_logcat, check_ui_state' },
      { no: '03', title: '실행 및 수집', body: 'ADB / Tool / 단말 결과 수집' },
      { no: '04', title: '정리 및 보고', body: 'Observation Summary와 cleanup 결과 기록' },
    ]);
    addTable(slide, pptx, 1.1, 4.35, 11.15, 0.5, ['통제 항목', '내용'], [
      ['Action 제한', 'raw adb/shell 직접 노출 차단 및 allowlist 기반 실행'],
      ['반복 한계', 'Bounded retry와 실패 trace 보존'],
      ['감사 추적', '실행 명령, raw signal, artifact를 evidence bundle로 관리'],
    ], [2.15, 9.0]);

    slide = pptx.addSlide();
    addHeader(slide, pptx, 16, 'Verifier / Oracle', '저장된 evidence와 oracle rule 기준으로 최종 상태를 판정', '향후 계획');
    addTable(slide, pptx, 0.9, 1.82, 11.55, 0.62, ['상태', '판정 의미', '처리 방향'], [
      ['Confirmed', '요구한 evidence와 oracle 조건 충족', 'finding 후보로 채택 가능'],
      ['Refuted', '관찰 결과가 가설 또는 oracle 조건과 불일치', '후보 제외 또는 가설 수정'],
      ['Inconclusive', '증거 부족 또는 사전 조건 미충족', '추가 검증 목표로 회수'],
    ], [2.0, 6.05, 3.5]);
    addCard(slide, pptx, 1.1, 5.25, 11.1, 0.75, '판정 원칙', '최종 판단은 모델 설명이 아니라 저장된 observation, trace, artifact, oracle rule에 근거', { fill: C.paleBlue, line: C.lightBlue });

    slide = pptx.addSlide();
    addHeader(slide, pptx, 17, '피드백 확인 포인트', 'MVP 범위, 검증 환경, finding 채택 기준, 다음 단계 산출물 확정 필요', '부서장 피드백');
    addTable(slide, pptx, 0.85, 1.82, 11.65, 0.62, ['확인 항목', '논의 내용', '결정 필요 사항'], [
      ['우선 취약점 유형', 'exported component, WebView bridge, deeplink, storage, network', 'MVP 검증 범위'],
      ['검증 환경', 'emulator, real device, OS version, 테스트 계정, 데이터 초기화', '운영 기준'],
      ['Finding 채택 기준', 'Confirmed / Refuted / Inconclusive 판정과 보고서 반영', '보고 기준'],
      ['다음 단계 산출물', '검증 명세 양식, evidence bundle, oracle rule, 데모 앱 세트', '착수 항목'],
    ], [2.15, 6.15, 3.35]);

    return { fileName };
  }

  window.createEditablePptxDeck = buildDeck;
}());
