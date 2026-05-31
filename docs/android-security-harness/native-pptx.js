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

  function shapeTypes(pptx) {
    return pptx.ShapeType || {
      rect: 'rect',
      roundRect: 'roundRect',
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
    addText(slide, `${index} / 15`, 11.9, 7.05, 0.8, 0.18, { size: 8.5, color: C.muted, align: 'right' });
  }

  async function loadImageData(relativePath) {
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

  async function buildDeck({ pptx, fileName }) {
    const harnessImage = await loadImageData('../assets/images/ai-agent-effective-use/mobile-audit-harness.png');
    const deterministicImage = await loadImageData('../assets/images/ai-agent-effective-use/deterministic-vs-free-search.png');

    pptx.lang = 'ko-KR';
    pptx.company = 'present-anyything';
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
    addHeader(slide, pptx, 2, '추진 배경', 'Android 보안 점검의 범위 확대와 AI 후보 분석의 변동성을 통제할 검증 체계 필요', '추진 배경');
    addTable(slide, pptx, 0.75, 1.82, 11.85, 0.62, ['구분', '주요 이슈', '개선 필요성'], [
      ['점검 범위', 'Manifest, decompiled code, runtime behavior, device state 동시 확인 필요', '분석 입력 정규화 필요'],
      ['AI 후보', '동일 입력의 결과 변동, 근거 부족 추론, 사전 조건 누락 가능', '후보와 확정 finding 분리 필요'],
      ['취약점 판단', '실제 단말에서 재현되지 않는 후보를 그대로 채택할 위험', '재현 증거 기반 판정 필요'],
      ['운영 체계', '분석 결과와 실행 검증 사이의 연결 기준 부족', 'ProbeSpec 및 evidence 루프 필요'],
    ], [1.45, 6.0, 4.4]);

    slide = pptx.addSlide();
    addHeader(slide, pptx, 3, '과제 목표', 'AI 분석, 단말 검증, evidence 판정을 하나의 표준 절차로 구성', '과제 목표');
    addProcess(slide, pptx, 2.05, [
      { no: '01', title: 'AI 기반 후보 도출', body: '코드, Manifest, 리포트, 실행 흐름 기반 후보 취약점 생성' },
      { no: '02', title: '검증 목표 구조화', body: '후보를 ProbeSpec과 필요한 evidence 조건으로 변환' },
      { no: '03', title: '단말 기반 검증', body: '허용된 action 안에서 재현 가능성과 관찰 결과 확인' },
      { no: '04', title: 'Evidence 중심 판정', body: '모델 의견이 아닌 observation과 oracle rule 기준 판정' },
    ]);
    addCard(slide, pptx, 1.1, 4.15, 10.9, 1.08, '목표 상태', 'Confirmed / Refuted / Inconclusive 판정을 분리하고, 증거 부족 상태를 finding 채택 전 단계에서 관리', { fill: C.white, line: C.blue });

    slide = pptx.addSlide();
    addHeader(slide, pptx, 4, 'Mobile Audit Harness 구성', '도구 역할을 분리하고 Harness가 실행, 수집, 상관분석을 일관되게 관리', '과제 목표');
    addImageContain(slide, pptx, harnessImage, 1672, 941, 0.8, 1.72, 11.75, 4.9);

    addResearchSlide(pptx.addSlide(), pptx, 5, 'Ghera 벤치마킹', '취약 앱 세트와 수정/benign 변형을 기준으로 재현성 검증 체계 수립', {
      title: 'Benchmark Repository',
      body: '취약 동작, 악용 앱, 수정 또는 benign 변형을 함께 둔 Android 보안 벤치마크',
      note: 'Source: Ghera: A Repository of Android App Vulnerability Benchmarks',
    }, [
      { title: '데모 앱 세트 고정', body: '알려진 취약/수정 쌍으로 MVP 판정 안정성 확인' },
      { title: 'Rule hit와 exploitability 분리', body: '정적 탐지 후보와 실제 악용 조건 충족 여부를 별도 검증' },
      { title: '회귀 테스트 자산화', body: '검증 케이스와 oracle rule을 저장하여 도구 변경 시 재검증' },
    ]);

    addResearchSlide(pptx.addSlide(), pptx, 6, 'COVA 벤치마킹', '정적 분석 결과를 finding이 아니라 검증 대상 가설로 취급', {
      title: 'Taint Result Analysis',
      body: 'FlowDroid가 보고한 taint flow도 사용자 입력, 환경 설정, I/O 조건에 따라 실제 발생 여부가 달라질 수 있음',
      note: 'Source: A Qualitative Analysis of Android Taint-Analysis Results',
    }, [
      { title: '분석 결과의 가설화', body: 'AI나 정적 분석 후보를 검증 목표와 조건 목록으로 변환' },
      { title: '사전 조건 관찰', body: '사용자 동작, 설정값, 파일/네트워크 상태를 observation에 포함' },
      { title: 'Inconclusive 상태 운영', body: '증거 부족 후보를 억지로 Confirmed 또는 Refuted로 분류하지 않음' },
    ]);

    addResearchSlide(pptx.addSlide(), pptx, 7, 'AndroidWorld 벤치마킹', '모델 응답이 아니라 emulator 상태 변화로 작업 성공 여부 평가', {
      title: 'Agent Benchmark',
      body: '각 task가 초기화, agent 실행, success checking, tear-down logic을 포함한 반복 가능한 평가 단위로 구성',
      note: 'Source: AndroidWorld: A Dynamic Benchmarking Environment for Autonomous Agents',
    }, [
      { title: '검증 task lifecycle', body: 'setup, action, observe, cleanup을 하나의 ProbeSpec 실행 단위로 관리' },
      { title: '상태 기반 oracle', body: 'UI, logcat, file, intent result 등 관찰 가능한 상태 기준 판정' },
      { title: '실패 데이터 보존', body: 'tear-down, retry limit, audit trail을 남겨 다음 실행에 활용' },
    ]);

    slide = pptx.addSlide();
    addHeader(slide, pptx, 8, '추진 방식', '결정적 분석 틀을 먼저 고정하고 AI는 후보 생성과 검증 조정에 제한적으로 활용', '과제 추진 사항');
    addImageContain(slide, pptx, deterministicImage, 1536, 1024, 1.3, 1.7, 10.75, 4.8);
    addCard(slide, pptx, 2.05, 6.1, 9.2, 0.56, '핵심 기준', 'AI에게 임의 탐색을 맡기기 전에 결정적 분석 틀과 구조화된 evidence를 먼저 제공', { fill: C.paleBlue, line: C.lightBlue, titleSize: 9.2, bodySize: 8.2 });

    slide = pptx.addSlide();
    addHeader(slide, pptx, 9, '기대 효과', '분석 자동화와 단말 검증을 결합하여 finding 신뢰도와 운영 재현성 개선', '기대 효과');
    addTable(slide, pptx, 0.8, 1.82, 11.75, 0.65, ['영역', '기대 효과', '확인 기준'], [
      ['자동화', '분석 후보 생성과 반복 증거 수집을 표준 루프로 구성', 'ProbeSpec 및 observation 생성 여부'],
      ['재현성', '에뮬레이터 또는 테스트 단말 상태 기준으로 결과 보존', '실행 trace 및 artifact 보존 여부'],
      ['오탐 관리', '사전 조건 부족과 증거 부족을 finding 채택 전 분리', 'Inconclusive 판정 운영 여부'],
      ['확장성', '단일 rule hit가 아닌 chain, precondition, observation 동시 판단', '복합 시나리오 추가 가능성'],
    ], [1.6, 6.1, 4.05]);

    slide = pptx.addSlide();
    addHeader(slide, pptx, 10, '단일 AI 구조의 한계', '분석, 실행, 판정의 책임 경계가 다르므로 역할 분리 기반 통제 필요', '향후 계획');
    addTable(slide, pptx, 0.9, 1.85, 11.55, 0.64, ['구분', '단일 AI 흐름', '역할 분리 흐름'], [
      ['목표 설정', '분석과 실행 목표가 혼재될 가능성', 'Security AI가 검증 목표만 정의'],
      ['실행 통제', '위험한 단말 동작 선택 가능성', 'Harness AI가 allowlisted action만 선택'],
      ['증거 판단', '증거 부족 상태에서도 결론 생성 가능성', 'Oracle이 evidence 기준으로만 판정'],
      ['추적성', '실패 원인과 재현 경로 추적 어려움', 'Trace, artifact, proof state 보존'],
    ], [1.45, 5.05, 5.05]);

    slide = pptx.addSlide();
    addHeader(slide, pptx, 11, '역할 분리 기반 검증 구조', 'Harness AI 내부 검증 루프와 Oracle 분기를 분리해 검증 상태를 갱신', '향후 계획');
    addCard(slide, pptx, 0.8, 1.75, 1.75, 0.92, 'Input', 'Fact Graph\nCode / Manifest', { fill: C.white, line: C.blue, titleSize: 11, bodySize: 8.8 });
    addText(slide, '→', 2.58, 2.08, 0.28, 0.22, { size: 15, color: C.blue, bold: true, align: 'center' });
    addCard(slide, pptx, 2.9, 1.75, 1.85, 0.92, 'Security AI', '검증 목표\nProbeSpec 정의', { fill: C.white, line: C.blue, titleSize: 11, bodySize: 8.8 });
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
    addHeader(slide, pptx, 12, 'Security AI', '무엇을 검증할지 결정하고 실행 가능한 ProbeSpec으로 구조화', '향후 계획');
    addTable(slide, pptx, 0.9, 1.85, 11.55, 0.62, ['입력', '처리', '출력'], [
      ['Fact Graph / Decompiled Code / Manifest', '취약 체인 가설 수립', 'Chain Hypothesis'],
      ['Candidate findings', '필요 evidence 및 proof boundary 정의', 'Verification Goal / Evidence Requirement'],
      ['분석 산출물', '검증 대상과 제외 범위 분리', 'ProbeSpec'],
    ], [3.8, 4.35, 3.4]);
    addCard(slide, pptx, 2.05, 5.05, 9.2, 0.72, '검증 패턴', 'External actor → Mutable Artifact → Privileged Consumer → Sensitive Sink', { fill: C.paleBlue, line: C.lightBlue });

    slide = pptx.addSlide();
    addHeader(slide, pptx, 13, 'Harness AI', '허용된 action 안에서 단말 실행과 observation 수집을 조정', '향후 계획');
    addProcess(slide, pptx, 1.95, [
      { no: '01', title: 'ProbeSpec 수신', body: '검증 목표와 현재 Proof State 확인' },
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
    addHeader(slide, pptx, 14, 'Verifier / Oracle', '저장된 evidence와 oracle rule 기준으로 최종 상태를 판정', '향후 계획');
    addTable(slide, pptx, 0.9, 1.82, 11.55, 0.62, ['상태', '판정 의미', '처리 방향'], [
      ['Confirmed', '요구한 evidence와 oracle 조건 충족', 'finding 후보로 채택 가능'],
      ['Refuted', '관찰 결과가 가설 또는 oracle 조건과 불일치', '후보 제외 또는 가설 수정'],
      ['Inconclusive', '증거 부족 또는 사전 조건 미충족', '추가 검증 목표로 회수'],
    ], [2.0, 6.05, 3.5]);
    addCard(slide, pptx, 1.1, 5.25, 11.1, 0.75, '판정 원칙', '최종 판단은 모델 설명이 아니라 저장된 observation, trace, artifact, oracle rule에 근거', { fill: C.paleBlue, line: C.lightBlue });

    slide = pptx.addSlide();
    addHeader(slide, pptx, 15, '피드백 확인 포인트', 'MVP 범위, 검증 환경, finding 채택 기준, 다음 단계 산출물 확정 필요', '부서장 피드백');
    addTable(slide, pptx, 0.85, 1.82, 11.65, 0.62, ['확인 항목', '논의 내용', '결정 필요 사항'], [
      ['우선 취약점 유형', 'exported component, WebView bridge, deeplink, storage, network', 'MVP 검증 범위'],
      ['검증 환경', 'emulator, real device, OS version, 테스트 계정, 데이터 초기화', '운영 기준'],
      ['Finding 채택 기준', 'Confirmed / Refuted / Inconclusive 판정과 보고서 반영', '보고 기준'],
      ['다음 단계 산출물', 'ProbeSpec schema, evidence bundle, oracle rule, 데모 앱 세트', '착수 항목'],
    ], [2.15, 6.15, 3.35]);

    return { fileName };
  }

  window.createEditablePptxDeck = buildDeck;
}());
