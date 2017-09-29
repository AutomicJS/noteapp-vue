const {app, BrowserWindow} = require('electron')
var url = require('url')
const path = require('path')

let win = null 

app.on('ready', function () {
	win = new BrowserWindow({ width: 1000, height: 600 })

	win.loadURL(url.format({
		pathname: path.join(__dirname + '/dist/index.html'),
		protocol: 'file',
		slashes: true
	}))

	win.on('closed', function () {
		win = null
	})
});


app.on('active', () => {
	if ( win === null ) {
		createWindow() 
	}
})

app.on('window-all-closed', function () {
	if(process.platform != 'darwin') {
		app.quit()
	}
})
