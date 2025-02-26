pipeline {
    agent any

    tools {
        nodejs 'node22'
    }

    environment {
        scannerHome = tool 'sonarqube'
    }

    stages {

        stage('Step 1: Prepare') {
            steps {
                prepare_stage()
            }
        }

        stage('Step 2: Unit test') {
            steps {
                test_stage()
            }
        }

        stage('Step 3: SonarQube Scanner') {
            steps {
                sonarqube_stage()
            }
        }

        stage('Step 4: Build artifact') {
            steps {
                make_artifact_stage()
            }
        }

        stage('Step 5: Deployment') {
            steps {
                deploy_stage()
            }
        }
    }
}

def prepare_stage() {
    echo 'Preparing...'
    def props = readJSON file: 'package.json'
    echo "App Version: ${props.version}"
    env['IMAGE_REPO'] = "${props.name}"
    env['TAG'] = "${props.version}"
    echo 'Prepare completed'
}

def test_stage() {
    echo 'Testing...'
    sh 'npm install --ignore-platform'
    // sh "npm run test:ci"
    echo 'Test completed'
}

def sonarqube_stage() {
    echo 'Code scanning...'
    withSonarQubeEnv('sonarqube') {
        sh "echo ${scannerHome}"
      //  sh "${scannerHome}/bin/sonar-scanner -X"
    }
    echo 'Scanned'
}

def make_artifact_stage() {
    echo "build..."
    sh 'npm run build'
    sh 'chmod 777 Dockerfile'
    sh "docker build -t ${IMAGE_REPO}:${TAG} ."
    echo 'Artifacts are ready'
}

def deploy_stage() {
    echo "deploying..."
    sh 'docker-compose up -d'
    echo 'Deployment completed'
}