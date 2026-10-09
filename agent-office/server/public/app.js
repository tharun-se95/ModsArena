var eS=Object.defineProperty;var Tf=(e,t)=>{for(var n in t)eS(e,n,{get:t[n],enumerable:!0})};var Ui=[{id:"/work/payments-api",name:"acme/payments-api",remote:"git@github.com:acme/payments-api.git"},{id:"/work/web-dashboard",name:"acme/web-dashboard",remote:"git@github.com:acme/web-dashboard.git"}],Af=["Harden the session handling","Add retries to the webhook worker","Why is the build flaky?","Write tests for the refund flow","Migrate charts to the new tokens","Review the open PR"],nS=[["Read","src/auth/session.ts"],["Grep","timingSafeEqual"],["Glob","**/*.test.ts"],["Bash","npm test -- --watch=false"],["Edit","src/auth/session.ts"],["Write","docs/ARCHITECTURE.md"],["WebFetch","https://nodejs.org/api/crypto.html"],["Bash","git diff --stat"],["mcp__github__list_pull_requests","open PRs"]],iS=["Done. The retry wrapper is in, with tests. Should it also back off on 429s?","Found it: the build reads a stale cache key. I fixed it locally; want me to open a PR?","I added six tests for refunds. Partial refunds aren\u2019t covered yet. Shall I add them?","The chart tokens are migrated. Two charts still hard-code colors; fix those too?","Review done: one race in session.ts and two nits. I left them as comments."],k0={"Now add tests for it":["Find the untested paths","Write the tests","Run the suite"],"Open a PR with that":["Write the PR description","Push the branch","Open the PR"],"Screenshot it in dark mode too":["Switch to dark mode","Screenshot every chart","Compare with light"]},sS=["Also check the error path","Keep it to the auth module","Skip the snapshots","Note anything flaky"],oS=[["Explore","Map the auth module"],["Plan","Design token rotation"],["general-purpose","Write regression tests"],["code-reviewer","Review session.ts"]],Lo=2e5,P0=[["System prompt",3100],["System tools",17800],["MCP tools",9400],["Custom agents",1200],["Memory files",2600],["Skills",1900]],rS={"Harden the session handling":["Map how sessions are issued","Compare tokens with timingSafeEqual","Rotate the token on login","Add regression tests","Run the suite"],"Add retries to the webhook worker":["Find where deliveries fail","Wrap sends in a retry helper","Back off between tries","Test the retry path"],"Why is the build flaky?":["Reproduce the failure","Bisect the cache keys","Fix the stale key","Rerun CI three times"],"Write tests for the refund flow":["List the refund cases","Write full-refund tests","Write partial-refund tests","Run the suite"],"Migrate charts to the new tokens":["Inventory hard-coded colors","Swap to the new tokens","Screenshot every chart","Check dark mode"],"Review the open PR":["Read the diff","Run it locally","Write up findings"]},I0=[{header:"Backoff",question:"Should retries also back off on 429s?",multiSelect:!1,options:[{label:"Exponential",description:"Waits 1s, 2s, 4s\u2026 up to 30s. Recommended."},{label:"Fixed delay",description:"Simpler: 5s between tries."},{label:"Only 5xx",description:"Leave 429s alone."}]},{header:"Chart style",question:"Which look should the revenue chart take?",multiSelect:!1,options:[{label:"Bars",description:"Monthly bars, easy to compare.",preview:"bars"},{label:"Area",description:"A smooth trend line, filled.",preview:"area"},{label:"Both",description:"Bars with the trend over them.",preview:"combo"}]},{header:"Scope",question:"Open a PR now, or keep going on partial refunds first?",multiSelect:!1,options:[{label:"Open the PR",description:"Ship what passes; partial refunds next."},{label:"Keep going",description:"One PR with everything."}]},{header:"Checks",question:"Which checks should run before the PR?",multiSelect:!0,options:[{label:"Unit tests",description:"The fast suite, about a minute."},{label:"Lint",description:"Style and obvious mistakes."},{label:"End-to-end",description:"Slow, but catches the most."}]}],aS=[["Bash","npm publish --dry-run"],["Bash","git push origin fix/stale-cache"],["mcp__github__create_pull_request","acme/payments-api"]],lS=`# Rotate session tokens

1. Issue a fresh token on every login and privilege change
2. Keep the old one valid for 30s so in-flight requests finish
3. Compare tokens with timingSafeEqual
4. Add tests for reuse and expiry

Touches src/auth/session.ts and src/auth/login.ts.`,cS=["src/auth/session.ts","src/webhooks/worker.ts","src/refunds/refund.test.ts","src/charts/tokens.ts","ci/cache.yml","docs/ARCHITECTURE.md"],uS=[["dashboard","Dashboard with the new tokens"],["chart","Revenue chart, dark mode"],["diagram","How a session token flows"],["tests","Test run: 42 passed"]],dS=[["pr","Retry webhook sends with backoff","https://github.com/acme/payments-api/pull/"],["artifact","Flaky build: what broke and why","https://claude.ai/artifact/demo-"],["pr","Fix the stale CI cache key","https://github.com/acme/web-dashboard/pull/"],["artifact","Refund flow test report","https://claude.ai/artifact/demo-"],["pr","Rotate session tokens on login","https://github.com/acme/payments-api/pull/"],["artifact","Chart tokens: before and after","https://claude.ai/artifact/demo-"],["pr","Cover partial refunds with tests","https://github.com/acme/payments-api/pull/"],["link","CI run: three green builds in a row","https://github.com/acme/web-dashboard/actions/runs/"],["artifact","How webhook retries back off","https://claude.ai/artifact/demo-"]];function L0(e,t=18){let n=`hsl(${t} 62% 58%)`,i=Array.from({length:7},(o,a)=>{let r=30+(a*37+t)%70;return`<rect x="${30+a*36}" y="${150-r}" width="22" height="${r}" rx="3" fill="${a===5?n:"#cfc6b8"}"/>`}).join(""),s={dashboard:`<rect width="320" height="200" fill="#f6f2ea"/><rect width="320" height="22" fill="#2b2a2e"/><circle cx="12" cy="11" r="4" fill="#e66"/><circle cx="24" cy="11" r="4" fill="#eb4"/><circle cx="36" cy="11" r="4" fill="#5b5"/><rect x="12" y="34" width="90" height="154" rx="6" fill="#fff"/><rect x="22" y="46" width="60" height="7" rx="3" fill="${n}"/><rect x="22" y="62" width="50" height="6" rx="3" fill="#ddd"/><rect x="22" y="76" width="66" height="6" rx="3" fill="#ddd"/><rect x="112" y="34" width="196" height="70" rx="6" fill="#fff"/><path d="M122 92 L160 70 L196 80 L232 52 L270 62 L298 44" stroke="${n}" stroke-width="4" fill="none"/><rect x="112" y="114" width="94" height="74" rx="6" fill="#fff"/><rect x="214" y="114" width="94" height="74" rx="6" fill="${n}" opacity=".85"/><text x="226" y="160" font-family="sans-serif" font-size="22" font-weight="700" fill="#fff">$48k</text>`,chart:`<rect width="320" height="200" fill="#1f2433"/><text x="20" y="28" font-family="sans-serif" font-size="13" fill="#e8e2d6">Revenue by month</text>${i.replaceAll("#cfc6b8","#3c4560")}<path d="M40 120 L76 104 L112 110 L148 80 L184 86 L220 52 L256 64" stroke="#f2c14e" stroke-width="3" fill="none"/>`,diagram:`<rect width="320" height="200" fill="#fbf8f2"/><g font-family="sans-serif" font-size="11" fill="#2b2a2e"><rect x="16" y="78" width="74" height="40" rx="8" fill="#fff" stroke="${n}" stroke-width="2"/><text x="32" y="102">Login</text><rect x="124" y="30" width="74" height="40" rx="8" fill="#fff" stroke="#2b2a2e"/><text x="138" y="54">Issue</text><rect x="124" y="126" width="74" height="40" rx="8" fill="#fff" stroke="#2b2a2e"/><text x="134" y="150">Rotate</text><rect x="232" y="78" width="74" height="40" rx="8" fill="${n}"/><text x="246" y="102" fill="#fff">Verify</text></g><path d="M90 92 L124 54 M90 104 L124 140 M198 50 L232 90 M198 146 L232 106" stroke="#8a8378" stroke-width="2"/>`,tests:`<rect width="320" height="200" fill="#16181d"/><g font-family="monospace" font-size="11">${Array.from({length:9},(o,a)=>`<text x="16" y="${30+a*17}" fill="${a===8?"#a7e3a1":"#9aa3b5"}">${a===8?"\u2713 42 passed, 0 failed (3.1s)":`\u2713 refund ${["full","partial","twice","expired","currency","zero","webhook","audit"][a]} case`}</text>`).join("")}</g>`,bars:`<rect width="320" height="200" fill="#fbf8f2"/>${i}`,area:`<rect width="320" height="200" fill="#fbf8f2"/><path d="M30 150 L30 110 L80 96 L130 104 L180 70 L230 78 L290 46 L290 150 Z" fill="${n}" opacity=".35"/><path d="M30 110 L80 96 L130 104 L180 70 L230 78 L290 46" stroke="${n}" stroke-width="4" fill="none"/>`,combo:`<rect width="320" height="200" fill="#fbf8f2"/>${i}<path d="M41 120 L77 104 L113 110 L149 80 L185 86 L221 52 L257 64" stroke="#2b2a2e" stroke-width="3" fill="none"/>`}[e];return`data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">${s}</svg>`)}`}var Cf=new Map;function Pf(e,t,n){let i=Cf.get(`${e}|${t}`);return i?(Cf.delete(`${e}|${t}`),i(n),!0):!1}var kf=new Set;function D0(e){kf.add(e)}var Ni=e=>e[Math.floor(Math.random()*e.length)],Rf=e=>new Promise(t=>setTimeout(t,e)),Le=(e,t)=>e+Math.floor(Math.random()*(t-e)),hS=[{id:"/work/mobile-app",name:"acme/mobile-app",remote:"git@github.com:acme/mobile-app.git"},{id:"/work/infra",name:"acme/infra",remote:"git@github.com:acme/infra.git"}],Do=null;function N0(e,{busy:t=!1}={}){let n=0;if(Do=function(s,o,a,{asThread:r=!1,first:c=Ni(Af),job:l=null,firstAsk:u=void 0,turnsLeft:d=1/0}={}){let h=_=>e([{t:Date.now(),session:s,..._}]),f=Le(8e3,4e4),g=0,y=Le(40,180)/100,m=P0.reduce((_,[,w])=>_+w,0),p=()=>m+f;function x(){let _=p();y+=_/1e6*.05+.001,h({kind:"context.measure",context:{tokens:_,window:Lo,percent:Math.round(_/Lo*100)},costUsd:Number(y.toFixed(4)),rateLimits:[{kind:"five_hour",percentUsed:Math.min(99,Math.round(y*40))}]}),h({kind:"agent.context",tokens:_})}function b(){h({kind:"context.breakdown",window:Lo,used:p(),categories:[...P0.map(([w,P])=>({name:w,tokens:P,kind:"used"})),{name:"Messages",tokens:f,kind:"used"},{name:"Autocompact buffer",tokens:33e3,kind:"buffer"},{name:"Free space",tokens:Math.max(0,Lo-p()-33e3),kind:"free"}]})}async function v(_){let[w,P]=Ni(nS),D=`demo-tool-${++n}`;h({kind:"tool.start",agent:_,id:D,tool:w,summary:P}),await Rf(Le(400,3e3)*a),h({kind:"tool.end",agent:_,id:D,tool:w,ok:Math.random()>.12})}async function T(_,w){let[P,D]=Ni(oS),U=`demo-agent-${++n}`;h({kind:"agent.spawn",agent:U,parent:_,type:P,description:D,model:"claude-haiku-4-5",background:Math.random()>.5});let H=Le(9e3,2e4),X=Le(3,9),z=[];for(let Z=0;Z<X;Z++)w<2&&Math.random()<(w?.08:.2)&&z.push(T(U,w+1)),Z===1&&Math.random()<.4&&h({kind:"agent.message",from:_,to:U,via:"model",text:Ni(sS)}),await v(U),H+=Le(4e3,26e3),h({kind:"agent.context",agent:U,tokens:H,window:Lo,model:"claude-haiku-4-5"});await Promise.all(z),h({kind:"turn.complete",agent:U,reason:"answer",answer:`${D}: done.`}),h({kind:"agent.end",agent:U,status:"completed"})}async function S(_,w){let P=`demo-ask-${++n}`;h({kind:"ask.open",id:P,answerable:!0,..._}),l?.onAsk(!0);let D=await new Promise(U=>{Cf.set(`${s}|${P}`,U),setTimeout(()=>Pf(s,P,w),Le(45e3,75e3)*a)});return h({kind:"ask.close",id:P,answer:D}),l?.onAsk(!1),D}function A(_,w,P){h({kind:"todo.update",items:_.map((D,U)=>({text:D,status:U<w?"completed":U===w&&P?"in_progress":"pending"}))})}async function R(){for(h({kind:"session.start",cwd:o.id,model:"claude-sonnet-5-5",project:o}),x(),b();;){let _=`demo-turn-${++n}`,w=g++===0?c:Ni(Object.keys(k0));r&&(h({kind:"session.thread"}),h({kind:"agent.message",via:"projects-relay",text:w})),h({kind:"turn.start",turnId:_,text:w});let P=rS[w]??k0[w]??["Look around","Make the change","Test it"];A(P,0,!0);let D=[];for(let z=0,Z=t?Le(1,4):Le(0,3);z<Z;z++)D.push(T(void 0,0));let U=Le(0,360),H=!1;kf.delete(s);for(let z=0;z<P.length;z++){if(kf.delete(s)){H=!0;break}A(P,z,!0);for(let V=Le(1,4);V>0;V--)await v(void 0);if(f+=Le(3e3,12e3),x(),Math.random()<.45){let V=Ni(cS);h({kind:"asset.add",id:`file-${V}`,type:"file",title:V.split("/").pop(),path:V,meta:{additions:Le(4,120),deletions:Le(0,40)}})}if(Math.random()<.3){let[V,lt]=Ni(uS);h({kind:"asset.add",id:`img-${++n}`,type:"image",title:lt,path:`screenshots/${V}.png`,src:L0(V,U)})}let Z=g===1&&u!==void 0;if(z===(Z?0:1)&&(l||Z||Math.random()<.4)){let V=l?.7:Z?u:Math.random();if(V<.6){let lt=Z?I0[0]:Ni(I0),dt=[{...lt,options:lt.options.map(bt=>({...bt,...bt.preview&&{preview:L0(bt.preview,U)}}))}];await S({type:"question",questions:dt},lt.options[0].label)}else if(V<.85){let[lt,dt]=Ni(aS);await S({type:"permission",tool:lt,summary:dt},"Allowed")}else await S({type:"plan",plan:lS},"Approved")}}if(H){h({kind:"turn.complete",turnId:_,reason:"aborted",durationMs:4e3}),await Rf(Le(15e3,25e3)*a);continue}if(A(P,P.length,!1),await Promise.all(D),Math.random()<.6){let[z,Z,V]=Ni(dS),lt=Le(12,240),dt={kind:"asset.add",id:`${z}-${lt}`,type:z,title:Z,url:`${V}${lt}`,...z==="pr"&&{meta:{state:"open",additions:Le(20,300),deletions:Le(2,80)}}};h(dt),z==="pr"&&setTimeout(()=>h({...dt,meta:{...dt.meta,state:"merged"}}),Le(12e3,25e3)*a)}if(f+=Le(4e3,14e3),p()>Lo-33e3){let z=p();f=Le(9e3,16e3),h({kind:"context.compact",trigger:"auto",before:z,after:p()})}x();let X=Math.random()<.08?"error":"answer";if(h({kind:"turn.complete",turnId:_,reason:X,durationMs:9e3,...X==="answer"&&{answer:Ni(iS)}}),b(),l){l.onDone();return}if(await Rf((Math.random()<.5?Le(1500,5e3):Le(9e3,2e4))*a),g>=d){h({kind:"session.end",reason:"prompt_input_exit"});return}}}R()},Do("demo-payments-1",Ui[0],1,{first:"Harden the session handling",firstAsk:0}),setTimeout(()=>Do("demo-payments-2",Ui[0],1.6,{first:"Why is the build flaky?"}),2500),setTimeout(()=>Do("demo-dashboard-1",Ui[1],1.3,{asThread:!0,first:"Migrate charts to the new tokens",firstAsk:.9}),5e3),setTimeout(()=>Do("demo-dashboard-2",Ui[1],.8,{first:"Review the open PR",turnsLeft:1}),8e3),!t)return;let i=[...Ui,...hS];for(let s=0;s<9;s++)setTimeout(()=>Do(`demo-busy-${s+1}`,i[(s+1)%i.length],.8+s%4*.25,{first:Af[s%Af.length]}),300+s*400)}var fS=0;function U0(){return(e,t,n)=>{let i=++fS,s=`d${String(Date.now()%1e7).padStart(7,"0")}`.slice(0,8),o=Ui.find(a=>a.id===e.dir)??Ui[0];setTimeout(()=>{n({state:"working",short:s,session:`${s}-demo-job-${i}`}),Do?.(`${s}-demo-job-${i}`,o,.7,{first:t,job:{onAsk:a=>n({state:a?"blocked":"working",...a&&{waitingFor:"permission prompt"}}),onDone:()=>n({state:"done"})}})},1200)}}function O0(){let e=Date.now(),t=36e5;return[[Ui[0],"demo-past-1",3,"Fix the double-charge race",142e3,1,4.12],[Ui[0],"demo-past-2",26,"Add idempotency keys",61e3,0,1.37],[Ui[1],"demo-past-3",5,"Dark mode for the charts",188e3,2,6.5],[Ui[1],"demo-past-4",50,"Upgrade to React 19",97e3,0,2.05]].map(([n,i,s,o,a,r,c])=>({session:i,project:n,cwd:n.id,gitBranch:"main",model:"claude-sonnet-5-5",startedAt:e-s*t-2*t,endedAt:e-s*t,prompts:[{t:e-s*t-2*t,text:o},{t:e-s*t-t,text:"Now add tests for it"}],turns:2+r*6,toolCalls:Le(30,160),errors:Le(0,6),tools:{Read:40,Edit:12,Bash:20},agents:[{type:"Explore",description:"Map the code",context:41e3,tools:18}],compactions:Array.from({length:r},()=>({trigger:"auto",before:167e3})),context:a,window:Lo,costUsd:c}))}var Nc={};Tf(Nc,{BUSY_MS:()=>ny,DEFAULT_WINDOW:()=>Uf,TOOL_LINGER_MS:()=>Z0,WARN_AT:()=>Qs,agentState:()=>On,aid:()=>Oe,apply:()=>Dc,applyHistory:()=>Ha,asksOf:()=>zS,clean:()=>DS,fill:()=>Ke,helpers:()=>Fo,idOf:()=>xi,isDirty:()=>LS,lineage:()=>$a,links:()=>Xn,mail:()=>yi,mailOf:()=>zf,nodes:()=>B,notices:()=>Oo,openAsks:()=>to,outputs:()=>Zt,outputsOf:()=>$S,projects:()=>WS,promptLabel:()=>Lc,removeNode:()=>os,reset:()=>Ff,sessionsOf:()=>qS,shortId:()=>Bf,sid:()=>Ct,stats:()=>Pc,sweep:()=>Hf,teamOf:()=>as,threadState:()=>$e,toolName:()=>Bo,touch:()=>Of,visible:()=>GS,warnings:()=>$f});var pS=/^The (\S+) plugin sent a message:\s*/,mS=/^The coordinator sent a message while you were working:\s*/,gS=["This is how Claude Code surfaces a prompt a plugin submits between turns","Address this before completing your current task."],yS=e=>e.replace(/\s+/g," ").trim();function xS(e){for(let t of e.matchAll(/\s+(?=This is how\b|Address this\b)/g)){let n=yS(e.slice(t.index)).replace(/(\.\.\.|…)$/,"").trim();if(gS.some(i=>i.startsWith(n)||n.startsWith(i)))return e.slice(0,t.index)}return e}function F0(e,t){if(typeof e!="string")return{text:e};let n=pS.exec(e)??mS.exec(e);return n?{text:xS(e.slice(n[0].length)).trim(),from:n[1]??t??"a plugin"}:{text:e}}var B0=e=>typeof e=="string"&&e.trimStart().startsWith("<");var H0="agent-office:";function Wn(e,t){try{let n=globalThis.localStorage?.getItem(H0+e);return n==null?t:JSON.parse(n)}catch{return t}}function qn(e,t){try{globalThis.localStorage?.setItem(H0+e,JSON.stringify(t))}catch{}}var kc=Wn("dev-view",!1)===!0,Ve=()=>kc;function $0(e){kc=!!e,qn("dev-view",kc),globalThis.document?.dispatchEvent(new CustomEvent("office:dev-view",{detail:kc}))}var _S=new Set(["api","apis","ui","ux","cli","sdk","db","ios","css","html","js","ts","ai","ml","url","http","aws","gcp","pr","ci","id","mcp","llm","sql","json","xml","seo","crm","cms","gpu","vm","os","qa","hq","k8s","tv"]),bS=new Set(["a","an","and","of","the","for","to","in","on","or","at","by"]);function Uo(e){let n=(String(e??"").split(/[\\/]/).filter(Boolean).pop()?.replace(/\.git$/i,"")??"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").split(/[-_.\s]+/).filter(Boolean);return n.length?n.map((i,s)=>{let o=i.toLowerCase();return _S.has(o)?o==="apis"?"APIs":o==="ios"?"iOS":o==="k8s"?"K8s":o.toUpperCase():s>0&&bS.has(o)?o:i.charAt(0).toUpperCase()+i.slice(1)}).join(" "):String(e??"")||"Elsewhere"}var V0=[[/pay|bill|checkout|invoice|stripe|wallet|money|finance|bank/,"\u{1F4B3}"],[/dash|chart|metric|analytic|report|stats/,"\u{1F4CA}"],[/auth|login|secur|password|vault|key/,"\u{1F510}"],[/doc|wiki|blog|book|write|notes?\b/,"\u{1F4DA}"],[/test|qa|spec/,"\u{1F9EA}"],[/mobile|ios|android|app$/,"\u{1F4F1}"],[/game|play/,"\u{1F3AE}"],[/design|ui|style|theme|brand/,"\u{1F3A8}"],[/shop|store|cart|commerce/,"\u{1F6CD}\uFE0F"],[/bot|agent|ai|llm|ml|model/,"\u{1F916}"],[/data|db|sql|warehouse|etl/,"\u{1F5C4}\uFE0F"],[/mail|chat|message|notif/,"\u{1F4AC}"],[/web|site|www|front/,"\u{1F310}"],[/api|server|backend|service/,"\u{1F50C}"],[/infra|deploy|ops|cloud|k8s|docker|terraform/,"\u2601\uFE0F"],[/cli|tool|script|util/,"\u{1F9F0}"],[/mod|plugin|extension/,"\u{1F9E9}"]],If=["\u{1FAB4}","\u{1F98A}","\u{1F419}","\u{1F680}","\u{1F34B}","\u{1F9ED}","\u{1F388}","\u{1F41D}","\u{1F33B}","\u26F5","\u{1F989}","\u{1F344}","\u{1F422}","\u{1F308}","\u{1F52D}","\u{1F392}"],G0=[...new Set([...V0.map(([,e])=>e),...If])].slice(0,32),vS=e=>[...String(e)].reduce((t,n)=>t*31+n.charCodeAt(0)>>>0,7);function Lf(e){let t=String(e??"").split(/[\\/]/).filter(Boolean).pop()?.toLowerCase()??"";return V0.find(([n])=>n.test(t))?.[1]??If[vS(t)%If.length]}var No=Wn("projects",{})??{};function mn(e,t){return No[e]?.name||Uo(t??e)}function Js(e,t){return No[e]?.icon||Lf(t??e)}var W0=e=>!!(No[e]?.name||No[e]?.icon);function Df(e,{name:t,icon:n}={}){let i={...No},s={...t?.trim()&&{name:t.trim().slice(0,40)},...n&&{icon:n}};Object.keys(s).length?i[e]=s:delete i[e],No=i,qn("projects",No)}var wS=/^(?:(?:hey|hi|hello|ok|okay)(?:\s+claude)?[\s,!.:-]+|please\s+|pls\s+|(?:can|could|would|will)\s+(?:you|u)\s+(?:please\s+)?|i\s+(?:want|need|would like|'d like)\s+(?:you\s+)?to\s+|help\s+me\s+(?:to\s+)?|let'?s\s+|go\s+ahead\s+and\s+)/i,MS=e=>e.split(":").pop().replace(/[-_]+/g," ");function Fa(e,t){if(e.length<=t)return e;let n=e.slice(0,t-1),i=n.lastIndexOf(" ");return`${(i>t*.5?n.slice(0,i):n).replace(/[\s,;:.-]+$/,"")}\u2026`}function ss(e,t=64){let n=String(e??"").replace(/```[\s\S]*?(```|$)/g," ").replace(/<[^>]{1,200}>/g," "),i=/^\s*\/([\w:-]+)\b\s*/.exec(n);i&&(n=n.slice(i[0].length)),n=n.replace(/`([^`\n]{1,32})`/g,"$1").replace(/`[^`]*`/g," ").replace(/https?:\/\/(?:www\.)?([^/\s]+)\S*/g,"$1"),n=n.split(`
`).map(s=>s.replace(/^[\s>*#-]+/,"").trim()).find(Boolean)??"",n=n.split(/(?<=[.!?])\s+(?=[A-Z])/)[0];for(let s=0;s<3;s++)n=n.replace(wS,"");return n=n.replace(/\s+/g," ").replace(/[\s.!?,;:…]+$/,"").replace(/\s+please$/i,"").trim(),i&&(n=`${MS(i[1])}${n?` ${n}`:""}`),n?(n=n.charAt(0).toUpperCase()+n.slice(1),Fa(n,t)):""}var SS=[{key:"fresh",word:"Fresh",below:.35},{key:"busy",word:"Busy",below:.6},{key:"full",word:"Getting full",below:.8},{key:"tired",word:"Needs a break",below:1/0}],wr=e=>SS.find(t=>(e??0)<t.below),z0=e=>String(e).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]);function Ba(e,{bare:t=!1,title:n}={}){let i=wr(e),s=n??`${Math.round(e*100)}% of its context window in use`;return`<span class="energy ${i.key}" title="${z0(s)}" ${t?`role="img" aria-label="${z0(`${i.word}: ${s}`)}"`:""}><i aria-hidden="true"><b style="width:${Math.max(8,Math.round((1-e)*100))}%"></b></i>${t?"":`<span>${i.word}</span>`}</span>`}var Z0=6e3,ES=12,TS=25,AS=3e4,RS=6e4,q0=e=>e.replace(/\s+/g," ").replace(/(\.\.\.|…)$/,"").trim(),CS=(e,t)=>{let[n,i]=[q0(e),q0(t)];return n.startsWith(i)||i.startsWith(n)},Uf=2e5,Qs=.8,B=new Map,Xn=[],Pc={calls:0,errors:0},Oo=[],yi=[],kS=60,Zt=[],PS=120,Fo=[],IS=400,rs=!0,LS=()=>rs,DS=()=>{rs=!1},Of=()=>{rs=!0},J0=e=>`p:${e}`,Ct=e=>`s:${e}`,Oe=(e,t)=>`a:${e}:${t}`,X0=(e,t)=>`t:${e}:${t}`,xi=e=>typeof e=="object"?e.id:e;function Mr(e){return B.set(e.id,e),rs=!0,e}function Ic(e,t,n){Xn.push({source:e,target:t,kind:n}),rs=!0}function NS(e,t){Xn=Xn.filter(n=>!(xi(n.target)===e&&n.kind===t)),rs=!0}function os(e){B.delete(e)&&(Xn=Xn.filter(t=>xi(t.source)!==e&&xi(t.target)!==e),rs=!0)}function Ff(){for(let[e,t]of B)t.kind!=="project"&&!t.past&&B.delete(e);Xn=Xn.filter(e=>B.has(xi(e.source))&&B.has(xi(e.target))),Object.assign(Pc,{calls:0,errors:0}),Oo.length=0,yi.length=0,Zt.length=0,Fo.length=0,rs=!0}function Ke(e){let t=e.context;return t?.tokens?Math.min(1,t.tokens/(t.window||Q0(e)||Uf)):0}function Q0(e){return B.get(Ct(e.session))?.context?.window}var Lc=e=>ss(e,26)||(e.length>26?`${e.slice(0,25)}\u2026`:e),Bf=e=>e.length>14?`${e.slice(0,8)}\u2026`:e;function US(e){let t=J0(e.id),n=B.get(t)??Mr({id:t,kind:"project",projectId:e.id,label:e.name});return n.label=e.name,n.remote=e.remote,n}function Nf(e,t){!t||e.project===t.id||(US(t),NS(e.id,"project"),e.project=t.id,e.projectName=t.name,Ic(J0(t.id),e.id,"project"))}function Es(e){let t=Ct(e.session),n=B.get(t);return n?(n.past&&(n.past=!1,n.status="active",rs=!0),n):Mr({id:t,kind:"session",label:Bf(e.session),session:e.session,status:"active",startedAt:e.t,lastAt:e.t,history:0,prompts:[],compactions:[],turns:0,toolCalls:0,errors:0})}function ty(e,t){let n=Oe(e.session,t);if(B.has(n))return B.get(n);Es(e);let i=Mr({id:n,kind:"agent",label:"subagent",type:"subagent",session:e.session,agent:t,status:"active",startedAt:e.t,history:0,compactions:[]});return Ic(Ct(e.session),n,"spawn"),i}var Ss=e=>e.agent?ty(e,e.agent):Es(e);function OS(e,t,n,i){Oo.unshift({t:e.t,text:t,level:n,target:i}),Oo.length>30&&Oo.pop()}var j0=e=>`${Math.round(e/1e3)}k`,ey={"projects-relay":"Project coordinator",peer:"Another session","peer-send-message":"Another session",channel:"A channel","slack-ping":"Slack","scheduled-trigger":"A routine",bridge:"You, remotely"},FS=e=>e in ey,BS=e=>ey[e],HS={"session.start"(e){let t=Es(e);Object.assign(t,{status:"active",cwd:e.cwd,model:e.model,startedAt:t.startedAt??e.t}),Nf(t,e.project)},"session.end"(e){let t=Es(e);t.status="done",t.endedAt=e.t,t.endReason=e.reason},"turn.start"(e){let t=Ss(e);if(t.pulseAt=e.t,t.kind==="session"&&(t.turnOpen=!0,t.turnAt=e.t,t.lastReason=void 0),t.kind==="session"&&e.text){if(t.turns++,B0(e.text))return;let{text:n,from:i}=F0(e.text);if(t.prompts.some(o=>!o.live&&Math.abs(o.t-e.t)<RS&&CS(o.text,n)))return;let s=t.prompts.at(-1);if(s?.desk&&s.text===n&&e.via!=="front-desk"){s.desk=!1,t.turns--;return}t.prompts.length||(t.label=Lc(n)),t.prompts.push({t:e.t,text:n,from:i,live:!0,...e.via==="front-desk"&&{desk:!0}}),t.prompts.length>TS&&t.prompts.shift()}},"turn.complete"(e){if(e.agent&&!B.has(Oe(e.session,e.agent)))return;let t=Ss(e);e.context?.window&&(t.context=e.context),e.answer&&(t.answer={t:e.t,text:e.answer}),t.kind==="session"&&(t.turnOpen=!1,t.lastReason=e.reason,t.answeredAt=e.t)},"session.thread"(e){Es(e).thread=!0},"agent.message"(e){Es(e);let t=e.to??[...B.values()].find(a=>a.kind==="agent"&&a.session===e.session&&a.name&&a.name===e.toName)?.agent,n=e.from?Oe(e.session,e.from):FS(e.via)?null:Ct(e.session),i=t?Oe(e.session,t):e.toName?null:Ct(e.session),s=a=>B.get(a)?.kind==="session"?"Lead":B.get(a)?.label;yi.unshift({t:e.t,session:e.session,via:e.via,text:e.text,from:n,to:i,fromName:e.fromName??(n?s(n):BS(e.via)),toName:e.toName??(i?s(i):void 0)}),yi.length>kS&&yi.pop();let o=i&&B.get(i);o&&(o.mailAt=e.t)},"context.measure"(e){let t=Es(e);t.context={...t.context,...e.context},e.costUsd!==void 0&&(t.costUsd=e.costUsd),e.rateLimits&&(t.rateLimits=e.rateLimits)},"context.breakdown"(e){let t=Es(e);t.breakdown={window:e.window,used:e.used,categories:e.categories},t.context={...t.context,window:e.window,tokens:t.context?.tokens??e.used}},"agent.context"(e){if(e.agent&&!B.has(Oe(e.session,e.agent)))return;let t=Ss(e),n=e.window??t.context?.window??Q0(t)??Uf;t.context={...t.context,tokens:e.tokens,window:n},e.model&&(t.model=e.model)},"context.compact"(e){let t=Ss(e),n={t:e.t,trigger:e.trigger,before:e.before,after:e.after};t.compactions.push(n),t.compactAt=e.t,e.after!==void 0&&(t.context={...t.context,tokens:e.after});let i=e.before?` ${j0(e.before)} \u2192 ${e.after!==void 0?j0(e.after):"?"}`:"";OS(e,`${t.label} compacted (${e.trigger})${i}`,"compact",t.id)},"agent.spawn"(e){Es(e);let t=Oe(e.session,e.agent),n=e.parent?ty(e,e.parent).id:Ct(e.session),i=B.get(t);i||(i=Mr({id:t,kind:"agent",session:e.session,agent:e.agent,history:0,compactions:[]}),Ic(n,t,"spawn")),i.announced||(Fo.push({t:e.t,session:e.session,type:e.name||e.type||"subagent"}),Fo.length>IS&&Fo.shift()),Object.assign(i,{label:e.name||e.type,name:e.name,type:e.type,description:e.description,model:e.model,background:e.background,teammate:e.teammate,teammateId:e.teammateId,fork:e.fork,cwd:e.cwd,parent:n,status:"active",startedAt:e.t,announced:!0}),B.get(n).pulseAt=e.t},"agent.idle"(e){let t=B.get(Oe(e.session,e.agent));t&&(t.status="idle")},"agent.waiting"(e){let t=B.get(Oe(e.session,e.agent));t&&(t.status="waiting")},"agent.end"(e){let t=B.get(Oe(e.session,e.agent));t&&(t.status="done",t.endStatus=e.status,t.endedAt=e.t,VS())},"todo.update"(e){let t=Ss(e);t.todos=(e.items??[]).map(i=>({text:i.text,status:i.status,active:i.active})),t.todosAt=e.t;let n=t.todos.filter(i=>i.status==="completed").length;if(n!==t.todosDone){if(t.todosDone=n,!n)return;t.todosLog=[...(t.todosLog??[]).slice(-12),{kind:"todo",items:t.todos,t:e.t}]}},"ask.open"(e){let t=Ss(e);t.asks=(t.asks??[]).filter(n=>n.id!==e.id),t.asks.push({id:e.id,t:e.t,type:e.type??"question",questions:e.questions,tool:e.tool,summary:e.summary,plan:e.plan,answerable:e.answerable===!0}),t.askAt=e.t,e.type==="plan"&&e.plan&&K0(e,{id:`plan-${e.id}`,type:"plan",title:Y0(e.plan),text:e.plan})},"ask.close"(e){let t=Ss(e),n=t.asks?.find(s=>s.id===e.id);if(t.asks=(t.asks??[]).filter(s=>s.id!==e.id),!n)return;let i=n.type==="question"?n.questions?.map(s=>s.question).join(" "):n.type==="plan"?Y0(n.plan??""):`${Bo(n.tool)} ${n.summary??""}`.trim();t.answered=[...(t.answered??[]).slice(-12),{kind:"ask",type:n.type,text:i,answer:e.answer,t:n.t}]},"asset.add"(e){K0(e,e)},"tool.start"(e){let t=Ss(e);t.kind==="agent"&&t.status!=="active"&&(t.status="active");let n=X0(e.session,e.id);if(B.has(n))return;Mr({id:n,kind:"tool",label:e.tool,tool:e.tool,summary:e.summary,session:e.session,owner:t.id,status:"active",startedAt:e.t}),Ic(t.id,n,"tool"),t.lastAt=e.t,Pc.calls++;let i=B.get(Ct(e.session));i.toolCalls++,i.lastAt=e.t},"tool.end"(e){let t=B.get(X0(e.session,e.id));if(!t)return;t.status=e.ok?"ok":"error",t.endedAt=e.t,e.ok||(Pc.errors++,B.get(Ct(e.session)).errors++);let n=B.get(t.owner);n&&(n.history++,n.kind==="agent"&&(n.lastAt=e.t))}};function Bo(e){let t=/^mcp__(.+?)__(.+)$/.exec(e??"");if(!t)return e??"a tool";let n=t[1].replace(/^plugin_\w+_/,"").replace(/[-_]/g," ");return`${n.charAt(0).toUpperCase()}${n.slice(1)}: ${t[2].replace(/_/g," ")}`}var Y0=e=>e.replace(/^#+\s*/gm,"").split(`
`).find(t=>t.trim())?.trim().slice(0,80)??"Plan";function K0(e,t){let n=Ss(e),i={id:t.id,t:e.t,session:e.session,...e.agent&&{agent:e.agent},type:t.type,title:t.title,url:t.url,path:t.path,src:t.src,text:t.text,meta:t.meta},s=Zt.findIndex(a=>a.session===i.session&&a.id===i.id);s>=0&&Zt.splice(s,1),Zt.unshift(i),Zt.length>PS&&Zt.pop(),n.outputAt=e.t;let o=B.get(Ct(e.session));o&&(o.outputAt=e.t)}var $S=e=>Zt.filter(t=>t.session===e.session),zS=e=>e.asks??[],to=e=>[...B.values()].filter(t=>(t.kind==="session"||t.kind==="agent")&&t.session===e.session&&t.asks?.length).flatMap(t=>t.asks.map(n=>({...n,who:t}))).sort((t,n)=>t.t-n.t);function VS(){let e=[...B.values()].filter(t=>t.kind==="agent"&&t.status==="done").sort((t,n)=>t.endedAt-n.endedAt);for(let t of e.slice(0,Math.max(0,e.length-ES)))os(t.id)}function Dc(e){HS[e.kind]?.(e)}function Hf(e){for(let t of B.values())t.kind==="tool"&&t.endedAt&&e-t.endedAt>Z0&&os(t.id);for(let t of B.values())t.kind!=="agent"||t.announced||t.status==="done"||e-(t.lastAt??t.startedAt??0)<AS||Xn.some(n=>xi(n.source)===t.id&&n.kind==="tool")||os(t.id)}function Ha(e,t){let n=new Set;for(let i of e){let s=Ct(i.session);n.add(s);let o=B.get(s);if(o&&!o.past){!o.prompts.length&&i.prompts.length&&(o.prompts=i.prompts,o.label=Lc(i.prompts[0].text)),o.compactions.length||(o.compactions=i.compactions),o.costUsd??=i.costUsd,o.gitBranch??=i.gitBranch,o.project||Nf(o,i.project);continue}if(!t){o&&os(s);continue}let a=o??Mr({id:s,kind:"session",session:i.session,past:!0,history:0});Object.assign(a,{label:i.prompts[0]?.text?Lc(i.prompts[0].text):Bf(i.session),status:"past",past:!0,cwd:i.cwd,model:i.model,gitBranch:i.gitBranch,startedAt:i.startedAt,endedAt:i.endedAt,lastAt:i.endedAt,prompts:i.prompts,turns:i.turns,toolCalls:i.toolCalls,errors:i.errors,tools:i.tools,pastAgents:i.agents,compactions:i.compactions,costUsd:i.costUsd,context:i.context?{tokens:i.context,window:i.window}:void 0}),Nf(a,i.project)}for(let i of[...B.values()])i.past&&!n.has(i.id)&&os(i.id);for(let i of[...B.values()])i.kind==="project"&&!Xn.some(s=>xi(s.source)===i.id)&&os(i.id);rs=!0}function GS(e){let t=[...B.values()];if(!e)return{nodes:t,links:[...Xn]};let n=new Set;for(let i of t)(i.kind==="project"?i.projectId:B.get(Ct(i.session))?.project)===e&&n.add(i.id);return{nodes:t.filter(i=>n.has(i.id)),links:Xn.filter(i=>n.has(xi(i.source))&&n.has(xi(i.target)))}}function WS(){return[...B.values()].filter(e=>e.kind==="project").sort((e,t)=>e.label.localeCompare(t.label))}function qS(e){return[...B.values()].filter(t=>t.kind==="session"&&t.project===e).sort((t,n)=>Number(t.past)-Number(n.past)||(n.lastAt??0)-(t.lastAt??0))}function $f(){return[...B.values()].filter(e=>(e.kind==="session"||e.kind==="agent")&&!e.past&&e.status!=="done"&&Ke(e)>=Qs).sort((e,t)=>Ke(t)-Ke(e))}var ny=2500;function $e(e,t=new Set){return e.past||e.status==="done"?"ended":e.kind==="session"&&to(e).length?"asking":e.turnOpen||t.has(e.id)||Date.now()-(e.lastAt??0)<ny?"working":e.lastReason&&e.lastReason!=="answer"?"stuck":"waiting"}function On(e){return e.status==="done"?e.endStatus==="failed"||e.endStatus==="killed"?"failed":"done":e.status==="idle"?"idle":e.status==="waiting"?"waiting":"working"}function as(e){let t=[...B.values()].filter(s=>s.kind==="agent"&&s.session===e.session),n=new Map;for(let s of t){let o=s.parent??e.id;n.has(o)||n.set(o,[]),n.get(o).push(s)}let i=s=>(n.get(s)??[]).sort((o,a)=>(o.startedAt??0)-(a.startedAt??0)).map(o=>({node:o,children:i(o.id)}));return i(e.id)}function $a(e){let t=[],n=e;for(;n&&n.kind==="agent";)t.unshift(n),n=B.get(n.parent??Ct(n.session));return n&&t.unshift(n),t}var zf=e=>yi.filter(t=>t.session===e.session);var Vc={};Tf(Vc,{activity:()=>Bn,ago:()=>Ae,beadColor:()=>Yf,doingNow:()=>Kf,escapeHtml:()=>k,family:()=>Hc,ingest:()=>$c,lastAction:()=>Xf,momentText:()=>zc,moments:()=>Fn,quote:()=>Se,reset:()=>jf,say:()=>za});var XS={read:["Reading","Read","read"],look:["Looking","Looked","look"],search:["Searching","Searched","search"],change:["Changing","Changed","change"],write:["Writing","Wrote","write"],check:["Checking","Checked","check"],build:["Building","Built","build"],install:["Installing","Installed","install"],save:["Saving","Saved","save"],send:["Sending","Sent","send"],fetch:["Fetching","Fetched","fetch"],switch:["Switching","Switched","switch"],tidy:["Tidying","Tidied","tidy"],run:["Running","Ran","run"],hand:["Handing","Handed","hand"],update:["Updating","Updated","update"],ask:["Asking","Asked","ask"],share:["Sharing","Shared","share"],use:["Using","Used","use"],make:["Making","Made","make"],clean:["Cleaning","Cleaned","clean"],create:["Creating","Created","create"],remove:["Removing","Removed","remove"],start:["Starting","Started","start"],move:["Moving","Moved","move"],wait:["Waiting","Waited","wait"]},Me=(e,t)=>{let[n,i,s]=XS[e],o=t?` ${t}`:"";return{now:`${n}${o}`,done:`${i}${o}`,fail:`Couldn\u2019t ${s}${o}`}},jS=[[/\b(auth|login|logout|session|signin|sign-in|oauth|password|token)s?\b/i,"sign-in"],[/\b(refund)s?\b/i,"refund"],[/\b(payment|billing|charge|invoice|checkout|stripe)s?\b/i,"payment"],[/\b(webhook)s?\b/i,"webhook"],[/\b(chart|graph|plot)s?\b/i,"chart"],[/\b(dashboard)s?\b/i,"dashboard"],[/\b(user|account|profile)s?\b/i,"account"],[/\b(api|route|handler|endpoint|controller)s?\b/i,"API"],[/\b(db|database|migration|schema)s?\b/i,"database"],[/\b(email|mail|notification)s?\b/i,"notification"],[/\b(search)\b/i,"search"],[/\b(cache)\b/i,"caching"],[/\b(worker|queue|job)s?\b/i,"background job"],[/\b(ui|component|view|page|screen|widget)s?\b/i,"screen"],[/\b(util|helper|lib)s?\b/i,"helper"]],YS=e=>String(e).split(/[\\/]/).filter(Boolean).pop()??String(e),KS=e=>e.replace(/\.[^.]+$/,"").replace(/([a-z])([A-Z])/g,"$1 $2").replace(/[-_.]+/g," ").trim().toLowerCase();function iy(e){let t=String(e).split(/[\\/]/).filter(Boolean),n=t.pop()??"";for(let i of[...t.reverse(),n]){let s=jS.find(([o])=>o.test(i.replace(/([a-z])([A-Z])/g,"$1 $2").replace(/[._-]/g," ")));if(s)return s[1]}return null}function Sr(e){let t=String(e??"").replace(/^https?:\/\/\S+/,"");if(!t)return"a file";let n=YS(t);if(/(^|[\\/])readme(\.\w+)?$/i.test(t))return"the readme";if(/changelog/i.test(n))return"the changelog";if(/(^|[\\/])(package(-lock)?\.json|tsconfig[\w.]*\.json|pyproject\.toml|cargo\.toml|go\.mod|requirements\.txt|\.env[\w.]*|[\w.-]*config\.[cm]?[jt]s|\.eslintrc[\w.]*)$/i.test(t))return"the project settings";if(/(^|[\\/])(\.github|ci|\.circleci)[\\/]|\.ya?ml$|dockerfile/i.test(t))return"the build setup";if(/\.(test|spec)\.\w+$|(^|[\\/])(__tests__|tests?)[\\/]/i.test(t)){let o=iy(t);return o?`the ${o} tests`:"the tests"}if(/\.(md|mdx|rst|txt)$/i.test(n)||/(^|[\\/])docs?[\\/]/i.test(t))return"the docs";if(/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(n))return"a picture";if(/\.(css|scss|sass|less)$/i.test(n))return"the styling";if(/\.(json|csv|tsv|xml)$/i.test(n))return"some data";if(/\.(sh|bash|zsh|ps1)$/i.test(n))return"a script";if(/\.ipynb$/i.test(n))return"a notebook";let i=iy(t);if(i)return`the ${i} code`;let s=KS(n);return s?`the ${s} code`:"a file"}function ZS(e){let t=String(e??"");return/test|spec/i.test(t)?"test files":/\.(md|mdx|rst|txt)\b/i.test(t)?"docs":/\.(png|jpe?g|gif|svg|webp)\b/i.test(t)?"pictures":/\.(css|scss|less)\b/i.test(t)?"stylesheets":/\.(json|ya?ml|toml)\b/i.test(t)||/config/i.test(t)?"settings files":/\.\w+\b/.test(t)?"code files":"files"}var sy=(e,t=28)=>{let n=String(e).replace(/\s+/g," ").trim();return`\u201C${n.length>t?`${n.slice(0,t-1)}\u2026`:n}\u201D`},JS=e=>/^[\w .:'-]{2,40}$/.test(e),QS=[[/\b(npm|pnpm|yarn|bun)\s+(run\s+)?test\b|\b(jest|vitest|mocha|pytest|rspec|phpunit|playwright test)\b|\b(go|cargo|deno|dotnet|mix|swift)\s+test\b|node\s+--test|\bmake\s+test\b|\btox\b/i,["check","the tests"]],[/\b(eslint|prettier|ruff|black|flake8|rubocop|gofmt|clippy|stylelint)\b|\b(npm|pnpm|yarn)\s+(run\s+)?(lint|format|fmt)\b/i,["tidy","the code"]],[/\b(tsc|typecheck|mypy|pyright)\b/i,["check","the types"]],[/\b(npm|pnpm|yarn|bun)\s+(run\s+)?build\b|\b(cargo|go|swift)\s+build\b|\bmake\b|\b(webpack|vite build|esbuild|rollup|gradle|mvn)\b/i,["build","the project"]],[/\b(npm|pnpm|yarn|bun)\s+(ci|install|i|add)\b|\bpip3?\s+install\b|\bbrew\s+install\b|\bapt(-get)?\s+install\b|\bcargo\s+add\b|\bgo\s+get\b|\bbundle\s+install\b/i,["install","what the project needs"]],[/\b(npm|pnpm|yarn)\s+(run\s+)?(dev|start|serve)\b|\b(serve|http-server|uvicorn|flask run|rails s)\b/i,["start","the app"]],[/\bgit\s+(diff|status|show)\b/i,["look","over the changes"]],[/\bgit\s+(log|blame|reflog)\b/i,["look","back through the history"]],[/\bgit\s+commit\b/i,["save","a checkpoint"]],[/\bgit\s+push\b/i,["send","the changes up"]],[/\bgit\s+(pull|fetch|clone)\b/i,["fetch","the latest code"]],[/\bgit\s+(checkout|switch|branch)\b/i,["switch","branches"]],[/\bgit\s+(add|stash|restore|reset|rebase|merge|cherry-pick)\b/i,["tidy","up the changes"]],[/\bgh\s+pr\b/i,["update","the pull request"]],[/\bgh\s+(issue|run|api)\b/i,["check","GitHub"]],[/\b(docker|podman|kubectl)\b/i,["run","the containers"]],[/\b(curl|wget|http)\b/i,["fetch","a web page"]],[/^\s*(rm|rmdir)\b/i,["clean","up some files"]],[/^\s*(mkdir|touch)\b/i,["make","a new folder"]],[/^\s*(mv|cp)\b/i,["move","some files"]],[/^\s*(ls|find|tree|du|pwd)\b/i,["look","around the files"]],[/^\s*(cat|head|tail|less|wc|grep|rg|sed -n)\b/i,["read","some files"]],[/^\s*(sleep|wait)\b/i,["wait","a moment"]],[/^\s*(node|python3?|ruby|deno|bun|tsx|ts-node|bash|sh)\s+\S/i,["run","a script"]]];function tE(e){let t=String(e??"").trim(),n=t.split(/\s*(?:&&|\|\||;|\|)\s*/).filter(i=>i&&!/^(cd|export|set|source|\.)\b/.test(i));for(let i of n.length?n:[t]){let s=QS.find(([o])=>o.test(i));if(s)return Me(...s[1])}return Me("run","a command")}var oy={github:"GitHub",gitlab:"GitLab",slack:"Slack",linear:"Linear",notion:"Notion",jira:"Jira",atlassian:"Atlassian",figma:"Figma",gmail:"Gmail",google_drive:"Google Drive",sentry:"Sentry",stripe:"Stripe",asana:"Asana",datadog:"Datadog",postgres:"the database",playwright:"the browser",claude_in_chrome:"the browser"};function eE(e){let t=String(e??"").replace(/^plugin_\w+?_/,"").toLowerCase();if(oy[t])return oy[t];let n=t.replace(/[-_]+/g," ").trim();return n?n.replace(/\b\w/g,i=>i.toUpperCase()):"an app"}function nE(e){let[,t="",n=""]=String(e).split("__"),i=eE(t),[s,...o]=n.split(/[_-]+/).filter(Boolean),a=o.join(" ").replace(/\bprs?\b/i,"pull requests").trim(),r=a?`${a} on ${i}`:i;switch((s??"").toLowerCase()){case"list":case"get":case"read":case"search":case"find":case"query":case"fetch":case"view":return Me("look",`at ${r}`);case"create":case"add":case"open":case"new":return Me("create",a?`${/^[aeiou]/i.test(a)?"an":"a"} ${a.replace(/s$/,"")} on ${i}`:`something on ${i}`);case"update":case"edit":case"set":case"patch":case"merge":return Me("update",r);case"delete":case"remove":case"close":case"trash":return Me("remove",r);case"send":case"post":case"reply":case"comment":return Me("send",a?`a ${a.replace(/s$/,"")} on ${i}`:`a message on ${i}`);default:return Me("use",i)}}function _i(e,t){let n=String(e??""),i=t==null?"":String(t);if(n.startsWith("mcp__"))return nE(n);switch(n){case"Read":case"NotebookRead":return Me("read",Sr(i));case"Edit":case"MultiEdit":case"NotebookEdit":return Me("change",Sr(i));case"Write":return Me("write",Sr(i));case"Grep":return i&&JS(i)?Me("search",`the code for ${sy(i)}`):Me("search","through the code");case"Glob":return Me("look",`for ${ZS(i)}`);case"LS":return Me("look","around the files");case"WebFetch":{let s=/^https?:\/\/(?:www\.)?([^/\s]+)/i.exec(i)?.[1];return Me("read",s?`a page on ${s}`:"a web page")}case"WebSearch":return Me("search",i?`the web for ${sy(i)}`:"the web");case"Bash":case"PowerShell":return tE(i);case"BashOutput":return Me("check","on a running command");case"KillShell":case"KillBash":return Me("remove","a running command");case"Task":case"Agent":return Me("hand","work to a helper");case"TodoWrite":case"TaskCreate":case"TaskUpdate":return Me("update","its checklist");case"AskUserQuestion":return Me("ask","you something");case"ExitPlanMode":return Me("share","a plan");case"Skill":return Me("use",i?`the ${i} skill`:"a skill");case"SendMessage":return Me("send","a message");case"":return Me("use","a tool");default:return Me("use",n.replace(/([a-z])([A-Z])/g,"$1 $2").toLowerCase())}}var Vf=(e,t,n=`${t}s`)=>`${e===1?"a":e} ${e===1?t:n}`,iE=e=>e.length<2?e.join(""):`${e.slice(0,-1).join(", ")} and ${e.at(-1)}`;function Gf(e){if(!e.length)return"";if(e.length===1){let u=_i(e[0].tool,e[0].summary);return e[0].ok===!1?u.fail:e[0].ok===void 0?u.now:u.done}let t=new Set,n=new Set,i=new Set,s=0,o=0,a=0,r=[];for(let u of e){let d=u.summary??"";switch(u.tool){case"Read":case"NotebookRead":t.add(d);break;case"Edit":case"MultiEdit":case"NotebookEdit":n.add(d);break;case"Write":i.add(d);break;case"Grep":case"Glob":case"LS":s++;break;case"WebFetch":case"WebSearch":o++;break;case"Task":case"Agent":a++;break;case"Bash":case"PowerShell":{let h=_i(u.tool,d).done,f=(h.charAt(0).toLowerCase()+h.slice(1)).replace(/^checked the tests$/,"ran the tests");r.includes(f)||r.push(f);break}default:{let h=_i(u.tool,d).done,f=h.charAt(0).toLowerCase()+h.slice(1);r.includes(f)||r.push(f)}}}let c=[];t.size&&c.push(t.size===1?`read ${Sr([...t][0])}`:`looked through ${t.size} files`),s&&c.push(s===1?"searched the code":s===2?"searched the code twice":`searched the code ${s} times`),n.size&&c.push(`changed ${Vf(n.size,"file")}`),i.size&&c.push(`wrote ${Vf(i.size,"new file")}`),o&&c.push(`read ${Vf(o,"web page")}`),a&&c.push(a===1?"brought in a helper":`brought in ${a} helpers`),r.length<=3?c.push(...r):c.push(`ran ${r.length} commands`);let l=iE(c.slice(0,4))+(c.length>4?" and more":"");return l.charAt(0).toUpperCase()+l.slice(1)}var Ho=["Mika","Juno","Ravi","Aiko","Nia","Theo","Lena","Omar","Priya","Kofi","Sana","Milo","Ines","Tariq","Yuki","Ada","Bruno","Cleo","Dev","Elif","Femi","Gia","Hana","Ivo","Jada","Kai","Lumi","Mateo","Noor","Olu","Pia","Quinn","Rumi","Sol","Tavi","Uma","Wren","Yara","Zuri","Arlo","Bea","Chidi","Dara","Esme","Fern","Ilan","Kenji","Lila","Mira","Nico","Remy","Suki","Tomas","Ama","Bodhi","Rafa","Anouk","Leif","Maya","Oren","Tala","Vera","Ezra","Luca"],sE={session:"Lead",Explore:"Researcher",Plan:"Planner","code-reviewer":"Reviewer","test-runner":"Tester","general-purpose":"Builder"};function ry(e){let t=2166136261;for(let n of String(e??""))t^=n.charCodeAt(0),t=Math.imul(t,16777619)>>>0;return t}var ay=e=>Ho[ry(e)%Ho.length],oE=e=>sE[e]??(e?"Helper":"Lead"),Wf=new Map;function rE(e,t){Wf.has(e)||Wf.set(e,new Map);let n=Wf.get(e);if(n.has(t))return n.get(t);let i=new Set([ay(e),...n.values()]),s=ry(`${e}|${t}`)%Ho.length,o=Ho[s];for(let a=1;a<Ho.length&&i.has(o);a++)o=Ho[(s+a)%Ho.length];return n.set(t,o),o}function qe(e){if(!e)return{name:"",role:"",title:""};if(e.kind==="session"){let i=ay(e.session);return{name:i,role:"Lead",title:`${i} the Lead`}}let t=oE(e.type),n=e.name||rE(e.session,e.agent);return{name:n,role:t,title:`${n} the ${t}`}}var aE=30,lE=40,Fn=[],Bn=new Map,Xf=null;function jf(){Fn.length=0,Bc.clear(),Bn.clear(),Xf=null}function k(e){return String(e??"").replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t])}var Se=e=>`\u201C${e}\u201D`,cE=e=>String(e).split(/[\\/]/).filter(Boolean).pop()??e,uE=[{test:e=>["Read","NotebookRead"].includes(e),done:"read",try:"read",bead:"sky",file:"read"},{test:e=>["Edit","MultiEdit","Write","NotebookEdit"].includes(e),done:"edited",try:"edit",bead:"coral",file:"edit"},{test:e=>["Grep","Glob","LS"].includes(e),done:"searched for",try:"search for",bead:"leaf"},{test:e=>["WebFetch","WebSearch"].includes(e),done:"looked up",try:"look up",bead:"lilac"},{test:e=>["Bash","BashOutput","PowerShell"].includes(e),done:"ran",try:"run",bead:"mustard"},{test:e=>["Task","Agent"].includes(e),done:"handed off",try:"hand off",bead:"teal"},{test:e=>e==="TodoWrite",done:"updated its todo list",try:"update its todo list",bead:"line",bare:!0},{test:e=>e.startsWith("mcp__"),mcp:!0,bead:"lilac"}];function Hc(e){return uE.find(t=>t.test(e??""))??{done:"used",try:"use",bead:"line",other:!0}}var Yf=e=>Hc(e).bead;function dE(e,t,n){let i=Hc(e);if(i.mcp){let[,a,r]=e.split("__");return`${n?"used":"couldn\u2019t use"} ${a}\u2019s ${r??"tool"}`}if(i.bare)return n?i.done:`couldn\u2019t ${i.try}`;let s=i.file&&t?cE(t):t??(i.other?e:""),o=i.other?`${e}${t?` on ${t}`:""}`:s;return`${n?i.done:`couldn\u2019t ${i.try}`} ${o}`.trim()}var Sn=e=>B.get(Ct(e))?.label??"A session",Uc=e=>e.agent?B.get(Oe(e.session,e.agent))?.label??"A subagent":"The session",Oc=e=>{let t=e.agent&&B.get(Oe(e.session,e.agent));return t?qe(t).name:e.agent?"A helper":"The session"};function En(e,t,n="",i=Ct(e.session),s,o){let a={t:e.t,text:t,tone:n,target:i,...s&&{raw:s},...o};return Fn.unshift(a),Fn.length>lE&&Fn.pop(),a}var Fc=e=>Fn.find(t=>t.key===e);function hE(e,t){Fn.splice(Fn.indexOf(e),1),Fn.unshift(e),e.t=t}var Bc=new Map,qf=(e,t)=>{let n=String(e).replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1).replace(/\s+\S*$/,"")}\u2026`:n},ly={image:"a picture",artifact:"a page",pr:"a pull request",link:"a link"};function fE(e,t,n){let i=`bumps:${e.session}:${Bc.get(e.session)??0}`,s=Fc(i);s?hE(s,e.t):s=En(e,"","bumps",Ct(e.session),void 0,{key:i,bumps:[]}),s.bumps.unshift({t:e.t,text:t.plain,raw:n}),s.bumps.length>12&&s.bumps.pop();let o=s.bumps.length;s.text=`${o===1?"A bump":`${o} bumps`} along the way in ${Se(Sn(e.session))}`}function pE(e){let t=Ct(e.session),n=Bn.get(t);return n||Bn.set(t,n={actions:[],files:new Map}),n}var Er=new Map,cy=e=>e.charAt(0).toLowerCase()+e.slice(1);function mE(e,t,n){let i=_i(t,n),s=e.ok?i.done:i.fail;return e.agent?`${Oc(e)} ${cy(s)}`:s}var za=e=>Ve()?e.text:e.plain??e.text;function Kf(e){for(let t of B.values())if(!(t.kind!=="tool"||t.status!=="active"||t.owner!==e))return Ve()?`${t.tool}${t.summary?` ${t.summary}`:""}`:_i(t.tool,t.summary).now;return null}function $c(e){switch(e.kind){case"tool.start":{Er.set(`${e.session}:${e.id}`,{tool:e.tool,summary:e.summary}),Er.size>500&&Er.delete(Er.keys().next().value);break}case"tool.end":{let t=`${e.session}:${e.id}`,n=Er.get(t)??{tool:e.tool};Er.delete(t);let i=n.tool??e.tool,s=`${Uc(e)} ${dE(i,n.summary,e.ok)}`,o=pE(e);o.actions.unshift({t:e.t,text:s,plain:mE(e,i,n.summary),ok:e.ok,tool:i,summary:n.summary,agent:e.agent}),o.actions.length>aE&&o.actions.pop();let a=Hc(n.tool??e.tool);if(a.file&&n.summary){let r=o.files.get(n.summary)??{reads:0,edits:0,t:0};a.file==="edit"?r.edits++:r.reads++,r.t=e.t,o.files.set(n.summary,r)}Xf={session:Ct(e.session),text:s,plain:o.actions[0].plain},e.ok||fE(e,o.actions[0],s);break}case"agent.spawn":En(e,`${Se(Sn(e.session))} brought in ${qe({kind:"agent",session:e.session,agent:e.agent,type:e.type,name:e.name}).title}${e.description?` to ${cy(e.description)}`:""}.`,"quiet",Oe(e.session,e.agent),`${Se(Sn(e.session))} started ${/^[aeiou]/i.test(e.type??"")?"an":"a"} ${e.name||e.type} subagent${e.description?`: ${e.description}`:""}.`);break;case"agent.end":{let t=B.get(Oe(e.session,e.agent));if(t){let n=t.endStatus==="failed"||t.endStatus==="killed",i=s=>n?`${s} stopped before finishing its work for ${Se(Sn(e.session))}.`:`${s} finished its work for ${Se(Sn(e.session))}.`;En(e,i(qe(t).title),"quiet",void 0,i(t.label))}break}case"agent.message":{let t=yi[0];if(!t||t.t!==e.t||t.session!==e.session)break;let n=t.fromName==="Lead"?"The lead":t.fromName??"Someone",i=t.toName==="Lead"?Se(Sn(e.session)):t.toName??"someone";En(e,`${n} \u2192 ${i}${t.text?`: ${t.text}`:""}`,"mail",t.to??t.from??Ct(e.session));break}case"session.thread":{let t=B.get(Ct(e.session));t&&!t.threadAnnounced&&(t.threadAnnounced=!0,En(e,`${Se(Sn(e.session))} is working as a thread of a claude.ai project.`,"mail"));break}case"context.compact":En(e,`${e.agent?Oc(e):Se(Sn(e.session))} tidied up its memory and has room again.`,"quiet",void 0,`${e.agent?Uc(e):Se(Sn(e.session))} compacted its context and has room again.`);break;case"session.start":En(e,`A session started in ${e.project?mn(e.project.id,e.project.name):"a new folder"}.`,"quiet");break;case"session.end":En(e,`${Se(Sn(e.session))} ended.`,"quiet");break;case"turn.start":{if(e.agent)break;Bc.set(e.session,(Bc.get(e.session)??0)+1);let t=Fc(`stuck:${e.session}`);t&&(t.tone="cleared",t.key=void 0);break}case"turn.complete":{if(e.agent)break;let t=Se(Sn(e.session));e.reason==="answer"||!e.reason?En(e,`${t} finished${e.answer?`: ${qf(e.answer,110)}`:"."}`,"done"):e.reason==="aborted"?En(e,`You stopped ${t}.`,"quiet"):En(e,`${t} stopped on ${e.reason==="refusal"?"a refusal":"an error"} and needs a look.`,"block",void 0,void 0,{key:`stuck:${e.session}`});break}case"asset.add":{if(!ly[e.type])break;let t=`made:${e.session}:${e.id}`;if(Fc(t))break;let n=i=>`${i} made ${ly[e.type]}${e.title?`: ${qf(e.title,70)}`:"."}`;En(e,n(e.agent?Oc(e):Se(Sn(e.session))),"made",e.agent?Oe(e.session,e.agent):Ct(e.session),e.agent?n(Uc(e)):void 0,{key:t});break}case"ask.open":{let t=n=>e.type==="permission"?`${n} is waiting for your OK to go on.`:e.type==="plan"?`${n} has a plan for you to approve.`:`${n} asked you: ${qf(e.questions?.[0]?.question??"a question",90)}`;En(e,t(e.agent?Oc(e):Se(Sn(e.session))),"block",e.agent?Oe(e.session,e.agent):Ct(e.session),e.agent?t(Uc(e)):void 0,{key:`ask:${e.session}:${e.id}`,ask:!0});break}case"ask.close":{let t=Fc(`ask:${e.session}:${e.id}`);if(!t)break;t.tone="ask",t.key=void 0,e.answer&&(t.answer=String(e.answer));break}case"chat.sent":En(e,`You messaged ${e.agent?B.get(Oe(e.session,e.agent))?.label??"a subagent":Se(Sn(e.session))}.`,"quiet",e.agent?Oe(e.session,e.agent):Ct(e.session));break;case"stop.sent":En(e,`You asked ${Se(Sn(e.session))} to stop.`,"note",Ct(e.session));break;case"chat.delivered":e.ok===!1&&En(e,`Your message to ${e.agent?B.get(Oe(e.session,e.agent))?.label??"a subagent":Se(Sn(e.session))} couldn't be delivered${e.how?`: ${e.how}`:""}.`,"bad",e.agent?Oe(e.session,e.agent):Ct(e.session));break}}var zc=e=>Ve()&&e.raw?e.raw:e.text;function Ae(e,t=Date.now()){if(!e)return"";let n=Math.max(0,Math.round((t-e)/1e3));return n<5?"just now":n<60?`${n}s ago`:n<3600?`${Math.round(n/60)}m ago`:n<86400?`${Math.round(n/3600)}h ago`:`${Math.round(n/86400)}d ago`}var Oh={};Tf(Oh,{animate:()=>Lg,capture:()=>Fg,critterAt:()=>Og,debug:()=>ZP,focusOn:()=>Dh,focusProject:()=>Uh,landmarks:()=>Ug,level:()=>qs,mount:()=>Eg,pct:()=>Xs,pulse:()=>Ig,roomKey:()=>Fs,sessionTint:()=>Pi,setHover:()=>Nh,setInsets:()=>Lh,setPower:()=>Dg,setSelected:()=>Ng,sync:()=>Pg,tintOf:()=>To});var Si={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Vi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Ny=0,Cp=1,Uy=2;var kp=1,Lu=2,fs=3,Is=0,yn=1,Kn=2,Ds=0,qo=1,Pp=2,Ip=3,Lp=4,Oy=5,lo=100,Fy=101,By=102,Hy=103,$y=104,zy=200,Vy=201,Gy=202,Wy=203,uu=204,du=205,qy=206,Xy=207,jy=208,Yy=209,Ky=210,Zy=211,Jy=212,Qy=213,tx=214,Du=0,Nu=1,Uu=2,Xo=3,Ou=4,Fu=5,Bu=6,Hu=7,$u=0,ex=1,nx=2,Ns=0,ix=1,sx=2,ox=3,rx=4,ax=5,lx=6,cx=7;var Dp=300,Qo=301,tr=302,zu=303,Vu=304,wl=306,$r=1e3,ls=1001,hu=1002,jn=1003,ux=1004;var Ml=1005;var $i=1006,Gu=1007;var fo=1008;var Gi=1009,Np=1010,Up=1011,ta=1012,Wu=1013,po=1014,Wi=1015,ea=1016,qu=1017,Xu=1018,na=1020,Op=35902,Fp=35899,Bp=1021,Hp=1022,Ei=1023,zr=1026,ia=1027,ju=1028,Yu=1029,$p=1030,Ku=1031;var Zu=1033,Sl=33776,El=33777,Tl=33778,Al=33779,Ju=35840,Qu=35841,td=35842,ed=35843,nd=36196,id=37492,sd=37496,od=37808,rd=37809,ad=37810,ld=37811,cd=37812,ud=37813,dd=37814,hd=37815,fd=37816,pd=37817,md=37818,gd=37819,yd=37820,xd=37821,_d=36492,bd=36494,vd=36495,wd=36283,Md=36284,Sd=36285,Ed=36286;var Ja=2300,fu=2301,cu=2302,bp=2400,vp=2401,wp=2402;var dx=3200,hx=3201;var Td=0,fx=1,qi="",Xe="srgb",jo="srgb-linear",Qa="linear",pe="srgb";var Wo=7680;var Mp=519,px=512,mx=513,gx=514,zp=515,yx=516,xx=517,_x=518,bx=519,Sp=35044;var Vp="300 es",Hi=2e3,tl=2001;var cs=class{addEventListener(t,n){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(n)===-1&&i[t].push(n)}hasEventListener(t,n){let i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(n)!==-1}removeEventListener(t,n){let i=this._listeners;if(i===void 0)return;let s=i[t];if(s!==void 0){let o=s.indexOf(n);o!==-1&&s.splice(o,1)}}dispatchEvent(t){let n=this._listeners;if(n===void 0)return;let i=n[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let o=0,a=s.length;o<a;o++)s[o].call(this,t);t.target=null}}},Tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],uy=1234567,Ka=Math.PI/180,Vr=180/Math.PI;function sa(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Tn[e&255]+Tn[e>>8&255]+Tn[e>>16&255]+Tn[e>>24&255]+"-"+Tn[t&255]+Tn[t>>8&255]+"-"+Tn[t>>16&15|64]+Tn[t>>24&255]+"-"+Tn[n&63|128]+Tn[n>>8&255]+"-"+Tn[n>>16&255]+Tn[n>>24&255]+Tn[i&255]+Tn[i>>8&255]+Tn[i>>16&255]+Tn[i>>24&255]).toLowerCase()}function Yt(e,t,n){return Math.max(t,Math.min(n,e))}function Gp(e,t){return(e%t+t)%t}function gE(e,t,n,i,s){return i+(e-t)*(s-i)/(n-t)}function yE(e,t,n){return e!==t?(n-e)/(t-e):0}function Za(e,t,n){return(1-n)*e+n*t}function xE(e,t,n,i){return Za(e,t,1-Math.exp(-n*i))}function _E(e,t=1){return t-Math.abs(Gp(e,t*2)-t)}function bE(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function vE(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function wE(e,t){return e+Math.floor(Math.random()*(t-e+1))}function ME(e,t){return e+Math.random()*(t-e)}function SE(e){return e*(.5-Math.random())}function EE(e){e!==void 0&&(uy=e);let t=uy+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function TE(e){return e*Ka}function AE(e){return e*Vr}function RE(e){return(e&e-1)===0&&e!==0}function CE(e){return Math.pow(2,Math.ceil(Math.log(e)/Math.LN2))}function kE(e){return Math.pow(2,Math.floor(Math.log(e)/Math.LN2))}function PE(e,t,n,i,s){let o=Math.cos,a=Math.sin,r=o(n/2),c=a(n/2),l=o((t+i)/2),u=a((t+i)/2),d=o((t-i)/2),h=a((t-i)/2),f=o((i-t)/2),g=a((i-t)/2);switch(s){case"XYX":e.set(r*u,c*d,c*h,r*l);break;case"YZY":e.set(c*h,r*u,c*d,r*l);break;case"ZXZ":e.set(c*d,c*h,r*u,r*l);break;case"XZX":e.set(r*u,c*g,c*f,r*l);break;case"YXY":e.set(c*f,r*u,c*g,r*l);break;case"ZYZ":e.set(c*g,c*f,r*u,r*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Br(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw new Error("Invalid component type.")}}function Hn(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw new Error("Invalid component type.")}}var Us={DEG2RAD:Ka,RAD2DEG:Vr,generateUUID:sa,clamp:Yt,euclideanModulo:Gp,mapLinear:gE,inverseLerp:yE,lerp:Za,damp:xE,pingpong:_E,smoothstep:bE,smootherstep:vE,randInt:wE,randFloat:ME,randFloatSpread:SE,seededRandom:EE,degToRad:TE,radToDeg:AE,isPowerOfTwo:RE,ceilPowerOfTwo:CE,floorPowerOfTwo:kE,setQuaternionFromProperEuler:PE,normalize:Hn,denormalize:Br},At=class e{constructor(t=0,n=0){e.prototype.isVector2=!0,this.x=t,this.y=n}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,n){return this.x=t,this.y=n,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let n=this.x,i=this.y,s=t.elements;return this.x=s[0]*n+s[3]*i+s[6],this.y=s[1]*n+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,n){return this.x=Yt(this.x,t.x,n.x),this.y=Yt(this.y,t.y,n.y),this}clampScalar(t,n){return this.x=Yt(this.x,t,n),this.y=Yt(this.y,t,n),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Yt(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let n=Math.sqrt(this.lengthSq()*t.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(t)/n;return Math.acos(Yt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let n=this.x-t.x,i=this.y-t.y;return n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this}rotateAround(t,n){let i=Math.cos(n),s=Math.sin(n),o=this.x-t.x,a=this.y-t.y;return this.x=o*i-a*s+t.x,this.y=o*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},wi=class{constructor(t=0,n=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=n,this._z=i,this._w=s}static slerpFlat(t,n,i,s,o,a,r){let c=i[s+0],l=i[s+1],u=i[s+2],d=i[s+3],h=o[a+0],f=o[a+1],g=o[a+2],y=o[a+3];if(r===0){t[n+0]=c,t[n+1]=l,t[n+2]=u,t[n+3]=d;return}if(r===1){t[n+0]=h,t[n+1]=f,t[n+2]=g,t[n+3]=y;return}if(d!==y||c!==h||l!==f||u!==g){let m=1-r,p=c*h+l*f+u*g+d*y,x=p>=0?1:-1,b=1-p*p;if(b>Number.EPSILON){let T=Math.sqrt(b),S=Math.atan2(T,p*x);m=Math.sin(m*S)/T,r=Math.sin(r*S)/T}let v=r*x;if(c=c*m+h*v,l=l*m+f*v,u=u*m+g*v,d=d*m+y*v,m===1-r){let T=1/Math.sqrt(c*c+l*l+u*u+d*d);c*=T,l*=T,u*=T,d*=T}}t[n]=c,t[n+1]=l,t[n+2]=u,t[n+3]=d}static multiplyQuaternionsFlat(t,n,i,s,o,a){let r=i[s],c=i[s+1],l=i[s+2],u=i[s+3],d=o[a],h=o[a+1],f=o[a+2],g=o[a+3];return t[n]=r*g+u*d+c*f-l*h,t[n+1]=c*g+u*h+l*d-r*f,t[n+2]=l*g+u*f+r*h-c*d,t[n+3]=u*g-r*d-c*h-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,n,i,s){return this._x=t,this._y=n,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,n=!0){let i=t._x,s=t._y,o=t._z,a=t._order,r=Math.cos,c=Math.sin,l=r(i/2),u=r(s/2),d=r(o/2),h=c(i/2),f=c(s/2),g=c(o/2);switch(a){case"XYZ":this._x=h*u*d+l*f*g,this._y=l*f*d-h*u*g,this._z=l*u*g+h*f*d,this._w=l*u*d-h*f*g;break;case"YXZ":this._x=h*u*d+l*f*g,this._y=l*f*d-h*u*g,this._z=l*u*g-h*f*d,this._w=l*u*d+h*f*g;break;case"ZXY":this._x=h*u*d-l*f*g,this._y=l*f*d+h*u*g,this._z=l*u*g+h*f*d,this._w=l*u*d-h*f*g;break;case"ZYX":this._x=h*u*d-l*f*g,this._y=l*f*d+h*u*g,this._z=l*u*g-h*f*d,this._w=l*u*d+h*f*g;break;case"YZX":this._x=h*u*d+l*f*g,this._y=l*f*d+h*u*g,this._z=l*u*g-h*f*d,this._w=l*u*d-h*f*g;break;case"XZY":this._x=h*u*d-l*f*g,this._y=l*f*d-h*u*g,this._z=l*u*g+h*f*d,this._w=l*u*d+h*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,n){let i=n/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let n=t.elements,i=n[0],s=n[4],o=n[8],a=n[1],r=n[5],c=n[9],l=n[2],u=n[6],d=n[10],h=i+r+d;if(h>0){let f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-c)*f,this._y=(o-l)*f,this._z=(a-s)*f}else if(i>r&&i>d){let f=2*Math.sqrt(1+i-r-d);this._w=(u-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(o+l)/f}else if(r>d){let f=2*Math.sqrt(1+r-i-d);this._w=(o-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+u)/f}else{let f=2*Math.sqrt(1+d-i-r);this._w=(a-s)/f,this._x=(o+l)/f,this._y=(c+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,n){let i=t.dot(n)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*n.z-t.z*n.y,this._y=t.z*n.x-t.x*n.z,this._z=t.x*n.y-t.y*n.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Yt(this.dot(t),-1,1)))}rotateTowards(t,n){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,n/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,n){let i=t._x,s=t._y,o=t._z,a=t._w,r=n._x,c=n._y,l=n._z,u=n._w;return this._x=i*u+a*r+s*l-o*c,this._y=s*u+a*c+o*r-i*l,this._z=o*u+a*l+i*c-s*r,this._w=a*u-i*r-s*c-o*l,this._onChangeCallback(),this}slerp(t,n){if(n===0)return this;if(n===1)return this.copy(t);let i=this._x,s=this._y,o=this._z,a=this._w,r=a*t._w+i*t._x+s*t._y+o*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=a,this._x=i,this._y=s,this._z=o,this;let c=1-r*r;if(c<=Number.EPSILON){let f=1-n;return this._w=f*a+n*this._w,this._x=f*i+n*this._x,this._y=f*s+n*this._y,this._z=f*o+n*this._z,this.normalize(),this}let l=Math.sqrt(c),u=Math.atan2(l,r),d=Math.sin((1-n)*u)/l,h=Math.sin(n*u)/l;return this._w=a*d+this._w*h,this._x=i*d+this._x*h,this._y=s*d+this._y*h,this._z=o*d+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,n,i){return this.copy(t).slerp(n,i)}random(){let t=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),o=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),o*Math.sin(n),o*Math.cos(n))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,n=0){return this._x=t[n],this._y=t[n+1],this._z=t[n+2],this._w=t[n+3],this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._w,t}fromBufferAttribute(t,n){return this._x=t.getX(n),this._y=t.getY(n),this._z=t.getZ(n),this._w=t.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},L=class e{constructor(t=0,n=0,i=0){e.prototype.isVector3=!0,this.x=t,this.y=n,this.z=i}set(t,n,i){return i===void 0&&(i=this.z),this.x=t,this.y=n,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,n){return this.x=t.x*n.x,this.y=t.y*n.y,this.z=t.z*n.z,this}applyEuler(t){return this.applyQuaternion(dy.setFromEuler(t))}applyAxisAngle(t,n){return this.applyQuaternion(dy.setFromAxisAngle(t,n))}applyMatrix3(t){let n=this.x,i=this.y,s=this.z,o=t.elements;return this.x=o[0]*n+o[3]*i+o[6]*s,this.y=o[1]*n+o[4]*i+o[7]*s,this.z=o[2]*n+o[5]*i+o[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let n=this.x,i=this.y,s=this.z,o=t.elements,a=1/(o[3]*n+o[7]*i+o[11]*s+o[15]);return this.x=(o[0]*n+o[4]*i+o[8]*s+o[12])*a,this.y=(o[1]*n+o[5]*i+o[9]*s+o[13])*a,this.z=(o[2]*n+o[6]*i+o[10]*s+o[14])*a,this}applyQuaternion(t){let n=this.x,i=this.y,s=this.z,o=t.x,a=t.y,r=t.z,c=t.w,l=2*(a*s-r*i),u=2*(r*n-o*s),d=2*(o*i-a*n);return this.x=n+c*l+a*d-r*u,this.y=i+c*u+r*l-o*d,this.z=s+c*d+o*u-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let n=this.x,i=this.y,s=this.z,o=t.elements;return this.x=o[0]*n+o[4]*i+o[8]*s,this.y=o[1]*n+o[5]*i+o[9]*s,this.z=o[2]*n+o[6]*i+o[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,n){return this.x=Yt(this.x,t.x,n.x),this.y=Yt(this.y,t.y,n.y),this.z=Yt(this.z,t.z,n.z),this}clampScalar(t,n){return this.x=Yt(this.x,t,n),this.y=Yt(this.y,t,n),this.z=Yt(this.z,t,n),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Yt(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,n){let i=t.x,s=t.y,o=t.z,a=n.x,r=n.y,c=n.z;return this.x=s*c-o*r,this.y=o*a-i*c,this.z=i*r-s*a,this}projectOnVector(t){let n=t.lengthSq();if(n===0)return this.set(0,0,0);let i=t.dot(this)/n;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Zf.copy(this).projectOnVector(t),this.sub(Zf)}reflect(t){return this.sub(Zf.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let n=Math.sqrt(this.lengthSq()*t.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(t)/n;return Math.acos(Yt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let n=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return n*n+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,n,i){let s=Math.sin(n)*t;return this.x=s*Math.sin(i),this.y=Math.cos(n)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,n,i){return this.x=t*Math.sin(n),this.y=i,this.z=t*Math.cos(n),this}setFromMatrixPosition(t){let n=t.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(t){let n=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=n,this.y=i,this.z=s,this}setFromMatrixColumn(t,n){return this.fromArray(t.elements,n*4)}setFromMatrix3Column(t,n){return this.fromArray(t.elements,n*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this.z=t[n+2],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t[n+2]=this.z,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this.z=t.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(t),this.y=n,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Zf=new L,dy=new wi,Vt=class e{constructor(t,n,i,s,o,a,r,c,l){e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,n,i,s,o,a,r,c,l)}set(t,n,i,s,o,a,r,c,l){let u=this.elements;return u[0]=t,u[1]=s,u[2]=r,u[3]=n,u[4]=o,u[5]=c,u[6]=i,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let n=this.elements,i=t.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(t,n,i){return t.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let n=t.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,n){let i=t.elements,s=n.elements,o=this.elements,a=i[0],r=i[3],c=i[6],l=i[1],u=i[4],d=i[7],h=i[2],f=i[5],g=i[8],y=s[0],m=s[3],p=s[6],x=s[1],b=s[4],v=s[7],T=s[2],S=s[5],A=s[8];return o[0]=a*y+r*x+c*T,o[3]=a*m+r*b+c*S,o[6]=a*p+r*v+c*A,o[1]=l*y+u*x+d*T,o[4]=l*m+u*b+d*S,o[7]=l*p+u*v+d*A,o[2]=h*y+f*x+g*T,o[5]=h*m+f*b+g*S,o[8]=h*p+f*v+g*A,this}multiplyScalar(t){let n=this.elements;return n[0]*=t,n[3]*=t,n[6]*=t,n[1]*=t,n[4]*=t,n[7]*=t,n[2]*=t,n[5]*=t,n[8]*=t,this}determinant(){let t=this.elements,n=t[0],i=t[1],s=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],u=t[8];return n*a*u-n*r*l-i*o*u+i*r*c+s*o*l-s*a*c}invert(){let t=this.elements,n=t[0],i=t[1],s=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],u=t[8],d=u*a-r*l,h=r*c-u*o,f=l*o-a*c,g=n*d+i*h+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/g;return t[0]=d*y,t[1]=(s*l-u*i)*y,t[2]=(r*i-s*a)*y,t[3]=h*y,t[4]=(u*n-s*c)*y,t[5]=(s*o-r*n)*y,t[6]=f*y,t[7]=(i*c-l*n)*y,t[8]=(a*n-i*o)*y,this}transpose(){let t,n=this.elements;return t=n[1],n[1]=n[3],n[3]=t,t=n[2],n[2]=n[6],n[6]=t,t=n[5],n[5]=n[7],n[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let n=this.elements;return t[0]=n[0],t[1]=n[3],t[2]=n[6],t[3]=n[1],t[4]=n[4],t[5]=n[7],t[6]=n[2],t[7]=n[5],t[8]=n[8],this}setUvTransform(t,n,i,s,o,a,r){let c=Math.cos(o),l=Math.sin(o);return this.set(i*c,i*l,-i*(c*a+l*r)+a+t,-s*l,s*c,-s*(-l*a+c*r)+r+n,0,0,1),this}scale(t,n){return this.premultiply(Jf.makeScale(t,n)),this}rotate(t){return this.premultiply(Jf.makeRotation(-t)),this}translate(t,n){return this.premultiply(Jf.makeTranslation(t,n)),this}makeTranslation(t,n){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,n,0,0,1),this}makeRotation(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(t,n){return this.set(t,0,0,0,n,0,0,0,1),this}equals(t){let n=this.elements,i=t.elements;for(let s=0;s<9;s++)if(n[s]!==i[s])return!1;return!0}fromArray(t,n=0){for(let i=0;i<9;i++)this.elements[i]=t[i+n];return this}toArray(t=[],n=0){let i=this.elements;return t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=i[3],t[n+4]=i[4],t[n+5]=i[5],t[n+6]=i[6],t[n+7]=i[7],t[n+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Jf=new Vt;function Wp(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function el(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function vx(){let e=el("canvas");return e.style.display="block",e}var hy={};function Gr(e){e in hy||(hy[e]=!0,console.warn(e))}function wx(e,t,n){return new Promise(function(i,s){function o(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:s();break;case e.TIMEOUT_EXPIRED:setTimeout(o,n);break;default:i()}}setTimeout(o,n)})}var fy=new Vt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),py=new Vt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function IE(){let e={enabled:!0,workingColorSpace:jo,spaces:{},convert:function(s,o,a){return this.enabled===!1||o===a||!o||!a||(this.spaces[o].transfer===pe&&(s.r=Ps(s.r),s.g=Ps(s.g),s.b=Ps(s.b)),this.spaces[o].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[o].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===pe&&(s.r=Hr(s.r),s.g=Hr(s.g),s.b=Hr(s.b))),s},workingToColorSpace:function(s,o){return this.convert(s,this.workingColorSpace,o)},colorSpaceToWorking:function(s,o){return this.convert(s,o,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===qi?Qa:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,o=this.workingColorSpace){return s.fromArray(this.spaces[o].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,o,a){return s.copy(this.spaces[o].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,o){return Gr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),e.workingToColorSpace(s,o)},toWorkingColorSpace:function(s,o){return Gr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),e.colorSpaceToWorking(s,o)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return e.define({[jo]:{primaries:t,whitePoint:i,transfer:Qa,toXYZ:fy,fromXYZ:py,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Xe},outputColorSpaceConfig:{drawingBufferColorSpace:Xe}},[Xe]:{primaries:t,whitePoint:i,transfer:pe,toXYZ:fy,fromXYZ:py,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Xe}}}),e}var se=IE();function Ps(e){return e<.04045?e*.0773993808:Math.pow(e*.9478672986+.0521327014,2.4)}function Hr(e){return e<.0031308?e*12.92:1.055*Math.pow(e,.41666)-.055}var Tr,pu=class{static getDataURL(t,n="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Tr===void 0&&(Tr=el("canvas")),Tr.width=t.width,Tr.height=t.height;let s=Tr.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=Tr}return i.toDataURL(n)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let n=el("canvas");n.width=t.width,n.height=t.height;let i=n.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),o=s.data;for(let a=0;a<o.length;a++)o[a]=Ps(o[a]/255)*255;return i.putImageData(s,0,0),n}else if(t.data){let n=t.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Ps(n[i]/255)*255):n[i]=Ps(n[i]);return{data:n,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},LE=0,Wr=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:LE++}),this.uuid=sa(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?t.set(n.videoWidth,n.videoHeight,0):n instanceof VideoFrame?t.set(n.displayHeight,n.displayWidth,0):n!==null?t.set(n.width,n.height,n.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let n=t===void 0||typeof t=="string";if(!n&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let o;if(Array.isArray(s)){o=[];for(let a=0,r=s.length;a<r;a++)s[a].isDataTexture?o.push(Qf(s[a].image)):o.push(Qf(s[a]))}else o=Qf(s);i.url=o}return n||(t.images[this.uuid]=i),i}};function Qf(e){return typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap?pu.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var DE=0,tp=new L,$n=class e extends cs{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,i=ls,s=ls,o=$i,a=fo,r=Ei,c=Gi,l=e.DEFAULT_ANISOTROPY,u=qi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:DE++}),this.uuid=sa(),this.name="",this.source=new Wr(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=o,this.minFilter=a,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new At(0,0),this.repeat=new At(1,1),this.center=new At(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Vt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(tp).x}get height(){return this.source.getSize(tp).y}get depth(){return this.source.getSize(tp).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let n in t){let i=t[n];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${n}' has value of undefined.`);continue}let s=this[n];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${n}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[n]=i}}toJSON(t){let n=t===void 0||typeof t=="string";if(!n&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Dp)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case $r:t.x=t.x-Math.floor(t.x);break;case ls:t.x=t.x<0?0:1;break;case hu:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case $r:t.y=t.y-Math.floor(t.y);break;case ls:t.y=t.y<0?0:1;break;case hu:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};$n.DEFAULT_IMAGE=null;$n.DEFAULT_MAPPING=Dp;$n.DEFAULT_ANISOTROPY=1;var fe=class e{constructor(t=0,n=0,i=0,s=1){e.prototype.isVector4=!0,this.x=t,this.y=n,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,n,i,s){return this.x=t,this.y=n,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this.w=t.w+n.w,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this.w+=t.w*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this.w=t.w-n.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let n=this.x,i=this.y,s=this.z,o=this.w,a=t.elements;return this.x=a[0]*n+a[4]*i+a[8]*s+a[12]*o,this.y=a[1]*n+a[5]*i+a[9]*s+a[13]*o,this.z=a[2]*n+a[6]*i+a[10]*s+a[14]*o,this.w=a[3]*n+a[7]*i+a[11]*s+a[15]*o,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let n=Math.sqrt(1-t.w*t.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/n,this.y=t.y/n,this.z=t.z/n),this}setAxisAngleFromRotationMatrix(t){let n,i,s,o,c=t.elements,l=c[0],u=c[4],d=c[8],h=c[1],f=c[5],g=c[9],y=c[2],m=c[6],p=c[10];if(Math.abs(u-h)<.01&&Math.abs(d-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+y)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;let b=(l+1)/2,v=(f+1)/2,T=(p+1)/2,S=(u+h)/4,A=(d+y)/4,R=(g+m)/4;return b>v&&b>T?b<.01?(i=0,s=.707106781,o=.707106781):(i=Math.sqrt(b),s=S/i,o=A/i):v>T?v<.01?(i=.707106781,s=0,o=.707106781):(s=Math.sqrt(v),i=S/s,o=R/s):T<.01?(i=.707106781,s=.707106781,o=0):(o=Math.sqrt(T),i=A/o,s=R/o),this.set(i,s,o,n),this}let x=Math.sqrt((m-g)*(m-g)+(d-y)*(d-y)+(h-u)*(h-u));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(d-y)/x,this.z=(h-u)/x,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){let n=t.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,n){return this.x=Yt(this.x,t.x,n.x),this.y=Yt(this.y,t.y,n.y),this.z=Yt(this.z,t.z,n.z),this.w=Yt(this.w,t.w,n.w),this}clampScalar(t,n){return this.x=Yt(this.x,t,n),this.y=Yt(this.y,t,n),this.z=Yt(this.z,t,n),this.w=Yt(this.w,t,n),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Yt(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this.w+=(t.w-this.w)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this.w=t.w+(n.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this.z=t[n+2],this.w=t[n+3],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t[n+2]=this.z,t[n+3]=this.w,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this.z=t.getZ(n),this.w=t.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},mu=class extends cs{constructor(t=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:$i,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=n,this.depth=i.depth,this.scissor=new fe(0,0,t,n),this.scissorTest=!1,this.viewport=new fe(0,0,t,n);let s={width:t,height:n,depth:i.depth},o=new $n(s);this.textures=[];let a=i.count;for(let r=0;r<a;r++)this.textures[r]=o.clone(),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){let n={minFilter:$i,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(n.mapping=t.mapping),t.wrapS!==void 0&&(n.wrapS=t.wrapS),t.wrapT!==void 0&&(n.wrapT=t.wrapT),t.wrapR!==void 0&&(n.wrapR=t.wrapR),t.magFilter!==void 0&&(n.magFilter=t.magFilter),t.minFilter!==void 0&&(n.minFilter=t.minFilter),t.format!==void 0&&(n.format=t.format),t.type!==void 0&&(n.type=t.type),t.anisotropy!==void 0&&(n.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(n.colorSpace=t.colorSpace),t.flipY!==void 0&&(n.flipY=t.flipY),t.generateMipmaps!==void 0&&(n.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(n.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,n,i=1){if(this.width!==t||this.height!==n||this.depth!==i){this.width=t,this.height=n,this.depth=i;for(let s=0,o=this.textures.length;s<o;s++)this.textures[s].image.width=t,this.textures[s].image.height=n,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,n),this.scissor.set(0,0,t,n)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++){this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;let s=Object.assign({},t.textures[n].image);this.textures[n].source=new Wr(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},us=class extends mu{constructor(t=1,n=1,i={}){super(t,n,i),this.isWebGLRenderTarget=!0}},nl=class extends $n{constructor(t=null,n=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:n,height:i,depth:s},this.magFilter=jn,this.minFilter=jn,this.wrapR=ls,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var gu=class extends $n{constructor(t=null,n=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:n,height:i,depth:s},this.magFilter=jn,this.minFilter=jn,this.wrapR=ls,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ds=class{constructor(t=new L(1/0,1/0,1/0),n=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=n}set(t,n){return this.min.copy(t),this.max.copy(n),this}setFromArray(t){this.makeEmpty();for(let n=0,i=t.length;n<i;n+=3)this.expandByPoint(Oi.fromArray(t,n));return this}setFromBufferAttribute(t){this.makeEmpty();for(let n=0,i=t.count;n<i;n++)this.expandByPoint(Oi.fromBufferAttribute(t,n));return this}setFromPoints(t){this.makeEmpty();for(let n=0,i=t.length;n<i;n++)this.expandByPoint(t[n]);return this}setFromCenterAndSize(t,n){let i=Oi.copy(n).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,n=!1){return this.makeEmpty(),this.expandByObject(t,n)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,n=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let o=i.getAttribute("position");if(n===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let a=0,r=o.count;a<r;a++)t.isMesh===!0?t.getVertexPosition(a,Oi):Oi.fromBufferAttribute(o,a),Oi.applyMatrix4(t.matrixWorld),this.expandByPoint(Oi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Gc.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Gc.copy(i.boundingBox)),Gc.applyMatrix4(t.matrixWorld),this.union(Gc)}let s=t.children;for(let o=0,a=s.length;o<a;o++)this.expandByObject(s[o],n);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,n){return n.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Oi),Oi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let n,i;return t.normal.x>0?(n=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(n=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(n+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(n+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(n+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(n+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),n<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Va),Wc.subVectors(this.max,Va),Ar.subVectors(t.a,Va),Rr.subVectors(t.b,Va),Cr.subVectors(t.c,Va),eo.subVectors(Rr,Ar),no.subVectors(Cr,Rr),$o.subVectors(Ar,Cr);let n=[0,-eo.z,eo.y,0,-no.z,no.y,0,-$o.z,$o.y,eo.z,0,-eo.x,no.z,0,-no.x,$o.z,0,-$o.x,-eo.y,eo.x,0,-no.y,no.x,0,-$o.y,$o.x,0];return!ep(n,Ar,Rr,Cr,Wc)||(n=[1,0,0,0,1,0,0,0,1],!ep(n,Ar,Rr,Cr,Wc))?!1:(qc.crossVectors(eo,no),n=[qc.x,qc.y,qc.z],ep(n,Ar,Rr,Cr,Wc))}clampPoint(t,n){return n.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Oi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Oi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ts[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ts[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ts[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ts[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ts[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ts[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ts[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ts[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ts),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Ts=[new L,new L,new L,new L,new L,new L,new L,new L],Oi=new L,Gc=new ds,Ar=new L,Rr=new L,Cr=new L,eo=new L,no=new L,$o=new L,Va=new L,Wc=new L,qc=new L,zo=new L;function ep(e,t,n,i,s){for(let o=0,a=e.length-3;o<=a;o+=3){zo.fromArray(e,o);let r=s.x*Math.abs(zo.x)+s.y*Math.abs(zo.y)+s.z*Math.abs(zo.z),c=t.dot(zo),l=n.dot(zo),u=i.dot(zo);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>r)return!1}return!0}var NE=new ds,Ga=new L,np=new L,co=class{constructor(t=new L,n=-1){this.isSphere=!0,this.center=t,this.radius=n}set(t,n){return this.center.copy(t),this.radius=n,this}setFromPoints(t,n){let i=this.center;n!==void 0?i.copy(n):NE.setFromPoints(t).getCenter(i);let s=0;for(let o=0,a=t.length;o<a;o++)s=Math.max(s,i.distanceToSquared(t[o]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let n=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=n*n}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,n){let i=this.center.distanceToSquared(t);return n.copy(t),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ga.subVectors(t,this.center);let n=Ga.lengthSq();if(n>this.radius*this.radius){let i=Math.sqrt(n),s=(i-this.radius)*.5;this.center.addScaledVector(Ga,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(np.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ga.copy(t.center).add(np)),this.expandByPoint(Ga.copy(t.center).sub(np))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},As=new L,ip=new L,Xc=new L,io=new L,sp=new L,jc=new L,op=new L,Yo=class{constructor(t=new L,n=new L(0,0,-1)){this.origin=t,this.direction=n}set(t,n){return this.origin.copy(t),this.direction.copy(n),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,n){return n.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,As)),this}closestPointToPoint(t,n){n.subVectors(t,this.origin);let i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let n=As.subVectors(t,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(t):(As.copy(this.origin).addScaledVector(this.direction,n),As.distanceToSquared(t))}distanceSqToSegment(t,n,i,s){ip.copy(t).add(n).multiplyScalar(.5),Xc.copy(n).sub(t).normalize(),io.copy(this.origin).sub(ip);let o=t.distanceTo(n)*.5,a=-this.direction.dot(Xc),r=io.dot(this.direction),c=-io.dot(Xc),l=io.lengthSq(),u=Math.abs(1-a*a),d,h,f,g;if(u>0)if(d=a*c-r,h=a*r-c,g=o*u,d>=0)if(h>=-g)if(h<=g){let y=1/u;d*=y,h*=y,f=d*(d+a*h+2*r)+h*(a*d+h+2*c)+l}else h=o,d=Math.max(0,-(a*h+r)),f=-d*d+h*(h+2*c)+l;else h=-o,d=Math.max(0,-(a*h+r)),f=-d*d+h*(h+2*c)+l;else h<=-g?(d=Math.max(0,-(-a*o+r)),h=d>0?-o:Math.min(Math.max(-o,-c),o),f=-d*d+h*(h+2*c)+l):h<=g?(d=0,h=Math.min(Math.max(-o,-c),o),f=h*(h+2*c)+l):(d=Math.max(0,-(a*o+r)),h=d>0?o:Math.min(Math.max(-o,-c),o),f=-d*d+h*(h+2*c)+l);else h=a>0?-o:o,d=Math.max(0,-(a*h+r)),f=-d*d+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(ip).addScaledVector(Xc,h),f}intersectSphere(t,n){As.subVectors(t.center,this.origin);let i=As.dot(this.direction),s=As.dot(As)-i*i,o=t.radius*t.radius;if(s>o)return null;let a=Math.sqrt(o-s),r=i-a,c=i+a;return c<0?null:r<0?this.at(c,n):this.at(r,n)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let n=t.normal.dot(this.direction);if(n===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/n;return i>=0?i:null}intersectPlane(t,n){let i=this.distanceToPlane(t);return i===null?null:this.at(i,n)}intersectsPlane(t){let n=t.distanceToPoint(this.origin);return n===0||t.normal.dot(this.direction)*n<0}intersectBox(t,n){let i,s,o,a,r,c,l=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return l>=0?(i=(t.min.x-h.x)*l,s=(t.max.x-h.x)*l):(i=(t.max.x-h.x)*l,s=(t.min.x-h.x)*l),u>=0?(o=(t.min.y-h.y)*u,a=(t.max.y-h.y)*u):(o=(t.max.y-h.y)*u,a=(t.min.y-h.y)*u),i>a||o>s||((o>i||isNaN(i))&&(i=o),(a<s||isNaN(s))&&(s=a),d>=0?(r=(t.min.z-h.z)*d,c=(t.max.z-h.z)*d):(r=(t.max.z-h.z)*d,c=(t.min.z-h.z)*d),i>c||r>s)||((r>i||i!==i)&&(i=r),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,n)}intersectsBox(t){return this.intersectBox(t,As)!==null}intersectTriangle(t,n,i,s,o){sp.subVectors(n,t),jc.subVectors(i,t),op.crossVectors(sp,jc);let a=this.direction.dot(op),r;if(a>0){if(s)return null;r=1}else if(a<0)r=-1,a=-a;else return null;io.subVectors(this.origin,t);let c=r*this.direction.dot(jc.crossVectors(io,jc));if(c<0)return null;let l=r*this.direction.dot(sp.cross(io));if(l<0||c+l>a)return null;let u=-r*io.dot(op);return u<0?null:this.at(u/a,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},me=class e{constructor(t,n,i,s,o,a,r,c,l,u,d,h,f,g,y,m){e.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,n,i,s,o,a,r,c,l,u,d,h,f,g,y,m)}set(t,n,i,s,o,a,r,c,l,u,d,h,f,g,y,m){let p=this.elements;return p[0]=t,p[4]=n,p[8]=i,p[12]=s,p[1]=o,p[5]=a,p[9]=r,p[13]=c,p[2]=l,p[6]=u,p[10]=d,p[14]=h,p[3]=f,p[7]=g,p[11]=y,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(t){let n=this.elements,i=t.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(t){let n=this.elements,i=t.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(t){let n=t.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(t,n,i){return t.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,n,i){return this.set(t.x,n.x,i.x,0,t.y,n.y,i.y,0,t.z,n.z,i.z,0,0,0,0,1),this}extractRotation(t){let n=this.elements,i=t.elements,s=1/kr.setFromMatrixColumn(t,0).length(),o=1/kr.setFromMatrixColumn(t,1).length(),a=1/kr.setFromMatrixColumn(t,2).length();return n[0]=i[0]*s,n[1]=i[1]*s,n[2]=i[2]*s,n[3]=0,n[4]=i[4]*o,n[5]=i[5]*o,n[6]=i[6]*o,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(t){let n=this.elements,i=t.x,s=t.y,o=t.z,a=Math.cos(i),r=Math.sin(i),c=Math.cos(s),l=Math.sin(s),u=Math.cos(o),d=Math.sin(o);if(t.order==="XYZ"){let h=a*u,f=a*d,g=r*u,y=r*d;n[0]=c*u,n[4]=-c*d,n[8]=l,n[1]=f+g*l,n[5]=h-y*l,n[9]=-r*c,n[2]=y-h*l,n[6]=g+f*l,n[10]=a*c}else if(t.order==="YXZ"){let h=c*u,f=c*d,g=l*u,y=l*d;n[0]=h+y*r,n[4]=g*r-f,n[8]=a*l,n[1]=a*d,n[5]=a*u,n[9]=-r,n[2]=f*r-g,n[6]=y+h*r,n[10]=a*c}else if(t.order==="ZXY"){let h=c*u,f=c*d,g=l*u,y=l*d;n[0]=h-y*r,n[4]=-a*d,n[8]=g+f*r,n[1]=f+g*r,n[5]=a*u,n[9]=y-h*r,n[2]=-a*l,n[6]=r,n[10]=a*c}else if(t.order==="ZYX"){let h=a*u,f=a*d,g=r*u,y=r*d;n[0]=c*u,n[4]=g*l-f,n[8]=h*l+y,n[1]=c*d,n[5]=y*l+h,n[9]=f*l-g,n[2]=-l,n[6]=r*c,n[10]=a*c}else if(t.order==="YZX"){let h=a*c,f=a*l,g=r*c,y=r*l;n[0]=c*u,n[4]=y-h*d,n[8]=g*d+f,n[1]=d,n[5]=a*u,n[9]=-r*u,n[2]=-l*u,n[6]=f*d+g,n[10]=h-y*d}else if(t.order==="XZY"){let h=a*c,f=a*l,g=r*c,y=r*l;n[0]=c*u,n[4]=-d,n[8]=l*u,n[1]=h*d+y,n[5]=a*u,n[9]=f*d-g,n[2]=g*d-f,n[6]=r*u,n[10]=y*d+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(t){return this.compose(UE,t,OE)}lookAt(t,n,i){let s=this.elements;return oi.subVectors(t,n),oi.lengthSq()===0&&(oi.z=1),oi.normalize(),so.crossVectors(i,oi),so.lengthSq()===0&&(Math.abs(i.z)===1?oi.x+=1e-4:oi.z+=1e-4,oi.normalize(),so.crossVectors(i,oi)),so.normalize(),Yc.crossVectors(oi,so),s[0]=so.x,s[4]=Yc.x,s[8]=oi.x,s[1]=so.y,s[5]=Yc.y,s[9]=oi.y,s[2]=so.z,s[6]=Yc.z,s[10]=oi.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,n){let i=t.elements,s=n.elements,o=this.elements,a=i[0],r=i[4],c=i[8],l=i[12],u=i[1],d=i[5],h=i[9],f=i[13],g=i[2],y=i[6],m=i[10],p=i[14],x=i[3],b=i[7],v=i[11],T=i[15],S=s[0],A=s[4],R=s[8],_=s[12],w=s[1],P=s[5],D=s[9],U=s[13],H=s[2],X=s[6],z=s[10],Z=s[14],V=s[3],lt=s[7],dt=s[11],bt=s[15];return o[0]=a*S+r*w+c*H+l*V,o[4]=a*A+r*P+c*X+l*lt,o[8]=a*R+r*D+c*z+l*dt,o[12]=a*_+r*U+c*Z+l*bt,o[1]=u*S+d*w+h*H+f*V,o[5]=u*A+d*P+h*X+f*lt,o[9]=u*R+d*D+h*z+f*dt,o[13]=u*_+d*U+h*Z+f*bt,o[2]=g*S+y*w+m*H+p*V,o[6]=g*A+y*P+m*X+p*lt,o[10]=g*R+y*D+m*z+p*dt,o[14]=g*_+y*U+m*Z+p*bt,o[3]=x*S+b*w+v*H+T*V,o[7]=x*A+b*P+v*X+T*lt,o[11]=x*R+b*D+v*z+T*dt,o[15]=x*_+b*U+v*Z+T*bt,this}multiplyScalar(t){let n=this.elements;return n[0]*=t,n[4]*=t,n[8]*=t,n[12]*=t,n[1]*=t,n[5]*=t,n[9]*=t,n[13]*=t,n[2]*=t,n[6]*=t,n[10]*=t,n[14]*=t,n[3]*=t,n[7]*=t,n[11]*=t,n[15]*=t,this}determinant(){let t=this.elements,n=t[0],i=t[4],s=t[8],o=t[12],a=t[1],r=t[5],c=t[9],l=t[13],u=t[2],d=t[6],h=t[10],f=t[14],g=t[3],y=t[7],m=t[11],p=t[15];return g*(+o*c*d-s*l*d-o*r*h+i*l*h+s*r*f-i*c*f)+y*(+n*c*f-n*l*h+o*a*h-s*a*f+s*l*u-o*c*u)+m*(+n*l*d-n*r*f-o*a*d+i*a*f+o*r*u-i*l*u)+p*(-s*r*u-n*c*d+n*r*h+s*a*d-i*a*h+i*c*u)}transpose(){let t=this.elements,n;return n=t[1],t[1]=t[4],t[4]=n,n=t[2],t[2]=t[8],t[8]=n,n=t[6],t[6]=t[9],t[9]=n,n=t[3],t[3]=t[12],t[12]=n,n=t[7],t[7]=t[13],t[13]=n,n=t[11],t[11]=t[14],t[14]=n,this}setPosition(t,n,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=n,s[14]=i),this}invert(){let t=this.elements,n=t[0],i=t[1],s=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],u=t[8],d=t[9],h=t[10],f=t[11],g=t[12],y=t[13],m=t[14],p=t[15],x=d*m*l-y*h*l+y*c*f-r*m*f-d*c*p+r*h*p,b=g*h*l-u*m*l-g*c*f+a*m*f+u*c*p-a*h*p,v=u*y*l-g*d*l+g*r*f-a*y*f-u*r*p+a*d*p,T=g*d*c-u*y*c-g*r*h+a*y*h+u*r*m-a*d*m,S=n*x+i*b+s*v+o*T;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/S;return t[0]=x*A,t[1]=(y*h*o-d*m*o-y*s*f+i*m*f+d*s*p-i*h*p)*A,t[2]=(r*m*o-y*c*o+y*s*l-i*m*l-r*s*p+i*c*p)*A,t[3]=(d*c*o-r*h*o-d*s*l+i*h*l+r*s*f-i*c*f)*A,t[4]=b*A,t[5]=(u*m*o-g*h*o+g*s*f-n*m*f-u*s*p+n*h*p)*A,t[6]=(g*c*o-a*m*o-g*s*l+n*m*l+a*s*p-n*c*p)*A,t[7]=(a*h*o-u*c*o+u*s*l-n*h*l-a*s*f+n*c*f)*A,t[8]=v*A,t[9]=(g*d*o-u*y*o-g*i*f+n*y*f+u*i*p-n*d*p)*A,t[10]=(a*y*o-g*r*o+g*i*l-n*y*l-a*i*p+n*r*p)*A,t[11]=(u*r*o-a*d*o-u*i*l+n*d*l+a*i*f-n*r*f)*A,t[12]=T*A,t[13]=(u*y*s-g*d*s+g*i*h-n*y*h-u*i*m+n*d*m)*A,t[14]=(g*r*s-a*y*s-g*i*c+n*y*c+a*i*m-n*r*m)*A,t[15]=(a*d*s-u*r*s+u*i*c-n*d*c-a*i*h+n*r*h)*A,this}scale(t){let n=this.elements,i=t.x,s=t.y,o=t.z;return n[0]*=i,n[4]*=s,n[8]*=o,n[1]*=i,n[5]*=s,n[9]*=o,n[2]*=i,n[6]*=s,n[10]*=o,n[3]*=i,n[7]*=s,n[11]*=o,this}getMaxScaleOnAxis(){let t=this.elements,n=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(n,i,s))}makeTranslation(t,n,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(t){let n=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,n){let i=Math.cos(n),s=Math.sin(n),o=1-i,a=t.x,r=t.y,c=t.z,l=o*a,u=o*r;return this.set(l*a+i,l*r-s*c,l*c+s*r,0,l*r+s*c,u*r+i,u*c-s*a,0,l*c-s*r,u*c+s*a,o*c*c+i,0,0,0,0,1),this}makeScale(t,n,i){return this.set(t,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,n,i,s,o,a){return this.set(1,i,o,0,t,1,a,0,n,s,1,0,0,0,0,1),this}compose(t,n,i){let s=this.elements,o=n._x,a=n._y,r=n._z,c=n._w,l=o+o,u=a+a,d=r+r,h=o*l,f=o*u,g=o*d,y=a*u,m=a*d,p=r*d,x=c*l,b=c*u,v=c*d,T=i.x,S=i.y,A=i.z;return s[0]=(1-(y+p))*T,s[1]=(f+v)*T,s[2]=(g-b)*T,s[3]=0,s[4]=(f-v)*S,s[5]=(1-(h+p))*S,s[6]=(m+x)*S,s[7]=0,s[8]=(g+b)*A,s[9]=(m-x)*A,s[10]=(1-(h+y))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,n,i){let s=this.elements,o=kr.set(s[0],s[1],s[2]).length(),a=kr.set(s[4],s[5],s[6]).length(),r=kr.set(s[8],s[9],s[10]).length();this.determinant()<0&&(o=-o),t.x=s[12],t.y=s[13],t.z=s[14],Fi.copy(this);let l=1/o,u=1/a,d=1/r;return Fi.elements[0]*=l,Fi.elements[1]*=l,Fi.elements[2]*=l,Fi.elements[4]*=u,Fi.elements[5]*=u,Fi.elements[6]*=u,Fi.elements[8]*=d,Fi.elements[9]*=d,Fi.elements[10]*=d,n.setFromRotationMatrix(Fi),i.x=o,i.y=a,i.z=r,this}makePerspective(t,n,i,s,o,a,r=Hi,c=!1){let l=this.elements,u=2*o/(n-t),d=2*o/(i-s),h=(n+t)/(n-t),f=(i+s)/(i-s),g,y;if(c)g=o/(a-o),y=a*o/(a-o);else if(r===Hi)g=-(a+o)/(a-o),y=-2*a*o/(a-o);else if(r===tl)g=-a/(a-o),y=-a*o/(a-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=u,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,n,i,s,o,a,r=Hi,c=!1){let l=this.elements,u=2/(n-t),d=2/(i-s),h=-(n+t)/(n-t),f=-(i+s)/(i-s),g,y;if(c)g=1/(a-o),y=a/(a-o);else if(r===Hi)g=-2/(a-o),y=-(a+o)/(a-o);else if(r===tl)g=-1/(a-o),y=-o/(a-o);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=u,l[4]=0,l[8]=0,l[12]=h,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let n=this.elements,i=t.elements;for(let s=0;s<16;s++)if(n[s]!==i[s])return!1;return!0}fromArray(t,n=0){for(let i=0;i<16;i++)this.elements[i]=t[i+n];return this}toArray(t=[],n=0){let i=this.elements;return t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=i[3],t[n+4]=i[4],t[n+5]=i[5],t[n+6]=i[6],t[n+7]=i[7],t[n+8]=i[8],t[n+9]=i[9],t[n+10]=i[10],t[n+11]=i[11],t[n+12]=i[12],t[n+13]=i[13],t[n+14]=i[14],t[n+15]=i[15],t}},kr=new L,Fi=new me,UE=new L(0,0,0),OE=new L(1,1,1),so=new L,Yc=new L,oi=new L,my=new me,gy=new wi,Mi=class e{constructor(t=0,n=0,i=0,s=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,n,i,s=this._order){return this._x=t,this._y=n,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,n=this._order,i=!0){let s=t.elements,o=s[0],a=s[4],r=s[8],c=s[1],l=s[5],u=s[9],d=s[2],h=s[6],f=s[10];switch(n){case"XYZ":this._y=Math.asin(Yt(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,o)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Yt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,o),this._z=0);break;case"ZXY":this._x=Math.asin(Yt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,o));break;case"ZYX":this._y=Math.asin(-Yt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(c,o)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Yt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-d,o)):(this._x=0,this._y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-Yt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(r,o)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,n,i){return my.makeRotationFromQuaternion(t),this.setFromRotationMatrix(my,n,i)}setFromVector3(t,n=this._order){return this.set(t.x,t.y,t.z,n)}reorder(t){return gy.setFromEuler(this),this.setFromQuaternion(gy,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Mi.DEFAULT_ORDER="XYZ";var qr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},FE=0,yy=new L,Pr=new wi,Rs=new me,Kc=new L,Wa=new L,BE=new L,HE=new wi,xy=new L(1,0,0),_y=new L(0,1,0),by=new L(0,0,1),vy={type:"added"},$E={type:"removed"},Ir={type:"childadded",child:null},rp={type:"childremoved",child:null},Je=class e extends cs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:FE++}),this.uuid=sa(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new L,n=new Mi,i=new wi,s=new L(1,1,1);function o(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(o),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new me},normalMatrix:{value:new Vt}}),this.matrix=new me,this.matrixWorld=new me,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,n){this.quaternion.setFromAxisAngle(t,n)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,n){return Pr.setFromAxisAngle(t,n),this.quaternion.multiply(Pr),this}rotateOnWorldAxis(t,n){return Pr.setFromAxisAngle(t,n),this.quaternion.premultiply(Pr),this}rotateX(t){return this.rotateOnAxis(xy,t)}rotateY(t){return this.rotateOnAxis(_y,t)}rotateZ(t){return this.rotateOnAxis(by,t)}translateOnAxis(t,n){return yy.copy(t).applyQuaternion(this.quaternion),this.position.add(yy.multiplyScalar(n)),this}translateX(t){return this.translateOnAxis(xy,t)}translateY(t){return this.translateOnAxis(_y,t)}translateZ(t){return this.translateOnAxis(by,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Rs.copy(this.matrixWorld).invert())}lookAt(t,n,i){t.isVector3?Kc.copy(t):Kc.set(t,n,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Wa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Rs.lookAt(Wa,Kc,this.up):Rs.lookAt(Kc,Wa,this.up),this.quaternion.setFromRotationMatrix(Rs),s&&(Rs.extractRotation(s.matrixWorld),Pr.setFromRotationMatrix(Rs),this.quaternion.premultiply(Pr.invert()))}add(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(vy),Ir.child=t,this.dispatchEvent(Ir),Ir.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let n=this.children.indexOf(t);return n!==-1&&(t.parent=null,this.children.splice(n,1),t.dispatchEvent($E),rp.child=t,this.dispatchEvent(rp),rp.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Rs.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Rs.multiply(t.parent.matrixWorld)),t.applyMatrix4(Rs),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(vy),Ir.child=t,this.dispatchEvent(Ir),Ir.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,n){if(this[t]===n)return this;for(let i=0,s=this.children.length;i<s;i++){let a=this.children[i].getObjectByProperty(t,n);if(a!==void 0)return a}}getObjectsByProperty(t,n,i=[]){this[t]===n&&i.push(this);let s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].getObjectsByProperty(t,n,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Wa,t,BE),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Wa,HE,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let n=this.matrixWorld.elements;return t.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(t){t(this);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverseVisible(t)}traverseAncestors(t){let n=this.parent;n!==null&&(t(n),n.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].updateMatrixWorld(t)}updateWorldMatrix(t,n){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){let s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].updateWorldMatrix(!1,!0)}}toJSON(t){let n=t===void 0||typeof t=="string",i={};n&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(r=>({...r,boundingBox:r.boundingBox?r.boundingBox.toJSON():void 0,boundingSphere:r.boundingSphere?r.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(r=>({...r})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function o(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=o(t.geometries,this.geometry);let r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){let c=r.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let d=c[l];o(t.shapes,d)}else o(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(o(t.materials,this.material[c]));s.material=r}else s.material=o(t.materials,this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){let c=this.animations[r];s.animations.push(o(t.animations,c))}}if(n){let r=a(t.geometries),c=a(t.materials),l=a(t.textures),u=a(t.images),d=a(t.shapes),h=a(t.skeletons),f=a(t.animations),g=a(t.nodes);r.length>0&&(i.geometries=r),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),h.length>0&&(i.skeletons=h),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(r){let c=[];for(let l in r){let u=r[l];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,n=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),n===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}};Je.DEFAULT_UP=new L(0,1,0);Je.DEFAULT_MATRIX_AUTO_UPDATE=!0;Je.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Bi=new L,Cs=new L,ap=new L,ks=new L,Lr=new L,Dr=new L,wy=new L,lp=new L,cp=new L,up=new L,dp=new fe,hp=new fe,fp=new fe,ao=class e{constructor(t=new L,n=new L,i=new L){this.a=t,this.b=n,this.c=i}static getNormal(t,n,i,s){s.subVectors(i,n),Bi.subVectors(t,n),s.cross(Bi);let o=s.lengthSq();return o>0?s.multiplyScalar(1/Math.sqrt(o)):s.set(0,0,0)}static getBarycoord(t,n,i,s,o){Bi.subVectors(s,n),Cs.subVectors(i,n),ap.subVectors(t,n);let a=Bi.dot(Bi),r=Bi.dot(Cs),c=Bi.dot(ap),l=Cs.dot(Cs),u=Cs.dot(ap),d=a*l-r*r;if(d===0)return o.set(0,0,0),null;let h=1/d,f=(l*c-r*u)*h,g=(a*u-r*c)*h;return o.set(1-f-g,g,f)}static containsPoint(t,n,i,s){return this.getBarycoord(t,n,i,s,ks)===null?!1:ks.x>=0&&ks.y>=0&&ks.x+ks.y<=1}static getInterpolation(t,n,i,s,o,a,r,c){return this.getBarycoord(t,n,i,s,ks)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(o,ks.x),c.addScaledVector(a,ks.y),c.addScaledVector(r,ks.z),c)}static getInterpolatedAttribute(t,n,i,s,o,a){return dp.setScalar(0),hp.setScalar(0),fp.setScalar(0),dp.fromBufferAttribute(t,n),hp.fromBufferAttribute(t,i),fp.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(dp,o.x),a.addScaledVector(hp,o.y),a.addScaledVector(fp,o.z),a}static isFrontFacing(t,n,i,s){return Bi.subVectors(i,n),Cs.subVectors(t,n),Bi.cross(Cs).dot(s)<0}set(t,n,i){return this.a.copy(t),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(t,n,i,s){return this.a.copy(t[n]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,n,i,s){return this.a.fromBufferAttribute(t,n),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Bi.subVectors(this.c,this.b),Cs.subVectors(this.a,this.b),Bi.cross(Cs).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,i,s,o){return e.getInterpolation(t,this.a,this.b,this.c,n,i,s,o)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,n){let i=this.a,s=this.b,o=this.c,a,r;Lr.subVectors(s,i),Dr.subVectors(o,i),lp.subVectors(t,i);let c=Lr.dot(lp),l=Dr.dot(lp);if(c<=0&&l<=0)return n.copy(i);cp.subVectors(t,s);let u=Lr.dot(cp),d=Dr.dot(cp);if(u>=0&&d<=u)return n.copy(s);let h=c*d-u*l;if(h<=0&&c>=0&&u<=0)return a=c/(c-u),n.copy(i).addScaledVector(Lr,a);up.subVectors(t,o);let f=Lr.dot(up),g=Dr.dot(up);if(g>=0&&f<=g)return n.copy(o);let y=f*l-c*g;if(y<=0&&l>=0&&g<=0)return r=l/(l-g),n.copy(i).addScaledVector(Dr,r);let m=u*g-f*d;if(m<=0&&d-u>=0&&f-g>=0)return wy.subVectors(o,s),r=(d-u)/(d-u+(f-g)),n.copy(s).addScaledVector(wy,r);let p=1/(m+y+h);return a=y*p,r=h*p,n.copy(i).addScaledVector(Lr,a).addScaledVector(Dr,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Mx={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},oo={h:0,s:0,l:0},Zc={h:0,s:0,l:0};function pp(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var Wt=class{constructor(t,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,n,i)}set(t,n,i){if(n===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,n,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,n=Xe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,se.colorSpaceToWorking(this,n),this}setRGB(t,n,i,s=se.workingColorSpace){return this.r=t,this.g=n,this.b=i,se.colorSpaceToWorking(this,s),this}setHSL(t,n,i,s=se.workingColorSpace){if(t=Gp(t,1),n=Yt(n,0,1),i=Yt(i,0,1),n===0)this.r=this.g=this.b=i;else{let o=i<=.5?i*(1+n):i+n-i*n,a=2*i-o;this.r=pp(a,o,t+1/3),this.g=pp(a,o,t),this.b=pp(a,o,t-1/3)}return se.colorSpaceToWorking(this,s),this}setStyle(t,n=Xe){function i(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let o,a=s[1],r=s[2];switch(a){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,n);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,n);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let o=s[1],a=o.length;if(a===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(o,16),n);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,n);return this}setColorName(t,n=Xe){let i=Mx[t.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ps(t.r),this.g=Ps(t.g),this.b=Ps(t.b),this}copyLinearToSRGB(t){return this.r=Hr(t.r),this.g=Hr(t.g),this.b=Hr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Xe){return se.workingToColorSpace(An.copy(this),t),Math.round(Yt(An.r*255,0,255))*65536+Math.round(Yt(An.g*255,0,255))*256+Math.round(Yt(An.b*255,0,255))}getHexString(t=Xe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,n=se.workingColorSpace){se.workingToColorSpace(An.copy(this),n);let i=An.r,s=An.g,o=An.b,a=Math.max(i,s,o),r=Math.min(i,s,o),c,l,u=(r+a)/2;if(r===a)c=0,l=0;else{let d=a-r;switch(l=u<=.5?d/(a+r):d/(2-a-r),a){case i:c=(s-o)/d+(s<o?6:0);break;case s:c=(o-i)/d+2;break;case o:c=(i-s)/d+4;break}c/=6}return t.h=c,t.s=l,t.l=u,t}getRGB(t,n=se.workingColorSpace){return se.workingToColorSpace(An.copy(this),n),t.r=An.r,t.g=An.g,t.b=An.b,t}getStyle(t=Xe){se.workingToColorSpace(An.copy(this),t);let n=An.r,i=An.g,s=An.b;return t!==Xe?`color(${t} ${n.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,n,i){return this.getHSL(oo),this.setHSL(oo.h+t,oo.s+n,oo.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,n){return this.r=t.r+n.r,this.g=t.g+n.g,this.b=t.b+n.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,n){return this.r+=(t.r-this.r)*n,this.g+=(t.g-this.g)*n,this.b+=(t.b-this.b)*n,this}lerpColors(t,n,i){return this.r=t.r+(n.r-t.r)*i,this.g=t.g+(n.g-t.g)*i,this.b=t.b+(n.b-t.b)*i,this}lerpHSL(t,n){this.getHSL(oo),t.getHSL(Zc);let i=Za(oo.h,Zc.h,n),s=Za(oo.s,Zc.s,n),o=Za(oo.l,Zc.l,n);return this.setHSL(i,s,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let n=this.r,i=this.g,s=this.b,o=t.elements;return this.r=o[0]*n+o[3]*i+o[6]*s,this.g=o[1]*n+o[4]*i+o[7]*s,this.b=o[2]*n+o[5]*i+o[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,n=0){return this.r=t[n],this.g=t[n+1],this.b=t[n+2],this}toArray(t=[],n=0){return t[n]=this.r,t[n+1]=this.g,t[n+2]=this.b,t}fromBufferAttribute(t,n){return this.r=t.getX(n),this.g=t.getY(n),this.b=t.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},An=new Wt;Wt.NAMES=Mx;var zE=0,Ls=class extends cs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:zE++}),this.uuid=sa(),this.name="",this.type="Material",this.blending=qo,this.side=Is,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=uu,this.blendDst=du,this.blendEquation=lo,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Wt(0,0,0),this.blendAlpha=0,this.depthFunc=Xo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Mp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Wo,this.stencilZFail=Wo,this.stencilZPass=Wo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let n in t){let i=t[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}let s=this[n];if(s===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[n]=i}}toJSON(t){let n=t===void 0||typeof t=="string";n&&(t={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==qo&&(i.blending=this.blending),this.side!==Is&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==uu&&(i.blendSrc=this.blendSrc),this.blendDst!==du&&(i.blendDst=this.blendDst),this.blendEquation!==lo&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Xo&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Mp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Wo&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Wo&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Wo&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(o){let a=[];for(let r in o){let c=o[r];delete c.metadata,a.push(c)}return a}if(n){let o=s(t.textures),a=s(t.images);o.length>0&&(i.textures=o),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let n=t.clippingPlanes,i=null;if(n!==null){let s=n.length;i=new Array(s);for(let o=0;o!==s;++o)i[o]=n[o].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Qe=class extends Ls{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mi,this.combine=$u,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Ze=new L,Jc=new At,VE=0,hn=class{constructor(t,n,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:VE++}),this.name="",this.array=t,this.itemSize=n,this.count=t!==void 0?t.length/n:0,this.normalized=i,this.usage=Sp,this.updateRanges=[],this.gpuType=Wi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,n,i){t*=this.itemSize,i*=n.itemSize;for(let s=0,o=this.itemSize;s<o;s++)this.array[t+s]=n.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Jc.fromBufferAttribute(this,n),Jc.applyMatrix3(t),this.setXY(n,Jc.x,Jc.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Ze.fromBufferAttribute(this,n),Ze.applyMatrix3(t),this.setXYZ(n,Ze.x,Ze.y,Ze.z);return this}applyMatrix4(t){for(let n=0,i=this.count;n<i;n++)Ze.fromBufferAttribute(this,n),Ze.applyMatrix4(t),this.setXYZ(n,Ze.x,Ze.y,Ze.z);return this}applyNormalMatrix(t){for(let n=0,i=this.count;n<i;n++)Ze.fromBufferAttribute(this,n),Ze.applyNormalMatrix(t),this.setXYZ(n,Ze.x,Ze.y,Ze.z);return this}transformDirection(t){for(let n=0,i=this.count;n<i;n++)Ze.fromBufferAttribute(this,n),Ze.transformDirection(t),this.setXYZ(n,Ze.x,Ze.y,Ze.z);return this}set(t,n=0){return this.array.set(t,n),this}getComponent(t,n){let i=this.array[t*this.itemSize+n];return this.normalized&&(i=Br(i,this.array)),i}setComponent(t,n,i){return this.normalized&&(i=Hn(i,this.array)),this.array[t*this.itemSize+n]=i,this}getX(t){let n=this.array[t*this.itemSize];return this.normalized&&(n=Br(n,this.array)),n}setX(t,n){return this.normalized&&(n=Hn(n,this.array)),this.array[t*this.itemSize]=n,this}getY(t){let n=this.array[t*this.itemSize+1];return this.normalized&&(n=Br(n,this.array)),n}setY(t,n){return this.normalized&&(n=Hn(n,this.array)),this.array[t*this.itemSize+1]=n,this}getZ(t){let n=this.array[t*this.itemSize+2];return this.normalized&&(n=Br(n,this.array)),n}setZ(t,n){return this.normalized&&(n=Hn(n,this.array)),this.array[t*this.itemSize+2]=n,this}getW(t){let n=this.array[t*this.itemSize+3];return this.normalized&&(n=Br(n,this.array)),n}setW(t,n){return this.normalized&&(n=Hn(n,this.array)),this.array[t*this.itemSize+3]=n,this}setXY(t,n,i){return t*=this.itemSize,this.normalized&&(n=Hn(n,this.array),i=Hn(i,this.array)),this.array[t+0]=n,this.array[t+1]=i,this}setXYZ(t,n,i,s){return t*=this.itemSize,this.normalized&&(n=Hn(n,this.array),i=Hn(i,this.array),s=Hn(s,this.array)),this.array[t+0]=n,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,n,i,s,o){return t*=this.itemSize,this.normalized&&(n=Hn(n,this.array),i=Hn(i,this.array),s=Hn(s,this.array),o=Hn(o,this.array)),this.array[t+0]=n,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Sp&&(t.usage=this.usage),t}};var il=class extends hn{constructor(t,n,i){super(new Uint16Array(t),n,i)}};var sl=class extends hn{constructor(t,n,i){super(new Uint32Array(t),n,i)}};var ge=class extends hn{constructor(t,n,i){super(new Float32Array(t),n,i)}},GE=0,bi=new me,mp=new Je,Nr=new L,ri=new ds,qa=new ds,dn=new L,Rn=class e extends cs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:GE++}),this.uuid=sa(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Wp(t)?sl:il)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,n){return this.attributes[t]=n,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,n,i=0){this.groups.push({start:t,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,n){this.drawRange.start=t,this.drawRange.count=n}applyMatrix4(t){let n=this.attributes.position;n!==void 0&&(n.applyMatrix4(t),n.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let o=new Vt().getNormalMatrix(t);i.applyNormalMatrix(o),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return bi.makeRotationFromQuaternion(t),this.applyMatrix4(bi),this}rotateX(t){return bi.makeRotationX(t),this.applyMatrix4(bi),this}rotateY(t){return bi.makeRotationY(t),this.applyMatrix4(bi),this}rotateZ(t){return bi.makeRotationZ(t),this.applyMatrix4(bi),this}translate(t,n,i){return bi.makeTranslation(t,n,i),this.applyMatrix4(bi),this}scale(t,n,i){return bi.makeScale(t,n,i),this.applyMatrix4(bi),this}lookAt(t){return mp.lookAt(t),mp.updateMatrix(),this.applyMatrix4(mp.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Nr).negate(),this.translate(Nr.x,Nr.y,Nr.z),this}setFromPoints(t){let n=this.getAttribute("position");if(n===void 0){let i=[];for(let s=0,o=t.length;s<o;s++){let a=t[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ge(i,3))}else{let i=Math.min(t.length,n.count);for(let s=0;s<i;s++){let o=t[s];n.setXYZ(s,o.x,o.y,o.z||0)}t.length>n.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ds);let t=this.attributes.position,n=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),n)for(let i=0,s=n.length;i<s;i++){let o=n[i];ri.setFromBufferAttribute(o),this.morphTargetsRelative?(dn.addVectors(this.boundingBox.min,ri.min),this.boundingBox.expandByPoint(dn),dn.addVectors(this.boundingBox.max,ri.max),this.boundingBox.expandByPoint(dn)):(this.boundingBox.expandByPoint(ri.min),this.boundingBox.expandByPoint(ri.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new co);let t=this.attributes.position,n=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){let i=this.boundingSphere.center;if(ri.setFromBufferAttribute(t),n)for(let o=0,a=n.length;o<a;o++){let r=n[o];qa.setFromBufferAttribute(r),this.morphTargetsRelative?(dn.addVectors(ri.min,qa.min),ri.expandByPoint(dn),dn.addVectors(ri.max,qa.max),ri.expandByPoint(dn)):(ri.expandByPoint(qa.min),ri.expandByPoint(qa.max))}ri.getCenter(i);let s=0;for(let o=0,a=t.count;o<a;o++)dn.fromBufferAttribute(t,o),s=Math.max(s,i.distanceToSquared(dn));if(n)for(let o=0,a=n.length;o<a;o++){let r=n[o],c=this.morphTargetsRelative;for(let l=0,u=r.count;l<u;l++)dn.fromBufferAttribute(r,l),c&&(Nr.fromBufferAttribute(t,l),dn.add(Nr)),s=Math.max(s,i.distanceToSquared(dn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,n=this.attributes;if(t===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=n.position,s=n.normal,o=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new hn(new Float32Array(4*i.count),4));let a=this.getAttribute("tangent"),r=[],c=[];for(let R=0;R<i.count;R++)r[R]=new L,c[R]=new L;let l=new L,u=new L,d=new L,h=new At,f=new At,g=new At,y=new L,m=new L;function p(R,_,w){l.fromBufferAttribute(i,R),u.fromBufferAttribute(i,_),d.fromBufferAttribute(i,w),h.fromBufferAttribute(o,R),f.fromBufferAttribute(o,_),g.fromBufferAttribute(o,w),u.sub(l),d.sub(l),f.sub(h),g.sub(h);let P=1/(f.x*g.y-g.x*f.y);isFinite(P)&&(y.copy(u).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(P),m.copy(d).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(P),r[R].add(y),r[_].add(y),r[w].add(y),c[R].add(m),c[_].add(m),c[w].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let R=0,_=x.length;R<_;++R){let w=x[R],P=w.start,D=w.count;for(let U=P,H=P+D;U<H;U+=3)p(t.getX(U+0),t.getX(U+1),t.getX(U+2))}let b=new L,v=new L,T=new L,S=new L;function A(R){T.fromBufferAttribute(s,R),S.copy(T);let _=r[R];b.copy(_),b.sub(T.multiplyScalar(T.dot(_))).normalize(),v.crossVectors(S,_);let P=v.dot(c[R])<0?-1:1;a.setXYZW(R,b.x,b.y,b.z,P)}for(let R=0,_=x.length;R<_;++R){let w=x[R],P=w.start,D=w.count;for(let U=P,H=P+D;U<H;U+=3)A(t.getX(U+0)),A(t.getX(U+1)),A(t.getX(U+2))}}computeVertexNormals(){let t=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new hn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,f=i.count;h<f;h++)i.setXYZ(h,0,0,0);let s=new L,o=new L,a=new L,r=new L,c=new L,l=new L,u=new L,d=new L;if(t)for(let h=0,f=t.count;h<f;h+=3){let g=t.getX(h+0),y=t.getX(h+1),m=t.getX(h+2);s.fromBufferAttribute(n,g),o.fromBufferAttribute(n,y),a.fromBufferAttribute(n,m),u.subVectors(a,o),d.subVectors(s,o),u.cross(d),r.fromBufferAttribute(i,g),c.fromBufferAttribute(i,y),l.fromBufferAttribute(i,m),r.add(u),c.add(u),l.add(u),i.setXYZ(g,r.x,r.y,r.z),i.setXYZ(y,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let h=0,f=n.count;h<f;h+=3)s.fromBufferAttribute(n,h+0),o.fromBufferAttribute(n,h+1),a.fromBufferAttribute(n,h+2),u.subVectors(a,o),d.subVectors(s,o),u.cross(d),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let n=0,i=t.count;n<i;n++)dn.fromBufferAttribute(t,n),dn.normalize(),t.setXYZ(n,dn.x,dn.y,dn.z)}toNonIndexed(){function t(r,c){let l=r.array,u=r.itemSize,d=r.normalized,h=new l.constructor(c.length*u),f=0,g=0;for(let y=0,m=c.length;y<m;y++){r.isInterleavedBufferAttribute?f=c[y]*r.data.stride+r.offset:f=c[y]*u;for(let p=0;p<u;p++)h[g++]=l[f++]}return new hn(h,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let n=new e,i=this.index.array,s=this.attributes;for(let r in s){let c=s[r],l=t(c,i);n.setAttribute(r,l)}let o=this.morphAttributes;for(let r in o){let c=[],l=o[r];for(let u=0,d=l.length;u<d;u++){let h=l[u],f=t(h,i);c.push(f)}n.morphAttributes[r]=c}n.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let r=0,c=a.length;r<c;r++){let l=a[r];n.addGroup(l.start,l.count,l.materialIndex)}return n}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let n=this.index;n!==null&&(t.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});let i=this.attributes;for(let c in i){let l=i[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},o=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let d=0,h=l.length;d<h;d++){let f=l[d];u.push(f.toJSON(t.data))}u.length>0&&(s[c]=u,o=!0)}o&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let r=this.boundingSphere;return r!==null&&(t.data.boundingSphere=r.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let n={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone());let s=t.attributes;for(let l in s){let u=s[l];this.setAttribute(l,u.clone(n))}let o=t.morphAttributes;for(let l in o){let u=[],d=o[l];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(n));this.morphAttributes[l]=u}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let l=0,u=a.length;l<u;l++){let d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}let r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},My=new me,Vo=new Yo,Qc=new co,Sy=new L,tu=new L,eu=new L,nu=new L,gp=new L,iu=new L,Ey=new L,su=new L,G=class extends Je{constructor(t=new Rn,n=new Qe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,n){return super.copy(t,n),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=s.length;o<a;o++){let r=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}getVertexPosition(t,n){let i=this.geometry,s=i.attributes.position,o=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(s,t);let r=this.morphTargetInfluences;if(o&&r){iu.set(0,0,0);for(let c=0,l=o.length;c<l;c++){let u=r[c],d=o[c];u!==0&&(gp.fromBufferAttribute(d,t),a?iu.addScaledVector(gp,u):iu.addScaledVector(gp.sub(n),u))}n.add(iu)}return n}raycast(t,n){let i=this.geometry,s=this.material,o=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Qc.copy(i.boundingSphere),Qc.applyMatrix4(o),Vo.copy(t.ray).recast(t.near),!(Qc.containsPoint(Vo.origin)===!1&&(Vo.intersectSphere(Qc,Sy)===null||Vo.origin.distanceToSquared(Sy)>(t.far-t.near)**2))&&(My.copy(o).invert(),Vo.copy(t.ray).applyMatrix4(My),!(i.boundingBox!==null&&Vo.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,n,Vo)))}_computeIntersections(t,n,i){let s,o=this.geometry,a=this.material,r=o.index,c=o.attributes.position,l=o.attributes.uv,u=o.attributes.uv1,d=o.attributes.normal,h=o.groups,f=o.drawRange;if(r!==null)if(Array.isArray(a))for(let g=0,y=h.length;g<y;g++){let m=h[g],p=a[m.materialIndex],x=Math.max(m.start,f.start),b=Math.min(r.count,Math.min(m.start+m.count,f.start+f.count));for(let v=x,T=b;v<T;v+=3){let S=r.getX(v),A=r.getX(v+1),R=r.getX(v+2);s=ou(this,p,t,i,l,u,d,S,A,R),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,n.push(s))}}else{let g=Math.max(0,f.start),y=Math.min(r.count,f.start+f.count);for(let m=g,p=y;m<p;m+=3){let x=r.getX(m),b=r.getX(m+1),v=r.getX(m+2);s=ou(this,a,t,i,l,u,d,x,b,v),s&&(s.faceIndex=Math.floor(m/3),n.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,y=h.length;g<y;g++){let m=h[g],p=a[m.materialIndex],x=Math.max(m.start,f.start),b=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let v=x,T=b;v<T;v+=3){let S=v,A=v+1,R=v+2;s=ou(this,p,t,i,l,u,d,S,A,R),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,n.push(s))}}else{let g=Math.max(0,f.start),y=Math.min(c.count,f.start+f.count);for(let m=g,p=y;m<p;m+=3){let x=m,b=m+1,v=m+2;s=ou(this,a,t,i,l,u,d,x,b,v),s&&(s.faceIndex=Math.floor(m/3),n.push(s))}}}};function WE(e,t,n,i,s,o,a,r){let c;if(t.side===yn?c=i.intersectTriangle(a,o,s,!0,r):c=i.intersectTriangle(s,o,a,t.side===Is,r),c===null)return null;su.copy(r),su.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(su);return l<n.near||l>n.far?null:{distance:l,point:su.clone(),object:e}}function ou(e,t,n,i,s,o,a,r,c,l){e.getVertexPosition(r,tu),e.getVertexPosition(c,eu),e.getVertexPosition(l,nu);let u=WE(e,t,n,i,tu,eu,nu,Ey);if(u){let d=new L;ao.getBarycoord(Ey,tu,eu,nu,d),s&&(u.uv=ao.getInterpolatedAttribute(s,r,c,l,d,new At)),o&&(u.uv1=ao.getInterpolatedAttribute(o,r,c,l,d,new At)),a&&(u.normal=ao.getInterpolatedAttribute(a,r,c,l,d,new L),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let h={a:r,b:c,c:l,normal:new L,materialIndex:0};ao.getNormal(tu,eu,nu,h.normal),u.face=h,u.barycoord=d}return u}var fn=class e extends Rn{constructor(t=1,n=1,i=1,s=1,o=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:n,depth:i,widthSegments:s,heightSegments:o,depthSegments:a};let r=this;s=Math.floor(s),o=Math.floor(o),a=Math.floor(a);let c=[],l=[],u=[],d=[],h=0,f=0;g("z","y","x",-1,-1,i,n,t,a,o,0),g("z","y","x",1,-1,i,n,-t,a,o,1),g("x","z","y",1,1,t,i,n,s,a,2),g("x","z","y",1,-1,t,i,-n,s,a,3),g("x","y","z",1,-1,t,n,i,s,o,4),g("x","y","z",-1,-1,t,n,-i,s,o,5),this.setIndex(c),this.setAttribute("position",new ge(l,3)),this.setAttribute("normal",new ge(u,3)),this.setAttribute("uv",new ge(d,2));function g(y,m,p,x,b,v,T,S,A,R,_){let w=v/A,P=T/R,D=v/2,U=T/2,H=S/2,X=A+1,z=R+1,Z=0,V=0,lt=new L;for(let dt=0;dt<z;dt++){let bt=dt*P-U;for(let qt=0;qt<X;qt++){let ee=qt*w-D;lt[y]=ee*x,lt[m]=bt*b,lt[p]=H,l.push(lt.x,lt.y,lt.z),lt[y]=0,lt[m]=0,lt[p]=S>0?1:-1,u.push(lt.x,lt.y,lt.z),d.push(qt/A),d.push(1-dt/R),Z+=1}}for(let dt=0;dt<R;dt++)for(let bt=0;bt<A;bt++){let qt=h+bt+X*dt,ee=h+bt+X*(dt+1),Ee=h+(bt+1)+X*(dt+1),re=h+(bt+1)+X*dt;c.push(qt,ee,re),c.push(ee,Ee,re),V+=6}r.addGroup(f,V,_),f+=V,h+=Z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function er(e){let t={};for(let n in e){t[n]={};for(let i in e[n]){let s=e[n][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[n][i]=null):t[n][i]=s.clone():Array.isArray(s)?t[n][i]=s.slice():t[n][i]=s}}return t}function kn(e){let t={};for(let n=0;n<e.length;n++){let i=er(e[n]);for(let s in i)t[s]=i[s]}return t}function qE(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function qp(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:se.workingColorSpace}var Sx={clone:er,merge:kn},XE=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,jE=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,zi=class extends Ls{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=XE,this.fragmentShader=jE,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=er(t.uniforms),this.uniformsGroups=qE(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let n=super.toJSON(t);n.glslVersion=this.glslVersion,n.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?n.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?n.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[s]={type:"m4",value:a.toArray()}:n.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}},ol=class extends Je{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new me,this.projectionMatrix=new me,this.projectionMatrixInverse=new me,this.coordinateSystem=Hi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,n){return super.copy(t,n),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,n){super.updateWorldMatrix(t,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},ro=new L,Ty=new At,Ay=new At,gn=class extends ol{constructor(t=50,n=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,n){return super.copy(t,n),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let n=.5*this.getFilmHeight()/t;this.fov=Vr*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Ka*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Vr*2*Math.atan(Math.tan(Ka*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,n,i){ro.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ro.x,ro.y).multiplyScalar(-t/ro.z),ro.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ro.x,ro.y).multiplyScalar(-t/ro.z)}getViewSize(t,n){return this.getViewBounds(t,Ty,Ay),n.subVectors(Ay,Ty)}setViewOffset(t,n,i,s,o,a){this.aspect=t/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,n=t*Math.tan(Ka*.5*this.fov)/this.zoom,i=2*n,s=this.aspect*i,o=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;o+=a.offsetX*s/c,n-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}let r=this.filmOffset;r!==0&&(o+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+s,n,n-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let n=super.toJSON(t);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}},Ur=-90,Or=1,yu=class extends Je{constructor(t,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new gn(Ur,Or,t,n);s.layers=this.layers,this.add(s);let o=new gn(Ur,Or,t,n);o.layers=this.layers,this.add(o);let a=new gn(Ur,Or,t,n);a.layers=this.layers,this.add(a);let r=new gn(Ur,Or,t,n);r.layers=this.layers,this.add(r);let c=new gn(Ur,Or,t,n);c.layers=this.layers,this.add(c);let l=new gn(Ur,Or,t,n);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,n=this.children.concat(),[i,s,o,a,r,c]=n;for(let l of n)this.remove(l);if(t===Hi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===tl)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of n)this.add(l),l.updateMatrixWorld()}update(t,n){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[o,a,r,c,l,u]=this.children,d=t.getRenderTarget(),h=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(n,o),t.setRenderTarget(i,1,s),t.render(n,a),t.setRenderTarget(i,2,s),t.render(n,r),t.setRenderTarget(i,3,s),t.render(n,c),t.setRenderTarget(i,4,s),t.render(n,l),i.texture.generateMipmaps=y,t.setRenderTarget(i,5,s),t.render(n,u),t.setRenderTarget(d,h,f),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},rl=class extends $n{constructor(t=[],n=Qo,i,s,o,a,r,c,l,u){super(t,n,i,s,o,a,r,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},xu=class extends us{constructor(t=1,n={}){super(t,t,n),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new rl(s),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new fn(5,5,5),o=new zi({name:"CubemapFromEquirect",uniforms:er(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:yn,blending:Ds});o.uniforms.tEquirect.value=n;let a=new G(s,o),r=n.minFilter;return n.minFilter===fo&&(n.minFilter=$i),new yu(1,10,this).update(t,a),n.minFilter=r,a.geometry.dispose(),a.material.dispose(),this}clear(t,n=!0,i=!0,s=!0){let o=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(n,i,s);t.setRenderTarget(o)}},Bt=class extends Je{constructor(){super(),this.isGroup=!0,this.type="Group"}},YE={type:"move"},Xr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Bt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Bt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Bt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let n=this._hand;if(n)for(let i of t.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,n,i){let s=null,o=null,a=null,r=this._targetRay,c=this._grip,l=this._hand;if(t&&n.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(let y of t.hand.values()){let m=n.getJointPose(y,i),p=this._getHandJoint(l,y);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let u=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,g=.005;l.inputState.pinching&&h>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(o=n.getPose(t.gripSpace,i),o!==null&&(c.matrix.fromArray(o.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,o.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(o.linearVelocity)):c.hasLinearVelocity=!1,o.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(o.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(s=n.getPose(t.targetRaySpace,i),s===null&&o!==null&&(s=o),s!==null&&(r.matrix.fromArray(s.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,s.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(s.linearVelocity)):r.hasLinearVelocity=!1,s.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(s.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(YE)))}return r!==null&&(r.visible=s!==null),c!==null&&(c.visible=o!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,n){if(t.joints[n.jointName]===void 0){let i=new Bt;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[n.jointName]=i,t.add(i)}return t.joints[n.jointName]}};var Ko=class extends Je{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Mi,this.environmentIntensity=1,this.environmentRotation=new Mi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,n){return super.copy(t,n),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let n=super.toJSON(t);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}};var _u=class extends $n{constructor(t=null,n=1,i=1,s,o,a,r,c,l=jn,u=jn,d,h){super(null,a,r,c,l,u,s,o,d,h),this.isDataTexture=!0,this.image={data:t,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var jr=class extends hn{constructor(t,n,i,s=1){super(t,n,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Fr=new me,Ry=new me,ru=[],Cy=new ds,KE=new me,Xa=new G,ja=new co,al=class extends G{constructor(t,n,i){super(t,n),this.isInstancedMesh=!0,this.instanceMatrix=new jr(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,KE)}computeBoundingBox(){let t=this.geometry,n=this.count;this.boundingBox===null&&(this.boundingBox=new ds),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,Fr),Cy.copy(t.boundingBox).applyMatrix4(Fr),this.boundingBox.union(Cy)}computeBoundingSphere(){let t=this.geometry,n=this.count;this.boundingSphere===null&&(this.boundingSphere=new co),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,Fr),ja.copy(t.boundingSphere).applyMatrix4(Fr),this.boundingSphere.union(ja)}copy(t,n){return super.copy(t,n),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,n){n.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,n){n.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,n){let i=n.morphTargetInfluences,s=this.morphTexture.source.data.data,o=i.length+1,a=t*o+1;for(let r=0;r<i.length;r++)i[r]=s[a+r]}raycast(t,n){let i=this.matrixWorld,s=this.count;if(Xa.geometry=this.geometry,Xa.material=this.material,Xa.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ja.copy(this.boundingSphere),ja.applyMatrix4(i),t.ray.intersectsSphere(ja)!==!1))for(let o=0;o<s;o++){this.getMatrixAt(o,Fr),Ry.multiplyMatrices(i,Fr),Xa.matrixWorld=Ry,Xa.raycast(t,ru);for(let a=0,r=ru.length;a<r;a++){let c=ru[a];c.instanceId=o,c.object=this,n.push(c)}ru.length=0}}setColorAt(t,n){this.instanceColor===null&&(this.instanceColor=new jr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),n.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,n){n.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,n){let i=n.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new _u(new Float32Array(s*this.count),s,this.count,ju,Wi));let o=this.morphTexture.source.data.data,a=0;for(let l=0;l<i.length;l++)a+=i[l];let r=this.geometry.morphTargetsRelative?1:1-a,c=s*t;o[c]=r,o.set(i,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},yp=new L,ZE=new L,JE=new Vt,vi=class{constructor(t=new L(1,0,0),n=0){this.isPlane=!0,this.normal=t,this.constant=n}set(t,n){return this.normal.copy(t),this.constant=n,this}setComponents(t,n,i,s){return this.normal.set(t,n,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,n){return this.normal.copy(t),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(t,n,i){let s=yp.subVectors(i,n).cross(ZE.subVectors(t,n)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,n){return n.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,n){let i=t.delta(yp),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?n.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/s;return o<0||o>1?null:n.copy(t.start).addScaledVector(i,o)}intersectsLine(t){let n=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return n<0&&i>0||i<0&&n>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,n){let i=n||JE.getNormalMatrix(t),s=this.coplanarPoint(yp).applyMatrix4(t),o=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Go=new co,QE=new At(.5,.5),au=new L,Yr=class{constructor(t=new vi,n=new vi,i=new vi,s=new vi,o=new vi,a=new vi){this.planes=[t,n,i,s,o,a]}set(t,n,i,s,o,a){let r=this.planes;return r[0].copy(t),r[1].copy(n),r[2].copy(i),r[3].copy(s),r[4].copy(o),r[5].copy(a),this}copy(t){let n=this.planes;for(let i=0;i<6;i++)n[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,n=Hi,i=!1){let s=this.planes,o=t.elements,a=o[0],r=o[1],c=o[2],l=o[3],u=o[4],d=o[5],h=o[6],f=o[7],g=o[8],y=o[9],m=o[10],p=o[11],x=o[12],b=o[13],v=o[14],T=o[15];if(s[0].setComponents(l-a,f-u,p-g,T-x).normalize(),s[1].setComponents(l+a,f+u,p+g,T+x).normalize(),s[2].setComponents(l+r,f+d,p+y,T+b).normalize(),s[3].setComponents(l-r,f-d,p-y,T-b).normalize(),i)s[4].setComponents(c,h,m,v).normalize(),s[5].setComponents(l-c,f-h,p-m,T-v).normalize();else if(s[4].setComponents(l-c,f-h,p-m,T-v).normalize(),n===Hi)s[5].setComponents(l+c,f+h,p+m,T+v).normalize();else if(n===tl)s[5].setComponents(c,h,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Go.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let n=t.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Go.copy(n.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Go)}intersectsSprite(t){Go.center.set(0,0,0);let n=QE.distanceTo(t.center);return Go.radius=.7071067811865476+n,Go.applyMatrix4(t.matrixWorld),this.intersectsSphere(Go)}intersectsSphere(t){let n=this.planes,i=t.center,s=-t.radius;for(let o=0;o<6;o++)if(n[o].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let n=this.planes;for(let i=0;i<6;i++){let s=n[i];if(au.x=s.normal.x>0?t.max.x:t.min.x,au.y=s.normal.y>0?t.max.y:t.min.y,au.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(au)<0)return!1}return!0}containsPoint(t){let n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var hs=class extends $n{constructor(t,n,i,s,o,a,r,c,l){super(t,n,i,s,o,a,r,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},ll=class extends $n{constructor(t,n,i=po,s,o,a,r=jn,c=jn,l,u=zr,d=1){if(u!==zr&&u!==ia)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:t,height:n,depth:d};super(h,s,o,a,r,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Wr(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let n=super.toJSON(t);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}},cl=class extends $n{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}};var Zo=class e extends Rn{constructor(t=1,n=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:n,thetaStart:i,thetaLength:s},n=Math.max(3,n);let o=[],a=[],r=[],c=[],l=new L,u=new At;a.push(0,0,0),r.push(0,0,1),c.push(.5,.5);for(let d=0,h=3;d<=n;d++,h+=3){let f=i+d/n*s;l.x=t*Math.cos(f),l.y=t*Math.sin(f),a.push(l.x,l.y,l.z),r.push(0,0,1),u.x=(a[h]/t+1)/2,u.y=(a[h+1]/t+1)/2,c.push(u.x,u.y)}for(let d=1;d<=n;d++)o.push(d,d+1,0);this.setIndex(o),this.setAttribute("position",new ge(a,3)),this.setAttribute("normal",new ge(r,3)),this.setAttribute("uv",new ge(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},de=class e extends Rn{constructor(t=1,n=1,i=1,s=32,o=1,a=!1,r=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:n,height:i,radialSegments:s,heightSegments:o,openEnded:a,thetaStart:r,thetaLength:c};let l=this;s=Math.floor(s),o=Math.floor(o);let u=[],d=[],h=[],f=[],g=0,y=[],m=i/2,p=0;x(),a===!1&&(t>0&&b(!0),n>0&&b(!1)),this.setIndex(u),this.setAttribute("position",new ge(d,3)),this.setAttribute("normal",new ge(h,3)),this.setAttribute("uv",new ge(f,2));function x(){let v=new L,T=new L,S=0,A=(n-t)/i;for(let R=0;R<=o;R++){let _=[],w=R/o,P=w*(n-t)+t;for(let D=0;D<=s;D++){let U=D/s,H=U*c+r,X=Math.sin(H),z=Math.cos(H);T.x=P*X,T.y=-w*i+m,T.z=P*z,d.push(T.x,T.y,T.z),v.set(X,A,z).normalize(),h.push(v.x,v.y,v.z),f.push(U,1-w),_.push(g++)}y.push(_)}for(let R=0;R<s;R++)for(let _=0;_<o;_++){let w=y[_][R],P=y[_+1][R],D=y[_+1][R+1],U=y[_][R+1];(t>0||_!==0)&&(u.push(w,P,U),S+=3),(n>0||_!==o-1)&&(u.push(P,D,U),S+=3)}l.addGroup(p,S,0),p+=S}function b(v){let T=g,S=new At,A=new L,R=0,_=v===!0?t:n,w=v===!0?1:-1;for(let D=1;D<=s;D++)d.push(0,m*w,0),h.push(0,w,0),f.push(.5,.5),g++;let P=g;for(let D=0;D<=s;D++){let H=D/s*c+r,X=Math.cos(H),z=Math.sin(H);A.x=_*z,A.y=m*w,A.z=_*X,d.push(A.x,A.y,A.z),h.push(0,w,0),S.x=X*.5+.5,S.y=z*.5*w+.5,f.push(S.x,S.y),g++}for(let D=0;D<s;D++){let U=T+D,H=P+D;v===!0?u.push(H,H+1,U):u.push(H+1,H,U),R+=3}l.addGroup(p,R,v===!0?1:2),p+=R}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ul=class e extends de{constructor(t=1,n=1,i=32,s=1,o=!1,a=0,r=Math.PI*2){super(0,t,n,i,s,o,a,r),this.type="ConeGeometry",this.parameters={radius:t,height:n,radialSegments:i,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:r}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},dl=class e extends Rn{constructor(t=[],n=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:n,radius:i,detail:s};let o=[],a=[];r(s),l(i),u(),this.setAttribute("position",new ge(o,3)),this.setAttribute("normal",new ge(o.slice(),3)),this.setAttribute("uv",new ge(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function r(x){let b=new L,v=new L,T=new L;for(let S=0;S<n.length;S+=3)f(n[S+0],b),f(n[S+1],v),f(n[S+2],T),c(b,v,T,x)}function c(x,b,v,T){let S=T+1,A=[];for(let R=0;R<=S;R++){A[R]=[];let _=x.clone().lerp(v,R/S),w=b.clone().lerp(v,R/S),P=S-R;for(let D=0;D<=P;D++)D===0&&R===S?A[R][D]=_:A[R][D]=_.clone().lerp(w,D/P)}for(let R=0;R<S;R++)for(let _=0;_<2*(S-R)-1;_++){let w=Math.floor(_/2);_%2===0?(h(A[R][w+1]),h(A[R+1][w]),h(A[R][w])):(h(A[R][w+1]),h(A[R+1][w+1]),h(A[R+1][w]))}}function l(x){let b=new L;for(let v=0;v<o.length;v+=3)b.x=o[v+0],b.y=o[v+1],b.z=o[v+2],b.normalize().multiplyScalar(x),o[v+0]=b.x,o[v+1]=b.y,o[v+2]=b.z}function u(){let x=new L;for(let b=0;b<o.length;b+=3){x.x=o[b+0],x.y=o[b+1],x.z=o[b+2];let v=m(x)/2/Math.PI+.5,T=p(x)/Math.PI+.5;a.push(v,1-T)}g(),d()}function d(){for(let x=0;x<a.length;x+=6){let b=a[x+0],v=a[x+2],T=a[x+4],S=Math.max(b,v,T),A=Math.min(b,v,T);S>.9&&A<.1&&(b<.2&&(a[x+0]+=1),v<.2&&(a[x+2]+=1),T<.2&&(a[x+4]+=1))}}function h(x){o.push(x.x,x.y,x.z)}function f(x,b){let v=x*3;b.x=t[v+0],b.y=t[v+1],b.z=t[v+2]}function g(){let x=new L,b=new L,v=new L,T=new L,S=new At,A=new At,R=new At;for(let _=0,w=0;_<o.length;_+=9,w+=6){x.set(o[_+0],o[_+1],o[_+2]),b.set(o[_+3],o[_+4],o[_+5]),v.set(o[_+6],o[_+7],o[_+8]),S.set(a[w+0],a[w+1]),A.set(a[w+2],a[w+3]),R.set(a[w+4],a[w+5]),T.copy(x).add(b).add(v).divideScalar(3);let P=m(T);y(S,w+0,x,P),y(A,w+2,b,P),y(R,w+4,v,P)}}function y(x,b,v,T){T<0&&x.x===1&&(a[b]=x.x-1),v.x===0&&v.z===0&&(a[b]=T/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.details)}};var hl=class e extends dl{constructor(t=1,n=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,o,t,n),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:n}}static fromJSON(t){return new e(t.radius,t.detail)}};var fl=class e extends dl{constructor(t=1,n=0){let i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,t,n),this.type="OctahedronGeometry",this.parameters={radius:t,detail:n}}static fromJSON(t){return new e(t.radius,t.detail)}},Cn=class e extends Rn{constructor(t=1,n=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:n,widthSegments:i,heightSegments:s};let o=t/2,a=n/2,r=Math.floor(i),c=Math.floor(s),l=r+1,u=c+1,d=t/r,h=n/c,f=[],g=[],y=[],m=[];for(let p=0;p<u;p++){let x=p*h-a;for(let b=0;b<l;b++){let v=b*d-o;g.push(v,-x,0),y.push(0,0,1),m.push(b/r),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<r;x++){let b=x+l*p,v=x+l*(p+1),T=x+1+l*(p+1),S=x+1+l*p;f.push(b,v,S),f.push(v,T,S)}this.setIndex(f),this.setAttribute("position",new ge(g,3)),this.setAttribute("normal",new ge(y,3)),this.setAttribute("uv",new ge(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},pl=class e extends Rn{constructor(t=.5,n=1,i=32,s=1,o=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:n,thetaSegments:i,phiSegments:s,thetaStart:o,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);let r=[],c=[],l=[],u=[],d=t,h=(n-t)/s,f=new L,g=new At;for(let y=0;y<=s;y++){for(let m=0;m<=i;m++){let p=o+m/i*a;f.x=d*Math.cos(p),f.y=d*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/n+1)/2,g.y=(f.y/n+1)/2,u.push(g.x,g.y)}d+=h}for(let y=0;y<s;y++){let m=y*(i+1);for(let p=0;p<i;p++){let x=p+m,b=x,v=x+i+1,T=x+i+2,S=x+1;r.push(b,v,S),r.push(v,T,S)}}this.setIndex(r),this.setAttribute("position",new ge(c,3)),this.setAttribute("normal",new ge(l,3)),this.setAttribute("uv",new ge(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}};var Yn=class e extends Rn{constructor(t=1,n=32,i=16,s=0,o=Math.PI*2,a=0,r=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:n,heightSegments:i,phiStart:s,phiLength:o,thetaStart:a,thetaLength:r},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));let c=Math.min(a+r,Math.PI),l=0,u=[],d=new L,h=new L,f=[],g=[],y=[],m=[];for(let p=0;p<=i;p++){let x=[],b=p/i,v=0;p===0&&a===0?v=.5/n:p===i&&c===Math.PI&&(v=-.5/n);for(let T=0;T<=n;T++){let S=T/n;d.x=-t*Math.cos(s+S*o)*Math.sin(a+b*r),d.y=t*Math.cos(a+b*r),d.z=t*Math.sin(s+S*o)*Math.sin(a+b*r),g.push(d.x,d.y,d.z),h.copy(d).normalize(),y.push(h.x,h.y,h.z),m.push(S+v,1-b),x.push(l++)}u.push(x)}for(let p=0;p<i;p++)for(let x=0;x<n;x++){let b=u[p][x+1],v=u[p][x],T=u[p+1][x],S=u[p+1][x+1];(p!==0||a>0)&&f.push(b,v,S),(p!==i-1||c<Math.PI)&&f.push(v,T,S)}this.setIndex(f),this.setAttribute("position",new ge(g,3)),this.setAttribute("normal",new ge(y,3)),this.setAttribute("uv",new ge(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Kr=class e extends Rn{constructor(t=1,n=.4,i=12,s=48,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:n,radialSegments:i,tubularSegments:s,arc:o},i=Math.floor(i),s=Math.floor(s);let a=[],r=[],c=[],l=[],u=new L,d=new L,h=new L;for(let f=0;f<=i;f++)for(let g=0;g<=s;g++){let y=g/s*o,m=f/i*Math.PI*2;d.x=(t+n*Math.cos(m))*Math.cos(y),d.y=(t+n*Math.cos(m))*Math.sin(y),d.z=n*Math.sin(m),r.push(d.x,d.y,d.z),u.x=t*Math.cos(y),u.y=t*Math.sin(y),h.subVectors(d,u).normalize(),c.push(h.x,h.y,h.z),l.push(g/s),l.push(f/i)}for(let f=1;f<=i;f++)for(let g=1;g<=s;g++){let y=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,x=(s+1)*f+g;a.push(y,m,x),a.push(m,p,x)}this.setIndex(a),this.setAttribute("position",new ge(r,3)),this.setAttribute("normal",new ge(c,3)),this.setAttribute("uv",new ge(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var _e=class extends Ls{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Wt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Wt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Td,this.normalScale=new At(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var ml=class extends Ls{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Wt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Td,this.normalScale=new At(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mi,this.combine=$u,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},bu=class extends Ls{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=dx,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},vu=class extends Ls{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function lu(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT=="number"?new t(e):Array.prototype.slice.call(e)}function t1(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}var Jo=class{constructor(t,n,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new n.constructor(i),this.sampleValues=n,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let n=this.parameterPositions,i=this._cachedIndex,s=n[i],o=n[i-1];n:{t:{let a;e:{i:if(!(t<s)){for(let r=i+2;;){if(s===void 0){if(t<o)break i;return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===r)break;if(o=s,s=n[++i],t<s)break t}a=n.length;break e}if(!(t>=o)){let r=n[1];t<r&&(i=2,o=r);for(let c=i-2;;){if(o===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=o,o=n[--i-1],t>=o)break t}a=i,i=0;break e}break n}for(;i<a;){let r=i+a>>>1;t<n[r]?a=r:i=r+1}if(s=n[i],o=n[i-1],o===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,o,s)}return this.interpolate_(i,o,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let n=this.resultBuffer,i=this.sampleValues,s=this.valueSize,o=t*s;for(let a=0;a!==s;++a)n[a]=i[o+a];return n}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},wu=class extends Jo{constructor(t,n,i,s){super(t,n,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:bp,endingEnd:bp}}intervalChanged_(t,n,i){let s=this.parameterPositions,o=t-2,a=t+1,r=s[o],c=s[a];if(r===void 0)switch(this.getSettings_().endingStart){case vp:o=t,r=2*n-i;break;case wp:o=s.length-2,r=n+s[o]-s[o+1];break;default:o=t,r=i}if(c===void 0)switch(this.getSettings_().endingEnd){case vp:a=t,c=2*i-n;break;case wp:a=1,c=i+s[1]-s[0];break;default:a=t-1,c=n}let l=(i-n)*.5,u=this.valueSize;this._weightPrev=l/(n-r),this._weightNext=l/(c-i),this._offsetPrev=o*u,this._offsetNext=a*u}interpolate_(t,n,i,s){let o=this.resultBuffer,a=this.sampleValues,r=this.valueSize,c=t*r,l=c-r,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,f=this._weightNext,g=(i-n)/(s-n),y=g*g,m=y*g,p=-h*m+2*h*y-h*g,x=(1+h)*m+(-1.5-2*h)*y+(-.5+h)*g+1,b=(-1-f)*m+(1.5+f)*y+.5*g,v=f*m-f*y;for(let T=0;T!==r;++T)o[T]=p*a[u+T]+x*a[l+T]+b*a[c+T]+v*a[d+T];return o}},Mu=class extends Jo{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t,n,i,s){let o=this.resultBuffer,a=this.sampleValues,r=this.valueSize,c=t*r,l=c-r,u=(i-n)/(s-n),d=1-u;for(let h=0;h!==r;++h)o[h]=a[l+h]*d+a[c+h]*u;return o}},Su=class extends Jo{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},ai=class{constructor(t,n,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(n===void 0||n.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=lu(n,this.TimeBufferType),this.values=lu(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let n=t.constructor,i;if(n.toJSON!==this.toJSON)i=n.toJSON(t);else{i={name:t.name,times:lu(t.times,Array),values:lu(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s)}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new Su(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Mu(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new wu(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let n;switch(t){case Ja:n=this.InterpolantFactoryMethodDiscrete;break;case fu:n=this.InterpolantFactoryMethodLinear;break;case cu:n=this.InterpolantFactoryMethodSmooth;break}if(n===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=n,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ja;case this.InterpolantFactoryMethodLinear:return fu;case this.InterpolantFactoryMethodSmooth:return cu}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let n=this.times;for(let i=0,s=n.length;i!==s;++i)n[i]+=t}return this}scale(t){if(t!==1){let n=this.times;for(let i=0,s=n.length;i!==s;++i)n[i]*=t}return this}trim(t,n){let i=this.times,s=i.length,o=0,a=s-1;for(;o!==s&&i[o]<t;)++o;for(;a!==-1&&i[a]>n;)--a;if(++a,o!==0||a!==s){o>=a&&(a=Math.max(a,1),o=a-1);let r=this.getValueSize();this.times=i.slice(o,a),this.values=this.values.slice(o*r,a*r)}return this}validate(){let t=!0,n=this.getValueSize();n-Math.floor(n)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,o=i.length;o===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let r=0;r!==o;r++){let c=i[r];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,r,c),t=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,r,c,a),t=!1;break}a=c}if(s!==void 0&&t1(s))for(let r=0,c=s.length;r!==c;++r){let l=s[r];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,r,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),n=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===cu,o=t.length-1,a=1;for(let r=1;r<o;++r){let c=!1,l=t[r],u=t[r+1];if(l!==u&&(r!==1||l!==t[0]))if(s)c=!0;else{let d=r*i,h=d-i,f=d+i;for(let g=0;g!==i;++g){let y=n[d+g];if(y!==n[h+g]||y!==n[f+g]){c=!0;break}}}if(c){if(r!==a){t[a]=t[r];let d=r*i,h=a*i;for(let f=0;f!==i;++f)n[h+f]=n[d+f]}++a}}if(o>0){t[a]=t[o];for(let r=o*i,c=a*i,l=0;l!==i;++l)n[c+l]=n[r+l];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=n.slice(0,a*i)):(this.times=t,this.values=n),this}clone(){let t=this.times.slice(),n=this.values.slice(),i=this.constructor,s=new i(this.name,t,n);return s.createInterpolant=this.createInterpolant,s}};ai.prototype.ValueTypeName="";ai.prototype.TimeBufferType=Float32Array;ai.prototype.ValueBufferType=Float32Array;ai.prototype.DefaultInterpolation=fu;var uo=class extends ai{constructor(t,n,i){super(t,n,i)}};uo.prototype.ValueTypeName="bool";uo.prototype.ValueBufferType=Array;uo.prototype.DefaultInterpolation=Ja;uo.prototype.InterpolantFactoryMethodLinear=void 0;uo.prototype.InterpolantFactoryMethodSmooth=void 0;var Eu=class extends ai{constructor(t,n,i,s){super(t,n,i,s)}};Eu.prototype.ValueTypeName="color";var Tu=class extends ai{constructor(t,n,i,s){super(t,n,i,s)}};Tu.prototype.ValueTypeName="number";var Au=class extends Jo{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t,n,i,s){let o=this.resultBuffer,a=this.sampleValues,r=this.valueSize,c=(i-n)/(s-n),l=t*r;for(let u=l+r;l!==u;l+=4)wi.slerpFlat(o,0,a,l-r,a,l,c);return o}},gl=class extends ai{constructor(t,n,i,s){super(t,n,i,s)}InterpolantFactoryMethodLinear(t){return new Au(this.times,this.values,this.getValueSize(),t)}};gl.prototype.ValueTypeName="quaternion";gl.prototype.InterpolantFactoryMethodSmooth=void 0;var ho=class extends ai{constructor(t,n,i){super(t,n,i)}};ho.prototype.ValueTypeName="string";ho.prototype.ValueBufferType=Array;ho.prototype.DefaultInterpolation=Ja;ho.prototype.InterpolantFactoryMethodLinear=void 0;ho.prototype.InterpolantFactoryMethodSmooth=void 0;var Ru=class extends ai{constructor(t,n,i,s){super(t,n,i,s)}};Ru.prototype.ValueTypeName="vector";var Cu=class{constructor(t,n,i){let s=this,o=!1,a=0,r=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=n,this.onError=i,this.abortController=new AbortController,this.itemStart=function(u){r++,o===!1&&s.onStart!==void 0&&s.onStart(u,a,r),o=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,r),a===r&&(o=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,d){return l.push(u,d),this},this.removeHandler=function(u){let d=l.indexOf(u);return d!==-1&&l.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=l.length;d<h;d+=2){let f=l[d],g=l[d+1];if(f.global&&(f.lastIndex=0),f.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Ex=new Cu,ku=class{constructor(t){this.manager=t!==void 0?t:Ex,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,n){let i=this;return new Promise(function(s,o){i.load(t,s,n,o)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};ku.DEFAULT_MATERIAL_NAME="__DEFAULT";var Zr=class extends Je{constructor(t,n=1){super(),this.isLight=!0,this.type="Light",this.color=new Wt(t),this.intensity=n}dispose(){}copy(t,n){return super.copy(t,n),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let n=super.toJSON(t);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}},yl=class extends Zr{constructor(t,n,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Je.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Wt(n)}copy(t,n){return super.copy(t,n),this.groundColor.copy(t.groundColor),this}},xp=new me,ky=new L,Py=new L,Pu=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new At(512,512),this.mapType=Gi,this.map=null,this.mapPass=null,this.matrix=new me,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Yr,this._frameExtents=new At(1,1),this._viewportCount=1,this._viewports=[new fe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let n=this.camera,i=this.matrix;ky.setFromMatrixPosition(t.matrixWorld),n.position.copy(ky),Py.setFromMatrixPosition(t.target.matrixWorld),n.lookAt(Py),n.updateMatrixWorld(),xp.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(xp,n.coordinateSystem,n.reversedDepth),n.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(xp)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var Iy=new me,Ya=new L,_p=new L,Ep=class extends Pu{constructor(){super(new gn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new At(4,2),this._viewportCount=6,this._viewports=[new fe(2,1,1,1),new fe(0,1,1,1),new fe(3,1,1,1),new fe(1,1,1,1),new fe(3,0,1,1),new fe(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(t,n=0){let i=this.camera,s=this.matrix,o=t.distance||i.far;o!==i.far&&(i.far=o,i.updateProjectionMatrix()),Ya.setFromMatrixPosition(t.matrixWorld),i.position.copy(Ya),_p.copy(i.position),_p.add(this._cubeDirections[n]),i.up.copy(this._cubeUps[n]),i.lookAt(_p),i.updateMatrixWorld(),s.makeTranslation(-Ya.x,-Ya.y,-Ya.z),Iy.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Iy,i.coordinateSystem,i.reversedDepth)}},xl=class extends Zr{constructor(t,n,i=0,s=2){super(t,n),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Ep}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,n){return super.copy(t,n),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},_l=class extends ol{constructor(t=-1,n=1,i=1,s=-1,o=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=n,this.top=i,this.bottom=s,this.near=o,this.far=a,this.updateProjectionMatrix()}copy(t,n){return super.copy(t,n),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,n,i,s,o,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,o=i-t,a=i+t,r=s+n,c=s-n;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=l*this.view.offsetX,a=o+l*this.view.width,r-=u*this.view.offsetY,c=r-u*this.view.height}this.projectionMatrix.makeOrthographic(o,a,r,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let n=super.toJSON(t);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}},Tp=class extends Pu{constructor(){super(new _l(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},bl=class extends Zr{constructor(t,n){super(t,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Je.DEFAULT_UP),this.updateMatrix(),this.target=new Je,this.shadow=new Tp}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var Iu=class extends gn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Xp="\\[\\]\\.:\\/",e1=new RegExp("["+Xp+"]","g"),jp="[^"+Xp+"]",n1="[^"+Xp.replace("\\.","")+"]",i1=/((?:WC+[\/:])*)/.source.replace("WC",jp),s1=/(WCOD+)?/.source.replace("WCOD",n1),o1=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",jp),r1=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",jp),a1=new RegExp("^"+i1+s1+o1+r1+"$"),l1=["material","materials","bones","map"],Ap=class{constructor(t,n,i){let s=i||De.parseTrackName(n);this._targetGroup=t,this._bindings=t.subscribe_(n,s)}getValue(t,n){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,n)}setValue(t,n){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,o=i.length;s!==o;++s)i[s].setValue(t,n)}bind(){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=t.length;n!==i;++n)t[n].bind()}unbind(){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=t.length;n!==i;++n)t[n].unbind()}},De=class e{constructor(t,n,i){this.path=n,this.parsedPath=i||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,i){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,i):new e(t,n,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(e1,"")}static parseTrackName(t){let n=a1.exec(t);if(n===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:n[2],objectName:n[3],objectIndex:n[4],propertyName:n[5],propertyIndex:n[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let o=i.nodeName.substring(s+1);l1.indexOf(o)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=o)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,n){if(n===void 0||n===""||n==="."||n===-1||n===t.name||n===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(n);if(i!==void 0)return i}if(t.children){let i=function(o){for(let a=0;a<o.length;a++){let r=o[a];if(r.name===n||r.uuid===n)return r;let c=i(r.children);if(c)return c}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,n){t[n]=this.targetObject[this.propertyName]}_getValue_array(t,n){let i=this.resolvedProperty;for(let s=0,o=i.length;s!==o;++s)t[n++]=i[s]}_getValue_arrayElement(t,n){t[n]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,n){this.resolvedProperty.toArray(t,n)}_setValue_direct(t,n){this.targetObject[this.propertyName]=t[n]}_setValue_direct_setNeedsUpdate(t,n){this.targetObject[this.propertyName]=t[n],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,n){this.targetObject[this.propertyName]=t[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,n){let i=this.resolvedProperty;for(let s=0,o=i.length;s!==o;++s)i[s]=t[n++]}_setValue_array_setNeedsUpdate(t,n){let i=this.resolvedProperty;for(let s=0,o=i.length;s!==o;++s)i[s]=t[n++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,n){let i=this.resolvedProperty;for(let s=0,o=i.length;s!==o;++s)i[s]=t[n++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,n){this.resolvedProperty[this.propertyIndex]=t[n]}_setValue_arrayElement_setNeedsUpdate(t,n){this.resolvedProperty[this.propertyIndex]=t[n],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,n){this.resolvedProperty[this.propertyIndex]=t[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,n){this.resolvedProperty.fromArray(t,n)}_setValue_fromArray_setNeedsUpdate(t,n){this.resolvedProperty.fromArray(t,n),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,n){this.resolvedProperty.fromArray(t,n),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,n){this.bind(),this.getValue(t,n)}_setValue_unbound(t,n){this.bind(),this.setValue(t,n)}bind(){let t=this.node,n=this.parsedPath,i=n.objectName,s=n.propertyName,o=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let l=n.objectIndex;switch(i){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===l){l=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let a=t[s];if(a===void 0){let l=n.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let r=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?r=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(r=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(o!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[o]!==void 0&&(o=t.morphTargetDictionary[o])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=o}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][r]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};De.Composite=Ap;De.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};De.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};De.prototype.GetterByBindingType=[De.prototype._getValue_direct,De.prototype._getValue_array,De.prototype._getValue_arrayElement,De.prototype._getValue_toArray];De.prototype.SetterByBindingTypeAndVersioning=[[De.prototype._setValue_direct,De.prototype._setValue_direct_setNeedsUpdate,De.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[De.prototype._setValue_array,De.prototype._setValue_array_setNeedsUpdate,De.prototype._setValue_array_setMatrixWorldNeedsUpdate],[De.prototype._setValue_arrayElement,De.prototype._setValue_arrayElement_setNeedsUpdate,De.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[De.prototype._setValue_fromArray,De.prototype._setValue_fromArray_setNeedsUpdate,De.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var LL=new Float32Array(1);var Ly=new me,Jr=class{constructor(t,n,i=0,s=1/0){this.ray=new Yo(t,n),this.near=i,this.far=s,this.camera=null,this.layers=new qr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,n){this.ray.set(t,n)}setFromCamera(t,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(n.near+n.far)/(n.near-n.far)).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):console.error("THREE.Raycaster: Unsupported camera type: "+n.type)}setFromXRController(t){return Ly.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ly),this}intersectObject(t,n=!0,i=[]){return Rp(t,this,i,n),i.sort(Dy),i}intersectObjects(t,n=!0,i=[]){for(let s=0,o=t.length;s<o;s++)Rp(t[s],this,i,n);return i.sort(Dy),i}};function Dy(e,t){return e.distance-t.distance}function Rp(e,t,n,i){let s=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(s=!1),s===!0&&i===!0){let o=e.children;for(let a=0,r=o.length;a<r;a++)Rp(o[a],t,n,!0)}}var Qr=class{constructor(t=1,n=0,i=0){this.radius=t,this.phi=n,this.theta=i}set(t,n,i){return this.radius=t,this.phi=n,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Yt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,n,i){return this.radius=Math.sqrt(t*t+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(Yt(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var vl=class extends cs{constructor(t,n=null){super(),this.object=t,this.domElement=n,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function Yp(e,t,n,i){let s=c1(i);switch(n){case Bp:return e*t;case ju:return e*t/s.components*s.byteLength;case Yu:return e*t/s.components*s.byteLength;case $p:return e*t*2/s.components*s.byteLength;case Ku:return e*t*2/s.components*s.byteLength;case Hp:return e*t*3/s.components*s.byteLength;case Ei:return e*t*4/s.components*s.byteLength;case Zu:return e*t*4/s.components*s.byteLength;case Sl:case El:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Tl:case Al:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Qu:case ed:return Math.max(e,16)*Math.max(t,8)/4;case Ju:case td:return Math.max(e,8)*Math.max(t,8)/2;case nd:case id:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case sd:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case od:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case rd:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case ad:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case ld:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case cd:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case ud:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case dd:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case hd:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case fd:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case pd:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case md:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case gd:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case yd:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case xd:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case _d:case bd:case vd:return Math.ceil(e/4)*Math.ceil(t/4)*16;case wd:case Md:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Sd:case Ed:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function c1(e){switch(e){case Gi:case Np:return{byteLength:1,components:1};case ta:case Up:case ea:return{byteLength:2,components:1};case qu:case Xu:return{byteLength:2,components:4};case po:case Wu:case Wi:return{byteLength:4,components:1};case Op:case Fp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Yx(){let e=null,t=!1,n=null,i=null;function s(o,a){n(o,a),i=e.requestAnimationFrame(s)}return{start:function(){t!==!0&&n!==null&&(i=e.requestAnimationFrame(s),t=!0)},stop:function(){e.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(o){n=o},setContext:function(o){e=o}}}function g1(e){let t=new WeakMap;function n(r,c){let l=r.array,u=r.usage,d=l.byteLength,h=e.createBuffer();e.bindBuffer(c,h),e.bufferData(c,l,u),r.onUploadCallback();let f;if(l instanceof Float32Array)f=e.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=e.HALF_FLOAT;else if(l instanceof Uint16Array)r.isFloat16BufferAttribute?f=e.HALF_FLOAT:f=e.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=e.SHORT;else if(l instanceof Uint32Array)f=e.UNSIGNED_INT;else if(l instanceof Int32Array)f=e.INT;else if(l instanceof Int8Array)f=e.BYTE;else if(l instanceof Uint8Array)f=e.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:r.version,size:d}}function i(r,c,l){let u=c.array,d=c.updateRanges;if(e.bindBuffer(l,r),d.length===0)e.bufferSubData(l,0,u);else{d.sort((f,g)=>f.start-g.start);let h=0;for(let f=1;f<d.length;f++){let g=d[h],y=d[f];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++h,d[h]=y)}d.length=h+1;for(let f=0,g=d.length;f<g;f++){let y=d[f];e.bufferSubData(l,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function o(r){r.isInterleavedBufferAttribute&&(r=r.data);let c=t.get(r);c&&(e.deleteBuffer(c.buffer),t.delete(r))}function a(r,c){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){let u=t.get(r);(!u||u.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}let l=t.get(r);if(l===void 0)t.set(r,n(r,c));else if(l.version<r.version){if(l.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,r,c),l.version=r.version}}return{get:s,remove:o,update:a}}var y1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,x1=`#ifdef USE_ALPHAHASH
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
#endif`,_1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,b1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,v1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,w1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,M1=`#ifdef USE_AOMAP
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
#endif`,S1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,E1=`#ifdef USE_BATCHING
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
#endif`,T1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,A1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,R1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,C1=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,k1=`#ifdef USE_IRIDESCENCE
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
#endif`,P1=`#ifdef USE_BUMPMAP
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
#endif`,I1=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,L1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,D1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,N1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,U1=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,O1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,F1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,B1=`#if defined( USE_COLOR_ALPHA )
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
#endif`,H1=`#define PI 3.141592653589793
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
} // validated`,$1=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,z1=`vec3 transformedNormal = objectNormal;
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
#endif`,V1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,G1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,W1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,q1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,X1="gl_FragColor = linearToOutputTexel( gl_FragColor );",j1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Y1=`#ifdef USE_ENVMAP
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
#endif`,K1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Z1=`#ifdef USE_ENVMAP
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
#endif`,J1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Q1=`#ifdef USE_ENVMAP
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
#endif`,tT=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,eT=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,nT=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,iT=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,sT=`#ifdef USE_GRADIENTMAP
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
}`,oT=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,rT=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,aT=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lT=`uniform bool receiveShadow;
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
#endif`,cT=`#ifdef USE_ENVMAP
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
#endif`,uT=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,dT=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,hT=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,fT=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,pT=`PhysicalMaterial material;
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
#endif`,mT=`struct PhysicalMaterial {
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
}`,gT=`
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
#endif`,yT=`#if defined( RE_IndirectDiffuse )
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
#endif`,xT=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,_T=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bT=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vT=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wT=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,MT=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ST=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ET=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,TT=`#if defined( USE_POINTS_UV )
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
#endif`,AT=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,RT=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,CT=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,kT=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,PT=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,IT=`#ifdef USE_MORPHTARGETS
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
#endif`,LT=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,DT=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,NT=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,UT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,OT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,FT=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,BT=`#ifdef USE_NORMALMAP
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
#endif`,HT=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,$T=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,zT=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,VT=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,GT=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,WT=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,qT=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,XT=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,jT=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,YT=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,KT=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ZT=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,JT=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,QT=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,tA=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,eA=`float getShadowMask() {
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
}`,nA=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,iA=`#ifdef USE_SKINNING
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
#endif`,sA=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,oA=`#ifdef USE_SKINNING
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
#endif`,rA=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,aA=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,lA=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,cA=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,uA=`#ifdef USE_TRANSMISSION
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
#endif`,dA=`#ifdef USE_TRANSMISSION
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
#endif`,hA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,pA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mA=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,gA=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,yA=`uniform sampler2D t2D;
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
}`,xA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_A=`#ifdef ENVMAP_TYPE_CUBE
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
}`,bA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vA=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wA=`#include <common>
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
}`,MA=`#if DEPTH_PACKING == 3200
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
}`,SA=`#define DISTANCE
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
}`,EA=`#define DISTANCE
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
}`,TA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,AA=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,RA=`uniform float scale;
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
}`,CA=`uniform vec3 diffuse;
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
}`,kA=`#include <common>
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
}`,PA=`uniform vec3 diffuse;
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
}`,IA=`#define LAMBERT
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
}`,LA=`#define LAMBERT
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
}`,DA=`#define MATCAP
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
}`,NA=`#define MATCAP
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
}`,UA=`#define NORMAL
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
}`,OA=`#define NORMAL
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
}`,FA=`#define PHONG
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
}`,BA=`#define PHONG
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
}`,HA=`#define STANDARD
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
}`,$A=`#define STANDARD
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
}`,zA=`#define TOON
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
}`,VA=`#define TOON
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
}`,GA=`uniform float size;
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
}`,WA=`uniform vec3 diffuse;
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
}`,qA=`#include <common>
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
}`,XA=`uniform vec3 color;
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
}`,jA=`uniform float rotation;
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
}`,YA=`uniform vec3 diffuse;
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
}`,jt={alphahash_fragment:y1,alphahash_pars_fragment:x1,alphamap_fragment:_1,alphamap_pars_fragment:b1,alphatest_fragment:v1,alphatest_pars_fragment:w1,aomap_fragment:M1,aomap_pars_fragment:S1,batching_pars_vertex:E1,batching_vertex:T1,begin_vertex:A1,beginnormal_vertex:R1,bsdfs:C1,iridescence_fragment:k1,bumpmap_pars_fragment:P1,clipping_planes_fragment:I1,clipping_planes_pars_fragment:L1,clipping_planes_pars_vertex:D1,clipping_planes_vertex:N1,color_fragment:U1,color_pars_fragment:O1,color_pars_vertex:F1,color_vertex:B1,common:H1,cube_uv_reflection_fragment:$1,defaultnormal_vertex:z1,displacementmap_pars_vertex:V1,displacementmap_vertex:G1,emissivemap_fragment:W1,emissivemap_pars_fragment:q1,colorspace_fragment:X1,colorspace_pars_fragment:j1,envmap_fragment:Y1,envmap_common_pars_fragment:K1,envmap_pars_fragment:Z1,envmap_pars_vertex:J1,envmap_physical_pars_fragment:cT,envmap_vertex:Q1,fog_vertex:tT,fog_pars_vertex:eT,fog_fragment:nT,fog_pars_fragment:iT,gradientmap_pars_fragment:sT,lightmap_pars_fragment:oT,lights_lambert_fragment:rT,lights_lambert_pars_fragment:aT,lights_pars_begin:lT,lights_toon_fragment:uT,lights_toon_pars_fragment:dT,lights_phong_fragment:hT,lights_phong_pars_fragment:fT,lights_physical_fragment:pT,lights_physical_pars_fragment:mT,lights_fragment_begin:gT,lights_fragment_maps:yT,lights_fragment_end:xT,logdepthbuf_fragment:_T,logdepthbuf_pars_fragment:bT,logdepthbuf_pars_vertex:vT,logdepthbuf_vertex:wT,map_fragment:MT,map_pars_fragment:ST,map_particle_fragment:ET,map_particle_pars_fragment:TT,metalnessmap_fragment:AT,metalnessmap_pars_fragment:RT,morphinstance_vertex:CT,morphcolor_vertex:kT,morphnormal_vertex:PT,morphtarget_pars_vertex:IT,morphtarget_vertex:LT,normal_fragment_begin:DT,normal_fragment_maps:NT,normal_pars_fragment:UT,normal_pars_vertex:OT,normal_vertex:FT,normalmap_pars_fragment:BT,clearcoat_normal_fragment_begin:HT,clearcoat_normal_fragment_maps:$T,clearcoat_pars_fragment:zT,iridescence_pars_fragment:VT,opaque_fragment:GT,packing:WT,premultiplied_alpha_fragment:qT,project_vertex:XT,dithering_fragment:jT,dithering_pars_fragment:YT,roughnessmap_fragment:KT,roughnessmap_pars_fragment:ZT,shadowmap_pars_fragment:JT,shadowmap_pars_vertex:QT,shadowmap_vertex:tA,shadowmask_pars_fragment:eA,skinbase_vertex:nA,skinning_pars_vertex:iA,skinning_vertex:sA,skinnormal_vertex:oA,specularmap_fragment:rA,specularmap_pars_fragment:aA,tonemapping_fragment:lA,tonemapping_pars_fragment:cA,transmission_fragment:uA,transmission_pars_fragment:dA,uv_pars_fragment:hA,uv_pars_vertex:fA,uv_vertex:pA,worldpos_vertex:mA,background_vert:gA,background_frag:yA,backgroundCube_vert:xA,backgroundCube_frag:_A,cube_vert:bA,cube_frag:vA,depth_vert:wA,depth_frag:MA,distanceRGBA_vert:SA,distanceRGBA_frag:EA,equirect_vert:TA,equirect_frag:AA,linedashed_vert:RA,linedashed_frag:CA,meshbasic_vert:kA,meshbasic_frag:PA,meshlambert_vert:IA,meshlambert_frag:LA,meshmatcap_vert:DA,meshmatcap_frag:NA,meshnormal_vert:UA,meshnormal_frag:OA,meshphong_vert:FA,meshphong_frag:BA,meshphysical_vert:HA,meshphysical_frag:$A,meshtoon_vert:zA,meshtoon_frag:VA,points_vert:GA,points_frag:WA,shadow_vert:qA,shadow_frag:XA,sprite_vert:jA,sprite_frag:YA},ht={common:{diffuse:{value:new Wt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Vt}},envmap:{envMap:{value:null},envMapRotation:{value:new Vt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Vt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Vt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Vt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Vt},normalScale:{value:new At(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Vt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Vt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Vt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Vt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Wt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Wt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0},uvTransform:{value:new Vt}},sprite:{diffuse:{value:new Wt(16777215)},opacity:{value:1},center:{value:new At(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}}},ps={basic:{uniforms:kn([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.fog]),vertexShader:jt.meshbasic_vert,fragmentShader:jt.meshbasic_frag},lambert:{uniforms:kn([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new Wt(0)}}]),vertexShader:jt.meshlambert_vert,fragmentShader:jt.meshlambert_frag},phong:{uniforms:kn([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new Wt(0)},specular:{value:new Wt(1118481)},shininess:{value:30}}]),vertexShader:jt.meshphong_vert,fragmentShader:jt.meshphong_frag},standard:{uniforms:kn([ht.common,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.roughnessmap,ht.metalnessmap,ht.fog,ht.lights,{emissive:{value:new Wt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag},toon:{uniforms:kn([ht.common,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.gradientmap,ht.fog,ht.lights,{emissive:{value:new Wt(0)}}]),vertexShader:jt.meshtoon_vert,fragmentShader:jt.meshtoon_frag},matcap:{uniforms:kn([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,{matcap:{value:null}}]),vertexShader:jt.meshmatcap_vert,fragmentShader:jt.meshmatcap_frag},points:{uniforms:kn([ht.points,ht.fog]),vertexShader:jt.points_vert,fragmentShader:jt.points_frag},dashed:{uniforms:kn([ht.common,ht.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:jt.linedashed_vert,fragmentShader:jt.linedashed_frag},depth:{uniforms:kn([ht.common,ht.displacementmap]),vertexShader:jt.depth_vert,fragmentShader:jt.depth_frag},normal:{uniforms:kn([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,{opacity:{value:1}}]),vertexShader:jt.meshnormal_vert,fragmentShader:jt.meshnormal_frag},sprite:{uniforms:kn([ht.sprite,ht.fog]),vertexShader:jt.sprite_vert,fragmentShader:jt.sprite_frag},background:{uniforms:{uvTransform:{value:new Vt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:jt.background_vert,fragmentShader:jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Vt}},vertexShader:jt.backgroundCube_vert,fragmentShader:jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:jt.cube_vert,fragmentShader:jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:jt.equirect_vert,fragmentShader:jt.equirect_frag},distanceRGBA:{uniforms:kn([ht.common,ht.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:jt.distanceRGBA_vert,fragmentShader:jt.distanceRGBA_frag},shadow:{uniforms:kn([ht.lights,ht.fog,{color:{value:new Wt(0)},opacity:{value:1}}]),vertexShader:jt.shadow_vert,fragmentShader:jt.shadow_frag}};ps.physical={uniforms:kn([ps.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Vt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Vt},clearcoatNormalScale:{value:new At(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Vt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Vt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Vt},sheen:{value:0},sheenColor:{value:new Wt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Vt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Vt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Vt},transmissionSamplerSize:{value:new At},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Vt},attenuationDistance:{value:0},attenuationColor:{value:new Wt(0)},specularColor:{value:new Wt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Vt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Vt},anisotropyVector:{value:new At},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Vt}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag};var Ad={r:0,b:0,g:0},nr=new Mi,KA=new me;function ZA(e,t,n,i,s,o,a){let r=new Wt(0),c=o===!0?0:1,l,u,d=null,h=0,f=null;function g(b){let v=b.isScene===!0?b.background:null;return v&&v.isTexture&&(v=(b.backgroundBlurriness>0?n:t).get(v)),v}function y(b){let v=!1,T=g(b);T===null?p(r,c):T&&T.isColor&&(p(T,1),v=!0);let S=e.xr.getEnvironmentBlendMode();S==="additive"?i.buffers.color.setClear(0,0,0,1,a):S==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(e.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function m(b,v){let T=g(v);T&&(T.isCubeTexture||T.mapping===wl)?(u===void 0&&(u=new G(new fn(1,1,1),new zi({name:"BackgroundCubeMaterial",uniforms:er(ps.backgroundCube.uniforms),vertexShader:ps.backgroundCube.vertexShader,fragmentShader:ps.backgroundCube.fragmentShader,side:yn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(S,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),nr.copy(v.backgroundRotation),nr.x*=-1,nr.y*=-1,nr.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(nr.y*=-1,nr.z*=-1),u.material.uniforms.envMap.value=T,u.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(KA.makeRotationFromEuler(nr)),u.material.toneMapped=se.getTransfer(T.colorSpace)!==pe,(d!==T||h!==T.version||f!==e.toneMapping)&&(u.material.needsUpdate=!0,d=T,h=T.version,f=e.toneMapping),u.layers.enableAll(),b.unshift(u,u.geometry,u.material,0,0,null)):T&&T.isTexture&&(l===void 0&&(l=new G(new Cn(2,2),new zi({name:"BackgroundMaterial",uniforms:er(ps.background.uniforms),vertexShader:ps.background.vertexShader,fragmentShader:ps.background.fragmentShader,side:Is,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=T,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=se.getTransfer(T.colorSpace)!==pe,T.matrixAutoUpdate===!0&&T.updateMatrix(),l.material.uniforms.uvTransform.value.copy(T.matrix),(d!==T||h!==T.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,d=T,h=T.version,f=e.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function p(b,v){b.getRGB(Ad,qp(e)),i.buffers.color.setClear(Ad.r,Ad.g,Ad.b,v,a)}function x(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(b,v=1){r.set(b),c=v,p(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(b){c=b,p(r,c)},render:y,addToRenderList:m,dispose:x}}function JA(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},s=h(null),o=s,a=!1;function r(w,P,D,U,H){let X=!1,z=d(U,D,P);o!==z&&(o=z,l(o.object)),X=f(w,U,D,H),X&&g(w,U,D,H),H!==null&&t.update(H,e.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,v(w,P,D,U),H!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(H).buffer))}function c(){return e.createVertexArray()}function l(w){return e.bindVertexArray(w)}function u(w){return e.deleteVertexArray(w)}function d(w,P,D){let U=D.wireframe===!0,H=i[w.id];H===void 0&&(H={},i[w.id]=H);let X=H[P.id];X===void 0&&(X={},H[P.id]=X);let z=X[U];return z===void 0&&(z=h(c()),X[U]=z),z}function h(w){let P=[],D=[],U=[];for(let H=0;H<n;H++)P[H]=0,D[H]=0,U[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:D,attributeDivisors:U,object:w,attributes:{},index:null}}function f(w,P,D,U){let H=o.attributes,X=P.attributes,z=0,Z=D.getAttributes();for(let V in Z)if(Z[V].location>=0){let dt=H[V],bt=X[V];if(bt===void 0&&(V==="instanceMatrix"&&w.instanceMatrix&&(bt=w.instanceMatrix),V==="instanceColor"&&w.instanceColor&&(bt=w.instanceColor)),dt===void 0||dt.attribute!==bt||bt&&dt.data!==bt.data)return!0;z++}return o.attributesNum!==z||o.index!==U}function g(w,P,D,U){let H={},X=P.attributes,z=0,Z=D.getAttributes();for(let V in Z)if(Z[V].location>=0){let dt=X[V];dt===void 0&&(V==="instanceMatrix"&&w.instanceMatrix&&(dt=w.instanceMatrix),V==="instanceColor"&&w.instanceColor&&(dt=w.instanceColor));let bt={};bt.attribute=dt,dt&&dt.data&&(bt.data=dt.data),H[V]=bt,z++}o.attributes=H,o.attributesNum=z,o.index=U}function y(){let w=o.newAttributes;for(let P=0,D=w.length;P<D;P++)w[P]=0}function m(w){p(w,0)}function p(w,P){let D=o.newAttributes,U=o.enabledAttributes,H=o.attributeDivisors;D[w]=1,U[w]===0&&(e.enableVertexAttribArray(w),U[w]=1),H[w]!==P&&(e.vertexAttribDivisor(w,P),H[w]=P)}function x(){let w=o.newAttributes,P=o.enabledAttributes;for(let D=0,U=P.length;D<U;D++)P[D]!==w[D]&&(e.disableVertexAttribArray(D),P[D]=0)}function b(w,P,D,U,H,X,z){z===!0?e.vertexAttribIPointer(w,P,D,H,X):e.vertexAttribPointer(w,P,D,U,H,X)}function v(w,P,D,U){y();let H=U.attributes,X=D.getAttributes(),z=P.defaultAttributeValues;for(let Z in X){let V=X[Z];if(V.location>=0){let lt=H[Z];if(lt===void 0&&(Z==="instanceMatrix"&&w.instanceMatrix&&(lt=w.instanceMatrix),Z==="instanceColor"&&w.instanceColor&&(lt=w.instanceColor)),lt!==void 0){let dt=lt.normalized,bt=lt.itemSize,qt=t.get(lt);if(qt===void 0)continue;let ee=qt.buffer,Ee=qt.type,re=qt.bytesPerElement,K=Ee===e.INT||Ee===e.UNSIGNED_INT||lt.gpuType===Wu;if(lt.isInterleavedBufferAttribute){let tt=lt.data,Q=tt.stride,it=lt.offset;if(tt.isInstancedInterleavedBuffer){for(let nt=0;nt<V.locationSize;nt++)p(V.location+nt,tt.meshPerAttribute);w.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let nt=0;nt<V.locationSize;nt++)m(V.location+nt);e.bindBuffer(e.ARRAY_BUFFER,ee);for(let nt=0;nt<V.locationSize;nt++)b(V.location+nt,bt/V.locationSize,Ee,dt,Q*re,(it+bt/V.locationSize*nt)*re,K)}else{if(lt.isInstancedBufferAttribute){for(let tt=0;tt<V.locationSize;tt++)p(V.location+tt,lt.meshPerAttribute);w.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=lt.meshPerAttribute*lt.count)}else for(let tt=0;tt<V.locationSize;tt++)m(V.location+tt);e.bindBuffer(e.ARRAY_BUFFER,ee);for(let tt=0;tt<V.locationSize;tt++)b(V.location+tt,bt/V.locationSize,Ee,dt,bt*re,bt/V.locationSize*tt*re,K)}}else if(z!==void 0){let dt=z[Z];if(dt!==void 0)switch(dt.length){case 2:e.vertexAttrib2fv(V.location,dt);break;case 3:e.vertexAttrib3fv(V.location,dt);break;case 4:e.vertexAttrib4fv(V.location,dt);break;default:e.vertexAttrib1fv(V.location,dt)}}}}x()}function T(){R();for(let w in i){let P=i[w];for(let D in P){let U=P[D];for(let H in U)u(U[H].object),delete U[H];delete P[D]}delete i[w]}}function S(w){if(i[w.id]===void 0)return;let P=i[w.id];for(let D in P){let U=P[D];for(let H in U)u(U[H].object),delete U[H];delete P[D]}delete i[w.id]}function A(w){for(let P in i){let D=i[P];if(D[w.id]===void 0)continue;let U=D[w.id];for(let H in U)u(U[H].object),delete U[H];delete D[w.id]}}function R(){_(),a=!0,o!==s&&(o=s,l(o.object))}function _(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:r,reset:R,resetDefaultState:_,dispose:T,releaseStatesOfGeometry:S,releaseStatesOfProgram:A,initAttributes:y,enableAttribute:m,disableUnusedAttributes:x}}function QA(e,t,n){let i;function s(l){i=l}function o(l,u){e.drawArrays(i,l,u),n.update(u,i,1)}function a(l,u,d){d!==0&&(e.drawArraysInstanced(i,l,u,d),n.update(u,i,d))}function r(l,u,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,u,0,d);let f=0;for(let g=0;g<d;g++)f+=u[g];n.update(f,i,1)}function c(l,u,d,h){if(d===0)return;let f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)a(l[g],u[g],h[g]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,u,0,h,0,d);let g=0;for(let y=0;y<d;y++)g+=u[y]*h[y];n.update(g,i,1)}}this.setMode=s,this.render=o,this.renderInstances=a,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function tR(e,t,n,i){let s;function o(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let A=t.get("EXT_texture_filter_anisotropic");s=e.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==Ei&&i.convert(A)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(A){let R=A===ea&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Gi&&i.convert(A)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Wi&&!R)}function c(A){if(A==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=n.precision!==void 0?n.precision:"highp",u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);let d=n.logarithmicDepthBuffer===!0,h=n.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),g=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=e.getParameter(e.MAX_TEXTURE_SIZE),m=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),p=e.getParameter(e.MAX_VERTEX_ATTRIBS),x=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),b=e.getParameter(e.MAX_VARYING_VECTORS),v=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),T=g>0,S=e.getParameter(e.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:r,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:b,maxFragmentUniforms:v,vertexTextures:T,maxSamples:S}}function eR(e){let t=this,n=null,i=0,s=!1,o=!1,a=new vi,r=new Vt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){let f=d.length!==0||h||i!==0||s;return s=h,i=d.length,f},this.beginShadows=function(){o=!0,u(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(d,h){n=u(d,h,0)},this.setState=function(d,h,f){let g=d.clippingPlanes,y=d.clipIntersection,m=d.clipShadows,p=e.get(d);if(!s||g===null||g.length===0||o&&!m)o?u(null):l();else{let x=o?0:i,b=x*4,v=p.clippingState||null;c.value=v,v=u(g,h,b,f);for(let T=0;T!==b;++T)v[T]=n[T];p.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(d,h,f,g){let y=d!==null?d.length:0,m=null;if(y!==0){if(m=c.value,g!==!0||m===null){let p=f+y*4,x=h.matrixWorldInverse;r.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let b=0,v=f;b!==y;++b,v+=4)a.copy(d[b]).applyMatrix4(x,r),a.normal.toArray(m,v),m[v+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,m}}function nR(e){let t=new WeakMap;function n(a,r){return r===zu?a.mapping=Qo:r===Vu&&(a.mapping=tr),a}function i(a){if(a&&a.isTexture){let r=a.mapping;if(r===zu||r===Vu)if(t.has(a)){let c=t.get(a).texture;return n(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let l=new xu(c.height);return l.fromEquirectangularTexture(e,a),t.set(a,l),a.addEventListener("dispose",s),n(l.texture,a.mapping)}else return null}}return a}function s(a){let r=a.target;r.removeEventListener("dispose",s);let c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function o(){t=new WeakMap}return{get:i,dispose:o}}var ra=4,Tx=[.125,.215,.35,.446,.526,.582],or=20,Kp=new _l,Ax=new Wt,Zp=null,Jp=0,Qp=0,tm=!1,sr=(1+Math.sqrt(5))/2,oa=1/sr,Rx=[new L(-sr,oa,0),new L(sr,oa,0),new L(-oa,0,sr),new L(oa,0,sr),new L(0,sr,-oa),new L(0,sr,oa),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],iR=new L,la=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,n=0,i=.1,s=100,o={}){let{size:a=256,position:r=iR}=o;Zp=this._renderer.getRenderTarget(),Jp=this._renderer.getActiveCubeFace(),Qp=this._renderer.getActiveMipmapLevel(),tm=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,i,s,c,r),n>0&&this._blur(c,0,0,n),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,n=null){return this._fromTexture(t,n)}fromCubemap(t,n=null){return this._fromTexture(t,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Px(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=kx(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Zp,Jp,Qp),this._renderer.xr.enabled=tm,t.scissorTest=!1,Rd(t,0,0,t.width,t.height)}_fromTexture(t,n){t.mapping===Qo||t.mapping===tr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Zp=this._renderer.getRenderTarget(),Jp=this._renderer.getActiveCubeFace(),Qp=this._renderer.getActiveMipmapLevel(),tm=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=n||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:$i,minFilter:$i,generateMipmaps:!1,type:ea,format:Ei,colorSpace:jo,depthBuffer:!1},s=Cx(t,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Cx(t,n,i);let{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=sR(o)),this._blurMaterial=oR(o,t,n)}return s}_compileMaterial(t){let n=new G(this._lodPlanes[0],t);this._renderer.compile(n,Kp)}_sceneToCubeUV(t,n,i,s,o){let c=new gn(90,1,n,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(Ax),d.toneMapping=Ns,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null));let y=new Qe({name:"PMREM.Background",side:yn,depthWrite:!1,depthTest:!1}),m=new G(new fn,y),p=!1,x=t.background;x?x.isColor&&(y.color.copy(x),t.background=null,p=!0):(y.color.copy(Ax),p=!0);for(let b=0;b<6;b++){let v=b%3;v===0?(c.up.set(0,l[b],0),c.position.set(o.x,o.y,o.z),c.lookAt(o.x+u[b],o.y,o.z)):v===1?(c.up.set(0,0,l[b]),c.position.set(o.x,o.y,o.z),c.lookAt(o.x,o.y+u[b],o.z)):(c.up.set(0,l[b],0),c.position.set(o.x,o.y,o.z),c.lookAt(o.x,o.y,o.z+u[b]));let T=this._cubeSize;Rd(s,v*T,b>2?T:0,T,T),d.setRenderTarget(s),p&&d.render(m,c),d.render(t,c)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=f,d.autoClear=h,t.background=x}_textureToCubeUV(t,n){let i=this._renderer,s=t.mapping===Qo||t.mapping===tr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Px()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=kx());let o=s?this._cubemapMaterial:this._equirectMaterial,a=new G(this._lodPlanes[0],o),r=o.uniforms;r.envMap.value=t;let c=this._cubeSize;Rd(n,0,0,3*c,2*c),i.setRenderTarget(n),i.render(a,Kp)}_applyPMREM(t){let n=this._renderer,i=n.autoClear;n.autoClear=!1;let s=this._lodPlanes.length;for(let o=1;o<s;o++){let a=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),r=Rx[(s-o-1)%Rx.length];this._blur(t,o-1,o,a,r)}n.autoClear=i}_blur(t,n,i,s,o){let a=this._pingPongRenderTarget;this._halfBlur(t,a,n,i,s,"latitudinal",o),this._halfBlur(a,t,i,i,s,"longitudinal",o)}_halfBlur(t,n,i,s,o,a,r){let c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,d=new G(this._lodPlanes[s],l),h=l.uniforms,f=this._sizeLods[i]-1,g=isFinite(o)?Math.PI/(2*f):2*Math.PI/(2*or-1),y=o/g,m=isFinite(o)?1+Math.floor(u*y):or;m>or&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${or}`);let p=[],x=0;for(let A=0;A<or;++A){let R=A/y,_=Math.exp(-R*R/2);p.push(_),A===0?x+=_:A<m&&(x+=2*_)}for(let A=0;A<p.length;A++)p[A]=p[A]/x;h.envMap.value=t.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=a==="latitudinal",r&&(h.poleAxis.value=r);let{_lodMax:b}=this;h.dTheta.value=g,h.mipInt.value=b-i;let v=this._sizeLods[s],T=3*v*(s>b-ra?s-b+ra:0),S=4*(this._cubeSize-v);Rd(n,T,S,3*v,2*v),c.setRenderTarget(n),c.render(d,Kp)}};function sR(e){let t=[],n=[],i=[],s=e,o=e-ra+1+Tx.length;for(let a=0;a<o;a++){let r=Math.pow(2,s);n.push(r);let c=1/r;a>e-ra?c=Tx[a-e+ra-1]:a===0&&(c=0),i.push(c);let l=1/(r-2),u=-l,d=1+l,h=[u,u,d,u,d,d,u,u,d,d,u,d],f=6,g=6,y=3,m=2,p=1,x=new Float32Array(y*g*f),b=new Float32Array(m*g*f),v=new Float32Array(p*g*f);for(let S=0;S<f;S++){let A=S%3*2/3-1,R=S>2?0:-1,_=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];x.set(_,y*g*S),b.set(h,m*g*S);let w=[S,S,S,S,S,S];v.set(w,p*g*S)}let T=new Rn;T.setAttribute("position",new hn(x,y)),T.setAttribute("uv",new hn(b,m)),T.setAttribute("faceIndex",new hn(v,p)),t.push(T),s>ra&&s--}return{lodPlanes:t,sizeLods:n,sigmas:i}}function Cx(e,t,n){let i=new us(e,t,n);return i.texture.mapping=wl,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Rd(e,t,n,i,s){e.viewport.set(t,n,i,s),e.scissor.set(t,n,i,s)}function oR(e,t,n){let i=new Float32Array(or),s=new L(0,1,0);return new zi({name:"SphericalGaussianBlur",defines:{n:or,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:um(),fragmentShader:`

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
		`,blending:Ds,depthTest:!1,depthWrite:!1})}function kx(){return new zi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:um(),fragmentShader:`

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
		`,blending:Ds,depthTest:!1,depthWrite:!1})}function Px(){return new zi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:um(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ds,depthTest:!1,depthWrite:!1})}function um(){return`

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
	`}function rR(e){let t=new WeakMap,n=null;function i(r){if(r&&r.isTexture){let c=r.mapping,l=c===zu||c===Vu,u=c===Qo||c===tr;if(l||u){let d=t.get(r),h=d!==void 0?d.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==h)return n===null&&(n=new la(e)),d=l?n.fromEquirectangular(r,d):n.fromCubemap(r,d),d.texture.pmremVersion=r.pmremVersion,t.set(r,d),d.texture;if(d!==void 0)return d.texture;{let f=r.image;return l&&f&&f.height>0||u&&f&&s(f)?(n===null&&(n=new la(e)),d=l?n.fromEquirectangular(r):n.fromCubemap(r),d.texture.pmremVersion=r.pmremVersion,t.set(r,d),r.addEventListener("dispose",o),d.texture):null}}}return r}function s(r){let c=0,l=6;for(let u=0;u<l;u++)r[u]!==void 0&&c++;return c===l}function o(r){let c=r.target;c.removeEventListener("dispose",o);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:a}}function aR(e){let t={};function n(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=e.getExtension("WEBGL_depth_texture")||e.getExtension("MOZ_WEBGL_depth_texture")||e.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=e.getExtension("EXT_texture_filter_anisotropic")||e.getExtension("MOZ_EXT_texture_filter_anisotropic")||e.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=e.getExtension("WEBGL_compressed_texture_s3tc")||e.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=e.getExtension("WEBGL_compressed_texture_pvrtc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=e.getExtension(i)}return t[i]=s,s}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){let s=n(i);return s===null&&Gr("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function lR(e,t,n,i){let s={},o=new WeakMap;function a(d){let h=d.target;h.index!==null&&t.remove(h.index);for(let g in h.attributes)t.remove(h.attributes[g]);h.removeEventListener("dispose",a),delete s[h.id];let f=o.get(h);f&&(t.remove(f),o.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function r(d,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,n.memory.geometries++),h}function c(d){let h=d.attributes;for(let f in h)t.update(h[f],e.ARRAY_BUFFER)}function l(d){let h=[],f=d.index,g=d.attributes.position,y=0;if(f!==null){let x=f.array;y=f.version;for(let b=0,v=x.length;b<v;b+=3){let T=x[b+0],S=x[b+1],A=x[b+2];h.push(T,S,S,A,A,T)}}else if(g!==void 0){let x=g.array;y=g.version;for(let b=0,v=x.length/3-1;b<v;b+=3){let T=b+0,S=b+1,A=b+2;h.push(T,S,S,A,A,T)}}else return;let m=new(Wp(h)?sl:il)(h,1);m.version=y;let p=o.get(d);p&&t.remove(p),o.set(d,m)}function u(d){let h=o.get(d);if(h){let f=d.index;f!==null&&h.version<f.version&&l(d)}else l(d);return o.get(d)}return{get:r,update:c,getWireframeAttribute:u}}function cR(e,t,n){let i;function s(h){i=h}let o,a;function r(h){o=h.type,a=h.bytesPerElement}function c(h,f){e.drawElements(i,f,o,h*a),n.update(f,i,1)}function l(h,f,g){g!==0&&(e.drawElementsInstanced(i,f,o,h*a,g),n.update(f,i,g))}function u(h,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,o,h,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];n.update(m,i,1)}function d(h,f,g,y){if(g===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<h.length;p++)l(h[p]/a,f[p],y[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,o,h,0,y,0,g);let p=0;for(let x=0;x<g;x++)p+=f[x]*y[x];n.update(p,i,1)}}this.setMode=s,this.setIndex=r,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function uR(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(o,a,r){switch(n.calls++,a){case e.TRIANGLES:n.triangles+=r*(o/3);break;case e.LINES:n.lines+=r*(o/2);break;case e.LINE_STRIP:n.lines+=r*(o-1);break;case e.LINE_LOOP:n.lines+=r*o;break;case e.POINTS:n.points+=r*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:s,update:i}}function dR(e,t,n){let i=new WeakMap,s=new fe;function o(a,r,c){let l=a.morphTargetInfluences,u=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,d=u!==void 0?u.length:0,h=i.get(r);if(h===void 0||h.count!==d){let _=function(){A.dispose(),i.delete(r),r.removeEventListener("dispose",_)};h!==void 0&&h.texture.dispose();let f=r.morphAttributes.position!==void 0,g=r.morphAttributes.normal!==void 0,y=r.morphAttributes.color!==void 0,m=r.morphAttributes.position||[],p=r.morphAttributes.normal||[],x=r.morphAttributes.color||[],b=0;f===!0&&(b=1),g===!0&&(b=2),y===!0&&(b=3);let v=r.attributes.position.count*b,T=1;v>t.maxTextureSize&&(T=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let S=new Float32Array(v*T*4*d),A=new nl(S,v,T,d);A.type=Wi,A.needsUpdate=!0;let R=b*4;for(let w=0;w<d;w++){let P=m[w],D=p[w],U=x[w],H=v*T*4*w;for(let X=0;X<P.count;X++){let z=X*R;f===!0&&(s.fromBufferAttribute(P,X),S[H+z+0]=s.x,S[H+z+1]=s.y,S[H+z+2]=s.z,S[H+z+3]=0),g===!0&&(s.fromBufferAttribute(D,X),S[H+z+4]=s.x,S[H+z+5]=s.y,S[H+z+6]=s.z,S[H+z+7]=0),y===!0&&(s.fromBufferAttribute(U,X),S[H+z+8]=s.x,S[H+z+9]=s.y,S[H+z+10]=s.z,S[H+z+11]=U.itemSize===4?s.w:1)}}h={count:d,texture:A,size:new At(v,T)},i.set(r,h),r.addEventListener("dispose",_)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(e,"morphTexture",a.morphTexture,n);else{let f=0;for(let y=0;y<l.length;y++)f+=l[y];let g=r.morphTargetsRelative?1:1-f;c.getUniforms().setValue(e,"morphTargetBaseInfluence",g),c.getUniforms().setValue(e,"morphTargetInfluences",l)}c.getUniforms().setValue(e,"morphTargetsTexture",h.texture,n),c.getUniforms().setValue(e,"morphTargetsTextureSize",h.size)}return{update:o}}function hR(e,t,n,i){let s=new WeakMap;function o(c){let l=i.render.frame,u=c.geometry,d=t.get(c,u);if(s.get(d)!==l&&(t.update(d),s.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),s.get(c)!==l&&(n.update(c.instanceMatrix,e.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,e.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let h=c.skeleton;s.get(h)!==l&&(h.update(),s.set(h,l))}return d}function a(){s=new WeakMap}function r(c){let l=c.target;l.removeEventListener("dispose",r),n.remove(l.instanceMatrix),l.instanceColor!==null&&n.remove(l.instanceColor)}return{update:o,dispose:a}}var Kx=new $n,Ix=new ll(1,1),Zx=new nl,Jx=new gu,Qx=new rl,Lx=[],Dx=[],Nx=new Float32Array(16),Ux=new Float32Array(9),Ox=new Float32Array(4);function ca(e,t,n){let i=e[0];if(i<=0||i>0)return e;let s=t*n,o=Lx[s];if(o===void 0&&(o=new Float32Array(s),Lx[s]=o),t!==0){i.toArray(o,0);for(let a=1,r=0;a!==t;++a)r+=n,e[a].toArray(o,r)}return o}function en(e,t){if(e.length!==t.length)return!1;for(let n=0,i=e.length;n<i;n++)if(e[n]!==t[n])return!1;return!0}function nn(e,t){for(let n=0,i=t.length;n<i;n++)e[n]=t[n]}function Pd(e,t){let n=Dx[t];n===void 0&&(n=new Int32Array(t),Dx[t]=n);for(let i=0;i!==t;++i)n[i]=e.allocateTextureUnit();return n}function fR(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function pR(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(en(n,t))return;e.uniform2fv(this.addr,t),nn(n,t)}}function mR(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(en(n,t))return;e.uniform3fv(this.addr,t),nn(n,t)}}function gR(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(en(n,t))return;e.uniform4fv(this.addr,t),nn(n,t)}}function yR(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(en(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),nn(n,t)}else{if(en(n,i))return;Ox.set(i),e.uniformMatrix2fv(this.addr,!1,Ox),nn(n,i)}}function xR(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(en(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),nn(n,t)}else{if(en(n,i))return;Ux.set(i),e.uniformMatrix3fv(this.addr,!1,Ux),nn(n,i)}}function _R(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(en(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),nn(n,t)}else{if(en(n,i))return;Nx.set(i),e.uniformMatrix4fv(this.addr,!1,Nx),nn(n,i)}}function bR(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function vR(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(en(n,t))return;e.uniform2iv(this.addr,t),nn(n,t)}}function wR(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(en(n,t))return;e.uniform3iv(this.addr,t),nn(n,t)}}function MR(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(en(n,t))return;e.uniform4iv(this.addr,t),nn(n,t)}}function SR(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function ER(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(en(n,t))return;e.uniform2uiv(this.addr,t),nn(n,t)}}function TR(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(en(n,t))return;e.uniform3uiv(this.addr,t),nn(n,t)}}function AR(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(en(n,t))return;e.uniform4uiv(this.addr,t),nn(n,t)}}function RR(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s);let o;this.type===e.SAMPLER_2D_SHADOW?(Ix.compareFunction=zp,o=Ix):o=Kx,n.setTexture2D(t||o,s)}function CR(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTexture3D(t||Jx,s)}function kR(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTextureCube(t||Qx,s)}function PR(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTexture2DArray(t||Zx,s)}function IR(e){switch(e){case 5126:return fR;case 35664:return pR;case 35665:return mR;case 35666:return gR;case 35674:return yR;case 35675:return xR;case 35676:return _R;case 5124:case 35670:return bR;case 35667:case 35671:return vR;case 35668:case 35672:return wR;case 35669:case 35673:return MR;case 5125:return SR;case 36294:return ER;case 36295:return TR;case 36296:return AR;case 35678:case 36198:case 36298:case 36306:case 35682:return RR;case 35679:case 36299:case 36307:return CR;case 35680:case 36300:case 36308:case 36293:return kR;case 36289:case 36303:case 36311:case 36292:return PR}}function LR(e,t){e.uniform1fv(this.addr,t)}function DR(e,t){let n=ca(t,this.size,2);e.uniform2fv(this.addr,n)}function NR(e,t){let n=ca(t,this.size,3);e.uniform3fv(this.addr,n)}function UR(e,t){let n=ca(t,this.size,4);e.uniform4fv(this.addr,n)}function OR(e,t){let n=ca(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function FR(e,t){let n=ca(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function BR(e,t){let n=ca(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function HR(e,t){e.uniform1iv(this.addr,t)}function $R(e,t){e.uniform2iv(this.addr,t)}function zR(e,t){e.uniform3iv(this.addr,t)}function VR(e,t){e.uniform4iv(this.addr,t)}function GR(e,t){e.uniform1uiv(this.addr,t)}function WR(e,t){e.uniform2uiv(this.addr,t)}function qR(e,t){e.uniform3uiv(this.addr,t)}function XR(e,t){e.uniform4uiv(this.addr,t)}function jR(e,t,n){let i=this.cache,s=t.length,o=Pd(n,s);en(i,o)||(e.uniform1iv(this.addr,o),nn(i,o));for(let a=0;a!==s;++a)n.setTexture2D(t[a]||Kx,o[a])}function YR(e,t,n){let i=this.cache,s=t.length,o=Pd(n,s);en(i,o)||(e.uniform1iv(this.addr,o),nn(i,o));for(let a=0;a!==s;++a)n.setTexture3D(t[a]||Jx,o[a])}function KR(e,t,n){let i=this.cache,s=t.length,o=Pd(n,s);en(i,o)||(e.uniform1iv(this.addr,o),nn(i,o));for(let a=0;a!==s;++a)n.setTextureCube(t[a]||Qx,o[a])}function ZR(e,t,n){let i=this.cache,s=t.length,o=Pd(n,s);en(i,o)||(e.uniform1iv(this.addr,o),nn(i,o));for(let a=0;a!==s;++a)n.setTexture2DArray(t[a]||Zx,o[a])}function JR(e){switch(e){case 5126:return LR;case 35664:return DR;case 35665:return NR;case 35666:return UR;case 35674:return OR;case 35675:return FR;case 35676:return BR;case 5124:case 35670:return HR;case 35667:case 35671:return $R;case 35668:case 35672:return zR;case 35669:case 35673:return VR;case 5125:return GR;case 36294:return WR;case 36295:return qR;case 36296:return XR;case 35678:case 36198:case 36298:case 36306:case 35682:return jR;case 35679:case 36299:case 36307:return YR;case 35680:case 36300:case 36308:case 36293:return KR;case 36289:case 36303:case 36311:case 36292:return ZR}}var nm=class{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.setValue=IR(n.type)}},im=class{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=JR(n.type)}},sm=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,n,i){let s=this.seq;for(let o=0,a=s.length;o!==a;++o){let r=s[o];r.setValue(t,n[r.id],i)}}},em=/(\w+)(\])?(\[|\.)?/g;function Fx(e,t){e.seq.push(t),e.map[t.id]=t}function QR(e,t,n){let i=e.name,s=i.length;for(em.lastIndex=0;;){let o=em.exec(i),a=em.lastIndex,r=o[1],c=o[2]==="]",l=o[3];if(c&&(r=r|0),l===void 0||l==="["&&a+2===s){Fx(n,l===void 0?new nm(r,e,t):new im(r,e,t));break}else{let d=n.map[r];d===void 0&&(d=new sm(r),Fx(n,d)),n=d}}}var aa=class{constructor(t,n){this.seq=[],this.map={};let i=t.getProgramParameter(n,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let o=t.getActiveUniform(n,s),a=t.getUniformLocation(n,o.name);QR(o,a,this)}}setValue(t,n,i,s){let o=this.map[n];o!==void 0&&o.setValue(t,i,s)}setOptional(t,n,i){let s=n[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,n,i,s){for(let o=0,a=n.length;o!==a;++o){let r=n[o],c=i[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,s)}}static seqWithValue(t,n){let i=[];for(let s=0,o=t.length;s!==o;++s){let a=t[s];a.id in n&&i.push(a)}return i}};function Bx(e,t,n){let i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),i}var t2=37297,e2=0;function n2(e,t){let n=e.split(`
`),i=[],s=Math.max(t-6,0),o=Math.min(t+6,n.length);for(let a=s;a<o;a++){let r=a+1;i.push(`${r===t?">":" "} ${r}: ${n[a]}`)}return i.join(`
`)}var Hx=new Vt;function i2(e){se._getMatrix(Hx,se.workingColorSpace,e);let t=`mat3( ${Hx.elements.map(n=>n.toFixed(4))} )`;switch(se.getTransfer(e)){case Qa:return[t,"LinearTransferOETF"];case pe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function $x(e,t,n){let i=e.getShaderParameter(t,e.COMPILE_STATUS),o=(e.getShaderInfoLog(t)||"").trim();if(i&&o==="")return"";let a=/ERROR: 0:(\d+)/.exec(o);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+o+`

`+n2(e.getShaderSource(t),r)}else return o}function s2(e,t){let n=i2(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}function o2(e,t){let n;switch(t){case ix:n="Linear";break;case sx:n="Reinhard";break;case ox:n="Cineon";break;case rx:n="ACESFilmic";break;case lx:n="AgX";break;case cx:n="Neutral";break;case ax:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),n="Linear"}return"vec3 "+e+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}var Cd=new L;function r2(){se.getLuminanceCoefficients(Cd);let e=Cd.x.toFixed(4),t=Cd.y.toFixed(4),n=Cd.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function a2(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Rl).join(`
`)}function l2(e){let t=[];for(let n in e){let i=e[n];i!==!1&&t.push("#define "+n+" "+i)}return t.join(`
`)}function c2(e,t){let n={},i=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let o=e.getActiveAttrib(t,s),a=o.name,r=1;o.type===e.FLOAT_MAT2&&(r=2),o.type===e.FLOAT_MAT3&&(r=3),o.type===e.FLOAT_MAT4&&(r=4),n[a]={type:o.type,location:e.getAttribLocation(t,a),locationSize:r}}return n}function Rl(e){return e!==""}function zx(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Vx(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var u2=/^[ \t]*#include +<([\w\d./]+)>/gm;function om(e){return e.replace(u2,h2)}var d2=new Map;function h2(e,t){let n=jt[t];if(n===void 0){let i=d2.get(t);if(i!==void 0)n=jt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return om(n)}var f2=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Gx(e){return e.replace(f2,p2)}function p2(e,t,n,i){let s="";for(let o=parseInt(t);o<parseInt(n);o++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function Wx(e){let t=`precision ${e.precision} float;
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
#define LOW_PRECISION`),t}function m2(e){let t="SHADOWMAP_TYPE_BASIC";return e.shadowMapType===kp?t="SHADOWMAP_TYPE_PCF":e.shadowMapType===Lu?t="SHADOWMAP_TYPE_PCF_SOFT":e.shadowMapType===fs&&(t="SHADOWMAP_TYPE_VSM"),t}function g2(e){let t="ENVMAP_TYPE_CUBE";if(e.envMap)switch(e.envMapMode){case Qo:case tr:t="ENVMAP_TYPE_CUBE";break;case wl:t="ENVMAP_TYPE_CUBE_UV";break}return t}function y2(e){let t="ENVMAP_MODE_REFLECTION";if(e.envMap)switch(e.envMapMode){case tr:t="ENVMAP_MODE_REFRACTION";break}return t}function x2(e){let t="ENVMAP_BLENDING_NONE";if(e.envMap)switch(e.combine){case $u:t="ENVMAP_BLENDING_MULTIPLY";break;case ex:t="ENVMAP_BLENDING_MIX";break;case nx:t="ENVMAP_BLENDING_ADD";break}return t}function _2(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function b2(e,t,n,i){let s=e.getContext(),o=n.defines,a=n.vertexShader,r=n.fragmentShader,c=m2(n),l=g2(n),u=y2(n),d=x2(n),h=_2(n),f=a2(n),g=l2(o),y=s.createProgram(),m,p,x=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(Rl).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(Rl).join(`
`),p.length>0&&(p+=`
`)):(m=[Wx(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Rl).join(`
`),p=[Wx(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+l:"",n.envMap?"#define "+u:"",n.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Ns?"#define TONE_MAPPING":"",n.toneMapping!==Ns?jt.tonemapping_pars_fragment:"",n.toneMapping!==Ns?o2("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",jt.colorspace_pars_fragment,s2("linearToOutputTexel",n.outputColorSpace),r2(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Rl).join(`
`)),a=om(a),a=zx(a,n),a=Vx(a,n),r=om(r),r=zx(r,n),r=Vx(r,n),a=Gx(a),r=Gx(r),n.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",n.glslVersion===Vp?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Vp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let b=x+m+a,v=x+p+r,T=Bx(s,s.VERTEX_SHADER,b),S=Bx(s,s.FRAGMENT_SHADER,v);s.attachShader(y,T),s.attachShader(y,S),n.index0AttributeName!==void 0?s.bindAttribLocation(y,0,n.index0AttributeName):n.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function A(P){if(e.debug.checkShaderErrors){let D=s.getProgramInfoLog(y)||"",U=s.getShaderInfoLog(T)||"",H=s.getShaderInfoLog(S)||"",X=D.trim(),z=U.trim(),Z=H.trim(),V=!0,lt=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(V=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(s,y,T,S);else{let dt=$x(s,T,"vertex"),bt=$x(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+X+`
`+dt+`
`+bt)}else X!==""?console.warn("THREE.WebGLProgram: Program Info Log:",X):(z===""||Z==="")&&(lt=!1);lt&&(P.diagnostics={runnable:V,programLog:X,vertexShader:{log:z,prefix:m},fragmentShader:{log:Z,prefix:p}})}s.deleteShader(T),s.deleteShader(S),R=new aa(s,y),_=c2(s,y)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let _;this.getAttributes=function(){return _===void 0&&A(this),_};let w=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=s.getProgramParameter(y,t2)),w},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=e2++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=T,this.fragmentShader=S,this}var v2=0,rm=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let n=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(n),o=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(o)===!1&&(a.add(o),o.usedTimes++),this}remove(t){let n=this.materialCache.get(t);for(let i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let n=this.materialCache,i=n.get(t);return i===void 0&&(i=new Set,n.set(t,i)),i}_getShaderStage(t){let n=this.shaderCache,i=n.get(t);return i===void 0&&(i=new am(t),n.set(t,i)),i}},am=class{constructor(t){this.id=v2++,this.code=t,this.usedTimes=0}};function w2(e,t,n,i,s,o,a){let r=new qr,c=new rm,l=new Set,u=[],d=s.logarithmicDepthBuffer,h=s.vertexTextures,f=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(_){return l.add(_),_===0?"uv":`uv${_}`}function m(_,w,P,D,U){let H=D.fog,X=U.geometry,z=_.isMeshStandardMaterial?D.environment:null,Z=(_.isMeshStandardMaterial?n:t).get(_.envMap||z),V=Z&&Z.mapping===wl?Z.image.height:null,lt=g[_.type];_.precision!==null&&(f=s.getMaxPrecision(_.precision),f!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",f,"instead."));let dt=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,bt=dt!==void 0?dt.length:0,qt=0;X.morphAttributes.position!==void 0&&(qt=1),X.morphAttributes.normal!==void 0&&(qt=2),X.morphAttributes.color!==void 0&&(qt=3);let ee,Ee,re,K;if(lt){let ue=ps[lt];ee=ue.vertexShader,Ee=ue.fragmentShader}else ee=_.vertexShader,Ee=_.fragmentShader,c.update(_),re=c.getVertexShaderID(_),K=c.getFragmentShaderID(_);let tt=e.getRenderTarget(),Q=e.state.buffers.depth.getReversed(),it=U.isInstancedMesh===!0,nt=U.isBatchedMesh===!0,yt=!!_.map,he=!!_.matcap,I=!!Z,ae=!!_.aoMap,Ft=!!_.lightMap,Ut=!!_.bumpMap,wt=!!_.normalMap,Ue=!!_.displacementMap,Mt=!!_.emissiveMap,Xt=!!_.metalnessMap,un=!!_.roughnessMap,We=_.anisotropy>0,C=_.clearcoat>0,M=_.dispersion>0,$=_.iridescence>0,Y=_.sheen>0,et=_.transmission>0,j=We&&!!_.anisotropyMap,Rt=C&&!!_.clearcoatMap,ct=C&&!!_.clearcoatNormalMap,St=C&&!!_.clearcoatRoughnessMap,Et=$&&!!_.iridescenceMap,rt=$&&!!_.iridescenceThicknessMap,mt=Y&&!!_.sheenColorMap,Nt=Y&&!!_.sheenRoughnessMap,Tt=!!_.specularMap,ft=!!_.specularColorMap,Gt=!!_.specularIntensityMap,N=et&&!!_.transmissionMap,at=et&&!!_.thicknessMap,ut=!!_.gradientMap,xt=!!_.alphaMap,st=_.alphaTest>0,J=!!_.alphaHash,vt=!!_.extensions,$t=Ns;_.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&($t=e.toneMapping);let Te={shaderID:lt,shaderType:_.type,shaderName:_.name,vertexShader:ee,fragmentShader:Ee,defines:_.defines,customVertexShaderID:re,customFragmentShaderID:K,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:f,batching:nt,batchingColor:nt&&U._colorsTexture!==null,instancing:it,instancingColor:it&&U.instanceColor!==null,instancingMorph:it&&U.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:tt===null?e.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:jo,alphaToCoverage:!!_.alphaToCoverage,map:yt,matcap:he,envMap:I,envMapMode:I&&Z.mapping,envMapCubeUVHeight:V,aoMap:ae,lightMap:Ft,bumpMap:Ut,normalMap:wt,displacementMap:h&&Ue,emissiveMap:Mt,normalMapObjectSpace:wt&&_.normalMapType===fx,normalMapTangentSpace:wt&&_.normalMapType===Td,metalnessMap:Xt,roughnessMap:un,anisotropy:We,anisotropyMap:j,clearcoat:C,clearcoatMap:Rt,clearcoatNormalMap:ct,clearcoatRoughnessMap:St,dispersion:M,iridescence:$,iridescenceMap:Et,iridescenceThicknessMap:rt,sheen:Y,sheenColorMap:mt,sheenRoughnessMap:Nt,specularMap:Tt,specularColorMap:ft,specularIntensityMap:Gt,transmission:et,transmissionMap:N,thicknessMap:at,gradientMap:ut,opaque:_.transparent===!1&&_.blending===qo&&_.alphaToCoverage===!1,alphaMap:xt,alphaTest:st,alphaHash:J,combine:_.combine,mapUv:yt&&y(_.map.channel),aoMapUv:ae&&y(_.aoMap.channel),lightMapUv:Ft&&y(_.lightMap.channel),bumpMapUv:Ut&&y(_.bumpMap.channel),normalMapUv:wt&&y(_.normalMap.channel),displacementMapUv:Ue&&y(_.displacementMap.channel),emissiveMapUv:Mt&&y(_.emissiveMap.channel),metalnessMapUv:Xt&&y(_.metalnessMap.channel),roughnessMapUv:un&&y(_.roughnessMap.channel),anisotropyMapUv:j&&y(_.anisotropyMap.channel),clearcoatMapUv:Rt&&y(_.clearcoatMap.channel),clearcoatNormalMapUv:ct&&y(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:St&&y(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Et&&y(_.iridescenceMap.channel),iridescenceThicknessMapUv:rt&&y(_.iridescenceThicknessMap.channel),sheenColorMapUv:mt&&y(_.sheenColorMap.channel),sheenRoughnessMapUv:Nt&&y(_.sheenRoughnessMap.channel),specularMapUv:Tt&&y(_.specularMap.channel),specularColorMapUv:ft&&y(_.specularColorMap.channel),specularIntensityMapUv:Gt&&y(_.specularIntensityMap.channel),transmissionMapUv:N&&y(_.transmissionMap.channel),thicknessMapUv:at&&y(_.thicknessMap.channel),alphaMapUv:xt&&y(_.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(wt||We),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!X.attributes.uv&&(yt||xt),fog:!!H,useFog:_.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:_.flatShading===!0&&_.wireframe===!1,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Q,skinning:U.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:bt,morphTextureStride:qt,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:_.dithering,shadowMapEnabled:e.shadowMap.enabled&&P.length>0,shadowMapType:e.shadowMap.type,toneMapping:$t,decodeVideoTexture:yt&&_.map.isVideoTexture===!0&&se.getTransfer(_.map.colorSpace)===pe,decodeVideoTextureEmissive:Mt&&_.emissiveMap.isVideoTexture===!0&&se.getTransfer(_.emissiveMap.colorSpace)===pe,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Kn,flipSided:_.side===yn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:vt&&_.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(vt&&_.extensions.multiDraw===!0||nt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Te.vertexUv1s=l.has(1),Te.vertexUv2s=l.has(2),Te.vertexUv3s=l.has(3),l.clear(),Te}function p(_){let w=[];if(_.shaderID?w.push(_.shaderID):(w.push(_.customVertexShaderID),w.push(_.customFragmentShaderID)),_.defines!==void 0)for(let P in _.defines)w.push(P),w.push(_.defines[P]);return _.isRawShaderMaterial===!1&&(x(w,_),b(w,_),w.push(e.outputColorSpace)),w.push(_.customProgramCacheKey),w.join()}function x(_,w){_.push(w.precision),_.push(w.outputColorSpace),_.push(w.envMapMode),_.push(w.envMapCubeUVHeight),_.push(w.mapUv),_.push(w.alphaMapUv),_.push(w.lightMapUv),_.push(w.aoMapUv),_.push(w.bumpMapUv),_.push(w.normalMapUv),_.push(w.displacementMapUv),_.push(w.emissiveMapUv),_.push(w.metalnessMapUv),_.push(w.roughnessMapUv),_.push(w.anisotropyMapUv),_.push(w.clearcoatMapUv),_.push(w.clearcoatNormalMapUv),_.push(w.clearcoatRoughnessMapUv),_.push(w.iridescenceMapUv),_.push(w.iridescenceThicknessMapUv),_.push(w.sheenColorMapUv),_.push(w.sheenRoughnessMapUv),_.push(w.specularMapUv),_.push(w.specularColorMapUv),_.push(w.specularIntensityMapUv),_.push(w.transmissionMapUv),_.push(w.thicknessMapUv),_.push(w.combine),_.push(w.fogExp2),_.push(w.sizeAttenuation),_.push(w.morphTargetsCount),_.push(w.morphAttributeCount),_.push(w.numDirLights),_.push(w.numPointLights),_.push(w.numSpotLights),_.push(w.numSpotLightMaps),_.push(w.numHemiLights),_.push(w.numRectAreaLights),_.push(w.numDirLightShadows),_.push(w.numPointLightShadows),_.push(w.numSpotLightShadows),_.push(w.numSpotLightShadowsWithMaps),_.push(w.numLightProbes),_.push(w.shadowMapType),_.push(w.toneMapping),_.push(w.numClippingPlanes),_.push(w.numClipIntersection),_.push(w.depthPacking)}function b(_,w){r.disableAll(),w.supportsVertexTextures&&r.enable(0),w.instancing&&r.enable(1),w.instancingColor&&r.enable(2),w.instancingMorph&&r.enable(3),w.matcap&&r.enable(4),w.envMap&&r.enable(5),w.normalMapObjectSpace&&r.enable(6),w.normalMapTangentSpace&&r.enable(7),w.clearcoat&&r.enable(8),w.iridescence&&r.enable(9),w.alphaTest&&r.enable(10),w.vertexColors&&r.enable(11),w.vertexAlphas&&r.enable(12),w.vertexUv1s&&r.enable(13),w.vertexUv2s&&r.enable(14),w.vertexUv3s&&r.enable(15),w.vertexTangents&&r.enable(16),w.anisotropy&&r.enable(17),w.alphaHash&&r.enable(18),w.batching&&r.enable(19),w.dispersion&&r.enable(20),w.batchingColor&&r.enable(21),w.gradientMap&&r.enable(22),_.push(r.mask),r.disableAll(),w.fog&&r.enable(0),w.useFog&&r.enable(1),w.flatShading&&r.enable(2),w.logarithmicDepthBuffer&&r.enable(3),w.reversedDepthBuffer&&r.enable(4),w.skinning&&r.enable(5),w.morphTargets&&r.enable(6),w.morphNormals&&r.enable(7),w.morphColors&&r.enable(8),w.premultipliedAlpha&&r.enable(9),w.shadowMapEnabled&&r.enable(10),w.doubleSided&&r.enable(11),w.flipSided&&r.enable(12),w.useDepthPacking&&r.enable(13),w.dithering&&r.enable(14),w.transmission&&r.enable(15),w.sheen&&r.enable(16),w.opaque&&r.enable(17),w.pointsUvs&&r.enable(18),w.decodeVideoTexture&&r.enable(19),w.decodeVideoTextureEmissive&&r.enable(20),w.alphaToCoverage&&r.enable(21),_.push(r.mask)}function v(_){let w=g[_.type],P;if(w){let D=ps[w];P=Sx.clone(D.uniforms)}else P=_.uniforms;return P}function T(_,w){let P;for(let D=0,U=u.length;D<U;D++){let H=u[D];if(H.cacheKey===w){P=H,++P.usedTimes;break}}return P===void 0&&(P=new b2(e,w,_,o),u.push(P)),P}function S(_){if(--_.usedTimes===0){let w=u.indexOf(_);u[w]=u[u.length-1],u.pop(),_.destroy()}}function A(_){c.remove(_)}function R(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:T,releaseProgram:S,releaseShaderCache:A,programs:u,dispose:R}}function M2(){let e=new WeakMap;function t(a){return e.has(a)}function n(a){let r=e.get(a);return r===void 0&&(r={},e.set(a,r)),r}function i(a){e.delete(a)}function s(a,r,c){e.get(a)[r]=c}function o(){e=new WeakMap}return{has:t,get:n,remove:i,update:s,dispose:o}}function S2(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.material.id!==t.material.id?e.material.id-t.material.id:e.z!==t.z?e.z-t.z:e.id-t.id}function qx(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.z!==t.z?t.z-e.z:e.id-t.id}function Xx(){let e=[],t=0,n=[],i=[],s=[];function o(){t=0,n.length=0,i.length=0,s.length=0}function a(d,h,f,g,y,m){let p=e[t];return p===void 0?(p={id:d.id,object:d,geometry:h,material:f,groupOrder:g,renderOrder:d.renderOrder,z:y,group:m},e[t]=p):(p.id=d.id,p.object=d,p.geometry=h,p.material=f,p.groupOrder=g,p.renderOrder=d.renderOrder,p.z=y,p.group=m),t++,p}function r(d,h,f,g,y,m){let p=a(d,h,f,g,y,m);f.transmission>0?i.push(p):f.transparent===!0?s.push(p):n.push(p)}function c(d,h,f,g,y,m){let p=a(d,h,f,g,y,m);f.transmission>0?i.unshift(p):f.transparent===!0?s.unshift(p):n.unshift(p)}function l(d,h){n.length>1&&n.sort(d||S2),i.length>1&&i.sort(h||qx),s.length>1&&s.sort(h||qx)}function u(){for(let d=t,h=e.length;d<h;d++){let f=e[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:n,transmissive:i,transparent:s,init:o,push:r,unshift:c,finish:u,sort:l}}function E2(){let e=new WeakMap;function t(i,s){let o=e.get(i),a;return o===void 0?(a=new Xx,e.set(i,[a])):s>=o.length?(a=new Xx,o.push(a)):a=o[s],a}function n(){e=new WeakMap}return{get:t,dispose:n}}function T2(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"DirectionalLight":n={direction:new L,color:new Wt};break;case"SpotLight":n={position:new L,direction:new L,color:new Wt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new L,color:new Wt,distance:0,decay:0};break;case"HemisphereLight":n={direction:new L,skyColor:new Wt,groundColor:new Wt};break;case"RectAreaLight":n={color:new Wt,position:new L,halfWidth:new L,halfHeight:new L};break}return e[t.id]=n,n}}}function A2(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new At};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new At};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new At,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=n,n}}}var R2=0;function C2(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function k2(e){let t=new T2,n=A2(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new L);let s=new L,o=new me,a=new me;function r(l){let u=0,d=0,h=0;for(let _=0;_<9;_++)i.probe[_].set(0,0,0);let f=0,g=0,y=0,m=0,p=0,x=0,b=0,v=0,T=0,S=0,A=0;l.sort(C2);for(let _=0,w=l.length;_<w;_++){let P=l[_],D=P.color,U=P.intensity,H=P.distance,X=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)u+=D.r*U,d+=D.g*U,h+=D.b*U;else if(P.isLightProbe){for(let z=0;z<9;z++)i.probe[z].addScaledVector(P.sh.coefficients[z],U);A++}else if(P.isDirectionalLight){let z=t.get(P);if(z.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let Z=P.shadow,V=n.get(P);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,i.directionalShadow[f]=V,i.directionalShadowMap[f]=X,i.directionalShadowMatrix[f]=P.shadow.matrix,x++}i.directional[f]=z,f++}else if(P.isSpotLight){let z=t.get(P);z.position.setFromMatrixPosition(P.matrixWorld),z.color.copy(D).multiplyScalar(U),z.distance=H,z.coneCos=Math.cos(P.angle),z.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),z.decay=P.decay,i.spot[y]=z;let Z=P.shadow;if(P.map&&(i.spotLightMap[T]=P.map,T++,Z.updateMatrices(P),P.castShadow&&S++),i.spotLightMatrix[y]=Z.matrix,P.castShadow){let V=n.get(P);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,i.spotShadow[y]=V,i.spotShadowMap[y]=X,v++}y++}else if(P.isRectAreaLight){let z=t.get(P);z.color.copy(D).multiplyScalar(U),z.halfWidth.set(P.width*.5,0,0),z.halfHeight.set(0,P.height*.5,0),i.rectArea[m]=z,m++}else if(P.isPointLight){let z=t.get(P);if(z.color.copy(P.color).multiplyScalar(P.intensity),z.distance=P.distance,z.decay=P.decay,P.castShadow){let Z=P.shadow,V=n.get(P);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,V.shadowCameraNear=Z.camera.near,V.shadowCameraFar=Z.camera.far,i.pointShadow[g]=V,i.pointShadowMap[g]=X,i.pointShadowMatrix[g]=P.shadow.matrix,b++}i.point[g]=z,g++}else if(P.isHemisphereLight){let z=t.get(P);z.skyColor.copy(P.color).multiplyScalar(U),z.groundColor.copy(P.groundColor).multiplyScalar(U),i.hemi[p]=z,p++}}m>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ht.LTC_FLOAT_1,i.rectAreaLTC2=ht.LTC_FLOAT_2):(i.rectAreaLTC1=ht.LTC_HALF_1,i.rectAreaLTC2=ht.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=h;let R=i.hash;(R.directionalLength!==f||R.pointLength!==g||R.spotLength!==y||R.rectAreaLength!==m||R.hemiLength!==p||R.numDirectionalShadows!==x||R.numPointShadows!==b||R.numSpotShadows!==v||R.numSpotMaps!==T||R.numLightProbes!==A)&&(i.directional.length=f,i.spot.length=y,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=v+T-S,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=A,R.directionalLength=f,R.pointLength=g,R.spotLength=y,R.rectAreaLength=m,R.hemiLength=p,R.numDirectionalShadows=x,R.numPointShadows=b,R.numSpotShadows=v,R.numSpotMaps=T,R.numLightProbes=A,i.version=R2++)}function c(l,u){let d=0,h=0,f=0,g=0,y=0,m=u.matrixWorldInverse;for(let p=0,x=l.length;p<x;p++){let b=l[p];if(b.isDirectionalLight){let v=i.directional[d];v.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),d++}else if(b.isSpotLight){let v=i.spot[f];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),f++}else if(b.isRectAreaLight){let v=i.rectArea[g];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(m),a.identity(),o.copy(b.matrixWorld),o.premultiply(m),a.extractRotation(o),v.halfWidth.set(b.width*.5,0,0),v.halfHeight.set(0,b.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),g++}else if(b.isPointLight){let v=i.point[h];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(m),h++}else if(b.isHemisphereLight){let v=i.hemi[y];v.direction.setFromMatrixPosition(b.matrixWorld),v.direction.transformDirection(m),y++}}}return{setup:r,setupView:c,state:i}}function jx(e){let t=new k2(e),n=[],i=[];function s(u){l.camera=u,n.length=0,i.length=0}function o(u){n.push(u)}function a(u){i.push(u)}function r(){t.setup(n)}function c(u){t.setupView(n,u)}let l={lightsArray:n,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:r,setupLightsView:c,pushLight:o,pushShadow:a}}function P2(e){let t=new WeakMap;function n(s,o=0){let a=t.get(s),r;return a===void 0?(r=new jx(e),t.set(s,[r])):o>=a.length?(r=new jx(e),a.push(r)):r=a[o],r}function i(){t=new WeakMap}return{get:n,dispose:i}}var I2=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,L2=`uniform sampler2D shadow_pass;
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
}`;function D2(e,t,n){let i=new Yr,s=new At,o=new At,a=new fe,r=new bu({depthPacking:hx}),c=new vu,l={},u=n.maxTextureSize,d={[Is]:yn,[yn]:Is,[Kn]:Kn},h=new zi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new At},radius:{value:4}},vertexShader:I2,fragmentShader:L2}),f=h.clone();f.defines.HORIZONTAL_PASS=1;let g=new Rn;g.setAttribute("position",new hn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new G(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=kp;let p=this.type;this.render=function(S,A,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;let _=e.getRenderTarget(),w=e.getActiveCubeFace(),P=e.getActiveMipmapLevel(),D=e.state;D.setBlending(Ds),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);let U=p!==fs&&this.type===fs,H=p===fs&&this.type!==fs;for(let X=0,z=S.length;X<z;X++){let Z=S[X],V=Z.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);let lt=V.getFrameExtents();if(s.multiply(lt),o.copy(V.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(o.x=Math.floor(u/lt.x),s.x=o.x*lt.x,V.mapSize.x=o.x),s.y>u&&(o.y=Math.floor(u/lt.y),s.y=o.y*lt.y,V.mapSize.y=o.y)),V.map===null||U===!0||H===!0){let bt=this.type!==fs?{minFilter:jn,magFilter:jn}:{};V.map!==null&&V.map.dispose(),V.map=new us(s.x,s.y,bt),V.map.texture.name=Z.name+".shadowMap",V.camera.updateProjectionMatrix()}e.setRenderTarget(V.map),e.clear();let dt=V.getViewportCount();for(let bt=0;bt<dt;bt++){let qt=V.getViewport(bt);a.set(o.x*qt.x,o.y*qt.y,o.x*qt.z,o.y*qt.w),D.viewport(a),V.updateMatrices(Z,bt),i=V.getFrustum(),v(A,R,V.camera,Z,this.type)}V.isPointLightShadow!==!0&&this.type===fs&&x(V,R),V.needsUpdate=!1}p=this.type,m.needsUpdate=!1,e.setRenderTarget(_,w,P)};function x(S,A){let R=t.update(y);h.defines.VSM_SAMPLES!==S.blurSamples&&(h.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new us(s.x,s.y)),h.uniforms.shadow_pass.value=S.map.texture,h.uniforms.resolution.value=S.mapSize,h.uniforms.radius.value=S.radius,e.setRenderTarget(S.mapPass),e.clear(),e.renderBufferDirect(A,null,R,h,y,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,e.setRenderTarget(S.map),e.clear(),e.renderBufferDirect(A,null,R,f,y,null)}function b(S,A,R,_){let w=null,P=R.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(P!==void 0)w=P;else if(w=R.isPointLight===!0?c:r,e.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let D=w.uuid,U=A.uuid,H=l[D];H===void 0&&(H={},l[D]=H);let X=H[U];X===void 0&&(X=w.clone(),H[U]=X,A.addEventListener("dispose",T)),w=X}if(w.visible=A.visible,w.wireframe=A.wireframe,_===fs?w.side=A.shadowSide!==null?A.shadowSide:A.side:w.side=A.shadowSide!==null?A.shadowSide:d[A.side],w.alphaMap=A.alphaMap,w.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,w.map=A.map,w.clipShadows=A.clipShadows,w.clippingPlanes=A.clippingPlanes,w.clipIntersection=A.clipIntersection,w.displacementMap=A.displacementMap,w.displacementScale=A.displacementScale,w.displacementBias=A.displacementBias,w.wireframeLinewidth=A.wireframeLinewidth,w.linewidth=A.linewidth,R.isPointLight===!0&&w.isMeshDistanceMaterial===!0){let D=e.properties.get(w);D.light=R}return w}function v(S,A,R,_,w){if(S.visible===!1)return;if(S.layers.test(A.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&w===fs)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,S.matrixWorld);let U=t.update(S),H=S.material;if(Array.isArray(H)){let X=U.groups;for(let z=0,Z=X.length;z<Z;z++){let V=X[z],lt=H[V.materialIndex];if(lt&&lt.visible){let dt=b(S,lt,_,w);S.onBeforeShadow(e,S,A,R,U,dt,V),e.renderBufferDirect(R,null,U,dt,S,V),S.onAfterShadow(e,S,A,R,U,dt,V)}}}else if(H.visible){let X=b(S,H,_,w);S.onBeforeShadow(e,S,A,R,U,X,null),e.renderBufferDirect(R,null,U,X,S,null),S.onAfterShadow(e,S,A,R,U,X,null)}}let D=S.children;for(let U=0,H=D.length;U<H;U++)v(D[U],A,R,_,w)}function T(S){S.target.removeEventListener("dispose",T);for(let R in l){let _=l[R],w=S.target.uuid;w in _&&(_[w].dispose(),delete _[w])}}}var N2={[Du]:Nu,[Uu]:Bu,[Ou]:Hu,[Xo]:Fu,[Nu]:Du,[Bu]:Uu,[Hu]:Ou,[Fu]:Xo};function U2(e,t){function n(){let N=!1,at=new fe,ut=null,xt=new fe(0,0,0,0);return{setMask:function(st){ut!==st&&!N&&(e.colorMask(st,st,st,st),ut=st)},setLocked:function(st){N=st},setClear:function(st,J,vt,$t,Te){Te===!0&&(st*=$t,J*=$t,vt*=$t),at.set(st,J,vt,$t),xt.equals(at)===!1&&(e.clearColor(st,J,vt,$t),xt.copy(at))},reset:function(){N=!1,ut=null,xt.set(-1,0,0,0)}}}function i(){let N=!1,at=!1,ut=null,xt=null,st=null;return{setReversed:function(J){if(at!==J){let vt=t.get("EXT_clip_control");J?vt.clipControlEXT(vt.LOWER_LEFT_EXT,vt.ZERO_TO_ONE_EXT):vt.clipControlEXT(vt.LOWER_LEFT_EXT,vt.NEGATIVE_ONE_TO_ONE_EXT),at=J;let $t=st;st=null,this.setClear($t)}},getReversed:function(){return at},setTest:function(J){J?tt(e.DEPTH_TEST):Q(e.DEPTH_TEST)},setMask:function(J){ut!==J&&!N&&(e.depthMask(J),ut=J)},setFunc:function(J){if(at&&(J=N2[J]),xt!==J){switch(J){case Du:e.depthFunc(e.NEVER);break;case Nu:e.depthFunc(e.ALWAYS);break;case Uu:e.depthFunc(e.LESS);break;case Xo:e.depthFunc(e.LEQUAL);break;case Ou:e.depthFunc(e.EQUAL);break;case Fu:e.depthFunc(e.GEQUAL);break;case Bu:e.depthFunc(e.GREATER);break;case Hu:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}xt=J}},setLocked:function(J){N=J},setClear:function(J){st!==J&&(at&&(J=1-J),e.clearDepth(J),st=J)},reset:function(){N=!1,ut=null,xt=null,st=null,at=!1}}}function s(){let N=!1,at=null,ut=null,xt=null,st=null,J=null,vt=null,$t=null,Te=null;return{setTest:function(ue){N||(ue?tt(e.STENCIL_TEST):Q(e.STENCIL_TEST))},setMask:function(ue){at!==ue&&!N&&(e.stencilMask(ue),at=ue)},setFunc:function(ue,Ms,is){(ut!==ue||xt!==Ms||st!==is)&&(e.stencilFunc(ue,Ms,is),ut=ue,xt=Ms,st=is)},setOp:function(ue,Ms,is){(J!==ue||vt!==Ms||$t!==is)&&(e.stencilOp(ue,Ms,is),J=ue,vt=Ms,$t=is)},setLocked:function(ue){N=ue},setClear:function(ue){Te!==ue&&(e.clearStencil(ue),Te=ue)},reset:function(){N=!1,at=null,ut=null,xt=null,st=null,J=null,vt=null,$t=null,Te=null}}}let o=new n,a=new i,r=new s,c=new WeakMap,l=new WeakMap,u={},d={},h=new WeakMap,f=[],g=null,y=!1,m=null,p=null,x=null,b=null,v=null,T=null,S=null,A=new Wt(0,0,0),R=0,_=!1,w=null,P=null,D=null,U=null,H=null,X=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),z=!1,Z=0,V=e.getParameter(e.VERSION);V.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(V)[1]),z=Z>=1):V.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),z=Z>=2);let lt=null,dt={},bt=e.getParameter(e.SCISSOR_BOX),qt=e.getParameter(e.VIEWPORT),ee=new fe().fromArray(bt),Ee=new fe().fromArray(qt);function re(N,at,ut,xt){let st=new Uint8Array(4),J=e.createTexture();e.bindTexture(N,J),e.texParameteri(N,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(N,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let vt=0;vt<ut;vt++)N===e.TEXTURE_3D||N===e.TEXTURE_2D_ARRAY?e.texImage3D(at,0,e.RGBA,1,1,xt,0,e.RGBA,e.UNSIGNED_BYTE,st):e.texImage2D(at+vt,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,st);return J}let K={};K[e.TEXTURE_2D]=re(e.TEXTURE_2D,e.TEXTURE_2D,1),K[e.TEXTURE_CUBE_MAP]=re(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[e.TEXTURE_2D_ARRAY]=re(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),K[e.TEXTURE_3D]=re(e.TEXTURE_3D,e.TEXTURE_3D,1,1),o.setClear(0,0,0,1),a.setClear(1),r.setClear(0),tt(e.DEPTH_TEST),a.setFunc(Xo),Ut(!1),wt(Cp),tt(e.CULL_FACE),ae(Ds);function tt(N){u[N]!==!0&&(e.enable(N),u[N]=!0)}function Q(N){u[N]!==!1&&(e.disable(N),u[N]=!1)}function it(N,at){return d[N]!==at?(e.bindFramebuffer(N,at),d[N]=at,N===e.DRAW_FRAMEBUFFER&&(d[e.FRAMEBUFFER]=at),N===e.FRAMEBUFFER&&(d[e.DRAW_FRAMEBUFFER]=at),!0):!1}function nt(N,at){let ut=f,xt=!1;if(N){ut=h.get(at),ut===void 0&&(ut=[],h.set(at,ut));let st=N.textures;if(ut.length!==st.length||ut[0]!==e.COLOR_ATTACHMENT0){for(let J=0,vt=st.length;J<vt;J++)ut[J]=e.COLOR_ATTACHMENT0+J;ut.length=st.length,xt=!0}}else ut[0]!==e.BACK&&(ut[0]=e.BACK,xt=!0);xt&&e.drawBuffers(ut)}function yt(N){return g!==N?(e.useProgram(N),g=N,!0):!1}let he={[lo]:e.FUNC_ADD,[Fy]:e.FUNC_SUBTRACT,[By]:e.FUNC_REVERSE_SUBTRACT};he[Hy]=e.MIN,he[$y]=e.MAX;let I={[zy]:e.ZERO,[Vy]:e.ONE,[Gy]:e.SRC_COLOR,[uu]:e.SRC_ALPHA,[Ky]:e.SRC_ALPHA_SATURATE,[jy]:e.DST_COLOR,[qy]:e.DST_ALPHA,[Wy]:e.ONE_MINUS_SRC_COLOR,[du]:e.ONE_MINUS_SRC_ALPHA,[Yy]:e.ONE_MINUS_DST_COLOR,[Xy]:e.ONE_MINUS_DST_ALPHA,[Zy]:e.CONSTANT_COLOR,[Jy]:e.ONE_MINUS_CONSTANT_COLOR,[Qy]:e.CONSTANT_ALPHA,[tx]:e.ONE_MINUS_CONSTANT_ALPHA};function ae(N,at,ut,xt,st,J,vt,$t,Te,ue){if(N===Ds){y===!0&&(Q(e.BLEND),y=!1);return}if(y===!1&&(tt(e.BLEND),y=!0),N!==Oy){if(N!==m||ue!==_){if((p!==lo||v!==lo)&&(e.blendEquation(e.FUNC_ADD),p=lo,v=lo),ue)switch(N){case qo:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Pp:e.blendFunc(e.ONE,e.ONE);break;case Ip:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case Lp:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case qo:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Pp:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case Ip:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Lp:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}x=null,b=null,T=null,S=null,A.set(0,0,0),R=0,m=N,_=ue}return}st=st||at,J=J||ut,vt=vt||xt,(at!==p||st!==v)&&(e.blendEquationSeparate(he[at],he[st]),p=at,v=st),(ut!==x||xt!==b||J!==T||vt!==S)&&(e.blendFuncSeparate(I[ut],I[xt],I[J],I[vt]),x=ut,b=xt,T=J,S=vt),($t.equals(A)===!1||Te!==R)&&(e.blendColor($t.r,$t.g,$t.b,Te),A.copy($t),R=Te),m=N,_=!1}function Ft(N,at){N.side===Kn?Q(e.CULL_FACE):tt(e.CULL_FACE);let ut=N.side===yn;at&&(ut=!ut),Ut(ut),N.blending===qo&&N.transparent===!1?ae(Ds):ae(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),o.setMask(N.colorWrite);let xt=N.stencilWrite;r.setTest(xt),xt&&(r.setMask(N.stencilWriteMask),r.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),r.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Mt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?tt(e.SAMPLE_ALPHA_TO_COVERAGE):Q(e.SAMPLE_ALPHA_TO_COVERAGE)}function Ut(N){w!==N&&(N?e.frontFace(e.CW):e.frontFace(e.CCW),w=N)}function wt(N){N!==Ny?(tt(e.CULL_FACE),N!==P&&(N===Cp?e.cullFace(e.BACK):N===Uy?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):Q(e.CULL_FACE),P=N}function Ue(N){N!==D&&(z&&e.lineWidth(N),D=N)}function Mt(N,at,ut){N?(tt(e.POLYGON_OFFSET_FILL),(U!==at||H!==ut)&&(e.polygonOffset(at,ut),U=at,H=ut)):Q(e.POLYGON_OFFSET_FILL)}function Xt(N){N?tt(e.SCISSOR_TEST):Q(e.SCISSOR_TEST)}function un(N){N===void 0&&(N=e.TEXTURE0+X-1),lt!==N&&(e.activeTexture(N),lt=N)}function We(N,at,ut){ut===void 0&&(lt===null?ut=e.TEXTURE0+X-1:ut=lt);let xt=dt[ut];xt===void 0&&(xt={type:void 0,texture:void 0},dt[ut]=xt),(xt.type!==N||xt.texture!==at)&&(lt!==ut&&(e.activeTexture(ut),lt=ut),e.bindTexture(N,at||K[N]),xt.type=N,xt.texture=at)}function C(){let N=dt[lt];N!==void 0&&N.type!==void 0&&(e.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function M(){try{e.compressedTexImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function $(){try{e.compressedTexImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Y(){try{e.texSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function et(){try{e.texSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function j(){try{e.compressedTexSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Rt(){try{e.compressedTexSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ct(){try{e.texStorage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function St(){try{e.texStorage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Et(){try{e.texImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function rt(){try{e.texImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function mt(N){ee.equals(N)===!1&&(e.scissor(N.x,N.y,N.z,N.w),ee.copy(N))}function Nt(N){Ee.equals(N)===!1&&(e.viewport(N.x,N.y,N.z,N.w),Ee.copy(N))}function Tt(N,at){let ut=l.get(at);ut===void 0&&(ut=new WeakMap,l.set(at,ut));let xt=ut.get(N);xt===void 0&&(xt=e.getUniformBlockIndex(at,N.name),ut.set(N,xt))}function ft(N,at){let xt=l.get(at).get(N);c.get(at)!==xt&&(e.uniformBlockBinding(at,xt,N.__bindingPointIndex),c.set(at,xt))}function Gt(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),a.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),u={},lt=null,dt={},d={},h=new WeakMap,f=[],g=null,y=!1,m=null,p=null,x=null,b=null,v=null,T=null,S=null,A=new Wt(0,0,0),R=0,_=!1,w=null,P=null,D=null,U=null,H=null,ee.set(0,0,e.canvas.width,e.canvas.height),Ee.set(0,0,e.canvas.width,e.canvas.height),o.reset(),a.reset(),r.reset()}return{buffers:{color:o,depth:a,stencil:r},enable:tt,disable:Q,bindFramebuffer:it,drawBuffers:nt,useProgram:yt,setBlending:ae,setMaterial:Ft,setFlipSided:Ut,setCullFace:wt,setLineWidth:Ue,setPolygonOffset:Mt,setScissorTest:Xt,activeTexture:un,bindTexture:We,unbindTexture:C,compressedTexImage2D:M,compressedTexImage3D:$,texImage2D:Et,texImage3D:rt,updateUBOMapping:Tt,uniformBlockBinding:ft,texStorage2D:ct,texStorage3D:St,texSubImage2D:Y,texSubImage3D:et,compressedTexSubImage2D:j,compressedTexSubImage3D:Rt,scissor:mt,viewport:Nt,reset:Gt}}function O2(e,t,n,i,s,o,a){let r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new At,u=new WeakMap,d,h=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,M){return f?new OffscreenCanvas(C,M):el("canvas")}function y(C,M,$){let Y=1,et=We(C);if((et.width>$||et.height>$)&&(Y=$/Math.max(et.width,et.height)),Y<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let j=Math.floor(Y*et.width),Rt=Math.floor(Y*et.height);d===void 0&&(d=g(j,Rt));let ct=M?g(j,Rt):d;return ct.width=j,ct.height=Rt,ct.getContext("2d").drawImage(C,0,0,j,Rt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+et.width+"x"+et.height+") to ("+j+"x"+Rt+")."),ct}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+et.width+"x"+et.height+")."),C;return C}function m(C){return C.generateMipmaps}function p(C){e.generateMipmap(C)}function x(C){return C.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?e.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(C,M,$,Y,et=!1){if(C!==null){if(e[C]!==void 0)return e[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let j=M;if(M===e.RED&&($===e.FLOAT&&(j=e.R32F),$===e.HALF_FLOAT&&(j=e.R16F),$===e.UNSIGNED_BYTE&&(j=e.R8)),M===e.RED_INTEGER&&($===e.UNSIGNED_BYTE&&(j=e.R8UI),$===e.UNSIGNED_SHORT&&(j=e.R16UI),$===e.UNSIGNED_INT&&(j=e.R32UI),$===e.BYTE&&(j=e.R8I),$===e.SHORT&&(j=e.R16I),$===e.INT&&(j=e.R32I)),M===e.RG&&($===e.FLOAT&&(j=e.RG32F),$===e.HALF_FLOAT&&(j=e.RG16F),$===e.UNSIGNED_BYTE&&(j=e.RG8)),M===e.RG_INTEGER&&($===e.UNSIGNED_BYTE&&(j=e.RG8UI),$===e.UNSIGNED_SHORT&&(j=e.RG16UI),$===e.UNSIGNED_INT&&(j=e.RG32UI),$===e.BYTE&&(j=e.RG8I),$===e.SHORT&&(j=e.RG16I),$===e.INT&&(j=e.RG32I)),M===e.RGB_INTEGER&&($===e.UNSIGNED_BYTE&&(j=e.RGB8UI),$===e.UNSIGNED_SHORT&&(j=e.RGB16UI),$===e.UNSIGNED_INT&&(j=e.RGB32UI),$===e.BYTE&&(j=e.RGB8I),$===e.SHORT&&(j=e.RGB16I),$===e.INT&&(j=e.RGB32I)),M===e.RGBA_INTEGER&&($===e.UNSIGNED_BYTE&&(j=e.RGBA8UI),$===e.UNSIGNED_SHORT&&(j=e.RGBA16UI),$===e.UNSIGNED_INT&&(j=e.RGBA32UI),$===e.BYTE&&(j=e.RGBA8I),$===e.SHORT&&(j=e.RGBA16I),$===e.INT&&(j=e.RGBA32I)),M===e.RGB&&($===e.UNSIGNED_INT_5_9_9_9_REV&&(j=e.RGB9_E5),$===e.UNSIGNED_INT_10F_11F_11F_REV&&(j=e.R11F_G11F_B10F)),M===e.RGBA){let Rt=et?Qa:se.getTransfer(Y);$===e.FLOAT&&(j=e.RGBA32F),$===e.HALF_FLOAT&&(j=e.RGBA16F),$===e.UNSIGNED_BYTE&&(j=Rt===pe?e.SRGB8_ALPHA8:e.RGBA8),$===e.UNSIGNED_SHORT_4_4_4_4&&(j=e.RGBA4),$===e.UNSIGNED_SHORT_5_5_5_1&&(j=e.RGB5_A1)}return(j===e.R16F||j===e.R32F||j===e.RG16F||j===e.RG32F||j===e.RGBA16F||j===e.RGBA32F)&&t.get("EXT_color_buffer_float"),j}function v(C,M){let $;return C?M===null||M===po||M===na?$=e.DEPTH24_STENCIL8:M===Wi?$=e.DEPTH32F_STENCIL8:M===ta&&($=e.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===po||M===na?$=e.DEPTH_COMPONENT24:M===Wi?$=e.DEPTH_COMPONENT32F:M===ta&&($=e.DEPTH_COMPONENT16),$}function T(C,M){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==jn&&C.minFilter!==$i?Math.log2(Math.max(M.width,M.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?M.mipmaps.length:1}function S(C){let M=C.target;M.removeEventListener("dispose",S),R(M),M.isVideoTexture&&u.delete(M)}function A(C){let M=C.target;M.removeEventListener("dispose",A),w(M)}function R(C){let M=i.get(C);if(M.__webglInit===void 0)return;let $=C.source,Y=h.get($);if(Y){let et=Y[M.__cacheKey];et.usedTimes--,et.usedTimes===0&&_(C),Object.keys(Y).length===0&&h.delete($)}i.remove(C)}function _(C){let M=i.get(C);e.deleteTexture(M.__webglTexture);let $=C.source,Y=h.get($);delete Y[M.__cacheKey],a.memory.textures--}function w(C){let M=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(M.__webglFramebuffer[Y]))for(let et=0;et<M.__webglFramebuffer[Y].length;et++)e.deleteFramebuffer(M.__webglFramebuffer[Y][et]);else e.deleteFramebuffer(M.__webglFramebuffer[Y]);M.__webglDepthbuffer&&e.deleteRenderbuffer(M.__webglDepthbuffer[Y])}else{if(Array.isArray(M.__webglFramebuffer))for(let Y=0;Y<M.__webglFramebuffer.length;Y++)e.deleteFramebuffer(M.__webglFramebuffer[Y]);else e.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&e.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&e.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let Y=0;Y<M.__webglColorRenderbuffer.length;Y++)M.__webglColorRenderbuffer[Y]&&e.deleteRenderbuffer(M.__webglColorRenderbuffer[Y]);M.__webglDepthRenderbuffer&&e.deleteRenderbuffer(M.__webglDepthRenderbuffer)}let $=C.textures;for(let Y=0,et=$.length;Y<et;Y++){let j=i.get($[Y]);j.__webglTexture&&(e.deleteTexture(j.__webglTexture),a.memory.textures--),i.remove($[Y])}i.remove(C)}let P=0;function D(){P=0}function U(){let C=P;return C>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),P+=1,C}function H(C){let M=[];return M.push(C.wrapS),M.push(C.wrapT),M.push(C.wrapR||0),M.push(C.magFilter),M.push(C.minFilter),M.push(C.anisotropy),M.push(C.internalFormat),M.push(C.format),M.push(C.type),M.push(C.generateMipmaps),M.push(C.premultiplyAlpha),M.push(C.flipY),M.push(C.unpackAlignment),M.push(C.colorSpace),M.join()}function X(C,M){let $=i.get(C);if(C.isVideoTexture&&Xt(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&$.__version!==C.version){let Y=C.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K($,C,M);return}}else C.isExternalTexture&&($.__webglTexture=C.sourceTexture?C.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,$.__webglTexture,e.TEXTURE0+M)}function z(C,M){let $=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&$.__version!==C.version){K($,C,M);return}n.bindTexture(e.TEXTURE_2D_ARRAY,$.__webglTexture,e.TEXTURE0+M)}function Z(C,M){let $=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&$.__version!==C.version){K($,C,M);return}n.bindTexture(e.TEXTURE_3D,$.__webglTexture,e.TEXTURE0+M)}function V(C,M){let $=i.get(C);if(C.version>0&&$.__version!==C.version){tt($,C,M);return}n.bindTexture(e.TEXTURE_CUBE_MAP,$.__webglTexture,e.TEXTURE0+M)}let lt={[$r]:e.REPEAT,[ls]:e.CLAMP_TO_EDGE,[hu]:e.MIRRORED_REPEAT},dt={[jn]:e.NEAREST,[ux]:e.NEAREST_MIPMAP_NEAREST,[Ml]:e.NEAREST_MIPMAP_LINEAR,[$i]:e.LINEAR,[Gu]:e.LINEAR_MIPMAP_NEAREST,[fo]:e.LINEAR_MIPMAP_LINEAR},bt={[px]:e.NEVER,[bx]:e.ALWAYS,[mx]:e.LESS,[zp]:e.LEQUAL,[gx]:e.EQUAL,[_x]:e.GEQUAL,[yx]:e.GREATER,[xx]:e.NOTEQUAL};function qt(C,M){if(M.type===Wi&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===$i||M.magFilter===Gu||M.magFilter===Ml||M.magFilter===fo||M.minFilter===$i||M.minFilter===Gu||M.minFilter===Ml||M.minFilter===fo)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(C,e.TEXTURE_WRAP_S,lt[M.wrapS]),e.texParameteri(C,e.TEXTURE_WRAP_T,lt[M.wrapT]),(C===e.TEXTURE_3D||C===e.TEXTURE_2D_ARRAY)&&e.texParameteri(C,e.TEXTURE_WRAP_R,lt[M.wrapR]),e.texParameteri(C,e.TEXTURE_MAG_FILTER,dt[M.magFilter]),e.texParameteri(C,e.TEXTURE_MIN_FILTER,dt[M.minFilter]),M.compareFunction&&(e.texParameteri(C,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(C,e.TEXTURE_COMPARE_FUNC,bt[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===jn||M.minFilter!==Ml&&M.minFilter!==fo||M.type===Wi&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){let $=t.get("EXT_texture_filter_anisotropic");e.texParameterf(C,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function ee(C,M){let $=!1;C.__webglInit===void 0&&(C.__webglInit=!0,M.addEventListener("dispose",S));let Y=M.source,et=h.get(Y);et===void 0&&(et={},h.set(Y,et));let j=H(M);if(j!==C.__cacheKey){et[j]===void 0&&(et[j]={texture:e.createTexture(),usedTimes:0},a.memory.textures++,$=!0),et[j].usedTimes++;let Rt=et[C.__cacheKey];Rt!==void 0&&(et[C.__cacheKey].usedTimes--,Rt.usedTimes===0&&_(M)),C.__cacheKey=j,C.__webglTexture=et[j].texture}return $}function Ee(C,M,$){return Math.floor(Math.floor(C/$)/M)}function re(C,M,$,Y){let j=C.updateRanges;if(j.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,M.width,M.height,$,Y,M.data);else{j.sort((rt,mt)=>rt.start-mt.start);let Rt=0;for(let rt=1;rt<j.length;rt++){let mt=j[Rt],Nt=j[rt],Tt=mt.start+mt.count,ft=Ee(Nt.start,M.width,4),Gt=Ee(mt.start,M.width,4);Nt.start<=Tt+1&&ft===Gt&&Ee(Nt.start+Nt.count-1,M.width,4)===ft?mt.count=Math.max(mt.count,Nt.start+Nt.count-mt.start):(++Rt,j[Rt]=Nt)}j.length=Rt+1;let ct=e.getParameter(e.UNPACK_ROW_LENGTH),St=e.getParameter(e.UNPACK_SKIP_PIXELS),Et=e.getParameter(e.UNPACK_SKIP_ROWS);e.pixelStorei(e.UNPACK_ROW_LENGTH,M.width);for(let rt=0,mt=j.length;rt<mt;rt++){let Nt=j[rt],Tt=Math.floor(Nt.start/4),ft=Math.ceil(Nt.count/4),Gt=Tt%M.width,N=Math.floor(Tt/M.width),at=ft,ut=1;e.pixelStorei(e.UNPACK_SKIP_PIXELS,Gt),e.pixelStorei(e.UNPACK_SKIP_ROWS,N),n.texSubImage2D(e.TEXTURE_2D,0,Gt,N,at,ut,$,Y,M.data)}C.clearUpdateRanges(),e.pixelStorei(e.UNPACK_ROW_LENGTH,ct),e.pixelStorei(e.UNPACK_SKIP_PIXELS,St),e.pixelStorei(e.UNPACK_SKIP_ROWS,Et)}}function K(C,M,$){let Y=e.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(Y=e.TEXTURE_2D_ARRAY),M.isData3DTexture&&(Y=e.TEXTURE_3D);let et=ee(C,M),j=M.source;n.bindTexture(Y,C.__webglTexture,e.TEXTURE0+$);let Rt=i.get(j);if(j.version!==Rt.__version||et===!0){n.activeTexture(e.TEXTURE0+$);let ct=se.getPrimaries(se.workingColorSpace),St=M.colorSpace===qi?null:se.getPrimaries(M.colorSpace),Et=M.colorSpace===qi||ct===St?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,M.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,M.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,Et);let rt=y(M.image,!1,s.maxTextureSize);rt=un(M,rt);let mt=o.convert(M.format,M.colorSpace),Nt=o.convert(M.type),Tt=b(M.internalFormat,mt,Nt,M.colorSpace,M.isVideoTexture);qt(Y,M);let ft,Gt=M.mipmaps,N=M.isVideoTexture!==!0,at=Rt.__version===void 0||et===!0,ut=j.dataReady,xt=T(M,rt);if(M.isDepthTexture)Tt=v(M.format===ia,M.type),at&&(N?n.texStorage2D(e.TEXTURE_2D,1,Tt,rt.width,rt.height):n.texImage2D(e.TEXTURE_2D,0,Tt,rt.width,rt.height,0,mt,Nt,null));else if(M.isDataTexture)if(Gt.length>0){N&&at&&n.texStorage2D(e.TEXTURE_2D,xt,Tt,Gt[0].width,Gt[0].height);for(let st=0,J=Gt.length;st<J;st++)ft=Gt[st],N?ut&&n.texSubImage2D(e.TEXTURE_2D,st,0,0,ft.width,ft.height,mt,Nt,ft.data):n.texImage2D(e.TEXTURE_2D,st,Tt,ft.width,ft.height,0,mt,Nt,ft.data);M.generateMipmaps=!1}else N?(at&&n.texStorage2D(e.TEXTURE_2D,xt,Tt,rt.width,rt.height),ut&&re(M,rt,mt,Nt)):n.texImage2D(e.TEXTURE_2D,0,Tt,rt.width,rt.height,0,mt,Nt,rt.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){N&&at&&n.texStorage3D(e.TEXTURE_2D_ARRAY,xt,Tt,Gt[0].width,Gt[0].height,rt.depth);for(let st=0,J=Gt.length;st<J;st++)if(ft=Gt[st],M.format!==Ei)if(mt!==null)if(N){if(ut)if(M.layerUpdates.size>0){let vt=Yp(ft.width,ft.height,M.format,M.type);for(let $t of M.layerUpdates){let Te=ft.data.subarray($t*vt/ft.data.BYTES_PER_ELEMENT,($t+1)*vt/ft.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,st,0,0,$t,ft.width,ft.height,1,mt,Te)}M.clearLayerUpdates()}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,st,0,0,0,ft.width,ft.height,rt.depth,mt,ft.data)}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,st,Tt,ft.width,ft.height,rt.depth,0,ft.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else N?ut&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,st,0,0,0,ft.width,ft.height,rt.depth,mt,Nt,ft.data):n.texImage3D(e.TEXTURE_2D_ARRAY,st,Tt,ft.width,ft.height,rt.depth,0,mt,Nt,ft.data)}else{N&&at&&n.texStorage2D(e.TEXTURE_2D,xt,Tt,Gt[0].width,Gt[0].height);for(let st=0,J=Gt.length;st<J;st++)ft=Gt[st],M.format!==Ei?mt!==null?N?ut&&n.compressedTexSubImage2D(e.TEXTURE_2D,st,0,0,ft.width,ft.height,mt,ft.data):n.compressedTexImage2D(e.TEXTURE_2D,st,Tt,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):N?ut&&n.texSubImage2D(e.TEXTURE_2D,st,0,0,ft.width,ft.height,mt,Nt,ft.data):n.texImage2D(e.TEXTURE_2D,st,Tt,ft.width,ft.height,0,mt,Nt,ft.data)}else if(M.isDataArrayTexture)if(N){if(at&&n.texStorage3D(e.TEXTURE_2D_ARRAY,xt,Tt,rt.width,rt.height,rt.depth),ut)if(M.layerUpdates.size>0){let st=Yp(rt.width,rt.height,M.format,M.type);for(let J of M.layerUpdates){let vt=rt.data.subarray(J*st/rt.data.BYTES_PER_ELEMENT,(J+1)*st/rt.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,J,rt.width,rt.height,1,mt,Nt,vt)}M.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,rt.width,rt.height,rt.depth,mt,Nt,rt.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,Tt,rt.width,rt.height,rt.depth,0,mt,Nt,rt.data);else if(M.isData3DTexture)N?(at&&n.texStorage3D(e.TEXTURE_3D,xt,Tt,rt.width,rt.height,rt.depth),ut&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,rt.width,rt.height,rt.depth,mt,Nt,rt.data)):n.texImage3D(e.TEXTURE_3D,0,Tt,rt.width,rt.height,rt.depth,0,mt,Nt,rt.data);else if(M.isFramebufferTexture){if(at)if(N)n.texStorage2D(e.TEXTURE_2D,xt,Tt,rt.width,rt.height);else{let st=rt.width,J=rt.height;for(let vt=0;vt<xt;vt++)n.texImage2D(e.TEXTURE_2D,vt,Tt,st,J,0,mt,Nt,null),st>>=1,J>>=1}}else if(Gt.length>0){if(N&&at){let st=We(Gt[0]);n.texStorage2D(e.TEXTURE_2D,xt,Tt,st.width,st.height)}for(let st=0,J=Gt.length;st<J;st++)ft=Gt[st],N?ut&&n.texSubImage2D(e.TEXTURE_2D,st,0,0,mt,Nt,ft):n.texImage2D(e.TEXTURE_2D,st,Tt,mt,Nt,ft);M.generateMipmaps=!1}else if(N){if(at){let st=We(rt);n.texStorage2D(e.TEXTURE_2D,xt,Tt,st.width,st.height)}ut&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,mt,Nt,rt)}else n.texImage2D(e.TEXTURE_2D,0,Tt,mt,Nt,rt);m(M)&&p(Y),Rt.__version=j.version,M.onUpdate&&M.onUpdate(M)}C.__version=M.version}function tt(C,M,$){if(M.image.length!==6)return;let Y=ee(C,M),et=M.source;n.bindTexture(e.TEXTURE_CUBE_MAP,C.__webglTexture,e.TEXTURE0+$);let j=i.get(et);if(et.version!==j.__version||Y===!0){n.activeTexture(e.TEXTURE0+$);let Rt=se.getPrimaries(se.workingColorSpace),ct=M.colorSpace===qi?null:se.getPrimaries(M.colorSpace),St=M.colorSpace===qi||Rt===ct?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,M.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,M.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,St);let Et=M.isCompressedTexture||M.image[0].isCompressedTexture,rt=M.image[0]&&M.image[0].isDataTexture,mt=[];for(let J=0;J<6;J++)!Et&&!rt?mt[J]=y(M.image[J],!0,s.maxCubemapSize):mt[J]=rt?M.image[J].image:M.image[J],mt[J]=un(M,mt[J]);let Nt=mt[0],Tt=o.convert(M.format,M.colorSpace),ft=o.convert(M.type),Gt=b(M.internalFormat,Tt,ft,M.colorSpace),N=M.isVideoTexture!==!0,at=j.__version===void 0||Y===!0,ut=et.dataReady,xt=T(M,Nt);qt(e.TEXTURE_CUBE_MAP,M);let st;if(Et){N&&at&&n.texStorage2D(e.TEXTURE_CUBE_MAP,xt,Gt,Nt.width,Nt.height);for(let J=0;J<6;J++){st=mt[J].mipmaps;for(let vt=0;vt<st.length;vt++){let $t=st[vt];M.format!==Ei?Tt!==null?N?ut&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt,0,0,$t.width,$t.height,Tt,$t.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt,Gt,$t.width,$t.height,0,$t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?ut&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt,0,0,$t.width,$t.height,Tt,ft,$t.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt,Gt,$t.width,$t.height,0,Tt,ft,$t.data)}}}else{if(st=M.mipmaps,N&&at){st.length>0&&xt++;let J=We(mt[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,xt,Gt,J.width,J.height)}for(let J=0;J<6;J++)if(rt){N?ut&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,mt[J].width,mt[J].height,Tt,ft,mt[J].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Gt,mt[J].width,mt[J].height,0,Tt,ft,mt[J].data);for(let vt=0;vt<st.length;vt++){let Te=st[vt].image[J].image;N?ut&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt+1,0,0,Te.width,Te.height,Tt,ft,Te.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt+1,Gt,Te.width,Te.height,0,Tt,ft,Te.data)}}else{N?ut&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Tt,ft,mt[J]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Gt,Tt,ft,mt[J]);for(let vt=0;vt<st.length;vt++){let $t=st[vt];N?ut&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt+1,0,0,Tt,ft,$t.image[J]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt+1,Gt,Tt,ft,$t.image[J])}}}m(M)&&p(e.TEXTURE_CUBE_MAP),j.__version=et.version,M.onUpdate&&M.onUpdate(M)}C.__version=M.version}function Q(C,M,$,Y,et,j){let Rt=o.convert($.format,$.colorSpace),ct=o.convert($.type),St=b($.internalFormat,Rt,ct,$.colorSpace),Et=i.get(M),rt=i.get($);if(rt.__renderTarget=M,!Et.__hasExternalTextures){let mt=Math.max(1,M.width>>j),Nt=Math.max(1,M.height>>j);et===e.TEXTURE_3D||et===e.TEXTURE_2D_ARRAY?n.texImage3D(et,j,St,mt,Nt,M.depth,0,Rt,ct,null):n.texImage2D(et,j,St,mt,Nt,0,Rt,ct,null)}n.bindFramebuffer(e.FRAMEBUFFER,C),Mt(M)?r.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,Y,et,rt.__webglTexture,0,Ue(M)):(et===e.TEXTURE_2D||et>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&et<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,Y,et,rt.__webglTexture,j),n.bindFramebuffer(e.FRAMEBUFFER,null)}function it(C,M,$){if(e.bindRenderbuffer(e.RENDERBUFFER,C),M.depthBuffer){let Y=M.depthTexture,et=Y&&Y.isDepthTexture?Y.type:null,j=v(M.stencilBuffer,et),Rt=M.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ct=Ue(M);Mt(M)?r.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,ct,j,M.width,M.height):$?e.renderbufferStorageMultisample(e.RENDERBUFFER,ct,j,M.width,M.height):e.renderbufferStorage(e.RENDERBUFFER,j,M.width,M.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,Rt,e.RENDERBUFFER,C)}else{let Y=M.textures;for(let et=0;et<Y.length;et++){let j=Y[et],Rt=o.convert(j.format,j.colorSpace),ct=o.convert(j.type),St=b(j.internalFormat,Rt,ct,j.colorSpace),Et=Ue(M);$&&Mt(M)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,Et,St,M.width,M.height):Mt(M)?r.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Et,St,M.width,M.height):e.renderbufferStorage(e.RENDERBUFFER,St,M.width,M.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function nt(C,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(e.FRAMEBUFFER,C),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let Y=i.get(M.depthTexture);Y.__renderTarget=M,(!Y.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),X(M.depthTexture,0);let et=Y.__webglTexture,j=Ue(M);if(M.depthTexture.format===zr)Mt(M)?r.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,et,0,j):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,et,0);else if(M.depthTexture.format===ia)Mt(M)?r.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,et,0,j):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,et,0);else throw new Error("Unknown depthTexture format")}function yt(C){let M=i.get(C),$=C.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==C.depthTexture){let Y=C.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),Y){let et=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,Y.removeEventListener("dispose",et)};Y.addEventListener("dispose",et),M.__depthDisposeCallback=et}M.__boundDepthTexture=Y}if(C.depthTexture&&!M.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");let Y=C.texture.mipmaps;Y&&Y.length>0?nt(M.__webglFramebuffer[0],C):nt(M.__webglFramebuffer,C)}else if($){M.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(n.bindFramebuffer(e.FRAMEBUFFER,M.__webglFramebuffer[Y]),M.__webglDepthbuffer[Y]===void 0)M.__webglDepthbuffer[Y]=e.createRenderbuffer(),it(M.__webglDepthbuffer[Y],C,!1);else{let et=C.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,j=M.__webglDepthbuffer[Y];e.bindRenderbuffer(e.RENDERBUFFER,j),e.framebufferRenderbuffer(e.FRAMEBUFFER,et,e.RENDERBUFFER,j)}}else{let Y=C.texture.mipmaps;if(Y&&Y.length>0?n.bindFramebuffer(e.FRAMEBUFFER,M.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=e.createRenderbuffer(),it(M.__webglDepthbuffer,C,!1);else{let et=C.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,j=M.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,j),e.framebufferRenderbuffer(e.FRAMEBUFFER,et,e.RENDERBUFFER,j)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function he(C,M,$){let Y=i.get(C);M!==void 0&&Q(Y.__webglFramebuffer,C,C.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),$!==void 0&&yt(C)}function I(C){let M=C.texture,$=i.get(C),Y=i.get(M);C.addEventListener("dispose",A);let et=C.textures,j=C.isWebGLCubeRenderTarget===!0,Rt=et.length>1;if(Rt||(Y.__webglTexture===void 0&&(Y.__webglTexture=e.createTexture()),Y.__version=M.version,a.memory.textures++),j){$.__webglFramebuffer=[];for(let ct=0;ct<6;ct++)if(M.mipmaps&&M.mipmaps.length>0){$.__webglFramebuffer[ct]=[];for(let St=0;St<M.mipmaps.length;St++)$.__webglFramebuffer[ct][St]=e.createFramebuffer()}else $.__webglFramebuffer[ct]=e.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){$.__webglFramebuffer=[];for(let ct=0;ct<M.mipmaps.length;ct++)$.__webglFramebuffer[ct]=e.createFramebuffer()}else $.__webglFramebuffer=e.createFramebuffer();if(Rt)for(let ct=0,St=et.length;ct<St;ct++){let Et=i.get(et[ct]);Et.__webglTexture===void 0&&(Et.__webglTexture=e.createTexture(),a.memory.textures++)}if(C.samples>0&&Mt(C)===!1){$.__webglMultisampledFramebuffer=e.createFramebuffer(),$.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let ct=0;ct<et.length;ct++){let St=et[ct];$.__webglColorRenderbuffer[ct]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,$.__webglColorRenderbuffer[ct]);let Et=o.convert(St.format,St.colorSpace),rt=o.convert(St.type),mt=b(St.internalFormat,Et,rt,St.colorSpace,C.isXRRenderTarget===!0),Nt=Ue(C);e.renderbufferStorageMultisample(e.RENDERBUFFER,Nt,mt,C.width,C.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ct,e.RENDERBUFFER,$.__webglColorRenderbuffer[ct])}e.bindRenderbuffer(e.RENDERBUFFER,null),C.depthBuffer&&($.__webglDepthRenderbuffer=e.createRenderbuffer(),it($.__webglDepthRenderbuffer,C,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(j){n.bindTexture(e.TEXTURE_CUBE_MAP,Y.__webglTexture),qt(e.TEXTURE_CUBE_MAP,M);for(let ct=0;ct<6;ct++)if(M.mipmaps&&M.mipmaps.length>0)for(let St=0;St<M.mipmaps.length;St++)Q($.__webglFramebuffer[ct][St],C,M,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ct,St);else Q($.__webglFramebuffer[ct],C,M,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0);m(M)&&p(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Rt){for(let ct=0,St=et.length;ct<St;ct++){let Et=et[ct],rt=i.get(Et),mt=e.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(mt=C.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(mt,rt.__webglTexture),qt(mt,Et),Q($.__webglFramebuffer,C,Et,e.COLOR_ATTACHMENT0+ct,mt,0),m(Et)&&p(mt)}n.unbindTexture()}else{let ct=e.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ct=C.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(ct,Y.__webglTexture),qt(ct,M),M.mipmaps&&M.mipmaps.length>0)for(let St=0;St<M.mipmaps.length;St++)Q($.__webglFramebuffer[St],C,M,e.COLOR_ATTACHMENT0,ct,St);else Q($.__webglFramebuffer,C,M,e.COLOR_ATTACHMENT0,ct,0);m(M)&&p(ct),n.unbindTexture()}C.depthBuffer&&yt(C)}function ae(C){let M=C.textures;for(let $=0,Y=M.length;$<Y;$++){let et=M[$];if(m(et)){let j=x(C),Rt=i.get(et).__webglTexture;n.bindTexture(j,Rt),p(j),n.unbindTexture()}}}let Ft=[],Ut=[];function wt(C){if(C.samples>0){if(Mt(C)===!1){let M=C.textures,$=C.width,Y=C.height,et=e.COLOR_BUFFER_BIT,j=C.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,Rt=i.get(C),ct=M.length>1;if(ct)for(let Et=0;Et<M.length;Et++)n.bindFramebuffer(e.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Et,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,Rt.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+Et,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer);let St=C.texture.mipmaps;St&&St.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer);for(let Et=0;Et<M.length;Et++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(et|=e.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(et|=e.STENCIL_BUFFER_BIT)),ct){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,Rt.__webglColorRenderbuffer[Et]);let rt=i.get(M[Et]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,rt,0)}e.blitFramebuffer(0,0,$,Y,0,0,$,Y,et,e.NEAREST),c===!0&&(Ft.length=0,Ut.length=0,Ft.push(e.COLOR_ATTACHMENT0+Et),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Ft.push(j),Ut.push(j),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Ut)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ft))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),ct)for(let Et=0;Et<M.length;Et++){n.bindFramebuffer(e.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Et,e.RENDERBUFFER,Rt.__webglColorRenderbuffer[Et]);let rt=i.get(M[Et]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,Rt.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+Et,e.TEXTURE_2D,rt,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){let M=C.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[M])}}}function Ue(C){return Math.min(s.maxSamples,C.samples)}function Mt(C){let M=i.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Xt(C){let M=a.render.frame;u.get(C)!==M&&(u.set(C,M),C.update())}function un(C,M){let $=C.colorSpace,Y=C.format,et=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||$!==jo&&$!==qi&&(se.getTransfer($)===pe?(Y!==Ei||et!==Gi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),M}function We(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=U,this.resetTextureUnits=D,this.setTexture2D=X,this.setTexture2DArray=z,this.setTexture3D=Z,this.setTextureCube=V,this.rebindTextures=he,this.setupRenderTarget=I,this.updateRenderTargetMipmap=ae,this.updateMultisampleRenderTarget=wt,this.setupDepthRenderbuffer=yt,this.setupFrameBufferTexture=Q,this.useMultisampledRTT=Mt}function F2(e,t){function n(i,s=qi){let o,a=se.getTransfer(s);if(i===Gi)return e.UNSIGNED_BYTE;if(i===qu)return e.UNSIGNED_SHORT_4_4_4_4;if(i===Xu)return e.UNSIGNED_SHORT_5_5_5_1;if(i===Op)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===Fp)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===Np)return e.BYTE;if(i===Up)return e.SHORT;if(i===ta)return e.UNSIGNED_SHORT;if(i===Wu)return e.INT;if(i===po)return e.UNSIGNED_INT;if(i===Wi)return e.FLOAT;if(i===ea)return e.HALF_FLOAT;if(i===Bp)return e.ALPHA;if(i===Hp)return e.RGB;if(i===Ei)return e.RGBA;if(i===zr)return e.DEPTH_COMPONENT;if(i===ia)return e.DEPTH_STENCIL;if(i===ju)return e.RED;if(i===Yu)return e.RED_INTEGER;if(i===$p)return e.RG;if(i===Ku)return e.RG_INTEGER;if(i===Zu)return e.RGBA_INTEGER;if(i===Sl||i===El||i===Tl||i===Al)if(a===pe)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(i===Sl)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===El)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Tl)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Al)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(i===Sl)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===El)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Tl)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Al)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ju||i===Qu||i===td||i===ed)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(i===Ju)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Qu)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===td)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ed)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===nd||i===id||i===sd)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(i===nd||i===id)return a===pe?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(i===sd)return a===pe?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===od||i===rd||i===ad||i===ld||i===cd||i===ud||i===dd||i===hd||i===fd||i===pd||i===md||i===gd||i===yd||i===xd)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(i===od)return a===pe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===rd)return a===pe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ad)return a===pe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ld)return a===pe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===cd)return a===pe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ud)return a===pe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===dd)return a===pe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===hd)return a===pe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===fd)return a===pe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===pd)return a===pe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===md)return a===pe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===gd)return a===pe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===yd)return a===pe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===xd)return a===pe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===_d||i===bd||i===vd)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(i===_d)return a===pe?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===bd)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===vd)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===wd||i===Md||i===Sd||i===Ed)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(i===wd)return o.COMPRESSED_RED_RGTC1_EXT;if(i===Md)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Sd)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ed)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===na?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:n}}var B2=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,H2=`
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

}`,lm=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,n){if(this.texture===null){let i=new cl(t.texture);(t.depthNear!==n.depthNear||t.depthFar!==n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let n=t.cameras[0].viewport,i=new zi({vertexShader:B2,fragmentShader:H2,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new G(new Cn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},cm=class extends cs{constructor(t,n){super();let i=this,s=null,o=1,a=null,r="local-floor",c=1,l=null,u=null,d=null,h=null,f=null,g=null,y=typeof XRWebGLBinding<"u",m=new lm,p={},x=n.getContextAttributes(),b=null,v=null,T=[],S=[],A=new At,R=null,_=new gn;_.viewport=new fe;let w=new gn;w.viewport=new fe;let P=[_,w],D=new Iu,U=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let tt=T[K];return tt===void 0&&(tt=new Xr,T[K]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(K){let tt=T[K];return tt===void 0&&(tt=new Xr,T[K]=tt),tt.getGripSpace()},this.getHand=function(K){let tt=T[K];return tt===void 0&&(tt=new Xr,T[K]=tt),tt.getHandSpace()};function X(K){let tt=S.indexOf(K.inputSource);if(tt===-1)return;let Q=T[tt];Q!==void 0&&(Q.update(K.inputSource,K.frame,l||a),Q.dispatchEvent({type:K.type,data:K.inputSource}))}function z(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",Z);for(let K=0;K<T.length;K++){let tt=S[K];tt!==null&&(S[K]=null,T[K].disconnect(tt))}U=null,H=null,m.reset();for(let K in p)delete p[K];t.setRenderTarget(b),f=null,h=null,d=null,s=null,v=null,re.stop(),i.isPresenting=!1,t.setPixelRatio(R),t.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){o=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){r=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(K){l=K},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d===null&&y&&(d=new XRWebGLBinding(s,n)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(b=t.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",z),s.addEventListener("inputsourceschange",Z),x.xrCompatible!==!0&&await n.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(A),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let Q=null,it=null,nt=null;x.depth&&(nt=x.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Q=x.stencil?ia:zr,it=x.stencil?na:po);let yt={colorFormat:n.RGBA8,depthFormat:nt,scaleFactor:o};d=this.getBinding(),h=d.createProjectionLayer(yt),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),v=new us(h.textureWidth,h.textureHeight,{format:Ei,type:Gi,depthTexture:new ll(h.textureWidth,h.textureHeight,it,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{let Q={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:o};f=new XRWebGLLayer(s,n,Q),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new us(f.framebufferWidth,f.framebufferHeight,{format:Ei,type:Gi,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(r),re.setContext(s),re.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Z(K){for(let tt=0;tt<K.removed.length;tt++){let Q=K.removed[tt],it=S.indexOf(Q);it>=0&&(S[it]=null,T[it].disconnect(Q))}for(let tt=0;tt<K.added.length;tt++){let Q=K.added[tt],it=S.indexOf(Q);if(it===-1){for(let yt=0;yt<T.length;yt++)if(yt>=S.length){S.push(Q),it=yt;break}else if(S[yt]===null){S[yt]=Q,it=yt;break}if(it===-1)break}let nt=T[it];nt&&nt.connect(Q)}}let V=new L,lt=new L;function dt(K,tt,Q){V.setFromMatrixPosition(tt.matrixWorld),lt.setFromMatrixPosition(Q.matrixWorld);let it=V.distanceTo(lt),nt=tt.projectionMatrix.elements,yt=Q.projectionMatrix.elements,he=nt[14]/(nt[10]-1),I=nt[14]/(nt[10]+1),ae=(nt[9]+1)/nt[5],Ft=(nt[9]-1)/nt[5],Ut=(nt[8]-1)/nt[0],wt=(yt[8]+1)/yt[0],Ue=he*Ut,Mt=he*wt,Xt=it/(-Ut+wt),un=Xt*-Ut;if(tt.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(un),K.translateZ(Xt),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),nt[10]===-1)K.projectionMatrix.copy(tt.projectionMatrix),K.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{let We=he+Xt,C=I+Xt,M=Ue-un,$=Mt+(it-un),Y=ae*I/C*We,et=Ft*I/C*We;K.projectionMatrix.makePerspective(M,$,Y,et,We,C),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function bt(K,tt){tt===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(tt.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let tt=K.near,Q=K.far;m.texture!==null&&(m.depthNear>0&&(tt=m.depthNear),m.depthFar>0&&(Q=m.depthFar)),D.near=w.near=_.near=tt,D.far=w.far=_.far=Q,(U!==D.near||H!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),U=D.near,H=D.far),D.layers.mask=K.layers.mask|6,_.layers.mask=D.layers.mask&3,w.layers.mask=D.layers.mask&5;let it=K.parent,nt=D.cameras;bt(D,it);for(let yt=0;yt<nt.length;yt++)bt(nt[yt],it);nt.length===2?dt(D,_,w):D.projectionMatrix.copy(_.projectionMatrix),qt(K,D,it)};function qt(K,tt,Q){Q===null?K.matrix.copy(tt.matrixWorld):(K.matrix.copy(Q.matrixWorld),K.matrix.invert(),K.matrix.multiply(tt.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(tt.projectionMatrix),K.projectionMatrixInverse.copy(tt.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Vr*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(h===null&&f===null))return c},this.setFoveation=function(K){c=K,h!==null&&(h.fixedFoveation=K),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=K)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(D)},this.getCameraTexture=function(K){return p[K]};let ee=null;function Ee(K,tt){if(u=tt.getViewerPose(l||a),g=tt,u!==null){let Q=u.views;f!==null&&(t.setRenderTargetFramebuffer(v,f.framebuffer),t.setRenderTarget(v));let it=!1;Q.length!==D.cameras.length&&(D.cameras.length=0,it=!0);for(let I=0;I<Q.length;I++){let ae=Q[I],Ft=null;if(f!==null)Ft=f.getViewport(ae);else{let wt=d.getViewSubImage(h,ae);Ft=wt.viewport,I===0&&(t.setRenderTargetTextures(v,wt.colorTexture,wt.depthStencilTexture),t.setRenderTarget(v))}let Ut=P[I];Ut===void 0&&(Ut=new gn,Ut.layers.enable(I),Ut.viewport=new fe,P[I]=Ut),Ut.matrix.fromArray(ae.transform.matrix),Ut.matrix.decompose(Ut.position,Ut.quaternion,Ut.scale),Ut.projectionMatrix.fromArray(ae.projectionMatrix),Ut.projectionMatrixInverse.copy(Ut.projectionMatrix).invert(),Ut.viewport.set(Ft.x,Ft.y,Ft.width,Ft.height),I===0&&(D.matrix.copy(Ut.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),it===!0&&D.cameras.push(Ut)}let nt=s.enabledFeatures;if(nt&&nt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){d=i.getBinding();let I=d.getDepthInformation(Q[0]);I&&I.isValid&&I.texture&&m.init(I,s.renderState)}if(nt&&nt.includes("camera-access")&&y){t.state.unbindTexture(),d=i.getBinding();for(let I=0;I<Q.length;I++){let ae=Q[I].camera;if(ae){let Ft=p[ae];Ft||(Ft=new cl,p[ae]=Ft);let Ut=d.getCameraImage(ae);Ft.sourceTexture=Ut}}}}for(let Q=0;Q<T.length;Q++){let it=S[Q],nt=T[Q];it!==null&&nt!==void 0&&nt.update(it,tt,l||a)}ee&&ee(K,tt),tt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:tt}),g=null}let re=new Yx;re.setAnimationLoop(Ee),this.setAnimationLoop=function(K){ee=K},this.dispose=function(){}}},ir=new Mi,$2=new me;function z2(e,t){function n(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,qp(e)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,x,b,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?o(m,p):p.isMeshToonMaterial?(o(m,p),d(m,p)):p.isMeshPhongMaterial?(o(m,p),u(m,p)):p.isMeshStandardMaterial?(o(m,p),h(m,p),p.isMeshPhysicalMaterial&&f(m,p,v)):p.isMeshMatcapMaterial?(o(m,p),g(m,p)):p.isMeshDepthMaterial?o(m,p):p.isMeshDistanceMaterial?(o(m,p),y(m,p)):p.isMeshNormalMaterial?o(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&r(m,p)):p.isPointsMaterial?c(m,p,x,b):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function o(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,n(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,n(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===yn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,n(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===yn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,n(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,n(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,n(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let x=t.get(p),b=x.envMap,v=x.envMapRotation;b&&(m.envMap.value=b,ir.copy(v),ir.x*=-1,ir.y*=-1,ir.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(ir.y*=-1,ir.z*=-1),m.envMapRotation.value.setFromMatrix4($2.makeRotationFromEuler(ir)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,n(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,n(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,n(p.map,m.mapTransform))}function r(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,x,b){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=b*.5,p.map&&(m.map.value=p.map,n(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,n(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,n(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,n(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,n(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,n(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,n(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,n(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,n(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===yn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,n(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,n(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,n(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,n(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,n(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,n(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,n(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function y(m,p){let x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function V2(e,t,n,i){let s={},o={},a=[],r=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,b){let v=b.program;i.uniformBlockBinding(x,v)}function l(x,b){let v=s[x.id];v===void 0&&(g(x),v=u(x),s[x.id]=v,x.addEventListener("dispose",m));let T=b.program;i.updateUBOMapping(x,T);let S=t.render.frame;o[x.id]!==S&&(h(x),o[x.id]=S)}function u(x){let b=d();x.__bindingPointIndex=b;let v=e.createBuffer(),T=x.__size,S=x.usage;return e.bindBuffer(e.UNIFORM_BUFFER,v),e.bufferData(e.UNIFORM_BUFFER,T,S),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,b,v),v}function d(){for(let x=0;x<r;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(x){let b=s[x.id],v=x.uniforms,T=x.__cache;e.bindBuffer(e.UNIFORM_BUFFER,b);for(let S=0,A=v.length;S<A;S++){let R=Array.isArray(v[S])?v[S]:[v[S]];for(let _=0,w=R.length;_<w;_++){let P=R[_];if(f(P,S,_,T)===!0){let D=P.__offset,U=Array.isArray(P.value)?P.value:[P.value],H=0;for(let X=0;X<U.length;X++){let z=U[X],Z=y(z);typeof z=="number"||typeof z=="boolean"?(P.__data[0]=z,e.bufferSubData(e.UNIFORM_BUFFER,D+H,P.__data)):z.isMatrix3?(P.__data[0]=z.elements[0],P.__data[1]=z.elements[1],P.__data[2]=z.elements[2],P.__data[3]=0,P.__data[4]=z.elements[3],P.__data[5]=z.elements[4],P.__data[6]=z.elements[5],P.__data[7]=0,P.__data[8]=z.elements[6],P.__data[9]=z.elements[7],P.__data[10]=z.elements[8],P.__data[11]=0):(z.toArray(P.__data,H),H+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,D,P.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function f(x,b,v,T){let S=x.value,A=b+"_"+v;if(T[A]===void 0)return typeof S=="number"||typeof S=="boolean"?T[A]=S:T[A]=S.clone(),!0;{let R=T[A];if(typeof S=="number"||typeof S=="boolean"){if(R!==S)return T[A]=S,!0}else if(R.equals(S)===!1)return R.copy(S),!0}return!1}function g(x){let b=x.uniforms,v=0,T=16;for(let A=0,R=b.length;A<R;A++){let _=Array.isArray(b[A])?b[A]:[b[A]];for(let w=0,P=_.length;w<P;w++){let D=_[w],U=Array.isArray(D.value)?D.value:[D.value];for(let H=0,X=U.length;H<X;H++){let z=U[H],Z=y(z),V=v%T,lt=V%Z.boundary,dt=V+lt;v+=lt,dt!==0&&T-dt<Z.storage&&(v+=T-dt),D.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=v,v+=Z.storage}}}let S=v%T;return S>0&&(v+=T-S),x.__size=v,x.__cache={},this}function y(x){let b={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(b.boundary=4,b.storage=4):x.isVector2?(b.boundary=8,b.storage=8):x.isVector3||x.isColor?(b.boundary=16,b.storage=12):x.isVector4?(b.boundary=16,b.storage=16):x.isMatrix3?(b.boundary=48,b.storage=48):x.isMatrix4?(b.boundary=64,b.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),b}function m(x){let b=x.target;b.removeEventListener("dispose",m);let v=a.indexOf(b.__bindingPointIndex);a.splice(v,1),e.deleteBuffer(s[b.id]),delete s[b.id],delete o[b.id]}function p(){for(let x in s)e.deleteBuffer(s[x]);a=[],s={},o={}}return{bind:c,update:l,dispose:p}}var kd=class{constructor(t={}){let{canvas:n=vx(),context:i=null,depth:s=!0,stencil:o=!1,alpha:a=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=a;let g=new Uint32Array(4),y=new Int32Array(4),m=null,p=null,x=[],b=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ns,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let v=this,T=!1;this._outputColorSpace=Xe;let S=0,A=0,R=null,_=-1,w=null,P=new fe,D=new fe,U=null,H=new Wt(0),X=0,z=n.width,Z=n.height,V=1,lt=null,dt=null,bt=new fe(0,0,z,Z),qt=new fe(0,0,z,Z),ee=!1,Ee=new Yr,re=!1,K=!1,tt=new me,Q=new L,it=new fe,nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},yt=!1;function he(){return R===null?V:1}let I=i;function ae(E,O){return n.getContext(E,O)}try{let E={alpha:!0,depth:s,stencil:o,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${"180"}`),n.addEventListener("webglcontextlost",ut,!1),n.addEventListener("webglcontextrestored",xt,!1),n.addEventListener("webglcontextcreationerror",st,!1),I===null){let O="webgl2";if(I=ae(O,E),I===null)throw ae(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Ft,Ut,wt,Ue,Mt,Xt,un,We,C,M,$,Y,et,j,Rt,ct,St,Et,rt,mt,Nt,Tt,ft,Gt;function N(){Ft=new aR(I),Ft.init(),Tt=new F2(I,Ft),Ut=new tR(I,Ft,t,Tt),wt=new U2(I,Ft),Ut.reversedDepthBuffer&&h&&wt.buffers.depth.setReversed(!0),Ue=new uR(I),Mt=new M2,Xt=new O2(I,Ft,wt,Mt,Ut,Tt,Ue),un=new nR(v),We=new rR(v),C=new g1(I),ft=new JA(I,C),M=new lR(I,C,Ue,ft),$=new hR(I,M,C,Ue),rt=new dR(I,Ut,Xt),ct=new eR(Mt),Y=new w2(v,un,We,Ft,Ut,ft,ct),et=new z2(v,Mt),j=new E2,Rt=new P2(Ft),Et=new ZA(v,un,We,wt,$,f,c),St=new D2(v,$,Ut),Gt=new V2(I,Ue,Ut,wt),mt=new QA(I,Ft,Ue),Nt=new cR(I,Ft,Ue),Ue.programs=Y.programs,v.capabilities=Ut,v.extensions=Ft,v.properties=Mt,v.renderLists=j,v.shadowMap=St,v.state=wt,v.info=Ue}N();let at=new cm(v,I);this.xr=at,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let E=Ft.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=Ft.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(E){E!==void 0&&(V=E,this.setSize(z,Z,!1))},this.getSize=function(E){return E.set(z,Z)},this.setSize=function(E,O,W=!0){if(at.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=E,Z=O,n.width=Math.floor(E*V),n.height=Math.floor(O*V),W===!0&&(n.style.width=E+"px",n.style.height=O+"px"),this.setViewport(0,0,E,O)},this.getDrawingBufferSize=function(E){return E.set(z*V,Z*V).floor()},this.setDrawingBufferSize=function(E,O,W){z=E,Z=O,V=W,n.width=Math.floor(E*W),n.height=Math.floor(O*W),this.setViewport(0,0,E,O)},this.getCurrentViewport=function(E){return E.copy(P)},this.getViewport=function(E){return E.copy(bt)},this.setViewport=function(E,O,W,q){E.isVector4?bt.set(E.x,E.y,E.z,E.w):bt.set(E,O,W,q),wt.viewport(P.copy(bt).multiplyScalar(V).round())},this.getScissor=function(E){return E.copy(qt)},this.setScissor=function(E,O,W,q){E.isVector4?qt.set(E.x,E.y,E.z,E.w):qt.set(E,O,W,q),wt.scissor(D.copy(qt).multiplyScalar(V).round())},this.getScissorTest=function(){return ee},this.setScissorTest=function(E){wt.setScissorTest(ee=E)},this.setOpaqueSort=function(E){lt=E},this.setTransparentSort=function(E){dt=E},this.getClearColor=function(E){return E.copy(Et.getClearColor())},this.setClearColor=function(){Et.setClearColor(...arguments)},this.getClearAlpha=function(){return Et.getClearAlpha()},this.setClearAlpha=function(){Et.setClearAlpha(...arguments)},this.clear=function(E=!0,O=!0,W=!0){let q=0;if(E){let F=!1;if(R!==null){let ot=R.texture.format;F=ot===Zu||ot===Ku||ot===Yu}if(F){let ot=R.texture.type,pt=ot===Gi||ot===po||ot===ta||ot===na||ot===qu||ot===Xu,_t=Et.getClearColor(),gt=Et.getClearAlpha(),Dt=_t.r,Ot=_t.g,Pt=_t.b;pt?(g[0]=Dt,g[1]=Ot,g[2]=Pt,g[3]=gt,I.clearBufferuiv(I.COLOR,0,g)):(y[0]=Dt,y[1]=Ot,y[2]=Pt,y[3]=gt,I.clearBufferiv(I.COLOR,0,y))}else q|=I.COLOR_BUFFER_BIT}O&&(q|=I.DEPTH_BUFFER_BIT),W&&(q|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",ut,!1),n.removeEventListener("webglcontextrestored",xt,!1),n.removeEventListener("webglcontextcreationerror",st,!1),Et.dispose(),j.dispose(),Rt.dispose(),Mt.dispose(),un.dispose(),We.dispose(),$.dispose(),ft.dispose(),Gt.dispose(),Y.dispose(),at.dispose(),at.removeEventListener("sessionstart",is),at.removeEventListener("sessionend",S0),Po.stop()};function ut(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function xt(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let E=Ue.autoReset,O=St.enabled,W=St.autoUpdate,q=St.needsUpdate,F=St.type;N(),Ue.autoReset=E,St.enabled=O,St.autoUpdate=W,St.needsUpdate=q,St.type=F}function st(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function J(E){let O=E.target;O.removeEventListener("dispose",J),vt(O)}function vt(E){$t(E),Mt.remove(E)}function $t(E){let O=Mt.get(E).programs;O!==void 0&&(O.forEach(function(W){Y.releaseProgram(W)}),E.isShaderMaterial&&Y.releaseShaderCache(E))}this.renderBufferDirect=function(E,O,W,q,F,ot){O===null&&(O=nt);let pt=F.isMesh&&F.matrixWorld.determinant()<0,_t=YM(E,O,W,q,F);wt.setMaterial(q,pt);let gt=W.index,Dt=1;if(q.wireframe===!0){if(gt=M.getWireframeAttribute(W),gt===void 0)return;Dt=2}let Ot=W.drawRange,Pt=W.attributes.position,Jt=Ot.start*Dt,xe=(Ot.start+Ot.count)*Dt;ot!==null&&(Jt=Math.max(Jt,ot.start*Dt),xe=Math.min(xe,(ot.start+ot.count)*Dt)),gt!==null?(Jt=Math.max(Jt,0),xe=Math.min(xe,gt.count)):Pt!=null&&(Jt=Math.max(Jt,0),xe=Math.min(xe,Pt.count));let ze=xe-Jt;if(ze<0||ze===1/0)return;ft.setup(F,q,_t,W,gt);let Ie,we=mt;if(gt!==null&&(Ie=C.get(gt),we=Nt,we.setIndex(Ie)),F.isMesh)q.wireframe===!0?(wt.setLineWidth(q.wireframeLinewidth*he()),we.setMode(I.LINES)):we.setMode(I.TRIANGLES);else if(F.isLine){let It=q.linewidth;It===void 0&&(It=1),wt.setLineWidth(It*he()),F.isLineSegments?we.setMode(I.LINES):F.isLineLoop?we.setMode(I.LINE_LOOP):we.setMode(I.LINE_STRIP)}else F.isPoints?we.setMode(I.POINTS):F.isSprite&&we.setMode(I.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)Gr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),we.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(Ft.get("WEBGL_multi_draw"))we.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{let It=F._multiDrawStarts,Be=F._multiDrawCounts,le=F._multiDrawCount,ii=gt?C.get(gt).bytesPerElement:1,vr=Mt.get(q).currentProgram.getUniforms();for(let si=0;si<le;si++)vr.setValue(I,"_gl_DrawID",si),we.render(It[si]/ii,Be[si])}else if(F.isInstancedMesh)we.renderInstances(Jt,ze,F.count);else if(W.isInstancedBufferGeometry){let It=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,Be=Math.min(W.instanceCount,It);we.renderInstances(Jt,ze,Be)}else we.render(Jt,ze)};function Te(E,O,W){E.transparent===!0&&E.side===Kn&&E.forceSinglePass===!1?(E.side=yn,E.needsUpdate=!0,Cc(E,O,W),E.side=Is,E.needsUpdate=!0,Cc(E,O,W),E.side=Kn):Cc(E,O,W)}this.compile=function(E,O,W=null){W===null&&(W=E),p=Rt.get(W),p.init(O),b.push(p),W.traverseVisible(function(F){F.isLight&&F.layers.test(O.layers)&&(p.pushLight(F),F.castShadow&&p.pushShadow(F))}),E!==W&&E.traverseVisible(function(F){F.isLight&&F.layers.test(O.layers)&&(p.pushLight(F),F.castShadow&&p.pushShadow(F))}),p.setupLights();let q=new Set;return E.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;let ot=F.material;if(ot)if(Array.isArray(ot))for(let pt=0;pt<ot.length;pt++){let _t=ot[pt];Te(_t,W,F),q.add(_t)}else Te(ot,W,F),q.add(ot)}),p=b.pop(),q},this.compileAsync=function(E,O,W=null){let q=this.compile(E,O,W);return new Promise(F=>{function ot(){if(q.forEach(function(pt){Mt.get(pt).currentProgram.isReady()&&q.delete(pt)}),q.size===0){F(E);return}setTimeout(ot,10)}Ft.get("KHR_parallel_shader_compile")!==null?ot():setTimeout(ot,10)})};let ue=null;function Ms(E){ue&&ue(E)}function is(){Po.stop()}function S0(){Po.start()}let Po=new Yx;Po.setAnimationLoop(Ms),typeof self<"u"&&Po.setContext(self),this.setAnimationLoop=function(E){ue=E,at.setAnimationLoop(E),E===null?Po.stop():Po.start()},at.addEventListener("sessionstart",is),at.addEventListener("sessionend",S0),this.render=function(E,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),at.enabled===!0&&at.isPresenting===!0&&(at.cameraAutoUpdate===!0&&at.updateCamera(O),O=at.getCamera()),E.isScene===!0&&E.onBeforeRender(v,E,O,R),p=Rt.get(E,b.length),p.init(O),b.push(p),tt.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),Ee.setFromProjectionMatrix(tt,Hi,O.reversedDepth),K=this.localClippingEnabled,re=ct.init(this.clippingPlanes,K),m=j.get(E,x.length),m.init(),x.push(m),at.enabled===!0&&at.isPresenting===!0){let ot=v.xr.getDepthSensingMesh();ot!==null&&Sf(ot,O,-1/0,v.sortObjects)}Sf(E,O,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(lt,dt),yt=at.enabled===!1||at.isPresenting===!1||at.hasDepthSensing()===!1,yt&&Et.addToRenderList(m,E),this.info.render.frame++,re===!0&&ct.beginShadows();let W=p.state.shadowsArray;St.render(W,E,O),re===!0&&ct.endShadows(),this.info.autoReset===!0&&this.info.reset();let q=m.opaque,F=m.transmissive;if(p.setupLights(),O.isArrayCamera){let ot=O.cameras;if(F.length>0)for(let pt=0,_t=ot.length;pt<_t;pt++){let gt=ot[pt];T0(q,F,E,gt)}yt&&Et.render(E);for(let pt=0,_t=ot.length;pt<_t;pt++){let gt=ot[pt];E0(m,E,gt,gt.viewport)}}else F.length>0&&T0(q,F,E,O),yt&&Et.render(E),E0(m,E,O);R!==null&&A===0&&(Xt.updateMultisampleRenderTarget(R),Xt.updateRenderTargetMipmap(R)),E.isScene===!0&&E.onAfterRender(v,E,O),ft.resetDefaultState(),_=-1,w=null,b.pop(),b.length>0?(p=b[b.length-1],re===!0&&ct.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function Sf(E,O,W,q){if(E.visible===!1)return;if(E.layers.test(O.layers)){if(E.isGroup)W=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(O);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Ee.intersectsSprite(E)){q&&it.setFromMatrixPosition(E.matrixWorld).applyMatrix4(tt);let pt=$.update(E),_t=E.material;_t.visible&&m.push(E,pt,_t,W,it.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Ee.intersectsObject(E))){let pt=$.update(E),_t=E.material;if(q&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),it.copy(E.boundingSphere.center)):(pt.boundingSphere===null&&pt.computeBoundingSphere(),it.copy(pt.boundingSphere.center)),it.applyMatrix4(E.matrixWorld).applyMatrix4(tt)),Array.isArray(_t)){let gt=pt.groups;for(let Dt=0,Ot=gt.length;Dt<Ot;Dt++){let Pt=gt[Dt],Jt=_t[Pt.materialIndex];Jt&&Jt.visible&&m.push(E,pt,Jt,W,it.z,Pt)}}else _t.visible&&m.push(E,pt,_t,W,it.z,null)}}let ot=E.children;for(let pt=0,_t=ot.length;pt<_t;pt++)Sf(ot[pt],O,W,q)}function E0(E,O,W,q){let F=E.opaque,ot=E.transmissive,pt=E.transparent;p.setupLightsView(W),re===!0&&ct.setGlobalState(v.clippingPlanes,W),q&&wt.viewport(P.copy(q)),F.length>0&&Rc(F,O,W),ot.length>0&&Rc(ot,O,W),pt.length>0&&Rc(pt,O,W),wt.buffers.depth.setTest(!0),wt.buffers.depth.setMask(!0),wt.buffers.color.setMask(!0),wt.setPolygonOffset(!1)}function T0(E,O,W,q){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[q.id]===void 0&&(p.state.transmissionRenderTarget[q.id]=new us(1,1,{generateMipmaps:!0,type:Ft.has("EXT_color_buffer_half_float")||Ft.has("EXT_color_buffer_float")?ea:Gi,minFilter:fo,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:se.workingColorSpace}));let ot=p.state.transmissionRenderTarget[q.id],pt=q.viewport||P;ot.setSize(pt.z*v.transmissionResolutionScale,pt.w*v.transmissionResolutionScale);let _t=v.getRenderTarget(),gt=v.getActiveCubeFace(),Dt=v.getActiveMipmapLevel();v.setRenderTarget(ot),v.getClearColor(H),X=v.getClearAlpha(),X<1&&v.setClearColor(16777215,.5),v.clear(),yt&&Et.render(W);let Ot=v.toneMapping;v.toneMapping=Ns;let Pt=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),p.setupLightsView(q),re===!0&&ct.setGlobalState(v.clippingPlanes,q),Rc(E,W,q),Xt.updateMultisampleRenderTarget(ot),Xt.updateRenderTargetMipmap(ot),Ft.has("WEBGL_multisampled_render_to_texture")===!1){let Jt=!1;for(let xe=0,ze=O.length;xe<ze;xe++){let Ie=O[xe],we=Ie.object,It=Ie.geometry,Be=Ie.material,le=Ie.group;if(Be.side===Kn&&we.layers.test(q.layers)){let ii=Be.side;Be.side=yn,Be.needsUpdate=!0,A0(we,W,q,It,Be,le),Be.side=ii,Be.needsUpdate=!0,Jt=!0}}Jt===!0&&(Xt.updateMultisampleRenderTarget(ot),Xt.updateRenderTargetMipmap(ot))}v.setRenderTarget(_t,gt,Dt),v.setClearColor(H,X),Pt!==void 0&&(q.viewport=Pt),v.toneMapping=Ot}function Rc(E,O,W){let q=O.isScene===!0?O.overrideMaterial:null;for(let F=0,ot=E.length;F<ot;F++){let pt=E[F],_t=pt.object,gt=pt.geometry,Dt=pt.group,Ot=pt.material;Ot.allowOverride===!0&&q!==null&&(Ot=q),_t.layers.test(W.layers)&&A0(_t,O,W,gt,Ot,Dt)}}function A0(E,O,W,q,F,ot){E.onBeforeRender(v,O,W,q,F,ot),E.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),F.onBeforeRender(v,O,W,q,E,ot),F.transparent===!0&&F.side===Kn&&F.forceSinglePass===!1?(F.side=yn,F.needsUpdate=!0,v.renderBufferDirect(W,O,q,F,E,ot),F.side=Is,F.needsUpdate=!0,v.renderBufferDirect(W,O,q,F,E,ot),F.side=Kn):v.renderBufferDirect(W,O,q,F,E,ot),E.onAfterRender(v,O,W,q,F,ot)}function Cc(E,O,W){O.isScene!==!0&&(O=nt);let q=Mt.get(E),F=p.state.lights,ot=p.state.shadowsArray,pt=F.state.version,_t=Y.getParameters(E,F.state,ot,O,W),gt=Y.getProgramCacheKey(_t),Dt=q.programs;q.environment=E.isMeshStandardMaterial?O.environment:null,q.fog=O.fog,q.envMap=(E.isMeshStandardMaterial?We:un).get(E.envMap||q.environment),q.envMapRotation=q.environment!==null&&E.envMap===null?O.environmentRotation:E.envMapRotation,Dt===void 0&&(E.addEventListener("dispose",J),Dt=new Map,q.programs=Dt);let Ot=Dt.get(gt);if(Ot!==void 0){if(q.currentProgram===Ot&&q.lightsStateVersion===pt)return C0(E,_t),Ot}else _t.uniforms=Y.getUniforms(E),E.onBeforeCompile(_t,v),Ot=Y.acquireProgram(_t,gt),Dt.set(gt,Ot),q.uniforms=_t.uniforms;let Pt=q.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Pt.clippingPlanes=ct.uniform),C0(E,_t),q.needsLights=ZM(E),q.lightsStateVersion=pt,q.needsLights&&(Pt.ambientLightColor.value=F.state.ambient,Pt.lightProbe.value=F.state.probe,Pt.directionalLights.value=F.state.directional,Pt.directionalLightShadows.value=F.state.directionalShadow,Pt.spotLights.value=F.state.spot,Pt.spotLightShadows.value=F.state.spotShadow,Pt.rectAreaLights.value=F.state.rectArea,Pt.ltc_1.value=F.state.rectAreaLTC1,Pt.ltc_2.value=F.state.rectAreaLTC2,Pt.pointLights.value=F.state.point,Pt.pointLightShadows.value=F.state.pointShadow,Pt.hemisphereLights.value=F.state.hemi,Pt.directionalShadowMap.value=F.state.directionalShadowMap,Pt.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Pt.spotShadowMap.value=F.state.spotShadowMap,Pt.spotLightMatrix.value=F.state.spotLightMatrix,Pt.spotLightMap.value=F.state.spotLightMap,Pt.pointShadowMap.value=F.state.pointShadowMap,Pt.pointShadowMatrix.value=F.state.pointShadowMatrix),q.currentProgram=Ot,q.uniformsList=null,Ot}function R0(E){if(E.uniformsList===null){let O=E.currentProgram.getUniforms();E.uniformsList=aa.seqWithValue(O.seq,E.uniforms)}return E.uniformsList}function C0(E,O){let W=Mt.get(E);W.outputColorSpace=O.outputColorSpace,W.batching=O.batching,W.batchingColor=O.batchingColor,W.instancing=O.instancing,W.instancingColor=O.instancingColor,W.instancingMorph=O.instancingMorph,W.skinning=O.skinning,W.morphTargets=O.morphTargets,W.morphNormals=O.morphNormals,W.morphColors=O.morphColors,W.morphTargetsCount=O.morphTargetsCount,W.numClippingPlanes=O.numClippingPlanes,W.numIntersection=O.numClipIntersection,W.vertexAlphas=O.vertexAlphas,W.vertexTangents=O.vertexTangents,W.toneMapping=O.toneMapping}function YM(E,O,W,q,F){O.isScene!==!0&&(O=nt),Xt.resetTextureUnits();let ot=O.fog,pt=q.isMeshStandardMaterial?O.environment:null,_t=R===null?v.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:jo,gt=(q.isMeshStandardMaterial?We:un).get(q.envMap||pt),Dt=q.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Ot=!!W.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Pt=!!W.morphAttributes.position,Jt=!!W.morphAttributes.normal,xe=!!W.morphAttributes.color,ze=Ns;q.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(ze=v.toneMapping);let Ie=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,we=Ie!==void 0?Ie.length:0,It=Mt.get(q),Be=p.state.lights;if(re===!0&&(K===!0||E!==w)){let Un=E===w&&q.id===_;ct.setState(q,E,Un)}let le=!1;q.version===It.__version?(It.needsLights&&It.lightsStateVersion!==Be.state.version||It.outputColorSpace!==_t||F.isBatchedMesh&&It.batching===!1||!F.isBatchedMesh&&It.batching===!0||F.isBatchedMesh&&It.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&It.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&It.instancing===!1||!F.isInstancedMesh&&It.instancing===!0||F.isSkinnedMesh&&It.skinning===!1||!F.isSkinnedMesh&&It.skinning===!0||F.isInstancedMesh&&It.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&It.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&It.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&It.instancingMorph===!1&&F.morphTexture!==null||It.envMap!==gt||q.fog===!0&&It.fog!==ot||It.numClippingPlanes!==void 0&&(It.numClippingPlanes!==ct.numPlanes||It.numIntersection!==ct.numIntersection)||It.vertexAlphas!==Dt||It.vertexTangents!==Ot||It.morphTargets!==Pt||It.morphNormals!==Jt||It.morphColors!==xe||It.toneMapping!==ze||It.morphTargetsCount!==we)&&(le=!0):(le=!0,It.__version=q.version);let ii=It.currentProgram;le===!0&&(ii=Cc(q,O,F));let vr=!1,si=!1,Oa=!1,He=ii.getUniforms(),mi=It.uniforms;if(wt.useProgram(ii.program)&&(vr=!0,si=!0,Oa=!0),q.id!==_&&(_=q.id,si=!0),vr||w!==E){wt.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),He.setValue(I,"projectionMatrix",E.projectionMatrix),He.setValue(I,"viewMatrix",E.matrixWorldInverse);let Gn=He.map.cameraPosition;Gn!==void 0&&Gn.setValue(I,Q.setFromMatrixPosition(E.matrixWorld)),Ut.logarithmicDepthBuffer&&He.setValue(I,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&He.setValue(I,"isOrthographic",E.isOrthographicCamera===!0),w!==E&&(w=E,si=!0,Oa=!0)}if(F.isSkinnedMesh){He.setOptional(I,F,"bindMatrix"),He.setOptional(I,F,"bindMatrixInverse");let Un=F.skeleton;Un&&(Un.boneTexture===null&&Un.computeBoneTexture(),He.setValue(I,"boneTexture",Un.boneTexture,Xt))}F.isBatchedMesh&&(He.setOptional(I,F,"batchingTexture"),He.setValue(I,"batchingTexture",F._matricesTexture,Xt),He.setOptional(I,F,"batchingIdTexture"),He.setValue(I,"batchingIdTexture",F._indirectTexture,Xt),He.setOptional(I,F,"batchingColorTexture"),F._colorsTexture!==null&&He.setValue(I,"batchingColorTexture",F._colorsTexture,Xt));let gi=W.morphAttributes;if((gi.position!==void 0||gi.normal!==void 0||gi.color!==void 0)&&rt.update(F,W,ii),(si||It.receiveShadow!==F.receiveShadow)&&(It.receiveShadow=F.receiveShadow,He.setValue(I,"receiveShadow",F.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(mi.envMap.value=gt,mi.flipEnvMap.value=gt.isCubeTexture&&gt.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&O.environment!==null&&(mi.envMapIntensity.value=O.environmentIntensity),si&&(He.setValue(I,"toneMappingExposure",v.toneMappingExposure),It.needsLights&&KM(mi,Oa),ot&&q.fog===!0&&et.refreshFogUniforms(mi,ot),et.refreshMaterialUniforms(mi,q,V,Z,p.state.transmissionRenderTarget[E.id]),aa.upload(I,R0(It),mi,Xt)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(aa.upload(I,R0(It),mi,Xt),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&He.setValue(I,"center",F.center),He.setValue(I,"modelViewMatrix",F.modelViewMatrix),He.setValue(I,"normalMatrix",F.normalMatrix),He.setValue(I,"modelMatrix",F.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){let Un=q.uniformsGroups;for(let Gn=0,Ef=Un.length;Gn<Ef;Gn++){let Io=Un[Gn];Gt.update(Io,ii),Gt.bind(Io,ii)}}return ii}function KM(E,O){E.ambientLightColor.needsUpdate=O,E.lightProbe.needsUpdate=O,E.directionalLights.needsUpdate=O,E.directionalLightShadows.needsUpdate=O,E.pointLights.needsUpdate=O,E.pointLightShadows.needsUpdate=O,E.spotLights.needsUpdate=O,E.spotLightShadows.needsUpdate=O,E.rectAreaLights.needsUpdate=O,E.hemisphereLights.needsUpdate=O}function ZM(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(E,O,W){let q=Mt.get(E);q.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),Mt.get(E.texture).__webglTexture=O,Mt.get(E.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:W,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,O){let W=Mt.get(E);W.__webglFramebuffer=O,W.__useDefaultFramebuffer=O===void 0};let JM=I.createFramebuffer();this.setRenderTarget=function(E,O=0,W=0){R=E,S=O,A=W;let q=!0,F=null,ot=!1,pt=!1;if(E){let gt=Mt.get(E);if(gt.__useDefaultFramebuffer!==void 0)wt.bindFramebuffer(I.FRAMEBUFFER,null),q=!1;else if(gt.__webglFramebuffer===void 0)Xt.setupRenderTarget(E);else if(gt.__hasExternalTextures)Xt.rebindTextures(E,Mt.get(E.texture).__webglTexture,Mt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let Pt=E.depthTexture;if(gt.__boundDepthTexture!==Pt){if(Pt!==null&&Mt.has(Pt)&&(E.width!==Pt.image.width||E.height!==Pt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Xt.setupDepthRenderbuffer(E)}}let Dt=E.texture;(Dt.isData3DTexture||Dt.isDataArrayTexture||Dt.isCompressedArrayTexture)&&(pt=!0);let Ot=Mt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ot[O])?F=Ot[O][W]:F=Ot[O],ot=!0):E.samples>0&&Xt.useMultisampledRTT(E)===!1?F=Mt.get(E).__webglMultisampledFramebuffer:Array.isArray(Ot)?F=Ot[W]:F=Ot,P.copy(E.viewport),D.copy(E.scissor),U=E.scissorTest}else P.copy(bt).multiplyScalar(V).floor(),D.copy(qt).multiplyScalar(V).floor(),U=ee;if(W!==0&&(F=JM),wt.bindFramebuffer(I.FRAMEBUFFER,F)&&q&&wt.drawBuffers(E,F),wt.viewport(P),wt.scissor(D),wt.setScissorTest(U),ot){let gt=Mt.get(E.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+O,gt.__webglTexture,W)}else if(pt){let gt=O;for(let Dt=0;Dt<E.textures.length;Dt++){let Ot=Mt.get(E.textures[Dt]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Dt,Ot.__webglTexture,W,gt)}}else if(E!==null&&W!==0){let gt=Mt.get(E.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,gt.__webglTexture,W)}_=-1},this.readRenderTargetPixels=function(E,O,W,q,F,ot,pt,_t=0){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let gt=Mt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&pt!==void 0&&(gt=gt[pt]),gt){wt.bindFramebuffer(I.FRAMEBUFFER,gt);try{let Dt=E.textures[_t],Ot=Dt.format,Pt=Dt.type;if(!Ut.textureFormatReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ut.textureTypeReadable(Pt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=E.width-q&&W>=0&&W<=E.height-F&&(E.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+_t),I.readPixels(O,W,q,F,Tt.convert(Ot),Tt.convert(Pt),ot))}finally{let Dt=R!==null?Mt.get(R).__webglFramebuffer:null;wt.bindFramebuffer(I.FRAMEBUFFER,Dt)}}},this.readRenderTargetPixelsAsync=async function(E,O,W,q,F,ot,pt,_t=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let gt=Mt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&pt!==void 0&&(gt=gt[pt]),gt)if(O>=0&&O<=E.width-q&&W>=0&&W<=E.height-F){wt.bindFramebuffer(I.FRAMEBUFFER,gt);let Dt=E.textures[_t],Ot=Dt.format,Pt=Dt.type;if(!Ut.textureFormatReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ut.textureTypeReadable(Pt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Jt=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Jt),I.bufferData(I.PIXEL_PACK_BUFFER,ot.byteLength,I.STREAM_READ),E.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+_t),I.readPixels(O,W,q,F,Tt.convert(Ot),Tt.convert(Pt),0);let xe=R!==null?Mt.get(R).__webglFramebuffer:null;wt.bindFramebuffer(I.FRAMEBUFFER,xe);let ze=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await wx(I,ze,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Jt),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,ot),I.deleteBuffer(Jt),I.deleteSync(ze),ot}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,O=null,W=0){let q=Math.pow(2,-W),F=Math.floor(E.image.width*q),ot=Math.floor(E.image.height*q),pt=O!==null?O.x:0,_t=O!==null?O.y:0;Xt.setTexture2D(E,0),I.copyTexSubImage2D(I.TEXTURE_2D,W,0,0,pt,_t,F,ot),wt.unbindTexture()};let QM=I.createFramebuffer(),tS=I.createFramebuffer();this.copyTextureToTexture=function(E,O,W=null,q=null,F=0,ot=null){ot===null&&(F!==0?(Gr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ot=F,F=0):ot=0);let pt,_t,gt,Dt,Ot,Pt,Jt,xe,ze,Ie=E.isCompressedTexture?E.mipmaps[ot]:E.image;if(W!==null)pt=W.max.x-W.min.x,_t=W.max.y-W.min.y,gt=W.isBox3?W.max.z-W.min.z:1,Dt=W.min.x,Ot=W.min.y,Pt=W.isBox3?W.min.z:0;else{let gi=Math.pow(2,-F);pt=Math.floor(Ie.width*gi),_t=Math.floor(Ie.height*gi),E.isDataArrayTexture?gt=Ie.depth:E.isData3DTexture?gt=Math.floor(Ie.depth*gi):gt=1,Dt=0,Ot=0,Pt=0}q!==null?(Jt=q.x,xe=q.y,ze=q.z):(Jt=0,xe=0,ze=0);let we=Tt.convert(O.format),It=Tt.convert(O.type),Be;O.isData3DTexture?(Xt.setTexture3D(O,0),Be=I.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(Xt.setTexture2DArray(O,0),Be=I.TEXTURE_2D_ARRAY):(Xt.setTexture2D(O,0),Be=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,O.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,O.unpackAlignment);let le=I.getParameter(I.UNPACK_ROW_LENGTH),ii=I.getParameter(I.UNPACK_IMAGE_HEIGHT),vr=I.getParameter(I.UNPACK_SKIP_PIXELS),si=I.getParameter(I.UNPACK_SKIP_ROWS),Oa=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,Ie.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Ie.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Dt),I.pixelStorei(I.UNPACK_SKIP_ROWS,Ot),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Pt);let He=E.isDataArrayTexture||E.isData3DTexture,mi=O.isDataArrayTexture||O.isData3DTexture;if(E.isDepthTexture){let gi=Mt.get(E),Un=Mt.get(O),Gn=Mt.get(gi.__renderTarget),Ef=Mt.get(Un.__renderTarget);wt.bindFramebuffer(I.READ_FRAMEBUFFER,Gn.__webglFramebuffer),wt.bindFramebuffer(I.DRAW_FRAMEBUFFER,Ef.__webglFramebuffer);for(let Io=0;Io<gt;Io++)He&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Mt.get(E).__webglTexture,F,Pt+Io),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Mt.get(O).__webglTexture,ot,ze+Io)),I.blitFramebuffer(Dt,Ot,pt,_t,Jt,xe,pt,_t,I.DEPTH_BUFFER_BIT,I.NEAREST);wt.bindFramebuffer(I.READ_FRAMEBUFFER,null),wt.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(F!==0||E.isRenderTargetTexture||Mt.has(E)){let gi=Mt.get(E),Un=Mt.get(O);wt.bindFramebuffer(I.READ_FRAMEBUFFER,QM),wt.bindFramebuffer(I.DRAW_FRAMEBUFFER,tS);for(let Gn=0;Gn<gt;Gn++)He?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,gi.__webglTexture,F,Pt+Gn):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,gi.__webglTexture,F),mi?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Un.__webglTexture,ot,ze+Gn):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Un.__webglTexture,ot),F!==0?I.blitFramebuffer(Dt,Ot,pt,_t,Jt,xe,pt,_t,I.COLOR_BUFFER_BIT,I.NEAREST):mi?I.copyTexSubImage3D(Be,ot,Jt,xe,ze+Gn,Dt,Ot,pt,_t):I.copyTexSubImage2D(Be,ot,Jt,xe,Dt,Ot,pt,_t);wt.bindFramebuffer(I.READ_FRAMEBUFFER,null),wt.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else mi?E.isDataTexture||E.isData3DTexture?I.texSubImage3D(Be,ot,Jt,xe,ze,pt,_t,gt,we,It,Ie.data):O.isCompressedArrayTexture?I.compressedTexSubImage3D(Be,ot,Jt,xe,ze,pt,_t,gt,we,Ie.data):I.texSubImage3D(Be,ot,Jt,xe,ze,pt,_t,gt,we,It,Ie):E.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,ot,Jt,xe,pt,_t,we,It,Ie.data):E.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,ot,Jt,xe,Ie.width,Ie.height,we,Ie.data):I.texSubImage2D(I.TEXTURE_2D,ot,Jt,xe,pt,_t,we,It,Ie);I.pixelStorei(I.UNPACK_ROW_LENGTH,le),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ii),I.pixelStorei(I.UNPACK_SKIP_PIXELS,vr),I.pixelStorei(I.UNPACK_SKIP_ROWS,si),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Oa),ot===0&&O.generateMipmaps&&I.generateMipmap(Be),wt.unbindTexture()},this.initRenderTarget=function(E){Mt.get(E).__webglFramebuffer===void 0&&Xt.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?Xt.setTextureCube(E,0):E.isData3DTexture?Xt.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?Xt.setTexture2DArray(E,0):Xt.setTexture2D(E,0),wt.unbindTexture()},this.resetState=function(){S=0,A=0,R=null,wt.reset(),ft.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Hi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let n=this.getContext();n.drawingBufferColorSpace=se._getDrawingBufferColorSpace(t),n.unpackColorSpace=se._getUnpackColorSpace()}};var t_={type:"change"},fm={type:"start"},n_={type:"end"},Id=new Yo,e_=new vi,G2=Math.cos(70*Us.DEG2RAD),sn=new L,Zn=2*Math.PI,be={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},hm=1e-6,Ld=class extends vl{constructor(t,n=null){super(t,n),this.state=be.NONE,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Si.ROTATE,MIDDLE:Si.DOLLY,RIGHT:Si.PAN},this.touches={ONE:Vi.ROTATE,TWO:Vi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new wi,this._lastTargetPosition=new L,this._quat=new wi().setFromUnitVectors(t.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Qr,this._sphericalDelta=new Qr,this._scale=1,this._panOffset=new L,this._rotateStart=new At,this._rotateEnd=new At,this._rotateDelta=new At,this._panStart=new At,this._panEnd=new At,this._panDelta=new At,this._dollyStart=new At,this._dollyEnd=new At,this._dollyDelta=new At,this._dollyDirection=new L,this._mouse=new At,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=q2.bind(this),this._onPointerDown=W2.bind(this),this._onPointerUp=X2.bind(this),this._onContextMenu=tC.bind(this),this._onMouseWheel=K2.bind(this),this._onKeyDown=Z2.bind(this),this._onTouchStart=J2.bind(this),this._onTouchMove=Q2.bind(this),this._onMouseDown=j2.bind(this),this._onMouseMove=Y2.bind(this),this._interceptControlDown=eC.bind(this),this._interceptControlUp=nC.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(t_),this.update(),this.state=be.NONE}update(t=null){let n=this.object.position;sn.copy(n).sub(this.target),sn.applyQuaternion(this._quat),this._spherical.setFromVector3(sn),this.autoRotate&&this.state===be.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Zn:i>Math.PI&&(i-=Zn),s<-Math.PI?s+=Zn:s>Math.PI&&(s-=Zn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let o=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),o=a!=this._spherical.radius}if(sn.setFromSpherical(this._spherical),sn.applyQuaternion(this._quatInverse),n.copy(this.target).add(sn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){let r=sn.length();a=this._clampDistance(r*this._scale);let c=r-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),o=!!c}else if(this.object.isOrthographicCamera){let r=new L(this._mouse.x,this._mouse.y,0);r.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),o=c!==this.object.zoom;let l=new L(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(r),this.object.updateMatrixWorld(),a=sn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Id.origin.copy(this.object.position),Id.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Id.direction))<G2?this.object.lookAt(this.target):(e_.setFromNormalAndCoplanarPoint(this.object.up,this.target),Id.intersectPlane(e_,this.target))))}else if(this.object.isOrthographicCamera){let a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),o=!0)}return this._scale=1,this._performCursorZoom=!1,o||this._lastPosition.distanceToSquared(this.object.position)>hm||8*(1-this._lastQuaternion.dot(this.object.quaternion))>hm||this._lastTargetPosition.distanceToSquared(this.target)>hm?(this.dispatchEvent(t_),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Zn/60*this.autoRotateSpeed*t:Zn/60/60*this.autoRotateSpeed}_getZoomScale(t){let n=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,n){sn.setFromMatrixColumn(n,0),sn.multiplyScalar(-t),this._panOffset.add(sn)}_panUp(t,n){this.screenSpacePanning===!0?sn.setFromMatrixColumn(n,1):(sn.setFromMatrixColumn(n,0),sn.crossVectors(this.object.up,sn)),sn.multiplyScalar(t),this._panOffset.add(sn)}_pan(t,n){let i=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;sn.copy(s).sub(this.target);let o=sn.length();o*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*o/i.clientHeight,this.object.matrix),this._panUp(2*n*o/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),s=t-i.left,o=n-i.top,a=i.width,r=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(o/r)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let n=this.domElement;this._rotateLeft(Zn*this._rotateDelta.x/n.clientHeight),this._rotateUp(Zn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let n=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(Zn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-Zn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(Zn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-Zn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),i=.5*(t.pageX+n.x),s=.5*(t.pageY+n.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),i=.5*(t.pageX+n.x),s=.5*(t.pageY+n.y);this._panStart.set(i,s)}}_handleTouchStartDolly(t){let n=this._getSecondPointerPosition(t),i=t.pageX-n.x,s=t.pageY-n.y,o=Math.sqrt(i*i+s*s);this._dollyStart.set(0,o)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),o=.5*(t.pageY+i.y);this._rotateEnd.set(s,o)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let n=this.domElement;this._rotateLeft(Zn*this._rotateDelta.x/n.clientHeight),this._rotateUp(Zn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),i=.5*(t.pageX+n.x),s=.5*(t.pageY+n.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let n=this._getSecondPointerPosition(t),i=t.pageX-n.x,s=t.pageY-n.y,o=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,o),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(t.pageX+n.x)*.5,r=(t.pageY+n.y)*.5;this._updateZoomParameters(a,r)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==t.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(t){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==t.pointerId)return!0;return!1}_trackPointer(t){let n=this._pointerPositions[t.pointerId];n===void 0&&(n=new At,this._pointerPositions[t.pointerId]=n),n.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let n=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(t){let n=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function W2(e){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(e.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(e)&&(this._addPointer(e),e.pointerType==="touch"?this._onTouchStart(e):this._onMouseDown(e)))}function q2(e){this.enabled!==!1&&(e.pointerType==="touch"?this._onTouchMove(e):this._onMouseMove(e))}function X2(e){switch(this._removePointer(e),this._pointers.length){case 0:this.domElement.releasePointerCapture(e.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(n_),this.state=be.NONE;break;case 1:let t=this._pointers[0],n=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:n.x,pageY:n.y});break}}function j2(e){let t;switch(e.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Si.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(e),this.state=be.DOLLY;break;case Si.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=be.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=be.ROTATE}break;case Si.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=be.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=be.PAN}break;default:this.state=be.NONE}this.state!==be.NONE&&this.dispatchEvent(fm)}function Y2(e){switch(this.state){case be.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(e);break;case be.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(e);break;case be.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(e);break}}function K2(e){this.enabled===!1||this.enableZoom===!1||this.state!==be.NONE||(e.preventDefault(),this.dispatchEvent(fm),this._handleMouseWheel(this._customWheelEvent(e)),this.dispatchEvent(n_))}function Z2(e){this.enabled!==!1&&this._handleKeyDown(e)}function J2(e){switch(this._trackPointer(e),this._pointers.length){case 1:switch(this.touches.ONE){case Vi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(e),this.state=be.TOUCH_ROTATE;break;case Vi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(e),this.state=be.TOUCH_PAN;break;default:this.state=be.NONE}break;case 2:switch(this.touches.TWO){case Vi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(e),this.state=be.TOUCH_DOLLY_PAN;break;case Vi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(e),this.state=be.TOUCH_DOLLY_ROTATE;break;default:this.state=be.NONE}break;default:this.state=be.NONE}this.state!==be.NONE&&this.dispatchEvent(fm)}function Q2(e){switch(this._trackPointer(e),this.state){case be.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(e),this.update();break;case be.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(e),this.update();break;case be.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(e),this.update();break;case be.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(e),this.update();break;default:this.state=be.NONE}}function tC(e){this.enabled!==!1&&e.preventDefault()}function eC(e){e.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function nC(e){e.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Dd=class extends Ko{constructor(){super();let t=new fn;t.deleteAttribute("uv");let n=new _e({side:yn}),i=new _e,s=new xl(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let o=new G(t,n);o.position.set(-.757,13.219,.717),o.scale.set(31.713,28.305,28.591),this.add(o);let a=new al(t,i,6),r=new Je;r.position.set(-10.906,2.009,1.846),r.rotation.set(0,-.195,0),r.scale.set(2.328,7.905,4.651),r.updateMatrix(),a.setMatrixAt(0,r.matrix),r.position.set(-5.607,-.754,-.758),r.rotation.set(0,.994,0),r.scale.set(1.97,1.534,3.955),r.updateMatrix(),a.setMatrixAt(1,r.matrix),r.position.set(6.167,.857,7.803),r.rotation.set(0,.561,0),r.scale.set(3.927,6.285,3.687),r.updateMatrix(),a.setMatrixAt(2,r.matrix),r.position.set(-2.017,.018,6.124),r.rotation.set(0,.333,0),r.scale.set(2.002,4.566,2.064),r.updateMatrix(),a.setMatrixAt(3,r.matrix),r.position.set(2.291,-.756,-2.621),r.rotation.set(0,-.286,0),r.scale.set(1.546,1.552,1.496),r.updateMatrix(),a.setMatrixAt(4,r.matrix),r.position.set(-2.193,-.369,-5.547),r.rotation.set(0,.516,0),r.scale.set(3.875,3.487,2.986),r.updateMatrix(),a.setMatrixAt(5,r.matrix),this.add(a);let c=new G(t,ua(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);let l=new G(t,ua(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);let u=new G(t,ua(17));u.position.set(14.904,12.198,-1.832),u.scale.set(.15,4.265,6.331),this.add(u);let d=new G(t,ua(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let h=new G(t,ua(20));h.position.set(3.235,11.486,-12.541),h.scale.set(2.5,2,.1),this.add(h);let f=new G(t,ua(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let t=new Set;this.traverse(n=>{n.isMesh&&(t.add(n.geometry),t.add(n.material))});for(let n of t)n.dispose()}};function ua(e){return new ml({color:0,emissive:16777215,emissiveIntensity:e})}var Cl=class extends Je{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new At(.5,.5),this.addEventListener("removed",function(){this.traverse(function(n){n.element instanceof n.element.ownerDocument.defaultView.Element&&n.element.parentNode!==null&&n.element.remove()})})}copy(t,n){return super.copy(t,n),this.element=t.element.cloneNode(!0),this.center=t.center,this}},da=new L,i_=new me,s_=new me,o_=new L,r_=new L,Nd=class{constructor(t={}){let n=this,i,s,o,a,r={objects:new WeakMap},c=t.element!==void 0?t.element:document.createElement("div");c.style.overflow="hidden",this.domElement=c,this.getSize=function(){return{width:i,height:s}},this.render=function(g,y){g.matrixWorldAutoUpdate===!0&&g.updateMatrixWorld(),y.parent===null&&y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),i_.copy(y.matrixWorldInverse),s_.multiplyMatrices(y.projectionMatrix,i_),u(g,g,y),f(g)},this.setSize=function(g,y){i=g,s=y,o=i/2,a=s/2,c.style.width=g+"px",c.style.height=y+"px"};function l(g){g.isCSS2DObject&&(g.element.style.display="none");for(let y=0,m=g.children.length;y<m;y++)l(g.children[y])}function u(g,y,m){if(g.visible===!1){l(g);return}if(g.isCSS2DObject){da.setFromMatrixPosition(g.matrixWorld),da.applyMatrix4(s_);let p=da.z>=-1&&da.z<=1&&g.layers.test(m.layers)===!0,x=g.element;x.style.display=p===!0?"":"none",p===!0&&(g.onBeforeRender(n,y,m),x.style.transform="translate("+-100*g.center.x+"%,"+-100*g.center.y+"%)translate("+(da.x*o+o)+"px,"+(-da.y*a+a)+"px)",x.parentNode!==c&&c.appendChild(x),g.onAfterRender(n,y,m));let b={distanceToCameraSquared:d(m,g)};r.objects.set(g,b)}for(let p=0,x=g.children.length;p<x;p++)u(g.children[p],y,m)}function d(g,y){return o_.setFromMatrixPosition(g.matrixWorld),r_.setFromMatrixPosition(y.matrixWorld),o_.distanceToSquared(r_)}function h(g){let y=[];return g.traverseVisible(function(m){m.isCSS2DObject&&y.push(m)}),y}function f(g){let y=h(g).sort(function(p,x){if(p.renderOrder!==x.renderOrder)return x.renderOrder-p.renderOrder;let b=r.objects.get(p).distanceToCameraSquared,v=r.objects.get(x).distanceToCameraSquared;return b-v}),m=y.length;for(let p=0,x=y.length;p<x;p++)y[p].element.style.zIndex=m-p}}};var kl=new L;function Ti(e,t,n,i,s,o){let a=2*Math.PI*s/4,r=Math.max(o-2*s,0),c=Math.PI/4;kl.copy(t),kl[i]=0,kl.normalize();let l=.5*a/(a+r),u=1-kl.angleTo(e)/c;return Math.sign(kl[n])===1?u*l:r/(a+r)+l+l*(1-u)}var ha=class e extends fn{constructor(t=1,n=1,i=1,s=2,o=.1){let a=s*2+1;if(o=Math.min(t/2,n/2,i/2,o),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:n,depth:i,segments:s,radius:o},a===1)return;let r=this.toNonIndexed();this.index=null,this.attributes.position=r.attributes.position,this.attributes.normal=r.attributes.normal,this.attributes.uv=r.attributes.uv;let c=new L,l=new L,u=new L(t,n,i).divideScalar(2).subScalar(o),d=this.attributes.position.array,h=this.attributes.normal.array,f=this.attributes.uv.array,g=d.length/6,y=new L,m=.5/a;for(let p=0,x=0;p<d.length;p+=3,x+=2)switch(c.fromArray(d,p),l.copy(c),l.x-=Math.sign(l.x)*m,l.y-=Math.sign(l.y)*m,l.z-=Math.sign(l.z)*m,l.normalize(),d[p+0]=u.x*Math.sign(c.x)+l.x*o,d[p+1]=u.y*Math.sign(c.y)+l.y*o,d[p+2]=u.z*Math.sign(c.z)+l.z*o,h[p+0]=l.x,h[p+1]=l.y,h[p+2]=l.z,Math.floor(p/g)){case 0:y.set(1,0,0),f[x+0]=Ti(y,l,"z","y",o,i),f[x+1]=1-Ti(y,l,"y","z",o,n);break;case 1:y.set(-1,0,0),f[x+0]=1-Ti(y,l,"z","y",o,i),f[x+1]=1-Ti(y,l,"y","z",o,n);break;case 2:y.set(0,1,0),f[x+0]=1-Ti(y,l,"x","z",o,t),f[x+1]=Ti(y,l,"z","x",o,i);break;case 3:y.set(0,-1,0),f[x+0]=1-Ti(y,l,"x","z",o,t),f[x+1]=1-Ti(y,l,"z","x",o,i);break;case 4:y.set(0,0,1),f[x+0]=1-Ti(y,l,"x","y",o,t),f[x+1]=1-Ti(y,l,"y","x",o,n);break;case 5:y.set(0,0,-1),f[x+0]=Ti(y,l,"x","y",o,t),f[x+1]=1-Ti(y,l,"y","x",o,n);break}}static fromJSON(t){return new e(t.width,t.height,t.depth,t.segments,t.radius)}};var pm=(e,t,n)=>t!=null&&e>=t&&e-t<n;function a_(e,t,n={kind:null,k:0}){if(n.kind=null,n.k=0,t.asleep)return n;if(pm(e,t.perkAt,1.4))return Pl(n,"perk",(e-t.perkAt)/1.4);if(pm(e,t.sulkAt,3))return Pl(n,"sulk",(e-t.sulkAt)/3);if(pm(e,t.cheerAt,1.6))return Pl(n,"cheer",(e-t.cheerAt)/1.6);if(t.thinking)return Pl(n,"think",e%1.2/1.2);if(t.idleFor>=20){let i=(e+(t.seed??0)*7)%28;if(i<2.4)return Pl(n,"yawn",i/2.4)}return n}function Pl(e,t,n){return e.kind=t,e.k=n,e}function l_(e,t=.15,n=.3){if(e<=0||e>=1)return 0;let i=e<t?e/t:e>1-n?(1-e)/n:1;return i*i*(3-2*i)}var mm=new Map,iC=new Yn(1,12,10),sC=new _e({color:"#fbf6ec",roughness:.5});function Ai(e,t,n,i=.08){let s=`${e}|${t}|${n}|${i}`;return mm.has(s)||mm.set(s,new ha(e,t,n,4,Math.min(i,e/2,t/2,n/2))),mm.get(s)}var c_={session:{w:2.1,h:1.05,d:1.15,legs:4,legH:.7,eye:[.24,.3],crown:"gem"},"general-purpose":{w:1.9,h:.95,d:1,legs:4,legH:.62,eye:[.22,.28],crown:"none"},Explore:{w:2.1,h:.8,d:1,legs:4,legH:.5,eye:[.28,.24],crown:"periscope"},Plan:{w:1.6,h:1.3,d:1,legs:2,legH:.6,eye:[.2,.26],crown:"cap"},"code-reviewer":{w:1.9,h:1,d:1,legs:4,legH:.58,eye:[.2,.22],crown:"glasses"},"test-runner":{w:2,h:.85,d:.95,legs:6,legH:.55,eye:[.2,.26],crown:"antennae"}};function gm({build:e="general-purpose",bodyColor:t,inkColor:n,accentColor:i,pick:s}){let o=c_[e]??c_["general-purpose"],a=new Bt,r=new Bt;a.add(r);let c=new _e({color:t,roughness:.42}),l=new _e({color:n,roughness:.2}),u=new _e({color:i,roughness:.3}),d=[],h=Math.min(.26,o.w*.8/(o.legs*1.6));for(let S=0;S<o.legs;S++){let A=(S-(o.legs-1)/2)*(o.w*.78/Math.max(1,o.legs-1)),R=new G(Ai(h,o.legH+.1,o.d*.3,.04),c);R.position.set(o.legs===2?A*.7:A,o.legH/2,0),R.userData.phase=S%2?Math.PI:0,d.push(R)}let f=new Bt;f.position.y=o.legH;let g=new G(Ai(o.w,o.h,o.d,.14),c);g.position.y=o.h/2;let y=[-1,1].map(S=>{let A=new Bt;A.position.set(S*(o.w/2),o.h*.58,0);let R=new G(Ai(.42,.32,o.d*.42,.06),c);return R.position.x=S*.19,A.add(R),A.userData.side=S,A}),[m,p]=o.eye,x=[-1,1].map(S=>{let A=new G(Ai(m,p,.06,.02),l);return A.position.set(S*o.w*.25,o.h*.64,o.d/2+.01),A});f.add(g,...y,...x);let b=null,v=o.legH+o.h;if(o.crown==="gem")b=new G(new fl(.2,0),new _e({color:i,emissive:i,emissiveIntensity:.2,roughness:.3,flatShading:!0})),b.position.y=o.h+.55,b.scale.y=1.35,f.add(b),v+=.95;else if(o.crown==="periscope"){let S=new G(Ai(.12,.5,.12,.04),l);S.position.set(o.w*.28,o.h+.25,0);let A=new G(Ai(.3,.2,.3,.06),u);A.position.set(o.w*.28,o.h+.58,.05),f.add(S,A),v+=.7}else if(o.crown==="cap"){let S=new G(Ai(o.w*.9,.14,o.d*1.05,.04),u);S.position.y=o.h+.07;let A=new G(Ai(o.w*.6,.06,.4,.03),u);A.position.set(0,o.h+.03,o.d/2+.15),f.add(S,A),v+=.15}else if(o.crown==="glasses"){for(let A of[-1,1]){let R=new G(Ai(m+.16,p+.14,.05,.03),u);R.position.set(A*o.w*.25,o.h*.64,o.d/2+.005),f.add(R)}let S=new G(Ai(o.w*.2,.05,.05,.02),u);S.position.set(0,o.h*.68,o.d/2+.02),f.add(S);for(let A of x)A.position.z+=.03}else if(o.crown==="antennae"){for(let S of[-1,1]){let A=new G(Ai(.08,.36,.08,.03),l);A.position.set(S*o.w*.2,o.h+.16,0),A.rotation.z=-S*.35;let R=new G(Ai(.16,.16,.16,.05),u);R.position.set(S*(o.w*.2+.12),o.h+.36,0),f.add(A,R)}v+=.45}let T=new Bt;T.position.set(o.w*.42,o.h+.25,0),T.visible=!1,[.13,.18,.24].forEach((S,A)=>{let R=new G(iC,sC);R.scale.setScalar(S),R.position.set(A*.22,A*.3,0),R.userData.r=S,T.add(R)}),f.add(T),r.add(f,...d),a.traverse(S=>{S.isMesh&&(S.castShadow=S.parent!==T,s&&(S.userData.pick=s))});for(let S of x)S.castShadow=!1;return{root:a,rig:r,top:f,eyes:x,arms:y,legs:d,bulb:b,bodyMat:c,inkMat:l,accentMat:u,height:v,dots:T,seed:Math.random()*10,blinkAt:1+Math.random()*3}}function Ud(e,t,{busy:n=0,look:i=0,hop:s=0,alarm:o=!1,asleep:a=!1}={}){let r=Math.sin(t*(a?.9:2)+e.seed)*.02,c=Math.sin(Math.min(1,s)*Math.PI)*.5;e.rig.position.y=c,e.top.scale.set(1+r*.5,1-r,1+r*.5),e.top.position.y=e.legs[0].position.y*2+n*Math.abs(Math.sin(t*8+e.seed))*.06,e.rig.rotation.y+=(i-e.rig.rotation.y)*.08,e.top.rotation.z=n*Math.sin(t*4+e.seed)*.04;for(let u of e.legs)u.rotation.x=n*Math.sin(t*14+u.userData.phase)*.35,u.scale.y=1-c*.4;for(let u of e.arms){let d=u.userData.side,h=n*Math.sin(t*9+e.seed+(d>0?Math.PI:0))*.35;u.rotation.z=d*(o?1.1+Math.sin(t*7)*.2:h+c*.7)}t>e.blinkAt+.14&&(e.blinkAt=t+2+Math.random()*4);let l=a||t>e.blinkAt&&t<e.blinkAt+.14;for(let u of e.eyes)u.scale.y=l?.15:1;e.bulb&&(e.bulb.rotation.y=t*(.6+n*2.4),e.bulb.position.y=e.bulb.userData.y??=e.bulb.position.y,e.bulb.position.y+=Math.sin(t*2+e.seed)*.06,e.bulb.material.emissiveIntensity=.15+n*(.55+.35*Math.sin(t*8)))}function Od(e,t,n,i=!1){let s=n?.kind;e.dots.visible=s==="think",e.top.rotation.x=0;for(let r of e.eyes)r.scale.x=1;if(!s)return;let o=n.k;if(s==="think"){e.dots.children.forEach((r,c)=>r.scale.setScalar(r.userData.r*(i?1:1+.35*Math.max(0,Math.sin((o-c/3)*Math.PI*2)))));return}let a=l_(o);if(s==="cheer"){for(let r of e.arms)r.rotation.z=r.userData.side*(1.25+(i?0:Math.sin(t*18)*.2))*a;for(let r of e.eyes)r.scale.y=1-.55*a;i||(e.rig.position.y+=Math.abs(Math.sin(o*Math.PI*3))*.35*a)}else if(s==="sulk"){e.top.rotation.x=.28*a,e.top.position.y-=.08*a;for(let r of e.arms)r.rotation.z=r.userData.side*-.15*a;for(let r of e.eyes)r.scale.y=Math.min(r.scale.y,1-.55*a)}else if(s==="perk"){e.top.rotation.x=-.22*a;for(let r of e.eyes)r.scale.y=1+.3*a,r.scale.x=1+.15*a;i||(e.rig.position.y+=Math.sin(Math.min(1,o*2.5)*Math.PI)*.25)}else if(s==="yawn"){e.top.rotation.x=-.18*a,e.top.scale.y*=1+.06*a;for(let r of e.arms)r.rotation.z=r.userData.side*1.05*a;for(let r of e.eyes)r.scale.y=1-.85*a}}var u_=e=>e>=20||e<7,d_=e=>Math.min(1,Math.max(0,e>=12?e-19.5:7.5-e)),h_=e=>e<=0||e>=1?0:Math.min(1,e/.2,(1-e)/.3);function ym(e,t=!1){let n=e[0].index!==null,i=new Set(Object.keys(e[0].attributes)),s=new Set(Object.keys(e[0].morphAttributes)),o={},a={},r=e[0].morphTargetsRelative,c=new Rn,l=0;for(let u=0;u<e.length;++u){let d=e[u],h=0;if(n!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in d.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;o[f]===void 0&&(o[f]=[]),o[f].push(d.attributes[f]),h++}if(h!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(r!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in d.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(d.morphAttributes[f])}if(t){let f;if(n)f=d.index.count;else if(d.attributes.position!==void 0)f=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,u),l+=f}}if(n){let u=0,d=[];for(let h=0;h<e.length;++h){let f=e[h].index;for(let g=0;g<f.count;++g)d.push(f.getX(g)+u);u+=e[h].attributes.position.count}c.setIndex(d)}for(let u in o){let d=f_(o[u]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,d)}for(let u in a){let d=a[u][0].length;if(d===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let h=0;h<d;++h){let f=[];for(let y=0;y<a[u].length;++y)f.push(a[u][y][h]);let g=f_(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(g)}}return c}function f_(e){let t,n,i,s=-1,o=0;for(let l=0;l<e.length;++l){let u=e[l];if(t===void 0&&(t=u.array.constructor),t!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(n===void 0&&(n=u.itemSize),n!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;o+=u.count*n}let a=new t(o),r=new hn(a,n,i),c=0;for(let l=0;l<e.length;++l){let u=e[l];if(u.isInterleavedBufferAttribute){let d=c/n;for(let h=0,f=u.count;h<f;h++)for(let g=0;g<n;g++){let y=u.getComponent(h,g);r.setComponent(h+d,g,y)}}else a.set(u.array,c);c+=u.count*n}return s!==void 0&&(r.gpuType=s),r}var ne=2.4,ms=46,Jn=1.7,Xi=3,Lt=(e,t,n,i=.8)=>new ha(e,t,n,2,Math.min(i,e/2,t/2,n/2)),x_=16;function _m(e,t,n=!0){let i=document.createElement("canvas");i.width=i.height=e,t(i.getContext("2d"),e);let s=new hs(i);return s.wrapS=s.wrapT=$r,s.colorSpace=n?Xe:qi,s.anisotropy=x_,s}var gs=e=>(e.userData.shared=!0,e),ve=(e,t=1)=>`rgba(${e},${e},${e},${t})`;function mo(e,t,n,i){let s=e.getImageData(0,0,t,t);for(let o=0;o<s.data.length;o+=4){let a=(i()-.5)*n;s.data[o]+=a,s.data[o+1]+=a,s.data[o+2]+=a}e.putImageData(s,0,0)}function __(e,t,n,i,s,o,a){let r=Math.round(s/2.5);for(let c=0;c<r;c++){let l=n+o()*s,u=.6+o()*2.2,d=.004+o()*.012,h=o()*10;e.strokeStyle=ve(o()<.5?0:255,a*(.4+o())),e.lineWidth=.6+o()*1.4,e.beginPath();for(let f=0;f<=i;f+=6){let g=l+Math.sin(f*d+h)*u;f===0?e.moveTo(t+f,g):e.lineTo(t+f,g)}e.stroke()}}var p_=8;function oC(e){let t=xn("planks"),n=e/p_,i=[];for(let s=0;s<p_;s++){let o=t()*e,a=o+e;for(;o<a;){let r=Math.min(a-o,e*(.3+t()*.4));i.push({x:o,y:s*n,w:r,h:n,tone:.8+t()*.2,knot:t()<.25?[t(),t()]:null,seed:t()}),o+=r}}return i}function rC(e,t,n){let i=oC(t);e.fillStyle=ve(n?128:255),e.fillRect(0,0,t,t);for(let s of i)for(let o of[0,-t]){let a=s.x+o;if(a+s.w<0||a>t)continue;let r=xn(s.seed);if(e.save(),e.beginPath(),e.rect(a,s.y,s.w,s.h),e.clip(),n||(e.fillStyle=ve(Math.round(255*s.tone)),e.fillRect(a,s.y,s.w,s.h)),__(e,a,s.y,s.w,s.h,r,n?.2:.13),s.knot){let c=a+s.knot[0]*s.w,l=s.y+.2*s.h+s.knot[1]*.6*s.h;for(let u=4;u>0;u--)e.strokeStyle=ve(0,n?.18:.08),e.lineWidth=1.2,e.beginPath(),e.ellipse(c,l,u*5,u*2,0,0,Math.PI*2),e.stroke()}e.restore(),e.fillStyle=ve(0,n?.9:.28),e.fillRect(a-1,s.y,2,s.h),e.fillRect(a,s.y,s.w,2),n||(e.fillStyle=ve(255,.25),e.fillRect(a,s.y+2,s.w,1))}n||mo(e,t,6,xn("planks-speckle"))}function aC(e,t,n){let i=t/2;e.fillStyle=ve(n?128:255),e.fillRect(0,0,t,t),n||(e.fillStyle=ve(0,.035),e.fillRect(0,0,i,i),e.fillRect(i,i,i,i)),mo(e,t,n?70:16,xn("carpet")),e.fillStyle=ve(0,n?.7:.1);for(let s of[0,i])e.fillRect(s,0,2,t),e.fillRect(0,s,t,2)}function lC(e,t,n){let i=t/2;e.fillStyle=ve(n?160:255),e.fillRect(0,0,t,t),n||(e.fillStyle=ve(0,.14),e.fillRect(0,0,i,i),e.fillRect(i,i,i,i),mo(e,t,5,xn("checker"))),e.fillStyle=n?ve(0):ve(120,.55);for(let s of[0,i])e.fillRect(s-3,0,6,t),e.fillRect(0,s-3,t,6)}function cC(e,t,n){e.fillStyle=ve(n?128:255),e.fillRect(0,0,t,t),__(e,0,0,t,t,xn("wood"),n?.16:.1),n||mo(e,t,5,xn("wood-speckle"))}function uC(e,t,n){e.fillStyle=ve(n?128:255),e.fillRect(0,0,t,t);for(let i=0;i<t;i+=4)e.fillStyle=ve(0,n?.25:.035),e.fillRect(i,0,1,t),e.fillRect(0,i,t,1);mo(e,t,n?40:10,xn("fabric"))}function dC(e,t,n){let i=xn("concrete");e.fillStyle=ve(n?128:255),e.fillRect(0,0,t,t);for(let s=0;s<40;s++){let o=i()*t,a=i()*t,r=30+i()*90,c=e.createRadialGradient(o,a,0,o,a,r);c.addColorStop(0,ve(i()<.5?0:255,n?.04:.035)),c.addColorStop(1,ve(0,0)),e.fillStyle=c,e.fillRect(o-r,a-r,r*2,r*2)}mo(e,t,n?40:9,xn("concrete-grit"));for(let s=0;s<90;s++)e.fillStyle=ve(0,n?.5:.12),e.fillRect(i()*t,i()*t,1.5,1.5);e.fillStyle=ve(0,n?.8:.16),e.fillRect(0,0,t,2),e.fillRect(0,0,2,t)}function hC(e,t,n){let i=t/2;e.fillStyle=ve(n?128:255),e.fillRect(0,0,t,t),mo(e,t,n?18:6,xn("deck"));for(let[s,o]of[[0,0],[i,0],[0,i],[i,i]]){e.fillStyle=ve(255,n?.35:.08),e.fillRect(s+6,o+6,i-12,3),e.fillStyle=ve(0,n?.9:.35),e.fillRect(s,o,i,3),e.fillRect(s,o,3,i);for(let[a,r]of[[14,14],[i-14,14],[14,i-14],[i-14,i-14]])e.fillStyle=ve(n?255:0,n?.9:.2),e.beginPath(),e.arc(s+a,o+r,3.2,0,Math.PI*2),e.fill()}}function fC(e,t,n){e.fillStyle=ve(n?128:255),e.fillRect(0,0,t,t),mo(e,t,n?14:5,xn("hull")),e.fillStyle=ve(0,n?.9:.3),e.fillRect(0,0,3,t),e.fillRect(0,t*.62,t,3),e.fillStyle=ve(n?255:0,n?.5:.07),e.fillRect(0,t*.36,t,t*.1)}var Nl={planks:{draw:rC,size:1024,unit:72,roughness:.5,bump:2.5},carpet:{draw:aC,size:512,unit:70,roughness:.95,bump:.6},checker:{draw:lC,size:512,unit:40,roughness:.3,bump:1.5},wood:{draw:cC,size:512,unit:0,roughness:.5,bump:.5},fabric:{draw:uC,size:256,unit:0,roughness:.9,bump:.6},concrete:{draw:dC,size:512,unit:160,roughness:.85,bump:.8},deck:{draw:hC,size:512,unit:60,roughness:.45,bump:1.6},hull:{draw:fC,size:256,unit:40,roughness:.55,bump:1.2}},xm={};function wm(e){if(!xm[e]){let{draw:t,size:n}=Nl[e];xm[e]={map:gs(_m(n,(i,s)=>t(i,s,!1))),bump:gs(_m(n,(i,s)=>t(i,s,!0),!1))}}return xm[e]}function Mm(e,t,n,i="planks"){let{unit:s,roughness:o,bump:a}=Nl[i],r=wm(i),c=r.map.clone(),l=r.bump.clone();for(let u of[c,l])u.repeat.set(t/s,n/s),u.userData.shared=!1,u.needsUpdate=!0;return new _e({color:e,map:c,bumpMap:l,bumpScale:a,roughness:o})}function b_(e,t,n={}){let{roughness:i,bump:s}=Nl[e],o=wm(e);return new _e({color:t,map:o.map,bumpMap:o.bump,bumpScale:s,roughness:i,...n})}var ji=e=>b_("wood",e),Hd=e=>b_("fabric",e),Fd=null;function pC(){if(Fd)return Fd;let e=document.createElement("canvas");e.width=4,e.height=64;let t=e.getContext("2d"),n=t.createLinearGradient(0,0,0,64);return n.addColorStop(0,"#fff"),n.addColorStop(.35,"#6a6a6a"),n.addColorStop(1,"#000"),t.fillStyle=n,t.fillRect(0,0,4,64),Fd=gs(new hs(e)),Fd}var mC={back:0,left:Math.PI/2,right:-Math.PI/2,front:Math.PI};function bm(e,t,n){let i=e.map(([o,a,r,c,l])=>new Cn(o,a).rotateX(-Math.PI/2).rotateY(mC[l]).translate(r,t,c)),s=new G(ym(i),new Qe({color:"#000",alphaMap:pC(),transparent:!0,opacity:n,depthWrite:!1}));for(let o of i)o.dispose();return s}function v_(e,t){let n=e.attributes.position,i=new Float32Array(n.count*3);for(let s=0;s<n.count;s++){let o=Us.smoothstep(n.getY(s)/t+.5,0,.55);i.fill(.74+.26*o,s*3,s*3+3)}return e.setAttribute("color",new hn(i,3)),e}function xn(e){let t=2166136261;for(let n of String(e))t=Math.imul(t^n.charCodeAt(0),16777619)>>>0;return()=>(t=Math.imul(t^t>>>15,2246822507)>>>0,t=Math.imul(t^t>>>13,3266489909)>>>0,((t^=t>>>16)>>>0)/4294967296)}var Ht=(e,t={})=>new _e({color:e,roughness:.7,...t}),pa=gs(new _e({color:"#bfe3f7",emissive:"#bfe3f7",emissiveIntensity:.4,roughness:.15})),Ul=gs(new _e({color:"#fbf6ec",emissive:"#ffcf7a",emissiveIntensity:.55,side:Kn,roughness:.6})),Bd=null;function gC(){if(Bd)return Bd;let e=xn("stars"),t=_m(256,(n,i)=>{let s=n.createRadialGradient(i*.7,i*.3,0,i*.5,i*.5,i*.75);s.addColorStop(0,"#1d2650"),s.addColorStop(.5,"#0c1128"),s.addColorStop(1,"#05070f"),n.fillStyle=s,n.fillRect(0,0,i,i);for(let o=0;o<160;o++){let a=e()<.08?1.6:.5+e()*.7;n.fillStyle=`rgba(${e()<.2?"190,220,255":"255,255,255"},${.45+e()*.55})`,n.beginPath(),n.arc(e()*i,e()*i,a,0,Math.PI*2),n.fill()}n.fillStyle="#d9a46a",n.beginPath(),n.arc(i*.28,i*.68,i*.07,0,Math.PI*2),n.fill(),n.strokeStyle="rgba(240,215,170,0.8)",n.lineWidth=2,n.beginPath(),n.ellipse(i*.28,i*.68,i*.13,i*.03,-.35,0,Math.PI*2),n.stroke()});return t.wrapS=t.wrapT=ls,Bd=gs(new Qe({map:gs(t),toneMapped:!1})),Bd}function Ri(e){return e.traverse(t=>{t.isMesh&&(t.castShadow=!0,t.receiveShadow=!0)}),e}var yC=(e,t)=>`${t.userData.shared?t.uuid:`${t.type}|${t.color?.getHex()}|${t.emissive?.getHex()}|${t.emissiveIntensity}|${t.roughness}|${t.metalness}|${t.side}|${t.map?.uuid}|${t.bumpMap?.uuid}|${t.vertexColors}`}|${e.castShadow}|${e.receiveShadow}`;function ar(e,t=[]){e.updateMatrixWorld(!0);let n=e.matrixWorld.clone().invert(),i=new Set;for(let o of t)o.traverse(a=>i.add(a));let s=new Map;e.traverse(o=>{if(!o.isMesh||i.has(o)||o===e||o.children.length||Array.isArray(o.material)||o.material.transparent||o.matrixWorld.determinant()<0)return;let a=yC(o,o.material);s.has(a)||s.set(a,[]),s.get(a).push(o)});for(let o of s.values()){if(o.length<2)continue;let a=o.map(d=>{let h=d.geometry.index?d.geometry.toNonIndexed():d.geometry.clone();return h.clearGroups(),h.applyMatrix4(n.clone().multiply(d.matrixWorld))}),r=Object.keys(a[0].attributes).filter(d=>a.every(h=>h.attributes[d]));for(let d of a)for(let h of Object.keys(d.attributes))r.includes(h)||d.deleteAttribute(h);let c=ym(a);for(let d of a)d.dispose();if(!c)continue;let l=o[0],u=new G(c,l.material);u.castShadow=l.castShadow,u.receiveShadow=l.receiveShadow;for(let d of o)d.removeFromParent();e.add(u)}return e}function w_(e,t){let n=new Bt,i=ji(e.woodDark),s=new G(Lt(44,30,11,1),i);s.position.y=15,n.add(s);for(let o of[4,15.5]){let a=-19;for(;a<17;){let r=2.2+t()*2.2,c=7+t()*3,l=new G(Lt(r,c,7.5,.4),Ht(e.books[Math.floor(t()*e.books.length)],{roughness:.55}));l.position.set(a+r/2,o+c/2,2.4),l.rotation.z=t()<.12?.25:0,n.add(l),a+=r+.4,t()<.1&&(a+=4)}}s.scale.z=.35,s.position.z=-3.5;for(let o of[.8,12.6,24.4,29]){let a=new G(Lt(44,1.6,11,.4),i);a.position.y=o,n.add(a)}for(let o of[-21.2,21.2]){let a=new G(Lt(1.6,30,11,.4),i);a.position.set(o,15,0),n.add(a)}return Ri(n)}function fa(e,t){let n=new Bt;n.userData.plant=t()*10;let i=new G(new de(5,3.8,8,28),Ht(e.pot,{roughness:.35}));i.position.y=4,n.add(i);let s=Ht(e.leaf,{roughness:.6}),o=5+Math.floor(t()*3);for(let a=0;a<o;a++){let r=new G(new hl(3.4+t()*2,0),s),c=a/o*Math.PI*2;r.position.set(Math.cos(c)*3,11+t()*9,Math.sin(c)*3),r.scale.y=1.3,n.add(r)}return ar(Ri(n))}function vm(e){let t=new Bt,n=Ht(e.woodDark,{roughness:.3,metalness:.6}),i=new G(new de(3.6,4,1.2,28),n);i.position.y=.6;let s=new G(new de(.45,.45,26,8),n);s.position.y=13;let o=new G(new de(3.4,6,7,24,1,!0),Ul);return o.position.y=28,t.add(i,s,o),Ri(t),o.castShadow=!1,t}function xC(e,t){let n=new Bt,i=Ht(e.trim,{roughness:.4}),s=new G(new Cn(t,15),pa);s.position.set(0,18,.3),n.add(s);for(let[o,a,r,c]of[[0,25.8,t+2,1.6],[0,10.2,t+3,1.8],[-t/2-.4,18,1.6,17],[t/2+.4,18,1.6,17],[0,18,1,15],[0,18,t,1]]){let l=new G(Lt(r,c,1.6,.3),i);l.position.set(o,a,.9),n.add(l)}return n}function Sm(e,t){let n=new Bt,i=new G(new Zo(t,40),gC());i.position.set(0,18,.3);let s=new G(new Kr(t+.5,t*.16,10,40),Ht(e.trim,{roughness:.3,metalness:.6}));return s.position.set(0,18,.9),n.add(i,s),n}var _C=(e,t)=>{if(e.look?.windows!=="stars")return xC(e,t);let n=new Bt;for(let i of[-t*.24,t*.24]){let s=Sm(e,7);s.position.x=i,n.add(s)}return n};function M_(e,t){let n=new Bt,i=new G(Lt(14,11,1,.3),ji(e.woodDark));i.position.set(0,20,.6);let s=new G(new Cn(11,8),Ht(e.books[Math.floor(t()*e.books.length)]));s.position.set(0,20,1.15);let o=new G(new Zo(1.8,20),Ht(e.trim));return o.position.set(2.5,21,1.2),n.add(i,s,o),n}function S_(e,t){let n=new Bt,i=Hd(e.books[Math.floor(t()*e.books.length)]),s=new G(Lt(30,6,13,2.5),i);s.position.y=5;let o=new G(Lt(30,10,4,2),i);o.position.set(0,10,-5);let a=[-1,1].map(r=>{let c=new G(Lt(4,9,13,2),i);return c.position.set(r*15,6.5,0),c});return n.add(s,o,...a),Ri(n)}var E_=e=>Ht(e.trim,{roughness:.4,...e.look?.trimGlow&&{emissive:e.glow,emissiveIntensity:e.look.trimGlow}});function bC(e,t,{w:n,d:i,colors:s,rand:o,place:a}){let r=-i/2,c=[r+i*.36,r+i*.62],l=(u,d)=>(u.rotation.y=d<0?Math.PI/2:-Math.PI/2,u);if(t==="plants")for(let[u,d,h]of[[-n/2+14,c[0],1.1],[-n/2+14,c[1],.85],[n/2-14,c[0]+8,1.2]]){let f=fa(s,o);delete f.userData.plant,a(f,u,ne,d,Jn*h)}else if(t==="books"){a(l(w_(s,o),1),n/2-9.5,ne,c[0]+6);for(let u=0;u<2;u++){let d=new Bt;for(let h=0;h<4;h++){let f=new G(Lt(9-h*.8,1.6,6.5,.3),Ht(s.books[Math.floor(o()*s.books.length)],{roughness:.55}));f.position.y=.8+h*1.7,f.rotation.y=(o()-.5)*.5,d.add(f)}a(Ri(d),-n/2+10,ne,c[u])}}else if(t==="art")for(let u of[-1,1])for(let d of c)a(l(M_(s,o),u),u*(n/2-.4),-10,d,Jn*1.15);else if(t==="lamps"){a(vm(s),-n/2+12,ne,c[0]),a(vm(s),n/2-12,ne,c[1]);let u=S_(s,o);u.scale.set(Jn*.5,Jn,Jn),u.rotation.y=Math.PI/2,u.position.set(-n/2+14,ne,c[0]+24),e.add(u)}}function T_({w:e,d:t,name:n,colors:i,decor:s}){let o=xn(n),a=new Bt,r=i.look??{},c=new G(Lt(e,ne,t,.6),Mm(i.wood,e,t,r.roomFloor??"planks"));c.position.y=ne/2,c.receiveShadow=!0,a.add(c);let l=null,u=new Map,d=T=>{if(r.walls!=="panels")return l??=Ht(i.wall,{roughness:.85,vertexColors:!0});if(!u.has(T)){let{roughness:S,bump:A}=Nl.hull,R=wm("hull"),[_,w]=[R.map.clone(),R.bump.clone()];for(let P of[_,w])P.repeat.set(T/Nl.hull.unit,1),P.userData.shared=!1,P.needsUpdate=!0;u.set(T,Ht(i.wall,{map:_,bumpMap:w,bumpScale:A,roughness:S,vertexColors:!0}))}return u.get(T)},h=E_(i),f=[[e+Xi*2,0,-t/2-Xi/2,"back"],[t,-e/2-Xi/2,0,"side"],[t,e/2+Xi/2,0,"side"]];for(let[T,S,A,R]of f){let _=v_(R==="back"?Lt(T,ms,Xi,.6):Lt(Xi,ms,T,.6),ms),w=new G(_,d(T));w.position.set(S,ms/2,A),w.castShadow=w.receiveShadow=!0;let P=new G(R==="back"?Lt(T+1,1.6,Xi+1.2,.4):Lt(Xi+1.2,1.6,T+1,.4),h);P.position.set(S,ms+.6,A);let D=new G(R==="back"?Lt(T+.6,2.4,Xi+.8,.3):Lt(Xi+.8,2.4,T+.6,.3),h);D.position.set(S,ne+1.2,A),a.add(w,P,D)}let g=16,y=14,m=Xi;a.add(bm([[e,g,0,-t/2+g/2,"back"],[t,g,-e/2+g/2,0,"left"],[t,g,e/2-g/2,0,"right"]],ne+.08,.32),bm([[e+2*m,y,0,-t/2-m-y/2,"front"],[e,y,0,t/2+y/2,"back"],[t+m,y,-e/2-m-y/2,-m/2,"right"],[t+m,y,e/2+m+y/2,-m/2,"left"]],.48,.22));let p=-t/2+1,x=(T,S,A,R,_=Jn)=>{T.scale.setScalar(_),T.position.set(S,A,R),a.add(T)},b={x:-e/2+48+o()*10,z:p+9.5};x(w_(i,o),b.x,ne,b.z),x(_C(i,Math.min(46,e*.12)),e*.02,-8,p),e>300&&x(M_(i,o),e*.24,-6,p),x(fa(i,o),e/2-18,ne,p+16),x(fa(i,o),-e/2+16,ne,t/2-20,Jn*.8),x(vm(i),e/2-16,ne,t/2-18,Jn*.9),e>380&&o()<.8&&x(S_(i,o),e*.27,ne,p+18),s&&bC(a,s,{w:e,d:t,colors:i,rand:o,place:x});let v=Em(a);return ar(a,v),{group:a,floor:c,wallMat:d,plants:v,shelfAt:b}}var m_=8,Il=null;function g_(e,t,n){let i=document.createElement("canvas");i.width=e,i.height=t,n(i.getContext("2d"),e,t);let s=new hs(i);return s.colorSpace=Xe,s.anisotropy=x_,s}function vC(){if(Il)return Il;let e=g_(512,128,(n,i,s)=>{n.textAlign="center",n.textBaseline="middle",n.font='italic 700 92px Georgia, "Times New Roman", serif',n.lineJoin="round";for(let[o,a,r]of[[28,10,"rgba(255,92,170,0.85)"],[12,6,"#ff7cc0"],[0,2.6,"#fff1f8"]])n.shadowColor="#ff4fa3",n.shadowBlur=o,n.lineWidth=a,n.strokeStyle=r,n.strokeText("ship it!",i/2,s/2+4)}),t=g_(200,260,(n,i,s)=>{n.fillStyle="#fbe9d3",n.fillRect(0,0,i,s),n.fillStyle="#f2a65a",n.beginPath(),n.arc(i*.5,s*.36,i*.2,0,Math.PI*2),n.fill(),n.fillStyle="#5fb35a",n.beginPath(),n.moveTo(0,s*.56),n.quadraticCurveTo(i*.3,s*.38,i*.6,s*.54),n.quadraticCurveTo(i*.8,s*.46,i,s*.52),n.lineTo(i,s*.7),n.lineTo(0,s*.7),n.fill(),n.fillStyle="#2fa59a",n.fillRect(0,s*.66,i,s*.34),n.fillStyle="#fbf6ec",n.textAlign="center",n.font="700 27px Georgia, serif",n.fillText("MAKE GOOD",i/2,s*.8),n.fillText("THINGS",i/2,s*.92)});Il={neon:gs(e),poster:gs(t),gold:new _e({color:"#e7b743",metalness:.65,roughness:.28}),neonMat:new Qe({map:e,transparent:!0,depthWrite:!1,toneMapped:!1}),posterMat:new _e({map:t,roughness:.8}),cup:new de(1.35,.7,2.6,16),stem:new de(.28,.28,1.4,8),base:Lt(2.4,.8,1.8,.2),handle:new Kr(.6,.16,6,12),sign:new Cn(1,1)};for(let n of Object.values(Il))gs(n);return Il}function wC(e,t){let n=new Bt,i=new G(e.base,t);i.position.y=.4;let s=new G(e.stem,e.gold);s.position.y=1.5;let o=new G(e.cup,e.gold);o.position.y=3.4,n.add(i,s,o);for(let a of[-1,1]){let r=new G(e.handle,e.gold);r.position.set(a*1.3,3.6,0),n.add(r)}return n}function A_({w:e,d:t,colors:n,shelfAt:i}){let s=vC(),o=new Bt,a=-t/2+1,r=ji(n.woodDark),c=[];for(let y=0;y<m_;y++){let m=wC(s,r);m.scale.setScalar(Jn*(y%2?1.05:1.25)),m.position.set(i.x+(y-(m_-1)/2)*9.2,ne+30*Jn,i.z+2),m.visible=!1,o.add(Ri(m)),c.push(m)}let l=new G(s.sign,s.neonMat);l.scale.set(42,10.5,1),l.position.set(e*.02,ms-5,a+.6),l.visible=!1;let u=Math.min(46,e*.12)*Jn/2+18,d=new Bt,h=new G(Lt(21,27,1,.4),r),f=new G(s.sign,s.posterMat);f.scale.set(19,24.7,1),f.position.z=.55,d.add(h,f),d.position.set(e*.02+(e>300?-u:u),26,a+.6),d.visible=!1,o.add(l,d);let g=null;return{group:o,set(y,m){c.forEach((p,x)=>{p.visible=x<y.trophies}),l.visible=y.neon,d.visible=y.poster,m&&(g??=m.scale.x,m.scale.setScalar(g*[1,1.45,1.85][Math.min(2,y.plant)]))},animate(y){if(!l.visible)return;let m=Math.sin(y*.7)>.995?.55:1;s.neonMat.opacity=m*(.92+Math.sin(y*2.3)*.04)}}}var Em=e=>{let t=[];return e.traverse(n=>{n.userData.plant!==void 0&&t.push(n)}),t};function R_(e){let t=new G(new de(30,30,.6,64),Hd(e));return t.scale.z=.82,t.position.y=ne+.3,t.receiveShadow=!0,t}var y_=["#7cc4ff","#f6a6c1","#ffd479","#a7e3a1","#c9b6ff","#e8e2d6"];function C_(e,t){let n=new Bt,i=ji(e.woodDark),s=new G(Lt(58,2.6,22,.8),ji(e.desk));s.position.y=17,n.add(s);for(let Q of[-26,26]){let it=new G(Lt(3,16,18,.6),i);it.position.set(Q,8,0),n.add(it)}let o=Ht("#2b2a2e",{roughness:.3,metalness:.4}),a=new G(Lt(3,6,3,.6),o);a.position.set(0,21,-5);let r=new G(Lt(11,1,7,.4),o);r.position.set(0,18.8,-5);let c=new G(Lt(34,21,2,1),o);c.position.set(0,34,-5),n.add(a,r,c);let l=document.createElement("canvas");l.width=160,l.height=96;let u=new hs(l);u.colorSpace=Xe;let d=new G(new Cn(31,18),new Qe({map:u,toneMapped:!1}));d.position.set(0,34,-3.9),n.add(d);let h=new G(Lt(18,1,6,.4),Ht(e.trim,{roughness:.45}));h.position.set(-3,18.8,5);let f=new G(new de(2.2,2,4.4,24),Ht(t,{roughness:.25}));f.position.set(20,20.6,4),n.add(h,f),Ri(n),d.castShadow=d.receiveShadow=!1;let g=l.getContext("2d"),y=Array.from({length:40},(Q,it)=>({indent:[0,1,2,1,2,3,1,0][it%8]*10,parts:Array.from({length:1+it*7%4},(nt,yt)=>({w:8+(it*13+yt*29)%36,c:y_[(it+yt*3)%y_.length]}))})),m=0,p=-1,x="",b=null;function v(Q,it){b={img:Q,until:it},x=""}function T(Q,it){let nt=Q?`${Q}|${it}`:null;(b?.askKey??null)===nt&&!b?.img||b?.img&&!Q||(b=Q?{ask:Q,color:it,askKey:nt}:null,x="")}function S(Q,it){if(b.img){g.fillStyle="#1f2433",g.fillRect(0,0,160,96);let{img:nt}=b,yt=Math.min(160/nt.width,96/nt.height);g.drawImage(nt,(160-nt.width*yt)/2,(96-nt.height*yt)/2,nt.width*yt,nt.height*yt)}else{g.fillStyle=b.color,g.fillRect(0,0,160,96),g.fillStyle="#ffffff",g.font="700 64px Georgia, serif",g.textAlign="center",g.textBaseline="middle";let nt=it?0:Math.sin(Q*3)*3;g.fillText(b.ask==="permission"?">_":b.ask==="plan"?"\u270E":"?",80,50+nt)}u.needsUpdate=!0}function A(Q,it,nt,yt=!1){if(b?.img&&Q>b.until&&(b=null,x=""),b&&it!=="off"){if(Q-p<.1)return;p=Q,S(Q,yt);return}if(!(it!=="busy"&&it===x)&&!(it==="busy"&&(Q-p<.12||yt&&it===x))){if(p=Q,x=it,g.fillStyle=it==="off"?"#141416":"#1f2433",g.fillRect(0,0,160,96),it==="off"){u.needsUpdate=!0;return}g.fillStyle=nt,g.fillRect(0,0,160,7),g.globalAlpha=it==="busy"?1:.55,it==="busy"&&!yt&&(m=(m+1)%y.length);for(let he=0;he<9;he++){let I=y[(he+m)%y.length],ae=8+I.indent;for(let Ft of I.parts)g.fillStyle=Ft.c,g.fillRect(ae,13+he*9,Ft.w,4),ae+=Ft.w+4}it==="busy"&&!yt&&Math.floor(Q*3)%2&&(g.fillStyle="#ffffff",g.fillRect(8,85,5,5)),g.globalAlpha=1,u.needsUpdate=!0}}let R=[0,.5].map(Q=>{let it=new G(new Yn(1.1,10,10),new Qe({color:"#ffffff",transparent:!0,opacity:0,depthWrite:!1}));return it.userData.offset=Q,n.add(it),it});function _(Q,it){for(let nt of R){let yt=(Q*.5+nt.userData.offset)%1;nt.position.set(20+Math.sin(yt*7+nt.userData.offset*5),23+yt*10,4),nt.scale.setScalar(.6+yt),nt.material.opacity=it?.5*(1-yt)*Math.min(1,yt*5):0}}let w=document.createElement("canvas");w.width=128,w.height=84;let P=new hs(w);P.colorSpace=Xe;let D=new Bt,U=new G(Lt(13,9.4,1,.4),Ht(e.trim,{roughness:.5})),H=new G(new Cn(11.6,8),new Qe({map:P,toneMapped:!1}));H.position.z=.55,D.add(U,H),D.position.set(-22,23.6,1),D.rotation.set(-.18,.3,0),D.visible=!1,n.add(D);function X(Q){let it=w.getContext("2d"),nt=Math.max(128/Q.width,84/Q.height);it.drawImage(Q,(128-Q.width*nt)/2,(84-Q.height*nt)/2,Q.width*nt,Q.height*nt),P.needsUpdate=!0,D.visible=!0}let z=new Bt,Z=new G(Lt(11,1.6,8,.4),Ht(e.woodDark,{roughness:.6}));Z.position.y=.8,z.add(Z),z.position.set(21,18.3,-5),z.visible=!1,n.add(z);let V=[],lt=new _e({color:"#fbf8f1",roughness:.85}),dt=new fn(9,.45,6.4),bt=new fn(3.2,.5,1.6),qt=0,ee=null,Ee=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;function re(Q){let it=Q.length>qt;qt=Q.length;for(let yt of V)z.remove(yt),yt.children[0]?.material.dispose();V.length=0,ee=null,Q.slice(-6).forEach((yt,he)=>{let I=new G(dt,lt),ae=new G(bt,new _e({color:yt,roughness:.7}));ae.position.set(-2.4,.05,-3.4),I.add(ae),I.position.set(he%2?.4:-.3,1.9+he*.5,he%3*.2),I.rotation.y=(he*37%9-4)*.03,I.castShadow=!0,z.add(I),V.push(I)}),z.visible=Q.length>0;let nt=V.at(-1);it&&nt&&!Ee&&(ee={m:nt,at:-1,rest:nt.position.clone(),turn:nt.rotation.y})}let K=1.4;function tt(Q){if(!ee)return;ee.at<0&&(ee.at=Q);let it=Math.min(1,(Q-ee.at)/K),{m:nt,rest:yt,turn:he}=ee,I=1-it*it,ae=it>.75?Math.sin((it-.75)/.25*Math.PI)*.6:0;nt.position.set(yt.x+Math.sin(it*9)*3*I,yt.y+34*I+ae,yt.z+Math.cos(it*7)*1.2*I),nt.rotation.set(Math.sin(it*11)*.35*I,he+I*1.4,Math.cos(it*9)*.3*I),nt.scale.setScalar(1+.8*I),it>=1&&(nt.position.copy(yt),nt.rotation.set(0,he,0),nt.scale.setScalar(1),ee=null)}return Ri(D),H.castShadow=H.receiveShadow=!1,ar(n,[d,f,...R,D,z]),{group:n,draw:A,steam:_,mug:f,showImage:v,showAsk:T,setPhoto:X,setTray:re,animateTray:tt}}function k_(e){let t=new Bt,n=Ht(e.woodDark,{roughness:.6});for(let f of[-9,9]){let g=new G(Lt(1.6,44,1.6,.5),n);g.position.set(f,22,0),g.rotation.z=f<0?.06:-.06,t.add(g)}let i=new G(Lt(1.4,40,1.4,.5),n);i.position.set(0,20,-6),i.rotation.x=-.28,t.add(i);let s=new G(Lt(26,30,1.6,.8),Ht(e.trim,{roughness:.4}));s.position.set(0,30,.6),t.add(s);let o=new G(Lt(24,1.2,3,.4),n);o.position.set(0,14.6,1.6);let a=new G(new de(.5,.5,5,10),Ht("#b85c3c"));a.rotation.z=Math.PI/2,a.position.set(5,15.6,1.8),t.add(o,a);let r=document.createElement("canvas");r.width=192,r.height=224;let c=new hs(r);c.colorSpace=Xe,c.anisotropy=8;let l=new G(new Cn(24,28),new Qe({map:c,toneMapped:!1}));l.position.set(0,30,1.45),t.add(l),Ri(t),l.castShadow=l.receiveShadow=!1;let u=r.getContext("2d"),d="";function h(f,g,y){let m=f.findIndex(S=>S.status==="in_progress"),p=m>=0&&Math.floor(y*2)%2,x=`${f.map(S=>S.status+S.text).join("|")}|${g}|${p}`;if(x===d)return;d=x,u.fillStyle="#fdfcf8",u.fillRect(0,0,192,224);let b=f.filter(S=>S.status==="completed").length;u.fillStyle=b===f.length?"#5f8a68":"#2b2a2e",u.font="600 23px Georgia, serif",u.textBaseline="alphabetic",u.textAlign="left",u.fillText(b===f.length?"All done \u2713":`${b} of ${f.length} done`,12,28);let v=(S,A)=>{u.fillStyle=A,u.beginPath(),u.roundRect(12,37,Math.max(S,9),9,4.5),u.fill()};v(168,"#e6dfd3"),b&&v(168*(b/f.length),"#5f8a68");let T=Math.max(0,Math.min(m-1,f.length-6));f.slice(T,T+6).forEach((S,A)=>{let R=70+A*26,_=S.status==="completed",w=S.status==="in_progress";u.strokeStyle=_?"#5f8a68":w?g:"#b8afa2",u.lineWidth=2.5,u.strokeRect(12,R-13,15,15),_?(u.beginPath(),u.moveTo(14,R-6),u.lineTo(19,R-1),u.lineTo(27,R-14),u.stroke()):w&&p&&(u.fillStyle=g,u.fillRect(16,R-9,7,7)),u.font=`${w?600:400} 15px -apple-system, "Segoe UI", sans-serif`,u.fillStyle=_?"#a39b90":"#2b2a2e";let P=S.text;for(;u.measureText(P).width>146&&P.length>4;)P=`${P.slice(0,-2)}\u2026`.replace(/……$/,"\u2026");u.fillText(P,34,R),_&&(u.strokeStyle="#a39b90",u.lineWidth=1.5,u.beginPath(),u.moveTo(34,R-5),u.lineTo(34+u.measureText(P).width,R-5),u.stroke())}),c.needsUpdate=!0}return ar(t,[l]),{group:t,draw:h}}var Dl=180,rr=150;function P_(e){let t=new Bt,n=xn("coffee"),i=e.look??{},s=!!i.galley,o=new G(Lt(Dl,1.4,rr,.6),Mm(e.tile,Dl,rr,i.coffeeFloor??"checker"));o.position.y=.7,o.receiveShadow=!0,t.add(o);let a=-rr/2+14,r=new G(Lt(120,22,24,1),Ht(e.counter,s?{roughness:.3,metalness:.55}:{roughness:.45}));r.position.set(-25,11,a);let c=new G(Lt(124,2.4,26,.6),s?Ht(e.trim,{roughness:.25,metalness:.7}):ji(e.woodDark));if(c.position.set(-25,23,a),t.add(r,c),s){let D=new G(Lt(116,1.2,.6,.3),new Qe({color:e.glow,toneMapped:!1}));D.position.set(-25,3,a+12.4),t.add(D)}for(let D of[-70,-40,-10,20]){let U=new G(Lt(6,1,1,.3),Ht(e.trim,{roughness:.25,metalness:.7}));U.position.set(D,18,a+12.4),t.add(U)}let l=new Bt,u=new G(Lt(20,24,15,2),Ht("#3a3633",{roughness:.25,metalness:.5}));u.position.y=12;let d=new G(Lt(20,4,18,1),Ht("#4a4541",{roughness:.25,metalness:.6}));d.position.set(0,23,1.5);let h=new G(new Yn(1,12,12),new Qe({color:"#ff6a4d"}));h.position.set(6,17,7.6);let f=new G(new de(2.4,2,4.4,16),Ht(e.trim));f.position.set(-2,3,8.5),l.add(u,d,h,f),l.position.set(-55,24.2,a-1),t.add(l),e.mugs.forEach((D,U)=>{let H=new G(new de(2.2,2,4.6,24),Ht(D,{roughness:.25}));H.position.set(-28+U*6.5,26.5,a+5-U%2*4),t.add(H)});let g=new G(new de(4,4,9,18),Ht(e.window,{transparent:!0,opacity:.75,roughness:.2}));g.position.set(18,29,a-2),t.add(g);let y=new G(Lt(28,60,24,2),Ht(e.fridge,{roughness:.3}));y.position.set(55,30,a);let m=new G(Lt(1.6,14,1.6,.5),Ht("#9a948c",{roughness:.2,metalness:.8}));if(m.position.set(44,40,a+12.6),t.add(y,m),s){let D=Sm(e,4.5);D.position.set(56,24,a+12.2),t.add(D)}let p=new Bt,x=new G(new de(20,20,2.4,48),ji(e.desk));x.position.y=20;let b=new G(new de(1.6,1.6,19,16),ji(e.woodDark));b.position.y=10;let v=new G(new de(8,9,1.4,32),ji(e.woodDark));v.position.y=.7,p.add(x,b,v);for(let D=0;D<3;D++){let U=-Math.PI/2+(D-1)*1.6+Math.PI,H=new G(new de(6,5.4,12,28),Hd(e.mugs[(D*2+1)%e.mugs.length]));H.position.set(Math.cos(U)*28,6,Math.sin(U)*28),p.add(H)}for(let D=0;D<2;D++){let U=new G(new de(2.2,2,4.4,24),Ht(e.mugs[D*3%e.mugs.length],{roughness:.25}));U.position.set(-6+D*11,23.4,3-D*6),p.add(U)}p.position.set(-10,1.4,38),t.add(p);let T=fa(e,n);T.scale.setScalar(Jn),T.position.set(Dl/2-14,1.4,rr/2-18),t.add(T),Ri(t),o.castShadow=!1,h.castShadow=!1;let S=new Qe({color:"#ffffff",transparent:!0,opacity:.5,depthWrite:!1}),A=Array.from({length:5},(D,U)=>{let H=new G(new Yn(2.4,12,12),S.clone());return H.userData.offset=U/5,t.add(H),H}),R=new L(-57,24.2+27,a+2);function _(D){for(let U of A){let H=(D*.35+U.userData.offset)%1;U.position.set(R.x+Math.sin(H*6+U.userData.offset*9)*2.5,R.y+H*22,R.z),U.scale.setScalar(.6+H*1.4),U.material.opacity=.45*(1-H)*Math.min(1,H*6)}}let w=[...[.25,1,1.75,2.5,-.5,3.4].map(D=>new L(-10+Math.cos(D)*38,1.4,38+Math.sin(D)*30)),...[-62,-30,2].map(D=>new L(D,1.4,a+34))],P=new L(-10,1.4,38);return ar(t,A),{group:t,animate:_,spots:w,tableAt:P}}var Ll=64;function I_({W:e,D:t,colors:n}){let i=new Bt,s=n.look??{},o=new G(new fn(e,.4,t),Mm(n.carpet,e,t,s.officeFloor??"carpet"));o.position.y=.2,o.receiveShadow=!0,i.add(o);let a=Ht(n.outerWall,{roughness:.9,vertexColors:!0}),r=E_(n),c=pa,l=5;for(let[R,_,w,P]of[[e+l*2,0,-t/2-l/2,!0],[t,-e/2-l/2,0,!1],[t,e/2+l/2,0,!1]]){let D=new G(v_(P?Lt(R,Ll,l,1):Lt(l,Ll,R,1),Ll),a);D.position.set(_,Ll/2,w),D.receiveShadow=D.castShadow=!0;let U=new G(P?Lt(R+2,2.4,l+2,.6):Lt(l+2,2.4,R+2,.6),r);U.position.set(_,Ll+1,w),i.add(D,U)}let u=30;i.add(bm([[e,u,0,-t/2+u/2,"back"],[t,u,-e/2+u/2,0,"left"],[t,u,e/2-u/2,0,"right"]],.45,.28));let d=Math.max(2,Math.floor(e/110));for(let R=0;R<d;R++){let _=-e/2+e/d*(R+.5);if(s.windows==="stars"){let P=Sm(n,15);P.position.set(_,16,-t/2+.6),i.add(P);continue}let w=new G(new Cn(56,36),c);w.position.set(_,34,-t/2+.8),i.add(w);for(let[P,D,U,H]of[[0,52.5,60,2.4],[0,15.5,62,3],[-29,34,2.4,38],[29,34,2.4,38],[0,34,1.6,36]]){let X=new G(Lt(U,H,2,.4),r);X.position.set(_+P,D,-t/2+1.4),i.add(X)}}let h=xn("office");for(let[R,_]of[[-e/2+18,-t/2+18],[e/2-18,-t/2+18],[-e/2+18,t/2-18]]){let w=fa(n,h);w.scale.setScalar(Jn*1.3),w.position.set(R,.4,_),i.add(w)}let f=new Bt,g=new G(Lt(14,26,14,1.5),Ht(n.fridge,{roughness:.3}));g.position.y=13;let y=new G(new de(6,6,16,20),Ht(n.sky,{transparent:!0,opacity:.7,roughness:.1}));y.position.y=34,f.add(g,y),f.position.set(e/2-16,.4,t/2-22),i.add(f);let m=new Bt,p=new G(new de(9,9,1.6,48),ji(n.woodDark));p.rotation.x=Math.PI/2;let x=new G(new Zo(7.8,32),Ht(n.trim));x.position.z=.9,m.add(p,x);for(let R=0;R<12;R++){let _=new G(new fn(.6,R%3?1:1.8,.2),Ht("#2b2a2e")),w=R/12*Math.PI*2;_.position.set(Math.sin(w)*6.6,Math.cos(w)*6.6,1),_.rotation.z=-w,m.add(_)}let b=(R,_,w)=>{let P=new Bt,D=new G(new fn(_,R,.3),Ht(w));return D.position.y=R/2-.6,P.add(D),P.position.z=1.2,m.add(P),P},v=b(4.4,1,"#2b2a2e"),T=b(6.4,.6,"#2b2a2e"),S=b(6.8,.25,"#e0573f");m.position.set(-e/2+e/d,46,-t/2+1.2),i.add(m),Ri(i),o.castShadow=!1;let A=Em(i);return ar(i,[...A,v,T,S]),{group:i,plants:A,clock:{hour:v,minute:T,second:S}}}var Tm=96;function L_(e){let t=new Bt,n=xn("front desk"),i=Ht(e.counter,{roughness:.45}),s=ji(e.woodDark),o=[[0,0,64,0],[-40,-9,22,-.55],[40,-9,22,.55]];for(let[p,x,b,v]of o){let T=new G(Lt(b,24,16,1.2),i);T.position.set(p,12,x),T.rotation.y=v;let S=new G(Lt(b+3,2.4,19,.6),s);S.position.set(p,25.2,x-1),S.rotation.y=v,t.add(T,S)}let a=new G(Lt(60,3,1,.4),Ht(e.accent,{roughness:.5}));a.position.set(0,17,8.2),t.add(a);let r=new Bt,c=new G(new Yn(3.2,20,12,0,Math.PI*2,0,Math.PI/2),Ht("#d9b25a",{roughness:.2,metalness:.85})),l=new G(new de(4,4.2,.8,20),Ht("#2b2a2e",{roughness:.4})),u=new G(new Yn(.8,10,10),Ht("#d9b25a",{roughness:.2,metalness:.85}));l.position.y=.4,c.position.y=.8,u.position.y=4.2,r.add(l,c,u),r.position.set(16,26.4,0),t.add(r),e.mugs.slice(0,4).forEach((p,x)=>{let b=new G(Lt(9,.5,6,.2),Ht(x%2?e.trim:p,{roughness:.8}));b.position.set(-8+(n()-.5),26.6+x*.6,1+(n()-.5)),b.rotation.y=(n()-.5)*.5,t.add(b)});let d=new Bt,h=new G(new de(.5,.5,10,8),Ht("#2b2a2e"));h.position.y=5;let f=new G(new ul(4,4.4,20,1,!0),Ul);f.position.y=11,d.add(h,f),d.position.set(-28,26.4,-4),t.add(d);let g=fa(e,n);g.scale.setScalar(Jn*.9),g.position.set(-62,.4,-6),t.add(g),Ri(t);let y=new G(Lt(26,.6,16,.4),Hd(e.woodDark));y.position.set(Tm/2+26,.8,14),y.receiveShadow=!0,t.add(y);let m=Em(t);return ar(t,[r,...m]),{group:t,bell:r,plants:m}}var ma=[{id:"write",name:"Write",blurb:"A README, release notes, a how-to",templates:[["A README","Write a short, friendly README for this project: what it does, how to set it up, and how to use it. Keep it plain and easy to skim."],["Release notes","Write release notes for the changes since [the last release], in plain words for people who use it, not the people who built it."],["A how-to","Write a step-by-step how-to for [a task people do here], with an example at each step."]]},{id:"research",name:"Research",blurb:"Find out how something works",templates:[["How does it work?","Explain how [this part of the project] works, in plain words, with the files that matter. Don\u2019t change anything."],["Compare options","Compare a few ways to [solve this problem] for this project. Say what each costs and which you\u2019d pick. Don\u2019t change anything."],["Map the project","Give me a tour of this project: what lives where and how the pieces fit together. Don\u2019t change anything."]]},{id:"fix",name:"Fix",blurb:"Something\u2019s broken or failing",templates:[["A bug","Fix this bug: [what goes wrong, and when]. Find the cause first, then fix it and add a test that would have caught it."],["Failing tests","The tests are failing. Find out why and fix the cause, not the tests, unless the tests are wrong."],["Typos and links","Find and fix typos and broken links in the docs."]]},{id:"review",name:"Review",blurb:"A second pair of eyes",templates:[["My latest changes","Review my latest changes for bugs and anything confusing. List what you find, most important first. Don\u2019t change anything."],["Security","Look through [this part of the project] for security problems. Explain each in plain words and how to fix it. Don\u2019t change anything."],["Easy to use?","Check whether [this feature] is easy to use for someone new. Suggest small fixes. Don\u2019t change anything."]]},{id:"plan",name:"Plan",blurb:"Think it through before building",templates:[["A new feature","Plan how to add [the feature]. Write the plan as small steps with what each one touches. Don\u2019t change any files yet."],["Break it down","Break [a big job] into small steps I can hand out one at a time. Don\u2019t change any files yet."],["A cleanup","Plan a cleanup of [the messy part]: what to tidy first and what to leave alone. Don\u2019t change any files yet."]]},{id:"other",name:"Something else",blurb:"Say it in your own words",templates:[]}];function D_(e){let t=e.replace(/\s+/g," ").trim().split(/(?<=[.!?])\s/)[0].replace(/[.:]$/,"");return t.length>60?`${t.slice(0,57)}\u2026`:t}function N_(e,t){if(!t?.session)return null;let n=[...e];for(let i of n)if(i.session===t.session||i.short&&t.session.startsWith(i.short))return i;for(let i of n.reverse())if(i.state==="starting"&&!i.short&&(i.dir===t.cwd||i.dir===t.project))return i;return null}var km=document.querySelector('meta[name="agent-office-token"]')?.content||"",MC={write:'<path d="M4 16l1-4 8-8 3 3-8 8-4 1zM11 6l3 3"/>',research:'<circle cx="8.5" cy="8.5" r="4.5"/><path d="M12 12l4.5 4.5"/>',fix:'<path d="M12.5 3.5a3.5 3.5 0 0 0-3.3 4.6L3.5 13.8a1.4 1.4 0 0 0 2 2l5.7-5.7a3.5 3.5 0 0 0 4.6-3.3l-2 .8-1.6-1.6.8-2z"/>',review:'<path d="M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10z"/><circle cx="10" cy="10" r="2.3"/>',plan:'<path d="M3 5l4-1.5 6 2L17 4v11l-4 1.5-6-2L3 16zM7 3.5v11M13 5.5v11"/>',other:'<path d="M10 3v3M10 14v3M3 10h3M14 10h3M5 5l2 2M13 13l2 2M15 5l-2 2M7 13l-2 2"/>',bell:'<path d="M5 14h10l-1.4-2V8.5a3.6 3.6 0 0 0-7.2 0V12zM8.5 16.5a1.6 1.6 0 0 0 3 0M10 3.6v1.3"/>'},Vd=e=>`<svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${MC[e]}</svg>`,U_={starting:["Ringing the bell\u2026","working"],working:["Working","working"],blocked:["Waiting for your OK","asking"],done:["Done","done"],stopped:["Stopped","failed"],failed:["Didn\u2019t start","failed"]},O_=new Set(["starting","working","blocked"]),Os=new Map;function Pm(e,t=!1){e.kind==="job.start"&&Os.set(e.job,{id:e.job,t:e.t,dir:e.dir,title:e.title,type:e.type,prompt:e.prompt,state:"starting",demo:e.demo});let n=Os.get(e.job);if(n){if(e.kind==="job.update"){let i=n.state;for(let s of["state","short","session","error","waitingFor"])e[s]!==void 0&&(n[s]=e[s]);n.state==="blocked"&&i!=="blocked"&&!t&&Ol(`\u201C${n.title}\u201D needs your OK before it goes on.`,n),n.state==="failed"&&i!=="failed"&&!t&&Ol(n.error??"That job didn\u2019t start.",n,!0)}B_()}}var F_=()=>Os.clear(),Im=e=>N_(Os.values(),e),zt,cr,Yi="write",go=null,zd=!1,lr="",Am=!1,Lm=()=>{let e=new Map;for(let t of B.values()){if(t.kind!=="session"||!t.project||t.project==="unknown")continue;let n=t.projectName??t.project,i=e.get(t.project)??{dir:t.project,raw:n,name:mn(t.project,n),icon:Js(t.project,n),live:0,last:0};!t.past&&t.status!=="done"&&i.live++,i.last=Math.max(i.last,t.lastAt??t.startedAt??t.endedAt??0),e.set(t.project,i)}return[...e.values()].sort((t,n)=>n.live-t.live||n.last-t.last)};function SC(){return ma.map(e=>`
    <label class="jcard ${Yi===e.id?"on":""}">
      <input type="radio" name="jkind" value="${e.id}" ${Yi===e.id?"checked":""}>
      <span class="jicon k-${e.id}">${Vd(e.id)}</span>
      <b>${k(e.name)}</b>
      <small>${k(e.blurb)}</small>
    </label>`).join("")}function EC(){let e=ma.find(t=>t.id===Yi);return e.templates.length?e.templates.map(([t],n)=>`<button type="button" class="jchip" data-template="${n}">${k(t)}</button>`).join(""):'<p class="jhint">No template: just say what you\u2019d like done, the way you\u2019d ask a colleague.</p>'}function TC(){let e=Lm();return e.length?(e.some(t=>t.dir===go)||(go=e[0].dir),e.map(t=>`
    <label class="jroom ${t.dir===go?"on":""}" title="${k(t.dir)}">
      <input type="radio" name="jroom" value="${k(t.dir)}" ${t.dir===go?"checked":""}>
      <i class="room-${Fs(t.raw,t.dir)}" aria-hidden="true">${t.icon}</i><span>${k(t.name)}</span>
      <small>${t.live?`${t.live} working here`:"quiet"}</small>
    </label>`).join("")):'<p class="jhint">No rooms yet. Open Claude Code in a project once and its room appears here.</p>'}function AC(e){let[t,n]=U_[e.state]??U_.working,i=Lm().find(c=>c.dir===e.dir)?.name??e.dir.split(/[\\/]/).pop(),s=O_.has(e.state),o=e.short?`claude attach ${e.short}`:"",a=e.state==="blocked"?`<p class="jhelp">It stopped to ask for your OK. To see what and answer, open a terminal and run <code>${k(o)}</code><button type="button" class="jcopy" data-copy="${k(o)}">Copy</button></p>`:e.state==="failed"&&e.error?`<p class="jhelp bad">${k(e.error)}</p>`:s&&o?`<p class="jhelp muted">Running in the background. To watch it or step in: <code>${k(o)}</code></p>`:e.state==="done"&&o?`<p class="jhelp muted">To read its answer or ask for more: <code>${k(o)}</code></p>`:"",r=e.session&&B.get(`s:${e.session}`)?`s:${e.session}`:[...B.values()].find(c=>c.kind==="session"&&Im(c)===e)?.id;return`
    <li class="jticket ${e.state}">
      <span class="jicon k-${k(e.type??"other")}">${Vd(ma.some(c=>c.id===e.type)?e.type:"other")}</span>
      <div><b>${k(e.title)}</b><small>${k(i)} \xB7 ${Ae(e.t)}</small></div>
      <span class="pill ${n}">${t}</span>
      ${a}
      <span class="jacts">
        ${r?`<button type="button" data-jfind="${k(r)}">Find it</button>`:""}
        ${s?`<button type="button" class="jstop" data-jstop="${k(e.id)}">Stop</button>`:""}
      </span>
    </li>`}function RC(){let e=[...Os.values()].reverse(),t=km||cr.isDemo()||cr.bridgeDemo();return`
    <form method="dialog" class="jform">
      <header class="jhead">
        <span class="jbell">${Vd("bell")}</span>
        <div><h2 id="desk-title">Front desk</h2><p>Hand Claude a new job. A new teammate walks in to take it.</p></div>
        <button type="button" class="lib-close" data-jclose aria-label="Close">\xD7</button>
      </header>
      <fieldset class="jkinds"><legend>What kind of job?</legend>${SC()}</fieldset>
      <div class="jstep">
        <p class="jlabel" id="jprompt-label">The job</p>
        <div class="jchips">${EC()}</div>
        <textarea id="jprompt" rows="4" aria-labelledby="jprompt-label" placeholder="Say what you\u2019d like done\u2026"></textarea>
      </div>
      <fieldset class="jrooms"><legend>Which room does it go to?</legend>${TC()}</fieldset>
      <ul class="jhow" aria-label="How office jobs run">
        <li><b>It runs in the background.</b> You can close this page; the job keeps going and its critter keeps you posted.</li>
        <li><b>If it needs your OK</b> to run a command or change a file, it waits for you. Its ticket below says how: run <code>claude attach</code> with its id in a terminal and answer there.</li>
        <li><b>Changed your mind?</b> Press Stop on its ticket.</li>
      </ul>
      ${t?"":'<p class="jhelp bad">Starting jobs needs the office opened from its bridge (run /office in Claude Code).</p>'}
      <footer class="jfoot">
        <span class="jnote" role="status">${k(lr)}</span>
        <button type="button" class="jcancel" data-jclose>Not now</button>
        <button type="submit" class="jgo" ${!t||zd||!Lm().length?"disabled":""}>${zd?"Ringing the bell\u2026":"Start the job"}</button>
      </footer>
      ${e.length?`<section class="jtickets"><p class="jlabel">Started from the front desk</p><ul>${e.map(AC).join("")}</ul></section>`:""}
    </form>`}function yo(){if(!zt?.open)return;let t=zt.querySelector("#jprompt")?.value,n=document.activeElement&&zt.contains(document.activeElement)?CC(document.activeElement):null,i=zt.scrollTop;zt.innerHTML=RC(),t!==void 0&&(zt.querySelector("#jprompt").value=t),n&&zt.querySelector(n)?.focus(),zt.scrollTop=i,kC()}function CC(e){if(e.id)return`#${e.id}`;if(e.name&&e.value)return`input[name="${e.name}"][value="${CSS.escape(e.value)}"]`;for(let t of["data-template","data-jstop","data-jfind","data-copy"])if(e.hasAttribute(t))return`[${t}="${CSS.escape(e.getAttribute(t))}"]`;return e.classList.contains("jgo")?".jgo":null}function Rm(e){let n=ma.find(o=>o.id===Yi).templates[e]?.[1];if(!n)return;let i=zt.querySelector("#jprompt");i.value=n,i.focus();let s=n.indexOf("[");s>=0?i.setSelectionRange(s,n.indexOf("]",s)+1):i.setSelectionRange(n.length,n.length)}function kC(){for(let t of zt.querySelectorAll('input[name="jkind"]'))t.onchange=()=>{let n=ma.find(o=>o.id===Yi),i=zt.querySelector("#jprompt"),s=i.value.trim()&&!n.templates.some(([,o])=>o===i.value);Yi=t.value,yo(),s||(zt.querySelector("#jprompt").value="",Rm(0),Am||zt.querySelector(`input[name="jkind"][value="${Yi}"]`)?.focus())};for(let t of zt.querySelectorAll('input[name="jroom"]'))t.onchange=()=>{go=t.value,yo()};for(let t of zt.querySelectorAll("[data-template]"))t.onclick=()=>Rm(Number(t.dataset.template));for(let t of zt.querySelectorAll("[data-jclose]"))t.onclick=()=>zt.close();for(let t of zt.querySelectorAll("[data-jstop]"))t.onclick=()=>IC(t.dataset.jstop);for(let t of zt.querySelectorAll("[data-jfind]"))t.onclick=()=>{zt.close(),cr.pick(t.dataset.jfind)};for(let t of zt.querySelectorAll("[data-copy]"))t.onclick=async()=>{try{await navigator.clipboard.writeText(t.dataset.copy),t.textContent="Copied"}catch{t.textContent="Select and copy it"}};let e=zt.querySelector("#jprompt");e.onkeydown=t=>{t.key==="Enter"&&(t.metaKey||t.ctrlKey)&&(t.preventDefault(),zt.querySelector("form").requestSubmit())},zt.querySelector("form").onsubmit=t=>{t.preventDefault(),PC()}}async function PC(){let e=zt.querySelector("#jprompt").value.trim();if(!e){lr="Say what the job is first.",yo(),zt.querySelector("#jprompt").focus();return}if(!go)return;let t=D_(e);zd=!0,lr="",yo();let n=!1;try{if(cr.isDemo())n=NC({dir:go,prompt:e,title:t,kind:Yi});else{let i=await fetch("/jobs",{method:"POST",headers:{"content-type":"application/json","x-agent-office-token":km},body:JSON.stringify({dir:go,prompt:e,title:t,kind:Yi})}),s=await i.json().catch(()=>({}));n=i.ok,n||(lr=s.error?`Couldn\u2019t start it: ${s.error}`:"Couldn\u2019t start it.")}}catch{lr="Couldn\u2019t reach the bridge. Is it still running?"}zd=!1,n?(lr="",zt.querySelector("#jprompt").value="",zt.close(),Ol(`Ding! A new teammate is on the way to \u201C${t}\u201D.`)):yo()}async function IC(e){let t=Os.get(e);if(t){if(cr.isDemo()){t.state="stopped",B_();return}try{let n=await fetch("/jobs/stop",{method:"POST",headers:{"content-type":"application/json","x-agent-office-token":km},body:JSON.stringify({id:e})});n.ok||Ol(`Couldn\u2019t stop it: ${(await n.json().catch(()=>({}))).error??"the bridge said no"}`,t,!0)}catch{Ol("Couldn\u2019t reach the bridge to stop it.",t,!0)}}}var LC=0,DC=U0();function NC({dir:e,prompt:t,title:n,kind:i}){let s=`demo-job-${++LC}`,o=r=>cr.ingest({t:Date.now(),job:s,...r});o({kind:"job.start",dir:e,title:n,type:i,prompt:t,demo:!0});let a=Os.get(s);return DC({id:s,dir:e},t,r=>o({kind:"job.update",...r})),!!a}var Cm;function Ol(e,t,n=!1){if(!Cm)return;let i=document.createElement("div");i.className=`jtoast paper ${n?"bad":""}`,i.innerHTML=`<span>${Vd("bell")}</span><p>${k(e)}</p>${t?'<button type="button">Open the desk</button>':""}`,i.querySelector("button")?.addEventListener("click",()=>{$d(),i.remove()}),Cm.append(i),setTimeout(()=>i.remove(),n||t?.state==="blocked"?14e3:6e3)}function B_(){let e=[...Os.values()].filter(i=>i.state==="blocked").length,t=[...Os.values()].filter(i=>O_.has(i.state)).length,n=document.getElementById("newjob-count");n&&(n.textContent=e?String(e):t?String(t):"",n.classList.toggle("asking",e>0),n.title=e?`${e} waiting for your OK`:t?`${t} running`:""),yo()}function $d(e){if(!zt)return;e&&(Yi=e),lr="",zt.open||zt.showModal(),yo(),zt.querySelector("#jprompt").value||Rm(0),zt.querySelector(`input[name="jkind"][value="${Yi}"]`)?.focus()}function H_(e){cr=e,zt=document.getElementById("desk"),zt.addEventListener("pointerdown",()=>{Am=!0}),zt.addEventListener("keydown",()=>{Am=!1}),Cm=document.getElementById("toasts"),document.getElementById("newjob")?.addEventListener("click",()=>$d()),document.addEventListener("office:frontdesk",()=>$d()),"closedBy"in HTMLDialogElement.prototype||zt.addEventListener("click",t=>{if(t.target!==zt)return;let n=zt.getBoundingClientRect();(t.clientX<n.left||t.clientX>n.right||t.clientY<n.top||t.clientY>n.bottom)&&zt.close()}),addEventListener("keydown",t=>{t.key==="n"&&!t.metaKey&&!t.ctrlKey&&!t.altKey&&!/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName)&&!zt.open&&(t.preventDefault(),$d())}),setInterval(()=>{zt.open&&!zt.contains(document.activeElement)&&yo()},15e3)}function OC(e){if(!e?.length)return null;let t=e.length,n=e.filter(s=>s.status==="completed").length,i=e.find(s=>s.status==="in_progress");return{done:n,total:t,frac:n/t,now:i?i.active??i.text:void 0,finished:n===t,words:n===t?t===1?"Done":`All ${t} done`:`${n} of ${t} done`}}function Gd(e,{big:t=!1}={}){let n=OC(e);if(!n)return"";let i=Math.round(n.frac*100);return`<span class="prog ${t?"big":""} ${n.finished?"all":""}">
    <span class="prog-bar" role="progressbar" aria-label="Checklist" aria-valuemin="0" aria-valuemax="${n.total}" aria-valuenow="${n.done}" aria-valuetext="${n.words}"><i style="width:${i}%"></i></span>
    <span class="prog-words"><b>${n.words}</b>${t&&n.now&&!n.finished?` \xB7 now: ${k(n.now)}`:""}</span>
  </span>`}var Xd={pr:{name:"Pull request",icon:"\u21E1"},artifact:{name:"Doc",icon:"\u25C8"},link:{name:"Link",icon:"\u2197"},plan:{name:"Plan",icon:"\u270E"},image:{name:"Picture",icon:"\u25A3"},file:{name:"File",icon:"\u25A4"}},jd=e=>["pr","artifact","link","plan"].includes(e.type),Wd=e=>`${e.session}|${e.id}`,FC=e=>{try{return new URL(e).host.replace(/^www\./,"")}catch{return""}};function BC(e){return e.url?{href:e.url}:e.type==="image"||e.type==="plan"&&e.text?{zoom:Wd(e)}:null}function Yd(e){return e.url?{text:e.url,label:"Copy link"}:e.path?{text:e.path,label:"Copy path"}:e.text?{text:e.text,label:"Copy text"}:null}function $_(e){let t=new Map;for(let n of e)t.has(n.session)||t.set(n.session,[]),t.get(n.session).push(n);return[...t].map(([n,i])=>({session:n,items:i}))}var HC=4e3;function Dm(e,{where:t="",now:n=Date.now(),copied:i=null}={}){let s=Xd[e.type]??{name:"Output",icon:"\u2022"},o=BC(e),a=Yd(e),r=[e.url?FC(e.url):e.path,t,Ae(e.t)].filter(Boolean).join(" \xB7 "),c=e.meta?.additions!==void 0?`<span class="diff"><ins>+${e.meta.additions}</ins> <del>\u2212${e.meta.deletions??0}</del></span>`:"",l=i===Wd(e),u=o?o.href?`<a class="dv-btn primary" href="${k(o.href)}" target="_blank" rel="noopener">Open<span aria-hidden="true"> \u2197</span></a>`:`<button type="button" class="dv-btn primary" data-zoom="${k(o.zoom)}">Open</button>`:"",d=a?`<button type="button" class="dv-btn ${l?"done":""}" data-copy="${k(Wd(e))}" aria-label="${k(`${a.label}: ${e.title}`)}">${l?"Copied \u2713":a.label}</button>`:"";return`
    <article class="dv ${k(e.type)} ${n-e.t<HC?"fresh":""}" data-dv="${k(Wd(e))}">
      <p class="dv-kind"><i>${s.icon}</i>${s.name}${e.meta?.state?` \xB7 ${k(e.meta.state)}`:""}${c}</p>
      <h4 class="dv-title">${k(e.title??s.name)}</h4>
      ${r?`<p class="dv-sub">${k(r)}</p>`:""}
      ${u||d?`<p class="dv-acts">${u}${d}</p>`:""}
    </article>`}var qd=null,Kd=(e=Date.now())=>qd&&e<qd.until?qd.key:null;async function Nm(e){try{return await navigator.clipboard.writeText(e),!0}catch{let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.cssText="position:fixed;opacity:0;pointer-events:none",document.body.append(t),t.select();let n=!1;try{n=document.execCommand("copy")}catch{}return t.remove(),n}}function z_(e,{find:t,redraw:n}){for(let i of e.querySelectorAll("[data-copy]"))i.onclick=async s=>{s.preventDefault(),s.stopPropagation();let o=t(i.dataset.copy),a=o&&Yd(o);!a||!await Nm(a.text)||(qd={key:i.dataset.copy,until:Date.now()+1600},n(),setTimeout(n,1700))}}var Fl=new Map,Qd=new Map,Hl=e=>`${e.who?.session??e.session??""}|${e.id}`;function $C(e,t,n,i){let s=e[t]??[],o=i?s.includes(n)?s.filter(a=>a!==n):[...s,n]:[n];return{...e,[t]:o}}function W_(e,t,n=""){if(n.trim())return!0;let i=e.questions??[];return i.length>0&&i.every((s,o)=>t[o]?.length)}function Bl(e,t,n=""){if(e.type==="plan")return{choice:"keep",...n.trim()&&{note:n.trim()}};let i={};return(e.questions??[]).forEach((s,o)=>{t[o]?.length&&(i[s.question]=t[o].join(", "))}),{answers:i,...n.trim()&&{note:n.trim()}}}function Om(e,t){return t.choice==="keep"?"Kept planning":[...Object.values(t.answers??{}),...t.note?[t.note]:[]].join(" \xB7 ")}function q_(e){let t=e.type==="question"&&e.questions?.length===1?e.questions[0]:null;return t&&!t.multiSelect?t.options.map(n=>n.label).slice(0,4):void 0}var Jd=e=>(Fl.has(e)||Fl.set(e,{picks:{}}),Fl.get(e)),th=(e,t,n)=>!!Fl.get(e)?.picks[t]?.includes(n),X_=e=>Fl.get(e),eh=e=>{Qd.set(Hl(e),e)},nh={can:()=>!1,send:async()=>({ok:!1})};function j_(e){nh=e}var ih=e=>!!(e&&nh.can(e)),Y_=e=>!!(e&&nh.canApprove?.(e)),Zd=e=>document.querySelector(`[data-ans-note="${CSS.escape(e)}"]`)?.value??"";async function ga(e,t){let n=Qd.get(e),i=Jd(e);if(!n||i.status==="Sending\u2026")return;i.status="Sending\u2026",i.ok=void 0,Um();let s=await nh.send(n,t).catch(o=>({ok:!1,status:String(o.message??o)}));i.ok=s.ok,i.status=s.ok?`Sent: ${Om(n,t)}. Claude carries on.`:`Not sent: ${s.status??"the bridge said no"}. You can still answer in Claude Code.`,Um()}var Um=()=>document.dispatchEvent(new CustomEvent("office:answered"));function zC(e){let t=e.target.closest?.("[data-ans]");if(!t)return;e.preventDefault(),e.stopPropagation();let n=t.dataset.key,i=Qd.get(n);if(!i)return;let s=Jd(n);switch(t.dataset.ans){case"pick":{let o=Number(t.dataset.q??0),a=i.questions?.[o];s.picks=$C(s.picks,o,t.dataset.label,!!a?.multiSelect),i.questions?.length===1&&!a?.multiSelect?ga(n,Bl(i,s.picks,Zd(n))):Um();break}case"send":W_(i,s.picks,Zd(n))&&ga(n,Bl(i,s.picks,Zd(n)));break;case"keep":ga(n,Bl(i,{},Zd(n)));break;case"say":ga(n,{say:t.dataset.label});break}}function VC(e){let t=e.target.closest?.("[data-ans-note]");if(!t||e.key!=="Enter"||e.isComposing)return;e.preventDefault();let n=t.dataset.ansNote,i=Qd.get(n);i&&(i.type==="plan"?ga(n,Bl(i,{},t.value)):W_(i,Jd(n).picks,t.value)&&ga(n,Bl(i,Jd(n).picks,t.value)))}var G_=!1;function K_(){G_||(G_=!0,document.addEventListener("click",zC,!0),document.addEventListener("keydown",VC))}var Z_=(e,t)=>`${e} ${t}${e===1?"":"s"}`,zl=e=>e.src??(e.path?`/asset?${new URLSearchParams({session:e.session,id:e.id})}`:""),GC={question:"Asks you",permission:"Wants to run",plan:"Plan to approve"};function Bm(e,{answerable:t,compact:n=!1}={}){let i=e.who?.kind==="agent"?`<span class="ask-who">${k(e.who.label)}</span>`:"",s=Hl(e);t&&eh(e);let o=t?X_(s):void 0,a=o?.status==="Sending\u2026"||o?.ok===!0,r=(g,y,m=0)=>`data-ans="${g}" data-key="${k(s)}" data-q="${m}" data-label="${k(y)}"${a?" disabled":""}`,c=(g,y,m,p)=>{if(!t)return`<span class="ask-opt ${m}"><b>${k(g)}</b>${y?`<span>${k(y)}</span>`:""}</span>`;let x=th(s,p,g);return`<button type="button" class="ask-opt ${m} ${x?"picked":""}" aria-pressed="${x}" ${r("pick",g,p)}><b>${k(g)}</b>${y?`<span>${k(y)}</span>`:""}</button>`},l=(g,y="")=>t?`<button type="button" class="ask-opt ${y}" ${r("say",g)}><b>${k(g)}</b></button>`:`<span class="ask-opt ${y}"><b>${k(g)}</b></span>`,u=g=>`<input class="ask-note" type="text" data-ans-note="${k(s)}" placeholder="${k(g)}" aria-label="${k(g)}" maxlength="2000"${a?" disabled":""}>`,d="",h="";if(e.type==="question"){let g=e.questions??[];d=g.map((m,p)=>{let x=m.options.some(b=>b.preview);return`
      <div class="ask-q">
        <p class="ask-text"><span class="chip">${k(m.header)}</span>${k(m.question)}${m.multiSelect?'<small class="ask-multi">pick any</small>':""}</p>
        <div class="ask-opts ${x&&!n?"previews":""}">${m.options.map((b,v)=>x&&!n?t?`<button type="button" class="ask-opt pic ${v===0?"rec":""} ${th(s,p,b.label)?"picked":""}" aria-pressed="${th(s,p,b.label)}" ${r("pick",b.label,p)}><img alt="" src="${k(b.preview??"")}"><b>${k(b.label)}</b></button>`:`<span class="ask-opt pic ${v===0?"rec":""}"><img alt="" src="${k(b.preview??"")}"><b>${k(b.label)}</b></span>`:c(b.label,n?"":b.description,v===0?"rec":"",p)).join("")}</div>
      </div>`}).join("");let y=g.length>1||g.some(m=>m.multiSelect);t&&(h=`<div class="ask-own">${u(y?"Or your own words\u2026":"Or type your own answer\u2026")}${y?`<button type="button" class="ask-send" ${r("send","")}>Send</button>`:""}</div>`)}else e.type==="permission"?d=`<p class="ask-text"><code>${k(Bo(e.tool))}</code> ${k(e.summary??"")}</p>
      <div class="ask-opts row">${l("Allow","rec")}${l("Deny","no")}</div>`:e.type==="plan"&&(d=`<div class="ask-plan">${(e.plan??"").split(`
`).filter(y=>y.trim()).slice(0,n?3:8).map(y=>/^#/.test(y)?`<b>${k(y.replace(/^#+\s*/,""))}</b>`:`<span>${k(y)}</span>`).join("")}</div>`,t?Y_(e)?d+=`<div class="ask-opts row">${l("Approve","rec")}<button type="button" class="ask-opt no" ${r("keep","")}><b>Keep planning</b></button></div>${u("What should change? (optional)")}`:(d+=`<div class="ask-own">${u("What should change? (optional)")}<button type="button" class="ask-send" ${r("keep","")}>Keep planning</button></div>`,h='<p class="ask-where">To approve, use Claude Code: approving lets Claude start changing things, and only Claude Code can switch that on.</p>'):d+=`<div class="ask-opts row">${l("Approve","rec")}${l("Keep planning","no")}</div>`);let f=o?.status?`<p class="ask-status ${o.ok===!1?"bad":""}" role="status">${k(o.status)}</p>`:"";return`
    <div class="ask ${e.type} ${t?"live":""}">
      <p class="ask-eyebrow"><i class="ask-icon">${e.type==="permission"?">_":e.type==="plan"?"\u270E":"?"}</i>${GC[e.type]??"Asks you"}${i}<time>${Ae(e.t)}</time></p>
      ${d}
      ${h}
      ${f}
      ${t?e.type==="question"&&!o?'<p class="ask-where">Answer here or in Claude Code, whichever is handier.</p>':"":'<p class="ask-where">Answer it in Claude Code; the office shows it so you know it\u2019s waiting.</p>'}
    </div>`}function Hm(e){return to(e)}var WC={completed:"\u2713",in_progress:"\u2731",pending:"\u25CB"};function $m(e,{open:t=!0}={}){let n=e.todos;if(!n?.length)return"";let i=n.filter(s=>s.status==="completed").length;return`
    <details class="todo" ${t?"open":""} data-todo="${k(e.id)}">
      <summary>
        <span class="todo-ring" style="--f:${(i/n.length).toFixed(3)}"></span>
        <b>Checklist</b><span class="todo-count">${n.length} steps</span>
      </summary>
      <ol>${n.map(s=>`<li class="${s.status}"><i>${WC[s.status]??"\u25CB"}</i>${k(s.text)}</li>`).join("")}</ol>
    </details>`}var zm=e=>Gd(e.todos),qC={image:["Image","\u25A3"],artifact:["Artifact","\u25C8"],pr:["Pull request","\u21E1"],link:["Link","\u2197"],file:["File","\u25A4"],plan:["Plan","\u270E"]},XC=e=>{try{return new URL(e).host.replace(/^www\./,"")}catch{return""}};function Bs(e,{withThread:t=!1}={}){let[n,i]=qC[e.type]??["Output","\u2022"],o=[(t?B.get(Ct(e.session)):null)?.label,e.agent?B.get(`a:${e.session}:${e.agent}`)?.label:""].filter(Boolean).join(" \xB7 "),a=`draggable="true" data-handoff="output|${k(e.session)}|${k(e.id)}"`;if(e.type==="image")return`<button type="button" class="out pic" ${a} data-zoom="${k(e.session)}|${k(e.id)}" title="${k(e.title)}">
      <img alt="${k(e.title)}" src="${k(zl(e))}" loading="lazy">
      <span>${k(e.title)}</span>${o?`<small>${k(o)}</small>`:""}</button>`;let r=e.meta?.additions!==void 0?`<span class="diff"><ins>+${e.meta.additions}</ins> <del>\u2212${e.meta.deletions??0}</del></span>`:"",c=[e.type==="file"?e.path:e.url?XC(e.url):"",o].filter(Boolean).join(" \xB7 "),l=e.url?"a":e.type==="plan"?"button":"div",u=e.url?`href="${k(e.url)}" target="_blank" rel="noopener"`:e.type==="plan"?`type="button" data-zoom="${k(e.session)}|${k(e.id)}"`:"";return`<${l} class="out ${e.type}" ${u} ${a}${l==="div"?' tabindex="0"':""} title="${k(e.title)}. Drag it onto a critter (or press H) to hand it over">
    <i class="out-icon">${i}</i>
    <span class="out-main"><b>${k(e.title)}</b><small>${k(n)}${e.meta?.state?` \xB7 ${k(e.meta.state)}`:""}${c?` \xB7 ${k(c)}`:""}</small></span>
    ${r||`<time>${Ae(e.t)}</time>`}
  </${l}>`}function J_(e){let t=e.kind==="session"?e:B.get(Ct(e.session)),n=Zt.filter(l=>l.session===t?.session&&(e.kind==="session"||l.agent===e.agent));if(!n.length&&!e.todos?.length)return'<p class="muted">Nothing made yet. Pictures, artifacts, pull requests and changed files land here as they happen.</p>';let i=n.filter(l=>l.type==="image"),s=n.filter(jd),o=l=>l.agent?B.get(`a:${l.session}:${l.agent}`)?.label??"a helper":"",a=n.filter(l=>l.type==="file"),r=a.reduce((l,u)=>l+(u.meta?.additions??0),0),c=a.reduce((l,u)=>l+(u.meta?.deletions??0),0);return`
    ${$m(e,{open:!0})}
    ${s.length?`<h3>Delivered <small>${s.length}</small></h3><div class="dvs">${s.map(l=>Dm(l,{where:o(l),copied:Kd()})).join("")}</div>`:""}
    ${i.length?`<h3>Pictures <small>${i.length}</small></h3><div class="gallery">${i.slice(0,9).map(l=>Bs(l)).join("")}</div>`:""}
    ${a.length?`<h3>Files changed <small><ins>+${r}</ins> <del>\u2212${c}</del></small></h3><div class="outs files">${a.slice(0,8).map(l=>Bs(l)).join("")}</div>`:""}`}var Q_=e=>Zt.filter(t=>t.session===e.session&&(e.kind==="session"||t.agent===e.agent)&&t.type!=="file").length,$l="all",jC=[["all","All"],["image","Pictures"],["shipped","Artifacts & PRs"],["file","Files"],["plan","Plans"]],YC=e=>$l==="all"?e.type!=="file":$l==="shipped"?["artifact","pr","link"].includes(e.type):e.type===$l;function tb(){let e=Zt.filter(YC),t=$_(e).map(({session:n,items:i})=>{let s=B.get(Ct(n)),o=i.filter(c=>c.type==="image"),a=i.filter(jd),r=i.filter(c=>c.type!=="image"&&!jd(c));return`<section class="lib-group folder">
      <p class="lib-thread"><span>${k(s?.project?mn(s.project,s.projectName):s?.projectName??"")}</span><button type="button" data-pick="${k(Ct(n))}">${k(s?.label??n)}</button><small>${Z_(i.length,"thing")}</small></p>
      ${a.length?`<div class="dvs">${a.slice(0,8).map(c=>Dm(c,{where:c.agent?B.get(`a:${c.session}:${c.agent}`)?.label:"",copied:Kd()})).join("")}</div>`:""}
      ${o.length?`<div class="gallery">${o.slice(0,6).map(c=>Bs(c)).join("")}</div>`:""}
      ${r.length?`<div class="outs files">${r.slice(0,8).map(c=>Bs(c)).join("")}</div>`:""}
    </section>`}).join("");return`
    <header class="lib-head">
      <h2>Library <small>${Z_(Zt.filter(n=>n.type!=="file").length,"output")}</small></h2>
      <button type="button" class="lib-close" data-library="close" aria-label="Close the library">\xD7</button>
    </header>
    <div class="feeds lib-shelves" role="group" aria-label="Show">${jC.map(([n,i])=>`<button type="button" data-shelf="${n}" class="${$l===n?"on":""}">${i}</button>`).join("")}</div>
    <div class="lib-body">${t||'<p class="muted">Nothing on this shelf yet.</p>'}</div>`}function eb(e){$l=e}function nb(e){let[t,n]=e.split("|"),i=Zt.find(c=>c.session===t&&c.id===n);if(!i)return"";let s=B.get(Ct(t)),o=i.type==="plan"?`<article class="lb-plan">${(i.text??"").split(`
`).map(c=>/^#/.test(c)?`<h3>${k(c.replace(/^#+\s*/,""))}</h3>`:c.trim()?`<p>${k(c)}</p>`:"").join("")}</article>`:`<img alt="${k(i.title)}" src="${k(zl(i))}">`,a=Yd(i),r=Kd()===`${i.session}|${i.id}`;return`<figure class="lb-frame paper">${o}<figcaption><b>${k(i.title)}</b><span>${k([s?.label,i.path,Ae(i.t)].filter(Boolean).join(" \xB7 "))}</span>${a?`<button type="button" class="dv-btn ${r?"done":""}" data-copy="${k(`${i.session}|${i.id}`)}">${r?"Copied \u2713":a.label}</button>`:""}</figcaption></figure>`}var ib="agent-office:reduce-motion",Gm=typeof matchMedia=="function"?matchMedia("(prefers-reduced-motion: reduce)"):{matches:!1,addEventListener(){}};function ZC(){try{return localStorage.getItem(ib)==="1"}catch{return!1}}var Vm=ZC(),JC=({system:e,chosen:t})=>!!(e||t),Ci=()=>JC({system:Gm.matches,chosen:Vm}),Wm=()=>Gm.matches;function qm(){typeof document>"u"||(Ci()?document.documentElement.dataset.motion="reduce":delete document.documentElement.dataset.motion)}function sb(e){Vm=!!e;try{localStorage.setItem(ib,Vm?"1":"0")}catch{}qm()}Gm.addEventListener?.("change",qm);qm();var sh={ask:0,you:1,relay:2,mail:3,made:4,answer:5,think:6},tk={answer:6,mail:4,relay:5,you:4,made:5},ek=9,nk=30,ob=90,ik=1.1,ya=(e,t)=>{let n=(e??"").replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1).trimEnd()}\u2026`:n};function sk(e){let t=e.getBoundingClientRect(),n=document.querySelector(".hud.left")?.getBoundingClientRect(),i=document.querySelector("#side")?.getBoundingClientRect();return{l:n?.width?n.right-t.left:0,r:i?.width?i.left-t.left:t.width}}function rb({stage:e,headAt:t,onPick:n}){let i=document.createElement("div");i.className="bubbles",e.append(i);let s=new Map,o=new Map,a=[];function r(f,g,y){let m=o.get(f);return m||(m=document.createElement("div"),m.className=`bub ${g==="think"?"thought":"speech"} ${g}`,m.addEventListener("click",()=>n(m.dataset.pick||y)),i.append(m),o.set(f,m),requestAnimationFrame(()=>m.classList.add("on")),m)}function c(f,g,y,m){s.has(f)||s.set(f,{}),s.get(f)[g]={...y,kind:g,at:m,until:y.ttl===null?1/0:m+(y.ttl??tk[g]??4)}}function l(f,g,y,m){let p=s.get(f)?.[g];if(!y){p&&delete s.get(f)[g];return}p&&p.key===y.key||c(f,g,{...y,ttl:null},p?.at??m)}function u(f,g,y,m){if(Ci())return;let p=document.createElement("div");p.className="bub-fly",p.style.setProperty("--tint",`var(--${y})`),p.innerHTML="<i></i>",i.append(p),a.push({el:p,from:f,to:g,at:m})}function d(f,g){let y=g?ob:nk;switch(f.kind){case"ask":{let m=`<i class="badge ${f.type}">${f.type==="permission"?"&gt;_":f.type==="plan"?"\u270E":"?"}</i><span>${k(g&&f.long?ya(f.long,ob):f.text)}</span>`;return!g||!f.options?m:`${m}<div class="bub-opts" role="group" aria-label="Answer">${f.options.map(p=>`<button type="button" data-ans="pick" data-key="${k(f.answerKey)}" data-q="0" data-label="${k(p)}">${k(ya(p,24))}</button>`).join("")}</div>`}case"made":return`${f.src?`<img alt="" src="${k(f.src)}">`:`<i class="badge ${f.type}">${f.icon??"\u2022"}</i>`}<span>${k(ya(f.text,y))}</span>`;case"mail":case"relay":case"you":return`<b>${k(f.who)}</b><span>${k(ya(f.text,y))}</span>`;case"think":return`<span>${k(ya(f.text,g?60:26))}</span>`;default:return`<span>${k(ya(f.text,y))}</span>`}}function h(f,{selected:g}){let y=[];for(let[b,v]of s){for(let[A,R]of Object.entries(v))f>R.until&&delete v[A];let T=Object.values(v).sort((A,R)=>sh[A.kind]-sh[R.kind]||R.at-A.at)[0];if(!T){s.delete(b);continue}let S=t(b);S&&y.push({critter:b,b:T,head:S,mine:g&&(b===g||T.thread===g)})}y.sort((b,v)=>Number(v.mine)-Number(b.mine)||sh[b.b.kind]-sh[v.b.kind]||v.b.at-b.b.at);let m=[],p=new Set,x=sk(e);y.forEach(({critter:b,b:v,head:T,mine:S},A)=>{let R=`${b}|${v.kind}`;p.add(R);let _=r(R,v.kind,b);_.dataset.pick=v.thread??"";let w=d(v,S);_.dataset.html!==w&&(_.innerHTML=w,_.dataset.html=w);let P=`${w}|${!!S}`;_._shape!==P&&(_._shape=P,_._measureUntil=f+.3),_.classList.toggle("mine",!!S);let D=T.x<x.l-10||T.x>x.r+10;if(_.classList.toggle("far",A>=ek&&!S||D&&v.kind!=="ask"),_._w===void 0||f<_._measureUntil){let Z=_.classList.contains("dot");Z&&_.classList.remove("dot"),_._w=_.offsetWidth,_._h=_.offsetHeight,Z&&_.classList.add("dot")}let U=_._w,H=Math.min(Math.max(T.x,x.l+U/2+8),x.r-U/2-8);_.style.setProperty("--tx",`${Math.max(-U/2+14,Math.min(U/2-14,T.x-H))}px`),_.style.left=`${H}px`,_.style.top=`${T.y}px`;let X={left:H-U/2,right:H+U/2,top:T.y-_._h,bottom:T.y},z=m.some(Z=>X.left<Z.right&&X.right>Z.left&&X.top<Z.bottom&&X.bottom>Z.top);_.classList.toggle("dot",z&&v.kind!=="ask"&&(!S||v.kind==="think")),!_.classList.contains("dot")&&!_.classList.contains("far")&&m.push(X),_.style.zIndex=String(100-A)});for(let[b,v]of o)p.has(b)||(o.delete(b),v.classList.remove("on"),v.classList.add("gone"),setTimeout(()=>v.remove(),300));for(let b=a.length-1;b>=0;b--){let v=a[b],T=(f-v.at)/ik,S=t(v.from),A=t(v.to);if(T>=1||!S||!A){v.el.remove(),a.splice(b,1);continue}let R=T<.5?2*T*T:1-Math.pow(-2*T+2,2)/2,_=Math.sin(Math.PI*R)*Math.min(90,30+Math.hypot(A.x-S.x,A.y-S.y)*.35);v.el.style.left=`${S.x+(A.x-S.x)*R}px`,v.el.style.top=`${S.y+(A.y-S.y)*R-_}px`,v.el.style.opacity=String(Math.min(1,(1-T)*4))}}return{say:c,hold:l,fly:u,tick:h,layer:i}}var db="agent-office-alerts",rh=new Set(["asking","waiting","stuck"]),ab=e=>{let t=/^(\d{1,2}):(\d{2})$/.exec(e??"");return t?Number(t[1])*60+Number(t[2]):null};function Gl(e,t){if(!t?.on)return!1;let n=ab(t.from),i=ab(t.to);if(n===null||i===null||n===i)return!1;let s=e.getHours()*60+e.getMinutes();return n<i?s>=n&&s<i:s>=n||s<i}var ok=(e,t="Agent Office")=>e>0?`(${e}) ${t}`:t;function rk(e,t){return t.filter(n=>rh.has(n.state)&&e.has(n.id)&&e.get(n.id)!==n.state&&(!rh.has(e.get(n.id))||n.state==="asking"))}function ak(e,t){let n=ss(e.prompts?.[0]?.text)||e.label||"A thread",i=e.projectName||e.project?` \xB7 ${mn(e.project??e.projectName,e.projectName)}`:"";if(t==="asking"){let s=(e.asks??[])[0],o=s?.questions?.[0]?.question??(s?.type==="plan"?"It has a plan for you to approve.":s?.type==="permission"?"It needs your OK to go on.":"It has a question for you.");return{title:`A question from \u201C${Vl(n,40)}\u201D`,body:`${Vl(o,140)}${i}`}}return t==="stuck"?{title:`\u201C${Vl(n,40)}\u201D needs a look`,body:`Its last turn didn\u2019t finish.${i}`}:{title:`\u201C${Vl(n,40)}\u201D is waiting on you`,body:`${e.answer?.text?Vl(e.answer.text,140):"Done with your last request."}${i}`}}var Vl=(e,t)=>{let n=String(e).replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1).trimEnd()}\u2026`:n},Xm={alerts:!1,quiet:{on:!1,from:"22:00",to:"08:00"},muted:[]},on=lk();function lk(){try{let e=JSON.parse(localStorage.getItem(db)??"{}");return{...Xm,...e,quiet:{...Xm.quiet,...e.quiet},muted:Array.isArray(e.muted)?e.muted:[]}}catch{return structuredClone(Xm)}}function lb(){try{localStorage.setItem(db,JSON.stringify(on))}catch{}}var ck=()=>typeof Notification<"u",Qm=()=>ck()?Notification.permission:"unsupported",Km=e=>on.muted.includes(e.projectName??"Elsewhere"),Zm="Agent Office",oh=null,cb="";function hb(e){let t=`${e}`;if(t===cb)return;cb=t;let n=getComputedStyle(document.documentElement),i=a=>n.getPropertyValue(`--${a}`).trim(),s=document.createElement("canvas");s.width=s.height=64;let o=s.getContext("2d");o.beginPath(),o.arc(32,32,24,0,Math.PI*2),o.lineWidth=5,o.strokeStyle="#d8cfc2",o.stroke(),o.beginPath(),o.arc(32,32,12,0,Math.PI*2),o.fillStyle=i("accent")||"#b85c3c",o.fill(),o.beginPath(),o.arc(52,18,6,0,Math.PI*2),o.fillStyle="#1f1d1a",o.fill(),e&&(o.beginPath(),o.arc(48,48,15,0,Math.PI*2),o.fillStyle="#ffffff",o.fill(),o.beginPath(),o.arc(48,48,11.5,0,Math.PI*2),o.fillStyle=i("crit")||"#b4483a",o.fill()),oh||(oh=document.querySelector('link[rel="icon"]')??document.head.appendChild(Object.assign(document.createElement("link"),{rel:"icon"}))),oh.href=s.toDataURL("image/png")}var jm=new Map,fb=()=>{},ah=new Map;function uk(e,t){if(!on.alerts||Qm()!=="granted"||Km(e)||Gl(new Date,on.quiet)||document.visibilityState==="visible"&&document.hasFocus())return;let{title:n,body:i}=ak(e,t);try{ah.get(e.id)?.close();let s=new Notification(n,{body:i,tag:e.id,icon:oh?.href});s.onclick=()=>{window.focus(),fb(e.id),s.close()},ah.set(e.id,s)}catch{}}function pb(e){let t=[...B.values()].filter(s=>s.kind==="session"&&!s.past&&s.status!=="done").map(s=>({id:s.id,n:s,state:$e(s,e)}));for(let s of rk(jm,t))uk(s.n,s.state),Km(s.n)||Qn.nudge();jm=new Map(t.map(s=>[s.id,s.state]));let n=t.filter(s=>rh.has(s.state)&&!Km(s.n)).length,i=ok(n,Zm);document.title!==i&&(document.title=i),hb(n>0);for(let[s,o]of ah)rh.has(jm.get(s))||(o.close(),ah.delete(s));zn&&!zn.hidden&&mb()}var zn=null,xo=null;function dk(){let e=Qm();return e==="unsupported"?'<p class="alerts-note">This browser can\u2019t show alerts. The tab title still counts what\u2019s waiting.</p>':e==="denied"?'<p class="alerts-note">Your browser has blocked alerts for this page. You can allow them again in the site settings (the icon left of the address).</p>':e!=="granted"?'<button type="button" class="alerts-ask">Turn on desktop alerts</button><p class="alerts-note">Your browser will ask once. Alerts only show while you\u2019re in another window or tab.</p>':`<label class="alerts-row"><input type="checkbox" data-pref="alerts" ${on.alerts?"checked":""}> <span>Show desktop alerts</span></label><p class="alerts-note">Only while you\u2019re in another window or tab. Click one to open its thread.</p>`}function hk(){let e=new Set(on.muted);for(let t of B.values())t.kind==="session"&&!t.past&&e.add(t.projectName??"Elsewhere");return[...e].sort((t,n)=>t.localeCompare(n))}function mb(){let e=zn.querySelector(".alerts-projects"),t=hk(),n=t.length?t.map(i=>`<label class="alerts-row"><input type="checkbox" data-mute="${ub(i)}" ${on.muted.includes(i)?"checked":""}> <span>Mute <b>${ub(mn(i,i))}</b></span></label>`).join(""):'<p class="alerts-note">Projects with live threads show up here.</p>';e.dataset.html!==n&&!e.contains(document.activeElement)&&(e.dataset.html=n,e.innerHTML=n)}var ub=e=>String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]);function gb(){zn.innerHTML=`
    <p class="eyebrow">Alerts</p>
    <p class="alerts-lede">When a thread is waiting on you, the tab shows how many, like <b>(2) Agent Office</b>.</p>
    <div class="alerts-perm">${dk()}</div>
    <h3>Quiet hours</h3>
    <label class="alerts-row"><input type="checkbox" data-quiet="on" ${on.quiet.on?"checked":""}> <span>Hold alerts during quiet hours</span></label>
    <p class="alerts-times"><span>From</span><input type="time" data-quiet="from" value="${on.quiet.from}" aria-label="Quiet hours start">
      <span>to</span><input type="time" data-quiet="to" value="${on.quiet.to}" aria-label="Quiet hours end"></p>
    <h3>Projects</h3>
    <div class="alerts-projects"></div>
    <p class="alerts-note">A muted project doesn\u2019t alert or count in the tab.</p>`,mb(),Jm()}function Jm(){let e=on.alerts&&Qm()==="granted";xo.classList.toggle("on",e),xo.title=e?Gl(new Date,on.quiet)?"Alerts: on, quiet hours now":"Alerts: on":"Alerts: off"}function Ym(e){zn.hidden=!e,xo.setAttribute("aria-expanded",String(e)),e&&(gb(),zn.querySelector("button, input")?.focus())}function yb(e){fb=e.pick,Zm=document.title||Zm,xo=document.getElementById("alerts-open"),zn=document.getElementById("alerts"),!(!xo||!zn)&&(xo.addEventListener("click",()=>Ym(zn.hidden)),zn.addEventListener("click",async t=>{if(!t.target.closest(".alerts-ask"))return;await Notification.requestPermission()==="granted"&&(on.alerts=!0,lb()),gb(),zn.querySelector("input, button")?.focus()}),zn.addEventListener("change",t=>{let n=t.target;n.dataset.pref==="alerts"?on.alerts=n.checked:n.dataset.quiet==="on"?on.quiet.on=n.checked:n.dataset.quiet&&n.value?on.quiet[n.dataset.quiet]=n.value:n.dataset.mute!==void 0&&(on.muted=on.muted.filter(i=>i!==n.dataset.mute),n.checked&&on.muted.push(n.dataset.mute)),lb(),Jm()}),addEventListener("keydown",t=>{t.key==="Escape"&&!zn.hidden&&(Ym(!1),xo.focus())}),addEventListener("pointerdown",t=>{!zn.hidden&&!zn.contains(t.target)&&!xo.contains(t.target)&&Ym(!1)}),Jm(),hb(!1))}var _b="agent-office-muted",tn=null,ur=null,ys=!1;try{ys=localStorage.getItem(_b)==="1"}catch{}var pk=.6,bb=80;function vb(e){let t=Math.min(100,Math.max(0,Number.isFinite(Number(e))?Number(e):bb))/100;return pk*t*t}function mk(e,{muted:t=!1,quiet:n,now:i=new Date}={}){return t?!1:Gl(i,n)?e==="nudge"&&n.chime!==!1:e!=="nudge"}function gk({gap:e=0,burst:t=1/0,window:n=1}={}){let i=[];return{allow(s){return i.length&&s-i[i.length-1]<e||(i=i.filter(o=>s-o<n),i.length>=t)?!1:(i.push(s),!0)}}}var yk={keys:{gap:.14,burst:6,window:3},chime:{gap:.6,burst:3,window:8},bonk:{gap:.6,burst:3,window:10},pop:{gap:.25,burst:4,window:4},hello:{gap:.8,burst:3,window:10},clink:{gap:.5,burst:2,window:6},bell:{gap:1.5,burst:3,window:20},hush:{gap:1.5,burst:2,window:10},nudge:{gap:4,burst:3,window:60}},xk=new Map(Object.entries(yk).map(([e,t])=>[e,gk(t)])),_k={on:!1,from:"22:00",to:"08:00",chime:!0},$s=Wn("sound-volume",bb),ki={..._k,...Wn("sound-quiet",{})},ch=()=>ys;var bk=()=>Gl(new Date,ki);function wb(){ur&&ur.gain.setTargetAtTime(ys?0:vb($s),tn.currentTime,.02)}function Mb(e){ys=e;try{localStorage.setItem(_b,e?"1":"0")}catch{}wb()}function vk(e){$s=Math.round(Math.min(100,Math.max(0,Number(e)||0))),qn("sound-volume",$s),wb()}function xb(e){ki={...ki,...e},qn("sound-quiet",ki)}function Sb(){if(tn){tn.state==="suspended"&&tn.resume();return}let e=window.AudioContext||window.webkitAudioContext;e&&(tn=new e,ur=tn.createGain(),ur.gain.value=ys?0:vb($s),ur.connect(tn.destination))}function Hs(e){return!tn||document.hidden||!mk(e,{muted:ys,quiet:ki})?!1:xk.get(e)?.allow(tn.currentTime)??!0}function Vn({freq:e,to:t,type:n="sine",dur:i=.15,gain:s=.1,at:o=0,attack:a=.005}){let r=tn.currentTime+o,c=tn.createOscillator(),l=tn.createGain();c.type=n,c.frequency.setValueAtTime(e,r),t&&c.frequency.exponentialRampToValueAtTime(t,r+i),l.gain.setValueAtTime(0,r),l.gain.linearRampToValueAtTime(s,r+a),l.gain.exponentialRampToValueAtTime(1e-4,r+i),c.connect(l).connect(ur),c.start(r),c.stop(r+i+.05)}var lh=null;function tg({dur:e=.03,gain:t=.05,freq:n=3e3,q:i=1.5,type:s="bandpass",to:o,at:a=0}){if(!lh){lh=tn.createBuffer(1,tn.sampleRate*.5,tn.sampleRate);let d=lh.getChannelData(0);for(let h=0;h<d.length;h++)d[h]=Math.random()*2-1}let r=tn.currentTime+a,c=tn.createBufferSource();c.buffer=lh;let l=tn.createBiquadFilter();l.type=s,l.frequency.setValueAtTime(n,r),o&&l.frequency.exponentialRampToValueAtTime(o,r+e),l.Q.value=i;let u=tn.createGain();u.gain.setValueAtTime(t,r),u.gain.exponentialRampToValueAtTime(1e-4,r+e),c.connect(l).connect(u).connect(ur),c.start(r,Math.random()*.4),c.stop(r+e+.02)}var Qn={keys(){Hs("keys")&&(tg({dur:.022,gain:.035,freq:1900+Math.random()*900,q:2}),tg({dur:.018,gain:.022,freq:2300+Math.random()*900,q:2,at:.06+Math.random()*.04}))},chime(){Hs("chime")&&(Vn({freq:1046.5,dur:.7,gain:.05}),Vn({freq:1318.5,dur:.9,gain:.045,at:.09}))},bonk(){Hs("bonk")&&Vn({freq:220,to:160,dur:.2,gain:.05,attack:.012})},pop(){Hs("pop")&&Vn({freq:520,to:980,dur:.09,gain:.045})},hello(){Hs("hello")&&(Vn({freq:880,to:1046,type:"triangle",dur:.08,gain:.04}),Vn({freq:1175,to:1397,type:"triangle",dur:.1,gain:.035,at:.1}))},clink(){Hs("clink")&&(Vn({freq:2637,dur:.18,gain:.025}),Vn({freq:3520,dur:.14,gain:.018,at:.02}))},bell(){Hs("bell")&&(Vn({freq:1568,dur:1.4,gain:.05,attack:.002}),Vn({freq:3951,dur:.6,gain:.018,attack:.002}),Vn({freq:1568,dur:1.2,gain:.03,at:.22,attack:.002}))},hush(){Hs("hush")&&tg({dur:.6,gain:.035,freq:400,to:2200,q:.7})},nudge(){Hs("nudge")&&(Vn({freq:784,dur:1.2,gain:.03,attack:.03}),Vn({freq:1046.5,dur:1.4,gain:.022,at:.28,attack:.03}))},sample(){!tn||ys||(Vn({freq:1046.5,dur:.6,gain:.05}),Vn({freq:1318.5,dur:.8,gain:.045,at:.09}))}};function Eb(){let e=document.getElementById("sound-set"),t=document.getElementById("sound");if(!e)return;let n=()=>{let i=ys?"disabled":"";e.classList.toggle("off",ys),e.innerHTML=`
      <label class="sound-vol"><span>Volume</span>
        <input type="range" min="0" max="100" step="5" value="${$s}" data-sq="volume" aria-valuetext="${$s} percent" ${i}>
        <output>${$s}</output></label>
      <label class="alerts-row"><input type="checkbox" data-sq="on" ${ki.on?"checked":""} ${i}> <span>Hush sounds during quiet hours</span></label>
      <p class="alerts-times"${ki.on?"":" hidden"}><span><span>From</span> <input type="time" data-sq="from" value="${ki.from}" aria-label="Sound quiet hours start" ${i}></span>
        <span><span>to</span> <input type="time" data-sq="to" value="${ki.to}" aria-label="Sound quiet hours end" ${i}></span></p>
      <label class="alerts-row sound-sub"${ki.on?"":" hidden"}><input type="checkbox" data-sq="chime" ${ki.chime?"checked":""} ${i}> <span>Keep one soft chime when a thread waits on you</span></label>
      <p class="alerts-note">${ys?"Sound is off. Turn it on to set these.":bk()?`Quiet now, until ${ki.to}.`:"Busy hours stay gentle: keys and bonks are spaced out."}</p>`};e.addEventListener("input",i=>{i.target.dataset.sq==="volume"&&(vk(i.target.value),i.target.setAttribute("aria-valuetext",`${$s} percent`),e.querySelector("output").textContent=$s)}),e.addEventListener("change",i=>{let s=i.target,o=s.dataset.sq;if(o==="volume")return Qn.sample();if(o==="on"||o==="chime")xb({[o]:s.checked});else if((o==="from"||o==="to")&&s.value)xb({[o]:s.value});else return;n(),e.querySelector(`[data-sq="${o}"]`)?.focus()}),t?.addEventListener("click",n),document.getElementById("settings-open")?.addEventListener("click",n),n()}var wk=90,dh=e=>e&&e.charAt(0).toLowerCase()+e.slice(1),Cb=e=>e&&e.charAt(0).toUpperCase()+e.slice(1),Mk=e=>e.fail.replace(/^Couldn’t /,""),hh=e=>String(e??"").replace(/\s+/g," ").replace(/[\s.!?,;:…]+$/,"").trim();function Tb(e,t=!1){let n=hh(e);return t||(n=n.replace(/`([^`]+)`/g,"$1"),n=n.replace(/(?:^|(?<=\s))(?:the\s+)?([\w.@~-]*[\\/][\w./\\@~-]+|[\w-]+\.(?:[cm]?[jt]sx?|py|rb|go|rs|java|kt|swift|php|cs|cpp|c|h|vue|svelte|md|json|ya?ml|toml|css|scss|html|sql|sh))\b/gi,(i,s)=>Sr(s))),n}var kb=/^(add|answer|build|change|check|clean|compare|create|debug|deploy|design|draft|explain|figure|find|finish|fix|get|harden|help|implement|improve|investigate|look|make|migrate|move|plan|polish|port|prepare|refactor|remove|rename|research|review|rewrite|run|set|ship|show|speed|split|summari[sz]e|support|switch|test|tidy|track|turn|update|upgrade|write)\b/i,Ab=new Set(["run","set","get","put","plan","ship","stop","split","cut","dig","map","swap","trim","drop","tag","log","chat","scan","pin","wrap"]);function Sk(e){let t=/^([A-Za-z]+)\b(.*)$/s.exec(e??"");if(!t||/ing$/i.test(t[1])||!(kb.test(t[1])||Ab.has(t[1].toLowerCase())))return e;let n=t[1].toLowerCase(),i=Ab.has(n)?`${n}${n.at(-1)}ing`:/[^aeiouy]e$/.test(n)?`${n.slice(0,-1)}ing`:`${n}ing`;return`${Cb(i)}${t[2]}`}function _o(e){let t=hh(e);return t?kb.test(t)?`to ${dh(t)}`:`on \u201C${Fa(t,40)}\u201D`:""}var eg={pr:"a pull request",image:"a picture",artifact:"a page",link:"a link",plan:"a plan"},Rb=(e,t)=>t?`${e.tool}${e.summary?` ${e.summary}`:""}`:_i(e.tool,e.summary).now,uh=(e,t)=>{if(t)return`${e.tool}${e.summary?` ${e.summary}`:""}${e.ok===!1?" (failed)":""}`;let n=_i(e.tool,e.summary);return e.ok===!1?n.fail:n.done};function Pn(e,t){let n=e.map(i=>i.filter(Boolean).join("").trim()).filter(Boolean).map(i=>`${Cb(i)}.`.replace(/([.!?…])\.$/,"$1"));return n.find(i=>i.length<=t)??Fa(n.at(-1)??"",t)}function Ek(e={},t=wk){let n=e,i=!!n.dev,s=g=>i?g:dh(g),o=Tb(n.goal,i),a=Sk(Tb(n.step,i)),r=n.total??0,c=n.done??0,l=r&&c<r?`step ${c+1} of ${r}`:"",u=n.last?`after ${s(i?uh(n.last,i):Rb(n.last,i))}`:"",d=n.made?.[0],h=d?`${eg[d.type]??"something"}${d.title?` (\u201C${Fa(hh(d.title),32)}\u201D)`:""}`:"",f=d?eg[d.type]??"something":"";switch(n.state){case"asking":{let g=n.ask??{},y=l?` at ${l}`:"";if(g.type==="permission"){let p=g.tool?i?`${g.tool}${g.summary?` ${g.summary}`:""}`:Mk(_i(g.tool,g.summary)):"go on";return Pn([[`Waiting for your OK to ${p}`,y],[`Waiting for your OK to ${p}`],["Waiting for your OK to go on"]],t)}if(g.type==="plan")return Pn([_o(o).startsWith("to ")?["Has a plan for you to approve, ",_o(o)]:[],["Has a plan for you to approve"]],t);let m=hh(g.question);return Pn([[m&&`Asks you: ${m}?`],["Has a question for you",y]],t)}case"stuck":return Pn([[n.last?.ok===!1?`Stopped: ${s(uh(n.last,i))}`:`Stopped ${u||"before finishing"}`,"; needs a look"],["Stopped before finishing; needs a look"]],t);case"waiting":return r&&c>=r?Pn([[`All ${r} steps done`,f?` and made ${h}`:"","; over to you"],[`All ${r} steps done`,f?` and made ${f}`:"","; over to you"],[`All ${r} steps done; over to you`]],t):d?Pn([[`Made ${h}; over to you`],[`Made ${f}; over to you`]],t):l?Pn([[`Paused at ${l}`,u?` ${u}`:"","; over to you"],[`Paused at ${l}; over to you`]],t):n.last?Pn([[uh(n.last,i)," ",_o(o),"; over to you"],[uh(n.last,i),"; over to you"],["Ready for you"]],t):"Ready for you.";case"ended":return r&&c>=r?Pn([[`Finished all ${r} steps`,f?` and made ${h}`:""],[`Finished all ${r} steps`]],t):d?Pn([[`Finished after making ${h}`],[`Finished after making ${f}`]],t):n.last?Pn([["Ended ",u],["Ended"]],t):"Ended.";default:{let g=n.doing?Rb(n.doing,i):"",y=n.helpers?`with ${n.helpers===1?"a helper":`${n.helpers} helpers`}`:"";if(a){let m=g&&dh(g)!==dh(a)?`, now ${s(g)}`:u?`, ${u}`:"";return Pn([[a,l&&` (${l})`,m],[a,l&&` (${l})`],[a]],t)}return Pn(g?[[g," ",_o(o)],[g,l&&` (${l})`],[g]]:y?[["Working ",y," ",_o(o)],["Working ",y]]:u?[["Thinking it over ",u],["Thinking it over"]]:[[_o(o).startsWith("to ")?`Getting ready ${_o(o)}`:`Getting started ${_o(o)}`],["Getting started"]],t)}}}function Tk(e,t=new Set){let n=e.todos??[],i=n.find(c=>c.status==="in_progress"),s=null,o=0;for(let c of B.values())c.kind==="tool"&&c.status==="active"&&c.owner===e.id&&(s??={tool:c.tool,summary:c.summary}),c.kind==="agent"&&c.session===e.session&&c.status!=="done"&&o++;let a=Bn.get(e.id)?.actions.find(c=>!c.agent),r=to(e)[0];return{state:$e(e,t),goal:ss(e.prompts?.[0]?.text)||"",step:i?i.active??i.text:"",done:n.filter(c=>c.status==="completed").length,total:n.length,doing:s,last:a&&{tool:a.tool,summary:a.summary,ok:a.ok},ask:r&&{type:r.type,question:r.questions?.[0]?.question,tool:r.tool,summary:r.summary},made:Zt.filter(c=>c.session===e.session&&eg[c.type]).slice(0,3).map(c=>({type:c.type,title:c.title})),helpers:o,dev:Ve()}}var Wl=(e,t)=>Ek(Tk(e,t));var Pb="agent-office-milestones";var ng=[{id:"first-output",title:"First thing made",key:"outputs",goal:1,adds:"A trophy for the shelf."},{id:"first-picture",title:"First picture",key:"pictures",goal:1,adds:"A poster went up.",decor:"poster"},{id:"first-pr",title:"First pull request",key:"prs",goal:1,adds:"A neon sign lit up.",decor:"neon"},{id:"turns-10",title:"10 requests",key:"turns",goal:10,adds:"The plant grew.",decor:"plant"},{id:"tools-100",title:"100 tool calls",key:"tools",goal:100,adds:"Another trophy."},{id:"first-team",title:"First agent team",key:"team",goal:2,adds:"Another trophy.",note:"two or more agents on one thread"},{id:"threads-5",title:"5 threads",key:"threads",goal:5,adds:"Another trophy."},{id:"tools-1000",title:"1,000 tool calls",key:"tools",goal:1e3,adds:"The plant grew again.",decor:"plant"}],fh=["turns","tools","outputs","pictures","prs","team"],Ib=new Set(["team"]),Ak=()=>({v:1,projects:{}});function Lb(e,t){return e.projects[t]??={threads:{},folded:{count:0},unlocked:{}}}function Db(e,t,n,i){let s=Lb(e,t),o=s.threads[n],a=o??{},r=!o;for(let c of fh){let l=Math.max(a[c]??0,i[c]??0);l!==(a[c]??0)&&(r=!0),a[c]=l}return o||(s.threads[n]=a,Rk(s)),r}function Rk(e){let t=Object.keys(e.threads);for(let n of t.slice(0,Math.max(0,t.length-300))){let i=e.threads[n];for(let s of fh)e.folded[s]=Ib.has(s)?Math.max(e.folded[s]??0,i[s]):(e.folded[s]??0)+i[s];e.folded.count++,delete e.threads[n]}}function Nb(e,t){let n=e.projects[t],i={threads:0};for(let s of fh)i[s]=n?.folded[s]??0;if(!n)return i;i.threads=n.folded.count+Object.keys(n.threads).length;for(let s of Object.values(n.threads))for(let o of fh)i[o]=Ib.has(o)?Math.max(i[o],s[o]):i[o]+s[o];return i}function Ub(e,t,n=Date.now()){let i=Lb(e,t),s=Nb(e,t),o=[];for(let a of ng)i.unlocked[a.id]||s[a.key]<a.goal||(i.unlocked[a.id]=n,o.push(a));return o}function Ob(e,t){let n=e.projects[t],i=Nb(e,t);return ng.map(s=>({...s,at:n?.unlocked[s.id],have:Math.min(i[s.key],s.goal)}))}function Fb(e,t){let n=ng.filter(i=>e.projects[t]?.unlocked[i.id]);return{trophies:n.length,poster:n.some(i=>i.decor==="poster"),neon:n.some(i=>i.decor==="neon"),plant:n.filter(i=>i.decor==="plant").length}}function Ck(e=globalThis.localStorage){try{let t=JSON.parse(e.getItem(Pb));if(t?.v===1&&t.projects)return t}catch{}return Ak()}var kk=null,ph=()=>kk??=Ck();function Bb(e,t=globalThis.localStorage){try{t.setItem(Pb,JSON.stringify(e))}catch{}}var zs=null;function Pk(){return zs||(zs=document.createElement("div"),zs.className="toasts",zs.setAttribute("role","status"),zs.setAttribute("aria-live","polite"),document.querySelector(".stage-wrap")?.append(zs)??document.body.append(zs),zs)}function $b({icon:e="\u2605",title:t,text:n="",onClick:i}){let s=document.createElement(i?"button":"div");s.className="toast paper",i&&(s.type="button");let o=document.createElement("i");o.textContent=e,o.setAttribute("aria-hidden","true");let a=document.createElement("span"),r=document.createElement("b");r.textContent=t,a.append(r),n&&a.append(` ${n}`),s.append(o,a);let c=Pk();for(c.append(s);c.children.length>3;)c.firstChild.remove();requestAnimationFrame(()=>s.classList.add("on"));let l=()=>{s.classList.remove("on"),setTimeout(()=>s.remove(),300)};return i&&s.addEventListener("click",()=>{i(),l()}),setTimeout(l,6e3),s}var Ik=(e=new Date)=>`My Agent Office \xB7 ${e.toLocaleDateString(void 0,{month:"long",day:"numeric",year:"numeric"})}`,mh=e=>String(e).padStart(2,"0"),Lk=(e=new Date)=>`agent-office-${e.getFullYear()}-${mh(e.getMonth()+1)}-${mh(e.getDate())}-${mh(e.getHours())}${mh(e.getMinutes())}.png`;function zb(e,t,n,i){let s=Math.round(n.left*i),o=Math.round(e-n.right*i),a=Math.round(n.top*i),r=Math.round(t-n.bottom*i);return o-s<e*.45||r-a<t*.45?{x:0,y:0,w:e,h:t}:{x:s,y:a,w:o-s,h:r-a}}function ig(e,t,n,i,s,o){e.beginPath(),e.moveTo(t+o,n),e.arcTo(t+i,n,t+i,n+s,o),e.arcTo(t+i,n+s,t,n+s,o),e.arcTo(t,n+s,t,n,o),e.arcTo(t,n,t+i,n,o),e.closePath()}function Vb({shot:e,tags:t,colors:n,ratio:i,date:s=new Date,detail:o=""}){let a=i,r=Math.round(28*a),c=Math.round(64*a),l=document.createElement("canvas");l.width=e.width+r*2,l.height=e.height+r+c;let u=l.getContext("2d");u.fillStyle=n.paper,u.fillRect(0,0,l.width,l.height),u.save(),u.shadowColor="rgba(40, 30, 20, 0.18)",u.shadowBlur=18*a,u.shadowOffsetY=4*a,ig(u,r,r,e.width,e.height,14*a),u.fillStyle=n.scene,u.fill(),u.restore(),u.save(),ig(u,r,r,e.width,e.height,14*a),u.clip(),u.drawImage(e,r,r),u.textAlign="center",u.textBaseline="middle";for(let f of t){let g=f.kind==="room";u.font=g?`600 ${12*a}px Georgia, serif`:`500 ${10.5*a}px system-ui, sans-serif`;let y=u.measureText(f.text).width+(g?16:12)*a,m=(g?20:17)*a,p=r+f.x,x=r+f.y;u.globalAlpha=.86,u.fillStyle=n.paper,ig(u,p-y/2,x-m/2,y,m,g?6*a:m/2),u.fill(),u.globalAlpha=1,u.fillStyle=n.ink,u.fillText(f.text,p,x+.5*a)}u.restore();let d=e.height+r+c/2,h=r+12*a;return u.fillStyle=n.accent,u.beginPath(),u.arc(h,d,5*a,0,Math.PI*2),u.fill(),u.strokeStyle=n.line,u.lineWidth=1.8*a,u.beginPath(),u.arc(h,d,10*a,0,Math.PI*2),u.stroke(),u.fillStyle=n.ink,u.beginPath(),u.arc(h+8.3*a,d-5.3*a,2.3*a,0,Math.PI*2),u.fill(),u.textAlign="left",u.textBaseline="middle",u.font=`600 ${17*a}px Georgia, serif`,u.fillText(Ik(s),h+22*a,d),o&&(u.textAlign="right",u.fillStyle=n.muted,u.font=`500 ${12*a}px system-ui, sans-serif`,u.fillText(o,l.width-r,d)),l}function Gb(e,t=Lk()){return new Promise(n=>{e.toBlob(i=>{if(!i)return n(!1);let s=URL.createObjectURL(i),o=document.createElement("a");o.href=s,o.download=t,document.body.append(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(s),1e3),n(!0)},"image/png")})}var Wb="agent-office:low-power",Nk={fps:0,pixelRatio:2,shadowSize:2048,shadowEvery:3},Uk={fps:30,pixelRatio:1,shadowSize:1024,shadowEvery:6},ql=!1;try{ql=localStorage.getItem(Wb)==="1"}catch{}var bo=()=>ql?Uk:Nk,qb=()=>ql,Xb=new Set,jb=e=>Xb.add(e);function Yb(e){ql=!!e;try{localStorage.setItem(Wb,ql?"1":"0")}catch{}for(let t of Xb)t(bo())}function Kb(e,t,n){return n?e-t>=1e3/n-4:!0}var Fk=["bg","paper","ink","muted","line","accent","accent-ink","on-accent","focus","scroll-thumb","scroll-thumb-hover"],Bk=["scene","floor","thread","clay","wood","wood-dark","trim","glow","window","gem","room-a","room-b","room-c","room-d","room-e","room-f","night","dawn","dusk","carpet","outer-wall","desk","tile","counter","fridge"],DO=[...Fk,...Bk];var Hk={sky:1,sun:1,env:1,sunColor:"#fffaf2"},vo={cozy:{name:"Cozy",hint:"Warm wood, soft walls and the sky outside",light:{},dark:{},look:{roomFloor:"planks",walls:"plain",officeFloor:"carpet",coffeeFloor:"checker",windows:"sky",trimGlow:0,galley:!1,coffeeName:"Coffee corner",light:Hk,swatch:["#e6cfae","#f6d8c6","#b85c3c"]}},studio:{name:"Studio",hint:"Bright and simple: white oak, concrete, gallery light",light:{bg:"#f2f2ef",paper:"#ffffff",ink:"#1b1b1a",muted:"#5c5c58",line:"#e2e2dd",accent:"#2d5bd1","accent-ink":"#2a54c2","on-accent":"#ffffff",focus:"#2d5bd1","scroll-thumb":"#d4d4cf","scroll-thumb-hover":"#9a9a95",scene:"#eceae5",floor:"#e3e1db",thread:"#85837d",clay:"#2d5bd1",wood:"#e8dbc4","wood-dark":"#4a453e",trim:"#fafaf8",glow:"#fff2dc",window:"#cde4f4",gem:"#f2c14e","room-a":"#f3ebe4","room-b":"#e6efea","room-c":"#e8e9f3","room-d":"#f2eddb","room-e":"#f2e6ea","room-f":"#e4edf3",night:"#27324d",dawn:"#f3d4b8",dusk:"#d8afba",carpet:"#cdcbc6","outer-wall":"#f7f7f4",desk:"#f0e8d9",tile:"#dddbd6",counter:"#f4f4f1",fridge:"#efefec"},dark:{bg:"#161718",paper:"#202123",ink:"#ededeb",muted:"#a4a4a0",line:"#36373a",accent:"#7ea2ff","accent-ink":"#8eaeff","on-accent":"#121314",focus:"#8eaeff","scroll-thumb":"#3e3f42","scroll-thumb-hover":"#75767a",scene:"#18191b",floor:"#212225",thread:"#8b8b88",clay:"#7ea2ff",wood:"#8c7f6c","wood-dark":"#2e2c29",trim:"#5c5d60",glow:"#ffe6c0",window:"#3a5f80",gem:"#f5c95a","room-a":"#433e3a","room-b":"#363f3b","room-c":"#3a3b47","room-d":"#423e31","room-e":"#43383b","room-f":"#353e46",night:"#10141f",dawn:"#8a6a5a",dusk:"#6a5060",carpet:"#3b3b3b","outer-wall":"#2b2c2e",desk:"#6f6250",tile:"#3d3d3d",counter:"#4b4c4f",fridge:"#b8b8b5"},look:{roomFloor:"planks",walls:"plain",officeFloor:"concrete",coffeeFloor:"concrete",windows:"sky",trimGlow:0,galley:!1,coffeeName:"Coffee bar",light:{sky:1.12,sun:1.12,env:.9,sunColor:"#ffffff"},swatch:["#e8dbc4","#cdcbc6","#2d5bd1"]}},space:{name:"Space station",hint:"Hull panels, portholes full of stars, a galley for coffee",light:{bg:"#e9edf3",paper:"#f8fafd",ink:"#121925",muted:"#525d6f",line:"#d6dce6",accent:"#0d7891","accent-ink":"#0b6a80","on-accent":"#ffffff",focus:"#0d7891","scroll-thumb":"#c6cfdb","scroll-thumb-hover":"#8392a7",scene:"#0d1220",floor:"#121a2a",thread:"#7c8696",clay:"#18a8c8",wood:"#aab4c2","wood-dark":"#3d4757",trim:"#d9e0e9",glow:"#78e6ff",window:"#0b1020",gem:"#7ef0ff","room-a":"#c9d1dc","room-b":"#c3d3d2","room-c":"#cccbdc","room-d":"#d3cfc2","room-e":"#d5c8d0","room-f":"#c2cfdd",night:"#0b1020",dawn:"#0b1020",dusk:"#0b1020",carpet:"#8f9aa9","outer-wall":"#b6c0cd",desk:"#dfe5ec",tile:"#a3adba",counter:"#7d8a9b",fridge:"#e9eef4"},dark:{bg:"#0c1018",paper:"#141a24",ink:"#e6edf7",muted:"#94a1b5",line:"#263041",accent:"#3fd0ea","accent-ink":"#5fd8ee","on-accent":"#071016",focus:"#5fd8ee","scroll-thumb":"#2a374b","scroll-thumb-hover":"#4f6a8c",scene:"#070a12",floor:"#0d121c",thread:"#7d8aa0",clay:"#3fd0ea",wood:"#323c4b","wood-dark":"#1b212b",trim:"#3d4a5d",glow:"#59e1ff",window:"#0b1020",gem:"#7ef0ff","room-a":"#283243","room-b":"#22373b","room-c":"#2d2b45","room-d":"#38352c","room-e":"#382a3e","room-f":"#223146",night:"#05070d",dawn:"#05070d",dusk:"#05070d",carpet:"#1c2430","outer-wall":"#1f2836",desk:"#3b4658",tile:"#242c39",counter:"#2f3b4d",fridge:"#8e9aab"},look:{roomFloor:"deck",walls:"panels",officeFloor:"deck",coffeeFloor:"deck",windows:"stars",trimGlow:.4,galley:!0,coffeeName:"Galley",light:{sky:.92,sun:.9,env:1.1,sunColor:"#e6f2ff"},swatch:["#323c4b","#78e6ff","#0d7891"]}}},Qb=Object.keys(vo),gh="cozy",yh=e=>Object.hasOwn(vo,e),$k=(e,t)=>vo[yh(e)?e:gh][t==="dark"?"dark":"light"],zk=e=>vo[yh(e)?e:gh].look,Xl=[{id:"coral",name:"Coral"},{id:"tangerine",name:"Tangerine"},{id:"mustard",name:"Mustard"},{id:"leaf",name:"Leaf"},{id:"teal",name:"Teal"},{id:"sky",name:"Sky"},{id:"lilac",name:"Lilac"},{id:"pink",name:"Pink"},{id:"berry",name:"Berry"},{id:"slate",name:"Slate"}],og=e=>Xl.some(t=>t.id===e),rg=[{id:"a",name:"Peach"},{id:"b",name:"Mint"},{id:"c",name:"Lavender"},{id:"d",name:"Butter"},{id:"e",name:"Rose"},{id:"f",name:"Sky"}],ag=e=>rg.some(t=>t.id===e),lg=[{id:"plants",name:"Plants",icon:"\u{1FAB4}"},{id:"books",name:"Books",icon:"\u{1F4DA}"},{id:"art",name:"Art",icon:"\u{1F5BC}\uFE0F"},{id:"lamps",name:"Cosy lamps",icon:"\u{1F6CB}\uFE0F"}],cg=e=>lg.some(t=>t.id===e),Zb=Wn("office-theme",gh),dr=yh(Zb)?Zb:gh,tv=new Set,Jb=[],ug=()=>dr,xh=()=>zk(dr);function Vk(e=globalThis.document){let t=e?.documentElement?.dataset?.theme;return t==="dark"||t==="light"?t:typeof matchMedia=="function"&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function sg(e=globalThis.document){let t=e?.documentElement;if(!t)return;for(let i of Jb)t.style.removeProperty(`--${i}`);let n=$k(dr,Vk(e));for(let[i,s]of Object.entries(n))t.style.setProperty(`--${i}`,s);Jb=Object.keys(n),t.dataset.officeTheme=dr}var ev=e=>tv.add(e),nv=()=>{for(let e of tv)e(dr)};function iv(e){!yh(e)||e===dr||(dr=e,qn("office-theme",e),sg(),nv())}if(globalThis.document?.documentElement){sg();let e=()=>{sg(),nv()};typeof matchMedia=="function"&&matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change",e),typeof MutationObserver=="function"&&new MutationObserver(e).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}var wo=Wn("room-looks",{})??{},Mo=Wn("critter-colors",{})??{};(typeof wo!="object"||Array.isArray(wo))&&(wo={});(typeof Mo!="object"||Array.isArray(Mo))&&(Mo={});var ov=()=>globalThis.document?.dispatchEvent(new CustomEvent("office:looks"));function hr(e){let t=Object.hasOwn(wo,e)?wo[e]:null;return{...ag(t?.wall)&&{wall:t.wall},...cg(t?.decor)&&{decor:t.decor}}}function dg(e,{wall:t,decor:n}={}){let i={...ag(t)&&{wall:t},...cg(n)&&{decor:n}},s={...wo};Object.keys(i).length?s[e]=i:delete s[e],wo=s,qn("room-looks",wo),ov()}function _h(e){let t=Object.hasOwn(Mo,e)?Mo[e]:null;return og(t)?t:null}function hg(e,t){let n={...Mo};og(t)?n[e]=t:delete n[e],Mo=n,qn("critter-colors",Mo),ov()}var Sg=160,Mv=44,Sv=76,Gk=52,Wk=80,Ql=70,Ev=-34,_a=96,xg=185,qk=e=>e<=2?Math.max(1,e):e<=4?2:3,ba=.78,va=18,Ch=9,rv=3,Xk=4,Tv=2500,jk=12e4,Yk=120,Kk=10,Zk=1.2,Jk=38,av=21,Av=1.25,Rv=.2,Cv=2.1,kv=.08,Qk=1e-5,fg=[[0,-62],[-32,-62],[32,-62],[-64,-62],[64,-62],[-16,-90],[16,-90],[-48,-90],[48,-90],[-76,-4],[76,-4],[-76,20],[76,20]],tP=e=>{let[t,n]=fg[e%fg.length],i=Math.floor(e/fg.length);return[t+i*10,n+i*6]},Pv=new Wt("#1c1a17"),Eo=["coral","teal","mustard","lilac","sky","leaf","pink"],eP={Explore:"sky",Plan:"lilac","general-purpose":"leaf","code-reviewer":"pink","test-runner":"mustard"},_g=["a","b","c","d","e","f"],Xs=e=>`${Math.round(e*100)}%`,qs=e=>e>=.85?"crit":e>=.6?"warn":"ok",nc=e=>{let t=0;for(let n of String(e??""))t=t*31+n.charCodeAt(0)>>>0;return t},To=e=>eP[e]??Eo[nc(e)%Eo.length],Pi=e=>_h(e)??Eo[nc(e)%Eo.length],Iv=e=>_g[nc(e)%_g.length],Fs=(e,t)=>hr(t).wall??Iv(e),Re,ie,tc,Ne,Kt,ce,_n,bg,Zl,bn,ui,kt={},je=new Map,Ye=new Map,Ce=new Map,wh=[],Mh=[],Sh=[],Ki=null,Gs=null,Ji=null,xs=null,kh="",ec=()=>{},ic=0,Qi={left:0,right:0,top:0,bottom:0},Zi=null,Vs=null,jl=0,vg=0,bh=0,vn=new L,lv=new L,Ge=()=>performance.now()/1e3,Eh=typeof matchMedia=="function"?matchMedia("(prefers-reduced-motion: reduce)"):{matches:!1},So={};function pg(e,t,n,i){return So.asleep=t,So.perkAt=e.perkAt,So.sulkAt=e.sulkAt,So.cheerAt=e.cheerAt,So.thinking=n,So.idleFor=i,So.seed=e.char.seed,a_(Ge(),So,e.mood??={kind:null,k:0})}function Eg(e,{pick:t}){Re=e,ec=t,ie=new kd({antialias:!0}),ie.setPixelRatio(Math.min(bo().pixelRatio,devicePixelRatio)),ie.shadowMap.enabled=!0,ie.shadowMap.type=Lu,ie.shadowMap.autoUpdate=!1,ie.outputColorSpace=Xe,Re.append(ie.domElement),tc=new Nd,tc.domElement.className="labels",Re.append(tc.domElement),bn=document.createElement("div"),bn.className="bubble",bn.hidden=!0,Re.append(bn),ui=rb({stage:Re,headAt:yP,onPick:i=>ec(i)}),Ne=new Ko;let n=new la(ie);Ne.environment=n.fromScene(new Dd,.04).texture,Ne.environmentIntensity=Rv,n.dispose(),Kt=new gn(32,1,1,6e3),ce=new Ld(Kt,ie.domElement),ce.enableDamping=!0,ce.dampingFactor=kv,ce.enableRotate=!1,ce.screenSpacePanning=!1,ce.mouseButtons={LEFT:Si.PAN,MIDDLE:Si.PAN,RIGHT:Si.PAN},ce.touches={ONE:Vi.PAN,TWO:Vi.PAN},ce.minDistance=120,ce.maxDistance=4e3,ce.enableZoom=!1,ce.addEventListener("start",()=>{Zi=null}),ie.domElement.addEventListener("wheel",$P,{passive:!1}),bg=new yl("#ffffff","#d8cfc2",Av),Ne.add(bg),_n=new bl("#fffaf2",Cv),_n.position.set(-90,220,120),_n.castShadow=!0,_n.shadow.mapSize.set(bo().shadowSize,bo().shadowSize),_n.shadow.radius=6,_n.shadow.bias=-5e-4,_n.shadow.normalBias=.6,Ne.add(_n,_n.target),Zl=new G(new Cn(8e3,8e3),new Qe),Zl.rotation.x=-Math.PI/2,Zl.position.y=-.2,Ne.add(Zl),Lv(),ev(cv),document.addEventListener("office:looks",cv),KP(),new ResizeObserver(hv).observe(Re),hv(),ic=vg=Ge()}function Lv(){let e=getComputedStyle(document.documentElement),t=["floor","line","ok","warn","crit","clay","thread","scene","wood","wood-dark","trim","pot","glow","window","gem","desk","tile","counter","fridge","carpet","outer-wall","night","dawn","dusk",...Xl.map(n=>n.id),..._g.map(n=>`room-${n}`)];for(let n of t)kt[n]=new Wt(e.getPropertyValue(`--${n}`).trim()||"#888");Ne.background=kt.scene,Zl.material.color.copy(kt.scene);for(let n of je.values())n.mesh&&Ws(n.mesh,!0),n.w=null;ye&&(Ws(ye.group,!0),ye=null),ti&&(Ws(ti.group,!0),ti=null),kh="";for(let n of Ye.values()){let i=B.get(n.id);i&&(n.tint=Pi(i.session),n.room=Fs(B.get(`p:${i.project}`)?.label??i.project,i.project)),n.track.material.color.copy(kt.line),n.char.bulb.material.color.copy(kt.gem),n.char.bulb.material.emissive.copy(kt.gem),n.rug.material.color.copy(Nv(n.tint,n.room)),Uv(n),n.gaugeKey=""}for(let n of Ce.values())n.char.bodyMat.color.copy(kt[n.tint]),n.char.accentMat.color.copy(Dv(n.tint));Ph=-1,ie&&(ie.shadowMap.needsUpdate=!0)}var wg=!1;function cv(){wg=!0,Lv()}var Dv=e=>kt[e].clone().multiplyScalar(.62),Nv=(e,t)=>kt[e].clone().lerp(kt[`room-${t}`]??kt.line,.62);function fr(e){return{wood:kt.wood,woodDark:kt["wood-dark"],wall:kt[`room-${e??"a"}`],trim:kt.trim,pot:kt.coral.clone().lerp(kt["wood-dark"],.35),leaf:kt.leaf,shade:kt.trim,glow:kt.glow,sky:kt.window,window:kt.window,desk:kt.desk,tile:kt.tile,counter:kt.counter,fridge:kt.fridge,carpet:kt.carpet,outerWall:kt["outer-wall"],books:Eo.map(t=>kt[t]),mugs:Eo.map(t=>kt[t]),look:xh()}}function Uv(e){e.desk&&Ws(e.desk.group,!0),e.desk=C_(fr(e.room),kt[e.tint]),e.desk.group.position.set(0,ne,Ev),e.desk.group.traverse(t=>{t.isMesh&&(t.userData.pick={kind:"session",id:e.id})}),e.group.add(e.desk.group)}function Ws(e,t=!1){e.removeFromParent(),e.traverse(n=>{if(n.isCSS2DObject&&n.element.remove(),!(!t||!n.isMesh)){n.geometry.userData.shared||n.geometry.dispose();for(let i of[n.material].flat())if(!i.userData.shared){for(let s of[i.map,i.bumpMap,i.alphaMap])s&&!s.userData.shared&&s.dispose();i.dispose()}}})}function sc(e,t){let n=document.createElement("div");return n.className=`tag ${t}`,n.innerHTML=e,{obj:new Cl(n),el:n}}function Th(e,t){let n=document.createElement("div");return n.className=`flag ${e}`,n.innerHTML=t,{obj:new Cl(n),el:n}}function Ih(e,t,n,i=Math.PI*2){let s=new G(new pl(e,t,96,1,Math.PI/2,-i),new Qe({color:n,side:Kn,transparent:!0}));return s.rotation.x=-Math.PI/2,s.position.y=ne+.9,s}var ye=null,ti=null,uv="",In=null;function nP(){return ye||(ye={...P_(fr("a")),w:Dl,d:rr,target:new L,center:new L,placed:!1,taken:new Set,label:sc(`<span class="pname">${k(xh().coffeeName)}</span>`,"project coffee")},ye.label.obj.position.set(-25,62,-rr/2+14),ye.group.add(ye.label.obj),Ne.add(ye.group),ye)}function iP(e,t){let n=`${Math.round(e)}x${Math.round(t)}`;ti&&n===uv||(ti&&Ws(ti.group,!0),ti=I_({W:e,D:t,colors:fr("a")}),uv=n,Ne.add(ti.group),sP(e,t),oP(e,t))}var di=null,Yl=null;function sP(e,t){Yl||(Yl=sc('<button type="button" class="pname" title="Start a new job (n)"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 14h10l-1.4-2V8.5a3.6 3.6 0 0 0-7.2 0V12zM8.5 16.5a1.6 1.6 0 0 0 3 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>Front desk<small>New job</small></button>',"project frontdesk"),Yl.el.addEventListener("click",()=>document.dispatchEvent(new CustomEvent("office:frontdesk")))),di=L_({...fr("a"),accent:kt.clay}),di.group.traverse(n=>{n.isMesh&&(n.userData.pick={kind:"frontdesk"})}),di.group.position.set(e/2-Ql/2-Tm/2-26,.4,t/2-18),Yl.obj.position.set(0,50,0),di.group.add(Yl.obj),ti.group.add(di.group)}function Ov(e){di&&(di.ringAt=e,Qn.chime())}function oP(e,t){if(!In){let o=new Bt,a=new G(new de(8,8.4,3,28),new _e({color:"#3b3a3f",roughness:.4}));a.position.y=1.9;let r=new G(new de(5.4,5.4,.6,24),new _e({color:"#56555c",roughness:.3}));r.position.y=3.6;let c=new G(new Yn(.9,10,10),new Qe({color:"#56e39f"}));c.position.set(0,3.7,6),o.add(a,r,c),o.traverse(l=>{l.isMesh&&(l.castShadow=!0)}),Ne.add(o),In={group:o,led:c,i:0}}let n=e/2-34,i=t/2-34,s=t/2-50;In.loop=[new L(-n,0,s),new L(n,0,s),new L(n,0,-i+30),new L(-n,0,-i+30)],In.group.position.copy(In.loop[0]),In.i=1}var _s=e=>e.past||e.status==="done",Ah=e=>e.lastAt??e.endedAt??e.startedAt??0;function rP(e){let t=new Map;for(let o of B.values())o.kind!=="session"||!o.project||(t.has(o.project)||t.set(o.project,{live:[],past:[]}),t.get(o.project)[_s(o)?"past":"live"].push(o));let n=[];for(let[o,{live:a,past:r}]of t){a.sort((u,d)=>(u.startedAt??0)-(d.startedAt??0)),r.sort((u,d)=>Ah(d)-Ah(u));let c=[...a,...e?r.slice(0,rv):[]];if(!c.length)continue;let l=B.get(`p:${o}`);n.push({id:`p:${o}`,name:l?.label??o,live:a.length,hidden:r.length-(e?Math.min(r.length,rv):0),sessions:c,recent:Math.max(...c.map(Ah))})}let i=n.filter(o=>o.live).sort((o,a)=>o.name.localeCompare(a.name)),s=n.filter(o=>!o.live).sort((o,a)=>a.recent-o.recent).slice(0,Xk);return[...i,...s]}function aP(e){let t=je.get(e.id);t||(t={id:e.id,label:sc("","project"),center:new L,target:new L},t.label.el.addEventListener("click",h=>{let f=h.target.closest("[data-edit-project]");f?document.dispatchEvent(new CustomEvent("office:project-edit",{detail:{id:f.dataset.editProject,raw:f.dataset.raw,anchor:f}})):Uh(xs===e.id?null:e.id)}),je.set(e.id,t));let n=qk(e.sessions.length),i=n*xg+Wk,s=Mv+Sv+(Math.ceil(e.sessions.length/n)-1)*Sg+Gk;t.cols=n;let o=hr(e.id.slice(2)),a=o.wall??Iv(e.name),r=`${a}|${o.decor??""}`;if(t.w!==i||t.d!==s||t.lookKey!==r){t.mesh&&Ws(t.mesh,!0);let h=T_({w:i,d:s,name:e.name,colors:fr(a),decor:o.decor});t.lookKey=r,t.mesh=h.group,t.plants=h.plants,t.decor=A_({w:i,d:s,colors:fr(a),shelfAt:h.shelfAt}),t.mesh.add(t.decor.group),t.decorKey="",t.mesh.position.copy(t.center),t.mesh.add(t.label.obj),Ne.add(t.mesh),t.w=i,t.d=s}t.label.obj.position.set(0,ms+8,-s/2);let c=e.hidden>0?`<span class="pmore">+${e.hidden}</span>`:"",l=e.id.slice(2),u=mn(l,e.name),d=`<button type="button" class="picon" data-edit-project="${k(l)}" data-raw="${k(e.name)}" title="Rename it, or change its icon, walls and decor" aria-label="Rename ${k(u)} or change its icon, walls and decor">${Js(l,e.name)}</button><span class="pname">${k(u)}</span>${c}`;return t.html!==d&&(t.label.el.innerHTML=t.html=d),t.label.el.classList.toggle("focused",xs===e.id),t}function lP(e){let t=Ye.get(e.id);return t||(t={id:e.id,home:new L,group:new Bt,gaugeKey:"",placed:!1},t.tint=Pi(e.session),t.room=Fs(B.get(`p:${e.project}`)?.label??e.project,e.project),t.body=new Bt,t.char=gm({build:"session",bodyColor:kt[t.tint],inkColor:Pv,accentColor:kt.gem,pick:{kind:"session",id:e.id}}),t.char.root.scale.setScalar(va),t.char.root.position.y=ne,t.body.add(t.char.root),t.rug=R_(Nv(t.tint,t.room)),t.track=Ih(22,23.6,kt.line),t.label=sc("","session"),t.label.obj.position.set(0,ne,32),t.label.el.addEventListener("click",()=>ec(e.id)),t.label.el.addEventListener("pointerenter",()=>{Gs=e.id,Ji={kind:"session",id:e.id}}),t.label.el.addEventListener("pointerleave",()=>{Gs===e.id&&(Gs=Ji=null)}),t.zzz=Th("zzz","<i>z</i><i>z</i><i>z</i>"),t.zzz.obj.position.set(10,ne+va*t.char.height+4,0),t.oops=Th("oops","!"),t.oops.obj.position.set(0,ne+va*t.char.height+10,0),t.bell=Th("bell",MP),t.bell.obj.position.set(-14,ne+va*t.char.height+6,0),t.body.add(t.zzz.obj,t.oops.obj,t.bell.obj),t.group.add(t.rug,t.track,t.body,t.label.obj),Uv(t),t.easel=k_(fr(t.room)),t.easel.group.position.set(-50,ne,Ev+4),t.easel.group.rotation.y=.35,t.easel.group.visible=!1,t.easel.group.traverse(n=>{n.isMesh&&(n.userData.pick={kind:"session",id:e.id})}),t.group.add(t.easel.group),t.seen=Zt.filter(n=>n.session===e.session).length,t.walkIn=!_s(e)&&Ge()-ic>3,t.bornAt=Ge(),Ne.add(t.group),Ye.set(e.id,t),t)}function cP(e){let t=Ye.get(e);if(t){Ws(t.group),Ye.delete(e);for(let[n,i]of Ce)i.session===e&&Fv(n)}}function uP(e,t){let n=Ce.get(e.id);if(n)return n;let i=new Set([...Ce.values()].filter(r=>r.session===t.id&&!r.gone&&!r.endedAt).map(r=>r.slot)),s=0;for(;i.has(s);)s++;let o=To(e.type),a=e.status==="done"?-1/0:Ge();return n={id:e.id,session:t.id,slot:s,tint:o,born:a,group:new Bt,gone:e.status==="done"},n.char=gm({build:e.type,bodyColor:kt[o],inkColor:Pv,accentColor:Dv(o),pick:{kind:"agent",id:e.id}}),n.char.root.scale.setScalar(Ch),n.oops=Th("oops small","!"),n.oops.obj.position.set(0,Ch*n.char.height+8,0),n.tag=sc(`<i class="dot ${o}"></i>${k(qe(e).name)}`,"agent"),n.tag.obj.position.set(0,0,9),n.tag.el.addEventListener("click",()=>ec(e.id)),n.group.add(n.char.root,n.oops.obj,n.tag.obj),n.group.visible=!n.gone,Ne.add(n.group),Ce.set(e.id,n),!n.gone&&Ge()-ic>3&&(t.waveAt=Ge(),Qn.pop()),n}function Fv(e){let t=Ce.get(e);t&&(Ws(t.group),t.spot!==void 0&&ye?.taken.delete(t.spot),Ce.delete(e))}function dP(e){let t=[...e.map(a=>je.get(a.id)),nP()],n=Math.max(1,(Re.clientWidth||1)-Qi.left-Qi.right),i=Math.max(1,(Re.clientHeight||1)-Qi.top-Qi.bottom),s=null;for(let a=1;a<=t.length;a++){let r=[];for(let d=0;d<t.length;d+=a)r.push(t.slice(d,d+a));let c=Math.max(...r.map(d=>d.reduce((h,f)=>h+f.w,0)+(d.length-1)*_a))+Ql*2,l=r.reduce((d,h)=>d+Math.max(...h.map(f=>f.d)),0)+(r.length-1)*_a+Ql*2,u=Math.min(n/(c+60),i/(l*Math.sin(ba)+80));(!s||u>s.scale)&&(s={cols:a,W:c,D:l,scale:u})}let o=-s.D/2+Ql;for(let a=0;a<t.length;a+=s.cols){let r=t.slice(a,a+s.cols),c=Math.max(...r.map(d=>d.d)),u=-(r.reduce((d,h)=>d+h.w,0)+(r.length-1)*_a)/2;for(let d of r)d.target.set(u+d.w/2,0,o+d.d/2),d.placed||(d.center.copy(d.target),d.placed=!0),d.rowFront=o+c,u+=d.w+_a;o+=c+_a}return iP(s.W,s.D),{W:s.W,D:s.D}}var ci={W:300,D:Sg};function Tg(e=!1){let t=xs&&je.get(xs),n=t?t.w:ci.W,i=t?t.d:ci.D,s=t?t.target:new L,o=Re.clientWidth||1,a=Re.clientHeight||1,r={x0:Math.min(Qi.left,o*.45),x1:o-Math.min(Qi.right,o*.45),y0:Math.min(Qi.top,a*.45),y1:a-Math.min(Qi.bottom,a*.45)},c=(r.x0+r.x1)/2,l=(r.y0+r.y1)/2,u=(r.x1-r.x0)/2,d=(r.y1-r.y0)/2;Kt.setViewOffset(o,a,o/2-c,a/2-l,o,a);let h=Kt.fov*Math.PI/180,f=2*Math.atan(Math.tan(h/2)*(u/d)),g=Math.max((n+50)/2/Math.tan(f/2),(i*Math.sin(ba)+70)/2/Math.tan(h/2))*(a/(2*d)),y=[];for(let b of[-n/2,n/2])for(let v of[-i/2,i/2+30])for(let T of[0,t?ms+16:66])y.push(new L(s.x+b,T,s.z+v));let m={pos:Kt.position.clone(),quat:Kt.quaternion.clone()},p=new L(s.x,8,s.z);for(let b=0;b<5;b++){Kt.position.set(s.x,Math.sin(ba)*g,s.z+Math.cos(ba)*g),Kt.lookAt(p),Kt.updateMatrixWorld();let v=Math.max(...y.map(T=>{let S=T.clone().project(Kt),A=(S.x+1)/2*o,R=(1-S.y)/2*a;return Math.max(Math.abs(A-c)/(u*.94),Math.abs(R-l)/(d*.94))}));g*=Math.max(.6,v)}let x={pos:new L(s.x,Math.sin(ba)*g,s.z+Math.cos(ba)*g),target:p};t||(ce.maxDistance=g),e||!dv||Ci()?(dv=!0,Kt.position.copy(x.pos),ce.target.copy(x.target),Zi=null):(Kt.position.copy(m.pos),Kt.quaternion.copy(m.quat),Zi=x),Vs=null,ce.update(),Object.assign(_n.shadow.camera,{left:-ci.W/2-80,right:ci.W/2+80,top:ci.D/2+100,bottom:-ci.D/2-100,near:10,far:900}),_n.shadow.camera.updateProjectionMatrix()}var dv=!1;function Lh(e){let t=["left","right","top","bottom"].every(n=>Math.abs((Qi[n]??0)-e[n])<2);Qi=e,t||Tg()}function Dh(e){let t=e&&B.get(e),n=t?.kind==="agent"?B.get(Ct(t.session)):t;Uh(n?.project?`p:${n.project}`:null)}function Nh(e){let t=e&&B.get(e);Ji=t?{kind:t.kind,id:e}:null,Gs=t?.kind==="session"?e:null}function Uh(e){let t=e&&je.has(e)?e:null;t===xs&&Zi||(xs=t,Tg())}function hv(){let e=Re.clientWidth,t=Re.clientHeight;ie.setSize(e,t),tc.setSize(e,t),Kt.aspect=e/Math.max(1,t),Kt.updateProjectionMatrix(),kh=""}var Ag=()=>ci.W/2-Ql/2,Rg=e=>(e?.rowFront??e?.target.z??0)+_a/2;function Cg(e,t,n,i){e.walk={group:t,path:n.map(s=>s.clone?s.clone():s),then:i}}function fv(e,t){let n=e.walk;if(!n)return!1;let i=Ci()?1/0:Yk*t;for(;i>0&&n.path.length;){let s=n.path[0];if(typeof s=="function"){n.path.shift(),s();continue}if(s.wait!==void 0){if(n.until??=Ge()+s.wait,Ge()<n.until)return!0;n.until=null,n.path.shift();continue}let o=n.group.position,a=s.x-o.x,r=s.z-o.z,c=Math.hypot(a,r);if(c>.01){let u=Math.atan2(a,r)-n.group.rotation.y;u=Math.atan2(Math.sin(u),Math.cos(u)),n.group.rotation.y+=u*Math.min(1,t*10)}c<=i?(o.x=s.x,o.z=s.z,i-=c,n.path.shift()):(o.x+=a/c*i,o.z+=r/c*i,i=0)}return n.path.length?!0:(e.walk=null,n.then?.(),!1)}function Bv(e,t=kg(e),n=!1){let i=Ag(),s=Rg(t),o=r=>r.sub(e.home);e.body.visible=!0,e.body.position.copy(o(new L(i,0,ci.D/2+20)));let a=n&&di?[o(new L(i,0,di.group.position.z+8)),()=>{e.body.rotation.y=-Math.PI/2,Ov(Ge()),e.waveAt=Ge()+.3},{wait:1.1}]:[];Cg(e,e.body,[...a,o(new L(i,0,s)),o(new L(e.home.x,0,s)),new L(0,0,0)],()=>{e.body.rotation.y=0})}function hP(e,t){let n=Ag(),i=Rg(kg(e)),s=o=>o.sub(e.home);Cg(e,e.body,[s(new L(e.home.x,0,i)),s(new L(n,0,i)),s(new L(n,0,ci.D/2+20))],t)}function kg(e){let t=B.get(e.id);return t&&je.get(`p:${t.project}`)}function fP(e,t){let n=ye,i=n?n.spots.findIndex((u,d)=>!n.taken.has(d)):-1;if(i<0){e.leaving=Ge();return}n.taken.add(i),e.spot=i;let s=kg(t),o=n.target.clone().add(n.spots[i]),a=(nc(e.id)%5-2)*9,r=Rg(s)+a,c=Ag()+a,l=[new L(e.group.position.x,0,r),new L(c,0,r),new L(c,0,o.z),o];Cg(e,e.group,l,()=>{e.onBreak=Ge(),Qn.clink();let u=new G(new de(.17,.15,.32,12),new _e({color:kt.trim}));u.position.set(.45,-.12,.2),e.char.arms[1].add(u)})}function Pg(e){Ge()-Hv>1&&mP();let t=rP(e),n=new Set;for(let o of t)aP(o),o.sessions.forEach(a=>{n.add(a.id),lP(a)});for(let o of[...je.keys()])t.some(a=>a.id===o)||(Ws(je.get(o).mesh,!0),je.get(o).label.el.remove(),je.delete(o));xs&&!je.has(xs)&&(xs=null);for(let o of[...Ye.keys()])n.has(o)||cP(o);let i=new Set;for(let o of B.values()){if(o.kind!=="agent")continue;let a=Ye.get(Ct(o.session)),r=a&&B.get(a.id);!a||!r||_s(r)||(uP(o,a),i.add(o.id))}for(let o of[...Ce.keys()])i.has(o)||Fv(o);let s=t.map(o=>`${o.id}:${o.sessions.map(a=>a.id).join(",")}`).join("|")+`@${Re.clientWidth}x${Re.clientHeight}`;if(s!==kh){kh=s,ci=dP(t);for(let o of t){let a=je.get(o.id);o.sessions.forEach((r,c)=>{let l=Ye.get(r.id),u=Math.floor(c/a.cols),d=Math.min(a.cols,o.sessions.length-u*a.cols),h=c%a.cols;l.home.set(a.target.x-(d-1)*xg/2+h*xg,0,a.target.z-a.d/2+Mv+Sv+u*Sg),l.placed||(l.group.position.copy(l.home),l.placed=!0,l.walkIn&&Bv(l,a,!!(Im(r)&&di)))})}wg||Tg()}return wg=!1,t}var Hv=-9;function pP(e,t){let n=t.get(e.session),i=e.pastAgents?.length??0;if(!e.past)for(let s of B.values())s.kind==="agent"&&s.session===e.session&&s.status!=="done"&&i++;return{turns:e.turns??0,tools:e.toolCalls??0,outputs:n?.outputs??0,pictures:n?.pictures??0,prs:n?.prs??0,team:i}}function mP(){Hv=Ge();let e=ph(),t=new Map;for(let o of Zt){if(o.type==="file")continue;let a=t.get(o.session)??{outputs:0,pictures:0,prs:0};a.outputs++,o.type==="image"&&a.pictures++,o.type==="pr"&&a.prs++,t.set(o.session,a)}let n=!1,i=new Map;for(let o of B.values())o.kind!=="session"||!o.project||(i.set(o.project,mn(o.project,o.projectName??B.get(`p:${o.project}`)?.label)),Db(e,o.project,o.session,pP(o,t))&&(n=!0));let s=Ge()-ic<6;for(let[o,a]of i){let r=Ub(e,o);r.length&&(n=!0,s||gP(o,a,r))}n&&Bb(e);for(let o of je.values()){if(!o.decor)continue;let a=Fb(e,o.id.slice(2)),r=`${a.trophies}|${a.poster}|${a.neon}|${a.plant}`;r!==o.decorKey&&(o.decorKey=r,o.decor.set(a,o.plants?.[1]),ie.shadowMap.needsUpdate=!0)}}function gP(e,t,n){let i=n.at(-1),s=n.length>1?` (and ${n.length-1} more)`:"";$b({icon:"\u2605",title:`${t}: ${i.title}!${s}`,text:i.adds,onClick:()=>Uh(`p:${e}`)}),Qn.chime();let o=je.get(`p:${e}`);o&&$v(o.center.clone().add(vn.set(0,ms,-o.d/2+20)))}function pr(e){let t=Ce.get(e);if(t&&!t.gone)return t.group.position.clone().add(vn.set(0,Ch*t.char.height,0));let n=Ye.get(e);return n?n.group.position.clone().add(n.body.position).add(vn.set(0,ne+va*n.char.height,0)):null}function yP(e){let t=pr(e);if(!t)return null;let n=Ce.has(e);t.y+=n?5:9;let i=t.project(Kt);if(i.z>1)return null;let s=(i.x+1)/2*Re.clientWidth,o=(1-i.y)/2*Re.clientHeight;return s<-40||o<-40||s>Re.clientWidth+40||o>Re.clientHeight+40?null:{x:s,y:o}}var xP=new Yn(1.7,12,10),_P=new fn(1.6,.3,1);function bP(e,t){let n=new G(xP,new _e({color:t,roughness:.5,transparent:!0}));n.castShadow=!0,n.position.copy(e),Ne.add(n),wh.push({m:n,born:Ge(),from:e.clone(),drift:new L((Math.random()-.5)*6,0,(Math.random()-.5)*6)})}function $v(e){for(let t=0;t<18;t++){let n=new G(_P,new _e({color:kt[Eo[t%Eo.length]],transparent:!0}));n.position.copy(e),Ne.add(n);let i=Math.random()*Math.PI*2,s=14+Math.random()*18;Sh.push({m:n,born:Ge(),vel:new L(Math.cos(i)*s,34+Math.random()*22,Math.sin(i)*s),spin:new L(Math.random()*9,Math.random()*9,Math.random()*9)})}}function vP(e,t,n,i){ui.fly(e,t,n,i)}var wP=matchMedia("(prefers-reduced-motion: reduce)");function Ig(e){let t=Ge();e.kind==="job.start"&&Ov(t);let n=e.agent?Oe(e.session,e.agent):Ct(e.session),i=Ye.get(Ct(e.session));if(e.kind==="tool.start"||e.kind==="tool.end"&&!e.ok){let s=Ce.get(n)??i;if(!s)return;e.kind==="tool.start"?(s.hopAt=t,s.lastAt=t,i&&(i.lookAt=e.agent?n:null),Qn.keys()):(s.failAt=t,Qn.bonk());let o=pr(n);o&&bP(o,e.kind==="tool.end"?kt.crit:kt[Yf(e.tool)]??kt.line)}else if(e.kind==="context.compact"&&i&&!e.agent){let s=Ih(23,24,kt[i.tint]);s.position.x=i.group.position.x,s.position.z=i.group.position.z,Ne.add(s),Mh.push({r:s,born:t}),Qn.hush()}else if(e.kind==="turn.start"&&i&&!e.agent)i.hopAt=t,e.text&&(i.perkAt=t);else if(e.kind==="turn.complete"&&i&&!e.agent){e.reason==="answer"||!e.reason?i.cheerAt=t:e.reason!=="aborted"&&(i.sulkAt=t);let s=pr(i.id);s&&!Ci()&&$v(s),Qn.chime(),e.answer&&ui.say(i.id,"answer",{text:e.answer,thread:i.id},t)}if(e.kind==="turn.complete"&&e.agent&&e.answer&&Ce.has(n)&&ui.say(n,"answer",{text:e.answer,thread:i?.id},t),e.kind==="agent.message"&&i){let s=yi[0];if(!s||s.t!==e.t)return;s.from?(ui.say(s.from,"mail",{who:`To ${s.toName??"someone"}`,text:s.text??"",thread:i.id},t),s.to&&vP(s.from,s.to,"teal",t)):ui.say(s.to??i.id,"relay",{who:s.fromName??"From outside",text:s.text??"",thread:i.id},t)}if(e.kind==="chat.sent"&&i&&ui.say(n,"you",{who:"You",text:e.text??"",thread:i.id},t),e.kind==="asset.add"&&e.type==="pr"&&i){let s=`${e.session}|${e.id}|${e.meta?.state??"open"}`;mv.has(s)||(mv.add(s),gv(i.id,n,t))}if(e.kind==="session.end"&&i&&gv(i.id,i.id,t),(e.kind==="chat.sent"||e.kind==="ask.close")&&i){let s=Ce.get(n)??i;s.perkAt=t}}var MP='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3.2a1.2 1.2 0 0 1 1.2 1.2v.5a5 5 0 0 1 3.8 4.9v3.4l1.4 1.6H3.6L5 13.2V9.8a5 5 0 0 1 3.8-4.9v-.5A1.2 1.2 0 0 1 10 3.2z" fill="currentColor"/><circle cx="10" cy="16.6" r="1.6" fill="currentColor"/></svg>',SP=4.5,EP=70,TP=15,AP=3*6e4,pv=new Map,mv=new Set;function gv(e,t,n){let i=B.get(e),s=i?.project&&`p:${i.project}`;if(!s||n-(pv.get(s)??-99)<TP)return;pv.set(s,n);let o=Ye.get(e);if(!o||o.away)return;Qn.bell(),o.bellAt=n;let a=pr(t)??pr(e);if(!a)return;a.y=0;let r=Ce.get(t)??o;if(r.cheerAt=n,Eh.matches){for(let l of Ye.values())B.get(l.id)?.project===i.project&&(l.cheerAt=n);return}let c=0;for(let l of Ye.values()){let u=B.get(l.id);l===r||l.away||l.walk||!u||_s(u)||u.project!==i.project||(l.gatherAt=n,l.gatherTo=(l.gatherTo??new L).copy(a),l.cheerAt=n+1.1)}for(let l of Ce.values()){let u=B.get(l.session);if(l===r||l.gone||l.endedAt||!u||u.project!==i.project||B.get(l.id)?.status!=="active")continue;let d=c++/6*Math.PI*2+.4;l.gatherAt=n,l.gatherTo=(l.gatherTo??new L).set(a.x+Math.sin(d)*30,ne,a.z+Math.cos(d)*30),l.cheerAt=n+1.1}}var mg=(e,t)=>e.gatherAt===void 0?0:h_((t-e.gatherAt)/SP),vh=typeof location=="object"?Number(new URLSearchParams(location.search).get("hour")):NaN,Mg=Number.isFinite(vh)&&vh>=0&&vh<24&&new URLSearchParams(location.search).has("hour")?vh:null;function zv(){if(Mg!==null)return Mg;let e=new Date;return e.getHours()+e.getMinutes()/60}function RP(e,t,n,i,s){let o=_s(t)||!s&&!t.turnOpen&&!t.asks?.length&&i-(t.lastAt??t.startedAt??i)>AP,a=u_(zv())&&o;return a&&!e.away&&!e.leaving?Ge()-e.bornAt<3||!e.placed?(e.away=!0,e.body.visible=!1):e.walk||(e.leaving=!0,hP(e,()=>{e.away=!0,e.leaving=!1,e.body.visible=!1})):!a&&e.away&&(e.backAt??=n+(s||t.turnOpen?0:nc(e.id)%20),n>=e.backAt&&(e.away=!1,e.backAt=null,Bv(e))),e.away||e.leaving}var Ph=-1,CP=new Wt("#c9d4ff"),gg=[[0,"night"],[5.5,"night"],[7,"dawn"],[9,"window"],[16.5,"window"],[18.5,"dawn"],[19.5,"dusk"],[21,"night"],[24,"night"]];function kP(e){if(e-Ph<5)return;Ph=e;let t=zv(),n=0;for(;gg[n+1][0]<=t;)n++;let[i,s]=gg[n],[o,a]=gg[n+1],r=(t-i)/Math.max(.01,o-i),c=kt[s].clone().lerp(kt[a],r);pa.color.copy(c),pa.emissive.copy(c);let l=s==="night"&&a==="night"?1:s==="window"&&a==="window"?0:s==="night"?1-r:a==="night"?r:.4;pa.emissiveIntensity=.45-l*.15,Ul.emissive.copy(kt.glow),Ul.emissiveIntensity=.45+l*1.1;let u=d_(t),d=xh().light;_n.intensity=(Cv-l*.7-u*.35)*d.sun,_n.color.set(d.sunColor).lerp(CP,l*.6),bg.intensity=(Av-l*.3-u*.3)*d.sky,Ne.environmentIntensity=Rv*(1-l*.5-u*.2)*d.env}function PP(e,t){let n=`${qs(t)}:${t.toFixed(3)}`;n!==e.gaugeKey&&(e.gaugeKey=n,e.gauge&&e.group.remove(e.gauge),e.gauge=t>0?Ih(14.6,16.6,kt[qs(t)],Math.max(.05,Math.PI*2*t)):null,e.gauge&&(e.gauge.position.y+=.05,e.group.add(e.gauge)))}function yv(e,t,n,i,s){let o=e.failAt?(i-e.failAt)/1.4:1;t.rig.rotation.z=o<1&&!s?Math.sin(i*38)*.09*(1-o):0,n.classList.toggle("on",o<1)}function yg(e,t,n){let i=e.waveAt?(n-e.waveAt)/Zk:1;if(i>=1)return;let s=t.arms[0];s.rotation.x=0,s.rotation.z=-(2.1+Math.sin(n*16)*.35)*Math.sin(Math.min(1,i*4)*Math.PI/2)}var Jl=new Map;function IP(e){let t=[];for(let n of Ce.values())n.gone||n.leaving||!n.endedAt||!(n.walk||n.onBreak)||t.push({view:n,pos:n.group.position,walking:!!n.walk});for(let n of Ye.values())n.walk&&t.push({view:n,pos:n.group.position.clone().add(n.body.position),walking:!0});for(let n=0;n<t.length;n++)for(let i=n+1;i<t.length;i++){let s=t[n],o=t[i];if(!s.walking&&!o.walking||Math.hypot(s.pos.x-o.pos.x,s.pos.z-o.pos.z)>Jk)continue;let a=s.view.id<o.view.id?`${s.view.id}|${o.view.id}`:`${o.view.id}|${s.view.id}`;e-(Jl.get(a)??-99)<12||(Jl.set(a,e),s.view.waveAt=o.view.waveAt=e,Qn.hello())}Jl.size>200&&Jl.clear()}var xa=[];function LP(){xa.length=0;for(let e of Ce.values())!e.gone&&!e.walk&&!e.leaving&&e.settled&&xa.push(e);for(let e=0;e<xa.length;e++)for(let t=e+1;t<xa.length;t++){let n=xa[e].group.position,i=xa[t].group.position,s=i.x-n.x,o=i.z-n.z,a=Math.hypot(s,o)||.01;if(a>=av)continue;let r=(av-a)/2;n.x-=s/a*r,n.z-=o/a*r,i.x+=s/a*r,i.z+=o/a*r}}function Lg(){let e=Ge(),t=Math.min(.1,e-vg);vg=e;let n=Ci(),i=n?0:e,s=n?1:.12,o=Date.now(),a=new Set;for(let r of B.values())r.kind==="tool"&&r.status==="active"&&a.add(r.owner);kP(e);for(let r of je.values()){r.center.lerp(r.target,s),r.mesh.position.copy(r.center);for(let c of r.plants??[])c.rotation.z=Math.sin(i*.8+c.userData.plant)*.035;r.decor?.animate(i)}if(di?.ringAt!==void 0){let r=(e-di.ringAt)/.9;di.bell.rotation.z=r<1&&!wP.matches&&!n?Math.sin(e*42)*.25*(1-r):0}if(ye&&(ye.center.lerp(ye.target,s),ye.group.position.copy(ye.center),ye.animate(i)),ti){for(let l of ti.plants)l.rotation.z=Math.sin(i*.7+l.userData.plant)*.03;let r=new Date,c=r.getSeconds()+r.getMilliseconds()/1e3;ti.clock.second.rotation.z=-(c/60)*Math.PI*2,ti.clock.minute.rotation.z=-((r.getMinutes()+c/60)/60)*Math.PI*2,ti.clock.hour.rotation.z=-((r.getHours()%12+r.getMinutes()/60)/12)*Math.PI*2}if(In?.loop&&!n){let r=In.loop[In.i],c=In.group,l=r.x-c.position.x,u=r.z-c.position.z,d=Math.hypot(l,u),h=22*t;if(d<=h)In.i=(In.i+1)%In.loop.length;else{c.position.x+=l/d*h,c.position.z+=u/d*h;let f=Math.atan2(l,u)-c.rotation.y;f=Math.atan2(Math.sin(f),Math.cos(f)),c.rotation.y+=f*Math.min(1,t*4)}In.led.visible=Math.floor(e*2)%2===0}else In&&(In.led.visible=!0);OP();for(let r of Ye.values()){let c=B.get(r.id);if(!c)continue;r.group.position.lerp(r.home,s);let l=_s(c),u=Ke(c),d=fv(r,t),h=a.has(r.id)||o-(c.lastAt??0)<Tv,f=RP(r,c,e,o,h);if(!d&&!f){let S=mg(r,e);if(S>0){vn.copy(r.gatherTo).sub(r.group.position);let A=vn.length();vn.setY(0).multiplyScalar(Math.min(1,Math.max(0,A-30)/Math.max(1,A),EP/Math.max(1,A))*S);let R=n?1:1-Math.pow(5e-4,t);r.body.position.lerp(vn,R),r.body.rotation.y+=(Math.atan2(r.gatherTo.x-r.group.position.x-r.body.position.x,r.gatherTo.z-r.group.position.z-r.body.position.z)*Math.min(1,S*2)-r.body.rotation.y)*R}else r.gatherAt!==void 0&&(r.body.position.lerp(vn.set(0,0,0),1-Math.pow(5e-4,t)),r.body.rotation.y*=Math.pow(5e-4,t),r.body.position.lengthSq()<.01&&(r.body.position.set(0,0,0),r.body.rotation.y=0,r.gatherAt=void 0))}let g=l?0:d||h||mg(r,e)>.05?1:Math.max(0,1-(e-(r.lastAt??-9))/2.5),y=l||!h&&!d&&o-(c.lastAt??c.startedAt??o)>jk,m=r.lookAt&&Ce.get(r.lookAt),p=m&&!m.endedAt?Math.atan2(m.group.position.x-r.group.position.x,m.group.position.z-r.group.position.z):0;Ud(r.char,i,{busy:g,look:d?0:Math.max(-.45,Math.min(.45,p*.3)),hop:r.hopAt&&!n?(e-r.hopAt)/.35:1,alarm:!l&&!d&&u>=Qs,asleep:y});let x=!d&&c.turnOpen&&!a.has(r.id)&&!c.asks?.length&&e-(r.lastAt??-9)>1.2,b=!d&&!h&&!c.turnOpen?(o-(c.lastAt??o))/1e3:0;Od(r.char,e,pg(r,y||d,x,b),Eh.matches||n),yv(r,r.char,r.oops.el,e,n),n||yg(r,r.char,e),r.bell.el.classList.toggle("on",r.bellAt!==void 0&&e-r.bellAt<2.4),r.char.bodyMat.color.copy(kt[r.tint]).lerp(kt.line,l?.6:0),r.char.bulb.visible=!l,r.zzz.el.classList.toggle("on",y&&!d&&!f),r.desk.draw(e,l||f?"off":g>.5&&!d?"busy":"idle",`#${kt[r.tint].getHexString()}`,n),r.desk.steam(i,!l&&!f&&h),r.desk.animateTray?.(i),HP(r,c,e,l||f&&!d),PP(r,u);let v=!l&&u>=Qs;v&&!r.alarm&&(r.alarm=Ih(26.5,27.5,kt.crit),r.group.add(r.alarm)),!v&&r.alarm&&(r.group.remove(r.alarm),r.alarm=null),r.alarm&&(r.alarm.material.opacity=n?.7:.35+.45*(Math.sin(e*3)+1)/2);let T=`<span class="who">${k(qe(c).name)}</span><span class="sname">${k(c.label)}</span>${c.context?.tokens?Ve()?`<span class="pct ${qs(u)}">${Xs(u)}</span>`:Ba(u,{bare:!0}):""}`;r.html!==T&&(r.label.el.innerHTML=r.html=T),r.label.el.classList.toggle("selected",Ki===r.id),r.label.el.classList.toggle("past",l||f)}for(let r of Ce.values()){let c=B.get(r.id),l=Ye.get(r.session);if(!c||!l||(c.status==="done"&&!r.endedAt&&(r.endedAt=e,!r.gone&&(c.endStatus==="failed"||c.endStatus==="killed")&&(r.sulkAt=e),ui.hold(r.id,"think",null,e),r.gone||(r.waveAt=e,l.waveAt=e+.2,r.departAt=e+.9)),r.gone))continue;r.departAt&&e>=r.departAt&&(r.departAt=null,fP(r,l)),yv(r,r.char,r.oops.el,e,n);let u=fv(r,t);if(r.endedAt){if(!u&&r.onBreak&&!r.leaving&&e-r.onBreak>Kk&&(r.leaving=e),Ud(r.char,i+r.slot,{busy:u?1:0,hop:1}),Od(r.char,e,pg(r,!1,!1,0),Eh.matches||n),n||yg(r,r.char,e),r.onBreak&&!r.leaving){let b=lv.copy(ye.target).add(ye.tableAt),v=Math.atan2(b.x-r.group.position.x,b.z-r.group.position.z);r.group.rotation.y+=Math.atan2(Math.sin(v-r.group.rotation.y),Math.cos(v-r.group.rotation.y))*Math.min(1,t*6);let T=!n&&Math.sin((e-r.onBreak)*1.3)>.85;r.char.arms[1].rotation.x=T?-1.3:-.5,r.char.arms[1].rotation.z=.35}if(r.leaving){let b=n?1:Math.min(1,(e-r.leaving)/1.6);r.group.scale.setScalar(Math.max(.01,1-b)),b>=1&&(r.gone=!0,r.group.visible=!1,r.spot!==void 0&&ye?.taken.delete(r.spot))}continue}let d=Ki&&(Ki===l.id||B.get(Ki)?.session===B.get(l.id)?.session);ui.hold(r.id,"think",d&&c.status==="active"&&c.description?{key:c.description,text:c.description,thread:l.id}:null,e);let[h,f]=tP(r.slot),g=lv.set(l.group.position.x+h,ne,l.group.position.z+f),y=mg(r,e);y>0&&g.lerp(r.gatherTo,y);let m=n?1:Math.min(1,(e-r.born)/.6);r.group.rotation.y=y>.05?Math.atan2(r.gatherTo.x-r.group.position.x,r.gatherTo.z-r.group.position.z)*y:Math.atan2(l.group.position.x-r.group.position.x,l.group.position.z-r.group.position.z)*.45,Ud(r.char,i+r.slot,{busy:c.status==="active"&&(a.has(r.id)||e-(r.lastAt??-9)<1.5||y>.05)?1:0,hop:r.hopAt&&!n?(e-r.hopAt)/.3:1,alarm:c.status==="active"&&Ke(c)>=Qs});let p=c.status==="active"&&!a.has(r.id)&&e-(r.lastAt??r.born)>1.5&&!c.asks?.length;Od(r.char,e,pg(r,!1,p,c.status==="idle"?e-(r.lastAt??r.born):0),Eh.matches||n),n||yg(r,r.char,e);let x=B.get(l.id);r.tag.el.classList.toggle("on",!!(d||Gs===l.id||x&&xs===`p:${x.project}`)),r.group.scale.setScalar(Math.max(.01,m<1?m*(1+.2*Math.sin(m*Math.PI)):1)),g.y=ne+(1-m)*(1-m)*40,r.group.position.lerp(g,m<1||!r.settled?1:.1),r.settled=!0}bh%3===0&&IP(e),LP();for(let r=wh.length-1;r>=0;r--){let c=wh[r],l=(e-c.born)/1.6;if(l>=1){Ne.remove(c.m),c.m.material.dispose(),wh.splice(r,1);continue}n?c.m.position.copy(c.from):c.m.position.copy(c.from).addScaledVector(c.drift,l).add(vn.set(0,l*16,0)),c.m.material.opacity=1-l*l}for(let r=Mh.length-1;r>=0;r--){let c=Mh[r],l=(e-c.born)/1.8;if(l>=1){Ne.remove(c.r),Mh.splice(r,1);continue}c.r.scale.setScalar(n?1.6:1+l*2.2),c.r.material.opacity=1-l}for(let r=Sh.length-1;r>=0;r--){let c=Sh[r],l=(e-c.born)/1.5;if(l>=1){Ne.remove(c.m),c.m.material.dispose(),Sh.splice(r,1);continue}c.vel.y-=70*t,c.m.position.addScaledVector(c.vel,t),c.m.position.y<ne+.4&&(c.m.position.y=ne+.4,c.vel.multiplyScalar(.3)),c.m.rotation.x+=c.spin.x*t,c.m.rotation.y+=c.spin.y*t,c.m.material.opacity=1-l*l}if(Zi){let r=1-Math.pow(.002,t);Kt.position.lerp(Zi.pos,r),ce.target.lerp(Zi.target,r),Kt.position.distanceTo(Zi.pos)<.5&&(Zi=null)}zP(t),ce.dampingFactor=1-Math.pow(1-kv,t*60),ce.update(),Zi||GP(),VP(),bh%bo().shadowEvery===0&&(ie.shadowMap.needsUpdate=!0),WP(e,t),ie.render(Ne,Kt),tc.render(Ne,Kt),ui.tick(e,{selected:Ki&&(B.get(Ki)?.kind==="agent"?Ct(B.get(Ki).session):Ki)}),YP(bh%10===1),bh++%6===0&&qP()}var xv=new Map;function DP(e,t){let n=xv.get(e);n||(n=new Image,n.decoding="async",n.src=e,xv.set(e,n)),n.complete&&n.naturalWidth?t(n):n.addEventListener("load",()=>t(n),{once:!0})}var _v={pr:"leaf",artifact:"lilac",plan:"sky",link:"teal"},NP={pr:"\u21E1",artifact:"\u25C8",plan:"\u270E",link:"\u2197",file:"\u25A4"};function UP(e){if(e.type==="question"){let t=e.questions?.[0];return{text:`${t?.header??"Question"}?`,long:t?.question}}return e.type==="permission"?{text:`May I run ${Bo(e.tool)}?`,long:`May I run ${Bo(e.tool)} ${e.summary??""}?`}:{text:"Plan ready. Approve?",long:`Plan ready: ${(e.plan??"").replace(/^#+\s*/,"").split(`
`)[0]}. Approve?`}}var Rh=new Map;function OP(){Rh.clear();for(let e of B.values())if(!(!e.asks?.length||e.kind!=="session"&&e.kind!=="agent"))for(let t of e.asks){let n=Rh.get(e.session);(!n||t.t<n.t)&&Rh.set(e.session,{...t,who:e})}}var bv="",Kl=new Map,FP=[];function BP(e){let t=`${Zt.length}|${Zt[0]?.session}|${Zt[0]?.id}|${Zt[0]?.t}`;if(t!==bv){bv=t,Kl.clear();for(let n of Zt)Kl.has(n.session)||Kl.set(n.session,[]),Kl.get(n.session).push(n)}return Kl.get(e)??FP}function HP(e,t,n,i){let s=i?null:Rh.get(t.session),o=s&&ih(s)?q_(s):void 0;o&&eh(s),ui.hold(e.id,"ask",s&&{key:s.id,type:s.type,...UP(s),thread:e.id,...o&&{options:o,answerKey:Hl(s)}},n),e.desk.showAsk(s?.type,s?.type==="permission"?`#${kt.mustard.getHexString()}`:s?.type==="plan"?`#${kt.sky.getHexString()}`:`#${kt.clay.getHexString()}`);let a=!i&&t.turnOpen&&t.todos?.find(l=>l.status==="in_progress");ui.hold(e.id,"think",a&&{key:a.text,text:a.active??a.text},n);let r=t.todos;e.easel.group.visible=!!r?.length&&!i,e.easel.group.visible&&e.easel.draw(r,`#${kt[e.tint].getHexString()}`,Ci()?.5:n);let c=BP(t.session);if(c.length!==e.seen){let l=c.slice(0,Math.max(0,c.length-(e.seen??0)));e.seen=c.length;let u=l.find(h=>h.type==="image");u&&DP(zl(u),h=>{e.desk.showImage(h,Ge()+6),e.desk.setPhoto(h)});let d=u??l.find(h=>h.type!=="file");if(d){let h=d.agent?Oe(t.session,d.agent):e.id,f={image:"Look: ",pr:"Opened a PR: ",artifact:"Published ",plan:"Wrote a plan: ",link:""}[d.type]??"";ui.say(Ce.get(h)&&!Ce.get(h).gone?h:e.id,"made",{type:d.type,text:`${f}${d.title}`,src:d.type==="image"?zl(d):void 0,icon:NP[d.type],thread:e.id},n),e.hopAt=n}e.desk.setTray(c.filter(h=>_v[h.type]).reverse().map(h=>kt[_v[h.type]]))}}function $P(e){e.preventDefault(),Zi=null;let t=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?100:1);e.ctrlKey&&(t*=10);let n=Vs??Kt.position.distanceTo(ce.target);Vs=Us.clamp(n*Math.pow(.95,-t*.01),ce.minDistance,ce.maxDistance)}function zP(e){if(Vs===null)return;vn.subVectors(Kt.position,ce.target);let t=vn.length(),n=Math.abs(Vs/t-1)<.001||Ci()?Vs:t*Math.pow(Vs/t,1-Math.pow(Qk,e));Kt.position.copy(ce.target).add(vn.setLength(n)),n===Vs&&(Vs=null)}function VP(){let e=Kt.position.distanceTo(ce.target),t=Math.max(1,e*.1);Math.abs(t-Kt.near)<t*.01||(Kt.near=t,Kt.far=e*3+1500,Kt.updateProjectionMatrix())}function GP(){let e=1-Kt.position.distanceTo(ce.target)/ce.maxDistance,t=Math.max(0,e)*ci.W/2,n=Math.max(0,e)*ci.D/2,i=Us.clamp(ce.target.x,-t,t)-ce.target.x,s=Us.clamp(ce.target.z,-n,n)-ce.target.z;!i&&!s||(ce.target.x+=i,ce.target.z+=s,Kt.position.x+=i,Kt.position.z+=s)}function WP(e,t){e-ic<3||t>=.1||(jl=t>1/40?jl+1:Math.max(0,jl-1),!(jl<90||ie.getPixelRatio()<=1)&&(ie.setPixelRatio(Math.max(1,ie.getPixelRatio()-.5)),jl=0))}function qP(){let e=o=>{let a=B.get(o.id);return(Ki===o.id||Gs===o.id?0:a&&!_s(a)?1:2)*1e13-Ah(a??{})},t=(o,a)=>a.some(r=>o.left<r.right+4&&o.right>r.left-4&&o.top<r.bottom+2&&o.bottom>r.top-2),n=[...je.values(),...ye?[ye]:[]].map(o=>o.label.el.getBoundingClientRect());bn.hidden||n.push(bn.getBoundingClientRect());let i=[];for(let o of[...Ye.values()].sort((a,r)=>e(a)-e(r))){let a=o.label.el;a.classList.remove("crowded","covered");let r=Ki===o.id||Gs===o.id&&bn.hidden;if(Ji?.id===o.id&&!bn.hidden){a.classList.add("covered");continue}if(!r&&t(a.getBoundingClientRect(),n)){a.classList.add("covered");continue}!r&&t(a.getBoundingClientRect(),i)&&a.classList.add("crowded"),i.push(a.getBoundingClientRect())}let s=bn.hidden?null:bn.getBoundingClientRect();for(let o of[...je.values(),...ye?[ye]:[]])o.label.el.classList.toggle("covered",!!(s&&t(o.label.el.getBoundingClientRect(),[s])))}function Dg({pixelRatio:e,shadowSize:t}){ie&&(ie.setPixelRatio(Math.min(e,devicePixelRatio)),_n.shadow.mapSize.x!==t&&(_n.shadow.mapSize.set(t,t),_n.shadow.map?.dispose(),_n.shadow.map=null),ie.shadowMap.needsUpdate=!0)}function Ng(e){Ki=e}function XP(e){for(let t of B.values())if(t.kind==="tool"&&t.status==="active"&&t.owner===e)return t;return null}var vv=e=>e>=1e6?`${(e/1e6).toFixed(1)}M`:`${Math.round(e/1e3)}k`,li=(e,t,n="")=>t?`<div><dt>${e}</dt><dd${n?` class="${n}"`:""}>${k(t)}</dd></div>`:"";function jP(e){let t=B.get(e.id);if(!t)return"";let n=XP(t.id),i=Kf(t.id)??"",s=t.context?.tokens?Ve()?`${Xs(Ke(t))} \xB7 ${vv(t.context.tokens)} of ${vv(t.context.window)}`:wr(Ke(t)).word:"";if(t.kind==="agent"){let l=B.get(Ct(t.session)),u=Ce.get(t.id),d=t.status!=="done"?t.status==="idle"?"waiting":"working":u?.walk?"finished, heading for coffee":u?.onBreak&&!u.leaving?"finished, on a coffee break":"finished";return`<b><i class="dot ${To(t.type)}"></i>${k(qe(t).title)}</b>
      ${t.description?`<p>${k(t.description)}</p>`:""}
      <dl>${li("status",d)}${li("doing",i,"words")}${li(Ve()?"context":"energy",s)}${li("model",t.model)}${li("tool calls",t.history?String(t.history):"")}${li("for",l?.label)}</dl>`}let o=!_s(t),a=[...B.values()].filter(l=>l.kind==="agent"&&l.session===t.session&&l.status!=="done").length,r=Bn.get(t.id)?.actions[0],c=Ye.get(t.id)?.away?o?"gone home for the night \xB7 back when there\u2019s work":`ended ${Ae(t.endedAt??t.lastAt)} \xB7 gone home`:o?n||Date.now()-(t.lastAt??0)<Tv?"working":`waiting \xB7 last active ${Ae(t.lastAt)}`:`ended ${Ae(t.endedAt??t.lastAt)}`;return`<b><i class="dot ${Pi(t.session)}"></i>${k(ss(t.prompts?.[0]?.text)||t.label)}</b>
    ${o?`<p class="sum">${k(Wl(t))}</p>`:""}
    <p>${k([t.project?mn(t.project,t.projectName):t.projectName,t.gitBranch].filter(Boolean).join(" \xB7 "))}</p>
    <dl>${li("who",qe(t).title)}${li("status",c)}${li("doing",i||(r?za(r):""),"words")}${li(Ve()?"context":"energy",s)}${li("helpers",a?String(a):"")}${li("model",t.model)}${li("cost",t.costUsd!==void 0?`$${t.costUsd.toFixed(2)}`:"")}</dl>`}function YP(e){if(!Ji){bn.hidden=!0;return}let t=pr(Ji.id);if(!t){bn.hidden=!0;return}(e||bn.hidden)&&(bn.innerHTML=jP(Ji));let n=t.add(vn.set(0,Ji.kind==="agent"?6:10,0)).project(Kt);bn.style.left=`${(n.x+1)/2*Re.clientWidth}px`,bn.style.top=`${(1-n.y)/2*Re.clientHeight}px`,bn.hidden=!1}function KP(){let e=new Jr,t=new At,n=s=>{let o=ie.domElement.getBoundingClientRect();return t.set((s.clientX-o.left)/o.width*2-1,-((s.clientY-o.top)/o.height)*2+1),e.setFromCamera(t,Kt),e.intersectObjects(Ne.children,!0).find(a=>a.object.userData.pick&&a.object.visible)?.object.userData.pick},i=null;ie.domElement.addEventListener("pointerdown",s=>{i=[s.clientX,s.clientY]}),ie.domElement.addEventListener("pointerup",s=>{if(!i||Math.hypot(s.clientX-i[0],s.clientY-i[1])>4)return;let o=n(s);if(o?.kind==="frontdesk")return void document.dispatchEvent(new CustomEvent("office:frontdesk"));ec(o?.id??null)}),ie.domElement.addEventListener("pointermove",s=>{if(s.buttons){Ji=null;return}let o=n(s);Ji=o?.id?o:null,Gs=o?o.kind==="session"?o.id:Ce.get(o.id)?.session??null:null,ie.domElement.style.cursor=o?"pointer":""}),ie.domElement.addEventListener("pointerleave",()=>{Ji=null,Gs=null})}function Ug(){let e=Re.getBoundingClientRect(),t=c=>{let l=c.clone().project(Kt);if(l.z>1)return null;let u=(l.x+1)/2*Re.clientWidth,d=(1-l.y)/2*Re.clientHeight;return u<0||d<0||u>Re.clientWidth||d>Re.clientHeight?null:{x:u+e.left,y:d+e.top}},n=c=>{let l=c?.getBoundingClientRect();return l?.width?{x:l.left+l.width/2,y:l.top+l.height/2,w:l.width,h:l.height}:null},i=[...Ye.values()].filter(c=>B.get(c.id)&&t(c.group.position.clone().add(c.body.position))).sort((c,l)=>!!c.walk-!!l.walk),s=i.find(c=>!_s(B.get(c.id))&&[...Ce.values()].some(l=>l.session===c.id&&!l.gone))??i.find(c=>!_s(B.get(c.id)))??i[0],o=s&&pr(s.id),a=s&&[...Ce.values()].find(c=>c.session===s.id&&!c.gone&&t(c.group.position)),r=[...je.values()].map(c=>n(c.label.el)).find(Boolean);return{critter:s&&t(s.group.position.clone().add(s.body.position).add(vn.set(0,ne+va*s.char.height*.5,0))),beads:o&&t(o.add(vn.set(0,12,0))),ring:s&&!s.walk?t(s.group.position.clone().add(vn.set(0,ne,22))):null,helper:a&&t(a.group.position.clone().add(vn.set(0,Ch*a.char.height*.6,0))),sign:r,coffee:ye&&n(ye.label.el)}}var wv=new Jr;function Og(e,t){if(!ie)return null;let n=ie.domElement.getBoundingClientRect();return wv.setFromCamera(new At((e-n.left)/n.width*2-1,-((t-n.top)/n.height)*2+1),Kt),wv.intersectObjects(Ne.children,!0).find(i=>i.object.userData.pick&&i.object.visible)?.object.userData.pick?.id??null}function Fg(){ie.render(Ne,Kt);let e=ie.domElement,t=ie.getPixelRatio(),n=zb(e.width,e.height,Qi,t),i=document.createElement("canvas");i.width=n.w,i.height=n.h,i.getContext("2d").drawImage(e,n.x,n.y,n.w,n.h,0,0,n.w,n.h);let s=[],o=(a,r,c)=>{if(!r||!a.visible)return;let l=a.getWorldPosition(new L).project(Kt),u=(l.x+1)/2*e.width-n.x,d=(1-l.y)/2*e.height-n.y;l.z>1||u<0||d<0||u>n.w||d>n.h||s.push({x:u,y:d,text:r,kind:c})};for(let[a,r]of je)o(r.label.obj,r.label.el.querySelector(".pname")?.textContent||B.get(a)?.label,"room");for(let a of Ye.values()){let r=B.get(a.id);r&&o(a.label.obj,`${qe(r).name}${a.away?" \xB7 home":""}`,"name")}return{shot:i,tags:s,ratio:t}}var ZP={setHour(e){Mg=e,Ph=-1},get renderer(){return ie},get size(){return ci},sessionViews:Ye,agentViews:Ce,rooms:je,get camera(){return Kt},get stage(){return Re},get controls(){return ce},get coffee(){return ye},greeted:Jl};var mr=e=>(e??"").trim().replace(/\s+/g,"-");function JP(e,t){let n=/(^|\s)@([\w.-]*)$/.exec(e.slice(0,t));return n?{query:n[2],start:t-n[2].length-1}:null}function QP(e,t,n=6){let i=t.toLowerCase(),s=e.filter(a=>mr(a.name).toLowerCase().startsWith(i)),o=e.filter(a=>!s.includes(a)&&mr(a.name).toLowerCase().includes(i));return[...s,...o].slice(0,n)}function tI(e,t){let n=[...t].sort((i,s)=>mr(s.name).length-mr(i.name).length);for(let i of n){let s=new RegExp(`(^|\\s)@${mr(i.name).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(?=$|[\\s,.:;!?])[,:]?`,"i");if(s.test(e))return{to:i,text:e.replace(s,"$1").replace(/\s{2,}/g," ").trim()}}return{to:void 0,text:e}}function Vv(e){let t=e?.kind==="session"?e:e&&B.get(Ct(e.session));if(!t)return[];let n=[],i=s=>s.forEach(({node:o,children:a})=>{n.push({id:o.id,name:o.label,state:On(o),description:o.description}),i(a)});return i(as(t)),n.sort((s,o)=>(s.state==="done")-(o.state==="done"))}function Fh(e,t){let{to:n,text:i}=tI(t,Vv(e));return n?{node:B.get(n.id)??e,text:i||t,to:n}:{node:e,text:t}}function Bh(e,t){if(e.dataset.mentions)return;e.dataset.mentions="1";let n=document.createElement("ul");n.className="mentions",n.setAttribute("role","listbox"),n.id=`mentions-${Math.random().toString(36).slice(2,8)}`,n.hidden=!0,e.setAttribute("aria-autocomplete","list"),e.setAttribute("aria-controls",n.id),e.insertAdjacentElement("afterend",n);let i=[],s=0,o=null,a=()=>{n.hidden=!0,i=[],e.removeAttribute("aria-activedescendant")},r=()=>{n.innerHTML=i.map((l,u)=>`<li role="option" id="${n.id}-${u}" aria-selected="${u===s}" data-i="${u}"><b>@${k(mr(l.name))}</b>${l.description?`<span>${k(l.description)}</span>`:""}${l.state==="done"?"<small>finished \xB7 resumes to answer</small>":""}</li>`).join(""),n.hidden=!i.length,i.length&&e.setAttribute("aria-activedescendant",`${n.id}-${s}`)},c=l=>{let u=i[l];if(!u||!o)return;let d=e.value.slice(0,o.start),h=e.value.slice(e.selectionStart),f=`@${mr(u.name)} `;e.value=d+f+h.replace(/^\S*/,"");let g=d.length+f.length;e.setSelectionRange(g,g),e.dispatchEvent(new Event("input",{bubbles:!0})),a()};e.addEventListener("input",()=>{o=JP(e.value,e.selectionStart);let l=t();i=o&&l?QP(Vv(l),o.query):[],s=0,r()}),e.addEventListener("keydown",l=>{if(!n.hidden){if(l.key==="ArrowDown"||l.key==="ArrowUp")s=(s+(l.key==="ArrowDown"?1:-1)+i.length)%i.length,r();else if((l.key==="Enter"||l.key==="Tab")&&!l.isComposing)c(s);else if(l.key==="Escape")a();else return;l.preventDefault(),l.stopImmediatePropagation()}},!0),n.addEventListener("pointerdown",l=>{let u=l.target.closest("[data-i]");u&&(l.preventDefault(),c(Number(u.dataset.i)))}),e.addEventListener("blur",()=>setTimeout(a,120))}var eI=1500,nI=600,oc=document.querySelector('meta[name="agent-office-token"]')?.content||"",gr=!1;function $g(e){gr=e}var zg=()=>gr,Qt=null,Bg=e=>e.kind==="agent"?{session:e.session,agent:e.agent}:{session:e.session},iI=e=>e.kind==="agent"?e.label:"this session";function Hg(e,t){let n=e.t?`<time>${Ae(e.t)}</time>`:"";switch(e.kind){case"you":return`<div class="tx you"><p>${k(e.text)}</p>${n}</div>`;case"chat":return`<div class="tx you chat"><span class="tx-from">${e.from==="agent-office"?"From the office":`From ${k(e.from)}`}</span><p>${k(e.text)}</p>${n}</div>`;case"say":return`<div class="tx say"><p>${k(e.text)}</p>${n}</div>`;case"note":return`<div class="tx note">${k(e.text)}</div>`;case"output":return`<div class="tx made ${e.output.type}">${Bs(e.output)}</div>`;case"todo":{let i=e.items.filter(o=>o.status==="completed").length,s=e.items.find(o=>o.status==="in_progress");return`<details class="tx todo-snap"><summary><span class="todo-ring" style="--f:${(i/e.items.length).toFixed(3)}"></span>${i===e.items.length?"Checked off the last item":`Checklist ${i}/${e.items.length}${s?`: ${k(s.text)}`:""}`}</summary><ol>${e.items.map(o=>`<li class="${o.status}"><i>${{completed:"\u2713",in_progress:"\u2731"}[o.status]??"\u25CB"}</i>${k(o.text)}</li>`).join("")}</ol></details>`}case"ask":return`<div class="tx asked"><p class="ask-eyebrow"><i class="ask-icon">${e.type==="permission"?">_":e.type==="plan"?"\u270E":"?"}</i>${e.type==="permission"?"Asked to run":e.type==="plan"?"Asked you to approve a plan":"Asked you"}</p><p>${k(e.text)}</p>${e.answer?`<span class="tx-answer">${k(e.answer)}</span>`:""}${n}</div>`;case"tool":{let i=t.get(e.id),s=i?i.ok?"ok":"bad":"running",o=`<i class="tx-dot ${s}"></i><b>${k(e.name)}</b> <span>${k(e.summary??"")}</span>`;return i?.text?`<details class="tx tool ${s}" data-id="${k(e.id)}"><summary>${o}</summary><pre>${k(i.text)}</pre></details>`:`<div class="tx tool ${s}">${o}</div>`}default:return""}}function sI(e,t,n){let i=e.map(h=>({tool:h.name,summary:h.summary,ok:t.get(h.id)?.ok??(n?void 0:!0)})),s=i.some(h=>h.ok===void 0),o=i.filter(h=>h.ok===!1).length,a=s?"running":i.at(-1).ok===!1?"bad":"ok",r=i.filter(h=>h.ok!==void 0),c=i.find(h=>h.ok===void 0),l=c&&_i(c.tool,c.summary).now,u=s?r.length?`${Gf(r)}, now ${l.charAt(0).toLowerCase()}${l.slice(1)}`:l:Gf(i),d=[i.length>1?`${i.length} steps`:"",o&&a!=="bad"?`${o} ${o===1?"bump":"bumps"}`:""].filter(Boolean).join(" \xB7 ");return`<details class="tx steps ${a}" data-id="steps-${k(e[0].id)}"><summary><i class="tx-dot ${a}"></i><span class="step-text">${k(u)}</span>${d?`<small>${d}</small>`:""}</summary><div class="step-lines">${e.map(h=>Hg(h,t)).join("")}</div></details>`}function oI(e,t){if(Ve())return e.map(o=>Hg(o,t)).join("");let n=[],i=[],s=o=>{i.length&&n.push(sI(i,t,o)),i=[]};for(let o of e){if(o.kind==="tool"){i.push(o);continue}s(!1),n.push(Hg(o,t))}return s(!0),n.join("")}function qv(){Qt&&(Qt.html=null,bs())}function rI(e){return`<div class="tx you chat pending ${e.ok===!1?"failed":""}"><span class="tx-from">From the office</span><p>${k(e.text)}</p><span class="tx-status">${k(e.status)}</span></div>`}function bs(){if(!Qt?.root.isConnected)return;let e=Qt.root.querySelector(".tx-log"),t=e.scrollHeight-e.scrollTop-e.clientHeight<60,n=new Map(Qt.entries.filter(a=>a.kind==="result").map(a=>[a.id,a])),i=Qt.entries.filter(a=>a.kind!=="result"),s=oI(i,n)+Qt.pending.map(rI).join("")||`<p class="tx-empty">${k(Qt.empty)}</p>`;if(s===Qt.html)return;Qt.html=s;let o=new Set([...e.querySelectorAll("details[open]")].map(a=>a.dataset.id));e.innerHTML=s;for(let a of e.querySelectorAll("details"))o.has(a.dataset.id)&&(a.open=!0);(t||Qt.firstDraw)&&(e.scrollTop=e.scrollHeight),Qt.firstDraw=!1}async function Wv(){let e=Qt;if(!e?.root.isConnected)return Vg();if(gr){e.entries=Xv(B.get(e.id)),bs();return}if(e.isPolling)return;e.isPolling=!0;let{session:t,agent:n}=e.target,i=new URLSearchParams({session:t,...n?{agent:n}:{},...e.next!==void 0?{after:String(e.next)}:{}});try{let s=await fetch(`/transcript?${i}`);if(s.status===404)e.empty="No transcript yet. It appears once Claude Code has written the first turn.";else if(s.ok){let{entries:o,next:a,reset:r}=await s.json();r&&(e.entries=[]),e.entries=[...e.entries,...o].slice(-nI),e.next=a;for(let c of o)c.kind==="chat"&&(e.pending=e.pending.filter(l=>l.text!==c.text&&!c.text.includes(l.text)));e.empty="Nothing said yet."}}catch{e.empty="The bridge isn't answering. Is it still running?"}finally{e.isPolling=!1}Qt===e&&bs()}function Vg(){Qt?.timer&&clearInterval(Qt.timer),Qt=null}function Xv(e){if(!e)return[];let t=B.get(Ct(e.session)),i=[...Bn.get(Ct(e.session))?.actions??[]].reverse().filter(o=>e.kind==="agent"?o.agent===e.agent:!o.agent),s=e.kind==="agent"?[{kind:"you",text:e.description??`Help with ${t?.label??"the session"}`,t:e.startedAt}]:(e.prompts??[]).map(o=>({kind:"you",text:o.text,t:o.t}));i.forEach(o=>{let a=`demo-${e.id}-${o.t}-${o.tool}`;s.push({kind:"tool",id:a,name:o.tool,summary:o.summary??"",t:o.t}),s.push({kind:"result",id:a,ok:o.ok,text:o.ok?"":"Something went wrong (sample activity)."})});for(let o of Zt)o.session!==e.session||(e.kind==="agent"?o.agent!==e.agent:o.agent)||o.type==="plan"||s.push({kind:"output",output:o,t:o.t});for(let o of e.answered??[])s.push(o);return e.todosLog&&s.push(...e.todosLog),s.push(...rc.get(e.id)??[]),s.sort((o,a)=>(o.t??0)-(a.t??0))}var rc=new Map;async function jv(e){let t=B.get(Qt.id);if(!t||!e.trim())return;let n={text:e.trim(),status:"Sending\u2026"};Qt.pending.push(n),bs();let i=t.kind==="session"?Fh(t,e):{node:t};if(i.node!==t){let s=await wa(i.node,i.text);n.ok=s.ok,n.status=s.ok?`Sent to ${i.node.label}. Its answer shows in its own conversation.`:s.status,bs();return}if(gr){document.dispatchEvent(new CustomEvent("office:event",{detail:{kind:"chat.sent",t:Date.now(),...Qt.target,text:n.text}}));let s=Qt.id;setTimeout(()=>{n.status="Queued as the next prompt",bs()},500),setTimeout(()=>{let o=rc.get(s)??[];o.push({kind:"chat",text:n.text,from:"agent-office",t:Date.now()}),o.push({kind:"say",text:"Got it. (This is the demo: nothing really runs, but in your own office the session reads this as its next prompt and answers here.)",t:Date.now()+1}),rc.set(s,o),Qt?.id===s&&(Qt.pending=Qt.pending.filter(a=>a!==n),Qt.entries=Xv(t),bs())},1800);return}try{let s=await fetch("/chat",{method:"POST",headers:{"content-type":"application/json","x-agent-office-token":oc},body:JSON.stringify({...Qt.target,text:n.text})}),o=await s.json().catch(()=>({}));if(!s.ok)throw new Error(o.error??`the bridge answered ${s.status}`);n.id=o.id,n.status="Waiting for the session to pick it up"}catch(s){n.ok=!1,n.status=`Not sent: ${s.message}`}bs()}function Yv(e){if(!Qt||e.kind!=="chat.delivered")return;let t=Qt.pending.find(n=>n.id===e.id);t&&(t.ok=e.ok!==!1,t.status=t.ok?aI(e.how??"Delivered"):`Couldn't deliver it: ${e.how??"unknown reason"}`,bs())}var aI=e=>e.charAt(0).toUpperCase()+e.slice(1);async function wa(e,t){if(!e||!t.trim())return{ok:!1,status:"Nothing to send"};if(gr){document.dispatchEvent(new CustomEvent("office:event",{detail:{kind:"chat.sent",t:Date.now(),...Bg(e),text:t.trim()}}));let n=rc.get(e.id)??[];return n.push({kind:"chat",text:t.trim(),from:"agent-office",t:Date.now()}),rc.set(e.id,n),{ok:!0,status:"Queued as the next prompt"}}if(!oc)return{ok:!1,status:"Messaging needs the office opened from its bridge (run /office)"};try{let n=await fetch("/chat",{method:"POST",headers:{"content-type":"application/json","x-agent-office-token":oc},body:JSON.stringify({...Bg(e),text:t.trim()})}),i=await n.json().catch(()=>({}));if(!n.ok)throw new Error(i.error??`the bridge answered ${n.status}`);return{ok:!0,status:"Sent. It arrives as the next prompt"}}catch(n){return{ok:!1,status:`Not sent: ${n.message}`}}}async function Kv(e,t){if(Qt?.id===e.id&&Qt.root.isConnected){await jv(t);let n=Qt?.pending.at(-1);return n?.ok===!1?{ok:!1,status:n.status}:{ok:!0}}return wa(e,t)}var yr=()=>gr||!!oc;function Zv(){let e=Qt?.root.querySelector(".tx-compose textarea");return e?.focus(),!!e}function lI(e){return!gr&&!oc?{off:"Messaging needs the office opened from its bridge (run /office)."}:e.kind==="session"&&(e.past||e.status==="done")?{off:"This session has ended. Resume it in Claude Code to talk to it again."}:e.kind==="agent"&&e.status==="done"?{placeholder:`Message ${e.label}\u2026`,hint:"It has finished: a message resumes it to answer, which uses tokens."}:e.kind==="agent"?{placeholder:`Message ${e.label}\u2026`,hint:"Goes straight to this subagent while it works."}:{placeholder:"Message this session\u2026 (@ to pick an agent)",hint:"Arrives as its next prompt, marked as from Agent Office. Tool approvals still happen in Claude Code."}}function Jv(e,t){if(!e||!t||Qt?.id===t.id&&Qt.root===e)return;Vg();let n=lI(t);e.innerHTML=`
    <div class="tx-log" role="log" aria-live="polite" aria-label="Conversation with ${k(iI(t))}"></div>
    ${n.off?`<p class="tx-off">${k(n.off)}</p>`:`<form class="tx-compose">
          <textarea rows="2" placeholder="${k(n.placeholder)}" aria-label="${k(n.placeholder)}"></textarea>
          <button type="submit">Send</button>
          <p class="tx-hint">${k(n.hint)} Enter sends, Shift+Enter starts a new line.</p>
        </form>`}`,Qt={id:t.id,root:e,target:Bg(t),entries:[],pending:[],next:void 0,empty:"Reading the transcript\u2026",firstDraw:!0},e.querySelector(".tx-log").addEventListener("click",o=>{let a=o.target.closest("[data-zoom]");a&&(o.preventDefault(),document.dispatchEvent(new CustomEvent("office:zoom",{detail:a.dataset.zoom})))});let i=e.querySelector("form"),s=i?.querySelector("textarea");s&&t.kind==="session"&&Bh(s,()=>B.get(t.id)),i?.addEventListener("submit",o=>{o.preventDefault();let a=s.value;s.value="",jv(a)}),s?.addEventListener("keydown",o=>{o.key==="Enter"&&!o.shiftKey&&!o.isComposing&&(o.preventDefault(),i.requestSubmit())}),bs(),Wv(),Qt.timer=setInterval(()=>{document.hidden||Wv()},eI)}var Qv=Vg;var Gg=e=>String(e??"").replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),oe=null,ac=null;function $h(){if(!oe||oe.hidden)return;oe.hidden=!0;let e=ac?.anchor;ac=null,e?.isConnected&&e.focus({preventScroll:!0})}function cI(e){let t=e?.getBoundingClientRect?.(),n=oe.offsetWidth,i=oe.offsetHeight,s=t?t.left+t.width/2-n/2:innerWidth/2-n/2,o=t?t.bottom+8:innerHeight/2-i/2,a=o+i>innerHeight-8&&t?t.top-i-8:o;oe.style.left=`${Math.max(8,Math.min(innerWidth-n-8,s))}px`,oe.style.top=`${Math.max(8,Math.min(innerHeight-i-8,a))}px`}function tw(){let{id:e,raw:t}=ac,n=Js(e,t),i=Fs(t,e),s=hr(e).decor,o=()=>W0(e)||Object.keys(hr(e)).length>0;oe.innerHTML=`
    <p class="eyebrow" id="pe-title">Name, icon and room</p>
    <form>
      <label class="pe-name"><span>Name</span><input name="name" maxlength="40" autocomplete="off" value="${Gg(mn(e,t))}" placeholder="${Gg(Uo(t))}"></label>
      <div class="pe-icons" role="group" aria-label="Icon">${G0.map(u=>`<button type="button" data-pick-icon="${u}" aria-pressed="${u===n}" aria-label="Use ${u}">${u}</button>`).join("")}</div>
      <p class="pe-label" id="pe-walls">Walls</p>
      <div class="pe-swatches" role="group" aria-labelledby="pe-walls">${rg.map(u=>`<button type="button" data-pick-wall="${u.id}" class="room-${u.id}" aria-pressed="${u.id===i}" aria-label="${u.name} walls" title="${u.name}"></button>`).join("")}</div>
      <p class="pe-label" id="pe-decor">Decor</p>
      <div class="pe-decor" role="group" aria-labelledby="pe-decor">${lg.map(u=>`<button type="button" data-pick-decor="${u.id}" aria-pressed="${u.id===s}"><span aria-hidden="true">${u.icon}</span>${u.name}</button>`).join("")}</div>
      <p class="pe-from">From <code>${Gg(t)}</code></p>
      <div class="pe-actions">
        <button type="button" data-reset ${o()?"":"disabled"}>Reset</button>
        <button type="submit" class="primary">Done</button>
      </div>
    </form>`;let a=oe.querySelector("form"),r=a.elements.name,c=u=>{let d=oe.querySelector('[aria-pressed="true"]')?.dataset.pickIcon,h=r.value.trim();Df(e,{name:h&&h!==Uo(t)?h:void 0,icon:d&&d!==Lf(t)?d:void 0,...u}),oe.querySelector("[data-reset]").disabled=!o(),document.dispatchEvent(new CustomEvent("office:names"))},l=u=>{dg(e,{...hr(e),...u}),oe.querySelector("[data-reset]").disabled=!o()};for(let u of oe.querySelectorAll("[data-pick-wall]"))u.addEventListener("click",()=>{for(let d of oe.querySelectorAll("[data-pick-wall]"))d.setAttribute("aria-pressed",String(d===u));l({wall:u.dataset.pickWall})});for(let u of oe.querySelectorAll("[data-pick-decor]"))u.addEventListener("click",()=>{let d=u.getAttribute("aria-pressed")!=="true";for(let h of oe.querySelectorAll("[data-pick-decor]"))h.setAttribute("aria-pressed",String(d&&h===u));l({decor:d?u.dataset.pickDecor:void 0})});r.addEventListener("input",()=>c());for(let u of oe.querySelectorAll("[data-pick-icon]"))u.addEventListener("click",()=>{for(let d of oe.querySelectorAll("[data-pick-icon]"))d.setAttribute("aria-pressed",String(d===u));c()});oe.querySelector("[data-reset]").addEventListener("click",()=>{Df(e,{}),dg(e,{}),document.dispatchEvent(new CustomEvent("office:names")),tw(),oe.querySelector("input").focus()}),a.addEventListener("submit",u=>{u.preventDefault(),c(),$h()})}function Wg(e,t,n){if(oe||(oe=document.createElement("div"),oe.className="proj-edit paper",oe.setAttribute("role","dialog"),oe.setAttribute("aria-labelledby","pe-title"),oe.hidden=!0,document.body.append(oe),oe.addEventListener("keydown",s=>{s.key==="Escape"&&(s.stopPropagation(),$h())}),addEventListener("pointerdown",s=>{oe.hidden||oe.contains(s.target)||s.target.closest?.("[data-edit-project]")||$h()})),!oe.hidden&&ac?.id===e)return $h();ac={id:e,raw:t,anchor:n},tw(),oe.hidden=!1,cI(n);let i=oe.querySelector("input");i.focus(),i.select()}document.addEventListener("office:project-edit",e=>Wg(e.detail.id,e.detail.raw,e.detail.anchor));var uI={wrap:"Please wrap up: finish the step you\u2019re on, don\u2019t start anything new, then tell me in a few plain sentences what\u2019s done, what isn\u2019t, and anything I need to decide.",explain:"Please explain what you did in plain words, for someone who isn\u2019t a developer: what you changed, why, and how I can check it. Keep it short."},ew=4e3,lc=new Map,Sa=null;function dI(e,t){if(!e||["ended","done","failed"].includes(t))return[];let n=["explain","wrap"];return e.kind==="session"&&(t==="working"||t==="asking")&&n.push("stop"),n}var hI={wrap:"Wrap up",explain:"Explain what you did",stop:"Stop"},fI={wrap:"Ask it to finish the step it\u2019s on and sum up",explain:"Ask it to explain its work in plain words",stop:"End the turn it\u2019s running, like pressing Esc in Claude Code"};function iw(e,t){if(!yr())return"";let n=dI(e,t);if(!n.length)return"";let i=Sa?.id===e.id&&Date.now()<Sa.until,s=lc.get(e.id);return`
    <div class="quick" role="group" aria-label="Quick actions">
      ${n.map(o=>`<button type="button" class="quick-${o} ${o==="stop"&&i?"armed":""}" data-act="${o}" data-node="${k(e.id)}" title="${k(fI[o])}">${o==="stop"&&i?"Stop now?":hI[o]}</button>`).join("")}
    </div>
    ${s?`<p class="quick-note ${s.ok===!1?"bad":""}" role="status">${k(s.text)}</p>`:""}`}var sw=async()=>({ok:!1,status:"Stop isn\u2019t available here"});function ow(e){sw=e}var Ma=()=>document.dispatchEvent(new CustomEvent("office:refresh"));async function pI(e,t){if(e==="stop"){if(!(Sa?.id===t.id&&Date.now()<Sa.until))return Sa={id:t.id,until:Date.now()+ew},setTimeout(Ma,ew+50),Ma();Sa=null,lc.set(t.id,{text:"Stopping\u2026"}),Ma();let i=await sw(t).catch(s=>({ok:!1,status:String(s.message??s)}));return lc.set(t.id,{ok:i.ok,text:i.ok?"Asked Claude Code to stop this turn. You can tell it what to do next below.":`Couldn\u2019t stop it: ${i.status}`}),Ma()}lc.set(t.id,{text:"Sending\u2026"}),Ma();let n=await Kv(t,uI[e]);lc.set(t.id,{ok:n.ok,text:n.ok?`${e==="wrap"?"Asked it to wrap up":"Asked it to explain"}. ${t.kind==="session"?"It reads this when it\u2019s free.":"It goes straight to this agent."}`:n.status}),Ma()}var nw=!1;function rw(){nw||(nw=!0,document.addEventListener("click",e=>{let t=e.target.closest?.("[data-act]");if(!t)return;let n=B.get(t.dataset.node);n&&pI(t.dataset.act,n)}))}var cw="agent-office-spend",mI=.8;function uw(e){let t=new Date(e);return t.setHours(0,0,0,0),t.getTime()}var gI=e=>Math.max(e.lastAt??0,e.answeredAt??0,e.turnAt??0,e.endedAt??0,e.startedAt??0);function yI(e,t=Date.now()){let n=uw(t),i=new Set,s=new Map,o=0,a=0;for(let r of e){if(i.has(r.session)||(i.add(r.session),!(r.costUsd>0)||gI(r)<n))continue;let c=r.projectName??r.project?.name??"Elsewhere";s.set(c,(s.get(c)??0)+r.costUsd),o+=r.costUsd,a++}return{total:o,byProject:s,count:a}}function Ea(e){return e>=.005?e<10?`About $${e.toFixed(2)}`:`About $${Math.round(e)}`:e>0?"Less than a cent":"Nothing yet"}var zh=e=>`$${(e??0).toFixed(4)}`;function Vh(e,t){return t>0?e>=t?"over":e>=t*mI?"near":"ok":"none"}function jg(e,t){let n=Vh(e,t),i=`$${t%1?t.toFixed(2):t}`;return n==="near"?`Heads up: ${Ea(e).toLowerCase()} of your ${i} for today so far.`:n==="over"?`You\u2019ve passed today\u2019s ${i} limit, at ${Ea(e).toLowerCase()}. Sessions keep going; this is only a nudge.`:""}var rn=xI();function xI(){try{let e=JSON.parse(localStorage.getItem(cw)??"{}");return{limit:Number(e.limit)>0?Number(e.limit):0,warned:e.warned??null}}catch{return{limit:0,warned:null}}}function dw(){try{localStorage.setItem(cw,JSON.stringify(rn))}catch{}}var fi=null,pn=null,hi=null,lw=0,Ta={total:0,byProject:new Map,count:0},qg=e=>document.querySelector(e),Ao=e=>String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]);function hw(e){let t=Ta.byProject.get(e);return t>0?`<p class="room-spend" title="${Ao(`${zh(t)} today in ${Uo(e)}`)}">${Ao(Ea(t))} today</p>`:""}function Yg(){let{total:e,count:t}=Ta,n=Vh(e,rn.limit),i=e>0?`${Ea(e)} today`:"Nothing spent today";fi.querySelector(".spend-words").textContent=i,fi.querySelector(".spend-short").textContent=e>0?`$${e<10?e.toFixed(2):Math.round(e)}`:"$0",fi.dataset.state=n,fi.title=`${zh(e)} across ${t} session${t===1?"":"s"} active today${rn.limit?`, of a $${rn.limit} daily limit`:""}`,fi.setAttribute("aria-label",`${i}. ${fi.title}`)}function Kg(){let{total:e,byProject:t}=Ta,n=[...t].sort((a,r)=>r[1]-a[1]),i=Vh(e,rn.limit),s=rn.limit?Math.min(100,e/rn.limit*100):0,o=`
    <p class="eyebrow">Spend today</p>
    <p class="spend-big" title="${Ao(zh(e))}">${Ao(Ea(e))}</p>
    ${rn.limit?`<span class="spend-meter ${i}" title="${Math.round(s)}% of your daily limit"><span style="width:${s.toFixed(1)}%"></span></span>`:""}
    ${jg(e,rn.limit)?`<p class="spend-warn ${i}">${Ao(jg(e,rn.limit))}</p>`:""}
    ${n.length?`<ul class="spend-rows">${n.map(([a,r])=>`<li title="${Ao(zh(r))}"><span>${Ao(Uo(a))}</span><b>${Ao(Ea(r))}</b></li>`).join("")}</ul>`:'<p class="spend-note">Nothing yet today.</p>'}
    <h3>Daily limit</h3>
    <form class="spend-limit"><label><span>$</span><input type="number" min="0" step="1" inputmode="decimal" placeholder="none" value="${rn.limit||""}" aria-label="Daily limit in dollars"></label><span class="spend-note">a day</span><button type="submit">Save</button></form>
    <p class="spend-note">You\u2019ll get a heads-up at 80% of it. Sessions never stop on their own because of it.</p>
    <p class="spend-note">From the cost Claude Code reports for each session active since midnight; a session that started earlier counts in full.</p>`;pn.dataset.html===o||pn.contains(document.activeElement)&&document.activeElement.tagName==="INPUT"||(pn.dataset.html=o,pn.innerHTML=o)}function fw(){let e=Vh(Ta.total,rn.limit);if(e!=="near"&&e!=="over")return;let t=new Date(uw(Date.now())).toDateString();rn.warned?.day===t&&(rn.warned.state===e||rn.warned.state==="over")||(rn.warned={day:t,state:e},dw(),hi.querySelector("p").textContent=jg(Ta.total,rn.limit),hi.dataset.state=e,hi.hidden=!1,clearTimeout(lw),lw=setTimeout(()=>{hi.hidden=!0},15e3))}function pw(e=[]){let t=[...B.values()].filter(n=>n.kind==="session"&&!n.past);Ta=yI([...t,...e],Date.now()),fi&&(Yg(),pn.hidden||Kg(),fw())}function Xg(e){pn.hidden=!e,fi.setAttribute("aria-expanded",String(e)),e&&(pn.dataset.html="",Kg(),pn.querySelector("input")?.focus())}function mw(){fi=qg("#spend-open"),pn=qg("#spend"),!(!fi||!pn)&&(hi=document.createElement("div"),hi.id="spend-toast",hi.className="hud paper",hi.setAttribute("role","status"),hi.hidden=!0,hi.innerHTML='<p></p><button type="button">OK</button>',hi.querySelector("button").onclick=()=>{hi.hidden=!0},qg(".stage-wrap").append(hi),fi.addEventListener("click",()=>Xg(pn.hidden)),pn.addEventListener("submit",e=>{e.preventDefault();let t=Number(pn.querySelector("input").value);rn.limit=t>0?Math.round(t*100)/100:0,rn.warned=null,dw(),pn.querySelector("input").blur(),pn.dataset.html="",Kg(),Yg(),fw()}),addEventListener("keydown",e=>{e.key==="Escape"&&!pn.hidden&&(Xg(!1),fi.focus())}),addEventListener("pointerdown",e=>{!pn.hidden&&!pn.contains(e.target)&&!fi.contains(e.target)&&Xg(!1)}),Yg())}var wn=e=>document.querySelector(e),cc=e=>e===void 0?"\u2014":e>=1e6?`${(e/1e6).toFixed(2)}M`:`${Math.round(e/1e3)}k`,bI=e=>e===void 0?void 0:`$${e.toFixed(2)}`,pi=(e,t)=>`${e} ${t}${e===1?"":"s"}`,gw=4,vI=3,dc=e=>ss(e.prompts?.[0]?.text)||e.label,hc=e=>e.project?mn(e.project,e.projectName):e.projectName??"Elsewhere",Zg=(e,t)=>Ve()?`<span class="pct ${qs(e)}">${Xs(e)}</span>`:Ba(e,t),vs=e=>e.kind==="session"&&!e.past&&e.status!=="done",vw={working:"Working",waiting:"Waiting on you",asking:"Needs your answer",stuck:"Needs a look",ended:"Ended",idle:"Idle",done:"Done",failed:"Stopped"},Wh=e=>`<span class="pill ${e}">${vw[e]}</span>`,wI=e=>`${e.from?`<span class="muted from">${e.from==="agent-office"?"From the office":`From ${k(e.from)}`}</span>`:""}${k(e.text)}`;function ww(){let e=new Map;for(let t of B.values()){if(t.kind!=="session")continue;let n=t.project??"Elsewhere";e.has(n)||e.set(n,[]),e.get(n).push(t)}return[...e].map(([t,n])=>{let i=n[0].projectName??"Elsewhere",s=hc(n[0]),o=n.filter(vs).sort((r,c)=>(r.startedAt??0)-(c.startedAt??0)),a=n.filter(r=>!vs(r)).sort((r,c)=>(c.endedAt??c.lastAt??0)-(r.endedAt??r.lastAt??0)).slice(0,vI);return{id:t,raw:i,name:s,live:o,past:a}}).sort((t,n)=>(n.live.length>0)-(t.live.length>0)||t.name.localeCompare(n.name))}function Mw(){let e=[],t=n=>n.forEach(({node:i,children:s})=>{e.push(i.id),t(s)});for(let n of ww())for(let i of[...n.live,...n.past])e.push(i.id),vs(i)&&t(as(i));return e}function MI(e){return[...B.values()].filter(t=>vs(t)&&["asking","waiting","stuck"].includes($e(t,e))).sort((t,n)=>($e(n,e)==="asking")-($e(t,e)==="asking")||(t.answeredAt??t.startedAt??0)-(n.answeredAt??n.startedAt??0))}function SI(e){let t=[...B.values()].filter(vs);if(!t.length)return"Nothing is running. Start a Claude Code session and it walks into the office.";let n=t.filter(a=>$e(a,e)!=="working").length,i=t.length-n,s=[...B.values()].filter(a=>a.kind==="agent"&&On(a)==="working").length,o=s?`, with ${pi(s,"agent")} helping`:"";return n?i?`${n} waiting on you, ${i} working${o}.`:`${t.length===1?"Your thread is":`All ${t.length} threads are`} waiting on you.`:`${t.length===1?"Your thread is":`All ${t.length} threads are`} working${o}.`}var Qg=()=>!1;function yw(e,t){let n=$e(e,t);if(n==="asking"){let[a,...r]=Hm(e);return`
    <button class="card-head" data-pick="${k(e.id)}" data-hover="${k(e.id)}" title="Open the conversation">
      <span class="card-where"><i class="dot ${Pi(e.session)}"></i>${k(hc(e))}${e.thread?'<span class="badge">thread</span>':""}<time>${Ae(a.t)}</time></span>
      <b>${k(dc(e))}</b>
    </button>
    ${Bm(a,{answerable:Qg(a),compact:!0})}
    ${r.length?`<p class="ask-more">${pi(r.length,"more question")} after this one</p>`:""}`}let i=e.answer?.text,s=n==="stuck"?e.lastReason==="aborted"?"You stopped its last turn.":e.lastReason==="refusal"?"Its last turn ended on a refusal.":"Its last turn ended on an error.":n==="working"?"Back at work.":i?Se(i):e.turns?"Done with your last request.":"Ready for its first prompt.",o=i&&n!=="working"?` draggable="true" data-handoff="letter|${k(e.id)}"`:"";return`
    <button class="card-head" data-pick="${k(e.id)}" data-hover="${k(e.id)}"${o} title="${o?"Open the conversation. Drag it onto a critter (or press H) to pass it on":"Open the conversation"}">
      <span class="card-where"><i class="dot ${Pi(e.session)}"></i>${k(hc(e))}${e.thread?'<span class="badge">thread</span>':""}<time>${Ae(e.answeredAt??e.startedAt)}</time></span>
      <b>${k(dc(e))}</b>
      ${zm(e)}
      <span class="card-said">${k(s)}</span>
    </button>`}var Gh=new Map,qh=new Map;function EI(e){let t=document.createElement("li");t.className="card",t.dataset.card=e.id,t.innerHTML=`
    <div class="card-info"></div>
    <form class="card-reply">
      <textarea rows="1" aria-label="Reply to ${k(dc(e))}" placeholder="Reply\u2026 (@ to pick an agent)"></textarea>
      <button type="submit" aria-label="Send reply">\u21B5</button>
      <p class="card-status" hidden></p>
    </form>`;let n=t.querySelector("form"),i=n.querySelector("textarea");return i.value=Gh.get(e.id)??"",Bh(i,()=>B.get(e.id)),i.addEventListener("input",()=>Gh.set(e.id,i.value)),i.addEventListener("keydown",s=>{s.key==="Enter"&&!s.shiftKey&&!s.isComposing&&(s.preventDefault(),n.requestSubmit())}),n.addEventListener("submit",async s=>{s.preventDefault();let o=B.get(e.id),a=i.value;if(!o||!a.trim())return;i.value="",Gh.delete(e.id),qh.set(e.id,{status:"Sending\u2026"}),xw(t,e.id);let r=Fh(o,a),c=await wa(r.node,r.text);c.ok&&r.to&&(c.status=`Sent to ${r.node.label}`),qh.set(e.id,c),xw(t,e.id),c.ok||(i.value=a,Gh.set(e.id,a))}),t}function xw(e,t){let n=qh.get(t),i=e.querySelector(".card-status");i.hidden=!n,n&&(i.textContent=n.status,i.classList.toggle("bad",n.ok===!1))}function TI(e){let t=wn("#inbox"),n=MI(e),i=n.slice(0,gw),s=new Set(i.map(a=>a.id));for(let a of[...t.querySelectorAll("[data-card]")])B.has(a.dataset.card)&&(s.has(a.dataset.card)||a.contains(document.activeElement)||a.querySelector("textarea")?.value)||(a.remove(),qh.delete(a.dataset.card));t.querySelector(".calm")?.remove(),i.forEach((a,r)=>{let c=t.querySelector(`[data-card="${CSS.escape(a.id)}"]`);c||(c=EI(a)),t.children[r]!==c&&!c.contains(document.activeElement)&&t.insertBefore(c,t.children[r]??null),c.classList.remove("gone"),c.classList.toggle("stuck",$e(a,e)==="stuck"),c.classList.toggle("asking",$e(a,e)==="asking"),ts(c.querySelector(".card-info"),yw(a,e)),c.querySelector("form").hidden=!yr()||$e(a,e)==="asking"});for(let a of t.querySelectorAll("[data-card]"))s.has(a.dataset.card)||(a.classList.add("gone"),ts(a.querySelector(".card-info"),yw(B.get(a.dataset.card),e)));t.children.length||t.insertAdjacentHTML("beforeend",'<li class="calm">Nothing is waiting on you. Threads land here when they answer.</li>');let o=n.length-i.length;ts(wn("#inbox-more"),o>0?`<button data-pick="${k(n[gw].id)}">${pi(o,"more thread")} waiting</button>`:""),ts(wn("#inbox-count"),n.length?String(n.length):"")}function AI(){return $f().slice(0,3).map(e=>{let t=e.kind==="agent"?B.get(Ct(e.session)):null,n=e.kind==="agent"?`${e.label} in ${Se(t?.label??"")}`:Se(e.label);return Ve()?`<li><button data-pick="${k(e.id)}"><span class="pct ${qs(Ke(e))}">${Xs(Ke(e))}</span> ${k(n)} will compact soon</button></li>`:`<li><button data-pick="${k(e.id)}">${Ba(Ke(e))} ${k(n)} will tidy up its memory soon</button></li>`}).join("")}var uc="all",RI={all:()=>!0,mail:e=>e.tone==="mail",bad:e=>["bad","block","bumps"].includes(e.tone)},_w={done:"\u2713",made:"\u2726",ask:"?",block:"!",cleared:"\u2713"},Jg=new Set;function CI(e){let t=_w[e.tone]?`<i class="mark" aria-hidden="true">${_w[e.tone]}</i>`:"",n=e.answer?` <em>You picked ${k(Se(e.answer))}.</em>`:"";if(e.tone==="bumps"){let i=`${e.target}|${e.bumps.at(-1)?.t}`;return`<li class="bumps"><details data-bumps="${k(i)}" ${Jg.has(i)?"open":""}><summary><span>${k(e.text)}</span><time>${Ae(e.t)}</time></summary>
      <ul>${e.bumps.map(s=>`<li>${k(Ve()?s.raw:s.text)}<time>${Ae(s.t)}</time></li>`).join("")}</ul>
      <button data-pick="${k(e.target??"")}">Open the thread</button></details></li>`}return`<li class="${e.tone}"><button data-pick="${k(e.target??"")}"><span>${t}${k(zc(e))}${n}</span><time>${Ae(e.t)}</time></button></li>`}function kI(){let e=Fn.filter(RI[uc]).slice(0,14),t={all:"Quiet so far.",mail:"No messages between agents yet.",bad:"Nothing has gone wrong."}[uc];return e.map(CI).join("")||`<li class="muted"><span>${t}</span></li>`}function PI(e,t){let n=Ke(e),i=On(e);return`
    <button class="agent-row ${i}" style="--depth:${t}" data-pick="${k(e.id)}" data-hover="${k(e.id)}">
      <i class="dot ${To(e.type)}"></i>
      <span class="aname">${k(qe(e).title)}${e.description&&e.description!==e.label?`<span class="muted"> \xB7 ${k(e.description)}</span>`:""}</span>
      <span class="astate">${e.mailAt&&Date.now()-e.mailAt<8e3?'<i class="env" title="Just got a message">\u2709</i>':""}${i==="working"&&e.context?.tokens?Zg(n,{bare:!0}):`<i class="sdot ${i}" title="${vw[i]}"></i>`}</span>
    </button>`}var t0=e=>e.reduce((t,n)=>t+1+t0(n.children),0);function II(e,t=1){let n=0,i=[],s=(o,a)=>{for(let{node:r,children:c}of o){if(On(r)==="done"){n+=1+t0(c);continue}i.push(PI(r,a)),s(c,a+1)}};return s(as(e),t),n&&i.push(`<p class="folded" style="--depth:${t}">${pi(n,"agent")} finished</p>`),i.join("")}function bw(e,t,n){let i=vs(e),s=$e(e,t),o=Ke(e),a=`ended ${Ae(e.endedAt??e.lastAt)}`;return`
    <div class="thread ${i?"":"past"} ${n===e.id?"on":""}">
      <button class="entry" data-pick="${k(e.id)}" data-hover="${k(e.id)}">
        <i class="dot ${Pi(e.session)}"></i>
        <span class="ename">${k(dc(e))}${e.thread?'<span class="badge" title="A claude.ai project\u2019s coordinator handed this session its work">thread</span>':""}</span>
        ${i?Wh(s):e.context?.tokens?Zg(o,{bare:!0}):"<span></span>"}
        ${i?zm(e):""}
        ${i?`<span class="esum">${k(Wl(e,t))}</span>`:""}
        <span class="estate">${k(qe(e).name)}${i&&e.context?.tokens?` \xB7 ${Zg(o)}`:""}${i?"":` \xB7 ${k(a)}`}</span>
      </button>
      ${i?II(e):""}
    </div>`}function LI(e,t){let n=ww(),i=n.flatMap(o=>o.live),s=i.filter(o=>$e(o,e)==="working").length;return`
    <h2 class="sideh">Projects <small>${i.length?`${s} working \xB7 ${i.length-s} with you`:"none live"}</small></h2>
    ${n.map(o=>`
      <section class="project">
        <p class="room"><button type="button" class="picon room-${Fs(o.raw,o.id)}" data-edit-project="${k(o.id)}" data-raw="${k(o.raw)}" title="Rename it, or change its icon, walls and decor" aria-label="Rename ${k(o.name)} or change its icon, walls and decor">${Js(o.id,o.raw)}</button>${k(o.name)}<small>${o.live.length?pi(o.live.length,"thread"):"earlier"}</small></p>${hw(o.raw)}
        ${o.live.map(a=>bw(a,e,t)).join("")}
        ${o.past.length?`${o.live.length?'<p class="earlier">Earlier</p>':""}${o.past.map(a=>bw(a,e,t)).join("")}`:""}
      </section>`).join("")||'<p class="muted">No sessions yet. Start Claude Code anywhere and it appears here.</p>'}`}function fc(e,t="",n=""){return`<p class="line ${n}">${e}${t?`<span class="muted">\xB7 ${t}</span>`:""}</p>`}function DI([e,t]){let n=[t.edits&&pi(t.edits,"edit"),t.reads&&pi(t.reads,"read")].filter(Boolean).join(", ");return`<p class="line mono" title="${k(e)}">${k(e.split(/[\\/]/).slice(-2).join("/"))}<span class="muted">\xB7 ${n}</span></p>`}function NI(e){let t=e.breakdown?.categories?.filter(n=>n.kind==="used"&&n.tokens>0);return t?.length?`<h3>What fills it</h3>${[...t].sort((n,i)=>i.tokens-n.tokens).slice(0,6).map(n=>fc(k(n.name),cc(n.tokens))).join("")}`:""}function UI(e){return e.rateLimits?.length?e.rateLimits.map(t=>fc(`${k(t.kind.replace("_"," "))} limit`,`${Math.round(t.percentUsed)}% used`)).join(""):""}var OI={fresh:"Plenty of room to think.",busy:"Has a fair bit on its mind.",full:"Its memory of this conversation is filling up.",tired:"Nearly out of room. It will tidy up its memory soon, and keep going."};function Sw(e,t,n){if(!e.context?.tokens)return"";let i=Ke(e);if(!Ve()){let s=wr(i),o=`${Xs(i)} of ${n} context window ${t?"is":"was"} in use: ${cc(e.context.tokens)} of ${cc(e.context.window)} tokens`;return`
    <div class="dgauge" title="${k(o)}"><span class="big energy-word ${s.key}">${s.word}</span><span>${t?OI[s.key]:"When it ended."}</span></div>
    <span class="meter energy-bar" title="${k(o)}"><span class="${s.key}" style="width:${(Math.max(.04,1-i)*100).toFixed(1)}%"></span></span>
    ${e.compactions?.length?`<p class="dmeta">Tidied up its memory ${pi(e.compactions.length,"time")}</p>`:""}`}return`
    <div class="dgauge"><span class="big ${qs(i)}">${Xs(i)}</span><span>of ${n} context window ${t?"is":"was"} in use${t&&i>=Qs?". It will compact soon.":"."}</span></div>
    <span class="meter"><span class="${qs(i)}" style="width:${(i*100).toFixed(1)}%"></span></span>
    <p class="dmeta">${cc(e.context.tokens)} of ${cc(e.context.window)} tokens${e.compactions?.length?` \xB7 compacted ${pi(e.compactions.length,"time")}`:""}</p>`}function FI(e){let t=$a(e),n=[`<button data-back>${k(t[0]?hc(t[0]):"Projects")}</button>`];return t.slice(0,-1).forEach(i=>n.push(`<button data-pick="${k(i.id)}">${k(i.kind==="agent"?qe(i).name:i.label)}</button>`)),`<nav class="crumbs" aria-label="Where this is">${n.join('<span aria-hidden="true">\u203A</span>')}</nav>`}function BI(e){let t=e.kind==="session"?e:B.get(Ct(e.session)),n=zf(t).filter(i=>e.kind==="session"||i.from===e.id||i.to===e.id).slice(0,5);return n.length?`<h3>Messages</h3>${n.map(i=>`
    <p class="mail"><b>${k(i.fromName??"Someone")} \u2192 ${k(i.toName??"someone")}</b>${i.text?`<span>${k(zc(i))}</span>`:""}<time>${Ae(i.t)}</time></p>`).join("")}`:""}function HI(e,t){let n=e.kind==="session"?e:B.get(Ct(e.session));if(!n)return"";if(!vs(n))return`<h3>Who helped</h3>${(n.pastAgents??[]).map(a=>fc(`<i class="dot ${To(a.type)}"></i>${k(a.label??a.type)}`,k(a.description??""))).join("")||'<p class="muted">No subagents.</p>'}`;let i=[],s=(o,a)=>o.forEach(({node:r,children:c})=>{let l=On(r),u=[r.teammate?"teammate":r.fork?"fork":r.background?"background":"",r.name?"":r.type].filter(Boolean).join(" \xB7 ");i.push(`
      <button class="member ${r.id===e.id?"on":""}" style="--depth:${a}" data-pick="${k(r.id)}" data-hover="${k(r.id)}">
        <i class="dot ${To(r.type)}"></i>
        <span class="mname">${k(qe(r).title)}${u?`<small>${k(u)}</small>`:""}</span>
        ${Wh(l)}
        <span class="mdesc">${k(r.description??"")}${r.context?.tokens?Ve()?` \xB7 ${Xs(Ke(r))} of its window`:` \xB7 ${wr(Ke(r)).word}`:""}</span>
      </button>`),s(c,a+1)});return s(as(n),1),`
    <button class="member lead ${n.id===e.id?"on":""}" style="--depth:0" data-pick="${k(n.id)}">
      <i class="dot ${Pi(n.session)}"></i>
      <span class="mname">${k(qe(n).title)}<small>the main conversation</small></span>
      ${Wh($e(n,t))}
      <span class="mdesc">${n.model?k(n.model):""}</span>
    </button>
    ${i.join("")||'<p class="muted">No agents yet. When the lead hands work off, its agents appear here.</p>'}
    ${BI(e)}`}function $I(e){let t=vs(e),n=Bn.get(e.id),i=n?[...n.files].sort((o,a)=>a[1].edits*3+a[1].reads-(o[1].edits*3+o[1].reads)).slice(0,8):[],s=[e.turns!==void 0&&pi(e.turns,"turn"),e.toolCalls!==void 0&&pi(e.toolCalls,"tool call"),e.errors&&pi(e.errors,"error"),bI(e.costUsd),e.model].filter(Boolean).join(" \xB7 ");return`
    ${Sw(e,t,"its")}
    ${s?`<p class="dmeta">${k(s)}</p>`:""}
    ${t?NI(e)+UI(e):""}
    ${i.length?`<h3>Files it has worked on</h3>${i.map(DI).join("")}`:""}
    ${n?.actions.length?`<h3>Recently</h3>${n.actions.slice(0,8).map(o=>fc(k(za(o)),Ae(o.t),o.ok?"":"bad")).join("")}`:""}
    ${e.prompts?.length?`<h3>What you asked</h3>${[...e.prompts].reverse().slice(0,6).map(o=>fc(wI(o),Ae(o.t))).join("")}`:""}
    ${VI(e)}`}var zI=e=>new Date(e).toLocaleDateString(void 0,{month:"short",day:"numeric"});function VI(e){if(!e.project)return"";let t=Ob(ph(),e.project),n=t.filter(i=>i.at).length;return`<h3>Milestones <small class="muted">${k(hc(e))} \xB7 ${n} of ${t.length}</small></h3>
    <ul class="milestones">${t.map(i=>`
      <li class="${i.at?"got":""}"><i aria-hidden="true">${i.at?"\u2605":"\u2606"}</i><span>${k(i.title)}${i.note?`<small>${k(i.note)}</small>`:""}</span><time>${i.at?zI(i.at):i.goal>1?`${i.have.toLocaleString()} of ${i.goal.toLocaleString()}`:"not yet"}</time></li>`).join("")}
    </ul>`}function GI(e){let t=[e.model,e.history?pi(e.history,"tool call"):"",e.cwd?`in ${e.cwd}`:""].filter(Boolean).join(" \xB7 ");return`
    ${Sw(e,On(e)!=="done","its own")}
    ${t?`<p class="dmeta">${k(t)}</p>`:""}
    ${e.answer?.text?`<h3>Last report</h3><p class="line">${k(e.answer.text)}</p>`:""}`}function WI(e,t){let n=e.kind==="agent",i=n?On(e):$e(e,t),s=n?[e.description,e.teammateId??(e.teammate?"teammate":""),e.fork?"fork of its parent":e.background?"in the background":""].filter(Boolean).join(" \xB7 "):[qe(e).title,e.thread?"Thread of a claude.ai project":"",e.gitBranch,vs(e)?"":`ended ${Ae(e.endedAt??e.lastAt)}`].filter(Boolean).join(" \xB7 ");return`
    ${FI(e)}
    <h2 class="dtitle">${n?`<i class="dot ${To(e.type)}"></i>`:`<button type="button" class="dot-pick" data-critter-color="${k(e.session)}" data-name="${k(qe(e).name)}" title="Change ${k(qe(e).name)}\u2019s color" aria-label="Change ${k(qe(e).name)}\u2019s color"><i class="dot ${Pi(e.session)}"></i></button>`}${k(n?qe(e).title:dc(e))}</h2>
    <p class="dmeta">${Wh(i)} ${k(s)}</p>
    ${n?"":`<p class="dsum">${k(Wl(e,t))}</p>`}
    ${Gd(e.todos,{big:!0})}
    ${iw(e,i)}`}function Ew(e,t){if(e.nodeType!==t.nodeType||e.nodeName!==t.nodeName){e.replaceWith(t);return}if(e.nodeType===Node.ELEMENT_NODE&&e.hasAttribute("data-keep")&&e.getAttribute("data-keep")===t.getAttribute("data-keep"))return;if(e.nodeType!==Node.ELEMENT_NODE){e.nodeValue!==t.nodeValue&&(e.nodeValue=t.nodeValue);return}for(let{name:i}of[...e.attributes])t.hasAttribute(i)||e.removeAttribute(i);for(let{name:i,value:s}of[...t.attributes])e.getAttribute(i)!==s&&e.setAttribute(i,s);let n=[...t.childNodes];for(n.forEach((i,s)=>{let o=e.childNodes[s];o?Ew(o,i):e.append(i)});e.childNodes.length>n.length;)e.lastChild.remove()}function ts(e,t){if(e._html===t)return;e._html=t;let n=e.cloneNode(!1);n.innerHTML=t,Ew(e,n)}var Tw=[["transcript","Conversation"],["outputs","Outputs"],["team","Team"],["details","Details"]],es="transcript",an=null;function Xh(e){Tw.some(([t])=>t===e)&&(es=e,an&&ei(an))}function qI(e,t){let n=e.kind==="session"?e:B.get(Ct(e.session)),i=n&&vs(n)?t0(as(n)):n?.pastAgents?.length??0,s=Q_(e),o=u=>u==="team"&&i?`<small>${i}</small>`:u==="outputs"&&s?`<small>${s}</small>`:"",a=([u,d],h)=>`<button type="button" role="tab" id="tab-${u}" aria-controls="tabpanel" tabindex="${es===u?0:-1}" class="tab ${es===u?"on":""}" aria-selected="${es===u}" data-tab="${u}" title="${d} (${h+1})">${d}${o(u)}</button>`,r=Hm(n??e).filter(u=>e.kind==="session"||u.who?.id===e.id),c=r.map(u=>Bm(u,{answerable:Qg(u)})).join("")+$m(e,{open:!r.length}),l=es==="transcript"?`${c?`<div class="pinned">${c}</div>`:""}<div class="transcript" data-keep="${k(e.id)}"></div>`:es==="outputs"?J_(e):es==="team"?HI(e,t):e.kind==="agent"?GI(e):$I(e);return`${WI(e,t)}<div class="tabs" role="tablist" aria-label="About this ${e.kind==="agent"?"agent":"thread"}">${Tw.map(a).join("")}</div><div class="tabpanel" role="tabpanel" id="tabpanel" aria-labelledby="tab-${es}">${l}</div>`}var xr=!1,js=null;document.addEventListener("office:answered",()=>{an&&ei(an)});document.addEventListener("office:refresh",()=>{an&&ei(an)});document.addEventListener("office:zoom",e=>{js=e.detail,an&&ei(an)});addEventListener("keydown",e=>{e.key==="Escape"&&(js||xr)&&(js?js=null:xr=!1,an&&ei(an))});function ei(e){an=e;let{running:t,selected:n,pick:i,hover:s,answer:o}=e;Qg=l=>!!o?.can(l),ts(wn("#now"),`<p>${k(SI(t))}</p>`),TI(t),ts(wn("#full"),AI());for(let l of document.querySelectorAll("[data-feed]"))l.classList.toggle("on",l.dataset.feed===uc),l.setAttribute("aria-pressed",String(l.dataset.feed===uc));ts(wn("#moments"),kI());let a=n&&B.get(n),r=a&&(a.kind==="agent"||a.kind==="session");wn("#side").classList.toggle("clipboard",!!r),wn("#side").classList.toggle("talking",!!r&&es==="transcript"),ts(wn("#side"),r?qI(a,t):LI(t,n)),r&&es==="transcript"?Jv(wn("#side .transcript"),a):Qv();let c=Zt.filter(l=>l.type!=="file").length;ts(wn("#library-count"),String(c||"")),wn("#library").hidden=!xr,xr&&ts(wn("#library"),tb()),wn("#lightbox").hidden=!js,js&&ts(wn("#lightbox"),nb(js));for(let l of document.querySelectorAll("[data-tab]"))l.onclick=()=>Xh(l.dataset.tab);for(let l of document.querySelectorAll("[data-feed]"))l.onclick=()=>{uc=l.dataset.feed,ei(an)};for(let l of document.querySelectorAll("[data-bumps]"))l.ontoggle=()=>{l.open?Jg.add(l.dataset.bumps):Jg.delete(l.dataset.bumps)};for(let l of document.querySelectorAll("[data-pick]"))l.onclick=()=>l.dataset.pick&&i(l.dataset.pick);for(let l of document.querySelectorAll("[data-back]"))l.onclick=()=>i(null);for(let l of document.querySelectorAll("[data-edit-project]"))l.onclick=u=>{u.stopPropagation(),Wg(l.dataset.editProject,l.dataset.raw,l)};wn("#library-open").onclick=()=>{xr=!xr,ei(an)},wn("#lightbox").onclick=()=>{js=null,ei(an)};for(let l of document.querySelectorAll("[data-library]"))l.onclick=()=>{xr=!1,ei(an)};for(let l of document.querySelectorAll("[data-shelf]"))l.onclick=()=>{eb(l.dataset.shelf),ei(an)};for(let l of document.querySelectorAll("[data-zoom]"))l.onclick=u=>{u.preventDefault(),js=l.dataset.zoom,ei(an)};z_(document,{find:l=>Zt.find(u=>`${u.session}|${u.id}`===l),redraw:()=>ei(an)});for(let l of document.querySelectorAll("[data-hover]"))l.onpointerenter=()=>s(l.dataset.hover),l.onpointerleave=()=>s(null)}function Aw(){if(an?.selected)return es!=="transcript"&&Xh("transcript"),Zv();let e=document.querySelector("#inbox .card:not(.gone) textarea");return e?.focus(),!!e}var jI=e=>{let t=new Date(e);return t.setHours(0,0,0,0),t.getTime()},Ii=(e,t,n=`${t}s`)=>`${e} ${e===1?t:n}`,e0=e=>e.prompts?.[0]?.text??e.label??"A thread",YI=["artifact","plan","link"],Rw={asking:"needs your answer",waiting:"is waiting on your reply",stuck:"stopped on a problem"};function Cw({nodes:e,outputs:t,helpers:n=[],now:i=Date.now(),stateOf:s}){let o=jI(i),a=[...e].filter(x=>x.kind==="session"),r=x=>a.find(b=>b.session===x),c=x=>!x.past&&x.status!=="done",l=a.filter(x=>c(x)||(x.endedAt??x.lastAt??0)>=o),u=t.filter(x=>x.t>=o),d=u.filter(x=>x.type!=="file"),h=new Map;for(let x of u)x.type==="file"&&h.set(x.path??x.id,x);let f=l.filter(c).map(x=>({n:x,state:s?.(x)})).filter(x=>x.state in Rw).map(({n:x,state:b})=>({id:x.id,title:e0(x),project:x.projectName,state:b,words:Rw[b]})),g=new Set(f.map(x=>x.id)),y=l.filter(x=>!g.has(x.id)&&(!c(x)||x.todos?.length&&x.todos.every(b=>b.status==="completed")&&s?.(x)!=="working")),m=new Map;for(let x of n)x.t>=o&&m.set(x.type,(m.get(x.type)??0)+1);let p=x=>l.reduce((b,v)=>b+(v[x]??0),0);return{day:o,shipped:d.map(x=>({type:x.type,title:x.title,url:x.url,session:x.session,thread:e0(r(x.session)??{})})),prs:d.filter(x=>x.type==="pr").length,docs:d.filter(x=>YI.includes(x.type)).length,pictures:d.filter(x=>x.type==="image").length,files:h.size,added:[...h.values()].reduce((x,b)=>x+(b.meta?.additions??0),0),removed:[...h.values()].reduce((x,b)=>x+(b.meta?.deletions??0),0),finished:y.map(x=>({id:x.id,title:e0(x),project:x.projectName})),waiting:f,helpers:[...m].map(([x,b])=>({type:x,count:b})).sort((x,b)=>b.count-x.count||x.type.localeCompare(b.type)),threads:l.length,asked:l.reduce((x,b)=>x+(b.prompts??[]).filter(v=>v.t>=o).length,0),turns:p("turns"),toolCalls:p("toolCalls"),errors:p("errors")}}function jh(e){let t=[],n=e.shipped.length;if(n&&t.push(`${Ii(n,"thing")} shipped`),e.finished.length&&t.push(`${Ii(e.finished.length,"thread")} wrapped up`),!t.length)return e.threads?"Nothing shipped yet today, but the work is moving.":"A quiet day so far.";let i=n>=5||e.finished.length>=3?"A good day: ":"",s=t.join(" and ");return`${i}${i?s:s.charAt(0).toUpperCase()+s.slice(1)}.`}function Yh(e){let t=[e.prs&&Ii(e.prs,"pull request"),e.docs&&Ii(e.docs,"doc"),e.pictures&&Ii(e.pictures,"picture")].filter(Boolean),n=t.length>1?`${t.slice(0,-1).join(", ")} and ${t.at(-1)}`:t[0]??"",i=e.files?`${n?"; ":""}${Ii(e.files,"file")} changed${e.added||e.removed?` (+${e.added} \u2212${e.removed} lines)`:""}`:"";return`${n}${i}`||"Nothing yet."}function Kh(e){if(!e.helpers.length)return"No helpers today; the threads did it on their own.";let t=e.helpers.reduce((n,i)=>n+i.count,0);return`${Ii(t,"helper")}: ${e.helpers.map(n=>n.count>1?`${n.type} \xD7${n.count}`:n.type).join(", ")}.`}function Zh(e){if(!e.threads)return"No threads ran today.";let t=e.asked?`You asked for ${Ii(e.asked,"thing")} across ${Ii(e.threads,"thread")}`:`${Ii(e.threads,"thread")} ran`,n=e.turns?`, in ${Ii(e.turns,"back-and-forth","back-and-forths")}`:"",i=e.toolCalls?` Claude took ${Ii(e.toolCalls,"step")} to do it: reading, editing, searching and running things`:"",s=e.toolCalls&&e.errors?`; ${e.errors} hit a snag along the way.`:e.toolCalls?".":"";return`${t}${n}.${i}${s}`}var Jh=e=>new Date(e).toLocaleDateString(void 0,{weekday:"long",day:"numeric",month:"long"});function kw(e){let t=[`Today in the office: ${Jh(e.day)}`,jh(e),""];t.push("What shipped",`  ${Yh(e)}`);for(let n of e.shipped.filter(i=>i.type!=="image").slice(0,12))t.push(`  - ${n.title}${n.url?` (${n.url})`:""}`);return t.push("","Wrapped up"),t.push(...e.finished.length?e.finished.map(n=>`  - ${n.title}`):["  Nothing yet."]),t.push("","Waiting on you"),t.push(...e.waiting.length?e.waiting.map(n=>`  - ${n.title} ${n.words}`):["  Nothing. You\u2019re all caught up."]),t.push("","Who helped",`  ${Kh(e)}`,"","The work",`  ${Zh(e)}`),t.join(`
`)}var KI=10*6e4,ZI=2*6e4;function Pw(e,{now:t=Date.now(),lastBusyAt:n=0,offeredDay:i=null}={}){if(i===e.day||!e.shipped.length&&!e.finished.length)return!1;let s=t-n;return s>=KI||new Date(t).getHours()>=17&&s>=ZI}var Ys=e=>document.querySelector(e),tf=8,Iw="agent-office:recap-offered",JI=45e3,Lw=()=>{},ef=0,Dw=Date.now(),mc=null,pc="",Hw={get(){try{return Number(localStorage.getItem(Iw))||null}catch{return null}},set(e){try{localStorage.setItem(Iw,String(e))}catch{}}},nf=(e=new Set)=>Cw({nodes:B.values(),outputs:Zt,helpers:Fo,stateOf:t=>$e(t,e)}),$w={pr:"leaf",artifact:"lilac",plan:"sky",link:"teal",image:"mustard"};function Qh(e,t,n=""){return`<div class="rc-tile ${n}"><b>${e}</b><span>${t}</span></div>`}function QI(e){let t=e.shipped.filter(n=>n.type!=="image");return`
    <header class="rc-head">
      <p class="eyebrow">Today in the office</p>
      <h2 id="recap-title">${k(Jh(e.day))}</h2>
      <p class="rc-headline">${k(jh(e))}</p>
      <button type="button" class="lib-close rc-close" data-recap="close" aria-label="Close">\xD7</button>
    </header>
    <div class="rc-tiles">
      ${Qh(e.shipped.length,"shipped","ok")}${Qh(e.finished.length,"wrapped up")}${Qh(e.waiting.length,"waiting on you",e.waiting.length?"warn":"")}${Qh(e.helpers.reduce((n,i)=>n+i.count,0),"helpers")}
    </div>
    <section class="rc-sec">
      <h3>What shipped</h3>
      <p class="rc-line">${k(Yh(e))}</p>
      ${t.length?`<ul class="rc-list">${t.slice(0,tf).map(n=>`
        <li><i class="rc-kind ${$w[n.type]??""}">${Xd[n.type]?.icon??"\u2022"}</i>${n.url?`<a href="${k(n.url)}" target="_blank" rel="noopener">${k(n.title)}</a>`:`<span>${k(n.title)}</span>`}<small>${k(n.thread)}</small></li>`).join("")}</ul>
      ${t.length>tf?`<p class="rc-more">and ${t.length-tf} more in the Library</p>`:""}`:""}
    </section>
    ${e.finished.length?`<section class="rc-sec"><h3>Wrapped up</h3><ul class="rc-list plain">${e.finished.map(n=>`<li><i class="rc-check">\u2713</i><button type="button" data-recap-pick="${k(n.id)}">${k(n.title)}</button></li>`).join("")}</ul></section>`:""}
    <section class="rc-sec">
      <h3>Waiting on you</h3>
      ${e.waiting.length?`<ul class="rc-list plain">${e.waiting.map(n=>`<li><i class="rc-dot ${n.state}"></i><button type="button" data-recap-pick="${k(n.id)}">${k(n.title)}</button><small>${k(n.words)}</small></li>`).join("")}</ul>`:'<p class="rc-line">Nothing. You\u2019re all caught up.</p>'}
    </section>
    <section class="rc-sec"><h3>Who helped</h3><p class="rc-line">${k(Kh(e))}</p></section>
    <section class="rc-sec"><h3>The work</h3><p class="rc-line">${k(Zh(e))}</p></section>
    <footer class="rc-foot">
      <button type="button" class="dv-btn primary" data-recap="copy">Copy as text</button>
      <button type="button" class="dv-btn" data-recap="image">Save as image</button>
      <span class="rc-status" role="status">${k(pc)}</span>
    </footer>`}function t3(){let e=getComputedStyle(document.documentElement),t=n=>e.getPropertyValue(n).trim();return{paper:t("--paper"),bg:t("--bg"),ink:t("--ink"),muted:t("--muted"),line:t("--line"),accent:t("--accent"),ok:t("--ok"),warn:t("--warn"),leaf:t("--leaf"),lilac:t("--lilac"),sky:t("--sky"),teal:t("--teal"),mustard:t("--mustard"),serif:t("--serif"),sans:t("--sans"),mono:t("--mono")}}function e3(e,t,n){let i=[],s="";for(let o of t.split(/\s+/)){let a=s?`${s} ${o}`:o;e.measureText(a).width>n&&s?(i.push(s),s=o):s=a}return s&&i.push(s),i}function Nw(e,t,n){if(e.measureText(t).width<=n)return t;let i=t;for(;i.length>1&&e.measureText(`${i}\u2026`).width>n;)i=i.slice(0,-1);return`${i.trimEnd()}\u2026`}function Uw(e,t,n,i){let r=36,c=(g,y,m,p,x,b="left")=>{i&&(e.font=p,e.fillStyle=x,e.textAlign=b,e.fillText(g,y,m))},l=(g,y,m,p)=>{e.font=y;for(let x of e3(e,g,528))r+=p,c(x,36,r,y,m)},u=g=>{r+=26,c(g.toUpperCase(),36,r,`500 10.5px ${n.mono}`,n.muted)};c("TODAY IN THE OFFICE",36,r+10,`500 11px ${n.mono}`,n.accent),r+=10,r+=36,c(Jh(t.day),36,r,`600 28px ${n.serif}`,n.ink),r+=4,l(jh(t),`400 16px ${n.serif}`,n.muted,23),r+=18;let d=[[t.shipped.length,"shipped",n.ok],[t.finished.length,"wrapped up",n.ink],[t.waiting.length,"waiting on you",t.waiting.length?n.accent:n.ink],[t.helpers.reduce((g,y)=>g+y.count,0),"helpers",n.ink]],h=498/4;d.forEach(([g,y,m],p)=>{let x=36+p*(h+10);i&&(e.fillStyle=n.bg,e.beginPath(),e.roundRect(x,r,h,66,10),e.fill()),c(String(g),x+12,r+34,`600 26px ${n.serif}`,m),c(y,x+12,r+54,`500 11.5px ${n.sans}`,n.muted)}),r+=66,u("What shipped"),l(Yh(t),`400 13.5px ${n.sans}`,n.ink,20);let f=t.shipped.filter(g=>g.type!=="image").slice(0,tf);for(let g of f)r+=26,i&&(e.fillStyle=n[$w[g.type]]||n.muted,e.beginPath(),e.roundRect(36,r-14,18,18,4),e.fill()),c(Xd[g.type]?.icon??"\u2022",45,r,`700 11px ${n.sans}`,"#fff","center"),e.font=`500 13.5px ${n.sans}`,c(Nw(e,g.title??"",528*.6),64,r,`500 13.5px ${n.sans}`,n.ink),e.font=`400 11.5px ${n.sans}`,c(Nw(e,g.thread??"",528*.34),564,r,`400 11.5px ${n.sans}`,n.muted,"right");return t.finished.length&&(u("Wrapped up"),l(t.finished.map(g=>g.title).join(" \xB7 "),`400 13.5px ${n.sans}`,n.ink,20)),u("Waiting on you"),l(t.waiting.length?t.waiting.map(g=>`${g.title} ${g.words}`).join(" \xB7 "):"Nothing. You\u2019re all caught up.",`400 13.5px ${n.sans}`,n.ink,20),u("Who helped"),l(Kh(t),`400 13.5px ${n.sans}`,n.ink,20),u("The work"),l(Zh(t),`400 13.5px ${n.sans}`,n.ink,20),r+=30,i&&(e.strokeStyle=n.line,e.setLineDash([4,4]),e.beginPath(),e.moveTo(36,r-14),e.lineTo(564,r-14),e.stroke(),e.setLineDash([])),c("Agent Office",36,r+4,`600 13px ${n.serif}`,n.ink),c("made on your own computer",564,r+4,`400 11px ${n.sans}`,n.muted,"right"),r+36}function n3(e){let t=t3(),n=2,i=document.createElement("canvas"),s=i.getContext("2d");s.font=`400 13px ${t.sans}`;let o=Uw(s,e,t,!1);return i.width=600*n,i.height=Math.ceil(o*n),s.scale(n,n),s.fillStyle=t.paper,s.fillRect(0,0,600,o),s.fillStyle=t.accent,s.fillRect(0,0,600,5),s.textBaseline="alphabetic",Uw(s,e,t,!0),i}function i3(e){n3(e).toBlob(n=>{if(!n)return i0("Couldn\u2019t make the picture.");let i=document.createElement("a");i.href=URL.createObjectURL(n);let s=new Date(e.day);i.download=`agent-office-${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}-${String(s.getDate()).padStart(2,"0")}.png`,document.body.append(i),i.click(),i.remove(),setTimeout(()=>URL.revokeObjectURL(i.href),2e3),i0("Saved as a picture.")},"image/png")}function i0(e){pc=e,sf(),setTimeout(()=>{pc===e&&(pc="",sf())},2400)}var Ow=0,Fw="";function sf(e=!0){let t=Ys("#recap");if(!t?.open||!e&&Date.now()-Ow<5e3)return;let n=QI(nf());if(n===Fw)return;let i=t.querySelector(".rc-body"),s=document.activeElement,o=i.contains(s)&&(s.dataset.recap?`[data-recap="${s.dataset.recap}"]`:s.dataset.recapPick?`[data-recap-pick="${CSS.escape(s.dataset.recapPick)}"]`:null);i.innerHTML=n,Fw=n,Ow=Date.now(),o&&i.querySelector(o)?.focus()}function Bw(){let e=Ys("#recap");zw(),e.open||e.showModal(),pc="",sf(),e.querySelector('[data-recap="copy"]')?.focus()}function n0(){Ys("#recap")?.close()}function zw(){let e=Ys("#recap-offer");e&&(e.hidden=!0)}function s3(e){mc=e,ef||Hw.set(e);let t=Ys("#recap-offer");t&&(t.hidden=!1)}function s0(){ef||=Date.now(),mc=null}function Vw({onPick:e,demo:t=!1}){Lw=e,mc=Hw.get(),t&&s0(),Ys("#recap-open").addEventListener("click",Bw);let n=Ys("#recap");n.addEventListener("keydown",i=>{i.key==="Escape"&&i.stopPropagation()}),n.addEventListener("click",async i=>{if(i.target===n)return n0();let s=i.target.closest("[data-recap]")?.dataset.recap,o=i.target.closest("[data-recap-pick]")?.dataset.recapPick;s==="close"?n0():s==="copy"?i0(await Nm(kw(nf()))?"Copied. Paste it anywhere.":"Couldn\u2019t copy here."):s==="image"?i3(nf()):o&&(n0(),Lw(o))}),Ys("#recap-offer").addEventListener("click",i=>{let s=i.target.closest("[data-offer]")?.dataset.offer;s==="open"?Bw():s==="later"&&zw()})}function Gw(e){let t=Date.now();if([...B.values()].filter(s=>s.kind==="session"&&!s.past&&s.status!=="done").some(s=>$e(s,e)==="working")&&(Dw=t),Ys("#recap")?.open)return sf(!1);let i=nf(e);mc!==i.day&&(ef?t-ef>JI&&i.shipped.length:Pw(i,{now:t,lastBusyAt:Dw,offeredDay:mc}))&&s3(i.day)}var gc=[],Ks=null,ni=null,yc=null;function o0(){if(ni)return!0;if(Ks)return!1;Ks=document.getElementById("settings-open");let e=document.getElementById("settings");return!Ks||!e?!1:(ni=e,yc=ni.querySelector(".set-rows")??ni.appendChild(Object.assign(document.createElement("div"),{className:"set-rows"})),Ks.setAttribute("aria-haspopup","true"),Ks.addEventListener("click",()=>ni.hidden?a3():of()),yc.addEventListener("change",t=>{let n=gc.find(s=>s.id===t.target.dataset.setting);if(!n)return;n.set(n.type==="choice"?t.target.value:t.target.checked);let i=t.target.value;r0(),n.type==="choice"&&yc.querySelector(`input[data-setting="${CSS.escape(n.id)}"][value="${CSS.escape(i)}"]`)?.focus()}),ni.addEventListener("click",t=>{t.target.closest("#alerts-open, #tour-open")&&of()}),ni.addEventListener("keydown",t=>{t.key==="Escape"&&(t.stopPropagation(),of(),Ks.focus())}),addEventListener("pointerdown",t=>{!ni.hidden&&!ni.contains(t.target)&&!Ks.contains(t.target)&&of()}),!0)}function r0(){yc&&(yc.innerHTML=gc.map(e=>{let t=e.disabled?.()??!1,n=typeof e.hint=="function"?e.hint():e.hint;return e.type==="choice"?r3(e,n):`<label class="switch set-row${t?" off":""}">
      <input type="checkbox" role="switch" data-setting="${k(e.id)}" ${e.get()?"checked":""} ${t?"disabled":""}>
      <span><b>${k(e.label)}</b>${n?`<small>${k(n)}</small>`:""}</span>
    </label>`}).join(""))}function r3(e,t){let n=e.get();return`<fieldset class="set-row set-choice">
    <legend><b>${k(e.label)}</b>${t?`<small>${k(t)}</small>`:""}</legend>
    <div class="set-opts">${e.options.map(i=>`<label class="set-opt">
      <input type="radio" name="set-${k(e.id)}" data-setting="${k(e.id)}" value="${k(i.value)}" ${i.value===n?"checked":""}>
      ${i.swatch?`<span class="swatch" aria-hidden="true">${i.swatch.map(s=>`<i style="background:${k(s)}"></i>`).join("")}</span>`:""}
      <span>${k(i.label)}</span>
    </label>`).join("")}</div>
  </fieldset>`}function a3(){o0()&&(r0(),ni.hidden=!1,Ks.setAttribute("aria-expanded","true"),ni.querySelector("button, input:not([disabled])")?.focus())}function of(){!ni||ni.hidden||(ni.hidden=!0,Ks.setAttribute("aria-expanded","false"))}function Aa(e){if(e.type&&e.type!=="toggle"&&e.type!=="choice")throw new Error(`settings: unknown type ${e.type}`);let t=gc.findIndex(n=>n.id===e.id);t>=0?gc[t]=e:gc.push(e),o0()&&r0()}function Ww(e){if(!o0())return;let t=document.getElementById("dev-view");if(!t)return;let n=()=>{t.checked=Ve(),document.body.classList.toggle("dev",Ve())};n(),t.addEventListener("change",()=>{$0(t.checked),n(),e?.()})}var l3=416,Xw=300,jw=260,c3=720,u3=180,af=.72,Yw=24,d3=74,h3=16,Kw=16,f3=322,a0=e=>typeof e=="number"&&Number.isFinite(e);function rf(e,{vw:t,vh:n}){let i=Math.max(Xw,Math.min(t-Kw*2,t-f3-Kw*2)),s=Math.max(jw,n-d3-h3),o=a0(e?.w)?e.w:l3,a=a0(e?.h)?e.h:c3;return{w:Math.round(Math.min(i,Math.max(Xw,o))),h:Math.round(Math.min(s,Math.max(jw,a)))}}function xc(e,t){let n=Math.min(1,u3/Math.max(1,t)),i=Math.max(n,1-72/Math.max(1,t));return Math.min(i,Math.max(n,a0(e)?e:af))}var Zw=(e,t,n,i)=>({w:e.w-t,h:i==="corner"?e.h+n:e.h}),p3=(e,t,n)=>e-t/Math.max(1,n),m3="(max-width: 600px)",g3="(max-width: 900px)",_c=Wn("clipboard-size",null),Ra=Wn("clipboard-sheet",af);function Jw(){let e=document.getElementById("side");if(!e||typeof matchMedia!="function")return;let t=document.documentElement,n=matchMedia(m3),i=()=>({vw:innerWidth,vh:innerHeight}),s=matchMedia(g3),o=()=>Math.max(1,innerHeight-(n.matches?130:76)),a=(m,p)=>{let x=document.createElement("div");return x.className=`clip-grip ${m}`,x.tabIndex=0,x.setAttribute("role","separator"),x.setAttribute("aria-label",p),x.hidden=!0,e.after(x),x},r=a("edge","Resize the clipboard: drag, or use the arrow keys"),c=a("corner","Resize the clipboard: drag, or use the arrow keys"),l=a("sheet","Resize the sheet: drag, or use the up and down arrows");r.setAttribute("aria-orientation","vertical"),l.setAttribute("aria-orientation","horizontal");function u(){let m=e.classList.contains("clipboard"),p=s.matches,x=rf(_c,i());t.style.setProperty("--clip-w",`${x.w}px`),t.style.setProperty("--clip-h",`${x.h}px`),t.style.setProperty("--sheet-h",`${Math.round(xc(Ra,o())*o())}px`),r.hidden=c.hidden=!m||p,l.hidden=!m||!p,m&&p?t.dataset.sheet="":delete t.dataset.sheet,r.setAttribute("aria-valuenow",String(x.w)),l.setAttribute("aria-valuenow",String(Math.round(xc(Ra,o())*100)))}function d(m,p){_c=rf(m,i()),p&&qn("clipboard-size",_c),u()}function h(m,p){Ra=xc(m,o()),p&&qn("clipboard-sheet",Ra),u()}function f(m,p){m.addEventListener("pointerdown",x=>{if(x.button!==0)return;x.preventDefault(),m.setPointerCapture(x.pointerId),m.classList.add("dragging"),t.classList.add("clip-resizing");let b=x.clientX,v=x.clientY,T=rf(_c,i()),S=xc(Ra,o()),A=_=>p(_.clientX-b,_.clientY-v,T,S,!1),R=_=>{p(_.clientX-b,_.clientY-v,T,S,!0),m.classList.remove("dragging"),t.classList.remove("clip-resizing"),m.removeEventListener("pointermove",A),m.removeEventListener("pointerup",R),m.removeEventListener("pointercancel",R)};m.addEventListener("pointermove",A),m.addEventListener("pointerup",R),m.addEventListener("pointercancel",R)})}f(r,(m,p,x,b,v)=>d(Zw(x,m,p,"edge"),v)),f(c,(m,p,x,b,v)=>d(Zw(x,m,p,"corner"),v)),f(l,(m,p,x,b,v)=>h(p3(b,p,o()),v));let g=(m,p)=>m.addEventListener("keydown",x=>{p(x.key,x.shiftKey?Yw*4:Yw)&&(x.preventDefault(),x.stopPropagation())}),y=(m,p)=>{let x=rf(_c,i());if(m==="ArrowLeft")d({...x,w:x.w+p},!0);else if(m==="ArrowRight")d({...x,w:x.w-p},!0);else if(m==="ArrowDown")d({...x,h:x.h+p},!0);else if(m==="ArrowUp")d({...x,h:x.h-p},!0);else if(m==="Home")d(null,!0);else return!1;return!0};g(r,y),g(c,y),g(l,(m,p)=>{let x=xc(Ra,o());if(m==="ArrowUp")h(x+p/o(),!0);else if(m==="ArrowDown")h(x-p/o(),!0);else if(m==="Home")h(af,!0);else return!1;return!0});for(let m of[r,c])m.addEventListener("dblclick",()=>d(null,!0));l.addEventListener("dblclick",()=>h(af,!0)),new MutationObserver(u).observe(e,{attributes:!0,attributeFilter:["class"]}),addEventListener("resize",u),s.addEventListener?.("change",u),n.addEventListener?.("change",u),u()}var y3=[{at:"critter",title:"A thread",text:"One of your Claude Code sessions. It hops when it does something, and its screen scrolls while it works."},{at:"ring",title:"Its energy",text:"The ring fills as its memory of the conversation fills. Near the top it needs a break: it tidies up and carries on."},{at:"beads",title:"Beads",text:"One floats up for each thing it does: blue reading, coral changing, green searching, yellow commands. Red is a bump."},{at:"helper",title:"A helper",text:"A smaller critter it brought in for part of the job. When it\u2019s done it goes for coffee."},{at:".bubbles .bub",title:"A bubble",text:"What it says, shows you or asks you. Questions wait for your answer."},{at:"sign",title:"A room",text:"Each project gets a room. Click the sign to zoom in, or its icon to rename it."},{at:"coffee",title:"The coffee corner",text:"Where helpers take a break once their work is done."},{at:".board",title:"Waiting on you",text:"Threads whose next move is yours. Answer or reply right here."},{at:".tape",title:"Activity",text:"What got finished, made and asked. Small bumps fold into one quiet line."},{at:"#side",title:"Your projects",text:"Every thread and its helpers. Click one to read the conversation and see what it made."},{at:"#settings-open",title:"Settings",text:"Sound, alerts, past sessions, a snapshot to share, the tour, and Developer view for the raw commands and numbers."}],Qw=e=>String(e).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),x3=210,Ln=22,Fe=null,lf=null,cf=()=>!!(Fe&&!Fe.hidden);function _3(e,t){if(e in t)return t[e]||null;let n=document.querySelector(e),i=n?.getBoundingClientRect();if(!i?.width||!i.height||getComputedStyle(n).display==="none")return null;let s=i.width>160&&i.height>120;return{x:s?i.left+i.width/2<innerWidth/2?i.right-18:i.left+18:i.left+i.width/2,y:s?i.top+Math.min(i.height/2,90):i.top+i.height/2,panel:s}}var l0=(e,t)=>e.x<t.x+t.w&&t.x<e.x+e.w&&e.y<t.y+t.h&&t.y<e.y+e.h;function b3(e,t){let n=[t],i=e.map(s=>({x:s.at.x-14,y:s.at.y-14,w:28,h:28}));for(let s of e){let{x:o,y:a}=s.at,r=s.w,c=s.h,l=o<innerWidth/2,u=[[l?o+Ln:o-Ln-r,a-c-Ln],[l?o+Ln:o-Ln-r,a+Ln],[l?o-Ln-r:o+Ln,a-c-Ln],[l?o-Ln-r:o+Ln,a+Ln],[l?o+Ln+8:o-Ln-8-r,a-c/2],[o-r/2,a+Ln+6],[o-r/2,a-c-Ln-6]].map(([f,g])=>({x:Math.max(8,Math.min(innerWidth-r-8,f)),y:Math.max(8,Math.min(innerHeight-c-8,g)),w:r,h:c})),d=f=>n.filter(g=>l0(g,f)).length*10+i.filter(g=>l0(g,f)).length*3+Math.hypot(f.x+r/2-o,f.y+c/2-a)/400,h=u.reduce((f,g)=>d(g)<d(f)?g:f);s.box=h,n.push(h)}}function v3(e){let{x:t,y:n}=e.at,i=e.box,s=Math.max(i.x,Math.min(i.x+i.w,t)),o=Math.max(i.y,Math.min(i.y+i.h,n));return`<line x1="${t}" y1="${n}" x2="${s}" y2="${o}"/>`}function tM(){let e=Ug(),t=y3.map(o=>({...o,at:_3(o.at,e)})).filter(o=>o.at),n=innerWidth<700;if(Fe.classList.toggle("narrow",n),Fe.innerHTML=`
    <div class="help-head paper">
      <h2 id="help-title">What am I looking at?</h2>
      <p>${t.length?"Here\u2019s what each part of the office means.":"The office fills in as your sessions work."} Press <kbd>Esc</kbd> or click anywhere to go back.</p>
      <button type="button" class="help-close" data-help-close>Got it</button>
    </div>
    <svg class="help-lines" aria-hidden="true"></svg>
    <ol class="help-notes">${t.map((o,a)=>`<li class="help-note paper"><span class="help-num" aria-hidden="true">${a+1}</span><b>${Qw(o.title)}</b> ${Qw(o.text)}</li>`).join("")}</ol>
    ${t.map((o,a)=>`<span class="help-pin" aria-hidden="true" style="left:${o.at.x}px;top:${o.at.y}px">${a+1}</span>`).join("")}`,n){let o=[Fe.querySelector(".help-head"),Fe.querySelector(".help-notes")].map(a=>a.getBoundingClientRect());for(let a of Fe.querySelectorAll(".help-pin")){let r=a.getBoundingClientRect();o.some(c=>l0({x:r.left,y:r.top,w:r.width,h:r.height},{x:c.left,y:c.top,w:c.width,h:c.height}))&&(a.hidden=!0)}return}let i=Fe.querySelector(".help-head").getBoundingClientRect(),s=[...Fe.querySelectorAll(".help-note")];t.forEach((o,a)=>{o.w=x3,o.h=s[a].offsetHeight}),b3(t,{x:i.left-8,y:i.top-8,w:i.width+16,h:i.height+16}),t.forEach((o,a)=>Object.assign(s[a].style,{left:`${o.box.x}px`,top:`${o.box.y}px`})),Fe.querySelector(".help-lines").innerHTML=t.map(v3).join("")}function eM(){Fe||(Fe=document.createElement("div"),Fe.id="help",Fe.className="help",Fe.setAttribute("role","dialog"),Fe.setAttribute("aria-modal","true"),Fe.setAttribute("aria-labelledby","help-title"),Fe.hidden=!0,document.body.append(Fe),Fe.addEventListener("click",c0)),lf=document.activeElement,Fe.hidden=!1,tM(),document.getElementById("help-open")?.setAttribute("aria-expanded","true"),Fe.querySelector("[data-help-close]").focus()}function c0(){cf()&&(Fe.hidden=!0,document.getElementById("help-open")?.setAttribute("aria-expanded","false"),lf?.isConnected&&lf.focus(),lf=null)}var w3=()=>cf()?c0():eM(),M3=e=>e&&(e.tagName==="TEXTAREA"||e.tagName==="INPUT"||e.isContentEditable);function nM(){document.getElementById("help-open")?.addEventListener("click",e=>{e.stopPropagation(),w3()}),addEventListener("keydown",e=>{if(cf()){e.key==="Escape"||e.key==="?"?(e.preventDefault(),e.stopImmediatePropagation(),c0()):e.key==="Tab"?(e.preventDefault(),Fe.querySelector("[data-help-close]").focus()):e.stopImmediatePropagation();return}e.key==="?"&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&!M3(document.activeElement)&&(e.preventDefault(),e.stopImmediatePropagation(),eM())},!0),addEventListener("resize",()=>{cf()&&tM()})}var S3={image:"picture",artifact:"artifact",pr:"pull request",link:"link",file:"file",plan:"plan"};function sM(e){if(e.kind==="letter")return`Passing on what the thread ${Se(e.from??"another thread")} said, in case it helps:

${e.text}`;let t=e.output,n=S3[t.type]??"output",i=t.url??t.path;return`Have a look at this ${n}${e.from?` from ${Se(e.from)}`:""}: ${t.title}${i&&i!==t.title?` (${i})`:""}`}function oM(e){let t=e.filter(i=>i.kind==="session"&&!i.past&&i.status!=="done"),n=[];for(let i of t){n.push({id:i.id,name:"The thread itself",kind:"session",group:i.label,thread:i.id});let s=o=>o.forEach(({node:a,children:r})=>{On(a)!=="done"&&On(a)!=="failed"&&n.push({id:a.id,name:a.description&&a.description!==a.label?`${a.label}: ${a.description}`:a.label,kind:"agent",group:i.label,thread:i.id}),s(r)});s(as(i))}return n}var u0="application/x-agent-office-handoff";function df(e){let[t,n,...i]=(e??"").split("|");if(t==="letter"){let s=B.get(n);return s?.answer?.text?{kind:t,from:s.prompts?.[0]?.text??s.label,text:s.answer.text,source:s.id}:null}if(t==="output"){let s=i.join("|"),o=Zt.find(r=>r.session===n&&r.id===s),a=o&&B.get(Ct(o.session));return o?{kind:t,output:o,from:a?.prompts?.[0]?.text??a?.label,source:a?.id}:null}return null}var ke=null,d0=()=>null,bc=()=>{},E3=()=>document.getElementById("handoff");function Ca(){let e=E3();if(!e)return;if(!ke){e.hidden=!0,e.innerHTML="";return}let t=df(ke.ref);if(!t)return uf();let n=oM([...B.values()]).filter(c=>c.id!==t.source||t.kind==="output"),i=B.get(ke.to);e.hidden=!1,e.innerHTML=`
    <form class="handoff-card paper" aria-label="Hand it off">
      <p class="handoff-eyebrow"><i>\u2709</i>${t.kind==="letter"?"Pass this letter on":"Hand this over"}</p>
      <label class="handoff-to">To
        <select name="to">${[...new Set(n.map(c=>c.thread))].map(c=>`<optgroup label="${k(n.find(l=>l.thread===c).group)}">${n.filter(l=>l.thread===c).map(l=>`<option value="${k(l.id)}" ${l.id===ke.to?"selected":""}>${k(l.name)}</option>`).join("")}</optgroup>`).join("")}</select>
      </label>
      <textarea name="text" rows="5" aria-label="The message">${k(ke.text??sM(t))}</textarea>
      <p class="handoff-hint">${i?.kind==="agent"?"Goes straight to this agent while it works.":"Arrives as its next prompt, marked as from Agent Office."}</p>
      ${ke.status?`<p class="handoff-status ${ke.ok===!1?"bad":""}" role="status">${k(ke.status)}</p>`:""}
      <div class="handoff-row"><button type="button" data-handoff-close>Cancel</button><button type="submit" class="go">Send</button></div>
    </form>`;let s=e.firstElementChild,o=s.offsetWidth||320,a=s.offsetHeight||260;s.style.left=`${Math.max(12,Math.min(innerWidth-o-12,(ke.x??innerWidth/2)-o/2))}px`,s.style.top=`${Math.max(12,Math.min(innerHeight-a-12,(ke.y??innerHeight/2)-a-24))}px`;let r=s;r.text.oninput=()=>{ke.text=r.text.value},r.to.onchange=()=>{ke.to=r.to.value,Ca()},r.querySelector("[data-handoff-close]").onclick=uf,r.onsubmit=async c=>{c.preventDefault();let l=B.get(r.to.value),u=r.text.value;if(!l||!u.trim())return;ke.status="Sending\u2026",ke.text=u,Ca();let d=await wa(l,u);ke&&(d.ok?(ke.status=`Sent to ${l.label}.`,Ca(),setTimeout(uf,1400)):(ke.status=d.status,ke.ok=!1,Ca()))},ke.focused||(ke.focused=!0,r.querySelector("textarea").focus())}function iM(e,t,n,i){if(!yr()||!df(e))return;let s=oM([...B.values()]).find(o=>o.id!==df(e).source)?.id;ke={ref:e,to:t??s,x:n,y:i},Ca()}function uf(){let e=ke?.trigger;ke=null,Ca(),e?.focus?.()}function rM({stage:e,critterAt:t,setHover:n}){d0=t,bc=n,document.addEventListener("dragstart",i=>{let s=i.target.closest?.("[data-handoff]");!s||!yr()||(i.dataTransfer.setData(u0,s.dataset.handoff),i.dataTransfer.setData("text/plain",(()=>{let o=df(s.dataset.handoff);return o?sM(o):""})()),i.dataTransfer.effectAllowed="copy",document.body.classList.add("handing-off"))}),document.addEventListener("dragend",()=>{document.body.classList.remove("handing-off"),e.classList.remove("drop-ok"),bc(null)}),e.addEventListener("dragover",i=>{if(!i.dataTransfer.types.includes(u0))return;let s=d0(i.clientX,i.clientY),o=s&&B.get(s)&&(B.get(s).kind==="session"||B.get(s).kind==="agent");e.classList.toggle("drop-ok",!!o),bc(o?s:null),o&&(i.preventDefault(),i.dataTransfer.dropEffect="copy")}),e.addEventListener("dragleave",i=>{e.contains(i.relatedTarget)||(e.classList.remove("drop-ok"),bc(null))}),e.addEventListener("drop",i=>{let s=i.dataTransfer.getData(u0),o=d0(i.clientX,i.clientY);e.classList.remove("drop-ok"),bc(null),!(!s||!o)&&(i.preventDefault(),iM(s,o,i.clientX,i.clientY))}),document.addEventListener("keydown",i=>{if(i.key==="Escape"&&ke){i.stopPropagation(),uf();return}if(i.key!=="h"&&i.key!=="H"||i.metaKey||i.ctrlKey||i.altKey)return;let s=document.activeElement?.closest?.("[data-handoff]");if(!s)return;i.preventDefault(),i.stopPropagation();let o=s.getBoundingClientRect();iM(s.dataset.handoff,void 0,o.left+o.width/2,o.top+40),ke&&(ke.trigger=s)},!0)}var ff=e=>document.querySelector(e),h0="claude";function aM(e){return Math.min(30,[2,4,8,15][e-1]??30)}var A3=2500;function R3({hasPast:e=!1}={}){return e?{title:"Nobody\u2019s in right now",body:"Your past sessions are hidden. Tick Past sessions to see them, or start a new one and it walks in through this door."}:{title:"Hi! The office is ready for you",body:"Start a Claude Code session and it walks in through this door, takes a desk in its project\u2019s room, and you can follow along and talk to it from here."}}var C3=`
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
  </svg>`,Dn=null;function k3(){Dn=document.createElement("section"),Dn.id="greeter",Dn.className="hud",Dn.setAttribute("aria-label","Getting started"),Dn.hidden=!0,Dn.innerHTML=`
    <div class="greeter-bubble paper" role="note">
      <b class="greeter-title"></b>
      <p class="greeter-body"></p>
      <ol class="greeter-steps">
        <li><span>Open a terminal and start Claude Code</span>
          <span class="greeter-cmd"><code>${h0}</code><button type="button" class="greeter-copy" aria-label="Copy the command ${h0}">Copy</button></span></li>
        <li><span>Say hello. Anything works, like <q>What\u2019s in this folder?</q></span></li>
      </ol>
      <p class="greeter-foot"><button type="button" class="greeter-tour" hidden>Take the 1-minute tour</button><span class="greeter-wait"><i></i>Waiting for your first session</span></p>
    </div>
    <div class="greeter-door" aria-hidden="true">${C3}<span class="greeter-mat"></span></div>`,ff(".stage-wrap").append(Dn);let e=Dn.querySelector(".greeter-copy");e.addEventListener("click",async()=>{let t=!1;try{await navigator.clipboard.writeText(h0),t=!0}catch{let n=document.createRange();n.selectNodeContents(Dn.querySelector(".greeter-cmd code")),getSelection().removeAllRanges(),getSelection().addRange(n)}e.textContent=t?"Copied":"Press Ctrl+C",e.classList.toggle("done",t),setTimeout(()=>{e.textContent="Copy",e.classList.remove("done")},1800)}),Dn.querySelector(".greeter-tour").addEventListener("click",()=>ff("#tour-open")?.click())}function cM(e,{hasPast:t=!1}={}){if(Dn||k3(),ln&&!ln.hidden&&(e=!1),Dn.hidden===!e||(Dn.hidden=!e,!e))return;let{title:n,body:i}=R3({hasPast:t});Dn.querySelector(".greeter-title").textContent=n,Dn.querySelector(".greeter-body").textContent=i,Dn.querySelector(".greeter-tour").hidden=!ff("#tour-open")}var ln=null,ka=0,pf=0,uM=0,mf=0,hf=0,vc=null,Pa=!1;function P3(){ln=document.createElement("section"),ln.id="offline",ln.className="hud paper",ln.setAttribute("role","status"),ln.hidden=!0,ln.innerHTML=`
    <p class="eyebrow">Connection</p>
    <b class="offline-title">The office lost touch with its bridge</b>
    <p class="offline-body">The bridge is the small helper on your computer that tells this page what Claude is doing. It may have stopped, or your computer may have slept. Nothing is lost: your sessions keep working without it.</p>
    <p class="offline-try"><i></i><span class="offline-count">Trying again\u2026</span><button type="button" class="offline-now">Try now</button></p>
    <p class="offline-help">Still stuck? Type <code>/office</code> in Claude Code to start it again.</p>`,ff(".stage-wrap").append(ln),ln.querySelector(".offline-now").addEventListener("click",()=>dM())}function lM(){let e=Math.max(0,Math.ceil((hf-Date.now())/1e3));ln.querySelector(".offline-count").textContent=e?`Trying again in ${e}s`:"Trying again\u2026",ln.querySelector(".offline-title").textContent=Date.now()-pf>6e4?"The bridge seems to have stopped":"The office lost touch with its bridge"}function dM(){clearTimeout(mf),Pa=!1;let e=vc;vc=null,ka++,ln&&(ln.querySelector(".offline-count").textContent="Trying again\u2026"),e?e():gf()}function gf(e){if(ln||P3(),pf||(pf=Date.now(),ka=0,uM=setTimeout(()=>{ln.hidden=!1,lM()},A3)),vc=e??null,Pa)return;Pa=!0,hf=Date.now()+aM(ka+1)*1e3;let t=()=>{if(ln.hidden||lM(),Date.now()>=hf){if(Pa=!1,vc)return dM();Pa=!0,ka++,hf=Date.now()+aM(ka+1)*1e3}mf=setTimeout(t,500)};mf=setTimeout(t,500)}function hM(){pf=0,ka=0,vc=null,Pa=!1,clearTimeout(uM),clearTimeout(mf),ln&&(ln.hidden=!0)}var xM="agent-office-toured",Ro="tour-",Mc={id:"/sample/your-project",name:"your-project"},yf=10,ws=[{title:"Welcome to your office",body:"Everything Claude Code is doing on this computer shows up here, as a cozy office. Here\u2019s a one-minute look around.",at:null},{title:"Each project gets a room",body:"A project is a folder you work in. Its room gets its own color and furniture, so you can tell them apart at a glance.",at:"room"},{title:"Each critter is a conversation",body:"Every Claude Code session is a critter at its own desk. It hops when it does something, and helpers it starts stand behind it. Hover one to see what it\u2019s doing.",at:"critter",enter:"zoom"},{title:"Waiting on you",body:"When a session finishes and needs you, a note lands here, longest waiting first. Questions it asks show up here too, with buttons to answer.",at:"board"},{title:"The clipboard",body:"Click any critter, note or line to open its clipboard: the conversation as it happens, what it made, its helpers, and the details.",at:"side",enter:"open"},{title:"Reply without switching windows",body:"Type here and press Enter: your message becomes the session\u2019s next prompt. Press r any time to reply to whoever has waited longest.",at:"reply",enter:"open"}];function L3(e,t,n,i=14){let s=c=>Math.max(12,Math.min(n.width-t.width-12,c)),o=c=>Math.max(12,Math.min(n.height-t.height-12,c));if(!e)return{left:s((n.width-t.width)/2),top:o((n.height-t.height)/2),side:"center"};let a=e.left+e.width/2-t.width/2,r=e.top+e.height/2-t.height/2;return e.top+e.height+i+t.height<=n.height-12?{left:s(a),top:e.top+e.height+i,side:"below"}:e.top-i-t.height>=12?{left:s(a),top:e.top-i-t.height,side:"above"}:e.left+e.width+i+t.width<=n.width-12?{left:e.left+e.width+i,top:o(r),side:"right"}:e.left-i-t.width>=12?{left:e.left-i-t.width,top:o(r),side:"left"}:{left:s(a),top:n.height-t.height-12,side:"over"}}function D3({param:e,seen:t,webdriver:n}){return e==="1"?!0:e==="0"?!1:!t&&!n}var N3=()=>{try{return localStorage.getItem(xM)==="1"}catch{return!1}},U3=()=>{try{localStorage.setItem(xM,"1")}catch{}},Co=!1,_M=0,Mn=null;function bM(e){let t=(n,i,s)=>({t:e+n,session:`${Ro}${i}`,...s});return[t(0,"a",{kind:"session.start",cwd:Mc.id,model:"claude-sonnet-5-5",project:Mc}),t(1,"a",{kind:"turn.start",text:"Tidy up the README"}),t(2,"a",{kind:"context.measure",context:{tokens:46e3,window:2e5}}),t(3,"a",{kind:"turn.complete",reason:"answer",answer:"All tidy! I fixed the headings and two broken links. Want a screenshot at the top too?"}),t(10,"b",{kind:"session.start",cwd:Mc.id,model:"claude-sonnet-5-5",project:Mc}),t(11,"b",{kind:"turn.start",text:"Why are the tests slow?"}),t(12,"b",{kind:"context.measure",context:{tokens:88e3,window:2e5}}),t(13,"b",{kind:"agent.spawn",agent:"helper",type:"Explore",description:"Time each test file"})]}var fM=[["Read","package.json"],["Bash","npm test"],["Grep","setTimeout"],["Read","test/setup.js"]];function O3(){if(Co)return;Co=!0,bM(Date.now()).forEach(Mn.ingest);let e=0;_M=setInterval(()=>{let[t,n]=fM[e%fM.length],i=e%2?"helper":void 0,s=`tour-tool-${e++}`,o={session:`${Ro}b`,...i&&{agent:i}};Mn.ingest({...o,t:Date.now(),kind:"tool.start",id:s,tool:t,summary:n}),setTimeout(()=>Co&&Mn.ingest({...o,t:Date.now(),kind:"tool.end",id:s,tool:t,ok:!0}),700)},1400)}function f0(){if(!Co)return;Co=!1,clearInterval(_M);let e=n=>typeof n=="string"&&n.startsWith(Ro);for(let n of[...B.values()])e(n.session)&&os(n.id);let t=`p:${Mc.id}`;Xn.some(n=>xi(n.source)===t)||os(t);for(let n of[yi,Zt,Oo])for(let i=n.length-1;i>=0;i--)(e(n[i].session)||String(n[i].target??"").includes(Ro))&&n.splice(i,1);for(let n=Fn.length-1;n>=0;n--)String(Fn[n].target??"").includes(Ro)&&Fn.splice(n,1);for(let n of[...Bn.keys()])n.includes(Ro)&&Bn.delete(n);Of()}var F3=e=>e.kind==="session"&&!e.session.startsWith(Ro),te=null,Nn=-1,xf=0,cn=null,p0=null,pM="",vM=0,_r=e=>document.querySelector(e);function B3(){te=document.createElement("div"),te.id="tour",te.hidden=!0,te.innerHTML=`
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
    </section>`,document.body.append(te),te.querySelector(".tour-skip").onclick=()=>m0(),te.querySelector(".tour-back").onclick=()=>_f(Nn-1),te.querySelector(".tour-next").onclick=()=>Nn>=ws.length-1||cn?m0():_f(Nn+1),te.querySelector(".tour-catch").onclick=()=>te.querySelector(".tour-next").focus()}function wM(){let e=[...B.values()].filter(n=>n.kind==="session");if(cn&&B.has(cn))return B.get(cn);let t=e.filter(n=>!n.past&&n.status!=="done");return t.find(n=>n.answer)??t[0]??e[0]??null}function mM(e){let{camera:t,stage:n}=Mn.table.debug;if(!t||!n)return null;let i=n.getBoundingClientRect(),s=1/0,o=1/0,a=-1/0,r=-1/0;for(let c of e){let l=c.clone().project(t);if(l.z>1)continue;let u=i.left+(l.x+1)/2*i.width,d=i.top+(1-l.y)/2*i.height;s=Math.min(s,u),o=Math.min(o,d),a=Math.max(a,u),r=Math.max(r,d)}return Number.isFinite(s)?{left:s,top:o,width:a-s,height:r-o}:null}function gM(e,t,n,i){let s=Mn.table.debug.camera.position.constructor,o=[];for(let a of[-t,t])for(let r of[-n,n])for(let c of[0,i])o.push(new s(e.x+a,e.y+c,e.z+r));return o}var wc=e=>{if(!e||!e.isConnected||e.closest("[hidden]"))return null;let t=e.getBoundingClientRect();return t.width&&t.height?{left:t.left,top:t.top,width:t.width,height:t.height}:null};function H3(e){let t=wM(),{rooms:n,sessionViews:i}=Mn.table.debug;if(e==="room"){let s=t&&n.get(`p:${t.project}`);return!s?.mesh||!s.w?null:mM(gM(s.mesh.position,s.w/2,s.d/2,46))}if(e==="critter"){let s=t&&i.get(t.id);return s?mM(gM(s.group.position,18,14,34)):null}return e==="board"?wc(_r(".hud.left .board")):e==="side"?wc(_r("#side")):e==="reply"?wc(_r("#side .tx-compose"))??wc(_r("#inbox .card:not(.gone)"))??wc(_r("#side")):null}function MM(e){let t=wM();t&&(e.enter==="open"?Mn.pick(t.id):(Mn.pick(null),e.enter==="zoom"?Mn.table.focusOn(t.id):Mn.table.focusOn(null)))}function SM(){let e=cn?EM:ws[Nn];te.querySelector(".tour-count").textContent=cn?"Your office":`${Nn+1} of ${ws.length}`,te.querySelector(".tour-title").textContent=e.title,te.querySelector(".tour-body").innerHTML=k(e.body),te.querySelector(".tour-dots").innerHTML=cn?"":ws.map((t,n)=>`<i class="${n===Nn?"on":n<Nn?"past":""}"></i>`).join(""),te.querySelector(".tour-back").hidden=Nn===0||!!cn,te.querySelector(".tour-skip").hidden=Nn===ws.length-1||!!cn,te.querySelector(".tour-keys").hidden=!!cn,te.querySelector(".tour-next").textContent=cn?"Say hi":Nn===0?"Show me around":Nn===ws.length-1?"Start exploring":"Next"}var EM={title:"Your first session just walked in!",body:"That one\u2019s real. The sample critters have gone home, and the office is all yours. Click your session any time to follow along.",at:"critter"};function TM(){if(!te||te.hidden)return;let e=Co&&[...B.values()].find(F3);e&&(e.past||(e.startedAt??0)<vM)?(f0(),MM(ws[Nn])):e&&(cn=e.id,f0(),SM(),Mn.pick(null),Mn.table.focusOn(cn),te.querySelector(".tour-next").focus()),Co&&!B.has(Ct(`${Ro}a`))&&bM(Date.now()).forEach(Mn.ingest);let t=cn?EM:ws[Nn],n=t.at?H3(t.at):null,i=n&&{left:Math.max(4,n.left-yf),top:Math.max(4,n.top-yf),width:Math.min(innerWidth-8,n.width+yf*2),height:Math.min(innerHeight-8,n.height+yf*2)},s=te.querySelector(".tour-hole");s.classList.contains("none")!==!i&&s.classList.toggle("none",!i);let o=te.querySelector(".tour-note"),a={width:o.offsetWidth,height:o.offsetHeight},r=L3(i,a,{width:innerWidth,height:innerHeight}),c=JSON.stringify([i&&Object.values(i).map(Math.round),Math.round(r.left),Math.round(r.top)]);c!==pM&&(pM=c,i&&Object.assign(s.style,{left:`${i.left}px`,top:`${i.top}px`,width:`${i.width}px`,height:`${i.height}px`}),o.style.left=`${r.left}px`,o.style.top=`${r.top}px`,o.dataset.side=r.side),xf=requestAnimationFrame(TM)}function _f(e){e<0||e>=ws.length||(Nn=e,MM(ws[e]),SM(),te.querySelector(".tour-next").focus())}function yM(){te||B3(),te.hidden&&(U3(),p0=document.activeElement,cn=null,vM=Date.now(),[...B.values()].some(e=>e.kind==="session")||O3(),te.hidden=!1,document.documentElement.classList.add("touring"),_f(0),cancelAnimationFrame(xf),xf=requestAnimationFrame(TM))}function m0(){if(!te||te.hidden)return;te.hidden=!0,document.documentElement.classList.remove("touring"),cancelAnimationFrame(xf);let e=Co;f0(),cn?Mn.pick(cn):e&&(Mn.pick(null),Mn.table.focusOn(null)),cn=null,Nn=-1,(p0?.isConnected?p0:_r("#tour-open"))?.focus()}var $3=()=>!!(te&&!te.hidden);function z3(e){if(!$3())return;let t=()=>{e.preventDefault(),e.stopPropagation()};if(e.key==="Escape")t(),m0();else if(e.key==="ArrowRight")t(),te.querySelector(".tour-next").click();else if(e.key==="ArrowLeft")t(),cn||_f(Nn-1);else if(e.key==="Tab"){let n=[...te.querySelectorAll(".tour-actions button:not([hidden])")],i=n.indexOf(document.activeElement);t(),n[(i+(e.shiftKey?-1:1)+n.length)%n.length]?.focus()}else e.key==="Enter"||e.key===" "?te.contains(document.activeElement)||(t(),te.querySelector(".tour-next").click()):!e.metaKey&&!e.ctrlKey&&!e.altKey&&t()}function AM({pick:e,ingest:t,table:n}){Mn={pick:e,ingest:t,table:n},_r("#tour-open")?.addEventListener("click",yM),addEventListener("keydown",z3,!0);let i=new URLSearchParams(location.search);if(D3({param:i.get("tour"),seen:N3(),webdriver:navigator.webdriver})){let s=()=>document.querySelector("#conn.live")?setTimeout(yM,900):setTimeout(s,300);s()}}var G3=e=>e.kind==="session"&&!e.past&&e.status!=="done",W3=(e,t)=>`${e} ${t}${e===1?"":"s"}`,bf=e=>e.prompts?.[0]?.text??e.label,q3={working:"working",waiting:"waiting on you",asking:"needs your answer",stuck:"needs a look",ended:"ended"};function X3(e,{state:t,helpers:n=0,percent:i}={}){let s=[`${bf(e)}, in ${e.projectName??"another folder"}: ${q3[t]??t}`];return n&&s.push(`${W3(n,"agent")} helping`),i!==void 0&&s.push(`context ${i}% full`),`${s.join(", ")}.`}function j3(e,t,{question:n}={}){return t==="asking"?`New letter: ${bf(e)} asks: ${n??"a question for you"}`:t==="stuck"?`New letter: ${bf(e)} needs a look. Its last turn didn\u2019t finish.`:`New letter: ${bf(e)} is waiting on you.${e.answer?.text?` It said ${Se(e.answer.text.slice(0,140))}`:""}`}function Y3(e,t){return t.filter(n=>!e.has(n))}var K3=new Set(["asking","waiting","stuck"]),Z3=4e3,g0=null,RM="";function CM({running:e,pick:t}){if(typeof document>"u")return;let n=[...B.values()].filter(G3),i=new Map(n.map(u=>[u.id,$e(u,e)])),s=n.filter(u=>K3.has(i.get(u.id))).map(u=>u.id);if(g0&&performance.now()>Z3){let u=Y3(g0,s).map(d=>{let h=B.get(d),f=to(h)[0];return j3(h,i.get(d),{question:f?.questions?.[0]?.question??(f?.type==="permission"?"may it run a command?":f?.type==="plan"?"a plan to approve":void 0)})});if(u.length){let d=document.getElementById("announce");d&&(d.textContent=u.join(" "))}}g0=new Set(s);let o=document.getElementById("scene-list-items");if(!o)return;let a=n.sort((u,d)=>(u.projectName??"").localeCompare(d.projectName??"")||(u.startedAt??0)-(d.startedAt??0)).map(u=>{let d=[...B.values()].filter(f=>f.kind==="agent"&&f.session===u.session&&On(f)==="working").length,h=u.context?.tokens?Math.round(Ke(u)*100):void 0;return{id:u.id,text:X3(u,{state:i.get(u.id),helpers:d,percent:h})}}),r=a.map(u=>`${u.id}\0${u.text}`).join(`
`);if(r===RM)return;RM=r;let c=new Map([...o.querySelectorAll("button[data-id]")].map(u=>[u.dataset.id,u.parentElement]));a.forEach((u,d)=>{let h=c.get(u.id);if(c.delete(u.id),!h){h=document.createElement("li");let g=document.createElement("button");g.type="button",g.dataset.id=u.id,g.addEventListener("click",()=>t(g.dataset.id)),h.append(g)}let f=h.firstChild;f.textContent!==u.text&&(f.textContent=u.text),o.children[d]!==h&&o.insertBefore(h,o.children[d]??null)});for(let u of c.values())u.remove();let l=document.getElementById("scene-list-empty");l&&(l.hidden=a.length>0)}function kM(e){let t=e.target.closest?.('[role="tab"]');if(!t)return;let n=[...t.parentElement.querySelectorAll('[role="tab"]')],i=n.indexOf(t),s={ArrowRight:i+1,ArrowLeft:i-1,Home:0,End:n.length-1}[e.key];if(s===void 0)return;e.preventDefault(),e.stopPropagation();let o=n[(s+n.length)%n.length];o.click(),requestAnimationFrame(()=>document.querySelector(`[role="tab"][data-tab="${o.dataset.tab}"]`)?.focus())}var Q3="(max-width: 600px)",tL=6,La=typeof matchMedia=="function"?matchMedia(Q3):{matches:!1,addEventListener(){}},Ia="inbox",IM=()=>{},LM=()=>La.matches;var DM=()=>!La.matches||Ia!=="projects"||globalThis.document?.documentElement.dataset.sheet!==void 0,x0=()=>La.matches&&Ia==="inbox";function eL(e,t=Date.now()){let n=new Date(t);n.setHours(0,0,0,0);let i=e.filter(s=>s.t>=n.getTime());return{pictures:i.filter(s=>s.type==="image"),delivered:i.filter(s=>s.type!=="image"&&s.type!=="file"),files:i.filter(s=>s.type==="file").length}}function nL(){let e=document.getElementById("stage"),t=document.getElementById("mini-slot"),n=document.querySelector(".stage-wrap");!e||!t||!n||(x0()?e.parentElement!==t&&t.prepend(e):e.parentElement!==n&&n.prepend(e))}function y0(){let e=document.documentElement;La.matches?e.dataset.phone=Ia:delete e.dataset.phone,nL();for(let t of document.querySelectorAll("[data-phone-tab]"))t.dataset.phoneTab===Ia?t.setAttribute("aria-current","page"):t.removeAttribute("aria-current");IM()}function vf(e){if(!["inbox","office","projects"].includes(e))return;let t=Ia;Ia=e,y0(),t!==e&&document.querySelector(e==="projects"?"#side":".hud.left")?.scrollTo?.(0,0)}function NM({changed:e=()=>{}}={}){IM=e;for(let t of document.querySelectorAll("[data-phone-tab]"))t.addEventListener("click",()=>vf(t.dataset.phoneTab));document.getElementById("mini-open")?.addEventListener("click",()=>vf("office")),La.addEventListener?.("change",y0),y0()}var PM="";function UM(){if(!La.matches)return;let{pictures:e,delivered:t,files:n}=eL(Zt),i=r=>B.get(Ct(r.session)),s=e.length||t.length||n?`${e.length?`<div class="gallery">${e.slice(0,3).map(r=>Bs(r,{withThread:!0})).join("")}</div>`:""}
      ${t.length?`<div class="outs">${t.slice(0,tL).map(r=>Bs(r,{withThread:!!i(r)})).join("")}</div>`:""}
      ${n?`<p class="today-files">${n} ${n===1?"file":"files"} changed today</p>`:""}`:'<p class="muted">Nothing made yet today. Pictures, pull requests and artifacts land here as they happen.</p>';if(s!==PM){PM=s;let r=document.getElementById("today-list");r&&(r.innerHTML=s)}let o=document.getElementById("inbox-count")?.textContent??"",a=document.getElementById("phone-inbox-count");a&&a.textContent!==o&&(a.textContent=o,a.closest("button")?.setAttribute("aria-label",o?`Inbox, ${o} waiting on you`:"Inbox"))}var sL=typeof document>"u"?"":document.querySelector('meta[name="agent-office-token"]')?.content||"";function oL({state:e,pending:t,failed:n}={}){return n?"Couldn\u2019t change it here. Type /office auto-update in Claude Code instead.":e==="missing"?"Only when Agent Office was added as a Claude Code plugin":e==="on"&&!t?"New versions arrive on their own.":e==="off"&&t?"Off from next time Claude Code starts. You can update from /plugin.":"New versions arrive on their own. Takes effect next time Claude Code starts."}var ko=null;function OM(){Aa({id:"auto-update",type:"toggle",label:"Updates: automatic",hint:()=>oL(ko),get:()=>ko?.state==="on",disabled:()=>ko?.state==="missing",set:e=>void rL(e)})}async function rL(e){let t=ko;ko={state:e?"on":"off",pending:!0};try{let n=await fetch("/auto-update",{method:"POST",headers:{"content-type":"application/json","x-agent-office-token":sL},body:JSON.stringify({on:e})}),i=await n.json();ko=i.autoUpdate?{...i.autoUpdate,failed:!n.ok}:{...t,failed:!0}}catch{ko={...t,failed:!0}}OM(),document.activeElement===document.body&&document.querySelector('#settings:not([hidden]) [data-setting="auto-update"]')?.focus()}async function FM(){try{let e=await(await fetch("/healthz")).json();if(!e.autoUpdate)return;ko=e.autoUpdate,OM()}catch{}}var lL=e=>String(e??"").replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),Pe=null,Sc=null;function wf(){if(!Pe||Pe.hidden)return;Pe.hidden=!0;let e=Sc?.anchor;Sc=null,e?.isConnected&&e.focus({preventScroll:!0})}function cL(e){let t=e.getBoundingClientRect(),n=Pe.offsetWidth,i=Pe.offsetHeight,s=t.bottom+8,o=s+i>innerHeight-8?t.top-i-8:s;Pe.style.left=`${Math.max(8,Math.min(innerWidth-n-8,t.left-12))}px`,Pe.style.top=`${Math.max(8,Math.min(innerHeight-i-8,o))}px`}function _0(){let{session:e,name:t}=Sc,n=Pi(e);Pe.innerHTML=`
    <p class="eyebrow" id="cc-title">${lL(t)}\u2019s color</p>
    <div class="pe-swatches" role="group" aria-labelledby="cc-title">${Xl.map(i=>`<button type="button" data-pick-critter="${i.id}" style="background:var(--${i.id})" aria-pressed="${i.id===n}" aria-label="${i.name}" title="${i.name}"></button>`).join("")}</div>
    <div class="pe-actions">
      <button type="button" data-reset ${_h(e)?"":"disabled"}>Reset</button>
      <button type="button" class="primary" data-done>Done</button>
    </div>`;for(let i of Pe.querySelectorAll("[data-pick-critter]"))i.addEventListener("click",()=>{hg(e,i.dataset.pickCritter),_0(),Pe.querySelector(`[data-pick-critter="${i.dataset.pickCritter}"]`).focus()});Pe.querySelector("[data-reset]").addEventListener("click",()=>{hg(e,null),_0(),Pe.querySelector('[aria-pressed="true"]')?.focus()}),Pe.querySelector("[data-done]").addEventListener("click",wf)}function uL(e,t,n){if(Pe||(Pe=document.createElement("div"),Pe.className="proj-edit critter-edit paper",Pe.setAttribute("role","dialog"),Pe.setAttribute("aria-labelledby","cc-title"),Pe.hidden=!0,document.body.append(Pe),Pe.addEventListener("keydown",i=>{i.key==="Escape"&&(i.stopPropagation(),wf())}),addEventListener("pointerdown",i=>{Pe.hidden||Pe.contains(i.target)||i.target.closest?.("[data-critter-color]")||wf()})),!Pe.hidden&&Sc?.session===e)return wf();Sc={session:e,name:t,anchor:n},_0(),Pe.hidden=!1,cL(n),Pe.querySelector('[aria-pressed="true"]')?.focus()}document.addEventListener("click",e=>{let t=e.target.closest?.("[data-critter-color]");t&&uL(t.dataset.critterColor,t.dataset.name||"This critter",t)});var dL=6e4,hL=700,Ua=new URLSearchParams(location.search),zM=Ua.get("busy")==="1",Di=!!window.AGENT_OFFICE_DEMO||Ua.get("demo")==="1"||zM,Mf=Ua.get("empty")==="1",VM=Di,Ec=!0,br=[],Li=null;Eg(document.getElementById("stage"),{pick:Zs});function Zs(e){let t=e&&B.get(e);Li=t&&(t.kind==="session"||t.kind==="agent")?e:null,Ng(Li),Li&&Dh(Li),Li&&LM()&&vf("projects"),ns()}var b0=document.getElementById("stage");function GM(){let e=b0.clientWidth,t=b0.clientHeight,n={left:0,right:0,top:0,bottom:0};if(x0())return Lh(n);for(let i of document.querySelectorAll(".hud.left > *, #side, .topbar, .phone-tabs")){let s=i.getBoundingClientRect();!s.width||!s.height||getComputedStyle(i).display==="none"||(s.height>t*.5&&s.width<e*.5?s.left+s.width/2<e/2?n.left=Math.max(n.left,s.right+12):n.right=Math.max(n.right,e-s.left+12):s.width>e*.5?s.top+s.height/2<t/2?n.top=Math.max(n.top,s.bottom+8):n.bottom=Math.max(n.bottom,t-s.top+8):s.left+s.width/2<e/2?n.left=Math.max(n.left,s.right+12):n.right=Math.max(n.right,e-s.left+12))}Lh(n)}var fL=new ResizeObserver(GM);for(let e of document.querySelectorAll(".hud.left > *, #side, .topbar, #stage"))fL.observe(e);var pL=e=>e&&(e.tagName==="TEXTAREA"||e.tagName==="INPUT"||e.isContentEditable);addEventListener("keydown",e=>{if(e.metaKey||e.ctrlKey||e.altKey||document.querySelector("dialog[open]"))return;if(pL(document.activeElement)){e.key==="Escape"&&document.activeElement.blur();return}if(e.key==="Escape"){let n=Li&&B.get(Li),i=n?.kind==="agent"?$a(n).at(-2):null;Zs(i?.id??null),i||Dh(null);return}let t={j:1,ArrowDown:1,k:-1,ArrowUp:-1}[e.key];if(t){let n=Mw();if(!n.length)return;let i=n.indexOf(Li);Zs(n[i<0?t>0?0:n.length-1:(i+t+n.length)%n.length]),e.preventDefault();return}["1","2","3","4"].includes(e.key)?Xh(["transcript","outputs","team","details"][Number(e.key)-1]):e.key==="r"&&Aw()&&e.preventDefault()});var v0=document.getElementById("sound");function WM(){v0.setAttribute("aria-pressed",String(!ch())),v0.querySelector("span").textContent=ch()?"Sound off":"Sound on"}v0.addEventListener("click",()=>{Mb(!ch()),WM()});WM();Eb();for(let e of["pointerdown","keydown"])addEventListener(e,Sb,{once:!0});Ww(()=>{qv(),ns()});nM();document.addEventListener("office:names",()=>ns());document.addEventListener("office:looks",()=>ns());var BM=document.getElementById("snapshot");BM?.addEventListener("click",async()=>{let e=getComputedStyle(document.documentElement),t=Object.fromEntries(["paper","scene","ink","muted","accent","line"].map(r=>[r,e.getPropertyValue(`--${r}`).trim()])),n=[...B.values()].filter(r=>r.kind==="session"&&!r.past&&r.status!=="done").length,i=[...B.values()].filter(r=>r.kind==="agent"&&r.status!=="done").length,s=[n&&`${n} thread${n===1?"":"s"}`,i&&`${i} agent${i===1?"":"s"} at work`].filter(Boolean).join(" \xB7 "),o=await Gb(Vb({...Fg(),colors:t,detail:s})),a=BM.querySelector("span");a.textContent=o?"Saved":"Couldn\u2019t save",setTimeout(()=>{a.textContent="Snapshot"},2200)});addEventListener("keydown",kM,!0);Aa({id:"office-theme",type:"choice",label:"Office theme",hint:()=>vo[ug()].hint,options:Qb.map(e=>({value:e,label:vo[e].name,swatch:vo[e].look.swatch})),get:ug,set:iv});Aa({id:"reduce-motion",type:"toggle",label:"Reduce motion",hint:()=>Wm()?"On because your system asks for less motion":"No camera glides, hops, confetti or bobbing",get:Ci,set:sb,disabled:Wm});Jw();var HM=document.getElementById("show-past");HM.addEventListener("change",()=>{Ec=HM.checked,Ha(br,Ec)});function mL(){let e=new Set;for(let t of B.values())t.kind==="tool"&&t.status==="active"&&e.add(t.owner);return e}var w0=document.querySelector('meta[name="agent-office-token"]')?.content||"";j_({can:e=>Di||zg()||!!w0&&e.answerable===!0&&["question","plan"].includes(e.type),canApprove:()=>Di||zg(),send:async(e,t)=>{let n=e.who?.session;if(Di){let o=Pf(n,e.id,t.say??Om(e,t));return setTimeout(ns,50),o?{ok:o}:{ok:o,status:"that question has moved on"}}let i=await fetch("/answer",{method:"POST",headers:{"content-type":"application/json","x-agent-office-token":w0},body:JSON.stringify({session:n,id:e.id,...t})}),s=await i.json().catch(()=>({}));return i.ok?{ok:!0}:{ok:!1,status:s.error??`the bridge answered ${i.status}`}}});K_();ow(async e=>{if(Di)return D0(e.session),{ok:!0};let t=await fetch("/stop",{method:"POST",headers:{"content-type":"application/json","x-agent-office-token":w0},body:JSON.stringify({session:e.session})}),n=await t.json().catch(()=>({}));return t.ok?{ok:!0}:{ok:!1,status:n.error??`the bridge answered ${t.status}`}});rw();rM({stage:b0,critterAt:Og,setHover:Nh});var gL={can:ih};function ns(){Li&&!B.has(Li)&&(Li=null);let e=mL();pw(br),UM(),ei({running:e,selected:Li,pick:Zs,hover:Nh,answer:gL}),CM({running:e,pick:Zs}),Gw(e),pb(e),cM(VM&&![...B.values()].some(t=>t.kind==="session"),{hasPast:br.length>0})}var Da=Ua.has("debug")?[]:null,Na=0,$M=-1/0;function M0(e){if(Na=requestAnimationFrame(M0),!Kb(e,$M,bo().fps)||!DM())return;$M=e;let t=Da&&performance.now();Hf(Date.now()),Pg(Ec),Lg(),Da&&(Da.push(performance.now()-t),Da.length>600&&Da.shift())}document.addEventListener("visibilitychange",()=>{document.hidden?(cancelAnimationFrame(Na),Na=0):Na||(Na=requestAnimationFrame(M0),ns())});setInterval(()=>{document.hidden||ns()},hL);Aa({id:"low-power",type:"toggle",label:"Save battery",hint:"Draws 30 frames a second, a little softer, with simpler shadows",get:qb,set:Yb});jb(Dg);Di||FM();function Ac(e){Dc(e),$c(e),Ig(e),Yv(e),Pm(e)}document.addEventListener("office:event",e=>Ac(e.detail));async function qM(){try{br=Mf?[]:Di?O0():(await(await fetch("/history")).json()).sessions??[]}catch{br=[]}Ha(br,Ec)}function Tc(e,t){let n=document.getElementById("conn");n.querySelector("span").textContent=e,n.className=`status ${t}`}function XM(){let e=new EventSource("/stream");e.addEventListener("open",()=>{Tc("Live","live"),hM()}),e.addEventListener("replay",t=>{if(VM=!0,Mf)return ns();Ff(),jf(),F_();for(let n of JSON.parse(t.data))Dc(n),$c(n),Pm(n,!0);Ha(br,Ec),ns()}),e.addEventListener("message",t=>Mf||Ac(JSON.parse(t.data))),e.addEventListener("error",()=>{Tc("Reconnecting\u2026","down"),gf(()=>{e.close(),XM()})})}function yL(){Tc("Sample activity","live"),N0(e=>e.forEach(Ac),{busy:zM})}var jM=!1;H_({ingest:Ac,pick:Zs,isDemo:()=>Di,bridgeDemo:()=>jM});$g(Di);Vw({onPick:Zs,demo:Di});Di||fetch("/healthz").then(e=>e.json()).then(e=>{e.demo&&($g(!0),s0(),jM=!0)}).catch(()=>{});yb({pick:Zs});mw();AM({pick:Zs,ingest:Ac,table:Oh});NM({changed:()=>{GM(),ns()}});await qM();setInterval(qM,dL);Ua.get("offline")==="1"?(Tc("Reconnecting\u2026","down"),gf()):Di?Mf?Tc("Preview","live"):yL():XM();ns();document.hidden||(Na=requestAnimationFrame(M0));Ua.has("debug")&&(window.cluster={model:Nc,words:Vc,table:Oh,frameCost:Da});
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
