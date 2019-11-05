module.exports = {
  name: 'drag-drop-list',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/drag-drop-list',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
