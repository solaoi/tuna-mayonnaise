(this["webpackJsonptuna-mayonnaise-ui"]=this["webpackJsonptuna-mayonnaise-ui"]||[]).push([[0],{108:function(t,e){},146:function(t,e){},184:function(t,e){function n(t){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}n.keys=function(){return[]},n.resolve=n,t.exports=n,n.id=184},185:function(t,e){function n(t){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}n.keys=function(){return[]},n.resolve=n,t.exports=n,n.id=185},371:function(t,e,n){},372:function(t,e,n){"use strict";n.r(e);var o=n(2),s=(n(1),n(20)),a=n.n(s),r=n(3),c=n.n(r),i=n(65),u=n(0),d=n(5),p=n(125),l=n(126),h=n(137),m=n(128),g=n.n(m),v=n(129),k=n(130),b=n.n(k),j=n(44),w=n(131),x=n(132),O=n.n(x),y=n(133),f=n(27);class C extends u.c.Control{constructor(t,e,n,o=!1){super(e),this.emitter=t,this.key=e,this.component=C.component;const s=n.data[e]||"";n.data[e]=s,n.data.output=s,this.props={readonly:o,value:s,onChange:t=>{this.setValue(t),this.emitter.trigger("process")}}}setValue(t){this.props.value=t,this.putData(this.key,t),this.putData("output",t),this.update()}}C.component=({value:t,onChange:e})=>Object(o.jsx)("input",{type:"text",value:t,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value))});var S=C;class N extends u.c.Component{constructor(t){super("Text"),this.path=["[ Input ]"],this.socket=t}builder(t){const e=new u.c.Output("text","Text",this.socket);return t.addControl(new S(this.editor,"text",t)).addOutput(e)}worker(t,e,n){n.text=t.data.text}}var D=N;class E extends u.c.Control{constructor(t,e,n,o=!1){super(e),this.emitter=t,this.key=e,this.component=E.component;const s=n.data[e]||'{"name": "value"}';n.data[e]=s,n.data.output=s,this.props={readonly:o,value:s,onChange:t=>{this.setValue(t),this.emitter.trigger("process")}}}setValue(t){this.props.value=t,this.putData(this.key,t),this.putData("output",t),this.update()}}E.component=({value:t,onChange:e})=>Object(o.jsx)("textarea",{value:t,rows:10,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value))});var T=E;class I extends u.c.Component{constructor(t){super("JSON"),this.path=["[ Input ]"],this.socket=t}builder(t){const e=new u.c.Output("json","JSON",this.socket);return t.addControl(new T(this.editor,"json",t)).addOutput(e)}worker(t,e,n){n.json=t.data.json}}var L=I;class R extends d.b{render(){const t=this.props,e=(t.node,t.bindSocket),n=t.bindControl,s=this.state,a=s.outputs,r=s.controls,c=s.inputs,i=s.selected;return Object(o.jsxs)("div",{className:"node ".concat(i),style:{background:"grey"},children:[Object(o.jsx)("div",{className:"title",children:"Template"}),a.map((t=>Object(o.jsxs)("div",{className:"output",children:[Object(o.jsx)("div",{className:"output-title",children:t.name}),Object(o.jsx)(d.c,{type:"output",socket:t.socket,io:t,innerRef:e})]},t.key))),r.map((t=>Object(o.jsx)(d.a,{className:"control",control:t,innerRef:n},t.key))),c.map((t=>Object(o.jsxs)("div",{className:"input",children:[Object(o.jsx)(d.c,{type:"input",socket:t.socket,io:t,innerRef:e}),Object(o.jsx)("div",{className:"input-title",children:t.name})]},t.key)))]})}}class J extends u.c.Control{constructor(t,e,n,o=!1){super(e),this.emitter=t,this.keys=[],this.component=J.component,this.props={readonly:o,value:"",onChange:()=>{}},n.data.output=""}setValue(t,e,n){this.props.value=e,this.putData("output",e),this.putData("contentType",n);for(const o in t)t[o][0]&&this.putData(o,t[o][0]);this.update()}}J.component=({value:t,onChange:e})=>Object(o.jsx)("textarea",{value:t,rows:10,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value))});var V=J,P=n(134),U=n(135),A=n.n(U);class B extends u.c.Component{constructor(t,e,n){super("Template"),this.path=["[ Template ]"],this.data.component=R,this.dataSocket=t,this.templateSocket=e,this.htmlSocket=n}builder(t){const e=new u.c.Input("template","TemplateEngine",this.templateSocket),n=new u.c.Input("json","Data (JSON)",this.dataSocket),o=new u.c.Output("html","HTML",this.htmlSocket);return n.addControl(new T(this.editor,"json",t)),t.addInput(e).addInput(n).addControl(new V(this.editor,"template",t,!0)).addOutput(o)}worker(t,e,n){const o=e.json.length?e.json[0]:t.data.json,s=t.inputs.template.connections.filter((t=>"hbs"===(null===t||void 0===t?void 0:t.output)||"pug"===(null===t||void 0===t?void 0:t.output))),a=(()=>{var n;if(0===s.length)return"No TemplateEngine detected...";const a=s[0].output,r=(null===(n=e.template)||void 0===n?void 0:n.length)?e.template[0]:t.data.json;if("pug"===a)return P.render(r,JSON.parse(o));if("hbs"===a){return A.a.compile(r)(JSON.parse(o))}})();this.editor.nodes.find((e=>e.id==t.id)).controls.get("template").setValue(e,a,"text/html; charset=utf-8"),n.html=a}}var F=B;class M extends u.c.Control{constructor(t,e,n,o=!1){super(e),this.emitter=t,this.key=e,this.component=M.component;const s=n.data[e]||"<div>{{name}}</div>";n.data[e]=s,n.data.output=s,this.props={readonly:o,value:s,onChange:t=>{this.setValue(t),this.emitter.trigger("process")}}}setValue(t){this.props.value=t,this.putData(this.key,t),this.putData("output",t),this.update()}}M.component=({value:t,onChange:e})=>Object(o.jsx)("textarea",{value:t,rows:10,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value))});var H=M;class W extends u.c.Component{constructor(t){super("Handlebars"),this.path=["[ Template ]"],this.socket=t}builder(t){const e=new u.c.Output("hbs","Handlebars",this.socket);return t.addControl(new H(this.editor,"hbs",t)).addOutput(e)}worker(t,e,n){n.hbs=t.data.hbs}}var K=W;class _ extends u.c.Control{constructor(t,e,n,o=!1){super(e),this.emitter=t,this.key=e,this.component=_.component;const s=n.data[e]||"div #{name}";n.data[e]=s,n.data.output=s,this.props={readonly:o,value:s,onChange:t=>{this.setValue(t),this.emitter.trigger("process")}}}setValue(t){this.props.value=t,this.putData(this.key,t),this.putData("output",t),this.update()}}_.component=({value:t,onChange:e})=>Object(o.jsx)("textarea",{value:t,rows:10,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value))});var z=_;class Y extends u.c.Component{constructor(t){super("Pug"),this.path=["[ Template ]"],this.socket=t}builder(t){const e=new u.c.Output("pug","Pug",this.socket);return t.addControl(new z(this.editor,"pug",t)).addOutput(e)}worker(t,e,n){n.pug=t.data.pug}}var Z=Y;class q extends u.c.Control{constructor(t,e,n,o=!1){super(e),this.emitter=t,this.key=e,this.component=q.component;const s=n.data[e]||!1;n.data[e]=s,n.data.output=s,this.props={readonly:o,checked:s,onChange:t=>{this.setValue(!!t),this.emitter.trigger("process")}}}setValue(t){this.props.checked=t,this.putData(this.key,t),this.putData("output",t),this.update()}}q.component=({checked:t,onChange:e})=>Object(o.jsx)("input",{type:"checkbox",checked:t,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(+t.target.checked)});var G=q;class Q extends u.c.Component{constructor(t){super("Boolean"),this.path=["[ Input ]"],this.socket=t}builder(t){const e=new u.c.Output("boolean","Boolean",this.socket);return t.addControl(new G(this.editor,"boolean",t)).addOutput(e)}worker(t,e,n){n.boolean=t.data.boolean}}var X=Q;class $ extends d.b{render(){const t=this.props,e=(t.node,t.bindSocket),n=t.bindControl,s=this.state,a=s.outputs,r=s.controls,c=s.inputs,i=s.selected;return Object(o.jsxs)("div",{className:"node ".concat(i),style:{background:"grey"},children:[Object(o.jsx)("div",{className:"title",children:"Endpoint"}),a.map((t=>Object(o.jsxs)("div",{className:"output",children:[Object(o.jsx)("div",{className:"output-title",children:t.name}),Object(o.jsx)(d.c,{type:"output",socket:t.socket,io:t,innerRef:e})]},t.key))),r.map((t=>Object(o.jsx)(d.a,{className:"control",control:t,innerRef:n},t.key))),c.map((t=>Object(o.jsxs)("div",{className:"input",children:[Object(o.jsx)(d.c,{type:"input",socket:t.socket,io:t,innerRef:e}),Object(o.jsx)("div",{className:"input-title",children:t.name})]},t.key)))]})}}class tt extends u.c.Control{constructor(t,e,n,o=!1){super(e),this.emitter=t,this.keys=[],this.component=tt.component,this.props={readonly:o,value:"",onChange:()=>{}},n.data.output=""}setValue(t,e,n,o){this.props.value=e,this.putData("enabledFlag",o),this.putData("output",e),this.putData("contentType",n);for(const s in t)t[s][0]&&this.putData(s,t[s][0]);this.update()}}tt.component=({value:t,onChange:e})=>Object(o.jsx)("textarea",{value:t,rows:10,ref:t=>{t&&t.addEventListener("pointerdown",(t=>t.stopPropagation()))},onChange:t=>e(String(t.target.value))});var et=tt;class nt extends u.c.Component{constructor(t,e,n){super("Endpoint"),this.data.component=$,this.booleanSocket=t,this.stringSocket=e,this.pathSocket=n}builder(t){const e=new u.c.Input("enabledFlag","Enabled (Boolean)",this.booleanSocket),n=new u.c.Input("content","Content (JSON/HTML)",this.stringSocket),o=new u.c.Input("path","Path",this.pathSocket);return e.addControl(new G(this.editor,"enabledFlag",t)),n.addControl(new S(this.editor,"content",t)),o.addControl(new S(this.editor,"path",t)),t.addInput(e).addInput(n).addInput(o).addControl(new et(this.editor,"endpoint",t,!0))}worker(t,e,n){const o=e.content.length?e.content[0]:"Rendering...",s=(t=>{if(t)return"html"===t.output?"text/html; charset=utf-8":"json"===t.output?"application/json; charset=utf-8":"text/plain; charset=utf-8"})(t.inputs.content.connections[0]),a=!!e.enabledFlag.length&&e.enabledFlag[0];this.editor.nodes.find((e=>e.id==t.id)).controls.get("endpoint").setValue(e,o,s,a)}}var ot=nt;class st extends u.c.Component{constructor(t){super("Path"),this.path=["[ Input ]"],this.socket=t}builder(t){const e=new u.c.Output("path","Path",this.socket);return t.addControl(new S(this.editor,"path",t)).addOutput(e)}worker(t,e,n){n.path=t.data.path}}var at=st;class rt extends u.c.Control{constructor(t,e,n,o=!1){super(e),this.emitter=t,this.key=e,this.component=rt.component;const s=n.data[e]||'{"name": "value"}';n.data[e]=s,n.data.output=s,this.props={readonly:o,value:s,onChange:t=>{this.setValue(t),this.emitter.trigger("process")}}}setValue(t){this.putData(this.key,t),this.putData("output",null),this.update()}}rt.component=()=>null;var ct=rt;class it extends d.b{render(){const t=this.props,e=t.node,n=t.bindSocket,s=t.bindControl,a=this.state,r=a.outputs,c=a.controls,i=a.inputs,u=a.selected;return Object(o.jsxs)("div",{className:"node ".concat(u),style:{background:"grey"},children:[Object(o.jsx)("div",{className:"title",children:e.name}),r.map((t=>Object(o.jsxs)("div",{className:"output",children:[Object(o.jsx)("div",{className:"output-title",children:t.name}),Object(o.jsx)(d.c,{type:"output",socket:t.socket,io:t,innerRef:n})]},t.key))),c.map((t=>Object(o.jsx)(d.a,{className:"control",control:t,innerRef:s},t.key))),i.map((t=>Object(o.jsxs)("div",{className:"input",children:[Object(o.jsx)(d.c,{type:"input",socket:t.socket,io:t,innerRef:n}),!t.showControl()&&Object(o.jsx)("div",{className:"input-title",children:t.name}),t.showControl()&&Object(o.jsx)(d.a,{className:"input-control",control:t.control,innerRef:s})]},t.key)))]})}}class ut extends u.c.Component{constructor(t,e){super("API"),this.path=["[ Seed ]"],this.data.component=it,this.urlSocket=t,this.jsonSocket=e}builder(t){const e=new u.c.Input("url","URL",this.urlSocket),n=new u.c.Input("json","Dummy Output (JSON)",this.jsonSocket),o=new u.c.Output("json","JSON",this.jsonSocket);return t.addInput(e).addInput(n).addControl(new ct(this.editor,"json",t,!0)).addOutput(o)}worker(t,e,n){const o=e.json.length?e.json[0]:t.data.json;this.editor.nodes.find((e=>e.id==t.id)).controls.get("json").setValue(o),n.json=o}}var dt=ut;class pt extends u.c.Component{constructor(t){super("URL"),this.path=["[ Input ]"],this.socket=t}builder(t){const e=new u.c.Output("url","URL",this.socket);return t.addControl(new S(this.editor,"url",t)).addOutput(e)}worker(t,e,n){n.url=t.data.url}}var lt=pt,ht=n(66),mt=n.n(ht),gt=n(136);function vt(){return(vt=Object(i.a)(c.a.mark((function t(e){var n,o,s,a,r,m,k,x,C,S,N,E,T,I,R,J;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=new u.c.Socket("String value"),o=new u.c.Socket("Boolean value"),(s=new u.c.Socket("Text value")).combineWith(n),(a=new u.c.Socket("Json value")).combineWith(n),(r=new u.c.Socket("Template value")).combineWith(n),(m=new u.c.Socket("Handlebars value")).combineWith(r),(k=new u.c.Socket("Pug value")).combineWith(r),(x=new u.c.Socket("HTML value")).combineWith(n),C=new u.c.Socket("Path value"),S=new u.c.Socket("URL value"),N=[new ot(o,n,C),new D(s),new L(a),new F(a,r,x),new K(m),new Z(k),new X(o),new at(C),new dt(S,a),new lt(S)],(E=new u.c.NodeEditor("tuna-mayonnaise@0.0.1",e)).use(p.a),E.use(d.d),t.t0=E,t.t1=h.a,t.t2={Arrange(){E.nodes.forEach((t=>{E.trigger("arrange",t)}))},Undo(){E.trigger("undo")},Redo(){E.trigger("redo")},Save(){mt.a.post("/regist",E.toJSON()).then((()=>f.b.success("This configuration is SAVED :)"))).catch((()=>f.b.error("Maybe tuna tool command is TERMINATED :(")))},Download(){T=new Blob([JSON.stringify(E.toJSON())],{type:"application/json;charset=utf-8"}),Object(gt.saveAs)(T,"tuna-mayonnaise.json")},Debug(){console.log(JSON.stringify(E.toJSON()))}},t.t3={searchBar:!1,delay:100,allocate:t=>t.path,rename:t=>t.name,items:t.t2},t.t0.use.call(t.t0,t.t1,t.t3),E.use(g.a),E.use(v.a,{margin:20}),E.use(b.a),E.use(j.a,{type:j.a.DEFAULT,transformer:()=>([t,e,n,o])=>[[t,e],[n,o]],curve:j.a.curveBundle,options:{vertical:!1,curvature:.4},arrow:{color:"steelblue",marker:"M-5,-10 L-5,10 L20,0 z"}}),E.use(w.a),E.use(O.a,{margin:{x:200,y:50},depth:0}),E.use(y.a,{keyboard:!0}),-1!==window.navigator.userAgent.toLowerCase().indexOf("mac os x")&&document.addEventListener("keydown",(t=>{if(t.metaKey)switch(t.code){case"KeyY":E.trigger("redo");break;case"KeyZ":t.shiftKey?E.trigger("redo"):E.trigger("undo")}})),I=new u.c.Engine("tuna-mayonnaise@0.0.1"),N.map((t=>{E.register(t),I.register(t)})),t.next=38,mt.a.get("/tuna-mayonnaise").then((t=>t.data)).catch((()=>null));case 38:if(null===(R=t.sent)){t.next=45;break}return t.next=42,E.fromJSON(R);case 42:f.b.success("Previous configuration is RESTORED :)"),t.next=50;break;case 45:return t.next=47,N[0].createNode();case 47:(J=t.sent).position=[1e3,200],E.addNode(J);case 50:E.on("process nodecreated noderemoved connectioncreated connectionremoved",Object(i.a)(c.a.mark((function t(){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("process"),t.next=3,I.abort();case 3:return t.next=5,I.process(E.toJSON());case 5:case"end":return t.stop()}}),t)})))),E.view.resize(),E.trigger("process"),l.a.zoomAt(E,E.nodes);case 54:case"end":return t.stop()}}),t)})))).apply(this,arguments)}n(370),n(371);function kt(){return Object(o.jsxs)("div",{className:"App",children:[Object(o.jsx)(f.a,{}),Object(o.jsx)("div",{style:{width:"100vh",height:"100vh"},ref:t=>t&&function(t){return vt.apply(this,arguments)}(t)})]})}const bt=document.getElementById("root");a.a.render(Object(o.jsx)(kt,{}),bt)}},[[372,1,2]]]);
//# sourceMappingURL=main.105f5cff.chunk.js.map