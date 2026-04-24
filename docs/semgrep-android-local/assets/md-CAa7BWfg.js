import{_ as o}from"./slidev/CodeBlockWrapper.vue_vue_type_script_setup_true_lang-BMaS3Aw2.js";import{o as r,b as u,w as e,g as n,d as c,m as d,ad as s,v as m,x as g,T as a}from"./modules/vue-Dc0l4PFH.js";import{I as f}from"./slidev/default-Bp4UJxqD.js";import{u as k,f as x}from"./slidev/context-ClTn1lSv.js";import"./modules/unplugin-icons-BCtJsVwl.js";import"./index-BYA1OFPt.js";import"./modules/shiki-BSw8WxP7.js";const T={__name:"slides.md__slidev_11",setup(_){const{$clicksContext:t,$frontmatter:i}=k();return t.setup(),(b,l)=>{const p=o;return r(),u(f,m(g(a(x)(a(i),10))),{default:e(()=>[l[1]||(l[1]=n("h1",null,"Sample 1: Semgrep output",-1)),c(p,d({},{title:"",ranges:[]}),{default:e(()=>[...l[0]||(l[0]=[n("pre",{class:"shiki shiki-themes vitesse-dark vitesse-light slidev-code",style:{"--shiki-dark":"#dbd7caee","--shiki-light":"#393a34","--shiki-dark-bg":"#121212","--shiki-light-bg":"#ffffff"}},[n("code",{class:"language-text"},[n("span",{class:"line"},[n("span",null,"$ semgrep scan --metrics=off \\")]),s(`
`),n("span",{class:"line"},[n("span",null,"    --config rules/android-local.yml \\")]),s(`
`),n("span",{class:"line"},[n("span",null,"    app/src/main/kotlin/com/example/PendingIntentLab.kt")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"┌────────────────┐")]),s(`
`),n("span",{class:"line"},[n("span",null,"│ 1 Code Finding │")]),s(`
`),n("span",{class:"line"},[n("span",null,"└────────────────┘")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"    app/src/main/kotlin/com/example/PendingIntentLab.kt")]),s(`
`),n("span",{class:"line"},[n("span",null,"   ❯❯❱ android-pendingintent-flag-mutable")]),s(`
`),n("span",{class:"line"},[n("span",null,"          Mutable PendingIntent입니다.")]),s(`
`),n("span",{class:"line"},[n("span",null,"          대부분은 FLAG_IMMUTABLE을 사용해야 하며, mutable이 꼭 필요하면")]),s(`
`),n("span",{class:"line"},[n("span",null,"          explicit component/package, unique requestCode, 최소 extras를 함께 검토하십시오.")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"         12┆ return PendingIntent.getBroadcast(")])])],-1)])]),_:1},16),l[2]||(l[2]=n("ul",null,[n("li",null,[s("여기서 바로 보는 질문: "),n("ul",null,[n("li",null,"이 mutable이 정말 필요한가"),n("li",null,[n("code",null,"Intent"),s("가 explicit인가")]),n("li",null,[n("code",null,"requestCode"),s(", "),n("code",null,"URI grant"),s(", "),n("code",null,"민감 action"),s("이 같이 붙어 있는가")])])])],-1))]),_:1},16)}}};export{T as default};
