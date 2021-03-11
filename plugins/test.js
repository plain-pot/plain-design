const babel = require('@babel/core');
const JsxModel = require('./babel-plugin-react-model');

const code = `
    const props = {
        age:111,
        onChange:(e)=>{console.log('wahaha')},
    }

    var html = (
      <div class="yes">
          <h1>good good study, day day up</h1>
          <input type="text" v-model={state.text} {...props}/>
          <input type="text" v-model-start={state.start} v-model-end={state.end} {...props}/>
      </div>
    )
`;

/*
const code = `
    var html = (
      <div class="yes">
          <input type="text" v-model={state.text} onChange={e=> console.log(e)}/>
          <Date type="text" v-model={state.text} onChange={e=> console.log(e)}/>
      </div>
    )
`;*/
/*const code = `
    var html = (
      <div class="yes">
          <h1>good good study, day day up</h1>
          <input type="text" v-model={state.count}/>
          <input type="text" v-model={state[password3]}/>
      </div>
    )
`;*/

const result = babel.transform(code, {
    filename: 'test.js',
    plugins: [
        JsxModel,
    ],
});

if (!!result) {
    console.log('\n\n' + result.code);
} else {
    console.warn('no result');
}
