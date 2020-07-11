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

    let filePath = files[0]

    let fileName = filePath.split('\\')[filePath.split('\\').length - 1]

    let extension = fileName.split('.')[fileName.split('.').length - 1]

    let file = {
      filePath,
      fileName,
      extension
    }

    console.log(file)

    let fileStr = fs.readFileSync(filePath)

    let txtData = ''

    if (jschardet.detect(fileStr).encoding === 'UTF-8') {
      txtData = fs.readFileSync(filePath, 'utf8')
    } else {
      txtData = iconv.decode(fileStr, 'gbk')
    }

    // let chaperReg = new RegExp('第[0-9一二三四五六七八九十百千万]+[章卷节回幕计]', 'g')
    
    // let chaperRegArr = txtData.match(chaperReg)
    // let mainUnits = chaperRegArr[0][chaperRegArr[0].length - 1]

    // let mainChaperReg = new RegExp(`第[0-9一二三四五六七八九十百千万]+${mainUnits}`, 'g')

    // console.log(txtData.split(mainChaperReg))

    // let mainChaper = txtData.match(mainChaperReg)

    // console.log(mainChaper)
    let book = {
      title: file.fileName,
      content: txtData,
      level: 0
    }

    txtData && chaperSplit('', book.content, book.level, book)

    console.log(book)
  }
}


let chaperRegStr = '第[0-9一二三四五六七八九十百千万]+'
let allUnits = '[章卷节回幕计]'

function chaperSplit(title, content, level, parent) {
  let reg = new RegExp(chaperRegStr + allUnits, 'g')

  let mathchArr = content.match(reg)
  if (mathchArr) {
    let units = mathchArr[0][mathchArr[0].length - 1]
    let unitsReg = new RegExp(chaperRegStr + units, 'g')
    let unitsMathchArr = content.match(unitsReg)

    let contentArr = content.split(unitsReg)

    if (contentArr.length > unitsMathchArr.length) {
      contentArr.splice(0, 1)
    }
    parent.catalogue = unitsMathchArr
    parent.chapters = []
    unitsMathchArr.forEach((item, index) => {
      parent.chapters.push({
        units,
        title: title + ' ' + item,
        content: contentArr[index] || '',
        level: level + 1
      })
    })

    parent.content = ''

    parent.chapters.forEach(item => {
      chaperSplit(item.title, item.content, level, item)
    })
    
    // console.log(unitsMathchArr)
    // console.log(contentArr)
  }
}