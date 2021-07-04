(this["webpackJsonptuna-mayonnaise-ui"]=this["webpackJsonptuna-mayonnaise-ui"]||[]).push([[0],{108:function(t,e){},150:function(t,e){},188:function(t,e){function n(t){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}n.keys=function(){return[]},n.resolve=n,t.exports=n,n.id=188},189:function(t,e){function n(t){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}n.keys=function(){return[]},n.resolve=n,t.exports=n,n.id=189},375:function(t,e,n){},376:function(t,e,n){"use strict";n.r(e);n(1);var s=n(20),o=n.n(s),a=n(3),r=n.n(a),i=n(65),c=n(2),l=n(4),u=n(125),d=n(126),p=n(137),h=n(128),m=n.n(h),j=n(129),g=n(130),b=n.n(g),v=n(44),k=n(131),x=n(132),w=n.n(x),O=n(133),y=n(27),f=n(0);class C extends c.c.Control{constructor(t,e,n,s=!1){super(e),this.emitter=t,this.key=e,this.component=C.component;const o=n.data[e]||'{"name": "value"}';n.data[e]=o,n.data.output=o,this.props={readonly:s,value:o,onChange:t=>{this.setValue(t),this.emitter.trigger("process")}}}setValue(t){this.props.value=t,this.putData(this.key,t),this.putData("output",t),this.update()}}C.component=({value:t,onChange:e})=>Object(f.jsx)("textarea",{value:t,rows:10,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value))});var N=C;class S extends c.c.Component{constructor(t){super("JSON"),this.path=["New"],this.socket=t}builder(t){const e=new c.c.Output("json","JSON",this.socket);return t.addControl(new N(this.editor,"json",t)).addOutput(e)}worker(t,e,n){n.json=t.data.json}}var D=S;class E extends c.c.Control{constructor(t,e,n,s=!1){super(e),this.emitter=t,this.key=e,this.component=E.component;const o=n.data[e]||"";n.data[e]=o,n.data.output=o,this.props={readonly:s,value:o,onChange:t=>{this.setValue(t),this.emitter.trigger("process")}}}setValue(t){this.props.value=t,this.putData(this.key,t),this.putData("output",t),this.update()}}E.component=({value:t,onChange:e})=>Object(f.jsx)("textarea",{value:t,rows:10,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value))});var L=E;class R extends c.c.Component{constructor(t){super("SQL"),this.path=["New"],this.socket=t}builder(t){const e=new c.c.Output("sql","SQL",this.socket);return t.addControl(new L(this.editor,"sql",t)).addOutput(e)}worker(t,e,n){n.sql=t.data.sql}}var J=R;class P extends l.b{render(){const t=this.props,e=t.bindSocket,n=t.bindControl,s=this.state,o=s.outputs,a=s.controls,r=s.inputs,i=s.selected;return Object(f.jsxs)("div",{className:"node ".concat(i),style:{background:"grey"},children:[Object(f.jsx)("div",{className:"title",children:"Template"}),o.map((t=>Object(f.jsxs)("div",{className:"output",children:[Object(f.jsx)("div",{className:"output-title",children:t.name}),Object(f.jsx)(l.c,{type:"output",socket:t.socket,io:t,innerRef:e})]},t.key))),a.map((t=>Object(f.jsx)(l.a,{className:"control",control:t,innerRef:n},t.key))),r.map((t=>Object(f.jsxs)("div",{className:"input",children:[Object(f.jsx)(l.c,{type:"input",socket:t.socket,io:t,innerRef:e}),Object(f.jsx)("div",{className:"input-title",children:t.name})]},t.key)))]})}}class T extends c.c.Control{constructor(t,e,n,s=!1){super(e),this.emitter=t,this.keys=[],this.component=T.component,this.props={readonly:s,value:"",onChange:()=>{}},n.data.output=""}setValue(t,e,n){this.props.value=e,this.putData("output",e),this.putData("contentType",n);for(const s in t)t[s][0]&&this.putData(s,t[s][0]);this.update()}}T.component=({value:t,onChange:e})=>Object(f.jsxs)(f.Fragment,{children:[Object(f.jsx)("label",{style:{color:"white",display:"block",textAlign:"left"},children:"Preview"}),Object(f.jsx)("textarea",{value:t,rows:10,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value)),disabled:!0})]});var A=T,V=n(134),I=n(135),F=n.n(I);class q extends c.c.Component{constructor(t,e,n){super("Template"),this.path=["New"],this.data.component=P,this.dataSocket=t,this.templateSocket=e,this.htmlSocket=n}builder(t){const e=new c.c.Input("template","TemplateEngine",this.templateSocket),n=new c.c.Input("json","Data (JSON)",this.dataSocket),s=new c.c.Output("html","HTML",this.htmlSocket);return n.addControl(new N(this.editor,"json",t)),t.addInput(e).addInput(n).addControl(new A(this.editor,"template",t,!0)).addOutput(s)}worker(t,e,n){const s=e.json.length?e.json[0]:t.data.json,o=t.inputs.template.connections.filter((t=>"hbs"===(null===t||void 0===t?void 0:t.output)||"pug"===(null===t||void 0===t?void 0:t.output))),a=(()=>{var n;if(0===o.length)return"No TemplateEngine detected...";const a=o[0].output,r=(null===(n=e.template)||void 0===n?void 0:n.length)?e.template[0]:t.data.json;if("pug"===a)return V.render(r,JSON.parse(s));if("hbs"===a){return F.a.compile(r)(JSON.parse(s))}})();this.editor.nodes.find((e=>e.id===t.id)).controls.get("template").setValue(e,a,"text/html; charset=utf-8"),n.html=a}}var B=q;class M extends c.c.Control{constructor(t,e,n,s=!1){super(e),this.emitter=t,this.key=e,this.component=M.component;const o=n.data[e]||"<div>{{name}}</div>";n.data[e]=o,n.data.output=o,this.props={readonly:s,value:o,onChange:t=>{this.setValue(t),this.emitter.trigger("process")}}}setValue(t){this.props.value=t,this.putData(this.key,t),this.putData("output",t),this.update()}}M.component=({value:t,onChange:e})=>Object(f.jsx)("textarea",{value:t,rows:10,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value))});var H=M;class U extends c.c.Component{constructor(t){super("Handlebars"),this.path=["New"],this.socket=t}builder(t){const e=new c.c.Output("hbs","Handlebars",this.socket);return t.addControl(new H(this.editor,"hbs",t)).addOutput(e)}worker(t,e,n){n.hbs=t.data.hbs}}var _=U;class W extends c.c.Control{constructor(t,e,n,s=!1){super(e),this.emitter=t,this.key=e,this.component=W.component;const o=n.data[e]||"div #{name}";n.data[e]=o,n.data.output=o,this.props={readonly:s,value:o,onChange:t=>{this.setValue(t),this.emitter.trigger("process")}}}setValue(t){this.props.value=t,this.putData(this.key,t),this.putData("output",t),this.update()}}W.component=({value:t,onChange:e})=>Object(f.jsx)("textarea",{value:t,rows:10,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value))});var K=W;class Q extends c.c.Component{constructor(t){super("Pug"),this.path=["New"],this.socket=t}builder(t){const e=new c.c.Output("pug","Pug",this.socket);return t.addControl(new K(this.editor,"pug",t)).addOutput(e)}worker(t,e,n){n.pug=t.data.pug}}var z=Q;class Y extends l.b{render(){const t=this.props,e=t.bindSocket,n=t.bindControl,s=this.state,o=s.outputs,a=s.controls,r=s.inputs,i=s.selected;return Object(f.jsxs)("div",{className:"node ".concat(i),style:{background:"grey"},children:[Object(f.jsx)("div",{className:"title",children:"Endpoint"}),o.map((t=>Object(f.jsxs)("div",{className:"output",children:[Object(f.jsx)("div",{className:"output-title",children:t.name}),Object(f.jsx)(l.c,{type:"output",socket:t.socket,io:t,innerRef:e})]},t.key))),a.map((t=>Object(f.jsx)(l.a,{className:"control",control:t,innerRef:n},t.key))),r.map((t=>Object(f.jsxs)("div",{className:"input",children:[Object(f.jsx)(l.c,{type:"input",socket:t.socket,io:t,innerRef:e}),Object(f.jsx)("div",{className:"input-title",children:t.name})]},t.key)))]})}}class Z extends c.c.Control{constructor(t,e,n,s=!1){super(e),this.emitter=t,this.component=Z.component,this.props={readonly:s,value:"",onChange:()=>{}},n.data.output=""}setValue(t,e,n,s,o){this.props.value=e,this.putData("enabledFlag",s),this.putData("output",e),this.putData("contentType",n),this.putData("path",o);for(const a in t)t[a][0]&&this.putData(a,t[a][0]);this.update()}}Z.component=({value:t,onChange:e})=>Object(f.jsxs)(f.Fragment,{children:[Object(f.jsx)("label",{style:{color:"white",display:"block",textAlign:"left"},children:"Preview"}),Object(f.jsx)("textarea",{value:t,rows:10,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value)),disabled:!0})]});var G=Z;class X extends c.c.Control{constructor(t,e,n,s=!1,o=""){super(e),this.emitter=t,this.key=e,this.component=X.component;const a=n.data[e]||!1;n.data[e]=a,n.data.output=a,this.props={readonly:s,checked:a,title:o,onChange:t=>{this.setValue(!!t),this.emitter.trigger("process")}}}setValue(t){this.props.checked=t,this.putData(this.key,t),this.putData("output",t),this.update()}}X.component=({checked:t,onChange:e,title:n})=>Object(f.jsxs)(f.Fragment,{children:[n&&Object(f.jsx)("label",{style:{color:"white",display:"block",textAlign:"left"},children:n}),Object(f.jsx)("input",{type:"checkbox",checked:t,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(+t.target.checked)})]});var $=X;class tt extends c.c.Control{constructor(t,e,n,s=!1,o="",a=""){super(e),this.emitter=t,this.key=e,this.component=tt.component;const r=n.data[e]||"";n.data[e]=r,n.data.output=r,this.props={readonly:s,value:r,title:o,placeHolder:a,onChange:t=>{this.setValue(t),this.emitter.trigger("process")}}}setValue(t){this.props.value=t,this.putData(this.key,t),this.putData("output",t),this.update()}}tt.component=({value:t,onChange:e,title:n,placeHolder:s})=>Object(f.jsxs)(f.Fragment,{children:[n&&Object(f.jsx)("label",{style:{color:"white",display:"block",textAlign:"left"},children:n}),Object(f.jsx)("input",{type:"text",value:t,placeholder:s,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value))})]});var et=tt;class nt extends c.c.Component{constructor(t){super("Endpoint"),this.path=["New"],this.data.component=Y,this.stringSocket=t}builder(t){var e;t.data.enabledFlag=null===(e=t.data.enabledFlag)||void 0===e||e;const n=new c.c.Input("content","Content (JSON/HTML)",this.stringSocket);return n.addControl(new et(this.editor,"content",t)),t.addInput(n).addControl(new G(this.editor,"endpoint",t,!0)).addControl(new $(this.editor,"enabledFlag",t,!1,"Enabled")).addControl(new et(this.editor,"path",t,!1,"Path","/foo"))}worker(t,e,n){const s=e.content.length?e.content[0]:"Rendering...",o=(t=>{if(t)return"html"===t.output?"text/html; charset=utf-8":"json"===t.output?"application/json; charset=utf-8":"text/plain; charset=utf-8"})(t.inputs.content.connections[0]),a=t.data.enabledFlag,r=t.data.path;this.editor.nodes.find((e=>e.id===t.id)).controls.get("endpoint").setValue(e,s,o,a,r)}}var st=nt;class ot extends l.b{render(){const t=this.props,e=t.node,n=t.bindSocket,s=t.bindControl,o=this.state,a=o.outputs,r=o.controls,i=o.inputs,c=o.selected;return Object(f.jsxs)("div",{className:"node ".concat(c),style:{background:"grey"},children:[Object(f.jsx)("div",{className:"title",children:e.name}),a.map((t=>Object(f.jsxs)("div",{className:"output",children:[Object(f.jsx)("div",{className:"output-title",children:t.name}),Object(f.jsx)(l.c,{type:"output",socket:t.socket,io:t,innerRef:n})]},t.key))),r.map((t=>Object(f.jsx)(l.a,{className:"control",control:t,innerRef:s},t.key))),i.map((t=>Object(f.jsxs)("div",{className:"input",children:[Object(f.jsx)(l.c,{type:"input",socket:t.socket,io:t,innerRef:n}),!t.showControl()&&Object(f.jsx)("div",{className:"input-title",children:t.name}),t.showControl()&&Object(f.jsx)(l.a,{className:"input-control",control:t.control,innerRef:s})]},t.key)))]})}}class at extends c.c.Component{constructor(t){super("API"),this.path=["New"],this.data.component=ot,this.jsonSocket=t}builder(t){const e=new c.c.Input("json","Dummy Output (JSON)",this.jsonSocket),n=new c.c.Output("json","JSON",this.jsonSocket);return t.addInput(e).addControl(new et(this.editor,"url",t,!1,"URL","https://example.com/bar")).addOutput(n)}worker(t,e,n){n.json=e.json.length?e.json[0]:t.data.json,n.url=t.data.url}}var rt=at;class it extends l.b{render(){const t=this.props,e=t.node,n=t.bindSocket,s=t.bindControl,o=this.state,a=o.outputs,r=o.controls,i=o.inputs,c=o.selected;return Object(f.jsxs)("div",{className:"node ".concat(c),style:{background:"grey"},children:[Object(f.jsx)("div",{className:"title",children:e.name}),a.map((t=>Object(f.jsxs)("div",{className:"output",children:[Object(f.jsx)("div",{className:"output-title",children:t.name}),Object(f.jsx)(l.c,{type:"output",socket:t.socket,io:t,innerRef:n})]},t.key))),r.map((t=>Object(f.jsxs)(f.Fragment,{children:[Object(f.jsx)(l.a,{className:"control",control:t,innerRef:s},t.key),"db"===t.key&&Object(f.jsxs)("div",{class:"control",title:"pass",children:[Object(f.jsx)("label",{style:{color:"white",display:"block",textAlign:"left"},children:"DB_PASS"}),Object(f.jsx)("textarea",{rows:"3",placeholder:"set ".concat(""===t.props.value?"DB":t.props.value.toUpperCase(),"_PASS when tuna api starting"),value:"",disabled:!0})]})]}))),i.map((t=>Object(f.jsxs)("div",{className:"input",children:[Object(f.jsx)(l.c,{type:"input",socket:t.socket,io:t,innerRef:n}),!t.showControl()&&Object(f.jsx)("div",{className:"input-title",children:t.name}),t.showControl()&&Object(f.jsx)(l.a,{className:"input-control",control:t.control,innerRef:s})]},t.key)))]})}}class ct extends c.c.Component{constructor(t,e){super("DB"),this.path=["New"],this.data.component=it,this.jsonSocket=t,this.sqlSocket=e}builder(t){const e=new c.c.Input("json","Dummy Output (JSON)",this.jsonSocket),n=new c.c.Output("json","JSON",this.jsonSocket),s=new c.c.Input("sql","SQL",this.sqlSocket);return t.addInput(s).addInput(e).addControl(new et(this.editor,"host",t,!1,"HOST","127.0.0.1")).addControl(new et(this.editor,"port",t,!1,"PORT","3306")).addControl(new et(this.editor,"user",t,!1,"USER","guest")).addControl(new et(this.editor,"db",t,!1,"DB_NAME","foo")).addOutput(n)}worker(t,e,n){n.json=e.json.length?e.json[0]:t.data.json,n.sql=e.sql.length?e.sql[0]:t.data.sql,n.host=t.data.host,n.port=t.data.port,n.user=t.data.user,n.db=t.data.db}}var lt=ct,ut=n(66),dt=n.n(ut),pt=n(136);function ht(){return(ht=Object(i.a)(r.a.mark((function t(e){var n,s,o,a,h,g,x,f,C,N,S,E,L;return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=new c.c.Socket("String value"),(s=new c.c.Socket("Json value")).combineWith(n),(o=new c.c.Socket("Template value")).combineWith(n),(a=new c.c.Socket("Handlebars value")).combineWith(o),(h=new c.c.Socket("Pug value")).combineWith(o),(g=new c.c.Socket("HTML value")).combineWith(n),x=new c.c.Socket("SQL value"),f=[new st(n),new D(s),new B(s,o,g),new _(a),new z(h),new J(x),new rt(s),new lt(s,x)],(C=new c.c.NodeEditor("tuna-mayonnaise@0.0.1",e)).use(u.a),C.use(l.d),t.t0=C,t.t1=p.a,t.t2={Arrange(){C.nodes.forEach((t=>{C.trigger("arrange",t)}))},Undo(){C.trigger("undo")},Redo(){C.trigger("redo")},Save(){dt.a.post("/regist",C.toJSON()).then((()=>y.b.success("This configuration is SAVED :)"))).catch((()=>y.b.error("Maybe tuna tool command is TERMINATED :(")))},Download(){N=new Blob([JSON.stringify(C.toJSON())],{type:"application/json;charset=utf-8"}),Object(pt.saveAs)(N,"tuna-mayonnaise.json")},Debug(){console.log(JSON.stringify(C.toJSON()))}},t.t3={searchBar:!1,delay:100,allocate:t=>t.path,rename:t=>t.name,items:t.t2},t.t0.use.call(t.t0,t.t1,t.t3),C.use(m.a),C.use(j.a,{margin:20}),C.use(b.a),C.use(v.a,{type:v.a.DEFAULT,transformer:()=>([t,e,n,s])=>[[t,e],[n,s]],curve:v.a.curveBundle,options:{vertical:!1,curvature:.4},arrow:{color:"steelblue",marker:"M-5,-10 L-5,10 L20,0 z"}}),C.use(k.a),C.use(w.a,{margin:{x:200,y:50},depth:0}),C.use(O.a,{keyboard:!0}),-1!==window.navigator.userAgent.toLowerCase().indexOf("mac os x")&&document.addEventListener("keydown",(t=>{if(t.metaKey)switch(t.code){case"KeyY":C.trigger("redo");break;case"KeyZ":t.shiftKey?C.trigger("redo"):C.trigger("undo")}})),S=new c.c.Engine("tuna-mayonnaise@0.0.1"),f.forEach((t=>{C.register(t),S.register(t)})),t.next=34,dt.a.get("/tuna-configuration").then((t=>t.data)).catch((()=>(document.getElementsByClassName("rightClick")[0].style.display="block",null)));case 34:if(null===(E=t.sent)){t.next=41;break}return t.next=38,C.fromJSON(E);case 38:y.b.success("Previous configuration is RESTORED :)"),t.next=46;break;case 41:return t.next=43,f[0].createNode();case 43:(L=t.sent).position=[1e3,200],C.addNode(L);case 46:C.on("showcontextmenu",(({e:t,node:e})=>(document.getElementsByClassName("rightClick")[0].style.display="none",!0))),C.on("process nodecreated noderemoved connectioncreated connectionremoved",Object(i.a)(r.a.mark((function t(){return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("process"),t.next=3,S.abort();case 3:return t.next=5,S.process(C.toJSON());case 5:case"end":return t.stop()}}),t)})))),C.view.resize(),C.trigger("process"),d.a.zoomAt(C,C.nodes);case 51:case"end":return t.stop()}}),t)})))).apply(this,arguments)}n(374),n(375);function mt(){return Object(f.jsxs)("div",{className:"App",children:[Object(f.jsx)(y.a,{}),Object(f.jsx)("img",{className:"rightClick",src:"right-click.svg",width:"200",height:"200",alt:"RightClick for Menu",style:{display:"none",position:"absolute",top:"25%",left:"25%"}}),Object(f.jsx)("div",{style:{width:"100vh",height:"100vh"},ref:t=>t&&function(t){return ht.apply(this,arguments)}(t)})]})}const jt=document.getElementById("root");o.a.render(Object(f.jsx)(mt,{}),jt)}},[[376,1,2]]]);