(this["webpackJsonpsnake-game"]=this["webpackJsonpsnake-game"]||[]).push([[0],{183:function(e,t,a){e.exports=a(384)},188:function(e,t,a){},189:function(e,t,a){},190:function(e,t,a){},191:function(e,t,a){},192:function(e,t,a){},193:function(e,t,a){},194:function(e,t,a){},195:function(e,t,a){},196:function(e,t,a){},197:function(e,t,a){},198:function(e,t,a){},384:function(e,t,a){"use strict";a.r(t);var n,r=a(0),o=a.n(r),i=a(27),c=a.n(i),s=(a(188),a(189),a(28)),l=a(29),u=a(34),d=a(30),m=a(35),h=(a(190),a(45)),g=(a(191),a(192),a(193),a(194),function(e){var t,a=e.cell,n=e.columnWidth;return t=!0===a.isEatenFood?"gray":!0===a.isSnake?"black":!0===a.isFood?"green":"white",r.createElement("div",{className:"cell",style:{width:n,backgroundColor:t}})}),p=function(e){var t=e.row,a=e.rowHeight,n=e.columnWidth;return r.createElement("div",{className:"row",style:{height:a}},t.cells.map((function(e,t){return r.createElement(g,{key:t,cell:e,columnWidth:n})})))},f=function(e){for(var t=[],a="".concat(100/e.boardHeight,"%"),n="".concat(100/e.boardWidth,"%"),o=0;o<e.boardHeight;o++){for(var i={cells:[]},c=0;c<e.boardWidth;c++)i.cells.push({isSnake:!1,isFood:!1,isEatenFood:!1});t.push(i)}e.snake.coordinates.forEach((function(e){t[e.y].cells[e.x].isSnake=!0})),t[e.food.y].cells[e.food.x].isFood=!0,e.snake.eatPoints.forEach((function(e){t[e.y].cells[e.x].isEatenFood=!0}));var s=t.map((function(e,t){return r.createElement(p,{key:t,row:e,rowHeight:a,columnWidth:n})}));return r.createElement("div",{className:"board"},s)};!function(e){e[e.UP=0]="UP",e[e.DOWN=1]="DOWN",e[e.LEFT=2]="LEFT",e[e.RIGHT=3]="RIGHT"}(n||(n={}));var v,b,S,E=a(19),T=function(){return{Snake:O(),FoodLocation:{x:2,y:2},IsOver:!1,AddScore:!1,Turn:0}},O=function(){return{coordinates:[{x:0,y:0}],directions:[n.RIGHT],eatPoints:[],growthTimers:[]}},D=function(e,t){for(var a=[],n=0;n<t;n++)for(var r=0;r<e;r++){var o=y({x:r,y:n},e);a.push(o)}return a},N=function(e,t,a,n,r){var o,i=e.Snake,c=e.FoodLocation,s=e.Turn,l=R(i,t,a,n),u=l.coordinates,d=u[u.length-1],m=w(d,c);m?(l.eatPoints.push(c),l.growthTimers.push(s+i.coordinates.length+i.growthTimers.length),o=H(u,a,n,r)):o=e.FoodLocation;var h=i.directions.length>1?i.directions[0]:t;return{Snake:I(l,s,h),FoodLocation:o,IsOver:k(d,u),Turn:s+1,AddScore:m}},R=function(e,t,a,n){for(var r=Object(E.a)(e.coordinates),o=Object(E.a)(e.directions),i=0;i<e.coordinates.length;i++){var c=e.coordinates[i],s=i+1<e.coordinates.length?e.directions[i]:t,l=G(c,s,a,n);r[i]=l,o[i]=i<e.coordinates.length-2?e.directions[i+1]:t}return Object(h.a)({},e,{coordinates:r,directions:o})},G=function(e,t,a,r){var o=0,i=0;switch(t){case n.UP:o=0===e.y?r-1:e.y-1,i=e.x;break;case n.RIGHT:i=e.x===a-1?0:e.x+1,o=e.y;break;case n.DOWN:o=e.y===r-1?0:e.y+1,i=e.x;break;case n.LEFT:i=0===e.x?a-1:e.x-1,o=e.y}return{x:i,y:o}},I=function(e,t,a){var n=Object(h.a)({},e);if(e.growthTimers.length>0&&e.growthTimers[0]===t){n.growthTimers.splice(0,1);var r=n.eatPoints.splice(0,1);n.coordinates=r.concat(n.coordinates),n.directions=[a].concat(n.directions)}return n},k=function(e,t){return-1!==t.findIndex((function(a,n){return n<t.length-1&&a.x===e.x&&a.y===e.y}))},H=function(e,t,a,n){var r=Object(E.a)(n);e.forEach((function(e,a){var n=y(e,t);r.splice(n-a,1)}));var o=Math.round(Math.random()*(r.length-1));return A(r[o],t,a)},y=function(e,t){return e.y*t+e.x},A=function(e,t,a){return{x:e%t,y:Math.floor(e/t)}},w=function(e,t){return e.x===t.x&&e.y===t.y},F=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(u.a)(this,Object(d.a)(t).call(this,e))).gameTick=void 0,a.pointPool=[],a.keyDownHandler=function(e){var t;switch(e.key){case"ArrowUp":t=n.UP;break;case"ArrowDown":t=n.DOWN;break;case"ArrowLeft":t=n.LEFT;break;case"ArrowRight":t=n.RIGHT;break;case" ":return void a.performGameStep();default:return}a.setSnakeDirection(t)},a.setSnakeDirection=function(e){var t=Object(h.a)({},a.state.gameState.Snake),r=t.coordinates.length,o=t.directions[r-1];e===n.DOWN&&o===n.UP||e===n.UP&&o===n.DOWN||e===n.LEFT&&o===n.RIGHT||e===n.RIGHT&&o===n.LEFT||a.setState({inputDirection:e})},a.performGameStep=function(){if(a.props.start)return a.setState({inputDirection:n.RIGHT,gameState:T()}),void a.props.gameStarted();if(!a.props.paused){console.log("Turn #"+a.state.gameState.Turn);var e=a.updateGame(a.state.gameState);e.IsOver?a.props.gameOver(!1):a.setState({gameState:e})}},a.updateGame=function(e){var t=N(e,a.state.inputDirection,a.props.boardWidth,a.props.boardHeight,a.pointPool);return t.AddScore&&a.props.updateScore(1),t},a.state={inputDirection:n.RIGHT,gameState:T()},a.pointPool=D(a.props.boardWidth,a.props.boardHeight),a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){this.props.humanControlled&&(window.addEventListener("keydown",this.keyDownHandler),this.gameTick=setInterval(this.performGameStep,100))}},{key:"componentWillUnmount",value:function(){this.gameTick&&clearInterval(this.gameTick)}},{key:"render",value:function(){var e=this.props,t=e.boardWidth,a=e.boardHeight,n=this.props.aiGameState?this.props.aiGameState:this.state.gameState,o=n.Snake,i=n.FoodLocation;return r.createElement(f,{snake:o,food:i,boardWidth:t,boardHeight:a})}}]),t}(r.Component),W=function(e){return r.createElement("div",null,r.createElement("label",null,e.labelText),r.createElement("input",{type:"text",onChange:e.onTextChangeHandler,value:e.value}))},x=(a(195),function(e){var t={overflow:e.overflow?e.overflow:"hidden"};return r.createElement("div",{className:"card ".concat(e.className),style:t},e.children)}),_=(a(196),function(e){return r.createElement("div",{className:"dark-bg",onClick:e.closeHandler},r.createElement("div",{className:"message-box"},r.createElement("div",{className:"score-labels"},r.createElement("label",null,"Game over!"),r.createElement("label",null,"Score: ",e.score),e.score>e.highScore?r.createElement("label",null,"New High score: ",e.score):null)))}),L=(a(197),function(e){return r.createElement("div",{className:e.id===e.selectedId?"tab-button selected":"tab-button"},r.createElement("img",{className:"tab-image",onClick:e.onClick,src:e.src,alt:"",width:"50",height:"50"}),r.createElement("label",null,e.text))}),C=(a(198),a(10)),j=function(e){return r.createElement(C.e,{className:"graph-container",width:"100%",height:"95%"},r.createElement(C.d,{data:e.data,margin:{top:5,right:100,left:0,bottom:5}},r.createElement(C.a,{strokeDasharray:"3 3"}),r.createElement(C.g,null),r.createElement(C.h,{yAxisId:"reward",dataKey:"CumulativeReward"}),r.createElement(C.h,{yAxisId:"score",orientation:"right",dataKey:"Score"}),r.createElement(C.f,null),r.createElement(C.b,null),r.createElement(C.c,{isAnimationActive:!1,yAxisId:"reward",type:"monotone",dataKey:"CumulativeReward",stroke:"blue",name:"Learning curve"}),r.createElement(C.c,{isAnimationActive:!1,yAxisId:"score",type:"monotone",dataKey:"Score",stroke:"red"})))},P=function(e){var t=e.trainingInfo;return r.createElement("div",{className:"train-ui"},r.createElement(j,{data:t}))},M=a(44),U=a.n(M),Q=a(48);!function(e){e[e.LEFT=0]="LEFT",e[e.FORWARD=1]="FORWARD",e[e.RIGHT=2]="RIGHT"}(v||(v={})),function(e){e[e.NONE=0]="NONE",e[e.RIGHT=1]="RIGHT",e[e.FORWARD=2]="FORWARD",e[e.FORWARD_AND_RIGHT=3]="FORWARD_AND_RIGHT",e[e.LEFT=4]="LEFT",e[e.LEFT_AND_RIGHT=5]="LEFT_AND_RIGHT",e[e.LEFT_AND_FORWARD=6]="LEFT_AND_FORWARD",e[e.LEFT_AND_FORWARD_AND_RIGHT=7]="LEFT_AND_FORWARD_AND_RIGHT"}(b||(b={})),function(e){e[e.NONE=0]="NONE",e[e.UP=1]="UP",e[e.DOWN=2]="DOWN",e[e.RIGHT=3]="RIGHT",e[e.LEFT=4]="LEFT"}(S||(S={}));var V=function(e,t){if(e!==v.FORWARD)switch(t){case n.UP:if(e===v.LEFT)return n.LEFT;if(e===v.RIGHT)return n.RIGHT;break;case n.RIGHT:if(e===v.LEFT)return n.UP;if(e===v.RIGHT)return n.DOWN;break;case n.DOWN:if(e===v.LEFT)return n.RIGHT;if(e===v.RIGHT)return n.LEFT;break;case n.LEFT:if(e===v.LEFT)return n.DOWN;if(e===v.RIGHT)return n.UP;break;default:return n.RIGHT}return t},z=function(e,t,a,n,r){var o=e.Snake,i=e.FoodLocation,c=o.coordinates[o.coordinates.length-1],s=o.directions[o.directions.length-1],l=K(c,i,n,r);return{Danger:B(o,s,t,n,r,a),SnakeDirection:s,FoodDirection:l}},K=function(e,t,a,n){var r=Math.abs(t.x-e.x)>a/2,o=Math.abs(t.y-e.y)>n/2;return t.x>e.x?r?S.LEFT:S.RIGHT:t.x<e.x?r?S.RIGHT:S.LEFT:t.y>e.y?o?S.UP:S.DOWN:t.y<e.y?o?S.DOWN:S.UP:S.NONE},B=function(e,t,a,n,r,o){for(var i=e.coordinates[e.coordinates.length-1],c=R(e,a,n,r),s=new Array(o.length),l=0;l<s.length;l++){s[l]=0;for(var u=o[l],d=V(u,t),m=G(i,d,n,r),h=0;h<c.coordinates.length-1;h++){var g=c.coordinates[h];if(w(m,g)){s[l]=1;break}}}var p=0;return s.forEach((function(e,t){p+=e*Math.pow(2,s.length-t-1)})),p},J=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(u.a)(this,Object(d.a)(t).call(this,e))).Q=void 0,a.Alpha=void 0,a.Gamma=void 0,a.Epsilon=void 0,a.t=void 0,a.TrainingIteration=void 0,a.CumulativeReward=void 0,a.TrainingProgress=void 0,a.Actions=void 0,a.Dangers=void 0,a.Directions=void 0,a.FoodDirections=void 0,a.pointPool=void 0,a.iterate=void 0,a.gameRunning=void 0,a.train=function(){if(!a.props.paused){if(a.props.startGame&&!a.gameRunning){console.log("Starting iteration #".concat(a.TrainingIteration)),a.t=0,a.TrainingIteration++;var e=T(),t=e.Snake.directions[e.Snake.directions.length-1],n=z(e,t,a.Actions,a.props.boardWidth,a.props.boardHeight);a.setState({gameState:e,currentState:n,gameInitialized:!0}),a.props.gameStarted(),a.gameRunning=!0}(a.state.gameState.IsOver||a.t>1e4)&&a.gameRunning?(a.props.gameOver(!0),a.TrainingProgress.push({Iteration:a.TrainingIteration,CumulativeReward:a.CumulativeReward/a.TrainingIteration,RandomChance:a.epsilonThreshold(),Score:a.props.score}),a.props.reportProgress(Object(E.a)(a.TrainingProgress)),a.gameRunning=!1,console.log("Game over. Turns: "+a.t+". Score: "+a.props.score)):a.gameRunning&&a.state.gameInitialized&&a.playSingleGame()}},a.playSingleGame=function(){var e,t,n,r,o,i,c,s,l;return U.a.async((function(u){for(;;)switch(u.prev=u.next){case 0:e=a.state,t=e.gameState,n=e.currentState,r=a.usePolicy(n),o=V(r,n.SnakeDirection),i=N(t,o,a.props.boardWidth,a.props.boardHeight,a.pointPool),c=z(i,o,a.Actions,a.props.boardWidth,a.props.boardHeight),s=a.getReward(i),a.UpdateQ(n,c,r,s),0!==s&&(l=Math.pow(a.Gamma,a.t)*s,a.CumulativeReward+=l),t.AddScore&&a.props.updateScore(1),a.t++,a.setState({gameState:i,currentState:c});case 11:case"end":return u.stop()}}))},a.UpdateQ=function(e,t,n,r){var o={State:e,Action:n},i=a.GetQValue(o),c=Math.max.apply(Math,Object(E.a)(a.GetQRewards(t))),s=(1-a.Alpha)*i+a.Alpha*(r+a.Gamma*c);a.SetQValue(o,s)},a.MapStateActionToId=function(e){return e.Action+e.State.Danger*a.Actions.length+e.State.SnakeDirection*a.Actions.length*a.Dangers.length+e.State.FoodDirection*a.Actions.length*a.Dangers.length*a.Directions.length},a.MapIdToState=function(e){var t=a.Actions.length*a.Dangers.length*a.Directions.length,n=a.Actions.length*a.Dangers.length,r=Math.floor(e/t),o=Math.floor((e-r*t)/n),i=Math.floor((e-r*t-o*n)/a.Actions.length);return{Action:e-r*t-o*n-i*a.Actions.length,State:{Danger:i,FoodDirection:r,SnakeDirection:o}}},a.GetQRewards=function(e){for(var t=new Array,n=0;n<a.Actions.length;n++){var r=a.Actions[n],o={State:e,Action:Number(r)};t[n]=a.GetQValue(o)}return t},a.usePolicy=function(e){if(a.epsilonThreshold()>Math.random())return Math.round(Math.random()*a.Actions.length-.5);var t=a.GetQRewards(e);return Number(a.Actions[t.indexOf(Math.max.apply(Math,Object(E.a)(t)))])},a.getReward=function(e){return e.AddScore?1:e.IsOver?-5:-.01},a.state={gameState:T(),currentState:{Danger:b.NONE,FoodDirection:S.DOWN,SnakeDirection:n.DOWN},gameInitialized:!1},a.TrainingIteration=0,a.CumulativeReward=0,a.TrainingProgress=[],a.Alpha=1,a.Gamma=.8,a.Epsilon=0,a.t=0,a.Q=[],a.Actions=[],a.Dangers=[],a.Directions=[],a.FoodDirections=[],a.pointPool=D(a.props.boardWidth,a.props.boardHeight),a.iterate=setInterval(a.train,50),a.gameRunning=!1,a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){this.Actions=Object.values(v).filter((function(e){return Object(Q.isNumber)(e)})),this.Dangers=Object.values(b).filter((function(e){return Object(Q.isNumber)(e)})),this.Directions=Object.values(n).filter((function(e){return Object(Q.isNumber)(e)})),this.FoodDirections=Object.values(S).filter((function(e){return Object(Q.isNumber)(e)}));for(var e=this.Actions.length*this.Dangers.length*this.Directions.length*this.FoodDirections.length,t=0;t<e;t++)this.Q.push(0);console.log("Q size: ".concat(this.Actions.length," x ").concat(this.Dangers.length," x ").concat(this.Directions.length," x ").concat(this.FoodDirections.length," = ").concat(e))}},{key:"componentWillUnmount",value:function(){clearInterval(this.iterate)}},{key:"GetQValue",value:function(e){var t=this.MapStateActionToId(e);return this.Q[t]}},{key:"SetQValue",value:function(e,t){var a=this.MapStateActionToId(e);this.Q[a]=t}},{key:"epsilonThreshold",value:function(){var e=Math.pow(.8,this.TrainingIteration);return this.Epsilon+(1-this.Epsilon)*e}},{key:"render",value:function(){var e=this;return r.createElement(F,{boardHeight:this.props.boardHeight,boardWidth:this.props.boardWidth,updateScore:this.props.updateScore,gameOver:function(){return e.props.gameOver(!0)},paused:!1,start:!1,humanControlled:!1,aiGameState:this.state.gameState,gameStarted:function(){}})}}]),t}(r.Component),$=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(u.a)(this,Object(d.a)(t).call(this,e))).updateScore=function(e){a.setState({score:a.state.score+e})},a.startNewGame=function(e){a.state.score>a.state.highScore&&a.setState({highScore:a.state.score}),a.setState({score:0,gameOver:!1,startGame:!0,paused:e})},a.gameOver=function(e){a.setState({gameOver:!0}),e&&setTimeout((function(){a.setState({gameOver:!1}),a.startNewGame(!1)}),100)},a.gridWidthChangeHandler=function(e){var t=parseInt(e.target.value);5<t&&t<40?a.setState({boardWidth:t}):alert("Width must be in range (".concat(5,", ").concat(40,")"))},a.gridHeightChangeHandler=function(e){var t=parseInt(e.target.value);5<t&&t<40?a.setState({boardHeight:t}):alert("Height must be in range (".concat(5,", ").concat(40,")"))},a.gameSpeedChangeHandler=function(e){var t=parseInt(e.target.value);50<t&&t<1e3?a.setState({gameSpeed:t}):alert("Game speed must be in range (".concat(50,", ").concat(1e3,")"))},a.renderTab=function(){switch(a.state.selectedTab){case 0:case 2:return a.renderGame();case 1:return a.renderSettings();default:return r.createElement("div",null)}},a.renderGame=function(){return r.createElement("div",{className:"game-view"},r.createElement("div",{className:"game-controls"},r.createElement(x,{className:"game-controls__card"},r.createElement("div",{className:"control-buttons"},r.createElement("button",{className:"game-controls__btn",onClick:function(){return a.setState({paused:!1})}},"Continue"),r.createElement("button",{className:"game-controls__btn",onClick:function(){return a.setState({paused:!0})}},"Pause")),r.createElement("div",{className:"game-scores"},r.createElement("label",{className:"game-scores__label"},"Score: ",a.state.score),r.createElement("label",{className:"game-scores__label"},"High score: ",a.state.highScore)))),r.createElement("div",{className:"game-board"},r.createElement(x,{className:"game-board__card"},a.state.paused?r.createElement("p",{className:"pause-text"},"Game paused"):null,a.state.gameOver?r.createElement(_,{score:a.state.score,highScore:a.state.highScore,closeHandler:function(){return a.startNewGame(!0)}}):null,a.renderGameLogic())),r.createElement("div",{className:"game-ai-info"},2===a.state.selectedTab?r.createElement(x,{className:"game-ai-info__card"},r.createElement(P,{trainingInfo:a.state.trainingInfo})):null))},a.renderGameLogic=function(){return 0===a.state.selectedTab?r.createElement(F,{boardWidth:a.state.boardWidth,boardHeight:a.state.boardHeight,paused:a.state.paused,updateScore:a.updateScore,gameOver:a.gameOver,start:a.state.startGame,humanControlled:!0,gameStarted:function(){return a.setState({startGame:!1})}}):2===a.state.selectedTab?r.createElement(J,{boardHeight:a.state.boardHeight,boardWidth:a.state.boardWidth,gameOver:a.gameOver,updateScore:a.updateScore,paused:a.state.paused,score:a.state.score,startGame:a.state.startGame,gameStarted:function(){return a.setState({startGame:!1})},reportProgress:function(e){return a.setState({trainingInfo:e})}}):r.createElement("div",null)},a.renderSettings=function(){return r.createElement("div",{className:"game-settings"},r.createElement(x,null,r.createElement(W,{labelText:"Grid width:",onTextChangeHandler:a.gridWidthChangeHandler,value:a.state.boardWidth.toString()}),r.createElement(W,{labelText:"Grid height:",onTextChangeHandler:a.gridHeightChangeHandler,value:a.state.boardHeight.toString()}),r.createElement(W,{labelText:"Game speed:",onTextChangeHandler:a.gameSpeedChangeHandler,value:a.state.gameSpeed.toString()})))},a.state={paused:!0,boardWidth:10,boardHeight:10,gameSpeed:100,selectedTab:0,score:0,highScore:0,gameOver:!1,startGame:!1,trainingInfo:[]},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this;return r.createElement("div",{className:"ui"},r.createElement("div",{className:"ui__tab"},this.renderTab()),r.createElement("div",{className:"nav"},r.createElement(x,null,r.createElement("div",{className:"nav__buttons"},r.createElement(L,{id:0,selectedId:this.state.selectedTab,onClick:function(){return e.setState({selectedTab:0})},src:"head_human_face_profile_nose_person-512.png",text:"Human player"}),r.createElement(L,{id:2,selectedId:this.state.selectedTab,onClick:function(){return e.setState({selectedTab:2,startGame:!0})},src:"Robot-icon-by-ahlangraphic-580x386.jpg",text:"AI player"})))))}}]),t}(r.Component),q=function(){return o.a.createElement("div",{className:"App"},o.a.createElement($,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(o.a.createElement(q,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[183,1,2]]]);
//# sourceMappingURL=main.975b31e5.chunk.js.map