import{_ as r}from"./slidev/CodeBlockWrapper.vue_vue_type_script_setup_true_lang-BhVTcVHD.js";import{o,b as c,w as e,g as s,d as u,m as d,ad as a,v as m,x as f,T as l}from"./modules/vue-Dc0l4PFH.js";import{I as g}from"./slidev/default-DVEGoZAR.js";import{u as k,f as _}from"./slidev/context-Czn7_ihK.js";import"./modules/unplugin-icons-BCtJsVwl.js";import"./index-C0l5YczL.js";import"./modules/shiki-BSw8WxP7.js";const B={__name:"slides.md__slidev_20",setup(h){const{$clicksContext:t,$frontmatter:i}=k();return t.setup(),(v,n)=>{const p=r;return o(),c(g,m(f(l(_)(l(i),19))),{default:e(()=>[n[1]||(n[1]=s("h1",null,"예시 2: AI 검토 입력 템플릿",-1)),u(p,d({},{title:"",ranges:[]}),{default:e(()=>[...n[0]||(n[0]=[s("pre",{class:"shiki shiki-themes vitesse-dark vitesse-light slidev-code",style:{"--shiki-dark":"#dbd7caee","--shiki-light":"#393a34","--shiki-dark-bg":"#121212","--shiki-light-bg":"#ffffff"}},[s("code",{class:"language-text"},[s("span",{class:"line"},[s("span",null,"다음 Semgrep finding이 실제 취약점인지, 오탐인지 Java 코드리뷰 관점에서 판별해줘.")]),a(`
`),s("span",{class:"line"},[s("span")]),a(`
`),s("span",{class:"line"},[s("span",null,"- check_id: java-android-weak-hash-md5-sha1")]),a(`
`),s("span",{class:"line"},[s("span",null,"- file: app/src/main/java/com/example/LegacyCrypto.java:8")]),a(`
`),s("span",{class:"line"},[s("span",null,"- rule_intent: 약한 해시 / 서명 알고리즘 1차 수집")]),a(`
`),s("span",{class:"line"},[s("span",null,"- code:")]),a(`
`),s("span",{class:"line"},[s("span",null,'  byte[] actual = MessageDigest.getInstance("SHA-1").digest(manifest);')]),a(`
`),s("span",{class:"line"},[s("span",null,"  return Arrays.equals(actual, expectedDigest);")]),a(`
`),s("span",{class:"line"},[s("span")]),a(`
`),s("span",{class:"line"},[s("span",null,"추가 요청:")]),a(`
`),s("span",{class:"line"},[s("span",null,"1. 실제 취약점 / 오탐 / 추가 확인 필요 중 하나로 분류")]),a(`
`),s("span",{class:"line"},[s("span",null,"2. 그렇게 판단한 근거 3개")]),a(`
`),s("span",{class:"line"},[s("span",null,"3. 이 값이 trust decision, UI 표시, 호환성 경로 중 어디에 쓰이는지 더 확인할 함수 / call path")]),a(`
`),s("span",{class:"line"},[s("span",null,"4. SHA-256 이상 대체 방향과 규칙 튜닝 아이디어 1개")])])],-1)])]),_:1},16),n[2]||(n[2]=s("ul",null,[s("li",null,'sample 2에서는 "약한 알고리즘을 썼다"보다 "그 결과가 실제 보안 판단에 쓰이는가"를 먼저 가려내는 것이 중요합니다.'),s("li",null,[s("code",null,"check_id"),a(", 호출 코드, 주변 함수, helper 이름까지 함께 주는 것이 중요합니다.")])],-1))]),_:1},16)}}};export{B as default};
