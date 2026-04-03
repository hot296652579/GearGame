pipeline {
    agent any
    environment {
        COCOS_EXE = "C:\\ProgramData\\cocos\\editors\\Creator\\3.8.2\\CocosCreator.exe"
        PROJECT_PATH = "C:\\Users\\dev\\.jenkins\\workspace\\GearGame"
        DEPLOY_DIR = "D:\\http_cocos_web"
        WEB_URL = "http://192.168.1.43:8081/"
    }

    stages {
        stage('1. 拉取最新代码') {
            steps {
                echo '=== 自动拉取 GitHub 最新代码 ==='
                dir("${PROJECT_PATH}") {
                    bat '''
                        git fetch --all
                        git reset --hard origin/main
                        git clean -fd
                    '''
                }
            }
        }

        stage('2. Cocos 自动构建') {
            steps {
                dir("${PROJECT_PATH}") {
                    bat "\"${COCOS_EXE}\" --project . --build \"platform=web-desktop;debug=false\" || true"
                }
            }
        }

        stage('3. 部署到 Web 服务器') {
            steps {
                echo '=== 覆盖部署文件（不报错） ==='
                bat "xcopy /E /R /H /Y \"${PROJECT_PATH}\\build\\web-desktop\\*\" \"${DEPLOY_DIR}\\\""
            }
        }
    }

    post {
        success {
            echo '=================================================='
            echo '✅ 自动构建 + 自动部署 完成！'
            echo '🌐 访问地址：' + "${WEB_URL}"
            echo '=================================================='
            bat "start ${WEB_URL}"
        }
        failure {
            echo '❌ 构建失败'
        }
    }
}