import{_ as c}from"./slidev/CodeBlockWrapper.vue_vue_type_script_setup_true_lang-DjRo8Lq2.js";import{o as r,b as o,w as e,g as n,d,m,D as s,v as u,x as g,z as l}from"./modules/vue-0DkHb0vD.js";import{I as f}from"./slidev/default-C7AKY3_e.js";import{u as k,f as v}from"./slidev/context-BxkFTFNW.js";import"./modules/unplugin-icons-CrxfDbIS.js";import"./index-Dc6gmonC.js";import"./modules/shiki-BdEeu8M_.js";const w={__name:"slides.md__slidev_9",setup(P){const{$clicksContext:i,$frontmatter:t}=k();return i.setup(),(_,a)=>{const p=c;return r(),o(f,u(g(l(v)(l(t),8))),{default:e(()=>[a[1]||(a[1]=n("h1",null,"예시 Output: 터미널",-1)),d(p,m({},{title:"",ranges:[]}),{default:e(()=>[...a[0]||(a[0]=[n("pre",{class:"shiki shiki-themes vitesse-dark vitesse-light slidev-code",style:{"--shiki-dark":"#dbd7caee","--shiki-light":"#393a34","--shiki-dark-bg":"#121212","--shiki-light-bg":"#ffffff"}},[n("code",{class:"language-text"},[n("span",{class:"line"},[n("span",null,"$ semgrep scan --metrics=off --config rules/android-local.yml app/src/main")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"app/src/main/kotlin/com/example/PendingIntentLab.kt")]),s(`
`),n("span",{class:"line"},[n("span",null,"  ❯❯❱ android-pendingintent-implicit")]),s(`
`),n("span",{class:"line"},[n("span",null,"        암시적 PendingIntent입니다. setComponent() 또는 setPackage()로")]),s(`
`),n("span",{class:"line"},[n("span",null,"        명시적 컴포넌트를 지정하고 FLAG_IMMUTABLE를 사용하십시오.")]),s(`
`),n("span",{class:"line"},[n("span",null,"       6┆ val detailPi = PendingIntent.getActivity(")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"  ❯❯❱ android-pendingintent-missing-immutable-flag")]),s(`
`),n("span",{class:"line"},[n("span",null,"       6┆ val detailPi = PendingIntent.getActivity(")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"  ❯❯❱ android-pendingintent-missing-oneshot")]),s(`
`),n("span",{class:"line"},[n("span",null,"       6┆ val detailPi = PendingIntent.getActivity(")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"  ❯❯❱ android-pendingintent-flag-mutable")]),s(`
`),n("span",{class:"line"},[n("span",null,"      10┆ val mutablePi = PendingIntent.getBroadcast(")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"  ❯❯❱ android-insecure-intent-forwarding")]),s(`
`),n("span",{class:"line"},[n("span",null,"      15┆ startActivity(forwarded)")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"app/src/main/java/com/example/LegacySecurity.java")]),s(`
`),n("span",{class:"line"},[n("span",null,"  ❯❯❱ android-dangerous-api-create-install-uninstall")]),s(`
`),n("span",{class:"line"},[n("span",null,'       5┆ pm.installPackage(packageUri, observer, 0, "com.example.app");')]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"  ❯❯❱ java-android-weak-hash-md1-sha1")]),s(`
`),n("span",{class:"line"},[n("span",null,'       6┆ MessageDigest.getInstance("SHA-1");')])])],-1)])]),_:1},16)]),_:1},16)}}};export{w as default};
