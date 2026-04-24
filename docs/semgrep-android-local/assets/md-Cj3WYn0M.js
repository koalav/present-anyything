import{_ as r}from"./slidev/CodeBlockWrapper.vue_vue_type_script_setup_true_lang-BkEw8VOj.js";import{o,b as c,w as l,g as n,d,m as u,ad as s,v as m,x as f,T as a}from"./modules/vue-Dc0l4PFH.js";import{I as g}from"./slidev/default-CXp0Cpve.js";import{u as k,f as _}from"./slidev/context-Cm6NTcnz.js";import"./modules/unplugin-icons-BCtJsVwl.js";import"./index-Cg30V1_K.js";import"./modules/shiki-BSw8WxP7.js";const L={__name:"slides.md__slidev_14",setup(h){const{$clicksContext:i,$frontmatter:t}=k();return i.setup(),(x,e)=>{const p=r;return o(),c(g,m(f(a(_)(a(t),13))),{default:l(()=>[e[1]||(e[1]=n("h1",null,"AI 입력 템플릿",-1)),d(p,u({},{title:"",ranges:[]}),{default:l(()=>[...e[0]||(e[0]=[n("pre",{class:"shiki shiki-themes vitesse-dark vitesse-light slidev-code",style:{"--shiki-dark":"#dbd7caee","--shiki-light":"#393a34","--shiki-dark-bg":"#121212","--shiki-light-bg":"#ffffff"}},[n("code",{class:"language-text"},[n("span",{class:"line"},[n("span",null,"다음 Semgrep finding이 실제 취약점인지, false positive인지 Android 코드리뷰 관점에서 판별해줘.")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"- check_id: android-pendingintent-implicit")]),s(`
`),n("span",{class:"line"},[n("span",null,"- file: app/src/main/kotlin/com/example/PendingIntentLab.kt:9")]),s(`
`),n("span",{class:"line"},[n("span",null,"- rule_intent: implicit PendingIntent 탐지")]),s(`
`),n("span",{class:"line"},[n("span",null,"- code:")]),s(`
`),n("span",{class:"line"},[n("span",null,"  return PendingIntent.getActivity(")]),s(`
`),n("span",{class:"line"},[n("span",null,"      context, 4412, explicitIntent, PendingIntent.FLAG_IMMUTABLE")]),s(`
`),n("span",{class:"line"},[n("span",null,"  )")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"추가 요청:")]),s(`
`),n("span",{class:"line"},[n("span",null,"1. true positive / false positive / 추가 확인 필요 중 하나로 분류")]),s(`
`),n("span",{class:"line"},[n("span",null,"2. 그렇게 판단한 근거 3개")]),s(`
`),n("span",{class:"line"},[n("span",null,"3. 더 열어봐야 할 helper / call path")]),s(`
`),n("span",{class:"line"},[n("span",null,"4. 코드리뷰 코멘트 3줄")]),s(`
`),n("span",{class:"line"},[n("span",null,"5. 규칙 튜닝 아이디어 1개")])])],-1)])]),_:1},16),e[2]||(e[2]=n("ul",null,[n("li",null,'AI는 "설명 생성기"보다 "근거 기반 triage 보조"로 쓰는 편이 더 안정적입니다.'),n("li",null,[n("code",null,"check_id"),s(", 호출 코드, 주변 함수, helper 이름까지 함께 주는 것이 중요합니다.")])],-1))]),_:1},16)}}};export{L as default};
