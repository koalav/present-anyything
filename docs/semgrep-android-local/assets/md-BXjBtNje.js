import{_ as o}from"./slidev/CodeBlockWrapper.vue_vue_type_script_setup_true_lang-BkEw8VOj.js";import{o as r,b as c,w as e,g as n,d as m,m as d,ad as s,v as u,x as f,T as l}from"./modules/vue-Dc0l4PFH.js";import{I as g}from"./slidev/default-CXp0Cpve.js";import{u as k,f as _}from"./slidev/context-Cm6NTcnz.js";import"./modules/unplugin-icons-BCtJsVwl.js";import"./index-Cg30V1_K.js";import"./modules/shiki-BSw8WxP7.js";const $={__name:"slides.md__slidev_7",setup(x){const{$clicksContext:t,$frontmatter:i}=k();return t.setup(),(P,a)=>{const p=o;return r(),c(g,u(f(l(_)(l(i),6))),{default:e(()=>[a[1]||(a[1]=n("h1",null,"Sample 1: Semgrep output",-1)),m(p,d({},{title:"",ranges:[]}),{default:e(()=>[...a[0]||(a[0]=[n("pre",{class:"shiki shiki-themes vitesse-dark vitesse-light slidev-code",style:{"--shiki-dark":"#dbd7caee","--shiki-light":"#393a34","--shiki-dark-bg":"#121212","--shiki-light-bg":"#ffffff"}},[n("code",{class:"language-text"},[n("span",{class:"line"},[n("span",null,"$ semgrep scan --metrics=off \\")]),s(`
`),n("span",{class:"line"},[n("span",null,"    --config rules/android-local.yml \\")]),s(`
`),n("span",{class:"line"},[n("span",null,"    app/src/main/kotlin/com/example/PendingIntentLab.kt")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"┌────────────────┐")]),s(`
`),n("span",{class:"line"},[n("span",null,"│ 1 Code Finding │")]),s(`
`),n("span",{class:"line"},[n("span",null,"└────────────────┘")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"    app/src/main/kotlin/com/example/PendingIntentLab.kt")]),s(`
`),n("span",{class:"line"},[n("span",null,"   ❯❯❱ android-pendingintent-implicit")]),s(`
`),n("span",{class:"line"},[n("span",null,"          암시적 Intent를 PendingIntent로 래핑하고 있습니다.")]),s(`
`),n("span",{class:"line"},[n("span",null,"          setComponent() 또는 setPackage()로 명시적 대상을 지정하십시오.")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"          9┆ return PendingIntent.getActivity(")])])],-1)])]),_:1},16),a[2]||(a[2]=n("ul",null,[n("li",null,'여기서는 분석자가 "실제 대상 component", "민감 action 여부", "명시적 intent로 바꿀 수 있는지"를 바로 확인하면 됩니다.')],-1))]),_:1},16)}}};export{$ as default};
