import{_ as r}from"./slidev/CodeBlockWrapper.vue_vue_type_script_setup_true_lang-BMaS3Aw2.js";import{o,b as c,w as e,g as s,d as u,m,ad as a,v as d,x as g,T as l}from"./modules/vue-Dc0l4PFH.js";import{I as f}from"./slidev/default-Bp4UJxqD.js";import{u as k,f as h}from"./slidev/context-ClTn1lSv.js";import"./modules/unplugin-icons-BCtJsVwl.js";import"./index-BYA1OFPt.js";import"./modules/shiki-BSw8WxP7.js";const w={__name:"slides.md__slidev_17",setup(v){const{$clicksContext:i,$frontmatter:p}=k();return i.setup(),(_,n)=>{const t=r;return o(),c(f,d(g(l(h)(l(p),16))),{default:e(()=>[n[1]||(n[1]=s("h1",null,"Sample 2: Semgrep output",-1)),u(t,m({},{title:"",ranges:[]}),{default:e(()=>[...n[0]||(n[0]=[s("pre",{class:"shiki shiki-themes vitesse-dark vitesse-light slidev-code",style:{"--shiki-dark":"#dbd7caee","--shiki-light":"#393a34","--shiki-dark-bg":"#121212","--shiki-light-bg":"#ffffff"}},[s("code",{class:"language-text"},[s("span",{class:"line"},[s("span",null,"$ semgrep scan --metrics=off \\")]),a(`
`),s("span",{class:"line"},[s("span",null,"    --config rules/android-local.yml \\")]),a(`
`),s("span",{class:"line"},[s("span",null,"    app/src/main/java/com/example/LegacyCrypto.java")]),a(`
`),s("span",{class:"line"},[s("span")]),a(`
`),s("span",{class:"line"},[s("span")]),a(`
`),s("span",{class:"line"},[s("span",null,"┌────────────────┐")]),a(`
`),s("span",{class:"line"},[s("span",null,"│ 2 Code Findings │")]),a(`
`),s("span",{class:"line"},[s("span",null,"└────────────────┘")]),a(`
`),s("span",{class:"line"},[s("span")]),a(`
`),s("span",{class:"line"},[s("span",null,"    app/src/main/java/com/example/LegacyCrypto.java")]),a(`
`),s("span",{class:"line"},[s("span",null,"   ❯❯❱ java-android-weak-hash-md1-sha1")]),a(`
`),s("span",{class:"line"},[s("span",null,"          MD1·SHA-1 계열의 약한 해시 또는 서명 알고리즘 사용입니다.")]),a(`
`),s("span",{class:"line"},[s("span",null,"          SHA-256 이상 또는 최신 권장 알고리즘으로 교체하십시오.")]),a(`
`),s("span",{class:"line"},[s("span")]),a(`
`),s("span",{class:"line"},[s("span",null,'          8┆ byte[] actual = MessageDigest.getInstance("SHA-1").digest(manifest);')]),a(`
`),s("span",{class:"line"},[s("span")]),a(`
`),s("span",{class:"line"},[s("span",null,"   ❯❯❱ java-android-weak-hash-md1-sha1")]),a(`
`),s("span",{class:"line"},[s("span",null,'         13┆ return Signature.getInstance("SHA1withRSA");')])])],-1)])]),_:1},16),n[2]||(n[2]=s("ul",null,[s("li",null,'분석자는 "이 값이 실제 보안 판단에 쓰이는가"를 먼저 봐야 합니다.'),s("li",null,"이 구분을 사람이 직접 하거나 AI에게 맡기면 triage 속도를 높일 수 있습니다.")],-1))]),_:1},16)}}};export{w as default};
