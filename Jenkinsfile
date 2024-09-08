pipeline {
    agent any

    environment {
        SONAR_URL = 'http://172.18.0.5:9000'
        SONARQUBE_TOKEN = credentials('sonar-token')
        NEXUS_URL = 'http://172.18.0.4:8081'
        NEXUS_CREDENTIALS = credentials('nexus-credentials')
        KUBERNETES_NAMESPACE = 'default'
        DOCKER_IMAGE = 'backend-base-devops'
        DOCKER_TAG = 'latest'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests with Coverage') {
            steps {
                sh 'npm test -- --coverage'
            }
            post {
                always {
                    node {
                        junit 'coverage/*.xml'
                        cobertura coberturaReportFile: 'coverage/lcov.info'
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'npm run sonar-scanner'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    timeout(time: 1, unit: 'HOURS') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .'
            }
        }

        stage('Push to Nexus') {
            steps {
                script {
                    docker.withRegistry("${NEXUS_URL}", "${NEXUS_CREDENTIALS}") {
                        sh 'docker push ${DOCKER_IMAGE}:${DOCKER_TAG}'
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl set image deployment/backend-deployment backend=${DOCKER_IMAGE}:${DOCKER_TAG} --namespace=${KUBERNETES_NAMESPACE}'
            }
        }
    }

    post {
        always {
            node {
                cleanWs()  // Limpieza del workspace dentro de un contexto de nodo
            }
        }
    }
}
