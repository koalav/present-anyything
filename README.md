# Slidev Static Presentation Site

GitHub Pages에서 정적 파일로 서빙되는 Slidev 기반 프리젠테이션 프로젝트입니다.

## 요구사항

- Node.js 22+
- npm

## 설치

```bash
npm install
```

## 로컬 실행

```bash
npm run dev:semgrep
npm run dev:windows
```

## 정적 빌드

```bash
npm run build
```

빌드 결과는 `dist/`에 생성됩니다.

## GitHub Pages 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로 `dist/`를 빌드하고 GitHub Pages에 배포합니다.

GitHub 저장소 설정에서 다음을 확인해야 합니다.

1. `Settings -> Pages`
2. Source를 `GitHub Actions`로 설정
3. Actions 권한이 활성화되어 있는지 확인

## Base Path 주의사항

일반 repository pages는 다음 URL 구조를 사용합니다.

```text
https://{github_user}.github.io/{repository_name}/
```

이 저장소는 repository 이름을 `present-anything`으로 가정하고 Slidev build에 다음 base path를 사용합니다.

```text
/present-anything/semgrep-android-local/
/present-anything/windows-audit/
```

root pages 저장소인 `{github_user}.github.io`를 사용하는 경우에는 base path를 `/` 기준으로 다시 조정해야 합니다.

## 프로젝트 구조

```text
decks/
  semgrep-android-local/
    slides.md
    assets/
  windows-audit/
    slides.md
    assets/
scripts/
  build-index.js
public/
  images/
.github/
  workflows/
    deploy.yml
```

## 검증

다음 명령으로 로컬에서 정적 결과를 확인할 수 있습니다.

```bash
npm run build
npx serve dist
```

또는

```bash
python3 -m http.server 8080 -d dist
```
