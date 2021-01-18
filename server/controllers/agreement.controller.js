const Joi = require('joi')
const path = require('path')
const mongoose = require('mongoose')
const webpack = require('webpack')
const Promise = require('bluebird')
const Agreement = mongoose.model('Agreement')
const GeneratorCtrl = require('./generator.controller')
const fsPromises = require('fs').promises

const asyncWebpack = Promise.promisify(webpack)

function resolve(dir) {
  return path.join(process.cwd(), '.', dir)
}

const webpackConfig = function(model) {
  return {
    mode: 'production',
    entry: path.resolve('assets/' + model.hanShu),
    module: {
      rules: [{
        loader: 'babel-loader'
      }]
    },
    externals: {
      'request': 'request'
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js'],
      alias: {
        '@utils': resolve('server/utils')
      }
    },
    output: {
      path: path.resolve(`assets/agreement/${model.name}`),
      library: model.name,
      libraryTarget: 'this',
      filename: 'index.js'
    }
  }
}
const webpackNodeConfig = function(model) {
  return {
    mode: 'production',
    entry: path.resolve('assets/' + model.hanShu),
    target: 'node',
    module: {
      rules: [{
      }]
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js'],
      alias: {
        '@utils': resolve('server/utils')
      }
    },
    externals: {
      'request': 'request'
    },
    output: {
      path: path.resolve(`assets/agreement/${model.name}`),
      library: model.name,
      libraryTarget: 'commonjs2',
      filename: 'index.node.js'
    }
  }
}

/**
 * 验证
 */
const agreementSchema = Joi.object({
  type: Joi.number(),
  name: Joi.string(),
  hanShu: Joi.any(),
  doc: Joi.any(),
  edition: Joi.string(),
  notes: Joi.string(),
  dimension: Joi.number()

})
class AgreementCtrl extends GeneratorCtrl {
// 在这里新加函数或者修改继承的函数

  async insert(agreement) {
    agreement = await Joi.validate(agreement, agreementSchema, { abortEarly: false, allowUnknown: true })
    if (agreement.hanShu && agreement.hanShu !== `agreement/${agreement.name}/index.source.js`) {
      await fsPromises.mkdir(resolve(`assets/agreement/${agreement.name}`), { recursive: true })
      await fsPromises.copyFile(resolve('assets/' + agreement.hanShu), resolve(`assets/agreement/${agreement.name}/index.source.js`))
      agreement.hanShu = `agreement/${agreement.name}/index.source.js`
    }
    if (agreement.doc) {
      const dos = agreement.doc.split('.')
      const fileType = dos[dos.length - 1]
      await fsPromises.mkdir(resolve(`assets/agreement/${agreement.name}`), { recursive: true })
      await fsPromises.copyFile(resolve('assets/' + agreement.doc), resolve(`assets/agreement/${agreement.name}/${agreement.name}.` + fileType))
      agreement.doc = `agreement/${agreement.name}/${agreement.name}.` + fileType
    }
    if (agreement.state === 1) {
      const gulp = require('gulp')
      const uglify = require('gulp-uglify-es').default
      await fsPromises.copyFile(resolve('assets/' + agreement.hanShu), resolve(`assets/agreement/${agreement.name}/index.node.js`))
      await gulp.src(resolve(`assets/agreement/${agreement.name}/index.node.js`))
      // .pipe(babel())
      // 2. 压缩文件
        .pipe(uglify({ mangle: true }))
        // 3. 另存压缩后的文件
        .pipe(gulp.dest(resolve(`assets/agreement/${agreement.name}`)))
      agreement.minNode = `agreement/${agreement.name}/index.node.js`
    } else {
      // 编译协议
      await asyncWebpack([webpackConfig(agreement), webpackNodeConfig(agreement)])
      agreement.minJs = `agreement/${agreement.name}/index.js`
      agreement.minNode = `agreement/${agreement.name}/index.node.js`
    }
    agreement = await new Agreement(agreement).save()
    return agreement
  }

  async update(agreement, body) {
    agreement = Object.assign(agreement, body)
    // console.log(agreement.hanShu)
    if (agreement.hanShu && agreement.hanShu !== `agreement/${agreement.name}/index.source.js`) {
      await fsPromises.mkdir(resolve(`assets/agreement/${agreement.name}`), { recursive: true })
      await fsPromises.copyFile(resolve('assets/' + agreement.hanShu), resolve(`assets/agreement/${agreement.name}/index.source.js`))
      agreement.hanShu = `agreement/${agreement.name}/index.source.js`
    }
    if (agreement.doc) {
      const dos = agreement.doc.split('.')
      const fileType = dos[dos.length - 1]
      await fsPromises.mkdir(resolve(`assets/agreement/${agreement.name}`), { recursive: true })
      await fsPromises.copyFile(resolve('assets/' + agreement.doc), resolve(`assets/agreement/${agreement.name}/${agreement.name}.` + fileType))
      agreement.doc = `agreement/${agreement.name}/${agreement.name}.` + fileType
    }
    if (agreement.state === 1) {
      const gulp = require('gulp')
      const uglify = require('gulp-uglify-es').default
      await fsPromises.copyFile(resolve('assets/' + agreement.hanShu), resolve(`assets/agreement/${agreement.name}/index.node.js`))
      await gulp.src(resolve(`assets/agreement/${agreement.name}/index.node.js`))
      // .pipe(babel())
      // 2. 压缩文件
        .pipe(uglify({ mangle: true }))
        // 3. 另存压缩后的文件
        .pipe(gulp.dest(resolve(`assets/agreement/${agreement.name}`)))
      agreement.minNode = `agreement/${agreement.name}/index.node.js`
    } else {
      await asyncWebpack([webpackConfig(agreement), webpackNodeConfig(agreement)])
      agreement.minJs = `agreement/${agreement.name}/index.js`
      agreement.minNode = `agreement/${agreement.name}/index.node.js`
    }
    delete require.cache[path.resolve('assets/' + agreement.minNode)]
    await agreement.save()
    return agreement
  }
}

module.exports = new AgreementCtrl(Agreement, agreementSchema)
