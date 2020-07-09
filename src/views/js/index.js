const { dialog } = require('electron').remote
const fs = require('fs')
const jschardet = require("jschardet")
const iconv = require('iconv-lite')


let openFileBtn = document.querySelector('#open-file-btn')
openFileBtn.addEventListener('click', openFileHandle)

function openFileHandle () {
  
  let files = dialog.showOpenDialogSync({
    filters: [
      { name: '文本文档', extensions: ['txt'] },
      { name: '所有文件', extensions: ['*'] }
    ],
    properties: ['openFile']
  })

  if (files && files[0]) {
    let fileStr = fs.readFileSync(files[0])

    let txtData = ''

    if (jschardet.detect(fileStr).encoding === 'UTF-8') {
      txtData = fs.readFileSync(files[0], 'utf8')
    } else {
      txtData = iconv.decode(fileStr, 'gbk')
    }

    console.log(txtData)
  }
}