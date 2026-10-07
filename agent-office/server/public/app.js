var Jm=Object.defineProperty;var Rc=(n,t)=>{for(var e in t)Jm(n,e,{get:t[e],enumerable:!0})};var ps=[{id:"/work/payments-api",name:"acme/payments-api",remote:"git@github.com:acme/payments-api.git"},{id:"/work/web-dashboard",name:"acme/web-dashboard",remote:"git@github.com:acme/web-dashboard.git"}],jm=["Harden the session handling","Add retries to the webhook worker","Why is the build flaky?","Write tests for the refund flow","Migrate charts to the new tokens","Review the open PR"],Qm=[["Read","src/auth/session.ts"],["Grep","timingSafeEqual"],["Glob","**/*.test.ts"],["Bash","npm test -- --watch=false"],["Edit","src/auth/session.ts"],["Write","docs/ARCHITECTURE.md"],["WebFetch","https://nodejs.org/api/crypto.html"],["Bash","git diff --stat"],["mcp__github__list_pull_requests","open PRs"]],tg=["Done. The retry wrapper is in, with tests. Should it also back off on 429s?","Found it: the build reads a stale cache key. I fixed it locally; want me to open a PR?","I added six tests for refunds. Partial refunds aren\u2019t covered yet. Shall I add them?","The chart tokens are migrated. Two charts still hard-code colors; fix those too?","Review done: one race in session.ts and two nits. I left them as comments."],sd={"Now add tests for it":["Find the untested paths","Write the tests","Run the suite"],"Open a PR with that":["Write the PR description","Push the branch","Open the PR"],"Screenshot it in dark mode too":["Switch to dark mode","Screenshot every chart","Compare with light"]},eg=["Also check the error path","Keep it to the auth module","Skip the snapshots","Note anything flaky"],ng=[["Explore","Map the auth module"],["Plan","Design token rotation"],["general-purpose","Write regression tests"],["code-reviewer","Review session.ts"]],fs=2e5,rd=[["System prompt",3100],["System tools",17800],["MCP tools",9400],["Custom agents",1200],["Memory files",2600],["Skills",1900]],ig={"Harden the session handling":["Map how sessions are issued","Compare tokens with timingSafeEqual","Rotate the token on login","Add regression tests","Run the suite"],"Add retries to the webhook worker":["Find where deliveries fail","Wrap sends in a retry helper","Back off between tries","Test the retry path"],"Why is the build flaky?":["Reproduce the failure","Bisect the cache keys","Fix the stale key","Rerun CI three times"],"Write tests for the refund flow":["List the refund cases","Write full-refund tests","Write partial-refund tests","Run the suite"],"Migrate charts to the new tokens":["Inventory hard-coded colors","Swap to the new tokens","Screenshot every chart","Check dark mode"],"Review the open PR":["Read the diff","Run it locally","Write up findings"]},sg=[{header:"Backoff",question:"Should retries also back off on 429s?",multiSelect:!1,options:[{label:"Exponential",description:"Waits 1s, 2s, 4s\u2026 up to 30s. Recommended."},{label:"Fixed delay",description:"Simpler: 5s between tries."},{label:"Only 5xx",description:"Leave 429s alone."}]},{header:"Chart style",question:"Which look should the revenue chart take?",multiSelect:!1,options:[{label:"Bars",description:"Monthly bars, easy to compare.",preview:"bars"},{label:"Area",description:"A smooth trend line, filled.",preview:"area"},{label:"Both",description:"Bars with the trend over them.",preview:"combo"}]},{header:"Scope",question:"Open a PR now, or keep going on partial refunds first?",multiSelect:!1,options:[{label:"Open the PR",description:"Ship what passes; partial refunds next."},{label:"Keep going",description:"One PR with everything."}]}],rg=[["Bash","npm publish --dry-run"],["Bash","git push origin fix/stale-cache"],["mcp__github__create_pull_request","acme/payments-api"]],og=`# Rotate session tokens

1. Issue a fresh token on every login and privilege change
2. Keep the old one valid for 30s so in-flight requests finish
3. Compare tokens with timingSafeEqual
4. Add tests for reuse and expiry

Touches src/auth/session.ts and src/auth/login.ts.`,ag=["src/auth/session.ts","src/webhooks/worker.ts","src/refunds/refund.test.ts","src/charts/tokens.ts","ci/cache.yml","docs/ARCHITECTURE.md"],lg=[["dashboard","Dashboard with the new tokens"],["chart","Revenue chart, dark mode"],["diagram","How a session token flows"],["tests","Test run: 42 passed"]],cg=[["pr","Retry webhook sends with backoff","https://github.com/acme/payments-api/pull/"],["artifact","Flaky build: what broke and why","https://claude.ai/artifact/demo-"],["pr","Fix the stale CI cache key","https://github.com/acme/web-dashboard/pull/"],["artifact","Refund flow test report","https://claude.ai/artifact/demo-"]];function od(n,t=18){let e=`hsl(${t} 62% 58%)`,i=Array.from({length:7},(r,o)=>{let a=30+(o*37+t)%70;return`<rect x="${30+o*36}" y="${150-a}" width="22" height="${a}" rx="3" fill="${o===5?e:"#cfc6b8"}"/>`}).join(""),s={dashboard:`<rect width="320" height="200" fill="#f6f2ea"/><rect width="320" height="22" fill="#2b2a2e"/><circle cx="12" cy="11" r="4" fill="#e66"/><circle cx="24" cy="11" r="4" fill="#eb4"/><circle cx="36" cy="11" r="4" fill="#5b5"/><rect x="12" y="34" width="90" height="154" rx="6" fill="#fff"/><rect x="22" y="46" width="60" height="7" rx="3" fill="${e}"/><rect x="22" y="62" width="50" height="6" rx="3" fill="#ddd"/><rect x="22" y="76" width="66" height="6" rx="3" fill="#ddd"/><rect x="112" y="34" width="196" height="70" rx="6" fill="#fff"/><path d="M122 92 L160 70 L196 80 L232 52 L270 62 L298 44" stroke="${e}" stroke-width="4" fill="none"/><rect x="112" y="114" width="94" height="74" rx="6" fill="#fff"/><rect x="214" y="114" width="94" height="74" rx="6" fill="${e}" opacity=".85"/><text x="226" y="160" font-family="sans-serif" font-size="22" font-weight="700" fill="#fff">$48k</text>`,chart:`<rect width="320" height="200" fill="#1f2433"/><text x="20" y="28" font-family="sans-serif" font-size="13" fill="#e8e2d6">Revenue by month</text>${i.replaceAll("#cfc6b8","#3c4560")}<path d="M40 120 L76 104 L112 110 L148 80 L184 86 L220 52 L256 64" stroke="#f2c14e" stroke-width="3" fill="none"/>`,diagram:`<rect width="320" height="200" fill="#fbf8f2"/><g font-family="sans-serif" font-size="11" fill="#2b2a2e"><rect x="16" y="78" width="74" height="40" rx="8" fill="#fff" stroke="${e}" stroke-width="2"/><text x="32" y="102">Login</text><rect x="124" y="30" width="74" height="40" rx="8" fill="#fff" stroke="#2b2a2e"/><text x="138" y="54">Issue</text><rect x="124" y="126" width="74" height="40" rx="8" fill="#fff" stroke="#2b2a2e"/><text x="134" y="150">Rotate</text><rect x="232" y="78" width="74" height="40" rx="8" fill="${e}"/><text x="246" y="102" fill="#fff">Verify</text></g><path d="M90 92 L124 54 M90 104 L124 140 M198 50 L232 90 M198 146 L232 106" stroke="#8a8378" stroke-width="2"/>`,tests:`<rect width="320" height="200" fill="#16181d"/><g font-family="monospace" font-size="11">${Array.from({length:9},(r,o)=>`<text x="16" y="${30+o*17}" fill="${o===8?"#a7e3a1":"#9aa3b5"}">${o===8?"\u2713 42 passed, 0 failed (3.1s)":`\u2713 refund ${["full","partial","twice","expired","currency","zero","webhook","audit"][o]} case`}</text>`).join("")}</g>`,bars:`<rect width="320" height="200" fill="#fbf8f2"/>${i}`,area:`<rect width="320" height="200" fill="#fbf8f2"/><path d="M30 150 L30 110 L80 96 L130 104 L180 70 L230 78 L290 46 L290 150 Z" fill="${e}" opacity=".35"/><path d="M30 110 L80 96 L130 104 L180 70 L230 78 L290 46" stroke="${e}" stroke-width="4" fill="none"/>`,combo:`<rect width="320" height="200" fill="#fbf8f2"/>${i}<path d="M41 120 L77 104 L113 110 L149 80 L185 86 L221 52 L257 64" stroke="#2b2a2e" stroke-width="3" fill="none"/>`}[n];return`data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">${s}</svg>`)}`}var Cc=new Map;function Ic(n,t,e){let i=Cc.get(`${n}|${t}`);return i?(Cc.delete(`${n}|${t}`),i(e),!0):!1}var Bn=n=>n[Math.floor(Math.random()*n.length)],ad=n=>new Promise(t=>setTimeout(t,n)),Re=(n,t)=>n+Math.floor(Math.random()*(t-n));function ld(n){let t=0;function e(i,s,r,o=!1,a=Bn(jm)){let l=T=>n([{t:Date.now(),session:i,...T}]),c=Re(8e3,4e4),h=0,u=0,d=rd.reduce((T,[,E])=>T+E,0),p=()=>d+c;function g(){let T=p();u+=T/1e6*3*.15+.01,l({kind:"context.measure",context:{tokens:T,window:fs,percent:Math.round(T/fs*100)},costUsd:Number(u.toFixed(4)),rateLimits:[{kind:"five_hour",percentUsed:Math.min(99,Math.round(u*4))}]}),l({kind:"agent.context",tokens:T})}function _(){l({kind:"context.breakdown",window:fs,used:p(),categories:[...rd.map(([E,A])=>({name:E,tokens:A,kind:"used"})),{name:"Messages",tokens:c,kind:"used"},{name:"Autocompact buffer",tokens:33e3,kind:"buffer"},{name:"Free space",tokens:Math.max(0,fs-p()-33e3),kind:"free"}]})}async function m(T){let[E,A]=Bn(Qm),P=`demo-tool-${++t}`;l({kind:"tool.start",agent:T,id:P,tool:E,summary:A}),await ad(Re(400,3e3)*r),l({kind:"tool.end",agent:T,id:P,tool:E,ok:Math.random()>.12})}async function f(T,E){let[A,P]=Bn(ng),v=`demo-agent-${++t}`;l({kind:"agent.spawn",agent:v,parent:T,type:A,description:P,model:"claude-haiku-4-5",background:Math.random()>.5});let x=Re(9e3,2e4),C=Re(3,9),D=[];for(let k=0;k<C;k++)E<2&&Math.random()<(E?.08:.2)&&D.push(f(v,E+1)),k===1&&Math.random()<.4&&l({kind:"agent.message",from:T,to:v,via:"model",text:Bn(eg)}),await m(v),x+=Re(4e3,26e3),l({kind:"agent.context",agent:v,tokens:x,window:fs,model:"claude-haiku-4-5"});await Promise.all(D),l({kind:"turn.complete",agent:v,reason:"answer",answer:`${P}: done.`}),l({kind:"agent.end",agent:v,status:"completed"})}async function S(T,E){let A=`demo-ask-${++t}`;l({kind:"ask.open",id:A,...T});let P=await new Promise(v=>{Cc.set(`${i}|${A}`,v),setTimeout(()=>Ic(i,A,E),Re(1e4,2e4)*r)});return l({kind:"ask.close",id:A,answer:P}),P}function w(T,E,A){l({kind:"todo.update",items:T.map((P,v)=>({text:P,status:v<E?"completed":v===E&&A?"in_progress":"pending"}))})}async function M(){for(l({kind:"session.start",cwd:s.id,model:"claude-sonnet-5-5",project:s}),g(),_();;){let T=`demo-turn-${++t}`,E=h++===0?a:Bn(Object.keys(sd));o&&(l({kind:"session.thread"}),l({kind:"agent.message",via:"projects-relay",text:E})),l({kind:"turn.start",turnId:T,text:E});let A=ig[E]??sd[E]??["Look around","Make the change","Test it"];w(A,0,!0);let P=[];for(let C=0;C<Re(0,3);C++)P.push(f(void 0,0));let v=Re(0,360);for(let C=0;C<A.length;C++){if(w(A,C,!0),await m(void 0),c+=Re(3e3,12e3),g(),Math.random()<.45){let D=Bn(ag);l({kind:"asset.add",id:`file-${D}`,type:"file",title:D.split("/").pop(),path:D,meta:{additions:Re(4,120),deletions:Re(0,40)}})}if(Math.random()<.3){let[D,k]=Bn(lg);l({kind:"asset.add",id:`img-${++t}`,type:"image",title:k,path:`screenshots/${D}.png`,src:od(D,v)})}if(C===1&&Math.random()<.4){let D=Math.random();if(D<.6){let k=Bn(sg),H=[{...k,options:k.options.map(Y=>({...Y,...Y.preview&&{preview:od(Y.preview,v)}}))}];await S({type:"question",questions:H},k.options[0].label)}else if(D<.85){let[k,H]=Bn(rg);await S({type:"permission",tool:k,summary:H},"Allowed")}else await S({type:"plan",plan:og},"Approved")}}if(w(A,A.length,!1),await Promise.all(P),Math.random()<.6){let[C,D,k]=Bn(cg),H=Re(12,240);l({kind:"asset.add",id:`${C}-${H}`,type:C,title:D,url:`${k}${H}`,...C==="pr"&&{meta:{state:"open",additions:Re(20,300),deletions:Re(2,80)}}})}if(c+=Re(4e3,14e3),p()>fs-33e3){let C=p();c=Re(9e3,16e3),l({kind:"context.compact",trigger:"auto",before:C,after:p()})}g();let x=Math.random()<.08?"error":"answer";l({kind:"turn.complete",turnId:T,reason:x,durationMs:9e3,...x==="answer"&&{answer:Bn(tg)}}),_(),await ad((Math.random()<.5?Re(1500,5e3):Re(9e3,2e4))*r)}}M()}e("demo-payments-1",ps[0],1,!1,"Harden the session handling"),setTimeout(()=>e("demo-payments-2",ps[0],1.6,!1,"Why is the build flaky?"),2500),setTimeout(()=>e("demo-dashboard-1",ps[1],1.3,!0,"Migrate charts to the new tokens"),5e3)}function cd(){let n=Date.now(),t=36e5;return[[ps[0],"demo-past-1",3,"Fix the double-charge race",142e3,1,4.12],[ps[0],"demo-past-2",26,"Add idempotency keys",61e3,0,1.37],[ps[1],"demo-past-3",5,"Dark mode for the charts",188e3,2,6.5],[ps[1],"demo-past-4",50,"Upgrade to React 19",97e3,0,2.05]].map(([e,i,s,r,o,a,l])=>({session:i,project:e,cwd:e.id,gitBranch:"main",model:"claude-sonnet-5-5",startedAt:n-s*t-2*t,endedAt:n-s*t,prompts:[{t:n-s*t-2*t,text:r},{t:n-s*t-t,text:"Now add tests for it"}],turns:2+a*6,toolCalls:Re(30,160),errors:Re(0,6),tools:{Read:40,Edit:12,Bash:20},agents:[{type:"Explore",description:"Map the code",context:41e3,tools:18}],compactions:Array.from({length:a},()=>({trigger:"auto",before:167e3})),context:o,window:fs,costUsd:l}))}var kc={};Rc(kc,{BUSY_MS:()=>bd,DEFAULT_WINDOW:()=>Lc,TOOL_LINGER_MS:()=>_d,WARN_AT:()=>Gi,agentState:()=>Wi,aid:()=>Ce,apply:()=>aa,applyHistory:()=>Vr,asksOf:()=>Lg,clean:()=>Sg,fill:()=>sn,idOf:()=>oi,isDirty:()=>bg,lineage:()=>Gr,links:()=>Tn,mail:()=>Vi,mailOf:()=>Oc,nodes:()=>et,notices:()=>Hr,openAsks:()=>$s,outputs:()=>Ae,outputsOf:()=>Pg,projects:()=>Ng,promptLabel:()=>oa,removeNode:()=>ms,reset:()=>Dc,sessionsOf:()=>Fg,shortId:()=>Uc,sid:()=>Bt,stats:()=>sa,sweep:()=>Nc,teamOf:()=>Xs,threadState:()=>un,toolName:()=>Ws,touch:()=>wg,visible:()=>Ug,warnings:()=>Fc});var hg=/^The (\S+) plugin sent a message:\s*/,ug=/^The coordinator sent a message while you were working:\s*/,dg=["This is how Claude Code surfaces a prompt a plugin submits between turns","Address this before completing your current task."],fg=n=>n.replace(/\s+/g," ").trim();function pg(n){for(let t of n.matchAll(/\s+(?=This is how\b|Address this\b)/g)){let e=fg(n.slice(t.index)).replace(/(\.\.\.|…)$/,"").trim();if(dg.some(i=>i.startsWith(e)||e.startsWith(i)))return n.slice(0,t.index)}return n}function hd(n,t){if(typeof n!="string")return{text:n};let e=hg.exec(n)??ug.exec(n);return e?{text:pg(n.slice(e[0].length)).trim(),from:e[1]??t??"a plugin"}:{text:n}}var ud=n=>typeof n=="string"&&n.trimStart().startsWith("<");var _d=6e3,mg=12,gg=25,_g=3e4,xg=6e4,dd=n=>n.replace(/\s+/g," ").replace(/(\.\.\.|…)$/,"").trim(),yg=(n,t)=>{let[e,i]=[dd(n),dd(t)];return e.startsWith(i)||i.startsWith(e)},Lc=2e5,Gi=.8,et=new Map,Tn=[],sa={calls:0,errors:0},Hr=[],Vi=[],vg=60,Ae=[],Mg=120,ai=!0,bg=()=>ai,Sg=()=>{ai=!1},wg=()=>{ai=!0},xd=n=>`p:${n}`,Bt=n=>`s:${n}`,Ce=(n,t)=>`a:${n}:${t}`,fd=(n,t)=>`t:${n}:${t}`,oi=n=>typeof n=="object"?n.id:n;function Gs(n){return et.set(n.id,n),ai=!0,n}function ra(n,t,e){Tn.push({source:n,target:t,kind:e}),ai=!0}function Eg(n,t){Tn=Tn.filter(e=>!(oi(e.target)===n&&e.kind===t)),ai=!0}function ms(n){et.delete(n)&&(Tn=Tn.filter(t=>oi(t.source)!==n&&oi(t.target)!==n),ai=!0)}function Dc(){for(let[n,t]of et)t.kind!=="project"&&!t.past&&et.delete(n);Tn=Tn.filter(n=>et.has(oi(n.source))&&et.has(oi(n.target))),Object.assign(sa,{calls:0,errors:0}),Hr.length=0,Vi.length=0,Ae.length=0,ai=!0}function sn(n){let t=n.context;return t?.tokens?Math.min(1,t.tokens/(t.window||yd(n)||Lc)):0}function yd(n){return et.get(Bt(n.session))?.context?.window}var oa=n=>n.length>26?`${n.slice(0,25)}\u2026`:n,Uc=n=>n.length>14?`${n.slice(0,8)}\u2026`:n;function Tg(n){let t=xd(n.id),e=et.get(t)??Gs({id:t,kind:"project",projectId:n.id,label:n.name});return e.label=n.name,e.remote=n.remote,e}function Pc(n,t){!t||n.project===t.id||(Tg(t),Eg(n.id,"project"),n.project=t.id,n.projectName=t.name,ra(xd(t.id),n.id,"project"))}function Mi(n){let t=Bt(n.session),e=et.get(t);return e?(e.past&&(e.past=!1,e.status="active",ai=!0),e):Gs({id:t,kind:"session",label:Uc(n.session),session:n.session,status:"active",startedAt:n.t,lastAt:n.t,history:0,prompts:[],compactions:[],turns:0,toolCalls:0,errors:0})}function vd(n,t){let e=Ce(n.session,t);if(et.has(e))return et.get(e);Mi(n);let i=Gs({id:e,kind:"agent",label:"subagent",type:"subagent",session:n.session,agent:t,status:"active",startedAt:n.t,history:0,compactions:[]});return ra(Bt(n.session),e,"spawn"),i}var vi=n=>n.agent?vd(n,n.agent):Mi(n);function Ag(n,t,e,i){Hr.unshift({t:n.t,text:t,level:e,target:i}),Hr.length>30&&Hr.pop()}var pd=n=>`${Math.round(n/1e3)}k`,Md={"projects-relay":"Project coordinator",peer:"Another session","peer-send-message":"Another session",channel:"A channel","slack-ping":"Slack","scheduled-trigger":"A routine",bridge:"You, remotely"},Rg=n=>n in Md,Cg=n=>Md[n],Ig={"session.start"(n){let t=Mi(n);Object.assign(t,{status:"active",cwd:n.cwd,model:n.model,startedAt:t.startedAt??n.t}),Pc(t,n.project)},"session.end"(n){let t=Mi(n);t.status="done",t.endedAt=n.t,t.endReason=n.reason},"turn.start"(n){let t=vi(n);if(t.pulseAt=n.t,t.kind==="session"&&(t.turnOpen=!0,t.turnAt=n.t,t.lastReason=void 0),t.kind==="session"&&n.text){if(t.turns++,ud(n.text))return;let{text:e,from:i}=hd(n.text);if(t.prompts.some(s=>!s.live&&Math.abs(s.t-n.t)<xg&&yg(s.text,e)))return;t.prompts.length||(t.label=oa(e)),t.prompts.push({t:n.t,text:e,from:i,live:!0}),t.prompts.length>gg&&t.prompts.shift()}},"turn.complete"(n){if(n.agent&&!et.has(Ce(n.session,n.agent)))return;let t=vi(n);n.context?.window&&(t.context=n.context),n.answer&&(t.answer={t:n.t,text:n.answer}),t.kind==="session"&&(t.turnOpen=!1,t.lastReason=n.reason,t.answeredAt=n.t)},"session.thread"(n){Mi(n).thread=!0},"agent.message"(n){Mi(n);let t=n.to??[...et.values()].find(o=>o.kind==="agent"&&o.session===n.session&&o.name&&o.name===n.toName)?.agent,e=n.from?Ce(n.session,n.from):Rg(n.via)?null:Bt(n.session),i=t?Ce(n.session,t):n.toName?null:Bt(n.session),s=o=>et.get(o)?.kind==="session"?"Lead":et.get(o)?.label;Vi.unshift({t:n.t,session:n.session,via:n.via,text:n.text,from:e,to:i,fromName:n.fromName??(e?s(e):Cg(n.via)),toName:n.toName??(i?s(i):void 0)}),Vi.length>vg&&Vi.pop();let r=i&&et.get(i);r&&(r.mailAt=n.t)},"context.measure"(n){let t=Mi(n);t.context={...t.context,...n.context},n.costUsd!==void 0&&(t.costUsd=n.costUsd),n.rateLimits&&(t.rateLimits=n.rateLimits)},"context.breakdown"(n){let t=Mi(n);t.breakdown={window:n.window,used:n.used,categories:n.categories},t.context={...t.context,window:n.window,tokens:t.context?.tokens??n.used}},"agent.context"(n){if(n.agent&&!et.has(Ce(n.session,n.agent)))return;let t=vi(n),e=n.window??t.context?.window??yd(t)??Lc;t.context={...t.context,tokens:n.tokens,window:e},n.model&&(t.model=n.model)},"context.compact"(n){let t=vi(n),e={t:n.t,trigger:n.trigger,before:n.before,after:n.after};t.compactions.push(e),t.compactAt=n.t,n.after!==void 0&&(t.context={...t.context,tokens:n.after});let i=n.before?` ${pd(n.before)} \u2192 ${n.after!==void 0?pd(n.after):"?"}`:"";Ag(n,`${t.label} compacted (${n.trigger})${i}`,"compact",t.id)},"agent.spawn"(n){Mi(n);let t=Ce(n.session,n.agent),e=n.parent?vd(n,n.parent).id:Bt(n.session),i=et.get(t);i||(i=Gs({id:t,kind:"agent",session:n.session,agent:n.agent,history:0,compactions:[]}),ra(e,t,"spawn")),Object.assign(i,{label:n.name||n.type,name:n.name,type:n.type,description:n.description,model:n.model,background:n.background,teammate:n.teammate,teammateId:n.teammateId,fork:n.fork,cwd:n.cwd,parent:e,status:"active",startedAt:n.t,announced:!0}),et.get(e).pulseAt=n.t},"agent.idle"(n){let t=et.get(Ce(n.session,n.agent));t&&(t.status="idle")},"agent.waiting"(n){let t=et.get(Ce(n.session,n.agent));t&&(t.status="waiting")},"agent.end"(n){let t=et.get(Ce(n.session,n.agent));t&&(t.status="done",t.endStatus=n.status,t.endedAt=n.t,Dg())},"todo.update"(n){let t=vi(n);t.todos=(n.items??[]).map(i=>({text:i.text,status:i.status,active:i.active})),t.todosAt=n.t;let e=t.todos.filter(i=>i.status==="completed").length;if(e!==t.todosDone){if(t.todosDone=e,!e)return;t.todosLog=[...(t.todosLog??[]).slice(-12),{kind:"todo",items:t.todos,t:n.t}]}},"ask.open"(n){let t=vi(n);t.asks=(t.asks??[]).filter(e=>e.id!==n.id),t.asks.push({id:n.id,t:n.t,type:n.type??"question",questions:n.questions,tool:n.tool,summary:n.summary,plan:n.plan}),t.askAt=n.t,n.type==="plan"&&n.plan&&gd(n,{id:`plan-${n.id}`,type:"plan",title:md(n.plan),text:n.plan})},"ask.close"(n){let t=vi(n),e=t.asks?.find(s=>s.id===n.id);if(t.asks=(t.asks??[]).filter(s=>s.id!==n.id),!e)return;let i=e.type==="question"?e.questions?.map(s=>s.question).join(" "):e.type==="plan"?md(e.plan??""):`${Ws(e.tool)} ${e.summary??""}`.trim();t.answered=[...(t.answered??[]).slice(-12),{kind:"ask",type:e.type,text:i,answer:n.answer,t:e.t}]},"asset.add"(n){gd(n,n)},"tool.start"(n){let t=vi(n);t.kind==="agent"&&t.status!=="active"&&(t.status="active");let e=fd(n.session,n.id);if(et.has(e))return;Gs({id:e,kind:"tool",label:n.tool,tool:n.tool,summary:n.summary,session:n.session,owner:t.id,status:"active",startedAt:n.t}),ra(t.id,e,"tool"),t.lastAt=n.t,sa.calls++;let i=et.get(Bt(n.session));i.toolCalls++,i.lastAt=n.t},"tool.end"(n){let t=et.get(fd(n.session,n.id));if(!t)return;t.status=n.ok?"ok":"error",t.endedAt=n.t,n.ok||(sa.errors++,et.get(Bt(n.session)).errors++);let e=et.get(t.owner);e&&(e.history++,e.kind==="agent"&&(e.lastAt=n.t))}};function Ws(n){let t=/^mcp__(.+?)__(.+)$/.exec(n??"");if(!t)return n??"a tool";let e=t[1].replace(/^plugin_\w+_/,"").replace(/[-_]/g," ");return`${e.charAt(0).toUpperCase()}${e.slice(1)}: ${t[2].replace(/_/g," ")}`}var md=n=>n.replace(/^#+\s*/gm,"").split(`
`).find(t=>t.trim())?.trim().slice(0,80)??"Plan";function gd(n,t){let e=vi(n),i={id:t.id,t:n.t,session:n.session,...n.agent&&{agent:n.agent},type:t.type,title:t.title,url:t.url,path:t.path,src:t.src,text:t.text,meta:t.meta},s=Ae.findIndex(o=>o.session===i.session&&o.id===i.id);s>=0&&Ae.splice(s,1),Ae.unshift(i),Ae.length>Mg&&Ae.pop(),e.outputAt=n.t;let r=et.get(Bt(n.session));r&&(r.outputAt=n.t)}var Pg=n=>Ae.filter(t=>t.session===n.session),Lg=n=>n.asks??[],$s=n=>[...et.values()].filter(t=>(t.kind==="session"||t.kind==="agent")&&t.session===n.session&&t.asks?.length).flatMap(t=>t.asks.map(e=>({...e,who:t}))).sort((t,e)=>t.t-e.t);function Dg(){let n=[...et.values()].filter(t=>t.kind==="agent"&&t.status==="done").sort((t,e)=>t.endedAt-e.endedAt);for(let t of n.slice(0,Math.max(0,n.length-mg)))ms(t.id)}function aa(n){Ig[n.kind]?.(n)}function Nc(n){for(let t of et.values())t.kind==="tool"&&t.endedAt&&n-t.endedAt>_d&&ms(t.id);for(let t of et.values())t.kind!=="agent"||t.announced||t.status==="done"||n-(t.lastAt??t.startedAt??0)<_g||Tn.some(e=>oi(e.source)===t.id&&e.kind==="tool")||ms(t.id)}function Vr(n,t){let e=new Set;for(let i of n){let s=Bt(i.session);e.add(s);let r=et.get(s);if(r&&!r.past){!r.prompts.length&&i.prompts.length&&(r.prompts=i.prompts,r.label=oa(i.prompts[0].text)),r.compactions.length||(r.compactions=i.compactions),r.costUsd??=i.costUsd,r.gitBranch??=i.gitBranch,r.project||Pc(r,i.project);continue}if(!t){r&&ms(s);continue}let o=r??Gs({id:s,kind:"session",session:i.session,past:!0,history:0});Object.assign(o,{label:i.prompts[0]?.text?oa(i.prompts[0].text):Uc(i.session),status:"past",past:!0,cwd:i.cwd,model:i.model,gitBranch:i.gitBranch,startedAt:i.startedAt,endedAt:i.endedAt,lastAt:i.endedAt,prompts:i.prompts,turns:i.turns,toolCalls:i.toolCalls,errors:i.errors,tools:i.tools,pastAgents:i.agents,compactions:i.compactions,costUsd:i.costUsd,context:i.context?{tokens:i.context,window:i.window}:void 0}),Pc(o,i.project)}for(let i of[...et.values()])i.past&&!e.has(i.id)&&ms(i.id);for(let i of[...et.values()])i.kind==="project"&&!Tn.some(s=>oi(s.source)===i.id)&&ms(i.id);ai=!0}function Ug(n){let t=[...et.values()];if(!n)return{nodes:t,links:[...Tn]};let e=new Set;for(let i of t)(i.kind==="project"?i.projectId:et.get(Bt(i.session))?.project)===n&&e.add(i.id);return{nodes:t.filter(i=>e.has(i.id)),links:Tn.filter(i=>e.has(oi(i.source))&&e.has(oi(i.target)))}}function Ng(){return[...et.values()].filter(n=>n.kind==="project").sort((n,t)=>n.label.localeCompare(t.label))}function Fg(n){return[...et.values()].filter(t=>t.kind==="session"&&t.project===n).sort((t,e)=>Number(t.past)-Number(e.past)||(e.lastAt??0)-(t.lastAt??0))}function Fc(){return[...et.values()].filter(n=>(n.kind==="session"||n.kind==="agent")&&!n.past&&n.status!=="done"&&sn(n)>=Gi).sort((n,t)=>sn(t)-sn(n))}var bd=2500;function un(n,t=new Set){return n.past||n.status==="done"?"ended":n.kind==="session"&&$s(n).length?"asking":n.turnOpen||t.has(n.id)||Date.now()-(n.lastAt??0)<bd?"working":n.lastReason&&n.lastReason!=="answer"?"stuck":"waiting"}function Wi(n){return n.status==="done"?n.endStatus==="failed"||n.endStatus==="killed"?"failed":"done":n.status==="idle"?"idle":n.status==="waiting"?"waiting":"working"}function Xs(n){let t=[...et.values()].filter(s=>s.kind==="agent"&&s.session===n.session),e=new Map;for(let s of t){let r=s.parent??n.id;e.has(r)||e.set(r,[]),e.get(r).push(s)}let i=s=>(e.get(s)??[]).sort((r,o)=>(r.startedAt??0)-(o.startedAt??0)).map(r=>({node:r,children:i(r.id)}));return i(n.id)}function Gr(n){let t=[],e=n;for(;e&&e.kind==="agent";)t.unshift(e),e=et.get(e.parent??Bt(e.session));return e&&t.unshift(e),t}var Oc=n=>Vi.filter(t=>t.session===n.session);var Vc={};Rc(Vc,{activity:()=>zn,ago:()=>De,beadColor:()=>Hc,escapeHtml:()=>V,family:()=>la,ingest:()=>ca,lastAction:()=>Bc,moments:()=>gs,quote:()=>Ke,reset:()=>zc});var Og=12,kg=40,gs=[],zn=new Map,Bc=null;function zc(){gs.length=0,zn.clear(),Bc=null}function V(n){return String(n??"").replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t])}var Ke=n=>`\u201C${n}\u201D`,Bg=n=>String(n).split(/[\\/]/).filter(Boolean).pop()??n,zg=[{test:n=>["Read","NotebookRead"].includes(n),done:"read",try:"read",bead:"sky",file:"read"},{test:n=>["Edit","MultiEdit","Write","NotebookEdit"].includes(n),done:"edited",try:"edit",bead:"coral",file:"edit"},{test:n=>["Grep","Glob","LS"].includes(n),done:"searched for",try:"search for",bead:"leaf"},{test:n=>["WebFetch","WebSearch"].includes(n),done:"looked up",try:"look up",bead:"lilac"},{test:n=>["Bash","BashOutput","PowerShell"].includes(n),done:"ran",try:"run",bead:"mustard"},{test:n=>["Task","Agent"].includes(n),done:"handed off",try:"hand off",bead:"teal"},{test:n=>n==="TodoWrite",done:"updated its todo list",try:"update its todo list",bead:"line",bare:!0},{test:n=>n.startsWith("mcp__"),mcp:!0,bead:"lilac"}];function la(n){return zg.find(t=>t.test(n??""))??{done:"used",try:"use",bead:"line",other:!0}}var Hc=n=>la(n).bead;function Hg(n,t,e){let i=la(n);if(i.mcp){let[,o,a]=n.split("__");return`${e?"used":"couldn\u2019t use"} ${o}\u2019s ${a??"tool"}`}if(i.bare)return e?i.done:`couldn\u2019t ${i.try}`;let s=i.file&&t?Bg(t):t??(i.other?n:""),r=i.other?`${n}${t?` on ${t}`:""}`:s;return`${e?i.done:`couldn\u2019t ${i.try}`} ${r}`.trim()}var li=n=>et.get(Bt(n))?.label??"A session",Sd=n=>n.agent?et.get(Ce(n.session,n.agent))?.label??"A subagent":"The session";function ci(n,t,e="",i=Bt(n.session)){gs.unshift({t:n.t,text:t,tone:e,target:i}),gs.length>kg&&gs.pop()}function Vg(n){let t=Bt(n.session),e=zn.get(t);return e||zn.set(t,e={actions:[],files:new Map}),e}var qs=new Map;function ca(n){switch(n.kind){case"tool.start":{qs.set(`${n.session}:${n.id}`,{tool:n.tool,summary:n.summary}),qs.size>500&&qs.delete(qs.keys().next().value);break}case"tool.end":{let t=`${n.session}:${n.id}`,e=qs.get(t)??{tool:n.tool};qs.delete(t);let i=`${Sd(n)} ${Hg(e.tool??n.tool,e.summary,n.ok)}`,s=Vg(n);s.actions.unshift({t:n.t,text:i,ok:n.ok}),s.actions.length>Og&&s.actions.pop();let r=la(e.tool??n.tool);if(r.file&&e.summary){let o=s.files.get(e.summary)??{reads:0,edits:0,t:0};r.file==="edit"?o.edits++:o.reads++,o.t=n.t,s.files.set(e.summary,o)}Bc={session:Bt(n.session),text:i},n.ok||ci(n,`${i} in ${Ke(li(n.session))}.`,"bad");break}case"agent.spawn":ci(n,`${Ke(li(n.session))} started ${/^[aeiou]/i.test(n.type??"")?"an":"a"} ${n.name||n.type} subagent${n.description?`: ${n.description}`:""}.`,"",Ce(n.session,n.agent));break;case"agent.end":{let t=et.get(Ce(n.session,n.agent));t&&ci(n,t.endStatus==="failed"||t.endStatus==="killed"?`${t.label} stopped before finishing its work for ${Ke(li(n.session))}.`:`${t.label} finished its work for ${Ke(li(n.session))}.`,t.endStatus==="failed"?"bad":"");break}case"agent.message":{let t=Vi[0];if(!t||t.t!==n.t||t.session!==n.session)break;let e=t.fromName==="Lead"?"The lead":t.fromName??"Someone",i=t.toName==="Lead"?Ke(li(n.session)):t.toName??"someone";ci(n,`${e} \u2192 ${i}${t.text?`: ${t.text}`:""}`,"mail",t.to??t.from??Bt(n.session));break}case"session.thread":{let t=et.get(Bt(n.session));t&&!t.threadAnnounced&&(t.threadAnnounced=!0,ci(n,`${Ke(li(n.session))} is working as a thread of a claude.ai project.`,"mail"));break}case"context.compact":ci(n,`${n.agent?Sd(n):Ke(li(n.session))} compacted its context and has room again.`,"note");break;case"session.start":ci(n,`A session started in ${n.project?.name??"a new folder"}.`);break;case"session.end":ci(n,`${Ke(li(n.session))} ended.`);break;case"chat.sent":ci(n,`You messaged ${n.agent?et.get(Ce(n.session,n.agent))?.label??"a subagent":Ke(li(n.session))}.`,"note",n.agent?Ce(n.session,n.agent):Bt(n.session));break;case"chat.delivered":n.ok===!1&&ci(n,`Your message to ${n.agent?et.get(Ce(n.session,n.agent))?.label??"a subagent":Ke(li(n.session))} couldn't be delivered${n.how?`: ${n.how}`:""}.`,"bad",n.agent?Ce(n.session,n.agent):Bt(n.session));break}}function De(n,t=Date.now()){if(!n)return"";let e=Math.max(0,Math.round((t-n)/1e3));return e<5?"just now":e<60?`${e}s ago`:e<3600?`${Math.round(e/60)}m ago`:e<86400?`${Math.round(e/3600)}h ago`:`${Math.round(e/86400)}d ago`}var Wu={};Rc(Wu,{animate:()=>Vu,debug:()=>Gb,focusOn:()=>yc,focusProject:()=>Bu,level:()=>ei,mount:()=>Uu,pct:()=>_i,pulse:()=>Hu,roomKey:()=>Du,sessionTint:()=>Bi,setHover:()=>ku,setInsets:()=>Ou,setSelected:()=>Gu,sync:()=>zu,tintOf:()=>cs});var Pn={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},qn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Zd=0,Mh=1,Kd=2;var bh=1,Qa=2,pi=3,Ri=0,We=1,fn=2,Pi=0,bs=1,Sh=2,wh=3,Eh=4,Jd=5,Qi=100,jd=101,Qd=102,tf=103,ef=104,nf=200,sf=201,rf=202,of=203,Ia=204,Pa=205,af=206,lf=207,cf=208,hf=209,uf=210,df=211,ff=212,pf=213,mf=214,tl=0,el=1,nl=2,Ss=3,il=4,sl=5,rl=6,ol=7,al=0,gf=1,_f=2,Li=0,xf=1,yf=2,vf=3,Mf=4,bf=5,Sf=6,wf=7;var Th=300,Rs=301,Cs=302,ll=303,cl=304,wo=306,cr=1e3,ji=1001,La=1002,dn=1003,Ef=1004;var Eo=1005;var $n=1006,hl=1007;var is=1008;var Yn=1009,Ah=1010,Rh=1011,Mr=1012,ul=1013,ss=1014,Zn=1015,br=1016,dl=1017,fl=1018,Sr=1020,Ch=35902,Ih=35899,Ph=1021,Lh=1022,Ln=1023,hr=1026,wr=1027,pl=1028,ml=1029,Dh=1030,gl=1031;var _l=1033,To=33776,Ao=33777,Ro=33778,Co=33779,xl=35840,yl=35841,vl=35842,Ml=35843,bl=36196,Sl=37492,wl=37496,El=37808,Tl=37809,Al=37810,Rl=37811,Cl=37812,Il=37813,Pl=37814,Ll=37815,Dl=37816,Ul=37817,Nl=37818,Fl=37819,Ol=37820,kl=37821,Bl=36492,zl=36494,Hl=36495,Vl=36283,Gl=36284,Wl=36285,$l=36286;var Qr=2300,Da=2301,Ca=2302,dh=2400,fh=2401,ph=2402;var Tf=3200,Af=3201;var Xl=0,Rf=1,Kn="",Pe="srgb",ws="srgb-linear",to="linear",oe="srgb";var Ms=7680;var mh=519,Cf=512,If=513,Pf=514,Uh=515,Lf=516,Df=517,Uf=518,Nf=519,gh=35044;var Nh="300 es",Wn=2e3,eo=2001;var hi=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){let i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){let i=this._listeners;if(i===void 0)return;let s=i[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let i=e[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Je=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],wd=1234567,Jr=Math.PI/180,ur=180/Math.PI;function Er(){let n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Je[n&255]+Je[n>>8&255]+Je[n>>16&255]+Je[n>>24&255]+"-"+Je[t&255]+Je[t>>8&255]+"-"+Je[t>>16&15|64]+Je[t>>24&255]+"-"+Je[e&63|128]+Je[e>>8&255]+"-"+Je[e>>16&255]+Je[e>>24&255]+Je[i&255]+Je[i>>8&255]+Je[i>>16&255]+Je[i>>24&255]).toLowerCase()}function Xt(n,t,e){return Math.max(t,Math.min(e,n))}function Fh(n,t){return(n%t+t)%t}function Gg(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function Wg(n,t,e){return n!==t?(e-n)/(t-n):0}function jr(n,t,e){return(1-e)*n+e*t}function $g(n,t,e,i){return jr(n,t,1-Math.exp(-e*i))}function Xg(n,t=1){return t-Math.abs(Fh(n,t*2)-t)}function qg(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Yg(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function Zg(n,t){return n+Math.floor(Math.random()*(t-n+1))}function Kg(n,t){return n+Math.random()*(t-n)}function Jg(n){return n*(.5-Math.random())}function jg(n){n!==void 0&&(wd=n);let t=wd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Qg(n){return n*Jr}function t0(n){return n*ur}function e0(n){return(n&n-1)===0&&n!==0}function n0(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function i0(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function s0(n,t,e,i,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+i)/2),h=o((t+i)/2),u=r((t-i)/2),d=o((t-i)/2),p=r((i-t)/2),g=o((i-t)/2);switch(s){case"XYX":n.set(a*h,l*u,l*d,a*c);break;case"YZY":n.set(l*d,a*h,l*u,a*c);break;case"ZXZ":n.set(l*u,l*d,a*h,a*c);break;case"XZX":n.set(a*h,l*g,l*p,a*c);break;case"YXY":n.set(l*p,a*h,l*g,a*c);break;case"ZYZ":n.set(l*g,l*p,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ar(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function rn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var Di={DEG2RAD:Jr,RAD2DEG:ur,generateUUID:Er,clamp:Xt,euclideanModulo:Fh,mapLinear:Gg,inverseLerp:Wg,lerp:jr,damp:$g,pingpong:Xg,smoothstep:qg,smootherstep:Yg,randInt:Zg,randFloat:Kg,randFloatSpread:Jg,seededRandom:jg,degToRad:Qg,radToDeg:t0,isPowerOfTwo:e0,ceilPowerOfTwo:n0,floorPowerOfTwo:i0,setQuaternionFromProperEuler:s0,normalize:rn,denormalize:ar},Tt=class n{constructor(t=0,e=0){n.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Xt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(Xt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*i-o*s+t.x,this.y=r*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Cn=class{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,o,a){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3],d=r[o+0],p=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(u!==_||l!==d||c!==p||h!==g){let m=1-a,f=l*d+c*p+h*g+u*_,S=f>=0?1:-1,w=1-f*f;if(w>Number.EPSILON){let T=Math.sqrt(w),E=Math.atan2(T,f*S);m=Math.sin(m*E)/T,a=Math.sin(a*E)/T}let M=a*S;if(l=l*m+d*M,c=c*m+p*M,h=h*m+g*M,u=u*m+_*M,m===1-a){let T=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=T,c*=T,h*=T,u*=T}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,o){let a=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=r[o],d=r[o+1],p=r[o+2],g=r[o+3];return t[e]=a*g+h*u+l*p-c*d,t[e+1]=l*g+h*d+c*u-a*p,t[e+2]=c*g+h*p+a*d-l*u,t[e+3]=h*g-a*u-l*d-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let i=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(i/2),h=a(s/2),u=a(r/2),d=l(i/2),p=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"YZX":this._x=d*h*u+c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u-d*p*g;break;case"XZY":this._x=d*h*u-c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,i=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=i+a+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(i>a&&i>u){let p=2*Math.sqrt(1+i-a-u);this._w=(h-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>u){let p=2*Math.sqrt(1+a-i-u);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+u-i-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Xt(this.dot(t),-1,1)))}rotateTowards(t,e){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let i=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-i*c,this._z=r*h+o*c+i*l-s*a,this._w=o*h-i*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let i=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+i*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=i,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let p=1-e;return this._w=p*o+e*this._w,this._x=p*i+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=i*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},I=class n{constructor(t=0,e=0,i=0){n.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ed.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ed.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,i=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*i),h=2*(a*e-r*s),u=2*(r*i-o*e);return this.x=e+l*c+o*u-a*h,this.y=i+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Xt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let i=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-i*l,this.z=i*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Gc.copy(this).projectOnVector(t),this.sub(Gc)}reflect(t){return this.sub(Gc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(Xt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){let s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Gc=new I,Ed=new Cn,zt=class n{constructor(t,e,i,s,r,o,a,l,c){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,l,c)}set(t,e,i,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],p=i[5],g=i[8],_=s[0],m=s[3],f=s[6],S=s[1],w=s[4],M=s[7],T=s[2],E=s[5],A=s[8];return r[0]=o*_+a*S+l*T,r[3]=o*m+a*w+l*E,r[6]=o*f+a*M+l*A,r[1]=c*_+h*S+u*T,r[4]=c*m+h*w+u*E,r[7]=c*f+h*M+u*A,r[2]=d*_+p*S+g*T,r[5]=d*m+p*w+g*E,r[8]=d*f+p*M+g*A,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-i*r*h+i*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,p=c*r-o*l,g=e*u+i*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return t[0]=u*_,t[1]=(s*c-h*i)*_,t[2]=(a*i-s*o)*_,t[3]=d*_,t[4]=(h*e-s*l)*_,t[5]=(s*r-a*e)*_,t[6]=p*_,t[7]=(i*l-c*e)*_,t[8]=(o*e-i*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Wc.makeScale(t,e)),this}rotate(t){return this.premultiply(Wc.makeRotation(-t)),this}translate(t,e){return this.premultiply(Wc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Wc=new zt;function Oh(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function no(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Ff(){let n=no("canvas");return n.style.display="block",n}var Td={};function dr(n){n in Td||(Td[n]=!0,console.warn(n))}function Of(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}var Ad=new zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Rd=new zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function r0(){let n={enabled:!0,workingColorSpace:ws,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===oe&&(s.r=Ai(s.r),s.g=Ai(s.g),s.b=Ai(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===oe&&(s.r=lr(s.r),s.g=lr(s.g),s.b=lr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Kn?to:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return dr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return dr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[ws]:{primaries:t,whitePoint:i,transfer:to,toXYZ:Ad,fromXYZ:Rd,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Pe},outputColorSpaceConfig:{drawingBufferColorSpace:Pe}},[Pe]:{primaries:t,whitePoint:i,transfer:oe,toXYZ:Ad,fromXYZ:Rd,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Pe}}}),n}var jt=r0();function Ai(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function lr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var Ys,Ua=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Ys===void 0&&(Ys=no("canvas")),Ys.width=t.width,Ys.height=t.height;let s=Ys.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=Ys}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=no("canvas");e.width=t.width,e.height=t.height;let i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ai(r[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Ai(e[i]/255)*255):e[i]=Ai(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},o0=0,fr=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:o0++}),this.uuid=Er(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push($c(s[o].image)):r.push($c(s[o]))}else r=$c(s);i.url=r}return e||(t.images[this.uuid]=i),i}};function $c(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Ua.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var a0=0,Xc=new I,on=class n extends hi{constructor(t=n.DEFAULT_IMAGE,e=n.DEFAULT_MAPPING,i=ji,s=ji,r=$n,o=is,a=Ln,l=Yn,c=n.DEFAULT_ANISOTROPY,h=Kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:a0++}),this.uuid=Er(),this.name="",this.source=new fr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Tt(0,0),this.repeat=new Tt(1,1),this.center=new Tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Xc).x}get height(){return this.source.getSize(Xc).y}get depth(){return this.source.getSize(Xc).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let i=t[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Th)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case cr:t.x=t.x-Math.floor(t.x);break;case ji:t.x=t.x<0?0:1;break;case La:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case cr:t.y=t.y-Math.floor(t.y);break;case ji:t.y=t.y<0?0:1;break;case La:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};on.DEFAULT_IMAGE=null;on.DEFAULT_MAPPING=Th;on.DEFAULT_ANISOTROPY=1;var re=class n{constructor(t=0,e=0,i=0,s=1){n.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r,l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],g=l[9],_=l[2],m=l[6],f=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let w=(c+1)/2,M=(p+1)/2,T=(f+1)/2,E=(h+d)/4,A=(u+_)/4,P=(g+m)/4;return w>M&&w>T?w<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(w),s=E/i,r=A/i):M>T?M<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),i=E/s,r=P/s):T<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),i=A/r,s=P/r),this.set(i,s,r,e),this}let S=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(u-_)/S,this.z=(d-h)/S,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this.w=Xt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this.w=Xt(this.w,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Xt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Na=class extends hi{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:$n,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new re(0,0,t,e),this.scissorTest=!1,this.viewport=new re(0,0,t,e);let s={width:t,height:e,depth:i.depth},r=new on(s);this.textures=[];let o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){let e={minFilter:$n,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new fr(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},ui=class extends Na{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}},io=class extends on{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=dn,this.minFilter=dn,this.wrapR=ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Fa=class extends on{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=dn,this.minFilter=dn,this.wrapR=ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var di=class{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Hn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Hn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let i=Hn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Hn):Hn.fromBufferAttribute(r,o),Hn.applyMatrix4(t.matrixWorld),this.expandByPoint(Hn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ha.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ha.copy(i.boundingBox)),ha.applyMatrix4(t.matrixWorld),this.union(ha)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Hn),Hn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Wr),ua.subVectors(this.max,Wr),Zs.subVectors(t.a,Wr),Ks.subVectors(t.b,Wr),Js.subVectors(t.c,Wr),$i.subVectors(Ks,Zs),Xi.subVectors(Js,Ks),_s.subVectors(Zs,Js);let e=[0,-$i.z,$i.y,0,-Xi.z,Xi.y,0,-_s.z,_s.y,$i.z,0,-$i.x,Xi.z,0,-Xi.x,_s.z,0,-_s.x,-$i.y,$i.x,0,-Xi.y,Xi.x,0,-_s.y,_s.x,0];return!qc(e,Zs,Ks,Js,ua)||(e=[1,0,0,0,1,0,0,0,1],!qc(e,Zs,Ks,Js,ua))?!1:(da.crossVectors($i,Xi),e=[da.x,da.y,da.z],qc(e,Zs,Ks,Js,ua))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Hn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Hn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(bi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),bi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),bi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),bi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),bi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),bi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),bi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),bi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(bi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},bi=[new I,new I,new I,new I,new I,new I,new I,new I],Hn=new I,ha=new di,Zs=new I,Ks=new I,Js=new I,$i=new I,Xi=new I,_s=new I,Wr=new I,ua=new I,da=new I,xs=new I;function qc(n,t,e,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){xs.fromArray(n,r);let a=s.x*Math.abs(xs.x)+s.y*Math.abs(xs.y)+s.z*Math.abs(xs.z),l=t.dot(xs),c=e.dot(xs),h=i.dot(xs);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var l0=new di,$r=new I,Yc=new I,ts=class{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let i=this.center;e!==void 0?i.copy(e):l0.setFromPoints(t).getCenter(i);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;$r.subVectors(t,this.center);let e=$r.lengthSq();if(e>this.radius*this.radius){let i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector($r,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Yc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint($r.copy(t.center).add(Yc)),this.expandByPoint($r.copy(t.center).sub(Yc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Si=new I,Zc=new I,fa=new I,qi=new I,Kc=new I,pa=new I,Jc=new I,Es=class{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Si)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Si.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Si.copy(this.origin).addScaledVector(this.direction,e),Si.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Zc.copy(t).add(e).multiplyScalar(.5),fa.copy(e).sub(t).normalize(),qi.copy(this.origin).sub(Zc);let r=t.distanceTo(e)*.5,o=-this.direction.dot(fa),a=qi.dot(this.direction),l=-qi.dot(fa),c=qi.lengthSq(),h=Math.abs(1-o*o),u,d,p,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){let _=1/h;u*=_,d*=_,p=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Zc).addScaledVector(fa,d),p}intersectSphere(t,e){Si.subVectors(t.center,this.origin);let i=Si.dot(this.direction),s=Si.dot(Si)-i*i,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){let i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Si)!==null}intersectTriangle(t,e,i,s,r){Kc.subVectors(e,t),pa.subVectors(i,t),Jc.crossVectors(Kc,pa);let o=this.direction.dot(Jc),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;qi.subVectors(this.origin,t);let l=a*this.direction.dot(pa.crossVectors(qi,pa));if(l<0)return null;let c=a*this.direction.dot(Kc.cross(qi));if(c<0||l+c>o)return null;let h=-a*qi.dot(Jc);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ae=class n{constructor(t,e,i,s,r,o,a,l,c,h,u,d,p,g,_,m){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,l,c,h,u,d,p,g,_,m)}set(t,e,i,s,r,o,a,l,c,h,u,d,p,g,_,m){let f=this.elements;return f[0]=t,f[4]=e,f[8]=i,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){let e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,i=t.elements,s=1/js.setFromMatrixColumn(t,0).length(),r=1/js.setFromMatrixColumn(t,1).length(),o=1/js.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,i=t.x,s=t.y,r=t.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=o*h,p=o*u,g=a*h,_=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=p+g*c,e[5]=d-_*c,e[9]=-a*l,e[2]=_-d*c,e[6]=g+p*c,e[10]=o*l}else if(t.order==="YXZ"){let d=l*h,p=l*u,g=c*h,_=c*u;e[0]=d+_*a,e[4]=g*a-p,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=p*a-g,e[6]=_+d*a,e[10]=o*l}else if(t.order==="ZXY"){let d=l*h,p=l*u,g=c*h,_=c*u;e[0]=d-_*a,e[4]=-o*u,e[8]=g+p*a,e[1]=p+g*a,e[5]=o*h,e[9]=_-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let d=o*h,p=o*u,g=a*h,_=a*u;e[0]=l*h,e[4]=g*c-p,e[8]=d*c+_,e[1]=l*u,e[5]=_*c+d,e[9]=p*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let d=o*l,p=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=_-d*u,e[8]=g*u+p,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=p*u+g,e[10]=d-_*u}else if(t.order==="XZY"){let d=o*l,p=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+_,e[5]=o*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=a*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(c0,t,h0)}lookAt(t,e,i){let s=this.elements;return yn.subVectors(t,e),yn.lengthSq()===0&&(yn.z=1),yn.normalize(),Yi.crossVectors(i,yn),Yi.lengthSq()===0&&(Math.abs(i.z)===1?yn.x+=1e-4:yn.z+=1e-4,yn.normalize(),Yi.crossVectors(i,yn)),Yi.normalize(),ma.crossVectors(yn,Yi),s[0]=Yi.x,s[4]=ma.x,s[8]=yn.x,s[1]=Yi.y,s[5]=ma.y,s[9]=yn.y,s[2]=Yi.z,s[6]=ma.z,s[10]=yn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],p=i[13],g=i[2],_=i[6],m=i[10],f=i[14],S=i[3],w=i[7],M=i[11],T=i[15],E=s[0],A=s[4],P=s[8],v=s[12],x=s[1],C=s[5],D=s[9],k=s[13],H=s[2],Y=s[6],W=s[10],ot=s[14],G=s[3],ct=s[7],J=s[11],j=s[15];return r[0]=o*E+a*x+l*H+c*G,r[4]=o*A+a*C+l*Y+c*ct,r[8]=o*P+a*D+l*W+c*J,r[12]=o*v+a*k+l*ot+c*j,r[1]=h*E+u*x+d*H+p*G,r[5]=h*A+u*C+d*Y+p*ct,r[9]=h*P+u*D+d*W+p*J,r[13]=h*v+u*k+d*ot+p*j,r[2]=g*E+_*x+m*H+f*G,r[6]=g*A+_*C+m*Y+f*ct,r[10]=g*P+_*D+m*W+f*J,r[14]=g*v+_*k+m*ot+f*j,r[3]=S*E+w*x+M*H+T*G,r[7]=S*A+w*C+M*Y+T*ct,r[11]=S*P+w*D+M*W+T*J,r[15]=S*v+w*k+M*ot+T*j,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],p=t[14],g=t[3],_=t[7],m=t[11],f=t[15];return g*(+r*l*u-s*c*u-r*a*d+i*c*d+s*a*p-i*l*p)+_*(+e*l*p-e*c*d+r*o*d-s*o*p+s*c*h-r*l*h)+m*(+e*c*u-e*a*p-r*o*u+i*o*p+r*a*h-i*c*h)+f*(-s*a*h-e*l*u+e*a*d+s*o*u-i*o*d+i*l*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],p=t[11],g=t[12],_=t[13],m=t[14],f=t[15],S=u*m*c-_*d*c+_*l*p-a*m*p-u*l*f+a*d*f,w=g*d*c-h*m*c-g*l*p+o*m*p+h*l*f-o*d*f,M=h*_*c-g*u*c+g*a*p-o*_*p-h*a*f+o*u*f,T=g*u*l-h*_*l-g*a*d+o*_*d+h*a*m-o*u*m,E=e*S+i*w+s*M+r*T;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/E;return t[0]=S*A,t[1]=(_*d*r-u*m*r-_*s*p+i*m*p+u*s*f-i*d*f)*A,t[2]=(a*m*r-_*l*r+_*s*c-i*m*c-a*s*f+i*l*f)*A,t[3]=(u*l*r-a*d*r-u*s*c+i*d*c+a*s*p-i*l*p)*A,t[4]=w*A,t[5]=(h*m*r-g*d*r+g*s*p-e*m*p-h*s*f+e*d*f)*A,t[6]=(g*l*r-o*m*r-g*s*c+e*m*c+o*s*f-e*l*f)*A,t[7]=(o*d*r-h*l*r+h*s*c-e*d*c-o*s*p+e*l*p)*A,t[8]=M*A,t[9]=(g*u*r-h*_*r-g*i*p+e*_*p+h*i*f-e*u*f)*A,t[10]=(o*_*r-g*a*r+g*i*c-e*_*c-o*i*f+e*a*f)*A,t[11]=(h*a*r-o*u*r-h*i*c+e*u*c+o*i*p-e*a*p)*A,t[12]=T*A,t[13]=(h*_*s-g*u*s+g*i*d-e*_*d-h*i*m+e*u*m)*A,t[14]=(g*a*s-o*_*s-g*i*l+e*_*l+o*i*m-e*a*m)*A,t[15]=(o*u*s-h*a*s+h*i*l-e*u*l-o*i*d+e*a*d)*A,this}scale(t){let e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let i=Math.cos(e),s=Math.sin(e),r=1-i,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+i,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+i,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,o){return this.set(1,i,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,p=r*h,g=r*u,_=o*h,m=o*u,f=a*u,S=l*c,w=l*h,M=l*u,T=i.x,E=i.y,A=i.z;return s[0]=(1-(_+f))*T,s[1]=(p+M)*T,s[2]=(g-w)*T,s[3]=0,s[4]=(p-M)*E,s[5]=(1-(d+f))*E,s[6]=(m+S)*E,s[7]=0,s[8]=(g+w)*A,s[9]=(m-S)*A,s[10]=(1-(d+_))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){let s=this.elements,r=js.set(s[0],s[1],s[2]).length(),o=js.set(s[4],s[5],s[6]).length(),a=js.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Vn.copy(this);let c=1/r,h=1/o,u=1/a;return Vn.elements[0]*=c,Vn.elements[1]*=c,Vn.elements[2]*=c,Vn.elements[4]*=h,Vn.elements[5]*=h,Vn.elements[6]*=h,Vn.elements[8]*=u,Vn.elements[9]*=u,Vn.elements[10]*=u,e.setFromRotationMatrix(Vn),i.x=r,i.y=o,i.z=a,this}makePerspective(t,e,i,s,r,o,a=Wn,l=!1){let c=this.elements,h=2*r/(e-t),u=2*r/(i-s),d=(e+t)/(e-t),p=(i+s)/(i-s),g,_;if(l)g=r/(o-r),_=o*r/(o-r);else if(a===Wn)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===eo)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,r,o,a=Wn,l=!1){let c=this.elements,h=2/(e-t),u=2/(i-s),d=-(e+t)/(e-t),p=-(i+s)/(i-s),g,_;if(l)g=1/(o-r),_=o/(o-r);else if(a===Wn)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===eo)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}},js=new I,Vn=new ae,c0=new I(0,0,0),h0=new I(1,1,1),Yi=new I,ma=new I,yn=new I,Cd=new ae,Id=new Cn,In=class n{constructor(t=0,e=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Xt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Xt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Xt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Xt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Xt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Xt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Cd.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Cd,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Id.setFromEuler(this),this.setFromQuaternion(Id,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};In.DEFAULT_ORDER="XYZ";var pr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},u0=0,Pd=new I,Qs=new Cn,wi=new ae,ga=new I,Xr=new I,d0=new I,f0=new Cn,Ld=new I(1,0,0),Dd=new I(0,1,0),Ud=new I(0,0,1),Nd={type:"added"},p0={type:"removed"},tr={type:"childadded",child:null},jc={type:"childremoved",child:null},Le=class n extends hi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:u0++}),this.uuid=Er(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let t=new I,e=new In,i=new Cn,s=new I(1,1,1);function r(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ae},normalMatrix:{value:new zt}}),this.matrix=new ae,this.matrixWorld=new ae,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new pr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Qs.setFromAxisAngle(t,e),this.quaternion.multiply(Qs),this}rotateOnWorldAxis(t,e){return Qs.setFromAxisAngle(t,e),this.quaternion.premultiply(Qs),this}rotateX(t){return this.rotateOnAxis(Ld,t)}rotateY(t){return this.rotateOnAxis(Dd,t)}rotateZ(t){return this.rotateOnAxis(Ud,t)}translateOnAxis(t,e){return Pd.copy(t).applyQuaternion(this.quaternion),this.position.add(Pd.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ld,t)}translateY(t){return this.translateOnAxis(Dd,t)}translateZ(t){return this.translateOnAxis(Ud,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(wi.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ga.copy(t):ga.set(t,e,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Xr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?wi.lookAt(Xr,ga,this.up):wi.lookAt(ga,Xr,this.up),this.quaternion.setFromRotationMatrix(wi),s&&(wi.extractRotation(s.matrixWorld),Qs.setFromRotationMatrix(wi),this.quaternion.premultiply(Qs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Nd),tr.child=t,this.dispatchEvent(tr),tr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(p0),jc.child=t,this.dispatchEvent(jc),jc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),wi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),wi.multiply(t.parent.matrixWorld)),t.applyMatrix4(wi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Nd),tr.child=t,this.dispatchEvent(tr),tr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xr,t,d0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xr,f0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),p=o(t.animations),g=o(t.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}};Le.DEFAULT_UP=new I(0,1,0);Le.DEFAULT_MATRIX_AUTO_UPDATE=!0;Le.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Gn=new I,Ei=new I,Qc=new I,Ti=new I,er=new I,nr=new I,Fd=new I,th=new I,eh=new I,nh=new I,ih=new re,sh=new re,rh=new re,Ji=class n{constructor(t=new I,e=new I,i=new I){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),Gn.subVectors(t,e),s.cross(Gn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){Gn.subVectors(s,e),Ei.subVectors(i,e),Qc.subVectors(t,e);let o=Gn.dot(Gn),a=Gn.dot(Ei),l=Gn.dot(Qc),c=Ei.dot(Ei),h=Ei.dot(Qc),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,p=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-p-g,g,p)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Ti)===null?!1:Ti.x>=0&&Ti.y>=0&&Ti.x+Ti.y<=1}static getInterpolation(t,e,i,s,r,o,a,l){return this.getBarycoord(t,e,i,s,Ti)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ti.x),l.addScaledVector(o,Ti.y),l.addScaledVector(a,Ti.z),l)}static getInterpolatedAttribute(t,e,i,s,r,o){return ih.setScalar(0),sh.setScalar(0),rh.setScalar(0),ih.fromBufferAttribute(t,e),sh.fromBufferAttribute(t,i),rh.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(ih,r.x),o.addScaledVector(sh,r.y),o.addScaledVector(rh,r.z),o}static isFrontFacing(t,e,i,s){return Gn.subVectors(i,e),Ei.subVectors(t,e),Gn.cross(Ei).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Gn.subVectors(this.c,this.b),Ei.subVectors(this.a,this.b),Gn.cross(Ei).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return n.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return n.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let i=this.a,s=this.b,r=this.c,o,a;er.subVectors(s,i),nr.subVectors(r,i),th.subVectors(t,i);let l=er.dot(th),c=nr.dot(th);if(l<=0&&c<=0)return e.copy(i);eh.subVectors(t,s);let h=er.dot(eh),u=nr.dot(eh);if(h>=0&&u<=h)return e.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(er,o);nh.subVectors(t,r);let p=er.dot(nh),g=nr.dot(nh);if(g>=0&&p<=g)return e.copy(r);let _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(i).addScaledVector(nr,a);let m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return Fd.subVectors(r,s),a=(u-h)/(u-h+(p-g)),e.copy(s).addScaledVector(Fd,a);let f=1/(m+_+d);return o=_*f,a=d*f,e.copy(i).addScaledVector(er,o).addScaledVector(nr,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},kf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zi={h:0,s:0,l:0},_a={h:0,s:0,l:0};function oh(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}var Gt=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Pe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,jt.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=jt.workingColorSpace){return this.r=t,this.g=e,this.b=i,jt.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=jt.workingColorSpace){if(t=Fh(t,1),e=Xt(e,0,1),i=Xt(i,0,1),e===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+e):i+e-i*e,o=2*i-r;this.r=oh(o,r,t+1/3),this.g=oh(o,r,t),this.b=oh(o,r,t-1/3)}return jt.colorSpaceToWorking(this,s),this}setStyle(t,e=Pe){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Pe){let i=kf[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ai(t.r),this.g=Ai(t.g),this.b=Ai(t.b),this}copyLinearToSRGB(t){return this.r=lr(t.r),this.g=lr(t.g),this.b=lr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Pe){return jt.workingToColorSpace(je.copy(this),t),Math.round(Xt(je.r*255,0,255))*65536+Math.round(Xt(je.g*255,0,255))*256+Math.round(Xt(je.b*255,0,255))}getHexString(t=Pe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=jt.workingColorSpace){jt.workingToColorSpace(je.copy(this),e);let i=je.r,s=je.g,r=je.b,o=Math.max(i,s,r),a=Math.min(i,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=jt.workingColorSpace){return jt.workingToColorSpace(je.copy(this),e),t.r=je.r,t.g=je.g,t.b=je.b,t}getStyle(t=Pe){jt.workingToColorSpace(je.copy(this),t);let e=je.r,i=je.g,s=je.b;return t!==Pe?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Zi),this.setHSL(Zi.h+t,Zi.s+e,Zi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Zi),t.getHSL(_a);let i=jr(Zi.h,_a.h,e),s=jr(Zi.s,_a.s,e),r=jr(Zi.l,_a.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},je=new Gt;Gt.NAMES=kf;var m0=0,Ci=class extends hi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:m0++}),this.uuid=Er(),this.name="",this.type="Material",this.blending=bs,this.side=Ri,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ia,this.blendDst=Pa,this.blendEquation=Qi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Gt(0,0,0),this.blendAlpha=0,this.depthFunc=Ss,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=mh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ms,this.stencilZFail=Ms,this.stencilZPass=Ms,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==bs&&(i.blending=this.blending),this.side!==Ri&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ia&&(i.blendSrc=this.blendSrc),this.blendDst!==Pa&&(i.blendDst=this.blendDst),this.blendEquation!==Qi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ss&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==mh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ms&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ms&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ms&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,i=null;if(e!==null){let s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Ve=class extends Ci{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Gt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new In,this.combine=al,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Ie=new I,xa=new Tt,g0=0,Be=class{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:g0++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=gh,this.updateRanges=[],this.gpuType=Zn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)xa.fromBufferAttribute(this,e),xa.applyMatrix3(t),this.setXY(e,xa.x,xa.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Ie.fromBufferAttribute(this,e),Ie.applyMatrix3(t),this.setXYZ(e,Ie.x,Ie.y,Ie.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Ie.fromBufferAttribute(this,e),Ie.applyMatrix4(t),this.setXYZ(e,Ie.x,Ie.y,Ie.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ie.fromBufferAttribute(this,e),Ie.applyNormalMatrix(t),this.setXYZ(e,Ie.x,Ie.y,Ie.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ie.fromBufferAttribute(this,e),Ie.transformDirection(t),this.setXYZ(e,Ie.x,Ie.y,Ie.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=ar(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=rn(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ar(e,this.array)),e}setX(t,e){return this.normalized&&(e=rn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ar(e,this.array)),e}setY(t,e){return this.normalized&&(e=rn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ar(e,this.array)),e}setZ(t,e){return this.normalized&&(e=rn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ar(e,this.array)),e}setW(t,e){return this.normalized&&(e=rn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=rn(e,this.array),i=rn(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=rn(e,this.array),i=rn(i,this.array),s=rn(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=rn(e,this.array),i=rn(i,this.array),s=rn(s,this.array),r=rn(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==gh&&(t.usage=this.usage),t}};var so=class extends Be{constructor(t,e,i){super(new Uint16Array(t),e,i)}};var ro=class extends Be{constructor(t,e,i){super(new Uint32Array(t),e,i)}};var pe=class extends Be{constructor(t,e,i){super(new Float32Array(t),e,i)}},_0=0,An=new ae,ah=new Le,ir=new I,vn=new di,qr=new di,ke=new I,an=class n extends hi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:_0++}),this.uuid=Er(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Oh(t)?ro:so)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new zt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return An.makeRotationFromQuaternion(t),this.applyMatrix4(An),this}rotateX(t){return An.makeRotationX(t),this.applyMatrix4(An),this}rotateY(t){return An.makeRotationY(t),this.applyMatrix4(An),this}rotateZ(t){return An.makeRotationZ(t),this.applyMatrix4(An),this}translate(t,e,i){return An.makeTranslation(t,e,i),this.applyMatrix4(An),this}scale(t,e,i){return An.makeScale(t,e,i),this.applyMatrix4(An),this}lookAt(t){return ah.lookAt(t),ah.updateMatrix(),this.applyMatrix4(ah.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ir).negate(),this.translate(ir.x,ir.y,ir.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let i=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new pe(i,3))}else{let i=Math.min(t.length,e.count);for(let s=0;s<i;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new di);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){let r=e[i];vn.setFromBufferAttribute(r),this.morphTargetsRelative?(ke.addVectors(this.boundingBox.min,vn.min),this.boundingBox.expandByPoint(ke),ke.addVectors(this.boundingBox.max,vn.max),this.boundingBox.expandByPoint(ke)):(this.boundingBox.expandByPoint(vn.min),this.boundingBox.expandByPoint(vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ts);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){let i=this.boundingSphere.center;if(vn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];qr.setFromBufferAttribute(a),this.morphTargetsRelative?(ke.addVectors(vn.min,qr.min),vn.expandByPoint(ke),ke.addVectors(vn.max,qr.max),vn.expandByPoint(ke)):(vn.expandByPoint(qr.min),vn.expandByPoint(qr.max))}vn.getCenter(i);let s=0;for(let r=0,o=t.count;r<o;r++)ke.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(ke));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)ke.fromBufferAttribute(a,c),l&&(ir.fromBufferAttribute(t,c),ke.add(ir)),s=Math.max(s,i.distanceToSquared(ke))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Be(new Float32Array(4*i.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let P=0;P<i.count;P++)a[P]=new I,l[P]=new I;let c=new I,h=new I,u=new I,d=new Tt,p=new Tt,g=new Tt,_=new I,m=new I;function f(P,v,x){c.fromBufferAttribute(i,P),h.fromBufferAttribute(i,v),u.fromBufferAttribute(i,x),d.fromBufferAttribute(r,P),p.fromBufferAttribute(r,v),g.fromBufferAttribute(r,x),h.sub(c),u.sub(c),p.sub(d),g.sub(d);let C=1/(p.x*g.y-g.x*p.y);isFinite(C)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(C),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(C),a[P].add(_),a[v].add(_),a[x].add(_),l[P].add(m),l[v].add(m),l[x].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let P=0,v=S.length;P<v;++P){let x=S[P],C=x.start,D=x.count;for(let k=C,H=C+D;k<H;k+=3)f(t.getX(k+0),t.getX(k+1),t.getX(k+2))}let w=new I,M=new I,T=new I,E=new I;function A(P){T.fromBufferAttribute(s,P),E.copy(T);let v=a[P];w.copy(v),w.sub(T.multiplyScalar(T.dot(v))).normalize(),M.crossVectors(E,v);let C=M.dot(l[P])<0?-1:1;o.setXYZW(P,w.x,w.y,w.z,C)}for(let P=0,v=S.length;P<v;++P){let x=S[P],C=x.start,D=x.count;for(let k=C,H=C+D;k<H;k+=3)A(t.getX(k+0)),A(t.getX(k+1)),A(t.getX(k+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Be(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);let s=new I,r=new I,o=new I,a=new I,l=new I,c=new I,h=new I,u=new I;if(t)for(let d=0,p=t.count;d<p;d+=3){let g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),a.add(h),l.add(h),c.add(h),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=e.count;d<p;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)ke.fromBufferAttribute(t,e),ke.normalize(),t.setXYZ(e,ke.x,ke.y,ke.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),p=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?p=l[_]*a.data.stride+a.offset:p=l[_]*h;for(let f=0;f<h;f++)d[g++]=c[p++]}return new Be(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new n,i=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,i);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],p=t(d,i);l.push(p)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let i=this.attributes;for(let l in i){let c=i[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let p=c[u];h.push(p.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Od=new ae,ys=new Es,ya=new ts,kd=new I,va=new I,Ma=new I,ba=new I,lh=new I,Sa=new I,Bd=new I,wa=new I,q=class extends Le{constructor(t=new an,e=new Ve){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){Sa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(lh.fromBufferAttribute(u,t),o?Sa.addScaledVector(lh,h):Sa.addScaledVector(lh.sub(e),h))}e.add(Sa)}return e}raycast(t,e){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ya.copy(i.boundingSphere),ya.applyMatrix4(r),ys.copy(t.ray).recast(t.near),!(ya.containsPoint(ys.origin)===!1&&(ys.intersectSphere(ya,kd)===null||ys.origin.distanceToSquared(kd)>(t.far-t.near)**2))&&(Od.copy(r).invert(),ys.copy(t.ray).applyMatrix4(Od),!(i.boundingBox!==null&&ys.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,ys)))}_computeIntersections(t,e,i){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let m=d[g],f=o[m.materialIndex],S=Math.max(m.start,p.start),w=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let M=S,T=w;M<T;M+=3){let E=a.getX(M),A=a.getX(M+1),P=a.getX(M+2);s=Ea(this,f,t,i,c,h,u,E,A,P),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let S=a.getX(m),w=a.getX(m+1),M=a.getX(m+2);s=Ea(this,o,t,i,c,h,u,S,w,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let m=d[g],f=o[m.materialIndex],S=Math.max(m.start,p.start),w=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let M=S,T=w;M<T;M+=3){let E=M,A=M+1,P=M+2;s=Ea(this,f,t,i,c,h,u,E,A,P),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let S=m,w=m+1,M=m+2;s=Ea(this,o,t,i,c,h,u,S,w,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function x0(n,t,e,i,s,r,o,a){let l;if(t.side===We?l=i.intersectTriangle(o,r,s,!0,a):l=i.intersectTriangle(s,r,o,t.side===Ri,a),l===null)return null;wa.copy(a),wa.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(wa);return c<e.near||c>e.far?null:{distance:c,point:wa.clone(),object:n}}function Ea(n,t,e,i,s,r,o,a,l,c){n.getVertexPosition(a,va),n.getVertexPosition(l,Ma),n.getVertexPosition(c,ba);let h=x0(n,t,e,i,va,Ma,ba,Bd);if(h){let u=new I;Ji.getBarycoord(Bd,va,Ma,ba,u),s&&(h.uv=Ji.getInterpolatedAttribute(s,a,l,c,u,new Tt)),r&&(h.uv1=Ji.getInterpolatedAttribute(r,a,l,c,u,new Tt)),o&&(h.normal=Ji.getInterpolatedAttribute(o,a,l,c,u,new I),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new I,materialIndex:0};Ji.getNormal(va,Ma,ba,d.normal),h.face=d,h.barycoord=u}return h}var Ge=class n extends an{constructor(t=1,e=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,p=0;g("z","y","x",-1,-1,i,e,t,o,r,0),g("z","y","x",1,-1,i,e,-t,o,r,1),g("x","z","y",1,1,t,i,e,s,o,2),g("x","z","y",1,-1,t,i,-e,s,o,3),g("x","y","z",1,-1,t,e,i,s,r,4),g("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new pe(c,3)),this.setAttribute("normal",new pe(h,3)),this.setAttribute("uv",new pe(u,2));function g(_,m,f,S,w,M,T,E,A,P,v){let x=M/A,C=T/P,D=M/2,k=T/2,H=E/2,Y=A+1,W=P+1,ot=0,G=0,ct=new I;for(let J=0;J<W;J++){let j=J*C-k;for(let mt=0;mt<Y;mt++){let Nt=mt*x-D;ct[_]=Nt*S,ct[m]=j*w,ct[f]=H,c.push(ct.x,ct.y,ct.z),ct[_]=0,ct[m]=0,ct[f]=E>0?1:-1,h.push(ct.x,ct.y,ct.z),u.push(mt/A),u.push(1-J/P),ot+=1}}for(let J=0;J<P;J++)for(let j=0;j<A;j++){let mt=d+j+Y*J,Nt=d+j+Y*(J+1),he=d+(j+1)+Y*(J+1),Jt=d+(j+1)+Y*J;l.push(mt,Nt,Jt),l.push(Nt,he,Jt),G+=6}a.addGroup(p,G,v),p+=G,d+=ot}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Is(n){let t={};for(let e in n){t[e]={};for(let i in n[e]){let s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Qe(n){let t={};for(let e=0;e<n.length;e++){let i=Is(n[e]);for(let s in i)t[s]=i[s]}return t}function y0(n){let t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function kh(n){let t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:jt.workingColorSpace}var Bf={clone:Is,merge:Qe},v0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,M0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Xn=class extends Ci{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=v0,this.fragmentShader=M0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Is(t.uniforms),this.uniformsGroups=y0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}},oo=class extends Le{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ae,this.projectionMatrix=new ae,this.projectionMatrixInverse=new ae,this.coordinateSystem=Wn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ki=new I,zd=new Tt,Hd=new Tt,He=class extends oo{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=ur*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Jr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ur*2*Math.atan(Math.tan(Jr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Ki.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ki.x,Ki.y).multiplyScalar(-t/Ki.z),Ki.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ki.x,Ki.y).multiplyScalar(-t/Ki.z)}getViewSize(t,e){return this.getViewBounds(t,zd,Hd),e.subVectors(Hd,zd)}setViewOffset(t,e,i,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Jr*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},sr=-90,rr=1,Oa=class extends Le{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new He(sr,rr,t,e);s.layers=this.layers,this.add(s);let r=new He(sr,rr,t,e);r.layers=this.layers,this.add(r);let o=new He(sr,rr,t,e);o.layers=this.layers,this.add(o);let a=new He(sr,rr,t,e);a.layers=this.layers,this.add(a);let l=new He(sr,rr,t,e);l.layers=this.layers,this.add(l);let c=new He(sr,rr,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[i,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===Wn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===eo)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,o),t.setRenderTarget(i,2,s),t.render(e,a),t.setRenderTarget(i,3,s),t.render(e,l),t.setRenderTarget(i,4,s),t.render(e,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,d,p),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},ao=class extends on{constructor(t=[],e=Rs,i,s,r,o,a,l,c,h){super(t,e,i,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},ka=class extends ui{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new ao(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Ge(5,5,5),r=new Xn({name:"CubemapFromEquirect",uniforms:Is(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:We,blending:Pi});r.uniforms.tEquirect.value=e;let o=new q(s,r),a=e.minFilter;return e.minFilter===is&&(e.minFilter=$n),new Oa(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(r)}},Yt=class extends Le{constructor(){super(),this.isGroup=!0,this.type="Group"}},b0={type:"move"},mr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Yt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Yt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Yt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,i),f=this._getHandJoint(c,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(b0)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let i=new Yt;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}};var Ts=class extends Le{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new In,this.environmentIntensity=1,this.environmentRotation=new In,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}};var Ba=class extends on{constructor(t=null,e=1,i=1,s,r,o,a,l,c=dn,h=dn,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var gr=class extends Be{constructor(t,e,i,s=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},or=new ae,Vd=new ae,Ta=[],Gd=new di,S0=new ae,Yr=new q,Zr=new ts,lo=class extends q{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new gr(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,S0)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new di),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,or),Gd.copy(t.boundingBox).applyMatrix4(or),this.boundingBox.union(Gd)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ts),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,or),Zr.copy(t.boundingSphere).applyMatrix4(or),this.boundingSphere.union(Zr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let i=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=t*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(t,e){let i=this.matrixWorld,s=this.count;if(Yr.geometry=this.geometry,Yr.material=this.material,Yr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Zr.copy(this.boundingSphere),Zr.applyMatrix4(i),t.ray.intersectsSphere(Zr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,or),Vd.multiplyMatrices(i,or),Yr.matrixWorld=Vd,Yr.raycast(t,Ta);for(let o=0,a=Ta.length;o<a;o++){let l=Ta[o];l.instanceId=r,l.object=this,e.push(l)}Ta.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new gr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){let i=e.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Ba(new Float32Array(s*this.count),s,this.count,pl,Zn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<i.length;c++)o+=i[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;r[l]=a,r.set(i,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},ch=new I,w0=new I,E0=new zt,Rn=class{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){let s=ch.subVectors(i,e).cross(w0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let i=t.delta(ch),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let i=e||E0.getNormalMatrix(t),s=this.coplanarPoint(ch).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},vs=new ts,T0=new Tt(.5,.5),Aa=new I,_r=class{constructor(t=new Rn,e=new Rn,i=new Rn,s=new Rn,r=new Rn,o=new Rn){this.planes=[t,e,i,s,r,o]}set(t,e,i,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Wn,i=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],p=r[7],g=r[8],_=r[9],m=r[10],f=r[11],S=r[12],w=r[13],M=r[14],T=r[15];if(s[0].setComponents(c-o,p-h,f-g,T-S).normalize(),s[1].setComponents(c+o,p+h,f+g,T+S).normalize(),s[2].setComponents(c+a,p+u,f+_,T+w).normalize(),s[3].setComponents(c-a,p-u,f-_,T-w).normalize(),i)s[4].setComponents(l,d,m,M).normalize(),s[5].setComponents(c-l,p-d,f-m,T-M).normalize();else if(s[4].setComponents(c-l,p-d,f-m,T-M).normalize(),e===Wn)s[5].setComponents(c+l,p+d,f+m,T+M).normalize();else if(e===eo)s[5].setComponents(l,d,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),vs.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),vs.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(vs)}intersectsSprite(t){vs.center.set(0,0,0);let e=T0.distanceTo(t.center);return vs.radius=.7071067811865476+e,vs.applyMatrix4(t.matrixWorld),this.intersectsSphere(vs)}intersectsSphere(t){let e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let i=0;i<6;i++){let s=e[i];if(Aa.x=s.normal.x>0?t.max.x:t.min.x,Aa.y=s.normal.y>0?t.max.y:t.min.y,Aa.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Aa)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Ii=class extends on{constructor(t,e,i,s,r,o,a,l,c){super(t,e,i,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},co=class extends on{constructor(t,e,i=ss,s,r,o,a=dn,l=dn,c,h=hr,u=1){if(h!==hr&&h!==wr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:t,height:e,depth:u};super(d,s,r,o,a,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new fr(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},ho=class extends on{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}};var xr=class n extends an{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);let r=[],o=[],a=[],l=[],c=new I,h=new Tt;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){let p=i+u/e*s;c.x=t*Math.cos(p),c.y=t*Math.sin(p),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new pe(o,3)),this.setAttribute("normal",new pe(a,3)),this.setAttribute("uv",new pe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.segments,t.thetaStart,t.thetaLength)}},_e=class n extends an{constructor(t=1,e=1,i=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],p=[],g=0,_=[],m=i/2,f=0;S(),o===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new pe(u,3)),this.setAttribute("normal",new pe(d,3)),this.setAttribute("uv",new pe(p,2));function S(){let M=new I,T=new I,E=0,A=(e-t)/i;for(let P=0;P<=r;P++){let v=[],x=P/r,C=x*(e-t)+t;for(let D=0;D<=s;D++){let k=D/s,H=k*l+a,Y=Math.sin(H),W=Math.cos(H);T.x=C*Y,T.y=-x*i+m,T.z=C*W,u.push(T.x,T.y,T.z),M.set(Y,A,W).normalize(),d.push(M.x,M.y,M.z),p.push(k,1-x),v.push(g++)}_.push(v)}for(let P=0;P<s;P++)for(let v=0;v<r;v++){let x=_[v][P],C=_[v+1][P],D=_[v+1][P+1],k=_[v][P+1];(t>0||v!==0)&&(h.push(x,C,k),E+=3),(e>0||v!==r-1)&&(h.push(C,D,k),E+=3)}c.addGroup(f,E,0),f+=E}function w(M){let T=g,E=new Tt,A=new I,P=0,v=M===!0?t:e,x=M===!0?1:-1;for(let D=1;D<=s;D++)u.push(0,m*x,0),d.push(0,x,0),p.push(.5,.5),g++;let C=g;for(let D=0;D<=s;D++){let H=D/s*l+a,Y=Math.cos(H),W=Math.sin(H);A.x=v*W,A.y=m*x,A.z=v*Y,u.push(A.x,A.y,A.z),d.push(0,x,0),E.x=Y*.5+.5,E.y=W*.5*x+.5,p.push(E.x,E.y),g++}for(let D=0;D<s;D++){let k=T+D,H=C+D;M===!0?h.push(H,H+1,k):h.push(H+1,H,k),P+=3}c.addGroup(f,P,M===!0?1:2),f+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var uo=class n extends an{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};let r=[],o=[];a(s),c(i),h(),this.setAttribute("position",new pe(r,3)),this.setAttribute("normal",new pe(r.slice(),3)),this.setAttribute("uv",new pe(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(S){let w=new I,M=new I,T=new I;for(let E=0;E<e.length;E+=3)p(e[E+0],w),p(e[E+1],M),p(e[E+2],T),l(w,M,T,S)}function l(S,w,M,T){let E=T+1,A=[];for(let P=0;P<=E;P++){A[P]=[];let v=S.clone().lerp(M,P/E),x=w.clone().lerp(M,P/E),C=E-P;for(let D=0;D<=C;D++)D===0&&P===E?A[P][D]=v:A[P][D]=v.clone().lerp(x,D/C)}for(let P=0;P<E;P++)for(let v=0;v<2*(E-P)-1;v++){let x=Math.floor(v/2);v%2===0?(d(A[P][x+1]),d(A[P+1][x]),d(A[P][x])):(d(A[P][x+1]),d(A[P+1][x+1]),d(A[P+1][x]))}}function c(S){let w=new I;for(let M=0;M<r.length;M+=3)w.x=r[M+0],w.y=r[M+1],w.z=r[M+2],w.normalize().multiplyScalar(S),r[M+0]=w.x,r[M+1]=w.y,r[M+2]=w.z}function h(){let S=new I;for(let w=0;w<r.length;w+=3){S.x=r[w+0],S.y=r[w+1],S.z=r[w+2];let M=m(S)/2/Math.PI+.5,T=f(S)/Math.PI+.5;o.push(M,1-T)}g(),u()}function u(){for(let S=0;S<o.length;S+=6){let w=o[S+0],M=o[S+2],T=o[S+4],E=Math.max(w,M,T),A=Math.min(w,M,T);E>.9&&A<.1&&(w<.2&&(o[S+0]+=1),M<.2&&(o[S+2]+=1),T<.2&&(o[S+4]+=1))}}function d(S){r.push(S.x,S.y,S.z)}function p(S,w){let M=S*3;w.x=t[M+0],w.y=t[M+1],w.z=t[M+2]}function g(){let S=new I,w=new I,M=new I,T=new I,E=new Tt,A=new Tt,P=new Tt;for(let v=0,x=0;v<r.length;v+=9,x+=6){S.set(r[v+0],r[v+1],r[v+2]),w.set(r[v+3],r[v+4],r[v+5]),M.set(r[v+6],r[v+7],r[v+8]),E.set(o[x+0],o[x+1]),A.set(o[x+2],o[x+3]),P.set(o[x+4],o[x+5]),T.copy(S).add(w).add(M).divideScalar(3);let C=m(T);_(E,x+0,S,C),_(A,x+2,w,C),_(P,x+4,M,C)}}function _(S,w,M,T){T<0&&S.x===1&&(o[w]=S.x-1),M.x===0&&M.z===0&&(o[w]=T/2/Math.PI+.5)}function m(S){return Math.atan2(S.z,-S.x)}function f(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.vertices,t.indices,t.radius,t.details)}};var fo=class n extends uo{constructor(t=1,e=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new n(t.radius,t.detail)}};var po=class n extends uo{constructor(t=1,e=0){let i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new n(t.radius,t.detail)}},ln=class n extends an{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(i),l=Math.floor(s),c=a+1,h=l+1,u=t/a,d=e/l,p=[],g=[],_=[],m=[];for(let f=0;f<h;f++){let S=f*d-o;for(let w=0;w<c;w++){let M=w*u-r;g.push(M,-S,0),_.push(0,0,1),m.push(w/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let S=0;S<a;S++){let w=S+c*f,M=S+c*(f+1),T=S+1+c*(f+1),E=S+1+c*f;p.push(w,M,E),p.push(M,T,E)}this.setIndex(p),this.setAttribute("position",new pe(g,3)),this.setAttribute("normal",new pe(_,3)),this.setAttribute("uv",new pe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.widthSegments,t.heightSegments)}},mo=class n extends an{constructor(t=.5,e=1,i=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);let a=[],l=[],c=[],h=[],u=t,d=(e-t)/s,p=new I,g=new Tt;for(let _=0;_<=s;_++){for(let m=0;m<=i;m++){let f=r+m/i*o;p.x=u*Math.cos(f),p.y=u*Math.sin(f),l.push(p.x,p.y,p.z),c.push(0,0,1),g.x=(p.x/e+1)/2,g.y=(p.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let _=0;_<s;_++){let m=_*(i+1);for(let f=0;f<i;f++){let S=f+m,w=S,M=S+i+1,T=S+i+2,E=S+1;a.push(w,M,E),a.push(M,T,E)}}this.setIndex(a),this.setAttribute("position",new pe(l,3)),this.setAttribute("normal",new pe(c,3)),this.setAttribute("uv",new pe(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}};var fi=class n extends an{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new I,d=new I,p=[],g=[],_=[],m=[];for(let f=0;f<=i;f++){let S=[],w=f/i,M=0;f===0&&o===0?M=.5/e:f===i&&l===Math.PI&&(M=-.5/e);for(let T=0;T<=e;T++){let E=T/e;u.x=-t*Math.cos(s+E*r)*Math.sin(o+w*a),u.y=t*Math.cos(o+w*a),u.z=t*Math.sin(s+E*r)*Math.sin(o+w*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(E+M,1-w),S.push(c++)}h.push(S)}for(let f=0;f<i;f++)for(let S=0;S<e;S++){let w=h[f][S+1],M=h[f][S],T=h[f+1][S],E=h[f+1][S+1];(f!==0||o>0)&&p.push(w,M,E),(f!==i-1||l<Math.PI)&&p.push(M,T,E)}this.setIndex(p),this.setAttribute("position",new pe(g,3)),this.setAttribute("normal",new pe(_,3)),this.setAttribute("uv",new pe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Me=class extends Ci{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Gt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Gt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Xl,this.normalScale=new Tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new In,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var go=class extends Ci{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Gt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Gt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Xl,this.normalScale=new Tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new In,this.combine=al,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},za=class extends Ci{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Tf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Ha=class extends Ci{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Ra(n,t){return!n||n.constructor===t?n:typeof t.BYTES_PER_ELEMENT=="number"?new t(n):Array.prototype.slice.call(n)}function A0(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var As=class{constructor(t,e,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,i=this._cachedIndex,s=e[i],r=e[i-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=i+2;;){if(s===void 0){if(t<r)break i;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=e[++i],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(i=2,r=a);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=e[--i-1],t>=r)break t}o=i,i=0;break e}break n}for(;i<o;){let a=i+o>>>1;t<e[a]?o=a:i=a+1}if(s=e[i],r=e[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=i[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Va=class extends As{constructor(t,e,i,s){super(t,e,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:dh,endingEnd:dh}}intervalChanged_(t,e,i){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case fh:r=t,a=2*e-i;break;case ph:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case fh:o=t,l=2*i-e;break;case ph:o=1,l=i+s[1]-s[0];break;default:o=t-1,l=e}let c=(i-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(i-e)/(s-e),_=g*g,m=_*g,f=-d*m+2*d*_-d*g,S=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,w=(-1-p)*m+(1.5+p)*_+.5*g,M=p*m-p*_;for(let T=0;T!==a;++T)r[T]=f*o[h+T]+S*o[c+T]+w*o[l+T]+M*o[u+T];return r}},Ga=class extends As{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(i-e)/(s-e),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},Wa=class extends As{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Mn=class{constructor(t,e,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Ra(e,this.TimeBufferType),this.values=Ra(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:Ra(t.times,Array),values:Ra(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s)}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new Wa(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Ga(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Va(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Qr:e=this.InterpolantFactoryMethodDiscrete;break;case Da:e=this.InterpolantFactoryMethodLinear;break;case Ca:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Qr;case this.InterpolantFactoryMethodLinear:return Da;case this.InterpolantFactoryMethodSmooth:return Ca}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]*=t}return this}trim(t,e){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<t;)++r;for(;o!==-1&&i[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&A0(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Ca,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let u=a*i,d=u-i,p=u+i;for(let g=0;g!==i;++g){let _=e[u+g];if(_!==e[d+g]||_!==e[p+g]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let u=a*i,d=o*i;for(let p=0;p!==i;++p)e[d+p]=e[u+p]}++o}}if(r>0){t[o]=t[r];for(let a=r*i,l=o*i,c=0;c!==i;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*i)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),i=this.constructor,s=new i(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};Mn.prototype.ValueTypeName="";Mn.prototype.TimeBufferType=Float32Array;Mn.prototype.ValueBufferType=Float32Array;Mn.prototype.DefaultInterpolation=Da;var es=class extends Mn{constructor(t,e,i){super(t,e,i)}};es.prototype.ValueTypeName="bool";es.prototype.ValueBufferType=Array;es.prototype.DefaultInterpolation=Qr;es.prototype.InterpolantFactoryMethodLinear=void 0;es.prototype.InterpolantFactoryMethodSmooth=void 0;var $a=class extends Mn{constructor(t,e,i,s){super(t,e,i,s)}};$a.prototype.ValueTypeName="color";var Xa=class extends Mn{constructor(t,e,i,s){super(t,e,i,s)}};Xa.prototype.ValueTypeName="number";var qa=class extends As{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)Cn.slerpFlat(r,0,o,c-a,o,c,l);return r}},_o=class extends Mn{constructor(t,e,i,s){super(t,e,i,s)}InterpolantFactoryMethodLinear(t){return new qa(this.times,this.values,this.getValueSize(),t)}};_o.prototype.ValueTypeName="quaternion";_o.prototype.InterpolantFactoryMethodSmooth=void 0;var ns=class extends Mn{constructor(t,e,i){super(t,e,i)}};ns.prototype.ValueTypeName="string";ns.prototype.ValueBufferType=Array;ns.prototype.DefaultInterpolation=Qr;ns.prototype.InterpolantFactoryMethodLinear=void 0;ns.prototype.InterpolantFactoryMethodSmooth=void 0;var Ya=class extends Mn{constructor(t,e,i,s){super(t,e,i,s)}};Ya.prototype.ValueTypeName="vector";var Za=class{constructor(t,e,i){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let p=c[u],g=c[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},zf=new Za,Ka=class{constructor(t){this.manager=t!==void 0?t:zf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let i=this;return new Promise(function(s,r){i.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};Ka.DEFAULT_MATERIAL_NAME="__DEFAULT";var yr=class extends Le{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Gt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},xo=class extends yr{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Le.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Gt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},hh=new ae,Wd=new I,$d=new I,Ja=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Tt(512,512),this.mapType=Yn,this.map=null,this.mapPass=null,this.matrix=new ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new _r,this._frameExtents=new Tt(1,1),this._viewportCount=1,this._viewports=[new re(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,i=this.matrix;Wd.setFromMatrixPosition(t.matrixWorld),e.position.copy(Wd),$d.setFromMatrixPosition(t.target.matrixWorld),e.lookAt($d),e.updateMatrixWorld(),hh.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(hh,e.coordinateSystem,e.reversedDepth),e.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(hh)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var Xd=new ae,Kr=new I,uh=new I,_h=class extends Ja{constructor(){super(new He(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Tt(4,2),this._viewportCount=6,this._viewports=[new re(2,1,1,1),new re(0,1,1,1),new re(3,1,1,1),new re(1,1,1,1),new re(3,0,1,1),new re(1,0,1,1)],this._cubeDirections=[new I(1,0,0),new I(-1,0,0),new I(0,0,1),new I(0,0,-1),new I(0,1,0),new I(0,-1,0)],this._cubeUps=[new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,0,1),new I(0,0,-1)]}updateMatrices(t,e=0){let i=this.camera,s=this.matrix,r=t.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),Kr.setFromMatrixPosition(t.matrixWorld),i.position.copy(Kr),uh.copy(i.position),uh.add(this._cubeDirections[e]),i.up.copy(this._cubeUps[e]),i.lookAt(uh),i.updateMatrixWorld(),s.makeTranslation(-Kr.x,-Kr.y,-Kr.z),Xd.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Xd,i.coordinateSystem,i.reversedDepth)}},yo=class extends yr{constructor(t,e,i=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new _h}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},vo=class extends oo{constructor(t=-1,e=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-t,o=i+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},xh=class extends Ja{constructor(){super(new vo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Mo=class extends yr{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Le.DEFAULT_UP),this.updateMatrix(),this.target=new Le,this.shadow=new xh}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var ja=class extends He{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Bh="\\[\\]\\.:\\/",R0=new RegExp("["+Bh+"]","g"),zh="[^"+Bh+"]",C0="[^"+Bh.replace("\\.","")+"]",I0=/((?:WC+[\/:])*)/.source.replace("WC",zh),P0=/(WCOD+)?/.source.replace("WCOD",C0),L0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",zh),D0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",zh),U0=new RegExp("^"+I0+P0+L0+D0+"$"),N0=["material","materials","bones","map"],yh=class{constructor(t,e,i){let s=i||ge.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,e)}setValue(t,e){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}},ge=class n{constructor(t,e,i){this.path=e,this.parsedPath=i||n.parseTrackName(e),this.node=n.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new n.Composite(t,e,i):new n(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(R0,"")}static parseTrackName(t){let e=U0.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);N0.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=i(a.children);if(l)return l}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)t[e++]=i[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,i=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=n.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=e.objectIndex;switch(i){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ge.Composite=yh;ge.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ge.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ge.prototype.GetterByBindingType=[ge.prototype._getValue_direct,ge.prototype._getValue_array,ge.prototype._getValue_arrayElement,ge.prototype._getValue_toArray];ge.prototype.SetterByBindingTypeAndVersioning=[[ge.prototype._setValue_direct,ge.prototype._setValue_direct_setNeedsUpdate,ge.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ge.prototype._setValue_array,ge.prototype._setValue_array_setNeedsUpdate,ge.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ge.prototype._setValue_arrayElement,ge.prototype._setValue_arrayElement_setNeedsUpdate,ge.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ge.prototype._setValue_fromArray,ge.prototype._setValue_fromArray_setNeedsUpdate,ge.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var FS=new Float32Array(1);var qd=new ae,bo=class{constructor(t,e,i=0,s=1/0){this.ray=new Es(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new pr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return qd.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(qd),this}intersectObject(t,e=!0,i=[]){return vh(t,this,i,e),i.sort(Yd),i}intersectObjects(t,e=!0,i=[]){for(let s=0,r=t.length;s<r;s++)vh(t[s],this,i,e);return i.sort(Yd),i}};function Yd(n,t){return n.distance-t.distance}function vh(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){let r=n.children;for(let o=0,a=r.length;o<a;o++)vh(r[o],t,e,!0)}}var vr=class{constructor(t=1,e=0,i=0){this.radius=t,this.phi=e,this.theta=i}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Xt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(Xt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var So=class extends hi{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function Hh(n,t,e,i){let s=F0(i);switch(e){case Ph:return n*t;case pl:return n*t/s.components*s.byteLength;case ml:return n*t/s.components*s.byteLength;case Dh:return n*t*2/s.components*s.byteLength;case gl:return n*t*2/s.components*s.byteLength;case Lh:return n*t*3/s.components*s.byteLength;case Ln:return n*t*4/s.components*s.byteLength;case _l:return n*t*4/s.components*s.byteLength;case To:case Ao:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Ro:case Co:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case yl:case Ml:return Math.max(n,16)*Math.max(t,8)/4;case xl:case vl:return Math.max(n,8)*Math.max(t,8)/2;case bl:case Sl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case wl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case El:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Tl:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Al:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Rl:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Cl:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Il:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Pl:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Ll:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Dl:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Ul:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Nl:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Fl:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Ol:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case kl:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Bl:case zl:case Hl:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Vl:case Gl:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Wl:case $l:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function F0(n){switch(n){case Yn:case Ah:return{byteLength:1,components:1};case Mr:case Rh:case br:return{byteLength:2,components:1};case dl:case fl:return{byteLength:2,components:4};case ss:case ul:case Zn:return{byteLength:4,components:1};case Ch:case Ih:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function hp(){let n=null,t=!1,e=null,i=null;function s(r,o){e(r,o),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function G0(n){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),a.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function i(a,l,c){let h=l.array,u=l.updateRanges;if(n.bindBuffer(c,a),u.length===0)n.bufferSubData(c,0,h);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){let g=u[d],_=u[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){let _=u[p];n.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(n.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var W0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,$0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,X0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,q0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Y0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Z0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,K0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,J0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,j0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Q0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,t_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,e_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,n_=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,i_=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,s_=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,r_=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,o_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,a_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,l_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,c_=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,h_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,u_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,d_=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,f_=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,p_=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,m_=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,g_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,__=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,x_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,y_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,v_="gl_FragColor = linearToOutputTexel( gl_FragColor );",M_=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,b_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,S_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,w_=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,E_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,T_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,A_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,R_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,C_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,I_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,P_=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,L_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,D_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,U_=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,N_=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,F_=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,O_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,k_=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,B_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,z_=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,H_=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,V_=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,G_=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,W_=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,$_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,X_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,q_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Y_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Z_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,K_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,J_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,j_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Q_=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ex=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,nx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ix=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,sx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rx=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,ox=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ax=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,lx=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,cx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ux=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,dx=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,fx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,px=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,mx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,gx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,_x=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,yx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,vx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Mx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,bx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Sx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,wx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ex=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Tx=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ax=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Rx=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Cx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ix=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Px=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Lx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Dx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ux=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Nx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Fx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ox=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,kx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Bx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,zx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Hx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Vx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Gx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Wx=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$x=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xx=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Kx=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Jx=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,jx=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Qx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ty=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ey=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ny=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,iy=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,sy=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ry=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,oy=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ay=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ly=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cy=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,hy=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,uy=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dy=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fy=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,py=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,my=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gy=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_y=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,xy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,yy=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vy=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,My=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,by=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$t={alphahash_fragment:W0,alphahash_pars_fragment:$0,alphamap_fragment:X0,alphamap_pars_fragment:q0,alphatest_fragment:Y0,alphatest_pars_fragment:Z0,aomap_fragment:K0,aomap_pars_fragment:J0,batching_pars_vertex:j0,batching_vertex:Q0,begin_vertex:t_,beginnormal_vertex:e_,bsdfs:n_,iridescence_fragment:i_,bumpmap_pars_fragment:s_,clipping_planes_fragment:r_,clipping_planes_pars_fragment:o_,clipping_planes_pars_vertex:a_,clipping_planes_vertex:l_,color_fragment:c_,color_pars_fragment:h_,color_pars_vertex:u_,color_vertex:d_,common:f_,cube_uv_reflection_fragment:p_,defaultnormal_vertex:m_,displacementmap_pars_vertex:g_,displacementmap_vertex:__,emissivemap_fragment:x_,emissivemap_pars_fragment:y_,colorspace_fragment:v_,colorspace_pars_fragment:M_,envmap_fragment:b_,envmap_common_pars_fragment:S_,envmap_pars_fragment:w_,envmap_pars_vertex:E_,envmap_physical_pars_fragment:F_,envmap_vertex:T_,fog_vertex:A_,fog_pars_vertex:R_,fog_fragment:C_,fog_pars_fragment:I_,gradientmap_pars_fragment:P_,lightmap_pars_fragment:L_,lights_lambert_fragment:D_,lights_lambert_pars_fragment:U_,lights_pars_begin:N_,lights_toon_fragment:O_,lights_toon_pars_fragment:k_,lights_phong_fragment:B_,lights_phong_pars_fragment:z_,lights_physical_fragment:H_,lights_physical_pars_fragment:V_,lights_fragment_begin:G_,lights_fragment_maps:W_,lights_fragment_end:$_,logdepthbuf_fragment:X_,logdepthbuf_pars_fragment:q_,logdepthbuf_pars_vertex:Y_,logdepthbuf_vertex:Z_,map_fragment:K_,map_pars_fragment:J_,map_particle_fragment:j_,map_particle_pars_fragment:Q_,metalnessmap_fragment:tx,metalnessmap_pars_fragment:ex,morphinstance_vertex:nx,morphcolor_vertex:ix,morphnormal_vertex:sx,morphtarget_pars_vertex:rx,morphtarget_vertex:ox,normal_fragment_begin:ax,normal_fragment_maps:lx,normal_pars_fragment:cx,normal_pars_vertex:hx,normal_vertex:ux,normalmap_pars_fragment:dx,clearcoat_normal_fragment_begin:fx,clearcoat_normal_fragment_maps:px,clearcoat_pars_fragment:mx,iridescence_pars_fragment:gx,opaque_fragment:_x,packing:xx,premultiplied_alpha_fragment:yx,project_vertex:vx,dithering_fragment:Mx,dithering_pars_fragment:bx,roughnessmap_fragment:Sx,roughnessmap_pars_fragment:wx,shadowmap_pars_fragment:Ex,shadowmap_pars_vertex:Tx,shadowmap_vertex:Ax,shadowmask_pars_fragment:Rx,skinbase_vertex:Cx,skinning_pars_vertex:Ix,skinning_vertex:Px,skinnormal_vertex:Lx,specularmap_fragment:Dx,specularmap_pars_fragment:Ux,tonemapping_fragment:Nx,tonemapping_pars_fragment:Fx,transmission_fragment:Ox,transmission_pars_fragment:kx,uv_pars_fragment:Bx,uv_pars_vertex:zx,uv_vertex:Hx,worldpos_vertex:Vx,background_vert:Gx,background_frag:Wx,backgroundCube_vert:$x,backgroundCube_frag:Xx,cube_vert:qx,cube_frag:Yx,depth_vert:Zx,depth_frag:Kx,distanceRGBA_vert:Jx,distanceRGBA_frag:jx,equirect_vert:Qx,equirect_frag:ty,linedashed_vert:ey,linedashed_frag:ny,meshbasic_vert:iy,meshbasic_frag:sy,meshlambert_vert:ry,meshlambert_frag:oy,meshmatcap_vert:ay,meshmatcap_frag:ly,meshnormal_vert:cy,meshnormal_frag:hy,meshphong_vert:uy,meshphong_frag:dy,meshphysical_vert:fy,meshphysical_frag:py,meshtoon_vert:my,meshtoon_frag:gy,points_vert:_y,points_frag:xy,shadow_vert:yy,shadow_frag:vy,sprite_vert:My,sprite_frag:by},ht={common:{diffuse:{value:new Gt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new zt}},envmap:{envMap:{value:null},envMapRotation:{value:new zt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new zt},normalScale:{value:new Tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Gt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Gt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0},uvTransform:{value:new zt}},sprite:{diffuse:{value:new Gt(16777215)},opacity:{value:1},center:{value:new Tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}}},mi={basic:{uniforms:Qe([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:Qe([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new Gt(0)}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:Qe([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new Gt(0)},specular:{value:new Gt(1118481)},shininess:{value:30}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:Qe([ht.common,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.roughnessmap,ht.metalnessmap,ht.fog,ht.lights,{emissive:{value:new Gt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:Qe([ht.common,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.gradientmap,ht.fog,ht.lights,{emissive:{value:new Gt(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:Qe([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:Qe([ht.points,ht.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:Qe([ht.common,ht.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:Qe([ht.common,ht.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:Qe([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:Qe([ht.sprite,ht.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new zt}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distanceRGBA:{uniforms:Qe([ht.common,ht.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distanceRGBA_vert,fragmentShader:$t.distanceRGBA_frag},shadow:{uniforms:Qe([ht.lights,ht.fog,{color:{value:new Gt(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};mi.physical={uniforms:Qe([mi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new zt},clearcoatNormalScale:{value:new Tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new zt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new zt},sheen:{value:0},sheenColor:{value:new Gt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new zt},transmissionSamplerSize:{value:new Tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new zt},attenuationDistance:{value:0},attenuationColor:{value:new Gt(0)},specularColor:{value:new Gt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new zt},anisotropyVector:{value:new Tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new zt}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};var ql={r:0,b:0,g:0},Ps=new In,Sy=new ae;function wy(n,t,e,i,s,r,o){let a=new Gt(0),l=r===!0?0:1,c,h,u=null,d=0,p=null;function g(w){let M=w.isScene===!0?w.background:null;return M&&M.isTexture&&(M=(w.backgroundBlurriness>0?e:t).get(M)),M}function _(w){let M=!1,T=g(w);T===null?f(a,l):T&&T.isColor&&(f(T,1),M=!0);let E=n.xr.getEnvironmentBlendMode();E==="additive"?i.buffers.color.setClear(0,0,0,1,o):E==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||M)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(w,M){let T=g(M);T&&(T.isCubeTexture||T.mapping===wo)?(h===void 0&&(h=new q(new Ge(1,1,1),new Xn({name:"BackgroundCubeMaterial",uniforms:Is(mi.backgroundCube.uniforms),vertexShader:mi.backgroundCube.vertexShader,fragmentShader:mi.backgroundCube.fragmentShader,side:We,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,A,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Ps.copy(M.backgroundRotation),Ps.x*=-1,Ps.y*=-1,Ps.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Ps.y*=-1,Ps.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Sy.makeRotationFromEuler(Ps)),h.material.toneMapped=jt.getTransfer(T.colorSpace)!==oe,(u!==T||d!==T.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=T,d=T.version,p=n.toneMapping),h.layers.enableAll(),w.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new q(new ln(2,2),new Xn({name:"BackgroundMaterial",uniforms:Is(mi.background.uniforms),vertexShader:mi.background.vertexShader,fragmentShader:mi.background.fragmentShader,side:Ri,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=jt.getTransfer(T.colorSpace)!==oe,T.matrixAutoUpdate===!0&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(u!==T||d!==T.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,u=T,d=T.version,p=n.toneMapping),c.layers.enableAll(),w.unshift(c,c.geometry,c.material,0,0,null))}function f(w,M){w.getRGB(ql,kh(n)),i.buffers.color.setClear(ql.r,ql.g,ql.b,M,o)}function S(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(w,M=1){a.set(w),l=M,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(w){l=w,f(a,l)},render:_,addToRenderList:m,dispose:S}}function Ey(n,t){let e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null),r=s,o=!1;function a(x,C,D,k,H){let Y=!1,W=u(k,D,C);r!==W&&(r=W,c(r.object)),Y=p(x,k,D,H),Y&&g(x,k,D,H),H!==null&&t.update(H,n.ELEMENT_ARRAY_BUFFER),(Y||o)&&(o=!1,M(x,C,D,k),H!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(H).buffer))}function l(){return n.createVertexArray()}function c(x){return n.bindVertexArray(x)}function h(x){return n.deleteVertexArray(x)}function u(x,C,D){let k=D.wireframe===!0,H=i[x.id];H===void 0&&(H={},i[x.id]=H);let Y=H[C.id];Y===void 0&&(Y={},H[C.id]=Y);let W=Y[k];return W===void 0&&(W=d(l()),Y[k]=W),W}function d(x){let C=[],D=[],k=[];for(let H=0;H<e;H++)C[H]=0,D[H]=0,k[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:D,attributeDivisors:k,object:x,attributes:{},index:null}}function p(x,C,D,k){let H=r.attributes,Y=C.attributes,W=0,ot=D.getAttributes();for(let G in ot)if(ot[G].location>=0){let J=H[G],j=Y[G];if(j===void 0&&(G==="instanceMatrix"&&x.instanceMatrix&&(j=x.instanceMatrix),G==="instanceColor"&&x.instanceColor&&(j=x.instanceColor)),J===void 0||J.attribute!==j||j&&J.data!==j.data)return!0;W++}return r.attributesNum!==W||r.index!==k}function g(x,C,D,k){let H={},Y=C.attributes,W=0,ot=D.getAttributes();for(let G in ot)if(ot[G].location>=0){let J=Y[G];J===void 0&&(G==="instanceMatrix"&&x.instanceMatrix&&(J=x.instanceMatrix),G==="instanceColor"&&x.instanceColor&&(J=x.instanceColor));let j={};j.attribute=J,J&&J.data&&(j.data=J.data),H[G]=j,W++}r.attributes=H,r.attributesNum=W,r.index=k}function _(){let x=r.newAttributes;for(let C=0,D=x.length;C<D;C++)x[C]=0}function m(x){f(x,0)}function f(x,C){let D=r.newAttributes,k=r.enabledAttributes,H=r.attributeDivisors;D[x]=1,k[x]===0&&(n.enableVertexAttribArray(x),k[x]=1),H[x]!==C&&(n.vertexAttribDivisor(x,C),H[x]=C)}function S(){let x=r.newAttributes,C=r.enabledAttributes;for(let D=0,k=C.length;D<k;D++)C[D]!==x[D]&&(n.disableVertexAttribArray(D),C[D]=0)}function w(x,C,D,k,H,Y,W){W===!0?n.vertexAttribIPointer(x,C,D,H,Y):n.vertexAttribPointer(x,C,D,k,H,Y)}function M(x,C,D,k){_();let H=k.attributes,Y=D.getAttributes(),W=C.defaultAttributeValues;for(let ot in Y){let G=Y[ot];if(G.location>=0){let ct=H[ot];if(ct===void 0&&(ot==="instanceMatrix"&&x.instanceMatrix&&(ct=x.instanceMatrix),ot==="instanceColor"&&x.instanceColor&&(ct=x.instanceColor)),ct!==void 0){let J=ct.normalized,j=ct.itemSize,mt=t.get(ct);if(mt===void 0)continue;let Nt=mt.buffer,he=mt.type,Jt=mt.bytesPerElement,Z=he===n.INT||he===n.UNSIGNED_INT||ct.gpuType===ul;if(ct.isInterleavedBufferAttribute){let tt=ct.data,_t=tt.stride,Ft=ct.offset;if(tt.isInstancedInterleavedBuffer){for(let At=0;At<G.locationSize;At++)f(G.location+At,tt.meshPerAttribute);x.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let At=0;At<G.locationSize;At++)m(G.location+At);n.bindBuffer(n.ARRAY_BUFFER,Nt);for(let At=0;At<G.locationSize;At++)w(G.location+At,j/G.locationSize,he,J,_t*Jt,(Ft+j/G.locationSize*At)*Jt,Z)}else{if(ct.isInstancedBufferAttribute){for(let tt=0;tt<G.locationSize;tt++)f(G.location+tt,ct.meshPerAttribute);x.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let tt=0;tt<G.locationSize;tt++)m(G.location+tt);n.bindBuffer(n.ARRAY_BUFFER,Nt);for(let tt=0;tt<G.locationSize;tt++)w(G.location+tt,j/G.locationSize,he,J,j*Jt,j/G.locationSize*tt*Jt,Z)}}else if(W!==void 0){let J=W[ot];if(J!==void 0)switch(J.length){case 2:n.vertexAttrib2fv(G.location,J);break;case 3:n.vertexAttrib3fv(G.location,J);break;case 4:n.vertexAttrib4fv(G.location,J);break;default:n.vertexAttrib1fv(G.location,J)}}}}S()}function T(){P();for(let x in i){let C=i[x];for(let D in C){let k=C[D];for(let H in k)h(k[H].object),delete k[H];delete C[D]}delete i[x]}}function E(x){if(i[x.id]===void 0)return;let C=i[x.id];for(let D in C){let k=C[D];for(let H in k)h(k[H].object),delete k[H];delete C[D]}delete i[x.id]}function A(x){for(let C in i){let D=i[C];if(D[x.id]===void 0)continue;let k=D[x.id];for(let H in k)h(k[H].object),delete k[H];delete D[x.id]}}function P(){v(),o=!0,r!==s&&(r=s,c(r.object))}function v(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:v,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:S}}function Ty(n,t,e){let i;function s(c){i=c}function r(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function o(c,h,u){u!==0&&(n.drawArraysInstanced(i,c,h,u),e.update(h,i,u))}function a(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];e.update(p,i,1)}function l(c,h,u,d){if(u===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];e.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Ay(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let A=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==Ln&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){let P=A===br&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Yn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Zn&&!P)}function l(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),S=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),w=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),T=g>0,E=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:S,maxVaryings:w,maxFragmentUniforms:M,vertexTextures:T,maxSamples:E}}function Ry(n){let t=this,e=null,i=0,s=!1,r=!1,o=new Rn,a=new zt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let p=u.length!==0||d||i!==0||s;return s=d,i=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,p){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,f=n.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{let S=r?0:i,w=S*4,M=f.clippingState||null;l.value=M,M=h(g,d,w,p);for(let T=0;T!==w;++T)M[T]=e[T];f.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,p,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=l.value,g!==!0||m===null){let f=p+_*4,S=d.matrixWorldInverse;a.getNormalMatrix(S),(m===null||m.length<f)&&(m=new Float32Array(f));for(let w=0,M=p;w!==_;++w,M+=4)o.copy(u[w]).applyMatrix4(S,a),o.normal.toArray(m,M),m[M+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Cy(n){let t=new WeakMap;function e(o,a){return a===ll?o.mapping=Rs:a===cl&&(o.mapping=Cs),o}function i(o){if(o&&o.isTexture){let a=o.mapping;if(a===ll||a===cl)if(t.has(o)){let l=t.get(o).texture;return e(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new ka(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}var Ar=4,Hf=[.125,.215,.35,.446,.526,.582],Us=20,Vh=new vo,Vf=new Gt,Gh=null,Wh=0,$h=0,Xh=!1,Ds=(1+Math.sqrt(5))/2,Tr=1/Ds,Gf=[new I(-Ds,Tr,0),new I(Ds,Tr,0),new I(-Tr,0,Ds),new I(Tr,0,Ds),new I(0,Ds,-Tr),new I(0,Ds,Tr),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)],Iy=new I,Cr=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100,r={}){let{size:o=256,position:a=Iy}=r;Gh=this._renderer.getRenderTarget(),Wh=this._renderer.getActiveCubeFace(),$h=this._renderer.getActiveMipmapLevel(),Xh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=$f(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Gh,Wh,$h),this._renderer.xr.enabled=Xh,t.scissorTest=!1,Yl(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Rs||t.mapping===Cs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Gh=this._renderer.getRenderTarget(),Wh=this._renderer.getActiveCubeFace(),$h=this._renderer.getActiveMipmapLevel(),Xh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:$n,minFilter:$n,generateMipmaps:!1,type:br,format:Ln,colorSpace:ws,depthBuffer:!1},s=Wf(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Wf(t,e,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Py(r)),this._blurMaterial=Ly(r,t,e)}return s}_compileMaterial(t){let e=new q(this._lodPlanes[0],t);this._renderer.compile(e,Vh)}_sceneToCubeUV(t,e,i,s,r){let l=new He(90,1,e,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,p=u.toneMapping;u.getClearColor(Vf),u.toneMapping=Li,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let _=new Ve({name:"PMREM.Background",side:We,depthWrite:!1,depthTest:!1}),m=new q(new Ge,_),f=!1,S=t.background;S?S.isColor&&(_.color.copy(S),t.background=null,f=!0):(_.color.copy(Vf),f=!0);for(let w=0;w<6;w++){let M=w%3;M===0?(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[w],r.y,r.z)):M===1?(l.up.set(0,0,c[w]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[w],r.z)):(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[w]));let T=this._cubeSize;Yl(s,M*T,w>2?T:0,T,T),u.setRenderTarget(s),f&&u.render(m,l),u.render(t,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=p,u.autoClear=d,t.background=S}_textureToCubeUV(t,e){let i=this._renderer,s=t.mapping===Rs||t.mapping===Cs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=$f());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new q(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Yl(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,Vh)}_applyPMREM(t){let e=this._renderer,i=e.autoClear;e.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Gf[(s-r-1)%Gf.length];this._blur(t,r-1,r,o,a)}e.autoClear=i}_blur(t,e,i,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,s,"latitudinal",r),this._halfBlur(o,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new q(this._lodPlanes[s],c),d=c.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Us-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):Us;m>Us&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Us}`);let f=[],S=0;for(let A=0;A<Us;++A){let P=A/_,v=Math.exp(-P*P/2);f.push(v),A===0?S+=v:A<m&&(S+=2*v)}for(let A=0;A<f.length;A++)f[A]=f[A]/S;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:w}=this;d.dTheta.value=g,d.mipInt.value=w-i;let M=this._sizeLods[s],T=3*M*(s>w-Ar?s-w+Ar:0),E=4*(this._cubeSize-M);Yl(e,T,E,3*M,2*M),l.setRenderTarget(e),l.render(u,Vh)}};function Py(n){let t=[],e=[],i=[],s=n,r=n-Ar+1+Hf.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let l=1/a;o>n-Ar?l=Hf[o-n+Ar-1]:o===0&&(l=0),i.push(l);let c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,_=3,m=2,f=1,S=new Float32Array(_*g*p),w=new Float32Array(m*g*p),M=new Float32Array(f*g*p);for(let E=0;E<p;E++){let A=E%3*2/3-1,P=E>2?0:-1,v=[A,P,0,A+2/3,P,0,A+2/3,P+1,0,A,P,0,A+2/3,P+1,0,A,P+1,0];S.set(v,_*g*E),w.set(d,m*g*E);let x=[E,E,E,E,E,E];M.set(x,f*g*E)}let T=new an;T.setAttribute("position",new Be(S,_)),T.setAttribute("uv",new Be(w,m)),T.setAttribute("faceIndex",new Be(M,f)),t.push(T),s>Ar&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Wf(n,t,e){let i=new ui(n,t,e);return i.texture.mapping=wo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Yl(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function Ly(n,t,e){let i=new Float32Array(Us),s=new I(0,1,0);return new Xn({name:"SphericalGaussianBlur",defines:{n:Us,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:nu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Pi,depthTest:!1,depthWrite:!1})}function $f(){return new Xn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:nu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Pi,depthTest:!1,depthWrite:!1})}function Xf(){return new Xn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:nu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pi,depthTest:!1,depthWrite:!1})}function nu(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Dy(n){let t=new WeakMap,e=null;function i(a){if(a&&a.isTexture){let l=a.mapping,c=l===ll||l===cl,h=l===Rs||l===Cs;if(c||h){let u=t.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new Cr(n)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{let p=a.image;return c&&p&&p.height>0||h&&p&&s(p)?(e===null&&(e=new Cr(n)),u=c?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function Uy(n){let t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){let s=e(i);return s===null&&dr("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function Ny(n,t,e,i){let s={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete s[d.id];let p=r.get(d);p&&(t.remove(p),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(u){let d=u.attributes;for(let p in d)t.update(d[p],n.ARRAY_BUFFER)}function c(u){let d=[],p=u.index,g=u.attributes.position,_=0;if(p!==null){let S=p.array;_=p.version;for(let w=0,M=S.length;w<M;w+=3){let T=S[w+0],E=S[w+1],A=S[w+2];d.push(T,E,E,A,A,T)}}else if(g!==void 0){let S=g.array;_=g.version;for(let w=0,M=S.length/3-1;w<M;w+=3){let T=w+0,E=w+1,A=w+2;d.push(T,E,E,A,A,T)}}else return;let m=new(Oh(d)?ro:so)(d,1);m.version=_;let f=r.get(u);f&&t.remove(f),r.set(u,m)}function h(u){let d=r.get(u);if(d){let p=u.index;p!==null&&d.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function Fy(n,t,e){let i;function s(d){i=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,p){n.drawElements(i,p,r,d*o),e.update(p,i,1)}function c(d,p,g){g!==0&&(n.drawElementsInstanced(i,p,r,d*o,g),e.update(p,i,g))}function h(d,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];e.update(m,i,1)}function u(d,p,g,_){if(g===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/o,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,r,d,0,_,0,g);let f=0;for(let S=0;S<g;S++)f+=p[S]*_[S];e.update(f,i,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Oy(n){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=a*(r/3);break;case n.LINES:e.lines+=a*(r/2);break;case n.LINE_STRIP:e.lines+=a*(r-1);break;case n.LINE_LOOP:e.lines+=a*r;break;case n.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function ky(n,t,e){let i=new WeakMap,s=new re;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=i.get(a);if(d===void 0||d.count!==u){let v=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",v)};d!==void 0&&d.texture.dispose();let p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],S=a.morphAttributes.color||[],w=0;p===!0&&(w=1),g===!0&&(w=2),_===!0&&(w=3);let M=a.attributes.position.count*w,T=1;M>t.maxTextureSize&&(T=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);let E=new Float32Array(M*T*4*u),A=new io(E,M,T,u);A.type=Zn,A.needsUpdate=!0;let P=w*4;for(let x=0;x<u;x++){let C=m[x],D=f[x],k=S[x],H=M*T*4*x;for(let Y=0;Y<C.count;Y++){let W=Y*P;p===!0&&(s.fromBufferAttribute(C,Y),E[H+W+0]=s.x,E[H+W+1]=s.y,E[H+W+2]=s.z,E[H+W+3]=0),g===!0&&(s.fromBufferAttribute(D,Y),E[H+W+4]=s.x,E[H+W+5]=s.y,E[H+W+6]=s.z,E[H+W+7]=0),_===!0&&(s.fromBufferAttribute(k,Y),E[H+W+8]=s.x,E[H+W+9]=s.y,E[H+W+10]=s.z,E[H+W+11]=k.itemSize===4?s.w:1)}}d={count:u,texture:A,size:new Tt(M,T)},i.set(a,d),a.addEventListener("dispose",v)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let p=0;for(let _=0;_<c.length;_++)p+=c[_];let g=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function By(n,t,e,i){let s=new WeakMap;function r(l){let c=i.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}var up=new on,qf=new co(1,1),dp=new io,fp=new Fa,pp=new ao,Yf=[],Zf=[],Kf=new Float32Array(16),Jf=new Float32Array(9),jf=new Float32Array(4);function Ir(n,t,e){let i=n[0];if(i<=0||i>0)return n;let s=t*e,r=Yf[s];if(r===void 0&&(r=new Float32Array(s),Yf[s]=r),t!==0){i.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,n[o].toArray(r,a)}return r}function Ue(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Ne(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Jl(n,t){let e=Zf[t];e===void 0&&(e=new Int32Array(t),Zf[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function zy(n,t){let e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Hy(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;n.uniform2fv(this.addr,t),Ne(e,t)}}function Vy(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ue(e,t))return;n.uniform3fv(this.addr,t),Ne(e,t)}}function Gy(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;n.uniform4fv(this.addr,t),Ne(e,t)}}function Wy(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(Ue(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Ne(e,t)}else{if(Ue(e,i))return;jf.set(i),n.uniformMatrix2fv(this.addr,!1,jf),Ne(e,i)}}function $y(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(Ue(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Ne(e,t)}else{if(Ue(e,i))return;Jf.set(i),n.uniformMatrix3fv(this.addr,!1,Jf),Ne(e,i)}}function Xy(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(Ue(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Ne(e,t)}else{if(Ue(e,i))return;Kf.set(i),n.uniformMatrix4fv(this.addr,!1,Kf),Ne(e,i)}}function qy(n,t){let e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function Yy(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;n.uniform2iv(this.addr,t),Ne(e,t)}}function Zy(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ue(e,t))return;n.uniform3iv(this.addr,t),Ne(e,t)}}function Ky(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;n.uniform4iv(this.addr,t),Ne(e,t)}}function Jy(n,t){let e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function jy(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;n.uniform2uiv(this.addr,t),Ne(e,t)}}function Qy(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ue(e,t))return;n.uniform3uiv(this.addr,t),Ne(e,t)}}function tv(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;n.uniform4uiv(this.addr,t),Ne(e,t)}}function ev(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(qf.compareFunction=Uh,r=qf):r=up,e.setTexture2D(t||r,s)}function nv(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||fp,s)}function iv(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||pp,s)}function sv(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||dp,s)}function rv(n){switch(n){case 5126:return zy;case 35664:return Hy;case 35665:return Vy;case 35666:return Gy;case 35674:return Wy;case 35675:return $y;case 35676:return Xy;case 5124:case 35670:return qy;case 35667:case 35671:return Yy;case 35668:case 35672:return Zy;case 35669:case 35673:return Ky;case 5125:return Jy;case 36294:return jy;case 36295:return Qy;case 36296:return tv;case 35678:case 36198:case 36298:case 36306:case 35682:return ev;case 35679:case 36299:case 36307:return nv;case 35680:case 36300:case 36308:case 36293:return iv;case 36289:case 36303:case 36311:case 36292:return sv}}function ov(n,t){n.uniform1fv(this.addr,t)}function av(n,t){let e=Ir(t,this.size,2);n.uniform2fv(this.addr,e)}function lv(n,t){let e=Ir(t,this.size,3);n.uniform3fv(this.addr,e)}function cv(n,t){let e=Ir(t,this.size,4);n.uniform4fv(this.addr,e)}function hv(n,t){let e=Ir(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function uv(n,t){let e=Ir(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function dv(n,t){let e=Ir(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function fv(n,t){n.uniform1iv(this.addr,t)}function pv(n,t){n.uniform2iv(this.addr,t)}function mv(n,t){n.uniform3iv(this.addr,t)}function gv(n,t){n.uniform4iv(this.addr,t)}function _v(n,t){n.uniform1uiv(this.addr,t)}function xv(n,t){n.uniform2uiv(this.addr,t)}function yv(n,t){n.uniform3uiv(this.addr,t)}function vv(n,t){n.uniform4uiv(this.addr,t)}function Mv(n,t,e){let i=this.cache,s=t.length,r=Jl(e,s);Ue(i,r)||(n.uniform1iv(this.addr,r),Ne(i,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||up,r[o])}function bv(n,t,e){let i=this.cache,s=t.length,r=Jl(e,s);Ue(i,r)||(n.uniform1iv(this.addr,r),Ne(i,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||fp,r[o])}function Sv(n,t,e){let i=this.cache,s=t.length,r=Jl(e,s);Ue(i,r)||(n.uniform1iv(this.addr,r),Ne(i,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||pp,r[o])}function wv(n,t,e){let i=this.cache,s=t.length,r=Jl(e,s);Ue(i,r)||(n.uniform1iv(this.addr,r),Ne(i,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||dp,r[o])}function Ev(n){switch(n){case 5126:return ov;case 35664:return av;case 35665:return lv;case 35666:return cv;case 35674:return hv;case 35675:return uv;case 35676:return dv;case 5124:case 35670:return fv;case 35667:case 35671:return pv;case 35668:case 35672:return mv;case 35669:case 35673:return gv;case 5125:return _v;case 36294:return xv;case 36295:return yv;case 36296:return vv;case 35678:case 36198:case 36298:case 36306:case 35682:return Mv;case 35679:case 36299:case 36307:return bv;case 35680:case 36300:case 36308:case 36293:return Sv;case 36289:case 36303:case 36311:case 36292:return wv}}var Yh=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=rv(e.type)}},Zh=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Ev(e.type)}},Kh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],i)}}},qh=/(\w+)(\])?(\[|\.)?/g;function Qf(n,t){n.seq.push(t),n.map[t.id]=t}function Tv(n,t,e){let i=n.name,s=i.length;for(qh.lastIndex=0;;){let r=qh.exec(i),o=qh.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Qf(e,c===void 0?new Yh(a,n,t):new Zh(a,n,t));break}else{let u=e.map[a];u===void 0&&(u=new Kh(a),Qf(e,u)),e=u}}}var Rr=class{constructor(t,e){this.seq=[],this.map={};let i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Tv(r,o,this)}}setValue(t,e,i,s){let r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){let s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=i[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let i=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&i.push(o)}return i}};function tp(n,t,e){let i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}var Av=37297,Rv=0;function Cv(n,t){let e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return i.join(`
`)}var ep=new zt;function Iv(n){jt._getMatrix(ep,jt.workingColorSpace,n);let t=`mat3( ${ep.elements.map(e=>e.toFixed(4))} )`;switch(jt.getTransfer(n)){case to:return[t,"LinearTransferOETF"];case oe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function np(n,t,e){let i=n.getShaderParameter(t,n.COMPILE_STATUS),r=(n.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+Cv(n.getShaderSource(t),a)}else return r}function Pv(n,t){let e=Iv(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Lv(n,t){let e;switch(t){case xf:e="Linear";break;case yf:e="Reinhard";break;case vf:e="Cineon";break;case Mf:e="ACESFilmic";break;case Sf:e="AgX";break;case wf:e="Neutral";break;case bf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Zl=new I;function Dv(){jt.getLuminanceCoefficients(Zl);let n=Zl.x.toFixed(4),t=Zl.y.toFixed(4),e=Zl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Uv(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Io).join(`
`)}function Nv(n){let t=[];for(let e in n){let i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Fv(n,t){let e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(t,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:n.getAttribLocation(t,o),locationSize:a}}return e}function Io(n){return n!==""}function ip(n,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function sp(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Ov=/^[ \t]*#include +<([\w\d./]+)>/gm;function Jh(n){return n.replace(Ov,Bv)}var kv=new Map;function Bv(n,t){let e=$t[t];if(e===void 0){let i=kv.get(t);if(i!==void 0)e=$t[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Jh(e)}var zv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function rp(n){return n.replace(zv,Hv)}function Hv(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function op(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Vv(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===bh?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Qa?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===pi&&(t="SHADOWMAP_TYPE_VSM"),t}function Gv(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Rs:case Cs:t="ENVMAP_TYPE_CUBE";break;case wo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Wv(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Cs:t="ENVMAP_MODE_REFRACTION";break}return t}function $v(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case al:t="ENVMAP_BLENDING_MULTIPLY";break;case gf:t="ENVMAP_BLENDING_MIX";break;case _f:t="ENVMAP_BLENDING_ADD";break}return t}function Xv(n){let t=n.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function qv(n,t,e,i){let s=n.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=Vv(e),c=Gv(e),h=Wv(e),u=$v(e),d=Xv(e),p=Uv(e),g=Nv(r),_=s.createProgram(),m,f,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Io).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Io).join(`
`),f.length>0&&(f+=`
`)):(m=[op(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Io).join(`
`),f=[op(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Li?"#define TONE_MAPPING":"",e.toneMapping!==Li?$t.tonemapping_pars_fragment:"",e.toneMapping!==Li?Lv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,Pv("linearToOutputTexel",e.outputColorSpace),Dv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Io).join(`
`)),o=Jh(o),o=ip(o,e),o=sp(o,e),a=Jh(a),a=ip(a,e),a=sp(a,e),o=rp(o),a=rp(a),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===Nh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Nh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let w=S+m+o,M=S+f+a,T=tp(s,s.VERTEX_SHADER,w),E=tp(s,s.FRAGMENT_SHADER,M);s.attachShader(_,T),s.attachShader(_,E),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(C){if(n.debug.checkShaderErrors){let D=s.getProgramInfoLog(_)||"",k=s.getShaderInfoLog(T)||"",H=s.getShaderInfoLog(E)||"",Y=D.trim(),W=k.trim(),ot=H.trim(),G=!0,ct=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(G=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,T,E);else{let J=np(s,T,"vertex"),j=np(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+Y+`
`+J+`
`+j)}else Y!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Y):(W===""||ot==="")&&(ct=!1);ct&&(C.diagnostics={runnable:G,programLog:Y,vertexShader:{log:W,prefix:m},fragmentShader:{log:ot,prefix:f}})}s.deleteShader(T),s.deleteShader(E),P=new Rr(s,_),v=Fv(s,_)}let P;this.getUniforms=function(){return P===void 0&&A(this),P};let v;this.getAttributes=function(){return v===void 0&&A(this),v};let x=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=s.getProgramParameter(_,Av)),x},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Rv++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=E,this}var Yv=0,jh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){let e=this.shaderCache,i=e.get(t);return i===void 0&&(i=new Qh(t),e.set(t,i)),i}},Qh=class{constructor(t){this.id=Yv++,this.code=t,this.usedTimes=0}};function Zv(n,t,e,i,s,r,o){let a=new pr,l=new jh,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(v){return c.add(v),v===0?"uv":`uv${v}`}function m(v,x,C,D,k){let H=D.fog,Y=k.geometry,W=v.isMeshStandardMaterial?D.environment:null,ot=(v.isMeshStandardMaterial?e:t).get(v.envMap||W),G=ot&&ot.mapping===wo?ot.image.height:null,ct=g[v.type];v.precision!==null&&(p=s.getMaxPrecision(v.precision),p!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",p,"instead."));let J=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,j=J!==void 0?J.length:0,mt=0;Y.morphAttributes.position!==void 0&&(mt=1),Y.morphAttributes.normal!==void 0&&(mt=2),Y.morphAttributes.color!==void 0&&(mt=3);let Nt,he,Jt,Z;if(ct){let ie=mi[ct];Nt=ie.vertexShader,he=ie.fragmentShader}else Nt=v.vertexShader,he=v.fragmentShader,l.update(v),Jt=l.getVertexShaderID(v),Z=l.getFragmentShaderID(v);let tt=n.getRenderTarget(),_t=n.state.buffers.depth.getReversed(),Ft=k.isInstancedMesh===!0,At=k.isBatchedMesh===!0,Zt=!!v.map,Ze=!!v.matcap,L=!!ot,ye=!!v.aoMap,kt=!!v.lightMap,Dt=!!v.bumpMap,vt=!!v.normalMap,ve=!!v.displacementMap,Mt=!!v.emissiveMap,Wt=!!v.metalnessMap,Oe=!!v.roughnessMap,Te=v.anisotropy>0,R=v.clearcoat>0,y=v.dispersion>0,O=v.iridescence>0,X=v.sheen>0,Q=v.transmission>0,$=Te&&!!v.anisotropyMap,Et=R&&!!v.clearcoatMap,at=R&&!!v.clearcoatNormalMap,bt=R&&!!v.clearcoatRoughnessMap,St=O&&!!v.iridescenceMap,st=O&&!!v.iridescenceThicknessMap,ft=X&&!!v.sheenColorMap,Lt=X&&!!v.sheenRoughnessMap,wt=!!v.specularMap,ut=!!v.specularColorMap,Vt=!!v.specularIntensityMap,U=Q&&!!v.transmissionMap,rt=Q&&!!v.thicknessMap,lt=!!v.gradientMap,gt=!!v.alphaMap,nt=v.alphaTest>0,K=!!v.alphaHash,yt=!!v.extensions,Ot=Li;v.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(Ot=n.toneMapping);let fe={shaderID:ct,shaderType:v.type,shaderName:v.name,vertexShader:Nt,fragmentShader:he,defines:v.defines,customVertexShaderID:Jt,customFragmentShaderID:Z,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:p,batching:At,batchingColor:At&&k._colorsTexture!==null,instancing:Ft,instancingColor:Ft&&k.instanceColor!==null,instancingMorph:Ft&&k.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:tt===null?n.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:ws,alphaToCoverage:!!v.alphaToCoverage,map:Zt,matcap:Ze,envMap:L,envMapMode:L&&ot.mapping,envMapCubeUVHeight:G,aoMap:ye,lightMap:kt,bumpMap:Dt,normalMap:vt,displacementMap:d&&ve,emissiveMap:Mt,normalMapObjectSpace:vt&&v.normalMapType===Rf,normalMapTangentSpace:vt&&v.normalMapType===Xl,metalnessMap:Wt,roughnessMap:Oe,anisotropy:Te,anisotropyMap:$,clearcoat:R,clearcoatMap:Et,clearcoatNormalMap:at,clearcoatRoughnessMap:bt,dispersion:y,iridescence:O,iridescenceMap:St,iridescenceThicknessMap:st,sheen:X,sheenColorMap:ft,sheenRoughnessMap:Lt,specularMap:wt,specularColorMap:ut,specularIntensityMap:Vt,transmission:Q,transmissionMap:U,thicknessMap:rt,gradientMap:lt,opaque:v.transparent===!1&&v.blending===bs&&v.alphaToCoverage===!1,alphaMap:gt,alphaTest:nt,alphaHash:K,combine:v.combine,mapUv:Zt&&_(v.map.channel),aoMapUv:ye&&_(v.aoMap.channel),lightMapUv:kt&&_(v.lightMap.channel),bumpMapUv:Dt&&_(v.bumpMap.channel),normalMapUv:vt&&_(v.normalMap.channel),displacementMapUv:ve&&_(v.displacementMap.channel),emissiveMapUv:Mt&&_(v.emissiveMap.channel),metalnessMapUv:Wt&&_(v.metalnessMap.channel),roughnessMapUv:Oe&&_(v.roughnessMap.channel),anisotropyMapUv:$&&_(v.anisotropyMap.channel),clearcoatMapUv:Et&&_(v.clearcoatMap.channel),clearcoatNormalMapUv:at&&_(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:bt&&_(v.clearcoatRoughnessMap.channel),iridescenceMapUv:St&&_(v.iridescenceMap.channel),iridescenceThicknessMapUv:st&&_(v.iridescenceThicknessMap.channel),sheenColorMapUv:ft&&_(v.sheenColorMap.channel),sheenRoughnessMapUv:Lt&&_(v.sheenRoughnessMap.channel),specularMapUv:wt&&_(v.specularMap.channel),specularColorMapUv:ut&&_(v.specularColorMap.channel),specularIntensityMapUv:Vt&&_(v.specularIntensityMap.channel),transmissionMapUv:U&&_(v.transmissionMap.channel),thicknessMapUv:rt&&_(v.thicknessMap.channel),alphaMapUv:gt&&_(v.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(vt||Te),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!Y.attributes.uv&&(Zt||gt),fog:!!H,useFog:v.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:v.flatShading===!0&&v.wireframe===!1,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:_t,skinning:k.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:j,morphTextureStride:mt,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:v.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ot,decodeVideoTexture:Zt&&v.map.isVideoTexture===!0&&jt.getTransfer(v.map.colorSpace)===oe,decodeVideoTextureEmissive:Mt&&v.emissiveMap.isVideoTexture===!0&&jt.getTransfer(v.emissiveMap.colorSpace)===oe,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===fn,flipSided:v.side===We,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:yt&&v.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(yt&&v.extensions.multiDraw===!0||At)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return fe.vertexUv1s=c.has(1),fe.vertexUv2s=c.has(2),fe.vertexUv3s=c.has(3),c.clear(),fe}function f(v){let x=[];if(v.shaderID?x.push(v.shaderID):(x.push(v.customVertexShaderID),x.push(v.customFragmentShaderID)),v.defines!==void 0)for(let C in v.defines)x.push(C),x.push(v.defines[C]);return v.isRawShaderMaterial===!1&&(S(x,v),w(x,v),x.push(n.outputColorSpace)),x.push(v.customProgramCacheKey),x.join()}function S(v,x){v.push(x.precision),v.push(x.outputColorSpace),v.push(x.envMapMode),v.push(x.envMapCubeUVHeight),v.push(x.mapUv),v.push(x.alphaMapUv),v.push(x.lightMapUv),v.push(x.aoMapUv),v.push(x.bumpMapUv),v.push(x.normalMapUv),v.push(x.displacementMapUv),v.push(x.emissiveMapUv),v.push(x.metalnessMapUv),v.push(x.roughnessMapUv),v.push(x.anisotropyMapUv),v.push(x.clearcoatMapUv),v.push(x.clearcoatNormalMapUv),v.push(x.clearcoatRoughnessMapUv),v.push(x.iridescenceMapUv),v.push(x.iridescenceThicknessMapUv),v.push(x.sheenColorMapUv),v.push(x.sheenRoughnessMapUv),v.push(x.specularMapUv),v.push(x.specularColorMapUv),v.push(x.specularIntensityMapUv),v.push(x.transmissionMapUv),v.push(x.thicknessMapUv),v.push(x.combine),v.push(x.fogExp2),v.push(x.sizeAttenuation),v.push(x.morphTargetsCount),v.push(x.morphAttributeCount),v.push(x.numDirLights),v.push(x.numPointLights),v.push(x.numSpotLights),v.push(x.numSpotLightMaps),v.push(x.numHemiLights),v.push(x.numRectAreaLights),v.push(x.numDirLightShadows),v.push(x.numPointLightShadows),v.push(x.numSpotLightShadows),v.push(x.numSpotLightShadowsWithMaps),v.push(x.numLightProbes),v.push(x.shadowMapType),v.push(x.toneMapping),v.push(x.numClippingPlanes),v.push(x.numClipIntersection),v.push(x.depthPacking)}function w(v,x){a.disableAll(),x.supportsVertexTextures&&a.enable(0),x.instancing&&a.enable(1),x.instancingColor&&a.enable(2),x.instancingMorph&&a.enable(3),x.matcap&&a.enable(4),x.envMap&&a.enable(5),x.normalMapObjectSpace&&a.enable(6),x.normalMapTangentSpace&&a.enable(7),x.clearcoat&&a.enable(8),x.iridescence&&a.enable(9),x.alphaTest&&a.enable(10),x.vertexColors&&a.enable(11),x.vertexAlphas&&a.enable(12),x.vertexUv1s&&a.enable(13),x.vertexUv2s&&a.enable(14),x.vertexUv3s&&a.enable(15),x.vertexTangents&&a.enable(16),x.anisotropy&&a.enable(17),x.alphaHash&&a.enable(18),x.batching&&a.enable(19),x.dispersion&&a.enable(20),x.batchingColor&&a.enable(21),x.gradientMap&&a.enable(22),v.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.reversedDepthBuffer&&a.enable(4),x.skinning&&a.enable(5),x.morphTargets&&a.enable(6),x.morphNormals&&a.enable(7),x.morphColors&&a.enable(8),x.premultipliedAlpha&&a.enable(9),x.shadowMapEnabled&&a.enable(10),x.doubleSided&&a.enable(11),x.flipSided&&a.enable(12),x.useDepthPacking&&a.enable(13),x.dithering&&a.enable(14),x.transmission&&a.enable(15),x.sheen&&a.enable(16),x.opaque&&a.enable(17),x.pointsUvs&&a.enable(18),x.decodeVideoTexture&&a.enable(19),x.decodeVideoTextureEmissive&&a.enable(20),x.alphaToCoverage&&a.enable(21),v.push(a.mask)}function M(v){let x=g[v.type],C;if(x){let D=mi[x];C=Bf.clone(D.uniforms)}else C=v.uniforms;return C}function T(v,x){let C;for(let D=0,k=h.length;D<k;D++){let H=h[D];if(H.cacheKey===x){C=H,++C.usedTimes;break}}return C===void 0&&(C=new qv(n,x,v,r),h.push(C)),C}function E(v){if(--v.usedTimes===0){let x=h.indexOf(v);h[x]=h[h.length-1],h.pop(),v.destroy()}}function A(v){l.remove(v)}function P(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:M,acquireProgram:T,releaseProgram:E,releaseShaderCache:A,programs:h,dispose:P}}function Kv(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,l){n.get(o)[a]=l}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function Jv(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function ap(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function lp(){let n=[],t=0,e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function o(u,d,p,g,_,m){let f=n[t];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},n[t]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=_,f.group=m),t++,f}function a(u,d,p,g,_,m){let f=o(u,d,p,g,_,m);p.transmission>0?i.push(f):p.transparent===!0?s.push(f):e.push(f)}function l(u,d,p,g,_,m){let f=o(u,d,p,g,_,m);p.transmission>0?i.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function c(u,d){e.length>1&&e.sort(u||Jv),i.length>1&&i.sort(d||ap),s.length>1&&s.sort(d||ap)}function h(){for(let u=t,d=n.length;u<d;u++){let p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function jv(){let n=new WeakMap;function t(i,s){let r=n.get(i),o;return r===void 0?(o=new lp,n.set(i,[o])):s>=r.length?(o=new lp,r.push(o)):o=r[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function Qv(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new I,color:new Gt};break;case"SpotLight":e={position:new I,direction:new I,color:new Gt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new Gt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new Gt,groundColor:new Gt};break;case"RectAreaLight":e={color:new Gt,position:new I,halfWidth:new I,halfHeight:new I};break}return n[t.id]=e,e}}}function tM(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}var eM=0;function nM(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function iM(n){let t=new Qv,e=tM(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new I);let s=new I,r=new ae,o=new ae;function a(c){let h=0,u=0,d=0;for(let v=0;v<9;v++)i.probe[v].set(0,0,0);let p=0,g=0,_=0,m=0,f=0,S=0,w=0,M=0,T=0,E=0,A=0;c.sort(nM);for(let v=0,x=c.length;v<x;v++){let C=c[v],D=C.color,k=C.intensity,H=C.distance,Y=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=D.r*k,u+=D.g*k,d+=D.b*k;else if(C.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(C.sh.coefficients[W],k);A++}else if(C.isDirectionalLight){let W=t.get(C);if(W.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let ot=C.shadow,G=e.get(C);G.shadowIntensity=ot.intensity,G.shadowBias=ot.bias,G.shadowNormalBias=ot.normalBias,G.shadowRadius=ot.radius,G.shadowMapSize=ot.mapSize,i.directionalShadow[p]=G,i.directionalShadowMap[p]=Y,i.directionalShadowMatrix[p]=C.shadow.matrix,S++}i.directional[p]=W,p++}else if(C.isSpotLight){let W=t.get(C);W.position.setFromMatrixPosition(C.matrixWorld),W.color.copy(D).multiplyScalar(k),W.distance=H,W.coneCos=Math.cos(C.angle),W.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),W.decay=C.decay,i.spot[_]=W;let ot=C.shadow;if(C.map&&(i.spotLightMap[T]=C.map,T++,ot.updateMatrices(C),C.castShadow&&E++),i.spotLightMatrix[_]=ot.matrix,C.castShadow){let G=e.get(C);G.shadowIntensity=ot.intensity,G.shadowBias=ot.bias,G.shadowNormalBias=ot.normalBias,G.shadowRadius=ot.radius,G.shadowMapSize=ot.mapSize,i.spotShadow[_]=G,i.spotShadowMap[_]=Y,M++}_++}else if(C.isRectAreaLight){let W=t.get(C);W.color.copy(D).multiplyScalar(k),W.halfWidth.set(C.width*.5,0,0),W.halfHeight.set(0,C.height*.5,0),i.rectArea[m]=W,m++}else if(C.isPointLight){let W=t.get(C);if(W.color.copy(C.color).multiplyScalar(C.intensity),W.distance=C.distance,W.decay=C.decay,C.castShadow){let ot=C.shadow,G=e.get(C);G.shadowIntensity=ot.intensity,G.shadowBias=ot.bias,G.shadowNormalBias=ot.normalBias,G.shadowRadius=ot.radius,G.shadowMapSize=ot.mapSize,G.shadowCameraNear=ot.camera.near,G.shadowCameraFar=ot.camera.far,i.pointShadow[g]=G,i.pointShadowMap[g]=Y,i.pointShadowMatrix[g]=C.shadow.matrix,w++}i.point[g]=W,g++}else if(C.isHemisphereLight){let W=t.get(C);W.skyColor.copy(C.color).multiplyScalar(k),W.groundColor.copy(C.groundColor).multiplyScalar(k),i.hemi[f]=W,f++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ht.LTC_FLOAT_1,i.rectAreaLTC2=ht.LTC_FLOAT_2):(i.rectAreaLTC1=ht.LTC_HALF_1,i.rectAreaLTC2=ht.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;let P=i.hash;(P.directionalLength!==p||P.pointLength!==g||P.spotLength!==_||P.rectAreaLength!==m||P.hemiLength!==f||P.numDirectionalShadows!==S||P.numPointShadows!==w||P.numSpotShadows!==M||P.numSpotMaps!==T||P.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=f,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.pointShadow.length=w,i.pointShadowMap.length=w,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=S,i.pointShadowMatrix.length=w,i.spotLightMatrix.length=M+T-E,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=A,P.directionalLength=p,P.pointLength=g,P.spotLength=_,P.rectAreaLength=m,P.hemiLength=f,P.numDirectionalShadows=S,P.numPointShadows=w,P.numSpotShadows=M,P.numSpotMaps=T,P.numLightProbes=A,i.version=eM++)}function l(c,h){let u=0,d=0,p=0,g=0,_=0,m=h.matrixWorldInverse;for(let f=0,S=c.length;f<S;f++){let w=c[f];if(w.isDirectionalLight){let M=i.directional[u];M.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),u++}else if(w.isSpotLight){let M=i.spot[p];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),p++}else if(w.isRectAreaLight){let M=i.rectArea[g];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),o.identity(),r.copy(w.matrixWorld),r.premultiply(m),o.extractRotation(r),M.halfWidth.set(w.width*.5,0,0),M.halfHeight.set(0,w.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),g++}else if(w.isPointLight){let M=i.point[d];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),d++}else if(w.isHemisphereLight){let M=i.hemi[_];M.direction.setFromMatrixPosition(w.matrixWorld),M.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:i}}function cp(n){let t=new iM(n),e=[],i=[];function s(h){c.camera=h,e.length=0,i.length=0}function r(h){e.push(h)}function o(h){i.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}let c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function sM(n){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new cp(n),t.set(s,[a])):r>=o.length?(a=new cp(n),o.push(a)):a=o[r],a}function i(){t=new WeakMap}return{get:e,dispose:i}}var rM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,oM=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function aM(n,t,e){let i=new _r,s=new Tt,r=new Tt,o=new re,a=new za({depthPacking:Af}),l=new Ha,c={},h=e.maxTextureSize,u={[Ri]:We,[We]:Ri,[fn]:fn},d=new Xn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Tt},radius:{value:4}},vertexShader:rM,fragmentShader:oM}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let g=new an;g.setAttribute("position",new Be(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new q(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=bh;let f=this.type;this.render=function(E,A,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;let v=n.getRenderTarget(),x=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),D=n.state;D.setBlending(Pi),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);let k=f!==pi&&this.type===pi,H=f===pi&&this.type!==pi;for(let Y=0,W=E.length;Y<W;Y++){let ot=E[Y],G=ot.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",ot,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);let ct=G.getFrameExtents();if(s.multiply(ct),r.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ct.x),s.x=r.x*ct.x,G.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ct.y),s.y=r.y*ct.y,G.mapSize.y=r.y)),G.map===null||k===!0||H===!0){let j=this.type!==pi?{minFilter:dn,magFilter:dn}:{};G.map!==null&&G.map.dispose(),G.map=new ui(s.x,s.y,j),G.map.texture.name=ot.name+".shadowMap",G.camera.updateProjectionMatrix()}n.setRenderTarget(G.map),n.clear();let J=G.getViewportCount();for(let j=0;j<J;j++){let mt=G.getViewport(j);o.set(r.x*mt.x,r.y*mt.y,r.x*mt.z,r.y*mt.w),D.viewport(o),G.updateMatrices(ot,j),i=G.getFrustum(),M(A,P,G.camera,ot,this.type)}G.isPointLightShadow!==!0&&this.type===pi&&S(G,P),G.needsUpdate=!1}f=this.type,m.needsUpdate=!1,n.setRenderTarget(v,x,C)};function S(E,A){let P=t.update(_);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new ui(s.x,s.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(A,null,P,d,_,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(A,null,P,p,_,null)}function w(E,A,P,v){let x=null,C=P.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(C!==void 0)x=C;else if(x=P.isPointLight===!0?l:a,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let D=x.uuid,k=A.uuid,H=c[D];H===void 0&&(H={},c[D]=H);let Y=H[k];Y===void 0&&(Y=x.clone(),H[k]=Y,A.addEventListener("dispose",T)),x=Y}if(x.visible=A.visible,x.wireframe=A.wireframe,v===pi?x.side=A.shadowSide!==null?A.shadowSide:A.side:x.side=A.shadowSide!==null?A.shadowSide:u[A.side],x.alphaMap=A.alphaMap,x.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,x.map=A.map,x.clipShadows=A.clipShadows,x.clippingPlanes=A.clippingPlanes,x.clipIntersection=A.clipIntersection,x.displacementMap=A.displacementMap,x.displacementScale=A.displacementScale,x.displacementBias=A.displacementBias,x.wireframeLinewidth=A.wireframeLinewidth,x.linewidth=A.linewidth,P.isPointLight===!0&&x.isMeshDistanceMaterial===!0){let D=n.properties.get(x);D.light=P}return x}function M(E,A,P,v,x){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&x===pi)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,E.matrixWorld);let k=t.update(E),H=E.material;if(Array.isArray(H)){let Y=k.groups;for(let W=0,ot=Y.length;W<ot;W++){let G=Y[W],ct=H[G.materialIndex];if(ct&&ct.visible){let J=w(E,ct,v,x);E.onBeforeShadow(n,E,A,P,k,J,G),n.renderBufferDirect(P,null,k,J,E,G),E.onAfterShadow(n,E,A,P,k,J,G)}}}else if(H.visible){let Y=w(E,H,v,x);E.onBeforeShadow(n,E,A,P,k,Y,null),n.renderBufferDirect(P,null,k,Y,E,null),E.onAfterShadow(n,E,A,P,k,Y,null)}}let D=E.children;for(let k=0,H=D.length;k<H;k++)M(D[k],A,P,v,x)}function T(E){E.target.removeEventListener("dispose",T);for(let P in c){let v=c[P],x=E.target.uuid;x in v&&(v[x].dispose(),delete v[x])}}}var lM={[tl]:el,[nl]:rl,[il]:ol,[Ss]:sl,[el]:tl,[rl]:nl,[ol]:il,[sl]:Ss};function cM(n,t){function e(){let U=!1,rt=new re,lt=null,gt=new re(0,0,0,0);return{setMask:function(nt){lt!==nt&&!U&&(n.colorMask(nt,nt,nt,nt),lt=nt)},setLocked:function(nt){U=nt},setClear:function(nt,K,yt,Ot,fe){fe===!0&&(nt*=Ot,K*=Ot,yt*=Ot),rt.set(nt,K,yt,Ot),gt.equals(rt)===!1&&(n.clearColor(nt,K,yt,Ot),gt.copy(rt))},reset:function(){U=!1,lt=null,gt.set(-1,0,0,0)}}}function i(){let U=!1,rt=!1,lt=null,gt=null,nt=null;return{setReversed:function(K){if(rt!==K){let yt=t.get("EXT_clip_control");K?yt.clipControlEXT(yt.LOWER_LEFT_EXT,yt.ZERO_TO_ONE_EXT):yt.clipControlEXT(yt.LOWER_LEFT_EXT,yt.NEGATIVE_ONE_TO_ONE_EXT),rt=K;let Ot=nt;nt=null,this.setClear(Ot)}},getReversed:function(){return rt},setTest:function(K){K?tt(n.DEPTH_TEST):_t(n.DEPTH_TEST)},setMask:function(K){lt!==K&&!U&&(n.depthMask(K),lt=K)},setFunc:function(K){if(rt&&(K=lM[K]),gt!==K){switch(K){case tl:n.depthFunc(n.NEVER);break;case el:n.depthFunc(n.ALWAYS);break;case nl:n.depthFunc(n.LESS);break;case Ss:n.depthFunc(n.LEQUAL);break;case il:n.depthFunc(n.EQUAL);break;case sl:n.depthFunc(n.GEQUAL);break;case rl:n.depthFunc(n.GREATER);break;case ol:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}gt=K}},setLocked:function(K){U=K},setClear:function(K){nt!==K&&(rt&&(K=1-K),n.clearDepth(K),nt=K)},reset:function(){U=!1,lt=null,gt=null,nt=null,rt=!1}}}function s(){let U=!1,rt=null,lt=null,gt=null,nt=null,K=null,yt=null,Ot=null,fe=null;return{setTest:function(ie){U||(ie?tt(n.STENCIL_TEST):_t(n.STENCIL_TEST))},setMask:function(ie){rt!==ie&&!U&&(n.stencilMask(ie),rt=ie)},setFunc:function(ie,yi,ri){(lt!==ie||gt!==yi||nt!==ri)&&(n.stencilFunc(ie,yi,ri),lt=ie,gt=yi,nt=ri)},setOp:function(ie,yi,ri){(K!==ie||yt!==yi||Ot!==ri)&&(n.stencilOp(ie,yi,ri),K=ie,yt=yi,Ot=ri)},setLocked:function(ie){U=ie},setClear:function(ie){fe!==ie&&(n.clearStencil(ie),fe=ie)},reset:function(){U=!1,rt=null,lt=null,gt=null,nt=null,K=null,yt=null,Ot=null,fe=null}}}let r=new e,o=new i,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},d=new WeakMap,p=[],g=null,_=!1,m=null,f=null,S=null,w=null,M=null,T=null,E=null,A=new Gt(0,0,0),P=0,v=!1,x=null,C=null,D=null,k=null,H=null,Y=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),W=!1,ot=0,G=n.getParameter(n.VERSION);G.indexOf("WebGL")!==-1?(ot=parseFloat(/^WebGL (\d)/.exec(G)[1]),W=ot>=1):G.indexOf("OpenGL ES")!==-1&&(ot=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),W=ot>=2);let ct=null,J={},j=n.getParameter(n.SCISSOR_BOX),mt=n.getParameter(n.VIEWPORT),Nt=new re().fromArray(j),he=new re().fromArray(mt);function Jt(U,rt,lt,gt){let nt=new Uint8Array(4),K=n.createTexture();n.bindTexture(U,K),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let yt=0;yt<lt;yt++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(rt,0,n.RGBA,1,1,gt,0,n.RGBA,n.UNSIGNED_BYTE,nt):n.texImage2D(rt+yt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,nt);return K}let Z={};Z[n.TEXTURE_2D]=Jt(n.TEXTURE_2D,n.TEXTURE_2D,1),Z[n.TEXTURE_CUBE_MAP]=Jt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[n.TEXTURE_2D_ARRAY]=Jt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Z[n.TEXTURE_3D]=Jt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),tt(n.DEPTH_TEST),o.setFunc(Ss),Dt(!1),vt(Mh),tt(n.CULL_FACE),ye(Pi);function tt(U){h[U]!==!0&&(n.enable(U),h[U]=!0)}function _t(U){h[U]!==!1&&(n.disable(U),h[U]=!1)}function Ft(U,rt){return u[U]!==rt?(n.bindFramebuffer(U,rt),u[U]=rt,U===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=rt),U===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=rt),!0):!1}function At(U,rt){let lt=p,gt=!1;if(U){lt=d.get(rt),lt===void 0&&(lt=[],d.set(rt,lt));let nt=U.textures;if(lt.length!==nt.length||lt[0]!==n.COLOR_ATTACHMENT0){for(let K=0,yt=nt.length;K<yt;K++)lt[K]=n.COLOR_ATTACHMENT0+K;lt.length=nt.length,gt=!0}}else lt[0]!==n.BACK&&(lt[0]=n.BACK,gt=!0);gt&&n.drawBuffers(lt)}function Zt(U){return g!==U?(n.useProgram(U),g=U,!0):!1}let Ze={[Qi]:n.FUNC_ADD,[jd]:n.FUNC_SUBTRACT,[Qd]:n.FUNC_REVERSE_SUBTRACT};Ze[tf]=n.MIN,Ze[ef]=n.MAX;let L={[nf]:n.ZERO,[sf]:n.ONE,[rf]:n.SRC_COLOR,[Ia]:n.SRC_ALPHA,[uf]:n.SRC_ALPHA_SATURATE,[cf]:n.DST_COLOR,[af]:n.DST_ALPHA,[of]:n.ONE_MINUS_SRC_COLOR,[Pa]:n.ONE_MINUS_SRC_ALPHA,[hf]:n.ONE_MINUS_DST_COLOR,[lf]:n.ONE_MINUS_DST_ALPHA,[df]:n.CONSTANT_COLOR,[ff]:n.ONE_MINUS_CONSTANT_COLOR,[pf]:n.CONSTANT_ALPHA,[mf]:n.ONE_MINUS_CONSTANT_ALPHA};function ye(U,rt,lt,gt,nt,K,yt,Ot,fe,ie){if(U===Pi){_===!0&&(_t(n.BLEND),_=!1);return}if(_===!1&&(tt(n.BLEND),_=!0),U!==Jd){if(U!==m||ie!==v){if((f!==Qi||M!==Qi)&&(n.blendEquation(n.FUNC_ADD),f=Qi,M=Qi),ie)switch(U){case bs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Sh:n.blendFunc(n.ONE,n.ONE);break;case wh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Eh:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case bs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Sh:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case wh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Eh:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}S=null,w=null,T=null,E=null,A.set(0,0,0),P=0,m=U,v=ie}return}nt=nt||rt,K=K||lt,yt=yt||gt,(rt!==f||nt!==M)&&(n.blendEquationSeparate(Ze[rt],Ze[nt]),f=rt,M=nt),(lt!==S||gt!==w||K!==T||yt!==E)&&(n.blendFuncSeparate(L[lt],L[gt],L[K],L[yt]),S=lt,w=gt,T=K,E=yt),(Ot.equals(A)===!1||fe!==P)&&(n.blendColor(Ot.r,Ot.g,Ot.b,fe),A.copy(Ot),P=fe),m=U,v=!1}function kt(U,rt){U.side===fn?_t(n.CULL_FACE):tt(n.CULL_FACE);let lt=U.side===We;rt&&(lt=!lt),Dt(lt),U.blending===bs&&U.transparent===!1?ye(Pi):ye(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),r.setMask(U.colorWrite);let gt=U.stencilWrite;a.setTest(gt),gt&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Mt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?tt(n.SAMPLE_ALPHA_TO_COVERAGE):_t(n.SAMPLE_ALPHA_TO_COVERAGE)}function Dt(U){x!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),x=U)}function vt(U){U!==Zd?(tt(n.CULL_FACE),U!==C&&(U===Mh?n.cullFace(n.BACK):U===Kd?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):_t(n.CULL_FACE),C=U}function ve(U){U!==D&&(W&&n.lineWidth(U),D=U)}function Mt(U,rt,lt){U?(tt(n.POLYGON_OFFSET_FILL),(k!==rt||H!==lt)&&(n.polygonOffset(rt,lt),k=rt,H=lt)):_t(n.POLYGON_OFFSET_FILL)}function Wt(U){U?tt(n.SCISSOR_TEST):_t(n.SCISSOR_TEST)}function Oe(U){U===void 0&&(U=n.TEXTURE0+Y-1),ct!==U&&(n.activeTexture(U),ct=U)}function Te(U,rt,lt){lt===void 0&&(ct===null?lt=n.TEXTURE0+Y-1:lt=ct);let gt=J[lt];gt===void 0&&(gt={type:void 0,texture:void 0},J[lt]=gt),(gt.type!==U||gt.texture!==rt)&&(ct!==lt&&(n.activeTexture(lt),ct=lt),n.bindTexture(U,rt||Z[U]),gt.type=U,gt.texture=rt)}function R(){let U=J[ct];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function y(){try{n.compressedTexImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function O(){try{n.compressedTexImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function X(){try{n.texSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Q(){try{n.texSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function $(){try{n.compressedTexSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Et(){try{n.compressedTexSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function at(){try{n.texStorage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function bt(){try{n.texStorage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function St(){try{n.texImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function st(){try{n.texImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ft(U){Nt.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),Nt.copy(U))}function Lt(U){he.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),he.copy(U))}function wt(U,rt){let lt=c.get(rt);lt===void 0&&(lt=new WeakMap,c.set(rt,lt));let gt=lt.get(U);gt===void 0&&(gt=n.getUniformBlockIndex(rt,U.name),lt.set(U,gt))}function ut(U,rt){let gt=c.get(rt).get(U);l.get(rt)!==gt&&(n.uniformBlockBinding(rt,gt,U.__bindingPointIndex),l.set(rt,gt))}function Vt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},ct=null,J={},u={},d=new WeakMap,p=[],g=null,_=!1,m=null,f=null,S=null,w=null,M=null,T=null,E=null,A=new Gt(0,0,0),P=0,v=!1,x=null,C=null,D=null,k=null,H=null,Nt.set(0,0,n.canvas.width,n.canvas.height),he.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:tt,disable:_t,bindFramebuffer:Ft,drawBuffers:At,useProgram:Zt,setBlending:ye,setMaterial:kt,setFlipSided:Dt,setCullFace:vt,setLineWidth:ve,setPolygonOffset:Mt,setScissorTest:Wt,activeTexture:Oe,bindTexture:Te,unbindTexture:R,compressedTexImage2D:y,compressedTexImage3D:O,texImage2D:St,texImage3D:st,updateUBOMapping:wt,uniformBlockBinding:ut,texStorage2D:at,texStorage3D:bt,texSubImage2D:X,texSubImage3D:Q,compressedTexSubImage2D:$,compressedTexSubImage3D:Et,scissor:ft,viewport:Lt,reset:Vt}}function hM(n,t,e,i,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Tt,h=new WeakMap,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,y){return p?new OffscreenCanvas(R,y):no("canvas")}function _(R,y,O){let X=1,Q=Te(R);if((Q.width>O||Q.height>O)&&(X=O/Math.max(Q.width,Q.height)),X<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let $=Math.floor(X*Q.width),Et=Math.floor(X*Q.height);u===void 0&&(u=g($,Et));let at=y?g($,Et):u;return at.width=$,at.height=Et,at.getContext("2d").drawImage(R,0,0,$,Et),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+$+"x"+Et+")."),at}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),R;return R}function m(R){return R.generateMipmaps}function f(R){n.generateMipmap(R)}function S(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function w(R,y,O,X,Q=!1){if(R!==null){if(n[R]!==void 0)return n[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let $=y;if(y===n.RED&&(O===n.FLOAT&&($=n.R32F),O===n.HALF_FLOAT&&($=n.R16F),O===n.UNSIGNED_BYTE&&($=n.R8)),y===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.R8UI),O===n.UNSIGNED_SHORT&&($=n.R16UI),O===n.UNSIGNED_INT&&($=n.R32UI),O===n.BYTE&&($=n.R8I),O===n.SHORT&&($=n.R16I),O===n.INT&&($=n.R32I)),y===n.RG&&(O===n.FLOAT&&($=n.RG32F),O===n.HALF_FLOAT&&($=n.RG16F),O===n.UNSIGNED_BYTE&&($=n.RG8)),y===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.RG8UI),O===n.UNSIGNED_SHORT&&($=n.RG16UI),O===n.UNSIGNED_INT&&($=n.RG32UI),O===n.BYTE&&($=n.RG8I),O===n.SHORT&&($=n.RG16I),O===n.INT&&($=n.RG32I)),y===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.RGB8UI),O===n.UNSIGNED_SHORT&&($=n.RGB16UI),O===n.UNSIGNED_INT&&($=n.RGB32UI),O===n.BYTE&&($=n.RGB8I),O===n.SHORT&&($=n.RGB16I),O===n.INT&&($=n.RGB32I)),y===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.RGBA8UI),O===n.UNSIGNED_SHORT&&($=n.RGBA16UI),O===n.UNSIGNED_INT&&($=n.RGBA32UI),O===n.BYTE&&($=n.RGBA8I),O===n.SHORT&&($=n.RGBA16I),O===n.INT&&($=n.RGBA32I)),y===n.RGB&&(O===n.UNSIGNED_INT_5_9_9_9_REV&&($=n.RGB9_E5),O===n.UNSIGNED_INT_10F_11F_11F_REV&&($=n.R11F_G11F_B10F)),y===n.RGBA){let Et=Q?to:jt.getTransfer(X);O===n.FLOAT&&($=n.RGBA32F),O===n.HALF_FLOAT&&($=n.RGBA16F),O===n.UNSIGNED_BYTE&&($=Et===oe?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT_4_4_4_4&&($=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&($=n.RGB5_A1)}return($===n.R16F||$===n.R32F||$===n.RG16F||$===n.RG32F||$===n.RGBA16F||$===n.RGBA32F)&&t.get("EXT_color_buffer_float"),$}function M(R,y){let O;return R?y===null||y===ss||y===Sr?O=n.DEPTH24_STENCIL8:y===Zn?O=n.DEPTH32F_STENCIL8:y===Mr&&(O=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===ss||y===Sr?O=n.DEPTH_COMPONENT24:y===Zn?O=n.DEPTH_COMPONENT32F:y===Mr&&(O=n.DEPTH_COMPONENT16),O}function T(R,y){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==dn&&R.minFilter!==$n?Math.log2(Math.max(y.width,y.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?y.mipmaps.length:1}function E(R){let y=R.target;y.removeEventListener("dispose",E),P(y),y.isVideoTexture&&h.delete(y)}function A(R){let y=R.target;y.removeEventListener("dispose",A),x(y)}function P(R){let y=i.get(R);if(y.__webglInit===void 0)return;let O=R.source,X=d.get(O);if(X){let Q=X[y.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&v(R),Object.keys(X).length===0&&d.delete(O)}i.remove(R)}function v(R){let y=i.get(R);n.deleteTexture(y.__webglTexture);let O=R.source,X=d.get(O);delete X[y.__cacheKey],o.memory.textures--}function x(R){let y=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(y.__webglFramebuffer[X]))for(let Q=0;Q<y.__webglFramebuffer[X].length;Q++)n.deleteFramebuffer(y.__webglFramebuffer[X][Q]);else n.deleteFramebuffer(y.__webglFramebuffer[X]);y.__webglDepthbuffer&&n.deleteRenderbuffer(y.__webglDepthbuffer[X])}else{if(Array.isArray(y.__webglFramebuffer))for(let X=0;X<y.__webglFramebuffer.length;X++)n.deleteFramebuffer(y.__webglFramebuffer[X]);else n.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&n.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&n.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let X=0;X<y.__webglColorRenderbuffer.length;X++)y.__webglColorRenderbuffer[X]&&n.deleteRenderbuffer(y.__webglColorRenderbuffer[X]);y.__webglDepthRenderbuffer&&n.deleteRenderbuffer(y.__webglDepthRenderbuffer)}let O=R.textures;for(let X=0,Q=O.length;X<Q;X++){let $=i.get(O[X]);$.__webglTexture&&(n.deleteTexture($.__webglTexture),o.memory.textures--),i.remove(O[X])}i.remove(R)}let C=0;function D(){C=0}function k(){let R=C;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),C+=1,R}function H(R){let y=[];return y.push(R.wrapS),y.push(R.wrapT),y.push(R.wrapR||0),y.push(R.magFilter),y.push(R.minFilter),y.push(R.anisotropy),y.push(R.internalFormat),y.push(R.format),y.push(R.type),y.push(R.generateMipmaps),y.push(R.premultiplyAlpha),y.push(R.flipY),y.push(R.unpackAlignment),y.push(R.colorSpace),y.join()}function Y(R,y){let O=i.get(R);if(R.isVideoTexture&&Wt(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&O.__version!==R.version){let X=R.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(O,R,y);return}}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+y)}function W(R,y){let O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){Z(O,R,y);return}e.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+y)}function ot(R,y){let O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){Z(O,R,y);return}e.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+y)}function G(R,y){let O=i.get(R);if(R.version>0&&O.__version!==R.version){tt(O,R,y);return}e.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+y)}let ct={[cr]:n.REPEAT,[ji]:n.CLAMP_TO_EDGE,[La]:n.MIRRORED_REPEAT},J={[dn]:n.NEAREST,[Ef]:n.NEAREST_MIPMAP_NEAREST,[Eo]:n.NEAREST_MIPMAP_LINEAR,[$n]:n.LINEAR,[hl]:n.LINEAR_MIPMAP_NEAREST,[is]:n.LINEAR_MIPMAP_LINEAR},j={[Cf]:n.NEVER,[Nf]:n.ALWAYS,[If]:n.LESS,[Uh]:n.LEQUAL,[Pf]:n.EQUAL,[Uf]:n.GEQUAL,[Lf]:n.GREATER,[Df]:n.NOTEQUAL};function mt(R,y){if(y.type===Zn&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===$n||y.magFilter===hl||y.magFilter===Eo||y.magFilter===is||y.minFilter===$n||y.minFilter===hl||y.minFilter===Eo||y.minFilter===is)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,ct[y.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,ct[y.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,ct[y.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,J[y.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,J[y.minFilter]),y.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,j[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===dn||y.minFilter!==Eo&&y.minFilter!==is||y.type===Zn&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||i.get(y).__currentAnisotropy){let O=t.get("EXT_texture_filter_anisotropic");n.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),i.get(y).__currentAnisotropy=y.anisotropy}}}function Nt(R,y){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,y.addEventListener("dispose",E));let X=y.source,Q=d.get(X);Q===void 0&&(Q={},d.set(X,Q));let $=H(y);if($!==R.__cacheKey){Q[$]===void 0&&(Q[$]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,O=!0),Q[$].usedTimes++;let Et=Q[R.__cacheKey];Et!==void 0&&(Q[R.__cacheKey].usedTimes--,Et.usedTimes===0&&v(y)),R.__cacheKey=$,R.__webglTexture=Q[$].texture}return O}function he(R,y,O){return Math.floor(Math.floor(R/O)/y)}function Jt(R,y,O,X){let $=R.updateRanges;if($.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,y.width,y.height,O,X,y.data);else{$.sort((st,ft)=>st.start-ft.start);let Et=0;for(let st=1;st<$.length;st++){let ft=$[Et],Lt=$[st],wt=ft.start+ft.count,ut=he(Lt.start,y.width,4),Vt=he(ft.start,y.width,4);Lt.start<=wt+1&&ut===Vt&&he(Lt.start+Lt.count-1,y.width,4)===ut?ft.count=Math.max(ft.count,Lt.start+Lt.count-ft.start):(++Et,$[Et]=Lt)}$.length=Et+1;let at=n.getParameter(n.UNPACK_ROW_LENGTH),bt=n.getParameter(n.UNPACK_SKIP_PIXELS),St=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,y.width);for(let st=0,ft=$.length;st<ft;st++){let Lt=$[st],wt=Math.floor(Lt.start/4),ut=Math.ceil(Lt.count/4),Vt=wt%y.width,U=Math.floor(wt/y.width),rt=ut,lt=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Vt),n.pixelStorei(n.UNPACK_SKIP_ROWS,U),e.texSubImage2D(n.TEXTURE_2D,0,Vt,U,rt,lt,O,X,y.data)}R.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,at),n.pixelStorei(n.UNPACK_SKIP_PIXELS,bt),n.pixelStorei(n.UNPACK_SKIP_ROWS,St)}}function Z(R,y,O){let X=n.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(X=n.TEXTURE_2D_ARRAY),y.isData3DTexture&&(X=n.TEXTURE_3D);let Q=Nt(R,y),$=y.source;e.bindTexture(X,R.__webglTexture,n.TEXTURE0+O);let Et=i.get($);if($.version!==Et.__version||Q===!0){e.activeTexture(n.TEXTURE0+O);let at=jt.getPrimaries(jt.workingColorSpace),bt=y.colorSpace===Kn?null:jt.getPrimaries(y.colorSpace),St=y.colorSpace===Kn||at===bt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,y.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,y.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,St);let st=_(y.image,!1,s.maxTextureSize);st=Oe(y,st);let ft=r.convert(y.format,y.colorSpace),Lt=r.convert(y.type),wt=w(y.internalFormat,ft,Lt,y.colorSpace,y.isVideoTexture);mt(X,y);let ut,Vt=y.mipmaps,U=y.isVideoTexture!==!0,rt=Et.__version===void 0||Q===!0,lt=$.dataReady,gt=T(y,st);if(y.isDepthTexture)wt=M(y.format===wr,y.type),rt&&(U?e.texStorage2D(n.TEXTURE_2D,1,wt,st.width,st.height):e.texImage2D(n.TEXTURE_2D,0,wt,st.width,st.height,0,ft,Lt,null));else if(y.isDataTexture)if(Vt.length>0){U&&rt&&e.texStorage2D(n.TEXTURE_2D,gt,wt,Vt[0].width,Vt[0].height);for(let nt=0,K=Vt.length;nt<K;nt++)ut=Vt[nt],U?lt&&e.texSubImage2D(n.TEXTURE_2D,nt,0,0,ut.width,ut.height,ft,Lt,ut.data):e.texImage2D(n.TEXTURE_2D,nt,wt,ut.width,ut.height,0,ft,Lt,ut.data);y.generateMipmaps=!1}else U?(rt&&e.texStorage2D(n.TEXTURE_2D,gt,wt,st.width,st.height),lt&&Jt(y,st,ft,Lt)):e.texImage2D(n.TEXTURE_2D,0,wt,st.width,st.height,0,ft,Lt,st.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){U&&rt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,gt,wt,Vt[0].width,Vt[0].height,st.depth);for(let nt=0,K=Vt.length;nt<K;nt++)if(ut=Vt[nt],y.format!==Ln)if(ft!==null)if(U){if(lt)if(y.layerUpdates.size>0){let yt=Hh(ut.width,ut.height,y.format,y.type);for(let Ot of y.layerUpdates){let fe=ut.data.subarray(Ot*yt/ut.data.BYTES_PER_ELEMENT,(Ot+1)*yt/ut.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,nt,0,0,Ot,ut.width,ut.height,1,ft,fe)}y.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,nt,0,0,0,ut.width,ut.height,st.depth,ft,ut.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,nt,wt,ut.width,ut.height,st.depth,0,ut.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else U?lt&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,nt,0,0,0,ut.width,ut.height,st.depth,ft,Lt,ut.data):e.texImage3D(n.TEXTURE_2D_ARRAY,nt,wt,ut.width,ut.height,st.depth,0,ft,Lt,ut.data)}else{U&&rt&&e.texStorage2D(n.TEXTURE_2D,gt,wt,Vt[0].width,Vt[0].height);for(let nt=0,K=Vt.length;nt<K;nt++)ut=Vt[nt],y.format!==Ln?ft!==null?U?lt&&e.compressedTexSubImage2D(n.TEXTURE_2D,nt,0,0,ut.width,ut.height,ft,ut.data):e.compressedTexImage2D(n.TEXTURE_2D,nt,wt,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):U?lt&&e.texSubImage2D(n.TEXTURE_2D,nt,0,0,ut.width,ut.height,ft,Lt,ut.data):e.texImage2D(n.TEXTURE_2D,nt,wt,ut.width,ut.height,0,ft,Lt,ut.data)}else if(y.isDataArrayTexture)if(U){if(rt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,gt,wt,st.width,st.height,st.depth),lt)if(y.layerUpdates.size>0){let nt=Hh(st.width,st.height,y.format,y.type);for(let K of y.layerUpdates){let yt=st.data.subarray(K*nt/st.data.BYTES_PER_ELEMENT,(K+1)*nt/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,K,st.width,st.height,1,ft,Lt,yt)}y.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,ft,Lt,st.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,wt,st.width,st.height,st.depth,0,ft,Lt,st.data);else if(y.isData3DTexture)U?(rt&&e.texStorage3D(n.TEXTURE_3D,gt,wt,st.width,st.height,st.depth),lt&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,ft,Lt,st.data)):e.texImage3D(n.TEXTURE_3D,0,wt,st.width,st.height,st.depth,0,ft,Lt,st.data);else if(y.isFramebufferTexture){if(rt)if(U)e.texStorage2D(n.TEXTURE_2D,gt,wt,st.width,st.height);else{let nt=st.width,K=st.height;for(let yt=0;yt<gt;yt++)e.texImage2D(n.TEXTURE_2D,yt,wt,nt,K,0,ft,Lt,null),nt>>=1,K>>=1}}else if(Vt.length>0){if(U&&rt){let nt=Te(Vt[0]);e.texStorage2D(n.TEXTURE_2D,gt,wt,nt.width,nt.height)}for(let nt=0,K=Vt.length;nt<K;nt++)ut=Vt[nt],U?lt&&e.texSubImage2D(n.TEXTURE_2D,nt,0,0,ft,Lt,ut):e.texImage2D(n.TEXTURE_2D,nt,wt,ft,Lt,ut);y.generateMipmaps=!1}else if(U){if(rt){let nt=Te(st);e.texStorage2D(n.TEXTURE_2D,gt,wt,nt.width,nt.height)}lt&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,ft,Lt,st)}else e.texImage2D(n.TEXTURE_2D,0,wt,ft,Lt,st);m(y)&&f(X),Et.__version=$.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function tt(R,y,O){if(y.image.length!==6)return;let X=Nt(R,y),Q=y.source;e.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+O);let $=i.get(Q);if(Q.version!==$.__version||X===!0){e.activeTexture(n.TEXTURE0+O);let Et=jt.getPrimaries(jt.workingColorSpace),at=y.colorSpace===Kn?null:jt.getPrimaries(y.colorSpace),bt=y.colorSpace===Kn||Et===at?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,y.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,y.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,bt);let St=y.isCompressedTexture||y.image[0].isCompressedTexture,st=y.image[0]&&y.image[0].isDataTexture,ft=[];for(let K=0;K<6;K++)!St&&!st?ft[K]=_(y.image[K],!0,s.maxCubemapSize):ft[K]=st?y.image[K].image:y.image[K],ft[K]=Oe(y,ft[K]);let Lt=ft[0],wt=r.convert(y.format,y.colorSpace),ut=r.convert(y.type),Vt=w(y.internalFormat,wt,ut,y.colorSpace),U=y.isVideoTexture!==!0,rt=$.__version===void 0||X===!0,lt=Q.dataReady,gt=T(y,Lt);mt(n.TEXTURE_CUBE_MAP,y);let nt;if(St){U&&rt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,gt,Vt,Lt.width,Lt.height);for(let K=0;K<6;K++){nt=ft[K].mipmaps;for(let yt=0;yt<nt.length;yt++){let Ot=nt[yt];y.format!==Ln?wt!==null?U?lt&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,yt,0,0,Ot.width,Ot.height,wt,Ot.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,yt,Vt,Ot.width,Ot.height,0,Ot.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?lt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,yt,0,0,Ot.width,Ot.height,wt,ut,Ot.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,yt,Vt,Ot.width,Ot.height,0,wt,ut,Ot.data)}}}else{if(nt=y.mipmaps,U&&rt){nt.length>0&&gt++;let K=Te(ft[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,gt,Vt,K.width,K.height)}for(let K=0;K<6;K++)if(st){U?lt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,ft[K].width,ft[K].height,wt,ut,ft[K].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Vt,ft[K].width,ft[K].height,0,wt,ut,ft[K].data);for(let yt=0;yt<nt.length;yt++){let fe=nt[yt].image[K].image;U?lt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,yt+1,0,0,fe.width,fe.height,wt,ut,fe.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,yt+1,Vt,fe.width,fe.height,0,wt,ut,fe.data)}}else{U?lt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,wt,ut,ft[K]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Vt,wt,ut,ft[K]);for(let yt=0;yt<nt.length;yt++){let Ot=nt[yt];U?lt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,yt+1,0,0,wt,ut,Ot.image[K]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,yt+1,Vt,wt,ut,Ot.image[K])}}}m(y)&&f(n.TEXTURE_CUBE_MAP),$.__version=Q.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function _t(R,y,O,X,Q,$){let Et=r.convert(O.format,O.colorSpace),at=r.convert(O.type),bt=w(O.internalFormat,Et,at,O.colorSpace),St=i.get(y),st=i.get(O);if(st.__renderTarget=y,!St.__hasExternalTextures){let ft=Math.max(1,y.width>>$),Lt=Math.max(1,y.height>>$);Q===n.TEXTURE_3D||Q===n.TEXTURE_2D_ARRAY?e.texImage3D(Q,$,bt,ft,Lt,y.depth,0,Et,at,null):e.texImage2D(Q,$,bt,ft,Lt,0,Et,at,null)}e.bindFramebuffer(n.FRAMEBUFFER,R),Mt(y)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,X,Q,st.__webglTexture,0,ve(y)):(Q===n.TEXTURE_2D||Q>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,X,Q,st.__webglTexture,$),e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ft(R,y,O){if(n.bindRenderbuffer(n.RENDERBUFFER,R),y.depthBuffer){let X=y.depthTexture,Q=X&&X.isDepthTexture?X.type:null,$=M(y.stencilBuffer,Q),Et=y.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,at=ve(y);Mt(y)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,at,$,y.width,y.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,at,$,y.width,y.height):n.renderbufferStorage(n.RENDERBUFFER,$,y.width,y.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Et,n.RENDERBUFFER,R)}else{let X=y.textures;for(let Q=0;Q<X.length;Q++){let $=X[Q],Et=r.convert($.format,$.colorSpace),at=r.convert($.type),bt=w($.internalFormat,Et,at,$.colorSpace),St=ve(y);O&&Mt(y)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,St,bt,y.width,y.height):Mt(y)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,St,bt,y.width,y.height):n.renderbufferStorage(n.RENDERBUFFER,bt,y.width,y.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function At(R,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,R),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let X=i.get(y.depthTexture);X.__renderTarget=y,(!X.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),Y(y.depthTexture,0);let Q=X.__webglTexture,$=ve(y);if(y.depthTexture.format===hr)Mt(y)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0,$):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0);else if(y.depthTexture.format===wr)Mt(y)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0,$):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function Zt(R){let y=i.get(R),O=R.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==R.depthTexture){let X=R.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),X){let Q=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,X.removeEventListener("dispose",Q)};X.addEventListener("dispose",Q),y.__depthDisposeCallback=Q}y.__boundDepthTexture=X}if(R.depthTexture&&!y.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");let X=R.texture.mipmaps;X&&X.length>0?At(y.__webglFramebuffer[0],R):At(y.__webglFramebuffer,R)}else if(O){y.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(e.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer[X]),y.__webglDepthbuffer[X]===void 0)y.__webglDepthbuffer[X]=n.createRenderbuffer(),Ft(y.__webglDepthbuffer[X],R,!1);else{let Q=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,$=y.__webglDepthbuffer[X];n.bindRenderbuffer(n.RENDERBUFFER,$),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,$)}}else{let X=R.texture.mipmaps;if(X&&X.length>0?e.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=n.createRenderbuffer(),Ft(y.__webglDepthbuffer,R,!1);else{let Q=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,$=y.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,$),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,$)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ze(R,y,O){let X=i.get(R);y!==void 0&&_t(X.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&Zt(R)}function L(R){let y=R.texture,O=i.get(R),X=i.get(y);R.addEventListener("dispose",A);let Q=R.textures,$=R.isWebGLCubeRenderTarget===!0,Et=Q.length>1;if(Et||(X.__webglTexture===void 0&&(X.__webglTexture=n.createTexture()),X.__version=y.version,o.memory.textures++),$){O.__webglFramebuffer=[];for(let at=0;at<6;at++)if(y.mipmaps&&y.mipmaps.length>0){O.__webglFramebuffer[at]=[];for(let bt=0;bt<y.mipmaps.length;bt++)O.__webglFramebuffer[at][bt]=n.createFramebuffer()}else O.__webglFramebuffer[at]=n.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){O.__webglFramebuffer=[];for(let at=0;at<y.mipmaps.length;at++)O.__webglFramebuffer[at]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(Et)for(let at=0,bt=Q.length;at<bt;at++){let St=i.get(Q[at]);St.__webglTexture===void 0&&(St.__webglTexture=n.createTexture(),o.memory.textures++)}if(R.samples>0&&Mt(R)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let at=0;at<Q.length;at++){let bt=Q[at];O.__webglColorRenderbuffer[at]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[at]);let St=r.convert(bt.format,bt.colorSpace),st=r.convert(bt.type),ft=w(bt.internalFormat,St,st,bt.colorSpace,R.isXRRenderTarget===!0),Lt=ve(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,Lt,ft,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.RENDERBUFFER,O.__webglColorRenderbuffer[at])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),Ft(O.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if($){e.bindTexture(n.TEXTURE_CUBE_MAP,X.__webglTexture),mt(n.TEXTURE_CUBE_MAP,y);for(let at=0;at<6;at++)if(y.mipmaps&&y.mipmaps.length>0)for(let bt=0;bt<y.mipmaps.length;bt++)_t(O.__webglFramebuffer[at][bt],R,y,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+at,bt);else _t(O.__webglFramebuffer[at],R,y,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+at,0);m(y)&&f(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Et){for(let at=0,bt=Q.length;at<bt;at++){let St=Q[at],st=i.get(St),ft=n.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ft=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(ft,st.__webglTexture),mt(ft,St),_t(O.__webglFramebuffer,R,St,n.COLOR_ATTACHMENT0+at,ft,0),m(St)&&f(ft)}e.unbindTexture()}else{let at=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(at=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(at,X.__webglTexture),mt(at,y),y.mipmaps&&y.mipmaps.length>0)for(let bt=0;bt<y.mipmaps.length;bt++)_t(O.__webglFramebuffer[bt],R,y,n.COLOR_ATTACHMENT0,at,bt);else _t(O.__webglFramebuffer,R,y,n.COLOR_ATTACHMENT0,at,0);m(y)&&f(at),e.unbindTexture()}R.depthBuffer&&Zt(R)}function ye(R){let y=R.textures;for(let O=0,X=y.length;O<X;O++){let Q=y[O];if(m(Q)){let $=S(R),Et=i.get(Q).__webglTexture;e.bindTexture($,Et),f($),e.unbindTexture()}}}let kt=[],Dt=[];function vt(R){if(R.samples>0){if(Mt(R)===!1){let y=R.textures,O=R.width,X=R.height,Q=n.COLOR_BUFFER_BIT,$=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Et=i.get(R),at=y.length>1;if(at)for(let St=0;St<y.length;St++)e.bindFramebuffer(n.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Et.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Et.__webglMultisampledFramebuffer);let bt=R.texture.mipmaps;bt&&bt.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Et.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Et.__webglFramebuffer);for(let St=0;St<y.length;St++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(Q|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(Q|=n.STENCIL_BUFFER_BIT)),at){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Et.__webglColorRenderbuffer[St]);let st=i.get(y[St]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,st,0)}n.blitFramebuffer(0,0,O,X,0,0,O,X,Q,n.NEAREST),l===!0&&(kt.length=0,Dt.length=0,kt.push(n.COLOR_ATTACHMENT0+St),R.depthBuffer&&R.resolveDepthBuffer===!1&&(kt.push($),Dt.push($),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Dt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,kt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),at)for(let St=0;St<y.length;St++){e.bindFramebuffer(n.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.RENDERBUFFER,Et.__webglColorRenderbuffer[St]);let st=i.get(y[St]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Et.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.TEXTURE_2D,st,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Et.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){let y=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[y])}}}function ve(R){return Math.min(s.maxSamples,R.samples)}function Mt(R){let y=i.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function Wt(R){let y=o.render.frame;h.get(R)!==y&&(h.set(R,y),R.update())}function Oe(R,y){let O=R.colorSpace,X=R.format,Q=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==ws&&O!==Kn&&(jt.getTransfer(O)===oe?(X!==Ln||Q!==Yn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),y}function Te(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=D,this.setTexture2D=Y,this.setTexture2DArray=W,this.setTexture3D=ot,this.setTextureCube=G,this.rebindTextures=Ze,this.setupRenderTarget=L,this.updateRenderTargetMipmap=ye,this.updateMultisampleRenderTarget=vt,this.setupDepthRenderbuffer=Zt,this.setupFrameBufferTexture=_t,this.useMultisampledRTT=Mt}function uM(n,t){function e(i,s=Kn){let r,o=jt.getTransfer(s);if(i===Yn)return n.UNSIGNED_BYTE;if(i===dl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===fl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Ch)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Ih)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Ah)return n.BYTE;if(i===Rh)return n.SHORT;if(i===Mr)return n.UNSIGNED_SHORT;if(i===ul)return n.INT;if(i===ss)return n.UNSIGNED_INT;if(i===Zn)return n.FLOAT;if(i===br)return n.HALF_FLOAT;if(i===Ph)return n.ALPHA;if(i===Lh)return n.RGB;if(i===Ln)return n.RGBA;if(i===hr)return n.DEPTH_COMPONENT;if(i===wr)return n.DEPTH_STENCIL;if(i===pl)return n.RED;if(i===ml)return n.RED_INTEGER;if(i===Dh)return n.RG;if(i===gl)return n.RG_INTEGER;if(i===_l)return n.RGBA_INTEGER;if(i===To||i===Ao||i===Ro||i===Co)if(o===oe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===To)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ao)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ro)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Co)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===To)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ao)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ro)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Co)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===xl||i===yl||i===vl||i===Ml)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===xl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===yl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===vl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ml)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===bl||i===Sl||i===wl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===bl||i===Sl)return o===oe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===wl)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===El||i===Tl||i===Al||i===Rl||i===Cl||i===Il||i===Pl||i===Ll||i===Dl||i===Ul||i===Nl||i===Fl||i===Ol||i===kl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===El)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Tl)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Al)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Rl)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Cl)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Il)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Pl)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ll)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Dl)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ul)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Nl)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Fl)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ol)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===kl)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Bl||i===zl||i===Hl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===Bl)return o===oe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===zl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Hl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Vl||i===Gl||i===Wl||i===$l)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===Vl)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Gl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Wl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===$l)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Sr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}var dM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,fM=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,tu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let i=new ho(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,i=new Xn({vertexShader:dM,fragmentShader:fM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new q(new ln(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},eu=class extends hi{constructor(t,e){super();let i=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,g=null,_=typeof XRWebGLBinding<"u",m=new tu,f={},S=e.getContextAttributes(),w=null,M=null,T=[],E=[],A=new Tt,P=null,v=new He;v.viewport=new re;let x=new He;x.viewport=new re;let C=[v,x],D=new ja,k=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let tt=T[Z];return tt===void 0&&(tt=new mr,T[Z]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(Z){let tt=T[Z];return tt===void 0&&(tt=new mr,T[Z]=tt),tt.getGripSpace()},this.getHand=function(Z){let tt=T[Z];return tt===void 0&&(tt=new mr,T[Z]=tt),tt.getHandSpace()};function Y(Z){let tt=E.indexOf(Z.inputSource);if(tt===-1)return;let _t=T[tt];_t!==void 0&&(_t.update(Z.inputSource,Z.frame,c||o),_t.dispatchEvent({type:Z.type,data:Z.inputSource}))}function W(){s.removeEventListener("select",Y),s.removeEventListener("selectstart",Y),s.removeEventListener("selectend",Y),s.removeEventListener("squeeze",Y),s.removeEventListener("squeezestart",Y),s.removeEventListener("squeezeend",Y),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",ot);for(let Z=0;Z<T.length;Z++){let tt=E[Z];tt!==null&&(E[Z]=null,T[Z].disconnect(tt))}k=null,H=null,m.reset();for(let Z in f)delete f[Z];t.setRenderTarget(w),p=null,d=null,u=null,s=null,M=null,Jt.stop(),i.isPresenting=!1,t.setPixelRatio(P),t.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(w=t.getRenderTarget(),s.addEventListener("select",Y),s.addEventListener("selectstart",Y),s.addEventListener("selectend",Y),s.addEventListener("squeeze",Y),s.addEventListener("squeezestart",Y),s.addEventListener("squeezeend",Y),s.addEventListener("end",W),s.addEventListener("inputsourceschange",ot),S.xrCompatible!==!0&&await e.makeXRCompatible(),P=t.getPixelRatio(),t.getSize(A),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let _t=null,Ft=null,At=null;S.depth&&(At=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,_t=S.stencil?wr:hr,Ft=S.stencil?Sr:ss);let Zt={colorFormat:e.RGBA8,depthFormat:At,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Zt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),M=new ui(d.textureWidth,d.textureHeight,{format:Ln,type:Yn,depthTexture:new co(d.textureWidth,d.textureHeight,Ft,void 0,void 0,void 0,void 0,void 0,void 0,_t),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let _t={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,_t),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),M=new ui(p.framebufferWidth,p.framebufferHeight,{format:Ln,type:Yn,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Jt.setContext(s),Jt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function ot(Z){for(let tt=0;tt<Z.removed.length;tt++){let _t=Z.removed[tt],Ft=E.indexOf(_t);Ft>=0&&(E[Ft]=null,T[Ft].disconnect(_t))}for(let tt=0;tt<Z.added.length;tt++){let _t=Z.added[tt],Ft=E.indexOf(_t);if(Ft===-1){for(let Zt=0;Zt<T.length;Zt++)if(Zt>=E.length){E.push(_t),Ft=Zt;break}else if(E[Zt]===null){E[Zt]=_t,Ft=Zt;break}if(Ft===-1)break}let At=T[Ft];At&&At.connect(_t)}}let G=new I,ct=new I;function J(Z,tt,_t){G.setFromMatrixPosition(tt.matrixWorld),ct.setFromMatrixPosition(_t.matrixWorld);let Ft=G.distanceTo(ct),At=tt.projectionMatrix.elements,Zt=_t.projectionMatrix.elements,Ze=At[14]/(At[10]-1),L=At[14]/(At[10]+1),ye=(At[9]+1)/At[5],kt=(At[9]-1)/At[5],Dt=(At[8]-1)/At[0],vt=(Zt[8]+1)/Zt[0],ve=Ze*Dt,Mt=Ze*vt,Wt=Ft/(-Dt+vt),Oe=Wt*-Dt;if(tt.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(Oe),Z.translateZ(Wt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),At[10]===-1)Z.projectionMatrix.copy(tt.projectionMatrix),Z.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{let Te=Ze+Wt,R=L+Wt,y=ve-Oe,O=Mt+(Ft-Oe),X=ye*L/R*Te,Q=kt*L/R*Te;Z.projectionMatrix.makePerspective(y,O,X,Q,Te,R),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function j(Z,tt){tt===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(tt.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let tt=Z.near,_t=Z.far;m.texture!==null&&(m.depthNear>0&&(tt=m.depthNear),m.depthFar>0&&(_t=m.depthFar)),D.near=x.near=v.near=tt,D.far=x.far=v.far=_t,(k!==D.near||H!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),k=D.near,H=D.far),D.layers.mask=Z.layers.mask|6,v.layers.mask=D.layers.mask&3,x.layers.mask=D.layers.mask&5;let Ft=Z.parent,At=D.cameras;j(D,Ft);for(let Zt=0;Zt<At.length;Zt++)j(At[Zt],Ft);At.length===2?J(D,v,x):D.projectionMatrix.copy(v.projectionMatrix),mt(Z,D,Ft)};function mt(Z,tt,_t){_t===null?Z.matrix.copy(tt.matrixWorld):(Z.matrix.copy(_t.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(tt.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(tt.projectionMatrix),Z.projectionMatrixInverse.copy(tt.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=ur*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(Z){l=Z,d!==null&&(d.fixedFoveation=Z),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Z)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(D)},this.getCameraTexture=function(Z){return f[Z]};let Nt=null;function he(Z,tt){if(h=tt.getViewerPose(c||o),g=tt,h!==null){let _t=h.views;p!==null&&(t.setRenderTargetFramebuffer(M,p.framebuffer),t.setRenderTarget(M));let Ft=!1;_t.length!==D.cameras.length&&(D.cameras.length=0,Ft=!0);for(let L=0;L<_t.length;L++){let ye=_t[L],kt=null;if(p!==null)kt=p.getViewport(ye);else{let vt=u.getViewSubImage(d,ye);kt=vt.viewport,L===0&&(t.setRenderTargetTextures(M,vt.colorTexture,vt.depthStencilTexture),t.setRenderTarget(M))}let Dt=C[L];Dt===void 0&&(Dt=new He,Dt.layers.enable(L),Dt.viewport=new re,C[L]=Dt),Dt.matrix.fromArray(ye.transform.matrix),Dt.matrix.decompose(Dt.position,Dt.quaternion,Dt.scale),Dt.projectionMatrix.fromArray(ye.projectionMatrix),Dt.projectionMatrixInverse.copy(Dt.projectionMatrix).invert(),Dt.viewport.set(kt.x,kt.y,kt.width,kt.height),L===0&&(D.matrix.copy(Dt.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),Ft===!0&&D.cameras.push(Dt)}let At=s.enabledFeatures;if(At&&At.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=i.getBinding();let L=u.getDepthInformation(_t[0]);L&&L.isValid&&L.texture&&m.init(L,s.renderState)}if(At&&At.includes("camera-access")&&_){t.state.unbindTexture(),u=i.getBinding();for(let L=0;L<_t.length;L++){let ye=_t[L].camera;if(ye){let kt=f[ye];kt||(kt=new ho,f[ye]=kt);let Dt=u.getCameraImage(ye);kt.sourceTexture=Dt}}}}for(let _t=0;_t<T.length;_t++){let Ft=E[_t],At=T[_t];Ft!==null&&At!==void 0&&At.update(Ft,tt,c||o)}Nt&&Nt(Z,tt),tt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:tt}),g=null}let Jt=new hp;Jt.setAnimationLoop(he),this.setAnimationLoop=function(Z){Nt=Z},this.dispose=function(){}}},Ls=new In,pM=new ae;function mM(n,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,kh(n)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,S,w,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,M)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,S,w):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===We&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===We&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let S=t.get(f),w=S.envMap,M=S.envMapRotation;w&&(m.envMap.value=w,Ls.copy(M),Ls.x*=-1,Ls.y*=-1,Ls.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Ls.y*=-1,Ls.z*=-1),m.envMapRotation.value.setFromMatrix4(pM.makeRotationFromEuler(Ls)),m.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,S,w){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*S,m.scale.value=w*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,S){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===We&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){let S=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function gM(n,t,e,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,w){let M=w.program;i.uniformBlockBinding(S,M)}function c(S,w){let M=s[S.id];M===void 0&&(g(S),M=h(S),s[S.id]=M,S.addEventListener("dispose",m));let T=w.program;i.updateUBOMapping(S,T);let E=t.render.frame;r[S.id]!==E&&(d(S),r[S.id]=E)}function h(S){let w=u();S.__bindingPointIndex=w;let M=n.createBuffer(),T=S.__size,E=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,T,E),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,w,M),M}function u(){for(let S=0;S<a;S++)if(o.indexOf(S)===-1)return o.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(S){let w=s[S.id],M=S.uniforms,T=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,w);for(let E=0,A=M.length;E<A;E++){let P=Array.isArray(M[E])?M[E]:[M[E]];for(let v=0,x=P.length;v<x;v++){let C=P[v];if(p(C,E,v,T)===!0){let D=C.__offset,k=Array.isArray(C.value)?C.value:[C.value],H=0;for(let Y=0;Y<k.length;Y++){let W=k[Y],ot=_(W);typeof W=="number"||typeof W=="boolean"?(C.__data[0]=W,n.bufferSubData(n.UNIFORM_BUFFER,D+H,C.__data)):W.isMatrix3?(C.__data[0]=W.elements[0],C.__data[1]=W.elements[1],C.__data[2]=W.elements[2],C.__data[3]=0,C.__data[4]=W.elements[3],C.__data[5]=W.elements[4],C.__data[6]=W.elements[5],C.__data[7]=0,C.__data[8]=W.elements[6],C.__data[9]=W.elements[7],C.__data[10]=W.elements[8],C.__data[11]=0):(W.toArray(C.__data,H),H+=ot.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,D,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(S,w,M,T){let E=S.value,A=w+"_"+M;if(T[A]===void 0)return typeof E=="number"||typeof E=="boolean"?T[A]=E:T[A]=E.clone(),!0;{let P=T[A];if(typeof E=="number"||typeof E=="boolean"){if(P!==E)return T[A]=E,!0}else if(P.equals(E)===!1)return P.copy(E),!0}return!1}function g(S){let w=S.uniforms,M=0,T=16;for(let A=0,P=w.length;A<P;A++){let v=Array.isArray(w[A])?w[A]:[w[A]];for(let x=0,C=v.length;x<C;x++){let D=v[x],k=Array.isArray(D.value)?D.value:[D.value];for(let H=0,Y=k.length;H<Y;H++){let W=k[H],ot=_(W),G=M%T,ct=G%ot.boundary,J=G+ct;M+=ct,J!==0&&T-J<ot.storage&&(M+=T-J),D.__data=new Float32Array(ot.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=M,M+=ot.storage}}}let E=M%T;return E>0&&(M+=T-E),S.__size=M,S.__cache={},this}function _(S){let w={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(w.boundary=4,w.storage=4):S.isVector2?(w.boundary=8,w.storage=8):S.isVector3||S.isColor?(w.boundary=16,w.storage=12):S.isVector4?(w.boundary=16,w.storage=16):S.isMatrix3?(w.boundary=48,w.storage=48):S.isMatrix4?(w.boundary=64,w.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),w}function m(S){let w=S.target;w.removeEventListener("dispose",m);let M=o.indexOf(w.__bindingPointIndex);o.splice(M,1),n.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function f(){for(let S in s)n.deleteBuffer(s[S]);o=[],s={},r={}}return{bind:l,update:c,dispose:f}}var Kl=class{constructor(t={}){let{canvas:e=Ff(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;let g=new Uint32Array(4),_=new Int32Array(4),m=null,f=null,S=[],w=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Li,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let M=this,T=!1;this._outputColorSpace=Pe;let E=0,A=0,P=null,v=-1,x=null,C=new re,D=new re,k=null,H=new Gt(0),Y=0,W=e.width,ot=e.height,G=1,ct=null,J=null,j=new re(0,0,W,ot),mt=new re(0,0,W,ot),Nt=!1,he=new _r,Jt=!1,Z=!1,tt=new ae,_t=new I,Ft=new re,At={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Zt=!1;function Ze(){return P===null?G:1}let L=i;function ye(b,N){return e.getContext(b,N)}try{let b={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"180"}`),e.addEventListener("webglcontextlost",lt,!1),e.addEventListener("webglcontextrestored",gt,!1),e.addEventListener("webglcontextcreationerror",nt,!1),L===null){let N="webgl2";if(L=ye(N,b),L===null)throw ye(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let kt,Dt,vt,ve,Mt,Wt,Oe,Te,R,y,O,X,Q,$,Et,at,bt,St,st,ft,Lt,wt,ut,Vt;function U(){kt=new Uy(L),kt.init(),wt=new uM(L,kt),Dt=new Ay(L,kt,t,wt),vt=new cM(L,kt),Dt.reversedDepthBuffer&&d&&vt.buffers.depth.setReversed(!0),ve=new Oy(L),Mt=new Kv,Wt=new hM(L,kt,vt,Mt,Dt,wt,ve),Oe=new Cy(M),Te=new Dy(M),R=new G0(L),ut=new Ey(L,R),y=new Ny(L,R,ve,ut),O=new By(L,y,R,ve),st=new ky(L,Dt,Wt),at=new Ry(Mt),X=new Zv(M,Oe,Te,kt,Dt,ut,at),Q=new mM(M,Mt),$=new jv,Et=new sM(kt),St=new wy(M,Oe,Te,vt,O,p,l),bt=new aM(M,O,Dt),Vt=new gM(L,ve,Dt,vt),ft=new Ty(L,kt,ve),Lt=new Fy(L,kt,ve),ve.programs=X.programs,M.capabilities=Dt,M.extensions=kt,M.properties=Mt,M.renderLists=$,M.shadowMap=bt,M.state=vt,M.info=ve}U();let rt=new eu(M,L);this.xr=rt,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let b=kt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=kt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(b){b!==void 0&&(G=b,this.setSize(W,ot,!1))},this.getSize=function(b){return b.set(W,ot)},this.setSize=function(b,N,B=!0){if(rt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=b,ot=N,e.width=Math.floor(b*G),e.height=Math.floor(N*G),B===!0&&(e.style.width=b+"px",e.style.height=N+"px"),this.setViewport(0,0,b,N)},this.getDrawingBufferSize=function(b){return b.set(W*G,ot*G).floor()},this.setDrawingBufferSize=function(b,N,B){W=b,ot=N,G=B,e.width=Math.floor(b*B),e.height=Math.floor(N*B),this.setViewport(0,0,b,N)},this.getCurrentViewport=function(b){return b.copy(C)},this.getViewport=function(b){return b.copy(j)},this.setViewport=function(b,N,B,z){b.isVector4?j.set(b.x,b.y,b.z,b.w):j.set(b,N,B,z),vt.viewport(C.copy(j).multiplyScalar(G).round())},this.getScissor=function(b){return b.copy(mt)},this.setScissor=function(b,N,B,z){b.isVector4?mt.set(b.x,b.y,b.z,b.w):mt.set(b,N,B,z),vt.scissor(D.copy(mt).multiplyScalar(G).round())},this.getScissorTest=function(){return Nt},this.setScissorTest=function(b){vt.setScissorTest(Nt=b)},this.setOpaqueSort=function(b){ct=b},this.setTransparentSort=function(b){J=b},this.getClearColor=function(b){return b.copy(St.getClearColor())},this.setClearColor=function(){St.setClearColor(...arguments)},this.getClearAlpha=function(){return St.getClearAlpha()},this.setClearAlpha=function(){St.setClearAlpha(...arguments)},this.clear=function(b=!0,N=!0,B=!0){let z=0;if(b){let F=!1;if(P!==null){let it=P.texture.format;F=it===_l||it===gl||it===ml}if(F){let it=P.texture.type,dt=it===Yn||it===ss||it===Mr||it===Sr||it===dl||it===fl,xt=St.getClearColor(),pt=St.getClearAlpha(),Pt=xt.r,Ut=xt.g,Rt=xt.b;dt?(g[0]=Pt,g[1]=Ut,g[2]=Rt,g[3]=pt,L.clearBufferuiv(L.COLOR,0,g)):(_[0]=Pt,_[1]=Ut,_[2]=Rt,_[3]=pt,L.clearBufferiv(L.COLOR,0,_))}else z|=L.COLOR_BUFFER_BIT}N&&(z|=L.DEPTH_BUFFER_BIT),B&&(z|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",lt,!1),e.removeEventListener("webglcontextrestored",gt,!1),e.removeEventListener("webglcontextcreationerror",nt,!1),St.dispose(),$.dispose(),Et.dispose(),Mt.dispose(),Oe.dispose(),Te.dispose(),O.dispose(),ut.dispose(),Vt.dispose(),X.dispose(),rt.dispose(),rt.removeEventListener("sessionstart",ri),rt.removeEventListener("sessionend",ju),us.stop()};function lt(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function gt(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let b=ve.autoReset,N=bt.enabled,B=bt.autoUpdate,z=bt.needsUpdate,F=bt.type;U(),ve.autoReset=b,bt.enabled=N,bt.autoUpdate=B,bt.needsUpdate=z,bt.type=F}function nt(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function K(b){let N=b.target;N.removeEventListener("dispose",K),yt(N)}function yt(b){Ot(b),Mt.remove(b)}function Ot(b){let N=Mt.get(b).programs;N!==void 0&&(N.forEach(function(B){X.releaseProgram(B)}),b.isShaderMaterial&&X.releaseShaderCache(b))}this.renderBufferDirect=function(b,N,B,z,F,it){N===null&&(N=At);let dt=F.isMesh&&F.matrixWorld.determinant()<0,xt=$m(b,N,B,z,F);vt.setMaterial(z,dt);let pt=B.index,Pt=1;if(z.wireframe===!0){if(pt=y.getWireframeAttribute(B),pt===void 0)return;Pt=2}let Ut=B.drawRange,Rt=B.attributes.position,qt=Ut.start*Pt,le=(Ut.start+Ut.count)*Pt;it!==null&&(qt=Math.max(qt,it.start*Pt),le=Math.min(le,(it.start+it.count)*Pt)),pt!==null?(qt=Math.max(qt,0),le=Math.min(le,pt.count)):Rt!=null&&(qt=Math.max(qt,0),le=Math.min(le,Rt.count));let Ee=le-qt;if(Ee<0||Ee===1/0)return;ut.setup(F,z,xt,B,pt);let me,ue=ft;if(pt!==null&&(me=R.get(pt),ue=Lt,ue.setIndex(me)),F.isMesh)z.wireframe===!0?(vt.setLineWidth(z.wireframeLinewidth*Ze()),ue.setMode(L.LINES)):ue.setMode(L.TRIANGLES);else if(F.isLine){let It=z.linewidth;It===void 0&&(It=1),vt.setLineWidth(It*Ze()),F.isLineSegments?ue.setMode(L.LINES):F.isLineLoop?ue.setMode(L.LINE_LOOP):ue.setMode(L.LINE_STRIP)}else F.isPoints?ue.setMode(L.POINTS):F.isSprite&&ue.setMode(L.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)dr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ue.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(kt.get("WEBGL_multi_draw"))ue.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{let It=F._multiDrawStarts,be=F._multiDrawCounts,te=F._multiDrawCount,_n=pt?R.get(pt).bytesPerElement:1,Vs=Mt.get(z).currentProgram.getUniforms();for(let xn=0;xn<te;xn++)Vs.setValue(L,"_gl_DrawID",xn),ue.render(It[xn]/_n,be[xn])}else if(F.isInstancedMesh)ue.renderInstances(qt,Ee,F.count);else if(B.isInstancedBufferGeometry){let It=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,be=Math.min(B.instanceCount,It);ue.renderInstances(qt,Ee,be)}else ue.render(qt,Ee)};function fe(b,N,B){b.transparent===!0&&b.side===fn&&b.forceSinglePass===!1?(b.side=We,b.needsUpdate=!0,ia(b,N,B),b.side=Ri,b.needsUpdate=!0,ia(b,N,B),b.side=fn):ia(b,N,B)}this.compile=function(b,N,B=null){B===null&&(B=b),f=Et.get(B),f.init(N),w.push(f),B.traverseVisible(function(F){F.isLight&&F.layers.test(N.layers)&&(f.pushLight(F),F.castShadow&&f.pushShadow(F))}),b!==B&&b.traverseVisible(function(F){F.isLight&&F.layers.test(N.layers)&&(f.pushLight(F),F.castShadow&&f.pushShadow(F))}),f.setupLights();let z=new Set;return b.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;let it=F.material;if(it)if(Array.isArray(it))for(let dt=0;dt<it.length;dt++){let xt=it[dt];fe(xt,B,F),z.add(xt)}else fe(it,B,F),z.add(it)}),f=w.pop(),z},this.compileAsync=function(b,N,B=null){let z=this.compile(b,N,B);return new Promise(F=>{function it(){if(z.forEach(function(dt){Mt.get(dt).currentProgram.isReady()&&z.delete(dt)}),z.size===0){F(b);return}setTimeout(it,10)}kt.get("KHR_parallel_shader_compile")!==null?it():setTimeout(it,10)})};let ie=null;function yi(b){ie&&ie(b)}function ri(){us.stop()}function ju(){us.start()}let us=new hp;us.setAnimationLoop(yi),typeof self<"u"&&us.setContext(self),this.setAnimationLoop=function(b){ie=b,rt.setAnimationLoop(b),b===null?us.stop():us.start()},rt.addEventListener("sessionstart",ri),rt.addEventListener("sessionend",ju),this.render=function(b,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),rt.enabled===!0&&rt.isPresenting===!0&&(rt.cameraAutoUpdate===!0&&rt.updateCamera(N),N=rt.getCamera()),b.isScene===!0&&b.onBeforeRender(M,b,N,P),f=Et.get(b,w.length),f.init(N),w.push(f),tt.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),he.setFromProjectionMatrix(tt,Wn,N.reversedDepth),Z=this.localClippingEnabled,Jt=at.init(this.clippingPlanes,Z),m=$.get(b,S.length),m.init(),S.push(m),rt.enabled===!0&&rt.isPresenting===!0){let it=M.xr.getDepthSensingMesh();it!==null&&Tc(it,N,-1/0,M.sortObjects)}Tc(b,N,0,M.sortObjects),m.finish(),M.sortObjects===!0&&m.sort(ct,J),Zt=rt.enabled===!1||rt.isPresenting===!1||rt.hasDepthSensing()===!1,Zt&&St.addToRenderList(m,b),this.info.render.frame++,Jt===!0&&at.beginShadows();let B=f.state.shadowsArray;bt.render(B,b,N),Jt===!0&&at.endShadows(),this.info.autoReset===!0&&this.info.reset();let z=m.opaque,F=m.transmissive;if(f.setupLights(),N.isArrayCamera){let it=N.cameras;if(F.length>0)for(let dt=0,xt=it.length;dt<xt;dt++){let pt=it[dt];td(z,F,b,pt)}Zt&&St.render(b);for(let dt=0,xt=it.length;dt<xt;dt++){let pt=it[dt];Qu(m,b,pt,pt.viewport)}}else F.length>0&&td(z,F,b,N),Zt&&St.render(b),Qu(m,b,N);P!==null&&A===0&&(Wt.updateMultisampleRenderTarget(P),Wt.updateRenderTargetMipmap(P)),b.isScene===!0&&b.onAfterRender(M,b,N),ut.resetDefaultState(),v=-1,x=null,w.pop(),w.length>0?(f=w[w.length-1],Jt===!0&&at.setGlobalState(M.clippingPlanes,f.state.camera)):f=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function Tc(b,N,B,z){if(b.visible===!1)return;if(b.layers.test(N.layers)){if(b.isGroup)B=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(N);else if(b.isLight)f.pushLight(b),b.castShadow&&f.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||he.intersectsSprite(b)){z&&Ft.setFromMatrixPosition(b.matrixWorld).applyMatrix4(tt);let dt=O.update(b),xt=b.material;xt.visible&&m.push(b,dt,xt,B,Ft.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||he.intersectsObject(b))){let dt=O.update(b),xt=b.material;if(z&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Ft.copy(b.boundingSphere.center)):(dt.boundingSphere===null&&dt.computeBoundingSphere(),Ft.copy(dt.boundingSphere.center)),Ft.applyMatrix4(b.matrixWorld).applyMatrix4(tt)),Array.isArray(xt)){let pt=dt.groups;for(let Pt=0,Ut=pt.length;Pt<Ut;Pt++){let Rt=pt[Pt],qt=xt[Rt.materialIndex];qt&&qt.visible&&m.push(b,dt,qt,B,Ft.z,Rt)}}else xt.visible&&m.push(b,dt,xt,B,Ft.z,null)}}let it=b.children;for(let dt=0,xt=it.length;dt<xt;dt++)Tc(it[dt],N,B,z)}function Qu(b,N,B,z){let F=b.opaque,it=b.transmissive,dt=b.transparent;f.setupLightsView(B),Jt===!0&&at.setGlobalState(M.clippingPlanes,B),z&&vt.viewport(C.copy(z)),F.length>0&&na(F,N,B),it.length>0&&na(it,N,B),dt.length>0&&na(dt,N,B),vt.buffers.depth.setTest(!0),vt.buffers.depth.setMask(!0),vt.buffers.color.setMask(!0),vt.setPolygonOffset(!1)}function td(b,N,B,z){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[z.id]===void 0&&(f.state.transmissionRenderTarget[z.id]=new ui(1,1,{generateMipmaps:!0,type:kt.has("EXT_color_buffer_half_float")||kt.has("EXT_color_buffer_float")?br:Yn,minFilter:is,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:jt.workingColorSpace}));let it=f.state.transmissionRenderTarget[z.id],dt=z.viewport||C;it.setSize(dt.z*M.transmissionResolutionScale,dt.w*M.transmissionResolutionScale);let xt=M.getRenderTarget(),pt=M.getActiveCubeFace(),Pt=M.getActiveMipmapLevel();M.setRenderTarget(it),M.getClearColor(H),Y=M.getClearAlpha(),Y<1&&M.setClearColor(16777215,.5),M.clear(),Zt&&St.render(B);let Ut=M.toneMapping;M.toneMapping=Li;let Rt=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),f.setupLightsView(z),Jt===!0&&at.setGlobalState(M.clippingPlanes,z),na(b,B,z),Wt.updateMultisampleRenderTarget(it),Wt.updateRenderTargetMipmap(it),kt.has("WEBGL_multisampled_render_to_texture")===!1){let qt=!1;for(let le=0,Ee=N.length;le<Ee;le++){let me=N[le],ue=me.object,It=me.geometry,be=me.material,te=me.group;if(be.side===fn&&ue.layers.test(z.layers)){let _n=be.side;be.side=We,be.needsUpdate=!0,ed(ue,B,z,It,be,te),be.side=_n,be.needsUpdate=!0,qt=!0}}qt===!0&&(Wt.updateMultisampleRenderTarget(it),Wt.updateRenderTargetMipmap(it))}M.setRenderTarget(xt,pt,Pt),M.setClearColor(H,Y),Rt!==void 0&&(z.viewport=Rt),M.toneMapping=Ut}function na(b,N,B){let z=N.isScene===!0?N.overrideMaterial:null;for(let F=0,it=b.length;F<it;F++){let dt=b[F],xt=dt.object,pt=dt.geometry,Pt=dt.group,Ut=dt.material;Ut.allowOverride===!0&&z!==null&&(Ut=z),xt.layers.test(B.layers)&&ed(xt,N,B,pt,Ut,Pt)}}function ed(b,N,B,z,F,it){b.onBeforeRender(M,N,B,z,F,it),b.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),F.onBeforeRender(M,N,B,z,b,it),F.transparent===!0&&F.side===fn&&F.forceSinglePass===!1?(F.side=We,F.needsUpdate=!0,M.renderBufferDirect(B,N,z,F,b,it),F.side=Ri,F.needsUpdate=!0,M.renderBufferDirect(B,N,z,F,b,it),F.side=fn):M.renderBufferDirect(B,N,z,F,b,it),b.onAfterRender(M,N,B,z,F,it)}function ia(b,N,B){N.isScene!==!0&&(N=At);let z=Mt.get(b),F=f.state.lights,it=f.state.shadowsArray,dt=F.state.version,xt=X.getParameters(b,F.state,it,N,B),pt=X.getProgramCacheKey(xt),Pt=z.programs;z.environment=b.isMeshStandardMaterial?N.environment:null,z.fog=N.fog,z.envMap=(b.isMeshStandardMaterial?Te:Oe).get(b.envMap||z.environment),z.envMapRotation=z.environment!==null&&b.envMap===null?N.environmentRotation:b.envMapRotation,Pt===void 0&&(b.addEventListener("dispose",K),Pt=new Map,z.programs=Pt);let Ut=Pt.get(pt);if(Ut!==void 0){if(z.currentProgram===Ut&&z.lightsStateVersion===dt)return id(b,xt),Ut}else xt.uniforms=X.getUniforms(b),b.onBeforeCompile(xt,M),Ut=X.acquireProgram(xt,pt),Pt.set(pt,Ut),z.uniforms=xt.uniforms;let Rt=z.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Rt.clippingPlanes=at.uniform),id(b,xt),z.needsLights=qm(b),z.lightsStateVersion=dt,z.needsLights&&(Rt.ambientLightColor.value=F.state.ambient,Rt.lightProbe.value=F.state.probe,Rt.directionalLights.value=F.state.directional,Rt.directionalLightShadows.value=F.state.directionalShadow,Rt.spotLights.value=F.state.spot,Rt.spotLightShadows.value=F.state.spotShadow,Rt.rectAreaLights.value=F.state.rectArea,Rt.ltc_1.value=F.state.rectAreaLTC1,Rt.ltc_2.value=F.state.rectAreaLTC2,Rt.pointLights.value=F.state.point,Rt.pointLightShadows.value=F.state.pointShadow,Rt.hemisphereLights.value=F.state.hemi,Rt.directionalShadowMap.value=F.state.directionalShadowMap,Rt.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Rt.spotShadowMap.value=F.state.spotShadowMap,Rt.spotLightMatrix.value=F.state.spotLightMatrix,Rt.spotLightMap.value=F.state.spotLightMap,Rt.pointShadowMap.value=F.state.pointShadowMap,Rt.pointShadowMatrix.value=F.state.pointShadowMatrix),z.currentProgram=Ut,z.uniformsList=null,Ut}function nd(b){if(b.uniformsList===null){let N=b.currentProgram.getUniforms();b.uniformsList=Rr.seqWithValue(N.seq,b.uniforms)}return b.uniformsList}function id(b,N){let B=Mt.get(b);B.outputColorSpace=N.outputColorSpace,B.batching=N.batching,B.batchingColor=N.batchingColor,B.instancing=N.instancing,B.instancingColor=N.instancingColor,B.instancingMorph=N.instancingMorph,B.skinning=N.skinning,B.morphTargets=N.morphTargets,B.morphNormals=N.morphNormals,B.morphColors=N.morphColors,B.morphTargetsCount=N.morphTargetsCount,B.numClippingPlanes=N.numClippingPlanes,B.numIntersection=N.numClipIntersection,B.vertexAlphas=N.vertexAlphas,B.vertexTangents=N.vertexTangents,B.toneMapping=N.toneMapping}function $m(b,N,B,z,F){N.isScene!==!0&&(N=At),Wt.resetTextureUnits();let it=N.fog,dt=z.isMeshStandardMaterial?N.environment:null,xt=P===null?M.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:ws,pt=(z.isMeshStandardMaterial?Te:Oe).get(z.envMap||dt),Pt=z.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Ut=!!B.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Rt=!!B.morphAttributes.position,qt=!!B.morphAttributes.normal,le=!!B.morphAttributes.color,Ee=Li;z.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(Ee=M.toneMapping);let me=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,ue=me!==void 0?me.length:0,It=Mt.get(z),be=f.state.lights;if(Jt===!0&&(Z===!0||b!==x)){let nn=b===x&&z.id===v;at.setState(z,b,nn)}let te=!1;z.version===It.__version?(It.needsLights&&It.lightsStateVersion!==be.state.version||It.outputColorSpace!==xt||F.isBatchedMesh&&It.batching===!1||!F.isBatchedMesh&&It.batching===!0||F.isBatchedMesh&&It.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&It.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&It.instancing===!1||!F.isInstancedMesh&&It.instancing===!0||F.isSkinnedMesh&&It.skinning===!1||!F.isSkinnedMesh&&It.skinning===!0||F.isInstancedMesh&&It.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&It.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&It.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&It.instancingMorph===!1&&F.morphTexture!==null||It.envMap!==pt||z.fog===!0&&It.fog!==it||It.numClippingPlanes!==void 0&&(It.numClippingPlanes!==at.numPlanes||It.numIntersection!==at.numIntersection)||It.vertexAlphas!==Pt||It.vertexTangents!==Ut||It.morphTargets!==Rt||It.morphNormals!==qt||It.morphColors!==le||It.toneMapping!==Ee||It.morphTargetsCount!==ue)&&(te=!0):(te=!0,It.__version=z.version);let _n=It.currentProgram;te===!0&&(_n=ia(z,N,F));let Vs=!1,xn=!1,zr=!1,Se=_n.getUniforms(),wn=It.uniforms;if(vt.useProgram(_n.program)&&(Vs=!0,xn=!0,zr=!0),z.id!==v&&(v=z.id,xn=!0),Vs||x!==b){vt.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),Se.setValue(L,"projectionMatrix",b.projectionMatrix),Se.setValue(L,"viewMatrix",b.matrixWorldInverse);let hn=Se.map.cameraPosition;hn!==void 0&&hn.setValue(L,_t.setFromMatrixPosition(b.matrixWorld)),Dt.logarithmicDepthBuffer&&Se.setValue(L,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&Se.setValue(L,"isOrthographic",b.isOrthographicCamera===!0),x!==b&&(x=b,xn=!0,zr=!0)}if(F.isSkinnedMesh){Se.setOptional(L,F,"bindMatrix"),Se.setOptional(L,F,"bindMatrixInverse");let nn=F.skeleton;nn&&(nn.boneTexture===null&&nn.computeBoneTexture(),Se.setValue(L,"boneTexture",nn.boneTexture,Wt))}F.isBatchedMesh&&(Se.setOptional(L,F,"batchingTexture"),Se.setValue(L,"batchingTexture",F._matricesTexture,Wt),Se.setOptional(L,F,"batchingIdTexture"),Se.setValue(L,"batchingIdTexture",F._indirectTexture,Wt),Se.setOptional(L,F,"batchingColorTexture"),F._colorsTexture!==null&&Se.setValue(L,"batchingColorTexture",F._colorsTexture,Wt));let En=B.morphAttributes;if((En.position!==void 0||En.normal!==void 0||En.color!==void 0)&&st.update(F,B,_n),(xn||It.receiveShadow!==F.receiveShadow)&&(It.receiveShadow=F.receiveShadow,Se.setValue(L,"receiveShadow",F.receiveShadow)),z.isMeshGouraudMaterial&&z.envMap!==null&&(wn.envMap.value=pt,wn.flipEnvMap.value=pt.isCubeTexture&&pt.isRenderTargetTexture===!1?-1:1),z.isMeshStandardMaterial&&z.envMap===null&&N.environment!==null&&(wn.envMapIntensity.value=N.environmentIntensity),xn&&(Se.setValue(L,"toneMappingExposure",M.toneMappingExposure),It.needsLights&&Xm(wn,zr),it&&z.fog===!0&&Q.refreshFogUniforms(wn,it),Q.refreshMaterialUniforms(wn,z,G,ot,f.state.transmissionRenderTarget[b.id]),Rr.upload(L,nd(It),wn,Wt)),z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(Rr.upload(L,nd(It),wn,Wt),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&Se.setValue(L,"center",F.center),Se.setValue(L,"modelViewMatrix",F.modelViewMatrix),Se.setValue(L,"normalMatrix",F.normalMatrix),Se.setValue(L,"modelMatrix",F.matrixWorld),z.isShaderMaterial||z.isRawShaderMaterial){let nn=z.uniformsGroups;for(let hn=0,Ac=nn.length;hn<Ac;hn++){let ds=nn[hn];Vt.update(ds,_n),Vt.bind(ds,_n)}}return _n}function Xm(b,N){b.ambientLightColor.needsUpdate=N,b.lightProbe.needsUpdate=N,b.directionalLights.needsUpdate=N,b.directionalLightShadows.needsUpdate=N,b.pointLights.needsUpdate=N,b.pointLightShadows.needsUpdate=N,b.spotLights.needsUpdate=N,b.spotLightShadows.needsUpdate=N,b.rectAreaLights.needsUpdate=N,b.hemisphereLights.needsUpdate=N}function qm(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(b,N,B){let z=Mt.get(b);z.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),Mt.get(b.texture).__webglTexture=N,Mt.get(b.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:B,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,N){let B=Mt.get(b);B.__webglFramebuffer=N,B.__useDefaultFramebuffer=N===void 0};let Ym=L.createFramebuffer();this.setRenderTarget=function(b,N=0,B=0){P=b,E=N,A=B;let z=!0,F=null,it=!1,dt=!1;if(b){let pt=Mt.get(b);if(pt.__useDefaultFramebuffer!==void 0)vt.bindFramebuffer(L.FRAMEBUFFER,null),z=!1;else if(pt.__webglFramebuffer===void 0)Wt.setupRenderTarget(b);else if(pt.__hasExternalTextures)Wt.rebindTextures(b,Mt.get(b.texture).__webglTexture,Mt.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){let Rt=b.depthTexture;if(pt.__boundDepthTexture!==Rt){if(Rt!==null&&Mt.has(Rt)&&(b.width!==Rt.image.width||b.height!==Rt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Wt.setupDepthRenderbuffer(b)}}let Pt=b.texture;(Pt.isData3DTexture||Pt.isDataArrayTexture||Pt.isCompressedArrayTexture)&&(dt=!0);let Ut=Mt.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ut[N])?F=Ut[N][B]:F=Ut[N],it=!0):b.samples>0&&Wt.useMultisampledRTT(b)===!1?F=Mt.get(b).__webglMultisampledFramebuffer:Array.isArray(Ut)?F=Ut[B]:F=Ut,C.copy(b.viewport),D.copy(b.scissor),k=b.scissorTest}else C.copy(j).multiplyScalar(G).floor(),D.copy(mt).multiplyScalar(G).floor(),k=Nt;if(B!==0&&(F=Ym),vt.bindFramebuffer(L.FRAMEBUFFER,F)&&z&&vt.drawBuffers(b,F),vt.viewport(C),vt.scissor(D),vt.setScissorTest(k),it){let pt=Mt.get(b.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+N,pt.__webglTexture,B)}else if(dt){let pt=N;for(let Pt=0;Pt<b.textures.length;Pt++){let Ut=Mt.get(b.textures[Pt]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Pt,Ut.__webglTexture,B,pt)}}else if(b!==null&&B!==0){let pt=Mt.get(b.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,pt.__webglTexture,B)}v=-1},this.readRenderTargetPixels=function(b,N,B,z,F,it,dt,xt=0){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let pt=Mt.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&dt!==void 0&&(pt=pt[dt]),pt){vt.bindFramebuffer(L.FRAMEBUFFER,pt);try{let Pt=b.textures[xt],Ut=Pt.format,Rt=Pt.type;if(!Dt.textureFormatReadable(Ut)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Dt.textureTypeReadable(Rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=b.width-z&&B>=0&&B<=b.height-F&&(b.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+xt),L.readPixels(N,B,z,F,wt.convert(Ut),wt.convert(Rt),it))}finally{let Pt=P!==null?Mt.get(P).__webglFramebuffer:null;vt.bindFramebuffer(L.FRAMEBUFFER,Pt)}}},this.readRenderTargetPixelsAsync=async function(b,N,B,z,F,it,dt,xt=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let pt=Mt.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&dt!==void 0&&(pt=pt[dt]),pt)if(N>=0&&N<=b.width-z&&B>=0&&B<=b.height-F){vt.bindFramebuffer(L.FRAMEBUFFER,pt);let Pt=b.textures[xt],Ut=Pt.format,Rt=Pt.type;if(!Dt.textureFormatReadable(Ut))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Dt.textureTypeReadable(Rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let qt=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,qt),L.bufferData(L.PIXEL_PACK_BUFFER,it.byteLength,L.STREAM_READ),b.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+xt),L.readPixels(N,B,z,F,wt.convert(Ut),wt.convert(Rt),0);let le=P!==null?Mt.get(P).__webglFramebuffer:null;vt.bindFramebuffer(L.FRAMEBUFFER,le);let Ee=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Of(L,Ee,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,qt),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,it),L.deleteBuffer(qt),L.deleteSync(Ee),it}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,N=null,B=0){let z=Math.pow(2,-B),F=Math.floor(b.image.width*z),it=Math.floor(b.image.height*z),dt=N!==null?N.x:0,xt=N!==null?N.y:0;Wt.setTexture2D(b,0),L.copyTexSubImage2D(L.TEXTURE_2D,B,0,0,dt,xt,F,it),vt.unbindTexture()};let Zm=L.createFramebuffer(),Km=L.createFramebuffer();this.copyTextureToTexture=function(b,N,B=null,z=null,F=0,it=null){it===null&&(F!==0?(dr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),it=F,F=0):it=0);let dt,xt,pt,Pt,Ut,Rt,qt,le,Ee,me=b.isCompressedTexture?b.mipmaps[it]:b.image;if(B!==null)dt=B.max.x-B.min.x,xt=B.max.y-B.min.y,pt=B.isBox3?B.max.z-B.min.z:1,Pt=B.min.x,Ut=B.min.y,Rt=B.isBox3?B.min.z:0;else{let En=Math.pow(2,-F);dt=Math.floor(me.width*En),xt=Math.floor(me.height*En),b.isDataArrayTexture?pt=me.depth:b.isData3DTexture?pt=Math.floor(me.depth*En):pt=1,Pt=0,Ut=0,Rt=0}z!==null?(qt=z.x,le=z.y,Ee=z.z):(qt=0,le=0,Ee=0);let ue=wt.convert(N.format),It=wt.convert(N.type),be;N.isData3DTexture?(Wt.setTexture3D(N,0),be=L.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(Wt.setTexture2DArray(N,0),be=L.TEXTURE_2D_ARRAY):(Wt.setTexture2D(N,0),be=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,N.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,N.unpackAlignment);let te=L.getParameter(L.UNPACK_ROW_LENGTH),_n=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Vs=L.getParameter(L.UNPACK_SKIP_PIXELS),xn=L.getParameter(L.UNPACK_SKIP_ROWS),zr=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,me.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,me.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Pt),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ut),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Rt);let Se=b.isDataArrayTexture||b.isData3DTexture,wn=N.isDataArrayTexture||N.isData3DTexture;if(b.isDepthTexture){let En=Mt.get(b),nn=Mt.get(N),hn=Mt.get(En.__renderTarget),Ac=Mt.get(nn.__renderTarget);vt.bindFramebuffer(L.READ_FRAMEBUFFER,hn.__webglFramebuffer),vt.bindFramebuffer(L.DRAW_FRAMEBUFFER,Ac.__webglFramebuffer);for(let ds=0;ds<pt;ds++)Se&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Mt.get(b).__webglTexture,F,Rt+ds),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Mt.get(N).__webglTexture,it,Ee+ds)),L.blitFramebuffer(Pt,Ut,dt,xt,qt,le,dt,xt,L.DEPTH_BUFFER_BIT,L.NEAREST);vt.bindFramebuffer(L.READ_FRAMEBUFFER,null),vt.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(F!==0||b.isRenderTargetTexture||Mt.has(b)){let En=Mt.get(b),nn=Mt.get(N);vt.bindFramebuffer(L.READ_FRAMEBUFFER,Zm),vt.bindFramebuffer(L.DRAW_FRAMEBUFFER,Km);for(let hn=0;hn<pt;hn++)Se?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,En.__webglTexture,F,Rt+hn):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,En.__webglTexture,F),wn?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,nn.__webglTexture,it,Ee+hn):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,nn.__webglTexture,it),F!==0?L.blitFramebuffer(Pt,Ut,dt,xt,qt,le,dt,xt,L.COLOR_BUFFER_BIT,L.NEAREST):wn?L.copyTexSubImage3D(be,it,qt,le,Ee+hn,Pt,Ut,dt,xt):L.copyTexSubImage2D(be,it,qt,le,Pt,Ut,dt,xt);vt.bindFramebuffer(L.READ_FRAMEBUFFER,null),vt.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else wn?b.isDataTexture||b.isData3DTexture?L.texSubImage3D(be,it,qt,le,Ee,dt,xt,pt,ue,It,me.data):N.isCompressedArrayTexture?L.compressedTexSubImage3D(be,it,qt,le,Ee,dt,xt,pt,ue,me.data):L.texSubImage3D(be,it,qt,le,Ee,dt,xt,pt,ue,It,me):b.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,it,qt,le,dt,xt,ue,It,me.data):b.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,it,qt,le,me.width,me.height,ue,me.data):L.texSubImage2D(L.TEXTURE_2D,it,qt,le,dt,xt,ue,It,me);L.pixelStorei(L.UNPACK_ROW_LENGTH,te),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,_n),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Vs),L.pixelStorei(L.UNPACK_SKIP_ROWS,xn),L.pixelStorei(L.UNPACK_SKIP_IMAGES,zr),it===0&&N.generateMipmaps&&L.generateMipmap(be),vt.unbindTexture()},this.initRenderTarget=function(b){Mt.get(b).__webglFramebuffer===void 0&&Wt.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?Wt.setTextureCube(b,0):b.isData3DTexture?Wt.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?Wt.setTexture2DArray(b,0):Wt.setTexture2D(b,0),vt.unbindTexture()},this.resetState=function(){E=0,A=0,P=null,vt.reset(),ut.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=jt._getDrawingBufferColorSpace(t),e.unpackColorSpace=jt._getUnpackColorSpace()}};var mp={type:"change"},ru={type:"start"},_p={type:"end"},jl=new Es,gp=new Rn,_M=Math.cos(70*Di.DEG2RAD),Fe=new I,pn=2*Math.PI,ce={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},su=1e-6,Ql=class extends So{constructor(t,e=null){super(t,e),this.state=ce.NONE,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Pn.ROTATE,MIDDLE:Pn.DOLLY,RIGHT:Pn.PAN},this.touches={ONE:qn.ROTATE,TWO:qn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new Cn,this._lastTargetPosition=new I,this._quat=new Cn().setFromUnitVectors(t.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new vr,this._sphericalDelta=new vr,this._scale=1,this._panOffset=new I,this._rotateStart=new Tt,this._rotateEnd=new Tt,this._rotateDelta=new Tt,this._panStart=new Tt,this._panEnd=new Tt,this._panDelta=new Tt,this._dollyStart=new Tt,this._dollyEnd=new Tt,this._dollyDelta=new Tt,this._dollyDirection=new I,this._mouse=new Tt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=yM.bind(this),this._onPointerDown=xM.bind(this),this._onPointerUp=vM.bind(this),this._onContextMenu=AM.bind(this),this._onMouseWheel=SM.bind(this),this._onKeyDown=wM.bind(this),this._onTouchStart=EM.bind(this),this._onTouchMove=TM.bind(this),this._onMouseDown=MM.bind(this),this._onMouseMove=bM.bind(this),this._interceptControlDown=RM.bind(this),this._interceptControlUp=CM.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(mp),this.update(),this.state=ce.NONE}update(t=null){let e=this.object.position;Fe.copy(e).sub(this.target),Fe.applyQuaternion(this._quat),this._spherical.setFromVector3(Fe),this.autoRotate&&this.state===ce.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=pn:i>Math.PI&&(i-=pn),s<-Math.PI?s+=pn:s>Math.PI&&(s-=pn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Fe.setFromSpherical(this._spherical),Fe.applyQuaternion(this._quatInverse),e.copy(this.target).add(Fe),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Fe.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new I(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new I(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Fe.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(jl.origin.copy(this.object.position),jl.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(jl.direction))<_M?this.object.lookAt(this.target):(gp.setFromNormalAndCoplanarPoint(this.object.up,this.target),jl.intersectPlane(gp,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>su||8*(1-this._lastQuaternion.dot(this.object.quaternion))>su||this._lastTargetPosition.distanceToSquared(this.target)>su?(this.dispatchEvent(mp),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?pn/60*this.autoRotateSpeed*t:pn/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Fe.setFromMatrixColumn(e,0),Fe.multiplyScalar(-t),this._panOffset.add(Fe)}_panUp(t,e){this.screenSpacePanning===!0?Fe.setFromMatrixColumn(e,1):(Fe.setFromMatrixColumn(e,0),Fe.crossVectors(this.object.up,Fe)),Fe.multiplyScalar(t),this._panOffset.add(Fe)}_pan(t,e){let i=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Fe.copy(s).sub(this.target);let r=Fe.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/i.clientHeight,this.object.matrix),this._panUp(2*e*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),s=t-i.left,r=e-i.top,o=i.width,a=i.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(pn*this._rotateDelta.x/e.clientHeight),this._rotateUp(pn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(pn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-pn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(pn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-pn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(i,s)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),r=.5*(t.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(pn*this._rotateDelta.x/e.clientHeight),this._rotateUp(pn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new Tt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function xM(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function yM(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function vM(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(_p),this.state=ce.NONE;break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function MM(n){let t;switch(n.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Pn.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=ce.DOLLY;break;case Pn.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ce.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ce.ROTATE}break;case Pn.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ce.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ce.PAN}break;default:this.state=ce.NONE}this.state!==ce.NONE&&this.dispatchEvent(ru)}function bM(n){switch(this.state){case ce.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case ce.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case ce.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function SM(n){this.enabled===!1||this.enableZoom===!1||this.state!==ce.NONE||(n.preventDefault(),this.dispatchEvent(ru),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(_p))}function wM(n){this.enabled!==!1&&this._handleKeyDown(n)}function EM(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case qn.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=ce.TOUCH_ROTATE;break;case qn.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=ce.TOUCH_PAN;break;default:this.state=ce.NONE}break;case 2:switch(this.touches.TWO){case qn.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=ce.TOUCH_DOLLY_PAN;break;case qn.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=ce.TOUCH_DOLLY_ROTATE;break;default:this.state=ce.NONE}break;default:this.state=ce.NONE}this.state!==ce.NONE&&this.dispatchEvent(ru)}function TM(n){switch(this._trackPointer(n),this.state){case ce.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case ce.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case ce.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case ce.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=ce.NONE}}function AM(n){this.enabled!==!1&&n.preventDefault()}function RM(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function CM(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var tc=class extends Ts{constructor(){super();let t=new Ge;t.deleteAttribute("uv");let e=new Me({side:We}),i=new Me,s=new yo(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new q(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let o=new lo(t,i,6),a=new Le;a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),a.updateMatrix(),o.setMatrixAt(0,a.matrix),a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),a.updateMatrix(),o.setMatrixAt(1,a.matrix),a.position.set(6.167,.857,7.803),a.rotation.set(0,.561,0),a.scale.set(3.927,6.285,3.687),a.updateMatrix(),o.setMatrixAt(2,a.matrix),a.position.set(-2.017,.018,6.124),a.rotation.set(0,.333,0),a.scale.set(2.002,4.566,2.064),a.updateMatrix(),o.setMatrixAt(3,a.matrix),a.position.set(2.291,-.756,-2.621),a.rotation.set(0,-.286,0),a.scale.set(1.546,1.552,1.496),a.updateMatrix(),o.setMatrixAt(4,a.matrix),a.position.set(-2.193,-.369,-5.547),a.rotation.set(0,.516,0),a.scale.set(3.875,3.487,2.986),a.updateMatrix(),o.setMatrixAt(5,a.matrix),this.add(o);let l=new q(t,Pr(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let c=new q(t,Pr(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let h=new q(t,Pr(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let u=new q(t,Pr(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new q(t,Pr(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let p=new q(t,Pr(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){let t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(let e of t)e.dispose()}};function Pr(n){return new go({color:0,emissive:16777215,emissiveIntensity:n})}var Po=class extends Le{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new Tt(.5,.5),this.addEventListener("removed",function(){this.traverse(function(e){e.element instanceof e.element.ownerDocument.defaultView.Element&&e.element.parentNode!==null&&e.element.remove()})})}copy(t,e){return super.copy(t,e),this.element=t.element.cloneNode(!0),this.center=t.center,this}},Lr=new I,xp=new ae,yp=new ae,vp=new I,Mp=new I,ec=class{constructor(t={}){let e=this,i,s,r,o,a={objects:new WeakMap},l=t.element!==void 0?t.element:document.createElement("div");l.style.overflow="hidden",this.domElement=l,this.getSize=function(){return{width:i,height:s}},this.render=function(g,_){g.matrixWorldAutoUpdate===!0&&g.updateMatrixWorld(),_.parent===null&&_.matrixWorldAutoUpdate===!0&&_.updateMatrixWorld(),xp.copy(_.matrixWorldInverse),yp.multiplyMatrices(_.projectionMatrix,xp),h(g,g,_),p(g)},this.setSize=function(g,_){i=g,s=_,r=i/2,o=s/2,l.style.width=g+"px",l.style.height=_+"px"};function c(g){g.isCSS2DObject&&(g.element.style.display="none");for(let _=0,m=g.children.length;_<m;_++)c(g.children[_])}function h(g,_,m){if(g.visible===!1){c(g);return}if(g.isCSS2DObject){Lr.setFromMatrixPosition(g.matrixWorld),Lr.applyMatrix4(yp);let f=Lr.z>=-1&&Lr.z<=1&&g.layers.test(m.layers)===!0,S=g.element;S.style.display=f===!0?"":"none",f===!0&&(g.onBeforeRender(e,_,m),S.style.transform="translate("+-100*g.center.x+"%,"+-100*g.center.y+"%)translate("+(Lr.x*r+r)+"px,"+(-Lr.y*o+o)+"px)",S.parentNode!==l&&l.appendChild(S),g.onAfterRender(e,_,m));let w={distanceToCameraSquared:u(m,g)};a.objects.set(g,w)}for(let f=0,S=g.children.length;f<S;f++)h(g.children[f],_,m)}function u(g,_){return vp.setFromMatrixPosition(g.matrixWorld),Mp.setFromMatrixPosition(_.matrixWorld),vp.distanceToSquared(Mp)}function d(g){let _=[];return g.traverseVisible(function(m){m.isCSS2DObject&&_.push(m)}),_}function p(g){let _=d(g).sort(function(f,S){if(f.renderOrder!==S.renderOrder)return S.renderOrder-f.renderOrder;let w=a.objects.get(f).distanceToCameraSquared,M=a.objects.get(S).distanceToCameraSquared;return w-M}),m=_.length;for(let f=0,S=_.length;f<S;f++)_[f].element.style.zIndex=m-f}}};var Lo=new I;function Dn(n,t,e,i,s,r){let o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;Lo.copy(t),Lo[i]=0,Lo.normalize();let c=.5*o/(o+a),h=1-Lo.angleTo(n)/l;return Math.sign(Lo[e])===1?h*c:a/(o+a)+c+c*(1-h)}var Dr=class n extends Ge{constructor(t=1,e=1,i=1,s=2,r=.1){let o=s*2+1;if(r=Math.min(t/2,e/2,i/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:i,segments:s,radius:r},o===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let l=new I,c=new I,h=new I(t,e,i).divideScalar(2).subScalar(r),u=this.attributes.position.array,d=this.attributes.normal.array,p=this.attributes.uv.array,g=u.length/6,_=new I,m=.5/o;for(let f=0,S=0;f<u.length;f+=3,S+=2)switch(l.fromArray(u,f),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),u[f+0]=h.x*Math.sign(l.x)+c.x*r,u[f+1]=h.y*Math.sign(l.y)+c.y*r,u[f+2]=h.z*Math.sign(l.z)+c.z*r,d[f+0]=c.x,d[f+1]=c.y,d[f+2]=c.z,Math.floor(f/g)){case 0:_.set(1,0,0),p[S+0]=Dn(_,c,"z","y",r,i),p[S+1]=1-Dn(_,c,"y","z",r,e);break;case 1:_.set(-1,0,0),p[S+0]=1-Dn(_,c,"z","y",r,i),p[S+1]=1-Dn(_,c,"y","z",r,e);break;case 2:_.set(0,1,0),p[S+0]=1-Dn(_,c,"x","z",r,t),p[S+1]=Dn(_,c,"z","x",r,i);break;case 3:_.set(0,-1,0),p[S+0]=1-Dn(_,c,"x","z",r,t),p[S+1]=1-Dn(_,c,"z","x",r,i);break;case 4:_.set(0,0,1),p[S+0]=1-Dn(_,c,"x","y",r,t),p[S+1]=1-Dn(_,c,"y","x",r,e);break;case 5:_.set(0,0,-1),p[S+0]=Dn(_,c,"x","y",r,t),p[S+1]=1-Dn(_,c,"y","x",r,e);break}}static fromJSON(t){return new n(t.width,t.height,t.depth,t.segments,t.radius)}};var ou=new Map;function Un(n,t,e,i=.08){let s=`${n}|${t}|${e}|${i}`;return ou.has(s)||ou.set(s,new Dr(n,t,e,4,Math.min(i,n/2,t/2,e/2))),ou.get(s)}var bp={session:{w:2.1,h:1.05,d:1.15,legs:4,legH:.7,eye:[.24,.3],crown:"gem"},"general-purpose":{w:1.9,h:.95,d:1,legs:4,legH:.62,eye:[.22,.28],crown:"none"},Explore:{w:2.1,h:.8,d:1,legs:4,legH:.5,eye:[.28,.24],crown:"periscope"},Plan:{w:1.6,h:1.3,d:1,legs:2,legH:.6,eye:[.2,.26],crown:"cap"},"code-reviewer":{w:1.9,h:1,d:1,legs:4,legH:.58,eye:[.2,.22],crown:"glasses"},"test-runner":{w:2,h:.85,d:.95,legs:6,legH:.55,eye:[.2,.26],crown:"antennae"}};function au({build:n="general-purpose",bodyColor:t,inkColor:e,accentColor:i,pick:s}){let r=bp[n]??bp["general-purpose"],o=new Yt,a=new Yt;o.add(a);let l=new Me({color:t,roughness:.42}),c=new Me({color:e,roughness:.2}),h=new Me({color:i,roughness:.3}),u=[],d=Math.min(.26,r.w*.8/(r.legs*1.6));for(let T=0;T<r.legs;T++){let E=(T-(r.legs-1)/2)*(r.w*.78/Math.max(1,r.legs-1)),A=new q(Un(d,r.legH+.1,r.d*.3,.04),l);A.position.set(r.legs===2?E*.7:E,r.legH/2,0),A.userData.phase=T%2?Math.PI:0,u.push(A)}let p=new Yt;p.position.y=r.legH;let g=new q(Un(r.w,r.h,r.d,.14),l);g.position.y=r.h/2;let _=[-1,1].map(T=>{let E=new Yt;E.position.set(T*(r.w/2),r.h*.58,0);let A=new q(Un(.42,.32,r.d*.42,.06),l);return A.position.x=T*.19,E.add(A),E.userData.side=T,E}),[m,f]=r.eye,S=[-1,1].map(T=>{let E=new q(Un(m,f,.06,.02),c);return E.position.set(T*r.w*.25,r.h*.64,r.d/2+.01),E});p.add(g,..._,...S);let w=null,M=r.legH+r.h;if(r.crown==="gem")w=new q(new po(.2,0),new Me({color:i,emissive:i,emissiveIntensity:.2,roughness:.3,flatShading:!0})),w.position.y=r.h+.55,w.scale.y=1.35,p.add(w),M+=.95;else if(r.crown==="periscope"){let T=new q(Un(.12,.5,.12,.04),c);T.position.set(r.w*.28,r.h+.25,0);let E=new q(Un(.3,.2,.3,.06),h);E.position.set(r.w*.28,r.h+.58,.05),p.add(T,E),M+=.7}else if(r.crown==="cap"){let T=new q(Un(r.w*.9,.14,r.d*1.05,.04),h);T.position.y=r.h+.07;let E=new q(Un(r.w*.6,.06,.4,.03),h);E.position.set(0,r.h+.03,r.d/2+.15),p.add(T,E),M+=.15}else if(r.crown==="glasses"){for(let E of[-1,1]){let A=new q(Un(m+.16,f+.14,.05,.03),h);A.position.set(E*r.w*.25,r.h*.64,r.d/2+.005),p.add(A)}let T=new q(Un(r.w*.2,.05,.05,.02),h);T.position.set(0,r.h*.68,r.d/2+.02),p.add(T);for(let E of S)E.position.z+=.03}else if(r.crown==="antennae"){for(let T of[-1,1]){let E=new q(Un(.08,.36,.08,.03),c);E.position.set(T*r.w*.2,r.h+.16,0),E.rotation.z=-T*.35;let A=new q(Un(.16,.16,.16,.05),h);A.position.set(T*(r.w*.2+.12),r.h+.36,0),p.add(E,A)}M+=.45}a.add(p,...u),o.traverse(T=>{T.isMesh&&(T.castShadow=!0,s&&(T.userData.pick=s))});for(let T of S)T.castShadow=!1;return{root:o,rig:a,top:p,eyes:S,arms:_,legs:u,bulb:w,bodyMat:l,inkMat:c,accentMat:h,height:M,seed:Math.random()*10,blinkAt:1+Math.random()*3}}function nc(n,t,{busy:e=0,look:i=0,hop:s=0,alarm:r=!1,asleep:o=!1}={}){let a=Math.sin(t*(o?.9:2)+n.seed)*.02,l=Math.sin(Math.min(1,s)*Math.PI)*.5;n.rig.position.y=l,n.top.scale.set(1+a*.5,1-a,1+a*.5),n.top.position.y=n.legs[0].position.y*2+e*Math.abs(Math.sin(t*8+n.seed))*.06,n.rig.rotation.y+=(i-n.rig.rotation.y)*.08,n.top.rotation.z=e*Math.sin(t*4+n.seed)*.04;for(let h of n.legs)h.rotation.x=e*Math.sin(t*14+h.userData.phase)*.35,h.scale.y=1-l*.4;for(let h of n.arms){let u=h.userData.side,d=e*Math.sin(t*9+n.seed+(u>0?Math.PI:0))*.35;h.rotation.z=u*(r?1.1+Math.sin(t*7)*.2:d+l*.7)}t>n.blinkAt+.14&&(n.blinkAt=t+2+Math.random()*4);let c=o||t>n.blinkAt&&t<n.blinkAt+.14;for(let h of n.eyes)h.scale.y=c?.15:1;n.bulb&&(n.bulb.rotation.y=t*(.6+e*2.4),n.bulb.position.y=n.bulb.userData.y??=n.bulb.position.y,n.bulb.position.y+=Math.sin(t*2+n.seed)*.06,n.bulb.material.emissiveIntensity=.15+e*(.55+.35*Math.sin(t*8)))}function lu(n,t=!1){let e=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},o={},a=n[0].morphTargetsRelative,l=new an,c=0;for(let h=0;h<n.length;++h){let u=n[h],d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in u.attributes){if(!i.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.attributes[p]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(u.morphAttributes[p])}if(t){let p;if(e)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,p,h),c+=p}}if(e){let h=0,u=[];for(let d=0;d<n.length;++d){let p=n[d].index;for(let g=0;g<p.count;++g)u.push(p.getX(g)+h);h+=n[d].attributes.position.count}l.setIndex(u)}for(let h in r){let u=Sp(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){let p=[];for(let _=0;_<o[h].length;++_)p.push(o[h][_][d]);let g=Sp(p);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function Sp(n){let t,e,i,s=-1,r=0;for(let c=0;c<n.length;++c){let h=n[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}let o=new t(r),a=new Be(o,e,i),l=0;for(let c=0;c<n.length;++c){let h=n[c];if(h.isInterleavedBufferAttribute){let u=l/e;for(let d=0,p=h.count;d<p;d++)for(let g=0;g<e;g++){let _=h.getComponent(d,g);a.setComponent(d+u,g,_)}}else o.set(h.array,l);l+=h.count*e}return s!==void 0&&(a.gpuType=s),a}var xe=2.4,rs=46,Uo=1.7,Jn=3,Ht=(n,t,e,i=.8)=>new Dr(n,t,e,2,Math.min(i,n/2,t/2,e/2)),IM=16;function wp(n,t,e=!0){let i=document.createElement("canvas");i.width=i.height=n,t(i.getContext("2d"),n);let s=new Ii(i);return s.wrapS=s.wrapT=cr,s.colorSpace=e?Pe:Kn,s.anisotropy=IM,s}var tn=(n,t=1)=>`rgba(${n},${n},${n},${t})`;function Fo(n,t,e,i){let s=n.getImageData(0,0,t,t);for(let r=0;r<s.data.length;r+=4){let o=(i()-.5)*e;s.data[r]+=o,s.data[r+1]+=o,s.data[r+2]+=o}n.putImageData(s,0,0)}function Ap(n,t,e,i,s,r,o){let a=Math.round(s/2.5);for(let l=0;l<a;l++){let c=e+r()*s,h=.6+r()*2.2,u=.004+r()*.012,d=r()*10;n.strokeStyle=tn(r()<.5?0:255,o*(.4+r())),n.lineWidth=.6+r()*1.4,n.beginPath();for(let p=0;p<=i;p+=6){let g=c+Math.sin(p*u+d)*h;p===0?n.moveTo(t+p,g):n.lineTo(t+p,g)}n.stroke()}}var Ep=8;function PM(n){let t=jn("planks"),e=n/Ep,i=[];for(let s=0;s<Ep;s++){let r=t()*n,o=r+n;for(;r<o;){let a=Math.min(o-r,n*(.3+t()*.4));i.push({x:r,y:s*e,w:a,h:e,tone:.8+t()*.2,knot:t()<.25?[t(),t()]:null,seed:t()}),r+=a}}return i}function LM(n,t,e){let i=PM(t);n.fillStyle=tn(e?128:255),n.fillRect(0,0,t,t);for(let s of i)for(let r of[0,-t]){let o=s.x+r;if(o+s.w<0||o>t)continue;let a=jn(s.seed);if(n.save(),n.beginPath(),n.rect(o,s.y,s.w,s.h),n.clip(),e||(n.fillStyle=tn(Math.round(255*s.tone)),n.fillRect(o,s.y,s.w,s.h)),Ap(n,o,s.y,s.w,s.h,a,e?.2:.13),s.knot){let l=o+s.knot[0]*s.w,c=s.y+.2*s.h+s.knot[1]*.6*s.h;for(let h=4;h>0;h--)n.strokeStyle=tn(0,e?.18:.08),n.lineWidth=1.2,n.beginPath(),n.ellipse(l,c,h*5,h*2,0,0,Math.PI*2),n.stroke()}n.restore(),n.fillStyle=tn(0,e?.9:.28),n.fillRect(o-1,s.y,2,s.h),n.fillRect(o,s.y,s.w,2),e||(n.fillStyle=tn(255,.25),n.fillRect(o,s.y+2,s.w,1))}e||Fo(n,t,6,jn("planks-speckle"))}function DM(n,t,e){let i=t/2;n.fillStyle=tn(e?128:255),n.fillRect(0,0,t,t),e||(n.fillStyle=tn(0,.035),n.fillRect(0,0,i,i),n.fillRect(i,i,i,i)),Fo(n,t,e?70:16,jn("carpet")),n.fillStyle=tn(0,e?.7:.1);for(let s of[0,i])n.fillRect(s,0,2,t),n.fillRect(0,s,t,2)}function UM(n,t,e){let i=t/2;n.fillStyle=tn(e?160:255),n.fillRect(0,0,t,t),e||(n.fillStyle=tn(0,.14),n.fillRect(0,0,i,i),n.fillRect(i,i,i,i),Fo(n,t,5,jn("checker"))),n.fillStyle=e?tn(0):tn(120,.55);for(let s of[0,i])n.fillRect(s-3,0,6,t),n.fillRect(0,s-3,t,6)}function NM(n,t,e){n.fillStyle=tn(e?128:255),n.fillRect(0,0,t,t),Ap(n,0,0,t,t,jn("wood"),e?.16:.1),e||Fo(n,t,5,jn("wood-speckle"))}function FM(n,t,e){n.fillStyle=tn(e?128:255),n.fillRect(0,0,t,t);for(let i=0;i<t;i+=4)n.fillStyle=tn(0,e?.25:.035),n.fillRect(i,0,1,t),n.fillRect(0,i,t,1);Fo(n,t,e?40:10,jn("fabric"))}var uu={planks:{draw:LM,size:1024,unit:72,roughness:.5,bump:2.5},carpet:{draw:DM,size:512,unit:70,roughness:.95,bump:.6},checker:{draw:UM,size:512,unit:40,roughness:.3,bump:1.5},wood:{draw:NM,size:512,unit:0,roughness:.5,bump:.5},fabric:{draw:FM,size:256,unit:0,roughness:.9,bump:.6}},cu={};function Rp(n){if(!cu[n]){let{draw:t,size:e}=uu[n];cu[n]={map:wp(e,(i,s)=>t(i,s,!1)),bump:wp(e,(i,s)=>t(i,s,!0),!1)}}return cu[n]}function du(n,t,e,i="planks"){let{unit:s,roughness:r,bump:o}=uu[i],a=Rp(i),l=a.map.clone(),c=a.bump.clone();for(let h of[l,c])h.repeat.set(t/s,e/s),h.needsUpdate=!0;return new Me({color:n,map:l,bumpMap:c,bumpScale:o,roughness:r})}function Cp(n,t,e={}){let{roughness:i,bump:s}=uu[n],r=Rp(n);return new Me({color:t,map:r.map,bumpMap:r.bump,bumpScale:s,roughness:i,...e})}var Ui=n=>Cp("wood",n),fu=n=>Cp("fabric",n),ic=null;function OM(){if(ic)return ic;let n=document.createElement("canvas");n.width=4,n.height=64;let t=n.getContext("2d"),e=t.createLinearGradient(0,0,0,64);return e.addColorStop(0,"#fff"),e.addColorStop(.35,"#6a6a6a"),e.addColorStop(1,"#000"),t.fillStyle=e,t.fillRect(0,0,4,64),ic=new Ii(n),ic}var kM={back:0,left:Math.PI/2,right:-Math.PI/2,front:Math.PI};function hu(n,t,e){let i=n.map(([r,o,a,l,c])=>new ln(r,o).rotateX(-Math.PI/2).rotateY(kM[c]).translate(a,t,l)),s=new q(lu(i),new Ve({color:"#000",alphaMap:OM(),transparent:!0,opacity:e,depthWrite:!1}));for(let r of i)r.dispose();return s}function Ip(n,t){let e=n.attributes.position,i=new Float32Array(e.count*3);for(let s=0;s<e.count;s++){let r=Di.smoothstep(e.getY(s)/t+.5,0,.55);i.fill(.74+.26*r,s*3,s*3+3)}return n.setAttribute("color",new Be(i,3)),n}function jn(n){let t=2166136261;for(let e of String(n))t=Math.imul(t^e.charCodeAt(0),16777619)>>>0;return()=>(t=Math.imul(t^t>>>15,2246822507)>>>0,t=Math.imul(t^t>>>13,3266489909)>>>0,((t^=t>>>16)>>>0)/4294967296)}var Kt=(n,t={})=>new Me({color:n,roughness:.7,...t}),Fs=new Me({color:"#bfe3f7",emissive:"#bfe3f7",emissiveIntensity:.4,roughness:.15}),Oo=new Me({color:"#fbf6ec",emissive:"#ffcf7a",emissiveIntensity:.55,side:fn,roughness:.6});function Ni(n){return n.traverse(t=>{t.isMesh&&(t.castShadow=!0,t.receiveShadow=!0)}),n}var BM=new Set([Fs,Oo]),zM=(n,t)=>`${BM.has(t)?t.uuid:`${t.type}|${t.color?.getHex()}|${t.emissive?.getHex()}|${t.emissiveIntensity}|${t.roughness}|${t.metalness}|${t.side}|${t.map?.uuid}|${t.bumpMap?.uuid}|${t.vertexColors}`}|${n.castShadow}|${n.receiveShadow}`;function Ur(n,t=[]){n.updateMatrixWorld(!0);let e=n.matrixWorld.clone().invert(),i=new Set;for(let r of t)r.traverse(o=>i.add(o));let s=new Map;n.traverse(r=>{if(!r.isMesh||i.has(r)||r===n||r.children.length||Array.isArray(r.material)||r.material.transparent||r.matrixWorld.determinant()<0)return;let o=zM(r,r.material);s.has(o)||s.set(o,[]),s.get(o).push(r)});for(let r of s.values()){if(r.length<2)continue;let o=r.map(u=>{let d=u.geometry.index?u.geometry.toNonIndexed():u.geometry.clone();return d.clearGroups(),d.applyMatrix4(e.clone().multiply(u.matrixWorld))}),a=Object.keys(o[0].attributes).filter(u=>o.every(d=>d.attributes[u]));for(let u of o)for(let d of Object.keys(u.attributes))a.includes(d)||u.deleteAttribute(d);let l=lu(o);for(let u of o)u.dispose();if(!l)continue;let c=r[0],h=new q(l,c.material);h.castShadow=c.castShadow,h.receiveShadow=c.receiveShadow;for(let u of r)u.removeFromParent();n.add(h)}return n}function HM(n,t){let e=new Yt,i=Ui(n.woodDark),s=new q(Ht(44,30,11,1),i);s.position.y=15,e.add(s);for(let r of[4,15.5]){let o=-19;for(;o<17;){let a=2.2+t()*2.2,l=7+t()*3,c=new q(Ht(a,l,7.5,.4),Kt(n.books[Math.floor(t()*n.books.length)],{roughness:.55}));c.position.set(o+a/2,r+l/2,2.4),c.rotation.z=t()<.12?.25:0,e.add(c),o+=a+.4,t()<.1&&(o+=4)}}s.scale.z=.35,s.position.z=-3.5;for(let r of[.8,12.6,24.4,29]){let o=new q(Ht(44,1.6,11,.4),i);o.position.y=r,e.add(o)}for(let r of[-21.2,21.2]){let o=new q(Ht(1.6,30,11,.4),i);o.position.set(r,15,0),e.add(o)}return Ni(e)}function sc(n,t){let e=new Yt;e.userData.plant=t()*10;let i=new q(new _e(5,3.8,8,28),Kt(n.pot,{roughness:.35}));i.position.y=4,e.add(i);let s=Kt(n.leaf,{roughness:.6}),r=5+Math.floor(t()*3);for(let o=0;o<r;o++){let a=new q(new fo(3.4+t()*2,0),s),l=o/r*Math.PI*2;a.position.set(Math.cos(l)*3,11+t()*9,Math.sin(l)*3),a.scale.y=1.3,e.add(a)}return Ur(Ni(e))}function VM(n){let t=new Yt,e=Kt(n.woodDark,{roughness:.3,metalness:.6}),i=new q(new _e(3.6,4,1.2,28),e);i.position.y=.6;let s=new q(new _e(.45,.45,26,8),e);s.position.y=13;let r=new q(new _e(3.4,6,7,24,1,!0),Oo);return r.position.y=28,t.add(i,s,r),Ni(t),r.castShadow=!1,t}function GM(n,t){let e=new Yt,i=Kt(n.trim,{roughness:.4}),s=new q(new ln(t,15),Fs);s.position.set(0,18,.3),e.add(s);for(let[r,o,a,l]of[[0,25.8,t+2,1.6],[0,10.2,t+3,1.8],[-t/2-.4,18,1.6,17],[t/2+.4,18,1.6,17],[0,18,1,15],[0,18,t,1]]){let c=new q(Ht(a,l,1.6,.3),i);c.position.set(r,o,.9),e.add(c)}return e}function WM(n,t){let e=new Yt,i=new q(Ht(14,11,1,.3),Ui(n.woodDark));i.position.set(0,20,.6);let s=new q(new ln(11,8),Kt(n.books[Math.floor(t()*n.books.length)]));s.position.set(0,20,1.15);let r=new q(new xr(1.8,20),Kt(n.trim));return r.position.set(2.5,21,1.2),e.add(i,s,r),e}function $M(n,t){let e=new Yt,i=fu(n.books[Math.floor(t()*n.books.length)]),s=new q(Ht(30,6,13,2.5),i);s.position.y=5;let r=new q(Ht(30,10,4,2),i);r.position.set(0,10,-5);let o=[-1,1].map(a=>{let l=new q(Ht(4,9,13,2),i);return l.position.set(a*15,6.5,0),l});return e.add(s,r,...o),Ni(e)}function Pp({w:n,d:t,name:e,colors:i}){let s=jn(e),r=new Yt,o=new q(Ht(n,xe,t,.6),du(i.wood,n,t));o.position.y=xe/2,o.receiveShadow=!0,r.add(o);let a=Kt(i.wall,{roughness:.85,vertexColors:!0}),l=Kt(i.trim,{roughness:.4}),c=[[n+Jn*2,0,-t/2-Jn/2,"back"],[t,-n/2-Jn/2,0,"side"],[t,n/2+Jn/2,0,"side"]];for(let[m,f,S,w]of c){let M=Ip(w==="back"?Ht(m,rs,Jn,.6):Ht(Jn,rs,m,.6),rs),T=new q(M,a);T.position.set(f,rs/2,S),T.castShadow=T.receiveShadow=!0;let E=new q(w==="back"?Ht(m+1,1.6,Jn+1.2,.4):Ht(Jn+1.2,1.6,m+1,.4),l);E.position.set(f,rs+.6,S);let A=new q(w==="back"?Ht(m+.6,2.4,Jn+.8,.3):Ht(Jn+.8,2.4,m+.6,.3),l);A.position.set(f,xe+1.2,S),r.add(T,E,A)}let h=16,u=14,d=Jn;r.add(hu([[n,h,0,-t/2+h/2,"back"],[t,h,-n/2+h/2,0,"left"],[t,h,n/2-h/2,0,"right"]],xe+.08,.32),hu([[n+2*d,u,0,-t/2-d-u/2,"front"],[n,u,0,t/2+u/2,"back"],[t+d,u,-n/2-d-u/2,-d/2,"right"],[t+d,u,n/2+d+u/2,-d/2,"left"]],.48,.22));let p=-t/2+1,g=(m,f,S,w,M=Uo)=>{m.scale.setScalar(M),m.position.set(f,S,w),r.add(m)};g(HM(i,s),-n/2+48+s()*10,xe,p+9.5),g(GM(i,Math.min(46,n*.12)),n*.02,-8,p),n>300&&g(WM(i,s),n*.24,-6,p),g(sc(i,s),n/2-18,xe,p+16),g(sc(i,s),-n/2+16,xe,t/2-20,Uo*.8),g(VM(i),n/2-16,xe,t/2-18,Uo*.9),n>380&&s()<.8&&g($M(i,s),n*.27,xe,p+18);let _=Lp(r);return Ur(r,_),{group:r,floor:o,wallMat:a,plants:_}}var Lp=n=>{let t=[];return n.traverse(e=>{e.userData.plant!==void 0&&t.push(e)}),t};function Dp(n){let t=new q(new _e(30,30,.6,64),fu(n));return t.scale.z=.82,t.position.y=xe+.3,t.receiveShadow=!0,t}var Tp=["#7cc4ff","#f6a6c1","#ffd479","#a7e3a1","#c9b6ff","#e8e2d6"];function Up(n,t){let e=new Yt,i=Ui(n.woodDark),s=new q(Ht(58,2.6,22,.8),Ui(n.desk));s.position.y=17,e.add(s);for(let J of[-26,26]){let j=new q(Ht(3,16,18,.6),i);j.position.set(J,8,0),e.add(j)}let r=Kt("#2b2a2e",{roughness:.3,metalness:.4}),o=new q(Ht(3,6,3,.6),r);o.position.set(0,21,-5);let a=new q(Ht(11,1,7,.4),r);a.position.set(0,18.8,-5);let l=new q(Ht(34,21,2,1),r);l.position.set(0,34,-5),e.add(o,a,l);let c=document.createElement("canvas");c.width=160,c.height=96;let h=new Ii(c);h.colorSpace=Pe;let u=new q(new ln(31,18),new Ve({map:h,toneMapped:!1}));u.position.set(0,34,-3.9),e.add(u);let d=new q(Ht(18,1,6,.4),Kt(n.trim,{roughness:.45}));d.position.set(-3,18.8,5);let p=new q(new _e(2.2,2,4.4,24),Kt(t,{roughness:.25}));p.position.set(20,20.6,4),e.add(d,p),Ni(e),u.castShadow=u.receiveShadow=!1;let g=c.getContext("2d"),_=Array.from({length:40},(J,j)=>({indent:[0,1,2,1,2,3,1,0][j%8]*10,parts:Array.from({length:1+j*7%4},(mt,Nt)=>({w:8+(j*13+Nt*29)%36,c:Tp[(j+Nt*3)%Tp.length]}))})),m=0,f=-1,S="",w=null;function M(J,j){w={img:J,until:j},S=""}function T(J,j){let mt=J?`${J}|${j}`:null;(w?.askKey??null)===mt&&!w?.img||w?.img&&!J||(w=J?{ask:J,color:j,askKey:mt}:null,S="")}function E(J){if(w.img){g.fillStyle="#1f2433",g.fillRect(0,0,160,96);let{img:j}=w,mt=Math.min(160/j.width,96/j.height);g.drawImage(j,(160-j.width*mt)/2,(96-j.height*mt)/2,j.width*mt,j.height*mt)}else{g.fillStyle=w.color,g.fillRect(0,0,160,96),g.fillStyle="#ffffff",g.font="700 64px Georgia, serif",g.textAlign="center",g.textBaseline="middle";let j=Math.sin(J*3)*3;g.fillText(w.ask==="permission"?">_":w.ask==="plan"?"\u270E":"?",80,50+j)}h.needsUpdate=!0}function A(J,j,mt){if(w?.img&&J>w.until&&(w=null,S=""),w&&j!=="off"){if(J-f<.1)return;f=J,E(J);return}if(!(j!=="busy"&&j===S)&&!(j==="busy"&&J-f<.12)){if(f=J,S=j,g.fillStyle=j==="off"?"#141416":"#1f2433",g.fillRect(0,0,160,96),j==="off"){h.needsUpdate=!0;return}g.fillStyle=mt,g.fillRect(0,0,160,7),g.globalAlpha=j==="busy"?1:.55,j==="busy"&&(m=(m+1)%_.length);for(let Nt=0;Nt<9;Nt++){let he=_[(Nt+m)%_.length],Jt=8+he.indent;for(let Z of he.parts)g.fillStyle=Z.c,g.fillRect(Jt,13+Nt*9,Z.w,4),Jt+=Z.w+4}j==="busy"&&Math.floor(J*3)%2&&(g.fillStyle="#ffffff",g.fillRect(8,85,5,5)),g.globalAlpha=1,h.needsUpdate=!0}}let P=[0,.5].map(J=>{let j=new q(new fi(1.1,10,10),new Ve({color:"#ffffff",transparent:!0,opacity:0,depthWrite:!1}));return j.userData.offset=J,e.add(j),j});function v(J,j){for(let mt of P){let Nt=(J*.5+mt.userData.offset)%1;mt.position.set(20+Math.sin(Nt*7+mt.userData.offset*5),23+Nt*10,4),mt.scale.setScalar(.6+Nt),mt.material.opacity=j?.5*(1-Nt)*Math.min(1,Nt*5):0}}let x=document.createElement("canvas");x.width=128,x.height=84;let C=new Ii(x);C.colorSpace=Pe;let D=new Yt,k=new q(Ht(13,9.4,1,.4),Kt(n.trim,{roughness:.5})),H=new q(new ln(11.6,8),new Ve({map:C,toneMapped:!1}));H.position.z=.55,D.add(k,H),D.position.set(-22,23.6,1),D.rotation.set(-.18,.3,0),D.visible=!1,e.add(D);function Y(J){let j=x.getContext("2d"),mt=Math.max(128/J.width,84/J.height);j.drawImage(J,(128-J.width*mt)/2,(84-J.height*mt)/2,J.width*mt,J.height*mt),C.needsUpdate=!0,D.visible=!0}let W=new Yt,ot=new q(Ht(11,1.6,8,.4),Kt(n.woodDark,{roughness:.6}));ot.position.y=.8,W.add(ot),W.position.set(21,18.3,-5),W.visible=!1,e.add(W);let G=[];function ct(J){for(let j of G)W.remove(j),j.material.dispose();G.length=0,J.slice(-6).forEach((j,mt)=>{let Nt=new q(new Ge(9,.45,6.4),new Me({color:j,roughness:.8}));Nt.position.set(mt%2?.4:-.3,1.9+mt*.5,mt%3*.2),Nt.rotation.y=(mt*37%9-4)*.03,Nt.castShadow=!0,W.add(Nt),G.push(Nt)}),W.visible=J.length>0}return Ni(D),H.castShadow=H.receiveShadow=!1,Ur(e,[u,p,...P,D,W]),{group:e,draw:A,steam:v,mug:p,showImage:M,showAsk:T,setPhoto:Y,setTray:ct}}function Np(n){let t=new Yt,e=Kt(n.woodDark,{roughness:.6});for(let p of[-9,9]){let g=new q(Ht(1.6,44,1.6,.5),e);g.position.set(p,22,0),g.rotation.z=p<0?.06:-.06,t.add(g)}let i=new q(Ht(1.4,40,1.4,.5),e);i.position.set(0,20,-6),i.rotation.x=-.28,t.add(i);let s=new q(Ht(26,30,1.6,.8),Kt(n.trim,{roughness:.4}));s.position.set(0,30,.6),t.add(s);let r=new q(Ht(24,1.2,3,.4),e);r.position.set(0,14.6,1.6);let o=new q(new _e(.5,.5,5,10),Kt("#b85c3c"));o.rotation.z=Math.PI/2,o.position.set(5,15.6,1.8),t.add(r,o);let a=document.createElement("canvas");a.width=192,a.height=224;let l=new Ii(a);l.colorSpace=Pe,l.anisotropy=8;let c=new q(new ln(24,28),new Ve({map:l,toneMapped:!1}));c.position.set(0,30,1.45),t.add(c),Ni(t),c.castShadow=c.receiveShadow=!1;let h=a.getContext("2d"),u="";function d(p,g,_){let f=p.findIndex(M=>M.status==="in_progress")>=0&&Math.floor(_*2)%2,S=`${p.map(M=>M.status+M.text).join("|")}|${g}|${f}`;if(S===u)return;u=S,h.fillStyle="#fdfcf8",h.fillRect(0,0,192,224);let w=p.filter(M=>M.status==="completed").length;h.fillStyle="#2b2a2e",h.font="600 19px Georgia, serif",h.textBaseline="alphabetic",h.fillText("To do",12,28),h.font="500 15px ui-monospace, Menlo, monospace",h.fillStyle="#8a8378",h.textAlign="right",h.fillText(`${w}/${p.length}`,180,28),h.textAlign="left",h.fillStyle="#e6dfd3",h.fillRect(12,38,168,6),h.fillStyle="#5f8a68",h.fillRect(12,38,168*(p.length?w/p.length:0),6),p.slice(0,6).forEach((M,T)=>{let E=70+T*26,A=M.status==="completed",P=M.status==="in_progress";h.strokeStyle=A?"#5f8a68":P?g:"#b8afa2",h.lineWidth=2.5,h.strokeRect(12,E-13,15,15),A?(h.beginPath(),h.moveTo(14,E-6),h.lineTo(19,E-1),h.lineTo(27,E-14),h.stroke()):P&&f&&(h.fillStyle=g,h.fillRect(16,E-9,7,7)),h.font=`${P?600:400} 15px -apple-system, "Segoe UI", sans-serif`,h.fillStyle=A?"#a39b90":"#2b2a2e";let v=M.text;for(;h.measureText(v).width>146&&v.length>4;)v=`${v.slice(0,-2)}\u2026`.replace(/……$/,"\u2026");h.fillText(v,34,E),A&&(h.strokeStyle="#a39b90",h.lineWidth=1.5,h.beginPath(),h.moveTo(34,E-5),h.lineTo(34+h.measureText(v).width,E-5),h.stroke())}),l.needsUpdate=!0}return Ur(t,[c]),{group:t,draw:d}}var No=180,Ns=150;function Fp(n){let t=new Yt,e=jn("coffee"),i=new q(Ht(No,1.4,Ns,.6),du(n.tile,No,Ns,"checker"));i.position.y=.7,i.receiveShadow=!0,t.add(i);let s=-Ns/2+14,r=new q(Ht(120,22,24,1),Kt(n.counter,{roughness:.45}));r.position.set(-25,11,s);let o=new q(Ht(124,2.4,26,.6),Ui(n.woodDark));o.position.set(-25,23,s),t.add(r,o);for(let x of[-70,-40,-10,20]){let C=new q(Ht(6,1,1,.3),Kt(n.trim,{roughness:.25,metalness:.7}));C.position.set(x,18,s+12.4),t.add(C)}let a=new Yt,l=new q(Ht(20,24,15,2),Kt("#3a3633",{roughness:.25,metalness:.5}));l.position.y=12;let c=new q(Ht(20,4,18,1),Kt("#4a4541",{roughness:.25,metalness:.6}));c.position.set(0,23,1.5);let h=new q(new fi(1,12,12),new Ve({color:"#ff6a4d"}));h.position.set(6,17,7.6);let u=new q(new _e(2.4,2,4.4,16),Kt(n.trim));u.position.set(-2,3,8.5),a.add(l,c,h,u),a.position.set(-55,24.2,s-1),t.add(a),n.mugs.forEach((x,C)=>{let D=new q(new _e(2.2,2,4.6,24),Kt(x,{roughness:.25}));D.position.set(-28+C*6.5,26.5,s+5-C%2*4),t.add(D)});let d=new q(new _e(4,4,9,18),Kt(n.window,{transparent:!0,opacity:.75,roughness:.2}));d.position.set(18,29,s-2),t.add(d);let p=new q(Ht(28,60,24,2),Kt(n.fridge,{roughness:.3}));p.position.set(55,30,s);let g=new q(Ht(1.6,14,1.6,.5),Kt("#9a948c",{roughness:.2,metalness:.8}));g.position.set(44,40,s+12.6),t.add(p,g);let _=new Yt,m=new q(new _e(20,20,2.4,48),Ui(n.desk));m.position.y=20;let f=new q(new _e(1.6,1.6,19,16),Ui(n.woodDark));f.position.y=10;let S=new q(new _e(8,9,1.4,32),Ui(n.woodDark));S.position.y=.7,_.add(m,f,S);for(let x=0;x<3;x++){let C=-Math.PI/2+(x-1)*1.6+Math.PI,D=new q(new _e(6,5.4,12,28),fu(n.mugs[(x*2+1)%n.mugs.length]));D.position.set(Math.cos(C)*28,6,Math.sin(C)*28),_.add(D)}for(let x=0;x<2;x++){let C=new q(new _e(2.2,2,4.4,24),Kt(n.mugs[x*3%n.mugs.length],{roughness:.25}));C.position.set(-6+x*11,23.4,3-x*6),_.add(C)}_.position.set(-10,1.4,38),t.add(_);let w=sc(n,e);w.scale.setScalar(Uo),w.position.set(No/2-14,1.4,Ns/2-18),t.add(w),Ni(t),i.castShadow=!1,h.castShadow=!1;let M=new Ve({color:"#ffffff",transparent:!0,opacity:.5,depthWrite:!1}),T=Array.from({length:5},(x,C)=>{let D=new q(new fi(2.4,12,12),M.clone());return D.userData.offset=C/5,t.add(D),D}),E=new I(-57,24.2+27,s+2);function A(x){for(let C of T){let D=(x*.35+C.userData.offset)%1;C.position.set(E.x+Math.sin(D*6+C.userData.offset*9)*2.5,E.y+D*22,E.z),C.scale.setScalar(.6+D*1.4),C.material.opacity=.45*(1-D)*Math.min(1,D*6)}}let P=[...[.25,1,1.75,2.5,-.5,3.4].map(x=>new I(-10+Math.cos(x)*38,1.4,38+Math.sin(x)*30)),...[-62,-30,2].map(x=>new I(x,1.4,s+34))],v=new I(-10,1.4,38);return Ur(t,T),{group:t,animate:A,spots:P,tableAt:v}}var Do=64;function Op({W:n,D:t,colors:e}){let i=new Yt,s=new q(new Ge(n,.4,t),du(e.carpet,n,t,"carpet"));s.position.y=.2,s.receiveShadow=!0,i.add(s);let r=Kt(e.outerWall,{roughness:.9,vertexColors:!0}),o=Kt(e.trim,{roughness:.4}),a=Fs,l=5;for(let[A,P,v,x]of[[n+l*2,0,-t/2-l/2,!0],[t,-n/2-l/2,0,!1],[t,n/2+l/2,0,!1]]){let C=new q(Ip(x?Ht(A,Do,l,1):Ht(l,Do,A,1),Do),r);C.position.set(P,Do/2,v),C.receiveShadow=C.castShadow=!0;let D=new q(x?Ht(A+2,2.4,l+2,.6):Ht(l+2,2.4,A+2,.6),o);D.position.set(P,Do+1,v),i.add(C,D)}let c=30;i.add(hu([[n,c,0,-t/2+c/2,"back"],[t,c,-n/2+c/2,0,"left"],[t,c,n/2-c/2,0,"right"]],.45,.28));let h=Math.max(2,Math.floor(n/110));for(let A=0;A<h;A++){let P=-n/2+n/h*(A+.5),v=new q(new ln(56,36),a);v.position.set(P,34,-t/2+.8),i.add(v);for(let[x,C,D,k]of[[0,52.5,60,2.4],[0,15.5,62,3],[-29,34,2.4,38],[29,34,2.4,38],[0,34,1.6,36]]){let H=new q(Ht(D,k,2,.4),o);H.position.set(P+x,C,-t/2+1.4),i.add(H)}}let u=jn("office");for(let[A,P]of[[-n/2+18,-t/2+18],[n/2-18,-t/2+18],[-n/2+18,t/2-18]]){let v=sc(e,u);v.scale.setScalar(Uo*1.3),v.position.set(A,.4,P),i.add(v)}let d=new Yt,p=new q(Ht(14,26,14,1.5),Kt(e.fridge,{roughness:.3}));p.position.y=13;let g=new q(new _e(6,6,16,20),Kt(e.sky,{transparent:!0,opacity:.7,roughness:.1}));g.position.y=34,d.add(p,g),d.position.set(n/2-16,.4,t/2-22),i.add(d);let _=new Yt,m=new q(new _e(9,9,1.6,48),Ui(e.woodDark));m.rotation.x=Math.PI/2;let f=new q(new xr(7.8,32),Kt(e.trim));f.position.z=.9,_.add(m,f);for(let A=0;A<12;A++){let P=new q(new Ge(.6,A%3?1:1.8,.2),Kt("#2b2a2e")),v=A/12*Math.PI*2;P.position.set(Math.sin(v)*6.6,Math.cos(v)*6.6,1),P.rotation.z=-v,_.add(P)}let S=(A,P,v)=>{let x=new Yt,C=new q(new Ge(P,A,.3),Kt(v));return C.position.y=A/2-.6,x.add(C),x.position.z=1.2,_.add(x),x},w=S(4.4,1,"#2b2a2e"),M=S(6.4,.6,"#2b2a2e"),T=S(6.8,.25,"#e0573f");_.position.set(-n/2+n/h,46,-t/2+1.2),i.add(_),Ni(i),s.castShadow=!1;let E=Lp(i);return Ur(i,[...E,w,M,T]),{group:i,plants:E,clock:{hour:w,minute:M,second:T}}}var XM=(n,t)=>`${n} ${t}${n===1?"":"s"}`,Bo=n=>n.src??(n.path?`/asset?${new URLSearchParams({session:n.session,id:n.id})}`:""),qM={question:"Asks you",permission:"Wants to run",plan:"Plan to approve"};function pu(n,{answerable:t,compact:e=!1}={}){let i=n.who?.kind==="agent"?`<span class="ask-who">${V(n.who.label)}</span>`:"",s=`${n.who?.session??""}|${n.id}`,r=(a,l="",c="")=>t?`<button type="button" class="ask-opt ${c}" data-answer="${V(s)}" data-label="${V(a)}"><b>${V(a)}</b>${l?`<span>${V(l)}</span>`:""}</button>`:`<span class="ask-opt ${c}"><b>${V(a)}</b>${l?`<span>${V(l)}</span>`:""}</span>`,o="";return n.type==="question"?o=(n.questions??[]).map(a=>{let l=a.options.some(c=>c.preview);return`
      <div class="ask-q">
        <p class="ask-text"><span class="chip">${V(a.header)}</span>${V(a.question)}</p>
        <div class="ask-opts ${l&&!e?"previews":""}">${a.options.map((c,h)=>l&&!e?`<${t?'button type="button"':"span"} class="ask-opt pic ${h===0?"rec":""}" ${t?`data-answer="${V(s)}" data-label="${V(c.label)}"`:""}><img alt="" src="${V(c.preview??"")}"><b>${V(c.label)}</b></${t?"button":"span"}>`:r(c.label,e?"":c.description,h===0?"rec":"")).join("")}</div>
      </div>`}).join(""):n.type==="permission"?o=`<p class="ask-text"><code>${V(Ws(n.tool))}</code> ${V(n.summary??"")}</p>
      <div class="ask-opts row">${r("Allow","","rec")}${r("Deny","","no")}</div>`:n.type==="plan"&&(o=`<div class="ask-plan">${(n.plan??"").split(`
`).filter(l=>l.trim()).slice(0,e?3:8).map(l=>/^#/.test(l)?`<b>${V(l.replace(/^#+\s*/,""))}</b>`:`<span>${V(l)}</span>`).join("")}</div>
      <div class="ask-opts row">${r("Approve","","rec")}${r("Keep planning","","no")}</div>`),`
    <div class="ask ${n.type}">
      <p class="ask-eyebrow"><i class="ask-icon">${n.type==="permission"?">_":n.type==="plan"?"\u270E":"?"}</i>${qM[n.type]??"Asks you"}${i}<time>${De(n.t)}</time></p>
      ${o}
      ${t?"":'<p class="ask-where">Answer it in Claude Code; the office shows it so you know it\u2019s waiting.</p>'}
    </div>`}function zo(n){return $s(n)}var YM={completed:"\u2713",in_progress:"\u2731",pending:"\u25CB"};function mu(n,{open:t=!0}={}){let e=n.todos;if(!e?.length)return"";let i=e.filter(r=>r.status==="completed").length,s=e.find(r=>r.status==="in_progress");return`
    <details class="todo" ${t?"open":""} data-todo="${V(n.id)}">
      <summary>
        <span class="todo-ring" style="--f:${(i/e.length).toFixed(3)}"></span>
        <b>${i===e.length?"All done":V(s?.active??s?.text??"Up next")}</b>
        <span class="todo-count">${i}/${e.length}</span>
      </summary>
      <ol>${e.map(r=>`<li class="${r.status}"><i>${YM[r.status]??"\u25CB"}</i>${V(r.text)}</li>`).join("")}</ol>
    </details>`}function gu(n){let t=n.todos;return t?.length?`<span class="todo-bar" title="${t.filter(i=>i.status==="completed").length} of ${t.length} done">${t.map(i=>`<i class="${i.status}"></i>`).join("")}</span>`:""}var ZM={image:["Image","\u25A3"],artifact:["Artifact","\u25C8"],pr:["Pull request","\u21E1"],link:["Link","\u2197"],file:["File","\u25A4"],plan:["Plan","\u270E"]},KM=n=>{try{return new URL(n).host.replace(/^www\./,"")}catch{return""}};function Os(n,{withThread:t=!1}={}){let[e,i]=ZM[n.type]??["Output","\u2022"],r=[(t?et.get(Bt(n.session)):null)?.label,n.agent?et.get(`a:${n.session}:${n.agent}`)?.label:""].filter(Boolean).join(" \xB7 ");if(n.type==="image")return`<button type="button" class="out pic" data-zoom="${V(n.session)}|${V(n.id)}" title="${V(n.title)}">
      <img alt="${V(n.title)}" src="${V(Bo(n))}" loading="lazy">
      <span>${V(n.title)}</span>${r?`<small>${V(r)}</small>`:""}</button>`;let o=n.meta?.additions!==void 0?`<span class="diff"><ins>+${n.meta.additions}</ins> <del>\u2212${n.meta.deletions??0}</del></span>`:"",a=[n.type==="file"?n.path:n.url?KM(n.url):"",r].filter(Boolean).join(" \xB7 "),l=n.url?"a":n.type==="plan"?"button":"div",c=n.url?`href="${V(n.url)}" target="_blank" rel="noopener"`:n.type==="plan"?`type="button" data-zoom="${V(n.session)}|${V(n.id)}"`:"";return`<${l} class="out ${n.type}" ${c}>
    <i class="out-icon">${i}</i>
    <span class="out-main"><b>${V(n.title)}</b><small>${V(e)}${n.meta?.state?` \xB7 ${V(n.meta.state)}`:""}${a?` \xB7 ${V(a)}`:""}</small></span>
    ${o||`<time>${De(n.t)}</time>`}
  </${l}>`}function kp(n){let t=n.kind==="session"?n:et.get(Bt(n.session)),e=Ae.filter(l=>l.session===t?.session&&(n.kind==="session"||l.agent===n.agent));if(!e.length&&!n.todos?.length)return'<p class="muted">Nothing made yet. Pictures, artifacts, pull requests and changed files land here as they happen.</p>';let i=e.filter(l=>l.type==="image"),s=e.filter(l=>["artifact","pr","link","plan"].includes(l.type)),r=e.filter(l=>l.type==="file"),o=r.reduce((l,c)=>l+(c.meta?.additions??0),0),a=r.reduce((l,c)=>l+(c.meta?.deletions??0),0);return`
    ${mu(n,{open:!0})}
    ${s.length?`<h3>Delivered</h3><div class="outs">${s.map(l=>Os(l)).join("")}</div>`:""}
    ${i.length?`<h3>Pictures <small>${i.length}</small></h3><div class="gallery">${i.slice(0,9).map(l=>Os(l)).join("")}</div>`:""}
    ${r.length?`<h3>Files changed <small><ins>+${o}</ins> <del>\u2212${a}</del></small></h3><div class="outs files">${r.slice(0,8).map(l=>Os(l)).join("")}</div>`:""}`}var Bp=n=>Ae.filter(t=>t.session===n.session&&(n.kind==="session"||t.agent===n.agent)&&t.type!=="file").length,ko="all",JM=[["all","All"],["image","Pictures"],["shipped","Artifacts & PRs"],["file","Files"],["plan","Plans"]],jM=n=>ko==="all"?n.type!=="file":ko==="shipped"?["artifact","pr","link"].includes(n.type):n.type===ko;function zp(){let n=Ae.filter(jM),t=new Map;for(let i of n)t.has(i.session)||t.set(i.session,[]),t.get(i.session).push(i);let e=[...t].map(([i,s])=>{let r=et.get(Bt(i)),o=s.filter(l=>l.type==="image"),a=s.filter(l=>l.type!=="image");return`<section class="lib-group">
      <p class="lib-thread"><span>${V(r?.projectName??"")}</span><button type="button" data-pick="${V(Bt(i))}">${V(r?.label??i)}</button></p>
      ${o.length?`<div class="gallery">${o.slice(0,6).map(l=>Os(l)).join("")}</div>`:""}
      ${a.length?`<div class="outs">${a.slice(0,8).map(l=>Os(l)).join("")}</div>`:""}
    </section>`}).join("");return`
    <header class="lib-head">
      <h2>Library <small>${XM(Ae.filter(i=>i.type!=="file").length,"output")}</small></h2>
      <button type="button" class="lib-close" data-library="close" aria-label="Close the library">\xD7</button>
    </header>
    <div class="feeds lib-shelves" role="group" aria-label="Show">${JM.map(([i,s])=>`<button type="button" data-shelf="${i}" class="${ko===i?"on":""}">${s}</button>`).join("")}</div>
    <div class="lib-body">${e||'<p class="muted">Nothing on this shelf yet.</p>'}</div>`}function Hp(n){ko=n}function Vp(n){let[t,e]=n.split("|"),i=Ae.find(o=>o.session===t&&o.id===e);if(!i)return"";let s=et.get(Bt(t));return`<figure class="lb-frame paper">${i.type==="plan"?`<article class="lb-plan">${(i.text??"").split(`
`).map(o=>/^#/.test(o)?`<h3>${V(o.replace(/^#+\s*/,""))}</h3>`:o.trim()?`<p>${V(o)}</p>`:"").join("")}</article>`:`<img alt="${V(i.title)}" src="${V(Bo(i))}">`}<figcaption><b>${V(i.title)}</b><span>${V([s?.label,i.path,De(i.t)].filter(Boolean).join(" \xB7 "))}</span></figcaption></figure>`}var Wp="agent-office-muted",ze=null,Bs=null,Nr=!1;try{Nr=localStorage.getItem(Wp)==="1"}catch{}var Gp=new Map,oc=()=>Nr;function $p(n){Nr=n;try{localStorage.setItem(Wp,n?"1":"0")}catch{}Bs&&(Bs.gain.value=Nr?0:.5)}function Xp(){if(ze){ze.state==="suspended"&&ze.resume();return}let n=window.AudioContext||window.webkitAudioContext;n&&(ze=new n,Bs=ze.createGain(),Bs.gain.value=Nr?0:.5,Bs.connect(ze.destination))}function ks(n,t){if(!ze||Nr||document.hidden)return!1;let e=ze.currentTime;return e-(Gp.get(n)??-1)<t?!1:(Gp.set(n,e),!0)}function os({freq:n,to:t,type:e="sine",dur:i=.15,gain:s=.1,at:r=0,attack:o=.005}){let a=ze.currentTime+r,l=ze.createOscillator(),c=ze.createGain();l.type=e,l.frequency.setValueAtTime(n,a),t&&l.frequency.exponentialRampToValueAtTime(t,a+i),c.gain.setValueAtTime(0,a),c.gain.linearRampToValueAtTime(s,a+o),c.gain.exponentialRampToValueAtTime(1e-4,a+i),l.connect(c).connect(Bs),l.start(a),l.stop(a+i+.05)}var rc=null;function _u({dur:n=.03,gain:t=.05,freq:e=3e3,q:i=1.5,type:s="bandpass",to:r,at:o=0}){if(!rc){rc=ze.createBuffer(1,ze.sampleRate*.5,ze.sampleRate);let u=rc.getChannelData(0);for(let d=0;d<u.length;d++)u[d]=Math.random()*2-1}let a=ze.currentTime+o,l=ze.createBufferSource();l.buffer=rc;let c=ze.createBiquadFilter();c.type=s,c.frequency.setValueAtTime(e,a),r&&c.frequency.exponentialRampToValueAtTime(r,a+n),c.Q.value=i;let h=ze.createGain();h.gain.setValueAtTime(t,a),h.gain.exponentialRampToValueAtTime(1e-4,a+n),l.connect(c).connect(h).connect(Bs),l.start(a,Math.random()*.4),l.stop(a+n+.02)}var as={keys(){ks("keys",.09)&&(_u({dur:.025,gain:.05,freq:2600+Math.random()*1400,q:2}),_u({dur:.02,gain:.03,freq:3200+Math.random()*1200,q:2,at:.06+Math.random()*.04}))},chime(){ks("chime",.4)&&(os({freq:1046.5,dur:.7,gain:.05}),os({freq:1318.5,dur:.9,gain:.045,at:.09}))},bonk(){ks("bonk",.3)&&os({freq:240,to:150,type:"triangle",dur:.22,gain:.08})},pop(){ks("pop",.15)&&os({freq:520,to:980,dur:.09,gain:.06})},hello(){ks("hello",.5)&&(os({freq:880,to:1046,type:"triangle",dur:.08,gain:.04}),os({freq:1175,to:1397,type:"triangle",dur:.1,gain:.035,at:.1}))},clink(){ks("clink",.3)&&(os({freq:2637,dur:.18,gain:.025}),os({freq:3520,dur:.14,gain:.018,at:.02}))},hush(){ks("hush",1)&&_u({dur:.6,gain:.05,freq:400,to:3e3,q:.7})}};var Pu=160,nm=44,im=76,tb=52,eb=80,lc=70,Su=-34,Fr=96,wu=185,nb=n=>n<=2?Math.max(1,n):n<=4?2:3,Or=.78,Vo=18,Eu=9,qp=3,ib=4,sm=2500,sb=12e4,rb=120,ob=10,ab=1.2,lb=38,Yp=21,rm=1.25,om=.2,am=2.1,lm=.08,cb=1e-5,xu=[[0,-62],[-32,-62],[32,-62],[-64,-62],[64,-62],[-16,-90],[16,-90],[-48,-90],[48,-90],[-76,-4],[76,-4],[-76,20],[76,20]],hb=n=>{let[t,e]=xu[n%xu.length],i=Math.floor(n/xu.length);return[t+i*10,e+i*6]},cm=new Gt("#1c1a17"),ki=["coral","teal","mustard","lilac","sky","leaf","pink"],ub={Explore:"sky",Plan:"lilac","general-purpose":"leaf","code-reviewer":"pink","test-runner":"mustard"},Tu=["a","b","c","d","e","f"],_i=n=>`${Math.round(n*100)}%`,ei=n=>n>=.85?"crit":n>=.6?"warn":"ok",gc=n=>{let t=0;for(let e of String(n??""))t=t*31+e.charCodeAt(0)>>>0;return t},cs=n=>ub[n]??ki[gc(n)%ki.length],Bi=n=>ki[gc(n)%ki.length],Lu=n=>Tu[gc(n)%Tu.length],Du=Lu,en,we,Xo,ne,Qt,ee,bn,Au,Go,$e,Ct={},Xe=new Map,cn=new Map,qe=new Map,cc=[],hc=[],uc=[],fc=null,ls=null,ti=null,Oi=null,pc="",mc=()=>{},_c=0,gi={left:0,right:0,top:0,bottom:0},Qn=null,Fi=null,Ho=0,Ru=0,ac=0,zs=new I,On=()=>performance.now()/1e3;function Uu(n,{pick:t}){en=n,mc=t,we=new Kl({antialias:!0}),we.setPixelRatio(Math.min(2,devicePixelRatio)),we.shadowMap.enabled=!0,we.shadowMap.type=Qa,we.shadowMap.autoUpdate=!1,we.outputColorSpace=Pe,en.append(we.domElement),Xo=new ec,Xo.domElement.className="labels",en.append(Xo.domElement),$e=document.createElement("div"),$e.className="bubble",$e.hidden=!0,en.append($e),ne=new Ts;let e=new Cr(we);ne.environment=e.fromScene(new tc,.04).texture,ne.environmentIntensity=om,e.dispose(),Qt=new He(32,1,1,6e3),ee=new Ql(Qt,we.domElement),ee.enableDamping=!0,ee.dampingFactor=lm,ee.enableRotate=!1,ee.screenSpacePanning=!1,ee.mouseButtons={LEFT:Pn.PAN,MIDDLE:Pn.PAN,RIGHT:Pn.PAN},ee.touches={ONE:qn.PAN,TWO:qn.PAN},ee.minDistance=120,ee.maxDistance=4e3,ee.enableZoom=!1,ee.addEventListener("start",()=>{Qn=null}),we.domElement.addEventListener("wheel",Db,{passive:!1}),Au=new xo("#ffffff","#d8cfc2",rm),ne.add(Au),bn=new Mo("#fffaf2",am),bn.position.set(-90,220,120),bn.castShadow=!0,bn.shadow.mapSize.set(2048,2048),bn.shadow.radius=6,bn.shadow.bias=-5e-4,bn.shadow.normalBias=.6,ne.add(bn,bn.target),Go=new q(new ln(8e3,8e3),new Ve),Go.rotation.x=-Math.PI/2,Go.position.y=-.2,ne.add(Go),yu(),matchMedia("(prefers-color-scheme: dark)").addEventListener("change",yu),new MutationObserver(yu).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),Vb(),new ResizeObserver(Jp).observe(en),Jp(),_c=Ru=On()}function yu(){let n=getComputedStyle(document.documentElement),t=["floor","line","ok","warn","crit","clay","thread","scene","wood","wood-dark","trim","pot","glow","window","gem","desk","tile","counter","fridge","carpet","outer-wall","night","dawn","dusk",...ki,...Tu.map(e=>`room-${e}`)];for(let e of t)Ct[e]=new Gt(n.getPropertyValue(`--${e}`).trim()||"#888");ne.background=Ct.scene,Go.material.color.copy(Ct.scene);for(let e of Xe.values())e.mesh&&ne.remove(e.mesh),e.w=null;de&&(ne.remove(de.group),de=null),Sn&&(ne.remove(Sn.group),Sn=null),pc="";for(let e of cn.values())e.track.material.color.copy(Ct.line),e.char.bulb.material.color.copy(Ct.gem),e.char.bulb.material.emissive.copy(Ct.gem),e.rug.material.color.copy(um(e.tint,e.room)),dm(e),e.gaugeKey="";for(let e of qe.values())e.char.accentMat.color.copy(hm(e.tint));Iu=-1}var hm=n=>Ct[n].clone().multiplyScalar(.62),um=(n,t)=>Ct[n].clone().lerp(Ct[`room-${t}`]??Ct.line,.62);function qo(n){return{wood:Ct.wood,woodDark:Ct["wood-dark"],wall:Ct[`room-${n??"a"}`],trim:Ct.trim,pot:Ct.coral.clone().lerp(Ct["wood-dark"],.35),leaf:Ct.leaf,shade:Ct.trim,glow:Ct.glow,sky:Ct.window,window:Ct.window,desk:Ct.desk,tile:Ct.tile,counter:Ct.counter,fridge:Ct.fridge,carpet:Ct.carpet,outerWall:Ct["outer-wall"],books:ki.map(t=>Ct[t]),mugs:ki.map(t=>Ct[t])}}function dm(n){n.desk&&n.group.remove(n.desk.group),n.desk=Up(qo(n.room),Ct[n.tint]),n.desk.group.position.set(0,xe,Su),n.desk.group.traverse(t=>{t.isMesh&&(t.userData.pick={kind:"session",id:n.id})}),n.group.add(n.desk.group)}function Nu(n,t){let e=document.createElement("div");return e.className=`tag ${t}`,e.innerHTML=n,{obj:new Po(e),el:e}}function Wo(n,t){let e=document.createElement("div");return e.className=`flag ${n}`,e.innerHTML=t,{obj:new Po(e),el:e}}function xc(n,t,e,i=Math.PI*2){let s=new q(new mo(n,t,96,1,Math.PI/2,-i),new Ve({color:e,side:fn,transparent:!0}));return s.rotation.x=-Math.PI/2,s.position.y=xe+.9,s}var de=null,Sn=null,Zp="",mn=null;function db(){return de||(de={...Fp(qo("a")),w:No,d:Ns,target:new I,center:new I,placed:!1,taken:new Set,label:Nu('<span class="pname">Coffee corner</span>',"project coffee")},de.label.obj.position.set(-25,62,-Ns/2+14),de.group.add(de.label.obj),ne.add(de.group),de)}function fb(n,t){let e=`${Math.round(n)}x${Math.round(t)}`;Sn&&e===Zp||(Sn&&ne.remove(Sn.group),Sn=Op({W:n,D:t,colors:qo("a")}),Zp=e,ne.add(Sn.group),pb(n,t))}function pb(n,t){if(!mn){let s=new Yt,r=new q(new _e(8,8.4,3,28),new Me({color:"#3b3a3f",roughness:.4}));r.position.y=1.9;let o=new q(new _e(5.4,5.4,.6,24),new Me({color:"#56555c",roughness:.3}));o.position.y=3.6;let a=new q(new fi(.9,10,10),new Ve({color:"#56e39f"}));a.position.set(0,3.7,6),s.add(r,o,a),s.traverse(l=>{l.isMesh&&(l.castShadow=!0)}),ne.add(s),mn={group:s,led:a,i:0}}let e=n/2-34,i=t/2-34;mn.loop=[new I(-e,0,i),new I(e,0,i),new I(e,0,-i+30),new I(-e,0,-i+30)],mn.group.position.copy(mn.loop[0]),mn.i=1}var kr=n=>n.past||n.status==="done",dc=n=>n.lastAt??n.endedAt??n.startedAt??0;function mb(n){let t=new Map;for(let r of et.values())r.kind!=="session"||!r.project||(t.has(r.project)||t.set(r.project,{live:[],past:[]}),t.get(r.project)[kr(r)?"past":"live"].push(r));let e=[];for(let[r,{live:o,past:a}]of t){o.sort((h,u)=>(h.startedAt??0)-(u.startedAt??0)),a.sort((h,u)=>dc(u)-dc(h));let l=[...o,...n?a.slice(0,qp):[]];if(!l.length)continue;let c=et.get(`p:${r}`);e.push({id:`p:${r}`,name:c?.label??r,live:o.length,hidden:a.length-(n?Math.min(a.length,qp):0),sessions:l,recent:Math.max(...l.map(dc))})}let i=e.filter(r=>r.live).sort((r,o)=>r.name.localeCompare(o.name)),s=e.filter(r=>!r.live).sort((r,o)=>o.recent-r.recent).slice(0,ib);return[...i,...s]}function gb(n){let t=Xe.get(n.id);t||(t={id:n.id,label:Nu("","project"),center:new I,target:new I},t.label.el.addEventListener("click",()=>Bu(Oi===n.id?null:n.id)),Xe.set(n.id,t));let e=nb(n.sessions.length),i=e*wu+eb,s=nm+im+(Math.ceil(n.sessions.length/e)-1)*Pu+tb;if(t.cols=e,t.w!==i||t.d!==s){t.mesh&&ne.remove(t.mesh);let a=Pp({w:i,d:s,name:n.name,colors:qo(Lu(n.name))});t.mesh=a.group,t.plants=a.plants,t.mesh.position.copy(t.center),t.mesh.add(t.label.obj),ne.add(t.mesh),t.w=i,t.d=s}t.label.obj.position.set(0,rs+8,-s/2);let r=n.hidden>0?`<span class="pmore">+${n.hidden}</span>`:"",o=`<span class="pname">${V(n.name)}</span>${r}`;return t.html!==o&&(t.label.el.innerHTML=t.html=o),t.label.el.classList.toggle("focused",Oi===n.id),t}function _b(n){let t=cn.get(n.id);return t||(t={id:n.id,home:new I,group:new Yt,gaugeKey:"",placed:!1},t.tint=Bi(n.session),t.room=Lu(et.get(`p:${n.project}`)?.label??n.project),t.body=new Yt,t.char=au({build:"session",bodyColor:Ct[t.tint],inkColor:cm,accentColor:Ct.gem,pick:{kind:"session",id:n.id}}),t.char.root.scale.setScalar(Vo),t.char.root.position.y=xe,t.body.add(t.char.root),t.rug=Dp(um(t.tint,t.room)),t.track=xc(22,23.6,Ct.line),t.label=Nu("","session"),t.label.obj.position.set(0,xe,32),t.label.el.addEventListener("click",()=>mc(n.id)),t.label.el.addEventListener("pointerenter",()=>{ls=n.id,ti={kind:"session",id:n.id}}),t.label.el.addEventListener("pointerleave",()=>{ls===n.id&&(ls=ti=null)}),t.zzz=Wo("zzz","<i>z</i><i>z</i><i>z</i>"),t.zzz.obj.position.set(10,xe+Vo*t.char.height+4,0),t.oops=Wo("oops","!"),t.oops.obj.position.set(0,xe+Vo*t.char.height+10,0),t.ask=Wo("raise",'<span class="sign">?</span><span class="what"></span>'),t.ask.obj.position.set(0,xe+Vo*t.char.height+14,0),t.ask.el.addEventListener("click",()=>mc(n.id)),t.made=Wo("made",""),t.made.obj.position.set(0,xe+50,Su),t.body.add(t.zzz.obj,t.oops.obj,t.ask.obj),t.group.add(t.rug,t.track,t.body,t.label.obj,t.made.obj),dm(t),t.easel=Np(qo(t.room)),t.easel.group.position.set(-50,xe,Su+4),t.easel.group.rotation.y=.35,t.easel.group.visible=!1,t.easel.group.traverse(e=>{e.isMesh&&(e.userData.pick={kind:"session",id:n.id})}),t.group.add(t.easel.group),t.seen=Ae.filter(e=>e.session===n.session).length,t.walkIn=!kr(n)&&On()-_c>3,ne.add(t.group),cn.set(n.id,t),t)}function xb(n){let t=cn.get(n);if(t){ne.remove(t.group);for(let e of[t.label.el,t.zzz.el,t.oops.el,t.ask.el,t.made.el])e.remove();cn.delete(n);for(let[e,i]of qe)i.session===n&&fm(e)}}function yb(n,t){let e=qe.get(n.id);if(e)return e;let i=new Set([...qe.values()].filter(a=>a.session===t.id&&!a.gone&&!a.endedAt).map(a=>a.slot)),s=0;for(;i.has(s);)s++;let r=cs(n.type),o=n.status==="done"?-1/0:On();return e={id:n.id,session:t.id,slot:s,tint:r,born:o,group:new Yt,gone:n.status==="done"},e.char=au({build:n.type,bodyColor:Ct[r],inkColor:cm,accentColor:hm(r),pick:{kind:"agent",id:n.id}}),e.char.root.scale.setScalar(Eu),e.oops=Wo("oops small","!"),e.oops.obj.position.set(0,Eu*e.char.height+8,0),e.group.add(e.char.root,e.oops.obj),e.group.visible=!e.gone,ne.add(e.group),qe.set(n.id,e),!e.gone&&On()-_c>3&&(t.waveAt=On(),as.pop()),e}function fm(n){let t=qe.get(n);t&&(ne.remove(t.group),t.oops.el.remove(),t.spot!==void 0&&de?.taken.delete(t.spot),qe.delete(n))}function vb(n){let t=[...n.map(o=>Xe.get(o.id)),db()],e=Math.max(1,(en.clientWidth||1)-gi.left-gi.right),i=Math.max(1,(en.clientHeight||1)-gi.top-gi.bottom),s=null;for(let o=1;o<=t.length;o++){let a=[];for(let u=0;u<t.length;u+=o)a.push(t.slice(u,u+o));let l=Math.max(...a.map(u=>u.reduce((d,p)=>d+p.w,0)+(u.length-1)*Fr))+lc*2,c=a.reduce((u,d)=>u+Math.max(...d.map(p=>p.d)),0)+(a.length-1)*Fr+lc*2,h=Math.min(e/(l+60),i/(c*Math.sin(Or)+80));(!s||h>s.scale)&&(s={cols:o,W:l,D:c,scale:h})}let r=-s.D/2+lc;for(let o=0;o<t.length;o+=s.cols){let a=t.slice(o,o+s.cols),l=Math.max(...a.map(u=>u.d)),h=-(a.reduce((u,d)=>u+d.w,0)+(a.length-1)*Fr)/2;for(let u of a)u.target.set(h+u.w/2,0,r+u.d/2),u.placed||(u.center.copy(u.target),u.placed=!0),u.rowFront=r+l,h+=u.w+Fr;r+=l+Fr}return fb(s.W,s.D),{W:s.W,D:s.D}}var Fn={W:300,D:Pu};function Fu(n=!1){let t=Oi&&Xe.get(Oi),e=t?t.w:Fn.W,i=t?t.d:Fn.D,s=t?t.target:new I,r=en.clientWidth||1,o=en.clientHeight||1,a={x0:Math.min(gi.left,r*.45),x1:r-Math.min(gi.right,r*.45),y0:Math.min(gi.top,o*.45),y1:o-Math.min(gi.bottom,o*.45)},l=(a.x0+a.x1)/2,c=(a.y0+a.y1)/2,h=(a.x1-a.x0)/2,u=(a.y1-a.y0)/2;Qt.setViewOffset(r,o,r/2-l,o/2-c,r,o);let d=Qt.fov*Math.PI/180,p=2*Math.atan(Math.tan(d/2)*(h/u)),g=Math.max((e+50)/2/Math.tan(p/2),(i*Math.sin(Or)+70)/2/Math.tan(d/2))*(o/(2*u)),_=[];for(let w of[-e/2,e/2])for(let M of[-i/2,i/2+30])for(let T of[0,t?rs+16:66])_.push(new I(s.x+w,T,s.z+M));let m={pos:Qt.position.clone(),quat:Qt.quaternion.clone()},f=new I(s.x,8,s.z);for(let w=0;w<5;w++){Qt.position.set(s.x,Math.sin(Or)*g,s.z+Math.cos(Or)*g),Qt.lookAt(f),Qt.updateMatrixWorld();let M=Math.max(..._.map(T=>{let E=T.clone().project(Qt),A=(E.x+1)/2*r,P=(1-E.y)/2*o;return Math.max(Math.abs(A-l)/(h*.94),Math.abs(P-c)/(u*.94))}));g*=Math.max(.6,M)}let S={pos:new I(s.x,Math.sin(Or)*g,s.z+Math.cos(Or)*g),target:f};t||(ee.maxDistance=g),n||!Kp?(Kp=!0,Qt.position.copy(S.pos),ee.target.copy(S.target),Qn=null):(Qt.position.copy(m.pos),Qt.quaternion.copy(m.quat),Qn=S),Fi=null,ee.update(),Object.assign(bn.shadow.camera,{left:-Fn.W/2-80,right:Fn.W/2+80,top:Fn.D/2+100,bottom:-Fn.D/2-100,near:10,far:900}),bn.shadow.camera.updateProjectionMatrix()}var Kp=!1;function Ou(n){let t=["left","right","top","bottom"].every(e=>Math.abs((gi[e]??0)-n[e])<2);gi=n,t||Fu()}function yc(n){let t=n&&et.get(n),e=t?.kind==="agent"?et.get(Bt(t.session)):t;Bu(e?.project?`p:${e.project}`:null)}function ku(n){let t=n&&et.get(n);ti=t?{kind:t.kind,id:n}:null,ls=t?.kind==="session"?n:null}function Bu(n){let t=n&&Xe.has(n)?n:null;t===Oi&&Qn||(Oi=t,Fu())}function Jp(){let n=en.clientWidth,t=en.clientHeight;we.setSize(n,t),Xo.setSize(n,t),Qt.aspect=n/Math.max(1,t),Qt.updateProjectionMatrix(),pc=""}var pm=()=>Fn.W/2-lc/2,mm=n=>(n?.rowFront??n?.target.z??0)+Fr/2;function gm(n,t,e,i){n.walk={group:t,path:e.map(s=>s.clone()),then:i}}function jp(n,t){let e=n.walk;if(!e)return!1;let i=rb*t;for(;i>0&&e.path.length;){let s=e.path[0],r=e.group.position,o=s.x-r.x,a=s.z-r.z,l=Math.hypot(o,a);if(l>.01){let h=Math.atan2(o,a)-e.group.rotation.y;h=Math.atan2(Math.sin(h),Math.cos(h)),e.group.rotation.y+=h*Math.min(1,t*10)}l<=i?(r.x=s.x,r.z=s.z,i-=l,e.path.shift()):(r.x+=o/l*i,r.z+=a/l*i,i=0)}return e.path.length?!0:(n.walk=null,e.then?.(),!1)}function Mb(n){let t=et.get(n.id);return t&&Xe.get(`p:${t.project}`)}function bb(n,t){let e=de,i=e?e.spots.findIndex((h,u)=>!e.taken.has(u)):-1;if(i<0){n.leaving=On();return}e.taken.add(i),n.spot=i;let s=Mb(t),r=e.target.clone().add(e.spots[i]),o=(gc(n.id)%5-2)*9,a=mm(s)+o,l=pm()+o,c=[new I(n.group.position.x,0,a),new I(l,0,a),new I(l,0,r.z),r];gm(n,n.group,c,()=>{n.onBreak=On(),as.clink();let h=new q(new _e(.17,.15,.32,12),new Me({color:Ct.trim}));h.position.set(.45,-.12,.2),n.char.arms[1].add(h)})}function zu(n){let t=mb(n),e=new Set;for(let r of t)gb(r),r.sessions.forEach(o=>{e.add(o.id),_b(o)});for(let r of[...Xe.keys()])t.some(o=>o.id===r)||(ne.remove(Xe.get(r).mesh),Xe.get(r).label.el.remove(),Xe.delete(r));Oi&&!Xe.has(Oi)&&(Oi=null);for(let r of[...cn.keys()])e.has(r)||xb(r);let i=new Set;for(let r of et.values()){if(r.kind!=="agent")continue;let o=cn.get(Bt(r.session)),a=o&&et.get(o.id);!o||!a||kr(a)||(yb(r,o),i.add(r.id))}for(let r of[...qe.keys()])i.has(r)||fm(r);let s=t.map(r=>`${r.id}:${r.sessions.map(o=>o.id).join(",")}`).join("|")+`@${en.clientWidth}x${en.clientHeight}`;if(s!==pc){pc=s,Fn=vb(t);for(let r of t){let o=Xe.get(r.id);r.sessions.forEach((a,l)=>{let c=cn.get(a.id),h=Math.floor(l/o.cols),u=Math.min(o.cols,r.sessions.length-h*o.cols),d=l%o.cols;if(c.home.set(o.target.x-(u-1)*wu/2+d*wu,0,o.target.z-o.d/2+nm+im+h*Pu),!c.placed&&(c.group.position.copy(c.home),c.placed=!0,c.walkIn)){let p=pm(),g=mm(o),_=m=>m.sub(c.home);c.body.position.copy(_(new I(p,0,Fn.D/2+20))),gm(c,c.body,[_(new I(p,0,g)),_(new I(c.home.x,0,g)),new I(0,0,0)],()=>{c.body.rotation.y=0})}})}Fu()}return t}function Cu(n){let t=qe.get(n);if(t&&!t.gone)return t.group.position.clone().add(zs.set(0,Eu*t.char.height,0));let e=cn.get(n);return e?e.group.position.clone().add(e.body.position).add(zs.set(0,xe+Vo*e.char.height,0)):null}function Sb(n,t){let e=new q(new fi(1.7,16,16),new Me({color:t,roughness:.5,transparent:!0}));e.castShadow=!0,e.position.copy(n),ne.add(e),cc.push({m:e,born:On(),from:n.clone(),drift:new I((Math.random()-.5)*6,0,(Math.random()-.5)*6)})}function wb(n){let t=new Ge(1.6,.3,1);for(let e=0;e<18;e++){let i=new q(t,new Me({color:Ct[ki[e%ki.length]],transparent:!0}));i.position.copy(n),ne.add(i);let s=Math.random()*Math.PI*2,r=14+Math.random()*18;uc.push({m:i,born:On(),vel:new I(Math.cos(s)*r,34+Math.random()*22,Math.sin(s)*r),spin:new I(Math.random()*9,Math.random()*9,Math.random()*9)})}}function Hu(n){let t=On(),e=n.agent?Ce(n.session,n.agent):Bt(n.session),i=cn.get(Bt(n.session));if(n.kind==="tool.start"||n.kind==="tool.end"&&!n.ok){let s=qe.get(e)??i;if(!s)return;n.kind==="tool.start"?(s.hopAt=t,s.lastAt=t,i&&(i.lookAt=n.agent?e:null),as.keys()):(s.failAt=t,as.bonk());let r=Cu(e);r&&Sb(r,n.kind==="tool.end"?Ct.crit:Ct[Hc(n.tool)]??Ct.line)}else if(n.kind==="context.compact"&&i&&!n.agent){let s=xc(23,24,Ct[i.tint]);s.position.x=i.group.position.x,s.position.z=i.group.position.z,ne.add(s),hc.push({r:s,born:t}),as.hush()}else if(n.kind==="turn.start"&&i&&!n.agent)i.hopAt=t;else if(n.kind==="turn.complete"&&i&&!n.agent){let s=Cu(i.id);s&&wb(s),as.chime()}}var Iu=-1,vu=[[0,"night"],[5.5,"night"],[7,"dawn"],[9,"window"],[16.5,"window"],[18.5,"dawn"],[19.5,"dusk"],[21,"night"],[24,"night"]];function Eb(n){if(n-Iu<5)return;Iu=n;let t=new Date,e=t.getHours()+t.getMinutes()/60,i=0;for(;vu[i+1][0]<=e;)i++;let[s,r]=vu[i],[o,a]=vu[i+1],l=(e-s)/Math.max(.01,o-s),c=Ct[r].clone().lerp(Ct[a],l);Fs.color.copy(c),Fs.emissive.copy(c);let h=r==="night"&&a==="night"?1:r==="window"&&a==="window"?0:r==="night"?1-l:a==="night"?l:.4;Fs.emissiveIntensity=.45-h*.15,Oo.emissive.copy(Ct.glow),Oo.emissiveIntensity=.45+h*1.1,bn.intensity=am-h*.7,bn.color.set("#fffaf2").lerp(new Gt("#c9d4ff"),h*.6),Au.intensity=rm-h*.3,ne.environmentIntensity=om*(1-h*.5)}function Tb(n,t){let e=`${ei(t)}:${t.toFixed(3)}`;e!==n.gaugeKey&&(n.gaugeKey=e,n.gauge&&n.group.remove(n.gauge),n.gauge=t>0?xc(14.6,16.6,Ct[ei(t)],Math.max(.05,Math.PI*2*t)):null,n.gauge&&(n.gauge.position.y+=.05,n.group.add(n.gauge)))}function Qp(n,t,e,i){let s=n.failAt?(i-n.failAt)/1.4:1;t.rig.rotation.z=s<1?Math.sin(i*38)*.09*(1-s):0,e.classList.toggle("on",s<1)}function Mu(n,t,e){let i=n.waveAt?(e-n.waveAt)/ab:1;if(i>=1)return;let s=t.arms[0];s.rotation.x=0,s.rotation.z=-(2.1+Math.sin(e*16)*.35)*Math.sin(Math.min(1,i*4)*Math.PI/2)}var $o=new Map;function Ab(n){let t=[];for(let e of qe.values())e.gone||e.leaving||!e.endedAt||!(e.walk||e.onBreak)||t.push({view:e,pos:e.group.position,walking:!!e.walk});for(let e of cn.values())e.walk&&t.push({view:e,pos:e.group.position.clone().add(e.body.position),walking:!0});for(let e=0;e<t.length;e++)for(let i=e+1;i<t.length;i++){let s=t[e],r=t[i];if(!s.walking&&!r.walking||Math.hypot(s.pos.x-r.pos.x,s.pos.z-r.pos.z)>lb)continue;let o=s.view.id<r.view.id?`${s.view.id}|${r.view.id}`:`${r.view.id}|${s.view.id}`;n-($o.get(o)??-99)<12||($o.set(o,n),s.view.waveAt=r.view.waveAt=n,as.hello())}$o.size>200&&$o.clear()}function Rb(){let n=[...qe.values()].filter(t=>!t.gone&&!t.walk&&!t.leaving&&t.settled);for(let t=0;t<n.length;t++)for(let e=t+1;e<n.length;e++){let i=n[t].group.position,s=n[e].group.position,r=s.x-i.x,o=s.z-i.z,a=Math.hypot(r,o)||.01;if(a>=Yp)continue;let l=(Yp-a)/2;i.x-=r/a*l,i.z-=o/a*l,s.x+=r/a*l,s.z+=o/a*l}}function Vu(){let n=On(),t=Math.min(.1,n-Ru);Ru=n;let e=Date.now(),i=new Set;for(let s of et.values())s.kind==="tool"&&s.status==="active"&&i.add(s.owner);Eb(n);for(let s of Xe.values()){s.center.lerp(s.target,.12),s.mesh.position.copy(s.center);for(let r of s.plants??[])r.rotation.z=Math.sin(n*.8+r.userData.plant)*.035}if(de&&(de.center.lerp(de.target,.12),de.group.position.copy(de.center),de.animate(n)),Sn){for(let o of Sn.plants)o.rotation.z=Math.sin(n*.7+o.userData.plant)*.03;let s=new Date,r=s.getSeconds()+s.getMilliseconds()/1e3;Sn.clock.second.rotation.z=-(r/60)*Math.PI*2,Sn.clock.minute.rotation.z=-((s.getMinutes()+r/60)/60)*Math.PI*2,Sn.clock.hour.rotation.z=-((s.getHours()%12+s.getMinutes()/60)/12)*Math.PI*2}if(mn?.loop){let s=mn.loop[mn.i],r=mn.group,o=s.x-r.position.x,a=s.z-r.position.z,l=Math.hypot(o,a),c=22*t;if(l<=c)mn.i=(mn.i+1)%mn.loop.length;else{r.position.x+=o/l*c,r.position.z+=a/l*c;let h=Math.atan2(o,a)-r.rotation.y;h=Math.atan2(Math.sin(h),Math.cos(h)),r.rotation.y+=h*Math.min(1,t*4)}mn.led.visible=Math.floor(n*2)%2===0}for(let s of cn.values()){let r=et.get(s.id);if(!r)continue;s.group.position.lerp(s.home,.12);let o=kr(r),a=sn(r),l=jp(s,t),c=i.has(s.id)||e-(r.lastAt??0)<sm,h=o?0:l||c?1:Math.max(0,1-(n-(s.lastAt??-9))/2.5),u=o||!c&&!l&&e-(r.lastAt??r.startedAt??e)>sb,d=s.lookAt&&qe.get(s.lookAt),p=d&&!d.endedAt?Math.atan2(d.group.position.x-s.group.position.x,d.group.position.z-s.group.position.z):0;nc(s.char,n,{busy:h,look:l?0:Math.max(-.45,Math.min(.45,p*.3)),hop:s.hopAt?(n-s.hopAt)/.35:1,alarm:!o&&!l&&a>=Gi,asleep:u}),Qp(s,s.char,s.oops.el,n),Mu(s,s.char,n),s.char.bodyMat.color.copy(Ct[s.tint]).lerp(Ct.line,o?.6:0),s.char.bulb.visible=!o,s.zzz.el.classList.toggle("on",u&&!l),s.desk.draw(n,o?"off":h>.5&&!l?"busy":"idle",`#${Ct[s.tint].getHexString()}`),s.desk.steam(n,!o&&c),Lb(s,r,n,o),Tb(s,a);let g=!o&&a>=Gi;g&&!s.alarm&&(s.alarm=xc(26.5,27.5,Ct.crit),s.group.add(s.alarm)),!g&&s.alarm&&(s.group.remove(s.alarm),s.alarm=null),s.alarm&&(s.alarm.material.opacity=.35+.45*(Math.sin(n*3)+1)/2);let _=`<span class="sname">${V(r.label)}</span>${r.context?.tokens?`<span class="pct ${ei(a)}">${_i(a)}</span>`:""}`;s.html!==_&&(s.label.el.innerHTML=s.html=_),s.label.el.classList.toggle("selected",fc===s.id),s.label.el.classList.toggle("past",o)}for(let s of qe.values()){let r=et.get(s.id),o=cn.get(s.session);if(!r||!o||(r.status==="done"&&!s.endedAt&&(s.endedAt=n,s.gone||(s.waveAt=n,o.waveAt=n+.2,s.departAt=n+.9)),s.gone))continue;s.departAt&&n>=s.departAt&&(s.departAt=null,bb(s,o)),Qp(s,s.char,s.oops.el,n);let a=jp(s,t);if(s.endedAt){if(!a&&s.onBreak&&!s.leaving&&n-s.onBreak>ob&&(s.leaving=n),nc(s.char,n+s.slot,{busy:a?1:0,hop:1}),Mu(s,s.char,n),s.onBreak&&!s.leaving){let d=de.target.clone().add(de.tableAt),p=Math.atan2(d.x-s.group.position.x,d.z-s.group.position.z);s.group.rotation.y+=Math.atan2(Math.sin(p-s.group.rotation.y),Math.cos(p-s.group.rotation.y))*Math.min(1,t*6);let g=Math.sin((n-s.onBreak)*1.3)>.85;s.char.arms[1].rotation.x=g?-1.3:-.5,s.char.arms[1].rotation.z=.35}if(s.leaving){let d=Math.min(1,(n-s.leaving)/1.6);s.group.scale.setScalar(Math.max(.01,1-d)),d>=1&&(s.gone=!0,s.group.visible=!1,s.spot!==void 0&&de?.taken.delete(s.spot))}continue}let[l,c]=hb(s.slot),h=new I(o.group.position.x+l,xe,o.group.position.z+c),u=Math.min(1,(n-s.born)/.6);s.group.rotation.y=Math.atan2(o.group.position.x-s.group.position.x,o.group.position.z-s.group.position.z)*.45,nc(s.char,n+s.slot,{busy:r.status==="active"&&(i.has(s.id)||n-(s.lastAt??-9)<1.5)?1:0,hop:s.hopAt?(n-s.hopAt)/.3:1,alarm:r.status==="active"&&sn(r)>=Gi}),Mu(s,s.char,n),s.group.scale.setScalar(Math.max(.01,u<1?u*(1+.2*Math.sin(u*Math.PI)):1)),h.y=xe+(1-u)*(1-u)*40,s.group.position.lerp(h,u<1||!s.settled?1:.1),s.settled=!0}ac%3===0&&Ab(n),Rb();for(let s=cc.length-1;s>=0;s--){let r=cc[s],o=(n-r.born)/1.6;if(o>=1){ne.remove(r.m),r.m.geometry.dispose(),r.m.material.dispose(),cc.splice(s,1);continue}r.m.position.copy(r.from).addScaledVector(r.drift,o).add(zs.set(0,o*16,0)),r.m.material.opacity=1-o*o}for(let s=hc.length-1;s>=0;s--){let r=hc[s],o=(n-r.born)/1.8;if(o>=1){ne.remove(r.r),hc.splice(s,1);continue}r.r.scale.setScalar(1+o*2.2),r.r.material.opacity=1-o}for(let s=uc.length-1;s>=0;s--){let r=uc[s],o=(n-r.born)/1.5;if(o>=1){ne.remove(r.m),r.m.material.dispose(),uc.splice(s,1);continue}r.vel.y-=70*t,r.m.position.addScaledVector(r.vel,t),r.m.position.y<xe+.4&&(r.m.position.y=xe+.4,r.vel.multiplyScalar(.3)),r.m.rotation.x+=r.spin.x*t,r.m.rotation.y+=r.spin.y*t,r.m.material.opacity=1-o*o}if(Qn){let s=1-Math.pow(.002,t);Qt.position.lerp(Qn.pos,s),ee.target.lerp(Qn.target,s),Qt.position.distanceTo(Qn.pos)<.5&&(Qn=null)}Ub(t),ee.dampingFactor=1-Math.pow(1-lm,t*60),ee.update(),Qn||Fb(),Nb(),ac%2===0&&(we.shadowMap.needsUpdate=!0),Ob(n,t),we.render(ne,Qt),Xo.render(ne,Qt),Hb(ac%10===1),ac++%6===0&&kb()}var tm=new Map;function Cb(n,t){let e=tm.get(n);e||(e=new Image,e.decoding="async",e.src=n,tm.set(n,e)),e.complete&&e.naturalWidth?t(e):e.addEventListener("load",()=>t(e),{once:!0})}var bu={pr:"leaf",artifact:"lilac",plan:"sky",link:"teal"},Ib={pr:"\u21E1",artifact:"\u25C8",plan:"\u270E",link:"\u2197",file:"\u25A4"},Pb=4.5;function Lb(n,t,e,i){let r=(i?[]:$s(t))[0];n.ask.el.classList.toggle("on",!!r),n.ask.el.classList.toggle("permission",r?.type==="permission"),n.ask.el.classList.toggle("plan",r?.type==="plan");let o=r?r.type==="question"?`${r.questions?.[0]?.header??"Question"}?`:r.type==="permission"?`Allow ${Ws(r.tool)}?`:"Approve the plan?":"";n.askWhat!==o&&(n.askWhat=o,n.ask.el.querySelector(".sign").textContent=r?.type==="permission"?">_":r?.type==="plan"?"\u270E":"?",n.ask.el.querySelector(".what").textContent=o),n.desk.showAsk(r?.type,r?.type==="permission"?`#${Ct.mustard.getHexString()}`:r?.type==="plan"?`#${Ct.sky.getHexString()}`:`#${Ct.clay.getHexString()}`);let a=t.todos;n.easel.group.visible=!!a?.length&&!i,n.easel.group.visible&&n.easel.draw(a,`#${Ct[n.tint].getHexString()}`,e);let l=Ae.filter(c=>c.session===t.session);if(l.length!==n.seen){let c=l.slice(0,Math.max(0,l.length-(n.seen??0)));n.seen=l.length;let h=c.find(d=>d.type==="image");h&&Cb(Bo(h),d=>{n.desk.showImage(d,On()+6),n.desk.setPhoto(d)});let u=h??c.find(d=>d.type!=="file");u&&(n.made.el.innerHTML=u.type==="image"?`<img alt="" src="${V(Bo(u))}"><span>${V(u.title)}</span>`:`<i class="out-icon" style="background:var(--${bu[u.type]??"muted"})">${Ib[u.type]??"\u2022"}</i><span>${V(u.title)}</span>`,n.madeAt=e,n.hopAt=e),n.desk.setTray(l.filter(d=>bu[d.type]).reverse().map(d=>Ct[bu[d.type]]))}n.made.el.classList.toggle("on",n.madeAt!==void 0&&e-n.madeAt<Pb&&!i)}function Db(n){n.preventDefault(),Qn=null;let t=n.deltaY*(n.deltaMode===1?16:n.deltaMode===2?100:1);n.ctrlKey&&(t*=10);let e=Fi??Qt.position.distanceTo(ee.target);Fi=Di.clamp(e*Math.pow(.95,-t*.01),ee.minDistance,ee.maxDistance)}function Ub(n){if(Fi===null)return;zs.subVectors(Qt.position,ee.target);let t=zs.length(),e=Math.abs(Fi/t-1)<.001?Fi:t*Math.pow(Fi/t,1-Math.pow(cb,n));Qt.position.copy(ee.target).add(zs.setLength(e)),e===Fi&&(Fi=null)}function Nb(){let n=Qt.position.distanceTo(ee.target),t=Math.max(1,n*.1);Math.abs(t-Qt.near)<t*.01||(Qt.near=t,Qt.far=n*3+1500,Qt.updateProjectionMatrix())}function Fb(){let n=1-Qt.position.distanceTo(ee.target)/ee.maxDistance,t=Math.max(0,n)*Fn.W/2,e=Math.max(0,n)*Fn.D/2,i=Di.clamp(ee.target.x,-t,t)-ee.target.x,s=Di.clamp(ee.target.z,-e,e)-ee.target.z;!i&&!s||(ee.target.x+=i,ee.target.z+=s,Qt.position.x+=i,Qt.position.z+=s)}function Ob(n,t){n-_c<3||t>=.1||(Ho=t>1/40?Ho+1:Math.max(0,Ho-1),!(Ho<90||we.getPixelRatio()<=1)&&(we.setPixelRatio(Math.max(1,we.getPixelRatio()-.5)),Ho=0))}function kb(){let n=r=>{let o=et.get(r.id);return(fc===r.id||ls===r.id?0:o&&!kr(o)?1:2)*1e13-dc(o??{})},t=(r,o)=>o.some(a=>r.left<a.right+4&&r.right>a.left-4&&r.top<a.bottom+2&&r.bottom>a.top-2),e=[...Xe.values(),...de?[de]:[]].map(r=>r.label.el.getBoundingClientRect());$e.hidden||e.push($e.getBoundingClientRect());let i=[];for(let r of[...cn.values()].sort((o,a)=>n(o)-n(a))){let o=r.label.el;o.classList.remove("crowded","covered");let a=fc===r.id||ls===r.id&&$e.hidden;if(ti?.id===r.id&&!$e.hidden){o.classList.add("covered");continue}if(!a&&t(o.getBoundingClientRect(),e)){o.classList.add("covered");continue}!a&&t(o.getBoundingClientRect(),i)&&o.classList.add("crowded"),i.push(o.getBoundingClientRect())}let s=$e.hidden?null:$e.getBoundingClientRect();for(let r of[...Xe.values(),...de?[de]:[]])r.label.el.classList.toggle("covered",!!(s&&t(r.label.el.getBoundingClientRect(),[s])))}function Gu(n){fc=n}function Bb(n){for(let t of et.values())if(t.kind==="tool"&&t.status==="active"&&t.owner===n)return t;return null}var em=n=>n>=1e6?`${(n/1e6).toFixed(1)}M`:`${Math.round(n/1e3)}k`,Nn=(n,t)=>t?`<div><dt>${n}</dt><dd>${V(t)}</dd></div>`:"";function zb(n){let t=et.get(n.id);if(!t)return"";let e=Bb(t.id),i=e?`${e.tool}${e.summary?` ${e.summary}`:""}`:"",s=t.context?.tokens?`${_i(sn(t))} \xB7 ${em(t.context.tokens)} of ${em(t.context.window)}`:"";if(t.kind==="agent"){let c=et.get(Bt(t.session)),h=qe.get(t.id),u=t.status!=="done"?t.status==="idle"?"waiting":"working":h?.walk?"finished, heading for coffee":h?.onBreak&&!h.leaving?"finished, on a coffee break":"finished";return`<b><i class="dot ${cs(t.type)}"></i>${V(t.label)}</b>
      ${t.description?`<p>${V(t.description)}</p>`:""}
      <dl>${Nn("status",u)}${Nn("doing",i)}${Nn("context",s)}${Nn("model",t.model)}${Nn("tool calls",t.history?String(t.history):"")}${Nn("for",c?.label)}</dl>`}let r=!kr(t),o=[...et.values()].filter(c=>c.kind==="agent"&&c.session===t.session&&c.status!=="done").length,a=zn.get(t.id)?.actions[0],l=r?e||Date.now()-(t.lastAt??0)<sm?"working":`waiting \xB7 last active ${De(t.lastAt)}`:`ended ${De(t.endedAt??t.lastAt)}`;return`<b><i class="dot ${Bi(t.session)}"></i>${V(t.prompts?.[0]?.text??t.label)}</b>
    <p>${V([t.projectName,t.gitBranch].filter(Boolean).join(" \xB7 "))}</p>
    <dl>${Nn("status",l)}${Nn("doing",i||(a?a.text:""))}${Nn("context",s)}${Nn("helpers",o?String(o):"")}${Nn("model",t.model)}${Nn("cost",t.costUsd!==void 0?`$${t.costUsd.toFixed(2)}`:"")}</dl>`}function Hb(n){if(!ti){$e.hidden=!0;return}let t=Cu(ti.id);if(!t){$e.hidden=!0;return}(n||$e.hidden)&&($e.innerHTML=zb(ti));let e=t.add(zs.set(0,ti.kind==="agent"?6:10,0)).project(Qt);$e.style.left=`${(e.x+1)/2*en.clientWidth}px`,$e.style.top=`${(1-e.y)/2*en.clientHeight}px`,$e.hidden=!1}function Vb(){let n=new bo,t=new Tt,e=s=>{let r=we.domElement.getBoundingClientRect();return t.set((s.clientX-r.left)/r.width*2-1,-((s.clientY-r.top)/r.height)*2+1),n.setFromCamera(t,Qt),n.intersectObjects(ne.children,!0).find(o=>o.object.userData.pick&&o.object.visible)?.object.userData.pick},i=null;we.domElement.addEventListener("pointerdown",s=>{i=[s.clientX,s.clientY]}),we.domElement.addEventListener("pointerup",s=>{!i||Math.hypot(s.clientX-i[0],s.clientY-i[1])>4||mc(e(s)?.id??null)}),we.domElement.addEventListener("pointermove",s=>{if(s.buttons){ti=null;return}let r=e(s);ti=r??null,ls=r?r.kind==="session"?r.id:qe.get(r.id)?.session??null:null,we.domElement.style.cursor=r?"pointer":""}),we.domElement.addEventListener("pointerleave",()=>{ti=null,ls=null})}var Gb={get renderer(){return we},get size(){return Fn},sessionViews:cn,agentViews:qe,rooms:Xe,get camera(){return Qt},get stage(){return en},get controls(){return ee},get coffee(){return de},greeted:$o};var Wb=1500,$b=600,Yo=document.querySelector('meta[name="agent-office-token"]')?.content||"",Br=!1;function $u(n){Br=n}var se=null,xm=n=>n.kind==="agent"?{session:n.session,agent:n.agent}:{session:n.session},Xb=n=>n.kind==="agent"?n.label:"this session";function qb(n,t){let e=n.t?`<time>${De(n.t)}</time>`:"";switch(n.kind){case"you":return`<div class="tx you"><p>${V(n.text)}</p>${e}</div>`;case"chat":return`<div class="tx you chat"><span class="tx-from">${n.from==="agent-office"?"From the office":`From ${V(n.from)}`}</span><p>${V(n.text)}</p>${e}</div>`;case"say":return`<div class="tx say"><p>${V(n.text)}</p>${e}</div>`;case"note":return`<div class="tx note">${V(n.text)}</div>`;case"output":return`<div class="tx made ${n.output.type}">${Os(n.output)}</div>`;case"todo":{let i=n.items.filter(r=>r.status==="completed").length,s=n.items.find(r=>r.status==="in_progress");return`<details class="tx todo-snap"><summary><span class="todo-ring" style="--f:${(i/n.items.length).toFixed(3)}"></span>${i===n.items.length?"Checked off the last item":`Checklist ${i}/${n.items.length}${s?`: ${V(s.text)}`:""}`}</summary><ol>${n.items.map(r=>`<li class="${r.status}"><i>${{completed:"\u2713",in_progress:"\u2731"}[r.status]??"\u25CB"}</i>${V(r.text)}</li>`).join("")}</ol></details>`}case"ask":return`<div class="tx asked"><p class="ask-eyebrow"><i class="ask-icon">${n.type==="permission"?">_":n.type==="plan"?"\u270E":"?"}</i>${n.type==="permission"?"Asked to run":n.type==="plan"?"Asked you to approve a plan":"Asked you"}</p><p>${V(n.text)}</p>${n.answer?`<span class="tx-answer">${V(n.answer)}</span>`:""}${e}</div>`;case"tool":{let i=t.get(n.id),s=i?i.ok?"ok":"bad":"running",r=`<i class="tx-dot ${s}"></i><b>${V(n.name)}</b> <span>${V(n.summary??"")}</span>`;return i?.text?`<details class="tx tool ${s}" data-id="${V(n.id)}"><summary>${r}</summary><pre>${V(i.text)}</pre></details>`:`<div class="tx tool ${s}">${r}</div>`}default:return""}}function Yb(n){return`<div class="tx you chat pending ${n.ok===!1?"failed":""}"><span class="tx-from">From the office</span><p>${V(n.text)}</p><span class="tx-status">${V(n.status)}</span></div>`}function hs(){if(!se?.root.isConnected)return;let n=se.root.querySelector(".tx-log"),t=n.scrollHeight-n.scrollTop-n.clientHeight<60,e=new Map(se.entries.filter(o=>o.kind==="result").map(o=>[o.id,o])),s=se.entries.filter(o=>o.kind!=="result").map(o=>qb(o,e)).join("")+se.pending.map(Yb).join("")||`<p class="tx-empty">${V(se.empty)}</p>`;if(s===se.html)return;se.html=s;let r=new Set([...n.querySelectorAll("details[open]")].map(o=>o.dataset.id));n.innerHTML=s;for(let o of n.querySelectorAll("details"))r.has(o.dataset.id)&&(o.open=!0);(t||se.firstDraw)&&(n.scrollTop=n.scrollHeight),se.firstDraw=!1}async function _m(){let n=se;if(!n?.root.isConnected)return Xu();if(Br){n.entries=ym(et.get(n.id)),hs();return}if(n.isPolling)return;n.isPolling=!0;let{session:t,agent:e}=n.target,i=new URLSearchParams({session:t,...e?{agent:e}:{},...n.next!==void 0?{after:String(n.next)}:{}});try{let s=await fetch(`/transcript?${i}`);if(s.status===404)n.empty="No transcript yet. It appears once Claude Code has written the first turn.";else if(s.ok){let{entries:r,next:o,reset:a}=await s.json();a&&(n.entries=[]),n.entries=[...n.entries,...r].slice(-$b),n.next=o;for(let l of r)l.kind==="chat"&&(n.pending=n.pending.filter(c=>c.text!==l.text&&!l.text.includes(c.text)));n.empty="Nothing said yet."}}catch{n.empty="The bridge isn't answering. Is it still running?"}finally{n.isPolling=!1}se===n&&hs()}function Xu(){se?.timer&&clearInterval(se.timer),se=null}function ym(n){if(!n)return[];let t=et.get(Bt(n.session)),e=[...zn.get(Bt(n.session))?.actions??[]].reverse(),i=n.kind==="agent"?e.filter(r=>r.text.startsWith(n.label)):e,s=n.kind==="agent"?[{kind:"you",text:n.description??`Help with ${t?.label??"the session"}`,t:n.startedAt}]:(n.prompts??[]).map(r=>({kind:"you",text:r.text,t:r.t}));i.forEach((r,o)=>{let a=`demo-${n.id}-${r.t}-${o}`,[l,c]=r.text.startsWith("The session ")?["session",r.text.slice(12)]:[r.text.split(" ")[0],r.text.split(" ").slice(1).join(" ")];s.push({kind:"tool",id:a,name:l,summary:c,t:r.t}),s.push({kind:"result",id:a,ok:r.ok,text:r.ok?"":"Something went wrong (sample activity)."})});for(let r of Ae)r.session!==n.session||(n.kind==="agent"?r.agent!==n.agent:r.agent)||r.type==="plan"||s.push({kind:"output",output:r,t:r.t});for(let r of n.answered??[])s.push(r);return n.todosLog&&s.push(...n.todosLog),s.push(...Zo.get(n.id)??[]),s.sort((r,o)=>(r.t??0)-(o.t??0))}var Zo=new Map;async function Zb(n){let t=et.get(se.id);if(!t||!n.trim())return;let e={text:n.trim(),status:"Sending\u2026"};if(se.pending.push(e),hs(),Br){let i=se.id;setTimeout(()=>{e.status="Queued as the next prompt",hs()},500),setTimeout(()=>{let s=Zo.get(i)??[];s.push({kind:"chat",text:e.text,from:"agent-office",t:Date.now()}),s.push({kind:"say",text:"Got it. (This is the demo: nothing really runs, but in your own office the session reads this as its next prompt and answers here.)",t:Date.now()+1}),Zo.set(i,s),se?.id===i&&(se.pending=se.pending.filter(r=>r!==e),se.entries=ym(t),hs())},1800);return}try{let i=await fetch("/chat",{method:"POST",headers:{"content-type":"application/json","x-agent-office-token":Yo},body:JSON.stringify({...se.target,text:e.text})}),s=await i.json().catch(()=>({}));if(!i.ok)throw new Error(s.error??`the bridge answered ${i.status}`);e.id=s.id,e.status="Waiting for the session to pick it up"}catch(i){e.ok=!1,e.status=`Not sent: ${i.message}`}hs()}function vm(n){if(!se||n.kind!=="chat.delivered")return;let t=se.pending.find(e=>e.id===n.id);t&&(t.ok=n.ok!==!1,t.status=t.ok?Kb(n.how??"Delivered"):`Couldn't deliver it: ${n.how??"unknown reason"}`,hs())}var Kb=n=>n.charAt(0).toUpperCase()+n.slice(1);async function Mm(n,t){if(!n||!t.trim())return{ok:!1,status:"Nothing to send"};if(Br){let e=Zo.get(n.id)??[];return e.push({kind:"chat",text:t.trim(),from:"agent-office",t:Date.now()}),Zo.set(n.id,e),{ok:!0,status:"Queued as the next prompt"}}if(!Yo)return{ok:!1,status:"Messaging needs the office opened from its bridge (run /office)"};try{let e=await fetch("/chat",{method:"POST",headers:{"content-type":"application/json","x-agent-office-token":Yo},body:JSON.stringify({...xm(n),text:t.trim()})}),i=await e.json().catch(()=>({}));if(!e.ok)throw new Error(i.error??`the bridge answered ${e.status}`);return{ok:!0,status:"Sent. It arrives as the next prompt"}}catch(e){return{ok:!1,status:`Not sent: ${e.message}`}}}var bm=()=>Br||!!Yo;function Sm(){let n=se?.root.querySelector(".tx-compose textarea");return n?.focus(),!!n}function Jb(n){return!Br&&!Yo?{off:"Messaging needs the office opened from its bridge (run /office)."}:n.kind==="session"&&(n.past||n.status==="done")?{off:"This session has ended. Resume it in Claude Code to talk to it again."}:n.kind==="agent"&&n.status==="done"?{placeholder:`Message ${n.label}\u2026`,hint:"It has finished: a message resumes it to answer, which uses tokens."}:n.kind==="agent"?{placeholder:`Message ${n.label}\u2026`,hint:"Goes straight to this subagent while it works."}:{placeholder:"Message this session\u2026",hint:"Arrives as its next prompt, marked as from Agent Office. Tool approvals still happen in Claude Code."}}function wm(n,t){if(!n||!t||se?.id===t.id&&se.root===n)return;Xu();let e=Jb(t);n.innerHTML=`
    <div class="tx-log" role="log" aria-live="polite" aria-label="Conversation with ${V(Xb(t))}"></div>
    ${e.off?`<p class="tx-off">${V(e.off)}</p>`:`<form class="tx-compose">
          <textarea rows="2" placeholder="${V(e.placeholder)}" aria-label="${V(e.placeholder)}"></textarea>
          <button type="submit">Send</button>
          <p class="tx-hint">${V(e.hint)} Enter sends, Shift+Enter starts a new line.</p>
        </form>`}`,se={id:t.id,root:n,target:xm(t),entries:[],pending:[],next:void 0,empty:"Reading the transcript\u2026",firstDraw:!0},n.querySelector(".tx-log").addEventListener("click",r=>{let o=r.target.closest("[data-zoom]");o&&(r.preventDefault(),document.dispatchEvent(new CustomEvent("office:zoom",{detail:o.dataset.zoom})))});let i=n.querySelector("form"),s=i?.querySelector("textarea");i?.addEventListener("submit",r=>{r.preventDefault();let o=s.value;s.value="",Zb(o)}),s?.addEventListener("keydown",r=>{r.key==="Enter"&&!r.shiftKey&&!r.isComposing&&(r.preventDefault(),i.requestSubmit())}),hs(),_m(),se.timer=setInterval(()=>{document.hidden||_m()},Wb)}var Em=Xu;var Ye=n=>document.querySelector(n),qu=n=>n===void 0?"\u2014":n>=1e6?`${(n/1e6).toFixed(2)}M`:`${Math.round(n/1e3)}k`,jb=n=>n===void 0?void 0:`$${n.toFixed(2)}`,kn=(n,t)=>`${n} ${t}${n===1?"":"s"}`,Am=4,Qb=3,Ko=n=>n.prompts?.[0]?.text??n.label,xi=n=>n.kind==="session"&&!n.past&&n.status!=="done",Pm={working:"Working",waiting:"Waiting on you",asking:"Needs your answer",stuck:"Needs a look",ended:"Ended",idle:"Idle",done:"Done",failed:"Stopped"},Mc=n=>`<span class="pill ${n}">${Pm[n]}</span>`,tS=n=>`${n.from?`<span class="muted from">${n.from==="agent-office"?"From the office":`From ${V(n.from)}`}</span>`:""}${V(n.text)}`;function Lm(){let n=new Map;for(let t of et.values()){if(t.kind!=="session")continue;let e=t.projectName??"Elsewhere";n.has(e)||n.set(e,[]),n.get(e).push(t)}return[...n].map(([t,e])=>{let i=e.filter(xi).sort((r,o)=>(r.startedAt??0)-(o.startedAt??0)),s=e.filter(r=>!xi(r)).sort((r,o)=>(o.endedAt??o.lastAt??0)-(r.endedAt??r.lastAt??0)).slice(0,Qb);return{name:t,live:i,past:s}}).sort((t,e)=>(e.live.length>0)-(t.live.length>0)||t.name.localeCompare(e.name))}function Dm(){let n=[],t=e=>e.forEach(({node:i,children:s})=>{n.push(i.id),t(s)});for(let e of Lm())for(let i of[...e.live,...e.past])n.push(i.id),xi(i)&&t(Xs(i));return n}function eS(n){return[...et.values()].filter(t=>xi(t)&&["asking","waiting","stuck"].includes(un(t,n))).sort((t,e)=>(un(e,n)==="asking")-(un(t,n)==="asking")||(t.answeredAt??t.startedAt??0)-(e.answeredAt??e.startedAt??0))}function nS(n){let t=[...et.values()].filter(xi);if(!t.length)return"Nothing is running. Start a Claude Code session and it walks into the office.";let e=t.filter(o=>un(o,n)!=="working").length,i=t.length-e,s=[...et.values()].filter(o=>o.kind==="agent"&&Wi(o)==="working").length,r=s?`, with ${kn(s,"agent")} helping`:"";return e?i?`${e} waiting on you, ${i} working${r}.`:`${t.length===1?"Your thread is":`All ${t.length} threads are`} waiting on you.`:`${t.length===1?"Your thread is":`All ${t.length} threads are`} working${r}.`}var Yu=()=>!1;function Rm(n,t){let e=un(n,t);if(e==="asking"){let[r,...o]=zo(n);return`
    <button class="card-head" data-pick="${V(n.id)}" data-hover="${V(n.id)}" title="Open the conversation">
      <span class="card-where"><i class="dot ${Bi(n.session)}"></i>${V(n.projectName??"Elsewhere")}${n.thread?'<span class="badge">thread</span>':""}<time>${De(r.t)}</time></span>
      <b>${V(Ko(n))}</b>
    </button>
    ${pu(r,{answerable:Yu(),compact:!0})}
    ${o.length?`<p class="ask-more">${kn(o.length,"more question")} after this one</p>`:""}`}let i=n.answer?.text,s=e==="stuck"?n.lastReason==="aborted"?"You stopped its last turn.":n.lastReason==="refusal"?"Its last turn ended on a refusal.":"Its last turn ended on an error.":e==="working"?"Back at work.":i?Ke(i):n.turns?"Done with your last request.":"Ready for its first prompt.";return`
    <button class="card-head" data-pick="${V(n.id)}" data-hover="${V(n.id)}" title="Open the conversation">
      <span class="card-where"><i class="dot ${Bi(n.session)}"></i>${V(n.projectName??"Elsewhere")}${n.thread?'<span class="badge">thread</span>':""}<time>${De(n.answeredAt??n.startedAt)}</time></span>
      <b>${V(Ko(n))}</b>
      ${gu(n)}
      <span class="card-said">${V(s)}</span>
    </button>`}var vc=new Map,bc=new Map;function iS(n){let t=document.createElement("li");t.className="card",t.dataset.card=n.id,t.innerHTML=`
    <div class="card-info"></div>
    <form class="card-reply">
      <textarea rows="1" aria-label="Reply to ${V(Ko(n))}" placeholder="Reply\u2026"></textarea>
      <button type="submit" aria-label="Send">\u21B5</button>
      <p class="card-status" hidden></p>
    </form>`;let e=t.querySelector("form"),i=e.querySelector("textarea");return i.value=vc.get(n.id)??"",i.addEventListener("input",()=>vc.set(n.id,i.value)),i.addEventListener("keydown",s=>{s.key==="Enter"&&!s.shiftKey&&!s.isComposing&&(s.preventDefault(),e.requestSubmit())}),e.addEventListener("submit",async s=>{s.preventDefault();let r=et.get(n.id),o=i.value;if(!r||!o.trim())return;i.value="",vc.delete(n.id),bc.set(n.id,{status:"Sending\u2026"}),Cm(t,n.id);let a=await Mm(r,o);bc.set(n.id,a),Cm(t,n.id),a.ok||(i.value=o,vc.set(n.id,o))}),t}function Cm(n,t){let e=bc.get(t),i=n.querySelector(".card-status");i.hidden=!e,e&&(i.textContent=e.status,i.classList.toggle("bad",e.ok===!1))}function sS(n){let t=Ye("#inbox"),e=eS(n),i=e.slice(0,Am),s=new Set(i.map(o=>o.id));for(let o of[...t.querySelectorAll("[data-card]")])et.has(o.dataset.card)&&(s.has(o.dataset.card)||o.contains(document.activeElement)||o.querySelector("textarea")?.value)||(o.remove(),bc.delete(o.dataset.card));t.querySelector(".calm")?.remove(),i.forEach((o,a)=>{let l=t.querySelector(`[data-card="${CSS.escape(o.id)}"]`);l||(l=iS(o)),t.children[a]!==l&&!l.contains(document.activeElement)&&t.insertBefore(l,t.children[a]??null),l.classList.remove("gone"),l.classList.toggle("stuck",un(o,n)==="stuck"),l.classList.toggle("asking",un(o,n)==="asking"),ni(l.querySelector(".card-info"),Rm(o,n)),l.querySelector("form").hidden=!bm()||un(o,n)==="asking"});for(let o of t.querySelectorAll("[data-card]"))s.has(o.dataset.card)||(o.classList.add("gone"),ni(o.querySelector(".card-info"),Rm(et.get(o.dataset.card),n)));t.children.length||t.insertAdjacentHTML("beforeend",'<li class="calm">Nothing is waiting on you. Threads land here when they answer.</li>');let r=e.length-i.length;ni(Ye("#inbox-more"),r>0?`<button data-pick="${V(e[Am].id)}">${kn(r,"more thread")} waiting</button>`:""),ni(Ye("#inbox-count"),e.length?String(e.length):"")}function rS(){return Fc().slice(0,3).map(n=>{let t=n.kind==="agent"?et.get(Bt(n.session)):null,e=n.kind==="agent"?`${n.label} in ${Ke(t?.label??"")}`:Ke(n.label);return`<li><button data-pick="${V(n.id)}"><span class="pct ${ei(sn(n))}">${_i(sn(n))}</span> ${V(e)} will compact soon</button></li>`}).join("")}var Sc="all",oS={all:()=>!0,mail:n=>n.tone==="mail",bad:n=>n.tone==="bad"};function aS(){let n=gs.filter(oS[Sc]).slice(0,14),t={all:"Quiet so far.",mail:"No messages between agents yet.",bad:"Nothing has gone wrong."}[Sc];return n.map(e=>`<li class="${e.tone}"><button data-pick="${V(e.target??"")}"><span>${V(e.text)}</span><time>${De(e.t)}</time></button></li>`).join("")||`<li class="muted"><span>${t}</span></li>`}function lS(n,t){let e=sn(n),i=Wi(n);return`
    <button class="agent-row ${i}" style="--depth:${t}" data-pick="${V(n.id)}" data-hover="${V(n.id)}">
      <i class="dot ${cs(n.type)}"></i>
      <span class="aname">${V(n.label)}${n.description&&n.description!==n.label?`<span class="muted"> \xB7 ${V(n.description)}</span>`:""}</span>
      <span class="astate">${n.mailAt&&Date.now()-n.mailAt<8e3?'<i class="env" title="Just got a message">\u2709</i>':""}${i==="working"&&n.context?.tokens?`<span class="pct ${ei(e)}">${_i(e)}</span>`:`<i class="sdot ${i}" title="${Pm[i]}"></i>`}</span>
    </button>`}var Zu=n=>n.reduce((t,e)=>t+1+Zu(e.children),0);function cS(n,t=1){let e=0,i=[],s=(r,o)=>{for(let{node:a,children:l}of r){if(Wi(a)==="done"){e+=1+Zu(l);continue}i.push(lS(a,o)),s(l,o+1)}};return s(Xs(n),t),e&&i.push(`<p class="folded" style="--depth:${t}">${kn(e,"agent")} finished</p>`),i.join("")}function Im(n,t,e){let i=xi(n),s=un(n,t),r=sn(n),o=i?s==="asking"?`asks: ${zo(n)[0]?.questions?.[0]?.question??zo(n)[0]?.summary??"a plan to approve"}`:s==="working"?n.todos?.find(a=>a.status==="in_progress")?.text??zn.get(n.id)?.actions[0]?.text??"working":s==="stuck"?"its last turn didn\u2019t finish":n.answer?.text?`said ${Ke(n.answer.text)}`:"ready for you":`ended ${De(n.endedAt??n.lastAt)}`;return`
    <div class="thread ${i?"":"past"} ${e===n.id?"on":""}">
      <button class="entry" data-pick="${V(n.id)}" data-hover="${V(n.id)}">
        <i class="dot ${Bi(n.session)}"></i>
        <span class="ename">${V(Ko(n))}${n.thread?'<span class="badge" title="A claude.ai project\u2019s coordinator handed this session its work">thread</span>':""}</span>
        ${i?Mc(s):n.context?.tokens?`<span class="pct ${ei(r)}">${_i(r)}</span>`:"<span></span>"}
        ${i?gu(n):""}
        <span class="estate">${i&&n.context?.tokens?`<span class="pct ${ei(r)}">${_i(r)}</span> \xB7 `:""}${V(o)}</span>
      </button>
      ${i?cS(n):""}
    </div>`}function hS(n,t){let e=Lm(),i=e.flatMap(r=>r.live),s=i.filter(r=>un(r,n)==="working").length;return`
    <h2 class="sideh">Projects <small>${i.length?`${s} working \xB7 ${i.length-s} with you`:"none live"}</small></h2>
    ${e.map(r=>`
      <section class="project">
        <p class="room"><i class="room-${Du(r.name)}"></i>${V(r.name)}<small>${r.live.length?kn(r.live.length,"thread"):"earlier"}</small></p>
        ${r.live.map(o=>Im(o,n,t)).join("")}
        ${r.past.length?`${r.live.length?'<p class="earlier">Earlier</p>':""}${r.past.map(o=>Im(o,n,t)).join("")}`:""}
      </section>`).join("")||'<p class="muted">No sessions yet. Start Claude Code anywhere and it appears here.</p>'}`}function Jo(n,t="",e=""){return`<p class="line ${e}">${n}${t?`<span class="muted">\xB7 ${t}</span>`:""}</p>`}function uS([n,t]){let e=[t.edits&&kn(t.edits,"edit"),t.reads&&kn(t.reads,"read")].filter(Boolean).join(", ");return`<p class="line mono" title="${V(n)}">${V(n.split(/[\\/]/).slice(-2).join("/"))}<span class="muted">\xB7 ${e}</span></p>`}function dS(n){let t=n.breakdown?.categories?.filter(e=>e.kind==="used"&&e.tokens>0);return t?.length?`<h3>What fills it</h3>${[...t].sort((e,i)=>i.tokens-e.tokens).slice(0,6).map(e=>Jo(V(e.name),qu(e.tokens))).join("")}`:""}function fS(n){return n.rateLimits?.length?n.rateLimits.map(t=>Jo(`${V(t.kind.replace("_"," "))} limit`,`${Math.round(t.percentUsed)}% used`)).join(""):""}function Um(n,t,e){if(!n.context?.tokens)return"";let i=sn(n);return`
    <div class="dgauge"><span class="big ${ei(i)}">${_i(i)}</span><span>of ${e} context window ${t?"is":"was"} in use${t&&i>=Gi?". It will compact soon.":"."}</span></div>
    <span class="meter"><span class="${ei(i)}" style="width:${(i*100).toFixed(1)}%"></span></span>
    <p class="dmeta">${qu(n.context.tokens)} of ${qu(n.context.window)} tokens${n.compactions?.length?` \xB7 compacted ${kn(n.compactions.length,"time")}`:""}</p>`}function pS(n){let t=Gr(n),e=[`<button data-back>${V(t[0]?.projectName??"Projects")}</button>`];return t.slice(0,-1).forEach(i=>e.push(`<button data-pick="${V(i.id)}">${V(i.label)}</button>`)),`<nav class="crumbs" aria-label="Where this is">${e.join('<span aria-hidden="true">\u203A</span>')}</nav>`}function mS(n){let t=n.kind==="session"?n:et.get(Bt(n.session)),e=Oc(t).filter(i=>n.kind==="session"||i.from===n.id||i.to===n.id).slice(0,5);return e.length?`<h3>Messages</h3>${e.map(i=>`
    <p class="mail"><b>${V(i.fromName??"Someone")} \u2192 ${V(i.toName??"someone")}</b>${i.text?`<span>${V(i.text)}</span>`:""}<time>${De(i.t)}</time></p>`).join("")}`:""}function gS(n,t){let e=n.kind==="session"?n:et.get(Bt(n.session));if(!e)return"";if(!xi(e))return`<h3>Who helped</h3>${(e.pastAgents??[]).map(o=>Jo(`<i class="dot ${cs(o.type)}"></i>${V(o.label??o.type)}`,V(o.description??""))).join("")||'<p class="muted">No subagents.</p>'}`;let i=[],s=(r,o)=>r.forEach(({node:a,children:l})=>{let c=Wi(a),h=[a.teammate?"teammate":a.fork?"fork":a.background?"background":"",a.type!==a.label?a.type:""].filter(Boolean).join(" \xB7 ");i.push(`
      <button class="member ${a.id===n.id?"on":""}" style="--depth:${o}" data-pick="${V(a.id)}" data-hover="${V(a.id)}">
        <i class="dot ${cs(a.type)}"></i>
        <span class="mname">${V(a.label)}${h?`<small>${V(h)}</small>`:""}</span>
        ${Mc(c)}
        <span class="mdesc">${V(a.description??"")}${a.context?.tokens?` \xB7 ${_i(sn(a))} of its window`:""}</span>
      </button>`),s(l,o+1)});return s(Xs(e),1),`
    <button class="member lead ${e.id===n.id?"on":""}" style="--depth:0" data-pick="${V(e.id)}">
      <i class="dot ${Bi(e.session)}"></i>
      <span class="mname">Lead<small>the main conversation</small></span>
      ${Mc(un(e,t))}
      <span class="mdesc">${e.model?V(e.model):""}</span>
    </button>
    ${i.join("")||'<p class="muted">No agents yet. When the lead hands work off, its agents appear here.</p>'}
    ${mS(n)}`}function _S(n){let t=xi(n),e=zn.get(n.id),i=e?[...e.files].sort((r,o)=>o[1].edits*3+o[1].reads-(r[1].edits*3+r[1].reads)).slice(0,8):[],s=[n.turns!==void 0&&kn(n.turns,"turn"),n.toolCalls!==void 0&&kn(n.toolCalls,"tool call"),n.errors&&kn(n.errors,"error"),jb(n.costUsd),n.model].filter(Boolean).join(" \xB7 ");return`
    ${Um(n,t,"its")}
    ${s?`<p class="dmeta">${V(s)}</p>`:""}
    ${t?dS(n)+fS(n):""}
    ${i.length?`<h3>Files it has worked on</h3>${i.map(uS).join("")}`:""}
    ${e?.actions.length?`<h3>Recently</h3>${e.actions.slice(0,8).map(r=>Jo(V(r.text),De(r.t),r.ok?"":"bad")).join("")}`:""}
    ${n.prompts?.length?`<h3>What you asked</h3>${[...n.prompts].reverse().slice(0,6).map(r=>Jo(tS(r),De(r.t))).join("")}`:""}`}function xS(n){let t=[n.model,n.history?kn(n.history,"tool call"):"",n.cwd?`in ${n.cwd}`:""].filter(Boolean).join(" \xB7 ");return`
    ${Um(n,Wi(n)!=="done","its own")}
    ${t?`<p class="dmeta">${V(t)}</p>`:""}
    ${n.answer?.text?`<h3>Last report</h3><p class="line">${V(n.answer.text)}</p>`:""}`}function yS(n,t){let e=n.kind==="agent",i=e?Wi(n):un(n,t),s=e?[n.description,n.teammateId??(n.teammate?"teammate":""),n.fork?"fork of its parent":n.background?"in the background":""].filter(Boolean).join(" \xB7 "):[n.thread?"Thread of a claude.ai project":"",n.gitBranch,xi(n)?"":`ended ${De(n.endedAt??n.lastAt)}`].filter(Boolean).join(" \xB7 ");return`
    ${pS(n)}
    <h2 class="dtitle"><i class="dot ${e?cs(n.type):Bi(n.session)}"></i>${V(e?n.label:Ko(n))}</h2>
    <p class="dmeta">${Mc(i)} ${V(s)}</p>`}function Nm(n,t){if(n.nodeType!==t.nodeType||n.nodeName!==t.nodeName){n.replaceWith(t);return}if(n.nodeType===Node.ELEMENT_NODE&&n.hasAttribute("data-keep")&&n.getAttribute("data-keep")===t.getAttribute("data-keep"))return;if(n.nodeType!==Node.ELEMENT_NODE){n.nodeValue!==t.nodeValue&&(n.nodeValue=t.nodeValue);return}for(let{name:i}of[...n.attributes])t.hasAttribute(i)||n.removeAttribute(i);for(let{name:i,value:s}of[...t.attributes])n.getAttribute(i)!==s&&n.setAttribute(i,s);let e=[...t.childNodes];for(e.forEach((i,s)=>{let r=n.childNodes[s];r?Nm(r,i):n.append(i)});n.childNodes.length>e.length;)n.lastChild.remove()}function ni(n,t){let e=n.cloneNode(!1);e.innerHTML=t,Nm(n,e)}var Fm=[["transcript","Conversation"],["outputs","Outputs"],["team","Team"],["details","Details"]],zi="transcript",gn=null;function wc(n){Fm.some(([t])=>t===n)&&(zi=n,gn&&ii(gn))}function vS(n,t){let e=n.kind==="session"?n:et.get(Bt(n.session)),i=e&&xi(e)?Zu(Xs(e)):e?.pastAgents?.length??0,s=Bp(n),r=h=>h==="team"&&i?`<small>${i}</small>`:h==="outputs"&&s?`<small>${s}</small>`:"",o=([h,u],d)=>`<button type="button" role="tab" class="tab ${zi===h?"on":""}" aria-selected="${zi===h}" data-tab="${h}" title="${u} (${d+1})">${u}${r(h)}</button>`,a=zo(e??n).filter(h=>n.kind==="session"||h.who?.id===n.id),l=a.map(h=>pu(h,{answerable:Yu()})).join("")+mu(n,{open:!a.length}),c=zi==="transcript"?`${l?`<div class="pinned">${l}</div>`:""}<div class="transcript" data-keep="${V(n.id)}"></div>`:zi==="outputs"?kp(n):zi==="team"?gS(n,t):n.kind==="agent"?xS(n):_S(n);return`${yS(n,t)}<div class="tabs" role="tablist">${Fm.map(o).join("")}</div>${c}`}var Hs=!1,Hi=null;document.addEventListener("office:zoom",n=>{Hi=n.detail,gn&&ii(gn)});addEventListener("keydown",n=>{n.key==="Escape"&&(Hi||Hs)&&(Hi?Hi=null:Hs=!1,gn&&ii(gn))});function ii(n){gn=n;let{running:t,selected:e,pick:i,hover:s,answer:r}=n;Yu=()=>!!r?.can(),ni(Ye("#now"),`<p>${V(nS(t))}</p>`),sS(t),ni(Ye("#full"),rS());for(let c of document.querySelectorAll("[data-feed]"))c.classList.toggle("on",c.dataset.feed===Sc);ni(Ye("#moments"),aS());let o=e&&et.get(e),a=o&&(o.kind==="agent"||o.kind==="session");Ye("#side").classList.toggle("clipboard",!!a),Ye("#side").classList.toggle("talking",!!a&&zi==="transcript"),ni(Ye("#side"),a?vS(o,t):hS(t,e)),a&&zi==="transcript"?wm(Ye("#side .transcript"),o):Em();let l=Ae.filter(c=>c.type!=="file").length;ni(Ye("#library-count"),String(l||"")),Ye("#library").hidden=!Hs,Hs&&ni(Ye("#library"),zp()),Ye("#lightbox").hidden=!Hi,Hi&&ni(Ye("#lightbox"),Vp(Hi));for(let c of document.querySelectorAll("[data-tab]"))c.onclick=()=>wc(c.dataset.tab);for(let c of document.querySelectorAll("[data-feed]"))c.onclick=()=>{Sc=c.dataset.feed,ii(gn)};for(let c of document.querySelectorAll("[data-pick]"))c.onclick=()=>c.dataset.pick&&i(c.dataset.pick);for(let c of document.querySelectorAll("[data-back]"))c.onclick=()=>i(null);Ye("#library-open").onclick=()=>{Hs=!Hs,ii(gn)},Ye("#lightbox").onclick=()=>{Hi=null,ii(gn)};for(let c of document.querySelectorAll("[data-library]"))c.onclick=()=>{Hs=!1,ii(gn)};for(let c of document.querySelectorAll("[data-shelf]"))c.onclick=()=>{Hp(c.dataset.shelf),ii(gn)};for(let c of document.querySelectorAll("[data-zoom]"))c.onclick=h=>{h.preventDefault(),Hi=c.dataset.zoom,ii(gn)};for(let c of document.querySelectorAll("[data-answer]"))c.onclick=h=>{h.stopPropagation();let[u,d]=c.dataset.answer.split("|");r?.send(u,d,c.dataset.label),c.classList.add("picked")};for(let c of document.querySelectorAll("[data-hover]"))c.onpointerenter=()=>s(c.dataset.hover),c.onpointerleave=()=>s(null)}function Om(){if(gn?.selected)return zi!=="transcript"&&wc("transcript"),Sm();let n=document.querySelector("#inbox .card:not(.gone) textarea");return n?.focus(),!!n}var bS=6e4,SS=700,zm=new URLSearchParams(location.search),ta=!!window.AGENT_OFFICE_DEMO||zm.get("demo")==="1",Qo=!0,jo=[],si=null;Uu(document.getElementById("stage"),{pick:Ec});function Ec(n){let t=n&&et.get(n);si=t&&(t.kind==="session"||t.kind==="agent")?n:null,Gu(si),si&&yc(si),ea()}var km=document.getElementById("stage");function wS(){let n=km.clientWidth,t=km.clientHeight,e={left:0,right:0,top:0,bottom:0};for(let i of document.querySelectorAll(".hud.left > *, #side, .topbar")){let s=i.getBoundingClientRect();!s.width||!s.height||getComputedStyle(i).display==="none"||(s.height>t*.5&&s.width<n*.5?s.left+s.width/2<n/2?e.left=Math.max(e.left,s.right+12):e.right=Math.max(e.right,n-s.left+12):s.width>n*.5?s.top+s.height/2<t/2?e.top=Math.max(e.top,s.bottom+8):e.bottom=Math.max(e.bottom,t-s.top+8):s.left+s.width/2<n/2?e.left=Math.max(e.left,s.right+12):e.right=Math.max(e.right,n-s.left+12))}Ou(e)}var ES=new ResizeObserver(wS);for(let n of document.querySelectorAll(".hud.left > *, #side, .topbar, #stage"))ES.observe(n);var TS=n=>n&&(n.tagName==="TEXTAREA"||n.tagName==="INPUT"||n.isContentEditable);addEventListener("keydown",n=>{if(n.metaKey||n.ctrlKey||n.altKey)return;if(TS(document.activeElement)){n.key==="Escape"&&document.activeElement.blur();return}if(n.key==="Escape"){let e=si&&et.get(si),i=e?.kind==="agent"?Gr(e).at(-2):null;Ec(i?.id??null),i||yc(null);return}let t={j:1,ArrowDown:1,k:-1,ArrowUp:-1}[n.key];if(t){let e=Dm();if(!e.length)return;let i=e.indexOf(si);Ec(e[i<0?t>0?0:e.length-1:(i+t+e.length)%e.length]),n.preventDefault();return}["1","2","3","4"].includes(n.key)?wc(["transcript","outputs","team","details"][Number(n.key)-1]):n.key==="r"&&Om()&&n.preventDefault()});var Ku=document.getElementById("sound");function Hm(){Ku.setAttribute("aria-pressed",String(!oc())),Ku.querySelector("span").textContent=oc()?"Sound off":"Sound on"}Ku.addEventListener("click",()=>{$p(!oc()),Hm()});Hm();for(let n of["pointerdown","keydown"])addEventListener(n,Xp,{once:!0});var Bm=document.getElementById("show-past");Bm.addEventListener("change",()=>{Qo=Bm.checked,Vr(jo,Qo)});function AS(){let n=new Set;for(let t of et.values())t.kind==="tool"&&t.status==="active"&&n.add(t.owner);return n}var RS={can:()=>ta,send:(n,t,e)=>{Ic(n,t,e),setTimeout(ea,50)}};function ea(){si&&!et.has(si)&&(si=null),ii({running:AS(),selected:si,pick:Ec,hover:ku,answer:RS})}function Vm(){Nc(Date.now()),zu(Qo),Vu(),requestAnimationFrame(Vm)}setInterval(ea,SS);function Gm(n){aa(n),ca(n),Hu(n),vm(n)}async function Wm(){try{jo=ta?cd():(await(await fetch("/history")).json()).sessions??[]}catch{jo=[]}Vr(jo,Qo)}function Ju(n,t){let e=document.getElementById("conn");e.querySelector("span").textContent=n,e.className=`status ${t}`}function CS(){let n=new EventSource("/stream");n.addEventListener("open",()=>Ju("Live","live")),n.addEventListener("replay",t=>{Dc(),zc();for(let e of JSON.parse(t.data))aa(e),ca(e);Vr(jo,Qo),ea()}),n.addEventListener("message",t=>Gm(JSON.parse(t.data))),n.addEventListener("error",()=>Ju("Reconnecting\u2026","down"))}function IS(){Ju("Sample activity","live"),ld(n=>n.forEach(Gm))}$u(ta);ta||fetch("/healthz").then(n=>n.json()).then(n=>{n.demo&&$u(!0)}).catch(()=>{});await Wm();setInterval(Wm,bS);ta?IS():CS();ea();requestAnimationFrame(Vm);zm.has("debug")&&(window.cluster={model:kc,words:Vc,table:Wu});
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
