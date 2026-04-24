import{_ as o}from"./slidev/CodeBlockWrapper.vue_vue_type_script_setup_true_lang-CmppNrb-.js";import{o as r,b as c,w as e,g as n,d as u,m as d,ad as s,v as m,x as g,T as a}from"./modules/vue-Dc0l4PFH.js";import{I as f}from"./slidev/default-DHLH9_nG.js";import{u as _,f as k}from"./slidev/context-DgJ8Ga0Z.js";import"./modules/unplugin-icons-BCtJsVwl.js";import"./index-BCvrHjQh.js";import"./modules/shiki-BSw8WxP7.js";const v={__name:"slides.md__slidev_12",setup(I){const{$clicksContext:t,$frontmatter:i}=_();return t.setup(),(x,l)=>{const p=o;return r(),c(f,m(g(a(k)(a(i),11))),{default:e(()=>[l[1]||(l[1]=n("h1",null,"예시 1: AI 검토 입력 템플릿",-1)),u(p,d({},{title:"",ranges:[]}),{default:e(()=>[...l[0]||(l[0]=[n("pre",{class:"shiki shiki-themes vitesse-dark vitesse-light slidev-code",style:{"--shiki-dark":"#dbd7caee","--shiki-light":"#393a34","--shiki-dark-bg":"#121212","--shiki-light-bg":"#ffffff"}},[n("code",{class:"language-text"},[n("span",{class:"line"},[n("span",null,"다음 Semgrep finding이 실제 취약점인지, 오탐인지 Android 코드리뷰 관점에서 판별해줘.")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"- check_id: android-pendingintent-flag-mutable")]),s(`
`),n("span",{class:"line"},[n("span",null,"- file: app/src/main/kotlin/com/example/PendingIntentLab.kt:12")]),s(`
`),n("span",{class:"line"},[n("span",null,"- rule_intent: mutable PendingIntent 1차 수집")]),s(`
`),n("span",{class:"line"},[n("span",null,"- code:")]),s(`
`),n("span",{class:"line"},[n("span",null,"  return PendingIntent.getBroadcast(")]),s(`
`),n("span",{class:"line"},[n("span",null,"      context,")]),s(`
`),n("span",{class:"line"},[n("span",null,"      0,")]),s(`
`),n("span",{class:"line"},[n("span",null,"      deleteIntent,")]),s(`
`),n("span",{class:"line"},[n("span",null,"      PendingIntent.FLAG_MUTABLE or PendingIntent.FLAG_UPDATE_CURRENT")]),s(`
`),n("span",{class:"line"},[n("span",null,"  )")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"추가 요청:")]),s(`
`),n("span",{class:"line"},[n("span",null,"1. 실제 취약점 / 오탐 / 추가 확인 필요 중 하나로 분류")]),s(`
`),n("span",{class:"line"},[n("span",null,"2. 그렇게 판단한 근거 3개")]),s(`
`),n("span",{class:"line"},[n("span",null,"3. explicit 여부, requestCode, URI grant, 민감 action 관점에서 더 확인할 call path")]),s(`
`),n("span",{class:"line"},[n("span",null,"4. 규칙 튜닝 포인트 1개와 코드리뷰 코멘트 3줄")])])],-1)])]),_:1},16),l[2]||(l[2]=n("ul",null,[n("li",null,[s("sample 1에서는 "),n("code",null,"FLAG_MUTABLE"),s(" 자체보다 implicit "),n("code",null,"Intent"),s(", "),n("code",null,"URI grant"),s(", 민감 action이 함께 붙는지까지 봐야 합니다.")]),n("li",null,'AI에게는 "실제로 mutable이 필요한 use case인가"를 먼저 묻게 하는 편이 분류 효율이 좋습니다.')],-1))]),_:1},16)}}};export{v as default};
