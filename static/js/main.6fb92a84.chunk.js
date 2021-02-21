(this["webpackJsonptuna-mayonnaise-ui"]=this["webpackJsonptuna-mayonnaise-ui"]||[]).push([[0],{108:function(t,e){},146:function(t,e){},184:function(t,e){function n(t){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}n.keys=function(){return[]},n.resolve=n,t.exports=n,n.id=184},185:function(t,e){function n(t){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}n.keys=function(){return[]},n.resolve=n,t.exports=n,n.id=185},371:function(t,e,n){},372:function(t,e,n){"use strict";n.r(e);n(1);var o=n(20),s=n.n(o),a=n(3),r=n.n(a),c=n(65),i=n(0),u=n(5),p=n(125),d=n(126),l=n(137),h=n(128),m=n.n(h),g=n(129),v=n(130),k=n.n(v),b=n(44),j=n(131),w=n(132),x=n.n(w),O=n(133),y=n(27),f=n(2);class C extends i.c.Control{constructor(t,e,n,o=!1){super(e),this.emitter=t,this.key=e,this.component=C.component;const s=n.data[e]||"";n.data[e]=s,n.data.output=s,this.props={readonly:o,value:s,onChange:t=>{this.setValue(t),this.emitter.trigger("process")}}}setValue(t){this.props.value=t,this.putData(this.key,t),this.putData("output",t),this.update()}}C.component=({value:t,onChange:e})=>Object(f.jsx)("input",{type:"text",value:t,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value))});var S=C;class N extends i.c.Component{constructor(t){super("Text"),this.path=["[ Input ]"],this.socket=t}builder(t){const e=new i.c.Output("text","Text",this.socket);return t.addControl(new S(this.editor,"text",t)).addOutput(e)}worker(t,e,n){n.text=t.data.text}}var D=N;class E extends i.c.Control{constructor(t,e,n,o=!1){super(e),this.emitter=t,this.key=e,this.component=E.component;const s=n.data[e]||'{"name": "value"}';n.data[e]=s,n.data.output=s,this.props={readonly:o,value:s,onChange:t=>{this.setValue(t),this.emitter.trigger("process")}}}setValue(t){this.props.value=t,this.putData(this.key,t),this.putData("output",t),this.update()}}E.component=({value:t,onChange:e})=>Object(f.jsx)("textarea",{value:t,rows:10,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value))});var T=E;class I extends i.c.Component{constructor(t){super("JSON"),this.path=["[ Input ]"],this.socket=t}builder(t){const e=new i.c.Output("json","JSON",this.socket);return t.addControl(new T(this.editor,"json",t)).addOutput(e)}worker(t,e,n){n.json=t.data.json}}var L=I;class R extends u.b{render(){const t=this.props,e=t.bindSocket,n=t.bindControl,o=this.state,s=o.outputs,a=o.controls,r=o.inputs,c=o.selected;return Object(f.jsxs)("div",{className:"node ".concat(c),style:{background:"grey"},children:[Object(f.jsx)("div",{className:"title",children:"Template"}),s.map((t=>Object(f.jsxs)("div",{className:"output",children:[Object(f.jsx)("div",{className:"output-title",children:t.name}),Object(f.jsx)(u.c,{type:"output",socket:t.socket,io:t,innerRef:e})]},t.key))),a.map((t=>Object(f.jsx)(u.a,{className:"control",control:t,innerRef:n},t.key))),r.map((t=>Object(f.jsxs)("div",{className:"input",children:[Object(f.jsx)(u.c,{type:"input",socket:t.socket,io:t,innerRef:e}),Object(f.jsx)("div",{className:"input-title",children:t.name})]},t.key)))]})}}class J extends i.c.Control{constructor(t,e,n,o=!1){super(e),this.emitter=t,this.keys=[],this.component=J.component,this.props={readonly:o,value:"",onChange:()=>{}},n.data.output=""}setValue(t,e,n){this.props.value=e,this.putData("output",e),this.putData("contentType",n);for(const o in t)t[o][0]&&this.putData(o,t[o][0]);this.update()}}J.component=({value:t,onChange:e})=>Object(f.jsx)("textarea",{value:t,rows:10,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value))});var V=J,P=n(134),U=n(135),A=n.n(U);class B extends i.c.Component{constructor(t,e,n){super("Template"),this.path=["[ Template ]"],this.data.component=R,this.dataSocket=t,this.templateSocket=e,this.htmlSocket=n}builder(t){const e=new i.c.Input("template","TemplateEngine",this.templateSocket),n=new i.c.Input("json","Data (JSON)",this.dataSocket),o=new i.c.Output("html","HTML",this.htmlSocket);return n.addControl(new T(this.editor,"json",t)),t.addInput(e).addInput(n).addControl(new V(this.editor,"template",t,!0)).addOutput(o)}worker(t,e,n){const o=e.json.length?e.json[0]:t.data.json,s=t.inputs.template.connections.filter((t=>"hbs"===(null===t||void 0===t?void 0:t.output)||"pug"===(null===t||void 0===t?void 0:t.output))),a=(()=>{var n;if(0===s.length)return"No TemplateEngine detected...";const a=s[0].output,r=(null===(n=e.template)||void 0===n?void 0:n.length)?e.template[0]:t.data.json;if("pug"===a)return P.render(r,JSON.parse(o));if("hbs"===a){return A.a.compile(r)(JSON.parse(o))}})();this.editor.nodes.find((e=>e.id===t.id)).controls.get("template").setValue(e,a,"text/html; charset=utf-8"),n.html=a}}var F=B;class M extends i.c.Control{constructor(t,e,n,o=!1){super(e),this.emitter=t,this.key=e,this.component=M.component;const s=n.data[e]||"<div>{{name}}</div>";n.data[e]=s,n.data.output=s,this.props={readonly:o,value:s,onChange:t=>{this.setValue(t),this.emitter.trigger("process")}}}setValue(t){this.props.value=t,this.putData(this.key,t),this.putData("output",t),this.update()}}M.component=({value:t,onChange:e})=>Object(f.jsx)("textarea",{value:t,rows:10,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value))});var H=M;class W extends i.c.Component{constructor(t){super("Handlebars"),this.path=["[ Template ]"],this.socket=t}builder(t){const e=new i.c.Output("hbs","Handlebars",this.socket);return t.addControl(new H(this.editor,"hbs",t)).addOutput(e)}worker(t,e,n){n.hbs=t.data.hbs}}var K=W;class _ extends i.c.Control{constructor(t,e,n,o=!1){super(e),this.emitter=t,this.key=e,this.component=_.component;const s=n.data[e]||"div #{name}";n.data[e]=s,n.data.output=s,this.props={readonly:o,value:s,onChange:t=>{this.setValue(t),this.emitter.trigger("process")}}}setValue(t){this.props.value=t,this.putData(this.key,t),this.putData("output",t),this.update()}}_.component=({value:t,onChange:e})=>Object(f.jsx)("textarea",{value:t,rows:10,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value))});var z=_;class Y extends i.c.Component{constructor(t){super("Pug"),this.path=["[ Template ]"],this.socket=t}builder(t){const e=new i.c.Output("pug","Pug",this.socket);return t.addControl(new z(this.editor,"pug",t)).addOutput(e)}worker(t,e,n){n.pug=t.data.pug}}var Z=Y;class q extends i.c.Control{constructor(t,e,n,o=!1){super(e),this.emitter=t,this.key=e,this.component=q.component;const s=n.data[e]||!1;n.data[e]=s,n.data.output=s,this.props={readonly:o,checked:s,onChange:t=>{this.setValue(!!t),this.emitter.trigger("process")}}}setValue(t){this.props.checked=t,this.putData(this.key,t),this.putData("output",t),this.update()}}q.component=({checked:t,onChange:e})=>Object(f.jsx)("input",{type:"checkbox",checked:t,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(+t.target.checked)});var G=q;class Q extends i.c.Component{constructor(t){super("Boolean"),this.path=["[ Input ]"],this.socket=t}builder(t){const e=new i.c.Output("boolean","Boolean",this.socket);return t.addControl(new G(this.editor,"boolean",t)).addOutput(e)}worker(t,e,n){n.boolean=t.data.boolean}}var X=Q;class $ extends u.b{render(){const t=this.props,e=t.bindSocket,n=t.bindControl,o=this.state,s=o.outputs,a=o.controls,r=o.inputs,c=o.selected;return Object(f.jsxs)("div",{className:"node ".concat(c),style:{background:"grey"},children:[Object(f.jsx)("div",{className:"title",children:"Endpoint"}),s.map((t=>Object(f.jsxs)("div",{className:"output",children:[Object(f.jsx)("div",{className:"output-title",children:t.name}),Object(f.jsx)(u.c,{type:"output",socket:t.socket,io:t,innerRef:e})]},t.key))),a.map((t=>Object(f.jsx)(u.a,{className:"control",control:t,innerRef:n},t.key))),r.map((t=>Object(f.jsxs)("div",{className:"input",children:[Object(f.jsx)(u.c,{type:"input",socket:t.socket,io:t,innerRef:e}),Object(f.jsx)("div",{className:"input-title",children:t.name})]},t.key)))]})}}class tt extends i.c.Control{constructor(t,e,n,o=!1){super(e),this.emitter=t,this.keys=[],this.component=tt.component,this.props={readonly:o,value:"",onChange:()=>{}},n.data.output=""}setValue(t,e,n,o){this.props.value=e,this.putData("enabledFlag",o),this.putData("output",e),this.putData("contentType",n);for(const s in t)t[s][0]&&this.putData(s,t[s][0]);this.update()}}tt.component=({value:t,onChange:e})=>Object(f.jsx)("textarea",{value:t,rows:10,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value))});var et=tt;class nt extends i.c.Component{constructor(t,e,n){super("Endpoint"),this.path=["[ Endpoint ]"],this.data.component=$,this.booleanSocket=t,this.stringSocket=e,this.pathSocket=n}builder(t){const e=new i.c.Input("enabledFlag","Enabled (Boolean)",this.booleanSocket),n=new i.c.Input("content","Content (JSON/HTML)",this.stringSocket),o=new i.c.Input("path","Path",this.pathSocket);return e.addControl(new G(this.editor,"enabledFlag",t)),n.addControl(new S(this.editor,"content",t)),o.addControl(new S(this.editor,"path",t)),t.addInput(e).addInput(n).addInput(o).addControl(new et(this.editor,"endpoint",t,!0))}worker(t,e,n){const o=e.content.length?e.content[0]:"Rendering...",s=(t=>{if(t)return"html"===t.output?"text/html; charset=utf-8":"json"===t.output?"application/json; charset=utf-8":"text/plain; charset=utf-8"})(t.inputs.content.connections[0]),a=!!e.enabledFlag.length&&e.enabledFlag[0];this.editor.nodes.find((e=>e.id===t.id)).controls.get("endpoint").setValue(e,o,s,a)}}var ot=nt;class st extends i.c.Component{constructor(t){super("Path"),this.path=["[ Input ]"],this.socket=t}builder(t){const e=new i.c.Output("path","Path",this.socket);return t.addControl(new S(this.editor,"path",t)).addOutput(e)}worker(t,e,n){n.path=t.data.path}}var at=st;class rt extends i.c.Control{constructor(t,e,n,o=!1){super(e),this.emitter=t,this.key=e,this.component=rt.component;const s=n.data[e]||'{"name": "value"}';n.data[e]=s,n.data.output=s,this.props={readonly:o,value:s,onChange:t=>{this.setValue(t),this.emitter.trigger("process")}}}setValue(t){this.putData(this.key,t),this.putData("output",null),this.update()}}rt.component=()=>null;var ct=rt;class it extends u.b{render(){const t=this.props,e=t.node,n=t.bindSocket,o=t.bindControl,s=this.state,a=s.outputs,r=s.controls,c=s.inputs,i=s.selected;return Object(f.jsxs)("div",{className:"node ".concat(i),style:{background:"grey"},children:[Object(f.jsx)("div",{className:"title",children:e.name}),a.map((t=>Object(f.jsxs)("div",{className:"output",children:[Object(f.jsx)("div",{className:"output-title",children:t.name}),Object(f.jsx)(u.c,{type:"output",socket:t.socket,io:t,innerRef:n})]},t.key))),r.map((t=>Object(f.jsx)(u.a,{className:"control",control:t,innerRef:o},t.key))),c.map((t=>Object(f.jsxs)("div",{className:"input",children:[Object(f.jsx)(u.c,{type:"input",socket:t.socket,io:t,innerRef:n}),!t.showControl()&&Object(f.jsx)("div",{className:"input-title",children:t.name}),t.showControl()&&Object(f.jsx)(u.a,{className:"input-control",control:t.control,innerRef:o})]},t.key)))]})}}class ut extends i.c.Component{constructor(t,e){super("API"),this.path=["[ Seed ]"],this.data.component=it,this.urlSocket=t,this.jsonSocket=e}builder(t){const e=new i.c.Input("url","URL",this.urlSocket),n=new i.c.Input("json","Dummy Output (JSON)",this.jsonSocket),o=new i.c.Output("json","JSON",this.jsonSocket);return t.addInput(e).addInput(n).addControl(new ct(this.editor,"json",t,!0)).addOutput(o)}worker(t,e,n){const o=e.json.length?e.json[0]:t.data.json;this.editor.nodes.find((e=>e.id===t.id)).controls.get("json").setValue(o),n.json=o}}var pt=ut;class dt extends i.c.Component{constructor(t){super("URL"),this.path=["[ Input ]"],this.socket=t}builder(t){const e=new i.c.Output("url","URL",this.socket);return t.addControl(new S(this.editor,"url",t)).addOutput(e)}worker(t,e,n){n.url=t.data.url}}var lt=dt,ht=n(66),mt=n.n(ht),gt=n(136);function vt(){return(vt=Object(c.a)(r.a.mark((function t(e){var n,o,s,a,h,v,w,f,C,S,N,E,T,I,R,J;return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=new i.c.Socket("String value"),o=new i.c.Socket("Boolean value"),(s=new i.c.Socket("Text value")).combineWith(n),(a=new i.c.Socket("Json value")).combineWith(n),(h=new i.c.Socket("Template value")).combineWith(n),(v=new i.c.Socket("Handlebars value")).combineWith(h),(w=new i.c.Socket("Pug value")).combineWith(h),(f=new i.c.Socket("HTML value")).combineWith(n),C=new i.c.Socket("Path value"),S=new i.c.Socket("URL value"),N=[new ot(o,n,C),new D(s),new L(a),new F(a,h,f),new K(v),new Z(w),new X(o),new at(C),new pt(S,a),new lt(S)],(E=new i.c.NodeEditor("tuna-mayonnaise@0.0.1",e)).use(p.a),E.use(u.d),t.t0=E,t.t1=l.a,t.t2={Arrange(){E.nodes.forEach((t=>{E.trigger("arrange",t)}))},Undo(){E.trigger("undo")},Redo(){E.trigger("redo")},Save(){mt.a.post("/regist",E.toJSON()).then((()=>y.b.success("This configuration is SAVED :)"))).catch((()=>y.b.error("Maybe tuna tool command is TERMINATED :(")))},Download(){T=new Blob([JSON.stringify(E.toJSON())],{type:"application/json;charset=utf-8"}),Object(gt.saveAs)(T,"tuna-mayonnaise.json")},Debug(){console.log(JSON.stringify(E.toJSON()))}},t.t3={searchBar:!1,delay:100,allocate:t=>t.path,rename:t=>t.name,items:t.t2},t.t0.use.call(t.t0,t.t1,t.t3),E.use(m.a),E.use(g.a,{margin:20}),E.use(k.a),E.use(b.a,{type:b.a.DEFAULT,transformer:()=>([t,e,n,o])=>[[t,e],[n,o]],curve:b.a.curveBundle,options:{vertical:!1,curvature:.4},arrow:{color:"steelblue",marker:"M-5,-10 L-5,10 L20,0 z"}}),E.use(j.a),E.use(x.a,{margin:{x:200,y:50},depth:0}),E.use(O.a,{keyboard:!0}),-1!==window.navigator.userAgent.toLowerCase().indexOf("mac os x")&&document.addEventListener("keydown",(t=>{if(t.metaKey)switch(t.code){case"KeyY":E.trigger("redo");break;case"KeyZ":t.shiftKey?E.trigger("redo"):E.trigger("undo")}})),I=new i.c.Engine("tuna-mayonnaise@0.0.1"),N.forEach((t=>{E.register(t),I.register(t)})),t.next=38,mt.a.get("/tuna-configuration").then((t=>t.data)).catch((()=>null));case 38:if(null===(R=t.sent)){t.next=45;break}return t.next=42,E.fromJSON(R);case 42:y.b.success("Previous configuration is RESTORED :)"),t.next=50;break;case 45:return t.next=47,N[0].createNode();case 47:(J=t.sent).position=[1e3,200],E.addNode(J);case 50:E.on("process nodecreated noderemoved connectioncreated connectionremoved",Object(c.a)(r.a.mark((function t(){return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("process"),t.next=3,I.abort();case 3:return t.next=5,I.process(E.toJSON());case 5:case"end":return t.stop()}}),t)})))),E.view.resize(),E.trigger("process"),d.a.zoomAt(E,E.nodes);case 54:case"end":return t.stop()}}),t)})))).apply(this,arguments)}n(370),n(371);function kt(){return Object(f.jsxs)("div",{className:"App",children:[Object(f.jsx)(y.a,{}),Object(f.jsx)("div",{style:{width:"100vh",height:"100vh"},ref:t=>t&&function(t){return vt.apply(this,arguments)}(t)})]})}const bt=document.getElementById("root");s.a.render(Object(f.jsx)(kt,{}),bt)}},[[372,1,2]]]);