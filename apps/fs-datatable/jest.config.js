module.exports = {
  name: "fs-datatable",
  preset: "../../jest.config.js",
  coverageDirectory: "../../coverage/apps/fs-datatable/",
  snapshotSerializers: [
    "jest-preset-angular/AngularSnapshotSerializer.js",
    "jest-preset-angular/HTMLCommentSerializer.js"
  ]
};
