import{_ as o}from"./slidev/CodeBlockWrapper.vue_vue_type_script_setup_true_lang-DjRo8Lq2.js";import{o as r,b as d,w as e,g as n,d as c,m as u,D as s,v as m,x as f,z as a}from"./modules/vue-0DkHb0vD.js";import{I as g}from"./slidev/default-C7AKY3_e.js";import{u as _,f as k}from"./slidev/context-BxkFTFNW.js";import"./modules/unplugin-icons-CrxfDbIS.js";import"./index-Dc6gmonC.js";import"./modules/shiki-BdEeu8M_.js";const N={__name:"slides.md__slidev_11",setup(I){const{$clicksContext:i,$frontmatter:t}=_();return i.setup(),(x,l)=>{const p=o;return r(),d(g,m(f(a(k)(a(t),10))),{default:e(()=>[l[1]||(l[1]=n("h1",null,"Semgrep 검출 이후 AI 입력 예시",-1)),c(p,u({},{title:"",ranges:[]}),{default:e(()=>[...l[0]||(l[0]=[n("pre",{class:"shiki shiki-themes vitesse-dark vitesse-light slidev-code",style:{"--shiki-dark":"#dbd7caee","--shiki-light":"#393a34","--shiki-dark-bg":"#121212","--shiki-light-bg":"#ffffff"}},[n("code",{class:"language-text"},[n("span",{class:"line"},[n("span",null,"다음 Semgrep finding을 Android 보안 코드리뷰 관점에서 분석해줘.")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"- check_id: android-pendingintent-implicit")]),s(`
`),n("span",{class:"line"},[n("span",null,"- file: app/src/main/kotlin/com/example/PendingIntentLab.kt:6")]),s(`
`),n("span",{class:"line"},[n("span",null,"- code:")]),s(`
`),n("span",{class:"line"},[n("span",null,'  val detailIntent = Intent("com.example.ACTION_VIEW_DETAIL")')]),s(`
`),n("span",{class:"line"},[n("span",null,"  val detailPi = PendingIntent.getActivity(")]),s(`
`),n("span",{class:"line"},[n("span",null,"      context, 100, detailIntent, PendingIntent.FLAG_UPDATE_CURRENT")]),s(`
`),n("span",{class:"line"},[n("span",null,"  )")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"요구사항:")]),s(`
`),n("span",{class:"line"},[n("span",null,"1. 위험도 상/중/하")]),s(`
`),n("span",{class:"line"},[n("span",null,"2. exploit 전제조건")]),s(`
`),n("span",{class:"line"},[n("span",null,"3. Android 12+ 호환성 이슈")]),s(`
`),n("span",{class:"line"},[n("span",null,"4. 바로 적용 가능한 수정 코드")]),s(`
`),n("span",{class:"line"},[n("span",null,"5. 코드리뷰 코멘트 3줄")])])],-1)])]),_:1},16),l[2]||(l[2]=n("ul",null,[n("li",null,"AI는 finding 설명기 + fix 초안 생성기로 쓰는 것이 안정적"),n("li",null,"원본 finding, 코드 조각, API 레벨, 앱 컨텍스트를 같이 줘야 품질이 올라감")],-1))]),_:1},16)}}};export{N as default};
