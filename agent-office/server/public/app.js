var Pw=Object.defineProperty;var qd=(e,t)=>{for(var n in t)Pw(e,n,{get:t[n],enumerable:!0})};var Si=[{id:"/work/payments-api",name:"acme/payments-api",remote:"git@github.com:acme/payments-api.git"},{id:"/work/web-dashboard",name:"acme/web-dashboard",remote:"git@github.com:acme/web-dashboard.git"}],Xd=["Harden the session handling","Add retries to the webhook worker","Why is the build flaky?","Write tests for the refund flow","Migrate charts to the new tokens","Review the open PR"],kw=[["Read","src/auth/session.ts"],["Grep","timingSafeEqual"],["Glob","**/*.test.ts"],["Bash","npm test -- --watch=false"],["Edit","src/auth/session.ts"],["Write","docs/ARCHITECTURE.md"],["WebFetch","https://nodejs.org/api/crypto.html"],["Bash","git diff --stat"],["mcp__github__list_pull_requests","open PRs"]],Lw=["Done. The retry wrapper is in, with tests. Should it also back off on 429s?","Found it: the build reads a stale cache key. I fixed it locally; want me to open a PR?","I added six tests for refunds. Partial refunds aren\u2019t covered yet. Shall I add them?","The chart tokens are migrated. Two charts still hard-code colors; fix those too?","Review done: one race in session.ts and two nits. I left them as comments."],Og={"Now add tests for it":["Find the untested paths","Write the tests","Run the suite"],"Open a PR with that":["Write the PR description","Push the branch","Open the PR"],"Screenshot it in dark mode too":["Switch to dark mode","Screenshot every chart","Compare with light"]},Dw=["Also check the error path","Keep it to the auth module","Skip the snapshots","Note anything flaky"],Nw=[["Explore","Map the auth module"],["Plan","Design token rotation"],["general-purpose","Write regression tests"],["code-reviewer","Review session.ts"]],mr=2e5,Fg=[["System prompt",3100],["System tools",17800],["MCP tools",9400],["Custom agents",1200],["Memory files",2600],["Skills",1900]],Uw={"Harden the session handling":["Map how sessions are issued","Compare tokens with timingSafeEqual","Rotate the token on login","Add regression tests","Run the suite"],"Add retries to the webhook worker":["Find where deliveries fail","Wrap sends in a retry helper","Back off between tries","Test the retry path"],"Why is the build flaky?":["Reproduce the failure","Bisect the cache keys","Fix the stale key","Rerun CI three times"],"Write tests for the refund flow":["List the refund cases","Write full-refund tests","Write partial-refund tests","Run the suite"],"Migrate charts to the new tokens":["Inventory hard-coded colors","Swap to the new tokens","Screenshot every chart","Check dark mode"],"Review the open PR":["Read the diff","Run it locally","Write up findings"]},Bg=[{header:"Backoff",question:"Should retries also back off on 429s?",multiSelect:!1,options:[{label:"Exponential",description:"Waits 1s, 2s, 4s\u2026 up to 30s. Recommended."},{label:"Fixed delay",description:"Simpler: 5s between tries."},{label:"Only 5xx",description:"Leave 429s alone."}]},{header:"Chart style",question:"Which look should the revenue chart take?",multiSelect:!1,options:[{label:"Bars",description:"Monthly bars, easy to compare.",preview:"bars"},{label:"Area",description:"A smooth trend line, filled.",preview:"area"},{label:"Both",description:"Bars with the trend over them.",preview:"combo"}]},{header:"Scope",question:"Open a PR now, or keep going on partial refunds first?",multiSelect:!1,options:[{label:"Open the PR",description:"Ship what passes; partial refunds next."},{label:"Keep going",description:"One PR with everything."}]},{header:"Checks",question:"Which checks should run before the PR?",multiSelect:!0,options:[{label:"Unit tests",description:"The fast suite, about a minute."},{label:"Lint",description:"Style and obvious mistakes."},{label:"End-to-end",description:"Slow, but catches the most."}]}],Ow=[["Bash","npm publish --dry-run"],["Bash","git push origin fix/stale-cache"],["mcp__github__create_pull_request","acme/payments-api"]],Fw=`# Rotate session tokens

1. Issue a fresh token on every login and privilege change
2. Keep the old one valid for 30s so in-flight requests finish
3. Compare tokens with timingSafeEqual
4. Add tests for reuse and expiry

Touches src/auth/session.ts and src/auth/login.ts.`,Bw=["src/auth/session.ts","src/webhooks/worker.ts","src/refunds/refund.test.ts","src/charts/tokens.ts","ci/cache.yml","docs/ARCHITECTURE.md"],Hw=[["dashboard","Dashboard with the new tokens"],["chart","Revenue chart, dark mode"],["diagram","How a session token flows"],["tests","Test run: 42 passed"]],zw=[["pr","Retry webhook sends with backoff","https://github.com/acme/payments-api/pull/"],["artifact","Flaky build: what broke and why","https://claude.ai/artifact/demo-"],["pr","Fix the stale CI cache key","https://github.com/acme/web-dashboard/pull/"],["artifact","Refund flow test report","https://claude.ai/artifact/demo-"],["pr","Rotate session tokens on login","https://github.com/acme/payments-api/pull/"],["artifact","Chart tokens: before and after","https://claude.ai/artifact/demo-"],["pr","Cover partial refunds with tests","https://github.com/acme/payments-api/pull/"],["link","CI run: three green builds in a row","https://github.com/acme/web-dashboard/actions/runs/"],["artifact","How webhook retries back off","https://claude.ai/artifact/demo-"]];function Hg(e,t=18){let n=`hsl(${t} 62% 58%)`,i=Array.from({length:7},(r,a)=>{let o=30+(a*37+t)%70;return`<rect x="${30+a*36}" y="${150-o}" width="22" height="${o}" rx="3" fill="${a===5?n:"#cfc6b8"}"/>`}).join(""),s={dashboard:`<rect width="320" height="200" fill="#f6f2ea"/><rect width="320" height="22" fill="#2b2a2e"/><circle cx="12" cy="11" r="4" fill="#e66"/><circle cx="24" cy="11" r="4" fill="#eb4"/><circle cx="36" cy="11" r="4" fill="#5b5"/><rect x="12" y="34" width="90" height="154" rx="6" fill="#fff"/><rect x="22" y="46" width="60" height="7" rx="3" fill="${n}"/><rect x="22" y="62" width="50" height="6" rx="3" fill="#ddd"/><rect x="22" y="76" width="66" height="6" rx="3" fill="#ddd"/><rect x="112" y="34" width="196" height="70" rx="6" fill="#fff"/><path d="M122 92 L160 70 L196 80 L232 52 L270 62 L298 44" stroke="${n}" stroke-width="4" fill="none"/><rect x="112" y="114" width="94" height="74" rx="6" fill="#fff"/><rect x="214" y="114" width="94" height="74" rx="6" fill="${n}" opacity=".85"/><text x="226" y="160" font-family="sans-serif" font-size="22" font-weight="700" fill="#fff">$48k</text>`,chart:`<rect width="320" height="200" fill="#1f2433"/><text x="20" y="28" font-family="sans-serif" font-size="13" fill="#e8e2d6">Revenue by month</text>${i.replaceAll("#cfc6b8","#3c4560")}<path d="M40 120 L76 104 L112 110 L148 80 L184 86 L220 52 L256 64" stroke="#f2c14e" stroke-width="3" fill="none"/>`,diagram:`<rect width="320" height="200" fill="#fbf8f2"/><g font-family="sans-serif" font-size="11" fill="#2b2a2e"><rect x="16" y="78" width="74" height="40" rx="8" fill="#fff" stroke="${n}" stroke-width="2"/><text x="32" y="102">Login</text><rect x="124" y="30" width="74" height="40" rx="8" fill="#fff" stroke="#2b2a2e"/><text x="138" y="54">Issue</text><rect x="124" y="126" width="74" height="40" rx="8" fill="#fff" stroke="#2b2a2e"/><text x="134" y="150">Rotate</text><rect x="232" y="78" width="74" height="40" rx="8" fill="${n}"/><text x="246" y="102" fill="#fff">Verify</text></g><path d="M90 92 L124 54 M90 104 L124 140 M198 50 L232 90 M198 146 L232 106" stroke="#8a8378" stroke-width="2"/>`,tests:`<rect width="320" height="200" fill="#16181d"/><g font-family="monospace" font-size="11">${Array.from({length:9},(r,a)=>`<text x="16" y="${30+a*17}" fill="${a===8?"#a7e3a1":"#9aa3b5"}">${a===8?"\u2713 42 passed, 0 failed (3.1s)":`\u2713 refund ${["full","partial","twice","expired","currency","zero","webhook","audit"][a]} case`}</text>`).join("")}</g>`,bars:`<rect width="320" height="200" fill="#fbf8f2"/>${i}`,area:`<rect width="320" height="200" fill="#fbf8f2"/><path d="M30 150 L30 110 L80 96 L130 104 L180 70 L230 78 L290 46 L290 150 Z" fill="${n}" opacity=".35"/><path d="M30 110 L80 96 L130 104 L180 70 L230 78 L290 46" stroke="${n}" stroke-width="4" fill="none"/>`,combo:`<rect width="320" height="200" fill="#fbf8f2"/>${i}<path d="M41 120 L77 104 L113 110 L149 80 L185 86 L221 52 L257 64" stroke="#2b2a2e" stroke-width="3" fill="none"/>`}[e];return`data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">${s}</svg>`)}`}var Yd=new Map;function Zd(e,t,n){let i=Yd.get(`${e}|${t}`);return i?(Yd.delete(`${e}|${t}`),i(n),!0):!1}var Kd=new Set;function zg(e){Kd.add(e)}var Mi=e=>e[Math.floor(Math.random()*e.length)],jd=e=>new Promise(t=>setTimeout(t,e)),ke=(e,t)=>e+Math.floor(Math.random()*(t-e)),$w=[{id:"/work/mobile-app",name:"acme/mobile-app",remote:"git@github.com:acme/mobile-app.git"},{id:"/work/infra",name:"acme/infra",remote:"git@github.com:acme/infra.git"}],gr=null;function $g(e,{busy:t=!1}={}){let n=0;if(gr=function(s,r,a,{asThread:o=!1,first:c=Mi(Xd),job:l=null,firstAsk:u=void 0,turnsLeft:h=1/0}={}){let f=x=>e([{t:Date.now(),session:s,...x}]),p=ke(8e3,4e4),m=0,y=ke(40,180)/100,g=Fg.reduce((x,[,v])=>x+v,0),d=()=>g+p;function _(){let x=d();y+=x/1e6*.05+.001,f({kind:"context.measure",context:{tokens:x,window:mr,percent:Math.round(x/mr*100)},costUsd:Number(y.toFixed(4)),rateLimits:[{kind:"five_hour",percentUsed:Math.min(99,Math.round(y*40))}]}),f({kind:"agent.context",tokens:x})}function w(){f({kind:"context.breakdown",window:mr,used:d(),categories:[...Fg.map(([v,R])=>({name:v,tokens:R,kind:"used"})),{name:"Messages",tokens:p,kind:"used"},{name:"Autocompact buffer",tokens:33e3,kind:"buffer"},{name:"Free space",tokens:Math.max(0,mr-d()-33e3),kind:"free"}]})}async function b(x){let[v,R]=Mi(kw),D=`demo-tool-${++n}`;f({kind:"tool.start",agent:x,id:D,tool:v,summary:R}),await jd(ke(400,3e3)*a),f({kind:"tool.end",agent:x,id:D,tool:v,ok:Math.random()>.12})}async function A(x,v){let[R,D]=Mi(Nw),B=`demo-agent-${++n}`;f({kind:"agent.spawn",agent:B,parent:x,type:R,description:D,model:"claude-haiku-4-5",background:Math.random()>.5});let V=ke(9e3,2e4),X=ke(3,9),z=[];for(let Z=0;Z<X;Z++)v<2&&Math.random()<(v?.08:.2)&&z.push(A(B,v+1)),Z===1&&Math.random()<.4&&f({kind:"agent.message",from:x,to:B,via:"model",text:Mi(Dw)}),await b(B),V+=ke(4e3,26e3),f({kind:"agent.context",agent:B,tokens:V,window:mr,model:"claude-haiku-4-5"});await Promise.all(z),f({kind:"turn.complete",agent:B,reason:"answer",answer:`${D}: done.`}),f({kind:"agent.end",agent:B,status:"completed"})}async function S(x,v){let R=`demo-ask-${++n}`;f({kind:"ask.open",id:R,answerable:!0,...x}),l?.onAsk(!0);let D=await new Promise(B=>{Yd.set(`${s}|${R}`,B),setTimeout(()=>Zd(s,R,v),ke(45e3,75e3)*a)});return f({kind:"ask.close",id:R,answer:D}),l?.onAsk(!1),D}function T(x,v,R){f({kind:"todo.update",items:x.map((D,B)=>({text:D,status:B<v?"completed":B===v&&R?"in_progress":"pending"}))})}async function I(){for(f({kind:"session.start",cwd:r.id,model:"claude-sonnet-5-5",project:r}),_(),w();;){let x=`demo-turn-${++n}`,v=m++===0?c:Mi(Object.keys(Og));o&&(f({kind:"session.thread"}),f({kind:"agent.message",via:"projects-relay",text:v})),f({kind:"turn.start",turnId:x,text:v});let R=Uw[v]??Og[v]??["Look around","Make the change","Test it"];T(R,0,!0);let D=[];for(let z=0,Z=t?ke(1,4):ke(0,3);z<Z;z++)D.push(A(void 0,0));let B=ke(0,360),V=!1;Kd.delete(s);for(let z=0;z<R.length;z++){if(Kd.delete(s)){V=!0;break}T(R,z,!0);for(let $=ke(1,4);$>0;$--)await b(void 0);if(p+=ke(3e3,12e3),_(),Math.random()<.45){let $=Mi(Bw);f({kind:"asset.add",id:`file-${$}`,type:"file",title:$.split("/").pop(),path:$,meta:{additions:ke(4,120),deletions:ke(0,40)}})}if(Math.random()<.3){let[$,lt]=Mi(Hw);f({kind:"asset.add",id:`img-${++n}`,type:"image",title:lt,path:`screenshots/${$}.png`,src:Hg($,B)})}let Z=m===1&&u!==void 0;if(z===(Z?0:1)&&(l||Z||Math.random()<.4)){let $=l?.7:Z?u:Math.random();if($<.6){let lt=Z?Bg[0]:Mi(Bg),ht=[{...lt,options:lt.options.map(vt=>({...vt,...vt.preview&&{preview:Hg(vt.preview,B)}}))}];await S({type:"question",questions:ht},lt.options[0].label)}else if($<.85){let[lt,ht]=Mi(Ow);await S({type:"permission",tool:lt,summary:ht},"Allowed")}else await S({type:"plan",plan:Fw},"Approved")}}if(V){f({kind:"turn.complete",turnId:x,reason:"aborted",durationMs:4e3}),await jd(ke(15e3,25e3)*a);continue}if(T(R,R.length,!1),await Promise.all(D),Math.random()<.6){let[z,Z,$]=Mi(zw),lt=ke(12,240),ht={kind:"asset.add",id:`${z}-${lt}`,type:z,title:Z,url:`${$}${lt}`,...z==="pr"&&{meta:{state:"open",additions:ke(20,300),deletions:ke(2,80)}}};f(ht),z==="pr"&&setTimeout(()=>f({...ht,meta:{...ht.meta,state:"merged"}}),ke(12e3,25e3)*a)}if(p+=ke(4e3,14e3),d()>mr-33e3){let z=d();p=ke(9e3,16e3),f({kind:"context.compact",trigger:"auto",before:z,after:d()})}_();let X=Math.random()<.08?"error":"answer";if(f({kind:"turn.complete",turnId:x,reason:X,durationMs:9e3,...X==="answer"&&{answer:Mi(Lw)}}),w(),l){l.onDone();return}if(await jd((Math.random()<.5?ke(1500,5e3):ke(9e3,2e4))*a),m>=h){f({kind:"session.end",reason:"prompt_input_exit"});return}}}I()},gr("demo-payments-1",Si[0],1,{first:"Harden the session handling",firstAsk:0}),setTimeout(()=>gr("demo-payments-2",Si[0],1.6,{first:"Why is the build flaky?"}),2500),setTimeout(()=>gr("demo-dashboard-1",Si[1],1.3,{asThread:!0,first:"Migrate charts to the new tokens",firstAsk:.9}),5e3),setTimeout(()=>gr("demo-dashboard-2",Si[1],.8,{first:"Review the open PR",turnsLeft:1}),8e3),!t)return;let i=[...Si,...$w];for(let s=0;s<9;s++)setTimeout(()=>gr(`demo-busy-${s+1}`,i[(s+1)%i.length],.8+s%4*.25,{first:Xd[s%Xd.length]}),300+s*400)}var Vw=0;function Vg(){return(e,t,n)=>{let i=++Vw,s=`d${String(Date.now()%1e7).padStart(7,"0")}`.slice(0,8),r=Si.find(a=>a.id===e.dir)??Si[0];setTimeout(()=>{n({state:"working",short:s,session:`${s}-demo-job-${i}`}),gr?.(`${s}-demo-job-${i}`,r,.7,{first:t,job:{onAsk:a=>n({state:a?"blocked":"working",...a&&{waitingFor:"permission prompt"}}),onDone:()=>n({state:"done"})}})},1200)}}function Gg(){let e=Date.now(),t=36e5;return[[Si[0],"demo-past-1",3,"Fix the double-charge race",142e3,1,4.12],[Si[0],"demo-past-2",26,"Add idempotency keys",61e3,0,1.37],[Si[1],"demo-past-3",5,"Dark mode for the charts",188e3,2,6.5],[Si[1],"demo-past-4",50,"Upgrade to React 19",97e3,0,2.05]].map(([n,i,s,r,a,o,c])=>({session:i,project:n,cwd:n.id,gitBranch:"main",model:"claude-sonnet-5-5",startedAt:e-s*t-2*t,endedAt:e-s*t,prompts:[{t:e-s*t-2*t,text:r},{t:e-s*t-t,text:"Now add tests for it"}],turns:2+o*6,toolCalls:ke(30,160),errors:ke(0,6),tools:{Read:40,Edit:12,Bash:20},agents:[{type:"Explore",description:"Map the code",context:41e3,tools:18}],compactions:Array.from({length:o},()=>({trigger:"auto",before:167e3})),context:a,window:mr,costUsd:c}))}var cc={};qd(cc,{BUSY_MS:()=>l0,DEFAULT_WINDOW:()=>of,TOOL_LINGER_MS:()=>i0,WARN_AT:()=>zs,agentState:()=>Dn,aid:()=>Ne,apply:()=>lc,applyHistory:()=>_a,asksOf:()=>_M,clean:()=>hM,fill:()=>Xe,helpers:()=>vr,idOf:()=>ui,isDirty:()=>uM,lineage:()=>va,links:()=>zn,mail:()=>ci,mailOf:()=>df,nodes:()=>F,notices:()=>_r,openAsks:()=>so,outputs:()=>ee,outputsOf:()=>xM,projects:()=>wM,promptLabel:()=>ac,removeNode:()=>Yi,reset:()=>lf,sessionsOf:()=>MM,shortId:()=>cf,sid:()=>Ct,stats:()=>rc,sweep:()=>uf,teamOf:()=>Zi,threadState:()=>$e,toolName:()=>br,touch:()=>af,visible:()=>bM,warnings:()=>hf});var Gw=/^The (\S+) plugin sent a message:\s*/,Ww=/^The coordinator sent a message while you were working:\s*/,qw=["This is how Claude Code surfaces a prompt a plugin submits between turns","Address this before completing your current task."],Xw=e=>e.replace(/\s+/g," ").trim();function jw(e){for(let t of e.matchAll(/\s+(?=This is how\b|Address this\b)/g)){let n=Xw(e.slice(t.index)).replace(/(\.\.\.|…)$/,"").trim();if(qw.some(i=>i.startsWith(n)||n.startsWith(i)))return e.slice(0,t.index)}return e}function Wg(e,t){if(typeof e!="string")return{text:e};let n=Gw.exec(e)??Ww.exec(e);return n?{text:jw(e.slice(n[0].length)).trim(),from:n[1]??t??"a plugin"}:{text:e}}var qg=e=>typeof e=="string"&&e.trimStart().startsWith("<");var Xg="agent-office:";function Jd(e,t){try{let n=globalThis.localStorage?.getItem(Xg+e);return n==null?t:JSON.parse(n)}catch{return t}}function Qd(e,t){try{globalThis.localStorage?.setItem(Xg+e,JSON.stringify(t))}catch{}}var sc=Jd("dev-view",!1)===!0,qe=()=>sc;function jg(e){sc=!!e,Qd("dev-view",sc),globalThis.document?.dispatchEvent(new CustomEvent("office:dev-view",{detail:sc}))}var Yw=new Set(["api","apis","ui","ux","cli","sdk","db","ios","css","html","js","ts","ai","ml","url","http","aws","gcp","pr","ci","id","mcp","llm","sql","json","xml","seo","crm","cms","gpu","vm","os","qa","hq","k8s","tv"]),Kw=new Set(["a","an","and","of","the","for","to","in","on","or","at","by"]);function xr(e){let n=(String(e??"").split(/[\\/]/).filter(Boolean).pop()?.replace(/\.git$/i,"")??"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").split(/[-_.\s]+/).filter(Boolean);return n.length?n.map((i,s)=>{let r=i.toLowerCase();return Yw.has(r)?r==="apis"?"APIs":r==="ios"?"iOS":r==="k8s"?"K8s":r.toUpperCase():s>0&&Kw.has(r)?r:i.charAt(0).toUpperCase()+i.slice(1)}).join(" "):String(e??"")||"Elsewhere"}var Kg=[[/pay|bill|checkout|invoice|stripe|wallet|money|finance|bank/,"\u{1F4B3}"],[/dash|chart|metric|analytic|report|stats/,"\u{1F4CA}"],[/auth|login|secur|password|vault|key/,"\u{1F510}"],[/doc|wiki|blog|book|write|notes?\b/,"\u{1F4DA}"],[/test|qa|spec/,"\u{1F9EA}"],[/mobile|ios|android|app$/,"\u{1F4F1}"],[/game|play/,"\u{1F3AE}"],[/design|ui|style|theme|brand/,"\u{1F3A8}"],[/shop|store|cart|commerce/,"\u{1F6CD}\uFE0F"],[/bot|agent|ai|llm|ml|model/,"\u{1F916}"],[/data|db|sql|warehouse|etl/,"\u{1F5C4}\uFE0F"],[/mail|chat|message|notif/,"\u{1F4AC}"],[/web|site|www|front/,"\u{1F310}"],[/api|server|backend|service/,"\u{1F50C}"],[/infra|deploy|ops|cloud|k8s|docker|terraform/,"\u2601\uFE0F"],[/cli|tool|script|util/,"\u{1F9F0}"],[/mod|plugin|extension/,"\u{1F9E9}"]],tf=["\u{1FAB4}","\u{1F98A}","\u{1F419}","\u{1F680}","\u{1F34B}","\u{1F9ED}","\u{1F388}","\u{1F41D}","\u{1F33B}","\u26F5","\u{1F989}","\u{1F344}","\u{1F422}","\u{1F308}","\u{1F52D}","\u{1F392}"],Zg=[...new Set([...Kg.map(([,e])=>e),...tf])].slice(0,32),Zw=e=>[...String(e)].reduce((t,n)=>t*31+n.charCodeAt(0)>>>0,7);function ef(e){let t=String(e??"").split(/[\\/]/).filter(Boolean).pop()?.toLowerCase()??"";return Kg.find(([n])=>n.test(t))?.[1]??tf[Zw(t)%tf.length]}var yr=Jd("projects",{})??{};function fn(e,t){return yr[e]?.name||xr(t??e)}function Bs(e,t){return yr[e]?.icon||ef(t??e)}var nf=e=>!!(yr[e]?.name||yr[e]?.icon);function sf(e,{name:t,icon:n}={}){let i={...yr},s={...t?.trim()&&{name:t.trim().slice(0,40)},...n&&{icon:n}};Object.keys(s).length?i[e]=s:delete i[e],yr=i,Qd("projects",yr)}var Jw=/^(?:(?:hey|hi|hello|ok|okay)(?:\s+claude)?[\s,!.:-]+|please\s+|pls\s+|(?:can|could|would|will)\s+(?:you|u)\s+(?:please\s+)?|i\s+(?:want|need|would like|'d like)\s+(?:you\s+)?to\s+|help\s+me\s+(?:to\s+)?|let'?s\s+|go\s+ahead\s+and\s+)/i,Qw=e=>e.split(":").pop().replace(/[-_]+/g," ");function tM(e,t){if(e.length<=t)return e;let n=e.slice(0,t-1),i=n.lastIndexOf(" ");return`${(i>t*.5?n.slice(0,i):n).replace(/[\s,;:.-]+$/,"")}\u2026`}function Hs(e,t=64){let n=String(e??"").replace(/```[\s\S]*?(```|$)/g," ").replace(/<[^>]{1,200}>/g," "),i=/^\s*\/([\w:-]+)\b\s*/.exec(n);i&&(n=n.slice(i[0].length)),n=n.replace(/`([^`\n]{1,32})`/g,"$1").replace(/`[^`]*`/g," ").replace(/https?:\/\/(?:www\.)?([^/\s]+)\S*/g,"$1"),n=n.split(`
`).map(s=>s.replace(/^[\s>*#-]+/,"").trim()).find(Boolean)??"",n=n.split(/(?<=[.!?])\s+(?=[A-Z])/)[0];for(let s=0;s<3;s++)n=n.replace(Jw,"");return n=n.replace(/\s+/g," ").replace(/[\s.!?,;:…]+$/,"").replace(/\s+please$/i,"").trim(),i&&(n=`${Qw(i[1])}${n?` ${n}`:""}`),n?(n=n.charAt(0).toUpperCase()+n.slice(1),tM(n,t)):""}var eM=[{key:"fresh",word:"Fresh",below:.35},{key:"busy",word:"Busy",below:.6},{key:"full",word:"Getting full",below:.8},{key:"tired",word:"Needs a break",below:1/0}],no=e=>eM.find(t=>(e??0)<t.below),Yg=e=>String(e).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]);function xa(e,{bare:t=!1,title:n}={}){let i=no(e),s=n??`${Math.round(e*100)}% of its context window in use`;return`<span class="energy ${i.key}" title="${Yg(s)}" ${t?`role="img" aria-label="${Yg(`${i.word}: ${s}`)}"`:""}><i aria-hidden="true"><b style="width:${Math.max(8,Math.round((1-e)*100))}%"></b></i>${t?"":`<span>${i.word}</span>`}</span>`}var i0=6e3,nM=12,iM=25,sM=3e4,rM=6e4,Jg=e=>e.replace(/\s+/g," ").replace(/(\.\.\.|…)$/,"").trim(),oM=(e,t)=>{let[n,i]=[Jg(e),Jg(t)];return n.startsWith(i)||i.startsWith(n)},of=2e5,zs=.8,F=new Map,zn=[],rc={calls:0,errors:0},_r=[],ci=[],aM=60,ee=[],lM=120,vr=[],cM=400,Ki=!0,uM=()=>Ki,hM=()=>{Ki=!1},af=()=>{Ki=!0},s0=e=>`p:${e}`,Ct=e=>`s:${e}`,Ne=(e,t)=>`a:${e}:${t}`,Qg=(e,t)=>`t:${e}:${t}`,ui=e=>typeof e=="object"?e.id:e;function io(e){return F.set(e.id,e),Ki=!0,e}function oc(e,t,n){zn.push({source:e,target:t,kind:n}),Ki=!0}function dM(e,t){zn=zn.filter(n=>!(ui(n.target)===e&&n.kind===t)),Ki=!0}function Yi(e){F.delete(e)&&(zn=zn.filter(t=>ui(t.source)!==e&&ui(t.target)!==e),Ki=!0)}function lf(){for(let[e,t]of F)t.kind!=="project"&&!t.past&&F.delete(e);zn=zn.filter(e=>F.has(ui(e.source))&&F.has(ui(e.target))),Object.assign(rc,{calls:0,errors:0}),_r.length=0,ci.length=0,ee.length=0,vr.length=0,Ki=!0}function Xe(e){let t=e.context;return t?.tokens?Math.min(1,t.tokens/(t.window||r0(e)||of)):0}function r0(e){return F.get(Ct(e.session))?.context?.window}var ac=e=>Hs(e,26)||(e.length>26?`${e.slice(0,25)}\u2026`:e),cf=e=>e.length>14?`${e.slice(0,8)}\u2026`:e;function fM(e){let t=s0(e.id),n=F.get(t)??io({id:t,kind:"project",projectId:e.id,label:e.name});return n.label=e.name,n.remote=e.remote,n}function rf(e,t){!t||e.project===t.id||(fM(t),dM(e.id,"project"),e.project=t.id,e.projectName=t.name,oc(s0(t.id),e.id,"project"))}function fs(e){let t=Ct(e.session),n=F.get(t);return n?(n.past&&(n.past=!1,n.status="active",Ki=!0),n):io({id:t,kind:"session",label:cf(e.session),session:e.session,status:"active",startedAt:e.t,lastAt:e.t,history:0,prompts:[],compactions:[],turns:0,toolCalls:0,errors:0})}function o0(e,t){let n=Ne(e.session,t);if(F.has(n))return F.get(n);fs(e);let i=io({id:n,kind:"agent",label:"subagent",type:"subagent",session:e.session,agent:t,status:"active",startedAt:e.t,history:0,compactions:[]});return oc(Ct(e.session),n,"spawn"),i}var ds=e=>e.agent?o0(e,e.agent):fs(e);function pM(e,t,n,i){_r.unshift({t:e.t,text:t,level:n,target:i}),_r.length>30&&_r.pop()}var t0=e=>`${Math.round(e/1e3)}k`,a0={"projects-relay":"Project coordinator",peer:"Another session","peer-send-message":"Another session",channel:"A channel","slack-ping":"Slack","scheduled-trigger":"A routine",bridge:"You, remotely"},mM=e=>e in a0,gM=e=>a0[e],yM={"session.start"(e){let t=fs(e);Object.assign(t,{status:"active",cwd:e.cwd,model:e.model,startedAt:t.startedAt??e.t}),rf(t,e.project)},"session.end"(e){let t=fs(e);t.status="done",t.endedAt=e.t,t.endReason=e.reason},"turn.start"(e){let t=ds(e);if(t.pulseAt=e.t,t.kind==="session"&&(t.turnOpen=!0,t.turnAt=e.t,t.lastReason=void 0),t.kind==="session"&&e.text){if(t.turns++,qg(e.text))return;let{text:n,from:i}=Wg(e.text);if(t.prompts.some(r=>!r.live&&Math.abs(r.t-e.t)<rM&&oM(r.text,n)))return;let s=t.prompts.at(-1);if(s?.desk&&s.text===n&&e.via!=="front-desk"){s.desk=!1,t.turns--;return}t.prompts.length||(t.label=ac(n)),t.prompts.push({t:e.t,text:n,from:i,live:!0,...e.via==="front-desk"&&{desk:!0}}),t.prompts.length>iM&&t.prompts.shift()}},"turn.complete"(e){if(e.agent&&!F.has(Ne(e.session,e.agent)))return;let t=ds(e);e.context?.window&&(t.context=e.context),e.answer&&(t.answer={t:e.t,text:e.answer}),t.kind==="session"&&(t.turnOpen=!1,t.lastReason=e.reason,t.answeredAt=e.t)},"session.thread"(e){fs(e).thread=!0},"agent.message"(e){fs(e);let t=e.to??[...F.values()].find(a=>a.kind==="agent"&&a.session===e.session&&a.name&&a.name===e.toName)?.agent,n=e.from?Ne(e.session,e.from):mM(e.via)?null:Ct(e.session),i=t?Ne(e.session,t):e.toName?null:Ct(e.session),s=a=>F.get(a)?.kind==="session"?"Lead":F.get(a)?.label;ci.unshift({t:e.t,session:e.session,via:e.via,text:e.text,from:n,to:i,fromName:e.fromName??(n?s(n):gM(e.via)),toName:e.toName??(i?s(i):void 0)}),ci.length>aM&&ci.pop();let r=i&&F.get(i);r&&(r.mailAt=e.t)},"context.measure"(e){let t=fs(e);t.context={...t.context,...e.context},e.costUsd!==void 0&&(t.costUsd=e.costUsd),e.rateLimits&&(t.rateLimits=e.rateLimits)},"context.breakdown"(e){let t=fs(e);t.breakdown={window:e.window,used:e.used,categories:e.categories},t.context={...t.context,window:e.window,tokens:t.context?.tokens??e.used}},"agent.context"(e){if(e.agent&&!F.has(Ne(e.session,e.agent)))return;let t=ds(e),n=e.window??t.context?.window??r0(t)??of;t.context={...t.context,tokens:e.tokens,window:n},e.model&&(t.model=e.model)},"context.compact"(e){let t=ds(e),n={t:e.t,trigger:e.trigger,before:e.before,after:e.after};t.compactions.push(n),t.compactAt=e.t,e.after!==void 0&&(t.context={...t.context,tokens:e.after});let i=e.before?` ${t0(e.before)} \u2192 ${e.after!==void 0?t0(e.after):"?"}`:"";pM(e,`${t.label} compacted (${e.trigger})${i}`,"compact",t.id)},"agent.spawn"(e){fs(e);let t=Ne(e.session,e.agent),n=e.parent?o0(e,e.parent).id:Ct(e.session),i=F.get(t);i||(i=io({id:t,kind:"agent",session:e.session,agent:e.agent,history:0,compactions:[]}),oc(n,t,"spawn")),i.announced||(vr.push({t:e.t,session:e.session,type:e.name||e.type||"subagent"}),vr.length>cM&&vr.shift()),Object.assign(i,{label:e.name||e.type,name:e.name,type:e.type,description:e.description,model:e.model,background:e.background,teammate:e.teammate,teammateId:e.teammateId,fork:e.fork,cwd:e.cwd,parent:n,status:"active",startedAt:e.t,announced:!0}),F.get(n).pulseAt=e.t},"agent.idle"(e){let t=F.get(Ne(e.session,e.agent));t&&(t.status="idle")},"agent.waiting"(e){let t=F.get(Ne(e.session,e.agent));t&&(t.status="waiting")},"agent.end"(e){let t=F.get(Ne(e.session,e.agent));t&&(t.status="done",t.endStatus=e.status,t.endedAt=e.t,vM())},"todo.update"(e){let t=ds(e);t.todos=(e.items??[]).map(i=>({text:i.text,status:i.status,active:i.active})),t.todosAt=e.t;let n=t.todos.filter(i=>i.status==="completed").length;if(n!==t.todosDone){if(t.todosDone=n,!n)return;t.todosLog=[...(t.todosLog??[]).slice(-12),{kind:"todo",items:t.todos,t:e.t}]}},"ask.open"(e){let t=ds(e);t.asks=(t.asks??[]).filter(n=>n.id!==e.id),t.asks.push({id:e.id,t:e.t,type:e.type??"question",questions:e.questions,tool:e.tool,summary:e.summary,plan:e.plan,answerable:e.answerable===!0}),t.askAt=e.t,e.type==="plan"&&e.plan&&n0(e,{id:`plan-${e.id}`,type:"plan",title:e0(e.plan),text:e.plan})},"ask.close"(e){let t=ds(e),n=t.asks?.find(s=>s.id===e.id);if(t.asks=(t.asks??[]).filter(s=>s.id!==e.id),!n)return;let i=n.type==="question"?n.questions?.map(s=>s.question).join(" "):n.type==="plan"?e0(n.plan??""):`${br(n.tool)} ${n.summary??""}`.trim();t.answered=[...(t.answered??[]).slice(-12),{kind:"ask",type:n.type,text:i,answer:e.answer,t:n.t}]},"asset.add"(e){n0(e,e)},"tool.start"(e){let t=ds(e);t.kind==="agent"&&t.status!=="active"&&(t.status="active");let n=Qg(e.session,e.id);if(F.has(n))return;io({id:n,kind:"tool",label:e.tool,tool:e.tool,summary:e.summary,session:e.session,owner:t.id,status:"active",startedAt:e.t}),oc(t.id,n,"tool"),t.lastAt=e.t,rc.calls++;let i=F.get(Ct(e.session));i.toolCalls++,i.lastAt=e.t},"tool.end"(e){let t=F.get(Qg(e.session,e.id));if(!t)return;t.status=e.ok?"ok":"error",t.endedAt=e.t,e.ok||(rc.errors++,F.get(Ct(e.session)).errors++);let n=F.get(t.owner);n&&(n.history++,n.kind==="agent"&&(n.lastAt=e.t))}};function br(e){let t=/^mcp__(.+?)__(.+)$/.exec(e??"");if(!t)return e??"a tool";let n=t[1].replace(/^plugin_\w+_/,"").replace(/[-_]/g," ");return`${n.charAt(0).toUpperCase()}${n.slice(1)}: ${t[2].replace(/_/g," ")}`}var e0=e=>e.replace(/^#+\s*/gm,"").split(`
`).find(t=>t.trim())?.trim().slice(0,80)??"Plan";function n0(e,t){let n=ds(e),i={id:t.id,t:e.t,session:e.session,...e.agent&&{agent:e.agent},type:t.type,title:t.title,url:t.url,path:t.path,src:t.src,text:t.text,meta:t.meta},s=ee.findIndex(a=>a.session===i.session&&a.id===i.id);s>=0&&ee.splice(s,1),ee.unshift(i),ee.length>lM&&ee.pop(),n.outputAt=e.t;let r=F.get(Ct(e.session));r&&(r.outputAt=e.t)}var xM=e=>ee.filter(t=>t.session===e.session),_M=e=>e.asks??[],so=e=>[...F.values()].filter(t=>(t.kind==="session"||t.kind==="agent")&&t.session===e.session&&t.asks?.length).flatMap(t=>t.asks.map(n=>({...n,who:t}))).sort((t,n)=>t.t-n.t);function vM(){let e=[...F.values()].filter(t=>t.kind==="agent"&&t.status==="done").sort((t,n)=>t.endedAt-n.endedAt);for(let t of e.slice(0,Math.max(0,e.length-nM)))Yi(t.id)}function lc(e){yM[e.kind]?.(e)}function uf(e){for(let t of F.values())t.kind==="tool"&&t.endedAt&&e-t.endedAt>i0&&Yi(t.id);for(let t of F.values())t.kind!=="agent"||t.announced||t.status==="done"||e-(t.lastAt??t.startedAt??0)<sM||zn.some(n=>ui(n.source)===t.id&&n.kind==="tool")||Yi(t.id)}function _a(e,t){let n=new Set;for(let i of e){let s=Ct(i.session);n.add(s);let r=F.get(s);if(r&&!r.past){!r.prompts.length&&i.prompts.length&&(r.prompts=i.prompts,r.label=ac(i.prompts[0].text)),r.compactions.length||(r.compactions=i.compactions),r.costUsd??=i.costUsd,r.gitBranch??=i.gitBranch,r.project||rf(r,i.project);continue}if(!t){r&&Yi(s);continue}let a=r??io({id:s,kind:"session",session:i.session,past:!0,history:0});Object.assign(a,{label:i.prompts[0]?.text?ac(i.prompts[0].text):cf(i.session),status:"past",past:!0,cwd:i.cwd,model:i.model,gitBranch:i.gitBranch,startedAt:i.startedAt,endedAt:i.endedAt,lastAt:i.endedAt,prompts:i.prompts,turns:i.turns,toolCalls:i.toolCalls,errors:i.errors,tools:i.tools,pastAgents:i.agents,compactions:i.compactions,costUsd:i.costUsd,context:i.context?{tokens:i.context,window:i.window}:void 0}),rf(a,i.project)}for(let i of[...F.values()])i.past&&!n.has(i.id)&&Yi(i.id);for(let i of[...F.values()])i.kind==="project"&&!zn.some(s=>ui(s.source)===i.id)&&Yi(i.id);Ki=!0}function bM(e){let t=[...F.values()];if(!e)return{nodes:t,links:[...zn]};let n=new Set;for(let i of t)(i.kind==="project"?i.projectId:F.get(Ct(i.session))?.project)===e&&n.add(i.id);return{nodes:t.filter(i=>n.has(i.id)),links:zn.filter(i=>n.has(ui(i.source))&&n.has(ui(i.target)))}}function wM(){return[...F.values()].filter(e=>e.kind==="project").sort((e,t)=>e.label.localeCompare(t.label))}function MM(e){return[...F.values()].filter(t=>t.kind==="session"&&t.project===e).sort((t,n)=>Number(t.past)-Number(n.past)||(n.lastAt??0)-(t.lastAt??0))}function hf(){return[...F.values()].filter(e=>(e.kind==="session"||e.kind==="agent")&&!e.past&&e.status!=="done"&&Xe(e)>=zs).sort((e,t)=>Xe(t)-Xe(e))}var l0=2500;function $e(e,t=new Set){return e.past||e.status==="done"?"ended":e.kind==="session"&&so(e).length?"asking":e.turnOpen||t.has(e.id)||Date.now()-(e.lastAt??0)<l0?"working":e.lastReason&&e.lastReason!=="answer"?"stuck":"waiting"}function Dn(e){return e.status==="done"?e.endStatus==="failed"||e.endStatus==="killed"?"failed":"done":e.status==="idle"?"idle":e.status==="waiting"?"waiting":"working"}function Zi(e){let t=[...F.values()].filter(s=>s.kind==="agent"&&s.session===e.session),n=new Map;for(let s of t){let r=s.parent??e.id;n.has(r)||n.set(r,[]),n.get(r).push(s)}let i=s=>(n.get(s)??[]).sort((r,a)=>(r.startedAt??0)-(a.startedAt??0)).map(r=>({node:r,children:i(r.id)}));return i(e.id)}function va(e){let t=[],n=e;for(;n&&n.kind==="agent";)t.unshift(n),n=F.get(n.parent??Ct(n.session));return n&&t.unshift(n),t}var df=e=>ci.filter(t=>t.session===e.session);var xc={};qd(xc,{activity:()=>Un,ago:()=>Ae,beadColor:()=>_f,doingNow:()=>ba,escapeHtml:()=>P,family:()=>mc,ingest:()=>gc,lastAction:()=>yf,momentText:()=>yc,moments:()=>Nn,quote:()=>xe,reset:()=>xf,say:()=>oo});var SM={read:["Reading","Read","read"],look:["Looking","Looked","look"],search:["Searching","Searched","search"],change:["Changing","Changed","change"],write:["Writing","Wrote","write"],check:["Checking","Checked","check"],build:["Building","Built","build"],install:["Installing","Installed","install"],save:["Saving","Saved","save"],send:["Sending","Sent","send"],fetch:["Fetching","Fetched","fetch"],switch:["Switching","Switched","switch"],tidy:["Tidying","Tidied","tidy"],run:["Running","Ran","run"],hand:["Handing","Handed","hand"],update:["Updating","Updated","update"],ask:["Asking","Asked","ask"],share:["Sharing","Shared","share"],use:["Using","Used","use"],make:["Making","Made","make"],clean:["Cleaning","Cleaned","clean"],create:["Creating","Created","create"],remove:["Removing","Removed","remove"],start:["Starting","Started","start"],move:["Moving","Moved","move"],wait:["Waiting","Waited","wait"]},Se=(e,t)=>{let[n,i,s]=SM[e],r=t?` ${t}`:"";return{now:`${n}${r}`,done:`${i}${r}`,fail:`Couldn\u2019t ${s}${r}`}},EM=[[/\b(auth|login|logout|session|signin|sign-in|oauth|password|token)s?\b/i,"sign-in"],[/\b(refund)s?\b/i,"refund"],[/\b(payment|billing|charge|invoice|checkout|stripe)s?\b/i,"payment"],[/\b(webhook)s?\b/i,"webhook"],[/\b(chart|graph|plot)s?\b/i,"chart"],[/\b(dashboard)s?\b/i,"dashboard"],[/\b(user|account|profile)s?\b/i,"account"],[/\b(api|route|handler|endpoint|controller)s?\b/i,"API"],[/\b(db|database|migration|schema)s?\b/i,"database"],[/\b(email|mail|notification)s?\b/i,"notification"],[/\b(search)\b/i,"search"],[/\b(cache)\b/i,"caching"],[/\b(worker|queue|job)s?\b/i,"background job"],[/\b(ui|component|view|page|screen|widget)s?\b/i,"screen"],[/\b(util|helper|lib)s?\b/i,"helper"]],TM=e=>String(e).split(/[\\/]/).filter(Boolean).pop()??String(e),AM=e=>e.replace(/\.[^.]+$/,"").replace(/([a-z])([A-Z])/g,"$1 $2").replace(/[-_.]+/g," ").trim().toLowerCase();function c0(e){let t=String(e).split(/[\\/]/).filter(Boolean),n=t.pop()??"";for(let i of[...t.reverse(),n]){let s=EM.find(([r])=>r.test(i.replace(/([a-z])([A-Z])/g,"$1 $2").replace(/[._-]/g," ")));if(s)return s[1]}return null}function uc(e){let t=String(e??"").replace(/^https?:\/\/\S+/,"");if(!t)return"a file";let n=TM(t);if(/(^|[\\/])readme(\.\w+)?$/i.test(t))return"the readme";if(/changelog/i.test(n))return"the changelog";if(/(^|[\\/])(package(-lock)?\.json|tsconfig[\w.]*\.json|pyproject\.toml|cargo\.toml|go\.mod|requirements\.txt|\.env[\w.]*|[\w.-]*config\.[cm]?[jt]s|\.eslintrc[\w.]*)$/i.test(t))return"the project settings";if(/(^|[\\/])(\.github|ci|\.circleci)[\\/]|\.ya?ml$|dockerfile/i.test(t))return"the build setup";if(/\.(test|spec)\.\w+$|(^|[\\/])(__tests__|tests?)[\\/]/i.test(t)){let r=c0(t);return r?`the ${r} tests`:"the tests"}if(/\.(md|mdx|rst|txt)$/i.test(n)||/(^|[\\/])docs?[\\/]/i.test(t))return"the docs";if(/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(n))return"a picture";if(/\.(css|scss|sass|less)$/i.test(n))return"the styling";if(/\.(json|csv|tsv|xml)$/i.test(n))return"some data";if(/\.(sh|bash|zsh|ps1)$/i.test(n))return"a script";if(/\.ipynb$/i.test(n))return"a notebook";let i=c0(t);if(i)return`the ${i} code`;let s=AM(n);return s?`the ${s} code`:"a file"}function RM(e){let t=String(e??"");return/test|spec/i.test(t)?"test files":/\.(md|mdx|rst|txt)\b/i.test(t)?"docs":/\.(png|jpe?g|gif|svg|webp)\b/i.test(t)?"pictures":/\.(css|scss|less)\b/i.test(t)?"stylesheets":/\.(json|ya?ml|toml)\b/i.test(t)||/config/i.test(t)?"settings files":/\.\w+\b/.test(t)?"code files":"files"}var u0=(e,t=28)=>{let n=String(e).replace(/\s+/g," ").trim();return`\u201C${n.length>t?`${n.slice(0,t-1)}\u2026`:n}\u201D`},CM=e=>/^[\w .:'-]{2,40}$/.test(e),IM=[[/\b(npm|pnpm|yarn|bun)\s+(run\s+)?test\b|\b(jest|vitest|mocha|pytest|rspec|phpunit|playwright test)\b|\b(go|cargo|deno|dotnet|mix|swift)\s+test\b|node\s+--test|\bmake\s+test\b|\btox\b/i,["check","the tests"]],[/\b(eslint|prettier|ruff|black|flake8|rubocop|gofmt|clippy|stylelint)\b|\b(npm|pnpm|yarn)\s+(run\s+)?(lint|format|fmt)\b/i,["tidy","the code"]],[/\b(tsc|typecheck|mypy|pyright)\b/i,["check","the types"]],[/\b(npm|pnpm|yarn|bun)\s+(run\s+)?build\b|\b(cargo|go|swift)\s+build\b|\bmake\b|\b(webpack|vite build|esbuild|rollup|gradle|mvn)\b/i,["build","the project"]],[/\b(npm|pnpm|yarn|bun)\s+(ci|install|i|add)\b|\bpip3?\s+install\b|\bbrew\s+install\b|\bapt(-get)?\s+install\b|\bcargo\s+add\b|\bgo\s+get\b|\bbundle\s+install\b/i,["install","what the project needs"]],[/\b(npm|pnpm|yarn)\s+(run\s+)?(dev|start|serve)\b|\b(serve|http-server|uvicorn|flask run|rails s)\b/i,["start","the app"]],[/\bgit\s+(diff|status|show)\b/i,["look","over the changes"]],[/\bgit\s+(log|blame|reflog)\b/i,["look","back through the history"]],[/\bgit\s+commit\b/i,["save","a checkpoint"]],[/\bgit\s+push\b/i,["send","the changes up"]],[/\bgit\s+(pull|fetch|clone)\b/i,["fetch","the latest code"]],[/\bgit\s+(checkout|switch|branch)\b/i,["switch","branches"]],[/\bgit\s+(add|stash|restore|reset|rebase|merge|cherry-pick)\b/i,["tidy","up the changes"]],[/\bgh\s+pr\b/i,["update","the pull request"]],[/\bgh\s+(issue|run|api)\b/i,["check","GitHub"]],[/\b(docker|podman|kubectl)\b/i,["run","the containers"]],[/\b(curl|wget|http)\b/i,["fetch","a web page"]],[/^\s*(rm|rmdir)\b/i,["clean","up some files"]],[/^\s*(mkdir|touch)\b/i,["make","a new folder"]],[/^\s*(mv|cp)\b/i,["move","some files"]],[/^\s*(ls|find|tree|du|pwd)\b/i,["look","around the files"]],[/^\s*(cat|head|tail|less|wc|grep|rg|sed -n)\b/i,["read","some files"]],[/^\s*(sleep|wait)\b/i,["wait","a moment"]],[/^\s*(node|python3?|ruby|deno|bun|tsx|ts-node|bash|sh)\s+\S/i,["run","a script"]]];function PM(e){let t=String(e??"").trim(),n=t.split(/\s*(?:&&|\|\||;|\|)\s*/).filter(i=>i&&!/^(cd|export|set|source|\.)\b/.test(i));for(let i of n.length?n:[t]){let s=IM.find(([r])=>r.test(i));if(s)return Se(...s[1])}return Se("run","a command")}var h0={github:"GitHub",gitlab:"GitLab",slack:"Slack",linear:"Linear",notion:"Notion",jira:"Jira",atlassian:"Atlassian",figma:"Figma",gmail:"Gmail",google_drive:"Google Drive",sentry:"Sentry",stripe:"Stripe",asana:"Asana",datadog:"Datadog",postgres:"the database",playwright:"the browser",claude_in_chrome:"the browser"};function kM(e){let t=String(e??"").replace(/^plugin_\w+?_/,"").toLowerCase();if(h0[t])return h0[t];let n=t.replace(/[-_]+/g," ").trim();return n?n.replace(/\b\w/g,i=>i.toUpperCase()):"an app"}function LM(e){let[,t="",n=""]=String(e).split("__"),i=kM(t),[s,...r]=n.split(/[_-]+/).filter(Boolean),a=r.join(" ").replace(/\bprs?\b/i,"pull requests").trim(),o=a?`${a} on ${i}`:i;switch((s??"").toLowerCase()){case"list":case"get":case"read":case"search":case"find":case"query":case"fetch":case"view":return Se("look",`at ${o}`);case"create":case"add":case"open":case"new":return Se("create",a?`${/^[aeiou]/i.test(a)?"an":"a"} ${a.replace(/s$/,"")} on ${i}`:`something on ${i}`);case"update":case"edit":case"set":case"patch":case"merge":return Se("update",o);case"delete":case"remove":case"close":case"trash":return Se("remove",o);case"send":case"post":case"reply":case"comment":return Se("send",a?`a ${a.replace(/s$/,"")} on ${i}`:`a message on ${i}`);default:return Se("use",i)}}function $s(e,t){let n=String(e??""),i=t==null?"":String(t);if(n.startsWith("mcp__"))return LM(n);switch(n){case"Read":case"NotebookRead":return Se("read",uc(i));case"Edit":case"MultiEdit":case"NotebookEdit":return Se("change",uc(i));case"Write":return Se("write",uc(i));case"Grep":return i&&CM(i)?Se("search",`the code for ${u0(i)}`):Se("search","through the code");case"Glob":return Se("look",`for ${RM(i)}`);case"LS":return Se("look","around the files");case"WebFetch":{let s=/^https?:\/\/(?:www\.)?([^/\s]+)/i.exec(i)?.[1];return Se("read",s?`a page on ${s}`:"a web page")}case"WebSearch":return Se("search",i?`the web for ${u0(i)}`:"the web");case"Bash":case"PowerShell":return PM(i);case"BashOutput":return Se("check","on a running command");case"KillShell":case"KillBash":return Se("remove","a running command");case"Task":case"Agent":return Se("hand","work to a helper");case"TodoWrite":case"TaskCreate":case"TaskUpdate":return Se("update","its checklist");case"AskUserQuestion":return Se("ask","you something");case"ExitPlanMode":return Se("share","a plan");case"Skill":return Se("use",i?`the ${i} skill`:"a skill");case"SendMessage":return Se("send","a message");case"":return Se("use","a tool");default:return Se("use",n.replace(/([a-z])([A-Z])/g,"$1 $2").toLowerCase())}}var ff=(e,t,n=`${t}s`)=>`${e===1?"a":e} ${e===1?t:n}`,DM=e=>e.length<2?e.join(""):`${e.slice(0,-1).join(", ")} and ${e.at(-1)}`;function pf(e){if(!e.length)return"";if(e.length===1){let u=$s(e[0].tool,e[0].summary);return e[0].ok===!1?u.fail:e[0].ok===void 0?u.now:u.done}let t=new Set,n=new Set,i=new Set,s=0,r=0,a=0,o=[];for(let u of e){let h=u.summary??"";switch(u.tool){case"Read":case"NotebookRead":t.add(h);break;case"Edit":case"MultiEdit":case"NotebookEdit":n.add(h);break;case"Write":i.add(h);break;case"Grep":case"Glob":case"LS":s++;break;case"WebFetch":case"WebSearch":r++;break;case"Task":case"Agent":a++;break;case"Bash":case"PowerShell":{let f=$s(u.tool,h).done,p=(f.charAt(0).toLowerCase()+f.slice(1)).replace(/^checked the tests$/,"ran the tests");o.includes(p)||o.push(p);break}default:{let f=$s(u.tool,h).done,p=f.charAt(0).toLowerCase()+f.slice(1);o.includes(p)||o.push(p)}}}let c=[];t.size&&c.push(t.size===1?`read ${uc([...t][0])}`:`looked through ${t.size} files`),s&&c.push(s===1?"searched the code":s===2?"searched the code twice":`searched the code ${s} times`),n.size&&c.push(`changed ${ff(n.size,"file")}`),i.size&&c.push(`wrote ${ff(i.size,"new file")}`),r&&c.push(`read ${ff(r,"web page")}`),a&&c.push(a===1?"brought in a helper":`brought in ${a} helpers`),o.length<=3?c.push(...o):c.push(`ran ${o.length} commands`);let l=DM(c.slice(0,4))+(c.length>4?" and more":"");return l.charAt(0).toUpperCase()+l.slice(1)}var wr=["Mika","Juno","Ravi","Aiko","Nia","Theo","Lena","Omar","Priya","Kofi","Sana","Milo","Ines","Tariq","Yuki","Ada","Bruno","Cleo","Dev","Elif","Femi","Gia","Hana","Ivo","Jada","Kai","Lumi","Mateo","Noor","Olu","Pia","Quinn","Rumi","Sol","Tavi","Uma","Wren","Yara","Zuri","Arlo","Bea","Chidi","Dara","Esme","Fern","Ilan","Kenji","Lila","Mira","Nico","Remy","Suki","Tomas","Ama","Bodhi","Rafa","Anouk","Leif","Maya","Oren","Tala","Vera","Ezra","Luca"],NM={session:"Lead",Explore:"Researcher",Plan:"Planner","code-reviewer":"Reviewer","test-runner":"Tester","general-purpose":"Builder"};function d0(e){let t=2166136261;for(let n of String(e??""))t^=n.charCodeAt(0),t=Math.imul(t,16777619)>>>0;return t}var f0=e=>wr[d0(e)%wr.length],UM=e=>NM[e]??(e?"Helper":"Lead"),mf=new Map;function OM(e,t){mf.has(e)||mf.set(e,new Map);let n=mf.get(e);if(n.has(t))return n.get(t);let i=new Set([f0(e),...n.values()]),s=d0(`${e}|${t}`)%wr.length,r=wr[s];for(let a=1;a<wr.length&&i.has(r);a++)r=wr[(s+a)%wr.length];return n.set(t,r),r}function on(e){if(!e)return{name:"",role:"",title:""};if(e.kind==="session"){let i=f0(e.session);return{name:i,role:"Lead",title:`${i} the Lead`}}let t=UM(e.type),n=e.name||OM(e.session,e.agent);return{name:n,role:t,title:`${n} the ${t}`}}var FM=30,BM=40,Nn=[],Un=new Map,yf=null;function xf(){Nn.length=0,pc.clear(),Un.clear(),yf=null}function P(e){return String(e??"").replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t])}var xe=e=>`\u201C${e}\u201D`,HM=e=>String(e).split(/[\\/]/).filter(Boolean).pop()??e,zM=[{test:e=>["Read","NotebookRead"].includes(e),done:"read",try:"read",bead:"sky",file:"read"},{test:e=>["Edit","MultiEdit","Write","NotebookEdit"].includes(e),done:"edited",try:"edit",bead:"coral",file:"edit"},{test:e=>["Grep","Glob","LS"].includes(e),done:"searched for",try:"search for",bead:"leaf"},{test:e=>["WebFetch","WebSearch"].includes(e),done:"looked up",try:"look up",bead:"lilac"},{test:e=>["Bash","BashOutput","PowerShell"].includes(e),done:"ran",try:"run",bead:"mustard"},{test:e=>["Task","Agent"].includes(e),done:"handed off",try:"hand off",bead:"teal"},{test:e=>e==="TodoWrite",done:"updated its todo list",try:"update its todo list",bead:"line",bare:!0},{test:e=>e.startsWith("mcp__"),mcp:!0,bead:"lilac"}];function mc(e){return zM.find(t=>t.test(e??""))??{done:"used",try:"use",bead:"line",other:!0}}var _f=e=>mc(e).bead;function $M(e,t,n){let i=mc(e);if(i.mcp){let[,a,o]=e.split("__");return`${n?"used":"couldn\u2019t use"} ${a}\u2019s ${o??"tool"}`}if(i.bare)return n?i.done:`couldn\u2019t ${i.try}`;let s=i.file&&t?HM(t):t??(i.other?e:""),r=i.other?`${e}${t?` on ${t}`:""}`:s;return`${n?i.done:`couldn\u2019t ${i.try}`} ${r}`.trim()}var bn=e=>F.get(Ct(e))?.label??"A session",hc=e=>e.agent?F.get(Ne(e.session,e.agent))?.label??"A subagent":"The session",dc=e=>{let t=e.agent&&F.get(Ne(e.session,e.agent));return t?on(t).name:e.agent?"A helper":"The session"};function wn(e,t,n="",i=Ct(e.session),s,r){let a={t:e.t,text:t,tone:n,target:i,...s&&{raw:s},...r};return Nn.unshift(a),Nn.length>BM&&Nn.pop(),a}var fc=e=>Nn.find(t=>t.key===e);function VM(e,t){Nn.splice(Nn.indexOf(e),1),Nn.unshift(e),e.t=t}var pc=new Map,gf=(e,t)=>{let n=String(e).replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1).replace(/\s+\S*$/,"")}\u2026`:n},p0={image:"a picture",artifact:"a page",pr:"a pull request",link:"a link"};function GM(e,t,n){let i=`bumps:${e.session}:${pc.get(e.session)??0}`,s=fc(i);s?VM(s,e.t):s=wn(e,"","bumps",Ct(e.session),void 0,{key:i,bumps:[]}),s.bumps.unshift({t:e.t,text:t.plain,raw:n}),s.bumps.length>12&&s.bumps.pop();let r=s.bumps.length;s.text=`${r===1?"A bump":`${r} bumps`} along the way in ${xe(bn(e.session))}`}function WM(e){let t=Ct(e.session),n=Un.get(t);return n||Un.set(t,n={actions:[],files:new Map}),n}var ro=new Map,m0=e=>e.charAt(0).toLowerCase()+e.slice(1);function qM(e,t,n){let i=$s(t,n),s=e.ok?i.done:i.fail;return e.agent?`${dc(e)} ${m0(s)}`:s}var oo=e=>qe()?e.text:e.plain??e.text;function ba(e){for(let t of F.values())if(!(t.kind!=="tool"||t.status!=="active"||t.owner!==e))return qe()?`${t.tool}${t.summary?` ${t.summary}`:""}`:$s(t.tool,t.summary).now;return null}function gc(e){switch(e.kind){case"tool.start":{ro.set(`${e.session}:${e.id}`,{tool:e.tool,summary:e.summary}),ro.size>500&&ro.delete(ro.keys().next().value);break}case"tool.end":{let t=`${e.session}:${e.id}`,n=ro.get(t)??{tool:e.tool};ro.delete(t);let i=n.tool??e.tool,s=`${hc(e)} ${$M(i,n.summary,e.ok)}`,r=WM(e);r.actions.unshift({t:e.t,text:s,plain:qM(e,i,n.summary),ok:e.ok,tool:i,summary:n.summary,agent:e.agent}),r.actions.length>FM&&r.actions.pop();let a=mc(n.tool??e.tool);if(a.file&&n.summary){let o=r.files.get(n.summary)??{reads:0,edits:0,t:0};a.file==="edit"?o.edits++:o.reads++,o.t=e.t,r.files.set(n.summary,o)}yf={session:Ct(e.session),text:s,plain:r.actions[0].plain},e.ok||GM(e,r.actions[0],s);break}case"agent.spawn":wn(e,`${xe(bn(e.session))} brought in ${on({kind:"agent",session:e.session,agent:e.agent,type:e.type,name:e.name}).title}${e.description?` to ${m0(e.description)}`:""}.`,"quiet",Ne(e.session,e.agent),`${xe(bn(e.session))} started ${/^[aeiou]/i.test(e.type??"")?"an":"a"} ${e.name||e.type} subagent${e.description?`: ${e.description}`:""}.`);break;case"agent.end":{let t=F.get(Ne(e.session,e.agent));if(t){let n=t.endStatus==="failed"||t.endStatus==="killed",i=s=>n?`${s} stopped before finishing its work for ${xe(bn(e.session))}.`:`${s} finished its work for ${xe(bn(e.session))}.`;wn(e,i(on(t).title),"quiet",void 0,i(t.label))}break}case"agent.message":{let t=ci[0];if(!t||t.t!==e.t||t.session!==e.session)break;let n=t.fromName==="Lead"?"The lead":t.fromName??"Someone",i=t.toName==="Lead"?xe(bn(e.session)):t.toName??"someone";wn(e,`${n} \u2192 ${i}${t.text?`: ${t.text}`:""}`,"mail",t.to??t.from??Ct(e.session));break}case"session.thread":{let t=F.get(Ct(e.session));t&&!t.threadAnnounced&&(t.threadAnnounced=!0,wn(e,`${xe(bn(e.session))} is working as a thread of a claude.ai project.`,"mail"));break}case"context.compact":wn(e,`${e.agent?dc(e):xe(bn(e.session))} tidied up its memory and has room again.`,"quiet",void 0,`${e.agent?hc(e):xe(bn(e.session))} compacted its context and has room again.`);break;case"session.start":wn(e,`A session started in ${e.project?fn(e.project.id,e.project.name):"a new folder"}.`,"quiet");break;case"session.end":wn(e,`${xe(bn(e.session))} ended.`,"quiet");break;case"turn.start":{if(e.agent)break;pc.set(e.session,(pc.get(e.session)??0)+1);let t=fc(`stuck:${e.session}`);t&&(t.tone="cleared",t.key=void 0);break}case"turn.complete":{if(e.agent)break;let t=xe(bn(e.session));e.reason==="answer"||!e.reason?wn(e,`${t} finished${e.answer?`: ${gf(e.answer,110)}`:"."}`,"done"):e.reason==="aborted"?wn(e,`You stopped ${t}.`,"quiet"):wn(e,`${t} stopped on ${e.reason==="refusal"?"a refusal":"an error"} and needs a look.`,"block",void 0,void 0,{key:`stuck:${e.session}`});break}case"asset.add":{if(!p0[e.type])break;let t=`made:${e.session}:${e.id}`;if(fc(t))break;let n=i=>`${i} made ${p0[e.type]}${e.title?`: ${gf(e.title,70)}`:"."}`;wn(e,n(e.agent?dc(e):xe(bn(e.session))),"made",e.agent?Ne(e.session,e.agent):Ct(e.session),e.agent?n(hc(e)):void 0,{key:t});break}case"ask.open":{let t=n=>e.type==="permission"?`${n} is waiting for your OK to go on.`:e.type==="plan"?`${n} has a plan for you to approve.`:`${n} asked you: ${gf(e.questions?.[0]?.question??"a question",90)}`;wn(e,t(e.agent?dc(e):xe(bn(e.session))),"block",e.agent?Ne(e.session,e.agent):Ct(e.session),e.agent?t(hc(e)):void 0,{key:`ask:${e.session}:${e.id}`,ask:!0});break}case"ask.close":{let t=fc(`ask:${e.session}:${e.id}`);if(!t)break;t.tone="ask",t.key=void 0,e.answer&&(t.answer=String(e.answer));break}case"chat.sent":wn(e,`You messaged ${e.agent?F.get(Ne(e.session,e.agent))?.label??"a subagent":xe(bn(e.session))}.`,"quiet",e.agent?Ne(e.session,e.agent):Ct(e.session));break;case"stop.sent":wn(e,`You asked ${xe(bn(e.session))} to stop.`,"note",Ct(e.session));break;case"chat.delivered":e.ok===!1&&wn(e,`Your message to ${e.agent?F.get(Ne(e.session,e.agent))?.label??"a subagent":xe(bn(e.session))} couldn't be delivered${e.how?`: ${e.how}`:""}.`,"bad",e.agent?Ne(e.session,e.agent):Ct(e.session));break}}var yc=e=>qe()&&e.raw?e.raw:e.text;function Ae(e,t=Date.now()){if(!e)return"";let n=Math.max(0,Math.round((t-e)/1e3));return n<5?"just now":n<60?`${n}s ago`:n<3600?`${Math.round(n/60)}m ago`:n<86400?`${Math.round(n/3600)}h ago`:`${Math.round(n/86400)}d ago`}var id={};qd(id,{animate:()=>Nm,capture:()=>Hm,critterAt:()=>Bm,debug:()=>JC,focusOn:()=>td,focusProject:()=>nd,landmarks:()=>Fm,level:()=>ks,mount:()=>Am,pct:()=>Ls,pulse:()=>Dm,roomKey:()=>yl,sessionTint:()=>Ds,setHover:()=>ed,setInsets:()=>Qh,setPower:()=>Um,setSelected:()=>Om,sync:()=>Lm,tintOf:()=>lr});var mi={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Pi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},z0=0,Jf=1,$0=2;var Qf=1,lu=2,ns=3,vs=0,mn=1,Gn=2,ws=0,Rr=1,tp=2,ep=3,np=4,V0=5,Zs=100,G0=101,W0=102,q0=103,X0=104,j0=200,Y0=201,K0=202,Z0=203,Bc=204,Hc=205,J0=206,Q0=207,ty=208,ey=209,ny=210,iy=211,sy=212,ry=213,oy=214,cu=0,uu=1,hu=2,Cr=3,du=4,fu=5,pu=6,mu=7,gu=0,ay=1,ly=2,Ms=0,cy=1,uy=2,hy=3,dy=4,fy=5,py=6,my=7;var ip=300,Dr=301,Nr=302,yu=303,xu=304,nl=306,Mo=1e3,Ks=1001,zc=1002,$n=1003,gy=1004;var il=1005;var Ci=1006,_u=1007;var er=1008;var ki=1009,sp=1010,rp=1011,Uo=1012,vu=1013,nr=1014,Li=1015,Oo=1016,bu=1017,wu=1018,Fo=1020,op=35902,ap=35899,lp=1021,cp=1022,gi=1023,So=1026,Bo=1027,Mu=1028,Su=1029,up=1030,Eu=1031;var Tu=1033,sl=33776,rl=33777,ol=33778,al=33779,Au=35840,Ru=35841,Cu=35842,Iu=35843,Pu=36196,ku=37492,Lu=37496,Du=37808,Nu=37809,Uu=37810,Ou=37811,Fu=37812,Bu=37813,Hu=37814,zu=37815,$u=37816,Vu=37817,Gu=37818,Wu=37819,qu=37820,Xu=37821,ju=36492,Yu=36494,Ku=36495,Zu=36283,Ju=36284,Qu=36285,th=36286;var Pa=2300,$c=2301,Fc=2302,Vf=2400,Gf=2401,Wf=2402;var yy=3200,xy=3201;var eh=0,_y=1,Di="",Ve="srgb",Ir="srgb-linear",ka="linear",fe="srgb";var Ar=7680;var qf=519,vy=512,by=513,wy=514,hp=515,My=516,Sy=517,Ey=518,Ty=519,Xf=35044;var dp="300 es",Ri=2e3,La=2001;var Ji=class{addEventListener(t,n){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(n)===-1&&i[t].push(n)}hasEventListener(t,n){let i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(n)!==-1}removeEventListener(t,n){let i=this._listeners;if(i===void 0)return;let s=i[t];if(s!==void 0){let r=s.indexOf(n);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let n=this._listeners;if(n===void 0)return;let i=n[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},Mn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],g0=1234567,Ca=Math.PI/180,Eo=180/Math.PI;function Ho(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Mn[e&255]+Mn[e>>8&255]+Mn[e>>16&255]+Mn[e>>24&255]+"-"+Mn[t&255]+Mn[t>>8&255]+"-"+Mn[t>>16&15|64]+Mn[t>>24&255]+"-"+Mn[n&63|128]+Mn[n>>8&255]+"-"+Mn[n>>16&255]+Mn[n>>24&255]+Mn[i&255]+Mn[i>>8&255]+Mn[i>>16&255]+Mn[i>>24&255]).toLowerCase()}function Yt(e,t,n){return Math.max(t,Math.min(n,e))}function fp(e,t){return(e%t+t)%t}function XM(e,t,n,i,s){return i+(e-t)*(s-i)/(n-t)}function jM(e,t,n){return e!==t?(n-e)/(t-e):0}function Ia(e,t,n){return(1-n)*e+n*t}function YM(e,t,n,i){return Ia(e,t,1-Math.exp(-n*i))}function KM(e,t=1){return t-Math.abs(fp(e,t*2)-t)}function ZM(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function JM(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function QM(e,t){return e+Math.floor(Math.random()*(t-e+1))}function tS(e,t){return e+Math.random()*(t-e)}function eS(e){return e*(.5-Math.random())}function nS(e){e!==void 0&&(g0=e);let t=g0+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function iS(e){return e*Ca}function sS(e){return e*Eo}function rS(e){return(e&e-1)===0&&e!==0}function oS(e){return Math.pow(2,Math.ceil(Math.log(e)/Math.LN2))}function aS(e){return Math.pow(2,Math.floor(Math.log(e)/Math.LN2))}function lS(e,t,n,i,s){let r=Math.cos,a=Math.sin,o=r(n/2),c=a(n/2),l=r((t+i)/2),u=a((t+i)/2),h=r((t-i)/2),f=a((t-i)/2),p=r((i-t)/2),m=a((i-t)/2);switch(s){case"XYX":e.set(o*u,c*h,c*f,o*l);break;case"YZY":e.set(c*f,o*u,c*h,o*l);break;case"ZXZ":e.set(c*h,c*f,o*u,o*l);break;case"XZX":e.set(o*u,c*m,c*p,o*l);break;case"YXY":e.set(c*p,o*u,c*m,o*l);break;case"ZYZ":e.set(c*m,c*p,o*u,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function bo(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw new Error("Invalid component type.")}}function On(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw new Error("Invalid component type.")}}var Ss={DEG2RAD:Ca,RAD2DEG:Eo,generateUUID:Ho,clamp:Yt,euclideanModulo:fp,mapLinear:XM,inverseLerp:jM,lerp:Ia,damp:YM,pingpong:KM,smoothstep:ZM,smootherstep:JM,randInt:QM,randFloat:tS,randFloatSpread:eS,seededRandom:nS,degToRad:iS,radToDeg:sS,isPowerOfTwo:rS,ceilPowerOfTwo:oS,floorPowerOfTwo:aS,setQuaternionFromProperEuler:lS,normalize:On,denormalize:bo},At=class e{constructor(t=0,n=0){e.prototype.isVector2=!0,this.x=t,this.y=n}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,n){return this.x=t,this.y=n,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let n=this.x,i=this.y,s=t.elements;return this.x=s[0]*n+s[3]*i+s[6],this.y=s[1]*n+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,n){return this.x=Yt(this.x,t.x,n.x),this.y=Yt(this.y,t.y,n.y),this}clampScalar(t,n){return this.x=Yt(this.x,t,n),this.y=Yt(this.y,t,n),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Yt(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let n=Math.sqrt(this.lengthSq()*t.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(t)/n;return Math.acos(Yt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let n=this.x-t.x,i=this.y-t.y;return n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this}rotateAround(t,n){let i=Math.cos(n),s=Math.sin(n),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*s+t.x,this.y=r*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},fi=class{constructor(t=0,n=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=n,this._z=i,this._w=s}static slerpFlat(t,n,i,s,r,a,o){let c=i[s+0],l=i[s+1],u=i[s+2],h=i[s+3],f=r[a+0],p=r[a+1],m=r[a+2],y=r[a+3];if(o===0){t[n+0]=c,t[n+1]=l,t[n+2]=u,t[n+3]=h;return}if(o===1){t[n+0]=f,t[n+1]=p,t[n+2]=m,t[n+3]=y;return}if(h!==y||c!==f||l!==p||u!==m){let g=1-o,d=c*f+l*p+u*m+h*y,_=d>=0?1:-1,w=1-d*d;if(w>Number.EPSILON){let A=Math.sqrt(w),S=Math.atan2(A,d*_);g=Math.sin(g*S)/A,o=Math.sin(o*S)/A}let b=o*_;if(c=c*g+f*b,l=l*g+p*b,u=u*g+m*b,h=h*g+y*b,g===1-o){let A=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=A,l*=A,u*=A,h*=A}}t[n]=c,t[n+1]=l,t[n+2]=u,t[n+3]=h}static multiplyQuaternionsFlat(t,n,i,s,r,a){let o=i[s],c=i[s+1],l=i[s+2],u=i[s+3],h=r[a],f=r[a+1],p=r[a+2],m=r[a+3];return t[n]=o*m+u*h+c*p-l*f,t[n+1]=c*m+u*f+l*h-o*p,t[n+2]=l*m+u*p+o*f-c*h,t[n+3]=u*m-o*h-c*f-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,n,i,s){return this._x=t,this._y=n,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,n=!0){let i=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(i/2),u=o(s/2),h=o(r/2),f=c(i/2),p=c(s/2),m=c(r/2);switch(a){case"XYZ":this._x=f*u*h+l*p*m,this._y=l*p*h-f*u*m,this._z=l*u*m+f*p*h,this._w=l*u*h-f*p*m;break;case"YXZ":this._x=f*u*h+l*p*m,this._y=l*p*h-f*u*m,this._z=l*u*m-f*p*h,this._w=l*u*h+f*p*m;break;case"ZXY":this._x=f*u*h-l*p*m,this._y=l*p*h+f*u*m,this._z=l*u*m+f*p*h,this._w=l*u*h-f*p*m;break;case"ZYX":this._x=f*u*h-l*p*m,this._y=l*p*h+f*u*m,this._z=l*u*m-f*p*h,this._w=l*u*h+f*p*m;break;case"YZX":this._x=f*u*h+l*p*m,this._y=l*p*h+f*u*m,this._z=l*u*m-f*p*h,this._w=l*u*h-f*p*m;break;case"XZY":this._x=f*u*h-l*p*m,this._y=l*p*h-f*u*m,this._z=l*u*m+f*p*h,this._w=l*u*h+f*p*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,n){let i=n/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let n=t.elements,i=n[0],s=n[4],r=n[8],a=n[1],o=n[5],c=n[9],l=n[2],u=n[6],h=n[10],f=i+o+h;if(f>0){let p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(u-c)*p,this._y=(r-l)*p,this._z=(a-s)*p}else if(i>o&&i>h){let p=2*Math.sqrt(1+i-o-h);this._w=(u-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+l)/p}else if(o>h){let p=2*Math.sqrt(1+o-i-h);this._w=(r-l)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+u)/p}else{let p=2*Math.sqrt(1+h-i-o);this._w=(a-s)/p,this._x=(r+l)/p,this._y=(c+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,n){let i=t.dot(n)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*n.z-t.z*n.y,this._y=t.z*n.x-t.x*n.z,this._z=t.x*n.y-t.y*n.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Yt(this.dot(t),-1,1)))}rotateTowards(t,n){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,n/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,n){let i=t._x,s=t._y,r=t._z,a=t._w,o=n._x,c=n._y,l=n._z,u=n._w;return this._x=i*u+a*o+s*l-r*c,this._y=s*u+a*c+r*o-i*l,this._z=r*u+a*l+i*c-s*o,this._w=a*u-i*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,n){if(n===0)return this;if(n===1)return this.copy(t);let i=this._x,s=this._y,r=this._z,a=this._w,o=a*t._w+i*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;let c=1-o*o;if(c<=Number.EPSILON){let p=1-n;return this._w=p*a+n*this._w,this._x=p*i+n*this._x,this._y=p*s+n*this._y,this._z=p*r+n*this._z,this.normalize(),this}let l=Math.sqrt(c),u=Math.atan2(l,o),h=Math.sin((1-n)*u)/l,f=Math.sin(n*u)/l;return this._w=a*h+this._w*f,this._x=i*h+this._x*f,this._y=s*h+this._y*f,this._z=r*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,n,i){return this.copy(t).slerp(n,i)}random(){let t=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(n),r*Math.cos(n))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,n=0){return this._x=t[n],this._y=t[n+1],this._z=t[n+2],this._w=t[n+3],this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._w,t}fromBufferAttribute(t,n){return this._x=t.getX(n),this._y=t.getY(n),this._z=t.getZ(n),this._w=t.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},L=class e{constructor(t=0,n=0,i=0){e.prototype.isVector3=!0,this.x=t,this.y=n,this.z=i}set(t,n,i){return i===void 0&&(i=this.z),this.x=t,this.y=n,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,n){return this.x=t.x*n.x,this.y=t.y*n.y,this.z=t.z*n.z,this}applyEuler(t){return this.applyQuaternion(y0.setFromEuler(t))}applyAxisAngle(t,n){return this.applyQuaternion(y0.setFromAxisAngle(t,n))}applyMatrix3(t){let n=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*n+r[3]*i+r[6]*s,this.y=r[1]*n+r[4]*i+r[7]*s,this.z=r[2]*n+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let n=this.x,i=this.y,s=this.z,r=t.elements,a=1/(r[3]*n+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*n+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*n+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*n+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(t){let n=this.x,i=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*i),u=2*(o*n-r*s),h=2*(r*i-a*n);return this.x=n+c*l+a*h-o*u,this.y=i+c*u+o*l-r*h,this.z=s+c*h+r*u-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let n=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*n+r[4]*i+r[8]*s,this.y=r[1]*n+r[5]*i+r[9]*s,this.z=r[2]*n+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,n){return this.x=Yt(this.x,t.x,n.x),this.y=Yt(this.y,t.y,n.y),this.z=Yt(this.z,t.z,n.z),this}clampScalar(t,n){return this.x=Yt(this.x,t,n),this.y=Yt(this.y,t,n),this.z=Yt(this.z,t,n),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Yt(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,n){let i=t.x,s=t.y,r=t.z,a=n.x,o=n.y,c=n.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(t){let n=t.lengthSq();if(n===0)return this.set(0,0,0);let i=t.dot(this)/n;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return vf.copy(this).projectOnVector(t),this.sub(vf)}reflect(t){return this.sub(vf.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let n=Math.sqrt(this.lengthSq()*t.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(t)/n;return Math.acos(Yt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let n=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return n*n+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,n,i){let s=Math.sin(n)*t;return this.x=s*Math.sin(i),this.y=Math.cos(n)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,n,i){return this.x=t*Math.sin(n),this.y=i,this.z=t*Math.cos(n),this}setFromMatrixPosition(t){let n=t.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(t){let n=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=n,this.y=i,this.z=s,this}setFromMatrixColumn(t,n){return this.fromArray(t.elements,n*4)}setFromMatrix3Column(t,n){return this.fromArray(t.elements,n*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this.z=t[n+2],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t[n+2]=this.z,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this.z=t.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(t),this.y=n,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},vf=new L,y0=new fi,$t=class e{constructor(t,n,i,s,r,a,o,c,l){e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,n,i,s,r,a,o,c,l)}set(t,n,i,s,r,a,o,c,l){let u=this.elements;return u[0]=t,u[1]=s,u[2]=o,u[3]=n,u[4]=r,u[5]=c,u[6]=i,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let n=this.elements,i=t.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(t,n,i){return t.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let n=t.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,n){let i=t.elements,s=n.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],u=i[4],h=i[7],f=i[2],p=i[5],m=i[8],y=s[0],g=s[3],d=s[6],_=s[1],w=s[4],b=s[7],A=s[2],S=s[5],T=s[8];return r[0]=a*y+o*_+c*A,r[3]=a*g+o*w+c*S,r[6]=a*d+o*b+c*T,r[1]=l*y+u*_+h*A,r[4]=l*g+u*w+h*S,r[7]=l*d+u*b+h*T,r[2]=f*y+p*_+m*A,r[5]=f*g+p*w+m*S,r[8]=f*d+p*b+m*T,this}multiplyScalar(t){let n=this.elements;return n[0]*=t,n[3]*=t,n[6]*=t,n[1]*=t,n[4]*=t,n[7]*=t,n[2]*=t,n[5]*=t,n[8]*=t,this}determinant(){let t=this.elements,n=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8];return n*a*u-n*o*l-i*r*u+i*o*c+s*r*l-s*a*c}invert(){let t=this.elements,n=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8],h=u*a-o*l,f=o*c-u*r,p=l*r-a*c,m=n*h+i*f+s*p;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/m;return t[0]=h*y,t[1]=(s*l-u*i)*y,t[2]=(o*i-s*a)*y,t[3]=f*y,t[4]=(u*n-s*c)*y,t[5]=(s*r-o*n)*y,t[6]=p*y,t[7]=(i*c-l*n)*y,t[8]=(a*n-i*r)*y,this}transpose(){let t,n=this.elements;return t=n[1],n[1]=n[3],n[3]=t,t=n[2],n[2]=n[6],n[6]=t,t=n[5],n[5]=n[7],n[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let n=this.elements;return t[0]=n[0],t[1]=n[3],t[2]=n[6],t[3]=n[1],t[4]=n[4],t[5]=n[7],t[6]=n[2],t[7]=n[5],t[8]=n[8],this}setUvTransform(t,n,i,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+n,0,0,1),this}scale(t,n){return this.premultiply(bf.makeScale(t,n)),this}rotate(t){return this.premultiply(bf.makeRotation(-t)),this}translate(t,n){return this.premultiply(bf.makeTranslation(t,n)),this}makeTranslation(t,n){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,n,0,0,1),this}makeRotation(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(t,n){return this.set(t,0,0,0,n,0,0,0,1),this}equals(t){let n=this.elements,i=t.elements;for(let s=0;s<9;s++)if(n[s]!==i[s])return!1;return!0}fromArray(t,n=0){for(let i=0;i<9;i++)this.elements[i]=t[i+n];return this}toArray(t=[],n=0){let i=this.elements;return t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=i[3],t[n+4]=i[4],t[n+5]=i[5],t[n+6]=i[6],t[n+7]=i[7],t[n+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},bf=new $t;function pp(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Da(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function Ay(){let e=Da("canvas");return e.style.display="block",e}var x0={};function To(e){e in x0||(x0[e]=!0,console.warn(e))}function Ry(e,t,n){return new Promise(function(i,s){function r(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:s();break;case e.TIMEOUT_EXPIRED:setTimeout(r,n);break;default:i()}}setTimeout(r,n)})}var _0=new $t().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),v0=new $t().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function cS(){let e={enabled:!0,workingColorSpace:Ir,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===fe&&(s.r=_s(s.r),s.g=_s(s.g),s.b=_s(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===fe&&(s.r=wo(s.r),s.g=wo(s.g),s.b=wo(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Di?ka:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return To("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),e.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return To("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),e.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return e.define({[Ir]:{primaries:t,whitePoint:i,transfer:ka,toXYZ:_0,fromXYZ:v0,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Ve},outputColorSpaceConfig:{drawingBufferColorSpace:Ve}},[Ve]:{primaries:t,whitePoint:i,transfer:fe,toXYZ:_0,fromXYZ:v0,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Ve}}}),e}var ne=cS();function _s(e){return e<.04045?e*.0773993808:Math.pow(e*.9478672986+.0521327014,2.4)}function wo(e){return e<.0031308?e*12.92:1.055*Math.pow(e,.41666)-.055}var ao,Vc=class{static getDataURL(t,n="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{ao===void 0&&(ao=Da("canvas")),ao.width=t.width,ao.height=t.height;let s=ao.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=ao}return i.toDataURL(n)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let n=Da("canvas");n.width=t.width,n.height=t.height;let i=n.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=_s(r[a]/255)*255;return i.putImageData(s,0,0),n}else if(t.data){let n=t.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(_s(n[i]/255)*255):n[i]=_s(n[i]);return{data:n,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},uS=0,Ao=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:uS++}),this.uuid=Ho(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?t.set(n.videoWidth,n.videoHeight,0):n instanceof VideoFrame?t.set(n.displayHeight,n.displayWidth,0):n!==null?t.set(n.width,n.height,n.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let n=t===void 0||typeof t=="string";if(!n&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(wf(s[a].image)):r.push(wf(s[a]))}else r=wf(s);i.url=r}return n||(t.images[this.uuid]=i),i}};function wf(e){return typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap?Vc.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var hS=0,Mf=new L,Fn=class e extends Ji{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,i=Ks,s=Ks,r=Ci,a=er,o=gi,c=ki,l=e.DEFAULT_ANISOTROPY,u=Di){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:hS++}),this.uuid=Ho(),this.name="",this.source=new Ao(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new At(0,0),this.repeat=new At(1,1),this.center=new At(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $t,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Mf).x}get height(){return this.source.getSize(Mf).y}get depth(){return this.source.getSize(Mf).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let n in t){let i=t[n];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${n}' has value of undefined.`);continue}let s=this[n];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${n}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[n]=i}}toJSON(t){let n=t===void 0||typeof t=="string";if(!n&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ip)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Mo:t.x=t.x-Math.floor(t.x);break;case Ks:t.x=t.x<0?0:1;break;case zc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Mo:t.y=t.y-Math.floor(t.y);break;case Ks:t.y=t.y<0?0:1;break;case zc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Fn.DEFAULT_IMAGE=null;Fn.DEFAULT_MAPPING=ip;Fn.DEFAULT_ANISOTROPY=1;var de=class e{constructor(t=0,n=0,i=0,s=1){e.prototype.isVector4=!0,this.x=t,this.y=n,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,n,i,s){return this.x=t,this.y=n,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this.w=t.w+n.w,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this.w+=t.w*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this.w=t.w-n.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let n=this.x,i=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*n+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*n+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*n+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*n+a[7]*i+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let n=Math.sqrt(1-t.w*t.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/n,this.y=t.y/n,this.z=t.z/n),this}setAxisAngleFromRotationMatrix(t){let n,i,s,r,c=t.elements,l=c[0],u=c[4],h=c[8],f=c[1],p=c[5],m=c[9],y=c[2],g=c[6],d=c[10];if(Math.abs(u-f)<.01&&Math.abs(h-y)<.01&&Math.abs(m-g)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+y)<.1&&Math.abs(m+g)<.1&&Math.abs(l+p+d-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;let w=(l+1)/2,b=(p+1)/2,A=(d+1)/2,S=(u+f)/4,T=(h+y)/4,I=(m+g)/4;return w>b&&w>A?w<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(w),s=S/i,r=T/i):b>A?b<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),i=S/s,r=I/s):A<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),i=T/r,s=I/r),this.set(i,s,r,n),this}let _=Math.sqrt((g-m)*(g-m)+(h-y)*(h-y)+(f-u)*(f-u));return Math.abs(_)<.001&&(_=1),this.x=(g-m)/_,this.y=(h-y)/_,this.z=(f-u)/_,this.w=Math.acos((l+p+d-1)/2),this}setFromMatrixPosition(t){let n=t.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,n){return this.x=Yt(this.x,t.x,n.x),this.y=Yt(this.y,t.y,n.y),this.z=Yt(this.z,t.z,n.z),this.w=Yt(this.w,t.w,n.w),this}clampScalar(t,n){return this.x=Yt(this.x,t,n),this.y=Yt(this.y,t,n),this.z=Yt(this.z,t,n),this.w=Yt(this.w,t,n),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Yt(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this.w+=(t.w-this.w)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this.w=t.w+(n.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this.z=t[n+2],this.w=t[n+3],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t[n+2]=this.z,t[n+3]=this.w,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this.z=t.getZ(n),this.w=t.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Gc=class extends Ji{constructor(t=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ci,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=n,this.depth=i.depth,this.scissor=new de(0,0,t,n),this.scissorTest=!1,this.viewport=new de(0,0,t,n);let s={width:t,height:n,depth:i.depth},r=new Fn(s);this.textures=[];let a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){let n={minFilter:Ci,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(n.mapping=t.mapping),t.wrapS!==void 0&&(n.wrapS=t.wrapS),t.wrapT!==void 0&&(n.wrapT=t.wrapT),t.wrapR!==void 0&&(n.wrapR=t.wrapR),t.magFilter!==void 0&&(n.magFilter=t.magFilter),t.minFilter!==void 0&&(n.minFilter=t.minFilter),t.format!==void 0&&(n.format=t.format),t.type!==void 0&&(n.type=t.type),t.anisotropy!==void 0&&(n.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(n.colorSpace=t.colorSpace),t.flipY!==void 0&&(n.flipY=t.flipY),t.generateMipmaps!==void 0&&(n.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(n.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,n,i=1){if(this.width!==t||this.height!==n||this.depth!==i){this.width=t,this.height=n,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=n,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,n),this.scissor.set(0,0,t,n)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++){this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;let s=Object.assign({},t.textures[n].image);this.textures[n].source=new Ao(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Qi=class extends Gc{constructor(t=1,n=1,i={}){super(t,n,i),this.isWebGLRenderTarget=!0}},Na=class extends Fn{constructor(t=null,n=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:n,height:i,depth:s},this.magFilter=$n,this.minFilter=$n,this.wrapR=Ks,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Wc=class extends Fn{constructor(t=null,n=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:n,height:i,depth:s},this.magFilter=$n,this.minFilter=$n,this.wrapR=Ks,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ts=class{constructor(t=new L(1/0,1/0,1/0),n=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=n}set(t,n){return this.min.copy(t),this.max.copy(n),this}setFromArray(t){this.makeEmpty();for(let n=0,i=t.length;n<i;n+=3)this.expandByPoint(Ei.fromArray(t,n));return this}setFromBufferAttribute(t){this.makeEmpty();for(let n=0,i=t.count;n<i;n++)this.expandByPoint(Ei.fromBufferAttribute(t,n));return this}setFromPoints(t){this.makeEmpty();for(let n=0,i=t.length;n<i;n++)this.expandByPoint(t[n]);return this}setFromCenterAndSize(t,n){let i=Ei.copy(n).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,n=!1){return this.makeEmpty(),this.expandByObject(t,n)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,n=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let r=i.getAttribute("position");if(n===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Ei):Ei.fromBufferAttribute(r,a),Ei.applyMatrix4(t.matrixWorld),this.expandByPoint(Ei);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),_c.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),_c.copy(i.boundingBox)),_c.applyMatrix4(t.matrixWorld),this.union(_c)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],n);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,n){return n.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ei),Ei.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let n,i;return t.normal.x>0?(n=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(n=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(n+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(n+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(n+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(n+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),n<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(wa),vc.subVectors(this.max,wa),lo.subVectors(t.a,wa),co.subVectors(t.b,wa),uo.subVectors(t.c,wa),Vs.subVectors(co,lo),Gs.subVectors(uo,co),Mr.subVectors(lo,uo);let n=[0,-Vs.z,Vs.y,0,-Gs.z,Gs.y,0,-Mr.z,Mr.y,Vs.z,0,-Vs.x,Gs.z,0,-Gs.x,Mr.z,0,-Mr.x,-Vs.y,Vs.x,0,-Gs.y,Gs.x,0,-Mr.y,Mr.x,0];return!Sf(n,lo,co,uo,vc)||(n=[1,0,0,0,1,0,0,0,1],!Sf(n,lo,co,uo,vc))?!1:(bc.crossVectors(Vs,Gs),n=[bc.x,bc.y,bc.z],Sf(n,lo,co,uo,vc))}clampPoint(t,n){return n.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ei).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ei).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ps[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ps[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ps[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ps[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ps[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ps[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ps[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ps[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ps),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},ps=[new L,new L,new L,new L,new L,new L,new L,new L],Ei=new L,_c=new ts,lo=new L,co=new L,uo=new L,Vs=new L,Gs=new L,Mr=new L,wa=new L,vc=new L,bc=new L,Sr=new L;function Sf(e,t,n,i,s){for(let r=0,a=e.length-3;r<=a;r+=3){Sr.fromArray(e,r);let o=s.x*Math.abs(Sr.x)+s.y*Math.abs(Sr.y)+s.z*Math.abs(Sr.z),c=t.dot(Sr),l=n.dot(Sr),u=i.dot(Sr);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}var dS=new ts,Ma=new L,Ef=new L,Js=class{constructor(t=new L,n=-1){this.isSphere=!0,this.center=t,this.radius=n}set(t,n){return this.center.copy(t),this.radius=n,this}setFromPoints(t,n){let i=this.center;n!==void 0?i.copy(n):dS.setFromPoints(t).getCenter(i);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let n=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=n*n}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,n){let i=this.center.distanceToSquared(t);return n.copy(t),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ma.subVectors(t,this.center);let n=Ma.lengthSq();if(n>this.radius*this.radius){let i=Math.sqrt(n),s=(i-this.radius)*.5;this.center.addScaledVector(Ma,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ef.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ma.copy(t.center).add(Ef)),this.expandByPoint(Ma.copy(t.center).sub(Ef))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},ms=new L,Tf=new L,wc=new L,Ws=new L,Af=new L,Mc=new L,Rf=new L,Pr=class{constructor(t=new L,n=new L(0,0,-1)){this.origin=t,this.direction=n}set(t,n){return this.origin.copy(t),this.direction.copy(n),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,n){return n.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ms)),this}closestPointToPoint(t,n){n.subVectors(t,this.origin);let i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let n=ms.subVectors(t,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(t):(ms.copy(this.origin).addScaledVector(this.direction,n),ms.distanceToSquared(t))}distanceSqToSegment(t,n,i,s){Tf.copy(t).add(n).multiplyScalar(.5),wc.copy(n).sub(t).normalize(),Ws.copy(this.origin).sub(Tf);let r=t.distanceTo(n)*.5,a=-this.direction.dot(wc),o=Ws.dot(this.direction),c=-Ws.dot(wc),l=Ws.lengthSq(),u=Math.abs(1-a*a),h,f,p,m;if(u>0)if(h=a*c-o,f=a*o-c,m=r*u,h>=0)if(f>=-m)if(f<=m){let y=1/u;h*=y,f*=y,p=h*(h+a*f+2*o)+f*(a*h+f+2*c)+l}else f=r,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*c)+l;else f=-r,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*c)+l;else f<=-m?(h=Math.max(0,-(-a*r+o)),f=h>0?-r:Math.min(Math.max(-r,-c),r),p=-h*h+f*(f+2*c)+l):f<=m?(h=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+l):(h=Math.max(0,-(a*r+o)),f=h>0?r:Math.min(Math.max(-r,-c),r),p=-h*h+f*(f+2*c)+l);else f=a>0?-r:r,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Tf).addScaledVector(wc,f),p}intersectSphere(t,n){ms.subVectors(t.center,this.origin);let i=ms.dot(this.direction),s=ms.dot(ms)-i*i,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,n):this.at(o,n)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let n=t.normal.dot(this.direction);if(n===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/n;return i>=0?i:null}intersectPlane(t,n){let i=this.distanceToPlane(t);return i===null?null:this.at(i,n)}intersectsPlane(t){let n=t.distanceToPoint(this.origin);return n===0||t.normal.dot(this.direction)*n<0}intersectBox(t,n){let i,s,r,a,o,c,l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return l>=0?(i=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(i=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),u>=0?(r=(t.min.y-f.y)*u,a=(t.max.y-f.y)*u):(r=(t.max.y-f.y)*u,a=(t.min.y-f.y)*u),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(t.min.z-f.z)*h,c=(t.max.z-f.z)*h):(o=(t.max.z-f.z)*h,c=(t.min.z-f.z)*h),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,n)}intersectsBox(t){return this.intersectBox(t,ms)!==null}intersectTriangle(t,n,i,s,r){Af.subVectors(n,t),Mc.subVectors(i,t),Rf.crossVectors(Af,Mc);let a=this.direction.dot(Rf),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ws.subVectors(this.origin,t);let c=o*this.direction.dot(Mc.crossVectors(Ws,Mc));if(c<0)return null;let l=o*this.direction.dot(Af.cross(Ws));if(l<0||c+l>a)return null;let u=-o*Ws.dot(Rf);return u<0?null:this.at(u/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},pe=class e{constructor(t,n,i,s,r,a,o,c,l,u,h,f,p,m,y,g){e.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,n,i,s,r,a,o,c,l,u,h,f,p,m,y,g)}set(t,n,i,s,r,a,o,c,l,u,h,f,p,m,y,g){let d=this.elements;return d[0]=t,d[4]=n,d[8]=i,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=c,d[2]=l,d[6]=u,d[10]=h,d[14]=f,d[3]=p,d[7]=m,d[11]=y,d[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(t){let n=this.elements,i=t.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(t){let n=this.elements,i=t.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(t){let n=t.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(t,n,i){return t.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,n,i){return this.set(t.x,n.x,i.x,0,t.y,n.y,i.y,0,t.z,n.z,i.z,0,0,0,0,1),this}extractRotation(t){let n=this.elements,i=t.elements,s=1/ho.setFromMatrixColumn(t,0).length(),r=1/ho.setFromMatrixColumn(t,1).length(),a=1/ho.setFromMatrixColumn(t,2).length();return n[0]=i[0]*s,n[1]=i[1]*s,n[2]=i[2]*s,n[3]=0,n[4]=i[4]*r,n[5]=i[5]*r,n[6]=i[6]*r,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(t){let n=this.elements,i=t.x,s=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){let f=a*u,p=a*h,m=o*u,y=o*h;n[0]=c*u,n[4]=-c*h,n[8]=l,n[1]=p+m*l,n[5]=f-y*l,n[9]=-o*c,n[2]=y-f*l,n[6]=m+p*l,n[10]=a*c}else if(t.order==="YXZ"){let f=c*u,p=c*h,m=l*u,y=l*h;n[0]=f+y*o,n[4]=m*o-p,n[8]=a*l,n[1]=a*h,n[5]=a*u,n[9]=-o,n[2]=p*o-m,n[6]=y+f*o,n[10]=a*c}else if(t.order==="ZXY"){let f=c*u,p=c*h,m=l*u,y=l*h;n[0]=f-y*o,n[4]=-a*h,n[8]=m+p*o,n[1]=p+m*o,n[5]=a*u,n[9]=y-f*o,n[2]=-a*l,n[6]=o,n[10]=a*c}else if(t.order==="ZYX"){let f=a*u,p=a*h,m=o*u,y=o*h;n[0]=c*u,n[4]=m*l-p,n[8]=f*l+y,n[1]=c*h,n[5]=y*l+f,n[9]=p*l-m,n[2]=-l,n[6]=o*c,n[10]=a*c}else if(t.order==="YZX"){let f=a*c,p=a*l,m=o*c,y=o*l;n[0]=c*u,n[4]=y-f*h,n[8]=m*h+p,n[1]=h,n[5]=a*u,n[9]=-o*u,n[2]=-l*u,n[6]=p*h+m,n[10]=f-y*h}else if(t.order==="XZY"){let f=a*c,p=a*l,m=o*c,y=o*l;n[0]=c*u,n[4]=-h,n[8]=l*u,n[1]=f*h+y,n[5]=a*u,n[9]=p*h-m,n[2]=m*h-p,n[6]=o*u,n[10]=y*h+f}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(t){return this.compose(fS,t,pS)}lookAt(t,n,i){let s=this.elements;return Zn.subVectors(t,n),Zn.lengthSq()===0&&(Zn.z=1),Zn.normalize(),qs.crossVectors(i,Zn),qs.lengthSq()===0&&(Math.abs(i.z)===1?Zn.x+=1e-4:Zn.z+=1e-4,Zn.normalize(),qs.crossVectors(i,Zn)),qs.normalize(),Sc.crossVectors(Zn,qs),s[0]=qs.x,s[4]=Sc.x,s[8]=Zn.x,s[1]=qs.y,s[5]=Sc.y,s[9]=Zn.y,s[2]=qs.z,s[6]=Sc.z,s[10]=Zn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,n){let i=t.elements,s=n.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],u=i[1],h=i[5],f=i[9],p=i[13],m=i[2],y=i[6],g=i[10],d=i[14],_=i[3],w=i[7],b=i[11],A=i[15],S=s[0],T=s[4],I=s[8],x=s[12],v=s[1],R=s[5],D=s[9],B=s[13],V=s[2],X=s[6],z=s[10],Z=s[14],$=s[3],lt=s[7],ht=s[11],vt=s[15];return r[0]=a*S+o*v+c*V+l*$,r[4]=a*T+o*R+c*X+l*lt,r[8]=a*I+o*D+c*z+l*ht,r[12]=a*x+o*B+c*Z+l*vt,r[1]=u*S+h*v+f*V+p*$,r[5]=u*T+h*R+f*X+p*lt,r[9]=u*I+h*D+f*z+p*ht,r[13]=u*x+h*B+f*Z+p*vt,r[2]=m*S+y*v+g*V+d*$,r[6]=m*T+y*R+g*X+d*lt,r[10]=m*I+y*D+g*z+d*ht,r[14]=m*x+y*B+g*Z+d*vt,r[3]=_*S+w*v+b*V+A*$,r[7]=_*T+w*R+b*X+A*lt,r[11]=_*I+w*D+b*z+A*ht,r[15]=_*x+w*B+b*Z+A*vt,this}multiplyScalar(t){let n=this.elements;return n[0]*=t,n[4]*=t,n[8]*=t,n[12]*=t,n[1]*=t,n[5]*=t,n[9]*=t,n[13]*=t,n[2]*=t,n[6]*=t,n[10]*=t,n[14]*=t,n[3]*=t,n[7]*=t,n[11]*=t,n[15]*=t,this}determinant(){let t=this.elements,n=t[0],i=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],u=t[2],h=t[6],f=t[10],p=t[14],m=t[3],y=t[7],g=t[11],d=t[15];return m*(+r*c*h-s*l*h-r*o*f+i*l*f+s*o*p-i*c*p)+y*(+n*c*p-n*l*f+r*a*f-s*a*p+s*l*u-r*c*u)+g*(+n*l*h-n*o*p-r*a*h+i*a*p+r*o*u-i*l*u)+d*(-s*o*u-n*c*h+n*o*f+s*a*h-i*a*f+i*c*u)}transpose(){let t=this.elements,n;return n=t[1],t[1]=t[4],t[4]=n,n=t[2],t[2]=t[8],t[8]=n,n=t[6],t[6]=t[9],t[9]=n,n=t[3],t[3]=t[12],t[12]=n,n=t[7],t[7]=t[13],t[13]=n,n=t[11],t[11]=t[14],t[14]=n,this}setPosition(t,n,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=n,s[14]=i),this}invert(){let t=this.elements,n=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8],h=t[9],f=t[10],p=t[11],m=t[12],y=t[13],g=t[14],d=t[15],_=h*g*l-y*f*l+y*c*p-o*g*p-h*c*d+o*f*d,w=m*f*l-u*g*l-m*c*p+a*g*p+u*c*d-a*f*d,b=u*y*l-m*h*l+m*o*p-a*y*p-u*o*d+a*h*d,A=m*h*c-u*y*c-m*o*f+a*y*f+u*o*g-a*h*g,S=n*_+i*w+s*b+r*A;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let T=1/S;return t[0]=_*T,t[1]=(y*f*r-h*g*r-y*s*p+i*g*p+h*s*d-i*f*d)*T,t[2]=(o*g*r-y*c*r+y*s*l-i*g*l-o*s*d+i*c*d)*T,t[3]=(h*c*r-o*f*r-h*s*l+i*f*l+o*s*p-i*c*p)*T,t[4]=w*T,t[5]=(u*g*r-m*f*r+m*s*p-n*g*p-u*s*d+n*f*d)*T,t[6]=(m*c*r-a*g*r-m*s*l+n*g*l+a*s*d-n*c*d)*T,t[7]=(a*f*r-u*c*r+u*s*l-n*f*l-a*s*p+n*c*p)*T,t[8]=b*T,t[9]=(m*h*r-u*y*r-m*i*p+n*y*p+u*i*d-n*h*d)*T,t[10]=(a*y*r-m*o*r+m*i*l-n*y*l-a*i*d+n*o*d)*T,t[11]=(u*o*r-a*h*r-u*i*l+n*h*l+a*i*p-n*o*p)*T,t[12]=A*T,t[13]=(u*y*s-m*h*s+m*i*f-n*y*f-u*i*g+n*h*g)*T,t[14]=(m*o*s-a*y*s-m*i*c+n*y*c+a*i*g-n*o*g)*T,t[15]=(a*h*s-u*o*s+u*i*c-n*h*c-a*i*f+n*o*f)*T,this}scale(t){let n=this.elements,i=t.x,s=t.y,r=t.z;return n[0]*=i,n[4]*=s,n[8]*=r,n[1]*=i,n[5]*=s,n[9]*=r,n[2]*=i,n[6]*=s,n[10]*=r,n[3]*=i,n[7]*=s,n[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,n=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(n,i,s))}makeTranslation(t,n,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(t){let n=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,n){let i=Math.cos(n),s=Math.sin(n),r=1-i,a=t.x,o=t.y,c=t.z,l=r*a,u=r*o;return this.set(l*a+i,l*o-s*c,l*c+s*o,0,l*o+s*c,u*o+i,u*c-s*a,0,l*c-s*o,u*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(t,n,i){return this.set(t,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,n,i,s,r,a){return this.set(1,i,r,0,t,1,a,0,n,s,1,0,0,0,0,1),this}compose(t,n,i){let s=this.elements,r=n._x,a=n._y,o=n._z,c=n._w,l=r+r,u=a+a,h=o+o,f=r*l,p=r*u,m=r*h,y=a*u,g=a*h,d=o*h,_=c*l,w=c*u,b=c*h,A=i.x,S=i.y,T=i.z;return s[0]=(1-(y+d))*A,s[1]=(p+b)*A,s[2]=(m-w)*A,s[3]=0,s[4]=(p-b)*S,s[5]=(1-(f+d))*S,s[6]=(g+_)*S,s[7]=0,s[8]=(m+w)*T,s[9]=(g-_)*T,s[10]=(1-(f+y))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,n,i){let s=this.elements,r=ho.set(s[0],s[1],s[2]).length(),a=ho.set(s[4],s[5],s[6]).length(),o=ho.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Ti.copy(this);let l=1/r,u=1/a,h=1/o;return Ti.elements[0]*=l,Ti.elements[1]*=l,Ti.elements[2]*=l,Ti.elements[4]*=u,Ti.elements[5]*=u,Ti.elements[6]*=u,Ti.elements[8]*=h,Ti.elements[9]*=h,Ti.elements[10]*=h,n.setFromRotationMatrix(Ti),i.x=r,i.y=a,i.z=o,this}makePerspective(t,n,i,s,r,a,o=Ri,c=!1){let l=this.elements,u=2*r/(n-t),h=2*r/(i-s),f=(n+t)/(n-t),p=(i+s)/(i-s),m,y;if(c)m=r/(a-r),y=a*r/(a-r);else if(o===Ri)m=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===La)m=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,n,i,s,r,a,o=Ri,c=!1){let l=this.elements,u=2/(n-t),h=2/(i-s),f=-(n+t)/(n-t),p=-(i+s)/(i-s),m,y;if(c)m=1/(a-r),y=a/(a-r);else if(o===Ri)m=-2/(a-r),y=-(a+r)/(a-r);else if(o===La)m=-1/(a-r),y=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=h,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=m,l[14]=y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let n=this.elements,i=t.elements;for(let s=0;s<16;s++)if(n[s]!==i[s])return!1;return!0}fromArray(t,n=0){for(let i=0;i<16;i++)this.elements[i]=t[i+n];return this}toArray(t=[],n=0){let i=this.elements;return t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=i[3],t[n+4]=i[4],t[n+5]=i[5],t[n+6]=i[6],t[n+7]=i[7],t[n+8]=i[8],t[n+9]=i[9],t[n+10]=i[10],t[n+11]=i[11],t[n+12]=i[12],t[n+13]=i[13],t[n+14]=i[14],t[n+15]=i[15],t}},ho=new L,Ti=new pe,fS=new L(0,0,0),pS=new L(1,1,1),qs=new L,Sc=new L,Zn=new L,b0=new pe,w0=new fi,pi=class e{constructor(t=0,n=0,i=0,s=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,n,i,s=this._order){return this._x=t,this._y=n,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,n=this._order,i=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],u=s[9],h=s[2],f=s[6],p=s[10];switch(n){case"XYZ":this._y=Math.asin(Yt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Yt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Yt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Yt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Yt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Yt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,n,i){return b0.makeRotationFromQuaternion(t),this.setFromRotationMatrix(b0,n,i)}setFromVector3(t,n=this._order){return this.set(t.x,t.y,t.z,n)}reorder(t){return w0.setFromEuler(this),this.setFromQuaternion(w0,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};pi.DEFAULT_ORDER="XYZ";var Ro=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},mS=0,M0=new L,fo=new fi,gs=new pe,Ec=new L,Sa=new L,gS=new L,yS=new fi,S0=new L(1,0,0),E0=new L(0,1,0),T0=new L(0,0,1),A0={type:"added"},xS={type:"removed"},po={type:"childadded",child:null},Cf={type:"childremoved",child:null},Ye=class e extends Ji{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:mS++}),this.uuid=Ho(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new L,n=new pi,i=new fi,s=new L(1,1,1);function r(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new pe},normalMatrix:{value:new $t}}),this.matrix=new pe,this.matrixWorld=new pe,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ro,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,n){this.quaternion.setFromAxisAngle(t,n)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,n){return fo.setFromAxisAngle(t,n),this.quaternion.multiply(fo),this}rotateOnWorldAxis(t,n){return fo.setFromAxisAngle(t,n),this.quaternion.premultiply(fo),this}rotateX(t){return this.rotateOnAxis(S0,t)}rotateY(t){return this.rotateOnAxis(E0,t)}rotateZ(t){return this.rotateOnAxis(T0,t)}translateOnAxis(t,n){return M0.copy(t).applyQuaternion(this.quaternion),this.position.add(M0.multiplyScalar(n)),this}translateX(t){return this.translateOnAxis(S0,t)}translateY(t){return this.translateOnAxis(E0,t)}translateZ(t){return this.translateOnAxis(T0,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(gs.copy(this.matrixWorld).invert())}lookAt(t,n,i){t.isVector3?Ec.copy(t):Ec.set(t,n,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Sa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?gs.lookAt(Sa,Ec,this.up):gs.lookAt(Ec,Sa,this.up),this.quaternion.setFromRotationMatrix(gs),s&&(gs.extractRotation(s.matrixWorld),fo.setFromRotationMatrix(gs),this.quaternion.premultiply(fo.invert()))}add(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(A0),po.child=t,this.dispatchEvent(po),po.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let n=this.children.indexOf(t);return n!==-1&&(t.parent=null,this.children.splice(n,1),t.dispatchEvent(xS),Cf.child=t,this.dispatchEvent(Cf),Cf.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),gs.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),gs.multiply(t.parent.matrixWorld)),t.applyMatrix4(gs),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(A0),po.child=t,this.dispatchEvent(po),po.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,n){if(this[t]===n)return this;for(let i=0,s=this.children.length;i<s;i++){let a=this.children[i].getObjectByProperty(t,n);if(a!==void 0)return a}}getObjectsByProperty(t,n,i=[]){this[t]===n&&i.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,n,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Sa,t,gS),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Sa,yS,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let n=this.matrixWorld.elements;return t.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(t){t(this);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverseVisible(t)}traverseAncestors(t){let n=this.parent;n!==null&&(t(n),n.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].updateMatrixWorld(t)}updateWorldMatrix(t,n){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){let n=t===void 0||typeof t=="string",i={};n&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let h=c[l];r(t.shapes,h)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(t.animations,c))}}if(n){let o=a(t.geometries),c=a(t.materials),l=a(t.textures),u=a(t.images),h=a(t.shapes),f=a(t.skeletons),p=a(t.animations),m=a(t.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),m.length>0&&(i.nodes=m)}return i.object=s,i;function a(o){let c=[];for(let l in o){let u=o[l];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,n=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),n===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}};Ye.DEFAULT_UP=new L(0,1,0);Ye.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ai=new L,ys=new L,If=new L,xs=new L,mo=new L,go=new L,R0=new L,Pf=new L,kf=new L,Lf=new L,Df=new de,Nf=new de,Uf=new de,Ys=class e{constructor(t=new L,n=new L,i=new L){this.a=t,this.b=n,this.c=i}static getNormal(t,n,i,s){s.subVectors(i,n),Ai.subVectors(t,n),s.cross(Ai);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,n,i,s,r){Ai.subVectors(s,n),ys.subVectors(i,n),If.subVectors(t,n);let a=Ai.dot(Ai),o=Ai.dot(ys),c=Ai.dot(If),l=ys.dot(ys),u=ys.dot(If),h=a*l-o*o;if(h===0)return r.set(0,0,0),null;let f=1/h,p=(l*c-o*u)*f,m=(a*u-o*c)*f;return r.set(1-p-m,m,p)}static containsPoint(t,n,i,s){return this.getBarycoord(t,n,i,s,xs)===null?!1:xs.x>=0&&xs.y>=0&&xs.x+xs.y<=1}static getInterpolation(t,n,i,s,r,a,o,c){return this.getBarycoord(t,n,i,s,xs)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,xs.x),c.addScaledVector(a,xs.y),c.addScaledVector(o,xs.z),c)}static getInterpolatedAttribute(t,n,i,s,r,a){return Df.setScalar(0),Nf.setScalar(0),Uf.setScalar(0),Df.fromBufferAttribute(t,n),Nf.fromBufferAttribute(t,i),Uf.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(Df,r.x),a.addScaledVector(Nf,r.y),a.addScaledVector(Uf,r.z),a}static isFrontFacing(t,n,i,s){return Ai.subVectors(i,n),ys.subVectors(t,n),Ai.cross(ys).dot(s)<0}set(t,n,i){return this.a.copy(t),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(t,n,i,s){return this.a.copy(t[n]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,n,i,s){return this.a.fromBufferAttribute(t,n),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ai.subVectors(this.c,this.b),ys.subVectors(this.a,this.b),Ai.cross(ys).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,i,s,r){return e.getInterpolation(t,this.a,this.b,this.c,n,i,s,r)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,n){let i=this.a,s=this.b,r=this.c,a,o;mo.subVectors(s,i),go.subVectors(r,i),Pf.subVectors(t,i);let c=mo.dot(Pf),l=go.dot(Pf);if(c<=0&&l<=0)return n.copy(i);kf.subVectors(t,s);let u=mo.dot(kf),h=go.dot(kf);if(u>=0&&h<=u)return n.copy(s);let f=c*h-u*l;if(f<=0&&c>=0&&u<=0)return a=c/(c-u),n.copy(i).addScaledVector(mo,a);Lf.subVectors(t,r);let p=mo.dot(Lf),m=go.dot(Lf);if(m>=0&&p<=m)return n.copy(r);let y=p*l-c*m;if(y<=0&&l>=0&&m<=0)return o=l/(l-m),n.copy(i).addScaledVector(go,o);let g=u*m-p*h;if(g<=0&&h-u>=0&&p-m>=0)return R0.subVectors(r,s),o=(h-u)/(h-u+(p-m)),n.copy(s).addScaledVector(R0,o);let d=1/(g+y+f);return a=y*d,o=f*d,n.copy(i).addScaledVector(mo,a).addScaledVector(go,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Cy={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Xs={h:0,s:0,l:0},Tc={h:0,s:0,l:0};function Of(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var Gt=class{constructor(t,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,n,i)}set(t,n,i){if(n===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,n,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,n=Ve){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ne.colorSpaceToWorking(this,n),this}setRGB(t,n,i,s=ne.workingColorSpace){return this.r=t,this.g=n,this.b=i,ne.colorSpaceToWorking(this,s),this}setHSL(t,n,i,s=ne.workingColorSpace){if(t=fp(t,1),n=Yt(n,0,1),i=Yt(i,0,1),n===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+n):i+n-i*n,a=2*i-r;this.r=Of(a,r,t+1/3),this.g=Of(a,r,t),this.b=Of(a,r,t-1/3)}return ne.colorSpaceToWorking(this,s),this}setStyle(t,n=Ve){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,n);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,n);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(r,16),n);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,n);return this}setColorName(t,n=Ve){let i=Cy[t.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=_s(t.r),this.g=_s(t.g),this.b=_s(t.b),this}copyLinearToSRGB(t){return this.r=wo(t.r),this.g=wo(t.g),this.b=wo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ve){return ne.workingToColorSpace(Sn.copy(this),t),Math.round(Yt(Sn.r*255,0,255))*65536+Math.round(Yt(Sn.g*255,0,255))*256+Math.round(Yt(Sn.b*255,0,255))}getHexString(t=Ve){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,n=ne.workingColorSpace){ne.workingToColorSpace(Sn.copy(this),n);let i=Sn.r,s=Sn.g,r=Sn.b,a=Math.max(i,s,r),o=Math.min(i,s,r),c,l,u=(o+a)/2;if(o===a)c=0,l=0;else{let h=a-o;switch(l=u<=.5?h/(a+o):h/(2-a-o),a){case i:c=(s-r)/h+(s<r?6:0);break;case s:c=(r-i)/h+2;break;case r:c=(i-s)/h+4;break}c/=6}return t.h=c,t.s=l,t.l=u,t}getRGB(t,n=ne.workingColorSpace){return ne.workingToColorSpace(Sn.copy(this),n),t.r=Sn.r,t.g=Sn.g,t.b=Sn.b,t}getStyle(t=Ve){ne.workingToColorSpace(Sn.copy(this),t);let n=Sn.r,i=Sn.g,s=Sn.b;return t!==Ve?`color(${t} ${n.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,n,i){return this.getHSL(Xs),this.setHSL(Xs.h+t,Xs.s+n,Xs.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,n){return this.r=t.r+n.r,this.g=t.g+n.g,this.b=t.b+n.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,n){return this.r+=(t.r-this.r)*n,this.g+=(t.g-this.g)*n,this.b+=(t.b-this.b)*n,this}lerpColors(t,n,i){return this.r=t.r+(n.r-t.r)*i,this.g=t.g+(n.g-t.g)*i,this.b=t.b+(n.b-t.b)*i,this}lerpHSL(t,n){this.getHSL(Xs),t.getHSL(Tc);let i=Ia(Xs.h,Tc.h,n),s=Ia(Xs.s,Tc.s,n),r=Ia(Xs.l,Tc.l,n);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let n=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*n+r[3]*i+r[6]*s,this.g=r[1]*n+r[4]*i+r[7]*s,this.b=r[2]*n+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,n=0){return this.r=t[n],this.g=t[n+1],this.b=t[n+2],this}toArray(t=[],n=0){return t[n]=this.r,t[n+1]=this.g,t[n+2]=this.b,t}fromBufferAttribute(t,n){return this.r=t.getX(n),this.g=t.getY(n),this.b=t.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Sn=new Gt;Gt.NAMES=Cy;var _S=0,bs=class extends Ji{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:_S++}),this.uuid=Ho(),this.name="",this.type="Material",this.blending=Rr,this.side=vs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Bc,this.blendDst=Hc,this.blendEquation=Zs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Gt(0,0,0),this.blendAlpha=0,this.depthFunc=Cr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=qf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ar,this.stencilZFail=Ar,this.stencilZPass=Ar,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let n in t){let i=t[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}let s=this[n];if(s===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[n]=i}}toJSON(t){let n=t===void 0||typeof t=="string";n&&(t={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Rr&&(i.blending=this.blending),this.side!==vs&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Bc&&(i.blendSrc=this.blendSrc),this.blendDst!==Hc&&(i.blendDst=this.blendDst),this.blendEquation!==Zs&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Cr&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==qf&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ar&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ar&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ar&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(n){let r=s(t.textures),a=s(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let n=t.clippingPlanes,i=null;if(n!==null){let s=n.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=n[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},cn=class extends bs{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Gt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pi,this.combine=gu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var je=new L,Ac=new At,vS=0,ln=class{constructor(t,n,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:vS++}),this.name="",this.array=t,this.itemSize=n,this.count=t!==void 0?t.length/n:0,this.normalized=i,this.usage=Xf,this.updateRanges=[],this.gpuType=Li,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,n,i){t*=this.itemSize,i*=n.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=n.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Ac.fromBufferAttribute(this,n),Ac.applyMatrix3(t),this.setXY(n,Ac.x,Ac.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)je.fromBufferAttribute(this,n),je.applyMatrix3(t),this.setXYZ(n,je.x,je.y,je.z);return this}applyMatrix4(t){for(let n=0,i=this.count;n<i;n++)je.fromBufferAttribute(this,n),je.applyMatrix4(t),this.setXYZ(n,je.x,je.y,je.z);return this}applyNormalMatrix(t){for(let n=0,i=this.count;n<i;n++)je.fromBufferAttribute(this,n),je.applyNormalMatrix(t),this.setXYZ(n,je.x,je.y,je.z);return this}transformDirection(t){for(let n=0,i=this.count;n<i;n++)je.fromBufferAttribute(this,n),je.transformDirection(t),this.setXYZ(n,je.x,je.y,je.z);return this}set(t,n=0){return this.array.set(t,n),this}getComponent(t,n){let i=this.array[t*this.itemSize+n];return this.normalized&&(i=bo(i,this.array)),i}setComponent(t,n,i){return this.normalized&&(i=On(i,this.array)),this.array[t*this.itemSize+n]=i,this}getX(t){let n=this.array[t*this.itemSize];return this.normalized&&(n=bo(n,this.array)),n}setX(t,n){return this.normalized&&(n=On(n,this.array)),this.array[t*this.itemSize]=n,this}getY(t){let n=this.array[t*this.itemSize+1];return this.normalized&&(n=bo(n,this.array)),n}setY(t,n){return this.normalized&&(n=On(n,this.array)),this.array[t*this.itemSize+1]=n,this}getZ(t){let n=this.array[t*this.itemSize+2];return this.normalized&&(n=bo(n,this.array)),n}setZ(t,n){return this.normalized&&(n=On(n,this.array)),this.array[t*this.itemSize+2]=n,this}getW(t){let n=this.array[t*this.itemSize+3];return this.normalized&&(n=bo(n,this.array)),n}setW(t,n){return this.normalized&&(n=On(n,this.array)),this.array[t*this.itemSize+3]=n,this}setXY(t,n,i){return t*=this.itemSize,this.normalized&&(n=On(n,this.array),i=On(i,this.array)),this.array[t+0]=n,this.array[t+1]=i,this}setXYZ(t,n,i,s){return t*=this.itemSize,this.normalized&&(n=On(n,this.array),i=On(i,this.array),s=On(s,this.array)),this.array[t+0]=n,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,n,i,s,r){return t*=this.itemSize,this.normalized&&(n=On(n,this.array),i=On(i,this.array),s=On(s,this.array),r=On(r,this.array)),this.array[t+0]=n,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Xf&&(t.usage=this.usage),t}};var Ua=class extends ln{constructor(t,n,i){super(new Uint16Array(t),n,i)}};var Oa=class extends ln{constructor(t,n,i){super(new Uint32Array(t),n,i)}};var me=class extends ln{constructor(t,n,i){super(new Float32Array(t),n,i)}},bS=0,hi=new pe,Ff=new Ye,yo=new L,Jn=new ts,Ea=new ts,an=new L,En=class e extends Ji{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:bS++}),this.uuid=Ho(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(pp(t)?Oa:Ua)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,n){return this.attributes[t]=n,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,n,i=0){this.groups.push({start:t,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,n){this.drawRange.start=t,this.drawRange.count=n}applyMatrix4(t){let n=this.attributes.position;n!==void 0&&(n.applyMatrix4(t),n.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new $t().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return hi.makeRotationFromQuaternion(t),this.applyMatrix4(hi),this}rotateX(t){return hi.makeRotationX(t),this.applyMatrix4(hi),this}rotateY(t){return hi.makeRotationY(t),this.applyMatrix4(hi),this}rotateZ(t){return hi.makeRotationZ(t),this.applyMatrix4(hi),this}translate(t,n,i){return hi.makeTranslation(t,n,i),this.applyMatrix4(hi),this}scale(t,n,i){return hi.makeScale(t,n,i),this.applyMatrix4(hi),this}lookAt(t){return Ff.lookAt(t),Ff.updateMatrix(),this.applyMatrix4(Ff.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(yo).negate(),this.translate(yo.x,yo.y,yo.z),this}setFromPoints(t){let n=this.getAttribute("position");if(n===void 0){let i=[];for(let s=0,r=t.length;s<r;s++){let a=t[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new me(i,3))}else{let i=Math.min(t.length,n.count);for(let s=0;s<i;s++){let r=t[s];n.setXYZ(s,r.x,r.y,r.z||0)}t.length>n.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ts);let t=this.attributes.position,n=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),n)for(let i=0,s=n.length;i<s;i++){let r=n[i];Jn.setFromBufferAttribute(r),this.morphTargetsRelative?(an.addVectors(this.boundingBox.min,Jn.min),this.boundingBox.expandByPoint(an),an.addVectors(this.boundingBox.max,Jn.max),this.boundingBox.expandByPoint(an)):(this.boundingBox.expandByPoint(Jn.min),this.boundingBox.expandByPoint(Jn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Js);let t=this.attributes.position,n=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){let i=this.boundingSphere.center;if(Jn.setFromBufferAttribute(t),n)for(let r=0,a=n.length;r<a;r++){let o=n[r];Ea.setFromBufferAttribute(o),this.morphTargetsRelative?(an.addVectors(Jn.min,Ea.min),Jn.expandByPoint(an),an.addVectors(Jn.max,Ea.max),Jn.expandByPoint(an)):(Jn.expandByPoint(Ea.min),Jn.expandByPoint(Ea.max))}Jn.getCenter(i);let s=0;for(let r=0,a=t.count;r<a;r++)an.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(an));if(n)for(let r=0,a=n.length;r<a;r++){let o=n[r],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)an.fromBufferAttribute(o,l),c&&(yo.fromBufferAttribute(t,l),an.add(yo)),s=Math.max(s,i.distanceToSquared(an))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,n=this.attributes;if(t===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=n.position,s=n.normal,r=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ln(new Float32Array(4*i.count),4));let a=this.getAttribute("tangent"),o=[],c=[];for(let I=0;I<i.count;I++)o[I]=new L,c[I]=new L;let l=new L,u=new L,h=new L,f=new At,p=new At,m=new At,y=new L,g=new L;function d(I,x,v){l.fromBufferAttribute(i,I),u.fromBufferAttribute(i,x),h.fromBufferAttribute(i,v),f.fromBufferAttribute(r,I),p.fromBufferAttribute(r,x),m.fromBufferAttribute(r,v),u.sub(l),h.sub(l),p.sub(f),m.sub(f);let R=1/(p.x*m.y-m.x*p.y);isFinite(R)&&(y.copy(u).multiplyScalar(m.y).addScaledVector(h,-p.y).multiplyScalar(R),g.copy(h).multiplyScalar(p.x).addScaledVector(u,-m.x).multiplyScalar(R),o[I].add(y),o[x].add(y),o[v].add(y),c[I].add(g),c[x].add(g),c[v].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let I=0,x=_.length;I<x;++I){let v=_[I],R=v.start,D=v.count;for(let B=R,V=R+D;B<V;B+=3)d(t.getX(B+0),t.getX(B+1),t.getX(B+2))}let w=new L,b=new L,A=new L,S=new L;function T(I){A.fromBufferAttribute(s,I),S.copy(A);let x=o[I];w.copy(x),w.sub(A.multiplyScalar(A.dot(x))).normalize(),b.crossVectors(S,x);let R=b.dot(c[I])<0?-1:1;a.setXYZW(I,w.x,w.y,w.z,R)}for(let I=0,x=_.length;I<x;++I){let v=_[I],R=v.start,D=v.count;for(let B=R,V=R+D;B<V;B+=3)T(t.getX(B+0)),T(t.getX(B+1)),T(t.getX(B+2))}}computeVertexNormals(){let t=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ln(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);let s=new L,r=new L,a=new L,o=new L,c=new L,l=new L,u=new L,h=new L;if(t)for(let f=0,p=t.count;f<p;f+=3){let m=t.getX(f+0),y=t.getX(f+1),g=t.getX(f+2);s.fromBufferAttribute(n,m),r.fromBufferAttribute(n,y),a.fromBufferAttribute(n,g),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),o.fromBufferAttribute(i,m),c.fromBufferAttribute(i,y),l.fromBufferAttribute(i,g),o.add(u),c.add(u),l.add(u),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(y,c.x,c.y,c.z),i.setXYZ(g,l.x,l.y,l.z)}else for(let f=0,p=n.count;f<p;f+=3)s.fromBufferAttribute(n,f+0),r.fromBufferAttribute(n,f+1),a.fromBufferAttribute(n,f+2),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let n=0,i=t.count;n<i;n++)an.fromBufferAttribute(t,n),an.normalize(),t.setXYZ(n,an.x,an.y,an.z)}toNonIndexed(){function t(o,c){let l=o.array,u=o.itemSize,h=o.normalized,f=new l.constructor(c.length*u),p=0,m=0;for(let y=0,g=c.length;y<g;y++){o.isInterleavedBufferAttribute?p=c[y]*o.data.stride+o.offset:p=c[y]*u;for(let d=0;d<u;d++)f[m++]=l[p++]}return new ln(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let n=new e,i=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=t(c,i);n.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let u=0,h=l.length;u<h;u++){let f=l[u],p=t(f,i);c.push(p)}n.morphAttributes[o]=c}n.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];n.addGroup(l.start,l.count,l.materialIndex)}return n}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let n=this.index;n!==null&&(t.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});let i=this.attributes;for(let c in i){let l=i[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let h=0,f=l.length;h<f;h++){let p=l[h];u.push(p.toJSON(t.data))}u.length>0&&(s[c]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let n={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone());let s=t.attributes;for(let l in s){let u=s[l];this.setAttribute(l,u.clone(n))}let r=t.morphAttributes;for(let l in r){let u=[],h=r[l];for(let f=0,p=h.length;f<p;f++)u.push(h[f].clone(n));this.morphAttributes[l]=u}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let l=0,u=a.length;l<u;l++){let h=a[l];this.addGroup(h.start,h.count,h.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},C0=new pe,Er=new Pr,Rc=new Js,I0=new L,Cc=new L,Ic=new L,Pc=new L,Bf=new L,kc=new L,P0=new L,Lc=new L,q=class extends Ye{constructor(t=new En,n=new cn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,n){return super.copy(t,n),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,n){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){kc.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let u=o[c],h=r[c];u!==0&&(Bf.fromBufferAttribute(h,t),a?kc.addScaledVector(Bf,u):kc.addScaledVector(Bf.sub(n),u))}n.add(kc)}return n}raycast(t,n){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Rc.copy(i.boundingSphere),Rc.applyMatrix4(r),Er.copy(t.ray).recast(t.near),!(Rc.containsPoint(Er.origin)===!1&&(Er.intersectSphere(Rc,I0)===null||Er.origin.distanceToSquared(I0)>(t.far-t.near)**2))&&(C0.copy(r).invert(),Er.copy(t.ray).applyMatrix4(C0),!(i.boundingBox!==null&&Er.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,n,Er)))}_computeIntersections(t,n,i){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,f=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,y=f.length;m<y;m++){let g=f[m],d=a[g.materialIndex],_=Math.max(g.start,p.start),w=Math.min(o.count,Math.min(g.start+g.count,p.start+p.count));for(let b=_,A=w;b<A;b+=3){let S=o.getX(b),T=o.getX(b+1),I=o.getX(b+2);s=Dc(this,d,t,i,l,u,h,S,T,I),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=g.materialIndex,n.push(s))}}else{let m=Math.max(0,p.start),y=Math.min(o.count,p.start+p.count);for(let g=m,d=y;g<d;g+=3){let _=o.getX(g),w=o.getX(g+1),b=o.getX(g+2);s=Dc(this,a,t,i,l,u,h,_,w,b),s&&(s.faceIndex=Math.floor(g/3),n.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let m=0,y=f.length;m<y;m++){let g=f[m],d=a[g.materialIndex],_=Math.max(g.start,p.start),w=Math.min(c.count,Math.min(g.start+g.count,p.start+p.count));for(let b=_,A=w;b<A;b+=3){let S=b,T=b+1,I=b+2;s=Dc(this,d,t,i,l,u,h,S,T,I),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=g.materialIndex,n.push(s))}}else{let m=Math.max(0,p.start),y=Math.min(c.count,p.start+p.count);for(let g=m,d=y;g<d;g+=3){let _=g,w=g+1,b=g+2;s=Dc(this,a,t,i,l,u,h,_,w,b),s&&(s.faceIndex=Math.floor(g/3),n.push(s))}}}};function wS(e,t,n,i,s,r,a,o){let c;if(t.side===mn?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,t.side===vs,o),c===null)return null;Lc.copy(o),Lc.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Lc);return l<n.near||l>n.far?null:{distance:l,point:Lc.clone(),object:e}}function Dc(e,t,n,i,s,r,a,o,c,l){e.getVertexPosition(o,Cc),e.getVertexPosition(c,Ic),e.getVertexPosition(l,Pc);let u=wS(e,t,n,i,Cc,Ic,Pc,P0);if(u){let h=new L;Ys.getBarycoord(P0,Cc,Ic,Pc,h),s&&(u.uv=Ys.getInterpolatedAttribute(s,o,c,l,h,new At)),r&&(u.uv1=Ys.getInterpolatedAttribute(r,o,c,l,h,new At)),a&&(u.normal=Ys.getInterpolatedAttribute(a,o,c,l,h,new L),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let f={a:o,b:c,c:l,normal:new L,materialIndex:0};Ys.getNormal(Cc,Ic,Pc,f.normal),u.face=f,u.barycoord=h}return u}var un=class e extends En{constructor(t=1,n=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:n,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],u=[],h=[],f=0,p=0;m("z","y","x",-1,-1,i,n,t,a,r,0),m("z","y","x",1,-1,i,n,-t,a,r,1),m("x","z","y",1,1,t,i,n,s,a,2),m("x","z","y",1,-1,t,i,-n,s,a,3),m("x","y","z",1,-1,t,n,i,s,r,4),m("x","y","z",-1,-1,t,n,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new me(l,3)),this.setAttribute("normal",new me(u,3)),this.setAttribute("uv",new me(h,2));function m(y,g,d,_,w,b,A,S,T,I,x){let v=b/T,R=A/I,D=b/2,B=A/2,V=S/2,X=T+1,z=I+1,Z=0,$=0,lt=new L;for(let ht=0;ht<z;ht++){let vt=ht*R-B;for(let qt=0;qt<X;qt++){let te=qt*v-D;lt[y]=te*_,lt[g]=vt*w,lt[d]=V,l.push(lt.x,lt.y,lt.z),lt[y]=0,lt[g]=0,lt[d]=S>0?1:-1,u.push(lt.x,lt.y,lt.z),h.push(qt/T),h.push(1-ht/I),Z+=1}}for(let ht=0;ht<I;ht++)for(let vt=0;vt<T;vt++){let qt=f+vt+X*ht,te=f+vt+X*(ht+1),Ee=f+(vt+1)+X*(ht+1),se=f+(vt+1)+X*ht;c.push(qt,te,se),c.push(te,Ee,se),$+=6}o.addGroup(p,$,x),p+=$,f+=Z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Ur(e){let t={};for(let n in e){t[n]={};for(let i in e[n]){let s=e[n][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[n][i]=null):t[n][i]=s.clone():Array.isArray(s)?t[n][i]=s.slice():t[n][i]=s}}return t}function An(e){let t={};for(let n=0;n<e.length;n++){let i=Ur(e[n]);for(let s in i)t[s]=i[s]}return t}function MS(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function mp(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ne.workingColorSpace}var Iy={clone:Ur,merge:An},SS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ES=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ii=class extends bs{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=SS,this.fragmentShader=ES,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ur(t.uniforms),this.uniformsGroups=MS(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let n=super.toJSON(t);n.glslVersion=this.glslVersion,n.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?n.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?n.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[s]={type:"m4",value:a.toArray()}:n.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}},Fa=class extends Ye{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pe,this.projectionMatrix=new pe,this.projectionMatrixInverse=new pe,this.coordinateSystem=Ri,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,n){return super.copy(t,n),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,n){super.updateWorldMatrix(t,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},js=new L,k0=new At,L0=new At,pn=class extends Fa{constructor(t=50,n=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,n){return super.copy(t,n),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let n=.5*this.getFilmHeight()/t;this.fov=Eo*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Ca*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Eo*2*Math.atan(Math.tan(Ca*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,n,i){js.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(js.x,js.y).multiplyScalar(-t/js.z),js.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(js.x,js.y).multiplyScalar(-t/js.z)}getViewSize(t,n){return this.getViewBounds(t,k0,L0),n.subVectors(L0,k0)}setViewOffset(t,n,i,s,r,a){this.aspect=t/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,n=t*Math.tan(Ca*.5*this.fov)/this.zoom,i=2*n,s=this.aspect*i,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,n-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,n,n-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let n=super.toJSON(t);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}},xo=-90,_o=1,qc=class extends Ye{constructor(t,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new pn(xo,_o,t,n);s.layers=this.layers,this.add(s);let r=new pn(xo,_o,t,n);r.layers=this.layers,this.add(r);let a=new pn(xo,_o,t,n);a.layers=this.layers,this.add(a);let o=new pn(xo,_o,t,n);o.layers=this.layers,this.add(o);let c=new pn(xo,_o,t,n);c.layers=this.layers,this.add(c);let l=new pn(xo,_o,t,n);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,n=this.children.concat(),[i,s,r,a,o,c]=n;for(let l of n)this.remove(l);if(t===Ri)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===La)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of n)this.add(l),l.updateMatrixWorld()}update(t,n){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,u]=this.children,h=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(n,r),t.setRenderTarget(i,1,s),t.render(n,a),t.setRenderTarget(i,2,s),t.render(n,o),t.setRenderTarget(i,3,s),t.render(n,c),t.setRenderTarget(i,4,s),t.render(n,l),i.texture.generateMipmaps=y,t.setRenderTarget(i,5,s),t.render(n,u),t.setRenderTarget(h,f,p),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},Ba=class extends Fn{constructor(t=[],n=Dr,i,s,r,a,o,c,l,u){super(t,n,i,s,r,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Xc=class extends Qi{constructor(t=1,n={}){super(t,t,n),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Ba(s),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new un(5,5,5),r=new Ii({name:"CubemapFromEquirect",uniforms:Ur(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:mn,blending:ws});r.uniforms.tEquirect.value=n;let a=new q(s,r),o=n.minFilter;return n.minFilter===er&&(n.minFilter=Ci),new qc(1,10,this).update(t,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,n=!0,i=!0,s=!0){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(n,i,s);t.setRenderTarget(r)}},Ht=class extends Ye{constructor(){super(),this.isGroup=!0,this.type="Group"}},TS={type:"move"},Co=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ht,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ht,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ht,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let n=this._hand;if(n)for(let i of t.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,n,i){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(t&&n.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(let y of t.hand.values()){let g=n.getJointPose(y,i),d=this._getHandJoint(l,y);g!==null&&(d.matrix.fromArray(g.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=g.radius),d.visible=g!==null}let u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],f=u.position.distanceTo(h.position),p=.02,m=.005;l.inputState.pinching&&f>p+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=p-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=n.getPose(t.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=n.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(TS)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,n){if(t.joints[n.jointName]===void 0){let i=new Ht;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[n.jointName]=i,t.add(i)}return t.joints[n.jointName]}};var kr=class extends Ye{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new pi,this.environmentIntensity=1,this.environmentRotation=new pi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,n){return super.copy(t,n),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let n=super.toJSON(t);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}};var jc=class extends Fn{constructor(t=null,n=1,i=1,s,r,a,o,c,l=$n,u=$n,h,f){super(null,a,o,c,l,u,s,r,h,f),this.isDataTexture=!0,this.image={data:t,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Io=class extends ln{constructor(t,n,i,s=1){super(t,n,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},vo=new pe,D0=new pe,Nc=[],N0=new ts,AS=new pe,Ta=new q,Aa=new Js,Ha=class extends q{constructor(t,n,i){super(t,n),this.isInstancedMesh=!0,this.instanceMatrix=new Io(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,AS)}computeBoundingBox(){let t=this.geometry,n=this.count;this.boundingBox===null&&(this.boundingBox=new ts),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,vo),N0.copy(t.boundingBox).applyMatrix4(vo),this.boundingBox.union(N0)}computeBoundingSphere(){let t=this.geometry,n=this.count;this.boundingSphere===null&&(this.boundingSphere=new Js),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,vo),Aa.copy(t.boundingSphere).applyMatrix4(vo),this.boundingSphere.union(Aa)}copy(t,n){return super.copy(t,n),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,n){n.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,n){n.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,n){let i=n.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,a=t*r+1;for(let o=0;o<i.length;o++)i[o]=s[a+o]}raycast(t,n){let i=this.matrixWorld,s=this.count;if(Ta.geometry=this.geometry,Ta.material=this.material,Ta.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Aa.copy(this.boundingSphere),Aa.applyMatrix4(i),t.ray.intersectsSphere(Aa)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,vo),D0.multiplyMatrices(i,vo),Ta.matrixWorld=D0,Ta.raycast(t,Nc);for(let a=0,o=Nc.length;a<o;a++){let c=Nc[a];c.instanceId=r,c.object=this,n.push(c)}Nc.length=0}}setColorAt(t,n){this.instanceColor===null&&(this.instanceColor=new Io(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),n.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,n){n.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,n){let i=n.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new jc(new Float32Array(s*this.count),s,this.count,Mu,Li));let r=this.morphTexture.source.data.data,a=0;for(let l=0;l<i.length;l++)a+=i[l];let o=this.geometry.morphTargetsRelative?1:1-a,c=s*t;r[c]=o,r.set(i,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Hf=new L,RS=new L,CS=new $t,di=class{constructor(t=new L(1,0,0),n=0){this.isPlane=!0,this.normal=t,this.constant=n}set(t,n){return this.normal.copy(t),this.constant=n,this}setComponents(t,n,i,s){return this.normal.set(t,n,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,n){return this.normal.copy(t),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(t,n,i){let s=Hf.subVectors(i,n).cross(RS.subVectors(t,n)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,n){return n.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,n){let i=t.delta(Hf),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?n.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:n.copy(t.start).addScaledVector(i,r)}intersectsLine(t){let n=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return n<0&&i>0||i<0&&n>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,n){let i=n||CS.getNormalMatrix(t),s=this.coplanarPoint(Hf).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Tr=new Js,IS=new At(.5,.5),Uc=new L,Po=class{constructor(t=new di,n=new di,i=new di,s=new di,r=new di,a=new di){this.planes=[t,n,i,s,r,a]}set(t,n,i,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(n),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let n=this.planes;for(let i=0;i<6;i++)n[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,n=Ri,i=!1){let s=this.planes,r=t.elements,a=r[0],o=r[1],c=r[2],l=r[3],u=r[4],h=r[5],f=r[6],p=r[7],m=r[8],y=r[9],g=r[10],d=r[11],_=r[12],w=r[13],b=r[14],A=r[15];if(s[0].setComponents(l-a,p-u,d-m,A-_).normalize(),s[1].setComponents(l+a,p+u,d+m,A+_).normalize(),s[2].setComponents(l+o,p+h,d+y,A+w).normalize(),s[3].setComponents(l-o,p-h,d-y,A-w).normalize(),i)s[4].setComponents(c,f,g,b).normalize(),s[5].setComponents(l-c,p-f,d-g,A-b).normalize();else if(s[4].setComponents(l-c,p-f,d-g,A-b).normalize(),n===Ri)s[5].setComponents(l+c,p+f,d+g,A+b).normalize();else if(n===La)s[5].setComponents(c,f,g,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Tr.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let n=t.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Tr.copy(n.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Tr)}intersectsSprite(t){Tr.center.set(0,0,0);let n=IS.distanceTo(t.center);return Tr.radius=.7071067811865476+n,Tr.applyMatrix4(t.matrixWorld),this.intersectsSphere(Tr)}intersectsSphere(t){let n=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(n[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let n=this.planes;for(let i=0;i<6;i++){let s=n[i];if(Uc.x=s.normal.x>0?t.max.x:t.min.x,Uc.y=s.normal.y>0?t.max.y:t.min.y,Uc.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Uc)<0)return!1}return!0}containsPoint(t){let n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var es=class extends Fn{constructor(t,n,i,s,r,a,o,c,l){super(t,n,i,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},za=class extends Fn{constructor(t,n,i=nr,s,r,a,o=$n,c=$n,l,u=So,h=1){if(u!==So&&u!==Bo)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:t,height:n,depth:h};super(f,s,r,a,o,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Ao(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let n=super.toJSON(t);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}},$a=class extends Fn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}};var ko=class e extends En{constructor(t=1,n=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:n,thetaStart:i,thetaLength:s},n=Math.max(3,n);let r=[],a=[],o=[],c=[],l=new L,u=new At;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let h=0,f=3;h<=n;h++,f+=3){let p=i+h/n*s;l.x=t*Math.cos(p),l.y=t*Math.sin(p),a.push(l.x,l.y,l.z),o.push(0,0,1),u.x=(a[f]/t+1)/2,u.y=(a[f+1]/t+1)/2,c.push(u.x,u.y)}for(let h=1;h<=n;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new me(a,3)),this.setAttribute("normal",new me(o,3)),this.setAttribute("uv",new me(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},ue=class e extends En{constructor(t=1,n=1,i=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:n,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let u=[],h=[],f=[],p=[],m=0,y=[],g=i/2,d=0;_(),a===!1&&(t>0&&w(!0),n>0&&w(!1)),this.setIndex(u),this.setAttribute("position",new me(h,3)),this.setAttribute("normal",new me(f,3)),this.setAttribute("uv",new me(p,2));function _(){let b=new L,A=new L,S=0,T=(n-t)/i;for(let I=0;I<=r;I++){let x=[],v=I/r,R=v*(n-t)+t;for(let D=0;D<=s;D++){let B=D/s,V=B*c+o,X=Math.sin(V),z=Math.cos(V);A.x=R*X,A.y=-v*i+g,A.z=R*z,h.push(A.x,A.y,A.z),b.set(X,T,z).normalize(),f.push(b.x,b.y,b.z),p.push(B,1-v),x.push(m++)}y.push(x)}for(let I=0;I<s;I++)for(let x=0;x<r;x++){let v=y[x][I],R=y[x+1][I],D=y[x+1][I+1],B=y[x][I+1];(t>0||x!==0)&&(u.push(v,R,B),S+=3),(n>0||x!==r-1)&&(u.push(R,D,B),S+=3)}l.addGroup(d,S,0),d+=S}function w(b){let A=m,S=new At,T=new L,I=0,x=b===!0?t:n,v=b===!0?1:-1;for(let D=1;D<=s;D++)h.push(0,g*v,0),f.push(0,v,0),p.push(.5,.5),m++;let R=m;for(let D=0;D<=s;D++){let V=D/s*c+o,X=Math.cos(V),z=Math.sin(V);T.x=x*z,T.y=g*v,T.z=x*X,h.push(T.x,T.y,T.z),f.push(0,v,0),S.x=X*.5+.5,S.y=z*.5*v+.5,p.push(S.x,S.y),m++}for(let D=0;D<s;D++){let B=A+D,V=R+D;b===!0?u.push(V,V+1,B):u.push(V+1,V,B),I+=3}l.addGroup(d,I,b===!0?1:2),d+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Va=class e extends ue{constructor(t=1,n=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,n,i,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:n,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ga=class e extends En{constructor(t=[],n=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:n,radius:i,detail:s};let r=[],a=[];o(s),l(i),u(),this.setAttribute("position",new me(r,3)),this.setAttribute("normal",new me(r.slice(),3)),this.setAttribute("uv",new me(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(_){let w=new L,b=new L,A=new L;for(let S=0;S<n.length;S+=3)p(n[S+0],w),p(n[S+1],b),p(n[S+2],A),c(w,b,A,_)}function c(_,w,b,A){let S=A+1,T=[];for(let I=0;I<=S;I++){T[I]=[];let x=_.clone().lerp(b,I/S),v=w.clone().lerp(b,I/S),R=S-I;for(let D=0;D<=R;D++)D===0&&I===S?T[I][D]=x:T[I][D]=x.clone().lerp(v,D/R)}for(let I=0;I<S;I++)for(let x=0;x<2*(S-I)-1;x++){let v=Math.floor(x/2);x%2===0?(f(T[I][v+1]),f(T[I+1][v]),f(T[I][v])):(f(T[I][v+1]),f(T[I+1][v+1]),f(T[I+1][v]))}}function l(_){let w=new L;for(let b=0;b<r.length;b+=3)w.x=r[b+0],w.y=r[b+1],w.z=r[b+2],w.normalize().multiplyScalar(_),r[b+0]=w.x,r[b+1]=w.y,r[b+2]=w.z}function u(){let _=new L;for(let w=0;w<r.length;w+=3){_.x=r[w+0],_.y=r[w+1],_.z=r[w+2];let b=g(_)/2/Math.PI+.5,A=d(_)/Math.PI+.5;a.push(b,1-A)}m(),h()}function h(){for(let _=0;_<a.length;_+=6){let w=a[_+0],b=a[_+2],A=a[_+4],S=Math.max(w,b,A),T=Math.min(w,b,A);S>.9&&T<.1&&(w<.2&&(a[_+0]+=1),b<.2&&(a[_+2]+=1),A<.2&&(a[_+4]+=1))}}function f(_){r.push(_.x,_.y,_.z)}function p(_,w){let b=_*3;w.x=t[b+0],w.y=t[b+1],w.z=t[b+2]}function m(){let _=new L,w=new L,b=new L,A=new L,S=new At,T=new At,I=new At;for(let x=0,v=0;x<r.length;x+=9,v+=6){_.set(r[x+0],r[x+1],r[x+2]),w.set(r[x+3],r[x+4],r[x+5]),b.set(r[x+6],r[x+7],r[x+8]),S.set(a[v+0],a[v+1]),T.set(a[v+2],a[v+3]),I.set(a[v+4],a[v+5]),A.copy(_).add(w).add(b).divideScalar(3);let R=g(A);y(S,v+0,_,R),y(T,v+2,w,R),y(I,v+4,b,R)}}function y(_,w,b,A){A<0&&_.x===1&&(a[w]=_.x-1),b.x===0&&b.z===0&&(a[w]=A/2/Math.PI+.5)}function g(_){return Math.atan2(_.z,-_.x)}function d(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.details)}};var Wa=class e extends Ga{constructor(t=1,n=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,n),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:n}}static fromJSON(t){return new e(t.radius,t.detail)}};var qa=class e extends Ga{constructor(t=1,n=0){let i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,t,n),this.type="OctahedronGeometry",this.parameters={radius:t,detail:n}}static fromJSON(t){return new e(t.radius,t.detail)}},Tn=class e extends En{constructor(t=1,n=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:n,widthSegments:i,heightSegments:s};let r=t/2,a=n/2,o=Math.floor(i),c=Math.floor(s),l=o+1,u=c+1,h=t/o,f=n/c,p=[],m=[],y=[],g=[];for(let d=0;d<u;d++){let _=d*f-a;for(let w=0;w<l;w++){let b=w*h-r;m.push(b,-_,0),y.push(0,0,1),g.push(w/o),g.push(1-d/c)}}for(let d=0;d<c;d++)for(let _=0;_<o;_++){let w=_+l*d,b=_+l*(d+1),A=_+1+l*(d+1),S=_+1+l*d;p.push(w,b,S),p.push(b,A,S)}this.setIndex(p),this.setAttribute("position",new me(m,3)),this.setAttribute("normal",new me(y,3)),this.setAttribute("uv",new me(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Xa=class e extends En{constructor(t=.5,n=1,i=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:n,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);let o=[],c=[],l=[],u=[],h=t,f=(n-t)/s,p=new L,m=new At;for(let y=0;y<=s;y++){for(let g=0;g<=i;g++){let d=r+g/i*a;p.x=h*Math.cos(d),p.y=h*Math.sin(d),c.push(p.x,p.y,p.z),l.push(0,0,1),m.x=(p.x/n+1)/2,m.y=(p.y/n+1)/2,u.push(m.x,m.y)}h+=f}for(let y=0;y<s;y++){let g=y*(i+1);for(let d=0;d<i;d++){let _=d+g,w=_,b=_+i+1,A=_+i+2,S=_+1;o.push(w,b,S),o.push(b,A,S)}}this.setIndex(o),this.setAttribute("position",new me(c,3)),this.setAttribute("normal",new me(l,3)),this.setAttribute("uv",new me(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}};var Vn=class e extends En{constructor(t=1,n=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:n,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));let c=Math.min(a+o,Math.PI),l=0,u=[],h=new L,f=new L,p=[],m=[],y=[],g=[];for(let d=0;d<=i;d++){let _=[],w=d/i,b=0;d===0&&a===0?b=.5/n:d===i&&c===Math.PI&&(b=-.5/n);for(let A=0;A<=n;A++){let S=A/n;h.x=-t*Math.cos(s+S*r)*Math.sin(a+w*o),h.y=t*Math.cos(a+w*o),h.z=t*Math.sin(s+S*r)*Math.sin(a+w*o),m.push(h.x,h.y,h.z),f.copy(h).normalize(),y.push(f.x,f.y,f.z),g.push(S+b,1-w),_.push(l++)}u.push(_)}for(let d=0;d<i;d++)for(let _=0;_<n;_++){let w=u[d][_+1],b=u[d][_],A=u[d+1][_],S=u[d+1][_+1];(d!==0||a>0)&&p.push(w,b,S),(d!==i-1||c<Math.PI)&&p.push(b,A,S)}this.setIndex(p),this.setAttribute("position",new me(m,3)),this.setAttribute("normal",new me(y,3)),this.setAttribute("uv",new me(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var ja=class e extends En{constructor(t=1,n=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:n,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);let a=[],o=[],c=[],l=[],u=new L,h=new L,f=new L;for(let p=0;p<=i;p++)for(let m=0;m<=s;m++){let y=m/s*r,g=p/i*Math.PI*2;h.x=(t+n*Math.cos(g))*Math.cos(y),h.y=(t+n*Math.cos(g))*Math.sin(y),h.z=n*Math.sin(g),o.push(h.x,h.y,h.z),u.x=t*Math.cos(y),u.y=t*Math.sin(y),f.subVectors(h,u).normalize(),c.push(f.x,f.y,f.z),l.push(m/s),l.push(p/i)}for(let p=1;p<=i;p++)for(let m=1;m<=s;m++){let y=(s+1)*p+m-1,g=(s+1)*(p-1)+m-1,d=(s+1)*(p-1)+m,_=(s+1)*p+m;a.push(y,g,_),a.push(g,d,_)}this.setIndex(a),this.setAttribute("position",new me(o,3)),this.setAttribute("normal",new me(c,3)),this.setAttribute("uv",new me(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var _e=class extends bs{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Gt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Gt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=eh,this.normalScale=new At(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var Ya=class extends bs{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Gt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Gt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=eh,this.normalScale=new At(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pi,this.combine=gu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Yc=class extends bs{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=yy,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Kc=class extends bs{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Oc(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT=="number"?new t(e):Array.prototype.slice.call(e)}function PS(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}var Lr=class{constructor(t,n,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new n.constructor(i),this.sampleValues=n,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let n=this.parameterPositions,i=this._cachedIndex,s=n[i],r=n[i-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=i+2;;){if(s===void 0){if(t<r)break i;return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=s,s=n[++i],t<s)break t}a=n.length;break e}if(!(t>=r)){let o=n[1];t<o&&(i=2,r=o);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=n[--i-1],t>=r)break t}a=i,i=0;break e}break n}for(;i<a;){let o=i+a>>>1;t<n[o]?a=o:i=o+1}if(s=n[i],r=n[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let n=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)n[a]=i[r+a];return n}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Zc=class extends Lr{constructor(t,n,i,s){super(t,n,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Vf,endingEnd:Vf}}intervalChanged_(t,n,i){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Gf:r=t,o=2*n-i;break;case Wf:r=s.length-2,o=n+s[r]-s[r+1];break;default:r=t,o=i}if(c===void 0)switch(this.getSettings_().endingEnd){case Gf:a=t,c=2*i-n;break;case Wf:a=1,c=i+s[1]-s[0];break;default:a=t-1,c=n}let l=(i-n)*.5,u=this.valueSize;this._weightPrev=l/(n-o),this._weightNext=l/(c-i),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(t,n,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,u=this._offsetPrev,h=this._offsetNext,f=this._weightPrev,p=this._weightNext,m=(i-n)/(s-n),y=m*m,g=y*m,d=-f*g+2*f*y-f*m,_=(1+f)*g+(-1.5-2*f)*y+(-.5+f)*m+1,w=(-1-p)*g+(1.5+p)*y+.5*m,b=p*g-p*y;for(let A=0;A!==o;++A)r[A]=d*a[u+A]+_*a[l+A]+w*a[c+A]+b*a[h+A];return r}},Jc=class extends Lr{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t,n,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,u=(i-n)/(s-n),h=1-u;for(let f=0;f!==o;++f)r[f]=a[l+f]*h+a[c+f]*u;return r}},Qc=class extends Lr{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Qn=class{constructor(t,n,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(n===void 0||n.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Oc(n,this.TimeBufferType),this.values=Oc(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let n=t.constructor,i;if(n.toJSON!==this.toJSON)i=n.toJSON(t);else{i={name:t.name,times:Oc(t.times,Array),values:Oc(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s)}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new Qc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Jc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Zc(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let n;switch(t){case Pa:n=this.InterpolantFactoryMethodDiscrete;break;case $c:n=this.InterpolantFactoryMethodLinear;break;case Fc:n=this.InterpolantFactoryMethodSmooth;break}if(n===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=n,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Pa;case this.InterpolantFactoryMethodLinear:return $c;case this.InterpolantFactoryMethodSmooth:return Fc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let n=this.times;for(let i=0,s=n.length;i!==s;++i)n[i]+=t}return this}scale(t){if(t!==1){let n=this.times;for(let i=0,s=n.length;i!==s;++i)n[i]*=t}return this}trim(t,n){let i=this.times,s=i.length,r=0,a=s-1;for(;r!==s&&i[r]<t;)++r;for(;a!==-1&&i[a]>n;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,n=this.getValueSize();n-Math.floor(n)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let c=i[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),t=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),t=!1;break}a=c}if(s!==void 0&&PS(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),n=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Fc,r=t.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=t[o],u=t[o+1];if(l!==u&&(o!==1||l!==t[0]))if(s)c=!0;else{let h=o*i,f=h-i,p=h+i;for(let m=0;m!==i;++m){let y=n[h+m];if(y!==n[f+m]||y!==n[p+m]){c=!0;break}}}if(c){if(o!==a){t[a]=t[o];let h=o*i,f=a*i;for(let p=0;p!==i;++p)n[f+p]=n[h+p]}++a}}if(r>0){t[a]=t[r];for(let o=r*i,c=a*i,l=0;l!==i;++l)n[c+l]=n[o+l];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=n.slice(0,a*i)):(this.times=t,this.values=n),this}clone(){let t=this.times.slice(),n=this.values.slice(),i=this.constructor,s=new i(this.name,t,n);return s.createInterpolant=this.createInterpolant,s}};Qn.prototype.ValueTypeName="";Qn.prototype.TimeBufferType=Float32Array;Qn.prototype.ValueBufferType=Float32Array;Qn.prototype.DefaultInterpolation=$c;var Qs=class extends Qn{constructor(t,n,i){super(t,n,i)}};Qs.prototype.ValueTypeName="bool";Qs.prototype.ValueBufferType=Array;Qs.prototype.DefaultInterpolation=Pa;Qs.prototype.InterpolantFactoryMethodLinear=void 0;Qs.prototype.InterpolantFactoryMethodSmooth=void 0;var tu=class extends Qn{constructor(t,n,i,s){super(t,n,i,s)}};tu.prototype.ValueTypeName="color";var eu=class extends Qn{constructor(t,n,i,s){super(t,n,i,s)}};eu.prototype.ValueTypeName="number";var nu=class extends Lr{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t,n,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(i-n)/(s-n),l=t*o;for(let u=l+o;l!==u;l+=4)fi.slerpFlat(r,0,a,l-o,a,l,c);return r}},Ka=class extends Qn{constructor(t,n,i,s){super(t,n,i,s)}InterpolantFactoryMethodLinear(t){return new nu(this.times,this.values,this.getValueSize(),t)}};Ka.prototype.ValueTypeName="quaternion";Ka.prototype.InterpolantFactoryMethodSmooth=void 0;var tr=class extends Qn{constructor(t,n,i){super(t,n,i)}};tr.prototype.ValueTypeName="string";tr.prototype.ValueBufferType=Array;tr.prototype.DefaultInterpolation=Pa;tr.prototype.InterpolantFactoryMethodLinear=void 0;tr.prototype.InterpolantFactoryMethodSmooth=void 0;var iu=class extends Qn{constructor(t,n,i,s){super(t,n,i,s)}};iu.prototype.ValueTypeName="vector";var su=class{constructor(t,n,i){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=n,this.onError=i,this.abortController=new AbortController,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,h){return l.push(u,h),this},this.removeHandler=function(u){let h=l.indexOf(u);return h!==-1&&l.splice(h,2),this},this.getHandler=function(u){for(let h=0,f=l.length;h<f;h+=2){let p=l[h],m=l[h+1];if(p.global&&(p.lastIndex=0),p.test(u))return m}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Py=new su,ru=class{constructor(t){this.manager=t!==void 0?t:Py,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,n){let i=this;return new Promise(function(s,r){i.load(t,s,n,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};ru.DEFAULT_MATERIAL_NAME="__DEFAULT";var Lo=class extends Ye{constructor(t,n=1){super(),this.isLight=!0,this.type="Light",this.color=new Gt(t),this.intensity=n}dispose(){}copy(t,n){return super.copy(t,n),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let n=super.toJSON(t);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}},Za=class extends Lo{constructor(t,n,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ye.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Gt(n)}copy(t,n){return super.copy(t,n),this.groundColor.copy(t.groundColor),this}},zf=new pe,U0=new L,O0=new L,ou=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new At(512,512),this.mapType=ki,this.map=null,this.mapPass=null,this.matrix=new pe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Po,this._frameExtents=new At(1,1),this._viewportCount=1,this._viewports=[new de(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let n=this.camera,i=this.matrix;U0.setFromMatrixPosition(t.matrixWorld),n.position.copy(U0),O0.setFromMatrixPosition(t.target.matrixWorld),n.lookAt(O0),n.updateMatrixWorld(),zf.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zf,n.coordinateSystem,n.reversedDepth),n.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(zf)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var F0=new pe,Ra=new L,$f=new L,jf=class extends ou{constructor(){super(new pn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new At(4,2),this._viewportCount=6,this._viewports=[new de(2,1,1,1),new de(0,1,1,1),new de(3,1,1,1),new de(1,1,1,1),new de(3,0,1,1),new de(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(t,n=0){let i=this.camera,s=this.matrix,r=t.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),Ra.setFromMatrixPosition(t.matrixWorld),i.position.copy(Ra),$f.copy(i.position),$f.add(this._cubeDirections[n]),i.up.copy(this._cubeUps[n]),i.lookAt($f),i.updateMatrixWorld(),s.makeTranslation(-Ra.x,-Ra.y,-Ra.z),F0.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(F0,i.coordinateSystem,i.reversedDepth)}},Ja=class extends Lo{constructor(t,n,i=0,s=2){super(t,n),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new jf}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,n){return super.copy(t,n),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},Qa=class extends Fa{constructor(t=-1,n=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=n,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,n){return super.copy(t,n),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,n,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-t,a=i+t,o=s+n,c=s-n;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let n=super.toJSON(t);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}},Yf=class extends ou{constructor(){super(new Qa(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},tl=class extends Lo{constructor(t,n){super(t,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ye.DEFAULT_UP),this.updateMatrix(),this.target=new Ye,this.shadow=new Yf}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var au=class extends pn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var gp="\\[\\]\\.:\\/",kS=new RegExp("["+gp+"]","g"),yp="[^"+gp+"]",LS="[^"+gp.replace("\\.","")+"]",DS=/((?:WC+[\/:])*)/.source.replace("WC",yp),NS=/(WCOD+)?/.source.replace("WCOD",LS),US=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",yp),OS=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",yp),FS=new RegExp("^"+DS+NS+US+OS+"$"),BS=["material","materials","bones","map"],Kf=class{constructor(t,n,i){let s=i||Le.parseTrackName(n);this._targetGroup=t,this._bindings=t.subscribe_(n,s)}getValue(t,n){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,n)}setValue(t,n){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(t,n)}bind(){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=t.length;n!==i;++n)t[n].bind()}unbind(){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=t.length;n!==i;++n)t[n].unbind()}},Le=class e{constructor(t,n,i){this.path=n,this.parsedPath=i||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,i){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,i):new e(t,n,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(kS,"")}static parseTrackName(t){let n=FS.exec(t);if(n===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:n[2],objectName:n[3],objectIndex:n[4],propertyName:n[5],propertyIndex:n[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);BS.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,n){if(n===void 0||n===""||n==="."||n===-1||n===t.name||n===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(n);if(i!==void 0)return i}if(t.children){let i=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===n||o.uuid===n)return o;let c=i(o.children);if(c)return c}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,n){t[n]=this.targetObject[this.propertyName]}_getValue_array(t,n){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)t[n++]=i[s]}_getValue_arrayElement(t,n){t[n]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,n){this.resolvedProperty.toArray(t,n)}_setValue_direct(t,n){this.targetObject[this.propertyName]=t[n]}_setValue_direct_setNeedsUpdate(t,n){this.targetObject[this.propertyName]=t[n],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,n){this.targetObject[this.propertyName]=t[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,n){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[n++]}_setValue_array_setNeedsUpdate(t,n){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[n++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,n){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[n++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,n){this.resolvedProperty[this.propertyIndex]=t[n]}_setValue_arrayElement_setNeedsUpdate(t,n){this.resolvedProperty[this.propertyIndex]=t[n],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,n){this.resolvedProperty[this.propertyIndex]=t[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,n){this.resolvedProperty.fromArray(t,n)}_setValue_fromArray_setNeedsUpdate(t,n){this.resolvedProperty.fromArray(t,n),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,n){this.resolvedProperty.fromArray(t,n),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,n){this.bind(),this.getValue(t,n)}_setValue_unbound(t,n){this.bind(),this.setValue(t,n)}bind(){let t=this.node,n=this.parsedPath,i=n.objectName,s=n.propertyName,r=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let l=n.objectIndex;switch(i){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===l){l=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let a=t[s];if(a===void 0){let l=n.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Le.Composite=Kf;Le.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Le.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Le.prototype.GetterByBindingType=[Le.prototype._getValue_direct,Le.prototype._getValue_array,Le.prototype._getValue_arrayElement,Le.prototype._getValue_toArray];Le.prototype.SetterByBindingTypeAndVersioning=[[Le.prototype._setValue_direct,Le.prototype._setValue_direct_setNeedsUpdate,Le.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Le.prototype._setValue_array,Le.prototype._setValue_array_setNeedsUpdate,Le.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Le.prototype._setValue_arrayElement,Le.prototype._setValue_arrayElement_setNeedsUpdate,Le.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Le.prototype._setValue_fromArray,Le.prototype._setValue_fromArray_setNeedsUpdate,Le.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Ak=new Float32Array(1);var B0=new pe,Do=class{constructor(t,n,i=0,s=1/0){this.ray=new Pr(t,n),this.near=i,this.far=s,this.camera=null,this.layers=new Ro,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,n){this.ray.set(t,n)}setFromCamera(t,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(n.near+n.far)/(n.near-n.far)).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):console.error("THREE.Raycaster: Unsupported camera type: "+n.type)}setFromXRController(t){return B0.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(B0),this}intersectObject(t,n=!0,i=[]){return Zf(t,this,i,n),i.sort(H0),i}intersectObjects(t,n=!0,i=[]){for(let s=0,r=t.length;s<r;s++)Zf(t[s],this,i,n);return i.sort(H0),i}};function H0(e,t){return e.distance-t.distance}function Zf(e,t,n,i){let s=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(s=!1),s===!0&&i===!0){let r=e.children;for(let a=0,o=r.length;a<o;a++)Zf(r[a],t,n,!0)}}var No=class{constructor(t=1,n=0,i=0){this.radius=t,this.phi=n,this.theta=i}set(t,n,i){return this.radius=t,this.phi=n,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Yt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,n,i){return this.radius=Math.sqrt(t*t+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(Yt(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var el=class extends Ji{constructor(t,n=null){super(),this.object=t,this.domElement=n,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function xp(e,t,n,i){let s=HS(i);switch(n){case lp:return e*t;case Mu:return e*t/s.components*s.byteLength;case Su:return e*t/s.components*s.byteLength;case up:return e*t*2/s.components*s.byteLength;case Eu:return e*t*2/s.components*s.byteLength;case cp:return e*t*3/s.components*s.byteLength;case gi:return e*t*4/s.components*s.byteLength;case Tu:return e*t*4/s.components*s.byteLength;case sl:case rl:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ol:case al:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Ru:case Iu:return Math.max(e,16)*Math.max(t,8)/4;case Au:case Cu:return Math.max(e,8)*Math.max(t,8)/2;case Pu:case ku:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Lu:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Du:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Nu:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Uu:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Ou:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Fu:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Bu:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Hu:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case zu:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case $u:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Vu:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Gu:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Wu:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case qu:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Xu:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case ju:case Yu:case Ku:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Zu:case Ju:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Qu:case th:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function HS(e){switch(e){case ki:case sp:return{byteLength:1,components:1};case Uo:case rp:case Oo:return{byteLength:2,components:1};case bu:case wu:return{byteLength:2,components:4};case nr:case vu:case Li:return{byteLength:4,components:1};case op:case ap:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function ex(){let e=null,t=!1,n=null,i=null;function s(r,a){n(r,a),i=e.requestAnimationFrame(s)}return{start:function(){t!==!0&&n!==null&&(i=e.requestAnimationFrame(s),t=!0)},stop:function(){e.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){n=r},setContext:function(r){e=r}}}function XS(e){let t=new WeakMap;function n(o,c){let l=o.array,u=o.usage,h=l.byteLength,f=e.createBuffer();e.bindBuffer(c,f),e.bufferData(c,l,u),o.onUploadCallback();let p;if(l instanceof Float32Array)p=e.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=e.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?p=e.HALF_FLOAT:p=e.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=e.SHORT;else if(l instanceof Uint32Array)p=e.UNSIGNED_INT;else if(l instanceof Int32Array)p=e.INT;else if(l instanceof Int8Array)p=e.BYTE;else if(l instanceof Uint8Array)p=e.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,c,l){let u=c.array,h=c.updateRanges;if(e.bindBuffer(l,o),h.length===0)e.bufferSubData(l,0,u);else{h.sort((p,m)=>p.start-m.start);let f=0;for(let p=1;p<h.length;p++){let m=h[f],y=h[p];y.start<=m.start+m.count+1?m.count=Math.max(m.count,y.start+y.count-m.start):(++f,h[f]=y)}h.length=f+1;for(let p=0,m=h.length;p<m;p++){let y=h[p];e.bufferSubData(l,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=t.get(o);c&&(e.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=t.get(o);if(l===void 0)t.set(o,n(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var jS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,YS=`#ifdef USE_ALPHAHASH
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
#endif`,KS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ZS=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,JS=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,QS=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,tE=`#ifdef USE_AOMAP
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
#endif`,eE=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,nE=`#ifdef USE_BATCHING
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
#endif`,iE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,sE=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,rE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,oE=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,aE=`#ifdef USE_IRIDESCENCE
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
#endif`,lE=`#ifdef USE_BUMPMAP
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
#endif`,cE=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,uE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,hE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,dE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,fE=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,pE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,mE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,gE=`#if defined( USE_COLOR_ALPHA )
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
#endif`,yE=`#define PI 3.141592653589793
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
} // validated`,xE=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,_E=`vec3 transformedNormal = objectNormal;
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
#endif`,vE=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,bE=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,wE=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ME=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,SE="gl_FragColor = linearToOutputTexel( gl_FragColor );",EE=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,TE=`#ifdef USE_ENVMAP
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
#endif`,AE=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,RE=`#ifdef USE_ENVMAP
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
#endif`,CE=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,IE=`#ifdef USE_ENVMAP
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
#endif`,PE=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,kE=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,LE=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,DE=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,NE=`#ifdef USE_GRADIENTMAP
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
}`,UE=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,OE=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,FE=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,BE=`uniform bool receiveShadow;
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
#endif`,HE=`#ifdef USE_ENVMAP
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
#endif`,zE=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,$E=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,VE=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,GE=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,WE=`PhysicalMaterial material;
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
#endif`,qE=`struct PhysicalMaterial {
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
}`,XE=`
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
#endif`,jE=`#if defined( RE_IndirectDiffuse )
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
#endif`,YE=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,KE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ZE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,JE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,QE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,t1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,e1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,n1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,i1=`#if defined( USE_POINTS_UV )
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
#endif`,s1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,r1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,o1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,a1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,l1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,c1=`#ifdef USE_MORPHTARGETS
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
#endif`,u1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,h1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,d1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,f1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,p1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,m1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,g1=`#ifdef USE_NORMALMAP
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
#endif`,y1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,x1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,_1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,v1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,b1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,w1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,M1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,S1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,E1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,T1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,A1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,R1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,C1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,I1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,P1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,k1=`float getShadowMask() {
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
}`,L1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,D1=`#ifdef USE_SKINNING
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
#endif`,N1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,U1=`#ifdef USE_SKINNING
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
#endif`,O1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,F1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,B1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,H1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,z1=`#ifdef USE_TRANSMISSION
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
#endif`,$1=`#ifdef USE_TRANSMISSION
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
#endif`,V1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,G1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,W1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,q1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,X1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,j1=`uniform sampler2D t2D;
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
}`,Y1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,K1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Z1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,J1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Q1=`#include <common>
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
}`,tT=`#if DEPTH_PACKING == 3200
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
}`,eT=`#define DISTANCE
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
}`,nT=`#define DISTANCE
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
}`,iT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,sT=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rT=`uniform float scale;
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
}`,oT=`uniform vec3 diffuse;
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
}`,aT=`#include <common>
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
}`,lT=`uniform vec3 diffuse;
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
}`,cT=`#define LAMBERT
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
}`,uT=`#define LAMBERT
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
}`,hT=`#define MATCAP
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
}`,dT=`#define MATCAP
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
}`,fT=`#define NORMAL
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
}`,pT=`#define NORMAL
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
}`,mT=`#define PHONG
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
}`,gT=`#define PHONG
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
}`,yT=`#define STANDARD
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
}`,xT=`#define STANDARD
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
}`,_T=`#define TOON
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
}`,vT=`#define TOON
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
}`,bT=`uniform float size;
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
}`,wT=`uniform vec3 diffuse;
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
}`,MT=`#include <common>
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
}`,ST=`uniform vec3 color;
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
}`,ET=`uniform float rotation;
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
}`,TT=`uniform vec3 diffuse;
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
}`,jt={alphahash_fragment:jS,alphahash_pars_fragment:YS,alphamap_fragment:KS,alphamap_pars_fragment:ZS,alphatest_fragment:JS,alphatest_pars_fragment:QS,aomap_fragment:tE,aomap_pars_fragment:eE,batching_pars_vertex:nE,batching_vertex:iE,begin_vertex:sE,beginnormal_vertex:rE,bsdfs:oE,iridescence_fragment:aE,bumpmap_pars_fragment:lE,clipping_planes_fragment:cE,clipping_planes_pars_fragment:uE,clipping_planes_pars_vertex:hE,clipping_planes_vertex:dE,color_fragment:fE,color_pars_fragment:pE,color_pars_vertex:mE,color_vertex:gE,common:yE,cube_uv_reflection_fragment:xE,defaultnormal_vertex:_E,displacementmap_pars_vertex:vE,displacementmap_vertex:bE,emissivemap_fragment:wE,emissivemap_pars_fragment:ME,colorspace_fragment:SE,colorspace_pars_fragment:EE,envmap_fragment:TE,envmap_common_pars_fragment:AE,envmap_pars_fragment:RE,envmap_pars_vertex:CE,envmap_physical_pars_fragment:HE,envmap_vertex:IE,fog_vertex:PE,fog_pars_vertex:kE,fog_fragment:LE,fog_pars_fragment:DE,gradientmap_pars_fragment:NE,lightmap_pars_fragment:UE,lights_lambert_fragment:OE,lights_lambert_pars_fragment:FE,lights_pars_begin:BE,lights_toon_fragment:zE,lights_toon_pars_fragment:$E,lights_phong_fragment:VE,lights_phong_pars_fragment:GE,lights_physical_fragment:WE,lights_physical_pars_fragment:qE,lights_fragment_begin:XE,lights_fragment_maps:jE,lights_fragment_end:YE,logdepthbuf_fragment:KE,logdepthbuf_pars_fragment:ZE,logdepthbuf_pars_vertex:JE,logdepthbuf_vertex:QE,map_fragment:t1,map_pars_fragment:e1,map_particle_fragment:n1,map_particle_pars_fragment:i1,metalnessmap_fragment:s1,metalnessmap_pars_fragment:r1,morphinstance_vertex:o1,morphcolor_vertex:a1,morphnormal_vertex:l1,morphtarget_pars_vertex:c1,morphtarget_vertex:u1,normal_fragment_begin:h1,normal_fragment_maps:d1,normal_pars_fragment:f1,normal_pars_vertex:p1,normal_vertex:m1,normalmap_pars_fragment:g1,clearcoat_normal_fragment_begin:y1,clearcoat_normal_fragment_maps:x1,clearcoat_pars_fragment:_1,iridescence_pars_fragment:v1,opaque_fragment:b1,packing:w1,premultiplied_alpha_fragment:M1,project_vertex:S1,dithering_fragment:E1,dithering_pars_fragment:T1,roughnessmap_fragment:A1,roughnessmap_pars_fragment:R1,shadowmap_pars_fragment:C1,shadowmap_pars_vertex:I1,shadowmap_vertex:P1,shadowmask_pars_fragment:k1,skinbase_vertex:L1,skinning_pars_vertex:D1,skinning_vertex:N1,skinnormal_vertex:U1,specularmap_fragment:O1,specularmap_pars_fragment:F1,tonemapping_fragment:B1,tonemapping_pars_fragment:H1,transmission_fragment:z1,transmission_pars_fragment:$1,uv_pars_fragment:V1,uv_pars_vertex:G1,uv_vertex:W1,worldpos_vertex:q1,background_vert:X1,background_frag:j1,backgroundCube_vert:Y1,backgroundCube_frag:K1,cube_vert:Z1,cube_frag:J1,depth_vert:Q1,depth_frag:tT,distanceRGBA_vert:eT,distanceRGBA_frag:nT,equirect_vert:iT,equirect_frag:sT,linedashed_vert:rT,linedashed_frag:oT,meshbasic_vert:aT,meshbasic_frag:lT,meshlambert_vert:cT,meshlambert_frag:uT,meshmatcap_vert:hT,meshmatcap_frag:dT,meshnormal_vert:fT,meshnormal_frag:pT,meshphong_vert:mT,meshphong_frag:gT,meshphysical_vert:yT,meshphysical_frag:xT,meshtoon_vert:_T,meshtoon_frag:vT,points_vert:bT,points_frag:wT,shadow_vert:MT,shadow_frag:ST,sprite_vert:ET,sprite_frag:TT},dt={common:{diffuse:{value:new Gt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $t}},envmap:{envMap:{value:null},envMapRotation:{value:new $t},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $t}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $t}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $t},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $t},normalScale:{value:new At(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $t},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $t}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $t}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $t}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Gt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Gt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0},uvTransform:{value:new $t}},sprite:{diffuse:{value:new Gt(16777215)},opacity:{value:1},center:{value:new At(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}}},is={basic:{uniforms:An([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.fog]),vertexShader:jt.meshbasic_vert,fragmentShader:jt.meshbasic_frag},lambert:{uniforms:An([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new Gt(0)}}]),vertexShader:jt.meshlambert_vert,fragmentShader:jt.meshlambert_frag},phong:{uniforms:An([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new Gt(0)},specular:{value:new Gt(1118481)},shininess:{value:30}}]),vertexShader:jt.meshphong_vert,fragmentShader:jt.meshphong_frag},standard:{uniforms:An([dt.common,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.roughnessmap,dt.metalnessmap,dt.fog,dt.lights,{emissive:{value:new Gt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag},toon:{uniforms:An([dt.common,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.gradientmap,dt.fog,dt.lights,{emissive:{value:new Gt(0)}}]),vertexShader:jt.meshtoon_vert,fragmentShader:jt.meshtoon_frag},matcap:{uniforms:An([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,{matcap:{value:null}}]),vertexShader:jt.meshmatcap_vert,fragmentShader:jt.meshmatcap_frag},points:{uniforms:An([dt.points,dt.fog]),vertexShader:jt.points_vert,fragmentShader:jt.points_frag},dashed:{uniforms:An([dt.common,dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:jt.linedashed_vert,fragmentShader:jt.linedashed_frag},depth:{uniforms:An([dt.common,dt.displacementmap]),vertexShader:jt.depth_vert,fragmentShader:jt.depth_frag},normal:{uniforms:An([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,{opacity:{value:1}}]),vertexShader:jt.meshnormal_vert,fragmentShader:jt.meshnormal_frag},sprite:{uniforms:An([dt.sprite,dt.fog]),vertexShader:jt.sprite_vert,fragmentShader:jt.sprite_frag},background:{uniforms:{uvTransform:{value:new $t},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:jt.background_vert,fragmentShader:jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $t}},vertexShader:jt.backgroundCube_vert,fragmentShader:jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:jt.cube_vert,fragmentShader:jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:jt.equirect_vert,fragmentShader:jt.equirect_frag},distanceRGBA:{uniforms:An([dt.common,dt.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:jt.distanceRGBA_vert,fragmentShader:jt.distanceRGBA_frag},shadow:{uniforms:An([dt.lights,dt.fog,{color:{value:new Gt(0)},opacity:{value:1}}]),vertexShader:jt.shadow_vert,fragmentShader:jt.shadow_frag}};is.physical={uniforms:An([is.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $t},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $t},clearcoatNormalScale:{value:new At(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $t},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $t},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $t},sheen:{value:0},sheenColor:{value:new Gt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $t},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $t},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $t},transmissionSamplerSize:{value:new At},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $t},attenuationDistance:{value:0},attenuationColor:{value:new Gt(0)},specularColor:{value:new Gt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $t},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $t},anisotropyVector:{value:new At},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $t}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag};var nh={r:0,b:0,g:0},Or=new pi,AT=new pe;function RT(e,t,n,i,s,r,a){let o=new Gt(0),c=r===!0?0:1,l,u,h=null,f=0,p=null;function m(w){let b=w.isScene===!0?w.background:null;return b&&b.isTexture&&(b=(w.backgroundBlurriness>0?n:t).get(b)),b}function y(w){let b=!1,A=m(w);A===null?d(o,c):A&&A.isColor&&(d(A,1),b=!0);let S=e.xr.getEnvironmentBlendMode();S==="additive"?i.buffers.color.setClear(0,0,0,1,a):S==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(e.autoClear||b)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function g(w,b){let A=m(b);A&&(A.isCubeTexture||A.mapping===nl)?(u===void 0&&(u=new q(new un(1,1,1),new Ii({name:"BackgroundCubeMaterial",uniforms:Ur(is.backgroundCube.uniforms),vertexShader:is.backgroundCube.vertexShader,fragmentShader:is.backgroundCube.fragmentShader,side:mn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(S,T,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Or.copy(b.backgroundRotation),Or.x*=-1,Or.y*=-1,Or.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(Or.y*=-1,Or.z*=-1),u.material.uniforms.envMap.value=A,u.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(AT.makeRotationFromEuler(Or)),u.material.toneMapped=ne.getTransfer(A.colorSpace)!==fe,(h!==A||f!==A.version||p!==e.toneMapping)&&(u.material.needsUpdate=!0,h=A,f=A.version,p=e.toneMapping),u.layers.enableAll(),w.unshift(u,u.geometry,u.material,0,0,null)):A&&A.isTexture&&(l===void 0&&(l=new q(new Tn(2,2),new Ii({name:"BackgroundMaterial",uniforms:Ur(is.background.uniforms),vertexShader:is.background.vertexShader,fragmentShader:is.background.fragmentShader,side:vs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=A,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=ne.getTransfer(A.colorSpace)!==fe,A.matrixAutoUpdate===!0&&A.updateMatrix(),l.material.uniforms.uvTransform.value.copy(A.matrix),(h!==A||f!==A.version||p!==e.toneMapping)&&(l.material.needsUpdate=!0,h=A,f=A.version,p=e.toneMapping),l.layers.enableAll(),w.unshift(l,l.geometry,l.material,0,0,null))}function d(w,b){w.getRGB(nh,mp(e)),i.buffers.color.setClear(nh.r,nh.g,nh.b,b,a)}function _(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(w,b=1){o.set(w),c=b,d(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(w){c=w,d(o,c)},render:y,addToRenderList:g,dispose:_}}function CT(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},s=f(null),r=s,a=!1;function o(v,R,D,B,V){let X=!1,z=h(B,D,R);r!==z&&(r=z,l(r.object)),X=p(v,B,D,V),X&&m(v,B,D,V),V!==null&&t.update(V,e.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,b(v,R,D,B),V!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(V).buffer))}function c(){return e.createVertexArray()}function l(v){return e.bindVertexArray(v)}function u(v){return e.deleteVertexArray(v)}function h(v,R,D){let B=D.wireframe===!0,V=i[v.id];V===void 0&&(V={},i[v.id]=V);let X=V[R.id];X===void 0&&(X={},V[R.id]=X);let z=X[B];return z===void 0&&(z=f(c()),X[B]=z),z}function f(v){let R=[],D=[],B=[];for(let V=0;V<n;V++)R[V]=0,D[V]=0,B[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:D,attributeDivisors:B,object:v,attributes:{},index:null}}function p(v,R,D,B){let V=r.attributes,X=R.attributes,z=0,Z=D.getAttributes();for(let $ in Z)if(Z[$].location>=0){let ht=V[$],vt=X[$];if(vt===void 0&&($==="instanceMatrix"&&v.instanceMatrix&&(vt=v.instanceMatrix),$==="instanceColor"&&v.instanceColor&&(vt=v.instanceColor)),ht===void 0||ht.attribute!==vt||vt&&ht.data!==vt.data)return!0;z++}return r.attributesNum!==z||r.index!==B}function m(v,R,D,B){let V={},X=R.attributes,z=0,Z=D.getAttributes();for(let $ in Z)if(Z[$].location>=0){let ht=X[$];ht===void 0&&($==="instanceMatrix"&&v.instanceMatrix&&(ht=v.instanceMatrix),$==="instanceColor"&&v.instanceColor&&(ht=v.instanceColor));let vt={};vt.attribute=ht,ht&&ht.data&&(vt.data=ht.data),V[$]=vt,z++}r.attributes=V,r.attributesNum=z,r.index=B}function y(){let v=r.newAttributes;for(let R=0,D=v.length;R<D;R++)v[R]=0}function g(v){d(v,0)}function d(v,R){let D=r.newAttributes,B=r.enabledAttributes,V=r.attributeDivisors;D[v]=1,B[v]===0&&(e.enableVertexAttribArray(v),B[v]=1),V[v]!==R&&(e.vertexAttribDivisor(v,R),V[v]=R)}function _(){let v=r.newAttributes,R=r.enabledAttributes;for(let D=0,B=R.length;D<B;D++)R[D]!==v[D]&&(e.disableVertexAttribArray(D),R[D]=0)}function w(v,R,D,B,V,X,z){z===!0?e.vertexAttribIPointer(v,R,D,V,X):e.vertexAttribPointer(v,R,D,B,V,X)}function b(v,R,D,B){y();let V=B.attributes,X=D.getAttributes(),z=R.defaultAttributeValues;for(let Z in X){let $=X[Z];if($.location>=0){let lt=V[Z];if(lt===void 0&&(Z==="instanceMatrix"&&v.instanceMatrix&&(lt=v.instanceMatrix),Z==="instanceColor"&&v.instanceColor&&(lt=v.instanceColor)),lt!==void 0){let ht=lt.normalized,vt=lt.itemSize,qt=t.get(lt);if(qt===void 0)continue;let te=qt.buffer,Ee=qt.type,se=qt.bytesPerElement,K=Ee===e.INT||Ee===e.UNSIGNED_INT||lt.gpuType===vu;if(lt.isInterleavedBufferAttribute){let tt=lt.data,Q=tt.stride,it=lt.offset;if(tt.isInstancedInterleavedBuffer){for(let nt=0;nt<$.locationSize;nt++)d($.location+nt,tt.meshPerAttribute);v.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let nt=0;nt<$.locationSize;nt++)g($.location+nt);e.bindBuffer(e.ARRAY_BUFFER,te);for(let nt=0;nt<$.locationSize;nt++)w($.location+nt,vt/$.locationSize,Ee,ht,Q*se,(it+vt/$.locationSize*nt)*se,K)}else{if(lt.isInstancedBufferAttribute){for(let tt=0;tt<$.locationSize;tt++)d($.location+tt,lt.meshPerAttribute);v.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=lt.meshPerAttribute*lt.count)}else for(let tt=0;tt<$.locationSize;tt++)g($.location+tt);e.bindBuffer(e.ARRAY_BUFFER,te);for(let tt=0;tt<$.locationSize;tt++)w($.location+tt,vt/$.locationSize,Ee,ht,vt*se,vt/$.locationSize*tt*se,K)}}else if(z!==void 0){let ht=z[Z];if(ht!==void 0)switch(ht.length){case 2:e.vertexAttrib2fv($.location,ht);break;case 3:e.vertexAttrib3fv($.location,ht);break;case 4:e.vertexAttrib4fv($.location,ht);break;default:e.vertexAttrib1fv($.location,ht)}}}}_()}function A(){I();for(let v in i){let R=i[v];for(let D in R){let B=R[D];for(let V in B)u(B[V].object),delete B[V];delete R[D]}delete i[v]}}function S(v){if(i[v.id]===void 0)return;let R=i[v.id];for(let D in R){let B=R[D];for(let V in B)u(B[V].object),delete B[V];delete R[D]}delete i[v.id]}function T(v){for(let R in i){let D=i[R];if(D[v.id]===void 0)continue;let B=D[v.id];for(let V in B)u(B[V].object),delete B[V];delete D[v.id]}}function I(){x(),a=!0,r!==s&&(r=s,l(r.object))}function x(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:I,resetDefaultState:x,dispose:A,releaseStatesOfGeometry:S,releaseStatesOfProgram:T,initAttributes:y,enableAttribute:g,disableUnusedAttributes:_}}function IT(e,t,n){let i;function s(l){i=l}function r(l,u){e.drawArrays(i,l,u),n.update(u,i,1)}function a(l,u,h){h!==0&&(e.drawArraysInstanced(i,l,u,h),n.update(u,i,h))}function o(l,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,u,0,h);let p=0;for(let m=0;m<h;m++)p+=u[m];n.update(p,i,1)}function c(l,u,h,f){if(h===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<l.length;m++)a(l[m],u[m],f[m]);else{p.multiDrawArraysInstancedWEBGL(i,l,0,u,0,f,0,h);let m=0;for(let y=0;y<h;y++)m+=u[y]*f[y];n.update(m,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function PT(e,t,n,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let T=t.get("EXT_texture_filter_anisotropic");s=e.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(T){return!(T!==gi&&i.convert(T)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){let I=T===Oo&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==ki&&i.convert(T)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==Li&&!I)}function c(T){if(T==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=n.precision!==void 0?n.precision:"highp",u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);let h=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),d=e.getParameter(e.MAX_VERTEX_ATTRIBS),_=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),w=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),A=m>0,S=e.getParameter(e.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:y,maxCubemapSize:g,maxAttributes:d,maxVertexUniforms:_,maxVaryings:w,maxFragmentUniforms:b,vertexTextures:A,maxSamples:S}}function kT(e){let t=this,n=null,i=0,s=!1,r=!1,a=new di,o=new $t,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){let p=h.length!==0||f||i!==0||s;return s=f,i=h.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){n=u(h,f,0)},this.setState=function(h,f,p){let m=h.clippingPlanes,y=h.clipIntersection,g=h.clipShadows,d=e.get(h);if(!s||m===null||m.length===0||r&&!g)r?u(null):l();else{let _=r?0:i,w=_*4,b=d.clippingState||null;c.value=b,b=u(m,f,w,p);for(let A=0;A!==w;++A)b[A]=n[A];d.clippingState=b,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(h,f,p,m){let y=h!==null?h.length:0,g=null;if(y!==0){if(g=c.value,m!==!0||g===null){let d=p+y*4,_=f.matrixWorldInverse;o.getNormalMatrix(_),(g===null||g.length<d)&&(g=new Float32Array(d));for(let w=0,b=p;w!==y;++w,b+=4)a.copy(h[w]).applyMatrix4(_,o),a.normal.toArray(g,b),g[b+3]=a.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,g}}function LT(e){let t=new WeakMap;function n(a,o){return o===yu?a.mapping=Dr:o===xu&&(a.mapping=Nr),a}function i(a){if(a&&a.isTexture){let o=a.mapping;if(o===yu||o===xu)if(t.has(a)){let c=t.get(a).texture;return n(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let l=new Xc(c.height);return l.fromEquirectangularTexture(e,a),t.set(a,l),a.addEventListener("dispose",s),n(l.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}var $o=4,ky=[.125,.215,.35,.446,.526,.582],Hr=20,_p=new Qa,Ly=new Gt,vp=null,bp=0,wp=0,Mp=!1,Br=(1+Math.sqrt(5))/2,zo=1/Br,Dy=[new L(-Br,zo,0),new L(Br,zo,0),new L(-zo,0,Br),new L(zo,0,Br),new L(0,Br,-zo),new L(0,Br,zo),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],DT=new L,Go=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,n=0,i=.1,s=100,r={}){let{size:a=256,position:o=DT}=r;vp=this._renderer.getRenderTarget(),bp=this._renderer.getActiveCubeFace(),wp=this._renderer.getActiveMipmapLevel(),Mp=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,i,s,c,o),n>0&&this._blur(c,0,0,n),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,n=null){return this._fromTexture(t,n)}fromCubemap(t,n=null){return this._fromTexture(t,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Oy(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Uy(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(vp,bp,wp),this._renderer.xr.enabled=Mp,t.scissorTest=!1,ih(t,0,0,t.width,t.height)}_fromTexture(t,n){t.mapping===Dr||t.mapping===Nr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),vp=this._renderer.getRenderTarget(),bp=this._renderer.getActiveCubeFace(),wp=this._renderer.getActiveMipmapLevel(),Mp=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=n||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Ci,minFilter:Ci,generateMipmaps:!1,type:Oo,format:gi,colorSpace:Ir,depthBuffer:!1},s=Ny(t,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ny(t,n,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=NT(r)),this._blurMaterial=UT(r,t,n)}return s}_compileMaterial(t){let n=new q(this._lodPlanes[0],t);this._renderer.compile(n,_p)}_sceneToCubeUV(t,n,i,s,r){let c=new pn(90,1,n,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,p=h.toneMapping;h.getClearColor(Ly),h.toneMapping=Ms,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null));let y=new cn({name:"PMREM.Background",side:mn,depthWrite:!1,depthTest:!1}),g=new q(new un,y),d=!1,_=t.background;_?_.isColor&&(y.color.copy(_),t.background=null,d=!0):(y.color.copy(Ly),d=!0);for(let w=0;w<6;w++){let b=w%3;b===0?(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[w],r.y,r.z)):b===1?(c.up.set(0,0,l[w]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[w],r.z)):(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[w]));let A=this._cubeSize;ih(s,b*A,w>2?A:0,A,A),h.setRenderTarget(s),d&&h.render(g,c),h.render(t,c)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=p,h.autoClear=f,t.background=_}_textureToCubeUV(t,n){let i=this._renderer,s=t.mapping===Dr||t.mapping===Nr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Oy()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Uy());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new q(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;let c=this._cubeSize;ih(n,0,0,3*c,2*c),i.setRenderTarget(n),i.render(a,_p)}_applyPMREM(t){let n=this._renderer,i=n.autoClear;n.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Dy[(s-r-1)%Dy.length];this._blur(t,r-1,r,a,o)}n.autoClear=i}_blur(t,n,i,s,r){let a=this._pingPongRenderTarget;this._halfBlur(t,a,n,i,s,"latitudinal",r),this._halfBlur(a,t,i,i,s,"longitudinal",r)}_halfBlur(t,n,i,s,r,a,o){let c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,h=new q(this._lodPlanes[s],l),f=l.uniforms,p=this._sizeLods[i]-1,m=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Hr-1),y=r/m,g=isFinite(r)?1+Math.floor(u*y):Hr;g>Hr&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Hr}`);let d=[],_=0;for(let T=0;T<Hr;++T){let I=T/y,x=Math.exp(-I*I/2);d.push(x),T===0?_+=x:T<g&&(_+=2*x)}for(let T=0;T<d.length;T++)d[T]=d[T]/_;f.envMap.value=t.texture,f.samples.value=g,f.weights.value=d,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);let{_lodMax:w}=this;f.dTheta.value=m,f.mipInt.value=w-i;let b=this._sizeLods[s],A=3*b*(s>w-$o?s-w+$o:0),S=4*(this._cubeSize-b);ih(n,A,S,3*b,2*b),c.setRenderTarget(n),c.render(h,_p)}};function NT(e){let t=[],n=[],i=[],s=e,r=e-$o+1+ky.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);n.push(o);let c=1/o;a>e-$o?c=ky[a-e+$o-1]:a===0&&(c=0),i.push(c);let l=1/(o-2),u=-l,h=1+l,f=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,m=6,y=3,g=2,d=1,_=new Float32Array(y*m*p),w=new Float32Array(g*m*p),b=new Float32Array(d*m*p);for(let S=0;S<p;S++){let T=S%3*2/3-1,I=S>2?0:-1,x=[T,I,0,T+2/3,I,0,T+2/3,I+1,0,T,I,0,T+2/3,I+1,0,T,I+1,0];_.set(x,y*m*S),w.set(f,g*m*S);let v=[S,S,S,S,S,S];b.set(v,d*m*S)}let A=new En;A.setAttribute("position",new ln(_,y)),A.setAttribute("uv",new ln(w,g)),A.setAttribute("faceIndex",new ln(b,d)),t.push(A),s>$o&&s--}return{lodPlanes:t,sizeLods:n,sigmas:i}}function Ny(e,t,n){let i=new Qi(e,t,n);return i.texture.mapping=nl,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ih(e,t,n,i,s){e.viewport.set(t,n,i,s),e.scissor.set(t,n,i,s)}function UT(e,t,n){let i=new Float32Array(Hr),s=new L(0,1,0);return new Ii({name:"SphericalGaussianBlur",defines:{n:Hr,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Lp(),fragmentShader:`

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
		`,blending:ws,depthTest:!1,depthWrite:!1})}function Uy(){return new Ii({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Lp(),fragmentShader:`

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
		`,blending:ws,depthTest:!1,depthWrite:!1})}function Oy(){return new Ii({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Lp(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ws,depthTest:!1,depthWrite:!1})}function Lp(){return`

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
	`}function OT(e){let t=new WeakMap,n=null;function i(o){if(o&&o.isTexture){let c=o.mapping,l=c===yu||c===xu,u=c===Dr||c===Nr;if(l||u){let h=t.get(o),f=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return n===null&&(n=new Go(e)),h=l?n.fromEquirectangular(o,h):n.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),h.texture;if(h!==void 0)return h.texture;{let p=o.image;return l&&p&&p.height>0||u&&p&&s(p)?(n===null&&(n=new Go(e)),h=l?n.fromEquirectangular(o):n.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),o.addEventListener("dispose",r),h.texture):null}}}return o}function s(o){let c=0,l=6;for(let u=0;u<l;u++)o[u]!==void 0&&c++;return c===l}function r(o){let c=o.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:a}}function FT(e){let t={};function n(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=e.getExtension("WEBGL_depth_texture")||e.getExtension("MOZ_WEBGL_depth_texture")||e.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=e.getExtension("EXT_texture_filter_anisotropic")||e.getExtension("MOZ_EXT_texture_filter_anisotropic")||e.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=e.getExtension("WEBGL_compressed_texture_s3tc")||e.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=e.getExtension("WEBGL_compressed_texture_pvrtc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=e.getExtension(i)}return t[i]=s,s}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){let s=n(i);return s===null&&To("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function BT(e,t,n,i){let s={},r=new WeakMap;function a(h){let f=h.target;f.index!==null&&t.remove(f.index);for(let m in f.attributes)t.remove(f.attributes[m]);f.removeEventListener("dispose",a),delete s[f.id];let p=r.get(f);p&&(t.remove(p),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,n.memory.geometries--}function o(h,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,n.memory.geometries++),f}function c(h){let f=h.attributes;for(let p in f)t.update(f[p],e.ARRAY_BUFFER)}function l(h){let f=[],p=h.index,m=h.attributes.position,y=0;if(p!==null){let _=p.array;y=p.version;for(let w=0,b=_.length;w<b;w+=3){let A=_[w+0],S=_[w+1],T=_[w+2];f.push(A,S,S,T,T,A)}}else if(m!==void 0){let _=m.array;y=m.version;for(let w=0,b=_.length/3-1;w<b;w+=3){let A=w+0,S=w+1,T=w+2;f.push(A,S,S,T,T,A)}}else return;let g=new(pp(f)?Oa:Ua)(f,1);g.version=y;let d=r.get(h);d&&t.remove(d),r.set(h,g)}function u(h){let f=r.get(h);if(f){let p=h.index;p!==null&&f.version<p.version&&l(h)}else l(h);return r.get(h)}return{get:o,update:c,getWireframeAttribute:u}}function HT(e,t,n){let i;function s(f){i=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function c(f,p){e.drawElements(i,p,r,f*a),n.update(p,i,1)}function l(f,p,m){m!==0&&(e.drawElementsInstanced(i,p,r,f*a,m),n.update(p,i,m))}function u(f,p,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,f,0,m);let g=0;for(let d=0;d<m;d++)g+=p[d];n.update(g,i,1)}function h(f,p,m,y){if(m===0)return;let g=t.get("WEBGL_multi_draw");if(g===null)for(let d=0;d<f.length;d++)l(f[d]/a,p[d],y[d]);else{g.multiDrawElementsInstancedWEBGL(i,p,0,r,f,0,y,0,m);let d=0;for(let _=0;_<m;_++)d+=p[_]*y[_];n.update(d,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function zT(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(n.calls++,a){case e.TRIANGLES:n.triangles+=o*(r/3);break;case e.LINES:n.lines+=o*(r/2);break;case e.LINE_STRIP:n.lines+=o*(r-1);break;case e.LINE_LOOP:n.lines+=o*r;break;case e.POINTS:n.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:s,update:i}}function $T(e,t,n){let i=new WeakMap,s=new de;function r(a,o,c){let l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0,f=i.get(o);if(f===void 0||f.count!==h){let x=function(){T.dispose(),i.delete(o),o.removeEventListener("dispose",x)};f!==void 0&&f.texture.dispose();let p=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,y=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],d=o.morphAttributes.normal||[],_=o.morphAttributes.color||[],w=0;p===!0&&(w=1),m===!0&&(w=2),y===!0&&(w=3);let b=o.attributes.position.count*w,A=1;b>t.maxTextureSize&&(A=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);let S=new Float32Array(b*A*4*h),T=new Na(S,b,A,h);T.type=Li,T.needsUpdate=!0;let I=w*4;for(let v=0;v<h;v++){let R=g[v],D=d[v],B=_[v],V=b*A*4*v;for(let X=0;X<R.count;X++){let z=X*I;p===!0&&(s.fromBufferAttribute(R,X),S[V+z+0]=s.x,S[V+z+1]=s.y,S[V+z+2]=s.z,S[V+z+3]=0),m===!0&&(s.fromBufferAttribute(D,X),S[V+z+4]=s.x,S[V+z+5]=s.y,S[V+z+6]=s.z,S[V+z+7]=0),y===!0&&(s.fromBufferAttribute(B,X),S[V+z+8]=s.x,S[V+z+9]=s.y,S[V+z+10]=s.z,S[V+z+11]=B.itemSize===4?s.w:1)}}f={count:h,texture:T,size:new At(b,A)},i.set(o,f),o.addEventListener("dispose",x)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(e,"morphTexture",a.morphTexture,n);else{let p=0;for(let y=0;y<l.length;y++)p+=l[y];let m=o.morphTargetsRelative?1:1-p;c.getUniforms().setValue(e,"morphTargetBaseInfluence",m),c.getUniforms().setValue(e,"morphTargetInfluences",l)}c.getUniforms().setValue(e,"morphTargetsTexture",f.texture,n),c.getUniforms().setValue(e,"morphTargetsTextureSize",f.size)}return{update:r}}function VT(e,t,n,i){let s=new WeakMap;function r(c){let l=i.render.frame,u=c.geometry,h=t.get(c,u);if(s.get(h)!==l&&(t.update(h),s.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(n.update(c.instanceMatrix,e.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,e.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return h}function a(){s=new WeakMap}function o(c){let l=c.target;l.removeEventListener("dispose",o),n.remove(l.instanceMatrix),l.instanceColor!==null&&n.remove(l.instanceColor)}return{update:r,dispose:a}}var nx=new Fn,Fy=new za(1,1),ix=new Na,sx=new Wc,rx=new Ba,By=[],Hy=[],zy=new Float32Array(16),$y=new Float32Array(9),Vy=new Float32Array(4);function Wo(e,t,n){let i=e[0];if(i<=0||i>0)return e;let s=t*n,r=By[s];if(r===void 0&&(r=new Float32Array(s),By[s]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=n,e[a].toArray(r,o)}return r}function Ke(e,t){if(e.length!==t.length)return!1;for(let n=0,i=e.length;n<i;n++)if(e[n]!==t[n])return!1;return!0}function Ze(e,t){for(let n=0,i=t.length;n<i;n++)e[n]=t[n]}function oh(e,t){let n=Hy[t];n===void 0&&(n=new Int32Array(t),Hy[t]=n);for(let i=0;i!==t;++i)n[i]=e.allocateTextureUnit();return n}function GT(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function WT(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ke(n,t))return;e.uniform2fv(this.addr,t),Ze(n,t)}}function qT(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Ke(n,t))return;e.uniform3fv(this.addr,t),Ze(n,t)}}function XT(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ke(n,t))return;e.uniform4fv(this.addr,t),Ze(n,t)}}function jT(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(Ke(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Ze(n,t)}else{if(Ke(n,i))return;Vy.set(i),e.uniformMatrix2fv(this.addr,!1,Vy),Ze(n,i)}}function YT(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(Ke(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Ze(n,t)}else{if(Ke(n,i))return;$y.set(i),e.uniformMatrix3fv(this.addr,!1,$y),Ze(n,i)}}function KT(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(Ke(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Ze(n,t)}else{if(Ke(n,i))return;zy.set(i),e.uniformMatrix4fv(this.addr,!1,zy),Ze(n,i)}}function ZT(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function JT(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ke(n,t))return;e.uniform2iv(this.addr,t),Ze(n,t)}}function QT(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ke(n,t))return;e.uniform3iv(this.addr,t),Ze(n,t)}}function tA(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ke(n,t))return;e.uniform4iv(this.addr,t),Ze(n,t)}}function eA(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function nA(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ke(n,t))return;e.uniform2uiv(this.addr,t),Ze(n,t)}}function iA(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ke(n,t))return;e.uniform3uiv(this.addr,t),Ze(n,t)}}function sA(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ke(n,t))return;e.uniform4uiv(this.addr,t),Ze(n,t)}}function rA(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s);let r;this.type===e.SAMPLER_2D_SHADOW?(Fy.compareFunction=hp,r=Fy):r=nx,n.setTexture2D(t||r,s)}function oA(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTexture3D(t||sx,s)}function aA(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTextureCube(t||rx,s)}function lA(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTexture2DArray(t||ix,s)}function cA(e){switch(e){case 5126:return GT;case 35664:return WT;case 35665:return qT;case 35666:return XT;case 35674:return jT;case 35675:return YT;case 35676:return KT;case 5124:case 35670:return ZT;case 35667:case 35671:return JT;case 35668:case 35672:return QT;case 35669:case 35673:return tA;case 5125:return eA;case 36294:return nA;case 36295:return iA;case 36296:return sA;case 35678:case 36198:case 36298:case 36306:case 35682:return rA;case 35679:case 36299:case 36307:return oA;case 35680:case 36300:case 36308:case 36293:return aA;case 36289:case 36303:case 36311:case 36292:return lA}}function uA(e,t){e.uniform1fv(this.addr,t)}function hA(e,t){let n=Wo(t,this.size,2);e.uniform2fv(this.addr,n)}function dA(e,t){let n=Wo(t,this.size,3);e.uniform3fv(this.addr,n)}function fA(e,t){let n=Wo(t,this.size,4);e.uniform4fv(this.addr,n)}function pA(e,t){let n=Wo(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function mA(e,t){let n=Wo(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function gA(e,t){let n=Wo(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function yA(e,t){e.uniform1iv(this.addr,t)}function xA(e,t){e.uniform2iv(this.addr,t)}function _A(e,t){e.uniform3iv(this.addr,t)}function vA(e,t){e.uniform4iv(this.addr,t)}function bA(e,t){e.uniform1uiv(this.addr,t)}function wA(e,t){e.uniform2uiv(this.addr,t)}function MA(e,t){e.uniform3uiv(this.addr,t)}function SA(e,t){e.uniform4uiv(this.addr,t)}function EA(e,t,n){let i=this.cache,s=t.length,r=oh(n,s);Ke(i,r)||(e.uniform1iv(this.addr,r),Ze(i,r));for(let a=0;a!==s;++a)n.setTexture2D(t[a]||nx,r[a])}function TA(e,t,n){let i=this.cache,s=t.length,r=oh(n,s);Ke(i,r)||(e.uniform1iv(this.addr,r),Ze(i,r));for(let a=0;a!==s;++a)n.setTexture3D(t[a]||sx,r[a])}function AA(e,t,n){let i=this.cache,s=t.length,r=oh(n,s);Ke(i,r)||(e.uniform1iv(this.addr,r),Ze(i,r));for(let a=0;a!==s;++a)n.setTextureCube(t[a]||rx,r[a])}function RA(e,t,n){let i=this.cache,s=t.length,r=oh(n,s);Ke(i,r)||(e.uniform1iv(this.addr,r),Ze(i,r));for(let a=0;a!==s;++a)n.setTexture2DArray(t[a]||ix,r[a])}function CA(e){switch(e){case 5126:return uA;case 35664:return hA;case 35665:return dA;case 35666:return fA;case 35674:return pA;case 35675:return mA;case 35676:return gA;case 5124:case 35670:return yA;case 35667:case 35671:return xA;case 35668:case 35672:return _A;case 35669:case 35673:return vA;case 5125:return bA;case 36294:return wA;case 36295:return MA;case 36296:return SA;case 35678:case 36198:case 36298:case 36306:case 35682:return EA;case 35679:case 36299:case 36307:return TA;case 35680:case 36300:case 36308:case 36293:return AA;case 36289:case 36303:case 36311:case 36292:return RA}}var Ep=class{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.setValue=cA(n.type)}},Tp=class{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=CA(n.type)}},Ap=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,n,i){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,n[o.id],i)}}},Sp=/(\w+)(\])?(\[|\.)?/g;function Gy(e,t){e.seq.push(t),e.map[t.id]=t}function IA(e,t,n){let i=e.name,s=i.length;for(Sp.lastIndex=0;;){let r=Sp.exec(i),a=Sp.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Gy(n,l===void 0?new Ep(o,e,t):new Tp(o,e,t));break}else{let h=n.map[o];h===void 0&&(h=new Ap(o),Gy(n,h)),n=h}}}var Vo=class{constructor(t,n){this.seq=[],this.map={};let i=t.getProgramParameter(n,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=t.getActiveUniform(n,s),a=t.getUniformLocation(n,r.name);IA(r,a,this)}}setValue(t,n,i,s){let r=this.map[n];r!==void 0&&r.setValue(t,i,s)}setOptional(t,n,i){let s=n[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,n,i,s){for(let r=0,a=n.length;r!==a;++r){let o=n[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,n){let i=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in n&&i.push(a)}return i}};function Wy(e,t,n){let i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),i}var PA=37297,kA=0;function LA(e,t){let n=e.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,n.length);for(let a=s;a<r;a++){let o=a+1;i.push(`${o===t?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}var qy=new $t;function DA(e){ne._getMatrix(qy,ne.workingColorSpace,e);let t=`mat3( ${qy.elements.map(n=>n.toFixed(4))} )`;switch(ne.getTransfer(e)){case ka:return[t,"LinearTransferOETF"];case fe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function Xy(e,t,n){let i=e.getShaderParameter(t,e.COMPILE_STATUS),r=(e.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return n.toUpperCase()+`

`+r+`

`+LA(e.getShaderSource(t),o)}else return r}function NA(e,t){let n=DA(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}function UA(e,t){let n;switch(t){case cy:n="Linear";break;case uy:n="Reinhard";break;case hy:n="Cineon";break;case dy:n="ACESFilmic";break;case py:n="AgX";break;case my:n="Neutral";break;case fy:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),n="Linear"}return"vec3 "+e+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}var sh=new L;function OA(){ne.getLuminanceCoefficients(sh);let e=sh.x.toFixed(4),t=sh.y.toFixed(4),n=sh.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function FA(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ll).join(`
`)}function BA(e){let t=[];for(let n in e){let i=e[n];i!==!1&&t.push("#define "+n+" "+i)}return t.join(`
`)}function HA(e,t){let n={},i=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=e.getActiveAttrib(t,s),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function ll(e){return e!==""}function jy(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Yy(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var zA=/^[ \t]*#include +<([\w\d./]+)>/gm;function Rp(e){return e.replace(zA,VA)}var $A=new Map;function VA(e,t){let n=jt[t];if(n===void 0){let i=$A.get(t);if(i!==void 0)n=jt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Rp(n)}var GA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ky(e){return e.replace(GA,WA)}function WA(e,t,n,i){let s="";for(let r=parseInt(t);r<parseInt(n);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Zy(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision==="highp"?t+=`
#define HIGH_PRECISION`:e.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function qA(e){let t="SHADOWMAP_TYPE_BASIC";return e.shadowMapType===Qf?t="SHADOWMAP_TYPE_PCF":e.shadowMapType===lu?t="SHADOWMAP_TYPE_PCF_SOFT":e.shadowMapType===ns&&(t="SHADOWMAP_TYPE_VSM"),t}function XA(e){let t="ENVMAP_TYPE_CUBE";if(e.envMap)switch(e.envMapMode){case Dr:case Nr:t="ENVMAP_TYPE_CUBE";break;case nl:t="ENVMAP_TYPE_CUBE_UV";break}return t}function jA(e){let t="ENVMAP_MODE_REFLECTION";if(e.envMap)switch(e.envMapMode){case Nr:t="ENVMAP_MODE_REFRACTION";break}return t}function YA(e){let t="ENVMAP_BLENDING_NONE";if(e.envMap)switch(e.combine){case gu:t="ENVMAP_BLENDING_MULTIPLY";break;case ay:t="ENVMAP_BLENDING_MIX";break;case ly:t="ENVMAP_BLENDING_ADD";break}return t}function KA(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function ZA(e,t,n,i){let s=e.getContext(),r=n.defines,a=n.vertexShader,o=n.fragmentShader,c=qA(n),l=XA(n),u=jA(n),h=YA(n),f=KA(n),p=FA(n),m=BA(r),y=s.createProgram(),g,d,_=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(g=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m].filter(ll).join(`
`),g.length>0&&(g+=`
`),d=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m].filter(ll).join(`
`),d.length>0&&(d+=`
`)):(g=[Zy(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ll).join(`
`),d=[Zy(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+l:"",n.envMap?"#define "+u:"",n.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Ms?"#define TONE_MAPPING":"",n.toneMapping!==Ms?jt.tonemapping_pars_fragment:"",n.toneMapping!==Ms?UA("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",jt.colorspace_pars_fragment,NA("linearToOutputTexel",n.outputColorSpace),OA(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(ll).join(`
`)),a=Rp(a),a=jy(a,n),a=Yy(a,n),o=Rp(o),o=jy(o,n),o=Yy(o,n),a=Ky(a),o=Ky(o),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,d=["#define varying in",n.glslVersion===dp?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===dp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let w=_+g+a,b=_+d+o,A=Wy(s,s.VERTEX_SHADER,w),S=Wy(s,s.FRAGMENT_SHADER,b);s.attachShader(y,A),s.attachShader(y,S),n.index0AttributeName!==void 0?s.bindAttribLocation(y,0,n.index0AttributeName):n.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function T(R){if(e.debug.checkShaderErrors){let D=s.getProgramInfoLog(y)||"",B=s.getShaderInfoLog(A)||"",V=s.getShaderInfoLog(S)||"",X=D.trim(),z=B.trim(),Z=V.trim(),$=!0,lt=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if($=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(s,y,A,S);else{let ht=Xy(s,A,"vertex"),vt=Xy(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+X+`
`+ht+`
`+vt)}else X!==""?console.warn("THREE.WebGLProgram: Program Info Log:",X):(z===""||Z==="")&&(lt=!1);lt&&(R.diagnostics={runnable:$,programLog:X,vertexShader:{log:z,prefix:g},fragmentShader:{log:Z,prefix:d}})}s.deleteShader(A),s.deleteShader(S),I=new Vo(s,y),x=HA(s,y)}let I;this.getUniforms=function(){return I===void 0&&T(this),I};let x;this.getAttributes=function(){return x===void 0&&T(this),x};let v=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(y,PA)),v},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=kA++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=A,this.fragmentShader=S,this}var JA=0,Cp=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let n=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(n),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){let n=this.materialCache.get(t);for(let i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let n=this.materialCache,i=n.get(t);return i===void 0&&(i=new Set,n.set(t,i)),i}_getShaderStage(t){let n=this.shaderCache,i=n.get(t);return i===void 0&&(i=new Ip(t),n.set(t,i)),i}},Ip=class{constructor(t){this.id=JA++,this.code=t,this.usedTimes=0}};function QA(e,t,n,i,s,r,a){let o=new Ro,c=new Cp,l=new Set,u=[],h=s.logarithmicDepthBuffer,f=s.vertexTextures,p=s.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(x){return l.add(x),x===0?"uv":`uv${x}`}function g(x,v,R,D,B){let V=D.fog,X=B.geometry,z=x.isMeshStandardMaterial?D.environment:null,Z=(x.isMeshStandardMaterial?n:t).get(x.envMap||z),$=Z&&Z.mapping===nl?Z.image.height:null,lt=m[x.type];x.precision!==null&&(p=s.getMaxPrecision(x.precision),p!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",p,"instead."));let ht=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,vt=ht!==void 0?ht.length:0,qt=0;X.morphAttributes.position!==void 0&&(qt=1),X.morphAttributes.normal!==void 0&&(qt=2),X.morphAttributes.color!==void 0&&(qt=3);let te,Ee,se,K;if(lt){let ce=is[lt];te=ce.vertexShader,Ee=ce.fragmentShader}else te=x.vertexShader,Ee=x.fragmentShader,c.update(x),se=c.getVertexShaderID(x),K=c.getFragmentShaderID(x);let tt=e.getRenderTarget(),Q=e.state.buffers.depth.getReversed(),it=B.isInstancedMesh===!0,nt=B.isBatchedMesh===!0,yt=!!x.map,he=!!x.matcap,k=!!Z,re=!!x.aoMap,Ft=!!x.lightMap,Ut=!!x.bumpMap,wt=!!x.normalMap,De=!!x.displacementMap,Mt=!!x.emissiveMap,Xt=!!x.metalnessMap,rn=!!x.roughnessMap,ze=x.anisotropy>0,C=x.clearcoat>0,M=x.dispersion>0,H=x.iridescence>0,Y=x.sheen>0,et=x.transmission>0,j=ze&&!!x.anisotropyMap,Rt=C&&!!x.clearcoatMap,ct=C&&!!x.clearcoatNormalMap,St=C&&!!x.clearcoatRoughnessMap,Et=H&&!!x.iridescenceMap,ot=H&&!!x.iridescenceThicknessMap,mt=Y&&!!x.sheenColorMap,Nt=Y&&!!x.sheenRoughnessMap,Tt=!!x.specularMap,ft=!!x.specularColorMap,Vt=!!x.specularIntensityMap,N=et&&!!x.transmissionMap,at=et&&!!x.thicknessMap,ut=!!x.gradientMap,xt=!!x.alphaMap,st=x.alphaTest>0,J=!!x.alphaHash,bt=!!x.extensions,Bt=Ms;x.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(Bt=e.toneMapping);let Te={shaderID:lt,shaderType:x.type,shaderName:x.name,vertexShader:te,fragmentShader:Ee,defines:x.defines,customVertexShaderID:se,customFragmentShaderID:K,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:p,batching:nt,batchingColor:nt&&B._colorsTexture!==null,instancing:it,instancingColor:it&&B.instanceColor!==null,instancingMorph:it&&B.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:tt===null?e.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:Ir,alphaToCoverage:!!x.alphaToCoverage,map:yt,matcap:he,envMap:k,envMapMode:k&&Z.mapping,envMapCubeUVHeight:$,aoMap:re,lightMap:Ft,bumpMap:Ut,normalMap:wt,displacementMap:f&&De,emissiveMap:Mt,normalMapObjectSpace:wt&&x.normalMapType===_y,normalMapTangentSpace:wt&&x.normalMapType===eh,metalnessMap:Xt,roughnessMap:rn,anisotropy:ze,anisotropyMap:j,clearcoat:C,clearcoatMap:Rt,clearcoatNormalMap:ct,clearcoatRoughnessMap:St,dispersion:M,iridescence:H,iridescenceMap:Et,iridescenceThicknessMap:ot,sheen:Y,sheenColorMap:mt,sheenRoughnessMap:Nt,specularMap:Tt,specularColorMap:ft,specularIntensityMap:Vt,transmission:et,transmissionMap:N,thicknessMap:at,gradientMap:ut,opaque:x.transparent===!1&&x.blending===Rr&&x.alphaToCoverage===!1,alphaMap:xt,alphaTest:st,alphaHash:J,combine:x.combine,mapUv:yt&&y(x.map.channel),aoMapUv:re&&y(x.aoMap.channel),lightMapUv:Ft&&y(x.lightMap.channel),bumpMapUv:Ut&&y(x.bumpMap.channel),normalMapUv:wt&&y(x.normalMap.channel),displacementMapUv:De&&y(x.displacementMap.channel),emissiveMapUv:Mt&&y(x.emissiveMap.channel),metalnessMapUv:Xt&&y(x.metalnessMap.channel),roughnessMapUv:rn&&y(x.roughnessMap.channel),anisotropyMapUv:j&&y(x.anisotropyMap.channel),clearcoatMapUv:Rt&&y(x.clearcoatMap.channel),clearcoatNormalMapUv:ct&&y(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:St&&y(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Et&&y(x.iridescenceMap.channel),iridescenceThicknessMapUv:ot&&y(x.iridescenceThicknessMap.channel),sheenColorMapUv:mt&&y(x.sheenColorMap.channel),sheenRoughnessMapUv:Nt&&y(x.sheenRoughnessMap.channel),specularMapUv:Tt&&y(x.specularMap.channel),specularColorMapUv:ft&&y(x.specularColorMap.channel),specularIntensityMapUv:Vt&&y(x.specularIntensityMap.channel),transmissionMapUv:N&&y(x.transmissionMap.channel),thicknessMapUv:at&&y(x.thicknessMap.channel),alphaMapUv:xt&&y(x.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(wt||ze),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!X.attributes.uv&&(yt||xt),fog:!!V,useFog:x.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:x.flatShading===!0&&x.wireframe===!1,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Q,skinning:B.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:vt,morphTextureStride:qt,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:x.dithering,shadowMapEnabled:e.shadowMap.enabled&&R.length>0,shadowMapType:e.shadowMap.type,toneMapping:Bt,decodeVideoTexture:yt&&x.map.isVideoTexture===!0&&ne.getTransfer(x.map.colorSpace)===fe,decodeVideoTextureEmissive:Mt&&x.emissiveMap.isVideoTexture===!0&&ne.getTransfer(x.emissiveMap.colorSpace)===fe,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Gn,flipSided:x.side===mn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:bt&&x.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(bt&&x.extensions.multiDraw===!0||nt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Te.vertexUv1s=l.has(1),Te.vertexUv2s=l.has(2),Te.vertexUv3s=l.has(3),l.clear(),Te}function d(x){let v=[];if(x.shaderID?v.push(x.shaderID):(v.push(x.customVertexShaderID),v.push(x.customFragmentShaderID)),x.defines!==void 0)for(let R in x.defines)v.push(R),v.push(x.defines[R]);return x.isRawShaderMaterial===!1&&(_(v,x),w(v,x),v.push(e.outputColorSpace)),v.push(x.customProgramCacheKey),v.join()}function _(x,v){x.push(v.precision),x.push(v.outputColorSpace),x.push(v.envMapMode),x.push(v.envMapCubeUVHeight),x.push(v.mapUv),x.push(v.alphaMapUv),x.push(v.lightMapUv),x.push(v.aoMapUv),x.push(v.bumpMapUv),x.push(v.normalMapUv),x.push(v.displacementMapUv),x.push(v.emissiveMapUv),x.push(v.metalnessMapUv),x.push(v.roughnessMapUv),x.push(v.anisotropyMapUv),x.push(v.clearcoatMapUv),x.push(v.clearcoatNormalMapUv),x.push(v.clearcoatRoughnessMapUv),x.push(v.iridescenceMapUv),x.push(v.iridescenceThicknessMapUv),x.push(v.sheenColorMapUv),x.push(v.sheenRoughnessMapUv),x.push(v.specularMapUv),x.push(v.specularColorMapUv),x.push(v.specularIntensityMapUv),x.push(v.transmissionMapUv),x.push(v.thicknessMapUv),x.push(v.combine),x.push(v.fogExp2),x.push(v.sizeAttenuation),x.push(v.morphTargetsCount),x.push(v.morphAttributeCount),x.push(v.numDirLights),x.push(v.numPointLights),x.push(v.numSpotLights),x.push(v.numSpotLightMaps),x.push(v.numHemiLights),x.push(v.numRectAreaLights),x.push(v.numDirLightShadows),x.push(v.numPointLightShadows),x.push(v.numSpotLightShadows),x.push(v.numSpotLightShadowsWithMaps),x.push(v.numLightProbes),x.push(v.shadowMapType),x.push(v.toneMapping),x.push(v.numClippingPlanes),x.push(v.numClipIntersection),x.push(v.depthPacking)}function w(x,v){o.disableAll(),v.supportsVertexTextures&&o.enable(0),v.instancing&&o.enable(1),v.instancingColor&&o.enable(2),v.instancingMorph&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),v.dispersion&&o.enable(20),v.batchingColor&&o.enable(21),v.gradientMap&&o.enable(22),x.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.reversedDepthBuffer&&o.enable(4),v.skinning&&o.enable(5),v.morphTargets&&o.enable(6),v.morphNormals&&o.enable(7),v.morphColors&&o.enable(8),v.premultipliedAlpha&&o.enable(9),v.shadowMapEnabled&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),v.decodeVideoTextureEmissive&&o.enable(20),v.alphaToCoverage&&o.enable(21),x.push(o.mask)}function b(x){let v=m[x.type],R;if(v){let D=is[v];R=Iy.clone(D.uniforms)}else R=x.uniforms;return R}function A(x,v){let R;for(let D=0,B=u.length;D<B;D++){let V=u[D];if(V.cacheKey===v){R=V,++R.usedTimes;break}}return R===void 0&&(R=new ZA(e,v,x,r),u.push(R)),R}function S(x){if(--x.usedTimes===0){let v=u.indexOf(x);u[v]=u[u.length-1],u.pop(),x.destroy()}}function T(x){c.remove(x)}function I(){c.dispose()}return{getParameters:g,getProgramCacheKey:d,getUniforms:b,acquireProgram:A,releaseProgram:S,releaseShaderCache:T,programs:u,dispose:I}}function tR(){let e=new WeakMap;function t(a){return e.has(a)}function n(a){let o=e.get(a);return o===void 0&&(o={},e.set(a,o)),o}function i(a){e.delete(a)}function s(a,o,c){e.get(a)[o]=c}function r(){e=new WeakMap}return{has:t,get:n,remove:i,update:s,dispose:r}}function eR(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.material.id!==t.material.id?e.material.id-t.material.id:e.z!==t.z?e.z-t.z:e.id-t.id}function Jy(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.z!==t.z?t.z-e.z:e.id-t.id}function Qy(){let e=[],t=0,n=[],i=[],s=[];function r(){t=0,n.length=0,i.length=0,s.length=0}function a(h,f,p,m,y,g){let d=e[t];return d===void 0?(d={id:h.id,object:h,geometry:f,material:p,groupOrder:m,renderOrder:h.renderOrder,z:y,group:g},e[t]=d):(d.id=h.id,d.object=h,d.geometry=f,d.material=p,d.groupOrder=m,d.renderOrder=h.renderOrder,d.z=y,d.group=g),t++,d}function o(h,f,p,m,y,g){let d=a(h,f,p,m,y,g);p.transmission>0?i.push(d):p.transparent===!0?s.push(d):n.push(d)}function c(h,f,p,m,y,g){let d=a(h,f,p,m,y,g);p.transmission>0?i.unshift(d):p.transparent===!0?s.unshift(d):n.unshift(d)}function l(h,f){n.length>1&&n.sort(h||eR),i.length>1&&i.sort(f||Jy),s.length>1&&s.sort(f||Jy)}function u(){for(let h=t,f=e.length;h<f;h++){let p=e[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:n,transmissive:i,transparent:s,init:r,push:o,unshift:c,finish:u,sort:l}}function nR(){let e=new WeakMap;function t(i,s){let r=e.get(i),a;return r===void 0?(a=new Qy,e.set(i,[a])):s>=r.length?(a=new Qy,r.push(a)):a=r[s],a}function n(){e=new WeakMap}return{get:t,dispose:n}}function iR(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"DirectionalLight":n={direction:new L,color:new Gt};break;case"SpotLight":n={position:new L,direction:new L,color:new Gt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new L,color:new Gt,distance:0,decay:0};break;case"HemisphereLight":n={direction:new L,skyColor:new Gt,groundColor:new Gt};break;case"RectAreaLight":n={color:new Gt,position:new L,halfWidth:new L,halfHeight:new L};break}return e[t.id]=n,n}}}function sR(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new At};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new At};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new At,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=n,n}}}var rR=0;function oR(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function aR(e){let t=new iR,n=sR(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new L);let s=new L,r=new pe,a=new pe;function o(l){let u=0,h=0,f=0;for(let x=0;x<9;x++)i.probe[x].set(0,0,0);let p=0,m=0,y=0,g=0,d=0,_=0,w=0,b=0,A=0,S=0,T=0;l.sort(oR);for(let x=0,v=l.length;x<v;x++){let R=l[x],D=R.color,B=R.intensity,V=R.distance,X=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)u+=D.r*B,h+=D.g*B,f+=D.b*B;else if(R.isLightProbe){for(let z=0;z<9;z++)i.probe[z].addScaledVector(R.sh.coefficients[z],B);T++}else if(R.isDirectionalLight){let z=t.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let Z=R.shadow,$=n.get(R);$.shadowIntensity=Z.intensity,$.shadowBias=Z.bias,$.shadowNormalBias=Z.normalBias,$.shadowRadius=Z.radius,$.shadowMapSize=Z.mapSize,i.directionalShadow[p]=$,i.directionalShadowMap[p]=X,i.directionalShadowMatrix[p]=R.shadow.matrix,_++}i.directional[p]=z,p++}else if(R.isSpotLight){let z=t.get(R);z.position.setFromMatrixPosition(R.matrixWorld),z.color.copy(D).multiplyScalar(B),z.distance=V,z.coneCos=Math.cos(R.angle),z.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),z.decay=R.decay,i.spot[y]=z;let Z=R.shadow;if(R.map&&(i.spotLightMap[A]=R.map,A++,Z.updateMatrices(R),R.castShadow&&S++),i.spotLightMatrix[y]=Z.matrix,R.castShadow){let $=n.get(R);$.shadowIntensity=Z.intensity,$.shadowBias=Z.bias,$.shadowNormalBias=Z.normalBias,$.shadowRadius=Z.radius,$.shadowMapSize=Z.mapSize,i.spotShadow[y]=$,i.spotShadowMap[y]=X,b++}y++}else if(R.isRectAreaLight){let z=t.get(R);z.color.copy(D).multiplyScalar(B),z.halfWidth.set(R.width*.5,0,0),z.halfHeight.set(0,R.height*.5,0),i.rectArea[g]=z,g++}else if(R.isPointLight){let z=t.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity),z.distance=R.distance,z.decay=R.decay,R.castShadow){let Z=R.shadow,$=n.get(R);$.shadowIntensity=Z.intensity,$.shadowBias=Z.bias,$.shadowNormalBias=Z.normalBias,$.shadowRadius=Z.radius,$.shadowMapSize=Z.mapSize,$.shadowCameraNear=Z.camera.near,$.shadowCameraFar=Z.camera.far,i.pointShadow[m]=$,i.pointShadowMap[m]=X,i.pointShadowMatrix[m]=R.shadow.matrix,w++}i.point[m]=z,m++}else if(R.isHemisphereLight){let z=t.get(R);z.skyColor.copy(R.color).multiplyScalar(B),z.groundColor.copy(R.groundColor).multiplyScalar(B),i.hemi[d]=z,d++}}g>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=dt.LTC_FLOAT_1,i.rectAreaLTC2=dt.LTC_FLOAT_2):(i.rectAreaLTC1=dt.LTC_HALF_1,i.rectAreaLTC2=dt.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=f;let I=i.hash;(I.directionalLength!==p||I.pointLength!==m||I.spotLength!==y||I.rectAreaLength!==g||I.hemiLength!==d||I.numDirectionalShadows!==_||I.numPointShadows!==w||I.numSpotShadows!==b||I.numSpotMaps!==A||I.numLightProbes!==T)&&(i.directional.length=p,i.spot.length=y,i.rectArea.length=g,i.point.length=m,i.hemi.length=d,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=w,i.pointShadowMap.length=w,i.spotShadow.length=b,i.spotShadowMap.length=b,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=w,i.spotLightMatrix.length=b+A-S,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=T,I.directionalLength=p,I.pointLength=m,I.spotLength=y,I.rectAreaLength=g,I.hemiLength=d,I.numDirectionalShadows=_,I.numPointShadows=w,I.numSpotShadows=b,I.numSpotMaps=A,I.numLightProbes=T,i.version=rR++)}function c(l,u){let h=0,f=0,p=0,m=0,y=0,g=u.matrixWorldInverse;for(let d=0,_=l.length;d<_;d++){let w=l[d];if(w.isDirectionalLight){let b=i.directional[h];b.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),h++}else if(w.isSpotLight){let b=i.spot[p];b.position.setFromMatrixPosition(w.matrixWorld),b.position.applyMatrix4(g),b.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),p++}else if(w.isRectAreaLight){let b=i.rectArea[m];b.position.setFromMatrixPosition(w.matrixWorld),b.position.applyMatrix4(g),a.identity(),r.copy(w.matrixWorld),r.premultiply(g),a.extractRotation(r),b.halfWidth.set(w.width*.5,0,0),b.halfHeight.set(0,w.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),m++}else if(w.isPointLight){let b=i.point[f];b.position.setFromMatrixPosition(w.matrixWorld),b.position.applyMatrix4(g),f++}else if(w.isHemisphereLight){let b=i.hemi[y];b.direction.setFromMatrixPosition(w.matrixWorld),b.direction.transformDirection(g),y++}}}return{setup:o,setupView:c,state:i}}function tx(e){let t=new aR(e),n=[],i=[];function s(u){l.camera=u,n.length=0,i.length=0}function r(u){n.push(u)}function a(u){i.push(u)}function o(){t.setup(n)}function c(u){t.setupView(n,u)}let l={lightsArray:n,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function lR(e){let t=new WeakMap;function n(s,r=0){let a=t.get(s),o;return a===void 0?(o=new tx(e),t.set(s,[o])):r>=a.length?(o=new tx(e),a.push(o)):o=a[r],o}function i(){t=new WeakMap}return{get:n,dispose:i}}var cR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,uR=`uniform sampler2D shadow_pass;
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
}`;function hR(e,t,n){let i=new Po,s=new At,r=new At,a=new de,o=new Yc({depthPacking:xy}),c=new Kc,l={},u=n.maxTextureSize,h={[vs]:mn,[mn]:vs,[Gn]:Gn},f=new Ii({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new At},radius:{value:4}},vertexShader:cR,fragmentShader:uR}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new En;m.setAttribute("position",new ln(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new q(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Qf;let d=this.type;this.render=function(S,T,I){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;let x=e.getRenderTarget(),v=e.getActiveCubeFace(),R=e.getActiveMipmapLevel(),D=e.state;D.setBlending(ws),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);let B=d!==ns&&this.type===ns,V=d===ns&&this.type!==ns;for(let X=0,z=S.length;X<z;X++){let Z=S[X],$=Z.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);let lt=$.getFrameExtents();if(s.multiply(lt),r.copy($.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/lt.x),s.x=r.x*lt.x,$.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/lt.y),s.y=r.y*lt.y,$.mapSize.y=r.y)),$.map===null||B===!0||V===!0){let vt=this.type!==ns?{minFilter:$n,magFilter:$n}:{};$.map!==null&&$.map.dispose(),$.map=new Qi(s.x,s.y,vt),$.map.texture.name=Z.name+".shadowMap",$.camera.updateProjectionMatrix()}e.setRenderTarget($.map),e.clear();let ht=$.getViewportCount();for(let vt=0;vt<ht;vt++){let qt=$.getViewport(vt);a.set(r.x*qt.x,r.y*qt.y,r.x*qt.z,r.y*qt.w),D.viewport(a),$.updateMatrices(Z,vt),i=$.getFrustum(),b(T,I,$.camera,Z,this.type)}$.isPointLightShadow!==!0&&this.type===ns&&_($,I),$.needsUpdate=!1}d=this.type,g.needsUpdate=!1,e.setRenderTarget(x,v,R)};function _(S,T){let I=t.update(y);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,p.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Qi(s.x,s.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,e.setRenderTarget(S.mapPass),e.clear(),e.renderBufferDirect(T,null,I,f,y,null),p.uniforms.shadow_pass.value=S.mapPass.texture,p.uniforms.resolution.value=S.mapSize,p.uniforms.radius.value=S.radius,e.setRenderTarget(S.map),e.clear(),e.renderBufferDirect(T,null,I,p,y,null)}function w(S,T,I,x){let v=null,R=I.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(R!==void 0)v=R;else if(v=I.isPointLight===!0?c:o,e.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){let D=v.uuid,B=T.uuid,V=l[D];V===void 0&&(V={},l[D]=V);let X=V[B];X===void 0&&(X=v.clone(),V[B]=X,T.addEventListener("dispose",A)),v=X}if(v.visible=T.visible,v.wireframe=T.wireframe,x===ns?v.side=T.shadowSide!==null?T.shadowSide:T.side:v.side=T.shadowSide!==null?T.shadowSide:h[T.side],v.alphaMap=T.alphaMap,v.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,v.map=T.map,v.clipShadows=T.clipShadows,v.clippingPlanes=T.clippingPlanes,v.clipIntersection=T.clipIntersection,v.displacementMap=T.displacementMap,v.displacementScale=T.displacementScale,v.displacementBias=T.displacementBias,v.wireframeLinewidth=T.wireframeLinewidth,v.linewidth=T.linewidth,I.isPointLight===!0&&v.isMeshDistanceMaterial===!0){let D=e.properties.get(v);D.light=I}return v}function b(S,T,I,x,v){if(S.visible===!1)return;if(S.layers.test(T.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&v===ns)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,S.matrixWorld);let B=t.update(S),V=S.material;if(Array.isArray(V)){let X=B.groups;for(let z=0,Z=X.length;z<Z;z++){let $=X[z],lt=V[$.materialIndex];if(lt&&lt.visible){let ht=w(S,lt,x,v);S.onBeforeShadow(e,S,T,I,B,ht,$),e.renderBufferDirect(I,null,B,ht,S,$),S.onAfterShadow(e,S,T,I,B,ht,$)}}}else if(V.visible){let X=w(S,V,x,v);S.onBeforeShadow(e,S,T,I,B,X,null),e.renderBufferDirect(I,null,B,X,S,null),S.onAfterShadow(e,S,T,I,B,X,null)}}let D=S.children;for(let B=0,V=D.length;B<V;B++)b(D[B],T,I,x,v)}function A(S){S.target.removeEventListener("dispose",A);for(let I in l){let x=l[I],v=S.target.uuid;v in x&&(x[v].dispose(),delete x[v])}}}var dR={[cu]:uu,[hu]:pu,[du]:mu,[Cr]:fu,[uu]:cu,[pu]:hu,[mu]:du,[fu]:Cr};function fR(e,t){function n(){let N=!1,at=new de,ut=null,xt=new de(0,0,0,0);return{setMask:function(st){ut!==st&&!N&&(e.colorMask(st,st,st,st),ut=st)},setLocked:function(st){N=st},setClear:function(st,J,bt,Bt,Te){Te===!0&&(st*=Bt,J*=Bt,bt*=Bt),at.set(st,J,bt,Bt),xt.equals(at)===!1&&(e.clearColor(st,J,bt,Bt),xt.copy(at))},reset:function(){N=!1,ut=null,xt.set(-1,0,0,0)}}}function i(){let N=!1,at=!1,ut=null,xt=null,st=null;return{setReversed:function(J){if(at!==J){let bt=t.get("EXT_clip_control");J?bt.clipControlEXT(bt.LOWER_LEFT_EXT,bt.ZERO_TO_ONE_EXT):bt.clipControlEXT(bt.LOWER_LEFT_EXT,bt.NEGATIVE_ONE_TO_ONE_EXT),at=J;let Bt=st;st=null,this.setClear(Bt)}},getReversed:function(){return at},setTest:function(J){J?tt(e.DEPTH_TEST):Q(e.DEPTH_TEST)},setMask:function(J){ut!==J&&!N&&(e.depthMask(J),ut=J)},setFunc:function(J){if(at&&(J=dR[J]),xt!==J){switch(J){case cu:e.depthFunc(e.NEVER);break;case uu:e.depthFunc(e.ALWAYS);break;case hu:e.depthFunc(e.LESS);break;case Cr:e.depthFunc(e.LEQUAL);break;case du:e.depthFunc(e.EQUAL);break;case fu:e.depthFunc(e.GEQUAL);break;case pu:e.depthFunc(e.GREATER);break;case mu:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}xt=J}},setLocked:function(J){N=J},setClear:function(J){st!==J&&(at&&(J=1-J),e.clearDepth(J),st=J)},reset:function(){N=!1,ut=null,xt=null,st=null,at=!1}}}function s(){let N=!1,at=null,ut=null,xt=null,st=null,J=null,bt=null,Bt=null,Te=null;return{setTest:function(ce){N||(ce?tt(e.STENCIL_TEST):Q(e.STENCIL_TEST))},setMask:function(ce){at!==ce&&!N&&(e.stencilMask(ce),at=ce)},setFunc:function(ce,hs,ji){(ut!==ce||xt!==hs||st!==ji)&&(e.stencilFunc(ce,hs,ji),ut=ce,xt=hs,st=ji)},setOp:function(ce,hs,ji){(J!==ce||bt!==hs||Bt!==ji)&&(e.stencilOp(ce,hs,ji),J=ce,bt=hs,Bt=ji)},setLocked:function(ce){N=ce},setClear:function(ce){Te!==ce&&(e.clearStencil(ce),Te=ce)},reset:function(){N=!1,at=null,ut=null,xt=null,st=null,J=null,bt=null,Bt=null,Te=null}}}let r=new n,a=new i,o=new s,c=new WeakMap,l=new WeakMap,u={},h={},f=new WeakMap,p=[],m=null,y=!1,g=null,d=null,_=null,w=null,b=null,A=null,S=null,T=new Gt(0,0,0),I=0,x=!1,v=null,R=null,D=null,B=null,V=null,X=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),z=!1,Z=0,$=e.getParameter(e.VERSION);$.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec($)[1]),z=Z>=1):$.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),z=Z>=2);let lt=null,ht={},vt=e.getParameter(e.SCISSOR_BOX),qt=e.getParameter(e.VIEWPORT),te=new de().fromArray(vt),Ee=new de().fromArray(qt);function se(N,at,ut,xt){let st=new Uint8Array(4),J=e.createTexture();e.bindTexture(N,J),e.texParameteri(N,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(N,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let bt=0;bt<ut;bt++)N===e.TEXTURE_3D||N===e.TEXTURE_2D_ARRAY?e.texImage3D(at,0,e.RGBA,1,1,xt,0,e.RGBA,e.UNSIGNED_BYTE,st):e.texImage2D(at+bt,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,st);return J}let K={};K[e.TEXTURE_2D]=se(e.TEXTURE_2D,e.TEXTURE_2D,1),K[e.TEXTURE_CUBE_MAP]=se(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[e.TEXTURE_2D_ARRAY]=se(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),K[e.TEXTURE_3D]=se(e.TEXTURE_3D,e.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),tt(e.DEPTH_TEST),a.setFunc(Cr),Ut(!1),wt(Jf),tt(e.CULL_FACE),re(ws);function tt(N){u[N]!==!0&&(e.enable(N),u[N]=!0)}function Q(N){u[N]!==!1&&(e.disable(N),u[N]=!1)}function it(N,at){return h[N]!==at?(e.bindFramebuffer(N,at),h[N]=at,N===e.DRAW_FRAMEBUFFER&&(h[e.FRAMEBUFFER]=at),N===e.FRAMEBUFFER&&(h[e.DRAW_FRAMEBUFFER]=at),!0):!1}function nt(N,at){let ut=p,xt=!1;if(N){ut=f.get(at),ut===void 0&&(ut=[],f.set(at,ut));let st=N.textures;if(ut.length!==st.length||ut[0]!==e.COLOR_ATTACHMENT0){for(let J=0,bt=st.length;J<bt;J++)ut[J]=e.COLOR_ATTACHMENT0+J;ut.length=st.length,xt=!0}}else ut[0]!==e.BACK&&(ut[0]=e.BACK,xt=!0);xt&&e.drawBuffers(ut)}function yt(N){return m!==N?(e.useProgram(N),m=N,!0):!1}let he={[Zs]:e.FUNC_ADD,[G0]:e.FUNC_SUBTRACT,[W0]:e.FUNC_REVERSE_SUBTRACT};he[q0]=e.MIN,he[X0]=e.MAX;let k={[j0]:e.ZERO,[Y0]:e.ONE,[K0]:e.SRC_COLOR,[Bc]:e.SRC_ALPHA,[ny]:e.SRC_ALPHA_SATURATE,[ty]:e.DST_COLOR,[J0]:e.DST_ALPHA,[Z0]:e.ONE_MINUS_SRC_COLOR,[Hc]:e.ONE_MINUS_SRC_ALPHA,[ey]:e.ONE_MINUS_DST_COLOR,[Q0]:e.ONE_MINUS_DST_ALPHA,[iy]:e.CONSTANT_COLOR,[sy]:e.ONE_MINUS_CONSTANT_COLOR,[ry]:e.CONSTANT_ALPHA,[oy]:e.ONE_MINUS_CONSTANT_ALPHA};function re(N,at,ut,xt,st,J,bt,Bt,Te,ce){if(N===ws){y===!0&&(Q(e.BLEND),y=!1);return}if(y===!1&&(tt(e.BLEND),y=!0),N!==V0){if(N!==g||ce!==x){if((d!==Zs||b!==Zs)&&(e.blendEquation(e.FUNC_ADD),d=Zs,b=Zs),ce)switch(N){case Rr:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case tp:e.blendFunc(e.ONE,e.ONE);break;case ep:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case np:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Rr:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case tp:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case ep:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case np:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}_=null,w=null,A=null,S=null,T.set(0,0,0),I=0,g=N,x=ce}return}st=st||at,J=J||ut,bt=bt||xt,(at!==d||st!==b)&&(e.blendEquationSeparate(he[at],he[st]),d=at,b=st),(ut!==_||xt!==w||J!==A||bt!==S)&&(e.blendFuncSeparate(k[ut],k[xt],k[J],k[bt]),_=ut,w=xt,A=J,S=bt),(Bt.equals(T)===!1||Te!==I)&&(e.blendColor(Bt.r,Bt.g,Bt.b,Te),T.copy(Bt),I=Te),g=N,x=!1}function Ft(N,at){N.side===Gn?Q(e.CULL_FACE):tt(e.CULL_FACE);let ut=N.side===mn;at&&(ut=!ut),Ut(ut),N.blending===Rr&&N.transparent===!1?re(ws):re(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);let xt=N.stencilWrite;o.setTest(xt),xt&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Mt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?tt(e.SAMPLE_ALPHA_TO_COVERAGE):Q(e.SAMPLE_ALPHA_TO_COVERAGE)}function Ut(N){v!==N&&(N?e.frontFace(e.CW):e.frontFace(e.CCW),v=N)}function wt(N){N!==z0?(tt(e.CULL_FACE),N!==R&&(N===Jf?e.cullFace(e.BACK):N===$0?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):Q(e.CULL_FACE),R=N}function De(N){N!==D&&(z&&e.lineWidth(N),D=N)}function Mt(N,at,ut){N?(tt(e.POLYGON_OFFSET_FILL),(B!==at||V!==ut)&&(e.polygonOffset(at,ut),B=at,V=ut)):Q(e.POLYGON_OFFSET_FILL)}function Xt(N){N?tt(e.SCISSOR_TEST):Q(e.SCISSOR_TEST)}function rn(N){N===void 0&&(N=e.TEXTURE0+X-1),lt!==N&&(e.activeTexture(N),lt=N)}function ze(N,at,ut){ut===void 0&&(lt===null?ut=e.TEXTURE0+X-1:ut=lt);let xt=ht[ut];xt===void 0&&(xt={type:void 0,texture:void 0},ht[ut]=xt),(xt.type!==N||xt.texture!==at)&&(lt!==ut&&(e.activeTexture(ut),lt=ut),e.bindTexture(N,at||K[N]),xt.type=N,xt.texture=at)}function C(){let N=ht[lt];N!==void 0&&N.type!==void 0&&(e.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function M(){try{e.compressedTexImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function H(){try{e.compressedTexImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Y(){try{e.texSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function et(){try{e.texSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function j(){try{e.compressedTexSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Rt(){try{e.compressedTexSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ct(){try{e.texStorage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function St(){try{e.texStorage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Et(){try{e.texImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ot(){try{e.texImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function mt(N){te.equals(N)===!1&&(e.scissor(N.x,N.y,N.z,N.w),te.copy(N))}function Nt(N){Ee.equals(N)===!1&&(e.viewport(N.x,N.y,N.z,N.w),Ee.copy(N))}function Tt(N,at){let ut=l.get(at);ut===void 0&&(ut=new WeakMap,l.set(at,ut));let xt=ut.get(N);xt===void 0&&(xt=e.getUniformBlockIndex(at,N.name),ut.set(N,xt))}function ft(N,at){let xt=l.get(at).get(N);c.get(at)!==xt&&(e.uniformBlockBinding(at,xt,N.__bindingPointIndex),c.set(at,xt))}function Vt(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),a.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),u={},lt=null,ht={},h={},f=new WeakMap,p=[],m=null,y=!1,g=null,d=null,_=null,w=null,b=null,A=null,S=null,T=new Gt(0,0,0),I=0,x=!1,v=null,R=null,D=null,B=null,V=null,te.set(0,0,e.canvas.width,e.canvas.height),Ee.set(0,0,e.canvas.width,e.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:tt,disable:Q,bindFramebuffer:it,drawBuffers:nt,useProgram:yt,setBlending:re,setMaterial:Ft,setFlipSided:Ut,setCullFace:wt,setLineWidth:De,setPolygonOffset:Mt,setScissorTest:Xt,activeTexture:rn,bindTexture:ze,unbindTexture:C,compressedTexImage2D:M,compressedTexImage3D:H,texImage2D:Et,texImage3D:ot,updateUBOMapping:Tt,uniformBlockBinding:ft,texStorage2D:ct,texStorage3D:St,texSubImage2D:Y,texSubImage3D:et,compressedTexSubImage2D:j,compressedTexSubImage3D:Rt,scissor:mt,viewport:Nt,reset:Vt}}function pR(e,t,n,i,s,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new At,u=new WeakMap,h,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(C,M){return p?new OffscreenCanvas(C,M):Da("canvas")}function y(C,M,H){let Y=1,et=ze(C);if((et.width>H||et.height>H)&&(Y=H/Math.max(et.width,et.height)),Y<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let j=Math.floor(Y*et.width),Rt=Math.floor(Y*et.height);h===void 0&&(h=m(j,Rt));let ct=M?m(j,Rt):h;return ct.width=j,ct.height=Rt,ct.getContext("2d").drawImage(C,0,0,j,Rt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+et.width+"x"+et.height+") to ("+j+"x"+Rt+")."),ct}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+et.width+"x"+et.height+")."),C;return C}function g(C){return C.generateMipmaps}function d(C){e.generateMipmap(C)}function _(C){return C.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?e.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function w(C,M,H,Y,et=!1){if(C!==null){if(e[C]!==void 0)return e[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let j=M;if(M===e.RED&&(H===e.FLOAT&&(j=e.R32F),H===e.HALF_FLOAT&&(j=e.R16F),H===e.UNSIGNED_BYTE&&(j=e.R8)),M===e.RED_INTEGER&&(H===e.UNSIGNED_BYTE&&(j=e.R8UI),H===e.UNSIGNED_SHORT&&(j=e.R16UI),H===e.UNSIGNED_INT&&(j=e.R32UI),H===e.BYTE&&(j=e.R8I),H===e.SHORT&&(j=e.R16I),H===e.INT&&(j=e.R32I)),M===e.RG&&(H===e.FLOAT&&(j=e.RG32F),H===e.HALF_FLOAT&&(j=e.RG16F),H===e.UNSIGNED_BYTE&&(j=e.RG8)),M===e.RG_INTEGER&&(H===e.UNSIGNED_BYTE&&(j=e.RG8UI),H===e.UNSIGNED_SHORT&&(j=e.RG16UI),H===e.UNSIGNED_INT&&(j=e.RG32UI),H===e.BYTE&&(j=e.RG8I),H===e.SHORT&&(j=e.RG16I),H===e.INT&&(j=e.RG32I)),M===e.RGB_INTEGER&&(H===e.UNSIGNED_BYTE&&(j=e.RGB8UI),H===e.UNSIGNED_SHORT&&(j=e.RGB16UI),H===e.UNSIGNED_INT&&(j=e.RGB32UI),H===e.BYTE&&(j=e.RGB8I),H===e.SHORT&&(j=e.RGB16I),H===e.INT&&(j=e.RGB32I)),M===e.RGBA_INTEGER&&(H===e.UNSIGNED_BYTE&&(j=e.RGBA8UI),H===e.UNSIGNED_SHORT&&(j=e.RGBA16UI),H===e.UNSIGNED_INT&&(j=e.RGBA32UI),H===e.BYTE&&(j=e.RGBA8I),H===e.SHORT&&(j=e.RGBA16I),H===e.INT&&(j=e.RGBA32I)),M===e.RGB&&(H===e.UNSIGNED_INT_5_9_9_9_REV&&(j=e.RGB9_E5),H===e.UNSIGNED_INT_10F_11F_11F_REV&&(j=e.R11F_G11F_B10F)),M===e.RGBA){let Rt=et?ka:ne.getTransfer(Y);H===e.FLOAT&&(j=e.RGBA32F),H===e.HALF_FLOAT&&(j=e.RGBA16F),H===e.UNSIGNED_BYTE&&(j=Rt===fe?e.SRGB8_ALPHA8:e.RGBA8),H===e.UNSIGNED_SHORT_4_4_4_4&&(j=e.RGBA4),H===e.UNSIGNED_SHORT_5_5_5_1&&(j=e.RGB5_A1)}return(j===e.R16F||j===e.R32F||j===e.RG16F||j===e.RG32F||j===e.RGBA16F||j===e.RGBA32F)&&t.get("EXT_color_buffer_float"),j}function b(C,M){let H;return C?M===null||M===nr||M===Fo?H=e.DEPTH24_STENCIL8:M===Li?H=e.DEPTH32F_STENCIL8:M===Uo&&(H=e.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===nr||M===Fo?H=e.DEPTH_COMPONENT24:M===Li?H=e.DEPTH_COMPONENT32F:M===Uo&&(H=e.DEPTH_COMPONENT16),H}function A(C,M){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==$n&&C.minFilter!==Ci?Math.log2(Math.max(M.width,M.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?M.mipmaps.length:1}function S(C){let M=C.target;M.removeEventListener("dispose",S),I(M),M.isVideoTexture&&u.delete(M)}function T(C){let M=C.target;M.removeEventListener("dispose",T),v(M)}function I(C){let M=i.get(C);if(M.__webglInit===void 0)return;let H=C.source,Y=f.get(H);if(Y){let et=Y[M.__cacheKey];et.usedTimes--,et.usedTimes===0&&x(C),Object.keys(Y).length===0&&f.delete(H)}i.remove(C)}function x(C){let M=i.get(C);e.deleteTexture(M.__webglTexture);let H=C.source,Y=f.get(H);delete Y[M.__cacheKey],a.memory.textures--}function v(C){let M=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(M.__webglFramebuffer[Y]))for(let et=0;et<M.__webglFramebuffer[Y].length;et++)e.deleteFramebuffer(M.__webglFramebuffer[Y][et]);else e.deleteFramebuffer(M.__webglFramebuffer[Y]);M.__webglDepthbuffer&&e.deleteRenderbuffer(M.__webglDepthbuffer[Y])}else{if(Array.isArray(M.__webglFramebuffer))for(let Y=0;Y<M.__webglFramebuffer.length;Y++)e.deleteFramebuffer(M.__webglFramebuffer[Y]);else e.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&e.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&e.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let Y=0;Y<M.__webglColorRenderbuffer.length;Y++)M.__webglColorRenderbuffer[Y]&&e.deleteRenderbuffer(M.__webglColorRenderbuffer[Y]);M.__webglDepthRenderbuffer&&e.deleteRenderbuffer(M.__webglDepthRenderbuffer)}let H=C.textures;for(let Y=0,et=H.length;Y<et;Y++){let j=i.get(H[Y]);j.__webglTexture&&(e.deleteTexture(j.__webglTexture),a.memory.textures--),i.remove(H[Y])}i.remove(C)}let R=0;function D(){R=0}function B(){let C=R;return C>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),R+=1,C}function V(C){let M=[];return M.push(C.wrapS),M.push(C.wrapT),M.push(C.wrapR||0),M.push(C.magFilter),M.push(C.minFilter),M.push(C.anisotropy),M.push(C.internalFormat),M.push(C.format),M.push(C.type),M.push(C.generateMipmaps),M.push(C.premultiplyAlpha),M.push(C.flipY),M.push(C.unpackAlignment),M.push(C.colorSpace),M.join()}function X(C,M){let H=i.get(C);if(C.isVideoTexture&&Xt(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&H.__version!==C.version){let Y=C.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(H,C,M);return}}else C.isExternalTexture&&(H.__webglTexture=C.sourceTexture?C.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,H.__webglTexture,e.TEXTURE0+M)}function z(C,M){let H=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){K(H,C,M);return}n.bindTexture(e.TEXTURE_2D_ARRAY,H.__webglTexture,e.TEXTURE0+M)}function Z(C,M){let H=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){K(H,C,M);return}n.bindTexture(e.TEXTURE_3D,H.__webglTexture,e.TEXTURE0+M)}function $(C,M){let H=i.get(C);if(C.version>0&&H.__version!==C.version){tt(H,C,M);return}n.bindTexture(e.TEXTURE_CUBE_MAP,H.__webglTexture,e.TEXTURE0+M)}let lt={[Mo]:e.REPEAT,[Ks]:e.CLAMP_TO_EDGE,[zc]:e.MIRRORED_REPEAT},ht={[$n]:e.NEAREST,[gy]:e.NEAREST_MIPMAP_NEAREST,[il]:e.NEAREST_MIPMAP_LINEAR,[Ci]:e.LINEAR,[_u]:e.LINEAR_MIPMAP_NEAREST,[er]:e.LINEAR_MIPMAP_LINEAR},vt={[vy]:e.NEVER,[Ty]:e.ALWAYS,[by]:e.LESS,[hp]:e.LEQUAL,[wy]:e.EQUAL,[Ey]:e.GEQUAL,[My]:e.GREATER,[Sy]:e.NOTEQUAL};function qt(C,M){if(M.type===Li&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===Ci||M.magFilter===_u||M.magFilter===il||M.magFilter===er||M.minFilter===Ci||M.minFilter===_u||M.minFilter===il||M.minFilter===er)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(C,e.TEXTURE_WRAP_S,lt[M.wrapS]),e.texParameteri(C,e.TEXTURE_WRAP_T,lt[M.wrapT]),(C===e.TEXTURE_3D||C===e.TEXTURE_2D_ARRAY)&&e.texParameteri(C,e.TEXTURE_WRAP_R,lt[M.wrapR]),e.texParameteri(C,e.TEXTURE_MAG_FILTER,ht[M.magFilter]),e.texParameteri(C,e.TEXTURE_MIN_FILTER,ht[M.minFilter]),M.compareFunction&&(e.texParameteri(C,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(C,e.TEXTURE_COMPARE_FUNC,vt[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===$n||M.minFilter!==il&&M.minFilter!==er||M.type===Li&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){let H=t.get("EXT_texture_filter_anisotropic");e.texParameterf(C,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function te(C,M){let H=!1;C.__webglInit===void 0&&(C.__webglInit=!0,M.addEventListener("dispose",S));let Y=M.source,et=f.get(Y);et===void 0&&(et={},f.set(Y,et));let j=V(M);if(j!==C.__cacheKey){et[j]===void 0&&(et[j]={texture:e.createTexture(),usedTimes:0},a.memory.textures++,H=!0),et[j].usedTimes++;let Rt=et[C.__cacheKey];Rt!==void 0&&(et[C.__cacheKey].usedTimes--,Rt.usedTimes===0&&x(M)),C.__cacheKey=j,C.__webglTexture=et[j].texture}return H}function Ee(C,M,H){return Math.floor(Math.floor(C/H)/M)}function se(C,M,H,Y){let j=C.updateRanges;if(j.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,M.width,M.height,H,Y,M.data);else{j.sort((ot,mt)=>ot.start-mt.start);let Rt=0;for(let ot=1;ot<j.length;ot++){let mt=j[Rt],Nt=j[ot],Tt=mt.start+mt.count,ft=Ee(Nt.start,M.width,4),Vt=Ee(mt.start,M.width,4);Nt.start<=Tt+1&&ft===Vt&&Ee(Nt.start+Nt.count-1,M.width,4)===ft?mt.count=Math.max(mt.count,Nt.start+Nt.count-mt.start):(++Rt,j[Rt]=Nt)}j.length=Rt+1;let ct=e.getParameter(e.UNPACK_ROW_LENGTH),St=e.getParameter(e.UNPACK_SKIP_PIXELS),Et=e.getParameter(e.UNPACK_SKIP_ROWS);e.pixelStorei(e.UNPACK_ROW_LENGTH,M.width);for(let ot=0,mt=j.length;ot<mt;ot++){let Nt=j[ot],Tt=Math.floor(Nt.start/4),ft=Math.ceil(Nt.count/4),Vt=Tt%M.width,N=Math.floor(Tt/M.width),at=ft,ut=1;e.pixelStorei(e.UNPACK_SKIP_PIXELS,Vt),e.pixelStorei(e.UNPACK_SKIP_ROWS,N),n.texSubImage2D(e.TEXTURE_2D,0,Vt,N,at,ut,H,Y,M.data)}C.clearUpdateRanges(),e.pixelStorei(e.UNPACK_ROW_LENGTH,ct),e.pixelStorei(e.UNPACK_SKIP_PIXELS,St),e.pixelStorei(e.UNPACK_SKIP_ROWS,Et)}}function K(C,M,H){let Y=e.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(Y=e.TEXTURE_2D_ARRAY),M.isData3DTexture&&(Y=e.TEXTURE_3D);let et=te(C,M),j=M.source;n.bindTexture(Y,C.__webglTexture,e.TEXTURE0+H);let Rt=i.get(j);if(j.version!==Rt.__version||et===!0){n.activeTexture(e.TEXTURE0+H);let ct=ne.getPrimaries(ne.workingColorSpace),St=M.colorSpace===Di?null:ne.getPrimaries(M.colorSpace),Et=M.colorSpace===Di||ct===St?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,M.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,M.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,Et);let ot=y(M.image,!1,s.maxTextureSize);ot=rn(M,ot);let mt=r.convert(M.format,M.colorSpace),Nt=r.convert(M.type),Tt=w(M.internalFormat,mt,Nt,M.colorSpace,M.isVideoTexture);qt(Y,M);let ft,Vt=M.mipmaps,N=M.isVideoTexture!==!0,at=Rt.__version===void 0||et===!0,ut=j.dataReady,xt=A(M,ot);if(M.isDepthTexture)Tt=b(M.format===Bo,M.type),at&&(N?n.texStorage2D(e.TEXTURE_2D,1,Tt,ot.width,ot.height):n.texImage2D(e.TEXTURE_2D,0,Tt,ot.width,ot.height,0,mt,Nt,null));else if(M.isDataTexture)if(Vt.length>0){N&&at&&n.texStorage2D(e.TEXTURE_2D,xt,Tt,Vt[0].width,Vt[0].height);for(let st=0,J=Vt.length;st<J;st++)ft=Vt[st],N?ut&&n.texSubImage2D(e.TEXTURE_2D,st,0,0,ft.width,ft.height,mt,Nt,ft.data):n.texImage2D(e.TEXTURE_2D,st,Tt,ft.width,ft.height,0,mt,Nt,ft.data);M.generateMipmaps=!1}else N?(at&&n.texStorage2D(e.TEXTURE_2D,xt,Tt,ot.width,ot.height),ut&&se(M,ot,mt,Nt)):n.texImage2D(e.TEXTURE_2D,0,Tt,ot.width,ot.height,0,mt,Nt,ot.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){N&&at&&n.texStorage3D(e.TEXTURE_2D_ARRAY,xt,Tt,Vt[0].width,Vt[0].height,ot.depth);for(let st=0,J=Vt.length;st<J;st++)if(ft=Vt[st],M.format!==gi)if(mt!==null)if(N){if(ut)if(M.layerUpdates.size>0){let bt=xp(ft.width,ft.height,M.format,M.type);for(let Bt of M.layerUpdates){let Te=ft.data.subarray(Bt*bt/ft.data.BYTES_PER_ELEMENT,(Bt+1)*bt/ft.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,st,0,0,Bt,ft.width,ft.height,1,mt,Te)}M.clearLayerUpdates()}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,st,0,0,0,ft.width,ft.height,ot.depth,mt,ft.data)}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,st,Tt,ft.width,ft.height,ot.depth,0,ft.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else N?ut&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,st,0,0,0,ft.width,ft.height,ot.depth,mt,Nt,ft.data):n.texImage3D(e.TEXTURE_2D_ARRAY,st,Tt,ft.width,ft.height,ot.depth,0,mt,Nt,ft.data)}else{N&&at&&n.texStorage2D(e.TEXTURE_2D,xt,Tt,Vt[0].width,Vt[0].height);for(let st=0,J=Vt.length;st<J;st++)ft=Vt[st],M.format!==gi?mt!==null?N?ut&&n.compressedTexSubImage2D(e.TEXTURE_2D,st,0,0,ft.width,ft.height,mt,ft.data):n.compressedTexImage2D(e.TEXTURE_2D,st,Tt,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):N?ut&&n.texSubImage2D(e.TEXTURE_2D,st,0,0,ft.width,ft.height,mt,Nt,ft.data):n.texImage2D(e.TEXTURE_2D,st,Tt,ft.width,ft.height,0,mt,Nt,ft.data)}else if(M.isDataArrayTexture)if(N){if(at&&n.texStorage3D(e.TEXTURE_2D_ARRAY,xt,Tt,ot.width,ot.height,ot.depth),ut)if(M.layerUpdates.size>0){let st=xp(ot.width,ot.height,M.format,M.type);for(let J of M.layerUpdates){let bt=ot.data.subarray(J*st/ot.data.BYTES_PER_ELEMENT,(J+1)*st/ot.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,J,ot.width,ot.height,1,mt,Nt,bt)}M.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,ot.width,ot.height,ot.depth,mt,Nt,ot.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,Tt,ot.width,ot.height,ot.depth,0,mt,Nt,ot.data);else if(M.isData3DTexture)N?(at&&n.texStorage3D(e.TEXTURE_3D,xt,Tt,ot.width,ot.height,ot.depth),ut&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,ot.width,ot.height,ot.depth,mt,Nt,ot.data)):n.texImage3D(e.TEXTURE_3D,0,Tt,ot.width,ot.height,ot.depth,0,mt,Nt,ot.data);else if(M.isFramebufferTexture){if(at)if(N)n.texStorage2D(e.TEXTURE_2D,xt,Tt,ot.width,ot.height);else{let st=ot.width,J=ot.height;for(let bt=0;bt<xt;bt++)n.texImage2D(e.TEXTURE_2D,bt,Tt,st,J,0,mt,Nt,null),st>>=1,J>>=1}}else if(Vt.length>0){if(N&&at){let st=ze(Vt[0]);n.texStorage2D(e.TEXTURE_2D,xt,Tt,st.width,st.height)}for(let st=0,J=Vt.length;st<J;st++)ft=Vt[st],N?ut&&n.texSubImage2D(e.TEXTURE_2D,st,0,0,mt,Nt,ft):n.texImage2D(e.TEXTURE_2D,st,Tt,mt,Nt,ft);M.generateMipmaps=!1}else if(N){if(at){let st=ze(ot);n.texStorage2D(e.TEXTURE_2D,xt,Tt,st.width,st.height)}ut&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,mt,Nt,ot)}else n.texImage2D(e.TEXTURE_2D,0,Tt,mt,Nt,ot);g(M)&&d(Y),Rt.__version=j.version,M.onUpdate&&M.onUpdate(M)}C.__version=M.version}function tt(C,M,H){if(M.image.length!==6)return;let Y=te(C,M),et=M.source;n.bindTexture(e.TEXTURE_CUBE_MAP,C.__webglTexture,e.TEXTURE0+H);let j=i.get(et);if(et.version!==j.__version||Y===!0){n.activeTexture(e.TEXTURE0+H);let Rt=ne.getPrimaries(ne.workingColorSpace),ct=M.colorSpace===Di?null:ne.getPrimaries(M.colorSpace),St=M.colorSpace===Di||Rt===ct?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,M.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,M.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,St);let Et=M.isCompressedTexture||M.image[0].isCompressedTexture,ot=M.image[0]&&M.image[0].isDataTexture,mt=[];for(let J=0;J<6;J++)!Et&&!ot?mt[J]=y(M.image[J],!0,s.maxCubemapSize):mt[J]=ot?M.image[J].image:M.image[J],mt[J]=rn(M,mt[J]);let Nt=mt[0],Tt=r.convert(M.format,M.colorSpace),ft=r.convert(M.type),Vt=w(M.internalFormat,Tt,ft,M.colorSpace),N=M.isVideoTexture!==!0,at=j.__version===void 0||Y===!0,ut=et.dataReady,xt=A(M,Nt);qt(e.TEXTURE_CUBE_MAP,M);let st;if(Et){N&&at&&n.texStorage2D(e.TEXTURE_CUBE_MAP,xt,Vt,Nt.width,Nt.height);for(let J=0;J<6;J++){st=mt[J].mipmaps;for(let bt=0;bt<st.length;bt++){let Bt=st[bt];M.format!==gi?Tt!==null?N?ut&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,bt,0,0,Bt.width,Bt.height,Tt,Bt.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,bt,Vt,Bt.width,Bt.height,0,Bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?ut&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,bt,0,0,Bt.width,Bt.height,Tt,ft,Bt.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,bt,Vt,Bt.width,Bt.height,0,Tt,ft,Bt.data)}}}else{if(st=M.mipmaps,N&&at){st.length>0&&xt++;let J=ze(mt[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,xt,Vt,J.width,J.height)}for(let J=0;J<6;J++)if(ot){N?ut&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,mt[J].width,mt[J].height,Tt,ft,mt[J].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Vt,mt[J].width,mt[J].height,0,Tt,ft,mt[J].data);for(let bt=0;bt<st.length;bt++){let Te=st[bt].image[J].image;N?ut&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,bt+1,0,0,Te.width,Te.height,Tt,ft,Te.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,bt+1,Vt,Te.width,Te.height,0,Tt,ft,Te.data)}}else{N?ut&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Tt,ft,mt[J]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Vt,Tt,ft,mt[J]);for(let bt=0;bt<st.length;bt++){let Bt=st[bt];N?ut&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,bt+1,0,0,Tt,ft,Bt.image[J]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,bt+1,Vt,Tt,ft,Bt.image[J])}}}g(M)&&d(e.TEXTURE_CUBE_MAP),j.__version=et.version,M.onUpdate&&M.onUpdate(M)}C.__version=M.version}function Q(C,M,H,Y,et,j){let Rt=r.convert(H.format,H.colorSpace),ct=r.convert(H.type),St=w(H.internalFormat,Rt,ct,H.colorSpace),Et=i.get(M),ot=i.get(H);if(ot.__renderTarget=M,!Et.__hasExternalTextures){let mt=Math.max(1,M.width>>j),Nt=Math.max(1,M.height>>j);et===e.TEXTURE_3D||et===e.TEXTURE_2D_ARRAY?n.texImage3D(et,j,St,mt,Nt,M.depth,0,Rt,ct,null):n.texImage2D(et,j,St,mt,Nt,0,Rt,ct,null)}n.bindFramebuffer(e.FRAMEBUFFER,C),Mt(M)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,Y,et,ot.__webglTexture,0,De(M)):(et===e.TEXTURE_2D||et>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&et<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,Y,et,ot.__webglTexture,j),n.bindFramebuffer(e.FRAMEBUFFER,null)}function it(C,M,H){if(e.bindRenderbuffer(e.RENDERBUFFER,C),M.depthBuffer){let Y=M.depthTexture,et=Y&&Y.isDepthTexture?Y.type:null,j=b(M.stencilBuffer,et),Rt=M.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ct=De(M);Mt(M)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,ct,j,M.width,M.height):H?e.renderbufferStorageMultisample(e.RENDERBUFFER,ct,j,M.width,M.height):e.renderbufferStorage(e.RENDERBUFFER,j,M.width,M.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,Rt,e.RENDERBUFFER,C)}else{let Y=M.textures;for(let et=0;et<Y.length;et++){let j=Y[et],Rt=r.convert(j.format,j.colorSpace),ct=r.convert(j.type),St=w(j.internalFormat,Rt,ct,j.colorSpace),Et=De(M);H&&Mt(M)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,Et,St,M.width,M.height):Mt(M)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Et,St,M.width,M.height):e.renderbufferStorage(e.RENDERBUFFER,St,M.width,M.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function nt(C,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(e.FRAMEBUFFER,C),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let Y=i.get(M.depthTexture);Y.__renderTarget=M,(!Y.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),X(M.depthTexture,0);let et=Y.__webglTexture,j=De(M);if(M.depthTexture.format===So)Mt(M)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,et,0,j):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,et,0);else if(M.depthTexture.format===Bo)Mt(M)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,et,0,j):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,et,0);else throw new Error("Unknown depthTexture format")}function yt(C){let M=i.get(C),H=C.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==C.depthTexture){let Y=C.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),Y){let et=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,Y.removeEventListener("dispose",et)};Y.addEventListener("dispose",et),M.__depthDisposeCallback=et}M.__boundDepthTexture=Y}if(C.depthTexture&&!M.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");let Y=C.texture.mipmaps;Y&&Y.length>0?nt(M.__webglFramebuffer[0],C):nt(M.__webglFramebuffer,C)}else if(H){M.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(n.bindFramebuffer(e.FRAMEBUFFER,M.__webglFramebuffer[Y]),M.__webglDepthbuffer[Y]===void 0)M.__webglDepthbuffer[Y]=e.createRenderbuffer(),it(M.__webglDepthbuffer[Y],C,!1);else{let et=C.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,j=M.__webglDepthbuffer[Y];e.bindRenderbuffer(e.RENDERBUFFER,j),e.framebufferRenderbuffer(e.FRAMEBUFFER,et,e.RENDERBUFFER,j)}}else{let Y=C.texture.mipmaps;if(Y&&Y.length>0?n.bindFramebuffer(e.FRAMEBUFFER,M.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=e.createRenderbuffer(),it(M.__webglDepthbuffer,C,!1);else{let et=C.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,j=M.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,j),e.framebufferRenderbuffer(e.FRAMEBUFFER,et,e.RENDERBUFFER,j)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function he(C,M,H){let Y=i.get(C);M!==void 0&&Q(Y.__webglFramebuffer,C,C.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),H!==void 0&&yt(C)}function k(C){let M=C.texture,H=i.get(C),Y=i.get(M);C.addEventListener("dispose",T);let et=C.textures,j=C.isWebGLCubeRenderTarget===!0,Rt=et.length>1;if(Rt||(Y.__webglTexture===void 0&&(Y.__webglTexture=e.createTexture()),Y.__version=M.version,a.memory.textures++),j){H.__webglFramebuffer=[];for(let ct=0;ct<6;ct++)if(M.mipmaps&&M.mipmaps.length>0){H.__webglFramebuffer[ct]=[];for(let St=0;St<M.mipmaps.length;St++)H.__webglFramebuffer[ct][St]=e.createFramebuffer()}else H.__webglFramebuffer[ct]=e.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){H.__webglFramebuffer=[];for(let ct=0;ct<M.mipmaps.length;ct++)H.__webglFramebuffer[ct]=e.createFramebuffer()}else H.__webglFramebuffer=e.createFramebuffer();if(Rt)for(let ct=0,St=et.length;ct<St;ct++){let Et=i.get(et[ct]);Et.__webglTexture===void 0&&(Et.__webglTexture=e.createTexture(),a.memory.textures++)}if(C.samples>0&&Mt(C)===!1){H.__webglMultisampledFramebuffer=e.createFramebuffer(),H.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let ct=0;ct<et.length;ct++){let St=et[ct];H.__webglColorRenderbuffer[ct]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,H.__webglColorRenderbuffer[ct]);let Et=r.convert(St.format,St.colorSpace),ot=r.convert(St.type),mt=w(St.internalFormat,Et,ot,St.colorSpace,C.isXRRenderTarget===!0),Nt=De(C);e.renderbufferStorageMultisample(e.RENDERBUFFER,Nt,mt,C.width,C.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ct,e.RENDERBUFFER,H.__webglColorRenderbuffer[ct])}e.bindRenderbuffer(e.RENDERBUFFER,null),C.depthBuffer&&(H.__webglDepthRenderbuffer=e.createRenderbuffer(),it(H.__webglDepthRenderbuffer,C,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(j){n.bindTexture(e.TEXTURE_CUBE_MAP,Y.__webglTexture),qt(e.TEXTURE_CUBE_MAP,M);for(let ct=0;ct<6;ct++)if(M.mipmaps&&M.mipmaps.length>0)for(let St=0;St<M.mipmaps.length;St++)Q(H.__webglFramebuffer[ct][St],C,M,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ct,St);else Q(H.__webglFramebuffer[ct],C,M,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0);g(M)&&d(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Rt){for(let ct=0,St=et.length;ct<St;ct++){let Et=et[ct],ot=i.get(Et),mt=e.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(mt=C.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(mt,ot.__webglTexture),qt(mt,Et),Q(H.__webglFramebuffer,C,Et,e.COLOR_ATTACHMENT0+ct,mt,0),g(Et)&&d(mt)}n.unbindTexture()}else{let ct=e.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ct=C.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(ct,Y.__webglTexture),qt(ct,M),M.mipmaps&&M.mipmaps.length>0)for(let St=0;St<M.mipmaps.length;St++)Q(H.__webglFramebuffer[St],C,M,e.COLOR_ATTACHMENT0,ct,St);else Q(H.__webglFramebuffer,C,M,e.COLOR_ATTACHMENT0,ct,0);g(M)&&d(ct),n.unbindTexture()}C.depthBuffer&&yt(C)}function re(C){let M=C.textures;for(let H=0,Y=M.length;H<Y;H++){let et=M[H];if(g(et)){let j=_(C),Rt=i.get(et).__webglTexture;n.bindTexture(j,Rt),d(j),n.unbindTexture()}}}let Ft=[],Ut=[];function wt(C){if(C.samples>0){if(Mt(C)===!1){let M=C.textures,H=C.width,Y=C.height,et=e.COLOR_BUFFER_BIT,j=C.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,Rt=i.get(C),ct=M.length>1;if(ct)for(let Et=0;Et<M.length;Et++)n.bindFramebuffer(e.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Et,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,Rt.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+Et,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer);let St=C.texture.mipmaps;St&&St.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer);for(let Et=0;Et<M.length;Et++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(et|=e.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(et|=e.STENCIL_BUFFER_BIT)),ct){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,Rt.__webglColorRenderbuffer[Et]);let ot=i.get(M[Et]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,ot,0)}e.blitFramebuffer(0,0,H,Y,0,0,H,Y,et,e.NEAREST),c===!0&&(Ft.length=0,Ut.length=0,Ft.push(e.COLOR_ATTACHMENT0+Et),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Ft.push(j),Ut.push(j),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Ut)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ft))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),ct)for(let Et=0;Et<M.length;Et++){n.bindFramebuffer(e.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Et,e.RENDERBUFFER,Rt.__webglColorRenderbuffer[Et]);let ot=i.get(M[Et]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,Rt.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+Et,e.TEXTURE_2D,ot,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){let M=C.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[M])}}}function De(C){return Math.min(s.maxSamples,C.samples)}function Mt(C){let M=i.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Xt(C){let M=a.render.frame;u.get(C)!==M&&(u.set(C,M),C.update())}function rn(C,M){let H=C.colorSpace,Y=C.format,et=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||H!==Ir&&H!==Di&&(ne.getTransfer(H)===fe?(Y!==gi||et!==ki)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),M}function ze(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=B,this.resetTextureUnits=D,this.setTexture2D=X,this.setTexture2DArray=z,this.setTexture3D=Z,this.setTextureCube=$,this.rebindTextures=he,this.setupRenderTarget=k,this.updateRenderTargetMipmap=re,this.updateMultisampleRenderTarget=wt,this.setupDepthRenderbuffer=yt,this.setupFrameBufferTexture=Q,this.useMultisampledRTT=Mt}function mR(e,t){function n(i,s=Di){let r,a=ne.getTransfer(s);if(i===ki)return e.UNSIGNED_BYTE;if(i===bu)return e.UNSIGNED_SHORT_4_4_4_4;if(i===wu)return e.UNSIGNED_SHORT_5_5_5_1;if(i===op)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===ap)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===sp)return e.BYTE;if(i===rp)return e.SHORT;if(i===Uo)return e.UNSIGNED_SHORT;if(i===vu)return e.INT;if(i===nr)return e.UNSIGNED_INT;if(i===Li)return e.FLOAT;if(i===Oo)return e.HALF_FLOAT;if(i===lp)return e.ALPHA;if(i===cp)return e.RGB;if(i===gi)return e.RGBA;if(i===So)return e.DEPTH_COMPONENT;if(i===Bo)return e.DEPTH_STENCIL;if(i===Mu)return e.RED;if(i===Su)return e.RED_INTEGER;if(i===up)return e.RG;if(i===Eu)return e.RG_INTEGER;if(i===Tu)return e.RGBA_INTEGER;if(i===sl||i===rl||i===ol||i===al)if(a===fe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===sl)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===rl)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ol)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===al)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===sl)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===rl)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ol)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===al)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Au||i===Ru||i===Cu||i===Iu)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Au)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ru)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Cu)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Iu)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Pu||i===ku||i===Lu)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Pu||i===ku)return a===fe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Lu)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Du||i===Nu||i===Uu||i===Ou||i===Fu||i===Bu||i===Hu||i===zu||i===$u||i===Vu||i===Gu||i===Wu||i===qu||i===Xu)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Du)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Nu)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Uu)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ou)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Fu)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Bu)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Hu)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===zu)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===$u)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Vu)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Gu)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Wu)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===qu)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Xu)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ju||i===Yu||i===Ku)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===ju)return a===fe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Yu)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ku)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Zu||i===Ju||i===Qu||i===th)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===Zu)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Ju)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Qu)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===th)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Fo?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:n}}var gR=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,yR=`
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

}`,Pp=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,n){if(this.texture===null){let i=new $a(t.texture);(t.depthNear!==n.depthNear||t.depthFar!==n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let n=t.cameras[0].viewport,i=new Ii({vertexShader:gR,fragmentShader:yR,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new q(new Tn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},kp=class extends Ji{constructor(t,n){super();let i=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,u=null,h=null,f=null,p=null,m=null,y=typeof XRWebGLBinding<"u",g=new Pp,d={},_=n.getContextAttributes(),w=null,b=null,A=[],S=[],T=new At,I=null,x=new pn;x.viewport=new de;let v=new pn;v.viewport=new de;let R=[x,v],D=new au,B=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let tt=A[K];return tt===void 0&&(tt=new Co,A[K]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(K){let tt=A[K];return tt===void 0&&(tt=new Co,A[K]=tt),tt.getGripSpace()},this.getHand=function(K){let tt=A[K];return tt===void 0&&(tt=new Co,A[K]=tt),tt.getHandSpace()};function X(K){let tt=S.indexOf(K.inputSource);if(tt===-1)return;let Q=A[tt];Q!==void 0&&(Q.update(K.inputSource,K.frame,l||a),Q.dispatchEvent({type:K.type,data:K.inputSource}))}function z(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",Z);for(let K=0;K<A.length;K++){let tt=S[K];tt!==null&&(S[K]=null,A[K].disconnect(tt))}B=null,V=null,g.reset();for(let K in d)delete d[K];t.setRenderTarget(w),p=null,f=null,h=null,s=null,b=null,se.stop(),i.isPresenting=!1,t.setPixelRatio(I),t.setSize(T.width,T.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(K){l=K},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return h===null&&y&&(h=new XRWebGLBinding(s,n)),h},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(w=t.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",z),s.addEventListener("inputsourceschange",Z),_.xrCompatible!==!0&&await n.makeXRCompatible(),I=t.getPixelRatio(),t.getSize(T),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let Q=null,it=null,nt=null;_.depth&&(nt=_.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Q=_.stencil?Bo:So,it=_.stencil?Fo:nr);let yt={colorFormat:n.RGBA8,depthFormat:nt,scaleFactor:r};h=this.getBinding(),f=h.createProjectionLayer(yt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),b=new Qi(f.textureWidth,f.textureHeight,{format:gi,type:ki,depthTexture:new za(f.textureWidth,f.textureHeight,it,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let Q={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,n,Q),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),b=new Qi(p.framebufferWidth,p.framebufferHeight,{format:gi,type:ki,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),se.setContext(s),se.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function Z(K){for(let tt=0;tt<K.removed.length;tt++){let Q=K.removed[tt],it=S.indexOf(Q);it>=0&&(S[it]=null,A[it].disconnect(Q))}for(let tt=0;tt<K.added.length;tt++){let Q=K.added[tt],it=S.indexOf(Q);if(it===-1){for(let yt=0;yt<A.length;yt++)if(yt>=S.length){S.push(Q),it=yt;break}else if(S[yt]===null){S[yt]=Q,it=yt;break}if(it===-1)break}let nt=A[it];nt&&nt.connect(Q)}}let $=new L,lt=new L;function ht(K,tt,Q){$.setFromMatrixPosition(tt.matrixWorld),lt.setFromMatrixPosition(Q.matrixWorld);let it=$.distanceTo(lt),nt=tt.projectionMatrix.elements,yt=Q.projectionMatrix.elements,he=nt[14]/(nt[10]-1),k=nt[14]/(nt[10]+1),re=(nt[9]+1)/nt[5],Ft=(nt[9]-1)/nt[5],Ut=(nt[8]-1)/nt[0],wt=(yt[8]+1)/yt[0],De=he*Ut,Mt=he*wt,Xt=it/(-Ut+wt),rn=Xt*-Ut;if(tt.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(rn),K.translateZ(Xt),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),nt[10]===-1)K.projectionMatrix.copy(tt.projectionMatrix),K.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{let ze=he+Xt,C=k+Xt,M=De-rn,H=Mt+(it-rn),Y=re*k/C*ze,et=Ft*k/C*ze;K.projectionMatrix.makePerspective(M,H,Y,et,ze,C),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function vt(K,tt){tt===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(tt.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let tt=K.near,Q=K.far;g.texture!==null&&(g.depthNear>0&&(tt=g.depthNear),g.depthFar>0&&(Q=g.depthFar)),D.near=v.near=x.near=tt,D.far=v.far=x.far=Q,(B!==D.near||V!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),B=D.near,V=D.far),D.layers.mask=K.layers.mask|6,x.layers.mask=D.layers.mask&3,v.layers.mask=D.layers.mask&5;let it=K.parent,nt=D.cameras;vt(D,it);for(let yt=0;yt<nt.length;yt++)vt(nt[yt],it);nt.length===2?ht(D,x,v):D.projectionMatrix.copy(x.projectionMatrix),qt(K,D,it)};function qt(K,tt,Q){Q===null?K.matrix.copy(tt.matrixWorld):(K.matrix.copy(Q.matrixWorld),K.matrix.invert(),K.matrix.multiply(tt.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(tt.projectionMatrix),K.projectionMatrixInverse.copy(tt.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Eo*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(K){c=K,f!==null&&(f.fixedFoveation=K),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=K)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(D)},this.getCameraTexture=function(K){return d[K]};let te=null;function Ee(K,tt){if(u=tt.getViewerPose(l||a),m=tt,u!==null){let Q=u.views;p!==null&&(t.setRenderTargetFramebuffer(b,p.framebuffer),t.setRenderTarget(b));let it=!1;Q.length!==D.cameras.length&&(D.cameras.length=0,it=!0);for(let k=0;k<Q.length;k++){let re=Q[k],Ft=null;if(p!==null)Ft=p.getViewport(re);else{let wt=h.getViewSubImage(f,re);Ft=wt.viewport,k===0&&(t.setRenderTargetTextures(b,wt.colorTexture,wt.depthStencilTexture),t.setRenderTarget(b))}let Ut=R[k];Ut===void 0&&(Ut=new pn,Ut.layers.enable(k),Ut.viewport=new de,R[k]=Ut),Ut.matrix.fromArray(re.transform.matrix),Ut.matrix.decompose(Ut.position,Ut.quaternion,Ut.scale),Ut.projectionMatrix.fromArray(re.projectionMatrix),Ut.projectionMatrixInverse.copy(Ut.projectionMatrix).invert(),Ut.viewport.set(Ft.x,Ft.y,Ft.width,Ft.height),k===0&&(D.matrix.copy(Ut.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),it===!0&&D.cameras.push(Ut)}let nt=s.enabledFeatures;if(nt&&nt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){h=i.getBinding();let k=h.getDepthInformation(Q[0]);k&&k.isValid&&k.texture&&g.init(k,s.renderState)}if(nt&&nt.includes("camera-access")&&y){t.state.unbindTexture(),h=i.getBinding();for(let k=0;k<Q.length;k++){let re=Q[k].camera;if(re){let Ft=d[re];Ft||(Ft=new $a,d[re]=Ft);let Ut=h.getCameraImage(re);Ft.sourceTexture=Ut}}}}for(let Q=0;Q<A.length;Q++){let it=S[Q],nt=A[Q];it!==null&&nt!==void 0&&nt.update(it,tt,l||a)}te&&te(K,tt),tt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:tt}),m=null}let se=new ex;se.setAnimationLoop(Ee),this.setAnimationLoop=function(K){te=K},this.dispose=function(){}}},Fr=new pi,xR=new pe;function _R(e,t){function n(g,d){g.matrixAutoUpdate===!0&&g.updateMatrix(),d.value.copy(g.matrix)}function i(g,d){d.color.getRGB(g.fogColor.value,mp(e)),d.isFog?(g.fogNear.value=d.near,g.fogFar.value=d.far):d.isFogExp2&&(g.fogDensity.value=d.density)}function s(g,d,_,w,b){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(g,d):d.isMeshToonMaterial?(r(g,d),h(g,d)):d.isMeshPhongMaterial?(r(g,d),u(g,d)):d.isMeshStandardMaterial?(r(g,d),f(g,d),d.isMeshPhysicalMaterial&&p(g,d,b)):d.isMeshMatcapMaterial?(r(g,d),m(g,d)):d.isMeshDepthMaterial?r(g,d):d.isMeshDistanceMaterial?(r(g,d),y(g,d)):d.isMeshNormalMaterial?r(g,d):d.isLineBasicMaterial?(a(g,d),d.isLineDashedMaterial&&o(g,d)):d.isPointsMaterial?c(g,d,_,w):d.isSpriteMaterial?l(g,d):d.isShadowMaterial?(g.color.value.copy(d.color),g.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(g,d){g.opacity.value=d.opacity,d.color&&g.diffuse.value.copy(d.color),d.emissive&&g.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(g.map.value=d.map,n(d.map,g.mapTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,n(d.alphaMap,g.alphaMapTransform)),d.bumpMap&&(g.bumpMap.value=d.bumpMap,n(d.bumpMap,g.bumpMapTransform),g.bumpScale.value=d.bumpScale,d.side===mn&&(g.bumpScale.value*=-1)),d.normalMap&&(g.normalMap.value=d.normalMap,n(d.normalMap,g.normalMapTransform),g.normalScale.value.copy(d.normalScale),d.side===mn&&g.normalScale.value.negate()),d.displacementMap&&(g.displacementMap.value=d.displacementMap,n(d.displacementMap,g.displacementMapTransform),g.displacementScale.value=d.displacementScale,g.displacementBias.value=d.displacementBias),d.emissiveMap&&(g.emissiveMap.value=d.emissiveMap,n(d.emissiveMap,g.emissiveMapTransform)),d.specularMap&&(g.specularMap.value=d.specularMap,n(d.specularMap,g.specularMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest);let _=t.get(d),w=_.envMap,b=_.envMapRotation;w&&(g.envMap.value=w,Fr.copy(b),Fr.x*=-1,Fr.y*=-1,Fr.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Fr.y*=-1,Fr.z*=-1),g.envMapRotation.value.setFromMatrix4(xR.makeRotationFromEuler(Fr)),g.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=d.reflectivity,g.ior.value=d.ior,g.refractionRatio.value=d.refractionRatio),d.lightMap&&(g.lightMap.value=d.lightMap,g.lightMapIntensity.value=d.lightMapIntensity,n(d.lightMap,g.lightMapTransform)),d.aoMap&&(g.aoMap.value=d.aoMap,g.aoMapIntensity.value=d.aoMapIntensity,n(d.aoMap,g.aoMapTransform))}function a(g,d){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,d.map&&(g.map.value=d.map,n(d.map,g.mapTransform))}function o(g,d){g.dashSize.value=d.dashSize,g.totalSize.value=d.dashSize+d.gapSize,g.scale.value=d.scale}function c(g,d,_,w){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,g.size.value=d.size*_,g.scale.value=w*.5,d.map&&(g.map.value=d.map,n(d.map,g.uvTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,n(d.alphaMap,g.alphaMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest)}function l(g,d){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,g.rotation.value=d.rotation,d.map&&(g.map.value=d.map,n(d.map,g.mapTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,n(d.alphaMap,g.alphaMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest)}function u(g,d){g.specular.value.copy(d.specular),g.shininess.value=Math.max(d.shininess,1e-4)}function h(g,d){d.gradientMap&&(g.gradientMap.value=d.gradientMap)}function f(g,d){g.metalness.value=d.metalness,d.metalnessMap&&(g.metalnessMap.value=d.metalnessMap,n(d.metalnessMap,g.metalnessMapTransform)),g.roughness.value=d.roughness,d.roughnessMap&&(g.roughnessMap.value=d.roughnessMap,n(d.roughnessMap,g.roughnessMapTransform)),d.envMap&&(g.envMapIntensity.value=d.envMapIntensity)}function p(g,d,_){g.ior.value=d.ior,d.sheen>0&&(g.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),g.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(g.sheenColorMap.value=d.sheenColorMap,n(d.sheenColorMap,g.sheenColorMapTransform)),d.sheenRoughnessMap&&(g.sheenRoughnessMap.value=d.sheenRoughnessMap,n(d.sheenRoughnessMap,g.sheenRoughnessMapTransform))),d.clearcoat>0&&(g.clearcoat.value=d.clearcoat,g.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(g.clearcoatMap.value=d.clearcoatMap,n(d.clearcoatMap,g.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,n(d.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(g.clearcoatNormalMap.value=d.clearcoatNormalMap,n(d.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===mn&&g.clearcoatNormalScale.value.negate())),d.dispersion>0&&(g.dispersion.value=d.dispersion),d.iridescence>0&&(g.iridescence.value=d.iridescence,g.iridescenceIOR.value=d.iridescenceIOR,g.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(g.iridescenceMap.value=d.iridescenceMap,n(d.iridescenceMap,g.iridescenceMapTransform)),d.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=d.iridescenceThicknessMap,n(d.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),d.transmission>0&&(g.transmission.value=d.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),d.transmissionMap&&(g.transmissionMap.value=d.transmissionMap,n(d.transmissionMap,g.transmissionMapTransform)),g.thickness.value=d.thickness,d.thicknessMap&&(g.thicknessMap.value=d.thicknessMap,n(d.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=d.attenuationDistance,g.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(g.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(g.anisotropyMap.value=d.anisotropyMap,n(d.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=d.specularIntensity,g.specularColor.value.copy(d.specularColor),d.specularColorMap&&(g.specularColorMap.value=d.specularColorMap,n(d.specularColorMap,g.specularColorMapTransform)),d.specularIntensityMap&&(g.specularIntensityMap.value=d.specularIntensityMap,n(d.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,d){d.matcap&&(g.matcap.value=d.matcap)}function y(g,d){let _=t.get(d).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function vR(e,t,n,i){let s={},r={},a=[],o=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,w){let b=w.program;i.uniformBlockBinding(_,b)}function l(_,w){let b=s[_.id];b===void 0&&(m(_),b=u(_),s[_.id]=b,_.addEventListener("dispose",g));let A=w.program;i.updateUBOMapping(_,A);let S=t.render.frame;r[_.id]!==S&&(f(_),r[_.id]=S)}function u(_){let w=h();_.__bindingPointIndex=w;let b=e.createBuffer(),A=_.__size,S=_.usage;return e.bindBuffer(e.UNIFORM_BUFFER,b),e.bufferData(e.UNIFORM_BUFFER,A,S),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,w,b),b}function h(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(_){let w=s[_.id],b=_.uniforms,A=_.__cache;e.bindBuffer(e.UNIFORM_BUFFER,w);for(let S=0,T=b.length;S<T;S++){let I=Array.isArray(b[S])?b[S]:[b[S]];for(let x=0,v=I.length;x<v;x++){let R=I[x];if(p(R,S,x,A)===!0){let D=R.__offset,B=Array.isArray(R.value)?R.value:[R.value],V=0;for(let X=0;X<B.length;X++){let z=B[X],Z=y(z);typeof z=="number"||typeof z=="boolean"?(R.__data[0]=z,e.bufferSubData(e.UNIFORM_BUFFER,D+V,R.__data)):z.isMatrix3?(R.__data[0]=z.elements[0],R.__data[1]=z.elements[1],R.__data[2]=z.elements[2],R.__data[3]=0,R.__data[4]=z.elements[3],R.__data[5]=z.elements[4],R.__data[6]=z.elements[5],R.__data[7]=0,R.__data[8]=z.elements[6],R.__data[9]=z.elements[7],R.__data[10]=z.elements[8],R.__data[11]=0):(z.toArray(R.__data,V),V+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,D,R.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(_,w,b,A){let S=_.value,T=w+"_"+b;if(A[T]===void 0)return typeof S=="number"||typeof S=="boolean"?A[T]=S:A[T]=S.clone(),!0;{let I=A[T];if(typeof S=="number"||typeof S=="boolean"){if(I!==S)return A[T]=S,!0}else if(I.equals(S)===!1)return I.copy(S),!0}return!1}function m(_){let w=_.uniforms,b=0,A=16;for(let T=0,I=w.length;T<I;T++){let x=Array.isArray(w[T])?w[T]:[w[T]];for(let v=0,R=x.length;v<R;v++){let D=x[v],B=Array.isArray(D.value)?D.value:[D.value];for(let V=0,X=B.length;V<X;V++){let z=B[V],Z=y(z),$=b%A,lt=$%Z.boundary,ht=$+lt;b+=lt,ht!==0&&A-ht<Z.storage&&(b+=A-ht),D.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=b,b+=Z.storage}}}let S=b%A;return S>0&&(b+=A-S),_.__size=b,_.__cache={},this}function y(_){let w={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(w.boundary=4,w.storage=4):_.isVector2?(w.boundary=8,w.storage=8):_.isVector3||_.isColor?(w.boundary=16,w.storage=12):_.isVector4?(w.boundary=16,w.storage=16):_.isMatrix3?(w.boundary=48,w.storage=48):_.isMatrix4?(w.boundary=64,w.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),w}function g(_){let w=_.target;w.removeEventListener("dispose",g);let b=a.indexOf(w.__bindingPointIndex);a.splice(b,1),e.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function d(){for(let _ in s)e.deleteBuffer(s[_]);a=[],s={},r={}}return{bind:c,update:l,dispose:d}}var rh=class{constructor(t={}){let{canvas:n=Ay(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;let m=new Uint32Array(4),y=new Int32Array(4),g=null,d=null,_=[],w=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ms,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let b=this,A=!1;this._outputColorSpace=Ve;let S=0,T=0,I=null,x=-1,v=null,R=new de,D=new de,B=null,V=new Gt(0),X=0,z=n.width,Z=n.height,$=1,lt=null,ht=null,vt=new de(0,0,z,Z),qt=new de(0,0,z,Z),te=!1,Ee=new Po,se=!1,K=!1,tt=new pe,Q=new L,it=new de,nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},yt=!1;function he(){return I===null?$:1}let k=i;function re(E,U){return n.getContext(E,U)}try{let E={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${"180"}`),n.addEventListener("webglcontextlost",ut,!1),n.addEventListener("webglcontextrestored",xt,!1),n.addEventListener("webglcontextcreationerror",st,!1),k===null){let U="webgl2";if(k=re(U,E),k===null)throw re(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Ft,Ut,wt,De,Mt,Xt,rn,ze,C,M,H,Y,et,j,Rt,ct,St,Et,ot,mt,Nt,Tt,ft,Vt;function N(){Ft=new FT(k),Ft.init(),Tt=new mR(k,Ft),Ut=new PT(k,Ft,t,Tt),wt=new fR(k,Ft),Ut.reversedDepthBuffer&&f&&wt.buffers.depth.setReversed(!0),De=new zT(k),Mt=new tR,Xt=new pR(k,Ft,wt,Mt,Ut,Tt,De),rn=new LT(b),ze=new OT(b),C=new XS(k),ft=new CT(k,C),M=new BT(k,C,De,ft),H=new VT(k,M,C,De),ot=new $T(k,Ut,Xt),ct=new kT(Mt),Y=new QA(b,rn,ze,Ft,Ut,ft,ct),et=new _R(b,Mt),j=new nR,Rt=new lR(Ft),Et=new RT(b,rn,ze,wt,H,p,c),St=new hR(b,H,Ut),Vt=new vR(k,De,Ut,wt),mt=new IT(k,Ft,De),Nt=new HT(k,Ft,De),De.programs=Y.programs,b.capabilities=Ut,b.extensions=Ft,b.properties=Mt,b.renderLists=j,b.shadowMap=St,b.state=wt,b.info=De}N();let at=new kp(b,k);this.xr=at,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){let E=Ft.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=Ft.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(E){E!==void 0&&($=E,this.setSize(z,Z,!1))},this.getSize=function(E){return E.set(z,Z)},this.setSize=function(E,U,G=!0){if(at.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=E,Z=U,n.width=Math.floor(E*$),n.height=Math.floor(U*$),G===!0&&(n.style.width=E+"px",n.style.height=U+"px"),this.setViewport(0,0,E,U)},this.getDrawingBufferSize=function(E){return E.set(z*$,Z*$).floor()},this.setDrawingBufferSize=function(E,U,G){z=E,Z=U,$=G,n.width=Math.floor(E*G),n.height=Math.floor(U*G),this.setViewport(0,0,E,U)},this.getCurrentViewport=function(E){return E.copy(R)},this.getViewport=function(E){return E.copy(vt)},this.setViewport=function(E,U,G,W){E.isVector4?vt.set(E.x,E.y,E.z,E.w):vt.set(E,U,G,W),wt.viewport(R.copy(vt).multiplyScalar($).round())},this.getScissor=function(E){return E.copy(qt)},this.setScissor=function(E,U,G,W){E.isVector4?qt.set(E.x,E.y,E.z,E.w):qt.set(E,U,G,W),wt.scissor(D.copy(qt).multiplyScalar($).round())},this.getScissorTest=function(){return te},this.setScissorTest=function(E){wt.setScissorTest(te=E)},this.setOpaqueSort=function(E){lt=E},this.setTransparentSort=function(E){ht=E},this.getClearColor=function(E){return E.copy(Et.getClearColor())},this.setClearColor=function(){Et.setClearColor(...arguments)},this.getClearAlpha=function(){return Et.getClearAlpha()},this.setClearAlpha=function(){Et.setClearAlpha(...arguments)},this.clear=function(E=!0,U=!0,G=!0){let W=0;if(E){let O=!1;if(I!==null){let rt=I.texture.format;O=rt===Tu||rt===Eu||rt===Su}if(O){let rt=I.texture.type,pt=rt===ki||rt===nr||rt===Uo||rt===Fo||rt===bu||rt===wu,_t=Et.getClearColor(),gt=Et.getClearAlpha(),Lt=_t.r,Ot=_t.g,Pt=_t.b;pt?(m[0]=Lt,m[1]=Ot,m[2]=Pt,m[3]=gt,k.clearBufferuiv(k.COLOR,0,m)):(y[0]=Lt,y[1]=Ot,y[2]=Pt,y[3]=gt,k.clearBufferiv(k.COLOR,0,y))}else W|=k.COLOR_BUFFER_BIT}U&&(W|=k.DEPTH_BUFFER_BIT),G&&(W|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",ut,!1),n.removeEventListener("webglcontextrestored",xt,!1),n.removeEventListener("webglcontextcreationerror",st,!1),Et.dispose(),j.dispose(),Rt.dispose(),Mt.dispose(),rn.dispose(),ze.dispose(),H.dispose(),ft.dispose(),Vt.dispose(),Y.dispose(),at.dispose(),at.removeEventListener("sessionstart",ji),at.removeEventListener("sessionend",Pg),fr.stop()};function ut(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function xt(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;let E=De.autoReset,U=St.enabled,G=St.autoUpdate,W=St.needsUpdate,O=St.type;N(),De.autoReset=E,St.enabled=U,St.autoUpdate=G,St.needsUpdate=W,St.type=O}function st(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function J(E){let U=E.target;U.removeEventListener("dispose",J),bt(U)}function bt(E){Bt(E),Mt.remove(E)}function Bt(E){let U=Mt.get(E).programs;U!==void 0&&(U.forEach(function(G){Y.releaseProgram(G)}),E.isShaderMaterial&&Y.releaseShaderCache(E))}this.renderBufferDirect=function(E,U,G,W,O,rt){U===null&&(U=nt);let pt=O.isMesh&&O.matrixWorld.determinant()<0,_t=Ew(E,U,G,W,O);wt.setMaterial(W,pt);let gt=G.index,Lt=1;if(W.wireframe===!0){if(gt=M.getWireframeAttribute(G),gt===void 0)return;Lt=2}let Ot=G.drawRange,Pt=G.attributes.position,Zt=Ot.start*Lt,ye=(Ot.start+Ot.count)*Lt;rt!==null&&(Zt=Math.max(Zt,rt.start*Lt),ye=Math.min(ye,(rt.start+rt.count)*Lt)),gt!==null?(Zt=Math.max(Zt,0),ye=Math.min(ye,gt.count)):Pt!=null&&(Zt=Math.max(Zt,0),ye=Math.min(ye,Pt.count));let Be=ye-Zt;if(Be<0||Be===1/0)return;ft.setup(O,W,_t,G,gt);let Pe,Me=mt;if(gt!==null&&(Pe=C.get(gt),Me=Nt,Me.setIndex(Pe)),O.isMesh)W.wireframe===!0?(wt.setLineWidth(W.wireframeLinewidth*he()),Me.setMode(k.LINES)):Me.setMode(k.TRIANGLES);else if(O.isLine){let kt=W.linewidth;kt===void 0&&(kt=1),wt.setLineWidth(kt*he()),O.isLineSegments?Me.setMode(k.LINES):O.isLineLoop?Me.setMode(k.LINE_LOOP):Me.setMode(k.LINE_STRIP)}else O.isPoints?Me.setMode(k.POINTS):O.isSprite&&Me.setMode(k.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)To("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Me.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(Ft.get("WEBGL_multi_draw"))Me.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let kt=O._multiDrawStarts,Oe=O._multiDrawCounts,oe=O._multiDrawCount,Yn=gt?C.get(gt).bytesPerElement:1,eo=Mt.get(W).currentProgram.getUniforms();for(let Kn=0;Kn<oe;Kn++)eo.setValue(k,"_gl_DrawID",Kn),Me.render(kt[Kn]/Yn,Oe[Kn])}else if(O.isInstancedMesh)Me.renderInstances(Zt,Be,O.count);else if(G.isInstancedBufferGeometry){let kt=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Oe=Math.min(G.instanceCount,kt);Me.renderInstances(Zt,Be,Oe)}else Me.render(Zt,Be)};function Te(E,U,G){E.transparent===!0&&E.side===Gn&&E.forceSinglePass===!1?(E.side=mn,E.needsUpdate=!0,ic(E,U,G),E.side=vs,E.needsUpdate=!0,ic(E,U,G),E.side=Gn):ic(E,U,G)}this.compile=function(E,U,G=null){G===null&&(G=E),d=Rt.get(G),d.init(U),w.push(d),G.traverseVisible(function(O){O.isLight&&O.layers.test(U.layers)&&(d.pushLight(O),O.castShadow&&d.pushShadow(O))}),E!==G&&E.traverseVisible(function(O){O.isLight&&O.layers.test(U.layers)&&(d.pushLight(O),O.castShadow&&d.pushShadow(O))}),d.setupLights();let W=new Set;return E.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let rt=O.material;if(rt)if(Array.isArray(rt))for(let pt=0;pt<rt.length;pt++){let _t=rt[pt];Te(_t,G,O),W.add(_t)}else Te(rt,G,O),W.add(rt)}),d=w.pop(),W},this.compileAsync=function(E,U,G=null){let W=this.compile(E,U,G);return new Promise(O=>{function rt(){if(W.forEach(function(pt){Mt.get(pt).currentProgram.isReady()&&W.delete(pt)}),W.size===0){O(E);return}setTimeout(rt,10)}Ft.get("KHR_parallel_shader_compile")!==null?rt():setTimeout(rt,10)})};let ce=null;function hs(E){ce&&ce(E)}function ji(){fr.stop()}function Pg(){fr.start()}let fr=new ex;fr.setAnimationLoop(hs),typeof self<"u"&&fr.setContext(self),this.setAnimationLoop=function(E){ce=E,at.setAnimationLoop(E),E===null?fr.stop():fr.start()},at.addEventListener("sessionstart",ji),at.addEventListener("sessionend",Pg),this.render=function(E,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),at.enabled===!0&&at.isPresenting===!0&&(at.cameraAutoUpdate===!0&&at.updateCamera(U),U=at.getCamera()),E.isScene===!0&&E.onBeforeRender(b,E,U,I),d=Rt.get(E,w.length),d.init(U),w.push(d),tt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Ee.setFromProjectionMatrix(tt,Ri,U.reversedDepth),K=this.localClippingEnabled,se=ct.init(this.clippingPlanes,K),g=j.get(E,_.length),g.init(),_.push(g),at.enabled===!0&&at.isPresenting===!0){let rt=b.xr.getDepthSensingMesh();rt!==null&&Gd(rt,U,-1/0,b.sortObjects)}Gd(E,U,0,b.sortObjects),g.finish(),b.sortObjects===!0&&g.sort(lt,ht),yt=at.enabled===!1||at.isPresenting===!1||at.hasDepthSensing()===!1,yt&&Et.addToRenderList(g,E),this.info.render.frame++,se===!0&&ct.beginShadows();let G=d.state.shadowsArray;St.render(G,E,U),se===!0&&ct.endShadows(),this.info.autoReset===!0&&this.info.reset();let W=g.opaque,O=g.transmissive;if(d.setupLights(),U.isArrayCamera){let rt=U.cameras;if(O.length>0)for(let pt=0,_t=rt.length;pt<_t;pt++){let gt=rt[pt];Lg(W,O,E,gt)}yt&&Et.render(E);for(let pt=0,_t=rt.length;pt<_t;pt++){let gt=rt[pt];kg(g,E,gt,gt.viewport)}}else O.length>0&&Lg(W,O,E,U),yt&&Et.render(E),kg(g,E,U);I!==null&&T===0&&(Xt.updateMultisampleRenderTarget(I),Xt.updateRenderTargetMipmap(I)),E.isScene===!0&&E.onAfterRender(b,E,U),ft.resetDefaultState(),x=-1,v=null,w.pop(),w.length>0?(d=w[w.length-1],se===!0&&ct.setGlobalState(b.clippingPlanes,d.state.camera)):d=null,_.pop(),_.length>0?g=_[_.length-1]:g=null};function Gd(E,U,G,W){if(E.visible===!1)return;if(E.layers.test(U.layers)){if(E.isGroup)G=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(U);else if(E.isLight)d.pushLight(E),E.castShadow&&d.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Ee.intersectsSprite(E)){W&&it.setFromMatrixPosition(E.matrixWorld).applyMatrix4(tt);let pt=H.update(E),_t=E.material;_t.visible&&g.push(E,pt,_t,G,it.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Ee.intersectsObject(E))){let pt=H.update(E),_t=E.material;if(W&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),it.copy(E.boundingSphere.center)):(pt.boundingSphere===null&&pt.computeBoundingSphere(),it.copy(pt.boundingSphere.center)),it.applyMatrix4(E.matrixWorld).applyMatrix4(tt)),Array.isArray(_t)){let gt=pt.groups;for(let Lt=0,Ot=gt.length;Lt<Ot;Lt++){let Pt=gt[Lt],Zt=_t[Pt.materialIndex];Zt&&Zt.visible&&g.push(E,pt,Zt,G,it.z,Pt)}}else _t.visible&&g.push(E,pt,_t,G,it.z,null)}}let rt=E.children;for(let pt=0,_t=rt.length;pt<_t;pt++)Gd(rt[pt],U,G,W)}function kg(E,U,G,W){let O=E.opaque,rt=E.transmissive,pt=E.transparent;d.setupLightsView(G),se===!0&&ct.setGlobalState(b.clippingPlanes,G),W&&wt.viewport(R.copy(W)),O.length>0&&nc(O,U,G),rt.length>0&&nc(rt,U,G),pt.length>0&&nc(pt,U,G),wt.buffers.depth.setTest(!0),wt.buffers.depth.setMask(!0),wt.buffers.color.setMask(!0),wt.setPolygonOffset(!1)}function Lg(E,U,G,W){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[W.id]===void 0&&(d.state.transmissionRenderTarget[W.id]=new Qi(1,1,{generateMipmaps:!0,type:Ft.has("EXT_color_buffer_half_float")||Ft.has("EXT_color_buffer_float")?Oo:ki,minFilter:er,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ne.workingColorSpace}));let rt=d.state.transmissionRenderTarget[W.id],pt=W.viewport||R;rt.setSize(pt.z*b.transmissionResolutionScale,pt.w*b.transmissionResolutionScale);let _t=b.getRenderTarget(),gt=b.getActiveCubeFace(),Lt=b.getActiveMipmapLevel();b.setRenderTarget(rt),b.getClearColor(V),X=b.getClearAlpha(),X<1&&b.setClearColor(16777215,.5),b.clear(),yt&&Et.render(G);let Ot=b.toneMapping;b.toneMapping=Ms;let Pt=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),d.setupLightsView(W),se===!0&&ct.setGlobalState(b.clippingPlanes,W),nc(E,G,W),Xt.updateMultisampleRenderTarget(rt),Xt.updateRenderTargetMipmap(rt),Ft.has("WEBGL_multisampled_render_to_texture")===!1){let Zt=!1;for(let ye=0,Be=U.length;ye<Be;ye++){let Pe=U[ye],Me=Pe.object,kt=Pe.geometry,Oe=Pe.material,oe=Pe.group;if(Oe.side===Gn&&Me.layers.test(W.layers)){let Yn=Oe.side;Oe.side=mn,Oe.needsUpdate=!0,Dg(Me,G,W,kt,Oe,oe),Oe.side=Yn,Oe.needsUpdate=!0,Zt=!0}}Zt===!0&&(Xt.updateMultisampleRenderTarget(rt),Xt.updateRenderTargetMipmap(rt))}b.setRenderTarget(_t,gt,Lt),b.setClearColor(V,X),Pt!==void 0&&(W.viewport=Pt),b.toneMapping=Ot}function nc(E,U,G){let W=U.isScene===!0?U.overrideMaterial:null;for(let O=0,rt=E.length;O<rt;O++){let pt=E[O],_t=pt.object,gt=pt.geometry,Lt=pt.group,Ot=pt.material;Ot.allowOverride===!0&&W!==null&&(Ot=W),_t.layers.test(G.layers)&&Dg(_t,U,G,gt,Ot,Lt)}}function Dg(E,U,G,W,O,rt){E.onBeforeRender(b,U,G,W,O,rt),E.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),O.onBeforeRender(b,U,G,W,E,rt),O.transparent===!0&&O.side===Gn&&O.forceSinglePass===!1?(O.side=mn,O.needsUpdate=!0,b.renderBufferDirect(G,U,W,O,E,rt),O.side=vs,O.needsUpdate=!0,b.renderBufferDirect(G,U,W,O,E,rt),O.side=Gn):b.renderBufferDirect(G,U,W,O,E,rt),E.onAfterRender(b,U,G,W,O,rt)}function ic(E,U,G){U.isScene!==!0&&(U=nt);let W=Mt.get(E),O=d.state.lights,rt=d.state.shadowsArray,pt=O.state.version,_t=Y.getParameters(E,O.state,rt,U,G),gt=Y.getProgramCacheKey(_t),Lt=W.programs;W.environment=E.isMeshStandardMaterial?U.environment:null,W.fog=U.fog,W.envMap=(E.isMeshStandardMaterial?ze:rn).get(E.envMap||W.environment),W.envMapRotation=W.environment!==null&&E.envMap===null?U.environmentRotation:E.envMapRotation,Lt===void 0&&(E.addEventListener("dispose",J),Lt=new Map,W.programs=Lt);let Ot=Lt.get(gt);if(Ot!==void 0){if(W.currentProgram===Ot&&W.lightsStateVersion===pt)return Ug(E,_t),Ot}else _t.uniforms=Y.getUniforms(E),E.onBeforeCompile(_t,b),Ot=Y.acquireProgram(_t,gt),Lt.set(gt,Ot),W.uniforms=_t.uniforms;let Pt=W.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Pt.clippingPlanes=ct.uniform),Ug(E,_t),W.needsLights=Aw(E),W.lightsStateVersion=pt,W.needsLights&&(Pt.ambientLightColor.value=O.state.ambient,Pt.lightProbe.value=O.state.probe,Pt.directionalLights.value=O.state.directional,Pt.directionalLightShadows.value=O.state.directionalShadow,Pt.spotLights.value=O.state.spot,Pt.spotLightShadows.value=O.state.spotShadow,Pt.rectAreaLights.value=O.state.rectArea,Pt.ltc_1.value=O.state.rectAreaLTC1,Pt.ltc_2.value=O.state.rectAreaLTC2,Pt.pointLights.value=O.state.point,Pt.pointLightShadows.value=O.state.pointShadow,Pt.hemisphereLights.value=O.state.hemi,Pt.directionalShadowMap.value=O.state.directionalShadowMap,Pt.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Pt.spotShadowMap.value=O.state.spotShadowMap,Pt.spotLightMatrix.value=O.state.spotLightMatrix,Pt.spotLightMap.value=O.state.spotLightMap,Pt.pointShadowMap.value=O.state.pointShadowMap,Pt.pointShadowMatrix.value=O.state.pointShadowMatrix),W.currentProgram=Ot,W.uniformsList=null,Ot}function Ng(E){if(E.uniformsList===null){let U=E.currentProgram.getUniforms();E.uniformsList=Vo.seqWithValue(U.seq,E.uniforms)}return E.uniformsList}function Ug(E,U){let G=Mt.get(E);G.outputColorSpace=U.outputColorSpace,G.batching=U.batching,G.batchingColor=U.batchingColor,G.instancing=U.instancing,G.instancingColor=U.instancingColor,G.instancingMorph=U.instancingMorph,G.skinning=U.skinning,G.morphTargets=U.morphTargets,G.morphNormals=U.morphNormals,G.morphColors=U.morphColors,G.morphTargetsCount=U.morphTargetsCount,G.numClippingPlanes=U.numClippingPlanes,G.numIntersection=U.numClipIntersection,G.vertexAlphas=U.vertexAlphas,G.vertexTangents=U.vertexTangents,G.toneMapping=U.toneMapping}function Ew(E,U,G,W,O){U.isScene!==!0&&(U=nt),Xt.resetTextureUnits();let rt=U.fog,pt=W.isMeshStandardMaterial?U.environment:null,_t=I===null?b.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Ir,gt=(W.isMeshStandardMaterial?ze:rn).get(W.envMap||pt),Lt=W.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Ot=!!G.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Pt=!!G.morphAttributes.position,Zt=!!G.morphAttributes.normal,ye=!!G.morphAttributes.color,Be=Ms;W.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(Be=b.toneMapping);let Pe=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Me=Pe!==void 0?Pe.length:0,kt=Mt.get(W),Oe=d.state.lights;if(se===!0&&(K===!0||E!==v)){let Ln=E===v&&W.id===x;ct.setState(W,E,Ln)}let oe=!1;W.version===kt.__version?(kt.needsLights&&kt.lightsStateVersion!==Oe.state.version||kt.outputColorSpace!==_t||O.isBatchedMesh&&kt.batching===!1||!O.isBatchedMesh&&kt.batching===!0||O.isBatchedMesh&&kt.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&kt.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&kt.instancing===!1||!O.isInstancedMesh&&kt.instancing===!0||O.isSkinnedMesh&&kt.skinning===!1||!O.isSkinnedMesh&&kt.skinning===!0||O.isInstancedMesh&&kt.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&kt.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&kt.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&kt.instancingMorph===!1&&O.morphTexture!==null||kt.envMap!==gt||W.fog===!0&&kt.fog!==rt||kt.numClippingPlanes!==void 0&&(kt.numClippingPlanes!==ct.numPlanes||kt.numIntersection!==ct.numIntersection)||kt.vertexAlphas!==Lt||kt.vertexTangents!==Ot||kt.morphTargets!==Pt||kt.morphNormals!==Zt||kt.morphColors!==ye||kt.toneMapping!==Be||kt.morphTargetsCount!==Me)&&(oe=!0):(oe=!0,kt.__version=W.version);let Yn=kt.currentProgram;oe===!0&&(Yn=ic(W,U,O));let eo=!1,Kn=!1,ya=!1,Fe=Yn.getUniforms(),ai=kt.uniforms;if(wt.useProgram(Yn.program)&&(eo=!0,Kn=!0,ya=!0),W.id!==x&&(x=W.id,Kn=!0),eo||v!==E){wt.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),Fe.setValue(k,"projectionMatrix",E.projectionMatrix),Fe.setValue(k,"viewMatrix",E.matrixWorldInverse);let Hn=Fe.map.cameraPosition;Hn!==void 0&&Hn.setValue(k,Q.setFromMatrixPosition(E.matrixWorld)),Ut.logarithmicDepthBuffer&&Fe.setValue(k,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&Fe.setValue(k,"isOrthographic",E.isOrthographicCamera===!0),v!==E&&(v=E,Kn=!0,ya=!0)}if(O.isSkinnedMesh){Fe.setOptional(k,O,"bindMatrix"),Fe.setOptional(k,O,"bindMatrixInverse");let Ln=O.skeleton;Ln&&(Ln.boneTexture===null&&Ln.computeBoneTexture(),Fe.setValue(k,"boneTexture",Ln.boneTexture,Xt))}O.isBatchedMesh&&(Fe.setOptional(k,O,"batchingTexture"),Fe.setValue(k,"batchingTexture",O._matricesTexture,Xt),Fe.setOptional(k,O,"batchingIdTexture"),Fe.setValue(k,"batchingIdTexture",O._indirectTexture,Xt),Fe.setOptional(k,O,"batchingColorTexture"),O._colorsTexture!==null&&Fe.setValue(k,"batchingColorTexture",O._colorsTexture,Xt));let li=G.morphAttributes;if((li.position!==void 0||li.normal!==void 0||li.color!==void 0)&&ot.update(O,G,Yn),(Kn||kt.receiveShadow!==O.receiveShadow)&&(kt.receiveShadow=O.receiveShadow,Fe.setValue(k,"receiveShadow",O.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(ai.envMap.value=gt,ai.flipEnvMap.value=gt.isCubeTexture&&gt.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&U.environment!==null&&(ai.envMapIntensity.value=U.environmentIntensity),Kn&&(Fe.setValue(k,"toneMappingExposure",b.toneMappingExposure),kt.needsLights&&Tw(ai,ya),rt&&W.fog===!0&&et.refreshFogUniforms(ai,rt),et.refreshMaterialUniforms(ai,W,$,Z,d.state.transmissionRenderTarget[E.id]),Vo.upload(k,Ng(kt),ai,Xt)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Vo.upload(k,Ng(kt),ai,Xt),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&Fe.setValue(k,"center",O.center),Fe.setValue(k,"modelViewMatrix",O.modelViewMatrix),Fe.setValue(k,"normalMatrix",O.normalMatrix),Fe.setValue(k,"modelMatrix",O.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){let Ln=W.uniformsGroups;for(let Hn=0,Wd=Ln.length;Hn<Wd;Hn++){let pr=Ln[Hn];Vt.update(pr,Yn),Vt.bind(pr,Yn)}}return Yn}function Tw(E,U){E.ambientLightColor.needsUpdate=U,E.lightProbe.needsUpdate=U,E.directionalLights.needsUpdate=U,E.directionalLightShadows.needsUpdate=U,E.pointLights.needsUpdate=U,E.pointLightShadows.needsUpdate=U,E.spotLights.needsUpdate=U,E.spotLightShadows.needsUpdate=U,E.rectAreaLights.needsUpdate=U,E.hemisphereLights.needsUpdate=U}function Aw(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(E,U,G){let W=Mt.get(E);W.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),Mt.get(E.texture).__webglTexture=U,Mt.get(E.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:G,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,U){let G=Mt.get(E);G.__webglFramebuffer=U,G.__useDefaultFramebuffer=U===void 0};let Rw=k.createFramebuffer();this.setRenderTarget=function(E,U=0,G=0){I=E,S=U,T=G;let W=!0,O=null,rt=!1,pt=!1;if(E){let gt=Mt.get(E);if(gt.__useDefaultFramebuffer!==void 0)wt.bindFramebuffer(k.FRAMEBUFFER,null),W=!1;else if(gt.__webglFramebuffer===void 0)Xt.setupRenderTarget(E);else if(gt.__hasExternalTextures)Xt.rebindTextures(E,Mt.get(E.texture).__webglTexture,Mt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let Pt=E.depthTexture;if(gt.__boundDepthTexture!==Pt){if(Pt!==null&&Mt.has(Pt)&&(E.width!==Pt.image.width||E.height!==Pt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Xt.setupDepthRenderbuffer(E)}}let Lt=E.texture;(Lt.isData3DTexture||Lt.isDataArrayTexture||Lt.isCompressedArrayTexture)&&(pt=!0);let Ot=Mt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ot[U])?O=Ot[U][G]:O=Ot[U],rt=!0):E.samples>0&&Xt.useMultisampledRTT(E)===!1?O=Mt.get(E).__webglMultisampledFramebuffer:Array.isArray(Ot)?O=Ot[G]:O=Ot,R.copy(E.viewport),D.copy(E.scissor),B=E.scissorTest}else R.copy(vt).multiplyScalar($).floor(),D.copy(qt).multiplyScalar($).floor(),B=te;if(G!==0&&(O=Rw),wt.bindFramebuffer(k.FRAMEBUFFER,O)&&W&&wt.drawBuffers(E,O),wt.viewport(R),wt.scissor(D),wt.setScissorTest(B),rt){let gt=Mt.get(E.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+U,gt.__webglTexture,G)}else if(pt){let gt=U;for(let Lt=0;Lt<E.textures.length;Lt++){let Ot=Mt.get(E.textures[Lt]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+Lt,Ot.__webglTexture,G,gt)}}else if(E!==null&&G!==0){let gt=Mt.get(E.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,gt.__webglTexture,G)}x=-1},this.readRenderTargetPixels=function(E,U,G,W,O,rt,pt,_t=0){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let gt=Mt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&pt!==void 0&&(gt=gt[pt]),gt){wt.bindFramebuffer(k.FRAMEBUFFER,gt);try{let Lt=E.textures[_t],Ot=Lt.format,Pt=Lt.type;if(!Ut.textureFormatReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ut.textureTypeReadable(Pt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=E.width-W&&G>=0&&G<=E.height-O&&(E.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+_t),k.readPixels(U,G,W,O,Tt.convert(Ot),Tt.convert(Pt),rt))}finally{let Lt=I!==null?Mt.get(I).__webglFramebuffer:null;wt.bindFramebuffer(k.FRAMEBUFFER,Lt)}}},this.readRenderTargetPixelsAsync=async function(E,U,G,W,O,rt,pt,_t=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let gt=Mt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&pt!==void 0&&(gt=gt[pt]),gt)if(U>=0&&U<=E.width-W&&G>=0&&G<=E.height-O){wt.bindFramebuffer(k.FRAMEBUFFER,gt);let Lt=E.textures[_t],Ot=Lt.format,Pt=Lt.type;if(!Ut.textureFormatReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ut.textureTypeReadable(Pt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Zt=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,Zt),k.bufferData(k.PIXEL_PACK_BUFFER,rt.byteLength,k.STREAM_READ),E.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+_t),k.readPixels(U,G,W,O,Tt.convert(Ot),Tt.convert(Pt),0);let ye=I!==null?Mt.get(I).__webglFramebuffer:null;wt.bindFramebuffer(k.FRAMEBUFFER,ye);let Be=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await Ry(k,Be,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,Zt),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,rt),k.deleteBuffer(Zt),k.deleteSync(Be),rt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,U=null,G=0){let W=Math.pow(2,-G),O=Math.floor(E.image.width*W),rt=Math.floor(E.image.height*W),pt=U!==null?U.x:0,_t=U!==null?U.y:0;Xt.setTexture2D(E,0),k.copyTexSubImage2D(k.TEXTURE_2D,G,0,0,pt,_t,O,rt),wt.unbindTexture()};let Cw=k.createFramebuffer(),Iw=k.createFramebuffer();this.copyTextureToTexture=function(E,U,G=null,W=null,O=0,rt=null){rt===null&&(O!==0?(To("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),rt=O,O=0):rt=0);let pt,_t,gt,Lt,Ot,Pt,Zt,ye,Be,Pe=E.isCompressedTexture?E.mipmaps[rt]:E.image;if(G!==null)pt=G.max.x-G.min.x,_t=G.max.y-G.min.y,gt=G.isBox3?G.max.z-G.min.z:1,Lt=G.min.x,Ot=G.min.y,Pt=G.isBox3?G.min.z:0;else{let li=Math.pow(2,-O);pt=Math.floor(Pe.width*li),_t=Math.floor(Pe.height*li),E.isDataArrayTexture?gt=Pe.depth:E.isData3DTexture?gt=Math.floor(Pe.depth*li):gt=1,Lt=0,Ot=0,Pt=0}W!==null?(Zt=W.x,ye=W.y,Be=W.z):(Zt=0,ye=0,Be=0);let Me=Tt.convert(U.format),kt=Tt.convert(U.type),Oe;U.isData3DTexture?(Xt.setTexture3D(U,0),Oe=k.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Xt.setTexture2DArray(U,0),Oe=k.TEXTURE_2D_ARRAY):(Xt.setTexture2D(U,0),Oe=k.TEXTURE_2D),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,U.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,U.unpackAlignment);let oe=k.getParameter(k.UNPACK_ROW_LENGTH),Yn=k.getParameter(k.UNPACK_IMAGE_HEIGHT),eo=k.getParameter(k.UNPACK_SKIP_PIXELS),Kn=k.getParameter(k.UNPACK_SKIP_ROWS),ya=k.getParameter(k.UNPACK_SKIP_IMAGES);k.pixelStorei(k.UNPACK_ROW_LENGTH,Pe.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Pe.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,Lt),k.pixelStorei(k.UNPACK_SKIP_ROWS,Ot),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Pt);let Fe=E.isDataArrayTexture||E.isData3DTexture,ai=U.isDataArrayTexture||U.isData3DTexture;if(E.isDepthTexture){let li=Mt.get(E),Ln=Mt.get(U),Hn=Mt.get(li.__renderTarget),Wd=Mt.get(Ln.__renderTarget);wt.bindFramebuffer(k.READ_FRAMEBUFFER,Hn.__webglFramebuffer),wt.bindFramebuffer(k.DRAW_FRAMEBUFFER,Wd.__webglFramebuffer);for(let pr=0;pr<gt;pr++)Fe&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Mt.get(E).__webglTexture,O,Pt+pr),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Mt.get(U).__webglTexture,rt,Be+pr)),k.blitFramebuffer(Lt,Ot,pt,_t,Zt,ye,pt,_t,k.DEPTH_BUFFER_BIT,k.NEAREST);wt.bindFramebuffer(k.READ_FRAMEBUFFER,null),wt.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(O!==0||E.isRenderTargetTexture||Mt.has(E)){let li=Mt.get(E),Ln=Mt.get(U);wt.bindFramebuffer(k.READ_FRAMEBUFFER,Cw),wt.bindFramebuffer(k.DRAW_FRAMEBUFFER,Iw);for(let Hn=0;Hn<gt;Hn++)Fe?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,li.__webglTexture,O,Pt+Hn):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,li.__webglTexture,O),ai?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Ln.__webglTexture,rt,Be+Hn):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,Ln.__webglTexture,rt),O!==0?k.blitFramebuffer(Lt,Ot,pt,_t,Zt,ye,pt,_t,k.COLOR_BUFFER_BIT,k.NEAREST):ai?k.copyTexSubImage3D(Oe,rt,Zt,ye,Be+Hn,Lt,Ot,pt,_t):k.copyTexSubImage2D(Oe,rt,Zt,ye,Lt,Ot,pt,_t);wt.bindFramebuffer(k.READ_FRAMEBUFFER,null),wt.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else ai?E.isDataTexture||E.isData3DTexture?k.texSubImage3D(Oe,rt,Zt,ye,Be,pt,_t,gt,Me,kt,Pe.data):U.isCompressedArrayTexture?k.compressedTexSubImage3D(Oe,rt,Zt,ye,Be,pt,_t,gt,Me,Pe.data):k.texSubImage3D(Oe,rt,Zt,ye,Be,pt,_t,gt,Me,kt,Pe):E.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,rt,Zt,ye,pt,_t,Me,kt,Pe.data):E.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,rt,Zt,ye,Pe.width,Pe.height,Me,Pe.data):k.texSubImage2D(k.TEXTURE_2D,rt,Zt,ye,pt,_t,Me,kt,Pe);k.pixelStorei(k.UNPACK_ROW_LENGTH,oe),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Yn),k.pixelStorei(k.UNPACK_SKIP_PIXELS,eo),k.pixelStorei(k.UNPACK_SKIP_ROWS,Kn),k.pixelStorei(k.UNPACK_SKIP_IMAGES,ya),rt===0&&U.generateMipmaps&&k.generateMipmap(Oe),wt.unbindTexture()},this.initRenderTarget=function(E){Mt.get(E).__webglFramebuffer===void 0&&Xt.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?Xt.setTextureCube(E,0):E.isData3DTexture?Xt.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?Xt.setTexture2DArray(E,0):Xt.setTexture2D(E,0),wt.unbindTexture()},this.resetState=function(){S=0,T=0,I=null,wt.reset(),ft.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ri}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let n=this.getContext();n.drawingBufferColorSpace=ne._getDrawingBufferColorSpace(t),n.unpackColorSpace=ne._getUnpackColorSpace()}};var ox={type:"change"},Up={type:"start"},lx={type:"end"},ah=new Pr,ax=new di,bR=Math.cos(70*Ss.DEG2RAD),Je=new L,Wn=2*Math.PI,ve={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Np=1e-6,lh=class extends el{constructor(t,n=null){super(t,n),this.state=ve.NONE,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:mi.ROTATE,MIDDLE:mi.DOLLY,RIGHT:mi.PAN},this.touches={ONE:Pi.ROTATE,TWO:Pi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new fi,this._lastTargetPosition=new L,this._quat=new fi().setFromUnitVectors(t.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new No,this._sphericalDelta=new No,this._scale=1,this._panOffset=new L,this._rotateStart=new At,this._rotateEnd=new At,this._rotateDelta=new At,this._panStart=new At,this._panEnd=new At,this._panDelta=new At,this._dollyStart=new At,this._dollyEnd=new At,this._dollyDelta=new At,this._dollyDirection=new L,this._mouse=new At,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=MR.bind(this),this._onPointerDown=wR.bind(this),this._onPointerUp=SR.bind(this),this._onContextMenu=PR.bind(this),this._onMouseWheel=AR.bind(this),this._onKeyDown=RR.bind(this),this._onTouchStart=CR.bind(this),this._onTouchMove=IR.bind(this),this._onMouseDown=ER.bind(this),this._onMouseMove=TR.bind(this),this._interceptControlDown=kR.bind(this),this._interceptControlUp=LR.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(ox),this.update(),this.state=ve.NONE}update(t=null){let n=this.object.position;Je.copy(n).sub(this.target),Je.applyQuaternion(this._quat),this._spherical.setFromVector3(Je),this.autoRotate&&this.state===ve.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Wn:i>Math.PI&&(i-=Wn),s<-Math.PI?s+=Wn:s>Math.PI&&(s-=Wn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Je.setFromSpherical(this._spherical),Je.applyQuaternion(this._quatInverse),n.copy(this.target).add(Je),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){let o=Je.length();a=this._clampDistance(o*this._scale);let c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){let o=new L(this._mouse.x,this._mouse.y,0);o.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;let l=new L(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(o),this.object.updateMatrixWorld(),a=Je.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(ah.origin.copy(this.object.position),ah.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(ah.direction))<bR?this.object.lookAt(this.target):(ax.setFromNormalAndCoplanarPoint(this.object.up,this.target),ah.intersectPlane(ax,this.target))))}else if(this.object.isOrthographicCamera){let a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Np||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Np||this._lastTargetPosition.distanceToSquared(this.target)>Np?(this.dispatchEvent(ox),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Wn/60*this.autoRotateSpeed*t:Wn/60/60*this.autoRotateSpeed}_getZoomScale(t){let n=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,n){Je.setFromMatrixColumn(n,0),Je.multiplyScalar(-t),this._panOffset.add(Je)}_panUp(t,n){this.screenSpacePanning===!0?Je.setFromMatrixColumn(n,1):(Je.setFromMatrixColumn(n,0),Je.crossVectors(this.object.up,Je)),Je.multiplyScalar(t),this._panOffset.add(Je)}_pan(t,n){let i=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Je.copy(s).sub(this.target);let r=Je.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/i.clientHeight,this.object.matrix),this._panUp(2*n*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),s=t-i.left,r=n-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let n=this.domElement;this._rotateLeft(Wn*this._rotateDelta.x/n.clientHeight),this._rotateUp(Wn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let n=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(Wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-Wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(Wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-Wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),i=.5*(t.pageX+n.x),s=.5*(t.pageY+n.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),i=.5*(t.pageX+n.x),s=.5*(t.pageY+n.y);this._panStart.set(i,s)}}_handleTouchStartDolly(t){let n=this._getSecondPointerPosition(t),i=t.pageX-n.x,s=t.pageY-n.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),r=.5*(t.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let n=this.domElement;this._rotateLeft(Wn*this._rotateDelta.x/n.clientHeight),this._rotateUp(Wn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),i=.5*(t.pageX+n.x),s=.5*(t.pageY+n.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let n=this._getSecondPointerPosition(t),i=t.pageX-n.x,s=t.pageY-n.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(t.pageX+n.x)*.5,o=(t.pageY+n.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==t.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(t){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==t.pointerId)return!0;return!1}_trackPointer(t){let n=this._pointerPositions[t.pointerId];n===void 0&&(n=new At,this._pointerPositions[t.pointerId]=n),n.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let n=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(t){let n=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function wR(e){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(e.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(e)&&(this._addPointer(e),e.pointerType==="touch"?this._onTouchStart(e):this._onMouseDown(e)))}function MR(e){this.enabled!==!1&&(e.pointerType==="touch"?this._onTouchMove(e):this._onMouseMove(e))}function SR(e){switch(this._removePointer(e),this._pointers.length){case 0:this.domElement.releasePointerCapture(e.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(lx),this.state=ve.NONE;break;case 1:let t=this._pointers[0],n=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:n.x,pageY:n.y});break}}function ER(e){let t;switch(e.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case mi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(e),this.state=ve.DOLLY;break;case mi.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=ve.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=ve.ROTATE}break;case mi.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=ve.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=ve.PAN}break;default:this.state=ve.NONE}this.state!==ve.NONE&&this.dispatchEvent(Up)}function TR(e){switch(this.state){case ve.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(e);break;case ve.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(e);break;case ve.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(e);break}}function AR(e){this.enabled===!1||this.enableZoom===!1||this.state!==ve.NONE||(e.preventDefault(),this.dispatchEvent(Up),this._handleMouseWheel(this._customWheelEvent(e)),this.dispatchEvent(lx))}function RR(e){this.enabled!==!1&&this._handleKeyDown(e)}function CR(e){switch(this._trackPointer(e),this._pointers.length){case 1:switch(this.touches.ONE){case Pi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(e),this.state=ve.TOUCH_ROTATE;break;case Pi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(e),this.state=ve.TOUCH_PAN;break;default:this.state=ve.NONE}break;case 2:switch(this.touches.TWO){case Pi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(e),this.state=ve.TOUCH_DOLLY_PAN;break;case Pi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(e),this.state=ve.TOUCH_DOLLY_ROTATE;break;default:this.state=ve.NONE}break;default:this.state=ve.NONE}this.state!==ve.NONE&&this.dispatchEvent(Up)}function IR(e){switch(this._trackPointer(e),this.state){case ve.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(e),this.update();break;case ve.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(e),this.update();break;case ve.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(e),this.update();break;case ve.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(e),this.update();break;default:this.state=ve.NONE}}function PR(e){this.enabled!==!1&&e.preventDefault()}function kR(e){e.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function LR(e){e.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var ch=class extends kr{constructor(){super();let t=new un;t.deleteAttribute("uv");let n=new _e({side:mn}),i=new _e,s=new Ja(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new q(t,n);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let a=new Ha(t,i,6),o=new Ye;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let c=new q(t,qo(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);let l=new q(t,qo(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);let u=new q(t,qo(17));u.position.set(14.904,12.198,-1.832),u.scale.set(.15,4.265,6.331),this.add(u);let h=new q(t,qo(43));h.position.set(-.462,8.89,14.52),h.scale.set(4.38,5.441,.088),this.add(h);let f=new q(t,qo(20));f.position.set(3.235,11.486,-12.541),f.scale.set(2.5,2,.1),this.add(f);let p=new q(t,qo(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){let t=new Set;this.traverse(n=>{n.isMesh&&(t.add(n.geometry),t.add(n.material))});for(let n of t)n.dispose()}};function qo(e){return new Ya({color:0,emissive:16777215,emissiveIntensity:e})}var cl=class extends Ye{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new At(.5,.5),this.addEventListener("removed",function(){this.traverse(function(n){n.element instanceof n.element.ownerDocument.defaultView.Element&&n.element.parentNode!==null&&n.element.remove()})})}copy(t,n){return super.copy(t,n),this.element=t.element.cloneNode(!0),this.center=t.center,this}},Xo=new L,cx=new pe,ux=new pe,hx=new L,dx=new L,uh=class{constructor(t={}){let n=this,i,s,r,a,o={objects:new WeakMap},c=t.element!==void 0?t.element:document.createElement("div");c.style.overflow="hidden",this.domElement=c,this.getSize=function(){return{width:i,height:s}},this.render=function(m,y){m.matrixWorldAutoUpdate===!0&&m.updateMatrixWorld(),y.parent===null&&y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),cx.copy(y.matrixWorldInverse),ux.multiplyMatrices(y.projectionMatrix,cx),u(m,m,y),p(m)},this.setSize=function(m,y){i=m,s=y,r=i/2,a=s/2,c.style.width=m+"px",c.style.height=y+"px"};function l(m){m.isCSS2DObject&&(m.element.style.display="none");for(let y=0,g=m.children.length;y<g;y++)l(m.children[y])}function u(m,y,g){if(m.visible===!1){l(m);return}if(m.isCSS2DObject){Xo.setFromMatrixPosition(m.matrixWorld),Xo.applyMatrix4(ux);let d=Xo.z>=-1&&Xo.z<=1&&m.layers.test(g.layers)===!0,_=m.element;_.style.display=d===!0?"":"none",d===!0&&(m.onBeforeRender(n,y,g),_.style.transform="translate("+-100*m.center.x+"%,"+-100*m.center.y+"%)translate("+(Xo.x*r+r)+"px,"+(-Xo.y*a+a)+"px)",_.parentNode!==c&&c.appendChild(_),m.onAfterRender(n,y,g));let w={distanceToCameraSquared:h(g,m)};o.objects.set(m,w)}for(let d=0,_=m.children.length;d<_;d++)u(m.children[d],y,g)}function h(m,y){return hx.setFromMatrixPosition(m.matrixWorld),dx.setFromMatrixPosition(y.matrixWorld),hx.distanceToSquared(dx)}function f(m){let y=[];return m.traverseVisible(function(g){g.isCSS2DObject&&y.push(g)}),y}function p(m){let y=f(m).sort(function(d,_){if(d.renderOrder!==_.renderOrder)return _.renderOrder-d.renderOrder;let w=o.objects.get(d).distanceToCameraSquared,b=o.objects.get(_).distanceToCameraSquared;return w-b}),g=y.length;for(let d=0,_=y.length;d<_;d++)y[d].element.style.zIndex=g-d}}};var ul=new L;function yi(e,t,n,i,s,r){let a=2*Math.PI*s/4,o=Math.max(r-2*s,0),c=Math.PI/4;ul.copy(t),ul[i]=0,ul.normalize();let l=.5*a/(a+o),u=1-ul.angleTo(e)/c;return Math.sign(ul[n])===1?u*l:o/(a+o)+l+l*(1-u)}var jo=class e extends un{constructor(t=1,n=1,i=1,s=2,r=.1){let a=s*2+1;if(r=Math.min(t/2,n/2,i/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:n,depth:i,segments:s,radius:r},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let c=new L,l=new L,u=new L(t,n,i).divideScalar(2).subScalar(r),h=this.attributes.position.array,f=this.attributes.normal.array,p=this.attributes.uv.array,m=h.length/6,y=new L,g=.5/a;for(let d=0,_=0;d<h.length;d+=3,_+=2)switch(c.fromArray(h,d),l.copy(c),l.x-=Math.sign(l.x)*g,l.y-=Math.sign(l.y)*g,l.z-=Math.sign(l.z)*g,l.normalize(),h[d+0]=u.x*Math.sign(c.x)+l.x*r,h[d+1]=u.y*Math.sign(c.y)+l.y*r,h[d+2]=u.z*Math.sign(c.z)+l.z*r,f[d+0]=l.x,f[d+1]=l.y,f[d+2]=l.z,Math.floor(d/m)){case 0:y.set(1,0,0),p[_+0]=yi(y,l,"z","y",r,i),p[_+1]=1-yi(y,l,"y","z",r,n);break;case 1:y.set(-1,0,0),p[_+0]=1-yi(y,l,"z","y",r,i),p[_+1]=1-yi(y,l,"y","z",r,n);break;case 2:y.set(0,1,0),p[_+0]=1-yi(y,l,"x","z",r,t),p[_+1]=yi(y,l,"z","x",r,i);break;case 3:y.set(0,-1,0),p[_+0]=1-yi(y,l,"x","z",r,t),p[_+1]=1-yi(y,l,"z","x",r,i);break;case 4:y.set(0,0,1),p[_+0]=1-yi(y,l,"x","y",r,t),p[_+1]=1-yi(y,l,"y","x",r,n);break;case 5:y.set(0,0,-1),p[_+0]=yi(y,l,"x","y",r,t),p[_+1]=1-yi(y,l,"y","x",r,n);break}}static fromJSON(t){return new e(t.width,t.height,t.depth,t.segments,t.radius)}};var Op=(e,t,n)=>t!=null&&e>=t&&e-t<n;function fx(e,t,n={kind:null,k:0}){if(n.kind=null,n.k=0,t.asleep)return n;if(Op(e,t.perkAt,1.4))return hl(n,"perk",(e-t.perkAt)/1.4);if(Op(e,t.sulkAt,3))return hl(n,"sulk",(e-t.sulkAt)/3);if(Op(e,t.cheerAt,1.6))return hl(n,"cheer",(e-t.cheerAt)/1.6);if(t.thinking)return hl(n,"think",e%1.2/1.2);if(t.idleFor>=20){let i=(e+(t.seed??0)*7)%28;if(i<2.4)return hl(n,"yawn",i/2.4)}return n}function hl(e,t,n){return e.kind=t,e.k=n,e}function px(e,t=.15,n=.3){if(e<=0||e>=1)return 0;let i=e<t?e/t:e>1-n?(1-e)/n:1;return i*i*(3-2*i)}var Fp=new Map,DR=new Vn(1,12,10),NR=new _e({color:"#fbf6ec",roughness:.5});function xi(e,t,n,i=.08){let s=`${e}|${t}|${n}|${i}`;return Fp.has(s)||Fp.set(s,new jo(e,t,n,4,Math.min(i,e/2,t/2,n/2))),Fp.get(s)}var mx={session:{w:2.1,h:1.05,d:1.15,legs:4,legH:.7,eye:[.24,.3],crown:"gem"},"general-purpose":{w:1.9,h:.95,d:1,legs:4,legH:.62,eye:[.22,.28],crown:"none"},Explore:{w:2.1,h:.8,d:1,legs:4,legH:.5,eye:[.28,.24],crown:"periscope"},Plan:{w:1.6,h:1.3,d:1,legs:2,legH:.6,eye:[.2,.26],crown:"cap"},"code-reviewer":{w:1.9,h:1,d:1,legs:4,legH:.58,eye:[.2,.22],crown:"glasses"},"test-runner":{w:2,h:.85,d:.95,legs:6,legH:.55,eye:[.2,.26],crown:"antennae"}};function Bp({build:e="general-purpose",bodyColor:t,inkColor:n,accentColor:i,pick:s}){let r=mx[e]??mx["general-purpose"],a=new Ht,o=new Ht;a.add(o);let c=new _e({color:t,roughness:.42}),l=new _e({color:n,roughness:.2}),u=new _e({color:i,roughness:.3}),h=[],f=Math.min(.26,r.w*.8/(r.legs*1.6));for(let S=0;S<r.legs;S++){let T=(S-(r.legs-1)/2)*(r.w*.78/Math.max(1,r.legs-1)),I=new q(xi(f,r.legH+.1,r.d*.3,.04),c);I.position.set(r.legs===2?T*.7:T,r.legH/2,0),I.userData.phase=S%2?Math.PI:0,h.push(I)}let p=new Ht;p.position.y=r.legH;let m=new q(xi(r.w,r.h,r.d,.14),c);m.position.y=r.h/2;let y=[-1,1].map(S=>{let T=new Ht;T.position.set(S*(r.w/2),r.h*.58,0);let I=new q(xi(.42,.32,r.d*.42,.06),c);return I.position.x=S*.19,T.add(I),T.userData.side=S,T}),[g,d]=r.eye,_=[-1,1].map(S=>{let T=new q(xi(g,d,.06,.02),l);return T.position.set(S*r.w*.25,r.h*.64,r.d/2+.01),T});p.add(m,...y,..._);let w=null,b=r.legH+r.h;if(r.crown==="gem")w=new q(new qa(.2,0),new _e({color:i,emissive:i,emissiveIntensity:.2,roughness:.3,flatShading:!0})),w.position.y=r.h+.55,w.scale.y=1.35,p.add(w),b+=.95;else if(r.crown==="periscope"){let S=new q(xi(.12,.5,.12,.04),l);S.position.set(r.w*.28,r.h+.25,0);let T=new q(xi(.3,.2,.3,.06),u);T.position.set(r.w*.28,r.h+.58,.05),p.add(S,T),b+=.7}else if(r.crown==="cap"){let S=new q(xi(r.w*.9,.14,r.d*1.05,.04),u);S.position.y=r.h+.07;let T=new q(xi(r.w*.6,.06,.4,.03),u);T.position.set(0,r.h+.03,r.d/2+.15),p.add(S,T),b+=.15}else if(r.crown==="glasses"){for(let T of[-1,1]){let I=new q(xi(g+.16,d+.14,.05,.03),u);I.position.set(T*r.w*.25,r.h*.64,r.d/2+.005),p.add(I)}let S=new q(xi(r.w*.2,.05,.05,.02),u);S.position.set(0,r.h*.68,r.d/2+.02),p.add(S);for(let T of _)T.position.z+=.03}else if(r.crown==="antennae"){for(let S of[-1,1]){let T=new q(xi(.08,.36,.08,.03),l);T.position.set(S*r.w*.2,r.h+.16,0),T.rotation.z=-S*.35;let I=new q(xi(.16,.16,.16,.05),u);I.position.set(S*(r.w*.2+.12),r.h+.36,0),p.add(T,I)}b+=.45}let A=new Ht;A.position.set(r.w*.42,r.h+.25,0),A.visible=!1,[.13,.18,.24].forEach((S,T)=>{let I=new q(DR,NR);I.scale.setScalar(S),I.position.set(T*.22,T*.3,0),I.userData.r=S,A.add(I)}),p.add(A),o.add(p,...h),a.traverse(S=>{S.isMesh&&(S.castShadow=S.parent!==A,s&&(S.userData.pick=s))});for(let S of _)S.castShadow=!1;return{root:a,rig:o,top:p,eyes:_,arms:y,legs:h,bulb:w,bodyMat:c,inkMat:l,accentMat:u,height:b,dots:A,seed:Math.random()*10,blinkAt:1+Math.random()*3}}function hh(e,t,{busy:n=0,look:i=0,hop:s=0,alarm:r=!1,asleep:a=!1}={}){let o=Math.sin(t*(a?.9:2)+e.seed)*.02,c=Math.sin(Math.min(1,s)*Math.PI)*.5;e.rig.position.y=c,e.top.scale.set(1+o*.5,1-o,1+o*.5),e.top.position.y=e.legs[0].position.y*2+n*Math.abs(Math.sin(t*8+e.seed))*.06,e.rig.rotation.y+=(i-e.rig.rotation.y)*.08,e.top.rotation.z=n*Math.sin(t*4+e.seed)*.04;for(let u of e.legs)u.rotation.x=n*Math.sin(t*14+u.userData.phase)*.35,u.scale.y=1-c*.4;for(let u of e.arms){let h=u.userData.side,f=n*Math.sin(t*9+e.seed+(h>0?Math.PI:0))*.35;u.rotation.z=h*(r?1.1+Math.sin(t*7)*.2:f+c*.7)}t>e.blinkAt+.14&&(e.blinkAt=t+2+Math.random()*4);let l=a||t>e.blinkAt&&t<e.blinkAt+.14;for(let u of e.eyes)u.scale.y=l?.15:1;e.bulb&&(e.bulb.rotation.y=t*(.6+n*2.4),e.bulb.position.y=e.bulb.userData.y??=e.bulb.position.y,e.bulb.position.y+=Math.sin(t*2+e.seed)*.06,e.bulb.material.emissiveIntensity=.15+n*(.55+.35*Math.sin(t*8)))}function dh(e,t,n,i=!1){let s=n?.kind;e.dots.visible=s==="think",e.top.rotation.x=0;for(let o of e.eyes)o.scale.x=1;if(!s)return;let r=n.k;if(s==="think"){e.dots.children.forEach((o,c)=>o.scale.setScalar(o.userData.r*(i?1:1+.35*Math.max(0,Math.sin((r-c/3)*Math.PI*2)))));return}let a=px(r);if(s==="cheer"){for(let o of e.arms)o.rotation.z=o.userData.side*(1.25+(i?0:Math.sin(t*18)*.2))*a;for(let o of e.eyes)o.scale.y=1-.55*a;i||(e.rig.position.y+=Math.abs(Math.sin(r*Math.PI*3))*.35*a)}else if(s==="sulk"){e.top.rotation.x=.28*a,e.top.position.y-=.08*a;for(let o of e.arms)o.rotation.z=o.userData.side*-.15*a;for(let o of e.eyes)o.scale.y=Math.min(o.scale.y,1-.55*a)}else if(s==="perk"){e.top.rotation.x=-.22*a;for(let o of e.eyes)o.scale.y=1+.3*a,o.scale.x=1+.15*a;i||(e.rig.position.y+=Math.sin(Math.min(1,r*2.5)*Math.PI)*.25)}else if(s==="yawn"){e.top.rotation.x=-.18*a,e.top.scale.y*=1+.06*a;for(let o of e.arms)o.rotation.z=o.userData.side*1.05*a;for(let o of e.eyes)o.scale.y=1-.85*a}}var gx=e=>e>=20||e<7,yx=e=>Math.min(1,Math.max(0,e>=12?e-19.5:7.5-e)),xx=e=>e<=0||e>=1?0:Math.min(1,e/.2,(1-e)/.3);function Hp(e,t=!1){let n=e[0].index!==null,i=new Set(Object.keys(e[0].attributes)),s=new Set(Object.keys(e[0].morphAttributes)),r={},a={},o=e[0].morphTargetsRelative,c=new En,l=0;for(let u=0;u<e.length;++u){let h=e[u],f=0;if(n!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in h.attributes){if(!i.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(h.attributes[p]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in h.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[p]===void 0&&(a[p]=[]),a[p].push(h.morphAttributes[p])}if(t){let p;if(n)p=h.index.count;else if(h.attributes.position!==void 0)p=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,p,u),l+=p}}if(n){let u=0,h=[];for(let f=0;f<e.length;++f){let p=e[f].index;for(let m=0;m<p.count;++m)h.push(p.getX(m)+u);u+=e[f].attributes.position.count}c.setIndex(h)}for(let u in r){let h=_x(r[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,h)}for(let u in a){let h=a[u][0].length;if(h===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let f=0;f<h;++f){let p=[];for(let y=0;y<a[u].length;++y)p.push(a[u][y][f]);let m=_x(p);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(m)}}return c}function _x(e){let t,n,i,s=-1,r=0;for(let l=0;l<e.length;++l){let u=e[l];if(t===void 0&&(t=u.array.constructor),t!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(n===void 0&&(n=u.itemSize),n!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*n}let a=new t(r),o=new ln(a,n,i),c=0;for(let l=0;l<e.length;++l){let u=e[l];if(u.isInterleavedBufferAttribute){let h=c/n;for(let f=0,p=u.count;f<p;f++)for(let m=0;m<n;m++){let y=u.getComponent(f,m);o.setComponent(f+h,m,y)}}else a.set(u.array,c);c+=u.count*n}return s!==void 0&&(o.gpuType=s),o}var be=2.4,ss=46,Es=1.7,Ni=3,Dt=(e,t,n,i=.8)=>new jo(e,t,n,2,Math.min(i,e/2,t/2,n/2)),Ex=16;function vx(e,t,n=!0){let i=document.createElement("canvas");i.width=i.height=e,t(i.getContext("2d"),e);let s=new es(i);return s.wrapS=s.wrapT=Mo,s.colorSpace=n?Ve:Di,s.anisotropy=Ex,s}var Rn=(e,t=1)=>`rgba(${e},${e},${e},${t})`;function ml(e,t,n,i){let s=e.getImageData(0,0,t,t);for(let r=0;r<s.data.length;r+=4){let a=(i()-.5)*n;s.data[r]+=a,s.data[r+1]+=a,s.data[r+2]+=a}e.putImageData(s,0,0)}function Tx(e,t,n,i,s,r,a){let o=Math.round(s/2.5);for(let c=0;c<o;c++){let l=n+r()*s,u=.6+r()*2.2,h=.004+r()*.012,f=r()*10;e.strokeStyle=Rn(r()<.5?0:255,a*(.4+r())),e.lineWidth=.6+r()*1.4,e.beginPath();for(let p=0;p<=i;p+=6){let m=l+Math.sin(p*h+f)*u;p===0?e.moveTo(t+p,m):e.lineTo(t+p,m)}e.stroke()}}var bx=8;function UR(e){let t=_i("planks"),n=e/bx,i=[];for(let s=0;s<bx;s++){let r=t()*e,a=r+e;for(;r<a;){let o=Math.min(a-r,e*(.3+t()*.4));i.push({x:r,y:s*n,w:o,h:n,tone:.8+t()*.2,knot:t()<.25?[t(),t()]:null,seed:t()}),r+=o}}return i}function OR(e,t,n){let i=UR(t);e.fillStyle=Rn(n?128:255),e.fillRect(0,0,t,t);for(let s of i)for(let r of[0,-t]){let a=s.x+r;if(a+s.w<0||a>t)continue;let o=_i(s.seed);if(e.save(),e.beginPath(),e.rect(a,s.y,s.w,s.h),e.clip(),n||(e.fillStyle=Rn(Math.round(255*s.tone)),e.fillRect(a,s.y,s.w,s.h)),Tx(e,a,s.y,s.w,s.h,o,n?.2:.13),s.knot){let c=a+s.knot[0]*s.w,l=s.y+.2*s.h+s.knot[1]*.6*s.h;for(let u=4;u>0;u--)e.strokeStyle=Rn(0,n?.18:.08),e.lineWidth=1.2,e.beginPath(),e.ellipse(c,l,u*5,u*2,0,0,Math.PI*2),e.stroke()}e.restore(),e.fillStyle=Rn(0,n?.9:.28),e.fillRect(a-1,s.y,2,s.h),e.fillRect(a,s.y,s.w,2),n||(e.fillStyle=Rn(255,.25),e.fillRect(a,s.y+2,s.w,1))}n||ml(e,t,6,_i("planks-speckle"))}function FR(e,t,n){let i=t/2;e.fillStyle=Rn(n?128:255),e.fillRect(0,0,t,t),n||(e.fillStyle=Rn(0,.035),e.fillRect(0,0,i,i),e.fillRect(i,i,i,i)),ml(e,t,n?70:16,_i("carpet")),e.fillStyle=Rn(0,n?.7:.1);for(let s of[0,i])e.fillRect(s,0,2,t),e.fillRect(0,s,t,2)}function BR(e,t,n){let i=t/2;e.fillStyle=Rn(n?160:255),e.fillRect(0,0,t,t),n||(e.fillStyle=Rn(0,.14),e.fillRect(0,0,i,i),e.fillRect(i,i,i,i),ml(e,t,5,_i("checker"))),e.fillStyle=n?Rn(0):Rn(120,.55);for(let s of[0,i])e.fillRect(s-3,0,6,t),e.fillRect(0,s-3,t,6)}function HR(e,t,n){e.fillStyle=Rn(n?128:255),e.fillRect(0,0,t,t),Tx(e,0,0,t,t,_i("wood"),n?.16:.1),n||ml(e,t,5,_i("wood-speckle"))}function zR(e,t,n){e.fillStyle=Rn(n?128:255),e.fillRect(0,0,t,t);for(let i=0;i<t;i+=4)e.fillStyle=Rn(0,n?.25:.035),e.fillRect(i,0,1,t),e.fillRect(0,i,t,1);ml(e,t,n?40:10,_i("fabric"))}var Vp={planks:{draw:OR,size:1024,unit:72,roughness:.5,bump:2.5},carpet:{draw:FR,size:512,unit:70,roughness:.95,bump:.6},checker:{draw:BR,size:512,unit:40,roughness:.3,bump:1.5},wood:{draw:HR,size:512,unit:0,roughness:.5,bump:.5},fabric:{draw:zR,size:256,unit:0,roughness:.9,bump:.6}},zp={};function Ax(e){if(!zp[e]){let{draw:t,size:n}=Vp[e];zp[e]={map:vx(n,(i,s)=>t(i,s,!1)),bump:vx(n,(i,s)=>t(i,s,!0),!1)}}return zp[e]}function Gp(e,t,n,i="planks"){let{unit:s,roughness:r,bump:a}=Vp[i],o=Ax(i),c=o.map.clone(),l=o.bump.clone();for(let u of[c,l])u.repeat.set(t/s,n/s),u.needsUpdate=!0;return new _e({color:e,map:c,bumpMap:l,bumpScale:a,roughness:r})}function Rx(e,t,n={}){let{roughness:i,bump:s}=Vp[e],r=Ax(e);return new _e({color:t,map:r.map,bumpMap:r.bump,bumpScale:s,roughness:i,...n})}var Ui=e=>Rx("wood",e),mh=e=>Rx("fabric",e),fh=null;function $R(){if(fh)return fh;let e=document.createElement("canvas");e.width=4,e.height=64;let t=e.getContext("2d"),n=t.createLinearGradient(0,0,0,64);return n.addColorStop(0,"#fff"),n.addColorStop(.35,"#6a6a6a"),n.addColorStop(1,"#000"),t.fillStyle=n,t.fillRect(0,0,4,64),fh=new es(e),fh}var VR={back:0,left:Math.PI/2,right:-Math.PI/2,front:Math.PI};function $p(e,t,n){let i=e.map(([r,a,o,c,l])=>new Tn(r,a).rotateX(-Math.PI/2).rotateY(VR[l]).translate(o,t,c)),s=new q(Hp(i),new cn({color:"#000",alphaMap:$R(),transparent:!0,opacity:n,depthWrite:!1}));for(let r of i)r.dispose();return s}function Cx(e,t){let n=e.attributes.position,i=new Float32Array(n.count*3);for(let s=0;s<n.count;s++){let r=Ss.smoothstep(n.getY(s)/t+.5,0,.55);i.fill(.74+.26*r,s*3,s*3+3)}return e.setAttribute("color",new ln(i,3)),e}function _i(e){let t=2166136261;for(let n of String(e))t=Math.imul(t^n.charCodeAt(0),16777619)>>>0;return()=>(t=Math.imul(t^t>>>15,2246822507)>>>0,t=Math.imul(t^t>>>13,3266489909)>>>0,((t^=t>>>16)>>>0)/4294967296)}var Wt=(e,t={})=>new _e({color:e,roughness:.7,...t}),$r=new _e({color:"#bfe3f7",emissive:"#bfe3f7",emissiveIntensity:.4,roughness:.15}),Yo=new _e({color:"#fbf6ec",emissive:"#ffcf7a",emissiveIntensity:.55,side:Gn,roughness:.6});function Oi(e){return e.traverse(t=>{t.isMesh&&(t.castShadow=!0,t.receiveShadow=!0)}),e}var GR=new Set([$r,Yo]),WR=(e,t)=>`${GR.has(t)?t.uuid:`${t.type}|${t.color?.getHex()}|${t.emissive?.getHex()}|${t.emissiveIntensity}|${t.roughness}|${t.metalness}|${t.side}|${t.map?.uuid}|${t.bumpMap?.uuid}|${t.vertexColors}`}|${e.castShadow}|${e.receiveShadow}`;function Vr(e,t=[]){e.updateMatrixWorld(!0);let n=e.matrixWorld.clone().invert(),i=new Set;for(let r of t)r.traverse(a=>i.add(a));let s=new Map;e.traverse(r=>{if(!r.isMesh||i.has(r)||r===e||r.children.length||Array.isArray(r.material)||r.material.transparent||r.matrixWorld.determinant()<0)return;let a=WR(r,r.material);s.has(a)||s.set(a,[]),s.get(a).push(r)});for(let r of s.values()){if(r.length<2)continue;let a=r.map(h=>{let f=h.geometry.index?h.geometry.toNonIndexed():h.geometry.clone();return f.clearGroups(),f.applyMatrix4(n.clone().multiply(h.matrixWorld))}),o=Object.keys(a[0].attributes).filter(h=>a.every(f=>f.attributes[h]));for(let h of a)for(let f of Object.keys(h.attributes))o.includes(f)||h.deleteAttribute(f);let c=Hp(a);for(let h of a)h.dispose();if(!c)continue;let l=r[0],u=new q(c,l.material);u.castShadow=l.castShadow,u.receiveShadow=l.receiveShadow;for(let h of r)h.removeFromParent();e.add(u)}return e}function qR(e,t){let n=new Ht,i=Ui(e.woodDark),s=new q(Dt(44,30,11,1),i);s.position.y=15,n.add(s);for(let r of[4,15.5]){let a=-19;for(;a<17;){let o=2.2+t()*2.2,c=7+t()*3,l=new q(Dt(o,c,7.5,.4),Wt(e.books[Math.floor(t()*e.books.length)],{roughness:.55}));l.position.set(a+o/2,r+c/2,2.4),l.rotation.z=t()<.12?.25:0,n.add(l),a+=o+.4,t()<.1&&(a+=4)}}s.scale.z=.35,s.position.z=-3.5;for(let r of[.8,12.6,24.4,29]){let a=new q(Dt(44,1.6,11,.4),i);a.position.y=r,n.add(a)}for(let r of[-21.2,21.2]){let a=new q(Dt(1.6,30,11,.4),i);a.position.set(r,15,0),n.add(a)}return Oi(n)}function pl(e,t){let n=new Ht;n.userData.plant=t()*10;let i=new q(new ue(5,3.8,8,28),Wt(e.pot,{roughness:.35}));i.position.y=4,n.add(i);let s=Wt(e.leaf,{roughness:.6}),r=5+Math.floor(t()*3);for(let a=0;a<r;a++){let o=new q(new Wa(3.4+t()*2,0),s),c=a/r*Math.PI*2;o.position.set(Math.cos(c)*3,11+t()*9,Math.sin(c)*3),o.scale.y=1.3,n.add(o)}return Vr(Oi(n))}function XR(e){let t=new Ht,n=Wt(e.woodDark,{roughness:.3,metalness:.6}),i=new q(new ue(3.6,4,1.2,28),n);i.position.y=.6;let s=new q(new ue(.45,.45,26,8),n);s.position.y=13;let r=new q(new ue(3.4,6,7,24,1,!0),Yo);return r.position.y=28,t.add(i,s,r),Oi(t),r.castShadow=!1,t}function jR(e,t){let n=new Ht,i=Wt(e.trim,{roughness:.4}),s=new q(new Tn(t,15),$r);s.position.set(0,18,.3),n.add(s);for(let[r,a,o,c]of[[0,25.8,t+2,1.6],[0,10.2,t+3,1.8],[-t/2-.4,18,1.6,17],[t/2+.4,18,1.6,17],[0,18,1,15],[0,18,t,1]]){let l=new q(Dt(o,c,1.6,.3),i);l.position.set(r,a,.9),n.add(l)}return n}function YR(e,t){let n=new Ht,i=new q(Dt(14,11,1,.3),Ui(e.woodDark));i.position.set(0,20,.6);let s=new q(new Tn(11,8),Wt(e.books[Math.floor(t()*e.books.length)]));s.position.set(0,20,1.15);let r=new q(new ko(1.8,20),Wt(e.trim));return r.position.set(2.5,21,1.2),n.add(i,s,r),n}function KR(e,t){let n=new Ht,i=mh(e.books[Math.floor(t()*e.books.length)]),s=new q(Dt(30,6,13,2.5),i);s.position.y=5;let r=new q(Dt(30,10,4,2),i);r.position.set(0,10,-5);let a=[-1,1].map(o=>{let c=new q(Dt(4,9,13,2),i);return c.position.set(o*15,6.5,0),c});return n.add(s,r,...a),Oi(n)}function Ix({w:e,d:t,name:n,colors:i}){let s=_i(n),r=new Ht,a=new q(Dt(e,be,t,.6),Gp(i.wood,e,t));a.position.y=be/2,a.receiveShadow=!0,r.add(a);let o=Wt(i.wall,{roughness:.85,vertexColors:!0}),c=Wt(i.trim,{roughness:.4}),l=[[e+Ni*2,0,-t/2-Ni/2,"back"],[t,-e/2-Ni/2,0,"side"],[t,e/2+Ni/2,0,"side"]];for(let[d,_,w,b]of l){let A=Cx(b==="back"?Dt(d,ss,Ni,.6):Dt(Ni,ss,d,.6),ss),S=new q(A,o);S.position.set(_,ss/2,w),S.castShadow=S.receiveShadow=!0;let T=new q(b==="back"?Dt(d+1,1.6,Ni+1.2,.4):Dt(Ni+1.2,1.6,d+1,.4),c);T.position.set(_,ss+.6,w);let I=new q(b==="back"?Dt(d+.6,2.4,Ni+.8,.3):Dt(Ni+.8,2.4,d+.6,.3),c);I.position.set(_,be+1.2,w),r.add(S,T,I)}let u=16,h=14,f=Ni;r.add($p([[e,u,0,-t/2+u/2,"back"],[t,u,-e/2+u/2,0,"left"],[t,u,e/2-u/2,0,"right"]],be+.08,.32),$p([[e+2*f,h,0,-t/2-f-h/2,"front"],[e,h,0,t/2+h/2,"back"],[t+f,h,-e/2-f-h/2,-f/2,"right"],[t+f,h,e/2+f+h/2,-f/2,"left"]],.48,.22));let p=-t/2+1,m=(d,_,w,b,A=Es)=>{d.scale.setScalar(A),d.position.set(_,w,b),r.add(d)},y={x:-e/2+48+s()*10,z:p+9.5};m(qR(i,s),y.x,be,y.z),m(jR(i,Math.min(46,e*.12)),e*.02,-8,p),e>300&&m(YR(i,s),e*.24,-6,p),m(pl(i,s),e/2-18,be,p+16),m(pl(i,s),-e/2+16,be,t/2-20,Es*.8),m(XR(i),e/2-16,be,t/2-18,Es*.9),e>380&&s()<.8&&m(KR(i,s),e*.27,be,p+18);let g=Wp(r);return Vr(r,g),{group:r,floor:a,wallMat:o,plants:g,shelfAt:y}}var wx=8,ph=null;function Mx(e,t,n){let i=document.createElement("canvas");i.width=e,i.height=t,n(i.getContext("2d"),e,t);let s=new es(i);return s.colorSpace=Ve,s.anisotropy=Ex,s}function ZR(){if(ph)return ph;let e=Mx(512,128,(n,i,s)=>{n.textAlign="center",n.textBaseline="middle",n.font='italic 700 92px Georgia, "Times New Roman", serif',n.lineJoin="round";for(let[r,a,o]of[[28,10,"rgba(255,92,170,0.85)"],[12,6,"#ff7cc0"],[0,2.6,"#fff1f8"]])n.shadowColor="#ff4fa3",n.shadowBlur=r,n.lineWidth=a,n.strokeStyle=o,n.strokeText("ship it!",i/2,s/2+4)}),t=Mx(200,260,(n,i,s)=>{n.fillStyle="#fbe9d3",n.fillRect(0,0,i,s),n.fillStyle="#f2a65a",n.beginPath(),n.arc(i*.5,s*.36,i*.2,0,Math.PI*2),n.fill(),n.fillStyle="#5fb35a",n.beginPath(),n.moveTo(0,s*.56),n.quadraticCurveTo(i*.3,s*.38,i*.6,s*.54),n.quadraticCurveTo(i*.8,s*.46,i,s*.52),n.lineTo(i,s*.7),n.lineTo(0,s*.7),n.fill(),n.fillStyle="#2fa59a",n.fillRect(0,s*.66,i,s*.34),n.fillStyle="#fbf6ec",n.textAlign="center",n.font="700 27px Georgia, serif",n.fillText("MAKE GOOD",i/2,s*.8),n.fillText("THINGS",i/2,s*.92)});return ph={gold:new _e({color:"#e7b743",metalness:.65,roughness:.28}),neonMat:new cn({map:e,transparent:!0,depthWrite:!1,toneMapped:!1}),posterMat:new _e({map:t,roughness:.8}),cup:new ue(1.35,.7,2.6,16),stem:new ue(.28,.28,1.4,8),base:Dt(2.4,.8,1.8,.2),handle:new ja(.6,.16,6,12),sign:new Tn(1,1)},ph}function JR(e,t){let n=new Ht,i=new q(e.base,t);i.position.y=.4;let s=new q(e.stem,e.gold);s.position.y=1.5;let r=new q(e.cup,e.gold);r.position.y=3.4,n.add(i,s,r);for(let a of[-1,1]){let o=new q(e.handle,e.gold);o.position.set(a*1.3,3.6,0),n.add(o)}return n}function Px({w:e,d:t,colors:n,shelfAt:i}){let s=ZR(),r=new Ht,a=-t/2+1,o=Ui(n.woodDark),c=[];for(let y=0;y<wx;y++){let g=JR(s,o);g.scale.setScalar(Es*(y%2?1.05:1.25)),g.position.set(i.x+(y-(wx-1)/2)*9.2,be+30*Es,i.z+2),g.visible=!1,r.add(Oi(g)),c.push(g)}let l=new q(s.sign,s.neonMat);l.scale.set(42,10.5,1),l.position.set(e*.02,ss-5,a+.6),l.visible=!1;let u=Math.min(46,e*.12)*Es/2+18,h=new Ht,f=new q(Dt(21,27,1,.4),o),p=new q(s.sign,s.posterMat);p.scale.set(19,24.7,1),p.position.z=.55,h.add(f,p),h.position.set(e*.02+(e>300?-u:u),26,a+.6),h.visible=!1,r.add(l,h);let m=null;return{group:r,set(y,g){c.forEach((d,_)=>{d.visible=_<y.trophies}),l.visible=y.neon,h.visible=y.poster,g&&(m??=g.scale.x,g.scale.setScalar(m*[1,1.45,1.85][Math.min(2,y.plant)]))},animate(y){if(!l.visible)return;let g=Math.sin(y*.7)>.995?.55:1;s.neonMat.opacity=g*(.92+Math.sin(y*2.3)*.04)}}}var Wp=e=>{let t=[];return e.traverse(n=>{n.userData.plant!==void 0&&t.push(n)}),t};function kx(e){let t=new q(new ue(30,30,.6,64),mh(e));return t.scale.z=.82,t.position.y=be+.3,t.receiveShadow=!0,t}var Sx=["#7cc4ff","#f6a6c1","#ffd479","#a7e3a1","#c9b6ff","#e8e2d6"];function Lx(e,t){let n=new Ht,i=Ui(e.woodDark),s=new q(Dt(58,2.6,22,.8),Ui(e.desk));s.position.y=17,n.add(s);for(let Q of[-26,26]){let it=new q(Dt(3,16,18,.6),i);it.position.set(Q,8,0),n.add(it)}let r=Wt("#2b2a2e",{roughness:.3,metalness:.4}),a=new q(Dt(3,6,3,.6),r);a.position.set(0,21,-5);let o=new q(Dt(11,1,7,.4),r);o.position.set(0,18.8,-5);let c=new q(Dt(34,21,2,1),r);c.position.set(0,34,-5),n.add(a,o,c);let l=document.createElement("canvas");l.width=160,l.height=96;let u=new es(l);u.colorSpace=Ve;let h=new q(new Tn(31,18),new cn({map:u,toneMapped:!1}));h.position.set(0,34,-3.9),n.add(h);let f=new q(Dt(18,1,6,.4),Wt(e.trim,{roughness:.45}));f.position.set(-3,18.8,5);let p=new q(new ue(2.2,2,4.4,24),Wt(t,{roughness:.25}));p.position.set(20,20.6,4),n.add(f,p),Oi(n),h.castShadow=h.receiveShadow=!1;let m=l.getContext("2d"),y=Array.from({length:40},(Q,it)=>({indent:[0,1,2,1,2,3,1,0][it%8]*10,parts:Array.from({length:1+it*7%4},(nt,yt)=>({w:8+(it*13+yt*29)%36,c:Sx[(it+yt*3)%Sx.length]}))})),g=0,d=-1,_="",w=null;function b(Q,it){w={img:Q,until:it},_=""}function A(Q,it){let nt=Q?`${Q}|${it}`:null;(w?.askKey??null)===nt&&!w?.img||w?.img&&!Q||(w=Q?{ask:Q,color:it,askKey:nt}:null,_="")}function S(Q,it){if(w.img){m.fillStyle="#1f2433",m.fillRect(0,0,160,96);let{img:nt}=w,yt=Math.min(160/nt.width,96/nt.height);m.drawImage(nt,(160-nt.width*yt)/2,(96-nt.height*yt)/2,nt.width*yt,nt.height*yt)}else{m.fillStyle=w.color,m.fillRect(0,0,160,96),m.fillStyle="#ffffff",m.font="700 64px Georgia, serif",m.textAlign="center",m.textBaseline="middle";let nt=it?0:Math.sin(Q*3)*3;m.fillText(w.ask==="permission"?">_":w.ask==="plan"?"\u270E":"?",80,50+nt)}u.needsUpdate=!0}function T(Q,it,nt,yt=!1){if(w?.img&&Q>w.until&&(w=null,_=""),w&&it!=="off"){if(Q-d<.1)return;d=Q,S(Q,yt);return}if(!(it!=="busy"&&it===_)&&!(it==="busy"&&(Q-d<.12||yt&&it===_))){if(d=Q,_=it,m.fillStyle=it==="off"?"#141416":"#1f2433",m.fillRect(0,0,160,96),it==="off"){u.needsUpdate=!0;return}m.fillStyle=nt,m.fillRect(0,0,160,7),m.globalAlpha=it==="busy"?1:.55,it==="busy"&&!yt&&(g=(g+1)%y.length);for(let he=0;he<9;he++){let k=y[(he+g)%y.length],re=8+k.indent;for(let Ft of k.parts)m.fillStyle=Ft.c,m.fillRect(re,13+he*9,Ft.w,4),re+=Ft.w+4}it==="busy"&&!yt&&Math.floor(Q*3)%2&&(m.fillStyle="#ffffff",m.fillRect(8,85,5,5)),m.globalAlpha=1,u.needsUpdate=!0}}let I=[0,.5].map(Q=>{let it=new q(new Vn(1.1,10,10),new cn({color:"#ffffff",transparent:!0,opacity:0,depthWrite:!1}));return it.userData.offset=Q,n.add(it),it});function x(Q,it){for(let nt of I){let yt=(Q*.5+nt.userData.offset)%1;nt.position.set(20+Math.sin(yt*7+nt.userData.offset*5),23+yt*10,4),nt.scale.setScalar(.6+yt),nt.material.opacity=it?.5*(1-yt)*Math.min(1,yt*5):0}}let v=document.createElement("canvas");v.width=128,v.height=84;let R=new es(v);R.colorSpace=Ve;let D=new Ht,B=new q(Dt(13,9.4,1,.4),Wt(e.trim,{roughness:.5})),V=new q(new Tn(11.6,8),new cn({map:R,toneMapped:!1}));V.position.z=.55,D.add(B,V),D.position.set(-22,23.6,1),D.rotation.set(-.18,.3,0),D.visible=!1,n.add(D);function X(Q){let it=v.getContext("2d"),nt=Math.max(128/Q.width,84/Q.height);it.drawImage(Q,(128-Q.width*nt)/2,(84-Q.height*nt)/2,Q.width*nt,Q.height*nt),R.needsUpdate=!0,D.visible=!0}let z=new Ht,Z=new q(Dt(11,1.6,8,.4),Wt(e.woodDark,{roughness:.6}));Z.position.y=.8,z.add(Z),z.position.set(21,18.3,-5),z.visible=!1,n.add(z);let $=[],lt=new _e({color:"#fbf8f1",roughness:.85}),ht=new un(9,.45,6.4),vt=new un(3.2,.5,1.6),qt=0,te=null,Ee=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;function se(Q){let it=Q.length>qt;qt=Q.length;for(let yt of $)z.remove(yt),yt.children[0]?.material.dispose();$.length=0,te=null,Q.slice(-6).forEach((yt,he)=>{let k=new q(ht,lt),re=new q(vt,new _e({color:yt,roughness:.7}));re.position.set(-2.4,.05,-3.4),k.add(re),k.position.set(he%2?.4:-.3,1.9+he*.5,he%3*.2),k.rotation.y=(he*37%9-4)*.03,k.castShadow=!0,z.add(k),$.push(k)}),z.visible=Q.length>0;let nt=$.at(-1);it&&nt&&!Ee&&(te={m:nt,at:-1,rest:nt.position.clone(),turn:nt.rotation.y})}let K=1.4;function tt(Q){if(!te)return;te.at<0&&(te.at=Q);let it=Math.min(1,(Q-te.at)/K),{m:nt,rest:yt,turn:he}=te,k=1-it*it,re=it>.75?Math.sin((it-.75)/.25*Math.PI)*.6:0;nt.position.set(yt.x+Math.sin(it*9)*3*k,yt.y+34*k+re,yt.z+Math.cos(it*7)*1.2*k),nt.rotation.set(Math.sin(it*11)*.35*k,he+k*1.4,Math.cos(it*9)*.3*k),nt.scale.setScalar(1+.8*k),it>=1&&(nt.position.copy(yt),nt.rotation.set(0,he,0),nt.scale.setScalar(1),te=null)}return Oi(D),V.castShadow=V.receiveShadow=!1,Vr(n,[h,p,...I,D,z]),{group:n,draw:T,steam:x,mug:p,showImage:b,showAsk:A,setPhoto:X,setTray:se,animateTray:tt}}function Dx(e){let t=new Ht,n=Wt(e.woodDark,{roughness:.6});for(let p of[-9,9]){let m=new q(Dt(1.6,44,1.6,.5),n);m.position.set(p,22,0),m.rotation.z=p<0?.06:-.06,t.add(m)}let i=new q(Dt(1.4,40,1.4,.5),n);i.position.set(0,20,-6),i.rotation.x=-.28,t.add(i);let s=new q(Dt(26,30,1.6,.8),Wt(e.trim,{roughness:.4}));s.position.set(0,30,.6),t.add(s);let r=new q(Dt(24,1.2,3,.4),n);r.position.set(0,14.6,1.6);let a=new q(new ue(.5,.5,5,10),Wt("#b85c3c"));a.rotation.z=Math.PI/2,a.position.set(5,15.6,1.8),t.add(r,a);let o=document.createElement("canvas");o.width=192,o.height=224;let c=new es(o);c.colorSpace=Ve,c.anisotropy=8;let l=new q(new Tn(24,28),new cn({map:c,toneMapped:!1}));l.position.set(0,30,1.45),t.add(l),Oi(t),l.castShadow=l.receiveShadow=!1;let u=o.getContext("2d"),h="";function f(p,m,y){let g=p.findIndex(S=>S.status==="in_progress"),d=g>=0&&Math.floor(y*2)%2,_=`${p.map(S=>S.status+S.text).join("|")}|${m}|${d}`;if(_===h)return;h=_,u.fillStyle="#fdfcf8",u.fillRect(0,0,192,224);let w=p.filter(S=>S.status==="completed").length;u.fillStyle=w===p.length?"#5f8a68":"#2b2a2e",u.font="600 23px Georgia, serif",u.textBaseline="alphabetic",u.textAlign="left",u.fillText(w===p.length?"All done \u2713":`${w} of ${p.length} done`,12,28);let b=(S,T)=>{u.fillStyle=T,u.beginPath(),u.roundRect(12,37,Math.max(S,9),9,4.5),u.fill()};b(168,"#e6dfd3"),w&&b(168*(w/p.length),"#5f8a68");let A=Math.max(0,Math.min(g-1,p.length-6));p.slice(A,A+6).forEach((S,T)=>{let I=70+T*26,x=S.status==="completed",v=S.status==="in_progress";u.strokeStyle=x?"#5f8a68":v?m:"#b8afa2",u.lineWidth=2.5,u.strokeRect(12,I-13,15,15),x?(u.beginPath(),u.moveTo(14,I-6),u.lineTo(19,I-1),u.lineTo(27,I-14),u.stroke()):v&&d&&(u.fillStyle=m,u.fillRect(16,I-9,7,7)),u.font=`${v?600:400} 15px -apple-system, "Segoe UI", sans-serif`,u.fillStyle=x?"#a39b90":"#2b2a2e";let R=S.text;for(;u.measureText(R).width>146&&R.length>4;)R=`${R.slice(0,-2)}\u2026`.replace(/……$/,"\u2026");u.fillText(R,34,I),x&&(u.strokeStyle="#a39b90",u.lineWidth=1.5,u.beginPath(),u.moveTo(34,I-5),u.lineTo(34+u.measureText(R).width,I-5),u.stroke())}),c.needsUpdate=!0}return Vr(t,[l]),{group:t,draw:f}}var fl=180,zr=150;function Nx(e){let t=new Ht,n=_i("coffee"),i=new q(Dt(fl,1.4,zr,.6),Gp(e.tile,fl,zr,"checker"));i.position.y=.7,i.receiveShadow=!0,t.add(i);let s=-zr/2+14,r=new q(Dt(120,22,24,1),Wt(e.counter,{roughness:.45}));r.position.set(-25,11,s);let a=new q(Dt(124,2.4,26,.6),Ui(e.woodDark));a.position.set(-25,23,s),t.add(r,a);for(let v of[-70,-40,-10,20]){let R=new q(Dt(6,1,1,.3),Wt(e.trim,{roughness:.25,metalness:.7}));R.position.set(v,18,s+12.4),t.add(R)}let o=new Ht,c=new q(Dt(20,24,15,2),Wt("#3a3633",{roughness:.25,metalness:.5}));c.position.y=12;let l=new q(Dt(20,4,18,1),Wt("#4a4541",{roughness:.25,metalness:.6}));l.position.set(0,23,1.5);let u=new q(new Vn(1,12,12),new cn({color:"#ff6a4d"}));u.position.set(6,17,7.6);let h=new q(new ue(2.4,2,4.4,16),Wt(e.trim));h.position.set(-2,3,8.5),o.add(c,l,u,h),o.position.set(-55,24.2,s-1),t.add(o),e.mugs.forEach((v,R)=>{let D=new q(new ue(2.2,2,4.6,24),Wt(v,{roughness:.25}));D.position.set(-28+R*6.5,26.5,s+5-R%2*4),t.add(D)});let f=new q(new ue(4,4,9,18),Wt(e.window,{transparent:!0,opacity:.75,roughness:.2}));f.position.set(18,29,s-2),t.add(f);let p=new q(Dt(28,60,24,2),Wt(e.fridge,{roughness:.3}));p.position.set(55,30,s);let m=new q(Dt(1.6,14,1.6,.5),Wt("#9a948c",{roughness:.2,metalness:.8}));m.position.set(44,40,s+12.6),t.add(p,m);let y=new Ht,g=new q(new ue(20,20,2.4,48),Ui(e.desk));g.position.y=20;let d=new q(new ue(1.6,1.6,19,16),Ui(e.woodDark));d.position.y=10;let _=new q(new ue(8,9,1.4,32),Ui(e.woodDark));_.position.y=.7,y.add(g,d,_);for(let v=0;v<3;v++){let R=-Math.PI/2+(v-1)*1.6+Math.PI,D=new q(new ue(6,5.4,12,28),mh(e.mugs[(v*2+1)%e.mugs.length]));D.position.set(Math.cos(R)*28,6,Math.sin(R)*28),y.add(D)}for(let v=0;v<2;v++){let R=new q(new ue(2.2,2,4.4,24),Wt(e.mugs[v*3%e.mugs.length],{roughness:.25}));R.position.set(-6+v*11,23.4,3-v*6),y.add(R)}y.position.set(-10,1.4,38),t.add(y);let w=pl(e,n);w.scale.setScalar(Es),w.position.set(fl/2-14,1.4,zr/2-18),t.add(w),Oi(t),i.castShadow=!1,u.castShadow=!1;let b=new cn({color:"#ffffff",transparent:!0,opacity:.5,depthWrite:!1}),A=Array.from({length:5},(v,R)=>{let D=new q(new Vn(2.4,12,12),b.clone());return D.userData.offset=R/5,t.add(D),D}),S=new L(-57,24.2+27,s+2);function T(v){for(let R of A){let D=(v*.35+R.userData.offset)%1;R.position.set(S.x+Math.sin(D*6+R.userData.offset*9)*2.5,S.y+D*22,S.z),R.scale.setScalar(.6+D*1.4),R.material.opacity=.45*(1-D)*Math.min(1,D*6)}}let I=[...[.25,1,1.75,2.5,-.5,3.4].map(v=>new L(-10+Math.cos(v)*38,1.4,38+Math.sin(v)*30)),...[-62,-30,2].map(v=>new L(v,1.4,s+34))],x=new L(-10,1.4,38);return Vr(t,A),{group:t,animate:T,spots:I,tableAt:x}}var dl=64;function Ux({W:e,D:t,colors:n}){let i=new Ht,s=new q(new un(e,.4,t),Gp(n.carpet,e,t,"carpet"));s.position.y=.2,s.receiveShadow=!0,i.add(s);let r=Wt(n.outerWall,{roughness:.9,vertexColors:!0}),a=Wt(n.trim,{roughness:.4}),o=$r,c=5;for(let[T,I,x,v]of[[e+c*2,0,-t/2-c/2,!0],[t,-e/2-c/2,0,!1],[t,e/2+c/2,0,!1]]){let R=new q(Cx(v?Dt(T,dl,c,1):Dt(c,dl,T,1),dl),r);R.position.set(I,dl/2,x),R.receiveShadow=R.castShadow=!0;let D=new q(v?Dt(T+2,2.4,c+2,.6):Dt(c+2,2.4,T+2,.6),a);D.position.set(I,dl+1,x),i.add(R,D)}let l=30;i.add($p([[e,l,0,-t/2+l/2,"back"],[t,l,-e/2+l/2,0,"left"],[t,l,e/2-l/2,0,"right"]],.45,.28));let u=Math.max(2,Math.floor(e/110));for(let T=0;T<u;T++){let I=-e/2+e/u*(T+.5),x=new q(new Tn(56,36),o);x.position.set(I,34,-t/2+.8),i.add(x);for(let[v,R,D,B]of[[0,52.5,60,2.4],[0,15.5,62,3],[-29,34,2.4,38],[29,34,2.4,38],[0,34,1.6,36]]){let V=new q(Dt(D,B,2,.4),a);V.position.set(I+v,R,-t/2+1.4),i.add(V)}}let h=_i("office");for(let[T,I]of[[-e/2+18,-t/2+18],[e/2-18,-t/2+18],[-e/2+18,t/2-18]]){let x=pl(n,h);x.scale.setScalar(Es*1.3),x.position.set(T,.4,I),i.add(x)}let f=new Ht,p=new q(Dt(14,26,14,1.5),Wt(n.fridge,{roughness:.3}));p.position.y=13;let m=new q(new ue(6,6,16,20),Wt(n.sky,{transparent:!0,opacity:.7,roughness:.1}));m.position.y=34,f.add(p,m),f.position.set(e/2-16,.4,t/2-22),i.add(f);let y=new Ht,g=new q(new ue(9,9,1.6,48),Ui(n.woodDark));g.rotation.x=Math.PI/2;let d=new q(new ko(7.8,32),Wt(n.trim));d.position.z=.9,y.add(g,d);for(let T=0;T<12;T++){let I=new q(new un(.6,T%3?1:1.8,.2),Wt("#2b2a2e")),x=T/12*Math.PI*2;I.position.set(Math.sin(x)*6.6,Math.cos(x)*6.6,1),I.rotation.z=-x,y.add(I)}let _=(T,I,x)=>{let v=new Ht,R=new q(new un(I,T,.3),Wt(x));return R.position.y=T/2-.6,v.add(R),v.position.z=1.2,y.add(v),v},w=_(4.4,1,"#2b2a2e"),b=_(6.4,.6,"#2b2a2e"),A=_(6.8,.25,"#e0573f");y.position.set(-e/2+e/u,46,-t/2+1.2),i.add(y),Oi(i),s.castShadow=!1;let S=Wp(i);return Vr(i,[...S,w,b,A]),{group:i,plants:S,clock:{hour:w,minute:b,second:A}}}var qp=96;function Ox(e){let t=new Ht,n=_i("front desk"),i=Wt(e.counter,{roughness:.45}),s=Ui(e.woodDark),r=[[0,0,64,0],[-40,-9,22,-.55],[40,-9,22,.55]];for(let[d,_,w,b]of r){let A=new q(Dt(w,24,16,1.2),i);A.position.set(d,12,_),A.rotation.y=b;let S=new q(Dt(w+3,2.4,19,.6),s);S.position.set(d,25.2,_-1),S.rotation.y=b,t.add(A,S)}let a=new q(Dt(60,3,1,.4),Wt(e.accent,{roughness:.5}));a.position.set(0,17,8.2),t.add(a);let o=new Ht,c=new q(new Vn(3.2,20,12,0,Math.PI*2,0,Math.PI/2),Wt("#d9b25a",{roughness:.2,metalness:.85})),l=new q(new ue(4,4.2,.8,20),Wt("#2b2a2e",{roughness:.4})),u=new q(new Vn(.8,10,10),Wt("#d9b25a",{roughness:.2,metalness:.85}));l.position.y=.4,c.position.y=.8,u.position.y=4.2,o.add(l,c,u),o.position.set(16,26.4,0),t.add(o),e.mugs.slice(0,4).forEach((d,_)=>{let w=new q(Dt(9,.5,6,.2),Wt(_%2?e.trim:d,{roughness:.8}));w.position.set(-8+(n()-.5),26.6+_*.6,1+(n()-.5)),w.rotation.y=(n()-.5)*.5,t.add(w)});let h=new Ht,f=new q(new ue(.5,.5,10,8),Wt("#2b2a2e"));f.position.y=5;let p=new q(new Va(4,4.4,20,1,!0),Yo);p.position.y=11,h.add(f,p),h.position.set(-28,26.4,-4),t.add(h);let m=pl(e,n);m.scale.setScalar(Es*.9),m.position.set(-62,.4,-6),t.add(m),Oi(t);let y=new q(Dt(26,.6,16,.4),mh(e.woodDark));y.position.set(qp/2+26,.8,14),y.receiveShadow=!0,t.add(y);let g=Wp(t);return Vr(t,[o,...g]),{group:t,bell:o,plants:g}}var Ko=[{id:"write",name:"Write",blurb:"A README, release notes, a how-to",templates:[["A README","Write a short, friendly README for this project: what it does, how to set it up, and how to use it. Keep it plain and easy to skim."],["Release notes","Write release notes for the changes since [the last release], in plain words for people who use it, not the people who built it."],["A how-to","Write a step-by-step how-to for [a task people do here], with an example at each step."]]},{id:"research",name:"Research",blurb:"Find out how something works",templates:[["How does it work?","Explain how [this part of the project] works, in plain words, with the files that matter. Don\u2019t change anything."],["Compare options","Compare a few ways to [solve this problem] for this project. Say what each costs and which you\u2019d pick. Don\u2019t change anything."],["Map the project","Give me a tour of this project: what lives where and how the pieces fit together. Don\u2019t change anything."]]},{id:"fix",name:"Fix",blurb:"Something\u2019s broken or failing",templates:[["A bug","Fix this bug: [what goes wrong, and when]. Find the cause first, then fix it and add a test that would have caught it."],["Failing tests","The tests are failing. Find out why and fix the cause, not the tests, unless the tests are wrong."],["Typos and links","Find and fix typos and broken links in the docs."]]},{id:"review",name:"Review",blurb:"A second pair of eyes",templates:[["My latest changes","Review my latest changes for bugs and anything confusing. List what you find, most important first. Don\u2019t change anything."],["Security","Look through [this part of the project] for security problems. Explain each in plain words and how to fix it. Don\u2019t change anything."],["Easy to use?","Check whether [this feature] is easy to use for someone new. Suggest small fixes. Don\u2019t change anything."]]},{id:"plan",name:"Plan",blurb:"Think it through before building",templates:[["A new feature","Plan how to add [the feature]. Write the plan as small steps with what each one touches. Don\u2019t change any files yet."],["Break it down","Break [a big job] into small steps I can hand out one at a time. Don\u2019t change any files yet."],["A cleanup","Plan a cleanup of [the messy part]: what to tidy first and what to leave alone. Don\u2019t change any files yet."]]},{id:"other",name:"Something else",blurb:"Say it in your own words",templates:[]}];function Fx(e){let t=e.replace(/\s+/g," ").trim().split(/(?<=[.!?])\s/)[0].replace(/[.:]$/,"");return t.length>60?`${t.slice(0,57)}\u2026`:t}function Bx(e,t){if(!t?.session)return null;let n=[...e];for(let i of n)if(i.session===t.session||i.short&&t.session.startsWith(i.short))return i;for(let i of n.reverse())if(i.state==="starting"&&!i.short&&(i.dir===t.cwd||i.dir===t.project))return i;return null}var Kp=document.querySelector('meta[name="agent-office-token"]')?.content||"",QR={write:'<path d="M4 16l1-4 8-8 3 3-8 8-4 1zM11 6l3 3"/>',research:'<circle cx="8.5" cy="8.5" r="4.5"/><path d="M12 12l4.5 4.5"/>',fix:'<path d="M12.5 3.5a3.5 3.5 0 0 0-3.3 4.6L3.5 13.8a1.4 1.4 0 0 0 2 2l5.7-5.7a3.5 3.5 0 0 0 4.6-3.3l-2 .8-1.6-1.6.8-2z"/>',review:'<path d="M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10z"/><circle cx="10" cy="10" r="2.3"/>',plan:'<path d="M3 5l4-1.5 6 2L17 4v11l-4 1.5-6-2L3 16zM7 3.5v11M13 5.5v11"/>',other:'<path d="M10 3v3M10 14v3M3 10h3M14 10h3M5 5l2 2M13 13l2 2M15 5l-2 2M7 13l-2 2"/>',bell:'<path d="M5 14h10l-1.4-2V8.5a3.6 3.6 0 0 0-7.2 0V12zM8.5 16.5a1.6 1.6 0 0 0 3 0M10 3.6v1.3"/>'},xh=e=>`<svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${QR[e]}</svg>`,Hx={starting:["Ringing the bell\u2026","working"],working:["Working","working"],blocked:["Waiting for your OK","asking"],done:["Done","done"],stopped:["Stopped","failed"],failed:["Didn\u2019t start","failed"]},zx=new Set(["starting","working","blocked"]),Ts=new Map;function Zp(e,t=!1){e.kind==="job.start"&&Ts.set(e.job,{id:e.job,t:e.t,dir:e.dir,title:e.title,type:e.type,prompt:e.prompt,state:"starting",demo:e.demo});let n=Ts.get(e.job);if(n){if(e.kind==="job.update"){let i=n.state;for(let s of["state","short","session","error","waitingFor"])e[s]!==void 0&&(n[s]=e[s]);n.state==="blocked"&&i!=="blocked"&&!t&&gl(`\u201C${n.title}\u201D needs your OK before it goes on.`,n),n.state==="failed"&&i!=="failed"&&!t&&gl(n.error??"That job didn\u2019t start.",n,!0)}Vx()}}var $x=()=>Ts.clear(),Jp=e=>Bx(Ts.values(),e),zt,Wr,Fi="write",ir=null,yh=!1,Gr="",Xp=!1,Qp=()=>{let e=new Map;for(let t of F.values()){if(t.kind!=="session"||!t.project||t.project==="unknown")continue;let n=t.projectName??t.project,i=e.get(t.project)??{dir:t.project,raw:n,name:fn(t.project,n),icon:Bs(t.project,n),live:0,last:0};!t.past&&t.status!=="done"&&i.live++,i.last=Math.max(i.last,t.lastAt??t.startedAt??t.endedAt??0),e.set(t.project,i)}return[...e.values()].sort((t,n)=>n.live-t.live||n.last-t.last)};function t2(){return Ko.map(e=>`
    <label class="jcard ${Fi===e.id?"on":""}">
      <input type="radio" name="jkind" value="${e.id}" ${Fi===e.id?"checked":""}>
      <span class="jicon k-${e.id}">${xh(e.id)}</span>
      <b>${P(e.name)}</b>
      <small>${P(e.blurb)}</small>
    </label>`).join("")}function e2(){let e=Ko.find(t=>t.id===Fi);return e.templates.length?e.templates.map(([t],n)=>`<button type="button" class="jchip" data-template="${n}">${P(t)}</button>`).join(""):'<p class="jhint">No template: just say what you\u2019d like done, the way you\u2019d ask a colleague.</p>'}function n2(){let e=Qp();return e.length?(e.some(t=>t.dir===ir)||(ir=e[0].dir),e.map(t=>`
    <label class="jroom ${t.dir===ir?"on":""}" title="${P(t.dir)}">
      <input type="radio" name="jroom" value="${P(t.dir)}" ${t.dir===ir?"checked":""}>
      <i class="room-${yl(t.raw)}" aria-hidden="true">${t.icon}</i><span>${P(t.name)}</span>
      <small>${t.live?`${t.live} working here`:"quiet"}</small>
    </label>`).join("")):'<p class="jhint">No rooms yet. Open Claude Code in a project once and its room appears here.</p>'}function i2(e){let[t,n]=Hx[e.state]??Hx.working,i=Qp().find(c=>c.dir===e.dir)?.name??e.dir.split(/[\\/]/).pop(),s=zx.has(e.state),r=e.short?`claude attach ${e.short}`:"",a=e.state==="blocked"?`<p class="jhelp">It stopped to ask for your OK. To see what and answer, open a terminal and run <code>${P(r)}</code><button type="button" class="jcopy" data-copy="${P(r)}">Copy</button></p>`:e.state==="failed"&&e.error?`<p class="jhelp bad">${P(e.error)}</p>`:s&&r?`<p class="jhelp muted">Running in the background. To watch it or step in: <code>${P(r)}</code></p>`:e.state==="done"&&r?`<p class="jhelp muted">To read its answer or ask for more: <code>${P(r)}</code></p>`:"",o=e.session&&F.get(`s:${e.session}`)?`s:${e.session}`:[...F.values()].find(c=>c.kind==="session"&&Jp(c)===e)?.id;return`
    <li class="jticket ${e.state}">
      <span class="jicon k-${P(e.type??"other")}">${xh(Ko.some(c=>c.id===e.type)?e.type:"other")}</span>
      <div><b>${P(e.title)}</b><small>${P(i)} \xB7 ${Ae(e.t)}</small></div>
      <span class="pill ${n}">${t}</span>
      ${a}
      <span class="jacts">
        ${o?`<button type="button" data-jfind="${P(o)}">Find it</button>`:""}
        ${s?`<button type="button" class="jstop" data-jstop="${P(e.id)}">Stop</button>`:""}
      </span>
    </li>`}function s2(){let e=[...Ts.values()].reverse(),t=Kp||Wr.isDemo()||Wr.bridgeDemo();return`
    <form method="dialog" class="jform">
      <header class="jhead">
        <span class="jbell">${xh("bell")}</span>
        <div><h2 id="desk-title">Front desk</h2><p>Hand Claude a new job. A new teammate walks in to take it.</p></div>
        <button type="button" class="lib-close" data-jclose aria-label="Close">\xD7</button>
      </header>
      <fieldset class="jkinds"><legend>What kind of job?</legend>${t2()}</fieldset>
      <div class="jstep">
        <p class="jlabel" id="jprompt-label">The job</p>
        <div class="jchips">${e2()}</div>
        <textarea id="jprompt" rows="4" aria-labelledby="jprompt-label" placeholder="Say what you\u2019d like done\u2026"></textarea>
      </div>
      <fieldset class="jrooms"><legend>Which room does it go to?</legend>${n2()}</fieldset>
      <ul class="jhow" aria-label="How office jobs run">
        <li><b>It runs in the background.</b> You can close this page; the job keeps going and its critter keeps you posted.</li>
        <li><b>If it needs your OK</b> to run a command or change a file, it waits for you. Its ticket below says how: run <code>claude attach</code> with its id in a terminal and answer there.</li>
        <li><b>Changed your mind?</b> Press Stop on its ticket.</li>
      </ul>
      ${t?"":'<p class="jhelp bad">Starting jobs needs the office opened from its bridge (run /office in Claude Code).</p>'}
      <footer class="jfoot">
        <span class="jnote" role="status">${P(Gr)}</span>
        <button type="button" class="jcancel" data-jclose>Not now</button>
        <button type="submit" class="jgo" ${!t||yh||!Qp().length?"disabled":""}>${yh?"Ringing the bell\u2026":"Start the job"}</button>
      </footer>
      ${e.length?`<section class="jtickets"><p class="jlabel">Started from the front desk</p><ul>${e.map(i2).join("")}</ul></section>`:""}
    </form>`}function sr(){if(!zt?.open)return;let t=zt.querySelector("#jprompt")?.value,n=document.activeElement&&zt.contains(document.activeElement)?r2(document.activeElement):null,i=zt.scrollTop;zt.innerHTML=s2(),t!==void 0&&(zt.querySelector("#jprompt").value=t),n&&zt.querySelector(n)?.focus(),zt.scrollTop=i,o2()}function r2(e){if(e.id)return`#${e.id}`;if(e.name&&e.value)return`input[name="${e.name}"][value="${CSS.escape(e.value)}"]`;for(let t of["data-template","data-jstop","data-jfind","data-copy"])if(e.hasAttribute(t))return`[${t}="${CSS.escape(e.getAttribute(t))}"]`;return e.classList.contains("jgo")?".jgo":null}function jp(e){let n=Ko.find(r=>r.id===Fi).templates[e]?.[1];if(!n)return;let i=zt.querySelector("#jprompt");i.value=n,i.focus();let s=n.indexOf("[");s>=0?i.setSelectionRange(s,n.indexOf("]",s)+1):i.setSelectionRange(n.length,n.length)}function o2(){for(let t of zt.querySelectorAll('input[name="jkind"]'))t.onchange=()=>{let n=Ko.find(r=>r.id===Fi),i=zt.querySelector("#jprompt"),s=i.value.trim()&&!n.templates.some(([,r])=>r===i.value);Fi=t.value,sr(),s||(zt.querySelector("#jprompt").value="",jp(0),Xp||zt.querySelector(`input[name="jkind"][value="${Fi}"]`)?.focus())};for(let t of zt.querySelectorAll('input[name="jroom"]'))t.onchange=()=>{ir=t.value,sr()};for(let t of zt.querySelectorAll("[data-template]"))t.onclick=()=>jp(Number(t.dataset.template));for(let t of zt.querySelectorAll("[data-jclose]"))t.onclick=()=>zt.close();for(let t of zt.querySelectorAll("[data-jstop]"))t.onclick=()=>l2(t.dataset.jstop);for(let t of zt.querySelectorAll("[data-jfind]"))t.onclick=()=>{zt.close(),Wr.pick(t.dataset.jfind)};for(let t of zt.querySelectorAll("[data-copy]"))t.onclick=async()=>{try{await navigator.clipboard.writeText(t.dataset.copy),t.textContent="Copied"}catch{t.textContent="Select and copy it"}};let e=zt.querySelector("#jprompt");e.onkeydown=t=>{t.key==="Enter"&&(t.metaKey||t.ctrlKey)&&(t.preventDefault(),zt.querySelector("form").requestSubmit())},zt.querySelector("form").onsubmit=t=>{t.preventDefault(),a2()}}async function a2(){let e=zt.querySelector("#jprompt").value.trim();if(!e){Gr="Say what the job is first.",sr(),zt.querySelector("#jprompt").focus();return}if(!ir)return;let t=Fx(e);yh=!0,Gr="",sr();let n=!1;try{if(Wr.isDemo())n=h2({dir:ir,prompt:e,title:t,kind:Fi});else{let i=await fetch("/jobs",{method:"POST",headers:{"content-type":"application/json","x-agent-office-token":Kp},body:JSON.stringify({dir:ir,prompt:e,title:t,kind:Fi})}),s=await i.json().catch(()=>({}));n=i.ok,n||(Gr=s.error?`Couldn\u2019t start it: ${s.error}`:"Couldn\u2019t start it.")}}catch{Gr="Couldn\u2019t reach the bridge. Is it still running?"}yh=!1,n?(Gr="",zt.querySelector("#jprompt").value="",zt.close(),gl(`Ding! A new teammate is on the way to \u201C${t}\u201D.`)):sr()}async function l2(e){let t=Ts.get(e);if(t){if(Wr.isDemo()){t.state="stopped",Vx();return}try{let n=await fetch("/jobs/stop",{method:"POST",headers:{"content-type":"application/json","x-agent-office-token":Kp},body:JSON.stringify({id:e})});n.ok||gl(`Couldn\u2019t stop it: ${(await n.json().catch(()=>({}))).error??"the bridge said no"}`,t,!0)}catch{gl("Couldn\u2019t reach the bridge to stop it.",t,!0)}}}var c2=0,u2=Vg();function h2({dir:e,prompt:t,title:n,kind:i}){let s=`demo-job-${++c2}`,r=o=>Wr.ingest({t:Date.now(),job:s,...o});r({kind:"job.start",dir:e,title:n,type:i,prompt:t,demo:!0});let a=Ts.get(s);return u2({id:s,dir:e},t,o=>r({kind:"job.update",...o})),!!a}var Yp;function gl(e,t,n=!1){if(!Yp)return;let i=document.createElement("div");i.className=`jtoast paper ${n?"bad":""}`,i.innerHTML=`<span>${xh("bell")}</span><p>${P(e)}</p>${t?'<button type="button">Open the desk</button>':""}`,i.querySelector("button")?.addEventListener("click",()=>{gh(),i.remove()}),Yp.append(i),setTimeout(()=>i.remove(),n||t?.state==="blocked"?14e3:6e3)}function Vx(){let e=[...Ts.values()].filter(i=>i.state==="blocked").length,t=[...Ts.values()].filter(i=>zx.has(i.state)).length,n=document.getElementById("newjob-count");n&&(n.textContent=e?String(e):t?String(t):"",n.classList.toggle("asking",e>0),n.title=e?`${e} waiting for your OK`:t?`${t} running`:""),sr()}function gh(e){if(!zt)return;e&&(Fi=e),Gr="",zt.open||zt.showModal(),sr(),zt.querySelector("#jprompt").value||jp(0),zt.querySelector(`input[name="jkind"][value="${Fi}"]`)?.focus()}function Gx(e){Wr=e,zt=document.getElementById("desk"),zt.addEventListener("pointerdown",()=>{Xp=!0}),zt.addEventListener("keydown",()=>{Xp=!1}),Yp=document.getElementById("toasts"),document.getElementById("newjob")?.addEventListener("click",()=>gh()),document.addEventListener("office:frontdesk",()=>gh()),"closedBy"in HTMLDialogElement.prototype||zt.addEventListener("click",t=>{if(t.target!==zt)return;let n=zt.getBoundingClientRect();(t.clientX<n.left||t.clientX>n.right||t.clientY<n.top||t.clientY>n.bottom)&&zt.close()}),addEventListener("keydown",t=>{t.key==="n"&&!t.metaKey&&!t.ctrlKey&&!t.altKey&&!/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName)&&!zt.open&&(t.preventDefault(),gh())}),setInterval(()=>{zt.open&&!zt.contains(document.activeElement)&&sr()},15e3)}function f2(e){if(!e?.length)return null;let t=e.length,n=e.filter(s=>s.status==="completed").length,i=e.find(s=>s.status==="in_progress");return{done:n,total:t,frac:n/t,now:i?i.active??i.text:void 0,finished:n===t,words:n===t?t===1?"Done":`All ${t} done`:`${n} of ${t} done`}}function _h(e,{big:t=!1}={}){let n=f2(e);if(!n)return"";let i=Math.round(n.frac*100);return`<span class="prog ${t?"big":""} ${n.finished?"all":""}">
    <span class="prog-bar" role="progressbar" aria-label="Checklist" aria-valuemin="0" aria-valuemax="${n.total}" aria-valuenow="${n.done}" aria-valuetext="${n.words}"><i style="width:${i}%"></i></span>
    <span class="prog-words"><b>${n.words}</b>${t&&n.now&&!n.finished?` \xB7 now: ${P(n.now)}`:""}</span>
  </span>`}var wh={pr:{name:"Pull request",icon:"\u21E1"},artifact:{name:"Doc",icon:"\u25C8"},link:{name:"Link",icon:"\u2197"},plan:{name:"Plan",icon:"\u270E"},image:{name:"Picture",icon:"\u25A3"},file:{name:"File",icon:"\u25A4"}},Mh=e=>["pr","artifact","link","plan"].includes(e.type),vh=e=>`${e.session}|${e.id}`,p2=e=>{try{return new URL(e).host.replace(/^www\./,"")}catch{return""}};function m2(e){return e.url?{href:e.url}:e.type==="image"||e.type==="plan"&&e.text?{zoom:vh(e)}:null}function Sh(e){return e.url?{text:e.url,label:"Copy link"}:e.path?{text:e.path,label:"Copy path"}:e.text?{text:e.text,label:"Copy text"}:null}function Wx(e){let t=new Map;for(let n of e)t.has(n.session)||t.set(n.session,[]),t.get(n.session).push(n);return[...t].map(([n,i])=>({session:n,items:i}))}var g2=4e3;function tm(e,{where:t="",now:n=Date.now(),copied:i=null}={}){let s=wh[e.type]??{name:"Output",icon:"\u2022"},r=m2(e),a=Sh(e),o=[e.url?p2(e.url):e.path,t,Ae(e.t)].filter(Boolean).join(" \xB7 "),c=e.meta?.additions!==void 0?`<span class="diff"><ins>+${e.meta.additions}</ins> <del>\u2212${e.meta.deletions??0}</del></span>`:"",l=i===vh(e),u=r?r.href?`<a class="dv-btn primary" href="${P(r.href)}" target="_blank" rel="noopener">Open<span aria-hidden="true"> \u2197</span></a>`:`<button type="button" class="dv-btn primary" data-zoom="${P(r.zoom)}">Open</button>`:"",h=a?`<button type="button" class="dv-btn ${l?"done":""}" data-copy="${P(vh(e))}" aria-label="${P(`${a.label}: ${e.title}`)}">${l?"Copied \u2713":a.label}</button>`:"";return`
    <article class="dv ${P(e.type)} ${n-e.t<g2?"fresh":""}" data-dv="${P(vh(e))}">
      <p class="dv-kind"><i>${s.icon}</i>${s.name}${e.meta?.state?` \xB7 ${P(e.meta.state)}`:""}${c}</p>
      <h4 class="dv-title">${P(e.title??s.name)}</h4>
      ${o?`<p class="dv-sub">${P(o)}</p>`:""}
      ${u||h?`<p class="dv-acts">${u}${h}</p>`:""}
    </article>`}var bh=null,Eh=(e=Date.now())=>bh&&e<bh.until?bh.key:null;async function em(e){try{return await navigator.clipboard.writeText(e),!0}catch{let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.cssText="position:fixed;opacity:0;pointer-events:none",document.body.append(t),t.select();let n=!1;try{n=document.execCommand("copy")}catch{}return t.remove(),n}}function qx(e,{find:t,redraw:n}){for(let i of e.querySelectorAll("[data-copy]"))i.onclick=async s=>{s.preventDefault(),s.stopPropagation();let r=t(i.dataset.copy),a=r&&Sh(r);!a||!await em(a.text)||(bh={key:i.dataset.copy,until:Date.now()+1600},n(),setTimeout(n,1700))}}var xl=new Map,Rh=new Map,vl=e=>`${e.who?.session??e.session??""}|${e.id}`;function y2(e,t,n,i){let s=e[t]??[],r=i?s.includes(n)?s.filter(a=>a!==n):[...s,n]:[n];return{...e,[t]:r}}function Yx(e,t,n=""){if(n.trim())return!0;let i=e.questions??[];return i.length>0&&i.every((s,r)=>t[r]?.length)}function _l(e,t,n=""){if(e.type==="plan")return{choice:"keep",...n.trim()&&{note:n.trim()}};let i={};return(e.questions??[]).forEach((s,r)=>{t[r]?.length&&(i[s.question]=t[r].join(", "))}),{answers:i,...n.trim()&&{note:n.trim()}}}function im(e,t){return t.choice==="keep"?"Kept planning":[...Object.values(t.answers??{}),...t.note?[t.note]:[]].join(" \xB7 ")}function Kx(e){let t=e.type==="question"&&e.questions?.length===1?e.questions[0]:null;return t&&!t.multiSelect?t.options.map(n=>n.label).slice(0,4):void 0}var Ah=e=>(xl.has(e)||xl.set(e,{picks:{}}),xl.get(e)),Ch=(e,t,n)=>!!xl.get(e)?.picks[t]?.includes(n),Zx=e=>xl.get(e),Ih=e=>{Rh.set(vl(e),e)},Ph={can:()=>!1,send:async()=>({ok:!1})};function Jx(e){Ph=e}var kh=e=>!!(e&&Ph.can(e)),Qx=e=>!!(e&&Ph.canApprove?.(e)),Th=e=>document.querySelector(`[data-ans-note="${CSS.escape(e)}"]`)?.value??"";async function Zo(e,t){let n=Rh.get(e),i=Ah(e);if(!n||i.status==="Sending\u2026")return;i.status="Sending\u2026",i.ok=void 0,nm();let s=await Ph.send(n,t).catch(r=>({ok:!1,status:String(r.message??r)}));i.ok=s.ok,i.status=s.ok?`Sent: ${im(n,t)}. Claude carries on.`:`Not sent: ${s.status??"the bridge said no"}. You can still answer in Claude Code.`,nm()}var nm=()=>document.dispatchEvent(new CustomEvent("office:answered"));function x2(e){let t=e.target.closest?.("[data-ans]");if(!t)return;e.preventDefault(),e.stopPropagation();let n=t.dataset.key,i=Rh.get(n);if(!i)return;let s=Ah(n);switch(t.dataset.ans){case"pick":{let r=Number(t.dataset.q??0),a=i.questions?.[r];s.picks=y2(s.picks,r,t.dataset.label,!!a?.multiSelect),i.questions?.length===1&&!a?.multiSelect?Zo(n,_l(i,s.picks,Th(n))):nm();break}case"send":Yx(i,s.picks,Th(n))&&Zo(n,_l(i,s.picks,Th(n)));break;case"keep":Zo(n,_l(i,{},Th(n)));break;case"say":Zo(n,{say:t.dataset.label});break}}function _2(e){let t=e.target.closest?.("[data-ans-note]");if(!t||e.key!=="Enter"||e.isComposing)return;e.preventDefault();let n=t.dataset.ansNote,i=Rh.get(n);i&&(i.type==="plan"?Zo(n,_l(i,{},t.value)):Yx(i,Ah(n).picks,t.value)&&Zo(n,_l(i,Ah(n).picks,t.value)))}var jx=!1;function t_(){jx||(jx=!0,document.addEventListener("click",x2,!0),document.addEventListener("keydown",_2))}var e_=(e,t)=>`${e} ${t}${e===1?"":"s"}`,wl=e=>e.src??(e.path?`/asset?${new URLSearchParams({session:e.session,id:e.id})}`:""),v2={question:"Asks you",permission:"Wants to run",plan:"Plan to approve"};function rm(e,{answerable:t,compact:n=!1}={}){let i=e.who?.kind==="agent"?`<span class="ask-who">${P(e.who.label)}</span>`:"",s=vl(e);t&&Ih(e);let r=t?Zx(s):void 0,a=r?.status==="Sending\u2026"||r?.ok===!0,o=(m,y,g=0)=>`data-ans="${m}" data-key="${P(s)}" data-q="${g}" data-label="${P(y)}"${a?" disabled":""}`,c=(m,y,g,d)=>{if(!t)return`<span class="ask-opt ${g}"><b>${P(m)}</b>${y?`<span>${P(y)}</span>`:""}</span>`;let _=Ch(s,d,m);return`<button type="button" class="ask-opt ${g} ${_?"picked":""}" aria-pressed="${_}" ${o("pick",m,d)}><b>${P(m)}</b>${y?`<span>${P(y)}</span>`:""}</button>`},l=(m,y="")=>t?`<button type="button" class="ask-opt ${y}" ${o("say",m)}><b>${P(m)}</b></button>`:`<span class="ask-opt ${y}"><b>${P(m)}</b></span>`,u=m=>`<input class="ask-note" type="text" data-ans-note="${P(s)}" placeholder="${P(m)}" aria-label="${P(m)}" maxlength="2000"${a?" disabled":""}>`,h="",f="";if(e.type==="question"){let m=e.questions??[];h=m.map((g,d)=>{let _=g.options.some(w=>w.preview);return`
      <div class="ask-q">
        <p class="ask-text"><span class="chip">${P(g.header)}</span>${P(g.question)}${g.multiSelect?'<small class="ask-multi">pick any</small>':""}</p>
        <div class="ask-opts ${_&&!n?"previews":""}">${g.options.map((w,b)=>_&&!n?t?`<button type="button" class="ask-opt pic ${b===0?"rec":""} ${Ch(s,d,w.label)?"picked":""}" aria-pressed="${Ch(s,d,w.label)}" ${o("pick",w.label,d)}><img alt="" src="${P(w.preview??"")}"><b>${P(w.label)}</b></button>`:`<span class="ask-opt pic ${b===0?"rec":""}"><img alt="" src="${P(w.preview??"")}"><b>${P(w.label)}</b></span>`:c(w.label,n?"":w.description,b===0?"rec":"",d)).join("")}</div>
      </div>`}).join("");let y=m.length>1||m.some(g=>g.multiSelect);t&&(f=`<div class="ask-own">${u(y?"Or your own words\u2026":"Or type your own answer\u2026")}${y?`<button type="button" class="ask-send" ${o("send","")}>Send</button>`:""}</div>`)}else e.type==="permission"?h=`<p class="ask-text"><code>${P(br(e.tool))}</code> ${P(e.summary??"")}</p>
      <div class="ask-opts row">${l("Allow","rec")}${l("Deny","no")}</div>`:e.type==="plan"&&(h=`<div class="ask-plan">${(e.plan??"").split(`
`).filter(y=>y.trim()).slice(0,n?3:8).map(y=>/^#/.test(y)?`<b>${P(y.replace(/^#+\s*/,""))}</b>`:`<span>${P(y)}</span>`).join("")}</div>`,t?Qx(e)?h+=`<div class="ask-opts row">${l("Approve","rec")}<button type="button" class="ask-opt no" ${o("keep","")}><b>Keep planning</b></button></div>${u("What should change? (optional)")}`:(h+=`<div class="ask-own">${u("What should change? (optional)")}<button type="button" class="ask-send" ${o("keep","")}>Keep planning</button></div>`,f='<p class="ask-where">To approve, use Claude Code: approving lets Claude start changing things, and only Claude Code can switch that on.</p>'):h+=`<div class="ask-opts row">${l("Approve","rec")}${l("Keep planning","no")}</div>`);let p=r?.status?`<p class="ask-status ${r.ok===!1?"bad":""}" role="status">${P(r.status)}</p>`:"";return`
    <div class="ask ${e.type} ${t?"live":""}">
      <p class="ask-eyebrow"><i class="ask-icon">${e.type==="permission"?">_":e.type==="plan"?"\u270E":"?"}</i>${v2[e.type]??"Asks you"}${i}<time>${Ae(e.t)}</time></p>
      ${h}
      ${f}
      ${p}
      ${t?e.type==="question"&&!r?'<p class="ask-where">Answer here or in Claude Code, whichever is handier.</p>':"":'<p class="ask-where">Answer it in Claude Code; the office shows it so you know it\u2019s waiting.</p>'}
    </div>`}function Ml(e){return so(e)}var b2={completed:"\u2713",in_progress:"\u2731",pending:"\u25CB"};function om(e,{open:t=!0}={}){let n=e.todos;if(!n?.length)return"";let i=n.filter(s=>s.status==="completed").length;return`
    <details class="todo" ${t?"open":""} data-todo="${P(e.id)}">
      <summary>
        <span class="todo-ring" style="--f:${(i/n.length).toFixed(3)}"></span>
        <b>Checklist</b><span class="todo-count">${n.length} steps</span>
      </summary>
      <ol>${n.map(s=>`<li class="${s.status}"><i>${b2[s.status]??"\u25CB"}</i>${P(s.text)}</li>`).join("")}</ol>
    </details>`}var am=e=>_h(e.todos),w2={image:["Image","\u25A3"],artifact:["Artifact","\u25C8"],pr:["Pull request","\u21E1"],link:["Link","\u2197"],file:["File","\u25A4"],plan:["Plan","\u270E"]},M2=e=>{try{return new URL(e).host.replace(/^www\./,"")}catch{return""}};function As(e,{withThread:t=!1}={}){let[n,i]=w2[e.type]??["Output","\u2022"],r=[(t?F.get(Ct(e.session)):null)?.label,e.agent?F.get(`a:${e.session}:${e.agent}`)?.label:""].filter(Boolean).join(" \xB7 "),a=`draggable="true" data-handoff="output|${P(e.session)}|${P(e.id)}"`;if(e.type==="image")return`<button type="button" class="out pic" ${a} data-zoom="${P(e.session)}|${P(e.id)}" title="${P(e.title)}">
      <img alt="${P(e.title)}" src="${P(wl(e))}" loading="lazy">
      <span>${P(e.title)}</span>${r?`<small>${P(r)}</small>`:""}</button>`;let o=e.meta?.additions!==void 0?`<span class="diff"><ins>+${e.meta.additions}</ins> <del>\u2212${e.meta.deletions??0}</del></span>`:"",c=[e.type==="file"?e.path:e.url?M2(e.url):"",r].filter(Boolean).join(" \xB7 "),l=e.url?"a":e.type==="plan"?"button":"div",u=e.url?`href="${P(e.url)}" target="_blank" rel="noopener"`:e.type==="plan"?`type="button" data-zoom="${P(e.session)}|${P(e.id)}"`:"";return`<${l} class="out ${e.type}" ${u} ${a}${l==="div"?' tabindex="0"':""} title="${P(e.title)}. Drag it onto a critter (or press H) to hand it over">
    <i class="out-icon">${i}</i>
    <span class="out-main"><b>${P(e.title)}</b><small>${P(n)}${e.meta?.state?` \xB7 ${P(e.meta.state)}`:""}${c?` \xB7 ${P(c)}`:""}</small></span>
    ${o||`<time>${Ae(e.t)}</time>`}
  </${l}>`}function n_(e){let t=e.kind==="session"?e:F.get(Ct(e.session)),n=ee.filter(l=>l.session===t?.session&&(e.kind==="session"||l.agent===e.agent));if(!n.length&&!e.todos?.length)return'<p class="muted">Nothing made yet. Pictures, artifacts, pull requests and changed files land here as they happen.</p>';let i=n.filter(l=>l.type==="image"),s=n.filter(Mh),r=l=>l.agent?F.get(`a:${l.session}:${l.agent}`)?.label??"a helper":"",a=n.filter(l=>l.type==="file"),o=a.reduce((l,u)=>l+(u.meta?.additions??0),0),c=a.reduce((l,u)=>l+(u.meta?.deletions??0),0);return`
    ${om(e,{open:!0})}
    ${s.length?`<h3>Delivered <small>${s.length}</small></h3><div class="dvs">${s.map(l=>tm(l,{where:r(l),copied:Eh()})).join("")}</div>`:""}
    ${i.length?`<h3>Pictures <small>${i.length}</small></h3><div class="gallery">${i.slice(0,9).map(l=>As(l)).join("")}</div>`:""}
    ${a.length?`<h3>Files changed <small><ins>+${o}</ins> <del>\u2212${c}</del></small></h3><div class="outs files">${a.slice(0,8).map(l=>As(l)).join("")}</div>`:""}`}var i_=e=>ee.filter(t=>t.session===e.session&&(e.kind==="session"||t.agent===e.agent)&&t.type!=="file").length,bl="all",S2=[["all","All"],["image","Pictures"],["shipped","Artifacts & PRs"],["file","Files"],["plan","Plans"]],E2=e=>bl==="all"?e.type!=="file":bl==="shipped"?["artifact","pr","link"].includes(e.type):e.type===bl;function s_(){let e=ee.filter(E2),t=Wx(e).map(({session:n,items:i})=>{let s=F.get(Ct(n)),r=i.filter(c=>c.type==="image"),a=i.filter(Mh),o=i.filter(c=>c.type!=="image"&&!Mh(c));return`<section class="lib-group folder">
      <p class="lib-thread"><span>${P(s?.project?fn(s.project,s.projectName):s?.projectName??"")}</span><button type="button" data-pick="${P(Ct(n))}">${P(s?.label??n)}</button><small>${e_(i.length,"thing")}</small></p>
      ${a.length?`<div class="dvs">${a.slice(0,8).map(c=>tm(c,{where:c.agent?F.get(`a:${c.session}:${c.agent}`)?.label:"",copied:Eh()})).join("")}</div>`:""}
      ${r.length?`<div class="gallery">${r.slice(0,6).map(c=>As(c)).join("")}</div>`:""}
      ${o.length?`<div class="outs files">${o.slice(0,8).map(c=>As(c)).join("")}</div>`:""}
    </section>`}).join("");return`
    <header class="lib-head">
      <h2>Library <small>${e_(ee.filter(n=>n.type!=="file").length,"output")}</small></h2>
      <button type="button" class="lib-close" data-library="close" aria-label="Close the library">\xD7</button>
    </header>
    <div class="feeds lib-shelves" role="group" aria-label="Show">${S2.map(([n,i])=>`<button type="button" data-shelf="${n}" class="${bl===n?"on":""}">${i}</button>`).join("")}</div>
    <div class="lib-body">${t||'<p class="muted">Nothing on this shelf yet.</p>'}</div>`}function r_(e){bl=e}function o_(e){let[t,n]=e.split("|"),i=ee.find(c=>c.session===t&&c.id===n);if(!i)return"";let s=F.get(Ct(t)),r=i.type==="plan"?`<article class="lb-plan">${(i.text??"").split(`
`).map(c=>/^#/.test(c)?`<h3>${P(c.replace(/^#+\s*/,""))}</h3>`:c.trim()?`<p>${P(c)}</p>`:"").join("")}</article>`:`<img alt="${P(i.title)}" src="${P(wl(i))}">`,a=Sh(i),o=Eh()===`${i.session}|${i.id}`;return`<figure class="lb-frame paper">${r}<figcaption><b>${P(i.title)}</b><span>${P([s?.label,i.path,Ae(i.t)].filter(Boolean).join(" \xB7 "))}</span>${a?`<button type="button" class="dv-btn ${o?"done":""}" data-copy="${P(`${i.session}|${i.id}`)}">${o?"Copied \u2713":a.label}</button>`:""}</figcaption></figure>`}var a_="agent-office:reduce-motion",cm=typeof matchMedia=="function"?matchMedia("(prefers-reduced-motion: reduce)"):{matches:!1,addEventListener(){}};function A2(){try{return localStorage.getItem(a_)==="1"}catch{return!1}}var lm=A2(),R2=({system:e,chosen:t})=>!!(e||t),vi=()=>R2({system:cm.matches,chosen:lm}),um=()=>cm.matches;function hm(){typeof document>"u"||(vi()?document.documentElement.dataset.motion="reduce":delete document.documentElement.dataset.motion)}function l_(e){lm=!!e;try{localStorage.setItem(a_,lm?"1":"0")}catch{}hm()}cm.addEventListener?.("change",hm);hm();var Lh={ask:0,you:1,relay:2,mail:3,made:4,answer:5,think:6},I2={answer:6,mail:4,relay:5,you:4,made:5},P2=9,k2=30,c_=90,L2=1.1,Jo=(e,t)=>{let n=(e??"").replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1).trimEnd()}\u2026`:n};function D2(e){let t=e.getBoundingClientRect(),n=document.querySelector(".hud.left")?.getBoundingClientRect(),i=document.querySelector("#side")?.getBoundingClientRect();return{l:n?.width?n.right-t.left:0,r:i?.width?i.left-t.left:t.width}}function u_({stage:e,headAt:t,onPick:n}){let i=document.createElement("div");i.className="bubbles",e.append(i);let s=new Map,r=new Map,a=[];function o(p,m,y){let g=r.get(p);return g||(g=document.createElement("div"),g.className=`bub ${m==="think"?"thought":"speech"} ${m}`,g.addEventListener("click",()=>n(g.dataset.pick||y)),i.append(g),r.set(p,g),requestAnimationFrame(()=>g.classList.add("on")),g)}function c(p,m,y,g){s.has(p)||s.set(p,{}),s.get(p)[m]={...y,kind:m,at:g,until:y.ttl===null?1/0:g+(y.ttl??I2[m]??4)}}function l(p,m,y,g){let d=s.get(p)?.[m];if(!y){d&&delete s.get(p)[m];return}d&&d.key===y.key||c(p,m,{...y,ttl:null},d?.at??g)}function u(p,m,y,g){if(vi())return;let d=document.createElement("div");d.className="bub-fly",d.style.setProperty("--tint",`var(--${y})`),d.innerHTML="<i></i>",i.append(d),a.push({el:d,from:p,to:m,at:g})}function h(p,m){let y=m?c_:k2;switch(p.kind){case"ask":{let g=`<i class="badge ${p.type}">${p.type==="permission"?"&gt;_":p.type==="plan"?"\u270E":"?"}</i><span>${P(m&&p.long?Jo(p.long,c_):p.text)}</span>`;return!m||!p.options?g:`${g}<div class="bub-opts" role="group" aria-label="Answer">${p.options.map(d=>`<button type="button" data-ans="pick" data-key="${P(p.answerKey)}" data-q="0" data-label="${P(d)}">${P(Jo(d,24))}</button>`).join("")}</div>`}case"made":return`${p.src?`<img alt="" src="${P(p.src)}">`:`<i class="badge ${p.type}">${p.icon??"\u2022"}</i>`}<span>${P(Jo(p.text,y))}</span>`;case"mail":case"relay":case"you":return`<b>${P(p.who)}</b><span>${P(Jo(p.text,y))}</span>`;case"think":return`<span>${P(Jo(p.text,m?60:26))}</span>`;default:return`<span>${P(Jo(p.text,y))}</span>`}}function f(p,{selected:m}){let y=[];for(let[w,b]of s){for(let[T,I]of Object.entries(b))p>I.until&&delete b[T];let A=Object.values(b).sort((T,I)=>Lh[T.kind]-Lh[I.kind]||I.at-T.at)[0];if(!A){s.delete(w);continue}let S=t(w);S&&y.push({critter:w,b:A,head:S,mine:m&&(w===m||A.thread===m)})}y.sort((w,b)=>Number(b.mine)-Number(w.mine)||Lh[w.b.kind]-Lh[b.b.kind]||b.b.at-w.b.at);let g=[],d=new Set,_=D2(e);y.forEach(({critter:w,b,head:A,mine:S},T)=>{let I=`${w}|${b.kind}`;d.add(I);let x=o(I,b.kind,w);x.dataset.pick=b.thread??"";let v=h(b,S);x.dataset.html!==v&&(x.innerHTML=v,x.dataset.html=v);let R=`${v}|${!!S}`;x._shape!==R&&(x._shape=R,x._measureUntil=p+.3),x.classList.toggle("mine",!!S);let D=A.x<_.l-10||A.x>_.r+10;if(x.classList.toggle("far",T>=P2&&!S||D&&b.kind!=="ask"),x._w===void 0||p<x._measureUntil){let Z=x.classList.contains("dot");Z&&x.classList.remove("dot"),x._w=x.offsetWidth,x._h=x.offsetHeight,Z&&x.classList.add("dot")}let B=x._w,V=Math.min(Math.max(A.x,_.l+B/2+8),_.r-B/2-8);x.style.setProperty("--tx",`${Math.max(-B/2+14,Math.min(B/2-14,A.x-V))}px`),x.style.left=`${V}px`,x.style.top=`${A.y}px`;let X={left:V-B/2,right:V+B/2,top:A.y-x._h,bottom:A.y},z=g.some(Z=>X.left<Z.right&&X.right>Z.left&&X.top<Z.bottom&&X.bottom>Z.top);x.classList.toggle("dot",z&&b.kind!=="ask"&&(!S||b.kind==="think")),!x.classList.contains("dot")&&!x.classList.contains("far")&&g.push(X),x.style.zIndex=String(100-T)});for(let[w,b]of r)d.has(w)||(r.delete(w),b.classList.remove("on"),b.classList.add("gone"),setTimeout(()=>b.remove(),300));for(let w=a.length-1;w>=0;w--){let b=a[w],A=(p-b.at)/L2,S=t(b.from),T=t(b.to);if(A>=1||!S||!T){b.el.remove(),a.splice(w,1);continue}let I=A<.5?2*A*A:1-Math.pow(-2*A+2,2)/2,x=Math.sin(Math.PI*I)*Math.min(90,30+Math.hypot(T.x-S.x,T.y-S.y)*.35);b.el.style.left=`${S.x+(T.x-S.x)*I}px`,b.el.style.top=`${S.y+(T.y-S.y)*I-x}px`,b.el.style.opacity=String(Math.min(1,(1-A)*4))}}return{say:c,hold:l,fly:u,tick:f,layer:i}}var d_="agent-office-muted",hn=null,qr=null,Qo=!1;try{Qo=localStorage.getItem(d_)==="1"}catch{}var h_=new Map,Nh=()=>Qo;function f_(e){Qo=e;try{localStorage.setItem(d_,e?"1":"0")}catch{}qr&&(qr.gain.value=Qo?0:.5)}function p_(){if(hn){hn.state==="suspended"&&hn.resume();return}let e=window.AudioContext||window.webkitAudioContext;e&&(hn=new e,qr=hn.createGain(),qr.gain.value=Qo?0:.5,qr.connect(hn.destination))}function rr(e,t){if(!hn||Qo||document.hidden)return!1;let n=hn.currentTime;return n-(h_.get(e)??-1)<t?!1:(h_.set(e,n),!0)}function Bi({freq:e,to:t,type:n="sine",dur:i=.15,gain:s=.1,at:r=0,attack:a=.005}){let o=hn.currentTime+r,c=hn.createOscillator(),l=hn.createGain();c.type=n,c.frequency.setValueAtTime(e,o),t&&c.frequency.exponentialRampToValueAtTime(t,o+i),l.gain.setValueAtTime(0,o),l.gain.linearRampToValueAtTime(s,o+a),l.gain.exponentialRampToValueAtTime(1e-4,o+i),c.connect(l).connect(qr),c.start(o),c.stop(o+i+.05)}var Dh=null;function dm({dur:e=.03,gain:t=.05,freq:n=3e3,q:i=1.5,type:s="bandpass",to:r,at:a=0}){if(!Dh){Dh=hn.createBuffer(1,hn.sampleRate*.5,hn.sampleRate);let h=Dh.getChannelData(0);for(let f=0;f<h.length;f++)h[f]=Math.random()*2-1}let o=hn.currentTime+a,c=hn.createBufferSource();c.buffer=Dh;let l=hn.createBiquadFilter();l.type=s,l.frequency.setValueAtTime(n,o),r&&l.frequency.exponentialRampToValueAtTime(r,o+e),l.Q.value=i;let u=hn.createGain();u.gain.setValueAtTime(t,o),u.gain.exponentialRampToValueAtTime(1e-4,o+e),c.connect(l).connect(u).connect(qr),c.start(o,Math.random()*.4),c.stop(o+e+.02)}var Hi={keys(){rr("keys",.09)&&(dm({dur:.025,gain:.05,freq:2600+Math.random()*1400,q:2}),dm({dur:.02,gain:.03,freq:3200+Math.random()*1200,q:2,at:.06+Math.random()*.04}))},chime(){rr("chime",.4)&&(Bi({freq:1046.5,dur:.7,gain:.05}),Bi({freq:1318.5,dur:.9,gain:.045,at:.09}))},bonk(){rr("bonk",.3)&&Bi({freq:240,to:150,type:"triangle",dur:.22,gain:.08})},pop(){rr("pop",.15)&&Bi({freq:520,to:980,dur:.09,gain:.06})},hello(){rr("hello",.5)&&(Bi({freq:880,to:1046,type:"triangle",dur:.08,gain:.04}),Bi({freq:1175,to:1397,type:"triangle",dur:.1,gain:.035,at:.1}))},clink(){rr("clink",.3)&&(Bi({freq:2637,dur:.18,gain:.025}),Bi({freq:3520,dur:.14,gain:.018,at:.02}))},bell(){rr("bell",1.5)&&(Bi({freq:1568,dur:1.4,gain:.05,attack:.002}),Bi({freq:3951,dur:.6,gain:.018,attack:.002}),Bi({freq:1568,dur:1.2,gain:.03,at:.22,attack:.002}))},hush(){rr("hush",1)&&dm({dur:.6,gain:.05,freq:400,to:3e3,q:.7})}};var m_="agent-office-milestones";var fm=[{id:"first-output",title:"First thing made",key:"outputs",goal:1,adds:"A trophy for the shelf."},{id:"first-picture",title:"First picture",key:"pictures",goal:1,adds:"A poster went up.",decor:"poster"},{id:"first-pr",title:"First pull request",key:"prs",goal:1,adds:"A neon sign lit up.",decor:"neon"},{id:"turns-10",title:"10 requests",key:"turns",goal:10,adds:"The plant grew.",decor:"plant"},{id:"tools-100",title:"100 tool calls",key:"tools",goal:100,adds:"Another trophy."},{id:"first-team",title:"First agent team",key:"team",goal:2,adds:"Another trophy.",note:"two or more agents on one thread"},{id:"threads-5",title:"5 threads",key:"threads",goal:5,adds:"Another trophy."},{id:"tools-1000",title:"1,000 tool calls",key:"tools",goal:1e3,adds:"The plant grew again.",decor:"plant"}],Uh=["turns","tools","outputs","pictures","prs","team"],g_=new Set(["team"]),N2=()=>({v:1,projects:{}});function y_(e,t){return e.projects[t]??={threads:{},folded:{count:0},unlocked:{}}}function x_(e,t,n,i){let s=y_(e,t),r=s.threads[n],a=r??{},o=!r;for(let c of Uh){let l=Math.max(a[c]??0,i[c]??0);l!==(a[c]??0)&&(o=!0),a[c]=l}return r||(s.threads[n]=a,U2(s)),o}function U2(e){let t=Object.keys(e.threads);for(let n of t.slice(0,Math.max(0,t.length-300))){let i=e.threads[n];for(let s of Uh)e.folded[s]=g_.has(s)?Math.max(e.folded[s]??0,i[s]):(e.folded[s]??0)+i[s];e.folded.count++,delete e.threads[n]}}function __(e,t){let n=e.projects[t],i={threads:0};for(let s of Uh)i[s]=n?.folded[s]??0;if(!n)return i;i.threads=n.folded.count+Object.keys(n.threads).length;for(let s of Object.values(n.threads))for(let r of Uh)i[r]=g_.has(r)?Math.max(i[r],s[r]):i[r]+s[r];return i}function v_(e,t,n=Date.now()){let i=y_(e,t),s=__(e,t),r=[];for(let a of fm)i.unlocked[a.id]||s[a.key]<a.goal||(i.unlocked[a.id]=n,r.push(a));return r}function b_(e,t){let n=e.projects[t],i=__(e,t);return fm.map(s=>({...s,at:n?.unlocked[s.id],have:Math.min(i[s.key],s.goal)}))}function w_(e,t){let n=fm.filter(i=>e.projects[t]?.unlocked[i.id]);return{trophies:n.length,poster:n.some(i=>i.decor==="poster"),neon:n.some(i=>i.decor==="neon"),plant:n.filter(i=>i.decor==="plant").length}}function O2(e=globalThis.localStorage){try{let t=JSON.parse(e.getItem(m_));if(t?.v===1&&t.projects)return t}catch{}return N2()}var F2=null,Oh=()=>F2??=O2();function M_(e,t=globalThis.localStorage){try{t.setItem(m_,JSON.stringify(e))}catch{}}var Rs=null;function B2(){return Rs||(Rs=document.createElement("div"),Rs.className="toasts",Rs.setAttribute("role","status"),Rs.setAttribute("aria-live","polite"),document.querySelector(".stage-wrap")?.append(Rs)??document.body.append(Rs),Rs)}function E_({icon:e="\u2605",title:t,text:n="",onClick:i}){let s=document.createElement(i?"button":"div");s.className="toast paper",i&&(s.type="button");let r=document.createElement("i");r.textContent=e,r.setAttribute("aria-hidden","true");let a=document.createElement("span"),o=document.createElement("b");o.textContent=t,a.append(o),n&&a.append(` ${n}`),s.append(r,a);let c=B2();for(c.append(s);c.children.length>3;)c.firstChild.remove();requestAnimationFrame(()=>s.classList.add("on"));let l=()=>{s.classList.remove("on"),setTimeout(()=>s.remove(),300)};return i&&s.addEventListener("click",()=>{i(),l()}),setTimeout(l,6e3),s}var H2=(e=new Date)=>`My Agent Office \xB7 ${e.toLocaleDateString(void 0,{month:"long",day:"numeric",year:"numeric"})}`,Fh=e=>String(e).padStart(2,"0"),z2=(e=new Date)=>`agent-office-${e.getFullYear()}-${Fh(e.getMonth()+1)}-${Fh(e.getDate())}-${Fh(e.getHours())}${Fh(e.getMinutes())}.png`;function T_(e,t,n,i){let s=Math.round(n.left*i),r=Math.round(e-n.right*i),a=Math.round(n.top*i),o=Math.round(t-n.bottom*i);return r-s<e*.45||o-a<t*.45?{x:0,y:0,w:e,h:t}:{x:s,y:a,w:r-s,h:o-a}}function pm(e,t,n,i,s,r){e.beginPath(),e.moveTo(t+r,n),e.arcTo(t+i,n,t+i,n+s,r),e.arcTo(t+i,n+s,t,n+s,r),e.arcTo(t,n+s,t,n,r),e.arcTo(t,n,t+i,n,r),e.closePath()}function A_({shot:e,tags:t,colors:n,ratio:i,date:s=new Date,detail:r=""}){let a=i,o=Math.round(28*a),c=Math.round(64*a),l=document.createElement("canvas");l.width=e.width+o*2,l.height=e.height+o+c;let u=l.getContext("2d");u.fillStyle=n.paper,u.fillRect(0,0,l.width,l.height),u.save(),u.shadowColor="rgba(40, 30, 20, 0.18)",u.shadowBlur=18*a,u.shadowOffsetY=4*a,pm(u,o,o,e.width,e.height,14*a),u.fillStyle=n.scene,u.fill(),u.restore(),u.save(),pm(u,o,o,e.width,e.height,14*a),u.clip(),u.drawImage(e,o,o),u.textAlign="center",u.textBaseline="middle";for(let p of t){let m=p.kind==="room";u.font=m?`600 ${12*a}px Georgia, serif`:`500 ${10.5*a}px system-ui, sans-serif`;let y=u.measureText(p.text).width+(m?16:12)*a,g=(m?20:17)*a,d=o+p.x,_=o+p.y;u.globalAlpha=.86,u.fillStyle=n.paper,pm(u,d-y/2,_-g/2,y,g,m?6*a:g/2),u.fill(),u.globalAlpha=1,u.fillStyle=n.ink,u.fillText(p.text,d,_+.5*a)}u.restore();let h=e.height+o+c/2,f=o+12*a;return u.fillStyle=n.accent,u.beginPath(),u.arc(f,h,5*a,0,Math.PI*2),u.fill(),u.strokeStyle=n.line,u.lineWidth=1.8*a,u.beginPath(),u.arc(f,h,10*a,0,Math.PI*2),u.stroke(),u.fillStyle=n.ink,u.beginPath(),u.arc(f+8.3*a,h-5.3*a,2.3*a,0,Math.PI*2),u.fill(),u.textAlign="left",u.textBaseline="middle",u.font=`600 ${17*a}px Georgia, serif`,u.fillText(H2(s),f+22*a,h),r&&(u.textAlign="right",u.fillStyle=n.muted,u.font=`500 ${12*a}px system-ui, sans-serif`,u.fillText(r,l.width-o,h)),l}function R_(e,t=z2()){return new Promise(n=>{e.toBlob(i=>{if(!i)return n(!1);let s=URL.createObjectURL(i),r=document.createElement("a");r.href=s,r.download=t,document.body.append(r),r.click(),r.remove(),setTimeout(()=>URL.revokeObjectURL(s),1e3),n(!0)},"image/png")})}var C_="agent-office:low-power",V2={fps:0,pixelRatio:2,shadowSize:2048,shadowEvery:3},G2={fps:30,pixelRatio:1,shadowSize:1024,shadowEvery:6},Sl=!1;try{Sl=localStorage.getItem(C_)==="1"}catch{}var or=()=>Sl?G2:V2,I_=()=>Sl,P_=new Set,k_=e=>P_.add(e);function L_(e){Sl=!!e;try{localStorage.setItem(C_,Sl?"1":"0")}catch{}for(let t of P_)t(or())}function D_(e,t,n){return n?e-t>=1e3/n-4:!0}var Tm=160,Z_=44,J_=76,q2=52,X2=80,Il=70,Q_=-34,ea=96,bm=185,j2=e=>e<=2?Math.max(1,e):e<=4?2:3,na=.78,ia=18,jh=9,N_=3,Y2=4,tv=2500,K2=12e4,Z2=120,J2=10,Q2=1.2,tC=38,U_=21,ev=1.25,nv=.2,iv=2.1,sv=.08,eC=1e-5,mm=[[0,-62],[-32,-62],[32,-62],[-64,-62],[64,-62],[-16,-90],[16,-90],[-48,-90],[48,-90],[-76,-4],[76,-4],[-76,20],[76,20]],nC=e=>{let[t,n]=mm[e%mm.length],i=Math.floor(e/mm.length);return[t+i*10,n+i*6]},rv=new Gt("#1c1a17"),Ps=["coral","teal","mustard","lilac","sky","leaf","pink"],iC={Explore:"sky",Plan:"lilac","general-purpose":"leaf","code-reviewer":"pink","test-runner":"mustard"},wm=["a","b","c","d","e","f"],Ls=e=>`${Math.round(e*100)}%`,ks=e=>e>=.85?"crit":e>=.6?"warn":"ok",Ll=e=>{let t=0;for(let n of String(e??""))t=t*31+n.charCodeAt(0)>>>0;return t},lr=e=>iC[e]??Ps[Ll(e)%Ps.length],Ds=e=>Ps[Ll(e)%Ps.length],Yh=e=>wm[Ll(e)%wm.length],yl=Yh,Re,le,Pl,ie,Kt,ae,gn,Mm,Rl,yn,ni,It={},Ge=new Map,We=new Map,Ce=new Map,zh=[],$h=[],Vh=[],zi=null,Is=null,Vi=null,rs=null,Kh="",kl=()=>{},Dl=0,Gi={left:0,right:0,top:0,bottom:0},$i=null,Cs=null,El=0,Sm=0,Bh=0,xn=new L,O_=new L,He=()=>performance.now()/1e3,Gh=typeof matchMedia=="function"?matchMedia("(prefers-reduced-motion: reduce)"):{matches:!1},ar={};function gm(e,t,n,i){return ar.asleep=t,ar.perkAt=e.perkAt,ar.sulkAt=e.sulkAt,ar.cheerAt=e.cheerAt,ar.thinking=n,ar.idleFor=i,ar.seed=e.char.seed,fx(He(),ar,e.mood??={kind:null,k:0})}function Am(e,{pick:t}){Re=e,kl=t,le=new rh({antialias:!0}),le.setPixelRatio(Math.min(or().pixelRatio,devicePixelRatio)),le.shadowMap.enabled=!0,le.shadowMap.type=lu,le.shadowMap.autoUpdate=!1,le.outputColorSpace=Ve,Re.append(le.domElement),Pl=new uh,Pl.domElement.className="labels",Re.append(Pl.domElement),yn=document.createElement("div"),yn.className="bubble",yn.hidden=!0,Re.append(yn),ni=u_({stage:Re,headAt:_C,onPick:i=>kl(i)}),ie=new kr;let n=new Go(le);ie.environment=n.fromScene(new ch,.04).texture,ie.environmentIntensity=nv,n.dispose(),Kt=new pn(32,1,1,6e3),ae=new lh(Kt,le.domElement),ae.enableDamping=!0,ae.dampingFactor=sv,ae.enableRotate=!1,ae.screenSpacePanning=!1,ae.mouseButtons={LEFT:mi.PAN,MIDDLE:mi.PAN,RIGHT:mi.PAN},ae.touches={ONE:Pi.PAN,TWO:Pi.PAN},ae.minDistance=120,ae.maxDistance=4e3,ae.enableZoom=!1,ae.addEventListener("start",()=>{$i=null}),le.domElement.addEventListener("wheel",$C,{passive:!1}),Mm=new Za("#ffffff","#d8cfc2",ev),ie.add(Mm),gn=new tl("#fffaf2",iv),gn.position.set(-90,220,120),gn.castShadow=!0,gn.shadow.mapSize.set(or().shadowSize,or().shadowSize),gn.shadow.radius=6,gn.shadow.bias=-5e-4,gn.shadow.normalBias=.6,ie.add(gn,gn.target),Rl=new q(new Tn(8e3,8e3),new cn),Rl.rotation.x=-Math.PI/2,Rl.position.y=-.2,ie.add(Rl),ym(),matchMedia("(prefers-color-scheme: dark)").addEventListener("change",ym),new MutationObserver(ym).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),ZC(),new ResizeObserver(H_).observe(Re),H_(),Dl=Sm=He()}function ym(){let e=getComputedStyle(document.documentElement),t=["floor","line","ok","warn","crit","clay","thread","scene","wood","wood-dark","trim","pot","glow","window","gem","desk","tile","counter","fridge","carpet","outer-wall","night","dawn","dusk",...Ps,...wm.map(n=>`room-${n}`)];for(let n of t)It[n]=new Gt(e.getPropertyValue(`--${n}`).trim()||"#888");ie.background=It.scene,Rl.material.color.copy(It.scene);for(let n of Ge.values())n.mesh&&ie.remove(n.mesh),n.w=null;ge&&(ie.remove(ge.group),ge=null),qn&&(ie.remove(qn.group),qn=null),Kh="";for(let n of We.values())n.track.material.color.copy(It.line),n.char.bulb.material.color.copy(It.gem),n.char.bulb.material.emissive.copy(It.gem),n.rug.material.color.copy(av(n.tint,n.room)),lv(n),n.gaugeKey="";for(let n of Ce.values())n.char.accentMat.color.copy(ov(n.tint));Zh=-1}var ov=e=>It[e].clone().multiplyScalar(.62),av=(e,t)=>It[e].clone().lerp(It[`room-${t}`]??It.line,.62);function Xr(e){return{wood:It.wood,woodDark:It["wood-dark"],wall:It[`room-${e??"a"}`],trim:It.trim,pot:It.coral.clone().lerp(It["wood-dark"],.35),leaf:It.leaf,shade:It.trim,glow:It.glow,sky:It.window,window:It.window,desk:It.desk,tile:It.tile,counter:It.counter,fridge:It.fridge,carpet:It.carpet,outerWall:It["outer-wall"],books:Ps.map(t=>It[t]),mugs:Ps.map(t=>It[t])}}function lv(e){e.desk&&e.group.remove(e.desk.group),e.desk=Lx(Xr(e.room),It[e.tint]),e.desk.group.position.set(0,be,Q_),e.desk.group.traverse(t=>{t.isMesh&&(t.userData.pick={kind:"session",id:e.id})}),e.group.add(e.desk.group)}function Nl(e,t){let n=document.createElement("div");return n.className=`tag ${t}`,n.innerHTML=e,{obj:new cl(n),el:n}}function Wh(e,t){let n=document.createElement("div");return n.className=`flag ${e}`,n.innerHTML=t,{obj:new cl(n),el:n}}function Jh(e,t,n,i=Math.PI*2){let s=new q(new Xa(e,t,96,1,Math.PI/2,-i),new cn({color:n,side:Gn,transparent:!0}));return s.rotation.x=-Math.PI/2,s.position.y=be+.9,s}var ge=null,qn=null,F_="",Cn=null;function sC(){return ge||(ge={...Nx(Xr("a")),w:fl,d:zr,target:new L,center:new L,placed:!1,taken:new Set,label:Nl('<span class="pname">Coffee corner</span>',"project coffee")},ge.label.obj.position.set(-25,62,-zr/2+14),ge.group.add(ge.label.obj),ie.add(ge.group),ge)}function rC(e,t){let n=`${Math.round(e)}x${Math.round(t)}`;qn&&n===F_||(qn&&ie.remove(qn.group),qn=Ux({W:e,D:t,colors:Xr("a")}),F_=n,ie.add(qn.group),oC(e,t),aC(e,t))}var ii=null,Tl=null;function oC(e,t){Tl||(Tl=Nl('<button type="button" class="pname" title="Start a new job (n)"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 14h10l-1.4-2V8.5a3.6 3.6 0 0 0-7.2 0V12zM8.5 16.5a1.6 1.6 0 0 0 3 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>Front desk<small>New job</small></button>',"project frontdesk"),Tl.el.addEventListener("click",()=>document.dispatchEvent(new CustomEvent("office:frontdesk")))),ii=Ox({...Xr("a"),accent:It.clay}),ii.group.traverse(n=>{n.isMesh&&(n.userData.pick={kind:"frontdesk"})}),ii.group.position.set(e/2-Il/2-qp/2-26,.4,t/2-18),Tl.obj.position.set(0,50,0),ii.group.add(Tl.obj),qn.group.add(ii.group)}function cv(e){ii&&(ii.ringAt=e,Hi.chime())}function aC(e,t){if(!Cn){let r=new Ht,a=new q(new ue(8,8.4,3,28),new _e({color:"#3b3a3f",roughness:.4}));a.position.y=1.9;let o=new q(new ue(5.4,5.4,.6,24),new _e({color:"#56555c",roughness:.3}));o.position.y=3.6;let c=new q(new Vn(.9,10,10),new cn({color:"#56e39f"}));c.position.set(0,3.7,6),r.add(a,o,c),r.traverse(l=>{l.isMesh&&(l.castShadow=!0)}),ie.add(r),Cn={group:r,led:c,i:0}}let n=e/2-34,i=t/2-34,s=t/2-50;Cn.loop=[new L(-n,0,s),new L(n,0,s),new L(n,0,-i+30),new L(-n,0,-i+30)],Cn.group.position.copy(Cn.loop[0]),Cn.i=1}var os=e=>e.past||e.status==="done",qh=e=>e.lastAt??e.endedAt??e.startedAt??0;function lC(e){let t=new Map;for(let r of F.values())r.kind!=="session"||!r.project||(t.has(r.project)||t.set(r.project,{live:[],past:[]}),t.get(r.project)[os(r)?"past":"live"].push(r));let n=[];for(let[r,{live:a,past:o}]of t){a.sort((u,h)=>(u.startedAt??0)-(h.startedAt??0)),o.sort((u,h)=>qh(h)-qh(u));let c=[...a,...e?o.slice(0,N_):[]];if(!c.length)continue;let l=F.get(`p:${r}`);n.push({id:`p:${r}`,name:l?.label??r,live:a.length,hidden:o.length-(e?Math.min(o.length,N_):0),sessions:c,recent:Math.max(...c.map(qh))})}let i=n.filter(r=>r.live).sort((r,a)=>r.name.localeCompare(a.name)),s=n.filter(r=>!r.live).sort((r,a)=>a.recent-r.recent).slice(0,Y2);return[...i,...s]}function cC(e){let t=Ge.get(e.id);t||(t={id:e.id,label:Nl("","project"),center:new L,target:new L},t.label.el.addEventListener("click",l=>{let u=l.target.closest("[data-edit-project]");u?document.dispatchEvent(new CustomEvent("office:project-edit",{detail:{id:u.dataset.editProject,raw:u.dataset.raw,anchor:u}})):nd(rs===e.id?null:e.id)}),Ge.set(e.id,t));let n=j2(e.sessions.length),i=n*bm+X2,s=Z_+J_+(Math.ceil(e.sessions.length/n)-1)*Tm+q2;if(t.cols=n,t.w!==i||t.d!==s){t.mesh&&ie.remove(t.mesh);let l=Ix({w:i,d:s,name:e.name,colors:Xr(Yh(e.name))});t.mesh=l.group,t.plants=l.plants,t.decor=Px({w:i,d:s,colors:Xr(Yh(e.name)),shelfAt:l.shelfAt}),t.mesh.add(t.decor.group),t.decorKey="",t.mesh.position.copy(t.center),t.mesh.add(t.label.obj),ie.add(t.mesh),t.w=i,t.d=s}t.label.obj.position.set(0,ss+8,-s/2);let r=e.hidden>0?`<span class="pmore">+${e.hidden}</span>`:"",a=e.id.slice(2),o=fn(a,e.name),c=`<button type="button" class="picon" data-edit-project="${P(a)}" data-raw="${P(e.name)}" title="Rename or change the icon" aria-label="Rename ${P(o)} or change its icon">${Bs(a,e.name)}</button><span class="pname">${P(o)}</span>${r}`;return t.html!==c&&(t.label.el.innerHTML=t.html=c),t.label.el.classList.toggle("focused",rs===e.id),t}function uC(e){let t=We.get(e.id);return t||(t={id:e.id,home:new L,group:new Ht,gaugeKey:"",placed:!1},t.tint=Ds(e.session),t.room=Yh(F.get(`p:${e.project}`)?.label??e.project),t.body=new Ht,t.char=Bp({build:"session",bodyColor:It[t.tint],inkColor:rv,accentColor:It.gem,pick:{kind:"session",id:e.id}}),t.char.root.scale.setScalar(ia),t.char.root.position.y=be,t.body.add(t.char.root),t.rug=kx(av(t.tint,t.room)),t.track=Jh(22,23.6,It.line),t.label=Nl("","session"),t.label.obj.position.set(0,be,32),t.label.el.addEventListener("click",()=>kl(e.id)),t.label.el.addEventListener("pointerenter",()=>{Is=e.id,Vi={kind:"session",id:e.id}}),t.label.el.addEventListener("pointerleave",()=>{Is===e.id&&(Is=Vi=null)}),t.zzz=Wh("zzz","<i>z</i><i>z</i><i>z</i>"),t.zzz.obj.position.set(10,be+ia*t.char.height+4,0),t.oops=Wh("oops","!"),t.oops.obj.position.set(0,be+ia*t.char.height+10,0),t.bell=Wh("bell",EC),t.bell.obj.position.set(-14,be+ia*t.char.height+6,0),t.body.add(t.zzz.obj,t.oops.obj,t.bell.obj),t.group.add(t.rug,t.track,t.body,t.label.obj),lv(t),t.easel=Dx(Xr(t.room)),t.easel.group.position.set(-50,be,Q_+4),t.easel.group.rotation.y=.35,t.easel.group.visible=!1,t.easel.group.traverse(n=>{n.isMesh&&(n.userData.pick={kind:"session",id:e.id})}),t.group.add(t.easel.group),t.seen=ee.filter(n=>n.session===e.session).length,t.walkIn=!os(e)&&He()-Dl>3,t.bornAt=He(),ie.add(t.group),We.set(e.id,t),t)}function hC(e){let t=We.get(e);if(t){ie.remove(t.group);for(let n of[t.label.el,t.zzz.el,t.oops.el,t.bell.el])n.remove();We.delete(e);for(let[n,i]of Ce)i.session===e&&uv(n)}}function dC(e,t){let n=Ce.get(e.id);if(n)return n;let i=new Set([...Ce.values()].filter(o=>o.session===t.id&&!o.gone&&!o.endedAt).map(o=>o.slot)),s=0;for(;i.has(s);)s++;let r=lr(e.type),a=e.status==="done"?-1/0:He();return n={id:e.id,session:t.id,slot:s,tint:r,born:a,group:new Ht,gone:e.status==="done"},n.char=Bp({build:e.type,bodyColor:It[r],inkColor:rv,accentColor:ov(r),pick:{kind:"agent",id:e.id}}),n.char.root.scale.setScalar(jh),n.oops=Wh("oops small","!"),n.oops.obj.position.set(0,jh*n.char.height+8,0),n.tag=Nl(`<i class="dot ${r}"></i>${P(on(e).name)}`,"agent"),n.tag.obj.position.set(0,0,9),n.tag.el.addEventListener("click",()=>kl(e.id)),n.group.add(n.char.root,n.oops.obj,n.tag.obj),n.group.visible=!n.gone,ie.add(n.group),Ce.set(e.id,n),!n.gone&&He()-Dl>3&&(t.waveAt=He(),Hi.pop()),n}function uv(e){let t=Ce.get(e);t&&(ie.remove(t.group),t.oops.el.remove(),t.tag.el.remove(),t.spot!==void 0&&ge?.taken.delete(t.spot),Ce.delete(e))}function fC(e){let t=[...e.map(a=>Ge.get(a.id)),sC()],n=Math.max(1,(Re.clientWidth||1)-Gi.left-Gi.right),i=Math.max(1,(Re.clientHeight||1)-Gi.top-Gi.bottom),s=null;for(let a=1;a<=t.length;a++){let o=[];for(let h=0;h<t.length;h+=a)o.push(t.slice(h,h+a));let c=Math.max(...o.map(h=>h.reduce((f,p)=>f+p.w,0)+(h.length-1)*ea))+Il*2,l=o.reduce((h,f)=>h+Math.max(...f.map(p=>p.d)),0)+(o.length-1)*ea+Il*2,u=Math.min(n/(c+60),i/(l*Math.sin(na)+80));(!s||u>s.scale)&&(s={cols:a,W:c,D:l,scale:u})}let r=-s.D/2+Il;for(let a=0;a<t.length;a+=s.cols){let o=t.slice(a,a+s.cols),c=Math.max(...o.map(h=>h.d)),u=-(o.reduce((h,f)=>h+f.w,0)+(o.length-1)*ea)/2;for(let h of o)h.target.set(u+h.w/2,0,r+h.d/2),h.placed||(h.center.copy(h.target),h.placed=!0),h.rowFront=r+c,u+=h.w+ea;r+=c+ea}return rC(s.W,s.D),{W:s.W,D:s.D}}var ei={W:300,D:Tm};function Rm(e=!1){let t=rs&&Ge.get(rs),n=t?t.w:ei.W,i=t?t.d:ei.D,s=t?t.target:new L,r=Re.clientWidth||1,a=Re.clientHeight||1,o={x0:Math.min(Gi.left,r*.45),x1:r-Math.min(Gi.right,r*.45),y0:Math.min(Gi.top,a*.45),y1:a-Math.min(Gi.bottom,a*.45)},c=(o.x0+o.x1)/2,l=(o.y0+o.y1)/2,u=(o.x1-o.x0)/2,h=(o.y1-o.y0)/2;Kt.setViewOffset(r,a,r/2-c,a/2-l,r,a);let f=Kt.fov*Math.PI/180,p=2*Math.atan(Math.tan(f/2)*(u/h)),m=Math.max((n+50)/2/Math.tan(p/2),(i*Math.sin(na)+70)/2/Math.tan(f/2))*(a/(2*h)),y=[];for(let w of[-n/2,n/2])for(let b of[-i/2,i/2+30])for(let A of[0,t?ss+16:66])y.push(new L(s.x+w,A,s.z+b));let g={pos:Kt.position.clone(),quat:Kt.quaternion.clone()},d=new L(s.x,8,s.z);for(let w=0;w<5;w++){Kt.position.set(s.x,Math.sin(na)*m,s.z+Math.cos(na)*m),Kt.lookAt(d),Kt.updateMatrixWorld();let b=Math.max(...y.map(A=>{let S=A.clone().project(Kt),T=(S.x+1)/2*r,I=(1-S.y)/2*a;return Math.max(Math.abs(T-c)/(u*.94),Math.abs(I-l)/(h*.94))}));m*=Math.max(.6,b)}let _={pos:new L(s.x,Math.sin(na)*m,s.z+Math.cos(na)*m),target:d};t||(ae.maxDistance=m),e||!B_||vi()?(B_=!0,Kt.position.copy(_.pos),ae.target.copy(_.target),$i=null):(Kt.position.copy(g.pos),Kt.quaternion.copy(g.quat),$i=_),Cs=null,ae.update(),Object.assign(gn.shadow.camera,{left:-ei.W/2-80,right:ei.W/2+80,top:ei.D/2+100,bottom:-ei.D/2-100,near:10,far:900}),gn.shadow.camera.updateProjectionMatrix()}var B_=!1;function Qh(e){let t=["left","right","top","bottom"].every(n=>Math.abs((Gi[n]??0)-e[n])<2);Gi=e,t||Rm()}function td(e){let t=e&&F.get(e),n=t?.kind==="agent"?F.get(Ct(t.session)):t;nd(n?.project?`p:${n.project}`:null)}function ed(e){let t=e&&F.get(e);Vi=t?{kind:t.kind,id:e}:null,Is=t?.kind==="session"?e:null}function nd(e){let t=e&&Ge.has(e)?e:null;t===rs&&$i||(rs=t,Rm())}function H_(){let e=Re.clientWidth,t=Re.clientHeight;le.setSize(e,t),Pl.setSize(e,t),Kt.aspect=e/Math.max(1,t),Kt.updateProjectionMatrix(),Kh=""}var Cm=()=>ei.W/2-Il/2,Im=e=>(e?.rowFront??e?.target.z??0)+ea/2;function Pm(e,t,n,i){e.walk={group:t,path:n.map(s=>s.clone?s.clone():s),then:i}}function z_(e,t){let n=e.walk;if(!n)return!1;let i=vi()?1/0:Z2*t;for(;i>0&&n.path.length;){let s=n.path[0];if(typeof s=="function"){n.path.shift(),s();continue}if(s.wait!==void 0){if(n.until??=He()+s.wait,He()<n.until)return!0;n.until=null,n.path.shift();continue}let r=n.group.position,a=s.x-r.x,o=s.z-r.z,c=Math.hypot(a,o);if(c>.01){let u=Math.atan2(a,o)-n.group.rotation.y;u=Math.atan2(Math.sin(u),Math.cos(u)),n.group.rotation.y+=u*Math.min(1,t*10)}c<=i?(r.x=s.x,r.z=s.z,i-=c,n.path.shift()):(r.x+=a/c*i,r.z+=o/c*i,i=0)}return n.path.length?!0:(e.walk=null,n.then?.(),!1)}function hv(e,t=km(e),n=!1){let i=Cm(),s=Im(t),r=o=>o.sub(e.home);e.body.visible=!0,e.body.position.copy(r(new L(i,0,ei.D/2+20)));let a=n&&ii?[r(new L(i,0,ii.group.position.z+8)),()=>{e.body.rotation.y=-Math.PI/2,cv(He()),e.waveAt=He()+.3},{wait:1.1}]:[];Pm(e,e.body,[...a,r(new L(i,0,s)),r(new L(e.home.x,0,s)),new L(0,0,0)],()=>{e.body.rotation.y=0})}function pC(e,t){let n=Cm(),i=Im(km(e)),s=r=>r.sub(e.home);Pm(e,e.body,[s(new L(e.home.x,0,i)),s(new L(n,0,i)),s(new L(n,0,ei.D/2+20))],t)}function km(e){let t=F.get(e.id);return t&&Ge.get(`p:${t.project}`)}function mC(e,t){let n=ge,i=n?n.spots.findIndex((u,h)=>!n.taken.has(h)):-1;if(i<0){e.leaving=He();return}n.taken.add(i),e.spot=i;let s=km(t),r=n.target.clone().add(n.spots[i]),a=(Ll(e.id)%5-2)*9,o=Im(s)+a,c=Cm()+a,l=[new L(e.group.position.x,0,o),new L(c,0,o),new L(c,0,r.z),r];Pm(e,e.group,l,()=>{e.onBreak=He(),Hi.clink();let u=new q(new ue(.17,.15,.32,12),new _e({color:It.trim}));u.position.set(.45,-.12,.2),e.char.arms[1].add(u)})}function Lm(e){He()-dv>1&&yC();let t=lC(e),n=new Set;for(let r of t)cC(r),r.sessions.forEach(a=>{n.add(a.id),uC(a)});for(let r of[...Ge.keys()])t.some(a=>a.id===r)||(ie.remove(Ge.get(r).mesh),Ge.get(r).label.el.remove(),Ge.delete(r));rs&&!Ge.has(rs)&&(rs=null);for(let r of[...We.keys()])n.has(r)||hC(r);let i=new Set;for(let r of F.values()){if(r.kind!=="agent")continue;let a=We.get(Ct(r.session)),o=a&&F.get(a.id);!a||!o||os(o)||(dC(r,a),i.add(r.id))}for(let r of[...Ce.keys()])i.has(r)||uv(r);let s=t.map(r=>`${r.id}:${r.sessions.map(a=>a.id).join(",")}`).join("|")+`@${Re.clientWidth}x${Re.clientHeight}`;if(s!==Kh){Kh=s,ei=fC(t);for(let r of t){let a=Ge.get(r.id);r.sessions.forEach((o,c)=>{let l=We.get(o.id),u=Math.floor(c/a.cols),h=Math.min(a.cols,r.sessions.length-u*a.cols),f=c%a.cols;l.home.set(a.target.x-(h-1)*bm/2+f*bm,0,a.target.z-a.d/2+Z_+J_+u*Tm),l.placed||(l.group.position.copy(l.home),l.placed=!0,l.walkIn&&hv(l,a,!!(Jp(o)&&ii)))})}Rm()}return t}var dv=-9;function gC(e,t){let n=t.get(e.session),i=e.pastAgents?.length??0;if(!e.past)for(let s of F.values())s.kind==="agent"&&s.session===e.session&&s.status!=="done"&&i++;return{turns:e.turns??0,tools:e.toolCalls??0,outputs:n?.outputs??0,pictures:n?.pictures??0,prs:n?.prs??0,team:i}}function yC(){dv=He();let e=Oh(),t=new Map;for(let r of ee){if(r.type==="file")continue;let a=t.get(r.session)??{outputs:0,pictures:0,prs:0};a.outputs++,r.type==="image"&&a.pictures++,r.type==="pr"&&a.prs++,t.set(r.session,a)}let n=!1,i=new Map;for(let r of F.values())r.kind!=="session"||!r.project||(i.set(r.project,fn(r.project,r.projectName??F.get(`p:${r.project}`)?.label)),x_(e,r.project,r.session,gC(r,t))&&(n=!0));let s=He()-Dl<6;for(let[r,a]of i){let o=v_(e,r);o.length&&(n=!0,s||xC(r,a,o))}n&&M_(e);for(let r of Ge.values()){if(!r.decor)continue;let a=w_(e,r.id.slice(2)),o=`${a.trophies}|${a.poster}|${a.neon}|${a.plant}`;o!==r.decorKey&&(r.decorKey=o,r.decor.set(a,r.plants?.[1]),le.shadowMap.needsUpdate=!0)}}function xC(e,t,n){let i=n.at(-1),s=n.length>1?` (and ${n.length-1} more)`:"";E_({icon:"\u2605",title:`${t}: ${i.title}!${s}`,text:i.adds,onClick:()=>nd(`p:${e}`)}),Hi.chime();let r=Ge.get(`p:${e}`);r&&fv(r.center.clone().add(xn.set(0,ss,-r.d/2+20)))}function jr(e){let t=Ce.get(e);if(t&&!t.gone)return t.group.position.clone().add(xn.set(0,jh*t.char.height,0));let n=We.get(e);return n?n.group.position.clone().add(n.body.position).add(xn.set(0,be+ia*n.char.height,0)):null}function _C(e){let t=jr(e);if(!t)return null;let n=Ce.has(e);t.y+=n?5:9;let i=t.project(Kt);if(i.z>1)return null;let s=(i.x+1)/2*Re.clientWidth,r=(1-i.y)/2*Re.clientHeight;return s<-40||r<-40||s>Re.clientWidth+40||r>Re.clientHeight+40?null:{x:s,y:r}}var vC=new Vn(1.7,12,10),bC=new un(1.6,.3,1);function wC(e,t){let n=new q(vC,new _e({color:t,roughness:.5,transparent:!0}));n.castShadow=!0,n.position.copy(e),ie.add(n),zh.push({m:n,born:He(),from:e.clone(),drift:new L((Math.random()-.5)*6,0,(Math.random()-.5)*6)})}function fv(e){for(let t=0;t<18;t++){let n=new q(bC,new _e({color:It[Ps[t%Ps.length]],transparent:!0}));n.position.copy(e),ie.add(n);let i=Math.random()*Math.PI*2,s=14+Math.random()*18;Vh.push({m:n,born:He(),vel:new L(Math.cos(i)*s,34+Math.random()*22,Math.sin(i)*s),spin:new L(Math.random()*9,Math.random()*9,Math.random()*9)})}}function MC(e,t,n,i){ni.fly(e,t,n,i)}var SC=matchMedia("(prefers-reduced-motion: reduce)");function Dm(e){let t=He();e.kind==="job.start"&&cv(t);let n=e.agent?Ne(e.session,e.agent):Ct(e.session),i=We.get(Ct(e.session));if(e.kind==="tool.start"||e.kind==="tool.end"&&!e.ok){let s=Ce.get(n)??i;if(!s)return;e.kind==="tool.start"?(s.hopAt=t,s.lastAt=t,i&&(i.lookAt=e.agent?n:null),Hi.keys()):(s.failAt=t,Hi.bonk());let r=jr(n);r&&wC(r,e.kind==="tool.end"?It.crit:It[_f(e.tool)]??It.line)}else if(e.kind==="context.compact"&&i&&!e.agent){let s=Jh(23,24,It[i.tint]);s.position.x=i.group.position.x,s.position.z=i.group.position.z,ie.add(s),$h.push({r:s,born:t}),Hi.hush()}else if(e.kind==="turn.start"&&i&&!e.agent)i.hopAt=t,e.text&&(i.perkAt=t);else if(e.kind==="turn.complete"&&i&&!e.agent){e.reason==="answer"||!e.reason?i.cheerAt=t:e.reason!=="aborted"&&(i.sulkAt=t);let s=jr(i.id);s&&!vi()&&fv(s),Hi.chime(),e.answer&&ni.say(i.id,"answer",{text:e.answer,thread:i.id},t)}if(e.kind==="turn.complete"&&e.agent&&e.answer&&Ce.has(n)&&ni.say(n,"answer",{text:e.answer,thread:i?.id},t),e.kind==="agent.message"&&i){let s=ci[0];if(!s||s.t!==e.t)return;s.from?(ni.say(s.from,"mail",{who:`To ${s.toName??"someone"}`,text:s.text??"",thread:i.id},t),s.to&&MC(s.from,s.to,"teal",t)):ni.say(s.to??i.id,"relay",{who:s.fromName??"From outside",text:s.text??"",thread:i.id},t)}if(e.kind==="chat.sent"&&i&&ni.say(n,"you",{who:"You",text:e.text??"",thread:i.id},t),e.kind==="asset.add"&&e.type==="pr"&&i){let s=`${e.session}|${e.id}|${e.meta?.state??"open"}`;V_.has(s)||(V_.add(s),G_(i.id,n,t))}if(e.kind==="session.end"&&i&&G_(i.id,i.id,t),(e.kind==="chat.sent"||e.kind==="ask.close")&&i){let s=Ce.get(n)??i;s.perkAt=t}}var EC='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3.2a1.2 1.2 0 0 1 1.2 1.2v.5a5 5 0 0 1 3.8 4.9v3.4l1.4 1.6H3.6L5 13.2V9.8a5 5 0 0 1 3.8-4.9v-.5A1.2 1.2 0 0 1 10 3.2z" fill="currentColor"/><circle cx="10" cy="16.6" r="1.6" fill="currentColor"/></svg>',TC=4.5,AC=70,RC=15,CC=3*6e4,$_=new Map,V_=new Set;function G_(e,t,n){let i=F.get(e),s=i?.project&&`p:${i.project}`;if(!s||n-($_.get(s)??-99)<RC)return;$_.set(s,n);let r=We.get(e);if(!r||r.away)return;Hi.bell(),r.bellAt=n;let a=jr(t)??jr(e);if(!a)return;a.y=0;let o=Ce.get(t)??r;if(o.cheerAt=n,Gh.matches){for(let l of We.values())F.get(l.id)?.project===i.project&&(l.cheerAt=n);return}let c=0;for(let l of We.values()){let u=F.get(l.id);l===o||l.away||l.walk||!u||os(u)||u.project!==i.project||(l.gatherAt=n,l.gatherTo=(l.gatherTo??new L).copy(a),l.cheerAt=n+1.1)}for(let l of Ce.values()){let u=F.get(l.session);if(l===o||l.gone||l.endedAt||!u||u.project!==i.project||F.get(l.id)?.status!=="active")continue;let h=c++/6*Math.PI*2+.4;l.gatherAt=n,l.gatherTo=(l.gatherTo??new L).set(a.x+Math.sin(h)*30,be,a.z+Math.cos(h)*30),l.cheerAt=n+1.1}}var xm=(e,t)=>e.gatherAt===void 0?0:xx((t-e.gatherAt)/TC),Hh=typeof location=="object"?Number(new URLSearchParams(location.search).get("hour")):NaN,Em=Number.isFinite(Hh)&&Hh>=0&&Hh<24&&new URLSearchParams(location.search).has("hour")?Hh:null;function pv(){if(Em!==null)return Em;let e=new Date;return e.getHours()+e.getMinutes()/60}function IC(e,t,n,i,s){let r=os(t)||!s&&!t.turnOpen&&!t.asks?.length&&i-(t.lastAt??t.startedAt??i)>CC,a=gx(pv())&&r;return a&&!e.away&&!e.leaving?He()-e.bornAt<3||!e.placed?(e.away=!0,e.body.visible=!1):e.walk||(e.leaving=!0,pC(e,()=>{e.away=!0,e.leaving=!1,e.body.visible=!1})):!a&&e.away&&(e.backAt??=n+(s||t.turnOpen?0:Ll(e.id)%20),n>=e.backAt&&(e.away=!1,e.backAt=null,hv(e))),e.away||e.leaving}var Zh=-1,_m=[[0,"night"],[5.5,"night"],[7,"dawn"],[9,"window"],[16.5,"window"],[18.5,"dawn"],[19.5,"dusk"],[21,"night"],[24,"night"]];function PC(e){if(e-Zh<5)return;Zh=e;let t=pv(),n=0;for(;_m[n+1][0]<=t;)n++;let[i,s]=_m[n],[r,a]=_m[n+1],o=(t-i)/Math.max(.01,r-i),c=It[s].clone().lerp(It[a],o);$r.color.copy(c),$r.emissive.copy(c);let l=s==="night"&&a==="night"?1:s==="window"&&a==="window"?0:s==="night"?1-o:a==="night"?o:.4;$r.emissiveIntensity=.45-l*.15,Yo.emissive.copy(It.glow),Yo.emissiveIntensity=.45+l*1.1;let u=yx(t);gn.intensity=iv-l*.7-u*.35,gn.color.set("#fffaf2").lerp(new Gt("#c9d4ff"),l*.6),Mm.intensity=ev-l*.3-u*.3,ie.environmentIntensity=nv*(1-l*.5-u*.2)}function kC(e,t){let n=`${ks(t)}:${t.toFixed(3)}`;n!==e.gaugeKey&&(e.gaugeKey=n,e.gauge&&e.group.remove(e.gauge),e.gauge=t>0?Jh(14.6,16.6,It[ks(t)],Math.max(.05,Math.PI*2*t)):null,e.gauge&&(e.gauge.position.y+=.05,e.group.add(e.gauge)))}function W_(e,t,n,i,s){let r=e.failAt?(i-e.failAt)/1.4:1;t.rig.rotation.z=r<1&&!s?Math.sin(i*38)*.09*(1-r):0,n.classList.toggle("on",r<1)}function vm(e,t,n){let i=e.waveAt?(n-e.waveAt)/Q2:1;if(i>=1)return;let s=t.arms[0];s.rotation.x=0,s.rotation.z=-(2.1+Math.sin(n*16)*.35)*Math.sin(Math.min(1,i*4)*Math.PI/2)}var Cl=new Map;function LC(e){let t=[];for(let n of Ce.values())n.gone||n.leaving||!n.endedAt||!(n.walk||n.onBreak)||t.push({view:n,pos:n.group.position,walking:!!n.walk});for(let n of We.values())n.walk&&t.push({view:n,pos:n.group.position.clone().add(n.body.position),walking:!0});for(let n=0;n<t.length;n++)for(let i=n+1;i<t.length;i++){let s=t[n],r=t[i];if(!s.walking&&!r.walking||Math.hypot(s.pos.x-r.pos.x,s.pos.z-r.pos.z)>tC)continue;let a=s.view.id<r.view.id?`${s.view.id}|${r.view.id}`:`${r.view.id}|${s.view.id}`;e-(Cl.get(a)??-99)<12||(Cl.set(a,e),s.view.waveAt=r.view.waveAt=e,Hi.hello())}Cl.size>200&&Cl.clear()}var ta=[];function DC(){ta.length=0;for(let e of Ce.values())!e.gone&&!e.walk&&!e.leaving&&e.settled&&ta.push(e);for(let e=0;e<ta.length;e++)for(let t=e+1;t<ta.length;t++){let n=ta[e].group.position,i=ta[t].group.position,s=i.x-n.x,r=i.z-n.z,a=Math.hypot(s,r)||.01;if(a>=U_)continue;let o=(U_-a)/2;n.x-=s/a*o,n.z-=r/a*o,i.x+=s/a*o,i.z+=r/a*o}}function Nm(){let e=He(),t=Math.min(.1,e-Sm);Sm=e;let n=vi(),i=n?0:e,s=n?1:.12,r=Date.now(),a=new Set;for(let o of F.values())o.kind==="tool"&&o.status==="active"&&a.add(o.owner);PC(e);for(let o of Ge.values()){o.center.lerp(o.target,s),o.mesh.position.copy(o.center);for(let c of o.plants??[])c.rotation.z=Math.sin(i*.8+c.userData.plant)*.035;o.decor?.animate(i)}if(ii?.ringAt!==void 0){let o=(e-ii.ringAt)/.9;ii.bell.rotation.z=o<1&&!SC.matches&&!n?Math.sin(e*42)*.25*(1-o):0}if(ge&&(ge.center.lerp(ge.target,s),ge.group.position.copy(ge.center),ge.animate(i)),qn){for(let l of qn.plants)l.rotation.z=Math.sin(i*.7+l.userData.plant)*.03;let o=new Date,c=o.getSeconds()+o.getMilliseconds()/1e3;qn.clock.second.rotation.z=-(c/60)*Math.PI*2,qn.clock.minute.rotation.z=-((o.getMinutes()+c/60)/60)*Math.PI*2,qn.clock.hour.rotation.z=-((o.getHours()%12+o.getMinutes()/60)/12)*Math.PI*2}if(Cn?.loop&&!n){let o=Cn.loop[Cn.i],c=Cn.group,l=o.x-c.position.x,u=o.z-c.position.z,h=Math.hypot(l,u),f=22*t;if(h<=f)Cn.i=(Cn.i+1)%Cn.loop.length;else{c.position.x+=l/h*f,c.position.z+=u/h*f;let p=Math.atan2(l,u)-c.rotation.y;p=Math.atan2(Math.sin(p),Math.cos(p)),c.rotation.y+=p*Math.min(1,t*4)}Cn.led.visible=Math.floor(e*2)%2===0}else Cn&&(Cn.led.visible=!0);FC();for(let o of We.values()){let c=F.get(o.id);if(!c)continue;o.group.position.lerp(o.home,s);let l=os(c),u=Xe(c),h=z_(o,t),f=a.has(o.id)||r-(c.lastAt??0)<tv,p=IC(o,c,e,r,f);if(!h&&!p){let S=xm(o,e);if(S>0){xn.copy(o.gatherTo).sub(o.group.position);let T=xn.length();xn.setY(0).multiplyScalar(Math.min(1,Math.max(0,T-30)/Math.max(1,T),AC/Math.max(1,T))*S);let I=n?1:1-Math.pow(5e-4,t);o.body.position.lerp(xn,I),o.body.rotation.y+=(Math.atan2(o.gatherTo.x-o.group.position.x-o.body.position.x,o.gatherTo.z-o.group.position.z-o.body.position.z)*Math.min(1,S*2)-o.body.rotation.y)*I}else o.gatherAt!==void 0&&(o.body.position.lerp(xn.set(0,0,0),1-Math.pow(5e-4,t)),o.body.rotation.y*=Math.pow(5e-4,t),o.body.position.lengthSq()<.01&&(o.body.position.set(0,0,0),o.body.rotation.y=0,o.gatherAt=void 0))}let m=l?0:h||f||xm(o,e)>.05?1:Math.max(0,1-(e-(o.lastAt??-9))/2.5),y=l||!f&&!h&&r-(c.lastAt??c.startedAt??r)>K2,g=o.lookAt&&Ce.get(o.lookAt),d=g&&!g.endedAt?Math.atan2(g.group.position.x-o.group.position.x,g.group.position.z-o.group.position.z):0;hh(o.char,i,{busy:m,look:h?0:Math.max(-.45,Math.min(.45,d*.3)),hop:o.hopAt&&!n?(e-o.hopAt)/.35:1,alarm:!l&&!h&&u>=zs,asleep:y});let _=!h&&c.turnOpen&&!a.has(o.id)&&!c.asks?.length&&e-(o.lastAt??-9)>1.2,w=!h&&!f&&!c.turnOpen?(r-(c.lastAt??r))/1e3:0;dh(o.char,e,gm(o,y||h,_,w),Gh.matches||n),W_(o,o.char,o.oops.el,e,n),n||vm(o,o.char,e),o.bell.el.classList.toggle("on",o.bellAt!==void 0&&e-o.bellAt<2.4),o.char.bodyMat.color.copy(It[o.tint]).lerp(It.line,l?.6:0),o.char.bulb.visible=!l,o.zzz.el.classList.toggle("on",y&&!h&&!p),o.desk.draw(e,l||p?"off":m>.5&&!h?"busy":"idle",`#${It[o.tint].getHexString()}`,n),o.desk.steam(i,!l&&!p&&f),o.desk.animateTray?.(i),zC(o,c,e,l||p&&!h),kC(o,u);let b=!l&&u>=zs;b&&!o.alarm&&(o.alarm=Jh(26.5,27.5,It.crit),o.group.add(o.alarm)),!b&&o.alarm&&(o.group.remove(o.alarm),o.alarm=null),o.alarm&&(o.alarm.material.opacity=n?.7:.35+.45*(Math.sin(e*3)+1)/2);let A=`<span class="who">${P(on(c).name)}</span><span class="sname">${P(c.label)}</span>${c.context?.tokens?qe()?`<span class="pct ${ks(u)}">${Ls(u)}</span>`:xa(u,{bare:!0}):""}`;o.html!==A&&(o.label.el.innerHTML=o.html=A),o.label.el.classList.toggle("selected",zi===o.id),o.label.el.classList.toggle("past",l||p)}for(let o of Ce.values()){let c=F.get(o.id),l=We.get(o.session);if(!c||!l||(c.status==="done"&&!o.endedAt&&(o.endedAt=e,!o.gone&&(c.endStatus==="failed"||c.endStatus==="killed")&&(o.sulkAt=e),ni.hold(o.id,"think",null,e),o.gone||(o.waveAt=e,l.waveAt=e+.2,o.departAt=e+.9)),o.gone))continue;o.departAt&&e>=o.departAt&&(o.departAt=null,mC(o,l)),W_(o,o.char,o.oops.el,e,n);let u=z_(o,t);if(o.endedAt){if(!u&&o.onBreak&&!o.leaving&&e-o.onBreak>J2&&(o.leaving=e),hh(o.char,i+o.slot,{busy:u?1:0,hop:1}),dh(o.char,e,gm(o,!1,!1,0),Gh.matches||n),n||vm(o,o.char,e),o.onBreak&&!o.leaving){let w=O_.copy(ge.target).add(ge.tableAt),b=Math.atan2(w.x-o.group.position.x,w.z-o.group.position.z);o.group.rotation.y+=Math.atan2(Math.sin(b-o.group.rotation.y),Math.cos(b-o.group.rotation.y))*Math.min(1,t*6);let A=!n&&Math.sin((e-o.onBreak)*1.3)>.85;o.char.arms[1].rotation.x=A?-1.3:-.5,o.char.arms[1].rotation.z=.35}if(o.leaving){let w=n?1:Math.min(1,(e-o.leaving)/1.6);o.group.scale.setScalar(Math.max(.01,1-w)),w>=1&&(o.gone=!0,o.group.visible=!1,o.spot!==void 0&&ge?.taken.delete(o.spot))}continue}let h=zi&&(zi===l.id||F.get(zi)?.session===F.get(l.id)?.session);ni.hold(o.id,"think",h&&c.status==="active"&&c.description?{key:c.description,text:c.description,thread:l.id}:null,e);let[f,p]=nC(o.slot),m=O_.set(l.group.position.x+f,be,l.group.position.z+p),y=xm(o,e);y>0&&m.lerp(o.gatherTo,y);let g=n?1:Math.min(1,(e-o.born)/.6);o.group.rotation.y=y>.05?Math.atan2(o.gatherTo.x-o.group.position.x,o.gatherTo.z-o.group.position.z)*y:Math.atan2(l.group.position.x-o.group.position.x,l.group.position.z-o.group.position.z)*.45,hh(o.char,i+o.slot,{busy:c.status==="active"&&(a.has(o.id)||e-(o.lastAt??-9)<1.5||y>.05)?1:0,hop:o.hopAt&&!n?(e-o.hopAt)/.3:1,alarm:c.status==="active"&&Xe(c)>=zs});let d=c.status==="active"&&!a.has(o.id)&&e-(o.lastAt??o.born)>1.5&&!c.asks?.length;dh(o.char,e,gm(o,!1,d,c.status==="idle"?e-(o.lastAt??o.born):0),Gh.matches||n),n||vm(o,o.char,e);let _=F.get(l.id);o.tag.el.classList.toggle("on",!!(h||Is===l.id||_&&rs===`p:${_.project}`)),o.group.scale.setScalar(Math.max(.01,g<1?g*(1+.2*Math.sin(g*Math.PI)):1)),m.y=be+(1-g)*(1-g)*40,o.group.position.lerp(m,g<1||!o.settled?1:.1),o.settled=!0}Bh%3===0&&LC(e),DC();for(let o=zh.length-1;o>=0;o--){let c=zh[o],l=(e-c.born)/1.6;if(l>=1){ie.remove(c.m),c.m.material.dispose(),zh.splice(o,1);continue}n?c.m.position.copy(c.from):c.m.position.copy(c.from).addScaledVector(c.drift,l).add(xn.set(0,l*16,0)),c.m.material.opacity=1-l*l}for(let o=$h.length-1;o>=0;o--){let c=$h[o],l=(e-c.born)/1.8;if(l>=1){ie.remove(c.r),$h.splice(o,1);continue}c.r.scale.setScalar(n?1.6:1+l*2.2),c.r.material.opacity=1-l}for(let o=Vh.length-1;o>=0;o--){let c=Vh[o],l=(e-c.born)/1.5;if(l>=1){ie.remove(c.m),c.m.material.dispose(),Vh.splice(o,1);continue}c.vel.y-=70*t,c.m.position.addScaledVector(c.vel,t),c.m.position.y<be+.4&&(c.m.position.y=be+.4,c.vel.multiplyScalar(.3)),c.m.rotation.x+=c.spin.x*t,c.m.rotation.y+=c.spin.y*t,c.m.material.opacity=1-l*l}if($i){let o=1-Math.pow(.002,t);Kt.position.lerp($i.pos,o),ae.target.lerp($i.target,o),Kt.position.distanceTo($i.pos)<.5&&($i=null)}VC(t),ae.dampingFactor=1-Math.pow(1-sv,t*60),ae.update(),$i||WC(),GC(),Bh%or().shadowEvery===0&&(le.shadowMap.needsUpdate=!0),qC(e,t),le.render(ie,Kt),Pl.render(ie,Kt),ni.tick(e,{selected:zi&&(F.get(zi)?.kind==="agent"?Ct(F.get(zi).session):zi)}),KC(Bh%10===1),Bh++%6===0&&XC()}var q_=new Map;function NC(e,t){let n=q_.get(e);n||(n=new Image,n.decoding="async",n.src=e,q_.set(e,n)),n.complete&&n.naturalWidth?t(n):n.addEventListener("load",()=>t(n),{once:!0})}var X_={pr:"leaf",artifact:"lilac",plan:"sky",link:"teal"},UC={pr:"\u21E1",artifact:"\u25C8",plan:"\u270E",link:"\u2197",file:"\u25A4"};function OC(e){if(e.type==="question"){let t=e.questions?.[0];return{text:`${t?.header??"Question"}?`,long:t?.question}}return e.type==="permission"?{text:`May I run ${br(e.tool)}?`,long:`May I run ${br(e.tool)} ${e.summary??""}?`}:{text:"Plan ready. Approve?",long:`Plan ready: ${(e.plan??"").replace(/^#+\s*/,"").split(`
`)[0]}. Approve?`}}var Xh=new Map;function FC(){Xh.clear();for(let e of F.values())if(!(!e.asks?.length||e.kind!=="session"&&e.kind!=="agent"))for(let t of e.asks){let n=Xh.get(e.session);(!n||t.t<n.t)&&Xh.set(e.session,{...t,who:e})}}var j_="",Al=new Map,BC=[];function HC(e){let t=`${ee.length}|${ee[0]?.session}|${ee[0]?.id}|${ee[0]?.t}`;if(t!==j_){j_=t,Al.clear();for(let n of ee)Al.has(n.session)||Al.set(n.session,[]),Al.get(n.session).push(n)}return Al.get(e)??BC}function zC(e,t,n,i){let s=i?null:Xh.get(t.session),r=s&&kh(s)?Kx(s):void 0;r&&Ih(s),ni.hold(e.id,"ask",s&&{key:s.id,type:s.type,...OC(s),thread:e.id,...r&&{options:r,answerKey:vl(s)}},n),e.desk.showAsk(s?.type,s?.type==="permission"?`#${It.mustard.getHexString()}`:s?.type==="plan"?`#${It.sky.getHexString()}`:`#${It.clay.getHexString()}`);let a=!i&&t.turnOpen&&t.todos?.find(l=>l.status==="in_progress");ni.hold(e.id,"think",a&&{key:a.text,text:a.active??a.text},n);let o=t.todos;e.easel.group.visible=!!o?.length&&!i,e.easel.group.visible&&e.easel.draw(o,`#${It[e.tint].getHexString()}`,vi()?.5:n);let c=HC(t.session);if(c.length!==e.seen){let l=c.slice(0,Math.max(0,c.length-(e.seen??0)));e.seen=c.length;let u=l.find(f=>f.type==="image");u&&NC(wl(u),f=>{e.desk.showImage(f,He()+6),e.desk.setPhoto(f)});let h=u??l.find(f=>f.type!=="file");if(h){let f=h.agent?Ne(t.session,h.agent):e.id,p={image:"Look: ",pr:"Opened a PR: ",artifact:"Published ",plan:"Wrote a plan: ",link:""}[h.type]??"";ni.say(Ce.get(f)&&!Ce.get(f).gone?f:e.id,"made",{type:h.type,text:`${p}${h.title}`,src:h.type==="image"?wl(h):void 0,icon:UC[h.type],thread:e.id},n),e.hopAt=n}e.desk.setTray(c.filter(f=>X_[f.type]).reverse().map(f=>It[X_[f.type]]))}}function $C(e){e.preventDefault(),$i=null;let t=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?100:1);e.ctrlKey&&(t*=10);let n=Cs??Kt.position.distanceTo(ae.target);Cs=Ss.clamp(n*Math.pow(.95,-t*.01),ae.minDistance,ae.maxDistance)}function VC(e){if(Cs===null)return;xn.subVectors(Kt.position,ae.target);let t=xn.length(),n=Math.abs(Cs/t-1)<.001||vi()?Cs:t*Math.pow(Cs/t,1-Math.pow(eC,e));Kt.position.copy(ae.target).add(xn.setLength(n)),n===Cs&&(Cs=null)}function GC(){let e=Kt.position.distanceTo(ae.target),t=Math.max(1,e*.1);Math.abs(t-Kt.near)<t*.01||(Kt.near=t,Kt.far=e*3+1500,Kt.updateProjectionMatrix())}function WC(){let e=1-Kt.position.distanceTo(ae.target)/ae.maxDistance,t=Math.max(0,e)*ei.W/2,n=Math.max(0,e)*ei.D/2,i=Ss.clamp(ae.target.x,-t,t)-ae.target.x,s=Ss.clamp(ae.target.z,-n,n)-ae.target.z;!i&&!s||(ae.target.x+=i,ae.target.z+=s,Kt.position.x+=i,Kt.position.z+=s)}function qC(e,t){e-Dl<3||t>=.1||(El=t>1/40?El+1:Math.max(0,El-1),!(El<90||le.getPixelRatio()<=1)&&(le.setPixelRatio(Math.max(1,le.getPixelRatio()-.5)),El=0))}function XC(){let e=r=>{let a=F.get(r.id);return(zi===r.id||Is===r.id?0:a&&!os(a)?1:2)*1e13-qh(a??{})},t=(r,a)=>a.some(o=>r.left<o.right+4&&r.right>o.left-4&&r.top<o.bottom+2&&r.bottom>o.top-2),n=[...Ge.values(),...ge?[ge]:[]].map(r=>r.label.el.getBoundingClientRect());yn.hidden||n.push(yn.getBoundingClientRect());let i=[];for(let r of[...We.values()].sort((a,o)=>e(a)-e(o))){let a=r.label.el;a.classList.remove("crowded","covered");let o=zi===r.id||Is===r.id&&yn.hidden;if(Vi?.id===r.id&&!yn.hidden){a.classList.add("covered");continue}if(!o&&t(a.getBoundingClientRect(),n)){a.classList.add("covered");continue}!o&&t(a.getBoundingClientRect(),i)&&a.classList.add("crowded"),i.push(a.getBoundingClientRect())}let s=yn.hidden?null:yn.getBoundingClientRect();for(let r of[...Ge.values(),...ge?[ge]:[]])r.label.el.classList.toggle("covered",!!(s&&t(r.label.el.getBoundingClientRect(),[s])))}function Um({pixelRatio:e,shadowSize:t}){le&&(le.setPixelRatio(Math.min(e,devicePixelRatio)),gn.shadow.mapSize.x!==t&&(gn.shadow.mapSize.set(t,t),gn.shadow.map?.dispose(),gn.shadow.map=null),le.shadowMap.needsUpdate=!0)}function Om(e){zi=e}function jC(e){for(let t of F.values())if(t.kind==="tool"&&t.status==="active"&&t.owner===e)return t;return null}var Y_=e=>e>=1e6?`${(e/1e6).toFixed(1)}M`:`${Math.round(e/1e3)}k`,ti=(e,t,n="")=>t?`<div><dt>${e}</dt><dd${n?` class="${n}"`:""}>${P(t)}</dd></div>`:"";function YC(e){let t=F.get(e.id);if(!t)return"";let n=jC(t.id),i=ba(t.id)??"",s=t.context?.tokens?qe()?`${Ls(Xe(t))} \xB7 ${Y_(t.context.tokens)} of ${Y_(t.context.window)}`:no(Xe(t)).word:"";if(t.kind==="agent"){let l=F.get(Ct(t.session)),u=Ce.get(t.id),h=t.status!=="done"?t.status==="idle"?"waiting":"working":u?.walk?"finished, heading for coffee":u?.onBreak&&!u.leaving?"finished, on a coffee break":"finished";return`<b><i class="dot ${lr(t.type)}"></i>${P(on(t).title)}</b>
      ${t.description?`<p>${P(t.description)}</p>`:""}
      <dl>${ti("status",h)}${ti("doing",i,"words")}${ti(qe()?"context":"energy",s)}${ti("model",t.model)}${ti("tool calls",t.history?String(t.history):"")}${ti("for",l?.label)}</dl>`}let r=!os(t),a=[...F.values()].filter(l=>l.kind==="agent"&&l.session===t.session&&l.status!=="done").length,o=Un.get(t.id)?.actions[0],c=We.get(t.id)?.away?r?"gone home for the night \xB7 back when there\u2019s work":`ended ${Ae(t.endedAt??t.lastAt)} \xB7 gone home`:r?n||Date.now()-(t.lastAt??0)<tv?"working":`waiting \xB7 last active ${Ae(t.lastAt)}`:`ended ${Ae(t.endedAt??t.lastAt)}`;return`<b><i class="dot ${Ds(t.session)}"></i>${P(Hs(t.prompts?.[0]?.text)||t.label)}</b>
    <p>${P([t.project?fn(t.project,t.projectName):t.projectName,t.gitBranch].filter(Boolean).join(" \xB7 "))}</p>
    <dl>${ti("who",on(t).title)}${ti("status",c)}${ti("doing",i||(o?oo(o):""),"words")}${ti(qe()?"context":"energy",s)}${ti("helpers",a?String(a):"")}${ti("model",t.model)}${ti("cost",t.costUsd!==void 0?`$${t.costUsd.toFixed(2)}`:"")}</dl>`}function KC(e){if(!Vi){yn.hidden=!0;return}let t=jr(Vi.id);if(!t){yn.hidden=!0;return}(e||yn.hidden)&&(yn.innerHTML=YC(Vi));let n=t.add(xn.set(0,Vi.kind==="agent"?6:10,0)).project(Kt);yn.style.left=`${(n.x+1)/2*Re.clientWidth}px`,yn.style.top=`${(1-n.y)/2*Re.clientHeight}px`,yn.hidden=!1}function ZC(){let e=new Do,t=new At,n=s=>{let r=le.domElement.getBoundingClientRect();return t.set((s.clientX-r.left)/r.width*2-1,-((s.clientY-r.top)/r.height)*2+1),e.setFromCamera(t,Kt),e.intersectObjects(ie.children,!0).find(a=>a.object.userData.pick&&a.object.visible)?.object.userData.pick},i=null;le.domElement.addEventListener("pointerdown",s=>{i=[s.clientX,s.clientY]}),le.domElement.addEventListener("pointerup",s=>{if(!i||Math.hypot(s.clientX-i[0],s.clientY-i[1])>4)return;let r=n(s);if(r?.kind==="frontdesk")return void document.dispatchEvent(new CustomEvent("office:frontdesk"));kl(r?.id??null)}),le.domElement.addEventListener("pointermove",s=>{if(s.buttons){Vi=null;return}let r=n(s);Vi=r?.id?r:null,Is=r?r.kind==="session"?r.id:Ce.get(r.id)?.session??null:null,le.domElement.style.cursor=r?"pointer":""}),le.domElement.addEventListener("pointerleave",()=>{Vi=null,Is=null})}function Fm(){let e=Re.getBoundingClientRect(),t=c=>{let l=c.clone().project(Kt);if(l.z>1)return null;let u=(l.x+1)/2*Re.clientWidth,h=(1-l.y)/2*Re.clientHeight;return u<0||h<0||u>Re.clientWidth||h>Re.clientHeight?null:{x:u+e.left,y:h+e.top}},n=c=>{let l=c?.getBoundingClientRect();return l?.width?{x:l.left+l.width/2,y:l.top+l.height/2,w:l.width,h:l.height}:null},i=[...We.values()].filter(c=>F.get(c.id)&&t(c.group.position.clone().add(c.body.position))).sort((c,l)=>!!c.walk-!!l.walk),s=i.find(c=>!os(F.get(c.id))&&[...Ce.values()].some(l=>l.session===c.id&&!l.gone))??i.find(c=>!os(F.get(c.id)))??i[0],r=s&&jr(s.id),a=s&&[...Ce.values()].find(c=>c.session===s.id&&!c.gone&&t(c.group.position)),o=[...Ge.values()].map(c=>n(c.label.el)).find(Boolean);return{critter:s&&t(s.group.position.clone().add(s.body.position).add(xn.set(0,be+ia*s.char.height*.5,0))),beads:r&&t(r.add(xn.set(0,12,0))),ring:s&&!s.walk?t(s.group.position.clone().add(xn.set(0,be,22))):null,helper:a&&t(a.group.position.clone().add(xn.set(0,jh*a.char.height*.6,0))),sign:o,coffee:ge&&n(ge.label.el)}}var K_=new Do;function Bm(e,t){if(!le)return null;let n=le.domElement.getBoundingClientRect();return K_.setFromCamera(new At((e-n.left)/n.width*2-1,-((t-n.top)/n.height)*2+1),Kt),K_.intersectObjects(ie.children,!0).find(i=>i.object.userData.pick&&i.object.visible)?.object.userData.pick?.id??null}function Hm(){le.render(ie,Kt);let e=le.domElement,t=le.getPixelRatio(),n=T_(e.width,e.height,Gi,t),i=document.createElement("canvas");i.width=n.w,i.height=n.h,i.getContext("2d").drawImage(e,n.x,n.y,n.w,n.h,0,0,n.w,n.h);let s=[],r=(a,o,c)=>{if(!o||!a.visible)return;let l=a.getWorldPosition(new L).project(Kt),u=(l.x+1)/2*e.width-n.x,h=(1-l.y)/2*e.height-n.y;l.z>1||u<0||h<0||u>n.w||h>n.h||s.push({x:u,y:h,text:o,kind:c})};for(let[a,o]of Ge)r(o.label.obj,o.label.el.querySelector(".pname")?.textContent||F.get(a)?.label,"room");for(let a of We.values()){let o=F.get(a.id);o&&r(a.label.obj,`${on(o).name}${a.away?" \xB7 home":""}`,"name")}return{shot:i,tags:s,ratio:t}}var JC={setHour(e){Em=e,Zh=-1},get renderer(){return le},get size(){return ei},sessionViews:We,agentViews:Ce,rooms:Ge,get camera(){return Kt},get stage(){return Re},get controls(){return ae},get coffee(){return ge},greeted:Cl};var Yr=e=>(e??"").trim().replace(/\s+/g,"-");function QC(e,t){let n=/(^|\s)@([\w.-]*)$/.exec(e.slice(0,t));return n?{query:n[2],start:t-n[2].length-1}:null}function tI(e,t,n=6){let i=t.toLowerCase(),s=e.filter(a=>Yr(a.name).toLowerCase().startsWith(i)),r=e.filter(a=>!s.includes(a)&&Yr(a.name).toLowerCase().includes(i));return[...s,...r].slice(0,n)}function eI(e,t){let n=[...t].sort((i,s)=>Yr(s.name).length-Yr(i.name).length);for(let i of n){let s=new RegExp(`(^|\\s)@${Yr(i.name).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(?=$|[\\s,.:;!?])[,:]?`,"i");if(s.test(e))return{to:i,text:e.replace(s,"$1").replace(/\s{2,}/g," ").trim()}}return{to:void 0,text:e}}function mv(e){let t=e?.kind==="session"?e:e&&F.get(Ct(e.session));if(!t)return[];let n=[],i=s=>s.forEach(({node:r,children:a})=>{n.push({id:r.id,name:r.label,state:Dn(r),description:r.description}),i(a)});return i(Zi(t)),n.sort((s,r)=>(s.state==="done")-(r.state==="done"))}function sd(e,t){let{to:n,text:i}=eI(t,mv(e));return n?{node:F.get(n.id)??e,text:i||t,to:n}:{node:e,text:t}}function rd(e,t){if(e.dataset.mentions)return;e.dataset.mentions="1";let n=document.createElement("ul");n.className="mentions",n.setAttribute("role","listbox"),n.id=`mentions-${Math.random().toString(36).slice(2,8)}`,n.hidden=!0,e.setAttribute("aria-autocomplete","list"),e.setAttribute("aria-controls",n.id),e.insertAdjacentElement("afterend",n);let i=[],s=0,r=null,a=()=>{n.hidden=!0,i=[],e.removeAttribute("aria-activedescendant")},o=()=>{n.innerHTML=i.map((l,u)=>`<li role="option" id="${n.id}-${u}" aria-selected="${u===s}" data-i="${u}"><b>@${P(Yr(l.name))}</b>${l.description?`<span>${P(l.description)}</span>`:""}${l.state==="done"?"<small>finished \xB7 resumes to answer</small>":""}</li>`).join(""),n.hidden=!i.length,i.length&&e.setAttribute("aria-activedescendant",`${n.id}-${s}`)},c=l=>{let u=i[l];if(!u||!r)return;let h=e.value.slice(0,r.start),f=e.value.slice(e.selectionStart),p=`@${Yr(u.name)} `;e.value=h+p+f.replace(/^\S*/,"");let m=h.length+p.length;e.setSelectionRange(m,m),e.dispatchEvent(new Event("input",{bubbles:!0})),a()};e.addEventListener("input",()=>{r=QC(e.value,e.selectionStart);let l=t();i=r&&l?tI(mv(l),r.query):[],s=0,o()}),e.addEventListener("keydown",l=>{if(!n.hidden){if(l.key==="ArrowDown"||l.key==="ArrowUp")s=(s+(l.key==="ArrowDown"?1:-1)+i.length)%i.length,o();else if((l.key==="Enter"||l.key==="Tab")&&!l.isComposing)c(s);else if(l.key==="Escape")a();else return;l.preventDefault(),l.stopImmediatePropagation()}},!0),n.addEventListener("pointerdown",l=>{let u=l.target.closest("[data-i]");u&&(l.preventDefault(),c(Number(u.dataset.i)))}),e.addEventListener("blur",()=>setTimeout(a,120))}var nI=1500,iI=600,Ul=document.querySelector('meta[name="agent-office-token"]')?.content||"",Kr=!1;function Vm(e){Kr=e}var Gm=()=>Kr,Jt=null,zm=e=>e.kind==="agent"?{session:e.session,agent:e.agent}:{session:e.session},sI=e=>e.kind==="agent"?e.label:"this session";function $m(e,t){let n=e.t?`<time>${Ae(e.t)}</time>`:"";switch(e.kind){case"you":return`<div class="tx you"><p>${P(e.text)}</p>${n}</div>`;case"chat":return`<div class="tx you chat"><span class="tx-from">${e.from==="agent-office"?"From the office":`From ${P(e.from)}`}</span><p>${P(e.text)}</p>${n}</div>`;case"say":return`<div class="tx say"><p>${P(e.text)}</p>${n}</div>`;case"note":return`<div class="tx note">${P(e.text)}</div>`;case"output":return`<div class="tx made ${e.output.type}">${As(e.output)}</div>`;case"todo":{let i=e.items.filter(r=>r.status==="completed").length,s=e.items.find(r=>r.status==="in_progress");return`<details class="tx todo-snap"><summary><span class="todo-ring" style="--f:${(i/e.items.length).toFixed(3)}"></span>${i===e.items.length?"Checked off the last item":`Checklist ${i}/${e.items.length}${s?`: ${P(s.text)}`:""}`}</summary><ol>${e.items.map(r=>`<li class="${r.status}"><i>${{completed:"\u2713",in_progress:"\u2731"}[r.status]??"\u25CB"}</i>${P(r.text)}</li>`).join("")}</ol></details>`}case"ask":return`<div class="tx asked"><p class="ask-eyebrow"><i class="ask-icon">${e.type==="permission"?">_":e.type==="plan"?"\u270E":"?"}</i>${e.type==="permission"?"Asked to run":e.type==="plan"?"Asked you to approve a plan":"Asked you"}</p><p>${P(e.text)}</p>${e.answer?`<span class="tx-answer">${P(e.answer)}</span>`:""}${n}</div>`;case"tool":{let i=t.get(e.id),s=i?i.ok?"ok":"bad":"running",r=`<i class="tx-dot ${s}"></i><b>${P(e.name)}</b> <span>${P(e.summary??"")}</span>`;return i?.text?`<details class="tx tool ${s}" data-id="${P(e.id)}"><summary>${r}</summary><pre>${P(i.text)}</pre></details>`:`<div class="tx tool ${s}">${r}</div>`}default:return""}}function rI(e,t,n){let i=e.map(f=>({tool:f.name,summary:f.summary,ok:t.get(f.id)?.ok??(n?void 0:!0)})),s=i.some(f=>f.ok===void 0),r=i.filter(f=>f.ok===!1).length,a=s?"running":i.at(-1).ok===!1?"bad":"ok",o=i.filter(f=>f.ok!==void 0),c=i.find(f=>f.ok===void 0),l=c&&$s(c.tool,c.summary).now,u=s?o.length?`${pf(o)}, now ${l.charAt(0).toLowerCase()}${l.slice(1)}`:l:pf(i),h=[i.length>1?`${i.length} steps`:"",r&&a!=="bad"?`${r} ${r===1?"bump":"bumps"}`:""].filter(Boolean).join(" \xB7 ");return`<details class="tx steps ${a}" data-id="steps-${P(e[0].id)}"><summary><i class="tx-dot ${a}"></i><span class="step-text">${P(u)}</span>${h?`<small>${h}</small>`:""}</summary><div class="step-lines">${e.map(f=>$m(f,t)).join("")}</div></details>`}function oI(e,t){if(qe())return e.map(r=>$m(r,t)).join("");let n=[],i=[],s=r=>{i.length&&n.push(rI(i,t,r)),i=[]};for(let r of e){if(r.kind==="tool"){i.push(r);continue}s(!1),n.push($m(r,t))}return s(!0),n.join("")}function xv(){Jt&&(Jt.html=null,as())}function aI(e){return`<div class="tx you chat pending ${e.ok===!1?"failed":""}"><span class="tx-from">From the office</span><p>${P(e.text)}</p><span class="tx-status">${P(e.status)}</span></div>`}function as(){if(!Jt?.root.isConnected)return;let e=Jt.root.querySelector(".tx-log"),t=e.scrollHeight-e.scrollTop-e.clientHeight<60,n=new Map(Jt.entries.filter(a=>a.kind==="result").map(a=>[a.id,a])),i=Jt.entries.filter(a=>a.kind!=="result"),s=oI(i,n)+Jt.pending.map(aI).join("")||`<p class="tx-empty">${P(Jt.empty)}</p>`;if(s===Jt.html)return;Jt.html=s;let r=new Set([...e.querySelectorAll("details[open]")].map(a=>a.dataset.id));e.innerHTML=s;for(let a of e.querySelectorAll("details"))r.has(a.dataset.id)&&(a.open=!0);(t||Jt.firstDraw)&&(e.scrollTop=e.scrollHeight),Jt.firstDraw=!1}async function yv(){let e=Jt;if(!e?.root.isConnected)return Wm();if(Kr){e.entries=_v(F.get(e.id)),as();return}if(e.isPolling)return;e.isPolling=!0;let{session:t,agent:n}=e.target,i=new URLSearchParams({session:t,...n?{agent:n}:{},...e.next!==void 0?{after:String(e.next)}:{}});try{let s=await fetch(`/transcript?${i}`);if(s.status===404)e.empty="No transcript yet. It appears once Claude Code has written the first turn.";else if(s.ok){let{entries:r,next:a,reset:o}=await s.json();o&&(e.entries=[]),e.entries=[...e.entries,...r].slice(-iI),e.next=a;for(let c of r)c.kind==="chat"&&(e.pending=e.pending.filter(l=>l.text!==c.text&&!c.text.includes(l.text)));e.empty="Nothing said yet."}}catch{e.empty="The bridge isn't answering. Is it still running?"}finally{e.isPolling=!1}Jt===e&&as()}function Wm(){Jt?.timer&&clearInterval(Jt.timer),Jt=null}function _v(e){if(!e)return[];let t=F.get(Ct(e.session)),i=[...Un.get(Ct(e.session))?.actions??[]].reverse().filter(r=>e.kind==="agent"?r.agent===e.agent:!r.agent),s=e.kind==="agent"?[{kind:"you",text:e.description??`Help with ${t?.label??"the session"}`,t:e.startedAt}]:(e.prompts??[]).map(r=>({kind:"you",text:r.text,t:r.t}));i.forEach(r=>{let a=`demo-${e.id}-${r.t}-${r.tool}`;s.push({kind:"tool",id:a,name:r.tool,summary:r.summary??"",t:r.t}),s.push({kind:"result",id:a,ok:r.ok,text:r.ok?"":"Something went wrong (sample activity)."})});for(let r of ee)r.session!==e.session||(e.kind==="agent"?r.agent!==e.agent:r.agent)||r.type==="plan"||s.push({kind:"output",output:r,t:r.t});for(let r of e.answered??[])s.push(r);return e.todosLog&&s.push(...e.todosLog),s.push(...Ol.get(e.id)??[]),s.sort((r,a)=>(r.t??0)-(a.t??0))}var Ol=new Map;async function vv(e){let t=F.get(Jt.id);if(!t||!e.trim())return;let n={text:e.trim(),status:"Sending\u2026"};Jt.pending.push(n),as();let i=t.kind==="session"?sd(t,e):{node:t};if(i.node!==t){let s=await sa(i.node,i.text);n.ok=s.ok,n.status=s.ok?`Sent to ${i.node.label}. Its answer shows in its own conversation.`:s.status,as();return}if(Kr){document.dispatchEvent(new CustomEvent("office:event",{detail:{kind:"chat.sent",t:Date.now(),...Jt.target,text:n.text}}));let s=Jt.id;setTimeout(()=>{n.status="Queued as the next prompt",as()},500),setTimeout(()=>{let r=Ol.get(s)??[];r.push({kind:"chat",text:n.text,from:"agent-office",t:Date.now()}),r.push({kind:"say",text:"Got it. (This is the demo: nothing really runs, but in your own office the session reads this as its next prompt and answers here.)",t:Date.now()+1}),Ol.set(s,r),Jt?.id===s&&(Jt.pending=Jt.pending.filter(a=>a!==n),Jt.entries=_v(t),as())},1800);return}try{let s=await fetch("/chat",{method:"POST",headers:{"content-type":"application/json","x-agent-office-token":Ul},body:JSON.stringify({...Jt.target,text:n.text})}),r=await s.json().catch(()=>({}));if(!s.ok)throw new Error(r.error??`the bridge answered ${s.status}`);n.id=r.id,n.status="Waiting for the session to pick it up"}catch(s){n.ok=!1,n.status=`Not sent: ${s.message}`}as()}function bv(e){if(!Jt||e.kind!=="chat.delivered")return;let t=Jt.pending.find(n=>n.id===e.id);t&&(t.ok=e.ok!==!1,t.status=t.ok?lI(e.how??"Delivered"):`Couldn't deliver it: ${e.how??"unknown reason"}`,as())}var lI=e=>e.charAt(0).toUpperCase()+e.slice(1);async function sa(e,t){if(!e||!t.trim())return{ok:!1,status:"Nothing to send"};if(Kr){document.dispatchEvent(new CustomEvent("office:event",{detail:{kind:"chat.sent",t:Date.now(),...zm(e),text:t.trim()}}));let n=Ol.get(e.id)??[];return n.push({kind:"chat",text:t.trim(),from:"agent-office",t:Date.now()}),Ol.set(e.id,n),{ok:!0,status:"Queued as the next prompt"}}if(!Ul)return{ok:!1,status:"Messaging needs the office opened from its bridge (run /office)"};try{let n=await fetch("/chat",{method:"POST",headers:{"content-type":"application/json","x-agent-office-token":Ul},body:JSON.stringify({...zm(e),text:t.trim()})}),i=await n.json().catch(()=>({}));if(!n.ok)throw new Error(i.error??`the bridge answered ${n.status}`);return{ok:!0,status:"Sent. It arrives as the next prompt"}}catch(n){return{ok:!1,status:`Not sent: ${n.message}`}}}async function wv(e,t){if(Jt?.id===e.id&&Jt.root.isConnected){await vv(t);let n=Jt?.pending.at(-1);return n?.ok===!1?{ok:!1,status:n.status}:{ok:!0}}return sa(e,t)}var Zr=()=>Kr||!!Ul;function Mv(){let e=Jt?.root.querySelector(".tx-compose textarea");return e?.focus(),!!e}function cI(e){return!Kr&&!Ul?{off:"Messaging needs the office opened from its bridge (run /office)."}:e.kind==="session"&&(e.past||e.status==="done")?{off:"This session has ended. Resume it in Claude Code to talk to it again."}:e.kind==="agent"&&e.status==="done"?{placeholder:`Message ${e.label}\u2026`,hint:"It has finished: a message resumes it to answer, which uses tokens."}:e.kind==="agent"?{placeholder:`Message ${e.label}\u2026`,hint:"Goes straight to this subagent while it works."}:{placeholder:"Message this session\u2026 (@ to pick an agent)",hint:"Arrives as its next prompt, marked as from Agent Office. Tool approvals still happen in Claude Code."}}function Sv(e,t){if(!e||!t||Jt?.id===t.id&&Jt.root===e)return;Wm();let n=cI(t);e.innerHTML=`
    <div class="tx-log" role="log" aria-live="polite" aria-label="Conversation with ${P(sI(t))}"></div>
    ${n.off?`<p class="tx-off">${P(n.off)}</p>`:`<form class="tx-compose">
          <textarea rows="2" placeholder="${P(n.placeholder)}" aria-label="${P(n.placeholder)}"></textarea>
          <button type="submit">Send</button>
          <p class="tx-hint">${P(n.hint)} Enter sends, Shift+Enter starts a new line.</p>
        </form>`}`,Jt={id:t.id,root:e,target:zm(t),entries:[],pending:[],next:void 0,empty:"Reading the transcript\u2026",firstDraw:!0},e.querySelector(".tx-log").addEventListener("click",r=>{let a=r.target.closest("[data-zoom]");a&&(r.preventDefault(),document.dispatchEvent(new CustomEvent("office:zoom",{detail:a.dataset.zoom})))});let i=e.querySelector("form"),s=i?.querySelector("textarea");s&&t.kind==="session"&&rd(s,()=>F.get(t.id)),i?.addEventListener("submit",r=>{r.preventDefault();let a=s.value;s.value="",vv(a)}),s?.addEventListener("keydown",r=>{r.key==="Enter"&&!r.shiftKey&&!r.isComposing&&(r.preventDefault(),i.requestSubmit())}),as(),yv(),Jt.timer=setInterval(()=>{document.hidden||yv()},nI)}var Ev=Wm;var qm=e=>String(e??"").replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),we=null,Fl=null;function ad(){if(!we||we.hidden)return;we.hidden=!0;let e=Fl?.anchor;Fl=null,e?.isConnected&&e.focus({preventScroll:!0})}function uI(e){let t=e?.getBoundingClientRect?.(),n=we.offsetWidth,i=we.offsetHeight,s=t?t.left+t.width/2-n/2:innerWidth/2-n/2,r=t?t.bottom+8:innerHeight/2-i/2,a=r+i>innerHeight-8&&t?t.top-i-8:r;we.style.left=`${Math.max(8,Math.min(innerWidth-n-8,s))}px`,we.style.top=`${Math.max(8,Math.min(innerHeight-i-8,a))}px`}function Tv(){let{id:e,raw:t}=Fl,n=Bs(e,t);we.innerHTML=`
    <p class="eyebrow" id="pe-title">Name and icon</p>
    <form>
      <label class="pe-name"><span>Name</span><input name="name" maxlength="40" autocomplete="off" value="${qm(fn(e,t))}" placeholder="${qm(xr(t))}"></label>
      <div class="pe-icons" role="group" aria-label="Icon">${Zg.map(a=>`<button type="button" data-pick-icon="${a}" aria-pressed="${a===n}" aria-label="Use ${a}">${a}</button>`).join("")}</div>
      <p class="pe-from">From <code>${qm(t)}</code></p>
      <div class="pe-actions">
        <button type="button" data-reset ${nf(e)?"":"disabled"}>Reset</button>
        <button type="submit" class="primary">Done</button>
      </div>
    </form>`;let i=we.querySelector("form"),s=i.elements.name,r=a=>{let o=we.querySelector('[aria-pressed="true"]')?.dataset.pickIcon,c=s.value.trim();sf(e,{name:c&&c!==xr(t)?c:void 0,icon:o&&o!==ef(t)?o:void 0,...a}),we.querySelector("[data-reset]").disabled=!nf(e),document.dispatchEvent(new CustomEvent("office:names"))};s.addEventListener("input",()=>r());for(let a of we.querySelectorAll("[data-pick-icon]"))a.addEventListener("click",()=>{for(let o of we.querySelectorAll("[data-pick-icon]"))o.setAttribute("aria-pressed",String(o===a));r()});we.querySelector("[data-reset]").addEventListener("click",()=>{sf(e,{}),document.dispatchEvent(new CustomEvent("office:names")),Tv(),we.querySelector("input").focus()}),i.addEventListener("submit",a=>{a.preventDefault(),r(),ad()})}function Xm(e,t,n){if(we||(we=document.createElement("div"),we.className="proj-edit paper",we.setAttribute("role","dialog"),we.setAttribute("aria-labelledby","pe-title"),we.hidden=!0,document.body.append(we),we.addEventListener("keydown",s=>{s.key==="Escape"&&(s.stopPropagation(),ad())}),addEventListener("pointerdown",s=>{we.hidden||we.contains(s.target)||s.target.closest?.("[data-edit-project]")||ad()})),!we.hidden&&Fl?.id===e)return ad();Fl={id:e,raw:t,anchor:n},Tv(),we.hidden=!1,uI(n);let i=we.querySelector("input");i.focus(),i.select()}document.addEventListener("office:project-edit",e=>Xm(e.detail.id,e.detail.raw,e.detail.anchor));var hI={wrap:"Please wrap up: finish the step you\u2019re on, don\u2019t start anything new, then tell me in a few plain sentences what\u2019s done, what isn\u2019t, and anything I need to decide.",explain:"Please explain what you did in plain words, for someone who isn\u2019t a developer: what you changed, why, and how I can check it. Keep it short."},Av=4e3,Bl=new Map,oa=null;function dI(e,t){if(!e||["ended","done","failed"].includes(t))return[];let n=["explain","wrap"];return e.kind==="session"&&(t==="working"||t==="asking")&&n.push("stop"),n}var fI={wrap:"Wrap up",explain:"Explain what you did",stop:"Stop"},pI={wrap:"Ask it to finish the step it\u2019s on and sum up",explain:"Ask it to explain its work in plain words",stop:"End the turn it\u2019s running, like pressing Esc in Claude Code"};function Cv(e,t){if(!Zr())return"";let n=dI(e,t);if(!n.length)return"";let i=oa?.id===e.id&&Date.now()<oa.until,s=Bl.get(e.id);return`
    <div class="quick" role="group" aria-label="Quick actions">
      ${n.map(r=>`<button type="button" class="quick-${r} ${r==="stop"&&i?"armed":""}" data-act="${r}" data-node="${P(e.id)}" title="${P(pI[r])}">${r==="stop"&&i?"Stop now?":fI[r]}</button>`).join("")}
    </div>
    ${s?`<p class="quick-note ${s.ok===!1?"bad":""}" role="status">${P(s.text)}</p>`:""}`}var Iv=async()=>({ok:!1,status:"Stop isn\u2019t available here"});function Pv(e){Iv=e}var ra=()=>document.dispatchEvent(new CustomEvent("office:refresh"));async function mI(e,t){if(e==="stop"){if(!(oa?.id===t.id&&Date.now()<oa.until))return oa={id:t.id,until:Date.now()+Av},setTimeout(ra,Av+50),ra();oa=null,Bl.set(t.id,{text:"Stopping\u2026"}),ra();let i=await Iv(t).catch(s=>({ok:!1,status:String(s.message??s)}));return Bl.set(t.id,{ok:i.ok,text:i.ok?"Asked Claude Code to stop this turn. You can tell it what to do next below.":`Couldn\u2019t stop it: ${i.status}`}),ra()}Bl.set(t.id,{text:"Sending\u2026"}),ra();let n=await wv(t,hI[e]);Bl.set(t.id,{ok:n.ok,text:n.ok?`${e==="wrap"?"Asked it to wrap up":"Asked it to explain"}. ${t.kind==="session"?"It reads this when it\u2019s free.":"It goes straight to this agent."}`:n.status}),ra()}var Rv=!1;function kv(){Rv||(Rv=!0,document.addEventListener("click",e=>{let t=e.target.closest?.("[data-act]");if(!t)return;let n=F.get(t.dataset.node);n&&mI(t.dataset.act,n)}))}var Nv="agent-office-spend",gI=.8;function Uv(e){let t=new Date(e);return t.setHours(0,0,0,0),t.getTime()}var yI=e=>Math.max(e.lastAt??0,e.answeredAt??0,e.turnAt??0,e.endedAt??0,e.startedAt??0);function xI(e,t=Date.now()){let n=Uv(t),i=new Set,s=new Map,r=0,a=0;for(let o of e){if(i.has(o.session)||(i.add(o.session),!(o.costUsd>0)||yI(o)<n))continue;let c=o.projectName??o.project?.name??"Elsewhere";s.set(c,(s.get(c)??0)+o.costUsd),r+=o.costUsd,a++}return{total:r,byProject:s,count:a}}function aa(e){return e>=.005?e<10?`About $${e.toFixed(2)}`:`About $${Math.round(e)}`:e>0?"Less than a cent":"Nothing yet"}var ld=e=>`$${(e??0).toFixed(4)}`;function cd(e,t){return t>0?e>=t?"over":e>=t*gI?"near":"ok":"none"}function Km(e,t){let n=cd(e,t),i=`$${t%1?t.toFixed(2):t}`;return n==="near"?`Heads up: ${aa(e).toLowerCase()} of your ${i} for today so far.`:n==="over"?`You\u2019ve passed today\u2019s ${i} limit, at ${aa(e).toLowerCase()}. Sessions keep going; this is only a nudge.`:""}var Qe=_I();function _I(){try{let e=JSON.parse(localStorage.getItem(Nv)??"{}");return{limit:Number(e.limit)>0?Number(e.limit):0,warned:e.warned??null}}catch{return{limit:0,warned:null}}}function Ov(){try{localStorage.setItem(Nv,JSON.stringify(Qe))}catch{}}var ri=null,dn=null,si=null,Dv=0,la={total:0,byProject:new Map,count:0},jm=e=>document.querySelector(e),cr=e=>String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]);function Fv(e){let t=la.byProject.get(e);return t>0?`<p class="room-spend" title="${cr(`${ld(t)} today in ${xr(e)}`)}">${cr(aa(t))} today</p>`:""}function Zm(){let{total:e,count:t}=la,n=cd(e,Qe.limit),i=e>0?`${aa(e)} today`:"Nothing spent today";ri.querySelector(".spend-words").textContent=i,ri.querySelector(".spend-short").textContent=e>0?`$${e<10?e.toFixed(2):Math.round(e)}`:"$0",ri.dataset.state=n,ri.title=`${ld(e)} across ${t} session${t===1?"":"s"} active today${Qe.limit?`, of a $${Qe.limit} daily limit`:""}`,ri.setAttribute("aria-label",`${i}. ${ri.title}`)}function Jm(){let{total:e,byProject:t}=la,n=[...t].sort((a,o)=>o[1]-a[1]),i=cd(e,Qe.limit),s=Qe.limit?Math.min(100,e/Qe.limit*100):0,r=`
    <p class="eyebrow">Spend today</p>
    <p class="spend-big" title="${cr(ld(e))}">${cr(aa(e))}</p>
    ${Qe.limit?`<span class="spend-meter ${i}" title="${Math.round(s)}% of your daily limit"><span style="width:${s.toFixed(1)}%"></span></span>`:""}
    ${Km(e,Qe.limit)?`<p class="spend-warn ${i}">${cr(Km(e,Qe.limit))}</p>`:""}
    ${n.length?`<ul class="spend-rows">${n.map(([a,o])=>`<li title="${cr(ld(o))}"><span>${cr(xr(a))}</span><b>${cr(aa(o))}</b></li>`).join("")}</ul>`:'<p class="spend-note">Nothing yet today.</p>'}
    <h3>Daily limit</h3>
    <form class="spend-limit"><label><span>$</span><input type="number" min="0" step="1" inputmode="decimal" placeholder="none" value="${Qe.limit||""}" aria-label="Daily limit in dollars"></label><span class="spend-note">a day</span><button type="submit">Save</button></form>
    <p class="spend-note">You\u2019ll get a heads-up at 80% of it. Sessions never stop on their own because of it.</p>
    <p class="spend-note">From the cost Claude Code reports for each session active since midnight; a session that started earlier counts in full.</p>`;dn.dataset.html===r||dn.contains(document.activeElement)&&document.activeElement.tagName==="INPUT"||(dn.dataset.html=r,dn.innerHTML=r)}function Bv(){let e=cd(la.total,Qe.limit);if(e!=="near"&&e!=="over")return;let t=new Date(Uv(Date.now())).toDateString();Qe.warned?.day===t&&(Qe.warned.state===e||Qe.warned.state==="over")||(Qe.warned={day:t,state:e},Ov(),si.querySelector("p").textContent=Km(la.total,Qe.limit),si.dataset.state=e,si.hidden=!1,clearTimeout(Dv),Dv=setTimeout(()=>{si.hidden=!0},15e3))}function Hv(e=[]){let t=[...F.values()].filter(n=>n.kind==="session"&&!n.past);la=xI([...t,...e],Date.now()),ri&&(Zm(),dn.hidden||Jm(),Bv())}function Ym(e){dn.hidden=!e,ri.setAttribute("aria-expanded",String(e)),e&&(dn.dataset.html="",Jm(),dn.querySelector("input")?.focus())}function zv(){ri=jm("#spend-open"),dn=jm("#spend"),!(!ri||!dn)&&(si=document.createElement("div"),si.id="spend-toast",si.className="hud paper",si.setAttribute("role","status"),si.hidden=!0,si.innerHTML='<p></p><button type="button">OK</button>',si.querySelector("button").onclick=()=>{si.hidden=!0},jm(".stage-wrap").append(si),ri.addEventListener("click",()=>Ym(dn.hidden)),dn.addEventListener("submit",e=>{e.preventDefault();let t=Number(dn.querySelector("input").value);Qe.limit=t>0?Math.round(t*100)/100:0,Qe.warned=null,Ov(),dn.querySelector("input").blur(),dn.dataset.html="",Jm(),Zm(),Bv()}),addEventListener("keydown",e=>{e.key==="Escape"&&!dn.hidden&&(Ym(!1),ri.focus())}),addEventListener("pointerdown",e=>{!dn.hidden&&!dn.contains(e.target)&&!ri.contains(e.target)&&Ym(!1)}),Zm())}var _n=e=>document.querySelector(e),Hl=e=>e===void 0?"\u2014":e>=1e6?`${(e/1e6).toFixed(2)}M`:`${Math.round(e/1e3)}k`,bI=e=>e===void 0?void 0:`$${e.toFixed(2)}`,oi=(e,t)=>`${e} ${t}${e===1?"":"s"}`,$v=4,wI=3,$l=e=>Hs(e.prompts?.[0]?.text)||e.label,Vl=e=>e.project?fn(e.project,e.projectName):e.projectName??"Elsewhere",Qm=(e,t)=>qe()?`<span class="pct ${ks(e)}">${Ls(e)}</span>`:xa(e,t),ls=e=>e.kind==="session"&&!e.past&&e.status!=="done",Xv={working:"Working",waiting:"Waiting on you",asking:"Needs your answer",stuck:"Needs a look",ended:"Ended",idle:"Idle",done:"Done",failed:"Stopped"},hd=e=>`<span class="pill ${e}">${Xv[e]}</span>`,MI=e=>`${e.from?`<span class="muted from">${e.from==="agent-office"?"From the office":`From ${P(e.from)}`}</span>`:""}${P(e.text)}`;function jv(){let e=new Map;for(let t of F.values()){if(t.kind!=="session")continue;let n=t.project??"Elsewhere";e.has(n)||e.set(n,[]),e.get(n).push(t)}return[...e].map(([t,n])=>{let i=n[0].projectName??"Elsewhere",s=Vl(n[0]),r=n.filter(ls).sort((o,c)=>(o.startedAt??0)-(c.startedAt??0)),a=n.filter(o=>!ls(o)).sort((o,c)=>(c.endedAt??c.lastAt??0)-(o.endedAt??o.lastAt??0)).slice(0,wI);return{id:t,raw:i,name:s,live:r,past:a}}).sort((t,n)=>(n.live.length>0)-(t.live.length>0)||t.name.localeCompare(n.name))}function Yv(){let e=[],t=n=>n.forEach(({node:i,children:s})=>{e.push(i.id),t(s)});for(let n of jv())for(let i of[...n.live,...n.past])e.push(i.id),ls(i)&&t(Zi(i));return e}function SI(e){return[...F.values()].filter(t=>ls(t)&&["asking","waiting","stuck"].includes($e(t,e))).sort((t,n)=>($e(n,e)==="asking")-($e(t,e)==="asking")||(t.answeredAt??t.startedAt??0)-(n.answeredAt??n.startedAt??0))}function EI(e){let t=[...F.values()].filter(ls);if(!t.length)return"Nothing is running. Start a Claude Code session and it walks into the office.";let n=t.filter(a=>$e(a,e)!=="working").length,i=t.length-n,s=[...F.values()].filter(a=>a.kind==="agent"&&Dn(a)==="working").length,r=s?`, with ${oi(s,"agent")} helping`:"";return n?i?`${n} waiting on you, ${i} working${r}.`:`${t.length===1?"Your thread is":`All ${t.length} threads are`} waiting on you.`:`${t.length===1?"Your thread is":`All ${t.length} threads are`} working${r}.`}var eg=()=>!1;function Vv(e,t){let n=$e(e,t);if(n==="asking"){let[a,...o]=Ml(e);return`
    <button class="card-head" data-pick="${P(e.id)}" data-hover="${P(e.id)}" title="Open the conversation">
      <span class="card-where"><i class="dot ${Ds(e.session)}"></i>${P(Vl(e))}${e.thread?'<span class="badge">thread</span>':""}<time>${Ae(a.t)}</time></span>
      <b>${P($l(e))}</b>
    </button>
    ${rm(a,{answerable:eg(a),compact:!0})}
    ${o.length?`<p class="ask-more">${oi(o.length,"more question")} after this one</p>`:""}`}let i=e.answer?.text,s=n==="stuck"?e.lastReason==="aborted"?"You stopped its last turn.":e.lastReason==="refusal"?"Its last turn ended on a refusal.":"Its last turn ended on an error.":n==="working"?"Back at work.":i?xe(i):e.turns?"Done with your last request.":"Ready for its first prompt.",r=i&&n!=="working"?` draggable="true" data-handoff="letter|${P(e.id)}"`:"";return`
    <button class="card-head" data-pick="${P(e.id)}" data-hover="${P(e.id)}"${r} title="${r?"Open the conversation. Drag it onto a critter (or press H) to pass it on":"Open the conversation"}">
      <span class="card-where"><i class="dot ${Ds(e.session)}"></i>${P(Vl(e))}${e.thread?'<span class="badge">thread</span>':""}<time>${Ae(e.answeredAt??e.startedAt)}</time></span>
      <b>${P($l(e))}</b>
      ${am(e)}
      <span class="card-said">${P(s)}</span>
    </button>`}var ud=new Map,dd=new Map;function TI(e){let t=document.createElement("li");t.className="card",t.dataset.card=e.id,t.innerHTML=`
    <div class="card-info"></div>
    <form class="card-reply">
      <textarea rows="1" aria-label="Reply to ${P($l(e))}" placeholder="Reply\u2026 (@ to pick an agent)"></textarea>
      <button type="submit" aria-label="Send reply">\u21B5</button>
      <p class="card-status" hidden></p>
    </form>`;let n=t.querySelector("form"),i=n.querySelector("textarea");return i.value=ud.get(e.id)??"",rd(i,()=>F.get(e.id)),i.addEventListener("input",()=>ud.set(e.id,i.value)),i.addEventListener("keydown",s=>{s.key==="Enter"&&!s.shiftKey&&!s.isComposing&&(s.preventDefault(),n.requestSubmit())}),n.addEventListener("submit",async s=>{s.preventDefault();let r=F.get(e.id),a=i.value;if(!r||!a.trim())return;i.value="",ud.delete(e.id),dd.set(e.id,{status:"Sending\u2026"}),Gv(t,e.id);let o=sd(r,a),c=await sa(o.node,o.text);c.ok&&o.to&&(c.status=`Sent to ${o.node.label}`),dd.set(e.id,c),Gv(t,e.id),c.ok||(i.value=a,ud.set(e.id,a))}),t}function Gv(e,t){let n=dd.get(t),i=e.querySelector(".card-status");i.hidden=!n,n&&(i.textContent=n.status,i.classList.toggle("bad",n.ok===!1))}function AI(e){let t=_n("#inbox"),n=SI(e),i=n.slice(0,$v),s=new Set(i.map(a=>a.id));for(let a of[...t.querySelectorAll("[data-card]")])F.has(a.dataset.card)&&(s.has(a.dataset.card)||a.contains(document.activeElement)||a.querySelector("textarea")?.value)||(a.remove(),dd.delete(a.dataset.card));t.querySelector(".calm")?.remove(),i.forEach((a,o)=>{let c=t.querySelector(`[data-card="${CSS.escape(a.id)}"]`);c||(c=TI(a)),t.children[o]!==c&&!c.contains(document.activeElement)&&t.insertBefore(c,t.children[o]??null),c.classList.remove("gone"),c.classList.toggle("stuck",$e(a,e)==="stuck"),c.classList.toggle("asking",$e(a,e)==="asking"),Wi(c.querySelector(".card-info"),Vv(a,e)),c.querySelector("form").hidden=!Zr()||$e(a,e)==="asking"});for(let a of t.querySelectorAll("[data-card]"))s.has(a.dataset.card)||(a.classList.add("gone"),Wi(a.querySelector(".card-info"),Vv(F.get(a.dataset.card),e)));t.children.length||t.insertAdjacentHTML("beforeend",'<li class="calm">Nothing is waiting on you. Threads land here when they answer.</li>');let r=n.length-i.length;Wi(_n("#inbox-more"),r>0?`<button data-pick="${P(n[$v].id)}">${oi(r,"more thread")} waiting</button>`:""),Wi(_n("#inbox-count"),n.length?String(n.length):"")}function RI(){return hf().slice(0,3).map(e=>{let t=e.kind==="agent"?F.get(Ct(e.session)):null,n=e.kind==="agent"?`${e.label} in ${xe(t?.label??"")}`:xe(e.label);return qe()?`<li><button data-pick="${P(e.id)}"><span class="pct ${ks(Xe(e))}">${Ls(Xe(e))}</span> ${P(n)} will compact soon</button></li>`:`<li><button data-pick="${P(e.id)}">${xa(Xe(e))} ${P(n)} will tidy up its memory soon</button></li>`}).join("")}var zl="all",CI={all:()=>!0,mail:e=>e.tone==="mail",bad:e=>["bad","block","bumps"].includes(e.tone)},Wv={done:"\u2713",made:"\u2726",ask:"?",block:"!",cleared:"\u2713"},tg=new Set;function II(e){let t=Wv[e.tone]?`<i class="mark" aria-hidden="true">${Wv[e.tone]}</i>`:"",n=e.answer?` <em>You picked ${P(xe(e.answer))}.</em>`:"";if(e.tone==="bumps"){let i=`${e.target}|${e.bumps.at(-1)?.t}`;return`<li class="bumps"><details data-bumps="${P(i)}" ${tg.has(i)?"open":""}><summary><span>${P(e.text)}</span><time>${Ae(e.t)}</time></summary>
      <ul>${e.bumps.map(s=>`<li>${P(qe()?s.raw:s.text)}<time>${Ae(s.t)}</time></li>`).join("")}</ul>
      <button data-pick="${P(e.target??"")}">Open the thread</button></details></li>`}return`<li class="${e.tone}"><button data-pick="${P(e.target??"")}"><span>${t}${P(yc(e))}${n}</span><time>${Ae(e.t)}</time></button></li>`}function PI(){let e=Nn.filter(CI[zl]).slice(0,14),t={all:"Quiet so far.",mail:"No messages between agents yet.",bad:"Nothing has gone wrong."}[zl];return e.map(II).join("")||`<li class="muted"><span>${t}</span></li>`}function kI(e,t){let n=Xe(e),i=Dn(e);return`
    <button class="agent-row ${i}" style="--depth:${t}" data-pick="${P(e.id)}" data-hover="${P(e.id)}">
      <i class="dot ${lr(e.type)}"></i>
      <span class="aname">${P(on(e).title)}${e.description&&e.description!==e.label?`<span class="muted"> \xB7 ${P(e.description)}</span>`:""}</span>
      <span class="astate">${e.mailAt&&Date.now()-e.mailAt<8e3?'<i class="env" title="Just got a message">\u2709</i>':""}${i==="working"&&e.context?.tokens?Qm(n,{bare:!0}):`<i class="sdot ${i}" title="${Xv[i]}"></i>`}</span>
    </button>`}var ng=e=>e.reduce((t,n)=>t+1+ng(n.children),0);function LI(e,t=1){let n=0,i=[],s=(r,a)=>{for(let{node:o,children:c}of r){if(Dn(o)==="done"){n+=1+ng(c);continue}i.push(kI(o,a)),s(c,a+1)}};return s(Zi(e),t),n&&i.push(`<p class="folded" style="--depth:${t}">${oi(n,"agent")} finished</p>`),i.join("")}function qv(e,t,n){let i=ls(e),s=$e(e,t),r=Xe(e),a=i?s==="asking"?`asks: ${Ml(e)[0]?.questions?.[0]?.question??Ml(e)[0]?.summary??"a plan to approve"}`:s==="working"?e.todos?.find(o=>o.status==="in_progress")?.text??ba(e.id)??(Un.get(e.id)?.actions[0]?oo(Un.get(e.id).actions[0]):"working"):s==="stuck"?"its last turn didn\u2019t finish":e.answer?.text?`said ${xe(e.answer.text)}`:"ready for you":`ended ${Ae(e.endedAt??e.lastAt)}`;return`
    <div class="thread ${i?"":"past"} ${n===e.id?"on":""}">
      <button class="entry" data-pick="${P(e.id)}" data-hover="${P(e.id)}">
        <i class="dot ${Ds(e.session)}"></i>
        <span class="ename">${P($l(e))}${e.thread?'<span class="badge" title="A claude.ai project\u2019s coordinator handed this session its work">thread</span>':""}</span>
        ${i?hd(s):e.context?.tokens?Qm(r,{bare:!0}):"<span></span>"}
        ${i?am(e):""}
        <span class="estate">${P(on(e).name)} \xB7 ${i&&e.context?.tokens?`${Qm(r)} \xB7 `:""}${P(a)}</span>
      </button>
      ${i?LI(e):""}
    </div>`}function DI(e,t){let n=jv(),i=n.flatMap(r=>r.live),s=i.filter(r=>$e(r,e)==="working").length;return`
    <h2 class="sideh">Projects <small>${i.length?`${s} working \xB7 ${i.length-s} with you`:"none live"}</small></h2>
    ${n.map(r=>`
      <section class="project">
        <p class="room"><button type="button" class="picon room-${yl(r.raw)}" data-edit-project="${P(r.id)}" data-raw="${P(r.raw)}" title="Rename or change the icon" aria-label="Rename ${P(r.name)} or change its icon">${Bs(r.id,r.raw)}</button>${P(r.name)}<small>${r.live.length?oi(r.live.length,"thread"):"earlier"}</small></p>${Fv(r.raw)}
        ${r.live.map(a=>qv(a,e,t)).join("")}
        ${r.past.length?`${r.live.length?'<p class="earlier">Earlier</p>':""}${r.past.map(a=>qv(a,e,t)).join("")}`:""}
      </section>`).join("")||'<p class="muted">No sessions yet. Start Claude Code anywhere and it appears here.</p>'}`}function Gl(e,t="",n=""){return`<p class="line ${n}">${e}${t?`<span class="muted">\xB7 ${t}</span>`:""}</p>`}function NI([e,t]){let n=[t.edits&&oi(t.edits,"edit"),t.reads&&oi(t.reads,"read")].filter(Boolean).join(", ");return`<p class="line mono" title="${P(e)}">${P(e.split(/[\\/]/).slice(-2).join("/"))}<span class="muted">\xB7 ${n}</span></p>`}function UI(e){let t=e.breakdown?.categories?.filter(n=>n.kind==="used"&&n.tokens>0);return t?.length?`<h3>What fills it</h3>${[...t].sort((n,i)=>i.tokens-n.tokens).slice(0,6).map(n=>Gl(P(n.name),Hl(n.tokens))).join("")}`:""}function OI(e){return e.rateLimits?.length?e.rateLimits.map(t=>Gl(`${P(t.kind.replace("_"," "))} limit`,`${Math.round(t.percentUsed)}% used`)).join(""):""}var FI={fresh:"Plenty of room to think.",busy:"Has a fair bit on its mind.",full:"Its memory of this conversation is filling up.",tired:"Nearly out of room. It will tidy up its memory soon, and keep going."};function Kv(e,t,n){if(!e.context?.tokens)return"";let i=Xe(e);if(!qe()){let s=no(i),r=`${Ls(i)} of ${n} context window ${t?"is":"was"} in use: ${Hl(e.context.tokens)} of ${Hl(e.context.window)} tokens`;return`
    <div class="dgauge" title="${P(r)}"><span class="big energy-word ${s.key}">${s.word}</span><span>${t?FI[s.key]:"When it ended."}</span></div>
    <span class="meter energy-bar" title="${P(r)}"><span class="${s.key}" style="width:${(Math.max(.04,1-i)*100).toFixed(1)}%"></span></span>
    ${e.compactions?.length?`<p class="dmeta">Tidied up its memory ${oi(e.compactions.length,"time")}</p>`:""}`}return`
    <div class="dgauge"><span class="big ${ks(i)}">${Ls(i)}</span><span>of ${n} context window ${t?"is":"was"} in use${t&&i>=zs?". It will compact soon.":"."}</span></div>
    <span class="meter"><span class="${ks(i)}" style="width:${(i*100).toFixed(1)}%"></span></span>
    <p class="dmeta">${Hl(e.context.tokens)} of ${Hl(e.context.window)} tokens${e.compactions?.length?` \xB7 compacted ${oi(e.compactions.length,"time")}`:""}</p>`}function BI(e){let t=va(e),n=[`<button data-back>${P(t[0]?Vl(t[0]):"Projects")}</button>`];return t.slice(0,-1).forEach(i=>n.push(`<button data-pick="${P(i.id)}">${P(i.kind==="agent"?on(i).name:i.label)}</button>`)),`<nav class="crumbs" aria-label="Where this is">${n.join('<span aria-hidden="true">\u203A</span>')}</nav>`}function HI(e){let t=e.kind==="session"?e:F.get(Ct(e.session)),n=df(t).filter(i=>e.kind==="session"||i.from===e.id||i.to===e.id).slice(0,5);return n.length?`<h3>Messages</h3>${n.map(i=>`
    <p class="mail"><b>${P(i.fromName??"Someone")} \u2192 ${P(i.toName??"someone")}</b>${i.text?`<span>${P(yc(i))}</span>`:""}<time>${Ae(i.t)}</time></p>`).join("")}`:""}function zI(e,t){let n=e.kind==="session"?e:F.get(Ct(e.session));if(!n)return"";if(!ls(n))return`<h3>Who helped</h3>${(n.pastAgents??[]).map(a=>Gl(`<i class="dot ${lr(a.type)}"></i>${P(a.label??a.type)}`,P(a.description??""))).join("")||'<p class="muted">No subagents.</p>'}`;let i=[],s=(r,a)=>r.forEach(({node:o,children:c})=>{let l=Dn(o),u=[o.teammate?"teammate":o.fork?"fork":o.background?"background":"",o.name?"":o.type].filter(Boolean).join(" \xB7 ");i.push(`
      <button class="member ${o.id===e.id?"on":""}" style="--depth:${a}" data-pick="${P(o.id)}" data-hover="${P(o.id)}">
        <i class="dot ${lr(o.type)}"></i>
        <span class="mname">${P(on(o).title)}${u?`<small>${P(u)}</small>`:""}</span>
        ${hd(l)}
        <span class="mdesc">${P(o.description??"")}${o.context?.tokens?qe()?` \xB7 ${Ls(Xe(o))} of its window`:` \xB7 ${no(Xe(o)).word}`:""}</span>
      </button>`),s(c,a+1)});return s(Zi(n),1),`
    <button class="member lead ${n.id===e.id?"on":""}" style="--depth:0" data-pick="${P(n.id)}">
      <i class="dot ${Ds(n.session)}"></i>
      <span class="mname">${P(on(n).title)}<small>the main conversation</small></span>
      ${hd($e(n,t))}
      <span class="mdesc">${n.model?P(n.model):""}</span>
    </button>
    ${i.join("")||'<p class="muted">No agents yet. When the lead hands work off, its agents appear here.</p>'}
    ${HI(e)}`}function $I(e){let t=ls(e),n=Un.get(e.id),i=n?[...n.files].sort((r,a)=>a[1].edits*3+a[1].reads-(r[1].edits*3+r[1].reads)).slice(0,8):[],s=[e.turns!==void 0&&oi(e.turns,"turn"),e.toolCalls!==void 0&&oi(e.toolCalls,"tool call"),e.errors&&oi(e.errors,"error"),bI(e.costUsd),e.model].filter(Boolean).join(" \xB7 ");return`
    ${Kv(e,t,"its")}
    ${s?`<p class="dmeta">${P(s)}</p>`:""}
    ${t?UI(e)+OI(e):""}
    ${i.length?`<h3>Files it has worked on</h3>${i.map(NI).join("")}`:""}
    ${n?.actions.length?`<h3>Recently</h3>${n.actions.slice(0,8).map(r=>Gl(P(oo(r)),Ae(r.t),r.ok?"":"bad")).join("")}`:""}
    ${e.prompts?.length?`<h3>What you asked</h3>${[...e.prompts].reverse().slice(0,6).map(r=>Gl(MI(r),Ae(r.t))).join("")}`:""}
    ${GI(e)}`}var VI=e=>new Date(e).toLocaleDateString(void 0,{month:"short",day:"numeric"});function GI(e){if(!e.project)return"";let t=b_(Oh(),e.project),n=t.filter(i=>i.at).length;return`<h3>Milestones <small class="muted">${P(Vl(e))} \xB7 ${n} of ${t.length}</small></h3>
    <ul class="milestones">${t.map(i=>`
      <li class="${i.at?"got":""}"><i aria-hidden="true">${i.at?"\u2605":"\u2606"}</i><span>${P(i.title)}${i.note?`<small>${P(i.note)}</small>`:""}</span><time>${i.at?VI(i.at):i.goal>1?`${i.have.toLocaleString()} of ${i.goal.toLocaleString()}`:"not yet"}</time></li>`).join("")}
    </ul>`}function WI(e){let t=[e.model,e.history?oi(e.history,"tool call"):"",e.cwd?`in ${e.cwd}`:""].filter(Boolean).join(" \xB7 ");return`
    ${Kv(e,Dn(e)!=="done","its own")}
    ${t?`<p class="dmeta">${P(t)}</p>`:""}
    ${e.answer?.text?`<h3>Last report</h3><p class="line">${P(e.answer.text)}</p>`:""}`}function qI(e,t){let n=e.kind==="agent",i=n?Dn(e):$e(e,t),s=n?[e.description,e.teammateId??(e.teammate?"teammate":""),e.fork?"fork of its parent":e.background?"in the background":""].filter(Boolean).join(" \xB7 "):[on(e).title,e.thread?"Thread of a claude.ai project":"",e.gitBranch,ls(e)?"":`ended ${Ae(e.endedAt??e.lastAt)}`].filter(Boolean).join(" \xB7 ");return`
    ${BI(e)}
    <h2 class="dtitle"><i class="dot ${n?lr(e.type):Ds(e.session)}"></i>${P(n?on(e).title:$l(e))}</h2>
    <p class="dmeta">${hd(i)} ${P(s)}</p>
    ${_h(e.todos,{big:!0})}
    ${Cv(e,i)}`}function Zv(e,t){if(e.nodeType!==t.nodeType||e.nodeName!==t.nodeName){e.replaceWith(t);return}if(e.nodeType===Node.ELEMENT_NODE&&e.hasAttribute("data-keep")&&e.getAttribute("data-keep")===t.getAttribute("data-keep"))return;if(e.nodeType!==Node.ELEMENT_NODE){e.nodeValue!==t.nodeValue&&(e.nodeValue=t.nodeValue);return}for(let{name:i}of[...e.attributes])t.hasAttribute(i)||e.removeAttribute(i);for(let{name:i,value:s}of[...t.attributes])e.getAttribute(i)!==s&&e.setAttribute(i,s);let n=[...t.childNodes];for(n.forEach((i,s)=>{let r=e.childNodes[s];r?Zv(r,i):e.append(i)});e.childNodes.length>n.length;)e.lastChild.remove()}function Wi(e,t){if(e._html===t)return;e._html=t;let n=e.cloneNode(!1);n.innerHTML=t,Zv(e,n)}var Jv=[["transcript","Conversation"],["outputs","Outputs"],["team","Team"],["details","Details"]],qi="transcript",tn=null;function fd(e){Jv.some(([t])=>t===e)&&(qi=e,tn&&Xn(tn))}function XI(e,t){let n=e.kind==="session"?e:F.get(Ct(e.session)),i=n&&ls(n)?ng(Zi(n)):n?.pastAgents?.length??0,s=i_(e),r=u=>u==="team"&&i?`<small>${i}</small>`:u==="outputs"&&s?`<small>${s}</small>`:"",a=([u,h],f)=>`<button type="button" role="tab" id="tab-${u}" aria-controls="tabpanel" tabindex="${qi===u?0:-1}" class="tab ${qi===u?"on":""}" aria-selected="${qi===u}" data-tab="${u}" title="${h} (${f+1})">${h}${r(u)}</button>`,o=Ml(n??e).filter(u=>e.kind==="session"||u.who?.id===e.id),c=o.map(u=>rm(u,{answerable:eg(u)})).join("")+om(e,{open:!o.length}),l=qi==="transcript"?`${c?`<div class="pinned">${c}</div>`:""}<div class="transcript" data-keep="${P(e.id)}"></div>`:qi==="outputs"?n_(e):qi==="team"?zI(e,t):e.kind==="agent"?WI(e):$I(e);return`${qI(e,t)}<div class="tabs" role="tablist" aria-label="About this ${e.kind==="agent"?"agent":"thread"}">${Jv.map(a).join("")}</div><div class="tabpanel" role="tabpanel" id="tabpanel" aria-labelledby="tab-${qi}">${l}</div>`}var Jr=!1,Ns=null;document.addEventListener("office:answered",()=>{tn&&Xn(tn)});document.addEventListener("office:refresh",()=>{tn&&Xn(tn)});document.addEventListener("office:zoom",e=>{Ns=e.detail,tn&&Xn(tn)});addEventListener("keydown",e=>{e.key==="Escape"&&(Ns||Jr)&&(Ns?Ns=null:Jr=!1,tn&&Xn(tn))});function Xn(e){tn=e;let{running:t,selected:n,pick:i,hover:s,answer:r}=e;eg=l=>!!r?.can(l),Wi(_n("#now"),`<p>${P(EI(t))}</p>`),AI(t),Wi(_n("#full"),RI());for(let l of document.querySelectorAll("[data-feed]"))l.classList.toggle("on",l.dataset.feed===zl),l.setAttribute("aria-pressed",String(l.dataset.feed===zl));Wi(_n("#moments"),PI());let a=n&&F.get(n),o=a&&(a.kind==="agent"||a.kind==="session");_n("#side").classList.toggle("clipboard",!!o),_n("#side").classList.toggle("talking",!!o&&qi==="transcript"),Wi(_n("#side"),o?XI(a,t):DI(t,n)),o&&qi==="transcript"?Sv(_n("#side .transcript"),a):Ev();let c=ee.filter(l=>l.type!=="file").length;Wi(_n("#library-count"),String(c||"")),_n("#library").hidden=!Jr,Jr&&Wi(_n("#library"),s_()),_n("#lightbox").hidden=!Ns,Ns&&Wi(_n("#lightbox"),o_(Ns));for(let l of document.querySelectorAll("[data-tab]"))l.onclick=()=>fd(l.dataset.tab);for(let l of document.querySelectorAll("[data-feed]"))l.onclick=()=>{zl=l.dataset.feed,Xn(tn)};for(let l of document.querySelectorAll("[data-bumps]"))l.ontoggle=()=>{l.open?tg.add(l.dataset.bumps):tg.delete(l.dataset.bumps)};for(let l of document.querySelectorAll("[data-pick]"))l.onclick=()=>l.dataset.pick&&i(l.dataset.pick);for(let l of document.querySelectorAll("[data-back]"))l.onclick=()=>i(null);for(let l of document.querySelectorAll("[data-edit-project]"))l.onclick=u=>{u.stopPropagation(),Xm(l.dataset.editProject,l.dataset.raw,l)};_n("#library-open").onclick=()=>{Jr=!Jr,Xn(tn)},_n("#lightbox").onclick=()=>{Ns=null,Xn(tn)};for(let l of document.querySelectorAll("[data-library]"))l.onclick=()=>{Jr=!1,Xn(tn)};for(let l of document.querySelectorAll("[data-shelf]"))l.onclick=()=>{r_(l.dataset.shelf),Xn(tn)};for(let l of document.querySelectorAll("[data-zoom]"))l.onclick=u=>{u.preventDefault(),Ns=l.dataset.zoom,Xn(tn)};qx(document,{find:l=>ee.find(u=>`${u.session}|${u.id}`===l),redraw:()=>Xn(tn)});for(let l of document.querySelectorAll("[data-hover]"))l.onpointerenter=()=>s(l.dataset.hover),l.onpointerleave=()=>s(null)}function Qv(){if(tn?.selected)return qi!=="transcript"&&fd("transcript"),Mv();let e=document.querySelector("#inbox .card:not(.gone) textarea");return e?.focus(),!!e}var YI=e=>{let t=new Date(e);return t.setHours(0,0,0,0),t.getTime()},bi=(e,t,n=`${t}s`)=>`${e} ${e===1?t:n}`,ig=e=>e.prompts?.[0]?.text??e.label??"A thread",KI=["artifact","plan","link"],tb={asking:"needs your answer",waiting:"is waiting on your reply",stuck:"stopped on a problem"};function eb({nodes:e,outputs:t,helpers:n=[],now:i=Date.now(),stateOf:s}){let r=YI(i),a=[...e].filter(d=>d.kind==="session"),o=d=>a.find(_=>_.session===d),c=d=>!d.past&&d.status!=="done",l=a.filter(d=>c(d)||(d.endedAt??d.lastAt??0)>=r),u=t.filter(d=>d.t>=r),h=u.filter(d=>d.type!=="file"),f=new Map;for(let d of u)d.type==="file"&&f.set(d.path??d.id,d);let p=l.filter(d=>!c(d)||d.todos?.length&&d.todos.every(_=>_.status==="completed")&&s?.(d)!=="working"),m=l.filter(c).map(d=>({n:d,state:s?.(d)})).filter(d=>d.state in tb).map(({n:d,state:_})=>({id:d.id,title:ig(d),project:d.projectName,state:_,words:tb[_]})),y=new Map;for(let d of n)d.t>=r&&y.set(d.type,(y.get(d.type)??0)+1);let g=d=>l.reduce((_,w)=>_+(w[d]??0),0);return{day:r,shipped:h.map(d=>({type:d.type,title:d.title,url:d.url,session:d.session,thread:ig(o(d.session)??{})})),prs:h.filter(d=>d.type==="pr").length,docs:h.filter(d=>KI.includes(d.type)).length,pictures:h.filter(d=>d.type==="image").length,files:f.size,added:[...f.values()].reduce((d,_)=>d+(_.meta?.additions??0),0),removed:[...f.values()].reduce((d,_)=>d+(_.meta?.deletions??0),0),finished:p.map(d=>({id:d.id,title:ig(d),project:d.projectName})),waiting:m,helpers:[...y].map(([d,_])=>({type:d,count:_})).sort((d,_)=>_.count-d.count||d.type.localeCompare(_.type)),threads:l.length,asked:l.reduce((d,_)=>d+(_.prompts??[]).filter(w=>w.t>=r).length,0),turns:g("turns"),toolCalls:g("toolCalls"),errors:g("errors")}}function pd(e){let t=[],n=e.shipped.length;if(n&&t.push(`${bi(n,"thing")} shipped`),e.finished.length&&t.push(`${bi(e.finished.length,"thread")} wrapped up`),!t.length)return e.threads?"Nothing shipped yet today, but the work is moving.":"A quiet day so far.";let i=n>=5||e.finished.length>=3?"A good day: ":"",s=t.join(" and ");return`${i}${i?s:s.charAt(0).toUpperCase()+s.slice(1)}.`}function md(e){let t=[e.prs&&bi(e.prs,"pull request"),e.docs&&bi(e.docs,"doc"),e.pictures&&bi(e.pictures,"picture")].filter(Boolean),n=t.length>1?`${t.slice(0,-1).join(", ")} and ${t.at(-1)}`:t[0]??"",i=e.files?`${n?"; ":""}${bi(e.files,"file")} changed${e.added||e.removed?` (+${e.added} \u2212${e.removed} lines)`:""}`:"";return`${n}${i}`||"Nothing yet."}function gd(e){if(!e.helpers.length)return"No helpers today; the threads did it on their own.";let t=e.helpers.reduce((n,i)=>n+i.count,0);return`${bi(t,"helper")}: ${e.helpers.map(n=>n.count>1?`${n.type} \xD7${n.count}`:n.type).join(", ")}.`}function yd(e){if(!e.threads)return"No threads ran today.";let t=e.asked?`You asked for ${bi(e.asked,"thing")} across ${bi(e.threads,"thread")}`:`${bi(e.threads,"thread")} ran`,n=e.turns?`, in ${bi(e.turns,"back-and-forth","back-and-forths")}`:"",i=e.toolCalls?` Claude took ${bi(e.toolCalls,"step")} to do it: reading, editing, searching and running things`:"",s=e.toolCalls&&e.errors?`; ${e.errors} hit a snag along the way.`:e.toolCalls?".":"";return`${t}${n}.${i}${s}`}var xd=e=>new Date(e).toLocaleDateString(void 0,{weekday:"long",day:"numeric",month:"long"});function nb(e){let t=[`Today in the office: ${xd(e.day)}`,pd(e),""];t.push("What shipped",`  ${md(e)}`);for(let n of e.shipped.filter(i=>i.type!=="image").slice(0,12))t.push(`  - ${n.title}${n.url?` (${n.url})`:""}`);return t.push("","Wrapped up"),t.push(...e.finished.length?e.finished.map(n=>`  - ${n.title}`):["  Nothing yet."]),t.push("","Waiting on you"),t.push(...e.waiting.length?e.waiting.map(n=>`  - ${n.title} ${n.words}`):["  Nothing. You\u2019re all caught up."]),t.push("","Who helped",`  ${gd(e)}`,"","The work",`  ${yd(e)}`),t.join(`
`)}var ZI=10*6e4,JI=2*6e4;function ib(e,{now:t=Date.now(),lastBusyAt:n=0,offeredDay:i=null}={}){if(i===e.day||!e.shipped.length&&!e.finished.length)return!1;let s=t-n;return s>=ZI||new Date(t).getHours()>=17&&s>=JI}var Us=e=>document.querySelector(e),vd=8,sb="agent-office:recap-offered",QI=45e3,rb=()=>{},bd=0,ob=Date.now(),ql=null,Wl="",db={get(){try{return Number(localStorage.getItem(sb))||null}catch{return null}},set(e){try{localStorage.setItem(sb,String(e))}catch{}}},wd=(e=new Set)=>eb({nodes:F.values(),outputs:ee,helpers:vr,stateOf:t=>$e(t,e)}),fb={pr:"leaf",artifact:"lilac",plan:"sky",link:"teal",image:"mustard"};function _d(e,t,n=""){return`<div class="rc-tile ${n}"><b>${e}</b><span>${t}</span></div>`}function tP(e){let t=e.shipped.filter(n=>n.type!=="image");return`
    <header class="rc-head">
      <p class="eyebrow">Today in the office</p>
      <h2 id="recap-title">${P(xd(e.day))}</h2>
      <p class="rc-headline">${P(pd(e))}</p>
      <button type="button" class="lib-close rc-close" data-recap="close" aria-label="Close">\xD7</button>
    </header>
    <div class="rc-tiles">
      ${_d(e.shipped.length,"shipped","ok")}${_d(e.finished.length,"wrapped up")}${_d(e.waiting.length,"waiting on you",e.waiting.length?"warn":"")}${_d(e.helpers.reduce((n,i)=>n+i.count,0),"helpers")}
    </div>
    <section class="rc-sec">
      <h3>What shipped</h3>
      <p class="rc-line">${P(md(e))}</p>
      ${t.length?`<ul class="rc-list">${t.slice(0,vd).map(n=>`
        <li><i class="rc-kind ${fb[n.type]??""}">${wh[n.type]?.icon??"\u2022"}</i>${n.url?`<a href="${P(n.url)}" target="_blank" rel="noopener">${P(n.title)}</a>`:`<span>${P(n.title)}</span>`}<small>${P(n.thread)}</small></li>`).join("")}</ul>
      ${t.length>vd?`<p class="rc-more">and ${t.length-vd} more in the Library</p>`:""}`:""}
    </section>
    ${e.finished.length?`<section class="rc-sec"><h3>Wrapped up</h3><ul class="rc-list plain">${e.finished.map(n=>`<li><i class="rc-check">\u2713</i><button type="button" data-recap-pick="${P(n.id)}">${P(n.title)}</button></li>`).join("")}</ul></section>`:""}
    <section class="rc-sec">
      <h3>Waiting on you</h3>
      ${e.waiting.length?`<ul class="rc-list plain">${e.waiting.map(n=>`<li><i class="rc-dot ${n.state}"></i><button type="button" data-recap-pick="${P(n.id)}">${P(n.title)}</button><small>${P(n.words)}</small></li>`).join("")}</ul>`:'<p class="rc-line">Nothing. You\u2019re all caught up.</p>'}
    </section>
    <section class="rc-sec"><h3>Who helped</h3><p class="rc-line">${P(gd(e))}</p></section>
    <section class="rc-sec"><h3>The work</h3><p class="rc-line">${P(yd(e))}</p></section>
    <footer class="rc-foot">
      <button type="button" class="dv-btn primary" data-recap="copy">Copy as text</button>
      <button type="button" class="dv-btn" data-recap="image">Save as image</button>
      <span class="rc-status" role="status">${P(Wl)}</span>
    </footer>`}function eP(){let e=getComputedStyle(document.documentElement),t=n=>e.getPropertyValue(n).trim();return{paper:t("--paper"),bg:t("--bg"),ink:t("--ink"),muted:t("--muted"),line:t("--line"),accent:t("--accent"),ok:t("--ok"),warn:t("--warn"),leaf:t("--leaf"),lilac:t("--lilac"),sky:t("--sky"),teal:t("--teal"),mustard:t("--mustard"),serif:t("--serif"),sans:t("--sans"),mono:t("--mono")}}function nP(e,t,n){let i=[],s="";for(let r of t.split(/\s+/)){let a=s?`${s} ${r}`:r;e.measureText(a).width>n&&s?(i.push(s),s=r):s=a}return s&&i.push(s),i}function ab(e,t,n){if(e.measureText(t).width<=n)return t;let i=t;for(;i.length>1&&e.measureText(`${i}\u2026`).width>n;)i=i.slice(0,-1);return`${i.trimEnd()}\u2026`}function lb(e,t,n,i){let o=36,c=(m,y,g,d,_,w="left")=>{i&&(e.font=d,e.fillStyle=_,e.textAlign=w,e.fillText(m,y,g))},l=(m,y,g,d)=>{e.font=y;for(let _ of nP(e,m,528))o+=d,c(_,36,o,y,g)},u=m=>{o+=26,c(m.toUpperCase(),36,o,`500 10.5px ${n.mono}`,n.muted)};c("TODAY IN THE OFFICE",36,o+10,`500 11px ${n.mono}`,n.accent),o+=10,o+=36,c(xd(t.day),36,o,`600 28px ${n.serif}`,n.ink),o+=4,l(pd(t),`400 16px ${n.serif}`,n.muted,23),o+=18;let h=[[t.shipped.length,"shipped",n.ok],[t.finished.length,"wrapped up",n.ink],[t.waiting.length,"waiting on you",t.waiting.length?n.accent:n.ink],[t.helpers.reduce((m,y)=>m+y.count,0),"helpers",n.ink]],f=498/4;h.forEach(([m,y,g],d)=>{let _=36+d*(f+10);i&&(e.fillStyle=n.bg,e.beginPath(),e.roundRect(_,o,f,66,10),e.fill()),c(String(m),_+12,o+34,`600 26px ${n.serif}`,g),c(y,_+12,o+54,`500 11.5px ${n.sans}`,n.muted)}),o+=66,u("What shipped"),l(md(t),`400 13.5px ${n.sans}`,n.ink,20);let p=t.shipped.filter(m=>m.type!=="image").slice(0,vd);for(let m of p)o+=26,i&&(e.fillStyle=n[fb[m.type]]||n.muted,e.beginPath(),e.roundRect(36,o-14,18,18,4),e.fill()),c(wh[m.type]?.icon??"\u2022",45,o,`700 11px ${n.sans}`,"#fff","center"),e.font=`500 13.5px ${n.sans}`,c(ab(e,m.title??"",528*.6),64,o,`500 13.5px ${n.sans}`,n.ink),e.font=`400 11.5px ${n.sans}`,c(ab(e,m.thread??"",528*.34),564,o,`400 11.5px ${n.sans}`,n.muted,"right");return t.finished.length&&(u("Wrapped up"),l(t.finished.map(m=>m.title).join(" \xB7 "),`400 13.5px ${n.sans}`,n.ink,20)),u("Waiting on you"),l(t.waiting.length?t.waiting.map(m=>`${m.title} ${m.words}`).join(" \xB7 "):"Nothing. You\u2019re all caught up.",`400 13.5px ${n.sans}`,n.ink,20),u("Who helped"),l(gd(t),`400 13.5px ${n.sans}`,n.ink,20),u("The work"),l(yd(t),`400 13.5px ${n.sans}`,n.ink,20),o+=30,i&&(e.strokeStyle=n.line,e.setLineDash([4,4]),e.beginPath(),e.moveTo(36,o-14),e.lineTo(564,o-14),e.stroke(),e.setLineDash([])),c("Agent Office",36,o+4,`600 13px ${n.serif}`,n.ink),c("made on your own computer",564,o+4,`400 11px ${n.sans}`,n.muted,"right"),o+36}function iP(e){let t=eP(),n=2,i=document.createElement("canvas"),s=i.getContext("2d");s.font=`400 13px ${t.sans}`;let r=lb(s,e,t,!1);return i.width=600*n,i.height=Math.ceil(r*n),s.scale(n,n),s.fillStyle=t.paper,s.fillRect(0,0,600,r),s.fillStyle=t.accent,s.fillRect(0,0,600,5),s.textBaseline="alphabetic",lb(s,e,t,!0),i}function sP(e){iP(e).toBlob(n=>{if(!n)return rg("Couldn\u2019t make the picture.");let i=document.createElement("a");i.href=URL.createObjectURL(n);let s=new Date(e.day);i.download=`agent-office-${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}-${String(s.getDate()).padStart(2,"0")}.png`,document.body.append(i),i.click(),i.remove(),setTimeout(()=>URL.revokeObjectURL(i.href),2e3),rg("Saved as a picture.")},"image/png")}function rg(e){Wl=e,Md(),setTimeout(()=>{Wl===e&&(Wl="",Md())},2400)}var cb=0,ub="";function Md(e=!0){let t=Us("#recap");if(!t?.open||!e&&Date.now()-cb<5e3)return;let n=tP(wd());if(n===ub)return;let i=t.querySelector(".rc-body"),s=document.activeElement,r=i.contains(s)&&(s.dataset.recap?`[data-recap="${s.dataset.recap}"]`:s.dataset.recapPick?`[data-recap-pick="${CSS.escape(s.dataset.recapPick)}"]`:null);i.innerHTML=n,ub=n,cb=Date.now(),r&&i.querySelector(r)?.focus()}function hb(){let e=Us("#recap");pb(),e.open||e.showModal(),Wl="",Md(),e.querySelector('[data-recap="copy"]')?.focus()}function sg(){Us("#recap")?.close()}function pb(){let e=Us("#recap-offer");e&&(e.hidden=!0)}function rP(e){ql=e,bd||db.set(e);let t=Us("#recap-offer");t&&(t.hidden=!1)}function og(){bd||=Date.now(),ql=null}function mb({onPick:e,demo:t=!1}){rb=e,ql=db.get(),t&&og(),Us("#recap-open").addEventListener("click",hb);let n=Us("#recap");n.addEventListener("keydown",i=>{i.key==="Escape"&&i.stopPropagation()}),n.addEventListener("click",async i=>{if(i.target===n)return sg();let s=i.target.closest("[data-recap]")?.dataset.recap,r=i.target.closest("[data-recap-pick]")?.dataset.recapPick;s==="close"?sg():s==="copy"?rg(await em(nb(wd()))?"Copied. Paste it anywhere.":"Couldn\u2019t copy here."):s==="image"?sP(wd()):r&&(sg(),rb(r))}),Us("#recap-offer").addEventListener("click",i=>{let s=i.target.closest("[data-offer]")?.dataset.offer;s==="open"?hb():s==="later"&&pb()})}function gb(e){let t=Date.now();if([...F.values()].filter(s=>s.kind==="session"&&!s.past&&s.status!=="done").some(s=>$e(s,e)==="working")&&(ob=t),Us("#recap")?.open)return Md(!1);let i=wd(e);ql!==i.day&&(bd?t-bd>QI&&i.shipped.length:ib(i,{now:t,lastBusyAt:ob,offeredDay:ql}))&&rP(i.day)}var Xl=[],Os=null,jn=null,Ed=null;function ag(){if(jn)return!0;if(Os)return!1;Os=document.getElementById("settings-open");let e=document.getElementById("settings");return!Os||!e?!1:(jn=e,Ed=jn.querySelector(".set-rows")??jn.appendChild(Object.assign(document.createElement("div"),{className:"set-rows"})),Os.setAttribute("aria-haspopup","true"),Os.addEventListener("click",()=>jn.hidden?aP():Sd()),Ed.addEventListener("change",t=>{let n=Xl.find(i=>i.id===t.target.dataset.setting);n&&(n.set(t.target.checked),lg())}),jn.addEventListener("click",t=>{t.target.closest("#alerts-open, #tour-open")&&Sd()}),jn.addEventListener("keydown",t=>{t.key==="Escape"&&(t.stopPropagation(),Sd(),Os.focus())}),addEventListener("pointerdown",t=>{!jn.hidden&&!jn.contains(t.target)&&!Os.contains(t.target)&&Sd()}),!0)}function lg(){Ed&&(Ed.innerHTML=Xl.map(e=>{let t=e.disabled?.()??!1,n=typeof e.hint=="function"?e.hint():e.hint;return`<label class="switch set-row${t?" off":""}">
      <input type="checkbox" role="switch" data-setting="${P(e.id)}" ${e.get()?"checked":""} ${t?"disabled":""}>
      <span><b>${P(e.label)}</b>${n?`<small>${P(n)}</small>`:""}</span>
    </label>`}).join(""))}function aP(){ag()&&(lg(),jn.hidden=!1,Os.setAttribute("aria-expanded","true"),jn.querySelector("button, input:not([disabled])")?.focus())}function Sd(){!jn||jn.hidden||(jn.hidden=!0,Os.setAttribute("aria-expanded","false"))}function cg(e){if(e.type&&e.type!=="toggle")throw new Error(`settings: unknown type ${e.type}`);let t=Xl.findIndex(n=>n.id===e.id);t>=0?Xl[t]=e:Xl.push(e),ag()&&lg()}function yb(e){if(!ag())return;let t=document.getElementById("dev-view");if(!t)return;let n=()=>{t.checked=qe(),document.body.classList.toggle("dev",qe())};n(),t.addEventListener("change",()=>{jg(t.checked),n(),e?.()})}var cP=[{at:"critter",title:"A thread",text:"One of your Claude Code sessions. It hops when it does something, and its screen scrolls while it works."},{at:"ring",title:"Its energy",text:"The ring fills as its memory of the conversation fills. Near the top it needs a break: it tidies up and carries on."},{at:"beads",title:"Beads",text:"One floats up for each thing it does: blue reading, coral changing, green searching, yellow commands. Red is a bump."},{at:"helper",title:"A helper",text:"A smaller critter it brought in for part of the job. When it\u2019s done it goes for coffee."},{at:".bubbles .bub",title:"A bubble",text:"What it says, shows you or asks you. Questions wait for your answer."},{at:"sign",title:"A room",text:"Each project gets a room. Click the sign to zoom in, or its icon to rename it."},{at:"coffee",title:"The coffee corner",text:"Where helpers take a break once their work is done."},{at:".board",title:"Waiting on you",text:"Threads whose next move is yours. Answer or reply right here."},{at:".tape",title:"Activity",text:"What got finished, made and asked. Small bumps fold into one quiet line."},{at:"#side",title:"Your projects",text:"Every thread and its helpers. Click one to read the conversation and see what it made."},{at:"#settings-open",title:"Settings",text:"Sound, alerts, past sessions, a snapshot to share, the tour, and Developer view for the raw commands and numbers."}],xb=e=>String(e).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),uP=210,In=22,Ue=null,Td=null,Ad=()=>!!(Ue&&!Ue.hidden);function hP(e,t){if(e in t)return t[e]||null;let n=document.querySelector(e),i=n?.getBoundingClientRect();if(!i?.width||!i.height||getComputedStyle(n).display==="none")return null;let s=i.width>160&&i.height>120;return{x:s?i.left+i.width/2<innerWidth/2?i.right-18:i.left+18:i.left+i.width/2,y:s?i.top+Math.min(i.height/2,90):i.top+i.height/2,panel:s}}var ug=(e,t)=>e.x<t.x+t.w&&t.x<e.x+e.w&&e.y<t.y+t.h&&t.y<e.y+e.h;function dP(e,t){let n=[t],i=e.map(s=>({x:s.at.x-14,y:s.at.y-14,w:28,h:28}));for(let s of e){let{x:r,y:a}=s.at,o=s.w,c=s.h,l=r<innerWidth/2,u=[[l?r+In:r-In-o,a-c-In],[l?r+In:r-In-o,a+In],[l?r-In-o:r+In,a-c-In],[l?r-In-o:r+In,a+In],[l?r+In+8:r-In-8-o,a-c/2],[r-o/2,a+In+6],[r-o/2,a-c-In-6]].map(([p,m])=>({x:Math.max(8,Math.min(innerWidth-o-8,p)),y:Math.max(8,Math.min(innerHeight-c-8,m)),w:o,h:c})),h=p=>n.filter(m=>ug(m,p)).length*10+i.filter(m=>ug(m,p)).length*3+Math.hypot(p.x+o/2-r,p.y+c/2-a)/400,f=u.reduce((p,m)=>h(m)<h(p)?m:p);s.box=f,n.push(f)}}function fP(e){let{x:t,y:n}=e.at,i=e.box,s=Math.max(i.x,Math.min(i.x+i.w,t)),r=Math.max(i.y,Math.min(i.y+i.h,n));return`<line x1="${t}" y1="${n}" x2="${s}" y2="${r}"/>`}function _b(){let e=Fm(),t=cP.map(r=>({...r,at:hP(r.at,e)})).filter(r=>r.at),n=innerWidth<700;if(Ue.classList.toggle("narrow",n),Ue.innerHTML=`
    <div class="help-head paper">
      <h2 id="help-title">What am I looking at?</h2>
      <p>${t.length?"Here\u2019s what each part of the office means.":"The office fills in as your sessions work."} Press <kbd>Esc</kbd> or click anywhere to go back.</p>
      <button type="button" class="help-close" data-help-close>Got it</button>
    </div>
    <svg class="help-lines" aria-hidden="true"></svg>
    <ol class="help-notes">${t.map((r,a)=>`<li class="help-note paper"><span class="help-num" aria-hidden="true">${a+1}</span><b>${xb(r.title)}</b> ${xb(r.text)}</li>`).join("")}</ol>
    ${t.map((r,a)=>`<span class="help-pin" aria-hidden="true" style="left:${r.at.x}px;top:${r.at.y}px">${a+1}</span>`).join("")}`,n){let r=[Ue.querySelector(".help-head"),Ue.querySelector(".help-notes")].map(a=>a.getBoundingClientRect());for(let a of Ue.querySelectorAll(".help-pin")){let o=a.getBoundingClientRect();r.some(c=>ug({x:o.left,y:o.top,w:o.width,h:o.height},{x:c.left,y:c.top,w:c.width,h:c.height}))&&(a.hidden=!0)}return}let i=Ue.querySelector(".help-head").getBoundingClientRect(),s=[...Ue.querySelectorAll(".help-note")];t.forEach((r,a)=>{r.w=uP,r.h=s[a].offsetHeight}),dP(t,{x:i.left-8,y:i.top-8,w:i.width+16,h:i.height+16}),t.forEach((r,a)=>Object.assign(s[a].style,{left:`${r.box.x}px`,top:`${r.box.y}px`})),Ue.querySelector(".help-lines").innerHTML=t.map(fP).join("")}function vb(){Ue||(Ue=document.createElement("div"),Ue.id="help",Ue.className="help",Ue.setAttribute("role","dialog"),Ue.setAttribute("aria-modal","true"),Ue.setAttribute("aria-labelledby","help-title"),Ue.hidden=!0,document.body.append(Ue),Ue.addEventListener("click",hg)),Td=document.activeElement,Ue.hidden=!1,_b(),document.getElementById("help-open")?.setAttribute("aria-expanded","true"),Ue.querySelector("[data-help-close]").focus()}function hg(){Ad()&&(Ue.hidden=!0,document.getElementById("help-open")?.setAttribute("aria-expanded","false"),Td?.isConnected&&Td.focus(),Td=null)}var pP=()=>Ad()?hg():vb(),mP=e=>e&&(e.tagName==="TEXTAREA"||e.tagName==="INPUT"||e.isContentEditable);function bb(){document.getElementById("help-open")?.addEventListener("click",e=>{e.stopPropagation(),pP()}),addEventListener("keydown",e=>{if(Ad()){e.key==="Escape"||e.key==="?"?(e.preventDefault(),e.stopImmediatePropagation(),hg()):e.key==="Tab"?(e.preventDefault(),Ue.querySelector("[data-help-close]").focus()):e.stopImmediatePropagation();return}e.key==="?"&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&!mP(document.activeElement)&&(e.preventDefault(),e.stopImmediatePropagation(),vb())},!0),addEventListener("resize",()=>{Ad()&&_b()})}var gP={image:"picture",artifact:"artifact",pr:"pull request",link:"link",file:"file",plan:"plan"};function Mb(e){if(e.kind==="letter")return`Passing on what the thread ${xe(e.from??"another thread")} said, in case it helps:

${e.text}`;let t=e.output,n=gP[t.type]??"output",i=t.url??t.path;return`Have a look at this ${n}${e.from?` from ${xe(e.from)}`:""}: ${t.title}${i&&i!==t.title?` (${i})`:""}`}function Sb(e){let t=e.filter(i=>i.kind==="session"&&!i.past&&i.status!=="done"),n=[];for(let i of t){n.push({id:i.id,name:"The thread itself",kind:"session",group:i.label,thread:i.id});let s=r=>r.forEach(({node:a,children:o})=>{Dn(a)!=="done"&&Dn(a)!=="failed"&&n.push({id:a.id,name:a.description&&a.description!==a.label?`${a.label}: ${a.description}`:a.label,kind:"agent",group:i.label,thread:i.id}),s(o)});s(Zi(i))}return n}var dg="application/x-agent-office-handoff";function Cd(e){let[t,n,...i]=(e??"").split("|");if(t==="letter"){let s=F.get(n);return s?.answer?.text?{kind:t,from:s.prompts?.[0]?.text??s.label,text:s.answer.text,source:s.id}:null}if(t==="output"){let s=i.join("|"),r=ee.find(o=>o.session===n&&o.id===s),a=r&&F.get(Ct(r.session));return r?{kind:t,output:r,from:a?.prompts?.[0]?.text??a?.label,source:a?.id}:null}return null}var Ie=null,fg=()=>null,jl=()=>{},yP=()=>document.getElementById("handoff");function ca(){let e=yP();if(!e)return;if(!Ie){e.hidden=!0,e.innerHTML="";return}let t=Cd(Ie.ref);if(!t)return Rd();let n=Sb([...F.values()]).filter(c=>c.id!==t.source||t.kind==="output"),i=F.get(Ie.to);e.hidden=!1,e.innerHTML=`
    <form class="handoff-card paper" aria-label="Hand it off">
      <p class="handoff-eyebrow"><i>\u2709</i>${t.kind==="letter"?"Pass this letter on":"Hand this over"}</p>
      <label class="handoff-to">To
        <select name="to">${[...new Set(n.map(c=>c.thread))].map(c=>`<optgroup label="${P(n.find(l=>l.thread===c).group)}">${n.filter(l=>l.thread===c).map(l=>`<option value="${P(l.id)}" ${l.id===Ie.to?"selected":""}>${P(l.name)}</option>`).join("")}</optgroup>`).join("")}</select>
      </label>
      <textarea name="text" rows="5" aria-label="The message">${P(Ie.text??Mb(t))}</textarea>
      <p class="handoff-hint">${i?.kind==="agent"?"Goes straight to this agent while it works.":"Arrives as its next prompt, marked as from Agent Office."}</p>
      ${Ie.status?`<p class="handoff-status ${Ie.ok===!1?"bad":""}" role="status">${P(Ie.status)}</p>`:""}
      <div class="handoff-row"><button type="button" data-handoff-close>Cancel</button><button type="submit" class="go">Send</button></div>
    </form>`;let s=e.firstElementChild,r=s.offsetWidth||320,a=s.offsetHeight||260;s.style.left=`${Math.max(12,Math.min(innerWidth-r-12,(Ie.x??innerWidth/2)-r/2))}px`,s.style.top=`${Math.max(12,Math.min(innerHeight-a-12,(Ie.y??innerHeight/2)-a-24))}px`;let o=s;o.text.oninput=()=>{Ie.text=o.text.value},o.to.onchange=()=>{Ie.to=o.to.value,ca()},o.querySelector("[data-handoff-close]").onclick=Rd,o.onsubmit=async c=>{c.preventDefault();let l=F.get(o.to.value),u=o.text.value;if(!l||!u.trim())return;Ie.status="Sending\u2026",Ie.text=u,ca();let h=await sa(l,u);Ie&&(h.ok?(Ie.status=`Sent to ${l.label}.`,ca(),setTimeout(Rd,1400)):(Ie.status=h.status,Ie.ok=!1,ca()))},Ie.focused||(Ie.focused=!0,o.querySelector("textarea").focus())}function wb(e,t,n,i){if(!Zr()||!Cd(e))return;let s=Sb([...F.values()]).find(r=>r.id!==Cd(e).source)?.id;Ie={ref:e,to:t??s,x:n,y:i},ca()}function Rd(){let e=Ie?.trigger;Ie=null,ca(),e?.focus?.()}function Eb({stage:e,critterAt:t,setHover:n}){fg=t,jl=n,document.addEventListener("dragstart",i=>{let s=i.target.closest?.("[data-handoff]");!s||!Zr()||(i.dataTransfer.setData(dg,s.dataset.handoff),i.dataTransfer.setData("text/plain",(()=>{let r=Cd(s.dataset.handoff);return r?Mb(r):""})()),i.dataTransfer.effectAllowed="copy",document.body.classList.add("handing-off"))}),document.addEventListener("dragend",()=>{document.body.classList.remove("handing-off"),e.classList.remove("drop-ok"),jl(null)}),e.addEventListener("dragover",i=>{if(!i.dataTransfer.types.includes(dg))return;let s=fg(i.clientX,i.clientY),r=s&&F.get(s)&&(F.get(s).kind==="session"||F.get(s).kind==="agent");e.classList.toggle("drop-ok",!!r),jl(r?s:null),r&&(i.preventDefault(),i.dataTransfer.dropEffect="copy")}),e.addEventListener("dragleave",i=>{e.contains(i.relatedTarget)||(e.classList.remove("drop-ok"),jl(null))}),e.addEventListener("drop",i=>{let s=i.dataTransfer.getData(dg),r=fg(i.clientX,i.clientY);e.classList.remove("drop-ok"),jl(null),!(!s||!r)&&(i.preventDefault(),wb(s,r,i.clientX,i.clientY))}),document.addEventListener("keydown",i=>{if(i.key==="Escape"&&Ie){i.stopPropagation(),Rd();return}if(i.key!=="h"&&i.key!=="H"||i.metaKey||i.ctrlKey||i.altKey)return;let s=document.activeElement?.closest?.("[data-handoff]");if(!s)return;i.preventDefault(),i.stopPropagation();let r=s.getBoundingClientRect();wb(s.dataset.handoff,void 0,r.left+r.width/2,r.top+40),Ie&&(Ie.trigger=s)},!0)}var Pd=e=>document.querySelector(e),pg="claude";function Tb(e){return Math.min(30,[2,4,8,15][e-1]??30)}var _P=2500;function vP({hasPast:e=!1}={}){return e?{title:"Nobody\u2019s in right now",body:"Your past sessions are hidden. Tick Past sessions to see them, or start a new one and it walks in through this door."}:{title:"Hi! The office is ready for you",body:"Start a Claude Code session and it walks in through this door, takes a desk in its project\u2019s room, and you can follow along and talk to it from here."}}var bP=`
  <svg class="greeter-critter" viewBox="0 0 96 104" aria-hidden="true">
    <ellipse cx="48" cy="98" rx="30" ry="5" fill="currentColor" opacity=".12"/>
    <rect x="24" y="84" width="10" height="12" rx="4" fill="var(--coral)"/>
    <rect x="62" y="84" width="10" height="12" rx="4" fill="var(--coral)"/>
    <rect x="16" y="30" width="64" height="60" rx="26" fill="var(--coral)"/>
    <rect x="16" y="30" width="64" height="60" rx="26" fill="url(#greeter-shine)"/>
    <g class="greeter-arm"><rect x="72" y="44" width="22" height="9" rx="4.5" fill="var(--coral)" transform="rotate(-38 74 48)"/></g>
    <rect x="2" y="56" width="18" height="9" rx="4.5" fill="var(--coral)" transform="rotate(18 18 60)"/>
    <g class="greeter-eyes">
      <ellipse cx="38" cy="56" rx="5" ry="6.5" fill="#1f1d1a"/><ellipse cx="58" cy="56" rx="5" ry="6.5" fill="#1f1d1a"/>
      <circle cx="39.6" cy="53.6" r="1.8" fill="#fff"/><circle cx="59.6" cy="53.6" r="1.8" fill="#fff"/>
    </g>
    <path d="M41 68 q7 6 14 0" fill="none" stroke="#1f1d1a" stroke-width="2.6" stroke-linecap="round"/>
    <ellipse cx="30" cy="66" rx="5" ry="3" fill="#fff" opacity=".3"/><ellipse cx="66" cy="66" rx="5" ry="3" fill="#fff" opacity=".3"/>
    <g class="greeter-gem"><path d="M48 10 l8 9 -8 10 -8 -10z" fill="var(--gem)"/><path d="M48 10 l8 9 -8 3z" fill="#fff" opacity=".45"/></g>
    <defs><linearGradient id="greeter-shine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  </svg>`,Pn=null;function wP(){Pn=document.createElement("section"),Pn.id="greeter",Pn.className="hud",Pn.setAttribute("aria-label","Getting started"),Pn.hidden=!0,Pn.innerHTML=`
    <div class="greeter-bubble paper" role="note">
      <b class="greeter-title"></b>
      <p class="greeter-body"></p>
      <ol class="greeter-steps">
        <li><span>Open a terminal and start Claude Code</span>
          <span class="greeter-cmd"><code>${pg}</code><button type="button" class="greeter-copy" aria-label="Copy the command ${pg}">Copy</button></span></li>
        <li><span>Say hello. Anything works, like <q>What\u2019s in this folder?</q></span></li>
      </ol>
      <p class="greeter-foot"><button type="button" class="greeter-tour" hidden>Take the 1-minute tour</button><span class="greeter-wait"><i></i>Waiting for your first session</span></p>
    </div>
    <div class="greeter-door" aria-hidden="true">${bP}<span class="greeter-mat"></span></div>`,Pd(".stage-wrap").append(Pn);let e=Pn.querySelector(".greeter-copy");e.addEventListener("click",async()=>{let t=!1;try{await navigator.clipboard.writeText(pg),t=!0}catch{let n=document.createRange();n.selectNodeContents(Pn.querySelector(".greeter-cmd code")),getSelection().removeAllRanges(),getSelection().addRange(n)}e.textContent=t?"Copied":"Press Ctrl+C",e.classList.toggle("done",t),setTimeout(()=>{e.textContent="Copy",e.classList.remove("done")},1800)}),Pn.querySelector(".greeter-tour").addEventListener("click",()=>Pd("#tour-open")?.click())}function Rb(e,{hasPast:t=!1}={}){if(Pn||wP(),en&&!en.hidden&&(e=!1),Pn.hidden===!e||(Pn.hidden=!e,!e))return;let{title:n,body:i}=vP({hasPast:t});Pn.querySelector(".greeter-title").textContent=n,Pn.querySelector(".greeter-body").textContent=i,Pn.querySelector(".greeter-tour").hidden=!Pd("#tour-open")}var en=null,ua=0,kd=0,Cb=0,Ld=0,Id=0,Yl=null,ha=!1;function MP(){en=document.createElement("section"),en.id="offline",en.className="hud paper",en.setAttribute("role","status"),en.hidden=!0,en.innerHTML=`
    <p class="eyebrow">Connection</p>
    <b class="offline-title">The office lost touch with its bridge</b>
    <p class="offline-body">The bridge is the small helper on your computer that tells this page what Claude is doing. It may have stopped, or your computer may have slept. Nothing is lost: your sessions keep working without it.</p>
    <p class="offline-try"><i></i><span class="offline-count">Trying again\u2026</span><button type="button" class="offline-now">Try now</button></p>
    <p class="offline-help">Still stuck? Type <code>/office</code> in Claude Code to start it again.</p>`,Pd(".stage-wrap").append(en),en.querySelector(".offline-now").addEventListener("click",()=>Ib())}function Ab(){let e=Math.max(0,Math.ceil((Id-Date.now())/1e3));en.querySelector(".offline-count").textContent=e?`Trying again in ${e}s`:"Trying again\u2026",en.querySelector(".offline-title").textContent=Date.now()-kd>6e4?"The bridge seems to have stopped":"The office lost touch with its bridge"}function Ib(){clearTimeout(Ld),ha=!1;let e=Yl;Yl=null,ua++,en&&(en.querySelector(".offline-count").textContent="Trying again\u2026"),e?e():Dd()}function Dd(e){if(en||MP(),kd||(kd=Date.now(),ua=0,Cb=setTimeout(()=>{en.hidden=!1,Ab()},_P)),Yl=e??null,ha)return;ha=!0,Id=Date.now()+Tb(ua+1)*1e3;let t=()=>{if(en.hidden||Ab(),Date.now()>=Id){if(ha=!1,Yl)return Ib();ha=!0,ua++,Id=Date.now()+Tb(ua+1)*1e3}Ld=setTimeout(t,500)};Ld=setTimeout(t,500)}function Pb(){kd=0,ua=0,Yl=null,ha=!1,clearTimeout(Cb),clearTimeout(Ld),en&&(en.hidden=!0)}var Ob="agent-office-toured",ur="tour-",Zl={id:"/sample/your-project",name:"your-project"},Nd=10,cs=[{title:"Welcome to your office",body:"Everything Claude Code is doing on this computer shows up here, as a cozy office. Here\u2019s a one-minute look around.",at:null},{title:"Each project gets a room",body:"A project is a folder you work in. Its room gets its own color and furniture, so you can tell them apart at a glance.",at:"room"},{title:"Each critter is a conversation",body:"Every Claude Code session is a critter at its own desk. It hops when it does something, and helpers it starts stand behind it. Hover one to see what it\u2019s doing.",at:"critter",enter:"zoom"},{title:"Waiting on you",body:"When a session finishes and needs you, a note lands here, longest waiting first. Questions it asks show up here too, with buttons to answer.",at:"board"},{title:"The clipboard",body:"Click any critter, note or line to open its clipboard: the conversation as it happens, what it made, its helpers, and the details.",at:"side",enter:"open"},{title:"Reply without switching windows",body:"Type here and press Enter: your message becomes the session\u2019s next prompt. Press r any time to reply to whoever has waited longest.",at:"reply",enter:"open"}];function EP(e,t,n,i=14){let s=c=>Math.max(12,Math.min(n.width-t.width-12,c)),r=c=>Math.max(12,Math.min(n.height-t.height-12,c));if(!e)return{left:s((n.width-t.width)/2),top:r((n.height-t.height)/2),side:"center"};let a=e.left+e.width/2-t.width/2,o=e.top+e.height/2-t.height/2;return e.top+e.height+i+t.height<=n.height-12?{left:s(a),top:e.top+e.height+i,side:"below"}:e.top-i-t.height>=12?{left:s(a),top:e.top-i-t.height,side:"above"}:e.left+e.width+i+t.width<=n.width-12?{left:e.left+e.width+i,top:r(o),side:"right"}:e.left-i-t.width>=12?{left:e.left-i-t.width,top:r(o),side:"left"}:{left:s(a),top:n.height-t.height-12,side:"over"}}function TP({param:e,seen:t,webdriver:n}){return e==="1"?!0:e==="0"?!1:!t&&!n}var AP=()=>{try{return localStorage.getItem(Ob)==="1"}catch{return!1}},RP=()=>{try{localStorage.setItem(Ob,"1")}catch{}},hr=!1,Fb=0,vn=null;function Bb(e){let t=(n,i,s)=>({t:e+n,session:`${ur}${i}`,...s});return[t(0,"a",{kind:"session.start",cwd:Zl.id,model:"claude-sonnet-5-5",project:Zl}),t(1,"a",{kind:"turn.start",text:"Tidy up the README"}),t(2,"a",{kind:"context.measure",context:{tokens:46e3,window:2e5}}),t(3,"a",{kind:"turn.complete",reason:"answer",answer:"All tidy! I fixed the headings and two broken links. Want a screenshot at the top too?"}),t(10,"b",{kind:"session.start",cwd:Zl.id,model:"claude-sonnet-5-5",project:Zl}),t(11,"b",{kind:"turn.start",text:"Why are the tests slow?"}),t(12,"b",{kind:"context.measure",context:{tokens:88e3,window:2e5}}),t(13,"b",{kind:"agent.spawn",agent:"helper",type:"Explore",description:"Time each test file"})]}var kb=[["Read","package.json"],["Bash","npm test"],["Grep","setTimeout"],["Read","test/setup.js"]];function CP(){if(hr)return;hr=!0,Bb(Date.now()).forEach(vn.ingest);let e=0;Fb=setInterval(()=>{let[t,n]=kb[e%kb.length],i=e%2?"helper":void 0,s=`tour-tool-${e++}`,r={session:`${ur}b`,...i&&{agent:i}};vn.ingest({...r,t:Date.now(),kind:"tool.start",id:s,tool:t,summary:n}),setTimeout(()=>hr&&vn.ingest({...r,t:Date.now(),kind:"tool.end",id:s,tool:t,ok:!0}),700)},1400)}function mg(){if(!hr)return;hr=!1,clearInterval(Fb);let e=n=>typeof n=="string"&&n.startsWith(ur);for(let n of[...F.values()])e(n.session)&&Yi(n.id);let t=`p:${Zl.id}`;zn.some(n=>ui(n.source)===t)||Yi(t);for(let n of[ci,ee,_r])for(let i=n.length-1;i>=0;i--)(e(n[i].session)||String(n[i].target??"").includes(ur))&&n.splice(i,1);for(let n=Nn.length-1;n>=0;n--)String(Nn[n].target??"").includes(ur)&&Nn.splice(n,1);for(let n of[...Un.keys()])n.includes(ur)&&Un.delete(n);af()}var IP=e=>e.kind==="session"&&!e.session.startsWith(ur),Qt=null,kn=-1,Ud=0,nn=null,gg=null,Lb="",Hb=0,Qr=e=>document.querySelector(e);function PP(){Qt=document.createElement("div"),Qt.id="tour",Qt.hidden=!0,Qt.innerHTML=`
    <div class="tour-catch"></div>
    <div class="tour-hole"></div>
    <section class="tour-note paper" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <p class="tour-count eyebrow"></p>
      <h2 id="tour-title" class="tour-title"></h2>
      <p class="tour-body"></p>
      <div class="tour-dots" aria-hidden="true"></div>
      <div class="tour-actions">
        <button type="button" class="tour-skip">Skip tour</button>
        <button type="button" class="tour-back">Back</button>
        <button type="button" class="tour-next">Next</button>
      </div>
      <p class="tour-keys"><kbd>\u2190</kbd> <kbd>\u2192</kbd> to move \xB7 <kbd>Esc</kbd> to skip</p>
    </section>`,document.body.append(Qt),Qt.querySelector(".tour-skip").onclick=()=>yg(),Qt.querySelector(".tour-back").onclick=()=>Od(kn-1),Qt.querySelector(".tour-next").onclick=()=>kn>=cs.length-1||nn?yg():Od(kn+1),Qt.querySelector(".tour-catch").onclick=()=>Qt.querySelector(".tour-next").focus()}function zb(){let e=[...F.values()].filter(n=>n.kind==="session");if(nn&&F.has(nn))return F.get(nn);let t=e.filter(n=>!n.past&&n.status!=="done");return t.find(n=>n.answer)??t[0]??e[0]??null}function Db(e){let{camera:t,stage:n}=vn.table.debug;if(!t||!n)return null;let i=n.getBoundingClientRect(),s=1/0,r=1/0,a=-1/0,o=-1/0;for(let c of e){let l=c.clone().project(t);if(l.z>1)continue;let u=i.left+(l.x+1)/2*i.width,h=i.top+(1-l.y)/2*i.height;s=Math.min(s,u),r=Math.min(r,h),a=Math.max(a,u),o=Math.max(o,h)}return Number.isFinite(s)?{left:s,top:r,width:a-s,height:o-r}:null}function Nb(e,t,n,i){let s=vn.table.debug.camera.position.constructor,r=[];for(let a of[-t,t])for(let o of[-n,n])for(let c of[0,i])r.push(new s(e.x+a,e.y+c,e.z+o));return r}var Kl=e=>{if(!e||!e.isConnected||e.closest("[hidden]"))return null;let t=e.getBoundingClientRect();return t.width&&t.height?{left:t.left,top:t.top,width:t.width,height:t.height}:null};function kP(e){let t=zb(),{rooms:n,sessionViews:i}=vn.table.debug;if(e==="room"){let s=t&&n.get(`p:${t.project}`);return!s?.mesh||!s.w?null:Db(Nb(s.mesh.position,s.w/2,s.d/2,46))}if(e==="critter"){let s=t&&i.get(t.id);return s?Db(Nb(s.group.position,18,14,34)):null}return e==="board"?Kl(Qr(".hud.left .board")):e==="side"?Kl(Qr("#side")):e==="reply"?Kl(Qr("#side .tx-compose"))??Kl(Qr("#inbox .card:not(.gone)"))??Kl(Qr("#side")):null}function $b(e){let t=zb();t&&(e.enter==="open"?vn.pick(t.id):(vn.pick(null),e.enter==="zoom"?vn.table.focusOn(t.id):vn.table.focusOn(null)))}function Vb(){let e=nn?Gb:cs[kn];Qt.querySelector(".tour-count").textContent=nn?"Your office":`${kn+1} of ${cs.length}`,Qt.querySelector(".tour-title").textContent=e.title,Qt.querySelector(".tour-body").innerHTML=P(e.body),Qt.querySelector(".tour-dots").innerHTML=nn?"":cs.map((t,n)=>`<i class="${n===kn?"on":n<kn?"past":""}"></i>`).join(""),Qt.querySelector(".tour-back").hidden=kn===0||!!nn,Qt.querySelector(".tour-skip").hidden=kn===cs.length-1||!!nn,Qt.querySelector(".tour-keys").hidden=!!nn,Qt.querySelector(".tour-next").textContent=nn?"Say hi":kn===0?"Show me around":kn===cs.length-1?"Start exploring":"Next"}var Gb={title:"Your first session just walked in!",body:"That one\u2019s real. The sample critters have gone home, and the office is all yours. Click your session any time to follow along.",at:"critter"};function Wb(){if(!Qt||Qt.hidden)return;let e=hr&&[...F.values()].find(IP);e&&(e.past||(e.startedAt??0)<Hb)?(mg(),$b(cs[kn])):e&&(nn=e.id,mg(),Vb(),vn.pick(null),vn.table.focusOn(nn),Qt.querySelector(".tour-next").focus()),hr&&!F.has(Ct(`${ur}a`))&&Bb(Date.now()).forEach(vn.ingest);let t=nn?Gb:cs[kn],n=t.at?kP(t.at):null,i=n&&{left:Math.max(4,n.left-Nd),top:Math.max(4,n.top-Nd),width:Math.min(innerWidth-8,n.width+Nd*2),height:Math.min(innerHeight-8,n.height+Nd*2)},s=Qt.querySelector(".tour-hole");s.classList.contains("none")!==!i&&s.classList.toggle("none",!i);let r=Qt.querySelector(".tour-note"),a={width:r.offsetWidth,height:r.offsetHeight},o=EP(i,a,{width:innerWidth,height:innerHeight}),c=JSON.stringify([i&&Object.values(i).map(Math.round),Math.round(o.left),Math.round(o.top)]);c!==Lb&&(Lb=c,i&&Object.assign(s.style,{left:`${i.left}px`,top:`${i.top}px`,width:`${i.width}px`,height:`${i.height}px`}),r.style.left=`${o.left}px`,r.style.top=`${o.top}px`,r.dataset.side=o.side),Ud=requestAnimationFrame(Wb)}function Od(e){e<0||e>=cs.length||(kn=e,$b(cs[e]),Vb(),Qt.querySelector(".tour-next").focus())}function Ub(){Qt||PP(),Qt.hidden&&(RP(),gg=document.activeElement,nn=null,Hb=Date.now(),[...F.values()].some(e=>e.kind==="session")||CP(),Qt.hidden=!1,document.documentElement.classList.add("touring"),Od(0),cancelAnimationFrame(Ud),Ud=requestAnimationFrame(Wb))}function yg(){if(!Qt||Qt.hidden)return;Qt.hidden=!0,document.documentElement.classList.remove("touring"),cancelAnimationFrame(Ud);let e=hr;mg(),nn?vn.pick(nn):e&&(vn.pick(null),vn.table.focusOn(null)),nn=null,kn=-1,(gg?.isConnected?gg:Qr("#tour-open"))?.focus()}var LP=()=>!!(Qt&&!Qt.hidden);function DP(e){if(!LP())return;let t=()=>{e.preventDefault(),e.stopPropagation()};if(e.key==="Escape")t(),yg();else if(e.key==="ArrowRight")t(),Qt.querySelector(".tour-next").click();else if(e.key==="ArrowLeft")t(),nn||Od(kn-1);else if(e.key==="Tab"){let n=[...Qt.querySelectorAll(".tour-actions button:not([hidden])")],i=n.indexOf(document.activeElement);t(),n[(i+(e.shiftKey?-1:1)+n.length)%n.length]?.focus()}else e.key==="Enter"||e.key===" "?Qt.contains(document.activeElement)||(t(),Qt.querySelector(".tour-next").click()):!e.metaKey&&!e.ctrlKey&&!e.altKey&&t()}function qb({pick:e,ingest:t,table:n}){vn={pick:e,ingest:t,table:n},Qr("#tour-open")?.addEventListener("click",Ub),addEventListener("keydown",DP,!0);let i=new URLSearchParams(location.search);if(TP({param:i.get("tour"),seen:AP(),webdriver:navigator.webdriver})){let s=()=>document.querySelector("#conn.live")?setTimeout(Ub,900):setTimeout(s,300);s()}}var Zb="agent-office-alerts",Bd=new Set(["asking","waiting","stuck"]),Xb=e=>{let t=/^(\d{1,2}):(\d{2})$/.exec(e??"");return t?Number(t[1])*60+Number(t[2]):null};function Jb(e,t){if(!t?.on)return!1;let n=Xb(t.from),i=Xb(t.to);if(n===null||i===null||n===i)return!1;let s=e.getHours()*60+e.getMinutes();return n<i?s>=n&&s<i:s>=n||s<i}var UP=(e,t="Agent Office")=>e>0?`(${e}) ${t}`:t;function OP(e,t){return t.filter(n=>Bd.has(n.state)&&e.has(n.id)&&e.get(n.id)!==n.state&&(!Bd.has(e.get(n.id))||n.state==="asking"))}function FP(e,t){let n=Hs(e.prompts?.[0]?.text)||e.label||"A thread",i=e.projectName||e.project?` \xB7 ${fn(e.project??e.projectName,e.projectName)}`:"";if(t==="asking"){let s=(e.asks??[])[0],r=s?.questions?.[0]?.question??(s?.type==="plan"?"It has a plan for you to approve.":s?.type==="permission"?"It needs your OK to go on.":"It has a question for you.");return{title:`A question from \u201C${Jl(n,40)}\u201D`,body:`${Jl(r,140)}${i}`}}return t==="stuck"?{title:`\u201C${Jl(n,40)}\u201D needs a look`,body:`Its last turn didn\u2019t finish.${i}`}:{title:`\u201C${Jl(n,40)}\u201D is waiting on you`,body:`${e.answer?.text?Jl(e.answer.text,140):"Done with your last request."}${i}`}}var Jl=(e,t)=>{let n=String(e).replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1).trimEnd()}\u2026`:n},xg={alerts:!1,quiet:{on:!1,from:"22:00",to:"08:00"},muted:[]},sn=BP();function BP(){try{let e=JSON.parse(localStorage.getItem(Zb)??"{}");return{...xg,...e,quiet:{...xg.quiet,...e.quiet},muted:Array.isArray(e.muted)?e.muted:[]}}catch{return structuredClone(xg)}}function jb(){try{localStorage.setItem(Zb,JSON.stringify(sn))}catch{}}var HP=()=>typeof Notification<"u",Mg=()=>HP()?Notification.permission:"unsupported",Qb=e=>sn.muted.includes(e.projectName??"Elsewhere"),bg="Agent Office",Fd=null,Yb="";function tw(e){let t=`${e}`;if(t===Yb)return;Yb=t;let n=getComputedStyle(document.documentElement),i=a=>n.getPropertyValue(`--${a}`).trim(),s=document.createElement("canvas");s.width=s.height=64;let r=s.getContext("2d");r.beginPath(),r.arc(32,32,24,0,Math.PI*2),r.lineWidth=5,r.strokeStyle="#d8cfc2",r.stroke(),r.beginPath(),r.arc(32,32,12,0,Math.PI*2),r.fillStyle=i("accent")||"#b85c3c",r.fill(),r.beginPath(),r.arc(52,18,6,0,Math.PI*2),r.fillStyle="#1f1d1a",r.fill(),e&&(r.beginPath(),r.arc(48,48,15,0,Math.PI*2),r.fillStyle="#ffffff",r.fill(),r.beginPath(),r.arc(48,48,11.5,0,Math.PI*2),r.fillStyle=i("crit")||"#b4483a",r.fill()),Fd||(Fd=document.querySelector('link[rel="icon"]')??document.head.appendChild(Object.assign(document.createElement("link"),{rel:"icon"}))),Fd.href=s.toDataURL("image/png")}var _g=new Map,ew=()=>{},Hd=new Map;function zP(e,t){if(!sn.alerts||Mg()!=="granted"||Qb(e)||Jb(new Date,sn.quiet)||document.visibilityState==="visible"&&document.hasFocus())return;let{title:n,body:i}=FP(e,t);try{Hd.get(e.id)?.close();let s=new Notification(n,{body:i,tag:e.id,icon:Fd?.href});s.onclick=()=>{window.focus(),ew(e.id),s.close()},Hd.set(e.id,s)}catch{}}function nw(e){let t=[...F.values()].filter(s=>s.kind==="session"&&!s.past&&s.status!=="done").map(s=>({id:s.id,n:s,state:$e(s,e)}));for(let s of OP(_g,t))zP(s.n,s.state);_g=new Map(t.map(s=>[s.id,s.state]));let n=t.filter(s=>Bd.has(s.state)&&!Qb(s.n)).length,i=UP(n,bg);document.title!==i&&(document.title=i),tw(n>0);for(let[s,r]of Hd)Bd.has(_g.get(s))||(r.close(),Hd.delete(s));Bn&&!Bn.hidden&&iw()}var Bn=null,dr=null;function $P(){let e=Mg();return e==="unsupported"?'<p class="alerts-note">This browser can\u2019t show alerts. The tab title still counts what\u2019s waiting.</p>':e==="denied"?'<p class="alerts-note">Your browser has blocked alerts for this page. You can allow them again in the site settings (the icon left of the address).</p>':e!=="granted"?'<button type="button" class="alerts-ask">Turn on desktop alerts</button><p class="alerts-note">Your browser will ask once. Alerts only show while you\u2019re in another window or tab.</p>':`<label class="alerts-row"><input type="checkbox" data-pref="alerts" ${sn.alerts?"checked":""}> <span>Show desktop alerts</span></label><p class="alerts-note">Only while you\u2019re in another window or tab. Click one to open its thread.</p>`}function VP(){let e=new Set(sn.muted);for(let t of F.values())t.kind==="session"&&!t.past&&e.add(t.projectName??"Elsewhere");return[...e].sort((t,n)=>t.localeCompare(n))}function iw(){let e=Bn.querySelector(".alerts-projects"),t=VP(),n=t.length?t.map(i=>`<label class="alerts-row"><input type="checkbox" data-mute="${Kb(i)}" ${sn.muted.includes(i)?"checked":""}> <span>Mute <b>${Kb(fn(i,i))}</b></span></label>`).join(""):'<p class="alerts-note">Projects with live threads show up here.</p>';e.dataset.html!==n&&!e.contains(document.activeElement)&&(e.dataset.html=n,e.innerHTML=n)}var Kb=e=>String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]);function sw(){Bn.innerHTML=`
    <p class="eyebrow">Alerts</p>
    <p class="alerts-lede">When a thread is waiting on you, the tab shows how many, like <b>(2) Agent Office</b>.</p>
    <div class="alerts-perm">${$P()}</div>
    <h3>Quiet hours</h3>
    <label class="alerts-row"><input type="checkbox" data-quiet="on" ${sn.quiet.on?"checked":""}> <span>Hold alerts during quiet hours</span></label>
    <p class="alerts-times"><span>From</span><input type="time" data-quiet="from" value="${sn.quiet.from}" aria-label="Quiet hours start">
      <span>to</span><input type="time" data-quiet="to" value="${sn.quiet.to}" aria-label="Quiet hours end"></p>
    <h3>Projects</h3>
    <div class="alerts-projects"></div>
    <p class="alerts-note">A muted project doesn\u2019t alert or count in the tab.</p>`,iw(),wg()}function wg(){let e=sn.alerts&&Mg()==="granted";dr.classList.toggle("on",e),dr.title=e?Jb(new Date,sn.quiet)?"Alerts: on, quiet hours now":"Alerts: on":"Alerts: off"}function vg(e){Bn.hidden=!e,dr.setAttribute("aria-expanded",String(e)),e&&(sw(),Bn.querySelector("button, input")?.focus())}function rw(e){ew=e.pick,bg=document.title||bg,dr=document.getElementById("alerts-open"),Bn=document.getElementById("alerts"),!(!dr||!Bn)&&(dr.addEventListener("click",()=>vg(Bn.hidden)),Bn.addEventListener("click",async t=>{if(!t.target.closest(".alerts-ask"))return;await Notification.requestPermission()==="granted"&&(sn.alerts=!0,jb()),sw(),Bn.querySelector("input, button")?.focus()}),Bn.addEventListener("change",t=>{let n=t.target;n.dataset.pref==="alerts"?sn.alerts=n.checked:n.dataset.quiet==="on"?sn.quiet.on=n.checked:n.dataset.quiet&&n.value?sn.quiet[n.dataset.quiet]=n.value:n.dataset.mute!==void 0&&(sn.muted=sn.muted.filter(i=>i!==n.dataset.mute),n.checked&&sn.muted.push(n.dataset.mute)),jb(),wg()}),addEventListener("keydown",t=>{t.key==="Escape"&&!Bn.hidden&&(vg(!1),dr.focus())}),addEventListener("pointerdown",t=>{!Bn.hidden&&!Bn.contains(t.target)&&!dr.contains(t.target)&&vg(!1)}),wg(),tw(!1))}var WP=e=>e.kind==="session"&&!e.past&&e.status!=="done",qP=(e,t)=>`${e} ${t}${e===1?"":"s"}`,zd=e=>e.prompts?.[0]?.text??e.label,XP={working:"working",waiting:"waiting on you",asking:"needs your answer",stuck:"needs a look",ended:"ended"};function jP(e,{state:t,helpers:n=0,percent:i}={}){let s=[`${zd(e)}, in ${e.projectName??"another folder"}: ${XP[t]??t}`];return n&&s.push(`${qP(n,"agent")} helping`),i!==void 0&&s.push(`context ${i}% full`),`${s.join(", ")}.`}function YP(e,t,{question:n}={}){return t==="asking"?`New letter: ${zd(e)} asks: ${n??"a question for you"}`:t==="stuck"?`New letter: ${zd(e)} needs a look. Its last turn didn\u2019t finish.`:`New letter: ${zd(e)} is waiting on you.${e.answer?.text?` It said ${xe(e.answer.text.slice(0,140))}`:""}`}function KP(e,t){return t.filter(n=>!e.has(n))}var ZP=new Set(["asking","waiting","stuck"]),JP=4e3,Sg=null,ow="";function aw({running:e,pick:t}){if(typeof document>"u")return;let n=[...F.values()].filter(WP),i=new Map(n.map(u=>[u.id,$e(u,e)])),s=n.filter(u=>ZP.has(i.get(u.id))).map(u=>u.id);if(Sg&&performance.now()>JP){let u=KP(Sg,s).map(h=>{let f=F.get(h),p=so(f)[0];return YP(f,i.get(h),{question:p?.questions?.[0]?.question??(p?.type==="permission"?"may it run a command?":p?.type==="plan"?"a plan to approve":void 0)})});if(u.length){let h=document.getElementById("announce");h&&(h.textContent=u.join(" "))}}Sg=new Set(s);let r=document.getElementById("scene-list-items");if(!r)return;let a=n.sort((u,h)=>(u.projectName??"").localeCompare(h.projectName??"")||(u.startedAt??0)-(h.startedAt??0)).map(u=>{let h=[...F.values()].filter(p=>p.kind==="agent"&&p.session===u.session&&Dn(p)==="working").length,f=u.context?.tokens?Math.round(Xe(u)*100):void 0;return{id:u.id,text:jP(u,{state:i.get(u.id),helpers:h,percent:f})}}),o=a.map(u=>`${u.id}\0${u.text}`).join(`
`);if(o===ow)return;ow=o;let c=new Map([...r.querySelectorAll("button[data-id]")].map(u=>[u.dataset.id,u.parentElement]));a.forEach((u,h)=>{let f=c.get(u.id);if(c.delete(u.id),!f){f=document.createElement("li");let m=document.createElement("button");m.type="button",m.dataset.id=u.id,m.addEventListener("click",()=>t(m.dataset.id)),f.append(m)}let p=f.firstChild;p.textContent!==u.text&&(p.textContent=u.text),r.children[h]!==f&&r.insertBefore(f,r.children[h]??null)});for(let u of c.values())u.remove();let l=document.getElementById("scene-list-empty");l&&(l.hidden=a.length>0)}function lw(e){let t=e.target.closest?.('[role="tab"]');if(!t)return;let n=[...t.parentElement.querySelectorAll('[role="tab"]')],i=n.indexOf(t),s={ArrowRight:i+1,ArrowLeft:i-1,Home:0,End:n.length-1}[e.key];if(s===void 0)return;e.preventDefault(),e.stopPropagation();let r=n[(s+n.length)%n.length];r.click(),requestAnimationFrame(()=>document.querySelector(`[role="tab"][data-tab="${r.dataset.tab}"]`)?.focus())}var tk="(max-width: 600px)",ek=6,fa=typeof matchMedia=="function"?matchMedia(tk):{matches:!1,addEventListener(){}},da="inbox",uw=()=>{},hw=()=>fa.matches;var dw=()=>!fa.matches||da!=="projects",Tg=()=>fa.matches&&da==="inbox";function nk(e,t=Date.now()){let n=new Date(t);n.setHours(0,0,0,0);let i=e.filter(s=>s.t>=n.getTime());return{pictures:i.filter(s=>s.type==="image"),delivered:i.filter(s=>s.type!=="image"&&s.type!=="file"),files:i.filter(s=>s.type==="file").length}}function ik(){let e=document.getElementById("stage"),t=document.getElementById("mini-slot"),n=document.querySelector(".stage-wrap");!e||!t||!n||(Tg()?e.parentElement!==t&&t.prepend(e):e.parentElement!==n&&n.prepend(e))}function Eg(){let e=document.documentElement;fa.matches?e.dataset.phone=da:delete e.dataset.phone,ik();for(let t of document.querySelectorAll("[data-phone-tab]"))t.dataset.phoneTab===da?t.setAttribute("aria-current","page"):t.removeAttribute("aria-current");uw()}function $d(e){if(!["inbox","office","projects"].includes(e))return;let t=da;da=e,Eg(),t!==e&&document.querySelector(e==="projects"?"#side":".hud.left")?.scrollTo?.(0,0)}function fw({changed:e=()=>{}}={}){uw=e;for(let t of document.querySelectorAll("[data-phone-tab]"))t.addEventListener("click",()=>$d(t.dataset.phoneTab));document.getElementById("mini-open")?.addEventListener("click",()=>$d("office")),fa.addEventListener?.("change",Eg),Eg()}var cw="";function pw(){if(!fa.matches)return;let{pictures:e,delivered:t,files:n}=nk(ee),i=o=>F.get(Ct(o.session)),s=e.length||t.length||n?`${e.length?`<div class="gallery">${e.slice(0,3).map(o=>As(o,{withThread:!0})).join("")}</div>`:""}
      ${t.length?`<div class="outs">${t.slice(0,ek).map(o=>As(o,{withThread:!!i(o)})).join("")}</div>`:""}
      ${n?`<p class="today-files">${n} ${n===1?"file":"files"} changed today</p>`:""}`:'<p class="muted">Nothing made yet today. Pictures, pull requests and artifacts land here as they happen.</p>';if(s!==cw){cw=s;let o=document.getElementById("today-list");o&&(o.innerHTML=s)}let r=document.getElementById("inbox-count")?.textContent??"",a=document.getElementById("phone-inbox-count");a&&a.textContent!==r&&(a.textContent=r,a.closest("button")?.setAttribute("aria-label",r?`Inbox, ${r} waiting on you`:"Inbox"))}var rk=6e4,ok=700,ga=new URLSearchParams(location.search),xw=ga.get("busy")==="1",Xi=!!window.AGENT_OFFICE_DEMO||ga.get("demo")==="1"||xw,Vd=ga.get("empty")==="1",_w=Xi,Ql=!0,to=[],wi=null;Am(document.getElementById("stage"),{pick:Fs});function Fs(e){let t=e&&F.get(e);wi=t&&(t.kind==="session"||t.kind==="agent")?e:null,Om(wi),wi&&td(wi),wi&&hw()&&$d("projects"),us()}var Ag=document.getElementById("stage");function vw(){let e=Ag.clientWidth,t=Ag.clientHeight,n={left:0,right:0,top:0,bottom:0};if(Tg())return Qh(n);for(let i of document.querySelectorAll(".hud.left > *, #side, .topbar, .phone-tabs")){let s=i.getBoundingClientRect();!s.width||!s.height||getComputedStyle(i).display==="none"||(s.height>t*.5&&s.width<e*.5?s.left+s.width/2<e/2?n.left=Math.max(n.left,s.right+12):n.right=Math.max(n.right,e-s.left+12):s.width>e*.5?s.top+s.height/2<t/2?n.top=Math.max(n.top,s.bottom+8):n.bottom=Math.max(n.bottom,t-s.top+8):s.left+s.width/2<e/2?n.left=Math.max(n.left,s.right+12):n.right=Math.max(n.right,e-s.left+12))}Qh(n)}var ak=new ResizeObserver(vw);for(let e of document.querySelectorAll(".hud.left > *, #side, .topbar, #stage"))ak.observe(e);var lk=e=>e&&(e.tagName==="TEXTAREA"||e.tagName==="INPUT"||e.isContentEditable);addEventListener("keydown",e=>{if(e.metaKey||e.ctrlKey||e.altKey||document.querySelector("dialog[open]"))return;if(lk(document.activeElement)){e.key==="Escape"&&document.activeElement.blur();return}if(e.key==="Escape"){let n=wi&&F.get(wi),i=n?.kind==="agent"?va(n).at(-2):null;Fs(i?.id??null),i||td(null);return}let t={j:1,ArrowDown:1,k:-1,ArrowUp:-1}[e.key];if(t){let n=Yv();if(!n.length)return;let i=n.indexOf(wi);Fs(n[i<0?t>0?0:n.length-1:(i+t+n.length)%n.length]),e.preventDefault();return}["1","2","3","4"].includes(e.key)?fd(["transcript","outputs","team","details"][Number(e.key)-1]):e.key==="r"&&Qv()&&e.preventDefault()});var Rg=document.getElementById("sound");function bw(){Rg.setAttribute("aria-pressed",String(!Nh())),Rg.querySelector("span").textContent=Nh()?"Sound off":"Sound on"}Rg.addEventListener("click",()=>{f_(!Nh()),bw()});bw();for(let e of["pointerdown","keydown"])addEventListener(e,p_,{once:!0});yb(()=>{xv(),us()});bb();document.addEventListener("office:names",()=>us());var mw=document.getElementById("snapshot");mw?.addEventListener("click",async()=>{let e=getComputedStyle(document.documentElement),t=Object.fromEntries(["paper","scene","ink","muted","accent","line"].map(o=>[o,e.getPropertyValue(`--${o}`).trim()])),n=[...F.values()].filter(o=>o.kind==="session"&&!o.past&&o.status!=="done").length,i=[...F.values()].filter(o=>o.kind==="agent"&&o.status!=="done").length,s=[n&&`${n} thread${n===1?"":"s"}`,i&&`${i} agent${i===1?"":"s"} at work`].filter(Boolean).join(" \xB7 "),r=await R_(A_({...Hm(),colors:t,detail:s})),a=mw.querySelector("span");a.textContent=r?"Saved":"Couldn\u2019t save",setTimeout(()=>{a.textContent="Snapshot"},2200)});addEventListener("keydown",lw,!0);cg({id:"reduce-motion",type:"toggle",label:"Reduce motion",hint:()=>um()?"On because your system asks for less motion":"No camera glides, hops, confetti or bobbing",get:vi,set:l_,disabled:um});var gw=document.getElementById("show-past");gw.addEventListener("change",()=>{Ql=gw.checked,_a(to,Ql)});function ck(){let e=new Set;for(let t of F.values())t.kind==="tool"&&t.status==="active"&&e.add(t.owner);return e}var Cg=document.querySelector('meta[name="agent-office-token"]')?.content||"";Jx({can:e=>Xi||Gm()||!!Cg&&e.answerable===!0&&["question","plan"].includes(e.type),canApprove:()=>Xi||Gm(),send:async(e,t)=>{let n=e.who?.session;if(Xi){let r=Zd(n,e.id,t.say??im(e,t));return setTimeout(us,50),r?{ok:r}:{ok:r,status:"that question has moved on"}}let i=await fetch("/answer",{method:"POST",headers:{"content-type":"application/json","x-agent-office-token":Cg},body:JSON.stringify({session:n,id:e.id,...t})}),s=await i.json().catch(()=>({}));return i.ok?{ok:!0}:{ok:!1,status:s.error??`the bridge answered ${i.status}`}}});t_();Pv(async e=>{if(Xi)return zg(e.session),{ok:!0};let t=await fetch("/stop",{method:"POST",headers:{"content-type":"application/json","x-agent-office-token":Cg},body:JSON.stringify({session:e.session})}),n=await t.json().catch(()=>({}));return t.ok?{ok:!0}:{ok:!1,status:n.error??`the bridge answered ${t.status}`}});kv();Eb({stage:Ag,critterAt:Bm,setHover:ed});var uk={can:kh};function us(){wi&&!F.has(wi)&&(wi=null);let e=ck();Hv(to),pw(),Xn({running:e,selected:wi,pick:Fs,hover:ed,answer:uk}),aw({running:e,pick:Fs}),gb(e),nw(e),Rb(_w&&![...F.values()].some(t=>t.kind==="session"),{hasPast:to.length>0})}var pa=ga.has("debug")?[]:null,ma=0,yw=-1/0;function Ig(e){if(ma=requestAnimationFrame(Ig),!D_(e,yw,or().fps)||!dw())return;yw=e;let t=pa&&performance.now();uf(Date.now()),Lm(Ql),Nm(),pa&&(pa.push(performance.now()-t),pa.length>600&&pa.shift())}document.addEventListener("visibilitychange",()=>{document.hidden?(cancelAnimationFrame(ma),ma=0):ma||(ma=requestAnimationFrame(Ig),us())});setInterval(()=>{document.hidden||us()},ok);cg({id:"low-power",type:"toggle",label:"Save battery",hint:"Draws 30 frames a second, a little softer, with simpler shadows",get:I_,set:L_});k_(Um);function ec(e){lc(e),gc(e),Dm(e),bv(e),Zp(e)}document.addEventListener("office:event",e=>ec(e.detail));async function ww(){try{to=Vd?[]:Xi?Gg():(await(await fetch("/history")).json()).sessions??[]}catch{to=[]}_a(to,Ql)}function tc(e,t){let n=document.getElementById("conn");n.querySelector("span").textContent=e,n.className=`status ${t}`}function Mw(){let e=new EventSource("/stream");e.addEventListener("open",()=>{tc("Live","live"),Pb()}),e.addEventListener("replay",t=>{if(_w=!0,Vd)return us();lf(),xf(),$x();for(let n of JSON.parse(t.data))lc(n),gc(n),Zp(n,!0);_a(to,Ql),us()}),e.addEventListener("message",t=>Vd||ec(JSON.parse(t.data))),e.addEventListener("error",()=>{tc("Reconnecting\u2026","down"),Dd(()=>{e.close(),Mw()})})}function hk(){tc("Sample activity","live"),$g(e=>e.forEach(ec),{busy:xw})}var Sw=!1;Gx({ingest:ec,pick:Fs,isDemo:()=>Xi,bridgeDemo:()=>Sw});Vm(Xi);mb({onPick:Fs,demo:Xi});Xi||fetch("/healthz").then(e=>e.json()).then(e=>{e.demo&&(Vm(!0),og(),Sw=!0)}).catch(()=>{});rw({pick:Fs});zv();qb({pick:Fs,ingest:ec,table:id});fw({changed:()=>{vw(),us()}});await ww();setInterval(ww,rk);ga.get("offline")==="1"?(tc("Reconnecting\u2026","down"),Dd()):Xi?Vd?tc("Preview","live"):hk():Mw();us();document.hidden||(ma=requestAnimationFrame(Ig));ga.has("debug")&&(window.cluster={model:cc,words:xc,table:id,frameCost:pa});
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
