
const StyleDictionary = require('style-dictionary');

// Tailwind 형식 커스텀 포맷 등록
StyleDictionary.registerFormat({
  name: 'tailwind/js',
  formatter: function({ dictionary }) {
    const tokens = dictionary.allProperties.reduce((acc, prop) => {
      const path = prop.path.join('.');
      acc[path] = prop.value;
      return acc;
    }, {});
    return `module.exports = ${JSON.stringify(tokens, null, 2)};`;
  }
});


StyleDictionary.registerTransform({
  name: 'attribute/spacing',
  type: 'attribute',
  matcher: (token) => token.name.startsWith('space-'),
  transformer: (token) => ({ category: 'spacing' }),
});


StyleDictionary.registerTransform({
  name: 'spacing/px',
  type: 'value',
  matcher: (token) => token.type === 'dimension',
  transformer: (token) => `${token.value}px`,
});



StyleDictionary.registerTransformGroup({
  name: 'custom/css',
  transforms: [
    'attribute/spacing',
    'name/cti/kebab',
    'time/seconds',
    'content/icon',
    'spacing/px',
    'color/css'
  ]
});


module.exports = {
  source: ['theme/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'custom/css',
      buildPath: 'build/css/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables'
      }]
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/scss/',
      files: [{
        destination: '_variables.scss',
        format: 'scss/variables'
      }]
    },
    tailwind: {
      buildPath: 'build/tailwind/',
      files: [{
        destination: 'tailwind.tokens.js',
        format: 'tailwind/js'
      }]
    }
  }
};