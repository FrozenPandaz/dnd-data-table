module.exports = {
  name: 'data-table',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/data-table',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
