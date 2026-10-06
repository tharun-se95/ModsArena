var Mp=Object.defineProperty;var Nl=(n,t)=>{for(var e in t)Mp(n,e,{get:t[e],enumerable:!0})};var $i=[{id:"/work/payments-api",name:"acme/payments-api",remote:"git@github.com:acme/payments-api.git"},{id:"/work/web-dashboard",name:"acme/web-dashboard",remote:"git@github.com:acme/web-dashboard.git"}],Sp=["Harden the session handling","Add retries to the webhook worker","Why is the build flaky?","Write tests for the refund flow","Migrate charts to the new tokens","Review the open PR"],bp=[["Read","src/auth/session.ts"],["Grep","timingSafeEqual"],["Glob","**/*.test.ts"],["Bash","npm test -- --watch=false"],["Edit","src/auth/session.ts"],["Write","docs/ARCHITECTURE.md"],["WebFetch","https://nodejs.org/api/crypto.html"],["Bash","git diff --stat"],["mcp__github__list_pull_requests","open PRs"]],Ep=[["Explore","Map the auth module"],["Plan","Design token rotation"],["general-purpose","Write regression tests"],["code-reviewer","Review session.ts"]],Xi=2e5,ru=[["System prompt",3100],["System tools",17800],["MCP tools",9400],["Custom agents",1200],["Memory files",2600],["Skills",1900]],Fl=n=>n[Math.floor(Math.random()*n.length)],ou=n=>new Promise(t=>setTimeout(t,n)),cn=(n,t)=>n+Math.floor(Math.random()*(t-n));function au(n){let t=0;function e(i,s,r){let o=m=>n([{t:Date.now(),session:i,...m}]),a=cn(8e3,4e4),c=0,l=ru.reduce((m,[,d])=>m+d,0),h=()=>l+a;function u(){let m=h();c+=m/1e6*3*.15+.01,o({kind:"context.measure",context:{tokens:m,window:Xi,percent:Math.round(m/Xi*100)},costUsd:Number(c.toFixed(4)),rateLimits:[{kind:"five_hour",percentUsed:Math.min(99,Math.round(c*4))}]}),o({kind:"agent.context",tokens:m})}function f(){o({kind:"context.breakdown",window:Xi,used:h(),categories:[...ru.map(([d,S])=>({name:d,tokens:S,kind:"used"})),{name:"Messages",tokens:a,kind:"used"},{name:"Autocompact buffer",tokens:33e3,kind:"buffer"},{name:"Free space",tokens:Math.max(0,Xi-h()-33e3),kind:"free"}]})}async function p(m){let[d,S]=Fl(bp),w=`demo-tool-${++t}`;o({kind:"tool.start",agent:m,id:w,tool:d,summary:S}),await ou(cn(400,3e3)*r),o({kind:"tool.end",agent:m,id:w,tool:d,ok:Math.random()>.12})}async function g(m,d){let[S,w]=Fl(Ep),v=`demo-agent-${++t}`;o({kind:"agent.spawn",agent:v,parent:m,type:S,description:w,model:"claude-haiku-4-5",background:Math.random()>.5});let T=cn(9e3,2e4),E=cn(3,9);for(let A=0;A<E;A++)d<1&&Math.random()<.15&&g(v,d+1),await p(v),T+=cn(4e3,26e3),o({kind:"agent.context",agent:v,tokens:T,window:Xi,model:"claude-haiku-4-5"});o({kind:"turn.complete",agent:v,reason:"answer"}),o({kind:"agent.end",agent:v})}async function _(){for(o({kind:"session.start",cwd:s.id,model:"claude-sonnet-5-5",project:s}),u(),f();;){let m=`demo-turn-${++t}`;o({kind:"turn.start",turnId:m,text:Fl(Sp)});let d=[];for(let S=0;S<cn(0,3);S++)d.push(g(void 0,0));for(let S=0;S<cn(1,4);S++)await p(void 0),a+=cn(3e3,12e3),u();if(await Promise.all(d),a+=cn(4e3,14e3),h()>Xi-33e3){let S=h();a=cn(9e3,16e3),o({kind:"context.compact",trigger:"auto",before:S,after:h()})}u(),o({kind:"turn.complete",turnId:m,reason:"answer",durationMs:9e3}),f(),await ou(cn(1500,5e3)*r)}}_()}e("demo-payments-1",$i[0],1),setTimeout(()=>e("demo-payments-2",$i[0],1.6),2500),setTimeout(()=>e("demo-dashboard-1",$i[1],1.3),5e3)}function lu(){let n=Date.now(),t=36e5;return[[$i[0],"demo-past-1",3,"Fix the double-charge race",142e3,1,4.12],[$i[0],"demo-past-2",26,"Add idempotency keys",61e3,0,1.37],[$i[1],"demo-past-3",5,"Dark mode for the charts",188e3,2,6.5],[$i[1],"demo-past-4",50,"Upgrade to React 19",97e3,0,2.05]].map(([e,i,s,r,o,a,c])=>({session:i,project:e,cwd:e.id,gitBranch:"main",model:"claude-sonnet-5-5",startedAt:n-s*t-2*t,endedAt:n-s*t,prompts:[{t:n-s*t-2*t,text:r},{t:n-s*t-t,text:"Now add tests for it"}],turns:2+a*6,toolCalls:cn(30,160),errors:cn(0,6),tools:{Read:40,Edit:12,Bash:20},agents:[{type:"Explore",description:"Map the code",context:41e3,tools:18}],compactions:Array.from({length:a},()=>({trigger:"auto",before:167e3})),context:o,window:Xi,costUsd:c}))}var Gl={};Nl(Gl,{DEFAULT_WINDOW:()=>Bl,TOOL_LINGER_MS:()=>pu,WARN_AT:()=>si,aid:()=>He,apply:()=>Mo,applyHistory:()=>xr,clean:()=>Fp,fill:()=>Le,idOf:()=>Xn,isDirty:()=>Np,links:()=>yn,nodes:()=>at,notices:()=>_r,projects:()=>Wp,promptLabel:()=>vo,removeNode:()=>Yi,reset:()=>kl,sessionsOf:()=>Xp,shortId:()=>zl,sid:()=>se,stats:()=>xo,sweep:()=>Hl,touch:()=>Op,visible:()=>Gp,warnings:()=>Vl});var wp=/^The (\S+) plugin sent a message:\s*/,Tp=/^The coordinator sent a message while you were working:\s*/,Ap=["This is how Claude Code surfaces a prompt a plugin submits between turns","Address this before completing your current task."],Rp=n=>n.replace(/\s+/g," ").trim();function Cp(n){for(let t of n.matchAll(/\s+(?=This is how\b|Address this\b)/g)){let e=Rp(n.slice(t.index)).replace(/(\.\.\.|…)$/,"").trim();if(Ap.some(i=>i.startsWith(e)||e.startsWith(i)))return n.slice(0,t.index)}return n}function cu(n,t){if(typeof n!="string")return{text:n};let e=wp.exec(n)??Tp.exec(n);return e?{text:Cp(n.slice(e[0].length)).trim(),from:e[1]??t??"a plugin"}:{text:n}}var hu=n=>typeof n=="string"&&n.trimStart().startsWith("<");var pu=6e3,Ip=12,Pp=25,Dp=3e4,Lp=6e4,uu=n=>n.replace(/\s+/g," ").replace(/(\.\.\.|…)$/,"").trim(),Up=(n,t)=>{let[e,i]=[uu(n),uu(t)];return e.startsWith(i)||i.startsWith(e)},Bl=2e5,si=.8,at=new Map,yn=[],xo={calls:0,errors:0},_r=[],$n=!0,Np=()=>$n,Fp=()=>{$n=!1},Op=()=>{$n=!0},mu=n=>`p:${n}`,se=n=>`s:${n}`,He=(n,t)=>`a:${n}:${t}`,du=(n,t)=>`t:${n}:${t}`,Xn=n=>typeof n=="object"?n.id:n;function Ts(n){return at.set(n.id,n),$n=!0,n}function yo(n,t,e){yn.push({source:n,target:t,kind:e}),$n=!0}function Bp(n,t){yn=yn.filter(e=>!(Xn(e.target)===n&&e.kind===t)),$n=!0}function Yi(n){at.delete(n)&&(yn=yn.filter(t=>Xn(t.source)!==n&&Xn(t.target)!==n),$n=!0)}function kl(){for(let[n,t]of at)t.kind!=="project"&&!t.past&&at.delete(n);yn=yn.filter(n=>at.has(Xn(n.source))&&at.has(Xn(n.target))),Object.assign(xo,{calls:0,errors:0}),_r.length=0,$n=!0}function Le(n){let t=n.context;return t?.tokens?Math.min(1,t.tokens/(t.window||gu(n)||Bl)):0}function gu(n){return at.get(se(n.session))?.context?.window}var vo=n=>n.length>26?`${n.slice(0,25)}\u2026`:n,zl=n=>n.length>14?`${n.slice(0,8)}\u2026`:n;function kp(n){let t=mu(n.id),e=at.get(t)??Ts({id:t,kind:"project",projectId:n.id,label:n.name});return e.label=n.name,e.remote=n.remote,e}function Ol(n,t){!t||n.project===t.id||(kp(t),Bp(n.id,"project"),n.project=t.id,n.projectName=t.name,yo(mu(t.id),n.id,"project"))}function qi(n){let t=se(n.session),e=at.get(t);return e?(e.past&&(e.past=!1,e.status="active",$n=!0),e):Ts({id:t,kind:"session",label:zl(n.session),session:n.session,status:"active",startedAt:n.t,lastAt:n.t,history:0,prompts:[],compactions:[],turns:0,toolCalls:0,errors:0})}function _u(n,t){let e=He(n.session,t);if(at.has(e))return at.get(e);qi(n);let i=Ts({id:e,kind:"agent",label:"subagent",type:"subagent",session:n.session,agent:t,status:"active",startedAt:n.t,history:0,compactions:[]});return yo(se(n.session),e,"spawn"),i}var gr=n=>n.agent?_u(n,n.agent):qi(n);function zp(n,t,e,i){_r.unshift({t:n.t,text:t,level:e,target:i}),_r.length>30&&_r.pop()}var fu=n=>`${Math.round(n/1e3)}k`,Hp={"session.start"(n){let t=qi(n);Object.assign(t,{status:"active",cwd:n.cwd,model:n.model,startedAt:t.startedAt??n.t}),Ol(t,n.project)},"session.end"(n){let t=qi(n);t.status="done",t.endedAt=n.t,t.endReason=n.reason},"turn.start"(n){let t=gr(n);if(t.pulseAt=n.t,t.kind==="session"&&n.text){if(t.turns++,hu(n.text))return;let{text:e,from:i}=cu(n.text);if(t.prompts.some(s=>!s.live&&Math.abs(s.t-n.t)<Lp&&Up(s.text,e)))return;t.prompts.length||(t.label=vo(e)),t.prompts.push({t:n.t,text:e,from:i,live:!0}),t.prompts.length>Pp&&t.prompts.shift()}},"turn.complete"(n){let t=gr(n);n.context?.window&&(t.context=n.context)},"context.measure"(n){let t=qi(n);t.context={...t.context,...n.context},n.costUsd!==void 0&&(t.costUsd=n.costUsd),n.rateLimits&&(t.rateLimits=n.rateLimits)},"context.breakdown"(n){let t=qi(n);t.breakdown={window:n.window,used:n.used,categories:n.categories},t.context={...t.context,window:n.window,tokens:t.context?.tokens??n.used}},"agent.context"(n){if(n.agent&&!at.has(He(n.session,n.agent)))return;let t=gr(n),e=n.window??t.context?.window??gu(t)??Bl;t.context={...t.context,tokens:n.tokens,window:e},n.model&&(t.model=n.model)},"context.compact"(n){let t=gr(n),e={t:n.t,trigger:n.trigger,before:n.before,after:n.after};t.compactions.push(e),t.compactAt=n.t,n.after!==void 0&&(t.context={...t.context,tokens:n.after});let i=n.before?` ${fu(n.before)} \u2192 ${n.after!==void 0?fu(n.after):"?"}`:"";zp(n,`${t.label} compacted (${n.trigger})${i}`,"compact",t.id)},"agent.spawn"(n){qi(n);let t=He(n.session,n.agent),e=n.parent?_u(n,n.parent).id:se(n.session),i=at.get(t);i||(i=Ts({id:t,kind:"agent",session:n.session,agent:n.agent,history:0,compactions:[]}),yo(e,t,"spawn")),Object.assign(i,{label:n.name||n.type,type:n.type,description:n.description,model:n.model,background:n.background,teammate:n.teammate,parent:e,status:"active",startedAt:n.t,announced:!0}),at.get(e).pulseAt=n.t},"agent.idle"(n){let t=at.get(He(n.session,n.agent));t&&(t.status="idle")},"agent.end"(n){let t=at.get(He(n.session,n.agent));t&&(t.status="done",t.endedAt=n.t,Vp())},"tool.start"(n){let t=gr(n),e=du(n.session,n.id);if(at.has(e))return;Ts({id:e,kind:"tool",label:n.tool,tool:n.tool,summary:n.summary,session:n.session,owner:t.id,status:"active",startedAt:n.t}),yo(t.id,e,"tool"),t.lastAt=n.t,xo.calls++;let i=at.get(se(n.session));i.toolCalls++,i.lastAt=n.t},"tool.end"(n){let t=at.get(du(n.session,n.id));if(!t)return;t.status=n.ok?"ok":"error",t.endedAt=n.t,n.ok||(xo.errors++,at.get(se(n.session)).errors++);let e=at.get(t.owner);e&&(e.history++,e.kind==="agent"&&(e.lastAt=n.t))}};function Vp(){let n=[...at.values()].filter(t=>t.kind==="agent"&&t.status==="done").sort((t,e)=>t.endedAt-e.endedAt);for(let t of n.slice(0,Math.max(0,n.length-Ip)))Yi(t.id)}function Mo(n){Hp[n.kind]?.(n)}function Hl(n){for(let t of at.values())t.kind==="tool"&&t.endedAt&&n-t.endedAt>pu&&Yi(t.id);for(let t of at.values())t.kind!=="agent"||t.announced||t.status==="done"||n-(t.lastAt??t.startedAt??0)<Dp||yn.some(e=>Xn(e.source)===t.id&&e.kind==="tool")||Yi(t.id)}function xr(n,t){let e=new Set;for(let i of n){let s=se(i.session);e.add(s);let r=at.get(s);if(r&&!r.past){!r.prompts.length&&i.prompts.length&&(r.prompts=i.prompts,r.label=vo(i.prompts[0].text)),r.compactions.length||(r.compactions=i.compactions),r.costUsd??=i.costUsd,r.gitBranch??=i.gitBranch,r.project||Ol(r,i.project);continue}if(!t){r&&Yi(s);continue}let o=r??Ts({id:s,kind:"session",session:i.session,past:!0,history:0});Object.assign(o,{label:i.prompts[0]?.text?vo(i.prompts[0].text):zl(i.session),status:"past",past:!0,cwd:i.cwd,model:i.model,gitBranch:i.gitBranch,startedAt:i.startedAt,endedAt:i.endedAt,lastAt:i.endedAt,prompts:i.prompts,turns:i.turns,toolCalls:i.toolCalls,errors:i.errors,tools:i.tools,pastAgents:i.agents,compactions:i.compactions,costUsd:i.costUsd,context:i.context?{tokens:i.context,window:i.window}:void 0}),Ol(o,i.project)}for(let i of[...at.values()])i.past&&!e.has(i.id)&&Yi(i.id);for(let i of[...at.values()])i.kind==="project"&&!yn.some(s=>Xn(s.source)===i.id)&&Yi(i.id);$n=!0}function Gp(n){let t=[...at.values()];if(!n)return{nodes:t,links:[...yn]};let e=new Set;for(let i of t)(i.kind==="project"?i.projectId:at.get(se(i.session))?.project)===n&&e.add(i.id);return{nodes:t.filter(i=>e.has(i.id)),links:yn.filter(i=>e.has(Xn(i.source))&&e.has(Xn(i.target)))}}function Wp(){return[...at.values()].filter(n=>n.kind==="project").sort((n,t)=>n.label.localeCompare(t.label))}function Xp(n){return[...at.values()].filter(t=>t.kind==="session"&&t.project===n).sort((t,e)=>Number(t.past)-Number(e.past)||(e.lastAt??0)-(t.lastAt??0))}function Vl(){return[...at.values()].filter(n=>(n.kind==="session"||n.kind==="agent")&&!n.past&&n.status!=="done"&&Le(n)>=si).sort((n,t)=>Le(t)-Le(n))}var $l={};Nl($l,{activity:()=>Pn,ago:()=>un,beadColor:()=>Xl,escapeHtml:()=>pt,family:()=>So,ingest:()=>bo,lastAction:()=>Mi,moments:()=>vi,quote:()=>hn,reset:()=>Wl});var $p=12,qp=40,vi=[],Pn=new Map,Mi=null;function Wl(){vi.length=0,Pn.clear(),Mi=null}function pt(n){return String(n??"").replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t])}var hn=n=>`\u201C${n}\u201D`,Yp=n=>String(n).split(/[\\/]/).filter(Boolean).pop()??n,Zp=[{test:n=>["Read","NotebookRead"].includes(n),done:"read",try:"read",bead:"sky",file:"read"},{test:n=>["Edit","MultiEdit","Write","NotebookEdit"].includes(n),done:"edited",try:"edit",bead:"coral",file:"edit"},{test:n=>["Grep","Glob","LS"].includes(n),done:"searched for",try:"search for",bead:"leaf"},{test:n=>["WebFetch","WebSearch"].includes(n),done:"looked up",try:"look up",bead:"lilac"},{test:n=>["Bash","BashOutput","PowerShell"].includes(n),done:"ran",try:"run",bead:"mustard"},{test:n=>["Task","Agent"].includes(n),done:"handed off",try:"hand off",bead:"teal"},{test:n=>n==="TodoWrite",done:"updated its todo list",try:"update its todo list",bead:"line",bare:!0},{test:n=>n.startsWith("mcp__"),mcp:!0,bead:"lilac"}];function So(n){return Zp.find(t=>t.test(n??""))??{done:"used",try:"use",bead:"line",other:!0}}var Xl=n=>So(n).bead;function Jp(n,t,e){let i=So(n);if(i.mcp){let[,o,a]=n.split("__");return`${e?"used":"couldn\u2019t use"} ${o}\u2019s ${a??"tool"}`}if(i.bare)return e?i.done:`couldn\u2019t ${i.try}`;let s=i.file&&t?Yp(t):t??(i.other?n:""),r=i.other?`${n}${t?` on ${t}`:""}`:s;return`${e?i.done:`couldn\u2019t ${i.try}`} ${r}`.trim()}var Zi=n=>at.get(se(n))?.label??"A session",xu=n=>n.agent?at.get(He(n.session,n.agent))?.label??"A subagent":"The session";function yi(n,t,e="",i=se(n.session)){vi.unshift({t:n.t,text:t,tone:e,target:i}),vi.length>qp&&vi.pop()}function Kp(n){let t=se(n.session),e=Pn.get(t);return e||Pn.set(t,e={actions:[],files:new Map}),e}var As=new Map;function bo(n){switch(n.kind){case"tool.start":{As.set(`${n.session}:${n.id}`,{tool:n.tool,summary:n.summary}),As.size>500&&As.delete(As.keys().next().value);break}case"tool.end":{let t=`${n.session}:${n.id}`,e=As.get(t)??{tool:n.tool};As.delete(t);let i=`${xu(n)} ${Jp(e.tool??n.tool,e.summary,n.ok)}`,s=Kp(n);s.actions.unshift({t:n.t,text:i,ok:n.ok}),s.actions.length>$p&&s.actions.pop();let r=So(e.tool??n.tool);if(r.file&&e.summary){let o=s.files.get(e.summary)??{reads:0,edits:0,t:0};r.file==="edit"?o.edits++:o.reads++,o.t=n.t,s.files.set(e.summary,o)}Mi={session:se(n.session),text:i},n.ok||yi(n,`${i} in ${hn(Zi(n.session))}.`,"bad");break}case"agent.spawn":yi(n,`${hn(Zi(n.session))} started ${/^[aeiou]/i.test(n.type??"")?"an":"a"} ${n.name||n.type} subagent${n.description?`: ${n.description}`:""}.`,"",He(n.session,n.agent));break;case"agent.end":{let t=at.get(He(n.session,n.agent));t&&yi(n,`${t.label} finished its work for ${hn(Zi(n.session))}.`);break}case"context.compact":yi(n,`${n.agent?xu(n):hn(Zi(n.session))} compacted its context and has room again.`,"note");break;case"session.start":yi(n,`A session started in ${n.project?.name??"a new folder"}.`);break;case"session.end":yi(n,`${hn(Zi(n.session))} ended.`);break;case"chat.sent":yi(n,`You messaged ${n.agent?at.get(He(n.session,n.agent))?.label??"a subagent":hn(Zi(n.session))}.`,"note",n.agent?He(n.session,n.agent):se(n.session));break;case"chat.delivered":n.ok===!1&&yi(n,`Your message to ${n.agent?at.get(He(n.session,n.agent))?.label??"a subagent":hn(Zi(n.session))} couldn't be delivered${n.how?`: ${n.how}`:""}.`,"bad",n.agent?He(n.session,n.agent):se(n.session));break}}function un(n,t=Date.now()){if(!n)return"";let e=Math.max(0,Math.round((t-n)/1e3));return e<5?"just now":e<60?`${e}s ago`:e<3600?`${Math.round(e/60)}m ago`:e<86400?`${Math.round(e/3600)}h ago`:`${Math.round(e/86400)}d ago`}var Wh={};Nl(Wh,{animate:()=>Vh,debug:()=>Uv,focusOn:()=>Rl,focusProject:()=>kh,level:()=>ei,mount:()=>Uh,pct:()=>ni,pulse:()=>Hh,roomKey:()=>Dh,sessionTint:()=>dr,setHover:()=>Bh,setInsets:()=>Oh,setSelected:()=>Gh,sync:()=>zh,tintOf:()=>bs});var wn={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},kn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Hu=0,Ec=1,Vu=2;var wc=1,ha=2,Jn=3,ui=0,Ke=1,sn=2,di=0,es=1,Tc=2,Ac=3,Rc=4,Gu=5,Ii=100,Wu=101,Xu=102,$u=103,qu=104,Yu=200,Zu=201,Ju=202,Ku=203,Go=204,Wo=205,ju=206,Qu=207,td=208,ed=209,nd=210,id=211,sd=212,rd=213,od=214,ua=0,da=1,fa=2,ns=3,pa=4,ma=5,ga=6,_a=7,Cc=0,ad=1,ld=2,fi=0,cd=1,hd=2,ud=3,dd=4,fd=5,pd=6,md=7;var Ic=300,ls=301,cs=302,xa=303,ya=304,Yr=306,is=1e3,Ci=1001,Xo=1002,Sn=1003,gd=1004;var Zr=1005;var Fn=1006,va=1007;var Ni=1008;var zn=1009,Pc=1010,Dc=1011,js=1012,Ma=1013,Fi=1014,Kn=1015,Qs=1016,Sa=1017,ba=1018,tr=1020,Lc=35902,Uc=35899,Nc=1021,Fc=1022,Tn=1023,Vs=1026,er=1027,Oc=1028,Ea=1029,Bc=1030,wa=1031;var Ta=1033,Jr=33776,Kr=33777,jr=33778,Qr=33779,Aa=35840,Ra=35841,Ca=35842,Ia=35843,Pa=36196,Da=37492,La=37496,Ua=37808,Na=37809,Fa=37810,Oa=37811,Ba=37812,ka=37813,za=37814,Ha=37815,Va=37816,Ga=37817,Wa=37818,Xa=37819,$a=37820,qa=37821,Ya=36492,Za=36494,Ja=36495,Ka=36283,ja=36284,Qa=36285,tl=36286;var wr=2300,$o=2301,Vo=2302,mc=2400,gc=2401,_c=2402;var _d=3200,xd=3201;var kc=0,yd=1,pi="",Ae="srgb",ss="srgb-linear",Tr="linear",ee="srgb";var ts=7680;var xc=519,vd=512,Md=513,Sd=514,zc=515,bd=516,Ed=517,wd=518,Td=519,yc=35044;var Hc="300 es",Nn=2e3,Ar=2001;var qn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){let i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){let i=this._listeners;if(i===void 0)return;let s=i[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let i=e[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Ve=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],yu=1234567,br=Math.PI/180,Gs=180/Math.PI;function nr(){let n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ve[n&255]+Ve[n>>8&255]+Ve[n>>16&255]+Ve[n>>24&255]+"-"+Ve[t&255]+Ve[t>>8&255]+"-"+Ve[t>>16&15|64]+Ve[t>>24&255]+"-"+Ve[e&63|128]+Ve[e>>8&255]+"-"+Ve[e>>16&255]+Ve[e>>24&255]+Ve[i&255]+Ve[i>>8&255]+Ve[i>>16&255]+Ve[i>>24&255]).toLowerCase()}function Gt(n,t,e){return Math.max(t,Math.min(e,n))}function Vc(n,t){return(n%t+t)%t}function jp(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function Qp(n,t,e){return n!==t?(e-n)/(t-n):0}function Er(n,t,e){return(1-e)*n+e*t}function tm(n,t,e,i){return Er(n,t,1-Math.exp(-e*i))}function em(n,t=1){return t-Math.abs(Vc(n,t*2)-t)}function nm(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function im(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function sm(n,t){return n+Math.floor(Math.random()*(t-n+1))}function rm(n,t){return n+Math.random()*(t-n)}function om(n){return n*(.5-Math.random())}function am(n){n!==void 0&&(yu=n);let t=yu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function lm(n){return n*br}function cm(n){return n*Gs}function hm(n){return(n&n-1)===0&&n!==0}function um(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function dm(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function fm(n,t,e,i,s){let r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+i)/2),h=o((t+i)/2),u=r((t-i)/2),f=o((t-i)/2),p=r((i-t)/2),g=o((i-t)/2);switch(s){case"XYX":n.set(a*h,c*u,c*f,a*l);break;case"YZY":n.set(c*f,a*h,c*u,a*l);break;case"ZXZ":n.set(c*u,c*f,a*h,a*l);break;case"XZX":n.set(a*h,c*g,c*p,a*l);break;case"YXY":n.set(c*p,a*h,c*g,a*l);break;case"ZYZ":n.set(c*g,c*p,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function zs(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ye(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var hs={DEG2RAD:br,RAD2DEG:Gs,generateUUID:nr,clamp:Gt,euclideanModulo:Vc,mapLinear:jp,inverseLerp:Qp,lerp:Er,damp:tm,pingpong:em,smoothstep:nm,smootherstep:im,randInt:sm,randFloat:rm,randFloatSpread:om,seededRandom:am,degToRad:lm,radToDeg:cm,isPowerOfTwo:hm,ceilPowerOfTwo:um,floorPowerOfTwo:dm,setQuaternionFromProperEuler:fm,normalize:Ye,denormalize:zs},Tt=class n{constructor(t=0,e=0){n.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Gt(this.x,t.x,e.x),this.y=Gt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Gt(this.x,t,e),this.y=Gt(this.y,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Gt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(Gt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*i-o*s+t.x,this.y=r*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},bn=class{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,o,a){let c=i[s+0],l=i[s+1],h=i[s+2],u=i[s+3],f=r[o+0],p=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==f||l!==p||h!==g){let m=1-a,d=c*f+l*p+h*g+u*_,S=d>=0?1:-1,w=1-d*d;if(w>Number.EPSILON){let T=Math.sqrt(w),E=Math.atan2(T,d*S);m=Math.sin(m*E)/T,a=Math.sin(a*E)/T}let v=a*S;if(c=c*m+f*v,l=l*m+p*v,h=h*m+g*v,u=u*m+_*v,m===1-a){let T=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=T,l*=T,h*=T,u*=T}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,o){let a=i[s],c=i[s+1],l=i[s+2],h=i[s+3],u=r[o],f=r[o+1],p=r[o+2],g=r[o+3];return t[e]=a*g+h*u+c*p-l*f,t[e+1]=c*g+h*f+l*u-a*p,t[e+2]=l*g+h*p+a*f-c*u,t[e+3]=h*g-a*u-c*f-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let i=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(i/2),h=a(s/2),u=a(r/2),f=c(i/2),p=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=f*h*u+l*p*g,this._y=l*p*u-f*h*g,this._z=l*h*g+f*p*u,this._w=l*h*u-f*p*g;break;case"YXZ":this._x=f*h*u+l*p*g,this._y=l*p*u-f*h*g,this._z=l*h*g-f*p*u,this._w=l*h*u+f*p*g;break;case"ZXY":this._x=f*h*u-l*p*g,this._y=l*p*u+f*h*g,this._z=l*h*g+f*p*u,this._w=l*h*u-f*p*g;break;case"ZYX":this._x=f*h*u-l*p*g,this._y=l*p*u+f*h*g,this._z=l*h*g-f*p*u,this._w=l*h*u+f*p*g;break;case"YZX":this._x=f*h*u+l*p*g,this._y=l*p*u+f*h*g,this._z=l*h*g-f*p*u,this._w=l*h*u-f*p*g;break;case"XZY":this._x=f*h*u-l*p*g,this._y=l*p*u-f*h*g,this._z=l*h*g+f*p*u,this._w=l*h*u+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,i=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=i+a+u;if(f>0){let p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-c)*p,this._y=(r-l)*p,this._z=(o-s)*p}else if(i>a&&i>u){let p=2*Math.sqrt(1+i-a-u);this._w=(h-c)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+l)/p}else if(a>u){let p=2*Math.sqrt(1+a-i-u);this._w=(r-l)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(c+h)/p}else{let p=2*Math.sqrt(1+u-i-a);this._w=(o-s)/p,this._x=(r+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Gt(this.dot(t),-1,1)))}rotateTowards(t,e){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let i=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-i*l,this._z=r*h+o*l+i*c-s*a,this._w=o*h-i*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let i=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+i*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=i,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let p=1-e;return this._w=p*o+e*this._w,this._x=p*i+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=o*u+this._w*f,this._x=i*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},D=class n{constructor(t=0,e=0,i=0){n.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(vu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(vu.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,i=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*i),h=2*(a*e-r*s),u=2*(r*i-o*e);return this.x=e+c*l+o*u-a*h,this.y=i+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Gt(this.x,t.x,e.x),this.y=Gt(this.y,t.y,e.y),this.z=Gt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Gt(this.x,t,e),this.y=Gt(this.y,t,e),this.z=Gt(this.z,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Gt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let i=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-i*c,this.z=i*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return ql.copy(this).projectOnVector(t),this.sub(ql)}reflect(t){return this.sub(ql.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(Gt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){let s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ql=new D,vu=new bn,Ot=class n{constructor(t,e,i,s,r,o,a,c,l){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,c,l)}set(t,e,i,s,r,o,a,c,l){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=i,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],h=i[4],u=i[7],f=i[2],p=i[5],g=i[8],_=s[0],m=s[3],d=s[6],S=s[1],w=s[4],v=s[7],T=s[2],E=s[5],A=s[8];return r[0]=o*_+a*S+c*T,r[3]=o*m+a*w+c*E,r[6]=o*d+a*v+c*A,r[1]=l*_+h*S+u*T,r[4]=l*m+h*w+u*E,r[7]=l*d+h*v+u*A,r[2]=f*_+p*S+g*T,r[5]=f*m+p*w+g*E,r[8]=f*d+p*v+g*A,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-i*r*h+i*a*c+s*r*l-s*o*c}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,f=a*c-h*r,p=l*r-o*c,g=e*u+i*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return t[0]=u*_,t[1]=(s*l-h*i)*_,t[2]=(a*i-s*o)*_,t[3]=f*_,t[4]=(h*e-s*c)*_,t[5]=(s*r-a*e)*_,t[6]=p*_,t[7]=(i*c-l*e)*_,t[8]=(o*e-i*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Yl.makeScale(t,e)),this}rotate(t){return this.premultiply(Yl.makeRotation(-t)),this}translate(t,e){return this.premultiply(Yl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Yl=new Ot;function Gc(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Rr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Ad(){let n=Rr("canvas");return n.style.display="block",n}var Mu={};function Ws(n){n in Mu||(Mu[n]=!0,console.warn(n))}function Rd(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}var Su=new Ot().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),bu=new Ot().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function pm(){let n={enabled:!0,workingColorSpace:ss,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ee&&(s.r=hi(s.r),s.g=hi(s.g),s.b=hi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ee&&(s.r=Hs(s.r),s.g=Hs(s.g),s.b=Hs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===pi?Tr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ws("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ws("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[ss]:{primaries:t,whitePoint:i,transfer:Tr,toXYZ:Su,fromXYZ:bu,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ae},outputColorSpaceConfig:{drawingBufferColorSpace:Ae}},[Ae]:{primaries:t,whitePoint:i,transfer:ee,toXYZ:Su,fromXYZ:bu,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ae}}}),n}var Yt=pm();function hi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Hs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var Rs,qo=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Rs===void 0&&(Rs=Rr("canvas")),Rs.width=t.width,Rs.height=t.height;let s=Rs.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=Rs}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Rr("canvas");e.width=t.width,e.height=t.height;let i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=hi(r[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(hi(e[i]/255)*255):e[i]=hi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},mm=0,Xs=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:mm++}),this.uuid=nr(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Zl(s[o].image)):r.push(Zl(s[o]))}else r=Zl(s);i.url=r}return e||(t.images[this.uuid]=i),i}};function Zl(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?qo.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var gm=0,Jl=new D,tn=class n extends qn{constructor(t=n.DEFAULT_IMAGE,e=n.DEFAULT_MAPPING,i=Ci,s=Ci,r=Fn,o=Ni,a=Tn,c=zn,l=n.DEFAULT_ANISOTROPY,h=pi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:gm++}),this.uuid=nr(),this.name="",this.source=new Xs(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Tt(0,0),this.repeat=new Tt(1,1),this.center=new Tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ot,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Jl).x}get height(){return this.source.getSize(Jl).y}get depth(){return this.source.getSize(Jl).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let i=t[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ic)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case is:t.x=t.x-Math.floor(t.x);break;case Ci:t.x=t.x<0?0:1;break;case Xo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case is:t.y=t.y-Math.floor(t.y);break;case Ci:t.y=t.y<0?0:1;break;case Xo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};tn.DEFAULT_IMAGE=null;tn.DEFAULT_MAPPING=Ic;tn.DEFAULT_ANISOTROPY=1;var Me=class n{constructor(t=0,e=0,i=0,s=1){n.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r,c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],p=c[5],g=c[9],_=c[2],m=c[6],d=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let w=(l+1)/2,v=(p+1)/2,T=(d+1)/2,E=(h+f)/4,A=(u+_)/4,P=(g+m)/4;return w>v&&w>T?w<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(w),s=E/i,r=A/i):v>T?v<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),i=E/s,r=P/s):T<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),i=A/r,s=P/r),this.set(i,s,r,e),this}let S=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(f-h)*(f-h));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(u-_)/S,this.z=(f-h)/S,this.w=Math.acos((l+p+d-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Gt(this.x,t.x,e.x),this.y=Gt(this.y,t.y,e.y),this.z=Gt(this.z,t.z,e.z),this.w=Gt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Gt(this.x,t,e),this.y=Gt(this.y,t,e),this.z=Gt(this.z,t,e),this.w=Gt(this.w,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Gt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Yo=class extends qn{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Fn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new Me(0,0,t,e),this.scissorTest=!1,this.viewport=new Me(0,0,t,e);let s={width:t,height:e,depth:i.depth},r=new tn(s);this.textures=[];let o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){let e={minFilter:Fn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new Xs(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Yn=class extends Yo{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}},Cr=class extends tn{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Sn,this.minFilter=Sn,this.wrapR=Ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Zo=class extends tn{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Sn,this.minFilter=Sn,this.wrapR=Ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Pi=class{constructor(t=new D(1/0,1/0,1/0),e=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Dn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Dn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let i=Dn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Dn):Dn.fromBufferAttribute(r,o),Dn.applyMatrix4(t.matrixWorld),this.expandByPoint(Dn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Eo.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Eo.copy(i.boundingBox)),Eo.applyMatrix4(t.matrixWorld),this.union(Eo)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Dn),Dn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(yr),wo.subVectors(this.max,yr),Cs.subVectors(t.a,yr),Is.subVectors(t.b,yr),Ps.subVectors(t.c,yr),Si.subVectors(Is,Cs),bi.subVectors(Ps,Is),Ji.subVectors(Cs,Ps);let e=[0,-Si.z,Si.y,0,-bi.z,bi.y,0,-Ji.z,Ji.y,Si.z,0,-Si.x,bi.z,0,-bi.x,Ji.z,0,-Ji.x,-Si.y,Si.x,0,-bi.y,bi.x,0,-Ji.y,Ji.x,0];return!Kl(e,Cs,Is,Ps,wo)||(e=[1,0,0,0,1,0,0,0,1],!Kl(e,Cs,Is,Ps,wo))?!1:(To.crossVectors(Si,bi),e=[To.x,To.y,To.z],Kl(e,Cs,Is,Ps,wo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Dn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Dn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ri[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ri[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ri[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ri[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ri[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ri[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ri[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ri[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ri),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},ri=[new D,new D,new D,new D,new D,new D,new D,new D],Dn=new D,Eo=new Pi,Cs=new D,Is=new D,Ps=new D,Si=new D,bi=new D,Ji=new D,yr=new D,wo=new D,To=new D,Ki=new D;function Kl(n,t,e,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Ki.fromArray(n,r);let a=s.x*Math.abs(Ki.x)+s.y*Math.abs(Ki.y)+s.z*Math.abs(Ki.z),c=t.dot(Ki),l=e.dot(Ki),h=i.dot(Ki);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var _m=new Pi,vr=new D,jl=new D,$s=class{constructor(t=new D,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let i=this.center;e!==void 0?i.copy(e):_m.setFromPoints(t).getCenter(i);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;vr.subVectors(t,this.center);let e=vr.lengthSq();if(e>this.radius*this.radius){let i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(vr,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(jl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(vr.copy(t.center).add(jl)),this.expandByPoint(vr.copy(t.center).sub(jl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},oi=new D,Ql=new D,Ao=new D,Ei=new D,tc=new D,Ro=new D,ec=new D,rs=class{constructor(t=new D,e=new D(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,oi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=oi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(oi.copy(this.origin).addScaledVector(this.direction,e),oi.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Ql.copy(t).add(e).multiplyScalar(.5),Ao.copy(e).sub(t).normalize(),Ei.copy(this.origin).sub(Ql);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Ao),a=Ei.dot(this.direction),c=-Ei.dot(Ao),l=Ei.lengthSq(),h=Math.abs(1-o*o),u,f,p,g;if(h>0)if(u=o*c-a,f=o*a-c,g=r*h,u>=0)if(f>=-g)if(f<=g){let _=1/h;u*=_,f*=_,p=u*(u+o*f+2*a)+f*(o*u+f+2*c)+l}else f=r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+l):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+l);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Ql).addScaledVector(Ao,f),p}intersectSphere(t,e){oi.subVectors(t.center,this.origin);let i=oi.dot(this.direction),s=oi.dot(oi)-i*i,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){let i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(i=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(i=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),i>c||a>s)||((a>i||i!==i)&&(i=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,oi)!==null}intersectTriangle(t,e,i,s,r){tc.subVectors(e,t),Ro.subVectors(i,t),ec.crossVectors(tc,Ro);let o=this.direction.dot(ec),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ei.subVectors(this.origin,t);let c=a*this.direction.dot(Ro.crossVectors(Ei,Ro));if(c<0)return null;let l=a*this.direction.dot(tc.cross(Ei));if(l<0||c+l>o)return null;let h=-a*Ei.dot(ec);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},pe=class n{constructor(t,e,i,s,r,o,a,c,l,h,u,f,p,g,_,m){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,c,l,h,u,f,p,g,_,m)}set(t,e,i,s,r,o,a,c,l,h,u,f,p,g,_,m){let d=this.elements;return d[0]=t,d[4]=e,d[8]=i,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=c,d[2]=l,d[6]=h,d[10]=u,d[14]=f,d[3]=p,d[7]=g,d[11]=_,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){let e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,i=t.elements,s=1/Ds.setFromMatrixColumn(t,0).length(),r=1/Ds.setFromMatrixColumn(t,1).length(),o=1/Ds.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,i=t.x,s=t.y,r=t.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let f=o*h,p=o*u,g=a*h,_=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=p+g*l,e[5]=f-_*l,e[9]=-a*c,e[2]=_-f*l,e[6]=g+p*l,e[10]=o*c}else if(t.order==="YXZ"){let f=c*h,p=c*u,g=l*h,_=l*u;e[0]=f+_*a,e[4]=g*a-p,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=p*a-g,e[6]=_+f*a,e[10]=o*c}else if(t.order==="ZXY"){let f=c*h,p=c*u,g=l*h,_=l*u;e[0]=f-_*a,e[4]=-o*u,e[8]=g+p*a,e[1]=p+g*a,e[5]=o*h,e[9]=_-f*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){let f=o*h,p=o*u,g=a*h,_=a*u;e[0]=c*h,e[4]=g*l-p,e[8]=f*l+_,e[1]=c*u,e[5]=_*l+f,e[9]=p*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){let f=o*c,p=o*l,g=a*c,_=a*l;e[0]=c*h,e[4]=_-f*u,e[8]=g*u+p,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=p*u+g,e[10]=f-_*u}else if(t.order==="XZY"){let f=o*c,p=o*l,g=a*c,_=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+_,e[5]=o*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=a*h,e[10]=_*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(xm,t,ym)}lookAt(t,e,i){let s=this.elements;return dn.subVectors(t,e),dn.lengthSq()===0&&(dn.z=1),dn.normalize(),wi.crossVectors(i,dn),wi.lengthSq()===0&&(Math.abs(i.z)===1?dn.x+=1e-4:dn.z+=1e-4,dn.normalize(),wi.crossVectors(i,dn)),wi.normalize(),Co.crossVectors(dn,wi),s[0]=wi.x,s[4]=Co.x,s[8]=dn.x,s[1]=wi.y,s[5]=Co.y,s[9]=dn.y,s[2]=wi.z,s[6]=Co.z,s[10]=dn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],h=i[1],u=i[5],f=i[9],p=i[13],g=i[2],_=i[6],m=i[10],d=i[14],S=i[3],w=i[7],v=i[11],T=i[15],E=s[0],A=s[4],P=s[8],M=s[12],y=s[1],C=s[5],U=s[9],z=s[13],G=s[2],$=s[6],W=s[10],nt=s[14],H=s[3],ot=s[7],ut=s[11],wt=s[15];return r[0]=o*E+a*y+c*G+l*H,r[4]=o*A+a*C+c*$+l*ot,r[8]=o*P+a*U+c*W+l*ut,r[12]=o*M+a*z+c*nt+l*wt,r[1]=h*E+u*y+f*G+p*H,r[5]=h*A+u*C+f*$+p*ot,r[9]=h*P+u*U+f*W+p*ut,r[13]=h*M+u*z+f*nt+p*wt,r[2]=g*E+_*y+m*G+d*H,r[6]=g*A+_*C+m*$+d*ot,r[10]=g*P+_*U+m*W+d*ut,r[14]=g*M+_*z+m*nt+d*wt,r[3]=S*E+w*y+v*G+T*H,r[7]=S*A+w*C+v*$+T*ot,r[11]=S*P+w*U+v*W+T*ut,r[15]=S*M+w*z+v*nt+T*wt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],p=t[14],g=t[3],_=t[7],m=t[11],d=t[15];return g*(+r*c*u-s*l*u-r*a*f+i*l*f+s*a*p-i*c*p)+_*(+e*c*p-e*l*f+r*o*f-s*o*p+s*l*h-r*c*h)+m*(+e*l*u-e*a*p-r*o*u+i*o*p+r*a*h-i*l*h)+d*(-s*a*h-e*c*u+e*a*f+s*o*u-i*o*f+i*c*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],p=t[11],g=t[12],_=t[13],m=t[14],d=t[15],S=u*m*l-_*f*l+_*c*p-a*m*p-u*c*d+a*f*d,w=g*f*l-h*m*l-g*c*p+o*m*p+h*c*d-o*f*d,v=h*_*l-g*u*l+g*a*p-o*_*p-h*a*d+o*u*d,T=g*u*c-h*_*c-g*a*f+o*_*f+h*a*m-o*u*m,E=e*S+i*w+s*v+r*T;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/E;return t[0]=S*A,t[1]=(_*f*r-u*m*r-_*s*p+i*m*p+u*s*d-i*f*d)*A,t[2]=(a*m*r-_*c*r+_*s*l-i*m*l-a*s*d+i*c*d)*A,t[3]=(u*c*r-a*f*r-u*s*l+i*f*l+a*s*p-i*c*p)*A,t[4]=w*A,t[5]=(h*m*r-g*f*r+g*s*p-e*m*p-h*s*d+e*f*d)*A,t[6]=(g*c*r-o*m*r-g*s*l+e*m*l+o*s*d-e*c*d)*A,t[7]=(o*f*r-h*c*r+h*s*l-e*f*l-o*s*p+e*c*p)*A,t[8]=v*A,t[9]=(g*u*r-h*_*r-g*i*p+e*_*p+h*i*d-e*u*d)*A,t[10]=(o*_*r-g*a*r+g*i*l-e*_*l-o*i*d+e*a*d)*A,t[11]=(h*a*r-o*u*r-h*i*l+e*u*l+o*i*p-e*a*p)*A,t[12]=T*A,t[13]=(h*_*s-g*u*s+g*i*f-e*_*f-h*i*m+e*u*m)*A,t[14]=(g*a*s-o*_*s-g*i*c+e*_*c+o*i*m-e*a*m)*A,t[15]=(o*u*s-h*a*s+h*i*c-e*u*c-o*i*f+e*a*f)*A,this}scale(t){let e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let i=Math.cos(e),s=Math.sin(e),r=1-i,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+i,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+i,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,o){return this.set(1,i,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){let s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,f=r*l,p=r*h,g=r*u,_=o*h,m=o*u,d=a*u,S=c*l,w=c*h,v=c*u,T=i.x,E=i.y,A=i.z;return s[0]=(1-(_+d))*T,s[1]=(p+v)*T,s[2]=(g-w)*T,s[3]=0,s[4]=(p-v)*E,s[5]=(1-(f+d))*E,s[6]=(m+S)*E,s[7]=0,s[8]=(g+w)*A,s[9]=(m-S)*A,s[10]=(1-(f+_))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){let s=this.elements,r=Ds.set(s[0],s[1],s[2]).length(),o=Ds.set(s[4],s[5],s[6]).length(),a=Ds.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Ln.copy(this);let l=1/r,h=1/o,u=1/a;return Ln.elements[0]*=l,Ln.elements[1]*=l,Ln.elements[2]*=l,Ln.elements[4]*=h,Ln.elements[5]*=h,Ln.elements[6]*=h,Ln.elements[8]*=u,Ln.elements[9]*=u,Ln.elements[10]*=u,e.setFromRotationMatrix(Ln),i.x=r,i.y=o,i.z=a,this}makePerspective(t,e,i,s,r,o,a=Nn,c=!1){let l=this.elements,h=2*r/(e-t),u=2*r/(i-s),f=(e+t)/(e-t),p=(i+s)/(i-s),g,_;if(c)g=r/(o-r),_=o*r/(o-r);else if(a===Nn)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===Ar)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,r,o,a=Nn,c=!1){let l=this.elements,h=2/(e-t),u=2/(i-s),f=-(e+t)/(e-t),p=-(i+s)/(i-s),g,_;if(c)g=1/(o-r),_=o/(o-r);else if(a===Nn)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===Ar)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=u,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}},Ds=new D,Ln=new pe,xm=new D(0,0,0),ym=new D(1,1,1),wi=new D,Co=new D,dn=new D,Eu=new pe,wu=new bn,On=class n{constructor(t=0,e=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Gt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Gt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Gt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Gt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Gt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Gt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Eu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Eu,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return wu.setFromEuler(this),this.setFromQuaternion(wu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};On.DEFAULT_ORDER="XYZ";var qs=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},vm=0,Tu=new D,Ls=new bn,ai=new pe,Io=new D,Mr=new D,Mm=new D,Sm=new bn,Au=new D(1,0,0),Ru=new D(0,1,0),Cu=new D(0,0,1),Iu={type:"added"},bm={type:"removed"},Us={type:"childadded",child:null},nc={type:"childremoved",child:null},Ne=class n extends qn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:vm++}),this.uuid=nr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let t=new D,e=new On,i=new bn,s=new D(1,1,1);function r(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new pe},normalMatrix:{value:new Ot}}),this.matrix=new pe,this.matrixWorld=new pe,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ls.setFromAxisAngle(t,e),this.quaternion.multiply(Ls),this}rotateOnWorldAxis(t,e){return Ls.setFromAxisAngle(t,e),this.quaternion.premultiply(Ls),this}rotateX(t){return this.rotateOnAxis(Au,t)}rotateY(t){return this.rotateOnAxis(Ru,t)}rotateZ(t){return this.rotateOnAxis(Cu,t)}translateOnAxis(t,e){return Tu.copy(t).applyQuaternion(this.quaternion),this.position.add(Tu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Au,t)}translateY(t){return this.translateOnAxis(Ru,t)}translateZ(t){return this.translateOnAxis(Cu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ai.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Io.copy(t):Io.set(t,e,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Mr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ai.lookAt(Mr,Io,this.up):ai.lookAt(Io,Mr,this.up),this.quaternion.setFromRotationMatrix(ai),s&&(ai.extractRotation(s.matrixWorld),Ls.setFromRotationMatrix(ai),this.quaternion.premultiply(Ls.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Iu),Us.child=t,this.dispatchEvent(Us),Us.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(bm),nc.child=t,this.dispatchEvent(nc),nc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ai.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ai.multiply(t.parent.matrixWorld)),t.applyMatrix4(ai),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Iu),Us.child=t,this.dispatchEvent(Us),Us.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Mr,t,Mm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Mr,Sm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){let a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),f=o(t.skeletons),p=o(t.animations),g=o(t.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}};Ne.DEFAULT_UP=new D(0,1,0);Ne.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ne.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Un=new D,li=new D,ic=new D,ci=new D,Ns=new D,Fs=new D,Pu=new D,sc=new D,rc=new D,oc=new D,ac=new Me,lc=new Me,cc=new Me,Ri=class n{constructor(t=new D,e=new D,i=new D){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),Un.subVectors(t,e),s.cross(Un);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){Un.subVectors(s,e),li.subVectors(i,e),ic.subVectors(t,e);let o=Un.dot(Un),a=Un.dot(li),c=Un.dot(ic),l=li.dot(li),h=li.dot(ic),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;let f=1/u,p=(l*c-a*h)*f,g=(o*h-a*c)*f;return r.set(1-p-g,g,p)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,ci)===null?!1:ci.x>=0&&ci.y>=0&&ci.x+ci.y<=1}static getInterpolation(t,e,i,s,r,o,a,c){return this.getBarycoord(t,e,i,s,ci)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ci.x),c.addScaledVector(o,ci.y),c.addScaledVector(a,ci.z),c)}static getInterpolatedAttribute(t,e,i,s,r,o){return ac.setScalar(0),lc.setScalar(0),cc.setScalar(0),ac.fromBufferAttribute(t,e),lc.fromBufferAttribute(t,i),cc.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(ac,r.x),o.addScaledVector(lc,r.y),o.addScaledVector(cc,r.z),o}static isFrontFacing(t,e,i,s){return Un.subVectors(i,e),li.subVectors(t,e),Un.cross(li).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Un.subVectors(this.c,this.b),li.subVectors(this.a,this.b),Un.cross(li).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return n.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return n.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let i=this.a,s=this.b,r=this.c,o,a;Ns.subVectors(s,i),Fs.subVectors(r,i),sc.subVectors(t,i);let c=Ns.dot(sc),l=Fs.dot(sc);if(c<=0&&l<=0)return e.copy(i);rc.subVectors(t,s);let h=Ns.dot(rc),u=Fs.dot(rc);if(h>=0&&u<=h)return e.copy(s);let f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(i).addScaledVector(Ns,o);oc.subVectors(t,r);let p=Ns.dot(oc),g=Fs.dot(oc);if(g>=0&&p<=g)return e.copy(r);let _=p*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(i).addScaledVector(Fs,a);let m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return Pu.subVectors(r,s),a=(u-h)/(u-h+(p-g)),e.copy(s).addScaledVector(Pu,a);let d=1/(m+_+f);return o=_*d,a=f*d,e.copy(i).addScaledVector(Ns,o).addScaledVector(Fs,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Cd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ti={h:0,s:0,l:0},Po={h:0,s:0,l:0};function hc(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}var Vt=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ae){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Yt.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=Yt.workingColorSpace){return this.r=t,this.g=e,this.b=i,Yt.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=Yt.workingColorSpace){if(t=Vc(t,1),e=Gt(e,0,1),i=Gt(i,0,1),e===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+e):i+e-i*e,o=2*i-r;this.r=hc(o,r,t+1/3),this.g=hc(o,r,t),this.b=hc(o,r,t-1/3)}return Yt.colorSpaceToWorking(this,s),this}setStyle(t,e=Ae){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ae){let i=Cd[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=hi(t.r),this.g=hi(t.g),this.b=hi(t.b),this}copyLinearToSRGB(t){return this.r=Hs(t.r),this.g=Hs(t.g),this.b=Hs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ae){return Yt.workingToColorSpace(Ge.copy(this),t),Math.round(Gt(Ge.r*255,0,255))*65536+Math.round(Gt(Ge.g*255,0,255))*256+Math.round(Gt(Ge.b*255,0,255))}getHexString(t=Ae){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Yt.workingColorSpace){Yt.workingToColorSpace(Ge.copy(this),e);let i=Ge.r,s=Ge.g,r=Ge.b,o=Math.max(i,s,r),a=Math.min(i,s,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=Yt.workingColorSpace){return Yt.workingToColorSpace(Ge.copy(this),e),t.r=Ge.r,t.g=Ge.g,t.b=Ge.b,t}getStyle(t=Ae){Yt.workingToColorSpace(Ge.copy(this),t);let e=Ge.r,i=Ge.g,s=Ge.b;return t!==Ae?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Ti),this.setHSL(Ti.h+t,Ti.s+e,Ti.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Ti),t.getHSL(Po);let i=Er(Ti.h,Po.h,e),s=Er(Ti.s,Po.s,e),r=Er(Ti.l,Po.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ge=new Vt;Vt.NAMES=Cd;var Em=0,Di=class extends qn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Em++}),this.uuid=nr(),this.name="",this.type="Material",this.blending=es,this.side=ui,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Go,this.blendDst=Wo,this.blendEquation=Ii,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Vt(0,0,0),this.blendAlpha=0,this.depthFunc=ns,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=xc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ts,this.stencilZFail=ts,this.stencilZPass=ts,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==es&&(i.blending=this.blending),this.side!==ui&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Go&&(i.blendSrc=this.blendSrc),this.blendDst!==Wo&&(i.blendDst=this.blendDst),this.blendEquation!==Ii&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ns&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==xc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ts&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ts&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ts&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,i=null;if(e!==null){let s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},en=class extends Di{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Vt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new On,this.combine=Cc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Te=new D,Do=new Tt,wm=0,Ze=class{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:wm++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=yc,this.updateRanges=[],this.gpuType=Kn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Do.fromBufferAttribute(this,e),Do.applyMatrix3(t),this.setXY(e,Do.x,Do.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix3(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix4(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.applyNormalMatrix(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.transformDirection(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=zs(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ye(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=zs(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ye(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=zs(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ye(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=zs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ye(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=zs(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ye(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Ye(e,this.array),i=Ye(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=Ye(e,this.array),i=Ye(i,this.array),s=Ye(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=Ye(e,this.array),i=Ye(i,this.array),s=Ye(s,this.array),r=Ye(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==yc&&(t.usage=this.usage),t}};var Ir=class extends Ze{constructor(t,e,i){super(new Uint16Array(t),e,i)}};var Pr=class extends Ze{constructor(t,e,i){super(new Uint32Array(t),e,i)}};var ue=class extends Ze{constructor(t,e,i){super(new Float32Array(t),e,i)}},Tm=0,vn=new pe,uc=new Ne,Os=new D,fn=new Pi,Sr=new Pi,Ue=new D,Je=class n extends qn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Tm++}),this.uuid=nr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Gc(t)?Pr:Ir)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Ot().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return vn.makeRotationFromQuaternion(t),this.applyMatrix4(vn),this}rotateX(t){return vn.makeRotationX(t),this.applyMatrix4(vn),this}rotateY(t){return vn.makeRotationY(t),this.applyMatrix4(vn),this}rotateZ(t){return vn.makeRotationZ(t),this.applyMatrix4(vn),this}translate(t,e,i){return vn.makeTranslation(t,e,i),this.applyMatrix4(vn),this}scale(t,e,i){return vn.makeScale(t,e,i),this.applyMatrix4(vn),this}lookAt(t){return uc.lookAt(t),uc.updateMatrix(),this.applyMatrix4(uc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Os).negate(),this.translate(Os.x,Os.y,Os.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let i=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ue(i,3))}else{let i=Math.min(t.length,e.count);for(let s=0;s<i;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Pi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){let r=e[i];fn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ue.addVectors(this.boundingBox.min,fn.min),this.boundingBox.expandByPoint(Ue),Ue.addVectors(this.boundingBox.max,fn.max),this.boundingBox.expandByPoint(Ue)):(this.boundingBox.expandByPoint(fn.min),this.boundingBox.expandByPoint(fn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new $s);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(t){let i=this.boundingSphere.center;if(fn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Sr.setFromBufferAttribute(a),this.morphTargetsRelative?(Ue.addVectors(fn.min,Sr.min),fn.expandByPoint(Ue),Ue.addVectors(fn.max,Sr.max),fn.expandByPoint(Ue)):(fn.expandByPoint(Sr.min),fn.expandByPoint(Sr.max))}fn.getCenter(i);let s=0;for(let r=0,o=t.count;r<o;r++)Ue.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Ue));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Ue.fromBufferAttribute(a,l),c&&(Os.fromBufferAttribute(t,l),Ue.add(Os)),s=Math.max(s,i.distanceToSquared(Ue))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ze(new Float32Array(4*i.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let P=0;P<i.count;P++)a[P]=new D,c[P]=new D;let l=new D,h=new D,u=new D,f=new Tt,p=new Tt,g=new Tt,_=new D,m=new D;function d(P,M,y){l.fromBufferAttribute(i,P),h.fromBufferAttribute(i,M),u.fromBufferAttribute(i,y),f.fromBufferAttribute(r,P),p.fromBufferAttribute(r,M),g.fromBufferAttribute(r,y),h.sub(l),u.sub(l),p.sub(f),g.sub(f);let C=1/(p.x*g.y-g.x*p.y);isFinite(C)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(C),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(C),a[P].add(_),a[M].add(_),a[y].add(_),c[P].add(m),c[M].add(m),c[y].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let P=0,M=S.length;P<M;++P){let y=S[P],C=y.start,U=y.count;for(let z=C,G=C+U;z<G;z+=3)d(t.getX(z+0),t.getX(z+1),t.getX(z+2))}let w=new D,v=new D,T=new D,E=new D;function A(P){T.fromBufferAttribute(s,P),E.copy(T);let M=a[P];w.copy(M),w.sub(T.multiplyScalar(T.dot(M))).normalize(),v.crossVectors(E,M);let C=v.dot(c[P])<0?-1:1;o.setXYZW(P,w.x,w.y,w.z,C)}for(let P=0,M=S.length;P<M;++P){let y=S[P],C=y.start,U=y.count;for(let z=C,G=C+U;z<G;z+=3)A(t.getX(z+0)),A(t.getX(z+1)),A(t.getX(z+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Ze(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);let s=new D,r=new D,o=new D,a=new D,c=new D,l=new D,h=new D,u=new D;if(t)for(let f=0,p=t.count;f<p;f+=3){let g=t.getX(f+0),_=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,m),a.add(h),c.add(h),l.add(h),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,p=e.count;f<p;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Ue.fromBufferAttribute(t,e),Ue.normalize(),t.setXYZ(e,Ue.x,Ue.y,Ue.z)}toNonIndexed(){function t(a,c){let l=a.array,h=a.itemSize,u=a.normalized,f=new l.constructor(c.length*h),p=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?p=c[_]*a.data.stride+a.offset:p=c[_]*h;for(let d=0;d<h;d++)f[g++]=l[p++]}return new Ze(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new n,i=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=t(c,i);e.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){let f=l[h],p=t(f,i);c.push(p)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let i=this.attributes;for(let c in i){let l=i[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){let p=l[u];h.push(p.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone());let s=t.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(e))}let r=t.morphAttributes;for(let l in r){let h=[],u=r[l];for(let f=0,p=u.length;f<p;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let l=0,h=o.length;l<h;l++){let u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Du=new pe,ji=new rs,Lo=new $s,Lu=new D,Uo=new D,No=new D,Fo=new D,dc=new D,Oo=new D,Uu=new D,Bo=new D,K=class extends Ne{constructor(t=new Je,e=new en){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){Oo.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],u=r[c];h!==0&&(dc.fromBufferAttribute(u,t),o?Oo.addScaledVector(dc,h):Oo.addScaledVector(dc.sub(e),h))}e.add(Oo)}return e}raycast(t,e){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Lo.copy(i.boundingSphere),Lo.applyMatrix4(r),ji.copy(t.ray).recast(t.near),!(Lo.containsPoint(ji.origin)===!1&&(ji.intersectSphere(Lo,Lu)===null||ji.origin.distanceToSquared(Lu)>(t.far-t.near)**2))&&(Du.copy(r).invert(),ji.copy(t.ray).applyMatrix4(Du),!(i.boundingBox!==null&&ji.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,ji)))}_computeIntersections(t,e,i){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){let m=f[g],d=o[m.materialIndex],S=Math.max(m.start,p.start),w=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let v=S,T=w;v<T;v+=3){let E=a.getX(v),A=a.getX(v+1),P=a.getX(v+2);s=ko(this,d,t,i,l,h,u,E,A,P),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){let S=a.getX(m),w=a.getX(m+1),v=a.getX(m+2);s=ko(this,o,t,i,l,h,u,S,w,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){let m=f[g],d=o[m.materialIndex],S=Math.max(m.start,p.start),w=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let v=S,T=w;v<T;v+=3){let E=v,A=v+1,P=v+2;s=ko(this,d,t,i,l,h,u,E,A,P),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){let S=m,w=m+1,v=m+2;s=ko(this,o,t,i,l,h,u,S,w,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function Am(n,t,e,i,s,r,o,a){let c;if(t.side===Ke?c=i.intersectTriangle(o,r,s,!0,a):c=i.intersectTriangle(s,r,o,t.side===ui,a),c===null)return null;Bo.copy(a),Bo.applyMatrix4(n.matrixWorld);let l=e.ray.origin.distanceTo(Bo);return l<e.near||l>e.far?null:{distance:l,point:Bo.clone(),object:n}}function ko(n,t,e,i,s,r,o,a,c,l){n.getVertexPosition(a,Uo),n.getVertexPosition(c,No),n.getVertexPosition(l,Fo);let h=Am(n,t,e,i,Uo,No,Fo,Uu);if(h){let u=new D;Ri.getBarycoord(Uu,Uo,No,Fo,u),s&&(h.uv=Ri.getInterpolatedAttribute(s,a,c,l,u,new Tt)),r&&(h.uv1=Ri.getInterpolatedAttribute(r,a,c,l,u,new Tt)),o&&(h.normal=Ri.getInterpolatedAttribute(o,a,c,l,u,new D),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let f={a,b:c,c:l,normal:new D,materialIndex:0};Ri.getNormal(Uo,No,Fo,f.normal),h.face=f,h.barycoord=u}return h}var nn=class n extends Je{constructor(t=1,e=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],u=[],f=0,p=0;g("z","y","x",-1,-1,i,e,t,o,r,0),g("z","y","x",1,-1,i,e,-t,o,r,1),g("x","z","y",1,1,t,i,e,s,o,2),g("x","z","y",1,-1,t,i,-e,s,o,3),g("x","y","z",1,-1,t,e,i,s,r,4),g("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new ue(l,3)),this.setAttribute("normal",new ue(h,3)),this.setAttribute("uv",new ue(u,2));function g(_,m,d,S,w,v,T,E,A,P,M){let y=v/A,C=T/P,U=v/2,z=T/2,G=E/2,$=A+1,W=P+1,nt=0,H=0,ot=new D;for(let ut=0;ut<W;ut++){let wt=ut*C-z;for(let Wt=0;Wt<$;Wt++){let ce=Wt*y-U;ot[_]=ce*S,ot[m]=wt*w,ot[d]=G,l.push(ot.x,ot.y,ot.z),ot[_]=0,ot[m]=0,ot[d]=E>0?1:-1,h.push(ot.x,ot.y,ot.z),u.push(Wt/A),u.push(1-ut/P),nt+=1}}for(let ut=0;ut<P;ut++)for(let wt=0;wt<A;wt++){let Wt=f+wt+$*ut,ce=f+wt+$*(ut+1),me=f+(wt+1)+$*(ut+1),Qt=f+(wt+1)+$*ut;c.push(Wt,ce,Qt),c.push(ce,me,Qt),H+=6}a.addGroup(p,H,M),p+=H,f+=nt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function us(n){let t={};for(let e in n){t[e]={};for(let i in n[e]){let s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Xe(n){let t={};for(let e=0;e<n.length;e++){let i=us(n[e]);for(let s in i)t[s]=i[s]}return t}function Rm(n){let t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Wc(n){let t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Yt.workingColorSpace}var Id={clone:us,merge:Xe},Cm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Im=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Bn=class extends Di{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Cm,this.fragmentShader=Im,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=us(t.uniforms),this.uniformsGroups=Rm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}},Dr=class extends Ne{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pe,this.projectionMatrix=new pe,this.projectionMatrixInverse=new pe,this.coordinateSystem=Nn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ai=new D,Nu=new Tt,Fu=new Tt,We=class extends Dr{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Gs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(br*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Gs*2*Math.atan(Math.tan(br*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Ai.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ai.x,Ai.y).multiplyScalar(-t/Ai.z),Ai.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ai.x,Ai.y).multiplyScalar(-t/Ai.z)}getViewSize(t,e){return this.getViewBounds(t,Nu,Fu),e.subVectors(Fu,Nu)}setViewOffset(t,e,i,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(br*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*i/l,s*=o.width/c,i*=o.height/l}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Bs=-90,ks=1,Jo=class extends Ne{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new We(Bs,ks,t,e);s.layers=this.layers,this.add(s);let r=new We(Bs,ks,t,e);r.layers=this.layers,this.add(r);let o=new We(Bs,ks,t,e);o.layers=this.layers,this.add(o);let a=new We(Bs,ks,t,e);a.layers=this.layers,this.add(a);let c=new We(Bs,ks,t,e);c.layers=this.layers,this.add(c);let l=new We(Bs,ks,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[i,s,r,o,a,c]=e;for(let l of e)this.remove(l);if(t===Nn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Ar)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,o),t.setRenderTarget(i,2,s),t.render(e,a),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,f,p),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},Lr=class extends tn{constructor(t=[],e=ls,i,s,r,o,a,c,l,h){super(t,e,i,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Ko=class extends Yn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Lr(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new nn(5,5,5),r=new Bn({name:"CubemapFromEquirect",uniforms:us(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ke,blending:di});r.uniforms.tEquirect.value=e;let o=new K(s,r),a=e.minFilter;return e.minFilter===Ni&&(e.minFilter=Fn),new Jo(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(r)}},Zt=class extends Ne{constructor(){super(),this.isGroup=!0,this.type="Group"}},Pm={type:"move"},Ys=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Zt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Zt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Zt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,i),d=this._getHandJoint(l,_);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&f>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Pm)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let i=new Zt;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}};var Ur=class extends Ne{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new On,this.environmentIntensity=1,this.environmentRotation=new On,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}};var fc=new D,Dm=new D,Lm=new Ot,Mn=class{constructor(t=new D(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){let s=fc.subVectors(i,e).cross(Dm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let i=t.delta(fc),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let i=e||Lm.getNormalMatrix(t),s=this.coplanarPoint(fc).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Qi=new $s,Um=new Tt(.5,.5),zo=new D,Zs=class{constructor(t=new Mn,e=new Mn,i=new Mn,s=new Mn,r=new Mn,o=new Mn){this.planes=[t,e,i,s,r,o]}set(t,e,i,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Nn,i=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],c=r[2],l=r[3],h=r[4],u=r[5],f=r[6],p=r[7],g=r[8],_=r[9],m=r[10],d=r[11],S=r[12],w=r[13],v=r[14],T=r[15];if(s[0].setComponents(l-o,p-h,d-g,T-S).normalize(),s[1].setComponents(l+o,p+h,d+g,T+S).normalize(),s[2].setComponents(l+a,p+u,d+_,T+w).normalize(),s[3].setComponents(l-a,p-u,d-_,T-w).normalize(),i)s[4].setComponents(c,f,m,v).normalize(),s[5].setComponents(l-c,p-f,d-m,T-v).normalize();else if(s[4].setComponents(l-c,p-f,d-m,T-v).normalize(),e===Nn)s[5].setComponents(l+c,p+f,d+m,T+v).normalize();else if(e===Ar)s[5].setComponents(c,f,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Qi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Qi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Qi)}intersectsSprite(t){Qi.center.set(0,0,0);let e=Um.distanceTo(t.center);return Qi.radius=.7071067811865476+e,Qi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Qi)}intersectsSphere(t){let e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let i=0;i<6;i++){let s=e[i];if(zo.x=s.normal.x>0?t.max.x:t.min.x,zo.y=s.normal.y>0?t.max.y:t.min.y,zo.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(zo)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var os=class extends tn{constructor(t,e,i,s,r,o,a,c,l){super(t,e,i,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},Nr=class extends tn{constructor(t,e,i=Fi,s,r,o,a=Sn,c=Sn,l,h=Vs,u=1){if(h!==Vs&&h!==er)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:t,height:e,depth:u};super(f,s,r,o,a,c,h,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Xs(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Fr=class extends tn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}};var Js=class n extends Je{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);let r=[],o=[],a=[],c=[],l=new D,h=new Tt;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){let p=i+u/e*s;l.x=t*Math.cos(p),l.y=t*Math.sin(p),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[f]/t+1)/2,h.y=(o[f+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new ue(o,3)),this.setAttribute("normal",new ue(a,3)),this.setAttribute("uv",new ue(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.segments,t.thetaStart,t.thetaLength)}},xe=class n extends Je{constructor(t=1,e=1,i=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],f=[],p=[],g=0,_=[],m=i/2,d=0;S(),o===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new ue(u,3)),this.setAttribute("normal",new ue(f,3)),this.setAttribute("uv",new ue(p,2));function S(){let v=new D,T=new D,E=0,A=(e-t)/i;for(let P=0;P<=r;P++){let M=[],y=P/r,C=y*(e-t)+t;for(let U=0;U<=s;U++){let z=U/s,G=z*c+a,$=Math.sin(G),W=Math.cos(G);T.x=C*$,T.y=-y*i+m,T.z=C*W,u.push(T.x,T.y,T.z),v.set($,A,W).normalize(),f.push(v.x,v.y,v.z),p.push(z,1-y),M.push(g++)}_.push(M)}for(let P=0;P<s;P++)for(let M=0;M<r;M++){let y=_[M][P],C=_[M+1][P],U=_[M+1][P+1],z=_[M][P+1];(t>0||M!==0)&&(h.push(y,C,z),E+=3),(e>0||M!==r-1)&&(h.push(C,U,z),E+=3)}l.addGroup(d,E,0),d+=E}function w(v){let T=g,E=new Tt,A=new D,P=0,M=v===!0?t:e,y=v===!0?1:-1;for(let U=1;U<=s;U++)u.push(0,m*y,0),f.push(0,y,0),p.push(.5,.5),g++;let C=g;for(let U=0;U<=s;U++){let G=U/s*c+a,$=Math.cos(G),W=Math.sin(G);A.x=M*W,A.y=m*y,A.z=M*$,u.push(A.x,A.y,A.z),f.push(0,y,0),E.x=$*.5+.5,E.y=W*.5*y+.5,p.push(E.x,E.y),g++}for(let U=0;U<s;U++){let z=T+U,G=C+U;v===!0?h.push(G,G+1,z):h.push(G+1,G,z),P+=3}l.addGroup(d,P,v===!0?1:2),d+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var Or=class n extends Je{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};let r=[],o=[];a(s),l(i),h(),this.setAttribute("position",new ue(r,3)),this.setAttribute("normal",new ue(r.slice(),3)),this.setAttribute("uv",new ue(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(S){let w=new D,v=new D,T=new D;for(let E=0;E<e.length;E+=3)p(e[E+0],w),p(e[E+1],v),p(e[E+2],T),c(w,v,T,S)}function c(S,w,v,T){let E=T+1,A=[];for(let P=0;P<=E;P++){A[P]=[];let M=S.clone().lerp(v,P/E),y=w.clone().lerp(v,P/E),C=E-P;for(let U=0;U<=C;U++)U===0&&P===E?A[P][U]=M:A[P][U]=M.clone().lerp(y,U/C)}for(let P=0;P<E;P++)for(let M=0;M<2*(E-P)-1;M++){let y=Math.floor(M/2);M%2===0?(f(A[P][y+1]),f(A[P+1][y]),f(A[P][y])):(f(A[P][y+1]),f(A[P+1][y+1]),f(A[P+1][y]))}}function l(S){let w=new D;for(let v=0;v<r.length;v+=3)w.x=r[v+0],w.y=r[v+1],w.z=r[v+2],w.normalize().multiplyScalar(S),r[v+0]=w.x,r[v+1]=w.y,r[v+2]=w.z}function h(){let S=new D;for(let w=0;w<r.length;w+=3){S.x=r[w+0],S.y=r[w+1],S.z=r[w+2];let v=m(S)/2/Math.PI+.5,T=d(S)/Math.PI+.5;o.push(v,1-T)}g(),u()}function u(){for(let S=0;S<o.length;S+=6){let w=o[S+0],v=o[S+2],T=o[S+4],E=Math.max(w,v,T),A=Math.min(w,v,T);E>.9&&A<.1&&(w<.2&&(o[S+0]+=1),v<.2&&(o[S+2]+=1),T<.2&&(o[S+4]+=1))}}function f(S){r.push(S.x,S.y,S.z)}function p(S,w){let v=S*3;w.x=t[v+0],w.y=t[v+1],w.z=t[v+2]}function g(){let S=new D,w=new D,v=new D,T=new D,E=new Tt,A=new Tt,P=new Tt;for(let M=0,y=0;M<r.length;M+=9,y+=6){S.set(r[M+0],r[M+1],r[M+2]),w.set(r[M+3],r[M+4],r[M+5]),v.set(r[M+6],r[M+7],r[M+8]),E.set(o[y+0],o[y+1]),A.set(o[y+2],o[y+3]),P.set(o[y+4],o[y+5]),T.copy(S).add(w).add(v).divideScalar(3);let C=m(T);_(E,y+0,S,C),_(A,y+2,w,C),_(P,y+4,v,C)}}function _(S,w,v,T){T<0&&S.x===1&&(o[w]=S.x-1),v.x===0&&v.z===0&&(o[w]=T/2/Math.PI+.5)}function m(S){return Math.atan2(S.z,-S.x)}function d(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.vertices,t.indices,t.radius,t.details)}};var Br=class n extends Or{constructor(t=1,e=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new n(t.radius,t.detail)}};var kr=class n extends Or{constructor(t=1,e=0){let i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new n(t.radius,t.detail)}},En=class n extends Je{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(i),c=Math.floor(s),l=a+1,h=c+1,u=t/a,f=e/c,p=[],g=[],_=[],m=[];for(let d=0;d<h;d++){let S=d*f-o;for(let w=0;w<l;w++){let v=w*u-r;g.push(v,-S,0),_.push(0,0,1),m.push(w/a),m.push(1-d/c)}}for(let d=0;d<c;d++)for(let S=0;S<a;S++){let w=S+l*d,v=S+l*(d+1),T=S+1+l*(d+1),E=S+1+l*d;p.push(w,v,E),p.push(v,T,E)}this.setIndex(p),this.setAttribute("position",new ue(g,3)),this.setAttribute("normal",new ue(_,3)),this.setAttribute("uv",new ue(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.widthSegments,t.heightSegments)}},zr=class n extends Je{constructor(t=.5,e=1,i=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);let a=[],c=[],l=[],h=[],u=t,f=(e-t)/s,p=new D,g=new Tt;for(let _=0;_<=s;_++){for(let m=0;m<=i;m++){let d=r+m/i*o;p.x=u*Math.cos(d),p.y=u*Math.sin(d),c.push(p.x,p.y,p.z),l.push(0,0,1),g.x=(p.x/e+1)/2,g.y=(p.y/e+1)/2,h.push(g.x,g.y)}u+=f}for(let _=0;_<s;_++){let m=_*(i+1);for(let d=0;d<i;d++){let S=d+m,w=S,v=S+i+1,T=S+i+2,E=S+1;a.push(w,v,E),a.push(v,T,E)}}this.setIndex(a),this.setAttribute("position",new ue(c,3)),this.setAttribute("normal",new ue(l,3)),this.setAttribute("uv",new ue(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}};var Zn=class n extends Je{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));let c=Math.min(o+a,Math.PI),l=0,h=[],u=new D,f=new D,p=[],g=[],_=[],m=[];for(let d=0;d<=i;d++){let S=[],w=d/i,v=0;d===0&&o===0?v=.5/e:d===i&&c===Math.PI&&(v=-.5/e);for(let T=0;T<=e;T++){let E=T/e;u.x=-t*Math.cos(s+E*r)*Math.sin(o+w*a),u.y=t*Math.cos(o+w*a),u.z=t*Math.sin(s+E*r)*Math.sin(o+w*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),m.push(E+v,1-w),S.push(l++)}h.push(S)}for(let d=0;d<i;d++)for(let S=0;S<e;S++){let w=h[d][S+1],v=h[d][S],T=h[d+1][S],E=h[d+1][S+1];(d!==0||o>0)&&p.push(w,v,E),(d!==i-1||c<Math.PI)&&p.push(v,T,E)}this.setIndex(p),this.setAttribute("position",new ue(g,3)),this.setAttribute("normal",new ue(_,3)),this.setAttribute("uv",new ue(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Re=class extends Di{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Vt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Vt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=kc,this.normalScale=new Tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new On,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var jo=class extends Di{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=_d,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Qo=class extends Di{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Ho(n,t){return!n||n.constructor===t?n:typeof t.BYTES_PER_ELEMENT=="number"?new t(n):Array.prototype.slice.call(n)}function Nm(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var as=class{constructor(t,e,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,i=this._cachedIndex,s=e[i],r=e[i-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=i+2;;){if(s===void 0){if(t<r)break i;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=e[++i],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(i=2,r=a);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=e[--i-1],t>=r)break t}o=i,i=0;break e}break n}for(;i<o;){let a=i+o>>>1;t<e[a]?o=a:i=a+1}if(s=e[i],r=e[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=i[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},ta=class extends as{constructor(t,e,i,s){super(t,e,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:mc,endingEnd:mc}}intervalChanged_(t,e,i){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case gc:r=t,a=2*e-i;break;case _c:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=i}if(c===void 0)switch(this.getSettings_().endingEnd){case gc:o=t,c=2*i-e;break;case _c:o=1,c=i+s[1]-s[0];break;default:o=t-1,c=e}let l=(i-e)*.5,h=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-i),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,p=this._weightNext,g=(i-e)/(s-e),_=g*g,m=_*g,d=-f*m+2*f*_-f*g,S=(1+f)*m+(-1.5-2*f)*_+(-.5+f)*g+1,w=(-1-p)*m+(1.5+p)*_+.5*g,v=p*m-p*_;for(let T=0;T!==a;++T)r[T]=d*o[h+T]+S*o[l+T]+w*o[c+T]+v*o[u+T];return r}},ea=class extends as{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=(i-e)/(s-e),u=1-h;for(let f=0;f!==a;++f)r[f]=o[l+f]*u+o[c+f]*h;return r}},na=class extends as{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},pn=class{constructor(t,e,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Ho(e,this.TimeBufferType),this.values=Ho(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:Ho(t.times,Array),values:Ho(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s)}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new na(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new ea(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new ta(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case wr:e=this.InterpolantFactoryMethodDiscrete;break;case $o:e=this.InterpolantFactoryMethodLinear;break;case Vo:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return wr;case this.InterpolantFactoryMethodLinear:return $o;case this.InterpolantFactoryMethodSmooth:return Vo}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]*=t}return this}trim(t,e){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<t;)++r;for(;o!==-1&&i[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let c=i[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(s!==void 0&&Nm(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Vo,r=t.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=t[a],h=t[a+1];if(l!==h&&(a!==1||l!==t[0]))if(s)c=!0;else{let u=a*i,f=u-i,p=u+i;for(let g=0;g!==i;++g){let _=e[u+g];if(_!==e[f+g]||_!==e[p+g]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];let u=a*i,f=o*i;for(let p=0;p!==i;++p)e[f+p]=e[u+p]}++o}}if(r>0){t[o]=t[r];for(let a=r*i,c=o*i,l=0;l!==i;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*i)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),i=this.constructor,s=new i(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};pn.prototype.ValueTypeName="";pn.prototype.TimeBufferType=Float32Array;pn.prototype.ValueBufferType=Float32Array;pn.prototype.DefaultInterpolation=$o;var Li=class extends pn{constructor(t,e,i){super(t,e,i)}};Li.prototype.ValueTypeName="bool";Li.prototype.ValueBufferType=Array;Li.prototype.DefaultInterpolation=wr;Li.prototype.InterpolantFactoryMethodLinear=void 0;Li.prototype.InterpolantFactoryMethodSmooth=void 0;var ia=class extends pn{constructor(t,e,i,s){super(t,e,i,s)}};ia.prototype.ValueTypeName="color";var sa=class extends pn{constructor(t,e,i,s){super(t,e,i,s)}};sa.prototype.ValueTypeName="number";var ra=class extends as{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(i-e)/(s-e),l=t*a;for(let h=l+a;l!==h;l+=4)bn.slerpFlat(r,0,o,l-a,o,l,c);return r}},Hr=class extends pn{constructor(t,e,i,s){super(t,e,i,s)}InterpolantFactoryMethodLinear(t){return new ra(this.times,this.values,this.getValueSize(),t)}};Hr.prototype.ValueTypeName="quaternion";Hr.prototype.InterpolantFactoryMethodSmooth=void 0;var Ui=class extends pn{constructor(t,e,i){super(t,e,i)}};Ui.prototype.ValueTypeName="string";Ui.prototype.ValueBufferType=Array;Ui.prototype.DefaultInterpolation=wr;Ui.prototype.InterpolantFactoryMethodLinear=void 0;Ui.prototype.InterpolantFactoryMethodSmooth=void 0;var oa=class extends pn{constructor(t,e,i,s){super(t,e,i,s)}};oa.prototype.ValueTypeName="vector";var aa=class{constructor(t,e,i){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=l.length;u<f;u+=2){let p=l[u],g=l[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Pd=new aa,la=class{constructor(t){this.manager=t!==void 0?t:Pd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let i=this;return new Promise(function(s,r){i.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};la.DEFAULT_MATERIAL_NAME="__DEFAULT";var Vr=class extends Ne{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Vt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},Gr=class extends Vr{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ne.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Vt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},pc=new pe,Ou=new D,Bu=new D,vc=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Tt(512,512),this.mapType=zn,this.map=null,this.mapPass=null,this.matrix=new pe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Zs,this._frameExtents=new Tt(1,1),this._viewportCount=1,this._viewports=[new Me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,i=this.matrix;Ou.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ou),Bu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Bu),e.updateMatrixWorld(),pc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(pc,e.coordinateSystem,e.reversedDepth),e.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(pc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var Wr=class extends Dr{constructor(t=-1,e=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-t,o=i+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Mc=class extends vc{constructor(){super(new Wr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Xr=class extends Vr{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ne.DEFAULT_UP),this.updateMatrix(),this.target=new Ne,this.shadow=new Mc}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var ca=class extends We{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Xc="\\[\\]\\.:\\/",Fm=new RegExp("["+Xc+"]","g"),$c="[^"+Xc+"]",Om="[^"+Xc.replace("\\.","")+"]",Bm=/((?:WC+[\/:])*)/.source.replace("WC",$c),km=/(WCOD+)?/.source.replace("WCOD",Om),zm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",$c),Hm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",$c),Vm=new RegExp("^"+Bm+km+zm+Hm+"$"),Gm=["material","materials","bones","map"],Sc=class{constructor(t,e,i){let s=i||fe.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,e)}setValue(t,e){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}},fe=class n{constructor(t,e,i){this.path=e,this.parsedPath=i||n.parseTrackName(e),this.node=n.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new n.Composite(t,e,i):new n(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Fm,"")}static parseTrackName(t){let e=Vm.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);Gm.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let c=i(a.children);if(c)return c}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)t[e++]=i[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,i=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=n.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let l=e.objectIndex;switch(i){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let o=t[s];if(o===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};fe.Composite=Sc;fe.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};fe.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};fe.prototype.GetterByBindingType=[fe.prototype._getValue_direct,fe.prototype._getValue_array,fe.prototype._getValue_arrayElement,fe.prototype._getValue_toArray];fe.prototype.SetterByBindingTypeAndVersioning=[[fe.prototype._setValue_direct,fe.prototype._setValue_direct_setNeedsUpdate,fe.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[fe.prototype._setValue_array,fe.prototype._setValue_array_setNeedsUpdate,fe.prototype._setValue_array_setMatrixWorldNeedsUpdate],[fe.prototype._setValue_arrayElement,fe.prototype._setValue_arrayElement_setNeedsUpdate,fe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[fe.prototype._setValue_fromArray,fe.prototype._setValue_fromArray_setNeedsUpdate,fe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var gM=new Float32Array(1);var ku=new pe,$r=class{constructor(t,e,i=0,s=1/0){this.ray=new rs(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new qs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return ku.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ku),this}intersectObject(t,e=!0,i=[]){return bc(t,this,i,e),i.sort(zu),i}intersectObjects(t,e=!0,i=[]){for(let s=0,r=t.length;s<r;s++)bc(t[s],this,i,e);return i.sort(zu),i}};function zu(n,t){return n.distance-t.distance}function bc(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){let r=n.children;for(let o=0,a=r.length;o<a;o++)bc(r[o],t,e,!0)}}var Ks=class{constructor(t=1,e=0,i=0){this.radius=t,this.phi=e,this.theta=i}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Gt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(Gt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var qr=class extends qn{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function qc(n,t,e,i){let s=Wm(i);switch(e){case Nc:return n*t;case Oc:return n*t/s.components*s.byteLength;case Ea:return n*t/s.components*s.byteLength;case Bc:return n*t*2/s.components*s.byteLength;case wa:return n*t*2/s.components*s.byteLength;case Fc:return n*t*3/s.components*s.byteLength;case Tn:return n*t*4/s.components*s.byteLength;case Ta:return n*t*4/s.components*s.byteLength;case Jr:case Kr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case jr:case Qr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Ra:case Ia:return Math.max(n,16)*Math.max(t,8)/4;case Aa:case Ca:return Math.max(n,8)*Math.max(t,8)/2;case Pa:case Da:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case La:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Ua:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Na:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Fa:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Oa:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Ba:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case ka:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case za:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Ha:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Va:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Ga:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Wa:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Xa:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case $a:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case qa:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Ya:case Za:case Ja:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Ka:case ja:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Qa:case tl:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Wm(n){switch(n){case zn:case Pc:return{byteLength:1,components:1};case js:case Dc:case Qs:return{byteLength:2,components:1};case Sa:case ba:return{byteLength:2,components:4};case Fi:case Ma:case Kn:return{byteLength:4,components:1};case Lc:case Uc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function ef(){let n=null,t=!1,e=null,i=null;function s(r,o){e(r,o),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function jm(n){let t=new WeakMap;function e(a,c){let l=a.array,h=a.usage,u=l.byteLength,f=n.createBuffer();n.bindBuffer(c,f),n.bufferData(c,l,h),a.onUploadCallback();let p;if(l instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=n.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=n.SHORT;else if(l instanceof Uint32Array)p=n.UNSIGNED_INT;else if(l instanceof Int32Array)p=n.INT;else if(l instanceof Int8Array)p=n.BYTE;else if(l instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function i(a,c,l){let h=c.array,u=c.updateRanges;if(n.bindBuffer(l,a),u.length===0)n.bufferSubData(l,0,h);else{u.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<u.length;p++){let g=u[f],_=u[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,u[f]=_)}u.length=f+1;for(let p=0,g=u.length;p<g;p++){let _=u[p];n.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=t.get(a);c&&(n.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var Qm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,tg=`#ifdef USE_ALPHAHASH
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
#endif`,eg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ng=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ig=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,sg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,rg=`#ifdef USE_AOMAP
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
#endif`,og=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ag=`#ifdef USE_BATCHING
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
#endif`,lg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,cg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,hg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ug=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,dg=`#ifdef USE_IRIDESCENCE
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
#endif`,fg=`#ifdef USE_BUMPMAP
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
#endif`,pg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,mg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,gg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,_g=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,xg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,yg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,vg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Mg=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Sg=`#define PI 3.141592653589793
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
} // validated`,bg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Eg=`vec3 transformedNormal = objectNormal;
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
#endif`,wg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Tg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ag=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Rg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Cg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ig=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Pg=`#ifdef USE_ENVMAP
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
#endif`,Dg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Lg=`#ifdef USE_ENVMAP
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
#endif`,Ug=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ng=`#ifdef USE_ENVMAP
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
#endif`,Fg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Og=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Bg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,kg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,zg=`#ifdef USE_GRADIENTMAP
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
}`,Hg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Vg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Gg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Wg=`uniform bool receiveShadow;
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
#endif`,Xg=`#ifdef USE_ENVMAP
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
#endif`,$g=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,qg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Yg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Zg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Jg=`PhysicalMaterial material;
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
#endif`,Kg=`struct PhysicalMaterial {
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
}`,jg=`
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
#endif`,Qg=`#if defined( RE_IndirectDiffuse )
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
#endif`,t0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,e0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,n0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,i0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,s0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,r0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,o0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,a0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,l0=`#if defined( USE_POINTS_UV )
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
#endif`,c0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,h0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,u0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,d0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,f0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,p0=`#ifdef USE_MORPHTARGETS
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
#endif`,m0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,g0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,_0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,x0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,y0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,v0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,M0=`#ifdef USE_NORMALMAP
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
#endif`,S0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,b0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,E0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,w0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,T0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,A0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,R0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,C0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,I0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,P0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,D0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,L0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,U0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,N0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,F0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,O0=`float getShadowMask() {
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
}`,B0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,k0=`#ifdef USE_SKINNING
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
#endif`,z0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,H0=`#ifdef USE_SKINNING
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
#endif`,V0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,G0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,W0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,X0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,$0=`#ifdef USE_TRANSMISSION
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
#endif`,q0=`#ifdef USE_TRANSMISSION
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
#endif`,Y0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Z0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,J0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,K0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,j0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Q0=`uniform sampler2D t2D;
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
}`,t_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,e_=`#ifdef ENVMAP_TYPE_CUBE
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
}`,n_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,i_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,s_=`#include <common>
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
}`,r_=`#if DEPTH_PACKING == 3200
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
}`,o_=`#define DISTANCE
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
}`,a_=`#define DISTANCE
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
}`,l_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,c_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,h_=`uniform float scale;
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
}`,u_=`uniform vec3 diffuse;
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
}`,d_=`#include <common>
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
}`,f_=`uniform vec3 diffuse;
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
}`,p_=`#define LAMBERT
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
}`,m_=`#define LAMBERT
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
}`,g_=`#define MATCAP
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
}`,__=`#define MATCAP
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
}`,x_=`#define NORMAL
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
}`,y_=`#define NORMAL
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
}`,v_=`#define PHONG
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
}`,M_=`#define PHONG
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
}`,S_=`#define STANDARD
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
}`,b_=`#define STANDARD
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
}`,E_=`#define TOON
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
}`,w_=`#define TOON
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
}`,T_=`uniform float size;
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
}`,A_=`uniform vec3 diffuse;
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
}`,R_=`#include <common>
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
}`,C_=`uniform vec3 color;
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
}`,I_=`uniform float rotation;
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
}`,P_=`uniform vec3 diffuse;
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
}`,Ht={alphahash_fragment:Qm,alphahash_pars_fragment:tg,alphamap_fragment:eg,alphamap_pars_fragment:ng,alphatest_fragment:ig,alphatest_pars_fragment:sg,aomap_fragment:rg,aomap_pars_fragment:og,batching_pars_vertex:ag,batching_vertex:lg,begin_vertex:cg,beginnormal_vertex:hg,bsdfs:ug,iridescence_fragment:dg,bumpmap_pars_fragment:fg,clipping_planes_fragment:pg,clipping_planes_pars_fragment:mg,clipping_planes_pars_vertex:gg,clipping_planes_vertex:_g,color_fragment:xg,color_pars_fragment:yg,color_pars_vertex:vg,color_vertex:Mg,common:Sg,cube_uv_reflection_fragment:bg,defaultnormal_vertex:Eg,displacementmap_pars_vertex:wg,displacementmap_vertex:Tg,emissivemap_fragment:Ag,emissivemap_pars_fragment:Rg,colorspace_fragment:Cg,colorspace_pars_fragment:Ig,envmap_fragment:Pg,envmap_common_pars_fragment:Dg,envmap_pars_fragment:Lg,envmap_pars_vertex:Ug,envmap_physical_pars_fragment:Xg,envmap_vertex:Ng,fog_vertex:Fg,fog_pars_vertex:Og,fog_fragment:Bg,fog_pars_fragment:kg,gradientmap_pars_fragment:zg,lightmap_pars_fragment:Hg,lights_lambert_fragment:Vg,lights_lambert_pars_fragment:Gg,lights_pars_begin:Wg,lights_toon_fragment:$g,lights_toon_pars_fragment:qg,lights_phong_fragment:Yg,lights_phong_pars_fragment:Zg,lights_physical_fragment:Jg,lights_physical_pars_fragment:Kg,lights_fragment_begin:jg,lights_fragment_maps:Qg,lights_fragment_end:t0,logdepthbuf_fragment:e0,logdepthbuf_pars_fragment:n0,logdepthbuf_pars_vertex:i0,logdepthbuf_vertex:s0,map_fragment:r0,map_pars_fragment:o0,map_particle_fragment:a0,map_particle_pars_fragment:l0,metalnessmap_fragment:c0,metalnessmap_pars_fragment:h0,morphinstance_vertex:u0,morphcolor_vertex:d0,morphnormal_vertex:f0,morphtarget_pars_vertex:p0,morphtarget_vertex:m0,normal_fragment_begin:g0,normal_fragment_maps:_0,normal_pars_fragment:x0,normal_pars_vertex:y0,normal_vertex:v0,normalmap_pars_fragment:M0,clearcoat_normal_fragment_begin:S0,clearcoat_normal_fragment_maps:b0,clearcoat_pars_fragment:E0,iridescence_pars_fragment:w0,opaque_fragment:T0,packing:A0,premultiplied_alpha_fragment:R0,project_vertex:C0,dithering_fragment:I0,dithering_pars_fragment:P0,roughnessmap_fragment:D0,roughnessmap_pars_fragment:L0,shadowmap_pars_fragment:U0,shadowmap_pars_vertex:N0,shadowmap_vertex:F0,shadowmask_pars_fragment:O0,skinbase_vertex:B0,skinning_pars_vertex:k0,skinning_vertex:z0,skinnormal_vertex:H0,specularmap_fragment:V0,specularmap_pars_fragment:G0,tonemapping_fragment:W0,tonemapping_pars_fragment:X0,transmission_fragment:$0,transmission_pars_fragment:q0,uv_pars_fragment:Y0,uv_pars_vertex:Z0,uv_vertex:J0,worldpos_vertex:K0,background_vert:j0,background_frag:Q0,backgroundCube_vert:t_,backgroundCube_frag:e_,cube_vert:n_,cube_frag:i_,depth_vert:s_,depth_frag:r_,distanceRGBA_vert:o_,distanceRGBA_frag:a_,equirect_vert:l_,equirect_frag:c_,linedashed_vert:h_,linedashed_frag:u_,meshbasic_vert:d_,meshbasic_frag:f_,meshlambert_vert:p_,meshlambert_frag:m_,meshmatcap_vert:g_,meshmatcap_frag:__,meshnormal_vert:x_,meshnormal_frag:y_,meshphong_vert:v_,meshphong_frag:M_,meshphysical_vert:S_,meshphysical_frag:b_,meshtoon_vert:E_,meshtoon_frag:w_,points_vert:T_,points_frag:A_,shadow_vert:R_,shadow_frag:C_,sprite_vert:I_,sprite_frag:P_},rt={common:{diffuse:{value:new Vt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ot}},envmap:{envMap:{value:null},envMapRotation:{value:new Ot},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ot},normalScale:{value:new Tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Vt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Vt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0},uvTransform:{value:new Ot}},sprite:{diffuse:{value:new Vt(16777215)},opacity:{value:1},center:{value:new Tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}}},jn={basic:{uniforms:Xe([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.fog]),vertexShader:Ht.meshbasic_vert,fragmentShader:Ht.meshbasic_frag},lambert:{uniforms:Xe([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new Vt(0)}}]),vertexShader:Ht.meshlambert_vert,fragmentShader:Ht.meshlambert_frag},phong:{uniforms:Xe([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new Vt(0)},specular:{value:new Vt(1118481)},shininess:{value:30}}]),vertexShader:Ht.meshphong_vert,fragmentShader:Ht.meshphong_frag},standard:{uniforms:Xe([rt.common,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.roughnessmap,rt.metalnessmap,rt.fog,rt.lights,{emissive:{value:new Vt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag},toon:{uniforms:Xe([rt.common,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.gradientmap,rt.fog,rt.lights,{emissive:{value:new Vt(0)}}]),vertexShader:Ht.meshtoon_vert,fragmentShader:Ht.meshtoon_frag},matcap:{uniforms:Xe([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,{matcap:{value:null}}]),vertexShader:Ht.meshmatcap_vert,fragmentShader:Ht.meshmatcap_frag},points:{uniforms:Xe([rt.points,rt.fog]),vertexShader:Ht.points_vert,fragmentShader:Ht.points_frag},dashed:{uniforms:Xe([rt.common,rt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ht.linedashed_vert,fragmentShader:Ht.linedashed_frag},depth:{uniforms:Xe([rt.common,rt.displacementmap]),vertexShader:Ht.depth_vert,fragmentShader:Ht.depth_frag},normal:{uniforms:Xe([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,{opacity:{value:1}}]),vertexShader:Ht.meshnormal_vert,fragmentShader:Ht.meshnormal_frag},sprite:{uniforms:Xe([rt.sprite,rt.fog]),vertexShader:Ht.sprite_vert,fragmentShader:Ht.sprite_frag},background:{uniforms:{uvTransform:{value:new Ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ht.background_vert,fragmentShader:Ht.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ot}},vertexShader:Ht.backgroundCube_vert,fragmentShader:Ht.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ht.cube_vert,fragmentShader:Ht.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ht.equirect_vert,fragmentShader:Ht.equirect_frag},distanceRGBA:{uniforms:Xe([rt.common,rt.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ht.distanceRGBA_vert,fragmentShader:Ht.distanceRGBA_frag},shadow:{uniforms:Xe([rt.lights,rt.fog,{color:{value:new Vt(0)},opacity:{value:1}}]),vertexShader:Ht.shadow_vert,fragmentShader:Ht.shadow_frag}};jn.physical={uniforms:Xe([jn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ot},clearcoatNormalScale:{value:new Tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ot},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ot},sheen:{value:0},sheenColor:{value:new Vt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ot},transmissionSamplerSize:{value:new Tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ot},attenuationDistance:{value:0},attenuationColor:{value:new Vt(0)},specularColor:{value:new Vt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ot},anisotropyVector:{value:new Tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ot}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag};var el={r:0,b:0,g:0},ds=new On,D_=new pe;function L_(n,t,e,i,s,r,o){let a=new Vt(0),c=r===!0?0:1,l,h,u=null,f=0,p=null;function g(w){let v=w.isScene===!0?w.background:null;return v&&v.isTexture&&(v=(w.backgroundBlurriness>0?e:t).get(v)),v}function _(w){let v=!1,T=g(w);T===null?d(a,c):T&&T.isColor&&(d(T,1),v=!0);let E=n.xr.getEnvironmentBlendMode();E==="additive"?i.buffers.color.setClear(0,0,0,1,o):E==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(w,v){let T=g(v);T&&(T.isCubeTexture||T.mapping===Yr)?(h===void 0&&(h=new K(new nn(1,1,1),new Bn({name:"BackgroundCubeMaterial",uniforms:us(jn.backgroundCube.uniforms),vertexShader:jn.backgroundCube.vertexShader,fragmentShader:jn.backgroundCube.fragmentShader,side:Ke,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,A,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ds.copy(v.backgroundRotation),ds.x*=-1,ds.y*=-1,ds.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(ds.y*=-1,ds.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(D_.makeRotationFromEuler(ds)),h.material.toneMapped=Yt.getTransfer(T.colorSpace)!==ee,(u!==T||f!==T.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=T,f=T.version,p=n.toneMapping),h.layers.enableAll(),w.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(l===void 0&&(l=new K(new En(2,2),new Bn({name:"BackgroundMaterial",uniforms:us(jn.background.uniforms),vertexShader:jn.background.vertexShader,fragmentShader:jn.background.fragmentShader,side:ui,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=T,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=Yt.getTransfer(T.colorSpace)!==ee,T.matrixAutoUpdate===!0&&T.updateMatrix(),l.material.uniforms.uvTransform.value.copy(T.matrix),(u!==T||f!==T.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,u=T,f=T.version,p=n.toneMapping),l.layers.enableAll(),w.unshift(l,l.geometry,l.material,0,0,null))}function d(w,v){w.getRGB(el,Wc(n)),i.buffers.color.setClear(el.r,el.g,el.b,v,o)}function S(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(w,v=1){a.set(w),c=v,d(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(w){c=w,d(a,c)},render:_,addToRenderList:m,dispose:S}}function U_(n,t){let e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null),r=s,o=!1;function a(y,C,U,z,G){let $=!1,W=u(z,U,C);r!==W&&(r=W,l(r.object)),$=p(y,z,U,G),$&&g(y,z,U,G),G!==null&&t.update(G,n.ELEMENT_ARRAY_BUFFER),($||o)&&(o=!1,v(y,C,U,z),G!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(G).buffer))}function c(){return n.createVertexArray()}function l(y){return n.bindVertexArray(y)}function h(y){return n.deleteVertexArray(y)}function u(y,C,U){let z=U.wireframe===!0,G=i[y.id];G===void 0&&(G={},i[y.id]=G);let $=G[C.id];$===void 0&&($={},G[C.id]=$);let W=$[z];return W===void 0&&(W=f(c()),$[z]=W),W}function f(y){let C=[],U=[],z=[];for(let G=0;G<e;G++)C[G]=0,U[G]=0,z[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:U,attributeDivisors:z,object:y,attributes:{},index:null}}function p(y,C,U,z){let G=r.attributes,$=C.attributes,W=0,nt=U.getAttributes();for(let H in nt)if(nt[H].location>=0){let ut=G[H],wt=$[H];if(wt===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(wt=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(wt=y.instanceColor)),ut===void 0||ut.attribute!==wt||wt&&ut.data!==wt.data)return!0;W++}return r.attributesNum!==W||r.index!==z}function g(y,C,U,z){let G={},$=C.attributes,W=0,nt=U.getAttributes();for(let H in nt)if(nt[H].location>=0){let ut=$[H];ut===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(ut=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(ut=y.instanceColor));let wt={};wt.attribute=ut,ut&&ut.data&&(wt.data=ut.data),G[H]=wt,W++}r.attributes=G,r.attributesNum=W,r.index=z}function _(){let y=r.newAttributes;for(let C=0,U=y.length;C<U;C++)y[C]=0}function m(y){d(y,0)}function d(y,C){let U=r.newAttributes,z=r.enabledAttributes,G=r.attributeDivisors;U[y]=1,z[y]===0&&(n.enableVertexAttribArray(y),z[y]=1),G[y]!==C&&(n.vertexAttribDivisor(y,C),G[y]=C)}function S(){let y=r.newAttributes,C=r.enabledAttributes;for(let U=0,z=C.length;U<z;U++)C[U]!==y[U]&&(n.disableVertexAttribArray(U),C[U]=0)}function w(y,C,U,z,G,$,W){W===!0?n.vertexAttribIPointer(y,C,U,G,$):n.vertexAttribPointer(y,C,U,z,G,$)}function v(y,C,U,z){_();let G=z.attributes,$=U.getAttributes(),W=C.defaultAttributeValues;for(let nt in $){let H=$[nt];if(H.location>=0){let ot=G[nt];if(ot===void 0&&(nt==="instanceMatrix"&&y.instanceMatrix&&(ot=y.instanceMatrix),nt==="instanceColor"&&y.instanceColor&&(ot=y.instanceColor)),ot!==void 0){let ut=ot.normalized,wt=ot.itemSize,Wt=t.get(ot);if(Wt===void 0)continue;let ce=Wt.buffer,me=Wt.type,Qt=Wt.bytesPerElement,q=me===n.INT||me===n.UNSIGNED_INT||ot.gpuType===Ma;if(ot.isInterleavedBufferAttribute){let J=ot.data,mt=J.stride,Ut=ot.offset;if(J.isInstancedInterleavedBuffer){for(let Et=0;Et<H.locationSize;Et++)d(H.location+Et,J.meshPerAttribute);y.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let Et=0;Et<H.locationSize;Et++)m(H.location+Et);n.bindBuffer(n.ARRAY_BUFFER,ce);for(let Et=0;Et<H.locationSize;Et++)w(H.location+Et,wt/H.locationSize,me,ut,mt*Qt,(Ut+wt/H.locationSize*Et)*Qt,q)}else{if(ot.isInstancedBufferAttribute){for(let J=0;J<H.locationSize;J++)d(H.location+J,ot.meshPerAttribute);y.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let J=0;J<H.locationSize;J++)m(H.location+J);n.bindBuffer(n.ARRAY_BUFFER,ce);for(let J=0;J<H.locationSize;J++)w(H.location+J,wt/H.locationSize,me,ut,wt*Qt,wt/H.locationSize*J*Qt,q)}}else if(W!==void 0){let ut=W[nt];if(ut!==void 0)switch(ut.length){case 2:n.vertexAttrib2fv(H.location,ut);break;case 3:n.vertexAttrib3fv(H.location,ut);break;case 4:n.vertexAttrib4fv(H.location,ut);break;default:n.vertexAttrib1fv(H.location,ut)}}}}S()}function T(){P();for(let y in i){let C=i[y];for(let U in C){let z=C[U];for(let G in z)h(z[G].object),delete z[G];delete C[U]}delete i[y]}}function E(y){if(i[y.id]===void 0)return;let C=i[y.id];for(let U in C){let z=C[U];for(let G in z)h(z[G].object),delete z[G];delete C[U]}delete i[y.id]}function A(y){for(let C in i){let U=i[C];if(U[y.id]===void 0)continue;let z=U[y.id];for(let G in z)h(z[G].object),delete z[G];delete U[y.id]}}function P(){M(),o=!0,r!==s&&(r=s,l(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:M,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:S}}function N_(n,t,e){let i;function s(l){i=l}function r(l,h){n.drawArrays(i,l,h),e.update(h,i,1)}function o(l,h,u){u!==0&&(n.drawArraysInstanced(i,l,h,u),e.update(h,i,u))}function a(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];e.update(p,i,1)}function c(l,h,u,f){if(u===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)o(l[g],h[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(i,l,0,h,0,f,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*f[_];e.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function F_(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let A=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==Tn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){let P=A===Qs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==zn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Kn&&!P)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let u=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),S=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),w=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),T=g>0,E=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:S,maxVaryings:w,maxFragmentUniforms:v,vertexTextures:T,maxSamples:E}}function O_(n){let t=this,e=null,i=0,s=!1,r=!1,o=new Mn,a=new Ot,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let p=u.length!==0||f||i!==0||s;return s=f,i=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,p){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,d=n.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{let S=r?0:i,w=S*4,v=d.clippingState||null;c.value=v,v=h(g,f,w,p);for(let T=0;T!==w;++T)v[T]=e[T];d.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,f,p,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=c.value,g!==!0||m===null){let d=p+_*4,S=f.matrixWorldInverse;a.getNormalMatrix(S),(m===null||m.length<d)&&(m=new Float32Array(d));for(let w=0,v=p;w!==_;++w,v+=4)o.copy(u[w]).applyMatrix4(S,a),o.normal.toArray(m,v),m[v+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function B_(n){let t=new WeakMap;function e(o,a){return a===xa?o.mapping=ls:a===ya&&(o.mapping=cs),o}function i(o){if(o&&o.isTexture){let a=o.mapping;if(a===xa||a===ya)if(t.has(o)){let c=t.get(o).texture;return e(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new Ko(c.height);return l.fromEquirectangularTexture(n,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}var sr=4,Dd=[.125,.215,.35,.446,.526,.582],ms=20,Yc=new Wr,Ld=new Vt,Zc=null,Jc=0,Kc=0,jc=!1,ps=(1+Math.sqrt(5))/2,ir=1/ps,Ud=[new D(-ps,ir,0),new D(ps,ir,0),new D(-ir,0,ps),new D(ir,0,ps),new D(0,ps,-ir),new D(0,ps,ir),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],k_=new D,sl=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100,r={}){let{size:o=256,position:a=k_}=r;Zc=this._renderer.getRenderTarget(),Jc=this._renderer.getActiveCubeFace(),Kc=this._renderer.getActiveMipmapLevel(),jc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,i,s,c,a),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Od(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Fd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Zc,Jc,Kc),this._renderer.xr.enabled=jc,t.scissorTest=!1,nl(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ls||t.mapping===cs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Zc=this._renderer.getRenderTarget(),Jc=this._renderer.getActiveCubeFace(),Kc=this._renderer.getActiveMipmapLevel(),jc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Fn,minFilter:Fn,generateMipmaps:!1,type:Qs,format:Tn,colorSpace:ss,depthBuffer:!1},s=Nd(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Nd(t,e,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=z_(r)),this._blurMaterial=H_(r,t,e)}return s}_compileMaterial(t){let e=new K(this._lodPlanes[0],t);this._renderer.compile(e,Yc)}_sceneToCubeUV(t,e,i,s,r){let c=new We(90,1,e,i),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,p=u.toneMapping;u.getClearColor(Ld),u.toneMapping=fi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let _=new en({name:"PMREM.Background",side:Ke,depthWrite:!1,depthTest:!1}),m=new K(new nn,_),d=!1,S=t.background;S?S.isColor&&(_.color.copy(S),t.background=null,d=!0):(_.color.copy(Ld),d=!0);for(let w=0;w<6;w++){let v=w%3;v===0?(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[w],r.y,r.z)):v===1?(c.up.set(0,0,l[w]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[w],r.z)):(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[w]));let T=this._cubeSize;nl(s,v*T,w>2?T:0,T,T),u.setRenderTarget(s),d&&u.render(m,c),u.render(t,c)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=p,u.autoClear=f,t.background=S}_textureToCubeUV(t,e){let i=this._renderer,s=t.mapping===ls||t.mapping===cs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Od()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Fd());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new K(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let c=this._cubeSize;nl(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(o,Yc)}_applyPMREM(t){let e=this._renderer,i=e.autoClear;e.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Ud[(s-r-1)%Ud.length];this._blur(t,r-1,r,o,a)}e.autoClear=i}_blur(t,e,i,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,s,"latitudinal",r),this._halfBlur(o,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new K(this._lodPlanes[s],l),f=l.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ms-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):ms;m>ms&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ms}`);let d=[],S=0;for(let A=0;A<ms;++A){let P=A/_,M=Math.exp(-P*P/2);d.push(M),A===0?S+=M:A<m&&(S+=2*M)}for(let A=0;A<d.length;A++)d[A]=d[A]/S;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:w}=this;f.dTheta.value=g,f.mipInt.value=w-i;let v=this._sizeLods[s],T=3*v*(s>w-sr?s-w+sr:0),E=4*(this._cubeSize-v);nl(e,T,E,3*v,2*v),c.setRenderTarget(e),c.render(u,Yc)}};function z_(n){let t=[],e=[],i=[],s=n,r=n-sr+1+Dd.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let c=1/a;o>n-sr?c=Dd[o-n+sr-1]:o===0&&(c=0),i.push(c);let l=1/(a-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,_=3,m=2,d=1,S=new Float32Array(_*g*p),w=new Float32Array(m*g*p),v=new Float32Array(d*g*p);for(let E=0;E<p;E++){let A=E%3*2/3-1,P=E>2?0:-1,M=[A,P,0,A+2/3,P,0,A+2/3,P+1,0,A,P,0,A+2/3,P+1,0,A,P+1,0];S.set(M,_*g*E),w.set(f,m*g*E);let y=[E,E,E,E,E,E];v.set(y,d*g*E)}let T=new Je;T.setAttribute("position",new Ze(S,_)),T.setAttribute("uv",new Ze(w,m)),T.setAttribute("faceIndex",new Ze(v,d)),t.push(T),s>sr&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Nd(n,t,e){let i=new Yn(n,t,e);return i.texture.mapping=Yr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function nl(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function H_(n,t,e){let i=new Float32Array(ms),s=new D(0,1,0);return new Bn({name:"SphericalGaussianBlur",defines:{n:ms,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:lh(),fragmentShader:`

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
		`,blending:di,depthTest:!1,depthWrite:!1})}function Fd(){return new Bn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:lh(),fragmentShader:`

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
		`,blending:di,depthTest:!1,depthWrite:!1})}function Od(){return new Bn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:lh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:di,depthTest:!1,depthWrite:!1})}function lh(){return`

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
	`}function V_(n){let t=new WeakMap,e=null;function i(a){if(a&&a.isTexture){let c=a.mapping,l=c===xa||c===ya,h=c===ls||c===cs;if(l||h){let u=t.get(a),f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return e===null&&(e=new sl(n)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{let p=a.image;return l&&p&&p.height>0||h&&p&&s(p)?(e===null&&(e=new sl(n)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function G_(n){let t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){let s=e(i);return s===null&&Ws("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function W_(n,t,e,i){let s={},r=new WeakMap;function o(u){let f=u.target;f.index!==null&&t.remove(f.index);for(let g in f.attributes)t.remove(f.attributes[g]);f.removeEventListener("dispose",o),delete s[f.id];let p=r.get(f);p&&(t.remove(p),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function c(u){let f=u.attributes;for(let p in f)t.update(f[p],n.ARRAY_BUFFER)}function l(u){let f=[],p=u.index,g=u.attributes.position,_=0;if(p!==null){let S=p.array;_=p.version;for(let w=0,v=S.length;w<v;w+=3){let T=S[w+0],E=S[w+1],A=S[w+2];f.push(T,E,E,A,A,T)}}else if(g!==void 0){let S=g.array;_=g.version;for(let w=0,v=S.length/3-1;w<v;w+=3){let T=w+0,E=w+1,A=w+2;f.push(T,E,E,A,A,T)}}else return;let m=new(Gc(f)?Pr:Ir)(f,1);m.version=_;let d=r.get(u);d&&t.remove(d),r.set(u,m)}function h(u){let f=r.get(u);if(f){let p=u.index;p!==null&&f.version<p.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function X_(n,t,e){let i;function s(f){i=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function c(f,p){n.drawElements(i,p,r,f*o),e.update(p,i,1)}function l(f,p,g){g!==0&&(n.drawElementsInstanced(i,p,r,f*o,g),e.update(p,i,g))}function h(f,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,f,0,g);let m=0;for(let d=0;d<g;d++)m+=p[d];e.update(m,i,1)}function u(f,p,g,_){if(g===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)l(f[d]/o,p[d],_[d]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,r,f,0,_,0,g);let d=0;for(let S=0;S<g;S++)d+=p[S]*_[S];e.update(d,i,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function $_(n){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=a*(r/3);break;case n.LINES:e.lines+=a*(r/2);break;case n.LINE_STRIP:e.lines+=a*(r-1);break;case n.LINE_LOOP:e.lines+=a*r;break;case n.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function q_(n,t,e){let i=new WeakMap,s=new Me;function r(o,a,c){let l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,f=i.get(a);if(f===void 0||f.count!==u){let M=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",M)};f!==void 0&&f.texture.dispose();let p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],d=a.morphAttributes.normal||[],S=a.morphAttributes.color||[],w=0;p===!0&&(w=1),g===!0&&(w=2),_===!0&&(w=3);let v=a.attributes.position.count*w,T=1;v>t.maxTextureSize&&(T=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let E=new Float32Array(v*T*4*u),A=new Cr(E,v,T,u);A.type=Kn,A.needsUpdate=!0;let P=w*4;for(let y=0;y<u;y++){let C=m[y],U=d[y],z=S[y],G=v*T*4*y;for(let $=0;$<C.count;$++){let W=$*P;p===!0&&(s.fromBufferAttribute(C,$),E[G+W+0]=s.x,E[G+W+1]=s.y,E[G+W+2]=s.z,E[G+W+3]=0),g===!0&&(s.fromBufferAttribute(U,$),E[G+W+4]=s.x,E[G+W+5]=s.y,E[G+W+6]=s.z,E[G+W+7]=0),_===!0&&(s.fromBufferAttribute(z,$),E[G+W+8]=s.x,E[G+W+9]=s.y,E[G+W+10]=s.z,E[G+W+11]=z.itemSize===4?s.w:1)}}f={count:u,texture:A,size:new Tt(v,T)},i.set(a,f),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let p=0;for(let _=0;_<l.length;_++)p+=l[_];let g=a.morphTargetsRelative?1:1-p;c.getUniforms().setValue(n,"morphTargetBaseInfluence",g),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function Y_(n,t,e,i){let s=new WeakMap;function r(c){let l=i.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function o(){s=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}var nf=new tn,Bd=new Nr(1,1),sf=new Cr,rf=new Zo,of=new Lr,kd=[],zd=[],Hd=new Float32Array(16),Vd=new Float32Array(9),Gd=new Float32Array(4);function or(n,t,e){let i=n[0];if(i<=0||i>0)return n;let s=t*e,r=kd[s];if(r===void 0&&(r=new Float32Array(s),kd[s]=r),t!==0){i.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,n[o].toArray(r,a)}return r}function Ce(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Ie(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function ol(n,t){let e=zd[t];e===void 0&&(e=new Int32Array(t),zd[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Z_(n,t){let e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function J_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;n.uniform2fv(this.addr,t),Ie(e,t)}}function K_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ce(e,t))return;n.uniform3fv(this.addr,t),Ie(e,t)}}function j_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;n.uniform4fv(this.addr,t),Ie(e,t)}}function Q_(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(Ce(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Ie(e,t)}else{if(Ce(e,i))return;Gd.set(i),n.uniformMatrix2fv(this.addr,!1,Gd),Ie(e,i)}}function tx(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(Ce(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Ie(e,t)}else{if(Ce(e,i))return;Vd.set(i),n.uniformMatrix3fv(this.addr,!1,Vd),Ie(e,i)}}function ex(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(Ce(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Ie(e,t)}else{if(Ce(e,i))return;Hd.set(i),n.uniformMatrix4fv(this.addr,!1,Hd),Ie(e,i)}}function nx(n,t){let e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function ix(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;n.uniform2iv(this.addr,t),Ie(e,t)}}function sx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;n.uniform3iv(this.addr,t),Ie(e,t)}}function rx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;n.uniform4iv(this.addr,t),Ie(e,t)}}function ox(n,t){let e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function ax(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;n.uniform2uiv(this.addr,t),Ie(e,t)}}function lx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;n.uniform3uiv(this.addr,t),Ie(e,t)}}function cx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;n.uniform4uiv(this.addr,t),Ie(e,t)}}function hx(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Bd.compareFunction=zc,r=Bd):r=nf,e.setTexture2D(t||r,s)}function ux(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||rf,s)}function dx(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||of,s)}function fx(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||sf,s)}function px(n){switch(n){case 5126:return Z_;case 35664:return J_;case 35665:return K_;case 35666:return j_;case 35674:return Q_;case 35675:return tx;case 35676:return ex;case 5124:case 35670:return nx;case 35667:case 35671:return ix;case 35668:case 35672:return sx;case 35669:case 35673:return rx;case 5125:return ox;case 36294:return ax;case 36295:return lx;case 36296:return cx;case 35678:case 36198:case 36298:case 36306:case 35682:return hx;case 35679:case 36299:case 36307:return ux;case 35680:case 36300:case 36308:case 36293:return dx;case 36289:case 36303:case 36311:case 36292:return fx}}function mx(n,t){n.uniform1fv(this.addr,t)}function gx(n,t){let e=or(t,this.size,2);n.uniform2fv(this.addr,e)}function _x(n,t){let e=or(t,this.size,3);n.uniform3fv(this.addr,e)}function xx(n,t){let e=or(t,this.size,4);n.uniform4fv(this.addr,e)}function yx(n,t){let e=or(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function vx(n,t){let e=or(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Mx(n,t){let e=or(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function Sx(n,t){n.uniform1iv(this.addr,t)}function bx(n,t){n.uniform2iv(this.addr,t)}function Ex(n,t){n.uniform3iv(this.addr,t)}function wx(n,t){n.uniform4iv(this.addr,t)}function Tx(n,t){n.uniform1uiv(this.addr,t)}function Ax(n,t){n.uniform2uiv(this.addr,t)}function Rx(n,t){n.uniform3uiv(this.addr,t)}function Cx(n,t){n.uniform4uiv(this.addr,t)}function Ix(n,t,e){let i=this.cache,s=t.length,r=ol(e,s);Ce(i,r)||(n.uniform1iv(this.addr,r),Ie(i,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||nf,r[o])}function Px(n,t,e){let i=this.cache,s=t.length,r=ol(e,s);Ce(i,r)||(n.uniform1iv(this.addr,r),Ie(i,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||rf,r[o])}function Dx(n,t,e){let i=this.cache,s=t.length,r=ol(e,s);Ce(i,r)||(n.uniform1iv(this.addr,r),Ie(i,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||of,r[o])}function Lx(n,t,e){let i=this.cache,s=t.length,r=ol(e,s);Ce(i,r)||(n.uniform1iv(this.addr,r),Ie(i,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||sf,r[o])}function Ux(n){switch(n){case 5126:return mx;case 35664:return gx;case 35665:return _x;case 35666:return xx;case 35674:return yx;case 35675:return vx;case 35676:return Mx;case 5124:case 35670:return Sx;case 35667:case 35671:return bx;case 35668:case 35672:return Ex;case 35669:case 35673:return wx;case 5125:return Tx;case 36294:return Ax;case 36295:return Rx;case 36296:return Cx;case 35678:case 36198:case 36298:case 36306:case 35682:return Ix;case 35679:case 36299:case 36307:return Px;case 35680:case 36300:case 36308:case 36293:return Dx;case 36289:case 36303:case 36311:case 36292:return Lx}}var th=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=px(e.type)}},eh=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Ux(e.type)}},nh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],i)}}},Qc=/(\w+)(\])?(\[|\.)?/g;function Wd(n,t){n.seq.push(t),n.map[t.id]=t}function Nx(n,t,e){let i=n.name,s=i.length;for(Qc.lastIndex=0;;){let r=Qc.exec(i),o=Qc.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Wd(e,l===void 0?new th(a,n,t):new eh(a,n,t));break}else{let u=e.map[a];u===void 0&&(u=new nh(a),Wd(e,u)),e=u}}}var rr=class{constructor(t,e){this.seq=[],this.map={};let i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Nx(r,o,this)}}setValue(t,e,i,s){let r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){let s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],c=i[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){let i=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&i.push(o)}return i}};function Xd(n,t,e){let i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}var Fx=37297,Ox=0;function Bx(n,t){let e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return i.join(`
`)}var $d=new Ot;function kx(n){Yt._getMatrix($d,Yt.workingColorSpace,n);let t=`mat3( ${$d.elements.map(e=>e.toFixed(4))} )`;switch(Yt.getTransfer(n)){case Tr:return[t,"LinearTransferOETF"];case ee:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function qd(n,t,e){let i=n.getShaderParameter(t,n.COMPILE_STATUS),r=(n.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+Bx(n.getShaderSource(t),a)}else return r}function zx(n,t){let e=kx(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Hx(n,t){let e;switch(t){case cd:e="Linear";break;case hd:e="Reinhard";break;case ud:e="Cineon";break;case dd:e="ACESFilmic";break;case pd:e="AgX";break;case md:e="Neutral";break;case fd:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var il=new D;function Vx(){Yt.getLuminanceCoefficients(il);let n=il.x.toFixed(4),t=il.y.toFixed(4),e=il.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Gx(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(to).join(`
`)}function Wx(n){let t=[];for(let e in n){let i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Xx(n,t){let e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(t,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:n.getAttribLocation(t,o),locationSize:a}}return e}function to(n){return n!==""}function Yd(n,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Zd(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var $x=/^[ \t]*#include +<([\w\d./]+)>/gm;function ih(n){return n.replace($x,Yx)}var qx=new Map;function Yx(n,t){let e=Ht[t];if(e===void 0){let i=qx.get(t);if(i!==void 0)e=Ht[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return ih(e)}var Zx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Jd(n){return n.replace(Zx,Jx)}function Jx(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Kd(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function Kx(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===wc?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===ha?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Jn&&(t="SHADOWMAP_TYPE_VSM"),t}function jx(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case ls:case cs:t="ENVMAP_TYPE_CUBE";break;case Yr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Qx(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case cs:t="ENVMAP_MODE_REFRACTION";break}return t}function ty(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Cc:t="ENVMAP_BLENDING_MULTIPLY";break;case ad:t="ENVMAP_BLENDING_MIX";break;case ld:t="ENVMAP_BLENDING_ADD";break}return t}function ey(n){let t=n.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function ny(n,t,e,i){let s=n.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,c=Kx(e),l=jx(e),h=Qx(e),u=ty(e),f=ey(e),p=Gx(e),g=Wx(r),_=s.createProgram(),m,d,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(to).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(to).join(`
`),d.length>0&&(d+=`
`)):(m=[Kd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(to).join(`
`),d=[Kd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==fi?"#define TONE_MAPPING":"",e.toneMapping!==fi?Ht.tonemapping_pars_fragment:"",e.toneMapping!==fi?Hx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ht.colorspace_pars_fragment,zx("linearToOutputTexel",e.outputColorSpace),Vx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(to).join(`
`)),o=ih(o),o=Yd(o,e),o=Zd(o,e),a=ih(a),a=Yd(a,e),a=Zd(a,e),o=Jd(o),a=Jd(a),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",e.glslVersion===Hc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Hc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let w=S+m+o,v=S+d+a,T=Xd(s,s.VERTEX_SHADER,w),E=Xd(s,s.FRAGMENT_SHADER,v);s.attachShader(_,T),s.attachShader(_,E),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(C){if(n.debug.checkShaderErrors){let U=s.getProgramInfoLog(_)||"",z=s.getShaderInfoLog(T)||"",G=s.getShaderInfoLog(E)||"",$=U.trim(),W=z.trim(),nt=G.trim(),H=!0,ot=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(H=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,T,E);else{let ut=qd(s,T,"vertex"),wt=qd(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+$+`
`+ut+`
`+wt)}else $!==""?console.warn("THREE.WebGLProgram: Program Info Log:",$):(W===""||nt==="")&&(ot=!1);ot&&(C.diagnostics={runnable:H,programLog:$,vertexShader:{log:W,prefix:m},fragmentShader:{log:nt,prefix:d}})}s.deleteShader(T),s.deleteShader(E),P=new rr(s,_),M=Xx(s,_)}let P;this.getUniforms=function(){return P===void 0&&A(this),P};let M;this.getAttributes=function(){return M===void 0&&A(this),M};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(_,Fx)),y},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Ox++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=E,this}var iy=0,sh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){let e=this.shaderCache,i=e.get(t);return i===void 0&&(i=new rh(t),e.set(t,i)),i}},rh=class{constructor(t){this.id=iy++,this.code=t,this.usedTimes=0}};function sy(n,t,e,i,s,r,o){let a=new qs,c=new sh,l=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return l.add(M),M===0?"uv":`uv${M}`}function m(M,y,C,U,z){let G=U.fog,$=z.geometry,W=M.isMeshStandardMaterial?U.environment:null,nt=(M.isMeshStandardMaterial?e:t).get(M.envMap||W),H=nt&&nt.mapping===Yr?nt.image.height:null,ot=g[M.type];M.precision!==null&&(p=s.getMaxPrecision(M.precision),p!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));let ut=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,wt=ut!==void 0?ut.length:0,Wt=0;$.morphAttributes.position!==void 0&&(Wt=1),$.morphAttributes.normal!==void 0&&(Wt=2),$.morphAttributes.color!==void 0&&(Wt=3);let ce,me,Qt,q;if(ot){let te=jn[ot];ce=te.vertexShader,me=te.fragmentShader}else ce=M.vertexShader,me=M.fragmentShader,c.update(M),Qt=c.getVertexShaderID(M),q=c.getFragmentShaderID(M);let J=n.getRenderTarget(),mt=n.state.buffers.depth.getReversed(),Ut=z.isInstancedMesh===!0,Et=z.isBatchedMesh===!0,qt=!!M.map,ze=!!M.matcap,I=!!nt,ge=!!M.aoMap,Ft=!!M.lightMap,Dt=!!M.bumpMap,xt=!!M.normalMap,_e=!!M.displacementMap,yt=!!M.emissiveMap,zt=!!M.metalnessMap,De=!!M.roughnessMap,Ee=M.anisotropy>0,R=M.clearcoat>0,x=M.dispersion>0,O=M.iridescence>0,X=M.sheen>0,Z=M.transmission>0,V=Ee&&!!M.anisotropyMap,bt=R&&!!M.clearcoatMap,it=R&&!!M.clearcoatNormalMap,vt=R&&!!M.clearcoatRoughnessMap,Mt=O&&!!M.iridescenceMap,tt=O&&!!M.iridescenceThicknessMap,ht=X&&!!M.sheenColorMap,It=X&&!!M.sheenRoughnessMap,St=!!M.specularMap,lt=!!M.specularColorMap,Bt=!!M.specularIntensityMap,L=Z&&!!M.transmissionMap,et=Z&&!!M.thicknessMap,st=!!M.gradientMap,ft=!!M.alphaMap,j=M.alphaTest>0,Y=!!M.alphaHash,_t=!!M.extensions,Nt=fi;M.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(Nt=n.toneMapping);let he={shaderID:ot,shaderType:M.type,shaderName:M.name,vertexShader:ce,fragmentShader:me,defines:M.defines,customVertexShaderID:Qt,customFragmentShaderID:q,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,batching:Et,batchingColor:Et&&z._colorsTexture!==null,instancing:Ut,instancingColor:Ut&&z.instanceColor!==null,instancingMorph:Ut&&z.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:J===null?n.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:ss,alphaToCoverage:!!M.alphaToCoverage,map:qt,matcap:ze,envMap:I,envMapMode:I&&nt.mapping,envMapCubeUVHeight:H,aoMap:ge,lightMap:Ft,bumpMap:Dt,normalMap:xt,displacementMap:f&&_e,emissiveMap:yt,normalMapObjectSpace:xt&&M.normalMapType===yd,normalMapTangentSpace:xt&&M.normalMapType===kc,metalnessMap:zt,roughnessMap:De,anisotropy:Ee,anisotropyMap:V,clearcoat:R,clearcoatMap:bt,clearcoatNormalMap:it,clearcoatRoughnessMap:vt,dispersion:x,iridescence:O,iridescenceMap:Mt,iridescenceThicknessMap:tt,sheen:X,sheenColorMap:ht,sheenRoughnessMap:It,specularMap:St,specularColorMap:lt,specularIntensityMap:Bt,transmission:Z,transmissionMap:L,thicknessMap:et,gradientMap:st,opaque:M.transparent===!1&&M.blending===es&&M.alphaToCoverage===!1,alphaMap:ft,alphaTest:j,alphaHash:Y,combine:M.combine,mapUv:qt&&_(M.map.channel),aoMapUv:ge&&_(M.aoMap.channel),lightMapUv:Ft&&_(M.lightMap.channel),bumpMapUv:Dt&&_(M.bumpMap.channel),normalMapUv:xt&&_(M.normalMap.channel),displacementMapUv:_e&&_(M.displacementMap.channel),emissiveMapUv:yt&&_(M.emissiveMap.channel),metalnessMapUv:zt&&_(M.metalnessMap.channel),roughnessMapUv:De&&_(M.roughnessMap.channel),anisotropyMapUv:V&&_(M.anisotropyMap.channel),clearcoatMapUv:bt&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:it&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:vt&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Mt&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:tt&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:ht&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:It&&_(M.sheenRoughnessMap.channel),specularMapUv:St&&_(M.specularMap.channel),specularColorMapUv:lt&&_(M.specularColorMap.channel),specularIntensityMapUv:Bt&&_(M.specularIntensityMap.channel),transmissionMapUv:L&&_(M.transmissionMap.channel),thicknessMapUv:et&&_(M.thicknessMap.channel),alphaMapUv:ft&&_(M.alphaMap.channel),vertexTangents:!!$.attributes.tangent&&(xt||Ee),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!$.attributes.uv&&(qt||ft),fog:!!G,useFog:M.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:mt,skinning:z.isSkinnedMesh===!0,morphTargets:$.morphAttributes.position!==void 0,morphNormals:$.morphAttributes.normal!==void 0,morphColors:$.morphAttributes.color!==void 0,morphTargetsCount:wt,morphTextureStride:Wt,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:Nt,decodeVideoTexture:qt&&M.map.isVideoTexture===!0&&Yt.getTransfer(M.map.colorSpace)===ee,decodeVideoTextureEmissive:yt&&M.emissiveMap.isVideoTexture===!0&&Yt.getTransfer(M.emissiveMap.colorSpace)===ee,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===sn,flipSided:M.side===Ke,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:_t&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(_t&&M.extensions.multiDraw===!0||Et)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return he.vertexUv1s=l.has(1),he.vertexUv2s=l.has(2),he.vertexUv3s=l.has(3),l.clear(),he}function d(M){let y=[];if(M.shaderID?y.push(M.shaderID):(y.push(M.customVertexShaderID),y.push(M.customFragmentShaderID)),M.defines!==void 0)for(let C in M.defines)y.push(C),y.push(M.defines[C]);return M.isRawShaderMaterial===!1&&(S(y,M),w(y,M),y.push(n.outputColorSpace)),y.push(M.customProgramCacheKey),y.join()}function S(M,y){M.push(y.precision),M.push(y.outputColorSpace),M.push(y.envMapMode),M.push(y.envMapCubeUVHeight),M.push(y.mapUv),M.push(y.alphaMapUv),M.push(y.lightMapUv),M.push(y.aoMapUv),M.push(y.bumpMapUv),M.push(y.normalMapUv),M.push(y.displacementMapUv),M.push(y.emissiveMapUv),M.push(y.metalnessMapUv),M.push(y.roughnessMapUv),M.push(y.anisotropyMapUv),M.push(y.clearcoatMapUv),M.push(y.clearcoatNormalMapUv),M.push(y.clearcoatRoughnessMapUv),M.push(y.iridescenceMapUv),M.push(y.iridescenceThicknessMapUv),M.push(y.sheenColorMapUv),M.push(y.sheenRoughnessMapUv),M.push(y.specularMapUv),M.push(y.specularColorMapUv),M.push(y.specularIntensityMapUv),M.push(y.transmissionMapUv),M.push(y.thicknessMapUv),M.push(y.combine),M.push(y.fogExp2),M.push(y.sizeAttenuation),M.push(y.morphTargetsCount),M.push(y.morphAttributeCount),M.push(y.numDirLights),M.push(y.numPointLights),M.push(y.numSpotLights),M.push(y.numSpotLightMaps),M.push(y.numHemiLights),M.push(y.numRectAreaLights),M.push(y.numDirLightShadows),M.push(y.numPointLightShadows),M.push(y.numSpotLightShadows),M.push(y.numSpotLightShadowsWithMaps),M.push(y.numLightProbes),M.push(y.shadowMapType),M.push(y.toneMapping),M.push(y.numClippingPlanes),M.push(y.numClipIntersection),M.push(y.depthPacking)}function w(M,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),y.gradientMap&&a.enable(22),M.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),M.push(a.mask)}function v(M){let y=g[M.type],C;if(y){let U=jn[y];C=Id.clone(U.uniforms)}else C=M.uniforms;return C}function T(M,y){let C;for(let U=0,z=h.length;U<z;U++){let G=h[U];if(G.cacheKey===y){C=G,++C.usedTimes;break}}return C===void 0&&(C=new ny(n,y,M,r),h.push(C)),C}function E(M){if(--M.usedTimes===0){let y=h.indexOf(M);h[y]=h[h.length-1],h.pop(),M.destroy()}}function A(M){c.remove(M)}function P(){c.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:v,acquireProgram:T,releaseProgram:E,releaseShaderCache:A,programs:h,dispose:P}}function ry(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,c){n.get(o)[a]=c}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function oy(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function jd(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Qd(){let n=[],t=0,e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function o(u,f,p,g,_,m){let d=n[t];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},n[t]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=_,d.group=m),t++,d}function a(u,f,p,g,_,m){let d=o(u,f,p,g,_,m);p.transmission>0?i.push(d):p.transparent===!0?s.push(d):e.push(d)}function c(u,f,p,g,_,m){let d=o(u,f,p,g,_,m);p.transmission>0?i.unshift(d):p.transparent===!0?s.unshift(d):e.unshift(d)}function l(u,f){e.length>1&&e.sort(u||oy),i.length>1&&i.sort(f||jd),s.length>1&&s.sort(f||jd)}function h(){for(let u=t,f=n.length;u<f;u++){let p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function ay(){let n=new WeakMap;function t(i,s){let r=n.get(i),o;return r===void 0?(o=new Qd,n.set(i,[o])):s>=r.length?(o=new Qd,r.push(o)):o=r[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function ly(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new D,color:new Vt};break;case"SpotLight":e={position:new D,direction:new D,color:new Vt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new D,color:new Vt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new D,skyColor:new Vt,groundColor:new Vt};break;case"RectAreaLight":e={color:new Vt,position:new D,halfWidth:new D,halfHeight:new D};break}return n[t.id]=e,e}}}function cy(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}var hy=0;function uy(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function dy(n){let t=new ly,e=cy(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new D);let s=new D,r=new pe,o=new pe;function a(l){let h=0,u=0,f=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let p=0,g=0,_=0,m=0,d=0,S=0,w=0,v=0,T=0,E=0,A=0;l.sort(uy);for(let M=0,y=l.length;M<y;M++){let C=l[M],U=C.color,z=C.intensity,G=C.distance,$=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=U.r*z,u+=U.g*z,f+=U.b*z;else if(C.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(C.sh.coefficients[W],z);A++}else if(C.isDirectionalLight){let W=t.get(C);if(W.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let nt=C.shadow,H=e.get(C);H.shadowIntensity=nt.intensity,H.shadowBias=nt.bias,H.shadowNormalBias=nt.normalBias,H.shadowRadius=nt.radius,H.shadowMapSize=nt.mapSize,i.directionalShadow[p]=H,i.directionalShadowMap[p]=$,i.directionalShadowMatrix[p]=C.shadow.matrix,S++}i.directional[p]=W,p++}else if(C.isSpotLight){let W=t.get(C);W.position.setFromMatrixPosition(C.matrixWorld),W.color.copy(U).multiplyScalar(z),W.distance=G,W.coneCos=Math.cos(C.angle),W.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),W.decay=C.decay,i.spot[_]=W;let nt=C.shadow;if(C.map&&(i.spotLightMap[T]=C.map,T++,nt.updateMatrices(C),C.castShadow&&E++),i.spotLightMatrix[_]=nt.matrix,C.castShadow){let H=e.get(C);H.shadowIntensity=nt.intensity,H.shadowBias=nt.bias,H.shadowNormalBias=nt.normalBias,H.shadowRadius=nt.radius,H.shadowMapSize=nt.mapSize,i.spotShadow[_]=H,i.spotShadowMap[_]=$,v++}_++}else if(C.isRectAreaLight){let W=t.get(C);W.color.copy(U).multiplyScalar(z),W.halfWidth.set(C.width*.5,0,0),W.halfHeight.set(0,C.height*.5,0),i.rectArea[m]=W,m++}else if(C.isPointLight){let W=t.get(C);if(W.color.copy(C.color).multiplyScalar(C.intensity),W.distance=C.distance,W.decay=C.decay,C.castShadow){let nt=C.shadow,H=e.get(C);H.shadowIntensity=nt.intensity,H.shadowBias=nt.bias,H.shadowNormalBias=nt.normalBias,H.shadowRadius=nt.radius,H.shadowMapSize=nt.mapSize,H.shadowCameraNear=nt.camera.near,H.shadowCameraFar=nt.camera.far,i.pointShadow[g]=H,i.pointShadowMap[g]=$,i.pointShadowMatrix[g]=C.shadow.matrix,w++}i.point[g]=W,g++}else if(C.isHemisphereLight){let W=t.get(C);W.skyColor.copy(C.color).multiplyScalar(z),W.groundColor.copy(C.groundColor).multiplyScalar(z),i.hemi[d]=W,d++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=rt.LTC_FLOAT_1,i.rectAreaLTC2=rt.LTC_FLOAT_2):(i.rectAreaLTC1=rt.LTC_HALF_1,i.rectAreaLTC2=rt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=f;let P=i.hash;(P.directionalLength!==p||P.pointLength!==g||P.spotLength!==_||P.rectAreaLength!==m||P.hemiLength!==d||P.numDirectionalShadows!==S||P.numPointShadows!==w||P.numSpotShadows!==v||P.numSpotMaps!==T||P.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=d,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.pointShadow.length=w,i.pointShadowMap.length=w,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=S,i.pointShadowMatrix.length=w,i.spotLightMatrix.length=v+T-E,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=A,P.directionalLength=p,P.pointLength=g,P.spotLength=_,P.rectAreaLength=m,P.hemiLength=d,P.numDirectionalShadows=S,P.numPointShadows=w,P.numSpotShadows=v,P.numSpotMaps=T,P.numLightProbes=A,i.version=hy++)}function c(l,h){let u=0,f=0,p=0,g=0,_=0,m=h.matrixWorldInverse;for(let d=0,S=l.length;d<S;d++){let w=l[d];if(w.isDirectionalLight){let v=i.directional[u];v.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),u++}else if(w.isSpotLight){let v=i.spot[p];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),p++}else if(w.isRectAreaLight){let v=i.rectArea[g];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(m),o.identity(),r.copy(w.matrixWorld),r.premultiply(m),o.extractRotation(r),v.halfWidth.set(w.width*.5,0,0),v.halfHeight.set(0,w.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(w.isPointLight){let v=i.point[f];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(m),f++}else if(w.isHemisphereLight){let v=i.hemi[_];v.direction.setFromMatrixPosition(w.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:a,setupView:c,state:i}}function tf(n){let t=new dy(n),e=[],i=[];function s(h){l.camera=h,e.length=0,i.length=0}function r(h){e.push(h)}function o(h){i.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}let l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function fy(n){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new tf(n),t.set(s,[a])):r>=o.length?(a=new tf(n),o.push(a)):a=o[r],a}function i(){t=new WeakMap}return{get:e,dispose:i}}var py=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,my=`uniform sampler2D shadow_pass;
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
}`;function gy(n,t,e){let i=new Zs,s=new Tt,r=new Tt,o=new Me,a=new jo({depthPacking:xd}),c=new Qo,l={},h=e.maxTextureSize,u={[ui]:Ke,[Ke]:ui,[sn]:sn},f=new Bn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Tt},radius:{value:4}},vertexShader:py,fragmentShader:my}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let g=new Je;g.setAttribute("position",new Ze(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new K(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=wc;let d=this.type;this.render=function(E,A,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;let M=n.getRenderTarget(),y=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),U=n.state;U.setBlending(di),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);let z=d!==Jn&&this.type===Jn,G=d===Jn&&this.type!==Jn;for(let $=0,W=E.length;$<W;$++){let nt=E[$],H=nt.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",nt,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);let ot=H.getFrameExtents();if(s.multiply(ot),r.copy(H.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ot.x),s.x=r.x*ot.x,H.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ot.y),s.y=r.y*ot.y,H.mapSize.y=r.y)),H.map===null||z===!0||G===!0){let wt=this.type!==Jn?{minFilter:Sn,magFilter:Sn}:{};H.map!==null&&H.map.dispose(),H.map=new Yn(s.x,s.y,wt),H.map.texture.name=nt.name+".shadowMap",H.camera.updateProjectionMatrix()}n.setRenderTarget(H.map),n.clear();let ut=H.getViewportCount();for(let wt=0;wt<ut;wt++){let Wt=H.getViewport(wt);o.set(r.x*Wt.x,r.y*Wt.y,r.x*Wt.z,r.y*Wt.w),U.viewport(o),H.updateMatrices(nt,wt),i=H.getFrustum(),v(A,P,H.camera,nt,this.type)}H.isPointLightShadow!==!0&&this.type===Jn&&S(H,P),H.needsUpdate=!1}d=this.type,m.needsUpdate=!1,n.setRenderTarget(M,y,C)};function S(E,A){let P=t.update(_);f.defines.VSM_SAMPLES!==E.blurSamples&&(f.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Yn(s.x,s.y)),f.uniforms.shadow_pass.value=E.map.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(A,null,P,f,_,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(A,null,P,p,_,null)}function w(E,A,P,M){let y=null,C=P.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(C!==void 0)y=C;else if(y=P.isPointLight===!0?c:a,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let U=y.uuid,z=A.uuid,G=l[U];G===void 0&&(G={},l[U]=G);let $=G[z];$===void 0&&($=y.clone(),G[z]=$,A.addEventListener("dispose",T)),y=$}if(y.visible=A.visible,y.wireframe=A.wireframe,M===Jn?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:u[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,P.isPointLight===!0&&y.isMeshDistanceMaterial===!0){let U=n.properties.get(y);U.light=P}return y}function v(E,A,P,M,y){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&y===Jn)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,E.matrixWorld);let z=t.update(E),G=E.material;if(Array.isArray(G)){let $=z.groups;for(let W=0,nt=$.length;W<nt;W++){let H=$[W],ot=G[H.materialIndex];if(ot&&ot.visible){let ut=w(E,ot,M,y);E.onBeforeShadow(n,E,A,P,z,ut,H),n.renderBufferDirect(P,null,z,ut,E,H),E.onAfterShadow(n,E,A,P,z,ut,H)}}}else if(G.visible){let $=w(E,G,M,y);E.onBeforeShadow(n,E,A,P,z,$,null),n.renderBufferDirect(P,null,z,$,E,null),E.onAfterShadow(n,E,A,P,z,$,null)}}let U=E.children;for(let z=0,G=U.length;z<G;z++)v(U[z],A,P,M,y)}function T(E){E.target.removeEventListener("dispose",T);for(let P in l){let M=l[P],y=E.target.uuid;y in M&&(M[y].dispose(),delete M[y])}}}var _y={[ua]:da,[fa]:ga,[pa]:_a,[ns]:ma,[da]:ua,[ga]:fa,[_a]:pa,[ma]:ns};function xy(n,t){function e(){let L=!1,et=new Me,st=null,ft=new Me(0,0,0,0);return{setMask:function(j){st!==j&&!L&&(n.colorMask(j,j,j,j),st=j)},setLocked:function(j){L=j},setClear:function(j,Y,_t,Nt,he){he===!0&&(j*=Nt,Y*=Nt,_t*=Nt),et.set(j,Y,_t,Nt),ft.equals(et)===!1&&(n.clearColor(j,Y,_t,Nt),ft.copy(et))},reset:function(){L=!1,st=null,ft.set(-1,0,0,0)}}}function i(){let L=!1,et=!1,st=null,ft=null,j=null;return{setReversed:function(Y){if(et!==Y){let _t=t.get("EXT_clip_control");Y?_t.clipControlEXT(_t.LOWER_LEFT_EXT,_t.ZERO_TO_ONE_EXT):_t.clipControlEXT(_t.LOWER_LEFT_EXT,_t.NEGATIVE_ONE_TO_ONE_EXT),et=Y;let Nt=j;j=null,this.setClear(Nt)}},getReversed:function(){return et},setTest:function(Y){Y?J(n.DEPTH_TEST):mt(n.DEPTH_TEST)},setMask:function(Y){st!==Y&&!L&&(n.depthMask(Y),st=Y)},setFunc:function(Y){if(et&&(Y=_y[Y]),ft!==Y){switch(Y){case ua:n.depthFunc(n.NEVER);break;case da:n.depthFunc(n.ALWAYS);break;case fa:n.depthFunc(n.LESS);break;case ns:n.depthFunc(n.LEQUAL);break;case pa:n.depthFunc(n.EQUAL);break;case ma:n.depthFunc(n.GEQUAL);break;case ga:n.depthFunc(n.GREATER);break;case _a:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ft=Y}},setLocked:function(Y){L=Y},setClear:function(Y){j!==Y&&(et&&(Y=1-Y),n.clearDepth(Y),j=Y)},reset:function(){L=!1,st=null,ft=null,j=null,et=!1}}}function s(){let L=!1,et=null,st=null,ft=null,j=null,Y=null,_t=null,Nt=null,he=null;return{setTest:function(te){L||(te?J(n.STENCIL_TEST):mt(n.STENCIL_TEST))},setMask:function(te){et!==te&&!L&&(n.stencilMask(te),et=te)},setFunc:function(te,ii,Wn){(st!==te||ft!==ii||j!==Wn)&&(n.stencilFunc(te,ii,Wn),st=te,ft=ii,j=Wn)},setOp:function(te,ii,Wn){(Y!==te||_t!==ii||Nt!==Wn)&&(n.stencilOp(te,ii,Wn),Y=te,_t=ii,Nt=Wn)},setLocked:function(te){L=te},setClear:function(te){he!==te&&(n.clearStencil(te),he=te)},reset:function(){L=!1,et=null,st=null,ft=null,j=null,Y=null,_t=null,Nt=null,he=null}}}let r=new e,o=new i,a=new s,c=new WeakMap,l=new WeakMap,h={},u={},f=new WeakMap,p=[],g=null,_=!1,m=null,d=null,S=null,w=null,v=null,T=null,E=null,A=new Vt(0,0,0),P=0,M=!1,y=null,C=null,U=null,z=null,G=null,$=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),W=!1,nt=0,H=n.getParameter(n.VERSION);H.indexOf("WebGL")!==-1?(nt=parseFloat(/^WebGL (\d)/.exec(H)[1]),W=nt>=1):H.indexOf("OpenGL ES")!==-1&&(nt=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),W=nt>=2);let ot=null,ut={},wt=n.getParameter(n.SCISSOR_BOX),Wt=n.getParameter(n.VIEWPORT),ce=new Me().fromArray(wt),me=new Me().fromArray(Wt);function Qt(L,et,st,ft){let j=new Uint8Array(4),Y=n.createTexture();n.bindTexture(L,Y),n.texParameteri(L,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(L,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let _t=0;_t<st;_t++)L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY?n.texImage3D(et,0,n.RGBA,1,1,ft,0,n.RGBA,n.UNSIGNED_BYTE,j):n.texImage2D(et+_t,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,j);return Y}let q={};q[n.TEXTURE_2D]=Qt(n.TEXTURE_2D,n.TEXTURE_2D,1),q[n.TEXTURE_CUBE_MAP]=Qt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[n.TEXTURE_2D_ARRAY]=Qt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),q[n.TEXTURE_3D]=Qt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),J(n.DEPTH_TEST),o.setFunc(ns),Dt(!1),xt(Ec),J(n.CULL_FACE),ge(di);function J(L){h[L]!==!0&&(n.enable(L),h[L]=!0)}function mt(L){h[L]!==!1&&(n.disable(L),h[L]=!1)}function Ut(L,et){return u[L]!==et?(n.bindFramebuffer(L,et),u[L]=et,L===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=et),L===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=et),!0):!1}function Et(L,et){let st=p,ft=!1;if(L){st=f.get(et),st===void 0&&(st=[],f.set(et,st));let j=L.textures;if(st.length!==j.length||st[0]!==n.COLOR_ATTACHMENT0){for(let Y=0,_t=j.length;Y<_t;Y++)st[Y]=n.COLOR_ATTACHMENT0+Y;st.length=j.length,ft=!0}}else st[0]!==n.BACK&&(st[0]=n.BACK,ft=!0);ft&&n.drawBuffers(st)}function qt(L){return g!==L?(n.useProgram(L),g=L,!0):!1}let ze={[Ii]:n.FUNC_ADD,[Wu]:n.FUNC_SUBTRACT,[Xu]:n.FUNC_REVERSE_SUBTRACT};ze[$u]=n.MIN,ze[qu]=n.MAX;let I={[Yu]:n.ZERO,[Zu]:n.ONE,[Ju]:n.SRC_COLOR,[Go]:n.SRC_ALPHA,[nd]:n.SRC_ALPHA_SATURATE,[td]:n.DST_COLOR,[ju]:n.DST_ALPHA,[Ku]:n.ONE_MINUS_SRC_COLOR,[Wo]:n.ONE_MINUS_SRC_ALPHA,[ed]:n.ONE_MINUS_DST_COLOR,[Qu]:n.ONE_MINUS_DST_ALPHA,[id]:n.CONSTANT_COLOR,[sd]:n.ONE_MINUS_CONSTANT_COLOR,[rd]:n.CONSTANT_ALPHA,[od]:n.ONE_MINUS_CONSTANT_ALPHA};function ge(L,et,st,ft,j,Y,_t,Nt,he,te){if(L===di){_===!0&&(mt(n.BLEND),_=!1);return}if(_===!1&&(J(n.BLEND),_=!0),L!==Gu){if(L!==m||te!==M){if((d!==Ii||v!==Ii)&&(n.blendEquation(n.FUNC_ADD),d=Ii,v=Ii),te)switch(L){case es:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Tc:n.blendFunc(n.ONE,n.ONE);break;case Ac:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Rc:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case es:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Tc:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Ac:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Rc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}S=null,w=null,T=null,E=null,A.set(0,0,0),P=0,m=L,M=te}return}j=j||et,Y=Y||st,_t=_t||ft,(et!==d||j!==v)&&(n.blendEquationSeparate(ze[et],ze[j]),d=et,v=j),(st!==S||ft!==w||Y!==T||_t!==E)&&(n.blendFuncSeparate(I[st],I[ft],I[Y],I[_t]),S=st,w=ft,T=Y,E=_t),(Nt.equals(A)===!1||he!==P)&&(n.blendColor(Nt.r,Nt.g,Nt.b,he),A.copy(Nt),P=he),m=L,M=!1}function Ft(L,et){L.side===sn?mt(n.CULL_FACE):J(n.CULL_FACE);let st=L.side===Ke;et&&(st=!st),Dt(st),L.blending===es&&L.transparent===!1?ge(di):ge(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),o.setFunc(L.depthFunc),o.setTest(L.depthTest),o.setMask(L.depthWrite),r.setMask(L.colorWrite);let ft=L.stencilWrite;a.setTest(ft),ft&&(a.setMask(L.stencilWriteMask),a.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),a.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),yt(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?J(n.SAMPLE_ALPHA_TO_COVERAGE):mt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Dt(L){y!==L&&(L?n.frontFace(n.CW):n.frontFace(n.CCW),y=L)}function xt(L){L!==Hu?(J(n.CULL_FACE),L!==C&&(L===Ec?n.cullFace(n.BACK):L===Vu?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):mt(n.CULL_FACE),C=L}function _e(L){L!==U&&(W&&n.lineWidth(L),U=L)}function yt(L,et,st){L?(J(n.POLYGON_OFFSET_FILL),(z!==et||G!==st)&&(n.polygonOffset(et,st),z=et,G=st)):mt(n.POLYGON_OFFSET_FILL)}function zt(L){L?J(n.SCISSOR_TEST):mt(n.SCISSOR_TEST)}function De(L){L===void 0&&(L=n.TEXTURE0+$-1),ot!==L&&(n.activeTexture(L),ot=L)}function Ee(L,et,st){st===void 0&&(ot===null?st=n.TEXTURE0+$-1:st=ot);let ft=ut[st];ft===void 0&&(ft={type:void 0,texture:void 0},ut[st]=ft),(ft.type!==L||ft.texture!==et)&&(ot!==st&&(n.activeTexture(st),ot=st),n.bindTexture(L,et||q[L]),ft.type=L,ft.texture=et)}function R(){let L=ut[ot];L!==void 0&&L.type!==void 0&&(n.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function x(){try{n.compressedTexImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function O(){try{n.compressedTexImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function X(){try{n.texSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Z(){try{n.texSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function V(){try{n.compressedTexSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function bt(){try{n.compressedTexSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function it(){try{n.texStorage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function vt(){try{n.texStorage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Mt(){try{n.texImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function tt(){try{n.texImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ht(L){ce.equals(L)===!1&&(n.scissor(L.x,L.y,L.z,L.w),ce.copy(L))}function It(L){me.equals(L)===!1&&(n.viewport(L.x,L.y,L.z,L.w),me.copy(L))}function St(L,et){let st=l.get(et);st===void 0&&(st=new WeakMap,l.set(et,st));let ft=st.get(L);ft===void 0&&(ft=n.getUniformBlockIndex(et,L.name),st.set(L,ft))}function lt(L,et){let ft=l.get(et).get(L);c.get(et)!==ft&&(n.uniformBlockBinding(et,ft,L.__bindingPointIndex),c.set(et,ft))}function Bt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},ot=null,ut={},u={},f=new WeakMap,p=[],g=null,_=!1,m=null,d=null,S=null,w=null,v=null,T=null,E=null,A=new Vt(0,0,0),P=0,M=!1,y=null,C=null,U=null,z=null,G=null,ce.set(0,0,n.canvas.width,n.canvas.height),me.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:J,disable:mt,bindFramebuffer:Ut,drawBuffers:Et,useProgram:qt,setBlending:ge,setMaterial:Ft,setFlipSided:Dt,setCullFace:xt,setLineWidth:_e,setPolygonOffset:yt,setScissorTest:zt,activeTexture:De,bindTexture:Ee,unbindTexture:R,compressedTexImage2D:x,compressedTexImage3D:O,texImage2D:Mt,texImage3D:tt,updateUBOMapping:St,uniformBlockBinding:lt,texStorage2D:it,texStorage3D:vt,texSubImage2D:X,texSubImage3D:Z,compressedTexSubImage2D:V,compressedTexSubImage3D:bt,scissor:ht,viewport:It,reset:Bt}}function yy(n,t,e,i,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Tt,h=new WeakMap,u,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,x){return p?new OffscreenCanvas(R,x):Rr("canvas")}function _(R,x,O){let X=1,Z=Ee(R);if((Z.width>O||Z.height>O)&&(X=O/Math.max(Z.width,Z.height)),X<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let V=Math.floor(X*Z.width),bt=Math.floor(X*Z.height);u===void 0&&(u=g(V,bt));let it=x?g(V,bt):u;return it.width=V,it.height=bt,it.getContext("2d").drawImage(R,0,0,V,bt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+V+"x"+bt+")."),it}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),R;return R}function m(R){return R.generateMipmaps}function d(R){n.generateMipmap(R)}function S(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function w(R,x,O,X,Z=!1){if(R!==null){if(n[R]!==void 0)return n[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let V=x;if(x===n.RED&&(O===n.FLOAT&&(V=n.R32F),O===n.HALF_FLOAT&&(V=n.R16F),O===n.UNSIGNED_BYTE&&(V=n.R8)),x===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&(V=n.R8UI),O===n.UNSIGNED_SHORT&&(V=n.R16UI),O===n.UNSIGNED_INT&&(V=n.R32UI),O===n.BYTE&&(V=n.R8I),O===n.SHORT&&(V=n.R16I),O===n.INT&&(V=n.R32I)),x===n.RG&&(O===n.FLOAT&&(V=n.RG32F),O===n.HALF_FLOAT&&(V=n.RG16F),O===n.UNSIGNED_BYTE&&(V=n.RG8)),x===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&(V=n.RG8UI),O===n.UNSIGNED_SHORT&&(V=n.RG16UI),O===n.UNSIGNED_INT&&(V=n.RG32UI),O===n.BYTE&&(V=n.RG8I),O===n.SHORT&&(V=n.RG16I),O===n.INT&&(V=n.RG32I)),x===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&(V=n.RGB8UI),O===n.UNSIGNED_SHORT&&(V=n.RGB16UI),O===n.UNSIGNED_INT&&(V=n.RGB32UI),O===n.BYTE&&(V=n.RGB8I),O===n.SHORT&&(V=n.RGB16I),O===n.INT&&(V=n.RGB32I)),x===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&(V=n.RGBA8UI),O===n.UNSIGNED_SHORT&&(V=n.RGBA16UI),O===n.UNSIGNED_INT&&(V=n.RGBA32UI),O===n.BYTE&&(V=n.RGBA8I),O===n.SHORT&&(V=n.RGBA16I),O===n.INT&&(V=n.RGBA32I)),x===n.RGB&&(O===n.UNSIGNED_INT_5_9_9_9_REV&&(V=n.RGB9_E5),O===n.UNSIGNED_INT_10F_11F_11F_REV&&(V=n.R11F_G11F_B10F)),x===n.RGBA){let bt=Z?Tr:Yt.getTransfer(X);O===n.FLOAT&&(V=n.RGBA32F),O===n.HALF_FLOAT&&(V=n.RGBA16F),O===n.UNSIGNED_BYTE&&(V=bt===ee?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT_4_4_4_4&&(V=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&(V=n.RGB5_A1)}return(V===n.R16F||V===n.R32F||V===n.RG16F||V===n.RG32F||V===n.RGBA16F||V===n.RGBA32F)&&t.get("EXT_color_buffer_float"),V}function v(R,x){let O;return R?x===null||x===Fi||x===tr?O=n.DEPTH24_STENCIL8:x===Kn?O=n.DEPTH32F_STENCIL8:x===js&&(O=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Fi||x===tr?O=n.DEPTH_COMPONENT24:x===Kn?O=n.DEPTH_COMPONENT32F:x===js&&(O=n.DEPTH_COMPONENT16),O}function T(R,x){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Sn&&R.minFilter!==Fn?Math.log2(Math.max(x.width,x.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?x.mipmaps.length:1}function E(R){let x=R.target;x.removeEventListener("dispose",E),P(x),x.isVideoTexture&&h.delete(x)}function A(R){let x=R.target;x.removeEventListener("dispose",A),y(x)}function P(R){let x=i.get(R);if(x.__webglInit===void 0)return;let O=R.source,X=f.get(O);if(X){let Z=X[x.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&M(R),Object.keys(X).length===0&&f.delete(O)}i.remove(R)}function M(R){let x=i.get(R);n.deleteTexture(x.__webglTexture);let O=R.source,X=f.get(O);delete X[x.__cacheKey],o.memory.textures--}function y(R){let x=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(x.__webglFramebuffer[X]))for(let Z=0;Z<x.__webglFramebuffer[X].length;Z++)n.deleteFramebuffer(x.__webglFramebuffer[X][Z]);else n.deleteFramebuffer(x.__webglFramebuffer[X]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[X])}else{if(Array.isArray(x.__webglFramebuffer))for(let X=0;X<x.__webglFramebuffer.length;X++)n.deleteFramebuffer(x.__webglFramebuffer[X]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let X=0;X<x.__webglColorRenderbuffer.length;X++)x.__webglColorRenderbuffer[X]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[X]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let O=R.textures;for(let X=0,Z=O.length;X<Z;X++){let V=i.get(O[X]);V.__webglTexture&&(n.deleteTexture(V.__webglTexture),o.memory.textures--),i.remove(O[X])}i.remove(R)}let C=0;function U(){C=0}function z(){let R=C;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),C+=1,R}function G(R){let x=[];return x.push(R.wrapS),x.push(R.wrapT),x.push(R.wrapR||0),x.push(R.magFilter),x.push(R.minFilter),x.push(R.anisotropy),x.push(R.internalFormat),x.push(R.format),x.push(R.type),x.push(R.generateMipmaps),x.push(R.premultiplyAlpha),x.push(R.flipY),x.push(R.unpackAlignment),x.push(R.colorSpace),x.join()}function $(R,x){let O=i.get(R);if(R.isVideoTexture&&zt(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&O.__version!==R.version){let X=R.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(O,R,x);return}}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+x)}function W(R,x){let O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){q(O,R,x);return}e.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+x)}function nt(R,x){let O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){q(O,R,x);return}e.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+x)}function H(R,x){let O=i.get(R);if(R.version>0&&O.__version!==R.version){J(O,R,x);return}e.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+x)}let ot={[is]:n.REPEAT,[Ci]:n.CLAMP_TO_EDGE,[Xo]:n.MIRRORED_REPEAT},ut={[Sn]:n.NEAREST,[gd]:n.NEAREST_MIPMAP_NEAREST,[Zr]:n.NEAREST_MIPMAP_LINEAR,[Fn]:n.LINEAR,[va]:n.LINEAR_MIPMAP_NEAREST,[Ni]:n.LINEAR_MIPMAP_LINEAR},wt={[vd]:n.NEVER,[Td]:n.ALWAYS,[Md]:n.LESS,[zc]:n.LEQUAL,[Sd]:n.EQUAL,[wd]:n.GEQUAL,[bd]:n.GREATER,[Ed]:n.NOTEQUAL};function Wt(R,x){if(x.type===Kn&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===Fn||x.magFilter===va||x.magFilter===Zr||x.magFilter===Ni||x.minFilter===Fn||x.minFilter===va||x.minFilter===Zr||x.minFilter===Ni)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,ot[x.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,ot[x.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,ot[x.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,ut[x.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,ut[x.minFilter]),x.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,wt[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Sn||x.minFilter!==Zr&&x.minFilter!==Ni||x.type===Kn&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){let O=t.get("EXT_texture_filter_anisotropic");n.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function ce(R,x){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,x.addEventListener("dispose",E));let X=x.source,Z=f.get(X);Z===void 0&&(Z={},f.set(X,Z));let V=G(x);if(V!==R.__cacheKey){Z[V]===void 0&&(Z[V]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,O=!0),Z[V].usedTimes++;let bt=Z[R.__cacheKey];bt!==void 0&&(Z[R.__cacheKey].usedTimes--,bt.usedTimes===0&&M(x)),R.__cacheKey=V,R.__webglTexture=Z[V].texture}return O}function me(R,x,O){return Math.floor(Math.floor(R/O)/x)}function Qt(R,x,O,X){let V=R.updateRanges;if(V.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,x.width,x.height,O,X,x.data);else{V.sort((tt,ht)=>tt.start-ht.start);let bt=0;for(let tt=1;tt<V.length;tt++){let ht=V[bt],It=V[tt],St=ht.start+ht.count,lt=me(It.start,x.width,4),Bt=me(ht.start,x.width,4);It.start<=St+1&&lt===Bt&&me(It.start+It.count-1,x.width,4)===lt?ht.count=Math.max(ht.count,It.start+It.count-ht.start):(++bt,V[bt]=It)}V.length=bt+1;let it=n.getParameter(n.UNPACK_ROW_LENGTH),vt=n.getParameter(n.UNPACK_SKIP_PIXELS),Mt=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,x.width);for(let tt=0,ht=V.length;tt<ht;tt++){let It=V[tt],St=Math.floor(It.start/4),lt=Math.ceil(It.count/4),Bt=St%x.width,L=Math.floor(St/x.width),et=lt,st=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Bt),n.pixelStorei(n.UNPACK_SKIP_ROWS,L),e.texSubImage2D(n.TEXTURE_2D,0,Bt,L,et,st,O,X,x.data)}R.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,it),n.pixelStorei(n.UNPACK_SKIP_PIXELS,vt),n.pixelStorei(n.UNPACK_SKIP_ROWS,Mt)}}function q(R,x,O){let X=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(X=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(X=n.TEXTURE_3D);let Z=ce(R,x),V=x.source;e.bindTexture(X,R.__webglTexture,n.TEXTURE0+O);let bt=i.get(V);if(V.version!==bt.__version||Z===!0){e.activeTexture(n.TEXTURE0+O);let it=Yt.getPrimaries(Yt.workingColorSpace),vt=x.colorSpace===pi?null:Yt.getPrimaries(x.colorSpace),Mt=x.colorSpace===pi||it===vt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Mt);let tt=_(x.image,!1,s.maxTextureSize);tt=De(x,tt);let ht=r.convert(x.format,x.colorSpace),It=r.convert(x.type),St=w(x.internalFormat,ht,It,x.colorSpace,x.isVideoTexture);Wt(X,x);let lt,Bt=x.mipmaps,L=x.isVideoTexture!==!0,et=bt.__version===void 0||Z===!0,st=V.dataReady,ft=T(x,tt);if(x.isDepthTexture)St=v(x.format===er,x.type),et&&(L?e.texStorage2D(n.TEXTURE_2D,1,St,tt.width,tt.height):e.texImage2D(n.TEXTURE_2D,0,St,tt.width,tt.height,0,ht,It,null));else if(x.isDataTexture)if(Bt.length>0){L&&et&&e.texStorage2D(n.TEXTURE_2D,ft,St,Bt[0].width,Bt[0].height);for(let j=0,Y=Bt.length;j<Y;j++)lt=Bt[j],L?st&&e.texSubImage2D(n.TEXTURE_2D,j,0,0,lt.width,lt.height,ht,It,lt.data):e.texImage2D(n.TEXTURE_2D,j,St,lt.width,lt.height,0,ht,It,lt.data);x.generateMipmaps=!1}else L?(et&&e.texStorage2D(n.TEXTURE_2D,ft,St,tt.width,tt.height),st&&Qt(x,tt,ht,It)):e.texImage2D(n.TEXTURE_2D,0,St,tt.width,tt.height,0,ht,It,tt.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){L&&et&&e.texStorage3D(n.TEXTURE_2D_ARRAY,ft,St,Bt[0].width,Bt[0].height,tt.depth);for(let j=0,Y=Bt.length;j<Y;j++)if(lt=Bt[j],x.format!==Tn)if(ht!==null)if(L){if(st)if(x.layerUpdates.size>0){let _t=qc(lt.width,lt.height,x.format,x.type);for(let Nt of x.layerUpdates){let he=lt.data.subarray(Nt*_t/lt.data.BYTES_PER_ELEMENT,(Nt+1)*_t/lt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,Nt,lt.width,lt.height,1,ht,he)}x.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,0,lt.width,lt.height,tt.depth,ht,lt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,j,St,lt.width,lt.height,tt.depth,0,lt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?st&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,0,lt.width,lt.height,tt.depth,ht,It,lt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,j,St,lt.width,lt.height,tt.depth,0,ht,It,lt.data)}else{L&&et&&e.texStorage2D(n.TEXTURE_2D,ft,St,Bt[0].width,Bt[0].height);for(let j=0,Y=Bt.length;j<Y;j++)lt=Bt[j],x.format!==Tn?ht!==null?L?st&&e.compressedTexSubImage2D(n.TEXTURE_2D,j,0,0,lt.width,lt.height,ht,lt.data):e.compressedTexImage2D(n.TEXTURE_2D,j,St,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?st&&e.texSubImage2D(n.TEXTURE_2D,j,0,0,lt.width,lt.height,ht,It,lt.data):e.texImage2D(n.TEXTURE_2D,j,St,lt.width,lt.height,0,ht,It,lt.data)}else if(x.isDataArrayTexture)if(L){if(et&&e.texStorage3D(n.TEXTURE_2D_ARRAY,ft,St,tt.width,tt.height,tt.depth),st)if(x.layerUpdates.size>0){let j=qc(tt.width,tt.height,x.format,x.type);for(let Y of x.layerUpdates){let _t=tt.data.subarray(Y*j/tt.data.BYTES_PER_ELEMENT,(Y+1)*j/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Y,tt.width,tt.height,1,ht,It,_t)}x.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,ht,It,tt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,St,tt.width,tt.height,tt.depth,0,ht,It,tt.data);else if(x.isData3DTexture)L?(et&&e.texStorage3D(n.TEXTURE_3D,ft,St,tt.width,tt.height,tt.depth),st&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,ht,It,tt.data)):e.texImage3D(n.TEXTURE_3D,0,St,tt.width,tt.height,tt.depth,0,ht,It,tt.data);else if(x.isFramebufferTexture){if(et)if(L)e.texStorage2D(n.TEXTURE_2D,ft,St,tt.width,tt.height);else{let j=tt.width,Y=tt.height;for(let _t=0;_t<ft;_t++)e.texImage2D(n.TEXTURE_2D,_t,St,j,Y,0,ht,It,null),j>>=1,Y>>=1}}else if(Bt.length>0){if(L&&et){let j=Ee(Bt[0]);e.texStorage2D(n.TEXTURE_2D,ft,St,j.width,j.height)}for(let j=0,Y=Bt.length;j<Y;j++)lt=Bt[j],L?st&&e.texSubImage2D(n.TEXTURE_2D,j,0,0,ht,It,lt):e.texImage2D(n.TEXTURE_2D,j,St,ht,It,lt);x.generateMipmaps=!1}else if(L){if(et){let j=Ee(tt);e.texStorage2D(n.TEXTURE_2D,ft,St,j.width,j.height)}st&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,ht,It,tt)}else e.texImage2D(n.TEXTURE_2D,0,St,ht,It,tt);m(x)&&d(X),bt.__version=V.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function J(R,x,O){if(x.image.length!==6)return;let X=ce(R,x),Z=x.source;e.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+O);let V=i.get(Z);if(Z.version!==V.__version||X===!0){e.activeTexture(n.TEXTURE0+O);let bt=Yt.getPrimaries(Yt.workingColorSpace),it=x.colorSpace===pi?null:Yt.getPrimaries(x.colorSpace),vt=x.colorSpace===pi||bt===it?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);let Mt=x.isCompressedTexture||x.image[0].isCompressedTexture,tt=x.image[0]&&x.image[0].isDataTexture,ht=[];for(let Y=0;Y<6;Y++)!Mt&&!tt?ht[Y]=_(x.image[Y],!0,s.maxCubemapSize):ht[Y]=tt?x.image[Y].image:x.image[Y],ht[Y]=De(x,ht[Y]);let It=ht[0],St=r.convert(x.format,x.colorSpace),lt=r.convert(x.type),Bt=w(x.internalFormat,St,lt,x.colorSpace),L=x.isVideoTexture!==!0,et=V.__version===void 0||X===!0,st=Z.dataReady,ft=T(x,It);Wt(n.TEXTURE_CUBE_MAP,x);let j;if(Mt){L&&et&&e.texStorage2D(n.TEXTURE_CUBE_MAP,ft,Bt,It.width,It.height);for(let Y=0;Y<6;Y++){j=ht[Y].mipmaps;for(let _t=0;_t<j.length;_t++){let Nt=j[_t];x.format!==Tn?St!==null?L?st&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,_t,0,0,Nt.width,Nt.height,St,Nt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,_t,Bt,Nt.width,Nt.height,0,Nt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?st&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,_t,0,0,Nt.width,Nt.height,St,lt,Nt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,_t,Bt,Nt.width,Nt.height,0,St,lt,Nt.data)}}}else{if(j=x.mipmaps,L&&et){j.length>0&&ft++;let Y=Ee(ht[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,ft,Bt,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(tt){L?st&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,ht[Y].width,ht[Y].height,St,lt,ht[Y].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Bt,ht[Y].width,ht[Y].height,0,St,lt,ht[Y].data);for(let _t=0;_t<j.length;_t++){let he=j[_t].image[Y].image;L?st&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,_t+1,0,0,he.width,he.height,St,lt,he.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,_t+1,Bt,he.width,he.height,0,St,lt,he.data)}}else{L?st&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,St,lt,ht[Y]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Bt,St,lt,ht[Y]);for(let _t=0;_t<j.length;_t++){let Nt=j[_t];L?st&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,_t+1,0,0,St,lt,Nt.image[Y]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,_t+1,Bt,St,lt,Nt.image[Y])}}}m(x)&&d(n.TEXTURE_CUBE_MAP),V.__version=Z.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function mt(R,x,O,X,Z,V){let bt=r.convert(O.format,O.colorSpace),it=r.convert(O.type),vt=w(O.internalFormat,bt,it,O.colorSpace),Mt=i.get(x),tt=i.get(O);if(tt.__renderTarget=x,!Mt.__hasExternalTextures){let ht=Math.max(1,x.width>>V),It=Math.max(1,x.height>>V);Z===n.TEXTURE_3D||Z===n.TEXTURE_2D_ARRAY?e.texImage3D(Z,V,vt,ht,It,x.depth,0,bt,it,null):e.texImage2D(Z,V,vt,ht,It,0,bt,it,null)}e.bindFramebuffer(n.FRAMEBUFFER,R),yt(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,X,Z,tt.__webglTexture,0,_e(x)):(Z===n.TEXTURE_2D||Z>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,X,Z,tt.__webglTexture,V),e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ut(R,x,O){if(n.bindRenderbuffer(n.RENDERBUFFER,R),x.depthBuffer){let X=x.depthTexture,Z=X&&X.isDepthTexture?X.type:null,V=v(x.stencilBuffer,Z),bt=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,it=_e(x);yt(x)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,it,V,x.width,x.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,it,V,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,V,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,bt,n.RENDERBUFFER,R)}else{let X=x.textures;for(let Z=0;Z<X.length;Z++){let V=X[Z],bt=r.convert(V.format,V.colorSpace),it=r.convert(V.type),vt=w(V.internalFormat,bt,it,V.colorSpace),Mt=_e(x);O&&yt(x)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Mt,vt,x.width,x.height):yt(x)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Mt,vt,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,vt,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Et(R,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,R),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let X=i.get(x.depthTexture);X.__renderTarget=x,(!X.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),$(x.depthTexture,0);let Z=X.__webglTexture,V=_e(x);if(x.depthTexture.format===Vs)yt(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Z,0,V):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Z,0);else if(x.depthTexture.format===er)yt(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Z,0,V):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Z,0);else throw new Error("Unknown depthTexture format")}function qt(R){let x=i.get(R),O=R.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==R.depthTexture){let X=R.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),X){let Z=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,X.removeEventListener("dispose",Z)};X.addEventListener("dispose",Z),x.__depthDisposeCallback=Z}x.__boundDepthTexture=X}if(R.depthTexture&&!x.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");let X=R.texture.mipmaps;X&&X.length>0?Et(x.__webglFramebuffer[0],R):Et(x.__webglFramebuffer,R)}else if(O){x.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[X]),x.__webglDepthbuffer[X]===void 0)x.__webglDepthbuffer[X]=n.createRenderbuffer(),Ut(x.__webglDepthbuffer[X],R,!1);else{let Z=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,V=x.__webglDepthbuffer[X];n.bindRenderbuffer(n.RENDERBUFFER,V),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,V)}}else{let X=R.texture.mipmaps;if(X&&X.length>0?e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),Ut(x.__webglDepthbuffer,R,!1);else{let Z=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,V=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,V),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,V)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function ze(R,x,O){let X=i.get(R);x!==void 0&&mt(X.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&qt(R)}function I(R){let x=R.texture,O=i.get(R),X=i.get(x);R.addEventListener("dispose",A);let Z=R.textures,V=R.isWebGLCubeRenderTarget===!0,bt=Z.length>1;if(bt||(X.__webglTexture===void 0&&(X.__webglTexture=n.createTexture()),X.__version=x.version,o.memory.textures++),V){O.__webglFramebuffer=[];for(let it=0;it<6;it++)if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer[it]=[];for(let vt=0;vt<x.mipmaps.length;vt++)O.__webglFramebuffer[it][vt]=n.createFramebuffer()}else O.__webglFramebuffer[it]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer=[];for(let it=0;it<x.mipmaps.length;it++)O.__webglFramebuffer[it]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(bt)for(let it=0,vt=Z.length;it<vt;it++){let Mt=i.get(Z[it]);Mt.__webglTexture===void 0&&(Mt.__webglTexture=n.createTexture(),o.memory.textures++)}if(R.samples>0&&yt(R)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let it=0;it<Z.length;it++){let vt=Z[it];O.__webglColorRenderbuffer[it]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[it]);let Mt=r.convert(vt.format,vt.colorSpace),tt=r.convert(vt.type),ht=w(vt.internalFormat,Mt,tt,vt.colorSpace,R.isXRRenderTarget===!0),It=_e(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,It,ht,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+it,n.RENDERBUFFER,O.__webglColorRenderbuffer[it])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),Ut(O.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(V){e.bindTexture(n.TEXTURE_CUBE_MAP,X.__webglTexture),Wt(n.TEXTURE_CUBE_MAP,x);for(let it=0;it<6;it++)if(x.mipmaps&&x.mipmaps.length>0)for(let vt=0;vt<x.mipmaps.length;vt++)mt(O.__webglFramebuffer[it][vt],R,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+it,vt);else mt(O.__webglFramebuffer[it],R,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+it,0);m(x)&&d(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(bt){for(let it=0,vt=Z.length;it<vt;it++){let Mt=Z[it],tt=i.get(Mt),ht=n.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ht=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(ht,tt.__webglTexture),Wt(ht,Mt),mt(O.__webglFramebuffer,R,Mt,n.COLOR_ATTACHMENT0+it,ht,0),m(Mt)&&d(ht)}e.unbindTexture()}else{let it=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(it=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(it,X.__webglTexture),Wt(it,x),x.mipmaps&&x.mipmaps.length>0)for(let vt=0;vt<x.mipmaps.length;vt++)mt(O.__webglFramebuffer[vt],R,x,n.COLOR_ATTACHMENT0,it,vt);else mt(O.__webglFramebuffer,R,x,n.COLOR_ATTACHMENT0,it,0);m(x)&&d(it),e.unbindTexture()}R.depthBuffer&&qt(R)}function ge(R){let x=R.textures;for(let O=0,X=x.length;O<X;O++){let Z=x[O];if(m(Z)){let V=S(R),bt=i.get(Z).__webglTexture;e.bindTexture(V,bt),d(V),e.unbindTexture()}}}let Ft=[],Dt=[];function xt(R){if(R.samples>0){if(yt(R)===!1){let x=R.textures,O=R.width,X=R.height,Z=n.COLOR_BUFFER_BIT,V=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,bt=i.get(R),it=x.length>1;if(it)for(let Mt=0;Mt<x.length;Mt++)e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Mt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Mt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,bt.__webglMultisampledFramebuffer);let vt=R.texture.mipmaps;vt&&vt.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,bt.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,bt.__webglFramebuffer);for(let Mt=0;Mt<x.length;Mt++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(Z|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(Z|=n.STENCIL_BUFFER_BIT)),it){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,bt.__webglColorRenderbuffer[Mt]);let tt=i.get(x[Mt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,tt,0)}n.blitFramebuffer(0,0,O,X,0,0,O,X,Z,n.NEAREST),c===!0&&(Ft.length=0,Dt.length=0,Ft.push(n.COLOR_ATTACHMENT0+Mt),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Ft.push(V),Dt.push(V),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Dt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Ft))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),it)for(let Mt=0;Mt<x.length;Mt++){e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Mt,n.RENDERBUFFER,bt.__webglColorRenderbuffer[Mt]);let tt=i.get(x[Mt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Mt,n.TEXTURE_2D,tt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,bt.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){let x=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function _e(R){return Math.min(s.maxSamples,R.samples)}function yt(R){let x=i.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function zt(R){let x=o.render.frame;h.get(R)!==x&&(h.set(R,x),R.update())}function De(R,x){let O=R.colorSpace,X=R.format,Z=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==ss&&O!==pi&&(Yt.getTransfer(O)===ee?(X!==Tn||Z!==zn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),x}function Ee(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=U,this.setTexture2D=$,this.setTexture2DArray=W,this.setTexture3D=nt,this.setTextureCube=H,this.rebindTextures=ze,this.setupRenderTarget=I,this.updateRenderTargetMipmap=ge,this.updateMultisampleRenderTarget=xt,this.setupDepthRenderbuffer=qt,this.setupFrameBufferTexture=mt,this.useMultisampledRTT=yt}function vy(n,t){function e(i,s=pi){let r,o=Yt.getTransfer(s);if(i===zn)return n.UNSIGNED_BYTE;if(i===Sa)return n.UNSIGNED_SHORT_4_4_4_4;if(i===ba)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Lc)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Uc)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Pc)return n.BYTE;if(i===Dc)return n.SHORT;if(i===js)return n.UNSIGNED_SHORT;if(i===Ma)return n.INT;if(i===Fi)return n.UNSIGNED_INT;if(i===Kn)return n.FLOAT;if(i===Qs)return n.HALF_FLOAT;if(i===Nc)return n.ALPHA;if(i===Fc)return n.RGB;if(i===Tn)return n.RGBA;if(i===Vs)return n.DEPTH_COMPONENT;if(i===er)return n.DEPTH_STENCIL;if(i===Oc)return n.RED;if(i===Ea)return n.RED_INTEGER;if(i===Bc)return n.RG;if(i===wa)return n.RG_INTEGER;if(i===Ta)return n.RGBA_INTEGER;if(i===Jr||i===Kr||i===jr||i===Qr)if(o===ee)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Jr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Kr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===jr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Qr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Jr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Kr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===jr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Qr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Aa||i===Ra||i===Ca||i===Ia)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Aa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ra)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ca)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ia)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Pa||i===Da||i===La)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Pa||i===Da)return o===ee?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===La)return o===ee?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Ua||i===Na||i===Fa||i===Oa||i===Ba||i===ka||i===za||i===Ha||i===Va||i===Ga||i===Wa||i===Xa||i===$a||i===qa)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Ua)return o===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Na)return o===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Fa)return o===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Oa)return o===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ba)return o===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ka)return o===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===za)return o===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ha)return o===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Va)return o===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ga)return o===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Wa)return o===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Xa)return o===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===$a)return o===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===qa)return o===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ya||i===Za||i===Ja)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===Ya)return o===ee?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Za)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ja)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Ka||i===ja||i===Qa||i===tl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===Ka)return r.COMPRESSED_RED_RGTC1_EXT;if(i===ja)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Qa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===tl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===tr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}var My=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Sy=`
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

}`,oh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let i=new Fr(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,i=new Bn({vertexShader:My,fragmentShader:Sy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new K(new En(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},ah=class extends qn{constructor(t,e){super();let i=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,f=null,p=null,g=null,_=typeof XRWebGLBinding<"u",m=new oh,d={},S=e.getContextAttributes(),w=null,v=null,T=[],E=[],A=new Tt,P=null,M=new We;M.viewport=new Me;let y=new We;y.viewport=new Me;let C=[M,y],U=new ca,z=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let J=T[q];return J===void 0&&(J=new Ys,T[q]=J),J.getTargetRaySpace()},this.getControllerGrip=function(q){let J=T[q];return J===void 0&&(J=new Ys,T[q]=J),J.getGripSpace()},this.getHand=function(q){let J=T[q];return J===void 0&&(J=new Ys,T[q]=J),J.getHandSpace()};function $(q){let J=E.indexOf(q.inputSource);if(J===-1)return;let mt=T[J];mt!==void 0&&(mt.update(q.inputSource,q.frame,l||o),mt.dispatchEvent({type:q.type,data:q.inputSource}))}function W(){s.removeEventListener("select",$),s.removeEventListener("selectstart",$),s.removeEventListener("selectend",$),s.removeEventListener("squeeze",$),s.removeEventListener("squeezestart",$),s.removeEventListener("squeezeend",$),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",nt);for(let q=0;q<T.length;q++){let J=E[q];J!==null&&(E[q]=null,T[q].disconnect(J))}z=null,G=null,m.reset();for(let q in d)delete d[q];t.setRenderTarget(w),p=null,f=null,u=null,s=null,v=null,Qt.stop(),i.isPresenting=!1,t.setPixelRatio(P),t.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){a=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(q){l=q},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(w=t.getRenderTarget(),s.addEventListener("select",$),s.addEventListener("selectstart",$),s.addEventListener("selectend",$),s.addEventListener("squeeze",$),s.addEventListener("squeezestart",$),s.addEventListener("squeezeend",$),s.addEventListener("end",W),s.addEventListener("inputsourceschange",nt),S.xrCompatible!==!0&&await e.makeXRCompatible(),P=t.getPixelRatio(),t.getSize(A),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let mt=null,Ut=null,Et=null;S.depth&&(Et=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,mt=S.stencil?er:Vs,Ut=S.stencil?tr:Fi);let qt={colorFormat:e.RGBA8,depthFormat:Et,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(qt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),v=new Yn(f.textureWidth,f.textureHeight,{format:Tn,type:zn,depthTexture:new Nr(f.textureWidth,f.textureHeight,Ut,void 0,void 0,void 0,void 0,void 0,void 0,mt),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let mt={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,mt),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new Yn(p.framebufferWidth,p.framebufferHeight,{format:Tn,type:zn,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Qt.setContext(s),Qt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function nt(q){for(let J=0;J<q.removed.length;J++){let mt=q.removed[J],Ut=E.indexOf(mt);Ut>=0&&(E[Ut]=null,T[Ut].disconnect(mt))}for(let J=0;J<q.added.length;J++){let mt=q.added[J],Ut=E.indexOf(mt);if(Ut===-1){for(let qt=0;qt<T.length;qt++)if(qt>=E.length){E.push(mt),Ut=qt;break}else if(E[qt]===null){E[qt]=mt,Ut=qt;break}if(Ut===-1)break}let Et=T[Ut];Et&&Et.connect(mt)}}let H=new D,ot=new D;function ut(q,J,mt){H.setFromMatrixPosition(J.matrixWorld),ot.setFromMatrixPosition(mt.matrixWorld);let Ut=H.distanceTo(ot),Et=J.projectionMatrix.elements,qt=mt.projectionMatrix.elements,ze=Et[14]/(Et[10]-1),I=Et[14]/(Et[10]+1),ge=(Et[9]+1)/Et[5],Ft=(Et[9]-1)/Et[5],Dt=(Et[8]-1)/Et[0],xt=(qt[8]+1)/qt[0],_e=ze*Dt,yt=ze*xt,zt=Ut/(-Dt+xt),De=zt*-Dt;if(J.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(De),q.translateZ(zt),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Et[10]===-1)q.projectionMatrix.copy(J.projectionMatrix),q.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{let Ee=ze+zt,R=I+zt,x=_e-De,O=yt+(Ut-De),X=ge*I/R*Ee,Z=Ft*I/R*Ee;q.projectionMatrix.makePerspective(x,O,X,Z,Ee,R),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function wt(q,J){J===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(J.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let J=q.near,mt=q.far;m.texture!==null&&(m.depthNear>0&&(J=m.depthNear),m.depthFar>0&&(mt=m.depthFar)),U.near=y.near=M.near=J,U.far=y.far=M.far=mt,(z!==U.near||G!==U.far)&&(s.updateRenderState({depthNear:U.near,depthFar:U.far}),z=U.near,G=U.far),U.layers.mask=q.layers.mask|6,M.layers.mask=U.layers.mask&3,y.layers.mask=U.layers.mask&5;let Ut=q.parent,Et=U.cameras;wt(U,Ut);for(let qt=0;qt<Et.length;qt++)wt(Et[qt],Ut);Et.length===2?ut(U,M,y):U.projectionMatrix.copy(M.projectionMatrix),Wt(q,U,Ut)};function Wt(q,J,mt){mt===null?q.matrix.copy(J.matrixWorld):(q.matrix.copy(mt.matrixWorld),q.matrix.invert(),q.matrix.multiply(J.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(J.projectionMatrix),q.projectionMatrixInverse.copy(J.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Gs*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(q){c=q,f!==null&&(f.fixedFoveation=q),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(U)},this.getCameraTexture=function(q){return d[q]};let ce=null;function me(q,J){if(h=J.getViewerPose(l||o),g=J,h!==null){let mt=h.views;p!==null&&(t.setRenderTargetFramebuffer(v,p.framebuffer),t.setRenderTarget(v));let Ut=!1;mt.length!==U.cameras.length&&(U.cameras.length=0,Ut=!0);for(let I=0;I<mt.length;I++){let ge=mt[I],Ft=null;if(p!==null)Ft=p.getViewport(ge);else{let xt=u.getViewSubImage(f,ge);Ft=xt.viewport,I===0&&(t.setRenderTargetTextures(v,xt.colorTexture,xt.depthStencilTexture),t.setRenderTarget(v))}let Dt=C[I];Dt===void 0&&(Dt=new We,Dt.layers.enable(I),Dt.viewport=new Me,C[I]=Dt),Dt.matrix.fromArray(ge.transform.matrix),Dt.matrix.decompose(Dt.position,Dt.quaternion,Dt.scale),Dt.projectionMatrix.fromArray(ge.projectionMatrix),Dt.projectionMatrixInverse.copy(Dt.projectionMatrix).invert(),Dt.viewport.set(Ft.x,Ft.y,Ft.width,Ft.height),I===0&&(U.matrix.copy(Dt.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),Ut===!0&&U.cameras.push(Dt)}let Et=s.enabledFeatures;if(Et&&Et.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=i.getBinding();let I=u.getDepthInformation(mt[0]);I&&I.isValid&&I.texture&&m.init(I,s.renderState)}if(Et&&Et.includes("camera-access")&&_){t.state.unbindTexture(),u=i.getBinding();for(let I=0;I<mt.length;I++){let ge=mt[I].camera;if(ge){let Ft=d[ge];Ft||(Ft=new Fr,d[ge]=Ft);let Dt=u.getCameraImage(ge);Ft.sourceTexture=Dt}}}}for(let mt=0;mt<T.length;mt++){let Ut=E[mt],Et=T[mt];Ut!==null&&Et!==void 0&&Et.update(Ut,J,l||o)}ce&&ce(q,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),g=null}let Qt=new ef;Qt.setAnimationLoop(me),this.setAnimationLoop=function(q){ce=q},this.dispose=function(){}}},fs=new On,by=new pe;function Ey(n,t){function e(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function i(m,d){d.color.getRGB(m.fogColor.value,Wc(n)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,S,w,v){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),u(m,d)):d.isMeshPhongMaterial?(r(m,d),h(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,v)):d.isMeshMatcapMaterial?(r(m,d),g(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),_(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(o(m,d),d.isLineDashedMaterial&&a(m,d)):d.isPointsMaterial?c(m,d,S,w):d.isSpriteMaterial?l(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,e(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Ke&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,e(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Ke&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,e(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,e(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);let S=t.get(d),w=S.envMap,v=S.envMapRotation;w&&(m.envMap.value=w,fs.copy(v),fs.x*=-1,fs.y*=-1,fs.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(fs.y*=-1,fs.z*=-1),m.envMapRotation.value.setFromMatrix4(by.makeRotationFromEuler(fs)),m.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,e(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,m.aoMapTransform))}function o(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform))}function a(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function c(m,d,S,w){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*S,m.scale.value=w*.5,d.map&&(m.map.value=d.map,e(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function l(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,S){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Ke&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function _(m,d){let S=t.get(d).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function wy(n,t,e,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,w){let v=w.program;i.uniformBlockBinding(S,v)}function l(S,w){let v=s[S.id];v===void 0&&(g(S),v=h(S),s[S.id]=v,S.addEventListener("dispose",m));let T=w.program;i.updateUBOMapping(S,T);let E=t.render.frame;r[S.id]!==E&&(f(S),r[S.id]=E)}function h(S){let w=u();S.__bindingPointIndex=w;let v=n.createBuffer(),T=S.__size,E=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,T,E),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,w,v),v}function u(){for(let S=0;S<a;S++)if(o.indexOf(S)===-1)return o.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(S){let w=s[S.id],v=S.uniforms,T=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,w);for(let E=0,A=v.length;E<A;E++){let P=Array.isArray(v[E])?v[E]:[v[E]];for(let M=0,y=P.length;M<y;M++){let C=P[M];if(p(C,E,M,T)===!0){let U=C.__offset,z=Array.isArray(C.value)?C.value:[C.value],G=0;for(let $=0;$<z.length;$++){let W=z[$],nt=_(W);typeof W=="number"||typeof W=="boolean"?(C.__data[0]=W,n.bufferSubData(n.UNIFORM_BUFFER,U+G,C.__data)):W.isMatrix3?(C.__data[0]=W.elements[0],C.__data[1]=W.elements[1],C.__data[2]=W.elements[2],C.__data[3]=0,C.__data[4]=W.elements[3],C.__data[5]=W.elements[4],C.__data[6]=W.elements[5],C.__data[7]=0,C.__data[8]=W.elements[6],C.__data[9]=W.elements[7],C.__data[10]=W.elements[8],C.__data[11]=0):(W.toArray(C.__data,G),G+=nt.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,U,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(S,w,v,T){let E=S.value,A=w+"_"+v;if(T[A]===void 0)return typeof E=="number"||typeof E=="boolean"?T[A]=E:T[A]=E.clone(),!0;{let P=T[A];if(typeof E=="number"||typeof E=="boolean"){if(P!==E)return T[A]=E,!0}else if(P.equals(E)===!1)return P.copy(E),!0}return!1}function g(S){let w=S.uniforms,v=0,T=16;for(let A=0,P=w.length;A<P;A++){let M=Array.isArray(w[A])?w[A]:[w[A]];for(let y=0,C=M.length;y<C;y++){let U=M[y],z=Array.isArray(U.value)?U.value:[U.value];for(let G=0,$=z.length;G<$;G++){let W=z[G],nt=_(W),H=v%T,ot=H%nt.boundary,ut=H+ot;v+=ot,ut!==0&&T-ut<nt.storage&&(v+=T-ut),U.__data=new Float32Array(nt.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=v,v+=nt.storage}}}let E=v%T;return E>0&&(v+=T-E),S.__size=v,S.__cache={},this}function _(S){let w={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(w.boundary=4,w.storage=4):S.isVector2?(w.boundary=8,w.storage=8):S.isVector3||S.isColor?(w.boundary=16,w.storage=12):S.isVector4?(w.boundary=16,w.storage=16):S.isMatrix3?(w.boundary=48,w.storage=48):S.isMatrix4?(w.boundary=64,w.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),w}function m(S){let w=S.target;w.removeEventListener("dispose",m);let v=o.indexOf(w.__bindingPointIndex);o.splice(v,1),n.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function d(){for(let S in s)n.deleteBuffer(s[S]);o=[],s={},r={}}return{bind:c,update:l,dispose:d}}var rl=class{constructor(t={}){let{canvas:e=Ad(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;let g=new Uint32Array(4),_=new Int32Array(4),m=null,d=null,S=[],w=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=fi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let v=this,T=!1;this._outputColorSpace=Ae;let E=0,A=0,P=null,M=-1,y=null,C=new Me,U=new Me,z=null,G=new Vt(0),$=0,W=e.width,nt=e.height,H=1,ot=null,ut=null,wt=new Me(0,0,W,nt),Wt=new Me(0,0,W,nt),ce=!1,me=new Zs,Qt=!1,q=!1,J=new pe,mt=new D,Ut=new Me,Et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},qt=!1;function ze(){return P===null?H:1}let I=i;function ge(b,N){return e.getContext(b,N)}try{let b={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"180"}`),e.addEventListener("webglcontextlost",st,!1),e.addEventListener("webglcontextrestored",ft,!1),e.addEventListener("webglcontextcreationerror",j,!1),I===null){let N="webgl2";if(I=ge(N,b),I===null)throw ge(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let Ft,Dt,xt,_e,yt,zt,De,Ee,R,x,O,X,Z,V,bt,it,vt,Mt,tt,ht,It,St,lt,Bt;function L(){Ft=new G_(I),Ft.init(),St=new vy(I,Ft),Dt=new F_(I,Ft,t,St),xt=new xy(I,Ft),Dt.reversedDepthBuffer&&f&&xt.buffers.depth.setReversed(!0),_e=new $_(I),yt=new ry,zt=new yy(I,Ft,xt,yt,Dt,St,_e),De=new B_(v),Ee=new V_(v),R=new jm(I),lt=new U_(I,R),x=new W_(I,R,_e,lt),O=new Y_(I,x,R,_e),tt=new q_(I,Dt,zt),it=new O_(yt),X=new sy(v,De,Ee,Ft,Dt,lt,it),Z=new Ey(v,yt),V=new ay,bt=new fy(Ft),Mt=new L_(v,De,Ee,xt,O,p,c),vt=new gy(v,O,Dt),Bt=new wy(I,_e,Dt,xt),ht=new N_(I,Ft,_e),It=new X_(I,Ft,_e),_e.programs=X.programs,v.capabilities=Dt,v.extensions=Ft,v.properties=yt,v.renderLists=V,v.shadowMap=vt,v.state=xt,v.info=_e}L();let et=new ah(v,I);this.xr=et,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let b=Ft.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=Ft.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(b){b!==void 0&&(H=b,this.setSize(W,nt,!1))},this.getSize=function(b){return b.set(W,nt)},this.setSize=function(b,N,B=!0){if(et.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=b,nt=N,e.width=Math.floor(b*H),e.height=Math.floor(N*H),B===!0&&(e.style.width=b+"px",e.style.height=N+"px"),this.setViewport(0,0,b,N)},this.getDrawingBufferSize=function(b){return b.set(W*H,nt*H).floor()},this.setDrawingBufferSize=function(b,N,B){W=b,nt=N,H=B,e.width=Math.floor(b*B),e.height=Math.floor(N*B),this.setViewport(0,0,b,N)},this.getCurrentViewport=function(b){return b.copy(C)},this.getViewport=function(b){return b.copy(wt)},this.setViewport=function(b,N,B,k){b.isVector4?wt.set(b.x,b.y,b.z,b.w):wt.set(b,N,B,k),xt.viewport(C.copy(wt).multiplyScalar(H).round())},this.getScissor=function(b){return b.copy(Wt)},this.setScissor=function(b,N,B,k){b.isVector4?Wt.set(b.x,b.y,b.z,b.w):Wt.set(b,N,B,k),xt.scissor(U.copy(Wt).multiplyScalar(H).round())},this.getScissorTest=function(){return ce},this.setScissorTest=function(b){xt.setScissorTest(ce=b)},this.setOpaqueSort=function(b){ot=b},this.setTransparentSort=function(b){ut=b},this.getClearColor=function(b){return b.copy(Mt.getClearColor())},this.setClearColor=function(){Mt.setClearColor(...arguments)},this.getClearAlpha=function(){return Mt.getClearAlpha()},this.setClearAlpha=function(){Mt.setClearAlpha(...arguments)},this.clear=function(b=!0,N=!0,B=!0){let k=0;if(b){let F=!1;if(P!==null){let Q=P.texture.format;F=Q===Ta||Q===wa||Q===Ea}if(F){let Q=P.texture.type,ct=Q===zn||Q===Fi||Q===js||Q===tr||Q===Sa||Q===ba,gt=Mt.getClearColor(),dt=Mt.getClearAlpha(),Ct=gt.r,Lt=gt.g,At=gt.b;ct?(g[0]=Ct,g[1]=Lt,g[2]=At,g[3]=dt,I.clearBufferuiv(I.COLOR,0,g)):(_[0]=Ct,_[1]=Lt,_[2]=At,_[3]=dt,I.clearBufferiv(I.COLOR,0,_))}else k|=I.COLOR_BUFFER_BIT}N&&(k|=I.DEPTH_BUFFER_BIT),B&&(k|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",st,!1),e.removeEventListener("webglcontextrestored",ft,!1),e.removeEventListener("webglcontextcreationerror",j,!1),Mt.dispose(),V.dispose(),bt.dispose(),yt.dispose(),De.dispose(),Ee.dispose(),O.dispose(),lt.dispose(),Bt.dispose(),X.dispose(),et.dispose(),et.removeEventListener("sessionstart",Wn),et.removeEventListener("sessionend",Qh),Gi.stop()};function st(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function ft(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let b=_e.autoReset,N=vt.enabled,B=vt.autoUpdate,k=vt.needsUpdate,F=vt.type;L(),_e.autoReset=b,vt.enabled=N,vt.autoUpdate=B,vt.needsUpdate=k,vt.type=F}function j(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Y(b){let N=b.target;N.removeEventListener("dispose",Y),_t(N)}function _t(b){Nt(b),yt.remove(b)}function Nt(b){let N=yt.get(b).programs;N!==void 0&&(N.forEach(function(B){X.releaseProgram(B)}),b.isShaderMaterial&&X.releaseShaderCache(b))}this.renderBufferDirect=function(b,N,B,k,F,Q){N===null&&(N=Et);let ct=F.isMesh&&F.matrixWorld.determinant()<0,gt=mp(b,N,B,k,F);xt.setMaterial(k,ct);let dt=B.index,Ct=1;if(k.wireframe===!0){if(dt=x.getWireframeAttribute(B),dt===void 0)return;Ct=2}let Lt=B.drawRange,At=B.attributes.position,Xt=Lt.start*Ct,ie=(Lt.start+Lt.count)*Ct;Q!==null&&(Xt=Math.max(Xt,Q.start*Ct),ie=Math.min(ie,(Q.start+Q.count)*Ct)),dt!==null?(Xt=Math.max(Xt,0),ie=Math.min(ie,dt.count)):At!=null&&(Xt=Math.max(Xt,0),ie=Math.min(ie,At.count));let Se=ie-Xt;if(Se<0||Se===1/0)return;lt.setup(F,k,gt,B,dt);let de,ae=ht;if(dt!==null&&(de=R.get(dt),ae=It,ae.setIndex(de)),F.isMesh)k.wireframe===!0?(xt.setLineWidth(k.wireframeLinewidth*ze()),ae.setMode(I.LINES)):ae.setMode(I.TRIANGLES);else if(F.isLine){let Rt=k.linewidth;Rt===void 0&&(Rt=1),xt.setLineWidth(Rt*ze()),F.isLineSegments?ae.setMode(I.LINES):F.isLineLoop?ae.setMode(I.LINE_LOOP):ae.setMode(I.LINE_STRIP)}else F.isPoints?ae.setMode(I.POINTS):F.isSprite&&ae.setMode(I.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)Ws("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ae.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(Ft.get("WEBGL_multi_draw"))ae.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{let Rt=F._multiDrawStarts,ye=F._multiDrawCounts,Kt=F._multiDrawCount,an=dt?R.get(dt).bytesPerElement:1,ws=yt.get(k).currentProgram.getUniforms();for(let ln=0;ln<Kt;ln++)ws.setValue(I,"_gl_DrawID",ln),ae.render(Rt[ln]/an,ye[ln])}else if(F.isInstancedMesh)ae.renderInstances(Xt,Se,F.count);else if(B.isInstancedBufferGeometry){let Rt=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,ye=Math.min(B.instanceCount,Rt);ae.renderInstances(Xt,Se,ye)}else ae.render(Xt,Se)};function he(b,N,B){b.transparent===!0&&b.side===sn&&b.forceSinglePass===!1?(b.side=Ke,b.needsUpdate=!0,_o(b,N,B),b.side=ui,b.needsUpdate=!0,_o(b,N,B),b.side=sn):_o(b,N,B)}this.compile=function(b,N,B=null){B===null&&(B=b),d=bt.get(B),d.init(N),w.push(d),B.traverseVisible(function(F){F.isLight&&F.layers.test(N.layers)&&(d.pushLight(F),F.castShadow&&d.pushShadow(F))}),b!==B&&b.traverseVisible(function(F){F.isLight&&F.layers.test(N.layers)&&(d.pushLight(F),F.castShadow&&d.pushShadow(F))}),d.setupLights();let k=new Set;return b.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;let Q=F.material;if(Q)if(Array.isArray(Q))for(let ct=0;ct<Q.length;ct++){let gt=Q[ct];he(gt,B,F),k.add(gt)}else he(Q,B,F),k.add(Q)}),d=w.pop(),k},this.compileAsync=function(b,N,B=null){let k=this.compile(b,N,B);return new Promise(F=>{function Q(){if(k.forEach(function(ct){yt.get(ct).currentProgram.isReady()&&k.delete(ct)}),k.size===0){F(b);return}setTimeout(Q,10)}Ft.get("KHR_parallel_shader_compile")!==null?Q():setTimeout(Q,10)})};let te=null;function ii(b){te&&te(b)}function Wn(){Gi.stop()}function Qh(){Gi.start()}let Gi=new ef;Gi.setAnimationLoop(ii),typeof self<"u"&&Gi.setContext(self),this.setAnimationLoop=function(b){te=b,et.setAnimationLoop(b),b===null?Gi.stop():Gi.start()},et.addEventListener("sessionstart",Wn),et.addEventListener("sessionend",Qh),this.render=function(b,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),et.enabled===!0&&et.isPresenting===!0&&(et.cameraAutoUpdate===!0&&et.updateCamera(N),N=et.getCamera()),b.isScene===!0&&b.onBeforeRender(v,b,N,P),d=bt.get(b,w.length),d.init(N),w.push(d),J.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),me.setFromProjectionMatrix(J,Nn,N.reversedDepth),q=this.localClippingEnabled,Qt=it.init(this.clippingPlanes,q),m=V.get(b,S.length),m.init(),S.push(m),et.enabled===!0&&et.isPresenting===!0){let Q=v.xr.getDepthSensingMesh();Q!==null&&Ll(Q,N,-1/0,v.sortObjects)}Ll(b,N,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(ot,ut),qt=et.enabled===!1||et.isPresenting===!1||et.hasDepthSensing()===!1,qt&&Mt.addToRenderList(m,b),this.info.render.frame++,Qt===!0&&it.beginShadows();let B=d.state.shadowsArray;vt.render(B,b,N),Qt===!0&&it.endShadows(),this.info.autoReset===!0&&this.info.reset();let k=m.opaque,F=m.transmissive;if(d.setupLights(),N.isArrayCamera){let Q=N.cameras;if(F.length>0)for(let ct=0,gt=Q.length;ct<gt;ct++){let dt=Q[ct];eu(k,F,b,dt)}qt&&Mt.render(b);for(let ct=0,gt=Q.length;ct<gt;ct++){let dt=Q[ct];tu(m,b,dt,dt.viewport)}}else F.length>0&&eu(k,F,b,N),qt&&Mt.render(b),tu(m,b,N);P!==null&&A===0&&(zt.updateMultisampleRenderTarget(P),zt.updateRenderTargetMipmap(P)),b.isScene===!0&&b.onAfterRender(v,b,N),lt.resetDefaultState(),M=-1,y=null,w.pop(),w.length>0?(d=w[w.length-1],Qt===!0&&it.setGlobalState(v.clippingPlanes,d.state.camera)):d=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function Ll(b,N,B,k){if(b.visible===!1)return;if(b.layers.test(N.layers)){if(b.isGroup)B=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(N);else if(b.isLight)d.pushLight(b),b.castShadow&&d.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||me.intersectsSprite(b)){k&&Ut.setFromMatrixPosition(b.matrixWorld).applyMatrix4(J);let ct=O.update(b),gt=b.material;gt.visible&&m.push(b,ct,gt,B,Ut.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||me.intersectsObject(b))){let ct=O.update(b),gt=b.material;if(k&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Ut.copy(b.boundingSphere.center)):(ct.boundingSphere===null&&ct.computeBoundingSphere(),Ut.copy(ct.boundingSphere.center)),Ut.applyMatrix4(b.matrixWorld).applyMatrix4(J)),Array.isArray(gt)){let dt=ct.groups;for(let Ct=0,Lt=dt.length;Ct<Lt;Ct++){let At=dt[Ct],Xt=gt[At.materialIndex];Xt&&Xt.visible&&m.push(b,ct,Xt,B,Ut.z,At)}}else gt.visible&&m.push(b,ct,gt,B,Ut.z,null)}}let Q=b.children;for(let ct=0,gt=Q.length;ct<gt;ct++)Ll(Q[ct],N,B,k)}function tu(b,N,B,k){let F=b.opaque,Q=b.transmissive,ct=b.transparent;d.setupLightsView(B),Qt===!0&&it.setGlobalState(v.clippingPlanes,B),k&&xt.viewport(C.copy(k)),F.length>0&&go(F,N,B),Q.length>0&&go(Q,N,B),ct.length>0&&go(ct,N,B),xt.buffers.depth.setTest(!0),xt.buffers.depth.setMask(!0),xt.buffers.color.setMask(!0),xt.setPolygonOffset(!1)}function eu(b,N,B,k){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[k.id]===void 0&&(d.state.transmissionRenderTarget[k.id]=new Yn(1,1,{generateMipmaps:!0,type:Ft.has("EXT_color_buffer_half_float")||Ft.has("EXT_color_buffer_float")?Qs:zn,minFilter:Ni,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Yt.workingColorSpace}));let Q=d.state.transmissionRenderTarget[k.id],ct=k.viewport||C;Q.setSize(ct.z*v.transmissionResolutionScale,ct.w*v.transmissionResolutionScale);let gt=v.getRenderTarget(),dt=v.getActiveCubeFace(),Ct=v.getActiveMipmapLevel();v.setRenderTarget(Q),v.getClearColor(G),$=v.getClearAlpha(),$<1&&v.setClearColor(16777215,.5),v.clear(),qt&&Mt.render(B);let Lt=v.toneMapping;v.toneMapping=fi;let At=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),d.setupLightsView(k),Qt===!0&&it.setGlobalState(v.clippingPlanes,k),go(b,B,k),zt.updateMultisampleRenderTarget(Q),zt.updateRenderTargetMipmap(Q),Ft.has("WEBGL_multisampled_render_to_texture")===!1){let Xt=!1;for(let ie=0,Se=N.length;ie<Se;ie++){let de=N[ie],ae=de.object,Rt=de.geometry,ye=de.material,Kt=de.group;if(ye.side===sn&&ae.layers.test(k.layers)){let an=ye.side;ye.side=Ke,ye.needsUpdate=!0,nu(ae,B,k,Rt,ye,Kt),ye.side=an,ye.needsUpdate=!0,Xt=!0}}Xt===!0&&(zt.updateMultisampleRenderTarget(Q),zt.updateRenderTargetMipmap(Q))}v.setRenderTarget(gt,dt,Ct),v.setClearColor(G,$),At!==void 0&&(k.viewport=At),v.toneMapping=Lt}function go(b,N,B){let k=N.isScene===!0?N.overrideMaterial:null;for(let F=0,Q=b.length;F<Q;F++){let ct=b[F],gt=ct.object,dt=ct.geometry,Ct=ct.group,Lt=ct.material;Lt.allowOverride===!0&&k!==null&&(Lt=k),gt.layers.test(B.layers)&&nu(gt,N,B,dt,Lt,Ct)}}function nu(b,N,B,k,F,Q){b.onBeforeRender(v,N,B,k,F,Q),b.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),F.onBeforeRender(v,N,B,k,b,Q),F.transparent===!0&&F.side===sn&&F.forceSinglePass===!1?(F.side=Ke,F.needsUpdate=!0,v.renderBufferDirect(B,N,k,F,b,Q),F.side=ui,F.needsUpdate=!0,v.renderBufferDirect(B,N,k,F,b,Q),F.side=sn):v.renderBufferDirect(B,N,k,F,b,Q),b.onAfterRender(v,N,B,k,F,Q)}function _o(b,N,B){N.isScene!==!0&&(N=Et);let k=yt.get(b),F=d.state.lights,Q=d.state.shadowsArray,ct=F.state.version,gt=X.getParameters(b,F.state,Q,N,B),dt=X.getProgramCacheKey(gt),Ct=k.programs;k.environment=b.isMeshStandardMaterial?N.environment:null,k.fog=N.fog,k.envMap=(b.isMeshStandardMaterial?Ee:De).get(b.envMap||k.environment),k.envMapRotation=k.environment!==null&&b.envMap===null?N.environmentRotation:b.envMapRotation,Ct===void 0&&(b.addEventListener("dispose",Y),Ct=new Map,k.programs=Ct);let Lt=Ct.get(dt);if(Lt!==void 0){if(k.currentProgram===Lt&&k.lightsStateVersion===ct)return su(b,gt),Lt}else gt.uniforms=X.getUniforms(b),b.onBeforeCompile(gt,v),Lt=X.acquireProgram(gt,dt),Ct.set(dt,Lt),k.uniforms=gt.uniforms;let At=k.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(At.clippingPlanes=it.uniform),su(b,gt),k.needsLights=_p(b),k.lightsStateVersion=ct,k.needsLights&&(At.ambientLightColor.value=F.state.ambient,At.lightProbe.value=F.state.probe,At.directionalLights.value=F.state.directional,At.directionalLightShadows.value=F.state.directionalShadow,At.spotLights.value=F.state.spot,At.spotLightShadows.value=F.state.spotShadow,At.rectAreaLights.value=F.state.rectArea,At.ltc_1.value=F.state.rectAreaLTC1,At.ltc_2.value=F.state.rectAreaLTC2,At.pointLights.value=F.state.point,At.pointLightShadows.value=F.state.pointShadow,At.hemisphereLights.value=F.state.hemi,At.directionalShadowMap.value=F.state.directionalShadowMap,At.directionalShadowMatrix.value=F.state.directionalShadowMatrix,At.spotShadowMap.value=F.state.spotShadowMap,At.spotLightMatrix.value=F.state.spotLightMatrix,At.spotLightMap.value=F.state.spotLightMap,At.pointShadowMap.value=F.state.pointShadowMap,At.pointShadowMatrix.value=F.state.pointShadowMatrix),k.currentProgram=Lt,k.uniformsList=null,Lt}function iu(b){if(b.uniformsList===null){let N=b.currentProgram.getUniforms();b.uniformsList=rr.seqWithValue(N.seq,b.uniforms)}return b.uniformsList}function su(b,N){let B=yt.get(b);B.outputColorSpace=N.outputColorSpace,B.batching=N.batching,B.batchingColor=N.batchingColor,B.instancing=N.instancing,B.instancingColor=N.instancingColor,B.instancingMorph=N.instancingMorph,B.skinning=N.skinning,B.morphTargets=N.morphTargets,B.morphNormals=N.morphNormals,B.morphColors=N.morphColors,B.morphTargetsCount=N.morphTargetsCount,B.numClippingPlanes=N.numClippingPlanes,B.numIntersection=N.numClipIntersection,B.vertexAlphas=N.vertexAlphas,B.vertexTangents=N.vertexTangents,B.toneMapping=N.toneMapping}function mp(b,N,B,k,F){N.isScene!==!0&&(N=Et),zt.resetTextureUnits();let Q=N.fog,ct=k.isMeshStandardMaterial?N.environment:null,gt=P===null?v.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:ss,dt=(k.isMeshStandardMaterial?Ee:De).get(k.envMap||ct),Ct=k.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Lt=!!B.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),At=!!B.morphAttributes.position,Xt=!!B.morphAttributes.normal,ie=!!B.morphAttributes.color,Se=fi;k.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(Se=v.toneMapping);let de=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,ae=de!==void 0?de.length:0,Rt=yt.get(k),ye=d.state.lights;if(Qt===!0&&(q===!0||b!==y)){let qe=b===y&&k.id===M;it.setState(k,b,qe)}let Kt=!1;k.version===Rt.__version?(Rt.needsLights&&Rt.lightsStateVersion!==ye.state.version||Rt.outputColorSpace!==gt||F.isBatchedMesh&&Rt.batching===!1||!F.isBatchedMesh&&Rt.batching===!0||F.isBatchedMesh&&Rt.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&Rt.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&Rt.instancing===!1||!F.isInstancedMesh&&Rt.instancing===!0||F.isSkinnedMesh&&Rt.skinning===!1||!F.isSkinnedMesh&&Rt.skinning===!0||F.isInstancedMesh&&Rt.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&Rt.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&Rt.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&Rt.instancingMorph===!1&&F.morphTexture!==null||Rt.envMap!==dt||k.fog===!0&&Rt.fog!==Q||Rt.numClippingPlanes!==void 0&&(Rt.numClippingPlanes!==it.numPlanes||Rt.numIntersection!==it.numIntersection)||Rt.vertexAlphas!==Ct||Rt.vertexTangents!==Lt||Rt.morphTargets!==At||Rt.morphNormals!==Xt||Rt.morphColors!==ie||Rt.toneMapping!==Se||Rt.morphTargetsCount!==ae)&&(Kt=!0):(Kt=!0,Rt.__version=k.version);let an=Rt.currentProgram;Kt===!0&&(an=_o(k,N,F));let ws=!1,ln=!1,mr=!1,ve=an.getUniforms(),_n=Rt.uniforms;if(xt.useProgram(an.program)&&(ws=!0,ln=!0,mr=!0),k.id!==M&&(M=k.id,ln=!0),ws||y!==b){xt.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),ve.setValue(I,"projectionMatrix",b.projectionMatrix),ve.setValue(I,"viewMatrix",b.matrixWorldInverse);let Qe=ve.map.cameraPosition;Qe!==void 0&&Qe.setValue(I,mt.setFromMatrixPosition(b.matrixWorld)),Dt.logarithmicDepthBuffer&&ve.setValue(I,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&ve.setValue(I,"isOrthographic",b.isOrthographicCamera===!0),y!==b&&(y=b,ln=!0,mr=!0)}if(F.isSkinnedMesh){ve.setOptional(I,F,"bindMatrix"),ve.setOptional(I,F,"bindMatrixInverse");let qe=F.skeleton;qe&&(qe.boneTexture===null&&qe.computeBoneTexture(),ve.setValue(I,"boneTexture",qe.boneTexture,zt))}F.isBatchedMesh&&(ve.setOptional(I,F,"batchingTexture"),ve.setValue(I,"batchingTexture",F._matricesTexture,zt),ve.setOptional(I,F,"batchingIdTexture"),ve.setValue(I,"batchingIdTexture",F._indirectTexture,zt),ve.setOptional(I,F,"batchingColorTexture"),F._colorsTexture!==null&&ve.setValue(I,"batchingColorTexture",F._colorsTexture,zt));let xn=B.morphAttributes;if((xn.position!==void 0||xn.normal!==void 0||xn.color!==void 0)&&tt.update(F,B,an),(ln||Rt.receiveShadow!==F.receiveShadow)&&(Rt.receiveShadow=F.receiveShadow,ve.setValue(I,"receiveShadow",F.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(_n.envMap.value=dt,_n.flipEnvMap.value=dt.isCubeTexture&&dt.isRenderTargetTexture===!1?-1:1),k.isMeshStandardMaterial&&k.envMap===null&&N.environment!==null&&(_n.envMapIntensity.value=N.environmentIntensity),ln&&(ve.setValue(I,"toneMappingExposure",v.toneMappingExposure),Rt.needsLights&&gp(_n,mr),Q&&k.fog===!0&&Z.refreshFogUniforms(_n,Q),Z.refreshMaterialUniforms(_n,k,H,nt,d.state.transmissionRenderTarget[b.id]),rr.upload(I,iu(Rt),_n,zt)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(rr.upload(I,iu(Rt),_n,zt),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&ve.setValue(I,"center",F.center),ve.setValue(I,"modelViewMatrix",F.modelViewMatrix),ve.setValue(I,"normalMatrix",F.normalMatrix),ve.setValue(I,"modelMatrix",F.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){let qe=k.uniformsGroups;for(let Qe=0,Ul=qe.length;Qe<Ul;Qe++){let Wi=qe[Qe];Bt.update(Wi,an),Bt.bind(Wi,an)}}return an}function gp(b,N){b.ambientLightColor.needsUpdate=N,b.lightProbe.needsUpdate=N,b.directionalLights.needsUpdate=N,b.directionalLightShadows.needsUpdate=N,b.pointLights.needsUpdate=N,b.pointLightShadows.needsUpdate=N,b.spotLights.needsUpdate=N,b.spotLightShadows.needsUpdate=N,b.rectAreaLights.needsUpdate=N,b.hemisphereLights.needsUpdate=N}function _p(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(b,N,B){let k=yt.get(b);k.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),yt.get(b.texture).__webglTexture=N,yt.get(b.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:B,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,N){let B=yt.get(b);B.__webglFramebuffer=N,B.__useDefaultFramebuffer=N===void 0};let xp=I.createFramebuffer();this.setRenderTarget=function(b,N=0,B=0){P=b,E=N,A=B;let k=!0,F=null,Q=!1,ct=!1;if(b){let dt=yt.get(b);if(dt.__useDefaultFramebuffer!==void 0)xt.bindFramebuffer(I.FRAMEBUFFER,null),k=!1;else if(dt.__webglFramebuffer===void 0)zt.setupRenderTarget(b);else if(dt.__hasExternalTextures)zt.rebindTextures(b,yt.get(b.texture).__webglTexture,yt.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){let At=b.depthTexture;if(dt.__boundDepthTexture!==At){if(At!==null&&yt.has(At)&&(b.width!==At.image.width||b.height!==At.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");zt.setupDepthRenderbuffer(b)}}let Ct=b.texture;(Ct.isData3DTexture||Ct.isDataArrayTexture||Ct.isCompressedArrayTexture)&&(ct=!0);let Lt=yt.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Lt[N])?F=Lt[N][B]:F=Lt[N],Q=!0):b.samples>0&&zt.useMultisampledRTT(b)===!1?F=yt.get(b).__webglMultisampledFramebuffer:Array.isArray(Lt)?F=Lt[B]:F=Lt,C.copy(b.viewport),U.copy(b.scissor),z=b.scissorTest}else C.copy(wt).multiplyScalar(H).floor(),U.copy(Wt).multiplyScalar(H).floor(),z=ce;if(B!==0&&(F=xp),xt.bindFramebuffer(I.FRAMEBUFFER,F)&&k&&xt.drawBuffers(b,F),xt.viewport(C),xt.scissor(U),xt.setScissorTest(z),Q){let dt=yt.get(b.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+N,dt.__webglTexture,B)}else if(ct){let dt=N;for(let Ct=0;Ct<b.textures.length;Ct++){let Lt=yt.get(b.textures[Ct]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Ct,Lt.__webglTexture,B,dt)}}else if(b!==null&&B!==0){let dt=yt.get(b.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,dt.__webglTexture,B)}M=-1},this.readRenderTargetPixels=function(b,N,B,k,F,Q,ct,gt=0){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let dt=yt.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ct!==void 0&&(dt=dt[ct]),dt){xt.bindFramebuffer(I.FRAMEBUFFER,dt);try{let Ct=b.textures[gt],Lt=Ct.format,At=Ct.type;if(!Dt.textureFormatReadable(Lt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Dt.textureTypeReadable(At)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=b.width-k&&B>=0&&B<=b.height-F&&(b.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+gt),I.readPixels(N,B,k,F,St.convert(Lt),St.convert(At),Q))}finally{let Ct=P!==null?yt.get(P).__webglFramebuffer:null;xt.bindFramebuffer(I.FRAMEBUFFER,Ct)}}},this.readRenderTargetPixelsAsync=async function(b,N,B,k,F,Q,ct,gt=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let dt=yt.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ct!==void 0&&(dt=dt[ct]),dt)if(N>=0&&N<=b.width-k&&B>=0&&B<=b.height-F){xt.bindFramebuffer(I.FRAMEBUFFER,dt);let Ct=b.textures[gt],Lt=Ct.format,At=Ct.type;if(!Dt.textureFormatReadable(Lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Dt.textureTypeReadable(At))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Xt=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Xt),I.bufferData(I.PIXEL_PACK_BUFFER,Q.byteLength,I.STREAM_READ),b.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+gt),I.readPixels(N,B,k,F,St.convert(Lt),St.convert(At),0);let ie=P!==null?yt.get(P).__webglFramebuffer:null;xt.bindFramebuffer(I.FRAMEBUFFER,ie);let Se=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Rd(I,Se,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Xt),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,Q),I.deleteBuffer(Xt),I.deleteSync(Se),Q}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,N=null,B=0){let k=Math.pow(2,-B),F=Math.floor(b.image.width*k),Q=Math.floor(b.image.height*k),ct=N!==null?N.x:0,gt=N!==null?N.y:0;zt.setTexture2D(b,0),I.copyTexSubImage2D(I.TEXTURE_2D,B,0,0,ct,gt,F,Q),xt.unbindTexture()};let yp=I.createFramebuffer(),vp=I.createFramebuffer();this.copyTextureToTexture=function(b,N,B=null,k=null,F=0,Q=null){Q===null&&(F!==0?(Ws("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Q=F,F=0):Q=0);let ct,gt,dt,Ct,Lt,At,Xt,ie,Se,de=b.isCompressedTexture?b.mipmaps[Q]:b.image;if(B!==null)ct=B.max.x-B.min.x,gt=B.max.y-B.min.y,dt=B.isBox3?B.max.z-B.min.z:1,Ct=B.min.x,Lt=B.min.y,At=B.isBox3?B.min.z:0;else{let xn=Math.pow(2,-F);ct=Math.floor(de.width*xn),gt=Math.floor(de.height*xn),b.isDataArrayTexture?dt=de.depth:b.isData3DTexture?dt=Math.floor(de.depth*xn):dt=1,Ct=0,Lt=0,At=0}k!==null?(Xt=k.x,ie=k.y,Se=k.z):(Xt=0,ie=0,Se=0);let ae=St.convert(N.format),Rt=St.convert(N.type),ye;N.isData3DTexture?(zt.setTexture3D(N,0),ye=I.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(zt.setTexture2DArray(N,0),ye=I.TEXTURE_2D_ARRAY):(zt.setTexture2D(N,0),ye=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,N.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,N.unpackAlignment);let Kt=I.getParameter(I.UNPACK_ROW_LENGTH),an=I.getParameter(I.UNPACK_IMAGE_HEIGHT),ws=I.getParameter(I.UNPACK_SKIP_PIXELS),ln=I.getParameter(I.UNPACK_SKIP_ROWS),mr=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,de.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,de.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ct),I.pixelStorei(I.UNPACK_SKIP_ROWS,Lt),I.pixelStorei(I.UNPACK_SKIP_IMAGES,At);let ve=b.isDataArrayTexture||b.isData3DTexture,_n=N.isDataArrayTexture||N.isData3DTexture;if(b.isDepthTexture){let xn=yt.get(b),qe=yt.get(N),Qe=yt.get(xn.__renderTarget),Ul=yt.get(qe.__renderTarget);xt.bindFramebuffer(I.READ_FRAMEBUFFER,Qe.__webglFramebuffer),xt.bindFramebuffer(I.DRAW_FRAMEBUFFER,Ul.__webglFramebuffer);for(let Wi=0;Wi<dt;Wi++)ve&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,yt.get(b).__webglTexture,F,At+Wi),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,yt.get(N).__webglTexture,Q,Se+Wi)),I.blitFramebuffer(Ct,Lt,ct,gt,Xt,ie,ct,gt,I.DEPTH_BUFFER_BIT,I.NEAREST);xt.bindFramebuffer(I.READ_FRAMEBUFFER,null),xt.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(F!==0||b.isRenderTargetTexture||yt.has(b)){let xn=yt.get(b),qe=yt.get(N);xt.bindFramebuffer(I.READ_FRAMEBUFFER,yp),xt.bindFramebuffer(I.DRAW_FRAMEBUFFER,vp);for(let Qe=0;Qe<dt;Qe++)ve?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,xn.__webglTexture,F,At+Qe):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,xn.__webglTexture,F),_n?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,qe.__webglTexture,Q,Se+Qe):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,qe.__webglTexture,Q),F!==0?I.blitFramebuffer(Ct,Lt,ct,gt,Xt,ie,ct,gt,I.COLOR_BUFFER_BIT,I.NEAREST):_n?I.copyTexSubImage3D(ye,Q,Xt,ie,Se+Qe,Ct,Lt,ct,gt):I.copyTexSubImage2D(ye,Q,Xt,ie,Ct,Lt,ct,gt);xt.bindFramebuffer(I.READ_FRAMEBUFFER,null),xt.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else _n?b.isDataTexture||b.isData3DTexture?I.texSubImage3D(ye,Q,Xt,ie,Se,ct,gt,dt,ae,Rt,de.data):N.isCompressedArrayTexture?I.compressedTexSubImage3D(ye,Q,Xt,ie,Se,ct,gt,dt,ae,de.data):I.texSubImage3D(ye,Q,Xt,ie,Se,ct,gt,dt,ae,Rt,de):b.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,Q,Xt,ie,ct,gt,ae,Rt,de.data):b.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,Q,Xt,ie,de.width,de.height,ae,de.data):I.texSubImage2D(I.TEXTURE_2D,Q,Xt,ie,ct,gt,ae,Rt,de);I.pixelStorei(I.UNPACK_ROW_LENGTH,Kt),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,an),I.pixelStorei(I.UNPACK_SKIP_PIXELS,ws),I.pixelStorei(I.UNPACK_SKIP_ROWS,ln),I.pixelStorei(I.UNPACK_SKIP_IMAGES,mr),Q===0&&N.generateMipmaps&&I.generateMipmap(ye),xt.unbindTexture()},this.initRenderTarget=function(b){yt.get(b).__webglFramebuffer===void 0&&zt.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?zt.setTextureCube(b,0):b.isData3DTexture?zt.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?zt.setTexture2DArray(b,0):zt.setTexture2D(b,0),xt.unbindTexture()},this.resetState=function(){E=0,A=0,P=null,xt.reset(),lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Nn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=Yt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Yt._getUnpackColorSpace()}};var af={type:"change"},uh={type:"start"},cf={type:"end"},al=new rs,lf=new Mn,Ty=Math.cos(70*hs.DEG2RAD),Pe=new D,rn=2*Math.PI,re={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},hh=1e-6,ll=class extends qr{constructor(t,e=null){super(t,e),this.state=re.NONE,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:wn.ROTATE,MIDDLE:wn.DOLLY,RIGHT:wn.PAN},this.touches={ONE:kn.ROTATE,TWO:kn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new bn,this._lastTargetPosition=new D,this._quat=new bn().setFromUnitVectors(t.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Ks,this._sphericalDelta=new Ks,this._scale=1,this._panOffset=new D,this._rotateStart=new Tt,this._rotateEnd=new Tt,this._rotateDelta=new Tt,this._panStart=new Tt,this._panEnd=new Tt,this._panDelta=new Tt,this._dollyStart=new Tt,this._dollyEnd=new Tt,this._dollyDelta=new Tt,this._dollyDirection=new D,this._mouse=new Tt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Ry.bind(this),this._onPointerDown=Ay.bind(this),this._onPointerUp=Cy.bind(this),this._onContextMenu=Fy.bind(this),this._onMouseWheel=Dy.bind(this),this._onKeyDown=Ly.bind(this),this._onTouchStart=Uy.bind(this),this._onTouchMove=Ny.bind(this),this._onMouseDown=Iy.bind(this),this._onMouseMove=Py.bind(this),this._interceptControlDown=Oy.bind(this),this._interceptControlUp=By.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(af),this.update(),this.state=re.NONE}update(t=null){let e=this.object.position;Pe.copy(e).sub(this.target),Pe.applyQuaternion(this._quat),this._spherical.setFromVector3(Pe),this.autoRotate&&this.state===re.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=rn:i>Math.PI&&(i-=rn),s<-Math.PI?s+=rn:s>Math.PI&&(s-=rn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Pe.setFromSpherical(this._spherical),Pe.applyQuaternion(this._quatInverse),e.copy(this.target).add(Pe),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Pe.length();o=this._clampDistance(a*this._scale);let c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){let a=new D(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;let l=new D(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),o=Pe.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(al.origin.copy(this.object.position),al.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(al.direction))<Ty?this.object.lookAt(this.target):(lf.setFromNormalAndCoplanarPoint(this.object.up,this.target),al.intersectPlane(lf,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>hh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>hh||this._lastTargetPosition.distanceToSquared(this.target)>hh?(this.dispatchEvent(af),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?rn/60*this.autoRotateSpeed*t:rn/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Pe.setFromMatrixColumn(e,0),Pe.multiplyScalar(-t),this._panOffset.add(Pe)}_panUp(t,e){this.screenSpacePanning===!0?Pe.setFromMatrixColumn(e,1):(Pe.setFromMatrixColumn(e,0),Pe.crossVectors(this.object.up,Pe)),Pe.multiplyScalar(t),this._panOffset.add(Pe)}_pan(t,e){let i=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Pe.copy(s).sub(this.target);let r=Pe.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/i.clientHeight,this.object.matrix),this._panUp(2*e*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),s=t-i.left,r=e-i.top,o=i.width,a=i.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(rn*this._rotateDelta.x/e.clientHeight),this._rotateUp(rn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(rn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-rn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(rn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-rn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(i,s)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),r=.5*(t.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(rn*this._rotateDelta.x/e.clientHeight),this._rotateUp(rn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new Tt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function Ay(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function Ry(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function Cy(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(cf),this.state=re.NONE;break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function Iy(n){let t;switch(n.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case wn.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=re.DOLLY;break;case wn.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=re.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=re.ROTATE}break;case wn.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=re.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=re.PAN}break;default:this.state=re.NONE}this.state!==re.NONE&&this.dispatchEvent(uh)}function Py(n){switch(this.state){case re.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case re.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case re.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function Dy(n){this.enabled===!1||this.enableZoom===!1||this.state!==re.NONE||(n.preventDefault(),this.dispatchEvent(uh),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(cf))}function Ly(n){this.enabled!==!1&&this._handleKeyDown(n)}function Uy(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case kn.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=re.TOUCH_ROTATE;break;case kn.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=re.TOUCH_PAN;break;default:this.state=re.NONE}break;case 2:switch(this.touches.TWO){case kn.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=re.TOUCH_DOLLY_PAN;break;case kn.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=re.TOUCH_DOLLY_ROTATE;break;default:this.state=re.NONE}break;default:this.state=re.NONE}this.state!==re.NONE&&this.dispatchEvent(uh)}function Ny(n){switch(this._trackPointer(n),this.state){case re.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case re.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case re.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case re.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=re.NONE}}function Fy(n){this.enabled!==!1&&n.preventDefault()}function Oy(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function By(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var eo=class extends Ne{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new Tt(.5,.5),this.addEventListener("removed",function(){this.traverse(function(e){e.element instanceof e.element.ownerDocument.defaultView.Element&&e.element.parentNode!==null&&e.element.remove()})})}copy(t,e){return super.copy(t,e),this.element=t.element.cloneNode(!0),this.center=t.center,this}},ar=new D,hf=new pe,uf=new pe,df=new D,ff=new D,cl=class{constructor(t={}){let e=this,i,s,r,o,a={objects:new WeakMap},c=t.element!==void 0?t.element:document.createElement("div");c.style.overflow="hidden",this.domElement=c,this.getSize=function(){return{width:i,height:s}},this.render=function(g,_){g.matrixWorldAutoUpdate===!0&&g.updateMatrixWorld(),_.parent===null&&_.matrixWorldAutoUpdate===!0&&_.updateMatrixWorld(),hf.copy(_.matrixWorldInverse),uf.multiplyMatrices(_.projectionMatrix,hf),h(g,g,_),p(g)},this.setSize=function(g,_){i=g,s=_,r=i/2,o=s/2,c.style.width=g+"px",c.style.height=_+"px"};function l(g){g.isCSS2DObject&&(g.element.style.display="none");for(let _=0,m=g.children.length;_<m;_++)l(g.children[_])}function h(g,_,m){if(g.visible===!1){l(g);return}if(g.isCSS2DObject){ar.setFromMatrixPosition(g.matrixWorld),ar.applyMatrix4(uf);let d=ar.z>=-1&&ar.z<=1&&g.layers.test(m.layers)===!0,S=g.element;S.style.display=d===!0?"":"none",d===!0&&(g.onBeforeRender(e,_,m),S.style.transform="translate("+-100*g.center.x+"%,"+-100*g.center.y+"%)translate("+(ar.x*r+r)+"px,"+(-ar.y*o+o)+"px)",S.parentNode!==c&&c.appendChild(S),g.onAfterRender(e,_,m));let w={distanceToCameraSquared:u(m,g)};a.objects.set(g,w)}for(let d=0,S=g.children.length;d<S;d++)h(g.children[d],_,m)}function u(g,_){return df.setFromMatrixPosition(g.matrixWorld),ff.setFromMatrixPosition(_.matrixWorld),df.distanceToSquared(ff)}function f(g){let _=[];return g.traverseVisible(function(m){m.isCSS2DObject&&_.push(m)}),_}function p(g){let _=f(g).sort(function(d,S){if(d.renderOrder!==S.renderOrder)return S.renderOrder-d.renderOrder;let w=a.objects.get(d).distanceToCameraSquared,v=a.objects.get(S).distanceToCameraSquared;return w-v}),m=_.length;for(let d=0,S=_.length;d<S;d++)_[d].element.style.zIndex=m-d}}};var no=new D;function An(n,t,e,i,s,r){let o=2*Math.PI*s/4,a=Math.max(r-2*s,0),c=Math.PI/4;no.copy(t),no[i]=0,no.normalize();let l=.5*o/(o+a),h=1-no.angleTo(n)/c;return Math.sign(no[e])===1?h*l:a/(o+a)+l+l*(1-h)}var lr=class n extends nn{constructor(t=1,e=1,i=1,s=2,r=.1){let o=s*2+1;if(r=Math.min(t/2,e/2,i/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:i,segments:s,radius:r},o===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let c=new D,l=new D,h=new D(t,e,i).divideScalar(2).subScalar(r),u=this.attributes.position.array,f=this.attributes.normal.array,p=this.attributes.uv.array,g=u.length/6,_=new D,m=.5/o;for(let d=0,S=0;d<u.length;d+=3,S+=2)switch(c.fromArray(u,d),l.copy(c),l.x-=Math.sign(l.x)*m,l.y-=Math.sign(l.y)*m,l.z-=Math.sign(l.z)*m,l.normalize(),u[d+0]=h.x*Math.sign(c.x)+l.x*r,u[d+1]=h.y*Math.sign(c.y)+l.y*r,u[d+2]=h.z*Math.sign(c.z)+l.z*r,f[d+0]=l.x,f[d+1]=l.y,f[d+2]=l.z,Math.floor(d/g)){case 0:_.set(1,0,0),p[S+0]=An(_,l,"z","y",r,i),p[S+1]=1-An(_,l,"y","z",r,e);break;case 1:_.set(-1,0,0),p[S+0]=1-An(_,l,"z","y",r,i),p[S+1]=1-An(_,l,"y","z",r,e);break;case 2:_.set(0,1,0),p[S+0]=1-An(_,l,"x","z",r,t),p[S+1]=An(_,l,"z","x",r,i);break;case 3:_.set(0,-1,0),p[S+0]=1-An(_,l,"x","z",r,t),p[S+1]=1-An(_,l,"z","x",r,i);break;case 4:_.set(0,0,1),p[S+0]=1-An(_,l,"x","y",r,t),p[S+1]=1-An(_,l,"y","x",r,e);break;case 5:_.set(0,0,-1),p[S+0]=An(_,l,"x","y",r,t),p[S+1]=1-An(_,l,"y","x",r,e);break}}static fromJSON(t){return new n(t.width,t.height,t.depth,t.segments,t.radius)}};var dh=new Map;function Rn(n,t,e,i=.08){let s=`${n}|${t}|${e}|${i}`;return dh.has(s)||dh.set(s,new lr(n,t,e,3,Math.min(i,n/2,t/2,e/2))),dh.get(s)}var pf={session:{w:2.1,h:1.05,d:1.15,legs:4,legH:.7,eye:[.24,.3],crown:"gem"},"general-purpose":{w:1.9,h:.95,d:1,legs:4,legH:.62,eye:[.22,.28],crown:"none"},Explore:{w:2.1,h:.8,d:1,legs:4,legH:.5,eye:[.28,.24],crown:"periscope"},Plan:{w:1.6,h:1.3,d:1,legs:2,legH:.6,eye:[.2,.26],crown:"cap"},"code-reviewer":{w:1.9,h:1,d:1,legs:4,legH:.58,eye:[.2,.22],crown:"glasses"},"test-runner":{w:2,h:.85,d:.95,legs:6,legH:.55,eye:[.2,.26],crown:"antennae"}};function fh({build:n="general-purpose",bodyColor:t,inkColor:e,accentColor:i,pick:s}){let r=pf[n]??pf["general-purpose"],o=new Zt,a=new Zt;o.add(a);let c=new Re({color:t,roughness:.62}),l=new Re({color:e,roughness:.5}),h=new Re({color:i,roughness:.45}),u=[],f=Math.min(.26,r.w*.8/(r.legs*1.6));for(let T=0;T<r.legs;T++){let E=(T-(r.legs-1)/2)*(r.w*.78/Math.max(1,r.legs-1)),A=new K(Rn(f,r.legH+.1,r.d*.3,.04),c);A.position.set(r.legs===2?E*.7:E,r.legH/2,0),A.userData.phase=T%2?Math.PI:0,u.push(A)}let p=new Zt;p.position.y=r.legH;let g=new K(Rn(r.w,r.h,r.d,.14),c);g.position.y=r.h/2;let _=[-1,1].map(T=>{let E=new Zt;E.position.set(T*(r.w/2),r.h*.58,0);let A=new K(Rn(.42,.32,r.d*.42,.06),c);return A.position.x=T*.19,E.add(A),E.userData.side=T,E}),[m,d]=r.eye,S=[-1,1].map(T=>{let E=new K(Rn(m,d,.06,.02),l);return E.position.set(T*r.w*.25,r.h*.64,r.d/2+.01),E});p.add(g,..._,...S);let w=null,v=r.legH+r.h;if(r.crown==="gem")w=new K(new kr(.2,0),new Re({color:i,emissive:i,emissiveIntensity:.2,roughness:.3,flatShading:!0})),w.position.y=r.h+.55,w.scale.y=1.35,p.add(w),v+=.95;else if(r.crown==="periscope"){let T=new K(Rn(.12,.5,.12,.04),l);T.position.set(r.w*.28,r.h+.25,0);let E=new K(Rn(.3,.2,.3,.06),h);E.position.set(r.w*.28,r.h+.58,.05),p.add(T,E),v+=.7}else if(r.crown==="cap"){let T=new K(Rn(r.w*.9,.14,r.d*1.05,.04),h);T.position.y=r.h+.07;let E=new K(Rn(r.w*.6,.06,.4,.03),h);E.position.set(0,r.h+.03,r.d/2+.15),p.add(T,E),v+=.15}else if(r.crown==="glasses"){for(let E of[-1,1]){let A=new K(Rn(m+.16,d+.14,.05,.03),h);A.position.set(E*r.w*.25,r.h*.64,r.d/2+.005),p.add(A)}let T=new K(Rn(r.w*.2,.05,.05,.02),h);T.position.set(0,r.h*.68,r.d/2+.02),p.add(T);for(let E of S)E.position.z+=.03}else if(r.crown==="antennae"){for(let T of[-1,1]){let E=new K(Rn(.08,.36,.08,.03),l);E.position.set(T*r.w*.2,r.h+.16,0),E.rotation.z=-T*.35;let A=new K(Rn(.16,.16,.16,.05),h);A.position.set(T*(r.w*.2+.12),r.h+.36,0),p.add(E,A)}v+=.45}a.add(p,...u),o.traverse(T=>{T.isMesh&&(T.castShadow=!0,s&&(T.userData.pick=s))});for(let T of S)T.castShadow=!1;return{root:o,rig:a,top:p,eyes:S,arms:_,legs:u,bulb:w,bodyMat:c,inkMat:l,accentMat:h,height:v,seed:Math.random()*10,blinkAt:1+Math.random()*3}}function hl(n,t,{busy:e=0,look:i=0,hop:s=0,alarm:r=!1,asleep:o=!1}={}){let a=Math.sin(t*(o?.9:2)+n.seed)*.02,c=Math.sin(Math.min(1,s)*Math.PI)*.5;n.rig.position.y=c,n.top.scale.set(1+a*.5,1-a,1+a*.5),n.top.position.y=n.legs[0].position.y*2+e*Math.abs(Math.sin(t*8+n.seed))*.06,n.rig.rotation.y+=(i-n.rig.rotation.y)*.08,n.top.rotation.z=e*Math.sin(t*4+n.seed)*.04;for(let h of n.legs)h.rotation.x=e*Math.sin(t*14+h.userData.phase)*.35,h.scale.y=1-c*.4;for(let h of n.arms){let u=h.userData.side,f=e*Math.sin(t*9+n.seed+(u>0?Math.PI:0))*.35;h.rotation.z=u*(r?1.1+Math.sin(t*7)*.2:f+c*.7)}t>n.blinkAt+.14&&(n.blinkAt=t+2+Math.random()*4);let l=o||t>n.blinkAt&&t<n.blinkAt+.14;for(let h of n.eyes)h.scale.y=l?.15:1;n.bulb&&(n.bulb.rotation.y=t*(.6+e*2.4),n.bulb.position.y=n.bulb.userData.y??=n.bulb.position.y,n.bulb.position.y+=Math.sin(t*2+n.seed)*.06,n.bulb.material.emissiveIntensity=.15+e*(.55+.35*Math.sin(t*8)))}function gf(n,t=!1){let e=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},o={},a=n[0].morphTargetsRelative,c=new Je,l=0;for(let h=0;h<n.length;++h){let u=n[h],f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in u.attributes){if(!i.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.attributes[p]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(u.morphAttributes[p])}if(t){let p;if(e)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,p,h),l+=p}}if(e){let h=0,u=[];for(let f=0;f<n.length;++f){let p=n[f].index;for(let g=0;g<p.count;++g)u.push(p.getX(g)+h);h+=n[f].attributes.position.count}c.setIndex(u)}for(let h in r){let u=mf(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let f=0;f<u;++f){let p=[];for(let _=0;_<o[h].length;++_)p.push(o[h][_][f]);let g=mf(p);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function mf(n){let t,e,i,s=-1,r=0;for(let l=0;l<n.length;++l){let h=n[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}let o=new t(r),a=new Ze(o,e,i),c=0;for(let l=0;l<n.length;++l){let h=n[l];if(h.isInterleavedBufferAttribute){let u=c/e;for(let f=0,p=h.count;f<p;f++)for(let g=0;g<e;g++){let _=h.getComponent(f,g);a.setComponent(f+u,g,_)}}else o.set(h.array,c);c+=h.count*e}return s!==void 0&&(a.gpuType=s),a}var we=2.4,gs=46,io=1.7,Qn=3,$t=(n,t,e,i=.8)=>new lr(n,t,e,2,Math.min(i,n/2,t/2,e/2)),Oi=null;function ky(){if(Oi)return Oi;let n=document.createElement("canvas");n.width=n.height=256;let t=n.getContext("2d");t.fillStyle="#ffffff",t.fillRect(0,0,256,256);for(let e=0;e<8;e++){let i=e*32;t.fillStyle=`rgba(0,0,0,${.03+e%3*.015})`,t.fillRect(0,i,256,32),t.fillStyle="rgba(0,0,0,0.12)",t.fillRect(0,i,256,1.5);let s=e*97%256;t.fillRect(s,i,1.5,32),t.fillRect((s+128)%256,i,1.5,32)}return Oi=new os(n),Oi.wrapS=Oi.wrapT=is,Oi.colorSpace=Ae,Oi.anisotropy=4,Oi}var ph={};function zy(n){if(ph[n])return ph[n];let t=document.createElement("canvas");t.width=t.height=128;let e=t.getContext("2d");if(e.fillStyle="#ffffff",e.fillRect(0,0,128,128),n==="checker")e.fillStyle="rgba(0,0,0,0.13)",e.fillRect(0,0,64,64),e.fillRect(64,64,64,64);else{e.fillStyle="rgba(0,0,0,0.04)",e.fillRect(0,0,64,64),e.fillRect(64,64,64,64),e.fillStyle="rgba(0,0,0,0.08)";for(let s of[0,64])e.fillRect(s,0,1,128),e.fillRect(0,s,128,1)}let i=new os(t);return i.wrapS=i.wrapT=is,i.colorSpace=Ae,i.anisotropy=4,ph[n]=i}function mh(n,t,e,i="planks"){let s=(i==="planks"?ky():zy(i)).clone();s.needsUpdate=!0;let r=i==="planks"?90:i==="checker"?40:70;return s.repeat.set(t/r,e/r),new Re({color:n,map:s,roughness:.8})}function gh(n){let t=2166136261;for(let e of String(n))t=Math.imul(t^e.charCodeAt(0),16777619)>>>0;return()=>(t=Math.imul(t^t>>>15,2246822507)>>>0,t=Math.imul(t^t>>>13,3266489909)>>>0,((t^=t>>>16)>>>0)/4294967296)}var kt=(n,t={})=>new Re({color:n,roughness:.7,...t}),xs=new Re({color:"#bfe3f7",emissive:"#bfe3f7",emissiveIntensity:.4,roughness:.15}),ro=new Re({color:"#fbf6ec",emissive:"#ffcf7a",emissiveIntensity:.55,side:sn,roughness:.6});function ys(n){return n.traverse(t=>{t.isMesh&&(t.castShadow=!0,t.receiveShadow=!0)}),n}var Hy=new Set([xs,ro]),Vy=(n,t)=>`${Hy.has(t)||t.map?t.uuid:`${t.type}|${t.color?.getHex()}|${t.emissive?.getHex()}|${t.emissiveIntensity}|${t.roughness}|${t.metalness}|${t.side}`}|${n.castShadow}|${n.receiveShadow}`;function oo(n,t=[]){n.updateMatrixWorld(!0);let e=n.matrixWorld.clone().invert(),i=new Set;for(let r of t)r.traverse(o=>i.add(o));let s=new Map;n.traverse(r=>{if(!r.isMesh||i.has(r)||r===n||r.children.length||Array.isArray(r.material)||r.material.transparent||r.matrixWorld.determinant()<0)return;let o=Vy(r,r.material);s.has(o)||s.set(o,[]),s.get(o).push(r)});for(let r of s.values()){if(r.length<2)continue;let o=r.map(u=>{let f=u.geometry.index?u.geometry.toNonIndexed():u.geometry.clone();return f.clearGroups(),f.applyMatrix4(e.clone().multiply(u.matrixWorld))}),a=Object.keys(o[0].attributes).filter(u=>o.every(f=>f.attributes[u]));for(let u of o)for(let f of Object.keys(u.attributes))a.includes(f)||u.deleteAttribute(f);let c=gf(o);for(let u of o)u.dispose();if(!c)continue;let l=r[0],h=new K(c,l.material);h.castShadow=l.castShadow,h.receiveShadow=l.receiveShadow;for(let u of r)u.removeFromParent();n.add(h)}return n}function Gy(n,t){let e=new Zt,i=kt(n.woodDark),s=new K($t(44,30,11,1),i);s.position.y=15,e.add(s);for(let r of[4,15.5]){let o=-19;for(;o<17;){let a=2.2+t()*2.2,c=7+t()*3,l=new K($t(a,c,7.5,.4),kt(n.books[Math.floor(t()*n.books.length)]));l.position.set(o+a/2,r+c/2,2.4),l.rotation.z=t()<.12?.25:0,e.add(l),o+=a+.4,t()<.1&&(o+=4)}}s.scale.z=.35,s.position.z=-3.5;for(let r of[.8,12.6,24.4,29]){let o=new K($t(44,1.6,11,.4),i);o.position.y=r,e.add(o)}for(let r of[-21.2,21.2]){let o=new K($t(1.6,30,11,.4),i);o.position.set(r,15,0),e.add(o)}return ys(e)}function dl(n,t){let e=new Zt;e.userData.plant=t()*10;let i=new K(new xe(5,3.8,8,20),kt(n.pot));i.position.y=4,e.add(i);let s=kt(n.leaf,{roughness:.6}),r=5+Math.floor(t()*3);for(let o=0;o<r;o++){let a=new K(new Br(3.4+t()*2,0),s),c=o/r*Math.PI*2;a.position.set(Math.cos(c)*3,11+t()*9,Math.sin(c)*3),a.scale.y=1.3,e.add(a)}return oo(ys(e))}function Wy(n){let t=new Zt,e=kt(n.woodDark),i=new K(new xe(3.6,4,1.2,20),e);i.position.y=.6;let s=new K(new xe(.45,.45,26,8),e);s.position.y=13;let r=new K(new xe(3.4,6,7,24,1,!0),ro);return r.position.y=28,t.add(i,s,r),ys(t),r.castShadow=!1,t}function Xy(n,t){let e=new Zt,i=kt(n.trim),s=new K(new En(t,15),xs);s.position.set(0,18,.3),e.add(s);for(let[r,o,a,c]of[[0,25.8,t+2,1.6],[0,10.2,t+3,1.8],[-t/2-.4,18,1.6,17],[t/2+.4,18,1.6,17],[0,18,1,15],[0,18,t,1]]){let l=new K($t(a,c,1.6,.3),i);l.position.set(r,o,.9),e.add(l)}return e}function $y(n,t){let e=new Zt,i=new K($t(14,11,1,.3),kt(n.woodDark));i.position.set(0,20,.6);let s=new K(new En(11,8),kt(n.books[Math.floor(t()*n.books.length)]));s.position.set(0,20,1.15);let r=new K(new Js(1.8,20),kt(n.trim));return r.position.set(2.5,21,1.2),e.add(i,s,r),e}function qy(n,t){let e=new Zt,i=kt(n.books[Math.floor(t()*n.books.length)],{roughness:.9}),s=new K($t(30,6,13,2.5),i);s.position.y=5;let r=new K($t(30,10,4,2),i);r.position.set(0,10,-5);let o=[-1,1].map(a=>{let c=new K($t(4,9,13,2),i);return c.position.set(a*15,6.5,0),c});return e.add(s,r,...o),ys(e)}function xf({w:n,d:t,name:e,colors:i}){let s=gh(e),r=new Zt,o=new K($t(n,we,t,.6),mh(i.wood,n,t));o.position.y=we/2,o.receiveShadow=!0,r.add(o);let a=kt(i.wall,{roughness:.92}),c=kt(i.trim),l=[[n+Qn*2,0,-t/2-Qn/2,"back"],[t,-n/2-Qn/2,0,"side"],[t,n/2+Qn/2,0,"side"]];for(let[p,g,_,m]of l){let d=m==="back"?$t(p,gs,Qn,.6):$t(Qn,gs,p,.6),S=new K(d,a);S.position.set(g,gs/2,_),S.castShadow=S.receiveShadow=!0;let w=new K(m==="back"?$t(p+1,1.6,Qn+1.2,.4):$t(Qn+1.2,1.6,p+1,.4),c);w.position.set(g,gs+.6,_);let v=new K(m==="back"?$t(p+.6,2.4,Qn+.8,.3):$t(Qn+.8,2.4,p+.6,.3),c);v.position.set(g,we+1.2,_),r.add(S,w,v)}let h=-t/2+1,u=(p,g,_,m,d=io)=>{p.scale.setScalar(d),p.position.set(g,_,m),r.add(p)};u(Gy(i,s),-n/2+48+s()*10,we,h+9.5),u(Xy(i,Math.min(46,n*.12)),n*.02,-8,h),n>300&&u($y(i,s),n*.24,-6,h),u(dl(i,s),n/2-18,we,h+16),u(dl(i,s),-n/2+16,we,t/2-20,io*.8),u(Wy(i),n/2-16,we,t/2-18,io*.9),n>380&&s()<.8&&u(qy(i,s),n*.27,we,h+18);let f=yf(r);return oo(r,f),{group:r,floor:o,wallMat:a,plants:f}}var yf=n=>{let t=[];return n.traverse(e=>{e.userData.plant!==void 0&&t.push(e)}),t};function vf(n){let t=new K(new xe(30,30,.6,48),kt(n,{roughness:1}));return t.scale.z=.82,t.position.y=we+.3,t.receiveShadow=!0,t}var _f=["#7cc4ff","#f6a6c1","#ffd479","#a7e3a1","#c9b6ff","#e8e2d6"];function Mf(n,t){let e=new Zt,i=kt(n.woodDark),s=new K($t(58,2.6,22,.8),kt(n.desk));s.position.y=17,e.add(s);for(let E of[-26,26]){let A=new K($t(3,16,18,.6),i);A.position.set(E,8,0),e.add(A)}let r=kt("#2b2a2e",{roughness:.5}),o=new K($t(3,6,3,.6),r);o.position.set(0,21,-5);let a=new K($t(11,1,7,.4),r);a.position.set(0,18.8,-5);let c=new K($t(34,21,2,1),r);c.position.set(0,34,-5),e.add(o,a,c);let l=document.createElement("canvas");l.width=160,l.height=96;let h=new os(l);h.colorSpace=Ae;let u=new K(new En(31,18),new en({map:h,toneMapped:!1}));u.position.set(0,34,-3.9),e.add(u);let f=new K($t(18,1,6,.4),kt(n.trim));f.position.set(-3,18.8,5);let p=new K(new xe(2.2,2,4.4,16),kt(t));p.position.set(20,20.6,4),e.add(f,p),ys(e),u.castShadow=u.receiveShadow=!1;let g=l.getContext("2d"),_=Array.from({length:40},(E,A)=>({indent:[0,1,2,1,2,3,1,0][A%8]*10,parts:Array.from({length:1+A*7%4},(P,M)=>({w:8+(A*13+M*29)%36,c:_f[(A+M*3)%_f.length]}))})),m=0,d=-1,S="";function w(E,A,P){if(!(A!=="busy"&&A===S)&&!(A==="busy"&&E-d<.12)){if(d=E,S=A,g.fillStyle=A==="off"?"#141416":"#1f2433",g.fillRect(0,0,160,96),A==="off"){h.needsUpdate=!0;return}g.fillStyle=P,g.fillRect(0,0,160,7),g.globalAlpha=A==="busy"?1:.55,A==="busy"&&(m=(m+1)%_.length);for(let M=0;M<9;M++){let y=_[(M+m)%_.length],C=8+y.indent;for(let U of y.parts)g.fillStyle=U.c,g.fillRect(C,13+M*9,U.w,4),C+=U.w+4}A==="busy"&&Math.floor(E*3)%2&&(g.fillStyle="#ffffff",g.fillRect(8,85,5,5)),g.globalAlpha=1,h.needsUpdate=!0}}let v=[0,.5].map(E=>{let A=new K(new Zn(1.1,10,10),new en({color:"#ffffff",transparent:!0,opacity:0,depthWrite:!1}));return A.userData.offset=E,e.add(A),A});function T(E,A){for(let P of v){let M=(E*.5+P.userData.offset)%1;P.position.set(20+Math.sin(M*7+P.userData.offset*5),23+M*10,4),P.scale.setScalar(.6+M),P.material.opacity=A?.5*(1-M)*Math.min(1,M*5):0}}return oo(e,[u,p,...v]),{group:e,draw:w,steam:T,mug:p}}var so=180,_s=150;function Sf(n){let t=new Zt,e=gh("coffee"),i=new K($t(so,1.4,_s,.6),mh(n.tile,so,_s,"checker"));i.position.y=.7,i.receiveShadow=!0,t.add(i);let s=-_s/2+14,r=new K($t(120,22,24,1),kt(n.counter));r.position.set(-25,11,s);let o=new K($t(124,2.4,26,.6),kt(n.woodDark));o.position.set(-25,23,s),t.add(r,o);for(let y of[-70,-40,-10,20]){let C=new K($t(6,1,1,.3),kt(n.trim));C.position.set(y,18,s+12.4),t.add(C)}let a=new Zt,c=new K($t(20,24,15,2),kt("#3a3633",{roughness:.4}));c.position.y=12;let l=new K($t(20,4,18,1),kt("#4a4541"));l.position.set(0,23,1.5);let h=new K(new Zn(1,12,12),new en({color:"#ff6a4d"}));h.position.set(6,17,7.6);let u=new K(new xe(2.4,2,4.4,16),kt(n.trim));u.position.set(-2,3,8.5),a.add(c,l,h,u),a.position.set(-55,24.2,s-1),t.add(a),n.mugs.forEach((y,C)=>{let U=new K(new xe(2.2,2,4.6,14),kt(y));U.position.set(-28+C*6.5,26.5,s+5-C%2*4),t.add(U)});let f=new K(new xe(4,4,9,18),kt(n.window,{transparent:!0,opacity:.75,roughness:.2}));f.position.set(18,29,s-2),t.add(f);let p=new K($t(28,60,24,2),kt(n.fridge));p.position.set(55,30,s);let g=new K($t(1.6,14,1.6,.5),kt("#9a948c"));g.position.set(44,40,s+12.6),t.add(p,g);let _=new Zt,m=new K(new xe(20,20,2.4,32),kt(n.desk));m.position.y=20;let d=new K(new xe(1.6,1.6,19,10),kt(n.woodDark));d.position.y=10;let S=new K(new xe(8,9,1.4,20),kt(n.woodDark));S.position.y=.7,_.add(m,d,S);for(let y=0;y<3;y++){let C=-Math.PI/2+(y-1)*1.6+Math.PI,U=new K(new xe(6,5.4,12,18),kt(n.mugs[(y*2+1)%n.mugs.length]));U.position.set(Math.cos(C)*28,6,Math.sin(C)*28),_.add(U)}for(let y=0;y<2;y++){let C=new K(new xe(2.2,2,4.4,14),kt(n.mugs[y*3%n.mugs.length]));C.position.set(-6+y*11,23.4,3-y*6),_.add(C)}_.position.set(-10,1.4,38),t.add(_);let w=dl(n,e);w.scale.setScalar(io),w.position.set(so/2-14,1.4,_s/2-18),t.add(w),ys(t),i.castShadow=!1,h.castShadow=!1;let v=new en({color:"#ffffff",transparent:!0,opacity:.5,depthWrite:!1}),T=Array.from({length:5},(y,C)=>{let U=new K(new Zn(2.4,12,12),v.clone());return U.userData.offset=C/5,t.add(U),U}),E=new D(-57,24.2+27,s+2);function A(y){for(let C of T){let U=(y*.35+C.userData.offset)%1;C.position.set(E.x+Math.sin(U*6+C.userData.offset*9)*2.5,E.y+U*22,E.z),C.scale.setScalar(.6+U*1.4),C.material.opacity=.45*(1-U)*Math.min(1,U*6)}}let P=[...[.25,1,1.75,2.5,-.5,3.4].map(y=>new D(-10+Math.cos(y)*38,1.4,38+Math.sin(y)*30)),...[-62,-30,2].map(y=>new D(y,1.4,s+34))],M=new D(-10,1.4,38);return oo(t,T),{group:t,animate:A,spots:P,tableAt:M}}var ul=64;function bf({W:n,D:t,colors:e}){let i=new Zt,s=new K(new nn(n,.4,t),mh(e.carpet,n,t,"carpet"));s.position.y=.2,s.receiveShadow=!0,i.add(s);let r=kt(e.outerWall,{roughness:.95}),o=kt(e.trim),a=xs,c=5;for(let[E,A,P,M]of[[n+c*2,0,-t/2-c/2,!0],[t,-n/2-c/2,0,!1],[t,n/2+c/2,0,!1]]){let y=new K(M?$t(E,ul,c,1):$t(c,ul,E,1),r);y.position.set(A,ul/2,P),y.receiveShadow=y.castShadow=!0;let C=new K(M?$t(E+2,2.4,c+2,.6):$t(c+2,2.4,E+2,.6),o);C.position.set(A,ul+1,P),i.add(y,C)}let l=Math.max(2,Math.floor(n/110));for(let E=0;E<l;E++){let A=-n/2+n/l*(E+.5),P=new K(new En(56,36),a);P.position.set(A,34,-t/2+.8),i.add(P);for(let[M,y,C,U]of[[0,52.5,60,2.4],[0,15.5,62,3],[-29,34,2.4,38],[29,34,2.4,38],[0,34,1.6,36]]){let z=new K($t(C,U,2,.4),o);z.position.set(A+M,y,-t/2+1.4),i.add(z)}}let h=gh("office");for(let[E,A]of[[-n/2+18,-t/2+18],[n/2-18,-t/2+18],[-n/2+18,t/2-18]]){let P=dl(e,h);P.scale.setScalar(io*1.3),P.position.set(E,.4,A),i.add(P)}let u=new Zt,f=new K($t(14,26,14,1.5),kt(e.fridge));f.position.y=13;let p=new K(new xe(6,6,16,20),kt(e.sky,{transparent:!0,opacity:.7,roughness:.1}));p.position.y=34,u.add(f,p),u.position.set(n/2-16,.4,t/2-22),i.add(u);let g=new Zt,_=new K(new xe(9,9,1.6,32),kt(e.woodDark));_.rotation.x=Math.PI/2;let m=new K(new Js(7.8,32),kt(e.trim));m.position.z=.9,g.add(_,m);for(let E=0;E<12;E++){let A=new K(new nn(.6,E%3?1:1.8,.2),kt("#2b2a2e")),P=E/12*Math.PI*2;A.position.set(Math.sin(P)*6.6,Math.cos(P)*6.6,1),A.rotation.z=-P,g.add(A)}let d=(E,A,P)=>{let M=new Zt,y=new K(new nn(A,E,.3),kt(P));return y.position.y=E/2-.6,M.add(y),M.position.z=1.2,g.add(M),M},S=d(4.4,1,"#2b2a2e"),w=d(6.4,.6,"#2b2a2e"),v=d(6.8,.25,"#e0573f");g.position.set(-n/2+n/l,46,-t/2+1.2),i.add(g),ys(i),s.castShadow=!1;let T=yf(i);return oo(i,[...T,S,w,v]),{group:i,plants:T,clock:{hour:S,minute:w,second:v}}}var wf="agent-office-muted",Fe=null,Ms=null,cr=!1;try{cr=localStorage.getItem(wf)==="1"}catch{}var Ef=new Map,pl=()=>cr;function Tf(n){cr=n;try{localStorage.setItem(wf,n?"1":"0")}catch{}Ms&&(Ms.gain.value=cr?0:.5)}function Af(){if(Fe){Fe.state==="suspended"&&Fe.resume();return}let n=window.AudioContext||window.webkitAudioContext;n&&(Fe=new n,Ms=Fe.createGain(),Ms.gain.value=cr?0:.5,Ms.connect(Fe.destination))}function vs(n,t){if(!Fe||cr||document.hidden)return!1;let e=Fe.currentTime;return e-(Ef.get(n)??-1)<t?!1:(Ef.set(n,e),!0)}function Bi({freq:n,to:t,type:e="sine",dur:i=.15,gain:s=.1,at:r=0,attack:o=.005}){let a=Fe.currentTime+r,c=Fe.createOscillator(),l=Fe.createGain();c.type=e,c.frequency.setValueAtTime(n,a),t&&c.frequency.exponentialRampToValueAtTime(t,a+i),l.gain.setValueAtTime(0,a),l.gain.linearRampToValueAtTime(s,a+o),l.gain.exponentialRampToValueAtTime(1e-4,a+i),c.connect(l).connect(Ms),c.start(a),c.stop(a+i+.05)}var fl=null;function _h({dur:n=.03,gain:t=.05,freq:e=3e3,q:i=1.5,type:s="bandpass",to:r,at:o=0}){if(!fl){fl=Fe.createBuffer(1,Fe.sampleRate*.5,Fe.sampleRate);let u=fl.getChannelData(0);for(let f=0;f<u.length;f++)u[f]=Math.random()*2-1}let a=Fe.currentTime+o,c=Fe.createBufferSource();c.buffer=fl;let l=Fe.createBiquadFilter();l.type=s,l.frequency.setValueAtTime(e,a),r&&l.frequency.exponentialRampToValueAtTime(r,a+n),l.Q.value=i;let h=Fe.createGain();h.gain.setValueAtTime(t,a),h.gain.exponentialRampToValueAtTime(1e-4,a+n),c.connect(l).connect(h).connect(Ms),c.start(a,Math.random()*.4),c.stop(a+n+.02)}var ki={keys(){vs("keys",.09)&&(_h({dur:.025,gain:.05,freq:2600+Math.random()*1400,q:2}),_h({dur:.02,gain:.03,freq:3200+Math.random()*1200,q:2,at:.06+Math.random()*.04}))},chime(){vs("chime",.4)&&(Bi({freq:1046.5,dur:.7,gain:.05}),Bi({freq:1318.5,dur:.9,gain:.045,at:.09}))},bonk(){vs("bonk",.3)&&Bi({freq:240,to:150,type:"triangle",dur:.22,gain:.08})},pop(){vs("pop",.15)&&Bi({freq:520,to:980,dur:.09,gain:.06})},hello(){vs("hello",.5)&&(Bi({freq:880,to:1046,type:"triangle",dur:.08,gain:.04}),Bi({freq:1175,to:1397,type:"triangle",dur:.1,gain:.035,at:.1}))},clink(){vs("clink",.3)&&(Bi({freq:2637,dur:.18,gain:.025}),Bi({freq:3520,dur:.14,gain:.018,at:.02}))},hush(){vs("hush",1)&&_h({dur:.6,gain:.05,freq:400,to:3e3,q:.7})}};var Ih=160,Ff=44,Of=76,Yy=52,Zy=80,gl=70,Jy=-34,hr=96,Sh=185,Ky=n=>n<=2?Math.max(1,n):n<=4?2:3,ur=.78,_l=18,bh=9,Rf=3,jy=4,Bf=2500,Qy=12e4,tv=120,ev=10,nv=1.2,iv=38,Cf=21,kf=.08,sv=1e-5,xh=[[0,-62],[-32,-62],[32,-62],[-64,-62],[64,-62],[-16,-90],[16,-90],[-48,-90],[48,-90],[-76,-4],[76,-4],[-76,20],[76,20]],rv=n=>{let[t,e]=xh[n%xh.length],i=Math.floor(n/xh.length);return[t+i*10,e+i*6]},zf=new Vt("#1c1a17"),_i=["coral","teal","mustard","lilac","sky","leaf","pink"],ov={Explore:"sky",Plan:"lilac","general-purpose":"leaf","code-reviewer":"pink","test-runner":"mustard"},Eh=["a","b","c","d","e","f"],ni=n=>`${Math.round(n*100)}%`,ei=n=>n>=.85?"crit":n>=.6?"warn":"ok",El=n=>{let t=0;for(let e of String(n??""))t=t*31+e.charCodeAt(0)>>>0;return t},bs=n=>ov[n]??_i[El(n)%_i.length],dr=n=>_i[El(n)%_i.length],Ph=n=>Eh[El(n)%Eh.length],Dh=Ph,$e,be,ho,oe,Jt,jt,mn,wh,lo,Oe,Pt={},Be=new Map,je=new Map,ke=new Map,xl=[],yl=[],vl=[],Sl=null,zi=null,Vn=null,gi=null,bl="",Lh=()=>{},wl=0,ti={left:0,right:0,top:0,bottom:0},Hn=null,mi=null,ao=0,Th=0,ml=0,Ss=new D,Gn=()=>performance.now()/1e3;function Uh(n,{pick:t}){$e=n,Lh=t,be=new rl({antialias:!0}),be.setPixelRatio(Math.min(2,devicePixelRatio)),be.shadowMap.enabled=!0,be.shadowMap.type=ha,be.shadowMap.autoUpdate=!1,be.outputColorSpace=Ae,$e.append(be.domElement),ho=new cl,ho.domElement.className="labels",$e.append(ho.domElement),Oe=document.createElement("div"),Oe.className="bubble",Oe.hidden=!0,$e.append(Oe),oe=new Ur,Jt=new We(32,1,1,6e3),jt=new ll(Jt,be.domElement),jt.enableDamping=!0,jt.dampingFactor=kf,jt.enableRotate=!1,jt.screenSpacePanning=!1,jt.mouseButtons={LEFT:wn.PAN,MIDDLE:wn.PAN,RIGHT:wn.PAN},jt.touches={ONE:kn.PAN,TWO:kn.PAN},jt.minDistance=120,jt.maxDistance=4e3,jt.enableZoom=!1,jt.addEventListener("start",()=>{Hn=null}),be.domElement.addEventListener("wheel",Ev,{passive:!1}),wh=new Gr("#ffffff","#d8cfc2",1.6),oe.add(wh),mn=new Xr("#fffaf2",2.1),mn.position.set(-90,220,120),mn.castShadow=!0,mn.shadow.mapSize.set(2048,2048),mn.shadow.radius=6,mn.shadow.bias=-5e-4,mn.shadow.normalBias=.6,oe.add(mn,mn.target),lo=new K(new En(8e3,8e3),new en),lo.rotation.x=-Math.PI/2,lo.position.y=-.2,oe.add(lo),yh(),matchMedia("(prefers-color-scheme: dark)").addEventListener("change",yh),new MutationObserver(yh).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),Lv(),new ResizeObserver(Df).observe($e),Df(),wl=Th=Gn()}function yh(){let n=getComputedStyle(document.documentElement),t=["floor","line","ok","warn","crit","clay","thread","scene","wood","wood-dark","trim","pot","glow","window","gem","desk","tile","counter","fridge","carpet","outer-wall","night","dawn","dusk",..._i,...Eh.map(e=>`room-${e}`)];for(let e of t)Pt[e]=new Vt(n.getPropertyValue(`--${e}`).trim()||"#888");oe.background=Pt.scene,lo.material.color.copy(Pt.scene);for(let e of Be.values())e.mesh&&oe.remove(e.mesh),e.w=null;le&&(oe.remove(le.group),le=null),gn&&(oe.remove(gn.group),gn=null),bl="";for(let e of je.values())e.track.material.color.copy(Pt.line),e.char.bulb.material.color.copy(Pt.gem),e.char.bulb.material.emissive.copy(Pt.gem),e.rug.material.color.copy(Vf(e.tint,e.room)),Gf(e),e.gaugeKey="";for(let e of ke.values())e.char.accentMat.color.copy(Hf(e.tint));Ch=-1}var Hf=n=>Pt[n].clone().multiplyScalar(.62),Vf=(n,t)=>Pt[n].clone().lerp(Pt[`room-${t}`]??Pt.line,.62);function Tl(n){return{wood:Pt.wood,woodDark:Pt["wood-dark"],wall:Pt[`room-${n??"a"}`],trim:Pt.trim,pot:Pt.coral.clone().lerp(Pt["wood-dark"],.35),leaf:Pt.leaf,shade:Pt.trim,glow:Pt.glow,sky:Pt.window,window:Pt.window,desk:Pt.desk,tile:Pt.tile,counter:Pt.counter,fridge:Pt.fridge,carpet:Pt.carpet,outerWall:Pt["outer-wall"],books:_i.map(t=>Pt[t]),mugs:_i.map(t=>Pt[t])}}function Gf(n){n.desk&&n.group.remove(n.desk.group),n.desk=Mf(Tl(n.room),Pt[n.tint]),n.desk.group.position.set(0,we,Jy),n.desk.group.traverse(t=>{t.isMesh&&(t.userData.pick={kind:"session",id:n.id})}),n.group.add(n.desk.group)}function Nh(n,t){let e=document.createElement("div");return e.className=`tag ${t}`,e.innerHTML=n,{obj:new eo(e),el:e}}function Ah(n,t){let e=document.createElement("div");return e.className=`flag ${n}`,e.innerHTML=t,{obj:new eo(e),el:e}}function Al(n,t,e,i=Math.PI*2){let s=new K(new zr(n,t,96,1,Math.PI/2,-i),new en({color:e,side:sn,transparent:!0}));return s.rotation.x=-Math.PI/2,s.position.y=we+.9,s}var le=null,gn=null,If="",on=null;function av(){return le||(le={...Sf(Tl("a")),w:so,d:_s,target:new D,center:new D,placed:!1,taken:new Set,label:Nh('<span class="pname">Coffee corner</span>',"project coffee")},le.label.obj.position.set(-25,62,-_s/2+14),le.group.add(le.label.obj),oe.add(le.group),le)}function lv(n,t){let e=`${Math.round(n)}x${Math.round(t)}`;gn&&e===If||(gn&&oe.remove(gn.group),gn=bf({W:n,D:t,colors:Tl("a")}),If=e,oe.add(gn.group),cv(n,t))}function cv(n,t){if(!on){let s=new Zt,r=new K(new xe(8,8.4,3,28),new Re({color:"#3b3a3f",roughness:.4}));r.position.y=1.9;let o=new K(new xe(5.4,5.4,.6,24),new Re({color:"#56555c",roughness:.3}));o.position.y=3.6;let a=new K(new Zn(.9,10,10),new en({color:"#56e39f"}));a.position.set(0,3.7,6),s.add(r,o,a),s.traverse(c=>{c.isMesh&&(c.castShadow=!0)}),oe.add(s),on={group:s,led:a,i:0}}let e=n/2-34,i=t/2-34;on.loop=[new D(-e,0,i),new D(e,0,i),new D(e,0,-i+30),new D(-e,0,-i+30)],on.group.position.copy(on.loop[0]),on.i=1}var fr=n=>n.past||n.status==="done",Ml=n=>n.lastAt??n.endedAt??n.startedAt??0;function hv(n){let t=new Map;for(let r of at.values())r.kind!=="session"||!r.project||(t.has(r.project)||t.set(r.project,{live:[],past:[]}),t.get(r.project)[fr(r)?"past":"live"].push(r));let e=[];for(let[r,{live:o,past:a}]of t){o.sort((h,u)=>(h.startedAt??0)-(u.startedAt??0)),a.sort((h,u)=>Ml(u)-Ml(h));let c=[...o,...n?a.slice(0,Rf):[]];if(!c.length)continue;let l=at.get(`p:${r}`);e.push({id:`p:${r}`,name:l?.label??r,live:o.length,hidden:a.length-(n?Math.min(a.length,Rf):0),sessions:c,recent:Math.max(...c.map(Ml))})}let i=e.filter(r=>r.live).sort((r,o)=>r.name.localeCompare(o.name)),s=e.filter(r=>!r.live).sort((r,o)=>o.recent-r.recent).slice(0,jy);return[...i,...s]}function uv(n){let t=Be.get(n.id);t||(t={id:n.id,label:Nh("","project"),center:new D,target:new D},t.label.el.addEventListener("click",()=>kh(gi===n.id?null:n.id)),Be.set(n.id,t));let e=Ky(n.sessions.length),i=e*Sh+Zy,s=Ff+Of+(Math.ceil(n.sessions.length/e)-1)*Ih+Yy;if(t.cols=e,t.w!==i||t.d!==s){t.mesh&&oe.remove(t.mesh);let a=xf({w:i,d:s,name:n.name,colors:Tl(Ph(n.name))});t.mesh=a.group,t.plants=a.plants,t.mesh.position.copy(t.center),t.mesh.add(t.label.obj),oe.add(t.mesh),t.w=i,t.d=s}t.label.obj.position.set(0,gs+8,-s/2);let r=n.hidden>0?`<span class="pmore">+${n.hidden}</span>`:"",o=`<span class="pname">${pt(n.name)}</span>${r}`;return t.html!==o&&(t.label.el.innerHTML=t.html=o),t.label.el.classList.toggle("focused",gi===n.id),t}function dv(n){let t=je.get(n.id);return t||(t={id:n.id,home:new D,group:new Zt,gaugeKey:"",placed:!1},t.tint=dr(n.session),t.room=Ph(at.get(`p:${n.project}`)?.label??n.project),t.body=new Zt,t.char=fh({build:"session",bodyColor:Pt[t.tint],inkColor:zf,accentColor:Pt.gem,pick:{kind:"session",id:n.id}}),t.char.root.scale.setScalar(_l),t.char.root.position.y=we,t.body.add(t.char.root),t.rug=vf(Vf(t.tint,t.room)),t.track=Al(22,23.6,Pt.line),t.label=Nh("","session"),t.label.obj.position.set(0,we,32),t.label.el.addEventListener("click",()=>Lh(n.id)),t.label.el.addEventListener("pointerenter",()=>{zi=n.id,Vn={kind:"session",id:n.id}}),t.label.el.addEventListener("pointerleave",()=>{zi===n.id&&(zi=Vn=null)}),t.zzz=Ah("zzz","<i>z</i><i>z</i><i>z</i>"),t.zzz.obj.position.set(10,we+_l*t.char.height+4,0),t.oops=Ah("oops","!"),t.oops.obj.position.set(0,we+_l*t.char.height+10,0),t.body.add(t.zzz.obj,t.oops.obj),t.group.add(t.rug,t.track,t.body,t.label.obj),Gf(t),t.walkIn=!fr(n)&&Gn()-wl>3,oe.add(t.group),je.set(n.id,t),t)}function fv(n){let t=je.get(n);if(t){oe.remove(t.group);for(let e of[t.label.el,t.zzz.el,t.oops.el])e.remove();je.delete(n);for(let[e,i]of ke)i.session===n&&Wf(e)}}function pv(n,t){let e=ke.get(n.id);if(e)return e;let i=new Set([...ke.values()].filter(a=>a.session===t.id&&!a.gone&&!a.endedAt).map(a=>a.slot)),s=0;for(;i.has(s);)s++;let r=bs(n.type),o=n.status==="done"?-1/0:Gn();return e={id:n.id,session:t.id,slot:s,tint:r,born:o,group:new Zt,gone:n.status==="done"},e.char=fh({build:n.type,bodyColor:Pt[r],inkColor:zf,accentColor:Hf(r),pick:{kind:"agent",id:n.id}}),e.char.root.scale.setScalar(bh),e.oops=Ah("oops small","!"),e.oops.obj.position.set(0,bh*e.char.height+8,0),e.group.add(e.char.root,e.oops.obj),e.group.visible=!e.gone,oe.add(e.group),ke.set(n.id,e),!e.gone&&Gn()-wl>3&&(t.waveAt=Gn(),ki.pop()),e}function Wf(n){let t=ke.get(n);t&&(oe.remove(t.group),t.oops.el.remove(),t.spot!==void 0&&le?.taken.delete(t.spot),ke.delete(n))}function mv(n){let t=[...n.map(o=>Be.get(o.id)),av()],e=Math.max(1,($e.clientWidth||1)-ti.left-ti.right),i=Math.max(1,($e.clientHeight||1)-ti.top-ti.bottom),s=null;for(let o=1;o<=t.length;o++){let a=[];for(let u=0;u<t.length;u+=o)a.push(t.slice(u,u+o));let c=Math.max(...a.map(u=>u.reduce((f,p)=>f+p.w,0)+(u.length-1)*hr))+gl*2,l=a.reduce((u,f)=>u+Math.max(...f.map(p=>p.d)),0)+(a.length-1)*hr+gl*2,h=Math.min(e/(c+60),i/(l*Math.sin(ur)+80));(!s||h>s.scale)&&(s={cols:o,W:c,D:l,scale:h})}let r=-s.D/2+gl;for(let o=0;o<t.length;o+=s.cols){let a=t.slice(o,o+s.cols),c=Math.max(...a.map(u=>u.d)),h=-(a.reduce((u,f)=>u+f.w,0)+(a.length-1)*hr)/2;for(let u of a)u.target.set(h+u.w/2,0,r+u.d/2),u.placed||(u.center.copy(u.target),u.placed=!0),u.rowFront=r+c,h+=u.w+hr;r+=c+hr}return lv(s.W,s.D),{W:s.W,D:s.D}}var In={W:300,D:Ih};function Fh(n=!1){let t=gi&&Be.get(gi),e=t?t.w:In.W,i=t?t.d:In.D,s=t?t.target:new D,r=$e.clientWidth||1,o=$e.clientHeight||1,a={x0:Math.min(ti.left,r*.45),x1:r-Math.min(ti.right,r*.45),y0:Math.min(ti.top,o*.45),y1:o-Math.min(ti.bottom,o*.45)},c=(a.x0+a.x1)/2,l=(a.y0+a.y1)/2,h=(a.x1-a.x0)/2,u=(a.y1-a.y0)/2;Jt.setViewOffset(r,o,r/2-c,o/2-l,r,o);let f=Jt.fov*Math.PI/180,p=2*Math.atan(Math.tan(f/2)*(h/u)),g=Math.max((e+50)/2/Math.tan(p/2),(i*Math.sin(ur)+70)/2/Math.tan(f/2))*(o/(2*u)),_=[];for(let w of[-e/2,e/2])for(let v of[-i/2,i/2+30])for(let T of[0,t?gs+16:66])_.push(new D(s.x+w,T,s.z+v));let m={pos:Jt.position.clone(),quat:Jt.quaternion.clone()},d=new D(s.x,8,s.z);for(let w=0;w<5;w++){Jt.position.set(s.x,Math.sin(ur)*g,s.z+Math.cos(ur)*g),Jt.lookAt(d),Jt.updateMatrixWorld();let v=Math.max(..._.map(T=>{let E=T.clone().project(Jt),A=(E.x+1)/2*r,P=(1-E.y)/2*o;return Math.max(Math.abs(A-c)/(h*.94),Math.abs(P-l)/(u*.94))}));g*=Math.max(.6,v)}let S={pos:new D(s.x,Math.sin(ur)*g,s.z+Math.cos(ur)*g),target:d};t||(jt.maxDistance=g),n||!Pf?(Pf=!0,Jt.position.copy(S.pos),jt.target.copy(S.target),Hn=null):(Jt.position.copy(m.pos),Jt.quaternion.copy(m.quat),Hn=S),mi=null,jt.update(),Object.assign(mn.shadow.camera,{left:-In.W/2-80,right:In.W/2+80,top:In.D/2+100,bottom:-In.D/2-100,near:10,far:900}),mn.shadow.camera.updateProjectionMatrix()}var Pf=!1;function Oh(n){let t=["left","right","top","bottom"].every(e=>Math.abs((ti[e]??0)-n[e])<2);ti=n,t||Fh()}function Rl(n){let t=n&&at.get(n),e=t?.kind==="agent"?at.get(se(t.session)):t;kh(e?.project?`p:${e.project}`:null)}function Bh(n){let t=n&&at.get(n);Vn=t?{kind:t.kind,id:n}:null,zi=t?.kind==="session"?n:null}function kh(n){let t=n&&Be.has(n)?n:null;t===gi&&Hn||(gi=t,Fh())}function Df(){let n=$e.clientWidth,t=$e.clientHeight;be.setSize(n,t),ho.setSize(n,t),Jt.aspect=n/Math.max(1,t),Jt.updateProjectionMatrix(),bl=""}var Xf=()=>In.W/2-gl/2,$f=n=>(n?.rowFront??n?.target.z??0)+hr/2;function qf(n,t,e,i){n.walk={group:t,path:e.map(s=>s.clone()),then:i}}function Lf(n,t){let e=n.walk;if(!e)return!1;let i=tv*t;for(;i>0&&e.path.length;){let s=e.path[0],r=e.group.position,o=s.x-r.x,a=s.z-r.z,c=Math.hypot(o,a);if(c>.01){let h=Math.atan2(o,a)-e.group.rotation.y;h=Math.atan2(Math.sin(h),Math.cos(h)),e.group.rotation.y+=h*Math.min(1,t*10)}c<=i?(r.x=s.x,r.z=s.z,i-=c,e.path.shift()):(r.x+=o/c*i,r.z+=a/c*i,i=0)}return e.path.length?!0:(n.walk=null,e.then?.(),!1)}function gv(n){let t=at.get(n.id);return t&&Be.get(`p:${t.project}`)}function _v(n,t){let e=le,i=e?e.spots.findIndex((h,u)=>!e.taken.has(u)):-1;if(i<0){n.leaving=Gn();return}e.taken.add(i),n.spot=i;let s=gv(t),r=e.target.clone().add(e.spots[i]),o=(El(n.id)%5-2)*9,a=$f(s)+o,c=Xf()+o,l=[new D(n.group.position.x,0,a),new D(c,0,a),new D(c,0,r.z),r];qf(n,n.group,l,()=>{n.onBreak=Gn(),ki.clink();let h=new K(new xe(.17,.15,.32,12),new Re({color:Pt.trim}));h.position.set(.45,-.12,.2),n.char.arms[1].add(h)})}function zh(n){let t=hv(n),e=new Set;for(let r of t)uv(r),r.sessions.forEach(o=>{e.add(o.id),dv(o)});for(let r of[...Be.keys()])t.some(o=>o.id===r)||(oe.remove(Be.get(r).mesh),Be.get(r).label.el.remove(),Be.delete(r));gi&&!Be.has(gi)&&(gi=null);for(let r of[...je.keys()])e.has(r)||fv(r);let i=new Set;for(let r of at.values()){if(r.kind!=="agent")continue;let o=je.get(se(r.session)),a=o&&at.get(o.id);!o||!a||fr(a)||(pv(r,o),i.add(r.id))}for(let r of[...ke.keys()])i.has(r)||Wf(r);let s=t.map(r=>`${r.id}:${r.sessions.map(o=>o.id).join(",")}`).join("|")+`@${$e.clientWidth}x${$e.clientHeight}`;if(s!==bl){bl=s,In=mv(t);for(let r of t){let o=Be.get(r.id);r.sessions.forEach((a,c)=>{let l=je.get(a.id),h=Math.floor(c/o.cols),u=Math.min(o.cols,r.sessions.length-h*o.cols),f=c%o.cols;if(l.home.set(o.target.x-(u-1)*Sh/2+f*Sh,0,o.target.z-o.d/2+Ff+Of+h*Ih),!l.placed&&(l.group.position.copy(l.home),l.placed=!0,l.walkIn)){let p=Xf(),g=$f(o),_=m=>m.sub(l.home);l.body.position.copy(_(new D(p,0,In.D/2+20))),qf(l,l.body,[_(new D(p,0,g)),_(new D(l.home.x,0,g)),new D(0,0,0)],()=>{l.body.rotation.y=0})}})}Fh()}return t}function Rh(n){let t=ke.get(n);if(t&&!t.gone)return t.group.position.clone().add(Ss.set(0,bh*t.char.height,0));let e=je.get(n);return e?e.group.position.clone().add(e.body.position).add(Ss.set(0,we+_l*e.char.height,0)):null}function xv(n,t){let e=new K(new Zn(1.7,16,16),new Re({color:t,roughness:.5,transparent:!0}));e.castShadow=!0,e.position.copy(n),oe.add(e),xl.push({m:e,born:Gn(),from:n.clone(),drift:new D((Math.random()-.5)*6,0,(Math.random()-.5)*6)})}function yv(n){let t=new nn(1.6,.3,1);for(let e=0;e<18;e++){let i=new K(t,new Re({color:Pt[_i[e%_i.length]],transparent:!0}));i.position.copy(n),oe.add(i);let s=Math.random()*Math.PI*2,r=14+Math.random()*18;vl.push({m:i,born:Gn(),vel:new D(Math.cos(s)*r,34+Math.random()*22,Math.sin(s)*r),spin:new D(Math.random()*9,Math.random()*9,Math.random()*9)})}}function Hh(n){let t=Gn(),e=n.agent?He(n.session,n.agent):se(n.session),i=je.get(se(n.session));if(n.kind==="tool.start"||n.kind==="tool.end"&&!n.ok){let s=ke.get(e)??i;if(!s)return;n.kind==="tool.start"?(s.hopAt=t,s.lastAt=t,i&&(i.lookAt=n.agent?e:null),ki.keys()):(s.failAt=t,ki.bonk());let r=Rh(e);r&&xv(r,n.kind==="tool.end"?Pt.crit:Pt[Xl(n.tool)]??Pt.line)}else if(n.kind==="context.compact"&&i&&!n.agent){let s=Al(23,24,Pt[i.tint]);s.position.x=i.group.position.x,s.position.z=i.group.position.z,oe.add(s),yl.push({r:s,born:t}),ki.hush()}else if(n.kind==="turn.start"&&i&&!n.agent)i.hopAt=t;else if(n.kind==="turn.complete"&&i&&!n.agent){let s=Rh(i.id);s&&yv(s),ki.chime()}}var Ch=-1,vh=[[0,"night"],[5.5,"night"],[7,"dawn"],[9,"window"],[16.5,"window"],[18.5,"dawn"],[19.5,"dusk"],[21,"night"],[24,"night"]];function vv(n){if(n-Ch<5)return;Ch=n;let t=new Date,e=t.getHours()+t.getMinutes()/60,i=0;for(;vh[i+1][0]<=e;)i++;let[s,r]=vh[i],[o,a]=vh[i+1],c=(e-s)/Math.max(.01,o-s),l=Pt[r].clone().lerp(Pt[a],c);xs.color.copy(l),xs.emissive.copy(l);let h=r==="night"&&a==="night"?1:r==="window"&&a==="window"?0:r==="night"?1-c:a==="night"?c:.4;xs.emissiveIntensity=.45-h*.15,ro.emissive.copy(Pt.glow),ro.emissiveIntensity=.45+h*1.1,mn.intensity=2.1-h*.7,mn.color.set("#fffaf2").lerp(new Vt("#c9d4ff"),h*.6),wh.intensity=1.6-h*.35}function Mv(n,t){let e=`${ei(t)}:${t.toFixed(3)}`;e!==n.gaugeKey&&(n.gaugeKey=e,n.gauge&&n.group.remove(n.gauge),n.gauge=t>0?Al(14.6,16.6,Pt[ei(t)],Math.max(.05,Math.PI*2*t)):null,n.gauge&&(n.gauge.position.y+=.05,n.group.add(n.gauge)))}function Uf(n,t,e,i){let s=n.failAt?(i-n.failAt)/1.4:1;t.rig.rotation.z=s<1?Math.sin(i*38)*.09*(1-s):0,e.classList.toggle("on",s<1)}function Mh(n,t,e){let i=n.waveAt?(e-n.waveAt)/nv:1;if(i>=1)return;let s=t.arms[0];s.rotation.x=0,s.rotation.z=-(2.1+Math.sin(e*16)*.35)*Math.sin(Math.min(1,i*4)*Math.PI/2)}var co=new Map;function Sv(n){let t=[];for(let e of ke.values())e.gone||e.leaving||!e.endedAt||!(e.walk||e.onBreak)||t.push({view:e,pos:e.group.position,walking:!!e.walk});for(let e of je.values())e.walk&&t.push({view:e,pos:e.group.position.clone().add(e.body.position),walking:!0});for(let e=0;e<t.length;e++)for(let i=e+1;i<t.length;i++){let s=t[e],r=t[i];if(!s.walking&&!r.walking||Math.hypot(s.pos.x-r.pos.x,s.pos.z-r.pos.z)>iv)continue;let o=s.view.id<r.view.id?`${s.view.id}|${r.view.id}`:`${r.view.id}|${s.view.id}`;n-(co.get(o)??-99)<12||(co.set(o,n),s.view.waveAt=r.view.waveAt=n,ki.hello())}co.size>200&&co.clear()}function bv(){let n=[...ke.values()].filter(t=>!t.gone&&!t.walk&&!t.leaving&&t.settled);for(let t=0;t<n.length;t++)for(let e=t+1;e<n.length;e++){let i=n[t].group.position,s=n[e].group.position,r=s.x-i.x,o=s.z-i.z,a=Math.hypot(r,o)||.01;if(a>=Cf)continue;let c=(Cf-a)/2;i.x-=r/a*c,i.z-=o/a*c,s.x+=r/a*c,s.z+=o/a*c}}function Vh(){let n=Gn(),t=Math.min(.1,n-Th);Th=n;let e=Date.now(),i=new Set;for(let s of at.values())s.kind==="tool"&&s.status==="active"&&i.add(s.owner);vv(n);for(let s of Be.values()){s.center.lerp(s.target,.12),s.mesh.position.copy(s.center);for(let r of s.plants??[])r.rotation.z=Math.sin(n*.8+r.userData.plant)*.035}if(le&&(le.center.lerp(le.target,.12),le.group.position.copy(le.center),le.animate(n)),gn){for(let o of gn.plants)o.rotation.z=Math.sin(n*.7+o.userData.plant)*.03;let s=new Date,r=s.getSeconds()+s.getMilliseconds()/1e3;gn.clock.second.rotation.z=-(r/60)*Math.PI*2,gn.clock.minute.rotation.z=-((s.getMinutes()+r/60)/60)*Math.PI*2,gn.clock.hour.rotation.z=-((s.getHours()%12+s.getMinutes()/60)/12)*Math.PI*2}if(on?.loop){let s=on.loop[on.i],r=on.group,o=s.x-r.position.x,a=s.z-r.position.z,c=Math.hypot(o,a),l=22*t;if(c<=l)on.i=(on.i+1)%on.loop.length;else{r.position.x+=o/c*l,r.position.z+=a/c*l;let h=Math.atan2(o,a)-r.rotation.y;h=Math.atan2(Math.sin(h),Math.cos(h)),r.rotation.y+=h*Math.min(1,t*4)}on.led.visible=Math.floor(n*2)%2===0}for(let s of je.values()){let r=at.get(s.id);if(!r)continue;s.group.position.lerp(s.home,.12);let o=fr(r),a=Le(r),c=Lf(s,t),l=i.has(s.id)||e-(r.lastAt??0)<Bf,h=o?0:c||l?1:Math.max(0,1-(n-(s.lastAt??-9))/2.5),u=o||!l&&!c&&e-(r.lastAt??r.startedAt??e)>Qy,f=s.lookAt&&ke.get(s.lookAt),p=f&&!f.endedAt?Math.atan2(f.group.position.x-s.group.position.x,f.group.position.z-s.group.position.z):0;hl(s.char,n,{busy:h,look:c?0:Math.max(-.45,Math.min(.45,p*.3)),hop:s.hopAt?(n-s.hopAt)/.35:1,alarm:!o&&!c&&a>=si,asleep:u}),Uf(s,s.char,s.oops.el,n),Mh(s,s.char,n),s.char.bodyMat.color.copy(Pt[s.tint]).lerp(Pt.line,o?.6:0),s.char.bulb.visible=!o,s.zzz.el.classList.toggle("on",u&&!c),s.desk.draw(n,o?"off":h>.5&&!c?"busy":"idle",`#${Pt[s.tint].getHexString()}`),s.desk.steam(n,!o&&l),Mv(s,a);let g=!o&&a>=si;g&&!s.alarm&&(s.alarm=Al(26.5,27.5,Pt.crit),s.group.add(s.alarm)),!g&&s.alarm&&(s.group.remove(s.alarm),s.alarm=null),s.alarm&&(s.alarm.material.opacity=.35+.45*(Math.sin(n*3)+1)/2);let _=`<span class="sname">${pt(r.label)}</span>${r.context?.tokens?`<span class="pct ${ei(a)}">${ni(a)}</span>`:""}`;s.html!==_&&(s.label.el.innerHTML=s.html=_),s.label.el.classList.toggle("selected",Sl===s.id),s.label.el.classList.toggle("past",o)}for(let s of ke.values()){let r=at.get(s.id),o=je.get(s.session);if(!r||!o||(r.status==="done"&&!s.endedAt&&(s.endedAt=n,s.gone||(s.waveAt=n,o.waveAt=n+.2,s.departAt=n+.9)),s.gone))continue;s.departAt&&n>=s.departAt&&(s.departAt=null,_v(s,o)),Uf(s,s.char,s.oops.el,n);let a=Lf(s,t);if(s.endedAt){if(!a&&s.onBreak&&!s.leaving&&n-s.onBreak>ev&&(s.leaving=n),hl(s.char,n+s.slot,{busy:a?1:0,hop:1}),Mh(s,s.char,n),s.onBreak&&!s.leaving){let f=le.target.clone().add(le.tableAt),p=Math.atan2(f.x-s.group.position.x,f.z-s.group.position.z);s.group.rotation.y+=Math.atan2(Math.sin(p-s.group.rotation.y),Math.cos(p-s.group.rotation.y))*Math.min(1,t*6);let g=Math.sin((n-s.onBreak)*1.3)>.85;s.char.arms[1].rotation.x=g?-1.3:-.5,s.char.arms[1].rotation.z=.35}if(s.leaving){let f=Math.min(1,(n-s.leaving)/1.6);s.group.scale.setScalar(Math.max(.01,1-f)),f>=1&&(s.gone=!0,s.group.visible=!1,s.spot!==void 0&&le?.taken.delete(s.spot))}continue}let[c,l]=rv(s.slot),h=new D(o.group.position.x+c,we,o.group.position.z+l),u=Math.min(1,(n-s.born)/.6);s.group.rotation.y=Math.atan2(o.group.position.x-s.group.position.x,o.group.position.z-s.group.position.z)*.45,hl(s.char,n+s.slot,{busy:r.status==="active"&&(i.has(s.id)||n-(s.lastAt??-9)<1.5)?1:0,hop:s.hopAt?(n-s.hopAt)/.3:1,alarm:r.status==="active"&&Le(r)>=si}),Mh(s,s.char,n),s.group.scale.setScalar(Math.max(.01,u<1?u*(1+.2*Math.sin(u*Math.PI)):1)),h.y=we+(1-u)*(1-u)*40,s.group.position.lerp(h,u<1||!s.settled?1:.1),s.settled=!0}ml%3===0&&Sv(n),bv();for(let s=xl.length-1;s>=0;s--){let r=xl[s],o=(n-r.born)/1.6;if(o>=1){oe.remove(r.m),r.m.geometry.dispose(),r.m.material.dispose(),xl.splice(s,1);continue}r.m.position.copy(r.from).addScaledVector(r.drift,o).add(Ss.set(0,o*16,0)),r.m.material.opacity=1-o*o}for(let s=yl.length-1;s>=0;s--){let r=yl[s],o=(n-r.born)/1.8;if(o>=1){oe.remove(r.r),yl.splice(s,1);continue}r.r.scale.setScalar(1+o*2.2),r.r.material.opacity=1-o}for(let s=vl.length-1;s>=0;s--){let r=vl[s],o=(n-r.born)/1.5;if(o>=1){oe.remove(r.m),r.m.material.dispose(),vl.splice(s,1);continue}r.vel.y-=70*t,r.m.position.addScaledVector(r.vel,t),r.m.position.y<we+.4&&(r.m.position.y=we+.4,r.vel.multiplyScalar(.3)),r.m.rotation.x+=r.spin.x*t,r.m.rotation.y+=r.spin.y*t,r.m.material.opacity=1-o*o}if(Hn){let s=1-Math.pow(.002,t);Jt.position.lerp(Hn.pos,s),jt.target.lerp(Hn.target,s),Jt.position.distanceTo(Hn.pos)<.5&&(Hn=null)}wv(t),jt.dampingFactor=1-Math.pow(1-kf,t*60),jt.update(),Hn||Av(),Tv(),ml%2===0&&(be.shadowMap.needsUpdate=!0),Rv(n,t),be.render(oe,Jt),ho.render(oe,Jt),Dv(ml%10===1),ml++%6===0&&Cv()}function Ev(n){n.preventDefault(),Hn=null;let t=n.deltaY*(n.deltaMode===1?16:n.deltaMode===2?100:1);n.ctrlKey&&(t*=10);let e=mi??Jt.position.distanceTo(jt.target);mi=hs.clamp(e*Math.pow(.95,-t*.01),jt.minDistance,jt.maxDistance)}function wv(n){if(mi===null)return;Ss.subVectors(Jt.position,jt.target);let t=Ss.length(),e=Math.abs(mi/t-1)<.001?mi:t*Math.pow(mi/t,1-Math.pow(sv,n));Jt.position.copy(jt.target).add(Ss.setLength(e)),e===mi&&(mi=null)}function Tv(){let n=Jt.position.distanceTo(jt.target),t=Math.max(1,n*.1);Math.abs(t-Jt.near)<t*.01||(Jt.near=t,Jt.far=n*3+1500,Jt.updateProjectionMatrix())}function Av(){let n=1-Jt.position.distanceTo(jt.target)/jt.maxDistance,t=Math.max(0,n)*In.W/2,e=Math.max(0,n)*In.D/2,i=hs.clamp(jt.target.x,-t,t)-jt.target.x,s=hs.clamp(jt.target.z,-e,e)-jt.target.z;!i&&!s||(jt.target.x+=i,jt.target.z+=s,Jt.position.x+=i,Jt.position.z+=s)}function Rv(n,t){n-wl<3||t>=.1||(ao=t>1/40?ao+1:Math.max(0,ao-1),!(ao<90||be.getPixelRatio()<=1)&&(be.setPixelRatio(Math.max(1,be.getPixelRatio()-.5)),ao=0))}function Cv(){let n=r=>{let o=at.get(r.id);return(Sl===r.id||zi===r.id?0:o&&!fr(o)?1:2)*1e13-Ml(o??{})},t=(r,o)=>o.some(a=>r.left<a.right+4&&r.right>a.left-4&&r.top<a.bottom+2&&r.bottom>a.top-2),e=[...Be.values(),...le?[le]:[]].map(r=>r.label.el.getBoundingClientRect());Oe.hidden||e.push(Oe.getBoundingClientRect());let i=[];for(let r of[...je.values()].sort((o,a)=>n(o)-n(a))){let o=r.label.el;o.classList.remove("crowded","covered");let a=Sl===r.id||zi===r.id&&Oe.hidden;if(Vn?.id===r.id&&!Oe.hidden){o.classList.add("covered");continue}if(!a&&t(o.getBoundingClientRect(),e)){o.classList.add("covered");continue}!a&&t(o.getBoundingClientRect(),i)&&o.classList.add("crowded"),i.push(o.getBoundingClientRect())}let s=Oe.hidden?null:Oe.getBoundingClientRect();for(let r of[...Be.values(),...le?[le]:[]])r.label.el.classList.toggle("covered",!!(s&&t(r.label.el.getBoundingClientRect(),[s])))}function Gh(n){Sl=n}function Iv(n){for(let t of at.values())if(t.kind==="tool"&&t.status==="active"&&t.owner===n)return t;return null}var Nf=n=>n>=1e6?`${(n/1e6).toFixed(1)}M`:`${Math.round(n/1e3)}k`,Cn=(n,t)=>t?`<div><dt>${n}</dt><dd>${pt(t)}</dd></div>`:"";function Pv(n){let t=at.get(n.id);if(!t)return"";let e=Iv(t.id),i=e?`${e.tool}${e.summary?` ${e.summary}`:""}`:"",s=t.context?.tokens?`${ni(Le(t))} \xB7 ${Nf(t.context.tokens)} of ${Nf(t.context.window)}`:"";if(t.kind==="agent"){let l=at.get(se(t.session)),h=ke.get(t.id),u=t.status!=="done"?t.status==="idle"?"waiting":"working":h?.walk?"finished, heading for coffee":h?.onBreak&&!h.leaving?"finished, on a coffee break":"finished";return`<b><i class="dot ${bs(t.type)}"></i>${pt(t.label)}</b>
      ${t.description?`<p>${pt(t.description)}</p>`:""}
      <dl>${Cn("status",u)}${Cn("doing",i)}${Cn("context",s)}${Cn("model",t.model)}${Cn("tool calls",t.history?String(t.history):"")}${Cn("for",l?.label)}</dl>`}let r=!fr(t),o=[...at.values()].filter(l=>l.kind==="agent"&&l.session===t.session&&l.status!=="done").length,a=Pn.get(t.id)?.actions[0],c=r?e||Date.now()-(t.lastAt??0)<Bf?"working":`waiting \xB7 last active ${un(t.lastAt)}`:`ended ${un(t.endedAt??t.lastAt)}`;return`<b><i class="dot ${dr(t.session)}"></i>${pt(t.prompts?.[0]?.text??t.label)}</b>
    <p>${pt([t.projectName,t.gitBranch].filter(Boolean).join(" \xB7 "))}</p>
    <dl>${Cn("status",c)}${Cn("doing",i||(a?a.text:""))}${Cn("context",s)}${Cn("helpers",o?String(o):"")}${Cn("model",t.model)}${Cn("cost",t.costUsd!==void 0?`$${t.costUsd.toFixed(2)}`:"")}</dl>`}function Dv(n){if(!Vn){Oe.hidden=!0;return}let t=Rh(Vn.id);if(!t){Oe.hidden=!0;return}(n||Oe.hidden)&&(Oe.innerHTML=Pv(Vn));let e=t.add(Ss.set(0,Vn.kind==="agent"?6:10,0)).project(Jt);Oe.style.left=`${(e.x+1)/2*$e.clientWidth}px`,Oe.style.top=`${(1-e.y)/2*$e.clientHeight}px`,Oe.hidden=!1}function Lv(){let n=new $r,t=new Tt,e=s=>{let r=be.domElement.getBoundingClientRect();return t.set((s.clientX-r.left)/r.width*2-1,-((s.clientY-r.top)/r.height)*2+1),n.setFromCamera(t,Jt),n.intersectObjects(oe.children,!0).find(o=>o.object.userData.pick&&o.object.visible)?.object.userData.pick},i=null;be.domElement.addEventListener("pointerdown",s=>{i=[s.clientX,s.clientY]}),be.domElement.addEventListener("pointerup",s=>{!i||Math.hypot(s.clientX-i[0],s.clientY-i[1])>4||Lh(e(s)?.id??null)}),be.domElement.addEventListener("pointermove",s=>{if(s.buttons){Vn=null;return}let r=e(s);Vn=r??null,zi=r?r.kind==="session"?r.id:ke.get(r.id)?.session??null:null,be.domElement.style.cursor=r?"pointer":""}),be.domElement.addEventListener("pointerleave",()=>{Vn=null,zi=null})}var Uv={get renderer(){return be},get size(){return In},sessionViews:je,agentViews:ke,rooms:Be,get camera(){return Jt},get stage(){return $e},get controls(){return jt},get coffee(){return le},greeted:co};var Nv=1500,Fv=600,Zf=document.querySelector('meta[name="agent-office-token"]')?.content||"",Cl=!1;function $h(n){Cl=n}var ne=null,Ov=n=>n.kind==="agent"?{session:n.session,agent:n.agent}:{session:n.session},Bv=n=>n.kind==="agent"?n.label:"this session";function kv(n,t){let e=n.t?`<time>${un(n.t)}</time>`:"";switch(n.kind){case"you":return`<div class="tx you"><p>${pt(n.text)}</p>${e}</div>`;case"chat":return`<div class="tx you chat"><span class="tx-from">${n.from==="agent-office"?"From the office":`From ${pt(n.from)}`}</span><p>${pt(n.text)}</p>${e}</div>`;case"say":return`<div class="tx say"><p>${pt(n.text)}</p>${e}</div>`;case"note":return`<div class="tx note">${pt(n.text)}</div>`;case"tool":{let i=t.get(n.id),s=i?i.ok?"ok":"bad":"running",r=`<i class="tx-dot ${s}"></i><b>${pt(n.name)}</b> <span>${pt(n.summary??"")}</span>`;return i?.text?`<details class="tx tool ${s}" data-id="${pt(n.id)}"><summary>${r}</summary><pre>${pt(i.text)}</pre></details>`:`<div class="tx tool ${s}">${r}</div>`}default:return""}}function zv(n){return`<div class="tx you chat pending ${n.ok===!1?"failed":""}"><span class="tx-from">From the office</span><p>${pt(n.text)}</p><span class="tx-status">${pt(n.status)}</span></div>`}function Hi(){if(!ne?.root.isConnected)return;let n=ne.root.querySelector(".tx-log"),t=n.scrollHeight-n.scrollTop-n.clientHeight<60,e=new Map(ne.entries.filter(o=>o.kind==="result").map(o=>[o.id,o])),s=ne.entries.filter(o=>o.kind!=="result").map(o=>kv(o,e)).join("")+ne.pending.map(zv).join("")||`<p class="tx-empty">${pt(ne.empty)}</p>`;if(s===ne.html)return;ne.html=s;let r=new Set([...n.querySelectorAll("details[open]")].map(o=>o.dataset.id));n.innerHTML=s;for(let o of n.querySelectorAll("details"))r.has(o.dataset.id)&&(o.open=!0);(t||ne.firstDraw)&&(n.scrollTop=n.scrollHeight),ne.firstDraw=!1}async function Yf(){let n=ne;if(!n?.root.isConnected)return qh();if(Cl){n.entries=Jf(at.get(n.id)),Hi();return}if(n.isPolling)return;n.isPolling=!0;let{session:t,agent:e}=n.target,i=new URLSearchParams({session:t,...e?{agent:e}:{},...n.next!==void 0?{after:String(n.next)}:{}});try{let s=await fetch(`/transcript?${i}`);if(s.status===404)n.empty="No transcript yet. It appears once Claude Code has written the first turn.";else if(s.ok){let{entries:r,next:o,reset:a}=await s.json();a&&(n.entries=[]),n.entries=[...n.entries,...r].slice(-Fv),n.next=o;for(let c of r)c.kind==="chat"&&(n.pending=n.pending.filter(l=>l.text!==c.text&&!c.text.includes(l.text)));n.empty="Nothing said yet."}}catch{n.empty="The bridge isn't answering. Is it still running?"}finally{n.isPolling=!1}ne===n&&Hi()}function qh(){ne?.timer&&clearInterval(ne.timer),ne=null}function Jf(n){if(!n)return[];let t=at.get(se(n.session)),e=[...Pn.get(se(n.session))?.actions??[]].reverse(),i=n.kind==="agent"?e.filter(r=>r.text.startsWith(n.label)):e,s=n.kind==="agent"?[{kind:"you",text:n.description??`Help with ${t?.label??"the session"}`,t:n.startedAt}]:(n.prompts??[]).map(r=>({kind:"you",text:r.text,t:r.t}));return i.forEach((r,o)=>{let a=`demo-${n.id}-${r.t}-${o}`,[c,l]=r.text.startsWith("The session ")?["session",r.text.slice(12)]:[r.text.split(" ")[0],r.text.split(" ").slice(1).join(" ")];s.push({kind:"tool",id:a,name:c,summary:l,t:r.t}),s.push({kind:"result",id:a,ok:r.ok,text:r.ok?"":"Something went wrong (sample activity)."})}),s.push(...Xh.get(n.id)??[]),s.sort((r,o)=>(r.t??0)-(o.t??0))}var Xh=new Map;async function Hv(n){let t=at.get(ne.id);if(!t||!n.trim())return;let e={text:n.trim(),status:"Sending\u2026"};if(ne.pending.push(e),Hi(),Cl){let i=ne.id;setTimeout(()=>{e.status="Queued as the next prompt",Hi()},500),setTimeout(()=>{let s=Xh.get(i)??[];s.push({kind:"chat",text:e.text,from:"agent-office",t:Date.now()}),s.push({kind:"say",text:"Got it. (This is the demo: nothing really runs, but in your own office the session reads this as its next prompt and answers here.)",t:Date.now()+1}),Xh.set(i,s),ne?.id===i&&(ne.pending=ne.pending.filter(r=>r!==e),ne.entries=Jf(t),Hi())},1800);return}try{let i=await fetch("/chat",{method:"POST",headers:{"content-type":"application/json","x-agent-office-token":Zf},body:JSON.stringify({...ne.target,text:e.text})}),s=await i.json().catch(()=>({}));if(!i.ok)throw new Error(s.error??`the bridge answered ${i.status}`);e.id=s.id,e.status="Waiting for the session to pick it up"}catch(i){e.ok=!1,e.status=`Not sent: ${i.message}`}Hi()}function Kf(n){if(!ne||n.kind!=="chat.delivered")return;let t=ne.pending.find(e=>e.id===n.id);t&&(t.ok=n.ok!==!1,t.status=t.ok?Vv(n.how??"Delivered"):`Couldn't deliver it: ${n.how??"unknown reason"}`,Hi())}var Vv=n=>n.charAt(0).toUpperCase()+n.slice(1);function Gv(n){return!Cl&&!Zf?{off:"Messaging needs the office opened from its bridge (run /office)."}:n.kind==="session"&&(n.past||n.status==="done")?{off:"This session has ended. Resume it in Claude Code to talk to it again."}:n.kind==="agent"&&n.status==="done"?{placeholder:`Message ${n.label}\u2026`,hint:"It has finished: a message resumes it to answer, which uses tokens."}:n.kind==="agent"?{placeholder:`Message ${n.label}\u2026`,hint:"Goes straight to this subagent while it works."}:{placeholder:"Message this session\u2026",hint:"Arrives as its next prompt, marked as from Agent Office. Tool approvals still happen in Claude Code."}}function jf(n,t){if(!n||!t||ne?.id===t.id&&ne.root===n)return;qh();let e=Gv(t);n.innerHTML=`
    <div class="tx-log" role="log" aria-live="polite" aria-label="Conversation with ${pt(Bv(t))}"></div>
    ${e.off?`<p class="tx-off">${pt(e.off)}</p>`:`<form class="tx-compose">
          <textarea rows="2" placeholder="${pt(e.placeholder)}" aria-label="${pt(e.placeholder)}"></textarea>
          <button type="submit">Send</button>
          <p class="tx-hint">${pt(e.hint)} Enter sends, Shift+Enter starts a new line.</p>
        </form>`}`,ne={id:t.id,root:n,target:Ov(t),entries:[],pending:[],next:void 0,empty:"Reading the transcript\u2026",firstDraw:!0};let i=n.querySelector("form"),s=i?.querySelector("textarea");i?.addEventListener("submit",r=>{r.preventDefault();let o=s.value;s.value="",Hv(o)}),s?.addEventListener("keydown",r=>{r.key==="Enter"&&!r.shiftKey&&!r.isComposing&&(r.preventDefault(),i.requestSubmit())}),Hi(),Yf(),ne.timer=setInterval(()=>{document.hidden||Yf()},Nv)}var Qf=qh;var Es=n=>document.querySelector(n),Yh=n=>n===void 0?"\u2014":n>=1e6?`${(n/1e6).toFixed(2)}M`:`${Math.round(n/1e3)}k`,Wv=n=>n===void 0?void 0:`$${n.toFixed(2)}`,xi=(n,t)=>`${n} ${t}${n===1?"":"s"}`,Xv=2500,ip=n=>n.prompts?.[0]?.text??n.label,fo=n=>n.kind==="session"&&!n.past&&n.status!=="done",sp=(n,t)=>t.has(n.id)||Date.now()-(n.lastAt??0)<Xv;function rp(n){return[...at.values()].filter(t=>t.kind==="agent"&&t.session===n.session)}var op=n=>rp(n).filter(t=>t.status!=="done");function ep(n,t){return`<button class="line pick" data-pick="${pt(n.id)}"><i class="dot ${bs(n.type)}"></i>${pt(n.label??n.type)}${t?`<span class="muted">\xB7 ${t}</span>`:""}</button>`}var $v=n=>`${n.from?`<span class="muted from">${n.from==="agent-office"?"From the office":`From ${pt(n.from)}`}</span>`:""}${pt(n.text)}`;function qv(n){let t=[...at.values()].filter(fo);if(!t.length)return["Nothing is running right now.","Start a Claude Code session and it will walk into the office."];let e=t.filter(c=>sp(c,n)).length,i=[...at.values()].filter(c=>c.kind==="agent"&&c.status==="active").length,s=e===t.length&&t.length>1?`All ${t.length}`:`${e} of ${t.length}`,o=[`${t.length===1?e?"Your session is working right now":"Your session is waiting for you":`${s} sessions are working right now`}${i?`, with ${xi(i,"subagent")} helping`:""}.`],a=t.filter(c=>c.context?.tokens).sort((c,l)=>Le(l)-Le(c))[0];if(a&&Le(a)>=si?o.push(`${hn(a.label)} is ${ni(Le(a))} full and will likely compact soon.`):a&&o.push("Every context window still has room."),Mi){let c=at.get(Mi.session),l=Mi.text.charAt(0).toLowerCase()+Mi.text.slice(1);o.push(`Most recently, ${pt(l)}${c&&t.length>1?` in ${pt(hn(c.label))}`:""}.`)}return o}function Yv(){let n=Vl().map(e=>{let i=e.kind==="agent"?at.get(se(e.session)):null;return`<li class="warn"><button data-pick="${pt(e.id)}">${pt(e.kind==="agent"?`${e.label} in ${hn(i?.label??"")}`:hn(e.label))} is ${ni(Le(e))} full</button></li>`}),t=vi.filter(e=>e.tone==="bad"&&Date.now()-e.t<12e4).slice(0,4-Math.min(2,n.length)).map(e=>`<li class="bad"><button data-pick="${pt(e.target)}">${pt(e.text.replace(/ in “[^”]*”\.$/,"."))}</button></li>`);return[...n.slice(0,2),...t].join("")||'<li class="calm"><span>Nothing needs you right now.</span></li>'}function Zv(n,t,e){let i=Le(n),s=fo(n),r=s?op(n).length:0,o=Pn.get(n.id)?.actions[0]?.text,a=s?sp(n,t)?o??"working":"waiting for you":`ended ${un(n.endedAt??n.lastAt)}`;return`
    <button class="entry ${s?"":"past"} ${e===n.id?"on":""}" data-pick="${pt(n.id)}" data-hover="${pt(n.id)}">
      <i class="dot ${dr(n.session)}"></i>
      <span class="ename">${pt(ip(n))}</span>
      ${n.context?.tokens?`<span class="pct ${ei(i)}">${ni(i)}</span>`:"<span></span>"}
      <span class="estate">${r?`${xi(r,"helper")} \xB7 `:""}${pt(a)}</span>
    </button>`}function Jv(n,t){let e=new Map;for(let r of at.values()){if(r.kind!=="session")continue;let o=r.projectName??"Elsewhere";e.has(o)||e.set(o,[]),e.get(o).push(r)}let i=[...e].map(([r,o])=>{let a=o.filter(fo).sort((l,h)=>(l.startedAt??0)-(h.startedAt??0)),c=o.filter(l=>!fo(l)).sort((l,h)=>(h.endedAt??h.lastAt??0)-(l.endedAt??l.lastAt??0)).slice(0,3);return{name:r,live:a,past:c}}).sort((r,o)=>(o.live.length>0)-(r.live.length>0)||r.name.localeCompare(o.name));return`
    <h2 class="sideh">Directory <small>${i.reduce((r,o)=>r+o.live.length,0)} live</small></h2>
    ${i.map(r=>`
      <p class="room"><i class="room-${Dh(r.name)}"></i>${pt(r.name)}</p>
      ${[...r.live,...r.past].map(o=>Zv(o,n,t)).join("")}`).join("")||'<p class="muted">No sessions yet.</p>'}`}function uo(n,t="",e=""){return`<p class="line ${e}">${n}${t?`<span class="muted">\xB7 ${t}</span>`:""}</p>`}function Kv([n,t]){let e=[t.edits&&xi(t.edits,"edit"),t.reads&&xi(t.reads,"read")].filter(Boolean).join(", ");return`<p class="line mono" title="${pt(n)}">${pt(n.split(/[\\/]/).slice(-2).join("/"))}<span class="muted">\xB7 ${e}</span></p>`}function jv(n){let t=n.breakdown?.categories?.filter(e=>e.kind==="used"&&e.tokens>0);return t?.length?`<h3>What fills it</h3>${[...t].sort((e,i)=>i.tokens-e.tokens).slice(0,6).map(e=>uo(pt(e.name),Yh(e.tokens))).join("")}`:""}function Qv(n){return n.rateLimits?.length?n.rateLimits.map(t=>uo(`${pt(t.kind.replace("_"," "))} limit`,`${Math.round(t.percentUsed)}% used`)).join(""):""}function tM(n){let t=Le(n),e=fo(n),i=Pn.get(n.id),s=i?[...i.files].sort((l,h)=>h[1].edits*3+h[1].reads-(l[1].edits*3+l[1].reads)).slice(0,8):[],r=e?op(n):n.pastAgents??[],o=e?rp(n).filter(l=>l.status==="done").sort((l,h)=>(h.endedAt??0)-(l.endedAt??0)):[],a=[n.projectName,n.gitBranch].filter(Boolean).join(" \xB7 "),c=[n.turns!==void 0&&xi(n.turns,"turn"),n.toolCalls!==void 0&&xi(n.toolCalls,"tool call"),n.errors&&xi(n.errors,"error"),Wv(n.costUsd),n.model].filter(Boolean).join(" \xB7 ");return`
    <button class="back" data-back>\u2190 All sessions</button>
    <h2 class="dtitle"><i class="dot ${dr(n.session)}"></i>${pt(ip(n))}</h2>
    <p class="dmeta">${pt(a)}${e?"":` \xB7 ended ${un(n.endedAt??n.lastAt)}`}</p>
    <!--tabs-->
    ${n.context?.tokens?`
      <div class="dgauge"><span class="big ${ei(t)}">${ni(t)}</span><span>of its context window ${e?"is":"was"} in use${e&&t>=si?". It will compact soon.":"."}</span></div>
      <span class="meter"><span class="${ei(t)}" style="width:${(t*100).toFixed(1)}%"></span></span>
      <p class="dmeta">${Yh(n.context.tokens)} of ${Yh(n.context.window)} tokens${n.compactions?.length?` \xB7 compacted ${xi(n.compactions.length,"time")}`:""}</p>`:""}
    ${c?`<p class="dmeta">${pt(c)}</p>`:""}
    ${e?jv(n)+Qv(n):""}
    <h3>${e?"Helping now":"Who helped"}</h3>
    ${e?r.map(l=>ep(l,l.context?.tokens?`${ni(Le(l))} of its own window`:pt(l.description??""))).join("")||'<p class="muted">No subagents.</p>':r.map(l=>uo(`<i class="dot ${bs(l.type)}"></i>${pt(l.label??l.type)}`,pt(l.description??""))).join("")||'<p class="muted">No subagents.</p>'}
    ${o.length?`<h3>Finished</h3>${o.map(l=>ep(l,`${pt(l.description??"")}${l.description?" \xB7 ":""}${un(l.endedAt)}`)).join("")}`:""}
    ${s.length?`<h3>Files it has worked on</h3>${s.map(Kv).join("")}`:""}
    ${i?.actions.length?`<h3>Recently</h3>${i.actions.slice(0,8).map(l=>uo(pt(l.text),un(l.t),l.ok?"":"bad")).join("")}`:""}
    ${n.prompts?.length?`<h3>What you asked</h3>${[...n.prompts].reverse().slice(0,6).map(l=>uo($v(l),un(l.t))).join("")}`:""}`}function eM(n){let t=at.get(se(n.session)),e=Le(n);return`
    <button class="back" data-pick="${pt(t?.id??"")}">\u2190 ${pt(t?.label??"Session")}</button>
    <h2 class="dtitle"><i class="dot ${bs(n.type)}"></i>${pt(n.label)}</h2>
    <p class="dmeta">${pt(n.description??n.type)}</p>
    <!--tabs-->
    ${n.context?.tokens?`
      <div class="dgauge"><span class="big ${ei(e)}">${ni(e)}</span><span>of its own context window.</span></div>
      <span class="meter"><span class="${ei(e)}" style="width:${(e*100).toFixed(1)}%"></span></span>`:""}
    <p class="dmeta">${pt([n.status==="done"?"finished":n.status==="idle"?"waiting":"working",n.model,n.history?xi(n.history,"tool call"):"",n.teammate?"teammate":n.background?"background":""].filter(Boolean).join(" \xB7 "))}</p>`}function ap(n,t){if(n.nodeType!==t.nodeType||n.nodeName!==t.nodeName){n.replaceWith(t);return}if(n.nodeType===Node.ELEMENT_NODE&&n.hasAttribute("data-keep")&&n.getAttribute("data-keep")===t.getAttribute("data-keep"))return;if(n.nodeType!==Node.ELEMENT_NODE){n.nodeValue!==t.nodeValue&&(n.nodeValue=t.nodeValue);return}for(let{name:i}of[...n.attributes])t.hasAttribute(i)||n.removeAttribute(i);for(let{name:i,value:s}of[...t.attributes])n.getAttribute(i)!==s&&n.setAttribute(i,s);let e=[...t.childNodes];for(e.forEach((i,s)=>{let r=n.childNodes[s];r?ap(r,i):n.append(i)});n.childNodes.length>e.length;)n.lastChild.remove()}function Il(n,t){let e=n.cloneNode(!1);e.innerHTML=t,ap(n,e)}var pr="details",np=null;function nM(n,t){let[e,i]=n.split("<!--tabs-->"),s=(o,a)=>`<button type="button" role="tab" class="tab ${pr===o?"on":""}" aria-selected="${pr===o}" data-tab="${o}">${a}</button>`,r=`<div class="tabs" role="tablist">${s("details","Details")}${s("transcript","Transcript")}</div>`;return e+r+(pr==="details"?i:`<div class="transcript" data-keep="${pt(t.id)}"></div>`)}function Zh(n){np=n;let{running:t,selected:e,pick:i,hover:s}=n;Il(Es("#now"),qv(t).map(a=>`<p>${a}</p>`).join("")),Il(Es("#look"),Yv()),Il(Es("#moments"),vi.slice(0,12).map(a=>`<li class="${a.tone}"><span>${pt(a.text)}</span><time>${un(a.t)}</time></li>`).join("")||'<li class="muted"><span>Quiet so far.</span></li>');let r=e&&at.get(e),o=r&&(r.kind==="agent"||r.kind==="session");Es("#side").classList.toggle("clipboard",!!o),Es("#side").classList.toggle("talking",!!o&&pr==="transcript"),Il(Es("#side"),o?nM(r.kind==="agent"?eM(r):tM(r),r):Jv(t,e)),o&&pr==="transcript"?jf(Es("#side .transcript"),r):Qf();for(let a of document.querySelectorAll("[data-tab]"))a.onclick=()=>{pr=a.dataset.tab,Zh(np)};for(let a of document.querySelectorAll("[data-pick]"))a.onclick=()=>i(a.dataset.pick||null);for(let a of document.querySelectorAll("[data-back]"))a.onclick=()=>i(null);for(let a of document.querySelectorAll("[data-hover]"))a.onpointerenter=()=>s(a.dataset.hover),a.onpointerleave=()=>s(null)}var sM=6e4,rM=700,hp=new URLSearchParams(location.search),Pl=!!window.AGENT_OFFICE_DEMO||hp.get("demo")==="1",mo=!0,po=[],Vi=null;Uh(document.getElementById("stage"),{pick:jh});function jh(n){let t=n&&at.get(n);Vi=t&&(t.kind==="session"||t.kind==="agent")?n:null,Gh(Vi),Vi&&Rl(Vi),Dl()}var lp=document.getElementById("stage");function oM(){let n=lp.clientWidth,t=lp.clientHeight,e={left:0,right:0,top:0,bottom:0};for(let i of document.querySelectorAll(".hud.left > *, #side, .topbar")){let s=i.getBoundingClientRect();!s.width||!s.height||getComputedStyle(i).display==="none"||(s.height>t*.5&&s.width<n*.5?s.left+s.width/2<n/2?e.left=Math.max(e.left,s.right+12):e.right=Math.max(e.right,n-s.left+12):s.width>n*.5?s.top+s.height/2<t/2?e.top=Math.max(e.top,s.bottom+8):e.bottom=Math.max(e.bottom,t-s.top+8):s.left+s.width/2<n/2?e.left=Math.max(e.left,s.right+12):e.right=Math.max(e.right,n-s.left+12))}Oh(e)}var aM=new ResizeObserver(oM);for(let n of document.querySelectorAll(".hud.left > *, #side, .topbar, #stage"))aM.observe(n);addEventListener("keydown",n=>{n.key==="Escape"&&(jh(null),Rl(null))});var Jh=document.getElementById("sound");function up(){Jh.setAttribute("aria-pressed",String(!pl())),Jh.querySelector("span").textContent=pl()?"Sound off":"Sound on"}Jh.addEventListener("click",()=>{Tf(!pl()),up()});up();for(let n of["pointerdown","keydown"])addEventListener(n,Af,{once:!0});var cp=document.getElementById("show-past");cp.addEventListener("change",()=>{mo=cp.checked,xr(po,mo)});function lM(){let n=new Set;for(let t of at.values())t.kind==="tool"&&t.status==="active"&&n.add(t.owner);return n}function Dl(){Vi&&!at.has(Vi)&&(Vi=null),Zh({running:lM(),selected:Vi,pick:jh,hover:Bh})}function dp(){Hl(Date.now()),zh(mo),Vh(),requestAnimationFrame(dp)}setInterval(Dl,rM);function fp(n){Mo(n),bo(n),Hh(n),Kf(n)}async function pp(){try{po=Pl?lu():(await(await fetch("/history")).json()).sessions??[]}catch{po=[]}xr(po,mo)}function Kh(n,t){let e=document.getElementById("conn");e.querySelector("span").textContent=n,e.className=`status ${t}`}function cM(){let n=new EventSource("/stream");n.addEventListener("open",()=>Kh("Live","live")),n.addEventListener("replay",t=>{kl(),Wl();for(let e of JSON.parse(t.data))Mo(e),bo(e);xr(po,mo),Dl()}),n.addEventListener("message",t=>fp(JSON.parse(t.data))),n.addEventListener("error",()=>Kh("Reconnecting\u2026","down"))}function hM(){Kh("Sample activity","live"),au(n=>n.forEach(fp))}$h(Pl);Pl||fetch("/healthz").then(n=>n.json()).then(n=>{n.demo&&$h(!0)}).catch(()=>{});await pp();setInterval(pp,sM);Pl?hM():cM();Dl();requestAnimationFrame(dp);hp.has("debug")&&(window.cluster={model:Gl,words:$l,table:Wh});
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
