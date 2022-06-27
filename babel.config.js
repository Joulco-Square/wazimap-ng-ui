module.exports = {
  "presets": [
		"@babel/preset-env"
 ],
 env: {
    test: {
      plugins: [
        '@babel/plugin-proposal-class-properties',
      ]
    }
 },
  "plugins": [
    "transform-regenerator",
  ]
};
