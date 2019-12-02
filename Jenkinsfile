pipeline {
    agent any
    stages {
        stage('Build') {
            agent {
                docker { 
                    image 'node:10.16.2-stretch-slim'
                    args '-v /root/.npm:/root/.npm'
                }                
            }
            steps {
                sh 'npm install'
                sh 'npm run development'
            }
        }
        stage('Deploy dev') {
            steps {
                sh 'chmod +x deploy.sh'
                sh """./deploy.sh dev ${env.BUILD_NUMBER}"""
            }
        }
    }
}