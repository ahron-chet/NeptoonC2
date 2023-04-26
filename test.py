from FlascAplication.test.mainApp import FlskSevrev

if __name__ == '__main__':
    flsk = FlskSevrev()
    flsk.app.run('0.0.0.0',5000)