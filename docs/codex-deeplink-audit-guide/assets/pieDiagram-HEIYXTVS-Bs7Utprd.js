import{p as q}from"./chunk-WASTHULE-C6tytASY.js";import{p as H}from"./wardley-RL74JXVD-T2LBEBUU-2bHatX4_.js";import{g as J,s as K,b as Y,c as tt,y as et,x as at,d as s,l as w,e as it,L as rt,aQ as st,aR as ot,aS as F,aT as nt,h as lt,D as ct,aU as dt,M as pt}from"./section-BN29OHEJ.js";import"./chunk-MFRUYFWM-CxUc8TNw.js";import"./index-EE4ZtL8_.js";import"./modules/vue-0DkHb0vD.js";import"./modules/shiki-BdEeu8M_.js";import"./modules/file-saver-B7oFTzqn.js";import"./slidev/context-bG3FKiCY.js";var gt=pt.pie,D={sections:new Map,showData:!1},u=D.sections,C=D.showData,ht=structuredClone(gt),ut=s(()=>structuredClone(ht),"getConfig"),ft=s(()=>{u=new Map,C=D.showData,ct()},"clear"),mt=s(({label:t,value:a})=>{if(a<0)throw new Error(`"${t}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);u.has(t)||(u.set(t,a),w.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),vt=s(()=>u,"getSections"),xt=s(t=>{C=t},"setShowData"),St=s(()=>C,"getShowData"),L={getConfig:ut,clear:ft,setDiagramTitle:at,getDiagramTitle:et,setAccTitle:tt,getAccTitle:Y,setAccDescription:K,getAccDescription:J,addSection:mt,getSections:vt,setShowData:xt,getShowData:St},wt=s((t,a)=>{q(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),Dt={parse:s(async t=>{const a=await H("pie",t);w.debug(a),wt(a,L)},"parse")},Ct=s(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),yt=Ct,$t=s(t=>{const a=[...t.values()].reduce((r,n)=>r+n,0),y=[...t.entries()].map(([r,n])=>({label:r,value:n})).filter(r=>r.value/a*100>=1);return dt().value(r=>r.value).sort(null)(y)},"createPieArcs"),Tt=s((t,a,y,$)=>{w.debug(`rendering pie chart
`+t);const r=$.db,n=it(),T=rt(r.getConfig(),n.pie),A=40,o=18,p=4,c=450,d=c,f=st(a),l=f.append("g");l.attr("transform","translate("+d/2+","+c/2+")");const{themeVariables:i}=n;let[_]=ot(i.pieOuterStrokeWidth);_??=2;const b=T.textPosition,g=Math.min(d,c)/2-A,G=F().innerRadius(0).outerRadius(g),B=F().innerRadius(g*b).outerRadius(g*b);l.append("circle").attr("cx",0).attr("cy",0).attr("r",g+_/2).attr("class","pieOuterCircle");const h=r.getSections(),O=$t(h),P=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let m=0;h.forEach(e=>{m+=e});const E=O.filter(e=>(e.data.value/m*100).toFixed(0)!=="0"),v=nt(P).domain([...h.keys()]);l.selectAll("mySlices").data(E).enter().append("path").attr("d",G).attr("fill",e=>v(e.data.label)).attr("class","pieCircle"),l.selectAll("mySlices").data(E).enter().append("text").text(e=>(e.data.value/m*100).toFixed(0)+"%").attr("transform",e=>"translate("+B.centroid(e)+")").style("text-anchor","middle").attr("class","slice");const I=l.append("text").text(r.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),k=[...h.entries()].map(([e,S])=>({label:e,value:S})),x=l.selectAll(".legend").data(k).enter().append("g").attr("class","legend").attr("transform",(e,S)=>{const z=o+p,X=z*k.length/2,Z=12*o,j=S*z-X;return"translate("+Z+","+j+")"});x.append("rect").attr("width",o).attr("height",o).style("fill",e=>v(e.label)).style("stroke",e=>v(e.label)),x.append("text").attr("x",o+p).attr("y",o-p).text(e=>r.getShowData()?`${e.label} [${e.value}]`:e.label);const N=Math.max(...x.selectAll("text").nodes().map(e=>e?.getBoundingClientRect().width??0)),U=d+A+o+p+N,R=I.node()?.getBoundingClientRect().width??0,Q=d/2-R/2,V=d/2+R/2,M=Math.min(0,Q),W=Math.max(U,V)-M;f.attr("viewBox",`${M} 0 ${W} ${c}`),lt(f,c,W,T.useMaxWidth)},"draw"),At={draw:Tt},Gt={parser:Dt,db:L,renderer:At,styles:yt};export{Gt as diagram};
