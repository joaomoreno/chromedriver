#!/usr/bin/env node

var ChildProcess = require('child_process')
var path = require('path')
var temp = require('temp').track()
var fs = require('fs')

var pidPath = temp.path({ prefix: 'chromedriver-' })
var command = path.join(__dirname, 'bin', 'chromedriver')
var args = process.argv.slice(2)
var env = Object.assign({}, process.env, { CHROMEDRIVER_PID_PATH: pidPath })
var options = {
  cwd: process.cwd(),
  env: env,
  stdio: 'inherit'
}

var chromeDriverProcess = ChildProcess.spawn(command, args, options)

var killChromeDriver = function () {
  try {
    chromeDriverProcess.kill()
  } catch (ignored) {
  }
}

process.on('exit', killChromeDriver)
process.on('SIGTERM', killChromeDriver)

fs.writeFile(pidPath, String(chromeDriverProcess.pid), 'utf8', err => {
  if (err) {
    console.warn('Failed to write PID')
  }
})